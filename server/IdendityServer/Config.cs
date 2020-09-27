using System.Collections.Generic;
using IdentityModel;
using IdentityServer4.Models;
using Microsoft.Extensions.Configuration;

namespace IdentityServer
{
    public static class Config
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
            };
        }

        public static IEnumerable<ApiResource> GetApis()
        {
            return new List<ApiResource>
            {
                new ApiResource
                {
                    Name = "eCommerceAPI",
                    //ApiSecrets = { new Secret("secret") },
                    UserClaims =
                    {
                        JwtClaimTypes.Subject,
                        JwtClaimTypes.Id,
                        JwtClaimTypes.Email,
                        JwtClaimTypes.PhoneNumber,
                        JwtClaimTypes.GivenName,
                        JwtClaimTypes.FamilyName,
                        JwtClaimTypes.PreferredUserName,
                    },
                    Description = "eCommerceAPI",
                    DisplayName = "eCommerceAPI",
                    Enabled = true,
                    Scopes = {new Scope("eCommerceAPI") }
                }
            };
        }

        public static IEnumerable<Client> GetClients()
        {
            IConfigurationBuilder builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.Development.json");

            return builder.Build().GetSection("IdentityServer:Clients").Get<List<Client>>();
        }
    }
}