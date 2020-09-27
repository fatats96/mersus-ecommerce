using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using ServerDataLayer.Repositories;
using ServerTypeLayer.Models;
using ServerTypeLayer;

namespace IdentityServer
{
    public class ProfileService : IProfileService
    {
        private readonly UserRepository _userRepository = new UserRepository();
        
        public Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            try
            {
                User user = _userRepository.GetById(
                    new User { UserId = Convert.ToInt32(context.Subject.GetSubjectId()) }
                );

                if (user == null)
                    throw new ArgumentNullException();

                var claims = new List<Claim>
                {
                    new Claim(JwtClaimTypes.Subject, user.UserId.ToString()),
                    new Claim(JwtClaimTypes.Id, user.UserId.ToString()),
                    new Claim(JwtClaimTypes.Email, user.Email),
                    new Claim(JwtClaimTypes.GivenName, user.UserName ?? ""),
                    new Claim("userType", user.UserType ?? "normalUser"),
                };

                context.IssuedClaims = claims;
                return Task.FromResult(0);
            }
            catch
            {
                return Task.FromResult(0);
            }
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            var subjectId = context.Subject.GetSubjectId();
            if (subjectId.Equals("invalid_request"))
            {
                context.IsActive = false;
            }
            else
            {
                User user = _userRepository.GetById(
                    new User { UserId = Convert.ToInt32(context.Subject.GetSubjectId()) }
                );
                context.IsActive = (user != null); //&& user.Active;
            }

            return Task.FromResult(0);
        }
    }
}