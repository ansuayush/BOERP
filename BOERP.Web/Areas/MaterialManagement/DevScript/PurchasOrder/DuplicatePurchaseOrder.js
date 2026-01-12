$(document).ready(function () {
    LoadItemDropdown();
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
    //LoadMasterDropdown('ddlSalesPerson', {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 12,
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
    }, 'Select', false, 20);

    LoadMasterDropdown('ddlBillTo', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 10,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false, 20);

    

    LoadMasterDropdown('ddlPaymentTerm', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 11,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);

    LoadMasterDropdown('ddlTC', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 15,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);

 

    if ($('#hdnPoId').val() == "0" || $('#hdnPoId').val() == "") {
        var model =
        {
            ID: 0,
            SupplierId: $('#hdnSuppId').val(),
            ModuleId: 2,
            ISDDChange: 0
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {


            var DOC_LOCK = false;
            var tblDoc = response.data.data.Table;
            var tblSeries = response.data.data.Table1;
            var tblSupp = response.data.data.Table2;
            var tblSales = response.data.data.Table4;

            FillSalesPerson(tblSales);

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
    else
    {
        var model =
        {
            POID: $('#hdnPoId').val(),
            IsDuplicate: 'Y',
            ISDDChange: 0
        };
        var DOC_LOCK = false;
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPurchase_101' }, 'GET', function (response) {

            console.log(response);

            var tblDoc = response.data.data.Table;
            var tblItem = response.data.data.Table1;
            var tblOtherCharges = response.data.data.Table3;
            var tblSeries = response.data.data.Table4;
            var newDocNumber = response.data.data.Table5;
            var tblSales = response.data.data.Table6;

            FillSalesPerson(tblSales);


            OtherChargesArray = tblOtherCharges;
            var dt = new Date();
            var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
            $('#txtPODate').val(newDate);       
            $('#lblReqName').text(tblDoc[0].USER_NAME);
            $('#lblReqDept').text(tblDoc[0].Department);

            $("#txtSupName").val(tblDoc[0].PA_NAME);
            $("#lblSuppAdd").text(tblDoc[0].BILL_ADD1);
            $("#lblSuppGST").text(tblDoc[0].GST);
            $('#ddlTC').val(tblDoc[0].TC);
            $('#txtPONumber').val(newDocNumber[0].DocNumber);
            $('#txtComments').val(tblDoc[0].Comments);
            $('#hdnSuppId').val(tblDoc[0].SupplierId);
            $('#ddlSalesPerson').val(tblDoc[0].SalesPersonId);
            $('#ddlshipTo').val(tblDoc[0].ShipToId);
            $('#ddlBillTo').val(tblDoc[0].BillToId);
            $('#ddlPaymentTerm').val(tblDoc[0].PaymentTermId);
            $('#roundingAmountInput').val(tblDoc[0].RoundAmount);
            $('#otherChargesInputData').text(tblDoc[0].Other_Charges);            
            
            BindIndend(tblDoc[0].IndIds);
            var $ele = $('#ddlDocSeries');
            $ele.empty();
            $.each(tblSeries, function (ii, vall) {
                var $option = $('<option />')
                    .val(vall.ID)
                    .text(vall.ValueName);

                // Set 'selected' when DefaultSrID is 1
                if (vall.ID == response.data.data.Table[0].DOCTYPE_ID) {
                    $option.attr("selected", "selected");
                    if (vall.DOC_LOCK == 1) {
                        DOC_LOCK = true;
                    }
                }

                $ele.append($option);

            })
           // $("#ddlDocSeries").prop("disabled", true);

            //$("#txtPONumber").prop("disabled", true);
            if (DOC_LOCK == true) {
                $("#txtPONumber").prop("disabled", true);
            }
            else {
                $("#txtPONumber").prop("disabled", false);
            }
            FillItemData(tblItem);

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
    }
});

 

function BindIndend(data) {
    CommonAjaxMethod(virtualPath + 'Generic/GetDropDownWithAsync/', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 8,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'GET', function (response) {
        var indendData = response.data.data.Table;

        var $ele = $('#ddlIndent');
        $ele.empty();
        $ele.append($('<option/>').val('').text('Select'));
        // Bind options
        $.each(indendData, function (ii, vall) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName);
            $ele.append($option);
        });

        // Destroy and re-init multiselect
        if ($ele.data('multiselect')) {
            $ele.multiselect('destroy');
        }

        $ele.multiselect({
            includeSelectAllOption: true,
            nonSelectedText: 'Select',
            buttonWidth: '100%',
            enableFiltering: true,
            enableCaseInsensitiveFiltering: true
        });

        if (data != '') {
            let indArray = data.split(',').map(x => x.trim());
            $ele.val(indArray);
            $ele.multiselect('rebuild');
        }

    });
}

function FillSalesPerson(d) {
    var $ele = $('#ddlSalesPerson');
    $ele.empty();
    if (d.length > 1) {
        $ele.append($('<option/>').val('Select').text('Select'));
        $.each(d, function (ii, vall) {
            $ele.append($('<option />').val(vall.ID).text(vall.PersonName));
        })
    }
    else {
        $.each(d, function (ii, vall) {
            $ele.append($('<option />').val(vall.ID).text(vall.PersonName));
        })
    }

}


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
var ChargeList = [];
var TaxList = [];

function LoadItemDropdown() {
    var model = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 13,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }
    
    CommonAjaxMethod(virtualPath + 'Generic/GetDropDownWithAsync', model, 'GET', function (response) {

        ChargeList = response.data.data.Table;
        var $ele = $('#ddlCharge_0');
        $ele.empty();
        $ele.append($('<option/>').val('Select').text('Select'));
        $.each(ChargeList, function (ii, vall) {
            $ele.append($('<option />').val(vall.ID).text(vall.ValueName));
        })

        TaxList = response.data.data.Table1;
        var $eleTax = $('#ddlTax_0');
        $eleTax.empty();
        $eleTax.append($('<option/>').val('Select').text('Select'));
        $.each(TaxList, function (ii, vall) {
            $eleTax.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
        })
    });
}

 
function FillItemData(tblDoc)
{  
        items = [];
        tblDoc.forEach(doc => {
            items.push(doc);
        });
        addRowsToTable();
        updateGrandTotal();    
}

function FillGrid(ctr)
{
    var data = $('#' + ctr.id).val().join();
    var model =
    {
        IndentIDs: data,
        POID: 0,
        SupId: $('#hdnSuppId').val(),
        CompanyId: CompId,
        ISDDChange: 1
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
$(document).on("click", ".deleterow", function ()
{
    $(this).closest("tr").remove();
    updateGrandTotal();
});
$(document).on("click", ".deleterowExtra", function () {
    let row = $(this).closest("tr");
    let chargeId = row.find(".ddlChargeName").val().trim(); // Assuming Charge_Id is unique
    if (chargeId != "") {
        // Remove from OtherChargesArray
        OtherChargesArray = OtherChargesArray.filter(item => item.Charge_Id !== chargeId);

        // Remove row from DOM
        row.remove();

        // Optional: update total if needed after deletion
        let totalNetAmountSum = OtherChargesArray.reduce((sum, item) => sum + item.TotalNetAmount, 0);
        $('#otherChargesInputData').text(totalNetAmountSum.toFixed(2));
        updateGrandTotal();
    }
    else {

        $(this).closest("tr").remove();
    }
});
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
            "ID": 0,
            "DOCTYPE_ID": $('#ddlDocSeries').val(),
            "IndentIDs": data,
            "SupplierId": $('#hdnSuppId').val(),
            "TC": $('#ddlTC').val(),
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
            "PurchaseOrdersOtherCharges": OtherChargesArray
        }

        const jsonString = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "MaterialPurchase_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput!=0)
            {            
                setTimeout(function () {
                    RedirectPOList();
                }, 3000); // 3000 milliseconds = 3 seconds
               
            }
        });
    }
}
function RedirectPOList()
{
    var url = "/MaterialManagement/Material/PurchaseOrderIndex?auth=" + AuthToken ;
    window.location.href = url;
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
function validateDiscount(input) {
    let value = parseFloat(input.value) || 0;

    if (value > 100) {
        alert("Discount cannot be more than 100%");
        input.value = 100;
    } else if (value < 0) {
        alert("Discount cannot be negative");
        input.value = 0;
    }
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
                    <td class="text-center"><span style="display:none;"  class="IndentItemId">${item.ID}</span><span style="display:none;"  class="ItemID">${item.ItemID}</span><span style="display:none;"  class="POItemId">${item.POItemId}</span><div class="deleterow cursor-pointer"><img src="../../assets/images/icons/help/close.svg" alt="Remove"></div></td>
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
                    <td><input type="number"  step="0.01"  class="quantity form-control text-right" value="${item.Quantity}" onchange="SetZero(this)"></td>
                    <td>${item.UoM}</td>
                    <td><input type="number" class="unit-price form-control text-right" value="${item.UnitPrice}" onchange="SetZero(this)" ></td>
                    <td class="amount-before-discount text-right">${item.AmountBeforeDiscount}</td>
                    <td><input type="number" class="discount form-control text-right" value="${item.DiscountPercentage}" onchange="SetZero(this)" oninput="validateDiscount(this)"></td>
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
    let val = parseFloat(ctrl.value);
    console.log(`Input value: ${val}`);

    if (isNaN(val) || val < 0) {
        ctrl.value = '';
        return;
    }

    const decimalPart = ctrl.value.split('.')[1];
    if (decimalPart && decimalPart.length > 2) {
        // Floor to 2 decimal places
        val = Math.floor(val * 100) / 100;
        ctrl.value = val.toString();
    }
}
function updateOCTotals(row)
{  
    let taxDDl = row.querySelector(".taxDdl");
    var tax = $('#' + taxDDl.id + ' option[value="' + taxDDl.value + '"]').attr("dataEle")
    let roundingAmount = parseFloat(tax) || 0;
    let taxAmount = row.querySelector(".TaxAmount");
    taxAmount.textContent = roundingAmount.toFixed(2);
    let chargeAmount = row.querySelector(".ChargeAmount");   
    let totalOtherChargeAmount = row.querySelector(".TotalOtherChargeAmount");  

    // Get values
    let cAmount = parseFloat(chargeAmount.value) || 0;   
    let discountAmount = (cAmount * roundingAmount) / 100; 
    let amountBeforeDiscount = cAmount + discountAmount;
    totalOtherChargeAmount.textContent = amountBeforeDiscount.toFixed(2);
   
}

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
    )
    {
        let row = event.target.closest("tr");
        updateRowTotals(row);
    }

    if
        (
        event.target.classList.contains("ChargeAmount") ||
        event.target.classList.contains("TaxAmount") ||
        event.target.classList.contains("TotalOtherChargeAmount") ||
        event.target.classList.contains("taxDdl")
    )
    {
        let row = event.target.closest("tr");
        updateOCTotals(row);
    }

});

function attachRemoveEventListeners() {
    document.querySelectorAll(".remove-row").forEach(button => {
        button.addEventListener("click", function () {
            this.closest("tr").remove();
        });
    });
}
var OtherChargesArray = [];
var IsOtherCharge = true;
function SaveOtherCharges() {
    if (checkValidationOnSubmit('OMandate') == true) {
        IsOtherCharge = true;
        let tableRows = document.querySelectorAll("#tblOtherCharge tbody tr");
        tableRows.forEach(row => {
            let chargeId = parseInt(row.querySelector(".ddlChargeName").value.trim()); // Use .value instead of .val()
            let hdnOtherNew = row.querySelector(".hdnOtherNew").innerText.trim();

            if (hdnOtherNew == "0") {
                let existingIndex = OtherChargesArray.findIndex(x => x.Charge_Id === chargeId);
                if (existingIndex !== -1) {
                    IsOtherCharge = false;
                    alert("Duplicate charge found.");
                    return;
                }
                else {
                    row.querySelector(".hdnOtherNew").innerText = "1";
                    let item =
                    {
                        ID: row.querySelector(".hdnOtherChargeId").innerText.trim(),
                        Charge_Id: chargeId,
                        Tax_ID: row.querySelector(".taxDdl").value.trim(),
                        ChargeAmount: row.querySelector(".ChargeAmount").value.trim(),
                        TotalTax: row.querySelector(".TaxAmount").value.trim(),
                        TotalNetAmount: parseFloat(row.querySelector(".TotalOtherChargeAmount").innerText.trim()) || 0
                    };
                    OtherChargesArray.push(item);
                }
            }
            else {
                row.querySelector(".hdnOtherNew").innerText = "1";
                let item =
                {
                    ID: row.querySelector(".hdnOtherChargeId").innerText.trim(),
                    Charge_Id: chargeId,
                    Tax_ID: row.querySelector(".taxDdl").value.trim(),
                    ChargeAmount: row.querySelector(".ChargeAmount").value.trim(),
                    TotalTax: row.querySelector(".TaxAmount").value.trim(),
                    TotalNetAmount: parseFloat(row.querySelector(".TotalOtherChargeAmount").innerText.trim()) || 0
                };
                let existingIndex = OtherChargesArray.findIndex(x => x.Charge_Id === chargeId);
                if (existingIndex !== -1) {
                    // Update existing item
                    OtherChargesArray[existingIndex] = item;
                }
                else {
                    // Add new item
                    OtherChargesArray.push(item);
                }
            }
        });
        if (IsOtherCharge) {

            $('#btnPopupClose').trigger("click");
            let totalNetAmountSum = OtherChargesArray.reduce((sum, item) => sum + item.TotalNetAmount, 0);
            $('#otherChargesInputData').text(totalNetAmountSum.toFixed(2));
            updateGrandTotal();
        }
    }
}
function RefreshData()
{
   
    let tableBody = document.getElementById("tableToModify");
    let firstRow = tableBody.querySelector("tr:first-child"); // Get first row

    // Clear input fields in the first row
    firstRow.querySelectorAll("input, select").forEach(element =>
    {
        if (element.tagName === "INPUT")
        {
            element.value = "";
        }
        else if (element.tagName === "SELECT")
        {
            if (element.id == "ddlCharge_0") {
                //element.selectedIndex = 0; // Reset dropdowns
                var $ddlCharge = $('#ddlCharge_0');
                $ddlCharge.empty();
                $ddlCharge.append($('<option/>').val('Select').text('Select'));
                $.each(ChargeList, function (ii, vall) {
                    $ddlCharge.append($('<option />').val(vall.ID).text(vall.ValueName));
                })
            }
            if (element.id == "ddlTax_0") {
                var $ddlTax = $('#ddlTax_0');
                $ddlTax.empty();
                $ddlTax.append($('<option/>').val('Select').text('Select'));
                $.each(TaxList, function (ii, vall) {
                    $ddlTax.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
                })
            }
        }
    });

    //Bind First Row From Json

    tableBody.innerHTML = ""; // Clear all rows
    tableBody.appendChild(firstRow); // Add the first row back with cleared inputs

    // Add new rows from JSON data
    OtherChargesArray.forEach((item, RowId) =>
    {
        if (RowId == 0)
        {
            $('#ddlCharge_0').val(item.Charge_Id);
            $('#ddlTax_0').val(item.Tax_ID);
            $('#hdnOtherChargeId_0').text(item.ID);
            $('#txtChargeAmount_0').val(item.ChargeAmount);
            $('#txtTax_0').val(item.TotalTax);
            $('#spTotalOtherCharge_0').text(item.TotalNetAmount);       
            $('#hdnOtherNew_0').text("1");       
        }
        else {
            let newRow = `
            <tr>
                <td>
                    <div class="deleterowExtra text-center cursor-pointer">
                        <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
                         <span style="display:none;" id="hdnOtherChargeId_${RowId}" class="hdnOtherChargeId">value="${item.ID}" </span>
                         <span style="display:none;" id="hdnOtherNew_${RowId}" class="hdnOtherNew">1</span>
                  </div>
                </td>
                <td>
                    <select class="form-control applyselect ddlChargeName OMandate" id="ddlCharge_${RowId}" onchange="HideErrorMessage(this)">
					 
				    </select>
                    <span id="spddlCharge_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

                </td>
				<td>
                     <input type="number" value="${item.ChargeAmount}" id="txtChargeAmount_${RowId}" class="form-control text-right ChargeAmount OMandate" value="" placeholder="0" onchange="HideErrorMessage(this);SetZero(this)">
                                                                <span id="sptxtChargeAmount_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </td>
				<td>
                    <select class="form-control applyselect taxDdl OMandate" id="ddlTax_${RowId}" onchange="HideErrorMessage(this);GetTax(this)">
                                                <option>Select</option>
                                            </select>
                                            <span id="spddlTax_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

                    </td>
				                    <td>
                     <input placeholder="0" type="text" value="${item.TotalTax}" id="txtTax_${RowId}" class="form-control text-right TaxAmount" fdprocessedid="5nb56" disabled>
                    </td>
				
				<td class="text-right"><span class="TotalOtherChargeAmount"  id="spTotalOtherCharge_${RowId}">${item.TotalNetAmount}</span></td>
            </tr>`;
          //  tableBody.innerHTML += newRow;
            // Append new row
            $(".othercharnge tbody").append(newRow);

            // Re-initialize select2 for newly added element
            $(".othercharnge tbody tr:last .applyselect").select2();

            // Re-initialize tooltip for newly added elements
            $(".othercharnge tbody tr:last [data-toggle='tooltip']").tooltip();

            var $ddlChargeR = $('#ddlCharge_' + RowId);
            $ddlChargeR.empty();
            $ddlChargeR.append($('<option/>').val('Select').text('Select'));
            $.each(ChargeList, function (ii, vall)
            {
                $ddlChargeR.append($('<option />').val(vall.ID).text(vall.ValueName));                
            })
            $ddlChargeR.val(item.Charge_Id);

            var $ddlTaxR = $('#ddlTax_' + RowId);
            $ddlTaxR.empty();
            $ddlTaxR.append($('<option/>').val('Select').text('Select'));
            $.each(TaxList, function (ii, vall) {
                $ddlTaxR.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
            })
            $ddlTaxR.val(item.Tax_ID);
        }
    });
}


function GetTax(ctr)
{
    var id = ctr.id.split('_');
    var tax = $('#' + ctr.id + ' option[value="' + ctr.value + '"]').attr("dataEle")
    let roundingAmount = parseFloat(tax) || 0;  
    var  ChargeAmt = $("#txtChargeAmount_" + id[1]).val();   
    let cAmount = parseFloat(ChargeAmt) || 0;
    let discountAmount = (cAmount * roundingAmount) / 100;
    let amountBeforeDiscount = cAmount + discountAmount;    
    $("#txtTax_" + id[1]).val(discountAmount).trigger('Change'); 
    $("#spTotalOtherCharge_" + id[1]).text(amountBeforeDiscount.toFixed(2))
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
    let otherCharges = parseFloat(document.querySelector(".otherChargesInput")?.innerText) || 0;
     document.querySelector(".otherChargesInput").innerText = `₹ ${otherCharges.toFixed(2)}`;
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
// Preview the file based on its type
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
                        <img src="~${fileUrl}" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
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
                        <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages").appendChild(newDocument);
}
