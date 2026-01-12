using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.FMS
{
    public class FieldDataEntryModel
    {
        public int ID { get; set; }
        public int Field_ID { get; set; }

        public string FieldName { get; set; }

        public string Caption { get; set; }

        public int? Type { get; set; }

        public bool isVisible { get; set; }

        public bool IsStatus { get; set; }

        public string Formula { get; set; }

        public int MaxLength { get; set; }

        public bool isSingle { get; set; }
    }
}
