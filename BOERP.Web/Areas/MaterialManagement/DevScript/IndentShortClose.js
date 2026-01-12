$(document).ready(function () {

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: 'IndentShortClose_101'
    }
    LoadMasterDropdown('ddlItemCode', obj1, 'Select', false);

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 2,
        manualTableId: 0,
        ScreenId: 'IndentShortClose_101'
    }
    LoadMasterDropdown('ddlIndentNo', obj2, 'Select', false);

   // GetIndentShortCloseList();

    // Debounced filter input
    $('#txtIndentNo').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblIndentShortClose")) {
            indentTable.ajax.reload();
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

var indentTable;

//function GetIndentShortCloseList() {

//    // Check if DataTable is already initialized, then destroy it
//    if ($.fn.DataTable.isDataTable("#tblIndentShortClose")) {
//        $("#tblIndentShortClose").DataTable().destroy();
//    }
//    indentTable = $('#tblIndentShortClose').DataTable({
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
//                screenId: 'IndentShortClose_101',//Need to change the screen id as per your data
//                //modelData: jsonString,
//                modelData: JSON.stringify({
//                    Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
//                    ItemId: $("#ddlItemCode").val() === 'Select' ? '0' : $("#ddlItemCode").val(),
//                    IndentId: $("#ddlIndentNo").val() === 'Select' ? '0' : $("#ddlIndentNo").val(),
//                    IndentNo: $("#txtIndentNo").val()
                    
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
//                "data": "IndentDetId", // For the checkbox column
//                "orderable": false,
//                "render": function (data, type, row) {
//                    return '<td class="text-center ">' +
//                        '<input type="checkbox" class="row-checkbox" id="selecttwo-' + row.IndentDetId + '">' +
//                        '<label for="selecttwo-' + row.IndentDetId + '" class="single-check td-check-r-1024"></label>' +
//                        '<input type="hidden" id="hiddenIndentId_' + row.IndentDetId + '" value="' + row.IndentId + '" />' +
//                        '<input type="hidden" id="hiddenItemId_' + row.IndentDetId + '" value="' + row.ItemId + '" />' +
//                        '<input type="hidden" id="hiddenBalanceQty_' + row.IndentDetId + '" value="' + row.BalanceQty + '" />' +
//                        '</td>';

//                }
//            },
//            {
//                "data": "IndentNo",
//                "render": function (data, type, row) {
//                    return '<a href="/MaterialManagement/Material/ViewIndent?auth=' + AuthToken + '&id=' + row.IndentId + '&PageType=IndentSCList" class="d-flex justify-content-between" data-toggle="tooltip" title="' + row.IndentId + '" data-item-id="' + row.IndentId + '">' +
//                        '<strong>' + row.IndentNo + '</strong>' +
//                        '<span><img src="../../assets/images/icons/help/edit.png" class="icon-xsm" alt="Edit"></span>'
//                    '</a>'
//                }
//            },
//            {
//                "data": "IndentDt",
//                "orderable": true,
//                "render": function (data, type, row) {
//                    if (type === "display" || type === "filter") {
//                        return "<label>" + ChangeDateFormatToddMMYYYWithSlace(data) + "</label>";
//                    }
//                    return data; // Ensure sorting works using raw data
//                }
//            },
//            { "data": "ItemCode" },
//            { "data": "ItemName" },

//            { "data": "IndentQty", "className": "text-right" },
//            { "data": "POQty", "className": "text-right" },
//            { "data": "BalanceQty", "className": "text-right" },
//            {
//                "data": null,
//                "render": function (data, type, row) {
//                    if (row.ShortCloseQty > 1) {
//                        return '<td class=""> <input type="text" class="form-control text-right numeric-decimal-restrict" placeholder="0" value="' + row.ShortCloseQty + '" id="shortCloseQty_' + row.IndentDetId + '" disabled /></td>';
//                    } else {
//                        return '<td class=""> <input type="text" class="form-control text-right numeric-decimal-restrict" placeholder="0" value="" id="shortCloseQty_' + row.IndentDetId + '" disabled /></td>';
//                    }
//                }
//            },
//            {
//                "data": null,
//                "render": function (data, type, row) {
//                    return '<td class=""> <input type="text" class="form-control" placeholder="Enter" value = "' + row.ShortCloseRemark + '" id="remark_' + row.IndentDetId + '" disabled  /></td>';
//                }
//            }

//        ]
//    });

//    // Dynamically adjust the visibility of the checkbox column based on the dropdown value
//    toggleCheckboxColumn();

//    TableSetup(indentTable);
//}

// Function to toggle checkbox column visibility based on status
function toggleCheckboxColumn() {
    var status = $("#ddlStatus").val();
    var table = $('#tblIndentShortClose').DataTable();

    if (status === '2') { // 'Completed' status
        table.column(0).visible(false); // Hide checkbox column
        $('.hidebutton').hide();  // Hide the button
    } else {
        table.column(1).visible(true); // Show checkbox column
    }
}


$(document).on('change', '.row-checkbox', function () {
    const indentdetId = $(this).data('id');  // e.g. data-id="7914"
    const isChecked = $(this).prop('checked');

    // Enable/disable the corresponding inputs using data-id
    $(`.indent-shortclose-input[data-id="shortCloseQty_${indentdetId}"]`).prop('disabled', !isChecked);
    $(`.indent-shortclose-input[data-id="remark_${indentdetId}"]`).prop('disabled', !isChecked);

    // Optional: sync checkbox state
    const rowData = indentShortCloseGlobalData.find(x => x.IndentDetId == indentdetId);
    if (rowData) rowData.isSelected = isChecked;

    // Show/hide submit button
    $('.hidebutton').toggle($('.row-checkbox:checked').length > 0);
});

//function getIndentShortCloseData() {
//    let tableData = [];
//    let allValid = true; // Flag to track the validation status for all checkboxes

//    $('#tblIndentShortClose tbody').find('input.row-checkbox:checked').each(function () {
//        var row = $(this).closest('tr');
//        var rowData = $('#tblIndentShortClose').DataTable().row(row).data();

//        var shortCloseQty = parseFloat($('#shortCloseQty_' + rowData.IndentDetId).val()); // Use the specific ID for each row
//        var balanceQty = parseFloat(rowData.BalanceQty);

//        // Ensure that ShortCloseQty and Remark are filled if the checkbox is checked
//        if (!shortCloseQty || shortCloseQty <= 0) {
//            alert('Please correct the Short Close Qty value for the selected Indent No: ' + rowData.IndentNo);
//            allValid = false;
//            return false;
//        }

//        if (shortCloseQty > balanceQty) {
//            alert('Short Close Qty cannot exceed Balance Qty for Indent No: ' + rowData.IndentNo);
//            allValid = false;
//            return false;
//        }

//        var remark = $('#remark_' + rowData.IndentDetId).val();
//        if (!remark) {
//            alert('Please provide a remark for Indent No: ' + rowData.IndentNo);
//            allValid = false;
//            return false;
//        }

//        // Add the valid row data to the tableData array
//        tableData.push({
//            IndentId: rowData.IndentId,
//            IndentDetId: rowData.IndentDetId,
//            ItemId: rowData.ItemId,
//            Qty: rowData.IndentQty,
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

function getIndentShortCloseData() {
    let tableData = [];
    let allValid = true;

    $('input.row-checkbox:checked').each(function () {
        const indentdetId = $(this).data('id');
        const rowData = indentShortCloseGlobalData.find(x => x.IndentDetId == indentdetId);

        if (!rowData) {
            console.warn('No matching record found for IndentDetId:', indentdetId);
            return true;
        }

        const shortCloseQty = parseFloat($(`.indent-shortclose-input[data-id="shortCloseQty_${indentdetId}"]`).val()) || 0;
        const balanceQty = parseFloat(rowData.BalanceQty) || 0;
        const remark = $(`.indent-shortclose-input[data-id="shortCloseQty_${indentdetId}"][data-field="ShortCloseRemark"]`).val() || '';

        // Validation
        if (shortCloseQty <= 0) {
            FailToaster('Please correct the Short Close Qty value for the selected Indent No: ' + rowData.IndentNo);
            allValid = false;
            return false;
        }

        if (shortCloseQty > balanceQty) {
            FailToaster('Short Close Qty cannot exceed Balance Qty for Indent No: ' + rowData.IndentNo);
            allValid = false;
            return false;
        }

        if (!remark.trim()) {
            FailToaster('Please provide a remark for Indent No: ' + rowData.IndentNo);
            allValid = false;
            return false;
        }

        // Push valid data
        tableData.push({
            IndentId: rowData.IndentId,
            IndentDetId: rowData.IndentDetId,
            ItemId: rowData.ItemId,
            Qty: rowData.IndentQty,
            BalanceQty: balanceQty,
            AdjQty: shortCloseQty,
            Remark: remark
        });
    });

    if (!allValid) return false;

    console.log('Final Short Close Payload:', tableData);
    return tableData;
}
function UpdateIndentShortCloseQty() {
    var indentShortCloseData = getIndentShortCloseData();

    // Only proceed if all rows were validated correctly
    if (indentShortCloseData && indentShortCloseData.length > 0) {
        var model = {
            IndentShortCloseList: indentShortCloseData
        };

        // Convert the model to JSON string
        const jsonString = JSON.stringify(model);

        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "IndentShortClose_101",
            Operation: "U",
            ModelData: jsonString
        };

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                ClearFormControl();
                setTimeout(function () {
                    bindIndentShortCloseGrid();
                }, 1000);
            } else {
                FailToaster('An error occurred while updating the data. Please try again.');
            }
        });
    } 
    //else {
    //    alert('Please ensure all required fields are filled correctly.');
    //}
}

function ClearFormControl() {
    $('#ddlItemCode').val('Select').trigger('change');
    $('#ddlIndentNo').val('Select').trigger('change');

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
    var url = "/MaterialManagement/Material/IndentShortClose?auth=" + AuthToken;
    window.location.href = url;
}

///////////////////////////////////      Indent Short Close AgGried     /////////////////////////////////////
function bindPOShortCloseGridFilter() {

    let filterData = tableData;

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    if (Status != '0') {

        filterData = filterData.filter(row => row.StatusId == Status);
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do

let indentShortCloseGlobalData = []; // will store all records

document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindIndentShortCloseGrid();
});

function bindIndentShortCloseGrid() {
    $('#myGrid').html('');
    $("#customLoader").show();

    var status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'IndentShortClose_101',
        modelData: JSON.stringify({
            Status: status,
            ItemId: $("#ddlItemCode").val() === 'Select' ? '0' : $("#ddlItemCode").val(),
            IndentId: $("#ddlIndentNo").val() === 'Select' ? '0' : $("#ddlIndentNo").val(),
            IndentNo: $("#txtIndentNo").val()
        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        indentShortCloseGlobalData = response.data.Records; // save globally

        gridOptions = bindAgGrid("#myGrid", 'IndentShortCloseGried', columnMeta, tableData);
        $("#customLoader").hide();

        if (status == 2) {
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

///////////////////////////////////      Indent Short Close AgGried End     /////////////////////////////////////
