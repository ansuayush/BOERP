
 
using System;

using System.Collections.Generic;
using System.Configuration;
using System.Linq;

using System.Net.Http;

using System.Net.Http.Headers;

using System.Text;

using System.Threading.Tasks;



namespace SahajFramework.Service

{

    public class CommonService 
    {

        public static HttpClient GetHttpClient()
        {
            string Auth = clsApplicationSetting.GetSessionValue("Auth");
            string clientSecret = Constants.clientSecret;
            string clientAccessKey = Constants.clientAccessKey;

            HttpClientHandler handler = new HttpClientHandler()
            {

                PreAuthenticate = true,

                UseDefaultCredentials = true,

                UseProxy = false,

                ClientCertificateOptions = ClientCertificateOption.Manual

            };

            var client = new HttpClient(handler, false)

            {

                BaseAddress = new Uri(ConfigurationManager.AppSettings["APIURL"].ToString()),
                Timeout = TimeSpan.FromMinutes(30)

            };

            client.DefaultRequestHeaders.Clear();

            client.DefaultRequestHeaders.Add("Auth", Auth);
            client.DefaultRequestHeaders.Add("clientSecret", clientSecret);
            client.DefaultRequestHeaders.Add("clientAccessKey", clientAccessKey);

            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            return client;

        }



    }

}