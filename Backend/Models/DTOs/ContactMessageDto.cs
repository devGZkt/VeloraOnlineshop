namespace Backend.Models.DTOs
{
    public class ContactMessageDTO
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Message { get; set; }
    }
}