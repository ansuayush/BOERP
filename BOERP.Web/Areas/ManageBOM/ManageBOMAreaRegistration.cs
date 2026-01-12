using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageBOM
{
    public class ManageBOMAreaRegistration: AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "ManageBOM";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
               "ManageBOM",
               "ManageBOM/{action}/{id}",
               new { controller = "ManageBOM", id = UrlParameter.Optional }
           );

            context.MapRoute(
                "ManageBOM_default",
                "ManageBOM/{controller}/{action}/{id}",
                new { action = "BOMList", id = UrlParameter.Optional }
            );
        }
    }
}