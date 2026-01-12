$(document).ready(function () {

    var model =
    {
        POID: $('#hdnPoId').val()
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPurchase_101' }, 'GET', function (response) {

        console.log(response);


        if (response.data.data.Table3.length > 0) {
            $('#showOtherCharges').show();

            populateOtherChargesTable(response.data.data.Table3);

        }
        else {
            $('#showOtherCharges').hide();
        }
        
        var tblDoc = response.data.data.Table;
        var newDate = ChangeDateFormatToddMMYYYWithSlace(tblDoc[0].DOCDate);
        $('#txtPODate').text(newDate);
        $('#spDocDate').text('(' + newDate + ')');
        $('#lblReqName').text(tblDoc[0].USER_NAME);
        $('#lblReqDept').text(tblDoc[0].Department);
        $("#lblSuppName").text(tblDoc[0].PA_NAME);
        $("#lblSuppAdd").text(tblDoc[0].BILL_ADD1);
        $("#lblSuppGST").text(tblDoc[0].GST);
        $('#txtPONumber').text(tblDoc[0].DocNo);
        $('#txtSalesName').text(tblDoc[0].SalesPersonName);
        $('#ddlIndent').text(tblDoc[0].IndentIDs);
        $('#ddlshipTo').text(tblDoc[0].ShipToLocationCode);
        $('#ddlBillTo').text(tblDoc[0].BillToLocationCode);
        $('#ddlPaymentTerm').text(tblDoc[0].PaymentTerm);
        $('#ddlTC').text(tblDoc[0].TnC);
        $('#totalBeforeTax').text(tblDoc[0].Total_Before_Tax);
        $('#otherChargesInput').text(tblDoc[0].Other_Charges);
        $("#igstTotal").text(tblDoc[0].IGST);
        $("#cgstTotal").text(tblDoc[0].CGST);
        $("#sgstTotal").text(tblDoc[0].SGST);
        $('#totalTax').text(tblDoc[0].TotalTax);
        $('#totalAfterTax').text(tblDoc[0].Total_After_Tax);
        $('#roundingAmountInput').text(tblDoc[0].RoundAmount);
        $('#grandTotal').text(tblDoc[0].TotalAmount);
        $('#txtComment').text(tblDoc[0].Comments);

        if (tblDoc[0].WorkflowStatusId == 1) {
            $('#btnApprovalAction1').show();
            $('#btnApprovalAction2').show();
        }    

        populateTable(response.data.data.Table1);

        for (var i = 0; i < response.data.data.Table2.length; i++) {
            var fileName = response.data.data.Table2[i].ActualFileName;
            var fileType = response.data.data.Table2[i].FileType;
            var type = response.data.data.Table2[i].Type;
            var fileUrl = response.data.data.Table2[i].FileUrl;
            var fFd = response.data.data.Table2[i].AttachmentID;
            var fSize = response.data.data.Table2[i].FileSize;
            var newfileName = response.data.data.Table2[i].NewFileName;
            LoadFileData(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);

            $('#NoUploadFile1').hide();
            $('#ShowUploadFile1').show();
        }
    });

    $('#showOtherCharges').on('click', function () {
        $('#othercharge').modal('show');
    })
});


// Function to Populate Table from JSON
function populateTable(data) {
    $('#tblPO').DataTable({
        "processing": true, // for show progress bar           
        "destroy": true,
        "data": data,
        "dom": "t",
        pageLength: data.length,
        "columns": [
            { "data": "IndentNo" },
            { "data": "ItemCode" },
            { "data": "ItemName" },
            { "data": "ItemDescription" },
            { "data": "HSN" },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {
                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.DeliveryDate) + "</label>";
                }
            },
            { "data": "Quantity" },
            { "data": "UoM" },
            { "data": "LastPurchaseRate" },
            { "data": "UnitPrice" },
            { "data": "AmountBeforeDiscount" },
            { "data": "DiscountPercentage" },
            { "data": "AmountAfterDiscount" },
            { "data": "IGSTPercentage" },
            { "data": "IGSTAmount" },
            { "data": "CGSTPercentage" },
            { "data": "CGSTAmount" },
            { "data": "SGSTPercentage" },
            { "data": "SGSTAmount" },
            { "data": "TotalCost" }
        ]
    });
}


// Preview the file based on its type
function LoadFileData(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {

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
    document.getElementById("documentImages").appendChild(newDocument);
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
 

function populateOtherChargesTable(data) {

    //console.log(data);

    $('#otherchargeTable').DataTable({
        "processing": true, // for show progress bar           
        "destroy": true,
        "data": data,
        "dom": "t",
        pageLength: data.length,
        "columns": [
            { "data": "Charge_Name" },
            { "data": "ChargeAmount" },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {

                    if (row.IgstPer == null) {

                        return "<label>0</label>"
                    }
                    return "<label>" + row.IgstPer + "</label>";
                }
            },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {

                    if (row.CgstPer == null) {

                        return "<label>0</label>"
                    }
                    return "<label>" + row.CgstPer + "</label>";
                }
            },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {

                    if (row.SgstPer == null) {

                        return "<label>0</label>"
                    }
                    return "<label>" + row.SgstPer + "</label>";
                }
            },
            { "data": "TotalTax" },
            { "data": "TotalNetAmount" }
        ]
    });
}


function ApporveReject(from) {
    var indentModel =
    {
        ERPIndentID: $('#hdnPoId').val(),
        Remark: '',
        IsApproved: from,
        ActionType: 2,
        ModuleId: 1,
    }
      // Convert the model to JSON string
    const jsonString = JSON.stringify(indentModel);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "MaterialPurchase_101",
        Operation: "D",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        RedirectPOList();
    });
}
function RedirectPOList() {
    var url = "/MaterialManagement/Material/POApproval?auth=" + AuthToken;
    window.location.href = url;
}