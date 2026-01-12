using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageFMSConfig
{
    public class ManageFMSConfigAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "ManageFMSConfig";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
               "ManageFMSConfig",
               "ManageFMSConfig/{action}/{id}",
               new { controller = "ManageFMSConfig", id = UrlParameter.Optional }
           );

            context.MapRoute(
                "ManageFMSConfig_default",
                "ManageFMSConfig/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }


    }

}