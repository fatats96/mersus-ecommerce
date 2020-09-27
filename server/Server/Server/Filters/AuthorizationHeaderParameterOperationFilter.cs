using System.Collections.Generic;
using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Server.Filters
{
    public class AuthorizationHeaderParameterOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var authorizeAttribute = context.MethodInfo.GetCustomAttribute<AuthorizeAttribute>(true)
                                     ?? context.MethodInfo.DeclaringType?.GetCustomAttribute<AuthorizeAttribute>(true);
            var allowAnonymousAttribute = context.MethodInfo.GetCustomAttribute<AllowAnonymousAttribute>(true)
                                          ?? context.MethodInfo.DeclaringType?.GetCustomAttribute<AllowAnonymousAttribute>(true);

            if (authorizeAttribute != null && allowAnonymousAttribute == null)
            {
                operation.Responses.TryAdd("401", new OpenApiResponse { Description = "Unauthorized" });
                operation.Responses.TryAdd("403", new OpenApiResponse { Description = "Forbidden" });

                var oAuthScheme = new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                };

                operation.Security = new List<OpenApiSecurityRequirement>
                {
                    new OpenApiSecurityRequirement
                    {
                        [oAuthScheme] = new[] {authorizeAttribute.Policy}
                    }
                };
            }
        }
    }
}
