using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BOERP.Model.TaskMaster;

namespace BOERP.Model.FMS
{
    public class FMSModel
    {
        public FMSMasterModel FMSMasterModel { get; set; }

        public FMS_StepModel FMS_StepModel { get; set; }

        public List<FMS_DoerWeightageModel> FMS_DoerWeightageModel { get; set; }

        public List<FMS_FieldModel> FMS_FieldModel { get; set; }

        public List<FMS_QuestionModel> FMS_QuestionModel { get; set; }


    }
}
