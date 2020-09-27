using System.Linq;
using System.Threading.Tasks;
using IdentityServer4.Validation;
using static IdentityModel.OidcConstants;
using ServerDataLayer;
using ServerDataLayer.Repositories;
using ServerTypeLayer.Models;


namespace IdentityServer
{
    public class ResourceOwnerPasswordValidator : IResourceOwnerPasswordValidator
    {
        private readonly UserRepository _userRepository = new UserRepository();

        public Task ValidateAsync(ResourceOwnerPasswordValidationContext context)
        {
            User user = ContextHelper.GetContext()
                .Set<User>()
                .FirstOrDefault(u => u.Email == context.UserName && u.UserPassword == context.Password);

            if (user == null)
            {
                context.Result = new GrantValidationResult(TokenErrors.InvalidRequest, "User name or  password is incorrect !");
                return Task.FromResult(0);
            }

            context.Result = new GrantValidationResult(user.UserId.ToString(), "password"); //,customResponse: new Dictionary<string, object> { { "claims" , "asd" } }
            return Task.FromResult(0);
        }
    }
}