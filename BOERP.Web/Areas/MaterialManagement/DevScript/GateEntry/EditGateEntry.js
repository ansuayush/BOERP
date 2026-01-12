$(document).ready(function () {
    
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
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
        $(this).closest(".input-group").find(".clear-date").show();
    });

    // Open datepicker when clicking the icon
    $('.input-group-text').on('click', function () {
        $(this).closest('.input-group').find('.datepicker').focus();
    });

    // Click on × to clear date
    $(document).on("click", ".clear-date", function () {
        let input = $(this).closest(".input-group").find(".datepicker");
        input.val("");
        $(this).hide();
    });
    // Open datepicker when clicking the icon
    $('.input-group-text').on('click', function () {
        $(this).closest('.input-group').find('.datepicker').focus();
    });
   
    $('#ddlSupp').on('change', function () {
        /* GetMaterialCategory();*/
        handleSupplierChange();
    })

    GetEntrySeries();
});
function BindDDLSupplier(selectvalue, manualTableValue) {
    LoadMasterDropdown('ddlSupp', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: manualTableValue,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false, selectvalue);
}
function BindDDLMaterialCategory(selectvalue) {
    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 2,
        manualTableId: 0,
        ScreenId: 'GateEntry_101'
    }
    LoadMasterDropdown('ddlMaterialCategory', obj2, 'Select', false, selectvalue);
}
function BindDDLTransporterName(selectvalue) {
    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 3,
        manualTableId: 0,
        ScreenId: 'GateEntry_101'
    }
    LoadMasterDropdown('ddlTransporterName', obj3, 'Select', false, selectvalue);
}
function GetEntrySeries() {
    var model =
    {
        ID: itemId
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'GetEntry_102' }, 'GET', function (response) {
        var tblSeries = response.data.data.Table;
        $('#txtDocumentNo').val(response.data.data.Table1[0].DocNumber)
        
        var $ele = $('#ddlGateEntrySeriesManual');
        $ele.empty();
        $.each(tblSeries, function (ii, vall) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName);

            // Set 'selected' when DefaultSrID is 1
            if (vall.ID == response.data.data.Table2[0].Series) {
                $option.attr("selected", "selected");
                if (vall.DOC_LOCK == 1) {
                    DOC_LOCK = true;
                }
            }            
            $ele.append($option);
        })
        
        $('#txtDocumentNo').val(response.data.data.Table2[0].DocumentNo);
        $('#txtDocumentDate').val(ChangeDateFormatToddMMYYYWithSlace(response.data.data.Table2[0].DocumentDate));
        $('#txtInvoiceNumber').val(response.data.data.Table2[0].InvoiceNumber);
        $('#txtInvoiceDate').val(ChangeDateFormatToddMMYYYWithSlace(response.data.data.Table2[0].InvoiceDate));
        /*$('#ddlMaterialCategory').val(response.data.data.Table2[0].MaterialCategory).trigger('change');*/
        $('#txtVehicleNumber').val(response.data.data.Table2[0].VehicleNumber);//.trigger('change');
        $('#txtGateNumber').val(response.data.data.Table2[0].GateNumber);//.trigger('change');
       
        
        BindDDLTransporterName(response.data.data.Table2[0].TransporterName);
        //$('#ddlTransporterName').val(response.data.data.Table2[0].TransporterName).trigger('change');
        
        if (response.data.data.Table2[0].ClientMaterial == true) {
            document.getElementById('rdoClientMaterialYes').checked = true;
        }
        else {
            document.getElementById('rdoClientMaterialNo').checked = true
        }

        if (isView == 1) {
            $('#txtInvoiceNumber').prop('disabled', true);
            $('#txtInvoiceDate').prop('disabled', true);
            $('#txtVehicleNumber').prop('disabled', true);
            $('#txtGateNumber').prop('disabled', true);
            $('#rdoClientMaterialYes').prop('disabled', true);
            $('#rdoClientMaterialNo').prop('disabled', true);

            $('#ddlSupp').prop('disabled', true);

            $('#ddlMaterialCategory').prop('disabled', true);

            $('#ddlTransporterName').prop('disabled', true);
        }

        const manualTableValue = response.data.data.Table2[0].ClientMaterial == true ? 21 : 1;
        //handleClientMaterialChange();
       
        BindDDLSupplier(response.data.data.Table2[0].SupplierId, manualTableValue);
        BindDDLMaterialCategory(response.data.data.Table2[0].MaterialCategory);


        for (var i = 0; i < response.data.data.Table4.length; i++) {
            var fileName = response.data.data.Table4[i].ActualFileName;
            var fileType = response.data.data.Table4[i].FileType;
            var type = response.data.data.Table4[i].Type;
            var fileUrl = response.data.data.Table4[i].FileUrl;
            var fFd = response.data.data.Table4[i].AttachmentId;
            var fSize = response.data.data.Table4[i].FileSize;
            var newfileName = response.data.data.Table4[i].NewFileName;
            var attachmentType = response.data.data.Table4[i].AttachmentType;

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
            if (isView == 0) {
                LoadFileData(fileName, fileType, type, fileUrl, fFd, fSize, newfileName, attachmentInt);
            }
            else {
                LoadFileDataDownload(fileName, fileType, type, fileUrl, fFd, fSize, newfileName, attachmentType);
            }
        }

    });

}
// Preview the file based on its type
function LoadFileData(fileName, fileType, type, fileUrl, fFd, sSize, newfileName,i) {
    var fileObject =
    {
        "TypeDetails": type,
        "FileType": fileType,
        "FolderNames": "IndentDocuments/",
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
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
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
    newDocument.classList.add("document-file"+i);
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages"+i).appendChild(newDocument);
}
let fileModelList = [];
let fileModelList1 = [];
let fileModelList2 = [];

let fileDatalList = [];
let fileDatalList1 = [];
let fileDatalList2 = [];

async function SaveGateEntry() {
    if (checkValidationOnSubmit('Mandatory') == true) {
        var obj =
        {
            FolderNames: "GateEntryDocuments/"
        }
        var type = 1;//This is for  common upload in attachment folder.
        const jsonString = JSON.stringify(obj);
        const result1 = await MultiFileUploadWithoutAync("fileMaterialPhoto", jsonString, type, fileDataCollection1);
        const result2 = await MultiFileUploadWithoutAync("fileMaterialCOA", jsonString, type, fileDataCollection2);
        const result3 = await MultiFileUploadWithoutAync("fileAttachment3", jsonString, type, fileDataCollection3);

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

        // ✅ File count validation
        if (finalFileData1.length > 10) {
            FailToaster(finalFileData1.length +" Files. You cannot upload more than 10 files for Material Photo.");
            return;
        }
        if (finalFileData2.length > 10) {
            FailToaster(finalFileData2.length +" Files.  You cannot upload more than 10 files for Material COA.");
            return;
        }
        if (finalFileData3.length > 10) {
            FailToaster(finalFileData3.length +" Files.  You cannot upload more than 10 files for Attachments.");
            return;
        }

        if (fileData3.length == 0) {
            FailToaster("Invoice Attachment is mandatory.");
            return;
        }

        var DocumentDate = ChangeDateFormatSecond($('#txtDocumentDate').val());
        var InvoiceDate = ChangeDateFormatSecond($('#txtInvoiceDate').val());
        var clientMaterialStatus = false;
        if (document.getElementById('rdoClientMaterialYes').checked) {
            clientMaterialStatus = true;
        } else if (document.getElementById('rdoClientMaterialNo').checked) {
            clientMaterialStatus = false;
        }
        var Model =
        {
            ID: itemId,
            Series: $('#ddlGateEntrySeriesManual').val(),
            DocumentNo: $('#txtDocumentNo').val(),
            DocumentDate: DocumentDate,
            InvoiceNumber: $('#txtInvoiceNumber').val(),
            InvoiceDate: InvoiceDate,
            SupplierId: $('#ddlSupp').val(),
            MaterialCategory: $('#ddlMaterialCategory').val(),
            VehicleNumber: $('#txtVehicleNumber').val(),
            GateNumber: $('#txtGateNumber').val(),
            TransporterName: $('#ddlTransporterName').val(),
            ClientMaterial: clientMaterialStatus,
            MaterialImageAttachment: fileData1,
            InvoiceImageAttachment: fileData2,
            COAImageAttachment: fileData3
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(Model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "GateEntry_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                    RedirectVendorList();
            }
        });
    }
}


function LoadFileDataDownload(fileName, fileType, type, fileUrl, fFd, sSize, newfileName, gateType) {

    console.log(gateType);
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

function CancleGateEntry() {
    RedirectVendorList()
}
function RedirectVendorList() {
    var url = "/MaterialManagement/Material/GateEntry?auth=" + AuthToken;
    window.location.href = url;
}
function ChangeTransporterName() {
    var TransporterId = $('#ddlTransporterName').val() == 'Select' ? 0 : $('#ddlTransporterName').val();
    GetTransporterAddress(TransporterId)
}
function GetTransporterAddress(TransporterId) {
    var model = {
        ID: TransporterId,
        Type: 'ERPTransporter'
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "Trans_102";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var data = response.data.data.Table;
        document.getElementById('pAddressofTransporter').innerText =
            `${response.data.data.Table[0].DispalyName}\n` +
            `${response.data.data.Table[0].Address}, ${response.data.data.Table[0].City}\n` +
            `${response.data.data.Table[0].StateName}, ${response.data.data.Table[0].CountryName}, ${response.data.data.Table[0].PinCode}`;
    });
}
function ChangeDateFormatToDDMMYYYSlace(dt) {
    var MyDateString = "";
    var dateString = dt; // Given date in DD/MM/YYYY format
    var parts = dateString.split('/'); // Split the string by "/"
    var formattedDate = new Date(parts[2], parts[1] - 1, parts[0]); // Rearranged as YYYY, MM (0-based), DD
    MyDateString = formattedDate;
    return MyDateString;
}


function GetMaterialCategory() {

    if ($('#ddlSupp').val() > 0) {
        var model =
        {
            ID: $('#ddlSupp').val(),
            Type: 2
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'GetEntry_102' }, 'GET', function (response) {

            console.log(response);

            if (response.data.data.Table) {

                $('#ddlMaterialCategory').val(response.data.data.Table[0].ItemCategoryId == 0 ? 'Select' : response.data.data.Table[0].ItemCategoryId).trigger('change');

            }

        });
    }
    else {
        $('#ddlMaterialCategory').val('Select').trigger('change');
    }

}

//#region : Manage BusinessPartner, Material Category By Client Material
function handleClientMaterialChange() {
    const isYesChecked = $('#rdoClientMaterialYes').is(':checked');
    const manualTableValue = isYesChecked ? 21 : 1;

     //Load supplier dropdown
    LoadMasterDropdown('ddlSupp', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: manualTableValue,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);

    LoadMasterDropdown('ddlMaterialCategory', {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 2,
            manualTableId: 0,
            ScreenId: 'GateEntry_101'
    }, 'Select', false);

    handleSupplierChange();
}

// When "Yes" or "No" radio changes
$('#rdoClientMaterialYes, #rdoClientMaterialNo').on('change', function () {
    handleClientMaterialChange();
});

// When supplier changes and "No" is selected
function handleSupplierChange() {
    const isYesChecked = $('#rdoClientMaterialYes').is(':checked');

    if (isYesChecked) {
        // If Yes is selected, just enable (unfreeze)
        if (isView == 1) {
            $('#ddlMaterialCategory').prop('disabled', true);
        }
        else {
            $('#ddlMaterialCategory').prop('disabled', false);
        }

    } else {
        // Only when "No" is selected
        GetMaterialCategory();
        $('#ddlMaterialCategory').prop('disabled', true);
    }
}

//#endregion