using IdentityModel;
using IdentityModel.Client;
using Microsoft.AspNet.Authentication.OpenIdConnect;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.OptionsModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Admin.UI.CP.Account
{
    public class AccountController : BaseController
    {
        public AccountController(ILogger<Controller> logger, IOptions<Configuration.IdentityServer> config, IOptions<List<Configuration.ApiSetting>> apiSettings)
            : base(logger, config, apiSettings)
        {
        }

        [HttpGet]
        [AllowAnonymous]
        [Route(Constants.RoutePaths.Login)]
        public IActionResult Login(string returnUrl)
        {
            var model = new LoginViewModel { ReturnUrl = returnUrl, DomainKey = new Guid("B171F61C-8914-4C5D-AF88-C3B776D80915") };
            return View(model);
        }

        [AllowAnonymous]
        [HttpPost(Constants.RoutePaths.Login)]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid) return View(model);
            var client = new TokenClient(
                _config.Value.TokenEndpoint,
                _config.Value.ClientId,
                _config.Value.ClientSecret);

            var acr_values = new Dictionary<string, string>
            {
                { "acr_values", model.DomainKey.ToString() }
            };

            var result = await client.RequestResourceOwnerPasswordAsync(model.UserName, model.Password, _config.Value.RequiredScopesStr, acr_values);

            if (result.IsHttpError)
            {
                ModelState.AddModelError("", result.HttpErrorReason);
            }
            else
            {
                if (!result.IsError)
                {
                    var claims = new Claim[] {
                        new Claim(JwtClaimTypes.Subject, $"{model.DomainKey}:{model.UserName}"),
                        new Claim(JwtClaimTypes.Name, model.UserName),
                        new Claim(JwtClaimTypes.IdentityProvider, "idsvr"),
                        new Claim(JwtClaimTypes.AuthenticationTime, DateTime.UtcNow.ToEpochTime().ToString()),
                        new Claim(JwtClaimTypes.ReferenceTokenId, result.AccessToken),
                    };
                    var ci = new ClaimsIdentity(claims, "password", JwtClaimTypes.Name, JwtClaimTypes.Role);
                    var cp = new ClaimsPrincipal(ci);

                    await HttpContext.Authentication.SignInAsync("Cookies", cp);
                    return RedirectToLocal(model.ReturnUrl);
                }

                var errorDescription = result.Json?.GetValue("error_description")?.ToString();
                ModelState.AddModelError("", string.IsNullOrEmpty(errorDescription) ? result.Error : errorDescription);
            }

            return View(model);
        }

        [AllowAnonymous]
        [Route(Constants.RoutePaths.Logout)]
        public async Task<IActionResult> Logout(CancellationToken cancellationToken)
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
                return RedirectToAction("Login");

            var client = new TokenRevocationClient(
                _config.Value.RevocationEndpoint,
                _config.Value.ClientId,
                _config.Value.ClientSecret);

            var result = await client.RevokeAsync(HttpContext.User.FindFirst(JwtClaimTypes.ReferenceTokenId).Value, cancellationToken: cancellationToken);

            if (result.IsError || result.IsHttpError)
                return RedirectToAction("Login");
            await HttpContext.Authentication.AuthenticateAsync(OpenIdConnectDefaults.AuthenticationScheme);

            await HttpContext.Authentication.SignOutAsync("Cookies");

            return RedirectToAction("Login");
        }

        private IActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction(nameof(Home.HomeController.Index), "Home");
            }
        }
    }
}