$(document).ready(function () {
    //$("#txtItemCode").on("input", function () {
    //    var searchValue = $(this).val().trim();

    //    if (searchValue.length >= 2) { // Only filter if 2+ chars or empty
    //        GetItemMasterList();
    //    }
    //});
    //$("#txtItemName").on("input", function () {
    //    var searchValue = $(this).val().trim();

    //    if (searchValue.length >= 2) { // Only filter if 2+ chars or empty
    //        GetItemMasterList();
    //    }
    //});

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 68,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlHSN', obj1, 'Select', false);

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 77,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlDefaultWarehouse', obj2, 'Select', false);

    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 69,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlCategory', obj3, 'Select', false);

    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 69,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlItemCategory', obj3, 'All', false);

    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 72,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlUnit', obj4, 'Select', false);
    LoadMasterDropdown('ddlAlternateUnit', obj4, 'Select', false);
    var obj5 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 73,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlCharge', obj5, 'Select', false);
    var obj6 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 74,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlPreferredSupplier', obj6, 'Select', false);

    var obj7 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 65,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlBrandType', obj7, 'Select', false);

    var obj8 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 94,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlPurchAccName', obj8, 'Select', false);

    var obj9 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 94,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlSaleAccName', obj9, 'Select', false);

    //var obj10 = {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 91,
    //    manualTableId: 0,
    //    ScreenId: 'DropdownList_101'
    //}
    //LoadMasterDropdown('ddlUserType', obj10, 'Select', false);

    $('input[name="status"][value=Active]').prop('checked', true);
    $('#txtConversionFactor').prop('disabled', true);

    // Attach event listeners to both dropdowns
    $('#ddlUnit').change(function () {
        checkConversionFactor();
    });

    $('#ddlAlternateUnit').change(function () {
        checkConversionFactor();
    });

    sessionStorage.removeItem("chargeData");
    var itemMasterId = parseInt($("#hdnItemMasterId").val());
    if (itemMasterId > 0) {
        GetItemMasterDetById(itemMasterId);
    }
    else {
        // GetItemMasterList();
    }

    // Debounced filter input
    $('#txtItemCodeFilter').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblItemMaster")) {
            indentTable.ajax.reload();
        }
    }, 500));
    $('#txtItemName').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblItemMaster")) {
            indentTable.ajax.reload();
        }
    }, 500));

    $('#txtItemCode').prop('disabled', true);
    $('#ddlSubCategory').html('<option value="">Select</option>');


    $('#imgQc').on('click', function () {
        ShowQCMapping();
    });

});
// 🔁 Debounce function definition
function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}
var indentTable;
var ItemsArray = [];
function checkConversionFactor() {
    if ($('#ddlUnit').val() > 0 && $('#ddlAlternateUnit').val() > 0 && $('#ddlUnit').val() !== $('#ddlAlternateUnit').val()) {
        $('#txtConversionFactor').prop('disabled', false);
        $("#txtConversionFactor").val("0");
    }
    else if ($('#ddlUnit').val() > 0 && $('#ddlAlternateUnit').val() > 0 && $('#ddlUnit').val() === $('#ddlAlternateUnit').val()) {
        $('#txtConversionFactor').prop('disabled', true);
        $("#txtConversionFactor").val("1");
    }
    else {
        $('#txtConversionFactor').prop('disabled', true);
        $("#txtConversionFactor").val("0");
    }
}

$('#ddlUnit').change(function () {
    var obj = {
        parentId: $("#ddlCategory").val(),
        masterTableTypeId: 102,
        isMasterTableType: false,
        isManualTable: false,
        manualTable: 0,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlSubCategory', obj, 'Select', false);
});

function GetItemSubCategoryListById() {
    var itemCatId = $("#ddlCategory").val() > 0 ? $("#ddlCategory").val() : 0;
    if (itemCatId > 0) {
        var obj = {
            parentId: itemCatId,
            masterTableTypeId: 102,
            isMasterTableType: false,
            isManualTable: false,
            manualTable: 0,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlSubCategory', obj, 'Select', false);

        //Bind Customer Code
        if ($('#hdnItemMasterId').val() == "0" || $('#hdnItemMasterId').val() == "") {
            var model =
            {
                ID: itemCatId,
                OtherId: 0,
                ModuleId: 6
            };
            const jsonString = JSON.stringify(model);
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {

                console.log(response);

                var tblDocNo = response.data.data.Table;
                if (tblDocNo[0].DocLock == 0) {
                    $('#txtItemCode').val(tblDocNo[0].DocNumber);
                    $('#txtItemCode').prop('disabled', true);
                }
                else {
                    $('#txtItemCode').val('');
                    $('#txtItemCode').prop('disabled', false);
                }

                if (response.data.data.Table1[0].IsItemCatIdMatchQC == 1) {
                    document.getElementById("qcyes").checked = true;
                }
                else {
                    document.getElementById("qcno").checked = true;
                }

                setQCApplicable();

            });

        }

        //End
    }

}

var exceldata = [];
function GetItemMasterList() {
    //var model =
    //{
    //    ItemCode: $("#txtItemCode").val(),
    //    ItemName: $("#txtItemName").val()
    //};

    //const jsonString = JSON.stringify(model);

    // Check if DataTable is already initialized, then destroy it
    if ($.fn.DataTable.isDataTable("#tblItemMaster")) {
        $("#tblItemMaster").DataTable().destroy();
    }


    indentTable = $('#tblItemMaster').DataTable({
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
                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
                screenId: 'ItemMaster_103',//Need to change the screen id as per your data
                //modelData: jsonString,
                modelData: JSON.stringify({
                    Category: $("#ddlItemCategory").val() === 'All' ? '0' : $("#ddlItemCategory").val(),
                    Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
                    ItemCode: $("#txtItemCodeFilter").val(),
                    ItemName: $("#txtItemName").val()
                })
            };

            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {

                console.log(response);

                if (response && response.data) {
                    exceldata = response.data.Records;
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
        // Prevent sorting when clicking on search input fields
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Export to Excel',
                exportOptions: {
                    columns: ':visible, :hidden'
                }
            }
        ],
        columnDefs: [
            { orderable: false, targets: '_all' }
        ],
        "columns": [
            //{ "data": "Srno" },
            { "data": "ITEM_CODE", "orderable": true, },
            {
                "data": "ITEM_NAME",
                "orderable": true,
                "render": function (data, type, row) {
                    return '<a href="/MaterialManagement/Material/ItemMasterDetById?auth=' + AuthToken + '&itemId=' + row.ITEM_ID + '" class="d-flex justify-content-between" data-toggle="tooltip" title="' + row.ITEM_NAME + '" data-item-id="' + row.ITEM_ID + '">' +
                        '<strong>' + row.ITEM_NAME + '</strong>' +
                        '<span><img src="../../assets/images/icons/help/edit.png" class="icon-xsm" alt="Edit"></span>'
                    '</a>'
                }
            },
            {
                "data": "DESCRIPTION",
                "orderable": true,
                "render": function (data, type, row) {
                    return '<div class="ellipsis">' + row.DESCRIPTION + '</div> '
                }
            },
            {
                "data": "WarehouseName",
                "orderable": true,
                "visible": false,         // Hides the column from the table
                "render": function (data, type, row) {
                    return '<div class="ellipsis">' + row.WarehouseName + '</div> '
                }
            },
            {
                "data": "ITEM_CATEGORY",
                "orderable": true,
                "render": function (data, type, row) {
                    if (row.ITEM_CATEGORY == row.ITEM_SUB_CATEGORY) {
                        return '<span class="d-block">' + row.ITEM_CATEGORY + '</span>' + ''
                    }
                    else {
                        return '<span class="d-block">' + row.ITEM_CATEGORY + '</span>' + row.ITEM_SUB_CATEGORY
                    }
                }
            },

            { "data": "HSN_CODE" },
            { "data": "UNIT" },
            { "data": "ItemCharges" },
            { "data": "MIN_QTY" },
            { "data": "MAX_STOCK_LEVEL" },
            { "data": "PA_NAME" },
            { "data": "LEAD_TIME" },
            { "data": "PACK_SIZE" },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {
                    if (row.STATUS == 'Active') {
                        return `<span class="circle circle-sm green-bg" data-toggle="tooltip" title="Active"></span>`;

                    }
                    else {
                        return `<span class="circle circle-sm red-bg" data-toggle="tooltip" title="Inactive"></>`;
                    }
                }
            },
            {
                "data": "ITEM_ID",
                "orderable": false,
                "className": "text-center", // Add this for center alignment
                "render": function (data, type, row) {
                    return '<input type="hidden" id="hdnItemMasterId" value="' + row.ITEM_ID + '"/>' +
                        '<a href = "../../MaterialManagement/Material/ItemMasterDetById?auth=' + AuthToken + '&itemId=' + row.ITEM_ID + '" class="fn-bold" > View</a > '

                }
            },
        ]
    });

    // Tooltips and dropdowns remain
    $('[data-toggle="tooltip"]').tooltip();

    indentTable.on('draw.dt', function () {   // ⚠️ Use customerTable instead of indentTable
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

    TableSetup(indentTable);
}

function bindItemMasterGridFilter() {

    let filterData = tableData;

    var Status = $("#ddlStatus").val() === '0' ? '0' : $("#ddlStatus option:selected").html();

    var Category = $("#ddlItemCategory").val() === 'All' ? '0' : $("#ddlItemCategory option:selected").html();

    if (Status != '0') {

        filterData = tableData.filter(row => row.STATUS.toLowerCase() == Status.toLowerCase());

    }
    if (Category != '0') {
        filterData = tableData.filter(row => row.ITEM_CATEGORY == Category);
    }

    if (filterData.length > 0) {

        gridOptions.api.setRowData(filterData);

    } else {

        if (globalGridOptions != null)
            gridOptions.api.setRowData([]);

    }

}

let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindItemMasterGrid();

    function bindItemMasterGrid() {
        $("#customLoader").show();

        //Replaceable content
        //Start
        var requestData = {
            start: 0,
            length: 20000000,
            search: '',
            orderColumn: null,
            orderDir: "asc",
            screenId: 'ItemMaster_103',//Need to change the screen id as per your data
            //modelData: jsonString,
            modelData: JSON.stringify({
                Category: $("#ddlItemCategory").val() === 'All' ? '0' : $("#ddlItemCategory").val(),
                Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
                ItemCode: '',
                ItemName: ''
            })
        };
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tableData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'ItemMasterGrid', columnMeta, tableData);
            //$("#customLoader").hide();
        });
    }

});

function OnchangeStatus() {
    GetItemMasterList();
}
function OnchangeCategory() {
    GetItemMasterList();
}
var itemId = 0;
function GetItemMasterDetById(id) {
    itemId = id;
    var model = {
        ID: id
    };
    const jsonString = JSON.stringify(model);
    var ScreenID = "ItemMaster_101";
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var tableData = response.data.data.Table;
        if (tableData && tableData.length > 0) {
            console.log(tableData);
            $("#hdnItemMasterId").val(tableData[0].ITEM_ID);
            $('#txtItemCode').val(tableData[0].ItemCode);
            $('#txtItemCode').prop('readonly', true);
            $('#txtItemName').val(tableData[0].ItemName);
            $('#ddlHSN').val(tableData[0].HSNId).trigger('change');
            $('#txtDescription').val(tableData[0].Description);

            var statusValue = tableData[0].ItemStatus;
            $('input[name="status"][value="' + statusValue + '"]').prop('checked', true);

            $('#ddlDefaultWarehouse').val(tableData[0].WarehouseId).trigger('change');
            var batchValue = tableData[0].BatchApplicable;
            $('input[name="batchapplicable"][value="' + batchValue + '"]').prop('checked', true);
            var qcValue = tableData[0].QC_APPLICABLE;
            $('input[name="qcapplicable"][value="' + qcValue + '"]').prop('checked', true);
            if (qcValue == "Yes") {
                var IsBioMetricallyValue = tableData[0].IsBioMetrically;
                document.getElementById('divUserType').style.display = 'none';
                document.getElementById('divQCTestMapping').style.display = 'block';
                $('input[name="biometrically"][value="' + IsBioMetricallyValue + '"]').prop('checked', true);
            }
            else {
                document.getElementById('divUserType').style.display = 'none';
                document.getElementById('divQCTestMapping').style.display = 'none';
            }
            $('#ddlCategory').val(tableData[0].CategoryId).trigger('change');
            $('#ddlSubCategory').val(tableData[0].GroupId > 0 ? tableData[0].GroupId : 'Select').trigger('change');

            $('#ddlUnit').val(tableData[0].StockUnitId).trigger('change');
            $('#txtAlternateUnit').val(tableData[0].AltUnitId);
            $('#ddlAlternateUnit').val(tableData[0].AltUnitTypeId).trigger('change');
            $('#txtConversionFactor').val(tableData[0].ConversionFactor);

            $('#ddlPurchAccName').val(tableData[0].PurchAccId).trigger('change');
            $('#ddlSaleAccName').val(tableData[0].SaleAccId).trigger('change');

            $('#ddlCharge').val(tableData[0].PurchTaxId).trigger('change');
            $('#txtPurchRate').val(tableData[0].PurchRate);
            $('#txtSaleRate').val(tableData[0].SaleRate);

            $('#txtMinStockLevel').val(tableData[0].MinQty);
            $('#txtMaxStockLevel').val(tableData[0].MaxStockLevel);
            $('#txtSafetyStockLevel').val(tableData[0].SafetyStockLevel);

            $('#ddlPreferredSupplier').val(tableData[0].PreferedSupplierId > 0 ? tableData[0].PreferedSupplierId : 'Select').trigger('change');

            $('#txtLeadTime').val(tableData[0].LeadTime);
            $('#ddlLoadTime').val(tableData[0].LeadtimeType).trigger('change');
            $('#txtPackSize').val(tableData[0].PackSize);
            $('#txtTolerance').val(tableData[0].Tolerance);
            $('#ddlBrandType').val(tableData[0].BrandTypeId > 0 ? tableData[0].BrandTypeId : 'Select').trigger('change');

            $('#itemCharges').text(tableData[0].ItemCharges);
            //Item Attachment
            for (var i = 0; i < response.data.data.Table1.length; i++) {
                var fileName = response.data.data.Table1[i].ActualFileName;
                var fileType = response.data.data.Table1[i].FileType;
                var type = response.data.data.Table1[i].Type;
                var fileUrl = response.data.data.Table1[i].FileUrl;
                var fFd = response.data.data.Table1[i].AttachmentId;
                var fSize = response.data.data.Table1[i].FileSize;
                var newfileName = response.data.data.Table1[i].NewFileName;
                var attachmentType = response.data.data.Table1[i].AttachmentType;
                //Check type and load
                if (attachmentType == 'Upload1') {
                    LoadFileData1(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                }
                else if (attachmentType == 'Upload2') {
                    LoadFileData2(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                }
                else {
                    LoadFileData3(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                }
            }

            // Load Item Charges (Table2)
            //if (response.data.data.Table2 && response.data.data.Table2.length > 0) {
            //    BindItemMasterCharge(response.data.data.Table2);
            //}

            if (response.data.data.Table2 && response.data.data.Table2.length > 0) {
                sessionStorage.setItem("chargeData", JSON.stringify(response.data.data.Table2));
            }

            statusValue == 'Active' ? $('#btnSave').show() : $('#btnSave').hide();    //Hide & Show Save button

        }
        else {
            console.error("Item not found..", error);
        }

    });
}

let fileModelList = [];
let fileModelList1 = [];
let fileModelList2 = [];

let fileDatalList = [];
let fileDatalList1 = [];
let fileDatalList2 = [];

async function SaveItemMaster() {
    var id = parseInt($("#hdnItemMasterId").val());
    if (checkValidationOnSubmit('Mandatory') == true) {
        var batchApplicable = $('input[name="batchapplicable"]:checked').val();
        if (!batchApplicable) {
            FailToaster("Please select whether Batch is applicable or not.");
            return;
        }
        var qcApplicable = $('input[name="qcapplicable"]:checked').val();
        if (!qcApplicable) {
            FailToaster("Please select whether QC is applicable or not.");
            return;
        }
        if ($('#itemCharges').text() == '') {
            FailToaster("Please select item tax mapping.");
            return;
        }

        if ($("#ddlUnit").val() != $("#ddlAlternateUnit").val()) {
            if ($("#txtConversionFactor").val() <= 0) {
                FailToaster("When Base unit & Alt Unit different, Please fill Conversion Factor.");
                return;
            }
        }

        var obj =
        {
            FolderNames: "ItemDocuments/"
        }
        var type = 1;//This is for  common upload in attachment folder.
        const jsonString = JSON.stringify(obj);
        const result1 = await MultiFileUploadWithoutAync("fileMaterialPhoto", jsonString, type, fileDataCollection1);
        const result2 = await MultiFileUploadWithoutAync("fileMaterialCOA", jsonString, type, fileDataCollection2);
        const result3 = await MultiFileUploadWithoutAync("fileAttachment3", jsonString, type, fileDataCollection3);
        var fileData1 = [];
        var fileData2 = [];
        var fileData3 = [];
        var finalFileData1 = [];
        var finalFileData2 = [];
        var finalFileData3 = [];

        if (result1.Data != undefined) {
            fileData1 = JSON.parse(result1.Data).FileModelList;
            fileData1 = fileData1.concat(fileDatalList);
            finalFileData1 = finalFileData1.concat(fileData1);
        }
        else {
            fileData1 = fileModelList;
        }

        if (result2.Data != undefined) {
            fileData2 = JSON.parse(result2.Data).FileModelList;
            fileData2 = fileData2.concat(fileDatalList1);
            finalFileData2 = finalFileData2.concat(fileData2);
        }
        else {
            fileData2 = fileModelList1;
        }

        if (result3.Data != undefined) {
            fileData3 = JSON.parse(result3.Data).FileModelList;
            fileData3 = fileData3.concat(fileDatalList2);
            finalFileData3 = finalFileData3.concat(fileData3);
        }
        else {
            fileData3 = fileModelList2;
        }

        finalFileData1 = fileModelList.concat(finalFileData1);
        finalFileData2 = fileModelList1.concat(finalFileData2);
        finalFileData3 = fileModelList2.concat(finalFileData3);

        // ✅ File count validation
        if (finalFileData1.length > 10) {
            FailToaster(finalFileData1.length + " Files. You cannot upload more than 10 files for Material Photo.");
            return;
        }
        if (finalFileData2.length > 10) {
            FailToaster(finalFileData2.length + " Files. You cannot upload more than 10 files for Material COA.");
            return;
        }
        if (finalFileData3.length > 10) {
            FailToaster(finalFileData3.length + " Files. You cannot upload more than 10 files for Item Attachments.");
            return;
        }
        var isBatchApplicable = false;
        if (document.getElementById('yes').checked == true) {
            isBatchApplicable = true;
        }

        var itemModel =
        {
            ID: id > 0 ? id : 0,
            ITEM_CODE: $("#txtItemCode").val(),
            ITEM_NAME: $("#txtItemName").val(),
            HSN_ID: $("#ddlHSN").val(),
            STATUS: $('input[name="status"]:checked').val(),  // Active or Inactive
            DESCRIPTION: $("#txtDescription").val(),
            WAREHOUSE_ID: $("#ddlDefaultWarehouse").val() > 0 ? $("#ddlDefaultWarehouse").val() : 0,
            BATCH_APPLICABLE: $('input[name="batchapplicable"]:checked').val(),
            CATEGORY_ID: $("#ddlCategory").val(),
            SUBCATEGORY_ID: $("#ddlSubCategory").val() > 0 ? $("#ddlSubCategory").val() : 0,
            BASE_UNIT_ID: $("#ddlUnit").val(),
            //ALTERNATE_UNIT: $("#txtAlternateUnit").val(),
            ALTERNATE_UNIT_ID: $("#ddlAlternateUnit").val(),
            CONVERSION_FACTOR: $("#txtConversionFactor").val(),
            /*TAX_CODE_ID: $("#ddlCharge").val() > 0 ? $("#ddlCharge").val() : 0,*/
            TAX_CODE_ID: 0,
            PURCH_RATE: $("#txtPurchRate").val(),
            SALE_RATE: $("#txtSaleRate").val(),

            MIN_STOCK_LEVEL: $("#txtMinStockLevel").val(),
            MAX_STOCK_LEVEL: $("#txtMaxStockLevel").val(),
            SAFETY_STOCK_LEVEL: $("#txtSafetyStockLevel").val(),
            PREFFERED_SUPPLIER: $("#ddlPreferredSupplier").val() > 0 ? $("#ddlPreferredSupplier").val() : 0,
            LEAD_TIME: $("#txtLeadTime").val(),
            LEAD_TIME_TYPE: $("#ddlLoadTime").val(),
            PACK_SIZE: $("#txtPackSize").val(),
            TOLERANCE: $("#txtTolerance").val(),
            BRAND_TYPE_Id: $("#ddlBrandType").val() > 0 ? $("#ddlBrandType").val() : 0,
            ITEM_TYPE: 'I',
            UserTypeId: 0,
            QC_APPLICABLE: $('input[name="qcapplicable"]:checked').val(),
            IsBioMetrically: $('input[name="biometrically"]:checked').val(),
            MaterialPhotoAttachment: fileData1,
            MaterialCOAAttachment: fileData2,
            ItemAttachment: fileData3,
            ItemTaxChargeData: itemChargeData,
            QCTestMapping: QCTestMappingData,

            PurchAccountId: $("#ddlPurchAccName").val() > 0 ? $("#ddlPurchAccName").val() : 0,
            SaleAccountId: $("#ddlSaleAccName").val() > 0 ? $("#ddlSaleAccName").val() : 0
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(itemModel);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "ItemMaster_101",
            Operation: id > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                setTimeout(function () {
                    ClearFormControl();
                    RedirectItemMasterList();
                }, 1000);

            }
        });
    }
}
function DeleteItemMaster() {
    var id = parseInt($("#hdnItemMasterId").val());
    let GenericModeldata = "";
    if (id > 0) {
        var model = {
            ID: parseInt($("#hdnItemMasterId").val())
        }
        const jsonString = JSON.stringify(model);
        GenericModeldata =
        {
            ScreenID: "ItemMaster_101",
            Operation: "D",
            ModelData: jsonString,
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                $('#deletepopup').modal('hide');
                $("#hdnItemMasterId").val(0);
                ClearFormControl();
                location.reload();
            }
        });
    }
}

function RedirectItemMasterList() {
    var url = "/MaterialManagement/Material/BindItemMasterList?auth=" + AuthToken;
    window.location.href = url;
}

function ClearFormControl() {
    $('#hdnItemMasterId').val(0);
    $('#txtItemCode').val('');
    $('#txtItemName').val('');
    $('#ddlHSN').val('Select').trigger('change');
    $('input[name="status"]').prop('checked', false);
    $('#txtDescription').val('');
    $('input[name="batchapplicable"]').prop('checked', false);
    $('#ddlCategory').val('Select').trigger('change');
    $('#ddlSubCategory').val('Select').trigger('change');
    $('#ddlUnit').val('Select').trigger('change');
    $('#txtAlternateUnit').val('');
    $('#ddlAlternateUnit').val('Select').trigger('change');
    $('#txtConversionFactor').val('');
    $('#ddlPurchAccName').val('Select').trigger('change');
    $('#ddlSaleAccName').val('Select').trigger('change');
    $('#ddlCharge').val('Select').trigger('change');
    $('#txtTolerance').val('');
    $('#txtMinStockLevel').val('');
    $('#txtMaxStockLevel').val('');
    $('#txtSafetyStockLevel').val('');
    $('#ddlPreferredSupplier').val('Select').trigger('change');
    $('#txtLeadTime').val('');
    $('#ddlLoadTime').val('Select').trigger('change');
    $('#txtPackSize').val('');
}

// Preview the file based on its type
function LoadFileData1(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    var fileObject =
    {
        "TypeDetails": type,
        "FileType": fileType,
        "FolderNames": "ItemDocuments/",
        "ActualFileName": fileName,
        "NewFileName": newfileName,
        "FileUrl": fileUrl,
        "FileSize": sSize,

    };
    fileModelList.push(fileObject);

    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile1(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "video") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <video class="preview-video" controls>
                            <source src="${e.target.result}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
        <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file1");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages1").appendChild(newDocument);
}

function LoadFileData2(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    var fileObject =
    {
        "TypeDetails": type,
        "FileType": fileType,
        "FolderNames": "ItemDocuments/",
        "ActualFileName": fileName,
        "NewFileName": newfileName,
        "FileUrl": fileUrl,
        "FileSize": sSize,

    };
    fileModelList1.push(fileObject);

    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile2(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "video") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <video class="preview-video" controls>
                            <source src="${e.target.result}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                        <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
        <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file2");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages2").appendChild(newDocument);
}

function LoadFileData3(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    var fileObject =
    {
        "TypeDetails": type,
        "FileType": fileType,
        "FolderNames": "ItemDocuments/",
        "ActualFileName": fileName,
        "NewFileName": newfileName,
        "FileUrl": fileUrl,
        "FileSize": sSize,

    };
    fileModelList2.push(fileObject);

    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile3(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile3(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "video") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <video class="preview-video" controls>
                            <source src="${e.target.result}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                        <button onclick="RemoveAttachFile3(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile3(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile3(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
        <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file3");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages3").appendChild(newDocument);
}
function SelectUploadDocument() {
    $('#uploadExcelDocument').show();
}
function CloseUploadDocument() {
    $('#uploadExcelDocument').hide();
}
function splitArrayIntoChunks(array, chunkSize = 1000) {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}

async function SaveUploadDocument() {

    //uploadExcel()
    if (ItemsArray.length > 0) {

        var ValidateItemsArray = ItemsArray.filter(item =>
            ![
                item.ITEM_CODE.trim(),
                item.ITEM_NAME.trim(),
                item.WAREHOUSE_ID.trim(),
                item.STATUS.trim(),
                item.HSN_ID.trim(),
                item.BATCH_APPLICABLE.trim(),
                item.CATEGORY_ID.trim(),
                item.ALTERNATE_UNIT_TYPE.trim(),
                item.CONVERSION_FACTOR.trim(),
                item.STOCK_UNIT_ID.trim(),
                item.CGST.trim(),
                item.SGST.trim(),
                item.IGST.trim(),
                item.InvalidIGST.trim()
            ].some(value => value === "")
        );
        var ErrorItemsArray = ItemsArray.filter(item =>
            [
                item.ITEM_CODE.trim(),
                item.ITEM_NAME.trim(),
                item.WAREHOUSE_ID.trim(),
                item.STATUS.trim(),
                item.HSN_ID.trim(),
                item.BATCH_APPLICABLE.trim(),
                item.CATEGORY_ID.trim(),
                item.STOCK_UNIT_ID.trim(),
                item.ALTERNATE_UNIT_TYPE.trim(),
                item.CONVERSION_FACTOR.trim(),
                item.CGST.trim(),
                item.SGST.trim(),
                item.IGST.trim(),
                item.InvalidIGST.trim(),
                item.OP_AMT.trim(),
                item.OP_QTY.trim(),
                item.PURCH_RATE.trim(),
                item.SALE_RATE.trim()
            ].some(value => value === "")
        );

        // Function to find empty fields in each object
        const specificColumns = ["ITEM_CODE", "ITEM_NAME", "WAREHOUSE_ID", "STATUS", "HSN_ID",
            "BATCH_APPLICABLE", "CATEGORY_ID", "ALTERNATE_UNIT_TYPE", "CONVERSION_FACTOR", "STOCK_UNIT_ID",
            "CGST", "SGST", "IGST", "InvalidIGST"]; // Replace with actual column names

        var emptyColumnsArray = ErrorItemsArray.map((item, index) => {debugger
            let emptyColumns = specificColumns.filter(key => item[key] === "");
            return { rowNumber: index + 1, ItemCode: item.ITEM_CODE, emptyColumns };
        }).filter(entry => entry.emptyColumns.length > 0);

        var splitArr = splitArrayIntoChunks(ValidateItemsArray);
        let uploadedCount = ""; // Initialize uploaded record count
        ShowLoadingDialog();
        for (let i = 0; i < splitArr.length; i++) {
            let model = { Items: splitArr[i] };

            let GenericModeldata = {
                ScreenID: "BulkUpload_101",
                Operation: "A",
                ModelData: JSON.stringify(model)
            };

            (function (batchIndex) {
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                    // Display uploaded record count                  
                    uploadedCount = response.data.Table1;
                });
            })(i); // Pass `i` as a parameter to preserve the correct value
        }
        ShowandCloseLoader();
        $('#fileLimitPopup').hide();
        findEmptyColumns(emptyColumnsArray, uploadedCount);
        $('#uploadExcelDocument').hide();
        //GetItemMasterList();
    }

}
function findEmptyColumns(emptyColumnsArray, dulicateData) {debugger
    if (emptyColumnsArray.length > 0 || dulicateData.length > 0) {
        var tableHTML = "";
        if (emptyColumnsArray.length > 0) {
            tableHTML = `<table style="overflow:scroll;">
                                <tr>
                                    <th>Sr No</th>
                                    <th>Item Code</th>
                                    <th>Empty Columns</th>
                                </tr>`;

            emptyColumnsArray.forEach(entry => {
                tableHTML += `<tr>
                                <td>${entry.rowNumber}</td>
                                <td>${entry.ItemCode}</td>
                                <td>${entry.emptyColumns.join(", ")}</td>                                
                              </tr>`;
            });

            tableHTML += `</table>`;
        }
        var tableHTMLDuplicate = "";
        if (dulicateData.length > 0) {
            if (dulicateData[0].DuplicateItemCodes != "" && dulicateData[0].DuplicateItemNames != "") {
                tableHTMLDuplicate = `<table style="overflow:scroll;">
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
function UploadExcel() {
    const input = document.getElementById("fileUpload");

    if (input.files.length > 1) {
        FailToaster("Please select only one file.");
        input.value = ""; // Clear selection
        return;
    }
    const file = input.files[0];
    if (!file) {
        FailToaster("No file selected.");
        return;
    }

    const allowedExtensions = [".xls", ".xlsx"];
    const fileName = file.name.toLowerCase();
    const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
        FailToaster("Only Excel files(.xls, .xlsx) are allowed.");
        input.value = ""; // Reset file input
        return;
    }
    //var fileInput = $("#fileUpload")[0].files[0];
    //if (!fileInput) {
    //    alert("Please select an Excel file.");
    //    return;
    //}

    var formData = new FormData();
    formData.append("file", file);
    //fileCount = document.querySelectorAll('.document-file1 .file-preview').length;
    //if (fileCount == 0) {
    //    $.ajax({
    //        url: '/Material/UploadItemMasterExcelFile',
    //        type: 'POST',
    //        data: formData,
    //        contentType: false,
    //        processData: false,
    //        success: function (response) {

    //            //ItemsArray = response.data;
    //            // let response = "Base64_String_From_Response";
    //            let decodedJson = atob(response);  // Decode Base64

    //            ItemsArray = JSON.parse(decodedJson); // Convert back to JSON
    //            if (ItemsArray.length > 0) {
    //                $('#btnExcelUpload').show();
    //            }
    //            else {
    //                $('#btnExcelUpload').hide();
    //                //alert('Excel file is not in correct format.')
    //                FailToaster("Excel file is not in correct format.");
    //            }
    //        },
    //        error: function (xhr) {
    //            console.error("Error during file upload:", xhr.responseText || xhr.statusText);
    //        }
    //    });
    //}
}

function ExportItemsData() {
    // Get the table element
    let ws_data = [];
    ws_data = exceldata.map(item => ({
        ITEM_CODE: item.ITEM_CODE,//1
        ITEM_NAME: item.ITEM_NAME,//2
        DESCRIPTION: item.DESCRIPTION,//3
        WarehouseName: item.WarehouseName,//4
        HSN_CODE: item.HSN_CODE,//5
        STATUS: item.STATUS,//6
        BATCH_APPLICABLE: item.BATCH_APPLICABLE,//7
        ITEM_CATEGORY: item.ITEM_CATEGORY,//8
        ITEM_SUB_CATEGORY: item.ITEM_SUB_CATEGORY,//9
        UNIT: item.UNIT,//10
        ALT_UNIT: item.ALT_UNIT,//11
        CONVERSION_FACTOR: item.CONVERSION_FACTOR,//12
        TOLERANCE: item.TOLERANCE,//13
        MIN_QTY: item.MIN_QTY,//14
        MAX_STOCK_LEVEL: item.MAX_STOCK_LEVEL,//15
        SAFETY_STOCK_LEVEL: item.SAFETY_STOCK_LEVEL,//16
        PREFFERED_SUPPLIER: item.PREFFERED_SUPPLIER,//17
        LEAD_TIME_TYPE: item.LEAD_TIME_TYPE,//18
        PACK_SIZE: item.PACK_SIZE,//19
        CGSTCharge: item.CGSTCharge,//20
        SGSTCharge: item.SGSTCharge,//21
        IGSTCharge: item.IGSTCharge,//22
        OP_AMT: item.OP_AMT,//23
        OP_QTY: item.OP_QTY,//24
        PURCH_RATE: item.PURCH_RATE,//25
        SALE_RATE: item.SALE_RATE//26
    }));
    downloadExcelFromJson(ws_data, 'ItemList.xlsx')
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

//#region : Item Master Charge Event

function BindItemMasterCharge() {
    var model = {
        ID: "0",
        TableName: "ChargeType"
    };

    const jsonString = JSON.stringify(model);
    var ScreenID = "ItemMaster_102";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        console.log(response);
        var tableData = response.data.data.Table;
        var $chargeList = $('#edittablecc tbody');
        $chargeList.empty();

        if (tableData.length === 0) {
            $('#noResultsMessage').show();
        } else {
            $('#noResultsMessage').hide();

            // Retrieve existing charge data from sessionStorage (if available)
            var chargeData = sessionStorage.getItem("chargeData");
            chargeData = chargeData ? JSON.parse(chargeData) : [];

            tableData.forEach(function (row) {
                // Check if session data exists for the charge type
                var existingCharge = chargeData.find(c => c.ChargeTypeId === row.ID);

                // Set default tax dropdown and percentage
                var selectedChargeId = existingCharge ? existingCharge.ChargeId : "";
                var chargePercentage = (existingCharge && existingCharge.CHRG_PER) ? existingCharge.CHRG_PER : "0.00";

                // Ensure Dropdown gets bound properly
                var listItem = `  
                    <tr data-chargeid="${row.ID}">
                        <td class="text-left charge-type">${row.ChargeType}</td>
                        <td class="text-left">
                            <select class="form-control applyselect tax-dropdown" id="ddlTax_${row.ID}" data-chargeid="${row.ID}">
                                <option value="0">Select</option>
                            </select>
                        </td>
                        <td class="text-center">
                            <input type="number" value="${chargePercentage}" class="text-right form-control charge-percentage" disabled />
                        </td>
                    </tr>
                `;
                $chargeList.append(listItem);

                $('#ddlTax_' + row.ID).select2({
                    placeholder: "Select",
                    allowClear: true,
                    width: '100%'
                });

                // Automatically load tax dropdown based on charge type ID (Fix for ITEM_ID = 0)
                LoadTaxDropdownOnClick(`ddlTax_${row.ID}`, row.ID, selectedChargeId);
            });

            // Now store the updated chargeData in sessionStorage
            sessionStorage.setItem("chargeData", JSON.stringify(chargeData));

        }
    });
}

// Function to fetch and bind tax rates when dropdown is clicked (only if empty)
function LoadTaxDropdownOnClick(dropdownId, chargeId, selectedValue) {
    var dropdown = $("#" + dropdownId);

    // Clear existing options and add "Loading..."
    dropdown.empty().append('<option value="">Loading...</option>');

    LoadMasterDropdown(dropdownId, {
        parentId: chargeId,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 82,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false, function () {
        // Ensure value is set after options are loaded
        setTimeout(function () {
            if (selectedValue && dropdown.find(`option[value="${selectedValue}"]`).length > 0) {
                dropdown.val(selectedValue).trigger('change');
            } else {
                dropdown.val("Select"); // Ensure "Select" is chosen if no previous value exists
            }
        }, 500); // Delay to allow options to populate
    });
}

$(document).ready(function () {
    // Event listener for all dynamically created dropdowns
    $(document).on("change", ".tax-dropdown", function () {
        var chargeId = $(this).data("chargeid");
        var selectedTax = $(this).val();
        UpdateChargePercentage(chargeId, selectedTax);
    });
});

// Function to update the charge percentage when tax dropdown changes
function UpdateChargePercentage(chargeId, selectedTax) {
    var chargePercentageField = $(`tr[data-chargeid="${chargeId}"] .charge-percentage`);

    if (selectedTax) {
        GetChargePercentage(selectedTax, function (chargePercentage) {
            chargePercentageField.val(chargePercentage);
        });
    } else {
        chargePercentageField.val("0.00");
    }
}

function GetChargePercentage(selectedTax, callback) {
    var model = {
        ID: selectedTax,
        TableName: "Charge"
    };

    const jsonString = JSON.stringify(model);
    var ScreenID = "ItemMaster_102";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        console.log(response);
        var tableData = response.data.data.Table;

        if (tableData.length > 0) {
            var chargePercentage = tableData[0].TaxPer || "0.00"; // Adjust field name if different
            callback(chargePercentage); // Pass the value back
        } else {
            callback("0.00"); // Default if no data is found
        }
    });
}

let itemChargeData = []; // Global array to store charge data

//function SaveItemMasterChargeData() {
//    itemChargeData = []; // Clear previous data

//    $("#edittablecc tr").each(function () {
//        var chargeId = $(this).data("chargeid");
//        var selectedTax = $(this).find(".tax-dropdown").val();
//        var chargePercentage = $(this).find(".charge-percentage").val();

//        // Convert selectedTax to integer and chargePercentage to float
//        selectedTax = selectedTax !== "Select" ? parseInt(selectedTax, 10) : 0;
//        chargePercentage = parseFloat(chargePercentage) || 0.00;

//        // Only push values where selectedTax > 0
//        if (selectedTax > 0) {
//            itemChargeData.push({
//                ChargeTypeId: chargeId,
//                ChargeId: selectedTax,
//                TaxPer: chargePercentage
//            });
//        }
//    });

//    console.log("Collected Charge Data:", itemChargeData);
//    $('#taxmapping').modal('hide');
//}

function SaveItemMasterChargeData() {
    let tempChargeData = []; //  Declare as local
    itemChargeData = [];

    let igstPercentage = 0;
    let cgstPercentage = 0;
    let sgstPercentage = 0;

    let selectedTaxNames = [];
    let taxError = false;
    let errorMessage = "";

    // Step 1: Collect and evaluate values
    $("#edittablecc tr").each(function () {
        let chargeId = $(this).data("chargeid");
        let charge = $(this).find(".charge-type").text();
        let selectedTaxId = $(this).find(".tax-dropdown").val();
        let selectedTax = $(this).find(".tax-dropdown option:selected").text();
        let chargePercentage = parseFloat($(this).find(".charge-percentage").val()) || 0.00;

        // Collect IGST/CGST/SGST percentages
        if (charge === "IGST") {
            igstPercentage = chargePercentage;
        } else if (charge === "CGST") {
            cgstPercentage = chargePercentage;
        } else if (charge === "SGST") {
            sgstPercentage = chargePercentage;
        }

        // Save this row's data temporarily
        tempChargeData.push({
            ChargeTypeId: chargeId,
            Charge: charge,
            ChargeId: selectedTaxId === "Select" ? "0" : selectedTaxId,
            TaxPer: chargePercentage,
            TaxName: selectedTax === "Select" ? "" : selectedTax // Sanitize
        });
    });

    // Step 2: Validate tax logic
    if (igstPercentage <= 0 && cgstPercentage <= 0 && sgstPercentage <= 0) {
        taxError = true;
        errorMessage = "Please select at least one charge type.";
    } else if (igstPercentage > 0 && (cgstPercentage <= 0 || sgstPercentage <= 0)) {
        taxError = true;
        errorMessage = "Please fill CGST and SGST when IGST is selected.";
    } else if (igstPercentage <= 0 && (cgstPercentage > 0 || sgstPercentage > 0)) {
        taxError = true;
        errorMessage = "If CGST or SGST is filled, IGST should be selected.";
    } else if (cgstPercentage + sgstPercentage !== igstPercentage) {
        taxError = true;
        errorMessage = "IGST must equal CGST + SGST.";
    }

    // Step 3: Show error if any
    if (taxError) {
        $("#error-message").show();
        $("#error-text").text(errorMessage);
        return;
    }



    // Step 4: If no error, push only valid charge rows
    tempChargeData.forEach(row => {
        if (row.ChargeId > 0 && row.TaxPer > 0) {
            itemChargeData.push({
                ChargeTypeId: row.ChargeTypeId,
                Charge: row.Charge,
                ChargeId: row.ChargeId,
                TaxPer: row.TaxPer
            });

            selectedTaxNames.push(row.TaxName);

        }
    });

    //console.log("temp data :", tempChargeData);
    //console.log("Selected tax : ", selectedTaxNames);
    //console.log("Selected per:", itemChargeData);

    // Step 5: Final UI updates
    $('#itemCharges').text(selectedTaxNames.join(", "));
    $("#error-message").hide();
    $('#taxmapping').modal('hide');
    sessionStorage.setItem("chargeData", JSON.stringify(itemChargeData));
}

//#endregion

//////  numeric-decimal-restrict   /////////

document.addEventListener("input", function (event) {
    if (event.target.classList.contains("numeric-decimal-restrict")) {
        let value = event.target.value;

        // Allow only numbers and one dot (.)
        value = value.replace(/[^0-9.]/g, '');

        // Prevent multiple dots
        let dotCount = (value.match(/\./g) || []).length;
        if (dotCount > 1) {
            value = value.substring(0, value.lastIndexOf(".")); // Remove extra dots
        }

        // Ensure proper splitting at decimal
        let parts = value.split('.');

        // Restrict before decimal to 6 digits
        if (parts[0].length > 6) {
            parts[0] = parts[0].substring(0, 6);
        }

        // Restrict after decimal to 4 digits
        if (parts[1] && parts[1].length > 4) {
            parts[1] = parts[1].substring(0, 4);
        }

        // Join and update value
        event.target.value = parts.join('.');
    }
});

//////  End   /////////

// Function to toggle button visibility based on Item Status as Active=Shown button Else Hide
function toggleButtonVisibility() {
    var itemMasterId = parseInt($("#hdnItemMasterId").val());
    if (itemMasterId > 0) {
        const saveButton = document.getElementById('btnSave');
        const isActive = document.getElementById('active').checked;

        if (isActive) {
            saveButton.style.display = 'block';
        }
        //else {
        //    saveButton.style.display = 'none';
        //}
    }
}

// Add event listener for both radio buttons
const radios = document.querySelectorAll('input[name="status"]');
radios.forEach(radio => {
    radio.addEventListener('change', toggleButtonVisibility);
});

function DownloadInPDF() {
    var element = document.getElementById('divItemMaster');
    const opt = {
        margin: 0.5,
        filename: 'Purchase_Order.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 3,               // 🔥 Increases resolution
            useCORS: true,          // In case there are external images
            scrollY: 0
        },
        jsPDF: { unit: 'in', format: 'a3', orientation: 'landscape' } // 🔥 Use A3 or Landscape for wide tables
    };
    html2pdf().set(opt).from(element).save();
    return false;
}

//document.querySelectorAll('input[name="qcapplicable"]').forEach(function (radio) {
//    radio.addEventListener('click', function () {
//        // ✅ Add your logic here
//        // Example:
//        if (this.value === "Yes") {
//            // Do something when 'Yes' is clicked
//            document.getElementById('divUserType').style.display = 'none';
//            document.getElementById('divQCTestMapping').style.display = 'block';
//        } else {
//            // Do something else when 'No' is clicked
//            document.getElementById('divUserType').style.display = 'none';
//            document.getElementById('divQCTestMapping').style.display = 'none';
//        }
//    });
//});

function setQCApplicable() {
    var qcType = $('input[name="qcapplicable"]:checked').val();

    if (qcType === "Yes") {
        // Do something when 'Yes' is clicked
        document.getElementById('divUserType').style.display = 'none';
        document.getElementById('divQCTestMapping').style.display = 'block';

        document.getElementById("qcno").disabled = true;
    } else {
        // Do something else when 'No' is clicked
        document.getElementById('divUserType').style.display = 'none';
        document.getElementById('divQCTestMapping').style.display = 'none';

        document.getElementById("qcyes").disabled = true;
    }
}

function ShowQCMapping() {
    if ($('#ddlCategory').val() != "Select") {
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
                //document.getElementById('isMandatory').checked = false;
                //document.getElementById('divMicrobiologyTests').style.display = 'none';
            }
        });

        $("#qctestmapping").modal('show');
    }
    else {
        FailToaster('Please select catagory.');
    }
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
        var colNameAddRow = "";
        if (index + 1 == 1) {
            colNameAddRow = $('<td class="text-center">' +
                '<div class="cursor-pointer"><img  onclick="BindHTMLTableQualityParameters();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
                '</td>');
        }
        else {
            colNameAddRow = $('<td class="text-center">' +
                '<div class="cursor-pointer"><img style="width: 15px;" class="btnDelete" onclick="DeleteRowQualityParameters();" src="../../assets/images/icons/help/close.svg" class="w-15" alt=""></div>' +
                '</td>');
        }

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
            '<input type="hidden" id="hddTestNameId' + (index + 1) + '"  />' +
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
        var colNameAddRow = "";
        if (index + 1 == 1) {
            colNameAddRow = $('<td class="text-center">' +
                '<div class="cursor-pointer"><img onclick="BindHTMLTableMicrobiologyTests();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
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
        '<input type="number" id="txtApprovedMin' + (rowCount + 1) + '" placeholder="MIN" class="form-control" onchange="HideErrorMessage(this)" />' +
        '<span id="sptxtApprovedMin' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="number" id="txtApprovedMax' + (rowCount + 1) + '" placeholder="MAX" class="form-control" onchange="HideErrorMessage(this)" />' +
        '<span id="sptxtApprovedMax' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtText' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtText' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="number" id="txtNumber' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtNumber' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="hidden" id="hddCategory' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSample' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProduction' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiological' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCID' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddTestNameId' + (rowCount + 1) + '"  />' +
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
        '<input type="number" id="txtApprovedMin' + (rowCount + 1) + '" placeholder="MIN" class="form-control" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtApprovedMin' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="number" id="txtApprovedMax' + (rowCount + 1) + '" placeholder="MAX" class="form-control" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtApprovedMax' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtText' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtText' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="number" id="txtNumber' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtNumber' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="hidden" id="hddCategory' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSample' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProduction' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiological' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCID' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddTestNameId' + (rowCount + 1) + '"  />' +
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
    var selectedTestNameName = 0;
    var selectedCode = $('#ddlTestNameList' + (rowId)).find(':selected').data('code');
    testNameId = $('#ddlTestNameList' + (rowId)).val();
    selectedTestNameName = $('#ddlTestNameList' + (rowId)).find("option:selected").text();
    var isDuplicate = isDuplicateTestName(testNameId, rowId);
    if (isDuplicate == true) {
        FailToaster('Duplicate test Name is not allow! -: ' + selectedTestNameName);
        $('#ddlTestNameList' + (rowId)).val('');
        return false;
    }
    // Get row with ID = 8
    var result = testNameArray.find(x => x.ID === parseInt(testNameId));
    $('#hddCategory' + (rowId)).val(result.Category);
    $('#hddIsSample' + (rowId)).val(result.isSample);
    $('#hddIsProduction' + (rowId)).val(result.isProduction);
    $('#hddIsInvard' + (rowId)).val(result.isInvard);
    $('#hddIsOutWard' + (rowId)).val(result.isOutWard);
    $('#hddIsMicrobiological' + (rowId)).val(result.isMicrobiological);
    $('#hddQCID' + (rowId)).val(0);
    $('#hddTestNameId' + (rowId)).val(result.ID);

    if (selectedCode == 1) {
        $('#txtNumber' + rowId + '').val(result.Numeric_Value);

        $('#txtNumber' + rowId + '').show();
        $('#txtText' + rowId + '').hide();
        $('#divRange' + rowId + '').hide();
        document.getElementById('spResultType' + rowId + '').innerText = 'Numeric';
        document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Numeric_Value;

        $('#txtNumber' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory ');
        $('#txtText' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMin' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMax' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');

    }
    if (selectedCode == 2) {
        $('#txtNumber' + rowId + '').hide();
        $('#txtText' + rowId + '').show();
        $('#divRange' + rowId + '').hide();

        $('#txtText' + rowId + '').val(result.Text_Value);
        document.getElementById('spResultType' + rowId + '').innerText = 'Text';
        document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Text_Value;

        $('#txtNumber' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtText' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory');
        $('#txtApprovedMin' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMax' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
    }
    if (selectedCode == 3) {
        $('#txtNumber' + rowId + '').hide();
        $('#txtText' + rowId + '').hide();
        $('#divRange' + rowId + '').show();

        $('#txtApprovedMin' + rowId + '').val(result.Range_Min);
        $('#txtApprovedMax' + rowId + '').val(result.Range_Max);
        document.getElementById('spResultType' + rowId + '').innerText = 'Range';
        document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Range_Min + '-' + result.Range_Max;

        $('#txtNumber' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtText' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMin' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory');
        $('#txtApprovedMax' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory');
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
        '<input type="number" id="txtApprovedMinMT' + (rowCount + 1) + '"  placeholder="MIN" class="form-control" onchange="HideErrorMessage(this)"/>' +
        '<span id="sptxtApprovedMinMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span > ' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="number" id="txtApprovedMaxMT' + (rowCount + 1) + '" placeholder="MAX" class="form-control" onchange="HideErrorMessage(this)" />' +
        '<span id="sptxtApprovedMaxMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span > ' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtTextMT' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtTextMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="number" id="txtNumberMT' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtNumberMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="hidden" id="hddCategoryMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSampleMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProductionMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiologicalMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCIDMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddTestNameIdMT' + (rowCount + 1) + '"  />' +
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
        '<input type="number" id="txtApprovedMinMT' + (rowCount + 1) + '" placeholder="MIN" class="form-control" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtApprovedMinMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="number" id="txtApprovedMaxMT' + (rowCount + 1) + '" placeholder="MAX" class="form-control" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtApprovedMaxMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtTextMT' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtTextMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="number" id="txtNumberMT' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtNumberMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="hidden" id="hddCategoryMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSampleMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProductionMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiologicalMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCIDMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddTestNameIdMT' + (rowCount + 1) + '"  />' +
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
    var selectedTestNameName = $('#ddlTestNameListMT' + (rowId)).find("option:selected").text();
    var isDuplicate = isDuplicateTestNameMicrobiological(testNameId, rowId);
    if (isDuplicate == true) {
        FailToaster('Duplicate test name is not allow! -: ' + selectedTestNameName);
        $('#ddlTestNameListMT' + (rowId)).val('');
        return false;
    }
    // Get row with ID = 8
    var result = testNameArray.find(x => x.ID === parseInt(testNameId));
    $('#hddCategoryMT' + (rowId)).val(result.Category);
    $('#hddIsSampleMT' + (rowId)).val(result.isSample);
    $('#hddIsProductionMT' + (rowId)).val(result.isProduction);
    $('#hddIsInvardMT' + (rowId)).val(result.isInvard);
    $('#hddIsOutWardMT' + (rowId)).val(result.isOutWard);
    $('#hddIsMicrobiologicalMT' + (rowId)).val(result.isMicrobiological);
    $('#hddQCIDMT' + (rowId)).val(0);
    $('#hddTestNameIdMT' + (rowId)).val(result.ID);

    if (selectedCode == 1) {
        $('#txtNumberMT' + rowId + '').val(result.Numeric_Value);

        $('#txtNumberMT' + rowId + '').show();
        $('#txtTextMT' + rowId + '').hide();
        $('#divRangeMT' + rowId + '').hide();
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Numeric';
        document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Numeric_Value;
        $('#txtNumberMT' + rowId + '').addClass('form-control QCTestMandatory');

        $('#txtNumberMT' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory ');
        $('#txtTextMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMinMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMaxMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
    }
    if (selectedCode == 2) {
        $('#txtNumberMT' + rowId + '').hide();
        $('#txtTextMT' + rowId + '').show();
        $('#divRangeMT' + rowId + '').hide();

        $('#txtTextMT' + rowId + '').val(result.Text_Value);
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Text';
        document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Text_Value;

        $('#txtNumberMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtTextMT' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory');
        $('#txtApprovedMinMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMaxMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
    }
    if (selectedCode == 3) {
        $('#txtNumberMT' + rowId + '').hide();
        $('#txtTextMT' + rowId + '').hide();
        $('#divRangeMT' + rowId + '').show();

        $('#txtApprovedMinMT' + rowId + '').val(result.Range_Min);
        $('#txtApprovedMaxMT' + rowId + '').val(result.Range_Max);
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Range';
        document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Range_Min + '-' + result.Range_Max;

        $('#txtNumberMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtTextMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMinMT' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory');
        $('#txtApprovedMaxMT' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory');
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
        if (ParameterNameID != '') {
            QCTestMappingData.push(rowData);
        }
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
            if (ParameterNameID != '') {
                QCTestMappingData.push(rowData);
            }
        });
    }
    // Now QCTestMappingData is an array of objects containing all rows' data
    return QCTestMappingData;
}
//function SaveQCCheck() {
//    if (checkValidationOnSubmit('QCTestMandatory') == true) {
//        collectTableData();
//        $("#qctestmapping").modal('hide');
//    }
//}

function SaveQCCheck() {
    var rowCount = $('#tblQCTestMapping tbody tr').length;

    if (rowCount > 0) {
        var allRowsValid = true;

        $('#tblQCTestMapping tbody tr').each(function () {
            var selectedValue = $(this).find('select').val();

            if (!selectedValue || selectedValue === "0" || selectedValue.trim() === "") {
                allRowsValid = false;
                return false; // stop loop early if one invalid row is found
            }
        });

        if (allRowsValid) {
            if (checkValidationOnSubmit('QCTestMandatory') === true) {
                collectTableData();
                $("#qctestmapping").modal('hide');
            }
        } else {
            FailToaster("Please select a test name value in all QC records.");
            $("#qctestmapping").modal('show');
        }
    } else {
        FailToaster("Please fill in at least one QC record.");
        $("#qctestmapping").modal('show');
    }
}

function isDuplicateTestNameMicrobiological(testNameId, rowId) {
    var isDuplicate = false;

    $("#tblMicrobiologyTests tbody tr").each(function (index) {
        if ($("#tblMicrobiologyTests tbody tr").length > 1) {
            var ParameterNameID = $(this).find('#hddTestNameIdMT' + (index + 1) + '').val();

            if (ParameterNameID === testNameId) {
                isDuplicate = true;
                return false; // exit loop early
            }
        }
    });
    return isDuplicate;
}
function isDuplicateTestName(testNameId, rowId) {
    var isDuplicate = false;

    $("#tblQCTestMapping tbody tr").each(function (index) {
        if ($("#tblQCTestMapping tbody tr").length > 1) {
            var ParameterNameID = $(this).find('#hddTestNameId' + (index + 1) + '').val();

            if (ParameterNameID === testNameId) {
                isDuplicate = true;
                return false; // exit loop early
            }
        }
    });

    return isDuplicate;
}



