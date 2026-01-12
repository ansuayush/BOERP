
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
                    TaskType: 1,
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
                        return '<strong class="text-primary">Task 1</strong> <span class="d-block">Enter QC Parameters</span>';                   
                  
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
                  
                    
                    return '<div class="dropdown">'+
                        '<span class="dropdown-toggle arrow-none" type = "button" id = "dropdownMenuButton" data - toggle="dropdown" aria - haspopup="false" aria - expanded="false" >' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">' +
                        '</span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">' +
                        '<a class="dropdown-item" href="#" data-toggle="modal" onclick="ShowQCMapping(' + row.ITEM_ID + ',' + row.GRNItemId +');">Mark Done</a>' +
                        '<a class="dropdown-item" href="Add-new-sample.html">Print COA</a>' +


                            '</div>'+
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
var grnItemID = 0;
function ShowQCMapping(itemId, GRNItemId) {
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
        if (response.data.data.Table1.length > 0) {
            var editQCTestData = response.data.data.Table1;
            BindTableQCTest(editQCTestData);
        }
        else {
            // Empty the table body first
            BindHTMLTableQualityParameters(0);
            BindHTMLTableMicrobiologyTests(0)
            document.getElementById('isMandatory').checked = false;
            document.getElementById('divMicrobiologyTests').style.display = 'none';
        }
    });

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
            '<input type="number" id="txtApprovedMin' + (index + 1) + '" placeholder="MIN" class="form-control" />' +
            '</div>' +
            '<div class="w-100">' +
            '<input type="number" id="txtApprovedMax' + (index + 1) + '" placeholder="MAX" class="form-control" />' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<input type="text" id="txtText' + (index + 1) + '" placeholder="Enter" class="form-control color hide" />' +
            '<input type="number" id="txtNumber' + (index + 1) + '" placeholder="0" class="form-control density hide" />' +
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
            document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.Numeric_Value;
        }
        if (doc.Parameter_Type == 2) {
            document.getElementById('spResultType' + (index + 1)).innerText = 'Text';
            $('#txtNumber' + (index + 1) + '').hide();
            $('#txtText' + (index + 1) + '').show();
            $('#divRange' + (index + 1) + '').hide();

            $('#txtText' + (index + 1) + '').val(doc.Text_Value);
            document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.Text_Value;
        }
        if (doc.Parameter_Type == 3) {
            document.getElementById('spResultType' + (index + 1)).innerText = 'Range';
            $('#txtNumber' + (index + 1) + '').hide();
            $('#txtText' + (index + 1) + '').hide();
            $('#divRange' + (index + 1) + '').show();

            $('#txtApprovedMin' + (index + 1) + '').val(doc.Range_Min);
            $('#txtApprovedMax' + (index + 1) + '').val(doc.Range_Max);
            document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.Range_Min + '-' + doc.Range_Max;
        }
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
        var colNameAddRow = $('<td class="text-center">' +
            '<div class="cursor-pointer"><img onclick="BindHTMLTableMicrobiologyTests();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
            '</td>');

        // Column 2: Period Ind. (dropdown)
        var colTestName = $('<td>' +
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
            '<input type="number" id="txtApprovedMinMT' + (index + 1) + '" placeholder="MIN" class="form-control" />' +
            '</div>' +
            '<div class="w-100">' +
            '<input type="number" id="txtApprovedMaxMT' + (index + 1) + '" placeholder="MAX" class="form-control" />' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<input type="text" id="txtTextMT' + (index + 1) + '" placeholder="Enter" class="form-control color hide" />' +
            '<input type="number" id="txtNumberMT' + (index + 1) + '" placeholder="0" class="form-control density hide" />' +
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
            document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.Numeric_Value;
        }
        if (doc.Parameter_Type == 2) {
            document.getElementById('spResultTypeMT' + (index + 1)).innerText = 'Text';
            $('#txtNumberMT' + (index + 1) + '').hide();
            $('#txtTextMT' + (index + 1) + '').show();
            $('#divRangeMT' + (index + 1) + '').hide();

            $('#txtTextMT' + (index + 1) + '').val(doc.Text_Value);
            document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.Text_Value;
        }
        if (doc.Parameter_Type == 3) {
            document.getElementById('spResultTypeMT' + (index + 1)).innerText = 'Range';
            $('#txtNumberMT' + (index + 1) + '').hide();
            $('#txtTextMT' + (index + 1) + '').hide();
            $('#divRangeMT' + (index + 1) + '').show();

            $('#txtApprovedMinMT' + (index + 1) + '').val(doc.Range_Min);
            $('#txtApprovedMaxMT' + (index + 1) + '').val(doc.Range_Max);
            document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.Range_Min + '-' + doc.Range_Max;
        }
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
        '<input type="number" id="txtApprovedMin' + (rowCount + 1) + '" placeholder="MIN" class="form-control" />' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="number" id="txtApprovedMax' + (rowCount + 1) + '" placeholder="MAX" class="form-control" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtText' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" />' +
        '<input type="number" id="txtNumber' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" />' +
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
        '<input type="number" id="txtApprovedMin' + (rowCount + 1) + '" placeholder="MIN" class="form-control" />' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="number" id="txtApprovedMax' + (rowCount + 1) + '" placeholder="MAX" class="form-control" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtText' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" />' +
        '<input type="number" id="txtNumber' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" />' +
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
        document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Numeric_Value;
    }
    if (selectedCode == 2) {
        $('#txtNumber' + rowId + '').hide();
        $('#txtText' + rowId + '').show();
        $('#divRange' + rowId + '').hide();

        $('#txtText' + rowId + '').val(result.Text_Value);
        document.getElementById('spResultType' + rowId + '').innerText = 'Text';
        document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Text_Value;
    }
    if (selectedCode == 3) {
        $('#txtNumber' + rowId + '').hide();
        $('#txtText' + rowId + '').hide();
        $('#divRange' + rowId + '').show();

        $('#txtApprovedMin' + rowId + '').val(result.Range_Min);
        $('#txtApprovedMax' + rowId + '').val(result.Range_Max);
        document.getElementById('spResultType' + rowId + '').innerText = 'Range';
        document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Range_Min + '-' + result.Range_Max;
    }
}

$('#isMandatory').on('change', function () {
    if ($(this).is(':checked')) {
        document.getElementById('divMicrobiologyTests').style.display = 'block';
        //BindHTMLTableMicrobiologyTests(0);
    } else {
        document.getElementById('divMicrobiologyTests').style.display = 'none';
    }
});

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
        '<input type="number" id="txtApprovedMinMT' + (rowCount + 1) + '" placeholder="MIN" class="form-control" />' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="number" id="txtApprovedMaxMT' + (rowCount + 1) + '" placeholder="MAX" class="form-control" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtTextMT' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" />' +
        '<input type="number" id="txtNumberMT' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" />' +
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
        '<input type="number" id="txtApprovedMinMT' + (rowCount + 1) + '" placeholder="MIN" class="form-control" />' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="number" id="txtApprovedMaxMT' + (rowCount + 1) + '" placeholder="MAX" class="form-control" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtTextMT' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" />' +
        '<input type="number" id="txtNumberMT' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" />' +
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
        document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Numeric_Value;
    }
    if (selectedCode == 2) {
        $('#txtNumberMT' + rowId + '').hide();
        $('#txtTextMT' + rowId + '').show();
        $('#divRangeMT' + rowId + '').hide();

        $('#txtTextMT' + rowId + '').val(result.Text_Value);
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Text';
        document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Text_Value;
    }
    if (selectedCode == 3) {
        $('#txtNumberMT' + rowId + '').hide();
        $('#txtTextMT' + rowId + '').hide();
        $('#divRangeMT' + rowId + '').show();

        $('#txtApprovedMinMT' + rowId + '').val(result.Range_Min);
        $('#txtApprovedMaxMT' + rowId + '').val(result.Range_Max);
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Range';
        document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Range_Min + '-' + result.Range_Max;
    }
}
function collectTableData() {
    // Create an empty array to store row data
    QCTestMappingData = [];
    // Select all rows in the table body (excluding any header row)
    // Assuming your <tbody> has the id="table-body"

    $('#tblQCTestMapping tbody tr').each(function (index) {
        // Collect the values from the cells/inputs within this row
        var ParameterNameID = $(this).find('#ddlTestNameList' + (index + 1) + '').val();  // Period Ind. (dropdown)
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

        // Push it into the array
        QCTestMappingData.push(rowData);
    });
    if (document.getElementById('isMandatory').checked == true) {
        $('#tblMicrobiologyTests tbody tr').each(function (index) {
            // Collect the values from the cells/inputs within this row
            var ParameterNameID = $(this).find('#ddlTestNameListMT' + (index + 1) + '').val();  // Period Ind. (dropdown)
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

            // Push it into the array
            QCTestMappingData.push(rowData);
        });
    }
    // Now QCTestMappingData is an array of objects containing all rows' data
    return QCTestMappingData;
}
function SaveQCCheck() {
    collectTableData();

    var itemModel =
    {
        ID: ItemIdData,       
        GrnItemID: grnItemID,
        QCTestMapping: QCTestMappingData
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(itemModel);
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
        }, 300); // 300ms delay (optional)
    });

    
}