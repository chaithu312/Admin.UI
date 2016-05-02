using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;

namespace Admin.UI.CP
{
    public class OAuthClient : HttpClient
    {
        public OAuthClient(ClaimsPrincipal user, List<Configuration.ApiSetting> settings, string name)
            : base()
        {
            var setting = settings.FirstOrDefault(s => s.Name == name);
            var token = string.Empty;

            if (setting != null)
            {
                switch (setting.FlowType)
                {
                    case Admin.UI.Configuration.FlowTypes.ClientCredentials:
                        token = setting.Token;
                        break;

                    case Admin.UI.Configuration.FlowTypes.ResourceOwner:
                        token = user.Claims.First(c => c.Type == IdentityModel.JwtClaimTypes.ReferenceTokenId).Value;
                        break;

                    case Admin.UI.Configuration.FlowTypes.AuthorizationCode:
                    case Admin.UI.Configuration.FlowTypes.Implicit:
                        throw new NotImplementedException();
                }

                BaseAddress = new Uri(setting.Uri);
            }
            DefaultRequestHeaders.Accept.Clear();
            DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }
    }
}