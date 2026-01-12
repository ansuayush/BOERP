$(document).ready(function () {
    $("#addothercharge").click(function () {
        var RowId = 0;
        RowId = $("#tblOtherCharge tbody tr").length + 1;
        let newRow = `
            <tr>
                <td>
                    <div class="deleterowExtra text-center cursor-pointer">
                        <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
                         <span style="display:none;" id="hdnOtherChargeId_${RowId}" class="hdnOtherChargeId">0 </span>
                         <span style="display:none;" id="hdnOtherNew_${RowId}" class="hdnOtherNew">0</span>
</div>
                    </td>
                <td>
                    <select class="form-control applyselect ddlChargeName OMandate" id="ddlCharge_${RowId}" onchange="HideErrorMessage(this);setNARRCharges(this)">
					 
				    </select>
                    <span id="spddlCharge_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

                </td>
				<td>
                     <input type="number" id="txtChargeAmount_${RowId}" oninput="GetTax(this)" class="form-control text-right ChargeAmount OMandate" value="" placeholder="0" onchange="HideErrorMessage(this);SetZero(this)">
                                                                <span id="sptxtChargeAmount_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </td>
				<td id="viewIGST_${RowId}">
                    <select class="form-control applyselect taxDdl OMandate" id="ddlTax_${RowId}" onchange="HideErrorMessage(this);GetTax(this)">
                                                <option>Select</option>
                                            </select>
                                            <span id="spddlTax_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

                    </td>
                    <td id="viewCGST_${RowId}">
                    <select class="form-control applyselect taxCDdl OMandate" id="ddlCTax_${RowId}" onchange="HideErrorMessage(this);GetTax(this)">
                                                <option>Select</option>
                                            </select>
                                            <span id="spddlCTax_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

                    </td>
                    <td id="viewSGST_${RowId}">
                    <select class="form-control applyselect taxSDdl OMandate" id="ddlSTax_${RowId}" onchange="HideErrorMessage(this);GetTax(this)">
                                                <option>Select</option>
                                            </select>
                                            <span id="spddlSTax_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

                    </td>
				                    <td>
                     <input placeholder="0" type="text" id="txtTax_${RowId}" class="form-control text-right TaxAmount" fdprocessedid="5nb56" disabled>
                    </td>
				
				<td class="text-right"><span class="TotalOtherChargeAmount"  id="spTotalOtherCharge_${RowId}"></span></td>
            </tr>`;

        // Append new row
        $(".othercharnge tbody").append(newRow);

        $('.taxCDdl').on('change', function () {

            var value = $(this).val();
            var id = $(this).attr('id');

            var part_id = id.split('_')[1];

            if (id.split('_')[0] == 'ddlCTax') {
                if (value > 0) {
                    var cgstvalue = TaxList.find(input => input.ID == value && input.FIELD_NAME == 'CGST');

                    var sgstId = TaxList.find(input => input.ValueCode == cgstvalue.ValueCode && input.FIELD_NAME == 'SGST');

                    var alreadySelected = TaxList.find(input => input.ID == $('#ddlSTax_' + part_id).val() && input.FIELD_NAME == 'SGST');

                    if (alreadySelected) {
                        if (sgstId.ValueCode == alreadySelected.ValueCode) {
                            return;

                        }
                    }

                    $('#ddlSTax_' + part_id).val(sgstId.ID).trigger('change');
                }
            }



        });

        $('.taxSDdl').on('change', function () {

            var value = $(this).val();
            var id = $(this).attr('id');

            var part_id = id.split('_')[1];

            if (id.split('_')[0] == 'ddlSTax') {
                if (value > 0) {
                    var cgstvalue = TaxList.find(input => input.ID == value && input.FIELD_NAME == 'SGST');

                    var sgstId = TaxList.find(input => input.ValueCode == cgstvalue.ValueCode && input.FIELD_NAME == 'CGST');

                    var alreadySelected = TaxList.find(input => input.ID == $('#ddlCTax_' + part_id).val() && input.FIELD_NAME == 'CGST');

                    if (alreadySelected) {
                        if (sgstId.ValueCode == alreadySelected.ValueCode) {
                            return;
                        }
                    }

                    $('#ddlCTax_' + part_id).val(sgstId.ID).trigger('change');
                }
            }



        });

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

        IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 116)
        CGSTTaxList = TaxList.filter(input => input.TYPE_ID == 137)
        SGSTTaxList = TaxList.filter(input => input.TYPE_ID == 158)


        var $ddlCharge = $('#ddlCharge_' + RowId);
        $ddlCharge.empty();
        $ddlCharge.append($('<option/>').val('Select').text('Select'));
        $.each(ChargeList, function (ii, vall) {
            $ddlCharge.append($('<option />').val(vall.ID).text(vall.ValueName));
        })

        var $ddlTaxR = $('#ddlTax_' + RowId);
        $ddlTaxR.empty();
        $ddlTaxR.append($('<option/>').val('Select').text('Select'));
        $.each(IGSTTaxList, function (ii, vall) {
            $ddlTaxR.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
        })
        var $ddlTaxC = $('#ddlCTax_' + RowId);
        $ddlTaxC.empty();
        $ddlTaxC.append($('<option/>').val('Select').text('Select'));
        $.each(CGSTTaxList, function (ii, vall) {
            $ddlTaxC.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
        })
        var $ddlTaxS = $('#ddlSTax_' + RowId);
        $ddlTaxS.empty();
        $ddlTaxS.append($('<option/>').val('Select').text('Select'));
        $.each(SGSTTaxList, function (ii, vall) {
            $ddlTaxS.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
        })
       // $ddlTaxS.val(item.Tax_ID);

    });


    $(document).on("click", ".deleterowExtra", function () {
        var $row = $(this).closest("tr");

        // Force hide & dispose any tooltip in the row
        $row.find('[data-toggle="tooltip"]').each(function () {
            var $el = $(this);
            $el.tooltip('hide');       // hide tooltip
            $el.tooltip('dispose');    // completely remove Bootstrap tooltip instance
        });

        // Also remove any orphaned tooltip DOM
        $('.tooltip').remove();

        // Now remove the row
        $row.remove();
    });

});

