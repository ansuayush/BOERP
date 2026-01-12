using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Employee
{
    public class HolidayMasterModel
    {
        public int id { get; set; }

        public int BranchID { get; set; }

        public string HolidayName { get; set; }

        public string HolidayDate { get; set; }

        public string Description { get; set; }

        public bool isDeleted { get; set; }

        public int Type { get; set; }

        public int FinYear { get; set; }

    }
}
