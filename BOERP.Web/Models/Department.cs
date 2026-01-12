using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class Department
    {
        public class List
        {
            public long ID { set; get; }
            public string DepartmentName { get; set; }
            public string DepartmentCode { get; set; }
            public string Description { get; set; }
            public bool IsActive { set; get; }
            public int Priority { set; get; }
            public string createdat { get; set; }

            public string modifiedat { get; set; }
            public string IPAddress { get; set; }
        }
        public class Add
        {
            public long? ID { set; get; }
            [Required(ErrorMessage = "Hey! You missed this field")]
            public string DepartmentName { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field")]
            public string DepartmentCode { get; set; }
            public string Description { get; set; }
            public bool IsActive { set; get; }
            public int? Priority { set; get; }
            public long LoginID { get; set; }
            public string IPAddress { get; set; }
        }
    }
}