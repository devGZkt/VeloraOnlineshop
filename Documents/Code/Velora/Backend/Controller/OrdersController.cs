using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly VeloraDbContext _db;

        public OrdersController(VeloraDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Endpoint to create a new order.
        /// </summary>
        [HttpPost("create-order")]
        public async Task<IActionResult> SetOrderAsync([FromBody] CreateOrderRequest createOrderRequest)
        {
            // Validates request body and returns 400 if invalid
            if (createOrderRequest == null || createOrderRequest.Items == null || createOrderRequest.Items.Count == 0)
            {
                return BadRequest("Invalid order request.");
            }

            // Searches for user in db
            var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == createOrderRequest.CustomerId);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            // Get all product IDs from the request to fetch them in one single database call (Performance optimization)
            var productIds = createOrderRequest.Items.Select(i => i.ProductId).ToList();
            var availableProducts = await _db.Products
                .Where(p => productIds.Contains(p.ProductId))
                .ToListAsync();

            // If no valid products were found in the database, return 400
            if (availableProducts.Count == 0)
            {
                return BadRequest("No valid products found in the order.");
            }

            // Start a transaction to ensure data integrity
            using var transaction = await _db.Database.BeginTransactionAsync();

            try
            {
                // Creates new address entity from order request
                var address = new Address
                {
                    AddressId = 0,
                    UserId = createOrderRequest.CustomerId,
                    User = user,
                    Type = createOrderRequest.AddressType ?? "Shipping",
                    AddressCreatedAt = DateTime.UtcNow,
                    Street = createOrderRequest.Street,
                    HouseNr = createOrderRequest.HouseNr,
                    City = createOrderRequest.City,
                    ZipCode = createOrderRequest.ZipCode
                };

                _db.Addresses.Add(address);
                await _db.SaveChangesAsync();

                // Creates new order entity
                var order = new Order
                {
                    UserId = createOrderRequest.CustomerId,
                    User = user,
                    AddressId = address.AddressId,
                    Adress = address,
                    OrderDate = DateTime.UtcNow,
                    Street = createOrderRequest.Street,
                    HouseNr = createOrderRequest.HouseNr,
                    City = createOrderRequest.City,
                    ZipCode = createOrderRequest.ZipCode
                };

                _db.Orders.Add(order);
                await _db.SaveChangesAsync();

                // Creates order details using the products fetched earlier
                var orderDetails = createOrderRequest.Items
                    .Select(item => {
                        var product = availableProducts.FirstOrDefault(p => p.ProductId == item.ProductId);
                        if (product == null) return null;

                        return new OrderDetail
                        {
                            OrderId = order.OrderId,
                            Order = order,
                            ProductId = product.ProductId,
                            Product = product,
                            Quantity = item.Quantity,
                            UnitPrice = product.Price
                        };
                    })
                    .Where(detail => detail != null)
                    .ToList();

                _db.OrderDetails.AddRange(orderDetails);
                await _db.SaveChangesAsync();

                // Commit the transaction if everything succeeded
                await transaction.CommitAsync();

                return Ok("Order created successfully.");
            }
            catch (Exception ex)
            {
                // Rollback changes if any error occurs during the process
                await transaction.RollbackAsync();
                Debug.WriteLine($"Error creating order: {ex.Message}");
                return StatusCode(500, "An error occurred while processing the order.");
            }
        }
    }
}