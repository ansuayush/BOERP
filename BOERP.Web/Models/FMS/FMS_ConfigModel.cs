using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BOERP.Model.Employee;
using BOERP.Model.TaskMaster;

namespace BOERP.Model.FMS
{
    public class FMS_ConfigModel
    {
        public MasterConfigModel MasterConfigModel { get; set; }

        public List<FieldConfigModel> FieldConfigModel { get; set; }
    }
}
