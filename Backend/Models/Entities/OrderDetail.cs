using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Entities
{
    public class OrderDetail
    {
        [Key]
        [Required]
        public int OrderDetailId { get; set; }

        //Fields
        [Required]
        public required int Quantity { get; set; }

        [Required]
        public required decimal UnitPrice { get; set; }
    }
}