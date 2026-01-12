using BOERP.Web.Controllers;
using BOERP.Web.Models;
using CrystalDecisions.Shared;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using OfficeOpenXml;
using Syncfusion.EJ2.Layouts;
using Syncfusion.EJ2.Spreadsheet;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using System.Web.Script.Serialization;

namespace BOERP.Web.Areas.ManageOrder.Controllers
{

    [CustomAuthorizeAttribute]
    public class ManageOrderController : BaseController
    {

        #region Manage Order Process
        // GET: ManageOrder/ManageOrder

        public ActionResult OrderList(string auth)
        {
            if (!HasPermission("78", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult PrintQualityCheckReport(int OrderId, string OrderDocNo)
        {

            if (!HasPermission("78", "E"))
            {
                // No need for HttpContext.Current
                string qString = Request.QueryString["auth"];

                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString });
            }

            try
            {
                ReportDocument rd = new ReportDocument();
                string reportPath = Server.MapPath("~/CrystalReport/Order_QC_form_RPT.rpt");
                rd.Load(reportPath);

                // Apply DB login to main report
                ApplyLogonInfo(rd);

                // Set main report parameter
                rd.SetParameterValue("@OrderId", OrderId);

                // Apply login info and set param for subreports
                string[] subreports = { "FMS" }; // Add more subreports if needed
                foreach (string subName in subreports)
                {
                    ReportDocument sub = rd.OpenSubreport(subName);
                    ApplyLogonInfo(sub);

                    rd.SetParameterValue("@OrderId", OrderId, subName);
                }

                // Export to disk'
                OrderDocNo = OrderDocNo.Replace("/", "-");
                string fileName = $"Quality_Check_Report_{OrderDocNo}.pdf";
                string exportPath = Server.MapPath("~/Attachments/PDF/" + fileName);

                if (System.IO.File.Exists(exportPath))
                    System.IO.File.Delete(exportPath);

                rd.ExportToDisk(ExportFormatType.PortableDocFormat, exportPath);

                if (rd != null) { rd.Close(); rd.Dispose(); }

                // Return the file
                return File(exportPath, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(500, "Error generating report: " + ex.Message);
            }
        }

        private void ApplyLogonInfo(ReportDocument report)
        {
            string constr = clsDataBaseHelper.getConnectionStr();
            var builder = new System.Data.Common.DbConnectionStringBuilder { ConnectionString = constr };

            string servername = builder["Data Source"].ToString();
            string db = builder["Initial Catalog"].ToString();
            string userid = builder["User ID"].ToString();
            string pswd = builder.ContainsKey("Password") ? builder["Password"].ToString() : "";

            foreach (Table table in report.Database.Tables)
            {
                TableLogOnInfo tli = table.LogOnInfo;
                tli.ConnectionInfo.ServerName = servername;
                tli.ConnectionInfo.DatabaseName = db;
                tli.ConnectionInfo.UserID = userid;
                tli.ConnectionInfo.Password = pswd;
                table.ApplyLogOnInfo(tli);
            }
        }
        public ActionResult O2DPrivateLabel(string auth)
        {
            if (!HasPermission("94", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult O2DPrivateLabelFMS(string auth)
        {
            if (!HasPermission("95", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult VerifySFGBOM(string auth)
        {
            if (!HasPermission("95", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult VerifyPMBOM(string auth)
        {
            if (!HasPermission("95", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult GrossMarginApprove(string auth)
        {
            if (!HasPermission("95", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult GrossMarginApproval(string auth)
        {
            if (!HasPermission("95", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult ViewSalesOrder(string auth, int id = 0, string type="")
        {
            if (!HasPermission("78", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.Type = type;
            ViewBag.PageType = "View";
            ViewBag.OrderId = id;

            return View();
        }


        public ActionResult BulkOrder(string auth, int? isDuplicate, int id = 0)
        {
            if (!HasPermission("78", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.BT = "Submit";
            if (id > 0)
            {
                ViewBag.PH = "Update Order";
                ViewBag.BT = "Update";
            }
            if (isDuplicate == null)
            {
                isDuplicate = 0;
            }
            ViewBag.BulkOrderId = id;
            ViewBag.isDuplicate = isDuplicate;

            return View();
        }
        public ActionResult CreateOrder(string auth, int? isDuplicate, int id = 0, string type = "")
        {
            if (!HasPermission("78", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.BT = "Submit";
            if (id > 0)
            {
                ViewBag.PH = "Update Order";
                ViewBag.BT = "Update";
            }

            if (isDuplicate == null)
            {
                isDuplicate = 0;
            }

            ViewBag.OrderId = id;
            ViewBag.Type = type;
            ViewBag.isDuplicate = isDuplicate;
            return View();
        }


        public ActionResult OR2OCFMS(string auth)
        {
            if (!HasPermission("90", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;


            return View();
        }

        public ActionResult OrderDetails(string auth)
        {
            if (!HasPermission("78", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult CostingSheetBreakup(string auth)
        {
            if (!HasPermission("78", "R"))
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