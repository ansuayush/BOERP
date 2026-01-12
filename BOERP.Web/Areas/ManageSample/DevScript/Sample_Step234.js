
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
var recordsTotal = 0;
var recordsFiltered = 0;
function BindData() {

    if ($.fn.DataTable.isDataTable("#sampleStep234")) {
        indentTable.ajax.reload();
        return;
    }

    indentTable = $('#sampleStep234').DataTable({
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
                screenId: Type == 'SAMP6' ? 'ERP_Samp6_101' : 'Sample_234',
                modelData: JSON.stringify({
                    Item: $('#ddlItem option:selected').text() == 'All' ? '' : $('#ddlItem option:selected').text(),
                    Chemist: $('#ddlChemist').val() == 'All' ? 0 : $('#ddlChemist').val(),
                    Customer: $('#ddlCustomer').val() == 'All' ? 0 : $('#ddlCustomer').val(),
                    SampleType: $('#ddlSampleType').val() == 'All' ? 0 : $('#ddlSampleType').val(),
                    Type: Type
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

                    return `<strong class="text-primary">Task ${Type == `SAMP2` ? `2` : Type == `SAMP3` ? `3` : Type == `SAMP6` ? `6` : `4`}</strong> <span class="d-block">${Type == `SAMP2` ? `Sample Production` : Type == `SAMP3` ? `Quality Check` : Type == `SAMP6` ? `Enter Sample ingredients list` : `Packaging and Sales approval`}</span>`;

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


function showTaskModal(id, authToken) {
    $.get('/ManageSample/GetTaskStatusModal', { id: id, auth: authToken }, function (data) {
        $('#yourModalContainer').html(data);
        $('#viewstatus').modal('show');
    });
}

var Edit_Id = 0;

var sample_Type;
async function showData(id) {

    Edit_Id = id;

    var data = tblData.find(input => input.Id == id);
    if (!data) return;

    sample_Type = data.SampleType;

    if (data.SampleType == 'Oil') {
        $('#fragView').hide();
        $('#colorView').hide();
        $('#packegingView').hide();
        $('#viewReq').hide();
        $('#viewMust').hide();
        $('#viewMustNot').hide();
    }
    else {
        $('#fragView').show();
        $('#colorView').show();
        $('#packegingView').show();
        $('#viewReq').show();
        $('#viewMust').show();
        $('#viewMustNot').show();
    }

    $('#Chemist').html(data.Chemist);

    if (data?.Remarks) {
        $('#remarks').val(data.Remarks);
    }
    else {
        $('#remarks').val('');
    }
  

    $('#txtItem').text(data.ItemName || '');
    $('#txtFormCate').text(data.FormulationCate || '');
    $('#txtFragrance').text(data.SD_Fragrance || '');
    $('#txtColour').text(data.SD_Color || '');
    $('#txtPackegingType').text(data.PackegingType || '');
    $('#txtTargetPrice').text(data.SD_TargetPrice !== null ? `₹ ${data.SD_TargetPrice}` : '');
    $('#requirements').text(data.Requirements || '');
    $('#mustIngredients').text(data.MustIngredients || '');
    $('#mustnotingredients').text(data.MustNotIngredients || '');

    await GetQCValues();

    $('#markdone').modal('show');

}

function GetQCValues() {

    var model =
    {
        Id: Edit_Id,
        Type: 6
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        var filtered = [];

        if (sample_Type == 'Oil') {
            filtered = response.data.data.Table.filter(item => item.Category.includes("Oil"));
        }
        else {
            filtered = response.data.data.Table
        }

        var qc = ``;

        var index = 0;

        for (var item of filtered) {

            qc += `<li>${item.Parameter_Name}</li>`;

            index++;
        }

        $('#qc_params').html(qc);



    });

}

function SaveBasicInfo() {

    if (checkValidationOnSubmit('Mandatory')) {

        var obj = {
            Id: Edit_Id,
            Type: Type
        }

        var jsonstring = JSON.stringify(obj);

        let GenericModeldata = {
            ScreenID: "Sample_234",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonstring
        };


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                $('#markdone').modal('hide');
                BindData();
            }

        });

    }



}


function SaveSamp6Info() {

    if (checkValidationOnSubmit('Mandatory')) {

        var obj = {
            Id: Edit_Id,
            Type: Type,
            Remarks: $('#remarks').val()
        }

        var jsonstring = JSON.stringify(obj);

        let GenericModeldata = {
            ScreenID: "ERP_Samp6_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonstring
        };


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                $('#markdone').modal('hide');
                BindData();
            }

        });

    }



}