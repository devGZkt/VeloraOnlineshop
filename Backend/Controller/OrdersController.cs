using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController
    {
        private readonly VeloraDbContext _db;

        public OrdersController(VeloraDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Endpoint to create new order.  
        /// </summary>
        [HttpPost("create-order")]
        public async Task<IActionResult> SetOrderAsync([FromBody] CreateOrderRequest createOrderRequest)
        {
            // validates request bodzy and returns 400 if invalid
            if(createOrderRequest == null || createOrderRequest.Items == null || createOrderRequest.Items.Count == 0)
            {
                return new BadRequestObjectResult("Invalid order request.");
            }

            // creates list for products
            List<Product> orderItems = [];

            // loop to find items in db and add them to orderItems list if item was found. 
            createOrderRequest.Items.ForEach(item =>
            {
                var product = _db.Products.FirstOrDefault(p => p.ProductId == item.ProductId);
                if (product != null)
                {
                    orderItems.Add(product);
                }
            });

            // if no valid products were found in the order, return 400 
            if(orderItems.Count == 0)
            {
                return new BadRequestObjectResult("No valid products found in the order.");
            }

            // searches for user in db
            var user = _db.Users.FirstOrDefault(u => u.UserId == createOrderRequest.CustomerId);
            if (user == null)
            {
                return new BadRequestObjectResult("User not found.");
            }

            // creates new address entity from order request
            var address = new Address
            {
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

            // creates new order entity with orderDetail
            var order = new Order
            {
                UserId = createOrderRequest.CustomerId,
                User = user,
                AddressId = address.AddressId,
                Adress = address,
                OrderDate = DateTime.UtcNow,
                OrderItems = createOrderRequest.Items.Select(item => new OrderDetail
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = orderItems.FirstOrDefault(p => p.ProductId == item.ProductId)?.Price ?? 0
                }).ToList()
            };
        }
    }
}
