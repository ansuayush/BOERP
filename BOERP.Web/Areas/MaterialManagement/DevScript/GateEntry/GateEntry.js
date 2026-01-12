$(document).ready(function () {
    // Debounced filter input
    $("#txtDocNumber").on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblGateEntry")) {
            indentTable.ajax.reload();
        }
    }, 500));

    GateEntryBindData();
});

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

var indentTable;

//#region : Gate Entry Gried Data
function GateEntryBindData() {
    var model =
    {
        Status: "",
        Type: "",
        DocNumber: ''
    };

    const jsonString = JSON.stringify(model);

    // Check if DataTable is already initialized, then destroy it
    if ($.fn.DataTable.isDataTable("#tblGateEntry")) {
        $("#tblGateEntry").DataTable().destroy();
    }

    indentTable = $('#tblGateEntry').DataTable({
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
        "order": [], // disables default initial sort
        "dom": '<"top">rt<"bottom"lip><"clear">',
        "language": {
            "paginate": {
                "first": "<img src='../../assets/images/icons/help/double-left.png' alt=''>",
                "previous": "<img src='../../assets/images/icons/help/arrow-left.png' alt=''>",
                "next": "<img src='../../assets/images/icons/help/arrow-right.png' alt=''>",
                "last": "<img src='../../assets/images/icons/help/double-right.png' alt=''>"
            }
        },
        columnDefs: [
            { targets: "_all", orderable: false }, // Disables ordering for all columns
        ],
        "ajax": function (data, callback, settings) {
            var requestData = {
                start: data.start,      // Offset (where to start)
                length: data.length,    // Number of records per page
                search: data.search.value, // Search term (if any)
                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
                screenId: 'GateEntry_101',//Need to change the screen id as per your data
                //modelData: jsonString
                modelData: JSON.stringify({
                    Status: "",
                    Type: "",
                    DocNumber: $("#txtDocNumber").val()
                })
            };

            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
                if (response && response.data) {
                    console.log(response);
                   // debugger
                    callback({
                        draw: data.draw,
                        recordsTotal: response.data.TotalRecords,   // Total records in DB
                        recordsFiltered: response.data.FilteredRecords, // Filtered count
                        data: response.data.Records // Actual page data


                    });
                   // console.log(data);
                }
            }, false);
        },       
        "columns": [
            //{ "data": "Srno" },
            //{ "data": "DocumentNo" },
            {
                "data": "DocumentNo",
                "render": function (data, type, row) {
                    return '<a href="/MaterialManagement/Material/EditGateEntry?auth=' + AuthToken + '&itemId=' + row.ID + '&viewGateEntry=1" class="d-flex justify-content-between link-grid">' +
                        '<strong class="link-grid-ellipsis ellipsis">' + row.DocumentNo + '</strong>' +
                        '<span class="link-icon"><img src="../../assets/images/icons/help/edit.png" class="icon-xsm" alt="Edit"></span>' +
                        '</a>';
                }
            },
            { "data": "DocumentDate" },
            { "data": "GateNumber" },
            { "data": "InvoiceNumber", "orderable": false, },
            {
                "data": "InvoiceDate",
                "orderable": false,
                "render": function (data, type, row) {
                    if (type === "display" || type === "filter") {
                        return "<label>" + ChangeDateFormatToddMMYYYWithSlace(data) + "</label>";
                    }
                    return data; // Ensure sorting works using raw data
                }
            },
            { "data": "MaterialCategoryName" },          
             {
                 "data": "ClientMaterial",
                "orderable": false,
                "render": function (data, type, row) {
                    if (data === true) {
                        return "<label>Yes</label>";
                    }
                    else {
                        return "<label>No</label>";
                    }
                    return data; // Ensure sorting works using raw data
                }
            },

            { "data": "BusinessPartner" },

            {
                "data": "action",
                "orderable": false,
                "render": function (data, type, row) {

                    var edit = "Edit"

                    var grn = "";

                    if (row.ViewGateEntry == 1) {
                        edit = "View"
                    }

                    if (row.ClientMaterialStatus == 'No' && row.ViewGateEntry != 1) {
                        grn = '<a class="dropdown-item" href="CreateGrn?auth=' + AuthToken + '&id=0&suppId=' + row.Supp_Id + '&GateEntryId=' + row.ID + '&PageType=GateEntryList">Create GRN</a>';
                    }


                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton_${row.ID}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                    '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">' +
                    '</span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton_${row.ID}">' +
                        grn +
                        '<a class="dropdown-item" href="/MaterialManagement/Material/EditGateEntry?auth=' + AuthToken + '&itemId=' + row.ID + '&viewGateEntry=' + row.ViewGateEntry + '">' + edit + '</a>' +
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

////AGgried Data

//let tableData = []; // Load via API as you already do
//document.addEventListener("DOMContentLoaded", function () {
//    tableData = [];
//    bindGateEntryGrid();

//    function bindGateEntryGrid() {
//        $("#customLoader").show();

//        //Replaceable content
//        //Start
//        var requestData = {
//            start: 0,
//            length: 20000000,
//            search: '',
//            orderColumn: null,
//            orderDir: "asc",
//            screenId: 'GateEntry_101',//Need to change the screen id as per your data
//           // modelData: jsonString,
//            modelData: JSON.stringify({
//                Status: "",
//                Type: "",
//                DocNumber: $("#txtDocNumber").val()
//            })
//        };
//      //  End

//        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
//            console.log(response);
//            tableData = response.data.Records;
//            var columnMeta = response.data.ColumnData;
//            gridOptions = bindAgGrid("#myGrid", 'GateEntryGried', columnMeta, tableData);
//            $("#customLoader").hide();
//        });
//    }

//});

////#endregion
