using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.FMS
{
    public class FMS_QuestionModel
    {
        public int ID { get; set; }
        public int Step_Id { get; set; }
        public string Question { get; set; }
        public string Type { get; set; }
        public bool? IsMandatory { get; set; }
        public bool? IsUploadImage { get; set; }
        public string ActualFilename { get; set; }
        public string NewFilename { get; set; }
        public string FileURL { get; set; }
        public DateTime? Date { get; set; }
        public string UserText { get; set; }
        public int? Priority { get; set; }

        public List<FMS_QuestionSingleMultiselectModel> FMS_QuestionSingleMultiselectModel { get; set; }
    }
}
