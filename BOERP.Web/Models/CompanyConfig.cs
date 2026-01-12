using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class CompanyConfig
    {
        public int Id { get; set; }
        public HttpPostedFileBase FileUpload { get; set; }
        [Required(ErrorMessage = "Company Name not blank")]
        public string CompanyName { get; set; }
        public string CompanyLogo { get; set; }
        [Required(ErrorMessage = "Company Address not blank")]
        public string CompanyAdress { get; set; }
        
    }
}