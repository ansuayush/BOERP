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
using SahajFramework.CommonClass;
using System.Data;
using BOERP.Model.Employee;
using BOERP;
using Generic;
using Sahaj.API.Model;
using BOERP.Web.Controllers;
namespace BOERP.Web.Areas.ManageEmployee.Controllers
{
 //  [CustomAuthorizeAttribute]
    public class ManageEmployeeController : BaseController
    {
        // GET: ManageTask/ManageTask

        IManageTask _iManageTask;
        public ManageEmployeeController()
        {
            _iManageTask = new ManageTaskBLL();
        }
      
        public ActionResult EmployeeMaster(string auth)
        {
            if (!HasPermission("12", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view

            }
            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult AddBranchMaster(string auth,int? id)
        {
            if (!HasPermission("42", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.EditId = id == null ? 0 : id;
            return View();
        }
        public ActionResult BranchMaster(string auth)
        {
            if (!HasPermission("42", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;

            return View();
        }

        public ActionResult UserDetailList(string auth,int? id)
        {
            ViewBag.Auth = auth;
            ViewBag.EditId = id == null ? 0 : id;
            return View();
        }

        public ActionResult UserLoginActivity(string auth, int ? id)
        {
            ViewBag.Auth = auth;
            ViewBag.id = id;
            return View();
        }


        public ActionResult AttendanceMaster(string auth)
        {
            if (!HasPermission("44", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }




        public ActionResult HolidayMaster(string auth)
        {
            if (!HasPermission("43", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

     
        public ActionResult EmployeeDashBoardView(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult AdminDashboardView(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult RoleMaster(string auth)
        {

            if (!HasPermission("45", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult UserList(string auth)
        {
            if (!HasPermission("46", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult ProfilePage(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }

       


        /// <summary>
        ///  This method is used to save the task master data.
        /// </summary>
        /// <param name="objTagMaster"> this is taskmast model</param>
        /// <returns></returns>
        /// 
        public JsonResult SaveEmpMaster(EmployeeModel objEmpMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            objEmpMaster.Password = clsApplicationSetting.Encrypt(objEmpMaster.Password);
            objEmpMaster.IPAddress = ClsCommon.GetIPAddress();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objEmpMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.EmployeeData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult GetEmployeeDetailById(int id)
        {
            EmployeeModel objEmpMaster = new EmployeeModel();
            objEmpMaster.id = id;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objEmpMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.EmployeeData.ToString())), roleId, userid, "GET", out errorMessage);
                string password = data.data.Tables[0].Rows[0]["Password"].ToString();
                string decriptPwd = clsApplicationSetting.Decrypt(password);
                foreach (DataRow rw in data.data.Tables[0].Rows)
                {
                    rw["Password"] = decriptPwd;
                    data.data.Tables[0].AcceptChanges();
                    rw.SetModified();
                }

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

        public JsonResult BindEmpMaster()
        {
            EmployeeModel objEmpMaster = new EmployeeModel();
            objEmpMaster.id = 0;
            objEmpMaster.Type = 1;//This is for get ids
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objEmpMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.EmployeeData.ToString())), roleId, userid, "GET", out errorMessage);
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

        public JsonResult BindBranchMaster()
        {
            BranchModel objBranchMaster = new BranchModel();
            objBranchMaster.id = 0;
            objBranchMaster.Type = 1;//This is for get ids
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objBranchMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.BranchData.ToString())), roleId, userid, "GET", out errorMessage);
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
        public JsonResult SaveBranchMaster(BranchModel objBranchMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            objBranchMaster.Password = clsApplicationSetting.Encrypt(objBranchMaster.Password);
            objBranchMaster.IPAddress = ClsCommon.GetIPAddress();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objBranchMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.BranchData.ToString())), roleId, userid, "Save", out errorMessage);
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

        public JsonResult GetBranchDetailById(int id)
        {
            BranchModel objBranchMaster = new BranchModel();
            objBranchMaster.id = id;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objBranchMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.BranchData.ToString())), roleId, userid, "GET", out errorMessage);
                string password = data.data.Tables[0].Rows[0]["Password"].ToString();
                string decriptPwd = clsApplicationSetting.Decrypt(password);
                foreach (DataRow rw in data.data.Tables[0].Rows)
                {
                    rw["Password"] = decriptPwd;
                    data.data.Tables[0].AcceptChanges();
                    rw.SetModified();
                }

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
        public JsonResult BindDepartmentMaster()
        {
            DepartmentModel objDepartmentMaster = new DepartmentModel();
            objDepartmentMaster.Type = 1;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objDepartmentMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.DepartmentData.ToString())), roleId, userid, "GET", out errorMessage);


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

        [HttpPost]
        public JsonResult DeleteDepartmentById(DepartmentModel objDepartmentMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objDepartmentMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.DepartmentData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult SaveDepartmentMaster(DepartmentModel objDepartmentMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objDepartmentMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.DepartmentData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult GetDepartmentMasterById(int id)
        {
            DepartmentModel objDepartmentMaster = new DepartmentModel();
            objDepartmentMaster.id = id;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objDepartmentMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.DepartmentData.ToString())), roleId, userid, "GET", out errorMessage);


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
        public JsonResult BindStateMaster()
        {
            StateModel objStateMaster = new StateModel();
            objStateMaster.Type = 1;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objStateMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.StateData.ToString())), roleId, userid, "GET", out errorMessage);


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

        [HttpPost]
        public JsonResult DeleteStateById(StateModel objStateMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objStateMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.StateData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult SaveStateMaster(StateModel objStateMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objStateMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.StateData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult GetStateMasterById(int id)
        {
            StateModel objStateMaster = new StateModel();
            objStateMaster.id = id;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objStateMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.StateData.ToString())), roleId, userid, "GET", out errorMessage);


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
        public JsonResult BindDesignationMaster()
        {
            DesignationModel objDesignMaster = new DesignationModel();
            objDesignMaster.Type = 1;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objDesignMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.DesignData.ToString())), roleId, userid, "GET", out errorMessage);


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

        [HttpPost]
        public JsonResult DeleteDesignationMasterById(DesignationModel objDesignMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objDesignMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.DesignData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult SaveDesignationMaster(DesignationModel objDesignMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objDesignMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.DesignData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult GetDesignationMasterById(int id)
        {
            DesignationModel objDesignMaster = new DesignationModel();
            objDesignMaster.id = id;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objDesignMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.DesignData.ToString())), roleId, userid, "GET", out errorMessage);


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

        public JsonResult BindHolidayMaster(int id)
        {
            HolidayMasterModel objHolidayMaster = new HolidayMasterModel();
            objHolidayMaster.Type = 1;
            objHolidayMaster.FinYear = id;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objHolidayMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.HolidayData.ToString())), roleId, userid, "GET", out errorMessage);


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

        [HttpPost]
        public JsonResult DeleteHolidayMasterById(HolidayMasterModel objHolidayMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objHolidayMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.HolidayData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult SaveHolidayMaster(HolidayMasterModel objHolidayMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objHolidayMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.HolidayData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult GetHolidayMasterById(int id)
        {
            HolidayMasterModel objHolidayMaster = new HolidayMasterModel();
            objHolidayMaster.id = id;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objHolidayMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.HolidayData.ToString())), roleId, userid, "GET", out errorMessage);


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
        public JsonResult BindAttendanceMaster()
        {
            AttendanceModel objAttMaster = new AttendanceModel();
            objAttMaster.Type = 1;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objAttMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.AttendanceData.ToString())), roleId, userid, "GET", out errorMessage);


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

        [HttpPost]
        public JsonResult SaveAttendanceMaster(AttendanceMasterModel objAttMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objAttMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.AttendanceData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult GetAttendanceMasterById(int id)
        {
            AttendanceModel objAttMaster = new AttendanceModel();
            objAttMaster.id = id;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objAttMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.AttendanceData.ToString())), roleId, userid, "GET", out errorMessage);


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

        [HttpPost]
        public JsonResult DeleteAttendanceMasterById(AttendanceMasterModel objAttMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objAttMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.AttendanceData.ToString())), roleId, userid, "Save", out errorMessage);
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

        public JsonResult BindFinancialYearMaster()
        {
            FinancialYearModel objFinYearMaster = new FinancialYearModel();
            objFinYearMaster.Type = 1;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objFinYearMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.FinancialYearData.ToString())), roleId, userid, "GET", out errorMessage);


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

        [HttpPost]
        public JsonResult DeleteFinancialYearMasterById(FinancialYearModel objFinYearMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objFinYearMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.FinancialYearData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult SaveFinancialYearMaster(FinancialYearModel objFinYearMaster)
        {

            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objFinYearMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.PerformOperation(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.FinancialYearData.ToString())), roleId, userid, "Save", out errorMessage);
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
        public JsonResult GetFinancialYearMasterById(int id)
        {
            FinancialYearModel objFinYearMaster = new FinancialYearModel();
            objFinYearMaster.id = id;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objFinYearMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.FinancialYearData.ToString())), roleId, userid, "GET", out errorMessage);


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
        public JsonResult GetEmployeeDashboard()
        {
            DashboardModel objDashboard = new DashboardModel();



            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objDashboard);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.EmployeeDashboardData.ToString())), roleId, userid, "GET", out errorMessage);


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
        public JsonResult AdminDashBoardDetailsGet(int EmployeeID, int BranchID, int weekId, int FinYear)
        {
            DashboardModel objDashboard = new DashboardModel();

            objDashboard.EmployeeID = EmployeeID;
            objDashboard.BranchID = BranchID;
            objDashboard.WeekId = weekId;
            objDashboard.FInYear = FinYear;


            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objDashboard);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.DashboardData.ToString())), roleId, userid, "GET", out errorMessage);


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

        public JsonResult GetBranchDashboard()
        {
            DashboardModel objDashboard = new DashboardModel();

            objDashboard.Type = 2;

            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objDashboard);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.EmployeeDashboardData.ToString())), roleId, userid, "GET", out errorMessage);


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

        public JsonResult GetBranchEMDate()
        {
            BranchModel objBranchMaster = new BranchModel();
            objBranchMaster.id = 0;
            objBranchMaster.Type = 2;//This is for get ids
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objBranchMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.BranchData.ToString())), roleId, userid, "GET", out errorMessage);
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

        public JsonResult GerEmpDetails(BranchModel objBranchMaster)
        {
            
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objBranchMaster);
            try
            {
                string errorMessage = string.Empty;
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var userInfo = CommonMethods.GetAuthInfo(headerValue);
                int roleId = userInfo.RoleId;
                int userid = userInfo.UserId;
                var data = _iManageTask.GetRecords(stringTOXml, Convert.ToString((int)Enum.Parse(typeof(ApplicationConstants.EmployeeDetailConstants), ApplicationConstants.EmployeeDetailConstants.BranchData.ToString())), roleId, userid, "GET", out errorMessage);
                string password = data.data.Tables[0].Rows[0]["Password"].ToString();
                string decriptPwd = clsApplicationSetting.Decrypt(password);
                foreach (DataRow rw in data.data.Tables[0].Rows)
                {
                    rw["Password"] = decriptPwd;
                    data.data.Tables[0].AcceptChanges();
                    rw.SetModified();
                }
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