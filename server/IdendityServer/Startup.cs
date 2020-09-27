using System;
using System.IO;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace IdentityServer
{
    public class Startup
    {
        public IWebHostEnvironment Environment { get; }

        public Startup(IWebHostEnvironment environment)
        {
            Environment = environment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews().AddNewtonsoftJson(
                    options => options.SerializerSettings.ReferenceLoopHandling =
                        Newtonsoft.Json.ReferenceLoopHandling.Ignore
                );

            // compression eklendi (https için- http'de güvenlik açığı var)
            services.Configure<GzipCompressionProviderOptions>(options =>
                options.Level = System.IO.Compression.CompressionLevel.Optimal);

            services.AddResponseCompression(options => { options.EnableForHttps = true; });

            // Add service and create Policy with options
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    corsBuilder => corsBuilder
                        .WithOrigins(new string [] {"http://localhost:3000"})
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            var builder = services
                .AddIdentityServer(options => { options.Authentication.CookieLifetime = TimeSpan.FromHours(10); })
                .AddInMemoryIdentityResources(Config.GetIdentityResources())
                .AddInMemoryApiResources(Config.GetApis())
                .AddInMemoryClients(Config.GetClients())
                .AddProfileService<ProfileService>()
                .AddResourceOwnerValidator<ResourceOwnerPasswordValidator>()
                .AddInMemoryPersistedGrants();

            if (Environment.IsDevelopment())
                builder.AddDeveloperSigningCredential();
            else
            {
                var fileName = Path.Combine(Environment.WebRootPath, "idsvr.pfx");
                if (!File.Exists(fileName))
                    throw new FileNotFoundException("Signing Certificate is missing!");

                var cert = new X509Certificate2(fileName, "g7k9Qb3Qht6eVrfc");
                builder.AddSigningCredential(cert);
            }

            services.AddAuthentication()
                .AddJwtBearer(options =>
                {
                    options.Authority = "http://localhost:5000";
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidIssuer = "http://localhost:5000",
                        ValidateAudience = false,
                        ValidAudience = "ecommerce",
                        ValidateLifetime = true
                    };
                });

            services.AddControllersWithViews();
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseCookiePolicy(new CookiePolicyOptions() { MinimumSameSitePolicy = SameSiteMode.Lax }); 
            // compression devreye al
            app.UseResponseCompression();

            // CORS global policy - assign here or on each controller

            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseRouting();

            app.UseCors();

            app.UseIdentityServer();
            // UseIdentityServer include a call to UseAuthentication()
            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapDefaultControllerRoute(); });
        }
    }
}