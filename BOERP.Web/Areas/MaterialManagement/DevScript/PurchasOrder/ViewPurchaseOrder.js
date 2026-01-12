$(document).ready(function () {

    var model =
    {
        POID: $('#hdnPoId').val()
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPurchase_101' }, 'GET', function (response) {
        var tblDoc = response.data.data.Table;

        console.log(response);

        if (response.data.data.Table3.length > 0) {
            $('#showOtherCharges').show();

            populateOtherChargesTable(response.data.data.Table3);

        }
        else {
            $('#showOtherCharges').hide();
        }

        var newDate = ChangeDateFormatToddMMYYYWithSlace(tblDoc[0].DOCDate);
        $('#txtPODate').text(newDate);
        $('#spDocDate').text('(' + newDate + ')');
        $('#lblReqName').text(tblDoc[0].USER_NAME);
        $('#lblReqDept').text(tblDoc[0].Department);
        $("#lblSuppName").text(tblDoc[0].PA_NAME);

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

        FillSuppDetailsBySUpplierId(tblDoc[0].SupplierId);

        if (tblDoc[0].WorkflowStatusId == 1) {
            $('#btnEdit').show();
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


function generateAddressHtml(add1, add2, city, state) {
    return `
       
             ${add1 && add1.length > 0 ? add1 + `,<br />` : ``}
                ${add2 && add2.length > 0 ? add2 + `,<br />` : ``}
                ${city && city.length > 0 ? city + `,<br />` : ``}
                ${state && state.length > 0 ? state + `,` : ``}
    `;
}


function FillSuppDetailsBySUpplierId(suppId) {

    var model =
    {
        ID: 0,
        SupplierId: suppId,
        ModuleId: 2
    };
  //  suppId = $('#ddlSupp').val() == 'Select' ? 0 : $('#ddlSupp').val();
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {

        var tblSupp = response.data.data.Table2;

        $("#lblSuppAdd").text(tblSupp[0].BILL_ADD1);
        $('#lblSuppAdd').append(
            generateAddressHtml(tblSupp[0].BILL_ADD2, tblSupp[0].BillCity, tblSupp[0].BStateCountryPin)
        );

        //$("#lblSuppGST").text(tblSupp[0].GST);
    

    });

}


// Function to Populate Table from JSON
function populateTable(data) {

    //console.log(data);

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
function RedirectToEdit() {

    var url = "../../MaterialManagement/Material/CreatePurchaseOrder?auth=" + AuthToken + "&id=" + $('#hdnPoId').val() + "&suppId=" + $('#hdnSuppId').val() + "&IndId=" + $('#hdnIndId').val();
    window.location.href = url;

}