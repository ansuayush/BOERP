
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
     
    LoadMasterDropdown('ddlStatus', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 19,
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

    //// Debounced filter input
    //$("#txtSuppName").on('input', debounce(function () {
    //    if ($.fn.DataTable.isDataTable("#tblPurchaseOrder")) {
    //        indentTable.ajax.reload();
    //    }
    //}, 500));
    //$("#txtDocNumber").on('input', debounce(function () {
    //    if ($.fn.DataTable.isDataTable("#tblPurchaseOrder")) {
    //        indentTable.ajax.reload();
    //    }
    //}, 500));
   //  BindData();
});

//function debounce(func, wait) {
//    let timeout;
//    return function () {
//        clearTimeout(timeout);
//        timeout = setTimeout(() => func.apply(this, arguments), wait);
//    };
//}
//var indentTable;

//function OnchageBindGrid() {
//    BindData();
//}



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
            screenId: 'MaterialPageLoad_105',//Need to change the screen id as per your data
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
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tableData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'DebitNoteReport', columnMeta, tableData);
            $("#customLoader").hide();
        });
    }

});



function BindData() {
     
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
                screenId: 'MaterialPageLoad_105',//Need to change the screen id as per your data
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
            { "data": "Supplier", "orderable": false },           
            {
                "data": "DocNo",
                "orderable": false                 
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
            { "data": "ItemCount", "orderable": true },
            { "data": "USER_NAME", "orderable": true },             
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
                    else if (row.StatusId ==3) //Rejected
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
                    if (row.StatusId == 1)
                    {
                        isInactiveAction = '<input type="hidden" value="' + row.DocNo + '" id="hdnIndentDocNumber_' + row.ID + '" /><a class="dropdown-item" href="CreateDebitNote?auth=' + AuthToken +'&ids=0&id=' + row.ID + '">Edit</a> <a onclick=OpenIndentPopup(' + row.ID + ') class="dropdown-item" hrefdata-toggle="modal"data-target="#deletepopup">Delete</a>';
                    }
                    return '<div class="dropdown">'+
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">' +
                        '</span>' +
                    '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">' +
                        '<a class="dropdown-item" href="#">View Details</a>' +
                        isInactiveAction +                        
                        '<a class="dropdown-item" href="#">Print</a>' +
                        '</div>' +
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
        ActionType: 1
    }
    // Convert the model to JSON string
    const jsonString = JSON.stringify(indentModel);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "MaterialPageLoad_105",
        Operation: "D",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        BindData();
    });
}

function printDebitNote(POR_Id, DebitDocNo) {
    $.ajax({
        url: '/Material/PrintDebitNote?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { POR_Id: POR_Id, DebitDocNo: DebitDocNo },
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
            let filename = "Debit_Note.pdf";
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