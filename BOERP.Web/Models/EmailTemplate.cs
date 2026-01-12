using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SahajFramework.Models
{
    public class EmailTemplate
    {
        public int ID { set; get; }

        [Required(ErrorMessage = "Template Name Can't be Blank")]
        public string TemplateName { get; set; }
        public string GroupName { get; set; }
        [AllowHtml]
        public string Body { get; set; }
        [Required(ErrorMessage = "Subject Can't be Blank")]
        public string Subject { set; get; }
        public string SMSBody { get; set; }
        public string Repository { get; set; }
        public string CCMail { get; set; }
        public string BCCMail { get; set; }
        public bool IsActive { set; get; }
        public int Priority { set; get; }
        public int CreatedByID { set; get; }
        public string CreatedDate { set; get; }
        public int ModifiedByID { set; get; }
        public string ModifiedDate { set; get; }
        public string IPAddress { set; get; }
    }
}