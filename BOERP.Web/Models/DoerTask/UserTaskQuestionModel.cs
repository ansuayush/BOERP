using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.DoerTask
{
    public  class UserTaskQuestionModel
    {

        public int QuestionId { get; set; }

        public int UserNumerical { get; set; }

        public DateTime UserDate { get; set; }

        public string UserText { get; set; }

        public string ActualFilename { get; set; }

        public string NewFilename { get; set; }

        public string FileURL { get; set; }

        public bool isAudit { get; set; }
    }
}
