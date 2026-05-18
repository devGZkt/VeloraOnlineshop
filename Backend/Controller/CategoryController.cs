using Backend.Models.DTOs;
using                Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController
    {
        private readonly VeloraDbContext? _db;
        public CategoryController(VeloraDbContext? db)
        {
            _db = db;
        }

        [HttpPost("create-cateogry")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto newCategory )
        {
            throw new NotImplementedException();
        }
    }
}
