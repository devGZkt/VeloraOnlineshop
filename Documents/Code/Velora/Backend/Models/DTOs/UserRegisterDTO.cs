namespace Backend.Models.DTOs
{
    /// <summary>
    /// Data Transfer Object to register new User
    /// </summary>

    public class UserRegisterDTO
    {
        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        public required string Email { get; set; }

        public required string Pw { get; set; }

        public DateTime DateOfBrith { get; set; }
    }
}
