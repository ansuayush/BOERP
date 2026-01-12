using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.FMS
{
    public class FMS_StepModel
    {
        public int ID { get; set; }
        public int FMS_Master_ID { get; set; }
        public string StepName { get; set; }
        public string StepDescription { get; set; }
        public bool IsMin { get; set; }
        public int StepID_1 { get; set; }
        public int FieldID_1 { get; set; }
        public bool IsPlannedTime_1 { get; set; }
        public bool IsActualTime_1 { get; set; }
        public int StepID_2 { get; set; }
        public int FieldID_2 { get; set; }
        public bool IsPlannedTime_2 { get; set; }
        public bool IsActualTime_2 { get; set; }
        public int Minutes { get; set; }
        public int Percentage { get; set; }
        public int BetweenStep { get; set; }
        public bool IsChecklist { get; set; }
        public string FormulaVal { get; set; }
    }
}
