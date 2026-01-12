using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace SahajFramework.Models
{
    public class TaskStatusModel
    {
        public string TaskNo { get; set; }
        public string Description { get; set; }
        public DateTime? PlannedDate { get; set; }
        public DateTime? ActualDate { get; set; }
        public string DoerName { get; set; }
        public string DelayHours { get; set; }
        public string Remarks { get; set; }
    }

}