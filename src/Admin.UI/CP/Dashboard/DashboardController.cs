using Admin.UI.CP.Account;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.OptionsModel;
using System;
using System.Collections.Generic;

namespace Admin.UI.CP.Dashboard
{
    public class DashboardController : BaseController
    {
        public DashboardController(ILogger<Controller> logger, IOptions<Configuration.IdentityServer> config,
            IOptions<List<Configuration.ApiSetting>> apiSettings)
            : base(logger, config, apiSettings)
        {
        }

        [HttpGetAttribute]
        [AllowAnonymous]
        [Route(Constants.RoutePaths.Dashboard)]
        public IActionResult Index(string returnUrl)
        {
            return View();
        }
    }
}