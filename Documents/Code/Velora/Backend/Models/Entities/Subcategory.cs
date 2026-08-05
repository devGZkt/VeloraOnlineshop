using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Entities
{

    public class Subcategory
    {
        //PK
        public required int SubcategoryId { get; set; }

        //FKs
        public required int CategoryId { get; set; }
        public virtual Category Category { get; set; }

        //Fields
        public string? Slug { get; set; }

        public required bool Active { get; set; }

        public string? Description { get; set; }

        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}