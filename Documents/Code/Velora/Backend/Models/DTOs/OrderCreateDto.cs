namespace Backend.Models.DTOs
{
    public class CreateOrderRequest
    {
        public int CustomerId { get; set; }
        public required List<OrderItemDto> Items { get; set; }
        public string? AddressType { get; set; }
        public required string Street { get; set; } 
        public required string HouseNr { get; set; }
        public required string City { get; set; }
        public required string ZipCode { get; set; }

    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }

    }
}
