using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.FMS
{
    public class FMSMasterModel
    {
        public int ID { get; set; }

        public int FMS_ID { get; set; }

        public DateTime FMSDate { get; set; }

        public int Category_Id { get; set; }

        public string FMSName { get; set; }

        public string Objectives { get; set; }

        public int Manager_Id { get; set; }

        public int Branch { get; set; }

        public string Description { get; set; }

        public int Priority { get; set; }

        public int? Type { get; set; }

    }
}
