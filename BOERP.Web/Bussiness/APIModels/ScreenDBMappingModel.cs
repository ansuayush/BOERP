using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sahaj.API.Model
{
    public class ScreenDBMappingModel
    {
        public String ScreenID { get; set; }
        public String TableName { get; set; }
        public String ProcNameAdd { get; set; }
        public String ProcUpdate { get; set; }
        public String ProcDelete { get; set; }
        public String ProcNameGet { get; set; }
        public String ProcDropdown { get; set; }

    }
}
