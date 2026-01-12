using SahajFramework.Models;
using SahajFramework.ModelsMaster;
using SahajFramework.ModelsMasterHelper;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using Newtonsoft.Json;
using System.Configuration;
using System.Data.SqlClient;
using System.Data.OleDb;
using Dapper;
using Sahaj.API.DAL;
using Sahaj.API.Model;
using System.Web.Security;
using Generic;
using NLog;
using System.Data.SqlTypes;
using Syncfusion.EJ2.Navigations;

namespace SahajFramework.CommonClass
{

    public class ClsCommon
    {

        public static string ShortString(string str, int maxLength)
        {
            if (string.IsNullOrEmpty(str)) return str;

            return str.Substring(0, Math.Min(str.Length, maxLength));
        }
        public static string connectionstring()
        {

            string conn = GetConnectionStringFromAuth();
            if (!string.IsNullOrWhiteSpace(conn))
            {
                return conn;
            }
            else
            {
                return ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
            }

        }
        private static string GetConnectionStringFromAuth()
        {
            try
            {
                var context = HttpContext.Current;
                if (context != null && context.Request != null)
                {
                    string authToken = context.Request.QueryString["auth"];

                    if (!string.IsNullOrWhiteSpace(authToken))
                    {
                        // 🧠 You can implement your own logic here
                        // Example: pull from configuration, or decrypt and derive from token
                        return clsApplicationSetting.DecryptQueryString(authToken)[3];
                    }
                }
            }
            catch
            {
                // log error if needed
            }

            return null;
        }
        public static string GetIPAddress()
        {
            return HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
        }
        public static string RemoveFromString(string FullString, string RemoveWith)
        {
            string MyValue = "";
            if (!string.IsNullOrEmpty(FullString))
            {
                if (FullString.Contains(','))
                {
                    foreach (string item in FullString.Split(','))
                    {
                        if (item != RemoveWith)
                        {
                            MyValue += item + ",";
                        }
                    }
                }
                else
                {
                    MyValue = MyValue.Replace(MyValue, RemoveWith);
                }
            }
            return MyValue.TrimEnd(',');
        }

        public static string InsertIntoString(string FullString, string InsertWith)
        {
            string MyValue = "";

            if (FullString.Contains(','))
            {
                FullString += "," + InsertWith;

            }
            else
            {
                FullString = InsertWith + ",";
            }
            MyValue = FullString.TrimEnd(',').TrimStart(',');

            return MyValue;
        }

        public static string GetDate(string dt)
        {
            string st = string.Empty;
            string[] arr;
            if (dt != "")
            {
                arr = dt.Split('/');
                if (arr.Length >= 2)
                {
                    st = arr[1] + "/" + arr[0] + "/" + arr[2];
                }
            }
            return "" + st + "";
        }

        public static string GetDateTime(string dt)
        {
            string st = string.Empty;
            string[] arr;
            string[] arr1;
            if (dt != "")
            {
                arr1 = dt.Split(' ');

                arr = arr1[0].Split('/');

                if (arr.Length >= 2)
                {
                    st = arr[1] + "/" + arr[0] + "/" + arr[2] + " " + arr1[1];
                }
            }
            return "" + st + " ";
        }
        public static string EnsureString(string str)
        {
            if (string.IsNullOrEmpty(str))
            {
                str = "";
            }
            return str.Replace("'", "''").Replace("\"", "" + "").Trim();
        }

        public static long EnsureNumber(string str)
        {
            long ret = 0;
            long.TryParse(str, out ret);
            return ret;
        }
        public static string GetPageName()
        {
            string RR = clsApplicationSetting.GetWebConfigValue("ProjectName");
            var ReturnURL = HttpContext.Current.Request.Url.Segments;

            if (ReturnURL.Length > 1)
            {
                RR = RR + ": " + ReturnURL[ReturnURL.Length - 1];
            }
            return RR;
        }
        public static long EnsureHours(string str)
        {

            long ret = 0;
            long.TryParse(str, out ret);
            return ret;
        }

        public static string EnsureStringSingle(string str)
        {
            if (string.IsNullOrEmpty(str))
            {
                str = "";
            }
            return str.Replace("'", "''").Trim();
        }
        public static bool LogError(string ErrDescription, string SystemException = "", string ActiveFunction = "", string ActiveForm = "", string ActiveModule = "", string LogMessage = "")
        {
            try
            {
                //string SQL = null;
                Common_SPU.fnSetErrorLog(ErrDescription, SystemException, ActiveFunction, ActiveForm, ActiveModule);
                HttpContext.Current.Response.Write(LogMessage.Trim());
                return true;
            }
            catch (Exception ex)
            {
                HttpContext.Current.Response.Write(LogMessage.Trim() + "<br><br> & " + SystemException.Trim());
                return false;
            }

        }

        public static int UpdateIsActiveCommon(string ColomnName, string TableName, string WhereColomn, string ID, string Value)
        {
            string SQL = "";
            int status = -1;
            long LoginID = 0;
            bool Valid = true;
            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            try
            {
                if (TableName == "master_Location" && Value == "0")
                {
                    if (fnIsExists("master_emp", "WorkLocationID", ID, " and isdeleted=0"))
                    {
                        Valid = false;
                    }
                    else if (fnIsExists("map_holiday_loc", "location_id", ID, " and isdeleted=0"))
                    {
                        Valid = false;
                    }
                }
                else if (TableName == "master_thematicarea" && Value == "0")
                {
                    if (fnIsExists("map_thematic_Area", "ta_id", ID, " and isdeleted=0"))
                    {
                        Valid = false;
                    }
                }
                else if (TableName == "master_design" && Value == "0")
                {
                    if (fnIsExists("master_emp", "design_id", ID, " and isdeleted=0"))
                    {
                        Valid = false;
                    }
                }
                else if (TableName == "MasterAll" && Value == "0" && fnGetOtherFieldName("MasterAll", "table_name", "table_name", "id", ID, "") == "BankList")
                {
                    if (fnIsExists("EMP_Account", "BankID", ID, " and isdeleted=0 and empid>0"))
                    {
                        Valid = false;
                    }
                }
                else if (TableName == "Master_Department" && Value == "0")
                {
                    if (fnIsExists("master_emp", "DepartmentID", ID, " and isdeleted=0"))
                    {
                        Valid = false;
                    }
                }
                else if (TableName == "Job" && Value == "0")
                {
                    if (fnIsExists("JobDetails", "JobID", ID, " and isdeleted=0"))
                    {
                        Valid = false;
                    }
                }

                if (Valid)
                {
                    if (TableName == "TravelDesk")
                    {
                        SQL = "Update " + TableName + "  Set " + ColomnName + "='" + Value + "', isdeleted=1, modifiedat=GetDate(),modifiedby=" + LoginID + ", IPAddress='" + GetIPAddress() + "' Where " + WhereColomn + "=" + ID;
                        clsDataBaseHelper.ExecuteNonQuery(SQL);
                        status = Convert.ToInt32(ID);
                    }
                    else if (TableName == "Exist_OfficeListing")
                    {
                        SQL = "Update " + TableName + "  Set " + ColomnName + "='" + Value + "',  modifiedat=GetDate(),modifiedby=" + LoginID + ", IPAddress='" + GetIPAddress() + "' Where " + WhereColomn + "=" + ID;
                        clsDataBaseHelper.ExecuteNonQuery(SQL);
                        status = Convert.ToInt32(ID);
                    }
                    else if (TableName == "Exist_SignatoryMaster")
                    {
                        SQL = "Update " + TableName + "  Set " + ColomnName + "='" + Value + "',  modifiedat=GetDate(),modifiedby=" + LoginID + ", IPAddress='" + GetIPAddress() + "' Where " + WhereColomn + "=" + ID;
                        clsDataBaseHelper.ExecuteNonQuery(SQL);
                        status = Convert.ToInt32(ID);
                    }
                    else if (TableName == "MPR")
                    {
                        if (Value == "1")
                        {
                            string query = @"SELECT  COUNT(*) AS Data From MPR WHERE MPRID=" + ID + " AND  CONVERT(DATE,modifiedat) =CONVERT(DATE, GETDATE()) ";
                            DataSet ds = clsDataBaseHelper.ExecuteDataSet(query);
                            string returnValue = ds.Tables[0].Rows[0]["Data"].ToString();
                            if (returnValue == "1")
                            {
                                SQL = "Update " + TableName + "  Set " + ColomnName + "='" + Value + "', modifiedat=GetDate(),modifiedby=" + LoginID + ", IPAddress='" + GetIPAddress() + "' Where " + WhereColomn + "=" + ID;
                                clsDataBaseHelper.ExecuteNonQuery(SQL);
                                status = Convert.ToInt32(ID);
                            }

                        }
                        else
                        {
                            SQL = "Update " + TableName + "  Set " + ColomnName + "='" + Value + "', modifiedat=GetDate(),modifiedby=" + LoginID + ", IPAddress='" + GetIPAddress() + "' Where " + WhereColomn + "=" + ID;
                            clsDataBaseHelper.ExecuteNonQuery(SQL);
                            status = Convert.ToInt32(ID);
                        }
                    }
                    else
                    {
                        SQL = "Update " + TableName + "  Set " + ColomnName + "='" + Value + "', modifiedat=GetDate(),modifiedby=" + LoginID + ", IPAddress='" + GetIPAddress() + "' Where " + WhereColomn + "=" + ID;
                        clsDataBaseHelper.ExecuteNonQuery(SQL);
                        status = Convert.ToInt32(ID);
                    }

                }
            }
            catch (Exception ex)
            {
                LogError("Error during UpdateIsActiveCommon. The query was executed :" + SQL, ex.ToString(), "ClsCommon/UpdateIsActiveCommon()", "ClsCommon", "ClsCommon", "");
            }

            return status;
        }

        public static bool fnIsExists(string sTableName, string sFieldName, string sFieldValue, string sExtraQry = "")
        {
            string sSQL = "";
            bool bStatus = false;
            try
            {
                sSQL = "SELECT " + sFieldName + " FROM " + sTableName + " WHERE " + sFieldName + "='" + sFieldValue.Trim() + "'" + sExtraQry;
                if (clsDataBaseHelper.CheckRecord(sSQL) != 0)
                {
                    bStatus = true;
                }
            }
            catch (Exception ex)
            {
                LogError("Error during fnIsExists. The executed query :" + sSQL, ex.ToString(), "clsCommon/fnIsExists()", "clsCommon", "clsCommon", "");
            }

            return bStatus;
        }

        public static string fnGetOtherFieldName(string sTableName, string sSelValue, string sRetColName, string sConColName, string sConColValue, string sExtraQuery)
        {
            string sRetValue = "";
            try
            {

                string sQuery = "SELECT " + sSelValue + " AS " + sRetColName + " FROM " + sTableName + " WHERE " + sConColName + " ='" + sConColValue + "'" + sExtraQuery;
                DataSet dsName = clsDataBaseHelper.ExecuteDataSet(sQuery);
                if (dsName.Tables[0].Rows.Count > 0)
                {
                    sRetValue = (Convert.IsDBNull(dsName.Tables[0].Rows[0]["" + sRetColName + ""]) ? "" : dsName.Tables[0].Rows[0]["" + sRetColName + ""]).ToString();
                }
            }
            catch (Exception ex)
            {
                LogError(ex.Message.ToString(), ex.ToString(), "fnGetOther_FieldName", "", "clsCommon", "");
            }
            return sRetValue;
        }

        public static int fnSetDataString(string SqlQuery)
        {
            string SQL = "";
            int status = -1;
            try
            {
                return clsDataBaseHelper.ExecuteNonQuery(SqlQuery);
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during fnSetDataString. The query was executed :" + SQL, ex.ToString(), "ClsCommon/fnSetDataString()", "ClsCommon", "ClsCommon", "");
            }

            return status;
        }
        public static bool UpdateColom_Common(string ColomnName, string TableName, string WhereColom, string ID, string Value)
        {
            bool ret = false;
            long LoginID = 0;
            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            //int SaveID = 0;
            string SQL = "";
            try
            {
                SQL = "update " + TableName + " set " + ColomnName + "='" + Value + "', modifiedat=getdate(),modifiedby=" + LoginID + ", IPAddress='" + GetIPAddress() + "' where " + WhereColom + "=" + ID;
                if (clsDataBaseHelper.ExecuteNonQuery(SQL) > 0)
                {
                    ret = true;
                }

            }
            catch (Exception ex)
            {
                LogError("Error during UpdateColom_Common. The query was executed :", ex.ToString(), SQL, "clsCommon", "common class", "");
            }
            return ret;

        }




        public static int SetLeaveShowInSummary(string LeaveID, int ShowInSummary)
        {
            string SQL = "";
            int status = -1;
            try
            {
                SQL = "Update master_leave Set ShowInSummary=" + ShowInSummary + ", modifiedat=GetDate(),modifiedby=" + clsApplicationSetting.GetSessionValue("LoginID") + ", IPAddress='" + GetIPAddress() + "' Where ID=" + LeaveID;
                clsDataBaseHelper.ExecuteNonQuery(SQL);
                status = Convert.ToInt32(LeaveID);

            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during SetLeaveShowInSummary. The query was executed :" + SQL, ex.ToString(), "ClsCommon/SetShowInHomeCategory()", "ClsCommon", "ClsCommon", "");
            }

            return status;
        }


        public static string ConvertDataTableToJson(DataTable table)
        {
            string JSONString = string.Empty;
            JSONString = JsonConvert.SerializeObject(table);
            return JSONString;
        }


        public static bool fnCheckDuplicateColValue(string sTableName, string sFieldIdName, string sFieldIdValue, string sFieldName, string sFieldValue, string sExtraQry = "")
        {
            string sSQL = "";
            bool bStatus = false;
            try
            {
                sSQL = "SELECT " + sFieldIdName + " FROM " + sTableName + " WHERE " + sFieldIdName + "<>'" + sFieldIdValue + "' AND " + sFieldName + "='" + sFieldValue.Trim() + "'" + sExtraQry;
                if (clsDataBaseHelper.CheckRecord(sSQL) != 0)
                {
                    bStatus = true;
                }
            }
            catch (Exception ex)
            {
                LogError("Error during fnCheckDuplicateColValue. The executed query :" + sSQL, ex.ToString(), "clsCommon/fnCheckDuplicateColValue()", "clsCommon", "clsCommon", "");
            }

            return bStatus;
        }



        public static bool CreateMenuJSon()
        {
            long LoginID = 0;
            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            bool myValue = false;
            string DirectoryName = clsApplicationSetting.GetPhysicalPath("json");
            string FileName = DirectoryName + "/AdminMenu.json";
            ToolsModal Tools = new ToolsModal();
            GetResponse modal = new GetResponse();
            modal.IPAddress = GetIPAddress();
            modal.LoginID = LoginID;
            if (File.Exists(FileName))
            {
                File.Delete(FileName);
            }
            using (StreamWriter file = File.CreateText(FileName))
            {
                JsonSerializer serializer = new JsonSerializer();
                serializer.Serialize(file, Tools.GetAdminMenuList(modal));
                myValue = true;
            }

            return myValue;
        }

        public static bool CreateLoginMenuJSon(string userId, AdminModuleMenu objAdminModuleMenu)
        {
            long LoginID = 0;
            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            bool myValue = false;
            string DirectoryName = clsApplicationSetting.GetPhysicalPath("json");
            string FileName = DirectoryName + "/"+ userId+"_AdminMenu.json";          
            
            if (File.Exists(FileName))
            {
                File.Delete(FileName);
            }
            using (StreamWriter file = File.CreateText(FileName))
            {
                JsonSerializer serializer = new JsonSerializer();
                serializer.Serialize(file, objAdminModuleMenu);
                myValue = true;
            }

            return myValue;
        }
        public static List<AdminMenu> GetMenuJSON()
        {
            string FileName = clsApplicationSetting.GetPhysicalPath("json") + "/AdminMenu.json";
            if (!File.Exists(FileName))
            {
                CreateMenuJSon();
            }
            List<AdminMenu> items = new List<AdminMenu>();
            if (File.Exists(FileName))
            {
                using (StreamReader r = new StreamReader(FileName))
                {
                    string json = r.ReadToEnd();
                    items = JsonConvert.DeserializeObject<List<AdminMenu>>(json);
                }
            }
            return items;
        }
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public static AdminModuleMenu GetAdminModuleMenu(string roleId)
        {
            string nroleId = "";
            string conString =   clsApplicationSetting.DecryptQueryString(roleId)[3];
            
            nroleId = clsApplicationSetting.DecryptQueryString(roleId)[9].ToString();
            var userId = clsApplicationSetting.DecryptQueryString(roleId)[8].ToString();
            string FileName = clsApplicationSetting.GetPhysicalPath("json") + "/" + userId + "_AdminMenu.json";
            AdminModuleMenu items = new AdminModuleMenu();
            if (File.Exists(FileName))
            {
                using (StreamReader r = new StreamReader(FileName))
                {
                    string json = r.ReadToEnd();
                    items = JsonConvert.DeserializeObject<AdminModuleMenu>(json);
                }
            }
            return items;
            //DataSet ds = new DataSet();
            //AdminModuleMenu objAdminModuleMenu = new AdminModuleMenu();
            //try
            //{
            //    string commandText = "sp_ERP_GetMenuByRoles";
            //    SqlParameter[] param = new SqlParameter[1];

            //    param[0] = new SqlParameter("@RoleId", nroleId);               
            //    ds = clsDataBaseHelper.ExecuteDataSetWithCon(commandText, param, conString);
            //    var actAdminMenu = ds.Tables[0].AsEnumerable()

            //       .Select(dataRow => new AdminMenu
            //       {
            //           ActualFileName = string.IsNullOrWhiteSpace(dataRow.Field<string>("FileUrl")) ? string.Empty : dataRow.Field<string>("FileUrl").Trim(),
            //           MenuPriority = Convert.ToInt16(dataRow.Field<Int16>("MenuPriority")),
            //           ParentMenuID = Convert.ToInt32(dataRow.Field<Int32>("ParentMenuID")),
            //           MenuID = Convert.ToInt32(dataRow.Field<Int32>("MenuID")),
            //           ModuleID = Convert.ToInt32(dataRow.Field<Int32>("ModuleID")),
            //           MenuName = string.IsNullOrWhiteSpace(dataRow.Field<string>("MenuName")) ? string.Empty : dataRow.Field<string>("MenuName").Trim(),                      
            //           MenuURL = string.IsNullOrWhiteSpace(dataRow.Field<string>("MenuURL"))
            //                        ? string.Empty
            //                        : AppendAuthToken(dataRow.Field<string>("MenuURL").Trim(), roleId)
            //       }).ToList();

            //    var actAdminModule = ds.Tables[1].AsEnumerable()
            //   .Select(dataRow => new AdminModule
            //   {
            //       ActualFileName = string.IsNullOrWhiteSpace(dataRow.Field<string>("FileUrl")) ? string.Empty : dataRow.Field<string>("FileUrl").Trim(),
            //       ModulePriority = Convert.ToInt32(dataRow.Field<Int32>("ModulePriority")),
            //       ModuleID = Convert.ToInt32(dataRow.Field<Int32>("ModuleID")),
            //       ModuleIcon = string.IsNullOrWhiteSpace(dataRow.Field<string>("ModuleIcon")) ? string.Empty : dataRow.Field<string>("ModuleIcon").Trim(),
            //       ModuleName = string.IsNullOrWhiteSpace(dataRow.Field<string>("ModuleName")) ? string.Empty : dataRow.Field<string>("ModuleName").Trim()
            //   }).ToList();
            //    objAdminModuleMenu.AdminMenuList = actAdminMenu;
            //    objAdminModuleMenu.AdminModuleList = actAdminModule;
            //    return objAdminModuleMenu;
            //}
            //catch (SqlException ex)
            //{
            //    logger.Debug("This is roleId: {@roleId}", roleId);
            //    CommonMethods.Error(ex);
            //    throw ex;
            //}
            //catch (Exception ex)
            //{
            //    CommonMethods.Error(ex);
            //    throw ex;
            //}
        }
        public static AdminModuleMenu GetAdminModuleMenuWhileLogin(string roleId ,string conString, string encData)
        {            
            DataSet ds = new DataSet();
            AdminModuleMenu objAdminModuleMenu = new AdminModuleMenu();
            try
            {
                string commandText = "sp_ERP_GetMenuByRoles";
                SqlParameter[] param = new SqlParameter[1];

                param[0] = new SqlParameter("@RoleId", roleId);
                ds = clsDataBaseHelper.ExecuteDataSetWithCon(commandText, param, conString);
                var actAdminMenu = ds.Tables[0].AsEnumerable()

                   .Select(dataRow => new AdminMenu
                   {
                       ActualFileName = string.IsNullOrWhiteSpace(dataRow.Field<string>("FileUrl")) ? string.Empty : dataRow.Field<string>("FileUrl").Trim(),
                       MenuPriority = Convert.ToInt16(dataRow.Field<Int16>("MenuPriority")),
                       ParentMenuID = Convert.ToInt32(dataRow.Field<Int32>("ParentMenuID")),
                       MenuID = Convert.ToInt32(dataRow.Field<Int32>("MenuID")),
                       ModuleID = Convert.ToInt32(dataRow.Field<Int32>("ModuleID")),
                       MenuName = string.IsNullOrWhiteSpace(dataRow.Field<string>("MenuName")) ? string.Empty : dataRow.Field<string>("MenuName").Trim(),
                       MenuURL = string.IsNullOrWhiteSpace(dataRow.Field<string>("MenuURL"))
                                    ? string.Empty
                                    : AppendAuthToken(dataRow.Field<string>("MenuURL").Trim(), encData)
                   }).ToList();

                var actAdminModule = ds.Tables[1].AsEnumerable()
               .Select(dataRow => new AdminModule
               {
                   ActualFileName = string.IsNullOrWhiteSpace(dataRow.Field<string>("FileUrl")) ? string.Empty : dataRow.Field<string>("FileUrl").Trim(),
                   ModulePriority = Convert.ToInt32(dataRow.Field<Int32>("ModulePriority")),
                   ModuleID = Convert.ToInt32(dataRow.Field<Int32>("ModuleID")),
                   ModuleIcon = string.IsNullOrWhiteSpace(dataRow.Field<string>("ModuleIcon")) ? string.Empty : dataRow.Field<string>("ModuleIcon").Trim(),
                   ModuleName = string.IsNullOrWhiteSpace(dataRow.Field<string>("ModuleName")) ? string.Empty : dataRow.Field<string>("ModuleName").Trim()
               }).ToList();
                objAdminModuleMenu.AdminMenuList = actAdminMenu;
                objAdminModuleMenu.AdminModuleList = actAdminModule;
                return objAdminModuleMenu;
            }
            catch (SqlException ex)
            {
                logger.Debug("This is roleId: {@roleId}", roleId);
                CommonMethods.Error(ex);
                throw ex;
            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                throw ex;
            }
        }
        public static AdminModuleMenu GetMenuForPermission(string path, string roleId, string type)
        {
            //string nroleId = "";
            string conString =  clsApplicationSetting.DecryptQueryString(path)[3];
             
            DataSet ds = new DataSet();
            AdminModuleMenu objAdminModuleMenu = new AdminModuleMenu();
            try
            {
                string commandText = "spu_ERP_GetRoleMenus";
                SqlParameter[] param = new SqlParameter[2];

                param[0] = new SqlParameter("@RoleId", roleId);
                param[1] = new SqlParameter("@Type", type);

                ds = clsDataBaseHelper.ExecuteDataSetWithCon(commandText, param, conString);

                var actAdminMenu = ds.Tables[0].AsEnumerable()

                   .Select(dataRow => new AdminMenu
                   {      
                       R= Convert.ToBoolean(dataRow.Field<bool>("R")),
                       W = Convert.ToBoolean(dataRow.Field<bool>("W")),
                       M = Convert.ToBoolean(dataRow.Field<bool>("M")),
                       D = Convert.ToBoolean(dataRow.Field<bool>("D")),
                       E = Convert.ToBoolean(dataRow.Field<bool>("E")),
                       V = Convert.ToBoolean(dataRow.Field<bool>("V")),
                       DocNumber = Convert.ToInt32(dataRow.Field<Int32>("DocNumber")),
                       MenuID = Convert.ToInt32(dataRow.Field<Int32>("MenuID")),
                       ModuleID = Convert.ToInt32(dataRow.Field<Int32>("ModuleID")),
                       MenuName = string.IsNullOrWhiteSpace(dataRow.Field<string>("MenuName")) ? string.Empty : dataRow.Field<string>("MenuName").Trim(),
                       ModuleName = string.IsNullOrWhiteSpace(dataRow.Field<string>("ModuleName")) ? string.Empty : dataRow.Field<string>("ModuleName").Trim()
                   }).ToList();

                var actAdminModule = ds.Tables[1].AsEnumerable()
               .Select(dataRow => new AdminModule
               {                  
                   ModuleID = Convert.ToInt32(dataRow.Field<Int32>("ModuleID")),                  
                   ModuleName = string.IsNullOrWhiteSpace(dataRow.Field<string>("ModuleName")) ? string.Empty : dataRow.Field<string>("ModuleName").Trim()
               }).ToList();
                objAdminModuleMenu.AdminMenuList = actAdminMenu;
                objAdminModuleMenu.AdminModuleList = actAdminModule;
                return objAdminModuleMenu;
            }
            catch (SqlException ex)
            {
                logger.Debug("This is roleId: {@roleId}", roleId);
                CommonMethods.Error(ex);
                throw ex;
            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                throw ex;
            }
        }
        private static string AppendAuthToken(string url, string token)
        {
            if (string.IsNullOrWhiteSpace(url)) return url;

            var separator = url.Contains("?") ? "&" : "?";
            return $"{url}{separator}auth={HttpUtility.UrlEncode(token)}";
        }

        public static List<AdminModule> GetRoleWiseModuleList(string Type)
        {
            List<AdminModule> CP_LoginModuleList = new List<AdminModule>();
            AdminModule CP_LoginModuleItem;
            string RoleIDs = clsApplicationSetting.GetSessionValue("RoleIDs");
            if (RoleIDs == null)
            {
                return new List<AdminModule>();
            }
            RoleIDs = ("@" + RoleIDs.Replace(",", "@") + "@");
            long LoginID = 0, RoleID = 0;
            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            long.TryParse(clsApplicationSetting.GetSessionValue("RoleID"), out RoleID);
            try
            {
                // Changing with Multiple Roles by Ravi on 4-Sep-2021
                //var jsonModal = GetMenuJSON().Where(x => x.RoleID == RoleID).ToList();
                var jsonModal = GetMenuJSON();
                jsonModal = jsonModal.Where(w => RoleIDs.Contains("@" + w.RoleID + "@")).ToList();

                jsonModal = jsonModal.Where(x => x.R == true && x.ModuleID != 0).ToList();

                var FilterModule = jsonModal.GroupBy(x => x.ModuleID)
                         .Select(x => new
                         {
                             ModuleID = x.Key,
                             Type = x.Select(ex => ex.Type).FirstOrDefault(),
                             ModuleName = x.Select(ex => ex.ModuleName).FirstOrDefault(),
                             ModuleIcon = x.Select(ex => ex.ModuleIcon).LastOrDefault(),
                             ModulePriority = x.Select(ex => ex.ModulePriority).FirstOrDefault(),
                         })
                         .ToList().OrderBy(x => x.ModuleName).OrderBy(x => x.ModulePriority).ToList();

                if (!string.IsNullOrEmpty(Type))
                {
                    FilterModule = jsonModal.GroupBy(x => x.ModuleID)
                         .Select(x => new
                         {
                             ModuleID = x.Key,
                             Type = x.Select(ex => ex.Type).FirstOrDefault(),
                             ModuleName = x.Select(ex => ex.ModuleName).FirstOrDefault(),
                             ModuleIcon = x.Select(ex => ex.ModuleIcon).LastOrDefault(),
                             ModulePriority = x.Select(ex => ex.ModulePriority).FirstOrDefault(),
                         })
                         .ToList().Where(x => x.Type == Type).OrderBy(x => x.ModuleName).OrderBy(x => x.ModulePriority).ToList();
                }

                foreach (var item in FilterModule)
                {
                    CP_LoginModuleItem = new AdminModule();
                    CP_LoginModuleItem.ModuleID = item.ModuleID;
                    CP_LoginModuleItem.Type = item.Type;
                    CP_LoginModuleItem.ModuleName = item.ModuleName;
                    CP_LoginModuleItem.ModuleIcon = item.ModuleIcon;
                    CP_LoginModuleItem.MainMenuList = GetLoginMenuList(item.ModuleID);
                    CP_LoginModuleList.Add(CP_LoginModuleItem);
                }
            }
            catch (Exception ex)
            {
                LogError("Error during GetRoleWiseModuleList. The executed query :" + ex, ex.ToString(), "GetRoleWiseModuleList", "clsCommon", "clsCommon", "");
            }
            return CP_LoginModuleList;
        }
        private static List<AdminMenu> GetLoginMenuList(long ModuleID, long ParentMenuID = 0)
        {
            string RoleIDs = clsApplicationSetting.GetSessionValue("RoleIDs");
            RoleIDs = ("@" + RoleIDs.Replace(",", "@") + "@");
            long LoginID = 0, RoleID = 0;
            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            long.TryParse(clsApplicationSetting.GetSessionValue("RoleID"), out RoleID);

            List<AdminMenu> CP_LoginMenuList = new List<AdminMenu>();
            AdminMenu CP_LoginMenuItem;
            try
            {
                // Changing with Multiple Roles by Ravi on 4-Sep-2021
                //var jsonModal = GetMenuJSON().Where(x => x.RoleID == RoleID).ToList();

                var jsonModal = GetMenuJSON();
                jsonModal = jsonModal.Where(w => RoleIDs.Contains("@" + w.RoleID + "@")).ToList();
                jsonModal = jsonModal.Where(x => x.R == true && x.ModuleID == ModuleID).ToList();
                jsonModal = jsonModal.Where(x => x.ParentMenuID == ParentMenuID).ToList();

                var FilterMenuList = jsonModal.GroupBy(x => x.MenuID)
                            .Select(x => new
                            {
                                MenuID = x.Key,
                                ParentMenuID = x.Select(ex => ex.ParentMenuID).FirstOrDefault(),
                                ModuleID = x.Select(ex => ex.ModuleID).FirstOrDefault(),
                                MenuPriority = x.Select(ex => ex.MenuPriority).FirstOrDefault(),
                                MenuName = x.Select(ex => ex.MenuName).FirstOrDefault(),
                                MenuURL = x.Select(ex => ex.MenuURL).FirstOrDefault(),
                                Target = x.Select(ex => ex.Target).FirstOrDefault(),
                                IsChild = x.Select(ex => ex.IsChild).FirstOrDefault(),

                            })
                            .ToList().OrderBy(x => x.MenuName).OrderBy(x => x.MenuPriority).ToList();

                foreach (var item in FilterMenuList)
                {
                    CP_LoginMenuItem = new AdminMenu();
                    CP_LoginMenuItem.MenuID = item.MenuID;
                    CP_LoginMenuItem.ParentMenuID = item.ParentMenuID;
                    CP_LoginMenuItem.ModuleID = item.ModuleID;
                    CP_LoginMenuItem.MenuPriority = item.MenuPriority;
                    CP_LoginMenuItem.MenuName = item.MenuName;
                    CP_LoginMenuItem.MenuURL = item.MenuURL;
                    CP_LoginMenuItem.Target = item.Target;
                    CP_LoginMenuItem.IsChild = item.IsChild;
                    if (item.IsChild == "Y")
                    {
                        CP_LoginMenuItem.ChildMenuList = GetLoginMenuList(item.ModuleID, CP_LoginMenuItem.MenuID);
                    }
                    CP_LoginMenuList.Add(CP_LoginMenuItem);
                }
            }
            catch (Exception ex)
            {
                LogError("Error during GetLoginMenuList. The executed query :" + ex, ex.ToString(), "GetLoginMenuList", "clsCommon", "clsCommon", "");
            }
            return CP_LoginMenuList;
        }


        public static bool CreateConfigJson()
        {
            bool ret = false;
            try
            {
                DataSet Ds = Common_SPU.fnGetConfigSetting(0);
                var jsonString = ConvertDataTableToJson(Ds.Tables[0]);
                if (jsonString != null)
                {
                    if (System.IO.File.Exists(clsApplicationSetting.GetPhysicalPath("json") + "/Config.json"))
                    {
                        System.IO.File.Delete(clsApplicationSetting.GetPhysicalPath("json") + "/Config.json");
                    }
                    System.IO.File.WriteAllText(clsApplicationSetting.GetPhysicalPath("json") + "/Config.json", jsonString);
                }

            }
            catch (Exception ex)
            {
                LogError("Error during CreateConfigJson. The query was executed :", ex.ToString(), "", "ClsCommon", "ClsCommon", "");
            }
            return ret;
        }

        public static List<ConfigSetting> GetConfigJson()
        {
            List<ConfigSetting> List = new List<ConfigSetting>();
            try
            {
                if (!System.IO.File.Exists(clsApplicationSetting.GetPhysicalPath("json") + "/config.json"))
                {
                    CreateConfigJson();
                }
                string file = clsApplicationSetting.GetPhysicalPath("json") + "/config.json";
                string Json = System.IO.File.ReadAllText(file);
                List = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ConfigSetting>>(Json);
                //JavaScriptSerializer ser = new JavaScriptSerializer();
                //List = ser.Deserialize<List<MenuJson>>(Json);
            }
            catch (Exception ex)
            {
                LogError("Error during GetConfigJson. The query was executed :", ex.ToString(), "", "ClsCommon", "ClsCommon", "");
            }
            return List;
        }




        public static List<DropDownList> GetDropDownList(GetResponse modal)
        {
            List<DropDownList> result = new List<DropDownList>();
            try
            {
                using (IDbConnection DBContext = new SqlConnection(connectionstring()))
                {
                    var param = new DynamicParameters();
                    param.Add("@Doctype", dbType: DbType.String, value: EnsureString(modal.Doctype), direction: ParameterDirection.Input);
                    param.Add("@ID", dbType: DbType.Int32, value: modal.ID, direction: ParameterDirection.Input);
                    param.Add("@LoginId", dbType: DbType.Int32, value: modal.LoginID, direction: ParameterDirection.Input);
                    DBContext.Open();
                    using (var reader = DBContext.QueryMultiple("spu_GetDropDownList", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<DropDownList>().ToList();
                    }
                    DBContext.Close();
                }
            }
            catch (Exception ex)
            {
                LogError("Error during GetDropDownList. The query was executed :", ex.ToString(), "spu_GetDropDownList()", "Common_SPU", "Common_SPU");

            }
            return result;
        }
        public static bool UpdateFR_ReferralStatus(string Status, long ID)
        {
            bool ret = false;
            long LoginID = 0;
            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            string SQL = "";
            try
            {
                SQL = "update FR_LeadReferrals set ReferralStatus='" + Status + "',referralStatusDate=CURRENT_TIMESTAMP where id=" + ID.ToString() + "";
                if (clsDataBaseHelper.ExecuteNonQuery(SQL) > 0)
                {
                    ret = true;
                }

            }
            catch (Exception ex)
            {
                LogError("Error during UpdateFR_ReferralStatus. The query was executed :", ex.ToString(), SQL, "clsCommon", "common class", "");
            }
            return ret;
        }
        public static bool FundRaisingDelete(long MainId, string NotDeletedids, string TableName, string MainColumn)
        {
            bool ret = false;
            long LoginID = 0;
            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            string SQL = "";
            try
            {
                SQL = "update " + TableName + " set isdeleted=1,deletedat=CURRENT_TIMESTAMP,deletedby=" + LoginID.ToString() + " where isdeleted=0 and  " + MainColumn + "=" + MainId.ToString() + " and id not in (" + NotDeletedids + ")";
                if (clsDataBaseHelper.ExecuteNonQuery(SQL) > 0)
                {
                    ret = true;
                }

            }
            catch (Exception ex)
            {
                LogError("Error during FundRaisingDelete. The query was executed :", ex.ToString(), SQL, "clsCommon", "common class", "");
            }
            return ret;
        }
        public static DataTable FnConvertExceltoDatatable(string path, string extension)
        {
            DataTable dt = new DataTable();
            string filePath = string.Empty;
            filePath = path;
            string conString = string.Empty;
            try
            {
                switch (extension)
                {
                    case ".xls": //Excel 97-03.
                        conString = ConfigurationManager.ConnectionStrings["Excel03ConString"].ConnectionString;
                        break;
                    case ".xlsx": //Excel 07 and above.
                        conString = ConfigurationManager.ConnectionStrings["Excel07ConString"].ConnectionString;
                        break;
                }

                conString = string.Format(conString, filePath);

                using (OleDbConnection connExcel = new OleDbConnection(conString))
                {
                    using (OleDbCommand cmdExcel = new OleDbCommand())
                    {
                        using (OleDbDataAdapter odaExcel = new OleDbDataAdapter())
                        {
                            cmdExcel.Connection = connExcel;

                            //Get the name of First Sheet.
                            connExcel.Open();
                            DataTable dtExcelSchema;
                            dtExcelSchema = connExcel.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                            string sheetName = dtExcelSchema.Rows[0]["TABLE_NAME"].ToString();
                            connExcel.Close();

                            //Read Data from First Sheet.
                            connExcel.Open();
                            cmdExcel.CommandText = "SELECT * From [" + sheetName + "]";
                            odaExcel.SelectCommand = cmdExcel;
                            odaExcel.Fill(dt);
                            connExcel.Close();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return dt;
        }
        public static string RandomString()
        {
            Random rnd = new Random();
            string s = rnd.Next(10000, 99999).ToString();
            return s;

        }
        //public static string GetFixHolidaysByEmpid(string Empid)
        //{
        //    string FixHolidays = "";
        //    try
        //    {
        //        FixHolidays = clsDataBaseHelper.fnGetOther_FieldName("SS_EmployeeSalary inner join master_all on SS_EmployeeSalary.Subcategoryid=master_all.id", "case when master_all.field_name1='6 Days' then 'Sunday' else 'Sunday,Saturday' end", "SS_EmployeeSalary.Empid", Empid, "and SS_EmployeeSalary.isdeleted=0");
        //        if (FixHolidays == "")
        //        {
        //            FixHolidays = clsApplicationSetting.GetConfigValue("FixHolidays");
        //        }
        //    }
        //    catch 
        //    {
        //        FixHolidays = clsApplicationSetting.GetConfigValue("FixHolidays");
        //    }            

        //    return FixHolidays;
        //}
        //Change Nand 30 May 2023
        public static string GetFixHolidaysByEmpid(string Empid)
        {
            string FixHolidays = "";
            try
            {
                FixHolidays = clsDataBaseHelper.fnGetOther_FieldName("SS_EmployeeSalary inner join master_all on SS_EmployeeSalary.Subcategoryid=master_all.id", " top 1 case when master_all.field_name1='6 Days' then 'Sunday' else 'Sunday,Saturday' end", "SS_EmployeeSalary.Empid", Empid, "and SS_EmployeeSalary.isdeleted=0 Order by SS_EmployeeSalary.Id desc ");
                if (FixHolidays == "")
                {
                    FixHolidays = clsApplicationSetting.GetConfigValue("FixHolidays");
                }
            }
            catch
            {
                FixHolidays = clsApplicationSetting.GetConfigValue("FixHolidays");
            }

            return FixHolidays;
        }

        public static long FnCheckPMS_CommentatorRatingPending(string Empid, string FYid)
        {
            int PendingCount = 0;
            string SQL = "";
            try
            {
                SQL = @"select count(name) as EmpCount from splitstring((select Commentors from PMS_Essential where EMPID=" + Empid + "  and Doctype='Hierarchy' and FYID=" + FYid + " and isdeleted=0)) as tbl" +
                    " where  tbl.Name not in (select distinct GivenBy from PMS_QA where PMS_QA.EMPID=" + Empid + " and PMS_QA.FYID=" + FYid + " and PMS_QA.Doctype='Commenter' and FinalRating<>'' and isdeleted=0 )";
                DataSet ds = clsDataBaseHelper.ExecuteDataSet(SQL);
                PendingCount = Convert.ToInt32(ds.Tables[0].Rows[0]["EmpCount"].ToString());
            }
            catch
            {
                PendingCount = 0;
            }

            return PendingCount;
        }
        public static List<DropDownList> GetBudgetDropDownList(GetResponse modal)
        {
            List<DropDownList> result = new List<DropDownList>();
            try
            {
                using (IDbConnection DBContext = new SqlConnection(connectionstring()))
                {
                    var param = new DynamicParameters();
                    param.Add("@Doctype", dbType: DbType.String, value: EnsureString(modal.Doctype), direction: ParameterDirection.Input);
                    param.Add("@ID", dbType: DbType.Int32, value: modal.ID, direction: ParameterDirection.Input);
                    param.Add("@Finyearid", dbType: DbType.Int32, value: modal.AdditionalID, direction: ParameterDirection.Input);
                    param.Add("@LoginId", dbType: DbType.Int32, value: modal.LoginID, direction: ParameterDirection.Input);
                    DBContext.Open();
                    using (var reader = DBContext.QueryMultiple("spu_GetBudgetDropDownList", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<DropDownList>().ToList();
                    }
                    DBContext.Close();
                }
            }
            catch (Exception ex)
            {
                LogError("Error during GetDropDownList. The query was executed :", ex.ToString(), "spu_GetDropDownList()", "Common_SPU", "Common_SPU");

            }
            return result;
        }
        //private string GetDateError_Daily(DailyLogCompleteModal Modal, DateTime SelectedDate)
        //{
        //    string ValidateDates = "";
        //    double Day1 = Modal.DailyLogList.Sum(x => x.Day1);
        //    double Day2 = Modal.DailyLogList.Sum(x => x.Day2);
        //    double Day3 = Modal.DailyLogList.Sum(x => x.Day3);
        //    double Day4 = Modal.DailyLogList.Sum(x => x.Day4);
        //    double Day5 = Modal.DailyLogList.Sum(x => x.Day5);
        //    double Day6 = Modal.DailyLogList.Sum(x => x.Day6);
        //    double Day7 = Modal.DailyLogList.Sum(x => x.Day7);
        //    double Day8 = Modal.DailyLogList.Sum(x => x.Day8);
        //    double Day9 = Modal.DailyLogList.Sum(x => x.Day9);
        //    double Day10 = Modal.DailyLogList.Sum(x => x.Day10);
        //    double Day11 = Modal.DailyLogList.Sum(x => x.Day11);
        //    double Day12 = Modal.DailyLogList.Sum(x => x.Day12);
        //    double Day13 = Modal.DailyLogList.Sum(x => x.Day13);
        //    double Day14 = Modal.DailyLogList.Sum(x => x.Day14);
        //    double Day15 = Modal.DailyLogList.Sum(x => x.Day15);
        //    double Day16 = Modal.DailyLogList.Sum(x => x.Day16);
        //    double Day17 = Modal.DailyLogList.Sum(x => x.Day17);
        //    double Day18 = Modal.DailyLogList.Sum(x => x.Day18);
        //    double Day19 = Modal.DailyLogList.Sum(x => x.Day19);
        //    double Day20 = Modal.DailyLogList.Sum(x => x.Day20);
        //    double Day21 = Modal.DailyLogList.Sum(x => x.Day21);
        //    double Day22 = Modal.DailyLogList.Sum(x => x.Day22);
        //    double Day23 = Modal.DailyLogList.Sum(x => x.Day23);
        //    double Day24 = Modal.DailyLogList.Sum(x => x.Day24);
        //    double Day25 = Modal.DailyLogList.Sum(x => x.Day25);
        //    double Day26 = Modal.DailyLogList.Sum(x => x.Day26);
        //    double Day27 = Modal.DailyLogList.Sum(x => x.Day27);
        //    double Day28 = Modal.DailyLogList.Sum(x => x.Day28);
        //    double Day29 = Modal.DailyLogList.Sum(x => x.Day29);
        //    double Day30 = Modal.DailyLogList.Sum(x => x.Day30);
        //    double Day31 = Modal.DailyLogList.Sum(x => x.Day31);

        //    DateTime StartDate = new DateTime(SelectedDate.Year, SelectedDate.Month, 1);
        //    DateTime EndDate = StartDate.AddMonths(1).AddDays(-1);
        //    string FixHolidays = clsApplicationSetting.GetConfigValue("FixHolidays");
        //    List<HolidayDailyLog> LeaveList = new List<HolidayDailyLog>();
        //    LeaveList = Activity.GetHolidayDailyLog(SelectedDate);
        //    double WorkingHours = Convert.ToDouble(Modal.WorkingHours);
        //    //if (LeaveList.Where(x => x.Date == date.ToString("dd/MM/yyyy") && !FixHolidays.Contains(date.ToString("dddd")))

        //    for (DateTime date = StartDate; date <= EndDate; date = date.AddDays(1))
        //    {
        //        bool isvalid = true;
        //        if (LeaveList.Any(x => x.Date == date.ToString("dd/MM/yyyy")) || FixHolidays.Contains(date.ToString("dddd")))
        //        {
        //            isvalid = false;
        //        }
        //        if (isvalid)
        //        {
        //            int DateError = 0;
        //            int.TryParse(date.ToString("dd"), out DateError);
        //            switch (DateError)
        //            {
        //                case 1:

        //                    if (Day1 < WorkingHours || WorkingHours == 0 || Day1 > 24)
        //                    {
        //                        ValidateDates += "1 ,";
        //                    }
        //                    break;
        //                case 2:
        //                    if (Day2 < WorkingHours || WorkingHours == 0 || Day2 > 24)
        //                    {
        //                        ValidateDates += "2 ,";
        //                    }
        //                    break;
        //                case 3:
        //                    if (Day3 < WorkingHours || WorkingHours == 0 || Day3 > 24)
        //                    {
        //                        ValidateDates += "3 ,";
        //                    }
        //                    break;
        //                case 4:
        //                    if (Day4 < WorkingHours || WorkingHours == 0 || Day4 > 24)
        //                    {
        //                        ValidateDates += "4 ,";
        //                    }
        //                    break;
        //                case 5:
        //                    if (Day5 < WorkingHours || WorkingHours == 0 || Day5 > 24)
        //                    {
        //                        ValidateDates += "5 ,";
        //                    }
        //                    break;
        //                case 6:
        //                    if (Day6 < WorkingHours || WorkingHours == 0 || Day6 > 24)
        //                    {
        //                        ValidateDates += "6 ,";
        //                    }
        //                    break;
        //                case 7:
        //                    if (Day7 < WorkingHours || WorkingHours == 0 || Day7 > 24)
        //                    {
        //                        ValidateDates += "7 ,";
        //                    }
        //                    break;
        //                case 8:
        //                    if (Day8 < WorkingHours || WorkingHours == 0 || Day8 > 24)
        //                    {
        //                        ValidateDates += "8 ,";
        //                    }
        //                    break;
        //                case 9:
        //                    if (Day9 < WorkingHours || WorkingHours == 0 || Day9 > 24)
        //                    {
        //                        ValidateDates += "9 ,";
        //                    }
        //                    break;
        //                case 10:
        //                    if (Day10 < WorkingHours || WorkingHours == 0 || Day10 > 24)
        //                    {
        //                        ValidateDates += "10 ,";
        //                    }
        //                    break;
        //                case 11:
        //                    if (Day11 < WorkingHours || WorkingHours == 0 || Day11 > 24)
        //                    {
        //                        ValidateDates += "11 ,";
        //                    }
        //                    break;
        //                case 12:
        //                    if (Day12 < WorkingHours || WorkingHours == 0 || Day12 > 24)
        //                    {
        //                        ValidateDates += "12 ,";
        //                    }
        //                    break;
        //                case 13:
        //                    if (Day13 < WorkingHours || WorkingHours == 0 || Day13 > 24)
        //                    {
        //                        ValidateDates += "13 ,";
        //                    }
        //                    break;
        //                case 14:
        //                    if (Day14 < WorkingHours || WorkingHours == 0 || Day14 > 24)
        //                    {
        //                        ValidateDates += "14 ,";
        //                    }
        //                    break;
        //                case 15:
        //                    if (Day15 < WorkingHours || WorkingHours == 0 || Day15 > 24)
        //                    {
        //                        ValidateDates += "15 ,";
        //                    }
        //                    break;
        //                case 16:
        //                    if (Day16 < WorkingHours || WorkingHours == 0 || Day16 > 24)
        //                    {
        //                        ValidateDates += "16 ,";
        //                    }
        //                    break;
        //                case 17:
        //                    if (Day17 < WorkingHours || WorkingHours == 0 || Day17 > 24)
        //                    {
        //                        ValidateDates += "17 ,";
        //                    }
        //                    break;
        //                case 18:
        //                    if (Day18 < WorkingHours || WorkingHours == 0 || Day18 > 24)
        //                    {
        //                        ValidateDates += "18 ,";
        //                    }
        //                    break;
        //                case 19:
        //                    if (Day19 < WorkingHours || WorkingHours == 0 || Day19 > 24)
        //                    {
        //                        ValidateDates += "19 ,";
        //                    }
        //                    break;
        //                case 20:
        //                    if (Day20 < WorkingHours || WorkingHours == 0 || Day20 > 24)
        //                    {
        //                        ValidateDates += "20 ,";
        //                    }
        //                    break;
        //                case 21:
        //                    if (Day21 < WorkingHours || WorkingHours == 0 || Day21 > 24)
        //                    {
        //                        ValidateDates += "21 ,";
        //                    }
        //                    break;
        //                case 22:
        //                    if (Day22 < WorkingHours || WorkingHours == 0 || Day22 > 24)
        //                    {
        //                        ValidateDates += "22 ,";
        //                    }
        //                    break;
        //                case 23:
        //                    if (Day23 < WorkingHours || WorkingHours == 0 || Day23 > 24)
        //                    {
        //                        ValidateDates += "23 ,";
        //                    }
        //                    break;
        //                case 24:
        //                    if (Day24 < WorkingHours || WorkingHours == 0 || Day24 > 24)
        //                    {
        //                        ValidateDates += "24 ,";
        //                    }
        //                    break;
        //                case 25:
        //                    if (Day25 < WorkingHours || WorkingHours == 0 || Day25 > 24)
        //                    {
        //                        ValidateDates += "25 ,";
        //                    }
        //                    break;
        //                case 26:
        //                    if (Day26 < WorkingHours || WorkingHours == 0 || Day26 > 24)
        //                    {
        //                        ValidateDates += "26 ,";
        //                    }
        //                    break;
        //                case 27:
        //                    if (Day27 < WorkingHours || WorkingHours == 0 || Day27 > 24)
        //                    {
        //                        ValidateDates += "27 ,";
        //                    }
        //                    break;
        //                case 28:
        //                    if (Day28 < WorkingHours || WorkingHours == 0 || Day28 > 24)
        //                    {
        //                        ValidateDates += "28 ,";
        //                    }
        //                    break;
        //                case 29:
        //                    if (Day29 < WorkingHours || WorkingHours == 0 || Day29 > 24)
        //                    {
        //                        ValidateDates += "29 ,";
        //                    }
        //                    break;
        //                case 30:
        //                    if (Day30 < WorkingHours || WorkingHours == 0 || Day30 > 24)
        //                    {
        //                        ValidateDates += "30 ,";
        //                    }
        //                    break;
        //                case 31:
        //                    if (Day31 < WorkingHours || WorkingHours == 0 || Day31 > 24)
        //                    {
        //                        ValidateDates += "31 ,";
        //                    }
        //                    break;
        //                default:
        //                    break;
        //            }
        //        }
        //    }
        //    return ValidateDates.Trim().TrimEnd(',');
        //}
    }
}