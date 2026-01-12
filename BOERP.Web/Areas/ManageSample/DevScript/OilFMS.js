$(document).ready(function () {

    //var obj1 = {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 16,
    //    manualTableId: 0,
    //    ScreenId: 'Sample_101'
    //}
    //LoadMasterDropdown('ddlCustomer', obj1, 'All', false);

    //var obj2 = {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 7,
    //    manualTableId: 0,
    //    ScreenId: 'Sample_101'
    //}
    //LoadMasterDropdown('ddlChemist', obj2, 'All', false);

    //LoadMasterDropdown('txtChemist', obj2, 'Select', false);



    //var obj3 = {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 8,
    //    manualTableId: 0,
    //    ScreenId: 'Sample_101'
    //}
    //LoadMasterDropdown('ddlItem', obj3, 'All', false);

    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 72,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
 

        LoadMasterDropdown('ddlUnit', obj4, 'Select', false, '');

    var obj10 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 17,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlTask', obj10, 'All', false);

    //if (isDispatch == 1) {
    //    $("#ddlTask").val(8).trigger('change')
    //    $('#ddlTask').prop('disabled', true);
    //}
    //var obj4 = {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 1,
    //    manualTableId: 0,
    //    ScreenId: 'Sample_101'
    //}

    //LoadMasterDropdown('ddlSampleType', obj4, 'All', false);


    //var obj5 = {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 9,
    //    manualTableId: 0,
    //    ScreenId: 'Sample_101'
    //}
    //LoadMasterDropdown('ddlBaseItem', obj5, 'Select', false);

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


});

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


            if (tblItemStock.length > 0) {
                availQ_Unit = response.data.data.Table1[0].UNIT;
            }

            $('#avialquantity').text(tblItemStock?.length > 0 ? parseFloat(tblItemStock[0].CQty).toFixed(2) : '0');

            $('#uomhtml').html(availQ_Unit);

            console.log(response);
        });
    }
    else {
        FailToaster('Item or warehouse missing!!!');
    }
}



let tblData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    if (isUno == 2) {

        $('#open').removeClass('active');
        $('#completed').addClass('active');

        bindItemMasterGrid2();
        
    }
    else {
        bindItemMasterGrid();
    }

    isUn = 0


});

var isUn = 0

var sample_id
function showDataOilLFMS(Id, TaskNo) {

    var data;

    sample_id = Id;
    if (TaskNo == 1) {
        $('#markdone').modal('show');

        data = tblData.find(input => input.Id == Id);

        showData(Id);

        FetchCurrentStock(data.Item_ID, data.Warehouse_Id);

        if (data.SD_FileURL.length <= 1) {
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

        FetchArrNo(data.Item_ID);

        // ShowQCMappingRejected(data.Item_ID, )
    }
    else if (TaskNo == 3) {

        data = tblData.find(input => input.Id == Id);

        window.location.href = `EnterDispatchSample?auth=${AuthToken}&id=${data.ERP_Sample_Id}&&isUn=1`
    }

   

    else if (TaskNo == 4) {

        $('#last_step').html(4);

        data = tblData.find(input => input.Id == Id);

        $('#remarks8').val('');

        $('#markdone4').modal('show');
    }


}




function showDataOilULFMS(Id, TaskNo) {

    var data;

    sample_id = Id;
    if (TaskNo == 1) {
        $('#markdone16').modal('show');

        data = tblData.find(input => input.Id == Id);

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
        $('#remarks8').val('');
    }


}



let fileModelList = [];
var Arr_Table = [];



function ShowQCMappingInitiated(sampleId) {


    var model = {
        Item_Id: sampleId,
        Type: 2
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "Oil_Sample_101";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var data = response.data.data.Table;


        //var data1 = response.data.data.Table1;
        


        BindTableQCTestInitiated(data);
    });

    $("#qctestmappingInitiated").modal('show');
}



function BindTableQCTestInitiated(filteredData) {
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
                "render": function (data, type, row) {
                    if (row.ResultType == 'Text')
                        return '<input type="text" value="' + row.ResultMin + '" autocomplete="off" onkeypress="return RestrictNoAlpha(event)" onpaste="return RestrictNoAlphaPaste(event)"  class="form-control MandateInitiated" placeholder="Enter" id="tbResultMinInitiated_' + row.QCID + '_' + row.GrnItemQCResultId + '" onchange="HideErrorMessage(this)"> <span id="sptbResultMinInitiated_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';
                    else
                        return '<input type="number" value="' + row.ResultMin + '" autocomplete="off"   class="form-control MandateInitiated" onkeydown="blockInvalidKeys(event)" placeholder="Enter" id="tbResultMinInitiated_' + row.QCID + '_' + row.GrnItemQCResultId + '" onchange="HideErrorMessage(this)"> <span id="sptbResultMinInitiated_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';

                }
            }
        ]
    });


}


function RestrictNoAlpha(e) {
    let char = String.fromCharCode(e.which);
    if (!/^[a-zA-Z ]+$/.test(char)) {
        e.preventDefault();  // block numbers & symbols
        return false;
    }
    return true;
}

function BindTableQCTestInitiated(filteredData) {
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
                "render": function (data, type, row) {
                    if (row.ResultType == 'Text')
                        return '<input type="text" value="' + row.ResultMin + '" autocomplete="off"   class="form-control MandateInitiated" placeholder="Enter" id="tbResultMinInitiated_' + row.QCID + '_' + row.GrnItemQCResultId + '" oninput="HideErrorMessage(this)"> <span id="sptbResultMinInitiated_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';
                    else
                        return '<input type="text" value="' + row.ResultMin + '" autocomplete="off"   class="form-control MandateInitiated"  placeholder="Enter" id="tbResultMinInitiated_' + row.QCID + '_' + row.GrnItemQCResultId + '" oninput="HideErrorMessage(this)"> <span id="sptbResultMinInitiated_' + row.QCID + '_' + row.GrnItemQCResultId + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>';

                }
            }
        ]
    });


}



async function SaveDataInitiated() {
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
            Id: sample_id,
            Remark: $('#txtRemarkInitiated').val(),
            Type: 2,
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
            bindItemMasterGrid2();
        });

    }
}


function FetchArrNo(itemId) {
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

            Arr_Table = response.data.data.Table;
             
            if (table.length > 0) {
                $('#item_Name2').html(table[0].ITEM_NAME);
                $('#Item_Code2').html(table[0].ITEM_CODE);
                $('#vendor_name2').html(table[0].Supplier == null ? `` : table[0].Supplier);

                for (var i = 0; i < table.length; i++) {


                    var ele = `
            <tr>
                 <td>
                  <input type="radio" id="${table[i].ARNUMBER}_${table[i].GRNItemId}" onclick="ShowPHValue(${table[i].GRNItemId},${table[i].Item_Id})" class="radio" name="status" value="">
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
            }


        });
    }
    else {
        FailToaster('Item Id missing !!!');
    }
}

var testNameArray = [];

function ShowQCMappingParam(itemId) {
    ItemIdData = itemId;
    var model =
    {
        Id: itemId,
        Type: 7
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        
        testNameArray = response.data.data.Table.filter(item => item.CategoryName.includes("Oil"));

        $("#tblQCTestMapping tbody").html('');

        BindHTMLTableQualityParameters(0);

    });
    $("#qctestmapping").modal('show');
}


function BindHTMLTableQualityParameters(docID) {
    var rowCount = $("#tblQCTestMapping tbody tr").length;
    if (rowCount > 0) {
        return false;
    }
    // Create a row element
    var row = $("<tr id='row_" + (rowCount + 1)  + "'></tr>");

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
        document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Numeric_Value;
    }
    if (selectedCode == 2) {
        $('#txtNumber' + rowId + '').hide();
        $('#txtText' + rowId + '').show();
        $('#divRange' + rowId + '').hide();

        $('#txtText' + rowId + '').val(result.Text_Value);
        document.getElementById('spResultType' + rowId + '').innerText = 'Text';
        document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Text_Value;
    }
    if (selectedCode == 3) {
        $('#txtNumber' + rowId + '').hide();
        $('#txtText' + rowId + '').hide();
        $('#divRange' + rowId + '').show();

        $('#txtApprovedMin' + rowId + '').val(result.Range_Min);
        $('#txtApprovedMax' + rowId + '').val(result.Range_Max);
        document.getElementById('spResultType' + rowId + '').innerText = 'Range';
        document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Range_Min + '-' + result.Range_Max;
    }
}

var Step2_Id = 0;
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

var QCTestMappingData;

function collectTableData() {
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

    var itemModel =
    {
        ID: 0,
        Sample_Id: sample_id,
        QCTestMapping: QCTestMappingData
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
        bindItemMasterGrid2();
    });




}


function SetZero(ctrl) {
    let val = parseFloat(ctrl.value);
    console.log(`Input value: ${val}`);

    if (isNaN(val) || val < 0) {
        ctrl.value = '';
        return;
    }

    const decimalPart = ctrl.value.split('.')[1];
    if (decimalPart && decimalPart.length > 3) {
        // Floor to 2 decimal places
        val = Math.floor(val * 1000) / 1000;
        ctrl.value = val.toString();
    }

}

function showTaskModal(id, authToken, FMS_Id) {
    $("#customLoader").show();
    $.get('/Account/GetTaskStatusModal', { id: id, auth: authToken, FMS_Id: FMS_Id, }, function (data) {
        $('#yourModalContainer').html(data);
        $('#viewstatus').modal('show');
        $("#customLoader").hide();
    });
}


function showData(id) {

    Edit_Id = id;

    var data = tblData.find(input => input.Id == id);
    if (!data) return;

    if (data.SampleType == 'Oil') {
        $('#fragView').hide();
        $('#colorView').hide();
        $('#packegingView').hide();
        //$('#viewReq').hide();
        $('#viewMust').hide();
        $('#viewMustNot').hide();
    }

    else {
        $('#fragView').show();
        $('#colorView').show();
        $('#packegingView').show();
        //$('#viewReq').show();
        $('#viewMust').show();
        $('#viewMustNot').show();
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

        handleTaskItemFile(data.FMSFileUrl, data.FMSActualFileName);
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

        handleTaskItemFile(data.FMSFileUrl, data.FMSActualFileName);
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
            AvailQ_Unit: availQ_Unit,
            FMSStep: 2,
            FMSType: 'OilL',
            Sample_Id: sample_id,
            Type: 1,
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
                bindItemMasterGrid();
            }

        });

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
            Type: 1,
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
                bindItemMasterGrid2();
            }

        });

    }

}

function SaveOilLFMSStep2() {



        var avaiQ = parseFloat($('#avialquantity').text()) || 0;

    if (!Step2_Id) {
        FailToaster('Please select atleast one AR Number !!!')
        return;
    }

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

        var arr = Arr_Table.find(input => input.GRNItemId == Step2_Id);

        var model = {
            ArnNo: arr.ARNUMBER,
            ApprovedQty: arr.ApprovedQty,
            FMSStep: 3,
            FMSType: 'OilL',
            Sample_Id: sample_id,
            AvailQ_Unit: arr.UOM,
            Type: 2
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
                bindItemMasterGrid();
            }

        });


}

function bindTasksOilL() {

    $('#open').addClass('active');
    $('#completed').removeClass('active');

    var obj10 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 17,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlTask', obj10, 'All', false);

    $('#ddlTask').val('All').trigger('change');

}

function bindTasksOilUL() {

    $('#open').removeClass('active');
    $('#completed').addClass('active');

    var obj10 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 18,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlTask', obj10, 'All', false);

    $('#ddlTask').val('All').trigger('change');

}


function ShowQCMappingRejected(itemId, grnIItemId) {
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

        var data1 = response.data.data.Table1;

        console.log(data1);

    });
  
}

function bindItemMasterGrid2() {
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
            Task: 0,
            Type: 3,
            SampleID: $('#txtSampleId').val(),
        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tblData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'OilULSampleFMS', columnMeta, tblData);
        $("#customLoader").hide();
    });
}



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
            Task: 0,
            Type: 2,
            SampleID: $('#txtSampleId').val(),
        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tblData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'OilLSampleFMS', columnMeta, tblData);
        $("#customLoader").hide();
    });
}


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



function SaveBasicInfo8(IsApproved) {

    if (checkValidationOnSubmit('Mandatory8')) {

        var obj = {
            Id: sample_id,
            IsApproved: IsApproved,
            Type: '',
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
                $('#markdone4').modal('hide');
                // BindData();
                if ($('#completed').hasClass('active')) {
                    $('#remarks8').val('');
                    bindItemMasterGrid2();
                }
                else {
                    $('#remarks8').val('');
                    bindItemMasterGrid();
                }
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