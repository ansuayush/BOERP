$(document).ready(function () {

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: 'POShortClose_101'
    }
    LoadMasterDropdown('ddlItemCode', obj1, 'Select', false);

    LoadMasterDropdown('ddlSupp', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: 'MaterialPurchase_101'
    }
    LoadMasterDropdown('ddlSupp', obj2, 'Select', false);

    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 18,
        manualTableId: 0,
        ScreenId: 'MaterialPurchase_101'
    }
    LoadMasterDropdown('ddlPONo', obj3, 'Select', false);

   // GetPOShortCloseList();

    // Debounced filter input
    $('#txtPONo').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblPOShortClose")) {
            POShortTable.ajax.reload();
        }
    }, 500));

});

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

var POShortTable;
//function GetPOShortCloseList() {

//    // Check if DataTable is already initialized, then destroy it
//    if ($.fn.DataTable.isDataTable("#tblPOShortClose")) {
//        $("#tblPOShortClose").DataTable().destroy();
//    }
//    POShortTable = $('#tblPOShortClose').DataTable({
//        scrollY: "400px",             // Vertical scroll
//        scrollX: true,                // Horizontal scroll to fix header/column alignment
//        scrollCollapse: true,
//        fixedHeader: true,
//        autoWidth: false,
//        "processing": true,
//        "serverSide": true,  // Enables server-side processing
//        "paging": true,
//        "pagingType": "full_numbers",
//        "pageLength": 10,
//        "lengthMenu": [10, 20, 30, 40, 50],
//        "ordering": true,
//        "info": true,
//        "autoWidth": false,
//        "responsive": true,
//        "dom": '<"top">rt<"bottom"lip><"clear">',
//        "language": {
//            "paginate": {
//                "first": "<img src='../../assets/images/icons/help/double-left.png' alt=''>",
//                "previous": "<img src='../../assets/images/icons/help/arrow-left.png' alt=''>",
//                "next": "<img src='../../assets/images/icons/help/arrow-right.png' alt=''>",
//                "last": "<img src='../../assets/images/icons/help/double-right.png' alt=''>"
//            }
//        },
//        "ajax": function (data, callback, settings) {
//            var requestData = {
//                start: data.start,      // Offset (where to start)
//                length: data.length,    // Number of records per page
//                search: data.search.value, // Search term (if any)
//                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
//                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
//                screenId: 'POShortClose_101',//Need to change the screen id as per your data
//                modelData: JSON.stringify({
//                    Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
//                    ItemId: $("#ddlItemCode").val() === 'Select' ? '0' : $("#ddlItemCode").val(),
//                    SupplierId: $("#ddlSupp").val() === 'Select' ? '0' : $("#ddlSupp").val(),
//                    POId: $("#ddlPONo").val() === 'Select' ? '0' : $("#ddlPONo").val(),
//                    PONo: $("#txtPONo").val()

//                })
//            };

//            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
//                if (response && response.data) {
//                    callback({
//                        draw: data.draw,
//                        recordsTotal: response.data.TotalRecords,   // Total records in DB
//                        recordsFiltered: response.data.FilteredRecords, // Filtered count
//                        data: response.data.Records // Actual page data
//                    });
//                }
//            }, false);
//        },
//        // Prevent sorting when clicking on search input fields
//        columnDefs: [
//            { orderable: false, targets: '_all' }
//        ],
//        "columns": [
//            //{"data": "Srno"},
//            {
//                "data": "PODetId", // For the checkbox column
//                "orderable": false,
//                "render": function (data, type, row) {
//                    return '<td class="text-center">' +
//                        '<input type="checkbox" class="row-checkbox" id="selecttwo-' + row.PODetId + '">' +
//                        '<label for="selecttwo-' + row.PODetId + '" class="single-check"></label>' +
//                        '<input type="hidden" id="hiddenPOId_' + row.PODetId + '" value="' + row.POId + '" />' +
//                        '<input type="hidden" id="hiddenItemId_' + row.PODetId + '" value="' + row.ItemId + '" />' +
//                        '<input type="hidden" id="hiddenBalanceQty_' + row.PODetId + '" value="' + row.BalanceQty + '" />' +
//                        '</td>';

//                }
//            },
//            {
//                "data": "PONo",
//                "render": function (data, type, row) {
//                    return '<a href="ViewPurchaseDocument?auth=' + AuthToken + '&id=' + row.POId + '&Status=' + row.StatusId + '" class="d-flex justify-content-between" data-toggle="tooltip" title="' + row.POId + '" data-item-id="' + row.POId + '">' +
//                        '<strong>' + row.PONo + '</strong>' +
//                        '<span><img src="../../assets/images/icons/help/edit.png" class="icon-xsm" alt="Edit"></span>'
//                    '</a>'
//                }
//            },
//            {
//                "data": "PODocDt",
//                "orderable": true,
//                "render": function (data, type, row) {
//                    if (type === "display" || type === "filter") {
//                        return "<label>" + ChangeDateFormatToddMMYYYWithSlace(data) + "</label>";
//                    }
//                    return data; // Ensure sorting works using raw data
//                }
//            },
//            { "data": "SupplierName" },
//            { "data": "ItemCode" },
//            { "data": "ItemName" },
//            { "data": "POQty", "className": "text-right" },
//            { "data": "GRNQty", "className": "text-right" },
//            { "data": "BalanceQty", "className": "text-right" },
//            {
//                "data": null,
//                "render": function (data, type, row) {
//                    if (row.ShortCloseQty > 1) {
//                        return '<td class=""> <input type="text" class="form-control text-right numeric-decimal-restrict" placeholder="0" value = "' + row.ShortCloseQty + '" id="shortCloseQty_' + row.PODetId + '" disabled  /></td>';
//                    } else {
//                        return '<td class=""> <input type="text" class="form-control text-right numeric-decimal-restrict" placeholder="0" value = "" id="shortCloseQty_' + row.PODetId + '" disabled  /></td>';
//                    }
//                }
//            },
//            {
//                "data": null,
//                "render": function (data, type, row) {
//                    return '<td class=""> <input type="text" class="form-control" placeholder="Enter" value = "' + row.ShortCloseRemark + '" id="remark_' + row.PODetId + '" disabled  /></td>';
//                }
//            }

//        ]
//    });

//    // Dynamically adjust the visibility of the checkbox column based on the dropdown value
//    toggleCheckboxColumn();

//    TableSetup(POShortTable);
//}

// Function to toggle checkbox column visibility based on status
function toggleCheckboxColumn() {
    var status = $("#ddlStatus").val();
    var table = $('#tblPOShortClose').DataTable();

    if (status === '2') { // 'Completed' status
        table.column(0).visible(false); // Hide checkbox column
        $('.hidebutton').hide();  // Hide the button
    } else {
        table.column(1).visible(true); // Show checkbox column
    }
}

$(document).on('change', '.row-checkbox', function () {
    const podetId = $(this).data('id');  // e.g. data-id="7914"
    const isChecked = $(this).prop('checked');

    // Enable/disable the corresponding inputs using data-id
    $(`.po-shortclose-input[data-id="shortCloseQty_${podetId}"]`).prop('disabled', !isChecked);
    $(`.po-shortclose-input[data-id="remark_${podetId}"]`).prop('disabled', !isChecked);

    // Optional: sync checkbox state
    const rowData = poShortCloseGlobalData.find(x => x.PODetId == podetId);
    if (rowData) rowData.isSelected = isChecked;

    // Show/hide submit button
    $('.hidebutton').toggle($('.row-checkbox:checked').length > 0);
});


//function getPOShortCloseData() {
//    let tableData = [];
//    let allValid = true; // Flag to track the validation status for all checkboxes

//    $('#tblPOShortClose tbody').find('input.row-checkbox:checked').each(function () {
//        var row = $(this).closest('tr');
//        var rowData = $('#tblPOShortClose').DataTable().row(row).data();

//        var shortCloseQty = parseFloat($('#shortCloseQty_' + rowData.PODetId).val()); // Use the specific ID for each row
//        var balanceQty = parseFloat(rowData.BalanceQty);

//        // Ensure that ShortCloseQty and Remark are filled if the checkbox is checked
//        if (!shortCloseQty || shortCloseQty <= 0) {
//            alert('Please correct the Short Close Qty value for the selected PO No: ' + rowData.PONo);
//            allValid = false;
//            return false;
//        }

//        if (shortCloseQty > balanceQty) {
//            alert('Short Close Qty cannot exceed Balance Qty for PO No: ' + rowData.PONo);
//            allValid = false;
//            return false;
//        }

//        var remark = $('#remark_' + rowData.PODetId).val();
//        if (!remark) {
//            alert('Please provide a remark for PO No: ' + rowData.PONo);
//            allValid = false;
//            return false;
//        }

//        // Add the valid row data to the tableData array
//        tableData.push({
//            POId: rowData.POId,
//            PODetId: rowData.PODetId,
//            ItemId: rowData.ItemId,
//            Qty: rowData.POQty,
//            BalanceQty: balanceQty,
//            AdjQty: shortCloseQty,
//            Remark: remark
//        });
//    });

//    // If any validation failed, return false
//    if (!allValid) {
//        return false;
//    }
//    console.log(tableData);
//    return tableData;
//}

function getPOShortCloseData() {
    let tableData = [];
    let allValid = true;

    $('input.row-checkbox:checked').each(function () {
        const podetId = $(this).data('id');
        const rowData = poShortCloseGlobalData.find(x => x.PODetId == podetId);

        if (!rowData) {
            console.warn('No matching record found for PODetId:', podetId);
            return true;
        }

        const shortCloseQty = parseFloat($(`.po-shortclose-input[data-id="shortCloseQty_${podetId}"]`).val()) || 0;
        const balanceQty = parseFloat(rowData.BalanceQty) || 0;
        const remark = $(`.po-shortclose-input[data-id="shortCloseQty_${podetId}"][data-field="ShortCloseRemark"]`).val() || '';

        // Validation
        if (shortCloseQty <= 0) {
            FailToaster('Please correct the Short Close Qty value for the selected PO No: ' + rowData.PONo);
            allValid = false;
            return false;
        }

        if (shortCloseQty > balanceQty) {
            FailToaster('Short Close Qty cannot exceed Balance Qty for PO No: ' + rowData.PONo);
            allValid = false;
            return false;
        }

        if (!remark.trim()) {
            FailToaster('Please provide a remark for PO No: ' + rowData.PONo);
            allValid = false;
            return false;
        }

        // Push valid data
        tableData.push({
            POId: rowData.POId,
            PODetId: rowData.PODetId,
            ItemId: rowData.ItemId,
            Qty: rowData.POQty,
            BalanceQty: balanceQty,
            AdjQty: shortCloseQty,
            Remark: remark
        });
    });

    if (!allValid) return false;

    console.log('Final Short Close Payload:', tableData);
    return tableData;
}

function UpdatePOShortCloseQty() {
    var POShortCloseData = getPOShortCloseData();

    // Only proceed if all rows were validated correctly
    if (POShortCloseData && POShortCloseData.length > 0) {
        var model = {
            POShortCloseList: POShortCloseData
        };

        // Convert the model to JSON string
        const jsonString = JSON.stringify(model);

        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "POShortClose_101",
            Operation: "U",
            ModelData: jsonString
        };

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                ClearFormControl();
               setTimeout(function () {
                   bindPOShortCloseGrid();
                }, 1000);

            } else {
                FailToaster('An error occurred while updating the data. Please try again.');
            }
        });
    }
    //else {
    //    FailToaster('Please ensure all required fields are filled correctly.');
    //}
}

function ClearFormControl() {
    $('#ddlItemCode').val('Select').trigger('change');
    $('#ddlPONo').val('Select').trigger('change');

    // Uncheck all row checkboxes
    $('.row-checkbox').prop('checked', false);

    // Disable and clear all short close textboxes and remarks
    //$('.shortclose-input').each(function () {
    //    $(this).val('');           // Clear value
    //    $(this).prop('disabled', true); // Disable input
    //});

    // Hide any submit button or actions if visible
    $('.hidebutton').hide();
}

function RedirectURL() {
    var url = "/MaterialManagement/Material/PurchaseOrderShortClose?auth=" + AuthToken;
    window.location.href = url;
}

///////////////////////////////////      PO Short Close AgGried     /////////////////////////////////////
function bindPOShortCloseGridFilter() {

    let filterData = tableData;

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    if (Status != '0') {

        filterData = filterData.filter(row => row.StatusId == Status);
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do

let poShortCloseGlobalData = []; // will store all records

document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindPOShortCloseGrid();
});

function bindPOShortCloseGrid() {
    $('#myGrid').html('');
    $("#customLoader").show();

    var status= $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'POShortClose_101',
        modelData: JSON.stringify({
            Status: status,
            ItemId: $("#ddlItemCode").val() === 'Select' ? '0' : $("#ddlItemCode").val(),
            SupplierId: $("#ddlSupp").val() === 'Select' ? '0' : $("#ddlSupp").val(),
            POId: $("#ddlPONo").val() === 'Select' ? '0' : $("#ddlPONo").val(),
            PONo: $("#txtPONo").val()

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        poShortCloseGlobalData = response.data.Records; // save globally

        gridOptions = bindAgGrid("#myGrid", 'POShortCloseGried', columnMeta, tableData);
        $("#customLoader").hide();

        if (status == 2){
            hideFirstColumn();
        }
    });
}
function hideFirstColumn() {
    // Get all columns from the grid
    const allColumns = gridOptions.columnApi.getAllColumns();

    if (allColumns && allColumns.length > 0) {
        const firstColumn = allColumns[0]; // get the first column object
        gridOptions.columnApi.setColumnVisible(firstColumn.colId, false); // hide it
    }

    $('.hidebutton').hide();
}
///////////////////////////////////      PO Short Close AgGried End     /////////////////////////////////////


