using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly VeloraDbContext _db;
        public CategoryController(VeloraDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _db.Categories
                .Where(c => c.Active)
                .Include(c => c.Subcategories)
                .Select(c => new
                {
                    c.CategoryId,
                    c.Slug,
                    c.Description,
                    Subcategories = c.Subcategories
                        .Where(s => s.Active)
                        .Select(s => new
                        {
                            s.SubcategoryId,
                            s.Slug,
                            s.Description
                        })
                })
                .ToListAsync();

            return Ok(categories);
        }

        [HttpPost("create-category")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto newCategory )
        {
            throw new NotImplementedException();
        }
    }
}
