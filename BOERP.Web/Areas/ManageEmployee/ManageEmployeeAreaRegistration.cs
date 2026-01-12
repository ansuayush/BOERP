using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageEmployee
{
    public class ManageEmployeeAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "ManageEmployee";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
               "ManageEmployee",
               "ManageEmployee/{action}/{id}",
               new { controller = "ManageEmployee", id = UrlParameter.Optional }
           );

            context.MapRoute(
                "ManageEmployee_default",
                "ManageEmployee/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}