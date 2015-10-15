using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI
{
    public static class Constants
    {

        public const string RegisterURL = "http://test.shipos.com/ID/api/register/";
        public const string idServer = "http://localhost:63319/core/";
        public const string clientID = "CA952280-3855-4A55-950A-B8BCA0079868";

        public const string clientSecret = "262148";
        public const string clientScope = "read write";
        public const string APIURL = "http://test.shipos.com/shipping/";
        public const string xmlns = "@xmlns:";
        public const string xsi = "@xsi:";

        public const string ReplaceErrorMessage= "\"?xml\":{\"@version\":\"1.0\",\"@encoding\":\"UTF-8\"}";

        public const string ContentType = "application/json";
    }
}