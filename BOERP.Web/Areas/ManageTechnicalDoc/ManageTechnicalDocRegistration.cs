using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageTechnicalDoc
{
    public class ManageTechnicalDocRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "ManageTechnicalDoc";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
               "ManageTechnicalDoc",
               "ManageTechnicalDoc/{action}/{id}",
               new { controller = "ManageTechnicalDoc", id = UrlParameter.Optional }
           );

            context.MapRoute(
                "ManageTechnicalDoc_default",
                "ManageTechnicalDoc/{controller}/{action}/{id}",
                new { action = "TechnicalDocList", id = UrlParameter.Optional }
            );
        }
    }
}