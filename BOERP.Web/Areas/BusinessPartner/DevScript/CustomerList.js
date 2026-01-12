$(document).ready(function () {

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 63,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlBCountry', obj1, 'Select', false);
    LoadMasterDropdown('ddlSCountry', obj1, 'Select', false);

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 64,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlBState', obj2, 'Select', false);
    LoadMasterDropdown('ddlSState', obj2, 'Select', false);

    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 93,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlClientBrandType', obj3, 'Select', false);


    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 66,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlCurrency', obj4, 'Select', false);

    var obj5 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 67,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlLeadSource', obj5, 'Select', false);
    var obj6 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 83,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlPayTerms', obj6, 'Select', false);
    var obj7 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 84,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlNBDUser', obj7, 'Select', false);
    LoadMasterDropdown('ddlCRRUser', obj7, 'Select', false);

    /*$('#ddlBCountry').text("213").trigger('change');*/

    $dropdownB = $('#ddlBCountry');

    const withDropB = setInterval(() => {
        if ($dropdownB.find('option').length > 0) {
            clearInterval(withDropB);
            $('#ddlBCountry').val($('#ddlBCountry option').filter(function () {
                return $(this).text().trim() === 'India';
            }).val()).trigger('change');
        }

    });

    $dropdownS = $('#ddlSCountry');

    const withDropS = setInterval(() => {
        if ($dropdownS.find('option').length > 0) {
            clearInterval(withDropS);
            $('#ddlSCountry').val($('#ddlSCountry option').filter(function () {
                return $(this).text().trim() === 'India';
            }).val()).trigger('change');
        }
    });

    $('#chkSameAddress').prop('checked', true).trigger('change');

    var custType = '';
    var custid = parseInt($("#hdnCustId").val());
    if (custid > 0) {
   
        (async () => {
            await GetCustomerDetById(custid);
        })();

       /* document.getElementById('divVerification').style.display = 'none';*/
        
    }
    //else {
    //    document.getElementById('divVerification').style.display = 'block';
    //}

    //Bind Customer Code
    if ($('#hdnCustId').val() == "0" || $('#hdnCustId').val() == "") {
        var model =
        {
            ID: 0,
            OtherId: 0,
            ModuleId: 3
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
            var tblDocNo = response.data.data.Table;
            $('#txtCustCode').val(tblDocNo[0].DocNumber);
        });

    }
    /*End*/
});

let contactList = [];  // Initialize an empty array to hold all contacts
let maxPersonCount = 0; // Keep track of dynamic rows

var PartyStatus = 0;
var IsPartyVerified = 0;

function waitUntilDropdownReady(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
            const $ddl = $(selector);
            if ($ddl.length && $ddl.find("option").length > 1) {
                clearInterval(interval);
                resolve($ddl);
            } else if (Date.now() - start >= timeout) {
                clearInterval(interval);
                FailToaster("Timeout: Dropdown not ready ->", selector);
                reject(`Dropdown '${selector}' failed to load in time.`);
            }
        }, 100);
    });
}


 function GetCustomerDetById(custid) {
    var id = custid;

    var model = {
        ID: id,
        Type: "Customer"
    };
    const jsonString = JSON.stringify(model);
    var ScreenID = "Customer_101";
     CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {

        console.log(response);

        var tableData = response.data.data.Table;
        var tableData1 = response.data.data.Table1;
        var tableData2 = response.data.data.Table2;

        if (tableData && tableData.length > 0) {
            $("#hdnCustId").val(tableData[0].PartyTempId);

            if ($("#hdnPageStatus").val() == 'View Customer') {
                $("#compCode").text(tableData[0].PA_Code);
                $("#compName").text(tableData[0].PA_Name);
                $("#emailId").text(tableData[0].Email);
                $('#custType').text(tableData[0].OtherType);
                $("#phoneNo").text(tableData[0].Phone);

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
                $('#txtCustCode').val(tableData[0].PA_Code);
                $('#txtCompName').val(tableData[0].PA_Name);
                $('#txtCustCode').prop('readonly', true);
                $("#txtCompPhoneNo").val(tableData[0].Phone);
                $("#txtCompEmailId").val(tableData[0].Email);

                $("#txtTANNo").val(tableData[0].TAX_TAN1);
                $("#txtPANNo").val(tableData[0].TAX_PAN);
                $("#txtCompGSTNo").val(tableData[0].TAX_TAN2);

                $("#txtBAddressLine1").val(tableData[0].BILL_ADD1);
                $("#txtBAddressLine2").val(tableData[0].BILL_ADD2);
                $("#txtBPincode").val(tableData[0].BILL_PIN);
                $("#txtBCity").val(tableData[0].BillCity);

                await waitUntilDropdownReady("#ddlBState");
                $("#ddlBState").val(tableData[0].BillStateId);

                await waitUntilDropdownReady("#ddlBCountry");
                $('#ddlBCountry').val(tableData[0].BillCountryId);

                $("#txtSAddressLine1").val(tableData[0].SHIP_ADD1);
                $("#txtSAddressLine2").val(tableData[0].SHIP_ADD2);
                $("#txtSPincode").val(tableData[0].SHIP_PIN);
                $("#txtSCity").val(tableData[0].ShipCity);

                await waitUntilDropdownReady("#ddlSState");
                $("#ddlSState").val(tableData[0].ShipStateId);

                await waitUntilDropdownReady("#ddlSCountry");
                $('#ddlSCountry').val(tableData[0].ShipCountryId);

                $('#chkSameAddress').prop('checked', tableData[0].IsAddressSame === 'Yes' ? true : false).trigger('change');

                $('#ddlPayTerms').val(tableData[0].PaymentTermsId > 0 ? tableData[0].PaymentTermsId : 'Select').trigger('change');

                $('#ddlClientBrandType').val(tableData[0].BrandType > 0 ? tableData[0].BrandType : 'Select').trigger('change');
                $('#txtBrandName').val(tableData[0].BrandName);

                $('#ddlCurrency').val(tableData[0].Currency > 0 ? tableData[0].Currency : 'Select').trigger('change');
                $('#ddlLeadSource').val(tableData[0].LeadSource > 0 ? tableData[0].LeadSource : 'Select').trigger('change');

                $('#ddlNBDUser').val(tableData[0].NBDUserId).trigger('change');
                $('#ddlCRRUser').val(tableData[0].CRRUserId).trigger('change');

                var custType = tableData[0].OtherType;
                $('input[name="custType"][value="' + custType + '"]').prop('checked', true);

                PartyStatus = tableData[0].Status;

                IsPartyVerified = tableData[0].IsPartyVerified;
                $('#chkVerification').prop('checked', IsPartyVerified == 1);

                $('#chkVerification').prop('disabled', true); 

                //if (IsPartyVerified == 1) {
                //    $('#chkVerification').prop('checked', true).prop('disabled', true); 
                //} else {
                //    $('#chkVerification').prop('checked', false).prop('disabled', false);
                //}

                // Now populate the contact persons
                if (tableData1.length > 0) {
                    PopulatePersonDetails(tableData1);
                }

                $('#CompInfo').show();
                //IsSameAddress();


                if (tableData2.length > 0) {
                    var shippingData = tableData2.filter(input => input.IsBillingAddress == 0)

                    var billingData = tableData2.filter(input => input.IsBillingAddress == 1)


                    for (const item of shippingData) {
                        await addShippingAddress();
                        const index = shippingAddressCount;

                        $("#txtSAddressLine1" + index).val(item.SHIP_ADD1);
                        $("#txtSAddressLine2" + index).val(item.SHIP_ADD2);
                        $("#txtSPincode" + index).val(item.SHIP_PIN);
                        $("#txtSCity" + index).val(item.ShipCity);

                        await waitUntilDropdownReady("#ddlSState" + index);
                        $("#ddlSState" + index).val(item.ShipStateId).trigger("change");

                        await waitUntilDropdownReady("#ddlSCountry" + index);
                        $("#ddlSCountry" + index).val(item.ShipCountryId).trigger("change");
                    }


                    for (const item of billingData) {
                        await addBillingAddress();
                        const index = billingAddressCount;

                        $("#txtBAddressLine1" + index).val(item.BILL_ADD1);
                        $("#txtBAddressLine2" + index).val(item.BILL_ADD2);
                        $("#txtBPincode" + index).val(item.BILL_PIN);
                        $("#txtBCity" + index).val(item.BillCity);

                        await waitUntilDropdownReady("#ddlBState" + index);
                        $("#ddlBState" + index).val(item.BillStateId).trigger("change");

                        await waitUntilDropdownReady("#ddlBCountry" + index);
                        $("#ddlBCountry" + index).val(item.BillCountryId).trigger("change");
                    }

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
function PopulatePersonDetails(dt) {
    dt.forEach((cust, index) => {
        if (index == 0) {
            // For the first contact person, populate the #Verified div
            if ($("#hdnContPersonId_0").length > 0) {
                $("#hdnContPersonId_0").val(cust.ID);
                $('#txtCustName_0').val(cust.PersonName);
                $('#txtCustPhoneNo_0').val(cust.PhoneNo);
                $('#txtCustEmailId_0').val(cust.EmailId);
                $("#hdnContPersonVerified_0").val(cust.IsPersonVerified);
            }

            // Make sure #Verified is visible
            $('#Verified').show();
            document.getElementById('addDivButton').disabled = false;
            //document.getElementById("verifyButton").style.display = "none";

            if (IsPartyVerified === 1) {
                document.getElementById("verifyButton").style.display = "block";
                verifyButton.classList.add('btn-success');
                verifyButton.innerText = 'Verified';
                verifyButton.disabled = true;
            } else {
                document.getElementById("divVerifyButton").style.display = "none";
            }
         
        } else {
            // For other contacts, dynamically create new contact divs
            const newDiv = document.createElement('div');
            newDiv.className = 'addrowdgn dynamic-row';

            newDiv.setAttribute('data-person-id', index);  // Store the unique ID in data attribute

            newDiv.innerHTML = `
                <div class="form-group align-self-end">
                    <input type="hidden" id="hdnContPersonId_${index}" value="${cust.ID}" />
                    <input type="hidden" id="hdnContPersonVerified_${index}" value="${cust.IsPersonVerified}" />

                    <button type="button" class="btn m-0 badge-danger border-r-8" onclick="removeDiv(this)" aria-label="Delete">
                        <img src="/assets/images/icons/help/delete.svg" alt="Delete">
                    </button>
                </div>
                <div class="form-group">
                    <label>Contact Person’s Name</label>
                    <input type="text" class="form-control contact-name" placeholder="Enter Name" value="${cust.PersonName}" required id="txtOtherCustName_${index}">
                </div>
               <div class="form-group">
                <label>Phone Number</label>
                <div class="input-group cm-input-group">
                         <div class="dropdown input-group-append p-0">
                             <button class="dropdown-toggle  d-flex align-items-center justify-content-between" type="button" id="countryDropdownBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                 <span id="selectedCountry">
                                     <img src="../assets/images/countryflag/in.png" width="20"> +91
                                 </span>
                             </button>
                             <div class="dropdown-menu wf-100 input-group-append-select scroll scroll-h-a max-h-d" aria-labelledby="countryDropdownBtn">
                                 <input type="text" class="form-control mb-2" id="countrySearch" placeholder="Search country...">
                                 <ul id="countryList" class="list-unstyled"></ul>
                                 <div id="noDataMessage" class="text-danger text-center d-none">No data found</div>
                             </div>
                         </div>

                         <input onkeyup="this.value = this.value.replace(/[^0-9]/g, '')" type="tel" class="form-control input-group-field contact-phone" placeholder="Enter Phone Number" value="${cust.PhoneNo}" required id="txtOtherCustPhoneNo_${index}" maxlength="20">

                     </div>
            </div>

                 <div class="form-group">
                    <label>Email Id</label>
                    <input type="email" class="form-control contact-email" placeholder="Enter Email" value="${cust.EmailId}" required id="txtOtherCustEmailId_${index}">
                </div>
                ${IsPartyVerified ? `
                <div class="form-group align-self-end-verify align-self-end">
                    <button type="submit" id="btnVerify_${index}" class="btnnewview btnnewview_active btn btn-lg actionbtn btn-success">Verified</button>
                </div>
                ` : ''}
              
                
            `;

            // Append the dynamically created div to the #dynamicDivContainer
            document.getElementById("dynamicDivContainer").appendChild(newDiv);
        }

        maxPersonCount = index;
        // Add to contact list
        //contactList.push({
        //    ID: cust.ID,
        //    PersonName: cust.PersonName,
        //    PhoneNo: cust.PhoneNo,
        //    EmailId: cust.EmailId
        //});
    });
}

function VerifyCust() {    
    if (document.getElementById('chkVerification').checked == true) {
        if (checkValidationOnSubmit('VerifyCust') == true) {
            var custName = $("#txtCustName_0").val();
            var custPhoneNo = $("#txtCustPhoneNo_0").val();
            var custEmailId = $("#txtCustEmailId_0").val();
            if (custName != '' && custPhoneNo != '' && custEmailId != '') {
                var phonePattern = /^[0-9]{10}$/;
                if (!phonePattern.test(custPhoneNo)) {
                    FailToaster("Please enter a valid 10-digit phone number.");
                    return; // Stop further execution if invalid phone number
                }
                var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                if (!emailPattern.test(custEmailId)) {
                    FailToaster("Please enter a valid email address.");
                    return; // Stop further execution if invalid email
                }

                sendOtp(custPhoneNo, custEmailId);
                $('#modalVerifyButton').prop('disabled', false);

                custType = 'static';
            } else {
                $("#Verifiedpopup").modal('show');
            }
            $('#txtModalEmailOTP').val('');
            $('#txtModalPhoneNoOTP').val('');
        }
    }
    else {
        $('#CompInfo').show();
    }
}

function VerifyOtherCust(button) {
    const row = $(button).closest('.addrowdgn');
    const rowNumber = row.data('person-id'); // dynamic row number

    if (checkValidationOnSubmit(`validateOtherCust_${rowNumber}`) === true) {
        //var ctrlId = button.id.split('_')[1];
        //var custName = $('#' + 'lblItemName_' + ctrlId).val();

        const custName = row.find(".contact-name").val().trim();
        const custPhoneNo = row.find(".contact-phone").val().trim();
        const custEmailId = row.find(".contact-email").val().trim();

        if (custName !== '' && custPhoneNo !== '' && custEmailId !== '') {
            var phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(custPhoneNo)) {
                FailToaster("Please enter a valid 10-digit phone number.");
                return;
            }
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(custEmailId)) {
                FailToaster("Please enter a valid email address.");
                return;
            }
            sendOtp(custPhoneNo, custEmailId);
            $('#modalVerifyButton').prop('disabled', false);
            custType = 'dynamic';
            row.data('verified', false);  // Add a data attribute to track verification status of this row
        } else {
            $("#Verifiedpopup").modal('hide');
        }

        $('#txtModalEmailOTP').val('');
        $('#txtModalPhoneNoOTP').val('');
    }
}

var otp = '';
function sendOtp(custPhoneNo, custEmailId) {

    // Show modal immediately with loading info
   /* $('#otpInfo').text("Sending OTP...");*/
    $('#Verifiedpopup').modal('show');
    
    $.ajax({
        url: '/Account/SaveOTP?auth=' + AuthToken, // URL to your controller's action
        type: 'POST',
        data: { user_email: custEmailId },
        success: function (response) {
            $("#customLoader").hide();
            if (response !== "-1") {
                otp = response
                $('#otpInfo').text(`Please enter the 4 digit code sent to the registered email id (${custEmailId}) and Phone Number (${custPhoneNo})`);
                $('#Verifiedpopup').modal('show');
                // Enable the button using jQuery
                $('#closeVerifiedModal').prop('disabled', false);
            } else {
                $('#modalVerifyButton').prop('disabled', true);
                FailToaster("Failed to send OTP!! Check your email or try again!!");
            }
        },
        error: function (xhr, status, error) {
            $("#customLoader").hide();
            console.error("Error:", error);
        }
    });
}
function ValidateAddGSTNumber(ctrl) {
    var inputvalues = $(ctrl).val();
    if (inputvalues == "") {
        document.getElementById('spEditGTMNumberErrorMsg').innerHTML = '';
        return true;    // not mandatory
    }
    var gstinformat = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');

    if (gstinformat.test(inputvalues)) {
        document.getElementById('spEditGTMNumberErrorMsg').innerHTML = '';
        return true;
    } else {
        document.getElementById('spEditGTMNumberErrorMsg').innerHTML = 'Please Enter Valid GSTIN Number';
        //$(".txtCompGSTNo").val('');
        //$(".txtCompGSTNo").focus();
        return false;
    }
}
function EmailValidation() {
    var email = $('#txtCompEmailId').val();
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailPattern.test(email)) {
        $('#spCompEmailError').hide();
        //alert("Valid Email Address!");
    } else {
        $('#spCompEmailError').text("Invalid Email Address.").show();
    }
}
function EmailCustomerValidation() {
    var email = $('#txtCustEmailId_0').val();
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailPattern.test(email)) {
        $('#spCustEmailError').hide();
        //alert("Valid Email Address!");
    } else {
        $('#spCustEmailError').text("Invalid Email Address.").show();
    }
}
//function ModalEmailValidation() {
//    var email = $('#txtModalEmailId').val();
//    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//    if (emailPattern.test(email)) {
//        $('#spModalCustEmailError').hide();
//        //alert("Valid Email Address!");
//    } else {
//        $('#spModalCustEmailError').text("Invalid Email Address.").show();
//    }
//}
function CompPhoneNumberValidation() {
    //var phone = $('#txtCompPhoneNo').val();
    //if (phone.length < 10) {
    //    $('#sptxtCompPhoneNo').text("Phone number must be at least 10 digits.").show();
    //} else {
    //    $('#sptxtCompPhoneNo').hide();
    //    //alert("Valid Phone Number: " + phone);
    //}
}
function IsSameAddress() {
    var isChecked = $('#chkSameAddress').prop('checked');

    if (isChecked) {
        $('#txtSAddressLine1').val($('#txtBAddressLine1').val());
        HideErrorMessageById('txtSAddressLine1');
        $('#txtSAddressLine2').val($('#txtBAddressLine2').val());
        $('#txtSPincode').val($('#txtBPincode').val());
        HideErrorMessageById('txtSPincode');
        $('#txtSCity').val($('#txtBCity').val());
        HideErrorMessageById('txtSCity');
        $('#ddlSState').val($('#ddlBState').val()).trigger('change');
        HideErrorMessageById('ddlSState');
        $('#ddlSCountry').val($('#ddlBCountry').val()).trigger('change');
        HideErrorMessageById('ddlSCountry');
        // Disable fields
        //$('#txtBAddressLine1').prop('disabled', true);
        //$('#txtBAddressLine2').prop('disabled', true);
        //$('#txtBPincode').prop('disabled', true);
        //$('#txtBCity').prop('disabled', true);
        //$('#ddlBState').prop('disabled', true);
        //$('#ddlBCountry').prop('disabled', true);

    } else {
        $('#txtSAddressLine1').val('');
        $('#txtSAddressLine2').val('');
        $('#txtSPincode').val('');
        $('#txtSCity').val('');
        $('#ddlSState').val('Select').trigger('change');
        $('#ddlSCountry').val('Select').trigger('change');

        // Disable fields
        //$('#txtBAddressLine1').prop('disabled', false);
        //$('#txtBAddressLine2').prop('disabled', false);
        //$('#txtBPincode').prop('disabled', false);
        //$('#txtBCity').prop('disabled', false);
        //$('#ddlBState').prop('disabled', false);
        //$('#ddlBCountry').prop('disabled', false);

    }
}

function HideErrorMessageById(ctrl) {

    $('#sp' + ctrl).hide();
}

function DeleteRow(button) {
    // Get the closest parent element with the class 'addrowdgn'
    var row = button.closest(".addrowdgn");

    // Remove the row from the container
    if (row) {
        row.remove();
    }
}

function IsVerificationRequired(isVerified) {
    var isChecked = $('#chkVerification').is(':checked');
    var isNewCustomer = parseInt($('#hdnCustId').val());

    // Toggle verify button visibility
    $('#divVerifyButton').toggle(isChecked);

    // Toggle dynamic container section
    $('#dynamicDivContainer .form-group.align-self-end-verify.align-self-end').toggle(isChecked);

    // Toggle CompInfo based on checkbox and customer ID
    if (isChecked) {
        if (isNewCustomer == 0 && isVerified==0) {
            $('#CompInfo').hide();
        } else {
            $('#CompInfo').show();
        }
    } else {
        $('#CompInfo').show();
    }
}
   
//#region : Click Event

function clearOTPModalField() {
    $('#txtModalEmailOTP').val('');
    $('#txtModalPhoneNoOTP').val('');
    $('#sptxtModalEmailOTP').hide();
    $('#sptxtModalPhoneNoOTP').hide();
}
function addDiv() {
    maxPersonCount = maxPersonCount + 1;
    const container = document.getElementById('dynamicDivContainer');

    // Create new div
    const newDiv = document.createElement('div');
    newDiv.className = 'addrowdgn  dynamic-row';
    newDiv.setAttribute('data-person-id', maxPersonCount);  // Store the unique ID

    newDiv.innerHTML = `
    <div class="form-group align-self-end">
	<input type="hidden" id="hdnContPersonId_${maxPersonCount}" value="0" />
    <input type="hidden" id="hdnContPersonVerified_${maxPersonCount}" value="0" />
        <button onclick="DeleteRow(this)" id="btnDelete_${maxPersonCount}" type="button" class="btn m-0 badge-danger border-r-8" aria-label="Delete">
            <img src="/assets/images/icons/help/delete.svg" alt="Delete">
        </button>
    </div>
    <div class="form-group">
        <label>Contact Person’s Name</label>
        <input type="text" class="form-control contact-name validateOtherCust_${maxPersonCount}" placeholder="Enter Name" required id="txtOtherCustName_${maxPersonCount}">
        <span id="sptxtOtherCustName_${maxPersonCount}" class="text-danger field-validation-error" style="display:none;">Oops! Looks like you missed this field.</span>
    </div>
    <div class="form-group">
        <label>Phone Number</label>
         <div class="input-group cm-input-group">
            <div class="dropdown input-group-append p-0">
                 <button class="dropdown-toggle  d-flex align-items-center justify-content-between" type="button" id="countryDropdownBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                     <span id="selectedCountry">
                       <img src="../assets/images/countryflag/in.png" width="20"> +91
                  </button>
                  <div class="dropdown-menu wf-100 input-group-append-select scroll scroll-h-a max-h-d" aria-labelledby="countryDropdownBtn">
                    <input type="text" class="form-control mb-2" id="countrySearch" placeholder="Search country...">
                        <ul id="countryList" class="list-unstyled"></ul>
                            <div id="noDataMessage" class="text-danger text-center d-none">No data found</div>
                            </div>
                   </div>
                   <input onkeyup="this.value = this.value.replace(/[^0-9]/g, '')" type="tel" class="form-control input-group-field contact-phone validateOtherCust_${maxPersonCount}" placeholder="Enter Phone No" required id="txtOtherCustPhoneNo_${maxPersonCount}" maxlength="20">
          </div>
                   <span id="sptxtOtherCustPhoneNo_${maxPersonCount}" class="text-danger field-validation-error" style="display:none;">Oops! Looks like you missed this field.</span>
       </div>


    <div class="form-group">
        <label>Email Id</label>
        <input type="email" class="form-control contact-email validateOtherCust_${maxPersonCount}" placeholder="Enter Email" required id="txtOtherCustEmailId_${maxPersonCount}">
        <span id="sptxtOtherCustEmailId_${maxPersonCount}" class="text-danger field-validation-error" style="display:none;">Oops! Looks like you missed this field.</span>
    </div>
    <div class="form-group align-self-end-verify align-self-end" >
        <button type="submit" id="btnVerify_${maxPersonCount}" class="btnnewview btnnewview_active btn btn-lg actionbtn"  data-toggle="modal" onclick="VerifyOtherCust(this)">Verify</button>
    </div>
    `;
    container.appendChild(newDiv);

    //Show and hide verify button as checkbox value
    IsVerificationRequired();
}

function removeDiv(button) {
    button.closest('.dynamic-row').remove();
}

// Function to validate phone number (10 digits)
function validatePhoneNumber(phone) {
    const phoneRegex = /^\d{10}$/;  // Simple 10-digit number validation
    return phoneRegex.test(phone);
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
        FailToaster("Please fill out all fields (Name, Phone, and Email)!");
        return false;
    }

    // Validate phone number format
    if (!validatePhoneNumber(staticPhone)) {
        FailToaster("Please enter a valid phone number (10 digits).");
        return false;
    }

    // Validate email format
    if (!validateEmail(staticEmail)) {
        FailToaster("Please enter a valid email address.");
        return false;
    }

    return true;  // Static fields are valid
}

// Function to handle final verification and collection of all contact info

function finalizeVerification() {
    if (checkValidationOnSubmit('validateModelField') == true) {

        const emailCode = $('#txtModalEmailOTP').val();
        const phoneCode = $('#txtModalPhoneNoOTP').val();

        // Check if OTP entered is correct
        /*if (emailCode === otp && phoneCode === otp) {*/
        if (emailCode === otp) {
            // OTP is valid, collect all contact info

            if (custType == 'static') {
                // 1. Collect the static contact info
                const custName = $("#txtCustName_0").val();
                const custPhoneNo = $("#txtCustPhoneNo_0").val();
                const custEmailId = $("#txtCustEmailId_0").val();

                const verifyButton = document.getElementById('verifyButton');
                verifyButton.classList.add('btn-success');
                verifyButton.innerText = 'Verified';
                verifyButton.disabled = true;

                document.getElementById('hdnContPersonVerified_0').value = "1";

                // Add the static contact to the contact records array
                //contactList.push({
                //    ID: 0,
                //    PersonName: custName,
                //    PhoneNo: custPhoneNo,
                //    EmailId: custEmailId
                //});
            } else if (custType == 'dynamic') {
                //// 2. Collect dynamic contact info from all added rows

                const currentRow = $('.addrowdgn').filter(function () {
                    return $(this).data('verified') === false;  // Only look for unverified rows
                }).first();  // Handle the first unverified row

                if (currentRow.length > 0) {
                    // Collect the data from this row
                    const custName = currentRow.find(".contact-name").val().trim();
                    const custPhoneNo = currentRow.find(".contact-phone").val().trim();
                    const custEmailId = currentRow.find(".contact-email").val().trim();

                    // Add to contact list
                    //contactList.push({
                    //    ID: 0,
                    //    PersonName: custName,
                    //    PhoneNo: custPhoneNo,
                    //    EmailId: custEmailId
                    //});

                    // Mark this row as verified
                    currentRow.data('verified', true);

                    // Update the UI for this row
                    currentRow.find('button[type="submit"]').addClass('btn-success').text('Verified');

                    // Optionally, disable the "Verify" button after successful verification
                    currentRow.find('button[type="submit"]').prop('disabled', true);

                    // Optionally, enable the "Add" button for more entries
                    const addDivButton = document.getElementById('addDivButton');
                    addDivButton.disabled = false;

                    const personId = currentRow.data('person-id'); // dynamic person id
                    document.getElementById(`hdnContPersonVerified_${personId}`).value = "1";
                }
            }

            /*console.log(contactList);*/

            // Update UI for verified status
            //const verifyButton = document.getElementById('verifyButton');
            //verifyButton.classList.add('btn-success');
            //verifyButton.innerText = 'Verified';
            //verifyButton.disabled = true;

            // Enable the "Add" button for future entries
            const addDivButton = document.getElementById('addDivButton');
            addDivButton.disabled = false;

            // Close the modal and update the UI
            $('#Verifiedpopup').modal('hide');
            $('#CompInfo').show();  // Assuming this is the section where you show the verified information

            //Freeze checkbox when peron verified.
            document.getElementById("chkVerification").disabled = true; 
            IsVerificationRequired(1);
           
        } else {
            // OTP does not match, alert the user
            //FailToaster("OTP does not match. Please try again.");
            $('#sptxtModalEmailOTP').text("Email OTP does not match. Please try again.").show();
            $('#Verifiedpopup').modal('show');
        }
    }
    else {
        $('#Verifiedpopup').modal('show');
    }
}

// Function to collect all contact data (static + dynamic)

//function collectAndValidateContacts() {
//    contactList = []; // Clear the list first

//    let allValid = true;
//    // Validate and collect static contact
//    const staticName = document.getElementById('txtCustName_0').value.trim() || '';
//    const staticPhone = document.getElementById('txtCustPhoneNo_0').value.trim() || '';
//    const staticEmail = document.getElementById('txtCustEmailId_0').value.trim() || '';

//    /*validateStaticFields(staticName, staticPhone, staticEmail, 0)*/
//    if (!validateContactFields(staticName, staticPhone, staticEmail, 0)) allValid = false;

//    //contactList.push({
//    //    ID: parseInt(document.getElementById('hdnContPersonId_0').value),
//    //    PersonName: staticName,
//    //    PhoneNo: staticPhone,
//    //    EmailId: staticEmail
//    //});

//    // Validate and collect dynamic contacts
//    const dynamicRows = document.querySelectorAll('.dynamic-row');
//    const tempContactList = [];

//    dynamicRows.forEach(row => {
//        const personId = row.getAttribute('data-person-id');
//        const name = document.getElementById(`txtOtherCustName_${personId}`).value.trim() || '';
//        const phone = document.getElementById(`txtOtherCustPhoneNo_${personId}`).value.trim() || '';
//        const email = document.getElementById(`txtOtherCustEmailId_${personId}`).value.trim() || '';

//        if (!name && !phone && !email) return; // Skip empty dynamic rows
//        if (!validateContactFields(name, phone, email, personId)) {
//            allValid = false;
//            return;
//        }

//        tempContactList.push({
//            ID: parseInt(document.getElementById(`hdnContPersonId_${personId}`).value),
//            PersonName: name,
//            PhoneNo: phone,
//            EmailId: email
//        });
//    });

//    if (!allValid) return false;

//    contactList.push({
//        ID: parseInt(document.getElementById('hdnContPersonId_0').value),
//        PersonName: staticName,
//        PhoneNo: staticPhone,
//        EmailId: staticEmail
//    });

//    contactList = contactList.concat(tempContactList);
//    return true;

//    console.log(contactList);
//}

function collectAndValidateContacts() {
    contactList = []; // Clear the list first
    const tempContactList = [];

    const isVerificationRequired = document.getElementById('chkVerification').checked;

    // Validate static contact
    const staticName = document.getElementById('txtCustName_0').value.trim();
    const staticPhone = document.getElementById('txtCustPhoneNo_0').value.trim();
    const staticEmail = document.getElementById('txtCustEmailId_0').value.trim();
    const staticVerified = document.getElementById('hdnContPersonVerified_0').value.trim();

    // If any static field is filled, all must be validated
    const isStaticPartial = (staticName || staticPhone || staticEmail) && !(staticName && staticPhone && staticEmail);

    if (isStaticPartial) {
        FailToaster("Some fields are blank in the first contact row.");
        return false;
    }

    if (staticName && staticPhone && staticEmail) {
        if (!validateContactFields(staticName, staticPhone, staticEmail, 0)) {
            return false;
        }
        if (isVerificationRequired && staticVerified !== "1") {
            FailToaster("The first contact must be verified.");
            return false;
        }

        contactList.push({
            ID: parseInt(document.getElementById('hdnContPersonId_0').value),
            PersonName: staticName,
            PhoneNo: staticPhone,
            EmailId: staticEmail,
            IsPersonVerified: staticVerified
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
        const isVerified = document.getElementById(`hdnContPersonVerified_${personId}`).value.trim();

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
        if (isVerificationRequired && isVerified !== "1") {
            FailToaster(`Contact Person on row no. ${index + 2} must be verified.`);
            return false;
        }


        tempContactList.push({
            ID: parseInt(document.getElementById(`hdnContPersonId_${personId}`).value),
            PersonName: name,
            PhoneNo: phone,
            EmailId: email,
            IsPersonVerified: isVerified
        });
    }

    // If validation passed for all, add dynamic contacts
    contactList = contactList.concat(tempContactList);
    return true;
}

function SaveCustomer() {
    var id = parseInt($("#hdnCustId").val());
    if (checkValidationOnSubmit('Mandatory') == true) {

        var phonePattern = /^[0-9]{10}$/;
        //if (!phonePattern.test($("#txtCompPhoneNo").val())) {
        //    FailToaster("Please enter a valid 10-digit phone number.");
        //    return;
        //}
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test($("#txtCompEmailId").val())) {
            FailToaster("Please enter a valid email address.");
            return;
        }

        if (!ValidateAddGSTNumber($("#txtCompGSTNo"))) return;

        if (!collectAndValidateContacts()) return; // Stop if validation fails


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


        var model = {
            CustId: id > 0 ? id : 0,
            CustCode: $("#txtCustCode").val(),
            CompName: $("#txtCompName").val(),

            PhoneNo: $("#txtCompPhoneNo").val(),
            EmailId: $("#txtCompEmailId").val(),
            TANNo: $("#txtTANNo").val(),
            PANNo: $("#txtPANNo").val(),
            GSTNo: $("#txtCompGSTNo").val(),

            ShipAdd1: $("#txtSAddressLine1").val(),
            ShipAdd2: $("#txtSAddressLine2").val(),
            ShipPin: $("#txtSPincode").val(),
            ShipCity: $("#txtSCity").val(),
            ShipState: $("#ddlSState option:selected").text(),
            ShipCountryId: $("#ddlSCountry").val() > 0 ? $("#ddlSCountry").val() : 0,

            BillAdd1: $("#txtBAddressLine1").val(),
            BillAdd2: $("#txtBAddressLine2").val(),
            BillPin: $("#txtBPincode").val(),
            BillCity: $("#txtBCity").val(),
            BillState: $("#ddlBState option:selected").text(),
            BillCountryId: $("#ddlBCountry").val() > 0 ? $("#ddlBCountry").val() : 0,
            IsAddressSame: $('#chkSameAddress').prop('checked') ? "Yes" : "No",

            PaymentTermsId: $("#ddlPayTerms").val() > 0 ? $("#ddlPayTerms").val() : 0,
            ClientBrandType: $("#ddlClientBrandType").val() > 0 ? $("#ddlClientBrandType").val() : 0,
            BrandName: $("#txtBrandName").val(),
            Currency: $("#ddlCurrency").val() > 0 ? $("#ddlCurrency").val() : 0,
            LeadSource: $("#ddlLeadSource").val() > 0 ? $("#ddlLeadSource").val() : 0,

            NBDUserId: $("#ddlNBDUser").val() > 0 ? $("#ddlNBDUser").val() : 0,
            CRRUserId: $("#ddlCRRUser").val() > 0 ? $("#ddlCRRUser").val() : 0,
            CustType: $('input[name="custType"]:checked').val(),

            IsCustmerVerified: $('#chkVerification').prop('checked') ? 1 : 0,

            ContactPersonList: contactList,
            AddressList: AddressArray
        };
        // Convert the model to JSON string
        const jsonString = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "Customer_101",
            Operation: id > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
           if (response.ValidationInput == 1) {
               if (PartyStatus == 2) {
                   CustomerStatus(2);     // 2 = Approved
                }

                ClearFormControl();
                setTimeout(function () {
                    RedirectCustomerList();
                }, 1000);
            }

        });
    }
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
//#endregion


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

function RedirectCustomerList() {
    var url = "/BusinessPartner/CustomerList?auth=" + AuthToken;
    window.location.href = url;
}
function ClearFormControl() {
    $('#hdnCustId').val(0);

    $('#hdnContPersonId_0').val(0); 
    $('#txtCustName_0').val('');
    $('#txtCustPhoneNo_0').val('');
    $('#txtCustEmailId_0').val('');

    $('#txtCustCode').val('');
    $('#txtCompName').val('');
    $('#txtCompPhoneNo').val('');
    $('#txtCompEmailId').val('');
    $('#txtTANNo').val('');
    $('#txtPANNo').val('');
    $('#txtCompGSTNo').val('');

    $('#txtSAddressLine1').val('');
    $('#txtSAddressLine2').val('');
    $('#txtSPincode').val('');
    $('#txtSCity').val('');
    $('#ddlSState').val('Select').trigger('change');
    $('#ddlSCountry').val('Select').trigger('change');

    $('#txtBAddressLine1').val('');
    $('#txtBAddressLine2').val('');
    $('#txtBPincode').val('');
    $('#txtBCity').val('');
    $('#ddlBState').val('Select').trigger('change');
    $('#ddlBCountry').val('Select').trigger('change');

    $('#ddlPayTerms').val('Select').trigger('change');
    $('#ddlClientBrandType').val('Select').trigger('change');
    $('#txtBrandName').val('');
    $('#ddlCurrency').val('Select').trigger('change');
    $('#ddlLeadSource').val('Select').trigger('change');

    $('#chkSameAddress').prop('checked', false);
    localStorage.removeItem('contactList');
}