
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models.Entities;

namespace Backend.Models.Entities
{
    public class Order
    {
        //PK
        public int OrderId { get; set; }

        //FKs
        public required int UserId { get; set; }
        public required virtual User User {  get; set; }
        public required int AddressId { get; set; }
        public required virtual Address Adress { get; set; }

        //Fields
        public string? Type { get; set; }
        public required string Street { get; set; } 
        public required string HouseNr { get; set; }
        public required string Location { get; set; }
        public required string ZipCode { get; set; }
        public DateTime AddressCreatedAt { get; set; }
    }
}