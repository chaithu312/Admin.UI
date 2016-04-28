using System;

namespace Admin.UI.Configuration
{
    public class IdentityServer
    {
        public string Authority { get; set; }

        public string TokenEndpoint { get; set; }

        public string RevocationEndpoint { get; set; }

        public string IntrospectEndpoint { get; set; }

        public string[] RequiredScopes { get; set; }

        public string RequiredScopesStr { get { return string.Join(" ", RequiredScopes); } }

        public string ClientId { get; set; }

        public string ClientSecret { get; set; }
    }

    public class ApiSetting
    {
        public string Name { get; set; }

        public string Uri { get; set; }

        public string Token { get; set; }
    }
}