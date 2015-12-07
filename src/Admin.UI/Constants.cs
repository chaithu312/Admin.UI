﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI
{
    public class Constants
    {
        public static string RegisterURL = RegisterEndpoint;
        public static string idServer = IDServerEndpoint;
        public const string clientID = "CA952280-3855-4A55-950A-B8BCA0079868";

        public const string clientSecret = "262148";
        public const string clientScope = "read write";
        public static string APIURL = ShippingEndpoint;
        public static string Profile = ProfileEndpoint;
        public const string xmlns = "@xmlns:";
        public const string xsi = "@xsi:";

        public const string ReplaceErrorMessage = "\"?xml\":{\"@version\":\"1.0\",\"@encoding\":\"UTF-8\"}";

        public const string ContentType = "application/json";
        public const long accountId = 2;
        public const string DomainKey = "CA952280-3855-4A55-950A-B8BCA0079890";
        public const string message = "Record saved successfully";

        public static string ProfileEndpoint { get { return Startup.Configuration.GetSection("CDN:ProfileEndpoint").Value; } }
        public static string RegisterEndpoint { get { return Startup.Configuration.GetSection("CDN:RegisterEndpoint").Value; } }
        public static string IDServerEndpoint { get { return Startup.Configuration.GetSection("CDN:IDServerEndpoint").Value; } }
        public static string ShippingEndpoint { get { return Startup.Configuration.GetSection("CDN:ShippingEndpoint").Value; } }
    }
}