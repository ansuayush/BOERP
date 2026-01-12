using BOERP.Web.Controllers;
using BOERP.Web.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using OfficeOpenXml;
using SahajFramework.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using CrystalDecisions.Shared;
using CrystalDecisions.CrystalReports.Engine;
namespace BOERP.Web.Areas.ManageSample.Controllers
{

    [CustomAuthorizeAttribute]
    public class ManageSampleController : BaseController
    {
        // GET: BusinessPartner/ManagePartner
        public ActionResult SampleIndex(string auth)
        {
            if (!HasPermission("58", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult SampleIndexDelete(string auth)
        {
            if (!HasPermission("58", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }



        public ActionResult EnterBasicInfo(string auth)
        {
            if (!HasPermission("62", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult PCDashboard(string auth)
        {
            if (!HasPermission("87", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult UserDashboard(string auth)
        {
            if (!HasPermission("91", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult SampleProduction(string auth)
        {
            if (!HasPermission("64", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult QualityCheck(string auth)
        {
            if (!HasPermission("65", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult PackagingAndSalesApproval(string auth)
        {
            if (!HasPermission("66", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }





        public ActionResult EnterBOM(string auth)
        {
            if (!HasPermission("70", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;

            return View();
        }

        public ActionResult EnterFormulationForSample(string auth, int? id)
        {
            if (!HasPermission("70", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.Edit_ID = id;
            return View();
        }


        public ActionResult SampleIngredientsList(string auth)
        {


            ViewBag.Auth = auth;
            return View();
        }



        public ActionResult DispatchSample(string auth, int? isDispatch)
        {
            if (!HasPermission("70", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.isDispatch = isDispatch;
            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult OilSample(string auth, int? isUn)
        {
            if (!HasPermission("82", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.isUn = isUn;
            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult PrintSample(int SampleId, string SampleDetUniqId)
        {
            if (!HasPermission("58", "E"))
            {
                // No need for HttpContext.Current
                string qString = Request.QueryString["auth"];

                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString });
            }

            try
            {
                ReportDocument rd = new ReportDocument();
                string reportPath = Server.MapPath("~/CrystalReport/Sample_Order.rpt");
                rd.Load(reportPath);

                // Apply DB login to main report
                ApplyLogonInfo(rd);

                // Set main report parameter
                rd.SetParameterValue("@Sample_Id", SampleId);

                // Apply login info and set param for subreports


                // Export to disk
                //string fileName = $"Sample_Report_{SampleId}.pdf";
                SampleDetUniqId = SampleDetUniqId.Replace("/", "-");
                string fileName = $"Sample_Report_{SampleDetUniqId}.pdf";

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

        public ActionResult PrintDispatchSample(int SampleId)
        {
            if (!HasPermission("58", "E"))
            {
                // No need for HttpContext.Current
                string qString = Request.QueryString["auth"];

                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString });
            }

            try
            {
                ReportDocument rd = new ReportDocument();
                string reportPath = Server.MapPath("~/CrystalReport/Dispatch_Print.rpt");
                rd.Load(reportPath);

                // Apply DB login to main report
                ApplyLogonInfo(rd);

                // Set main report parameter
                rd.SetParameterValue("@Sample_Id", SampleId);

                // Apply login info and set param for subreports


                // Export to disk
                string fileName = $"Dispatched_Sample_Report_{SampleId}.pdf";
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

        public ActionResult EnterDispatchSample(string auth, int? id, int? isDispatched, int? isUn)
        {
            if (!HasPermission("70", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.isUn = isUn;
            ViewBag.Auth = auth;
            ViewBag.Edit_ID = id;
            ViewBag.isDispatched = isDispatched;
            return View();
        }


        public ActionResult EnterCustomerFeedback(string auth)
        {


            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult Modification(string auth)
        {


            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult EnterModification(string auth)
        {


            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult AddSample(string auth, int? id, int? isDuplicate, string prev_sampId, int? customer_id)
        {
            string actionCode = id > 0 ? "M" : "W";
            if (!HasPermission("58", actionCode))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }
            if (isDuplicate == null)
            {
                isDuplicate = 0;
            }

            ViewBag.Auth = auth;
            ViewBag.Edit_ID = id;
            ViewBag.isDuplicate = isDuplicate;
            ViewBag.prev_sampId = prev_sampId;
            ViewBag.customer_id = customer_id;
            return View();
        }




        public ActionResult ViewSampleDetails(string auth, int? id, int? Status, int? IsApproval)
        {
            if (!HasPermission("58", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.id = id;
            ViewBag.Status = Status;
            ViewBag.IsApproval = IsApproval;
            return View();
        }

        public ActionResult CreateBaseFormulations(string auth, int? id)
        {


            ViewBag.Auth = auth;
            ViewBag.Edit_ID = id;
            return View();
        }


    }

}