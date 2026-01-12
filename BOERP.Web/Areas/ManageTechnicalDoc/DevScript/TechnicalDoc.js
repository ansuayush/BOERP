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
var itemId = 0;
function bindCustomerDetByDocNo() {
    var docNoId = $("#ddlDocNoByTransType").val() > 0 ? $("#ddlDocNoByTransType").val() : 0;
    if (docNoId > 0) {
        //Bind Technical Doc Code
        if ($('#hdnTechnicalDocId').val() == "0" || $('#hdnTechnicalDocId').val() == "") {
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

        }

        //End
    }
}

let fileModelList = [];
let fileModelList1 = [];

let fileDatalList = [];
let fileDatalList1 = [];



function showTaskModal(id, authToken, FMS_Id) {
    $('#customloader').show();
    $.get('/Account/GetTaskStatusModal', { id: id, auth: authToken, FMS_Id: FMS_Id, }, function (data) {
        $('#yourModalContainer').html(data);
        $('#viewstatus').modal('show');
        $('#customloader').hide();
    });


}

async function SaveTechnicalDocStep1() {
    if (checkValidationOnSubmit('MandateTechnicalDoc') == true) {
        var technicalDocId = parseInt($("#hdnTechnicalDocId").val());
     
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
            TechnicalDocId: technicalDocId > 0 ? technicalDocId : 0,
            TicketDocNo: $('#lblTicketDocNo').val(),
            TransTypeId: $("#ddlTransType").val() > 0 ? $("#ddlTransType").val() : 0,
            DocNoByTransTypeId: $("#ddlDocNoByTransType").val() > 0 ? $("#ddlDocNoByTransType").val() : 0,
            DocNo: $("#ddlDocNoByTransType").val() > 0 ? $("#ddlDocNoByTransType option:selected").text() : "",
            CustomerName: $('#customerName').text(),
            SalesPersonName: $('#salesPersonName').text(),
            ItemId: itemId,
            ItemName: $('#itemName').text(),
            ItemDes: $('#itemDes').text(),

            TypeOfDoc: $("#ddlTypeOfDoc").val() > 0 ? $("#ddlTypeOfDoc option:selected").text() : "",
            RefDocStep1: fileData
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
    // showData(rowId);
    $('#technicalDocStep2').data('row-id', rowId);
    $('#technicalDocStep2').modal('show');
}

function downloadTechnicalDocStep2(rowId) {

   // showData(rowId);
    bindTechnicalDocDetById(rowId);
    $('#downloadTechnicalDocStep2').data('row-id', rowId);
    $('#downloadTechnicalDocStep2').modal('show');
}


function showData(id) {

    Edit_Id = id;

    var data = tableData.find(input => input.ID == id);
    console.log(data);
    if (!data) return;

    var TaskNo = 1;

    $('#remarks').html(data.T_Remarks);

    $('#remarks2').html(data.T_Remarks);

    if ($("#completed").hasClass('active')) {
        $('#view_doc').html(data.TypeOfDoc);

        if (data.SampleType == 'Oil') {
            $('#fragView').hide();
            $('#colorView').hide();
            $('#packegingView').hide();
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


    }
    else
    {
        $('#edit_doc').html(data.TypeOfDoc);


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


        $('#txtItem' + TaskNo).text(data.ItemName || '');
        $('#txtFormCate' + TaskNo).text(data.FormCate || '');
        $('#txtFragrance' + TaskNo).text(data.Fragrance || '');
        $('#txtColour' + TaskNo).text(data.Color || '');
        $('#txtPackegingType' + TaskNo).text(data.PackegingType || '');
        $('#txtTargetPrice' + TaskNo).text(data.TargetPrice !== null ? `₹ ${data.TargetPrice}` : '');
        $('#requirements' + TaskNo).text(data.Requirements || '');
        $('#mustIngredients' + TaskNo).text(data.MustIngredients || '');
        $('#mustnotingredients' + TaskNo).text(data.MustNotIngredients || '');

        console.log(data.videolink);

        if (data.videolink != null && data.videolink.length >= 1) {
            $('#video').attr('href', data.videolink);
            $('#video').attr('target', '_blank');
        }
        else {
            $('#video').removeAttr('target');

        }

        $('#open_pdf').on('click', function () {

            handleTaskFile(data.FMSFileUrl, data.FMSActualFileName);
        })
    }

    if (data.FileURL && data.FileURL.length <= 1) {
        $('#viewAtt').hide()
    }
    else {
        $('#item_att').attr('href','#');
        $('#item_att').html();

        $('#item_att').on('click', function () {
            handleTaskFile(data.FileURL, data.ActualFileName )
        })

        $('#item_att').html(data.ActualFileName);
        $('#viewAtt').show();
    }

    if (data.FileURL && data.FileURL.length <= 1) {
        $('#viewAtt1').hide()
    }
    else {
        $('#item_att1').attr('href','#');

        $('#item_att1').on('click', function () {
            handleTaskFile(data.FileURL, data.ActualFileName)
        })

        $('#item_att1').html(data.ActualFileName);
        $('#viewAtt1').show()
    }

   

}


function handleTechnicalDocStep2(rowId, mode) {

    showData(rowId);
    if (mode === 'mark done') {
        $('#technicalDocStep2').data('row-id', rowId).modal('show');
    } else if (mode === 'view') {
        bindTechnicalDocDetById(rowId);
        $('#downloadTechnicalDocStep2').data('row-id', rowId).modal('show');
    }
}
function bindTechnicalDocDetById(Id) {
    if (Id > 0) {
        var model =
        {
            ID: Id,
            Doc: 'Technical Doc'
        };

        const jsonString = JSON.stringify(model);

        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'TechnicalDoc_101' }, 'GET', function (response) {

            document.getElementById("downloadDocStep2").innerHTML = '';
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

function ClearFormControlStep1() {
    $('#hdnTechnicalDocId').val(0);
    $('#lblTicketDocNo').val('');

    $('#ddlTransType').val('Select').trigger('change');
    $('#ddlDocNoByTransType').val('Select').trigger('change');
    $('#ddlTypeOfDoc').val('Select').trigger('change');
}
function RedirectUrl() {
    $('#technicalDocStep1').modal('hide');
    $('#technicalDocStep2').modal('hide');
    var url = "/ManageTechnicalDoc/TechnicalDocFMS?auth=" + AuthToken;
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
    loadTechDocByTask(1); // Default to Pending (TaskNo = 1) on load
});

function loadTechDocByTask(taskNo) {
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
            Type: taskNo == 2 ? 3 : 0
        })
    };

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'TechnicalDocGried', columnMeta, tableData);
        $("#customLoader").hide();
    });
}

//#endregion

function setActiveTab(clickedId) {
    document.querySelectorAll(".tablink .nav-link").forEach(link => link.classList.remove("active"));
    document.getElementById(clickedId).classList.add("active");
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
   
        downloadTaskFile(filePath, actualFileName);
}


function downloadTaskFile(filePath, actualFileName) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = actualFileName; // Let the browser decide the file name or specify one
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
