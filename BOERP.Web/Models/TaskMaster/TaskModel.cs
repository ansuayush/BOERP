using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.TaskMaster
{
    public class TaskModel
    {
        public TaskMasterModel TaskMasterModel { get; set; }    

        public List<QuestionModel> QuestionModel { get; set; }

    }
}
