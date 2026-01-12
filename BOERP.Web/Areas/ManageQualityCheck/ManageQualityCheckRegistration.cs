using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageQualityCheck
{
    public class ManageQualityCheckAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "ManageQualityCheck";
            }
        }
        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "ManageQualityCheck_default",
                "ManageQualityCheck/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }        


    }

}