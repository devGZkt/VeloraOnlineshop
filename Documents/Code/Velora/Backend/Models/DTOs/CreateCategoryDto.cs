namespace Backend.Models.DTOs
{
    public class CreateCategoryDto
    {
        public required string Slug { get; set; }
        public bool Active { get; set; }
        public int DisplayOrder { get; set; }
    }
}
