using System;

using System.Collections.Generic;

using System.Diagnostics;

using System.Linq;

using System.Net;

using System.Net.Http;

using System.Text;

using System.Threading.Tasks;



namespace SahajFramework.Service

{

    public class HttpCustomResponse<T>

    {



        private const String ERROR_PREFIX = "We are sorry something went wrong.Please provide following to tech support :  ";

        public bool IsSuccessStatusCode { get; private set; }



        public HttpStatusCode StatusCode { get; private set; }

        public String ReasonPhrase { get; private set; }

        public String RequestMessage { get; private set; }

        public String ErrorMessage { get; private set; }
        public T data { get; set; }
        public T Status { get; set; }

        public String Message;

        public HttpCustomResponse(Exception exception)

        {

            this.IsSuccessStatusCode = false;



            StringBuilder builder = new StringBuilder();



            builder.AppendLine(exception.Message);

            while (exception.InnerException != null)

            {

                exception = exception.InnerException;

                builder.AppendLine(exception.Message);

            }



            this.ErrorMessage = ERROR_PREFIX + builder.ToString();

            Debug.WriteLine(ErrorMessage);

        }



        public HttpCustomResponse(HttpResponseMessage response, String message)

        {

            this.IsSuccessStatusCode = response.IsSuccessStatusCode;

            if (!this.IsSuccessStatusCode)

            {

                //if (response.ReasonPhrase != null && response.ReasonPhrase.CompareTo("Bad Request") ==0)

                //{

                string content = response.Content.ReadAsStringAsync().Result;



                if (!String.IsNullOrEmpty(content))

                {

                    this.ReasonPhrase = response.ReasonPhrase;

                    this.RequestMessage = response.RequestMessage.RequestUri.AbsoluteUri;

                    this.StatusCode = response.StatusCode;

                    if (String.IsNullOrEmpty(content))

                    {

                        ErrorMessage = String.Format("{0} Reason [{1}], RequestMessage :[{2}]", ERROR_PREFIX, this.ReasonPhrase, this.RequestMessage);

                    }

                    else

                    {

                        ErrorMessage = String.Format("{0} Reason [{1}], RequestMessage :[{2}]", ERROR_PREFIX, content, this.RequestMessage);

                    }



                    Debug.WriteLine(ErrorMessage);

                }

                else

                {

                    this.ReasonPhrase = response.ReasonPhrase;

                    this.RequestMessage = response.RequestMessage.RequestUri.AbsoluteUri;

                    this.StatusCode = response.StatusCode;

                    ErrorMessage = String.Format("{0} Reason [{1}], RequestMessage :[{2}]", ERROR_PREFIX, this.ReasonPhrase, this.RequestMessage);

                }



            }

            this.Message = message;



        }





    }



}