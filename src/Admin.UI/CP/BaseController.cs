using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.OptionsModel;
using System;
using System.Collections.Generic;

namespace Admin.UI.CP
{
    public class BaseController : Controller
    {
        protected readonly ILogger<Controller> _logger;

        protected readonly IOptions<Configuration.IdentityServer> _config;

        protected readonly IOptions<List<Configuration.ApiSetting>> _apiSettings;

        public BaseController(ILogger<Controller> logger, IOptions<Configuration.IdentityServer> config, IOptions<List<Configuration.ApiSetting>> apiSettings)
        {
            _logger = logger;
            _config = config;
            _apiSettings = apiSettings;
        }
    }
}