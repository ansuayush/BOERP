$(document).ready(function () {

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 69,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlItemCategory', obj1, 'Select', false);

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 8,
        manualTableId: 0,
        ScreenId: 'ERP_FMS_101'
    }
    LoadMasterDropdown('ddlBOMTestName_0', obj2, 'Select', false);


    var bomId = parseInt($("#hdnBOMId").val());
    if (bomId > 0) {
        GetBOMDetById(bomId);
    }
    else {
        GetBOMDocNo();
    }
    //else {
    //    // BindDropdown('ddlCategory', '');
    //}

    LoadItemDropdown();


    //localStorage.removeItem('viewBOM');
    // fetchAPI();
});



function GetBOMDetById(id) {

    var model =
    {
        Id: id,
        Type: 11
    };

    IsView = localStorage.getItem('viewBOM');

    // localStorage.removeItem('viewBOM');


    if (IsView == 'true') {
        $('#bomSubmit').hide();
        $('#btnSave').hide();

        $('#txtSampleID').prop('disabled', true);
        $('#txtMIItemName').prop('disabled', true);
        $('#txtQuantity').prop('disabled', true);

    }

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        var data = response.data.data.Table[0];

        $("#ddlBOMCategory").val(data.Category).trigger('change');

        $('#ddlBOMCategory').prop('disabled', true);
        $("#txtBOMNumber").val(data.BOMNumber);
        $("#txtSampleID").val(data.SampleId == null ? '' : data.SampleId);
        $("#txtPackSize").val(data.PackSize);
        $("#txtQuantity").val(data.Quantity);
        $("#txtWastage").val(data.WastagePercent);
        $("#txtFormulatedBy").val(data.FormulatedBy);
        $("#txtFMCode").val(data.FMCode == null ? '' : data.FMCode);
        $("#ddlBOMCustomerCompany").val(data.CustomerCompany == null ? 'Select' : data.CustomerCompany).trigger('change');
        //$("#txtBrandName").val();
        //$("#ddlBOMCustomerContactPerson").val();
        $('#txtMIItemName').val(data.ItemCode);
        $('#lblItemName').html(data.ITEM_NAME);
        $('#ddlItem').val(data.ITEM_ID);
        $("#txtRemarks").val(data.Remarks);




        var index = 0;
        for (item of response.data.data.Table1) {

            if (index == 0) {
                $('#ddlItem_0').val(item.Ingredient_ID)
                $('#ddlI_0').val(item.Ingredient_Name)
                $('#quantity_0').val(item.Quantity).trigger('change');
                $('#sale_0').val(item.Selling_Price).trigger('change');
                $('#purch_0').val(item.IsPurchAvl);
                if (item.IsPurchAvl == 1) {

                    const $input = $('#purchrate_0');

                    // Change type to text
                    $input.attr('type', 'text');

                    // Remove oninput attribute (only keep HideErrorMessage)
                    $input.attr('oninput', 'HideErrorMessage(this)');

                    // Set value and disable field
                    $input.val('Purchase Rate Available').prop('disabled', true);

                    // Store actual purchase rate in hidden field
                    $('#purchrate1_0').val(item.Purchase_Price);
                }
                else {
                    const $input = $('#purchrate_0');

                    // Change type to text
                    $input.attr('type', 'text');

                    $input.value = item.Purchase_Price

                    // Remove oninput attribute (only keep HideErrorMessage)
                    $input.attr('oninput', 'HideErrorMessage(this); SetZero(this)');

                    // Set value and disable field
                    $input.prop('disabled', false);

                    // Store actual purchase rate in hidden field
                    $('#purchrate_0').val(item.Purchase_Price);
                    $('#purchrate1_0').val(item.Purchase_Price);

                }

                $('#total_0').html(($('#quantity_0').val() * $('#sale_0').val()).toFixed(2));

                CalculateTotal();

                if (IsView == 'true') {
                    $('#ddlItem_0').prop('disabled', true);
                    $('#ddlI_0').prop('disabled', true);
                    $('#quantity_0').prop('disabled', true);
                    $('#sale_0').prop('disabled', true);
                    $('#purchrate_0').prop('disabled', true);
                    // Hide only the first <td> in each row
                    $("#ingredientTable1 tr td:first-child div").hide();
                    //  $("#ingTbleHead tr th:first-child div").hide();
                }
            }
            else {
                var rowIndex = addRow1();


                $('#ddlItem_' + rowIndex).val(item.Ingredient_ID)
                $('#ddlI_' + rowIndex).val(item.Ingredient_Name)
                $('#quantity_' + rowIndex).val(item.Quantity).trigger('change');
                $('#sale_' + rowIndex).val(item.Selling_Price).trigger('change');

                $('#total_' + rowIndex).html(($('#quantity_' + rowIndex).val() * $('#sale_' + rowIndex).val()).toFixed(2));

                $('#purch_' + rowIndex).val(item.IsPurchAvl);
                if (item.IsPurchAvl == 1) {

                    const $input = $('#purchrate_' + rowIndex);

                    // Change type to text
                    $input.attr('type', 'text');

                    // Remove oninput attribute (only keep HideErrorMessage)
                    $input.attr('oninput', 'HideErrorMessage(this)');

                    // Set value and disable field
                    $input.val('Purchase Rate Available').prop('disabled', true);

                    // Store actual purchase rate in hidden field
                    $('#purchrate1_' + rowIndex).val(item.Purchase_Price);
                }
                else {
                    const $input = $('#purchrate_' + rowIndex);

                    // Change type to text
                    $input.attr('type', 'text');

                    //$input.value = item.Purchase_Price
                    $input.val(item.Purchase_Price);

                    // Remove oninput attribute (only keep HideErrorMessage)
                    $input.attr('oninput', 'HideErrorMessage(this); SetZero(this)');

                    // Set value and disable field
                    //$input.val('').prop('disabled', false);
                    $input.prop('disabled', false);

                    // Store actual purchase rate in hidden field
                    $('#purchrate1_' + rowIndex).val(item.Purchase_Price);

                }


                if (IsView == 'true') {
                    $('#ddlItem_' + rowIndex).prop('disabled', true);
                    $('#ddlI_' + rowIndex).prop('disabled', true);
                    $('#quantity_' + rowIndex).prop('disabled', true);
                    $('#sale_' + rowIndex).prop('disabled', true);
                    $('#purchrate_' + rowIndex).prop('disabled', true);
                    // Hide only the first <td> in each row
                    $("#ingredientTable1 tr td:first-child div").hide();
                    //  $("#ingTbleHead tr th:first-child").hide();


                }

                CalculateTotal();
            }
            index++;

        }


        // EditQCValues(response.data.data.Table2);

        index = 0;
        for (item of response.data.data.Table2) {

            if (index == 0) {
                $('#txtManufacturingProcess_0').val(item.ProcessDescription);
                $('#txtManufacturingRPM_0').val(item.RPM);
                $('#txtManufacturingTemp_0').val(item.Temperature);


                if (IsView == 'true') {
                    $('#txtManufacturingProcess_0').prop('disabled', true);
                    $('#txtManufacturingRPM_0').prop('disabled', true);
                    $('#txtManufacturingTemp_0').prop('disabled', true);

                    $("#tblManufacturingProcess tbody tr td:first-child div").hide();
                }

            }
            else {
                var rowIndex = ManufacturingProcessAddRow();


                $('#txtManufacturingProcess_' + rowIndex).val(item.ProcessDescription);
                $('#txtManufacturingRPM_' + rowIndex).val(item.RPM);
                $('#txtManufacturingTemp_' + rowIndex).val(item.Temperature);

                $('#txtManufacturingProcess_' + rowIndex).prop('diabled', true);
                $('#txtManufacturingRPM_' + rowIndex).prop('diabled', true);
                $('#txtManufacturingTemp_' + rowIndex).prop('diabled', true);

                if (IsView == 'true') {
                    $('#txtManufacturingProcess_' + rowIndex).prop('disabled', true);
                    $('#txtManufacturingRPM_' + rowIndex).prop('disabled', true);
                    $('#txtManufacturingTemp_' + rowIndex).prop('disabled', true);

                    $("#tblManufacturingProcess tbody tr td:first-child div").hide();
                }


            }
            index++;

        }


        index = 0;
        for (item of response.data.data.Table3) {

            if (index == 0) {

                $('#txtUOM_0').val(item.UoM);
                $('#txtResultType_0').val(item.ResultType);
                $('#txtMeasuringUnit_0').val(item.MeasuringUnit);


                var obj6 = {
                    parentId: 0,
                    masterTableTypeId: 0,
                    isMasterTableType: false,
                    isManualTable: true,
                    manualTable: 8,
                    manualTableId: 0,
                    ScreenId: 'ERP_FMS_101'
                }
                LoadMasterDropdown(`ddlBOMTestName_0`, obj6, 'Select', false, item.TestName);


                if (IsView == 'true') {
                    $('#ddlBOMTestName_0').prop('disabled', true);
                    $('#txtUOM_0').prop('disabled', true);
                    $('#txtResultType_0').prop('disabled', true);
                    $('#txtMeasuringUnit_0').prop('disabled', true);

                    $("#tblQualityParameters tbody tr td:first-child div").hide();
                }

            }
            else {
                var rowIndex = QualityParametersAddRowEdit(item.TestName);


                $('#txtUOM_' + rowIndex).val(item.UoM);
                $('#txtResultType_' + rowIndex).val(item.ResultType);
                $('#txtMeasuringUnit_' + rowIndex).val(item.MeasuringUnit);

                if (IsView == 'true') {
                    $('#ddlBOMTestName_' + rowIndex).prop('disabled', true);
                    $('#txtUOM_' + rowIndex).prop('disabled', true);
                    $('#txtResultType_' + rowIndex).prop('disabled', true);
                    $('#txtMeasuringUnit_' + rowIndex).prop('disabled', true);

                    $("#tblQualityParameters tbody tr td:first-child div").hide();
                }


            }
            index++;

        }






        console.log(response.data.data.Table4);

        for (var i = 0; i < response.data.data.Table4.length; i++) {
            var fileName = response.data.data.Table4[i].ActualFileName;
            var fileType = response.data.data.Table4[i].FileType;
            var type = response.data.data.Table4[i].Type;
            var fileUrl = response.data.data.Table4[i].FileUrl;
            var fFd = response.data.data.Table4[i].AttachmentID;
            var fSize = response.data.data.Table4[i].FileSize;
            var newfileName = response.data.data.Table4[i].NewFileName;

            if (IsView == 'true') {
                LoadFileDataDownload(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);

            }

            else {
                LoadFileData(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
            }
        }




    });
}


function GetQCParam(ctrl) {

    var id = ctrl.value;

    let rowId = ctrl.id.split('_')[1];



    //if (ctrl.value == 'Select') {

    //    $('#txtResultType_' + rowId).val('').trigger('change');
    //    $('#txtMeasuringUnit_' + rowId).val('').trigger('change');

    //    return;
    //}

    var model =
    {
        Id: id,
        Type: 14
    };



    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        const data = response.data.data.Table[0];

        $('#txtResultType_' + rowId).val(data.MeasuringUnit).trigger('change');
        $('#txtMeasuringUnit_' + rowId).val(data.ResultType).trigger('change');

        //   console.log(data);


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
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                     
                       <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
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
function hasDuplicateItemIds(data) {
    const itemIds = new Set();
    for (const row of data) {
        if (itemIds.has(row.Ingredient_ID)) {
            itemIds.add(row.Ingredient_ID);
            console.log(itemIds);
            return 1; // duplicate found
        }
        else if (!parseInt(row.Ingredient_ID)) {
            return 2;
        }
        itemIds.add(row.Ingredient_ID);
    }
    return 0;
}







var fileModelList = [];
async function SaveBOMData() {

    var ingred = [];
    var qc = [];
    var process = [];

    if (checkValidationOnSubmit('Mandatory') == true) {

        //if ($('#ddlBOMCategory').val() != 'sfg') {
        //    FailToaster('Development Under Process!!!!');
        //    return;
        //}

        let checkQ = true;
        let checkIng = true;
        let checkP = true;

        if ($('#ddlBOMCategory').val() == 'sfg') {
            checkQ = checkValidationOnSubmit('MandateQ');
            checkIng = checkValidationOnSubmit('MandateIng');
            checkP = checkValidationOnSubmit('MandateP');
        }
        else if ($('#ddlBOMCategory').val() == 'oil') {
            checkQ = checkValidationOnSubmit('MandateQ');
            checkIng = checkValidationOnSubmit('MandateIng');
        }




        if (checkQ == true && checkIng == true && checkP == true) {


            //var bomJson = buildBOMJson();
            // debugger
            //  const jsonString = BuildBOMJson();


            let isGarbage = 0;

            $('.ing').each((index, ele) => {

                var rowId = ele.id.split('_')[1];



                if ($('#ddlItem_' + rowId).val() <= 0 || !ItemCodeList.find(input => input.ITEM_NAME == $('#ddlI_' + rowId).val())) {
                    FailToaster('Please select a valid item!!!');
                    isGarbage = 1;
                    return;
                }

                var obj = {
                    Ingredient_ID: $('#ddlItem_' + rowId).val(),
                    Ingredient_Name: $('#ddlI_' + rowId).val(),
                    Quantity: $('#quantity_' + rowId).val(),
                    Purchase_Price: $('#purch_' + rowId).val() == 1 ? $('#purchrate1_' + rowId).val() : $('#purchrate_' + rowId).val(),
                    Selling_Price: $('#sale_' + rowId).val(),
                    Material_PR: $('#mpr_' + rowId).val(),
                    Cost_Per_Kg: (($('#sale_' + rowId).val() * $('#quantity_' + rowId).val()) / $('#quantity_' + rowId).val()) * 1000,
                    IsPurchAvl: $('#purch_' + rowId).val()
                }

                ingred.push(obj);
            });



            if (isGarbage == 1) {
                return;
            }

            const itemCode = ItemCodeList.find(input => input.ITEM_ID == $('#ddlItem').val())

            if ($('#ddlItem').val() == '') {
                FailToaster('Please select valid Item Code!!!');
                return;
            }

            var FormulaInformation = {
                Category: $("#ddlBOMCategory").val(),
                BOMNumber: $("#txtBOMNumber").val(),
                SampleID: $("#txtSampleID").val(),
                ItemCode: itemCode.ITEM_CODE,
                PackSize: $("#txtPackSize").val(),
                Quantity: $("#txtQuantity").val(),
                WastagePercent: $("#txtWastage").val(),
                FormulatedBy: $("#txtFormulatedBy").val(),
                FMCode: $("#txtFMCode").val(),
                CustomerCompany: $("#ddlBOMCustomerCompany").val(),
                BrandName: $("#txtBrandName").val(),
                ContactPerson: $("#ddlBOMCustomerContactPerson").val(),
                Remarks: $("#txtRemarks").val(),
                EditMode: $("#hdnBOMId").val() > 0 ? 1 : 0,
                ExistingBOMId: $("#hdnBOMId").val()

            };


            var obj =
            {
                FolderNames: "BOMDocuments/"
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

            if (fileData.length > 10) {
                FailToaster("You cannot add more than 10 files");
                return;
            }

            if (hasDuplicateItemIds(ingred) == 1) {
                FailToaster('Duplicate Ingredients found!!');
                return;
            }
            else if (hasDuplicateItemIds(ingred) == 2) {
                FailToaster('Ingredient Name Not found!!');
                return;
            }

            if (parseFloat($('#total_cost').html()) <= 0) {
                FailToaster('Total Cost of Ingredients cannot be equal to 0!!');
                return;
            }

            $("#tblManufacturingProcess tbody tr").each(function (index) {
                let rowNo = index == 0 ? 0 : index + 1;// + 1;

                let row = {
                    Phase: rowNo,
                    ProcessDescription: $(`#txtManufacturingProcess_${rowNo}`).val(),
                    RPM: $(`#txtManufacturingRPM_${rowNo}`).val(),
                    Temperature: $(`#txtManufacturingTemp_${rowNo}`).val()
                };

                if (row.ProcessDescription) {
                    process.push(row);
                }
            });

            $("#tblQualityParameters tbody tr").each(function (index) {
                let rowNo = index == 0 ? 0 : index + 1;// + 1;

                let row = {
                    TestName: $(`#ddlBOMTestName_${rowNo}`).val(),
                    UoM: $(`#txtUOM_${rowNo}`).val(),
                    ResultType: $(`#txtResultType_${rowNo}`).val(),
                    MeasuringUnit: $(`#txtMeasuringUnit_${rowNo}`).val()
                };

                if (row.TestName) {
                    qc.push(row);
                }
            });


            var model = {
                BOMId: 0,

                FormulaInformation: FormulaInformation,
                Ingredients: ingred,
                QualityParameters: qc,
                ManufacturingProcess: process,
                Attatchements: fileData
            }

            var jsonString = JSON.stringify(model);


            let GenericModeldata = {
                ScreenID: "BOMDetails",
                Operation: "A",  // Use Update for existing records, Add for new ones
                ModelData: jsonString
            };
            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                if (response.ValidationInput == 1) {

                    window.location.href = 'BOMList?auth=' + AuthToken;

                }


            });
        }


    }
}



$('#btnCancel').click(function () {

    window.location.href = 'BOMList?auth=' + AuthToken;
})

function GetBOMDocNo() {

    var model =
    {
        Id: 1,
        Type: 10
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        let data = response.data.data.Table[0];


        $('#txtFormulatedBy').val(data.fullName);
        $('#txtBOMNumber').val(data.BOM_Doc_No);


    });

}


var ItemCodeList = [];

function LoadItemDropdown() {
    var model =
    {
        ColumnName: 'Name',
        SearchData: 'Filter by BOM ItemCat'
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_104' }, 'GET', function (response) {

        ItemCodeList = response.data.data.Table;
        ItemCodeList = ItemCodeList.filter(
            (obj, index, self) =>
                index === self.findIndex(o =>
                    o.ITEM_NAME === obj.ITEM_NAME && o.ITEM_CODE === obj.ITEM_CODE
                )
        );
        //var $ele = $('#ddlItem_0');
        //$ele.empty();
        //$ele.append($('<option/>').val('Select').text('Select'));
        //$.each(ItemCodeList, function (ii, vall)
        //{
        //    var displayText = vall.ITEM_NAME + " (" + vall.ITEM_CODE + ")"; // Format: ITEM_NAME (ITEM_CODE)
        //    $ele.append($('<option />').val(vall.ITEM_ID).text(displayText));
        //})
    });
}


function GetdataMaster(inputElement) {
    let rowId = inputElement.id.split('_')[1]; // Extract RowId from input ID
    let suggestionBox = document.getElementById(`globalSuggestionBox`);

    let search = inputElement.value.toLowerCase();
    suggestionBox.innerHTML = "";

    //if (search.length < 2) {
    //    suggestionBox.style.display = "none";
    //    return;
    //}

    //let matchedItems = ItemCodeList.filter(item =>
    //    item.ITEM_DISPLAY.toLowerCase().includes(search) || item.ITEM_DISPLAY.toLowerCase().includes(search)
    //).slice(0, 50);

    let matchedItems = ItemCodeList.filter(item => {
        let itemDisplay = item.ITEM_DISPLAY?.toLowerCase() || '';
        let itemCategory = item.Category?.toLowerCase() || '';

        return itemDisplay.includes(search) &&
            (selectedCategory === '' ||
                itemCategory === selectedCategory ||
                (selectedCategory === 'sfg' && itemCategory === 'semi finished goods'));
    }).slice(0, 50);


    if (matchedItems.length === 0) {
        suggestionBox.innerHTML = `<li class="errordata">No data found</li>`;
    } else {
        matchedItems.forEach(item => {
            let li = document.createElement("li");
            li.textContent = `${item.ITEM_DISPLAY}`;
            li.dataset.id = item.ITEM_ID;
            li.dataset.name = item.ITEM_NAME;
            li.dataset.code = item.ITEM_CODE;

            li.addEventListener("click", function () {
                inputElement.value = item.ITEM_CODE; // Set selected value in input
                suggestionBox.style.display = "none";

                $(`#ddlItem`).val(item.ITEM_ID);
                $(`#lblItemName`).text(item.ITEM_NAME);
                $(`#lblItemDesc`).text(item.DESCRIPTION);
                $(`#lblUnit`).text(item.UNIT);
                // GetItemDetails(item.ITEM_ID, rowId);

            });

            suggestionBox.appendChild(li);
        });
    }

    // Positioning
    let rect = inputElement.getBoundingClientRect();
    suggestionBox.style.top = rect.bottom + "px";
    suggestionBox.style.left = rect.left + "px";
    suggestionBox.style.width = rect.width + "px";
    suggestionBox.style.display = "block";


}


function Getdata(inputElement) {
    let rowId = inputElement.id.split('_')[1]; // Extract RowId from input ID
    let suggestionBox = document.getElementById(`globalSuggestionBox_${rowId}`);

    let search = inputElement.value.toLowerCase();
    suggestionBox.innerHTML = "";

    //if (search.length < 2) {
    //    suggestionBox.style.display = "none";
    //    return;
    //}

    let matchedItems = ItemCodeList.filter(item =>
        item.ITEM_DISPLAY.toLowerCase().includes(search) || item.ITEM_DISPLAY.toLowerCase().includes(search)
    ).slice(0, 50);

    if (matchedItems.length === 0) {
        suggestionBox.innerHTML = `<li class="errordata">No data found</li>`;
    } else {
        matchedItems.forEach(item => {
            let li = document.createElement("li");
            li.textContent = `${item.ITEM_DISPLAY}`;
            li.dataset.id = item.ITEM_ID;
            li.dataset.name = item.ITEM_NAME;
            li.dataset.code = item.ITEM_CODE;

            li.addEventListener("click", function () {
                inputElement.value = item.ITEM_NAME; // Set selected value in input
                suggestionBox.style.display = "none";

                $(`#ddlItem_` + rowId).val(item.ITEM_ID);
                $(`#lblItemName_` + rowId).text(item.ITEM_NAME);
                $(`#lblItemDesc_` + rowId).text(item.DESCRIPTION);
                $(`#lblUnit_` + rowId).text(item.UNIT);
                GetItemDetails(item.ITEM_ID, rowId);

            });

            suggestionBox.appendChild(li);


        });
    }

    // Positioning
    let rect = inputElement.getBoundingClientRect();
    suggestionBox.style.top = rect.bottom + "px";
    suggestionBox.style.left = rect.left + "px";
    suggestionBox.style.width = rect.width + "px";
    suggestionBox.style.display = "block";


}
function BuildBOMJson() {
    // Main BOM info
    let bomData = {
        BOMId: 0,


        FormulaInformation: {
            Category: $("#ddlBOMCategory").val(),
            BOMNumber: $("#txtBOMNumber").val(),
            SampleID: $("#txtSampleID").val(),
            ItemCode: $("#ddlBOMItemCode").val(),
            PackSize: $("#txtPackSize").val(),
            Quantity: $("#txtQuantity").val(),
            WastagePercent: $("#txtWastage").val(),
            FormulatedBy: $("#txtFormulatedBy").val(),
            FMCode: $("#txtFMCode").val(),
            CustomerCompany: $("#ddlBOMCustomerCompany").val(),
            BrandName: $("#txtBrandName").val(),
            ContactPerson: $("#ddlBOMCustomerContactPerson").val(),
            Remarks: $("#txtRemarks").val(),
        },
        // Sub-sections
        MaterialInformation: [],
        PrintedPM: [],
        OtherCharges: [],
        QualityParameters: [],
        Ingredients: [],
        ManufacturingProcess: []


    };

    // Material Info

    $("#tblMaterialInfo tbody tr").each(function (index) {
        let rowNo = index;// + 1;
        let row = {
            ItemName: $(`#txtMIItemName_${rowNo}`).val(),
            Qty: $(`#txtMIQty_${rowNo}`).val(),
            UoM: $(`#txtMIUoM_${rowNo}`).val(),
            SellingPrice: $(`#txtMISellingPrice_${rowNo}`).val(),
            TotalCost: $(`#txtMITotalCost_${rowNo}`).val(),
            FromClient: $(`#rdoFromClient_${rowNo}`).is(":checked")
        };

        if (row.ItemName) {
            bomData.MaterialInformation.push(row);
        }
    });
    // Printed Packing Material Info
    $("#tblPrintedPM tbody tr").each(function (index) {
        let rowNo = index;// + 1;

        let row = {
            ItemName: $(`#txtPPMIItemName_${rowNo}`).val(),
            Qty: $(`#txtPPMIQty_${rowNo}`).val(),
            UoM: $(`#txtPPMIUoM_${rowNo}`).val(),
            SellingPrice: $(`#txtPPMISellingPrice_${rowNo}`).val(),
            TotalCost: $(`#txtPPMITotalCost_${rowNo}`).val(),
            FromClient: $(`#radPPMIFromclient_${rowNo}`).is(":checked"),
            CreateNew: $(`#radCreateNew_${rowNo}`).is(":checked")
        };

        if (row.ItemName) {
            bomData.PrintedPM.push(row);
        }
    });

    // Other Charges
    $("#tblOtherCharges tbody tr").each(function () {
        let row = {
            Classification: $(this).find("td:eq(2)").text().trim(),
            Amount: $(this).find("td:eq(3) input").val(),
            Comment: $(this).find("td:eq(4) input").val()
        };
        if (row.Amount || row.Comment) bomData.OtherCharges.push(row);
    });

    // Quality Parameters
    $("#tblQualityParameters tbody tr").each(function (index) {
        let rowNo = index;// + 1;

        let row = {
            TestName: $(`#ddlBOMTestName_${rowNo}`).val(),
            UoM: $(`#txtUOM_${rowNo}`).val(),
            ResultType: $(`#txtResultType_${rowNo}`).val(),
            MeasuringUnit: $(`#txtMeasuringUnit_${rowNo}`).val()
        };

        if (row.TestName) {
            bomData.QualityParameters.push(row);
        }
    });

    // Ingredients
    $("#tblIngredients tbody tr").each(function (index) {
        let rowNo = index;// + 1;

        let row = {
            IngredientName: $(`#ddlBOMIngredientName_${rowNo}`).val(),
            Quantity: $(`#txtQuantityGM_${rowNo}`).val(),
            PurchasePrice: $(`#txtPurchasePrice_${rowNo}`).val(),
            ProportionateRatio: $(`#txtMPR_${rowNo}`).val(),
            TotalSellingCost: $(`#txtTotalSellingCost_${rowNo}`).val()
        };

        // only push if ingredient is selected
        if (row.Ingredient && row.Ingredient !== "0") {
            bomData.Ingredients.push(row);
        }
    });

    // Manufacturing Process
    $("#tblManufacturingProcess tbody tr").each(function (index) {
        let rowNo = index;// + 1;

        let row = {
            Phase: rowNo,
            ProcessDescription: $(`#txtManufacturingProcess_${rowNo}`).val(),
            RPM: $(`#txtManufacturingRPM_${rowNo}`).val(),
            Temperature: $(`#txtManufacturingTemp_${rowNo}`).val()
        };

        if (row.Process) {
            bomData.ManufacturingProcess.push(row);
        }
    });



    return JSON.stringify(bomData);
}


function GetItemDetails(ITEM_ID, rowId) {

    var model =
    {
        Id: 1,
        ITEM_ID: ITEM_ID,
        Type: 5
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        var data = response.data.data.Table[0];

        $('#sale_' + rowId).val(data.SALE_RATE).trigger('change');
        $('#purch_' + rowId).val(data.IsPurchQtyAvl);
        if (data.IsPurchQtyAvl == 1) {
            const $input = $('#purchrate_' + rowId);

            // Change type to text
            $input.attr('type', 'text');

            // Remove oninput attribute (only keep HideErrorMessage)
            $input.attr('oninput', 'HideErrorMessage(this)');

            // Set value and disable field
            $input.val('Purchase Rate Available').prop('disabled', true);

            // Store actual purchase rate in hidden field
            $('#purchrate1_' + rowId).val(data.PURCH_RATE);
        }
        else {


            const $input = $('#purchrate_' + rowId);

            // Change type to text
            $input.attr('type', 'number');

            // Remove oninput attribute (only keep HideErrorMessage)
            $input.attr('oninput', 'HideErrorMessage(this); SetZero(this)');

            // Set value and disable field
            $input.val('').prop('disabled', false);

            $('#purchrate1_' + rowId).val(data.PURCH_RATE);
        }

    });

}


function CalculateRate(ctrl) {

    var rowId = ctrl.id.split("_")[1];

    var ans = SetZero(ctrl);

    if (ans == -1) {
        return;
    }

    $('#total_' + rowId).html((($('#quantity_' + rowId).val() / 1000) * $('#sale_' + rowId).val()).toFixed(2));

    CalculateTotal();



}

function CalculateTotal() {
    var totalQuantity = 0;
    var totalPrice = 0;



    document.querySelectorAll("tr.ing").forEach(row => {
        // Split the id to get the index
        const rowId = row.id; // e.g., "ing_0"
        const index = rowId.split("_")[1];

        // Find the quantity input inside the row using the index
        const quantityInput = document.getElementById(`quantity_${index}`);
        const totalInput = document.getElementById(`total_${index}`);

        if (quantityInput) {
            const quantity = parseFloat(quantityInput.value);
            if (!isNaN(quantity)) {
                totalQuantity += quantity;
            }
        }

        if (totalInput) {
            const total = parseFloat(totalInput.innerHTML);
            if (!isNaN(total)) {
                totalPrice += total;
            }
            else {
                totalPrice = 0;
            }
        }

    });

    document.querySelectorAll("tr.ing").forEach(row => {

        // Split the id to get the index
        const rowId1 = row.id.split('_')[1]; // e.g., "ing_0"


        const mpr = $('#quantity_' + rowId1).val() / totalQuantity * 100;

        $('#mpr_' + rowId1).val(mpr.toFixed(3));

    })



    $('#total_quantity').html(totalQuantity.toFixed(4))


    $('#total_cost').html(totalPrice.toFixed(2));

    if (totalQuantity != 0) {
        $('#cost_per_kg').html((totalPrice / totalQuantity * 1000).toFixed(2));
    }
    else {
        $('#cost_per_kg').html(0);
    }
}


function SetZero(ctrl) {
    let val = parseFloat(ctrl.value);

    if (isNaN(val) || val < 0) {
        ctrl.value = '';
        return -1;
    }

    const decimalPart = ctrl.value.split('.')[1];
    const decimalPart1 = ctrl.value.split('.')[0];

    if (decimalPart1.length > 9) {
        FailToaster('Number should be maximum of 9 digit!!');
        ctrl.value = '';
        return -1;
    }


    var id = ctrl.id

    if (id.toLowerCase().includes("quantity")) {
        if (decimalPart && decimalPart.length > 4) {
            // Floor to 2 decimal places
            val = Math.floor(val * 10000) / 10000;
            ctrl.value = val.toString();
        }
    }

    else {
        if (decimalPart && decimalPart.length > 2) {
            // Floor to 2 decimal places
            val = Math.floor(val * 100) / 100;
            ctrl.value = val.toString();
        }
    }

    return 1;
}


function SetCategory(selectElement) {
    selectedCategory = selectElement.value.toLowerCase();

    // Clear item input field
    document.getElementById('txtMIItemName').value = '';

    // Clear hidden selected item value
    document.getElementById('ddlItem').value = '';

    // Clear suggestion box
    document.getElementById('globalSuggestionBox').innerHTML = '';
    document.getElementById('globalSuggestionBox').style.display = 'none';

    // Optional: Clear other UI fields if you use them
    $('#lblItemName').text('');
    $('#lblItemDesc').text('');
    $('#lblUnit').text('');
}
