$(document).ready(function () {



    var model =
    {
        GRNID: $('#hdnPoId').val()
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'GRNEntry_101' }, 'GET', function (response) {

        //console.log(response);

        if (response.data.data.Table3.length > 0) {
            $('#showOtherCharges').show();

            populateOtherChargesTable(response.data.data.Table3);

        }
        else {
            $('#showOtherCharges').hide();
        }


        var tblDoc = response.data.data.Table;
        var newDate = ChangeDateFormatToddMMYYYWithSlace(tblDoc[0].DOCDate);
       

        ChangeGetEntrySeries(tblDoc[0].GateEntryId);

        $('#lblDocDate').text('(' + newDate + ')');
        $('#lblSeries').text(tblDoc[0].DOC_PreFix + "/" + tblDoc[0].DOC_SERIES + "-" + tblDoc[0].DocNumber);
        $('#grnnumber_header').text(tblDoc[0].DOC_PreFix + "/" + tblDoc[0].DOC_SERIES + "-" + tblDoc[0].DocNumber);
        $('#lblDocNumber').text(tblDoc[0].DocNumber);
        $('#lblReqName').text(tblDoc[0].BuyersName);
        $('#lblReqDept').text(tblDoc[0].BuyresDepartment);
        $('#lblBuyerName').text(tblDoc[0].BuyerId);
        $("#lblSuppName").text(tblDoc[0].PA_NAME);
        $("#lblSuppAdd").text(tblDoc[0].BILL_ADD1);
        $('#lblSuppAdd').append(
            generateAddressHtml(tblDoc[0].BILL_ADD2, tblDoc[0].BillCity, tblDoc[0].BStateCountryPin)
        );
        $("#lblSuppGSTIN").text(tblDoc[0].GSTIN);
        $('#lblGEN').text(tblDoc[0].GateEntryNo);      
        $('#lblInvoice').text(tblDoc[0].InvoiceNumber);
        $('#lblGED').text(ChangeDateFormatToddMMYYYWithSlace(tblDoc[0].DocumentDate));
        $('#lblInvoiceDate').text(ChangeDateFormatToddMMYYYWithSlace(tblDoc[0].InvoiceDate));
        $('#lblTransName').text(tblDoc[0].TransporteName);


        $('#lblPONos').text(tblDoc[0].POSeries);;


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

function ChangeGetEntrySeries(id) {

    if (id > 0) {
        $("#viewGateEntryDoc").show();




        var model =
        {
            ID: id
        };
        const jsonString = JSON.stringify(model);
        //  var ele = ``

        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'GetEntry_102' }, 'GET', function (response) {

            //if (response.data.data.Table4.length > 0) {
            //    $('#viewGateEntry').show();

            //    $('#GateEntryUpload').html('');
            //}

            for (var i = 0; i < response.data.data.Table4.length; i++) {
                var fileName = response.data.data.Table4[i].ActualFileName;
                var fileType = response.data.data.Table4[i].FileType;
                var type = response.data.data.Table4[i].Type;
                var fileUrl = response.data.data.Table4[i].FileUrl;
                var fFd = response.data.data.Table4[i].AttachmentId;
                var fSize = response.data.data.Table4[i].FileSize;
                var newfileName = response.data.data.Table4[i].NewFileName;
                var attachmentType = response.data.data.Table4[i].AttachmentType;




                var attachmentInt = 3;



                // LoadFileDataDownloadGateEntry(fileName, fileType, type, fileUrl, fFd, fSize, newfileName, 'Upload3');

                LoadFileDataDownload(fileName, fileType, type, fileUrl, fFd, fSize, newfileName, 'Upload3');


            }
        });
    }
    else {
        $("#viewGateEntryDoc").hide();
    }

}

function LoadFileDataDownloadGateEntry(fileName, fileType, type, fileUrl, fFd, sSize, newfileName, gateType) {


    var ele = `<li id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)" ><img src="../../assets/images/icons/help/document-attachment-icon.png" alt="" class="icon-md" /></li>`;

    $('#GateEntryUpload').append(ele);


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



// Function to Populate Table from JSON
function populateTable(data) {
    $('#tblItemInformation').DataTable({
        "processing": true, // for show progress bar           
        "destroy": true,
        "data": data,
        "dom": "t",
        pageLength: data.length,
        "columns": [
            { "data": "PONo" },
            { "data": "ItemCode" },
            { "data": "ItemName" },
            { "data": "ItemDescription" },
            { "data": "HSN" },

            { "data": "Quantity" },
            { "data": "QtyReceived" },
            { "data": "QtyDamage" },
            { "data": "QtyShort" },
            { "data": "QtyAccepted" },
            { "data": "UoM" },
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
            { "data": "TotalCost" },
            { "data": "BatchOrLot" },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {
                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.MFGDate) + "</label>";
                }
            },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {
                    return "<label>" + ChangeDateFormatToddMMYYYWithSlace(row.ExpDate) + "</label>";
                }
            },
            { "data": "WarehouseName" }
        ]
    });
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
function ApporveReject(from) {

    var Id = parseInt($("#hdnPoId").val());
    var dt = new Date();
    var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
    var docDate = ChangeDateFormatToYYYYMMDDWithSlash(newDate);

    var indentModel =
    {
        ERPIndentID: $('#hdnPoId').val(),
        Remark: '',
        IsApproved: from,
        ActionType: 2,
        ID: Id,
        SADocDate: docDate,
        DocType: 'GRNApproval'
    }
    //if (from == 1)
    //{
    //    var isPostingGRN =  PostGRNRecords();
    //}
    // Convert the model to JSON string
    const jsonString = JSON.stringify(indentModel);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "GRNEntry_101",
        Operation: "D",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };

    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        RedirectGRNList();
    });
}

function PostGRNRecords() {
    var Id = parseInt($("#hdnPoId").val());
    var dt = new Date();
    var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
    var docDate = ChangeDateFormatToYYYYMMDDWithSlash(newDate);

    if (Id > 0) {
        var model = {
            ID: Id,
            SADocDate: docDate,
            DocType: 'GRNApproval'
        };

        const jsonString = JSON.stringify(model);

        let GenericModeldata = {
            ScreenID: "SAPost_101",
            Operation: "A",
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ScopeID > 0)
            {
                return 1;
            } else {
                return -1;
            }
        });

        
    }
    else {
        return -1;
    }
}


function RedirectGRNList() {
    var url = "/MaterialManagement/Material/GRNApproval?auth=" + AuthToken;
    window.location.href = url;
}

function generateAddressHtml(add1, add2, city, state) {
    return `
       
             ${add1 && add1.length > 0 ? add1 + `,<br />` : ``}
                ${add2 && add2.length > 0 ? add2 + `,<br />` : ``}
                ${city && city.length > 0 ? city + `,<br />` : ``}
                ${state && state.length > 0 ? state + `,` : ``}
    `;
}