using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Employee
{
    public class OtpModel
    {
        public int OtpId { get; set; }
        public int UserId { get; set; }
        public string OtpCode { get; set; }
        public DateTime ExpiryTime { get; set; }



    }
}
