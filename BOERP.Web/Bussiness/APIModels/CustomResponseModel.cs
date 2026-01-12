using Sahaj.API.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sahaj.API.Model
{
    public class CustomResponsePagingModel
    {
        public int TotalRecords { get; set; }
        public int FilteredRecords { get; set; }
        public object Records { get; set; }
        public object ColumnData { get; set; }

    }
        public class CustomResponseModel
    {
        public bool IsSuccessStatusCode { get; set; }
        public String ErrorMessage { get; set; }
        public String CustomMessage { get; set; }
        public DataSet data { get; set; }
        public Dictionary<string, List<Dictionary<string, object>>> DataList { get; set; }
        public int ValidationInput { get; set; }

        public int ScopeID { get; set; }
        public List<DropdownModel> CommomDropDownData { get; set; }
        public string CustumException { get; set; }
        public FileModel FileModel { get; set; }
        public String HtmlView { get; set; }
        public String FileStream { get; set; }
        public List<FileModel> FileModelList { get; set; }
        
        public bool IsFileExists { get; set; }



    }
    public class FileModel
    {

        public string FolderNames { get; set; }
        public string ActualFileName { get; set; }
        public string NewFileName { get; set; }
        public string FileSize { get; set; }
        public string FileUrl { get; set; }
        public string AttachmentType { get; set; }
        public string FileName { get; set; }
        public int Id { get; set; }
        public string ScreenId { get; set; }
        public int Type { get; set; }
        public string TypeDetails { get; set; }
        public string FileType { get; set; }


    }
    public class ContentRequestDetails
    {
        public string JsonString { get; set; }       
    }
}
  