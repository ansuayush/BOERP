using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.DoerTask
{
    public class UserQuestionSingleMultiselectModel
    {

        public int Question_Id { get; set; }

        public int OptionText_Id { get; set;}

        public bool isSelect { get; set; }
    }
}
