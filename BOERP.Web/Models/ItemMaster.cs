using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BOERP.Web.Models
{
    public class ItemMasterError
    {
        public string ITEM_CODE { get; set; }
        public string ITEM_NAME { get; set; }
        public string WAREHOUSE_ID { get; set; }
        public string STATUS { get; set; }
        public string HSN_ID { get; set; }
        public string BATCH_APPLICABLE { get; set; }
        public string CATEGORY_ID { get; set; }
        public string ALTERNATE_UNIT_TYPE { get; set; }
        public string STOCK_UNIT_ID { get; set; }
        public string TAX_CODE_ID { get; set; }
        public int ID { get; set; }

    }
    public class ItemMaster
    {
        public int ID
        {
            get; set;
        }
        public string ITEM_CODE
        {
            get; set;
        }
        public string ITEM_NAME
        {
            get; set;
        }
        public string HSN_ID
        {
            get; set;
        }
        public string STATUS
        {
            get; set;
        }
        public string DESCRIPTION
        {
            get; set;
        }
        public string WAREHOUSE_ID
        {
            get; set;
        }
        public string BATCH_APPLICABLE
        {
            get; set;
        }
        public string CATEGORY_ID
        {
            get; set;
        }
        public string SUBCATEGORY_ID
        {
            get; set;
        }
        public string STOCK_UNIT_ID
        {
            get; set;
        }
        public string ALTERNATE_UNIT_TYPE
        {
            get; set;
        }
        public string CONVERSION_FACTOR
        {
            get; set;
        }
        public string TAX_CODE_ID
        {
            get; set;
        }
        public string TOLERANCE
        {
            get; set;
        }
        public string MIN_STOCK_LEVEL
        {
            get; set;
        }
        public string MAX_STOCK_LEVEL
        {
            get; set;
        }
        public string SAFETY_STOCK_LEVEL
        {
            get; set;
        }
        public string PREFFERED_SUPPLIER
        {
            get; set;
        }
        public string LEAD_TIME
        {
            get; set;
        }
        public string BRAND_TYPE_Id
        {
            get; set;
        }
        public string PACK_SIZE
        {
            get; set;
        }
        public string ITEM_TYPE
        {
            get; set;
        }
        public string CGST
        {
            get; set;
        }
        public string SGST
        {
            get; set;
        }
        public string IGST
        {
            get; set;
        }
        public string CGST_Name
        {
            get; set;
        }
        public string SGST_Name
        {
            get; set;
        }
        public string IGST_Name
        {
            get; set;
        }
        public String InvalidIGST
        {
            get; set;
        }
        public String OP_AMT
        {
            get; set;
        }
        public String OP_QTY
        {
            get; set;
        }
        public String PURCH_RATE
        {
            get; set;
        }
        public String SALE_RATE
        {
            get; set;
        }
    }
}