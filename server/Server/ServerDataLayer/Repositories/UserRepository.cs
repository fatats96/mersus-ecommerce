using System;
using System.Collections.Generic;
using System.Linq;
using ServerDataLayer.Common;
using ServerDataLayer.Entity;
using ServerTypeLayer.Models;

namespace ServerDataLayer.Repositories
{
    public class UserRepository : IBaseRepository<User>
    {

        public List<User> ListAll(User parameters)
        {
            using (ECommerceContext context = ContextHelper.GetContext())
            {
                List<User> users = context.Users
                    .ToList();
                return users;
            }
            throw new NotImplementedException();
        }


        public User GetById(User parameters)
        {
            using (ECommerceContext context = ContextHelper.GetContext())
            {
                User user = context.Users
                    .Where(u => u.UserId == parameters.UserId && u.Status != -1)
                    .FirstOrDefault();
                user.UserPassword = string.Empty;
                return user;
            }
        }

        public User GetByKey(User parameters)
        {
            throw new NotImplementedException();
        }

        public User Save(User parameters)
        {
            throw new NotImplementedException();
        }

        public Boolean Delete(User parameters)
        {
            throw new NotImplementedException();
        }
    }
}
