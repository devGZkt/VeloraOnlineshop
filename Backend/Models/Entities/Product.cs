

namespace Backend.Models.Entities
{
    public class Product
    {
        //PK
        public int ProductId { get; set; }
        
        //FKs
        public int SubcategoryId { get; set; }
        public required virtual Subcategory Subcategory { get; set; }

        //Fields
        public required string Name { get; set; }

        public string? Sku { get; set; }

        public string? Slug { get; set; }

        public string? ShortDescription { get; set; }

        public string? LongDescription { get; set; }

        public decimal Price { get; set; }

        public bool IsVisible { get; set; }

        public int DisplayOrder { get; set; }
    }
}