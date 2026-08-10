using Backend.Models.DTOs;
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
        [HttpGet("{id}", Name = "GetProductById")]
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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProduct([FromBody] ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subcategory = await _db.Subcategories.FindAsync(productDto.SubcategoryId);
            if (subcategory == null)
            {
                return BadRequest("Subcategory does not exist.");
            }

            var product = new Product
            {
                Subcategory = subcategory,
                Name = productDto.Name,
                Sku = productDto.Sku,
                Slug = productDto.Slug,
                ShortDescription = productDto.ShortDescription,
                LongDescription = productDto.LongDescription,
                Price = productDto.Price,
                IsVisible = productDto.IsVisible,
                DisplayOrder = productDto.DisplayOrder,
            };

            _db.Products.Add(product);
            await _db.SaveChangesAsync();
            return CreatedAtRoute("GetProductById", new { id = product.ProductId }, product);
        }

        //Route to update an existing product
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _db.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound("id does not exist");
            }

            var subcategoryExists = await _db.Subcategories.AnyAsync(s => s.SubcategoryId == productDto.SubcategoryId);
            if (!subcategoryExists)
            {
                return BadRequest("Subcategory does not exist.");
            }

            product.SubcategoryId = productDto.SubcategoryId;
            product.Name = productDto.Name;
            product.Sku = productDto.Sku;
            product.Slug = productDto.Slug;
            product.ShortDescription = productDto.ShortDescription;
            product.LongDescription = productDto.LongDescription;
            product.Price = productDto.Price;
            product.IsVisible = productDto.IsVisible;
            product.DisplayOrder = productDto.DisplayOrder;

            await _db.SaveChangesAsync();
            return Ok(product);
        }

        //Route to delete a product
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound("id does not exist");
            }

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}

