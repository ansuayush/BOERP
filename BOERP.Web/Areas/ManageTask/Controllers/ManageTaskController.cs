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
using BOERP; // done
using Generic;
using Sahaj.API.Model; //
using BOERP.Model;
using BOERP.Web.Controllers;

namespace BOERP.Web.Areas.ManageTask.Controllers
{

   // [CustomAuthorizeAttribute]
    public class ManageTaskController : BaseController
    {
        // GET: ManageTask/ManageTask

        IManageTask _iManageTask;
        public ManageTaskController()
        {
            _iManageTask = new ManageTaskBLL();
        }

        public ActionResult AddTaskMaster(string auth,int? id, int? isDuplicate)
        {


            string actionCode = id > 0 && (isDuplicate == 0 || isDuplicate == null) ? "M" : "W";

            if (!HasPermission("23", actionCode))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }


            ViewBag.Auth = auth;
            ViewBag.EditId = id == null ? 0 : id;
            ViewBag.isDuplicate = isDuplicate == null ? 0 : isDuplicate;
            return View();
        }
        public ActionResult TaskMaster(string auth)
        {

            if (!HasPermission("23", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }


            ViewBag.Auth = auth;

            return View();
        }

        public ActionResult TaskReport(string auth)
        {

            
            if (!HasPermission("24", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        /// <summary>
        /// This method is used to save the task master data.
        /// </summary>
        /// <param name="objTagMaster"> this is taskmast model</param>
        /// <returns></returns>

        [HttpPost]
        public JsonResult SaveTaskMaster(TaskModel objTagMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTagMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.TaskMasterConstants), ApplicationConstants.TaskMasterConstants.TaskMasterData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult GetTaskMasterById(int id, int? Type, int? Branch)
        {
            TaskMasterModel objTagMaster = new TaskMasterModel();
            objTagMaster.ID = id;
            objTagMaster.Type = Type == null ? 0 : Convert.ToInt32(Type);   
            objTagMaster.Branch = Branch == null ? 0 : Convert.ToInt32(Branch);

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTagMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.TaskMasterConstants), ApplicationConstants.TaskMasterConstants.TaskMasterData.ToString())), roleId, userid, "GET", out errorMessage);

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

                return new JsonResult { Data = objCustomResponseModel, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }


        }

        [HttpGet]
        public JsonResult BindTaskMaster()
        {
            TaskMasterModel objTagMaster = new TaskMasterModel();
            objTagMaster.ID = 0;
            objTagMaster.Type = 1;//This is for get ids
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTagMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.TaskMasterConstants), ApplicationConstants.TaskMasterConstants.TaskMasterData.ToString())), roleId, userid, "GET", out errorMessage);
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

        public JsonResult BindTaskInactiveMaster()
        {
            TaskMasterModel objTagMaster = new TaskMasterModel();
            objTagMaster.ID = 0;
            objTagMaster.Type = 2;//This is for get ids
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTagMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.TaskMasterConstants), ApplicationConstants.TaskMasterConstants.TaskMasterData.ToString())), roleId, userid, "GET", out errorMessage);
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
        public JsonResult GetTaskId()
        {
            TaskMasterModel objTagMaster = new TaskMasterModel();
            objTagMaster.ID = 0;
            objTagMaster.Type = 4;//This is to get Task_Id and Task_Date
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTagMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.TaskMasterConstants), ApplicationConstants.TaskMasterConstants.TaskMasterData.ToString())), roleId, userid, "GET", out errorMessage);
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
        public JsonResult DeleteTaskMasterById(TaskModel objTagMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objTagMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.TaskMasterConstants), ApplicationConstants.TaskMasterConstants.TaskMasterData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult GetTaskReport(TaskReportModel objMasterModel)
        {



            CommonMethods objCommonMethods = new CommonMethods();


            string stringTOXml = objCommonMethods.GetXMLFromObject(objMasterModel);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.TaskMasterConstants), ApplicationConstants.TaskMasterConstants.TaskMasterReport.ToString())), roleId, userid, "GET", out errorMessage);
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