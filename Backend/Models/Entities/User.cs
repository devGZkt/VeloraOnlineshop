using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Entities
{
    public class User
    {
        [Key]
        [Required]
        public required int UserId { get; set; }

        //Fields
        [Required]
        [MaxLength(50)]
        public required string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public required string Email { get; set; }

        [MaxLength(255)]
        public string? PwHashed { get; set; }

        public DateTime DateOfBirth { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool EmailVerified { get; set; }

        public DateTime? PwChangedAt { get; set; }

    }
}