$(document).ready(function () {   
    var model =
    {
        ID: $('#hdnItemMasterId').val()
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_101' }, 'GET', function (response) {
        var tableData = response.data.data.Table;
        if (tableData && tableData.length > 0) {
            $('#itemCode').text(tableData[0].ItemCode);
            $('#itemNameh').text(tableData[0].ItemName);
            $('#itemName').text(tableData[0].ItemName);
            $('#salesPerson').text(tableData[0].PA_NAME);
            $('#itemDescription').text(tableData[0].Description);
            $('#hsnCode').text(tableData[0].HSNCode);
            $('#status').text(tableData[0].ItemStatus);
            $('#batchApplicable').text(tableData[0].BatchApplicable);
            $('#defaultWarehouse').text(tableData[0].WarehouseName);
            $('#category').text(tableData[0].ItemCategory);
            $('#subcategory').text(tableData[0].ItemCategory == tableData[0].ItemSubCategory ? '' : tableData[0].ItemSubCategory);
            $('#baseUnit').text(tableData[0].Unit);
            $('#alternateUnit').text(tableData[0].ALTUnit);
            $('#conversionFactor').text(tableData[0].ConversionFactor);
            $('#taxCode').text(tableData[0].ItemCharges);

            $('#purchRate').text(tableData[0].PurchRate);
            $('#saleRate').text(tableData[0].SaleRate);

            $('#minStockLevel').text(tableData[0].MinQty);
            $('#maxStockLevel').text(tableData[0].MaxStockLevel);
            $('#safetyStockLevel').text(tableData[0].SafetyStockLevel);
            $('#preferredSupplier').text(tableData[0].PA_NAME);
            $('#leadTime').text(tableData[0].LeadTime);
            $('#packSize').text(tableData[0].PackSize);
            $('#tolerance').text(tableData[0].Tolerance);
            $('#brandType').text(tableData[0].BrandType);            
            if (tableData[0].QC_APPLICABLE == 'Yes') {
                document.getElementById('divUserType').style.display = 'block';
                $('#lblMicrobilogicalTestRequired').text(tableData[0].QC_APPLICABLE);
                //if (tableData[0].IsBioMetrically != null) {
                //    $('#lblMicrobilogicalTestRequired').text(tableData[0].IsBioMetrically);
                //}
                //else {
                //    $('#lblMicrobilogicalTestRequired').text('No');
                //}
            }
            else {
                $('#lblMicrobilogicalTestRequired').text(tableData[0].QC_APPLICABLE);
                document.getElementById('divUserType').style.display = 'block';
            }

            $('#purchAccountName').text(tableData[0].PurchAccountName);
            $('#saleAccountName').text(tableData[0].SaleAccountName);

            $('#transactionType').text(tableData[0].TransType);

           // ShowQCMapping(tableData[0].ITEM_ID);

            //Item Attachment
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
                if (attachmentType == 'Upload1') {
                    LoadFileData1(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                    $('#NoUploadFile1').hide();
                    $('#ShowUploadFile1').show();
                }
                else if (attachmentType == 'Upload2') {
                    LoadFileData2(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                    $('#NoUploadFile2').hide();
                    $('#ShowUploadFile2').show();
                }
                else {
                    LoadFileData3(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                    $('#NoUploadFile3').hide();
                    $('#ShowUploadFile3').show();
                }
            }
        }
       
    });


});

function ShowQCMapping() {
    var model = {
        ID: $('#hdnItemMasterId').val(),
        ParentId: 0
    };

    const jsonString = JSON.stringify(model);
    var ScreenID = "QC_Test_Name";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        const testNameArray = response.data.data.Table;

        if (response.data.data.Table1.length > 0) {
            const itemQCDet = response.data.data.Table1;

            const tbody1 = document.getElementById("tblItemQCDet");               // Non-Microbiology table body
            const tbody2 = document.getElementById("tblItemMicrobiologyDet");     // Microbiology table body

            // Clear existing rows to prevent duplication
            tbody1.innerHTML = '';
            tbody2.innerHTML = '';

            // Populate both tables
            itemQCDet.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                        <td>${item.ParameterName}</td>
                        <td>${item.RangeType}</td>
                        <td>${item.MeasuringUnit}</td>
                        <td>${item.ApprovedRange}</td>
                    `;

                if (item.IsMicrobiological == 0) {
                    tbody1.appendChild(row); // Add to Non-Microbiology
                } else {
                    tbody2.appendChild(row); // Add to Microbiology
                }
            });

            // Handle Microbiology test visibility
            const hasMicrobiology = itemQCDet.some(item => item.IsMicrobiological == 1);
            document.getElementById('divMicrobiologyTests').style.display = hasMicrobiology ? 'block' : 'none';
            document.getElementById('isMandatory').checked = hasMicrobiology;

        }
    });

    // Show modal
    $("#qctestmapping").modal('show');
} 

// Preview the file based on its type
function LoadFileData1(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
   let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
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
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
        <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="DownloadItemFile1(this)"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file1", "document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages1").appendChild(newDocument);
}

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
    document.getElementById("documentImages2").appendChild(newDocument);
}

function LoadFileData3(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
   let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile3(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile3(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
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
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile3(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile3(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile3(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
         <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile3(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file3", "document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages3").appendChild(newDocument);
}

function DownloadItemFile1(ctr) {
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

function DownloadItemFile3(ctr) {
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
