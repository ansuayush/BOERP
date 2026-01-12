
$(document).ready(function () {

    var obj1 = {
        parentId: 0,
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
        manualTable: 7,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlChemist', obj2, 'All', false);

    LoadMasterDropdown('txtChemist', obj2, 'Select', false);

    

    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 8,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlItem', obj3, 'All', false);

    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }

    LoadMasterDropdown('ddlSampleType', obj4, 'All', false);


    var obj5 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 9,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlBaseItem', obj5, 'Select', false);

    

    $('#ddlCustomer, #ddlSampleType, #ddlItem, #ddlChemist').on('change', function () {
        BindData();
    })

    BindData();
});


function blockInvalidKeys(e) {
    if (["e", "E", ".", "-"].includes(e.key)) {
        e.preventDefault();
    }
}

function SetZero(ctrl) {
    let val = parseFloat(ctrl.value);
    if (isNaN(val) || val < 0) {
        ctrl.value = '';
    }
}



var tblData = [];
function BindData() {

    if ($.fn.DataTable.isDataTable("#sampleEnterBasicInfoTbl")) {
        indentTable.ajax.reload();
        return;
    }

    indentTable = $('#sampleEnterBasicInfoTbl').DataTable({
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
                screenId: 'Sample_EnterBasicInfo_2',
                modelData: JSON.stringify({
                    Item: $('#ddlItem option:selected').text() == 'All' ? '' : $('#ddlItem option:selected').text(), 
                    Chemist: $('#ddlChemist').val() == 'All' ? 0 : $('#ddlChemist').val(),
                    Customer: $('#ddlCustomer').val() == 'All' ? 0 : $('#ddlCustomer').val(),
                    SampleType: $('#ddlSampleType').val() == 'All' ? 0 : $('#ddlSampleType').val(),                   
                    Type: 0
                })
            };

            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
                if (response && response.data) {

                    console.log(response);

                    tblData = response.data.Records;

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
            { "data": "Srno" },
            { "data": "DocNo", "orderable": false },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.createdat) + "</label>";

                }
            },
            { "data": "SalesPerson" },
            { "data": "Client" },
            { "data": "ItemName" },
            { "data": "SampleType" },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    if (row.Chemist == null) {
                        return "<label>---</label>";
                    }
                    else {
                        return "<label>" + row.Chemist + "</label>";
                    }

                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {
                    
                    return '<strong class="text-primary">Task 1</strong> <span class="d-block">Enter Basic Information</span>';

                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return "<label>" + getdatetime(row.PlannedDate) + "</label>";

                }
            },
            {
                "data": null,
                "orderable": false,
                "render": function (data, type, row) {

                    return row.Delay == null ? 0 : row.Delay;

                }
            },
            {
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {

                    var viewDetails = "";

                    viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.Id}, '${AuthToken}')" >View Status</a>`;


                    return `<div class="dropdown">
                            <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                                <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                            </span>
                            <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">

                                <a class="dropdown-item" onclick="showData(${row.Id})">Mark Done</a>
                                ${viewDetails}
                            </div>
                        </div>`;


                }
            }
        ]
    });

    $('[data-toggle="tooltip"]').tooltip();

    // Re-initialize tooltips every time the table is redrawn
    indentTable.on('draw.dt', function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    TableSetup(indentTable)
}

var Edit_Id = 0;

function showTaskModal(id, authToken) {
    $.get('/ManageSample/GetTaskStatusModal', { id: id, auth: authToken }, function (data) {
        $('#yourModalContainer').html(data);
        $('#viewstatus').modal('show');
    });
}


