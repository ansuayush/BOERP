$(document).ready(function () {


    var obj10 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 5,
        manualTableId: 0,
        ScreenId: 'ERP_FMS_101'
    }

    var selectedValue = parseInt(localStorage.getItem('PcDrop')) ? localStorage.getItem('PcDrop') : 1;

    LoadMasterDropdown('ddlFMS', obj10, 'Select', false, selectedValue);

    // Update on input (live typing)
    $(document).on('input', '#txtRejectedQtyRejected', function () {
        var totalQty = parseFloat($('#hdbQtyRejected').val());

        var rejectedQty = parseFloat($(this).val()) || 0;
        var approvedQty = totalQty - rejectedQty;

        $('#txtApprovedQtyRejected').val(approvedQty.toFixed(3) + ' ' + $('#hdnUOM').val());
        $('#hdntxtApprovedQtyRejected').val(approvedQty.toFixed(3));
        // Prevent negative approved quantity
        if (approvedQty < 0) {
            $('#txtApprovedQtyRejected').val($('#hdbQtyRejected').val() + ' ' + $('#hdnUOM').val());
            $('#hdntxtApprovedQtyRejected').val($('#hdbQtyRejected').val());
            $('#txtRejectedQtyRejected').val('0');
            FailToaster("Rejected quantity cannot exceed approved quantity.");
        }
    });

    // Update on input (live typing)
    $(document).on('input', '#txtRejectedQtyInitiated', function () {
        var totalQty = parseFloat($('#hdntxtTotalQtyInitiated').val());
        var rejectedQty = parseFloat($(this).val()) || 0;
        var approvedQty = totalQty - rejectedQty;
        $('#hdntxtApprovedQtyInitiated').val(approvedQty.toFixed(3));
        $('#txtApprovedQtyInitiated').val(approvedQty.toFixed(3) + ' ' + $('#hdnUOM').val());
        // Prevent negative approved quantity
        if (approvedQty < 0) {
            $('#hdntxtApprovedQtyInitiated').val($('#hdntxtTotalQtyInitiated').val());
            $('#txtApprovedQtyInitiated').val($('#hdntxtTotalQtyInitiated').val() + ' ' + $('#hdnUOM').val());

            $('#txtRejectedQtyInitiated').val('0');
            FailToaster("Rejected quantity cannot exceed approved quantity.");
        }
    });



    var model =
    {
        ID: FinYearId
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'FinYear_101' }, 'GET', function (response) {
        var tblFinYear = response.data.data.Table;
        finFromDate = tblFinYear[0].FromDate;
        finToDate = tblFinYear[0].ToDate;

    });

    ShowQCMappingParamOil(0);


});



var testNameArray = [];

function ShowQCMappingParamOil(itemId) {
    //ItemIdData = itemId;
    var model =
    {
        Id: 1,
        Type: 7
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);


        testNameArray = response.data.data.Table.filter(item => item.CategoryName.includes("Oil"));

        // $("#tblQCTestMapping tbody").html('');

        // BindHTMLTableQualityParameters(0);

    });
    // $("#qctestmapping").modal('show');
}





var sampleFMS;


let tblData = []; // Load via API as you already do

document.addEventListener("DOMContentLoaded", function () {
    tblData = [];
    bindDynamicAgGrid();


});
function bindDynamicAgGrid() {

    if ($('#ddlFMS').val() > 0) {

        var gridId = ''

        gridId = $('#ddlFMS').val() == 1 ? 'SampleFMSPC' : $('#ddlFMS').val() == 2 ? 'QCFMSPC' : $('#ddlFMS').val() == 3 ? 'OilLSampleFMSPC' : $('#ddlFMS').val() == 4 ? 'OilULSampleFMSPC' : $('#ddlFMS').val() == 5 ? 'TechnicalDocPC' : 'SalesOrderFMSOPC';

        localStorage.setItem('PcDrop', $('#ddlFMS').val());

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
            screenId: 'PC_FMS_101',
            modelData: JSON.stringify({
                Item: $('#txtItemName').val(),
                Chemist: $('#ddlChemist').val() == 'All' ? 0 : $('#ddlChemist').val(),
                Customer: $('#ddlCustomer').val() == 'All' ? 0 : $('#ddlCustomer').val(),
                SampleType: $('#ddlSampleType').val() == 'All' ? 0 : $('#ddlSampleType').val(),
                Task: $('#ddlTask').val() == 'All' ? 0 : $('#ddlTask').val(),
                Type: $('#ddlFMS').val(),
                SampleID: $('#txtSampleId').val(),
            })
        };
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tblData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", gridId, columnMeta, tblData);
            $("#customLoader").hide();




            const { pendingCount, delayedCount } = calculateTaskCounts(tblData, $('#ddlFMS').val());

            // Update UI
            document.getElementById('pendingTasksCount').textContent = pendingCount;
            document.getElementById('delayedTasksCount').textContent = delayedCount;

        });

    }
}

function calculateTaskCounts(tblData, Type) {
    let pendingCount = 0;
    let delayedCount = 0;

    const typeNum = Number(Type);

    tblData.forEach(row => {
        const taskNo = parseInt(row.TaskNo);
        const actualTime = row.ActualTime;

        const delayRaw = typeNum === 2 ? (row.DelayHours || '').trim() : typeNum === 6 ? (row.DelayDays || '').trim() : (row.Delay || '').trim();
        const delayValue = delayRaw ? parseFloat(delayRaw) : 0;

        // Debugging output
        console.log(`TaskNo: ${taskNo}, ActualTime: ${actualTime}, DelayValue: ${delayValue}, Type: ${typeNum}`);

        var final_step = 0;

        if (Type == 1) {
            final_step = 7;
        }
        else if (Type == 2) {
            final_step = 3;
        }
        else if (Type == 3) {
            final_step = 4;
        }
        else if (Type == 4) {
            final_step = 5;
        }
        else if (Type == 5) {
            final_step = 1;
        }
        else if (Type == 6) {
            final_step = 9;
        }
        else if (Type == 7) {
            final_step = 3;
        }

        const isPending = row.TaskNoInWords != 'All Tasks Completed';
        if (isPending) pendingCount++;

        if (!isNaN(delayValue) && delayValue > 0) delayedCount++;
    });

    return { pendingCount, delayedCount };
}



function AddRowMicrobiologyTests(docID) {
    var rowCount = $("#tblMicrobiologyTests tbody tr").length;
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img style="width: 15px;" class="btnDelete" onclick="DeleteRowMicrobiologyTests(' + (rowCount + 1) + ');" src="../../assets/images/icons/help/close.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameListMT(' + (rowCount + 1) + ');" id="ddlTestNameListMT' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameListMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultTypeMT' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnitMT' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRangeMT' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMinMT' + (rowCount + 1) + '" placeholder="MIN" class="form-control" />' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMaxMT' + (rowCount + 1) + '" placeholder="MAX" class="form-control" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtTextMT' + (rowCount + 1) + '" oninput="RestrictNoAlpha(event)" placeholder="Enter" class="form-control color hide" />' +
        '<input type="text" id="txtNumberMT' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" />' +
        '<input type="hidden" id="hddCategoryMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSampleMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProductionMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiologicalMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCIDMT' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblMicrobiologyTests tbody").append(row);
    var $ele0 = $('#ddlTestNameListMT' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological == true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });
}



function ChangeTestNameListMT(rowId) {
    var testNameId = 0;
    var selectedCode = $('#ddlTestNameListMT' + (rowId)).find(':selected').data('code');
    testNameId = $('#ddlTestNameListMT' + (rowId)).val();
    // Get row with ID = 8
    var result = testNameArray.find(x => x.ID === parseInt(testNameId));
    $('#hddCategoryMT' + (rowId)).val(result.Category);
    $('#hddIsSampleMT' + (rowId)).val(result.isSample);
    $('#hddIsProductionMT' + (rowId)).val(result.isProduction);
    $('#hddIsInvardMT' + (rowId)).val(result.isInvard);
    $('#hddIsOutWardMT' + (rowId)).val(result.isOutWard);
    $('#hddIsMicrobiologicalMT' + (rowId)).val(result.isMicrobiological);
    $('#hddQCIDMT' + (rowId)).val(0);

    if (selectedCode == 1) {
        $('#txtNumberMT' + rowId + '').val(result.Numeric_Value);

        $('#txtNumberMT' + rowId + '').show();
        $('#txtTextMT' + rowId + '').hide();
        $('#divRangeMT' + rowId + '').hide();
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Numeric';
        //document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Numeric_Value;
    }
    if (selectedCode == 2) {
        $('#txtNumberMT' + rowId + '').hide();
        $('#txtTextMT' + rowId + '').show();
        $('#divRangeMT' + rowId + '').hide();

        $('#txtTextMT' + rowId + '').val(result.Text_Value);
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Text';
        // document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Text_Value;
    }
    if (selectedCode == 3) {
        $('#txtNumberMT' + rowId + '').hide();
        $('#txtTextMT' + rowId + '').hide();
        $('#divRangeMT' + rowId + '').show();

        $('#txtApprovedMinMT' + rowId + '').val(result.Range_Min);
        $('#txtApprovedMaxMT' + rowId + '').val(result.Range_Max);
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Range';
        //document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Range_Min + '-' + result.Range_Max;
    }
    document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.MeasuringUnit;
}




function closeView() {
    // hide via Bootstrap modal API, then remove from DOM when hidden
    const $m = $('#viewstatus');
    if ($m.length && typeof $m.modal === 'function') {
        $m.modal('hide');
        $m.on('hidden.bs.modal', function () {
            // cleanup to avoid duplicates/backdrop issues
            $m.remove();
        });
    } else {
        // fallback if modal plugin not available
        $m.hide().remove();
    }
}

function showTaskModalPC(rowId, auth, fms_id) {
    // if a previous modal exists, remove it to avoid duplicates
    $('#viewstatus').remove();

    // Modal HTML
    var js = `<div class="modal" id="viewstatus" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-xlg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title text-center w-100">Status</h4>
          <button type="button" class="close" onclick="closeView()" data-dismiss="modal" aria-label="Close">
            <img src="../../assets/images/icons/help/close-icon.png" class="closeicon" alt="close">
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="form-group col-sm-12">
              <div class="table-responsive sticky-responsive">
                <table class="display bg-thrid stickyth dgntable dataTable no-footer itemsinformation">
                  <thead>
                    <tr>
                      <th width="80" class="white-clr">Task #</th>
                      <th width="300" class="white-clr">Task Description</th>
                      <th width="100" class="white-clr">Planned <span class="d-block">Date</span></th>
                      <th width="100" class="white-clr">Actual<span class="d-block">Date</span></th>
                      <th width="100" class="white-clr">Doer Name</th>
                      <th width="50" class="white-clr">Delay<span class="d-block">(Hrs)</span></th>
                      <th class="white-clr">Remarks</th>
                      <th class="white-clr text-center" width="60">Action</th>
                    </tr>
                  </thead>
                  <tbody id="view_dynamic_status"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

    $('#view_dynamic_fms').html(js);

    if (fms_id > 0) {

        var model =
        {
            ID: rowId,
            Type: 2,
            FMS_Id: fms_id
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_PCFMS_102' }, 'GET', function (response) {
            var tblData = response.data.data.Table;
            // Build task rows dynamically
            let rowsHtml = '';
            let actionHtml = '';
            if (Array.isArray(tblData) && tblData.length > 0) {
                tblData.forEach(task => {

                    if (task.IsLastStep == 1) {
                        actionHtml = `
                   
                    <a href="#" onclick="viewTask(${rowId}, '${task.StepNo}', ${fms_id})" title="Delete">
                       <img src="../../assets/images/icons/help/view-icon.png" alt="" class="icon-sm" />
                    </a>`;
                    }
                    else if (task.IsEdit == 1) {

                        actionHtml = `
                    <a href="#" onclick="editTask(${rowId}, '${task.StepNo}', ${fms_id})" title="Edit">
                        <img src="../../assets/images/icons/help/edit-icon.png" class="icon-md cursor-pointer mr-2" alt="Edit">
                    </a>
                    <a href="#" onclick="viewTask(${rowId}, '${task.StepNo}', ${fms_id})" title="View">
                        <img src="../../assets/images/icons/help/view-icon.png" alt="" class="icon-sm" />
                    </a>`;

                    }
                    else if (task.IsEdit == 0) {


                        actionHtml = ``;

                    }
                    else {

                        actionHtml = `
                   
                    <a href="#" onclick="viewTask(${rowId}, '${task.StepNo}', ${fms_id})" title="Delete">
                       <img src="../../assets/images/icons/help/view-icon.png" alt="" class="icon-sm" />
                    </a>`;

                    }

                    //<div class="dropdown">
                    //    <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton_${task.TaskNo}" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                    //        <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                    //    </span>
                    //    <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton_${task.TaskNo}">
                    //        <a class="dropdown-item" href="#" onclick="editTask(${task.TaskID}, '${auth}', ${fms_id})">Edit</a>
                    //        <a class="dropdown-item" href="#" onclick="deleteTask(${task.TaskID}, '${auth}', ${fms_id})">Delete</a>
                    //    </div>
                    //</div>`;

                    // Determine row color based on Planned and Actual date presence
                    var rowColor = task.PlannedDate != null && task.ActualDate != null ? "status-bg-c" : task.PlannedDate != null ? "status-bg-p" : "";

                    rowsHtml += `
                    <tr class="${rowColor}">
                        <td>${task.TaskNo || ''}</td>
                        <td>${task.Description || ''}</td>
                        <td>${task.PlannedDate ? task.PlannedDate.split('T')[0] + ' ' + task.PlannedDate.split('T')[1].split('.')[0] : ''}</td>
                        <td>${task.ActualDate ? task.ActualDate.split('T')[0] + ' ' + task.ActualDate.split('T')[1].split('.')[0] : ''}</td>
                        <td>${task.DoerName || ''}</td>
                        <td>${task.DelayHours || ''}</td>
                        <td>${task.Remarks || ''}</td>
                        <td class="text-center">${actionHtml}</td>
                    </tr>`;
                });
            } else {
                rowsHtml = `<tr><td colspan="7" class="text-center">No tasks available</td></tr>`;
            }

            // Inject dynamic rows into the table body
            $('#view_dynamic_status').html(rowsHtml);

            // Show modal
            const $modal = $('#viewstatus');
            if (typeof $modal.modal === 'function') {
                $modal.modal({ backdrop: 'static', keyboard: true });
                $modal.modal('show');
            } else {
                $modal.show();
            }
        });
    }
}

let viewOTD = false;

function editTask(rowId, StepNo, fms_id) {

    switch (fms_id) {

        case 1:

            getSampleAllStepsEdit(rowId, StepNo, fms_id);
            break;


        case 2:

            getQcAllStepsEdit(rowId, StepNo, fms_id);
            break;

        case 3:

            getOilListedAllStepsEdit(rowId, StepNo, fms_id);
            break;

        case 4:


            getOilUnListedAllStepsEdit(rowId, StepNo, fms_id);
            break;

        case 5:

            getTechnicalAllStepsEdit(rowId, StepNo, fms_id);
            break;

        case 6:

            viewOTD = false;

            const data = tblData.find(input => input.Order_ItemId == rowId);

            getModalFieldByStepNo(data.ID, rowId, StepNo - 1, data.ItemOTDStatus);


        default:
            return;
    }

}

var orderItemId = 0;
function getModalFieldByStepNo(rowId, griedOrderItemId, StepNo, ItemOTDStatus) {
    if (rowId > 0 && griedOrderItemId > 0) {

        orderItemId = griedOrderItemId;
        if (StepNo == 1) {
            showModalFieldStep1(rowId, StepNo)
        }
        else if (StepNo == 2) {
            if (ItemOTDStatus === 'New') {
                showModalFieldNewStep2New(rowId, StepNo, ItemOTDStatus)
            }
            else {
                showModalFieldRepeatStep2(rowId, StepNo, ItemOTDStatus)
            }

        }
        else if (StepNo == 3) {
            showModalFieldStep3(rowId, StepNo)
        }
        else if (StepNo == 4) {
            showModalFieldStep4(rowId, StepNo)
        }
        else if (StepNo == 5) {
            showModalFieldStep5(rowId, StepNo)
        }
        else if (StepNo == 6) {
            showModalFieldStep6(rowId, StepNo)
        }
        else if (StepNo == 7) {
            showModalFieldStep7(rowId, StepNo)
        }
        else if (StepNo == 8) {
            showModalFieldStep8(rowId, StepNo)
        }
        else if (StepNo == 9) {
            showModalFieldStep9(rowId, StepNo)
        }
        else if (StepNo == 10) {
            showModalFieldStep10(rowId, StepNo)
        }
        disableOTDFields();
    }
    /*  getModalFieldDataByStepNo(rowId, StepNo);*/
}


//function getSampleAllSteps(rowId, stepNo, fms_id) {

//    // code for sampke
//}


function viewTask(rowId, StepNo, fms_id) {

    switch (fms_id) {

        case 1:

            getSampleAllStepsView(rowId, StepNo, fms_id);
            break;

        case 2:

            getQcAllStepsView(rowId, StepNo, fms_id);
            break;

        case 3:

            getOilListedAllStepsView(rowId, StepNo, fms_id);
            break;

        case 4:


            getOilUnListedAllStepsView(rowId, StepNo, fms_id);
            break;

        case 5:

            getTechnicalAllStepsView(rowId, StepNo, fms_id);
            break;
        case 6:

            viewOTD = true;

            const data = tblData.find(input => input.Order_ItemId == rowId);

            getModalFieldByStepNo(data.ID, rowId, StepNo - 1, data.ItemOTDStatus);

        default:
            return;
    }

}



function getSampleAllStepsEdit(rowId, StepNo, fms_id) {

    if (StepNo == 2) {
        getSampleStep1(rowId, false);
    }
    else if (StepNo == 3) {
        getSampleStep2(rowId, false, StepNo)
    }
    else if (StepNo == 4) {
        getSampleStep3(rowId, false, StepNo)
    }
    else if (StepNo == 6) {
        getSampleStep4(rowId, false, StepNo);
    }
    else if (StepNo == 7) {
        getSampleStep5(rowId, false, StepNo);
    }
    else if (StepNo == 8) {
        getSampleStep6(rowId, false, StepNo);
    }
    else if (StepNo == 9) {
        getSampleStep7(rowId, false, StepNo);
    }
}


function getSampleAllStepsView(rowId, StepNo, fms_id) {


    if (StepNo == 2) {
        getSampleStep1(rowId, true);
    }
    else if (StepNo == 3) {
        getSampleStep2(rowId, true, StepNo);
    }
    else if (StepNo == 4) {
        getSampleStep3(rowId, true, StepNo);
    }
    else if (StepNo == 6) {
        getSampleStep4(rowId, true, StepNo);
    }
    else if (StepNo == 7) {
        getSampleStep5(rowId, true, StepNo);
    }
    else if (StepNo == 8) {
        getSampleStep6(rowId, true, StepNo, 1);
    }
    else if (StepNo == 9) {
        $('#markdone8 .modal-title').html('Step 7 - Enter Customer Feedback');
        getSampleStep7(rowId, true, StepNo);
    }
}

function getOilUnListedAllStepsEdit(rowId, StepNo, fms_id) {

    if (StepNo == 2) {
        getOilULStep1(rowId, false, StepNo);
    }
    else if (StepNo == 3) {
        getOilULStep2(rowId, false, StepNo);
    }
    else if (StepNo == 4) {
        getOilULStep3(rowId, false, StepNo);
    }
    else if (StepNo == 5) {
        getSampleStep6(rowId, false, StepNo, 3);
    }
    else if (StepNo == 6) {

        getSampleStep7(rowId, false, StepNo);
    }
    else {
        FailToaster('Step Not Recognized !!!');
        return;
    }

}



function getOilUnListedAllStepsView(rowId, StepNo, fms_id) {

    if (StepNo == 2) {
        getOilULStep1(rowId, true, StepNo);
    }
    else if (StepNo == 3) {
        getOilULStep2(rowId, true, StepNo);
    }
    else if (StepNo == 4) {
        getOilULStep3(rowId, true, StepNo);
    }
    else if (StepNo == 5) {
        getSampleStep6(rowId, true, StepNo, 3);
    }
    else if (StepNo == 6) {
        $('#markdone8 .modal-title').html('Step 5 - Enter Customer Feedback');
        getSampleStep7(rowId, true, StepNo);
    }
    else {
        FailToaster('Step Not Recognized !!!');
        return;
    }
}

function getOilListedAllStepsEdit(rowId, StepNo, fms_id) {

    if (StepNo == 2) {
        getOilLStep1(rowId, false, StepNo);
    }
    else if (StepNo == 3) {
        getOilLStep2(rowId, false, StepNo);
    }
    else if (StepNo == 4) {
        getSampleStep6(rowId, false, StepNo, 2);
    }
    else if (StepNo == 5) {

        getSampleStep7(rowId, false, StepNo);
    }
    else {
        FailToaster('Step Not Recognized !!!');
        return;
    }

}

function getOilListedAllStepsView(rowId, StepNo, fms_id) {

    if (StepNo == 2) {
        getOilLStep1(rowId, true, StepNo);
    }
    else if (StepNo == 3) {
        getOilLStep2(rowId, true, StepNo);
    }
    else if (StepNo == 4) {
        getSampleStep6(rowId, true, StepNo, 2);
    }
    else if (StepNo == 5) {
        getSampleStep7(rowId, true, StepNo);
    }
    else {
        FailToaster('Step Not Recognized !!!');
        return;
    }

}


var oil_sample_id;


function getOilULStep3(rowId, IsView, StepNo) {

    var disabled = IsView ? `disabled` : ``;

    oil_sample_id = rowId;

    var OilULStep3 =
        `<div class="modal fade drawer right-align" id="qctestmappingInitiated">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2 class="modal-title">Step 3 - QC Check initiated</h2>
                <img src="../../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal" />
            </div>
            <div class="modal-body mb-100">
                <!-- open -->

                <div class="row">

                    <div class="col-md-4 form-group">
                        <label class="mb-0">Unlisted Item Name</label>
                        <p id="un_item_name"></p>
                    </div>

                    <div class="col-md-8 form-group">
                        <label class="mb-0">Requirements/Descriptions</label>
                        <p id="un_desc"></p>
                    </div>


                    <div class="col-sm-12 form-group">
                        <p>Please Select the Quality Parameters needed for the QC Check of this item.</p>
                        <div class="table-responsive sticky-responsive">
                            <table id="dtStockTransferInitiated" class="display stickyth     dgntable no-footer radius-0 dataTable itemsinformation" style="table-layout:fixed;">
                                <thead>
                                    <tr>
                                        <th width="150">Test Name</th>
                                        <th width="100">Result Type</th>
                                        <th width="60">Measuring <span class="d-block">Unit</span></th>
                                        <th width="100">Approved Range</th>
                                        <th width="100">Result Value</th>

                                    </tr>
                                </thead>

                            </table>
                        </div>
                    </div>


                    <div class="col-md-12 form-group">
                        <label>Remarks (Optional)</label>
                        <textarea id="txtRemarkInitiated" class="form-control h-120" maxlength="250" placeholder="Enter" ${disabled}></textarea>
                        <span id="spRemarkInitiated" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </div>



                    <div class="col-sm-12 form-group">
                        <div class="card br-none p-0  ">
                            <div class="card-header d-flex justify-content-between bg-none ">
                                <h2 class="title-two align-self-center">Upload Document</h2>
                                <div class="align-self-center"></div>
                            </div>
                            <div class="col-lg-12 form-group" id="add_att">
                                <div class="card br-none p-0">
                                    <div class="card-header d-flex justify-content-between bg-none ">
                                        <h2 class="title-two align-self-center">Attachment</h2>
                                        <div class="align-self-center"></div>
                                    </div>
                                    <div class="card-body  view-form-group">
                                        <div class="section-container section-container-popup">
                                            <div class="fileuploadview drag-area">
                                                <div class="uploadicon_text file-input-button">
                                                    <div class="uploadicon">
                                                        <img src="../../assets/images/icons/help/fileupload-icon.svg" alt="">
                                                    </div>
                                                    <div class="uploadtext drag-file">
                                                        <h4>Drop files here or click to upload</h4>
                                                        <h6>This is a dropzone, drop files or click to browse</h6>
                                                        <span class="error">The file size should be upto 2MB,<br /> with a maximum of 10 attachments.</span>
                                                    </div>
                                                </div>
                                                <input type="file" id="fileIndent" class="file-input hidden" multiple />
                                                <div id="documentImages" class="document-images"></div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-12 form-group" style="display: none;" id="view_att">
                                <div class="card br-none p-0">
                                    <div class="card-header border-top-RL header-active br-none  d-flex justify-content-between ">
                                        <h2 class="title-two align-self-center">Material COA Upload</h2>
                                        <div class="align-self-center"></div>
                                    </div>
                                    <div class="card-body view-form-group min-175 ">
                                        <p class="m-0 nofile" id="NoUploadFile1">No Upload</p>
                                        <div class="section-container fileuploadview hidden section-container-popup" id="ShowUploadFile1">
                                            <!--  -->
                                            <div id="documentImagesMCU" class="document-images">

                                            </div>
                                            <!--  -->
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>


                    </div>
                    <div class="side-footer">
                        <button type="button" data-toggle="modal" data-dismiss="modal" class="btn btn-lg cancelbtn">Cancel</button>

                        ${IsView ? `` :
            `<button type="button" class="btn btn-lg actionbtn" id="initiatedBtn" onclick="SaveDataInitiatedOil()">Submit</button>`}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`
        ;



    closeView();

    // $('#unit').select2();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    // var data = tblData.find(input => input.Id == rowId);

    $('#dynamic_fms').html(OilULStep3);


    data = tblData.find(input => input.Id == rowId);

    $('#un_item_name').html(data.ItemName);
    $('#un_desc').html(data.Requirements);


    ShowQCMappingInitiatedOil(rowId, IsView);


    //$('#qctestmappingInitiated').modal('show');

}



function DownloadIndentFile(ctr) {
    var fileDetails = ctr.id.split('||');
    var fileURl = fileDetails[0];
    var fileName = fileDetails[2];

    if (fileURl != null || fileURl != undefined) {
        var stSplitFileName = fileName.split(".");
        var link = document.createElement("a");
        link.download = stSplitFileName[0];
        link.href = fileURl;
        link.click();
    }
}

function LoadFileData(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    var fileObject =
    {
        "TypeDetails": type,
        "FileType": fileType,
        "FolderNames": "BOMDocuments/",
        "ActualFileName": fileName,
        "NewFileName": newfileName,
        "FileUrl": fileUrl,
        "FileSize": sSize,

    };
    fileModelList.push(fileObject);

    let previewElement;

    if (fileType === "image" || (fileUrl.split('.')[1].includes('png') || fileUrl.split('.')[1].includes('jpe'))) {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="~${fileUrl}" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if ((fileType === "application" && type === "application/pdf") || fileUrl.split('.')[1].includes('pdf')) {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "video") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <video class="preview-video" controls>
                            <source src="${e.target.result}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                        <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileUrl.split('.')[1].includes('xlsx')) {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
        <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages").appendChild(newDocument);
}



//let fileModelList = [];


async function SaveDataInitiatedOil() {
    if (checkValidationOnSubmit('MandateInitiated') == true) {

        if ($('#txtFinalResultInitiated').val() == 'Fail' && $('#txtRemarkInitiated').val().trim() == '') {
            $('#spRemarkInitiated').show();
            return;
        }
        var QCTestMappingData = [];
        // var inputs = $('#dtStockTransferInitiated').find('input[type="number"]');
        var inputs = $('#dtStockTransferInitiated').find('input[id^="tbResultMinInitiated_"]');

        inputs.each(function () {
            var id = $(this).attr('id');
            var value = $(this).val();

            // Optionally, parse ID to extract QCID and GrnItemQCResultId
            var parts = id.split('_'); // Example: tbResultMin_123_456
            var qcid = parts[1];
            var ItemObject = {
                ResultMin: value,
                QCID: qcid
            }
            QCTestMappingData.push(ItemObject);
        });

        console.log(QCTestMappingData);

        var obj =
        {
            FolderNames: "OilUnlistedDocs/"
        }
        var type = 1;//This is for  common upload in attachment folder.
        const jsonString1 = JSON.stringify(obj);

        const result1 = await MultiFileUploadWithoutAync("fileIndent", jsonString1, type, fileDataCollection);

        var fileData = [];
        if (result1.Data != undefined) {
            fileData = JSON.parse(result1.Data).FileModelList;
            fileData = fileData.concat(fileModelList);
        }
        else {
            fileData = fileModelList;
        }

        var model =
        {
            Id: oil_sample_id,
            Remark: $('#txtRemarkInitiated').val(),
            Type: 11,
            QCTestMappingData: QCTestMappingData,
            ERPOilULAttachements: fileData
        };

        console.log(model);
        const jsonString = JSON.stringify(model);
        let GenericModeldata = {
            ScreenID: "Oil_Samp_102",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            $("#qctestmappingInitiated").modal('hide');
            bindDynamicAgGrid();
        });

    }
}


function ShowQCMappingInitiatedOil(sampleId, IsView) {


    var model = {
        Item_Id: sampleId,
        Type: 2
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "Oil_Sample_101";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var data = response.data.data.Table;


        //var data1 = response.data.data.Table1;



        BindTableQCTestInitiatedOil(data, IsView);


        $('#txtRemarkInitiated').val(data[0].Remarks ? data[0].Remarks : '');


        for (var i = 0; i < response.data.data.Table1.length; i++) {
            var fileName = response.data.data.Table1[i].ActualFileName;
            var fileType = response.data.data.Table1[i].FileType;
            var type = response.data.data.Table1[i].Type;
            var fileUrl = response.data.data.Table1[i].FileUrl;
            var fFd = response.data.data.Table1[i].AttachmentID;
            var fSize = response.data.data.Table1[i].FileSize;
            var newfileName = response.data.data.Table1[i].NewFileName;

            if (!IsView) {
                LoadFileData(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
            }

            else {
                LoadFileDataDownload(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
            }
        }

    });

    $("#qctestmappingInitiated").modal('show');
}



function BindTableQCTestInitiatedOil(filteredData, IsView) {

    var disabled = IsView ? `disabled` : ``;

    $('#dtStockTransferInitiated').DataTable().destroy();
    $('#dtStockTransferInitiated').DataTable({
        "data": filteredData,  // assuming the returned data is directly the table array
        "paging": false,
        "info": false,
        "searching": false, // This hides the search box
        "columns": [
            { "data": "TestName" },
            { "data": "ResultType" },
            { "data": "MeasuringUnit" },
            { "data": "ApprovedRange" },
            {
                "orderable": false,
                "data": null,
                 render: function (data, type, row) {
                    return `
                        <input type="text" value="${row.ResultMin}" autocomplete="off"
                            class="form-control MandateInitiated"
                            placeholder="Enter"
                            id="tbResultMinInitiated_${row.QCID}_${row.GrnItemQCResultId}"
                            onchange="HideErrorMessage(this)" ${disabled}>
                        <span id="sptbResultMinInitiated_${row.QCID}_${row.GrnItemQCResultId}"
                            class="text-danger field-validation-error" style="display:none;">
                            Hey, You missed this field!!
                        </span>`;
                }
            }
        ]
    });


}


function LoadFileDataDownload(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {


    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                     
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                         <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "video") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <video class="preview-video" controls>
                            <source src="${e.target.result}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                         <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
         <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                      <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);

    document.getElementById("documentImagesMCU").appendChild(newDocument);

    $('#NoUploadFile1').hide();
    $('#ShowUploadFile1').show();

    $('#add_att').hide();

    $('#view_att').show();

}



function getOilULStep2(rowId, IsView, StepNo) {


    oil_sample_id = rowId

    let OilULStep2 =
        `<div class="modal fade drawer right-align" id="qctestmapping">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2 class="modal-title">Step 2 - Enter Quality Details</h2>
                <img src="../../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal" />
            </div>
            <div class="modal-body mb-100">
                <!-- open -->

                <div class="row">
                   
                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">Unlisted Item Name</label>
                        <p id="lbItemNameMapping"></p>
                    </div>
                    <div class="col-md-8 form-group">
                        <label class="mb-0">Requirements/Descriptions</label>
                        <p id="lblReqItem"></p>
                    </div>


                    <div class="col-sm-12 form-group">
                        <p class="mb-2">Please Select the Quality Parameters needed for the QC Check of this item. </p>
                        <div class="table-responsive sticky-responsive">
                            <table id="tblQCTestMapping" class="display stickyth  dgntable no-footer radius-0 dataTable itemsinformation" style="table-layout:fixed;">
                                <thead>
                                    <tr>
                                        <th width="20"></th>
                                        <th width="150">Test Name</th>
                                        <th width="100">Result Type</th>
                                        <th width="60">Measuring <span class="d-block">Unit</span></th>
                                        <th width="100">Approved Range</th>
                                    </tr>
                                </thead>
                                <tbody id="tblQcCheckBody">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="side-footer">
                <button type="button" class="btn btn-lg  cancelbtn" data-dismiss="modal">Cancel</button>

                ${IsView ? `` :
            `<button type="button" onclick="SaveQCCheckOil();" class="btn btn-lg actionbtn">Submit</button>`}
            </div>
        </div>
    </div>
</div>`;



    closeView();

    // $('#unit').select2();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    // var data = tblData.find(input => input.Id == rowId);

    $('#dynamic_fms').html(OilULStep2);


    data = tblData.find(input => input.Id == rowId);

    $('#lbItemNameMapping').html(data.ItemName);
    $('#lblReqItem').html(data.Requirements);



    $('#qctestmapping').modal('show');


    const itemId = rowId;

    if (parseInt(itemId) > 0) {
        var model = {
            Item_Id: itemId,
            Type: 2
        };

        $('#tblARRNo').html('');

        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Oil_Sample_101' }, 'GET', function (response) {
            //  var tblItemStock = response.data.data.Table1;

            console.log(response);

            var arr = response.data.data.Table;


            for (let i = 0; i < arr.length; i++) {
                if (i == 0) {
                    BindHTMLTableQualityParametersOil(0, IsView);

                    $('#ddlTestNameList' + (i + 1)).val(arr[i].Parameter_NameID).trigger('change');



                }
                else {
                    AddRowQualityParameters();

                    $('#ddlTestNameList' + (i + 1)).val(arr[i].Parameter_NameID).trigger('change');
                }

                if (arr[i].ResultType == 'Text') {

                    $('#txtText' + (i + 1)).val(arr[i].ApprovedRange)
                }
                else if (arr[i].ResultType == 'Numeric') {
                    $('#txtNumber' + (i + 1)).val(arr[i].ApprovedRange)
                }
                else {
                    $('#txtApprovedMin' + (i + 1)).val(arr[i].RangeMin);
                    $('#txtApprovedMax' + (i + 1)).val(arr[i].RangeMax);
                }

            }

            if (IsView) {
                $("#qctestmapping")
                    .find("input, select, textarea, button:not([data-dismiss='modal'])")
                    .prop("disabled", true);

                // Disable Add Row image click
                $("#qctestmapping").find("img[onclick]").css("pointer-events", "none");

                // Keep cancel/close working
                $("#qctestmapping [data-dismiss='modal']").css("pointer-events", "auto");
            }



        });
    }
    else {
        FailToaster('Item Id missing !!!');
    }


}


function ChangeTestNameList(rowId) {
    var testNameId = 0;
    var selectedCode = $('#ddlTestNameList' + (rowId)).find(':selected').data('code');
    testNameId = $('#ddlTestNameList' + (rowId)).val();
    // Get row with ID = 8
    var result = testNameArray.find(x => x.ID === parseInt(testNameId));
    $('#hddCategory' + (rowId)).val(result.Category);
    $('#hddIsSample' + (rowId)).val(result.isSample);
    $('#hddIsProduction' + (rowId)).val(result.isProduction);
    $('#hddIsInvard' + (rowId)).val(result.isInvard);
    $('#hddIsOutWard' + (rowId)).val(result.isOutWard);
    $('#hddIsMicrobiological' + (rowId)).val(result.isMicrobiological);
    $('#hddQCID' + (rowId)).val(0);

    if (selectedCode == 1) {
        $('#txtNumber' + rowId + '').val(result.Numeric_Value);

        $('#txtNumber' + rowId + '').show();
        $('#txtText' + rowId + '').hide();
        $('#divRange' + rowId + '').hide();
        document.getElementById('spResultType' + rowId + '').innerText = 'Numeric';
        //document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Numeric_Value;
    }
    if (selectedCode == 2) {
        $('#txtNumber' + rowId + '').hide();
        $('#txtText' + rowId + '').show();
        $('#divRange' + rowId + '').hide();

        $('#txtText' + rowId + '').val(result.Text_Value);
        document.getElementById('spResultType' + rowId + '').innerText = 'Text';
        //document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Text_Value;
    }
    if (selectedCode == 3) {
        $('#txtNumber' + rowId + '').hide();
        $('#txtText' + rowId + '').hide();
        $('#divRange' + rowId + '').show();

        $('#txtApprovedMin' + rowId + '').val(result.Range_Min);
        $('#txtApprovedMax' + rowId + '').val(result.Range_Max);
        document.getElementById('spResultType' + rowId + '').innerText = 'Range';
        //document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Range_Min + '-' + result.Range_Max;
    }
    document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.MeasuringUnit;
}



function getOilULStep1(rowId, IsView, StepNo) {

    var disabled = IsView ? `disabled` : ``;


    let OilULStep1 =
        `<div class="modal fade drawer right-align" id="markdone16" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2><img src="../../assets/images/icons/help/svg/back-white-arrow.svg" data-dismiss="modal" alt="" class="cursor-pointer">Step 1 - Arrange Sample</h2>
                <img src="../../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal" />
            </div>
            <div class="modal-body mb-100">
                <!-- open -->
                <div class="row">

                    <div class="col-sm-12 form-group">
                        <label for="state" class="mb-0">Required Quantity</label>
                        <div class="input-group">
                            <input type="text" id="txtReqQ_Ul" ${disabled} oninput="HideErrorMessage(this); SetZero(this)" class="MandateUL form-control" placeholder="Enter">
                            <div class="input-group-append bg-bgl">
                                <span class="input-group-text w-60 d-flex align-self-centre d-flex justify-content-center">
                                    <select id="unit_req_ul" class="form-control hidesearchselect  applyselect" ${disabled}>
                                        <option value="ml">ml</option>
                                        <option value="gm">gm</option>
                                    </select>
                                </span>
                            </div>
                        </div>
                        <span id="sptxtReqQ_Ul" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                    </div>

                    <div class="col-sm-12 form-group">
                        <label for="state" class="mb-0">Available Quantity</label>
                        <div class="input-group">
                            <input type="text" id="availReqQ_Ul" ${disabled} oninput="HideErrorMessage(this); SetZero(this)" class="MandateUL form-control" placeholder="Enter">
                            <div class="input-group-append bg-bgl">
                                <span class="input-group-text w-60 d-flex align-self-centre d-flex justify-content-center">
                                    <select id="unit_avail_ul" class="form-control hidesearchselect  applyselect" ${disabled}>
                                        <option value="ml">ml</option>
                                        <option value="gm">gm</option>
                                    </select>
                                </span>
                            </div>
                        </div>
                        <span id="spavailReqQ_Ul" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                    </div>


                    <div class="col-sm-12 form-group">
                        <div class="toggle-card bg-bgl">
                            <div class="toggle-card-header toggle-info">
                                <h4 class="toggle-card-title">Item Information</h4>
                                <span class="toggle-card-icon"><img src="/assets/images/icons/help/arrow-down.png" class="icon-sm" alt=""></span>
                            </div>
                            <div class="toggle-containe toggle-info-content" style="display: none;">
                                <div class="row">
                                    <div class="col-sm-12 form-group ">
                                        <label class="text-gray mb-0">Item Name</label>
                                        <p id="txtItem1"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="formView1">
                                        <label class="text-gray mb-0">Formulation Category</label>
                                        <p id="txtFormCate1"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="fragView1">
                                        <label class="text-gray mb-0">Fragrance</label>
                                        <p id="txtFragrance1"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="colorView1">
                                        <label class="text-gray mb-0">Colour</label>
                                        <p id="txtColour1"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="packegingView1">
                                        <label class="text-gray mb-0">Packaging Type</label>
                                        <p id="txtPackegingType1"></p>
                                    </div>
                                    <div class="col-sm-12 form-group">
                                        <label class="text-gray mb-0">Target Price (₹)</label>
                                        <p id="txtTargetPrice1"></p>
                                    </div>


                                    <div class="col-sm-12 form-group" id="viewReq1">
                                        <label class="text-gray mb-0">Requirements/Descriptions</label>
                                        <p id="requirements1"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="viewMust1">
                                        <label class="text-gray mb-0">Must have ingredients</label>
                                        <p id="mustIngredients1"></p>
                                    </div>


                                    <div class="col-sm-12 form-group" id="viewMustNot1">
                                        <label class="text-gray mb-0">Must not have ingredients</label>
                                        <p id="mustnotingredients1"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="viewAtt2">
                                        <label class="text-gray mb-0">Attachment</label>
                                        <p><a href="" target="blank" id="item_att2"></a></p>
                                    </div>

                                </div>
                            </div>

                        </div>



                    </div>

                    <div class="col-sm-12 form-group">
                        <div class="d-flex gap-20 align-items-center justify-content-between flex-wrap">
                            <a href="#" id="open_pdf">View Guidelines Doc</a>
                            <a href="#" id="video1" target="blank">View Guidelines Video</a>
                        </div>
                    </div>

                </div>

                <div class="side-footer">
                ${IsView ? `` :
            `<button type="button" onclick="SaveOilULFMSStep1()" class="btn btn-lg actionbtn">Sample Is Ready</button>`}
                </div>
                <!-- End -->

            </div>
        </div>
    </div>
</div>`;


    closeView();

    // $('#unit').select2();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    // var data = tblData.find(input => input.Id == rowId);

    $('#dynamic_fms').html(OilULStep1);

    showDataOilULFMS(rowId, StepNo - 1);

}




function BindHTMLTableQualityParametersOil(docID, IsView) {

    var rowCount = $("#tblQCTestMapping tbody tr").length;
    if (rowCount > 0) {
        return false;
    }
    // Create a row element
    var row = $("<tr id='row_" + (rowCount + 1) + "'></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img onclick="AddRowQualityParameters();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameList(' + (rowCount + 1) + ');" id="ddlTestNameList' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameList' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultType' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnit' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRange' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMin' + (rowCount + 1) + '" placeholder="MIN" class="form-control" />' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMax' + (rowCount + 1) + '" placeholder="MAX" class="form-control" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtText' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" />' +
        '<input type="text" id="txtNumber' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" />' +
        '<input type="hidden" id="hddCategory' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSample' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProduction' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiological' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCID' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblQCTestMapping tbody").append(row);
    var $ele0 = $('#ddlTestNameList' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological != true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });
}



function AddRowQualityParameters(docID) {
    var rowCount = $("#tblQCTestMapping tbody tr").length;
    // Create a row element
    var row = $("<tr id='row_" + (rowCount + 1) + "'></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img style="width: 15px;" class="btnDelete" onclick="DeleteRowQualityParameters(' + (rowCount + 1) + ');" src="../../assets/images/icons/help/close.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameList(' + (rowCount + 1) + ');" id="ddlTestNameList' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameList' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultType' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnit' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRange' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" onkeydown="blockInvalidKeys(event)" id="txtApprovedMin' + (rowCount + 1) + '" placeholder="MIN" class="form-control" />' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" onkeydown="blockInvalidKeys(event)" id="txtApprovedMax' + (rowCount + 1) + '" placeholder="MAX" class="form-control" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtText' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" />' +
        '<input type="text" onkeydown="blockInvalidKeys(event)" id="txtNumber' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" />' +
        '<input type="hidden" id="hddCategory' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSample' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProduction' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiological' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCID' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblQCTestMapping tbody").append(row);
    var $ele0 = $('#ddlTestNameList' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological != true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });

    $('#ddlTestNameList' + (rowCount + 1) + '').select2();

}
function DeleteRowQualityParameters(rowId) {
    $('#tblQCTestMapping').on('click', '.btnDelete', function () {
        $(this).closest('tr').remove();
    });
}




function getOilLStep1(rowId, IsView, StepNo) {

    var disabled = IsView ? `disabled` : ``;
    let oilL1 =
        `<div class="modal fade drawer right-align" id="markdone" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2><img src="../../assets/images/icons/help/svg/back-white-arrow.svg" data-dismiss="modal" alt="" class="cursor-pointer">Step 1 - Arrange Sample</h2>
                <img src="../../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal" />
            </div>
            <div class="modal-body mb-100">
                <!-- open -->
                <div class="row">

                    <div class="col-sm-12 form-group">
                        <label for="state" class="mb-0">Required Quantity</label>
                        <div class="input-group">
                            <input type="text" id="reqQuantity" oninput="HideErrorMessage(this); SetZero(this)"  ${disabled} class="form-control Mandate1" placeholder="Enter">
                            <div class="input-group-append bg-bgl">
                                <span class="input-group-text w-60 d-flex align-self-centre d-flex justify-content-center">
                                    <select id="unit" class="form-control applyselect hidesearchselect" ${disabled}>
                                        <option value="ml">ml</option>
                                        <option value="gm">gm</option>
                                    </select>
                                </span>
                            </div>

                        </div>
                        <span id="spreqQuantity" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                    </div>



          

                    <div class="col-sm-12 form-group">
                        <label for="state" class="mb-0">Available Quantity</label>
                        <p class="m-0" id="avialquantity"></p> <enum id="uomhtml"></enum>
                        <input id="uom" type="hidden" value="" />
                    </div>



                    <div class="col-sm-12 form-group">
                        <div class="toggle-card bg-bgl">
                            <div class="toggle-card-header toggle-info">
                                <h4 class="toggle-card-title">Item Information</h4>
                                <span class="toggle-card-icon"><img src="../../assets/images/icons/help/arrow-down.png" class="icon-sm" alt=""></span>
                            </div>
                            <div class="toggle-containe toggle-info-content">
                                <div class="row">
                                    <div class="col-sm-12 form-group ">
                                        <label class="text-gray mb-0">Item Name</label>
                                        <p id="txtItem"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="formView">
                                        <label class="text-gray mb-0">Formulation Category</label>
                                        <p id="txtFormCate"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="fragView">
                                        <label class="text-gray mb-0">Fragrance</label>
                                        <p id="txtFragrance"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="colorView">
                                        <label class="text-gray mb-0">Colour</label>
                                        <p id="txtColour"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="packegingView">
                                        <label class="text-gray mb-0">Packaging Type</label>
                                        <p id="txtPackegingType"></p>
                                    </div>
                                    <div class="col-sm-12 form-group">
                                        <label class="text-gray mb-0">Target Price (₹)</label>
                                        <p id="txtTargetPrice"></p>
                                    </div>


                                    <div class="col-sm-12 form-group" id="viewReq">
                                        <label class="text-gray mb-0">Requirement/Description</label>
                                        <p id="requirements"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="viewMust">
                                        <label class="text-gray mb-0">Must have ingredients</label>
                                        <p id="mustIngredients"></p>
                                    </div>


                                    <div class="col-sm-12 form-group" id="viewMustNot">
                                        <label class="text-gray mb-0">Must not have ingredients</label>
                                        <p id="mustnotingredients"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="viewAtt1">
                                        <label class="text-gray mb-0">Attachment</label>
                                        <p><a href="" target="blank" id="item_att1"></a></p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>


                    <div class="col-sm-12 form-group">
                        <div class="d-flex gap-20 align-items-center justify-content-between flex-wrap">
                            <a href="#" id="open_pdf">View Guidelines Doc</a>
                            <a href="#" id="video" target="blank">View Guidelines Video</a>
                        </div>
                    </div>

                </div>

                <div class="side-footer">
                ${IsView ? `` :
            `<button type="button" onclick="SaveOilLFMSStep1()" class="btn btn-lg actionbtn">Sample Is Ready</button>`
        }
                </div>
                <!-- End -->

            </div>
        </div>
    </div>
</div>`;

    closeView();

    $('#unit').select2();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    // var data = tblData.find(input => input.Id == rowId);

    $('#dynamic_fms').html(oilL1);



    showDataOilLFMS(rowId, StepNo - 1, IsView);


}


function getOilLStep2(rowId, IsView, StepNo) {
    var OilL2 =
        `<div class="modal fade drawer right-align" id="markdone2" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2><img src="../../assets/images/icons/help/svg/back-white-arrow.svg" data-dismiss="modal" alt="" class="cursor-pointer">Step 2 - Enter Quality Details</h2>
                <img src="../../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal" />
            </div>
            <div class="modal-body mb-100">
                <!-- open -->
                <div class="row">

                    <div class="col-sm-4 form-group">
                        <label class="mb-0">Item Name</label>
                        <p id="item_Name2"></p>
                    </div>

                    <div class="col-sm-4 form-group">
                        <label class="mb-0">Item Code</label>
                        <p id="Item_Code2"></p>
                    </div>

                    <div class="col-sm-4 form-group">
                        <label class="mb-0">Vendor Name</label>
                        <p id="vendor_name2"></p>
                    </div>


                    <div class="col-sm-12 form-group">
                        <p>Please Select an AR number to continue</p>
                        <div class="table-responsive sticky-responsive">
                            <table class="display stickyth  dgntable graytable no-footer radius-0 dataTable itemsinformation" style="table-layout:fixed;">
                                <thead>
                                    <tr>
                                        <th width="20"></th>
                                        <th>AR Number</th>
                                        <th width="100">GRN Date</th>
                                        <th width="150">Available Quantity</th>
                                        <th width="50">Uom</th>
                                    </tr>
                                </thead>
                                <tbody id="tblARRNo">                                   
                                </tbody>
                            </table>
                        </div>

                    </div>

                    <div class="col-sm-12 form-group" id="viewPhValue" style="display: none;">
                        <div class="table-responsive sticky-responsive">
                            <table class="display stickyth  dgntable  no-footer radius-0 dataTable itemsinformation" style="table-layout:fixed;">
                                <thead>
                                    <tr>
                                        <th>Test Name</th>

                                        <th width="100">Result Type</th>
                                        <th width="100">Measuring Unit</th>

                                        <th width="100">Approved Range</th>
                                        <th width="100">Result Value</th>
                                    </tr>
                                </thead>
                                <tbody id="txtTablePhResult">
                                   


                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>

                <div class="side-footer">
                    <button type="button" class="btn btn-lg cancelbtn" data-dismiss="modal">CANCEL</button>
                    ${!IsView ?
            `<button type="button" class="btn btn-lg actionbtn" onclick="SaveOilLFMSStep2()">Submit</button>` :
            ``}
                </div>
                <!-- End -->

            </div>
        </div>
    </div>
</div>`;


    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    //   var data = tblData.find(input => input.Id == rowId);

    $('#dynamic_fms').html(OilL2);

    showDataOilLFMS(rowId, StepNo - 1, IsView);



}


function SaveOilLFMSStep2() {



    // var avaiQ = parseFloat($('#avialquantity').text()) || 0;

    if (!Step2_Id) {
        FailToaster('Please select atleast one AR Number !!!')
        return;
    }


    var arr = Arr_Table.find(input => input.GRNItemId == Step2_Id);

    var model = {
        ArnNo: arr.ARNUMBER,
        ApprovedQty: arr.ApprovedQty,
        FMSStep: 3,
        FMSType: 'OilL',
        Sample_Id: sample_id,
        AvailQ_Unit: arr.UOM,
        Type: 4
    }

    var jsonString = JSON.stringify(model);

    let GenericModeldata = {
        ScreenID: "Oil_Sample_101",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };


    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {

            $('#markdone2').modal('hide');
            bindDynamicAgGrid();
        }

    });

}



function showDataOilULFMS(Id, TaskNo) {

    var data;

    sample_id = Id;
    if (TaskNo == 1) {
        $('#markdone16').modal('show');

        data = tblData.find(input => input.Id == Id);

        $('#unit_req_ul').val(data.ReqQ_Unit).trigger('change');

        $('#txtReqQ_Ul').val(data.RequiredQ);

        $('#unit_avail_ul').val(data.AvailQ_Unit).trigger('change');

        $('#availReqQ_Ul').val(data.AvailableQ);

        showDataUL(Id);

        var t = 2;

        if (data.SD_FileURL.length <= 1) {
            $('#viewAtt' + t).hide()
        }
        else {



            $('#item_att' + t).attr('href', '#');
            $('#item_att' + t).on('click', function () {
                handleTaskItemFile(data.SD_FileURL, data.SD_ActualFileName)
            })

            $('#item_att' + t).html(data.SD_ActualFileName);
            $('#viewAtt' + t).show()
        }

        // FetchCurrentStock(data.Item_ID, data.Warehouse_Id);

    }
    if (TaskNo == 2) {


        data = tblData.find(input => input.Id == Id);

        $('#lbItemNameMapping').html(data.ItemName);
        $('#lblReqItem').html(data.Requirements);

        ShowQCMappingParam(Id);

        // ShowQCMappingRejected(data.Item_ID, )
    }

    else if (TaskNo == 3) {

        data = tblData.find(input => input.Id == Id);

        $('#un_item_name').html(data.ItemName);
        $('#un_desc').html(data.Requirements);


        ShowQCMappingInitiated(Id)


    }
    else if (TaskNo == 4) {

        data = tblData.find(input => input.Id == Id);

        window.location.href = `EnterDispatchSample?auth=${AuthToken}&id=${data.ERP_Sample_Id}&isUn=2`
    }


    else if (TaskNo == 5) {

        $('#last_step').html(5);

        isUn = 1;

        data = tblData.find(input => input.Id == Id);

        $('#markdone4').modal('show');
    }




}


function SaveOilULFMSStep1() {


    if (checkValidationOnSubmit('MandateUL')) {

        var avaiQ = parseFloat($('#availReqQ_Ul').val()) || 0;


        if ($('#txtReqQ_Ul').val() > avaiQ) {

            FailToaster('Required Quantity cannot be greater than available Quantity!!!');
            return;
        }

        else if ($('#unit_req_ul').val() == 'ml' && $('#txtReqQ_Ul').val() > 1000) {
            FailToaster('Required Quantity cannot be greater than 1000 ' + $('#unit').val() + '!!!');
            return;
        }

        else if ($('#unit_req_ul').val() == 'gm' && $('#txtReqQ_Ul').val() > 1000) {
            FailToaster('Required Quantity cannot be greater than 1000 ' + $('#unit').val() + '!!!');
            return;
        }

        var model = {
            ReqQ: $('#txtReqQ_Ul').val(),
            AvailQ: avaiQ,
            Unit: $('#unit_req_ul').val(),
            AvailQ_Unit: $('#unit_avail_ul').val(),
            FMSStep: 2,
            FMSType: 'OilUL',
            Sample_Id: sample_id,
            Type: 5,
        }

        var jsonString = JSON.stringify(model);

        let GenericModeldata = {
            ScreenID: "Oil_Sample_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                $('#markdone16').modal('hide');
                bindDynamicAgGrid();
            }

        });

    }

}


function showDataUL(id) {

    Edit_Id = id;

    var data = tblData.find(input => input.Id == id);
    if (!data) return;

    if (data.SampleType == 'Oil') {
        $('#fragView1').hide();
        $('#colorView1').hide();
        $('#packegingView1').hide();
        //$('#viewReq1').hide();
        $('#viewMust1').hide();
        $('#viewMustNot1').hide();
    }

    else {
        $('#fragView1').show();
        $('#colorView1').show();
        $('#packegingView1').show();
        // $('#viewReq1').show();
        $('#viewMust1').show();
        $('#viewMustNot1').show();
    }

    console.log(data.videolink);

    if (data.videolink != null && data.videolink.length >= 1) {
        $('#video1').attr('href', data.videolink);
        $('#video1').attr('target', '_blank');
    }
    else {
        $('#video1').removeAttr('target');

    }

    $('#open_pdf1').on('click', function () {

        handleTaskFile(data.FileURL, data.ActualFileName);
    })


    $('#txtChemist1').val(data.ChemistId > 0 ? data.ChemistId : 'Select').trigger('change');
    $('#ddlBaseItem1').val(data.BaseItem_Id > 0 ? data.BaseItem_Id : 'Select').trigger('change');
    $('#fragrance1').val(data.Fragrance == null ? '' : data.Fragrance);
    $('#color1').val(data.color == null ? '' : data.color);
    $('#activities1').val(data.Activities == null ? '' : data.Activities);
    $('#variantsno1').val(data.VariantsNo == null ? 0 : data.VariantsNo);
    data.IsNormal == 1 ? $('#normal1').prop('checked', true) : $('#normal1').prop('checked', false);
    data.IsUrgent == 1 ? $('#urgent1').prop('checked', true) : $('#urgent1').prop('checked', false);

    $('#txtItem1').text(data.ItemName || '');
    $('#txtFormCate1').text(data.FormulationCate || '');
    $('#txtFragrance1').text(data.SD_Fragrance || '');
    $('#txtColour1').text(data.SD_Color || '');
    $('#txtPackegingType1').text(data.PackegingType || '');
    $('#txtTargetPrice1').text(data.SD_TargetPrice !== null ? `₹ ${data.SD_TargetPrice}` : '');
    $('#requirements1').text(data.Requirements || '');
    $('#mustIngredients1').text(data.MustIngredients || '');
    $('#mustnotingredients1').text(data.MustNotIngredients || '');


}



function SaveQCCheckOil() {
    var data = collectTableDataOil();
    if (data === null) {
        FailToaster('Please select paramter for QC.');
        return;
    }

    var itemModel =
    {
        ID: 0,
        Sample_Id: oil_sample_id,
        QCTestMapping: QCTestMappingData,
        Type: 10
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(itemModel);

    var data = itemModel.QCTestMapping;

    const idSet = new Set();
    let hasDuplicates = false;

    for (const item of data) {
        if (idSet.has(item.Parameter_NameID)) {
            hasDuplicates = true;

            FailToaster(`Duplicate Parameters found in QC Check`);
            return; // Exit after first duplicate
        }

        idSet.add(item.Parameter_NameID);
    }
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "Oil_Samp_102",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString1
    };

    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        $("#qctestmapping").modal('hide');
        bindDynamicAgGrid();
    });




}




var Arr_Table;
function FetchArrNo(itemId, arrNo, IsView) {
    if (parseInt(itemId) > 0) {
        var model = {
            Item_Id: itemId,
            Type: 1
        };

        $('#tblARRNo').html('');

        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Oil_Sample_101' }, 'GET', function (response) {
            //  var tblItemStock = response.data.data.Table1;

            console.log(response);

            var table = response.data.data.Table;

            Arr_Table = [];

            Arr_Table = response.data.data.Table;

            if (table.length > 0) {
                $('#item_Name2').html(table[0].ITEM_NAME);
                $('#Item_Code2').html(table[0].ITEM_CODE);
                $('#vendor_name2').html(table[0].Supplier == null ? `` : table[0].Supplier);

                for (var i = 0; i < table.length; i++) {
                    let isChecked = "";
                    let isDisabled = "";

                    // if arrNo matches table[i].ARNUMBER
                    if (arrNo && arrNo == table[i].ARNUMBER) {
                        isChecked = "checked";

                        // trigger ShowPHValue immediately
                        ShowPHValue(table[i].GRNItemId, table[i].Item_Id);

                        // if IsView = true, also disable
                        if (IsView === true) {
                            isDisabled = "disabled";
                        }
                    }

                    var ele = `
                                <tr>
                                    <td>
                                        <input type="radio" id="${table[i].ARNUMBER}_${table[i].GRNItemId}" 
                                               onclick="ShowPHValue(${table[i].GRNItemId},${table[i].Item_Id})" 
                                               class="radio" name="status" value=""
                                               ${isChecked} ${isDisabled}>
                                        <label for="${table[i].ARNUMBER}_${table[i].GRNItemId}" class="d-initial m-0"></label>
                                    </td>
                                    <td>${table[i].ARNUMBER}</td>
                                    <td>${ChangeDateFormatToddMMYYYWithSlace(table[i].DOCDate)}</td>
                                    <td class="text-left">${table[i].ApprovedQty}</td>
                                    <td>${table[i].UOM}</td>
                                </tr>
                            `;

                    $('#tblARRNo').append(ele);
                }

                if (IsView) {
                    $('#tblARRNo input[type="radio"]').prop('disabled', true);
                }
            }



        });

        
    }
    else {
        FailToaster('Item Id missing !!!');
    }
}

var Step2_Id;

function ShowPHValue(grnItemId, ItemId) {

    Step2_Id = grnItemId;

    $('#txtTablePhResult').html('');

    ItemIdData = ItemId;
    GItemId = grnItemId;
    var model = {
        ID: ItemId,
        ParentId: 0,
        GRNItemId: GItemId,
        IsMicro: true,
        IsRejected: false
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "QCTask_2";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {


        var data1 = response.data.data.Table1;

        if (data1.length > 0) {

            $('#viewPhValue').show();

            for (var i = 0; i < data1.length; i++) {

                let res = '';

                if (data1[i].ResultType == 'Numeric' || data1[i].ResultType == 'Text') {

                    res = data1[i].ResultMin;
                }
                else {
                    res = data1[i].ResultMin + '-' + data1[i].ResultMax;
                }


                var ele = `<tr>
                                        <td>${data1[i].TestName}</td>
                                        <td>${data1[i].ResultType}</td>
                                        <td>${data1[i].MeasuringUnit}</td>
                                        <td class="text-left">${data1[i].ApprovedRange}</td> 
                                        <td>${res}</td>
                                    </tr>`;

                $('#txtTablePhResult').append(ele);
            }

        }
    });

}

function FetchCurrentStock(itemId, Warehouse_Id) {
    if (parseInt(itemId) > 0 && Warehouse_Id > 0) {
        var model = {
            FIN_ID: FinYearId,
            EXTRA_QUERY: 'AND ITEM.ITEM_ID NOT IN(0)',
            FDATE: ChangeDateFormatToYYYYMMDDWithSlash(finFromDate),
            TDATE: ChangeDateFormatToYYYYMMDDWithSlash(finToDate),
            ITEM_MOVE: 0,
            MIN_QTY: 0,
            METHOD: 'W',
            CHARGE: 'N',
            MINQTY: -9999999999,
            MAXQTY: 9999999999,
            ItemId: itemId,
            WarehouseId: Warehouse_Id
        };

        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'StockStmtRpt_101' }, 'GET', function (response) {
            var tblItemStock = response.data.data.Table1;

            var availQ_Unit;
            if (tblItemStock.length > 0) {
                availQ_Unit = response.data.data.Table1.length > 0 ? response.data.data.Table1[0].UNIT : '';
            }

            $('#avialquantity').text(tblItemStock?.length > 0 ? parseFloat(tblItemStock[0].CQty).toFixed(2) : '0');

            $('#uomhtml').html(availQ_Unit ? availQ_Unit : '');

            console.log(response);
        });
    }
    else {
        FailToaster('Item or warehouse missing!!!');
    }
}

function showDataOilLFMS(Id, TaskNo, IsView) {

    var data;

    sample_id = Id;
    if (TaskNo == 1) {
        $('#markdone').modal('show');

        data = tblData.find(input => input.Id == Id);



        showData(Id);

        FetchCurrentStock(data.Item_ID, data.Warehouse_Id);

        $('#reqQuantity').val(data.Req_Ol);

        $('#uomhtml').html(data.AvailU_Ol);

        $('#unit').val(data.ReqU_Ol).trigger('change');


        if (!data.SD_FileURL || (data.SD_FileURL && data.SD_FileURL.length <= 1)) {
            $('#viewAtt' + TaskNo).hide()
        }
        else {



            $('#item_att' + TaskNo).attr('href', '#');
            $('#item_att' + TaskNo).on('click', function () {
                handleTaskItemFile(data.SD_FileURL, data.SD_ActualFileName)
            })

            $('#item_att' + TaskNo).html(data.SD_ActualFileName);
            $('#viewAtt' + TaskNo).show()
        }



    }
    if (TaskNo == 2) {

        $('#markdone2').modal('show');

        data = tblData.find(input => input.Id == Id);
        data = tblData.find(input => input.Id == Id);

        FetchArrNo(data.Item_ID, data.ARRNo_OL, IsView);

        // ShowQCMappingRejected(data.Item_ID, )
    }
    else if (TaskNo == 3) {

        data = tblData.find(input => input.Id == Id);

        window.location.href = `EnterDispatchSample?auth=${AuthToken}&id=${data.ERP_Sample_Id}&&isUn=1`
    }



    else if (TaskNo == 4) {

        $('#last_step').html(4);

        data = tblData.find(input => input.Id == Id);

        $('#markdone4').modal('show');
    }


}


function SaveOilLFMSStep1() {


    if (checkValidationOnSubmit('Mandate1')) {

        var avaiQ = parseFloat($('#avialquantity').text()) || 0;


        if ($('#reqQuantity').val() > (avaiQ * 1000)) {

            FailToaster('Required Quantity cannot be greater than available Quantity!!!');
            return;
        }

        else if ($('#unit').val() == 'ml' && $('#reqQuantity').val() > 1000) {
            FailToaster('Required Quantity cannot be greater than 1000 ' + $('#unit').val() + '!!!');
            return;
        }

        else if ($('#unit').val() == 'gm' && $('#reqQuantity').val() > 1000) {
            FailToaster('Required Quantity cannot be greater than 1000 ' + $('#unit').val() + '!!!');
            return;
        }

        var model = {
            ReqQ: $('#reqQuantity').val(),
            AvailQ: avaiQ,
            Unit: $('#unit').val(),
            FMSStep: 2,
            FMSType: 'OilL',
            Sample_Id: sample_id,
            Type: 3,
        }

        var jsonString = JSON.stringify(model);

        let GenericModeldata = {
            ScreenID: "Oil_Sample_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                $('#markdone').modal('hide');
                bindDynamicAgGrid();
            }

        });

    }

}


function getSampleStep7(rowId, IsView, StepNo) {

    var samp7 =
        `<div class="modal" id="markdone8" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content ">
            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title text-left w-100">Step 5 - Enter Customer Feedback</h4>
                <button type="button" class="close" data-dismiss="modal"><img src="../../assets/images/icons/help/close-icon.png" class="closeicon"></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">

                <div class="row">


                    <div class="col-md-12 form-group">
                        <label>Enter Customer’s Feedback<sup>*</sup></label>
                        <textarea placeholder="Enter" disabled id="remarks8" oninput="HideErrorMessage(this)" class="form-control Mandatory8 h-150"></textarea>
                        <span id="spremarks8" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </div>



                </div>
            </div>

            <div class="modal-footer">
               
            </div>


        </div>
    </div>
</div>
`


    //// <button class="btn btn-lg btn-warning" onclick="SaveBasicInfo8(2)">Reject</button>
    //// <button class="btn btn-lg actionbtn" onclick="SaveBasicInfo8(1)">Approve</button>
    //// <button onclick="SaveModifyBasicInfo8()" class="btn btn-lg actionbtn">Submit and Modify</button>

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    var data = tblData.find(input => input.Id == rowId);



    $('#dynamic_fms').html(samp7);

    if (StepNo == 9) {
        $('#markdone8 .modal-title').html('Step 7 - Enter Customer Feedback');

    }
    else if (StepNo == 6) {
        $('#markdone8 .modal-title').html('Step 5 - Enter Customer Feedback');

    }
    else if (StepNo == 5) {
        $('#markdone8 .modal-title').html('Step 4 - Enter Customer Feedback');

    }

    $('#remarks8').val(data.Step8_Remarks);

    $('#markdone8').modal('show');


}
function blockInvalidKeys(e) {
    if (["e", "E", ".", "-"].includes(e.key)) {
        e.preventDefault();
    }
}


function getSampleStep6(rowId, IsView, StepNo, FMSType) {

    localStorage.setItem('IsView', IsView);
    localStorage.setItem('IsPC', 1);

    if (IsView) {
        if (FMSType == 2) {
            window.location.href = `EnterDispatchSample?auth=${AuthToken}&id=${rowId}&isUn=1&isDispatched=1`
        }
        else if (FMSType == 3) {
            window.location.href = `EnterDispatchSample?auth=${AuthToken}&id=${rowId}&isUn=2&isDispatched=1`
        }
        else {
            window.location.href = `EnterDispatchSample?auth=${AuthToken}&id=${rowId}&isDispatched=1`
        }

    }
    else {
        if (FMSType == 2) {
            window.location.href = `EnterDispatchSample?auth=${AuthToken}&id=${rowId}&isUn=1&isDispatched=0`
        }
        else if (FMSType == 3) {
            window.location.href = `EnterDispatchSample?auth=${AuthToken}&id=${rowId}&isUn=2&isDispatched=0`
        }
        else {
            window.location.href = `EnterDispatchSample?auth=${AuthToken}&id=${rowId}&isDispatched=0`
        }
    }
}

function getSampleStep5(sample_id, IsView, StepNo) {

    var samp5 =
        `<div class="modal fade drawer right-align" id="markdone6" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2><img src="../../assets/images/icons/help/svg/back-white-arrow.svg" data-dismiss="modal" alt="" class="cursor-pointer">Step 5 - Enter Sample ingredient list</h2>
                <img src="../../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal" />
            </div>
            <div class="modal-body mb-100">
                <!-- open -->
                <div class="row">

                    <div class="col-md-12 form-group">
                        <label>
                            Please Enter sample ingredients to be printed on the
                            product label
                        </label>
                        <textarea placeholder="Enter" id="remarks6" ${IsView ? `disabled` : ``} oninput="HideErrorMessage(this)" class="form-control Mandatory6 h-150"></textarea>
                        <span id="spremarks6" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </div>

                    <div class="col-sm-12 form-group mt-3 mb-4">
                        <label class="text-gray mb-0">Chemist Name</label>
                        <p id="Chemist6"></p>
                    </div>


                    <div class="col-sm-12 form-group mt-3 mb-4">
                        <label class="text-gray mb-0">Ingredients from BOM                        </label>
                        <p id="bomIngedients"></p>
                    </div>


                    <div class="col-sm-12 form-group">
                        <div class="toggle-card bg-bgl">
                            <div class="toggle-card-header toggle-info">
                                <h4 class="toggle-card-title">Item Information</h4>
                                <span class="toggle-card-icon"><img src="../../assets/images/icons/help/arrow-down.png" class="icon-sm" alt=""></span>
                            </div>
                            <div class="toggle-containe toggle-info-content">
                                <div class="row">
                                    <div class="col-sm-12 form-group">
                                        <label class="text-gray mb-0">Item Name</label>
                                        <p id="txtItem6"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="formView6">
                                        <label class="text-gray mb-0">Formulation Category</label>
                                        <p id="txtFormCate6"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="fragView6">
                                        <label class="text-gray mb-0">Fragrance</label>
                                        <p id="txtFragrance6"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="colorView6">
                                        <label class="text-gray mb-0">Colour</label>
                                        <p id="txtColour6"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="packegingView6">
                                        <label class="text-gray mb-0">Packaging Type</label>
                                        <p id="txtPackegingType6"></p>
                                    </div>
                                    <div class="col-sm-12 form-group">
                                        <label class="text-gray mb-0">Target Price (₹)</label>
                                        <p id="txtTargetPrice6"></p>
                                    </div>


                                    <div class="col-sm-12 form-group" id="viewReq6">
                                        <label class="text-gray mb-0">Requirement/Description	</label>
                                        <p id="requirements6"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="viewMust6">
                                        <label class="text-gray mb-0">Must have ingredients</label>
                                        <p id="mustIngredients6"></p>
                                    </div>


                                    <div class="col-sm-12 form-group" id="viewMustNot6">
                                        <label class="text-gray mb-0">Must not have ingredients</label>
                                        <p id="mustnotingredients6"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="viewAtt6">
                                        <label class="text-gray mb-0">Attachment</label>
                                        <p><a href="" target="blank" id="item_att6"></a></p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="col-sm-12 form-group">
                        <div class="d-flex justify-content-between align-items-center flex-wrap">
                            <a href="#" id="open_pdf6">View Guidelines / S.O.P</a>
                            <a href="#" id="video6" target="blank">View Guidelines Video</a>

                        </div>
                    </div>
                </div>

                <div class="side-footer">

                ${!IsView ?
            `<button type="button" class="btn btn-lg actionbtn" onclick="SaveSamp6Info()">Submit</button>` : ``}
                </div>
                <!-- End -->

            </div>
        </div>
    </div>
</div>`


    closeView();

    $('#view_dynamic_fms').html('');

    // $('#dynamic_fms').html('');

    $('#dynamic_fms').html(samp5);


    showData234(sample_id, StepNo - 1);


}

function getSampleStep4(rowId, IsView, StepNo) {

    var obj = tblData.find(input => input.Id == rowId);

    StoreChemistName(obj.Chemist, obj.SampleType, obj.bom_id, IsView);

    window.location.href = `EnterFormulationForSample?auth=${AuthToken}&id=${rowId}`;
}


function StoreChemistName(chemist_name, samp_type, bom_id, IsView) {
    localStorage.setItem('IsPC', 1);
    localStorage.setItem("chemist", chemist_name);
    localStorage.setItem("sample_type", samp_type);
    localStorage.setItem("IsView", IsView)

    if (bom_id != null) {

        localStorage.setItem("IsBOM_ID", true);
    }
    else {
        localStorage.setItem("IsBOM_ID", false);
    }
}


function closeStep1(id) {
    // hide via Bootstrap modal API, then remove from DOM when hidden
    console.log("yash");
    const $m = $('#' + id);
    if ($m.length && typeof $m.modal === 'function') {
        $m.modal('hide');
        $m.on('hidden.bs.modal', function () {
            // cleanup to avoid duplicates/backdrop issues
            $m.remove();
        });
    } else {
        // fallback if modal plugin not available
        $m.hide().remove();
    }
}
function getSampleStep1(sample_id, isView) {

    //$('#view_dynamic_fms').html('');

    var samp1 =
        `<div class="modal fade drawer right-align" id="markdone" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2><img src="../../assets/images/icons/help/svg/back-white-arrow.svg"  alt="" class="cursor-pointer" onclick="closeStep1('markdone')">Step 1 - Enter Basic Information</h2>
                <img src="../../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close"  onclick="closeStep1('markdone')" />
            </div>
            <div class="modal-body mb-100">
                <!-- open -->
                <div class="row">

                    <div class="col-sm-12 form-group">
                        <label for="state" class="mb-0">Chemist Name <sup>*</sup></label>
                        <select class="form-control applyselect Mandatory" id="txtChemist" ${isView ? `disabled` : ``} name="">
                        </select>
                        <span id="sptxtChemist" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </div>
                    <div class="col-sm-12 form-group">
                        <label for="locationcode">Base ID</label>
                        <select class="form-control applyselect"  ${isView ? `disabled` : ``} id="ddlBaseItem">
                        </select>
                    </div>
                    <div class="col-sm-12 form-group">
                        <label for="locationname">Fragrance</label>
                        <input type="text" placeholder="Enter Name" id="fragrance"  ${isView ? `disabled` : ``} class="form-control " value="">
                    </div>
                    <div class="col-sm-12 form-group">
                        <label for="address">Color</label>
                        <textarea class="form-control" id="color"  ${isView ? `disabled` : ``} placeholder="Enter "></textarea>
                    </div>
                    <div class="col-sm-12 form-group">
                        <label for="city">Actives</label>
                        <input type="text" placeholder="Enter"  ${isView ? `disabled` : ``} id="activities" class="form-control " value="">
                    </div>

                    <div class="col-sm-12 form-group">
                        <label for="city">Number of Variants</label>
                        <input type="number" placeholder="0" onkeydown="blockInvalidKeys(event)"  ${isView ? `disabled` : ``} oninput="SetZero(this)" id="variantsno" class="form-control " value="">
                    </div>

                    <div class="col-sm-12 form-group">
                        <label for="pinecode">Basic Information</label>
                        <div class="d-flex flex-wrap gap-50 mt-2">
                            <input type="radio" id="normal" class="radio openModal" name="radio-group"  ${isView ? `disabled` : ``}>
                            <label for="normal">Normal</label>
                            <input type="radio" id="urgent" class="radio" name="radio-group"  ${isView ? `disabled` : ``}>
                            <label for="urgent">Urgent</label>
                        </div>
                    </div>

                    <div class="col-sm-12 form-group">
                        <div class="toggle-card bg-bgl">
                            <div class="toggle-card-header toggle-info">
                                <h4 class="toggle-card-title">Item Information</h4>
                                <span class="toggle-card-icon"><img src="../../assets/images/icons/help/arrow-down.png" class="icon-sm" alt=""></span>
                            </div>
                            <div class="toggle-containe toggle-info-content">
                                <div class="row">
                                    <div class="col-sm-12 form-group ">
                                        <label class="text-gray mb-0">Item Name</label>
                                        <p id="txtItem"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="formView">
                                        <label class="text-gray mb-0">Formulation Category</label>
                                        <p id="txtFormCate"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="fragView">
                                        <label class="text-gray mb-0">Fragrance</label>
                                        <p id="txtFragrance"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="colorView">
                                        <label class="text-gray mb-0">Colour</label>
                                        <p id="txtColour"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="packegingView">
                                        <label class="text-gray mb-0">Packaging Type</label>
                                        <p id="txtPackegingType"></p>
                                    </div>
                                    <div class="col-sm-12 form-group">
                                        <label class="text-gray mb-0">Target Price (₹)</label>
                                        <p id="txtTargetPrice"></p>
                                    </div>


                                    <div class="col-sm-12 form-group" id="viewReq">
                                        <label class="text-gray mb-0">Requirement/Description</label>
                                        <p id="requirements"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="viewMust">
                                        <label class="text-gray mb-0">Must have ingredients</label>
                                        <p id="mustIngredients"></p>
                                    </div>


                                    <div class="col-sm-12 form-group" id="viewMustNot">
                                        <label class="text-gray mb-0">Must not have ingredients</label>
                                        <p id="mustnotingredients"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="viewAtt1">
                                        <label class="text-gray mb-0">Attachment</label>
                                        <p><a href="" target="blank" id="item_att1"></a></p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="col-sm-12 form-group">
                        <div class="d-flex gap-20 align-items-center flex-wrap">
                            <a href="#" id="open_pdf">View Guidelines / S.O.P</a>
                            <a href="#" id="video" target="blank">View Guidelines Video</a>
                        </div>
                    </div>

                </div>

                <div class="side-footer">
                ${!isView ?
            `<button type="button" onclick="SaveBasicInfo()" class="btn btn-lg actionbtn">Submit</button>` : ``
        }
                </div>
                <!-- End -->

            </div>
        </div>
    </div>
</div>
`

    closeView();

    $('#view_dynamic_fms').html('');

    // $('#dynamic_fms').html('');

    $('#dynamic_fms').html(samp1);





    showData(sample_id);



    // $('#markdone').modal('show');
}




function getSampleStep2(sample_id, isView, StepNo) {

    //$('#view_dynamic_fms').html('');

    var samp2 =
        `

<div class="modal fade drawer right-align" id="markdonesecond" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2><img src="../../assets/images/icons/help/svg/back-white-arrow.svg"  alt="" class="cursor-pointer" onclick="closeStep1('markdonesecond')">Step 2 - Sample Production</h2>
                <img src="../../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close"  onclick="closeStep1('markdonesecond')"/>
            </div>
            <div class="modal-body mb-100">
                <!-- open -->
                <div class="row">

                    <div class="col-sm-12 form-group">
                        <p>Please confirm that sample has been processed and handed over to quality person</p>
                    </div>

                    <div class="col-sm-12 form-group mt-2 mb-4">
                        <label class="text-gray mb-0">Chemist Name</label>
                        <p id="Chemist2"></p>
                    </div>


                    <div class="col-sm-12 form-group">
                        <div class="toggle-card bg-bgl">
                            <div class="toggle-card-header toggle-info">
                                <h4 class="toggle-card-title">Item Information</h4>
                                <span class="toggle-card-icon"><img src="../../assets/images/icons/help/arrow-down.png" class="icon-sm" alt=""></span>
                            </div>
                            <div class="toggle-containe toggle-info-content">
                                <div class="row">
                                    <div class="col-sm-12 form-group ">
                                        <label class="text-gray mb-0">Item Name</label>
                                        <p id="txtItem2"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="formView2">
                                        <label class="text-gray mb-0">Formulation Category</label>
                                        <p id="txtFormCate2"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="fragView2">
                                        <label class="text-gray mb-0">Fragrance</label>
                                        <p id="txtFragrance2"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="colorView2">
                                        <label class="text-gray mb-0">Colour</label>
                                        <p id="txtColour2"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="packegingView2">
                                        <label class="text-gray mb-0">Packaging Type</label>
                                        <p id="txtPackegingType2"></p>
                                    </div>
                                    <div class="col-sm-12 form-group">
                                        <label class="text-gray mb-0">Target Price (₹)</label>
                                        <p id="txtTargetPrice2"></p>
                                    </div>


                                    <div class="col-sm-12 form-group" id="viewReq2">
                                        <label class="text-gray mb-0">Requirement/Description	</label>
                                        <p id="requirements2"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="viewMust2">
                                        <label class="text-gray mb-0">Must have ingredients</label>
                                        <p id="mustIngredients2"></p>
                                    </div>


                                    <div class="col-sm-12 form-group" id="viewMustNot2">
                                        <label class="text-gray mb-0">Must not have ingredients</label>
                                        <p id="mustnotingredients2"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="viewAtt2">
                                        <label class="text-gray mb-0">Attachment</label>
                                        <p><a href="" target="blank" id="item_att2"></a></p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="col-sm-12 form-group">
                        <div class="d-flex gap-20 align-items-center flex-wrap">
                            <a href="#" id="open_pdf2">View Guidelines / S.O.P</a>
                            <a href="#" id="video2" target="blank">View Guidelines Video</a>
                        </div>
                    </div>
                </div>

                <div class="side-footer">
                    ${!isView ?
            `<button type="button" class="btn btn-lg actionbtn" onclick="SaveBasicInfo234(1)">Confirm</button>`
            : ``}
                </div>
                <!-- End -->

            </div>
        </div>
    </div>
</div>

`
    closeView();

    $('#view_dynamic_fms').html('');

    // $('#dynamic_fms').html('');

    $('#dynamic_fms').html(samp2);





    //showData(sample_id);

    showData234(sample_id, StepNo - 1);


    // $('#markdone').modal('show');
}




function getSampleStep3(sample_id, isView, StepNo) {

    //$('#view_dynamic_fms').html('');

    var samp2 =
        `

<div class="modal fade drawer right-align" id="markdone3" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2><img src="../../assets/images/icons/help/svg/back-white-arrow.svg" data-dismiss="modal" alt="" class="cursor-pointer">Step 3 - Quality Check</h2>
                <img src="../../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal" />
            </div>
            <div class="modal-body mb-100">
                <!-- open -->
                <div class="row">

                    <div class="col-sm-12 form-group">
                        <p>Please confirm that you have checked all physical parameters of the sample as per client requirements. QC Checklist Verified:</p>
                        <ul class="deault-ul" id="qc_params">
                        </ul>
                    </div>

                    <div class="col-sm-12 form-group mt-3 mb-4">
                        <label class="text-gray mb-0">Chemist Name</label>
                        <p id="Chemist3"></p>
                    </div>


                    <div class="col-sm-12 form-group">
                        <div class="toggle-card bg-bgl">
                            <div class="toggle-card-header toggle-info">
                                <h4 class="toggle-card-title">Item Information</h4>
                                <span class="toggle-card-icon"><img src="../../assets/images/icons/help/arrow-down.png" class="icon-sm" alt=""></span>
                            </div>
                            <div class="toggle-containe toggle-info-content">
                                <div class="row">
                                    <div class="col-sm-12 form-group ">
                                        <label class="text-gray mb-0">Item Name</label>
                                        <p id="txtItem3"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="formView3">
                                        <label class="text-gray mb-0">Formulation Category</label>
                                        <p id="txtFormCate3"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="fragView3">
                                        <label class="text-gray mb-0">Fragrance</label>
                                        <p id="txtFragrance3"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="colorView3">
                                        <label class="text-gray mb-0">Colour</label>
                                        <p id="txtColour3"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="packegingView3">
                                        <label class="text-gray mb-0">Packaging Type</label>
                                        <p id="txtPackegingType3"></p>
                                    </div>
                                    <div class="col-sm-12 form-group">
                                        <label class="text-gray mb-0">Target Price (₹)</label>
                                        <p id="txtTargetPrice3"></p>
                                    </div>


                                    <div class="col-sm-12 form-group" id="viewReq3">
                                        <label class="text-gray mb-0">Requirement/Description	</label>
                                        <p id="requirements3"></p>
                                    </div>

                                    <div class="col-sm-12 form-group" id="viewMust3">
                                        <label class="text-gray mb-0">Must have ingredients</label>
                                        <p id="mustIngredients3"></p>
                                    </div>


                                    <div class="col-sm-12 form-group" id="viewMustNot3">
                                        <label class="text-gray mb-0">Must not have ingredients</label>
                                        <p id="mustnotingredients3"></p>
                                    </div>



                                    <div class="col-sm-12 form-group" id="viewAtt3">
                                        <label class="text-gray mb-0">Attachment</label>
                                        <p><a href="" target="blank" id="item_att3"></a></p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="col-sm-12 form-group">
                        <div class="d-flex gap-20 align-items-center flex-wrap">
                            <a href="#" id="open_pdf3" onclick="handleOnClickTaskFile()">View Guidelines / S.O.P</a>
                            <a href="#" id="video3" target="blank">View Guidelines Video</a>
                        </div>
                    </div>
                </div>

                <div class="side-footer">
                ${isView ? `` :
            `<button type="button" onclick="SaveBasicInfo234(0)" class="btn btn-lg btn-warning" >Reject</button> <button type="button" class="btn btn-lg btn-success" onclick="SaveBasicInfo234(1)">Approve</button>`
        }
                </div>
                <!-- End -->

            </div>
        </div>
    </div>
</div>

`
    closeView();

    $('#view_dynamic_fms').html('');

    // $('#dynamic_fms').html('');

    $('#dynamic_fms').html(samp2);





    //showData(sample_id);

    showData234(sample_id, StepNo - 1);


    // $('#markdone').modal('show');
}



async function showData234(id, TaskNo) {

    Edit_Id = id;

    var data = tblData.find(input => input.Id == id);
    if (!data) return;

    FileUrl = data.FileURL;
    ActualFileName = data.ActualFileName;

    $('#open_pdf2').on('click', function () {

        handleTaskFile(data.FileURL, data.ActualFileName);
    })



    //$('#open_pdf3').on('click', function () {

    //    handleTaskFile(data.FileURL, data.ActualFileName);
    //})

    //$('#open_pdf4').on('click', function () {

    //    handleTaskFile(data.FileURL, data.ActualFileName);
    //})
    $('#open_pdf6').on('click', function () {

        handleTaskFile(data.FileURL, data.ActualFileName);
    })


    sample_Type = data.SampleType;

    Type = TaskNo == 2 ? 'SAMP2PC' : TaskNo == 3 ? 'SAMP3PC' : 'SAMP4PC';

    if (TaskNo == 5) {
        TaskNo += 1;
    }


    if (data.SampleType == 'Oil') {
        $('#fragView' + TaskNo).hide();
        $('#colorView' + TaskNo).hide();
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


    if (!data.FileURL && (data.FileURL && data.FileURL.length <= 1)) {
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
        $('#markdonesecond').modal('show');
    }
    else if (TaskNo == 3) {
        $('#markdone3').modal('show');
    }
    else if (TaskNo == 4) {
        $('#markdone4').modal('show');
    }
    else if (TaskNo == 6) {
        $('#remarks6').val(data.Step6_remarks);
        $('#bomIngedients').html(data.BomIngredients);
        $('#markdone6').modal('show');


    }


}

//#region : QC dashboard

function getQcAllStepsEdit(rowId, StepNo, fms_id) {
    if (StepNo == 2) {
        getQcStep1(rowId, false);
    }
    else if (StepNo == 3) {
        getQcStep2(rowId, false);
    }
    else if (StepNo == 4) {
        getQcStep3(rowId, false);
    }
}
function getQcAllStepsView(rowId, StepNo, fms_id) {
    if (StepNo == 2) {
        getQcStep1(rowId, true);
    }
    else if (StepNo == 3) {
        getQcStep2(rowId, true);
    }
    else if (StepNo == 4) {
        getQcStep3(rowId, true);
    }
}

var ItemIdData = 0;
var grnItemID = 0;

function getQcStep1(grnItem_Id, isView) {

    var qc1 =
        `<div class="modal fade drawer right-align" id="qctestmapping">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2 class="modal-title">Add QC Test Mapping</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal" />
            </div>
            <div class="modal-body mb-100">
                <!-- open -->

                <div class="row">
                   <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">Item Name</label>
                        <p id="lbItemNameMapping"></p>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">
                            Item Code
                        </label>
                        <p id="lbItemCodeMapping"></p>
                    </div>

                    <div class="col-sm-12 form-group">
                        <p class="mb-2">Please Select the Quality Parameters needed for the QC Check of this item. </p>
                        <div class="table-responsive sticky-responsive">
                            <table id="tblQCTestMapping" class="display stickyth  dgntable no-footer radius-0 dataTable itemsinformation" style="table-layout:fixed;">
                                <thead>
                                    <tr>
                                        <th width="20"></th>
                                        <th width="150">Test Name</th>
                                        <th width="100">Result Type</th>
                                        <th width="60">Measuring <span class="d-block">Unit</span></th>
                                        <th width="100">Approved Range</th>
                                    </tr>
                                </thead>
                                <tbody id="tblQcCheckBody">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-sm-12 form-group">
                        <label>Is Microbiology test required</label>
                        <p class="p-0">
                            <label class="pure-material-switch ">
                                <input id="isMandatory" type="checkbox" onchange="OnChangeCheckBox(this)" ${isView ? `disabled` : ``} >
                                <span class="m-0"></span>
                            </label>
                        </p>
                    </div>
                    <div id="divMicrobiologyTests" class="col-sm-12 form-group" style="display:none">
                        <p class="mb-2">Please Select the Microbiology Tests needed for the QC Check of this item.</p>
                        <div class="table-responsive sticky-responsive">
                            <table id="tblMicrobiologyTests" class="display stickyth dgntable no-footer radius-0 dataTable itemsinformation" style="table-layout:fixed;">
                                <thead>
                                    <tr>
                                        <th width="20"></th>
                                        <th width="150">Test Name</th>
                                        <th width="100">Result Type</th>
                                        <th width="60">Measuring <span class="d-block">Unit</span></th>
                                        <th width="100">Approved Range</th>

                                    </tr>
                                </thead>
                                <tbody id="tblMicroMappingBody">
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="col-md-4 form-group" style="display:none">
                        <label>No. of Containers</label>
                        <input type="text" id="txtNoOfContainers" placeholder="Enter" class="form-control" />
                    </div>
                </div>
            </div>
           <div class="side-footer">
                ${!isView ?
            ` <button type="button" class="btn btn-lg  cancelbtn" data-dismiss="modal">Cancel</button>
                <button type="button" onclick="SaveQCCheck();" class="btn btn-lg actionbtn">Submit</button>` : ``
        }
                </div>
        </div>
    </div>
</div>
`

    closeView();

    $('#view_dynamic_fms').html('');

    // $('#dynamic_fms').html('');

    $('#dynamic_fms').html(qc1);

    // console.log(tblData);

    let obj = tblData.find(input => input.GRNItemId == grnItem_Id)

    ShowQCMappingParam(obj.ITEM_ID, grnItem_Id, isView);
}
let existingeditQCTestData = [];

function ShowQCMappingParam(itemId, GRNItemId, isView) {
    ItemIdData = itemId;
    grnItemID = GRNItemId;
    var model = {
        ID: itemId,
        ParentId: 0
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "QC_Test_Name";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        testNameArray = response.data.data.Table;
        //$("#tblQCTestMapping tbody").empty();
        //$("#tblMicrobiologyTests tbody").empty();
        $("#lbItemNameMapping").text(response.data.data.Table2[0].ITEM_NAME);
        $("#lbItemCodeMapping").text(response.data.data.Table2[0].ITEM_CODE);

        if (response.data.data.Table1.length > 0) {
            var editQCTestData = response.data.data.Table1;
            existingeditQCTestData = editQCTestData;
            BindTableQCTest(editQCTestData, isView);
        }
        else {
            // Empty the table body first
            $('#tblQcCheckBody').html('');
            $('#tblMicroMappingBody').html('');

            BindHTMLTableQualityParameters(0);
            BindHTMLTableMicrobiologyTests(0)
            document.getElementById('isMandatory').checked = false;
            document.getElementById('divMicrobiologyTests').style.display = 'none';
        }
    });

    $("#qctestmapping").modal('show');
}
function DeleteRowMicrobiologyTests() {
    $('#tblMicrobiologyTests').on('click', '.btnDelete', function () {
        $(this).closest('tr').remove();
    });
}
function BindTableQCTest(documents, isView) {
    const isMicrobiologicalArray = documents.filter(item => item.IsMicrobiological === true);
    const withoutMicrobiologicalArray = documents.filter(item => item.IsMicrobiological === false);
    // Empty the table body first
    $("#tblQCTestMapping tbody").empty();
    $("#tblMicrobiologyTests tbody").empty();
    var docID = "0";
    // Iterate over your data
    $.each(withoutMicrobiologicalArray, function (index, doc) {
        // Create a row element
        //if (doc.IsMicrobiological == false) {
        document.getElementById('isMandatory').checked = false;
        document.getElementById('divMicrobiologyTests').style.display = 'none';
        var row = $("<tr></tr>");
        // Create table cells
        // Column 1: Serial number and a hidden input for document id
        //var colNameAddRow = $('<td class="text-center">' +
        //    '<div class="cursor-pointer"><img onclick="BindHTMLTableQualityParameters();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
        //    '</td>');
        var colNameAddRow = "";
        if (index + 1 == 1) {
            colNameAddRow = $('<td class="text-center">' +
                //'<div class="cursor-pointer"><img  onclick="BindHTMLTableQualityParameters();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
                //'</td>');
                '<div class="cursor-pointer"><img  onclick="AddRowQualityParameters();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
                '</td>');
        }
        else {
            colNameAddRow = $('<td class="text-center">' +
                '<div class="cursor-pointer"><img style="width: 15px;" class="btnDelete" onclick="DeleteRowQualityParameters();" src="../../assets/images/icons/help/close.svg" class="w-15" alt=""></div>' +
                '</td>');
        }
        // Column 2: Period Ind. (dropdown)
        var colTestName = $(`
        <td>
            <select onchange="HideErrorMessage(this);ChangeTestNameList(${index + 1});"
                    id="ddlTestNameList${index + 1}"
                    class="form-control applyselect MandatoryEditDoc"
                    ${isView ? 'disabled' : ''}></select>
            <span id="spddlTestNameList${index + 1}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
        </td>
    `);

        // Column 3: Period Ind. (dropdown)
        var colNameResultType = $('<td "><span id="spResultType' + (index + 1) + '"></span>' +
            '</td>');
        // Column 4: Period Ind. (dropdown)
        var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnit' + (index + 1) + '"></span>' +
            '</td>');
        var colApprovedRange = $(`
        <td>
            <div id="divRange${index + 1}" class="moldcount hide">
                <div class="d-flex gap-10">
                    <div class="w-100">
                        <input type="text" id="txtApprovedMin${index + 1}" placeholder="MIN" class="form-control" ${isView ? 'disabled' : ''} />
                    </div>
                    <div class="w-100">
                        <input type="text" id="txtApprovedMax${index + 1}" placeholder="MAX" class="form-control" ${isView ? 'disabled' : ''} />
                    </div>
                </div>
            </div>
            <input type="text" id="txtText${index + 1}"  placeholder="Enter" class="form-control color hide" ${isView ? 'disabled' : ''} />
            <input type="text" id="txtNumber${index + 1}" placeholder="0" class="form-control density hide" ${isView ? 'disabled' : ''} />
            <input type="hidden" id="hddCategory${index + 1}" />
            <input type="hidden" id="hddIsSample${index + 1}" />
            <input type="hidden" id="hddIsProduction${index + 1}" />
            <input type="hidden" id="hddIsInvard${index + 1}" />
            <input type="hidden" id="hddIsOutWard${index + 1}" />
            <input type="hidden" id="hddIsMicrobiological${index + 1}" />
            <input type="hidden" id="hddQCID${index + 1}" />
        </td>
    `);


        row.append(colNameAddRow)
            .append(colTestName)
            .append(colNameResultType)
            .append(colNameMeasuringUnit)
            .append(colApprovedRange);

        // Finally, append the row to the table body 
        $("#tblQCTestMapping tbody").append(row);
        var $ele0 = $('#ddlTestNameList' + (index + 1) + '');
        $ele0.empty();
        $ele0.append($('<option/>').val('').text('Select'));
        $.each(testNameArray, function (ii, vall) {
            if (vall.isMicrobiological != true) {
                var $option = $('<option />')
                    .val(vall.ID)
                    .text(vall.ValueName)
                    .attr('data-code', vall.ValueCode);
                //if (vall.ID == "1") {
                //    $option.attr("selected", "selected");
                //}
                $ele0.append($option);
            }
        });

        $('#ddlTestNameList' + (index + 1)).val(doc.Parameter_NameID);//.trigger('change');
        if (doc.Parameter_Type == 1) {
            document.getElementById('spResultType' + (index + 1)).innerText = 'Numeric';
            $('#txtNumber' + (index + 1) + '').val(doc.Numeric_Value);

            $('#txtNumber' + (index + 1) + '').show();
            $('#txtText' + (index + 1) + '').hide();
            $('#divRange' + (index + 1) + '').hide();
            /*document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.Numeric_Value;*/
        }
        if (doc.Parameter_Type == 2) {
            document.getElementById('spResultType' + (index + 1)).innerText = 'Text';
            $('#txtNumber' + (index + 1) + '').hide();
            $('#txtText' + (index + 1) + '').show();
            $('#divRange' + (index + 1) + '').hide();

            $('#txtText' + (index + 1) + '').val(doc.Text_Value);
            /*  document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.Text_Value;*/
        }
        if (doc.Parameter_Type == 3) {
            document.getElementById('spResultType' + (index + 1)).innerText = 'Range';
            $('#txtNumber' + (index + 1) + '').hide();
            $('#txtText' + (index + 1) + '').hide();
            $('#divRange' + (index + 1) + '').show();

            $('#txtApprovedMin' + (index + 1) + '').val(doc.Range_Min);
            $('#txtApprovedMax' + (index + 1) + '').val(doc.Range_Max);
            //document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.Range_Min + '-' + doc.Range_Max;//
        }
        document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.MeasuringUnit;
        //$('#txtNumber' + (index + 1)).val(doc.Numeric_Value);
        $('#hddCategory' + (index + 1)).val(doc.Category);
        $('#hddIsSample' + (index + 1)).val(doc.IsSample);
        $('#hddIsProduction' + (index + 1)).val(doc.IsProduction);
        $('#hddIsInvard' + (index + 1)).val(doc.IsInvard);
        $('#hddIsOutWard' + (index + 1)).val(doc.IsOutWard);
        $('#hddIsMicrobiological' + (index + 1)).val(doc.IsMicrobiological);
        $('#hddQCID' + (index + 1)).val(doc.QCID);
        //}
    });
    $.each(isMicrobiologicalArray, function (index, doc) {
        //if (doc.IsMicrobiological == true) {
        document.getElementById('isMandatory').checked = true;
        document.getElementById('divMicrobiologyTests').style.display = 'block';
        // Create a row element
        var row = $("<tr></tr>");

        // Create table cells
        // Column 1: Serial number and a hidden input for document id
        var colNameAddRow = "";
        if (index + 1 == 1) {
            colNameAddRow = $('<td class="text-center">' +
                //'<div class="cursor-pointer"><img onclick="BindHTMLTableMicrobiologyTests();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
                //'</td>');

                '<div class="cursor-pointer"><img  onclick="AddRowMicrobiologyTests();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
                '</td>');
        }
        else {
            colNameAddRow = $('<td class="text-center">' +
                '<div class="cursor-pointer"><img style="width: 15px;" class="btnDelete" onclick="DeleteRowMicrobiologyTests();" src="../../assets/images/icons/help/close.svg" class="w-15" alt=""></div>' +
                '</td>');
        }
        // Column 2: Period Ind. (dropdown)
        var colTestName = $(`
            <td>
                <select onchange="HideErrorMessage(this);ChangeTestNameListMT(${index + 1});"
                        id="ddlTestNameListMT${index + 1}"
                        class="form-control applyselect MandatoryEditDoc"
                        ${isView ? 'disabled' : ''}></select>
                <span id="spddlTestNameListMT${index + 1}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
            </td>
        `);


        // Column 3: Period Ind. (dropdown)
        var colNameResultType = $('<td "><span id="spResultTypeMT' + (index + 1) + '"></span>' +
            '</td>');
        // Column 4: Period Ind. (dropdown)
        var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnitMT' + (index + 1) + '"></span>' +
            '</td>');
        var colApprovedRange = $(`
        <td>
            <div id="divRangeMT${index + 1}" class="moldcount hide">
                <div class="d-flex gap-10">
                    <div class="w-100">
                        <input type="text" id="txtApprovedMinMT${index + 1}" placeholder="MIN" class="form-control" ${isView ? 'disabled' : ''} />
                    </div>
                    <div class="w-100">
                        <input type="text" id="txtApprovedMaxMT${index + 1}" placeholder="MAX" class="form-control" ${isView ? 'disabled' : ''} />
                    </div>
                </div>
            </div>
            <input type="text" id="txtTextMT${index + 1}"  placeholder="Enter" class="form-control color hide" ${isView ? 'disabled' : ''} />
            <input type="text" id="txtNumberMT${index + 1}" placeholder="0" class="form-control density hide" ${isView ? 'disabled' : ''} />
            <input type="hidden" id="hddCategoryMT${index + 1}" />
            <input type="hidden" id="hddIsSampleMT${index + 1}" />
            <input type="hidden" id="hddIsProductionMT${index + 1}" />
            <input type="hidden" id="hddIsInvardMT${index + 1}" />
            <input type="hidden" id="hddIsOutWardMT${index + 1}" />
            <input type="hidden" id="hddIsMicrobiologicalMT${index + 1}" />
            <input type="hidden" id="hddQCIDMT${index + 1}" />
        </td>
    `);

        row.append(colNameAddRow)
            .append(colTestName)
            .append(colNameResultType)
            .append(colNameMeasuringUnit)
            .append(colApprovedRange);

        // Finally, append the row to the table body 
        $("#tblMicrobiologyTests tbody").append(row);
        var $ele0 = $('#ddlTestNameListMT' + (index + 1) + '');
        $ele0.empty();
        $ele0.append($('<option/>').val('').text('Select'));
        $.each(testNameArray, function (ii, vall) {
            if (vall.isMicrobiological == true) {
                var $option = $('<option />')
                    .val(vall.ID)
                    .text(vall.ValueName)
                    .attr('data-code', vall.ValueCode);
                //if (vall.ID == "1") {
                //    $option.attr("selected", "selected");
                //}
                $ele0.append($option);
            }
        });

        $('#ddlTestNameListMT' + (index + 1)).val(doc.Parameter_NameID);//.trigger('change');
        if (doc.Parameter_Type == 1) {
            document.getElementById('spResultTypeMT' + (index + 1)).innerText = 'Numeric';
            $('#txtNumberMT' + (index + 1) + '').val(doc.Numeric_Value);

            $('#txtNumberMT' + (index + 1) + '').show();
            $('#txtTextMT' + (index + 1) + '').hide();
            $('#divRangeMT' + (index + 1) + '').hide();
            // document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.Numeric_Value;
        }
        if (doc.Parameter_Type == 2) {
            document.getElementById('spResultTypeMT' + (index + 1)).innerText = 'Text';
            $('#txtNumberMT' + (index + 1) + '').hide();
            $('#txtTextMT' + (index + 1) + '').show();
            $('#divRangeMT' + (index + 1) + '').hide();

            $('#txtTextMT' + (index + 1) + '').val(doc.Text_Value);
            // document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.Text_Value;
        }
        if (doc.Parameter_Type == 3) {
            document.getElementById('spResultTypeMT' + (index + 1)).innerText = 'Range';
            $('#txtNumberMT' + (index + 1) + '').hide();
            $('#txtTextMT' + (index + 1) + '').hide();
            $('#divRangeMT' + (index + 1) + '').show();

            $('#txtApprovedMinMT' + (index + 1) + '').val(doc.Range_Min);
            $('#txtApprovedMaxMT' + (index + 1) + '').val(doc.Range_Max);
            //document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.Range_Min + '-' + doc.Range_Max;
        }
        document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.MeasuringUnit;
        //$('#txtNumber' + (index + 1)).val(doc.Numeric_Value);
        $('#hddCategoryMT' + (index + 1)).val(doc.Category);
        $('#hddIsSampleMT' + (index + 1)).val(doc.IsSample);
        $('#hddIsProductionMT' + (index + 1)).val(doc.IsProduction);
        $('#hddIsInvardMT' + (index + 1)).val(doc.IsInvard);
        $('#hddIsOutWardMT' + (index + 1)).val(doc.IsOutWard);
        $('#hddIsMicrobiologicalMT' + (index + 1)).val(doc.IsMicrobiological);
        $('#hddQCIDMT' + (index + 1)).val(doc.QCID);
        // }
    });
    if (isMicrobiologicalArray.length == 0) {
        var isNewRow = true;
        BindHTMLTableMicrobiologyTests(0, isNewRow);
    }
}
var testNameArray = [];
var QCTestMappingData = [];

function BindHTMLTableMicrobiologyTests(docID, isNewRow) {
    var rowCount = $("#tblMicrobiologyTests tbody tr").length;
    if (isNewRow == false) {
        return false;
    }
    else {
        $("#tblMicrobiologyTests tbody").html('');
    }
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img onclick="AddRowMicrobiologyTests();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameListMT(' + (rowCount + 1) + ');" id="ddlTestNameListMT' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameListMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultTypeMT' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnitMT' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRangeMT' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMinMT' + (rowCount + 1) + '"  placeholder="MIN" class="form-control" onchange="HideErrorMessage(this)"/>' +
        '<span id="sptxtApprovedMinMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span > ' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMaxMT' + (rowCount + 1) + '" placeholder="MAX" class="form-control" onchange="HideErrorMessage(this)" />' +
        '<span id="sptxtApprovedMaxMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span > ' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtTextMT' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtTextMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="text" id="txtNumberMT' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtNumberMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="hidden" id="hddCategoryMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSampleMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProductionMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiologicalMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCIDMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddTestNameIdMT' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblMicrobiologyTests tbody").append(row);
    var $ele0 = $('#ddlTestNameListMT' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological == true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });
}
function BindHTMLTableQualityParameters(docID) {
    var rowCount = $("#tblQCTestMapping tbody tr").length;
    if (rowCount > 0) {
        return false;
    }
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img onclick="AddRowQualityParameters();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameList(' + (rowCount + 1) + ');" id="ddlTestNameList' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameList' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultType' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnit' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRange' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMin' + (rowCount + 1) + '" placeholder="MIN" class="form-control" />' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMax' + (rowCount + 1) + '" placeholder="MAX" class="form-control" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtText' + (rowCount + 1) + '"  placeholder="Enter" class="form-control color hide" />' +
        '<input type="text" id="txtNumber' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" />' +
        '<input type="hidden" id="hddCategory' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSample' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProduction' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiological' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCID' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblQCTestMapping tbody").append(row);
    var $ele0 = $('#ddlTestNameList' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological != true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });

}

function collectTableData() {
    let isInvalid = false;  // Flag to detect invalid row
    // Create an empty array to store row data
    QCTestMappingData = [];
    // Select all rows in the table body (excluding any header row)
    // Assuming your <tbody> has the id="table-body"

    $('#tblQCTestMapping tbody tr').each(function (index) {
        // Collect the values from the cells/inputs within this row
        var ParameterNameID = $(this).find('#ddlTestNameList' + (index + 1) + '').val();  // Period Ind. (dropdown)
        var ParameterNameText = $(this).find('#ddlTestNameList' + (index + 1) + ' option:selected').text();  // Gets selected text
        var ParameterType = document.getElementById('spResultType' + (index + 1) + '').innerText;
        var typeMap = {
            "Numeric": 1,
            "Text": 2,
            "Range": 3
        };
        var ParameterTypeId = typeMap[ParameterType] || 0;
        //var Numeric_Value = $(this).find('#spMeasuringUnit' + (index + 1) + '').val();       // Series Name
        var TextValue = $(this).find('#txtText' + (index + 1) + '').val();    // First No.
        var NumericValue = $(this).find('#txtNumber' + (index + 1) + '').val();     // Prefix
        var RangeMin = $(this).find('#txtApprovedMin' + (index + 1) + '').val();     // Branch (dropdown)
        var RangeMax = $(this).find('#txtApprovedMax' + (index + 1) + '').val();     // Branch (dropdown)
        var Category = $(this).find('#hddCategory' + (index + 1) + '').val();     // Branch (dropdown)
        var IsSample = $(this).find('#hddIsSample' + (index + 1) + '').val();     // Branch (dropdown)
        var IsProduction = $(this).find('#hddIsProduction' + (index + 1) + '').val();     // Branch (dropdown)
        var IsInvard = $(this).find('#hddIsInvard' + (index + 1) + '').val();     // Branch (dropdown)
        var IsOutWard = $(this).find('#hddIsOutWard' + (index + 1) + '').val();     // Branch (dropdown)
        var IsMicrobiological = $(this).find('#hddIsMicrobiological' + (index + 1) + '').val();     // Branch (dropdown)
        var QCID = $(this).find('#hddQCID' + (index + 1) + '').val();     // Branch (dropdown)

        // Build an object representing a single row
        var rowData = {
            Parameter_NameID: ParameterNameID,
            Parameter_Type: ParameterTypeId,
            Numeric_Value: NumericValue == "" ? 0 : NumericValue,
            Text_Value: TextValue,
            Range_Min: RangeMin == "" ? 0 : RangeMin,
            Range_Max: RangeMax == "" ? 0 : RangeMax,
            Category: Category,
            IsSample: IsSample,
            IsProduction: IsProduction,
            IsInvard: IsInvard,
            IsOutWard: IsOutWard,
            IsMicrobiological: IsMicrobiological,
            QCID: QCID
        };
        if (ParameterNameText == 'Select') {
            isInvalid = true;  // Set invalid flag
            return null;

        }

        // Push it into the array
        QCTestMappingData.push(rowData);
    });

    if ($('#ddlSampleType').val() == 4) {
        if (document.getElementById('isMandatory').checked == true) {
            $('#tblMicrobiologyTests tbody tr').each(function (index) {
                // Collect the values from the cells/inputs within this row
                var ParameterNameID = $(this).find('#ddlTestNameListMT' + (index + 1) + '').val();  // Period Ind. (dropdown)
                var ParameterNameText = $(this).find('#ddlTestNameListMT' + (index + 1) + ' option:selected').text();  // Gets selected text
                var ParameterType = document.getElementById('spResultTypeMT' + (index + 1) + '').innerText;
                var typeMap = {
                    "Numeric": 1,
                    "Text": 2,
                    "Range": 3
                };
                var ParameterTypeId = typeMap[ParameterType] || 0;
                //var Numeric_Value = $(this).find('#spMeasuringUnit' + (index + 1) + '').val();       // Series Name
                var TextValue = $(this).find('#txtTextMT' + (index + 1) + '').val();    // First No.
                var NumericValue = $(this).find('#txtNumberMT' + (index + 1) + '').val();     // Prefix
                var RangeMin = $(this).find('#txtApprovedMinMT' + (index + 1) + '').val();     // Branch (dropdown)
                var RangeMax = $(this).find('#txtApprovedMaxMT' + (index + 1) + '').val();     // Branch (dropdown)
                var Category = $(this).find('#hddCategoryMT' + (index + 1) + '').val();     // Branch (dropdown)
                var IsSample = $(this).find('#hddIsSampleMT' + (index + 1) + '').val();     // Branch (dropdown)
                var IsProduction = $(this).find('#hddIsProductionMT' + (index + 1) + '').val();     // Branch (dropdown)
                var IsInvard = $(this).find('#hddIsInvardMT' + (index + 1) + '').val();     // Branch (dropdown)
                var IsOutWard = $(this).find('#hddIsOutWardMT' + (index + 1) + '').val();     // Branch (dropdown)
                var IsMicrobiological = $(this).find('#hddIsMicrobiologicalMT' + (index + 1) + '').val();     // Branch (dropdown)
                var QCID = $(this).find('#hddQCIDMT' + (index + 1) + '').val();     // Branch (dropdown)

                // Build an object representing a single row
                var rowData = {
                    Parameter_NameID: ParameterNameID,
                    Parameter_Type: ParameterTypeId,
                    Numeric_Value: NumericValue == "" ? 0 : NumericValue,
                    Text_Value: TextValue,
                    Range_Min: RangeMin == "" ? 0 : RangeMin,
                    Range_Max: RangeMax == "" ? 0 : RangeMax,
                    Category: Category,
                    IsSample: IsSample,
                    IsProduction: IsProduction,
                    IsInvard: IsInvard,
                    IsOutWard: IsOutWard,
                    IsMicrobiological: IsMicrobiological,
                    QCID: QCID
                };
                if (ParameterNameText == 'Select') {
                    isInvalid = true;  // Set invalid flag
                    return null;

                }
                // Push it into the array
                QCTestMappingData.push(rowData);
            });
        }
    }
    if ($('#ddlFMS').val() == 2) {
        if (document.getElementById('isMandatory').checked == true) {
            $('#tblMicrobiologyTests tbody tr').each(function (index) {
                // Collect the values from the cells/inputs within this row
                var ParameterNameID = $(this).find('#ddlTestNameListMT' + (index + 1) + '').val();  // Period Ind. (dropdown)
                var ParameterNameText = $(this).find('#ddlTestNameListMT' + (index + 1) + ' option:selected').text();  // Gets selected text
                var ParameterType = document.getElementById('spResultTypeMT' + (index + 1) + '').innerText;
                var typeMap = {
                    "Numeric": 1,
                    "Text": 2,
                    "Range": 3
                };
                var ParameterTypeId = typeMap[ParameterType] || 0;
                //var Numeric_Value = $(this).find('#spMeasuringUnit' + (index + 1) + '').val();       // Series Name
                var TextValue = $(this).find('#txtTextMT' + (index + 1) + '').val();    // First No.
                var NumericValue = $(this).find('#txtNumberMT' + (index + 1) + '').val();     // Prefix
                var RangeMin = $(this).find('#txtApprovedMinMT' + (index + 1) + '').val();     // Branch (dropdown)
                var RangeMax = $(this).find('#txtApprovedMaxMT' + (index + 1) + '').val();     // Branch (dropdown)
                var Category = $(this).find('#hddCategoryMT' + (index + 1) + '').val();     // Branch (dropdown)
                var IsSample = $(this).find('#hddIsSampleMT' + (index + 1) + '').val();     // Branch (dropdown)
                var IsProduction = $(this).find('#hddIsProductionMT' + (index + 1) + '').val();     // Branch (dropdown)
                var IsInvard = $(this).find('#hddIsInvardMT' + (index + 1) + '').val();     // Branch (dropdown)
                var IsOutWard = $(this).find('#hddIsOutWardMT' + (index + 1) + '').val();     // Branch (dropdown)
                var IsMicrobiological = $(this).find('#hddIsMicrobiologicalMT' + (index + 1) + '').val();     // Branch (dropdown)
                var QCID = $(this).find('#hddQCIDMT' + (index + 1) + '').val();     // Branch (dropdown)

                // Build an object representing a single row
                var rowData = {
                    Parameter_NameID: ParameterNameID,
                    Parameter_Type: ParameterTypeId,
                    Numeric_Value: NumericValue == "" ? 0 : NumericValue,
                    Text_Value: TextValue,
                    Range_Min: RangeMin == "" ? 0 : RangeMin,
                    Range_Max: RangeMax == "" ? 0 : RangeMax,
                    Category: Category,
                    IsSample: IsSample,
                    IsProduction: IsProduction,
                    IsInvard: IsInvard,
                    IsOutWard: IsOutWard,
                    IsMicrobiological: IsMicrobiological,
                    QCID: QCID
                };
                if (ParameterNameText == 'Select') {
                    isInvalid = true;  // Set invalid flag
                    return null;

                }
                // Push it into the array
                QCTestMappingData.push(rowData);
            });
        }
    }
    // Now QCTestMappingData is an array of objects containing all rows' data
    return isInvalid ? null : QCTestMappingData;
}


function collectTableDataOil() {
    let isInvalid = false;  // Flag to detect invalid row
    // Create an empty array to store row data
    QCTestMappingData = [];
    // Select all rows in the table body (excluding any header row)
    // Assuming your <tbody> has the id="table-body"

    $('#tblQCTestMapping tbody tr').each(function (index) {

        var rowId = $(this).attr("id").split('_')[1];

        index = rowId - 1;
        // Collect the values from the cells/inputs within this row
        var ParameterNameID = $(this).find('#ddlTestNameList' + (index + 1) + '').val();  // Period Ind. (dropdown)
        var ParameterNameText = $(this).find('#ddlTestNameList' + (index + 1) + ' option:selected').text();  // Gets selected text
        var ParameterType = document.getElementById('spResultType' + (index + 1) + '').innerText;
        var typeMap = {
            "Numeric": 1,
            "Text": 2,
            "Range": 3
        };
        var ParameterTypeId = typeMap[ParameterType] || 0;
        //var Numeric_Value = $(this).find('#spMeasuringUnit' + (index + 1) + '').val();       // Series Name
        var TextValue = $(this).find('#txtText' + (index + 1) + '').val();    // First No.
        var NumericValue = $(this).find('#txtNumber' + (index + 1) + '').val();     // Prefix
        var RangeMin = $(this).find('#txtApprovedMin' + (index + 1) + '').val();     // Branch (dropdown)
        var RangeMax = $(this).find('#txtApprovedMax' + (index + 1) + '').val();     // Branch (dropdown)
        var Category = $(this).find('#hddCategory' + (index + 1) + '').val();     // Branch (dropdown)
        var IsSample = $(this).find('#hddIsSample' + (index + 1) + '').val();     // Branch (dropdown)
        var IsProduction = $(this).find('#hddIsProduction' + (index + 1) + '').val();     // Branch (dropdown)
        var IsInvard = $(this).find('#hddIsInvard' + (index + 1) + '').val();     // Branch (dropdown)
        var IsOutWard = $(this).find('#hddIsOutWard' + (index + 1) + '').val();     // Branch (dropdown)
        var QCID = $(this).find('#hddQCID' + (index + 1) + '').val();     // Branch (dropdown)

        // Build an object representing a single row
        var rowData = {
            Parameter_NameID: ParameterNameID,
            Parameter_Type: ParameterTypeId,
            Numeric_Value: NumericValue == "" ? 0 : NumericValue,
            Text_Value: TextValue,
            Range_Min: RangeMin == "" ? 0 : RangeMin,
            Range_Max: RangeMax == "" ? 0 : RangeMax,
            Category: Category,
            IsSample: IsSample,
            IsProduction: IsProduction,
            IsInvard: IsInvard,
            IsOutWard: IsOutWard,
            QCID: QCID
        };
        if (ParameterNameText == 'Select') {
            isInvalid = true;  // Set invalid flag
            return null;

        }

        // Push it into the array
        QCTestMappingData.push(rowData);
    });

    return isInvalid ? null : QCTestMappingData;
}


function SaveQCCheck() {
    var data = collectTableData();
    if (data === null) {
        FailToaster('Please select paramter for QC.');
        return;
    }
    var ismicro = 1;
    const display = window.getComputedStyle(document.getElementById('divMicrobiologyTests')).display;
    if (display === 'none') {

        ismicro = 0;
    }
    var itemModel =
    {
        ID: ItemIdData,
        GrnItemID: grnItemID,
        NoOfContainers: $('#txtNoOfContainers').val(),
        QCTestMapping: QCTestMappingData,
        IsMicro: ismicro,
        ExistingeditQCTestData: existingeditQCTestData
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(itemModel);

    var data = itemModel.QCTestMapping;

    const idSet = new Set();
    let hasDuplicates = false;

    for (const item of data) {
        if (idSet.has(item.Parameter_NameID)) {
            hasDuplicates = true;
            if (item.IsMicrobiological == 'false') {
                FailToaster(`Duplicate Parameters found in QC Check`);
            }
            else if (item.IsMicrobiological == 'true') {
                FailToaster(`Duplicate Parameters found in Microbiology Test`);
            }
            return; // Exit after first duplicate
        }

        idSet.add(item.Parameter_NameID);
    }
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "QCTask_1",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString1
    };

    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        $("#qctestmapping").modal('hide');
        setTimeout(function () {
            location.reload();
        }, 500); // 300ms delay (optional)
    });

}

function getQcStep2(grnItem_Id, isView) {

    var qc2 =
        `<div class="modal fade drawer right-align" id="qctestmappingInitiated">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2 class="modal-title">Step 2 - QC Check initiated</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal" />
            </div>
            <div class="modal-body mb-100">
                <!-- open -->

                <div class="row">
                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">AR Number</label>
                        <p id="lbArnNumberInitiated"></p>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">GRN Date</label>
                        <p id="lbDocDateInitiated"></p>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">Batch number</label>
                        <p id="lbBatchNumerInitiated"></p>
                    </div>


                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">Item Name</label>
                        <p id="lbItemNameInitiated"></p>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">
                            Item Code
                        </label>
                        <p id="lbItemCodeInitiated"></p>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">Vendor Name</label>
                        <p id="lbSuppNameInitiated"> </p>
                    </div>

                    <div class="col-lg-3 col-md-4 col-sm-6 form-group" style="display:none">
                        <label class="label-light">No. of Containers</label>
                        <p id="lbNoOfContainers"> </p>
                    </div>
                    <div class="col-sm-12 form-group">
                        <div class="table-responsive sticky-responsive">

                            <table id="dtStockTransferInitiated" class="display stickyth     dgntable no-footer radius-0 dataTable itemsinformation" style="table-layout:fixed;">
                                <thead>
                                    <tr>
                                        <th width="150">Test Name</th>
                                        <th width="100">Result Type</th>
                                        <th width="60">Measuring <span class="d-block">Unit</span></th>
                                        <th width="100">Approved Range</th>
                                        <th style="display:none;">QCID</th>
                                        <th width="100">Result Value</th>

                                    </tr>
                                </thead>

                            </table>
                        </div>
                    </div>
                    <div class="col-md-5 form-group">
                        <label>Manufacturing Date</label>
                        <div class="input-group">
                            <input type="text" id="txtManufacturingDateInitiated" autocomplete="off" class="datepicker form-control" placeholder="DD/MM/YYYY" ${isView ? `disabled` : ``} >
                            <span class="clear-date">×</span>
                            <div class="input-group-append calendar-freeze">
                                <span class="input-group-text bg-white"><img src="../assets/images/icons/help/calendar-icon.svg" alt=""></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5 form-group">
                        <label>Exp Date</label>
                        <div class="input-group">
                            <input type="text" id="txtExpDateInitiated" autocomplete="off" class="datepicker form-control" placeholder="DD/MM/YYYY" ${isView ? `disabled` : ``} >
                            <span class="clear-date">×</span>
                            <div class="input-group-append calendar-freeze">
                                <span class="input-group-text bg-white"><img src="../assets/images/icons/help/calendar-icon.svg" alt=""></span>
                            </div>

                        </div>
                        <span id="sptxtExpDateInitiated" class="text-danger field-validation-error" style="display:none;">Expiry Date must be later than Manufacturing Date!</span>
                    </div>
                    <div class="col-md-4 col-sm-6 form-group">
                        <label>No Of Container</label>
                        <input type="number" id="txtNoOfContainerInitiated" placeholder="Enter" class="form-control MandateInitiated" oninput="HideErrorMessage(this)" ${isView ? `disabled` : ``} />
                        <span id="sptxtNoOfContainerInitiated" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-6 form-group">
                        <label>Sample Quantity</label>
                        <input type="text" id="txtSampleQty1" placeholder="Enter" class="form-control MandateInitiated" oninput="HideErrorMessage(this)" ${isView ? `disabled` : ``} />
                        <span id="sptxtSampleQty1" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </div>
                    <div class="col-md-4 form-group">
                        <label>Total Quantity</label>
                        <input type="text" id="txtTotalQtyInitiated" placeholder="Enter" class="form-control" disabled /> <label id="lblUomTotal"></label>
                        <input type="hidden" id="hdntxtTotalQtyInitiated" />
                        <input type="hidden" id="hdntxtApprovedQtyInitiated" />
                        <input type="hidden" id="hdnUOM" />
                        <input type="hidden" id="hdbQtyRejected" />
                    </div>


                    <div class="col-md-4 form-group">
                        <label>Rejected Quantity</label>
                        <input type="number" id="txtRejectedQtyInitiated" placeholder="Enter" class="form-control MandateInitiated" onchange="HideErrorMessage(this)" ${isView ? `disabled` : ``} />
                        <span id="sptxtRejectedQtyInitiated" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </div>
                    <div class="col-md-4 form-group">
                        <label>Approved Quantity</label>
                        <input type="text" id="txtApprovedQtyInitiated" disabled placeholder="Enter" class="form-control MandateInitiated" onchange="HideErrorMessage(this)" /> <label id="lblUomApproved"></label>
                        <span id="sptxtApprovedQtyInitiated" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </div>

                    <div class="col-md-4 col-sm-6 form-group">
                        <label>Final Result</label>
                        <select id="txtFinalResultInitiated" class="form-control applyselect MandateInitiated" onchange="HideErrorMessage(this)" ${isView ? `disabled` : ``} >
                            <option value="">Select</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Partial Approved">Partial Approved</option>
                        </select>
                        <span id="sptxtFinalResultInitiated" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </div>

                    <div class="col-md-12 form-group">
                        <label>Remarks (Optional)</label>
                        <textarea id="txtRemarkInitiated" class="form-control h-120" maxlength="250" placeholder="Enter" ${isView ? `disabled` : ``} ></textarea>
                        <span id="spRemarkInitiated" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </div>

                </div>


            </div>
          
            <div class="side-footer">
            ${!isView ?
            ` <button type="button" data-toggle="modal" data-dismiss="modal" class="btn btn-lg cancelbtn">Cancel</button>
                  <button type="button" class="btn btn-lg actionbtn" id="initiatedBtn" onclick="OpenInitiated()">Submit</button>
                  <button style="display:none;" id="btnInitiatedPopup" type="button" class="btn btn-lg actionbtn" data-toggle="modal" data-target="#confirmpopupInitiated" fdprocessedid="k7r59">Submit</button>` : ``
        }
            </div>
        </div>
    </div>
</div>

    <div class="modal confirmdgn modaloverlay" id="confirmpopupInitiated" style="display: none;" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-default">
        <div class="modal-content ">

            <!-- Modal body -->
            <div class="modal-body">

                <div class="warningmsg">
                    <p>Before proceeding any further please confirm <br>the approved and rejected quantity.</p>
                    <h6 class="text-center">Item Code : <label id="lblItemCode"></label> <span class="d-block">Total Qty : <label id="lblTotalQty"></label></span></h6>
                    <div class="d-flex justify-content-between">
                        <span class="d-block">Approved Quantity : <label id="lblApproved"></label></span>
                        <span class="d-block">Rejected Quantity : <label id="lblRejected"></label></span>
                    </div>

                </div>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
                <button type="button" class="btn btn-lg cancelbtn" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-lg actionbtn" onclick="SaveDataInitiated()">Confirm</button>
            </div>

        </div>
    </div>
</div>
`

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html(qc2);

    initializeDatePickers();
    //$(function () {
    //    $('.datepicker').daterangepicker({
    //        opens: 'right',
    //        singleDatePicker: true,
    //        showDropdowns: true,
    //        autoApply: true,
    //        autoUpdateInput: false,
    //        parentEl: 'body', // Ensures it is not constrained in table
    //        locale: {
    //            format: 'DD/MM/YYYY'
    //        }
    //    }).on('apply.daterangepicker', function (ev, picker) {
    //        // Set selected date
    //        $(this).val(picker.startDate.format('DD/MM/YYYY'));
    //        // Show the × icon
    //        $(this).siblings('.clear-date').show();
    //    });

    //    // Clear date when clicking the × icon
    //    $('.clear-date').on('click', function () {
    //        const $input = $(this).siblings('.datepicker'); // ✅ fixed selector
    //        $input.val('');          // Clear input
    //        $(this).hide();          // Hide × icon
    //    });

    //    // Hide × if input cleared manually
    //    $('.datepicker').on('input', function () {
    //        if ($(this).val() === '') {
    //            $(this).siblings('.clear-date').hide();
    //        }
    //    });
    //    // Open datepicker when clicking the icon
    //    $('.input-group-text').on('click', function () {
    //        $(this).closest('.input-group').find('.datepicker').focus();
    //    });
    //});
    //$('.datepicker').on('show.daterangepicker', function () {
    //    var $calendar = $('.daterangepicker');
    //    var inputOffset = $(this).offset();
    //    var inputHeight = $(this).outerHeight();
    //    var windowHeight = $(window).height();
    //    var calendarHeight = $calendar.outerHeight();

    //    // Check if there's enough space to open the dropdown below the input
    //    if ((inputOffset.top + inputHeight + calendarHeight) > windowHeight) {
    //        // If not enough space, open the dropdown above the input
    //        $calendar.css({
    //            top: inputOffset.top - calendarHeight - 5 + 'px', // 5px for some spacing
    //            left: inputOffset.left + 'px'
    //        });
    //    } else {
    //        // Open it below the input
    //        $calendar.css({
    //            top: inputOffset.top + inputHeight + 5 + 'px', // 5px for some spacing
    //            left: inputOffset.left + 'px'
    //        });
    //    }
    //});

    let obj = tblData.find(input => input.GRNItemId == grnItem_Id)

    ShowQCMappingInitiated(obj.ITEM_ID, grnItem_Id, isView);
}

function ShowQCMappingInitiated(itemId, grnIItemId, isView) {
    ItemIdData = itemId;
    GItemId = grnIItemId;
    var model = {
        ID: itemId,
        ParentId: 0,
        GRNItemId: GItemId,
        IsMicro: false,
        IsRejected: false
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "QCTask_2";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var data = response.data.data.Table;

        $('#lbArnNumberInitiated').text(data[0].ARNUMBER);
        $('#lbDocDateInitiated').text(data[0].DOCDate ? ChangeDateFormatToddMMYYYWithSlace(data[0].DOCDate) : '');
        $('#lbBatchNumerInitiated').text(data[0].BatchOrLot);
        $('#lbItemNameInitiated').text(data[0].ITEM_NAME);
        $('#lbItemCodeInitiated').text(data[0].ITEM_CODE);
        $('#lbSuppNameInitiated').text(data[0].SupplierName);

        $('#txtRejectedQtyInitiated').val('0');
        $('#txtTotalQtyInitiated').val(data[0].TotalQty + ' ' + data[0].UOM);
        $('#hdntxtTotalQtyInitiated').val(data[0].TotalQty);
        $('#txtApprovedQtyInitiated').val(data[0].TotalQty + ' ' + data[0].UOM);
        $('#hdntxtApprovedQtyInitiated').val(data[0].TotalQty);
        $('#hdnUOM').val(data[0].UOM);

        //$('#txtManufacturingDateInitiated').val(data[0].MFGDate ? ChangeDateFormatToddMMYYYWithSlace(data[0].MFGDate) : '');
        //$('#txtExpDateInitiated').val(data[0].ExpDate ? ChangeDateFormatToddMMYYYWithSlace(data[0].ExpDate) : '');

        var filteredData = [];


        console.log(data);
        var data1 = response.data.data.Table1;
        if (data1.length > 0) {

            $('#txtFinalResultInitiated').val(data1[0].FinalResult).trigger('change');
            $('#txtRemarkInitiated').val(data1[0].Remark);
            $('#lbNoOfContainers').text(data1[0].NoOfContainers);
            // Filter records where IsMicrobiological is 0
            var filteredData = data1.filter(input => input.IsMicrobiological == 0)
            var filteredDataMicro = data1.filter(input => input.IsMicrobiological == 1)

            $('#txtManufacturingDateInitiated').val(data1[0].MfgFinalDate ? ChangeDateFormatToddMMYYYWithSlace(data1[0].MfgFinalDate) : '');
            $('#txtExpDateInitiated').val(data1[0].ExpFinalDate ? ChangeDateFormatToddMMYYYWithSlace(data1[0].ExpFinalDate) : '');

            $('#txtNoOfContainerInitiated').val(data1[0].NoOfContainers);
            $('#txtRejectedQtyInitiated').val(data1[0].RejectedQty);
            $('#txtApprovedQtyInitiated').val(data1[0].ApprovedQty);
            $('#txtSampleQty1').val(data1[0].SampleQty);


            //if ($('#completed').hasClass('active')) {
            //    $('#initiatedBtn').hide();
            //    $('#txtApprovedQtyInitiated').val(data[0].TotalQty + ' ' + data[0].UOM);

            //    $('#txtManufacturingDateInitiated').val(data1[0].MfgFinalDate ? ChangeDateFormatToddMMYYYWithSlace(data1[0].MfgFinalDate) : '');
            //    $('#txtExpDateInitiated').val(data1[0].ExpFinalDate ? ChangeDateFormatToddMMYYYWithSlace(data1[0].ExpFinalDate) : '');


            //    $('#txtApprovedQtyInitiated').val(data1[0].ApprovedQty + ' ' + data[0].UOM);

            //    setTimeout(function () {
            //        FreezeAllQCTestModals();
            //    }, 200);
            //}

            console.log(data1);

            if (filteredDataMicro.length > 0) {
                $('#hdnIsMicro').val('1');

            }
            else {
                $('#hdnIsMicro').val('0');
            }


        }


        BindTableQCTestInitiated(filteredData, isView);
    });

    $("#qctestmappingInitiated").modal('show');
}

function BindTableQCTestInitiated(filteredData, isView) {
    if ($.fn.DataTable.isDataTable('#dtStockTransferInitiated')) {
        $('#dtStockTransferInitiated').DataTable().clear().destroy();
        $('#dtStockTransferInitiated').find('tbody').empty();
    }

    $('#dtStockTransferInitiated').DataTable({
        data: filteredData || [],
        paging: false, info: false, searching: false,
        orderMulti: false,       // avoid secondary sorts
        order: [[4, 'asc']],    // 5th column (QCID)
        columns: [
            { data: "TestName", orderable: false },     // prevent name sort
            { data: "ResultType", orderable: false },
            { data: "MeasuringUnit", orderable: false },
            { data: "ApprovedRange", orderable: false },
            { data: "QCID", visible: false },            // sorting key
            {
                orderable: false,
                data: null,
                render: function (data, type, row) {
                    if (type === 'sort' || type === 'type') return row.QCID | 0; // safety

                    const disabledAttr = isView ? 'disabled' : '';

                    const baseInput = `
                    <input type="text" value="${row.ResultMin ?? ''}" autocomplete="off"
                   class="form-control MandateInitiated" placeholder="Enter"
                   id="tbResultMinInitiated_${row.QCID}_${row.GrnItemQCResultId}"
                   onchange="HideErrorMessage(this)" ${disabledAttr} />`;

                    const textSpecific = `
                    onkeypress="return RestrictNoAlpha(event)"
                    onpaste="return RestrictNoAlphaPaste(event)"`;

                    const span = `
                    <span id="sptbResultMinInitiated_${row.QCID}_${row.GrnItemQCResultId}"
                          class="text-danger field-validation-error" style="display:none;">
                        Hey, You missed this field!!
                    </span>`;

                    if (row.ResultType === 'Text') {
                        return baseInput.replace('/>', `${textSpecific} />`) + span;
                    } else {
                        return baseInput + span;
                    }
                }
            }

        ],
        columnDefs: [
            { targets: 4, type: 'num' } // ensure numeric sort (not lexicographic "1,10,2")
        ]
    });
}

function OpenInitiated() {
    var isValidDate = true;
    // Get formatted date strings
    const manufactureDateStr = ChangeDateFormatSecond($('#txtManufacturingDateInitiated').val());
    const expDateStr = ChangeDateFormatSecond($('#txtExpDateInitiated').val());

    // Parse to Date objects
    const manufactureDate = parseDDMMMYYYY(manufactureDateStr);
    const expDate = parseDDMMMYYYY(expDateStr);
    // Validate
    if (expDate <= manufactureDate) {
        $('#sptxtExpDateInitiated').show();
        isValidDate = false;
    }
    if (checkValidationOnSubmit('MandateInitiated') == true && isValidDate == true) {

        if ($('#txtFinalResultInitiated').val() == 'Fail' && $('#txtRemarkInitiated').val().trim() == '') {
            $('#spRemarkInitiated').show();
            return;
        }
        $('#lblItemCode').text($('#lbItemCodeInitiated').text());
        $('#lblApproved').text($('#txtApprovedQtyInitiated').val());
        $('#lblRejected').text($('#txtRejectedQtyInitiated').val() + ' ' + $('#hdnUOM').val());
        $('#lblTotalQty').text($('#txtTotalQtyInitiated').val());
        $("#btnInitiatedPopup").trigger("click");
    }
}

function SaveDataInitiated() {

    var isValidDate = true;
    // Get formatted date strings
    const manufactureDateStr = ChangeDateFormatSecond($('#txtManufacturingDateInitiated').val());
    const expDateStr = ChangeDateFormatSecond($('#txtExpDateInitiated').val());

    // Parse to Date objects
    const manufactureDate = parseDDMMMYYYY(manufactureDateStr);
    const expDate = parseDDMMMYYYY(expDateStr);
    // Validate
    if (expDate <= manufactureDate) {
        $('#sptxtExpDateInitiated').show();
        isValidDate = false;
    }

    if (checkValidationOnSubmit('MandateInitiated') == true && isValidDate == true) {

        if ($('#txtFinalResultInitiated').val() == 'Fail' && $('#txtRemarkInitiated').val().trim() == '') {
            $('#spRemarkInitiated').show();
            return;
        }
        var QCTestMappingData = [];
        // var inputs = $('#dtStockTransferInitiated').find('input[type="number"]');
        var inputs = $('#dtStockTransferInitiated').find('input[id^="tbResultMinInitiated_"]');

        inputs.each(function () {
            var id = $(this).attr('id');
            var value = $(this).val();

            // Optionally, parse ID to extract QCID and GrnItemQCResultId
            var parts = id.split('_'); // Example: tbResultMin_123_456
            var qcid = parts[1];
            var grnItemQCResultId = parts[2];
            var ItemObject = {
                GrnItemQCResultId: grnItemQCResultId,
                ResultMin: value,
                QCID: qcid
            }
            QCTestMappingData.push(ItemObject);
        });

        var model =
        {
            GrnItemId: GItemId,
            ItemID: ItemIdData,
            ManufucatureDate: ChangeDateFormatSecond($('#txtManufacturingDateInitiated').val()),
            ExpDate: ChangeDateFormatSecond($('#txtExpDateInitiated').val()),
            FinalResult: $('#txtFinalResultInitiated').val(),
            Remark: $('#txtRemarkInitiated').val(),
            FromType: 1,
            QCTestMapping: QCTestMappingData,
            ApprovedQty: $('#hdntxtApprovedQtyInitiated').val(),
            RejectedQty: $('#txtRejectedQtyInitiated').val(),
            TotalQty: $('#hdntxtTotalQtyInitiated').val(),
            NoOfContainers: $('#txtNoOfContainerInitiated').val(),
            IsMicro: $('#hdnIsMicro').val(),
            SampleQty: $('#txtSampleQty1').val()
        };
        const jsonString = JSON.stringify(model);
        let GenericModeldata = {
            ScreenID: "QCTask_2",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            $("#qctestmappingInitiated").modal('hide');
            setTimeout(function () {
                location.reload();
            }, 300); // 300ms delay (optional)
        });

    }
}

function getQcStep3(grnItem_Id, isView) {

    var qc3 =
        `<div class="modal fade drawer right-align" id="qctestmappingRejected" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2 class="modal-title">Step 3 - Microtesting </h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal" />
            </div>
            <div class="modal-body mb-100">
                <!-- open -->

                <div class="row">
                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">AR Number</label>
                        <p id="lbArnNumberRejected"></p>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">GRN Date</label>
                        <p id="lbDocDateRejected"></p>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">Batch number</label>
                        <p id="lbBatchNumerRejected"></p>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">Total Quantity</label>
                        <p id="lbQtyRejected"></p>
                    </div>

                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">Item Name</label>
                        <p id="lbItemNameRejected"></p>
                    </div>

                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">
                            Item Code
                        </label>
                        <p id="lbItemCodeRejected"></p>
                    </div>

                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">Vendor Name</label>
                        <p id="lbSuppNameRejected"> </p>
                    </div>


                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">Chemist Name</label>
                        <p id="txtChemistRejected"></p>
                    </div>



                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">Manufacturing Date</label>
                        <p id="txtManufacturingDateRejected"> </p>
                    </div>

                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">Exp Date</label>
                        <p id="txtExpDateRejected"> </p>
                    </div>

                    <div class="col-lg-3 col-md-4 col-sm-6 form-group">
                        <label class="label-light">No. of Containers</label>
                        <p id="lbNoOfContainers4"> </p>
                    </div>

                    <div class="col-sm-12 form-group">
                        <div class="table-responsive ">

                            <table id="dtStockTransferMicro" class="display stickyth dgntable no-footer radius-0 dataTable itemsinformation" style="table-layout:fixed;">
                                <thead>
                                    <tr>
                                        <th width="150">Test Name</th>
                                        <th width="100">Result Type</th>
                                        <th width="60">Measuring <span class="d-block">Unit</span></th>
                                        <th width="100">Approved Range</th>
                                        <th style="display:none;">QCID</th>
                                        <th width="250">Incubation <span class="d-block">Date &amp; Time</span></th>
                                        <th width="250">Observation <span class="d-block">Date &amp; Time</span></th>
                                        <th width="100">Negative Control</th>
                                        <th width="100">Result Value</th>

                                    </tr>
                                </thead>

                            </table>
                            
                        </div>
                    </div>
                    <div class="col-sm-12 form-group">
                        <div class="row">
                            <div class="col-md-6 col-sm-12 form-group">
                                <div class="table-responsive">

                                    <table id="dtStockTransfer" class="display stickyth     dgntable no-footer radius-0 dataTable itemsinformationMedia" style="table-layout:fixed;">
                                        <thead>
                                            <tr>
                                                <th width="50">Action</th>
                                                <th>Used Media</th>
                                                <th>Lot Number</th>

                                            </tr>
                                        </thead>
                                        <tbody id="tableToModify">
                                            <tr>
                                                <td class="text-center"><div id="addrow" class="cursor-pointer"><img style="pointer-events: none;" src="../../assets/images/icons/help/add.svg" alt=""></div></td>
                                                <td>

                                                    <input type="text" id="txtUsedMedia_0" class="form-control MandateRejected" value="" oninput="HideErrorMessage(this)" ${isView ? `disabled` : ``}>
                                                    <span id="sptxtUsedMedia_0" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                                                </td>
                                                <td>

                                                    <input type="text" id="txtLotNumber_0" class="form-control  MandateRejected" value="" oninput="HideErrorMessage(this); alphanumeric(this)" ${isView ? `disabled` : ``}>
                                                    <span id="sptxtLotNumber_0" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                                                </td>

                                            </tr>



                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="col-md-6 col-sm-12 form-group">
                                <div class="row">



                                    <input type="hidden" id="hdntxtApprovedQtyRejected" />
                                    <input type="hidden" id="hdntxtTotalQtyRejected" />
                                    <input type="hidden" id="hdntxtTotalQtyApproved" />

                                    <div class="col-lg-4 col-md-4 col-sm-6 form-group">
                                        <label>Sample Quantity</label>
                                        <input type="text" id="txtSampleQty2" placeholder="Enter" class="form-control MandateRejected" oninput="HideErrorMessage(this)" ${isView ? `disabled` : ``} />
                                        <span id="sptxtSampleQty2" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-6 form-group" id="viewRejQty">
                                        <label>Rejected Quantity</label>
                                        <input type="number" id="txtRejectedQtyRejected" placeholder="Enter" class="form-control MandateRejected" onchange="HideErrorMessage(this)" ${isView ? `disabled` : ``} />
                                        <span id="sptxtRejectedQtyRejected" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-6 form-group">
                                        <label>Approved Quantity</label>
                                        <input type="text" id="txtApprovedQtyRejected" disabled placeholder="Enter" class="form-control MandateRejected" onchange="HideErrorMessage(this)" ${isView ? `disabled` : ``}/>
                                        <span id="sptxtApprovedQtyRejected" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-6 form-group">
                                        <label>Total Rejected Quantity</label>
                                        <input type="hidden" id="hdbQtyExistingRejected" />
                                        <input type="text" id="txtTotalQtyRejected" disabled placeholder="Enter" class="form-control" ${isView ? `disabled` : ``}/>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-6 form-group" style="display:none;">
                                        <label>Total Approved Quantity</label>
                                        <input type="hidden" id="hdbQtyExistingApproved" />
                                        <input type="text" id="txtTotalQtyApproved" disabled placeholder="Enter" class="form-control" />
                                    </div>

                                    <div class="col-md-4 col-sm-6 form-group">
                                        <label>Final Result</label>
                                        <select id="txtFinalResultMicro" class="form-control applyselect MandateRejected" onchange="HideErrorMessage(this)" ${isView ? `disabled` : ``} >
                                            <option value="Select">Select</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Partial Approved">Partial Approved</option>
                                        </select>
                                        <span id="sptxtFinalResultMicro" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div class="col-md-12 form-group">
                        <label>Remarks (Optional)</label>
                        <textarea class="form-control" maxlength="250" id="txtRemarkMicro" placeholder="Enter" ${isView ? `disabled` : ``} ></textarea>

                    </div>
                    <div class="col-md-12 form-group">

                        <input type="checkbox" id="returnprocess" name="">
                        <label for="returnprocess">
                            Please go ahead with the return process for the rejected goods
                        </label>

                    </div>
                </div>

            </div>
            <div class="side-footer justify-content-end">
                <div class="w-400 d-flex gap-10">
                    <div class="w-400 d-flex gap-10">
                        <div class="w-400 d-flex gap-10">

                         ${!isView ?
            `   <button type="button" data-toggle="modal" data-dismiss="modal" class="btn btn-lg cancelbtn">Cancel</button>
                        <button type="button" id="rejected_submit" class="btn btn-lg actionbtn" onclick="ShowRejectedCnfMsg()">Submit</button>` : ``
        }

                    </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
`

    closeView();

    $('#view_dynamic_fms').html('');

    // $('#dynamic_fms').html('');

    $('#dynamic_fms').html(qc3);

    let obj = tblData.find(input => input.GRNItemId == grnItem_Id)

    ShowQCMappingRejected(obj.ITEM_ID, grnItem_Id, isView);
}

var RejectedQcId = 0;
function ShowQCMappingRejected(itemId, grnIItemId, isView) {
    ItemIdData = itemId;
    GItemId = grnIItemId;
    var model = {
        ID: itemId,
        ParentId: 0,
        GRNItemId: GItemId,
        IsMicro: true,
        IsRejected: false
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "QCTask_2";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {

        console.log(response);
        var data = response.data.data.Table;

        var data2 = response.data.data.Table2;

        var data1 = response.data.data.Table1;

        $('#lbArnNumberRejected').text(data[0].ARNUMBER);
        $('#lbDocDateRejected').text(data[0].DOCDate ? ChangeDateFormatToddMMYYYWithSlace(data[0].DOCDate) : '');
        $('#lbBatchNumerRejected').text(data[0].BatchOrLot);
        $('#lbItemNameRejected').text(data[0].ITEM_NAME);
        $('#lbItemCodeRejected').text(data[0].ITEM_CODE);
        $('#hdbQty').val(data[0].TotalQty);


        $('#txtChemistRejected').text(data[0].emp_name);
        $('#lbSuppNameRejected').text(data[0].SupplierName);
        $('#txtManufacturingDateRejected').text(data1[0].MfgFinalDate ? ChangeDateFormatToddMMYYYWithSlace(data1[0].MfgFinalDate) : '');
        $('#txtExpDateRejected').text(data1[0].ExpFinalDate ? ChangeDateFormatToddMMYYYWithSlace(data1[0].ExpFinalDate) : '');

        $('#txtRejectedQtyRejected').val('0');

        RejectedQcId = data1[0].QCID;
        $('#lbNoOfContainers4').text(data1[0].NoOfContainers);
        if ($('#completed').hasClass('active')) {
            var row = data1.find(input => input.QCID == RejectedQcId);

            var row1 = data1.filter(input => input.IsMicrobiological == 1)
            $('#hdbQtyExistingRejected').val(row.RejectedQty);
            $('#txtSampleQty2').val(row.SampleQty)
            $('#hdnUOM').val(data[0].UOM);
            $('#txtTotalQtyRejected').val(row1[0].RejectedQty + ' ' + data[0].UOM);
            $('#hdntxtTotalQtyRejected').val(row1[0].RejectedQty);
            $('#txtApprovedQtyRejected').val(row1[0].ApprovedQty + ' ' + data[0].UOM);
            $('#hdntxtApprovedQtyRejected').val(row1[0].ApprovedQty);
            $('#txtRemarkMicro').val(row1[0].MicroRemark);
            $('#hdbQtyRejected').val(parseFloat(data[0].TotalQty) - parseFloat(row.RejectedQty));
            $('#lbQtyRejected').text(data[0].TotalQty + ' ' + data[0].UOM);
            $('#txtFinalResultMicro').val(row1[0].MicroFinalResult == '' || row1[0].MicroFinalResult == null ? 'Select' : row1[0].MicroFinalResult).trigger('change');
            $('#viewRejQty').hide();
            $('#rejected_submit').hide();
            $('#txtRejectedQtyRejected').prop('disabled', true);

            $('#returnprocess').prop('checked', true);
            $('#returnprocess').prop('disabled', true);

            if (data2.length > 0) {
                addLotData(data2, isView);
            }

            setTimeout(function () {
                FreezeAllQCTestModals();
            }, 200);

        }
        else {
            var row = data1.find(input => input.QCID == RejectedQcId);

            var row1 = data1.filter(input => input.IsMicrobiological == 1)
            $('#hdbQtyExistingRejected').val(row.RejectedQty);
            $('#txtSampleQty2').val(row.SampleQty)
            $('#hdnUOM').val(data[0].UOM);
            $('#txtTotalQtyRejected').val(row1[0].RejectedQty + ' ' + data[0].UOM);
            $('#hdntxtTotalQtyRejected').val(row1[0].RejectedQty);
            $('#txtApprovedQtyRejected').val(row1[0].ApprovedQty + ' ' + data[0].UOM);
            $('#hdntxtApprovedQtyRejected').val(row1[0].ApprovedQty);
            $('#txtRemarkMicro').val(row1[0].MicroRemark);
            $('#hdbQtyRejected').val(parseFloat(data[0].TotalQty) - parseFloat(row.RejectedQty));
            $('#lbQtyRejected').text(data[0].TotalQty + ' ' + data[0].UOM);
            $('#txtFinalResultMicro').val(row1[0].MicroFinalResult == '' || row1[0].MicroFinalResult == null ? 'Select' : row1[0].MicroFinalResult).trigger('change');
            $('#viewRejQty').hide();
            $('#rejected_submit').hide();
            $('#txtRejectedQtyRejected').prop('disabled', true);

            $('#returnprocess').prop('checked', true);
            $('#returnprocess').prop('disabled', true);

            if (data2.length > 0) {
                addLotData(data2, isView);
            }
            // done commented by santosh due to data is not bding 
            //var row = data1.find(input => input.QCID == RejectedQcId);
            //$('#hdnUOM').val(data[0].UOM);
            //$('#txtRemarkMicro').val('');
            //$('#viewRejQty').show();
            //$('#txtSampleQty2').val(row.SampleQty);
            //$('#hdbQtyExistingRejected').val(row.RejectedQty);
            //$('#hdbQtyExistingApproved').val(row.ApprovedQty);
            //$('#txtTotalQtyRejected').val(row.RejectedQty + ' ' + data[0].UOM);
            //$('#hdntxtTotalQtyRejected').val(row.RejectedQty);
            //$('#txtTotalQtyApproved').val(row.ApprovedQty);

            //$('#lbQtyRejected').text(data[0].TotalQty + ' ' + data[0].UOM);
            //$('#txtApprovedQtyRejected').val((parseFloat(data[0].TotalQty) - parseFloat(row.RejectedQty)).toString() + ' ' + data[0].UOM);
            //$('#hdntxtApprovedQtyRejected').val(parseFloat(data[0].TotalQty) - parseFloat(row.RejectedQty));
            //$('#hdbQtyRejected').val($('#txtApprovedQtyRejected').val());
            //$('#txtRejectedQtyRejected').prop('disabled', false);
            //$('#returnprocess').prop('checked', false);
            //$('#returnprocess').prop('disabled', false);
            //$('#rejected_submit').show();

        }
        var filteredData = data1.filter(input => input.IsMicrobiological == 1)
        BindTableQCTestMicro(filteredData, isView);
    });

    $("#qctestmappingRejected").modal('show');
}

function addLotData(arr, isView) {

    $("#dtStockTransfer tbody").html('');

    for (i = 0; i < arr.length; i++) {
        var RowId = $("#dtStockTransfer tbody tr").length + 1;
        let newRow = `
            <tr>
                <td>
                    
                </td>                
                
                <td>
                <input type="text" id="txtUsedMedia_${RowId}" value="" class="form-control MandateRejected" value=""  oninput="HideErrorMessage(this)">
                    <span id="sptxtUsedMedia_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                </td>
                     <td>

                    <input type="text" id="txtLotNumber_${RowId}" class="form-control MandateRejected" value=""   oninput="HideErrorMessage(this); alphanumeric(this)">
                     <span id="sptxtLotNumber_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </td>

                
            </tr>`;

        // Append new row
        $(".itemsinformationMedia tbody").append(newRow);

        $(`#txtUsedMedia_${RowId}`).val(arr[i].UsedMedia);
        $(`#txtLotNumber_${RowId}`).val(arr[i].LotNumber);

        if (isView) {
            $('#dtStockTransfer').find('input').prop('disabled', true).addClass('bg-light');
        }
    }

}
function BindTableQCTestMicro(filteredData, isView) {
    console.log(filteredData);
    $('#dtStockTransferMicro').DataTable().destroy();
    $('#dtStockTransferMicro').on('draw.dt', function () {
        $('.datepicker').daterangepicker({
            opens: 'right',
            singleDatePicker: true,
            showDropdowns: true,
            autoApply: true,
            autoUpdateInput: false,
            parentEl: 'body', // Ensures it is not constrained in table
            locale: {
                format: 'DD/MM/YYYY'
            }
        }).on('apply.daterangepicker', function (ev, picker) {
            // Set selected date
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
            // Show the × icon
            $(this).siblings('.clear-date').show();
        });

        // Clear date when clicking the × icon
        $('.clear-date').on('click', function () {
            const $input = $(this).siblings('.datepicker'); // ✅ fixed selector
            $input.val('');          // Clear input
            $(this).hide();          // Hide × icon
        });

        // Hide × if input cleared manually
        $('.datepicker').on('input', function () {
            if ($(this).val() === '') {
                $(this).siblings('.clear-date').hide();
            }
        });
        // Open datepicker when clicking the icon
        $('.input-group-text').on('click', function () {
            $(this).closest('.input-group').find('.datepicker').focus();
        });

        // Freeze date and time fields if isView = true
        if (isView) {
            // Disable all text, date, and time inputs
            $('#dtStockTransferMicro').find('input').prop('disabled', true).addClass('bg-light');

            // Hide clear (×) icons
            $('#dtStockTransferMicro').find('.clear-date').hide();

            // Prevent opening datepickers or clicking icons
            $('#dtStockTransferMicro').find('.input-group-text').css('pointer-events', 'none').css('opacity', '0.6');
        }

    });
    $('#dtStockTransferMicro').DataTable({
        "data": filteredData,  // assuming the returned data is directly the table array
        "paging": false,
        "info": false,
        "searching": false, // This hides the search box
        order: [[4, 'asc']],
        "columns": [
            { "data": "TestName" },
            { "data": "ResultType" },
            { "data": "MeasuringUnit" },
            { "data": "ApprovedRange" },
            { data: "QCID", visible: false },

            {
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {

                    return '<div class="d-flex  gap-10">' +
                        '<div class="w-100" >' +
                        '<div class="input-group">' +
                        '<input type="text" id="tbIncubationDate_' + row.QCID + '_' + row.GrnItemQCResultId + '" value="' + ChangeDateFormatToddMMYYYWithSlace(row.IncubationDate) + '" autocomplete="off" onblur="HideErrorMessage(this)" class="datepicker form-control MandateRejected" placeholder="DD/MM/YYYY"> ' +
                        '<span class="clear-date">×</span>' +
                        '<div class="input-group-append calendar-freeze">' +
                        '<span class="input-group-text bg-white"><img src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span>' +
                        '</div>' +
                        '<span id="sptbIncubationDate_' + row.QCID + '_' + row.GrnItemQCResultId + '"class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        '</div>' +
                        '<div class="w-100">' +
                        '<input type="time" value="' + row.IncubationTime + '"  id="tbIncubationTime_' + row.QCID + '_' + row.GrnItemQCResultId + '"  autocomplete="off" onchange="HideErrorMessage(this)" class="form-control MandateRejected"><span id="sptbIncubationTime_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        '</div>'


                }
            },
            {
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {

                    return '<div class="d-flex  gap-10">' +
                        '<div class="w-100" >' +
                        '<div class="input-group">' +
                        '<input type="text" id="tbObservationDate_' + row.QCID + '_' + row.GrnItemQCResultId + '" value="' + ChangeDateFormatToddMMYYYWithSlace(row.ObservationDate) + '"  autocomplete="off" onblur="HideErrorMessage(this)"class="datepicker form-control MandateRejected" placeholder="DD/MM/YYYY"> ' +
                        '<span class="clear-date">×</span>' +
                        '<div class="input-group-append calendar-freeze">' +
                        '<span class="input-group-text bg-white"><img src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span>' +
                        '</div>' +
                        '</div>' +
                        '<span id="sptbObservationDate_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        '<div class="w-100">' +
                        '<input type="time" value="' + row.ObservationTime + '" id="tbObservationTime_' + row.QCID + '_' + row.GrnItemQCResultId + '" onchange="HideErrorMessage(this)" autocomplete="off" class="form-control MandateRejected"> <span id="sptbObservationTime_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +

                        '</div>'



                }
            },
            {
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {

                    var val = row.NegativeControl == null ? '' : row.NegativeControl;

                    return '<input type="text"   autocomplete="off" value="' + val + '"   class="form-control MandateRejected" oninput="HideErrorMessage(this)" placeholder="Enter" id="tbNegativeControl_' + row.QCID + '_' + row.GrnItemQCResultId + '"> <span id="sptbNegativeControl_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';

                }
            },

            {
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {
                    if (row.ResultType == 'Text')
                        return '<input type="text" value="' + row.ResultMin + '" autocomplete="off"  onkeypress="return RestrictNoAlpha(event)" onpaste="return RestrictNoAlphaPaste(event)"    class="form-control alphaNumKey MandateRejected" placeholder="Enter" id="tbResultMin_' + row.QCID + '_' + row.GrnItemQCResultId + '" oninput="HideErrorMessage(this)"> <span id="sptbResultMin_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';
                    else
                        return '<input type="text" value="' + row.ResultMin + '" autocomplete="off"   class="form-control MandateRejected" placeholder="Enter" id="tbResultMin_' + row.QCID + '_' + row.GrnItemQCResultId + '" oninput="HideErrorMessage(this)"> <span id="sptbResultMin_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';

                }
            }
        ],
        columnDefs: [
            { targets: 4, type: 'num' } // ensure numeric sort (not lexicographic "1,10,2")
        ]
    });

    $('body').on('apply.daterangepicker', '.datepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
        $(this).siblings('.clear-date').show();

        var inputId = $(this).attr('id');
        var errorSpanId = 'sp' + inputId;
        $('#' + errorSpanId).hide();
    });
}

function FreezeAllQCTestModals() {
    const modals = ['#qctestmappingInitiated', '#qctestmappingRejected'];

    modals.forEach(function (modalSelector) {
        const $modal = $(modalSelector);

        // Disable all inputs, selects, textareas, and buttons  
        $modal.find('input, select, textarea, button').prop('disabled', true);

        // Disable clear date icons  
        $modal.find('.clear-date').css({
            'pointer-events': 'none',
            'opacity': 0.5,
            'cursor': 'not-allowed'
        });

        //  Freeze only the calendar icons
        $modal.find('.input-group-append').addClass('calendar-freeze');

        // Disable clickable icons (add, delete, etc.)
        $modal.find('[data-toggle="tooltip"], .cursor-pointer, .close, .clear-date').css({
            'pointer-events': 'none',
            'opacity': '0.5',
            'cursor': 'not-allowed'
        });

        //  Allow modal close (don’t freeze)
        $modal.find('[data-dismiss="modal"]').prop('disabled', false).css({
            'pointer-events': 'auto',
            'opacity': '1',
            'cursor': 'pointer'
        });

        // Disable checkboxes
        $modal.find('input[type="checkbox"]').prop('disabled', true);

        // Clear and hide all error messages
        $modal.find('.field-validation-error').text('').hide();

        // Hide submit buttons  
        $modal.find('#initiatedBtn, #rejected_submit').hide();
    });
}


//#endregion

//#region : Technical Doc
function getTechnicalAllStepsView(techDoc_Id, StepNo, fms_id) {

    if (techDoc_Id > 0) {
        var model =
        {
            ID: techDoc_Id,
            Doc: 'Technical Doc'
        };

        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'TechnicalDoc_101' }, 'GET', function (response) {

            // Step 2 Attachment
            for (var i = 0; i < response.data.data.Table1.length; i++) {
                var fileName = response.data.data.Table1[i].ActualFileName;
                var fileType = response.data.data.Table1[i].FileType;
                var type = response.data.data.Table1[i].Type;
                var fileUrl = response.data.data.Table1[i].FileUrl;
                var fFd = response.data.data.Table1[i].AttachmentId;
                var fSize = response.data.data.Table1[i].FileSize;
                var newfileName = response.data.data.Table1[i].NewFileName;
                var attachmentType = response.data.data.Table1[i].AttachmentType;
                //Check type and load
                if (attachmentType == 'Step2') {
                    LoadFileData2(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                    $('#NoUploadFile2').hide();
                    $('#ShowUploadFile2').show();
                }
            }
        });

        //End
    }

    var techDoc =
        `<div class="modal fade drawer right-align" id="downloadTechnicalDocStep2" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 1 - Download Upload Documents</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" onclick="closeStep1('downloadTechnicalDocStep2')" />
            </div>
            <div class="modal-body mb-100">
                <!-- open -->
                <div class="row">
                    <div class="col-sm-12 form-group">
                        <p class="m-0 nofile" id="NoUploadFile2">No Upload</p>
                        <div class="section-container fileuploadview  section-container-popup ">
                            <!--  -->
                            <div class="document-images hidden" id="ShowUploadFile2">
                                <div id="downloadDocStep2" class="document-images"></div>
                            </div>
                            <!--  -->
                        </div>
                    </div>

                </div>
                <!-- End -->

                <div class="col-sm-12 form-group">
                    <label class="text-muted mb-0">Type Of Document </label>
                    <p id="view_doc"></p>
                </div>

                <div class="col-sm-12 form-group">
                    <div class="toggle-card bg-bgl">
                        <div class="toggle-card-header toggle-info">
                            <h4 class="toggle-card-title">Item Information</h4>
                            <span class="toggle-card-icon"><img src="../../assets/images/icons/help/arrow-down.png" class="icon-sm" alt=""></span>
                        </div>
                        <div class="toggle-containe toggle-info-content">
                            <div class="row">
                                <div class="col-sm-12 form-group ">
                                    <label class="text-gray mb-0">Item Name</label>
                                    <p id="txtItem"></p>
                                </div>

                                <div class="col-sm-12 form-group" id="formView">
                                    <label class="text-gray mb-0">Formulation Category</label>
                                    <p id="txtFormCate"></p>
                                </div>

                                <div class="col-sm-12 form-group" id="fragView" style="display: none;">
                                    <label class="text-gray mb-0">Fragrance</label>
                                    <p id="txtFragrance"></p>
                                </div>

                                <div class="col-sm-12 form-group" id="colorView" style="display: none;">
                                    <label class="text-gray mb-0">Colour</label>
                                    <p id="txtColour"></p>
                                </div>

                                <div class="col-sm-12 form-group" id="packegingView" style="display: none;">
                                    <label class="text-gray mb-0">Packaging Type</label>
                                    <p id="txtPackegingType"></p>
                                </div>
                                <div class="col-sm-12 form-group">
                                    <label class="text-gray mb-0">Target Price (₹)</label>
                                    <p id="txtTargetPrice"></p>
                                </div>


                                <div class="col-sm-12 form-group" id="viewReq">
                                    <label class="text-gray mb-0">Requirement/Description</label>
                                    <p id="requirements"></p>
                                </div>

                                <div class="col-sm-12 form-group" id="viewMust" style="display: none;">
                                    <label class="text-gray mb-0">Must have ingredients</label>
                                    <p id="mustIngredients"></p>
                                </div>


                                <div class="col-sm-12 form-group" id="viewMustNot" style="display: none;">
                                    <label class="text-gray mb-0">Must not have ingredients</label>
                                    <p id="mustnotingredients"></p>
                                </div>

                                <div class="col-sm-12 form-group" id="viewAtt">
                                    <label class="text-gray mb-0">Attachment</label>
                                    <p><a href="" target="blank" id="item_att"></a></p>
                                </div>

                            </div>
                        </div>

                    </div>



                </div>



            </div>
        </div>
    </div>
</div>
    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(techDoc);

    loadTechDocByTask(StepNo);

    showTechDocData(techDoc_Id);

    $('#downloadTechnicalDocStep2').modal('show');

}

// Preview the file based on its type



function LoadFileData2(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile2(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile2(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "video") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <video class="preview-video" controls>
                            <source src="${e.target.result}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile2(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile2(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile2(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
         <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile2(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file2", "document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("downloadDocStep2").appendChild(newDocument);
}

function DownloadItemFile2(ctr) {
    var fileDetails = ctr.id.split('||');
    var fileURl = fileDetails[0];
    var fileName = fileDetails[2];

    if (fileURl != null || fileURl != undefined) {
        var stSplitFileName = fileName.split(".");
        var link = document.createElement("a");
        link.download = stSplitFileName[0];
        link.href = fileURl;
        link.click();
    }
}

function loadTechDocByTask(taskNo) {
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'TechnicalDoc_102',
        modelData: JSON.stringify({
            TaskNo: taskNo,
            Type: taskNo == 2 ? 3 : 0
        })
    };

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tblData = response.data.Records;
    });
}
function showTechDocData(id) {

    Edit_Id = id;

    var data = tblData.find(input => input.ID == id);
    console.log(data);
    if (!data) return;

    var TaskNo = 1;
    $('#view_doc').html(data.TypeOfDoc);

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


    $('#txtItem').text(data.ItemName || '');
    $('#txtFormCate').text(data.FormCate || '');
    $('#txtFragrance').text(data.Fragrance || '');
    $('#txtColour').text(data.Color || '');
    $('#txtPackegingType').text(data.PackegingType || '');
    $('#txtTargetPrice').text(data.TargetPrice !== null ? `₹ ${data.TargetPrice}` : '');
    $('#requirements').text(data.Requirements || '');
    $('#mustIngredients').text(data.MustIngredients || '');
    $('#mustnotingredients').text(data.MustNotIngredients || '');

    if (data.FileURL.length <= 1) {
        $('#viewAtt').hide()
    }
    else {
        $('#item_att').attr('href', '#');
        $('#item_att').html();

        $('#item_att').on('click', function () {
            handleTaskFile(data.FileURL, data.ActualFileName)
        })


        $('#item_att').html(data.ActualFileName);
        $('#viewAtt').show();
    }

    if (data.FileURL.length <= 1) {
        $('#viewAtt1').hide()
    }
    else {
        $('#item_att1').attr('href', '#');

        $('#item_att1').on('click', function () {
            handleTaskFile(data.FileURL, data.ActualFileName)
        })

        $('#item_att1').html(data.ActualFileName);
        $('#viewAtt1').show()
    }

}


function SetZero(ctrl) {
    let val = parseFloat(ctrl.value);
    if (isNaN(val) || val < 0) {
        ctrl.value = '';
    }
}



//#endregion

function bindItemMasterGridFilter() {

    let filterData = tblData;

    var taskNo = $("#ddlTask").val() === 'All' ? '0' : $("#ddlTask").val();

    if (taskNo != '0') {

        filterData = tblData.filter(row => row.TaskNo == (taskNo - 1));

    }

    if (filterData.length > 0) {

        gridOptions.api.setRowData(filterData);

    } else {

        if (globalGridOptions != null)
            gridOptions.api.setRowData([]);

    }

}



function showTaskModal(id, authToken, FMS_Id) {
    $.get('/Account/GetTaskStatusModal', { id: id, auth: authToken, FMS_Id: FMS_Id, }, function (data) {
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

    if (!data.FileURL || (data.FileURL && data.FileURL.length <= 1)) {
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
    })


    var chemId = data.ChemistId > 0 ? data.ChemistId : 'Select';
    var baseId = data.BaseItem_Id > 0 ? data.BaseItem_Id : 'Select';

    var obj5 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 9,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlBaseItem', obj5, 'Select', false, baseId);





    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 7,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }

    LoadMasterDropdown('txtChemist', obj2, 'Select', false, chemId);

    $('#ddlBaseItem').select2();


    $('#txtChemist').select2();

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
            Type: 'SAMP6PC',
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
                bindDynamicAgGrid();
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
            if (Type == 'SAMP2PC') {
                $('#markdonesecond').modal('hide');
            }
            else if (Type == 'SAMP3PC') {
                $('#markdone3').modal('hide');
            }
            else if (Type == 'SAMP4PC') {
                $('#markdone4').modal('hide');
            }
            // BindData();

            bindDynamicAgGrid();
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
            IsUrgent: $('#urgent').prop('checked') == true ? 1 : 0,
            Type: 2
        }

        var jsonstring = JSON.stringify(obj);

        let GenericModeldata = {
            ScreenID: "Sample_EnterBasicInfo_2",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonstring
        };


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                closeStep1('markdone');
                // BindData();
                bindDynamicAgGrid();
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

//#region : 06092025

function handleTechnicalDocStep2(rowId, mode) {

    showData(rowId);
    if (mode === 'mark done') {
        $('#technicalDocStep2').data('row-id', rowId).modal('show');
    } else if (mode === 'view') {
        bindTechnicalDocDetById(rowId);
        $('#downloadTechnicalDocStep2').data('row-id', rowId).modal('show');
    }
}

async function SaveTechnicalDocStep2() {
    const rowId = $('#technicalDocStep2').data('row-id');
    console.log('Saving data for row ID:', rowId);

    if (rowId > 0) {
        var obj =
        {
            FolderNames: "TechnicalDocuments/"
        }
        var type = 1;//This is for  common upload in attachment folder.
        const jsonString = JSON.stringify(obj);
        const result = await MultiFileUploadWithoutAync("fileRefDocStep2", jsonString, type, fileDataCollection2);
        var fileData = [];

        var finalFileData = [];

        if (result.Data != undefined) {
            fileData = JSON.parse(result.Data).FileModelList;
            fileData = fileData.concat(fileDatalList);
            finalFileData = finalFileData.concat(fileData);
        }
        else {
            fileData = fileModelList;
        }

        finalFileData = fileModelList.concat(finalFileData);

        // Mandatory file upload validation
        if (fileData.length == 0) {
            FailToaster("Please upload at least one reference document.");
            return;
        }

        // ✅ File count validation
        if (finalFileData.length > 10) {
            FailToaster(finalFileData.length + " Files. You cannot upload more than 10 files for Reference Doc Step 2.");
            return;
        }
        var orderModel =
        {
            TechnicalDocId: rowId,
            RefDocStep2: fileData
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(orderModel);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "TechnicalDoc_103",
            Operation: rowId > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                setTimeout(function () {
                    RedirectUrl();
                }, 2000);
            }

        });
    }

    // Use rowId in AJAX or other logic
}

//#endregion

function initializeDatePickers() {
    $('.datepicker').daterangepicker({
        opens: 'right',
        singleDatePicker: true,
        showDropdowns: true,
        autoApply: true,
        autoUpdateInput: false,
        parentEl: 'body', // Ensures it is not constrained in table
        locale: {
            format: 'DD/MM/YYYY'
        }
    }).on('apply.daterangepicker', function (ev, picker) {
        // Set selected date
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
        // Show the × icon
        $(this).siblings('.clear-date').show();
    });

    // Clear date when clicking the × icon
    $('.clear-date').off('click').on('click', function () {
        const $input = $(this).siblings('.datepicker');
        $input.val('');          // Clear input
        $(this).hide();          // Hide × icon
    });

    // Hide × if input cleared manually
    $('.datepicker').off('input').on('input', function () {
        if ($(this).val() === '') {
            $(this).siblings('.clear-date').hide();
        }
    });

    // Open datepicker when clicking the calendar icon
    $('.input-group-text').off('click').on('click', function () {
        $(this).closest('.input-group').find('.datepicker').focus();
    });

    // Adjust position on show
    $('.datepicker').off('show.daterangepicker').on('show.daterangepicker', function () {
        var $calendar = $('.daterangepicker');
        var inputOffset = $(this).offset();
        var inputHeight = $(this).outerHeight();
        var windowHeight = $(window).height();
        var calendarHeight = $calendar.outerHeight();

        if ((inputOffset.top + inputHeight + calendarHeight) > windowHeight) {
            // Open above
            $calendar.css({
                top: inputOffset.top - calendarHeight - 5 + 'px',
                left: inputOffset.left + 'px'
            });
        } else {
            // Open below
            $calendar.css({
                top: inputOffset.top + inputHeight + 5 + 'px',
                left: inputOffset.left + 'px'
            });
        }
    });
}

// Call once on page load
$(function () {
    initializeDatePickers();
});


function parseDDMMMYYYY(dateStr) {
    const months = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const [dayStr, monthStr, yearStr] = dateStr.split('-');
    const day = parseInt(dayStr, 10);
    const month = months[monthStr];
    const year = parseInt(yearStr, 10);

    return new Date(year, month, day);
}
// 🔹 Restrict typing (keypress) to alphabets only
function RestrictNoAlpha(e) {
    //let char = String.fromCharCode(e.which);
    //if (!/^[a-zA-Z ]+$/.test(char)) {
    //    e.preventDefault();  // block numbers & symbols
    //    return false;
    //}
    //return true;

    console.log(this);
}

// 🔹 Restrict paste (clean invalid characters)
function RestrictNoAlphaPaste(e) {
    //let pastedData = (e.clipboardData || window.clipboardData).getData('text');
    //if (/[^a-zA-Z]/.test(pastedData)) {
    //    e.preventDefault(); // block invalid paste
    //    // ✅ optional: auto-clean and insert only letters
    //    let cleanData = pastedData.replace(/[^a-zA-Z]/g, "");
    //    document.execCommand("insertText", false, cleanData);
    //    return false;
    //}
    //return true;

    console.log(this);
}






//  ------------ ************ Section Otd FMS ***************** ----------------- //


var orderItemTable;


function closeView() {
    $('.modal').modal('hide'); // hide any open modals
    $('.modal-backdrop').remove(); // remove leftover backdrops
    $('body').removeClass('modal-open'); // reset scroll lock
    $('body').css('padding-right', ''); // reset padding if added
}



function showModalFieldStep1(rowId, StepNo) {

    var step1 =
        `<div class="modal fade drawer right-align" id="markdoneStep1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header side-header justify-content-between d-flex">
        <h2>Step 1 - FDA Approval</h2>
        <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
             /> </div>
      <div class="modal-body mb-100" >
        <!-- open -->
        <div class="row">
            <div class="col-sm-12 form-group">
                <label class="text-gray mb-0">FG Item Name</label>
                <p id="itemName"></p>
          </div>

          <div class="col-sm-12 form-group">
                <label class="text-gray mb-0">Custome Brand Name</label>
                <p id="custBrandName"></p>
          </div>
           <div class="col-sm-12" ><hr class="mb-1" /></div>

           <div class="col-sm-12 form-group">
            <label for="state" class="mb-0">Please confirm does client want to apply FDA <sup>*</sup></label>
            <select class="form-control applyselect MandateStep1" id="ddlApplyFDA" name="" onchange="HideErrorMessage(this);">
              <option value="Select">Select</option>
              <option value="1">Yes</option>
              <option value="2">No</option>
            </select>
            <span id="spddlApplyFDA" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
          </div>

          <div class="col-sm-12 form-group">
            <label for="state" class="mb-0">Assigned CRR</label>
            <select class="form-control applyselect" id="ddlCrr" name="" onchange="HideErrorMessage(this);">

            </select>
          </div>


        </div>

         <!-- Show Sale Order details -->
         ${saleOrderDetById()}

        <div class="side-footer">
          <a href="#" class="btn btn-lg actionbtn" onclick="SaveStep1(${rowId}, ${StepNo})">Submit</a>
        </div>
        <!-- End -->

      </div>
    </div>
  </div>
</div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step1);

    LoadMasterDropdown('ddlCrr', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 101,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }, 'Select', false, '');

    $('#ddlCrr').select2();

    /*setTimeout(() => getModalFieldDataByStepNo(rowId, StepNo), 200);      // Show record of step 1*/

    getModalFieldDataByStepNo(rowId, StepNo);      // Show record of step 1

    $('#markdoneStep1').modal('show');
}


async function DownLoadStep2Zip(order_itemid) {
    try {
        const model = {
            Id: order_itemid,
            Type: 15
        };

        const jsonString = JSON.stringify(model);

        CommonAjaxMethod(
            virtualPath + 'Generic/GetRecordsAsync',
            { modelData: jsonString, screenId: 'ERP_Samp5_101' },
            'GET',
            async function (response) {
                console.log("Response:", response);

                if (!response?.data?.data?.Table?.length) {
                    alert("No files found.");
                    return;
                }

                const data = response.data.data.Table;
                await downloadAllFilesAsZip(data);
            }
        );
    } catch (err) {
        console.error("Error in DownLoadStep2Zip:", err);
    }
}

async function downloadAllFilesAsZip(files) {
    try {
        const zip = new JSZip();


        for (const file of files) {
            const fileUrl = file.FileUrl.startsWith("http")
                ? file.FileUrl
                : baseURL + file.FileUrl;

            console.log("Downloading:", fileUrl);

            const response = await fetch(fileUrl);
            if (!response.ok) {
                console.warn(`Failed to fetch ${fileUrl}`);
                continue;
            }

            const blob = await response.blob();
            const safeName = sanitizeFileName(file.ActualFileName);
            zip.file(safeName, blob);
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "OrderFiles.zip");
    } catch (error) {
        console.error("Error creating ZIP:", error);
        alert("Error creating ZIP file. Check console for details.");
    }
}

function sanitizeFileName(name) {
    return name.replace(/[<>:"/\\|?*]+/g, "_");
}


function showModalFieldNewStep2New(rowId, StepNo, ItemOTDStatus) {
    var step2 =
        `<div class="modal fade drawer right-align" id="markdoneNewStep2"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 2 - Pending Artwork</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
              <div class="modal-body mb-100" >
                <!-- open -->
                <div class="row">

                 <div class="col-sm-12 form-group">
                    <label class="text-gray mb-0">FG Item Name</label>
                    <p id="itemName"></p>
                </div>

                <div class="col-sm-12 form-group">
                    <label class="text-gray mb-0">Custome Brand Name</label>
                    <p id="custBrandName"></p>
                </div>
                <div class="col-sm-12" ><hr class="mb-1" /></div>

                <div class="col-sm-12 form-group">
                    <label for="state" class="mb-0">Type of Order Sourcing <sup>*</sup></label>
                    <p>From BO</p>
                </div>
                   <div class="col-sm-12 form-group">
                    <label for="state" class="mb-0">Order Type <sup>*</sup></label>
                    <p>New Order</p>
                  </div>

                  ${!viewOTD ?
            `<div class="col-sm-12 form-group">
                    <label for="locationname">Upload Artwork file for Label (Psd or ai.)</label>
                    <div class="section-container section-container-popup">
							        <div class="fileuploadview drag-area p-0 drag-area1">
							           <div class="uploadicon_text file-input-button" id="fileInputButton1">
								          <div class="uploadicon">
									         <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
								          </div>
								          <div class="uploadtext drag-file" id="dragFile1">
									         <h4>Drop files here or click to upload</h4>
									         <h6>This is a dropzone, drop files or click to browse</h6>
									         <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
								          </div>
							           </div>
							           <input type="file" id="fileAttachment1" class="file-input hidden" multiple />
							           <div id="documentImages1" class="document-images"></div>
							        </div>
				        </div>
                  </div>

                  <div class="col-sm-12 form-group">
                    <label for="locationname">Upload Artwork file for Box (Psd or ai.)</label>
                   <div class="section-container section-container-popup">
							        <div class="fileuploadview drag-area p-0 drag-area2">
							           <div class="uploadicon_text file-input-button" id="fileInputButton2">
								          <div class="uploadicon">
									         <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
								          </div>
								          <div class="uploadtext drag-file" id="dragFile2">
									         <h4>Drop files here or click to upload</h4>
									         <h6>This is a dropzone, drop files or click to browse</h6>
									         <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
								          </div>
							           </div>
							           <input type="file" id="fileAttachment2" class="file-input hidden" multiple  />
							           <div id="documentImages2" class="document-images"></div>
							        </div>
				        </div>
                  </div>

                   <div class="col-sm-12 form-group">
                    <label for="locationname">Upload Others</label>
                   <div class="section-container section-container-popup">
							        <div class="fileuploadview drag-area p-0 drag-area3">
							           <div class="uploadicon_text file-input-button" id="fileInputButton3">
								          <div class="uploadicon">
									         <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
								          </div>
								          <div class="uploadtext drag-file" id="dragFile3">
									         <h4>Drop files here or click to upload</h4>
									         <h6>This is a dropzone, drop files or click to browse</h6>
									         <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
								          </div>
							           </div>
							           <input type="file" id="fileAttachment3" class="file-input hidden" multiple  />
							           <div id="documentImages3" class="document-images"></div>
							        </div>
				        </div>
                  </div>`
            :

            `

								<div class="col-sm-12  form-group">
									<div class="card br-none p-0">
										<div class="card-header border-top-RL header-active br-none  d-flex justify-content-between ">
											<h2 class="title-two align-self-center">Material Photo Upload</h2>
											<div class="align-self-center"></div>
										</div>
										<div class="card-body view-form-group min-175 ">
											<p class="m-0 nofile" id="NoUploadFile1">No Upload</p>
											<div class="section-container fileuploadview hidden section-container-popup" id="ShowUploadFile1">
												<!--  -->
												<div id="documentImagesMP" class="document-images">

												</div>
												<!--  -->
											</div>
										</div>
									</div>
								</div>

								<div class="col-sm-12  form-group">
									<div class="card br-none p-0">
										<div class="card-header border-top-RL header-active br-none  d-flex justify-content-between ">
											<h2 class="title-two align-self-center">Material COA Upload</h2>
											<div class="align-self-center"></div>
										</div>
										<div class="card-body view-form-group min-175 ">
											<p class="m-0 nofile" id="NoUploadFile2">No Upload</p>
											<div class="section-container fileuploadview hidden section-container-popup" id="ShowUploadFile2">
												<!--  -->
												<div id="documentImagesMCU" class="document-images">

												</div>
												<!--  -->
											</div>
										</div>
									</div>
								</div>


								<div class="col-sm-12  form-group">
									<div class="card br-none p-0">
										<div class="card-header border-top-RL header-active br-none  d-flex justify-content-between ">
											<h2 class="title-two align-self-center">Attachment</h2>
											<div class="align-self-center"></div>
										</div>
										<div class="card-body view-form-group min-175 ">
											<p class="m-0 nofile" id="NoUploadFile3">No Upload</p>
											<div class="section-container fileuploadview hidden section-container-popup" id="ShowUploadFile3">
												<!--  -->
												<div id="documentImagesAtt" class="document-images">

												</div>
												<!--  -->
											</div>
										</div>
									</div>
								</div>`
        }
                </div>

                  <!-- Show Sale Order details -->
                   ${saleOrderDetById()}

                <div class="side-footer">
                  <a href="#" class="btn btn-lg actionbtn" onclick="SaveNewItemDocStep2 (${rowId}, ${StepNo}, '${ItemOTDStatus}')">Submit</a>
                </div>
                <!-- End -->

              </div>
            </div>
          </div>
    </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step2);

    // $('#markdoneNewStep2').modal('show');

    // Small timeout to allow DOM to process and ensure shown.bs.modal gets fired
    setTimeout(() => {
        $('#markdoneNewStep2').modal('show');
        getModalFieldDataByStepNo(rowId, StepNo);
    }, 500);

    // Optional: ensure initialization happens when modal is shown (handles timing quirks)
    // Add this once outside if not already present
    if (!window._qctestUploadModalBound) {
        $(document).on('shown.bs.modal', '#markdoneNewStep2', function () {
            const uploadZones = [
                { className: '.drag-area1', initFn: fileUploadWithPreview1 },
                { className: '.drag-area2', initFn: fileUploadWithPreview2 },
                { className: '.drag-area3', initFn: fileUploadWithPreview3 }
            ];

            uploadZones.forEach(({ className, initFn }) => {
                $(this).find(className).each(function () {
                    if (!this.dataset.uploadInit) {
                        try {
                            initFn(this);
                            this.dataset.uploadInit = '1';
                        } catch (err) {
                            console.error(`fileUpload init failed for ${className}`, err);
                        }
                    }
                });
            });
        });

        window._qctestUploadModalBound = true;
    }

    /* ----------------- end appended lines ----------------- */

    // Show record of step 2
}

function showModalFieldRepeatStep2(rowId, StepNo, ItemOTDStatus) {
    var step2 =
        `
<!-- When the order is repeat Order - mark Done  Popup-->
<div class="modal fade drawer right-align" id="markdoneRepeatOrderStep2"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header side-header justify-content-between d-flex">
        <h2>Step 2 - Pending Artwork</h2>
        <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
             /> </div>
      <div class="modal-body mb-100" >
        <!-- open -->
        <div class="row">

          <div class="col-sm-12 form-group">
                <label class="text-gray mb-0">FG Item Name</label>
                <p id="itemName"></p>
          </div>

          <div class="col-sm-12 form-group">
                <label class="text-gray mb-0">Custome Brand Name</label>
                <p id="custBrandName"></p>
          </div>
           <div class="col-sm-12" ><hr class="mb-1" /></div>

          <div class="col-sm-12 form-group">
            <label for="state" class="mb-0">Type of Order Sourcing <sup>*</sup></label>
            <p>From BO</p>
          </div>
           <div class="col-sm-12 form-group">
            <label for="state" class="mb-0">Order Type <sup>*</sup></label>
            <p>Repeat Order</p>
          </div>

          <div class="col-md-12 col-sm-5 form-group">
          <label>Does this have Repeat artwork or New?</label>
          <div class="d-flex flex-wrap gap-10">
            <input type="radio" id="radio-new" class="radio" name="artwork" value="New artwork">
            <label for="radio-new">New</label>

            <input type="radio" id="radio-repeat" class="radio" name="artwork" value="Repeat artwork">
            <label for="radio-repeat">Repeat</label>
          </div>
        </div>
        <div  class="col-sm-12  newartwork hidetwo" style="display:none;" >
         <div class="row">

                  ${!viewOTD ?
            `<div class="col-sm-12 form-group">
                    <label for="locationname">Upload Artwork file for Label (Psd or ai.)</label>
                    <div class="section-container section-container-popup">
							        <div class="fileuploadview drag-area p-0 drag-area1">
							           <div class="uploadicon_text file-input-button" id="fileInputButton1">
								          <div class="uploadicon">
									         <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
								          </div>
								          <div class="uploadtext drag-file" id="dragFile1">
									         <h4>Drop files here or click to upload</h4>
									         <h6>This is a dropzone, drop files or click to browse</h6>
									         <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
								          </div>
							           </div>
							           <input type="file" id="fileAttachment1" class="file-input hidden" multiple />
							           <div id="documentImages1" class="document-images"></div>
							        </div>
				        </div>
                  </div>

                  <div class="col-sm-12 form-group">
                    <label for="locationname">Upload Artwork file for Box (Psd or ai.)</label>
                   <div class="section-container section-container-popup">
							        <div class="fileuploadview drag-area p-0 drag-area2">
							           <div class="uploadicon_text file-input-button" id="fileInputButton2">
								          <div class="uploadicon">
									         <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
								          </div>
								          <div class="uploadtext drag-file" id="dragFile2">
									         <h4>Drop files here or click to upload</h4>
									         <h6>This is a dropzone, drop files or click to browse</h6>
									         <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
								          </div>
							           </div>
							           <input type="file" id="fileAttachment2" class="file-input hidden" multiple  />
							           <div id="documentImages2" class="document-images"></div>
							        </div>
				        </div>
                  </div>

                   <div class="col-sm-12 form-group">
                    <label for="locationname">Upload Others</label>
                   <div class="section-container section-container-popup">
							        <div class="fileuploadview drag-area p-0 drag-area3">
							           <div class="uploadicon_text file-input-button" id="fileInputButton3">
								          <div class="uploadicon">
									         <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
								          </div>
								          <div class="uploadtext drag-file" id="dragFile3">
									         <h4>Drop files here or click to upload</h4>
									         <h6>This is a dropzone, drop files or click to browse</h6>
									         <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
								          </div>
							           </div>
							           <input type="file" id="fileAttachment3" class="file-input hidden" multiple  />
							           <div id="documentImages3" class="document-images"></div>
							        </div>
				        </div>
                  </div>`
            :

            `

								<div class="col-sm-12  form-group">
									<div class="card br-none p-0">
										<div class="card-header border-top-RL header-active br-none  d-flex justify-content-between ">
											<h2 class="title-two align-self-center">Material Photo Upload</h2>
											<div class="align-self-center"></div>
										</div>
										<div class="card-body view-form-group min-175 ">
											<p class="m-0 nofile" id="NoUploadFile1">No Upload</p>
											<div class="section-container fileuploadview hidden section-container-popup" id="ShowUploadFile1">
												<!--  -->
												<div id="documentImagesMP" class="document-images">

												</div>
												<!--  -->
											</div>
										</div>
									</div>
								</div>

								<div class="col-sm-12  form-group">
									<div class="card br-none p-0">
										<div class="card-header border-top-RL header-active br-none  d-flex justify-content-between ">
											<h2 class="title-two align-self-center">Material COA Upload</h2>
											<div class="align-self-center"></div>
										</div>
										<div class="card-body view-form-group min-175 ">
											<p class="m-0 nofile" id="NoUploadFile2">No Upload</p>
											<div class="section-container fileuploadview hidden section-container-popup" id="ShowUploadFile2">
												<!--  -->
												<div id="documentImagesMCU" class="document-images">

												</div>
												<!--  -->
											</div>
										</div>
									</div>
								</div>


								<div class="col-sm-12  form-group">
									<div class="card br-none p-0">
										<div class="card-header border-top-RL header-active br-none  d-flex justify-content-between ">
											<h2 class="title-two align-self-center">Attachment</h2>
											<div class="align-self-center"></div>
										</div>
										<div class="card-body view-form-group min-175 ">
											<p class="m-0 nofile" id="NoUploadFile3">No Upload</p>
											<div class="section-container fileuploadview hidden section-container-popup" id="ShowUploadFile3">
												<!--  -->
												<div id="documentImagesAtt" class="document-images">

												</div>
												<!--  -->
											</div>
										</div>
									</div>
								</div>`
        }

                              </div>

                            </div>

                            <div  class="col-sm-12 form-group repeatartwork  hidetwo " style="display:none;">
                              <label for="locationname">Does it required internal review</label>
                                 <select class="form-control applyselect disableList" id="ddlRepeatStatusStep2" >
                                    <option value="Select">Select</option>
                                    <option value="1">Yes</option>
                                    <option value="2">No</option>
                                 </select>
                           </div>

                 <div class="col-sm-12">
                 <div id="showRejectionTextStep2" class="hide row">
                    <div class="col-sm-12 form-group">
                        <label for="">Reason for Rejection</label>
                        <p id="RejectionTextStep2"></p>
                    </div>
                     <div class="col-sm-6 form-group">
                        <label for="">Rejected By</label>
                        <p id="RejectedByStep2"></p>
                    </div>
                    <div class="col-sm-6 form-group">
                        <label for="">Rejected On</label>
                        <p id="RejectedOnStep2"></p>
                    </div>
                     <div class="col-sm-12 form-group">
                        <label for="">Rejected By Step No: <span id="RejectedByStepNo"></span></label>
                        
                    </div>
                    </div>
                </div>
        </div>

         <!-- Show Sale Order details -->
         ${saleOrderDetById()}

        <div class="side-footer">
          <!-- For New Artwork -->
         <div class="newartwork hidetwo hide yes w-100">
             <a href="#" class="btn btn-lg actionbtn" onclick="SaveRepeatItemDocStep2(${rowId}, ${StepNo}, '${ItemOTDStatus}')">Submit</a>
         </div>
         <!-- For Repeat Artwork -->
          <div class="repeatartwork hidetwo hide w-100">
            <a href="#" class="btn btn-lg actionbtn" onclick="SaveRepeatStatusOnlyStep2(${rowId}, ${StepNo}, '${ItemOTDStatus}')">Submit</a>
          </div>
        </div>
        <!-- End -->

      </div>
    </div>
  </div>
</div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step2);

    $('#markdoneRepeatOrderStep2').modal('show');

    $('#ddlRepeatStatusStep2').val(1).trigger('change');

    // Small timeout to allow DOM to process and ensure shown.bs.modal gets fired
    setTimeout(() => {
        // Clean state
        $('.newartwork').hide();
        $('.repeatartwork').hide();
        $('input[name="artwork"]').prop('checked', false);
        $('#taskinternalreview').val("Select");

        $(document).on('change', 'input[name="artwork"]', function () {
            const selectedValue = $(this).val();

            if (selectedValue === 'New artwork') {
                $('.newartwork').show();
                $('.repeatartwork').hide();
            } else if (selectedValue === 'Repeat artwork') {
                $('.repeatartwork').show();
                $('.newartwork').hide();
            }
        });
        getModalFieldDataByStepNo(rowId, StepNo);
    }, 500);

    // Optional: ensure initialization happens when modal is shown (handles timing quirks)
    // Add this once outside if not already present
    if (!window._qctestUploadModalBound) {
        $(document).on('shown.bs.modal', '#markdoneRepeatOrderStep2', function () {
            const uploadZones = [
                { className: '.drag-area1', initFn: fileUploadWithPreview1 },
                { className: '.drag-area2', initFn: fileUploadWithPreview2 },
                { className: '.drag-area3', initFn: fileUploadWithPreview3 }
            ];

            uploadZones.forEach(({ className, initFn }) => {
                $(this).find(className).each(function () {
                    if (!this.dataset.uploadInit) {
                        try {
                            initFn(this);
                            this.dataset.uploadInit = '1';
                        } catch (err) {
                            console.error(`fileUpload init failed for ${className}`, err);
                        }
                    }
                });
            });
        });

        window._qctestUploadModalBound = true;
    }

    /* ----------------- end appended lines ----------------- */

    // getModalFieldDataByStepNo(rowId, StepNo);      // Show record of step 2
}

function showModalFieldStep3(rowId, StepNo) {
    var step3 =
        `<div class="modal fade drawer right-align" id="markdoneStep3" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 3 - Graphic Review</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
              <div class="modal-body mb-100" >
                <!-- open -->
                <div class="row">

                  <div class="col-sm-12 form-group">
                    <label class="text-gray mb-0">FG Item Name</label>
                    <p id="itemName"></p>
                </div>

                <div class="col-sm-12 form-group">
                    <label class="text-gray mb-0">Custome Brand Name</label>
                    <p id="custBrandName"></p>
                </div>
                 <div class="col-sm-12" ><hr class="mb-1" /></div>

                  <div class="col-sm-12 form-group">
                    <label for="locationname">Please confirm Artwork is received and File is found ok</label>
                   <select class="form-control applyselect disableList" id="ddlConfirmArtworkGrapic">
                    <option value="Select">Select</option>
                    <option value="1">Approved</option>
                    <option value="2">Rejected</option>
                   </select>
                  </div>

                  <div class="col-sm-12 form-group">
                    <a href="#" onclick="DownLoadStep2Zip(${orderItemId})"  class="d-flex gap-5 align-self-center"><img src="../assets/images/icons/help/download-icon.png" alt="" class="icon-sm" /> Download Artwork</a>
                  </div>


                  <div class="col-sm-12 form-group rejected hide">
                        <input type="checkbox" id="Sendemail" name="type" value="">
                        <label for="Sendemail">Send email to Customer and CRR</label>
                   </div>

                  <div class="col-sm-12 form-group approved hide">
                    <p class="mb-2 fn-bold">Checklist of checking of artwork</p>
                    <ul class="list-item">
                      <li>Is the font size to be 3.5 pt.</li>
                      <li>Are we using CMYK Color Pallet.</li>
                      <li>Is the product weightage mentioned in front of the label.</li>
                      <li>Is the converted pack size matching with our actual pack size.</li>
                      <li>Are the dimensions perfect as per the PM/surface on which label to be pasted or box to be packed.</li>
                      <li>Are the botanical names mentioned with the particular ingredient.</li>
                      <li>Are the dimensions perfect as per the PM/surface on which label to be pasted or box to be packed.</li>
                      <li>Have we mentioned the color change for the product point on the artwork.</li>
                      <li>Are the batch details okay as given by QC.</li>
                      <li>Are the mfg and expiry details as per the standard.</li>
                      <li>Is the price per ml (USP details) as per the MRP.</li>
                      <li>Is the gap up to 5mm between the two ends of the label in length.</li>
                      <li>Is the barcode size up to or above 25mm*10mm so that barcode can get scanned.</li>
                      <li>Is the batch code area up to or above 20mm*9mm.</li>
                      <li>Are the storage and caution details there on the artwork.</li>
                      <li>Is the bleed area up to 5mm we skip on all the faces of the box.</li>
                      <li>Have we taken 2mm extra in lbh of box dimension as compared to PM.</li>
                      <li>Did we check “front design should be on 3rd face".</li>
                    </ul>
                  </div>

                </div>

               <!-- Show Sale Order details -->
                ${saleOrderDetById()}

                <div class="approved hide">
                    <div class="side-footer ">
                      <a href="#" class="btn btn-lg btn-warning" data-toggle="modal" data-target="#reasonpopupStep3">Reject</button>
                      <a href="#" class="btn btn-lg btn-success" onclick="SaveStep3(${rowId}, ${StepNo})">Approve</a>
                    </div>
                </div>

                <div class="rejected hide">
                    <div class="side-footer ">
                       <button type="submit" class="btn btn-lg actionbtn" data-toggle="modal" data-target="#reasonpopupStep3">Submit</button>
                    </div>
                </div>

                <!-- End -->

              </div>
            </div>
          </div>
        </div>


        <!-- Reason Popup -->

        <div class="modal modaloverlay" id="reasonpopupStep3">
           <div class="modal-dialog modal-dialog-centered modal-md">
              <div class="modal-content ">

              <!-- Modal Header -->
              <div class="modal-header">
                 <h4 class="modal-title text-left w-100">Reason for Rejection</h4>
                 <button type="button" class="close" data-dismiss="modal"><img src="../assets/images/icons/help/close-icon.png" class="closeicon"></button>
              </div>

              <!-- Modal body -->
              <div class="modal-body">
                 <div class="row">


                    <div class="form-group col-sm-12">
                       <label>Please enter Reason for Rejection <sup>*</sup></label>
                       <textarea class="form-control h-120 char-limit"  placeholder="Enter" data-maxlength="300" id="rejectionReasonStep3"></textarea>
                       <div class="text-right">
                          <small class="light-label counter">0/300</small>
                       </div>
                    </div>

                 </div>

              </div>

              <!-- Modal footer -->
              <div class="modal-footer">
                 <button type="button" class="btn btn-lg cancelbtn radius-24" data-dismiss="modal">Cancel</button>
                 <a href="#" class="btn btn-lg actionbtn" onclick="RejectStep3(${rowId}, ${StepNo})">Submit</a>
              </div>

              </div>
           </div>
        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step3);

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 3


    // Attach change handler after DOM is updated
    $(document).on('change', '#ddlConfirmArtworkGrapic', function () {
        var val = $(this).val();

        if (val === '1') {
            $('.approved').removeClass('hide');
            $('.rejected').addClass('hide');
        } else if (val === '2') {
            $('.rejected').removeClass('hide');
            $('.approved').addClass('hide');
        } else {
            $('.approved, .rejected').addClass('hide');
        }
    });


    $('#markdoneStep3').modal('show');
}

function showTaskModal(id, authToken, FMS_Id) {
    $.get('/Account/GetTaskStatusModal', { id: id, auth: authToken, FMS_Id: FMS_Id, }, function (data) {
        $('#yourModalContainer').html(data);
        $('#viewstatus').modal('show');
    });
}

function showModalFieldStep4(rowId, StepNo) {
    var step4 =
        `<div class="modal fade drawer right-align" id="markdoneStep4" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 4 - Legal Review</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
              <div class="modal-body mb-100" >
                <!-- open -->
                <div class="row">

                <div class="col-sm-12 form-group">
                    <label class="text-gray mb-0">FG Item Name</label>
                    <p id="itemName"></p>
                </div>

                <div class="col-sm-12 form-group">
                    <label class="text-gray mb-0">Custome Brand Name</label>
                    <p id="custBrandName"></p>
                </div>
                <div class="col-sm-12" ><hr class="mb-1" /></div>

                <div class="col-sm-12 form-group">
                    <label for="locationname">Please confirm Artwork is received as per your requirement</label>
                   <select class="form-control applyselect disableList" id="ddlConfirmArtworkLegal">
                    <option value="Select">Select</option>
                    <option value="1">Yes</option>
                    <option value="2">No</option>
                   </select>
                  </div>
                  <div class="col-sm-12 form-group">
                    <a href="#" onclick="DownLoadStep2Zip(${orderItemId})" class="d-flex gap-5 align-self-center"><img src="../assets/images/icons/help/download-icon.png" alt="" class="icon-sm" /> Download Artwork</a>
                  </div>
                  <div class="col-sm-12 form-group no hide">
                    <p class="mb-1">Please confirm Artwork is received as per your requirement</p>
                    <p class="text-p mb-2 bg-none br-1">Rejected</p>
                   </div>

                   <div class="col-sm-12 form-group no hide">
						<input type="checkbox" id="sendemailcustomer" name="" value="">
						<label for="sendemailcustomer"> Send email to Customer and CRR</label>
				  </div>


                  <div class="col-sm-12 form-group yes hide">
                    <p class="mb-1">Please confirm Artwork is received as per your requirement</p>
                    <p class="text-p mb-2 bg-none br-1">Approved</p>
                    <p class="mb-2 fn-bold"><strong>Checklist of checking of artwork for printing requirements</strong></p>


                    <ul class="list-item">
                      <li>Ingredients should be in descending order.</li>
                      <li>INCI names of the ingredients are compulsory to be there on artwork.</li>
                      <li>Is Product description mentioned properly?</li>
                      <li>Directions of Use/How to Use should be there.</li>
                      <li>Caution details and storage condition details are mandate.</li>
                      <li>Complete address of “Manufacturing by” and “Marketed by” is mentioned.</li>
                      <li>Import/Export Address (if it’s a case of import/export).</li>
                      <li>Manufacturing License no. is mentioned.</li>
                      <li>Net weight should be mentioned on PDP (Principal Display Panel) and information panel.</li>
                      <li>Country of Origin is mandate.</li>
                      <li>Batch No., MRP* (incl. of all taxes), manufacturing date, USP, expiry date are compulsory in every label or box size.</li>
                      <li>Claims are according to the ingredients mentioned.</li>
                      <li>If product is below 60 gm or 60 ml, then manufacturing address can be short.</li>
                      <li>Customer care details are mandate to put on box or label.</li>
                    </ul>
                  </div>

                  <!-- Show Sale Order details -->
                   ${saleOrderDetById()}


                </div>
                <div class="yes hide">
                    <div class="side-footer ">
                         <a href="#" class="btn btn-lg btn-warning" data-toggle="modal" data-target="#reasonpopupStep4">Reject</a>
                         <a href="#" class="btn btn-lg btn-success" onclick="SaveStep4(${rowId}, ${StepNo})">Approve</a>
                    </div>
                </div>

                <div class="no hide">
                    <div class="side-footer ">
                  <a href="" data-toggle="modal" data-target="#reasonpopupStep4" class="btn btn-lg actionbtn">Submit</a>
                </div>
                </div>

                <!-- End -->

              </div>
            </div>
          </div>
        </div>


        <!-- Reason Popup -->

        <div class="modal modaloverlay" id="reasonpopupStep4">
           <div class="modal-dialog modal-dialog-centered modal-md">
              <div class="modal-content ">

              <!-- Modal Header -->
              <div class="modal-header">
                 <h4 class="modal-title text-left w-100">Reason for Rejection</h4>
                 <button type="button" class="close" data-dismiss="modal"><img src="../assets/images/icons/help/close-icon.png" class="closeicon"></button>
              </div>

              <!-- Modal body -->
              <div class="modal-body">
                 <div class="row">


                    <div class="form-group col-sm-12">
                       <label>Please enter Reason for Rejection <sup>*</sup></label>
                       <textarea class="form-control h-120 char-limit"  placeholder="Enter" data-maxlength="300" id="rejectionReasonStep4"></textarea>
                       <div class="text-right">
                          <small class="light-label counter">0/300</small>
                       </div>
                    </div>
                 </div>

              </div>

              <!-- Modal footer -->
              <div class="modal-footer">
                 <button type="button" class="btn btn-lg cancelbtn radius-24" data-dismiss="modal">Cancel</button> <a href="#" class="btn btn-lg actionbtn" onclick="RejectStep4(${rowId}, ${StepNo})">Submit</a>
              </div>

              </div>
           </div>
        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step4);

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 4

    $(document).on('change', '#ddlConfirmArtworkLegal', function () {
        var value = $(this).val();

        if (value === "1") {
            $('.yes').removeClass('hide');
            $('.no').addClass('hide');
        } else if (value === "2") {
            $('.no').removeClass('hide');
            $('.yes').addClass('hide');
        } else {
            $('.yes, .no').addClass('hide');
        }
    });

    $('#markdoneStep4').modal('show');
}

function showModalFieldStep5(rowId, StepNo, selectedLabelVendorId = 0, selectedBoxVendorId = 0) {
    const step5 = `
        <div class="modal fade drawer right-align" id="markdoneStep5" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 5 - Sample Order</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal" />
              </div>
              
              <div class="modal-body mb-100">

                <div class="row">
                     <div class="col-sm-12 form-group">
                     <label class="text-gray mb-0">FG Item Name</label>
                     <p id="itemName"></p>
                 </div>

                 <div class="col-sm-12 form-group">
                     <label class="text-gray mb-0">Custome Brand Name</label>
                     <p id="custBrandName"></p>
                 </div>
                 <div class="col-sm-12" ><hr class="mb-1" /></div>

                 <p>  &nbsp; Please confirm the PM Sample Order is placed</p>

                  <!-- Vendor for label -->
                  <div class="col-sm-12 form-group">
                    <label for="vendorLabelInput">Vendor for label</label>
                    <div class="autocomplete-wrapper pr">
                      <label for="vendorLabelInput" class="search-label right">
                        <img src="../assets/images/icons/help/search-icon.png" class="icon-sm">
                      </label>
                      <input type="text" class="form-control searchlist pl-10 MandateStep5" id="vendorLabelInput" placeholder="Enter" autocomplete="off" oninput="HideErrorMessage(this)">
                      <ul class="suggestions pa w-100" id="ddlVendorLabelList"></ul>
                      <span id="spvendorLabelInput" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                    </div>
                  </div>

                  <!-- Vendor for box -->
                  <div class="col-sm-12 form-group">
                    <label for="vendorBoxInput">Vendor for Box</label>
                    <div class="autocomplete-wrapper pr">
                      <label for="vendorBoxInput" class="search-label right">
                        <img src="../assets/images/icons/help/search-icon.png" class="icon-sm">
                      </label>
                      <input type="text" class="form-control searchlist pl-10 MandateStep5" id="vendorBoxInput" placeholder="Enter" autocomplete="off" oninput="HideErrorMessage(this)">
                      <ul class="suggestions pa w-100" id="ddlVendorBoxList"></ul>
                      <span id="spvendorBoxInput" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                    </div>
                  </div>
                </div>


                <div class="col-sm-12">
                 <div id="showRejectionTextStep5" class="hide row">
                    <div class="col-sm-12 form-group">
                        <label for="">Reason for Rejection</label>
                        <p id="RejectionTextStep5"></p>
                    </div>
                     <div class="col-sm-6 form-group">
                        <label for="">Rejected By</label>
                        <p id="RejectedByStep5"></p>
                    </div>
                    <div class="col-sm-6 form-group">
                        <label for="">Rejected On</label>
                        <p id="RejectedOnStep5"></p>
                    </div>
                     <div class="col-sm-12 form-group">
                        <label for="">Rejected By Step No: <span id="RejectedByStepNo"></span></label>

                    </div>
                    </div>
                </div>

                <!-- Show Sale Order details -->
                ${saleOrderDetById()}

                <div class="side-footer">
                  <a href="#" class="btn btn-lg actionbtn" onclick="SaveStep5(${rowId}, ${StepNo})">Submit</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="fileLimitPopup" class="popup-modal">
          <div class="popup-content">
            <p id="popup-message"></p>
            <button id="close-popup"><img src="../assets/images/icons/help/close.svg" alt=""></button>
          </div>
        </div>
    `;

    closeView();
    $('#view_dynamic_fms').html('');
    $('#dynamic_fms').html(step5);

    // Bind both vendor lists with selected values (can be null or a valid vendor ID)
    BindVendorList('vendorLabelInput', 'ddlVendorLabelList', selectedLabelVendorId);
    BindVendorList('vendorBoxInput', 'ddlVendorBoxList', selectedBoxVendorId);

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 5

    $('#markdoneStep5').modal('show');
}

function showModalFieldStep6(rowId, StepNo) {
    var step6 =
        `<div class="modal fade drawer right-align" id="markdoneStep6" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 6 - Sample Received</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
              <div class="modal-body mb-100" >
                <!-- open -->

                <div class="row">
                   <div class="col-sm-12 form-group">
                        <label class="text-gray mb-0">FG Item Name</label>
                        <p id="itemName"></p>
                    </div>

                    <div class="col-sm-12 form-group">
                        <label class="text-gray mb-0">Custome Brand Name</label>
                        <p id="custBrandName"></p>
                    </div>
                  <div class="col-sm-12" ><hr class="mb-1" /></div>

                  <div class="col-sm-12 form-group">
                    <label for="locationname">Is the sample received from vendors and handed over to QC?</label>
                       <select class="form-control applyselect MandateStep6" id="ddlSampleReceivedStatus" onchange="HideErrorMessage(this)">
                        <option value="Select">Select</option>
                        <option value="1"> Yes</option>
                        <option value="2">No</option>
                       </select>
                       <span id="spddlSampleReceived" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                      </div>

                </div>

                <!-- Show Sale Order details -->
                ${saleOrderDetById()}

                <div class="side-footer">
                       <a href="#" class="btn btn-lg actionbtn" onclick="SaveStep6(${rowId}, ${StepNo})">Submit</a>
                </div>

                <!-- End -->

              </div>
            </div>
          </div>
        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step6);

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 6

    $('#markdoneStep6').modal('show');
}

function showModalFieldStep7(rowId, StepNo) {
    var step7 =
        `<div class="modal fade drawer right-align" id="markdoneStep7" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 7 - Sample QC</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
              <div class="modal-body mb-100" >
                <!-- open -->
                <div class="row">
                  
                <div class="col-sm-12 form-group">
                    <label class="text-gray mb-0">FG Item Name</label>
                    <p id="itemName"></p>
                </div>

                <div class="col-sm-12 form-group">
                    <label class="text-gray mb-0">Custome Brand Name</label>
                    <p id="custBrandName"></p>
                </div>

                <div class="col-sm-12" ><hr class="mb-1" /></div>

                  <div class="col-sm-12 form-group">
                    <label for="locationname">Please confirm sample QC approval status</label>
                   <select class="form-control applyselect disableList" id="ddlSampleQCStatus">
                    <option value="Select">Select</option>
                    <option value="1">Approved</option>
                    <option value="2">Rejected</option>
                   </select>
                  </div>

                  <div class="col-sm-12 form-group yes hide">
                  <div style="display:none;">
                    <p class="mb-2">Please Check the following points for QC</p>
                    <ul class="list-unstyled checklist">
                       <li>
                          <input type="checkbox" id="artworkchecklist-1" name="type" value="" class="qcChecklist" data-id="1">
                          <label for="artworkchecklist-1">Samples match basic quality parameters</label>

                       </li>
                       <li>
                          <input type="checkbox" id="artworkchecklist-2" name="type" value="" class="qcChecklist" data-id="2">
                          <label for="artworkchecklist-2">The pump is compatible with the bottle</label>

                       </li>
                       <li>
                          <input type="checkbox" id="artworkchecklist-3" name="type" value="" class="qcChecklist" data-id="3">
                          <label for="artworkchecklist-3">The material can dispense from the pump properly</label>

                       </li>
                       <li>
                          <input type="checkbox" id="artworkchecklist-4" name="type" value="" class="qcChecklist" data-id="4">
                          <label for="artworkchecklist-4">Sample is provided to concern Sales person</label>

                       </li>

                    </ul>
                    </div>
                  </div>

                </div>

                <div>

                    <p><strong>• Monocarton:-</strong></p>
                    <ol>
                        <li>Fitment with primary PM.</li>
                        <li>Printing text matter check with approved artwork.</li>
                        <li>Printing visible or clear readable.</li>
                        <li>Artwork Approved as per legal.</li>
                    </ol>

                    <p><strong>• Labels:-</strong></p>
                    <ol>
                        <li>Label Dimension okay as per primary PM.</li>
                        <li>Label text matter check with approved artwork.</li>
                        <li>Printing visible or clear readable.</li>
                        <li>Artwork Approved as per legal.</li>
                    </ol>

                    <p><strong>• Tube/Bottle/Jar with pump/cap/dropper:-</strong></p>
                    <ol>
                        <li>Fitment check with pump/cap/dropper.</li>
                        <li>Label dimension check with Primary PM.</li>
                        <li>Fill Volume check.</li>
                        <li>Leakage Test.</li>
                        <li>Fitment check with Monocarton.</li>
                    </ol>
                </div>


                <!-- Show Sale Order details -->
                ${saleOrderDetById()}

                <div class="yes hide">
                    <div class="side-footer ">
                      <a data-toggle="modal" data-target="#reasonpopup" class="btn btn-lg btn-warning">Reject</a>
                      <a href="#" class="btn btn-lg btn-success" onclick="SaveStep7(${rowId}, ${StepNo})">Approve</a>
                     </div>
                </div>

                <div class="no hide">
                    <div class="side-footer ">
                  <a data-toggle="modal" data-target="#reasonpopup" class="btn btn-lg actionbtn">Submit</a>
                </div>
                </div>

                <!-- End -->

              </div>
            </div>
          </div>
        </div>


        <!-- Reason Popup -->

        <div class="modal modaloverlay" id="reasonpopup">
           <div class="modal-dialog modal-dialog-centered modal-md">
              <div class="modal-content ">

              <!-- Modal Header -->
              <div class="modal-header">
                 <h4 class="modal-title text-left w-100">Reason for Rejection</h4>
                 <button type="button" class="close" data-dismiss="modal"><img src="../assets/images/icons/help/close-icon.png" class="closeicon"></button>
              </div>

              <!-- Modal body -->
              <div class="modal-body">
                 <div class="row">

                   <div class="form-group col-sm-12">
                       <label>Please enter Reason for Rejection <sup>*</sup></label>
                       <textarea class="form-control h-120 char-limit"  placeholder="Enter" data-maxlength="300" id="rejectionReasonStep7"></textarea>
                       <div class="text-right">
                          <small class="light-label counter">0/300</small>
                       </div>
                    </div>


                 </div>

              </div>

              <!-- Modal footer -->
              <div class="modal-footer">
                 <button type="button" class="btn btn-lg cancelbtn radius-24" data-dismiss="modal">Cancel</button> <a href="#" class="btn btn-lg actionbtn" onclick="RejectStep7(${rowId}, ${StepNo})">Submit</a>
              </div>

              </div>
           </div>
        </div>

	        <!-- Popup Modal for File Limit -->
	        <div id="fileLimitPopup" class="popup-modal">
		        <div class="popup-content">
			        <p id="popup-message"></p>
			        <button id="close-popup"><img src="../assets/images/icons/help/close.svg" alt=""></button>
		        </div>
	        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step7);

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 7

    // Add change handler
    $(document).on('change', '#ddlSampleQCStatus', function () {
        var selected = $(this).val();

        if (selected === "1") {
            $('.yes').removeClass('hide');
            $('.no').addClass('hide');
        } else if (selected === "2") {
            $('.no').removeClass('hide');
            $('.yes').addClass('hide');
        } else {
            $('.yes, .no').addClass('hide');
        }
    });

    $('#markdoneStep7').modal('show');
}

function showModalFieldStep8(rowId, StepNo) {
    var step8 =
        `<div class="modal fade drawer right-align" id="markdoneStep8" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 8 - Print PM Sample Approval from Client</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
                <div class="modal-body mb-100" >
                <!-- open -->
                <div class="row">
                    <div class="col-sm-12 form-group">
                         <label>FG Item Name</label>
                         <p id="itemName"></p>
                     </div>

                     <div class="col-sm-12 form-group">
                         <label>Custome Brand Name</label>
                         <p id="custBrandName"></p>
                     </div>
                   
                     <div class="col-sm-12 form-group">
                        <label>Payment Terms : </label>
                         <span>Advance Payment</span>
                     </div>
                     <div class="col-sm-12" ><hr class="mb-1" /></div>

                 <div class="col-sm-12 form-group">
                    <label>Colour - Client's Observation</label>
                    <input type="text" placeholder="Enter" class="form-control MandateStep8" id="txtColorClientObs" oninput="HideErrorMessage(this)"/>
                    <span id="sptxtColorClientObs" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Font - Client's Observation</label>
                    <input type="text" placeholder="Enter" class="form-control MandateStep8" id="txtFontClientObs" oninput="HideErrorMessage(this)"/>
                    <span id="sptxtFontClientObs" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Uv Finishing - Client's Observation</label>
                    <input type="text" placeholder="Enter" class="form-control MandateStep8" id="txtUVFinishingClientObs" oninput="HideErrorMessage(this)"/>
                    <span id="sptxtUVFinishingClientObs" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Lamination - Client's Observation</label>
                    <select name="" class="form-control applyselect MandateStep8" id="ddlLaminationClientObs" onchange="HideErrorMessage(this)"/>
                        <option value="Select">Select</option>
                        <option value="1">Gloss</option>
                        <option value="2">Matt</option>

                    </select>
                    <span id="spddlLaminationClientObs" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Label Type - Client's Observation</label>
                    <select name="" class="form-control applyselect MandateStep8" id="ddlLabelTypeClientObs" onchange="HideErrorMessage(this)"/>
                        <option value="Select">Select</option>
                        <option value="1">Transparent</option>
                        <option value="2">White/Opaque</option>
                        <option value="3">Translucent</option>

                    </select>
                    <span id="spddlLabelTypeClientObs" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Please confirm order sample and Bromide are approved</label>
                    <select name="" class="form-control applyselect MandateStep8" id="ddlPrintSampleApprovalByClient" onchange="HideErrorMessage(this)"/>
                        <option value="Select">Select</option>
                        <option value="1">Approved</option>
                        <option value="2">Rejected</option>

                    </select>
                    <span id="spddlPrintSampleApprovalByClient" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                </div>

                <!-- Show Sale Order details -->
                ${saleOrderDetById()}

                    <div class="side-footer ">
                       <a data-toggle="modal" data-target="#reasonpopup" class="btn btn-lg actionbtn rejected hide">Submit</a>
                          <a href="#" class="btn btn-lg actionbtn approved hide" onclick="SaveStep8(${rowId}, ${StepNo})">Submit</a>
                    </div>


                <!-- End -->

              </div>
            </div>
          </div>
        </div>


        <!-- Reason Popup -->

        <div class="modal modaloverlay" id="reasonpopup">
           <div class="modal-dialog modal-dialog-centered modal-md">
              <div class="modal-content ">

              <!-- Modal Header -->
              <div class="modal-header">
                 <h4 class="modal-title text-left w-100">Reason for Rejection</h4>
                 <button type="button" class="close" data-dismiss="modal"><img src="../assets/images/icons/help/close-icon.png" class="closeicon"></button>
              </div>

              <!-- Modal body -->
              <div class="modal-body">
                 <div class="row">


                   <div class="form-group col-sm-12">
                       <label>Please enter Reason for Rejection <sup>*</sup></label>
                       <textarea class="form-control h-120 char-limit"  placeholder="Enter" data-maxlength="300" id="rejectionReasonStep8"></textarea>
                       <div class="text-right">
                          <small class="light-label counter">0/300</small>
                       </div>
                    </div>
                 </div>

              </div>

              <!-- Modal footer -->
              <div class="modal-footer">
                 <button type="button" class="btn btn-lg cancelbtn radius-24" data-dismiss="modal">Cancel</button> <a href="#" class="btn btn-lg actionbtn" onclick="RejectStep8(${rowId}, ${StepNo})">Submit</a>
              </div>

              </div>
           </div>
        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step8);

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 8

    // Handle selection change for order sample approval
    $(document).on('change', '#ddlPrintSampleApprovalByClient', function () {
        const selectedValue = $(this).val();

        if (selectedValue === '1') {
            $('.approved').removeClass('hide');
            $('.rejected').addClass('hide');
        } else if (selectedValue === '2') {
            $('.rejected').removeClass('hide');
            $('.approved').addClass('hide');
        } else {
            // Reset both if nothing is selected
            $('.approved, .rejected').addClass('hide');
        }
    });

    $('#markdoneStep8').modal('show');
}

function showModalFieldStep9(rowId, StepNo) {
    var step9 =
        `<div class="modal fade drawer right-align" id="markdoneStep9" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 9 - Payment Proof</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
                  <div class="modal-body mb-100" >
                    <!-- open -->
                    <div class="row">

                     <div class="col-sm-12 form-group">
                         <label>FG Item Name</label>
                         <p id="itemName"></p>
                     </div>

                     <div class="col-sm-12 form-group">
                         <label>Custome Brand Name</label>
                         <p id="custBrandName"></p>
                     </div>
                    
                     <div class="col-sm-12 form-group">
                        <label>Payment Terms : </label>
                         <span>Advance Payment</span>
                     </div>
                      <div class="col-sm-12" ><hr class="mb-1" /></div>

                ${!viewOTD ?
            `<div class="col-sm-12 form-group">

                       <label>Upload Payment Sreenshot</label>
                       <div class="section-container section-container-popup">
							        <div class="fileuploadview drag-area p-0 drag-area1">
							           <div class="uploadicon_text file-input-button" id="fileInputButton1">
								          <div class="uploadicon">
									         <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
								          </div>
								          <div class="uploadtext drag-file">
									         <h4>Drop files here or click to upload</h4>
									         <h6>This is a dropzone, drop files or click to browse</h6>
									         <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
								          </div>
							           </div>
							           <input type="file" id="fileAttachment1" class="file-input hidden" multiple accept=""  />
							           <div id="documentImages1" class="document-images"></div>
							        </div>
				        </div>
                   </div>`

            :

            `<div class="col-sm-12 form-group">
									<div class="card br-none p-0">
										<div class="card-header border-top-RL header-active br-none  d-flex justify-content-between ">
											<h2 class="title-two align-self-center">Upload Payment Screenshot</h2>
											<div class="align-self-center"></div>
										</div>
										<div class="card-body view-form-group min-175 ">
											<p class="m-0 nofile" id="NoUploadFile1">No Upload</p>
											<div class="section-container fileuploadview hidden section-container-popup" id="ShowUploadFile1">
												<!--  -->
												<div id="documentImagesMP" class="document-images">

												</div>
												<!--  -->
											</div>
										</div>
									</div>
								</div>`
        }

                   <div class="col-sm-12 form-group hidden">
                    <label>Voucher Number</label>
                    <input type="text" placeholder="Enter" class="form-control" id="txtVoucherNo" oninput="HideErrorMessage(this)">
                    <span id="sptxtVoucherNo" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                   <div class="col-sm-12 form-group hidden">
                    <label>Date of the Receipt</label>
                    <div class="input-group">
                        <input type="text" class="datepicker form-control" placeholder="DD/MM/YYYY" value="" readonly id="txtReceiptDate">
							 <div class="input-group-append calendar-freeze">
								<span class="input-group-text bg-white"><img src="../assets/images/icons/help/calendar-icon.svg" alt=""></span>
							 </div>
						</div>
                 </div>

                 <div class="col-sm-12 form-group hidden">
                    <label>Total Order Value (₹)</label>
                    <span id="lblTotalOrderValue"></span>
                 </div>

                 <div class="col-sm-12 form-group hidden">
                    <label>Advance Payment (₹)</label>
                    <span id="lblAdvancePayment"></span>
                 </div>

                </div>

                <!-- Show Sale Order details -->
                ${saleOrderDetById()}

                    <div class="side-footer ">
                   <button type="button" class="btn btn-lg actionbtn" onclick="SaveStep9(${rowId}, ${StepNo})">Submit</button>
                </div>


                <!-- End -->

              </div>
            </div>
          </div>
        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step9);

    // Optional: ensure initialization happens when modal is shown (handles timing quirks)
    // Add this once outside if not already present
    if (!window._qctestUploadModalBound) {
        $(document).on('shown.bs.modal', '#markdoneStep9', function () {
            const uploadZones = [
                { className: '.drag-area1', initFn: fileUploadWithPreview1 }

            ];

            uploadZones.forEach(({ className, initFn }) => {
                $(this).find(className).each(function () {
                    if (!this.dataset.uploadInit) {
                        try {
                            initFn(this);
                            this.dataset.uploadInit = '1';
                        } catch (err) {
                            console.error(`fileUpload init failed for ${className}`, err);
                        }
                    }
                });
            });
        });

        window._qctestUploadModalBound = true;
    }

    /* ----------------- end appended lines ----------------- */

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 9

    $('#markdoneStep9').modal('show');
}

function showModalFieldStep10(rowId, StepNo) {
    var step9 =
        `<div class="modal fade drawer right-align" id="markdoneStep10" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">

              <h2>Step 10 - Accounts Confirmation</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
                  <div class="modal-body mb-100" >
                    <!-- open -->
                    <div class="row">
                     <div class="col-sm-12 form-group">
                         <label>FG Item Name</label>
                         <p id="itemName"></p>
                     </div>

                     <div class="col-sm-12 form-group">
                         <label>Custome Brand Name</label>
                         <p id="custBrandName"></p>
                     </div>
              
                     <div class="col-sm-12 form-group">
                        <label>Payment Terms : </label>
                         <span id="lblPaymentTerms"></span>
                     </div>
                    <div class="col-sm-12" ><hr class="mb-1" /></div>


                ${!viewOTD ?
            `<div class="col-sm-12 form-group">

                       <label>Upload Payment Sreenshot</label>
                       <div class="section-container section-container-popup">
							        <div class="fileuploadview drag-area p-0 drag-area1">
							           <div class="uploadicon_text file-input-button" id="fileInputButton1">
								          <div class="uploadicon">
									         <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
								          </div>
								          <div class="uploadtext drag-file">
									         <h4>Drop files here or click to upload</h4>
									         <h6>This is a dropzone, drop files or click to browse</h6>
									         <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
								          </div>
							           </div>
							           <input type="file" id="fileAttachment1" class="file-input hidden" multiple accept=""  />
							           <div id="documentImages1" class="document-images"></div>
							        </div>
				        </div>
                   </div>`

            :

            `<div class="col-sm-12 form-group">
									<div class="card br-none p-0">
										<div class="card-header border-top-RL header-active br-none  d-flex justify-content-between ">
											<h2 class="title-two align-self-center">Upload Payment Screenshot</h2>
											<div class="align-self-center"></div>
										</div>
										<div class="card-body view-form-group min-175 ">
											<p class="m-0 nofile" id="NoUploadFile1">No Upload</p>
											<div class="section-container fileuploadview hidden section-container-popup" id="ShowUploadFile1">
												<!--  -->
												<div id="documentImagesMP" class="document-images">

												</div>
												<!--  -->
											</div>
										</div>
									</div>
								</div>`
        }

                   <div class="col-sm-12 form-group">
                    <label>Voucher Number</label>
                    <input type="text" placeholder="Enter" class="form-control MandateStep9" id="txtVoucherNo" oninput="HideErrorMessage(this)">
                    <span id="sptxtVoucherNo" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                   <div class="col-sm-12 form-group">
                    <label>Date of the Receipt</label>
                    <div class="input-group">
                        <input type="text" class="datepicker form-control" placeholder="DD/MM/YYYY" value="" readonly id="txtReceiptDate">
							 <div class="input-group-append calendar-freeze">
								<span class="input-group-text bg-white"><img src="../assets/images/icons/help/calendar-icon.svg" alt=""></span>
							 </div>
						</div>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Total Order Value (₹)</label>
                    <span id="lblTotalOrderValue"></span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Advance Payment (₹)</label>
                    <span id="lblAdvancePayment"></span>
                 </div>

                </div>

                <!-- Show Sale Order details -->
                ${saleOrderDetById()}
                
                <div class="side-footer ">
                   <button type="button" class="btn btn-lg actionbtn" onclick="SaveStep9(${rowId}, ${StepNo})">Submit</button>
                </div>


                <!-- End -->

              </div>
            </div>
          </div>
        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step9);

    // Optional: ensure initialization happens when modal is shown (handles timing quirks)
    // Add this once outside if not already present
    if (!window._qctestUploadModalBound) {
        $(document).on('shown.bs.modal', '#markdoneStep9', function () {
            const uploadZones = [
                { className: '.drag-area1', initFn: fileUploadWithPreview1 }

            ];

            uploadZones.forEach(({ className, initFn }) => {
                $(this).find(className).each(function () {
                    if (!this.dataset.uploadInit) {
                        try {
                            initFn(this);
                            this.dataset.uploadInit = '1';
                        } catch (err) {
                            console.error(`fileUpload init failed for ${className}`, err);
                        }
                    }
                });
            });
        });

        window._qctestUploadModalBound = true;
    }

    /* ----------------- end appended lines ----------------- */

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 9

    $('#markdoneStep10').modal('show');
}

function getModalFieldDataByStepNo(orderId, StepNo) {
    var model = {
        OrderId: orderId,
        OrderItemId: orderItemId,
        StepNo: StepNo
    };

    const jsonString = JSON.stringify(model);

    if (viewOTD) {
        $('.actionbtn').hide();
        $('.btn-success').hide();
        $('.btn-warning').hide();
    }

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', {
        modelData: jsonString,
        screenId: 'OrderToDelivery_101'
    }, 'GET', function (response) {

        console.log(response);

        const tblData = response.data.data.Table[0];
        const tblData1 = response.data.data.Table1[0];
        let tblData2 = response.data.data.Table2.filter(input => input.StepNo == 2);

        let tblData9 = response.data.data.Table2.filter(input => input.StepNo == 9);

        //  Show Sale order detail - Modified on 261125
        if (response.data.data.Table3.length > 0)
        {
            const tblData3 = response.data.data.Table3[0];

            $("#saleOrderId").text(tblData3.DocNo);
            $("#saleOrderDate").text(tblData3.SODate);
            $("#custName").text(tblData3.CustName);
            $("#custBrandName").text(tblData3.CustBrandName);
            $("#itemName").text(tblData3.ItemName);
            $("#poNo").text(tblData3.PONo);
            $("#poDate").text(tblData3.PODate);
            /*$("#salePersonName").text(tblData3.ContactPersonName);*/
            $("#salePersonName").text(tblData3.Createdby);
            $("#remarks").text(tblData3.Remarks);
        }

        if (response.data.data.Table4.length > 0) {

            response.data.data.Table4.forEach((item, index) => {

            // Create clickable file name
                const fileLink = `<a href="#" class="task-file-link" 
                                data-url="${item.FileUrl}" 
                                data-name="${item.ActualFileName}">
                                ${item.ActualFileName}
                          </a><br/>`;

                $("#viewAttSO").append(fileLink);
            });

            // Attach click event (for all dynamic links)
            $(".task-file-link").off("click").on("click", function (e) {
                e.preventDefault();
                const fileUrl = $(this).data("url");
                const fileName = $(this).data("name");

                handleTaskFile(fileUrl, fileName);
            });

            $(".task-file-link").css("font-weight", "bold");
        }
        else {
            $("#viewAttSO").hide();
        }
        //  Show Sale order detail End
        
        if (response.data.data.Table3 && response.data.data.Table3.length > 0) {
            tblData2 = response.data.data.Table2.filter(input => input.StepNo == 2);
        }


        if (tblData && StepNo === 1) {
            $('#ddlApplyFDA').val(tblData.FDAApprovalStatus || 'Select');
        }
        else if (tblData && StepNo === 2) {
            /*    Bind radio based on ArtworkSecondStatus*/
            const artworkStatus = tblData.ArtworkSecondStatus?.trim();

            const artworkFirstStatus = tblData?.ArtworkFirstStatus?.trim();

            if (artworkStatus === "New artwork" || artworkFirstStatus == "New") {
                $('#radio-new').prop('checked', true).trigger('change');


                for (var i = 0; i < tblData2.length; i++) {
                    var fileName = tblData2[i].ActualFileName;
                    var fileType = tblData2[i].FileType;
                    var type = tblData2[i].Type;
                    var fileUrl = tblData2[i].FileUrl;
                    var fFd = tblData2[i].AttachmentId;
                    var fSize = tblData2[i].FileSize;
                    var newfileName = tblData2[i].NewFileName;
                    var attachmentType = tblData2[i].AttachmentType;

                    var attachmentInt = 0;

                    if (attachmentType == 'Upload1') {
                        attachmentInt = 1;
                    }
                    else if (attachmentType == 'Upload2') {
                        attachmentInt = 2;
                    }
                    else {
                        attachmentInt = 3;
                    }

                    if (!viewOTD) {
                        LoadFileDataOTD(fileName, fileType, type, fileUrl, fFd, fSize, newfileName, attachmentInt);
                    }

                    else {
                        LoadFileDataDownloadOTD(fileName, fileType, type, fileUrl, fFd, fSize, newfileName, attachmentType);
                    }
                }

            } else if (artworkStatus === "Repeat artwork") {
                $('#radio-repeat').prop('checked', true).trigger('change');

                $('#ddlRepeatStatusStep2').val(tblData.ArtworkThirdStatus || 'Select');
            }



            // ✅ Show or hide rejection section
            if (tblData1.Rejection && tblData1.Rejection.trim() !== "") {
                $('#showRejectionTextStep2').removeClass('hide');
                $('#RejectionTextStep2').text(tblData1.Rejection || '');
                $('#RejectedByStep2').text(tblData1.RejectedBy || '');
                $('#RejectedOnStep2').text(tblData1.RejectedOn || '');
                $('#RejectedByStepNo').text(tblData1.StepNo || 0);
            } else {
                $('#showRejectionTextStep2').addClass('hide');
            }

        }
        else if (tblData && StepNo === 3) {
            $('#ddlConfirmArtworkGrapic').val(tblData.ArtReceivedStatusGraphic || 'Select').trigger('change');
        }
        else if (tblData && StepNo === 4) {
            $('#ddlConfirmArtworkLegal').val(tblData.ArtReceivedStatusLegal || 'Select').trigger('change');
        }
        else if (tblData && StepNo === 5) {
            const labelVendorId = tblData.VendorForLabelId || 0;
            const boxVendorId = tblData.VendorForBoxId || 0;

            BindVendorList('vendorLabelInput', 'ddlVendorLabelList', labelVendorId);
            BindVendorList('vendorBoxInput', 'ddlVendorBoxList', boxVendorId);

            //  Show or hide rejection section
            if (tblData1.Rejection && tblData1.Rejection.trim() !== "") {
                $('#showRejectionTextStep5').removeClass('hide');
                $('#RejectionTextStep5').text(tblData1.Rejection || '');
                $('#RejectedByStep5').text(tblData1.RejectedBy || '');
                $('#RejectedOnStep5').text(tblData1.RejectedOn || '');
                $('#RejectedByStepNo').text(tblData1.StepNo || 0);
            } else {
                $('#showRejectionTextStep5').addClass('hide');
            }
        }
        else if (tblData && StepNo === 6) {
            $('#ddlSampleReceivedStatus').val(tblData.SampleReceivedStatus || 'Select');

        }
        else if (tblData && StepNo === 7) {
            $('#ddlSampleQCStatus').val(tblData.SampleQCStatus || 'Select').trigger('change');
            // Clear all checkboxes first
            $('.qcChecklist').prop('checked', false);

            if (tblData.SampleQCPoints) {
                const points = tblData.SampleQCPoints.split(',');

                points.forEach(point => {
                    // Trim and find checkbox with matching data-id, then check it
                    $('.qcChecklist[data-id="' + point.trim() + '"]').prop('checked', true);
                });
            }

        }
        else if (tblData && StepNo === 8) {
            $('#txtColorClientObs').val(tblData.ColorClientObs || '');
            $('#txtFontClientObs').val(tblData.FontClientObs || '');
            $('#txtUVFinishingClientObs').val(tblData.UvFinishingClientObs || '');
            $('#ddlLaminationClientObs').val(tblData.LaminationClientObs || 'Select').trigger('change');
            $('#ddlLabelTypeClientObs').val(tblData.LabelType || 'Select').trigger('change');
            $('#ddlPrintSampleApprovalByClient').val(tblData.SampleBromideStatus || 'Select').trigger('change');
        }
        else if (tblData && StepNo === 9) {

            $('#lblPaymentTerms').text(tblData.PayTerms || '');
            $('#txtReceiptDate').val(tblData.ReceiptDt);
            $('#lblTotalOrderValue').text(tblData.TotalOrdeValue || 0);
            $('#lblAdvancePayment').text(tblData.TotAdvanceAmt || 0);
            $('#txtVoucherNo').val(tblData.VoucherNo || '');

            for (var i = 0; i < tblData9.length; i++) {
                var fileName = tblData9[i].ActualFileName;
                var fileType = tblData9[i].FileType;
                var type = tblData9[i].Type;
                var fileUrl = tblData9[i].FileUrl;
                var fFd = tblData9[i].AttachmentId;
                var fSize = tblData9[i].FileSize;
                var newfileName = tblData9[i].NewFileName;
                var attachmentType = tblData9[i].AttachmentType;

                var attachmentInt = 0;

                if (attachmentType == 'Upload1') {
                    attachmentInt = 1;
                }
                else if (attachmentType == 'Upload2') {
                    attachmentInt = 2;
                }
                else {
                    attachmentInt = 3;
                }

                if (!viewOTD) {
                    LoadFileDataOTD(fileName, fileType, type, fileUrl, fFd, fSize, newfileName, attachmentInt);
                }
                else {
                    LoadFileDataDownloadOTD(fileName, fileType, type, fileUrl, fFd, fSize, newfileName, attachmentType);
                }
            }


        }
        else if (tblData && StepNo == 10) {

            $('#lblPaymentTerms').text(tblData.PayTerms || '');
            $('#txtReceiptDate').val(tblData.ReceiptDt);
            $('#lblTotalOrderValue').text(tblData.TotalOrdeValue || 0);
            $('#lblAdvancePayment').text(tblData.TotAdvanceAmt || 0);
            $('#txtVoucherNo').val(tblData.VoucherNo || '');

            for (var i = 0; i < tblData9.length; i++) {
                var fileName = tblData9[i].ActualFileName;
                var fileType = tblData9[i].FileType;
                var type = tblData9[i].Type;
                var fileUrl = tblData9[i].FileUrl;
                var fFd = tblData9[i].AttachmentId;
                var fSize = tblData9[i].FileSize;
                var newfileName = tblData9[i].NewFileName;
                var attachmentType = tblData9[i].AttachmentType;

                var attachmentInt = 0;

                if (attachmentType == 'Upload1') {
                    attachmentInt = 1;
                }
                else if (attachmentType == 'Upload2') {
                    attachmentInt = 2;
                }
                else {
                    attachmentInt = 3;
                }

                if (!viewOTD) {
                    LoadFileDataOTD(fileName, fileType, type, fileUrl, fFd, fSize, newfileName, attachmentInt);
                }
                else {
                    LoadFileDataDownloadOTD(fileName, fileType, type, fileUrl, fFd, fSize, newfileName, attachmentType);
                }

            }
        }
    });
}


function LoadFileDataOTD(fileName, fileType, type, fileUrl, fFd, sSize, newfileName, i) {
    var fileObject =
    {
        "TypeDetails": type,
        "FileType": fileType,
        "FolderNames": "OrderToDeliveryDoc/",
        "ActualFileName": fileName,
        "NewFileName": newfileName,
        "FileUrl": fileUrl,
        "FileSize": sSize,

    };
    if (i == 1) {
        fileModelList.push(fileObject);
    }
    else if (i == 2) {
        fileModelList1.push(fileObject);
    }
    else {
        fileModelList2.push(fileObject);
    }


    let filename_len = fileName.split(".").length;

    let file_ext = fileName.split(".")[filename_len - 1];

    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                       <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile${i}(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile${i}(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "video") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <video class="preview-video" controls>
                            <source src="${e.target.result}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                        <button onclick="RemoveAttachFile${i}(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile${i}(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;

    }

    else if (type === "application/octet-stream" || file_ext == "psd") {

        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/psd-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile${i}(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;

    }
    else if (type === "application/postscript") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/ai-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile${i}(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    }

    else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile${i}(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
        <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile${i}(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file" + i);
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages" + i).appendChild(newDocument);
}



function LoadFileDataDownloadOTD(fileName, fileType, type, fileUrl, fFd, sSize, newfileName, gateType) {

    console.log(gateType);
    let previewElement;

    let filename_len = fileName.split(".").length;


    let file_ext = fileName.split(".")[filename_len - 1];

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                     
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                         <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "video") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <video class="preview-video" controls>
                            <source src="${e.target.result}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                         <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    }
    else if (type === "application/octet-stream" || file_ext == "psd") {

        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/psd-icon.svg" alt="Excel Icon" class="preview-image" />
                            <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;

    }
    else if (type === "application/postscript") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/ai-icon.svg" alt="Excel Icon" class="preview-image" />
                             <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    }
    else {
        previewElement = `<div class="file-preview">
         <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                      <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    if (gateType == 'Upload1') {
        document.getElementById("documentImagesMP").appendChild(newDocument);

        $('#NoUploadFile1').hide();
        $('#ShowUploadFile1').show();
    }
    else if (gateType == 'Upload2') {
        document.getElementById("documentImagesMCU").appendChild(newDocument);

        $('#NoUploadFile2').hide();
        $('#ShowUploadFile2').show();
    }
    else {
        document.getElementById("documentImagesAtt").appendChild(newDocument);

        $('#NoUploadFile3').hide();
        $('#ShowUploadFile3').show();
    }


}
function cleanUpModals() {
    $('.modal').modal('hide'); // hide any open modals
    $('.modal-backdrop').remove(); // remove leftover backdrops
    $('body').removeClass('modal-open'); // reset scroll lock
    $('body').css('padding-right', ''); // reset padding if added
}

let vData = [];
function BindVendorList(inputId, suggestionListId, selectedValue = null) {
    CommonAjaxMethod(virtualPath + 'Generic/GetDropDownWithAsync/', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'GET', function (response) {
        const vendorData = response.data.data.Table;
        const $input = $('#' + inputId);
        const $suggestions = $('#' + suggestionListId);

        vData = vendorData;
        // Store vendor data for use in autocomplete
        $input.data('vendorData', vendorData);

        // If a selected value is passed (ID), pre-fill input and store selected ID
        if (selectedValue) {
            const selectedVendor = vendorData.find(v => v.ID == selectedValue);
            if (selectedVendor) {
                $input.val(selectedVendor.ValueName);
                $input.data('selected-id', selectedVendor.ID);
            }
        }

        // Clear previous handlers
        $input.off('focus input');



        // Show full list on focus
        $input.on('focus', function () {
            renderSuggestions($input, $suggestions, vendorData);
        });

        // Filter on input
        $input.on('input', function () {
            const searchText = $(this).val().toLowerCase();
            const filteredData = vendorData.filter(v =>
                v.ValueName.toLowerCase().includes(searchText)
            );
            renderSuggestions($input, $suggestions, filteredData);
        });

        // Close suggestions when clicking outside
        $(document).off('click.vendorlist').on('click.vendorlist', function (e) {
            if (!$(e.target).closest('.autocomplete-wrapper').length) {
                $('.suggestions').empty().hide(); // Close all open suggestion boxes
            }
        });
    });
}

// Helper to render suggestions
function renderSuggestions($input, $suggestions, dataList) {
    $suggestions.empty();

    if (!dataList.length) {
        $suggestions.hide();
        return;
    }

    dataList.forEach(vendor => {
        $('<li/>')
            .addClass('suggestion-item')
            .text(vendor.ValueName)
            .attr('data-id', vendor.ID)
            .on('click', function () {
                $input.val(vendor.ValueName);
                $input.data('selected-id', vendor.ID);
                $suggestions.empty().hide();
            })
            .appendTo($suggestions);
    });

    $suggestions.show();
}

function SaveStep1(orderId, StepNo) {
    if (checkValidationOnSubmit('MandateStep1') == true) {
        var model =
        {
            OrderId: orderId > 0 ? orderId : 0,
            ApplyFDAStatus: $("#ddlApplyFDA").val() > 0 ? $("#ddlApplyFDA").val() : 0,
            OrderItemId: orderItemId,
            CrrId: $('#ddlCrr').val() > 0 ? $('#ddlCrr').val() : 0,          
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                console.log($("#ddlApplyFDA").val());
                window.location.reload()

                //showModalFieldStep2(orderId, StepNo + 1);
            }
        });


    }
}


let fileModelList = [];
let fileModelList1 = [];
let fileModelList2 = [];

let fileDatalList = [];
let fileDatalList1 = [];
let fileDatalList2 = [];

async function SaveNewItemDocStep2(orderId, StepNo, ItemOTDStatus) {

    var obj =
    {
        FolderNames: "OrderToDeliveryDoc/"
    }
    var type = 1;//This is for  common upload in attachment folder.
    const jsonString = JSON.stringify(obj);
    const result1 = await MultiFileUploadWithoutAync("fileAttachment1", jsonString, type, fileDataCollection1);
    const result2 = await MultiFileUploadWithoutAync("fileAttachment2", jsonString, type, fileDataCollection2);
    const result3 = await MultiFileUploadWithoutAync("fileAttachment1", jsonString, type, fileDataCollection3);
    var fileData1 = [];
    var fileData2 = [];
    var fileData3 = [];
    var finalFileData1 = [];
    var finalFileData2 = [];
    var finalFileData3 = [];

    if (result1.Data != undefined) {
        fileData1 = JSON.parse(result1.Data).FileModelList;
        fileData1 = fileData1.concat(fileDatalList);
        finalFileData1 = finalFileData1.concat(fileData1);
    }
    else {
        fileData1 = fileModelList;
    }

    if (result2.Data != undefined) {
        fileData2 = JSON.parse(result2.Data).FileModelList;
        fileData2 = fileData2.concat(fileDatalList1);
        finalFileData2 = finalFileData2.concat(fileData2);
    }
    else {
        fileData2 = fileModelList1;
    }

    if (result3.Data != undefined) {
        fileData3 = JSON.parse(result3.Data).FileModelList;
        fileData3 = fileData3.concat(fileDatalList2);
        finalFileData3 = finalFileData3.concat(fileData3);
    }
    else {
        fileData3 = fileModelList2;
    }

    finalFileData1 = fileModelList.concat(finalFileData1);
    finalFileData2 = fileModelList1.concat(finalFileData2);
    finalFileData3 = fileModelList2.concat(finalFileData3);

    // ✅ Mandatory check: At least 1 file required for each type
    if (finalFileData1.length === 0) {
        FailToaster("Please upload at least one file for Artwork file for Label.");
        return;
    }
    if (finalFileData2.length === 0) {
        FailToaster("Please upload at least one file for Artwork file for Box.");
        return;
    }
    //if (finalFileData3.length === 0) {
    //    FailToaster("Please upload at least one file for Others Attachments.");
    //    return;
    //}

    // ✅ File count validation
    if (finalFileData1.length > 10) {
        FailToaster(finalFileData1.length + " Files. You cannot upload more than 10 files for Artwork file for Label.");
        return;
    }
    if (finalFileData2.length > 10) {
        FailToaster(finalFileData2.length + " Files. You cannot upload more than 10 files for Artwork file for Box.");
        return;
    }
    if (finalFileData3.length > 10) {
        FailToaster(finalFileData3.length + " Files. You cannot upload more than 10 files for Others Attachments.");
        return;
    }
    var model =
    {
        OrderId: orderId,
        fileAttachment1Step2: fileData1,
        fileAttachment2Step2: fileData2,
        fileAttachment3Step2: fileData3,
        OrderItemId: orderItemId,
        StepNo: StepNo,
        Status1: ItemOTDStatus
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "OrderToDelivery_101",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString1
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            // showModalFieldStep3(orderId, StepNo + 1);
            window.location.reload()

        }
    });
}

async function SaveRepeatItemDocStep2(orderId, StepNo, ItemOTDStatus) {

    var obj =
    {
        FolderNames: "OrderToDeliveryDoc/"
    }
    var type = 1;//This is for  common upload in attachment folder.
    const jsonString = JSON.stringify(obj);
    const result1 = await MultiFileUploadWithoutAync("fileAttachment1", jsonString, type, fileDataCollection1);
    const result2 = await MultiFileUploadWithoutAync("fileAttachment2", jsonString, type, fileDataCollection2);
    const result3 = await MultiFileUploadWithoutAync("fileAttachment1", jsonString, type, fileDataCollection3);
    var fileData1 = [];
    var fileData2 = [];
    var fileData3 = [];
    var finalFileData1 = [];
    var finalFileData2 = [];
    var finalFileData3 = [];

    if (result1.Data != undefined) {
        fileData1 = JSON.parse(result1.Data).FileModelList;
        fileData1 = fileData1.concat(fileDatalList);
        finalFileData1 = finalFileData1.concat(fileData1);
    }
    else {
        fileData1 = fileModelList;
    }

    if (result2.Data != undefined) {
        fileData2 = JSON.parse(result2.Data).FileModelList;
        fileData2 = fileData2.concat(fileDatalList1);
        finalFileData2 = finalFileData2.concat(fileData2);
    }
    else {
        fileData2 = fileModelList1;
    }

    if (result3.Data != undefined) {
        fileData3 = JSON.parse(result3.Data).FileModelList;
        fileData3 = fileData3.concat(fileDatalList2);
        finalFileData3 = finalFileData3.concat(fileData3);
    }
    else {
        fileData3 = fileModelList2;
    }

    finalFileData1 = fileModelList.concat(finalFileData1);
    finalFileData2 = fileModelList1.concat(finalFileData2);
    finalFileData3 = fileModelList2.concat(finalFileData3);

    // ✅ Mandatory check: At least 1 file required for each type
    if (finalFileData1.length === 0) {
        FailToaster("Please upload at least one file for Artwork file for Label.");
        return;
    }
    if (finalFileData2.length === 0) {
        FailToaster("Please upload at least one file for Artwork file for Box.");
        return;
    }
    //if (finalFileData3.length === 0) {
    //    FailToaster("Please upload at least one file for Others Attachments.");
    //    return;
    //}

    // ✅ File count validation
    if (finalFileData1.length > 10) {
        FailToaster(finalFileData1.length + " Files. You cannot upload more than 10 files for Artwork file for Label.");
        return;
    }
    if (finalFileData2.length > 10) {
        FailToaster(finalFileData2.length + " Files. You cannot upload more than 10 files for Artwork file for Box.");
        return;
    }
    if (finalFileData3.length > 10) {
        FailToaster(finalFileData3.length + " Files. You cannot upload more than 10 files for Others Attachments.");
        return;
    }
    var model =
    {
        OrderId: orderId,
        fileAttachment1Step2: finalFileData1,
        fileAttachment2Step2: finalFileData2,
        fileAttachment3Step2: finalFileData3,
        OrderItemId: orderItemId,
        StepNo: StepNo,
        Status1: ItemOTDStatus,
        Status2: $('input[name="artwork"]:checked').val() || '',
        Status3: $("#ddlRepeatStatusStep2").val() > 0 ? $("#ddlRepeatStatusStep2").val() : 0
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "OrderToDelivery_101",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString1
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            window.location.reload();

        }
    });
}

function SaveRepeatStatusOnlyStep2(orderId, StepNo, ItemOTDStatus) {

    var model =
    {
        OrderId: orderId,
        OrderItemId: orderItemId,
        StepNo: StepNo,
        Status1: ItemOTDStatus,
        Status2: $('input[name="artwork"]:checked').val() || '',
        Status3: $("#ddlRepeatStatusStep2").val() > 0 ? $("#ddlRepeatStatusStep2").val() : 0
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "OrderToDelivery_101",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString1
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            //if ($("#ddlRepeatStatusStep2").val() == 1) {
            //    showModalFieldStep3(orderId, StepNo + 1);
            //}
            //else if ($("#ddlRepeatStatusStep2").val() == 2) {
            //    showModalFieldStep5(orderId, StepNo + 1);
            //}
            //else { window.location.reload() }

            window.location.reload();
        }
    });
}

function SaveStep3(orderId, StepNo) {

    var model = {
        OrderId: orderId,
        ArtWorkReceivedStatus: $("#ddlConfirmArtworkGrapic").val() > 0 ? $("#ddlConfirmArtworkGrapic").val() : 0,
        ReviewStatus: 1,
        RejectionText: '',
        OrderItemId: orderItemId,
        StepNo: StepNo
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "OrderToDelivery_101",
        Operation: "A",
        ModelData: jsonString1
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {

            window.location.reload()
            //showModalFieldStep4(orderId, StepNo + 1);
        }
    });
}

function RejectStep3(orderId, StepNo) {
    if ($('#rejectionReasonStep3').val().trim() == "") {
        FailToaster('Reason is mandatory on Step 3.');
    }
    else {
        var model = {
            OrderId: orderId,
            ArtWorkReceivedStatus: $("#ddlConfirmArtworkGrapic").val() > 0 ? $("#ddlConfirmArtworkGrapic").val() : 0,
            RejectionText: $('#rejectionReasonStep3').val().trim(),
            ReviewStatus: 2,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                window.location.reload()
                // showModalFieldStep2(orderId, StepNo - 1);
            }
        });
    }
}

function SaveStep4(orderId, StepNo) {
    var model = {
        OrderId: orderId,
        ArtWorkReceivedStatus: $("#ddlConfirmArtworkLegal").val() > 0 ? $("#ddlConfirmArtworkLegal").val() : 0,
        ReviewStatus: 1,
        RejectionText: '',
        OrderItemId: orderItemId,
        StepNo: StepNo
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "OrderToDelivery_101",
        Operation: "A",
        ModelData: jsonString1
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {

            //showModalFieldStep5(orderId, StepNo + 1);
            window.location.reload()
        }
    });
}

function RejectStep4(orderId, StepNo) {
    if ($('#rejectionReasonStep4').val().trim() == "") {
        FailToaster('Reason is mandatory on Step 4.');
    }
    else {
        var model = {
            OrderId: orderId,
            ArtWorkReceivedStatus: $("#ddlConfirmArtworkLegal").val() > 0 ? $("#ddlConfirmArtworkLegal").val() : 0,
            RejectionText: $('#rejectionReasonStep4').val().trim(),
            ReviewStatus: 2,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                window.location.reload()
                // showModalFieldStep2(orderId, StepNo - 2);
            }
        });
    }
}

function SaveStep5(orderId, StepNo) {
    if (checkValidationOnSubmit('MandateStep5') == true) {
        var labelVendorId = $('#vendorLabelInput').data('selected-id') || 0;
        var boxVendorId = $('#vendorBoxInput').data('selected-id') || 0;

        // Custom validation for vendor selection
        if (labelVendorId === 0) {
            FailToaster("Please select a valid vendor!!!.");
            return;
        }

        if (boxVendorId === 0) {
            FailToaster("Please select a valid vendor!!!.");
            return;
        }

        const v = vData.filter(input => input.ID == labelVendorId && input.ValueName == $('#vendorLabelInput').val())
        const v2 = vData.filter(input => input.ID == boxVendorId && input.ValueName == $('#vendorBoxInput').val())

        if (v.length == 0 || v2.length == 0) {
            FailToaster("Please select a valid vendor!!!.");
            return;
        }

        var model = {
            OrderId: orderId,
            VendorForLabelId: labelVendorId,
            VendorForBoxId: boxVendorId,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                window.location.reload()
                // showModalFieldStep6(orderId, StepNo + 1);
            }
        });
    }

}

function SaveStep6(orderId, StepNo) {
    if (checkValidationOnSubmit('MandateStep6') == true) {
        var model = {
            OrderId: orderId,
            SampleReceivedStatus: $("#ddlSampleReceivedStatus").val() > 0 ? $("#ddlSampleReceivedStatus").val() : 0,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                // showModalFieldStep7(orderId, StepNo + 1);
            }
            window.location.reload()
        });


    }

}

function SaveStep7(orderId, StepNo) {
    // Get selected checkbox IDs
    let selectedChecklistIds = [];
    $('.qcChecklist:checked').each(function () {
        selectedChecklistIds.push($(this).data('id'));
    });

    //if (selectedChecklistIds.length === 0) {
    //    FailToaster("Please select at least one QC checklist item.");
    //    return;
    //}

    // Convert to comma-separated string
    const checklistString = selectedChecklistIds.join(',');

    const model = {
        OrderId: orderId,
        SampleQCStatus: $('#ddlSampleQCStatus').val(),
        SampleQCPoints: checklistString,
        RejectionText: '',
        OrderItemId: orderItemId,
        StepNo: StepNo,
    };

    const jsonString = JSON.stringify(model);

    const GenericModeldata = {
        ScreenID: "OrderToDelivery_101",
        Operation: "A",
        ModelData: jsonString
    };

    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {

            window.location.reload()

            // showModalFieldStep8(orderId, StepNo + 1);
        }
    });
}

function RejectStep7(orderId, StepNo) {
    if ($('#rejectionReasonStep7').val().trim() == "") {
        FailToaster('Reason is mandatory on Step 7.');
    }
    else {
        var model = {
            OrderId: orderId,
            SampleQCStatus: $("#ddlSampleQCStatus").val(),
            SampleQCPoints: '',
            RejectionText: $('#rejectionReasonStep7').val().trim(),
            ReviewStatus: 2,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                window.location.reload()
                // showModalFieldStep5(orderId, StepNo - 2);
            }
        });
    }
}

function SaveStep8(orderId, StepNo) {
  
        const model = {
            OrderId: orderId,
            ColorObservation: $('#txtColorClientObs').val().trim(),
            FontObservation: $('#txtFontClientObs').val().trim(),
            UVFinishingObservation: $('#txtUVFinishingClientObs').val().trim(),
            LaminationType: $("#ddlLaminationClientObs").val() > 0 ? $("#ddlLaminationClientObs").val() : 0,
            LabelType: $("#ddlLabelTypeClientObs").val() > 0 ? $("#ddlLabelTypeClientObs").val() : 0,
            SampleClientStatus: $("#ddlPrintSampleApprovalByClient").val() > 0 ? $("#ddlPrintSampleApprovalByClient").val() : 0, // approved/rejected
            OrderItemId: orderItemId,
            StepNo: StepNo,
        };

        const jsonString = JSON.stringify(model);

        const GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString
        };

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                window.location.reload()
                // showModalFieldStep9(orderId, StepNo + 1);
            }
        });

}

function RejectStep8(orderId, StepNo) {
    if ($('#rejectionReasonStep8').val().trim() == "") {
        FailToaster('Reason is mandatory on Step 8.');
    }
    else {
        var model = {
            OrderId: orderId,
            SampleClientStatus: $("#ddlPrintSampleApprovalByClient").val() > 0 ? $("#ddlPrintSampleApprovalByClient").val() : 0, // approved/rejected
            RejectionText: $('#rejectionReasonStep8').val().trim(),
            ReviewStatus: 2,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                window.location.reload()
                // showModalFieldStep5(orderId, StepNo - 3);
            }
        });
    }
}

async function SaveStep9(orderId, StepNo) {
    if (checkValidationOnSubmit('MandateStep9') == true) {

        var obj =
        {
            FolderNames: "OrderToDeliveryDoc/"
        }
        var type = 1;//This is for  common upload in attachment folder.
        const jsonString = JSON.stringify(obj);
        const result1 = await MultiFileUploadWithoutAync("fileAttachment1", jsonString, type, fileDataCollection1);

        var fileData1 = [];
        var finalFileData1 = [];

        if (result1.Data != undefined) {
            fileData1 = JSON.parse(result1.Data).FileModelList;
            fileData1 = fileData1.concat(fileDatalList);
            finalFileData1 = finalFileData1.concat(fileData1);
        }
        else {
            fileData1 = fileModelList;
        }

        finalFileData1 = fileModelList.concat(finalFileData1);

        // ✅ Mandatory check: At least 1 file required for each type
        if (finalFileData1.length === 0) {
            FailToaster("Please upload at least one file for Payment Sreenshot.");
            return;
        }

        // ✅ File count validation
        if (finalFileData1.length > 10) {
            FailToaster(finalFileData1.length + " Files. You cannot upload more than 10 files for Payment Sreenshot.");
            return;
        }

        const model = {
            OrderId: orderId,
            VoucherNo: '',
            fileAttachmentStep9: fileData1,
            OrderItemId: orderItemId,
            StepNo: StepNo,
        };

        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                // showModalFieldStep3(orderId, StepNo + 1);
                window.location.reload()

            }
        });
    }
}

// --------- ********** OTD Section Ends ***************** ------------------ //

function disableOTDFields() {
    if (viewOTD === true) {

        
        $('.MandateStep1').prop('disabled', true);

        $('.disableList').prop('disabled', true);        //Dropdown List

        $('input[name="artwork"]').prop('disabled', true);    // Radio button

        // Disable Vendor autocomplete inputs
        $('#vendorLabelInput, #vendorBoxInput').prop('disabled', true);

        // Disable suggestion lists
        $('#ddlVendorLabelList, #ddlVendorBoxList').addClass('disabled-list');

        $('.qcChecklist').prop('disabled', true);       // Checkbox List

        $('.MandateStep6').prop('disabled', true);

        $('.MandateStep8').prop('disabled', true);

        $('.MandateStep9').prop('disabled', true);
        
    }
}

function saleOrderDetById() {
    return `
        <div class="row">
            <div class="col-sm-12 form-group">
                <div class="toggle-card bg-bgl">
                    <div class="toggle-card-header toggle-info">
                        <h4 class="toggle-card-title">Sale Order Information</h4>
                        <span class="toggle-card-icon"><img src="../assets/images/icons/help/arrow-down.png" class="icon-sm" alt=""></span>
                    </div>
                    <div class="toggle-containe toggle-info-content" style="display: none;">
                        <div class="row">
                            <div class="col-sm-12 form-group ">
                                <label class="text-gray mb-0">Sale Order Id</label>
                                <p id="saleOrderId"></p>
                            </div>

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Sale Order Date</label>
                                <p id="saleOrderDate"></p>
                            </div>

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Customer Company</label>
                                <p id="custName"></p>
                            </div>

                         <!--<div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Custome Brand Name</label>
                                <p id="custBrandName"></p>
                            </div>

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">FG Item Name</label>
                                <p id="itemName"></p>
                            </div>-->

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Customer PO No</label>
                                <p id="poNo"></p>
                            </div>

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Customer PO Date</label>
                                <p id="poDate"></p>
                            </div>

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Sales Person Name</label>
                                <p id="salePersonName"></p>
                            </div>

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Remarks</label>
                                <p id="remarks"></p>
                            </div>

                            <div class="col-sm-12 form-group" id="viewAttSO">
                                <label class="text-gray mb-0" style="font-weight: bold;">Uploaded Customer PO</label>
                                <p><a href="" target="blank" id="item_attSO"></a></p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
}