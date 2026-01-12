$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    var model =
    {
        POID: itemId
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'POPrint_101' }, 'GET', function (response) {
        var poData = response.data.data.Table;
        var locShipData = response.data.data.Table2;
        var locBillData = response.data.data.Table3;
        var stateCodeData = response.data.data.Table5;
        
        //Order Infomation
        document.getElementById('pOrderNumber').innerText = poData[0].DocNoEdit;
        document.getElementById('pOrderDate').innerText = ChangeDateFormatToddMMYYYWithSlace(poData[0].DOCDate);
        document.getElementById('pPaymentTerms').innerText = poData[0].PaymentTerm;        
        document.getElementById('pSalesPerson').innerText = poData[0].SalesPerson;
        document.getElementById('pPreparedBy').innerText = poData[0].USER_NAME;
        
        //Vendor Infomation
        var billCity = poData[0].BillCity == undefined ? "" : poData[0].BillCity;
        var billCountry = poData[0].CountryName == undefined ? "" : poData[0].CountryName;
        document.getElementById('pStateCode').innerText = stateCodeData[0].StateCode
        $("#pVendorName").text(poData[0].PA_NAME);
        document.getElementById('sVendorAddress1').innerText = poData[0].AddressofSupplier;
        document.getElementById('sVendorAddress2').innerText = billCity + ',' + poData[0].BILL_STATE + ',' + poData[0].BILL_PIN + ',' + billCountry;
        document.getElementById('pGSTNumber').innerText = poData[0].GST;
        document.getElementById('pPANNumber').innerText = poData[0].PAN;
        document.getElementById('pPHONENumber').innerText = poData[0].PHONE;
        //ShipTo Infomation
        document.getElementById('pShiptoName').innerText = locShipData[0].LocationName;
        document.getElementById('pShiptoAddress').innerText = locShipData[0].Address;
        document.getElementById('pShiptoCityState').innerText = locShipData[0].CityName + ',' + locShipData[0].StateName;
        document.getElementById('pShiptoPinCountry').innerText = locShipData[0].PinCode + ',' + locShipData[0].CountryName;
        document.getElementById('pShiptoGSTNo').innerText = poData[0].GST;
        document.getElementById('pShiptoEmailId').innerText = poData[0].EMPEmail;
        document.getElementById('pShiptoPhone').innerText = poData[0].EMPPhone;
        document.getElementById('pShiptoAttn').innerText = poData[0].EMPName;
        //BillTo Infomation
        document.getElementById('pBilltoName').innerText = locBillData[0].LocationName;
        document.getElementById('pBilltoAddress').innerText = locBillData[0].Address;
        document.getElementById('pBilltoCityState').innerText = locBillData[0].CityName + ',' + locBillData[0].StateName;
        document.getElementById('pBilltoPinCountry').innerText = locBillData[0].PinCode + ',' + locBillData[0].CountryName;
        document.getElementById('pBilltoEmailId').innerText = poData[0].PHONE;
        //Other Charges Infomation
        BindTableData(response.data.data.Table1);
        BindTableOtherChargesData(response.data.data.Table4, poData);
    }); 
})
var itemTotal = 0;
var cgstTotal = 0
var sgstTotal = 0;
var igstTotal = 0;
var lineTotal = 0;
function BindTableData(itemData) {
    var tbody = $("#divPurchaseOrder tbody");
    tbody.empty(); // Clear old rows if any

    $.each(itemData, function (index, item) {
        itemTotal = itemTotal +  item.TotalCost ;
        cgstTotal = cgstTotal +  item.CGSTAmount;
        sgstTotal = sgstTotal +  item.SGSTAmount;
        igstTotal = igstTotal + item.IGSTAmount;
        lineTotal = lineTotal + item.LineTotal;
        var row = `
                <tr>
                    <td class="text-center">${item.Srno}</td>
                    <td>${item.ItemCode}</td>
                    <td>${item.ItemDescription}</td>
                    <td>${item.HSN}</td>
                    <td>${item.Quantity}</td>
                    <td>${item.UoM}</td>
                    <td>${item.UnitPrice}</td>
                    <td class="text-right">${item.DiscountAmount}</td>
                    <td class="text-right">${item.TotalCost}</td>
                    <td class="text-right">${item.CGSTAmount}</td>
                    <td class="text-right">${item.SGSTAmount}</td>
                    <td class="text-right">${item.IGSTAmount}</td>
                    <td class="text-right">${item.LineTotal}</td>
                </tr>
            `;
        tbody.append(row);
    });
}
function BindTableOtherChargesData(itemData, poData) {
    var tbody = $("#divPurchaseOrder tfoot");
    tbody.empty(); // Clear old rows if any

    $.each(itemData, function (index, item) {
        itemTotal = itemTotal +  item.ChargeAmount 
        cgstTotal = cgstTotal + (item.TaxCode == 'CGST' ? item.TotalTax : 0.00 )
        sgstTotal = sgstTotal + (item.TaxCode == 'SGST' ? item.TotalTax : 0.00  )
        igstTotal = igstTotal + (item.TaxCode == 'IGST' ? item.TotalTax : 0.00)
        lineTotal = lineTotal + item.TotalNetAmount;
        var row = `
                <tr>
                    <td></td>
					<td>${item.FIELD_NAME}</td>
					<td></td>
                    <td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td class="text-right">${item.ChargeAmount}</td>
					<td class="text-right">${item.TaxCode == 'CGST' ? item.TotalTax : 0.00} (${item.TaxCode == 'CGST' ? item.Percentages : 0.00}%)</td>
					<td class="text-right">${item.TaxCode == 'SGST' ? item.TotalTax : 0.00} (${item.TaxCode == 'SGST' ? item.Percentages : 0.00}%)</td>
					<td class="text-right">${item.TaxCode == 'IGST' ? item.TotalTax : 0.00} (${item.TaxCode == 'IGST' ? item.Percentages : 0.00}%)</td>
					<td class="text-right">${item.TotalNetAmount}</td>
                </tr>

            `;
        tbody.append(row);
    });
    var beforroundingAmount = `<tr>
							<td colspan="8" class="fn-bold">Total Amount (₹)</td>
							<td class="fn-bold text-right">${itemTotal.toFixed(2)}</td>
							<td class="fn-bold text-right">${cgstTotal.toFixed(2)}</td>
							<td class="fn-bold text-right">${sgstTotal.toFixed(2) }</td>
							<td class="fn-bold text-right">${igstTotal.toFixed(2) }</td>
							<td class="fn-bold text-right">${lineTotal.toFixed(2) }</td>
						</tr>`;
    tbody.append(beforroundingAmount );
    var roundingAmount =`<tr>
							<td></td>
							<td>Rounding Amount</td>
							<td></td>
                            <td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td class="text-right">0.00</td>
							<td class="text-right"></td>
							<td class="text-right"></td>
							<td class="text-right"></td>
							<td class="text-right">${(poData[0].RoundAmount).toFixed(2) }</td>									
						</tr>`
    var totalAmount = `<tr>
							<td colspan="8" class="fn-bold">Total Amount (₹)</td>
							<td class="fn-bold text-right">${(poData[0].RoundAmount + itemTotal).toFixed(2) }</td>
							<td class="fn-bold text-right">${cgstTotal.toFixed(2) }</td>
							<td class="fn-bold text-right">${sgstTotal.toFixed(2) }</td>
							<td class="fn-bold text-right">${igstTotal.toFixed(2) }</td>
							<td class="fn-bold text-right">${(poData[0].RoundAmount+lineTotal).toFixed(2) }</td>
						</tr>`;
    tbody.append(roundingAmount + totalAmount);
    document.getElementById('pInvoiceAmount').innerText = (poData[0].RoundAmount + lineTotal).toFixed(2); 
    document.getElementById('pInvoiceAmountToWord').innerText = numberToWords((poData[0].RoundAmount + lineTotal).toFixed(2));
}
function DownloadInPDF() {
    var element = document.getElementById('divPurchaseOrder');
    const opt = {
        margin: 0.1,
        filename: 'Purchase_Order.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 1,               // 🔥 Increases resolution
            useCORS: true,          // In case there are external images
            scrollY: 0
        },
        jsPDF: { unit: 'in', format: 'a3', orientation: 'landscape' } // 🔥 Use A3 or Landscape for wide tables
    };
    html2pdf().set(opt).from(element).save();
    return false;
}

function numberToWords(num) {
    var a = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen'
    ];
    var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function inWords(n) {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + inWords(n % 100) : '');
        if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
        return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + inWords(n % 100000) : '');
    }

    let parts = num.toString().split(".");
    let integerPart = parseInt(parts[0]);
    let decimalPart = parts[1] ? parseInt(parts[1].substring(0, 2)) : 0;

    let result = inWords(integerPart);
    if (decimalPart > 0) {
        result += ' and ' + inWords(decimalPart) + ' Paise';
    }

    return result;
}

function printPurchaseOrder() {

    var POId = Edit_ID;
    $.ajax({
        url: '/Material/PrintPO?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { POId: POId },
        xhrFields: {
            responseType: 'blob' // Important to handle binary data like PDF
        },
        beforeSend: function (request) {
            request.setRequestHeader('Auth', getCookieValue('AuthToken'));
        },
        success: function (data, status, xhr) {
            $("#customLoader").hide();
            const disposition = xhr.getResponseHeader('Content-Disposition');
            const isPdf = xhr.getResponseHeader('Content-Type') === 'application/pdf';

            if (!isPdf) {
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
