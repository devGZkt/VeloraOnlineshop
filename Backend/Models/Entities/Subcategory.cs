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

        //Fields
        public string? Slug { get; set; }

        public required bool Active { get; set; }

        public string? Description { get; set; }
    }
}