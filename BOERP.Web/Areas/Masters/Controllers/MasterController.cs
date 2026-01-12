using BOERP.Web.Controllers;
using SahajFramework.CommonClass;
using SahajFramework.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SahajFramework.Web.Areas.Masters.Controllers
{
    [CustomAuthorizeAttribute]
    public class MasterController : BaseController
    {
        // GET: Masters/Master
        public ActionResult Index(string auth)
        {
            if (!HasPermission("47", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }
        public ActionResult DocumentNumbering(string auth)
        {
            
            if (!HasPermission("49", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.CompanyID=   clsApplicationSetting.GetSessionValue("CompanyId");
            return View();
        }
        public ActionResult ControlInformation(string auth)
        {

            if (!HasPermission("48", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }        
        public ActionResult RoleMenuManagement(string auth, int? hack, string roleId)
        {   
            ViewBag.Auth = auth;
            ViewBag.hack  = hack > 0 ? hack : 0;
            ViewBag.RoleId = roleId;
            return View();
        }

        public ActionResult FMSStepsPermission(string auth, string roleId)
        {
            ViewBag.Auth = auth;
            ViewBag.RoleId = roleId;
            return View();
        }
    }
}