using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Entities
{
    [Index(nameof(DisplayOrder), IsUnique = true)]
    public class Category
    {
        [Key]
        [Required]
        public required int CategoryId { get; set; } //PK


        //Fields
        [MaxLength(50)]
        public string Slug { get; set; }

        [Required]
        public required bool Active { get; set; }

        [MaxLength(200)]
        public string? Description { get; set; }

        [Required]
        public required int DisplayOrder  { get; set; }
    }
}