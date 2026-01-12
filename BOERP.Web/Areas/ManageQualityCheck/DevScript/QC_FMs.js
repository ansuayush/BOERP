$(document).ready(function () {
    $(function () {

        // helper: find scrollable ancestors of an element
        function findScrollableAncestors(el) {
            var ancestors = [];
            var parent = el.parentElement;
            while (parent && parent !== document.documentElement) {
                var style = getComputedStyle(parent);
                var overflowY = style.overflowY;
                if (/(auto|scroll|overlay)/.test(overflowY) || parent.classList.contains('modal-body')) {
                    ancestors.push(parent);
                }
                parent = parent.parentElement;
            }
            // always include window (viewport)
            return ancestors;
        }

        // update position of picker container relative to input's viewport rect
        function updatePickerPosition(picker, inputEl) {
            if (!picker || !picker.container || !inputEl) return;
            // recompute sizes and positions
            var inputRect = inputEl.getBoundingClientRect();
            var winW = window.innerWidth;
            var winH = window.innerHeight;
            var pickerW = picker.container.outerWidth();
            var pickerH = picker.container.outerHeight();

            var left = inputRect.left;
            if (left + pickerW + 10 > winW) left = Math.max(10, winW - pickerW - 10);

            var topBelow = inputRect.bottom;
            var topAbove = inputRect.top - pickerH;

            var top;
            if (topBelow + pickerH + 10 <= winH) {
                top = topBelow;
            } else if (topAbove >= 10) {
                top = topAbove;
            } else {
                // clamp and allow internal scroll
                top = 10;
                picker.container.css('max-height', (winH - 20) + 'px');
            }

            // set using fixed position
            picker.container.css({ top: Math.round(top) + 'px', left: Math.round(left) + 'px' });
        }

        function initPicker($el) {
            // create a holder for event cleanup references
            var listenerRefs = { scrollables: [], resize: null, windowScroll: null };

            $el.daterangepicker({
                opens: 'right',
                singleDatePicker: true,
                showDropdowns: true,
                autoApply: true,
                autoUpdateInput: false,
                locale: { format: 'DD/MM/YYYY' }
            })
                .on('apply.daterangepicker', function (ev, picker) {
                    $(this).val(picker.startDate.format('DD/MM/YYYY'));
                    $(this).siblings('.clear-date').show();
                    bindItemMasterGridFilter();
                })
                .on('show.daterangepicker', function (ev, picker) {
                    // append to body and set fixed positioning
                    picker.container.appendTo('body');
                    picker.container.css('position', 'fixed');
                    // initial placement
                    updatePickerPosition(picker, this);

                    // find scrollable ancestors to re-position on their scroll
                    var scrollables = findScrollableAncestors(this);
                    scrollables.forEach(function (sc) {
                        // use passive listeners for perf
                        var handler = function () { updatePickerPosition(picker, ev.target); };
                        sc.addEventListener('scroll', handler, { passive: true });
                        // keep references for cleanup
                        listenerRefs.scrollables.push({ el: sc, handler: handler });
                    });

                    // also listen to window scroll and resize
                    listenerRefs.windowScroll = function () { updatePickerPosition(picker, ev.target); };
                    listenerRefs.resize = function () { updatePickerPosition(picker, ev.target); };

                    window.addEventListener('scroll', listenerRefs.windowScroll, { passive: true });
                    window.addEventListener('resize', listenerRefs.resize);

                    // If the calendar changes size (rare), re-calc after a small delay
                    // (e.g., when month switches) — observe mutations for safety
                    if (window.MutationObserver) {
                        var mo = new MutationObserver(function () { updatePickerPosition(picker, ev.target); });
                        mo.observe(picker.container[0], { childList: true, subtree: true });
                        listenerRefs.mutationObserver = mo;
                    }
                })
                .on('hide.daterangepicker', function (ev, picker) {
                    // cleanup: remove scroll listeners and window listeners
                    if (listenerRefs) {
                        (listenerRefs.scrollables || []).forEach(function (item) {
                            try { item.el.removeEventListener('scroll', item.handler); } catch (e) { }
                        });
                        if (listenerRefs.windowScroll) try { window.removeEventListener('scroll', listenerRefs.windowScroll); } catch (e) { }
                        if (listenerRefs.resize) try { window.removeEventListener('resize', listenerRefs.resize); } catch (e) { }
                        if (listenerRefs.mutationObserver) listenerRefs.mutationObserver.disconnect();
                    }
                    // optional: remove inline styles if you want
                    if (picker && picker.container) {
                        // don't remove container from body — it's reused; but remove top/left if needed:
                        // picker.container.css({top: '', left: ''});
                    }
                });

            // clear icon handlers (same as before)
            $el.siblings('.clear-date').off('click').on('click', function () {
                const $input = $(this).siblings('.datepicker');
                $input.val('');
                $(this).hide();
                bindItemMasterGridFilter();
            });

            $el.on('input', function () {
                if ($(this).val() === '') $(this).siblings('.clear-date').hide();
            });

            // open when clicking calendar icon
            $el.closest('.input-group').find('.input-group-text').off('click').on('click', function () {
                $(this).closest('.input-group').find('.datepicker').focus();
            });

        } // initPicker

        // init all datepickers
        $('.datepicker').each(function () { initPicker($(this)); });

    });

    $('.datepicker').on('show.daterangepicker', function () {
        var $calendar = $('.daterangepicker');
        var inputOffset = $(this).offset();
        var inputHeight = $(this).outerHeight();
        var windowHeight = $(window).height();
        var calendarHeight = $calendar.outerHeight();

        // Check if there's enough space to open the dropdown below the input
        if ((inputOffset.top + inputHeight + calendarHeight) > windowHeight) {
            // If not enough space, open the dropdown above the input
            $calendar.css({
                top: inputOffset.top - calendarHeight - 5 + 'px', // 5px for some spacing
                left: inputOffset.left + 'px'
            });
        } else {
            // Open it below the input
            $calendar.css({
                top: inputOffset.top + inputHeight + 5 + 'px', // 5px for some spacing
                left: inputOffset.left + 'px'
            });
        }
    });
    var obj10 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 15,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlTask', obj10, 'All', false);


    LoadItemDropdown();
    LoadMasterDropdown('ddlSupplier', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);

    LoadMasterDropdown('ddlGRN', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 20,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);

    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 69,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlCate', obj3, 'All', false);


    $("#addrow").click(function () {
        var RowId = $("#dtStockTransfer tbody tr").length + 1;
        let newRow = `
            <tr>
                <td>
                    <div class="deleterow text-center cursor-pointer">
                        <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
                        
                    </div>
                </td>                
                
                <td>
                <input type="text" id="txtUsedMedia_${RowId}" class="form-control  MandateRejected" value=""  oninput="HideErrorMessage(this)">
                    <span id="sptxtUsedMedia_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                </td>
                     <td>

                    <input type="text" id="txtLotNumber_${RowId}" class="form-control  MandateRejected" value=""   oninput="HideErrorMessage(this);alphanumeric(this)">
                     <span id="sptxtLotNumber_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </td>

                
            </tr>`;

        // Append new row
        $(".itemsinformationMedia tbody").append(newRow);



    });


    //#region : Hide error message when date, time selected on any .datepicker input
    
    $('body').on('apply.daterangepicker', '.datepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
        $(this).siblings('.clear-date').show();

        var inputId = $(this).attr('id');
        var errorSpanId = 'sp' + inputId;
        $('#' + errorSpanId).hide();
    });

    // Hide error message when user types or changes time inputs
    $('body').on('input change', 'input[type="time"].MandateRejected', function () {
        var inputId = $(this).attr('id');
        var errorSpanId = 'sp' + inputId;
        $('#' + errorSpanId).hide();
    });

    // Hide error message when user types in text or number inputs with MandateRejected class
    $('body').on('input change', 'input.MandateRejected:not([type="time"]):not(.datepicker)', function () {
        var inputId = $(this).attr('id');
        var errorSpanId = 'sp' + inputId;
        $('#' + errorSpanId).hide();
    });

    // Clear date on × click
    $('body').on('click', '.clear-date', function () {
        const $input = $(this).siblings('.datepicker');
        $input.val('');
        $(this).hide();

        // Also hide error message when cleared
        var inputId = $input.attr('id');
        var errorSpanId = 'sp' + inputId;
        $('#' + errorSpanId).hide();
    });

    // Hide × icon if input cleared manually
    $('body').on('input', '.datepicker', function () {
        if ($(this).val() === '') {
            $(this).siblings('.clear-date').hide();
        }
    });

    // Open datepicker on calendar icon click
    $('body').on('click', '.input-group-text', function () {
        $(this).closest('.input-group').find('.datepicker').focus();
    });


    //#endregion

});

$(document).on("click", ".deleterow", function () {
    $(this).closest("tr").remove();
});
function LoadItemDropdown() {
    var model =
    {
        ColumnName: 'Name',
        SearchData: ""
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_104' }, 'GET', function (response) {

        var ItemCodeList = response.data.data.Table;
        var $ele = $('#ddlItem');
        $ele.empty();
        $ele.append($('<option/>').val('Select').text('Select'));
        $.each(ItemCodeList, function (ii, vall) {
            var displayText = vall.ITEM_NAME + " (" + vall.ITEM_CODE + ")"; // Format: ITEM_NAME (ITEM_CODE)
            $ele.append($('<option />').val(vall.ITEM_ID).text(displayText));
        })
    });
}


//function OnchageBindGrid() {
//    // BindData();
//}
//function BindData() {

//    // Check if DataTable is already initialized, then destroy it
//    if ($.fn.DataTable.isDataTable("#tblQC")) {
//        $("#tblQC").DataTable().destroy();
//    }


//    indentTable = $('#tblQC').DataTable({
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
//                orderColumn: data.order.length > 0 ? "DOCDate" : null,//data.columns[data.order[0].column].data : null,
//                orderDir: data.order.length > 0 ? "desc" : "asc",  //data.order[0].dir : "asc",
//                screenId: 'QCTask_1',//Need to change the screen id as per your data
//                //modelData: jsonString
//                modelData: JSON.stringify({
//                    TaskType: 5,
//                    Item: $("#ddlItem").val() == 'Select' ? '0' : $("#ddlItem").val(),
//                    GRN: $("#ddlGRN").val() == 'All' ? '0' : $("#ddlGRN").val(),
//                    FromDate: ChangeDateFormatSecond($('#txtFromDate').val()),
//                    ToDate: ChangeDateFormatSecond($('#txtToDate').val()),
//                    SupplierId: $("#ddlSupplier").val() == 'All' ? '0' : $("#ddlSupplier").val(),
//                    Cate: $("#ddlCate").val() == 'All' ? '0' : $("#ddlCate").val(),
//                    Tasks: $('#ddlTask').val() == 'All' ? '0' : $('#ddlTask').val()
//                })
//            };

//            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
//                if (response && response.data) {

//                    console.log(response);

//                    callback({
//                        draw: data.draw,
//                        recordsTotal: response.data.TotalRecords,   // Total records in DB
//                        recordsFiltered: response.data.FilteredRecords, // Filtered count
//                        data: response.data.Records // Actual page data
//                    });
//                }
//            }, false);
//        },
//        "drawCallback": function () {
//            $('.dropdown-toggle').dropdown(); // Reinitialize dropdowns after draw
//        },
//        // Prevent sorting when clicking on search input fields
//        columnDefs: [
//            { orderable: false, targets: '_all' }
//        ],
//        "columns": [
//            { "data": "DocNo" },

//            {
//                "data": "DOCDate",
//                "orderable": true,
//                "render": function (data, type, row) {
//                    if (type === "display" || type === "filter") {
//                        return "<label>" + ChangeDateFormatToddMMYYYWithSlace(data) + "</label>";
//                    }
//                    return data; // Ensure sorting works using raw data
//                }
//            },

//            { "data": "ARNumber", "orderable": true, },
//            { "data": "ITEM_NAME", "orderable": true },
//            { "data": "Category", "orderable": true },
//            { "data": "BatchOrLot", "orderable": true, },
//            { "data": "ItemQty", "orderable": true, },
//            { "data": "SupplierName", "orderable": true, },
//            {
//                "data": "ExpDate",
//                "orderable": true,
//                "render": function (data, type, row) {
//                    if (type === "display" || type === "filter") {
//                        return "<label>" + ChangeDateFormatToddMMYYYWithSlace(data) + "</label>";
//                    }
//                    return data; // Ensure sorting works using raw data
//                }
//            }
//            ,
//            {
//                "data": "TaskNumber",
//                "orderable": true,
//                "render": function (data, type, row) {

//                    var TaskNo = '';

//                    if (row.TaskNo == 4 && row.ActualTime != null) {
//                        TaskNo = '';
//                    }
//                    else {
//                        TaskNo = `<strong class="text-primary" > Task ${row.TaskNo}</strong>`;
//                    }

//                    return `${TaskNo}<span class="d-block">${row.TaskNo == `1` ? `Enter QC Parameters` : row.TaskNo == `2` ? `QC Check Initialized` : row.TaskNo == `3` ? `Microbiology Test` : row.TaskNo == `4` ? `Rejected Quantity` : `All Tasks Completed`
//                        }</span>`;

//                }
//            },

//            {
//                "data": "PendingPlanDate",
//                "orderable": true,
//                "render": function (data, type, row) {
//                    if (type === "display" || type === "filter") {
//                        return "<label>" + getdatetime(data) + "</label>";
//                    }
//                    return data; // Ensure sorting works using raw data
//                }
//            },
//            { "data": "DelayHours", "orderable": true, },

//            {
//                "orderable": false,
//                "data": null,
//                "render": function (data, type, row) {

//                    var viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.GRNItemId}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

//                    return '<div class="dropdown td-defualt-center">' +
//                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
//                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
//                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">' +
//                        '<a class="dropdown-item" href="#" data-toggle="modal" onclick="ShowMapping(' + row.ITEM_ID + ',' + row.GRNItemId + ',' + row.TaskNo + ');">Mark Done</a>' +
//                        viewDetails +
//                        '<a class="dropdown-item" href="Add-new-sample.html">Print COA</a>' +


//                        '</div>' +
//                        '</div > ';


//                }
//            }

//        ]
//    });

//    // Tooltips and dropdowns remain
//    $('[data-toggle="tooltip"]').tooltip();

//    indentTable.on('draw.dt', function () {   // 🔥 corrected to indentTable
//        $('[data-toggle="tooltip"]').tooltip();
//    });

//    // Dropdown positioning logic
//    $(document).on('shown.bs.dropdown', '.dataTable .dropdown', function () {
//        var $menu = $(this).find('.dropdown-menu');
//        var $dropdown = $(this);
//        var tableOffset = $dropdown.closest('table').offset();
//        var dropdownOffset = $dropdown.offset();
//        var scale = window.devicePixelRatio || 1;

//        var newTop = (dropdownOffset.top - tableOffset.top + $dropdown.height()) / scale;
//        var newLeft = (dropdownOffset.left - tableOffset.left) / scale;

//        $('body').append($menu.detach());
//        $menu.css({
//            top: newTop + 'px',
//            left: newLeft + 'px',
//            position: 'absolute',
//            zIndex: '1050',
//            transform: 'translate(0, 10px)',
//            minWidth: '200px'
//        }).show();
//    });

//    $(document).on('hide.bs.dropdown', '.dataTable .dropdown', function () {
//        var $menu = $(this).find('.dropdown-menu');
//        $(this).append($menu.detach());
//        $menu.hide();
//    });

//    TableSetup(indentTable)
//}


let tblData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindItemMasterGrid();

});


function bindItemMasterGrid() {

    ///window.location.reload(true);

    $('#open').addClass('active');
    $('#completed').removeClass('active');

    $("#customLoader").show();

    //Replaceable content
    //Start
    $('#myGrid').html('');
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'QCTask_1',//Need to change the screen id as per your data
        //                //modelData: jsonString
        modelData: JSON.stringify({
            TaskType: 5,
            Item: $("#ddlItem").val() == 'Select' ? '0' : $("#ddlItem").val(),
            GRN: $("#ddlGRN").val() == 'All' ? '0' : $("#ddlGRN").val(),
            FromDate: ChangeDateFormatSecond($('#txtFromDate').val()),
            ToDate: ChangeDateFormatSecond($('#txtToDate').val()),
            SupplierId: $("#ddlSupplier").val() == 'All' ? '0' : $("#ddlSupplier").val(),
            Cate: $("#ddlCate").val() == 'All' ? '0' : $("#ddlCate").val(),
            Tasks: $('#ddlTask').val() == 'All' ? '0' : $('#ddlTask').val()
        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tblData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'QCFMS', columnMeta, tblData);
        $("#customLoader").hide();
    });
}




function bindItemMasterGrid2() {

    $('#open').removeClass('active');
    $('#completed').addClass('active');

    $("#customLoader").show();

    //Replaceable content
    //Start
    $('#myGrid').html('');
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'QCTask_1',//Need to change the screen id as per your data
        //                //modelData: jsonString
        modelData: JSON.stringify({
            TaskType: 6,
            Item: $("#ddlItem").val() == 'Select' ? '0' : $("#ddlItem").val(),
            GRN: $("#ddlGRN").val() == 'All' ? '0' : $("#ddlGRN").val(),
            FromDate: ChangeDateFormatSecond($('#txtFromDate').val()),
            ToDate: ChangeDateFormatSecond($('#txtToDate').val()),
            SupplierId: $("#ddlSupplier").val() == 'All' ? '0' : $("#ddlSupplier").val(),
            Cate: $("#ddlCate").val() == 'All' ? '0' : $("#ddlCate").val(),
            Tasks: $('#ddlTask').val() == 'All' ? '0' : $('#ddlTask').val()
        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tblData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'QCFMS_Completed', columnMeta, tblData);
        $("#customLoader").hide();
    });
}

function bindItemMasterGridFilter() {
    let filterData = tblData;

    let fromDate = $('#txtFromDate').val(); // Assuming the fromDate input field is 'txtFromDate'
    let toDate = $('#txtToDate').val(); // Assuming the toDate input field is 'txtToDate'

    var taskNo = $("#ddlTask").val() === 'All' ? '0' : $("#ddlTask").val();

    if (taskNo != '0') {
        filterData = tblData.filter(row => row.TaskNo == (taskNo - 1));
    }

    // If dates are provided, filter based on date range
    if (fromDate || toDate) {
        // Convert fromDate and toDate to Date objects
        fromDate1 = new Date(ChangeDateFormatSecond(fromDate));
        toDate1 = new Date(ChangeDateFormatSecond(toDate));

        // Filter based on ExpDate in row
        if (ChangeDateFormatSecond(fromDate) != "" && ChangeDateFormatSecond(toDate) != "") {

            filterData = tblData.filter(row => {
                let docDate = new Date((row.DOCDate));
                console.log(docDate);
                return docDate >= fromDate1 && docDate <= toDate1;
            });
        }
        else if (ChangeDateFormatSecond(fromDate) != "") {
            filterData = tblData.filter(row => {
                let docDate = new Date((row.DOCDate));
                console.log('exp');
                console.log(docDate);
                console.log('from')
                console.log(fromDate)
                return docDate >= fromDate1
            });
        }
        else {

            filterData = tblData.filter(row => {
                let docDate = new Date((row.DOCDate));
                console.log(docDate);
                return docDate <= toDate1
            });

        }

    }

    // Set the filtered data to the grid
    if (filterData.length > 0) {
        gridOptions.api.setRowData(filterData);
    } else {
        if (globalGridOptions != null)
            gridOptions.api.setRowData([]);
    }
}




function showTaskModal(id, authToken, FMS_Id) {
    $.get('/Account/GetTaskStatusModal', { id: id, auth: authToken, FMS_Id: FMS_Id, }, function (data) {
        $('#yourModalContainer').html(data);
        $('#viewstatus').modal('show');
    });
}


function ShowMapping(itemId, GRNItemId, taskType) {
    if (taskType == '1') {
        ShowQCMappingParam(itemId, GRNItemId);
    }
    else if (taskType == '2') {
        ShowQCMappingInitiated(itemId, GRNItemId);
    }
    else if (taskType == '3') {
        ShowQCMappingRejected(itemId, GRNItemId);
    }
    else {
        ShowQCMappingRejected(itemId, GRNItemId);
    }
}

var ItemIdData = 0;
var grnItemID = 0;
function ShowQCMappingParam(itemId, GRNItemId) {
    ItemIdData = itemId;
    grnItemID = GRNItemId;
    var model = {
        ID: itemId,
        ParentId: 0
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "QC_Test_Name";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        testNameArray = response.data.data.Table;
        //$("#tblQCTestMapping tbody").empty();
        //$("#tblMicrobiologyTests tbody").empty();

        $("#lbItemNameMapping").text(response.data.data.Table2[0].ITEM_NAME);
        $("#lbItemCodeMapping").text(response.data.data.Table2[0].ITEM_CODE);

        if (response.data.data.Table1.length > 0) {
            var editQCTestData = response.data.data.Table1;
            BindTableQCTest(editQCTestData);
        }
        else {
            // Empty the table body first
            $('#tblQcCheckBody').html('');
            $('#tblMicroMappingBody').html('');

            BindHTMLTableQualityParameters(0);
            BindHTMLTableMicrobiologyTests(0)
            document.getElementById('isMandatory').checked = false;
            document.getElementById('divMicrobiologyTests').style.display = 'none';
        }
    });


    //Bind FMS Pdf, Videolink
    var data = tblData.find(input => input.GRNItemId == GRNItemId);
    if (data.FMSVideolink != null && data.FMSVideolink.length >= 1) {
        $('#video1').attr('href', data.FMSVideolink);
        $('#video1').attr('target', '_blank');
    }
    else {
        $('#video1').removeAttr('target');
    }

    $('#open_pdf1').on('click', function () {
        handleTaskFile(data.FMSFileUrl, data.FMSActualFileName);
    })
    //Bind FMS Pdf, Videolink End

    $("#qctestmapping").modal('show');

  

}

function BindTableQCTest(documents) {
    const isMicrobiologicalArray = documents.filter(item => item.IsMicrobiological === true);
    const withoutMicrobiologicalArray = documents.filter(item => item.IsMicrobiological === false);
    // Empty the table body first
    $("#tblQCTestMapping tbody").empty();
    $("#tblMicrobiologyTests tbody").empty();
    var docID = "0";
    // Iterate over your data
    $.each(withoutMicrobiologicalArray, function (index, doc) {
        // Create a row element
        //if (doc.IsMicrobiological == false) {
        document.getElementById('isMandatory').checked = false;
        document.getElementById('divMicrobiologyTests').style.display = 'none';
        var row = $("<tr></tr>");
        // Create table cells
        // Column 1: Serial number and a hidden input for document id
        var colNameAddRow = $('<td class="text-center">' +
            '<div class="cursor-pointer"><img onclick="BindHTMLTableQualityParameters();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
            '</td>');

        // Column 2: Period Ind. (dropdown)
        var colTestName = $('<td>' +
            '<select onchange="HideErrorMessage(this);ChangeTestNameList(' + (index + 1) + ');" id="ddlTestNameList' + (index + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
            '<span id="spddlTestNameList' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        // Column 3: Period Ind. (dropdown)
        var colNameResultType = $('<td "><span id="spResultType' + (index + 1) + '"></span>' +
            '</td>');
        // Column 4: Period Ind. (dropdown)
        var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnit' + (index + 1) + '"></span>' +
            '</td>');
        var colApprovedRange = $('<td>' +
            '<div id="divRange' + (index + 1) + '" class="moldcount hide">' +
            '<div class="d-flex  gap-10">' +
            '<div class="w-100">' +
            '<input type="text" id="txtApprovedMin' + (index + 1) + '" placeholder="MIN" class="form-control" />' +
            '</div>' +
            '<div class="w-100">' +
            '<input type="text" id="txtApprovedMax' + (index + 1) + '" placeholder="MAX" class="form-control" />' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<input type="text" id="txtText' + (index + 1) + '" oninput="RestrictNoAlpha(event)" placeholder="Enter"  class="form-control color hide" />' +
            '<input type="text" id="txtNumber' + (index + 1) + '" placeholder="0" class="form-control density hide" />' +
            '<input type="hidden" id="hddCategory' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsSample' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsProduction' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsInvard' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsOutWard' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsMicrobiological' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddQCID' + (index + 1) + '"  />' +
            '</td>');

        row.append(colNameAddRow)
            .append(colTestName)
            .append(colNameResultType)
            .append(colNameMeasuringUnit)
            .append(colApprovedRange);

        // Finally, append the row to the table body 
        $("#tblQCTestMapping tbody").append(row);
        var $ele0 = $('#ddlTestNameList' + (index + 1) + '');
        $ele0.empty();
        $ele0.append($('<option/>').val('').text('Select'));
        $.each(testNameArray, function (ii, vall) {
            if (vall.isMicrobiological != true) {
                var $option = $('<option />')
                    .val(vall.ID)
                    .text(vall.ValueName)
                    .attr('data-code', vall.ValueCode);
                //if (vall.ID == "1") {
                //    $option.attr("selected", "selected");
                //}
                $ele0.append($option);
            }
        });

        $('#ddlTestNameList' + (index + 1)).val(doc.Parameter_NameID);//.trigger('change');
        if (doc.Parameter_Type == 1) {
            document.getElementById('spResultType' + (index + 1)).innerText = 'Numeric';
            $('#txtNumber' + (index + 1) + '').val(doc.Numeric_Value);

            $('#txtNumber' + (index + 1) + '').show();
            $('#txtText' + (index + 1) + '').hide();
            $('#divRange' + (index + 1) + '').hide();
           // document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.Numeric_Value;
        }
        if (doc.Parameter_Type == 2) {
            document.getElementById('spResultType' + (index + 1)).innerText = 'Text';
            $('#txtNumber' + (index + 1) + '').hide();
            $('#txtText' + (index + 1) + '').show();
            $('#divRange' + (index + 1) + '').hide();

            $('#txtText' + (index + 1) + '').val(doc.Text_Value);
            //document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.Text_Value;
        }
        if (doc.Parameter_Type == 3) {
            document.getElementById('spResultType' + (index + 1)).innerText = 'Range';
            $('#txtNumber' + (index + 1) + '').hide();
            $('#txtText' + (index + 1) + '').hide();
            $('#divRange' + (index + 1) + '').show();

            $('#txtApprovedMin' + (index + 1) + '').val(doc.Range_Min);
            $('#txtApprovedMax' + (index + 1) + '').val(doc.Range_Max);
            //document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.Range_Min + '-' + doc.Range_Max;
        }
        document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.MeasuringUnit;
        //$('#txtNumber' + (index + 1)).val(doc.Numeric_Value);
        $('#hddCategory' + (index + 1)).val(doc.Category);
        $('#hddIsSample' + (index + 1)).val(doc.IsSample);
        $('#hddIsProduction' + (index + 1)).val(doc.IsProduction);
        $('#hddIsInvard' + (index + 1)).val(doc.IsInvard);
        $('#hddIsOutWard' + (index + 1)).val(doc.IsOutWard);
        $('#hddIsMicrobiological' + (index + 1)).val(doc.IsMicrobiological);
        $('#hddQCID' + (index + 1)).val(doc.QCID);
        //}
    });
    $.each(isMicrobiologicalArray, function (index, doc) {
        //if (doc.IsMicrobiological == true) {
        document.getElementById('isMandatory').checked = true;
        document.getElementById('divMicrobiologyTests').style.display = 'block';
        // Create a row element
        var row = $("<tr></tr>");

        // Create table cells
        // Column 1: Serial number and a hidden input for document id
        var colNameAddRow = "";
        if (index + 1 == 1) {
            colNameAddRow = $('<td class="text-center">' +
                //'<div class="cursor-pointer"><img onclick="BindHTMLTableMicrobiologyTests();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
                //'</td>');

                '<div class="cursor-pointer"><img  onclick="AddRowMicrobiologyTests();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
                '</td>');
        }
        else {
            colNameAddRow = $('<td class="text-center">' +
                '<div class="cursor-pointer"><img style="width: 15px;" class="btnDelete" onclick="DeleteRowMicrobiologyTests();" src="../../assets/images/icons/help/close.svg" class="w-15" alt=""></div>' +
                '</td>');
        }
        // Column 2: Period Ind. (dropdown)
        colTestName = $('<td>' +
            '<select onchange="HideErrorMessage(this);ChangeTestNameListMT(' + (index + 1) + ');" id="ddlTestNameListMT' + (index + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
            '<span id="spddlTestNameListMT' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');


        // Column 3: Period Ind. (dropdown)
        var colNameResultType = $('<td "><span id="spResultTypeMT' + (index + 1) + '"></span>' +
            '</td>');
        // Column 4: Period Ind. (dropdown)
        var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnitMT' + (index + 1) + '"></span>' +
            '</td>');
        var colApprovedRange = $('<td>' +
            '<div id="divRangeMT' + (index + 1) + '" class="moldcount hide">' +
            '<div class="d-flex  gap-10">' +
            '<div class="w-100">' +
            '<input type="text" id="txtApprovedMinMT' + (index + 1) + '" placeholder="MIN" class="form-control" />' +
            '</div>' +
            '<div class="w-100">' +
            '<input type="text" id="txtApprovedMaxMT' + (index + 1) + '" placeholder="MAX" class="form-control" />' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<input type="text" id="txtTextMT' + (index + 1) + '" oninput="RestrictNoAlpha(event)" placeholder="Enter" class="form-control color hide" />' +
            '<input type="text" id="txtNumberMT' + (index + 1) + '" placeholder="0" class="form-control density hide" />' +
            '<input type="hidden" id="hddCategoryMT' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsSampleMT' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsProductionMT' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsInvardMT' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsOutWardMT' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsMicrobiologicalMT' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddQCIDMT' + (index + 1) + '"  />' +
            '</td>');

        row.append(colNameAddRow)
            .append(colTestName)
            .append(colNameResultType)
            .append(colNameMeasuringUnit)
            .append(colApprovedRange);

        // Finally, append the row to the table body 
        $("#tblMicrobiologyTests tbody").append(row);
        var $ele0 = $('#ddlTestNameListMT' + (index + 1) + '');
        $ele0.empty();
        $ele0.append($('<option/>').val('').text('Select'));
        $.each(testNameArray, function (ii, vall) {
            if (vall.isMicrobiological == true) {
                var $option = $('<option />')
                    .val(vall.ID)
                    .text(vall.ValueName)
                    .attr('data-code', vall.ValueCode);
                //if (vall.ID == "1") {
                //    $option.attr("selected", "selected");
                //}
                $ele0.append($option);
            }
        });

        $('#ddlTestNameListMT' + (index + 1)).val(doc.Parameter_NameID);//.trigger('change');
        if (doc.Parameter_Type == 1) {
            document.getElementById('spResultTypeMT' + (index + 1)).innerText = 'Numeric';
            $('#txtNumberMT' + (index + 1) + '').val(doc.Numeric_Value);

            $('#txtNumberMT' + (index + 1) + '').show();
            $('#txtTextMT' + (index + 1) + '').hide();
            $('#divRangeMT' + (index + 1) + '').hide();
           // document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.Numeric_Value;
        }
        if (doc.Parameter_Type == 2) {
            document.getElementById('spResultTypeMT' + (index + 1)).innerText = 'Text';
            $('#txtNumberMT' + (index + 1) + '').hide();
            $('#txtTextMT' + (index + 1) + '').show();
            $('#divRangeMT' + (index + 1) + '').hide();

            $('#txtTextMT' + (index + 1) + '').val(doc.Text_Value);
           // document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.Text_Value;
        }
        if (doc.Parameter_Type == 3) {
            document.getElementById('spResultTypeMT' + (index + 1)).innerText = 'Range';
            $('#txtNumberMT' + (index + 1) + '').hide();
            $('#txtTextMT' + (index + 1) + '').hide();
            $('#divRangeMT' + (index + 1) + '').show();

            $('#txtApprovedMinMT' + (index + 1) + '').val(doc.Range_Min);
            $('#txtApprovedMaxMT' + (index + 1) + '').val(doc.Range_Max);
            //document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.Range_Min + '-' + doc.Range_Max;
        }
        document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.MeasuringUnit;
        //$('#txtNumber' + (index + 1)).val(doc.Numeric_Value);
        $('#hddCategoryMT' + (index + 1)).val(doc.Category);
        $('#hddIsSampleMT' + (index + 1)).val(doc.IsSample);
        $('#hddIsProductionMT' + (index + 1)).val(doc.IsProduction);
        $('#hddIsInvardMT' + (index + 1)).val(doc.IsInvard);
        $('#hddIsOutWardMT' + (index + 1)).val(doc.IsOutWard);
        $('#hddIsMicrobiologicalMT' + (index + 1)).val(doc.IsMicrobiological);
        $('#hddQCIDMT' + (index + 1)).val(doc.QCID);
        // }
    });
    if (isMicrobiologicalArray.length == 0) {
        var isNewRow = true;
        BindHTMLTableMicrobiologyTests(0, isNewRow);
    }
}
var testNameArray = [];
var QCTestMappingData = [];
function BindHTMLTableQualityParameters(docID) {
    var rowCount = $("#tblQCTestMapping tbody tr").length;
    if (rowCount > 0) {
        return false;
    }
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img onclick="AddRowQualityParameters();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameList(' + (rowCount + 1) + ');" id="ddlTestNameList' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameList' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultType' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnit' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRange' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMin' + (rowCount + 1) + '" placeholder="MIN" class="form-control" />' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMax' + (rowCount + 1) + '" placeholder="MAX" class="form-control" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtText' + (rowCount + 1) + '" oninput="RestrictNoAlpha(this)" placeholder="Enter" class="form-control color hide" />' +
        '<input type="text" id="txtNumber' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" />' +
        '<input type="hidden" id="hddCategory' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSample' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProduction' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiological' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCID' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblQCTestMapping tbody").append(row);
    var $ele0 = $('#ddlTestNameList' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological != true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });

}
function AddRowQualityParameters(docID) {
    var rowCount = $("#tblQCTestMapping tbody tr").length;
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img style="width: 15px;" class="btnDelete" onclick="DeleteRowQualityParameters(' + (rowCount + 1) + ');" src="../../assets/images/icons/help/close.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameList(' + (rowCount + 1) + ');" id="ddlTestNameList' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameList' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultType' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnit' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRange' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMin' + (rowCount + 1) + '" placeholder="MIN" class="form-control" />' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMax' + (rowCount + 1) + '" placeholder="MAX" class="form-control" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtText' + (rowCount + 1) + '" oninput="RestrictNoAlpha(this)" placeholder="Enter" class="form-control color hide" />' +
        '<input type="text" id="txtNumber' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" />' +
        '<input type="hidden" id="hddCategory' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSample' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProduction' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiological' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCID' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblQCTestMapping tbody").append(row);
    var $ele0 = $('#ddlTestNameList' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological != true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });

}
function DeleteRowQualityParameters(rowId) {
    $('#tblQCTestMapping').on('click', '.btnDelete', function () {
        $(this).closest('tr').remove();
    });
}
function DeleteRowMicrobiologyTests() {
    $('#tblMicrobiologyTests').on('click', '.btnDelete', function () {
        $(this).closest('tr').remove();
    });
}
function ChangeTestNameList(rowId) {
    var testNameId = 0;
    var selectedCode = $('#ddlTestNameList' + (rowId)).find(':selected').data('code');
    testNameId = $('#ddlTestNameList' + (rowId)).val();
    // Get row with ID = 8
    var result = testNameArray.find(x => x.ID === parseInt(testNameId));
    $('#hddCategory' + (rowId)).val(result.Category);
    $('#hddIsSample' + (rowId)).val(result.isSample);
    $('#hddIsProduction' + (rowId)).val(result.isProduction);
    $('#hddIsInvard' + (rowId)).val(result.isInvard);
    $('#hddIsOutWard' + (rowId)).val(result.isOutWard);
    $('#hddIsMicrobiological' + (rowId)).val(result.isMicrobiological);
    $('#hddQCID' + (rowId)).val(0);

    if (selectedCode == 1) {
        $('#txtNumber' + rowId + '').val(result.Numeric_Value);

        $('#txtNumber' + rowId + '').show();
        $('#txtText' + rowId + '').hide();
        $('#divRange' + rowId + '').hide();
        document.getElementById('spResultType' + rowId + '').innerText = 'Numeric';
        //document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Numeric_Value;
    }
    if (selectedCode == 2) {
        $('#txtNumber' + rowId + '').hide();
        $('#txtText' + rowId + '').show();
        $('#divRange' + rowId + '').hide();

        $('#txtText' + rowId + '').val(result.Text_Value);
        document.getElementById('spResultType' + rowId + '').innerText = 'Text';
        //document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Text_Value;
    }
    if (selectedCode == 3) {
        $('#txtNumber' + rowId + '').hide();
        $('#txtText' + rowId + '').hide();
        $('#divRange' + rowId + '').show();

        $('#txtApprovedMin' + rowId + '').val(result.Range_Min);
        $('#txtApprovedMax' + rowId + '').val(result.Range_Max);
        document.getElementById('spResultType' + rowId + '').innerText = 'Range';
        //document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Range_Min + '-' + result.Range_Max;
    }
    document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.MeasuringUnit;
}
function BindHTMLTableMicrobiologyTests(docID) {
    var rowCount = $("#tblMicrobiologyTests tbody tr").length;
    if (rowCount > 0) {
        return false;
    }
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img onclick="AddRowMicrobiologyTests();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameListMT(' + (rowCount + 1) + ');" id="ddlTestNameListMT' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameListMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultTypeMT' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnitMT' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRangeMT' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMinMT' + (rowCount + 1) + '" placeholder="MIN" class="form-control" />' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMaxMT' + (rowCount + 1) + '" placeholder="MAX" class="form-control" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtTextMT' + (rowCount + 1) + '" placeholder="Enter" oninput="RestrictNoAlpha(event)" class="form-control color hide" />' +
        '<input type="text" id="txtNumberMT' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" />' +
        '<input type="hidden" id="hddCategoryMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSampleMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProductionMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiologicalMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCIDMT' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblMicrobiologyTests tbody").append(row);
    var $ele0 = $('#ddlTestNameListMT' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological == true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });
}
function AddRowMicrobiologyTests(docID) {
    var rowCount = $("#tblMicrobiologyTests tbody tr").length;
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img style="width: 15px;" class="btnDelete" onclick="DeleteRowMicrobiologyTests(' + (rowCount + 1) + ');" src="../../assets/images/icons/help/close.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameListMT(' + (rowCount + 1) + ');" id="ddlTestNameListMT' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameListMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultTypeMT' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnitMT' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRangeMT' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMinMT' + (rowCount + 1) + '" placeholder="MIN" class="form-control" />' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMaxMT' + (rowCount + 1) + '" placeholder="MAX" class="form-control" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtTextMT' + (rowCount + 1) + '" oninput="RestrictNoAlpha(event)" placeholder="Enter" class="form-control color hide" />' +
        '<input type="text" id="txtNumberMT' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" />' +
        '<input type="hidden" id="hddCategoryMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSampleMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProductionMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiologicalMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCIDMT' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblMicrobiologyTests tbody").append(row);
    var $ele0 = $('#ddlTestNameListMT' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological == true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });
}
function ChangeTestNameListMT(rowId) {
    var testNameId = 0;
    var selectedCode = $('#ddlTestNameListMT' + (rowId)).find(':selected').data('code');
    testNameId = $('#ddlTestNameListMT' + (rowId)).val();
    // Get row with ID = 8
    var result = testNameArray.find(x => x.ID === parseInt(testNameId));
    $('#hddCategoryMT' + (rowId)).val(result.Category);
    $('#hddIsSampleMT' + (rowId)).val(result.isSample);
    $('#hddIsProductionMT' + (rowId)).val(result.isProduction);
    $('#hddIsInvardMT' + (rowId)).val(result.isInvard);
    $('#hddIsOutWardMT' + (rowId)).val(result.isOutWard);
    $('#hddIsMicrobiologicalMT' + (rowId)).val(result.isMicrobiological);
    $('#hddQCIDMT' + (rowId)).val(0);

    if (selectedCode == 1) {
        $('#txtNumberMT' + rowId + '').val(result.Numeric_Value);

        $('#txtNumberMT' + rowId + '').show();
        $('#txtTextMT' + rowId + '').hide();
        $('#divRangeMT' + rowId + '').hide();
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Numeric';
        //document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Numeric_Value;
    }
    if (selectedCode == 2) {
        $('#txtNumberMT' + rowId + '').hide();
        $('#txtTextMT' + rowId + '').show();
        $('#divRangeMT' + rowId + '').hide();

        $('#txtTextMT' + rowId + '').val(result.Text_Value);
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Text';
        //document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Text_Value;
    }
    if (selectedCode == 3) {
        $('#txtNumberMT' + rowId + '').hide();
        $('#txtTextMT' + rowId + '').hide();
        $('#divRangeMT' + rowId + '').show();

        $('#txtApprovedMinMT' + rowId + '').val(result.Range_Min);
        $('#txtApprovedMaxMT' + rowId + '').val(result.Range_Max);
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Range';
       // document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Range_Min + '-' + result.Range_Max;
    }
    document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.MeasuringUnit;
}

function collectTableData() {
    let isInvalid = false;  // Flag to detect invalid row
    // Create an empty array to store row data
    QCTestMappingData = [];
    // Select all rows in the table body (excluding any header row)
    // Assuming your <tbody> has the id="table-body"

    $('#tblQCTestMapping tbody tr').each(function (index) {
        // Collect the values from the cells/inputs within this row
        var ParameterNameID = $(this).find('#ddlTestNameList' + (index + 1) + '').val();  // Period Ind. (dropdown)
        var ParameterNameText = $(this).find('#ddlTestNameList' + (index + 1) + ' option:selected').text();  // Gets selected text
        var ParameterType = document.getElementById('spResultType' + (index + 1) + '').innerText;
        var typeMap = {
            "Numeric": 1,
            "Text": 2,
            "Range": 3
        };
        var ParameterTypeId = typeMap[ParameterType] || 0;
        //var Numeric_Value = $(this).find('#spMeasuringUnit' + (index + 1) + '').val();       // Series Name
        var TextValue = $(this).find('#txtText' + (index + 1) + '').val();    // First No.
        var NumericValue = $(this).find('#txtNumber' + (index + 1) + '').val();     // Prefix
        var RangeMin = $(this).find('#txtApprovedMin' + (index + 1) + '').val();     // Branch (dropdown)
        var RangeMax = $(this).find('#txtApprovedMax' + (index + 1) + '').val();     // Branch (dropdown)
        var Category = $(this).find('#hddCategory' + (index + 1) + '').val();     // Branch (dropdown)
        var IsSample = $(this).find('#hddIsSample' + (index + 1) + '').val();     // Branch (dropdown)
        var IsProduction = $(this).find('#hddIsProduction' + (index + 1) + '').val();     // Branch (dropdown)
        var IsInvard = $(this).find('#hddIsInvard' + (index + 1) + '').val();     // Branch (dropdown)
        var IsOutWard = $(this).find('#hddIsOutWard' + (index + 1) + '').val();     // Branch (dropdown)
        var IsMicrobiological = $(this).find('#hddIsMicrobiological' + (index + 1) + '').val();     // Branch (dropdown)
        var QCID = $(this).find('#hddQCID' + (index + 1) + '').val();     // Branch (dropdown)

        // Build an object representing a single row
        var rowData = {
            Parameter_NameID: ParameterNameID,
            Parameter_Type: ParameterTypeId,
            Numeric_Value: NumericValue == "" ? 0 : NumericValue,
            Text_Value: TextValue,
            Range_Min: RangeMin == "" ? 0 : RangeMin,
            Range_Max: RangeMax == "" ? 0 : RangeMax,
            Category: Category,
            IsSample: IsSample,
            IsProduction: IsProduction,
            IsInvard: IsInvard,
            IsOutWard: IsOutWard,
            IsMicrobiological: IsMicrobiological,
            QCID: QCID
        };
        if (ParameterNameText == 'Select') {
            isInvalid = true;  // Set invalid flag
            return null;

        }

        // Push it into the array
        QCTestMappingData.push(rowData);
    });
    if (document.getElementById('isMandatory').checked == true) {
        $('#tblMicrobiologyTests tbody tr').each(function (index) {
            // Collect the values from the cells/inputs within this row
            var ParameterNameID = $(this).find('#ddlTestNameListMT' + (index + 1) + '').val();  // Period Ind. (dropdown)
            var ParameterNameText = $(this).find('#ddlTestNameListMT' + (index + 1) + ' option:selected').text();  // Gets selected text
            var ParameterType = document.getElementById('spResultTypeMT' + (index + 1) + '').innerText;
            var typeMap = {
                "Numeric": 1,
                "Text": 2,
                "Range": 3
            };
            var ParameterTypeId = typeMap[ParameterType] || 0;
            //var Numeric_Value = $(this).find('#spMeasuringUnit' + (index + 1) + '').val();       // Series Name
            var TextValue = $(this).find('#txtTextMT' + (index + 1) + '').val();    // First No.
            var NumericValue = $(this).find('#txtNumberMT' + (index + 1) + '').val();     // Prefix
            var RangeMin = $(this).find('#txtApprovedMinMT' + (index + 1) + '').val();     // Branch (dropdown)
            var RangeMax = $(this).find('#txtApprovedMaxMT' + (index + 1) + '').val();     // Branch (dropdown)
            var Category = $(this).find('#hddCategoryMT' + (index + 1) + '').val();     // Branch (dropdown)
            var IsSample = $(this).find('#hddIsSampleMT' + (index + 1) + '').val();     // Branch (dropdown)
            var IsProduction = $(this).find('#hddIsProductionMT' + (index + 1) + '').val();     // Branch (dropdown)
            var IsInvard = $(this).find('#hddIsInvardMT' + (index + 1) + '').val();     // Branch (dropdown)
            var IsOutWard = $(this).find('#hddIsOutWardMT' + (index + 1) + '').val();     // Branch (dropdown)
            var IsMicrobiological = $(this).find('#hddIsMicrobiologicalMT' + (index + 1) + '').val();     // Branch (dropdown)
            var QCID = $(this).find('#hddQCIDMT' + (index + 1) + '').val();     // Branch (dropdown)

            // Build an object representing a single row
            var rowData = {
                Parameter_NameID: ParameterNameID,
                Parameter_Type: ParameterTypeId,
                Numeric_Value: NumericValue == "" ? 0 : NumericValue,
                Text_Value: TextValue,
                Range_Min: RangeMin == "" ? 0 : RangeMin,
                Range_Max: RangeMax == "" ? 0 : RangeMax,
                Category: Category,
                IsSample: IsSample,
                IsProduction: IsProduction,
                IsInvard: IsInvard,
                IsOutWard: IsOutWard,
                IsMicrobiological: IsMicrobiological,
                QCID: QCID
            };
            if (ParameterNameText == 'Select') {
                isInvalid = true;  // Set invalid flag
                return null;

            }
            // Push it into the array
            QCTestMappingData.push(rowData);
        });
    }
    // Now QCTestMappingData is an array of objects containing all rows' data
    return isInvalid ? null : QCTestMappingData;
}
function SaveQCCheck() {
    var data = collectTableData();
    if (data === null) {
        FailToaster('Please select paramter for QC.');
        return;
    }
    var ismicro = 1;
    const display = window.getComputedStyle(document.getElementById('divMicrobiologyTests')).display;
    if (display === 'none') {

        ismicro = 0;
    }  
    var itemModel =
    {
        ID: ItemIdData,
        GrnItemID: grnItemID,
        NoOfContainers: $('#txtNoOfContainers').val(),
        IsMicro: ismicro,
        QCTestMapping: QCTestMappingData
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(itemModel);

    var data = itemModel.QCTestMapping;

    const idSet = new Set();
    let hasDuplicates = false;

    for (const item of data) {
        if (idSet.has(item.Parameter_NameID)) {
            hasDuplicates = true;
            if (item.IsMicrobiological == 'false') {
                FailToaster(`Duplicate Parameters found in QC Check`);
            }
            else if (item.IsMicrobiological == 'true') {
                FailToaster(`Duplicate Parameters found in Microbiology Test`);
            }
            return; // Exit after first duplicate
        }

        idSet.add(item.Parameter_NameID);
    }
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "QCTask_1",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString1
    };

    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        $("#qctestmapping").modal('hide');
        setTimeout(function () {
            location.reload();
        }, 500); // 300ms delay (optional)
    });




}

function ShowQCMappingInitiated(itemId, grnIItemId) {
    ItemIdData = itemId;
    GItemId = grnIItemId;
    var model = {
        ID: itemId,
        ParentId: 0,
        GRNItemId: GItemId,
        IsMicro: false,
        IsRejected: false
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "QCTask_2";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var data = response.data.data.Table;

        $('#lbArnNumberInitiated').text(data[0].ARNUMBER);
        $('#lbDocDateInitiated').text(data[0].DOCDate ? ChangeDateFormatToddMMYYYWithSlace(data[0].DOCDate) : '');
        $('#lbBatchNumerInitiated').text(data[0].BatchOrLot);
        $('#lbItemNameInitiated').text(data[0].ITEM_NAME);
        $('#lbItemCodeInitiated').text(data[0].ITEM_CODE);
        $('#lbSuppNameInitiated').text(data[0].SupplierName);

        $('#txtRejectedQtyInitiated').val('0');
        $('#txtTotalQtyInitiated').val(data[0].TotalQty + ' ' + data[0].UOM);
        $('#hdntxtTotalQtyInitiated').val(data[0].TotalQty);
        $('#txtApprovedQtyInitiated').val(data[0].TotalQty + ' ' + data[0].UOM);
        $('#hdntxtApprovedQtyInitiated').val(data[0].TotalQty);
        $('#hdnUOM').val(data[0].UOM);

        $('#txtManufacturingDateInitiated').val(data[0].MFGDate ? ChangeDateFormatToddMMYYYWithSlace(data[0].MFGDate) : '');
        $('#txtExpDateInitiated').val(data[0].ExpDate ? ChangeDateFormatToddMMYYYWithSlace(data[0].ExpDate) : '');

        var filteredData = [];


        console.log(data);
        var data1 = response.data.data.Table1;
        if (data1.length > 0) {

            $('#txtFinalResultInitiated').val(data1[0].FinalResult).trigger('change');
            $('#txtRemarkInitiated').val(data1[0].Remark);
            $('#lbNoOfContainers').text(data1[0].NoOfContainers);
            // Filter records where IsMicrobiological is 0
            var filteredData = data1.filter(input => input.IsMicrobiological == 0)
            var filteredDataMicro = data1.filter(input => input.IsMicrobiological == 1)


            $('#txtNoOfContainerInitiated').val(data1[0].NoOfContainers);
            $('#txtRejectedQtyInitiated').val(data1[0].RejectedQty);
            // $('#txtApprovedQtyInitiated').val(data1[0].ApprovedQty);
            $('#txtSampleQty1').val(data1[0].SampleQty);
            if ($('#completed').hasClass('active')) {
                $('#initiatedBtn').hide();
                $('#txtApprovedQtyInitiated').val(data[0].TotalQty + ' ' + data[0].UOM);

                $('#txtManufacturingDateInitiated').val(data1[0].MfgFinalDate ? ChangeDateFormatToddMMYYYWithSlace(data1[0].MfgFinalDate) : '');
                $('#txtExpDateInitiated').val(data1[0].ExpFinalDate ? ChangeDateFormatToddMMYYYWithSlace(data1[0].ExpFinalDate) : '');


                $('#txtApprovedQtyInitiated').val(data1[0].ApprovedQty + ' ' + data[0].UOM);

                setTimeout(function () {
                    FreezeAllQCTestModals();
                }, 200);
            }

            console.log(data1);

            if (filteredDataMicro.length > 0) {
                $('#hdnIsMicro').val('1');

            }
            else {
                $('#hdnIsMicro').val('0');
            }


        }


        BindTableQCTestInitiated(filteredData);

        //Bind FMS Pdf, Videolink
        if (data[0].FMSVideolink != null && data[0].FMSVideolink.length >= 1) {
            $('#video2').attr('href', data[0].FMSVideolink);
            $('#video2').attr('target', '_blank');
        }
        else {
            $('#video2').removeAttr('target');
        }

        $('#open_pdf2').on('click', function () {
            handleTaskFile(data[0].FMSFileUrl, data[0].FMSActualFileName);
        })
        //Bind FMS Pdf, Videolink End

    });

    $("#qctestmappingInitiated").modal('show');
}
function parseDDMMMYYYY(dateStr) {
    const months = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const [dayStr, monthStr, yearStr] = dateStr.split('-');
    const day = parseInt(dayStr, 10);
    const month = months[monthStr];
    const year = parseInt(yearStr, 10);

    return new Date(year, month, day);
}


function SaveDataInitiated() {

    var ismicro = 1;
    const display = window.getComputedStyle(document.getElementById('divMicrobiologyTests')).display;
    if (display === 'none') {

        ismicro = 0;
    }    

    var isValidDate = true;
    // Get formatted date strings
    const manufactureDateStr = ChangeDateFormatSecond($('#txtManufacturingDateInitiated').val());
    const expDateStr = ChangeDateFormatSecond($('#txtExpDateInitiated').val());

    // Parse to Date objects
    const manufactureDate = parseDDMMMYYYY(manufactureDateStr);
    const expDate = parseDDMMMYYYY(expDateStr);
    // Validate
    if (expDate <= manufactureDate) {
        $('#sptxtExpDateInitiated').show();
        isValidDate = false;
    }

    if (checkValidationOnSubmit('MandateInitiated') == true && isValidDate == true) {

        if ($('#txtFinalResultInitiated').val() == 'Fail' && $('#txtRemarkInitiated').val().trim() == '') {
            $('#spRemarkInitiated').show();
            return;
        }
        var QCTestMappingData = [];
        // var inputs = $('#dtStockTransferInitiated').find('input[type="number"]');
        var inputs = $('#dtStockTransferInitiated').find('input[id^="tbResultMinInitiated_"]');

        inputs.each(function () {
            var id = $(this).attr('id');
            var value = $(this).val();
             
            // Optionally, parse ID to extract QCID and GrnItemQCResultId
            var parts = id.split('_'); // Example: tbResultMin_123_456
            var qcid = parts[1];
            var grnItemQCResultId = parts[2];
            var ItemObject = {
                GrnItemQCResultId: grnItemQCResultId,
                ResultMin: value,
                QCID: qcid
            }
            QCTestMappingData.push(ItemObject);
        });

        //if (QCTestMappingData.length <= 0) {
        //    FailToaster('Please map the QC Tests for this item before proceeding.!!!');
        //    return;
        //}

        var model =
        {
            GrnItemId: GItemId,
            ItemID: ItemIdData,
            ManufucatureDate: ChangeDateFormatSecond($('#txtManufacturingDateInitiated').val()),
            ExpDate: ChangeDateFormatSecond($('#txtExpDateInitiated').val()),
            FinalResult: $('#txtFinalResultInitiated').val(),
            Remark: $('#txtRemarkInitiated').val(),
            FromType: 1,
            QCTestMapping: QCTestMappingData,
            ApprovedQty: $('#hdntxtApprovedQtyInitiated').val(),
            RejectedQty: $('#txtRejectedQtyInitiated').val(),
            TotalQty: $('#hdntxtTotalQtyInitiated').val(),
            NoOfContainers: $('#txtNoOfContainerInitiated').val(),          
            IsMicro: ismicro,
            SampleQty: $('#txtSampleQty1').val(),
            PONumberType4: $('#lbArnNumberInitiated').text(),
            ItemNameType4: $('#lbItemNameInitiated').text(),
            VendorNameType4: $('#lbSuppNameInitiated').text(),
            RejectedQtyType4: $('#txtRejectedQtyInitiated').val(),
            UOM: $('#hdnUOM').val()

        };
        const jsonString = JSON.stringify(model);
        let GenericModeldata = {
            ScreenID: "QCTask_2",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            $("#qctestmappingInitiated").modal('hide');
            setTimeout(function () {
                location.reload();
            }, 300); // 300ms delay (optional)
        });

    }
}

function printCOA_RM_PM(GRNItemId, ARNumber) {
    $.ajax({
        url: '/ManageQualityCheck/ManageQualityCheck/PrintCOA_RM_PM?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { GRNItemId: GRNItemId, ARNumber: ARNumber },
        xhrFields: {
            responseType: 'blob' // Important to handle binary data like PDF
        },
        beforeSend: function (request) {
            request.setRequestHeader('Auth', getCookieValue('AuthToken'));
        },
        success: function (data, status, xhr) {
            $("#customLoader").hide();
            const disposition = xhr.getResponseHeader('Content-Disposition');
            const isPdf = xhr.getResponseHeader('Content-Type') === 'application/pdf';

            if (!isPdf) {
                // If the content is not PDF, assume it's an error message
                FailToaster("You don't have the permission to print this record");
                return;
            }

            // Get filename from headers or fallback
            let filename = "COA Report RM & PM.pdf";
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match != null && match[1]) {
                    filename = match[1].replace(/['"]/g, '');
                }
            }

            // Create a link and trigger download
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
        error: function (xhr) {
            $("#customLoader").hide();
            alert("Ajax Error: " + xhr.statusText || "Unknown error occurred");
        }
    });
}

function PrintCOA_FG_Oil(GRNItemId, ARNumber) {
    $.ajax({
        url: '/ManageQualityCheck/ManageQualityCheck/PrintCOA_FG_Oil?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { GRNItemId: GRNItemId, ARNumber: ARNumber },
        xhrFields: {
            responseType: 'blob' // Important to handle binary data like PDF
        },
        beforeSend: function (request) {
            request.setRequestHeader('Auth', getCookieValue('AuthToken'));
        },
        success: function (data, status, xhr) {
            $("#customLoader").hide();
            const disposition = xhr.getResponseHeader('Content-Disposition');
            const isPdf = xhr.getResponseHeader('Content-Type') === 'application/pdf';

            if (!isPdf) {
                // If the content is not PDF, assume it's an error message
                FailToaster("You don't have the permission to print this record");
                return;
            }

            // Get filename from headers or fallback
            let filename = "COA Report FG, Oil and SFY.pdf";
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match != null && match[1]) {
                    filename = match[1].replace(/['"]/g, '');
                }
            }

            // Create a link and trigger download
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
        error: function (xhr) {
            $("#customLoader").hide();
            alert("Ajax Error: " + xhr.statusText || "Unknown error occurred");
        }
    });
}



function PrintMLT_Report(GRNItemId, ARNumber) {
    $.ajax({
        url: '/ManageQualityCheck/ManageQualityCheck/PrintMLT_Report?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { GRNItemId: GRNItemId, ARNumber: ARNumber },
        xhrFields: {
            responseType: 'blob' // Important to handle binary data like PDF
        },
        beforeSend: function (request) {
            request.setRequestHeader('Auth', getCookieValue('AuthToken'));
        },
        success: function (data, status, xhr) {
            $("#customLoader").hide();
            const disposition = xhr.getResponseHeader('Content-Disposition');
            const isPdf = xhr.getResponseHeader('Content-Type') === 'application/pdf';

            if (!isPdf) {
                // If the content is not PDF, assume it's an error message
                FailToaster("You don't have the permission to print this record");
                return;
            }

            // Get filename from headers or fallback
            let filename = "COA Report FG, Oil and SFY.pdf";
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match != null && match[1]) {
                    filename = match[1].replace(/['"]/g, '');
                }
            }

            // Create a link and trigger download
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
        error: function (xhr) {
            $("#customLoader").hide();
            alert("Ajax Error: " + xhr.statusText || "Unknown error occurred");
        }
    });
}


function PrintARN_Label(GRNItemId) {
    $.ajax({
        url: '/ManageQualityCheck/ManageQualityCheck/PrintARN_Label?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { GRNItemId: GRNItemId },
        xhrFields: {
            responseType: 'blob' // Important to handle binary data like PDF
        },
        beforeSend: function (request) {
            request.setRequestHeader('Auth', getCookieValue('AuthToken'));
        },
        success: function (data, status, xhr) {
            $("#customLoader").hide();
            const disposition = xhr.getResponseHeader('Content-Disposition');
            const isPdf = xhr.getResponseHeader('Content-Type') === 'application/pdf';

            if (!isPdf) {
                // If the content is not PDF, assume it's an error message
                FailToaster("You don't have the permission to print this record");
                return;
            }

            // Get filename from headers or fallback
            let filename = "ARN Label.pdf";
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match != null && match[1]) {
                    filename = match[1].replace(/['"]/g, '');
                }
            }

            // Create a link and trigger download
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
        error: function (xhr) {
            $("#customLoader").hide();
            alert("Ajax Error: " + xhr.statusText || "Unknown error occurred");
        }
    });
}





function BindTableQCTestInitiated(filteredData) {
    if ($.fn.DataTable.isDataTable('#dtStockTransferInitiated')) {
        $('#dtStockTransferInitiated').DataTable().clear().destroy();
        $('#dtStockTransferInitiated').find('tbody').empty();
    }

    $('#dtStockTransferInitiated').DataTable({
        data: filteredData || [],
        paging: false, info: false, searching: false,
        orderMulti: false,       // avoid secondary sorts
        order: [[4, 'asc']],    // 5th column (QCID)
        columns: [
            { data: "TestName", orderable: false },     // prevent name sort
            { data: "ResultType", orderable: false },
            { data: "MeasuringUnit", orderable: false },
            { data: "ApprovedRange", orderable: false },
            { data: "QCID", visible: false },            // sorting key
            {
                orderable: false,
                data: null,
                render: function (data, type, row) {
                    if (type === 'sort' || type === 'type') return row.QCID | 0; // safety
                    return (row.ResultType === 'Text')
                        ? '<input type="text" value="' + (row.ResultMin ?? '') + '" autocomplete="off" ' +
                        'onkeypress="return RestrictNoAlpha(event)" onpaste="return RestrictNoAlphaPaste(event)" ' +
                        'class="form-control MandateInitiated" placeholder="Enter" ' +
                        'id="tbResultMinInitiated_' + row.QCID + '_' + row.GrnItemQCResultId + '" ' +
                        'oninput="HideErrorMessage(this)">' +
                        '<span id="sptbResultMinInitiated_' + row.QCID + '_' + row.GrnItemQCResultId + '" ' +
                        'class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>'
                        : '<input type="text" value="' + (row.ResultMin ?? '') + '" autocomplete="off" ' +
                        'class="form-control MandateInitiated" placeholder="Enter" ' +
                        'id="tbResultMinInitiated_' + row.QCID + '_' + row.GrnItemQCResultId + '" ' +
                        'oninput="HideErrorMessage(this)">' +
                        '<span id="sptbResultMinInitiated_' + row.QCID + '_' + row.GrnItemQCResultId + '" ' +
                        'class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';
                }
            }
        ],
        columnDefs: [
            { targets: 4, type: 'num' } // ensure numeric sort (not lexicographic "1,10,2")
        ]
    });
}



// 🔹 Restrict typing (keypress) to alphabets only
function RestrictNoAlpha(e) {
    //let char = String.fromCharCode(e.which);
    //if (!/^[a-zA-Z ]+$/.test(char)) {
    //    e.preventDefault();  // block numbers & symbols
    //    return false;
    //}
    //return true;

    console.log(this);
}

// 🔹 Restrict paste (clean invalid characters)
function RestrictNoAlphaPaste(e) {
    //let pastedData = (e.clipboardData || window.clipboardData).getData('text');
    //if (/[^a-zA-Z]/.test(pastedData)) {
    //    e.preventDefault(); // block invalid paste
    //    // ✅ optional: auto-clean and insert only letters
    //    let cleanData = pastedData.replace(/[^a-zA-Z]/g, "");
    //    document.execCommand("insertText", false, cleanData);
    //    return false;
    //}
    //return true;

    console.log(this);
}


function ShowQCMappingMicro(itemId, grnIItemId) {
    ItemIdData = itemId;
    GItemId = grnIItemId;
    var model = {
        ID: itemId,
        ParentId: 0,
        GRNItemId: GItemId,
        IsMicro: true,
        IsRejected: false
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "QCTask_2";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var data = response.data.data.Table;

        $('#lbArnNumberMicro').text(data[0].ARNUMBER);
        $('#lbDocDateMicro').text(data[0].DOCDate ? ChangeDateFormatToddMMYYYWithSlace(data[0].DOCDate) : '');
        $('#lbBatchNumerMicro').text(data[0].BatchOrLot);
        $('#lbItemNameMicro').text(data[0].ITEM_NAME);
        $('#lbItemCodeMicro').text(data[0].ITEM_CODE);
        $('#lbSuppNameMicro').text(data[0].SupplierName);
        var filteredData = [];
        var data1 = response.data.data.Table1;
        if (data1.length > 0) {
            //  $('#txtManufacturingDate').val(data1[0].ManufucatureDate ? ChangeDateFormatToddMMYYYWithSlace(data.ManufucatureDate) : '');
            $('#txtFinalResultMicro').val(data1[0].MicroFinalResult).trigger('change');
            $('#txtRemarkMicro').val(data1[0].MicroRemark);
            // Filter records where IsMicrobiological is 0
            filteredData = data1.filter(input => input.IsMicrobiological == 1)


            BindTableQCTestMicro(filteredData);
        }
    });

    $("#qctestmappingMicro").modal('show');
}
function SaveDataMicro() {
    if (checkValidationOnSubmit('MandateMicro') == true) {

        if ($('#txtFinalResultMicro').val() == 'Fail' && $('#txtRemarkMicro').val().trim() == '') {
            $('#spRemarkMicro').show();
            return;
        }

        var QCTestMappingData = [];
        var inputs = $('#dtStockTransferMicro').find('input[id^="tbResultMin_"]');
        inputs.each(function () {
            var id = $(this).attr('id');
            var value = $(this).val();

            // Optionally, parse ID to extract QCID and GrnItemQCResultId
            var parts = id.split('_'); // Example: tbResultMin_123_456
            var qcid = parts[1];
            var grnItemQCResultId = parts[2];
            var ItemObject = {
                GrnItemQCResultId: grnItemQCResultId,
                ResultMin: value,
                QCID: qcid
            }
            QCTestMappingData.push(ItemObject);
        });

        var model =
        {
            GrnItemId: GItemId,
            ItemID: ItemIdData,
            ManufucatureDate: $('#txtManufacturingDateMicro').val(),
            FinalResult: $('#txtFinalResultMicro').val(),
            Remark: $('#txtRemarkMicro').val(),
            FromType: 2,
            QCTestMapping: QCTestMappingData
        };
        const jsonString = JSON.stringify(model);
        let GenericModeldata = {
            ScreenID: "QCTask_2",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            $("#qctestmappingMicro").modal('hide');
            setTimeout(function () {
                location.reload();
            }, 300); // 300ms delay (optional)
        });

    }
}


function alphanumeric(ctrl) {
    // Allow only alphanumeric, * and /
    ctrl.value = ctrl.value.replace(/[^a-zA-Z0-9 ]/g, '');

}

function BindTableQCTestMicro(filteredData) {
    console.log(filteredData);
    $('#dtStockTransferMicro').DataTable().destroy();
    // global once: close on scroll / resize / wheel
    $(function () {
        function closeOpenPicker() {
            if (window._openDrp && window._openDrp.isShowing) {
                window._openDrp.hide();
            }
        }

        $(window).on('scroll.drp resize.drp', closeOpenPicker);

        $(document).on('wheel.drp mousewheel.drp DOMMouseScroll.drp', function (e) {
            if ($(e.target).closest('.daterangepicker').length) return; // allow inside calendar
            closeOpenPicker();
        });

        // allow wheel inside calendar
        $(document).on('wheel.drpInside mousewheel.drpInside DOMMouseScroll.drpInside', '.daterangepicker', function (e) {
            e.stopPropagation();
        });
    });

    $('#dtStockTransferMicro').on('draw.dt', function () {
        $('.datepicker').daterangepicker({
            opens: 'center',            // better horizontal placement
            drops: 'auto',              // let it flip up/down automatically
            singleDatePicker: true,
            showDropdowns: true,
            autoApply: true,
            autoUpdateInput: false,
            parentEl: 'body',           // don’t clip inside table
            locale: { format: 'DD/MM/YYYY' }
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
            $(this).siblings('.clear-date').show();
        }).on('show.daterangepicker', function (ev, picker) {
            // keep a handle to reposition
            window._openDrp = picker;

            // smart flip + clamp horizontally
            flipByViewport(picker, this);

            // re-run move after layout settles
            setTimeout(function () { picker.move(); }, 0);
        }).on('hide.daterangepicker', function () {
            window._openDrp = null;
        });

        // Clear date when clicking the × icon
        $('.clear-date').off('click').on('click', function () {
            const $input = $(this).siblings('.datepicker');
            $input.val('');
            $(this).hide();
        });

        // Hide × if input cleared manually
        $('.datepicker').off('input').on('input', function () {
            if ($(this).val() === '') {
                $(this).siblings('.clear-date').hide();
            }
        });

        // Open datepicker when clicking the calendar icon
        $('.input-group-text').off('click').on('click', function () {
            $(this).closest('.input-group').find('.datepicker').focus();
        });
    });

    // helper: flip up/down if needed and clamp horizontally
    function flipByViewport(picker, inputEl) {
        var rect = inputEl.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var vw = window.innerWidth || document.documentElement.clientWidth;

        var calH = 330, calW = 320; // approx popup size
        var spaceBelow = vh - rect.bottom;
        var spaceAbove = rect.top;

        // Flip up if not enough space below
        picker.drops = (spaceBelow < calH && spaceAbove > spaceBelow) ? 'up' : 'down';

        picker.move();

        // Clamp horizontally to viewport (8px padding)
        var c = picker.container[0].getBoundingClientRect();
        var dx = 0;
        if (c.right > vw - 8) dx = (vw - 8) - c.right;
        if (c.left < 8) dx = 8 - c.left;
        if (dx) {
            var curLeft = parseFloat(picker.container.css('left')) || 0;
            picker.container.css('left', (curLeft + dx) + 'px');
        }
    }

    // ---- global once ----
    $(function () {
        function closePicker() {
            if (window._openDrp && window._openDrp.isShowing) {
                window._openDrp.hide();
            }
        }
        // close on browser scroll/resize
        $(window).on('scroll.drp resize.drp', closePicker);
        // close on mouse wheel outside the popup
        $(document).on('wheel.drp', function (e) {
            if (!$(e.target).closest('.daterangepicker').length) closePicker();
        });
        // allow wheel inside calendar
        $(document).on('wheel.drpInside', '.daterangepicker', function (e) {
            e.stopPropagation();
        });
    });

    $('#dtStockTransferMicro').DataTable({
        "data": filteredData,  // assuming the returned data is directly the table array
        "paging": false,
        "info": false,
        "searching": false, // This hides the search box
        order: [[4, 'asc']], 
        "columns": [
            { "data": "TestName" },
            { "data": "ResultType" },
            { "data": "MeasuringUnit" },
            { "data": "ApprovedRange" },
            { data: "QCID", visible: false },  

            {
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {

                    return '<div class="d-flex  gap-10">' +
                        '<div class="w-100" >' +
                        '<div class="input-group">' +
                        '<input type="text" id="tbIncubationDate_' + row.QCID + '_' + row.GrnItemQCResultId + '" value="' + ChangeDateFormatToddMMYYYWithSlace(row.IncubationDate) + '" autocomplete="off" onblur="HideErrorMessage(this)" class="datepicker form-control MandateRejected" placeholder="DD/MM/YYYY">' +
                        '<span class="clear-date">×</span>' +
                        '<div class="input-group-append ">' +
                        '<span class="input-group-text bg-white"><img src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span>' +
                        '</div>' +
                        '<span id="sptbIncubationDate_' + row.QCID + '_' + row.GrnItemQCResultId + '"class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>'+
                        '</div>' +
                        '</div>' +
                        '<div class="w-100">' +
                        '<input type="time" value="' + row.IncubationTime + '"  id="tbIncubationTime_' + row.QCID + '_' + row.GrnItemQCResultId + '"  autocomplete="off" onchange="HideErrorMessage(this)" class="form-control MandateRejected"><span id="sptbIncubationTime_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        '</div>'


                }
            },
            {
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {

                    return '<div class="d-flex  gap-10">' +
                        '<div class="w-100" >' +
                        '<div class="input-group">' +
                        '<input type="text" id="tbObservationDate_' + row.QCID + '_' + row.GrnItemQCResultId + '" value="' + ChangeDateFormatToddMMYYYWithSlace(row.ObservationDate) + '"  autocomplete="off" onblur="HideErrorMessage(this)"class="datepicker form-control MandateRejected" placeholder="DD/MM/YYYY"> ' +
                        '<span class="clear-date">×</span>' +
                        '<div class="input-group-append ">' +
                        '<span class="input-group-text bg-white"><img src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span>' +
                        '</div>' +
                        '</div>' +
                        '<span id="sptbObservationDate_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>'+
                        '</div>' +
                        '<div class="w-100">' +
                        '<input type="time" value="' + row.ObservationTime + '" id="tbObservationTime_' + row.QCID + '_' + row.GrnItemQCResultId + '" onchange="HideErrorMessage(this)" autocomplete="off" class="form-control MandateRejected"> <span id="sptbObservationTime_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        
                        '</div>' 
                         


                }
            },
            {
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {

                    var val = row.NegativeControl == null ? '' : row.NegativeControl;

                    return '<input type="text"   autocomplete="off" value="' + val + '"   class="form-control MandateRejected" oninput="HideErrorMessage(this)" placeholder="Enter" id="tbNegativeControl_' + row.QCID + '_' + row.GrnItemQCResultId + '"> <span id="sptbNegativeControl_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';

                }
            },

            {
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {
                    if (row.ResultType == 'Text')
                        return '<input type="text" value="' + row.ResultMin + '" autocomplete="off"  onkeypress="return RestrictNoAlpha(event)" onpaste="return RestrictNoAlphaPaste(event)"    class="form-control alphaNumKey MandateRejected" placeholder="Enter" id="tbResultMin_' + row.QCID + '_' + row.GrnItemQCResultId + '" oninput="HideErrorMessage(this)"> <span id="sptbResultMin_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';
                    else
                        return '<input type="text" value="' + row.ResultMin + '" autocomplete="off"   class="form-control MandateRejected" placeholder="Enter" id="tbResultMin_' + row.QCID + '_' + row.GrnItemQCResultId + '" oninput="HideErrorMessage(this)"> <span id="sptbResultMin_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';

                }
            }
        ],
         columnDefs: [
            { targets: 4, type: 'num' } // ensure numeric sort (not lexicographic "1,10,2")
        ]
    });

    $('body').on('apply.daterangepicker', '.datepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
        $(this).siblings('.clear-date').show();

        var inputId = $(this).attr('id');
        var errorSpanId = 'sp' + inputId;
        $('#' + errorSpanId).hide();
    });
}


function addLotData(arr) {




    $("#dtStockTransfer tbody").html('');

    for (i = 0; i < arr.length; i++) {
        var RowId = $("#dtStockTransfer tbody tr").length + 1;
        let newRow = `
            <tr>
                <td>
                    <div class="deleterow text-center cursor-pointer" disabled>
                        <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
                        
                    </div>
                </td>                
                
                <td>
                <input type="text" id="txtUsedMedia_${RowId}" value="" class="form-control MandateRejected" value=""  oninput="HideErrorMessage(this)">
                    <span id="sptxtUsedMedia_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                </td>
                     <td>

                    <input type="text" id="txtLotNumber_${RowId}" class="form-control MandateRejected" value=""   oninput="HideErrorMessage(this); alphanumeric(this)">
                     <span id="sptxtLotNumber_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </td>

                
            </tr>`;

        // Append new row
        $(".itemsinformationMedia tbody").append(newRow);

        $(`#txtUsedMedia_${RowId}`).val(arr[i].UsedMedia);
        $(`#txtLotNumber_${RowId}`).val(arr[i].LotNumber);

    }

}

var RejectedQcId = 0;
function ShowQCMappingRejected(itemId, grnIItemId) {
    ItemIdData = itemId;
    GItemId = grnIItemId;
    var model = {
        ID: itemId,
        ParentId: 0,
        GRNItemId: GItemId,
        IsMicro: true,
        IsRejected: false
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "QCTask_2";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {

        console.log(response);
        var data = response.data.data.Table;
        var data1 = response.data.data.Table1;
        var data2 = response.data.data.Table2;
        var data3 = response.data.data.Table3;

        $('#lbArnNumberRejected').text(data[0].ARNUMBER);
        $('#lbDocDateRejected').text(data[0].DOCDate ? ChangeDateFormatToddMMYYYWithSlace(data[0].DOCDate) : '');
        $('#lbBatchNumerRejected').text(data[0].BatchOrLot);
        $('#lbItemNameRejected').text(data[0].ITEM_NAME);
        $('#lbItemCodeRejected').text(data[0].ITEM_CODE);
        $('#hdbQty').val(data[0].TotalQty);


        $('#txtChemistRejected').text(data[0].emp_name);
        $('#lbSuppNameRejected').text(data[0].SupplierName);
        $('#txtManufacturingDateRejected').text(data1[0].MfgFinalDate ? ChangeDateFormatToddMMYYYWithSlace(data1[0].MfgFinalDate) : '');
        $('#txtExpDateRejected').text(data1[0].ExpFinalDate ? ChangeDateFormatToddMMYYYWithSlace(data1[0].ExpFinalDate) : '');

        $('#txtRejectedQtyRejected').val('0');
        
        RejectedQcId = data1[0].QCID;
        $('#lbNoOfContainers4').text(data1[0].NoOfContainers);
        if ($('#completed').hasClass('active')) {
            var row = data1.find(input => input.QCID == RejectedQcId);

            var row1 = data1.filter(input => input.IsMicrobiological == 1)
            $('#hdbQtyExistingRejected').val(row.RejectedQty);
            $('#txtSampleQty2').val(row.SampleQty)
            $('#hdnUOM').val(data[0].UOM);
            $('#txtTotalQtyRejected').val(row1[0].RejectedQty + ' ' + data[0].UOM);
            $('#hdntxtTotalQtyRejected').val(row1[0].RejectedQty);
            $('#txtApprovedQtyRejected').val(row1[0].ApprovedQty + ' ' + data[0].UOM);
            $('#hdntxtApprovedQtyRejected').val(row1[0].ApprovedQty);
            $('#txtRemarkMicro').val(row1[0].MicroRemark);
            $('#hdbQtyRejected').val(parseFloat(data[0].TotalQty) - parseFloat(row.RejectedQty));
            $('#lbQtyRejected').text(data[0].TotalQty + ' ' + data[0].UOM);
            $('#txtFinalResultMicro').val(row1[0].MicroFinalResult == '' || row1[0].MicroFinalResult == null ? 'Select' : row1[0].MicroFinalResult).trigger('change');
            $('#viewRejQty').hide();
            $('#rejected_submit').hide();
            $('#txtRejectedQtyRejected').prop('disabled', true);

            $('#returnprocess').prop('checked', true);
            $('#returnprocess').prop('disabled', true);

            if (data2.length > 0) {
                addLotData(data2);
            }

            setTimeout(function () {
                FreezeAllQCTestModals();
            }, 200);

        }
        else {
            // done
            var row = data1.find(input => input.QCID == RejectedQcId);
            $('#hdnUOM').val(data[0].UOM);
            $('#txtRemarkMicro').val('');
            $('#viewRejQty').show();
            $('#txtSampleQty2').val(row.SampleQty);
            $('#hdbQtyExistingRejected').val(row.RejectedQty);
            $('#hdbQtyExistingApproved').val(row.ApprovedQty);
            $('#txtTotalQtyRejected').val(row.RejectedQty + ' ' + data[0].UOM);
            $('#hdntxtTotalQtyRejected').val(row.RejectedQty);
            $('#txtTotalQtyApproved').val(row.ApprovedQty);

            $('#lbQtyRejected').text(data[0].TotalQty + ' ' + data[0].UOM);
            $('#txtApprovedQtyRejected').val((parseFloat(data[0].TotalQty) - parseFloat(row.RejectedQty)).toString() + ' ' + data[0].UOM);
            $('#hdntxtApprovedQtyRejected').val(parseFloat(data[0].TotalQty) - parseFloat(row.RejectedQty));
            $('#hdbQtyRejected').val($('#txtApprovedQtyRejected').val());
            $('#txtRejectedQtyRejected').prop('disabled', false);
            $('#returnprocess').prop('checked', false);
            $('#returnprocess').prop('disabled', false);
            $('#rejected_submit').show();

        }
        var filteredData = data1.filter(input => input.IsMicrobiological == 1)
        BindTableQCTestMicro(filteredData);


        //Bind FMS Pdf, Videolink
        if (data3[0].FMSVideolink != null && data3[0].FMSVideolink.length >= 1) {
            $('#video3').attr('href', data3[0].FMSVideolink);
            $('#video3').attr('target', '_blank');
        }
        else {
            $('#video3').removeAttr('target');
        }

        $('#open_pdf3').on('click', function () {
            handleTaskFile(data3[0].FMSFileUrl, data3[0].FMSActualFileName);
        })
        //Bind FMS Pdf, Videolink End

    });

    $("#qctestmappingRejected").modal('show');
}

$(document).ready(function () {

    // Update on input (live typing)
    $('#txtRejectedQtyRejected').on('input', function () {
        var totalQty = parseFloat($('#hdbQtyRejected').val());

        var rejectedQty = parseFloat($(this).val()) || 0;
        var approvedQty = totalQty - rejectedQty;

        $('#txtApprovedQtyRejected').val(approvedQty.toFixed(3) + ' ' + $('#hdnUOM').val());
        $('#hdntxtApprovedQtyRejected').val(approvedQty.toFixed(3));
        // Prevent negative approved quantity
        if (approvedQty < 0) {
            $('#txtApprovedQtyRejected').val(parseFloat($('#hdbQtyRejected').val()).toFixed(3) + ' ' + $('#hdnUOM').val());
            $('#hdntxtApprovedQtyRejected').val($('#hdbQtyRejected').val());
            $('#txtRejectedQtyRejected').val('0');
            FailToaster("Rejected quantity cannot exceed approved quantity.");
        }

        // Update Total Rejected Quantity
        var existingRejectedQty = parseFloat($('#hdbQtyExistingRejected').val()) || 0;
        var totalRejectedQty = existingRejectedQty + rejectedQty;
        $('#txtTotalQtyRejected').val(totalRejectedQty.toFixed(3) + ' ' + $('#hdnUOM').val());
    });

    // Update on input (live typing)
    $('#txtRejectedQtyInitiated').on('input', function () {
        var totalQty = parseFloat($('#hdntxtTotalQtyInitiated').val());
        var rejectedQty = parseFloat($(this).val()) || 0;
        var approvedQty = totalQty - rejectedQty;
        $('#hdntxtApprovedQtyInitiated').val(approvedQty.toFixed(3));
        $('#txtApprovedQtyInitiated').val(approvedQty.toFixed(3) + ' ' + $('#hdnUOM').val());
        // Prevent negative approved quantity
        if (approvedQty < 0) {
            $('#hdntxtApprovedQtyInitiated').val($('#hdntxtTotalQtyInitiated').val());
            $('#txtApprovedQtyInitiated').val(parseFloat($('#hdntxtTotalQtyInitiated').val()).toFixed(3) + ' ' + $('#hdnUOM').val());

            $('#txtRejectedQtyInitiated').val('0');
            FailToaster("Rejected quantity cannot exceed approved quantity.");
        }
    });

});

function ShowRejectedCnfMsg() {

    var existingRejectQty = parseFloat($('#hdbQtyExistingRejected').val()) || 0;
    var newRejectedQty = parseFloat($('#txtRejectedQtyRejected').val()) || 0;
    var totalNewRejected = existingRejectQty + newRejectedQty;
    if (totalNewRejected > 0) {
        if (!$('#returnprocess').prop('checked')) {

            FailToaster('Please read and check the return process box before submitting');
            return;
        }
    }

    if (checkValidationOnSubmit('MandateRejected') == true) {
        var approvedQty = parseFloat($('#hdntxtApprovedQtyRejected').val()) || 0;
        var rejectedQty = parseFloat($('#txtRejectedQtyRejected').val()) || 0;
        var totalQty = parseFloat($('#hdbQtyRejected').val()) || 0;

        // Check if sum matches totalQty
        if ((parseFloat(approvedQty) + parseFloat(rejectedQty)) != parseFloat(totalQty)) {
            FailToaster("Total of Approved and Rejected quantity must equal Total Quantity.");
            return; // stop saving
        }

        //var QCTestMappingData = [];
        //var isChecked = document.getElementById('returnprocess').checked;
        //$('#dtStockTransferMicro tbody tr').each(function () {
        //    var row = $(this);

        //    var resultMinInput = row.find('input[id^="tbResultMin_"]');
        //    if (resultMinInput.length > 0) {
        //        var idParts = resultMinInput.attr('id').split('_');
        //        var qcid = idParts[1];
        //        var grnItemQCResultId = idParts[2];

        //        var item = {
        //            QCID: qcid,
        //            GrnItemQCResultId: grnItemQCResultId,
        //            ResultMin: resultMinInput.val(),
        //            NegativeControl: $('#tbNegativeControl_' + qcid + '_' + grnItemQCResultId).val(),
        //            IncubationDate: $('#tbIncubationDate_' + qcid + '_' + grnItemQCResultId).val(),
        //            IncubationTime: $('#tbIncubationTime_' + qcid + '_' + grnItemQCResultId).val(),
        //            ObservationDate: $('#tbObservationDate_' + qcid + '_' + grnItemQCResultId).val(),
        //            ObservationTime: $('#tbObservationTime_' + qcid + '_' + grnItemQCResultId).val(),
        //            RejectedQty: rejectedQty,
        //            ApprovedQty: approvedQty,
        //            IsPOReturn: isChecked,
        //            TotalQty: totalQty
        //        };

        //        QCTestMappingData.push(item);
        //    }
        //});





        ////var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
        ////var docDate = ChangeDateFormatToYYYYMMDDWithSlash(newDate);

        //var model =
        //{

        //    GrnItemId: GItemId,
        //    ItemID: ItemIdData,
        //    RejectedQty: rejectedQty,
        //    ApprovedQty: approvedQty,
        //    IsPOReturn: isChecked,
        //    TotalQty: totalQty,
        //    FromType: 3,
        //    QCTestMapping: QCTestMappingData,
        //    QCTMediaLotNumber: getTableData(),

        //};

        $('#cnf_approve_qty').html($('#txtApprovedQtyRejected').val());

        $('#cnf_reject_qty').html($('#txtRejectedQtyRejected').val() + ' ' + $('#hdnUOM').val());

        $('#cnf_item_code').html($('#lbItemCodeRejected').html());


        //const jsonString = JSON.stringify(model);
        //let GenericModeldata = {
        //    ScreenID: "QCTask_2",
        //    Operation: "A",  // Use Update for existing records, Add for new ones
        //    ModelData: jsonString
        //};

        //CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        //    $("#qctestmappingRejected").modal('hide');
        //    setTimeout(function () {
        //        location.reload();
        //    }, 300); // 300ms delay (optional)
        //});

        $('#confirmpopup').modal('show');

    }
}


function SaveDataRejected() {

    var existingRejectQty = parseFloat($('#hdbQtyExistingRejected').val()) || 0;
    var newRejectedQty = parseFloat($('#txtRejectedQtyRejected').val()) || 0;
    var totalNewRejected = existingRejectQty + newRejectedQty;
    if (totalNewRejected > 0) {
        if (!$('#returnprocess').prop('checked')) {

            FailToaster('Please read and check the return process box before submitting');
            return;
        }
    }

    var totalApproved = 0;
    var totalRejected = 0;
    if (checkValidationOnSubmit('MandateRejected') == true) {
        var approvedQty = parseFloat($('#hdntxtApprovedQtyRejected').val()) || 0;
        var rejectedQty = parseFloat($('#txtRejectedQtyRejected').val()) || 0;
        var totalQty = parseFloat($('#hdbQtyRejected').val()) || 0;
        var totalExQty = parseFloat($('#hdbQty').val()) || 0;
        //  totalApproved = approvedQty + (parseFloat($('#hdbQtyExistingApproved').val()) || 0);
        totalRejected = rejectedQty + (parseFloat($('#hdbQtyExistingRejected').val()) || 0);
        // Check if sum matches totalQty
        if ((parseFloat(approvedQty) + parseFloat(rejectedQty)) != parseFloat(totalQty)) {
            FailToaster("Total of Approved and Rejected quantity must equal Total Quantity.");
            return; // stop saving
        }
        var isValidData = true;
        var QCTestMappingData = [];
        var isChecked = document.getElementById('returnprocess').checked;
        $('#dtStockTransferMicro tbody tr').each(function () {
            var row = $(this);
            if (isValidData == true) {
                var resultMinInput = row.find('input[id^="tbResultMin_"]');
                if (resultMinInput.length > 0) {
                    var idParts = resultMinInput.attr('id').split('_');
                    var qcid = idParts[1];
                    var grnItemQCResultId = idParts[2];

                    var item = {
                        QCID: qcid,
                        GrnItemQCResultId: grnItemQCResultId,
                        ResultMin: resultMinInput.val(),
                        NegativeControl: $('#tbNegativeControl_' + qcid + '_' + grnItemQCResultId).val(),
                        IncubationDate: ChangeDateFormatSecond($('#tbIncubationDate_' + qcid + '_' + grnItemQCResultId).val()),
                        IncubationTime: $('#tbIncubationTime_' + qcid + '_' + grnItemQCResultId).val(),
                        ObservationDate: ChangeDateFormatSecond($('#tbObservationDate_' + qcid + '_' + grnItemQCResultId).val()),
                        ObservationTime: $('#tbObservationTime_' + qcid + '_' + grnItemQCResultId).val(),
                        RejectedQty: totalRejected,
                        ApprovedQty: approvedQty,
                        IsPOReturn: isChecked,
                        TotalQty: totalExQty,
                        FinalResult: $('#txtFinalResultMicro').val(),
                        Remark: $('#txtRemarkMicro').val(),
                        RejectedQtyOnSubmit: parseFloat($('#txtRejectedQtyRejected').val()),
                        ApprovedQtyOnSubmit: parseFloat($('#hdntxtApprovedQtyRejected').val()),
                        ManufucatureDate: ChangeDateFormatSecond($('#txtManufacturingDateInitiated').val()),
                        ExpDate: ChangeDateFormatSecond($('#txtExpDateInitiated').val()),
                        BalanceQtyRejectedOnSubmit: totalQty,
                        NoOfContainers: $('#lbNoOfContainers4').text(),
                        SampleQty: $('#txtSampleQty2').val()
                    };

                    // Combine date and time into a single Date object
                    let incubationDateTime = new Date(item.IncubationDate + ' ' + item.IncubationTime);
                    let observationDateTime = new Date(item.ObservationDate + ' ' + item.ObservationTime);

                    // Validation
                    if (observationDateTime <= incubationDateTime) {
                        FailToaster("Observation date/time must be later than incubation date/time.");
                        isValidData = false;
                    }
                    QCTestMappingData.push(item);
                }
            }
        });



        //var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
        //var docDate = ChangeDateFormatToYYYYMMDDWithSlash(newDate);
        if (isValidData == true) {
            var model =
            {

                GrnItemId: GItemId,
                ItemID: ItemIdData,
                RejectedQty: totalRejected,
                ApprovedQty: approvedQty,
                IsPOReturn: isChecked,
                TotalQty: totalExQty,
                FromType: 3,
                QCTestMapping: QCTestMappingData,
                RejectedQtyOnSubmit: parseFloat($('#txtRejectedQtyRejected').val()),
                ApprovedQtyOnSubmit: parseFloat($('#hdntxtApprovedQtyRejected').val()),
                ManufucatureDate: ChangeDateFormatSecond($('#txtManufacturingDateRejected').text()),
                ExpDate: ChangeDateFormatSecond($('#txtExpDateRejected').text()),
                FinalResult: $('#txtFinalResultMicro').val(),
                Remark: $('#txtRemarkMicro').val(),
                BalanceQtyRejectedOnSubmit: totalQty,
                QCTMediaLotNumber: getTableData(),
                NoOfContainers: $('#lbNoOfContainers4').text(),
                SampleQty: $('#txtSampleQty2').val(),
                PONumberType4: $('#lbArnNumberRejected').text(),
                ItemNameType4: $('#lbItemNameRejected').text(),
                VendorNameType4: $('#lbSuppNameRejected').text(),
                RejectedQtyType4: totalRejected,
                UOM: $('#hdnUOM').val()

            };
            const jsonString = JSON.stringify(model);
            let GenericModeldata = {
                ScreenID: "QCTask_2",
                Operation: "A",  // Use Update for existing records, Add for new ones
                ModelData: jsonString
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                $("#qctestmappingRejected").modal('hide');
                $('#confirmpopup').modal('hide');
                setTimeout(function () {
                    location.reload();
                }, 300); // 300ms delay (optional)
            });
        }
    }
}
function OpenInitiated() {
    var isValidDate = true;
    // Get formatted date strings
    const manufactureDateStr = ChangeDateFormatSecond($('#txtManufacturingDateInitiated').val());
    const expDateStr = ChangeDateFormatSecond($('#txtExpDateInitiated').val());

    // Parse to Date objects
    const manufactureDate = parseDDMMMYYYY(manufactureDateStr);
    const expDate = parseDDMMMYYYY(expDateStr);
    // Validate

    let QcmapData = [];

    var inputs = $('#dtStockTransferInitiated').find('input[id^="tbResultMinInitiated_"]');

    inputs.each(function () {
        var id = $(this).attr('id');
        var value = $(this).val();

        // Optionally, parse ID to extract QCID and GrnItemQCResultId
        var parts = id.split('_'); // Example: tbResultMin_123_456
        var qcid = parts[1];
        var grnItemQCResultId = parts[2];
        var ItemObject = {
            GrnItemQCResultId: grnItemQCResultId,
            ResultMin: value,
            QCID: qcid
        }
        QcmapData.push(ItemObject);
    });


    if (QcmapData.length <= 0) {
        FailToaster('Please map the QC Test Parameters for this item before proceeding.!!!');
        return;
    }



    if (expDate <= manufactureDate) {
        $('#sptxtExpDateInitiated').show();
        isValidDate = false;
    }
    if (checkValidationOnSubmit('MandateInitiated') == true && isValidDate == true) {

        if ($('#txtFinalResultInitiated').val() == 'Fail' && $('#txtRemarkInitiated').val().trim() == '') {
            $('#spRemarkInitiated').show();
            return;
        }
        $('#lblItemCode').text($('#lbItemCodeInitiated').text());
        $('#lblApproved').text($('#txtApprovedQtyInitiated').val());
        $('#lblRejected').text($('#txtRejectedQtyInitiated').val() + ' ' + $('#hdnUOM').val());
        $('#lblTotalQty').text($('#txtTotalQtyInitiated').val());
        $("#btnInitiatedPopup").trigger("click");
    }
}

function getTableData() {
    let tableData = [];
    let rows = document.querySelectorAll("#tableToModify tr"); // Select all rows
    var i = 1;
    rows.forEach((row) => {
        let txtUsedMedia = row.querySelector("[id^='txtUsedMedia']")?.value || "";
        let txtLotNumber = row.querySelector("[id^='txtLotNumber']")?.value || "";

        tableData.push({
            UsedMedia: txtUsedMedia,
            LotNumber: txtLotNumber
        });
    });

    console.log(tableData); // Debugging
    return tableData;
}

function FreezeAllQCTestModals() {
    const modals = ['#qctestmappingInitiated', '#qctestmappingRejected'];

    modals.forEach(function (modalSelector) {  
       const $modal = $(modalSelector);  

       // Disable all inputs, selects, textareas, and buttons  
        $modal.find('input, select, textarea, button').prop('disabled', true);  

       // Disable clear date icons  
       $modal.find('.clear-date').css({  
           'pointer-events': 'none',  
           'opacity': 0.5,  
           'cursor': 'not-allowed'  
       });  

       // Disable calendar icon images  
       $modal.find('.input-group-append .input-group-text, .input-group-append img').css({  
           'pointer-events': 'none',  
           'opacity': 0.5,  
           'cursor': 'not-allowed'  
       });  

        // Disable clickable icons (add, delete, etc.)
        $modal.find('[data-toggle="tooltip"], .cursor-pointer, .close, .clear-date').css({
            'pointer-events': 'none',
            'opacity': '0.5',
            'cursor': 'not-allowed'
        });

        // Optionally keep modal close enabled
        $modal.find('[data-dismiss="modal"]').prop('disabled', false).css({
            'pointer-events': 'auto',
            'opacity': '1',
            'cursor': 'pointer'
        });

        // Disable checkboxes
        $modal.find('input[type="checkbox"]').prop('disabled', true);

        // Clear and hide all error messages
        $modal.find('.field-validation-error').text('').hide();

        // Hide submit buttons  
        $modal.find('#initiatedBtn, #rejected_submit').hide();  

    });
}

function handleTaskFile(fileUrl, actualFileName) {
    // Determine file extension using lastIndexOf('.')

    /*const imageElement = document.getElementById('myImage');*/

    // Get the value of the 'src' attribute
    const filePath = fileUrl;
    const lastDotIndex = filePath.lastIndexOf('.');
    const fileExtension = lastDotIndex !== -1 ? filePath.substring(lastDotIndex + 1).toLowerCase() : '';

    // List of image extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    // Check if the file is an image

    downloadTaskFile(filePath, actualFileName);
}


function downloadTaskFile(filePath, actualFileName) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = actualFileName; // Let the browser decide the file name or specify one
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
