$(document).ready(function () {

    LoadMasterDropdown('ddlStatus', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 2,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);

    var PAId = $('#hdnPAId').val();
    var rptType = $("#hdnRecordType").val();
    if (PAId > 0 && rptType!=='') {
        if (rptType == "Vendor Item List") {
            GetVendorItemList(PAId);
        }
        else if (rptType == "Vendor PO List") {
            GetVendorPOList(PAId);
        }
        else if (rptType == "Vendor GRN List") {
            GetVendorGRNList(PAId);
        }
        else {
            GetVendorFinLedgersList(PAId);
        }

    }

    // Debounced filter input
    $('#txtItemCode').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblVendorItemList")) {
            itemTable.ajax.reload();
        }
    }, 500));
    $('#txtItemName').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblVendorItemList")) {
            itemTable.ajax.reload();
        }
    }, 500));

    $('#CategoryName').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblVendorItemList")) {
            itemTable.ajax.reload();
        }
    }, 500));

    $('#txtVoucherNo').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblVendorFinLedgerList")) {
            itemTable.ajax.reload();
        }
    }, 500));
   
    //#endregion

    const vendorName = sessionStorage.getItem("VendorName");
    $("#vendorName").text(vendorName || "Vendor");

});
let isGridInitialized = false;

var itemTable;
function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

function GetVendorItemList(PAId) {

    //if ($.fn.DataTable.isDataTable("#tblVendorItemList")) {
    //    itemTable.ajax.reload();
    //    return;
    //}

    //itemTable = $('#tblVendorItemList').DataTable({
    //    scrollY: "400px",             // Vertical scroll
    //    scrollX: true,                // Horizontal scroll to fix header/column alignment
    //    scrollCollapse: true,
    //    fixedHeader: true,
    //    autoWidth: false,
    //    "processing": true,
    //    "serverSide": true,
    //    "paging": true,
    //    "pagingType": "full_numbers",
    //    "pageLength": 10,
    //    "lengthMenu": [10, 20, 30, 40, 50],
    //    "ordering": true,
    //    "info": true,
    //    "autoWidth": false,
    //    "responsive": true,
    //    "dom": '<"top">rt<"bottom"lip><"clear">',
    //    "language": {
    //        "paginate": {
    //            "first": "<img src='../../assets/images/icons/help/double-left.png' alt=''>",
    //            "previous": "<img src='../../assets/images/icons/help/arrow-left.png' alt=''>",
    //            "next": "<img src='../../assets/images/icons/help/arrow-right.png' alt=''>",
    //            "last": "<img src='../../assets/images/icons/help/double-right.png' alt=''>"
    //        }
    //    },
    //    "ajax": function (data, callback, settings) {
    //        var requestData = {
    //            start: data.start,
    //            length: data.length,
    //            search: data.search.value,
    //            orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
    //            orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
    //            screenId: 'ERPVendorRecordByType_101',
    //            modelData: JSON.stringify({
    //                PAId: PAId,
    //                ItemCode: $("#txtItemCode").val(),
    //                ItemName: $("#txtItemName").val(),
    //                ItemCategory: $("#txtItemCategory").val(),
    //                Type: 1

    //            })
    //        };

    //        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
    //            if (response && response.data) {
    //                callback({
    //                    draw: data.draw,
    //                    recordsTotal: response.data.TotalRecords,
    //                    recordsFiltered: response.data.FilteredRecords,
    //                    data: response.data.Records
    //                });
    //            }
    //        }, false);
    //    },

    //    "columns": [
    //        //{ "data": "Srno" },
    //        { "data": "ItemCode" },
    //        { "data": "ItemName" },
    //        { "data": "CategoryName" },
    //        { "data": "SubCategoryName" },
    //        { "data": "LastPurchasedDate" },
    //        { "data": "TotalQtyPurchased" },
    //        { "data": "LastPurchaseRate" },
    //        { "data": "PODeliveryDays" }

    //    ]
    //});

    $("#customLoader").show();

    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'ERPVendorRecordByType_101',
                    modelData: JSON.stringify({
                        PAId: PAId,
                        ItemCode: $("#txtItemCode").val(),
                        ItemName: $("#txtItemName").val(),
                        ItemCategory: $("#txtItemCategory").val(),
                        Type: 1

                    })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'Business_VendorItems', columnMeta, tableData);
        $("#customLoader").hide();
    });

}

function bindPOGridFilter() {

    let filterData = tableData;

 

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();


    
    if (Status != '0') {

        filterData = filterData.filter(row => row.StatusId == Status);

    }
  
    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}


var tableData = [];

function GetVendorPOList(PAId) {
    //if ($.fn.DataTable.isDataTable("#tblVendorPOList")) {
    //    itemTable.ajax.reload();
    //    return;
    //}

    //itemTable = $('#tblVendorPOList').DataTable({
    //    scrollY: "400px",             // Vertical scroll
    //    scrollX: true,                // Horizontal scroll to fix header/column alignment
    //    scrollCollapse: true,
    //    fixedHeader: true,
    //    autoWidth: false,
    //    "processing": true,
    //    "serverSide": true,
    //    "paging": true,
    //    "pagingType": "full_numbers",
    //    "pageLength": 10,
    //    "lengthMenu": [10, 20, 30, 40, 50],
    //    "ordering": true,
    //    "info": true,
    //    "autoWidth": false,
    //    "responsive": true,
    //    "dom": '<"top">rt<"bottom"lip><"clear">',
    //    "language": {
    //        "paginate": {
    //            "first": "<img src='../../assets/images/icons/help/double-left.png' alt=''>",
    //            "previous": "<img src='../../assets/images/icons/help/arrow-left.png' alt=''>",
    //            "next": "<img src='../../assets/images/icons/help/arrow-right.png' alt=''>",
    //            "last": "<img src='../../assets/images/icons/help/double-right.png' alt=''>"
    //        }
    //    },
    //    "ajax": function (data, callback, settings) {
    //        var requestData = {
    //            start: data.start,
    //            length: data.length,
    //            search: data.search.value,
    //            orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
    //            orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
    //            screenId: 'MaterialPurchase_102',
    //            modelData: JSON.stringify({
    //                Status: $("#ddlStatus").val() == 'All' ? '0' : $("#ddlStatus").val(),
    //                Type: "",
    //                DocNumber: $("#txtDocNumber").val(),
    //                Supplier: $("#txtSuppName").val(),
    //                /*SupplierId: $("#ddlSupplier").val() == 'All' ? '0' : $("#ddlSupplier").val(),*/
    //                SupplierId: PAId,
    //                CreaterId: 0

    //            })
    //        };

    //        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {

    //            console.log(response);
    //            if (response && response.data) {
    //                callback({
    //                    draw: data.draw,
    //                    recordsTotal: response.data.TotalRecords,
    //                    recordsFiltered: response.data.FilteredRecords,
    //                    data: response.data.Records
    //                });
    //            }
    //        }, false);
    //    },

    //    "columns": [
    //        //{ "data": "Srno" },
    //        {
    //            "data": "DocNo",
    //            "orderable": true,
    //            "render": function (data, type, row) {
    //                if (type === "display" || type === "filter") {
    //                    return '<span><a href="../../MaterialManagement/Material/ViewPurchaseDocument?auth=' + AuthToken + '&id=' + row.ID + '&Status=' + row.StatusId + '" data-toggle="tooltip" class="d-flex justify-content-between" title="" data-original-title="' + row.DocNo + '"><strong>' + row.DocNo + ' </strong> <span><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span></a></span>';
    //                }
    //                return data; // Ensure sorting works using raw data
    //            }
    //        },
    //        { "data": "Supplier", "orderable": true, },
    //        {
    //            "data": "DOCDate",
    //            "orderable": true,

    //        },
    //        { "data": "ItemCount", "orderable": false },
    //        {
    //            "orderable": false,
    //            data: null, render: function (data, type, row) {
    //                var strReturn = "";
    //                //Click to DeActivate
    //                //Click to Activate
    //                //if (row.StatusId == 1)// Draft
    //                //{
    //                //    strReturn = '<span class="align-self-center badge badge-warning  ">Pending</span> ';
    //                //}
    //                if (row.StatusId == 1) //Pending
    //                {
    //                    strReturn = '<span class="align-self-center badge badge-warning  ">Pending</span> ';
    //                }
    //                else if (row.StatusId == 2) //Completed
    //                {
    //                    strReturn = '<span class="align-self-center badge badge-success  ">Completed</span> ';
    //                }
    //                else if (row.StatusId == 3) //Rejected
    //                {
    //                    strReturn = '<span class="align-self-center badge badge-danger  ">Rejected</span> ';
    //                }

    //                return strReturn;
    //            }
    //        },
    //        {
    //            "orderable": false,
    //            "data": null,
    //            "render": function (data, type, row) {
    //                var isInactiveAction = "";
    //                //if (row.StatusId == 1) {
    //                //    isInactiveAction = '<input type="hidden" value="' + row.DocNo + '" id="hdnIndentDocNumber_' + row.ID + '" /><a class="dropdown-item" href="CreatePurchaseOrder?auth=' + AuthToken + '&id=' + row.ID + '&suppId=' + row.PA_ID + '">Edit</a> <a onclick=OpenIndentPopup(' + row.ID + ') class="dropdown-item" hrefdata-toggle="modal"data-target="#deletepopup">Delete</a>';
    //                //}
    //                return '<div class="dropdown">' +
    //                    '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
    //                    '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
    //                    '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="../../MaterialManagement/Material/ViewPurchaseOrder?auth=' + AuthToken + '&id=' + row.ID + '&suppId=' + row.PA_ID + '">View Details</a>' +
    //                    isInactiveAction + /*' <a  class="dropdown-item"  aclass="dropdown-item" href="DuplicatePurchaseOrder?auth=' + AuthToken +'&id=' + row.ID + '&suppId=' + row.PA_ID + '">Duplicate</a>' +*/
    //                    '</div>';


    //            }
    //        }
    //    ]
    //});

    //// Dropdown positioning logic
    //$(document).on('shown.bs.dropdown', '.dataTable .dropdown', function () {
    //    var $menu = $(this).find('.dropdown-menu');
    //    var $dropdown = $(this);
    //    var tableOffset = $dropdown.closest('table').offset();
    //    var dropdownOffset = $dropdown.offset();
    //    var scale = window.devicePixelRatio || 1;

    //    var newTop = (dropdownOffset.top - tableOffset.top + $dropdown.height()) / scale;
    //    var newLeft = (dropdownOffset.left - tableOffset.left) / scale;

    //    $('body').append($menu.detach());
    //    $menu.css({
    //        top: newTop + 'px',
    //        left: newLeft + 'px',
    //        position: 'absolute',
    //        zIndex: '1050',
    //        transform: 'translate(0, 10px)',
    //        minWidth: '200px'
    //    }).show();
    //});

    //$(document).on('hide.bs.dropdown', '.dataTable .dropdown', function () {
    //    var $menu = $(this).find('.dropdown-menu');
    //    $(this).append($menu.detach());
    //    $menu.hide();
    //});
    $("#customLoader").show();
    $('#myGrid').html('');
    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'MaterialPurchase_102',
                    modelData: JSON.stringify({
                        Status: $("#ddlStatus").val() == 'All' ? '0' : $("#ddlStatus").val(),
                        Type: "",
                        DocNumber: $("#txtDocNumber").val(),
                        Supplier: $("#txtSuppName").val(),
                        /*SupplierId: $("#ddlSupplier").val() == 'All' ? '0' : $("#ddlSupplier").val(),*/
                        SupplierId: PAId,
                        CreaterId: 0

                    })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'BusinessPartner_PoGrid', columnMeta, tableData);
        $("#customLoader").hide();
    });


}

function bindItemMasterGridFilter() {

    let filterData = tableData;

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    if (Status != '0') {

        filterData = tableData.filter(row => row.StatusId == Status);

    }

    if (filterData.length > 0) {

        gridOptions.api.setRowData(filterData);

    } else {

        if (globalGridOptions != null)
            gridOptions.api.setRowData([]);

    }

}

function GetVendorGRNList(PAId) {
    //if ($.fn.DataTable.isDataTable("#tblVendorGRNList")) {
    //    itemTable.ajax.reload();
    //    return;
    //}

    //itemTable = $('#tblVendorGRNList').DataTable({
    //    scrollY: "400px",             // Vertical scroll
    //    scrollX: true,                // Horizontal scroll to fix header/column alignment
    //    scrollCollapse: true,
    //    fixedHeader: true,
    //    autoWidth: false,
    //    "processing": true,
    //    "serverSide": true,
    //    "paging": true,
    //    "pagingType": "full_numbers",
    //    "pageLength": 10,
    //    "lengthMenu": [10, 20, 30, 40, 50],
    //    "ordering": true,
    //    "info": true,
    //    "autoWidth": false,
    //    "responsive": true,
    //    "dom": '<"top">rt<"bottom"lip><"clear">',
    //    "language": {
    //        "paginate": {
    //            "first": "<img src='../../assets/images/icons/help/double-left.png' alt=''>",
    //            "previous": "<img src='../../assets/images/icons/help/arrow-left.png' alt=''>",
    //            "next": "<img src='../../assets/images/icons/help/arrow-right.png' alt=''>",
    //            "last": "<img src='../../assets/images/icons/help/double-right.png' alt=''>"
    //        }
    //    },
    //    "ajax": function (data, callback, settings) {
    //        var requestData = {
    //            start: data.start,
    //            length: data.length,
    //            search: data.search.value,
    //            orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
    //            orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
    //            screenId: 'GRNEntry_103',
    //            modelData: JSON.stringify({
    //                Status: $("#ddlStatus").val() == 'All' ? '0' : $("#ddlStatus").val(),
    //                Type: "",
    //                DocNumber: $("#txtDocNumber").val(),
    //                Supplier: $("#txtSuppName").val(),
    //                DllSupplier: PAId,
    //                CreaterId: 0

    //            })
    //        };

    //        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
    //            if (response && response.data) {
    //                callback({
    //                    draw: data.draw,
    //                    recordsTotal: response.data.TotalRecords,
    //                    recordsFiltered: response.data.FilteredRecords,
    //                    data: response.data.Records
    //                });
    //            }
    //        }, false);
    //    },

    //    "columns": [
    //        //{ "data": "Srno" },
    //        {
    //            "data": "DocNo",
    //            "orderable": true,
    //            "render": function (data, type, row) {
    //                if (type === "display" || type === "filter") {
    //                    return '<span><a href="../../MaterialManagement/Material/ViewGrn?auth=' + AuthToken + '&id=' + row.ID + '&IsGRNView=1" data-toggle="tooltip" class="d-flex justify-content-between" title="" data-original-title="' + row.DocNo + '"><strong>' + row.DocNo + ' </strong> <span><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span></a></span>';
    //                }
    //                return data; // Ensure sorting works using raw data
    //            }
    //        },
    //        { "data": "PONo", "orderable": false },
    //        {
    //            "data": "DOCDate",
    //            "orderable": true,
    //            "render": function (data, type, row) {
    //                if (type === "display" || type === "filter") {
    //                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(data) + "</label>";
    //                }
    //                return data; // Ensure sorting works using raw data
    //            }
    //        },

    //        { "data": "AuditTrail", "orderable": false },

    //        {
    //            "orderable": false,
    //            data: null, render: function (data, type, row) {
    //                var strReturn = "";
    //                //Click to DeActivate
    //                //Click to Activate
    //                //if (row.StatusId == 1)// Draft
    //                //{
    //                //    strReturn = '<span class="align-self-center badge badge-warning  ">Pending</span> ';
    //                //}
    //                if (row.StatusId == 1) //Pending
    //                {
    //                    strReturn = '<span class="align-self-center badge badge-warning">Pending</span> ';
    //                }
    //                else if (row.StatusId == 2) //Completed
    //                {
    //                    strReturn = '<span class="align-self-center badge badge-success">Completed</span> ';
    //                }
    //                else if (row.StatusId == 3) //Rejected
    //                {
    //                    strReturn = '<span class="align-self-center badge badge-danger">Rejected</span> ';
    //                }

    //                return strReturn;
    //            }
    //        },
    //        {
    //            "orderable": false,
    //            "data": null,
    //            "render": function (data, type, row) {
    //                var isInactiveAction = "";
    //                //if (row.StatusId == 1) {
    //                //    isInactiveAction = '<input type="hidden" value="' + row.DocNo + '" id="hdnIndentDocNumber_' + row.ID + '" /><a class="dropdown-item" href="CreateGrn?auth=' + AuthToken + '&id=' + row.ID + '&suppId=' + row.PA_ID + '">Edit</a>';
    //                //}
    //                return '<div class="dropdown">' +
    //                    '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
    //                    '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
    //                    '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="../../MaterialManagement/Material/ViewGrn?auth=' + AuthToken + '&id=' + row.ID + '">View Details</a>' +
    //                    isInactiveAction +
    //                    '</div>';


    //            }
    //        }
    //    ]
    //});

    //// Dropdown positioning logic
    //$(document).on('shown.bs.dropdown', '.dataTable .dropdown', function () {
    //    var $menu = $(this).find('.dropdown-menu');
    //    var $dropdown = $(this);
    //    var tableOffset = $dropdown.closest('table').offset();
    //    var dropdownOffset = $dropdown.offset();
    //    var scale = window.devicePixelRatio || 1;

    //    var newTop = (dropdownOffset.top - tableOffset.top + $dropdown.height()) / scale;
    //    var newLeft = (dropdownOffset.left - tableOffset.left) / scale;

    //    $('body').append($menu.detach());
    //    $menu.css({
    //        top: newTop + 'px',
    //        left: newLeft + 'px',
    //        position: 'absolute',
    //        zIndex: '1050',
    //        transform: 'translate(0, 10px)',
    //        minWidth: '200px'
    //    }).show();
    //});

    //$(document).on('hide.bs.dropdown', '.dataTable .dropdown', function () {
    //    var $menu = $(this).find('.dropdown-menu');
    //    $(this).append($menu.detach());
    //    $menu.hide();
    //});

    $("#customLoader").show();
    $('#myGrid').html('');
    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'GRNEntry_103',
                    modelData: JSON.stringify({
                        Status: $("#ddlStatus").val() == 'All' ? '0' : $("#ddlStatus").val(),
                        Type: "",
                        DocNumber: $("#txtDocNumber").val(),
                        Supplier: $("#txtSuppName").val(),
                        DllSupplier: PAId,
                        CreaterId: 0

                    })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'BusinessPartner_GRNGrid', columnMeta, tableData);
        $("#customLoader").hide();
    });

}


function GetVendorFinLedgersList(PAId) {

   // if ($.fn.DataTable.isDataTable("#tblVendorFinLedgerList")) {
    //    itemTable.ajax.reload();
    //    return;
    //}

    //itemTable = $('#tblVendorFinLedgerList').DataTable({
    //    scrollY: "400px",             // Vertical scroll
    //    scrollX: true,                // Horizontal scroll to fix header/column alignment
    //    scrollCollapse: true,
    //    fixedHeader: true,
    //    autoWidth: false,
    //    "processing": true,
    //    "serverSide": true,
    //    "paging": true,
    //    "pagingType": "full_numbers",
    //    "pageLength": 10,
    //    "lengthMenu": [10, 20, 30, 40, 50],
    //    "ordering": true,
    //    "info": true,
    //    "autoWidth": false,
    //    "responsive": true,
    //    "dom": '<"top">rt<"bottom"lip><"clear">',
    //    "language": {
    //        "paginate": {
    //            "first": "<img src='../../assets/images/icons/help/double-left.png' alt=''>",
    //            "previous": "<img src='../../assets/images/icons/help/arrow-left.png' alt=''>",
    //            "next": "<img src='../../assets/images/icons/help/arrow-right.png' alt=''>",
    //            "last": "<img src='../../assets/images/icons/help/double-right.png' alt=''>"
    //        }
    //    },
    //    "createdRow": function (row, data, dataIndex) {
    //        if (data.Narration === "Opening Balance" || data.Narration === "Total/Closing Balance") {
    //            $(row).css({
    //                "font-weight": "bold",
    //                "background-color": "#f0f0f0"
    //            });
    //        }
    //    },
    //    "ajax": function (data, callback, settings) {
    //        var requestData = {
    //            start: data.start,
    //            length: data.length,
    //            search: data.search.value,
    //            orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
    //            orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
    //            screenId: 'ERPVendorRecordByType_101',
    //            modelData: JSON.stringify({
    //                PAId: PAId,
    //                FinId: FinYearId,
    //                VoucherNo: $("#txtVoucherNo").val(),
    //                Type: 2

    //            })
    //        };

    //        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
    //            if (response && response.data) {
    //                callback({
    //                    draw: data.draw,
    //                    recordsTotal: response.data.TotalRecords,
    //                    recordsFiltered: response.data.FilteredRecords,
    //                    data: response.data.Records
    //                });
    //            }
    //        }, false);
    //    },

    //    "columns": [
    //        /*{ "data": "Srno" },*/
    //        { "data": "LedgerDate" },
    //        { "data": "Narration" },
    //        { "data": "DocumentNumber" },
    //        { "data": "Debit", "className": "text-right", "render": $.fn.dataTable.render.number(',', '.', 2) },
    //        { "data": "Credit", "className": "text-right", "render": $.fn.dataTable.render.number(',', '.', 2) },
    //        { "data": "RunningBalance" }

    //    ]
    //});


    $("#customLoader").show();
    $('#myGrid').html('');
    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'ERPVendorRecordByType_101',
                    modelData: JSON.stringify({
                        PAId: PAId,
                        FinId: FinYearId,
                        VoucherNo: $("#txtVoucherNo").val(),
                        Type: 2

                    })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'FinancialLedger', columnMeta, tableData);
        $("#customLoader").hide();
    });


}
