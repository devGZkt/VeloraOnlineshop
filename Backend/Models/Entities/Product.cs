using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Entities
{
    public class Product
    {
        [Key]
        [Required]
        public int ProductId { get; set; }
        
        //FKs
        [ForeignKey(nameof(CategoryId))]
        public required Category CategoryId { get; set; }

        //Fields
        [Required]
        public required string Name { get; set; }
    }
}