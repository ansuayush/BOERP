using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.FMS
{
    public class FieldConfigModel
    {
        public int ID { get; set; }

        public string Fieldname { get; set; }

        public int Type { get; set; }

        public int MaxLength { get; set; }

        public int DependOn_Id { get; set; }

        public bool IsMandatory { get; set; }

        public bool ISGridColumn { get; set; }

        public int Priority { get; set; }

    }
}
