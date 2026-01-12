using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageTask
{
    public class ManageTaskAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "ManageTask";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
               "ManageTask",
               "ManageTask/{action}/{id}",
               new { controller = "ManageTask", id = UrlParameter.Optional }
           );

            context.MapRoute(
                "ManageTask_default",
                "ManageTask/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}