using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Dnx.Runtime;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Configuration;

namespace Admin.UI
{
    public class Startup
    {
        //public static IConfiguration Configuration { get; set; }
        public static IConfiguration Configuration { get; private set; }

        //public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
        //{
        //    Configuration = new Configuration(appEnv.ApplicationBasePath)
        //        .AddJsonFile("config.json")
        //        .AddJsonFile($"config.{env.EnvironmentName}.json", optional: true)
        //        .AddEnvironmentVariables();
        //}

        public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
        {
            var configBuilder = new ConfigurationBuilder().SetBasePath(appEnv.ApplicationBasePath)
                .AddJsonFile("config.json")
                .AddJsonFile($"config.{env.EnvironmentName}.json", optional: true); ;

            configBuilder.AddJsonFile("config.json", optional: true);
            configBuilder.AddJsonFile($"config-{env.EnvironmentName}.json", optional: true);
            configBuilder.AddEnvironmentVariables();

            Configuration = configBuilder.Build();
        }

        // This method gets called by a runtime.
        // Use this method to add services to the container
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseIISPlatformHandler();

            app.UseMvc(routes =>
            {
                routes.MapRoute(name: "areaRoute",
                    template: "{area:exists}/{controller}/{action}",
                    defaults: new { controller = "Home", action = "Index" });

                routes.MapRoute(name: "areaRouteForHome",
                    template: "{area:exists}/{action}",
                    defaults: new { controller = "Home", action = "Index" });

               

                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action}/{id?}",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}