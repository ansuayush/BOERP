using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageOrder
{
    public class ManageOrderAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "ManageOrder";
            }
        }
        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
             "ManageOrder",
             "ManageOrder/{action}/{id}",
             new { controller = "ManageOrder", id = UrlParameter.Optional }
         );

            context.MapRoute(
                "ManageOrder_default",
                "ManageOrder/{controller}/{action}/{id}",
                new { action = "OrderList", id = UrlParameter.Optional }
            );
        }        


    }

}