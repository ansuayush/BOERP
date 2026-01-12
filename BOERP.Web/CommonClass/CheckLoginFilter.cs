using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Web;
using System.Web.Mvc;

namespace SahajFramework.CommonClass
{
    public class CheckLoginFilter : ActionFilterAttribute
    {
        //public override void OnActionExecuting(ActionExecutingContext filterContext)
        //  {
        //    string CurrentSession = "";
        //    long LoginID = 0;

        //    long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
        //    string[] Requestedsrc = null;
        //    string actionName = (string)filterContext.RouteData.Values["action"];
        //    Requestedsrc = clsApplicationSetting.DecryptQueryString(HttpContext.Current.Request.QueryString["src"]);
        //    if (Requestedsrc != null)
        //    {
        //        if (Requestedsrc.Length > 3 && Requestedsrc[3] != "")
        //        {
        //            if (Requestedsrc[3] == "Mobile")
        //            {
        //                LoginID = Convert.ToInt64(Requestedsrc[4]);
        //            }



        //        }
        //    }

        //    if (clsApplicationSetting.GetWebConfigValue("AllowMultipleLogin") == "Y")
        //    {
        //        CurrentSession = clsDataBaseHelper.fnGetOther_FieldName("Userman", "SessionID", "ID", LoginID.ToString(), "");
        //    }
        //    string[] ignorePage = { "dashboard","employeesexceltoexport", "employeesexceltoexportreport", "UserGrievanceList" };


        //    if (HttpContext.Current.Request.HttpMethod == "GET")
        //    {
        //        Requestedsrc = clsApplicationSetting.DecryptQueryString(HttpContext.Current.Request.QueryString["src"]);
        //    }
        //    else
        //    {
        //        if (filterContext.Controller.ValueProvider.GetValue("src") != null)
        //        {
        //            Requestedsrc = clsApplicationSetting.DecryptQueryString(filterContext.Controller.ValueProvider.GetValue("src").AttemptedValue);
        //        }
        //    }
        //    //if (HttpContext.Current.Session["LoginID"] == null)
        //    //{
        //    //    string ReturnURL = HttpContext.Current.Request.Url.AbsoluteUri;
        //    //    HttpContext.Current.Response.Redirect("~/Account/Login?ReturnURL=" + clsApplicationSetting.EncryptFriendly(ReturnURL));

        //    //}
        //    if (LoginID == 0)
        //    {
        //        string ReturnURL = HttpContext.Current.Request.Url.AbsoluteUri;
        //        HttpContext.Current.Response.Redirect("~/Account/Login?ReturnURL=" + clsApplicationSetting.EncryptFriendly(ReturnURL));

        //    }

        //    else if (!ignorePage.Contains(actionName.ToLower()) && Requestedsrc==null)
        //    {
        //        HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
        //    }           
        //    else if (!ignorePage.Contains(actionName.ToLower()) && HttpContext.Current.Request.Url.AbsolutePath.ToLower() != Requestedsrc[1].ToLower())
        //    {
        //        HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
        //    }
        //    else if (Requestedsrc == null)
        //    {
        //        if (Requestedsrc != null && !clsApplicationSetting.CheckPageViewPermission(Requestedsrc[0]).ReadFlag)
        //        {
        //            HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
        //        }
        //    }
        //    //else if (Requestedsrc != null && !clsApplicationSetting.CheckPageViewPermission(Requestedsrc[0]).ReadFlag)
        //    //{
        //    //    HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
        //    //}
        //    else if (!string.IsNullOrEmpty(CurrentSession) &&  CurrentSession != filterContext.HttpContext.Session.SessionID.ToString())
        //    {
        //        HttpContext.Current.Response.Redirect("/Account/Logout");
        //    }

        //}

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            string CurrentSession = "";
            long LoginID = 0;

            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            string[] Requestedsrc = null;
            string actionName = (string)filterContext.RouteData.Values["action"];
            Requestedsrc = clsApplicationSetting.DecryptQueryString(HttpContext.Current.Request.QueryString["src"]);
            if (Requestedsrc != null && !clsApplicationSetting.CheckPageViewPermission(Requestedsrc[0], LoginID).ReadFlag)
            {
                if (Requestedsrc.Length > 3 && Requestedsrc[3] != "" )
                {
                    if (Requestedsrc[3] == "Mobile")
                    {
                        LoginID = Convert.ToInt64(Requestedsrc[4]);
                    }



                }
            }

            if (clsApplicationSetting.GetWebConfigValue("AllowMultipleLogin") == "Y")
            {
                CurrentSession = clsDataBaseHelper.fnGetOther_FieldName("Userman", "SessionID", "ID", LoginID.ToString(), "");
            }
            string[] ignorePage = { "dashboard", "employeesexceltoexport", "employeesexceltoexportreport", "UserGrievanceList" };


            if (HttpContext.Current.Request.HttpMethod == "GET")
            {
                Requestedsrc = clsApplicationSetting.DecryptQueryString(HttpContext.Current.Request.QueryString["src"]);
            }
            else
            {
                if (filterContext.Controller.ValueProvider.GetValue("src") != null)
                {
                    Requestedsrc = clsApplicationSetting.DecryptQueryString(filterContext.Controller.ValueProvider.GetValue("src").AttemptedValue);
                }
            }
            //if (HttpContext.Current.Session["LoginID"] == null)
            //{
            //    string ReturnURL = HttpContext.Current.Request.Url.AbsoluteUri;
            //    HttpContext.Current.Response.Redirect("~/Account/Login?ReturnURL=" + clsApplicationSetting.EncryptFriendly(ReturnURL));

            //}
            if (LoginID == 0)
            {
                string ReturnURL = HttpContext.Current.Request.Url.AbsoluteUri;
                HttpContext.Current.Response.Redirect("~/Account/Login?ReturnURL=" + clsApplicationSetting.EncryptFriendly(ReturnURL));

            }

            else if (!ignorePage.Contains(actionName.ToLower()) && Requestedsrc == null)
            {
                HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
            }
            else if (!ignorePage.Contains(actionName.ToLower()) && HttpContext.Current.Request.Url.AbsolutePath.ToLower() != Requestedsrc[1].ToLower())
            {
                HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
            }
            else if (Requestedsrc == null )
            {
                if (Requestedsrc != null && !clsApplicationSetting.CheckPageViewPermission(Requestedsrc[0], LoginID).ReadFlag)
                {
                    HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
                }
            }

            //else if (Requestedsrc != null && !clsApplicationSetting.CheckPageViewPermission(Requestedsrc[0], LoginID).ReadFlag)
            //{

            //    HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
            //}
            //else if (!string.IsNullOrEmpty(CurrentSession) && CurrentSession != filterContext.HttpContext.Session.SessionID.ToString())
            //{
            //    HttpContext.Current.Response.Redirect("/Account/Logout");
            //}

        }
    }
}