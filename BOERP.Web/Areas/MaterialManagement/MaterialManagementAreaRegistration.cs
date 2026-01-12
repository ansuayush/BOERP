using System.Web.Mvc;

namespace BOERP.Web.Areas.MaterialManagement
{
    public class MaterialManagementAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "MaterialManagement";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "MaterialManagement_default",
                "MaterialManagement/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}