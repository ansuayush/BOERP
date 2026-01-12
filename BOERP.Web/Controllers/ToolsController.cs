using SahajFramework.CommonClass;
using SahajFramework.Models;
using SahajFramework.ModelsMaster;
using SahajFramework.ModelsMasterHelper;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SahajFramework.Controllers
{
    [CheckLoginFilter]
    public class ToolsController : Controller
    {
        IToolsHelper Tools;
        long LoginID = 0;
        string IPAddress = "";
        GetResponse getResponse;
        public ToolsController()
        {
            getResponse = new GetResponse();
            Tools = new ToolsModal();
            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            IPAddress = ClsCommon.GetIPAddress();
            getResponse.IPAddress = IPAddress;
            getResponse.LoginID = LoginID;
        }

        public string RenderRazorViewToString(string viewName, object model)
        {
            ViewData.Model = model;
            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(ControllerContext,
                                                                         viewName);
                var viewContext = new ViewContext(ControllerContext, viewResult.View,
                                             ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);
                viewResult.ViewEngine.ReleaseView(ControllerContext, viewResult.View);
                return sw.GetStringBuilder().ToString();
            }
        }
        public ActionResult ErrorLogList(string src)
        {
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            List<ErrorLog> Modal = new List<ErrorLog>();
            Modal = Tools.ErrorLogList();
            return View(Modal);

        }
        [HttpPost]
        [AuthorizeFilter(ActionFor = "W")]
        public ActionResult ErrorLogList(string src, FormCollection Form, string Command)
        {
            CommandResult PostResult = new CommandResult();
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            string SQL = "";
            PostResult.SuccessMessage = "No Action Taken";
            string HDNErrorID = "";
            try
            {
                if (Command == "Delete")
                {
                    if (Form.GetValue("HDNErrorID") != null)
                    {
                        HDNErrorID = Form.GetValue("HDNErrorID").AttemptedValue;
                    }
                    if (string.IsNullOrEmpty(HDNErrorID))
                    {
                        PostResult.SuccessMessage = "Select atleast one Record";
                    }
                    else
                    {

                        if (HDNErrorID.Contains(","))
                        {
                            SQL = "delete from ErrorLog where ID in (" + HDNErrorID + ")";

                        }
                        else
                        {
                            SQL = "delete from ErrorLog where ID in (" + HDNErrorID + ")";
                        }
                        clsDataBaseHelper.ExecuteNonQuery(SQL);
                        PostResult.ID = 1;
                        PostResult.Status = true;
                        PostResult.SuccessMessage = "Record deleted Successfully";
                    }
                }
                else if (Command == "Clear")
                {
                    SQL = "truncate table ErrorLog";
                    clsDataBaseHelper.ExecuteNonQuery(SQL);
                    PostResult.ID = 1;
                    PostResult.Status = true;
                    PostResult.SuccessMessage = "All Record deleted Successfully";
                }

            }
            catch (Exception Ex)
            {
                ClsCommon.LogError("Error during ErrorLogList. The query was executed :", Ex.ToString(), SQL, "ToolsController", "ToolsController", "");
            }
            return Json(PostResult, JsonRequestBehavior.AllowGet);

        }

        [AuthorizeFilter(ActionFor = "R")]
        public ActionResult EmailTemplate(string src)
        {
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];

            List<EmailTemplate> Modal = new List<EmailTemplate>();
            Modal = Tools.GetEmailTemplateList(0).ToList();
            return View(Modal);
        }
        [AuthorizeFilter(ActionFor = "W")]
        public ActionResult EmailTemplateAdd(string src)
        {
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.TemplateID = GetQueryString[2];

            long ID = 0;
            long.TryParse(ViewBag.TemplateID, out ID);
            EmailTemplate Modal = new EmailTemplate();
            if (ID > 0)
            {
                Modal = Tools.GetEmailTemplateList(ID).FirstOrDefault();
            }
            return View(Modal);
        }

        [HttpPost]
        [ValidateInput(false)]
        [ValidateAntiForgeryToken]
        [AuthorizeFilter(ActionFor = "W")]
        public ActionResult EmailTemplateAdd(string src, EmailTemplate Modal, string Command)
        {
            long SaveID = 0;
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.TemplateID = GetQueryString[2];


            bool status = false;
            string Msg = "";
            TempData["Success"] = "N";
            TempData["SuccessMsg"] = "Email Template Table is not Saved";

            if (string.IsNullOrEmpty(Modal.Body))
            {
                ModelState.AddModelError("Body", "Body Can't Be Blank");
            }
            if (ModelState.IsValid)
            {
                if (Command == "Add")
                {

                    SaveID = Common_SPU.fnSetEmailTemplate(Modal.ID, Modal.GroupName, Modal.TemplateName, Modal.SMSBody, Modal.Repository, Modal.Body, Modal.Subject, Modal.CCMail, Modal.BCCMail);
                    status = true;
                    Msg = "Email Template Updated Successfully";
                }
                if (status)
                {
                    TempData["Success"] = "Y";
                    TempData["SuccessMsg"] = Msg;
                }
                return RedirectToAction("EmailTemplate", new { src = clsApplicationSetting.EncryptQueryString(ViewBag.MenuID + "*" + "/Tools/EmailTemplate") });


            }
            else
            {
                return View(Modal);
            }

        }

        [AuthorizeFilter(ActionFor = "R")]
        public ActionResult ConfigSettingList(string src)
        {
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            List<ConfigSetting> Modal = new List<ConfigSetting>();
            Modal = Tools.GetConfigSettingList(0);
            return View(Modal);
        }

        [AuthorizeFilter(ActionFor = "W")]
        public ActionResult ConfigSettingAdd(string src)
        {

            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.ConfigID = GetQueryString[2];

            long ID = 0;
            long.TryParse(ViewBag.ConfigID, out ID);
            ConfigSetting Modal = new ConfigSetting();
            if (ID > 0)
            {
                Modal = Tools.GetConfigSettingList(ID).FirstOrDefault();
            }
            return View(Modal);
        }

        [HttpPost]

        [ValidateAntiForgeryToken]
        [AuthorizeFilter(ActionFor = "W")]
        public ActionResult ConfigSettingAdd(string src, ConfigSetting Modal, string Command)
        {
            long SaveID = 0;
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.ConfigID = GetQueryString[2];
            bool status = false;
            string Msg = "";
            TempData["Success"] = "N";
            TempData["SuccessMsg"] = "Config Table is not Saved";

            if (ModelState.IsValid)
            {
                if (Command == "Add")
                {

                    SaveID = Common_SPU.fnSetConfigSetting(Modal.ConfigID, Modal.Category, Modal.SubCategory, Modal.ConfigKey, Modal.ConfigValue, Modal.Remarks, Modal.Help, 0);
                    status = true;
                    Msg = "Config Table Updated Successfully";
                    ClsCommon.CreateConfigJson();
                }

                if (status)
                {
                    TempData["Success"] = "Y";
                    TempData["SuccessMsg"] = Msg;
                }
                return RedirectToAction("ConfigSettingList", new { src = clsApplicationSetting.EncryptQueryString(ViewBag.MenuID + "*" + "/Tools/ConfigSettingList") });
            }
            else
            {
                return View(Modal);
            }

        }

        [AuthorizeFilter(ActionFor = "R")]
        public ActionResult RoleList(string src)
        {
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            List<UserRole> Modal = new List<UserRole>();
            Modal = Tools.GetRoleList(0);
            return View(Modal);
        }
        [AuthorizeFilter(ActionFor = "W")]
        public ActionResult _AddRole(string src)
        {
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.RoleID = GetQueryString[2];
            UserRole Modal = new UserRole();
            long ID = 0;
            long.TryParse(ViewBag.RoleID, out ID);
            if (ID > 0)
            {
                Modal = Tools.GetRoleList(ID).FirstOrDefault();
            }
            return PartialView(Modal);

        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AuthorizeFilter(ActionFor = "W")]
        public JsonResult _AddRole(string src, UserRole Modal, string Command)
        {
            PostResponse PostResult = new PostResponse();
            long SaveID = 0;
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.RoleID = GetQueryString[2];
            bool status = false;
            string Msg = "";
            TempData["Success"] = "N";
            TempData["SuccessMsg"] = "Role is not Saved";

            if (ModelState.IsValid)
            {
                if (Command == "Add")
                {
                    SaveID = Common_SPU.fnSetUserRole(Modal.RoleID, Modal.RoleName, Modal.Description, 1, 1);
                    status = true;
                    Msg = "Role Updated Successfully";
                }
                if (status)
                {
                    TempData["Success"] = "Y";
                    TempData["SuccessMsg"] = Msg;
                    PostResult.Status = true;
                    PostResult.SuccessMessage = Msg;

                }

            }
            return Json(PostResult, JsonRequestBehavior.AllowGet);

        }



        public ActionResult RoleMenuManagement(string src)
        {
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.RoleID = GetQueryString[2];
            int ID = 0;
            int.TryParse(ViewBag.RoleID, out ID);
            List<AdminModule> Modal = new List<AdminModule>();
            if (ID > 0)
            {
                getResponse.ID = ID;
                Modal = Tools.GetModuleListWithMenu(getResponse);
            }
            return View(Modal);
        }

        private ArrayList ChildMenuManagement(FormCollection Form, List<AdminMenu> ChildMenuList)
        {
            string SQL = "";
            ArrayList ArStr = new ArrayList();
            foreach (AdminMenu Mitem2 in ChildMenuList)
            {
                bool read = false, write = false, modify = false, delete = false, export = false;
                if (Form.GetValue("Read_" + Mitem2.MenuID) != null)
                {
                    read = true;
                }

                SQL = "update Menu_Role_Tran set r='" + read + "',modifiedat=getdate(), modifiedby=" + LoginID + " where TranID=" + Mitem2.TranID;
                ArStr.Add(SQL);

                if (Form.GetValue("Write_" + Mitem2.MenuID) != null)
                {
                    write = true;
                }

                SQL = "update Menu_Role_Tran set w='" + write + "',modifiedat=getdate(), modifiedby=" + LoginID + " where TranID=" + Mitem2.TranID;
                ArStr.Add(SQL);

                if (Form.GetValue("Modify_" + Mitem2.MenuID) != null)
                {
                    modify = true;
                }

                SQL = "update Menu_Role_Tran set m='" + modify + "',modifiedat=getdate(), modifiedby=" + LoginID + " where TranID=" + Mitem2.TranID;
                ArStr.Add(SQL);

                if (Form.GetValue("Delete_" + Mitem2.MenuID) != null)
                {
                    delete = true;
                }

                SQL = "update Menu_Role_Tran set d='" + delete + "',modifiedat=getdate(), modifiedby=" + LoginID + " where TranID=" + Mitem2.TranID;
                ArStr.Add(SQL);

                if (Form.GetValue("Export_" + Mitem2.MenuID) != null)
                {
                    export = true;
                }

                SQL = "update Menu_Role_Tran set e='" + export + "',modifiedat=getdate(), modifiedby=" + LoginID + " where TranID=" + Mitem2.TranID;
                ArStr.Add(SQL);


                if (Mitem2.IsChild == "Y")
                {
                    ChildMenuManagement(Form, Mitem2.ChildMenuList);
                }

            }
            return ArStr;
        }


        [HttpPost]
        public ActionResult RoleMenuManagement(string src, FormCollection Form, string Command)
        {
            int SaveID = 0;
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.RoleID = GetQueryString[2];
            ViewBag.RoleName = GetQueryString[3];
            ArrayList ArStr = new ArrayList();
            long LoginID = 0;
            long.TryParse(clsApplicationSetting.GetSessionValue("LoginID"), out LoginID);
            string SQL = "";
            try
            {
                if (Command == "Update")
                {
                    int ID = 0;
                    int.TryParse(ViewBag.RoleID, out ID);

                    List<AdminModule> Modal = new List<AdminModule>();
                    if (ID > 0)
                    {
                        getResponse.ID = ID;
                        Modal = Tools.GetModuleListWithMenu(getResponse);
                    }
                    foreach (AdminModule item in Modal)
                    {
                        foreach (AdminMenu Mitem in item.MainMenuList)
                        {
                            bool read = false, write = false, modify = false, delete = false, export = false;
                            if (Form.GetValue("Read_" + Mitem.MenuID) != null)
                            {
                                read = true;
                            }

                            SQL = "update Menu_Role_Tran set r='" + read + "', modifiedat=getdate(), modifiedby=" + LoginID + " where TranID=" + Mitem.TranID;
                            ArStr.Add(SQL);

                            if (Form.GetValue("Write_" + Mitem.MenuID) != null)
                            {
                                write = true;
                            }

                            SQL = "update Menu_Role_Tran set w='" + write + "', modifiedat=getdate(), modifiedby=" + LoginID + " where TranID=" + Mitem.TranID;
                            ArStr.Add(SQL);

                            if (Form.GetValue("Modify_" + Mitem.MenuID) != null)
                            {
                                modify = true;
                            }

                            SQL = "update Menu_Role_Tran set m='" + modify + "',modifiedat=getdate(), modifiedby=" + LoginID + " where TranID=" + Mitem.TranID;
                            ArStr.Add(SQL);

                            if (Form.GetValue("Delete_" + Mitem.MenuID) != null)
                            {
                                delete = true;
                            }

                            SQL = "update Menu_Role_Tran set d='" + delete + "',modifiedat=getdate(), modifiedby=" + LoginID + " where TranID=" + Mitem.TranID;
                            ArStr.Add(SQL);

                            if (Form.GetValue("Export_" + Mitem.MenuID) != null)
                            {
                                export = true;
                            }

                            SQL = "update Menu_Role_Tran set e='" + export + "',modifiedat=getdate(), modifiedby=" + LoginID + " where TranID=" + Mitem.TranID;
                            ArStr.Add(SQL);


                            if (Mitem.IsChild == "Y")
                            {

                                var ChildList = ChildMenuManagement(Form, Mitem.ChildMenuList);
                                if (ChildList != null)
                                {
                                    foreach (var myitem in ChildList)
                                    {
                                        ArStr.Add(myitem);
                                    }
                                }
                            }
                        }
                    }

                    SaveID = clsDataBaseHelper.executeArrayOfSql(ArStr);


                }
                else if (Command == "Sync")
                {
                    clsDataBaseHelper.ExecuteNonQuery("exec spu_Update_Menu_Role_Tran");

                    TempData["Success"] = "Y";
                    TempData["SuccessMsg"] = "All Menu Synced Successfully";
                    return RedirectToAction("RoleMenuManagement", new { src = clsApplicationSetting.EncryptQueryString(ViewBag.MenuID + "*" + "/Tools/RoleMenuManagement" + "*" + ViewBag.RoleID + "*" + ViewBag.RoleName) });
                }
                else if (Command == "JSON")
                {
                    ClsCommon.CreateMenuJSon();
                    TempData["Success"] = "Y";
                    TempData["SuccessMsg"] = "Menu JSON Updated Successfully";
                    return RedirectToAction("RoleMenuManagement", new { src = clsApplicationSetting.EncryptQueryString(ViewBag.MenuID + "*" + "/Tools/RoleMenuManagement" + "*" + ViewBag.RoleID + "*" + ViewBag.RoleName) });

                }
                if (SaveID > 0)
                {
                    ClsCommon.CreateMenuJSon();
                    TempData["Success"] = "Y";
                    TempData["SuccessMsg"] = "Setting Saved Successfully";
                }
                else
                {
                    TempData["Success"] = "N";
                    TempData["SuccessMsg"] = "Setting is not Saved";
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetModuleListWithMenu. The query was executed :", ex.ToString(), "spu_GetModuleListRoleWise", "ToolsModal", "ToolsModal", "");
            }
            return RedirectToAction("RoleList", new { src = clsApplicationSetting.EncryptQueryString(ViewBag.MenuID + "*" + "/Tools/RoleList") });

        }

        public ActionResult LoginUsersList(string src)
        {
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            List<UserMan.List> Modal = new List<UserMan.List>();
            Modal = Tools.GetLoginUserList(getResponse);
            return View(Modal);

        }
       // [AuthorizeFilter(ActionFor = "W")]
        public ActionResult _AddUser(string src)
        {
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.ID = GetQueryString[2];
            UserMan.Add Modal = new UserMan.Add();
            long ID = 0;
            long.TryParse(ViewBag.ID, out ID);
            getResponse.ID = ID;
            Modal = Tools.GetLoginUser(getResponse);
            return PartialView(Modal);

        }


        [HttpPost]
       // [AuthorizeFilter(ActionFor = "W")]
        public JsonResult _AddUser(string src, UserMan.Add Modal, string Command)
        {
            PostResponse PostResult = new PostResponse();
           
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.ID = GetQueryString[2];
            long ID = 0;
            long.TryParse(ViewBag.ID, out ID);
           

            PostResult.SuccessMessage = "User action Can't Update";
            if (ModelState.IsValid)
            {
                Modal.ID = ID;
                Modal.LoginID = LoginID;
                Modal.IPAddress = IPAddress;
                PostResult = Common_SPU.SetLoginUsers(Modal);
            }
            if (PostResult.Status)
            {
                PostResult.RedirectURL = "/Tools/LoginUsersList?src=" + clsApplicationSetting.EncryptQueryString(ViewBag.MenuID.ToString() + "*/Tools/LoginUsersList");
            }
            return Json(PostResult, JsonRequestBehavior.AllowGet);


        }
        [AcceptVerbs(HttpVerbs.Get)]
        public JsonResult EncryptQueryStringJSON(string Value)
        {
            return Json(clsApplicationSetting.EncryptQueryString(Value), JsonRequestBehavior.AllowGet);
        }
        [AcceptVerbs(HttpVerbs.Get)]
        public JsonResult DecryptQueryStringJSON(string Value)
        {
            return Json(clsApplicationSetting.DecryptQueryString(Value), JsonRequestBehavior.AllowGet);
        }
        [AcceptVerbs(HttpVerbs.Get)]
        public JsonResult GetConfigValueJSON(string Key)
        {
            return Json(clsApplicationSetting.GetConfigValue(Key), JsonRequestBehavior.AllowGet);
        }
        public ActionResult MenuList(string src)
        {
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            List<Menu.List> result = new List<Menu.List>();
            result = Tools.GetLoginMenuList(getResponse);
            return View(result);

        }

        [HttpPost]
        public ActionResult _ChildMenuList(string src)
        {
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.ID = GetQueryString[2];
            long ID = 0;
            long.TryParse(GetQueryString[2], out ID);
            getResponse.ID = ID;
            List<Menu.ChildMenu> result = new List<Menu.ChildMenu>();
            result = Tools.GetMenuChildList(getResponse);
            return PartialView(result);

        }

        public ActionResult _AddMenu(string src)
        {
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.ID = GetQueryString[2];
            Menu.Add Modal = new Menu.Add();
            long ID = 0;
            long.TryParse(ViewBag.ID, out ID);
            if (ID > 0)
            {
                getResponse.ID = ID;
                Modal = Tools.GetLoginMenu(getResponse);
            }

            GetResponse getDropDown = new GetResponse();
            getDropDown.Doctype = "Module";
            Modal.ModuleList = ClsCommon.GetDropDownList(getDropDown);

            return PartialView(Modal);

        }
        [HttpPost]
        public ActionResult _AddMenu(string src, Menu.Add Modal, string Command)
        {
            PostResponse Result = new PostResponse();
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ViewBag.ID = GetQueryString[2];
            long ID = 0;
            long.TryParse(ViewBag.ID, out ID);
            Result.SuccessMessage = "Role Can't Update";
            if (ModelState.IsValid)
            {
                Modal.LoginID = LoginID;
                Modal.IPAddress = IPAddress;
                Modal.MenuID = ID;
                Result = Tools.fnSetLoginMenu(Modal);

            }
            if (Result.Status)
            {
                Result.RedirectURL = "/Tools/MenuList?src=" + clsApplicationSetting.EncryptQueryString(ViewBag.MenuID.ToString() + "*/Tools/MenuList");
            }
            return Json(Result, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public JsonResult UpdateMenuJson(string src)
        {
            PostResponse Result = new PostResponse();
            ViewBag.src = src;
            string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            ViewBag.GetQueryString = GetQueryString;
            ViewBag.MenuID = GetQueryString[0];
            ClsCommon.CreateMenuJSon();
            Result.Status = true;
            Result.SuccessMessage = "Menu Json Updated Successfully";
            return Json(Result, JsonRequestBehavior.AllowGet);
        }
        
    }
}