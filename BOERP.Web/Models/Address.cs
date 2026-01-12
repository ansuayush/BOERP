using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class Address
    {
        public int RowNum { get; set; }
        public long? ID { get; set; }
        public long? TableID { get; set; }
        public string TableName { get; set; }
        public string Doctype { get; set; }
        [Required(ErrorMessage = "Lane Can't Blank")]
        public string lane1 { get; set; }
        public string lane2 { get; set; }
        [Required(ErrorMessage = "Country Can't Blank")]
        public long? CountryID { get; set; }
        [Required(ErrorMessage = "State Can't Blank")]
        public long? StateID { get; set; }
        [Required(ErrorMessage = "City Can't Blank")]
        public long? CityID { get; set; }
        public string phone_no { get; set; }
        public string Alt_No { get; set; }
        public string LandlineNo { get; set; }
        public string EmailID { get; set; }
        public string zip_code { get; set; }
        public string fax { get; set; }
        public string cell { get; set; }
        public bool IsActive { get; set; }
        public int? Priority { get; set; }
    }



    public class DonarAddress
    {
        public int RowNum { get; set; }
        public long? ID { get; set; }
        public long? TableID { get; set; }
        public string TableName { get; set; }
        public string Doctype { get; set; }
        public string lane1 { get; set; }
        public string lane2 { get; set; }
        public long? CountryID { get; set; }
        public string Country_Name { get; set; }
        public long? StateID { get; set; }
        public string State_Name { get; set; }
        public long? CityID { get; set; }
        public string City_Name { get; set; }
        public string phone_no { get; set; }
        public string AltPhone_no { get; set; }
        public string Alt_No { get; set; }
        public string LandlineNo { get; set; }
        public string EmailID { get; set; }
        public string zip_code { get; set; }
        public string fax { get; set; }
        public string cell { get; set; }
        public bool IsActive { get; set; }
        public int? Priority { get; set; }
    }
}