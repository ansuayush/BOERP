using Microsoft.VisualBasic;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BOERP.Web.Bussiness.BLL;
using BOERP.Web.Bussiness.Interface;
using BOERP.Web.Bussiness.CommonLib;
using BOERP.Model.TaskMaster;
using BOERP.Model.DoerTask;
using BOERP;
using Generic;
using Sahaj.API.Model;
using BOERP.Web.Controllers;


namespace BOERP.Web.Areas.ManageDelegation.Controllers
{
    [CustomAuthorizeAttribute]

    public class ManageDelegationController : BaseController
    {
        // GET: ManageDelegation/ManageDelegation
        public ActionResult AddDelegation(string auth, int? id, int? isDuplicate)
        {

            if (!HasPermission("35", "W"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.Id = id;
            ViewBag.isDuplicate = isDuplicate == null ? 0 : isDuplicate;
            return View();
        }

        public ActionResult Delegation(string auth)
        {

            if (!HasPermission("35", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult AddDoerDelegation(string auth, int id, int? isEA)
        {

            if (!HasPermission("36", "W"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.Id = id;
            ViewBag.IsEA = isEA;

            return View();
        }

        public ActionResult MyDelegation(string auth)
        {

            if (!HasPermission("36", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult EditDelegation(string auth,int id)
        {

            if (!HasPermission("35", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.Id = id;

            return View();
        }

        public ActionResult ViewDelegation(string auth, int? id)
        {
            if (!HasPermission("35", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.Id = id;

            return View();
        }

        public ActionResult AfterPendingDelegation(string auth, int? id, int? isCompleted)
        {
            if (!HasPermission("35", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.Id = id;
            ViewBag.isCompleted = isCompleted;

            return View();
        }


        public ActionResult AfterPendingMyDelegation(string auth,int? id, int? isAudit, int? isCompleted)
        {
            if (!HasPermission("36", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.Id = id;
            ViewBag.isAudit = isAudit;
            ViewBag.isCompleted = isCompleted;

            return View();
        }

        public ActionResult DelegationDashboard(string auth)
        {

            if (!HasPermission("37", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }
    }
}