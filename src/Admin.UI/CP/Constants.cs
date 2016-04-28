using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.CP

{
    public static class Constants
    {
        public static class RoutePaths
        {
            public const string Dashboard = "/Dashboard";
            public const string Login = "/Account/login";
            public const string Logout = "/Account/logout";

            public const string NotAuthorized = "/Account/login"; // 401
            public const string Forbidden = "/403";
            public const string NotFound = "/404";
            public const string MethodNotAllowed = "/405";
            public const string RequestTimeout = "/408";
            public const string TooManyRequests = "/429";
            public const string InternalServerError = "/500";
            public const string Error = "/error";

            public const string Settings = "/settings";
            public const string Settings_Route = "/settings/route";
            public const string Settings_Locations = "/settings/location";
            public const string Settings_countrysets = "/settings/countrysets";

            public const string Shipments = "/shipments";
            public const string Shipments_Pickup = "/shipping/pickup";
            public const string Shipments_AWB = "/shipment/All";
            public const string Shipments_New = "/shipment/";

            public const string Common_Countries = "/common/country";
            public const string Common_Divisions = "/common/division";
        }
    }
}