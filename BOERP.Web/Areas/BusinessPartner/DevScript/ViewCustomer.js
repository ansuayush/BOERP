$(document).ready(function () {

    var custid = parseInt($("#hdnCustId").val());
    GetCustomerDetById(custid);

    var CustId = $('#hdnCustId').val();
    var PAId = $('#hdnPAId').val();
    var rptType = $("#hdnRecordType").val();
    if (PAId > 0 && rptType !== '') {
        if (rptType == "Cust Item List") {
            GetCustSaleOrderGrid(PAId);
        }
        else if (rptType == "Cust Financial Ledgers List") {
            GetCustFinLedgersList(PAId);
        }
        else if (rptType == "Cust Sample Records") {
            GetCustSampleRecords(CustId);
        }
        else {
            GetCustPMInventoryRecords(PAId);
        }

    }
    
});

let contactList = [];  // Initialize an empty array to hold all contacts
let maxPersonCount = 0; // Keep track of dynamic rows

var PartyStatus = 0;
var IsPartyVerified = 0;
 

function GetCustomerDetById(custid) {
    $("#customLoader").show();
    var id = custid;

    var model = {
        ID: id,
        Type: "Customer"
    };
    const jsonString = JSON.stringify(model);
    var ScreenID = "Customer_101";
     CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {

         console.log(response)

         
         $("#customLoader").hide();
        var tableData = response.data.data.Table;
        var tableData1 = response.data.data.Table1;
         var tableData2 = response.data.data.Table2;

         var cust_cc = tableData[0].Customer_CountryCode == null ? '91' : tableData[0].Customer_CountryCode;

        if (tableData && tableData.length > 0) {
            $("#hdnCustId").val(tableData[0].PartyTempId);
 
                $("#compCode").text(tableData[0].PA_Code);
                $("#compName").text(tableData[0].PA_Name);

                $("#emailId").text(tableData[0].Email);
                $('#custType').text(tableData[0].OtherType);
                $("#phoneNo").text('+' + + cust_cc + ' ' +  tableData[0].Phone);

                $("#gstIn").text(tableData[0].TAX_TAN2);
                $("#tanNo").text(tableData[0].TAX_TAN1);
                $("#panNo").text(tableData[0].TAX_PAN);

                $("#nbdUser").text(tableData[0].NBDUser);
                $("#crrUser").text(tableData[0].CRRUser);
                
                $("#contactName").text(tableData1[0].PersonName);
                $("#contactEmailId").text(tableData1[0].EmailId);
                $("#contactPhoneNo").text(tableData1[0].PhoneNo);

                $("#sAdd1").text(tableData[0].SHIP_ADD1);
                $("#sAdd2").text(tableData[0].SHIP_ADD2);
                $("#sCity").text(tableData[0].ShipCity);
                $("#sState").text(tableData[0].SStateCountryPin);

                $("#bAdd1").text(tableData[0].BILL_ADD1);
                $("#bAdd2").text(tableData[0].BILL_ADD2);
                $("#bCity").text(tableData[0].BillCity);
                $("#bState").text(tableData[0].BStateCountryPin);

                $('#chkSameAddress').prop('checked', tableData[0].IsAddressSame === 'Yes' ? true : false).trigger('change');

                $("#paymentTerms").text(tableData[0].PaymentTerms);
                $("#clientBrandType").text(tableData[0].ClientBrandType);
                $('#brandName').text(tableData[0].BrandName);
                $("#defaultCurrency").text(tableData[0].ERPCurrency);
                $("#leadSource").text(tableData[0].ERPLeadSource);

                //This code handle on ViewCustomer.cshtml
                //if (tableData[0].Status == 2) {
                //    $('#btnReject').hide();
                //    $('#btnApprove').hide();
                //}

                if (tableData1.length > 0) {
                    ViewVendorContactPersonList(tableData1);
                }

                if (tableData2.length >= 0) {
                    const shippingData = tableData2.filter(input => input.IsBillingAddress == 0);
                    const billingData = tableData2.filter(input => input.IsBillingAddress == 1);

                    $("#shippingAddressContainerView").empty();
                    $("#billingAddressContainerView").empty();

                    // Always add the default shipping address first
                    $("#shippingAddressContainerView").append(
                        generateAddressHtml("Default Shipping Address", tableData[0].SHIP_ADD1, tableData[0].SHIP_ADD2, tableData[0].ShipCity, tableData[0].SStateCountryPin)
                    );

                    // If multiple additional shipping addresses exist, show them
                    if (shippingData.length > 0) {
                        shippingData.forEach((item, index) => {
                            $("#shippingAddressContainerView").append(
                                generateAddressHtml(`Shipping Address ${index + 1}`, item.SHIP_ADD1, item.SHIP_ADD2, item.ShipCity, item.SStateCountryPin)
                            );
                        });
                    }

                    // Always add the default billing address first
                    $("#billingAddressContainerView").append(
                        generateAddressHtml("Default Billing Address", tableData[0].BILL_ADD1, tableData[0].BILL_ADD2, tableData[0].BillCity, tableData[0].BStateCountryPin)
                    );

                    // If multiple additional billing addresses exist, show them
                    if (billingData.length > 0) {
                        billingData.forEach((item, index) => {
                            $("#billingAddressContainerView").append(
                                generateAddressHtml(`Billing Address ${index + 1}`, item.BILL_ADD1, item.BILL_ADD2, item.BillCity, item.BStateCountryPin)
                            );
                        });
                    }
                }
          


        }
        else {
            console.error("Record not found..", error);
        }

    });
}

function ViewVendorContactPersonList(ContactPersonList) {
    let container = $('#contactInfoContainer');
    container.empty(); // Clear existing content

    ContactPersonList.forEach((contact, index) => {

        var person_cc = contact.CountryCode == null ? '91' : contact.CountryCode;



        var phone = '+' + person_cc + ' ' + contact.PhoneNo;

        let contactHtml = `
            <div class="col-lg-3 col-md-3 col-sm-6 form-group">
                <label>Contact Name</label>
                <p class="m-0">${contact.PersonName}</p>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-6 form-group">
                <label>Contact Number</label>
                <p class="m-0">${phone}</p>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-6 form-group">
                <label>Email ID</label>
                <p class="m-0">${contact.EmailId}</p>
            </div>
        `;

        if (index > 0) {
            contactHtml = `<div class="col-sm-12"><hr></div>` + contactHtml;
        }

        container.append(contactHtml);
    });
}

function generateAddressHtml(label, add1, add2, city, state) {
    return `
        <div class="col-lg-12 form-group">
            <label>${label}</label>
            <p class="m-0">
               ${add1 && add1.length > 0 ? add1 + `,<br />` : ``}
                ${add2 && add2.length > 0 ? add2 + `,<br />` : ``}
                ${city && city.length > 0 ? city + `,<br />` : ``}
                ${state && state.length > 0 ? state + `,` : ``}
            </p>
            <hr />
        </div>
    `;
}
 
function CustomerStatus(customerStatus) {
    var Id = parseInt($("#hdnCustId").val());
    var model = {
        Id: Id,
        Type: 'Customer',
        Status: customerStatus
    };
    // Convert the model to JSON string
    const jsonString = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "SAParty_101",
        Operation: Id > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            RedirectCustomerList();
        }
    });
}

function RedirectCustomerList() {
    var url = "/BusinessPartner/CustomerList?auth=" + AuthToken;
    window.location.href = url;
}



//#region : Customer Sale Order Gried Data
function bindCustSaleOrderGridFilter() {

    let filterData = tableData;

    var BrandId = $("#ddlBrand").val() === 'Select' ? '0' : $("#ddlBrand").val();

    if (BrandId != '0') {

        filterData = filterData.filter(row => row.BrandId == BrandId);
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
});

function GetCustSaleOrderGrid(PAId) {
    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'CustSubSectionDet_101',  //Sub section details by type
        //modelData: jsonString,
        modelData: JSON.stringify({
            PAId: PAId,
            Type: 1
         
        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;

        // Remove the DelayDays column
        //var removeColumns = ["Sales Person", "Client Brand Name", "Planned Date", "Task No Task Description", "Delay"]; // add all you want to remove

        //columnMeta = columnMeta.filter(col =>
        //    !removeColumns.includes(col.HeaderName?.trim())
        //);

        gridOptions = bindAgGrid("#myGrid", 'CustSaleOrderDetGrid', columnMeta, tableData);
        $("#customLoader").hide();
    });
}

function GetCustFinLedgersList(PAId) {

    $("#customLoader").show();
    $('#myGrid').html('');
    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'ERPVendorRecordByType_101',
        modelData: JSON.stringify({
            PAId: PAId,
            FinId: FinYearId,
            /*VoucherNo: $("#txtVoucherNo").val(),*/
            VoucherNo: '',
            Type: 2

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'FinancialLedger', columnMeta, tableData);
        $("#customLoader").hide();
    });


}

function GetCustSampleRecords(CustId) {

    $("#customLoader").show();
    $('#myGrid').html('');
    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'CustSubSectionDet_101',
        modelData: JSON.stringify({
            PAId: CustId,
            Type: 2

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'CustSampleDetGrid', columnMeta, tableData);
        $("#customLoader").hide();
    });


}

function GetCustPMInventoryRecords(PAId) {

    $("#customLoader").show();
    $('#myGrid').html('');
    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'CustSubSectionDet_101',
        modelData: JSON.stringify({
            PAId: PAId,
            Type: 0

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'CustPMInventoryGrid', columnMeta, tableData);
        $("#customLoader").hide();
    });


}

//#endregion