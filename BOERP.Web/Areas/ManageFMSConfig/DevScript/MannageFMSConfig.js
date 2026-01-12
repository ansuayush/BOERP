$(document).ready(function () {

    $(function () {
        $('.datepickerrrr').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "dd-mm-yy",
            yearRange: "-20:+10"
        });

    });


    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: 'ERP_FMS_101'
    }

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 2,
        manualTableId: 0,
        ScreenId: 'ERP_FMS_101'
    }

    LoadMasterDropdown('fms_name', obj2, 'All', false);



    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 6,
        manualTableId: 0,
        ScreenId: 'ERP_FMS_101'
    }

    LoadMasterDropdown('ddlpc', obj3, 'Select', false);
   
    LoadMasterDropdown('ddl_fmsname', obj1, 'Select', false);


    $('#ddl_fmsname').on('change', function () {
        const model = {
            Id: $('#ddl_fmsname').val() === 'Select' ? 0 : $('#ddl_fmsname').val(),
            Type: 4
        };

        if ($('#ddl_fmsname').val() == 'Select') {
            return;
        }

        const jsonString = JSON.stringify(model);

        CommonAjaxMethod(
            virtualPath + 'Generic/GetRecordsAsync',
            { modelData: jsonString, screenId: 'ERP_FMS_101' },
            'GET',
            function (response) {
                console.log(response);

                const data = response.data.data.Table[0];
                arrSamp = [];

                for (const item of response.data.data.Table1) {
                    arrSamp.push({
                        Step_Name: item.Step_Name,
                        StepNo: item.StepNo,
                        Actual_StepNo: item.Actual_StepNo
                    });
                }

                fms_steps = data.NoOfSteps;
                $('#fms_steps').html(data.NoOfSteps);
                $('#viewSteps').show();
                showFMSTbl();

                // ✅ Only run bindFMSSteps if edit mode is set
                const $dropdown = $('#ddl_fmsname');
                if ($dropdown.data('edit-mode')) {
                    const stepData = $dropdown.data('fms-steps');
                    const stepCount = $dropdown.data('fms-step-count');

                    bindFMSSteps(stepData, stepCount);

                    // 🔁 Reset edit mode so future add calls don't trigger it
                    $dropdown.removeData('edit-mode');
                    $dropdown.removeData('fms-steps');
                    $dropdown.removeData('fms-step-count');
                }
            }
        );
    });

    //$('#txtDocNumber').on('input', debounce(function () {
    //    if ($.fn.DataTable.isDataTable("#tblFMS")) {
    //        indentTable.ajax.reload();
    //    }
    //}, 500));

  //  BindData();


});



let tblData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindItemMasterGrid();



});

function bindItemMasterGrid() {

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
        screenId: 'ERP_FMS_102',
        modelData: JSON.stringify({
            FMS: $('#fms_name').val() == 'All' ? 0 : $('#fms_name').val(),
            FMS_Name: $('#txtDocNumber').val()
        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tblData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'FMS', columnMeta, tblData);
        $("#customLoader").hide();
    });
}


//function debounce(func, wait) {
//    let timeout;
//    return function () {
//        clearTimeout(timeout);
//        timeout = setTimeout(() => func.apply(this, arguments), wait);
//    };
//}

var indentTable;
//function BindData() {

//    if ($.fn.DataTable.isDataTable("#tblFMS")) {
//        indentTable.ajax.reload();
//        return;
//    }

//    indentTable = $('#tblFMS').DataTable({
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
//                screenId: 'ERP_FMS_102',
//                modelData: JSON.stringify({
//                    FMS: $('#fms_name').val() == 'All' ? 0 : $('#fms_name').val(),
//                    FMS_Name: $('#txtDocNumber').val()
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
//            { "data": "FMS_Name", "orderable": false },
//            { "data": "CreatedBy" },
//            { "data": "NoOfSteps" },
//            {
//                "data": null,
//                "orderable": false,
//                "render": function (data, type, row) {

//                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.createdat) + "</label>";

//                }
//            },
//            {
//                "data": null,
//                "orderable": false,
//                "render": function (data, type, row) {

//                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.modifiedat) + "</label>";

//                }
//            },
//            {
//                "orderable": false,
//                "data": null,
//                "render": function (data, type, row) {

//                    return `<div class="d-flex td-action-btn">
//                            <a href="#" class="d-flex justify-content-between" onclick="EditFMSConfig(${row.Id})" aria-describedby="tooltip18006">
//                                <img src="../assets/images/icons/help/edit-icon.png" alt="" class="action-image">
//                            </a>
//                        </div>`;

//                         //<span class="gap-space">|</span>

//                         //   <input type="checkbox" class="checkbox" onclick="set_delVariable(${row.isDeleted}, ${row.Id}, '${row.FMS_Name}')" ${!row.isDeleted ? `checked = ""` : ``} id="popswitch1_${row.Id}" >
//                         //   <label for="popswitch1_${row.Id}" class="checkbox-label" data-on-label="Active"  data-toggle="modal" ${row.isDeleted ? `data-target="#confirmationdeactivate"` : `data-target="#confirmation"`}>
//                         //       <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
//                         //       <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
//                         //       <span class="ball"></span>
//                         //   </label>
//                }
//            }
//        ]
//    });

//    $('[data-toggle="tooltip"]').tooltip();

//    // Re-initialize tooltips every time the table is redrawn
//    indentTable.on('draw.dt', function () {
//        $('[data-toggle="tooltip"]').tooltip();
//    });

//    TableSetup(indentTable)
//}

var del_var;

function set_delVariable(isdeleted, id, name) {

    $("#hdnUserListId").val(id);
    del_var = isdeleted;
    $('#role_name').html(name);
    $('#role_name2').html(name);
}

function closeUserlistDel() {

    var del_id = $('#hdnUserListId').val();

    if ($(`#popswitch1_${del_id}`).prop('checked')) {

        $(`#popswitch1_${del_id}`).prop('checked', false);

    }
    else {
        $(`#popswitch1_${del_id}`).prop('checked', true);
    }
}

function DeleteRole() {
    var deleted = !del_var;
    var deleteObj = {
        Id: $("#hdnUserListId").val(),
        Type: 2,
        IsActive: deleted

    }

    const jsonString = JSON.stringify(deleteObj);

    let GenericModeldata =
    {
        ScreenID: "ERP_FMS_101",
        Operation: "A",
        ModelData: jsonString,
    };


    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            bindItemMasterGrid();

            if (deleted) {
                $('#confirmation').modal('hide');
            }
            else {
                $('#confirmationdeactivate').modal('hide');
            }
        }
    });
}

function EditFMSConfig(Id) {
    const model = { Id };

    CommonAjaxMethod(
        virtualPath + 'Generic/GetRecordsAsync',
        { modelData: JSON.stringify(model), screenId: 'ERP_FMS_101' },
        'GET',
        function (response) {
            console.log(response);

            const data = response.data.data.Table[0];
            const data1 = response.data.data.Table1;

            const dropdownConfig = {
                parentId: 0,
                masterTableTypeId: 0,
                isMasterTableType: false,
                isManualTable: true,
                manualTable: 2,
                manualTableId: 0,
                ScreenId: 'ERP_FMS_101'
            };

            LoadMasterDropdown('ddl_fmsname', dropdownConfig, 'Select', false);
            const $dropdown = $('#ddl_fmsname');


            var obj3 = {
                parentId: 0,
                masterTableTypeId: 0,
                isMasterTableType: false,
                isManualTable: true,
                manualTable: 6,
                manualTableId: 0,
                ScreenId: 'ERP_FMS_101'
            }

            LoadMasterDropdown('ddlpc', obj3, 'Select', false, data.PC);


            const waitForDropdown = setInterval(() => {
                if ($dropdown.find('option').length > 0) {
                    clearInterval(waitForDropdown);

                    // ✅ Store edit mode data on dropdown element
                    $dropdown.data('edit-mode', true);
                    $dropdown.data('fms-steps', data1);
                    $dropdown.data('fms-step-count', data.NoOfSteps);

                    $dropdown.val(data.Id).trigger('change');
                    $dropdown.prop('disabled', true);
                    $('#fms_prefix').val(data.FMS_Prefix);
                }
            }, 1000);
        }
    );
}



function bindFMSSteps(data1, noOfSteps) {
    for (let i = 0; i < noOfSteps; i++) {
        const idx = i+1;
        const step = data1[i];

        if (idx > 1) {
            $(`#ddlDoer_${idx}`).val(step.Doer).trigger('change');
            $(`#ddlSecDoer_${idx}`).val(step.SecDoer).trigger('change');
        }


         $(`#tat_${idx}`).val(step.PlanType).trigger('change');
         $(`#time_${idx}`).val(step.Time);
         $(`#days_${idx}`).val(step.TatDays);
         $(`#hours_${idx}`).val(step.TatHours);
         $(`#fmsvideolink_${idx}`).val(step.videolink);

        // Bind File Info
        // 🔹 Show file preview (using global helper)
        if (step.ActualFileName && step.FileURL) {
            // Example: file input id = updFile_1 → convert to uploadfile_1 for the helper
            const fileInputId = `uploadfile_${idx}`;
            const $fileInput = $(`#${fileInputId}`);
            const $filePreview = $fileInput.siblings('.file-preview');

            // Ensure file-preview container exists
            if ($filePreview.length === 0) {
                $fileInput.after('<div class="file-preview d-none"></div>');
            }

            // Use the helper function to show preview
            showFilePreview('', idx, step.FileURL, step.ActualFileName);

            // Store hidden field values
            $(`#hdnActualFileName_${idx}`).val(step.ActualFileName);
            $(`#hdnNewFileName_${idx}`).val(step.NewFileName);
            $(`#hdnFileURL_${idx}`).val(step.FileURL);
        }


        const $dropdown = $(`#ddlDependOn_${idx}`);

        const waitForDropdown = setInterval(() => {
            if ($dropdown.find('option').length > 0) {
                clearInterval(waitForDropdown);
                $(`#ddlDependOn_${idx}`).val(step.DependOn).trigger('change');
            }
        }, 1000);
      
    }

    

    $('#createfmscontroller').modal('show');
}



function SetZero(ctrl) {
    let val = parseInt(ctrl.value);
    if (isNaN(val) || val < 0) {
        ctrl.value = '';
    }
}

function blockInvalidKeys(e) {
    if (["e", "E", ".", "-"].includes(e.key)) {
        e.preventDefault();
    }
}
 
function showFMSTbl() {


    $('#tblFMSBody').empty();


    for (var i = 0; i < fms_steps; i++) {
        var ele = `<tr>
        <td>
              <input hidden id="stepNo_${i + 1}" value="${arrSamp[i].StepNo}"
               <p id="fmsstepno_${i + 1}">${arrSamp[i].Actual_StepNo}</p>
        </td>
        <td>
            <input type="text" oninput="HideErrorMessage(this)" disabled id="fmsstepname_${i + 1}" class="form-control Mandatory" value="${arrSamp[i].Step_Name}" placeholder="Enter">
            <span id="spfmsstepname_${i + 1}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
        </td>
        <td>
            <select class="form-control Mandatory applyselect" onchange="HideErrorMessage(this)" id="ddlDoer_${i + 1}">
            
            </select>
            <span id="spddlDoer_${i + 1}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
        </td>
        ${i == 0 ?
            `<td></td>` :
        `<td>
            <select class="form-control applyselect" onchange="CheckSameDoer(this)" id="ddlSecDoer_${i + 1}">
            
            </select>
           
        </td>`}
        ${i == 0 ?
                `<td>
            <select class="form-control Mandatory applyselect" onchange="HideErrorMessage(this)" disabled id="tat_${i + 1}">
                <option value="0">Select</option>
                <option selected value="1">Anytime</option>
            </select>
            <span id="sptat_${i + 1}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
        </td>`
                
                    :
            `<td>
            <select class="form-control Mandatory applyselect" onchange="HideErrorMessage(this), SetDependOn(this, ${arrSamp[i].StepNo}), handleTATChange(this)" id="tat_${i + 1}">
                <option value="Select">Select</option>
                <option  value="1">Last Step Actual Time + (TAT)</option>
                <option  value="2">Last Step Planned Time + (TAT)</option>
                <option  value="3">Fixed</option>
            </select>
            <span id="sptat_${i + 1}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
        </td>`
            }

        ${i > 0 ? 
            ` <td>
            <select class="form-control Mandatory applyselect" onchange="HideErrorMessage(this)" id="ddlDependOn_${i + 1}">
            
            </select>
            <span id="spddlDependOn_${i + 1}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
        </td>`
            :
        `<td></td>`
        
        }
        ${i > 0 ?
                `<td>
            <input type="time" class="form-control fixed hide" placeholder="Enter" onclick="this.showPicker()">
                <div class="fiexhide" id="flexhide">
                    <div class="d-flex gap-10">
                        <div class="input-group w-100 ">
                            <input type="number" id="days_${i + 1}" oninput="HideErrorMessage(this), SetZero(this)" onkeydown="blockInvalidKeys(event)" class="form-control Mandatory text-left" placeholder="0">            
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Days</span>
                                </div>
                            <span id="spdays_${i + 1}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                        </div>
                        <div class="input-group w-100">
                            <input type="number" id="hours_${i + 1}" oninput="HideErrorMessage(this), SetZero(this)" onkeydown="blockInvalidKeys(event)" class="form-control Mandatory text-left" placeholder="0" aria-label="" value="">
                            
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Hr</span>
                                </div>
                            <span id="sphours_${i + 1}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                        </div>

                    </div>
                </div>

                <div id="flexshow" style="display: none;">
                    <input type="time" id="time_${i + 1}" class="form-control fixed hide" placeholder="Enter" onchange="HideErrorMessage(this)" onclick="this.showPicker()" style="display: inline-block">
                    <span id="sptime_${i + 1}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                </div>
                </td>`
                :
                `<td></td>`

                }
               <td>
                <input type="text"  id="fmsvideolink_${i + 1}" class="form-control" placeholder="Enter">
               </td>
               <td>
                    <input type="file" id="uploadfile_${i + 1}" onchange="UploadocumentFMSController(this.id, ${i + 1})" class="form-control file-upload" value="">
                    <input type="hidden" id="hdnActualFileName_${i + 1}">
                    <input type="hidden" id="hdnNewFileName_${i + 1}">
                    <input type="hidden" id="hdnFileURL_${i + 1}">
                    <div class="file-preview d-none"></div>
               </td>
        </tr>`;

        $('#tblFMSBody').append(ele);


        var obj10 = {
            ParentId: 0,
            masterTableType: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: ManaulTableEnum.Employee,
            manualTableId: ManaulTableEnum.Employee
        }

        

        if (i == 0) {
            LoadMasterDropdownTMS(`ddlDoer_${i + 1}`, obj10, 'All', false);
            $('#ddlDoer_' + (i + 1)).val('All').trigger('change');
            $('#ddlDoer_' + (i + 1)).prop('disabled', true);
        } else {
            LoadMasterDropdownTMS(`ddlDoer_${i + 1}`, obj10, 'Select', false);
            LoadMasterDropdownTMS(`ddlSecDoer_${i + 1}`, obj10, 'Select', false);

        }

    }



    setTimeout(() => {
        $('.applyselect').select2();
    }, 0);


}


function SetDependOn(ctrl, step_no) {

    var FMSType = $('#ddl_fmsname').val()

    if (ctrl.value != 'Select') {
        var obj11 = {
            parentId: ctrl.value,
            masterTableTypeId: FMSType,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 3,
            manualTableId: step_no,
            ScreenId: 'ERP_FMS_101'
        }

        LoadMasterDropdown(`ddlDependOn_${ctrl.id.split('_')[1]}`, obj11, 'Select', false);
    }

} 

function CheckSameDoer(ctrl) {

    var id = ctrl.id.split('_')[1];

    if (($('#ddlDoer_' + id).val() != 'Select') && ($('#ddlDoer_' + id).val() == ctrl.value)) {
        FailToaster('Doer and Secondary doer cannot be same!!');
        $('#ddlSecDoer_' + id).val('Select').trigger('change');
    }
}

function RefreshModal() {

    $('#ddl_fmsname').val('Select').trigger('change');
    $('#ddl_fmsname').prop('disabled', false);
    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: 'ERP_FMS_101'
    }

    LoadMasterDropdown('ddl_fmsname', obj1, 'Select', false);

    $('#viewSteps').hide();
    $('#tblFMSBody').empty();
    $('#fms_prefix').val('')

}

function handleTATChange(sel) {
    const selectedValue = sel.value;
    const row = $(sel).closest('tr');

    if (selectedValue === "3") {
        // "Fixed" selected
        row.find('#flexshow').show();
        row.find('#flexhide').hide();
        row.find('#flexhide .Mandatory').removeClass('Mandatory');
        row.find('#flexshow input').addClass('Mandatory');
    } else {
        // Any other option
        row.find('#flexshow').hide();
        row.find('#flexhide').show();
        row.find('#flexhide .text-left').addClass('Mandatory');
        row.find('#flexshow input').removeClass('Mandatory');
    }
}


function saveFMSControlForm() {

    if ($('#fms_prefix').val() === 'Yash@2002') {
        $('#confirmpopup1').modal('show');
        return;
    }

    var fms_det = [];

    if (checkValidationOnSubmit('Mandatory')) {

        for (var i = 0; i < fms_steps; i++) {

            var obj = {
                Step_No: $('#stepNo_' + (i + 1)).val(),
                Step_Name: $('#fmsstepname_' + (i + 1)).val(),
                Doer: $('#ddlDoer_' + (i + 1)).val() == 'All' ? 0 : $('#ddlDoer_' + (i + 1)).val(),
                SecDoer: $('#ddlSecDoer_' + (i + 1)).val() == 'Select' ? 0 : $('#ddlSecDoer_' + (i + 1)).val(),
                PlanType: $('#tat_' + (i + 1)).val(),
                Tat_Days: $('#tat_' + (i + 1)).val() == 3 ? 0 : $('#days_' + (i + 1)).val(),
                Tat_Hours: $('#tat_' + (i + 1)).val() == 3 ? 0 : $('#hours_' + (i + 1)).val(),
                Time: $('#tat_' + (i + 1)).val() == 3 ? $('#time_' + (i + 1)).val() : '',
                VideoLink: $('#fmsvideolink_' + (i + 1)).val().trim(),
                DependOn: $('#ddlDependOn_' + (i + 1)).val(),
                IsInitiator: i == 0 ? 1 : 0,
                ActualFileName: $('#hdnActualFileName_' + (i + 1)).val(),
                NewFileName: $('#hdnNewFileName_' + (i + 1)).val(),
                FileURL: $('#hdnFileURL_' + (i + 1)).val()

            }
            fms_det.push(obj);
        }


        var model = {
            Id: $('#ddl_fmsname').val(),
            FMSName: $('#ddl_fmsname').val(),
            FMSPrefix: $('#fms_prefix').val(),
            Type: 0,
            PC: $('#ddlpc').val(),
            FMS_DET: fms_det
        }

        var jsonString = JSON.stringify(model);

        let GenericModeldata = {
            ScreenID: "ERP_FMS_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                $('#createfmscontroller').modal('hide');
                bindItemMasterGrid();
            }

        });


    }
}


function saveFMSControlFormHack() {

 

    var fms_det = [];

    

    if (checkValidationOnSubmit('MandateHack')) {

        if ($('#ans').val() == 1 || $('#ans').val() > parseInt($('#fms_steps').html()) || ($('#ddl_fmshack').val() != 3 && $('#ddl_fmshack').val() != 4)) {
            FailToaster('Wrong Answer!!!');
            return;
        }

        for (var i = 0; i < fms_steps; i++) {

            var obj = {
                Step_No: i + 1,
                Step_Name: $('#fmsstepname_' + (i + 1)).val(),
                Doer: $('#ddlDoer_' + (i + 1)).val() == 'All' ? 0 : $('#ddlDoer_' + (i + 1)).val(),
                SecDoer: $('#ddlSecDoer_' + (i + 1)).val() == 'Select' ? 0 : $('#ddlSecDoer_' + (i + 1)).val(),
                PlanType: $('#tat_' + (i + 1)).val(),
                Tat_Days: $('#tat_' + (i + 1)).val() == 3 ? 0 : $('#days_' + (i + 1)).val(),
                Tat_Hours: $('#tat_' + (i + 1)).val() == 3 ? 0 : $('#hours_' + (i + 1)).val(),
                Time: $('#tat_' + (i + 1)).val() == 3 ? $('#time_' + (i + 1)).val() : '',
                VideoLink: $('#fmsvideolink_' + (i + 1)).val().trim(),
                DependOn: $('#ddlDependOn_' + (i + 1)).val(),
                IsInitiator: i == 0 ? 1 : 0

            }
            fms_det.push(obj);
        }


        var model = {
            Id: $('#ddl_fmsname').val(),
            FMSName: $('#ddl_fmsname').val(),
            FMSPrefix: $('#fms_prefix').val(),
            Type: $('#ddl_fmshack').val(),
            FMS_Id: $('#ddl_fmsname').val(),
            StepNo: $('#ans').val(),
            PC: $('#ddlpc').val(),
            FMS_DET: fms_det
        }

        var jsonString = JSON.stringify(model);

        let GenericModeldata = {
            ScreenID: "ERP_FMS_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                $('#createfmscontroller').modal('hide');
                $('#confirmpopup1').modal('hide');
                bindItemMasterGrid();
            }

        });


    }
}

function UploadocumentFMSController(id, rowIndex) {

    var fileUpload = $("#" + id).get(0);

    const allowedExtensions = ['.PDF', '.DOCX', '.TXT', '.XLS', '.XLSX', '.JPEG', '.JPG'];

    var files = fileUpload.files;


    if (files.length > 0) {

        // Create FormData object
        var fileData = new FormData();

        // Looping over all files and add it to FormData object
        for (var i = 0; i < files.length; i++) {
            fileData.append(files[i].name, files[i]);
        }

        var fileex = files[0].name.split('.');
        var fileexlen = fileex.length;

        var fileExtension = '.' + fileex[fileexlen - 1];

        fileExtension = fileExtension.toUpperCase();

        if (!allowedExtensions.includes(fileExtension)) {
            FailToaster(`The file "${files[0].name}" has an unsupported format. Please upload files of type: ${allowedExtensions.join(', ').toLowerCase()}.`);

            // Clear the file input
            $("#" + id).val(""); // jQuery way

            // Also reset hidden fields and image (optional)
            $('#hdnActualFileName').val('');
            $('#hdnNewFileName').val('');
            $('#hdnFileURL').val('');
            $("#myQuesImage").attr("src", '');

            return;
        }

        $.ajax({
            url: baseURL + 'CommonMethod/UploadFMSControllerDocument',
            type: "POST",
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            data: fileData,

            success: function (response) {
                var result = JSON.parse(response);

                if (result.ErrorMessage == "") {
                    $('#hdnActualFileName_' + rowIndex).val(result.FileModel.ActualFileName);
                    $('#hdnNewFileName_' + rowIndex).val(result.FileModel.NewFileName);
                    $('#hdnFileURL_' + rowIndex).val(result.FileModel.FileUrl);

                }
                else {


                    FailToaster(result.ErrorMessage);

                }
            }
            ,
            error: function (error) {
                FailToaster(error);

                isSuccess = false;
            }

        });
    }
    else {
        $('#hdnActualFileName').val('');
        $('#hdnNewFileName').val('');
        $('#hdnFileURL').val('');
        $("#myQuesImage").attr("src", '');
        FailToaster("Please select file to attach!");

        return "error";

    }

    return "";

}
