using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class UserRole
    {
        public int RoleID { set; get; }
        [Required(ErrorMessage = "Role Name can't be Blank")]
        [StringLength(200, ErrorMessage = "Allowed Maximum Length 200 Characters")]
        public string RoleName { set; get; }

        [StringLength(200, ErrorMessage = "Allowed Maximum Length 200 Characters")]
        public string Description { set; get; }
        public bool IsActive { set; get; }
        public int Priority { set; get; }
        public int createdby { set; get; }
        public string createdat { set; get; }
        public int modifiedby { set; get; }
        public string modifiedat { set; get; }
        public string IPAddress { set; get; }
    }
}