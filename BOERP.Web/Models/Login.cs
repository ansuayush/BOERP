using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using static SahajFramework.Models.Employee;

namespace SahajFramework.Models
{
    public class Login
    {
        [Required( ErrorMessage ="User Name Can't Blank")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Password Can't Blank")]
        public string Password { get; set; }
    }
    public class CompanyLogin
    {      
        public string CompanyId { get; set; }      
        public string LoginId { get; set; }
        public int FinId { get; set; }

        public string FinYearDate { get; set; }
    }
    public class   LoginUser
    {
        public long LoginID { get; set; }
        public bool Status { get; set; }
        public long EMPID { get; set; }
        public string SessionID { get; set; }
        public string LoginTime { get; set; }
        public string User_Name { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public long RoleID { get; set; }
        public  string RoleName { get; set; }
        public string EMPCode { get; set; }
        public long AttachmentID { get; set; }
        public string content_type { get; set; }
        public long EPayEMPID { get; set; }
        public string EPayCompanyCode { get; set; }
        public long LocationID { get; set; }
        public string Designation { get; set; }
    }


    public class ForgotPassword
    {
        public class Request
        {
            [Required(ErrorMessage = "User Name Can't Blank")]
            public string Username { get; set; }
            public string IPAddress { get; set; }
            public string Token { get; set; }

        }
    }

    public class ChangePassword
    {
        [Required(ErrorMessage = "Old Password Can't Blank")]
        public string OldPassword { get; set; }
        [Required(ErrorMessage = "New Password Can't Blank")]
        public string NewPassword { get; set; }
        [Required(ErrorMessage = "Confirm Password Can't Blank")]
        public string ConfirmPassword { get; set; }
        public string IPAddress { get; set; }
        public string Token { get; set; }
        public long LoginID { get; set; }
    }
    
}