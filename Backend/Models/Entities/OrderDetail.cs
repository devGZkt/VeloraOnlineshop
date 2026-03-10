using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Entities
{
    public class OrderDetail
    {
        //PK
        public int OrderDetailId { get; set; }

        //FKs
        public required int OrderId { get; set; }
        public required virtual Order Order { get; set; }
        public required int ProductId { get; set; }
        public required virtual Product Product { get; set; }

        //Fields
        public required int Quantity { get; set; }
        public required decimal UnitPrice { get; set; }
    }
}