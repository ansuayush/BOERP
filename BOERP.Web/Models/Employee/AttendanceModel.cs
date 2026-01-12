using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Employee
{
    public class AttendanceModel
    {
        public int id { get; set; }

        public int LeaveType { get; set; }

        public int Employee { get; set; }

        public DateTime AttDate { get; set; }

        public int Type { get; set; }

        public bool isDeleted { get; set; }

        public bool isActive { get; set; }

    }
}
