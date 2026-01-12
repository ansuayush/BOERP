using Dapper;
using SahajFramework.CommonClass;
using SahajFramework.Models;
using SahajFramework.ModelsMasterHelper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SahajFramework.ModelsMaster
{
    public class ToolsModal : IToolsHelper
    {
       // string ConnectionStrings = ConfigurationManager.ConnectionStrings["connectionstring"].ConnectionString.ToString();


        public string DateFormat = "dd-MMM-yyyy", DateFormatC = "dd-MMM-yy hh:mm:ss tt", DateFormatE = "yyyy-MM-dd";
        public ToolsModal()
        {
            var d = clsApplicationSetting.GetConfigValue("DateFormat");
            var dC = clsApplicationSetting.GetConfigValue("DateFormatC");
            DateFormat = (!string.IsNullOrEmpty(d) ? d : DateFormat);
            DateFormatC = (!string.IsNullOrEmpty(dC) ? dC : DateFormatC);
        }

        public List<AdminMenu> GetAdminMenuList(GetResponse modal)
        {
            List<AdminMenu> result = new List<AdminMenu>();
            try
            {
                string ConnectionStrings = clsApplicationSetting.GetSessionValue("ConnectionStringData");

                if (string.IsNullOrWhiteSpace(ConnectionStrings))
                {
                    ConnectionStrings = clsApplicationSetting.GetApplicationValue("ConnectionStringData");
                    if (string.IsNullOrWhiteSpace(ConnectionStrings))
                    {
                        ConnectionStrings = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
                    }
                }
                

                using (IDbConnection DBContext = new SqlConnection(ConnectionStrings))
                {
                    var param = new DynamicParameters();
                    DBContext.Open();
                    using (var reader = DBContext.QueryMultiple("spu_GetMenu_Admin", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<AdminMenu>().ToList();
                    }
                    DBContext.Close();
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetAdminMenuList. The query was executed :", ex.ToString(), "GetAdminMenuList", "ToolsModal", "ToolsModal", "");

            }
            return result;
        }

        public List<AdminModule> GetModuleListWithMenu(GetResponse modal)
        {
            List<AdminModule> result = new List<AdminModule>();
            try
            {
                string ConnectionStrings = clsApplicationSetting.GetSessionValue("ConnectionStringData");

                if (string.IsNullOrWhiteSpace(ConnectionStrings))
                {
                    ConnectionStrings = clsApplicationSetting.GetApplicationValue("ConnectionStringData");
                    if (string.IsNullOrWhiteSpace(ConnectionStrings))
                    {
                        ConnectionStrings = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
                    }
                }
                using (IDbConnection DBContext = new SqlConnection(ConnectionStrings))
                {
                    var param = new DynamicParameters();
                    DBContext.Open();
                    param.Add("@Roleid", dbType: DbType.Int32, value: modal.ID, direction: ParameterDirection.Input);
                    using (var reader = DBContext.QueryMultiple("spu_GetModuleListRoleWise", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<AdminModule>().ToList();
                    }
                    DBContext.Close();
                }
                if (result != null)
                {
                    foreach (AdminModule item in result)
                    {
                        item.MainMenuList = GetLoginMenuListWithDetails(item.ModuleID, modal.ID, modal.LoginID, modal.IPAddress);
                    }
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetModuleListWithMenu. The query was executed :", ex.ToString(), "GetAdminMenuList", "ToolsModal", "ToolsModal", "");
            }
            return result;
        }

        private List<AdminMenu> GetLoginMenuListWithDetails(long ModuleID, long RoleID, long LoginID, string IPAddress, long ParentMenuID = 0)
        {
            List<AdminMenu> List = new List<AdminMenu>();
            try
            {
                GetResponse getResponse = new GetResponse();
                getResponse.LoginID = LoginID;
                getResponse.IPAddress = IPAddress;
                List = GetAdminMenuList(getResponse).Where(x => x.ModuleID == ModuleID && x.RoleID == RoleID && x.ParentMenuID == ParentMenuID).ToList();

                if (List != null && List.Count > 0)
                {
                    foreach (var item in List.Where(x => x.IsChild == "Y").ToList())
                    {
                        item.ChildMenuList = GetLoginMenuListWithDetails(ModuleID, RoleID, LoginID, IPAddress, item.MenuID);
                    }

                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetLoginMenuListWithDetails. The query was executed :", ex.ToString(), "GetLoginMenuListWithDetails", "ToolsModal", "ToolsModal", "");
            }
            return List;
        }



        public List<ErrorLog> ErrorLogList()
        {
            //string SQL = "";
            ErrorLog ItemObj = new ErrorLog();
            List<ErrorLog> List = new List<ErrorLog>();
            try
            {
                DataSet FieldFFds = Common_SPU.fnGetErrorLog();
                if (FieldFFds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow FieldFFdsitem in FieldFFds.Tables[0].Rows)
                    {
                        ItemObj = new ErrorLog();
                        ItemObj.ID = Convert.ToInt32(FieldFFdsitem["ID"].ToString());
                        ItemObj.RowNum = Convert.ToInt64(FieldFFdsitem["RowNum"].ToString());
                        ItemObj.ErrorDescription = FieldFFdsitem["ErrDescription"].ToString();
                        ItemObj.SystemException = FieldFFdsitem["SystemException"].ToString();
                        ItemObj.ActiveForm = FieldFFdsitem["ActiveForm"].ToString();
                        ItemObj.ActiveFunction = FieldFFdsitem["ActiveFunction"].ToString();
                        ItemObj.ActiveModule = FieldFFdsitem["ActiveModule"].ToString();
                        ItemObj.CreatedByID = Convert.ToInt32(FieldFFdsitem["createdby"]);
                        ItemObj.LoggedAt = Convert.ToDateTime(FieldFFdsitem["LoggedAt"]).ToString(DateFormatC);
                        ItemObj.IPAddress = FieldFFdsitem["IPAddress"].ToString();
                        List.Add(ItemObj);
                    }
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during ErrorLogList. The query was executed :", ex.ToString(), "fnGetErrorLog", "ToolsModal", "ToolsModal", "");
            }
            return List;

        }

        public List<EmailTemplate> GetEmailTemplateList(long ID)
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
                    EItem.CreatedDate = Convert.ToDateTime(item["createdat"]).ToString(DateFormatC);
                    EItem.ModifiedDate = Convert.ToDateTime(item["modifiedat"]).ToString(DateFormatC);
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

        public int CheckEmailTemplateNameExist(string ID, string TemplateName)
        {
            string SQL = "";
            int Result = 0;
            try
            {
                if (Convert.ToInt32(ID) == 0)
                {
                    SQL = "select ID from EmailTemplate where TemplateName='" + ClsCommon.EnsureString(TemplateName) + "' and isdeleted=0";
                    Result = clsDataBaseHelper.CheckRecord(SQL);
                }
                else
                {
                    SQL = "select ID from EmailTemplate where ID!=" + ID + " and  TemplateName='" + ClsCommon.EnsureString(TemplateName) + "' and isdeleted=0";
                    Result = clsDataBaseHelper.CheckRecord(SQL);
                }

            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during CheckEmailTemplateNameExist. The query was executed :", ex.ToString(), SQL, "ToolsModal", "ToolsModal", "");
            }
            return Result;
        }

        public List<UserRole> GetRoleList(long RoleID)
        {
            List<UserRole> List = new List<UserRole>();
            UserRole obj = new UserRole();
            try
            {
                DataSet TempModuleDataSet = Common_SPU.fnGetRoles(RoleID);
                foreach (DataRow item in TempModuleDataSet.Tables[0].Rows)
                {
                    obj = new UserRole();
                    obj.RoleID = Convert.ToInt32(item["ID"]);
                    obj.RoleName = item["role_name"].ToString();
                    obj.Description = item["description"].ToString();
                    obj.IsActive = Convert.ToBoolean(item["IsActive"].ToString());
                    obj.createdby = Convert.ToInt32(item["createdby"]);
                    obj.modifiedby = Convert.ToInt32(item["modifiedby"]);
                    obj.createdat = Convert.ToDateTime(item["createdat"]).ToString(DateFormatC);
                    obj.modifiedat = Convert.ToDateTime(item["modifiedat"]).ToString(DateFormatC);
                    obj.IPAddress = item["IPAddress"].ToString();
                    List.Add(obj);
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetRoleList. The query was executed :", ex.ToString(), "spu_GetRoles", "MiscModal", "MiscModal", "");
            }
            return List;

        }


        public List<UserMan.List> GetLoginUserList(GetResponse modal)
        {
            List<UserMan.List> result = new List<UserMan.List>();
            try
            {
                using (IDbConnection DBContext = new SqlConnection(ClsCommon.connectionstring()))
                {
                    var param = new DynamicParameters();
                    param.Add("@ID", dbType: DbType.Int32, value: modal.ID, direction: ParameterDirection.Input);
                    param.Add("@LoginID", dbType: DbType.Int32, value: modal.LoginID, direction: ParameterDirection.Input);
                    DBContext.Open();
                    using (var reader = DBContext.QueryMultiple("spu_GetUserList", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<UserMan.List>().ToList();
                    }
                    DBContext.Close();
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetLoginUserList. The query was executed :", ex.ToString(), "spu_GetUserList()", "ToolsModal", "ToolsModal", "");

            }
            return result;
        }

        public UserMan.Add GetLoginUser(GetResponse modal)
        {
            UserMan.Add result = new UserMan.Add();
            try
            {
                using (IDbConnection DBContext = new SqlConnection(ClsCommon.connectionstring()))
                {
                    var param = new DynamicParameters();
                    param.Add("@ID", dbType: DbType.Int32, value: modal.ID, direction: ParameterDirection.Input);
                    param.Add("@LoginID", dbType: DbType.Int32, value: modal.LoginID, direction: ParameterDirection.Input);
                    DBContext.Open();
                    using (var reader = DBContext.QueryMultiple("spu_GetUser", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<UserMan.Add>().FirstOrDefault();
                        if(result==null)
                        {
                            result = new UserMan.Add();
                        }
                        if(!string.IsNullOrEmpty(result.password))
                        {
                            result.password = clsApplicationSetting.Decrypt(result.password);
                        }
                        if(!reader.IsConsumed)
                        {
                            result.RoleList= reader.Read<DropDownList>().ToList();
                        }
                        if (!reader.IsConsumed)
                        {
                            result.UserTypeList = reader.Read<DropDownList>().ToList();
                        }
                        result.CandidiateList = new List<DropDownList>();
                    }
                    DBContext.Close();
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetLoginUser. The query was executed :", ex.ToString(), "spu_GetUser()", "ToolsModal", "ToolsModal", "");

            }
            return result;
        }

        


        public List<ConfigSetting> GetConfigSettingList(long ID)
        {
            List<ConfigSetting> List = new List<ConfigSetting>();
            ConfigSetting eItem = new ConfigSetting();
            //string SQL = "";

            try
            {

                DataSet TempModuleDataSet = Common_SPU.fnGetConfigSetting(ID);
                foreach (DataRow item in TempModuleDataSet.Tables[0].Rows)
                {
                    eItem = new ConfigSetting();
                    eItem.ConfigID = Convert.ToInt32(item["ConfigID"]);
                    eItem.Category = item["Category"].ToString();
                    eItem.SubCategory = item["SubCategory"].ToString();
                    eItem.Help = item["Help"].ToString();
                    eItem.Remarks = item["Remarks"].ToString();
                    eItem.ConfigKey = item["ConfigKey"].ToString();
                    eItem.ConfigValue = item["ConfigValue"].ToString();
                    eItem.IsActive = Convert.ToBoolean(item["IsActive"].ToString());
                    eItem.CreatedByID = Convert.ToInt32(item["createdby"]);
                    eItem.ModifiedByID = Convert.ToInt32(item["modifiedby"]);
                    eItem.Priority = Convert.ToInt32(item["Priority"]);
                    eItem.CreatedDate = Convert.ToDateTime(item["createdat"]).ToString(DateFormatC);
                    eItem.ModifiedDate = Convert.ToDateTime(item["modifiedat"]).ToString(DateFormatC);
                    eItem.IPAddress = item["IPAddress"].ToString();
                    List.Add(eItem);
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetConfigSettingList. The query was executed :", ex.ToString(), "CP/GetConfigSettingList()", "ClsCommon", "ClsCommon", "");
            }
            return List;
        }
        public List<User_Task.Task.List> GetUser_TaskList(long TaskID, long TableID = 0, string TableName = "")
        {
            string LoginID = clsApplicationSetting.GetSessionValue("LoginID");
            List<User_Task.Task.List> result = new List<User_Task.Task.List>();
            try
            {
                string ConnectionStrings = clsApplicationSetting.GetSessionValue("ConnectionStringData");

                if (string.IsNullOrWhiteSpace(ConnectionStrings))
                {
                    ConnectionStrings = clsApplicationSetting.GetApplicationValue("ConnectionStringData");
                    if (string.IsNullOrWhiteSpace(ConnectionStrings))
                    {
                        ConnectionStrings = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
                    }
                }
                using (IDbConnection DBContext = new SqlConnection(ConnectionStrings))
                {
                    var param = new DynamicParameters();
                    param.Add("@LoginID", dbType: DbType.Int64, value: LoginID, direction: ParameterDirection.Input);
                    param.Add("@TaskID", dbType: DbType.Int64, value: TaskID, direction: ParameterDirection.Input);
                    param.Add("@TableID", dbType: DbType.Int64, value: TableID, direction: ParameterDirection.Input);
                    param.Add("@TableName", dbType: DbType.String, value: TableName, direction: ParameterDirection.Input);
                    DBContext.Open();
                    using (var reader = DBContext.QueryMultiple("spu_GetUser_Task_List", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<User_Task.Task.List>().ToList();
                    }
                    DBContext.Close();
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetUser_TaskList. The query was executed :", ex.ToString(), "spu_GetFinancialYear", "ConfirmationModal", "ConfirmationModal", "");

            }
            return result;
        }

        public List<User_Task.Notes.List> GetUser_NotesList(long TaskID)
        {
            string LoginID = clsApplicationSetting.GetSessionValue("LoginID");
            List<User_Task.Notes.List> result = new List<User_Task.Notes.List>();
            try
            {
                string ConnectionStrings = clsApplicationSetting.GetSessionValue("ConnectionStringData");

                if (string.IsNullOrWhiteSpace(ConnectionStrings))
                {
                    ConnectionStrings = clsApplicationSetting.GetApplicationValue("ConnectionStringData");
                    if (string.IsNullOrWhiteSpace(ConnectionStrings))
                    {
                        ConnectionStrings = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
                    }
                }
                using (IDbConnection DBContext = new SqlConnection(ConnectionStrings))
                {
                    var param = new DynamicParameters();
                    param.Add("@TaskID", dbType: DbType.Int64, value: TaskID, direction: ParameterDirection.Input);
                    param.Add("@LoginID", dbType: DbType.Int64, value: LoginID, direction: ParameterDirection.Input);
                    DBContext.Open();
                    using (var reader = DBContext.QueryMultiple("spu_GetUser_Task_Tran_List", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<User_Task.Notes.List>().ToList();
                    }
                    DBContext.Close();
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetUser_NotesList. The query was executed :", ex.ToString(), "spu_GetUser_Task_Tran_List", "ConfirmationModal", "ConfirmationModal", "");

            }
            return result;
        }



        public List<User_Task.StatusList> GetUser_Task_StatusList(long TaskID, long StatusID, string Type, string IsActive)
        {
            string LoginID = clsApplicationSetting.GetSessionValue("LoginID");
            List<User_Task.StatusList> result = new List<User_Task.StatusList>();
            try
            {
                string ConnectionStrings = clsApplicationSetting.GetSessionValue("ConnectionStringData");

                if (string.IsNullOrWhiteSpace(ConnectionStrings))
                {
                    ConnectionStrings = clsApplicationSetting.GetApplicationValue("ConnectionStringData");
                    if (string.IsNullOrWhiteSpace(ConnectionStrings))
                    {
                        ConnectionStrings = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
                    }
                }
                using (IDbConnection DBContext = new SqlConnection(ConnectionStrings))
                {
                    var param = new DynamicParameters();
                    param.Add("@LoginID", dbType: DbType.Int64, value: LoginID, direction: ParameterDirection.Input);
                    param.Add("@TaskID", dbType: DbType.Int64, value: TaskID, direction: ParameterDirection.Input);
                    param.Add("@StatusID", dbType: DbType.Int64, value: StatusID, direction: ParameterDirection.Input);
                    param.Add("@Type", dbType: DbType.String, value: Type, direction: ParameterDirection.Input);
                    param.Add("@IsActive", dbType: DbType.String, value: IsActive, direction: ParameterDirection.Input);
                    DBContext.Open();
                    using (var reader = DBContext.QueryMultiple("spu_GetUser_Task_Status", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<User_Task.StatusList>().ToList();
                    }
                    DBContext.Close();
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetUser_Task_StatusList. The query was executed :", ex.ToString(), "spu_GetUser_Task_Status", "ConfirmationModal", "ConfirmationModal", "");

            }
            return result;
        }

        private string GetParentMenuMap(long ParentMenuID)
        {
            string Sql = "";
            DataSet TempProductCategory = new DataSet();
            Sql = "select ParentMenuID,MenuName from Login_Menu  where MenuID=" + ParentMenuID + " and isdeleted=0 and IsActive=1  Order By MenuPriority,MenuName";

            TempProductCategory = clsDataBaseHelper.ExecuteDataSet(Sql);
            foreach (DataRow dr in TempProductCategory.Tables[0].Rows)
            {
                return GetParentMenuMap(Convert.ToInt64(dr["ParentMenuID"])) + "" + dr["MenuName"] + "-->";
            }
            return "";
        }

        public List<Menu.List> GetLoginMenuList(GetResponse modal)
        {
            List<Menu.List> result = new List<Menu.List>();
            try
            {
                string ConnectionStrings = clsApplicationSetting.GetSessionValue("ConnectionStringData");

                if (string.IsNullOrWhiteSpace(ConnectionStrings))
                {
                    ConnectionStrings = clsApplicationSetting.GetApplicationValue("ConnectionStringData");
                    if (string.IsNullOrWhiteSpace(ConnectionStrings))
                    {
                        ConnectionStrings = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
                    }
                }
                using (IDbConnection DBContext = new SqlConnection(ConnectionStrings))
                {
                    var param = new DynamicParameters();
                    DBContext.Open();
                    param.Add("@MenuID", dbType: DbType.Int64, value: modal.ID, direction: ParameterDirection.Input);
                    using (var reader = DBContext.QueryMultiple("spu_GetLoginMenu", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<Menu.List>().ToList();
                    }
                    DBContext.Close();
                }
                if (result != null)
                {
                    foreach (var item in result.Where(x => x.ParentMenuID != 0).ToList())
                    {

                        item.ParentMenuMap = GetParentMenuMap(item.ParentMenuID) + "" + item.MenuName;

                    }

                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetLoginMenuList. The query was executed :", ex.ToString(), "spu_GetLoginMenu", "ToolsModal", "ToolsModal", "");

            }
            return result;
        }

        public Menu.Add GetLoginMenu(GetResponse modal)
        {
            Menu.Add result = new Menu.Add();
            try
            {
                string ConnectionStrings = clsApplicationSetting.GetSessionValue("ConnectionStringData");

                if (string.IsNullOrWhiteSpace(ConnectionStrings))
                {
                    ConnectionStrings = clsApplicationSetting.GetApplicationValue("ConnectionStringData");
                    if (string.IsNullOrWhiteSpace(ConnectionStrings))
                    {
                        ConnectionStrings = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
                    }
                }
                using (IDbConnection DBContext = new SqlConnection(ConnectionStrings))
                {
                    var param = new DynamicParameters();
                    DBContext.Open();
                    param.Add("@MenuID", dbType: DbType.Int64, value: modal.ID, direction: ParameterDirection.Input);
                    using (var reader = DBContext.QueryMultiple("spu_GetLoginMenu", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<Menu.Add>().FirstOrDefault();
                    }
                    DBContext.Close();
                }
                if (result != null)
                {
                    if (result.ParentMenuID != 0)
                    {
                        result.ParentMenuMap = GetParentMenuMap(result.ParentMenuID) + "" + result.MenuName;
                    }
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetLoginMenu. The query was executed :", ex.ToString(), "spu_GetLoginMenu", "ToolsModal", "ToolsModal", "");

            }
            return result;
        }

        public PostResponse fnSetLoginMenu(Menu.Add model)
        {
            PostResponse result = new PostResponse();
            string ConnectionStrings = ConfigurationManager.ConnectionStrings["connectionstring"].ConnectionString.ToString();
            using (SqlConnection con = new SqlConnection(ConnectionStrings))
            {
                try
                {
                    con.Open();
                    using (SqlCommand command = new SqlCommand("spu_SetLoginMenu", con))
                    {
                        SqlDataAdapter da = new SqlDataAdapter();
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("@MenuID", SqlDbType.Int).Value = model.MenuID ?? 0;
                        command.Parameters.Add("@MenuName", SqlDbType.VarChar).Value = model.MenuName ?? "";
                        command.Parameters.Add("@ParentMenuID", SqlDbType.Int).Value = model.ParentMenuID;
                        command.Parameters.Add("@ModuleID", SqlDbType.Int).Value = model.ModuleID;
                        command.Parameters.Add("@MenuImage", SqlDbType.VarChar).Value = model.MenuImage ?? "";
                        command.Parameters.Add("@Target", SqlDbType.VarChar).Value = model.Target.ToString() ?? "";
                        command.Parameters.Add("@MenuPriority", SqlDbType.Int).Value = model.MenuPriority ?? 0;
                        command.Parameters.Add("@IsActive", SqlDbType.Int).Value = 1;
                        command.Parameters.Add("@createdby", SqlDbType.Int).Value = model.LoginID;
                        command.Parameters.Add("@IPAddress", SqlDbType.VarChar).Value = model.IPAddress;

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
                    result.StatusCode = -1;
                    result.SuccessMessage = ex.Message.ToString();
                }
            }
            return result;

        }

        public List<Menu.ChildMenu> GetMenuChildList(GetResponse modal)
        {
            List<Menu.ChildMenu> result = new List<Menu.ChildMenu>();
            try
            {
                string ConnectionStrings = clsApplicationSetting.GetSessionValue("ConnectionStringData");

                if (string.IsNullOrWhiteSpace(ConnectionStrings))
                {
                    ConnectionStrings = clsApplicationSetting.GetApplicationValue("ConnectionStringData");
                    if (string.IsNullOrWhiteSpace(ConnectionStrings))
                    {
                        ConnectionStrings = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
                    }
                }
                using (IDbConnection DBContext = new SqlConnection(ConnectionStrings))
                {
                    var param = new DynamicParameters();

                    param.Add("@MenuID", dbType: DbType.String, value: modal.ID, direction: ParameterDirection.Input);
                    DBContext.Open();
                    using (var reader = DBContext.QueryMultiple("spu_GetMenu_Child", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<Menu.ChildMenu>().ToList();
                    }
                    DBContext.Close();
                }
                if (result != null)
                {
                    foreach (var item in result)
                    {
                        if (item.ParentMenuID != 0)
                        {
                            item.ParentMenuMap = GetParentMenuMap(item.ParentMenuID) + "" + item.MenuName;
                        }
                        if (item.IsChild == "Y")
                        {
                            GetResponse AgainRecursion = new GetResponse();
                            AgainRecursion.LoginID = modal.LoginID;
                            AgainRecursion.IPAddress = modal.IPAddress;
                            AgainRecursion.ID = item.MenuID;
                            item.ChildList = GetMenuChildList(AgainRecursion);
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetLoginMenu. The query was executed :", ex.ToString(), "spu_GetLoginMenu", "ToolsModal", "ToolsModal", "");

            }
            return result;
        }
        public UserMan.Add GetLoginNonmiteUser(GetResponse modal)
        {
            UserMan.Add result = new UserMan.Add();
            try
            {
                using (IDbConnection DBContext = new SqlConnection(ClsCommon.connectionstring()))
                {
                    var param = new DynamicParameters();
                    param.Add("@ID", dbType: DbType.Int32, value: modal.ID, direction: ParameterDirection.Input);
                    param.Add("@LoginID", dbType: DbType.Int32, value: modal.LoginID, direction: ParameterDirection.Input);
                    DBContext.Open();
                    using (var reader = DBContext.QueryMultiple("spu_GetNonmitrUser", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<UserMan.Add>().FirstOrDefault();
                        if (result == null)
                        {
                            result = new UserMan.Add();
                        }
                        if (!string.IsNullOrEmpty(result.password))
                        {
                            result.password = clsApplicationSetting.Decrypt(result.password);
                        }
                        if (!reader.IsConsumed)
                        {
                            result.RoleList = reader.Read<DropDownList>().ToList();
                        }
                        if (!reader.IsConsumed)
                        {
                            result.UserTypeList = reader.Read<DropDownList>().ToList();
                        }
                        result.CandidiateList = new List<DropDownList>();
                    }
                    DBContext.Close();
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetLoginUser. The query was executed :", ex.ToString(), "spu_GetUser()", "ToolsModal", "ToolsModal", "");

            }
            return result;
        }

        public List<UserMan.List> GetLoginNonMiteUserList(GetResponse modal)
        {
            List<UserMan.List> result = new List<UserMan.List>();
            try
            {
                using (IDbConnection DBContext = new SqlConnection(ClsCommon.connectionstring()))
                {
                    var param = new DynamicParameters();
                    param.Add("@ID", dbType: DbType.Int32, value: modal.ID, direction: ParameterDirection.Input);
                    param.Add("@LoginID", dbType: DbType.Int32, value: modal.LoginID, direction: ParameterDirection.Input);
                    DBContext.Open();
                    using (var reader = DBContext.QueryMultiple("spu_GetNonmitrUserList", param: param, commandType: CommandType.StoredProcedure))
                    {
                        result = reader.Read<UserMan.List>().ToList();
                    }
                    DBContext.Close();
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetLoginUserList. The query was executed :", ex.ToString(), "spu_GetUserList()", "ToolsModal", "ToolsModal", "");

            }
            return result;
        }
        
    }
}