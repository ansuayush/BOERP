using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageDoer
{
    public class ManageDoerAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "ManageDoer";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
               "ManageDoer",
               "ManageDoer/{action}/{id}",
               new { controller = "ManageDoer", id = UrlParameter.Optional }
           );

            context.MapRoute(
                "ManageDoer_default",
                "ManageDoer/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}