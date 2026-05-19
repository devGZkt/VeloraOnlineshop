using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMessageController : ControllerBase
    {
        public readonly VeloraDbContext _db;

        public UserMessageController(VeloraDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage([FromBody] ContactMessageDTO messageDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(messageDto);
            }

            if (string.IsNullOrWhiteSpace(messageDto.Name) || string.IsNullOrWhiteSpace(messageDto.Email) || string.IsNullOrWhiteSpace(messageDto.Message) || messageDto.Name.Length > 50 || messageDto.Email.Length > 60 || messageDto.Message.Length > 450)
            {
                return BadRequest("Required fields are missing or too messages too long.");
            }

            var newMessage = new ContactMessage
            {
                Name = messageDto.Name.Trim(),
                Email = messageDto.Email.Trim(),
                Message = messageDto.Message.Trim()
            };

            _db.ContactMessages.Add(newMessage);
            await _db.SaveChangesAsync();

            return Ok("Message sent successfully");
        }
    }
}