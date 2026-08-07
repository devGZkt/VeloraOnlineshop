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
    }
}