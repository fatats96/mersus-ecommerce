using Microsoft.EntityFrameworkCore;
using ServerTypeLayer;
using ServerTypeLayer.Models;
using System;
using System.Linq;

namespace ServerDataLayer.Repositories
{
    public class BasketRepository
    {
        public SessionContext Session;

        public Basket GetBasket(Basket parameters)
        {
            using(var context = ContextHelper.GetContext())
            {
                var basket = context.Baskets
                    .Where(x => x.UserId == Session.CurrentUser.UserId && x.Status == 1).
                    FirstOrDefault();
                if (basket == null)
                    return null;

                return basket;
            }
        }

        public Basket AddItemToBasket(Basket parameters)
        {
            using (var context = ContextHelper.GetContext())
            {
                Product product = new Product();
                var basketProduct = parameters.BasketProduct[0];

                var basket = context.Baskets
                   .Where(x => x.BasketId == parameters.BasketId && x.UserId == Session.CurrentUser.UserId && x.Status == 1)
                   .FirstOrDefault();

                if (basket == null) {
                    parameters.Status = 1;
                    context.Baskets.Update(parameters);
                    product = context.Products.Find(basketProduct.ProductId);
                    if (product == null) return null;
                    if (product.ProductQuantity == 0 || product.ProductQuantity < basketProduct.ProductQuantity)
                        return null;
                    product.ProductQuantity -= basketProduct.ProductQuantity;
                    context.Products.Update(product);
                    context.SaveChanges();
                    return basket;
                };

                product = context.Products.Find(basketProduct.ProductId);

                if (product == null)
                    return null;

                if (product.ProductQuantity == 0 || product.ProductQuantity < basketProduct.ProductQuantity)
                    return null;

                product.ProductQuantity -= basketProduct.ProductQuantity;

                basket.BasketProduct.Add(basketProduct);
                basket.BasketCost += basketProduct.ProductQuantity * product.ProductPrice;
                context.Baskets.Update(basket);
                context.SaveChanges();
                return basket;

            }
        }

        public Basket RemoveItemFromBasket(Basket parameters)
        {
            using (var context = ContextHelper.GetContext())
            {
                var product = new Product();
                if (parameters.BasketProduct.Count == 0)
                {
                    Basket b = context.Baskets
                        .AsNoTracking()
                        .Where(x => x.BasketId == parameters.BasketId && x.UserId == Session.CurrentUser.UserId && x.Status == 1)
                        .FirstOrDefault();
                    if (b == null)
                        return null;
                    b.Status = -1;
                    context.Baskets.Update(parameters);
                    context.SaveChanges();
                    return b;
                }
                var basketProduct = parameters.BasketProduct[0] ?? new BasketProductObject();

                var basket = context.Baskets
                   .Where(x => x.BasketId == parameters.BasketId && x.UserId == Session.CurrentUser.UserId && x.Status == 1)
                   .FirstOrDefault();

                if(basket == null)
                    return null;
                
                var quantityMargin = basket.BasketProduct.
                    Find(x => x.ProductId == basketProduct.ProductId)
                    .ProductQuantity - basketProduct.ProductQuantity;

                basket.BasketProduct.
                    Find(x => x.ProductId == basketProduct.ProductId)
                    .ProductQuantity = basketProduct.ProductQuantity;

                product = context.Products.Find(basketProduct.ProductId);

                if (product == null)
                    return null;

                product.ProductQuantity += quantityMargin;

                basket.BasketProduct = parameters.BasketProduct;
                basket.BasketCost -= basketProduct.ProductQuantity * product.ProductPrice;
                basket.Status = -1;
                context.Baskets.Update(basket);
                context.SaveChanges();
                return basket;
            }
        }

        public Boolean ConfirmBasket(Basket parameters)
        {
            using (var context = ContextHelper.GetContext())
            {
                var product = new Product();

                var basket = context.Baskets
                   .Where(x => x.BasketId == parameters.BasketId && x.UserId == Session.CurrentUser.UserId && x.Status == 1)
                   .FirstOrDefault();

                if (basket == null)
                    return false;

                // confirmed and paid
                // onaylandı ve ödendi
                basket.Status = 2;
                
                context.Baskets.Update(basket);
                context.SaveChanges();
                return true;
            }
        }

    }
}
