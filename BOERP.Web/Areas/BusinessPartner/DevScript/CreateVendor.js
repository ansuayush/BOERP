$(document).ready(function () {


    var model =
    {
        ID: 0,
        OtherId: 0,
        ModuleId: 3
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
     

        stateArr = response.data.data.Table1;
    });

   
    /*Bind Vendor Code*/
    if ($('#hdnVendorId').val() == "0" || $('#hdnVendorId').val() == "") {

        $('#active').prop('checked', true);

        $("#chkSameAddress").prop('checked', true);

        var model =
        {
            ID: 0,
            OtherId: 0,
            ModuleId: 4
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
            tblDocNo = response.data.data.Table;
            $('#txtVendorCode').val(tblDocNo[0].DocNumber);
            var selectValue = ''

            country_id = tblDocNo[0].Country_Id;
            BindDropdown('ddlPaymentTerms', selectValue);
            //BindDropdown('ddlBCountry', tblDocNo[0].Country_Id);
            //BindDropdown('ddlSCountry', tblDocNo[0].Country_Id);
            //BindDropdown('ddlBState', selectValue);
            //BindDropdown('ddlSState', selectValue);
            BindCountryStateDropdowns('ddlBCountry', tblDocNo[0].Country_Id, 'ddlBState' );
            BindCountryStateDropdowns('ddlSCountry', tblDocNo[0].Country_Id, 'ddlSState' );
            BindDropdown('ddlItemCategory', selectValue);
            BindDropdown('ddlStatus', selectValue);

        });

    }
    else {

        var model =
        {
            ID: 0,
            OtherId: 0,
            ModuleId: 3
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
            var tblDocNo = response.data.data.Table;
            country_id = tblDocNo[0].Country_Id;

        });


        var vendorId = parseInt($("#hdnVendorId").val());
        GetVendorDetById(vendorId);  

    }

});

function BindCountryState(ctrl, stElement, StateId) {

    var model =
    {
        ID: 64,
        ParentId: ctrl.value
    };
    const jsonString = JSON.stringify(model);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'CountryState' }, 'GET', function (response) {

        var $ele = $('#' + stElement);
        $ele.empty();
        $ele.append($('<option/>').val('Select').text('Select'));
        $.each(response.data.data.Table, function (ii, vall) {
            $ele.append($('<option/>').val(vall.ID).text(vall.ValueName));
        })
        var ddlselectValue = StateId == undefined ? "" : StateId;
        if (ddlselectValue != "")
            $ele.val(StateId);
        else
            $ele.val('Select');
    });


}
function BindCountryStateDropdowns(element, countryId, stElement, StateId) {
    var model =
    {
        ID: 63,
        ParentId: countryId
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'CountryState' }, 'GET', function (response) {

        var $ele = $('#' + element);
        $ele.empty();
        $ele.append($('<option/>').val('Select').text('Select'));
        $.each(response.data.data.Table, function (ii, vall) {
            $ele.append($('<option/>').val(vall.ID).text(vall.ValueName));
        })
        var ddlselectValue = countryId == undefined ? "" : countryId;
        if (ddlselectValue != "")
            $ele.val(countryId);
        else
            $ele.val('Select');

        var model =
        {
            ID: 64,
            ParentId: countryId
        };
        const jsonString = JSON.stringify(model);

        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'CountryState' }, 'GET', function (response) {

            var $ele = $('#' + stElement);
            $ele.empty();
            $ele.append($('<option/>').val('Select').text('Select'));
            $.each(response.data.data.Table, function (ii, vall) {
                $ele.append($('<option/>').val(vall.ID).text(vall.ValueName));
            })
            var ddlselectValue = StateId == undefined ? "" : StateId;
            if (ddlselectValue != "")
                $ele.val(StateId);
            else
                $ele.val('Select');
        });

    });

}
function fetchGstinDetails() {

    var gstin = $('#txtGSTNo').val().trim();
    $("#customLoader").show();

    if (!gstin) {
        FailToaster("Please Fill the GST No before click verify.");
        /*$("#spEditGTMNumberErrorMsg").text("Please Fill the GST No before click verify.").show();*/
        $("#customLoader").hide();
        return;
    } else {
        $("#spEditGTMNumberErrorMsg").text("").hide();
    }
  
    const isValid = ValidateAddGSTNumber();

    if (!isValid) {
        return;
    }

    $.ajax({
        url: '/BusinessPartner/GetGstinDetails?auth=' + AuthToken,
        type: 'GET',
        data: { gstin: gstin },
        success: function (response) {
            try {
                console.log("🔍 Raw Response:", response);

                // If response is wrapped as a string, parse it
                if (typeof response === "string") {
                    response = JSON.parse(response);
                }


                firstgst_no = gstin;

                if (response && response.status_cd === "1" && response.data) {
                    console.log("✅ GST Details:", response.data);

                    SuccessToaster("Verified Customer " + response.data.LegalName + " Succcessfully!!!!");

                    const gstDetails = response.data;

         

                    const address = [
                        gstDetails.AddrBno,
                        gstDetails.AddrFlno
                    ]
                        .filter(part => part && part.trim() !== "") // Remove null/empty
                        .join(", ");


                    const address2 = gstDetails.AddrSt;

                    let panNo = gstin.substring(2, 12);

                    $('#txtPANNo').val(panNo);

                    $('#txtVendorName').val(response.data.TradeName);
                    $('#txtBAddressLine1').val(address);

                    $('#txtBAddressLine2').val(address2);

                    $('#txtBPincode').val(response.data.AddrPncd);

                    $('#txtBCity').val(response.data.AddrLoc);

                    const arr = stateArr.find(input => parseInt(input.FIELD_VALUE) == parseInt(response.data.StateCode));

                    $('#ddlBState').val(arr.Id).trigger('change');

                    $('#btnGstVerify').addClass('btn-success');
                    $('#btnGstVerify').prop('disabled', true);
                    $('#btnGstVerify').text('Verified');
                    IsSameAddress();

                    // console.log(address);

                } else {
                    var status_res = JSON.parse(response.status_desc);
                    FailToaster("Failed: " + (status_res[0].ErrorMessage || "Unknown error"));
                }
                $("#customLoader").hide()
            } catch (ex) {
                console.error("⚠️ Exception while processing response:", ex);
                FailToaster("⚠️ Exception while processing response:", ex);
                $("#customLoader").hide()
            }
        },
        error: function (xhr, status, error) {
            console.error("❌ AJAX Error:", error);
            FailToaster("Something went wrong.");
            $("#customLoader").hide()
        }
    });
}

function ValidateAddGSTNumber() {
    var inputvalues = $('#txtGSTNo').val();
    if (inputvalues == "") {
        document.getElementById('spVendorGTMNumberErrorMsg').innerHTML = '';
        return true;    // not mandatory
    }
    var gstinformat = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');

    if (gstinformat.test(inputvalues)) {
        document.getElementById('spVendorGTMNumberErrorMsg').innerHTML = '';

        return true;
    } else {
        document.getElementById('spVendorGTMNumberErrorMsg').innerHTML = 'Please Enter Valid GSTIN Number';
        $('#btnGstVerify').prop('disabled', false);
        $('#btnGstVerify').removeClass('btn-success');
        $('#btnGstVerify').html('Verify');
        return false;
    }
}


function getCountryOfStateOnChangeB(ctrl) {

    const elementId = ctrl.id;

    var id = parseInt(elementId.replace("ddlBState", ""), 10);
    
    var value = ctrl.value;

    if (value > 0) {
        if (id > 0) {

            var model =
            {
                ID: value,
                OtherId: 0,
                ModuleId: 3
            };
            const jsonString = JSON.stringify(model);
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {

                var table = response.data.data.Table;

                $('#ddlBCountry' + id).val(table[0].Depend_On).trigger('change');;

            });
        }
        else {

            var model =
            {
                ID: value,
                OtherId: 0,
                ModuleId: 3
            };
            const jsonString = JSON.stringify(model);
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {

                var table = response.data.data.Table;

                $('#ddlBCountry').val(table[0].Depend_On).trigger('change');;
            });
        }
    }

}

function getCountryOfStateOnChangeS(ctrl) {

    var id = parseInt(ctrl.id.replace("ddlSState", ""), 10);

    var value = ctrl.value;

    if (value > 0) {
        if (id > 0) {

            var model =
            {
                ID: value,
                OtherId: 0,
                ModuleId: 3
            };
            const jsonString = JSON.stringify(model);
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {

                var table = response.data.data.Table;

                $('#ddlSCountry' + id).val(table[0].Depend_On).trigger('change');;

            });
        }
        else {



            var model =
            {
                ID: value,
                OtherId: 0,
                ModuleId: 3
            };
            const jsonString = JSON.stringify(model);
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {

                var table = response.data.data.Table;

                $('#ddlSCountry').val(table[0].Depend_On).trigger('change');
            });
        }
    }
}

var billingCountryId = $("#ddlBCountry").val() > 0 ? $("#ddlBCountry").val() : 0;
var shippingCountryId = $("#ddlSCountry").val() > 0 ? $("#ddlSCountry").val() : 0;

function BindDropdown(type, selectValue) {
    if (type == 'ddlPaymentTerms') {
        LoadMasterDropdown('ddlPaymentTerms', {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 79,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }, 'Select', false, selectValue);
    }

    if (type == 'ddlBCountry') {
        LoadMasterDropdown('ddlBCountry', {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 63,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }, 'Select', false, selectValue);
    }
    if (type == 'ddlSCountry') {
        LoadMasterDropdown('ddlSCountry', {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 63,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }, 'Select', false, selectValue);
    }

    //if (type == 'ddlBState') {
    //    LoadMasterDropdown('ddlBState', {
    //        parentId: 0,
    //        masterTableTypeId: 0,
    //        isMasterTableType: false,
    //        isManualTable: true,
    //        manualTable: 64,
    //        manualTableId: 0,
    //        ScreenId: 'DropdownList_101'
    //    }, 'Select', false, selectValue);
    //}
    //if (type == 'ddlSState') {
    //    LoadMasterDropdown('ddlSState', {
    //        parentId: 0,
    //        masterTableTypeId: 0,
    //        isMasterTableType: false,
    //        isManualTable: true,
    //        manualTable: 64,
    //        manualTableId: 0,
    //        ScreenId: 'DropdownList_101'
    //    }, 'Select', false, selectValue);
    //}

    if (type == 'ddlBState') {        // Bind state by CountryId - Modified on 24/10/2025

        LoadMasterDropdown('ddlBState', {
            parentId: billingCountryId,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 100,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }, 'Select', false, selectValue);
    }
    if (type == 'ddlSState') {
        LoadMasterDropdown('ddlSState', {
            parentId: shippingCountryId,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 100,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }, 'Select', false, selectValue);
    }
    if (type == 'ddlItemCategory') {
        LoadMasterDropdown('ddlItemCategory', {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 69,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }, 'Select', false, selectValue);
    }

    //#region : Code for Vendor Gried
    if (type == 'ddlStatus') {
        LoadMasterDropdown('ddlStatus', {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 4,
            manualTableId: 0,
            ScreenId: "Vendor_102"
        }, 'All', false, selectValue);
    }

}
let contactList = [];  // Initialize an empty array to hold all contacts


function OnchangeStatus() {
    /*GetVendorList();*/
    // bindVendorAdjGrid();
}
var vendorTable;


var tblDate = [];
function GetVendorDetById(vendorId) {
    var model = {
        ID: vendorId,
        Type: "Vendor"
    };
    const jsonString = JSON.stringify(model);
    var ScreenID = "Vendor_101";
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {

        console.log(response)

        var tableData = response.data.data.Table;
        var tableData1 = response.data.data.Table1;
        var tableData2 = response.data.data.Table2;

        tblDate = tableData

        if (tableData && tableData.length > 0) {
            $("#hdnVendorId").val(tableData[0].PartyTempId);

            $('#txtVendorCode').val(tableData[0].PA_Code);

            $('#txtVendorCode').prop('readonly', true);
            $('#txtVendorName').val(tableData[0].PA_Name);

            /*$("#txtCompPhoneNo").val(tableData[0].Phone);*/
            $("#txtVendorEmailId").val(tableData[0].Email);

            BindDropdown('ddlPaymentTerms', tableData[0].PaymentTermsId);

            $('input[name="vendorType"][value="' + tableData[0].OtherType + '"]').prop('checked', true);

            $("#txtGSTNo").val(tableData[0].TAX_TAN2);
            $("#txtTANNo").val(tableData[0].TAX_TAN1);
            $("#txtPANNo").val(tableData[0].TAX_PAN);

            $("#txtBAddressLine1").val(tableData[0].BILL_ADD1);
            $("#txtBAddressLine2").val(tableData[0].BILL_ADD2);
            $("#txtBPincode").val(tableData[0].BILL_PIN);
            $("#txtBCity").val(tableData[0].BillCity);

            //BindDropdown('ddlBState', tableData[0].BillStateId);

            //BindDropdown('ddlBCountry', tableData[0].BillCountryId);

            if (tableData[0].IsGstVerfied == true) {
                firstgst_no = tableData[0].TAX_TAN2;

                let panNo = firstgst_no.substring(2, 12);

                $('#txtPANNo').val(panNo);


                $('#btnGstVerify').prop('disabled', true);
                $('#btnGstVerify').html('Verified');
                $('#btnGstVerify').addClass('btn-success');
            }

            $("#txtSAddressLine1").val(tableData[0].SHIP_ADD1);
            $("#txtSAddressLine2").val(tableData[0].SHIP_ADD2);
            $("#txtSPincode").val(tableData[0].SHIP_PIN);
            $("#txtSCity").val(tableData[0].ShipCity);

            billingCountryId = tableData[0].BillCountryId;
            shippingCountryId = tableData[0].ShipCountryId;

            //// First, bind the country dropdowns
            //BindDropdown('ddlBCountry', tableData[0].BillCountryId);
            //BindDropdown('ddlSCountry', tableData[0].ShipCountryId);

            //// Then, after a short delay, bind the states
            //setTimeout(function () {
            //    BindDropdown('ddlBState', tableData[0].BillStateId);
            //    BindDropdown('ddlSState', tableData[0].ShipStateId);
            //}, 200);  
            BindCountryStateDropdowns('ddlBCountry', billingCountryId, `ddlBState`, tableData[0].BillStateId);
            BindCountryStateDropdowns('ddlSCountry', shippingCountryId, 'ddlSState', tableData[0].ShipStateId);

            //BindDropdown('ddlSState', tableData[0].ShipStateId);  
            //BindDropdown('ddlSCountry', tableData[0].ShipCountryId);

            BindDropdown('ddlItemCategory', tableData[0].ItemCategoryId);


            $('#chkSameAddress').prop('checked', tableData[0].IsAddressSame === 'Yes' ? true : false).trigger('change');

            $('input[name="MSME"][value="' + tableData[0].MSME + '"]').prop('checked', true);

            var statusValue = tableData[0].IsActive;
            $('input[name="status"][value="' + statusValue + '"]').prop('checked', true);
            statusValue == 'Active' ? $('#btnSave').show() : $('#btnSave').hide();     //Hide & Show Save button

            // Now populate the contact persons
            if (tableData1.length > 0) {
                PopulatePersonDetails(tableData1);

                // ViewVendorContactPersonList(tableData1);
            }

            //IsSameAddress();

            if (tableData2.length > 0) {
                var shippingData = tableData2.filter(input => input.IsBillingAddress == 0)

                var billingData = tableData2.filter(input => input.IsBillingAddress == 1)


                for (const item of shippingData) {
                    addShippingAddress(item.ShipCountryId, item.ShipStateId);
                    const index = shippingAddressCount;

                    $("#txtSAddressLine1" + index).val(item.SHIP_ADD1);
                    $("#txtSAddressLine2" + index).val(item.SHIP_ADD2);
                    $("#txtSPincode" + index).val(item.SHIP_PIN);
                    $("#txtSCity" + index).val(item.ShipCity);   
                }

                for (const item of billingData) {
                    addBillingAddress(item.BillCountryId, item.BillStateId);
                    const index = billingAddressCount;

                    $("#txtBAddressLine1" + index).val(item.BILL_ADD1);
                    $("#txtBAddressLine2" + index).val(item.BILL_ADD2);
                    $("#txtBPincode" + index).val(item.BILL_PIN);
                    $("#txtBCity" + index).val(item.BillCity);  

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
                ${add1 || ''},<br />
                ${add2 || ''},<br />
                ${city || ''},<br />
                ${state || ''}
            </p>
            <hr />
        </div>
    `;
}

//function ViewVendorContactPersonList(ContactPersonList) {

//    if (ContactPersonList.length == 1) {
//        $('#contactName1').text(ContactPersonList[0].PersonName);
//        $('#emailId1').text(ContactPersonList[0].EmailId);
//        $('#contactNo1').text(ContactPersonList[0].PhoneNo);

//        $('.contact2').hide();
//    }
//    else {
//        if (ContactPersonList.length > 1) {
//            $('#contactName1').text(ContactPersonList[0].PersonName);
//            $('#emailId1').text(ContactPersonList[0].EmailId);
//            $('#contactNo1').text(ContactPersonList[0].PhoneNo);
//            $('#contactName2').text(ContactPersonList[1].PersonName);
//            $('#emailId2').text(ContactPersonList[1].EmailId);
//            $('#contactNo2').text(ContactPersonList[1].PhoneNo);

//        };

//    }

//}

function ViewVendorContactPersonList(ContactPersonList) {
    let container = $('#contactInfoContainer');
    container.empty(); // Clear existing content

    ContactPersonList.forEach((contact, index) => {
        let contactHtml = `
            <div class="col-lg-3 col-md-3 col-sm-6 form-group">
                <label>Contact Name</label>
                <p class="m-0">${contact.PersonName}</p>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-6 form-group">
                <label>Contact Number</label>
                <p class="m-0">${contact.PhoneNo}</p>
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

function PopulatePersonDetails(dt) {
    // Clear the dynamic rows container to avoid duplicates
    const container = document.getElementById("dynamicDivContainer");
    container.innerHTML = ''; // Clear existing dynamic rows before populating

    dt.forEach((vendor, index) => {
        if (index == 0) {
            // For the first contact person, populate the #Verified div
            if ($("#hdnContPersonId_0").length > 0) {
                $("#hdnContPersonId_0").val(vendor.ID);
                $('#txtPersonName_0').val(vendor.PersonName);
                $('#txtPhoneNo_0').val(vendor.PhoneNo);
                $('#txtEmailId_0').val(vendor.EmailId);

                const number = '+' + vendor.CountryCode + ' ' + vendor.PhoneNo;

                const input = document.querySelector("#txtPhoneNo_0");

                const iti0 = window.intlTelInput(input, {
                    separateDialCode: true,
                    initialCountry: "auto"
                });

                iti0.setNumber(number);

                itiMap[input.id] = iti0
            }

        } else {
            // For other contacts, dynamically create new contact divs
            const newDiv = document.createElement('div');
            newDiv.className = 'addrowdgn dynamic-row';

            newDiv.setAttribute('data-person-id', index);  // Store the unique ID in data attribute

            newDiv.innerHTML = `
            <div class="form-group align-self-end w-auto">
                <input type="hidden" id="hdnContPersonId_${index}" value="${vendor.ID}" />
                <button type="button" class="btn m-0 badge-danger border-r-8" onclick="removeDiv(this)" aria-label="Delete">
                    <img src="/assets/images/icons/help/delete.svg" alt="Delete">
                </button>
            </div>
            <div class="form-group">
                <label>Contact Person’s Name</label>
                <input type="text" class="form-control contact-name" placeholder="Enter Name" value="${vendor.PersonName}" required id="txtOtherCustName_${index}">
            </div>
            <div class="form-group">
             <label>Phone Number</label>
              

                          <input onkeyup="this.value = this.value.replace(/[^0-9]/g, '')" type="tel" class="form-control flag_phone phone contact-phone input-group-field validateOtherCust_${index}" oninput="HideErrorMessage(this)" placeholder="Enter Phone Number" value="${vendor.PhoneNo}" id="txtOtherCustPhoneNo_${index}" maxlength="20">
                            <span id="txtOtherCustPhoneNo_${index}" class="text-danger field-validation-error" style="display:none;">Oops! Looks like you missed this field.</span>                           
            </div>

           
             <div class="form-group">
                <label>Email Id</label>
                <input type="email" class="form-control contact-email" placeholder="Enter Email id" value="${vendor.EmailId}" required id="txtOtherCustEmailId_${index}">
            </div>
            `;

            // Append the dynamically created div to the #dynamicDivContainer
            container.appendChild(newDiv);

            const number = '+' + vendor.CountryCode + ' ' + vendor.PhoneNo;

            maxPersonCount = index;

            const input = newDiv.querySelector(`#txtOtherCustPhoneNo_${maxPersonCount}`);

            const iti = window.intlTelInput(input, {
                separateDialCode: true,
                initialCountry: "auto"
            });

            itiMap[input.id] = iti;

            iti.setNumber(number);
        }



        // Add the dynamic contact to the contact list
        //contactList.push({
        //    ID: vendor.ID,
        //    PersonName: vendor.PersonName,
        //    PhoneNo: vendor.PhoneNo,
        //    EmailId: vendor.EmailId
        //});

    });
}

function IsSameAddress() {
    var isChecked = $('#chkSameAddress').prop('checked');

    if (isChecked) {
        $('#txtSAddressLine1').val($('#txtBAddressLine1').val()).trigger('change');
        HideErrorMessageById('txtSAddressLine1');
        $('#txtSAddressLine2').val($('#txtBAddressLine2').val()).trigger('change');
        $('#txtSPincode').val($('#txtBPincode').val()).trigger('change');
        HideErrorMessageById('txtSPincode');
        $('#txtSCity').val($('#txtBCity').val()).trigger('change');
        HideErrorMessageById('txtSCity');

        //$('#ddlSState').val($('#ddlBState').val()).trigger('change');
        //HideErrorMessageById('ddlSState');
        //$('#ddlSCountry').val($('#ddlBCountry').val()).trigger('change');
        //HideErrorMessageById('ddlSCountry');
        var billingCountryId = $('#ddlBCountry').val();
        var billingStateId = $('#ddlBState').val();


        if (billingCountryId != $('#ddlSCountry').val()) {
            $('#ddlSCountry').val(billingCountryId).trigger('change');
        }

        // Wait a little for dropdown to bind (AJAX) before setting state
        if (billingStateId != $('#ddlSState').val()) {
            $('#ddlSState').val(billingStateId).trigger('change');
        }
   

    } else {

        if (tblDate.length > 0) {
            $("#txtSAddressLine1").val(tblDate[0].SHIP_ADD1);
            $("#txtSAddressLine2").val(tblDate[0].SHIP_ADD2);
            $("#txtSPincode").val(tblDate[0].SHIP_PIN);
            $("#txtSCity").val(tblDate[0].ShipCity);
            
            //BindDropdown('ddlSState', tblDate[0].ShipStateId);
            //BindDropdown('ddlSCountry', tblDate[0].ShipCountryId);
            if (tblDocNo && tblDocNo.length > 0) {
                BindCountryStateDropdowns('ddlSCountry', tblDocNo[0].ShipCountryId, 'ddlSState', tblDate[0].ShipStateId);
            }
        }

        else {
            $('#txtSAddressLine1').val('');
            $('#txtSAddressLine2').val('');
            $('#txtSPincode').val('');
            $('#txtSCity').val('');
            if (billingCountryId != $('#ddlSCountry').val()) {
                $('#ddlSCountry').val('Select').trigger('change');
            }

            // Wait a little for dropdown to bind (AJAX) before setting state
            if (billingStateId != $('#ddlSState').val()) {
                $('#ddlSState').val('Select').trigger('change');
            }
        }

       // 

    }
   // 
}


function HideErrorMessageById(ctrl) {

    $('#sp' + ctrl).hide();
}


// Function to validate phone number (10 digits)
function validatePhoneNumber(phone) {
    /*const phoneRegex = /^\d{10}$/;*/  // Simple 10-digit number validation
    /*return phoneRegex.test(phone);*/

    if (phone.length > 20) {
        return false;
    }
    else { return true; }

}

// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zAZ]{2,6}$/;  // Standard email regex
    return emailRegex.test(email);
}

// Function to validate static fields and check mobile & email
function validateContactFields(staticName, staticPhone, staticEmail, id) {
    // Static Validation (if required fields are empty)
    if (!staticName || !staticPhone || !staticEmail) {
        alert("Please fill out all fields (Name, Phone, and Email)!");
        return false;
    }

    // Validate phone number format
    if (!validatePhoneNumber(staticPhone)) {
        alert("Please enter a valid phone number");
        return false;
    }

    // Validate email format
    if (!validateEmail(staticEmail)) {
        alert("Please enter a valid email address.");
        return false;
    }

    return true;  // Static fields are valid
}

// Function to add a dynamic row
function addDiv() {
    // Increment the person count for dynamic row
    maxPersonCount = maxPersonCount + 1;
    const container = document.getElementById('dynamicDivContainer');

    // Create new div for dynamic contact
    const newDiv = document.createElement('div');
    newDiv.className = 'addrowdgn dynamic-row';
    newDiv.setAttribute('data-person-id', maxPersonCount);  // Store the unique ID in data attribute

    // Set the hidden input's value to be unique (maxPersonCount)
    newDiv.innerHTML = `
    <div class="form-group align-self-end w-auto">
        <input type="hidden" id="hdnContPersonId_${maxPersonCount}" value="0" />
        <button type="button" class="btn m-0 badge-danger border-r-8" onclick="removeDiv(this)" aria-label="Delete">
            <img src="/assets/images/icons/help/delete.svg" alt="Delete">
        </button>
    </div>
    <div class="form-group">
        <label>Contact Person’s Name</label>
        <input type="text" class="form-control contact-name validateOtherCust" placeholder="Enter Name" required oninput="HideErrorMessage(this)" id="txtOtherCustName_${maxPersonCount}">
        <span id="sptxtOtherCustName_${maxPersonCount}" class="text-danger field-validation-error" style="display:none;">Oops! Looks like you missed this field.</span>
    </div>
    <div class="form-group">
        <label>Phone Number</label>
         
                   <input onkeyup="this.value = this.value.replace(/[^0-9]/g, '')" type="tel" class="form-control flag_phone  input-group-field contact-phone validateOtherCust" oninput="HideErrorMessage(this)" placeholder="Enter Phone" required id="txtOtherCustPhoneNo_${maxPersonCount}" maxlength="20">
                   <span id="sptxtOtherCustPhoneNo_${maxPersonCount}" class="text-danger field-validation-error" style="display:none;">Oops! Looks like you missed this field.</span>
       </div>

       <div class="form-group">
            <label>Email Id</label>
            <input type="email" class="form-control contact-email validateOtherCust" placeholder="Enter Email" required oninput="HideErrorMessage(this)" id="txtOtherCustEmailId_${maxPersonCount}">
            <span id="sptxtOtherCustEmailId_${maxPersonCount}" class="text-danger field-validation-error" style="display:none;">Oops! Looks like you missed this field.</span>
        </div>
   
    `;

    // Append the new dynamic row to the container
    container.appendChild(newDiv);


    const input = newDiv.querySelector(`#txtOtherCustPhoneNo_${maxPersonCount}`);

    const iti = window.intlTelInput(input, {
        separateDialCode: true,
        initialCountry: "in"
    });

    itiMap[input.id] = iti;


}

function removeDiv(button) {
    button.closest('.dynamic-row').remove();
}
function EmailCustomerValidation() {
    var email = $('#txtEmailId_0').val();
    if (email == "") {
        document.getElementById('spEmailError').innerHTML = '';
        return false;
    }
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailPattern.test(email)) {
        $('#spEmailError').hide();
    } else {
        $('#spEmailError').text("Invalid Email Address.").show();
    }
}
function EmailVendorValidation() {
    var email = $('#txtVendorEmailId').val();
    if (email == "") {
        document.getElementById('spVendorEmailError').innerHTML = '';
        return false;
    }
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailPattern.test(email)) {
        $('#spVendorEmailError').hide();
        //alert("Valid Email Address!");
    } else {
        $('#spVendorEmailError').text("Invalid Email Address.").show();
    }
}
//function ValidateAddGSTNumber(ctrl) {
//    var inputvalues = $(ctrl).val();
//    if (inputvalues == "") {
//        document.getElementById('spVendorGTMNumberErrorMsg').innerHTML = '';
//        return true;    // not mandatory
//    }
//    var gstinformat = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');

//    if (gstinformat.test(inputvalues)) {
//        document.getElementById('spVendorGTMNumberErrorMsg').innerHTML = '';

//        if (inputvalues != firstgst_no) {
//            if ($('#btnGstVerify').prop('disabled') == true) {
//                $('#btnGstVerify').prop('disabled', false);
//                $('#btnGstVerify').removeClass('btn-success');
//                $('#btnGstVerify').html('Verify');
//            }
//        }
//        else {
//            $('#btnGstVerify').prop('disabled', true);
//            $('#btnGstVerify').addClass('btn-success');
//            $('#btnGstVerify').html('Verified');

//        }
//        return true;
//    } else {
//        document.getElementById('spVendorGTMNumberErrorMsg').innerHTML = 'Please Enter Valid GSTIN Number';
//        //$("#txtGSTNo").val('');
//        //$("#txtGSTNo").focus();
//        return false;
//    }
//}
function PanNumberValidation() {
    var panNumber = $('#txtPANNo').val().toUpperCase();
    if (panNumber == "") {
        document.getElementById('spPanError').innerHTML = '';
        return true;
    }
    var panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (panPattern.test(panNumber)) {
        document.getElementById('spPanError').innerHTML = '';
        return true;
    } else {
        $('#spPanError').text('Invalid PAN Number. Format: AAAAA9999A');
        return false;
    }
}

function TANNumberValidation() {
    var tanNumber = $('#txtTANNo').val().toUpperCase();
    if (tanNumber == "") {
        document.getElementById('spTANError').innerHTML = '';
        return true;
    }
    var tanPattern = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;

    if (tanPattern.test(tanNumber)) {
        document.getElementById('spTANError').innerHTML = '';
        return true;
    } else {
        $('#spTANError').text('Invalid TAN Number. Format: AAAA99999A');
        return false;
    }
}



function collectAndValidateContacts() {
    contactList = []; // Clear the list first
    const tempContactList = [];
    let allValid = true;

    // Validate static contact

    var iti;
    var input;

    const staticName = document.getElementById('txtPersonName_0').value.trim();
    const staticPhone = document.getElementById('txtPhoneNo_0').value.trim();
    const staticEmail = document.getElementById('txtEmailId_0').value.trim();

    const isStaticPartial = (staticName || staticPhone || staticEmail) && !(staticName && staticPhone && staticEmail);

    if (isStaticPartial) {
        FailToaster("Some fields are blank in the first contact row.");
        return false;
    }

    if (staticName && staticPhone && staticEmail) {
        if (!validateContactFields(staticName, staticPhone, staticEmail, 0)) {
            return false;
        }

        input = document.querySelector("#txtPhoneNo_0");

        iti = itiMap[input.id]

        console.log("Full number with country code:", iti.getNumber());
        console.log("Only national number:", input.value);
        console.log("Dial code only:", iti.getSelectedCountryData().dialCode);
        console.log("Country ISO2 code:", iti.getSelectedCountryData().iso2);


        contactList.push({
            ID: parseInt(document.getElementById('hdnContPersonId_0').value),
            PersonName: staticName,
            PhoneNo: staticPhone,
            CountryCode: iti.getSelectedCountryData().dialCode,
            EmailId: staticEmail
        });
    }

    // Validate dynamic contacts
    const dynamicRows = document.querySelectorAll('.dynamic-row');

    for (let index = 0; index < dynamicRows.length; index++) {
        const row = dynamicRows[index];
        const personId = row.getAttribute('data-person-id');

        const name = document.getElementById(`txtOtherCustName_${personId}`).value.trim();
        const phone = document.getElementById(`txtOtherCustPhoneNo_${personId}`).value.trim();
        const email = document.getElementById(`txtOtherCustEmailId_${personId}`).value.trim();

        const isEmpty = !name && !phone && !email;
        const isPartial = (name || phone || email) && !(name && phone && email);

        if (isEmpty) {
            FailToaster(`Row no. ${index + 2} is completely blank. Please fill all fields or remove the row.`);
            return false;
        }

        if (isPartial) {
            FailToaster(`Some fields are blank on row no. ${index + 2}`);
            return false;
        }

        if (!validateContactFields(name, phone, email, personId)) {
            return false;
        }


        input = document.querySelector(`#txtOtherCustPhoneNo_${personId}`);

        iti = itiMap[input.id];

        console.log("Full number with country code:", iti.getNumber());
        console.log("Only national number:", input.value);
        console.log("Dial code only:", iti.getSelectedCountryData().dialCode);
        console.log("Country ISO2 code:", iti.getSelectedCountryData().iso2);


        tempContactList.push({
            ID: parseInt(document.getElementById(`hdnContPersonId_${personId}`).value),
            PersonName: name,
            PhoneNo: phone,
            CountryCode: iti.getSelectedCountryData().dialCode,
            EmailId: email
        });
    }

    // If all validations pass, add dynamic contacts
    contactList = contactList.concat(tempContactList);
    return true;
}


//#region : Click Event
function SaveVendor() {
    if (checkValidationOnSubmit('Mandatory') == true) {

        if (!ValidateAddGSTNumber($("#txtGSTNo"))) return;
        if (!PanNumberValidation()) return;
        if (!TANNumberValidation()) return;

        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test($("#txtVendorEmailId").val())) {
            alert("Please enter a valid vendor email address.");
            return;
        }

        var id = parseInt($("#hdnVendorId").val());
        if (!collectAndValidateContacts()) return; // Stop if validation fails

        console.log(contactList);

        var AddressArray = [];

        $('.billinginput').each(function (index) {

            const id = this.id.split("_")[1];

            var obj = {
                ShipAdd1: "",
                ShipAdd2: "",
                ShipPin: 0,
                ShipCity: "",
                ShipState: "",
                ShipCountryId: 0,

                BillAdd1: $(`#txtBAddressLine1${id}`).val(),
                BillAdd2: $(`#txtBAddressLine2${id}`).val(),
                BillPin: $(`#txtBPincode${id}`).val(),
                BillCity: $(`#txtBCity${id}`).val(),
                BillState: $(`#ddlBState${id} option:selected`).text(),
                BillCountryId: $(`#ddlBCountry${id}`).val() > 0 ? $(`#ddlBCountry${id}`).val() : 0,
                IsBillingAddress: 1
            }

            AddressArray.push(obj)

        })


        $('.shippinginput').each(function (index) {

            const id = this.id.split("_")[1];

            var obj = {
                ShipAdd1: $(`#txtSAddressLine1${id}`).val(),
                ShipAdd2: $(`#txtSAddressLine2${id}`).val(),
                ShipPin: $(`#txtSPincode${id}`).val(),
                ShipCity: $(`#txtSCity${id}`).val(),
                ShipState: $(`#ddlSState${id} option:selected`).text(),
                ShipCountryId: $(`#ddlSCountry${id}`).val() > 0 ? $(`#ddlSCountry${id}`).val() : 0,

                BillAdd1: "",
                BillAdd2: "",
                BillPin: 0,
                BillCity: "",
                BillState: "",
                BillCountryId: 0,
                IsBillingAddress: 0
            }

            AddressArray.push(obj)

        })

        if ($("#txtGSTNo").val() != '' && $('#btnGstVerify').text().trim() === 'Verify') {
            FailToaster("Please verify GST No.");
            return;
        }

        var model = {
            Id: id > 0 ? id : 0,
            VendorCode: $("#txtVendorCode").val(),
            VendorName: $("#txtVendorName").val(),
            VendorEmailId: $("#txtVendorEmailId").val(),
            PaymentTermsId: $("#ddlPaymentTerms").val() > 0 ? $("#ddlPaymentTerms").val() : 0,
            VendorType: $('input[name="vendorType"]:checked').val(),

            GSTNo: $("#txtGSTNo").val(),
            TANNo: $("#txtTANNo").val(),
            PANNo: $("#txtPANNo").val(),

            ItemCategoryId: $("#ddlItemCategory").val() > 0 ? $("#ddlItemCategory").val() : 0,

            ShipAdd1: $("#txtSAddressLine1").val(),
            ShipAdd2: $("#txtSAddressLine2").val(),
            ShipPin: $("#txtSPincode").val(),
            ShipCity: $("#txtSCity").val(),
            ShipState: $("#ddlSState option:selected").text(),
            ShipCountryId: $("#ddlSCountry").val() > 0 ? $("#ddlSCountry").val() : 0,

            //IsGSTVerfied: $('#btnGstVerify').prop('disabled') == true ? 1 : 0,
            IsGSTVerfied: ($('#btnGstVerify').text().trim() === 'Verified') ? 1 : 0,

            BillAdd1: $("#txtBAddressLine1").val(),
            BillAdd2: $("#txtBAddressLine2").val(),
            BillPin: $("#txtBPincode").val(),
            BillCity: $("#txtBCity").val(),
            BillState: $("#ddlBState option:selected").text(),
            BillCountryId: $("#ddlBCountry").val() > 0 ? $("#ddlBCountry").val() : 0,
            IsAddressSame: $('#chkSameAddress').prop('checked') ? "Yes" : "No",
            IsActive: $('input[name="status"]:checked').val(),  // Active or Inactive
            MSME: $('input[name="MSME"]:checked').val(),  // MSME Status

            ContactPersonList: contactList,

            AddressList: AddressArray
        };
        // Convert the model to JSON string
        console.log(model);
        const jsonString = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "Vendor_101",
            Operation: id > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                if ($("#hdnStatus").val() == 2) {
                    VendorStatus(2);     // 2 = Approved
                }

                ClearFormControl();
                setTimeout(function () {
                    RedirectVendorList();
                }, 1000);
            }

        });
    }
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
            ClearFormControl();
            setTimeout(function () {
                RedirectVendorList();
            }, 1000);
        }

    });
}
//#endregion

//#region : Active/InActive Vendor;

var act = 0;
var vendorId = 0;
function del_vendorMaster(id, name, active) {
    act = active ? 0 : 1;
    vendorId = id;
    var active_cont = '';
    active_cont = active ? 'Inactive' : 'Active';

    var final_html = active_cont + ' ' + name;

    $('#del_vendor').html(final_html);

    $('#deletepopup').modal('show');
    $('#del_command').html(active_cont)

}

function VendorIsActive() {
    console.log(act)
    var model = {
        Id: vendorId,
        Proc: 1,
        IsActive: act === 1 ? 'Active' : 'Inactive',
    }

    const jsonString = JSON.stringify(model);

    let GenericModeldata =
    {
        ScreenID: "Vendor_101",
        Operation: "U",
        ModelData: jsonString
    };

    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            $('#deletepopup').modal('hide');
            /*GetVendorList();*/
            bindVendorAdjGrid();
        }

    });

}


function closeVendorDel() {

    var del_id = vendorId;

    if ($(`#popswitch1_${del_id}`).prop('checked')) {

        $(`#popswitch1_${del_id}`).prop('checked', false);

    }
    else {
        $(`#popswitch1_${del_id}`).prop('checked', true);
    }

}

//#endregion

function RedirectVendorList() {
    var url = "/BusinessPartner/Vendor?auth=" + AuthToken;
    window.location.href = url;
}

function ClearFormControl() {
    $('#hdnVendorId').val(0);

    $('#hdnContPersonId_0').val(0);
    $('#txtPersonName_0').val('');
    $('#txtPhoneNo_0').val('');
    $('#txtEmailId_0').val('');

    $('#txtVendorName').val('');
    $('#txtVendorEmailId').val('');
    $('#ddlPaymentTerms').val('Select').trigger('change');
    $('input[name="vendorType"]').prop('checked', false);
    $('#txtGSTNo').val('');
    $('#txtTANNo').val('');
    $('#txtPANNo').val('');

    $('#txtSAddressLine1').val('');
    $('#txtSAddressLine2').val('');
    $('#txtSPincode').val('');
    $('#txtSCity').val('');
    //$('#ddlSState').val('Select').trigger('change');
    //$('#ddlSCountry').val('Select').trigger('change');

    $('#txtBAddressLine1').val('');
    $('#txtBAddressLine2').val('');
    $('#txtBPincode').val('');
    $('#txtBCity').val('');
    //$('#ddlBState').val('Select').trigger('change');
   // $('#ddlBCountry').val('Select').trigger('change');

    $('#chkSameAddress').prop('checked', false);
    localStorage.removeItem('contactList');
}

var ItemsArray = [];
function UploadVendorExcel() {
    var fileInput = $("#fileUpload")[0].files[0];

    if (!fileInput) {
        alert("Please select an Excel file.");
        return;
    }

    var formData = new FormData();
    formData.append("file", fileInput);
    //fileCount = document.querySelectorAll('.document-file1 .file-preview').length;
    //if (fileCount == 0) {
    //    $.ajax({
    //        url: '/Material/BulkUploadVendors',
    //        type: 'POST',
    //        data: formData,
    //        contentType: false,
    //        processData: false,
    //        success: function (response) {
    //            //if (response.success) {
    //            //ItemsArray = response.data;
    //            let decodedJson = atob(response);  // Decode Base64
    //            ItemsArray = JSON.parse(decodedJson); // Convert back to JSON
    //            //$('#btnExcelUpload').show();
    //            if (ItemsArray.length > 0) {
    //                $('#btnExcelUpload').show();
    //            }
    //            else {
    //                $('#btnExcelUpload').hide();
    //                //alert('Excel file is not in correct format.')
    //                FailToaster("Excel file is not in correct format.");
    //            }
    //        },
    //        error: function () {

    //        }
    //    });
    //}
}
function splitArrayIntoChunks(array, chunkSize = 1000) {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}
async function SaveBulkUploadDocument() {
    if (ItemsArray.length > 0) {
        var ValidateItemsArray = ItemsArray.filter(item =>
            ![
                //item.BPCode.trim(),
                item.BPName.trim(),
                item.BPType.trim(),
                item.PhoneNumber.trim(),
                item.EmailId.trim(),
                item.GSTNumber.trim(),
                item.PANNumber.trim(),
                item.TANNumber.trim(),
                item.Billing1AddressLine1.trim(),
                item.Billing1AddressLine2.trim(),
                item.Billing1Pincode.trim(),
                item.Billing1City.trim(),
                item.Billing1State.trim(),
                item.Billing1Country.trim(),
                item.Shipping2AddressLine1.trim(),
                item.Shipping2AddressLine2.trim(),
                item.Shipping2Pincode.trim(),
                item.Shipping2City.trim(),
                item.Shipping2State.trim(),
                item.Shipping2Country.trim(),
                item.Contact1Person1.trim(),
                item.Contact1PhoneNumber1.trim(),
                item.Contact1EmailId1.trim(),
                item.Contact2Person2.trim(),
                item.Contact2PhoneNumber2.trim(),
                item.Contact2EmailId2.trim(),
                item.PaymentTerms.trim(),
                item.DefaultCurrency.trim(),
                item.LeadSource.trim(),
                item.NBD.trim(),
                item.CRR.trim(),
                item.MaterialCategory.trim(),
                item.MSME.trim(),
                item.ClientBrandType.trim(),
                item.BrandName.trim()
            ].some(value => value === "")
        );

        var ErrorItemsArray = ItemsArray.filter(item =>
            [
                //item.BPCode.trim(),
                item.BPName.trim(),
                item.BPType.trim(),
                item.Billing1AddressLine1.trim(),
                item.Billing1AddressLine2.trim(),
                item.Billing1Pincode.trim(),
                item.Billing1City.trim(),
                item.Billing1State.trim(),
                item.Billing1Country.trim(),
                item.Shipping2AddressLine1.trim(),
                item.Shipping2AddressLine2.trim(),
                item.Shipping2Pincode.trim(),
                item.Shipping2City.trim(),
                item.Shipping2State.trim(),
                item.Shipping2Country.trim(),
                item.PaymentTerms.trim(),
                item.DefaultCurrency.trim(),
                item.LeadSource.trim(),
                item.NBD.trim(),
                item.CRR.trim(),
                item.MaterialCategory.trim(),
                item.ClientBrandType.trim()
            ].some(value => value === "")
        );
        // Function to find empty fields in each object
        const specificColumns = ["BPName", "BPType",
            "Billing1AddressLine1", "Billing1AddressLine2",
            "Billing1Pincode", "Billing1City", "Billing1State", "Billing1Country", "Shipping2AddressLine1",
            "Shipping2AddressLine2", "Shipping2Pincode", "Shipping2City", "Shipping2State", "Shipping2Country",
            "PaymentTerms", "DefaultCurrency", "LeadSource", "NBD", "CRR", "MaterialCategory", "ClientBrandType"]; // Replace with actual column names

        var emptyColumnsArray = ErrorItemsArray.map((item, index) => {
            let emptyColumns = specificColumns.filter(key => item[key] === "");
            return { rowNumber: index + 1, BPName: item.BPName, emptyColumns };
        }).filter(entry => entry.emptyColumns.length > 0);

        var splitArr = splitArrayIntoChunks(ValidateItemsArray);
        let uploadedCount = ""; // Initialize uploaded record count
        ShowLoadingDialog()
        for (let i = 0; i < splitArr.length; i++) {
            let model = { Items: splitArr[i] };

            let GenericModeldata =
            {
                ScreenID: "BulkVendorUpload_101",
                Operation: "A",
                ModelData: JSON.stringify(model)
            };

            (function (batchIndex) {
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                    uploadedCount = response.data.Table1;
                });
            })(i); // Pass `i` as a parameter to preserve the correct value
        }
        ShowandCloseLoader();
        $('#upload').hide();
        findEmptyColumns(emptyColumnsArray, uploadedCount);
        $('#fileLimitPopup').hide();
        //GetVendorList();
        //window.location.reload();
    }
}
function findEmptyColumns(emptyColumnsArray, dulicateData) {
    if (emptyColumnsArray.length > 0 || dulicateData.length > 0) {
        var tableHTML = "";
        if (emptyColumnsArray.length > 0) {
            tableHTML = `<table style="overflow: auto; width: 100%; border-collapse: collapse;" border="1">
                                <tr>
                                    <th>Sr No</th>
                                    <th>BP Name</th>
                                    <th>Empty Columns</th>
                                </tr>`;

            emptyColumnsArray.forEach(entry => {
                tableHTML += `<tr>
                                <td>${entry.rowNumber}</td>
                                <td>${entry.BPName}</td>
                                <td>${entry.emptyColumns.join(", ")}</td>
                              </tr>`;
            });

            tableHTML += `</table>`;
        }
        var tableHTMLDuplicate = "";
        if (dulicateData.length > 0) {
            if (dulicateData[0].DuplicateItemCodes != "" && dulicateData[0].DuplicateItemNames != "") {
                tableHTMLDuplicate = `<table style="overflow: auto; width: 100%; border-collapse: collapse;" border="1">
                                <tr>
                                    <th>Item Code</th>
                                    <th>Item Name</th>
                                    <th>Duplicate Item</th>
                                </tr>`;
                dulicateData.forEach(entry => {
                    tableHTMLDuplicate += `<tr>
                                <td>${entry.DuplicateItemCodes}</td>
                                <td>${entry.DuplicateItemNames}</td>
                                 <td>Duplicate</td>
                              </tr>`;
                });
                tableHTMLDuplicate += `</table>`;
            }
        }

        document.getElementById("alertContent").innerHTML = tableHTML + tableHTMLDuplicate;
        document.getElementById("customAlert").style.display = "block";
        $("#customAlert").height(500);
        $("#customAlert").css("overflow", "scroll");
        document.getElementById("overlay").style.display = "block";
    }
}
function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    setTimeout(function () {
        window.location.reload();
    }, 1000); // 5000 milliseconds = 5 seconds    
}

function ImportSAPartyDet() {
    var Id = 0;
    var model = {
        Id: 0,
        PartyType: 'Vendor'
    };
    // Convert the model to JSON string
    const jsonString = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "ImportSAParty_101",
        Operation: Id > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        //if (response.ValidationInput == 1) {
        //}

    });
}
function ExportVendordItemsData() {
    // Get the table element

    let ws_data = [];
    ws_data = excelVendorData.map(item => ({
        BPCode: item.VendorCode,//1
        BPName: item.VendorName,//1
        BPType: 'S',//1
        PhoneNo: item.PhoneNo,//1
        EmailId: item.EMAIL,//1
        GSTNumber: item.TAX_TAN2,//1
        PANNumber: item.TAX_PAN,//1
        TANNumber: item.TAX_TAN1,//1
        AddressLine1: item.SHIP_ADD1,//1
        AddressLine2: item.SHIP_ADD2,//1
        Pincode: item.SHIP_PIN,//1
        City: item.ShipCity,//1
        State: item.SHIP_STATE,//1
        Country: item.ShipCountryId,//1
        AddressLine1: item.BILL_ADD1,//1
        AddressLine2: item.BILL_ADD2,//1
        Pincode: item.BILL_PIN,//1
        City: item.BillCity,//1
        State: item.BILL_STATE,//1
        Country: item.BillCountryId,//1
        ContactPerson: item.PERSON_NAME,//1
        PhoneNo: item.PhoneNo,//1
        EmailId: item.EMAIL,//1
        PaymentTerms: item.DRCR_DAYS,//1
        DefaultCurrency: item.Currency,//1
        LeadSource: item.LeadSource,//1
        NBD: item.NBDUser,//1
        CRR: item.CRRUser//1        
    }));
    downloadExcelFromJson(ws_data, 'CustomerList.xlsx')
}
function downloadExcelFromJson(data, fileName) {
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a new workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Items');

    // Write the file and trigger download
    XLSX.writeFile(workbook, fileName);
}
function VendorPopup() {
    $('#btnExcelUpload').hide();
    $('#upload').modal('show');
}

//#region : Vendor Gried Data

var excelVendorData
 

function BindStateByCountryId(countrySelectId, stateSelectId) {
    const countryId = $(`#${countrySelectId}`).val();

    if (!countryId) return;

    // Call the generic dropdown binder with dynamic parentId
    LoadMasterDropdown(stateSelectId, {
        parentId: countryId,   // ✅ Bind states by selected country
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 100,      // State table (as per your code)
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }, 'Select', false, 0);
}