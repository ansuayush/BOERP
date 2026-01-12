using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.DoerTask
{
    public class DoerModel
    {
        public int Task_transID { get; set; }

        public int DelayD { get; set; }

        public int DelayH { get; set; }

        public int DelayM { get; set; }

        public string UserRefActualFilename { get; set; }

        public string UserRefNewFilename { get; set; }

        public string UserRefFileURL { get; set; }

        public string UserRemarks { get; set; }



        public List<UserQuestionSingleMultiselectModel> UserQuestionSingleMultiselectModel { get; set; }

        public List<UserTaskQuestionModel> UserTaskQuestionModel { get; set; }

    }
}
