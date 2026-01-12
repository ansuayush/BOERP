using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Delegation
{
    public class DelegationDocumentUpload
    {
        public int ID { get; set; }
        public int DelegationId { get; set; }
        public string ActualFilename { get; set; }
        public string NewFilename { get; set; }
        public string FileURL { get; set; }

        public int DocumentId { get; set; }
    }
}
