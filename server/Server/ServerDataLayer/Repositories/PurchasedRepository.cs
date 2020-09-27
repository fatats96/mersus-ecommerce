using ServerTypeLayer;
using ServerTypeLayer.Models;
using System.Collections.Generic;
using System.Linq;

namespace ServerDataLayer.Repositories
{
    public class PurchasedRepository
    {
        public SessionContext Session;

        public List<BasketProductObject> GetPurchasedProducts(Basket parameters)
        {
            using (var context = ContextHelper.GetContext())
            {
                var basket = new List<Basket>();
                int userId = parameters.UserId == 0 ? 0 : Session.CurrentUser.UserId;
                if (userId == 0) { 
                    basket = context.Baskets
                        .Where(b => b.Status == 2)
                        .ToList();
                }
                else { 
                    basket = context.Baskets
                        .Where(b => b.UserId == userId && b.Status == 2)
                        .ToList();
                }
                if (basket == null)
                    return null;
                List<BasketProductObject> basketProducts = new List<BasketProductObject>();
                foreach (var b in basket)
                {
                    basketProducts.AddRange(b.BasketProduct);
                }
                return basketProducts;
            }
        }
    }
}
