using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Employee
{
    public class StateModel
    {
        public int id { get; set; }

        public int Type { get; set; }

        public string state_name { get; set; }

        public bool isDeleted { get; set; }

        public bool isActive { get; set; }
    }
}
