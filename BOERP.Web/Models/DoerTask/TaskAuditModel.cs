using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.DoerTask
{
    public class TaskAuditModel

    {
        public DoerAuditModel DoerAuditModel { get; set; }

        public List<QuesAuditModel> QuesAuditModel { get; set;}
    }

}
