using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using Velora.Models;

public class VeloraDbContext : DbContext
{
	public VeloraDbContext(DbContextOptions<VeloraDbContext> options) : base(options)
	{
		
	}

	public DbSet<Address> Adresses { get; set; }
	public DbSet<Category> Categories { get; set; }
	public DbSet<Order> Orders { get; set; }
	public DbSet<OrderDetail> OrderDetails { get; set; }
	public DbSet<Product> Products { get; set; }
	public DbSet<User> Users { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		//Address
		modelBuilder.Entity<Address>(entity =>
		{
			
		});

		//Category
		modelBuilder.Entity<Category>(entity =>
		{

		});

		//Order
		modelBuilder.Entity<Order>(entity =>
		{

		});

		//OrderDetail
		modelBuilder.Entity<OrderDetail>(entity =>
		{
			entity.HasKey(e => e.OrderDetailId);

			entity.Property(e => e.Quantity)
				.IsRequired();

			entity.Property(e => e.UnitPrice)
				.IsRequired();
		});

		//Product
		modelBuilder.Entity<Product>(entity =>
		{
			entity.HasKey(e => e.ProductId);

			entity.Property(e => e.ProductId)
				.IsRequired();

			entity.Property(e => e.Name)
				.HasMaxLength(50);

			entity.Property(e => e.Sku)
				.HasMaxLength(50);

			entity.Property(e => e.Slug)
				.HasMaxLength(50);

			entity.Property(e => e.ShortDescription)
				.HasMaxLength(500);

			
		});

		//User
		modelBuilder.Entity<User>(entity =>
		{
			entity.HasKey(e => e.UserId);

			entity.Property(e => e.Name)
				.HasMaxLength(50)
				.IsRequired();

			entity.Property(e => e.Email)
				.HasMaxLength(50)
				.IsRequired();

			entity.Property(e => e.PwHashed)
				.HasMaxLength(255)
				.IsRequired();

			entity.Property(e => e.CreatedAt)
				.IsRequired();
		});

	}
	
}