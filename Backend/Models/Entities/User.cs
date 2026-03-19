using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Entities
{
    public class User
    {
        //PK
        public int UserId { get; set; }

        //Fields
        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        public required string Email { get; set; }

        public required string PwHashed { get; set; }

        public DateTime DateOfBirth { get; set; }

        public DateTime CreatedAt { get; set; }

        public required bool EmailVerified { get; set; }

        public DateTime? PwChangedAt { get; set; }

    }
}