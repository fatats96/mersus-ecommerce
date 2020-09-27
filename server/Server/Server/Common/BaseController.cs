using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using IdentityModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ServerTypeLayer;

namespace Server.Common
{
    public class BaseController : Controller
    {
        protected internal IConfiguration Configuration { get; set; }
        public IList<string> ResourceCodes;
        public SessionContext _session = new SessionContext();

        public SessionContext Session
        {
            get
            {
                if (_session.CurrentUser == null || _session.CurrentUser.UserId <= 0
                ) //|| String.IsNullOrEmpty(_session.CurrentUser.Email) || _session.CurrentUser.Password == null || _session.CurrentUser.Password.Length == 0)
                {
                    _session = GetLoggedInUserSession();
                }

                return _session;
            }
            set { _session = value; }
        }

        private SessionContext GetLoggedInUserSession()
        {
            ClaimsPrincipal user = User;
            var currentAuthenticatedUser = new LoggedInUser();
            var session = new SessionContext { CurrentUser = new LoggedInUser() };

            if (user != null)
            {
                if (user.Identity.IsAuthenticated)
                {
                    session.IsAuthenticated = user.Identity.IsAuthenticated;

                    var userId = user.Claims.FirstOrDefault(c => c.Type == JwtClaimTypes.Subject)?.Value;
                    if (userId == null)
                        userId = user.Claims.FirstOrDefault(c => c.Type == JwtClaimTypes.Id)?.Value;
                    var userMail = user.Claims.FirstOrDefault(c => c.Type == JwtClaimTypes.Email)?.Value;
                    var userName = user.Claims.FirstOrDefault(c => c.Type == JwtClaimTypes.GivenName)?.Value;

                    currentAuthenticatedUser.UserId = Convert.ToInt32(userId);

                    currentAuthenticatedUser.Email = userMail;
                    currentAuthenticatedUser.UserName = userName;

                    session.CurrentUser = currentAuthenticatedUser;
                }
            }

            return session;
        }

    }
}