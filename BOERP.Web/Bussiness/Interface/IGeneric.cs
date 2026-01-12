using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sahaj.API.Model;
namespace Sahaj.API.Interface
{
    public interface IGeneric
    {       
        ScreenDBMappingModel GetScreenSP(string screenId, int roleId, string operation, out string errorMessage);

        CustomResponseModel PerformGenericOperation(string globalXml,string xml, string screenId, int roleId, Int64 userid, string operation, out string errorMessage);
        CustomResponseModel GetGenericRecords(string globalXml,string xml, string screenId, int roleId, Int64 userid, string operation, out string errorMessage);
        CustomResponseModel GetDropDown(int masterTableTypeId, int? parentId, bool isMasterTableType, bool isManualTable, int manualTable, int manualTableId);

        Task<CustomResponseModel> PerformGenericOperationAsync(string globalXml, string xml, string screenId, int roleId, Int64 userid, string operation);
        Task<CustomResponseModel> GetGenericRecordsAsync(string globalXml, string xml, string screenId, int roleId, Int64 userid, string operation);

        Task<DataSet> ExecuteReportStoredProcedureAsync(GenericReportModel objGenericReportModel);

        Task<CustomResponseModel> GetDropDownWithAsync(int masterTableTypeId, int? parentId, bool isMasterTableType, bool isManualTable, int manualTable, int manualTableId, string ScreenId);
        Task<CustomResponseModel> GetGenericRecordsAsyncPaging(string globalXml, string xml, string screenId, int roleId, Int64 userid, string operation);


    }
}
