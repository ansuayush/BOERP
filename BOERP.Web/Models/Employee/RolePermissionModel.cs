using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Employee
{
    public class RolePermissionModel
    {
        public int RoleId { get; set; }

        public List<RolePermissionListModel> RolePermissionListModel { get; set; }
    }
}
