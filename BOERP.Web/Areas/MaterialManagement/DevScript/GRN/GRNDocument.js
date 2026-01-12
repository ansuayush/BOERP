$(document).ready(function () {
    $(function () {
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
        });

    });
    LoadMasterDropdown('ddlSalesPerson', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 12,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);

    //LoadMasterDropdown('ddlDocSeries', {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 7,
    //    manualTableId: 0,
    //    ScreenId: "MaterialPurchase_101"
    //}, 'Select', false);

    LoadMasterDropdown('ddlshipTo', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 9,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);

    LoadMasterDropdown('ddlBillTo', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 10,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);

    LoadMasterDropdown('ddlIndent', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 8,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, '', false);

    LoadMasterDropdown('ddlPaymentTerm', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 11,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);


    if ($('#hdnPoId').val() == "0" || $('#hdnPoId').val() == "") {
        var model =
        {
            ID: 0,
            SupplierId: $('#hdnSuppId').val(),
            ModuleId: 2
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {


            var DOC_LOCK = false;
            var tblDoc = response.data.data.Table;
            var tblSeries = response.data.data.Table1;
            var tblSupp = response.data.data.Table2;
            var tblSales = response.data.data.Table3;

            $('#txtPONumber').val(tblDoc[0].DocNumber);
            var dt = new Date();
            var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
            $('#txtPODate').val(newDate);
            $('#lblReqName').text(loggedinUserName);
            $('#lblReqDept').text(loggedinUserDept);
            var $ele = $('#ddlDocSeries');
            $ele.empty();
            $.each(tblSeries, function (ii, vall) {
                var $option = $('<option />')
                    .val(vall.ID)
                    .text(vall.ValueName);

                // Set 'selected' when DefaultSrID is 1
                if (vall.DEFAULT_DOC == true) {
                    $option.attr("selected", "selected");
                    if (vall.DOC_LOCK == 1) {
                        DOC_LOCK = true;
                    }
                }
                $ele.append($option);

            })

            if (DOC_LOCK == true) {
                $("#txtPONumber").prop("disabled", true);
            }
            else {
                $("#txtPONumber").prop("disabled", false);
            }


            //Bind supplier Details
            //txtSupName
            //ddlSalesPerson
            //lblSuppAdd
            //lblSuppGST
            $("#txtSupName").val(tblSupp[0].PA_NAME);
            $("#lblSuppAdd").text(tblSupp[0].BILL_ADD1);
            $("#lblSuppGST").text(tblSupp[0].GST);


        });

    }
});

function SetDocNumber(ctrl) {
    var model =
    {
        ID: ctrl.value,
        SupplierId: 0,
        ModuleId: 2
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {
        var tblDoc = response.data.data.Table;
        $('#txtPONumber').val(tblDoc[0].DocNumber);
        if (tblDoc[0].DOC_LOCK == 1) {
            $("#txtPONumber").prop("disabled", true);
        }
        else {
            $("#txtPONumber").prop("disabled", false);
        }


    });
}
var items = [];
var fileModelList = [];


function FillGrid(ctr) {
    var data = $('#' + ctr.id).val().join();
    var model =
    {
        IndentIDs: data,
        POID: 0
    };


    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPurchase_101' }, 'GET', function (response) {
        var tblDoc = response.data.data.Table;
        items = [];
        tblDoc.forEach(doc => {
            items.push(doc);
        });
        addRowsToTable();
        updateGrandTotal();
    });
}

async function SavePurchaseOrder() {
    if (checkValidationOnSubmit('Mandate') == true) {
        var data = $('#ddlIndent').val().join();
        var obj =
        {
            FolderNames: "PODocuments/"
        }
        var type = 1;//This is for  common upload in attachment folder.
        const jsonString1 = JSON.stringify(obj);
        const result1 = await MultiFileUploadWithoutAync("fileIndent", jsonString1, type, fileDataCollection);
        var fileData = [];
        if (result1.Data != undefined) {
            fileData = JSON.parse(result1.Data).FileModelList;
            fileData = fileData.concat(fileModelList);
        }
        else {
            fileData = fileModelList;
        }
        let tableRows = document.querySelectorAll("#tblItemInformation tbody tr");
        let purchaseOrderItems = [];
        tableRows.forEach(row => {
            let item = {
                POItemId: row.querySelector(".POItemId").innerText.trim(),
                IndentItemId: row.querySelector(".IndentItemId").innerText.trim(),
                ItemID: row.querySelector(".ItemID").innerText.trim(),
                IndentNo: row.cells[1].innerText.trim(),
                ItemCode: row.cells[2].innerText.trim(),
                ItemName: row.cells[3].innerText.trim(),
                ItemDescription: row.cells[4].innerText.trim(),
                HSN: row.cells[5].innerText.trim(),
                DeliveryDate: ChangeDateFormatSecond(row.querySelector(".datepicker").value.trim()),
                Quantity: parseFloat(row.querySelector(".quantity").value) || 0,
                UoM: row.cells[8].innerText.trim(),
                UnitPrice: parseFloat(row.querySelector(".unit-price").value) || 0,
                AmountBeforeDiscount: parseFloat(row.cells[10].innerText) || 0,
                DiscountPercentage: parseFloat(row.querySelector(".discount").value) || 0,
                AmountAfterDiscount: parseFloat(row.cells[12].innerText) || 0,
                IGSTPercentage: parseFloat(row.cells[13].innerText) || 0,
                IGSTAmount: parseFloat(row.cells[14].innerText) || 0,
                CGSTPercentage: parseFloat(row.cells[15].innerText) || 0,
                CGSTAmount: parseFloat(row.cells[16].innerText) || 0,
                SGSTPercentage: parseFloat(row.cells[17].innerText) || 0,
                SGSTAmount: parseFloat(row.cells[18].innerText) || 0,
                TotalCost: parseFloat(row.cells[19].innerText) || 0
            };
            purchaseOrderItems.push(item);
        });
        var model =
        {
            "ID": $('#hdnPoId').val(),
            "DOCTYPE_ID": $('#ddlDocSeries').val(),
            "IndentIDs": data,
            "SupplierId": $('#hdnSuppId').val(),
            "AddressofSupplier": $("#lblSuppAdd").text(),
            "Department": "Finance",
            "GSTIN": $("#lblSuppGST").text(),
            "Comments": $("#txtComments").val(),
            "SalesPersonId": $('#ddlSalesPerson').val(),
            "ShipToId": $('#ddlshipTo').val(),
            "TotalAmount": $('#grandTotal').text().replace(/₹/g, '').trim(),
            "Total_Before_Tax": $('#totalBeforeTax').text().replace(/₹/g, '').trim(),
            "Total_After_Tax": $('#totalAfterTax').text().replace(/₹/g, '').trim(),
            "Other_Charges": $('.otherChargesInput').text().replace(/₹/g, '').trim(),
            "IGST": $('#igstTotal').text().replace(/₹/g, '').trim(),
            "CGST": $('#cgstTotal').text().replace(/₹/g, '').trim(),
            "SGST": $('#sgstTotal').text().replace(/₹/g, '').trim(),
            "TotalTax": $('#totalTax').text().replace(/₹/g, '').trim(),
            "RoundAmount": $('#roundingAmountInput').val(),
            "BillToId": $('#ddlBillTo').val(),
            "PaymentTermId": $('#ddlPaymentTerm').val(),
            "FinID": FinYearId,
            "PurchaseOrderItems": purchaseOrderItems,
            "Attachments": fileData,
            "PurchaseOrdersOtherCharges": []
        }

        const jsonString = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "MaterialPurchase_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if ($('#hdnPoId').val() == "0" || $('#hdnPoId').val() == "") {
                window.location.reload();
            }
        });
    }
}
function collectTableData() {
    let tableRows = document.querySelectorAll("#purchaseOrderTable tbody tr");
    let purchaseOrderItems = [];

    tableRows.forEach(row => {
        let item = {
            IndentNo: row.cells[1].innerText.trim(),
            ItemCode: row.cells[2].innerText.trim(),
            ItemName: row.cells[3].innerText.trim(),
            ItemDescription: row.cells[4].innerText.trim(),
            HSN: row.cells[5].innerText.trim(),
            DeliveryDate: row.querySelector(".datepicker").value.trim(),
            Quantity: parseFloat(row.querySelector(".quantity").value) || 0,
            UoM: row.cells[8].innerText.trim(),
            UnitPrice: parseFloat(row.querySelector(".unit-price").value) || 0,
            AmountBeforeDiscount: parseFloat(row.cells[10].innerText) || 0,
            DiscountPercentage: parseFloat(row.querySelector(".discount").value) || 0,
            AmountAfterDiscount: parseFloat(row.cells[12].innerText) || 0,
            IGSTPercentage: parseFloat(row.cells[13].innerText) || 0,
            IGSTAmount: parseFloat(row.cells[14].innerText) || 0,
            CGSTPercentage: parseFloat(row.cells[15].innerText) || 0,
            CGSTAmount: parseFloat(row.cells[16].innerText) || 0,
            SGSTPercentage: parseFloat(row.cells[17].innerText) || 0,
            SGSTAmount: parseFloat(row.cells[18].innerText) || 0,
            TotalCost: parseFloat(row.cells[19].innerText) || 0
        };
        purchaseOrderItems.push(item);
    });

    return purchaseOrderItems;
}

function addRowsToTable() {
    let tbody = document.querySelector("#tblItemInformation tbody");

    // Get all existing rows in the table
    let existingRows = Array.from(tbody.children);

    // Create a Set of item keys (IndentNo + ItemCode) from `items`
    let itemKeysInData = new Set();
    items.forEach(item => {
        let itemKey = `${item.IndentNo}-${item.ItemCode}`; // Unique key
        itemKeysInData.add(itemKey);
    });


    // Remove rows from table if their (IndentNo + ItemCode) is not in `items`
    existingRows.forEach(row => {
        let rowIndentNo = row.cells[1].innerText.trim();
        let rowItemCode = row.cells[2].innerText.trim();
        let rowKey = `${rowIndentNo}-${rowItemCode}`;

        if (!itemKeysInData.has(rowKey)) {
            row.remove(); // Remove row if it's not in items
        }
    });

    // Now, add/update rows based on `items`

    items.forEach(item => {
        let itemKey = `${item.IndentNo}-${item.ItemCode}`;

        let existingRow = Array.from(tbody.children).find(row =>
            row.cells[2].innerText.trim() === item.ItemCode &&
            row.cells[1].innerText.trim() === item.IndentNo
        );

        if (!existingRow) { // Add new row if not found
            let row = document.createElement("tr");
            row.innerHTML = `
                    <td class="text-center"><span style="display:none;"  class="IndentItemId">${item.IndentItemId}</span><span style="display:none;"  class="ItemID">${item.ItemID}</span><span style="display:none;"  class="POItemId">${item.POItemId}</span><div class="cursor-pointer"><img src="../../assets/images/icons/help/close.svg" alt="Remove"></div></td>
                    <td>${item.IndentNo}</td>     
                    <td>${item.ItemCode}</td>          
                    <td>${item.ItemName}</td>
                    <td>${item.ItemDescription}</td>
                    <td>${item.HSN}</td>             
                    <td>
                        <div class="input-group">
                            <input type="text" class="datepicker form-control" value="${ChangeDateFormatToddMMYYYWithSlace(item.DeliveryDate)}" placeholder="DD/MM/YYYY" readonly >
                            <div class="input-group-append">
                                <span class="input-group-text bg-white"><img src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span>
                            </div>
                            <span class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                        </div>
                    </td>
                    <td><input type="number" class="quantity form-control text-right" value="${item.Quantity}" onchange="SetZero(this)"></td>
                    <td>${item.UoM}</td>
                    <td><input type="number" class="unit-price form-control text-right" value="${item.UnitPrice}" onchange="SetZero(this)" ></td>
                    <td class="amount-before-discount text-right">${item.AmountBeforeDiscount}</td>
                    <td><input type="number" class="discount form-control text-right" value="${item.DiscountPercentage}" onchange="SetZero(this)"></td>
                    <td class="amount-after-discount text-right">${item.AmountAfterDiscount}</td>
                    <td class="IGSTPercentage text-right">${item.IGSTPercentage}</td>
                    <td class="igst-amount text-right">${item.IGSTAmount}</td>
                    <td class="CGSTPercentage text-right">${item.CGSTPercentage}</td>
                    <td class="cgst-amount text-right">${item.CGSTAmount}</td>
                    <td class="SGSTPercentage text-right">${item.SGSTPercentage}</td>
                    <td class="sgst-amount text-right">${item.SGSTAmount}</td>
                    <td class="total-cost text-right">${item.TotalCost}</td>
                `;
            tbody.appendChild(row);
        }
    });

    datechange(); // Ensure datepicker remains initialized
}

function SetZero(ctrl) {
    if (ctrl.value == "")
    {
        ctrl.value = 0;
    }
}
// Function to add rows dynamically
//function addRowsToTable()
//{
//    let tbody = document.querySelector("#tblItemInformation tbody");
//    tbody.innerHTML = "";  
//    items.forEach(collection => {
//        collection.forEach(item => {
//        let row = document.createElement("tr");
//        row.innerHTML = `
//            <td class="text-center"><div class="cursor-pointer"><img src="../../assets/images/icons/help/close.svg" alt="Remove"></div></td>
//            <td>${item.IndentNo}</td>     
//            <td>${item.ItemCode}</td>          
//            <td>${item.ItemName}</td>
//            <td>${item.ItemDescription}</td>
//            <td>${item.HSN}</td>             
//            <td>
//                <div class="input-group">
//                    <input type="text"  class="datepicker form-control Mandate" value="${ChangeDateFormatToddMMYYYWithSlace(item.DeliveryDate)}" placeholder="DD/MM/YYYY" readonly onchange="HideErrorMessage(this)">
//                    <div class="input-group-append">
//                        <span class="input-group-text bg-white"><img src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span>
//                    </div>
//                    <span  class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
//                </div>
//            </td>
//            <td><input type="number" class="quantity form-control text-right" value="${item.Quantity}"></td>
//            <td>${item.UoM}</td>
//            <td><input type="number" class="unit-price form-control text-right" value="${item.UnitPrice}"></td>
//            <td class="amount-before-discount text-right">${item.AmountBeforeDiscount}</td>
//            <td><input type="number" class="discount  form-control text-right" value="${item.DiscountPercentage}"></td>
//            <td class="amount-after-discount text-right">${item.AmountAfterDiscount}</td>
//            <td class="IGSTPercentage text-right">${item.IGSTPercentage}</td>
//            <td class="igst-amount text-right">${item.IGSTAmount}</td>
//            <td class="CGSTPercentage text-right">${item.CGSTPercentage}</td>
//            <td class="cgst-amount text-right">${item.CGSTAmount}</td>
//            <td class="SGSTPercentage text-right">${item.SGSTPercentage}</td>
//            <td class="sgst-amount text-right">${item.SGSTAmount}</td>
//            <td class="total-cost text-right">${item.TotalCost}</td>
//        `;
//            tbody.appendChild(row);
//            datechange();
//    });
//    });
//}

function updateRowTotals(row) {
    let quantityInput = row.querySelector(".quantity");
    let unitPriceInput = row.querySelector(".unit-price");
    let discountInput = row.querySelector(".discount");

    let amountBeforeDiscountCell = row.querySelector(".amount-before-discount");
    let amountAfterDiscountCell = row.querySelector(".amount-after-discount");
    let igstAmountCell = row.querySelector(".igst-amount");
    let cgstAmountCell = row.querySelector(".cgst-amount");
    let sgstAmountCell = row.querySelector(".sgst-amount");
    let totalCostCell = row.querySelector(".total-cost");

    // Get values
    let quantity = parseFloat(quantityInput.value) || 0;
    let unitPrice = parseFloat(unitPriceInput.value) || 0;
    let discountPercentage = parseFloat(discountInput.value) || 0;

    let igstPercentage = parseFloat(row.querySelector(".IGSTPercentage").innerText) || 0;
    let cgstPercentage = parseFloat(row.querySelector(".CGSTPercentage").innerText) || 0;
    let sgstPercentage = parseFloat(row.querySelector(".SGSTPercentage").innerText) || 0;

    // Step 1: Calculate Amount Before Discount
    let amountBeforeDiscount = quantity * unitPrice;

    // Step 2: Apply Discount
    let discountAmount = (amountBeforeDiscount * discountPercentage) / 100;
    let amountAfterDiscount = amountBeforeDiscount - discountAmount;

    // Step 3: Calculate GST
    let igstAmount = (amountAfterDiscount * igstPercentage) / 100;
    let cgstAmount = (amountAfterDiscount * cgstPercentage) / 100;
    let sgstAmount = (amountAfterDiscount * sgstPercentage) / 100;

    // Step 4: Compute Final Total Cost
    let totalCost = amountAfterDiscount + igstAmount + cgstAmount + sgstAmount;

    // Update table cells
    amountBeforeDiscountCell.textContent = amountBeforeDiscount.toFixed(2);
    amountAfterDiscountCell.textContent = amountAfterDiscount.toFixed(2);
    igstAmountCell.textContent = igstAmount.toFixed(2);
    cgstAmountCell.textContent = cgstAmount.toFixed(2);
    sgstAmountCell.textContent = sgstAmount.toFixed(2);
    totalCostCell.textContent = totalCost.toFixed(2);
}

// Attach event listeners
document.addEventListener("input", function (event) {
    if (
        event.target.classList.contains("quantity") ||
        event.target.classList.contains("unit-price") ||
        event.target.classList.contains("discount")
    ) {
        let row = event.target.closest("tr");
        updateRowTotals(row);
    }
});

function attachRemoveEventListeners() {
    document.querySelectorAll(".remove-row").forEach(button => {
        button.addEventListener("click", function () {
            this.closest("tr").remove();
        });
    });
}

function datechange() {
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
    });

    // Open datepicker when clicking the icon
    $('.input-group-text').on('click', function () {
        $(this).closest('.input-group').find('.datepicker').focus();
    });
}

function updateGrandTotal() {
    let totalBeforeTax = 0, totalIGST = 0, totalCGST = 0, totalSGST = 0;

    document.querySelectorAll("#tblItemInformation tbody tr").forEach(row => {
        totalBeforeTax += parseFloat(row.querySelector(".amount-after-discount").textContent) || 0;
        totalIGST += parseFloat(row.querySelector(".igst-amount").textContent) || 0;
        totalCGST += parseFloat(row.querySelector(".cgst-amount").textContent) || 0;
        totalSGST += parseFloat(row.querySelector(".sgst-amount").textContent) || 0;
    });

    // Get Other Charges
    let otherCharges = parseFloat(document.querySelector(".otherChargesInput")?.text) || 0;

    // Total Tax Calculation
    let totalTax = totalIGST + totalCGST + totalSGST;
    let totalAfterTax = totalBeforeTax + totalTax + otherCharges;

    // Get Rounding Amount
    let roundingAmount = parseFloat(document.querySelector("#roundingAmountInput")?.value) || 0;

    // Final Total
    let grandTotal = totalAfterTax + roundingAmount;

    // Update Values in the Summary Table
    document.querySelector("#totalBeforeTax").textContent = `₹ ${totalBeforeTax.toFixed(2)}`;
    document.querySelector("#igstTotal").textContent = `₹ ${totalIGST.toFixed(2)}`;
    document.querySelector("#cgstTotal").textContent = `₹ ${totalCGST.toFixed(2)}`;
    document.querySelector("#sgstTotal").textContent = `₹ ${totalSGST.toFixed(2)}`;
    document.querySelector("#totalTax").textContent = `₹ ${totalTax.toFixed(2)}`;
    document.querySelector("#totalAfterTax").textContent = `₹ ${totalAfterTax.toFixed(2)}`;
    document.querySelector("#grandTotal").textContent = `₹ ${grandTotal.toFixed(2)}`;
}

// Attach event listeners to update grand total on input changes
document.addEventListener("input", function (event) {
    if (
        event.target.classList.contains("quantity") ||
        event.target.classList.contains("unit-price") ||
        event.target.classList.contains("discount") ||
        event.target.id === "roundingAmountInput" ||
        event.target.id === "otherChargesInput"
    ) {
        updateGrandTotal();
    }
});
