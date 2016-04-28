using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Admin.UI.CP
{
    public class ClientCredentialsClient : HttpClient
    {
        public ClientCredentialsClient(List<Configuration.ApiSetting> settings, string name)
            : base()
        {
            var setting = settings.FirstOrDefault(s => s.Name == name);
            if (settings == null)
                return;

            BaseAddress = new Uri(setting.Uri);
            DefaultRequestHeaders.Accept.Clear();
            DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", setting.Token);
        }
    }
}