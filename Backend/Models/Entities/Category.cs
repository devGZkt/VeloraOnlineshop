using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Entities
{

    public class Category
    {
        public required int CategoryId { get; set; } //PK


        //Fields
        public string? Slug { get; set; }

        public required bool Active { get; set; }

        public string? Description { get; set; }

        public required int DisplayOrder  { get; set; }
    }
}