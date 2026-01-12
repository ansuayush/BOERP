$(document).ready(function () {
    LoadItemDropdown();

    $('#ddlSalesPerson').html('<option value="">Select</option>');
    
    //For testing
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
        // Adjust dropdown position based on available space
        $('.datepicker').on('show.daterangepicker', function () {
            var $calendar = $('.daterangepicker');
            var inputOffset = $(this).offset();
            var inputHeight = $(this).outerHeight();
            var windowHeight = $(window).height();
            var calendarHeight = $calendar.outerHeight();

            // Check if there's enough space to open the dropdown below the input
            if ((inputOffset.top + inputHeight + calendarHeight) > windowHeight) {
                // If not enough space, open the dropdown above the input
                $calendar.css({
                    top: inputOffset.top - calendarHeight - 5 + 'px', // 5px for some spacing
                    left: inputOffset.left + 'px'
                });
            } else {
                // Open it below the input
                $calendar.css({
                    top: inputOffset.top + inputHeight + 5 + 'px', // 5px for some spacing
                    left: inputOffset.left + 'px'
                });
            }
        });
    });


    var IGSTmodel =
    {
        ID: 0,
        SupplierId: $('#hdnSuppId').val(),
        ModuleId: 3,
        GRNID: 0,
        CompanyId: CompId,
        ISDDChange: 0
    };

    var IgstJsonString = JSON.stringify(IGSTmodel);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: IgstJsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {

        console.log(response.data.data.Table2);

        var tblSupp = response.data.data.Table2;



        IsIGST = tblSupp[0].IsSameCompanyLocation;

    });

    if ($('#hdnPoId').val() == "0" || $('#hdnPoId').val() == "") {

        BindDropdownTC('');
        BindDropdownPaymentTerm('');
        BindDropdownBillTo('1');
        BindDropdownshipTo('1');
        if ($('#hdnIndId').val() != "") {
            FillOnIndentLoad($('#hdnIndId').val());
        }
        else {
            BindIndend('');
        }
        var sId = "";
        if ($('#hdnSuppId').val() == "") {
            sId = 0;
            BindSupp('');
        }
        else {
            sId = $('#hdnSuppId').val();
            BindSupp(sId);
        }
        var model =
        {
            ID: 0,
            SupplierId: sId,
            ModuleId: 2,
            ISDDChange: 0,
            Item: ''
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {


            var DOC_LOCK = false;
            var tblDoc = response.data.data.Table;
            var tblSeries = response.data.data.Table1;
            var tblSupp = response.data.data.Table2;
            var tblSales = response.data.data.Table4;
            if (sId!=0)
                FillSalesPerson(tblSales);
            $('#txtPONumber').val(tblDoc[0].DocNumber);
            var dt = new Date();
            var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
            $('#txtPODate').val(newDate);
            $('#lblReqName').text(loggedinUserName);
            $('#lblReqDept').text(loggedinUserDept);


            if (sId != 0) {
                $('#ddlSupp').val(sId);
            }
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
            // $("#txtSupName").val(tblSupp[0].PA_NAME);
            if (tblSupp.length > 0) {
                $('#lblSuppAdd').html(
                    generateAddressHtml(tblSupp[0].BILL_ADD1, tblSupp[0].BILL_ADD2, tblSupp[0].BillCity, tblSupp[0].BStateCountryPin)
                );
                $("#lblSuppGST").text(tblSupp[0].GST);
                $('#ddlPaymentTerm').val(tblSupp[0].PaymentTermId);
            }

        });

    }
    else {
        var model =
        {
            POID: $('#hdnPoId').val(),
            ISDDChange: 0,
            SupId: $('#hdnSuppId').val(),
            Item: '',
            CompanyId: CompId
        };
        var DOC_LOCK = false;
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPurchase_101' }, 'GET', function (response) {

            console.log(response);

            var tblDoc = response.data.data.Table;
            var tblItem = response.data.data.Table1;
            var tblOtherCharges = response.data.data.Table3;
            var tblSeries = response.data.data.Table4;
            var tblSales = response.data.data.Table5;
            var tblIndent = response.data.data.Table6;
            FillSalesPerson(tblSales);

            var newDate = ChangeDateFormatToddMMYYYWithSlace(tblDoc[0].DOCDate);
            $('#txtPODate').val(newDate);
            $('#lblReqName').text(tblDoc[0].USER_NAME);
            $('#lblReqDept').text(tblDoc[0].Department);

            // $("#txtSupName").val(tblDoc[0].PA_NAME);
            FillSuppDetailsBySUpplierId($('#hdnSuppId').val(), tblDoc[0].PaymentTermI);
            $("#lblSuppGST").text(tblDoc[0].GST);
            //$('#ddlSupp').val(tblDoc[0].SupplierId);
            BindSupp(tblDoc[0].SupplierId);

            BindDropdownTC(tblDoc[0].TC);
            BindDropdownPaymentTerm(tblDoc[0].PaymentTermId);
            BindDropdownBillTo(tblDoc[0].BillToId);
            BindDropdownshipTo(tblDoc[0].ShipToId);
            $('#txtPONumber').val(tblDoc[0].DocNoEdit);
            $('#txtComments').val(tblDoc[0].Comments);
            // $('#hdnSuppId').val(tblDoc[0].SupplierId);
            $('#ddlSalesPerson').val(tblDoc[0].SalesPersonId).trigger('change');
            $('#roundingAmountInput').val(tblDoc[0].RoundAmount);

            var $ele = $('#ddlIndent');
            $ele.empty();

            // Bind options
            $.each(tblIndent, function (ii, vall) {
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

            // Pre-select Indent IDs (if any)
            if (tblDoc[0].IndIds && tblDoc[0].IndIds.length > 0) {
                let indArray = tblDoc[0].IndIds.split(',').map(x => x.trim());
                $ele.val(indArray);
                $ele.multiselect('rebuild');
            }


            $ele = $('#ddlDocSeries');
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
            $("#ddlDocSeries").prop("disabled", true);

            $("#txtPONumber").prop("disabled", true);
            OtherChargesArray = tblOtherCharges;

            let totalNetAmountSum = OtherChargesArray.reduce((sum, item) => sum + item.TotalNetAmount, 0);
            $('#otherChargesInputData').text(totalNetAmountSum.toFixed(2));

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


});
function BindDropdownTC(selectedValue) {

    LoadMasterDropdown('ddlTC', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 15,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false, selectedValue);
}

function BindDropdownPaymentTerm(selectedValue) {
    LoadMasterDropdown('ddlPaymentTerm', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 11,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);

    // Delay setting the selected value
    if (selectedValue > 0) {
        setTimeout(function () {
            $('#ddlPaymentTerm').val(selectedValue).trigger('change');
        }, 200);
    }
}

function BindDropdownBillTo(selectedValue) {

    LoadMasterDropdown('ddlBillTo', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 10,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false, selectedValue);

}
function BindDropdownshipTo(selectedValue) {

    LoadMasterDropdown('ddlshipTo', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 9,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false, selectedValue);

}
function BindSupp(data) {
    CommonAjaxMethod(virtualPath + 'Generic/GetDropDownWithAsync/', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'GET', function (response) {
        var suppData = response.data.data.Table;

        var $ele = $('#ddlSupp');
        $ele.empty();
        $ele.append($('<option/>').val('0').text('Select'));
        // Bind options
        $.each(suppData, function (ii, vall) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName);
            $ele.append($option);
        });



        if (data != '') {
            $ele.val(data);
        }

    });
}

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
        // Bind options
        $.each(indendData, function (ii, vall) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName);
            $ele.append($option);
        });

        // Destroy and re-init multiselect
        InitializeMultiselectWithSearch('#ddlIndent');

        if (data != '') {
            let indArray = data.split(',').map(x => x.trim());
            $ele.multiselect('rebuild');
            $ele.val(indArray);
            $ele.multiselect('refresh');
        }

    });
}
function ChangeOtherChargersBasedOnSupplier() {
    OtherChargesArray = [];
    updateGrandTotal();
    var IGSTmodel =
    {
        ID: 0,
        SupplierId: $('#ddlSupp').val() == 'Select' ? 0 : $('#ddlSupp').val(),
        ModuleId: 3,
        GRNID: 0,
        CompanyId: CompId,
        ISDDChange: 0
    };

    var IgstJsonString = JSON.stringify(IGSTmodel);

    if ($('#ddlSupp').val() > 0) {

        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: IgstJsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {

            console.log(response);

            var tblSupp = response.data.data.Table2;

            console.log(tblSupp);

            IsIGST = tblSupp[0].IsSameCompanyLocation;

        });
    }

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

        $('#spddlSalesPerson').hide();
    }

}
function FillSuppDetails(ctr, id) {
    var suppId = '0';
    var model =
    {
        ID: 0,
        SupplierId: $('#ddlSupp').val() == 'Select' ? 0 : $('#ddlSupp').val(),
        ModuleId: 2
    };
    suppId = $('#ddlSupp').val() == 'Select' ? 0 : $('#ddlSupp').val();
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {

        var tblSupp = response.data.data.Table2;

        $("#lblSuppAdd").text(tblSupp[0].BILL_ADD1);
        $('#lblSuppAdd').append(
            generateAddressHtml(tblSupp[0].BILL_ADD2, tblSupp[0].BillCity, tblSupp[0].BStateCountryPin)
        );

        $("#lblSuppGST").text(tblSupp[0].GST);
        $('#ddlPaymentTerm').val(tblSupp[0].PaymentTermId).trigger('change');
        if (suppId!='0') {
            var tblSales = response.data.data.Table4;
            FillSalesPerson(tblSales);
            if ($('#ddlIndent').val() != "")
                FillIndentOnSuppChange();
        }

    });


}

function FillSuppDetailsBySUpplierId(suppId, PaymentTermId) {

    var model =
    {
        ID: 0,
        SupplierId: suppId,
        ModuleId: 2
    };
    suppId = $('#ddlSupp').val() == 'Select' ? 0 : $('#ddlSupp').val();
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {

        var tblSupp = response.data.data.Table2;

        $("#lblSuppAdd").text(tblSupp[0].BILL_ADD1);
        $('#lblSuppAdd').append(
            generateAddressHtml(tblSupp[0].BILL_ADD2, tblSupp[0].BillCity, tblSupp[0].BStateCountryPin)
        );

        $("#lblSuppGST").text(tblSupp[0].GST);
        $('#ddlPaymentTerm').val(PaymentTermId).trigger('change');
        if (suppId != null)
        {
            if (suppId != '0') {
                var tblSales = response.data.data.Table4;
                FillSalesPerson(tblSales);
                if ($('#ddlIndent').val() != "")
                    FillIndentOnSuppChange();
            }
        }

    });

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


function FillItemData(tblDoc) {
    items = [];
    tblDoc.forEach(doc => {
        items.push(doc);
    });
    addRowsToTable();
    updateGrandTotal();
}

function generateAddressHtml(add1, add2, city, state) {
    return `
       
             ${add1 && add1.length > 0 ? add1 + `,<br />` : ``}
                ${add2 && add2.length > 0 ? add2 + `,<br />` : ``}
                ${city && city.length > 0 ? city + `,<br />` : ``}
                ${state && state.length > 0 ? state + `,` : ``}
    `;
}


function FillIndentOnSuppChange() {
    const itemIDs = [];
    let tableRows = document.querySelectorAll("#tblItemInformation tbody tr");

    tableRows.forEach(row => {
        itemIDs.push(row.querySelector(".ItemID").innerText.trim());
    });

    var data = $('#ddlIndent').val().join();
    var model =
    {
        IndentIDs: data,
        POID: $('#hdnPoId').val(),
        SupId: $('#ddlSupp').val() == 'Select' ? 0 : $('#ddlSupp').val(),
        CompanyId: CompId,
        ISDDChange: 1,
        Item: itemIDs.join()
    };


    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPurchase_101' }, 'GET', function (response) {

        var tblDoc = response.data.data.Table;
        //$('#ddlPaymentTerm').val(tblSupp[0].PaymentTermId);
        items = [];
        tblDoc.forEach(doc => {
            items.push(doc);
        });
        addRowsToTable();
        updateGrandTotal();
    });
}

function FillOnIndentLoad(data) {
    BindIndend(data);
    var model =
    {
        IndentIDs: data,
        POID: 0,
        SupId: $('#hdnSuppId').val(),
        CompanyId: CompId,
        ISDDChange: 1,
        Item: ''
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
function FillGrid(ctr) {
    var data = $('#' + ctr.id).val().join();
    var model =
    {
        IndentIDs: data,
        POID: $('#hdnPoId').val(),
        SupId: $('#ddlSupp').val() == 'Select' ? 0 : $('#ddlSupp').val(),
        CompanyId: CompId,
        ISDDChange: 1,
        Item: ''
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
$(document).on("click", ".deleterow", function () {
    let row = $(this).closest("tr");

    let indentNo = row.find("td:eq(1)").text().trim();   // IndentNo
    let itemCode = row.find("td:eq(2)").text().trim();   // ItemCode

    // Remove item from items array
    items = items.filter(item => !(item.IndentNo === indentNo && item.ItemCode === itemCode));

    // Remove row from DOM
    row.remove();

    // Recalculate totals
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
    var isValidSup = true;
    if ($('#ddlSupp').val() == '0') {
        isValidSup = false;
        FailToaster('Supplier is mandatory');
    }
    var isValidTax = true;
    var totalBTax = $('#totalBeforeTax').text().replace(/₹/g, '').trim();
    if (totalBTax == "0.00") {
        $('#sptotalBeforeTax').show();
        isValidTax = false;
    }

    if (checkValidationOnSubmit('Mandate') == true && isValidTax == true && isValidSup==true) {
        // var data = $('#ddlIndent').val().join();

        let distinctIndentNos = [...new Set(items.map(item => item.IndentNo))];

        // 2. Find matching <option> values (ids) from ddlIndent
        let selectedValues = [];
        $('#ddlIndent option').each(function () {
            if (distinctIndentNos.includes($(this).text().trim())) {
                selectedValues.push($(this).val()); // collect the value (id)
            }
        });

        var data = selectedValues.join(',');

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
        // ✅ File count validation
        if (fileData.length > 10) {
            FailToaster(fileData.length + " Files. You cannot upload more than 10 files for Purchase Order.");
            return;
        }

        let tableRows = document.querySelectorAll("#tblItemInformation tbody tr");
        let purchaseOrderItems = [];
        tableRows.forEach(row => {


            var igstDdl = row.querySelector(".IGSTPercentage");
            const isgOption = igstDdl.options[igstDdl.selectedIndex];
            const igstPercentageId = parseFloat(isgOption.getAttribute('dataEle'));

            var cgstDdl = row.querySelector(".CGSTPercentage");
            const csgOption = cgstDdl.options[cgstDdl.selectedIndex];
            const cgstPercentageId = parseFloat(csgOption.getAttribute('dataEle'));

            var sgstDdl = row.querySelector(".CGSTPercentage");
            const ssgOption = sgstDdl.options[sgstDdl.selectedIndex];
            const sgstPercentageId = parseFloat(ssgOption.getAttribute('dataEle'));


            let item = {
                POItemId: row.querySelector(".POItemId").innerText.trim(),
                IndentItemId: row.querySelector(".IndentItemId").innerText.trim(),
                ItemID: row.querySelector(".ItemID").innerText.trim(),
                IndentNo: row.cells[1].innerText.trim(),
                ItemCode: row.cells[2].innerText.trim(),
                ItemName: row.cells[3].innerText.trim(),
                ItemDescription: row.querySelector(".ItemDescription").value,
                HSN: row.cells[5].innerText.trim(),
                DeliveryDate: ChangeDateFormatSecond(row.querySelector(".datepicker").value.trim()),
                Quantity: parseFloat(row.querySelector(".quantity").value) || 0,
                UoM: row.cells[8].innerText.trim(),

                UnitPrice: parseFloat(row.querySelector(".unit-price").value) || 0,
                AmountBeforeDiscount: parseFloat(row.cells[11].innerText) || 0,
                DiscountPercentage: parseFloat(row.querySelector(".discount").value) || 0,
                AmountAfterDiscount: parseFloat(row.cells[13].innerText) || 0,
                IGSTPercentage: parseFloat(row.querySelector(".IGSTPercentage").value) || 0,
                IGSTAmount: parseFloat(row.cells[15].innerText) || 0,
                CGSTPercentage: parseFloat(row.querySelector(".CGSTPercentage").value) || 0,
                CGSTAmount: parseFloat(row.cells[17].innerText) || 0,
                SGSTPercentage: parseFloat(row.querySelector(".SGSTPercentage").value) || 0,
                SGSTAmount: parseFloat(row.cells[19].innerText) || 0,
                TotalCost: parseFloat(row.cells[20].innerText) || 0,
                Igst_TAXID: igstPercentageId,
                Cgst_TAXID: cgstPercentageId,
                Sgst_TAXID:sgstPercentageId
            };
            purchaseOrderItems.push(item);

        });

        var model =
        {
            "ID": $('#hdnPoId').val(),
            "DOCTYPE_ID": $('#ddlDocSeries').val(),
            "IndentIDs": data,
            "SupplierId": $('#ddlSupp').val(),
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
            "RoundAmount": parseFloat($('#roundingAmountInput').val()) || 0,
            "BillToId": $('#ddlBillTo').val(),
            "PaymentTermId": $('#ddlPaymentTerm').val(),
            "FinID": FinYearId,
            "PurchaseOrderItems": purchaseOrderItems,
            "Attachments": fileData,
            "PurchaseOrdersOtherCharges": OtherChargesArray
        }

        console.log(model);

        const jsonString = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "MaterialPurchase_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };
        if (purchaseOrderItems.length > 0) {
            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                if (response.ValidationInput != 0) {
                        RedirectPOList();
                }
            });
        }
        else {
            FailToaster("Atleast one line item should be available .");
        }
    }
}
function RedirectPOList() {
    var url = "/MaterialManagement/Material/PurchaseOrderIndex?auth=" + AuthToken
    window.location.href = url;
}

function validateDiscount(input) {
    let value = parseFloat(input.value) || 0;

    if (value > 100) {
        FailToaster("Discount cannot be more than 100%");
        input.value = 100;
    } else if (value < 0) {
        FailToaster("Discount cannot be negative");
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

    console.log('item');
    console.log(items);
    // Now, add/update rows based on `items`

    items.forEach(item => {
        let itemKey = `${item.IndentNo}-${item.ItemCode}`;

        let existingRow = Array.from(tbody.children).find(row =>
            row.cells[2].innerText.trim() === item.ItemCode &&
            row.cells[1].innerText.trim() === item.IndentNo
        );
        // Add new row if not found
        var IgstControl = "";
        var stControl = "";
        if (item.IsIgst == 0) {
            IgstControl = "disabled";
        }
        else {
            stControl = "disabled";
        }

        if (!existingRow) {

            let row = document.createElement("tr");
            row.innerHTML = `
                    <td class="text-center"><span style="display:none;"  class="IndentItemId">${item.ID}</span><span style="display:none;"  class="ItemID">${item.ItemID}</span><span style="display:none;"  class="POItemId">${item.POItemId}</span><div class="deleterow cursor-pointer"><img src="../../assets/images/icons/help/close.svg" alt="Remove"></div></td>
                    <td>${item.IndentNo}</td>     
                    <td>${item.ItemCode}</td>          
                    <td>${item.ItemName}</td>                    
                    <td><input type="text" id="ItemDescription_${item.ID}" class="ItemDescription form-control Mandate" value="${item.ItemDescription}">
                        <span  id="spItemDescription_${item.ID}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </td>
                    <td>${item.HSN}</td>             
                    <td>
                        <div class="input-group">
                            <input id="txtDeliveryDate_${item.ID}"  type="text" class="datepicker form-control Mandate" value="${ChangeDateFormatToddMMYYYWithSlace(item.DeliveryDate)}" placeholder="DD/MM/YYYY" readonly  onblur="HideErrorMessage(this)" >
                            <span class="clear-date">×</span>
                            <div class="input-group-append">
                                <span class="input-group-text bg-white"><img src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span>
                            </div>
                            <span id="sptxtDeliveryDate_${item.ID}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                        </div>
                    </td>
                    <td><input type="number"  placeholder="0"  step="0.01"  class="quantity form-control text-right" value="${item.Quantity == 0 ? `` : item.Quantity}" oninput="SetZero(this)"></td>
                    <td>${item.UoM}</td>
                    <td>${item.LastPurchaseRate}</td>
                    <td><input type="number"  placeholder="0"  class="unit-price form-control text-right" value="${item.UnitPrice == 0 ? `` : item.UnitPrice}" oninput="SetZero(this)" ></td>
                    <td class="amount-before-discount text-right">${item.AmountBeforeDiscount}</td>
                    <td><input type="number"  placeholder="0"  class="discount form-control text-right" value="${item.DiscountPercentage == 0 ? `` : item.DiscountPercentage}" oninput="SetZero(this);validateDiscount(this)"></td>
                    <td class="amount-after-discount text-right">${item.AmountAfterDiscount}</td>                 
                   
                    <td>
                      <select ${IgstControl} class="form-control applyselect  IGSTPercentage"  tabindex="-1" aria-hidden="true" id="ddlIGSTPercentage_${item.ID}">
                      </select>                        
                   </td>
                    <td class="igst-amount text-right">${item.IGSTAmount}</td>                   
           
                    <td>
                      <select ${stControl} class="form-control applyselect CGSTPercentage"  tabindex="-1" aria-hidden="true" id="ddlCGSTPercentage_${item.ID}">
                      </select>                        
                   </td>
                    <td class="cgst-amount text-right">${item.CGSTAmount}</td> 
                    <td>
                      <select ${stControl} class="form-control applyselect  SGSTPercentage"  tabindex="-1" aria-hidden="true" id="ddlSGSTPercentage_${item.ID}">
                      </select>                        
                   </td>

                <td class="sgst-amount text-right">${item.SGSTAmount}</td>
                    <td class="total-cost text-right">${item.TotalCost}</td>
                `;
            tbody.appendChild(row);

            IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 116);            

            var $ele = $('#ddlIGSTPercentage_' + item.ID); // Now this will work
            $ele.empty();
            if (item.Igst_TAXID == 0) {
                $ele.append($('<option dataEle="0" />').val('0').text('0'));
            }
            else {
                $.each(IGSTTaxList, function (ii, vall) {
                    $ele.append($('<option dataEle=' + vall.ID + ' />').val(vall.ValueCode).text(vall.ValueName));
                })
            }
            $ele.val(item.IGSTPercentage);

            
            IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 137);
            

            var $ele1 = $('#ddlCGSTPercentage_' + item.ID); // Now this will work
            $ele1.empty();
            if (item.Cgst_TAXID == 0) {
                $ele1.append($('<option dataEle="0" />').val('0').text('0'));
            }
            else {
                $.each(IGSTTaxList, function (ii, vall) {
                    $ele1.append($('<option dataEle=' + vall.ID + ' />').val(vall.ValueCode).text(vall.ValueName));
                })
            }
            $ele1.val(item.CGSTPercentage);

            IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 158);

            var $ele2 = $('#ddlSGSTPercentage_' + item.ID); // Now this will work
            $ele2.empty();
            if (item.Sgst_TAXID == 0) {
                $ele2.append($('<option dataEle="0" />').val('0').text('0'));
            }
            else {
                $.each(IGSTTaxList, function (ii, vall) {
                    $ele2.append($('<option dataEle=' + vall.ID + ' />').val(vall.ValueCode).text(vall.ValueName));
                })
            }
            $ele2.val(item.SGSTPercentage);

            updateRowTotals(row);
        }
        else {

            IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 116);

            var $ele = $('#ddlIGSTPercentage_' + item.ID); // Now this will work
            $ele.empty();
            if (item.Igst_TAXID == 0) {
                $ele.append($('<option dataEle="0" />').val('0').text('0'));
            }
            else {
                $.each(IGSTTaxList, function (ii, vall) {
                    $ele.append($('<option dataEle=' + vall.ID + ' />').val(vall.ValueCode).text(vall.ValueName));
                })
            }
            $ele.val(item.IGSTPercentage);


            IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 137);


            var $ele1 = $('#ddlCGSTPercentage_' + item.ID); // Now this will work
            $ele1.empty();
            if (item.Cgst_TAXID == 0) {
                $ele1.append($('<option dataEle="0" />').val('0').text('0'));
            }
            else {
                $.each(IGSTTaxList, function (ii, vall) {
                    $ele1.append($('<option dataEle=' + vall.ID + ' />').val(vall.ValueCode).text(vall.ValueName));
                })
            }
            $ele1.val(item.CGSTPercentage);

            IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 158);

            var $ele2 = $('#ddlSGSTPercentage_' + item.ID); // Now this will work
            $ele2.empty();
            if (item.Sgst_TAXID == 0) {
                $ele2.append($('<option dataEle="0" />').val('0').text('0'));
            }
            else {
                $.each(IGSTTaxList, function (ii, vall) {
                    $ele2.append($('<option dataEle=' + vall.ID + ' />').val(vall.ValueCode).text(vall.ValueName));
                })
            }
            $ele2.val(item.SGSTPercentage);

            UpdateExisting(existingRow, IgstControl, stControl, item.IGSTPercentage, item.CGSTPercentage, item.SGSTPercentage);
            // ✅ Update SGST/CGST/IGST values always
            //existingRow.querySelector(".IGSTPercentage").innerText = item.IGSTPercentage;                
            //existingRow.querySelector(".CGSTPercentage").innerText = item.CGSTPercentage;                
            //existingRow.querySelector(".SGSTPercentage").innerText = item.SGSTPercentage;

            //existingRow.querySelector(".igst-amount").innerText = item.IGSTAmount;
            //existingRow.querySelector(".cgst-amount").innerText = item.CGSTAmount;
            //existingRow.querySelector(".sgst-amount").innerText = item.SGSTAmount;

        }
    });

    datechange(); // Ensure datepicker remains initialized
    // Hide datepicker when scrolling with mouse wheel
    $(window).on("wheel", function () {
        $(".daterangepicker").hide();
    });

    // Also hide on touchpad scroll or scrollbar scroll
    $(window).on("scroll", function () {
        $(".daterangepicker").hide();
    });

}
function UpdateExisting(row, IgstControl, stControl, IGSTPercentage, CGSTPercentage, SGSTPercentage) {
    const amountAfterDiscount = parseFloat(row.querySelector(".amount-after-discount").innerText) || 0;

    const igstPerc = IGSTPercentage;
    const cgstPerc = CGSTPercentage;
    const sgstPerc = SGSTPercentage;
    row.querySelector(".IGSTPercentage").value = IGSTPercentage;
    if (IgstControl != "")
        row.querySelector(".IGSTPercentage").disabled = true;
    else
        row.querySelector(".IGSTPercentage").disabled = false;

    row.querySelector(".CGSTPercentage").value = CGSTPercentage;
    row.querySelector(".SGSTPercentage").value = SGSTPercentage;
    if (stControl != "") {
        row.querySelector(".CGSTPercentage").disabled = true;
        row.querySelector(".SGSTPercentage").disabled = true;
    }
    else {
        row.querySelector(".CGSTPercentage").disabled = false;
        row.querySelector(".SGSTPercentage").disabled = false;
    }

    // Calculate each GST component
    const igstAmount = (amountAfterDiscount * igstPerc) / 100;
    const cgstAmount = (amountAfterDiscount * cgstPerc) / 100;
    const sgstAmount = (amountAfterDiscount * sgstPerc) / 100;

    // Calculate total cost
    const totalCost = amountAfterDiscount + igstAmount + cgstAmount + sgstAmount;

    // Update the DOM
    row.querySelector(".igst-amount").innerText = igstAmount.toFixed(2);
    row.querySelector(".cgst-amount").innerText = cgstAmount.toFixed(2);
    row.querySelector(".sgst-amount").innerText = sgstAmount.toFixed(2);
    row.querySelector(".total-cost").innerText = totalCost.toFixed(2);
}

//function SetZero(ctrl)
//{
//    //console.log($('#' + ctrl.id).val());
//    if (parseFloat(ctrl.value) < 0 || isNaN(ctrl.value)) {
//        ctrl.value = 0;
//    }
//}

function SetZero(ctrl) {
    let val = parseFloat(ctrl.value);
    console.log(`Input value: ${val}`);

    if (isNaN(val) || val < 0) {
        ctrl.value = '';
        return;
    }

    const decimalPart = ctrl.value.split('.')[1];
    if (decimalPart && decimalPart.length > 3) {
        // Floor to 2 decimal places
        val = Math.floor(val * 1000) / 1000;
        ctrl.value = val.toString();
    }
}



function updateOCTotals(row) {
    //let taxDDl = row.querySelector(".taxDdl");
    //var tax = $('#' + taxDDl.id + ' option[value="' + taxDDl.value + '"]').attr("dataEle")
    //let roundingAmount = parseFloat(tax) || 0;
    //let taxAmount = row.querySelector(".TaxAmount");
    //taxAmount.textContent = roundingAmount.toFixed(2);
    //let chargeAmount = row.querySelector(".ChargeAmount");   
    //let totalOtherChargeAmount = row.querySelector(".TotalOtherChargeAmount");  

    //// Get values
    //let cAmount = parseFloat(chargeAmount.value) || 0;   
    //let discountAmount = (cAmount * roundingAmount) / 100; 
    //let amountBeforeDiscount = cAmount + discountAmount;
    //totalOtherChargeAmount.textContent = amountBeforeDiscount.toFixed(2);

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

    let igstPercentage = parseFloat(row.querySelector(".IGSTPercentage").value) || 0;
    let cgstPercentage = parseFloat(row.querySelector(".CGSTPercentage").value) || 0;
    let sgstPercentage = parseFloat(row.querySelector(".SGSTPercentage").value) || 0;

    //var igstDdl = row.querySelector(".IGSTPercentage");    
    //const isgOption = igstDdl.options[igstDdl.selectedIndex];
    //const igstPercentage = parseFloat(isgOption.getAttribute('dataEle'));

    //var cgsttDdl = row.querySelector(".CGSTPercentage");
    //const cgstOption = cgsttDdl.options[cgsttDdl.selectedIndex];
    //const cgstPercentage = parseFloat(cgstOption.getAttribute('dataEle'));

    //var sgstDdl = row.querySelector(".SGSTPercentage");
    //const sgstOption = sgstDdl.options[sgstDdl.selectedIndex];
    //const sgstPercentage = parseFloat(sgstOption.getAttribute('dataEle'));



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
    const classList = event.target.classList;
    let row = event.target.closest("tr");

    if (
        event.target.classList.contains("quantity") ||
        event.target.classList.contains("unit-price") ||
        event.target.classList.contains("discount") ||
        event.target.classList.contains("IGSTPercentage") ||
        event.target.classList.contains("CGSTPercentage") ||
        event.target.classList.contains("SGSTPercentage")
    ) {

        if (classList.contains("CGSTPercentage"))
        {
            console.log("Triggered by CGSTPercentage");
            row.querySelector(".SGSTPercentage").value = row.querySelector(".CGSTPercentage").value;
        } else if (classList.contains("SGSTPercentage"))
        {
            console.log("Triggered by SGSTPercentage");
            
            row.querySelector(".CGSTPercentage").value = row.querySelector(".SGSTPercentage").value;
        }

     
        updateRowTotals(row);
    }

    if
        (
        event.target.classList.contains("ChargeAmount") ||
        event.target.classList.contains("TaxAmount") ||
        event.target.classList.contains("TotalOtherChargeAmount") ||
        event.target.classList.contains("taxDdl")
    ) {
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



function RefreshData() {

    $('#othercharge').modal('show');

    let tableBody = document.getElementById("tableToModify");
    let firstRow = tableBody.querySelector("tr:first-child"); // Get first row

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
                IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 116)
                $ddlTax.empty();
                $ddlTax.append($('<option/>').val('Select').text('Select'));
                $.each(IGSTTaxList, function (ii, vall) {
                    $ddlTax.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
                })
            }
            if (element.id == "ddlCTax_0") {

                var $ddlTax = $('#ddlCTax_0');
                IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 137)
                $ddlTax.empty();
                $ddlTax.append($('<option/>').val('Select').text('Select'));
                $.each(IGSTTaxList, function (ii, vall) {
                    $ddlTax.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
                })
            }
            if (element.id == "ddlSTax_0") {

                var $ddlTax = $('#ddlSTax_0');
                IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 158)
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
                    <select class="form-control applyselect ddlChargeName OMandate" id="ddlCharge_${RowId}" onchange="HideErrorMessage(this);setNARRCharges(this)">
					 
				    </select>
                    <span id="spddlCharge_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

                </td>
				<td>
                     <input type="number" value="${item.ChargeAmount}" id="txtChargeAmount_${RowId}" oninput="GetTax(this)" class="form-control text-right ChargeAmount OMandate" value="" placeholder="0" onchange="HideErrorMessage(this);SetZero(this)">
                                                                <span id="sptxtChargeAmount_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    </td>
				<td id="viewIGST_${RowId}">
                    <select class="form-control applyselect taxDdl OMandate" id="ddlTax_${RowId}" onchange="HideErrorMessage(this);GetTax(this)">
                                                <option>Select</option>
                                            </select>
                                            <span id="spddlTax_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

                    </td>
                    <td id="viewCGST_${RowId}">
                    <select class="form-control applyselect taxCDdl OMandate OCGSTPercentage" id="ddlCTax_${RowId}" onchange="HideErrorMessage(this);GetTax(this)">
                                                <option>Select</option>
                                            </select>
                                            <span id="spddlCTax_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

                    </td>
                    <td id="viewSGST_${RowId}">
                    <select class="form-control applyselect taxSDdl OMandate OSGSTPercentage" id="ddlSTax_${RowId}" onchange="HideErrorMessage(this);GetTax(this)">
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

            IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 116)
            CGSTTaxList = TaxList.filter(input => input.TYPE_ID == 137)
            SGSTTaxList = TaxList.filter(input => input.TYPE_ID == 158)

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


    let totalNetAmountSum = OtherChargesArray.reduce((sum, item) => sum + item.TotalNetAmount, 0);
    $('#otherChargesInputData').text(totalNetAmountSum.toFixed(2));
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

//function GetTax(ctr)
//{
//    var id = ctr.id.split('_');
//    var tax = $('#' + ctr.id + ' option[value="' + ctr.value + '"]').attr("dataEle")
//    let roundingAmount = parseFloat(tax) || 0;
//    var  ChargeAmt = $("#txtChargeAmount_" + id[1]).val();
//    let cAmount = parseFloat(ChargeAmt) || 0;
//    let discountAmount = (cAmount * roundingAmount) / 100;
//    let amountBeforeDiscount = cAmount + discountAmount;
//    $("#txtTax_" + id[1]).val(discountAmount).trigger('Change');
//    $("#spTotalOtherCharge_" + id[1]).text(amountBeforeDiscount.toFixed(2))
//}

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
    $("#spTotalOtherCharge_" + id[1]).html(amountBeforeDiscount.toFixed(2));
}

function datechange() {
    const Z = 9999999;

    // (Re)initialize safely
    $('.datepicker').each(function () {
        const $inp = $(this);
        if ($inp.data('drp-inited')) return; // prevent double init

        $inp.daterangepicker({
            opens: 'right',
            singleDatePicker: true,
            showDropdowns: true,
            autoApply: true,
            autoUpdateInput: false,
            parentEl: 'body',
            locale: { format: 'DD/MM/YYYY' }
        })
            .on('apply.daterangepicker', function (ev, picker) {
                $inp.val(picker.startDate.format('DD/MM/YYYY'));
                $inp.closest('.input-group').find('.clear-date').show();
            })
            .on('show.daterangepicker', function (ev, picker) {
                const $cal = picker.container;

                function place() {
                    // fixed to viewport
                    $cal.css({ top: '', left: '', right: '', bottom: '', position: 'fixed' });

                    const rect = $inp[0].getBoundingClientRect();
                    const winW = window.innerWidth;
                    const winH = window.innerHeight;

                    const popupW = $cal.outerWidth();
                    const popupH = $cal.outerHeight();

                    // prefer below, else above (viewport coords)
                    let top = rect.bottom + 6;
                    if (rect.bottom + popupH > winH) {
                        top = rect.top - popupH - 6;
                    }

                    // left aligned to input, clamped
                    let left = rect.left;
                    const vpLeft = 8, vpRight = winW - 8;
                    if (left + popupW > vpRight) left = Math.max(vpLeft, vpRight - popupW);
                    if (left < vpLeft) left = vpLeft;

                    // clamp vertical just in case
                    const vpTop = 8, vpBot = winH - 8;
                    if (top + popupH > vpBot) top = Math.max(vpTop, vpBot - popupH);
                    if (top < vpTop) top = vpTop;

                    $cal.css({ top, left, zIndex: Z });
                }

                const placeRAF = () => requestAnimationFrame(place);

                // initial after paint
                placeRAF();

                // keep stuck on viewport resize
                $(window).on('resize.drp', placeRAF);

                // Re-place on any calendar redraws (prev/next, month/year change, etc.)
                $inp.on('showCalendar.daterangepicker.drpfix', placeRAF);
                $cal.on('click.drpfix', '.prev, .next', placeRAF);
                $cal.on('change.drpfix', 'select.monthselect, select.yearselect', placeRAF);

                // Observe size changes of the popup (row count can change)
                let ro = null, mo = null;
                if ('ResizeObserver' in window) {
                    ro = new ResizeObserver(placeRAF);
                    ro.observe($cal[0]);
                } else if ('MutationObserver' in window) {
                    mo = new MutationObserver(placeRAF);
                    mo.observe($cal[0], { childList: true, subtree: true, attributes: true });
                }

                // clean up when hidden
                $inp.one('hide.daterangepicker', function () {
                    $(window).off('resize.drp', placeRAF);
                    $inp.off('showCalendar.daterangepicker.drpfix');
                    $cal.off('.drpfix');
                    if (ro) { try { ro.disconnect(); } catch (e) { } }
                    if (mo) { try { mo.disconnect(); } catch (e) { } }
                });
            });

        $inp.data('drp-inited', true);
    });

    // calendar icon click
    $(document)
        .off('click.drp', '.input-group-text')
        .on('click.drp', '.input-group-text', function () {
            $(this).closest('.input-group').find('.datepicker').focus();
        });

    // clear (×) button
    $(document)
        .off('click.drp', '.clear-date')
        .on('click.drp', '.clear-date', function () {
            const $input = $(this).closest('.input-group').find('.datepicker');
            $input.val('');
            $(this).hide();
        });

    // ensure popup always above everything
    if (!document.getElementById('drp-zfix')) {
        $('<style id="drp-zfix">.daterangepicker{z-index:9999999!important}</style>').appendTo(document.head);
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


    // Get Other Charges
    // let otherCharges = parseFloat($('.otherChargesInput').text().replace(/₹/g, '').trim()) || 0;
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
        event.target.classList.contains("IGSTPercentage") ||
        event.target.classList.contains("CGSTPercentage") ||
        event.target.classList.contains("SGSTPercentage") ||
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
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
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
         <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages1").appendChild(newDocument);
}
