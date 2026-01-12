using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model
{
    public class QuestionSingleMultiSelectModel
    {
        public int ID { get; set; }
       
        public int Question_Id { get; set; }

        public string OptionText { get; set; }

        public bool isSelect { get; set; }
    }
}
