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


        [HttpPost("create-order")]
        public async Task<IActionResult> SetOrderAsync([FromBody] Product product)
        {

        }
    }
}
