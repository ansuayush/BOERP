using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Employee
{
    public class FinancialYearModel
    {   
        public int id { get; set; }

        public string year { get; set; }

        public DateTime from_date { get; set; }

        public DateTime to_date { get; set; }

        public bool isDeleted { get; set; }

        public bool isActive { get; set; }

        public int Type { get; set; }
    }
}
