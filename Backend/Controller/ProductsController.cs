using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


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
            //Searches db for products with given productId
            var foundProduct = _db.Products.FirstOrDefault(p => p.ProductId == id);

            //return null if id not found
            if (foundProduct == null)
            {
                return NotFound("id does not exist");
            }

            //Returns product when found
            return Ok(foundProduct);
        }



        //returns list of all products in db, with optional query parameters for categoryId, minPrice and maxPrice
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] int? categordyId, [FromQuery] int? minPrice, [FromQuery] int? maxPrice)
        {
            //IQueryable to build query on
            var query = _db.Products.AsQueryable();


            //Searches db for products with given categoryId, minPrice and maxPrice
            if (categordyId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categordyId);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice);
            }
            

            var products = await query.ToListAsync();
            return Ok(products);
        }
        
    }
}

