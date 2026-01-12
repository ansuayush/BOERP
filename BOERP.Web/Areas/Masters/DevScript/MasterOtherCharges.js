function BuildOtherChargesList(data) {
	$("#liManageOtherChargesList").empty(); // Clear existing items
	if (data.length > 0) {
		data.forEach((item) => {
			const listItem = `
				<li class="item">
				<a href="#" id="btnManageOtherCharges" onclick="SingleManage(this)" ><span class="title-one">${item.FIELD_NAME}</span></a>
				</li>`;
			$("#liManageOtherChargesList").append(listItem);
		});
	}
}

var hsn_id = 0;


//var $ele = $('#ddlIndent');
//$ele.empty();

//// Bind options
//$.each(tblIndent, function (ii, vall) {
//    var $option = $('<option />')
//        .val(vall.ID)
//        .text(vall.ValueName);
//    $ele.append($option);
//});

//// Destroy and re-init multiselect
//if ($ele.data('multiselect')) {
//    $ele.multiselect('destroy');
//}

//$ele.multiselect({
//    includeSelectAllOption: true,
//    nonSelectedText: 'Select',
//    buttonWidth: '100%',
//    enableFiltering: true,
//    enableCaseInsensitiveFiltering: true
//});

$(document).ready(function () {

    var obj = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 99,
        manualTableId: 99,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlsubcate', obj, '', false);
});
//function BindSubCate() {

//    var model = {
//        ID: 1,
//        Type: 18
//    };

//    const jsonString = JSON.stringify(model);
//    var ScreenID = "ERP_SAMP_101";




//    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
//        console.log(response);
//        var tableData = response.data.data.Table;

//        var $ele = $('#ddlsubcate');
//        $ele.empty();

//        // Bind options
//        $.each(tblIndent, function (ii, vall) {
//            var $option = $('<option />')
//                .val(vall.ID)
//                .text(vall.ValueName);
//            $ele.append($option);
//        });

//        // Destroy and re-init multiselect
//        if ($ele.data('multiselect')) {
//            $ele.multiselect('destroy');
//        }

//        $ele.multiselect({
//            includeSelectAllOption: true,
//            nonSelectedText: 'Select',
//            buttonWidth: '100%',
//            enableFiltering: true,
//            enableCaseInsensitiveFiltering: true
//        });



//    });

//}

//BindSubCate();


function BindItemMasterCharge(hsn_id, hsn_name, hsn_code) {

    this.hsn_id = hsn_id;
    $("#error-message").hide();
    $('#hsn_code').html(hsn_name); 
    $('#hsn_name').html(hsn_code);

    var model = {
        ID: hsn_id,
        TableName: "HSN"
    };

    const jsonString = JSON.stringify(model);
    var ScreenID = "ItemMaster_102";




    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        console.log(response);
        var tableData = response.data.data.Table;

        var hsn_data = response.data.data.Table1;

        let selectedValue = ``;

        selectedValue = hsn_data[0]?.SubCate_Id;
        let str = '';
        if (selectedValue && selectedValue.length > 0) {
            array = selectedValue.split(',').map(Number);
            $("#ddlsubcate option").prop("selected", false).trigger('change');

            for (var i = 0; i < array.length; i++) {
                $("#ddlsubcate option[value='" + array[i] + "']").prop("selected", true).trigger('change');
                str += array[i] + ",";
            }
        }
        else {

            $("#ddlsubcate option").prop("selected", false).trigger('change');

        }

        //var obj = {
        //    parentId: 0,
        //    masterTableTypeId: 0,
        //    isMasterTableType: false,
        //    isManualTable: true,
        //    manualTable: 99,
        //    manualTableId: 99,
        //    ScreenId: 'DropdownList_101'
        //}
        //LoadMasterDropdown('ddlsubcate', obj, '', false);


        console.log('hsn data: ', hsn_data);

        var $chargeList = $('#edittablecc tbody');
        $chargeList.empty();

        if (tableData.length === 0) {
            $('#noResultsMessage').show();
        } else {
            $('#noResultsMessage').hide();

            tableData = tableData.filter(input => input.ChargeType.toLowerCase() == 'igst' || input.ChargeType.toLowerCase() == 'cgst' || input.ChargeType.toLowerCase() == 'sgst' )
           
            chargeData =  [];

            tableData.forEach(function (row, index) {
                // Check if session data exists for the charge type
                var existingCharge = hsn_data.find(c => c.CHRG_TYPE_ID === row.ID);

                // Set default tax dropdown and percentage
                var selectedChargeId = existingCharge ? existingCharge.CHRG_ID : "";
                var chargePercentage = (existingCharge && existingCharge.CHRG_PER) ? existingCharge.CHRG_PER : "0.00";

                // Ensure Dropdown gets bound properly
                var listItem = `  
                    <tr data-chargeid="${row.ID}">
                        <td class="text-left charge-type">${row.ChargeType}</td>
                        <td class="text-left">
                            <select class="form-control applyselect tax-dropdown" id="ddlTax_${row.ID}" data-chargeid="${row.ID}">
                                <option value="0">Select</option>
                            </select>
                        </td>
                        <td class="text-center">
                            <input type="number" value="${chargePercentage}" class="text-right form-control charge-percentage" disabled />
                        </td>
                    </tr>
                `;
                $chargeList.append(listItem);

                $('#ddlTax_' + row.ID).select2({
                    placeholder: "Select",
                    allowClear: true,
                    width: '100%'
                });

                // Automatically load tax dropdown based on charge type ID (Fix for ITEM_ID = 0)
                LoadTaxDropdownOnClick(`ddlTax_${row.ID}`, row.ID, selectedChargeId);
            });

       
        }
    });
}

// Function to fetch and bind tax rates when dropdown is clicked (only if empty)
function LoadTaxDropdownOnClick(dropdownId, chargeId, selectedValue) {
    var dropdown = $("#" + dropdownId);

    // Clear existing options and add "Loading..."
    dropdown.empty().append('<option value="">Loading...</option>');

    LoadMasterDropdown(dropdownId, {
        parentId: chargeId,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 82,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false, function () {
        // Ensure value is set after options are loaded
        setTimeout(function () {
            if (selectedValue && dropdown.find(`option[value="${selectedValue}"]`).length > 0) {
                dropdown.val(selectedValue).trigger('change');
            } else {
                dropdown.val("Select"); // Ensure "Select" is chosen if no previous value exists
            }
        }, 500); // Delay to allow options to populate
    });
}

$(document).ready(function () {
    // Event listener for all dynamically created dropdowns
    $(document).on("change", ".tax-dropdown", function () {
        var chargeId = $(this).data("chargeid");
        var selectedTax = $(this).val();
        UpdateChargePercentage(chargeId, selectedTax);
    });
});

// Function to update the charge percentage when tax dropdown changes
function UpdateChargePercentage(chargeId, selectedTax) {
    var chargePercentageField = $(`tr[data-chargeid="${chargeId}"] .charge-percentage`);

    if (selectedTax) {
        GetChargePercentage(selectedTax, function (chargePercentage) {
            chargePercentageField.val(chargePercentage);
        });
    } else {
        chargePercentageField.val("0.00");
    }
}

function GetChargePercentage(selectedTax, callback) {
    if (selectedTax === "Select") {
        callback("0.00");
        return;
    }
    var model = {
        ID: selectedTax,
        TableName: "Charge"
    };

    const jsonString = JSON.stringify(model);
    var ScreenID = "ItemMaster_102";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        console.log(response);
        var tableData = response.data.data.Table;

        if (tableData.length > 0) {
            var chargePercentage = tableData[0].TaxPer || "0.00"; // Adjust field name if different
            callback(chargePercentage); // Pass the value back
        } else {
            callback("0.00"); // Default if no data is found
        }
    });
}


function SaveItemMasterChargeData() {
    let tempChargeData = []; //  Declare as local
    itemChargeData = [];

    let igstChargeId = 0;
    let cgstChargeId = 0;
    let sgstChargeId = 0;

    let igstPercentage = 0;
    let cgstPercentage = 0;
    let sgstPercentage = 0;

    let selectedTaxNames = [];
    let taxError = false;
    let errorMessage = "";

    // Step 1: Collect and evaluate values
    $("#edittablecc tbody tr").each(function () {
        let chargeId = $(this).data("chargeid");
        let charge = $(this).find(".charge-type").text();
        let selectedTaxId = $(this).find(".tax-dropdown").val();
        let selectedTax = $(this).find(".tax-dropdown option:selected").text();
        let chargePercentage = parseFloat($(this).find(".charge-percentage").val()) || 0.00;

        // Collect IGST/CGST/SGST percentages
        if (charge === "IGST") {
            igstChargeId = selectedTaxId;
            igstPercentage = chargePercentage;
        } else if (charge === "CGST") {
            cgstChargeId = selectedTaxId;
            cgstPercentage = chargePercentage;
        } else if (charge === "SGST") {
            sgstChargeId = selectedTaxId;
            sgstPercentage = chargePercentage;
        }

        // Save this row's data temporarily
        tempChargeData.push({
            ChargeTypeId: chargeId,
            Charge: charge,
            ChargeId: selectedTaxId === "Select" ? "0" : selectedTaxId,
            TaxPer: chargePercentage,
            TaxName: selectedTax === "Select" ? "" : selectedTax // Sanitize
        });
    });


    if ($('#ddlsubcate').val().length <= 0) {
        $('#ddlsubcate').val('0');
    }
    if (igstChargeId === 'Select' && cgstChargeId === 'Select' && cgstChargeId === 'Select') {
        taxError = true;
        errorMessage = "Please select the charges!!!";
    } 
    else if (igstChargeId > 0 && (cgstChargeId === 'Select' || sgstChargeId === 'Select')) {
        taxError = true;
        errorMessage = "Please fill CGST and SGST when IGST is selected.";
    } else if (igstChargeId === 'Select' && (cgstChargeId > 0 || sgstChargeId > 0)) {
        taxError = true;
        errorMessage = "If CGST or SGST is filled, IGST should be selected.";
    } else if (cgstPercentage + sgstPercentage !== igstPercentage) {
        taxError = true;
        errorMessage = "IGST must equal CGST + SGST.";
    }


    // Step 3: Show error if any
    if (taxError) {
        $("#error-message").show();
        $("#error-text").text(errorMessage);
        return;
    }

    // Step 4: If no error, push only valid charge rows
    tempChargeData.forEach(row => {
        /*if (row.ChargeId > 0 && row.TaxPer > 0) {*/
        if (row.ChargeId > 0) {
            itemChargeData.push({
                HSNID: hsn_id,
                SubCate_Id: $('#ddlsubcate').val().join(','),
                ChargeTypeId: row.ChargeTypeId,
                Charge: row.Charge,
                ChargeId: row.ChargeId,
                TaxPer: row.TaxPer
            });

            selectedTaxNames.push(row.TaxName);

        }
    });




    var model475 = {
        id: 0,
        Type: 100,
        ItemCHRGMapping: itemChargeData
        
    };
    const jsonString475 = JSON.stringify(model475);

    let Modeldatals475 =
    {
        ScreenID: "QCPM_101",
        Operation: "A",
        ModelData: jsonString475
    };

    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', Modeldatals475, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            $("#error-message").hide();
            $('#taxmapping').modal('hide');
        }
    });
}


let itemChargeData = []; // Global array to store charge data

var hsn_op = 'U'

function RowEditHSN(id) {

    hsn_op = 'U';
    var model133 = {
        ID: id,
        TABLE_NAME: 'HSN'
    }
    const jsonString133 = JSON.stringify(model133);
    var ScreenID133 = "Brand_101";
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString133, screenId: ScreenID133 }, 'GET', function (response) {
        document.getElementById('txtHSNCode').value = response.data.data.Table[0].FIELD_NAME;
        document.getElementById('txtHSNName').value = response.data.data.Table[0].FIELD_VALUE;
        $('#hddEditRowId').val(response.data.data.Table[0].ID);
        $('#hsnInsertUpdate').modal('show');
    });
}


function saveHSN() {

    if (checkValidationOnSubmit('MandatoryHSN') == true) {

        var model = {
            ID: $('#hddEditRowId').val(),
            FIELD_NAME: $('#txtHSNCode').val(),
            FIELD_VALUE: $('#txtHSNName').val(),
            TABLE_NAME: 'HSN'
        };
        const jsonString = JSON.stringify(model);
        let GenericModeldata =
        {
            ScreenID: "Brand_101",
            Operation: hsn_op,
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if(response.ValidationInput == 1) {
                $('#hsnInsertUpdate').modal('hide');

                $('#btnManageHSNType').click();
            }
        });
    }
    //CommonGetAllType('ERPBRAND')
}