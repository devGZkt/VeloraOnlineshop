using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller
{
    /// <summary>
    /// Controller-Class to create user and login user
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly VeloraDbContext _db;
        private readonly AuthService _authService;

        public UserController(VeloraDbContext db, AuthService authService)
        {
            _db = db;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> CreateUser([FromBody] UserRegisterDTO registerDto)
        {
            //Check if data in object is valid type else returns 4xx
            if (!ModelState.IsValid)
            {
                return BadRequest(registerDto);
            }

            bool exists = await _db.Users.AnyAsync(u => u.Email == registerDto.Email);

            if (exists)
            {
                return BadRequest("Email allready exists. Please log in or choose another email.");
            }

            //Creates new User object entity from UserRegsiterDTO
            var newUser = new User
            {
                UserId = 0,
                FirstName = registerDto.FirstName.Trim(),
                LastName = registerDto.LastName.Trim(),
                Email = registerDto.Email.Trim(),
                PwHashed = BCrypt.Net.BCrypt.HashPassword(registerDto.Pw),
                DateOfBirth = registerDto.DateOfBrith,
                CreatedAt = DateTime.UtcNow,
                EmailVerified = false,
            };

            //Creates new record for user in db, saves it and returns 201
            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();
            return Created();
        }

        // Checks userlogindata (pw and email/username) and returns token if valid
        [HttpPost("login")]
        public async Task<IActionResult> CheckUserLogin([FromBody] UserLoginDTO existingUser)
        {
            //Picks out username and pw form User-object
            var username = existingUser.Email;
            var pw = existingUser.Pw;

            //Checks if in User-model are valid else returns (400)
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid userdata");
            }

            //checks if username and pw are valid
            var result = await _authService.AuthenticateAsync(username, pw);

            //Returns 401 if username not found or pw invalid
            if (result == null)
            {
                return Unauthorized("Invalid username or password");
            }

            //Perpares cookie-options (rules of cookie for browser)
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, //sends via HTTPS
                SameSite = SameSiteMode.Strict, //Only stores if request comes from valid domain
                Expires = DateTime.UtcNow.AddHours(4),
            };

            //Token gets added as header for browser
            Response.Cookies.Append("jwt_token", result, cookieOptions);

            //returns response ok (200) with token in header
            return Ok(new { message = "Login sucessfull" });
        }
    }
}
