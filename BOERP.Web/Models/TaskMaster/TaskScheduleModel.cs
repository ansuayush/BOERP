using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.TaskMaster
{
    public class TaskScheduleModel
    {
        public int id { get; set; }

        public int TaskMasterId { get; set; }

        public int RowNumber { get; set; }
       
        public string Taskname { get; set; }

        public string Doer { get; set; }

        public string Department { get; set; }

        public string Frequency { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public DateTime CombinedDateTime { get; set; }

        public string Status { get; set; }

        public int Type { get; set; }

        public int Branch {  get; set; }

        public DateTime ? FromDate { get; set; }

        public DateTime ? ToDate { get; set; }

    }
}
