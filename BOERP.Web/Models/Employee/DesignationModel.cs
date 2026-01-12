using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Employee
{
    public class DesignationModel
    {
        public int id { get; set; }

        public int Type { get; set; }

        public string design_name { get; set; }

        public bool isdeleted { get; set; }

        public bool isActive { get; set; }

    }
}
