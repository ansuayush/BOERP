using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class ConfigSetting
    {
        public int ConfigID { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        [Required(ErrorMessage = "Config Key Can't be Blank")]
        public string ConfigKey { get; set; }
        public string ConfigValue { get; set; }
        public string Remarks { get; set; }
        public string Help { get; set; }
        public bool IsActive { set; get; }
        public int Priority { set; get; }
        public int CreatedByID { set; get; }
        public string CreatedDate { set; get; }
        public int ModifiedByID { set; get; }
        public string ModifiedDate { set; get; }
        public string IPAddress { set; get; }
    }
}