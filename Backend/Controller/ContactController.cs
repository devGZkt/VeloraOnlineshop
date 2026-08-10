using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly VeloraDbContext _db;

        public ContactController(VeloraDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitMessage([FromBody] ContactMessageDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var message = new ContactMessage
            {
                Name = dto.Name.Trim(),
                Email = dto.Email.Trim(),
                Message = dto.Message.Trim(),
            };

            _db.ContactMessages.Add(message);
            await _db.SaveChangesAsync();

            return Created(string.Empty, new { message = "Message sent successfully." });
        }
    }
}
