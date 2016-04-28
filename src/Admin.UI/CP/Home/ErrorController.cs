using System;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Authorization;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Admin.UI.CP.Home
{
    public class ErrorController : Controller
    {
        [HttpGet]
        [Route(Constants.RoutePaths.Error)]
        [AllowAnonymous]
        public IActionResult Error()
        {
            ViewData["ErrorCode"] = "Error.";
            ViewData["ErrorDescription"] = "An error occurred while processing your request.";
            return View();
        }

        [Route(Constants.RoutePaths.Forbidden)]
        [AllowAnonymous]
        public IActionResult Forbidden()
        {
            ViewData["ErrorCode"] = "403 - Forbidden.";
            ViewData["ErrorDescription"] = "User is not permitted to perform the requested operation.";
            return View("Error");
        }

        [HttpGet]
        [Route(Constants.RoutePaths.NotFound)]
        [AllowAnonymous]
        public IActionResult NotFound()
        {
            ViewData["ErrorCode"] = "404 - Not found.";
            ViewData["ErrorDescription"] = "The resource you are looking for is not found.";
            return View("Error");
        }

        [HttpGet]
        [Route(Constants.RoutePaths.MethodNotAllowed)]
        [AllowAnonymous]
        public IActionResult MethodNotAllowed()
        {
            ViewData["ErrorCode"] = "405 - Method not allowed.";
            ViewData["ErrorDescription"] = "Method is not supported for the requested resource.";
            return View("Error");
        }

        [HttpGet]
        [Route(Constants.RoutePaths.RequestTimeout)]
        [AllowAnonymous]
        public IActionResult RequestTimeout()
        {
            ViewData["ErrorCode"] = "408 - RequestTimeout.";
            ViewData["ErrorDescription"] = "The server timed out waiting for the request.";
            return View("Error");
        }

        [HttpGet]
        [Route(Constants.RoutePaths.TooManyRequests)]
        [AllowAnonymous]
        public IActionResult TooManyRequests()
        {
            ViewData["ErrorCode"] = "429 - Too Many Requests.";
            ViewData["ErrorDescription"] = "The user has sent too many requests in a given amount of time.";
            return View("Error");
        }

        [HttpGet]
        [Route(Constants.RoutePaths.InternalServerError)]
        [AllowAnonymous]
        public IActionResult InternalServerError()
        {
            ViewData["ErrorCode"] = "500 - Internal Server Error.";
            ViewData["ErrorDescription"] = "The server encountered an internal error or misconfiguration and was unable to complete your request.";
            return View("Error");
        }
    }
}
