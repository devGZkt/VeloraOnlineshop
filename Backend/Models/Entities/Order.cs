
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models.Entities;

namespace Velora.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        
        
        //FKs
        public required User UserId { get; set; }

        public required Address AddressId { get; set; }


        //Fields
        public string? Type { get; set; } //BillingAdress, PrivateAdress, BuisnessAdress...

        public required string Street { get; set; }

        public required string HouseNr { get; set; }

        public required string Location { get; set; }

        public required string ZipCode { get; set; }

        public DateTime AddressCreatedAt { get; set; }
    }
}