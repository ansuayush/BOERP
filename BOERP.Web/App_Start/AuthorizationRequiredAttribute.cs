using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Sahaj.API;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Text;
using Sahaj.API.BLL;
using Sahaj.API.Interface;
using System.Data;
using System.Web.Security;

namespace Sahaj.API
{
    public class AuthorizationRequiredAttribute : System.Web.Http.Filters.ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext filterContext)
        {

            string clientSecret = filterContext.Request.Headers.Contains("ClientSecret") ? filterContext.Request.Headers.GetValues("ClientSecret").FirstOrDefault() : null;        
            string clientAccessKey = filterContext.Request.Headers.Contains("ClientAccessKey") ? filterContext.Request.Headers.GetValues("ClientAccessKey").FirstOrDefault() : null;

            if (string.IsNullOrEmpty(clientSecret) && string.IsNullOrEmpty(clientAccessKey))
            {
                CommonMethods.Debug("Missing ClientSecret or ClientAccessKey.");               
                filterContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized)
                {
                    Content = new StringContent(
                         JsonConvert.SerializeObject(new { error = "Invalid ClientSecret or ClientAccessKey." }),
                         Encoding.UTF8,
                         "application/json"
                     )
                };
            }
            // Step 2: Validate the keys (use a secure method to retrieve and compare keys)
            var data = ValidateClientKeys(clientSecret, clientAccessKey);
            if (!data)
            {
                CommonMethods.Debug("Invalid ClientSecret: " + clientSecret + " or ClientAccessKey:" + clientAccessKey + ".");
                // Set the response to 401 Unauthorized
                filterContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized)
                {
                    Content = new StringContent(
                         JsonConvert.SerializeObject(new { error = "Invalid ClientSecret or ClientAccessKey." }),
                         Encoding.UTF8,
                         "application/json"
                     )
                };

            }
             


            base.OnActionExecuting(filterContext);



        }
        private bool ValidateClientKeys(string clientSecret, string clientAccessKey)
        {

            ICommon _iCommon = new CommonBLL();
            var data = _iCommon.ValidateClientKeys(clientSecret, clientAccessKey);
          
            return data;
        }


    }
}