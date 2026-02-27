using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Entities
{

    enum AdressType
    {
        Billing, Shipping, Private, Work
    }

    public class Address
    {
        [Key]
        [Required]
        public required int AdressId { get; set; }
        
        //FKs
        [ForeignKey(nameof(UserId))]
        public required User UserId { get; set; }

        //Fields
        [Required]
        public required string Type { get; set; }
        
        [Required]
        [MaxLength(50)]
        public required string Street { get; set; }

        [Required]
        [MaxLength(10)]
        public required string HourNr { get; set; }

        [Required]
        [MaxLength(50)]
        public required string City { get; set; }

        [Required]
        [MaxLength(50)]
        public required string ZipCode { get; set; }

        [Required]
        public required DateTime AddressCreatedAt { get; set; }
    }
}