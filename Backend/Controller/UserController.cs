using Backend.Models.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly VeloraDbContext _db;

        public UserController(VeloraDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody]User newUser)
        {
            if (newUser == null)
            {
                return NotFound();
            }

            
            bool exists = await _db.Users
                .AnyAsync(u => u.Email == newUser.Email);


            if (exists)
            {
                return BadRequest("Email allready exists. Please log in or choose another email.");
            }

            _ = newUser.Name.Trim();
            _ = newUser.Email.Trim();

            newUser.Name = System.Text.RegularExpressions.Regex.Replace(newUser.Name, @"\s+", " ");

            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();
            return Created();
        }
    }
}
