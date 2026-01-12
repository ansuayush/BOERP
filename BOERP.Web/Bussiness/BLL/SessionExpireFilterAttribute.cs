using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Sahaj.API
{
    public class SessionExpireFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            HttpContext ctx = HttpContext.Current;

            if (clsApplicationSetting.GetSessionValue("LoginID")!= null)
            {
                int userID = Convert.ToInt32(clsApplicationSetting.GetSessionValue("LoginID"));               
                if (userID == 0)
                {
                    filterContext.Result = new RedirectResult("~/Account/Logout");
                    base.OnActionExecuting(filterContext);
                    return;
                }
                else
                {
                    base.OnActionExecuting(filterContext);
                    return;
                }

            }
            else
            {
                filterContext.Result = new RedirectResult("~/Home/login");
                base.OnActionExecuting(filterContext);
                return;
            }

        }
    }
}