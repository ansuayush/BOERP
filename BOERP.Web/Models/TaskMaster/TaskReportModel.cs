using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.TaskMaster
{
    public class TaskReportModel
    {
        public DateTime? FromDate { get; set; }
        public int Status { get; set; }
        public DateTime? ToDate { get; set; }

        public int Doer {  get; set; }

        public int Frequency { get; set; }

        public int Delay { get; set; }

        public int Branch { get; set; }
    }
}
