using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : CotrollerBase
{
    private readonly IStripeClient _stripeClient;

    public PaymentController(IStripeClient stripeClient)
    {
        _stripeClient = stripeClient;
    }

    [HttpPost("create-checkout-session")]
    public async Task<IActionResult> CreateCheckoutSession(
        [FromBody] CheckoutSessionCreateOptions options
    )
    {
        var options = new SessionCreateOptions { PaymentMethodTypes = new List<string> { "card" } };
    }
}
