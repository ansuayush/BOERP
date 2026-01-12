using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageDelegation
{
    public class ManageDelegationAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "ManageDelegation";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {

            context.MapRoute(
                "ManageDelegation",
                "ManageDelegation/{action}/{id}",
                new { controller = "ManageDelegation", id = UrlParameter.Optional }
            );


            context.MapRoute(
                "ManageDelegation_default",
                "ManageDelegation/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}