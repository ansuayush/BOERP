using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.FMS
{
    public class MasterDataEntryModel
    {

        public int ID { get; set; }

        public int? Entry_No { get; set; }

        public int MasterTable_FMS_Id { get; set; }

        public int FieldTable_FMS_Id { get; set; }

        public long Numeric_Entry { get; set; }

        public string Text_Entry { get; set; }

        public int Dropdown_ID { get; set; }

        public string Email { get; set; }

        public string ActualFileName { get; set; }

        public string NewFileName { get; set; }

        public string FileURL { get; set; }

        public DateTime Date_Entry { get; set; }

        public int? Type { get; set; }
    }
}
