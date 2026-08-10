using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs
{
    public class ContactMessageDTO
    {
        [Required, MaxLength(50)]
        public required string Name { get; set; }

        [Required, EmailAddress, MaxLength(60)]
        public required string Email { get; set; }

        [Required, MinLength(180), MaxLength(450)]
        public required string Message { get; set; }
    }
}