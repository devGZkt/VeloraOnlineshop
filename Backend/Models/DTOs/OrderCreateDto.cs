namespace Backend.Models.DTOs
{
    public class CreateOrderRequest
    {
        public int CustomerId { get; set; }
        public required List<OrderItemDto> Items { get; set; }
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }

    }
}
