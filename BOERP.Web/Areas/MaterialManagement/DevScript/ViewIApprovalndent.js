$(document).ready(function () {

   
        var model =
        {
            ID: $('#hdnIndentId').val()
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Indent_101' }, 'GET', function (response) {
            $('#txtDocNo').text(response.data.data.Table[0].DocNo);           
            var newDate = ChangeDateFormatToddMMYYYWithSlace(response.data.data.Table[0].DOCDate);
            $('#pIndentNumber').text(response.data.data.Table[0].DocNo);
            $('#txtDocDate').text(newDate);
            $('#pRaisedBy').text(response.data.data.Table[0].Name);
            $('#pRaisedDept').text(response.data.data.Table[0].Department);
            $('#txtComments').text(response.data.data.Table[0].Comment); 
            if (response.data.data.Table[0].WorkflowStatusId == 2)
            {
                $('#btnApprovalAction1').show();
                $('#btnApprovalAction2').show();
            }            
            populateTable(response.data.data.Table1);
            for (var i = 0; i < response.data.data.Table2.length; i++)
            {
                var fileName = response.data.data.Table2[i].ActualFileName;
                var fileType = response.data.data.Table2[i].FileType;
                var type = response.data.data.Table2[i].Type;
                var fileUrl = response.data.data.Table2[i].FileUrl;
                var fFd = response.data.data.Table2[i].AttachmentID;
                var fSize = response.data.data.Table2[i].FileSize;
                var newfileName = response.data.data.Table2[i].NewFileName;
                LoadFileData(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
            }

        });
    

});
function RedirectToEdit() {

    var url = "../../MaterialManagement/Material/IndentIndex?auth=" + AuthToken+"&id=" + $('#hdnIndentId').val();
    window.location.href = url;

}
 
// Function to Populate Table from JSON
function populateTable(data)
{     
    $('#datatableIndent').DataTable({
        "processing": true, // for show progress bar           
        "destroy": true,
        "data": data,
        "dom": "t",
        pageLength: data.length,
        "columns": [             
            { "data": "ItemCode" },
            { "data": "ItemName" },
            { "data": "ItemDecription" },
            {
                "data": "Qty",
                "render": function (data, type, row) {
                    return '<input disabled type="number" value="' + data + '" class="form-control text-right" />';
                }
            },
            { "data": "UOM" },           
            {
                "orderable": false,
                data: null, render: function (data, type, row) {
                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.ExpectedDate) + "</label>";
                }
            },
            { "data": "Remark" }

        ]
    });
}


// Preview the file based on its type
function LoadFileData(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
     
    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="~${fileUrl}" alt="${fileName}" class="preview-image" />
                     
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
                    <p class="preview-text"> ${fileName}</p>
                      <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages").appendChild(newDocument);
}

function DownloadIndentFile(ctr)
{
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


function ApporveReject(from)
{
    var indentModel =
    {
        ERPIndentID: $('#hdnIndentId').val(),
        Remark: '',
        IsApproved: from,
        ActionType: 2,
        Module: 'Indent' 
    }
    // Convert the model to JSON string
    const jsonString = JSON.stringify(indentModel);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "Indent_102",
        Operation: "D",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        RedirectPOList();
    });
}
function RedirectPOList() {
    var url = "/MaterialManagement/Material/IndentApproval?auth=" + AuthToken;
    window.location.href = url;
}