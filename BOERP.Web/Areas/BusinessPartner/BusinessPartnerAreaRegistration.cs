using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BOERP.Web.Areas.BusinessPartner
{
    public class BusinessPartnerAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "BusinessPartner";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
               "BusinessPartner",
               "BusinessPartner/{action}/{id}",
               new { controller = "BusinessPartner", id = UrlParameter.Optional }
           );

            context.MapRoute(
                "BusinessPartner_default",
                "BusinessPartner/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }

}