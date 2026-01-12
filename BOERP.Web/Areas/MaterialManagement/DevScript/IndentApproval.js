
$(document).ready(function () {
    LoadMasterDropdown('ddlStatus', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 3,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);
    //BindStatus();
    LoadMasterDropdown('ddlSent', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 5,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);

    // Debounced filter input
    $("#txtDocNumber").on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#IndentTable")) {
            indentTable.ajax.reload();
        }
    }, 500));
   // BindData();
});
function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}
var indentTable;
function OnchangeStatus(ctrlId)
{
    BindData(ctrlId);
}
function BindData(ctrlId) {
   
    // Check if DataTable is already initialized, then destroy it
    if ($.fn.DataTable.isDataTable("#IndentTable")) {
        $("#IndentTable").DataTable().destroy();
    }


    indentTable = $('#IndentTable').DataTable({
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

            var st = 0;
            if (ctrlId == undefined)
            {
                st = 2;
                $("#ddlStatus").val(2);
            }
            else {
                st = $("#ddlStatus").val() == 'All' ? '0' : $("#ddlStatus").val();
            }
            var requestData = {
                start: data.start,      // Offset (where to start)
                length: data.length,    // Number of records per page
                search: data.search.value, // Search term (if any)
                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
                screenId: 'Indent_102',//Need to change the screen id as per your data
                //modelData: jsonString
                modelData: JSON.stringify({
                    Status: st,
                    Type: "",
                    DocNumber: $("#txtDocNumber").val()
                })
            };

            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
                if (response && response.data) {
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
            //{ "data": "Srno" },
            { "data": "DocNo",  "orderable": true, },
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
      
            { "data": "Name" },
            { "data": "Department" },
            { "data": "Comment" },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {
                    var strReturn = "";
                    //Click to DeActivate                     
                    //Click to Activate                      
                    if (row.StatusId == 1)// Draft
                    {
                        strReturn = '<span class="align-self-center badge badge-warning  ">Pending</span> ';
                    }
                    else if (row.StatusId == 2) //Pending
                    {
                        strReturn = '<span class="align-self-center badge badge-warning  ">Pending</span> ';                       
                    }
                    else if (row.StatusId == 3) //Completed
                    {
                        strReturn = '<span class="align-self-center badge badge-success  ">Completed</span> ';
                    }  
                    else if (row.StatusId == 4) //Rejected
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

                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="IndentViewApproval?auth='+AuthToken+'&id=' + row.ID + '">View Details</a>' +                      
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

function BindStatus() {
    var tblSeries = [];
    var model =
    {
        ID: 0
    };
    const jsonString = JSON.stringify(model);
    const ddlStatus = document.getElementById('ddlStatus');
    const searchBox = document.getElementById('statusSearchBox');
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Status_100' }, 'GET', function (response) {
        tblSeries = response.data.data.Table;
        if (tblSeries.length > 0) {
            // Fill the dropdown
            ddlStatus.innerHTML = '';
            // 🔥 Add default option manually
            const defaultItem = document.createElement('li');
            defaultItem.className = 'dropdown-item';
            defaultItem.id = '0'; // You can use any default ID
            defaultItem.textContent = 'All'; // Default text
            defaultItem.onclick = () => {
                searchBox.value = defaultItem.textContent;
                OnchangeStatus('0');
                ddlStatus.style.display = 'none';
            };
            ddlStatus.appendChild(defaultItem);
            tblSeries.forEach(status => {
                const li = document.createElement('li');
                li.className = 'dropdown-item';
                li.id = status.ID;
                li.textContent = status.ValueName;
                li.onclick = () => {
                    // Set selected text in the search box
                    searchBox.value = status.ValueName;

                    // Optionally call your onchange function
                    OnchangeStatus(status.ID);

                    // Optionally hide dropdown after selection
                    ddlStatus.style.display = 'none';
                };
                ddlStatus.appendChild(li);
            });
        }
    });

    

   

    // Show dropdown when textbox is focused
    searchBox.addEventListener('focus', () => {
        ddlStatus.style.display = 'block';
    });

    // Optional: hide dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown-wrapper')) {
            ddlStatus.style.display = 'none';
        }
    });

}

//AGgried Data

function bindIndentApprovalGridFilter() {

    let filterData = tableData;

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    if (Status != '0') {

        filterData = filterData.filter(row => row.StatusId == Status);
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindIndentApprovalGrid();

    function bindIndentApprovalGrid() {
        $("#customLoader").show();

        //Replaceable content
        //Start
        var requestData = {
            start: 0,
            length: 20000000,
            search: '',
            orderColumn: null,
            orderDir: "asc",
            screenId: 'Indent_102',//Need to change the screen id as per your data
            //modelData: jsonString,
            modelData: JSON.stringify({
                Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
                Type: "",
                DocNumber: $("#txtDocNumber").val()
            })
        };
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tableData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'IndentApprovalGried', columnMeta, tableData);
            $("#customLoader").hide();
        });
    }

});


//#endregion