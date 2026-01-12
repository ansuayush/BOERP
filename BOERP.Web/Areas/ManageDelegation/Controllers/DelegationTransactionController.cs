using BOERP;
using BOERP.Model.Delegation;
using BOERP.Model.DoerTask;
using BOERP.Model.TaskMaster;
using BOERP.Web.Bussiness.BLL;
using BOERP.Web.Bussiness.CommonLib;
using BOERP.Web.Bussiness.Interface;
using BOERP.Web.Controllers;
using Generic;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using Sahaj.API.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageDelegation.Controllers
{

  //  [CustomAuthorizeAttribute]
    public class DelegationTransactionController : Controller
    {
        IManageTask _iManageTask;
        bool isBranch = false;
        public DelegationTransactionController() 
        {
            _iManageTask = new ManageTaskBLL();


            string BranchManager = clsApplicationSetting.GetSessionValue("BranchManager");

            if (BranchManager != "" && BranchManager != null)
            {
                isBranch = true;

            }
        }
      
        [HttpGet]
        public JsonResult GetDelId()
        {
            DelegationMasterModel objDelMaster = new DelegationMasterModel();
            objDelMaster.ID = 0;
            objDelMaster.Type = 4;//This is to get Task_Id and Task_Date
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objDelMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DelegationScreenConstants), ApplicationConstants.DelegationScreenConstants.DelegationData.ToString())), roleId, userid, "GET", out errorMessage);
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
        public JsonResult SaveDelegation(DelegationModel objDelegationModel)
        {
            
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objDelegationModel);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DelegationScreenConstants), ApplicationConstants.DelegationScreenConstants.DelegationData.ToString())), roleId, userid, "POST", out errorMessage);
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
        public JsonResult GetDelegation(int id, int? Type)
        {
            DelegationMasterModel objDelMaster = new DelegationMasterModel();
            objDelMaster.ID = id;
            objDelMaster.Type = Type;
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objDelMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DelegationScreenConstants), ApplicationConstants.DelegationScreenConstants.DelegationData.ToString())), roleId, userid, "GET", out errorMessage);
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
        public JsonResult GetMyDelegation(int id, int? Type, DateTime? fromDate, DateTime? toDate)
        {
            DelegationMasterModel objDelMaster = new DelegationMasterModel();
            objDelMaster.ID = id;
            objDelMaster.Type = Type;//This is for get doer dahsboard
            objDelMaster.FromDate = fromDate;
            objDelMaster.ToDate = toDate;

            CommonMethods objCommonMethods = new CommonMethods();

            if (isBranch == true)
            {
                objDelMaster.Branch = 1;
            }

            string stringTOXml = objCommonMethods.GetXMLFromObject(objDelMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DelegationScreenConstants), ApplicationConstants.DelegationScreenConstants.MyDelegationData.ToString())), roleId, userid, "GET", out errorMessage);
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
        public JsonResult SaveMyDelegation(DelegationModel objDelModel)
        {

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objDelModel);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DelegationScreenConstants), ApplicationConstants.DelegationScreenConstants.MyDelegationData.ToString())), roleId, userid, "GET", out errorMessage);
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
        public JsonResult SaveDelegationAuditTask(DoerAuditModel taskAuditModel)
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
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DelegationScreenConstants), ApplicationConstants.DelegationScreenConstants.AuditDelegationData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult GetDelegationReport(DelegationMasterModel objMasterModel)
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
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.DelegationScreenConstants), ApplicationConstants.DelegationScreenConstants.DelegationDashboardData.ToString())), roleId, userid, "GET", out errorMessage);
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