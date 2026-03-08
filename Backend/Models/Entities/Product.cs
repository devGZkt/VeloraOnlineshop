using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Entities
{
    public class Product
    {
        //PK
        public int ProductId { get; set; }
        
        //FKs
        public Category? CategoryId { get; set; }

        //Fields
        public required string Name { get; set; }

        public string? Sku { get; set; }

        public string? Slug { get; set; }

        public string? ShortDescription { get; set; }

        public string? LongDescription { get; set; }

        public decimal Price { get; set; }

        public bool IsVisible { get; set; }
    }
}