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

namespace BOERP.Web.Areas.ManageDoer.Controllers
{
   // [CustomAuthorizeAttribute]
    public class ManageDoerController : BaseController
    {

        IManageTask _iManageTask;
        public ManageDoerController()
        {
            _iManageTask = new ManageTaskBLL();
        }
        public ActionResult DoerDashBoard(string auth) {

            if (!HasPermission("27", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }


            ViewBag.Auth = auth;
            return View(); 
        
        }

        public ActionResult AddDoerTask(string auth,int id)
        {

            if (!HasPermission("27", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.id = id;
            return View();

        }

        public ActionResult AddPcTask(string auth, int id)
        {

            if (!HasPermission("26", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;

            ViewBag.id = id;
            return View();

        }

        public ActionResult PcTaskCancelled(string auth, int id)
        {
            if (!HasPermission("26", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.id = id;
            return View();

        }

        public ActionResult DoerTaskAudit(string auth, int id)
        {
            if (!HasPermission("27", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.id = id;
            return View();
        }

        public ActionResult PcTaskAudit(string auth, int id)
        {
            if (!HasPermission("26", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.id = id;
            return View();
        }

        public ActionResult PcTaskCompleted(string auth, int id)
        {
            if (!HasPermission("26", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.id = id;
            return View();
        }

        public ActionResult DoerTaskCompleted(string auth, int id)
        {
            if (!HasPermission("27", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.id = id;
            return View();
        }

        public ActionResult DoerTaskReattempt(string auth, int id)
        {
            if (!HasPermission("27", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.id = id;
            return View();
        }

        public ActionResult PCTaskReattempt(string auth, int id)
        {
            if (!HasPermission("26", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.id = id;
            return View();
        }

        public ActionResult PCTaskReattemptCancelled(string auth, int id)
        {
            if (!HasPermission("26", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.id = id;
            return View();
        }

        public ActionResult PcDashBoard(string auth)
        {
            if (!HasPermission("26", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();

        }


        [HttpGet]
        public JsonResult BindDoerDashBoard(DateTime? fromDate, DateTime? toDate)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = 0;
            objTaskSchedule.Type = 1;//This is for get doer dahsboard
            objTaskSchedule.FromDate = fromDate;
            objTaskSchedule.ToDate = toDate;
            
            bool isBranch = false;
            string BranchManager = clsApplicationSetting.GetSessionValue("BranchManager");

            if (BranchManager != "" && BranchManager != null)
            {
                isBranch = true;

            }
            if (isBranch == true)
            {
                objTaskSchedule.Branch = 1;
            }
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.DoerData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpGet]
        public JsonResult BindInProgressDashBoard(DateTime? fromDate, DateTime? toDate)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = 0;
            objTaskSchedule.Type = 5;//This is for get doer dahsboard of in progress tasks
            objTaskSchedule.FromDate = fromDate;
            objTaskSchedule.ToDate = toDate;
            bool isBranch = false;
            string BranchManager = clsApplicationSetting.GetSessionValue("BranchManager");

            if (BranchManager != "" && BranchManager != null)
            {
                isBranch = true;

            }
            if (isBranch == true)
            {
                objTaskSchedule.Branch = 1;
            }
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.DoerData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }


        [HttpGet]
        public JsonResult BindPcDashBoard( DateTime ? fromDate, DateTime? toDate)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = 0;
            objTaskSchedule.Type = 1;//This is for get Pc dahsboard
            objTaskSchedule.FromDate= fromDate;
            objTaskSchedule.ToDate= toDate;
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.PcData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpGet]
        public JsonResult BindInProgressPcDashBoard(DateTime? fromDate, DateTime? toDate)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = 0;
            objTaskSchedule.Type = 6;//This is for get Pc dahsboard
            objTaskSchedule.FromDate = fromDate;
            objTaskSchedule.ToDate = toDate;
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.PcData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpGet]
        public JsonResult GetDoerTaskById(int id)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = id;
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.DoerData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        [HttpPost]
        public JsonResult SaveDoerModel(DoerModel doerModel)
        {

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(doerModel);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.DoerData.ToString())), roleId, userid, "Save", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpPost]
        public JsonResult SavePcTask(PcModel pcModel)
        {

            CommonMethods objCommonMethods = new CommonMethods();


            string stringTOXml = objCommonMethods.GetXMLFromObject(pcModel);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.PcData.ToString())), roleId, userid, "Save", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpGet]
        public JsonResult GetPcDetailsById(int id)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = id;
            objTaskSchedule.Type = 2;//This is for get Pc Remarks
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.PcData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpPost]
        public JsonResult SavePcCancellation(PcModel pcModel)
        {

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(pcModel);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.PcData.ToString())), roleId, userid, "Save", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpGet]
        public JsonResult BindPcCancelledDashBoard(DateTime? fromDate, DateTime? toDate)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = 0;
            objTaskSchedule.Type = 3;//This is for get Pc dahsboard of cancelled tasks
            objTaskSchedule.FromDate = fromDate;
            objTaskSchedule.ToDate = toDate;
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.PcData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpGet]
        public JsonResult GetPcCancelledTaskById(int id)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = id;
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.PcData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        [HttpGet]
        public JsonResult BindPcPendingForAuditDashBoard(DateTime? fromDate, DateTime? toDate)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = 0;
            objTaskSchedule.Type = 4;//This is for get Pc dahsboard of pending for audit tasks in which pc is audit controller
            objTaskSchedule.FromDate = fromDate;
            objTaskSchedule.ToDate = toDate;
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.PcData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpGet]
        public JsonResult BindDoerPendingForAuditDashBoard(DateTime? fromDate, DateTime? toDate)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = 0;
            objTaskSchedule.Type = 2;//This is for get doer dahsboard
            objTaskSchedule.FromDate = fromDate;
            objTaskSchedule.ToDate = toDate;
            if (clsApplicationSetting.GetSessionValue("RoleIDs") == "0")
            {
                objTaskSchedule.Branch = 1;
            }
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.DoerData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpPost]
        public JsonResult SaveDoerAuditTask(TaskAuditModel taskAuditModel)
        {

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(taskAuditModel);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.DoerAuditData.ToString())), roleId, userid, "Save", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpGet]
        public JsonResult BindDoerCompletedDashBoard(DateTime? fromDate, DateTime? toDate)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = 0;
            objTaskSchedule.Type = 3;//This is for get doer dahsboard
            objTaskSchedule.FromDate = fromDate;
            objTaskSchedule.ToDate = toDate;
            bool isBranch = false;
            string BranchManager = clsApplicationSetting.GetSessionValue("BranchManager");

            if (BranchManager != "" && BranchManager != null)
            {
                isBranch = true;

            }
            if (isBranch == true)
            {
                objTaskSchedule.Branch = 1;
            }
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.DoerData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpGet]
        public JsonResult BindPcCompletedDashBoard(DateTime ?fromDate, DateTime ?toDate)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = 0;
            objTaskSchedule.Type = 5;//This is for get doer dahsboard
            objTaskSchedule.FromDate = fromDate;
            objTaskSchedule.ToDate = toDate;
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.PcData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpGet]
        public JsonResult BindDoerReattemptDashBoard(DateTime? fromDate, DateTime? toDate)
        {
            TaskScheduleModel objTaskSchedule = new TaskScheduleModel();
            objTaskSchedule.id = 0;
            objTaskSchedule.Type = 4;//This is for get doer dahsboard for reattempt
            objTaskSchedule.FromDate = fromDate;
            objTaskSchedule.ToDate = toDate;
            bool isBranch = false;
            string BranchManager = clsApplicationSetting.GetSessionValue("BranchManager");

            if (BranchManager != "" && BranchManager != null)
            {
                isBranch = true;

            }
            if (isBranch == true)
            {
                objTaskSchedule.Branch = 1;
            }
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTaskSchedule);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.DoerData.ToString())), roleId, userid, "GET", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);

                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpPost]
        public JsonResult SaveDoerReattemptModel(DoerModel doerModel)
        {

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(doerModel);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DoerScreenConstants), ApplicationConstants.DoerScreenConstants.DoerReattemptData.ToString())), roleId, userid, "Save", out errorMessage);
                string jsonData = JsonConvert.SerializeObject(data);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }


    }

}