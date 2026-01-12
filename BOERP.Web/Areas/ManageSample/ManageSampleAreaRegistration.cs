using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageSample
{
    public class ManageSampleAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "ManageSample";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
               "ManageSample",
               "ManageSample/{action}/{id}",
               new { controller = "ManageSample", id = UrlParameter.Optional }
           );

            context.MapRoute(
                "ManageSample_default",
                "ManageSample/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }

}