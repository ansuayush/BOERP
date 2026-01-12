using SahajFramework.CommonClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace BOERP.Web.Controllers
{
    public class BaseController : Controller
    {
        protected bool HasPermission(string menuCode, string actionCode)
        {
            try
            {
                // Get "auth" query string parameter
                var authValue = Request.QueryString["auth"];
                var roleIdCookie = clsApplicationSetting.DecryptQueryString(authValue)[9].ToString();
                var token = clsApplicationSetting.DecryptQueryString(authValue)[0].ToString();
                var ds = Common_SPU.CheckUserPersmission(roleIdCookie, menuCode, actionCode, token);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    return true; // User has permission
                }
                else
                {
                    return false; // User dont has permission
                }
            }
            catch (Exception)
            {

                return false; // User dont has permission
            }
           
        }
    }
}