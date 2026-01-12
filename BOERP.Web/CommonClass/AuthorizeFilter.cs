using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Web;
using System.Web.Mvc;

namespace SahajFramework.CommonClass
{
    public class AuthorizeFilter : ActionFilterAttribute
    {
        public string ActionFor { get; set; }
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            switch (ActionFor)
            {
                case "R":
                    if(clsApplicationSetting.GetSessionValue("Read") != "True")
                    {
                        HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
                    }
                    break;
                case "W":
                    if (clsApplicationSetting.GetSessionValue("Write") != "True")
                    {
                        HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
                    }
                    break;
                case "M":
                    if (clsApplicationSetting.GetSessionValue("Modify") != "True")
                    {
                        HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
                    }
                    break;
                case "D":
                    if (clsApplicationSetting.GetSessionValue("Delete") != "True")
                    {
                        HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
                    }
                    break;
                case "E":
                    if (clsApplicationSetting.GetSessionValue("Export") != "True")
                    {
                        HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
                    }
                    break;
                case "OTP":
                    if (clsApplicationSetting.IsSessionExpired("OTP"))
                    {
                        HttpContext.Current.Response.Redirect("~/Account/OTPValidate");
                    }
                    break;
                default:
                    break;
            }
        }
    }
}