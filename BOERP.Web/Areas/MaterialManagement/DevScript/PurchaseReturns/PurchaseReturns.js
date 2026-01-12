$(document).ready(function () {
    LoadMasterDropdown('ddlStatus', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 16,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false, 1);
    LoadMasterDropdown('ddlSupplier', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);

    $("#txtDocNumber").on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblPurchaseReturns")) {
            purchaseReturnTable.ajax.reload();
        }
    }, 500));

   // BindData();

});
 
var purchaseReturnTable;
function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
    };
}
function BindData() {

    var model =
    {
        Status: "",
        Type: "",
        DocNumber: ""
    };

    const jsonString = JSON.stringify(model);

    // Check if DataTable is already initialized, then destroy it
    if ($.fn.DataTable.isDataTable("#tblPurchaseReturns")) {
        $("#tblPurchaseReturns").DataTable().destroy();
    }


    purchaseReturnTable = $('#tblPurchaseReturns').DataTable({
        scrollY: "400px",             // Vertical scroll
        scrollX: true,                // Horizontal scroll to fix header/column alignment
        scrollCollapse: true,
        fixedHeader: true,
        autoWidth: false,
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
        // 👉 either pick a default order or disable initial ordering completely:
        // order: [],                           // no initial order
        order: [[3, 'desc']],                   // here 3 = DOCDate column index (0-based)
        "ajax": function (data, callback, settings) {
            var requestData = {
                start: data.start,      // Offset (where to start)
                length: data.length,    // Number of records per page
                search: data.search.value, // Search term (if any)
                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
                screenId: 'POReturn_100',//Need to change the screen id as per your data
                //modelData: jsonString
                modelData: JSON.stringify({
                    DocNumber: $("#txtDocNumber").val(),
                    Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
                    Type: "",
                    Supplier: $("#ddlSupplier").val() === 'All' ? '0' : $("#ddlSupplier").val()
                })
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
            // Checkbox selection handling
            $('#selectAll').off('click').on('click', function () {
                var checked = this.checked;
                $('.row-checkbox').each(function () {
                    this.checked = checked;
                });
            });

            // Single row checkbox handling
            $('.row-checkbox').off('click').on('click', function () {

                var rowId = this.id.split('_')[1] + '-' + this.id.split('_')[2]; // Extract row ID
              //  var rowIdDocType =  this.id.split('_')[2]; // Extract row rowIdDocType

                if ($('.row-checkbox:checked').length === $('.row-checkbox').length) {
                    $('#selectAll').prop('checked', true);
                } else {
                    $('#selectAll').prop('checked', false);
                }
                var currentDocNumber = $(this).closest('tr')[0].cells[4].innerText;

                if (this.checked) {
                    var isValidSelect = true;
                    
                    if (selectedDocNumber === "")
                    {
                        isValidSelect = true;
                        // First checkbox clicked
                        selectedDocNumber = currentDocNumber;
                       
                    }
                    else if (selectedDocNumber !== currentDocNumber) {
                        // Different Doc Number, not allowed
                        FailToaster("Please select records from the same supplier/vendor only.");
                        isValidSelect = false;
                        this.checked = false; // Uncheck
                    }
                    if (isValidSelect) {
                        if (!selectedRowIds.includes(rowId)) {
                            selectedRowIds.push(rowId);
                        }
                    }
                    
                }
                else {
                    selectedRowIds = selectedRowIds.filter(id => id !== rowId);                
                    // Unchecking
                    var anyCheckedLeft = $('.row-checkbox:checked').length;
                    if (anyCheckedLeft === 0) {
                        selectedDocNumber = ""; // Reset if no checkbox selected
                    }
                }
            });
        },
        // ✅ Only disable ordering for the checkbox column (index 0)
        columnDefs: [
            { targets: 0, orderable: false, searchable: false }
        ],

        "columns": [
            //{ "data": "Srno" },
            {
                data: null, // no data field; it's a rendered checkbox
                orderable: false, // <— this is respected now
                searchable: false,
                render: function (data, type, row) {
                    const checked = selectedRowIds.includes(row.ID) ? 'checked' : '';
                    return `<input type="checkbox" class="row-checkbox" id="chk_${row.ID}_${row.DocType}" ${checked}>
                <label for="chk_${row.ID}_${row.DocType}" class="single-checkbox p-0 d-table m-auto"></label>`;
                }
            },

            { "data": "DocType" },
            { "data": "DOCNumber" },
            {
                "data": "DOCDate",
                "orderable": true,
                "render": function (data, type, row) {
                    if (type === "display" || type === "filter") {
                        return "<label>" + ChangeDateFormatToddMMYYYWithSlace(data) + "</label>";
                    }
                    return data; // Ensure sorting works using raw data
                }
            },
            { "data": "SupplierName" },
            { "data": "ItemCode" },
            { "data": "ItemName" },            
            {
                "data": "QtyReceived",
                "orderable": true,
                "render": function (data, type, row) {

                    return "<label>" + data.toFixed(3) + "</label>";

                }
            } ,
            {
                "data": "RejectedQTY",
                "orderable": true,
                "render": function (data, type, row) {
                    
                    return "<label>" + data.toFixed(3) + "</label>";
                    
                }
            } 
        ]
    });
    TableSetup(purchaseReturnTable)
}

function ProcessData()
{
    var selectedIDs = selectedRowIds;     
    selectedIDs = selectedIDs.join(',');

    if (selectedIDs.length > 0) {
        window.location.href = '/MaterialManagement/Material/CreateDebitNote?auth=' + auth + '&ids=' + selectedIDs + '&id=' + 0;
    }
    else {
         
        FailToaster("Please select minimum one records from the same supplier/vendor.");
    }
}

function onchangeStatus() {
    BindData();
}
function onchangeSupplier() {
    selectedDocNumber = "";
    BindData();
}

///////////////////////////////////      Purchase Returns AgGried     /////////////////////////////////////

let poReturnGlobalData = []; // will store all records

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

function bindPOShortCloseGridFilter() {

    let filterData = tableData;

    var supplier = $("#ddlSupplier").val() === 'All' ? '0' : $("#ddlSupplier").val();

    if (supplier != '0') {

        filterData = filterData.filter(row => row.PA_ID == supplier);
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do

document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindPOReturnsGrid();
});

function bindPOReturnsGrid() {
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
        screenId: 'POReturn_100',
        modelData: JSON.stringify({
            DocNumber: $("#txtDocNumber").val(),
            Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
            Type: "",
            Supplier: $("#ddlSupplier").val() === 'All' ? '0' : $("#ddlSupplier").val()
        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        poReturnGlobalData = response.data.Records; // save globally

        gridOptions = bindAgGrid("#myGrid", 'POReturnGried', columnMeta, tableData);
        $("#customLoader").hide();

    });
}

// Event delegation for all AG Grid checkboxes

var selectedRowIds = [];
var selectedDocNumber = ""; 

$(document).on('click', '.row-checkbox', function () {
    const idParts = this.id.split('_');
    if (idParts.length < 3) return;

    const rowId = idParts[1] + '-' + idParts[2];

    // Update select-all checkbox
    const total = $('.row-checkbox').length;
    const checkedCount = $('.row-checkbox:checked').length;
    $('#selectAll').prop('checked', total === checkedCount);

    // ✅ For AG Grid, find parent .ag-row
    const $row = $(this).closest('.ag-row');
    if ($row.length === 0) return;

    // Get vendor/supplier value
    // Adjust nth-child index based on column position (1-based)
    const currentDocNumber = $row.find('.ag-cell:nth-child(5)').text().trim();

    // ==============================
    // When checked
    // ==============================
    if (this.checked) {
        let isValidSelect = true;

        if (selectedDocNumber === "") {
            selectedDocNumber = currentDocNumber;
        } else if (selectedDocNumber !== currentDocNumber) {
            FailToaster("Please select records from the same supplier/vendor only.");
            isValidSelect = false;
            this.checked = false;
        }

        if (isValidSelect && !selectedRowIds.includes(rowId)) {
            selectedRowIds.push(rowId);
        }
    }
    // ==============================
    // When unchecked
    // ==============================
    else {
        selectedRowIds = selectedRowIds.filter(id => id !== rowId);

        if ($('.row-checkbox:checked').length === 0) {
            selectedDocNumber = "";
        }
    }

    console.log("Selected IDs:", selectedRowIds.join(','));
});



///////////////////////////////////      Purchase Returns AgGried End     /////////////////////////////////////