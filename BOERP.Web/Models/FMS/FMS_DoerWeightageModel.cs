using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.FMS
{
    public class FMS_DoerWeightageModel
    {
        public int ID { get; set; }
        public int Step_Id { get; set; }
        public int Doer { get; set; }
        public int Weightage { get; set; }
    }
}
