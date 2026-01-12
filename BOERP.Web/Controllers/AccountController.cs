using BOERP.Web;
using BOERP.Web.Controllers;
using CaptchaMvc.HtmlHelpers;
using Microsoft.VisualBasic.ApplicationServices;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OtpSharp;
using Sahaj.API;
using Sahaj.API.Interface;
using Sahaj.API.Model;
using SahajFramework.CommonClass;
using SahajFramework.Models;
using SahajFramework.Models.Captcha;
using SahajFramework.ModelsMaster;
using SahajFramework.ModelsMasterHelper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Runtime.Remoting.Contexts;
using System.Runtime.Remoting.Metadata.W3cXsd2001;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Caching;
using System.Web.Helpers;
using System.Web.Http.Results;
using System.Web.Mvc;
using System.Web.Security;
using System.Web.WebPages;
using static System.Net.WebRequestMethods;

namespace SahajFramework.Controllers
{
    public class AccountController : Controller
    {
        long LoginID = 0;
        string IPAddress = "";
        GetResponse getResponse;
        IEmployeeHelper employee;


        public AccountController()
        {
            getResponse = new GetResponse();
            employee = new EmployeeModal();
            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            IPAddress = ClsCommon.GetIPAddress();
            getResponse.IPAddress = IPAddress;
            getResponse.LoginID = LoginID;
        }

        public ActionResult Login(string ReturnURL)
        {
            clsApplicationSetting.ClearSessionValues();
            ViewBag.ReturnURL = ReturnURL;
            Login Modal = new Login();
            return View(Modal);
        }


        public ActionResult AdminDashboard(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }

        [HttpPost]
        public ActionResult SetSelectedModule(int moduleId)
        {
            Session["SelectedModuleID"] = moduleId;

            if (Request.UrlReferrer != null)
            {
                return Redirect(Request.UrlReferrer.ToString());
            }

            return RedirectToAction("Dashboard"); // Fallback
        }

        public ActionResult EmployeeDashboard(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult MISScoreDashboard(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult BranchDashboard(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult GetTaskStatusModal(int id, string auth, int FMS_Id)
        {
            List<TaskStatusModel> taskList = new List<TaskStatusModel>();



            string connStr = clsApplicationSetting.DecryptQueryString(auth)[3];

            using (SqlConnection con = new SqlConnection(connStr))
            {
                using (SqlCommand cmd = new SqlCommand("GetFmsTransDetails", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@SampleId", id);
                    cmd.Parameters.AddWithValue("@FMS_Id", FMS_Id);


                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            taskList.Add(new TaskStatusModel
                            {
                                TaskNo = reader["TaskNo"]?.ToString(),
                                Description = reader["Description"]?.ToString(),

                                PlannedDate = reader["PlannedDate"] != DBNull.Value
                      ? (DateTime?)Convert.ToDateTime(reader["PlannedDate"])
                      : null,

                                ActualDate = reader["ActualDate"] != DBNull.Value
                      ? (DateTime?)Convert.ToDateTime(reader["ActualDate"])
                      : null,

                                DoerName = reader["DoerName"]?.ToString(),

                                DelayHours = reader["DelayHours"]?.ToString(),
                                Remarks = reader["Remarks"]?.ToString(),
                            });

                        }
                    }
                }
            }

            return PartialView("_TaskStatusModal", taskList);
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        //  [ValidateGoogleCaptcha]
        public ActionResult Login(Login Modal, string ReturnURL, string Command)
        {

            ViewBag.ReturnURL = ReturnURL;

            DataSet UserDataSet = default(DataSet);
            bool IsValidUser = false;
            UserDataSet = null;
            if (!string.IsNullOrEmpty(Modal.Username))
            {
                UserDataSet = Common_SPU.fnGetLogin(Modal.Username, clsApplicationSetting.Encrypt(Modal.Password), HttpContext.Session.SessionID);

                IsValidUser = Convert.ToBoolean(UserDataSet.Tables[0].Rows[0]["status"].ToString());
                if (IsValidUser)
                {
                    clsApplicationSetting.SetSessionValue("ConnectionStringData", "");
                    clsApplicationSetting.SetSessionValue("EMPID", UserDataSet.Tables[0].Rows[0]["USER_ID"].ToString());
                    clsApplicationSetting.SetSessionValue("UserName", UserDataSet.Tables[0].Rows[0]["USER_NAME"].ToString());
                    clsApplicationSetting.SetSessionValue("LoginID", UserDataSet.Tables[0].Rows[0]["USER_ID"].ToString());
                    clsApplicationSetting.SetSessionValue("Email", UserDataSet.Tables[0].Rows[0]["EmailId"].ToString());
                    clsApplicationSetting.SetSessionValue("IsMobileLogin", UserDataSet.Tables[0].Rows[0]["IsMobileLogin"].ToString());
                    clsApplicationSetting.SetSessionValue("ContactNumber", UserDataSet.Tables[0].Rows[0]["ContactNumber"].ToString());

                    return RedirectToAction("OTPValidate", "Account");

                }
                else
                {
                    TempData["LoginErrorMsg"] = "Email/Mobile are not correct. Please Contact your system administrator";
                    return View(); // code commit
                }
            }
            else
            {
                return View(); // code commit
            }




        }
        public bool IsDateInRange(DateTime clientDate, DateTime fromDate, DateTime toDate)
        {
            return clientDate >= fromDate && clientDate <= toDate;
        }

        public string ChangeDateFormatWithFullMonthName(string myDate)
        {
            string strDate = "";

            if (myDate == "1900-01-01T00:00:00")
            {
                myDate = "";
            }

            if (!string.IsNullOrEmpty(myDate))
            {
                string[] myArray = myDate.Split('/');
                if (myArray.Length > 2)
                {
                    string mm = "";
                    switch (myArray[1])
                    {
                        case "01": mm = "January"; break;
                        case "02": mm = "February"; break;
                        case "03": mm = "March"; break;
                        case "04": mm = "April"; break;
                        case "05": mm = "May"; break;
                        case "06": mm = "June"; break;
                        case "07": mm = "July"; break;
                        case "08": mm = "August"; break;
                        case "09": mm = "September"; break;
                        case "10": mm = "October"; break;
                        case "11": mm = "November"; break;
                        case "12": mm = "December"; break;
                    }
                    strDate = myArray[0] + '-' + mm + '-' + myArray[2];
                }
            }

            return strDate;
        }

        [HttpPost]
        // [ValidateAntiForgeryToken]
        //  [ValidateGoogleCaptcha]
        public ActionResult CompanyLogin(CompanyLogin Modal)
        {
            DataSet UserDataSet = default(DataSet);
            bool IsValidUser = false;
            UserDataSet = null;
            if (Modal.CompanyId == null || Modal.FinId == 0 || Modal.FinYearDate == null)
            {
                TempData["LoginErrorMsg"] = "Please select required Details.";
                return View();
            }
            else
            {
                string conString = clsApplicationSetting.GetSessionValue("ConnectionStringData");
                int LoginID = 0;
                int.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
                string username = clsApplicationSetting.GetSessionValue("UserName");

                UserDataSet = Common_SPU.GetLoginForCompany(username, Modal.CompanyId, Modal.FinId, HttpContext.Session.SessionID, conString);

                DateTime FromDate = Convert.ToDateTime(UserDataSet.Tables[0].Rows[0]["FDATE"]);
                DateTime ToDate = Convert.ToDateTime(UserDataSet.Tables[0].Rows[0]["TDATE"]);
                bool isValid = false;
                if (!string.IsNullOrWhiteSpace(ChangeDateFormatWithFullMonthName(Modal.FinYearDate)))
                {
                    DateTime dtFinDate = Convert.ToDateTime(ChangeDateFormatWithFullMonthName(Modal.FinYearDate));
                    isValid = IsDateInRange(dtFinDate, FromDate, ToDate);
                }

                if (isValid)
                {
                    IsValidUser = Convert.ToBoolean(UserDataSet.Tables[0].Rows[0]["status"].ToString());
                    if (IsValidUser)
                    {
                        var cdata = Common_SPU.GetCompanyList(username, Modal.CompanyId);
                        DataSet CompDatabase = cdata.data;
                        string dbServer = "";
                        string dbUserId = "";
                        string dbPassword = "";
                        string database = "";

                        clsApplicationSetting.SetSessionValue("CompanyName", CompDatabase.Tables[0].Rows[0]["Company_Name"].ToString());

                        if (CompDatabase != null && CompDatabase.Tables.Count > 0)
                        {
                            DataTable dt = CompDatabase.Tables[0];
                            // Extract values from the first row of the DataTable
                            DataRow row = dt.Rows[0];

                            // dbServer = "103.76.214.216,60497";
                            dbServer = row["DB_SERVER"].ToString();  // Replace "DB_SERVER" with the exact column name
                            dbUserId = row["DB_USER"].ToString();   // Replace "DB_USER" with the exact column name
                            dbPassword = row["DB_PWD"].ToString();  // Replace "DB_PWD" with the exact column name
                            database = row["DB_NAME"].ToString();   // Replace "DB_NAME" with the exact column name

                        }
                        string ConnectionStringData = "Data Source=" + dbServer + ";  Initial Catalog=" + database + ";User ID=" + dbUserId + "; Password=" + dbPassword + "; Integrated Security=False";

                        if (!string.IsNullOrEmpty(UserDataSet.Tables[0].Rows[0]["RoleIDs"].ToString()))
                        {
                            clsApplicationSetting.SetSessionValue("FinYearId", Modal.FinId.ToString());
                            clsApplicationSetting.SetCookiesValue("FinYearId", Modal.FinId.ToString());
                            clsApplicationSetting.SetSessionValueWithoutEncript("CompDetails", Modal.CompanyId.ToString());
                            clsApplicationSetting.SetSessionValue("UserType", UserDataSet.Tables[0].Rows[0]["UserType"].ToString());
                            clsApplicationSetting.SetSessionValue("FileURL", UserDataSet.Tables[0].Rows[0]["FileURL"].ToString());
                            clsApplicationSetting.SetSessionValue("UserID", UserDataSet.Tables[0].Rows[0]["User_Name"].ToString());
                            clsApplicationSetting.SetSessionValue("EMPID", UserDataSet.Tables[0].Rows[0]["EMPID"].ToString());
                            clsApplicationSetting.SetSessionValue("EMPCode", UserDataSet.Tables[0].Rows[0]["EMPCode"].ToString());
                            clsApplicationSetting.SetSessionValue("UserName", UserDataSet.Tables[0].Rows[0]["User_Name"].ToString());
                            clsApplicationSetting.SetCookiesValue("UserName", UserDataSet.Tables[0].Rows[0]["User_Name"].ToString());
                            clsApplicationSetting.SetSessionValue("LocationID", UserDataSet.Tables[0].Rows[0]["LocationID"].ToString());
                            clsApplicationSetting.SetSessionValue("AttachmentID", UserDataSet.Tables[0].Rows[0]["AttachmentID"].ToString());
                            clsApplicationSetting.SetSessionValue("contentType", UserDataSet.Tables[0].Rows[0]["content_Type"].ToString());
                            clsApplicationSetting.SetSessionValue("RoleID", UserDataSet.Tables[0].Rows[0]["RoleID"].ToString());
                            // HttpContext.Application["RoleID"] = UserDataSet.Tables[0].Rows[0]["RoleID"].ToString();
                            clsApplicationSetting.SetApplicationValue("RoleID", UserDataSet.Tables[0].Rows[0]["RoleID"].ToString());
                            clsApplicationSetting.SetSessionValueWithoutEncript("RoleID", UserDataSet.Tables[0].Rows[0]["RoleID"].ToString());
                            clsApplicationSetting.SetSessionValue("RolesName", UserDataSet.Tables[0].Rows[0]["RolesName"].ToString());
                            clsApplicationSetting.SetSessionValue("Designation", UserDataSet.Tables[0].Rows[0]["Designation"].ToString());
                            clsApplicationSetting.SetSessionValue("LoginID", UserDataSet.Tables[0].Rows[0]["LoginID"].ToString());
                            clsApplicationSetting.SetSessionValue("DepartmentName", UserDataSet.Tables[0].Rows[0]["DepartmentName"].ToString());
                            clsApplicationSetting.SetCookiesValue("DepartmentName", UserDataSet.Tables[0].Rows[0]["DepartmentName"].ToString());
                            clsApplicationSetting.SetSessionValue("Gender", UserDataSet.Tables[0].Rows[0]["Gender"].ToString());
                            clsApplicationSetting.SetSessionValue("EMPStatus", UserDataSet.Tables[0].Rows[0]["emp_Status"].ToString());
                            clsApplicationSetting.SetSessionValue("MaritalStatus", UserDataSet.Tables[0].Rows[0]["marital_Status"].ToString());
                            clsApplicationSetting.SetSessionValue("FullName", UserDataSet.Tables[0].Rows[0]["FullName"].ToString());
                            clsApplicationSetting.SetSessionValue("FinDate", UserDataSet.Tables[0].Rows[0]["FinDate"].ToString());
                            clsApplicationSetting.SetCookiesValue("FinDate", UserDataSet.Tables[0].Rows[0]["FinDate"].ToString());



                           // Common_SPU.UserActivityLog(clsApplicationSetting.GetSessionValue("LoginID"), 1, conString);



                            string QstrData = Convert.ToString(
                                UserDataSet.Tables[0].Rows[0]["AuthToken"])
                                + "*" + Modal.FinId.ToString() +
                                "*" + Modal.CompanyId.ToString() +
                                "*" + ConnectionStringData +
                                "*" + UserDataSet.Tables[0].Rows[0]["FinDate"].ToString() +
                                "*" + UserDataSet.Tables[0].Rows[0]["RoleID"].ToString() +
                                "*" + UserDataSet.Tables[0].Rows[0]["User_Name"].ToString() +
                                "*" + UserDataSet.Tables[0].Rows[0]["DepartmentName"].ToString() +
                                "*" + UserDataSet.Tables[0].Rows[0]["LoginID"].ToString() +
                                "*" + UserDataSet.Tables[0].Rows[0]["RoleIDs"].ToString();

                            string encData = clsApplicationSetting.EncryptQueryString(QstrData);
                            var menuData = ClsCommon.GetAdminModuleMenuWhileLogin(UserDataSet.Tables[0].Rows[0]["RoleIDs"].ToString(), ConnectionStringData, encData);
                            ClsCommon.CreateLoginMenuJSon(UserDataSet.Tables[0].Rows[0]["LoginID"].ToString(), menuData);

                            return RedirectToAction("Dashboard", "Account", new { auth = encData });

                            // 
                        }
                        else
                        {

                            TempData["LoginErrorMsg"] = "Role is not define for this user. Please Contact your system administrator";
                            return View();
                        }
                    }
                    else
                    {
                        TempData["LoginErrorMsg"] = "User ID Or Password are not correct. Please Contact your system administrator";
                        return View();
                    }
                }
                else
                {
                    TempData["LoginErrorMsg"] = "Please select date between finance year range.";
                    return View();
                }
            }

        }
        public ActionResult CompanyLogin()
        {
            TempData["LoginErrorMsg"] = "";
            return View();
        }
        public ActionResult Logout(string auth)
        {
            try
            {
                // long LoginID = 0;
                // long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
                var conStr = clsApplicationSetting.DecryptQueryString(auth)[3];
                var LoginID = clsApplicationSetting.DecryptQueryString(auth)[8];
                var token = clsApplicationSetting.DecryptQueryString(auth)[0];               
                if (!string.IsNullOrEmpty(conStr))
                {
                    clsDataBaseHelper.ExecuteNonQueryWithConString("update userman set IsLogin=0,LoginOutTime=getdate() where USER_ID=" + LoginID + "", conStr);
                    Common_SPU.UserActivityLog(LoginID, 2, conStr, token);
                }
                clsApplicationSetting.ClearSessionValues();
                return RedirectToAction("Login", "Account");
            }
            catch (Exception)
            {

                return RedirectToAction("Login", "Account");
            }
           
        }
        public ActionResult LogoutFromPopup(string auth)
        {
            try
            {
                // long LoginID = 0;
                // long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
                var conStr = clsApplicationSetting.DecryptQueryString(auth)[3];
                var LoginID = clsApplicationSetting.DecryptQueryString(auth)[8];
                var token = clsApplicationSetting.DecryptQueryString(auth)[0];
                if (!string.IsNullOrEmpty(conStr))
                {
                    clsDataBaseHelper.ExecuteNonQueryWithConString("update userman set IsLogin=0,LoginOutTime=getdate() where USER_ID=" + LoginID + "", conStr);
                    Common_SPU.UserActivityLog(LoginID, 3, conStr, token);
                }
                clsApplicationSetting.ClearSessionValues();
                return RedirectToAction("Login", "Account");
            }
            catch (Exception)
            {

                return RedirectToAction("Login", "Account");
            }

        }
        public ActionResult AutoLogout(string auth)
        {
            try
            {                
                
                clsApplicationSetting.ClearSessionValues();
                return RedirectToAction("Login", "Account");
            }
            catch (Exception)
            {

                return RedirectToAction("Login", "Account");
            }

        }
        public ActionResult PageNotFound(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }
        public ActionResult TokenExpired(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }
        [CustomAuthorizeAttribute]
        public ActionResult Dashboard(string auth)
        {
            if (!System.IO.File.Exists(clsApplicationSetting.GetPhysicalPath("json") + "/AdminMenu.json"))
            {
                ClsCommon.CreateMenuJSon();
            }
            if (!System.IO.File.Exists(clsApplicationSetting.GetPhysicalPath("json") + "/config.json"))
            {
                ClsCommon.CreateConfigJson();
            }
            Dashboard.DashboardList Modal = new Dashboard.DashboardList();
            ViewBag.Auth = auth;
            // Modal = employee.GetDashboardEmpInfo();
            return View(Modal);

        }



        public ActionResult OTPValidate()
        {


            string OTP = "0";


            string UserName = clsApplicationSetting.GetSessionValue("Email").ToString();

            string LoginID = clsApplicationSetting.GetSessionValue("UserName");

            string IsMobileLogin = clsApplicationSetting.GetSessionValue("IsMobileLogin").ToString();

            string MobileNo = clsApplicationSetting.GetSessionValue("ContactNumber");

            clsApplicationSetting.SetSessionValue("ConnectionStringData", "");
            if (!string.IsNullOrEmpty(UserName))
            {
                if (IsMobileLogin == "False")
                {
                    TempData["SuccessMsg"] = "Please enter the 6 digit code sent to Email ID " + UserName;
                }
                else
                {
                    OTP = clsDataBaseHelper.fnGetOther_FieldName("OTP", "OTP", "User_Name", LoginID.ToString(), " and isdeleted=0");


                    TempData["SuccessMsg"] = "Please enter the 6 digit code sent to Mobile No. " + MobileNo;

                    // Fire-and-forget task to send WhatsApp message

                    if (OTP == null)
                    {
                        TempData["SuccessMsg"] = "OTP not found";
                    }



                    _ = Task.Run(async () =>
                    {
                        try
                        {



                            string productId = clsDataBaseHelper.fnGetFieldName("ERP_WhatsApp_Cred", "product_id");
                            string token = clsDataBaseHelper.fnGetFieldName("ERP_WhatsApp_Cred", "token");
                            string base_url = clsDataBaseHelper.fnGetFieldName("ERP_WhatsApp_Cred", "whatsapp_api");

                            if (string.IsNullOrWhiteSpace(productId) ||
                                string.IsNullOrWhiteSpace(token))
                            {
                                TempData["SuccessMsg"] = "Product ID/ token not found!!!";
                                return;
                            }


                            string listUrl =
                                $"{base_url}/{productId}/listphones?token={token}";

                            using (var client = new HttpClient())
                            {
                                HttpResponseMessage listRes = await client.GetAsync(listUrl);
                                listRes.EnsureSuccessStatusCode();

                                string listJson = await listRes.Content.ReadAsStringAsync();
                                JArray phones = JArray.Parse(listJson);

                                if (phones == null || phones.Count == 0)
                                {
                                    TempData["SuccessMsg"] = "Phone ID not found!!!";
                                    return;
                                }

                                long phoneId = phones[0]["id"]?.Value<long>() ?? 0;
                                if (phoneId == 0)
                                {
                                    TempData["SuccessMsg"] = "Phone ID not found!!!";
                                    return;
                                }


                                string sendUrl =
                                    $"{base_url}/{productId}/{phoneId}/sendMessage";

                                var payloadObj = new
                                {
                                    to_number = MobileNo.StartsWith("+91") ? MobileNo : "+91" + MobileNo,
                                    type = "text",
                                    message = $"Your login OTP is {OTP}",
                                    typing = "typing",
                                    duration = 2
                                };

                                string payloadJson = JsonConvert.SerializeObject(payloadObj);

                                using (var content =
                                       new StringContent(payloadJson, Encoding.UTF8, "application/json"))
                                {
                                    content.Headers.ContentType =
                                        new MediaTypeHeaderValue("application/json");

                                    client.DefaultRequestHeaders.Remove("x-maytapi-key");
                                    client.DefaultRequestHeaders.Add("x-maytapi-key", token);

                                    HttpResponseMessage sendRes =
                                        await client.PostAsync(sendUrl, content);
                                    sendRes.EnsureSuccessStatusCode();
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            System.Diagnostics.Debug.WriteLine(
                                $"WhatsApp OTP send failed: {ex.Message}");

                            TempData["SuccessMsg"] = $"WhatsApp OTP send failed: {ex.Message}";
                        }
                    });
                }
            }
            else
            {
                TempData["SuccessMsg"] = "UserName is not updated,Please Contact your system administrator";
            }

            return View();
        }





        private string SendUserOtp(int userId)
        {
            string Status = "";

            string OTP = Common_SPU.FnSetOtp(userId);
            string sMsg = "OTP for login is " + OTP + ".Please don't share it with anyone. This is confidential and to be used by you only. Thanks & Regards, Centre for Catalyzing Change";
            //string sMsg = "OTP for login is " + OTP + ".Please do not share it with anyone by any means. This is confidential and to be used by you only. Thanks & Regards, Centre for Catalyzing Change";//"OTP for login is " + OTP + ". Do not share it with anyone by any means. This is confidential and to be used by you only.\n\nThanks & Regards,\nCentre for Catalyzing Change";
            //  sMsg = HttpUtility.UrlEncode(sMsg, System.Text.Encoding.GetEncoding("ISO-8859-1"));
            // SendMailHelper.SendSMS(Mobile, sMsg);
            Common_SPU.fnCreateMail_OTP(OTP);
            // Status = Mobile;

            return Status;
        }

        [HttpPost]
        public ActionResult OTPValidate(Miscellaneous Modal)
        {
            string OTP = "0";
            int User_ID = 0;
            string ExpiryDateStr = "";
            DateTime ExpiryDate;


            string LoginID = clsApplicationSetting.GetSessionValue("UserName");
            clsApplicationSetting.SetSessionValue("ConnectionStringData", "");

            string environment = "";

            if (LoginID != "" || LoginID != null)
            {
                OTP = clsDataBaseHelper.fnGetOther_FieldName("OTP", "OTP", "User_Name", LoginID.ToString(), " and isdeleted=0");
                User_ID = clsDataBaseHelper.fnGetOther_FieldName("OTP", "User_ID", "User_Name", LoginID.ToString(), " and isdeleted=0").AsInt();
                ExpiryDateStr = clsDataBaseHelper.fnGetOther_FieldName("OTP", "ExpiryDate", "User_Name", LoginID.ToString(), " and isdeleted=0");

                environment = clsDataBaseHelper.fnGetFieldName("Config", "Environement");


            }

            if (User_ID == 0) // done
            {
                string UserName = clsApplicationSetting.GetSessionValue("Email").ToString();
                TempData["SuccessMsg"] = "Your User ID is not configured with respect to " + UserName + ". Please contact the administrator.";
                return View(Modal);
            }

            if (Modal.OTP == null)
            {
                string UserName = clsApplicationSetting.GetSessionValue("Email").ToString();
                TempData["SuccessMsg"] = "Please enter the 6 digit code sent to " + UserName;
                return View(Modal);
            }
            else if (environment == "developer" || environment == "uat")
            {
                //if (Modal.OTP == "2025")
                if (Modal.OTP == OTP)
                {
                    return RedirectToAction("CompanyLogin", "Account");
                }
                else
                {
                    TempData["SuccessMsg"] = "Invalid OTP expiry date.";
                    return View(Modal);
                }

            }
            // Check if OTP matches
            else if (OTP == Modal.OTP)
            {
                // Parse and validate expiry date
                if (DateTime.TryParse(ExpiryDateStr, out ExpiryDate))
                {
                    if (ExpiryDate >= DateTime.Now)
                    {
                        // OTP is valid and not expired
                        return RedirectToAction("CompanyLogin", "Account");
                    }
                    else
                    {
                        TempData["SuccessMsg"] = "OTP has expired. Please request a new one.";
                        return View(Modal);
                    }
                }
                else
                {
                    TempData["SuccessMsg"] = "Invalid OTP expiry date.";
                    return View(Modal);
                }
            }
            else
            {
                TempData["SuccessMsg"] = "OTP is not matched.";
                return View(Modal);
            }
        }


        [HttpGet]
        public JsonResult GetCompanyList()
        {
            string username = clsApplicationSetting.GetSessionValue("UserName");
            IGeneric _objIGeneric = new GenericBussinessBLL();
            Miscellaneous objMiscellaneous = new Miscellaneous();
            objMiscellaneous.Id = 0;
            objMiscellaneous.Type = 0;
            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objMiscellaneous);
            try
            {
                string errorMessage = string.Empty;
                int userid = Convert.ToInt32(clsApplicationSetting.GetSessionValue("LoginID"));
                var data = Common_SPU.GetCompanyList(username, "");
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
        public JsonResult GetFinaList(string Id)
        {
            string username = clsApplicationSetting.GetSessionValue("UserName");
            string dbServer = "";
            string dbUserId = "";
            string dbPassword = "";
            string database = "";
            int CompId = 0;
            var cdata = Common_SPU.GetCompanyList(username, Id);
            DataSet CompDatabase = cdata.data;
            if (CompDatabase != null && CompDatabase.Tables.Count > 0)
            {
                DataTable dt = CompDatabase.Tables[0];

                // Extract values from the first row of the DataTable
                DataRow row = dt.Rows[0];
                //
                //               dbServer = "103.76.214.216,60497";
                dbServer = row["DB_SERVER"].ToString();  // Replace "DB_SERVER" with the exact column name
                dbUserId = row["DB_USER"].ToString();   // Replace "DB_USER" with the exact column name
                dbPassword = row["DB_PWD"].ToString();  // Replace "DB_PWD" with the exact column name
                database = row["DB_NAME"].ToString();   // Replace "DB_NAME" with the exact column name
                CompId = Convert.ToInt32(row["COMPANY_ID"].ToString());
            }
            string ConnectionStringData = "Data Source=" + dbServer + ";  Initial Catalog=" + database + ";User ID=" + dbUserId + "; Password=" + dbPassword + "; Integrated Security=False";

            IGeneric _objIGeneric = new GenericBussinessBLL();
            Miscellaneous objMiscellaneous = new Miscellaneous();
            objMiscellaneous.Id = CompId;
            objMiscellaneous.Type = 1;
            CommonMethods objCommonMethods = new CommonMethods();
            string stringTOXml = objCommonMethods.GetXMLFromObject(objMiscellaneous);
            try
            {
                string errorMessage = string.Empty;
                int userid = Convert.ToInt32(clsApplicationSetting.GetSessionValue("LoginID"));
                var data = Common_SPU.GetFinanceListbyCompany(CompId, ConnectionStringData);
                clsApplicationSetting.SetCookiesValue("CompanyId", ConnectionStringData);
                clsApplicationSetting.SetSessionValue("CompanyId", CompId.ToString());
                clsApplicationSetting.SetSessionValue("ConnectionStringData", ConnectionStringData);
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
        public JsonResult SetFinDate(string Id)
        {
            try
            {
                string errorMessage = string.Empty;
                int userid = Convert.ToInt32(clsApplicationSetting.GetSessionValue("LoginID"));
                clsApplicationSetting.SetSessionValue("FinDate", Id);
                var data = string.Empty;
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

        public string Encryption(string Token, string Value)
        {
            string Output;
            string ActualToken = clsApplicationSetting.GetConfigValue("Token");

            if (Token == ActualToken)
            {
                Value = Value.Replace("-SLASH-", "/");
                Value = Value.Replace("-STAR-", "*");
                Output = clsApplicationSetting.EncryptFriendly(Value);
            }
            else
            {
                Output = "Invalid Token";
            }
            return Output;
        }
        public string Decryption(string Token, string Value)
        {
            string Output;
            string ActualToken = clsApplicationSetting.GetConfigValue("Token");
            if (Token == ActualToken)
            {
                Output = clsApplicationSetting.DecryptFriendly(Value);
            }
            else
            {
                Output = "Invalid Token";
            }
            return Output;
        }

        [HttpPost]
        public ActionResult _ForgotPassword()
        {

            ForgotPassword.Request Modal = new ForgotPassword.Request();
            return PartialView(Modal);
        }

        [HttpPost]
        public ActionResult _SubmitForgotPassword(ForgotPassword.Request Modal, string Command)
        {

            PostResponse PostResult = new PostResponse();
            PostResult.SuccessMessage = "Not found anything";
            if (ModelState.IsValid)
            {
                var getDateTime = DateTime.Now.ToString("yyyy-MM-ddhh:mm:sstt");
                Modal.Token = clsApplicationSetting.EncryptQueryString(getDateTime);
                Modal.IPAddress = IPAddress;
                PostResult = Common_SPU.fnCreateMail_ForgotPassword(Modal);
            }

            return Json(PostResult, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ChangePassword(string Token)
        {
            ChangePassword Modal = new ChangePassword();

            if (string.IsNullOrEmpty(Token) && LoginID == 0)
            {
                return RedirectToAction("PageNotFound");
            }
            else if (!string.IsNullOrEmpty(Token))
            {
                GetValidateToken getResp = new GetValidateToken();
                getResp.LoginID = LoginID;
                getResp.IPAddress = IPAddress;
                getResp.Token = Token;
                getResp.Doctype = "ChangePassword";
                var Sat = Common_SPU.fnGetValidateToken(getResp);
                if (Sat.Status)
                {
                    Modal.Token = Token;
                    Modal.OldPassword = "NA";
                    Modal.LoginID = Sat.ID;
                }
                else
                {
                    TempData["LoginErrorMsg"] = Sat.SuccessMessage;
                    return RedirectToAction("PageNotFound");
                }
            }
            else
            {
                Modal.LoginID = LoginID;
            }
            return View(Modal);
        }
        public ActionResult MChangePassword(string src)
        {
            ViewBag.src = src;
            int EMPID = 0;
            int UserId = 0;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            if (GetQueryString.Length > 3)
            {
                ViewBag.Mobile = GetQueryString[3];
                ViewBag.UserId = GetQueryString[4];
                ViewBag.LocationId = GetQueryString[5];
                ViewBag.EMPID = GetQueryString[2];
                int.TryParse(ViewBag.EMPID, out EMPID);
                int.TryParse(ViewBag.UserId, out UserId);
            }
            ChangePassword changePassword = new ChangePassword();
            changePassword.LoginID = UserId;
            return View(changePassword);
        }
        [HttpPost]
        public ActionResult MChangePassword(ChangePassword Modal, string Command)
        {
            PostResponse PostResult = new PostResponse();
            PostResult.SuccessMessage = "Not found anything";
            if (Modal.NewPassword != Modal.ConfirmPassword)
            {
                PostResult.SuccessMessage = "Password and Confirm Password must be same";
                //TempData["LoginErrorMsg"] = PostResult.SuccessMessage;
                ModelState.AddModelError("ConfirmPassword", PostResult.SuccessMessage);
            }
            if (ModelState.IsValid)
            {
                Modal.IPAddress = IPAddress;
                Modal.NewPassword = clsApplicationSetting.Encrypt(Modal.NewPassword);
                Modal.OldPassword = clsApplicationSetting.Encrypt(Modal.OldPassword);
                PostResult = Common_SPU.fnSetPasswordChangeForMobile(Modal);
                TempData["LoginErrorMsg"] = PostResult.SuccessMessage;
            }
            if (PostResult.Status)
            {
                return RedirectToAction("logout", "");
            }
            return View(Modal);
        }

        [HttpPost]
        public ActionResult ChangePassword(ChangePassword Modal, string Command)
        {
            PostResponse PostResult = new PostResponse();
            PostResult.SuccessMessage = "Not found anything";
            if (Modal.NewPassword != Modal.ConfirmPassword)
            {
                PostResult.SuccessMessage = "Password and Confirm Password must be same";
                // TempData["LoginErrorMsg"] = PostResult.SuccessMessage;
                ModelState.AddModelError("ConfirmPassword", PostResult.SuccessMessage);
            }
            if (ModelState.IsValid)
            {
                Modal.IPAddress = IPAddress;
                Modal.NewPassword = clsApplicationSetting.Encrypt(Modal.NewPassword);
                Modal.OldPassword = clsApplicationSetting.Encrypt(Modal.OldPassword);
                PostResult = Common_SPU.fnSetPasswordChange(Modal);
                TempData["LoginErrorMsg"] = PostResult.SuccessMessage;
            }
            if (PostResult.Status)
            {
                return RedirectToAction("Login", "Account");
            }
            return View(Modal);
        }

        public string GenerateOtp()
        {
            var otp = new Totp(KeyGeneration.GenerateRandomKey(8));
            var otpCode = otp.ComputeTotp();

            var fourDigitOtp = int.Parse(otpCode) % 10000;

            return fourDigitOtp.ToString("D4");
        }

        [HttpPost]
        public string SaveOTP(string user_email)
        {
            string otp = GenerateOtp();



            CommonMethods objCommonMethods = new CommonMethods();
            try
            {
                string errorMessage = string.Empty;
                bool isSendEmail = objCommonMethods.SendEmail(user_email, user_email, otp);



                if (isSendEmail)
                {
                    return otp;
                }
                else
                {
                    return "-1";
                }

            }
            catch (Exception ex)
            {
                return "-1";
            }


        }
    }

}

