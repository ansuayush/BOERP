$(document).ready(function ()   {

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 79,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlPaymentTerms', obj1, 'Select', false);

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 63,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlSCountry', obj2, 'Select', false);
    LoadMasterDropdown('ddlBCountry', obj2, 'Select', false);

    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 64,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlSState', obj3, 'Select', false);
    LoadMasterDropdown('ddlBState', obj3, 'Select', false);

    var custType = '';
    var vendorId = parseInt($("#hdnVendorId").val());
    if (vendorId > 0) {
        GetVendorDetById(vendorId);
    }
    else {
        GetVendorList();
    }
});

function GetVendorList() {
    var model =
    {
        Status: "",
        Type: "",
        DocNumber: $("#txtDocNumber").val()
    };

    const jsonString = JSON.stringify(model);

    // Check if DataTable is already initialized, then destroy it
    if ($.fn.DataTable.isDataTable("#VendorTable")) {
        $("#VendorTable").DataTable().destroy();
    }


    $('#VendorTable').DataTable({
        "processing": true,
        "serverSide": true,  // Enables server-side processing
        "paging": true,
        "pagingType": "full_numbers",
        "pageLength": 10,
        "lengthMenu": [10, 20, 30, 40, 50],
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "responsive": true,
        "dom": '<"top">rt<"bottom"lip><"clear">',
        "language": {
            "paginate": {
                "first": "<img src='../../assets/images/icons/help/double-left.png' alt=''>",
                "previous": "<img src='../../assets/images/icons/help/arrow-left.png' alt=''>",
                "next": "<img src='../../assets/images/icons/help/arrow-right.png' alt=''>",
                "last": "<img src='../../assets/images/icons/help/double-right.png' alt=''>"
            }
        },
        "ajax": function (data, callback, settings) {
            var requestData = {
                start: data.start,      // Offset (where to start)
                length: data.length,    // Number of records per page
                search: data.search.value, // Search term (if any)
                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
                screenId: 'Vendor_102',//Need to change the screen id as per your data
                modelData: jsonString
            };

            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
                if (response && response.data) {
                    callback({
                        draw: data.draw,
                        recordsTotal: response.data.TotalRecords,   // Total records in DB
                        recordsFiltered: response.data.FilteredRecords, // Filtered count
                        data: response.data.Records // Actual page data
                    });
                }
            }, false);
        },
        "drawCallback": function () {
            $('.dropdown-toggle').dropdown(); // Reinitialize dropdowns after draw
        },
        "columns": [
            {
                "data": "PA_NAME",
                "render": function (data, type, row) {
                    return `<td><a href="ViewVendor?auth=${AuthToken}&id=${row.ID}" class="d-flex justify-content-between text-primary font-weight-bold" data-toggle="tooltip" title="${data}">
                        <strong>${data}</strong>
                        <span><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span>
                    </a></td>`;
                }
            },
            { "data": "ShipCity" },
            //{
            //    "data": "DOCDate",
            //    "orderable": true,
            //    "render": function (data, type, row) {
            //        if (type === "display" || type === "filter") {
            //            return "<label>" + ChangeDateFormatToddMMYYYWithSlace(data) + "</label>";
            //        }
            //        return data; // Ensure sorting works using raw data
            //    }
            //},

            { "data": "Phone" },
            { "data": "Createdat" },
            { "data": "NoOfItems" },
            { "data": "NoOfPOReceived" },
            { "data": "MaterialCategory" },
            { "data": "LifeTimePurValue" },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {
                    var strReturn = "";
                    //Click to DeActivate                     
                    //Click to Activate                      
                    if (row.StatusId == 0)// Pending
                    {
                        strReturn = '<span class="align-self-center badge badge-warning  ">Pending</span> ';
                    }
                    else if (row.StatusId == 1) //Approved
                    {
                        strReturn = '<span class="align-self-center badge badge-success  ">Approved</span> ';
                    }
                    else if (row.StatusId == 2) //Rejected
                    {
                        strReturn = '<span class="align-self-center badge badge-danger  ">Rejected</span> ';
                    }

                    return strReturn;
                }
            },
            //{
            //    "orderable": false,
            //    "data": null,
            //    "render": function (data, type, row) {
            //        var isInactiveAction = "";
            //        if (row.StatusId == 1) {
            //            isInactiveAction = '<input type="hidden" value="' + row.DocNo + '" id="hdnVendorId_' + row.ID + '" /><a class="dropdown-item" href="CreateVendor?id=' + row.ID + '">Edit</a> <a onclick=OpenIndentPopup(' + row.ID + ') class="dropdown-item" hrefdata-toggle="modal"data-target="#deletepopup">Inactive</a>';
            //        }
            //        return '<div class="dropdown">' +
            //            '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
            //            '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
            //            '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="ViewVendor?id=' + row.ID + '">View Details</a>' +
            //            isInactiveAction + ' <a  class="dropdown-item" href="../purchaseorder/index.html" aclass="dropdown-item" href="#">Create Purchase Order</a></div>' +
            //            '</div>';


            //    }
            //}

            //{
            //    "orderable": false,
            //    "data": null,
            //    "render": function (data, type, row) {
            //        var isInactiveAction = "";
            //        if (row.StatusId == 1) {
            //            isInactiveAction = '<input type="hidden" value="' + row.DocNo + '" id="hdnVendorId_' + row.ID + '" /><a class="dropdown-item" href="CreateVendor?id=' + row.ID + '">Edit</a> <a onclick=OpenIndentPopup(' + row.ID + ') class="dropdown-item" hrefdata-toggle="modal"data-target="#deletepopup">Inactive</a>';
            //        }

            //        return '<td class="text-center it">' +
            //            '<div class="d-flex justify-content-center gap-15">' +
            //            '<a href="edit-create-vendor.html" class="align-self-center">' +
            //            '<img src="../assets/images/icons/help/edit-icon.png" class="icon-xsm">' +
            //            '</a>' +

            //            // Checkbox and label for active status
            //            '<input type="checkbox" class="checkbox" id="active" >' +
            //            '<label for="active" class="checkbox-label" data-toggle="modal" data-target="#deletepopup">' +
            //            '<img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">' +
            //            '<img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">' +
            //            '<span class="ball"></span>' +
            //            '</label>' +
            //            '</div>' +
            //            '</td>' +
            //            '<div class="dropdown">' +
            //            '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
            //            '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
            //            '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">' +
            //            '<a class="dropdown-item" href="ViewVendor?id=' + row.ID + '">View Details</a>' +
            //            isInactiveAction +
            //            '<a class="dropdown-item" href="../purchaseorder/index.html">Create Purchase Order</a>' +
            //            '</div>' +
            //            '</div>';
            //    }
            //}

        ]
    });
}

function GetVendorDetById(vendorId) {
    var model = {
        ID: vendorId
    };
    const jsonString = JSON.stringify(model);
    var ScreenID = "Vendor_101";
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var tableData = response.data.data.Table;
        var tableData1 = response.data.data.Table1;
        
        if (tableData && tableData.length > 0) {
            $("#hdnVendorId").val(tableData[0].PA_ID);

            if ($("#hdnPageStatus").val() == 'View Vendor') {
                $("#vendorName").text(tableData[0].PA_Name);
                $("#vendorEmailId").text(tableData[0].Email);
                $("#gstIn").text(tableData[0].TAX_TAN2);
                $("#tanNo").text(tableData[0].TAX_TAN1);
                $("#panNo").text(tableData[0].TAX_PAN);
                $("#contactName").text(tableData[0].ContactPersonName);
                $("#contactNo").text(tableData[0].ContactPhoneNo);
                $("#emailId").text(tableData[0].ContactEmailId);

                $("#sAdd1").text(tableData[0].SHIP_ADD1);
                $("#sAdd2").text(tableData[0].SHIP_ADD2);
                $("#sCity").text(tableData[0].ShipCity);
                $("#sState").text(tableData[0].SStateCountryPin);

                $("#bAdd1").text(tableData[0].BILL_ADD1);
                $("#bAdd2").text(tableData[0].BILL_ADD2);
                $("#bCity").text(tableData[0].BillCity);
                $("#bState").text(tableData[0].BStateCountryPin);

                $('#chkSameAddress').prop('checked', tableData[0].IsAddressSame === 'Yes' ? true : false).trigger('change');

            }

            else {
                $('#txtVendorCode').val(tableData[0].PA_Code);
                $('#txtVendorCode').prop('readonly', true);
                $('#txtVendorName').val(tableData[0].PA_Name);

                /*$("#txtCompPhoneNo").val(tableData[0].Phone);*/
                $("#txtVendorEmailId").val(tableData[0].Email);
                $('#ddlPaymentTerms').val(tableData[0].DRCR_Days).trigger('change');

                var vendorType = tableData[0].OtherType;
                $('input[name="vendorType"][value="' + vendorType + '"]').prop('checked', true);

                $("#txtGSTNo").val(tableData[0].TAX_TAN2);
                $("#txtTANNo").val(tableData[0].TAX_TAN1);
                $("#txtPANNo").val(tableData[0].TAX_PAN);

                $("#txtSAddressLine1").val(tableData[0].SHIP_ADD1);
                $("#txtSAddressLine2").val(tableData[0].SHIP_ADD2);
                $("#txtSPincode").val(tableData[0].SHIP_PIN);
                $("#txtSCity").val(tableData[0].ShipCity);
                $("#ddlSState").val(tableData[0].ShipStateId).trigger('change');
                $('#ddlSCountry').val(tableData[0].ShipCountryId).trigger('change');

                $("#txtBAddressLine1").val(tableData[0].BILL_ADD1);
                $("#txtBAddressLine2").val(tableData[0].BILL_ADD2);
                $("#txtBPincode").val(tableData[0].BILL_PIN);
                $("#txtBCity").val(tableData[0].BillCity);
                $("#ddlBState").val(tableData[0].BillStateId).trigger('change');
                $('#ddlBCountry').val(tableData[0].BillCountryId).trigger('change');

                $('#chkSameAddress').prop('checked', tableData[0].IsAddressSame === 'Yes' ? true : false).trigger('change');

                // Now populate the contact persons
                if (tableData1.length > 0) {
                    PopulatePersonDetails(tableData1);
                }
            }

         
        }
        else {
            console.error("Record not found..", error);
        }

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
                <input type="number" class="form-control contact-phone" placeholder="Enter Phone Number" value="${vendor.PhoneNo}" required id="txtOtherCustPhoneNo_${index}">
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
        var shippingAddressLine1 = $('#txtSAddressLine1').val();
        var shippingAddressLine2 = $('#txtSAddressLine2').val();
        var shippingPincode = $('#txtSPincode').val();
        var shippingCity = $('#txtSCity').val();
        var shippingState = $('#ddlSState').val();
        var shippingCountry = $('#ddlSCountry').val();

        $('#txtBAddressLine1').val(shippingAddressLine1);
        $('#txtBAddressLine2').val(shippingAddressLine2);
        $('#txtBPincode').val(shippingPincode);
        $('#txtBCity').val(shippingCity);

        $('#ddlBState').val(shippingState).trigger('change');
        $('#ddlBCountry').val(shippingCountry).trigger('change');
    } else {
        $('#txtBAddressLine1').val('');
        $('#txtBAddressLine2').val('');
        $('#txtBPincode').val('');
        $('#txtBCity').val('');
        $('#ddlBState').val('0').trigger('change');
        $('#ddlBCountry').val('0').trigger('change');
    }
}


let contactList = [];  // Initialize an empty array to hold all contacts
let maxPersonCount = 0; // Keep track of dynamic rows

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
        alert("Please fill out all fields (Name, Phone, and Email)!");
        return false;
    }

    // Validate phone number format
    if (!validatePhoneNumber(staticPhone)) {
        alert("Please enter a valid phone number (10 digits).");
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
        <input type="number" class="form-control contact-phone validateOtherCust" placeholder="Enter Phone Number" required id="txtOtherCustPhoneNo_${maxPersonCount}">
        <span id="sptxtOtherCustPhoneNo_${maxPersonCount}" class="text-danger field-validation-error" style="display:none;">Oops! Looks like you missed this field.</span>
    </div>
    <div class="form-group">
        <label>Email Id</label>
        <input type="email" class="form-control contact-email validateOtherCust" placeholder="Enter Email id" required id="txtOtherCustEmailId_${maxPersonCount}">
        <span id="sptxtOtherCustEmailId_${maxPersonCount}" class="text-danger field-validation-error" style="display:none;">Oops! Looks like you missed this field.</span>
    </div>
    `;

    // Append the new dynamic row to the container
    container.appendChild(newDiv);
}

// Function to collect all contact data (static + dynamic)
function collectAndValidateContacts() {
    contactList = []; // Clear the list first

    let allValid = true;
    // Validate and collect static contact
    const staticName = document.getElementById('txtPersonName_0').value.trim() || '';
    const staticPhone = document.getElementById('txtPhoneNo_0').value.trim() || '';
    const staticEmail = document.getElementById('txtEmailId_0').value.trim() || '';

    /*validateStaticFields(staticName, staticPhone, staticEmail, 0)*/
    if (!validateContactFields(staticName, staticPhone, staticEmail, 0)) allValid = false;

    //contactList.push({
    //    ID: parseInt(document.getElementById('hdnContPersonId_0').value),
    //    PersonName: staticName,
    //    PhoneNo: staticPhone,
    //    EmailId: staticEmail
    //});

    // Validate and collect dynamic contacts
    const dynamicRows = document.querySelectorAll('.dynamic-row');
    const tempContactList = [];

    dynamicRows.forEach(row => {
        const personId = row.getAttribute('data-person-id');
        const name = document.getElementById(`txtOtherCustName_${personId}`).value.trim() || '';
        const phone = document.getElementById(`txtOtherCustPhoneNo_${personId}`).value.trim() || '';
        const email = document.getElementById(`txtOtherCustEmailId_${personId}`).value.trim() || '';

        if (!name && !phone && !email) return; // Skip empty dynamic rows
        if (!validateContactFields(name, phone, email, personId)) {
            allValid = false;
            return;
        }

        tempContactList.push({
            ID: parseInt(document.getElementById(`hdnContPersonId_${personId}`).value),
            PersonName: name,
            PhoneNo: phone,
            EmailId: email
        });
    });

    if (!allValid) return false;

    contactList.push({
        ID: parseInt(document.getElementById('hdnContPersonId_0').value),
        PersonName: staticName,
        PhoneNo: staticPhone,
        EmailId: staticEmail
    });

    contactList = contactList.concat(tempContactList);
    return true;

    console.log(contactList);
}

function removeDiv(button) {
    button.closest('.dynamic-row').remove();
}
function SaveVendor() {
    if (checkValidationOnSubmit('Mandatory') == true) {

        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test($("#txtVendorEmailId").val())) {
            alert("Please enter a valid vendor email address.");
            return;
        }

        var id = parseInt($("#hdnVendorId").val());
        if (!collectAndValidateContacts()) return; // Stop if validation fails

        console.log(contactList);
        var model = {
            Id: id > 0 ? id : 0,
            VendorCode: $("#txtVendorCode").val(),
            VendorName: $("#txtVendorName").val(),
            VendorEmailId: $("#txtVendorEmailId").val(),
            PaymentTermsId: $("#ddlPaymentTerms").val(),
            VendorType: $('input[name="vendorType"]:checked').val(),

            GSTNo: $("#txtGSTNo").val(),
            TANNo: $("#txtTANNo").val(),
            PANNo: $("#txtPANNo").val(),

            ShipAdd1: $("#txtSAddressLine1").val(),
            ShipAdd2: $("#txtSAddressLine2").val(),
            ShipPin: $("#txtSPincode").val(),
            ShipCity: $("#txtSCity").val(),
            ShipState: $("#ddlSState option:selected").text(),
            ShipCountryId: $("#ddlSCountry").val(),

            BillAdd1: $("#txtBAddressLine1").val(),
            BillAdd2: $("#txtBAddressLine2").val(),
            BillPin: $("#txtBPincode").val(),
            BillCity: $("#txtBCity").val(),
            BillState: $("#ddlBState option:selected").text(),
            BillCountryId: $("#ddlBCountry").val(),
            IsAddressSame: $('#chkSameAddress').prop('checked') ? "Yes" : "No",

            ContactPersonList: contactList
        };
        // Convert the model to JSON string
        const jsonString = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "Vendor_101",
            Operation: id > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                ClearFormControl();
                RedirectVendorList();
            }
        });
    }
}
function RedirectVendorList() {
    var url = "/MaterialManagement/Material/Vendor?auth=" + AuthToken;
    window.location.href = url;
}

function ClearFormControl() {
    $('#hdnVendorId').val(0);

    $('#txtPersonName_0').val('');
    $('#txtPhoneNo_0').val('');
    $('#txtEmailId_0').val('');

    $('#txtVendorName').val('');
    $('#txtVendorEmailId').val('');
    $('#ddlPaymentTerms').val('0').trigger('change');
    $('input[name="vendorType"]').prop('checked', false);
    $('#txtGSTNo').val('');
    $('#txtTANNo').val('');
    $('#txtPANNo').val('');

    $('#txtSAddressLine1').val('');
    $('#txtSAddressLine2').val('');
    $('#txtSPincode').val('');
    $('#txtSCity').val('');
    $('#ddlSState').val('0').trigger('change');
    $('#ddlSCountry').val('0').trigger('change');

    $('#txtBAddressLine1').val('');
    $('#txtBAddressLine2').val('');
    $('#txtBPincode').val('');
    $('#txtBCity').val('');
    $('#ddlBState').val('0').trigger('change');
    $('#ddlBCountry').val('0').trigger('change');

    $('#chkSameAddress').prop('checked', false);
    localStorage.removeItem('contactList');
}

function VendorApprove() {
    VendorStatus(1);
}
function VendorReject() {
    VendorStatus(2);

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
        ScreenID: "Vendor_102",
        Operation: Id > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            RedirectVendorList();
        }
    });
}

function PhoneNumberValidation() {
    var phone = $('#txtPhoneNo_0').val();
    if (phone.length < 10) {
        $('#sptxtPhoneNo').text("Phone number must be at least 10 digits.").show();
    } else {
        $('#sptxtPhoneNo').hide();
        //alert("Valid Phone Number: " + phone);
    }
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
        return false;
    }
    var gstinformat = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9]{1}$');

    if (gstinformat.test(inputvalues)) {
        document.getElementById('spVendorGTMNumberErrorMsg').innerHTML = '';
        return true;
    } else {
        document.getElementById('spVendorGTMNumberErrorMsg').innerHTML = 'Please Enter Valid GSTIN Number';
        $(".txtGSTNo").val('');
        $(".txtGSTNo").focus();
    }
}
function PanNumberValidation() {
    var panNumber = $('#txtPANNo').val().toUpperCase();
    if (panNumber == "") {
        document.getElementById('spPanError').innerHTML = '';
        return false;
    }
    var panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (panPattern.test(panNumber)) {
        document.getElementById('spPanError').innerHTML = '';
    } else {
        $('#spPanError').text('Invalid PAN Number. Format: AAAAA9999A');
    }
}

function TANNumberValidation() {
    var tanNumber = $('#txtTANNo').val().toUpperCase();
    if (tanNumber == "") {
        document.getElementById('spTANError').innerHTML = '';
        return false;
    }
    var tanPattern = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;

    if (tanPattern.test(tanNumber)) {
        document.getElementById('spTANError').innerHTML = '';
    } else {
        $('#spTANError').text('Invalid TAN Number. Format: AAAA99999A');
    }
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

    $.ajax({
        url: '/Material/BulkUploadVendors',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#customLoader").hide();
            if (response.success) {
                ItemsArray = response.data;
            }
        },
        error: function () {
            $("#customLoader").hide();
        }
    });
}
function SaveBulkUploadDocument() {
    if (ItemsArray.length > 0) {
        var ValidateItemsArray = ItemsArray.filter(item =>
            ![
                item.BPCode.trim(),
                item.BPName.trim(),
                item.EmailId.trim(),
                item.PaymentTerms.trim(),
                item.BPType.trim(),
                item.GSTNumber.trim(),
                item.PANNumber.trim(),
                item.TANNumber.trim(),
                item.Billing1AddressLine1.trim(),
                item.Billing1AddressLine2.trim(),
                item.Billing1Pincode.trim(),
                item.Billing1City.trim(),
                item.Billing1State.trim(),
                item.Billing1Country.trim(), 
                item.Billing2AddressLine1.trim(),
                item.Billing2AddressLine2.trim(),
                item.Billing2Pincode.trim(),
                item.Billing2City.trim(),
                item.Billing2State.trim(),
                item.Billing2Country.trim() 
            ].some(value => value === "")
        );

       
        var ErrorItemsArray = ItemsArray.filter(item =>
            [
                item.BPCode.trim(),
                item.BPName.trim(),
                item.EmailId.trim(),
                item.PaymentTerms.trim(),
                item.BPType.trim(),
                item.GSTNumber.trim(),
                item.PANNumber.trim(),
                item.TANNumber.trim(),
                item.Billing1AddressLine1.trim(),
                item.Billing1AddressLine2.trim(),
                item.Billing1Pincode.trim(),
                item.Billing1City.trim(),
                item.Billing1State.trim(),
                item.Billing1Country.trim(),
                item.Billing2AddressLine1.trim(),
                item.Billing2AddressLine2.trim(),
                item.Billing2Pincode.trim(),
                item.Billing2City.trim(),
                item.Billing2State.trim(),
                item.Billing2Country.trim() 
            ].some(value => value === "")
        );
        // Function to find empty fields in each object
        const specificColumns = ["BPCode","BPName", "EmailId", "PaymentTerms", "BPType",
            "GSTNumber", "PANNumber", "TANNumber", "Billing1AddressLine1", "Billing1AddressLine2",
            "Billing1Pincode", "Billing1City", "Billing1State", "Billing1Country", "Billing2AddressLine1"
            , "Billing2AddressLine2", "Billing2Pincode","Billing2City", "Billing2State", "Billing2Country"]; // Replace with actual column names

        var emptyColumnsArray = ErrorItemsArray.map((item, index) => {
            let emptyColumns = specificColumns.filter(key => item[key] === "");
            return { rowNumber: index + 1, ID: item.ID, emptyColumns };
        }).filter(entry => entry.emptyColumns.length > 0);

        var model = {
            Items: ValidateItemsArray
        };

        const jsonString = JSON.stringify(model);
        let GenericModeldata =
        {
            ScreenID: "BulkVendorUpload_101",
            Operation: "A",
            ModelData: jsonString
        };
        ShowLoadingDialog()
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            ShowandCloseLoader();
            $('#upload').hide();
            findEmptyColumns(emptyColumnsArray);
            $('#fileLimitPopup').hide();
            GetVendorList();
            
        });
        
    }
}
function findEmptyColumns(emptyColumnsArray) {
    if (emptyColumnsArray.length > 0) {
        var tableHTML = `<table style="overflow:scroll;">
                                <tr>
                                    <th>Row No</th>
                                    <th>Empty Columns</th>
                                </tr>`;

        emptyColumnsArray.forEach(entry => {
            tableHTML += `<tr>
                                <td>${entry.rowNumber}</td>
                                <td>${entry.emptyColumns.join(", ")}</td>
                              </tr>`;
        });

        tableHTML += `</table>`;
        document.getElementById("alertContent").innerHTML = tableHTML;
        document.getElementById("customAlert").style.display = "block";
        $("#customAlert").height(500);
        $("#customAlert").css("overflow", "scroll");
        document.getElementById("overlay").style.display = "block";
    }
}
function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
function ExportItemsData() {
    // Get the table element

    let ws_data = [];

    // Extract headers
    let headers = [];
    $("#default thead tr th").each(function () {
        headers.push($(this).clone().children().remove().end().text().trim()); // Remove <span> inside <th>
    });
    ws_data.push(headers); // Add headers to worksheet

    // Extract table rows
    $("#ItemMasterList tr").each(function () {
        let rowData = [];
        $(this).find("td").each(function () {
            rowData.push($(this).text().trim()); // Get text content of each cell
        });
        if (rowData.length > 0) ws_data.push(rowData); // Add row to worksheet
    });

    // Create worksheet and workbook
    let ws = XLSX.utils.aoa_to_sheet(ws_data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Items");

    // Save the file
    XLSX.writeFile(wb, "ItemMasterList.xlsx");

}