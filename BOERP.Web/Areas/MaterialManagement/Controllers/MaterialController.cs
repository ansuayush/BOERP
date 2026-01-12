using BOERP.Web.Controllers;
using BOERP.Web.Models;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using OfficeOpenXml;
using Sahaj.API;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Xml.Linq;

namespace BOERP.Web.Areas.MaterialManagement.Controllers
{
    [CustomAuthorizeAttribute]
    public class MaterialController : BaseController
    {
        // GET: MaterialManagement/Material     
        public ActionResult Index(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }
        ////[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "Vendor")]
        public ActionResult Vendor(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }

        #region Indent Process
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "IndentIndex")]
        public ActionResult IndentIndex(string auth)
        {
            if (!HasPermission("17", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "IndentApproval")]
        public ActionResult IndentApproval(string auth)
        {
            if (!HasPermission("34", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "PurchaseOrderIndex")]
        public ActionResult PurchaseOrderIndex(string auth)
        {
            if (!HasPermission("18", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult PurchaseOrderPrint(string auth, int? id)
        {

            string actionCode = "R";
            if (!HasPermission("18", actionCode))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.id = id;
            return View();
        }
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "CreatePurchaseOrder")]
        public ActionResult CreatePurchaseOrder(string auth, string id, string suppId, string IndId)
        {
            string actionCode = id == "0" || id == "" ? "W" : "M";
            if (!HasPermission("18", actionCode))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            //id = clsApplicationSetting.Decrypt(id);
            //if(id=="NA")
            //{
            //    id = "0";
            //}
            ViewBag.Auth = auth;
            ViewBag.PoId = id;
            ViewBag.SuppId = suppId;
            ViewBag.IndId = IndId;
            return View();
        }
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "CreatePurchaseOrder")]
        public ActionResult DuplicatePurchaseOrder(string auth, string id, string suppId)
        {
            string actionCode = id == "0" || id == "" ? "W" : "W";
            if (!HasPermission("18", actionCode))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            //id = clsApplicationSetting.Decrypt(id);
            //if(id=="NA")
            //{
            //    id = "0";
            //}
            ViewBag.Auth = auth;
            ViewBag.PoId = id;
            ViewBag.SuppId = suppId;
            return View();
        }
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "ViewPurchaseOrder")]
        public ActionResult ViewPurchaseOrder(string auth, string id, string suppId, string IndId, int ErpPartyId=0, string PageType="")
        {

            if (!HasPermission("18", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }
            //id = clsApplicationSetting.Decrypt(id);
            //if(id=="NA")
            //{
            //    id = "0";
            //}
            ViewBag.Auth = auth;
            ViewBag.PoId = id;
            ViewBag.SuppId = suppId;
            ViewBag.IndId = IndId;
            ViewBag.ErpPartyId = ErpPartyId;
            ViewBag.PageType = PageType;
            return View();
        }
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "ViewPurchaseDocument")]
        public ActionResult ViewPurchaseDocument(string auth, string id, int status, int ErpPartyId=0, int PA_Id=0, string PageType="")
        {

            //id = clsApplicationSetting.Decrypt(id);
            //if(id=="NA")
            //{
            //    id = "0";
            //}
            ViewBag.Auth = auth;
            ViewBag.PoId = id;
            ViewBag.status = status;
            ViewBag.ErpPartyId = ErpPartyId;
            ViewBag.PAId = PA_Id;
            ViewBag.PageType = PageType;
            return View();
        }
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "IndentViewApproval")]
        public ActionResult IndentViewApproval(string auth, string id)
        {
            ViewBag.Auth = auth;
            ViewBag.IndentId = id;
            return View();
        }
        public ActionResult POApproval(string auth)
        {

            if (!HasPermission("56", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult GRNApproval(string auth)
        {
            if (!HasPermission("57", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }
        public ActionResult ViewPurchaseOrderApproval(string auth, string id)
        {
            ViewBag.Auth = auth;
            ViewBag.PoId = id;
            return View();
        }

        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "CreateIndent")]
        public ActionResult CreateIndent(string auth, string id, int? isDuplicate)
        {
            string actionCode = id == "0" || id == "" ? "W" : "M";
            if (id != "0" && id != "" && isDuplicate == 1)
            {
                actionCode = "W";
            }
            if (!HasPermission("17", actionCode))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            //id = clsApplicationSetting.Decrypt(id);
            //if(id=="NA")
            //{
            //    id = "0";
            //}
            ViewBag.Auth = auth;
            ViewBag.isDuplicate = isDuplicate;
            ViewBag.IndentId = id;
            return View();
        }
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "ViewIndent")]
        public ActionResult ViewIndent(string auth, string id, string PageType="")
        {
            if (!HasPermission("17", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }
            //id = clsApplicationSetting.Decrypt(id);
            //if(id=="NA")
            //{
            //    id = "0";
            //}
            ViewBag.Auth = auth;
            ViewBag.IndentId = id;
            ViewBag.PageType = PageType;
            return View();
        }
        #endregion

        #region Item Master Process
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "ItemMaster")]
        public ActionResult ItemMaster(string auth, int? IsSample, int itemId = 0)
        {
            string IsPermission = itemId == 0 ? "W" : "M";
            if (!HasPermission("16", IsPermission))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }


            ViewBag.Auth = auth;
            ViewBag.IsSample = IsSample;
            ViewBag.PH = "Add Item";
            ViewBag.BT = "Submit";

            if (itemId > 0)
            {
                ViewBag.PH = "Update Item";
                ViewBag.BT = "Update";
            }
            ViewBag.itemId = itemId;
            return View();
        }

        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "BindItemMasterList")]
        public ActionResult BindItemMasterList(string auth)
        {
            if (!HasPermission("16", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }
        public ActionResult BindItemMasterAgGrid(string auth)
        {
            if (!HasPermission("16", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "SaveItemMaster")]
        [HttpPost]
        public ActionResult SaveItemMaster(string auth, int itemId = 0)
        {
            ViewBag.Auth = auth;
            return View();
        }
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "GetItemMasterList")]
        [HttpGet]
        public ActionResult GetItemMasterList(string auth)
        {
            ViewBag.Auth = auth;
            return RedirectToAction("BindItemMasterList");
        }
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "ItemMasterDetById")]
        [HttpGet]
        public ActionResult ItemMasterDetById(string auth, int? itemId)
        {
            ViewBag.Auth = auth;
            if (itemId > 0)
            {
                ViewBag.itemId = itemId;
            }
            return View();
        }
        #endregion

        #region Inventory Process
        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "Inventory")]
        public ActionResult Inventory(string auth, int id = 0)
        {
            ViewBag.Auth = auth;
            ViewBag.MSAId = id;
            return View();
        }


        #endregion


        public ActionResult Grn(string auth)
        {
            //R - Read/View
            //M- Modify/Update
            //W-Add/Save
            //D- Delete or Active Deactivate
            //E- Export
            if (!HasPermission("20", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult CreateGrn(string auth, string id, string suppId, int? GateEntryId, string PageType)
        {
            //R - Read/View
            //M- Modify/Update
            //W-Add/Save
            //D- Delete or Active Deactivate
            //E- Export

            string actionCode = id == "0" || id == "" ? "W" : "M"; // Update if id present, else Add
            if (!HasPermission("20", actionCode))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.PoId = id;
            ViewBag.SuppId = suppId;
            ViewBag.GateEntryId = GateEntryId;
            ViewBag.PageType = PageType;
            return View();
        }

        public ActionResult ViewGrn(string auth, string id, int? isGRNApprove, int? IsGRNView, int ErpPartyId=0, int PAId=0, string PageType="")
        {
            if (!HasPermission("20", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }
            ViewBag.Auth = auth;
            ViewBag.PoId = id;
            ViewBag.isGRNApprove = isGRNApprove;
            ViewBag.IsGRNView = IsGRNView;
            ViewBag.ErpPartyId = ErpPartyId;
            ViewBag.PAId = PAId;
            ViewBag.PageType = PageType;
            return View();
        }

        public ActionResult GrnDocument(string auth, string id)
        {
            if (!HasPermission("20", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }
            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult ViewGRNApproval(string auth, string id, int? IsNotApprove)
        {

            ViewBag.Auth = auth;
            ViewBag.Edit_ID = id;
            ViewBag.IsNotApprove = IsNotApprove;
            return View();
        }

        [HttpPost]
        public JsonResult UploadItemMasterExcelFile(HttpPostedFileBase file)
        {
            var hData = new List<string> { "Item Code*", "Item Name*", "Item Description","Default Warehouse*", "HSN Code*", "Status*",
                                "Batch Applicable*","Category*" ,"Sub Category","Base UoM*","Alternate UoM*",
                                "Conversion Factor*","Tolerance %","Min Stock Level","Max Stock Level","Safety Stock Level","Preferred Supplier",
                                "Lead Time (in days)","Pack Size","Principle Brand Type","CGST*","SGST*","IGST*","OP_AMT",
                                "OP_QTY","PURCH_RATE","SALE_RATE"};

            List<ItemMaster> items = new List<ItemMaster>();
            if (file == null || file.ContentLength == 0)
            {
                return Json(new { success = false, message = "Please upload a valid Excel file!" });
            }

            List<List<string>> validRows = new List<List<string>>();

            try
            {
                using (var package = new ExcelPackage(file.InputStream))
                {
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial; // Required for EPPlus 5+

                    ExcelWorksheet worksheet = package.Workbook.Worksheets.FirstOrDefault();
                    if (worksheet == null || worksheet.Dimension == null)
                    {
                        return Json(new { success = false, message = "Invalid or empty Excel file!" });
                    }
                    // 5 MB = 5 * 1024 * 1024 bytes
                    int maxSize = 5 * 1024 * 1024;
                    if (file.ContentLength > maxSize)
                    {
                        return Json(new { success = false, message = "File size exceeds 5 MB limit." });
                    }
                    int rowCount = worksheet.Dimension.Rows;
                    int colCount = worksheet.Dimension.Columns;
                    bool exactMatch = false;
                    for (int row = 1; row <= rowCount; row++) // Assuming first row is header
                    {
                        List<string> rowData = new List<string>();

                        for (int col = 1; col <= colCount; col++)
                        {
                            var cellValue = worksheet.Cells[row, col].Text.Trim();
                            rowData.Add(cellValue);
                        }
                        exactMatch = hData.SequenceEqual(rowData); // false
                        break;
                    }
                    if (exactMatch == true)
                    {
                        // Read Excel rows
                        for (int row = 2; row <= rowCount; row++) // Assuming first row is header
                        {
                            List<string> rowData = new List<string>();
                            bool isEmptyRow = true;

                            for (int col = 1; col <= colCount; col++)
                            {
                                var cellValue = worksheet.Cells[row, col].Text.Trim();
                                rowData.Add(cellValue);

                                if (!string.IsNullOrEmpty(cellValue))
                                {
                                    isEmptyRow = false;
                                }
                            }

                            // Only add non-empty rows
                            if (!isEmptyRow)
                            {
                                //validRows.Add(rowData);
                                ItemMaster emp = new ItemMaster
                                {
                                    ID = 0,
                                    ITEM_CODE = rowData[0].Trim(),
                                    ITEM_NAME = rowData[1].Trim(),
                                    DESCRIPTION = rowData[2].Trim(),
                                    WAREHOUSE_ID = rowData[3].Trim(),
                                    HSN_ID = rowData[4].Trim(),
                                    STATUS = rowData[5].Trim(),
                                    BATCH_APPLICABLE = rowData[6].Trim(),
                                    CATEGORY_ID = rowData[7].Trim(),
                                    SUBCATEGORY_ID = rowData[8].Trim(),
                                    STOCK_UNIT_ID = rowData[9].Trim(),
                                    ALTERNATE_UNIT_TYPE = rowData[10].Trim(),
                                    CONVERSION_FACTOR = rowData[11].Trim(),
                                    TAX_CODE_ID = "0",// worksheet.Cells[row, 13].Text.Trim(),
                                    TOLERANCE = rowData[12].Trim(),
                                    MIN_STOCK_LEVEL = rowData[13].Trim(),
                                    MAX_STOCK_LEVEL = rowData[14].Trim(),
                                    SAFETY_STOCK_LEVEL = rowData[15].Trim(),
                                    PREFFERED_SUPPLIER = rowData[16].Trim(),
                                    LEAD_TIME = rowData[17].Trim(),
                                    PACK_SIZE = rowData[18].Trim(),
                                    BRAND_TYPE_Id = rowData[19].Trim(),
                                    ITEM_TYPE = "I",
                                    CGST = rowData[20].Trim(),
                                    SGST = rowData[21].Trim(),
                                    IGST = rowData[22].Trim(),
                                    CGST_Name = "CGST",
                                    SGST_Name = "SGST",
                                    IGST_Name = "IGST",
                                    InvalidIGST = ValidateGST(rowData[20].Trim(), rowData[21].Trim(), rowData[22].Trim()) == false ? "" : "Okay",
                                    OP_AMT = rowData[23].Trim(),
                                    OP_QTY = rowData[24].Trim(),
                                    PURCH_RATE = rowData[25].Trim(),
                                    SALE_RATE = rowData[26].Trim()
                                };
                                items.Add(emp);
                            }
                        }
                    }
                }

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                serializer.MaxJsonLength = int.MaxValue; // Set to the maximum allowed value
                string jsonData = serializer.Serialize(items);
                string compressedJson = Convert.ToBase64String(Encoding.UTF8.GetBytes(jsonData));
                var Result = new JsonResult
                {
                    Data = compressedJson,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = int.MaxValue,

                };
                return Result;

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error processing file: " + ex.Message });
            }
        }

        public bool ValidateGST(string CGST, string SGST, string IGST)
        {
            // Regex to extract numeric values
            Match matchCGST = Regex.Match(CGST, @"\d+(\.\d+)?");
            Match matchSGST = Regex.Match(SGST, @"\d+(\.\d+)?");
            Match matchIGST = Regex.Match(IGST, @"\d+(\.\d+)?");

            if (matchCGST.Success && matchSGST.Success && matchIGST.Success)
            {
                decimal cgstValue = Convert.ToDecimal(matchCGST.Value);
                decimal sgstValue = Convert.ToDecimal(matchSGST.Value);
                decimal igstValue = Convert.ToDecimal(matchIGST.Value);

                return cgstValue + sgstValue == igstValue;
            }

            return false; // In case any value is missing or doesn't match the pattern
        }
        [HttpPost]


        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "StockAdjustment")]
        public ActionResult StockAdjustment(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }

        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "StocksAdjustment")]
        public ActionResult StocksAdjustment(string auth)
        {
            ViewBag.Auth = auth;            

            return View();
        }

        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "StockTransfer")]
        public ActionResult StockTransfer(string auth)
        {

            //string actionCode = id == "0" || id == "" ? "W" : "M"; // Update if id present, else Add
            if (!HasPermission("31", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "Aggrid")]
        public ActionResult Aggrid(string auth)
        {
            return View();
        }

        //[CustomAuthorize(Area = "MaterialManagement", Controller = "Material", Action = "GateEntry")]
        public ActionResult GateEntry(string auth)
        {
            if (!HasPermission("19", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult ViewGateEntry(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }
        public ActionResult EditGateEntry(string auth, int? itemId, int? viewGateEntry)
        {

            if (!HasPermission("19", "M"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }


            ViewBag.Auth = auth;
            ViewBag.itemId = itemId;
            ViewBag.viewGateEntry = viewGateEntry;
        
            return View();
        }

        public ActionResult CreateGateEntry(string auth)
        {


            if (!HasPermission("19", "W"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        [HttpPost]
        public JsonResult BulkUploadVendors(HttpPostedFileBase file)
        {

            if (file == null || file.ContentLength == 0)
                return Json(new { success = false, message = "No file uploaded." });

            try
            {

                var vendors = ReadVendorsFromExcel(file);

                // Save vendors to the database (Implement the saving logic here)

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                serializer.MaxJsonLength = int.MaxValue; // Set to the maximum allowed value
                string jsonData = serializer.Serialize(vendors);
                string compressedJson = Convert.ToBase64String(Encoding.UTF8.GetBytes(jsonData));
                var Result = new JsonResult
                {
                    Data = compressedJson,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = int.MaxValue,

                };
                return Result;
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        private List<Vendor> ReadVendorsFromExcel(HttpPostedFileBase file)
        {
            var hData = new List<string> { "BP Name*", "BP Type*","Phone Number", "Email Id", "GST Number",
                                           "PAN Number","TAN Number" ,"Address Line 1*","Address Line 2*","Pincode*",
                                           "City*","State*","Country*","Address Line 1*","Address Line 2*","Pincode*",
                                           "City*","State*","Country*","Contact Person","Phone Number","Email Id","Contact Person","Phone Number","Email Id",
                                           "Payment Terms*","Default Currency*","Lead Source*","NBD*","CRR*","Material Category*","MSME","Client Brand Type*","Brand Name"};
            var vendors = new List<Vendor>();
            bool exactMatch = false;
            using (var package = new ExcelPackage(file.InputStream))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0]; // Read the first sheet
                int rowCount = worksheet.Dimension.Rows;
                int colCount = worksheet.Dimension.Columns;
                for (int row = 2; row <= rowCount; row++) // Assuming first row is header
                {
                    List<string> rowData = new List<string>();

                    for (int col = 1; col <= colCount; col++)
                    {
                        var cellValue = worksheet.Cells[row, col].Text.Trim();
                        rowData.Add(cellValue);
                    }
                    exactMatch = hData.SequenceEqual(rowData); // false
                    break;
                }
                if (exactMatch == true)
                {
                    for (int row = 3; row <= rowCount; row++) // Assuming first row is header
                    {
                        var vendor = new Vendor
                        {
                            ID = 0,
                            BPCode = "",
                            BPName = worksheet.Cells[row, 1].Text,
                            BPType = worksheet.Cells[row, 2].Text,
                            PhoneNumber = worksheet.Cells[row, 3].Text,
                            EmailId = worksheet.Cells[row, 4].Text,
                            GSTNumber = worksheet.Cells[row, 5].Text,
                            PANNumber = worksheet.Cells[row, 6].Text,
                            TANNumber = worksheet.Cells[row, 7].Text,
                            Billing1AddressLine1 = worksheet.Cells[row, 8].Text,
                            Billing1AddressLine2 = worksheet.Cells[row, 9].Text,
                            Billing1Pincode = worksheet.Cells[row, 10].Text,
                            Billing1City = worksheet.Cells[row, 11].Text,
                            Billing1State = worksheet.Cells[row, 12].Text,
                            Billing1Country = worksheet.Cells[row, 13].Text,
                            Shipping2AddressLine1 = worksheet.Cells[row, 14].Text,
                            Shipping2AddressLine2 = worksheet.Cells[row, 15].Text,
                            Shipping2Pincode = worksheet.Cells[row, 16].Text,
                            Shipping2City = worksheet.Cells[row, 17].Text,
                            Shipping2State = worksheet.Cells[row, 18].Text,
                            Shipping2Country = worksheet.Cells[row, 19].Text,
                            Contact1Person1 = worksheet.Cells[row, 20].Text,
                            Contact1PhoneNumber1 = worksheet.Cells[row, 21].Text,
                            Contact1EmailId1 = worksheet.Cells[row, 22].Text,
                            Contact2Person2 = worksheet.Cells[row, 23].Text,
                            Contact2PhoneNumber2 = worksheet.Cells[row, 24].Text,
                            Contact2EmailId2 = worksheet.Cells[row, 25].Text,
                            PaymentTerms = worksheet.Cells[row, 26].Text,
                            DefaultCurrency = worksheet.Cells[row, 27].Text,
                            LeadSource = worksheet.Cells[row, 28].Text,
                            NBD = worksheet.Cells[row, 29].Text,
                            CRR = worksheet.Cells[row, 30].Text,
                            MaterialCategory = worksheet.Cells[row, 31].Text,
                            MSME = worksheet.Cells[row, 32].Text,
                            ClientBrandType = worksheet.Cells[row, 33].Text,
                            BrandName = worksheet.Cells[row, 34].Text
                        };

                        vendors.Add(vendor);
                    }
                }
            }
            return vendors;
        }

        public ActionResult StockStatement(string auth)
        {
            ViewBag.Auth = auth;
            ViewBag.RptType = "Stock Statement Rpt";
            return View();
        }
        public ActionResult StockLedger(string auth, int itemId = 0)
        {
            ViewBag.Auth = auth;
            ViewBag.ItemId = itemId;
            ViewBag.RptType = "Stock Ledger Rpt";
            return View();
        }

        public ActionResult IndentShortClose(string auth)
        {
            if (!HasPermission("54", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult PurchaseOrderShortClose(string auth)
        {

            if (!HasPermission("55", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult PurchaseReturns(string auth)
        {
            if (!HasPermission("21", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult PurchaseReturnsApproval(string auth)
        {
            if (!HasPermission("68", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }


        public ActionResult ViewPurchaseReturnsApproval(string auth, string id)
        {
            if (!HasPermission("68", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.Id = id;
            return View();
        }

        public ActionResult DebitNote(string auth, string ids)
        {
            ViewBag.Auth = auth;
            ViewBag.Ids = ids;
            return View();
        }

        public ActionResult CreateDebitNote(string auth, string ids, string id, int? isView)
        {
            ViewBag.Auth = auth;
            ViewBag.Ids = ids;
            ViewBag.Id = string.IsNullOrEmpty(id) ? "0" : id;
            ViewBag.isView = isView;
            return View();
        }

        [HttpGet]
        //public ActionResult PrintPO(int POId)
        //{
        //    try
        //    {
        //        ReportDocument rd = new ReportDocument();

        //        string constring = clsDataBaseHelper.getConnectionStr();
        //        using (SqlConnection _sqlCon = new SqlConnection(constring))
        //        {
        //            _sqlCon.Open();

        //            using (SqlCommand _cmd = new SqlCommand("spu_ERPGetPurchaseOrderPrintNew", _sqlCon))
        //            {
        //                _cmd.CommandType = CommandType.StoredProcedure;
        //                _cmd.Parameters.AddWithValue("@POID", POId);

        //                SqlDataAdapter _sda = new SqlDataAdapter(_cmd);
        //                DataSet _dataSet = new DataSet();
        //                _sda.Fill(_dataSet);

        //                string _reportPath = Server.MapPath(@"~/CrystalReport/Purchase_Order.rpt");
        //                rd.Load(_reportPath);
        //                rd.SetDataSource(_dataSet.Tables[0]);

        //                Stream stream = rd.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
        //                stream.Seek(0, SeekOrigin.Begin);

        //                string fileName = $"Purchase_Order_{POId}.pdf";
        //                return File(stream, "application/pdf", fileName);
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return new HttpStatusCodeResult(500, "Error generating report: " + ex.Message);
        //    }
        //}



        public ActionResult PrintPO(int POId, int PONo)
        {

            if (!HasPermission("18", "E"))
            {
                // No need for HttpContext.Current
                string qString = Request.QueryString["auth"];

                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString });
            }

            try
            {
                ReportDocument rd = new ReportDocument();
                string reportPath = Server.MapPath("~/CrystalReport/Purchase_Order.rpt");
                rd.Load(reportPath);

                // Apply DB login to main report
                ApplyLogonInfo(rd);

                // Set main report parameter
                rd.SetParameterValue("@POId", POId);

                // Apply login info and set param for subreports
                string[] subreports = { "other" }; // Add more subreports if needed
                foreach (string subName in subreports)
                {
                    ReportDocument sub = rd.OpenSubreport(subName);
                    ApplyLogonInfo(sub);

                    rd.SetParameterValue("@POId", POId, subName);
                }

                // Export to disk
                string fileName = $"Purchase_Order_{PONo}.pdf";
                string exportPath = Server.MapPath("~/Attachments/PDF/" + fileName);

                if (System.IO.File.Exists(exportPath))
                    System.IO.File.Delete(exportPath);

                rd.ExportToDisk(ExportFormatType.PortableDocFormat, exportPath);

                if (rd != null) { rd.Close(); rd.Dispose(); }

                // Return the file
                return File(exportPath, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(500, "Error generating report: " + ex.Message);
            }
        }


        public ActionResult PrintDebitNote(int POR_Id, int DebitDocNo)
        {

            if (!HasPermission("63", "E"))
            {
                // No need for HttpContext.Current
                string qString = Request.QueryString["auth"];

                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString });
            }

            try
            {
                ReportDocument rd = new ReportDocument();
                string reportPath = Server.MapPath("~/CrystalReport/Debitnote.rpt");
                rd.Load(reportPath);

                // Apply DB login to main report
                ApplyLogonInfo(rd);

                // Set main report parameter
                rd.SetParameterValue("@PORID", POR_Id);

                // Apply login info and set param for subreports
                //string[] subreports = { "other" }; // Add more subreports if needed
                //foreach (string subName in subreports)
                //{
                //    ReportDocument sub = rd.OpenSubreport(subName);
                //    ApplyLogonInfo(sub);

                //    rd.SetParameterValue("@PGRNId", POR_Id, subName);
                //}

                // Export to disk
                string fileName = $"Debit_Note{DebitDocNo}.pdf";
                string exportPath = Server.MapPath("~/Attachments/PDF/" + fileName);

                if (System.IO.File.Exists(exportPath))
                    System.IO.File.Delete(exportPath);

                rd.ExportToDisk(ExportFormatType.PortableDocFormat, exportPath);

                if (rd != null) { rd.Close(); rd.Dispose(); }
                // Return the file
                return File(exportPath, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                return new HttpStatusCodeResult(500, "Error generating report: " + ex.Message);
            }
        }

        public ActionResult PrintGRNOrder(int GRN_Id, int GRNDocNo)
        {

            if (!HasPermission("20", "E"))
            {
                // No need for HttpContext.Current
                string qString = Request.QueryString["auth"];

                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString });
            }

            try
            {
                ReportDocument rd = new ReportDocument();
                string reportPath = Server.MapPath("~/CrystalReport/PI.rpt");
                rd.Load(reportPath);

                // Apply DB login to main report
                ApplyLogonInfo(rd);

                // Set main report parameter
                rd.SetParameterValue("@pGRNID", GRN_Id);

                // Apply login info and set param for subreports
                //string[] subreports = { "other" }; // Add more subreports if needed
                //foreach (string subName in subreports)
                //{
                //    ReportDocument sub = rd.OpenSubreport(subName);
                //    ApplyLogonInfo(sub);

                //    rd.SetParameterValue("@GRN_Id", GRN_Id, subName);
                //}

                // Export to disk
                string fileName = $"GRN_Order{GRNDocNo}.pdf";
                string exportPath = Server.MapPath("~/Attachments/PDF/" + fileName);

                if (System.IO.File.Exists(exportPath))
                    System.IO.File.Delete(exportPath);

                rd.ExportToDisk(ExportFormatType.PortableDocFormat, exportPath);

                if (rd != null) { rd.Close(); rd.Dispose(); }

                // Return the file
                return File(exportPath, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                return new HttpStatusCodeResult(500, "Error generating report: " + ex.Message);
            }
           

        }

        private void ApplyLogonInfo(ReportDocument report)
        {
            string constr = clsDataBaseHelper.getConnectionStr();
            var builder = new System.Data.Common.DbConnectionStringBuilder { ConnectionString = constr };

            string servername = builder["Data Source"].ToString();
            string db = builder["Initial Catalog"].ToString();
            string userid = builder["User ID"].ToString();
            string pswd = builder.ContainsKey("Password") ? builder["Password"].ToString() : "";

            foreach (Table table in report.Database.Tables)
            {
                TableLogOnInfo tli = table.LogOnInfo;
                tli.ConnectionInfo.ServerName = servername;
                tli.ConnectionInfo.DatabaseName = db;
                tli.ConnectionInfo.UserID = userid;
                tli.ConnectionInfo.Password = pswd;
                table.ApplyLogOnInfo(tli);
            }
        }
    }
}