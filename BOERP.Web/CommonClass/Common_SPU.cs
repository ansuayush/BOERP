using Dapper;
using OfficeOpenXml.FormulaParsing.LexicalAnalysis;
using Sahaj.API.DAL;
using Sahaj.API.Model;
using SahajFramework.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Web;


namespace SahajFramework.CommonClass
{
    public class Common_SPU

    {

        public static DataSet fnGetConfigSetting(long ConfigID)
        {
            SqlParameter[] oparam = new SqlParameter[1];
            oparam[0] = new SqlParameter("@ConfigID", ConfigID);
            return clsDataBaseHelper.ExecuteDataSet("spu_GetConfigSetting", oparam);
        }
        public static DataSet fnGetPushMailItems_Attachment(long MailItemID)
        {
            SqlParameter[] oparam = new SqlParameter[1];
            oparam[0] = new SqlParameter("@MailItemID", MailItemID);
            return clsDataBaseHelper.ExecuteDataSet("spu_GetPushMailItems_Attachment", oparam);
        }
        public static DataSet fnGetPushMailItems_Pending()
        {
            return clsDataBaseHelper.ExecuteDataSet("exec spu_GetPushMailItems_Pending");
        }

        public static DataSet fnGetPushNotification(string ListType)
        {
            SqlParameter[] oparam = new SqlParameter[2];
            oparam[0] = new SqlParameter("@LoginID", clsApplicationSetting.GetSessionValue("LoginID"));
            oparam[1] = new SqlParameter("@ListType", ClsCommon.EnsureString(ListType));
            return clsDataBaseHelper.ExecuteDataSet("spu_GetPushNotification", oparam);

        }
        public static DataSet fnGetOnbehalfEMP()
        {
            SqlParameter[] oparam = new SqlParameter[1];
            oparam[0] = new SqlParameter("@LoginID", clsApplicationSetting.GetSessionValue("LoginID"));
            return clsDataBaseHelper.ExecuteDataSet("spu_GetOnbehalf", oparam);
        }
        public static DataSet fnGetUserman(long ID, string WantCurrentUserInList = "N")
        {
            SqlParameter[] oparam = new SqlParameter[3];
            oparam[0] = new SqlParameter("@ID", ID);
            oparam[1] = new SqlParameter("@LoginID", clsApplicationSetting.GetSessionValue("LoginID"));
            oparam[2] = new SqlParameter("@WantCurrentUserInList", WantCurrentUserInList);
            return clsDataBaseHelper.ExecuteDataSet("spu_GetUserman", oparam);
        }
        public static long fnSetErrorLog(string ErrDescription, string SystemException, string ActiveFunction, string ActiveForm, string ActiveModule)
        {
            long retID = 0;
            SqlParameter[] oparam = new SqlParameter[7];
            oparam[0] = new SqlParameter("@ErrDescription", ClsCommon.EnsureString(ErrDescription));
            oparam[1] = new SqlParameter("@SystemException", ClsCommon.EnsureString(SystemException));
            oparam[2] = new SqlParameter("@ActiveFunction", ClsCommon.EnsureString(ActiveFunction));
            oparam[3] = new SqlParameter("@ActiveForm", ClsCommon.EnsureString(ActiveForm));
            oparam[4] = new SqlParameter("@ActiveModule", ClsCommon.EnsureString(ActiveModule));
            oparam[5] = new SqlParameter("@createdby", clsApplicationSetting.GetSessionValue("LoginID"));
            oparam[6] = new SqlParameter("@IPAddress", ClsCommon.GetIPAddress());

            DataSet ds = clsDataBaseHelper.ExecuteDataSet("spu_SetErrorLog", oparam);
            if (ds.Tables[0].Rows.Count > 0)
                retID = Convert.ToInt32(ds.Tables[0].Rows[0]["RET_ID"]);
            else
                retID = 0;
            return retID;


        }

        public static DataSet fnGetRollId(long UserId)
        {
            SqlParameter[] oparam = new SqlParameter[1];
            oparam[0] = new SqlParameter("@UserId", UserId);
            return clsDataBaseHelper.ExecuteDataSet("spu_GetRoleID", oparam);
        }
        public static DataSet fnGetLogin(string UserID, string Password, string SessionID)
        {
            string conStr = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
            SqlParameter[] oparam = new SqlParameter[3];
            oparam[0] = new SqlParameter("@UserID", UserID);
            oparam[1] = new SqlParameter("@Password", Password);
            oparam[2] = new SqlParameter("@SessionID", SessionID);
            return clsDataBaseHelper.ExecuteDataSetWithCon("spu_GetLogin", oparam, conStr);
        }
       
        public static DataSet fnValidateUserOtp(string UserID, string otp)
        {
            string conStr = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
            SqlParameter[] oparam = new SqlParameter[3];
            oparam[0] = new SqlParameter("@UserID", UserID);
            oparam[1] = new SqlParameter("@Otp", otp);
            return clsDataBaseHelper.ExecuteDataSetWithCon("spu_ValidateOtp", oparam, conStr);
        }

        public static DataSet GetLoginForCompany(string LoginId, string CompanyId, int finId, string SessionID, string conString)
        {
            int autologoutTime =Convert.ToInt32(ConfigurationManager.AppSettings["AutoLogoutTime"].ToString());
            SqlParameter[] oparam = new SqlParameter[5];
            oparam[0] = new SqlParameter("@LoginId", LoginId);
            oparam[1] = new SqlParameter("@CompanyId", CompanyId);
            oparam[2] = new SqlParameter("@FinId", finId);
            oparam[3] = new SqlParameter("@SessionID", SessionID);
            oparam[4] = new SqlParameter("@AutologoutTime", autologoutTime);
            return clsDataBaseHelper.ExecuteDataSetWithCon("spu_GetLoginForCompany", oparam, conString);
        }

        public static DataSet UserActivityLog(string LoginId,int Type,string conString, string token)
        {
            int autologoutTime = Convert.ToInt32(ConfigurationManager.AppSettings["AutoLogoutTime"].ToString());
            SqlParameter[] oparam = new SqlParameter[3];
            oparam[0] = new SqlParameter("@UserID", LoginId);
            oparam[1] = new SqlParameter("@Type", Type);
            oparam[2] = new SqlParameter("@AuthToken", token);
            return clsDataBaseHelper.ExecuteDataSetWithCon("spu_ERPUserLogAdd", oparam, conString);
        }

        public static DataSet CheckUserPersmission(string RoleId, string @MenuDocNo, string Action,string token)
        {
            SqlParameter[] oparam = new SqlParameter[4];
            oparam[0] = new SqlParameter("@RoleId", RoleId);
            oparam[1] = new SqlParameter("@MenuDocNo", MenuDocNo);
            oparam[2] = new SqlParameter("@Action", Action);
            oparam[3] = new SqlParameter("@Token", token);
            return clsDataBaseHelper.ExecuteDataSet("sp_ERP_CheckUserPersmissionWithToken", oparam);
        }
        public static DataSet CheckValidToken(string token)
        {
            string autologoutTime = ConfigurationManager.AppSettings["AutoLogoutTime"].ToString();
            SqlParameter[] oparam = new SqlParameter[2];
            oparam[0] = new SqlParameter("@AuthToken", token);
            oparam[1] = new SqlParameter("@AutologoutTime", autologoutTime);
            return clsDataBaseHelper.ExecuteDataSet("spGetTokenWithExpired", oparam);
        }       
        public static DataSet GetCompanyDB(int CompanyId)
        {
            SqlParameter[] oparam = new SqlParameter[1];
            oparam[0] = new SqlParameter("@CompId", CompanyId);
            return clsDataBaseHelper.ExecuteDataSet("sp_GetCompanyDatabase", oparam);
        }
        public static DataSet fnGetLoginDataforMobile(long UserID, long EmpId)
        {
            SqlParameter[] oparam = new SqlParameter[2];
            oparam[0] = new SqlParameter("@UserID", UserID);
            oparam[1] = new SqlParameter("@EmpId", EmpId);
            return clsDataBaseHelper.ExecuteDataSet("spu_GetLoginDataforMobile", oparam);
        }
        public static DataSet fnGetLoginDataforMobilenonmitr(long UserID, long EmpId)
        {
            SqlParameter[] oparam = new SqlParameter[2];
            oparam[0] = new SqlParameter("@UserID", UserID);
            oparam[1] = new SqlParameter("@EmpId", EmpId);
            return clsDataBaseHelper.ExecuteDataSet("spu_GetLoginDataforMobileNonmitr", oparam);
        }

        public static DataSet fnGetErrorLog()
        {
            return clsDataBaseHelper.ExecuteDataSet("exec spu_GetErrorLog");

        }
        public static DataSet fnGetEmailTemplate(long ID)
        {
            SqlParameter[] oparam = new SqlParameter[1];
            oparam[0] = new SqlParameter("@id", ID);
            return clsDataBaseHelper.ExecuteDataSet("spu_GetEmailTemplate", oparam);
        }
        public static DataSet fnGetRoles(long lRoleid)
        {
            SqlParameter[] oparam = new SqlParameter[1];
            oparam[0] = new SqlParameter("@id", lRoleid);
            return clsDataBaseHelper.ExecuteDataSet("spu_GetRoles", oparam);
        }
        public static DataSet fnGetLoginUsers(long UserID)
        {
            SqlParameter[] oparam = new SqlParameter[1];
            oparam[0] = new SqlParameter("@id", UserID);
            return clsDataBaseHelper.ExecuteDataSet("spu_Get_User", oparam);
        }

        public static string FnSetOtp(int User_ID)
        {
            string OTP = "";
            SqlParameter[] oparam = new SqlParameter[2];

            oparam[0] = new SqlParameter("@User_ID", User_ID);
            oparam[1] = new SqlParameter("@IPAddress", ClsCommon.GetIPAddress());

            DataSet ds = clsDataBaseHelper.ExecuteDataSet("spu_SetOtp", oparam);
            if (ds.Tables[0].Rows.Count > 0)
            {
                OTP = ds.Tables[0].Rows[0]["RET_ID"].ToString();
            }
            return OTP;

        }
        public static CustomResponseModel GetCompanyList(string UserName, string DBName)
        {
            string conStr = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
            SqlParameter[] oparam = new SqlParameter[2];

            oparam[0] = new SqlParameter("@UserName", UserName);
            oparam[1] = new SqlParameter("@DBName", DBName);

            DataSet ds = clsDataBaseHelper.ExecuteDataSetWithCon("sp_GetCompanyList", oparam, conStr);
            CustomResponseModel objCustomResponseModel = new CustomResponseModel();
            objCustomResponseModel.ValidationInput = 0;
            objCustomResponseModel.ErrorMessage = "";
            objCustomResponseModel.data = ds;
            objCustomResponseModel.CustomMessage = "";
            objCustomResponseModel.IsSuccessStatusCode = true;
            objCustomResponseModel.CustumException = "";
            objCustomResponseModel.CommomDropDownData = null;
            return objCustomResponseModel;

        }
        public static CustomResponseModel GetFinanceListbyCompany(int CompId, string con)
        {

            SqlParameter[] oparam = new SqlParameter[1];

            oparam[0] = new SqlParameter("@COMPANY_ID", CompId);

            DataSet ds = clsDataBaseHelper.ExecuteDataSetWithCon("sp_GetFinanceListbyCompany", oparam, con);
            CustomResponseModel objCustomResponseModel = new CustomResponseModel();
            objCustomResponseModel.ValidationInput = 0;
            objCustomResponseModel.ErrorMessage = "";
            objCustomResponseModel.data = ds;
            objCustomResponseModel.CustomMessage = "";
            objCustomResponseModel.IsSuccessStatusCode = true;
            objCustomResponseModel.CustumException = "";
            objCustomResponseModel.CommomDropDownData = null;
            return objCustomResponseModel;

        }
        public static void FnSetSMSLog(string mobile, string msg, string status, string doctype)
        {
            SqlParameter[] oparam = new SqlParameter[6];
            oparam[0] = new SqlParameter("@mobile", mobile);
            oparam[1] = new SqlParameter("@msg", @msg);
            oparam[2] = new SqlParameter("@status", status);
            oparam[3] = new SqlParameter("@doctype", doctype);
            oparam[4] = new SqlParameter("@loginID", clsApplicationSetting.GetSessionValue("LoginID"));
            oparam[5] = new SqlParameter("@IPAddress", ClsCommon.GetIPAddress());
            clsDataBaseHelper.ExecuteDataSet("spu_SetSMS_Log", oparam);

        }

        public static DataSet fnCreateMail_OTP(string OTP)
        {
            SqlParameter[] oparam = new SqlParameter[2];
            oparam[0] = new SqlParameter("@EMPID", clsApplicationSetting.GetSessionValue("EMPID"));
            oparam[1] = new SqlParameter("@OTP", OTP);
            return clsDataBaseHelper.ExecuteDataSet("spu_CreateMail_OTPLogin", oparam);
        }
        public static PostResponse fnCreateMail_ForgotPassword(ForgotPassword.Request Modal)
        {
            PostResponse result = new PostResponse();

            using (SqlConnection con = new SqlConnection(ClsCommon.connectionstring()))
            {
                try
                {
                    con.Open();
                    using (SqlCommand command = new SqlCommand("spu_CreateMail_ForgotPassword", con))
                    {
                        SqlDataAdapter da = new SqlDataAdapter();
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("@Username", SqlDbType.VarChar).Value = Modal.Username ?? "";
                        command.Parameters.Add("@Token", SqlDbType.VarChar).Value = Modal.Token ?? "";
                        command.Parameters.Add("@IPAddress", SqlDbType.VarChar).Value = Modal.IPAddress;
                        command.CommandTimeout = 0;
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                result.ID = Convert.ToInt64(reader["RET_ID"]);
                                result.StatusCode = Convert.ToInt32(reader["COMMANDSTATUS"]);
                                result.SuccessMessage = reader["COMMANDMESSAGE"].ToString();
                                if (result.StatusCode > 0)
                                {
                                    result.Status = true;
                                }
                            }
                        }

                    }
                    con.Close();
                }
                catch (Exception ex)
                {
                    con.Close();
                    ClsCommon.LogError("Error during fnCreateMail_ForgotPassword. The query was executed :", ex.ToString(), "spu_CreateMail_ForgotPassword", "BoardModal", "BoardModal", "");


                    result.StatusCode = -1;
                    result.SuccessMessage = ex.Message.ToString();
                }
            }
            return result;

        }

        public static PostResponse fnGetValidateToken(GetValidateToken Modal)
        {
            PostResponse result = new PostResponse();
            using (SqlConnection con = new SqlConnection(ClsCommon.connectionstring()))
            {
                try
                {
                    con.Open();
                    using (SqlCommand command = new SqlCommand("spu_GetValidateToken", con))
                    {
                        SqlDataAdapter da = new SqlDataAdapter();
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("@Token", SqlDbType.VarChar).Value = ClsCommon.EnsureString(Modal.Token);
                        command.Parameters.Add("@Doctype", SqlDbType.VarChar).Value = ClsCommon.EnsureString(Modal.Doctype);
                        command.CommandTimeout = 0;
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                result.ID = Convert.ToInt64(reader["RET_ID"]);
                                result.StatusCode = Convert.ToInt32(reader["COMMANDSTATUS"]);
                                result.SuccessMessage = reader["COMMANDMESSAGE"].ToString();
                                if (result.StatusCode > 0)
                                {
                                    result.Status = true;
                                }
                            }
                        }

                    }
                    con.Close();
                }
                catch (Exception ex)
                {
                    con.Close();
                    ClsCommon.LogError("Error during fnGetCheckRecordExist. The query was executed :", ex.ToString(), "spu_GetCheckRecordExist", "Common_SPU", "Common_SPU", "");
                    result.StatusCode = -1;
                    result.SuccessMessage = ex.Message.ToString();
                }
            }
            return result;

        }

        public static PostResponse fnSetPasswordChangeForMobile(ChangePassword Modal)
        {
            PostResponse result = new PostResponse();


            using (SqlConnection con = new SqlConnection(ClsCommon.connectionstring()))
            {
                try
                {
                    con.Open();
                    using (SqlCommand command = new SqlCommand("spu_SetPasswordChangeForMobile", con))
                    {
                        SqlDataAdapter da = new SqlDataAdapter();
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("@OldPassword", SqlDbType.VarChar).Value = Modal.OldPassword ?? "";
                        command.Parameters.Add("@NewPassword", SqlDbType.VarChar).Value = Modal.NewPassword ?? "";
                        command.Parameters.Add("@LoginID", SqlDbType.VarChar).Value = Modal.LoginID;
                        command.Parameters.Add("@IPAddress", SqlDbType.VarChar).Value = Modal.IPAddress;
                        command.CommandTimeout = 0;
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                result.ID = Convert.ToInt64(reader["RET_ID"]);
                                result.StatusCode = Convert.ToInt32(reader["COMMANDSTATUS"]);
                                result.SuccessMessage = reader["COMMANDMESSAGE"].ToString();
                                if (result.ID > 0)
                                {
                                    result.Status = true;
                                    result.SuccessMessage = "Password Changed'";
                                }
                                else
                                {
                                    result.SuccessMessage = "Password not Changed'";
                                }
                            }
                        }

                    }
                    con.Close();
                }
                catch (Exception ex)
                {
                    con.Close();
                    ClsCommon.LogError("Error during fnCreateMail_ForgotPassword. The query was executed :", ex.ToString(), "spu_CreateMail_ForgotPassword", "BoardModal", "BoardModal", "");


                    result.StatusCode = -1;
                    result.SuccessMessage = ex.Message.ToString();
                }
            }
            return result;

        }
        public static PostResponse fnSetPasswordChange(ChangePassword Modal)
        {
            PostResponse result = new PostResponse();


            using (SqlConnection con = new SqlConnection(ClsCommon.connectionstring()))
            {
                try
                {
                    con.Open();
                    using (SqlCommand command = new SqlCommand("spu_SetPasswordChange", con))
                    {
                        SqlDataAdapter da = new SqlDataAdapter();
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("@OldPassword", SqlDbType.VarChar).Value = Modal.OldPassword ?? "";
                        command.Parameters.Add("@NewPassword", SqlDbType.VarChar).Value = Modal.NewPassword ?? "";
                        command.Parameters.Add("@Token", SqlDbType.VarChar).Value = Modal.Token ?? "";
                        command.Parameters.Add("@LoginID", SqlDbType.VarChar).Value = Modal.LoginID;
                        command.Parameters.Add("@IPAddress", SqlDbType.VarChar).Value = Modal.IPAddress;
                        command.CommandTimeout = 0;
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                result.ID = Convert.ToInt64(reader["RET_ID"]);
                                result.StatusCode = Convert.ToInt32(reader["COMMANDSTATUS"]);
                                result.SuccessMessage = reader["COMMANDMESSAGE"].ToString();
                                if (result.ID > 0)
                                {
                                    result.Status = true;
                                    result.SuccessMessage = "Password Changed'";
                                }
                                else
                                {
                                    result.SuccessMessage = "Password not Changed'";
                                }
                            }
                        }

                    }
                    con.Close();
                }
                catch (Exception ex)
                {
                    con.Close();
                    ClsCommon.LogError("Error during fnCreateMail_ForgotPassword. The query was executed :", ex.ToString(), "spu_CreateMail_ForgotPassword", "BoardModal", "BoardModal", "");


                    result.StatusCode = -1;
                    result.SuccessMessage = ex.Message.ToString();
                }
            }
            return result;

        }

        public static long fnSetEmailTemplate(long ID, string GroupName, string TemplateName, string SMSBody, string Repository, string Body, string Subject, string CCMail, string BCCMail)
        {
            long retID = 0;
            SqlParameter[] oparam = new SqlParameter[11];
            oparam[0] = new SqlParameter("@id", ID);
            oparam[1] = new SqlParameter("@TemplateName", ClsCommon.EnsureString(TemplateName));
            oparam[2] = new SqlParameter("@Body", ClsCommon.EnsureStringSingle(Body));
            oparam[3] = new SqlParameter("@Subject", ClsCommon.EnsureString(Subject));
            oparam[4] = new SqlParameter("@CCMail", ClsCommon.EnsureString(CCMail));
            oparam[5] = new SqlParameter("@BCCMail", ClsCommon.EnsureString(BCCMail));
            oparam[6] = new SqlParameter("@SMSBody", ClsCommon.EnsureString(SMSBody));
            oparam[7] = new SqlParameter("@Repository", ClsCommon.EnsureString(Repository));
            oparam[8] = new SqlParameter("@createdby", clsApplicationSetting.GetSessionValue("LoginID"));
            oparam[9] = new SqlParameter("@IPAddress", ClsCommon.GetIPAddress());
            oparam[10] = new SqlParameter("@GroupName", ClsCommon.EnsureString(GroupName));
            DataSet ds = clsDataBaseHelper.ExecuteDataSet("spu_SetEmailTemplate", oparam);
            if (ds.Tables[0].Rows.Count > 0)
                retID = Convert.ToInt32(ds.Tables[0].Rows[0]["RET_ID"]);
            else
                retID = 0;
            return retID;

        }

        public static long fnSetConfigSetting(long ConfigID, string Category, string SubCategory, string ConfigKey, string ConfigValue, string Remarks, string Help, int Priority)
        {
            long retID = 0;
            SqlParameter[] oparam = new SqlParameter[10];
            oparam[0] = new SqlParameter("@ConfigID", ConfigID);
            oparam[1] = new SqlParameter("@Category", ClsCommon.EnsureString(Category));
            oparam[2] = new SqlParameter("@SubCategory", ClsCommon.EnsureString(SubCategory));
            oparam[3] = new SqlParameter("@ConfigKey", ClsCommon.EnsureString(ConfigKey));
            oparam[4] = new SqlParameter("@ConfigValue", ClsCommon.EnsureString(ConfigValue));
            oparam[5] = new SqlParameter("@Remarks", ClsCommon.EnsureString(Remarks));
            oparam[6] = new SqlParameter("@Help", ClsCommon.EnsureString(Help));
            oparam[7] = new SqlParameter("@Priority", Priority);
            oparam[8] = new SqlParameter("@createdby", clsApplicationSetting.GetSessionValue("LoginID"));
            oparam[9] = new SqlParameter("@IPAddress", ClsCommon.GetIPAddress());

            DataSet ds = clsDataBaseHelper.ExecuteDataSet("spu_SetConfigSetting", oparam);
            if (ds.Tables[0].Rows.Count > 0)
                retID = Convert.ToInt32(ds.Tables[0].Rows[0]["RET_ID"]);
            else
                retID = 0;
            return retID;
        }
        public static long fnSetUserRole(long RoleID, string RoleName, string Description, int Priority, int IsActive)
        {
            long fnSetUserRole = 0;
            SqlParameter[] oparam = new SqlParameter[7];
            oparam[0] = new SqlParameter("@id", RoleID);
            oparam[1] = new SqlParameter("@Role_Name", RoleName);
            oparam[2] = new SqlParameter("@Description", ClsCommon.EnsureString(Description));
            oparam[3] = new SqlParameter("@Priority", Priority);
            oparam[4] = new SqlParameter("@IsActive", IsActive);
            oparam[5] = new SqlParameter("@IPAddress", ClsCommon.GetIPAddress());
            oparam[6] = new SqlParameter("@createdby", clsApplicationSetting.GetSessionValue("LoginID"));
            DataSet ds = clsDataBaseHelper.ExecuteDataSet("spu_SetUserRole", oparam);
            if (ds.Tables[0].Rows.Count > 0)
            {
                fnSetUserRole = Convert.ToInt64(ds.Tables[0].Rows[0]["RET_ID"]);
            }

            return fnSetUserRole;
        }

        // this is unnessary but using is old code so it is mandiatory to set UserID and Role on role_user_map table - said Ravi
        public static long fnSetRole_User_Map(string lMap_Id, string lUser_id, string lRoleid)
        {
            long fnSetRole_User_Map = 0;
            SqlParameter[] oparam = new SqlParameter[3];
            oparam[0] = new SqlParameter("@id", lMap_Id);
            oparam[1] = new SqlParameter("@user_id", lUser_id);
            oparam[2] = new SqlParameter("@role_id", lRoleid);
            DataSet ds = clsDataBaseHelper.ExecuteDataSet("spu_SetRole_User_Map", oparam);
            if (ds.Tables[0].Rows.Count > 0)
                fnSetRole_User_Map = Convert.ToInt64(ds.Tables[0].Rows[0]["RET_ID"]);
            else
                fnSetRole_User_Map = 0;
            return fnSetRole_User_Map;
        }
        public static long fnSetUsers(long ID, string MainRoleID, string MapRoleID, string Username, string Password, string Firstname,
            string Middlename, string Lastname, string Email, long Address, string Theme, int Priority, int IsActive)
        {
            long fnSetUsers = 0;
            SqlParameter[] oparam = new SqlParameter[14];
            oparam[0] = new SqlParameter("@id", ID);
            oparam[1] = new SqlParameter("@user_name", ClsCommon.EnsureString(Username));
            oparam[2] = new SqlParameter("@password", clsApplicationSetting.Encrypt(Password));
            oparam[3] = new SqlParameter("@first_name", ClsCommon.EnsureString(Firstname));
            oparam[4] = new SqlParameter("@middle_name", ClsCommon.EnsureString(Middlename));
            oparam[5] = new SqlParameter("@last_name", ClsCommon.EnsureString(Lastname));
            oparam[6] = new SqlParameter("@email", ClsCommon.EnsureString(Email));
            oparam[7] = new SqlParameter("@address", Address);
            oparam[8] = new SqlParameter("@theme", ClsCommon.EnsureString(Theme));
            oparam[9] = new SqlParameter("@RoleID", ClsCommon.EnsureString(MainRoleID));
            oparam[10] = new SqlParameter("@userid", clsApplicationSetting.GetSessionValue("LoginID"));
            oparam[11] = new SqlParameter("@Priority", Priority);
            oparam[12] = new SqlParameter("@IsActive", IsActive);
            oparam[13] = new SqlParameter("@IPAddress", ClsCommon.GetIPAddress());

            DataSet ds = clsDataBaseHelper.ExecuteDataSet("spu_SetUsers", oparam);
            if (ds.Tables[0].Rows.Count > 0)
            {
                fnSetUsers = Convert.ToInt64(ds.Tables[0].Rows[0]["RET_ID"]);
                // fnSetRole_User_Map(MapRoleID, fnSetUsers.ToString(), clsApplicationSetting.GetSessionValue("RoleID"));
            }
            else
                fnSetUsers = 0;
            return fnSetUsers;
        }

        public static PostResponse SetLoginUsers(UserMan.Add modal)
        {
            PostResponse Result = new PostResponse();
            using (SqlConnection con = new SqlConnection(ClsCommon.connectionstring()))
            {
                try
                {
                    string first_name = "", middle_name = "", last_name = "";
                    if (!string.IsNullOrEmpty(modal.Name))
                    {
                        if (modal.Name.Contains(' '))
                        {
                            var a = modal.Name.Split(' ');
                            if (a.Length == 3)
                            {
                                first_name = a[0];
                                middle_name = a[1];
                                last_name = a[2];
                            }
                            else if (a.Length == 2)
                            {
                                first_name = a[0];
                                last_name = a[1];
                            }
                            else
                            {
                                first_name = a[0];
                            }
                        }
                        else
                        {
                            first_name = modal.Name;
                        }
                    }

                    con.Open();
                    using (SqlCommand command = new SqlCommand("spu_SetUsers", con))
                    {
                        SqlDataAdapter da = new SqlDataAdapter();
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("@ID", SqlDbType.Int).Value = modal.ID ?? 0;
                        command.Parameters.Add("@UserType", SqlDbType.VarChar).Value = modal.UserType ?? "";
                        command.Parameters.Add("@user_name", SqlDbType.VarChar).Value = modal.user_name ?? "";
                        command.Parameters.Add("@password", SqlDbType.VarChar).Value = clsApplicationSetting.Encrypt(modal.password) ?? "";
                        command.Parameters.Add("@first_name", SqlDbType.VarChar).Value = ClsCommon.EnsureString(first_name);
                        command.Parameters.Add("@middle_name", SqlDbType.VarChar).Value = ClsCommon.EnsureString(middle_name);
                        command.Parameters.Add("@last_name", SqlDbType.VarChar).Value = ClsCommon.EnsureString(last_name);
                        command.Parameters.Add("@email", SqlDbType.VarChar).Value = modal.email ?? "";
                        command.Parameters.Add("@RoleIDs", SqlDbType.VarChar).Value = modal.RoleIDs ?? "";
                        command.Parameters.Add("@Priority", SqlDbType.Int).Value = modal.Priority ?? 0;
                        command.Parameters.Add("@IsActive", SqlDbType.Int).Value = 1;
                        command.Parameters.Add("@createdby", SqlDbType.VarChar).Value = clsApplicationSetting.GetSessionValue("LoginID");
                        command.Parameters.Add("@IPAddress", SqlDbType.VarChar).Value = ClsCommon.GetIPAddress();
                        command.CommandTimeout = 0;
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Result.ID = Convert.ToInt64(reader["RET_ID"]);
                                Result.StatusCode = Convert.ToInt32(reader["COMMANDSTATUS"]);
                                Result.SuccessMessage = reader["COMMANDMESSAGE"].ToString();
                                if (Result.StatusCode > 0)
                                {
                                    Result.Status = true;
                                }
                            }
                        }

                    }
                    con.Close();
                }
                catch (Exception ex)
                {
                    con.Close();
                    Result.StatusCode = -1;
                    Result.SuccessMessage = ex.Message.ToString();
                }
            }
            return Result;
        }
        public static PostResponse SetLoginUsersMapping(UserMan.Add modal)
        {
            PostResponse Result = new PostResponse();
            using (SqlConnection con = new SqlConnection(ClsCommon.connectionstring()))
            {
                try
                {
                    string first_name = "", middle_name = "", last_name = "";
                    if (!string.IsNullOrEmpty(modal.Name))
                    {
                        if (modal.Name.Contains(' '))
                        {
                            var a = modal.Name.Split(' ');
                            if (a.Length == 3)
                            {
                                first_name = a[0];
                                middle_name = a[1];
                                last_name = a[2];
                            }
                            else if (a.Length == 2)
                            {
                                first_name = a[0];
                                last_name = a[1];
                            }
                            else
                            {
                                first_name = a[0];
                            }
                        }
                        else
                        {
                            first_name = modal.Name;
                        }
                    }

                    con.Open();
                    using (SqlCommand command = new SqlCommand("spu_Onboarding_SetUsersMapping", con))
                    {
                        SqlDataAdapter da = new SqlDataAdapter();
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("@ID", SqlDbType.Int).Value = modal.ID ?? 0;
                        command.Parameters.Add("@UserType", SqlDbType.VarChar).Value = modal.UserType ?? "";
                        command.Parameters.Add("@user_name", SqlDbType.VarChar).Value = modal.user_name ?? "";
                        command.Parameters.Add("@password", SqlDbType.VarChar).Value = clsApplicationSetting.Encrypt(modal.password) ?? "";
                        command.Parameters.Add("@first_name", SqlDbType.VarChar).Value = ClsCommon.EnsureString(first_name);
                        command.Parameters.Add("@middle_name", SqlDbType.VarChar).Value = ClsCommon.EnsureString(middle_name);
                        command.Parameters.Add("@last_name", SqlDbType.VarChar).Value = ClsCommon.EnsureString(last_name);
                        command.Parameters.Add("@email", SqlDbType.VarChar).Value = modal.email ?? "";
                        command.Parameters.Add("@RoleIDs", SqlDbType.VarChar).Value = modal.RoleIDs ?? "";
                        command.Parameters.Add("@Priority", SqlDbType.Int).Value = modal.Priority ?? 0;
                        command.Parameters.Add("@IsActive", SqlDbType.Int).Value = 1;
                        command.Parameters.Add("@createdby", SqlDbType.VarChar).Value = clsApplicationSetting.GetSessionValue("LoginID");
                        command.Parameters.Add("@IPAddress", SqlDbType.VarChar).Value = ClsCommon.GetIPAddress();
                        command.CommandTimeout = 0;
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Result.ID = Convert.ToInt64(reader["RET_ID"]);
                                Result.StatusCode = Convert.ToInt32(reader["COMMANDSTATUS"]);
                                Result.SuccessMessage = reader["COMMANDMESSAGE"].ToString();
                                if (Result.StatusCode > 0)
                                {
                                    Result.Status = true;
                                }
                            }
                        }

                    }
                    con.Close();
                }
                catch (Exception ex)
                {
                    con.Close();
                    Result.StatusCode = -1;
                    Result.SuccessMessage = ex.Message.ToString();
                }
            }
            return Result;
        }

        ////////////////////////////////////////////           SA ERP             ////////////////////////////////////////////////

        public static CustomResponseModel GetItemCategoryList(string sDocType, int iTableId)
        {
            SqlParameter[] oparam = new SqlParameter[2];

            oparam[0] = new SqlParameter("@DocType", sDocType);
            oparam[1] = new SqlParameter("@TableId", iTableId);

            DataSet ds = clsDataBaseHelper.ExecuteDataSet("spu_ERPModuleProcess", oparam);
            CustomResponseModel objCustomResponseModel = new CustomResponseModel();
            objCustomResponseModel.ValidationInput = 0;
            objCustomResponseModel.ErrorMessage = "";
            objCustomResponseModel.data = ds;
            objCustomResponseModel.CustomMessage = "";
            objCustomResponseModel.IsSuccessStatusCode = true;
            objCustomResponseModel.CustumException = "";
            objCustomResponseModel.CommomDropDownData = null;
            return objCustomResponseModel;

        }

        ////////////////////////////////////////////              End                ////////////////////////////////////////////////


        // ------------------------Email code -----------------------------
        public static List<EmailTemplate> GetEmailTemplateList(long ID)
        {
            List<EmailTemplate> List = new List<EmailTemplate>();
            EmailTemplate EItem = new EmailTemplate();
            //string SQL = "";

            try
            {
                DataSet TempModuleDataSet = Common_SPU.fnGetEmailTemplate(ID);
                foreach (DataRow item in TempModuleDataSet.Tables[0].Rows)
                {
                    EItem = new EmailTemplate();
                    EItem.ID = Convert.ToInt32(item["ID"]);
                    EItem.TemplateName = item["TemplateName"].ToString();
                    EItem.Body = item["Body"].ToString();
                    EItem.GroupName = item["GroupName"].ToString();
                    EItem.Subject = item["Subject"].ToString();
                    EItem.CCMail = item["CCMail"].ToString();
                    EItem.SMSBody = item["SMSBody"].ToString();
                    EItem.BCCMail = item["BCCMail"].ToString();
                    EItem.Repository = item["Repository"].ToString();
                    EItem.IsActive = Convert.ToBoolean(item["IsActive"].ToString());
                    EItem.CreatedByID = Convert.ToInt32(item["createdby"]);
                    EItem.ModifiedByID = Convert.ToInt32(item["modifiedby"]);
                    EItem.Priority = Convert.ToInt32(item["Priority"]);
                    //EItem.CreatedDate = Convert.ToDateTime(item["createdat"]).ToString(DateFormatC);
                    //EItem.ModifiedDate = Convert.ToDateTime(item["modifiedat"]).ToString(DateFormatC);
                    EItem.IPAddress = item["IPAddress"].ToString();
                    List.Add(EItem);
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetEmailTemplateList. The query was executed :", ex.ToString(), "CP/GetEmailTemplateList()", "ToolsModal", "ToolsModal", "");
            }
            return List;
        }
        
    }
}

