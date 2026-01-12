using System.Web.Mvc;

namespace BOERP.Web.Areas.EmailTemplates
{
    public class EmailTemplatesAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "EmailTemplates";
            }
        }        
        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
               "EmailTemplates",
               "EmailTemplates/{action}/{id}",
               new { controller = "EmailTemplates", id = UrlParameter.Optional }
           );

            context.MapRoute(
                "EmailTemplates_default",
                "EmailTemplates/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}