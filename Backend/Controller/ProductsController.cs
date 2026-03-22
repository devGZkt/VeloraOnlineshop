using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly VeloraDbContext _db;
                                                                        
        public ProductsController(VeloraDbContext db)
        {
            _db = db;
        }


        //Function to Search Product throught ID
        [HttpGet("{id}")]
        public async Task<IActionResult?> GetProductByIdAsync(int id)
        {
            var foundProduct = _db.Products.FirstOrDefault(p => p.ProductId == id);

            //return null if id not found
            if (foundProduct == null)
            {
                return NotFound("id does not exist");
            }

            return Ok(foundProduct);
        }
    }
}
