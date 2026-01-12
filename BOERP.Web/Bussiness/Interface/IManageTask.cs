using Sahaj.API.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Web.Bussiness.Interface
{
    public interface IManageTask
    {
        CustomResponseModel PerformOperation(string globalXml, string screenId, int roleId, int userid, string operation, out string errorMessage);
        CustomResponseModel GetRecords(string globalXml, string screenId, int roleId, int userid, string operation, out string errorMessage);
        ScreenDBMappingModel GetScreenSP(string screenId, int roleId, string operation, out string errorMessage);
    }
}
