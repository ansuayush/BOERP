using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class PostResponse
    {
        public string ViewAsString { get; set; }
        public bool Status { get; set; }
        public int StatusCode { get; set; }
        public string SuccessMessage { get; set; }
        public string RedirectURL { get; set; }
        public long ID { get; set; }
        public long OtherID { get; set; }
        public string AdditionalMessage { get; set; }
      

    }
    public class GetValidateToken
    {

        public string Token { get; set; }
        public string Doctype { get; set; }
        public long LoginID { get; set; }
        public string IPAddress { get; set; }

    }
    public class GetResponse
    {
        public long ID { get; set; }
        public long AdditionalID { get; set; }
        public long AdditionalID1 { get; set; }
        public int Approve { get; set; }
        public string Doctype { get; set; }
        public long LoginID { get; set; }
        public string IPAddress { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Reason { get; set; }


    }

    public class CommandResult
    {
        public bool Status { get; set; }
        public int StatusCode { get; set; }
        public string SuccessMessage { get; set; }
        public long ID { get; set; }
        public string AdditionalMessage { get; set; }
        public string RedirectURL { get; set; }
    }
}