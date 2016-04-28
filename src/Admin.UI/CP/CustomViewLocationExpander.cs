using Microsoft.AspNet.Mvc.Razor;
using System.Collections.Generic;

namespace Admin.UI.CP
{
    public class CustomViewLocationExpander : IViewLocationExpander
    {
        public IEnumerable<string> ExpandViewLocations(
            ViewLocationExpanderContext context,
            IEnumerable<string> viewLocations)
        {
            yield return "~/CP/{2}/{1}/Views/{0}.cshtml";
            yield return "~/CP/{1}/Views/{0}.cshtml";
            yield return "~/CP/Shared/{0}.cshtml";
        }

        public void PopulateValues(ViewLocationExpanderContext context)
        {
        }
    }
}