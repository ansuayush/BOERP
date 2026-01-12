using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.DoerTask
{
    public class DoerAuditModel
    {
        public int Task_transID { get; set; }

        public bool TaskAudit { get; set; }

        public bool IsReprocess { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string Remark { get; set; }

        public string TaskDate { get; set; }
    }
}
