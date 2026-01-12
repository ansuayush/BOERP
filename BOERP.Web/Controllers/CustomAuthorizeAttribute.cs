using SahajFramework.CommonClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;

namespace BOERP.Web.Controllers
{
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    { 
        protected override bool AuthorizeCore(System.Web.HttpContextBase httpContext)
        {
            // Get "auth" query string parameter
            var authValue = httpContext.Request.QueryString["auth"];  
            var token = clsApplicationSetting.DecryptQueryString(authValue)[0].ToString();
            var data = Common_SPU.CheckValidToken(token);

            if (data != null && data.Tables.Count > 0 && data.Tables[0].Rows.Count > 0)
            {
                return true; // User has permission
            }
            else
            {
                return false; // User dont has permission
            }
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
           
            filterContext.Result = new RedirectToRouteResult(
                     new RouteValueDictionary(new
                     {
                         area = "", // Ensures it doesn't inherit the area
                         controller = "Account",
                         action = "PageNotFound"
                     })
                 );
        }

    }
}