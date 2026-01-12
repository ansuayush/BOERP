using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace SahajFramework.Service
{
   public class GenericService
    {
        #region Generic API managment
        public async Task<HttpCustomResponse<T>> PerformDataOperation<T>(HttpContent collection)
        {
            return await HttpUtil.PostAsync<T>(collection, Constants.PerformOperationAsync,false);
        } 
        public async Task<HttpCustomResponse<T>> GetRecords<T>(string modelData, string screenId)
        {
            return await HttpUtil.GetAsync<T>(Constants.GetRecordsAsync + "?modelData="+ modelData+ "&screenId="+screenId);
        }
        public async Task<HttpCustomResponse<T>> GetDropdown<T>(int masterTableTypeId, int? parentId, bool isMasterTableType, bool isManualTable, int manualTable, int manualTableId, string ScreenId)
        {
            string queryString = $"?masterTableTypeId={masterTableTypeId}&parentId={parentId}&isMasterTableType={isMasterTableType}&isManualTable={isManualTable}&manualTable={manualTable}&manualTableId={manualTableId}&ScreenId={ScreenId}";
            return await HttpUtil.GetAsync<T>(Constants.GetDropDownWithAsyncAuth + queryString);
        }
        #endregion


        #region Content managment
        public async Task<HttpCustomResponse<T>> PostUploadDocuments<T>(byte[] fileBytes, HttpPostedFileBase file, string jsonString, int type)
        {
            return await HttpUtil.PostUploadDocument<T>(Constants.FileUploadAsyncWithAuth + "?jsonString=" + jsonString + "&type=" + type, fileBytes, file);
        }
        public async Task<HttpCustomResponse<T>> DownloadFile<T>(HttpContent collection)
        {
            return await HttpUtil.PostAsync<T>(collection, Constants.DownloadFileWithAuth, false);
        }
        public async Task<HttpCustomResponse<T>> DeleteFile<T>(HttpContent collection)
        {
            return await HttpUtil.PostAsync<T>(collection, Constants.DeleteFileWithAuth, false);
        }
        #endregion
    }
}
