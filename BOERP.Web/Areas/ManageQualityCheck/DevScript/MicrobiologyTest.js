
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
                    TaskType: 3,
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
                    return '<strong class="text-primary">Task 2</strong> <span class="d-block">QC Check Initiated</span>';

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

        var data1 = response.data.data.Table1;

      //  $('#txtManufacturingDate').val(data1[0].ManufucatureDate ? ChangeDateFormatToddMMYYYWithSlace(data.ManufucatureDate) : '');
        $('#txtFinalResultMicro').val(data1[0].MicroFinalResult || '');
        $('#txtRemarkMicro').val(data1[0].MicroRemark || '');
        // Filter records where IsMicrobiological is 0
        var filteredData = data1.filter(input => input.IsMicrobiological == 1)


        BindTableQCTestMicro(filteredData);
    });

    $("#qctestmappingMicro").modal('show');
}
function SaveDataMicro() {
    if (checkValidationOnSubmit('MandateMicro') == true)
    {
        if ($('#txtFinalResultMicro').val() == 'Fail')
        {
            $('#spRemarkMicro').show();
            return;
        }
        var QCTestMappingData = [];
        var inputs = $('#dtStockTransferMicro').find('input[type="number"]');

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


function BindTableQCTestMicro(filteredData) {
    $('#dtStockTransferMicro').DataTable().destroy();
    $('#dtStockTransferMicro').DataTable({
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
                    return '<input type="number" value="' + row.ResultMin + '" autocomplete="off"   class="form-control MandateMicro" placeholder="Enter" id="tbResultMin_' + row.QCID + '_' + row.GrnItemQCResultId + '" onchange="HideErrorMessage(this)"> <span id="sptbResultMin_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';
                }
            }
        ]
    });


}