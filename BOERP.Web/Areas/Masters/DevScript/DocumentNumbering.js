$(document).ready(function () {
    LoadMasterDropdown('ddlNewBranch', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 76,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false);
    LoadMasterDropdown('ddlNewPeriodInd', {
        parentId: companyId,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 78,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false);
    LoadMasterDropdown('ddlSAIncrease', {
        parentId: companyId,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 85,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false);
    LoadMasterDropdown('ddlSADecrease', {
        parentId: companyId,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 85,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false);
    BuildTable();

    BindMenuDocNo();
});


function DisplayNewNumbering(menuId, moduleId, moduleName, menuName) {
    document.getElementById('spDocumentName').innerHTML = menuName;
    $('#hddMenuId').val(menuId);
    $('#hddModuleId').val(moduleId);
    $('#hddModuleName').val(moduleName);
    $('#txtNewName').val('');
    $('#txtNewFirstNo').val('');
    $('#txtNewPrefix').val('');
    $('#ddlNewPeriodInd').val('Select').trigger('change');
    $('#ddlNewBranch').val('Select').trigger('change');
    $("#newumbering").modal('show');
}
var finYearArray = [];
var branchArray = [];
var docTypeArray = [];
var saPostingArray = [
    { ID: 1, ValueName: "Yes" },
    { ID: 2, ValueName: "No" }
];
function DisplayEditNumbering(menuId, moduleId, moduleName, menuName) {

    $('#hddMenuId').val(menuId);
    $('#hddModuleId').val(moduleId);
    $('#hddModuleName').val(moduleName);
    document.getElementById('spEditDocumentName').innerHTML = menuName;
    //$('#hddEditDocument').val(rowId)
    var model = {
        ID: menuId,
        ParentId: companyId
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "Doc_Numb_101";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        finYearArray = response.data.data.Table1;
        branchArray = response.data.data.Table2;
        //docTypeArray = response.data.data.Table3;
        docTypeArray = response.data.data.Table4;
        bindDocumentsTable(response.data.data.Table);
    });
    $("#editumbering").modal('show');
}
function bindDocumentsTable(documents) {
    // Empty the table body first
    $("#tbleEditDocumentNumber tbody").empty();
    var docID = "0";
    // Iterate over your data
    $.each(documents, function (index, doc) {
        // Create a row element
        var row = $("<tr></tr>");

        // Create table cells
        // Column 1: Serial number and a hidden input for document id
        var colSerial = $('<td>' + (index + 1) + '<input type="hidden" id="hddEditDocument" value="' + doc.SERIES_ID + '" /></td>');

        // Column 2: Name input
        var colName = $('<td>' +
            '<input type="text" onchange="HideErrorMessage(this)" id="txtEditName' + (index + 1) + '" class="form-control MandatoryEditDoc" placeholder="Enter" value="' + doc.DOC_CAPTION + '">' +
            '<span id="sptxtEditName' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        // Column 3: First No.
        var colFirstNo = $('<td>' +
            '<input type="text" onchange="HideErrorMessage(this); EditMaxNextNumber();" id="txtEditFirstNo' + (index + 1) + '" class="form-control text-right MandatoryEditDoc" placeholder="0" value="' + doc.START_NO + '">' +
            '<span id="sptxtEditFirstNo' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        // Column 6: Prefix
        var colPrefix = $('<td>' +
            '<input type="text" onchange="HideErrorMessage(this)" id="txtEditPrefix' + (index + 1) + '" class="form-control MandatoryEditDoc" placeholder="Enter" value="' + doc.PREFIX + '">' +
            '<span id="sptxtEditPrefix' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        // Column 7: Period Ind. (dropdown)
        var colPeriodInd = $('<td>' +
            '<select onchange="HideErrorMessage(this)" id="ddlEditPeriodInd' + (index + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
            '<span id="spddlEditPeriodInd' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        //// Column 8: Branch (dropdown)
        var colBranch = $('<td>' +
            '<select onchange="HideErrorMessage(this)" id="ddlEditBranch' + (index + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
            '<span id="spddlEditBranch' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');
        var colSAPosting = $('<td>' +
            '<select onchange="HideErrorMessage(this); EnableDoc(this,' + (index + 1) + ')" id="ddlSAPosting' + (index + 1) + '" class="form-control applyselect "></select>' +
            '<span id="spddlSAPosting' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');
        var colSAIncrease = $('<td>' +
            '<select onchange="HideErrorMessage(this)" id="ddlSAIncrease' + (index + 1) + '" class="form-control applyselect "></select>' +
            '<span id="spddlSAIncrease' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');
        var colSADecrease = $('<td>' +
            '<select onchange="HideErrorMessage(this)" id="ddlSADecrease' + (index + 1) + '" class="form-control applyselect "></select>' +
            '<span id="spddlSADecrease' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        // Column 9: Lock (checkbox)
        var colLock = $('<td>' +
            '<input type="checkbox" id="checkEditlock' + (index + 1) + '" name="type" class="singlecheck" value="" ' + (doc.DOC_LOCK ? 'checked' : '') + '>' +
            '<label for="checkEditlock' + (index + 1) + '"></label>' +
            '</td>');
        // Column 10: Lock (checkbox)
        var colDefaultLock = $('<td class="text-center">' +
            '<input type="radio"  id="checkEditDefaultlock' + (index + 1) + '" name="type" class="radio" value="" ' + (doc.DEFAULT_DOC ? 'checked' : '') + '>' +
            '<label for="checkEditDefaultlock' + (index + 1) + '"></label>' +
            '</td>');
        // Column 11: Lock (checkbox)
        var colInactiveInactiveLock = $('<td>' +
            '<input type="checkbox" id="checkEditInactiveInactivelock' + (index + 1) + '" name="type" class="singlecheck" value="" ' + (doc.IsDocumentActive ? 'checked' : '') + '>' +
            '<label for="checkEditInactiveInactivelock' + (index + 1) + '"></label>' +
            '</td>');
        // Column 12: Lock (Doctype_Id)
        var colDocTypeId = $('<td style="display:none">' +
            '<input type="hidden"  id="hddDocTypeId' + (index + 1) + '" class="form-control" placeholder="Enter" value="' + doc.DOCID + '">' +
            '</td>');
        docID = doc.DOCID;
        var colDeleteRow = $('<td>' +
            '<a href="#" id="btnDelete' + (index + 1) + '" class="btnDelete disabled"   data-toggle="tooltip" title=""    data-original-title="Delete">' +
            '<img  onclick="DeleteTableRow(' + (index + 1) + ')" src = "../../assets/images/icons/help/svg/delete-icon.svg" alt = "Delete" ></img></a>' +
            '</td>');
        // Column 12: DOC ID (DOC ID)
        var colDocId = $('<td style="display:none">' +
            '<input type="hidden"  id="hddDocId' + (index + 1) + '" class="form-control" placeholder="Enter" value="' + doc.SERIES_ID + '">' +
            '</td>');
        // Column 12: Lock (Doctype_Id)       
        // Append each cell to the row
        row.append(colSerial)
            .append(colName)
            .append(colFirstNo)
            .append(colPrefix)
            .append(colPeriodInd)
            .append(colDefaultLock)
            .append(colBranch)
            .append(colSAPosting)
            .append(colSAIncrease)
            .append(colSADecrease)
            .append(colLock)
            .append(colInactiveInactiveLock)
            .append(colDocTypeId)
            .append(colDeleteRow)
            .append(colDocId);

        // Finally, append the row to the table body 
        $("#tbleEditDocumentNumber tbody").append(row);
        var $ele0 = $('#ddlSAPosting' + (index + 1) + '');
        $ele0.empty();
        $.each(saPostingArray, function (ii, vall) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName);
            $ele0.append($option);
        });

        var $ele1 = $('#ddlEditBranch' + (index + 1) + '');
        $ele1.empty();
        $ele1.append($('<option/>').val('').text('Select'));
        $.each(branchArray, function (ii, vall) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName);
            $ele1.append($option);
        });

        var $ele2 = $('#ddlEditPeriodInd' + (index + 1) + '');
        $ele2.empty();
        $ele2.append($('<option/>').val('').text('Select'));
        $.each(finYearArray, function (ii, vall) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName);
            $ele2.append($option);
        });
        var $ele3 = $('#ddlSAIncrease' + (index + 1) + '');
        $ele3.empty();
        $ele3.append($('<option/>').val('').text('Select'));
        $.each(docTypeArray, function (ii, vall) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName);
            $ele3.append($option);
        });
        var $ele4 = $('#ddlSADecrease' + (index + 1) + '');
        $ele4.empty();
        $ele4.append($('<option/>').val('').text('Select'));
        $.each(docTypeArray, function (ii, vall) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName);
            $ele4.append($option);
        });

        $('#checkEditlock' + (index + 1)).val(doc.DOC_LOCK);
        $('#checkEditDefaultlock' + (index + 1)).val(doc.DEFAULT_DOC);
        $('#checkEditInactiveInactivelock' + (index + 1)).val(doc.IsDocumentActive);
        $('#ddlEditBranch' + (index + 1)).val(doc.BranchID).trigger('change');
        $('#ddlEditPeriodInd' + (index + 1)).val(doc.FinID);
        $('#ddlEditBranch' + (index + 1)).prop('disabled', doc.DOC_LOCK == true ? true : false); // Enables the dropdown
        $('#ddlEditPeriodInd' + (index + 1)).prop('disabled', doc.DOC_LOCK == true ? true : false); // Enables the dropdown
        $('#txtEditName' + (index + 1)).prop('readonly', doc.DOC_LOCK == true ? true : false);
        $('#txtEditFirstNo' + (index + 1)).prop('readonly', doc.DOC_LOCK == true ? true : false);
        $('#txtEditFirstNo' + (index + 1)).prop('readonly', doc.DOC_LOCK == true ? true : false);
        $('#txtEditPrefix' + (index + 1)).prop('readonly', doc.DOC_LOCK == true ? true : false);
        $('#ddlSAPosting' + (index + 1)).val(doc.SAPosting).trigger('change');
        $('#ddlSAIncrease' + (index + 1)).val(doc.SAIncrease).trigger('change');
        $('#ddlSADecrease' + (index + 1)).val(doc.SADecrease).trigger('change');
        $('#ddlSAPosting' + (index + 1)).prop('disabled', doc.DOC_LOCK == true ? true : false);
        $('#ddlSAIncrease' + (index + 1)).prop('disabled', doc.DOC_LOCK == true ? true : false);
        $('#ddlSADecrease' + (index + 1)).prop('disabled', doc.DOC_LOCK == true ? true : false);
    });

    AddRowDocumentNumbering(docID);
}
function DeleteTableRow(deleteRowId) {

}
function AddRowDocumentNumbering(docID) {
    var rowCount = $("#tbleEditDocumentNumber tbody tr").length;
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells
    // Column 1: Serial number and a hidden input for document id
    var colSerial = $('<td>' + (rowCount + 1) + '<input type="hidden" id="hddEditDocument" value="" /></td>');

    // Column 2: Name input
    var colName = $('<td>' +
        '<input type="text" onchange="HideErrorMessage(this)" id="txtEditName' + (rowCount + 1) + '" class="form-control MandatoryEditDoc" placeholder="Enter" value="">' +
        '<span id="sptxtEditName" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');

    // Column 3: First No.
    var colFirstNo = $('<td>' +
        '<input type="text" onchange="HideErrorMessage(this); EditMaxNextNumber();" id="txtEditFirstNo' + (rowCount + 1) + '" class="form-control text-right MandatoryEditDoc" placeholder="0" value="">' +
        '<span id="sptxtEditFirstNo" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');

    // Column 6: Prefix
    var colPrefix = $('<td>' +
        '<input type="text" onchange="HideErrorMessage(this)" id="txtEditPrefix' + (rowCount + 1) + '" class="form-control MandatoryEditDoc" placeholder="Enter" value="">' +
        '<span id="sptxtEditPrefix" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');

    // Column 7: Period Ind. (dropdown)
    var colPeriodInd = $('<td>' +
        '<select onchange="HideErrorMessage(this)" id="ddlEditPeriodInd' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlEditPeriodInd' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');

    //// Column 8: Branch (dropdown)
    var colBranch = $('<td>' +
        '<select onchange="HideErrorMessage(this)" id="ddlEditBranch' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlEditBranch' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    var colSAPosting = $('<td>' +
        '<select onchange="HideErrorMessage(this); EnableDoc(this,' + (rowCount + 1) + ')" id="ddlSAPosting' + (rowCount + 1) + '" class="form-control applyselect "></select>' +
        '<span id="spddlSAPosting' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    var colSAIncrease = $('<td>' +
        '<select onchange="HideErrorMessage(this)" id="ddlSAIncrease' + (rowCount + 1) + '" class="form-control applyselect "></select>' +
        '<span id="spddlSAIncrease' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    var colSADecrease = $('<td>' +
        '<select onchange="HideErrorMessage(this)" id="ddlSADecrease' + (rowCount + 1) + '" class="form-control applyselect "></select>' +
        '<span id="spddlSADecrease' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 9: Lock (checkbox)
    var colLock = $('<td>' +
        '<input type="checkbox" id="checkEditlock' + (rowCount + 1) + '" name="type" class="singlecheck" value="">' +
        '<label for="checkEditlock' + (rowCount + 1) + '"></label>' +
        '</td>');
    // Column 10: Lock (checkbox)
    var colDefaultLock = $('<td class="text-center">' +
        '<input type="radio" id="checkEditDefaultlock' + (rowCount + 1) + '" name="type" class="radio" value="">' +
        '<label for="checkEditDefaultlock' + (rowCount + 1) + '"></label>' +
        '</td>');
    // Column 11: Lock (checkbox)
    var colInactiveInactiveLock = $('<td>' +
        '<input type="checkbox" id="checkEditInactiveInactivelock' + (rowCount + 1) + '" name="type" class="singlecheck" value="">' +
        '<label for="checkEditInactiveInactivelock' + (rowCount + 1) + '"></label>' +
        '</td>');
    // Column 12: Lock (Doctype_Id)
    var colDocTypeId = $('<td style="display:none">' +
        '<input type="hidden"  id="hddDocTypeId' + (rowCount + 1) + '" class="form-control" placeholder="Enter" value="' + docID + '">' +
        '</td>');
    var colDeleteRow = $('<td>' +
        '<a href="#" class="btnDelete" id="btnDelete"  data-toggle="tooltip" title=""    data-original-title="Delete">' +
        '<img onclick="DeleteTableRow(' + (rowCount + 1) + ')" src = "../../assets/images/icons/help/svg/delete-icon.svg" alt = "Delete" ></img></a>' +
        '</td>');
    // Column 12: DOC ID (DOC ID)
    var colDocId = $('<td style="display:none">' +
        '<input type="hidden"  id="hddDocId' + (rowCount + 1) + '" class="form-control" placeholder="Enter" value="' + 0 + '">' +
        '</td>');
    // Append each cell to the row
    row.append(colSerial)
        .append(colName)
        .append(colFirstNo)
        .append(colPrefix)
        .append(colPeriodInd)
        .append(colDefaultLock)
        .append(colBranch)
        .append(colSAPosting)
        .append(colSAIncrease)
        .append(colSADecrease)
        .append(colLock)
        .append(colInactiveInactiveLock)
        .append(colDocTypeId)
        .append(colDeleteRow)
        .append(colDocId);

    $("#tbleEditDocumentNumber tbody").append(row);
    var $ele0 = $('#ddlSAPosting' + (rowCount + 1) + '');
    $ele0.empty();
    $.each(saPostingArray, function (ii, vall) {
        var $option = $('<option />')
            .val(vall.ID)
            .text(vall.ValueName);
        if (vall.ID == "1") {
            $option.attr("selected", "selected");
        }
        $ele0.append($option);
    });



    var $ele1 = $('#ddlEditBranch' + (rowCount + 1) + '');
    $ele1.empty();
    $ele1.append($('<option/>').val('').text('Select'));
    $.each(branchArray, function (ii, vall) {
        var $option = $('<option />')
            .val(vall.ID)
            .text(vall.ValueName);
        $ele1.append($option);
    });
    var $ele2 = $('#ddlEditPeriodInd' + (rowCount + 1) + '');
    $ele2.empty();
    $ele2.append($('<option/>').val('').text('Select'));
    $.each(finYearArray, function (ii, vall) {
        var $option = $('<option />')
            .val(vall.ID)
            .text(vall.ValueName);
        $ele2.append($option);
    });
    var $ele3 = $('#ddlSAIncrease' + (rowCount + 1) + '');
    $ele3.empty();
    $ele3.append($('<option/>').val('').text('Select'));
    $.each(docTypeArray, function (ii, vall) {
        var $option = $('<option />')
            .val(vall.ID)
            .text(vall.ValueName);
        $ele3.append($option);
    });
    var $ele4 = $('#ddlSADecrease' + (rowCount + 1) + '');
    $ele4.empty();
    $ele4.append($('<option/>').val('').text('Select'));
    $.each(docTypeArray, function (ii, vall) {
        var $option = $('<option />')
            .val(vall.ID)
            .text(vall.ValueName);
        $ele4.append($option);
    });
}
function EnableDoc(ctrl, no) {
    if (ctrl.value != "1") {
        $('#ddlSAIncrease' + (no) + '').prop("selectedIndex", 0).trigger('change');
        $('#ddlSADecrease' + (no) + '').prop("selectedIndex", 0).trigger('change');

        $('#ddlSAIncrease' + (no) + '').attr("disabled", true);
        $('#ddlSADecrease' + (no) + '').attr("disabled", true);
    }
    else {
        $('#ddlSAIncrease' + (no) + '').removeAttr("disabled");
        $('#ddlSADecrease' + (no) + '').removeAttr("disabled");
        $('#ddlSAIncrease' + (no) + '').prop("selectedIndex", 0).trigger('change');
        $('#ddlSADecrease' + (no) + '').prop("selectedIndex", 0).trigger('change');
    }
}
function EnableDocPopup(ctrl) {
    if (ctrl.value != "1") {
        $('#ddlSAIncrease').prop("selectedIndex", 0).trigger('change');
        $('#ddlSADecrease').prop("selectedIndex", 0).trigger('change');
        $('#ddlSAIncrease').attr("disabled", true);
        $('#ddlSADecrease').attr("disabled", true);

    }
    else {
        $('#ddlSAIncrease').removeAttr("disabled");
        $('#ddlSADecrease').removeAttr("disabled");
        $('#ddlSAIncrease').prop("selectedIndex", 0).trigger('change');
        $('#ddlSADecrease').prop("selectedIndex", 0).trigger('change');
    }
}
function SaveDocumentNumbering() {
    var valid = true;
    if (checkValidationOnSubmit('MandatoryNewDoc') == false) {
        valid = false;
    }
    if (valid == true) {
        let dateRange = $('#ddlNewPeriodInd option:selected').text();// "Apr 1 2024 - Mar 31 2025";
        let shortYear = "";
        // Extract years using regex
        let yearsPeriod = dateRange.match(/\d{4}/g); // ["2024", "2025"]

        if (yearsPeriod.length === 2) {
            shortYear = yearsPeriod.map(year => year.slice(2)).join(""); // "2425"            
        }
        var tableData1 = {
            ID: 0,
            DOCTYPE_ID: 0,
            DOC_TYPE: $('#hddModuleName').val(),
            DOC_CAPTION: $('#txtNewName').val(),
            GROUP_ID: $('#hddModuleId').val(),
            REF_ID: 0,
            PREFIX: $('#txtNewPrefix').val(),
            DESCRIPTION: '',
            SERIES_TYPE: 'Manual',
            SERIES_NO: shortYear,
            START_NO: $('#txtNewFirstNo').val(),
            DOC_LOCK: document.getElementById('checkNewLock').checked,
            MenuID: $('#hddMenuId').val(),
            DEFAULT_DOC: document.getElementById('checkIsDefault').checked,
            FinID: $('#ddlNewPeriodInd').val(),
            BranchID: $('#ddlNewBranch').val(),
            SAPosting: $('#ddlSAPosting').val(),
            SAIncrease: $('#ddlSAIncrease').val(),
            SADecrease: $('#ddlSADecrease').val(),
            SAPostingName: $('#ddlSAPosting option:selected').text() == 'Select' ? '' : $('#ddlSAPosting option:selected').text(),
            SAIncreaseName: $('#ddlSAIncrease option:selected').text() == 'Select' ? '' : $('#ddlSAIncrease option:selected').text(),
            SADecreaseName: $('#ddlSADecrease option:selected').text() == 'Select' ? '' : $('#ddlSADecrease option:selected').text(),
            IsDocumentActive: document.getElementById('checkActiveInActive').checked
        };


        var model = {
            DocumentNumber: tableData1
        };

        const jsonString = JSON.stringify(model);
        let GenericModeldata =
        {
            ScreenID: "Doc_Numb_101",
            Operation: "A",
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            BuildTable();
            $("#newumbering").modal('hide');
        });
    }
}
$(document).on('click', '.btnDelete', function () {
    $(this).closest('tr').remove();
});
function UpdateDocumentNumbering() {
    var valid = true;
    if (checkValidationOnSubmit('MandatoryEditDoc') == false) {
        valid = false;
    }
    if (valid == true) {
        collectTableData();

        var model = {
            DocumentNumber: tableData
        };

        const jsonString = JSON.stringify(model);
        let GenericModeldata =
        {
            ScreenID: "Doc_Numb_101",
            Operation: "U",
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            BuildTable();
            $("#editumbering").modal('hide');
        });
    }
}
function collectTableData() {
    // Create an empty array to store row data
    tableData = [];
    // Select all rows in the table body (excluding any header row)
    // Assuming your <tbody> has the id="table-body"
    $('#tbleEditDocumentNumber tbody tr').each(function (index) {
        // 'this' refers to the current <tr>
        let dateRange = $('#ddlEditPeriodInd' + (index + 1) + ' option:selected').text();// "Apr 1 2024 - Mar 31 2025";
        let shortYear = "";
        // Extract years using regex
        let yearsPeriod = dateRange.match(/\d{4}/g); // ["2024", "2025"]

        if (yearsPeriod.length === 2) {
            shortYear = yearsPeriod.map(year => year.slice(2)).join(""); // "2425"            
        }
        // Collect the values from the cells/inputs within this row
        var doc_CAPTION = $(this).find('#txtEditName' + (index + 1) + '').val();       // Series Name
        var firstNo = $(this).find('#txtEditFirstNo' + (index + 1) + '').val();    // First No.
        var prefix = $(this).find('#txtEditPrefix' + (index + 1) + '').val();     // Prefix
        var periodInd = $(this).find('#ddlEditPeriodInd' + (index + 1) + '').val();  // Period Ind. (dropdown)
        var branch = $(this).find('#ddlEditBranch' + (index + 1) + '').val();     // Branch (dropdown)
        var saPosting = $(this).find('#ddlSAPosting' + (index + 1) + '').val();     // Branch (dropdown)
        var saIncrease = $(this).find('#ddlSAIncrease' + (index + 1) + '').val();     // Branch (dropdown)
        var saDecrease = $(this).find('#ddlSADecrease' + (index + 1) + '').val();     // Branch (dropdown)
        var saPostingName = $(this).find('#ddlSAPosting' + (index + 1) + ' option:selected').text();     // Branch (dropdown)
        var saIncreaseName = $(this).find('#ddlSAIncrease' + (index + 1) + ' option:selected').text();     // Branch (dropdown)
        var saDecreaseName = $(this).find('#ddlSADecrease' + (index + 1) + ' option:selected').text();     // Branch (dropdown)
        var isLocked = $(this).find('#checkEditlock' + (index + 1) + '').is(':checked'); // Lock (checkbox)
        var isDefault = $(this).find('#checkEditDefaultlock' + (index + 1) + '').is(':checked'); // Default Series (checkbox)
        var isActive = $(this).find('#checkEditInactiveInactivelock' + (index + 1) + '').is(':checked');  // Active/Inactive (checkbox)
        var docTypeId = $(this).find('#hddDocTypeId' + (index + 1) + '').val();
        var docId = $('#hddDocId' + (index + 1) + '').val();

        // Build an object representing a single row
        var rowData = {
            DOCTYPE_ID: docTypeId,
            DOC_TYPE: '',
            DOC_CAPTION: doc_CAPTION,
            GROUP_ID: $('#hddModuleId').val(),
            REF_ID: 0,
            PREFIX: prefix,
            DESCRIPTION: '',
            SERIES_TYPE: 'Manual',
            SERIES_NO: shortYear,
            START_NO: firstNo,
            DOC_LOCK: isLocked,
            MenuID: $('#hddMenuId').val(),
            DEFAULT_DOC: isDefault,
            FinID: periodInd,
            BranchID: branch,
            SAPosting: saPosting,
            SAIncrease: saIncrease,
            SADecrease: saDecrease,
            SAPostingName: saPostingName == 'Select' ? '' : saPostingName,
            SAIncreaseName: saIncreaseName == 'Select' ? '' : saIncreaseName,
            SADecreaseName: saDecreaseName == 'Select' ? '' : saDecreaseName,
            IsDocumentActive: isActive,
            DOCID: docId
        };

        // Push it into the array
        tableData.push(rowData);
    });

    // Now tableData is an array of objects containing all rows' data
    return tableData;
}

function NewMaxNextNumber() {
    var FirstNo = $('#txtNewFirstNo').val();
    $('#txtNewNextNo').val(parseInt(FirstNo) + 1);
}
function EditMaxNextNumber() {
    var FirstNo = $('#txtEditFirstNo').val();
    $('#txtEditNextNo').val(parseInt(FirstNo) + 1);
}

function NewMaxLastNumber() {
    var FirstNo = $('#txtNewFirstNo').val();
    var LastNo = $('#txtNewLastNo').val();
    if (parseInt(LastNo) < parseInt(FirstNo)) {
        alert('Last no should be grater then first no.')
    }
}

/*Item Category Doc No*/

function BindMenuDocNo() {
    let groupedData = {};
    var model = {
        ID: 0,
        MenuType: 1
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "MenuDocNo_101";
    var addRow = "";
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        if (response.data.data.Table.length > 0) {
            menuData = response.data.data.Table; 
            menuData.forEach(item => {
                if (!groupedData[item.ParentMenuID]) {
                    groupedData[item.ParentMenuID] = { module: item.ModuleName, menus: [] };
                }
                groupedData[item.ParentMenuID].menus.push(item);
            });

            let tbody = $("#tblDocNoByMenu tbody");
            tbody.empty(); // Clear table before adding new rows

            // Loop through grouped data and append to table
            $.each(groupedData, function (parentID, group) {
                let headerRow = `
			<tr class="group-header" data-group="${parentID}">
				<td colspan="6" class="cursor-pointer" ><strong> ${group.module} </strong> <span class="toggle-icon float-right"><img src="../../assets/images/icons/help/bottom-arrow-black-sm.png" alt="" class="btn-icon m-0 align-self-center"></span></td>
			</tr>`;
                tbody.append(headerRow);

                // Add child menu items (initially hidden)
                group.menus.forEach(menu => {
                    let childRow = `
				<tr class="group-content ${parentID}" style="display:none;">
					<td>${menu.MenuName}</td>
					<td colspan="3">${menu.DefaultSeries || ""}</td>
					<td class="text-right">${menu.FirstNo || ""}</td>
					<td class="text-center"><div class="dropdown">
				<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
								<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
				</span>
				<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
					<a class="dropdown-item" onclick="DisplayEditMenuDocNo(${menu.MenuID},${parentID},'${group.module}','${menu.MenuName}');">Edit</a>
				</div>
				</div>
				</td>
				</tr>`;
                    tbody.append(childRow);
                });
            });

            // Expand/Collapse functionality
            // Prevent bubbling if clicking on inner elements like icons
            $(".group-header").off("click").on("click", function (e) {
                // If the click originated from inside .toggle-icon, ignore (or allow)
                if ($(e.target).closest(".toggle-icon").length > 0) {
                    // Optional: Do nothing OR let it pass
                }

                let group = $(this).data("group");
                $(".group-content." + group).slideToggle();
            });
        }
    });
    // Group data by ParentMenuID

}

function DisplayEditMenuDocNo(menuId, moduleId, moduleName, menuName) {
    $('#hddMenuId').val(menuId);
    $('#hddModuleId').val(moduleId);
    $('#hddModuleName').val(moduleName);
    document.getElementById('spEditDocumentName').innerHTML = menuName;
    //$('#hddEditDocument').val(rowId)
    var model = {
        ID: menuId,
        MenuType: 'Item Category',
        ParentId: companyId
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "MenuDocNo_102";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        finYearArray = response.data.data.Table1;
        branchArray = response.data.data.Table2;
        //docTypeArray = response.data.data.Table3;
        /*docTypeArray = response.data.data.Table4;*/
        bindDocNoByMenuTable(response.data.data.Table);
    });
    $("#editDocNoByMenu").modal('show');
}
function bindDocNoByMenuTable(documents) {
    // Empty the table body first
    $("#tbleEditDocNoByMenu tbody").empty();
    var docID = "0";
    // Iterate over your data
    $.each(documents, function (index, doc) {
        // Create a row element
        var row = $("<tr></tr>");

        // Create table cells
        // Column 1: Serial number and a hidden input for document id
        var colSerial = $('<td>' + (index + 1) + '<input type="hidden" id="hddEditDocument" value="' + doc.DocId + '" /></td>');

        // Column 2: Name input
        var colName = $('<td>' +
            '<input type="text" onchange="HideErrorMessage(this)" id="txtEditNameByMenu' + (index + 1) + '" class="form-control MandatoryEditDocByMenu" placeholder="Enter" value="' + doc.DocCaption + '">' +
            '<span id="sptxtEditNameByMenu' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        // Column 3: First No.
        var colFirstNo = $('<td>' +
            '<input type="text" onchange="HideErrorMessage(this); EditMaxNextNumber();" id="txtEditFirstNoByMenu' + (index + 1) + '" class="form-control text-right MandatoryEditDocByMenu" placeholder="0" value="' + doc.StartNo + '">' +
            '<span id="sptxtEditFirstNoByMenu' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        // Column 3: First No.
        var colARNFirstNo = $('<td>' +
            '<input type="text" onchange="HideErrorMessage(this); EditMaxNextNumber();" id="txtEditARNFirstNoByMenu' + (index + 1) + '" class="form-control text-right MandatoryEditDocByMenu" placeholder="0" value="' + doc.ARNFirstNo + '">' +
            '<span id="sptxtEditARNFirstNoByMenu' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        // Column 4: Prefix
        var colPrefix = $('<td>' +
            '<input type="text" onchange="HideErrorMessage(this)" id="txtEditPrefixByMenu' + (index + 1) + '" class="form-control MandatoryEditDocByMenu" placeholder="Enter" value="' + doc.Prefix + '">' +
            '<span id="sptxtEditPrefixByMenu' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        // Column 5: Period Ind. (dropdown)
        var colPeriodInd = $('<td>' +
            '<select onchange="HideErrorMessage(this)" id="ddlEditPeriodIndByMenu' + (index + 1) + '" class="form-control applyselect MandatoryEditDocByMenu"></select>' +
            '<span id="spddlEditPeriodIndByMenu' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        // Column 6: Lock (radiobutton)
        var colDefaultLock = $('<td class="text-center">' +
            '<input type="radio"  id="checkEditDefaultlockByMenu' + (index + 1) + '" name="type" class="radio" value="" ' + (doc.DEFAULT_DOC ? 'checked' : '') + '>' +
            '<label for="checkEditDefaultlockByMenu' + (index + 1) + '"></label>' +
            '</td>');

        //// Column 7: Branch (dropdown)
        var colBranch = $('<td>' +
            '<select onchange="HideErrorMessage(this)" id="ddlEditBranchByMenu' + (index + 1) + '" class="form-control applyselect MandatoryEditDocByMenu"></select>' +
            '<span id="spddlEditBranchByMenu' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        // Column 8: Lock (checkbox)
        var colLock = $('<td>' +
            '<input type="checkbox" id="checkEditlockByMenu' + (index + 1) + '" name="type" class="singlecheck" value="" ' + (doc.DOC_LOCK ? 'checked ' : '') + '>' +
            '<label for="checkEditlockByMenu' + (index + 1) + '"></label>' +
            '</td>');

        // Column 9: Active/Inactive (checkbox)
        var colInactiveInactiveLock = $('<td>' +
            '<input type="checkbox" id="checkEditInactiveInactivelockByMenu' + (index + 1) + '" name="type" class="singlecheck" value="" ' +
            (doc.IsDocumentActive ? 'checked ' : '') + (doc.DOC_LOCK ? 'disabled ' : '') + '>' +
            '<label for="checkEditInactiveInactivelockByMenu' + (index + 1) + '"></label>' +
            '</td>');

        // Column 10: Lock (Doctype_Id)
        var colDocTypeId = $('<td style="display:none">' +
            '<input type="hidden"  id="hddDocTypeId' + (index + 1) + '" class="form-control" placeholder="Enter" value="' + doc.DOCID + '">' +
            '</td>');
        docID = doc.DOCID;

        // Column 11: Lock (Doctype_Id)
        var isLocked = doc.DOC_LOCK === true;
        var deleteTooltip = isLocked ? 'Locked – cannot delete' : 'Delete';

        var colDeleteRow = $('<td>' +
            '<a href="#" id="btnDelete' + (index + 1) + '" class="btnDelete' + (isLocked ? ' disabled text-muted' : '') + '"' +
            ' data-toggle="tooltip" title="' + deleteTooltip + '" data-original-title="' + deleteTooltip + '"' +
            (isLocked ? ' tabindex="-1" aria-disabled="true"' : '') + '>' +
            '<img src="../../assets/images/icons/help/svg/delete-icon.svg" alt="Delete" style="' + (isLocked ? 'opacity:0.5;pointer-events:none;' : '') + '">' +
            '</a>' +
            '</td>');

        // Column 12: DOC ID (DOC ID)
        var colDocId = $('<td style="display:none">' +
            '<input type="hidden"  id="hddDocIdMenuBy' + (index + 1) + '" class="form-control" placeholder="Enter" value="' + doc.DocId + '">' +
            '</td>');

        // Column 13: Lock (Doctype_Id)       
        // Append each cell to the row
        row.append(colSerial)
            .append(colName)
            .append(colFirstNo)
            .append(colARNFirstNo)        
            .append(colPrefix)
            .append(colPeriodInd)
            .append(colDefaultLock)
            .append(colBranch)
            .append(colLock)
            .append(colInactiveInactiveLock)
            .append(colDocTypeId)
            .append(colDeleteRow)
            .append(colDocId);

        // Finally, append the row to the table body 
        $("#tbleEditDocNoByMenu tbody").append(row);

        var $ele1 = $('#ddlEditBranchByMenu' + (index + 1) + '');
        $ele1.empty();
        $ele1.append($('<option/>').val('').text('Select'));
        $.each(branchArray, function (ii, vall) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName);
            $ele1.append($option);
        });

        var $ele2 = $('#ddlEditPeriodIndByMenu' + (index + 1) + '');
        $ele2.empty();
        $ele2.append($('<option/>').val('').text('Select'));
        $.each(finYearArray, function (ii, vall) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName);
            $ele2.append($option);
        });

        $('#checkEditlockByMenu' + (index + 1)).val(doc.DOC_LOCK);
        $('#checkEditDefaultlockByMenu' + (index + 1)).val(doc.DEFAULT_DOC);
       
        $('#ddlEditBranchByMenu' + (index + 1)).val(doc.BranchID).trigger('change');
        $('#ddlEditPeriodIndByMenu' + (index + 1)).val(doc.FinId);
        $('#ddlEditBranchByMenu' + (index + 1)).prop('disabled', doc.DOC_LOCK == true ? true : false); // Enables the dropdown
        $('#ddlEditPeriodIndByMenu' + (index + 1)).prop('disabled', doc.DOC_LOCK == true ? true : false); // Enables the dropdown
        $('#txtEditNameByMenu' + (index + 1)).prop('readonly', doc.DOC_LOCK == true ? true : false);
        $('#txtEditFirstNoByMenu' + (index + 1)).prop('readonly', doc.DOC_LOCK == true ? true : false);
        $('#txtEditARNFirstNoByMenu' + (index + 1)).prop('readonly', doc.DOC_LOCK == true ? true : false);
        $('#txtEditPrefixByMenu' + (index + 1)).prop('readonly', doc.DOC_LOCK == true ? true : false);
        $('#checkEditInactiveInactivelockByMenu' + (index + 1)).val(doc.IsDocumentActive);
      
    });

    //AddRowDocNoByMenu(docID);
}

function AddRowDocNoByMenu(docID) {
    var rowCount = $("#tbleEditDocNoByMenu tbody tr").length;
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells
    // Column 1: Serial number and a hidden input for document id
    var colSerial = $('<td>' + (rowCount + 1) + '<input type="hidden" id="hddEditDocument" value="0" /></td>');

    // Column 2: Name input
    var colName = $('<td>' +
        '<input type="text" onchange="HideErrorMessage(this)" id="txtEditNameByMenu' + (rowCount + 1) + '" class="form-control MandatoryEditDocByMenu" placeholder="Enter" value="">' +
        '<span id="sptxtEditNameByMenu" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');

    // Column 3: First No.
    var colFirstNo = $('<td>' +
        '<input type="text" onchange="HideErrorMessage(this); EditMaxNextNumber();" id="txtEditFirstNoByMenu' + (rowCount + 1) + '" class="form-control text-right MandatoryEditDocByMenu" placeholder="0" value="">' +
        '<span id="sptxtEditFirstNoByMenu" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');

    // Column 3: First No.
    var colARNFirstNo = $('<td>' +
        '<input type="text" onchange="HideErrorMessage(this); EditMaxNextNumber();" id="txtEditARNFirstNoByMenu' + (rowCount + 1) + '" class="form-control text-right MandatoryEditDocByMenu" placeholder="0" value="">' +
        '<span id="sptxtARNEditFirstNoByMenu" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');

    // Column 4: Prefix
    var colPrefix = $('<td>' +
        '<input type="text" onchange="HideErrorMessage(this)" id="txtEditPrefixByMenu' + (rowCount + 1) + '" class="form-control MandatoryEditDocByMenu" placeholder="Enter" value="">' +
        '<span id="sptxtEditPrefixByMenu" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');

    // Column 5: Period Ind. (dropdown)
    var colPeriodInd = $('<td>' +
        '<select onchange="HideErrorMessage(this)" id="ddlEditPeriodIndByMenu' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDocByMenu"></select>' +
        '<span id="spddlEditPeriodIndByMenu' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');

    // Column 6: Lock (radiobutton)
    var colDefaultLock = $('<td class="text-center">' +
        '<input type="radio" id="checkEditDefaultlockByMenu' + (rowCount + 1) + '" name="type" class="radio" value="">' +
        '<label for="checkEditDefaultlockByMenu' + (rowCount + 1) + '"></label>' +
        '</td>');

    //// Column 7: Branch (dropdown)
    var colBranch = $('<td>' +
        '<select onchange="HideErrorMessage(this)" id="ddlEditBranchByMenu' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDocByMenu"></select>' +
        '<span id="spddlEditBranchByMenu' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');

    // Column 8: Lock (checkbox)
    var colLock = $('<td>' +
        '<input type="checkbox" id="checkEditlockByMenu' + (rowCount + 1) + '" name="type" class="singlecheck" value="" disabled>' +
        '<label for="checkEditlockByMenu' + (rowCount + 1) + '"></label>' +
        '</td>');

    // Column 9: Active/Inactive (checkbox)
    var colInactiveInactiveLock = $('<td>' +
        '<input type="checkbox" id="checkEditInactiveInactivelock' + (rowCount + 1) + '" name="type" class="singlecheck" value="">' +
        '<label for="checkEditInactiveInactivelock' + (rowCount + 1) + '"></label>' +
        '</td>');

    // Column 10:
    var colDocTypeId = $('<td style="display:none">' +
        '<input type="hidden"  id="hddDocTypeId' + (rowCount + 1) + '" class="form-control" placeholder="Enter" value="' + docID + '">' +
        '</td>');

    // Column 11
    var colDeleteRow = $('<td>' +
        '<a href="#" class="btnDelete" id="btnDelete"  data-toggle="tooltip" title=""    data-original-title="Delete">' +
        '<img onclick="DeleteTableRow(' + (rowCount + 1) + ')" src = "../../assets/images/icons/help/svg/delete-icon.svg" alt = "Delete" ></img></a>' +
        '</td>');

    // Column 12: DOC ID (DOC ID)
    var colDocId = $('<td style="display:none">' +
        '<input type="hidden"  id="hddDocIdMenuBy' + (rowCount + 1) + '" class="form-control" placeholder="Enter" value="' + 0 + '">' +
        '</td>');

    // Append each cell to the row
    row.append(colSerial)
        .append(colName)
        .append(colFirstNo)
        .append(colARNFirstNo)    
        .append(colPrefix)
        .append(colPeriodInd)
        .append(colDefaultLock)
        .append(colBranch)
        .append(colLock)
        .append(colInactiveInactiveLock)
        .append(colDocTypeId)
        .append(colDeleteRow)
        .append(colDocId);

    $("#tbleEditDocNoByMenu tbody").append(row);

    var $ele1 = $('#ddlEditBranchByMenu' + (rowCount + 1) + '');
    $ele1.empty();
    $ele1.append($('<option/>').val('').text('Select'));
    $.each(branchArray, function (ii, vall) {
        var $option = $('<option />')
            .val(vall.ID)
            .text(vall.ValueName);
        $ele1.append($option);
    });
    var $ele2 = $('#ddlEditPeriodIndByMenu' + (rowCount + 1) + '');
    $ele2.empty();
    $ele2.append($('<option/>').val('').text('Select'));
    $.each(finYearArray, function (ii, vall) {
        var $option = $('<option />')
            .val(vall.ID)
            .text(vall.ValueName);
        $ele2.append($option);
    });
}

function SetDocNoByMenu() {
    var tableId = parseInt($("#hddMenuId").val());
    if (tableId > 0) {
        var valid = true;
        if (checkValidationOnSubmit('MandatoryEditDocByMenu') == false) {
            valid = false;
        }

        if (valid == true) {
            collectDocNoByMenuTableData();


            var docNoByMenuList = collectDocNoByMenuTableData();

            // Check if there is at least one row
            if (!docNoByMenuList || docNoByMenuList.length === 0) {
                alert("Please add at least one row before saving.");
                return false;
            }

            var model = {
                TableId: tableId > 0 ? tableId : 0,
                DocumentNumber: docNoByMenuList
            };

            const jsonString = JSON.stringify(model);
            let GenericModeldata =
            {
                ScreenID: "MenuDocNo_102",
                Operation: tableId > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
                ModelData: jsonString
            };
            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                BindMenuDocNo();
                $("#editDocNoByMenu").modal('hide');
            });
        }
    }

}

function collectDocNoByMenuTableData() {
    // Create an empty array to store row data
    tableDocData = [];
    // Select all rows in the table body (excluding any header row)
    // Assuming your <tbody> has the id="table-body"
    $('#tbleEditDocNoByMenu tbody tr').each(function (index) {
        // 'this' refers to the current <tr>
        let dateRange = $('#ddlEditPeriodIndByMenu' + (index + 1) + ' option:selected').text();// "Apr 1 2024 - Mar 31 2025";
        let shortYear = "";
        // Extract years using regex
        let yearsPeriod = dateRange.match(/\d{4}/g); // ["2024", "2025"]

        if (yearsPeriod.length === 2) {
            shortYear = yearsPeriod.map(year => year.slice(2)).join(""); // "2425"            
        }
        // Collect the values from the cells/inputs within this row
        var doc_CAPTION = $(this).find('#txtEditNameByMenu' + (index + 1) + '').val();       // Series Name
        var firstNo = $(this).find('#txtEditFirstNoByMenu' + (index + 1) + '').val();    // First No.
        var arnfirstNo = $(this).find('#txtEditARNFirstNoByMenu' + (index + 1) + '').val();    // First No.
        var prefix = $(this).find('#txtEditPrefixByMenu' + (index + 1) + '').val();     // Prefix
        var periodInd = $(this).find('#ddlEditPeriodIndByMenu' + (index + 1) + '').val();  // Period Ind. (dropdown)
        var branch = $(this).find('#ddlEditBranchByMenu' + (index + 1) + '').val();     // Branch (dropdown)
        //var saPosting = $(this).find('#ddlSAPosting' + (index + 1) + '').val();     // Branch (dropdown)
        //var saIncrease = $(this).find('#ddlSAIncrease' + (index + 1) + '').val();     // Branch (dropdown)
        //var saDecrease = $(this).find('#ddlSADecrease' + (index + 1) + '').val();     // Branch (dropdown)
        //var saPostingName = $(this).find('#ddlSAPosting' + (index + 1) + ' option:selected').text();     // Branch (dropdown)
        //var saIncreaseName = $(this).find('#ddlSAIncrease' + (index + 1) + ' option:selected').text();     // Branch (dropdown)
        //var saDecreaseName = $(this).find('#ddlSADecrease' + (index + 1) + ' option:selected').text();     // Branch (dropdown)
        var isLocked = $(this).find('#checkEditlockByMenu' + (index + 1) + '').is(':checked'); // Lock (checkbox)
        var isDefault = $(this).find('#checkEditDefaultlockByMenu' + (index + 1) + '').is(':checked'); // Default Series (checkbox)
        var isActive = $(this).find('#checkEditInactiveInactivelockByMenu' + (index + 1) + '').is(':checked');  // Active/Inactive (checkbox)
        var docTypeId = $(this).find('#hddDocTypeId' + (index + 1) + '').val();
        var docId = $('#hddDocIdMenuBy' + (index + 1) + '').val();

        // Build an object representing a single row
        var rowData = {
            Id: docId,
            MenuType: $('#hddModuleName').val(),
            DOC_CAPTION: doc_CAPTION,
            START_NO: firstNo,
            ARNFirstNo: arnfirstNo,
            PREFIX: prefix,
            DEFAULT_DOC: isDefault,
            BranchID: branch,
            DOC_LOCK: isLocked,
            IsDocumentActive: isActive,
            FinID: periodInd,
            DESCRIPTION: '',
            SERIES_TYPE: 'Manual',
            SERIES_NO: shortYear,


            //DOCID: docId

            //GROUP_ID: $('#hddModuleId').val(),
            //REF_ID: 0,
            //MenuID: $('#hddMenuId').val(),

            //SAPosting: saPosting,
            //SAIncrease: saIncrease,
            //SADecrease: saDecrease,
            //SAPostingName: saPostingName == 'Select' ? '' : saPostingName,
            //SAIncreaseName: saIncreaseName == 'Select' ? '' : saIncreaseName,
            //SADecreaseName: saDecreaseName == 'Select' ? '' : saDecreaseName,
        };

        // Push it into the array
        tableDocData.push(rowData);
    });

    // Now tableData is an array of objects containing all rows' data
    return tableDocData;
}

/*Item Category Doc No End */

