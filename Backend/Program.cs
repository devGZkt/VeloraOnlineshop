using Backend.Services;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<VeloraDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevProxyPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.MapGet("test-db", () =>
{
    using var scope = app.Services.CreateScope();
    VeloraDbContext db = scope.ServiceProvider.GetRequiredService<VeloraDbContext>();
    db.Database.EnsureCreated();
    
});

if (app.Environment.IsDevelopment())
{
}

app.MapControllers();

app.UseHttpsRedirection();

app.UseCors("DevProxyPolicy");

app.Run();