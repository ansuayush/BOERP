$(document).ready(function () {
        
    var vendorId = parseInt($("#hdnVendorId").val());
    GetVendorDetById(vendorId);
}); 


function GetVendorDetById(vendorId) {
    $("#customLoader").show();
    var model = {
        ID: vendorId,
        Type: "Vendor"
    };
    const jsonString = JSON.stringify(model);
    var ScreenID = "Vendor_101";
     CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
         $("#customLoader").hide();

        var tableData = response.data.data.Table;
        var tableData1 = response.data.data.Table1;
        var tableData2 = response.data.data.Table2;

        if (tableData && tableData.length > 0) {
            $("#hdnVendorId").val(tableData[0].PartyTempId);

            if ($("#hdnPageStatus").val() == 'View Vendor') {
                $("#vendorName").text(tableData[0].PA_Name);
                sessionStorage.setItem("VendorName", tableData[0].PA_Name);

                $('#vendorCode').text(tableData[0].PA_Code);
                $("#vendorEmailId").text(tableData[0].Email);
                $("#materialcate").text(tableData[0].ItemCateName);
                $("#MSME").text(tableData[0].MSME);

                $('#vendorType').text(tableData[0].OtherType);
                $("#gstIn").text(tableData[0].TAX_TAN2);
                $("#tanNo").text(tableData[0].TAX_TAN1);
                $("#panNo").text(tableData[0].TAX_PAN);
                $("#contactName").text(tableData[0].ContactPersonName);
                $("#contactNo").text(tableData1[0].PhoneNo);
                $("#emailId").text(tableData1[0].EmailId);
               
                $('#chkSameAddress').prop('checked', tableData[0].IsAddressSame === 'Yes' ? true : false).trigger('change');

                //This code handle on ViewVendor.cshtml
                //if (tableData[0].Status == 2) {
                //    $('#btnReject').hide();
                //    $('#btnApprove').hide();
                //}

                if (tableData[0].Status == 2) {
                    $('.vendorverified-tab').show(); // Show tabs if status is 2
                } 

                if (tableData1.length > 0) {
                   // PopulatePersonDetails(tableData1);

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

            


        }
        else {
            console.error("Record not found..", error);
        }

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

function RedirectVendorList() {
    var url = "/BusinessPartner/Vendor?auth=" + AuthToken;
    window.location.href = url;
}

 
function VendorStatus(vandorStatus) {
    var Id = parseInt($("#hdnVendorId").val());
    var model = {
        Id: Id,
        Type: 'Vendor',
        Status: vandorStatus
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
            RedirectVendorList();
        }

    });
}