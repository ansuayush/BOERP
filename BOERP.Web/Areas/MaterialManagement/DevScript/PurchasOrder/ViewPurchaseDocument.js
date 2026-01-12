$(document).ready(function () {

    var model =
    {
        POID: $('#hdnPoId').val()
    };

    if (Status == 1) {
        $('#lblStatus').html(' <span class="align-self-center badge badge-warning">Pending</span>')
    }
    else if (Status == 2) {
        $('#lblStatus').html(' <span class="align-self-center badge badge-success">Completed</span> ')
    }
    else if (Status == 3) {
        $('#lblStatus').html(' <span class="align-self-center badge badge-danger">Rejected</span>')
    }
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPurchase_101' }, 'GET', function (response) {

        console.log(response);

        var tblDoc = response.data.data.Table;
        var newDate = ChangeDateFormatToddMMYYYWithSlace(tblDoc[0].DOCDate);
        $('#txtPODate').text(newDate);
        $('#lblDocSeries').text(tblDoc[0].DocNo);
        $('#spDocDate').text('(' + newDate + ')');
        $('#lblReqName').text(tblDoc[0].USER_NAME);
        $('#SHIP_ADD1').text(tblDoc[0].ShipToLocationCode);
        $('#BILL_ADD1').text(tblDoc[0].BillToLocationCode)
        $('#lblReqDept').text(tblDoc[0].Department);
        $("#lblSuppName").text(tblDoc[0].PA_NAME + ' - ' + tblDoc[0].BILL_ADD1 + ', ' + tblDoc[0].BILL_ADD2 + ', ' + tblDoc[0].BillCity + ', ' + tblDoc[0].BStateCountryPin);
        $("#lblSuppAdd").text(tblDoc[0].BILL_ADD1);
        $("#lblSuppGST").text(tblDoc[0].GST);
        $('#txtPOSeries').text(tblDoc[0].DocNo);
        $('#txtPONumber').text(tblDoc[0].DocNo);
        $('#txtSalesName').text(tblDoc[0].SalesPersonName);
        $('#ddlIndent').text(tblDoc[0].IndentIDs);
        $('#ddlshipTo').text(tblDoc[0].ShipToLocationCode);
        $('#ddlBillTo').text(tblDoc[0].BillToLocationCode);
        $('#ddlPaymentTerm').text(tblDoc[0].PaymentTerm);
        $('#ddlTC').text(tblDoc[0].TnC);
        $('#totalBeforeTax').text(tblDoc[0].Total_Before_Tax);
        $('#POAmount').text(numberToWords(tblDoc[0].Total_Before_Tax));
        $("#igstTotalInWords").text(numberToWords(tblDoc[0].IGST));
        $("#cgstTotalInWords").text(numberToWords(tblDoc[0].CGST));
        $("#sgstTotalInWords").text(numberToWords(tblDoc[0].SGST));
        $('#TotalAmtInWords').text(numberToWords(tblDoc[0].TotalAmount))
        $('#otherChargesInput').text(tblDoc[0].Other_Charges);
        $("#igstTotal").text(tblDoc[0].IGST);
        $("#cgstTotal").text(tblDoc[0].CGST);
        $("#sgstTotal").text(tblDoc[0].SGST);
        $('#totalTax').text(tblDoc[0].TotalTax);
        $('#totalAfterTax').text(tblDoc[0].Total_After_Tax);
        $('#roundingAmountInput').text(tblDoc[0].RoundAmount);
        $('#grandTotal').text(tblDoc[0].TotalAmount);
        $('#txtComment').text(tblDoc[0].Comments);

        $('#hdnPODocNo').val(tblDoc[0].DocNoEdit);

        if (tblDoc[0].WorkflowStatusId == 1) {
            $('#btnApprovalAction1').show();
            $('#btnApprovalAction2').show();
        }

        populateTable(response.data.data.Table1);

        $('#noOfItems').text(response.data.data.Table1.length);

        for (var i = 0; i < response.data.data.Table2.length; i++) {
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

function numberToWords(num) {
    if (num === null || num === undefined || isNaN(Number(num))) {
        return 'Invalid input';
    }

    const a = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function inWords(n) {
        n = parseInt(n);
        if (n === 0) return '';
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + inWords(n % 100) : '');
        if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
        if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + inWords(n % 100000) : '');
        return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + inWords(n % 10000000) : '');
    }

    // Ensure it's treated as a string and handle decimal safely
    const strNum = Number(num).toFixed(2); // Keeps two decimal places, even for integer input
    const [wholePart, decimalPart] = strNum.split('.');

    let result = '';

    if (parseInt(wholePart) > 0) {
        result += inWords(wholePart) + ' Rupees';
    } else {
        result += 'Zero Rupees';
    }

    if (parseInt(decimalPart) > 0) {
        result += ' and ' + inWords(decimalPart) + ' Paise';
    }

    return result.trim() + ' Only';
}
// Function to Populate Table from JSON
//function populateTable(data) {
//    console.log("Data passed to DataTable:", data); // 🔍 Debug check

//    $('#tblPODocument').DataTable({
//        processing: true,
//        destroy: true,
//        data: data,
//        dom: "t",
//        columns: [
//            { data: "IndentNo" },
//            { data: "IndentNo" },
//            //{
//            //    orderable: false,
//            //    data: null,
//            //    render: function (data, type, row) {
//            //        return `
//            //            Item Code: ${row.ItemCode || ''}<br>
//            //            Item Name: ${row.ItemName || ''}<br>
//            //            ${row.ItemDescription && row.ItemDescription.length > 0 ? row.ItemDescription : ''}
//            //        `;
//            //    }
//            //},
//            { data: "HSN" },
//            { data: "Quantity" },
//            { data: "UoM" },
//            { data: "UnitPrice" },
//            { data: "AmountBeforeDiscount" },
//            { data: "DiscountPercentage" },
//            { data: "AmountAfterDiscount" },
//            { data: "IGSTPercentage" },
//            { data: "IGSTAmount" },
//            { data: "CGSTPercentage" },
//            { data: "CGSTAmount" },
//            { data: "SGSTPercentage" },
//            { data: "SGSTAmount" },
//            { data: "TotalCost" }
//        ]
//    });
//}

function PoDownload(POId) {

    if (!$('#hdnPODocNo').val()) {
        alert("Purchase order doc no not found.");
        return;
    }

    $.ajax({
        url: '/Material/PrintPO?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { POId: POId, PONo: $('#hdnPODocNo').val() },
        xhrFields: {
            responseType: 'blob' // Important to handle binary data like PDF
        },
        beforeSend: function (request)
        {
            request.setRequestHeader('Auth', getCookieValue('AuthToken'));
        },
        success: function (data, status, xhr) {
            $("#customLoader").hide();
            const disposition = xhr.getResponseHeader('Content-Disposition');
            const isPdf = xhr.getResponseHeader('Content-Type') === 'application/pdf';
            $("#customLoader").hide();
            if (!isPdf)
            {
                // If the content is not PDF, assume it's an error message
                const reader = new FileReader();
                reader.onload = function () {
                    const errorMsg = reader.result;
                    alert("Error: " + errorMsg);
                };
                reader.readAsText(data);
                return;
            }

            // Get filename from headers or fallback
            let filename = "Purchase_Order.pdf";
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match != null && match[1]) {
                    filename = match[1].replace(/['"]/g, '');
                }
            }

            // Create a link and trigger download
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
        error: function (xhr) {
            $("#customLoader").hide();
            alert("Ajax Error: " + xhr.statusText || "Unknown error occurred");
        }
    });
}



function PoPrint(POId) {

    if (!$('#hdnPODocNo').val()) {
        alert("Purchase order doc no not found.");
        return;
    }

    $.ajax({
        url: '/Material/PrintPO?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { POId: POId, PONo: $('#hdnPODocNo').val() },
        xhrFields: {
            responseType: 'blob' // Important to handle binary data like PDF
        },
        beforeSend: function (request) {
            request.setRequestHeader('Auth', getCookieValue('AuthToken'));
        },
        success: function (data, status, xhr) {
            $("#customLoader").hide();
            const contentType = xhr.getResponseHeader('Content-Type');
            $("#customLoader").hide();
            if (contentType !== 'application/pdf') {
                const reader = new FileReader();
                reader.onload = function () {
                    const errorMsg = reader.result;
                    alert("Error: " + errorMsg);
                };
                reader.readAsText(data);
                return;
            }

            const blob = new Blob([data], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const printWindow = window.open(blobUrl);
            if (printWindow) {
                printWindow.onload = function () {
                    printWindow.focus();
                    printWindow.print();
                };
            } else {
                alert("Pop-up blocked. Please allow pop-ups for this site to print the document.");
            }
        },
        error: function (xhr) {
            $("#customLoader").hide();
            alert("Ajax Error: " + xhr.statusText || "Unknown error occurred");
        }
    });
}
function populateTable(data) {
    const tbody = document.querySelector("#tblPODocument tbody");
    tbody.innerHTML = ""; // Clear existing rows

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.IndentNo || ''}</td>
            <td>
                Item Code : ${item.ItemCode || ''}<br>
                Item Name : ${item.ItemName || ''}<br>
                ${item.ItemDescription ? item.ItemDescription : ''}
            </td>
            <td>${item.HSN || ''}</td>
            <td class="text-right">${item.Quantity}</td>
            <td class="text-center">${item.UoM || ''}</td>
            <td class="text-center">${item.LastPurchaseRate || 0}</td>
            <td class="text-right">${item.UnitPrice}</td>
            <td class="text-right">${item.AmountBeforeDiscount}</td>
            <td class="text-right">${item.DiscountPercentage}</td>
            <td class="text-right">${item.AmountAfterDiscount}</td>
            <td class="text-right">${item.IGSTPercentage}</td>
            <td class="text-right">${item.IGSTAmount}</td>
            <td class="text-right">${item.CGSTPercentage}</td>
            <td class="text-right">${item.CGSTAmount}</td>
            <td class="text-right">${item.SGSTPercentage}</td>
            <td class="text-right">${item.SGSTAmount}</td>
            <td class="text-right">₹ ${Number(item.TotalCost).toFixed(2)}</td>
        `;

        tbody.appendChild(row);
    });
}
function LoadFileData(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {

    if (1 == 1) { return }
    
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
    var indentModel =
    {
        ERPIndentID: $('#hdnPoId').val(),
        Remark: '',
        IsApproved: from,
        ActionType: 2
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