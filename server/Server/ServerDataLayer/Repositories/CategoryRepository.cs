using ServerDataLayer.Common;
using ServerTypeLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ServerDataLayer.Repositories
{
    public class CategoryRepository : IBaseRepository<Category>
    {
        public Boolean Delete(Category parameters)
        {   
            using (var context = ContextHelper.GetContext())
            {
                var entity = context.Categories.Find(parameters.CategoryId);
                
                if (entity == null || entity.Status == -1)
                    return false;
         
                entity.Status = -1;
                context.Categories.Update(entity);
                context.SaveChanges();

                return true;
            }
        }

        public Category GetById(Category parameters)
        {
            using (var context = ContextHelper.GetContext())
            {
                var category = context.Categories
                    .Find(parameters.CategoryId);
                if (category == null || category.Status == -1)
                    return null;

                return category;
            }
        }
 
        public List<Category> ListAll(Category parameters)
        {
            using (var context = ContextHelper.GetContext())
            {
                var categories = context.Categories
                    .Where(c=> c.Status != -1)
                    .ToList();
                return categories;
            }
        }

        public Category Save(Category parameters)
        {
            using (var context = ContextHelper.GetContext())
            {
                context.Categories.Update(parameters);
                context.SaveChanges();
                return parameters;
            }
        }
    }
}
