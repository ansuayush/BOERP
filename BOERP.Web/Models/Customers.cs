using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BOERP.Web.Models
{
    public class Customer
    {
        public string CustomerID { get; set; }
        public string CompanyName { get; set; }
        public string PhoneNumber { get; set; }
        public string EmailId { get; set; }
        public string GSTNumber { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Pincode { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PaymentTerms { get; set; }
        public string BrandType { get; set; }
        public string DefaultCurrency { get; set; }
        public string LeadSource { get; set; }
        public string NBD { get; set; }
        public string CRR { get; set; }
        public List<ContactPerson> ContactPersons { get; set; } = new List<ContactPerson>();
    }

    public class ContactPerson
    {
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string EmailId { get; set; } = string.Empty;
    }
}