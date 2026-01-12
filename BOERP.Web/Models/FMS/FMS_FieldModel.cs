using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.FMS
{
    public class FMS_FieldModel
    {
        public int ID { get; set; }
        public int Step_Id { get; set; }
        public bool IsMaster { get; set; }
        public int Master_ID { get; set; }
        public int Field_ID { get; set; }
        public bool IsFormula { get; set; }
        public string FormulaVal { get; set; }
        public bool IsMandatory { get; set; }
    }
}
