using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class LoginMenu
    {
        public long TranID { get; set; }
        public long MenuID { get; set; }
        public int MenuPriority { set; get; }
        public string MenuName { get; set; }
        public string Target { get; set; }
        public long ParentMenuID { get; set; }
        public string ParentMenuName { get; set; }
        public string ParentMenuMap { get; set; }
        public string MenuURL { get; set; }
        public string MenuImage { get; set; }
        public long ModuleID { get; set; }
        public string ModuleName { set; get; }
        public string IsMenuChildExist { get; set; }
        public bool Read { get; set; }
        public bool Write { get; set; }
        public bool Modify { get; set; }
        public bool Delete { get; set; }
        public bool Export { get; set; }
        public List<LoginMenu> ChildMenuList { get; set; }

        public bool IsActive { set; get; }
        public int CreatedByID { set; get; }
        public string CreatedDate { set; get; }
        public int ModifiedByID { set; get; }
        public string ModifiedDate { set; get; }
        public string IPAddress { set; get; }
    }
    public class LoginModule
    {
        public long ModuleID { get; set; }
        public string Type { get; set; }
        public string ModuleName { get; set; }

        public string ModuleIcon { get; set; }
        public int ModulePriority { get; set; }
        public bool IsActive { get; set; }
        public List<LoginMenu> MainMenuList { get; set; }
    }

    public class MenuJson
    {
        public long ModuleID { get; set; }
        public string ModuleName { get; set; }
        public string Type { get; set; }
        public int ModulePriority { get; set; }
        public bool IsActive_Module { get; set; }
        public long MenuID { get; set; }
        public string MenuName { get; set; }
        public int ParentMenuID { get; set; }
        public string MenuImage { get; set; }
        public int MenuPriority { get; set; }
        public string MenuURL { get; set; }
        public bool IsActive_Menu { get; set; }
        public long TranID { get; set; }
        public long RoleID { get; set; }
        public bool R { get; set; }
        public bool W { get; set; }
        public bool M { get; set; }
        public bool D { get; set; }
        public bool E { get; set; }
        public string ModuleIcon { get; set; }
        public string Target { get; set; }
        public string IsChild { get; set; }
    }
}