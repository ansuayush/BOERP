using SahajFramework.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SahajFramework.ModelsMasterHelper
{
    interface IToolsHelper
    {
        List<AdminMenu> GetAdminMenuList(GetResponse modal);
        List<AdminModule> GetModuleListWithMenu(GetResponse modal);
        List<ErrorLog> ErrorLogList();
        List<EmailTemplate> GetEmailTemplateList(long ID);
        int CheckEmailTemplateNameExist(string ID, string TemplateName);
        List<UserRole> GetRoleList(long RoleID);
        List<UserMan.List> GetLoginUserList(GetResponse modal);
        UserMan.Add GetLoginUser(GetResponse modal);
     
        List<ConfigSetting> GetConfigSettingList(long ID);
      
        List<Menu.List> GetLoginMenuList(GetResponse modal);

        Menu.Add GetLoginMenu(GetResponse modal);
        PostResponse fnSetLoginMenu(Menu.Add model);
        List<Menu.ChildMenu> GetMenuChildList(GetResponse modal);
       
       
   
    }
}