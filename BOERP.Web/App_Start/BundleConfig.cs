using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace SahajFramework.Web
{
    public class BundleConfig
    {

        public static void RegisterBundles(BundleCollection bundles)
        {
            // All CSS
            var CssBundle = new StyleBundle("~/bundle/dataTablecss")
            .Include(
                        "~/assets/vendors/datatables/dataTables.bootstrap4.min.css",
                        "~/assets/vendors/datatables/buttons.bootstrap4.min.css",
                        "~/assets/vendors/datatables/responsive.bootstrap4.min.css"
                    );
            CssBundle.Orderer = new NonOrderingBundleOrderer();
            bundles.Add(CssBundle);
            
            //All JS

            var JsBundleDesign1 = new ScriptBundle("~/bundle/dataTablesjs")
             .Include(
                        "~/assets/vendors/datatables/jquery.dataTables.min.js",
                        "~/assets/vendors/datatables/dataTables.bootstrap4.min.js",
                        "~/assets/vendors/datatables/dataTables.buttons.min.js",
                        "~/assets/vendors/datatables/buttons.bootstrap4.min.js",
                        "~/assets/vendors/datatables/jszip.min.js",
                        "~/assets/vendors/datatables/pdfmake.min.js",
                        "~/assets/vendors/datatables/vfs_fonts.js",
                        //"~/vendors/datatables/dataTables.responsive.min.js",
                        "~/assets/vendors/datatables/buttons.html5.min.js",
                        "~/assets/vendors/datatables/buttons.print.min.js",
                        "~/assets/vendors/datatables/buttons.colVis.min.js",
                        "~/assets/design/Scripts/ListSetting.js"

                    );
            JsBundleDesign1.Orderer = new NonOrderingBundleOrderer();
            bundles.Add(JsBundleDesign1);

            // Js For unobtrusive
            var JsBundleunobtrusive = new ScriptBundle("~/bundle/unobtrusivejs")
            .Include(
                        "~/assets/design/js/jquery.unobtrusive-ajax.min.js",
                       "~/assets/design/js/jquery.validate.min.js",
                       "~/assets/design/js/jquery.validate.unobtrusive.min.js"
                    );
            JsBundleunobtrusive.Orderer = new NonOrderingBundleOrderer();
            bundles.Add(JsBundleunobtrusive);

            if (clsApplicationSetting.GetWebConfigValue("OptimizeCssJS") == "Y")
            {
                BundleTable.EnableOptimizations = true;
            }
            else
            {
                BundleTable.EnableOptimizations = false;
            }
        }
    }
    class NonOrderingBundleOrderer : IBundleOrderer
    {
        public IEnumerable<BundleFile> OrderFiles(BundleContext context, IEnumerable<BundleFile> files)
        {
            return files;
        }
    }
}