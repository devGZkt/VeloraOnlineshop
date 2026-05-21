using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly VeloraDbContext? _db;
        public CategoryController(VeloraDbContext? db)
        {
            _db = db;
        }


        [HttpGet]
        public async Task<IActionResult> GetSubCategories([FromQuery] string? categorySlug)
        {
            var query = _db.Subcategories.AsNoTracking();

            if (categorySlug.HasValue)
            {
                query = query.Where(s => s.CategorySlug == categorySlug);
            }

            var result = await query.ToListAsync();
            return Ok(result);
        }

    }
}
