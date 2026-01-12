$(document).ready(function () {

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 16,
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

    var obj10 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 10,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlTask', obj10, 'All', false);

    if (isDispatch == 1) {
        $("#ddlTask").val(8).trigger('change')
        $('#ddlTask').prop('disabled', true);
    }
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

    //$('#txtSampleId').on('input', debounce(function () {
    //    if ($.fn.DataTable.isDataTable("#sampleStep234")) {
    //        sampleFMS.ajax.reload();
    //    }
    //}, 500));

    //$('#txtItemName').on('input', debounce(function () {
    //    if ($.fn.DataTable.isDataTable("#sampleStep234")) {
    //        sampleFMS.ajax.reload();
    //    }
    //}, 500));


    //$('#ddlCustomer, #ddlSampleType, #ddlItem, #ddlChemist, #ddlTask').on('change', function () {
    //    BindData();
    //})
    //BindData();
});

//function debounce(func, wait) {
//    let timeout;
//    return function () {
//        clearTimeout(timeout);
//        timeout = setTimeout(() => func.apply(this, arguments), wait);
//    };
//}

var sampleFMS;
//function BindData() {

//    if ($.fn.DataTable.isDataTable("#sampleStep234")) {
//        sampleFMS.ajax.reload();
//        return;
//    }

//    sampleFMS = $('#sampleStep234').DataTable({
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
//        "ordering": false,
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
//                screenId: 'ERP_Samp7_102',
//                modelData: JSON.stringify({
//                    Item: $('#txtItemName').val(),
//                    Chemist: $('#ddlChemist').val() == 'All' ? 0 : $('#ddlChemist').val(),
//                    Customer: $('#ddlCustomer').val() == 'All' ? 0 : $('#ddlCustomer').val(),
//                    SampleType: $('#ddlSampleType').val() == 'All' ? 0 : $('#ddlSampleType').val(),
//                    Task: $('#ddlTask').val() == 'All' ? 0 : $('#ddlTask').val(),
//                    Type: '',
//                    SampleID: $('#txtSampleId').val(),
//                })
//            };

//            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
//                if (response && response.data) {
//                    console.log(response);

//                    tblData = response.data.Records;

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
//            {
//                "data": null,
//                "orderable": false,
//                "render": function (data, type, row) {

//                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.createdat) + "</label>";

//                }
//            },
//            { "data": "SalesPerson" },
//            { "data": "Client" },
//            { "data": "ItemName" },
//            { "data": "SampleType" },
//            {
//                "data": null,
//                "orderable": false,
//                "render": function (data, type, row) {

//                    if (row.Chemist == null) {
//                        return "<label>---</label>";
//                    }
//                    else {
//                        return "<label>" + row.Chemist + "</label>";
//                    }

//                }
//            },
//            {
//                "data": null,
//                "orderable": false,
//                "render": function (data, type, row) {

//                    var TaskNo = '';

//                    if (row.TaskNo == 8 && row.ActualTime != null) {
//                        TaskNo = '';
//                    }
//                    else {
//                        TaskNo = `<strong class="text-primary" > Task ${row.TaskNo}</strong>`;
//                    }

//                    return `${TaskNo}<span class="d-block">${row.TaskNo == `1` ? `Enter Basic Information` : row.TaskNo == `2` ? `Sample Production` : row.TaskNo == `3` ? `Quality Check` : row.TaskNo == `4` ? `Packaging and Sales approval` : row.TaskNo == `5` ? `Bill Of Material` : row.TaskNo == `6` ? `Enter Sample ingredients list` : row.TaskNo == `7` ? `Dispatch Sample` : row.TaskNo == 8 && row.ActualTime == null ? `Enter Customer's Feedback` : `All Tasks Completed`
//                }</span>`;

//                }
//            },
//            {
//                "data": null,
//                "orderable": false,
//                "render": function (data, type, row) {

//                    var text = '';

//                    if (row.isDispatch == 1) {
//                        text = '<span class="align-self-center badge badge-success">Ready For Dispatch</span>';
//                    }
//                    else if (row.isDispatch == 2) {

//                            text = '<span class="align-self-center badge badge-success">Dispatch Completed</span>';

//                    }
//                    else {
//                        text = '<span class="align-self-center badge badge-resolved">Partially Ready</span>';
//                    }
//                    return text;

//                }
//            },
//            {
//                "data": null,
//                "orderable": false,
//                "render": function (data, type, row) {

//                    return "<label>" + getdatetime(row.PendingPlanDate) + "</label>";

//                }
//            },
//            {
//                "data": null,
//                "orderable": false,
//                "render": function (data, type, row) {

//                    return row.Delay == null ? 0 : row.Delay;

//                }
//            },
//            {
//                "orderable": false,
//                "data": null,
//                "render": function (data, type, row) {

//                    var viewDetails = "";

//                    var markDone = "";

//                    viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.Id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

//                    if (row.TaskNo == 7) {
//                        markDone = `<a class="dropdown-item" href="EnterDispatchSample?auth=${AuthToken}&id=${row.ERP_Sample_Id}">Mark Done</a>`;
//                    }
//                    else if (row.TaskNo == 1) {
//                        markDone = ` <a class="dropdown-item" onclick="showData(${row.Id})">Mark Done</a>`;
//                    }
//                    else if (row.TaskNo == 2 || row.TaskNo == 3 || row.TaskNo == 4 || row.TaskNo == 6) {
//                        markDone = ` <a class="dropdown-item" onclick="showData234(${row.Id}, ${row.TaskNo})">Mark Done</a>`;
//                    }
//                    else if (row.TaskNo == 5) {
//                        markDone = `<a class="dropdown-item" onclick = "StoreChemistName('${String(row.Chemist)}', '${String(row.SampleType)}', ${row.BOM_ID})" href = "EnterFormulationForSample?auth=${AuthToken}&id=${row.Id}" > Mark Done</a >`;
//                    }
//                    else if (row.TaskNo == 8) {
//                        if (row.IsModification == 0) {
//                            markDone = `<a class="dropdown-item" href="AddSample?auth=${AuthToken}&id=${row.Id}&isDuplicate=1&prev_sampId=${row.DocNo}" >Modification</a >`;
//                        }
//                        else if (row.IsModification != 1) {
//                            markDone = `<a class="dropdown-item" onclick="showData8(${row.Id})">Mark Done</a>`;
//                        }
//                    }

//                    return `<div class="dropdown">
//                            <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
//                                <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
//                            </span>
//                            <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
//                                ${viewDetails}
//                                ${markDone}
//                            </div>
//                        </div>`;


//                }
//            }
//        ]
//    });

//    $('[data-toggle="tooltip"]').tooltip();

//    // Re-initialize tooltips every time the table is redrawn
//    sampleFMS.on('draw.dt', function () {
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



//    TableSetup(sampleFMS)
//}


let tblData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindItemMasterGrid();



});

function bindItemMasterGrid() {
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
        screenId: 'ERP_Samp7_102',
        modelData: JSON.stringify({
            Item: $('#txtItemName').val(),
            Chemist: $('#ddlChemist').val() == 'All' ? 0 : $('#ddlChemist').val(),
            Customer: $('#ddlCustomer').val() == 'All' ? 0 : $('#ddlCustomer').val(),
            SampleType: $('#ddlSampleType').val() == 'All' ? 0 : $('#ddlSampleType').val(),
            Task: $('#ddlTask').val() == 'All' ? 0 : $('#ddlTask').val(),
            Type: '',
            SampleID: $('#txtSampleId').val(),
        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tblData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'SampleFMS', columnMeta, tblData);
        $("#customLoader").hide();
    });
}


function bindItemMasterGridFilter() {

    let filterData = tblData;

    var taskNo = $("#ddlTask").val() === 'All' ? '0' : $("#ddlTask").val();

    if (taskNo != '0') {

        filterData = tblData.filter(row => row.TaskNo == (taskNo-1));

    }

    if (filterData.length > 0) {

        gridOptions.api.setRowData(filterData);

    } else {

        if (globalGridOptions != null)
            gridOptions.api.setRowData([]);

    }

}

function StoreChemistName(chemist_name, samp_type, bom_id) {
    localStorage.setItem("chemist", chemist_name);
    localStorage.setItem("sample_type", samp_type);


    if (bom_id != null) {

        localStorage.setItem("IsBOM_ID", true);
    }
    else {
        localStorage.setItem("IsBOM_ID", false);
    }
}

function showTaskModal(id, authToken, FMS_Id) {
    $.get('/Account/GetTaskStatusModal', { id: id, auth: authToken, FMS_Id: 1,  }, function (data) {
        $('#yourModalContainer').html(data);
        $('#viewstatus').modal('show');
    });
}

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


var Edit_Id = 0;
function showData(id) {

    Edit_Id = id;

    var data = tblData.find(input => input.Id == id);
    if (!data) return;

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

    if (data.FileURL.length <= 1) {
        $('#viewAtt1').hide();
    }
    else {
        $('#item_att1').attr('href', '#');

        $('#item_att1').on('click', function () {
            handleTaskItemFile(data.FileURL, data.ActualFileName)
        })

        $('#item_att1').html(data.ActualFileName);
        $('#viewAtt1').show()
    }

    console.log(data.videolink);

    if (data.videolink != null && data.videolink.length >= 1) {
        $('#video').attr('href', data.videolink);
        $('#video').attr('target', '_blank');
    }
    else {
        $('#video').removeAttr('target');

    }

    $('#open_pdf').on('click', function () {

        handleTaskFile(data.FileURL, data.ActualFileName);
        $("#customLoader").hide();
    })
   

    $('#txtChemist').val(data.ChemistId > 0 ? data.ChemistId : 'Select').trigger('change');
    $('#ddlBaseItem').val(data.BaseItem_Id > 0 ? data.BaseItem_Id : 'Select').trigger('change');
    $('#fragrance').val(data.Fragrance == null ? '' : data.Fragrance);
    $('#color').val(data.color == null ? '' : data.color);
    $('#activities').val(data.Activities == null ? '' : data.Activities);
    $('#variantsno').val(data.VariantsNo == null ? 0 : data.VariantsNo);
    data.IsNormal == 1 ? $('#normal').prop('checked', true) : $('#normal').prop('checked', false);
    data.IsUrgent == 1 ? $('#urgent').prop('checked', true) : $('#urgent').prop('checked', false);

    $('#txtItem').text(data.ItemName || '');
    $('#txtFormCate').text(data.FormulationCate || '');
    $('#txtFragrance').text(data.SD_Fragrance || '');
    $('#txtColour').text(data.SD_Color || '');
    $('#txtPackegingType').text(data.PackegingType || '');
    $('#txtTargetPrice').text(data.SD_TargetPrice !== null ? `₹ ${data.SD_TargetPrice}` : '');
    $('#requirements').text(data.Requirements || '');
    $('#mustIngredients').text(data.MustIngredients || '');
    $('#mustnotingredients').text(data.MustNotIngredients || '');

    $('#markdone').modal('show');
}

var sample_Type;
var Type
var FileUrl = '';
var ActualFileName = '';


function handleOnClickTaskFile() {

    handleTaskFile(FileUrl, ActualFileName);

    $("#customLoader").hide();

}

async function showData234(id, TaskNo) {

    Edit_Id = id;

    var data = tblData.find(input => input.Id == id);
    if (!data) return;

    FileUrl = data.FileURL;
    ActualFileName = data.ActualFileName;

    $('#open_pdf2').on('click', function () {

        handleTaskFile(data.FileURL, data.ActualFileName);
        $("#customLoader").hide();
    })



    //$('#open_pdf3').on('click', function () {

    //    handleTaskFile(data.FileURL, data.ActualFileName);
    //})

    //$('#open_pdf4').on('click', function () {

    //    handleTaskFile(data.FileURL, data.ActualFileName);
    //})
    $('#open_pdf6').on('click', function () {

        handleTaskFile(data.FileURL, data.ActualFileName);
        $("#customLoader").hide();
    })


    sample_Type = data.SampleType;

    Type = TaskNo == 2 ? 'SAMP2' : TaskNo == 3 ? 'SAMP3' : 'SAMP4';

    if (TaskNo == 5) {
        TaskNo += 1;
    }


        if (data.SampleType == 'Oil') {
            $('#fragView' + TaskNo).hide();
            $('#colorView' + TaskNo ).hide();
            $('#packegingView' + TaskNo).hide();
            $('#viewReq' + TaskNo).hide();
            $('#viewMust' + TaskNo).hide();
            $('#viewMustNot' + TaskNo).hide();
        }
        else {
            $('#fragView' + TaskNo).show();
            $('#colorView' + TaskNo).show();
            $('#packegingView' + TaskNo).show();
            $('#viewReq' + TaskNo).show();
            $('#viewMust' + TaskNo).show();
            $('#viewMustNot' + TaskNo).show();
        }

        $('#Chemist' + TaskNo).html(data.Chemist);

        if (data.videolink != null && data.videolink.length >= 1) {
            $('#video' + TaskNo).attr('href', data.videolink);
            $('#video' + TaskNo).attr('target', '_blank');


        }
        else {
            $('#video' + TaskNo).removeAttr('target');

        }


        $('#txtItem' + TaskNo).text(data.ItemName || '');
        $('#txtFormCate' + TaskNo).text(data.FormulationCate || '');
        $('#txtFragrance' + TaskNo).text(data.SD_Fragrance || '');
        $('#txtColour' + TaskNo).text(data.SD_Color || '');
        $('#txtPackegingType' + TaskNo).text(data.PackegingType || '');
        $('#txtTargetPrice' + TaskNo).text(data.SD_TargetPrice !== null ? `₹ ${data.SD_TargetPrice}` : '');
        $('#requirements' + TaskNo).text(data.Requirements || '');
        $('#mustIngredients' + TaskNo).text(data.MustIngredients || '');
        $('#mustnotingredients' + TaskNo).text(data.MustNotIngredients || '');


    if (data.FileURL.length <= 1) {
        $('#viewAtt' + TaskNo).hide()
    }
    else {



        $('#item_att' + TaskNo).attr('href', '#');
        $('#item_att' + TaskNo).on('click', function () {
            handleTaskItemFile(data.FileURL, data.ActualFileName)
        })

        $('#item_att' + TaskNo).html(data.ActualFileName);
        $('#viewAtt' + TaskNo).show()
    }



    if (TaskNo == 3) {
        await GetQCValues();
    }

    if (TaskNo == 2) {
        $('#markdone2').modal('show');
    }
    else if (TaskNo == 3) {
        $('#markdone3').modal('show');
    }
    else if (TaskNo == 4) {
        $('#markdone4').modal('show');
    }
    else if (TaskNo == 6) {
        $('#remarks6').val('');
        $('#bomIngedients').html(data.BomIngredients);
        $('#markdone6').modal('show');


    }
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

function SaveSamp6Info() {

    if (checkValidationOnSubmit('Mandatory6')) {

        var obj = {
            Id: Edit_Id,
            Type: 'SAMP6',
            Remarks: $('#remarks6').val()
        }

        var jsonstring = JSON.stringify(obj);

        let GenericModeldata = {
            ScreenID: "ERP_Samp6_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonstring
        };


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                $('#markdone6').modal('hide');
                // BindData();
                bindItemMasterGrid();
            }

        });

    }



}

function SaveBasicInfo234(IsApprove) {

 

        var obj = {
            Id: Edit_Id,
            Type: Type,
            IsApprove: IsApprove
        }

        var jsonstring = JSON.stringify(obj);

        let GenericModeldata = {
            ScreenID: "Sample_234",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonstring
        };


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                if (Type == 'SAMP2') {
                    $('#markdone2').modal('hide');
                }
                else if (Type == 'SAMP3') {
                    $('#markdone3').modal('hide');
                }
                else if (Type == 'SAMP4') {
                    $('#markdone4').modal('hide');
                }
                // BindData();

                bindItemMasterGrid();
            }

        });




}


function SaveBasicInfo() {

    if (checkValidationOnSubmit('Mandatory')) {

        var obj = {
            Id: Edit_Id,
            Chemist: $('#txtChemist').val(),
            BaseItem_Id: $('#ddlBaseItem').val() == 'Select' ? 0 : $('#ddlBaseItem').val(),
            Fragrance: $('#fragrance').val(),
            Color: $('#color').val(),
            Activities: $('#activities').val(),
            VariantsNo: $('#variantsno').val(),
            IsNormal: $('#normal').prop('checked') == true ? 1 : 0,
            IsUrgent: $('#urgent').prop('checked') == true ? 1 : 0
        }

        var jsonstring = JSON.stringify(obj);

        let GenericModeldata = {
            ScreenID: "Sample_EnterBasicInfo_2",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonstring
        };


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                $('#markdone').modal('hide');
                // BindData();
                bindItemMasterGrid();
            }

        });

    }



}

var sample_uniq_id = '';

function showData8(id) {

    

    Edit_Id = id;

    var data = tblData.find(input => input.Id == id);
    if (!data) return;

    sample_uniq_id = data.DocNo;


    if (data.FeedBackRemarks == null) {
        $('#remarks8').val('');
    }
    else {
        $('#remarks8').val(data.FeedBackRemarks);
    }

    $('#markdone8').modal('show');

}


function SaveBasicInfo8(isApproved) {

    if (checkValidationOnSubmit('Mandatory8')) {

        var obj = {
            Id: Edit_Id,
            Type: '',
            IsApproved: isApproved,
            Remarks: $('#remarks8').val()
        }

        var jsonstring = JSON.stringify(obj);

        let GenericModeldata = {
            ScreenID: "ERP_Samp8_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonstring
        };


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                $('#markdone8').modal('hide');
                // BindData();
                bindItemMasterGrid();
            }

        });

    }
}



function SaveModifyBasicInfo8() {

    if (checkValidationOnSubmit('Mandatory8')) {

        var obj = {
            Id: Edit_Id,
            Type: '',
            IsApproved: 3,
            Remarks: $('#remarks8').val()
        }

        var jsonstring = JSON.stringify(obj);

        let GenericModeldata = {
            ScreenID: "ERP_Samp8_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonstring
        };

        


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                // BindData();
                bindItemMasterGrid();
                window.location.href = `AddSample?auth=${AuthToken}&id=${Edit_Id}&isDuplicate=1&prev_sampId=${sample_uniq_id}`;
            }

        });

    }
}




function handleTaskItemFile(fileUrl, actualFileName) {
    // Determine file extension using lastIndexOf('.')

    /*const imageElement = document.getElementById('myImage');*/

    // Get the value of the 'src' attribute
    const filePath = fileUrl;
    const lastDotIndex = filePath.lastIndexOf('.');
    const fileExtension = lastDotIndex !== -1 ? filePath.substring(lastDotIndex + 1).toLowerCase() : '';

    // List of image extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    // Check if the file is an image

    downloadTaskItemFile(filePath, actualFileName);
}


function downloadTaskItemFile(filePath, actualFileName) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = actualFileName; // Let the browser decide the file name or specify one
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



function handleTaskFile(fileUrl, actualFileName) {
    // Determine file extension using lastIndexOf('.')

    /*const imageElement = document.getElementById('myImage');*/

    // Get the value of the 'src' attribute
    const filePath = fileUrl;
    const lastDotIndex = filePath.lastIndexOf('.');
    const fileExtension = lastDotIndex !== -1 ? filePath.substring(lastDotIndex + 1).toLowerCase() : '';

    // List of image extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    // Check if the file is an image
    if (imageExtensions.includes(fileExtension) || fileExtension == '' || fileExtension == null || fileExtension.length > 4) {
        // Show image in modal
        showTaskModalWithImage(filePath);
    } else {
        // Download the file
        downloadTaskFile(filePath, actualFileName);
    }
}

// Function to display image in the modal
function showTaskModalWithImage(imagePath) {
    const modalImage = document.getElementById('myImage');
    if (!imagePath || imagePath.length <= 1) {
        FailToaster('No image/pdf was saved!');
        return;
    }
    modalImage.src = imagePath;
    $('#viewimage').modal('show'); // Assuming you're using jQuery and Bootstrap // changs in comment
}

// Function to download the file

function downloadTaskFile(filePath, actualFileName) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = actualFileName; // Let the browser decide the file name or specify one
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

