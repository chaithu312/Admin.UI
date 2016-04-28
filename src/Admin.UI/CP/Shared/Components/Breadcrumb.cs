using Microsoft.AspNet.Mvc;
using ShipOS.Utility.Common;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Admin.UI.CP.Shared.Components
{
    public class Breadcrumb : ViewComponent
    {
        public class ViewModel
        {
            public IList<ItemViewModel> Items { get; }

            public ViewModel(IList<ItemViewModel> items)
            {
                Items = items;
            }
        }

        public class ItemViewModel
        {
            public string Text { get; set; }

            public string TargetUrl { get; set; }

            public string IconClassName { get; set; }

            public bool ShowLink { get; set; }
        }

        public IViewComponentResult Invoke()
        {
            var menuItems = Menu.GetMenuItems();

            var breadcrumbs = new List<ItemViewModel>();

            var home = menuItems.FirstOrDefault(mi => mi.TargetUrl == Constants.RoutePaths.Dashboard);
            breadcrumbs.Add(new ItemViewModel()
            {
                Text = home.Text,
                TargetUrl = home.TargetUrl,
                IconClassName = home.IconClassName,
                ShowLink = Request.Path != ""
            });

            menuItems.ForEach(i =>
            {
                var selected = i.Children?.FirstOrDefault(c => c.TargetUrl == Request.Path);
                if (selected != null)
                {
                    breadcrumbs.Add(new ItemViewModel()
                    {
                        Text = i.Text,
                        TargetUrl = i.TargetUrl,
                        IconClassName = i.IconClassName,
                        ShowLink = false
                    });

                    breadcrumbs.Add(new ItemViewModel()
                    {
                        Text = selected.Text,
                        TargetUrl = selected.TargetUrl,
                        IconClassName = selected.IconClassName,
                        ShowLink = false
                    });
                }
            });

            var viewModel = new ViewModel(breadcrumbs);

            return View(viewModel);
        }
    }
}