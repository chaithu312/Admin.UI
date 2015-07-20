"use strict";!function(){var a=angular.module("mainApp",["navsServices"]);a.directive("toggleSidebar",function(){return{restrict:"E",template:'<!-- #section:basics/sidebar.mobile.toggle -->                        <button type="button" class="navbar-toggle menu-toggler pull-left" id="menu-toggler" data-target="#sidebar">                         <span class="sr-only">Toggle sidebar</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>                        </button>                        <!-- /section:basics/sidebar.mobile.toggle -->'}}),a.directive("navbarHeader",function(){return{restrict:"E",scope:{caption:"@caption"},template:' <div class="navbar-header pull-left">                             <!-- #section:basics/navbar.layout.brand -->                             <a href="#" class="navbar-brand">                                 <small>                                     <i class="fa fa-leaf"></i>                                     {{caption}}                                 </small>                             </a>                             <!-- /section:basics/navbar.layout.brand -->                         </div>'}}),a.directive("sidebarMinimize",function(){return{restrict:"E",template:' <!-- #section:basics/sidebar.layout.minimize -->                         <div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">                             <i class="ace-icon fa fa-angle-double-left" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>                         </div>                         <!-- /section:basics/sidebar.layout.minimize -->'}})}(),function(){function a(a,b){a.init=function(){a.navs=b.query()}}angular.module("mainApp").controller("navsController",a),a.$inject=["$scope","Navs"],window.location.hash="#/",function(){angular.module("autoActive",[]).directive("autoActive",["$location",function(a){return{restrict:"A",scope:!1,link:function(b,c){function d(){var b=a.path();b&&angular.forEach(c.find("li"),function(a){var c=a.querySelector("a");c.href.match("#"+b+"(?=\\?|$)")?angular.element(a).addClass("active"):angular.element(a).removeClass("active")})}d(),b.$on("$locationChangeSuccess",d)}}}])}()}(),function(){var a=angular.module("navsServices",["ngResource"]);a.factory("Navs",["$resource",function(a){return a("/api/Navigation/",{},{query:{method:"GET",params:{},isArray:!0}})}])}(),angular.module("mainApp").controller("userCntrl",function(a,b){a.Save=function(a){return a?void alert("It's Great. Form Submitted"):void alert("Invalid form")}}),jQuery(function(a){function b(b,c){var d=a(c),e=d.closest("table"),f=e.offset(),g=e.width(),h=d.offset();return parseInt(h.left)<parseInt(f.left)+parseInt(g/2)?"right":"left"}var c=a("#dynamic-table").dataTable({bAutoWidth:!1,aoColumns:[{bSortable:!1},null,null,null,null,null,{bSortable:!1}],aaSorting:[]});TableTools.classes.container="btn-group btn-overlap",TableTools.classes.print={body:"DTTT_Print",info:"tableTools-alert gritter-item-wrapper gritter-info gritter-center white",message:"tableTools-print-navbar"};var d=new a.fn.dataTable.TableTools(c,{sSwfPath:"../assets/js/dataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",sRowSelector:"td:not(:last-child)",sRowSelect:"multi",fnRowSelected:function(b){try{a(b).find("input[type=checkbox]").get(0).checked=!0}catch(c){}},fnRowDeselected:function(b){try{a(b).find("input[type=checkbox]").get(0).checked=!1}catch(c){}},sSelectedClass:"success",aButtons:[{sExtends:"copy",sToolTip:"Copy to clipboard",sButtonClass:"btn btn-white btn-primary btn-bold",sButtonText:"<i class='fa fa-copy bigger-110 pink'></i>",fnComplete:function(){this.fnInfo('<h3 class="no-margin-top smaller">Table copied</h3>									<p>Copied '+c.fnSettings().fnRecordsTotal()+" row(s) to the clipboard.</p>",1500)}},{sExtends:"csv",sToolTip:"Export to CSV",sButtonClass:"btn btn-white btn-primary  btn-bold",sButtonText:"<i class='fa fa-file-excel-o bigger-110 green'></i>"},{sExtends:"pdf",sToolTip:"Export to PDF",sButtonClass:"btn btn-white btn-primary  btn-bold",sButtonText:"<i class='fa fa-file-pdf-o bigger-110 red'></i>"},{sExtends:"print",sToolTip:"Print view",sButtonClass:"btn btn-white btn-primary  btn-bold",sButtonText:"<i class='fa fa-print bigger-110 grey'></i>",sMessage:"<div class='navbar navbar-default'><div class='navbar-header pull-left'><a class='navbar-brand' href='#'><small>Optional Navbar &amp; Text</small></a></div></div>",sInfo:"<h3 class='no-margin-top'>Print view</h3>									  <p>Please use your browser's print function to									  print this table.									  <br />Press <b>escape</b> when finished.</p>"}]});a(d.fnContainer()).appendTo(a(".tableTools-container")),setTimeout(function(){a(d.fnContainer()).find("a.DTTT_button").each(function(){var b=a(this).find("> div");b.length>0?b.tooltip({container:"body"}):a(this).tooltip({container:"body"})})},200);var e=new a.fn.dataTable.ColVis(c,{buttonText:"<i class='fa fa-search'></i>",aiExclude:[0,6],bShowAll:!0,sAlign:"right",fnLabel:function(b,c,d){return a(d).text()}});a(e.button()).addClass("btn-group").find("button").addClass("btn btn-white btn-info btn-bold"),a(e.button()).prependTo(".tableTools-container .btn-group").attr("title","Show/hide columns").tooltip({container:"body"}),a(e.dom.collection).addClass("dropdown-menu dropdown-light dropdown-caret dropdown-caret-right").find("li").wrapInner('<a href="javascript:void(0)" />').find("input[type=checkbox]").addClass("ace").next().addClass("lbl padding-8"),a("th input[type=checkbox], td input[type=checkbox]").prop("checked",!1),a("#dynamic-table > thead > tr > th input[type=checkbox]").eq(0).on("click",function(){var b=this.checked;a(this).closest("table").find("tbody > tr").each(function(){var a=this;b?d.fnSelect(a):d.fnDeselect(a)})}),a("#dynamic-table").on("click","td input[type=checkbox]",function(){var b=a(this).closest("tr").get(0);this.checked?d.fnDeselect(a(this).closest("tr").get(0)):d.fnSelect(b)}),a(document).on("click","#dynamic-table .dropdown-toggle",function(a){a.stopImmediatePropagation(),a.stopPropagation(),a.preventDefault()});var f="active";a("#simple-table > thead > tr > th input[type=checkbox]").eq(0).on("click",function(){var b=this.checked;a(this).closest("table").find("tbody > tr").each(function(){var c=this;b?a(c).addClass(f).find("input[type=checkbox]").eq(0).prop("checked",!0):a(c).removeClass(f).find("input[type=checkbox]").eq(0).prop("checked",!1)})}),a("#simple-table").on("click","td input[type=checkbox]",function(){var b=a(this).closest("tr");this.checked?b.addClass(f):b.removeClass(f)}),a('[data-rel="tooltip"]').tooltip({placement:b})});