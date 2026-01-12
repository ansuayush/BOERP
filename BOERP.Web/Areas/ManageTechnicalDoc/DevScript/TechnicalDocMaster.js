$(document).ready(function () {

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: 'TechnicalDoc_101'
    }
    LoadMasterDropdown('ddlItemCode', obj1, 'Select', false);

    $('#ddlDocNoByTransType').html('<option value="">Select</option>');

    //Bind Technical Doc No
    if ($('#hdnTechnicalDocId').val() == "0" || $('#hdnTechnicalDocId').val() == "") {

        var model =
        {
            ID: 0,
            OtherId: 0,
            ModuleId: 8
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
            var tblDocNo = response.data.data.Table;
            $('#lblTicketDocNo').val(tblDocNo[0].DocNumber);
        });

    }

});


function bindDocNoByTransType() {
    if (edit_id == 0) {
        var transTypeId = $("#ddlTransType").val() > 0 ? $("#ddlTransType").val() : 0;
        if (transTypeId > 0) {
            var obj = {
                parentId: transTypeId,
                masterTableTypeId: 2,
                isMasterTableType: false,
                isManualTable: false,
                manualTable: 0,
                manualTableId: 0,
                ScreenId: 'ERPDropdownList_101'
            }
            LoadMasterDropdown('ddlDocNoByTransType', obj, 'Select', false);
        }
    }
}


function bindDocNoByTransTypeEdit(selectedValue) {

    var transTypeId = $("#ddlTransType").val() > 0 ? $("#ddlTransType").val() : 0;
    if (transTypeId > 0) {
        var obj = {
            parentId:transTypeId == 1 ? 3 : 4,
            masterTableTypeId: 2,
            isMasterTableType: false,
            isManualTable: false,
            manualTable: 0,
            manualTableId: 0,
            ScreenId: 'ERPDropdownList_101'
        }
        LoadMasterDropdown('ddlDocNoByTransType', obj, 'Select', false, selectedValue);

       
    }
}
var itemId = 0;
function bindCustomerDetByDocNo() {
    var docNoId = $("#ddlDocNoByTransType").val() > 0 ? $("#ddlDocNoByTransType").val() : 0;
    if (docNoId > 0) {
        //Bind Technical Doc Code
        if ($('#hdnTechnicalDocId').val() == "0" || $('#hdnTechnicalDocId').val() == "") {
            var model =
            {
                ID: $("#ddlTransType").val() == 1 ? 3 : 2,
                OtherId: docNoId,
                ModuleId: 9
            };
            const jsonString = JSON.stringify(model);
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
                var tblDocNo = response.data.data.Table;
                $('#customerName').text(response.data.data.Table[0].CustomerName);
                $('#salesPersonName').text(response.data.data.Table[0].ContactPersonName);
                $('#itemName').text(response.data.data.Table[0].ItemName);
                $('#itemDes').text(response.data.data.Table[0].ItemDescription);
                itemId = response.data.data.Table[0].ItemId;
            });

        }

        //End
    }
}

function bindCustomerDetByDocNoEdit(docNoId) {
/*    var docNoId = $("#ddlDocNoByTransType").val() > 0 ? $("#ddlDocNoByTransType").val() : 0;*/
    if (docNoId > 0) {
        //Bind Technical Doc Code
       // if ($('#hdnTechnicalDocId').val() == "0" || $('#hdnTechnicalDocId').val() == "") {
            var model =
            {
                ID: $("#ddlTransType").val(),
                OtherId: docNoId,
                ModuleId: 9
            };
            const jsonString = JSON.stringify(model);
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
                var tblDocNo = response.data.data.Table;
                $('#customerName').text(response.data.data.Table[0].CustomerName);
                $('#salesPersonName').text(response.data.data.Table[0].ContactPersonName);
                $('#itemName').text(response.data.data.Table[0].ItemName);
                $('#itemDes').text(response.data.data.Table[0].ItemDescription);
                itemId = response.data.data.Table[0].ItemId;
            });

      //  }

        //End
    }
}

let fileModelList = [];
let fileModelList1 = [];

let fileDatalList = [];
let fileDatalList1 = [];

async function SaveTechnicalDocStep1() {
    if (checkValidationOnSubmit('MandateTechnicalDoc') == true) {
        var technicalDocId = parseInt($("#hdnTechnicalDocId").val());
        hideTypeOfDocError();

        var obj =
        {
            FolderNames: "TechnicalDocuments/"
        }
        var type = 1;//This is for  common upload in attachment folder.
        const jsonString = JSON.stringify(obj);
        const result = await MultiFileUploadWithoutAync("fileRefDocStep1", jsonString, type, fileDataCollection1);
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

        // ✅ File count validation
        if (finalFileData.length > 10) {
            FailToaster(finalFileData.length + " Files. You cannot upload more than 10 files for Reference Doc Step 1.");
            return;
        }

        var orderModel =
        {
            TechnicalDocId: $('#hdnTechnicalDocId').val(),
            TicketDocNo: $('#lblTicketDocNo').val(),
            TransTypeId: $("#ddlTransType").val() > 0 ? $("#ddlTransType").val() : 0,
            DocNoByTransTypeId: $("#ddlDocNoByTransType").val() > 0 ? $("#ddlDocNoByTransType").val() : 0,
            DocNo: $("#ddlDocNoByTransType").val() > 0 ? $("#ddlDocNoByTransType option:selected").text() : "",
            CustomerName: $('#customerName').text(),
            SalesPersonName: $('#salesPersonName').text(),
            ItemId: itemId,
            ItemName: $('#itemName').text(),
            ItemDes: $('#itemDes').text(),
            Remarks: $('#remarks').val(),
            TypeOfDoc: $("#ddlTypeOfDoc").val().join(','),
            RefDocStep1: finalFileData
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(orderModel);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "TechnicalDoc_101",
            Operation: technicalDocId > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                ClearFormControlStep1();
                setTimeout(function () {
                    RedirectUrl();
                }, 2000);
            }
        });


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

function openTechnicalDocStep2(rowId) {
    // Store the ID in the modal's data attribute
    $('#technicalDocStep2').data('row-id', rowId);
    $('#technicalDocStep2').modal('show');
}

function downloadTechnicalDocStep2(rowId) {
    bindTechnicalDocDetById(rowId);
    $('#downloadTechnicalDocStep2').data('row-id', rowId);
    $('#downloadTechnicalDocStep2').modal('show');
}

function handleTechnicalDocStep2(rowId, mode) {
    if (mode === 'mark done') {
        $('#technicalDocStep2').data('row-id', rowId).modal('show');
    } else if (mode === 'view') {
        bindTechnicalDocDetById(rowId);
        $('#downloadTechnicalDocStep2').data('row-id', rowId).modal('show');
    }
}

var edit_id = 0;
function bindTechnicalDocDetById(Id, isEdit) {
    if (Id > 0) {
        var model =
        {
            ID: Id,
            Doc: '2'

        };

        if (isEdit == 0) {
            $('#edit_file_step1').hide();
            $('#view_file_step2').show();
        }

        edit_id = Id;

        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'TechnicalDoc_101' }, 'GET', function (response) {

            // Step 2 Attachment

            console.log(response);

            var data = response.data.data.Table;

            $('#hdnTechnicalDocId').val(data[0].Id);
            $('#lblTicketDocNo').val(data[0].TicketDocNo);
            $('#ddlTransType').val(data[0].TransTypeId).trigger('change');
            $('#ddlTransType').prop('disabled', true);
            $('#remarks').val(data[0].Remarks);
            bindDocNoByTransTypeEdit(data[0].DocNoByTransId);
            bindCustomerDetByDocNoEdit(data[0].DocNoByTransId);
        
            //var roles = data[0].TypeOfDoc;
            //array = roles.split(',');
            //for (var i = 0; i < array.length; i++) {
            //    $("#ddlTypeOfDoc option[value='" + array[i] + "']").prop("selected", true).trigger('change');
            //    // str += array[i] + ",";
            //}

            //  Bind #ddlTypeOfDoc (checkbox multi-select)
            var roles = data[0].TypeOfDoc; // e.g., "COA,Ingredients"
            console.log("TypeOfDoc received:", roles);

            if (roles) {
                var selectedValues = roles.split(',').map(function (item) {
                    return item.trim();
                });

                console.log("Selected Values Array:", selectedValues);

                // Clear previous selections
                $('#ddlTypeOfDoc').val([]);

                // Set new selections
                $('#ddlTypeOfDoc').val(selectedValues);

                // Refresh Bootstrap Multiselect
                if ($('#ddlTypeOfDoc').data('multiselect')) {
                    $('#ddlTypeOfDoc').multiselect('refresh');
                } else {
                    console.warn("Multiselect plugin not initialized.");
                }
            }

            if (isEdit == 0) {
                $('#ddlDocNoByTransType').prop('disabled', true);
                /*$('#ddlTypeOfDoc').prop('disabled', true);*/
                $('#ddlTypeOfDoc').multiselect('disable');

                $('#btnSave_step1').hide();
               
            }

            if (isEdit == 0 && response.data.data.Table1.length <= 0) {
                $('#NoUploadFile1').show();
                $('#ShowUploadFile2').hide();

            }
            else {
                $('#NoUploadFile1').hide();
                $('#ShowUploadFile2').show();
            }


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
                if (isEdit == 1) {
                    LoadFileData(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                }
                else {
                    LoadFileData2(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);

                }

                //$('#NoUploadFile2').hide();
                //$('#ShowUploadFile2').show();



            }
        });

        $('#technicalDocStep1').modal('show');

        //End
    }
}

//var fileModelList = [];



function LoadFileData(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
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
    fileModelList.push(fileObject);

    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile1(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
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
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
         <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages1").appendChild(newDocument);
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
    document.getElementById("downloadDocStep1").appendChild(newDocument);
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

function ClearFormControlStep1() {
    $('#hdnTechnicalDocId').val(0);
    $('#lblTicketDocNo').val('');

    $('#ddlTransType').val('Select').trigger('change');
    $('#ddlDocNoByTransType').val('Select').trigger('change');
    $('#ddlTypeOfDoc').val('Select');
}
function RedirectUrl() {
    $('#technicalDocStep1').modal('hide');
    $('#technicalDocStep2').modal('hide');
    var url = "/ManageTechnicalDoc/TechnicalDocList?auth=" + AuthToken;
    window.location.href = url;
}

//#region : AGgried: Technical Doc Gried Data
function bindTechnicalDocGridFilter() {

    let filterData = tableData;

    var itemId = $("#ddlItemCode").val() === 'Select' ? '0' : $("#ddlItemCode").val();

    if (itemId != '0') {

        filterData = filterData.filter(row => row.ItemId == itemId);
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do

document.addEventListener("DOMContentLoaded", function () {
    loadTechDocByMaster(); // Default to Pending (TaskNo = 1) on load
});

function loadTechDocByMaster(taskNo) {
    $("#customLoader").show();
    $('#myGrid').html('');
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'TechnicalDoc_102',
        modelData: JSON.stringify({
            TaskNo: taskNo,
            Type: 2
        })
    };

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'TechnicalDocMasterGried', columnMeta, tableData);
        $("#customLoader").hide();
    });
}

//#endregion

function setActiveTab(clickedId) {
    document.querySelectorAll(".tablink .nav-link").forEach(link => link.classList.remove("active"));
    document.getElementById(clickedId).classList.add("active");
}

$('#ddlTypeOfDoc').on('change', function () {
    hideTypeOfDocError();
});

function hideTypeOfDocError() {
    const selectedValues = $("#ddlTypeOfDoc").val();
    if (!selectedValues || selectedValues.length === 0) {
        $('#spddlTypeOfDoc').show();
        return;
    } else {
        $('#spddlTypeOfDoc').hide();
    }
}