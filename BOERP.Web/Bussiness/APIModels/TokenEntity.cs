using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sahaj.API.Model
{
    public class TokenEntity
    {

        public int tokenId { get; set; }

        public Int64 userId { get; set; }

        public string authToken { get; set; }

        public System.DateTime issuedOn { get; set; }

        public System.DateTime expiresOn { get; set; }

    }
}