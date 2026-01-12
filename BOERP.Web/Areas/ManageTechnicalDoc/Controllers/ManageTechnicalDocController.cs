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


namespace BOERP.Web.Areas.ManageTechnicalDoc.Controllers
{
    [CustomAuthorizeAttribute]
    public class ManageTechnicalDocController : BaseController
    {
        #region Manage Technical Doc Process

        // GET: ManageTechnicalDoc

        public ActionResult TechnicalDocList(string auth)
        {
            if (!HasPermission("84", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult TechnicalDocFMS(string auth)
        {
            if (!HasPermission("85", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();

        }

        #endregion

    }
}