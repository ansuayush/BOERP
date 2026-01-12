using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sahaj.API.Model
{
    public class GenericReportModel
    {
        public string StoredProcedureName { get; set; }
        public Dictionary<string, object> Parameters { get; set; }
        public string ReportPath { get; set; } // Example: "~/CrystalReport/AddressLabel.rpt"
        public string FileNamePrefix { get; set; } // Example: "AddressLabel"
    }

}