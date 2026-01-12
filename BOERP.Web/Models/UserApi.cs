using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class UserApi
    {
        public long UserID { get; set; }
        public string Url { get; set; }
        public string EmpName { get; set; }
        public string EMPCode { get; set; }
        public string Status { get; set; }
        public string Desgination { get; set; }
        public string AttachmentID { get; set; }
        public string Response { get; set; }
    }
}