using Backend.Models.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
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
            var foundProduct = await _db.Products.FindAsync(id);

            //return null if id not found
            if (foundProduct == null)
            {
                return NotFound("id does not exist");
            }

            //Returns product when found
            return Ok(foundProduct);
        }



        /// <summary>
        /// returns list of all products in db, with optional query parameters for subcategoryId, minPrice and maxPrice
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] string? categorySlug, [FromQuery] string? subcategorySlug, [FromQuery] int? minPrice, [FromQuery] int? maxPrice)
        {
            // IQueryable to build query on
            var query = _db.Products.AsQueryable();

            // Filters
            if (!string.IsNullOrWhiteSpace(categorySlug))
            {
                query = query.Where(p => p.Subcategory.Category.Slug == categorySlug);
            }

            if (!string.IsNullOrWhiteSpace(subcategorySlug))
            {
                query = query.Where(p => p.Subcategory.Slug == subcategorySlug);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice);
            }
            
            // Execute query and return list
            var products = await query.ToListAsync();
            return Ok(products);
        }

        //Route to create a new product
        [HttpPost("create-product")]
        //[Authorize]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _db.Products.Add(product);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProductByIdAsync), new { id = product.ProductId }, product);
        }
    }
}

