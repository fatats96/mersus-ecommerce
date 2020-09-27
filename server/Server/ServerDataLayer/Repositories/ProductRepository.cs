using Microsoft.EntityFrameworkCore;
using ServerDataLayer.Common;
using ServerTypeLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ServerDataLayer.Repositories
{
    public class ProductRepository : IBaseRepository<Product>
    {
        public Boolean Delete(Product parameters)
        {
            using (var context = ContextHelper.GetContext())
            {
                var entity = context.Products.Find(parameters.ProductId);

                if (entity == null || entity.Status == -1)
                    return false;

                entity.Status = -1;
                context.Products.Update(entity);
                context.SaveChanges();

                return true;
            }
        }

        public Product GetById(Product parameters)
        {
            using (var context = ContextHelper.GetContext())
            {
                var product = context.Products
                    .Include(c => c.Category)
                    .Where(p =>
                        p.ProductId == parameters.ProductId &&
                        p.Status != -1
                    ).FirstOrDefault();
                return product;
            }
        }

        public List<Product> GetByCategoryId(Product parameters)
        {
            using (var context = ContextHelper.GetContext())
            {
                var products = context.Products
                    .Include(c => c.Category)
                    .Where(p => 
                        p.Category.CategoryId == parameters.Category.CategoryId &&
                        p.Status != -1
                    ).ToList();
                return products;
            }
        }


        public Product Save(Product parameters)
        {
            using (var context = ContextHelper.GetContext())
            {
                context.Products.Update(parameters);
                context.SaveChanges();
                return parameters;
            }
        }

        public List<Product> ListAll(Product parameters)
        {
            using (var context = ContextHelper.GetContext())
            {
                var products = context.Products
                    .Include(c => c.Category)
                    .Where(p => p.Status != -1)
                    .ToList();
                return products;
            }
        }

    }
}
