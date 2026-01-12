$(document).ready(function () {

    $(function () {
        // Initialize datepicker for modal inputs
        $('.datepickerrrr').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "dd-mm-yy",
            yearRange: "-20:+10",
            onSelect: function () {
                // Show × icon when a date is selected
                $(this).closest('.input-group').find('.clear-date').show();
            },
            beforeShow: function (input, inst) {
                // Fix z-index issue inside Bootstrap modal
                setTimeout(function () {
                    $('.ui-datepicker').css('z-index', 99999);
                }, 0);
            }
        });

        // Use event delegation for modal (works for dynamically loaded modals)
        $(document).on('click', '.clear-date', function () {
            const $input = $(this).closest('.input-group').find('.datepickerrrr');
            $input.val('');              // Clear input
            $(this).hide();              // Hide × icon
        });

        // Hide × icon if manually cleared
        $(document).on('input', '.datepickerrrr', function () {
            if ($(this).val() === '') {
                $(this).closest('.input-group').find('.clear-date').hide();
            }
        });
    });


    

 

    var obj1 = {
        parentId: isCreater == 1 ? loginid : 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 90,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }


    var obj10 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Employee,
        manualTableId: ManaulTableEnum.Employee
    }

    LoadMasterDropdown('ddlDoerUser', obj1, 'Select', false);
    LoadMasterDropdownTMS('ddlDoer', obj10, 'All', false);

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 87,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlPCUser', obj2, 'Select', false);

    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 89,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlRaisedBy', obj3, 'All', false);


    //$('#ddlStatus').on('change', function () {
    //    if (isCreater == 1) {

    //        bindMyHelpTicketGrid();
    //    }
    //    else if (isCreater == -1) {
    //        bindPCGrid();
    //    }
    //    else {
    //        if (isTechnical == 0) {
    //            bindUserHelpTicketGrid();
    //        }
    //        else {
    //            bindTechnicalHelpTicketGrid()
    //        }
    //    }
    //})

    //if (isCreater == -1) {
    //    $('#ddlRaisedBy, #ddlDoer').on('change', function () {          
         
    //            bindPCGrid();
            
    //    })
    //}

    

    getAllCount();

    //$('#txtUniqId').on('input', debounce(function () {
    //    if ($.fn.DataTable.isDataTable("#helptecket")) {
    //        helpRaisedByMe.ajax.reload();
    //    }
    //}, 500));

});

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}


function getAllCount() {

    var model =
    {
        ID: 0,
        Type: 5
    };

    var jsonString = JSON.stringify(model);


    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'HelpTicket_101' }, 'GET', function (response) {


        console.log(response);

        var tblDoc = response.data.data.Table;

        if (tblDoc.length > 0) {

            if (isCreater == 1) {

                $('#TotalRaised').text(tblDoc[0].RBTotalCount)
                $('#totalResolved').text(tblDoc[0].RBTotalResolved)
                $('#totalUnResolved').text(tblDoc[0].RBTotalUnResolved)

            }
            else if (isCreater == 0) {
                if (tblDoc[0].IsTechnical == 1) {

                    $('#techResolved').text(tblDoc[0].UserTotalResolved)

                    $('#techUnresolved').text(tblDoc[0].UserTotalUnResolved)

                    $('#techCompleted').text(tblDoc[0].UserTotalCompleted)
                }
                else {
                    $('#userResolved').text(tblDoc[0].UserTotalResolved)
                    $('#userUnResolved').text(tblDoc[0].UserTotalUnResolved)

                    $('#totalCompleted').text(tblDoc[0].UserTotalCompleted)
                }


            }
        }



    });
}


var helpRaisedByMe;

function bindMyHelpTicketGrid() {

    if ($.fn.DataTable.isDataTable("#helptecket")) {
        helpRaisedByMe.ajax.reload();
        return;
    }

    helpRaisedByMe = $('#helptecket').DataTable({
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
                start: data.start,
                length: data.length,
                search: data.search.value,
                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
                screenId: 'HelpTicket_102',
                modelData: JSON.stringify({
                    Status: $('#ddlStatus').val() == 'All' ? 0 : $('#ddlStatus').val(),
                    Type: 1,
                    TicketId: $('#txtUniqId').val()

                })
            };

            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
                if (response && response.data) { 

                    console.log(response);

                    callback({
                        draw: data.draw,
                        recordsTotal: response.data.TotalRecords,
                        recordsFiltered: response.data.FilteredRecords,
                        data: response.data.Records
                    });
                }
            }, false);
        },

        "columns": [
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return '<a href="#" class="fn - bold" onclick="ViewHelpTicket(' + row.Id + ')">' + row.TicketId + '</a>';

                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.Createdat) + "</label>";

                }
            },
            {
                "orderable": true,
                data: null, render: function (data, type, row) {
                    const maxLength = 200; // Change this value to adjust the visible length
                    const fullText = row.ProblemDes || '';
                    const truncatedText = fullText.length > maxLength ? fullText.substring(0, maxLength) + '...' : fullText;

                    return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + fullText + "' title=''>" + truncatedText + "</p>";
                }
            },
            {
                "orderable": true,
                data: null, render: function (data, type, row) {
                    const maxLength = 200; // Change this value to adjust the visible length
                    const fullText = row.SuggestedSol || '';
                    const truncatedText = fullText.length > maxLength ? fullText.substring(0, maxLength) + '...' : fullText;

                    return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + fullText + "' title=''>" + truncatedText + "</p>";
                }
            },
            { "data": "Doer" },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {
                    if (row.Status === 3) return '<span class="align-self-center badge badge-success">Completed</span>';
                    if (row.Status === 2) return '<span class="align-self-center badge badge-resolved">Resolved</span>';
                    return '<span class="align-self-center badge badge-warning">Pending</span>';
                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.PlannedDate) + "</label>";

                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    if (row.CompletionDate) {
                        return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.CompletionDate) + "</label>";
                    }
                    else {
                        return "<label>-----</label>";
                    }

                }
            },
              {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return `<div class="dropdown">
        <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
            <img src="../assets/images/icons/help/more-icon.png" class="icon-md">
        </span>
        <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
            ${row.Status == 1 ? `<a class="dropdown-item" href = "#" onclick = "EditHelpTicket(${row.Id})">Edit</a>` : `<a class="dropdown-item" href = "#" onclick="ViewHelpTicket(${row.Id})">View Ticket</a>`}
        </div>
    </div>`;




                }
            }
            
            
        ]
    });

    $('[data-toggle="tooltip"]').tooltip();

    // Re-initialize tooltips every time the table is redrawn
    helpRaisedByMe.on('draw.dt', function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    TableSetup(helpRaisedByMe)
}


var Edit_ID = 0;
function EditHelpTicket(id) {

    Edit_ID = id;

    var model =
    {
        ID: id,
        Type: 2
    };

    var jsonString = JSON.stringify(model);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'HelpTicket_101' }, 'GET', function (response) {

        console.log(response);

        var data = response.data.data.Table;

        $('#txtTicketId').val(data[0].TicketId);
        $('#txtDocDate').val(ChangeDateFormatToddMMYYYWithSlace(data[0].createdat));
        $('#txtCreatedByName').val(data[0].CreatedBy);
        $('#txtPlannedDate').val(ChangeDateFormatToddMMYYY(data[0].PlannedDate));
        data[0].IsTechnicalHelp == 1 ? $('#technicalHelp').prop('checked', true).trigger('change') : $('#technicalHelp').prop('checked', false).trigger('change');
        $('#ddlDoerUser').val(data[0].DoerUserId).trigger('change');
        $('#ddlPCUser').val(data[0].PCUserId).trigger('change');    
        $('#txtProblemDes').val(data[0].ProblemDes);
        $('#txtSuggestedSol').val(data[0].SuggestedSol);
        $('#raiseticket').modal('show');
       // $('#txtDocDate').val(newDate);
    });
}


let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];

    if (isCreater == 1) {

        bindMyHelpTicketGrid();
        }
        else if (isCreater == -1) {
            bindPCGrid();
        }
        else {
            if (isTechnical == 0) {
                bindUserHelpTicketGrid();
            }
            else {
                bindTechnicalHelpTicketGrid();
            }
        }
   

});



function bindItemMasterGridFilter() {

    let filterData = tableData;

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    if (Status != '0') {

        filterData = tableData.filter(row => row.Status == Status);

    }

    if (filterData.length > 0) {

        gridOptions.api.setRowData(filterData);

    } else {

        if (globalGridOptions != null)
            gridOptions.api.setRowData([]);

    }

}

function bindMyHelpTicketGrid() {

    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'HelpTicket_102',
        modelData: JSON.stringify({
            Status:0,
            Type: 1,
            TicketId: ''

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'MyHelpTicket', columnMeta, tableData);
        $("#customLoader").hide();
    });
}


function bindUserHelpTicketGrid() {

    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'HelpTicket_102',
        modelData: JSON.stringify({
            Status: 0,
            Type: 2

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'UserHelpTicket', columnMeta, tableData);
        $("#customLoader").hide();
    });
}

function bindTechnicalHelpTicketGrid() {

    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'HelpTicket_102',
        modelData: JSON.stringify({
            Status: 0,
            Type: 4

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'TechnicalHelpTicket', columnMeta, tableData);
        $("#customLoader").hide();
    });
}

function bindPCGrid() {

    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'HelpTicket_102',
        modelData: JSON.stringify({
            Status: 0,
            RaisedBy: 0,
            Doer: 0, 
            Type: 3

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'PCTicket', columnMeta, tableData);
        $("#customLoader").hide();
    });
}


function bindPCGrirrred() {

    if ($.fn.DataTable.isDataTable("#ddlPCTable")) {
        helpTable.ajax.reload();
        return;
    }

    helpTable = $('#ddlPCTable').DataTable({
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
                start: data.start,
                length: data.length,
                search: data.search.value,
                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
                screenId: 'HelpTicket_102',
                modelData: JSON.stringify({
                    Status: 0,
                    RaisedBy:0, 
                    Doer:0, 
                    Type: 3

                })
            };

            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
                if (response && response.data) {

                    console.log(response);

                    callback({
                        draw: data.draw,
                        recordsTotal: response.data.TotalRecords,
                        recordsFiltered: response.data.FilteredRecords,
                        data: response.data.Records
                    });
                }
            }, false);
        },

        "columns": [
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return '<a href="#" class="fn - bold" onclick="ViewHelpPCTicket(' + row.Id + ')">' + row.TicketId + '</a>';

                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.Createdat) + "</label>";

                }
            },
            {
                "orderable": true,
                data: null, render: function (data, type, row) {
                    const maxLength = 200; // Change this value to adjust the visible length
                    const fullText = row.ProblemDes || '';
                    const truncatedText = fullText.length > maxLength ? fullText.substring(0, maxLength) + '...' : fullText;

                    return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + fullText + "' title=''>" + truncatedText + "</p>";
                }
            },
            {
                "orderable": true,
                data: null, render: function (data, type, row) {
                    const maxLength = 200; // Change this value to adjust the visible length
                    const fullText = row.SuggestedSol || '';
                    const truncatedText = fullText.length > maxLength ? fullText.substring(0, maxLength) + '...' : fullText;

                    return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + fullText + "' title=''>" + truncatedText + "</p>";
                }
            },
            { "data": "CreatedBy" },
            { "data": "Doer" },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.PlannedDate) + "</label>";

                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {
                    if (row.Status === 3) return '<span class="align-self-center badge badge-success">Completed</span>';
                    if (row.Status === 2) return '<span class="align-self-center badge badge-resolved ">Resolved</span>';
                    return '<span class="align-self-center badge badge-warning">Pending</span>';
                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    if (row.CompletionDate) {
                        return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.CompletionDate) + "</label>";
                    }
                    else {
                        return "<label>-----</label>";
                    }

                }
            },
            
             {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    if (row.Status == 3) {
                        return `<button class="btn actionbtn border-r-f" disabled>Closed</button>`;
                    }
                    else if (row.Status == 2) {
                        return `<button class="btn actionbtn border-r-f" onclick="ResolveHelpPCTicket(${row.Id})">Close</button>`;
                    }
                    else {
                        return `<label></label>`;
                    }

                   


                }
            }


        ]
    });

    $('[data-toggle="tooltip"]').tooltip();

    // Re-initialize tooltips every time the table is redrawn
    helpTable.on('draw.dt', function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    TableSetup(helpTable)
}





function bindUserHelpTickhfhetGrid() {

    if ($.fn.DataTable.isDataTable("#ticketsOnMe")) {
        helpTable.ajax.reload();
        return;
    }

    helpTable = $('#ticketsOnMe').DataTable({
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
                start: data.start,
                length: data.length,
                search: data.search.value,
                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
                screenId: 'HelpTicket_102',
                modelData: JSON.stringify({
                    Status: $('#ddlStatus').val() == 'All' ? 0 : $('#ddlStatus').val(),
                    Type: 2

                })
            };

            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
                if (response && response.data) {

                    console.log(response);

                    callback({
                        draw: data.draw,
                        recordsTotal: response.data.TotalRecords,
                        recordsFiltered: response.data.FilteredRecords,
                        data: response.data.Records
                    });
                }
            }, false);
        },

        "columns": [
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return '<a href="#" class="fn - bold" onclick="ViewResolvedTicket(' + row.Id + ')">' + row.TicketId + '</a>';

                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.Createdat) + "</label>";

                }
            },
            {
                "orderable": true,
                data: null, render: function (data, type, row) {
                    const maxLength = 200; // Change this value to adjust the visible length
                    const fullText = row.ProblemDes || '';
                    const truncatedText = fullText.length > maxLength ? fullText.substring(0, maxLength) + '...' : fullText;

                    return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + fullText + "' title=''>" + truncatedText + "</p>";
                }
            },
            {
                "orderable": true,
                data: null, render: function (data, type, row) {
                    const maxLength = 200; // Change this value to adjust the visible length
                    const fullText = row.SuggestedSol || '';
                    const truncatedText = fullText.length > maxLength ? fullText.substring(0, maxLength) + '...' : fullText;

                    return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + fullText + "' title=''>" + truncatedText + "</p>";
                }
            },
            { "data": "CreatedBy" },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.PlannedDate) + "</label>";

                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {
                    if (row.Status === 3) return '<span class="align-self-center badge badge-success">Completed</span>';
                    if (row.Status === 2) return '<span class="align-self-center badge badge-resolved ">Resolved</span>';
                    return '<span class="align-self-center badge badge-warning">Pending</span>';
                }
            },
           
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    if (row.CompletionDate) {
                        return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.CompletionDate) + "</label>";
                    }
                    else {
                        return "<label>-----</label>";
                    }

                }
            },

             {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                   
                    return `<div class="dropdown">
        <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
            <img src="../assets/images/icons/help/more-icon.png" class="icon-md">
        </span>
        <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
            ${row.Status == 1 ? `<a class="dropdown-item" href = "#" onclick = "ShowResolvedTicket(${row.Id})"> Resolve Ticket</a>` : `<a class="dropdown-item" href = "#" onclick = "ViewResolvedTicket(${row.Id})">View Resolved Ticket</a>`}
        </div>
    </div>`;
                    

                }
            }


        ]
    });

    $('[data-toggle="tooltip"]').tooltip();

    // Re-initialize tooltips every time the table is redrawn
    helpTable.on('draw.dt', function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    TableSetup(helpTable)
}


function bindTechnicalHelpTicketGridjjj() {

    if ($.fn.DataTable.isDataTable("#ticketsOnMeTechnical")) {
        helpTable.ajax.reload();
        return;
    }

    helpTable = $('#ticketsOnMeTechnical').DataTable({
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
                start: data.start,
                length: data.length,
                search: data.search.value,
                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
                screenId: 'HelpTicket_102',
                modelData: JSON.stringify({
                    Status: $('#ddlStatus').val() == 'All' ? 0 : $('#ddlStatus').val(),
                    Type: 4

                })
            };

            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
                if (response && response.data) {

                    console.log(response);

                    callback({
                        draw: data.draw,
                        recordsTotal: response.data.TotalRecords,
                        recordsFiltered: response.data.FilteredRecords,
                        data: response.data.Records
                    });
                }
            }, false);
        },

        "columns": [
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return '<a href="#" class="fn - bold" onclick="ViewResolvedTicket(' + row.Id + ')">' + row.TicketId + '</a>';

                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.Createdat) + "</label>";

                }
            },
            {
                "orderable": true,
                data: null, render: function (data, type, row) {
                    const maxLength = 200; // Change this value to adjust the visible length
                    const fullText = row.ProblemDes || '';
                    const truncatedText = fullText.length > maxLength ? fullText.substring(0, maxLength) + '...' : fullText;

                    return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + fullText + "' title=''>" + truncatedText + "</p>";
                }
            },
            {
                "orderable": true,
                data: null, render: function (data, type, row) {
                    const maxLength = 200; // Change this value to adjust the visible length
                    const fullText = row.SuggestedSol || '';
                    const truncatedText = fullText.length > maxLength ? fullText.substring(0, maxLength) + '...' : fullText;

                    return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + fullText + "' title=''>" + truncatedText + "</p>";
                }
            },
            { "data": "CreatedBy" },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.PlannedDate) + "</label>";

                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {
                    if (row.Status === 3) return '<span class="align-self-center badge badge-success">Completed</span>';
                    if (row.Status === 2) return '<span class="align-self-center badge badge-resolved ">Resolved</span>';
                    return '<span class="align-self-center badge badge-warning">Pending</span>';
                }
            },

            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    if (row.CompletionDate) {
                        return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.CompletionDate) + "</label>";
                    }
                    else {
                        return "<label>-----</label>";
                    }

                }
            },

            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {


                    return `<div class="dropdown">
        <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
            <img src="../assets/images/icons/help/more-icon.png" class="icon-md">
        </span>
        <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
            ${row.Status == 1 ? `<a class="dropdown-item" href = "#" onclick = "ShowResolvedTicket(${row.Id})"> Resolve Ticket</a>` : `<a class="dropdown-item" href = "#" onclick = "ViewResolvedTicket(${row.Id})">View Resolved Ticket</a>`}
        </div>
    </div>`;


                }
            }


        ]
    });

    $('[data-toggle="tooltip"]').tooltip();

    // Re-initialize tooltips every time the table is redrawn
    helpTable.on('draw.dt', function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    TableSetup(helpTable)
}



function GetHelpTicketDet() {
    if ($('#hdnHelpTicketId').val() == "0" || $('#hdnHelpTicketId').val() == "") {
        var model =
        {
            ID: 0,
           Type: 4
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'HelpTicket_101' }, 'GET', function (response) {

            var tblDocNo = response.data.data.Table;

            console.log(tblDocNo);

            $('#txtTicketId').val(tblDocNo[0].HelpTicketDocSeries);
            $('#txtCreatedByName').val(tblDocNo[0].full_name);

            var dt = new Date();
            var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
            $('#txtDocDate').val(newDate);
        });

    }
   

}

var reslovedTicketId = 0;

function ShowResolvedTicket(id) {

    reslovedTicketId = id;

    var model =
    {
        Type: 1,
        ID: id
    };
    const jsonString = JSON.stringify(model);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'HelpTicket_101' }, 'GET', function (response) {


        console.log(response);

        var helpdata = response.data.data.Table;

        if (helpdata.length > 0) {

            $('#lblTicketId').html(helpdata[0].TicketId);
            $('#lblCreatedat').html(ChangeDateFormatToddMMYYYWithSlace(helpdata[0].Createdat));
            $('#lblCreatedBy').html(helpdata[0].CreatedBy);
            $('#lblRaisedFor').html(helpdata[0].Doer);
            $('#lblPlannedDate').html(ChangeDateFormatToddMMYYYWithSlace(helpdata[0].PlannedDate));
            $('#lblPC').html(helpdata[0].PC);
            $('#lblProblemDesc').html(helpdata[0].ProblemDes);
            $('#suggestedSol').html(helpdata[0].SuggestedSol);
            $('#txtRemarks').show();
            $('#lblremarks').hide();

            $('#submitResolve').show()

            $('#resolveticket').modal('show');
        }



    });
}

function ViewHelpTicket(id) {

    var model =
    {  
        Type: 1,
        ID: id
    };
    const jsonString = JSON.stringify(model);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'HelpTicket_101' }, 'GET', function (response) {


        console.log(response);

        var helpdata = response.data.data.Table;

        if (helpdata.length > 0) {

            $('#lblTicketId').html(helpdata[0].TicketId);
            $('#lblCreatedat').html(ChangeDateFormatToddMMYYYWithSlace(helpdata[0].Createdat));
            $('#lblCreatedBy').html(helpdata[0].CreatedBy);
            $('#lblRaisedFor').html(helpdata[0].Doer);
            $('#lblPlannedDate').html(ChangeDateFormatToddMMYYYWithSlace(helpdata[0].PlannedDate));
            $('#lblPC').html(helpdata[0].PC);
            $('#lblProblemDesc').html(helpdata[0].ProblemDes);
            $('#suggestedSol').html(helpdata[0].SuggestedSol);
            $('#doerRemarks').html(helpdata[0].DoerRemarks);
            

            $('#viewresolveticket').modal('show');
        }


    });
}


function ViewHelpPCTicket(id) {

    var model =
    {
        Type: 1,
        ID: id
    };
    const jsonString = JSON.stringify(model);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'HelpTicket_101' }, 'GET', function (response) {


        console.log(response);

        var helpdata = response.data.data.Table;

        if (helpdata.length > 0) {

            $('#lblTicketId').html(helpdata[0].TicketId);
            $('#lblCreatedat').html(ChangeDateFormatToddMMYYYWithSlace(helpdata[0].Createdat));
            $('#lblCreatedBy').html(helpdata[0].CreatedBy);
            $('#lblRaisedFor').html(helpdata[0].Doer);
            $('#lblPlannedDate').html(ChangeDateFormatToddMMYYYWithSlace(helpdata[0].PlannedDate));
            $('#lblPC').html(helpdata[0].PC);
            $('#lblProblemDesc').html(helpdata[0].ProblemDes);
            $('#suggestedSol').html(helpdata[0].SuggestedSol);
            $('#doerRemarks').html(helpdata[0].DoerRemarks);
            $('#closureBtn').hide();

            $('#resolveticket').modal('show');
        }


    });
}


var pcTicketId = 0;
function ResolveHelpPCTicket(id) {

    pcTicketId = id;


    var model =
    {
        Type: 1,
        ID: id
    };
    const jsonString = JSON.stringify(model);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'HelpTicket_101' }, 'GET', function (response) {


        console.log(response);

        var helpdata = response.data.data.Table;

        if (helpdata.length > 0) {

            $('#lblTicketId').html(helpdata[0].TicketId);
            $('#lblCreatedat').html(ChangeDateFormatToddMMYYYWithSlace(helpdata[0].Createdat));
            $('#lblCreatedBy').html(helpdata[0].CreatedBy);
            $('#lblRaisedFor').html(helpdata[0].Doer);
            $('#lblPlannedDate').html(ChangeDateFormatToddMMYYYWithSlace(helpdata[0].PlannedDate));
            $('#lblPC').html(helpdata[0].PC);
            $('#lblProblemDesc').html(helpdata[0].ProblemDes);
            $('#suggestedSol').html(helpdata[0].SuggestedSol);
            $('#doerRemarks').html(helpdata[0].DoerRemarks);
            $('#closureBtn').show();

            $('#resolveticket').modal('show');
        }


    });
}



function ViewResolvedTicket(id) {

    var model =
    {
        Type: 1,
        ID: id
    };
    const jsonString = JSON.stringify(model);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'HelpTicket_101' }, 'GET', function (response) {


        console.log(response);

        var helpdata = response.data.data.Table;

        if (helpdata.length > 0) {

            $('#lblTicketId').html(helpdata[0].TicketId);
            $('#lblCreatedat').html(ChangeDateFormatToddMMYYYWithSlace(helpdata[0].Createdat));
            $('#lblCreatedBy').html(helpdata[0].CreatedBy);
            $('#lblRaisedFor').html(helpdata[0].Doer);
            $('#lblPlannedDate').html(ChangeDateFormatToddMMYYYWithSlace(helpdata[0].PlannedDate));
            $('#lblPC').html(helpdata[0].PC);
            $('#lblProblemDesc').html(helpdata[0].ProblemDes);
            $('#suggestedSol').html(helpdata[0].SuggestedSol);
            $('#doerRemarks').html(helpdata[0].DoerRemarks);

            $('#txtRemarks').hide();
            $('#lblremarks').show();
            $('#submitResolve').hide()

            $('#resolveticket').modal('show');
        }


    });
}

function ResolveTicketByUser() {
    //debugger;
    var id = reslovedTicketId;

    if (id > 0) {
        if (checkValidationOnSubmit('Mandatory') == true) {
            var model = {
                ID: id > 0 ? id : 0,
                Type: 2,
                Remarks: $('#addDoerRemarks').val()
            };
            // Convert the model to JSON string
            const jsonString = JSON.stringify(model);
            // Assign the final data for submission
            let GenericModeldata = {
                ScreenID: "HelpTicket_101",
                Operation: id > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
                ModelData: jsonString
            };
            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                if (response.ValidationInput == 1) {

                    $('#resolveticket').modal('hide');
                    ClearFormControl();
                    if (isTechnical == 0) {
                        bindUserHelpTicketGrid();
                    }
                    else {
                        bindTechnicalHelpTicketGrid();
                    }

                }
            });
        }
    }
    else {
        FailToaster('Cannot Find the Resolved Ticket ID');
    }
}

function SaveHelpTicket() {
    //debugger;
    var id = Edit_ID;




    if (checkValidationOnSubmit('Mandatory') == true) {
        var model = {
            ID: id > 0 ? id : 0,
            PlannedDate: ChangeDateFormat($("#txtPlannedDate").val()),
            DoerUserId: $("#ddlDoerUser").val() > 0 ? $("#ddlDoerUser").val() : 0,
            PCUserId: $("#ddlPCUser").val() > 0 ? $("#ddlPCUser").val() : 0,
            ProblemDes: $("#txtProblemDes").val(),
            SuggestedSol: $("#txtSuggestedSol").val(),
            Type: 1
        };
        // Convert the model to JSON string
        const jsonString = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "HelpTicket_101",
            Operation: id > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };

      //  Edit_ID = 0;
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                $('#raiseticket').modal('hide');
                ClearFormControl();
                bindMyHelpTicketGrid();

            }
        });
    }
}

function CloseHelpTicket() {
    //debugger;
    var id = parseInt($("#hdnHelpTicketId").val());
    if (checkValidationOnSubmit('Mandatory') == true) {
        var model = {
            ID: pcTicketId > 0 ? pcTicketId : 0,
            Type: 3
        };
        // Convert the model to JSON string
        const jsonString = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "HelpTicket_101",
            Operation: id > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                $('#resolveticket').modal('hide');
                ClearFormControl();
                bindPCGrid();

            }
        });
    }
}

function RedirectUrl() {
    var url = "/ManageHelpTicket/UserHelpTicket/?auth=" + AuthToken;
    window.location.href = url;
}


function ShowTechnicalHelpData() {

    if ($('#technicalHelp').prop('checked')) {

        var obj2 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 88,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }



        LoadMasterDropdown('ddlDoerUser', obj2, 'Select', false);

    }
   else {

        var obj1 = {
            ParentId: 0,
            masterTableType: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: ManaulTableEnum.Employee,
            manualTableId: ManaulTableEnum.Employee
        }

        LoadMasterDropdownTMS('ddlDoerUser', obj1, 'Select', false);

    }

}

function ClearFormControl() {
    $('#hdnHelpTicketId').val(0);
    $('#ddlDoerUser').val('Select').trigger('change');
    $('#ddlPCUser').val('Select').trigger('change');
    $('#txtProblemDes').val('');
    $('#txtSuggestedSol').val('');
    Edit_ID = 0;


    //var dropdown = document.getElementById('ddlDoerUser');

    //for (var i = 0; i < dropdown.options.length; i++) {
    //    if (dropdown.options[i].innerHTML == $('#txtCreatedByName').val()) {
    //        dropdown.remove(i);
    //        break; // exit loop once the match is found and removed
    //    }

    //}


    GetHelpTicketDet();
}
