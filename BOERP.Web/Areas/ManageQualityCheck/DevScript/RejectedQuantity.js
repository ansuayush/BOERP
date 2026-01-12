
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
        });

    });


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

    BindData();

    
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

var indentTable;

function OnchageBindGrid() {
    BindData();
}
function BindData() {

    // Check if DataTable is already initialized, then destroy it
    if ($.fn.DataTable.isDataTable("#tblQC")) {
        $("#tblQC").DataTable().destroy();
    }


    indentTable = $('#tblQC').DataTable({
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
        "ajax": function (data, callback, settings) {
            var requestData = {
                start: data.start,      // Offset (where to start)
                length: data.length,    // Number of records per page
                search: data.search.value, // Search term (if any)
                orderColumn: data.order.length > 0 ? "DOCDate" : null,//data.columns[data.order[0].column].data : null,
                orderDir: data.order.length > 0 ? "desc" : "asc",  //data.order[0].dir : "asc",
                screenId: 'QCTask_1',//Need to change the screen id as per your data
                //modelData: jsonString
                modelData: JSON.stringify({
                    TaskType: 4,
                    Item: $("#ddlItem").val() == 'Select' ? '0' : $("#ddlItem").val(),
                    GRN: $("#ddlGRN").val() == 'All' ? '0' : $("#ddlGRN").val(),
                    FromDate: ChangeDateFormatSecond($('#txtFromDate').val()),
                    ToDate: ChangeDateFormatSecond($('#txtToDate').val()),
                    SupplierId: $("#ddlSupplier").val() == 'All' ? '0' : $("#ddlSupplier").val(),
                    Cate: $("#ddlCate").val() == 'All' ? '0' : $("#ddlCate").val(),
                })
            };

            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
                if (response && response.data) {

                    console.log(response);

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
        // Prevent sorting when clicking on search input fields
        columnDefs: [
            { orderable: false, targets: '_all' }
        ],
        "columns": [
            { "data": "DocNo" },

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

            { "data": "ARNumber", "orderable": true, },
            { "data": "ITEM_NAME", "orderable": true },
            { "data": "Category", "orderable": true },
            { "data": "BatchOrLot", "orderable": true, },
            { "data": "ItemQty", "orderable": true, },
            { "data": "SupplierName", "orderable": true, },
            {
                "data": "ExpDate",
                "orderable": true,
                "render": function (data, type, row) {
                    if (type === "display" || type === "filter") {
                        return "<label>" + ChangeDateFormatToddMMYYYWithSlace(data) + "</label>";
                    }
                    return data; // Ensure sorting works using raw data
                }
            }
            ,
            {
                "data": "TaskNumber",
                "orderable": true,
                "render": function (data, type, row) {
                    return '<strong class="text-primary">Task 4</strong> <span class="d-block">Rejected Quantity</span>';

                }
            },

            {
                "data": "PlannedDate",
                "orderable": true,
                "render": function (data, type, row) {
                    if (type === "display" || type === "filter") {
                        return "<label>" + ChangeDateFormatToddMMYYYWithSlace(data) + "</label>";
                    }
                    return data; // Ensure sorting works using raw data
                }
            },
            { "data": "Delay", "orderable": true, },

            {
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {

                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type = "button" id = "dropdownMenuButton" data - toggle="dropdown" aria - haspopup="false" aria - expanded="false" >' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">' +
                        '</span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">' +
                        '<a class="dropdown-item" href="" data-toggle="modal" onclick="ShowQCMapping(' + row.ITEM_ID + ',' + row.GRNItemId + ');">Mark Done</a>' +
                        '<a class="dropdown-item" href="Add-new-sample.html">Print COA</a>' +


                        '</div>' +
                        '</div > ';


                }
            }

        ]
    });

    // Tooltips and dropdowns remain
    $('[data-toggle="tooltip"]').tooltip();

    indentTable.on('draw.dt', function () {   // 🔥 corrected to indentTable
        $('[data-toggle="tooltip"]').tooltip();
    });

    // Dropdown positioning logic
    $(document).on('shown.bs.dropdown', '.dataTable .dropdown', function () {
        var $menu = $(this).find('.dropdown-menu');
        var $dropdown = $(this);
        var tableOffset = $dropdown.closest('table').offset();
        var dropdownOffset = $dropdown.offset();
        var scale = window.devicePixelRatio || 1;

        var newTop = (dropdownOffset.top - tableOffset.top + $dropdown.height()) / scale;
        var newLeft = (dropdownOffset.left - tableOffset.left) / scale;

        $('body').append($menu.detach());
        $menu.css({
            top: newTop + 'px',
            left: newLeft + 'px',
            position: 'absolute',
            zIndex: '1050',
            transform: 'translate(0, 10px)',
            minWidth: '200px'
        }).show();
    });

    $(document).on('hide.bs.dropdown', '.dataTable .dropdown', function () {
        var $menu = $(this).find('.dropdown-menu');
        $(this).append($menu.detach());
        $menu.hide();
    });

    TableSetup(indentTable)
}
var ItemIdData = 0;
var GItemId = 0;
var qcId = 0;
function ShowQCMappingRejected(itemId, grnIItemId) {
    ItemIdData = itemId;
    GItemId = grnIItemId;
    var model = {
        ID: itemId,
        ParentId: 0,
        GRNItemId: GItemId,
        IsMicro: true,
        IsRejected:true
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "QCTask_2";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var data = response.data.data.Table;

        $('#lbArnNumberRejected').text(data[0].ARNUMBER);
        $('#lbDocDateRejected').text(data[0].DOCDate ? ChangeDateFormatToddMMYYYWithSlace(data[0].DOCDate) : '');
        $('#lbBatchNumerRejected').text(data[0].BatchOrLot);
        $('#lbItemNameRejected').text(data[0].ITEM_NAME);
        $('#lbItemCodeRejected').text(data[0].ITEM_CODE);
        $('#hdbQtyRejected').val(data[0].TotalQty);  
        $('#lbSuppNameRejected').text(data[0].SupplierName);  
        $('#lbQtyRejected').text(data[0].TotalQty + ' ' + data[0].UOM);         
        $('#txtApprovedQtyRejected').val('0');
        $('#txtRejectedQtyRejected').val('0');
        var data1 = response.data.data.Table1;
        qcId = data1[0].QCID;
        
    });

    $("#qctestmappingRejected").modal('show');
}
var scopeId=0;
var postId = 0;

async function SaveData() {

    if (checkValidationOnSubmit('MandateRejected') == true)
    {
        var approvedQty = parseFloat($('#txtApprovedQtyRejected').val()) || 0;
        var rejectedQty = parseFloat($('#txtRejectedQtyRejected').val()) || 0;
        var totalQty = parseFloat($('#hdbQtyRejected').val()) || 0;

        // Check if sum matches totalQty
        if ((approvedQty + rejectedQty) !== totalQty) {
            FailToaster("Total of Approved and Rejected quantity must equal Total Quantity.");
            return; // stop saving
        }

        var isChecked = document.getElementById('returnprocess').checked;
        var QcTest = [];
        var objQc = {
            RejectedQty: rejectedQty,
            ApprovedQty:  approvedQty,
            IsPOReturn: isChecked,
            TotalQty: totalQty,
            QCID: qcId
            }
        QcTest.push(objQc);
        var model =
        {

            GrnItemId: GItemId,
            ItemID: ItemIdData,   
            RejectedQty: approvedQty,
            ApprovedQty: rejectedQty,
            IsPOReturn: isChecked,
            TotalQty: totalQty,
            FromType: 3,
            QCTestMapping: QcTest
        };
        const jsonString = JSON.stringify(model);
        let GenericModeldata = {
            ScreenID: "QCTask_2",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
         scopeId = response.ScopeID;

            if (scopeId > 0) {

                var isItemQtyQualityPost = await PostItemQtyQualityCheck(scopeId);

                if (isItemQtyQualityPost == 1) {
                    $("#qctestmapping").modal('hide');
                    setTimeout(function () {
                        location.reload();
                    }, 300); // 300ms delay (optional)}

                }
            }
        });

    }
}


function BindTableQCTestRejected(filteredData) {
    $('#dtStockTransferRejected').DataTable().destroy();
    $('#dtStockTransferRejected').DataTable({
        "data": filteredData,  // assuming the returned data is directly the table array
        "paging": false,
        "info": false,
        "searching": false, // This hides the search box
        "columns": [
            { "data": "TestName" },
            { "data": "ResultType" },
            { "data": "MeasuringUnit" },
            { "data": "ApprovedRange" },
            {
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {
                    return '<input type="number" value="' + row.ResultMin + '" autocomplete="off"   class="form-control MandateRejected" placeholder="Enter" id="tbResultMin_Rejected' + row.QCID + '_' + row.GrnItemQCResultId + '" onchange="HideErrorMessage(this)"> <span id="sptbResultMin_Rejected' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';
                }
            }
        ]
    });


}

function PostItemQtyQualityCheck(Id) {
    if (Id > 0) {
        //var docDate = ChangeDateFormatToYYYYMMDDWithSlash($("#txtSADocDate").val());
        var dt = new Date();
        var newDate = ChangeDateFormatToddMMYYYWithSlace(dt); // double-check spelling here!
        var docDate = ChangeDateFormatToYYYYMMDDWithSlash(newDate);
       
        var model = {
            ID: Id,
            SADocDate: docDate,
            DocType: 'ItemQtyQualityCheck'
        };
        // Convert the model to JSON string
        const jsonString = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "SAPost_101",
            Operation: "A",
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1 && response.ScopeID > 0) {
                postId = response.ScopeID;
                //setTimeout(function () {
                //}, 3000); // 3000 milliseconds = 3 seconds
            }
        });
    }

    if (postId > 0) {
        return 1;
    }
    else {
        return -1;
    }

}