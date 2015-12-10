using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Admin.UI.Utility
{
    /// <summary>
    /// A wrapper for a web api REST service that optionally allows different levels
    /// of authentication to be added to the header of the request that will then be
    /// checked using the SecretAuthenticationFilter in the web api controller methods.
    ///
    /// Example Usage:
    ///   No authentication...
    ///     var productsClient = new RestClient<Product>("http://localhost/ServiceTier/api/");
    ///   Simple authentication...
    ///     var productsClient = new RestClient<Product>("http://localhost/ServiceTier/api/","productscontrollersecret");
    ///   HMAC authentication...
    ///     var productsClient = new RestClient<Product>("http://localhost/ServiceTier/api/","productscontrollersecret", true);
    ///
    /// Example method calls:
    ///   var getManyResult = productsClient.GetMultipleItemsRequest("products?page=1").Result;
    ///   var getSingleResult = productsClient.GetSingleItemRequest("products/1").Result;
    ///   var postResult = productsClient.PostRequest("products", new Product { Id = 3, ProductName = "Dynamite", ProductDescription = "Acme bomb" }).Result;
    ///   productsClient.PutRequest("products/3", new Product { Id = 3, ProductName = "Dynamite", ProductDescription = "Acme bomb" }).Wait();
    ///   productsClient.DeleteRequest("products/3").Wait();
    /// </summary>
    /// <typeparam name="T">The class being manipulated by the REST api</typeparam>
    public class RestClient<T> where T : class
    {
        private static string _baseAddress;
        private static string _sharedSecretName;
        private static bool _hmacSecret;

        public RestClient(string baseAddress) : this(baseAddress, null, false)
        {
        }

        public RestClient(string baseAddress, string sharedSecretName) : this(baseAddress, sharedSecretName, false)
        {
        }

        public RestClient(string baseAddress, string sharedSecretName, bool hmacSecret)
        {
            // e.g. http://localhost/ServiceTier/api/
            _baseAddress = baseAddress;
            _sharedSecretName = sharedSecretName;
            _hmacSecret = hmacSecret;
        }

        /// <summary>
        /// Used to setup the base address, that we want json, and authentication headers for the request
        /// </summary>
        /// <param name="client">The HttpClient we are configuring</param>
        /// <param name="methodName">GET, POST, PUT or DELETE. Aim to prevent hacker changing the
        /// method from say GET to DELETE</param>
        /// <param name="apiUrl">The end bit of the url we use to call the web api method</param>
        /// <param name="content">For posts and puts the object we are including</param>
        private static void SetupClient(HttpClient client, string methodName, string apiUrl, T content = null)
        {
            // Three versions in one.
            // Just specify a base address and no secret token will be added
            // Specify a sharedSecretName and we will include the contents of it found in the web.config as a SecretToken in the header
            // Ask for HMAC and a HMAC will be generated and added to the request header
            const string secretTokenName = "SecretToken";

            client.BaseAddress = new Uri(apiUrl);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            if (_hmacSecret)
            {
                // hmac using shared secret a representation of the message, as we are
                // including the time in the representation we also need it in the header
                // to check at the other end.
                // You might want to extend this to also include a username if, for instance,
                // the secret key varies by username
                client.DefaultRequestHeaders.Date = DateTime.UtcNow;
                var datePart = client.DefaultRequestHeaders.Date.Value.UtcDateTime.ToString(CultureInfo.InvariantCulture);

                //var fullUri = _baseAddress + apiUrl;
                var fullUri = apiUrl;

                var contentMD5 = "";
                if (content != null)
                {
                    var json = new JavaScriptSerializer().Serialize(content);

                    contentMD5 = Hashing.GetHashMD5OfString(json);
                }

                var messageRepresentation =
                    methodName + "\n" +
                    contentMD5 + "\n" +
                    datePart + "\n" +
                    fullUri;

                var sharedSecretValue = System.Configuration.ConfigurationManager.AppSettings[_sharedSecretName];

                var hmac = Hashing.GetHashHMACSHA256OfString(messageRepresentation, sharedSecretValue);
                client.DefaultRequestHeaders.Add(secretTokenName, hmac);
            }
            else if (!string.IsNullOrWhiteSpace(_sharedSecretName))
            {
                var sharedSecretValue = ConfigurationManager.AppSettings[_sharedSecretName];
                client.DefaultRequestHeaders.Add(secretTokenName, sharedSecretValue);
            }
        }

        /// <summary>
        /// For getting a single item from a web api uaing GET
        /// </summary>
        /// <param name="apiUrl">Added to the base address to make the full url of the
        /// api get method, e.g. "products/1" to get a product with an id of 1</param>
        /// <returns>The item requested</returns>
        public async Task<T> GetSingleItemRequest(string apiUrl)
        {
            T result = null;

            using (var client = new HttpClient())
            {
                SetupClient(client, "GET", apiUrl);

                var response = await client.GetAsync(apiUrl).ConfigureAwait(false);

                response.EnsureSuccessStatusCode();

                await response.Content.ReadAsStringAsync().ContinueWith((Task<string> x) =>
                {
                    if (x.IsFaulted)
                        throw x.Exception;

                    result = JsonConvert.DeserializeObject<T>(x.Result);
                });
            }

            return result;
        }

        /// <summary>
        /// For getting multiple (or all) items from a web api using GET
        /// </summary>
        /// <param name="apiUrl">Added to the base address to make the full url of the
        /// api get method, e.g. "products?page=1" to get page 1 of the products</param>
        /// <returns>The items requested</returns>
        public async Task<T[]> GetMultipleItemsRequest(string apiUrl)
        {
            T[] result = null;

            using (var client = new HttpClient())
            {
                SetupClient(client, "GET", apiUrl);

                var response = await client.GetAsync(apiUrl).ConfigureAwait(false);

                response.EnsureSuccessStatusCode();

                await response.Content.ReadAsStringAsync().ContinueWith((Task<string> x) =>
                {
                    if (x.IsFaulted)
                        throw x.Exception;

                    result = JsonConvert.DeserializeObject<T[]>(x.Result);
                });
            }

            return result;
        }

        /// <summary>
        /// For creating a new item over a web api using POST
        /// </summary>
        /// <param name="apiUrl">Added to the base address to make the full url of the
        /// api post method, e.g. "products" to add products</param>
        /// <param name="postObject">The object to be created</param>
        /// <returns>The item created</returns>
        public static async Task<T> PostRequest(string apiUrl, T postObject)
        {
            T result = null;
            var postData = JsonConvert.SerializeObject(postObject);
            using (var client = new HttpClient())
            {
                SetupClient(client, "POST", apiUrl, postObject);

                var response = await client.PostAsync(apiUrl, postData, new JsonMediaTypeFormatter()).ConfigureAwait(false);

                response.EnsureSuccessStatusCode();

                await response.Content.ReadAsStringAsync().ContinueWith((Task<string> x) =>
                {
                    if (x.IsFaulted)
                        throw x.Exception;

                    result = JsonConvert.DeserializeObject<T>(x.Result);
                });
            }

            return result;
        }

        /// <summary>
        /// For updating an existing item over a web api using PUT
        /// </summary>
        /// <param name="apiUrl">Added to the base address to make the full url of the
        /// api put method, e.g. "products/3" to update product with id of 3</param>
        /// <param name="putObject">The object to be edited</param>
        public async Task PutRequest(string apiUrl, T putObject)
        {
            using (var client = new HttpClient())
            {
                SetupClient(client, "PUT", apiUrl, putObject);

                var response = await client.PutAsync(apiUrl, putObject, new JsonMediaTypeFormatter()).ConfigureAwait(false);

                response.EnsureSuccessStatusCode();
            }
        }

        /// <summary>
        /// For deleting an existing item over a web api using DELETE
        /// </summary>
        /// <param name="apiUrl">Added to the base address to make the full url of the
        /// api delete method, e.g. "products/3" to delete product with id of 3</param>
        public async Task DeleteRequest(string apiUrl)
        {
            using (var client = new HttpClient())
            {
                SetupClient(client, "DELETE", apiUrl);

                var response = await client.DeleteAsync(apiUrl).ConfigureAwait(false);

                response.EnsureSuccessStatusCode();
            }
        }
    }

    public static class Hashing
    {
        /// <summary>
        /// Utility function to generate a MD5 of a string
        /// </summary>
        /// <param name="value">The item to have a MD5 generated for it</param>
        /// <returns>The MD5 digest</returns>
        public static string GetHashMD5OfString(string value)
        {
            using (var cryptoProvider = new MD5CryptoServiceProvider())
            {
                var hash = cryptoProvider.ComputeHash(Encoding.UTF8.GetBytes(value));
                return Convert.ToBase64String(hash);
            }
        }

        /// <summary>
        /// Utility to generate a HMAC of a string
        /// </summary>
        /// <param name="value">The item to have a HMAC generated for it</param>
        /// <param name="key">The 'shared' key to use for the HMAC</param>
        /// <returns>The HMAC for the value using the key</returns>
        public static string GetHashHMACSHA256OfString(string value, string key)
        {
            using (var cryptoProvider = new HMACSHA256(Encoding.UTF8.GetBytes(key)))
            {
                var hash = cryptoProvider.ComputeHash(Encoding.UTF8.GetBytes(value));
                return Convert.ToBase64String(hash);
            }
        }
    }

    public class ClientHttp
    {
        public static HttpWebResponse PostAsync(string strURL, string strPostdata)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(strURL);
            byte[] bytes;
            //bytes = System.Text.Encoding.ASCII.un(requestXml);
            bytes = System.Text.Encoding.UTF8.GetBytes(strPostdata);
            request.ContentType = "application/json";
            request.ContentLength = bytes.Length;
            request.Method = "POST";
            Stream requestStream = request.GetRequestStream();
            requestStream.Write(bytes, 0, bytes.Length);
            requestStream.Close();
            HttpWebResponse response;
            response = (HttpWebResponse)request.GetResponse();
            return response;
        }

        public static HttpWebResponse GetAsync(string strURL)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(strURL);
            request.ContentType = Constants.ContentType;
            request.Method = "GET";
            HttpWebResponse response;
            response = (HttpWebResponse)request.GetResponse();
            return response;
        }
    }
}