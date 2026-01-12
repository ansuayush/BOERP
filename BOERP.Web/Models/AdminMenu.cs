using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using static SahajFramework.Models.AllEnum;

namespace SahajFramework.Models
{
    public class AdminMenu
    {
         public int DocNumber { get; set; }
        public int ModuleID { get; set; }
        public string ModuleName { set; get; }
        public string Type { get; set; }
        public int ModulePriority { get; set; }
        public string ModuleIcon { get; set; }
        public string IsChild { get; set; }
        public int RoleID { get; set; }
        public int TranID { get; set; }
        public int MenuID { get; set; }
        public string MenuName { get; set; }
        public int MenuPriority { set; get; }

        public int ParentMenuID { get; set; }
        public string MenuImage { get; set; }
        public string Target { get; set; }
        public string ActualFileName { get; set; }
        
        public string MenuURL { get; set; }
        public bool R { get; set; }
        public bool W { get; set; }
        public bool M { get; set; }
        public bool D { get; set; }
        public bool E { get; set; }
        public bool V { get; set; }
        public List<AdminMenu> ChildMenuList { get; set; }
    }
    public class AdminModuleMenu
    {
        public List<AdminMenu> AdminMenuList { get; set; }
        public List<AdminModule> AdminModuleList { get; set; }
    }
        public class AdminModule
    {
        public string ActualFileName { get; set; }
        public long ModuleID { get; set; }
        public string Type { get; set; }
        public string ModuleName { get; set; }

        public string ModuleIcon { get; set; }
        public int ModulePriority { get; set; }
        public List<AdminMenu> MainMenuList { get; set; }
    }
    public class PageViewPermission
    {
        public bool ReadFlag { set; get; }
        public bool WriteFlag { set; get; }
        public bool ModifyFlag { set; get; }
        public bool DeleteFlag { set; get; }
        public bool ExportFlag { set; get; }
    }

    public class Menu
    {
        public class List
        {
            public int RowNum { get; set; }
            public long MenuID { get; set; }
            public string MenuName { get; set; }
            public long ParentMenuID { get; set; }
            public string ParentMenuMap { get; set; }
            public string MenuURL { get; set; }
            public string MenuImage { get; set; }
            public long ModuleID { get; set; }
            public string ModuleName { set; get; }
            public int? MenuPriority { set; get; }
            public bool IsActive { set; get; }
            public string Target { get; set; }
            public string modifiedat { get; set; }
            public string createdat { get; set; }
            public string modifiedby { get; set; }
            public string IPAddress { get; set; }
        }
        public class Add
        {
            public long? MenuID { get; set; }
            public string MenuURL { get; set; }

            [Required(ErrorMessage = "Menu Name Can't Blank")]
            public string MenuName { get; set; }
            public long ParentMenuID { get; set; }
            public string ParentMenuMap { get; set; }
            public string MenuImage { get; set; }

            [Required(ErrorMessage = "Module Can't Blank")]
            public long? ModuleID { get; set; }
            public int? MenuPriority { set; get; }

            [Required(ErrorMessage = "Target Can't Blank")]
            public Target? Target { get; set; }
            public long LoginID { get; set; }
            public string IPAddress { get; set; }
            public List<DropDownList> ModuleList { get; set; }

        }

        public class ChildMenu
        {
            public long MenuID { get; set; }
            public string MenuName { get; set; }
            public string IsChild { get; set; }
            public string ParentMenuMap { get; set; }
            public long ParentMenuID { get; set; }
            public string ParentMenuName { get; set; }

            public List<ChildMenu> ChildList { get; set; }

        }

    }
}