using System.Diagnostics;
using System.Reflection;
using System.Text;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Stripe;

var builder = WebApplication.CreateBuilder(args);

var stripeSecretKey = builder.Configuration["Stripe:SecretKey"];

if (string.IsNullOrEmpty(stripeSecretKey))
{
    Console.WriteLine("Stripe Secret Key is not set in configuration.");
}

Console.WriteLine($"Stripe Secret Key: {stripeSecretKey}");

builder.Services.AddSingleton<IStripeClient>(new StripeClient(stripeSecretKey));

builder.Services.AddDbContext<VeloraDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddControllers();

builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        //Searches in Cookies for jwt_token because of HTTPSecure
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["jwt_token"];
                return Task.CompletedTask;
            },
        };

        //Stores appname for token validation
        var appName = Assembly.GetExecutingAssembly().GetName().Name;

        //Goes through list and checks if token valid
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("this_is_my_secrete_keyyyyy")
            ),
            ValidateIssuer = true,
            ValidIssuer = appName,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.AddScoped<AuthService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "DevProxyPolicy",
        policy =>
        {
            policy
                .SetIsOriginAllowed(_ => true)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    );
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<VeloraDbContext>();
    db.Database.Migrate();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("DevProxyPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
