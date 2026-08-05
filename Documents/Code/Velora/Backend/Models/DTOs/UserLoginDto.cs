using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs
{
    /// <summary>
    /// Data Transfer Object for Userlogin
    /// </summary>
    public class UserLoginDTO
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [MinLength(5)]
        public required string Pw { get; set; }
    }
}
