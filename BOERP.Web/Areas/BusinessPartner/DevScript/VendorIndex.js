$(document).ready(function () {

    LoadMasterDropdown('ddlStatus', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 4,
        manualTableId: 0,
        ScreenId: "Vendor_102"
    }, 'All', false);
    bindVendorAdjGrid();
});
 
let contactList = [];  // Initialize an empty array to hold all contacts
let maxPersonCount = 0; // Keep track of dynamic rows

function OnchangeStatus() {
    /*GetVendorList();*/
   // bindVendorAdjGrid();
}
var vendorTable;
function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

 


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

        if (tableData && tableData.length > 0) {
            $("#hdnVendorId").val(tableData[0].PartyTempId);

            if ($("#hdnPageStatus").val() == 'View Vendor')
            {
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


                    // if (shippingData.length == 0) {

                    //    $("#sAdd1U").text(tableData[0].SHIP_ADD1);
                    //    $("#sAdd2U").text(tableData[0].SHIP_ADD2);
                    //    $("#sCityU").text(tableData[0].ShipCity);
                    //    $("#sStateU").text(tableData[0].SStateCountryPin);

                     
                    //    $('.address2S').hide();
                     

                    //}
                    //else if (shippingData.length > 0) {
                    //    $("#sAdd1U").text(tableData[0].SHIP_ADD1);
                    //    $("#sAdd2U").text(tableData[0].SHIP_ADD2);
                    //    $("#sCityU").text(tableData[0].ShipCity);
                    //    $("#sStateU").text(tableData[0].SStateCountryPin);

                      
                    //     $("#sAdd1L").text(shippingData[0].SHIP_ADD1);
                    //     $("#sAdd2L").text(shippingData[0].SHIP_ADD2);
                    //     $("#sCityL").text(shippingData[0].ShipCity);
                    //     $("#sStateL").text(shippingData[0].SStateCountryPin);
                                 
                      
                    //}


                    // if (billingData.length == 0) {

                       
                    //    $("#bAdd1U").text(tableData[0].BILL_ADD1);
                    //    $("#bAdd2U").text(tableData[0].BILL_ADD2);
                    //    $("#bCityU").text(tableData[0].BillCity);
                    //    $("#bStateU").text(tableData[0].BStateCountryPin);

               
                    //    $('.address2B').hide();

                    //}
                    //else if (billingData.length > 0) {
                       
                    //    $("#bAdd1U").text(tableData[0].BILL_ADD1);
                    //    $("#bAdd2U").text(tableData[0].BILL_ADD2);
                    //    $("#bCityU").text(tableData[0].BillCity);
                    //    $("#bStateU").text(tableData[0].BStateCountryPin);

                    //     $("#bAdd1L").text(billingData[0].BILL_ADD1);
                    //     $("#bAdd2L").text(billingData[0].BILL_ADD2);
                    //     $("#bCityL").text(billingData[0].BillCity);
                    //     $("#bStateL").text(billingData[0].BStateCountryPin);
                    //}

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
            }
        } else {
            // For other contacts, dynamically create new contact divs
            const newDiv = document.createElement('div');
            newDiv.className = 'addrowdgn dynamic-row';

            newDiv.setAttribute('data-person-id', index);  // Store the unique ID in data attribute

            newDiv.innerHTML = `
            <div class="form-group align-self-end">
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

                         <input onkeyup="this.value = this.value.replace(/[^0-9]/g, '')" type="tel" class="form-control input-group-field contact-phone" placeholder="Enter Phone Number" value="${vendor.PhoneNo}" required id="txtOtherCustPhoneNo_${index}" maxlength="20">

                     </div>
            </div>

           
             <div class="form-group">
                <label>Email Id</label>
                <input type="email" class="form-control contact-email" placeholder="Enter Email id" value="${vendor.EmailId}" required id="txtOtherCustEmailId_${index}">
            </div>
            `;

            // Append the dynamically created div to the #dynamicDivContainer
            container.appendChild(newDiv);
        }

        maxPersonCount = index;

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
        $('#ddlSState').val($('#ddlBState').val()).trigger('change');
        HideErrorMessageById('ddlSState');
        $('#ddlSCountry').val($('#ddlBCountry').val()).trigger('change');
        HideErrorMessageById('ddlSCountry');

    } else {
        $('#txtSAddressLine1').val('');
        $('#txtSAddressLine2').val('');
        $('#txtSPincode').val('');
        $('#txtSCity').val('');
        $('#ddlSState').val('Select').trigger('change');
        $('#ddlSCountry').val('Select').trigger('change');

    }
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
    <div class="form-group align-self-end">
        <input type="hidden" id="hdnContPersonId_${maxPersonCount}" value="0" />
        <button type="button" class="btn m-0 badge-danger border-r-8" onclick="removeDiv(this)" aria-label="Delete">
            <img src="/assets/images/icons/help/delete.svg" alt="Delete">
        </button>
    </div>
    <div class="form-group">
        <label>Contact Person’s Name</label>
        <input type="text" class="form-control contact-name validateOtherCust" placeholder="Enter Name" required id="txtOtherCustName_${maxPersonCount}">
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
                   <input onkeyup="this.value = this.value.replace(/[^0-9]/g, '')" type="tel" class="form-control input-group-field contact-phone validateOtherCust" placeholder="Enter Phone" required id="txtOtherCustPhoneNo_${maxPersonCount}" maxlength="20">
          </div>
                   <span id="sptxtOtherCustPhoneNo_${maxPersonCount}" class="text-danger field-validation-error" style="display:none;">Oops! Looks like you missed this field.</span>
       </div>

       <div class="form-group">
            <label>Email Id</label>
            <input type="email" class="form-control contact-email validateOtherCust" placeholder="Enter Email" required id="txtOtherCustEmailId_${maxPersonCount}">
            <span id="sptxtOtherCustEmailId_${maxPersonCount}" class="text-danger field-validation-error" style="display:none;">Oops! Looks like you missed this field.</span>
        </div>
   
    `;

    // Append the new dynamic row to the container
    container.appendChild(newDiv);
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
function ValidateAddGSTNumber(ctrl) {
    var inputvalues = $(ctrl).val();
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
        //$("#txtGSTNo").val('');
        //$("#txtGSTNo").focus();
        return false;
    }
}
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

//function UploadVendorExcel() {
//    var fileInput = $("#fileUpload")[0].files[0];

//    if (!fileInput) {
//        alert("Please select an Excel file.");
//        return;
//    }

//    var formData = new FormData();
//    formData.append("file", fileInput);

//    $.ajax({
//        url: '/Material/UploadVendorExcelFile',
//        type: 'POST',
//        data: formData,
//        contentType: false,
//        processData: false,
//        success: function (response) {
//            if (response.success) {
//                ItemsArray = response.data;
//            }
//        },
//        error: function () {

//        }
//    });
//}

// Function to collect all contact data (static + dynamic)

//function collectAndValidateContacts() {
//    contactList = []; // Clear the list first

//    let allValid = true;
//    // Validate and collect static contact
//    const staticName = document.getElementById('txtPersonName_0').value.trim() || '';
//    const staticPhone = document.getElementById('txtPhoneNo_0').value.trim() || '';
//    const staticEmail = document.getElementById('txtEmailId_0').value.trim() || '';

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
    let allValid = true;

    // Validate static contact
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

        contactList.push({
            ID: parseInt(document.getElementById('hdnContPersonId_0').value),
            PersonName: staticName,
            PhoneNo: staticPhone,
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

        tempContactList.push({
            ID: parseInt(document.getElementById(`hdnContPersonId_${personId}`).value),
            PersonName: name,
            PhoneNo: phone,
            EmailId: email
        });
    }

    // If all validations pass, add dynamic contacts
    contactList = contactList.concat(tempContactList);
    return true;
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
    $('#ddlSState').val('Select').trigger('change');
    $('#ddlSCountry').val('Select').trigger('change');

    $('#txtBAddressLine1').val('');
    $('#txtBAddressLine2').val('');
    $('#txtBPincode').val('');
    $('#txtBCity').val('');
    $('#ddlBState').val('Select').trigger('change');
    $('#ddlBCountry').val('Select').trigger('change');

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
            "PaymentTerms", "DefaultCurrency", "LeadSource", "NBD", "CRR", "MaterialCategory","ClientBrandType"]; // Replace with actual column names

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

 
//AGgried Data

function bindVendorAdjGridFilter() {



    let filterData = tableData;

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    if (Status != '0') {

        filterData = filterData.filter(row => row.StatusId == Status);
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = [];  

function bindVendorAdjGrid() {
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
        screenId: 'Vendor_102',//Need to change the screen id as per your data
        //modelData: jsonString,
        modelData: JSON.stringify({
            Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
            VendorCode: $("#txtVendorCode").val(),
            VendorName: $("#txtVendorName").val()

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'VendorGried', columnMeta, tableData);
        $("#customLoader").hide();
    });
}

//#endregion
