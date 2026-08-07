namespace Backend.Models.DTOs
{
    public class CheckoutRequestDto
    {
        public int CustomerId { get; set; }
        public string? AddressType { get; set; }
        public string? Street { get; set; }
        public string? HouseNr { get; set; }
        public string? City { get; set; }
        public string? ZipCode { get; set; }
        public string? SuccessUrl { get; set; }
        public string? CancelUrl { get; set; }
        public List<CheckoutItemDto> Items { get; set; } = new();
    }

    public class CheckoutItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class PaymentConfirmDto
    {
        public string? SessionId { get; set; }
        public string? PaymentIntentId { get; set; }
        public int CustomerId { get; set; }
        public string? AddressType { get; set; }
        public string? Street { get; set; }
        public string? HouseNr { get; set; }
        public string? City { get; set; }
        public string? ZipCode { get; set; }
        public List<CheckoutItemDto>? Items { get; set; }
    }
}
