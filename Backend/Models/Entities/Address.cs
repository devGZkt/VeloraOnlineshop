using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Entities
{
    public class Address
    {
        //PK
        public required int AddressId { get; set; }
        
        //FKs
        public required int UserId { get; set; }
        public required virtual User User {  get; set; }

        //Fields
        public string? Type { get; set; }
        
        public required string Street { get; set; }

        public required string HouseNr { get; set; }

        public required string City { get; set; }

        public required string ZipCode { get; set; }

        public required DateTime AddressCreatedAt { get; set; }
    }
}