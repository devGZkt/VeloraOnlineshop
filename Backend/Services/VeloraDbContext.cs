using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Backend.Services
{
	public class VeloraDbContext : DbContext
	{
		public VeloraDbContext(DbContextOptions<VeloraDbContext> options) : base(options)
		{
			SQLitePCL.Batteries.Init();
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

			// Address
			modelBuilder.Entity<Address>(entity =>
			{
				entity.HasKey(e => e.AddressId);

				entity.Property(e => e.Street).HasMaxLength(50).IsRequired();
				entity.Property(e => e.HouseNr).HasMaxLength(10).IsRequired();
				entity.Property(e => e.City).HasMaxLength(50).IsRequired();
				entity.Property(e => e.ZipCode).HasMaxLength(10).IsRequired();
				entity.Property(e => e.Type).HasMaxLength(50);

				entity.HasOne<User>()
					.WithMany()
					.HasForeignKey(e => e.UserId);
			});

			// Category
			modelBuilder.Entity<Category>(entity =>
			{
				entity.HasKey(e => e.CategoryId);

				entity.Property(e => e.Slug).HasMaxLength(50);
				entity.Property(e => e.Active).IsRequired();
				entity.Property(e => e.Description).HasMaxLength(200);
				entity.Property(e => e.DisplayOrder).IsRequired();

				entity.HasIndex(e => e.DisplayOrder).IsUnique();
			});

			// Order
			modelBuilder.Entity<Order>(entity =>
			{
				entity.HasKey(e => e.OrderId);

				entity.Property(e => e.Type).HasMaxLength(50).IsRequired();
				entity.Property(e => e.Street).HasMaxLength(50).IsRequired();
				entity.Property(e => e.HouseNr).HasMaxLength(10).IsRequired();
				entity.Property(e => e.Location).HasMaxLength(50).IsRequired();
				entity.Property(e => e.ZipCode).HasMaxLength(12).IsRequired();

				entity.HasOne<User>()
					.WithMany()
					.HasForeignKey(e => e.UserId)
					.IsRequired();

				entity.HasOne<Address>()
					.WithMany()
					.HasForeignKey(e => e.AddressId)
					.IsRequired();
			});

			// OrderDetail
			modelBuilder.Entity<OrderDetail>(entity =>
			{
				entity.HasKey(e => e.OrderDetailId);

				entity.Property(e => e.Quantity).IsRequired();
				entity.Property(e => e.UnitPrice).HasPrecision(18, 2).IsRequired();

				entity.HasOne<Order>()
					.WithMany()
					.HasForeignKey(e => e.OrderId)
					.IsRequired();

				entity.HasOne<Product>()
					.WithMany()
					.HasForeignKey(e => e.ProductId)
					.IsRequired();
			});

			// Product
			modelBuilder.Entity<Product>(entity =>
			{
				entity.HasKey(e => e.ProductId);

				entity.Property(e => e.Name).HasMaxLength(50);
				entity.Property(e => e.Sku).HasMaxLength(50);
				entity.Property(e => e.Slug).HasMaxLength(50);
				entity.Property(e => e.ShortDescription).HasMaxLength(500);
				entity.Property(e => e.Price).HasPrecision(18, 2).IsRequired();
				entity.Property(e => e.IsVisible).IsRequired();

				entity.HasOne<Category>()
					.WithMany()
					.HasForeignKey(e => e.CategoryId);
			});

			// User
			modelBuilder.Entity<User>(entity =>
			{
				entity.HasKey(e => e.UserId);

				entity.Property(e => e.Name).HasMaxLength(50).IsRequired();
				entity.Property(e => e.Email).HasMaxLength(50).IsRequired();
				entity.Property(e => e.PwHashed).HasMaxLength(255).IsRequired();
				entity.Property(e => e.CreatedAt).IsRequired();
			});
		}	
	}
}