using Microsoft.AspNet.Authentication.OpenIdConnect;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc.Filters;
using Microsoft.AspNet.Session;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ShipOS.Utility.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; set; }

        public void ConfigureServices(IServiceCollection services)
        {
            var defaultPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();

            services.Configure<Configuration.IdentityServer>(Configuration.GetSection("IdentityServer"));

            services.Configure<List<Configuration.ApiSetting>>(Configuration.GetSection("ApiSettings"));

            services
                .AddMvc(setup =>
                {
                    setup.Filters.Add(new AuthorizeFilter(defaultPolicy));
                })
                .AddRazorOptions(razor =>
                {
                    razor.ViewLocationExpanders.Add(new CP.CustomViewLocationExpander());
                });

            services.AddCaching();
            services.AddSession();

            // Add application services
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            // loggerFactory.AddNLog(new global::NLog.LogFactory(new NLog.Config.XmlLoggingConfiguration("nlog.config", true)));

            app.UseIISPlatformHandler();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseStatusCodePagesWithReExecute("/{0}");
            }
            else
            {
                // app.UseExceptionHandler(UI.Constants.RoutePaths.Error);
            }

            app.UseCookieAuthentication(options =>
            {
                options.AuthenticationScheme = "Cookies";
                options.AutomaticAuthenticate = true;
                options.AutomaticChallenge = true;
                options.CookieName = "OnurApp";
                options.ExpireTimeSpan = TimeSpan.FromSeconds(int.Parse(Configuration["Cookies:ExpireTimespanInSeconds"]));
                options.LoginPath = new PathString(CP.Constants.RoutePaths.Login);
                options.LogoutPath = new PathString(CP.Constants.RoutePaths.Logout);
                options.AccessDeniedPath = new PathString(CP.Constants.RoutePaths.Forbidden);
            });

            app.UseOpenIdConnectAuthentication(options =>
            {
                options.AuthenticationScheme = OpenIdConnectDefaults.AuthenticationScheme;
                options.SignInScheme = "Cookies";
                options.SaveTokensAsClaims = true;

                options.Authority = Configuration["IdentityServer:Authority"];
                options.RequireHttpsMetadata = options.Authority.Contains("https:");

                options.ClientId = Configuration["IdentityServer:ClientId"];
                options.ClientSecret = Configuration["IdentityServer:ClientSecret"];

                Configuration.GetSection("IdentityServer:RequiredScopes").GetChildren().Select(c => c.Value).ForEach(scope => options.Scope.Add(scope));
            });

            app.UseStaticFiles();

            app.UseSession();

            app.UseMvc(routes =>
            {
                // add area routes
                routes.MapRoute(name: "areaRoute",
                    template: "{area:exists}/{controller}/{action}",
                    defaults: new { controller = "Home", action = "Index" });

                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            //app.Run(async (context) =>
            //{
            //    await context.Response.WriteAsync("Hello World!");
            //});
        }

        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}