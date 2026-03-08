using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Entities
{
    public class OrderDetail
    {
        //PK
        public int OrderDetailId { get; set; }

        //FKs
        public required Order OrderId { get; set; }
        public required Product ProductId { get; set; }

        //Fields
        public required int Quantity { get; set; }

        public required decimal UnitPrice { get; set; }
    }
}