using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Web;
using System.Web.Mvc;

namespace SahajFramework.CommonClass
{
    public class CheckOnlyLoginFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            string CurrentSession = "";
            long LoginID = 0;
            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            if (clsApplicationSetting.GetWebConfigValue("AllowMultipleLogin") == "Y")
            {
                CurrentSession = clsDataBaseHelper.fnGetOther_FieldName("Userman", "SessionID", "ID", LoginID.ToString(), "");
            }
            if (HttpContext.Current.Session["LoginID"] == null)
            {
                string ReturnURL = HttpContext.Current.Request.Url.AbsoluteUri;
                HttpContext.Current.Response.Redirect("~/Account/Login?ReturnURL=" + clsApplicationSetting.EncryptFriendly(ReturnURL));

            }
            //else if (!string.IsNullOrEmpty(CurrentSession) && CurrentSession != filterContext.HttpContext.Session.SessionID.ToString())
            //{
            //    HttpContext.Current.Response.Redirect("/Account/Logout");
            //}

        }
    }
}