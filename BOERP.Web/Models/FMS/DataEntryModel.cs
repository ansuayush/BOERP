using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.FMS
{
    public class DataEntryModel
    {
        public int Type { get; set; }

        public int Master_Table_FMS_Id { get; set; }

        public int Entry_No { get; set; }

        public bool isdeleted { get; set; }
        public List<MasterDataEntryModel> MasterDataEntryModel { get; set; }
    }
}
