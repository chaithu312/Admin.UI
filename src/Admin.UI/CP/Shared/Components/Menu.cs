using Microsoft.AspNet.Mvc;
using ShipOS.Utility.Common;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Admin.UI.CP.Shared.Components
{
    public class Menu : ViewComponent
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
            public string Id { get; set; }

            public string Text { get; set; }

            public string TargetUrl { get; set; }

            public string IconClassName { get; set; }

            public bool IsCollapsed { get { return !(Children?.FirstOrDefault(i => i.IsSelected)?.IsSelected).GetValueOrDefault(); } }

            public bool IsSelected { get; set; }

            public bool HasChildren
            {
                get { return ((this.Children != null) && (this.Children.Count > 0)); }
            }

            public IList<ItemViewModel> Children { get; set; }
        }

        public IViewComponentResult Invoke()
        {
            var items = GetMenuItems();

            items.ForEach(i =>
            {
                var selected = i.Children?.FirstOrDefault(c => c.TargetUrl == Request.Path);
                if (selected != null)
                    selected.IsSelected = true;
            });

            var viewModel = new ViewModel(items);

            return View(viewModel);
        }

        public static IList<ItemViewModel> GetMenuItems()
        {
            return new List<ItemViewModel>()
            {
                new ItemViewModel() {Id = "Dashboard", TargetUrl = Constants.RoutePaths.Dashboard,IconClassName = "menu-icon fa fa-tachometer",Text = "Dashboard"},
                new ItemViewModel() {Id = "Shipments",TargetUrl = string.Empty,IconClassName = "menu-icon fa fa-list",Text = "Shipments",
                    Children = new List<ItemViewModel>()
                    {
                        new ItemViewModel() { Id = "AWB",TargetUrl = Constants.RoutePaths.Shipments_AWB,IconClassName = "menu-icon fa fa-tag",Text = "AWB with Price",},
                        new ItemViewModel() {Id = "Pickup",TargetUrl = Constants.RoutePaths.PickupList,IconClassName = "",Text = "Pickup Request",},
                        new ItemViewModel() {Id = "Shipment",TargetUrl = Constants.RoutePaths.Pickup,IconClassName = "",Text = "Shipments",},
                    }
                },
                new ItemViewModel() {Id = "Settings",TargetUrl = String.Empty,IconClassName = "ace-icon fa fa-cog",Text = "Settings",
                    Children = new List<ItemViewModel>(){
                        new ItemViewModel() {Id = "Routing",TargetUrl = Constants.RoutePaths.Settings_Route,IconClassName = "globe",Text = "Routing",},
                        new ItemViewModel() {Id = "Country Sets",TargetUrl = Constants.RoutePaths.Settings_countrysets,IconClassName = "map-o",Text = "Country",},
                        new ItemViewModel() {Id = "Locations",TargetUrl = Constants.RoutePaths.Settings_Locations,IconClassName = "cog",Text = "Locations",},
                    }
                }
            };
        }
    }
}