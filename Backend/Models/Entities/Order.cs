
using System.ComponentModel.DataAnnotations;

namespace Velora.Models
{
    public class Order
    {
        [Key]
        [Required]
        public int OrderId { get; set; }


        //Fields
        [MaxLength(50)]
        public string Type { get; set; } //BillingAdress, PrivateAdress, BuisnessAdress...

        [MaxLength(50)]
        public string Street { get; set; }

        [MaxLength(10)]
        public string HouseNr { get; set; }

        [MaxLength(50)]
        public string Location { get; set; }

        [MaxLength(12)]
        public string ZipCode { get; set; }

        public DateTime AddressCreatedAt { get; set; }
    }
}