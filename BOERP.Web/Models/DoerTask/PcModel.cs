using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.DoerTask
{
    public class PcModel
    {
        public int id { get; set; }

        public int Task_transID { get; set; }

        public string Remark { get; set; }

        public int? Type { get; set; }

        public int DelayD { get; set; }

        public int DelayH { get; set; }

        public int DelayM { get; set; }
    }
}
