$(document).ready(function () {
    LoadItemDropdown();
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
    var model =
    {
        ID: Ids,
        PORId: Id,
        CompanyId: CompId
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'CreateDebitNote_100' }, 'GET', function (response) {

        console.log(response);

        var grnItems = response.data.data.Table;
        var grnOrder = response.data.data.Table1;
        var grnSeries = response.data.data.Table2;
        IsIGST = grnOrder[0].IsSameCompanyLocation;
        SeriesBind(grnSeries);
        if (parseInt(Id) > 0) {
            var otherCharges = response.data.data.Table3;
            OtherChargesArray = otherCharges;
            $('#ddlDocSeries').val(grnOrder[0].Docseries).trigger('change');
            document.getElementById('totalBeforeTax').innerText = grnOrder[0].Total_Before_Tax;
            document.getElementById('otherChargesInputData').innerText = 0;
            document.getElementById('igstTotal').innerText = grnOrder[0].IGST;
            document.getElementById('cgstTotal').innerText = grnOrder[0].CGST;
            document.getElementById('sgstTotal').innerText = grnOrder[0].SGST;
            document.getElementById('totalTax').innerText = grnOrder[0].TotalTax;
            document.getElementById('totalAfterTax').innerText = grnOrder[0].Total_After_Tax - grnOrder[0].Other_Charges;
            $('#roundingAmountInput').val(grnOrder[0].RoundAmount);
            $('#otherChargesInputData').text(grnOrder[0].Other_Charges);
            $('#txtDebitNoteNumber').val(grnOrder[0].DocNumber);           
            $('#txtDate').val(ChangeDateFormatToddMMYYYWithSlace(grnOrder[0].DOCDate));
            if (grnOrder[0].Status == 1) {
                $('#btnApprovalAction1').show();
                $('#btnApprovalAction2').show();
            }   

        }
        else
        {
            //document.getElementById('grandTotal').innerText = grnOrder[0].TotalAmount - grnOrder[0].Other_Charges;
            var dt = new Date();
            var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
            $('#txtDate').val(newDate);
        }
       
        
        $('#txtCompanyName').val(grnOrder[0].PA_NAME);
        $('#hddSupplierId').val(grnOrder[0].SupplierId);
        $('#hddPOIDs').val(grnOrder[0].PoIDs);
        $('#hddDocNo').val(grnOrder[0].DocNumber);
        $('#hddGateEntryId').val(grnOrder[0].GateEntryId);
       
        BindTable(grnItems);
        updateGrandTotal();
        RefreshData();
    })


    
})


function OtherChargeShow() {
    $('#othercharge').modal('show');
}

$(document).on("click", ".deleterow", function () {
    let row = $(this).closest("tr");
    // Remove row from DOM
    row.remove();

    // Recalculate totals
    updateGrandTotal();
});
function SetDocNumber(ctrl) {
    var model =
    {
        ID: ctrl.value,
        SupplierId: 0,
        ModuleId: 5
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {
        var tblDoc = response.data.data.Table;
        $('#txtDebitNoteNumber').val(tblDoc[0].DocNumber);
        if (tblDoc[0].DOC_LOCK == 1) {
            $("#txtDebitNoteNumber").prop("disabled", true);
        }
        else {
            $("#txtDebitNoteNumber").prop("disabled", false);
        }


    });
}
function BindTable(itemList) {
    // Clear existing table rows
    $("#tblReturnItems").empty();

    // Dynamically create rows
    itemList.forEach(function (item, index) {
        var row = `<tr>
       
        <td id="docNumber_${index}">${item.DocNo}</td>
        <td id="itemCode_${index}">${item.ItemCode}</td>
        <td id="itemName_${index}">${item.ItemName}</td>
        <td id="rejectedQty_${index}">${item.RejectedQty}</td>      
        <td id="Status_${index}">${item.Status}</td>
        <td><input type="number" disabled   onchange="SetZeroQ(this)" class="form-control issueQty" id="issueQty_${index}" value="${item.IssueQty}" /></td>
        
        <td id="uom_${index}">${item.UoM}</td>
        <td><input type="number" class="form-control unit-price" onchange="SetZeroQ(this)" id="unitPrice_${index}" value="${item.UnitPrice}" /></td>
        <td style="text-align: right;" class="amount-before-discount" id="amountBeforeDiscount_${index}">${item.AmountBeforeDiscount}</td>
        <td><input type="number" class="form-control discount" disabled onchange="SetZeroQ(this)" id="discountPercent_${index}" value="${item.DiscountPercentage}" /></td>
        <td style="text-align: right;" class="amount-after-discount" id="amountAfterDiscount_${index}">${item.AmountAfterDiscount}</td>
        <td><input type="number" disabled class="IGSTPercentage form-control" id="igstPercent_${index}" value="${item.IGSTPercentage}" /></td>
        <td style="text-align: right;" class="igst-amount" id="igstAmount_${index}">${item.IGSTAmount}</td>
        <td><input type="number" class="CGSTPercentage form-control" id="cgstPercent_${index}" value="${item.CGSTPercentage}" disabled /></td>
        <td style="text-align: right;" class="cgst-amount" id="cgstAmount_${index}">${item.CGSTAmount}</td>
        <td><input type="number" class="SGSTPercentage form-control" id="sgstPercent_${index}" value="${item.SGSTPercentage}"  disabled/></td>
        <td style="text-align: right;" class="sgst-amount" id="sgstAmount_${index}">${item.SGSTAmount}</td>
        <td style="text-align: right;" class="total-cost" id="total_${index}">${item.TotalCost}</td>
        <td style="display:none; text-align: right;" id="grnItemId_${index}">${item.GRNItemId}</td>
        <td style="display:none; text-align: right;" id="grnNo_${index}">${item.GrnNo}</td>
        <td style="display:none; text-align: right;" id="itemID_${index}">${item.ItemID}</td>
        <td style="display:none; text-align: right;" id="grnId_${index}">${item.GRNId}</td>
        <td style="display:none; text-align: right;" id="poItemId_${index}">${item.PoItemId}</td>
        <td style="display:none; text-align: right;" id="itemDescription_${index}">${item.ItemDescription}</td>
        <td style="display:none; text-align: right;" id="deliveryDate_${index}">${item.DeliveryDate}</td>
        <td style="display:none; text-align: right;" id="hsn_${index}">${item.HSN}</td>
        <td style="display:none; text-align: right;" id="quantity_${index}">${item.Quantity}</td>
        <td style="display:none; text-align: right;" id="balancedQty_${index}">${item.BalancedQty}</td>
        <td style="display:none; text-align: right;" id="adj_QTY_${index}">${item.ADJ_QTY}</td>
        <td style="display:none; text-align: right;" id="adj_QTY1_${index}">${item.ADJ_QTY1}</td>
        <td style="display:none; text-align: right;" id="adj_QTY2_${index}">${item.ADJ_QTY2}</td>
        <td style="display:none; text-align: right;" id="qtyReceived_${index}">${item.QtyReceived}</td>
        <td style="display:none; text-align: right;" id="qtyDamage_${index}">${item.QtyDamage}</td>
        <td style="display:none; text-align: right;" id="qtyShort_${index}">${item.QtyShort}</td>
        <td style="display:none; text-align: right;" id="qtyRemaning_${index}">${item.QtyRemaning}</td>
        <td style="display:none; text-align: right;" id="discountAmount_${index}">${item.DiscountAmount}</td>
        <td style="display:none; text-align: right;" id="fin_${index}">${item.FinID}</td>
        <td style="display:none; text-align: right;" id="batchOrLot_${index}">${item.BatchOrLot}</td>
        <td style="display:none; text-align: right;" id="expdate_${index}">${item.ExpDate}</td>
        <td style="display:none; text-align: right;" id="mfgDate_${index}">${item.MFGDate}</td>
        <td style="display:none; text-align: right;" id="warehouseID_${index}">${item.WarehouseID}</td>
        <td style="display:none; text-align: right;" id="damgedWarehouseID_${index}">${item.DamgedWarehouseID}</td>
        <td style="display:none; text-align: right;" id="shortWarehouseID_${index}">${item.ShortWarehouseID}</td>
       
    </tr>`;

        $("#tblReturnItems").append(row);
       
    });
    updateRowTotals();
}

function updateRowTotals()
{
    document.querySelectorAll("#tblItemInformation tbody tr").forEach(row => {
   
    let quantityInput = row.querySelector(".issueQty");
    //let quantityInputD = row.querySelector(".quantityD");
    //let quantityInputS = row.querySelector(".quantityS");
    let unitPriceInput = row.querySelector(".unit-price");
    let discountInput = row.querySelector(".discount");

    //let quantityD = parseFloat(quantityInputD.value) || 0;
    //let quantityS = parseFloat(quantityInputS.value) || 0;

    let amountBeforeDiscountCell = row.querySelector(".amount-before-discount");
    let amountAfterDiscountCell = row.querySelector(".amount-after-discount");
    let igstAmountCell = row.querySelector(".igst-amount");
    let cgstAmountCell = row.querySelector(".cgst-amount");
    let sgstAmountCell = row.querySelector(".sgst-amount");
    let totalCostCell = row.querySelector(".total-cost");

    // Get values
    let quantity = parseFloat(quantityInput.value) || 0;
    // quantity = quantity - (quantityD + quantityS);
    let unitPrice = parseFloat(unitPriceInput.value) || 0;
    let discountPercentage = parseFloat(discountInput.value) || 0;

        let igstPercentage = parseFloat(row.querySelector(".IGSTPercentage").value) || 0;
        let cgstPercentage = parseFloat(row.querySelector(".CGSTPercentage").value) || 0;
        let sgstPercentage = parseFloat(row.querySelector(".SGSTPercentage").value) || 0;

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
    });
}
function SetZeroQ(ctrl) {
    if (ctrl.value === "") ctrl.value = '';

    let row = ctrl.closest("tr");
    
    let receivedInput = row.querySelector(".issueQty");
    
    let received = parseFloat(receivedInput.value) || 0; 
   

    let originalQty = parseFloat(row.cells[4].textContent) || 0; // assuming Quantity is in cell index 8


    // If user changes Received quantity
    if (ctrl.classList.contains("issueQty"))
    {
        if (received > originalQty)
        {
            FailToaster("Issue quantity cannot be greater than ordered quantity.");
        }
        else
        {
            // Recalculate totals
            updateRowTotals(row);
            updateGrandTotal();
        }
    }
   
    // If user changes Received quantity
    if (ctrl.classList.contains("unit-price"))
    {
        updateRowTotals(row);
        updateGrandTotal();
    }
    // If user changes Received quantity
    if (ctrl.classList.contains("discount")) {
        updateRowTotals(row);
        updateGrandTotal();
    }
   
}
 
function onchangeDiscount(ctrl) {
    var discountPercent = $('#' + ctrl.id).val();
    var amountBeforeDiscount = document.getElementById('amountBeforeDiscount_' + ctrl.id.split('_')[1]).innerText;
    discountPercent = discountPercent == undefined || discountPercent == "" ? 0 : discountPercent;
    amountBeforeDiscount = amountBeforeDiscount == undefined || amountBeforeDiscount == "" ? 0 : amountBeforeDiscount;
    var actualPercent = parseFloat(amountBeforeDiscount)*(100 - parseFloat(discountPercent))/100;
    document.getElementById('amountAfterDiscount_' + ctrl.id.split('_')[1]).innerText = actualPercent;
}
function SeriesBind(tblSeries) {
    var $ele = $('#ddlDocSeries');
    $ele.empty();
    $.each(tblSeries, function (ii, vall) {
        var $option = $('<option />')
            .val(vall.ID)
            .text(vall.ValueName);

        // Set 'selected' when DefaultSrID is 1
        if (vall.DEFAULT_DOC == true) {
            $option.attr("selected", "selected");
            $('#txtDebitNoteNumber').val(vall.START_NO)
            if (vall.DOC_LOCK == 1) {
                DOC_LOCK = true;
            }
        }
        $ele.append($option);
    })
}
function POReturnSubmit() {
    let purchaseOrderItems = [];

    // Loop through each row
    $('#tblReturnItems tr').each(function (index, row) {
        var item = {
            PORItemId: 0,
            GRNItemId: $(row).find('td[id^="grnItemId_"]').text(),
            GRNNo: $(row).find('td[id^="grnNo_"]').text(),
            ItemID: $(row).find('td[id^="itemID_"]').text(),
            PoItemId: $(row).find('td[id^="poItemId_"]').text(),
            ItemCode: $(row).find('td[id^="itemCode_"]').text(),
            ItemName: $(row).find('td[id^="itemName_"]').text(),
            ItemDescription: $(row).find('td[id^="itemDescription_"]').text(),
            DeliveryDate: ChangeDateFormatSecond($(row).find('td[id^="deliveryDate_"]').text()),
            HSN: $(row).find('td[id^="hsn_"]').text(),
            Quantity: $(row).find('td[id^="quantity_"]').text(),
            BalancedQty: $(row).find('td[id^="balancedQty_"]').text(),
            ADJ_QTY: $(row).find('td[id^="adj_QTY_"]').text(),
            ADJ_QTY1: $(row).find('td[id^="adj_QTY1_"]').text(),
            ADJ_QTY2: $(row).find('td[id^="adj_QTY2_"]').text(),
            QtyReceived: $(row).find('td[id^="qtyReceived_"]').text(),
            QtyDamage: $(row).find('td[id^="qtyDamage_"]').text(),
            QtyShort: $(row).find('td[id^="qtyShort_"]').text(),
            QtyRemaning: $(row).find('td[id^="qtyRemaning_"]').text(),
            UOM: $(row).find('td[id^="uom_"]').text(),
            UnitPrice: $(row).find('input[id^="unitPrice_"]').val(),
            AmountBeforeDiscount: $(row).find('td[id^="amountBeforeDiscount_"]').text(),
            DiscountPercentage: $(row).find('input[id^="discountPercent_"]').val(),
            AmountAfterDiscount: $(row).find('td[id^="amountAfterDiscount_"]').text(),
            IGSTPercentage: $(row).find('input[id^="igstPercent_"]').val(),
            IGSTAmount: $(row).find('td[id^="igstAmount_"]').text(),
            CGSTPercentage: $(row).find('input[id^="cgstPercent_"]').val(),
            CGSTAmount: $(row).find('td[id^="cgstAmount_"]').text(),
            SGSTPercentage: $(row).find('input[id^="sgstPercent_"]').val(),
            SGSTAmount: $(row).find('td[id^="sgstAmount_"]').text(),
            TotalCost: $(row).find('td[id^="total_"]').text(),
            FinID: $(row).find('td[id^="fin_"]').text(),
            BatchOrLot: $(row).find('td[id^="batchOrLot_"]').text(),
            ExpDate: ChangeDateFormatSecond($(row).find('td[id^="expdate_"]').text()),
            MFGDate: ChangeDateFormatSecond($(row).find('td[id^="mfgDate_"]').text()),
            WarehouseID: $(row).find('td[id^="warehouseID_"]').text(),
            DamgedWarehouseID: $(row).find('td[id^="damgedWarehouseID_"]').text(),
            ShortWarehouseID: $(row).find('td[id^="shortWarehouseID_"]').text(),
            IssueQty: $(row).find('input[id^="issueQty_"]').val(),
            Status: $(row).find('td[id^="Status_"]').text()
        };
        purchaseOrderItems.push(item);
    });

    var model = {
        PORID: 0,
        DOCTYPE_ID: parseInt($('#ddlDocSeries').val()),
        DocNo: $('#hddDocNo').val(),                      // int
        DebitNoteNumber: $('#txtDebitNoteNumber').val(),
        DebitNoteDate: ChangeDateFormatSecond($('#txtDate').val()),
        CompanyName: $('#txtCompanyName').val(),
        RoundAmount: parseFloat($('#roundingAmountInput').val()),
        TotalAmount: parseFloat($('#grandTotal').text().replace(/₹/g, '').trim()),              // decimal(18,2)
        Total_Before_Tax: parseFloat($('#totalBeforeTax').text().replace(/₹/g, '').trim()),     // decimal(18,2)
        Total_After_Tax: parseFloat($('#totalAfterTax').text().replace(/₹/g, '').trim()),       // decimal(18,2)
        Other_Charges: parseFloat($('#otherChargesInputData').text().replace(/₹/g, '').trim()),     // decimal(18,2)
        IGST: parseFloat($('#igstTotal').text().replace(/₹/g, '').trim()),                       // decimal(18,2)
        CGST: parseFloat($('#cgstTotal').text().replace(/₹/g, '').trim()),                       // decimal(18,2)
        SGST: parseFloat($('#sgstTotal').text().replace(/₹/g, '').trim()),                       // decimal(18,2)
        TotalTax: parseFloat($('#totalTax').text().replace(/₹/g, '').trim()),                    // decimal(18,2)
        FinID: 0,                                                                        // int
        SupplierId: $('#hddSupplierId').val(),
        GateEntryId: $('#hddGateEntryId').val(),
        PoIDs: $('#hddPOIDs').val(),
        PurchaseOrderReturnItems: purchaseOrderItems,
        PurchaseOrdersOtherReturnCharges: OtherChargesArray
    };

    const jsonString = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "CreateDebitNote_100",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };
    if (purchaseOrderItems.length > 0) {
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput != 0) {
                setTimeout(function () {
                    window.location.href = '/MaterialManagement/Material/DebitNote?auth=' + auth;
                }, 3000); // 3000 milliseconds = 3 seconds
            }
        });
    }
    else {
        FailToaster("Atleast one line item should be available .");
    }
}
function POReturnCancle() {
    window.location.href = '/MaterialManagement/Material/PurchaseReturnsApproval?auth=' + auth;
}
function BackToList() {
    window.location.href = '/MaterialManagement/Material/PurchaseReturnsApproval?auth=' + auth;
}
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

function setNARRCharges(ctrl) {
    var id = ctrl.id.split('_')[1];

    if ($('#' + ctrl.id).val() > 0) {

        var model =
        {
            SupId: $('#' + ctrl.id).val(),
            ISDDChange: 2
        };


        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'GRNEntry_101' }, 'GET', function (response) {
            var tblDoc = response.data.data.Table;

            if (tblDoc.length > 1) {

                const IgstCharge_Id = tblDoc.filter(input => input.FIELD_NAME == 'IGST')
                const CgstCharge_Id = tblDoc.filter(input => input.FIELD_NAME == 'CGST')
                const SgstCharge_Id = tblDoc.filter(input => input.FIELD_NAME == 'SGST')

                if (IsIGST == 0) {
                    $('#ddlTax_' + id).val(IgstCharge_Id[0].CHARGE_ID).trigger('change');
                }
                else {
                    $('#ddlCTax_' + id).val(CgstCharge_Id[0].CHARGE_ID).trigger('change');
                    $('#ddlSTax_' + id).val(SgstCharge_Id[0].CHARGE_ID).trigger('change');
                }
            }

            console.log(tblDoc);
        });
    }
}

function GetTax(ctr) {



    var id = ctr.id.split('_');

    let roundingAmount = 0;

    var extraroundingAmount = 0;

    if (id[0] == 'txtChargeAmount') {
        if (IsIGST == 0) {
            const extValue = $('#ddlTax_' + id[1]).val();

            const extratax = $('#ddlTax_' + id[1] + ' option[value="' + extValue + '"]').attr("dataEle");

            roundingAmount = parseFloat(extratax) || 0;

        }
        else {

            const extValue1 = $('#ddlSTax_' + id[1]).val();

            const extratax1 = $('#ddlSTax_' + id[1] + ' option[value="' + extValue1 + '"]').attr("dataEle");

            extraroundingAmount += parseFloat(extratax1) || 0;

            const extValue2 = $('#ddlCTax_' + id[1]).val();

            const extratax2 = $('#ddlCTax_' + id[1] + ' option[value="' + extValue2 + '"]').attr("dataEle");

            extraroundingAmount += parseFloat(extratax2) || 0;

        }
    }

    else {
        var tax = $('#' + ctr.id + ' option[value="' + ctr.value + '"]').attr("dataEle");

        roundingAmount = parseFloat(tax) || 0;



        if (id[0] == 'ddlCTax' || id[0] == 'ddlSTax') {
            if (id[0] == 'ddlCTax') {

                const extValue = $('#ddlSTax_' + id[1]).val();

                const extratax = $('#ddlSTax_' + id[1] + ' option[value="' + extValue + '"]').attr("dataEle");

                extraroundingAmount = parseFloat(extratax) || 0;
            }
            else if (id[0] == 'ddlSTax') {


                const extValue = $('#ddlCTax_' + id[1]).val();

                const extratax = $('#ddlCTax_' + id[1] + ' option[value="' + extValue + '"]').attr("dataEle");

                extraroundingAmount = parseFloat(extratax) || 0;
            }

        }
    }

    roundingAmount += extraroundingAmount;

    var ChargeAmt = $("#txtChargeAmount_" + id[1]).val();
    let cAmount = parseFloat(ChargeAmt) || 0;
    let discountAmount = (cAmount * roundingAmount) / 100;
    let amountBeforeDiscount = cAmount + discountAmount;
    $("#txtTax_" + id[1]).val(discountAmount).trigger('Change');
    console.log(amountBeforeDiscount.toFixed(2));
    $("#spTotalOtherCharge_" + id[1]).text(amountBeforeDiscount.toFixed(2));
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
                    FailToaster("Duplicate charge found.");
                    return;
                }
                else {
                    row.querySelector(".hdnOtherNew").innerText = "1";
                    let item =
                    {
                        ID: row.querySelector(".hdnOtherChargeId").innerText.trim(),
                        Charge_Id: chargeId,
                        IGST_TaxID: IsIGST == 0 ? row.querySelector(".taxDdl").value.trim() : 0,
                        CGST_TaxID: IsIGST == 0 ? 0 : row.querySelector(".taxCDdl").value.trim(),
                        SGST_TaxID: IsIGST == 0 ? 0 : row.querySelector(".taxSDdl").value.trim(),
                        ChargeAmount: row.querySelector(".ChargeAmount").value.trim(),
                        TotalTax: row.querySelector(".TaxAmount").value.trim(),
                        TotalNetAmount: parseFloat(row.querySelector(".ChargeAmount").value.trim()) + parseFloat(row.querySelector(".TaxAmount").value.trim()) || 0
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
                    IGST_TaxID: IsIGST == 0 ? row.querySelector(".taxDdl").value.trim() : 0,
                    CGST_TaxID: IsIGST == 0 ? 0 : row.querySelector(".taxCDdl").value.trim(),
                    SGST_TaxID: IsIGST == 0 ? 0 : row.querySelector(".taxSDdl").value.trim(),
                    ChargeAmount: row.querySelector(".ChargeAmount").value.trim(),
                    TotalTax: row.querySelector(".TaxAmount").value.trim(),
                    TotalNetAmount: parseFloat(row.querySelector(".ChargeAmount").value.trim()) + parseFloat(row.querySelector(".TaxAmount").value.trim()) || 0
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
function updateGrandTotal() {
    let totalBeforeTax = 0, totalIGST = 0, totalCGST = 0, totalSGST = 0;

    document.querySelectorAll("#tblItemInformation tbody tr").forEach(row => {

        totalBeforeTax += parseFloat(row.querySelector(".amount-after-discount").textContent) || 0;
        totalIGST += parseFloat(row.querySelector(".igst-amount").textContent) || 0;
        totalCGST += parseFloat(row.querySelector(".cgst-amount").textContent) || 0;
        totalSGST += parseFloat(row.querySelector(".sgst-amount").textContent) || 0;
    });

    // Get Other Charges
    let otherCharges = 0;
    OtherChargesArray.forEach(item => {
        otherCharges += parseFloat(item.ChargeAmount) || 0;

        if (IsIGST == 0) {
            totalIGST += parseFloat(item.TotalTax);
        }
        else {
            const cgstTax = TaxList.find(input => input.ID == item.CGST_TaxID).ValueCode;

            totalCGST += parseFloat(item.ChargeAmount * parseFloat(cgstTax) / 100);

            const sgstTax = TaxList.find(input => input.ID == item.SGST_TaxID).ValueCode

            totalSGST += parseFloat(item.ChargeAmount * parseFloat(sgstTax) / 100);




        }

    });

    // Total Tax Calculation
    let totalTax = totalIGST + totalCGST + totalSGST;
    let totalAfterTax = totalBeforeTax + totalTax + otherCharges;

    // Get Rounding Amount
    let roundingAmount = parseFloat(document.querySelector("#roundingAmountInput")?.value) || 0;
    document.querySelector(".otherChargesInput").innerText = `₹ ${otherCharges.toFixed(2)}`;
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
function RefreshData() {

    let tableBody = document.getElementById("tableToModify");
    let firstRow = tableBody.querySelector("tr:first-child"); // Get first row

    if (OtherChargesArray.length == 0) {
        $('#other').hide();
    }

    // Clear input fields in the first row
    firstRow.querySelectorAll("input, select").forEach(element => {
        if (element.tagName === "INPUT") {
            element.value = "";
        }
        else if (element.tagName === "SELECT") {
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
                IGSTTaxList = TaxList.filter(input => input.FIELD_NAME == 'IGST')
                $ddlTax.empty();
                $ddlTax.append($('<option/>').val('Select').text('Select'));
                $.each(IGSTTaxList, function (ii, vall) {
                    $ddlTax.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
                })
            }
            if (element.id == "ddlCTax_0") {

                var $ddlTax = $('#ddlCTax_0');
                IGSTTaxList = TaxList.filter(input => input.FIELD_NAME == 'CGST')
                $ddlTax.empty();
                $ddlTax.append($('<option/>').val('Select').text('Select'));
                $.each(IGSTTaxList, function (ii, vall) {
                    $ddlTax.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
                })
            }
            if (element.id == "ddlSTax_0") {

                var $ddlTax = $('#ddlSTax_0');
                IGSTTaxList = TaxList.filter(input => input.FIELD_NAME == 'SGST')
                $ddlTax.empty();
                $ddlTax.append($('<option/>').val('Select').text('Select'));
                $.each(IGSTTaxList, function (ii, vall) {
                    $ddlTax.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
                })
            }
        }
    });

    if (IsIGST == 0) {
        $('#viewIGST').show();
        $('#headerI').show();
        $('#viewCGST').hide();
        $('#viewSGST').hide();
        $('#headerC').hide();
        $('#headerS').hide();
        $('#ddlTax_0').addClass('OMandate');
        $('#ddlCTax_0').removeClass('OMandate');
        $('#ddlSTax_0').removeClass('OMandate');
    }
    else {
        $('#viewIGST').hide();
        $('#viewCGST').show();
        $('#viewSGST').show();
        $('#headerI').hide();
        $('#headerC').show();
        $('#headerS').show();
        $('#ddlTax_0').removeClass('OMandate');
        $('#ddlCTax_0').addClass('OMandate');
        $('#ddlSTax_0').addClass('OMandate');
    }

    //Bind First Row From Json

    tableBody.innerHTML = ""; // Clear all rows
    tableBody.appendChild(firstRow); // Add the first row back with cleared inputs

    // Add new rows from JSON data
    OtherChargesArray.forEach((item, RowId) => {
        if (RowId == 0) {
            $('#ddlCharge_0').val(item.Charge_Id);
            if (IsIGST == 0) {
                $('#ddlTax_0').val(item.IGST_TaxID).trigger('change');
            }
            else {


                $('#ddlCTax_0').val(item.CGST_TaxID).trigger('change');
                $('#ddlSTax_0').val(item.SGST_TaxID).trigger('change');
            }
            $('#hdnOtherChargeId_0').text(item.ID);
            $('#hdnOtherNew_0').text("1");
            $('#txtChargeAmount_0').val(item.ChargeAmount);
            $('#txtTax_0').val(item.TotalTax);
            $('#spTotalOtherCharge_0').text((item.TotalNetAmount).toFixed(2));
            $('#hdnOtherNew_0').text("1");

        }
        else {
            let newRow = `
            <tr>
                <td>
                    <select class="form-control applyselect ddlChargeName OMandate" disabled id="ddlCharge_${RowId}" onchange="HideErrorMessage(this);setNARRCharges(this)">
					 
				    </select>
                    <span id="spddlCharge_${RowId}"   class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

                </td>
				<td>
                     <input type="number" value="${item.ChargeAmount}" disabled id="txtChargeAmount_${RowId}" oninput="GetTax(this)" class="form-control text-right ChargeAmount OMandate" value="" placeholder="0" onchange="HideErrorMessage(this);SetZero(this)">
                                                                <span id="sptxtChargeAmount_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </td>
				<td id="viewIGST_${RowId}">
                    <select class="form-control applyselect taxDdl OMandate" disabled id="ddlTax_${RowId}" onchange="HideErrorMessage(this);GetTax(this)">
                                                <option>Select</option>
                                            </select>
                                            <span id="spddlTax_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

                    </td>
                    <td id="viewCGST_${RowId}">
                    <select class="form-control applyselect taxCDdl OMandate" disabled id="ddlCTax_${RowId}" onchange="HideErrorMessage(this);GetTax(this)">
                                                <option>Select</option>
                                            </select>
                                            <span id="spddlCTax_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

                    </td>
                    <td id="viewSGST_${RowId}">
                    <select class="form-control applyselect taxSDdl OMandate" disabled id="ddlSTax_${RowId}" onchange="HideErrorMessage(this);GetTax(this)">
                                                <option>Select</option>
                                            </select>
                                            <span id="spddlSTax_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

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


            if (IsIGST == 0) {
                $('#viewIGST_' + RowId).show();
                $('#headerI').show();
                $('#viewCGST_' + RowId).hide();
                $('#viewSGST_' + RowId).hide();
                $('#headerC').hide();
                $('#headerS').hide();
                $('#ddlTax_' + RowId).addClass('OMandate');
                $('#ddlCTax_' + RowId).removeClass('OMandate');
                $('#ddlSTax_' + RowId).removeClass('OMandate');
            }
            else {
                $('#viewIGST_' + RowId).hide();
                $('#viewCGST_' + RowId).show();
                $('#viewSGST_' + RowId).show();
                $('#headerI').hide();
                $('#headerC').show();
                $('#headerS').show();
                $('#ddlTax_' + RowId).removeClass('OMandate');
                $('#ddlCTax_' + RowId).addClass('OMandate');
                $('#ddlSTax_' + RowId).addClass('OMandate');
            }

            var $ddlChargeR = $('#ddlCharge_' + RowId);
            $ddlChargeR.empty();
            $ddlChargeR.append($('<option/>').val('Select').text('Select'));
            $.each(ChargeList, function (ii, vall) {
                $ddlChargeR.append($('<option />').val(vall.ID).text(vall.ValueName));
            })
            $ddlChargeR.val(item.Charge_Id);

            IGSTTaxList = TaxList.filter(input => input.FIELD_NAME == 'IGST')
            CGSTTaxList = TaxList.filter(input => input.FIELD_NAME == 'CGST')
            SGSTTaxList = TaxList.filter(input => input.FIELD_NAME == 'SGST')


            if (IsIGST == 0) {
                var $ddlTaxR = $('#ddlTax_' + RowId);
                $ddlTaxR.empty();
                $ddlTaxR.append($('<option/>').val('Select').text('Select'));
                $.each(IGSTTaxList, function (ii, vall) {
                    $ddlTaxR.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
                })
                $ddlTaxR.val(item.IGST_TaxID).trigger('change');
            }
            else {
                var $ddlTaxC = $('#ddlCTax_' + RowId);
                $ddlTaxC.empty();
                $ddlTaxC.append($('<option/>').val('Select').text('Select'));
                $.each(CGSTTaxList, function (ii, vall) {
                    $ddlTaxC.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
                })
                $ddlTaxC.val(item.CGST_TaxID);

                var $ddlTaxS = $('#ddlSTax_' + RowId).trigger('change');
                $ddlTaxS.empty();
                $ddlTaxS.append($('<option/>').val('Select').text('Select'));
                $.each(SGSTTaxList, function (ii, vall) {
                    $ddlTaxS.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
                })
                $ddlTaxS.val(item.SGST_TaxID).trigger('change');
            }

        }
    });


   // $('#othercharge').modal('show');
}

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
        //updateGrandTotal();
    }
    else {

        $(this).closest("tr").remove();
    }
});

function SetZero(ctrl) {
    if (ctrl.value == "") {
        ctrl.value = 0;
    }
}

// Attach event listeners to update grand total on input changes
document.addEventListener("input", function (event) {
       
    if (
        event.target.classList.contains("issueQty") ||
        event.target.classList.contains("unit-price") ||
        event.target.classList.contains("discount") ||
        event.target.id === "roundingAmountInput" ||
        event.target.id === "otherChargesInput"
    ) {
        updateGrandTotal();
    }
});


function ApporveReject(from) {
    var dt = new Date();
    var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
    var docDate = ChangeDateFormatToYYYYMMDDWithSlash(newDate);

    // Step 1: Generate PDF
   // printDebitNote(Id, $('#txtDebitNoteNumber').val());  // Reuse the existing method

    var indentModel =
    {
        ERPIndentID: Id,
        Remark: '',
        IsApproved: from,
        ActionType: 2,
        ModuleId: 2,
        SADocDate: docDate,
        DocType: 'POReturnApproval'
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
        BackToList();
    });


}


function printDebitNote(POR_Id, DebitDocNo) {
    $.ajax({
        url: '/Material/PrintDebitNote?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { POR_Id: POR_Id, DebitDocNo: DebitDocNo },
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
                FailToaster("You don't have the permission to print this record");
                return;
            }

            // Get filename from headers or fallback
            let filename = "Debit_Note.pdf";
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