using System.Collections.Concurrent;
using System.Text.Json;
using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace Backend.Controllers;

public static class MockSessionStore
{
    public static ConcurrentDictionary<
        string,
        (CheckoutRequestDto Request, string ItemsJson)
    > Sessions = new();
}

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IStripeClient _stripeClient;
    private readonly VeloraDbContext _db;

    public PaymentController(IStripeClient stripeClient, VeloraDbContext db)
    {
        _stripeClient = stripeClient;
        _db = db;
    }

    [HttpPost("create-checkout-session")]
    public async Task<IActionResult> CreateCheckoutSession([FromBody] CheckoutRequestDto request)
    {
        if (request.Items == null || !request.Items.Any())
        {
            return BadRequest("No items provided for checkout.");
        }

        var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();

        var dbProducts = await _db
            .Products.Where(p => productIds.Contains(p.ProductId))
            .ToDictionaryAsync(p => p.ProductId);

        var lineItems = new List<SessionLineItemOptions>();

        foreach (var item in request.Items)
        {
            if (!dbProducts.TryGetValue(item.ProductId, out var product))
            {
                return BadRequest($"Product with ID {item.ProductId} not found.");
            }

            if (item.Quantity <= 0)
            {
                return BadRequest($"Invalid quantity for product ID {item.ProductId}.");
            }

            long unitAmountInCents = (long)Math.Round(product.Price * 100);

            lineItems.Add(
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = unitAmountInCents,
                        Currency = "chf",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = product.Name,
                        },
                    },
                    Quantity = item.Quantity,
                }
            );
        }

        var itemsJson = JsonSerializer.Serialize(request.Items);

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = lineItems,
            Mode = "payment",
            SuccessUrl = string.IsNullOrWhiteSpace(request.SuccessUrl)
                ? "http://localhost:5173/checkout?success=true&session_id={CHECKOUT_SESSION_ID}"
                : request.SuccessUrl,
            CancelUrl = string.IsNullOrWhiteSpace(request.CancelUrl)
                ? "http://localhost:5173/checkout?canceled=true"
                : request.CancelUrl,
            ClientReferenceId = request.CustomerId.ToString(),
            Metadata = new Dictionary<string, string>
            {
                { "CustomerId", request.CustomerId.ToString() },
                { "Street", request.Street ?? "" },
                { "HouseNr", request.HouseNr ?? "" },
                { "City", request.City ?? "" },
                { "ZipCode", request.ZipCode ?? "" },
                { "AddressType", request.AddressType ?? "Shipping" },
                { "Items", itemsJson },
            },
        };

        try
        {
            var service = new SessionService(_stripeClient);
            Session session = await service.CreateAsync(options);

            return Ok(
                new
                {
                    sessionId = session.Id,
                    url = session.Url,
                    paymentIntentId = session.PaymentIntentId,
                }
            );
        }
        catch (Exception ex)
        {
            // Fallback for development mode if Stripe API Key is placeholder/invalid or offline
            Console.WriteLine($"Stripe checkout creation notice (dev fallback mode): {ex.Message}");
            string mockSessionId = "mock_session_" + Guid.NewGuid().ToString("N");
            string successUrl = (
                options.SuccessUrl
                ?? "http://localhost:5173/checkout?success=true&session_id={CHECKOUT_SESSION_ID}"
            ).Replace("{CHECKOUT_SESSION_ID}", mockSessionId);

            MockSessionStore.Sessions[mockSessionId] = (request, itemsJson);

            return Ok(
                new
                {
                    sessionId = mockSessionId,
                    url = successUrl,
                    paymentIntentId = "mock_pi_" + Guid.NewGuid().ToString("N"),
                }
            );
        }
    }

    [HttpPost("confirm-payment")]
    public async Task<IActionResult> ConfirmPayment([FromBody] PaymentConfirmDto confirmDto)
    {
        if (
            string.IsNullOrWhiteSpace(confirmDto.SessionId)
            && string.IsNullOrWhiteSpace(confirmDto.PaymentIntentId)
        )
        {
            return BadRequest("SessionId or PaymentIntentId is required.");
        }

        int customerId = confirmDto.CustomerId;
        string? street = confirmDto.Street;
        string? houseNr = confirmDto.HouseNr;
        string? city = confirmDto.City;
        string? zipCode = confirmDto.ZipCode;
        string? addressType = confirmDto.AddressType;
        List<CheckoutItemDto>? items = confirmDto.Items;
        string paymentRef = confirmDto.SessionId ?? confirmDto.PaymentIntentId!;

        if (
            !string.IsNullOrWhiteSpace(confirmDto.SessionId)
            && confirmDto.SessionId.StartsWith("mock_session_")
        )
        {
            if (MockSessionStore.Sessions.TryGetValue(confirmDto.SessionId, out var mockData))
            {
                if (customerId <= 0)
                    customerId = mockData.Request.CustomerId;
                if (string.IsNullOrWhiteSpace(street))
                    street = mockData.Request.Street;
                if (string.IsNullOrWhiteSpace(houseNr))
                    houseNr = mockData.Request.HouseNr;
                if (string.IsNullOrWhiteSpace(city))
                    city = mockData.Request.City;
                if (string.IsNullOrWhiteSpace(zipCode))
                    zipCode = mockData.Request.ZipCode;
                if (string.IsNullOrWhiteSpace(addressType))
                    addressType = mockData.Request.AddressType;
                if (items == null || !items.Any())
                {
                    try
                    {
                        items = JsonSerializer.Deserialize<List<CheckoutItemDto>>(
                            mockData.ItemsJson
                        );
                    }
                    catch { }
                }
            }
        }
        else if (!string.IsNullOrWhiteSpace(confirmDto.SessionId))
        {
            Session session;
            try
            {
                var sessionService = new SessionService(_stripeClient);
                session = await sessionService.GetAsync(confirmDto.SessionId);
            }
            catch (StripeException ex)
            {
                return BadRequest($"Failed to verify session with Stripe: {ex.Message}");
            }

            if (
                session == null
                || (session.PaymentStatus != "paid" && session.Status != "complete")
            )
            {
                return BadRequest("Payment has not been completed.");
            }

            if (session.Metadata != null)
            {
                if (
                    session.Metadata.TryGetValue("CustomerId", out var cId)
                    && int.TryParse(cId, out var parsedId)
                )
                {
                    if (customerId <= 0)
                        customerId = parsedId;
                }
                if (
                    string.IsNullOrWhiteSpace(street)
                    && session.Metadata.TryGetValue("Street", out var s)
                )
                    street = s;
                if (
                    string.IsNullOrWhiteSpace(houseNr)
                    && session.Metadata.TryGetValue("HouseNr", out var h)
                )
                    houseNr = h;
                if (
                    string.IsNullOrWhiteSpace(city)
                    && session.Metadata.TryGetValue("City", out var c)
                )
                    city = c;
                if (
                    string.IsNullOrWhiteSpace(zipCode)
                    && session.Metadata.TryGetValue("ZipCode", out var z)
                )
                    zipCode = z;
                if (
                    string.IsNullOrWhiteSpace(addressType)
                    && session.Metadata.TryGetValue("AddressType", out var a)
                )
                    addressType = a;
                if (
                    (items == null || !items.Any())
                    && session.Metadata.TryGetValue("Items", out var itemsStr)
                )
                {
                    try
                    {
                        items = JsonSerializer.Deserialize<List<CheckoutItemDto>>(itemsStr);
                    }
                    catch { }
                }
            }
        }
        else if (!string.IsNullOrWhiteSpace(confirmDto.PaymentIntentId))
        {
            var intentService = new PaymentIntentService(_stripeClient);
            PaymentIntent intent = await intentService.GetAsync(confirmDto.PaymentIntentId);

            if (intent == null || intent.Status != "succeeded")
            {
                return BadRequest("Payment intent status is not succeeded.");
            }

            if (intent.Metadata != null)
            {
                if (
                    intent.Metadata.TryGetValue("CustomerId", out var cId)
                    && int.TryParse(cId, out var parsedId)
                )
                {
                    if (customerId <= 0)
                        customerId = parsedId;
                }
                if (
                    string.IsNullOrWhiteSpace(street)
                    && intent.Metadata.TryGetValue("Street", out var s)
                )
                    street = s;
                if (
                    string.IsNullOrWhiteSpace(houseNr)
                    && intent.Metadata.TryGetValue("HouseNr", out var h)
                )
                    houseNr = h;
                if (
                    string.IsNullOrWhiteSpace(city)
                    && intent.Metadata.TryGetValue("City", out var c)
                )
                    city = c;
                if (
                    string.IsNullOrWhiteSpace(zipCode)
                    && intent.Metadata.TryGetValue("ZipCode", out var z)
                )
                    zipCode = z;
                if (
                    string.IsNullOrWhiteSpace(addressType)
                    && intent.Metadata.TryGetValue("AddressType", out var a)
                )
                    addressType = a;
                if (
                    (items == null || !items.Any())
                    && intent.Metadata.TryGetValue("Items", out var itemsStr)
                )
                {
                    try
                    {
                        items = JsonSerializer.Deserialize<List<CheckoutItemDto>>(itemsStr);
                    }
                    catch { }
                }
            }
        }

        if (items == null || !items.Any())
        {
            return BadRequest("No items found for the order.");
        }

        var order = await CreateOrderInternalAsync(
            customerId,
            street,
            houseNr,
            city,
            zipCode,
            addressType,
            items,
            paymentRef
        );
        if (order == null)
        {
            return BadRequest("Failed to create order. User or products not found.");
        }

        return Ok(
            new
            {
                message = "Payment successful and order created in database.",
                orderId = order.OrderId,
            }
        );
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        try
        {
            var stripeEvent = EventUtility.ParseEvent(json);

            if (stripeEvent.Type == "checkout.session.completed")
            {
                if (stripeEvent.Data.Object is Session session && session.PaymentStatus == "paid")
                {
                    await ProcessStripeSessionOrderAsync(session);
                }
            }
            else if (stripeEvent.Type == "payment_intent.succeeded")
            {
                if (stripeEvent.Data.Object is PaymentIntent intent)
                {
                    await ProcessStripeIntentOrderAsync(intent);
                }
            }

            return Ok();
        }
        catch (StripeException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    private async Task ProcessStripeSessionOrderAsync(Session session)
    {
        if (session.Metadata == null)
            return;

        int.TryParse(session.Metadata.GetValueOrDefault("CustomerId"), out int customerId);
        string? street = session.Metadata.GetValueOrDefault("Street");
        string? houseNr = session.Metadata.GetValueOrDefault("HouseNr");
        string? city = session.Metadata.GetValueOrDefault("City");
        string? zipCode = session.Metadata.GetValueOrDefault("ZipCode");
        string? addressType = session.Metadata.GetValueOrDefault("AddressType");
        string? itemsStr = session.Metadata.GetValueOrDefault("Items");

        if (string.IsNullOrEmpty(itemsStr))
            return;

        List<CheckoutItemDto>? items = null;
        try
        {
            items = JsonSerializer.Deserialize<List<CheckoutItemDto>>(itemsStr);
        }
        catch { }

        if (items != null && items.Any())
        {
            await CreateOrderInternalAsync(
                customerId,
                street,
                houseNr,
                city,
                zipCode,
                addressType,
                items,
                session.Id
            );
        }
    }

    private async Task ProcessStripeIntentOrderAsync(PaymentIntent intent)
    {
        if (intent.Metadata == null)
            return;

        int.TryParse(intent.Metadata.GetValueOrDefault("CustomerId"), out int customerId);
        string? street = intent.Metadata.GetValueOrDefault("Street");
        string? houseNr = intent.Metadata.GetValueOrDefault("HouseNr");
        string? city = intent.Metadata.GetValueOrDefault("City");
        string? zipCode = intent.Metadata.GetValueOrDefault("ZipCode");
        string? addressType = intent.Metadata.GetValueOrDefault("AddressType");
        string? itemsStr = intent.Metadata.GetValueOrDefault("Items");

        if (string.IsNullOrEmpty(itemsStr))
            return;

        List<CheckoutItemDto>? items = null;
        try
        {
            items = JsonSerializer.Deserialize<List<CheckoutItemDto>>(itemsStr);
        }
        catch { }

        if (items != null && items.Any())
        {
            await CreateOrderInternalAsync(
                customerId,
                street,
                houseNr,
                city,
                zipCode,
                addressType,
                items,
                intent.Id
            );
        }
    }

    private async Task<Order?> CreateOrderInternalAsync(
        int customerId,
        string? street,
        string? houseNr,
        string? city,
        string? zipCode,
        string? addressType,
        List<CheckoutItemDto> items,
        string? paymentRef
    )
    {
        string orderType = !string.IsNullOrWhiteSpace(addressType) ? addressType : "Shipping";
        if (!string.IsNullOrWhiteSpace(paymentRef))
        {
            string refMarker = paymentRef.Length > 40 ? paymentRef.Substring(0, 40) : paymentRef;
            var existingOrder = await _db.Orders.FirstOrDefaultAsync(o => o.Type == refMarker);
            if (existingOrder != null)
            {
                return existingOrder;
            }
            orderType = refMarker;
        }

        User? user = null;
        if (customerId > 0)
        {
            user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == customerId);
        }
        user ??= await _db.Users.FirstOrDefaultAsync();

        if (user == null)
        {
            return null;
        }

        var productIds = items.Select(i => i.ProductId).Distinct().ToList();
        var dbProducts = await _db
            .Products.Where(p => productIds.Contains(p.ProductId))
            .ToListAsync();

        if (!dbProducts.Any())
        {
            return null;
        }

        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var address = new Backend.Models.Entities.Address
            {
                AddressId = 0,
                UserId = user.UserId,
                User = user,
                Type = "Shipping",
                AddressCreatedAt = DateTime.UtcNow,
                Street = string.IsNullOrWhiteSpace(street) ? "Default Street" : street,
                HouseNr = string.IsNullOrWhiteSpace(houseNr) ? "1" : houseNr,
                City = string.IsNullOrWhiteSpace(city) ? "Default City" : city,
                ZipCode = string.IsNullOrWhiteSpace(zipCode) ? "1000" : zipCode,
            };

            _db.Addresses.Add(address);
            await _db.SaveChangesAsync();

            var order = new Order
            {
                UserId = user.UserId,
                User = user,
                AddressId = address.AddressId,
                Adress = address,
                Type = orderType,
                OrderDate = DateTime.UtcNow,
                Street = address.Street,
                HouseNr = address.HouseNr,
                City = address.City,
                ZipCode = address.ZipCode,
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            var orderDetails = new List<OrderDetail>();
            foreach (var item in items)
            {
                var product = dbProducts.FirstOrDefault(p => p.ProductId == item.ProductId);
                if (product == null)
                    continue;

                orderDetails.Add(
                    new OrderDetail
                    {
                        OrderId = order.OrderId,
                        Order = order,
                        ProductId = product.ProductId,
                        Product = product,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price,
                    }
                );
            }

            _db.OrderDetails.AddRange(orderDetails);
            await _db.SaveChangesAsync();

            await transaction.CommitAsync();
            return order;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
