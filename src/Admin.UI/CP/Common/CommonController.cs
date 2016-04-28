using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Authorization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.OptionsModel;
using System.Threading;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Admin.UI.CP.Common
{
    public class CommonController : BaseController
    {
        public CommonController(ILogger<Controller> logger, IOptions<Configuration.IdentityServer> config, IOptions<List<Configuration.ApiSetting>> apiSettings)
            : base(logger, config, apiSettings)
        {

        }

        [Route("/common/country")]
        public IActionResult Country()
        {
            return View();
        }

        [Route("/common/country/list")]
        public async Task<JsonResult> GetAllAsync()
        {
            using (var client = new ClientCredentialsClient(_apiSettings.Value, "Common"))
            {
                try
                {
                    var response = await client.GetAsync("common/geo/country");
                    response.EnsureSuccessStatusCode();

                    return new JsonResult(await response.Content.ReadAsAsync<IEnumerable<object>>());
                }
                catch (Exception ex)
                {
                    return new JsonResult(ex.ToString());
                }
            }
        }

        [Route("/common/division")]
        public IActionResult Division()
        {
            return View();
        }
    }
}
