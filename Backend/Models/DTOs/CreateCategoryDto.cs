namespace Backend.Models.DTOs
{
    public class CreateCategoryDto
    {
        public string Slug { get; set; }
        public bool Active { get; set; }
        public int DisplayOrder { get; set; }
    }
}
