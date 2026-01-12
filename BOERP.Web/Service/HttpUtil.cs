using Newtonsoft.Json;

using System;

using System.Collections;

using System.Collections.Generic;

using System.Data;

using System.Linq;

using System.Net.Http;

using System.Text;

using System.Threading.Tasks;

using System.Web;
using System.Web.Script.Serialization;

namespace SahajFramework.Service
{

    public static class DataSetExt

    {

        public static string GetJSON(this DataSet ds)
        {

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            ArrayList root = new ArrayList();
            List<Dictionary<string, object>> table;
            Dictionary<string, object> data;
            foreach (DataTable dt in ds.Tables)
            {

                table = new List<Dictionary<string, object>>();

                foreach (DataRow dr in dt.Rows)

                {

                    data = new Dictionary<string, object>();

                    foreach (DataColumn col in dt.Columns)

                    {

                        data.Add(col.ColumnName, dr[col]);

                    }

                    table.Add(data);

                }

                root.Add(table);

            }



            return serializer.Serialize(root);

        }

    }
    public class HttpUtil
    {



        public static readonly string SUCESS_SAVE_MESSAGE = "Successfully Saved.";

        public static readonly string SUCESSS_DELETE_MESSAGE = "Successfully Deleted!";

        public static readonly string SUCESS_UPDATE_MESSAGE = "Successfully Updated!";



        public static async Task<HttpCustomResponse<string>> PostAsyncDataSetReturn<T>(HttpContent collection, String url, bool addSaveMessage)

        {

            string message = null;

            if (addSaveMessage)

                message = SUCESS_SAVE_MESSAGE;

            using (var client = CommonService.GetHttpClient())

            {

                try

                {

                    var Response = await client.PostAsync(url, collection);

                    var response = new HttpCustomResponse<string>(Response, message);



                    if (Response.IsSuccessStatusCode)

                    {

                        //response.data = JsonConvert.DeserializeObject<T>(Response.Content.ReadAsStringAsync().Result);

                        DataSet ds = JsonConvert.DeserializeObject<DataSet>(Response.Content.ReadAsStringAsync().Result);

                        response.data = ds.GetJSON();

                    }



                    return response;



                }

                catch (Exception ex)

                {



                    return new HttpCustomResponse<string>(ex);

                }

            }

        }





        public static async Task<HttpCustomResponse<T>> PostAsync<T>(HttpContent collection, String url, bool addSaveMessage)

        {

            string message = null;

            if (addSaveMessage)

                message = SUCESS_SAVE_MESSAGE;

            using (var client = CommonService.GetHttpClient())

            {

                try

                {

                    var Response = await client.PostAsync(url, collection);

                    var response = new HttpCustomResponse<T>(Response, message);

                    if (Response.IsSuccessStatusCode)
                    {

                        response.data = JsonConvert.DeserializeObject<T>(Response.Content.ReadAsStringAsync().Result);

                    }


                    return response;



                }

                catch (Exception ex)

                {



                    return new HttpCustomResponse<T>(ex);

                }

            }

        }

        public static HttpCustomResponse<T> PostAsyncResult<T>(HttpContent collection, String url, bool addSaveMessage)

        {

            string message = null;

            if (addSaveMessage)

                message = SUCESS_SAVE_MESSAGE;

            using (var client = CommonService.GetHttpClient())

            {

                try

                {

                    var Response = client.PostAsync(url, collection).Result;

                    var response = new HttpCustomResponse<T>(Response, message);



                    if (Response.IsSuccessStatusCode)

                    {

                        response.data = JsonConvert.DeserializeObject<T>(Response.Content.ReadAsStringAsync().Result);

                    }



                    return response;



                }

                catch (Exception ex)

                {



                    return new HttpCustomResponse<T>(ex);

                }

            }

        }







        public static async Task<HttpCustomResponse<T>> PutAsync<T>(HttpContent content, string url, string msg)

        {

            try

            {

                using (var client = CommonService.GetHttpClient())

                {

                    var Response = await client.PutAsync(url, content);

                    var response = new HttpCustomResponse<T>(Response, msg);



                    if (Response.IsSuccessStatusCode)

                    {

                        response.data = JsonConvert.DeserializeObject<T>(Response.Content.ReadAsStringAsync().Result);

                    }



                    return response;

                }

            }

            catch (Exception ex)

            {

                return new HttpCustomResponse<T>(ex);

            }

        }

        public static async Task<HttpCustomResponse<T>> DeleteAsync<T>(String url, bool addMessage)

        {

            string message = null;

            if (addMessage)

                message = SUCESSS_DELETE_MESSAGE;

            try

            {

                using (var client = CommonService.GetHttpClient())

                {

                    var Response = await client.DeleteAsync(url);

                    var response = new HttpCustomResponse<T>(Response, message);

                    if (Response.IsSuccessStatusCode)

                    {

                        response.data = JsonConvert.DeserializeObject<T>(Response.Content.ReadAsStringAsync().Result);

                    }



                    return response;





                }

            }

            catch (Exception ex)

            {

                return new HttpCustomResponse<T>(ex);

            }

        }






 
        
        public static async Task<HttpCustomResponse<string>> GetAsyncDataSet<T>(string url)

        {

            try

            {

                using (var client = CommonService.GetHttpClient())

                {

                    var Response = await client.GetAsync(url);

                    var response = new HttpCustomResponse<string>(Response, null);

                    if (Response.IsSuccessStatusCode)

                    {

                        DataSet ds = JsonConvert.DeserializeObject<DataSet>(Response.Content.ReadAsStringAsync().Result);

                        response.data = ds.GetJSON();

                    }



                    return response;

                }

            }

            catch (Exception ex)

            {

                return new HttpCustomResponse<string>(ex);

            }

        }

        public static async Task<HttpCustomResponse<T>> GetAsync<T>(string url)
        {

            try

            {

                using (var client = CommonService.GetHttpClient())

                {

                    var Response = await client.GetAsync(url);

                    var response = new HttpCustomResponse<T>(Response, null);

                    if (Response.IsSuccessStatusCode)

                    {

                        response.data = JsonConvert.DeserializeObject<T>(Response.Content.ReadAsStringAsync().Result);

                    }



                    return response;

                }

            }

            catch (Exception ex)

            {

                return new HttpCustomResponse<T>(ex);

            }

        }



        public static async Task<HttpCustomResponse<T>> GetById<T>(int id, string url)

        {

            return await GetAsync<T>(url + "?id=" + id);

        }

        public static async Task<HttpCustomResponse<T>> PostUploadDocument<T>(String url, byte[] fileBytes, HttpPostedFileBase file)
        {
            using (var client = CommonService.GetHttpClient())
            {
                using (var content = new MultipartFormDataContent())
                {

                    file.InputStream.Read(fileBytes, 0, fileBytes.Length);
                    var fileContent = new ByteArrayContent(fileBytes);
                    fileContent.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment")
                    {
                        FileName = file.FileName
                    };
                    content.Add(fileContent);
                    var Response = await client.PostAsync(url, content);
                    var response = new HttpCustomResponse<T>(Response, null);
                    if (Response.IsSuccessStatusCode)
                    {
                        response.data = JsonConvert.DeserializeObject<T>(Response.Content.ReadAsStringAsync().Result);

                    }
                    return response;

                }
            }
        }


        public static async Task<HttpCustomResponse<T>> PostAsync<T>(HttpContent collection, String url)

        {

            using (var client = CommonService.GetHttpClient())

            {

                try

                {

                    var Response = await client.PostAsync(url, collection);

                    var response = new HttpCustomResponse<T>(Response, null);

                    if (Response.IsSuccessStatusCode)

                    {

                        response.data = JsonConvert.DeserializeObject<T>(Response.Content.ReadAsStringAsync().Result);

                    }



                    return response;



                }

                catch (Exception ex)

                {



                    return new HttpCustomResponse<T>(ex);

                }

            }

        }

   

        internal static Task<HttpCustomResponse<T>> GetAsync<T>(object p)

        {

            throw new NotImplementedException();

        }

        internal static Task<HttpCustomResponse<T>> PostListAsync<T>(HttpContent collection, object gENERIC_API_GETRECORDS)
        {
            throw new NotImplementedException();
        }
    }



}