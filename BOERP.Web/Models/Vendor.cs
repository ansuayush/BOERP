using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BOERP.Web.Models
{
    public class Vendor
    {
        public int ID { get; set; }
        public string BPCode { get; set; }
        public string BPName { get; set; }
        public string BPType { get; set; }
        public string PhoneNumber { get; set; }
        public string EmailId { get; set; }
        public string GSTNumber { get; set; }
        public string PANNumber { get; set; }
        public string TANNumber { get; set; }

        // Primary Address
        public string Billing1AddressLine1 { get; set; }
        public string Billing1AddressLine2 { get; set; }
        public string Billing1Pincode { get; set; }
        public string Billing1City { get; set; }
        public string Billing1State { get; set; }
        public string Billing1Country { get; set; }

        // Secondary Address
        public string Shipping2AddressLine1 { get; set; }
        public string Shipping2AddressLine2 { get; set; }
        public string Shipping2Pincode { get; set; }
        public string Shipping2City { get; set; }
        public string Shipping2State { get; set; }
        public string Shipping2Country { get; set; }

        // Contact Persons 1
        public string Contact1Person1 { get; set; }
        public string Contact1PhoneNumber1 { get; set; }
        public string Contact1EmailId1 { get; set; }
        // Contact Persons 2
        public string Contact2Person2 { get; set; }
        public string Contact2PhoneNumber2 { get; set; }
        public string Contact2EmailId2 { get; set; }

        // Additional Details
        public string PaymentTerms { get; set; }
        public string DefaultCurrency { get; set; }
        public string LeadSource { get; set; }
        public string NBD { get; set; }
        public string CRR { get; set; }
        public string MaterialCategory { get; set; }
        public string MSME { get; set; }
        public string ClientBrandType { get; set; }
        public string BrandName { get; set; }
    }

    public class VendorAddress
    {
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Pincode { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
    }

}