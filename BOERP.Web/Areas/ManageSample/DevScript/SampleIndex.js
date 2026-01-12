
$(document).ready(function () {

    var obj1 = {
        parentId: login_ID,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 5,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlCustomer', obj1, 'All', false);

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 93,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlBrandType', obj2, 'All', false);

    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
        
    LoadMasterDropdown('ddlSampleType', obj3, 'All', false);

    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 4,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlOrderSize', obj4, 'All', false);

    var obj5 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 12,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlSalesPerson', obj5, 'All', false);

    var obj6 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlsamplecate', obj6, 'Select', false);

    //$('#ddlCustomer, #ddlSampleType, #ddlOrderSize, #ddlBrandType, #ddlStatus, #ddlSalesPerson').on('change', function() {
    //    BindData();
    //})

    //BindData();

    $('#txtSampleId').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#sampleTable")) {
            indentTable.ajax.reload();
        }
    }, 500));

    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    var year = today.getFullYear();
    var formattedDate = day + '/' + month + '/' + year;

    // Set it to the input
    $('#txtSampleCreateDate').val(formattedDate);

});

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

var indentTable;


function getSampleIdForPrint() {

    if (type == "new") {
        if (checkValidationOnSubmit('Mandatory')) {
            var model =
            {
                Id: $('#ddlsamplecate').val(),
                Type: 7,
                SampleDate: ChangeDateFormatSecond($('#txtSampleCreateDate').val())
            };


            const jsonString = JSON.stringify(model);
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Sample_101' }, 'GET', function (response) {


                console.log(response)

                if (response.data.data.Table.length > 0) {

                    var len = response.data.data.Table.length;

                    $('#printsample').modal('hide');

                    for (var i = 0; i < len; i++) {
                        const sampleId = response.data.data.Table[i].Sample_Id;
                        const eRPSampleDetUniqId = response.data.data.Table[i].SampleDetUniqId;
                        printSampleOrder(sampleId, eRPSampleDetUniqId)
                    }

                }
                else {
                    FailToaster('No Sample was created on this date and of this category!!');
                }

            });


        }
    }
    else if (type == "adv") {

        if (checkValidationOnSubmit('Mandate')) {
            var checked = document.querySelector('.advtype:checked');
            if (checked) {
                var id = checked.id;


                var model =
                {
                    Id: 1,
                    Type: 8,
                    FromDate: ChangeDateFormatSecond($('#txtFromDate').val()),
                    ToDate: ChangeDateFormatSecond($('#txtToDate').val()),
                    SampleType: id

                };


                const jsonString = JSON.stringify(model);
                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Sample_101' }, 'GET', function (response) {


                    console.log(response)

                    if (response.data.data.Table.length > 0) {

                        var len = response.data.data.Table.length;

                        $('#printsample').modal('hide');

                        for (var i = 0; i < len; i++) {
                            const sampleId = response.data.data.Table[i].Sample_Id;
                            const eRPSampleDetUniqId = response.data.data.Table[i].SampleDetUniqId;
                            printSampleOrder(sampleId, eRPSampleDetUniqId)
                        }

                    }
                    else {
                        FailToaster('No Sample was created on this date and of this category!!');
                    }

                });


                
            }
            else {
                FailToaster("Please select atleast one category!!");
            }

        }
        
    }
    else {
        FailToaster("type variable not found!!");
    }
}


function CreateItem(Id) {

    var data = tableData.find(input => input.Id == Id);

    console.log(data);

    localStorage.setItem("Item", data.Item_Name);

    localStorage.setItem("sample_id", data.Id);

    window.location.href = `/MaterialManagement/Material/ItemMaster?auth=${AuthToken}&itemId=0&IsSample=2`;

}

function printSampleOrder(SampleId, SampleDetUniqId) {
    $.ajax({
        url: '/ManageSample/PrintSample?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { SampleId: SampleId, SampleDetUniqId: SampleDetUniqId },
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
            let filename = "Sample_Report.pdf";
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

//function BindData() {

//    if ($.fn.DataTable.isDataTable("#sampleTable")) {
//        indentTable.ajax.reload();
//        return;
//    }

//    indentTable = $('#sampleTable').DataTable({
//        scrollY: "600px",             // Vertical scroll
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
//                screenId: 'Sample_102',
//                modelData: JSON.stringify({
//                    Company: $('#ddlCustomer').val() == 'All' ? 0 : $('#ddlCustomer').val(),
//                    SalesPerson: 0,
//                    BrandType: $('#ddlBrandType').val() == 'All' ? 0 : $('#ddlBrandType').val(),
//                    Status: $('#ddlStatus').val() == 'All' ? 0 : $('#ddlStatus').val(),
//                    Category: $('#ddlSampleType').val() == 'All' ? 0 : $('#ddlSampleType').val(),
//                    OrderSize: $('#ddlOrderSize').val() == 'All' ? 0 : $('#ddlOrderSize').val(),
//                    FeedBack: 0,
//                    Type: 0,
//                    SampleID: $('#txtSampleId').val(),
//                    CreatedBy: $('#ddlSalesPerson').val() == 'All' ? 0 : $('#ddlSalesPerson').val()
//                })
//            };

//            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
//                if (response && response.data) {

//                    console.log(response);

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
//            //{ "data": "Srno" },
//            { "data": "DocNo", "orderable": false },
           
//            { "data": "Client" },
//            { "data": "BrandName" },
//            { "data": "OrderSize" },
//            {
//                "data": null,
//                "orderable": false,
//                "render": function (data, type, row) {

//                   return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.createdat) + "</label>";

//                }
//            },
//            { "data": "SalesPerson" }, 
//            { "data": "Orderr" },
//            { "data": "SampleType" },
//            { "data": "FeedBackStatus" },
//            {
//                "orderable": false,
//                "data": null,
//                "render": function (data, type, row) {
//                    var isInactiveAction = "";
//                    var viewDetails = "";
                        
//                    if (row.IsEdit == 1) {
//                        isInactiveAction = '<a class="dropdown-item" href="AddSample?auth=' + AuthToken + '&id=' + row.Id + '">Edit</a>';
//                    }

//                    viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.Id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

//                    cancelDetails = `<a class="dropdown-item" href="#" onclick="showTaskDeleteModal(${row.Id}, '${row.DocNo}')" >Cancel</a>`;

//                    var print_sample_order = `<a  class="dropdown-item" href="#" onclick="printSampleOrder(${row.ERP_Sample_Id})"  aclass="dropdown-item" href="#">Print Using Cryatal Report</a>`
                    
                   
//                    return '<div class="dropdown td-defualt-center">' +
//                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
//                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
//                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="ViewSampleDetails?auth=' + AuthToken + '&id=' + row.Id + '&Status=' + row.IsEdit + '">View Details</a>' +
//                        isInactiveAction + viewDetails + cancelDetails + print_sample_order +'</div>' +
//                        '</div>';


//                }
//            }
//        ]
//    });

//    $('[data-toggle="tooltip"]').tooltip();

//    // Re-initialize tooltips every time the table is redrawn
//    indentTable.on('draw.dt', function () {
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

//function BindDeletedData() {

//    if ($.fn.DataTable.isDataTable("#sampleTable")) {
//        indentTable.ajax.reload();
//        return;
//    }

//    indentTable = $('#sampleTable').DataTable({
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
//                screenId: 'Sample_102',
//                modelData: JSON.stringify({
//                    Company: $('#ddlCustomer').val() == 'All' ? 0 : $('#ddlCustomer').val(),
//                    SalesPerson: 0,
//                    BrandType: $('#ddlBrandType').val() == 'All' ? 0 : $('#ddlBrandType').val(),
//                    Status: $('#ddlStatus').val() == 'All' ? 0 : $('#ddlStatus').val(),
//                    Category: $('#ddlSampleType').val() == 'All' ? 0 : $('#ddlSampleType').val(),
//                    OrderSize: $('#ddlOrderSize').val() == 'All' ? 0 : $('#ddlOrderSize').val(),
//                    FeedBack: 0,
//                    Type: 2
//                })
//            };

//            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
//                if (response && response.data) {

//                    console.log(response);

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
//            { "data": "Srno" },
//            { "data": "DocNo", "orderable": false },

//            { "data": "Client" },
//            { "data": "BrandName" },
//            { "data": "OrderSize" },
//            {
//                "data": null,
//                "orderable": false,
//                "render": function (data, type, row) {

//                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.createdat) + "</label>";

//                }
//            },
//            { "data": "SalesPerson" },
//            { "data": "Orderr" },
//            { "data": "SampleType" },
//            { "data": "FeedBackStatus" },
//            {
//                "orderable": false,
//                "data": null,
//                "render": function (data, type, row) {
//                    var isInactiveAction = "";
//                    var viewDetails = "";

//                    if (row.IsEdit == 1) {
//                        isInactiveAction = '<a class="dropdown-item" href="AddSample?auth=' + AuthToken + '&id=' + row.Id + '">Edit</a>';
//                    }

//                    viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.Id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

//                    cancelDetails = `<a class="dropdown-item" href="#" onclick="showTaskDeleteModal(${row.Id}, '${row.DocNo}')" >Cancel</a>`;


//                    return '<div class="dropdown td-defualt-center">' +
//                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
//                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
//                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="ViewSampleDetails?auth=' + AuthToken + '&id=' + row.Id + '&Status=' + row.Status + '">View Details</a>' +
//                        isInactiveAction + viewDetails + cancelDetails + '</div>' +
//                        '</div>';


//                }
//            }
//        ]
//    });

//    $('[data-toggle="tooltip"]').tooltip();

//    // Re-initialize tooltips every time the table is redrawn
//    indentTable.on('draw.dt', function () {
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

let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindItemMasterGrid();

    

});

function bindItemMasterGrid() {

    $('#myGrid').html('');
//    $("#customLoader").show();

    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'Sample_102',
        modelData: JSON.stringify({
            Company: $('#ddlCustomer').val() == 'All' ? 0 : $('#ddlCustomer').val(),
            SalesPerson: 0,
            BrandType: $('#ddlBrandType').val() == 'All' ? 0 : $('#ddlBrandType').val(),
            Status: $('#ddlStatus').val() == 'All' ? 0 : $('#ddlStatus').val(),
            Category: $('#ddlSampleType').val() == 'All' ? 0 : $('#ddlSampleType').val(),
            OrderSize: $('#ddlOrderSize').val() == 'All' ? 0 : $('#ddlOrderSize').val(),
            FeedBack: 0,
            Type: 0,
            SampleID: $('#txtSampleId').val(),
            CreatedBy: $('#ddlSalesPerson').val() == 'All' ? 0 : $('#ddlSalesPerson').val()
        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'SampleIndex', columnMeta, tableData);
    //    $("#customLoader").hide();
    });
}



function showTaskModal(id, authToken, fmsid) {
    $.get('/Account/GetTaskStatusModal', { id: id, auth: authToken, FMS_Id: fmsid }, function (data) {
        $('#yourModalContainer').html(data);
        $('#viewstatus').modal('show');
    });
}



var deleteId = 0;


function showTaskDeleteModal(id, name) {
    deleteId = id;

    $('#sample_name').html(name);
    $('#sample_name1').html(name);

    $('#deletepopup').modal('show');
}


function DeleteSampleDet() {

    var model = {
        ERP_Sample_Id: deleteId,
        Type: 2
    }

    var jsonstring = JSON.stringify(model);

    let GenericModeldata = {
        ScreenID: "Sample_101",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonstring
    };


    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            // BindData();
            bindItemMasterGrid();

            $('#deletepopup').modal('hide');
        }

    });
}