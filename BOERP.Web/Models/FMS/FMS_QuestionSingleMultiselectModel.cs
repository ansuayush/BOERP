using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.FMS
{
    public class FMS_QuestionSingleMultiselectModel
    {
        public int ID { get; set; }
        public int Step_ID { get; set; }
        public int Question_Id { get; set; }
        public bool? IsSelect { get; set; }
        public string OptionText { get; set; }
    }
}
