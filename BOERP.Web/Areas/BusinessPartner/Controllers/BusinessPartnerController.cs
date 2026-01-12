using BOERP.Web.Controllers;
using BOERP.Web.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using OfficeOpenXml.FormulaParsing.LexicalAnalysis;
using System.Text;
using System.Web.UI;

namespace BOERP.Web.Areas.BusinessPartner.Controllers
{

    [CustomAuthorizeAttribute]
    public class BusinessPartnerController : BaseController
    {
        // GET: BusinessPartner/ManagePartner
        public ActionResult Index(string auth)
        {
            ViewBag.Auth = auth;
            return View();
        }
        #region Customer Process
        public ActionResult CustomerList(string auth)
        {

            if (!HasPermission("50", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult AddCustomer(string auth,int custid)
        {
            string actionCode = custid > 0 ? "M" : "W";
            if (!HasPermission("50", actionCode))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.BT = "Submit";
            if (custid > 0)
            {
                ViewBag.BT = "Update";
            }
            ViewBag.CustId = custid;
            return View();
        }

        public ActionResult ViewCustomer(string auth,int id = 0, int status=0, int PAId=0)
        {
            if (!HasPermission("50", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.CustId = id;
            ViewBag.PAId = PAId;
            ViewBag.PageStatus = "View Customer";
            ViewBag.PartyStatus = status;
            return View();
        }

        #endregion

        #region Vendor Process
        public ActionResult Vendor(string auth)
        {
            if (!HasPermission("51", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }

        public ActionResult CreateVendor(string auth, int id = 0, int status=0)
        {
            string actionCode = id > 0 ? "M" : "W";
            if (!HasPermission("51", actionCode))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }
            
            ViewBag.Auth = auth;
            ViewBag.PH = "Add New Vendor";
            ViewBag.BT = "Submit";

            if (id > 0)
            {
                ViewBag.PH = "Update Vendor";
                ViewBag.PageStatus = "Edit Vendor";
                ViewBag.BT = "Update";

            }
            ViewBag.VendorId = id;
            ViewBag.Status = status;

            return View();
        }

        public ActionResult ViewVendor(string auth, int id = 0, int status=0, int PAId=0)
        {
            if (!HasPermission("51", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.VendorId = id;
            ViewBag.PAId = PAId;
            ViewBag.PageStatus = "View Vendor";
            ViewBag.PartyStatus = status;
            return View();
        }


        public ActionResult ViewVendorItem(string auth)
        {
            if (!HasPermission("51", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view

            }
            ViewBag.Auth = auth;
            return View();
        }
        #endregion
        [HttpPost]
        public JsonResult BulkUploadCustomers(HttpPostedFileBase file)
        {
            if (file == null || file.ContentLength == 0)
                return Json(new { success = false, message = "No file uploaded." });

            try
            {
                var customers = ReadCustomersFromExcel(file);

                // Save customers to the database (to be implemented)

                return Json(new { success = true, message = "File processed successfully.", data = customers });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        private List<Customer> ReadCustomersFromExcel(HttpPostedFileBase file)
        {
            var customers = new List<Customer>();

            using (var package = new ExcelPackage(file.InputStream))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0]; // Read the first sheet
                int rowCount = worksheet.Dimension.Rows;

                for (int row = 2; row <= rowCount; row++) // Assuming first row is header
                {
                    var customer = new Customer
                    {
                        CustomerID = worksheet.Cells[row, 1].Text,
                        CompanyName = worksheet.Cells[row, 2].Text,
                        PhoneNumber = worksheet.Cells[row, 3].Text,
                        EmailId = worksheet.Cells[row, 4].Text,
                        GSTNumber = worksheet.Cells[row, 5].Text,
                        AddressLine1 = worksheet.Cells[row, 6].Text,
                        AddressLine2 = worksheet.Cells[row, 7].Text,
                        Pincode = worksheet.Cells[row, 8].Text,
                        City = worksheet.Cells[row, 9].Text,
                        State = worksheet.Cells[row, 10].Text,
                        Country = worksheet.Cells[row, 11].Text,
                        PaymentTerms = worksheet.Cells[row, 12].Text,
                        BrandType = worksheet.Cells[row, 13].Text,
                        DefaultCurrency = worksheet.Cells[row, 14].Text,
                        LeadSource = worksheet.Cells[row, 15].Text,
                        NBD = worksheet.Cells[row, 16].Text,
                        CRR = worksheet.Cells[row, 17].Text,
                        ContactPersons = new List<ContactPerson>
                        {
                            new ContactPerson
                            {
                                Name = worksheet.Cells[row, 18].Text,
                                PhoneNumber = worksheet.Cells[row, 19].Text,
                                EmailId = worksheet.Cells[row, 20].Text
                            },
                            new ContactPerson
                            {
                                Name = worksheet.Cells[row, 21].Text,
                                PhoneNumber = worksheet.Cells[row, 22].Text,
                                EmailId = worksheet.Cells[row, 23].Text
                            }
                        }
                    };

                    customers.Add(customer);
                }
            }

            return customers;
        }

        [HttpPost]
        public async Task<JsonResult> SendOTPOnWhatsApp(string phoneNo)
        {
            try
            {
                // 1. Generate a 4-digit random OTP
                Random rnd = new Random();
                string otp = rnd.Next(1000, 9999).ToString();

                // 2. Get required data
               //  string mobileNo = clsApplicationSetting.GetSessionValue("ContactNumber");
                string productId = clsDataBaseHelper.fnGetFieldName("ERP_WhatsApp_Cred", "product_id");
                string token = clsDataBaseHelper.fnGetFieldName("ERP_WhatsApp_Cred", "token");
                string base_url = clsDataBaseHelper.fnGetFieldName("ERP_WhatsApp_Cred", "whatsapp_api");

                if (string.IsNullOrWhiteSpace(productId) || string.IsNullOrWhiteSpace(token))
                {
                    return Json(new { success = false, message = "Product ID or token not found." });
                }

                using (var client = new HttpClient())
                {
                    // 3. Get phone ID
                    string listUrl = $"{base_url}/{productId}/listphones?token={token}";
                    HttpResponseMessage listRes = await client.GetAsync(listUrl);
                    listRes.EnsureSuccessStatusCode();

                    string listJson = await listRes.Content.ReadAsStringAsync();
                    JArray phones = JArray.Parse(listJson);

                    if (phones == null || phones.Count == 0)
                        return Json(new { success = false, message = "Phone ID not found." });

                    long phoneId = phones[0]["id"]?.Value<long>() ?? 0;
                    if (phoneId == 0)
                        return Json(new { success = false, message = "Phone ID not found." });

                    // 4. Send OTP message
                    string sendUrl = $"{base_url}/{productId}/{phoneId}/sendMessage";
                    var payloadObj = new
                    {
                        to_number = phoneNo.StartsWith("+91") ? phoneNo : "+91" + phoneNo,
                        type = "text",
                        message = $"Your OTP for Customer Verification is {otp}",
                        typing = "typing",
                        duration = 2
                    };

                    string payloadJson = JsonConvert.SerializeObject(payloadObj);
                    var content = new StringContent(payloadJson, Encoding.UTF8, "application/json");
                    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                    client.DefaultRequestHeaders.Remove("x-maytapi-key");
                    client.DefaultRequestHeaders.Add("x-maytapi-key", token);

                    HttpResponseMessage sendRes = await client.PostAsync(sendUrl, content);
                    sendRes.EnsureSuccessStatusCode();
                }

                // 5. Return the OTP in response (You may also store it in session or DB)
                return Json(new { success = true, message = "OTP sent successfully.", otp = otp });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Failed to send OTP: {ex.Message}" });
            }
        }


        [HttpGet]
        public async Task<JsonResult> GetGstinDetails(string gstin)
        {
            try
            {
                string authToken = "";
                DateTime? tokenExpiry = Session["TokenExpiry"] as DateTime?;

                // 1. Check if token is expired or not present
                if (string.IsNullOrEmpty(Session["AuthToken"] as string) || tokenExpiry == null || DateTime.Now >= tokenExpiry)
                {
                    var authResult = await GetAuthToken();

                    if (authResult == null || authResult["status_cd"]?.ToString().ToLower() != "sucess")
                    {
                        return Json(new
                        {
                            status_cd = "0",
                            status_desc = "Failed to Authenticate details. AuthToken not verified!!!",
                            data = (object)null
                        }, JsonRequestBehavior.AllowGet);
                    }

                    // Extract token and expiry
                    var authData = authResult["data"];
                    authToken = authData["AuthToken"].ToString();
                    var expiryStr = authData["TokenExpiry"].ToString();

                    Session["AuthToken"] = authToken;
                    Session["TokenExpiry"] = DateTime.Parse(expiryStr);
                }
                else
                {
                    authToken = Session["AuthToken"].ToString();
                }

                // 2. Make the GSTIN details API call
              

                using (var client = new HttpClient())
                {
                    string base_url2 = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "base_url2");
                    string ip_address = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "ip_address");
                    string client_id = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "client_id");
                    string client_secret = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "client_secret");
                    string gstin1 = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "gstin");
                    string username = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "username");

                    string password = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "password");
                    string email = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "email");

                    // Required headers for authentication
                    //client.DefaultRequestHeaders.Add("Auth", "your_auth_token");
                    client.DefaultRequestHeaders.Add("ip_address", ip_address);
                    client.DefaultRequestHeaders.Add("client_id", client_id);
                    client.DefaultRequestHeaders.Add("client_secret", client_secret);
                    client.DefaultRequestHeaders.Add("gstin", gstin1);
                    client.DefaultRequestHeaders.Add("username", username);
                    client.DefaultRequestHeaders.Add("password", password);
                    client.DefaultRequestHeaders.Add("auth-token", authToken);

                    string gstinApiUrl = base_url2 + "?param1=" + gstin + "&email=" + email;

                    var response = await client.GetAsync(gstinApiUrl);
                    var content = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                       // var json = JObject.Parse(content);
                        return Json(content, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new
                        {
                            status_cd = "0",
                            status_desc = "GSTIN API failed: " + response.StatusCode,
                            data = (object)null
                        }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    status_cd = "0",
                    status_desc = "Exception occurred: " + ex.Message,
                    data = (object)null
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        private async Task<JObject> GetAuthToken()
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));


                string base_url1 = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "base_url1");
                string ip_address = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "ip_address");
                string client_id = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "client_id");
                string client_secret = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "client_secret");
                string gstin = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "gstin");
                string username = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "username");

                string password = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "password");
                string email = clsDataBaseHelper.fnGetFieldName("ERP_GSTVerifyAPIDet", "email");

                // Required headers for authentication
                //client.DefaultRequestHeaders.Add("Auth", "your_auth_token");
                client.DefaultRequestHeaders.Add("ip_address", ip_address);
                client.DefaultRequestHeaders.Add("client_id", client_id);
                client.DefaultRequestHeaders.Add("client_secret", client_secret);
                client.DefaultRequestHeaders.Add("gstin", gstin);
                client.DefaultRequestHeaders.Add("username", username);
                client.DefaultRequestHeaders.Add("password", password);
                // Auth URL with query parameter `a`
                string apiUrl = base_url1 + "?email=" + email;

                // Since it's a GET API with only headers and query, no body/payload is sent
                var response = await client.GetAsync(apiUrl);
                var result = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return JObject.Parse(result);
                }

                return null;
            }
        }




        public ActionResult VendorItems(string auth, int id = 0, int PAId = 0)
        {

            if (!HasPermission("50", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.VendorId = id;
            ViewBag.PAId = PAId;
            ViewBag.RecordType = "Vendor Item List";
            return View(); // new change for code latest not working
        }

        public ActionResult PurchaseOrders(string auth, int id = 0, int PAId = 0)
        {

            if (!HasPermission("50", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.VendorId = id;
            ViewBag.PAId = PAId;
            ViewBag.RecordType = "Vendor PO List";
            return View();
        }

        public ActionResult GRN(string auth, int id = 0, int PAId = 0)
        {

            if (!HasPermission("50", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.VendorId = id;
            ViewBag.PAId = PAId;
            ViewBag.RecordType = "Vendor GRN List";
            return View();
        }


        public ActionResult FinancialLedgers(string auth, int id=0, int PAId = 0)
        {

            if (!HasPermission("50", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.VendorId = id;
            ViewBag.PAId = PAId;
            ViewBag.RecordType = "Vendor Financial Ledgers List";
            return View();
        }
        public ActionResult CustSOItems(string auth, int id = 0, int PAId = 0)
        {

            if (!HasPermission("50", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.CustId = id;
            ViewBag.PAId = PAId;
            ViewBag.RecordType = "Cust Item List";
            return View();
        }

        public ActionResult CustFinancialLedgers(string auth, int id = 0, int PAId = 0)
        {

            if (!HasPermission("50", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.CustId = id;
            ViewBag.PAId = PAId;
            ViewBag.RecordType = "Cust Financial Ledgers List";
            return View();
        }

        public ActionResult CustSampleRecords(string auth, int id = 0, int PAId = 0)
        {

            if (!HasPermission("50", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.CustId = id;
            ViewBag.PAId = PAId;
            ViewBag.RecordType = "Cust Sample Records";
            return View();
        }

        public ActionResult CustPMInventory(string auth, int id = 0, int PAId = 0)
        {

            if (!HasPermission("50", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            ViewBag.CustId = id;
            ViewBag.PAId = PAId;
            ViewBag.RecordType = "Cust PM Inventory";
            return View();
        }
    }

}