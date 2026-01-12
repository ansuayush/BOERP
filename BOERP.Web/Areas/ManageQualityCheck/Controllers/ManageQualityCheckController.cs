using BOERP.Web.Controllers;
using BOERP.Web.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;

namespace BOERP.Web.Areas.ManageQualityCheck.Controllers
{

    [CustomAuthorizeAttribute]
    public class ManageQualityCheckController : BaseController
    {
        // GET: QualityCheck/QualityCheck
        public ActionResult QCParameters(string auth)
        {
            if (!HasPermission("73", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult QCCheckInitiated(string auth)
        {
            if (!HasPermission("74", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }



        public ActionResult MicrobiologyTest(string auth)
        {
            if (!HasPermission("75", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult RejectedQuantity(string auth)
        {
            if (!HasPermission("76", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult QCFMS(string auth)
        {
            if (!HasPermission("79", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult PrintCOA_RM_PM(int GRNItemId, string ARNumber)
        {

            if (!HasPermission("79", "E"))
            {
                // No need for HttpContext.Current
                string qString = Request.QueryString["auth"];

                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString });
            }

            try
            {
                ReportDocument rd = new ReportDocument();
                string reportPath = Server.MapPath("~/CrystalReport/QC_COA_Print_RM_PM.rpt");
                rd.Load(reportPath);

                // Apply DB login to main report
                ApplyLogonInfo(rd);

                // Set main report parameter
                rd.SetParameterValue("@GRNItemId", GRNItemId);

                // Apply login info and set param for subreports

               // string[] subreports = { "QC_Micro_Test" }; // Add more subreports if needed 
                
                    ReportDocument sub = rd.OpenSubreport("QC_Micro_Test");
                    ApplyLogonInfo(sub);

                    rd.SetParameterValue("@GRNItemId", GRNItemId, "QC_Micro_Test");
                


                // Export to disk
                string fileName = $"COA_Report_RM_&_PM_{ARNumber}.pdf";
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

        public ActionResult PrintCOA_FG_Oil(int GRNItemId, string ARNumber)
        {

            if (!HasPermission("79", "E"))
            {
                // No need for HttpContext.Current
                string qString = Request.QueryString["auth"];

                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString });
            }

            try
            {
                ReportDocument rd = new ReportDocument();
                string reportPath = Server.MapPath("~/CrystalReport/QC COA Print_Oil_SFG_FG.rpt");
                rd.Load(reportPath);

                // Apply DB login to main report
                ApplyLogonInfo(rd);

                // Set main report parameter
                rd.SetParameterValue("@GRNItemId", GRNItemId);

                // Apply login info and set param for subreports

                string[] subreports = { "Micro_Test" }; // Add more subreports if needed 

                foreach (string subName in subreports)
                {
                    ReportDocument sub = rd.OpenSubreport(subName);
                    ApplyLogonInfo(sub);

                    rd.SetParameterValue("@GRNItemId", GRNItemId, subName);
                }


                // Export to disk
                string fileName = $"COA_Report_FG_Oil_and_SFY_{ARNumber}.pdf";
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

        public ActionResult PrintMLT_Report(int GRNItemId, string ARNumber)
        {

            if (!HasPermission("79", "E"))
            {
                // No need for HttpContext.Current
                string qString = Request.QueryString["auth"];

                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString });
            }

            try
            {
                ReportDocument rd = new ReportDocument();
                string reportPath = Server.MapPath("~/CrystalReport/QC-MLT Report.rpt");
                rd.Load(reportPath);

                // Apply DB login to main report
                ApplyLogonInfo(rd);

                // Set main report parameter
                rd.SetParameterValue("@GRNItemId", GRNItemId);

                // Apply login info and set param for subreports
                string[] subreports = { "SR_MEDIA" }; // Add more subreports if needed 

                foreach (string subName in subreports)
                {
                    ReportDocument sub = rd.OpenSubreport(subName);
                    ApplyLogonInfo(sub);

                    rd.SetParameterValue("@GRNItemId", GRNItemId, subName);
                }

                // Export to disk
                string fileName = $"MLT_Report_{ARNumber}.pdf";
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

        public ActionResult PrintARN_Label(int GRNItemId, int GRNDocNo)
        {

            if (!HasPermission("79", "E"))
            {
                // No need for HttpContext.Current
                string qString = Request.QueryString["auth"];

                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString });
            }

            try
            {
                ReportDocument rd = new ReportDocument();
                string reportPath = Server.MapPath("~/CrystalReport/ARN Label Print.rpt");
                rd.Load(reportPath);

                // Apply DB login to main report
                ApplyLogonInfo(rd);

                // Set main report parameter
                rd.SetParameterValue("@GRNItemId", GRNItemId);


                // Export to disk
                string fileName = $"ARn_Label_{GRNDocNo}.pdf";
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




    }

}