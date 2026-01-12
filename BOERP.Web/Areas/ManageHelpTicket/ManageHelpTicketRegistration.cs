using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageHelpTicket
{
    public class ManageHelpTicketAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "ManageHelpTicket";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
               "ManageHelpTicket",
               "ManageHelpTicket/{action}/{id}",
               new { controller = "ManageHelpTicket", id = UrlParameter.Optional }
           );

            context.MapRoute(
                "ManageHelpTicket_default",
                "ManageHelpTicket/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }


    }

}