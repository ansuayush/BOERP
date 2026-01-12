using BOERP.Web.Controllers;
using BOERP.Web.Models;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Xml.Linq;


namespace BOERP.Web.Areas.ManageBOM.Controllers
{
    [CustomAuthorizeAttribute]
    public class ManageBOMController : BaseController
    {
        #region Manage BOM Process

        // GET: Manage BOM

        //R - Read/View
        //M- Modify/Update
        //W-Add/Save
        //D- Delete or Active Deactivate
        //E- Export

        public ActionResult BOMList(string auth)
        {
            if (!HasPermission("86", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult FGBOMList(string auth)
        {
            if (!HasPermission("89", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult CreateBOM(string auth, int bomId = 0)
        {
            string IsPermission = bomId == 0 ? "W" : "M";
            if (!HasPermission("86", IsPermission))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }


            ViewBag.Auth = auth;
            ViewBag.PH = "Create BOM";
            ViewBag.BT = "Submit";

            if (bomId > 0)
            {
                ViewBag.PH = "Update BOM";
                ViewBag.BT = "Update";
            }
            ViewBag.bomId = bomId;
            return View();
        }

        public ActionResult CreateBOMFG(string auth, int? IsEdit, int bomId = 0)
        {
            string IsPermission = bomId == 0 ? "W" : "M";
            if (!HasPermission("89", IsPermission))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }


            ViewBag.Auth = auth;
            ViewBag.IsEdit = IsEdit > 0 ? IsEdit : 0;
            ViewBag.PH = "Create Finished Goods BOM";
            ViewBag.BT = "Submit";

            if (bomId > 0)
            {
                ViewBag.PH = "Update Finished Goods  BOM";
                ViewBag.BT = "Update";
            }
            ViewBag.bomId = bomId;
            return View();
        }

        #endregion
    }
}