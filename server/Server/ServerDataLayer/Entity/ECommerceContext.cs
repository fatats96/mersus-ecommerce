using ServerTypeLayer.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace ServerDataLayer.Entity
{
    public class ECommerceContext : DbContext
    {
        public ECommerceContext()
        {
        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Basket> Baskets { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            builder.UseSqlServer(@"Server=.;Database=ECommerceDb;Trusted_Connection=True;");
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Basket>(e => {
                e.Property(x => x.BasketProduct)
                .HasColumnName("basketProduct")
                .HasConversion(
                    c => JsonConvert.SerializeObject(c),
                    c => JsonConvert.DeserializeObject<List<BasketProductObject>>(c)
                );
            });

            builder.Entity<Category>(e => {
                e.HasMany(x => x.Products)
                .WithOne(t => t.Category);
            });

            builder.Entity<User>(e => {
                e.HasIndex(p => p.Email)
                    .IsUnique();
            });

            builder.Entity<User>().HasData(new User {
                UserId = 1,
                UserIdNo = "12345678901",
                Status = 1,
                Email = "admin@test.com",
                UserAddress = "adres",
                UserName = "admin",
                UserPassword = "123456",
                UserPhoneNumber = "123123123",
                UserSurname = "test",
                UserType = "admin",
            }, new User
            {
                UserId = 2,
                UserIdNo = "12345678911",
                Status = 1,
                Email = "musteri@test.com",
                UserAddress = "adres",
                UserName = "muster",
                UserPassword = "123456",
                UserPhoneNumber = "123123123",
                UserSurname = "test",
                UserType = "normaluser",
            });
        }

        public override int SaveChanges()
        {
            return base.SaveChanges();
        }
    }
}
