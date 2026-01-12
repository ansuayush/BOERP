using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.TaskMaster
{
    public class QuestionModel
    {
        public int Id { get; set; }

        public int TaskMaster_Id { get; set; }
        public string Question { get; set; }
        public string Type { get; set; }
        public bool IsMandatory { get; set; }

        public string ActualFilename { get; set; }

        public string NewFilename { get; set; }

        public string FileURL { get; set; }

        public bool IsUploadImage { get; set; }

        public int Priority { get; set; }
        public List<QuestionSingleMultiSelectModel> QuestionSingleMultiSelectModelList { get; set; }
    }
}
