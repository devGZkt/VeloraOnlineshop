using System.Security.Claims;
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
        /// Direct order creation without verified payment is disallowed.
        /// </summary>
        [HttpPost("create-order")]
        public async Task<IActionResult> SetOrderAsync([FromBody] CreateOrderRequest createOrderRequest)
        {
            await Task.Yield();
            return BadRequest("Direct order creation without verified payment is not permitted. Please complete checkout via Stripe.");
        }

        /// <summary>
        /// Returns all orders placed by the currently authenticated user.
        /// </summary>
        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            var idClaim =
                User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)
                ?? User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out var userId))
            {
                return Unauthorized();
            }

            var orders = await _db
                .Orders.Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.OrderId,
                    o.OrderDate,
                    o.Type,
                    o.Street,
                    o.HouseNr,
                    o.City,
                    o.ZipCode,
                    Items = o.OrderItems.Select(od => new
                    {
                        od.ProductId,
                        ProductName = od.Product.Name,
                        od.Quantity,
                        od.UnitPrice,
                    }),
                    Total = o.OrderItems.Sum(od => od.UnitPrice * od.Quantity),
                })
                .ToListAsync();

            return Ok(orders);
        }
    }
}