using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SahajFramework.CommonClass
{
    public class SimpleCheckLogin: ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (HttpContext.Current.Session["UserID"] == null)
            {
                string ReturnURL = HttpContext.Current.Request.Url.AbsoluteUri;
                HttpContext.Current.Response.Redirect("~/Users/SignIn?ReturnURL=" + clsApplicationSetting.EncryptFriendly(ReturnURL));
            }

        }
    }
}