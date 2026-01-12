using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Employee
{
    public class RolePermissionListModel
    {
        public int MenuID { get; set; }

        public bool R { get; set; }

        public bool W { get; set; }

        public bool M { get; set; }

        public bool D { get; set; }

        public bool AR { get; set; }
    }
}
