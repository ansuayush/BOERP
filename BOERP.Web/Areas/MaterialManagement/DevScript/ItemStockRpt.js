$(document).ready(function () {

    $(function () {
        $('.datepicker').daterangepicker({
            opens: 'right',
            singleDatePicker: true,
            showDropdowns: true,
            autoApply: true,
            autoUpdateInput: false,
            parentEl: 'body', // Ensures it is not constrained in table
            locale: {
                format: 'DD/MM/YYYY'
            }
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
        }).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
        $(this).siblings('.clear-date').show(); // Show × icon
    });

    // Clear date when clicking the × icon
    $('.clear-date').on('click', function () {
        const $input = $(this).siblings('.datepicker');
        $input.val('');
        $(this).hide();
    });

        // Open datepicker when clicking the icon
        $('.input-group-text').on('click', function () {
            $(this).closest('.input-group').find('.datepicker').focus();
        });

    });

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 69,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdownCheckBox('ddlCategory', obj1, '', false);

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 77,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdownCheckBox('ddlWarehouse', obj2, '', false);
   
    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: 'StockStmtRpt_101'
    }
    LoadMasterDropdownCheckBox('ddlItem', obj3, '', false);


    var rptType = $("#hdnRptType").val();

    //Get Fin Year From date, To date by FInId

    if (rptType == "Stock Statement Rpt") {
        var model =
        {
            ID: FinYearId
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'FinYear_101' }, 'GET', function (response) {
            var tblFinYear = response.data.data.Table;
            $('#txtFromDate').val(tblFinYear[0].FromDate);
            $('#txtToDate').val(tblFinYear[0].ToDate);
        });
    }
    else {
        // Get the current date
        var currentDate = new Date();

        // Get the first date of the current month (set day to 1)
        var firstDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        // Get the last date of the current month
        var lastDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Format the date to 'DD/MM/YYYY'
        var formattedFirstDate = formatDateToDDMMYYYY(firstDateOfMonth);
        var formattedLastDate = formatDateToDDMMYYYY(lastDateOfMonth);

        // Set the values of the input fields
        $('#txtFromDate').val(formattedFirstDate);
        $('#txtToDate').val(formattedLastDate);
    }
    // End

    
   

   
   

    // Debounced filter input
    $('#txtItemCode').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblStockStatementRpt")) {
            itemTable.ajax.reload();
        }
    }, 500));
    $('#txtItemName').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblStockStatementRpt")) {
            itemTable.ajax.reload();
        }
    }, 500));

    $('#txtItemCode').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblStockLedgerRpt")) {
            itemTable.ajax.reload();
        }
    }, 500));
    $('#txtItemName').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblStockLedgerRpt")) {
            itemTable.ajax.reload();
        }
    }, 500));

    //#endregion

  /*  LoadItemDropdown();*/

});

function formatDateToDDMMYYYY(date) {
    var day = String(date.getDate()).padStart(2, '0'); // Add leading zero if day is single digit
    var month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (1-based) and add leading zero
    var year = date.getFullYear(); // Get the full year
    return day + '/' + month + '/' + year;
}

let isGridInitialized = false;

var itemTable;
function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

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

//var ItemCodeList = [];
//function LoadItemDropdown() {
//    var model =
//    {
//        ColumnName: 'Name',
//        SearchData: ""
//    };
//    const jsonString = JSON.stringify(model);
//    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_104' }, 'GET', function (response) {

//        ItemCodeList = response.data.data.Table;
//        //var $ele = $('#ddlItem_0');
//        //$ele.empty();
//        //$ele.append($('<option/>').val('Select').text('Select'));
//        //$.each(ItemCodeList, function (ii, vall)
//        //{
//        //    var displayText = vall.ITEM_NAME + " (" + vall.ITEM_CODE + ")"; // Format: ITEM_NAME (ITEM_CODE)
//        //    $ele.append($('<option />').val(vall.ITEM_ID).text(displayText));
//        //})
//    });
//}


function Getdata(inputElement) {
    let rowId = inputElement.id.split('_')[1]; // Extract RowId from input ID
    let suggestionBox = document.getElementById(`globalSuggestionBox_${rowId}`);

    let search = inputElement.value.toLowerCase();
    suggestionBox.innerHTML = "";

    //if (search.length < 2) {
    //    suggestionBox.style.display = "none";
    //    return;
    //}

    let matchedItems = ItemCodeList.filter(item =>
        item.ITEM_DISPLAY.toLowerCase().includes(search) || item.ITEM_DISPLAY.toLowerCase().includes(search)
    ).slice(0, 50);

    if (matchedItems.length === 0) {
        suggestionBox.innerHTML = `<li class="errordata">No data found</li>`;
    } else {
        matchedItems.forEach(item => {
            let li = document.createElement("li");
            li.textContent = `${item.ITEM_DISPLAY}`;
            li.dataset.id = item.ITEM_ID;
            li.dataset.name = item.ITEM_NAME;
            li.dataset.code = item.ITEM_CODE;

            li.addEventListener("click", function () {
                inputElement.value = item.ITEM_NAME; // Set selected value in input
                suggestionBox.style.display = "none";

                $(`#ddlItem_` + rowId).val(item.ITEM_ID);
                $(`#lblItemName_` + rowId).text(item.ITEM_NAME);
                $(`#lblItemDesc_` + rowId).text(item.DESCRIPTION);
                $(`#lblUnit_` + rowId).text(item.UNIT);

            });

            suggestionBox.appendChild(li);
        });
    }

    // Positioning
    let rect = inputElement.getBoundingClientRect();
    suggestionBox.style.top = rect.bottom + "px";
    suggestionBox.style.left = rect.left + "px";
    suggestionBox.style.width = rect.width + "px";
    suggestionBox.style.display = "block";
}
document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("searchlist")) {
        document.querySelectorAll(".suggestions").forEach(box => box.style.display = "none");
    }
});

//function GetStockStatementRpt() {

//    if (!validateDate()) {
//        return; // Stop execution if date is invalid
//    }

//    if ($.fn.DataTable.isDataTable("#tblStockStatementRpt")) {
//        itemTable.ajax.reload();
//        return;
//    }

//    itemTable = $('#tblStockStatementRpt').DataTable({
//        scrollY: "400px",             // Vertical scroll
//        scrollX: true,                // Horizontal scroll to fix header/column alignment
//        scrollCollapse: true,
//        fixedHeader: true,
//        autoWidth: false,
//        "processing": true,
//        "serverSide": true,
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
//                start: data.start,
//                length: data.length,
//                search: data.search.value,
//                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
//                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
//                screenId: 'StockStmtRpt_101',
//                modelData: JSON.stringify({
//                    FIN_ID: FinYearId,
//                    EXTRA_QUERY: 'AND ITEM.ITEM_ID NOT IN(0)',
//                    FDATE: ChangeDateFormatToYYYYMMDDWithSlash($("#txtFromDate").val()),
//                    TDATE: ChangeDateFormatToYYYYMMDDWithSlash($("#txtToDate").val()),
//                    ITEM_MOVE: 0,
//                    MIN_QTY: 0,
//                    METHOD: 'W',
//                    CHARGE: 'N',
//                    MINQTY: -9999999999,
//                    MAXQTY: 9999999999,
//                    //ItemId: 0,
//                    //WarehouseId: $("#ddlWarehouse").val() > 0 ? $("#ddlWarehouse").val() : 0,
//                    //CategoryId: $("#ddlCategory").val() > 0 ? $("#ddlCategory").val() : 0,

//                    ItemId: ($("#ddlItem").val() && $("#ddlItem").val().length > 0)
//                        ? $("#ddlItem").val().join(',')
//                        : '0',
//                    WarehouseId: ($("#ddlWarehouse").val() && $("#ddlWarehouse").val().length > 0)
//                        ? $("#ddlWarehouse").val().join(',')
//                        : '0',
//                    CategoryId: ($("#ddlCategory").val() && $("#ddlCategory").val().length > 0)
//                        ? $("#ddlCategory").val().join(',')
//                        : '0',
//                    ItemCode: $("#txtItemCode").val(),
//                    ItemName: $("#txtItemName").val(),
//                    DocType: 'StockStatementRpt'
//                })
//            };

//            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {

//                console.log(response);
//                if (response && response.data) {
//                    callback({
//                        draw: data.draw,
//                        recordsTotal: response.data.TotalRecords,
//                        recordsFiltered: response.data.FilteredRecords,
//                        data: response.data.Records
//                    });
//                }
//            }, false);
//        },

//        "columns": [
//            {
//                "data": "ItemCode",
//                "render": function (data, type, row) {
//                    return '<a href="/MaterialManagement/Material/StockLedger?auth=' + AuthToken + '&itemId=' + row.ITEM_ID + '" class="d-flex justify-content-between" data-toggle="tooltip" title="' + row.ITEM_ID + '" data-item-id="' + row.ITEM_ID + '">' +
//                        '<strong>' + row.ItemCode + '</strong>' +
//                    '</a>'
//                }
//            },
//            { "data": "ItemName" },
//            { "data": "UOM" },
//            { "data": "Category" },
//            { "data": "WarehouseName" },

//            { "data": "OQty", "className": "text-right" },
//            { "data": "OUnit", "className": "text-right" },
//            { "data": "OAmount", "className": "text-right" },

//            { "data": "RQty", "className": "text-right" },
//            { "data": "RUnit" },
//            { "data": "RAmount", "className": "text-right", "render": $.fn.dataTable.render.number(',', '.', 2) },

//            { "data": "IQty", "className": "text-right" },
//            { "data": "IUnit" },
//            { "data": "IAmount", "className": "text-right", "render": $.fn.dataTable.render.number(',', '.', 2) },

//            { "data": "CQty", "className": "text-right" },
//            { "data": "CUnit" },
//            { "data": "CAmount", "className": "text-right", "render": $.fn.dataTable.render.number(',', '.', 2) }
//        ]
//    });
//}


//function GetStockStatementRpt() {

//    if (!validateDate()) {
//        return; // Stop execution if date is invalid
//    }

//    if ($.fn.DataTable.isDataTable("#tblStockStatementRpt")) {
//        itemTable.ajax.reload();
//        return;
//    }

//    itemTable = $('#tblStockStatementRpt').DataTable({
//        scrollY: "400px",             // Vertical scroll
//        scrollX: true,                // Horizontal scroll to fix header/column alignment
//        scrollCollapse: true,
//        fixedHeader: true,
//        autoWidth: false,
//        "processing": true,
//        "serverSide": true,
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
//                start: data.start,
//                length: data.length,
//                search: data.search.value,
//                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
//                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
//                screenId: 'StockStmtRpt_101',
//                modelData: JSON.stringify({
//                    FIN_ID: FinYearId,
//                    EXTRA_QUERY: 'AND ITEM.ITEM_ID NOT IN(0)',
//                    FDATE: ChangeDateFormatToYYYYMMDDWithSlash($("#txtFromDate").val()),
//                    TDATE: ChangeDateFormatToYYYYMMDDWithSlash($("#txtToDate").val()),
//                    ITEM_MOVE: 0,
//                    MIN_QTY: 0,
//                    METHOD: 'W',
//                    CHARGE: 'N',
//                    MINQTY: -9999999999,
//                    MAXQTY: 9999999999,
//                    //ItemId: 0,
//                    //WarehouseId: $("#ddlWarehouse").val() > 0 ? $("#ddlWarehouse").val() : 0,
//                    //CategoryId: $("#ddlCategory").val() > 0 ? $("#ddlCategory").val() : 0,

//                    ItemId: ($("#ddlItem").val() && $("#ddlItem").val().length > 0)
//                        ? $("#ddlItem").val().join(',')
//                        : '0',
//                    WarehouseId: ($("#ddlWarehouse").val() && $("#ddlWarehouse").val().length > 0)
//                        ? $("#ddlWarehouse").val().join(',')
//                        : '0',
//                    CategoryId: ($("#ddlCategory").val() && $("#ddlCategory").val().length > 0)
//                        ? $("#ddlCategory").val().join(',')
//                        : '0',
//                    ItemCode: $("#txtItemCode").val(),
//                    ItemName: $("#txtItemName").val(),
//                    DocType: 'StockStatementRpt'
//                })
//            };

//            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {

//                console.log(response);
//                if (response && response.data) {
//                    callback({
//                        draw: data.draw,
//                        recordsTotal: response.data.TotalRecords,
//                        recordsFiltered: response.data.FilteredRecords,
//                        data: response.data.Records
//                    });
//                }
//            }, false);
//        },

//        "columns": [
//            {
//                "data": "ItemCode",
//                "render": function (data, type, row) {
//                    return '<a href="/MaterialManagement/Material/StockLedger?auth=' + AuthToken + '&itemId=' + row.ITEM_ID + '" class="d-flex justify-content-between" data-toggle="tooltip" title="' + row.ITEM_ID + '" data-item-id="' + row.ITEM_ID + '">' +
//                        '<strong>' + row.ItemCode + '</strong>' +
//                        '</a>'
//                }
//            },
//            { "data": "ItemName" },
//            { "data": "UOM" },
//            { "data": "Category" },
//            { "data": "WarehouseName" },

//            { "data": "OQty", "className": "text-right" },
//            { "data": "OUnit", "className": "text-right" },
//            { "data": "OAmount", "className": "text-right" },

//            { "data": "RQty", "className": "text-right" },
//            { "data": "RUnit" },
//            { "data": "RAmount", "className": "text-right", "render": $.fn.dataTable.render.number(',', '.', 2) },

//            { "data": "IQty", "className": "text-right" },
//            { "data": "IUnit" },
//            { "data": "IAmount", "className": "text-right", "render": $.fn.dataTable.render.number(',', '.', 2) },

//            { "data": "CQty", "className": "text-right" },
//            { "data": "CUnit" },
//            { "data": "CAmount", "className": "text-right", "render": $.fn.dataTable.render.number(',', '.', 2) }
//        ]
//    });
//}

//function GetStockLedgerRpt(itemId) {

//    if (!validateDate()) {
//        return; // Stop execution if date is invalid
//    }
//    if (itemId > 0) {
//        // Set value to dropdown
//        $('#ddlItem').val(itemId).trigger('change');
//    }
//    //if ($("#ddlItem").val().length ===0) {
//    //    alert("Please select atleast one item");
//    //    return;
//    //}

//    if ($.fn.DataTable.isDataTable("#tblStockLedgerRpt")) {
//        itemTable.ajax.reload();
//        return;
//    }

//    itemTable = $('#tblStockLedgerRpt').DataTable({
//        "processing": true,
//        "serverSide": true,
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
//        "createdRow": function (row, data, dataIndex) {
//            if (data.DocumentNumber === "Opening Balance" || data.DocumentNumber === "Total/Closing Balance") {
//                $(row).css({
//                    "font-weight": "bold",
//                    "background-color": "#f0f0f0"
//                });
//            }
//        },
//        "ajax": function (data, callback, settings) {
//            var requestData = {
//                start: data.start,
//                length: data.length,
//                search: data.search.value,
//                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
//                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
//                screenId: 'StockLedgerRpt_101',
//                modelData: JSON.stringify({
//                    FIN_ID: FinYearId,
//                    EXTRA_QUERY: 'AND ITEM.ITEM_ID NOT IN(0)',
//                    FDATE: ChangeDateFormatToYYYYMMDDWithSlash($("#txtFromDate").val()),
//                    TDATE: ChangeDateFormatToYYYYMMDDWithSlash($("#txtToDate").val()),
//                    ITEM_MOVE: 0,
//                    MIN_QTY: 0,
//                    METHOD: 'W',
//                    CHARGE: 'N',
//                    MINQTY: -9999999999,
//                    MAXQTY: 9999999999,
//                    //ItemId: 0,
//                    //WarehouseId: $("#ddlWarehouse").val() > 0 ? $("#ddlWarehouse").val() : 0,
//                    //CategoryId: $("#ddlCategory").val() > 0 ? $("#ddlCategory").val() : 0,

//                    ItemId: ($("#ddlItem").val() && $("#ddlItem").val().length > 0)
//                        ? $("#ddlItem").val().join(',')
//                        : '-1',
//                    WarehouseId: ($("#ddlWarehouse").val() && $("#ddlWarehouse").val().length > 0)
//                        ? $("#ddlWarehouse").val().join(',')
//                        : '0',
//                    CategoryId: ($("#ddlCategory").val() && $("#ddlCategory").val().length > 0)
//                        ? $("#ddlCategory").val().join(',')
//                        : '0',
//                    ItemCode: $("#txtItemCode").val(),
//                    ItemName: $("#txtItemName").val()
//                })
//            };

//            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
//                if (response && response.data) {
//                    callback({
//                        draw: data.draw,
//                        recordsTotal: response.data.TotalRecords,
//                        recordsFiltered: response.data.FilteredRecords,
//                        data: response.data.Records
//                    });
//                }
//            }, false);
//        },

//        "columns": [
//            { "data": "ItemCode" },
//            { "data": "ItemName" },
//            { "data": "UOM" },
//            { "data": "ItemCategory" },
//            { "data": "WarehouseName" },
//            { "data": "Document Date" },
//            { "data": "DocumentNumber" },
//            { "data": "DocPrefix" },

//            { "data": "RQty", "className": "text-right" },
//            { "data": "RUnit" },
//            { "data": "RAmount", "className": "text-right", "render": $.fn.dataTable.render.number(',', '.', 2) },

//            { "data": "IQty", "className": "text-right" },
//            { "data": "IUnit" },
//            { "data": "IAmount", "className": "text-right", "render": $.fn.dataTable.render.number(',', '.', 2) },

//            { "data": "CQty", "className": "text-right" },
//            { "data": "CUnit" },
//            { "data": "CAmount", "className": "text-right", "render": $.fn.dataTable.render.number(',', '.', 2) }
//        ]
//    });
//}

var tableData = [];

document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    if ($("#hdnRptType").val() == "Stock Statement Rpt") {
        GetStockStatementRpt();
    }
    else if ($("#hdnRptType").val() == "Stock Ledger Rpt") {
        var hdnItemId = $('#hdnItemId');

        if (hdnItemId.val() > 0) {

    
                    GetStockLedgerRpt(hdnItemId.val());

        }
        else {
            GetStockLedgerRpt();
        }


    }

    

    

});

async function GetStockLedgerRpt(itemId) {
    $("#customLoader").show();
    $('#myGrid').html('');
    if (!validateDate()) {
        FailToaster('Date is invalid');
        $("#customLoader").hide();
        return; // Stop execution if date is invalid
    }
    if (itemId > 0) {

        await waitUntilDropdownReady('#ddlItem');
        var $ele = $('#ddlItem');
        
        let indArray = itemId.split(',').map(x => x.trim());
        $ele.val(indArray);
        $ele.multiselect('rebuild');
                
    
    }
    var currentDate = new Date();

    // Get the first date of the current month (set day to 1)
    var firstDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get the last date of the current month
    var lastDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Format the date to 'DD/MM/YYYY'
    var formattedFirstDate = formatDateToDDMMYYYY(firstDateOfMonth);
    var formattedLastDate = formatDateToDDMMYYYY(lastDateOfMonth);


    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'StockLedgerRpt_101',
        modelData: JSON.stringify({
            FIN_ID: FinYearId,
            EXTRA_QUERY: 'AND ITEM.ITEM_ID NOT IN(0)',
            FDATE: ChangeDateFormatToYYYYMMDDWithSlash($("#txtFromDate").val() == "" ? formattedFirstDate : $("#txtFromDate").val() ),
            TDATE: ChangeDateFormatToYYYYMMDDWithSlash($("#txtToDate").val() == "" ? formattedLastDate : $("#txtToDate").val()),
            ITEM_MOVE: 0,
            MIN_QTY: 0,
            METHOD: 'W',
            CHARGE: 'N',
            MINQTY: -9999999999,
            MAXQTY: 9999999999,
            //ItemId: 0,
            //WarehouseId: $("#ddlWarehouse").val() > 0 ? $("#ddlWarehouse").val() : 0,
            //CategoryId: $("#ddlCategory").val() > 0 ? $("#ddlCategory").val() : 0,

            ItemId: ($("#ddlItem").val() && $("#ddlItem").val().length > 0)
                ? $("#ddlItem").val().join(',')
                : '0',
            WarehouseId: ($("#ddlWarehouse").val() && $("#ddlWarehouse").val().length > 0)
                ? $("#ddlWarehouse").val().join(',')
                : '0',
            CategoryId: ($("#ddlCategory").val() && $("#ddlCategory").val().length > 0)
                ? $("#ddlCategory").val().join(',')
                : '0',
            ItemCode: $("#txtItemCode").val(),
            ItemName: $("#txtItemName").val()
        })
    };

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', requestData, 'GET', function (response) {

        console.log(response);
        if (response && response.data) {

            tableData = response.data.DataList.Table2;
            var columnMeta = response.data.DataList.Table1;
            gridOptions = bindAgGrid("#myGrid", 'StockLedger', columnMeta, tableData);
            $("#customLoader").hide();

        }
    });

}


function GetStockStatementRpt() {
    $("#customLoader").show();
    $('#myGrid').html('');
    if (!validateDate()) {
        FailToaster('Date is invalid');
        $("#customLoader").hide();
        return; // Stop execution if date is invalid
    }
   

    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'StockStmtRpt_101',
        modelData: JSON.stringify({
                            FIN_ID: FinYearId,
                            EXTRA_QUERY: 'AND ITEM.ITEM_ID NOT IN(0)',
                            FDATE: ChangeDateFormatToYYYYMMDDWithSlash($("#txtFromDate").val()),
                            TDATE: ChangeDateFormatToYYYYMMDDWithSlash($("#txtToDate").val()),
                            ITEM_MOVE: 0,
                            MIN_QTY: 0,
                            METHOD: 'W',
                            CHARGE: 'N',
                            MINQTY: -9999999999,
                            MAXQTY: 9999999999,
                            //ItemId: 0,
                            //WarehouseId: $("#ddlWarehouse").val() > 0 ? $("#ddlWarehouse").val() : 0,
                            //CategoryId: $("#ddlCategory").val() > 0 ? $("#ddlCategory").val() : 0,

                            ItemId: ($("#ddlItem").val() && $("#ddlItem").val().length > 0)
                                ? $("#ddlItem").val().join(',')
                                : '0',
                            WarehouseId: ($("#ddlWarehouse").val() && $("#ddlWarehouse").val().length > 0)
                                ? $("#ddlWarehouse").val().join(',')
                                : '0',
                            CategoryId: ($("#ddlCategory").val() && $("#ddlCategory").val().length > 0)
                                ? $("#ddlCategory").val().join(',')
                                : '0',
                            ItemCode: $("#txtItemCode").val(),
                            ItemName: $("#txtItemName").val(),
                            DocType: 'StockStatementRpt'
                        })
    };

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {

        console.log(response);
        if (response && response.data) {

            tableData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'StockReport', columnMeta, tableData);
            $("#customLoader").hide();

        }
    });

}

function GetStockLedgerRptByItem() {
   

    GetStockLedgerRpt(0);
}

