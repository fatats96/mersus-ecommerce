using System.Linq;
using ServerTypeLayer;
using ServerTypeLayer.Models;

namespace ServerDataLayer.Repositories
{
    public class AuthenticationRepository
    {
        public User Login(LoggedInUser request)
        {
            using (var DbContext = ContextHelper.GetContext())
            {
                User loggedInUser = DbContext.Users
                    .Where(user => user.Email == request.Email
                        && user.UserPassword == request.Password
                        && user.Status == 1)
                    .FirstOrDefault();
                if (loggedInUser != null)
                {
                    loggedInUser.UserPassword = "";
                    return loggedInUser;
                } else
                {
                    return null;
                }
            }
        }
    }
}
