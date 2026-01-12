using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Employee
{
    public class MasterConfigModel
    {
        public int ID { get; set; }

        public string MasterName { get; set; }

        public int Type { get; set; }

        public bool isdeleted { get; set; }

        public string USerAddPermission { get; set; }

        public string UserEditPermission { get; set; }

        public string UserDeletePermission { get; set; }

    }
}
