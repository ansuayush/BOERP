using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Delegation
{
    public class DelegationModel
    {
        public DelegationMasterModel delegationMasterModel { get; set; }

        public List<DelegationDocumentUpload> listDelegationDocumentUpload { get; set; }
    }
}
