$(document).ready(function () {

    //#region : Code for Customer Gried
    LoadMasterDropdown('ddlStatus', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 3,
        manualTableId: 0,
        ScreenId: "Customer_102"
    }, 'All', false);

    
    //var obj1 = {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 97,
    //    manualTableId: 0,
    //    ScreenId: 'DropdownList_101'
    //}
    //LoadMasterDropdown('ddlNBDUser', obj1, 'Select', false);
    //LoadMasterDropdown('ddlNBDUserList', obj1, 'Select', false);

    //var obj2 = {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 98,
    //    manualTableId: 0,
    //    ScreenId: 'DropdownList_101'
    //}
    //LoadMasterDropdown('ddlCRRUser', obj2, 'Select', false);

    
});

var customerTable;
 
function ExportCustomerItemsData() {
    // Get the table element

    let ws_data = [];
    ws_data = exceldata.map(item => ({
        BPCode: item.CustCode,//1
        BPName: item.CompName,//1
        BPType: 'C',//1
        PhoneNumber: item.Phone,//1
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
        PhoneNumber: item.Phone,//1
        EmailId: item.EMAIL,//1
        PaymentTerms: item.DRCR_DAYS,//1
        DefaultCurrency: item.Currency,//1
        LeadSource: item.LeadSource,//1
        NBD: item.NBDUser,//1
        CRR: item.CRRUser//1        
    }));
    downloadExcelFromJson(ws_data, 'CustomerList.xlsx')
    // Extract headers
    //let headers = [];
    //$("#tblCustomerList thead tr th").each(function () {
    //    headers.push($(this).clone().children().remove().end().text().trim()); // Remove <span> inside <th>
    //});
    //ws_data.push(headers); // Add headers to worksheet

    //// Extract table rows
    //$("#tblCustomerList tr").each(function () {
    //    let rowData = [];
    //    $(this).find("td").each(function () {
    //        rowData.push($(this).text().trim()); // Get text content of each cell
    //    });
    //    if (rowData.length > 0) ws_data.push(rowData); // Add row to worksheet
    //});

    //// Create worksheet and workbook
    //let ws = XLSX.utils.aoa_to_sheet(ws_data);
    //let wb = XLSX.utils.book_new();
    //XLSX.utils.book_append_sheet(wb, ws, "Items");

    //// Save the file
    //XLSX.writeFile(wb, "CustomerList.xlsx");

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

// Function to handle file upload and preview
var ItemsArray = [];
function UploadVendorExcel() {
    var fileInput = $("#fileUpload")[0].files[0];

    if (!fileInput) {
        alert("Please select an Excel file.");
        return;
    }

    var formData = new FormData();
    formData.append("file", fileInput);

    //$.ajax({
    //    url: '/Material/UploadVendorExcelFile',
    //    type: 'POST',
    //    data: formData,
    //    contentType: false,
    //    processData: false,
    //    success: function (response) {
    //        if (response.success) {
    //            ItemsArray = response.data;
    //        }
    //    },
    //    error: function () {

    //    }
    //});
}
function splitArrayIntoChunks(array, chunkSize = 1000) {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}
  function SaveBulkUploadDocument() {
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
            return { rowNumber: index + 1, BPName: item.BPName,  emptyColumns };
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
       // GetCustomerList();
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
function VendorPopup() {
    $('#btnExcelUpload').hide();
    $('#upload').modal('show');
}

var exceldata = [];

 
//AGgried Data

function bindCustomerGridFilter() {

    let filterData = tableData;

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    if (Status != '0') {

        filterData = filterData.filter(row => row.StatusId == Status);
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindCustomerGrid();

    function bindCustomerGrid() {
        $("#customLoader").show();

        //Replaceable content
        //Start
        var requestData = {
            start: 0,
            length: 20000000,
            search: '',
            orderColumn: null,
            orderDir: "asc",
            screenId: 'Customer_102',//Need to change the screen id as per your data
            //modelData: jsonString,
            modelData: JSON.stringify({
                Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
                CustCode: $("#txtCustCode").val(),
                CompName: $("#txtCompName").val(),
                BrandName: $("#txtBrandName").val()
            })
        };
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tableData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'CustomerGried', columnMeta, tableData);
            $("#customLoader").hide();
        });
    }

});


//#endregion

//#region : Bulk upload NBD, CRR user

var formId = 0;
var NBD_CRRUserId = 0;

var NBDUserList = [];
var CRRUserList = [];
var SalesUserList = [];

function LoadBulkNBDCRRUserDropdown() {
    var model = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 97,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    };

    CommonAjaxMethod(virtualPath + 'Generic/GetDropDownWithAsync', model, 'GET', function (response) {
        if (!response || !response.data || !response.data.data) {
            FailToaster("Invalid dropdown data.");
            return;
        }

        // Assign global lists directly from response
        NBDUserList = response.data.data.Table || [];
        CRRUserList = response.data.data.Table1 || [];

        // NBD dropdown
        var $eleNBD = $('#ddlNBDUser');
        $eleNBD.empty().append($('<option/>').val('').text('Select'));
        $.each(NBDUserList, function (ii, vall) {
            $eleNBD.append(
                $('<option/>')
                    .val(vall.ID)
                    .text(vall.ValueName)
                    .attr('data-code', vall.ValueCode)  // Bind data-code here
            );
        });

        // CRR dropdown
        var $eleCRR = $('#ddlCRRUser');
        $eleCRR.empty().append($('<option/>').val('').text('Select'));
        $.each(CRRUserList, function (ii, vall) {
            $eleCRR.append(
                $('<option/>')
                    .val(vall.ID)
                    .text(vall.ValueName)
                    .attr('data-code', vall.ValueCode)
            );
        });

        // NBD User List dropdown (same data as NBDUserList)
        var $eleNBDList = $('#ddlNBDUserList');
        $eleNBDList.empty().append($('<option/>').val('').text('Select'));
        $.each(NBDUserList, function (ii, vall) {
            $eleNBDList.append(
                $('<option/>')
                    .val(vall.ID)
                    .text(vall.ValueName)
                    .attr('data-code', vall.ValueCode)
            );
        });
    });
}

function LoadSalesUserDropdown() {
    var model = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 96,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    };

    CommonAjaxMethod(virtualPath + 'Generic/GetDropDownWithAsync', model, 'GET', function (response) {
        if (!response || !response.data || !response.data.data) {
            FailToaster("Invalid dropdown data.");
            return;
        }

        // Assign global lists directly from response
        SalesUserList = response.data.data.Table || [];
    });
}

function bindCustomerListByUserType() {
    let formId = 0;
    let NBD_CRRUserId = 0;
    let $list;

    if ($("#ddlNBDUser").val() > 0) {
        formId = 1;
        NBD_CRRUserId = $("#ddlNBDUser").val();
        $list = $(".check-list.nbd-list"); // NBD container UL
    } else if ($("#ddlCRRUser").val() > 0) {
        formId = 2;
        NBD_CRRUserId = $("#ddlCRRUser").val();
        $list = $(".check-list.crr-list"); // CRR container UL
    } else if ($("#ddlNBDUserList").val() > 0) {
        formId = 1;
        NBD_CRRUserId = $("#ddlNBDUserList").val();
        $list = $(".check-list.crr-list"); // CRR,NBD container UL
    } else {
        formId = 0;
        NBD_CRRUserId = 0;
    }

    if (NBD_CRRUserId > 0) {
        const model = {
            ID: NBD_CRRUserId,
            OtherId: 0,
            FormId: formId
        };
        const jsonString = JSON.stringify(model);

        CommonAjaxMethod(
            virtualPath + 'Generic/GetRecordsAsync',
            { modelData: jsonString, screenId: 'ERPGetTableData_101' },
            'GET',
            function (response) {
                let tblCustomerList = response.data.data.Table;

                // Clear the list first
                $list.empty();

                // Add Select All checkbox
                const selectAllLi = `
                    <li class="check-list-item">
                        <input type="checkbox" id="selectall_${formId}" name="type" value="">
                        <label for="selectall_${formId}">
                            <strong>Select All</strong> 
                            <span class="d-block sub-text"></span>
                        </label>
                    </li>
                `;
                $list.append(selectAllLi);

                // Append customer checkboxes
                $.each(tblCustomerList, function (index, customer) {
                    let paName = customer.PA_Name || '';
                    let paCode = customer.PA_Code || '';
                    let tempId = customer.ID || '';
                    let checkboxId = "bulkassign_" + tempId;

                    let li = `
                       <li class="check-list-item">
                            <input type="checkbox"
                                   id="${checkboxId}" 
                                   class="checkselect" 
                                   name="type" 
                                   value="${tempId}" 
                                   data-code="${paCode}">
                            <label for="${checkboxId}">
                                <strong>${paName}</strong>
                                <span class="d-block sub-text">${paCode}</span>
                            </label>
                        </li>
                    `;

                    $list.append(li);
                });

                // Bind Select All functionality scoped to this list
                $list.off('change', `#selectall_${formId}`).on('change', `#selectall_${formId}`, function () {
                    $list.find('.checkselect').prop('checked', $(this).prop('checked'));
                });

                // Bind individual checkbox toggle to update Select All checkbox
                $list.off('change', '.checkselect').on('change', '.checkselect', function () {
                    if (!$(this).prop('checked')) {
                        $list.find(`#selectall_${formId}`).prop('checked', false);
                    } else if ($list.find('.checkselect:checked').length === $list.find('.checkselect').length) {
                        $list.find(`#selectall_${formId}`).prop('checked', true);
                    }
                });
            }
        );
    }
}

function RessignUserList(type) {
    var validationGroup = type === "NBD" ? 'MandatoryNBDReassign' : 'MandatoryCRRReassign';

    // Detect which dropdown is selected
    var selectedUserId = 0;
    var selectedUserName = '';
    var selectedUserCode = '';

    if ($("#ddlNBDUser").val() && $("#ddlNBDUser").val() !== "Select") {
        selectedUserId = $("#ddlNBDUser").val();
        selectedUserName = $("#ddlNBDUser option:selected").text();
        selectedUserCode = $("#ddlNBDUser option:selected").data('code');
    }
    else if ($("#ddlCRRUser").val() && $("#ddlCRRUser").val() !== "Select") {
        selectedUserId = $("#ddlCRRUser").val();
        selectedUserName = $("#ddlCRRUser option:selected").text();
        selectedUserCode = $("#ddlCRRUser option:selected").data('code');
    }
    else if ($("#ddlNBDUserList").val() && $("#ddlNBDUserList").val() !== "Select") {
        selectedUserId = $("#ddlNBDUserList").val();
        selectedUserName = $("#ddlNBDUserList option:selected").text();
        selectedUserCode = $("#ddlNBDUserList option:selected").data('code');
    } else {
        FailToaster("Please select a user to reassign from.");
        return;
    }

    var fromTextId = type === "NBD" ? '#fromNBDText' : '#fromCRRText';
    var reassignModalId = type === "NBD" ? '#nbdreassign' : '#crrreassign';
    var radioListId = type === "NBD" ? "#radioListNBD" : "#radioListCRR";

    if (checkValidationOnSubmit(validationGroup)) {
        var selectedCustomers = type === "NBD"
            ? $("#nbd .checkselect:checked")
            : $("#crr .checkselect:checked");

        if (selectedCustomers.length === 0) {
            FailToaster("Please select at least one customer to reassign.");
            return;
        }

        // Show From User text
        if (selectedUserName && selectedUserCode) {
            $(fromTextId).html(`<strong>From : ${selectedUserName}</strong> (${selectedUserCode})`);
        }

        // Filter out selected user from user list
        /*let userList = type === "NBD" ? NBDUserList : CRRUserList;*/
        let userList = SalesUserList;  /*Only take sales user*/
        let filteredList = userList.filter(user => user.ID != selectedUserId);

        // Bind radio buttons
        var $radioList = $(radioListId);
        $radioList.empty();

        if (filteredList.length === 0) {
            $radioList.html('<li class="text-muted">No available users for reassignment.</li>');
        } else {
            $.each(filteredList, function (index, user) {
                var radioId = `assign_${type}_${user.ID}`;
                var li = `
                    <li class="check-list-item">
                        <input type="radio" id="${radioId}" class="radio radioselect" name="assign_${type}" value="${user.ID}">
                        <label for="${radioId}">${user.ValueName}</label>
                    </li>`;
                $radioList.append(li);
            });

            $(reassignModalId).modal('show');
        }
    }
}

function filterUserList(type) {
    var searchText = type === "NBD"
        ? $("#searchInput").val().toLowerCase()
        : $("#searchInputcrr").val().toLowerCase();

    var radioListId = type === "NBD" ? "#radioListNBD" : "#radioListCRR";
    var $radioItems = $(radioListId).find("li");

    var anyVisible = false;

    $radioItems.each(function () {
        var labelText = $(this).text().toLowerCase();
        if (labelText.includes(searchText)) {
            $(this).show();
            anyVisible = true;
        } else {
            $(this).hide();
        }
    });

    // Show or hide "no results"
    var $noResults = $(radioListId).siblings(".no-results");
    if (!anyVisible) {
        $noResults.show();
    } else {
        $noResults.hide();
    }
}

function SaveReassignedCustomers(type) {
    var dropdownId = type === "NBD" ? '#ddlNBDUser' : '#ddlCRRUser';
    var selectedRadio = $(`input[name='assign_${type}']:checked`).val();

    if (!selectedRadio) {
        FailToaster("Please select a user to reassign the customers.");
        return;
    }

    // Scope checkbox selector to modal
    var selectedCustomers;
    if (type === "NBD") {
        selectedCustomers = $("#nbd .checkselect:checked");
    } else if (type === "CRR") {
        selectedCustomers = $("#crr .checkselect:checked");
    }

    if (selectedCustomers.length === 0) {
        FailToaster("Please select at least one customer to reassign.");
        return;
    }

    var fromUserId = $(dropdownId).val();
    var custList = [];

    selectedCustomers.each(function () {
        var val = $(this).val();
        if (val) {
            custList.push({ CustId: val });
        }
    });

    if (custList.length === 0) {
        FailToaster("Please select at least one customer to reassign.");
        return;
    }

    var reassignModel = {
        Type: type,
        FromNBDUserId: fromUserId,
        ToNBDUserId: selectedRadio,
        CustList: custList
    };

    const jsonString = JSON.stringify(reassignModel);

    let GenericModeldata = {
        ScreenID: "ERPBulkUpdateCustNBDCRRUser_101",
        Operation: "U",
        ModelData: jsonString
    };

    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            ClearBulkFormNBDCRRUser();
            setTimeout(function () {
                RedirectCustomerList();
            }, 2000);
            
        } else {
            FailToaster("Failed to reassign customers.");
        }
    });
}

function RedirectCustomerList() {
    var url = "/BusinessPartner/CustomerList?auth=" + AuthToken;
    window.location.href = url;
}

function ClearBulkFormNBDCRRUser() {
    $('#nbd, #nbdreassign, #crr, #crrreassign').modal('hide');
    $('#ddlNBDUser, #ddlCRRUser, #ddlNBDUserList').val('Select').trigger('change');;
    $('#spddlNBDUser, #spddlCRRUser').hide();
    $(".check-list, #radioList").empty();
    $("#fromNBDText").html('');
    $("#searchInput, #searchInputcrr").val('');
    $(".no-results").hide();
    $('#selectall').prop('checked', false);

    LoadBulkNBDCRRUserDropdown();
    LoadSalesUserDropdown();
}

function onCRRChange() {
    const selectedCRR = $('#ddlCRRUser').val();
    if (selectedCRR && selectedCRR !== '') {
        $('#ddlNBDUserList').prop('selectedIndex', 0).trigger('change');
    }
}

function onNBDListChange() {
    const selectedNBD = $('#ddlNBDUserList').val();
    if (selectedNBD && selectedNBD !== '') {
        $('#ddlCRRUser').prop('selectedIndex', 0).trigger('change');
    }
}

//#endregion