
$(document).ready(function () {

    LoadMasterDropdown('ddlSupplier', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);

    LoadMasterDropdown('ddlSupp', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);

    LoadMasterDropdown('ddlStatus', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 2,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);

    LoadMasterDropdown('ddlCreator', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 4,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);

    // Debounced filter input
    $("#txtSuppName").on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblPurchaseOrder")) {
            indentTable.ajax.reload();
        }
    }, 500));
    $("#txtDocNumber").on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblPurchaseOrder")) {
            indentTable.ajax.reload();
        }
    }, 500));
    BindData();
});

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}
var indentTable;

function OnchageBindGrid() {
    BindData();
}
function printPurchaseOrder(POId, PONo) {
    $.ajax({
        url: '/Material/PrintPO?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { POId: POId, PONo: PONo },
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
            let filename = "Purchase_Order.pdf";
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

function PurchaseOrderPrint(ctrl) {
    var url = "../../MaterialManagement/Material/PurchaseOrderPrint?auth=" + AuthToken +"&id=" + ctrl;
    window.location.href = url;
}

function RedirectToPurchaseOrder(ctr) {

    var url = "../../MaterialManagement/Material/CreatePurchaseOrder?auth=" + AuthToken +"&id=0&suppId=" + ctr.value;
    window.location.href = url;


}

function OpenIndentPopup(docN) {
    $('#hdnIndentId').val(docN);
    var dNumber = $('#hdnIndentDocNumber_' + docN).val();
    $('#spIndentDocNumber').text(dNumber);
    $('#btnInactivePopup').trigger('click');
}

function InactiveAction() {
    var indentModel =
    {
        ERPIndentID: $('#hdnIndentId').val(),
        Remark: '',
        IsApproved: 0,
        ActionType: 1,
        ModuleId:1
    }
    // Convert the model to JSON string
    const jsonString = JSON.stringify(indentModel);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "MaterialPurchase_101",
        Operation: "D",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        BindData();
    });
}

//#region : Purchase Order Index Gried Data

function BindData() {
    var model =
    {
        Status: $("#ddlStatus").val() == 'All' ? '0' : $("#ddlStatus").val(),
        Type: "",
        DocNumber: $("#txtDocNumber").val(),
        Supplier: $("#txtSuppName").val(),
        SupplierId: $("#ddlSupplier").val() == 'All' ? '0' : $("#ddlSupplier").val(),
        CreaterId: $("#ddlCreator").val() == 'All' ? '0' : $("#ddlCreator").val(),
    };

    const jsonString = JSON.stringify(model);

    // Check if DataTable is already initialized, then destroy it
    if ($.fn.DataTable.isDataTable("#tblPurchaseOrder")) {
        $("#tblPurchaseOrder").DataTable().destroy();
    }


    indentTable = $('#tblPurchaseOrder').DataTable({
        scrollY: "400px",             // Vertical scroll
        scrollX: true,                // Horizontal scroll to fix header/column alignment
        scrollCollapse: true,
        fixedHeader: true,
        autoWidth: false,
        "processing": true,
        "serverSide": true,
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
                screenId: 'MaterialPurchase_102',//Need to change the screen id as per your data
                //modelData: jsonString
                modelData: JSON.stringify({
                    Status: $("#ddlStatus").val() == 'All' ? '0' : $("#ddlStatus").val(),
                    Type: "",
                    DocNumber: $("#txtDocNumber").val(),
                    Supplier: $("#txtSuppName").val(),
                    SupplierId: $("#ddlSupplier").val() == 'All' ? '0' : $("#ddlSupplier").val(),
                    CreaterId: $("#ddlCreator").val() == 'All' ? '0' : $("#ddlCreator").val(),
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
            //{"data": "Srno"},
            { "data": "Supplier", "orderable": true, },
            {
                "data": "DocNo",
                "orderable": true,
                "render": function (data, type, row) {
                    if (type === "display" || type === "filter") {
                        return '<span><a href="ViewPurchaseDocument?auth=' + AuthToken + '&id=' + row.ID + '&Status=' + row.StatusId + '" data-toggle="tooltip" class="d-flex justify-content-between" title="" data-original-title="' + row.DocNo + '"><strong>' + row.DocNo + ' </strong> <span><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span></a></span>';
                    }
                    return data; // Ensure sorting works using raw data
                }
            },
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

            { "data": "ItemCount", "orderable": false },
            { "data": "USER_NAME", "orderable": true },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {
                    const maxLength = 200; // Change this value to adjust the visible length
                    const fullText = row.Comments || '';
                    const truncatedText = fullText.length > maxLength ? fullText.substring(0, maxLength) + '...' : fullText;

                    return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + fullText + "' title=''>" + truncatedText + "</p>";
                }
            },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {
                    var strReturn = "";
                    //Click to DeActivate                     
                    //Click to Activate                      
                    //if (row.StatusId == 1)// Draft
                    //{
                    //    strReturn = '<span class="align-self-center badge badge-warning  ">Pending</span> ';
                    //}
                    if (row.StatusId == 1) //Pending
                    {
                        strReturn = '<span class="align-self-center badge badge-warning  ">Pending</span> ';
                    }
                    else if (row.StatusId == 2) //Completed
                    {
                        strReturn = '<span class="align-self-center badge badge-success  ">Completed</span> ';
                    }
                    else if (row.StatusId == 3) //Rejected
                    {
                        strReturn = '<span class="align-self-center badge badge-danger  ">Rejected</span> ';
                    }

                    return strReturn;
                }
            },
            {
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {
                    var isInactiveAction = "";
                    if (row.StatusId == 1) {
                        isInactiveAction = '<input type="hidden" value="' + row.DocNo + '" id="hdnIndentDocNumber_' + row.ID + '" /><a class="dropdown-item" href="CreatePurchaseOrder?auth=' + AuthToken + '&id=' + row.ID + '&suppId=' + row.PA_ID + '">Edit</a> <a onclick=OpenIndentPopup(' + row.ID + ') class="dropdown-item" hrefdata-toggle="modal"data-target="#deletepopup">Delete</a>';
                    }
                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="ViewPurchaseOrder?auth=' + AuthToken + '&id=' + row.ID + '&suppId=' + row.PA_ID + '">View Details</a>' +
                        isInactiveAction + /*' <a  class="dropdown-item"  aclass="dropdown-item" href="DuplicatePurchaseOrder?auth=' + AuthToken +'&id=' + row.ID + '&suppId=' + row.PA_ID + '">Duplicate</a>' +*/
                        ' <a  class="dropdown-item" href="../purchaseorder/index.html" aclass="dropdown-item" href="#">Share</a>' +
                        /* ' <a  class="dropdown-item" href="#" onclick="PurchaseOrderPrint(' + row.ID + ');"  aclass="dropdown-item" href="#">Print</a>' +*/
                        '<a  class="dropdown-item" href="#" onclick="printPurchaseOrder(' + row.ID + ');"  aclass="dropdown-item" href="#">Print Using Cryatal Report</a>' +
                        '</div>';


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

//AGgried Data

function bindPOGridFilter() {

    let filterData = tableData;

    var Supplier = $("#ddlSupplier").val() === 'All' ? '' : $("#ddlSupplier option:selected").html();

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    var Creator = $("#ddlCreator").val() === 'All' ? '' : $("#ddlCreator option:selected").html();

    if (Supplier != '') {
        filterData = filterData.filter(row => row.Supplier.toLowerCase() == Supplier.toLowerCase());
    }
    if (Status != '0') {

        filterData = filterData.filter(row => row.StatusId == Status);

    }
    if (Creator != '') {
        filterData = filterData.filter(row => row.USER_NAME.toLowerCase() == Creator.toLowerCase());
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
 
    bindPOIndexGrid();

    function bindPOIndexGrid() {
        $("#customLoader").show();

        //Replaceable content
        //Start
        var requestData = {
            start: 0,
            length: 100000,
            search: '',
            orderColumn: null,
            orderDir: "asc",
            screenId: 'MaterialPurchase_102',//Need to change the screen id as per your data
            //modelData: jsonString,
            modelData: JSON.stringify({
                Status: $("#ddlStatus").val() == 'All' ? '0' : $("#ddlStatus").val(),
                Type: "",
                DocNumber: $("#txtDocNumber").val(),
                Supplier: $("#txtSuppName").val(),
                SupplierId: $("#ddlSupplier").val() == 'All' ? '0' : $("#ddlSupplier").val(),
                CreaterId: $("#ddlCreator").val() == 'All' ? '0' : $("#ddlCreator").val()
            })
        };
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tableData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'POIndexGried', columnMeta, tableData);
            $("#customLoader").hide();
        });
    }

});

//#endregion

