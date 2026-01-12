$(document).ready(function () {

    $('#ddlBillingAddress').html('<option value="">Select</option>');
    $('#ddlShippingAddress').html('<option value="">Select</option>');

    LoadItemDropdown();
    //var obj1 = {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 8,
    //    manualTableId: 0,
    //    ScreenId: 'ERPDropdownList_101'
    //}
    //LoadMasterDropdown('ddlCustomer', obj1, 'Select', false);

    BindPartyList('ddlCustomer', 'ddlCustomerList', 0);

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 66,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlCurrency', obj2, 'Select', false);
    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 93,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlBrand', obj3, 'Select', false);

    BindDropdownTC('');
    BindDropdownPaymentTerm('');
    BindDropdownBillTo('1');
    BindDropdownshipTo('1');

    $('#ddlContactPerson').html('<option value="">Select</option>');

    if ($('#hdnOrderId').val() > 0) {
        GetOrderItemDetById($('#hdnOrderId').val());
    }
    else { GetSeriesList(); }


    $('#ddlBillingAddress').on('change', function () {

        if ($('#txtBillingAddressDet').html().toLowerCase().includes('india')) {
            $('#domestic').prop('checked', true);
        }
        else {
            $('#international').prop('checked', true);
            
        }
    })

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
    }, 'Select', false, selectedValue);
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

    LoadMasterDropdown('ddlShipTo', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 9,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false, selectedValue);

}

function SetDocNumber(ctrl) {
    var model =
    {
        ID: ctrl.value,
        SupplierId: 0,
        ModuleId: 7
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
        var tblDoc = response.data.data.Table;
        $('#txtOrderNo').val(tblDoc[0].DocNumber);
        //if (tblDoc[0].DOC_LOCK == 1) {
        //    $("#txtOrderNo").prop("disabled", true);
        //}
        //else {
        //    $("#txtOrderNo").prop("disabled", false);
        //}

        $("#txtOrderNo").prop("disabled", true);
    });
}

let globalBillingList = [];
let globalShippingList = [];

let globalItemCharges = [];

// ✅ Utility: Bind dropdown and optionally select a value
function bindDropdown($ddl, dataList, defaultText = 'Select', selectedId = null) {
    $ddl.empty().append($('<option>', { value: '', text: defaultText }));
    dataList.forEach(item => {
        $ddl.append($('<option>', {
            value: String(item.ID),
            text: item.ValueName
        }));
    });

    if (selectedId !== null && dataList.some(x => String(x.ID) === String(selectedId))) {
        $ddl.val(String(selectedId));
    }
}

// Load Customer Details + Dropdowns, then execute callback
function GetContactPersonByPAId(callback = null) {
    var customerId = parseInt($("#ddlCustomerId").val()) || 0;
    if (customerId > 0) {
        const model = JSON.stringify({ ID: customerId, Type: 1 });
        const screenId = "SaleOrderItem_101";

        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: model, screenId }, 'GET', function (response) {
            const { Table: brandData, Table1: contactList, Table2: billingList, Table3: shippingList } = response.data.data;

            // Brand
            if (Array.isArray(brandData) && brandData.length > 0) {
                $("#ddlBrand").val(brandData[0].BrandType).trigger('change');

                //$("#txtCustBrandName").val(brandData[0].BrandName);

                //if (brandData[0].PaymentTermsId && brandData[0].PaymentTermsId > 0) {
                //    $('#ddlPaymentTerm').val(brandData[0].PaymentTermsId).trigger('change');
                //}
                //else if (edit_payment_id && edit_payment_id > 0) {
                //    $('#ddlPaymentTerm').val(edit_payment_id).trigger('change');
                //}
                //else {
                //    $('#ddlPaymentTerm').val('Select').trigger('change');
                //}
                if (edit_orderId == 0)
                {
                    if (brandData[0].BrandName != '') {
                        $("#txtCustBrandName").val(brandData[0].BrandName);
                    }
                    else {
                        $("#txtCustBrandName").val('');
                    }

                    if (brandData[0].PaymentTermsId > 0) {
                        $('#ddlPaymentTerm').val(brandData[0].PaymentTermsId).trigger('change');
                    }
                    else {
                        $('#ddlPaymentTerm').val('Select').trigger('change');
                    }
                    if (brandData[0].Currency > 0) {
                        $('#ddlCurrency').val(brandData[0].Currency).trigger('change');
                    }
                    else {
                        $('#ddlCurrency').val('Select').trigger('change');
                    }
                }
            }

            //  Contact Person
            if (Array.isArray(contactList) && contactList.length > 0) {
                var contPersonId = 0;
                if (edit_orderId > 0 && edit_CustomerId != $("#ddlCustomerId").val()) {
                    contPersonId = contactList[0].ID;
                }
                else
                { contPersonId = edit_orderId == 0 && contactList[0].ID > 0 ? contactList[0].ID : edit_ContPersonId; }
                
                const $contactDdl = $('#ddlContactPerson');
                bindDropdown($contactDdl, contactList, 'Select', contPersonId);
                $contactDdl.trigger('change');
                $('#spddlContactPerson').hide();
            }
           
            //  Billing Address
            if (Array.isArray(billingList) && billingList.length > 0) {
                //var billAddressId = edit_orderId == 0 && billingList[0].ID > 0 ? billingList[0].ID : edit_billAddressId;
                //var fullBillAddress = edit_orderId == 0 && billingList[0].ValueName != '' ? billingList[0].ValueName : edit_FullBillAddress;

                var billAddressId = edit_orderId == 0 ? billingList[0].ID : edit_billAddressId;
                globalBillingList = billingList;
                const $billingDdl = $('#ddlBillingAddress');
                bindDropdown($billingDdl, billingList, 'Select', billAddressId);

                // Default select and show label
                // $('#txtBillingAddressDet').text(fullBillAddress);
                const selectedAddress = billingList.find(x => x.ID == billAddressId);
                if (selectedAddress) {
                    $('#txtBillingAddressDet').text(selectedAddress.ValueName);
                }


            }

            //  Shipping Address
            const ship = shippingList[0];

            if (ship.ValueName.includes('India')) {
                $('#domestic').prop('checked', true);
                $('#roundingAmt').prop('disabled', false);
            }
            else {
                $('#international').prop('checked', true);
                $('#roundingAmt').prop('disabled', true);
            }

            if (Array.isArray(shippingList) && shippingList.length > 0) {
                var shipAddressId = edit_orderId == 0 ? shippingList[0].ID : edit_ShipAddressId;
               
                globalShippingList = shippingList;
                const $shippingDdl = $('#ddlShippingAddress');
                bindDropdown($shippingDdl, shippingList, 'Select', shipAddressId);

                //  Default select and show label
                const selectedAddress = shippingList.find(x => x.ID == shipAddressId);
                if (selectedAddress) {
                    $('#txtShippingAddressDet').text(selectedAddress.ValueName);
                } 
            }

            //  Final callback
            if (typeof callback === 'function') {
                callback();
            }
        });


    } else if (typeof callback === 'function') {
        callback();
    }
}


//  Handle Billing/Shipping change display
$(document).ready(function () {
    $('#ddlBillingAddress').off('change').on('change', function () {
        const selectedId = $(this).val();
        const selected = globalBillingList.find(item => String(item.ID) === selectedId);
        $('#txtBillingAddressDet').text(selected ? selected.ValueName : '');
        console.log("Billing Address changed to ID:", selectedId);
    });

    $('#ddlShippingAddress').off('change').on('change', function () {
        const selectedId = $(this).val();
        const selected = globalShippingList.find(item => String(item.ID) === selectedId);
        $('#txtShippingAddressDet').text(selected ? selected.ValueName : '');
        console.log("Shipping Address changed to ID:", selectedId);
    });
});

// Main function: Load Order Item Details
var edit_orderId = 0;
var edit_CustomerId = 0;
var edit_ContPersonId;
var edit_billAddressId;
var edit_ShipAddressId;
var edit_payment_id

function GetOrderItemDetById(id) {
    const type = $('#hdnType').val() === 'SaleOrder' ? 2 : 3;
    const model = { ID: id, Type: type };
    const jsonString = JSON.stringify(model);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'SaleOrderItem_101' }, 'GET', function (response) {
        const tableData = response.data.data.Table;
        const tableData1 = response.data.data.Table1;
        const tableData2 = response.data.data.Table2;
        const tableData3 = response.data.data.Table3;

        if (!tableData || tableData.length === 0) return;

        const order = tableData[0];
        $("#hdnOrderId").val(order.Id);

        globalItemCharges = tableData3;


        if ($('#hdnPageType').val() === 'View')
        {
            $('#custName').text(tableData[0].PartyName);
            $('#ContPersonName').text(tableData[0].ContactPersonName);
            $('#custBrandName').text(tableData[0].CustBrandName);
            $('#crrName').text(tableData[0].Crr);
            $('#seriesNo').text(tableData[0].DocSeries);
            $('#seriesOrderNo').text(tableData[0].SaleOrderNo);
            $('#orderDate').text(tableData[0].OrderDate);
            $('#poNo').text(tableData[0].PONo);
            $('#poDate').text(tableData[0].PODate);
            $('#paymentTerms').text(tableData[0].PaymentTerms);
            $('#termsCondition').text(tableData[0].TermsConditions);
            $('#currecny').text(tableData[0].CurrencyName);
            $('#orderFor').text(tableData[0].OrderForStatus);

            $('#fullBillAddress').text(tableData[0].FullBillAddress);
            $('#fullShipAddress').text(tableData[0].FullShipAddress);

            $('#remarks').text(tableData[0].SaleRemark);

            $('#totalBeforeTax').text('₹ ' + tableData[0].TotalBeforeTax);
            $('#roundAmt').text('₹ ' + tableData[0].RoundingAmt);
            $('#totalAmt').text('₹ ' + tableData[0].TotalAmt);
            $('#advanceAmt').text('₹ ' + tableData[0].AdvanceAmt);
            $('#outstandingAmt').text('₹ ' + tableData[0].OutstandingAmt);

            ViewSaleOrderDet(tableData1, $('#hdnType').val());

            //Item Attachment
            for (var i = 0; i < response.data.data.Table2.length; i++) {
                var fileName = response.data.data.Table2[i].ActualFileName;
                var fileType = response.data.data.Table2[i].FileType;
                var type = response.data.data.Table2[i].Type;
                var fileUrl = response.data.data.Table2[i].FileUrl;
                var fFd = response.data.data.Table2[i].AttachmentId;
                var fSize = response.data.data.Table2[i].FileSize;
                var newfileName = response.data.data.Table2[i].NewFileName;
                var attachmentType = response.data.data.Table2[i].AttachmentType;
                //Check type and load
                if (attachmentType == 'Upload1') {
                    ViewLoadFileData1(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                    $('#NoUploadFile1').hide();
                    $('#ShowUploadFile1').show();
                }
                else if (attachmentType == 'Upload2') {
                    ViewLoadFileData2(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                    $('#NoUploadFile2').hide();
                    $('#ShowUploadFile2').show();
                }
            }
         
            $('#hdnType').val() === "SaleBulkOrder" ? $("#lblOrderFor").hide() : $("#lblOrderFor").show();
            
        }
        else {

            edit_orderId = order.Id
            edit_CustomerId = order.CustomerId
            edit_ContPersonId = order.ContactPersonId
            edit_payment_id = order.PaymentTermsId
            edit_billAddressId = order.BillToId
            edit_ShipAddressId = order.ShipToId

            $('#ddlCustomer').val(order.CustomerId).trigger('change');

            // Call when document is ready or after form initialization
            BindPartyList('ddlCustomer', 'ddlCustomerList', order.CustomerId);

            // ✅ Get related dropdowns, THEN continue filling
            //GetContactPersonByPAId(function () {
            //    $('#ddlContactPerson').val(order.ContactPersonId).trigger('change');
            //    $('#ddlBrand').val(order.BrandId).trigger('change');
            //    $('#ddlBillingAddress').val(order.BillToId).trigger('change');
            //    $('#ddlShippingAddress').val(order.ShipToId).trigger('change');

            //    $('#txtBillingAddressDet').text(
            //        globalBillingList.find(item => String(item.ID) === String(order.BillToId))?.ValueName || ''
            //    );

            //    $('#txtShippingAddressDet').text(
            //        globalShippingList.find(item => String(item.ID) === String(order.ShipToId))?.ValueName || ''
            //    );
            //});

            $('#ddlContactPerson').val(order.ContactPersonId).trigger('change');
            $('#txtCustBrandName').val(order.CustBrandName);

            var tblSeries = response.data.data.Table4;
            var $ele = $('#ddlDocSeries');
            $ele.empty();
            $.each(tblSeries, function (ii, vall) {
                var $option = $('<option />')
                    .val(vall.ID)
                    .text(vall.ValueName);

                $ele.append($option);

            })

            $("#ddlDocSeries").val(tableData[0].SeriesId);
            $('#txtOrderNo').val(order.SaleOrderNo);
            $('#txtOrderDate').val(order.OrderDate);
            $('#txtPONo').val(order.PONo);
            $('#txtPODate').val(order.PODate);

            $('#ddlPaymentTerm').val(order.PaymentTermsId).trigger('change');
            BindDropdownTC(order.TermsConditionId);

          
            $('#ddlTC').val(order.TermsConditionId).trigger('change');
            $('#ddlCurrency').val(order.CurrencyId).trigger('change');

            const selectedTypes = order.OrderFor.toString().split(',');
            selectedTypes.forEach(function (value) {
                $('input[name="OrderForType"][value="' + value + '"]').prop('checked', true);
            });

            $('#txtSaleRemark').val(order.SaleRemark);
            $('#totalBeforeTaxAmt').text(order.TotalBeforeTax);

            const tax = order.RoundingAmt;

            $('#roundingAmt').val(tax.toFixed(2));

            const totalAmt = order.TotalBeforeTax + tax;

            $('#totalAmt').text('₹ ' + totalAmt.toFixed(2));
            $('#advanceAmt').val(order.AdvanceAmt);

            const outAmt = totalAmt - order.AdvanceAmt;
            $('#oustandingAmt').text('₹ ' + outAmt.toFixed(2));

            // ✅ Order Items
            if (tableData1.length > 0) {
                FillItemData(tableData1);
                BindItemCharges(tableData3);
            }

            // ✅ Attachments
            console.log(tableData2);
            if (tableData2.length > 0) {
                for (let i = 0; i < tableData2.length; i++) {
                    const f = tableData2[i];
                    const loadFunc = f.AttachmentType === 'Upload1' ? LoadFileData1 : LoadFileData2;
                    loadFunc(f.ActualFileName, f.FileType, f.Type, f.FileUrl, f.AttachmentId, f.FileSize, f.NewFileName);
                }
            }
        }
        
        $('#lblReqName').text(tableData[0].CreatedName);
    });
}

function FillItemData(data) {
    // Call this function whenever you need to clear the table
    //clearTable();

    let tableBody = document.getElementById("tableToModify");

    data.forEach((item, index) => {
        if (index == 0) {
            $('#hdnOrderDetId_0').val(item.Id);
            $('#ddlItem_0').val(item.ItemId);
            $('#ddlI_0').val(item.ItemCode);
            $('#lblItemName_0').text(item.ItemName);
            $('#lblItemDesc_0').text(item.ItemDecription);
            $('#lblUnit_0').text(item.UOM);
            $('#lblItemPackSize_0').text(item.ItemPackSize);
            $('#txtQuantity_0').val(item.Qty);
            $('#txtItemType_0').val(item.ItemType);
            $('#txtRMPrice_0').val(item.RMPrice);
            $('#txtLabelPrice_0').val(item.LabelPrice);
            $('#txtMCartonPrice_0').val(item.MCartonPrice);
            $('#txtLCPrice_0').val(item.LCPrice);
            $('#txtMargin_0').val(item.Margin);
            $('#txtShrinkWrapPrice_0').val(item.ShrinkWrapPrice);
            $('#txtMasterCartonPrice_0').val(item.MasterCartonPrice);
            $('#txtSellingPrice_0').text('₹ ' + item.SellingPrice);

            fetchItemData(item.ItemCode, 0);
        }
        else {

            let row = document.createElement("tr");

            row.innerHTML = `

            <td class="text-center">
                <div id="addrow" class="deleterow cursor-pointer"><img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" /></div>
                <input type="hidden" id="hdnOrderDetId_${index}" value="${item.Id}"/>
            </td>
            <td>
                    <div class="autocomplete-wrapper" style="position: relative;">
                        <label for="ddlI_${index}" class="search-label">
                            <img src="../../../assets/images/icons/help/search-icon.png" class="icon-sm" />
                        </label>
                        <input type="text" class="form-control searchlist MandateOrder" id="ddlI_${index}" value="${item.ItemCode}"  oninput="Getdata(this)" placeholder="Type item..." autocomplete="off" onchange="HideErrorMessage(this)"/>
                        <ul id="globalSuggestionBox_${index}" class="suggestions"></ul>                       
                       <input type="hidden" id="ddlItem_${index}" value="${item.ItemId}" />

                    </div>
                
            </td>
            <td id="lblItemName_${index}">${item.ItemName}</td>
            <td id="lblItemPackSize_${index}">${item.ItemPackSize}</td>
            <td>
                <input type="number" id="txtQuantity_${index}" class="form-control text-right MandateWithoutZero" value="${item.Qty}" placeholder="0" oninput="HideErrorMessage(this); CalculateRate(this); SetZero(this)">
				<span id="sptxtQuantity_${index}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
		    </td>
            <td id="lblUnit_${index}">${item.UOM}</td>
           
            <td><label class="lblItemPackSize" id="sfgcost_${index}">----</label></td>
            <td><label class="lblItemPackSize" id="sfgcostpc_${index}">----</label></td>
            <td><label class="lblItemPackSize" id="packcost_${index}">----</label></td>
            <td><label class="lblItemPackSize" id="otcharges_${index}">----</label></td>
            <td><label class="lblItemPackSize" id="sellingprice_${index}">----</label></td>
            <td><label class="lblItemPackSize" id="totalcost_${index}">----</label></td>
            <td class="text-center">
              <a class="open-other-charges" data-row-index="${index}"
                 onclick="handleBOMEdit(this)">
                Edit BOM
              </a>
              <input type="hidden" id="otherChargesJson_${index}" value="{}">
            </td>
        `;

            tableBody.appendChild(row);

            fetchItemData(item.ItemCode, index);

            //var $ele = $('#ddlItem_' + index);
            //$ele.empty();
            //$ele.append($('<option/>').val('Select').text('Select'));
            //$.each(ItemCodeList, function (ii, vall) {
            //    $ele.append($('<option />').val(vall.ITEM_ID).text(vall.ITEM_CODE));
            //})
            //$ele.val(item.ItemID);
        }
    });


}

// Function to Populate Table from JSON

//function ViewSaleOrderDet(data) {
//    $('#datatableSaleOrder').DataTable({
//        "processing": true, // for show progress bar
//        "destroy": true,
//        "data": data,
//        "dom": "t",
//        pageLength: data.length,
//        "columns": [
//            { "data": "ItemCode" },
//            { "data": "ItemName" },
//            { "data": "ItemPackSize" },
//            { "data": "Qty" },
//            { "data": "UOM" },

//            { "data": "RMPrice" },
//            { "data": "LabelPrice" },
//            { "data": "MCartonPrice" },
//            { "data": "LCPrice" },
//            { "data": "Margin" },
//            { "data": "ShrinkWrapPrice" },
//            { "data": "MasterCartonPrice" },
//            {
//                "data": "SellingPrice",
//                "render": function (data, type, row) {
//                    return '₹ ' + data
//                }
//            },
//            {
//                "data": "Id", // <- Needed to get ID from row
//                "orderable": false,
//                "render": function (data, type, row) {
//                    return `
//                    <a href="#" class="open-charges-modal" data-orderdetid="${data}">
//                        <img src="/assets/images/icons/help/edit-icon.png" class="icon-sm" alt="Edit" />
//                    </a>`;
//                }
//            }
//        ]
//    });
//}

function ViewSaleOrderDet(data, type) {
    // Hide both tables first
    $('#datatableSaleOrder, #datatableSaleBulkOrder').hide();

    // Select table based on type
    const $table = type === 'SaleOrder' ? $('#datatableSaleOrder') : $('#datatableSaleBulkOrder');
    $table.show(); // Show relevant table

    // Clear existing rows
    $table.find('tbody').remove();
    const $tbody = $('<tbody></tbody>');

    if (type === 'SaleOrder') {
        data.forEach((item, index) => {
            const rowId = index;

            // Calculate values from fetchItemData
            const model = { Id: 1, ItemCode: item.ItemCode, Type: 30 };
            const jsonString = JSON.stringify(model);

            CommonAjaxMethod(
                virtualPath + 'Generic/GetRecordsAsync',
                { modelData: jsonString, screenId: 'ERP_Samp5_101' },
                'GET',
                function (response) {
                    const tblData = response?.data?.data?.Table;

                    let sale_rate = 0,
                        sale_rate_pcs = 0,
                        pack_cost = 0,
                        ot_charges = 0,
                        total = 0,
                        total_cost = 0;

                    const qty = parseFloat(item.Qty) || 0;

                    if (tblData && tblData.length > 0) {
                        sale_rate = parseFloat(tblData[0].SaleRate) || 0;
                        pack_cost = parseFloat(tblData[0].TotalPack) || 0;
                        ot_charges = parseFloat(tblData[0].TotalOtCharges) || 0;

                        sale_rate_pcs =
                            (parseFloat(tblData[0].Qty) || 0) *
                            (parseFloat(tblData[0].CONVERSION_FACTOR) || 0) *
                            (parseFloat(tblData[0].SaleRate) || 0);
                        const quantity = parseFloat($('#txtQuantity_' + rowId).val()) || 0;

                        /* total = sale_rate + pack_cost + ot_charges;*/
                        total = sale_rate_pcs + pack_cost + ot_charges;
                        total_cost = qty * total;
                    }

                    const $row = $(`
                    <tr>
                        <td>${item.ItemCode || ''}</td>
                        <td>${item.ItemName || ''}</td>
                        <td>${item.ItemPackSize || ''}</td>
                        <td class="text-right">${qty}</td>
                        <td>${item.UOM || ''}</td>
                        <td class="text-right">₹ ${sale_rate.toFixed(2)}</td>
                        <td class="text-right">₹ ${sale_rate_pcs.toFixed(2)}</td>
                        <td class="text-right">₹ ${pack_cost.toFixed(2)}</td>
                        <td class="text-right">₹ ${ot_charges.toFixed(2)}</td>
                        <td class="text-right">₹ ${total.toFixed(2)}</td>
                        <td class="text-right">₹ ${total_cost.toFixed(2)}</td>
                         <td class="text-center linktext" onclick="showTaskModal(${item.Id})">View Status</td>
                    </tr>
                `);

                    $tbody.append($row);

                    // Append tbody after last async call
                    if (index === data.length - 1) {
                        $table.append($tbody);

                        // ✅ Calculate total before tax
                        let totalBeforeTax = 0;
                        $tbody.find('tr').each(function () {
                            const val = $(this).find('td:nth-last-child(2)').text().replace(/[₹,]/g, '').trim();
                            totalBeforeTax += parseFloat(val) || 0;
                        });
                        $('#totalBeforeTax').text('₹ ' + totalBeforeTax.toFixed(2));
                    }
                }
            );
        });
    }
    else {

        data.forEach((item) => {
            const qty = parseFloat(item.Qty) || 0;
            const refPrice = parseFloat(item.ReferenceSellingPrice) || 0;
            const samplePrice = parseFloat(item.SampleSellingPrice) || 0;
            const sellingPrice = parseFloat(item.SellingPrice) || 0;
            const packaging = parseFloat(item.TotalPackagingCharges) || 0;

            const total = qty * (sellingPrice + packaging);

            const $row = $(`
                <tr>
                    <td>${item.SampleDetDocNo || ''}</td>
                    <td>${item.ItemCode || ''}</td>
                    <td>${item.ItemName || ''}</td>
                    <td class="text-right">${qty}</td>
                    <td>${item.UOM || ''}</td>
                    <td class="text-right">₹ ${item.RefSellingPrice.toFixed(2)}</td>
                    <td class="text-right">₹ ${item.SampleSellingPrice.toFixed(2)}</td>
                    <td class="text-right">₹ ${item.SellingPricePerUnit.toFixed(2)}</td>
                    <td class="text-right">₹ ${item.PackagingCharges.toFixed(2)}</td>
                    <td class="text-right">₹ ${item.TotalAmt.toFixed(2)}</td>
                </tr>
            `);

            $tbody.append($row);
        });

        $table.append($tbody);

        // ✅ Calculate total before tax
        let totalBeforeTax = 0;
        $tbody.find('tr').each(function () {
            const val = $(this).find('td:last').text().replace(/[₹,]/g, '').trim();
            totalBeforeTax += parseFloat(val) || 0;
        });
        $('#totalBeforeTax').text('₹ ' + totalBeforeTax.toFixed(2));
    }
}

function showTaskModal(id) {
    $.get('/Account/GetTaskStatusModal', { id: id, auth: AuthToken, FMS_Id: 6, }, function (data) {
        $('#yourModalContainer').html(data);
        $('#viewstatus').modal('show');
    });
}



$(document).on('click', '.open-charges-modal', function (e) {
    e.preventDefault();

    const orderDetId = $(this).data('orderdetid');

    const charges = globalItemCharges.filter(c => c.OrderDetId == orderDetId); 

    const $container = $('#chargeListContainer');
    $container.empty();

    if (charges.length > 0) {
        charges.forEach(c => {
            const name = c.ChargeName || 'Unnamed';
            const value = parseFloat(c.ChargeValue || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            const html = `
                <div class="col-sm-12 form-group d-flex justify-content-between">
                    <label>${name}</label>
                    <p>₹ ${value}</p>
                </div>`;
            $container.append(html);
        });
    } else {
        $container.html('<div class="col-sm-12 text-center text-muted">No charges found for this item.</div>');
    }

    $('#ItemOtherChargesModal').modal('show');
});


//function BindItemCharges(chargesTable) {
//    let groupedCharges = {};

//    // Step 1: Group by OrderDetId
//    chargesTable.forEach(charge => {
//        const orderDetId = charge.OrderDetId;
//        const chargeName = charge.ChargeName;
//        const chargeValue = charge.ChargeValue;

//        if (!groupedCharges[orderDetId]) {
//            groupedCharges[orderDetId] = {};
//        }

//        groupedCharges[orderDetId][chargeName] = chargeValue;
//    });

//    // Step 2: Match to table row by OrderDetId (via hidden field) and assign to itemOtherChargesMap
//    $("input[id^='hdnOrderDetId_']").each(function (i) {
//        const orderDetId = parseInt($(this).val());

//        if (groupedCharges[orderDetId]) {
//            itemOtherChargesMap[i] = {
//                SemiFinishedGoods: groupedCharges[orderDetId].SemiFinishedGoods || 0,
//                PrimaryPackaging: groupedCharges[orderDetId].PrimaryPackaging || 0,
//                CapPump: groupedCharges[orderDetId].CapPump || 0,
//                PrintLabel: groupedCharges[orderDetId].PrintLabel || 0,
//                PrintMCarton: groupedCharges[orderDetId].PrintMCarton || 0,
//                Leaflet: groupedCharges[orderDetId].Leaflet || 0,
//                ShrinkWrap: groupedCharges[orderDetId].ShrinkWrap || 0,
//                MasterCarton: groupedCharges[orderDetId].MasterCarton || 0,
//                ConversionCost: groupedCharges[orderDetId].ConversionCost || 0,
//                Margin: groupedCharges[orderDetId].Margin || 0,
//                OtherCost: groupedCharges[orderDetId].OtherCost || 0
//            };

//        }
//    });
//}

var itemOtherChargesMap = {};   // Global object to store charges by row index

function BindItemCharges(chargesTable) {
    let groupedCharges = {};

    // Group by OrderDetId
    chargesTable.forEach(charge => {
        const orderDetId = charge.OrderDetId;
        const chargeName = charge.ChargeName;
        const chargeValue = charge.ChargeValue;

        if (!groupedCharges[orderDetId]) {
            groupedCharges[orderDetId] = {};
        }

        groupedCharges[orderDetId][chargeName] = chargeValue;
    });

    // Map grouped charges to each row (via hidden input)
    $("input[id^='hdnOrderDetId_']").each(function (i) {
        const orderDetId = parseInt($(this).val());
        if (groupedCharges[orderDetId]) {
            itemOtherChargesMap[i] = groupedCharges[orderDetId];
        }
    });
}


// Preview the file based on its type
function LoadFileData1(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    var fileObject =
    {
        "TypeDetails": type,
        "FileType": fileType,
        "FolderNames": "SaleOrderItemDocuments/",
        "ActualFileName": fileName,
        "NewFileName": newfileName,
        "FileUrl": fileUrl,
        "FileSize": sSize,

    };
    fileModelList.push(fileObject);

    let previewElement;

    let filename_len = fileName.split(".").length;

    let file_ext = fileName.split(".")[filename_len - 1];

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                       <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile1(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
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
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    }
    else if (type === "application/octet-stream" || file_ext == "psd") {

        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/psd-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;

    }
    else if (type === "application/postscript") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/ai-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    }
    else {
        previewElement = `<div class="file-preview">
         <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file1");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages1").appendChild(newDocument);
}

function LoadFileData2(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    var fileObject =
    {
        "TypeDetails": type,
        "FileType": fileType,
        "FolderNames": "SaleOrderItemDocuments/",
        "ActualFileName": fileName,
        "NewFileName": newfileName,
        "FileUrl": fileUrl,
        "FileSize": sSize,

    };
    fileModelList1.push(fileObject);


    let filename_len = fileName.split(".").length;

    let file_ext = fileName.split(".")[filename_len - 1];



    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile2(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
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
                        <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/octet-stream" || file_ext == "psd") {

        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/psd-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;

    }
    else if (type === "application/postscript") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/ai-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    }
    else {
        previewElement = `<div class="file-preview">
         <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file2");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages2").appendChild(newDocument);
}

function GetSeriesList() {
    var model =
    {
        ID: 0,
        OtherId: 0,
        ModuleId: 7
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
        var DOC_LOCK = false;
        var tblSeries = response.data.data.Table;
        var tblDoc = response.data.data.Table1;

        $('#txtOrderNo').val(tblDoc[0].DocNumber);
        var dt = new Date();
        var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
        $('#txtOrderDate').val(newDate);
        /*$('#txtPODate').val(newDate);*/

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

        //if (DOC_LOCK == true) {
        //    $("#txtOrderNo").prop("disabled", true);
        //}
        //else {
        //    $("#txtOrderNo").prop("disabled", false);
        //}

        $("#txtOrderNo").prop("disabled", true);

        $('#lblReqName').text(loggedinUserName);
    });

}

// Delete a row
$(document).on("click", ".deleterow", function () {
    $(this).closest("tr").remove();
    updateTotals();
});

// --- init tooltips helper (always use container:'body') ---
function initTooltips(ctx) {
    $(ctx).find('[data-toggle="tooltip"]').tooltip({
        container: 'body',
        boundary: 'window',
        trigger: 'hover focus'
    });
}
// Call once on page load for any existing icons
$(function () { initTooltips(document); });

// --- safer row index generator (avoids duplicate IDs after deletions) ---
function getNextRowIndex() {
    const ids = Array.from(document.querySelectorAll('input[id^="hdnOrderDetId_"]'))
        .map(el => parseInt(el.id.split('_').pop(), 10))
        .filter(n => !isNaN(n));
    return ids.length ? Math.max(...ids) + 1 : 1;
}

// --- Add row ---
$("#addrow").on('click', function () {
    const RowId = getNextRowIndex();
    const newRow = `
      <tr>
        <td>
          <div class="deleterow text-center cursor-pointer">
            <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
            <input type="hidden" id="hdnOrderDetId_${RowId}" />
          </div>
        </td>
        <td>
          <div class="autocomplete-wrapper" style="position: relative;">
            <label for="ddlI_${RowId}" class="search-label">
              <img src="../../../assets/images/icons/help/search-icon.png" class="icon-sm" />
            </label>
            <input type="text" class="form-control searchlist Mandate" id="ddlI_${RowId}"
                   oninput="Getdata(this)" onclick="Getdata(this)"
                   placeholder="Type item..." autocomplete="off" />
            <span id="spddlI_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
            <ul id="globalSuggestionBox_${RowId}" class="suggestions"></ul>
            <input type="hidden" id="ddlItem_${RowId}" />
          </div>
        </td>
        <td><label class="lblItemName" id="lblItemName_${RowId}"></label></td>
        <td><label class="lblItemPackSize" id="lblItemPackSize_${RowId}"></label></td>
        <td>
          <input type="number" id="txtQuantity_${RowId}" class="form-control text-right MandateWithoutZero" oninput="HideErrorMessage(this); CalculateRate(this); SetZero(this)" placeholder="0">
          <span id="sptxtQuantity_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
        </td>
        <td><label class="lblItemName" id="lblUnit_${RowId}"></label></td>
          <td><label class="lblItemPackSize" id="sfgcost_${RowId}">----</label></td>
          <td><label class="lblItemPackSize" id="sfgcostpc_${RowId}">----</label></td>
                                <td><label class="lblItemPackSize" id="packcost_${RowId}">----</label></td>
                                <td><label class="lblItemPackSize" id="otcharges_${RowId}">----</label></td>
                                <td><label class="lblItemPackSize" id="sellingprice_${RowId}">----</label></td>
                                <td><label class="lblItemPackSize" id="totalcost_${RowId}">----</label></td>
        <td class="text-center">
          <a  class="open-other-charges" data-row-index="${RowId}"
             onclick="handleBOMEdit(this)">
            Edit BOM
          </a>
          <input type="hidden" id="otherChargesJson_${RowId}" value="{}">
        </td>
      </tr>`;


    // Append, then init plugins/tooltip for the new row only
    const $tbody = $(".itemsinformation tbody");
    $tbody.append(newRow);

    const $lastRow = $tbody.find('tr:last');
    $lastRow.find('.applyselect').select2?.();
    initTooltips($lastRow);

    // If you intended to preload item data, pass the right element:
    // var inputElement = $('#ddlI_' + RowId)[0];
    // Getdata(inputElement);
});

function handleBOMEdit(elem) {

    const rowIndex = elem.getAttribute("data-row-index");

    const data = ItemCodeList.filter((input) => input.ITEM_ID == $('#ddlItem_' + rowIndex).val() && input.ITEM_CODE == $('#ddlI_' + rowIndex).val())

    if (data && data.length > 0) {
        localStorage.setItem('viewBOM', false);
        const url = `/ManageBOM/CreateBOMFG?auth=${AuthToken}&bomId=${data[0].bomId}&IsEdit=1`;
        window.open(url, '_blank'); // ✅ opens in new tab
    }
    else {
        FailToaster('Please select a valid Item!!!');
    }

}

// --- Delete row (dispose tooltips before removal) ---
$(document).on('click', '.deleterow', function (e) {
    e.preventDefault();
    const $tr = $(this).closest('tr');

    // Hide & dispose every tooltip inside this row
    $tr.find('[data-toggle="tooltip"]').each(function () {
        try { $(this).tooltip('hide').tooltip('dispose'); } catch (ex) { }
    });

    // Remove the row
    $tr.remove();

    // Extra safety: remove any orphan tooltip nodes appended to body
    $('body > .tooltip').remove(); 
});


var ItemCodeList = [];
function LoadItemDropdown() {
    var model =
    {
        ColumnName: 'Name',
        SearchData: "",
        Type: 3
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_104' }, 'GET', function (response) {

        ItemCodeList = response.data.data.Table;
        //var $ele = $('#ddlItem_0');
        //$ele.empty();
        //$ele.append($('<option/>').val('Select').text('Select'));
        //$.each(ItemCodeList, function (ii, vall)
        //{
        //    var displayText = vall.ITEM_NAME + " (" + vall.ITEM_CODE + ")"; // Format: ITEM_NAME (ITEM_CODE)
        //    $ele.append($('<option />').val(vall.ITEM_ID).text(displayText));
        //})
    });
}
function FillItemDetails(ctrl) {
    var itemId = ctrl.value;
    var ctrlId = ctrl.id.split('_')[1];
    var model = {
        ID: itemId
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_101' }, 'GET', function (response) {

        var data = response.data.data.Table;
        $('#' + 'lblItemName_' + ctrlId).text(data[0].ITEM_NAME);
        $('#' + 'lblItemDesc_' + ctrlId).text(data[0].DESCRIPTION);
        $('#' + 'lblUnit_' + ctrlId).text(data[0].UNIT);
        $('#' + 'lblItemPackSize_' + ctrlId).text(data[0].PackSize);
    });
}

function Getdata(inputElement) {
    let rowId = inputElement.id.split('_')[1]; // Extract RowId from input ID
    let suggestionBox = document.getElementById(`globalSuggestionBox_${rowId}`);

    let search = inputElement.value.toLowerCase();
    suggestionBox.innerHTML = "";

    //if (search.length < 2) {
    //    suggestionBox.style.display = "none";
    //    return;
    //}

    let matchedItems = ItemCodeList.filter(item =>
       (item.ITEM_DISPLAY.toLowerCase().includes(search) || item.ITEM_DISPLAY.toLowerCase().includes(search))
        && item.customer_id == $('#ddlCustomerId').val()
    );

    if (matchedItems.length === 0) {
        suggestionBox.innerHTML = `<li class="errordata">No data found</li>`;
    } else {
        matchedItems.forEach(item => {
            let li = document.createElement("li");
            li.textContent = `${item.ITEM_DISPLAY}`;
            li.dataset.id = item.ITEM_ID;
            li.dataset.name = item.ITEM_NAME;
            li.dataset.code = item.ITEM_CODE;

            li.addEventListener("click", function () {
                inputElement.value = item.ITEM_CODE; // Set selected value in input
                suggestionBox.style.display = "none";

                $(`#ddlItem_` + rowId).val(item.ITEM_ID);
                $(`#lblItemName_` + rowId).text(item.ITEM_NAME);
                $(`#lblItemDesc_` + rowId).text(item.DESCRIPTION);
                $(`#lblUnit_` + rowId).text(item.UNIT);
                $(`#lblItemPackSize_` + rowId).text(item.Pack_Size);

                fetchItemData(item.ITEM_CODE, rowId);

                // Auto-fetch and bind other charges after item selection
                 fetchAndBindOtherChargesByItemCode(item.ITEM_CODE, rowId);

            });

            suggestionBox.appendChild(li);
        });
    }

    // Positioning
    let rect = inputElement.getBoundingClientRect();
    suggestionBox.style.top = rect.bottom + "px";
    suggestionBox.style.left = rect.left + "px";
    suggestionBox.style.width = rect.width + "px";
    suggestionBox.style.display = "block";
}


function fetchItemData(item_Code, rowId) {
    const model = {
        Id: 1,
        ItemCode: item_Code,
        Type: 30
    };

    const jsonString = JSON.stringify(model);

    CommonAjaxMethod(
        virtualPath + 'Generic/GetRecordsAsync',
        { modelData: jsonString, screenId: 'ERP_Samp5_101' },
        'GET',
        function (response) {
            const tblData = response?.data?.data?.Table;

            if (tblData && tblData.length > 0) {
                // ✅ safely parse all values as floats
                const sale_rate = parseFloat(tblData[0].SaleRate) || 0;
                const pack_cost = parseFloat(tblData[0].TotalPack) || 0;
                const ot_charges = parseFloat(tblData[0].TotalOtCharges) || 0;
                const sale_rate_pcs =
                    (parseFloat(tblData[0].Qty) || 0) *
                    (parseFloat(tblData[0].CONVERSION_FACTOR) || 0) *
                    (parseFloat(tblData[0].SaleRate) || 0);
                const quantity = parseFloat($('#txtQuantity_' + rowId).val()) || 0;

                // ✅ proper arithmetic (numbers, not strings)
                const total = sale_rate_pcs + pack_cost + ot_charges;
                const total_cost = quantity * total;

                // ✅ format for display
                $('#sfgcost_' + rowId).html(`₹ ${sale_rate.toFixed(2)}`);
                $('#sfgcostpc_' + rowId).html(`₹ ${sale_rate_pcs.toFixed(2)}`);
                $('#packcost_' + rowId).html(`₹ ${pack_cost.toFixed(2)}`);
                $('#otcharges_' + rowId).html(`₹ ${ot_charges.toFixed(2)}`);
                $('#sellingprice_' + rowId).html(`₹ ${total.toFixed(2)}`);
                $('#totalcost_' + rowId).html(`₹ ${total_cost.toFixed(2)}`);

            } else {
                console.warn('No data found for item code:', item_Code);
            }

            let totalBeforeTax = 0;

            const rows = document.querySelectorAll('[id^="totalcost_"]');
            rows.forEach(cell => {
                const priceText = cell.textContent.replace(/[₹,]/g, '').trim();
                const price = parseFloat(priceText) || 0;
                totalBeforeTax += price;
            });

            // Display Total Before Tax
            document.getElementById('totalBeforeTaxAmt').textContent = totalBeforeTax.toFixed(2);
        }
    );
}

function CalculateRate(ctrl) {

    var rowId = ctrl.id.split('_')[1];

    const sale_rate = parseFloat($('#sfgcostpc_' + rowId).html().replace(/[₹,\s]/g, '')) || 0;
    const pack_cost = parseFloat($('#packcost_' + rowId).html().replace(/[₹,\s]/g, '')) || 0;
    const ot_charges = parseFloat($('#otcharges_' + rowId).html().replace(/[₹,\s]/g, '')) || 0;
    const quantity = parseFloat($('#txtQuantity_' + rowId).val()) || 0;

    // ✅ proper arithmetic (numbers, not strings)
    const total = sale_rate + pack_cost + ot_charges;
    const total_cost = quantity * total;

    $('#totalcost_' + rowId).html(`₹ ${total_cost.toFixed(2)}`);

    let totalBeforeTax = 0;
    const rows = document.querySelectorAll('[id^="totalcost_"]');
    rows.forEach(cell => {
        const priceText = cell.textContent.replace(/[₹,]/g, '').trim();
        const price = parseFloat(priceText) || 0;
        totalBeforeTax += price;
    });

    // Display Total Before Tax
    document.getElementById('totalBeforeTaxAmt').textContent = totalBeforeTax.toFixed(2);

    updateTotals();
}

function changeItemData() {

    $('#tableToModify').html(`	 <tr>
                                <td class="text-center">
                                    <div id="addrow" class="cursor-pointer"><img src="../../assets/images/icons/help/add.svg" alt="" /></div>
                                    <input type="hidden" id="hdnOrderDetId_0" />
                                </td>
                                <td>

                                    <div class="autocomplete-wrapper" style="position: relative;">
                                        <label for="ddlI_0" class="search-label">
                                            <img src="../../../assets/images/icons/help/search-icon.png" class="icon-sm" />
                                        </label>
                                        <input type="text" class="form-control searchlist Mandate" id="ddlI_0" oninput="Getdata(this)" onclick="Getdata(this)" placeholder="Type item..." autocomplete="off" />
                                        <span id="spddlI_0" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                                        <ul id="globalSuggestionBox_0" class="suggestions"></ul>
                                        <input type="hidden" id="ddlItem_0" />
                                    </div>

                                </td>
                                <td>
                                    <label class="lblItemName m-0 p-0" id="lblItemName_0"></label>
                                </td>
                          
                                <td><label class="lblItemPackSize" id="lblItemPackSize_0"></label></td>
                                <td>
                                    <input type="number" id="txtQuantity_0" class="form-control text-right MandateWithoutZero" value="" placeholder="0" oninput="HideErrorMessage(this); CalculateRate(this); SetZero(this)">
                                    <span id="sptxtQuantity_0" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>

                                </td>
                                <td><label class="lblItemName" id="lblUnit_0"></label></td>
                                <td><label class="lblItemPackSize" id="sfgcost_0">----</label></td>
                                <td><label class="lblItemPackSize" id="sfgcostpc_0">----</label></td>
                                <td><label class="lblItemPackSize" id="packcost_0">----</label></td>
                                <td><label class="lblItemPackSize" id="otcharges_0">----</label></td>
                                <td><label class="lblItemPackSize" id="sellingprice_0">----</label></td>
                                <td><label class="lblItemPackSize" id="totalcost_0">----</label></td>
                               
                                <td class="text-center">
                                    <a 
                                       class="open-other-charges"
                                       data-row-index="0"
                                       onclick="handleBOMEdit(this)">   
                                      
                                        Edit BOM
                                    </a>
                                    <!--  Add this hidden field below the link -->
                                    <input type="hidden" id="otherChargesJson_0" value="{}">
                                </td>
                            </tr>`);


    $("#addrow").on('click', function () {
        const RowId = getNextRowIndex();
        const newRow = `
      <tr>
        <td>
          <div class="deleterow text-center cursor-pointer">
            <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
            <input type="hidden" id="hdnOrderDetId_${RowId}" />
          </div>
        </td>
        <td>
          <div class="autocomplete-wrapper" style="position: relative;">
            <label for="ddlI_${RowId}" class="search-label">
              <img src="../../../assets/images/icons/help/search-icon.png" class="icon-sm" />
            </label>
            <input type="text" class="form-control searchlist Mandate" id="ddlI_${RowId}"
                   oninput="Getdata(this)" onclick="Getdata(this)"
                   placeholder="Type item..." autocomplete="off" />
            <span id="spddlI_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
            <ul id="globalSuggestionBox_${RowId}" class="suggestions"></ul>
            <input type="hidden" id="ddlItem_${RowId}" />
          </div>
        </td>
        <td><label class="lblItemName" id="lblItemName_${RowId}"></label></td>
        <td><label class="lblItemPackSize" id="lblItemPackSize_${RowId}"></label></td>
        <td>
          <input type="number" id="txtQuantity_${RowId}" class="form-control text-right MandateWithoutZero" oninput="HideErrorMessage(this); CalculateRate(this); SetZero(this)" placeholder="0">
          <span id="sptxtQuantity_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
        </td>
        <td><label class="lblItemName" id="lblUnit_${RowId}"></label></td>
          <td><label class="lblItemPackSize" id="sfgcost_${RowId}">----</label></td>
          <td><label class="lblItemPackSize" id="sfgcostpc_${RowId}">----</label></td>
                                <td><label class="lblItemPackSize" id="packcost_${RowId}">----</label></td>
                                <td><label class="lblItemPackSize" id="otcharges_${RowId}">----</label></td>
                                <td><label class="lblItemPackSize" id="sellingprice_${RowId}">----</label></td>
                                <td><label class="lblItemPackSize" id="totalcost_${RowId}">----</label></td>
        <td class="text-center">
          <a class="open-other-charges" data-row-index="${RowId}"
             onclick="handleBOMEdit(this)">
            Edit BOM
          </a>
          <input type="hidden" id="otherChargesJson_${RowId}" value="{}">
        </td>
      </tr>`;

        // Append, then init plugins/tooltip for the new row only
        const $tbody = $(".itemsinformation tbody");
        $tbody.append(newRow);

        const $lastRow = $tbody.find('tr:last');
        $lastRow.find('.applyselect').select2?.();
        initTooltips($lastRow);

        // If you intended to preload item data, pass the right element:
        // var inputElement = $('#ddlI_' + RowId)[0];
        // Getdata(inputElement);
    });

}
function fetchAndBindOtherChargesByItemCode(itemCode, rowIndex) {
    if (!itemCode) return;

    const model = {
        Id: 1,
        ItemCode: itemCode,
        Type: 12
    };

    const jsonString = JSON.stringify(model);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {
        var tblData = response.data.data.Table;
        if (tblData && tblData.length > 0) {
            let otherCharges = {};
            tblData.forEach((row, index) => {
                const chargeName = row.ChargeName || `Charge ${index + 1}`;
                const totalPrice = parseFloat(row.TotalPrice) || 0;
                otherCharges[chargeName] = totalPrice;
            });
            itemOtherChargesMap[rowIndex] = otherCharges;
            const hiddenField = document.getElementById("otherChargesJson_" + rowIndex);
            if (hiddenField) {
                hiddenField.value = JSON.stringify(otherCharges);
            }
        }
    });
}

document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("searchlist")) {
        document.querySelectorAll(".suggestions").forEach(box => box.style.display = "none");
    }
});

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
function hasDuplicateItemIds(data) {
    const itemIds = new Set();
    for (const row of data) {
        if (itemIds.has(row.ItemID)) {
            itemIds.add(row.ItemID);
            console.log(itemIds);
            return true; // duplicate found
        }
        itemIds.add(row.ItemID);
    }
    return false;
}
function calculateSellingPrice(index) {
    const fields = [
        `txtRMPrice_${index}`,
        `txtLabelPrice_${index}`,
        `txtMCartonPrice_${index}`,
        `txtLCPrice_${index}`,
        `txtMargin_${index}`,
        `txtShrinkWrapPrice_${index}`,
        `txtMasterCartonPrice_${index}`
    ];

    let total = 0;

    fields.forEach(id => {
        const value = parseFloat(document.getElementById(id)?.value) || 0;
        total += value;
    });

    document.getElementById(`txtSellingPrice_${index}`).textContent = '₹ ' + total.toFixed(2);

    updateTotals();
}


async function DownLoadStep2Zip() {
    try {
        const model = {
            Id: $('#hdnOrderId').val(),
            Type: 17
        };

        const jsonString = JSON.stringify(model);

        CommonAjaxMethod(
            virtualPath + 'Generic/GetRecordsAsync',
            { modelData: jsonString, screenId: 'ERP_Samp5_101' },
            'GET',
            async function (response) {
                console.log("Response:", response);

                if (!response?.data?.data?.Table?.length) {
                    alert("No files found.");
                    return;
                }

                const data = response.data.data.Table;
                await downloadAllFilesAsZip(data);
            }
        );
    } catch (err) {
        console.error("Error in DownLoadStep2Zip:", err);
    }
}

async function downloadAllFilesAsZip(files) {
    try {
        const zip = new JSZip();


        for (const file of files) {
            const fileUrl = file.FileUrl.startsWith("http")
                ? file.FileUrl
                : baseURL + file.FileUrl;

            console.log("Downloading:", fileUrl);

            const response = await fetch(fileUrl);
            if (!response.ok) {
                console.warn(`Failed to fetch ${fileUrl}`);
                continue;
            }

            const blob = await response.blob();
            const safeName = file.ActualFileName;
            zip.file(safeName, blob);
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "OrderFiles.zip");
    } catch (error) {
        console.error("Error creating ZIP:", error);
        alert("Error creating ZIP file. Check console for details.");
    }
}


function updateTotals2() {

    let totalBeforeTax = 0;

    // Get all Selling Price cells (assumes IDs like txtSellingPrice_0, txtSellingPrice_1, etc.)
    const rows = document.querySelectorAll('[id^="totalcost_"]');
    rows.forEach(cell => {
        const priceText = cell.textContent.replace(/[₹,]/g, '').trim();
        const price = parseFloat(priceText) || 0;
        totalBeforeTax += price;
    });

    // Display Total Before Tax
    document.getElementById('totalBeforeTaxAmt').textContent = totalBeforeTax.toFixed(2);



    // Tax Values
    let tax = (parseFloat(totalBeforeTax) || 0) * 18 / 100;

    if ($('#roundingAmt').val() > tax) {
        $('#roundingAmt').val(0);
        FailToaster('GST Amount cannot be greater than 18% of the amaount!!!');
    }

    const igst = 0
    const cgst = parseFloat(document.getElementById('cgstTotal').textContent.replace(/,/g, '')) || 0;
    const sgst = parseFloat(document.getElementById('sgstTotal').textContent.replace(/,/g, '')) || 0;

    // Calculate and display Total Tax
    const totalTax = igst + cgst + sgst;


    document.getElementById('totalTax').textContent = totalTax.toFixed(2);

    // Other Charges
    const otherCharges = parseFloat(document.getElementById('otherChargesInputData').textContent.replace(/,/g, '')) || 0;

    // Total After Tax (Before rounding)
    let totalAfterTax = totalBeforeTax + totalTax + otherCharges;
    document.getElementById('totalAfterTaxAmt').textContent = totalAfterTax.toFixed(2);

    //  Rounding Amount: Clean and parse input safely
    let rawRoundingInput = document.getElementById('roundingAmt').value.trim();
    rawRoundingInput = rawRoundingInput.replace(/[^\d.-]/g, '');      // Remove non-numeric chars except . and -
    rawRoundingInput = rawRoundingInput.replace(/(?!^)-/g, '');       // Remove all '-' except the first
    const roundingValue = parseFloat(rawRoundingInput) || 0;

    // Total Amount (including rounding)
    const totalAmount = totalAfterTax + roundingValue;
    document.getElementById('totalAmt').textContent = '₹ ' + totalAmount.toFixed(2);

    // Advance Amount
    const advanceAmount = parseFloat(document.getElementById('advanceAmt').value.replace(/,/g, '')) || 0;

    // Outstanding Amount
    let outstandingAmount = totalAmount - advanceAmount;
    if (outstandingAmount < 0) {
        FailToaster("Outstanding Amount cannot be negative.");
        outstandingAmount = 0;
    }
    document.getElementById('oustandingAmt').textContent = '₹ ' + outstandingAmount.toFixed(2);

    // Validation: Show warning if Total Before Tax is zero
    const spTotalValidation = document.getElementById('sptotalBeforeTax');
    if (totalBeforeTax === 0) {
        spTotalValidation.style.display = 'inline';
    } else {
        spTotalValidation.style.display = 'none';
    }
}

function updateTotals() {
    let totalBeforeTax = 0;

    // Get all Selling Price cells (assumes IDs like txtSellingPrice_0, txtSellingPrice_1, etc.)
    const rows = document.querySelectorAll('[id^="totalcost_"]');
    rows.forEach(cell => {
        const priceText = cell.textContent.replace(/[₹,]/g, '').trim();
        const price = parseFloat(priceText) || 0;
        totalBeforeTax += price;
    });

    // Display Total Before Tax
    document.getElementById('totalBeforeTaxAmt').textContent = totalBeforeTax.toFixed(2);



    // Tax Values
   // let tax = (parseFloat(totalBeforeTax) || 0) * 18 / 100;
    const igst = 0
    const cgst = parseFloat(document.getElementById('cgstTotal').textContent.replace(/,/g, '')) || 0;
    const sgst = parseFloat(document.getElementById('sgstTotal').textContent.replace(/,/g, '')) || 0;

    // Calculate and display Total Tax
    const totalTax = igst + cgst + sgst;

    

    document.getElementById('totalTax').textContent = totalTax.toFixed(2);

    // Other Charges
    const otherCharges = parseFloat(document.getElementById('otherChargesInputData').textContent.replace(/,/g, '')) || 0;

    // Total After Tax (Before rounding)
    let totalAfterTax = totalBeforeTax + totalTax + otherCharges;
    document.getElementById('totalAfterTaxAmt').textContent = totalAfterTax.toFixed(2);

    //  Rounding Amount: Clean and parse input safely
    let rawRoundingInput = document.getElementById('roundingAmt').value.trim();
    rawRoundingInput = rawRoundingInput.replace(/[^\d.-]/g, '');      // Remove non-numeric chars except . and -
    rawRoundingInput = rawRoundingInput.replace(/(?!^)-/g, '');       // Remove all '-' except the first
    const roundingValue = parseFloat(rawRoundingInput) || 0;

    // Total Amount (including rounding)
    const totalAmount = totalAfterTax + roundingValue;
    document.getElementById('totalAmt').textContent = '₹ ' + totalAmount.toFixed(2);

    // Advance Amount
    const advanceAmount = parseFloat(document.getElementById('advanceAmt').value.replace(/,/g, '')) || 0;

    // Outstanding Amount
    let outstandingAmount = totalAmount - advanceAmount;
    if (outstandingAmount < 0) {
        FailToaster("Outstanding Amount cannot be negative.");
        outstandingAmount = 0;
    }
    document.getElementById('oustandingAmt').textContent = '₹ ' + outstandingAmount.toFixed(2);

    // Validation: Show warning if Total Before Tax is zero
    const spTotalValidation = document.getElementById('sptotalBeforeTax');
    if (totalBeforeTax === 0) {
        spTotalValidation.style.display = 'inline';
    } else {
        spTotalValidation.style.display = 'none';
    }
}

// Global to store which row is being edited
let currentRowIndex = 0;
function handleOtherChargesClick(elem) {
    const rowIndex = elem.getAttribute("data-row-index");
    const itemCodeInput = document.getElementById("ddlI_" + rowIndex);
    const itemCode = itemCodeInput ? itemCodeInput.value.trim() : "";

    if (!itemCode) {
        $('#ItemOtherChargesModal').modal('hide');
        FailToaster("Please select an item before other charges.");
        return;
    }

    // Save the row index to modal for later use
    $("#ItemOtherChargesModal").data("row-index", rowIndex);

    let model = {};
    if ($('#hdnOrderId').val() > 0) {
        model = {
            Id: $('#hdnOrderDetId_' + rowIndex).val(),
            ItemCode: itemCode,
            Type: 13
        };
    }
    else {
         model = {
             Id: 1,
            ItemCode: itemCode,
            Type: 12
        };
    }

    const jsonString = JSON.stringify(model);

    console.log(itemOtherChargesMap);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {
        var tblData = response.data.data.Table;
        const container = document.getElementById("dynamicItemOtherChargesModal");
        container.innerHTML = ""; // Clear previous content

        // tblData = itemOtherChargesMap;

        const result = Object.entries(itemOtherChargesMap[rowIndex]).map(([key, value]) => ({
            name: key,
            amount: value
        }));

        if (result && result.length > 0) {
            result.forEach((row, index) => {
                const chargeName = row.name || `Charge ${index + 1}`;
                const totalPrice = (parseFloat(row.amount)).toFixed(2) || 0;



                //console.log('Result: ');
                //xconsole.log(result);

                const rowDiv = document.createElement("div");
                rowDiv.className = "col-sm-12 form-group";

                rowDiv.innerHTML = `
                    <label>${chargeName}</label>
                    <div class="input-group input-group-left">
                        <label class="input-group-label">₹</label>
                        <input type="number" value="${totalPrice}" class="form-control number border-right border-r-8"
                            placeholder="0.00" data-chargename="${chargeName}" oninput="SetZero(this)" />
                    </div>
                `;
                container.appendChild(rowDiv);
            });

            $('#ItemOtherChargesModal').modal('show');
        } else {
            FailToaster("No charge data found for selected item.");
        }
    });
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


//#region : Sale Order Click Event

let fileModelList = [];
let fileModelList1 = [];

let fileDatalList = [];
let fileDatalList1 = [];

function getTableData() {
    let tableData = [];
    let rows = document.querySelectorAll("#tableToModify tr");
    let orderId = document.getElementById("hdnOrderId")?.value || 0;
    let i = 1;

    rows.forEach((row, index) => {
        const itemId = row.querySelector("[id^='ddlItem']")?.value;
        if (!itemId || itemId === "0") return;

        const rowIndex = row.getAttribute("data-row-index") || index; // fallback to index

        // Fetch other charges from map or hidden input
        let otherCharges = itemOtherChargesMap?.[rowIndex];
        if (!otherCharges) {
            const hiddenVal = row.querySelector("[id^='otherChargesJson']")?.value || "{}";
            try {
                otherCharges = JSON.parse(hiddenVal);
            } catch {
                otherCharges = {};
            }
        }

        tableData.push({
            OrderDetId: isDuplicate == 1 ? i++ : row.querySelector("[id^='hdnOrderDetId']")?.value || 0,
            OrderId: isDuplicate == 1 ? 0 : orderId,
            ItemID: itemId,
            Size: row.querySelector("[id^='lblItemPackSize']")?.textContent || "",
            Quantity: parseFloat(row.querySelector("[id^='txtQuantity']")?.value) || 0,
            RMPrice: parseFloat(row.querySelector("[id^='txtRMPrice']")?.value) || 0,
            LabelPrice: parseFloat(row.querySelector("[id^='txtLabelPrice']")?.value) || 0,
            MCartonPrice: parseFloat(row.querySelector("[id^='txtMCartonPrice']")?.value) || 0,
            LCPrice: parseFloat(row.querySelector("[id^='txtLCPrice']")?.value) || 0,
            Margin: parseFloat(row.querySelector("[id^='txtMargin']")?.value) || 0,
            ShrinkWrapPrice: parseFloat(row.querySelector("[id^='txtShrinkWrapPrice']")?.value) || 0,
            MasterCartonPrice: parseFloat(row.querySelector("[id^='txtMasterCartonPrice']")?.value) || 0,
            SellingPrice: parseFloat((row.querySelector("[id^='txtSellingPrice']")?.textContent || "0").replace(/[^\d.-]/g, '')) || 0,
            ItemOtherCharges: JSON.stringify(otherCharges)
        });
    });

    console.log(tableData);
    return tableData;
}

async function SaveOrderData() {

    var d = checkValidationIfZero('MandateWithoutZero');
    if (checkValidationOnSubmit('MandateOrder') == true && d == true) {

        var orderId = parseInt($("#hdnOrderId").val());

        var orderDetails = getTableData();

        if (hasDuplicateItemIds(orderDetails)) {
            FailToaster("Duplicate Item found in the list!");
            return;
        }

        var obj =
        {
            FolderNames: "SaleOrderItemDocuments/"
        }
        var type = 1;//This is for  common upload in attachment folder.
        const jsonString = JSON.stringify(obj);
        const result1 = await MultiFileUploadWithoutAync("fileAttachment1", jsonString, type, fileDataCollection1);
        const result2 = await MultiFileUploadWithoutAync("fileAttachment2", jsonString, type, fileDataCollection2);

        var fileData1 = [];
        var fileData2 = [];

        var finalFileData1 = [];
        var finalFileData2 = [];

        if (result1.Data != undefined) {
            fileData1 = JSON.parse(result1.Data).FileModelList;
            fileData1 = fileData1.concat(fileModelList);
            finalFileData1 = finalFileData1.concat(fileData1);
        }
        else {
            fileData1 = fileModelList;
        }

        if (result2.Data != undefined) {
            fileData2 = JSON.parse(result2.Data).FileModelList;
            fileData2 = fileData2.concat(fileModelList1);
            finalFileData2 = finalFileData2.concat(fileData2);
        }
        else {
            fileData2 = fileModelList1;
        }

        finalFileData1 = fileModelList.concat(finalFileData1);
        finalFileData2 = fileModelList1.concat(finalFileData2);

        // ✅ File count validation
        if (finalFileData1.length > 10) {
            FailToaster(finalFileData1.length + " Files. You cannot upload more than 10 files on Upload Customer PO attachment.");
            return;
        }
        if (finalFileData2.length > 10) {
            FailToaster(finalFileData2.length + " Files. You cannot upload more than 10 files for Purchase Order Image.");
            return;
        }

        //if (finalFileData2.length == 0) {
        //    FailToaster("Please select atleast one file in Purchase Packeging before saving the data!!!");
        //    return;
        //}

        //If either PO no and Po date filled then both are mandatory
        var poNo = $("#txtPONo").val().trim();
        var poDate = $("#txtPODate").val().trim();

        if (poNo !== "" || poDate !== "") {
            if (poNo === "") {
                FailToaster("PO number is mandatory.");
                return;
            }
            if (poDate === "") {
                FailToaster("PO date is mandatory.");
                return;
            }
        }

        // Get selected values for OrderFor from checkboxes with name="type"
        let orderForValues = [];
        $('input[name="OrderForType"]:checked').each(function () {
            orderForValues.push($(this).val());
        });

        // Disable the submit button
        $('#btnSubmit').prop('disabled', true);

        var orderModel =
        {
            OrderId: orderId > 0 ? orderId : 0,
            CustomerId: $("#ddlCustomerId").val() > 0 ? $("#ddlCustomerId").val() : 0,
            ContactPersonId: $("#ddlContactPerson").val() > 0 ? $("#ddlContactPerson").val() : 0,
            BrandId: $("#ddlBrand").val() > 0 ? $("#ddlBrand").val() : 0,

            SeriesId: $('#ddlDocSeries').val(),
            DocSeries: $("#ddlDocSeries option:selected").text(),
            SaleOrderNo: $('#txtOrderNo').val(),
            OrderDate: ChangeDateFormatSecond($('#txtOrderDate').val()),
            PONo: $("#txtPONo").val(),
            PODate: ChangeDateFormatSecond($('#txtPODate').val()),
            PaymentTermsId: $("#ddlPaymentTerm").val() > 0 ? $("#ddlPaymentTerm").val() : 0,
            TermsConditionId: $("#ddlTC").val() > 0 ? $("#ddlTC").val() : 0,
            CurrencyId: $("#ddlCurrency").val() > 0 ? $("#ddlCurrency").val() : 0,
            OrderFor: orderForValues.join(","),
            BillToId: $("#ddlBillingAddress").val() > 0 ? $("#ddlBillingAddress").val() : 0,
            ShipToId: $("#ddlShippingAddress").val() > 0 ? $("#ddlShippingAddress").val() : 0,

            SaleRemark: $("#txtSaleRemark").val(),
            TotalBeforeTax: parseAmount("#totalBeforeTaxAmt"),
            RoundingAmt: parseInputAmount("#roundingAmt"),
            TotalAmt: parseAmount("#totalAmt"),
            AdvanceAmt: parseInputAmount("#advanceAmt"),
            OutstandingAmt: parseAmount("#oustandingAmt"),

            OrderDetList: orderDetails,
            PackagingAttachment: fileData1,
            PurchaseOrderAttachment: fileData2,

            CustBrandName: $("#txtCustBrandName").val() || ''
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(orderModel);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "SaleOrderItem_101",
            Operation: orderId > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                ClearFormControl();
                setTimeout(function () {
                    RedirectOrderList();
                }, 1000);
            }
        });


    }
}

function SaveItemOtherCharges() {
    const container = document.getElementById("dynamicItemOtherChargesModal");

    if (!container) {
        console.error("Dynamic container not found");
        return;
    }

    // Get the row index from the modal trigger
    const rowIndex = $("#ItemOtherChargesModal").data("row-index");
    if (rowIndex === undefined) {
        console.error("Row index not set in modal");
        return;
    }

    const inputs = container.querySelectorAll("input[data-chargename]");
    let otherCharges = {};

    inputs.forEach(input => {
        const chargeName = input.getAttribute("data-chargename");
        const value = parseFloat(input.value) || 0;
        otherCharges[chargeName] = value;
    });

    // Save to JS object
    itemOtherChargesMap[rowIndex] = otherCharges;

    // Save to hidden field
    const hiddenField = document.getElementById("otherChargesJson_" + rowIndex);
    if (hiddenField) {
        hiddenField.value = JSON.stringify(otherCharges);
    }

    // Close modal
    $("#ItemOtherChargesModal").modal("hide");
}

function ClearFormControl() {
    $('#hdnOrderId').val(0);
    $('#hdnOrderDetId').val(0);

    $('#ddlCustomer').val('Select').trigger('change');
    $('#ddlContactPerson').val('Select').trigger('change');
    $('#ddlBrand').val('Select').trigger('change');

    $('#txtPONo').val('');
    $('#ddlPaymentTerm').val('Select').trigger('change');
    $('#ddlTC').val('Select').trigger('change');
    $('#ddlBillTo').val('Select').trigger('change');
    $('#ddlShipTo').val('Select').trigger('change');

    $('#ddlCurrency').val('Select').trigger('change');
    $('#ddlBillingAddress').val('Select').trigger('change');
    $('#ddlShippingAddress').val('Select').trigger('change');

    $('#txtSaleRemark').val('');
    //clearTable();
}

function clearTable() {
    let tableBody = document.getElementById("tableToModify");

    // Select all rows except the first one
    let rows = tableBody.querySelectorAll("tr:not(:first-child)");

    // Remove each row
    rows.forEach(row => row.remove());
}

function RedirectOrderList() {
    var url = "/ManageOrder/OrderList?auth=" + AuthToken
    window.location.href = url;
}

//#endregion


// Preview the file based on its type
function ViewLoadFileData1(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
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
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
        <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="DownloadIndentFile1(this)"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file1", "document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages1").appendChild(newDocument);
}

function ViewLoadFileData2(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
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
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
         <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file2", "document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages2").appendChild(newDocument);
}


function BindPartyList(inputId, suggestionListId, selectedValue = null, callback = null) {
    CommonAjaxMethod(virtualPath + 'Generic/GetDropDownWithAsync/', {
        parentId: login_ID,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        /*manualTable: isDuplicate == 1 ? 9 : 14,*/
        manualTable: 9,
        manualTableId: 0,
        ScreenId: "ERPDropdownList_101"
    }, 'GET', function (response) {
        const partyListData = response.data.data.Table;
        const $input = $('#' + inputId);
        const $suggestions = $('#' + suggestionListId);

        // Store vendor data for use in autocomplete
        $input.data('partyListData', partyListData);

        // Clear previous handlers
        $input.off('focus input');

        // Show full list on focus
        $input.on('focus', function () {
            renderSuggestions($input, $suggestions, partyListData);
        });

        // Filter on input
        $input.on('input', function () {
            const searchText = $(this).val().toLowerCase();
            const filteredData = partyListData.filter(v =>
                v.ValueName.toLowerCase().includes(searchText)
            );
            renderSuggestions($input, $suggestions, filteredData);
        });

        // Click outside closes suggestion box
        $(document).off('click.vendorlist').on('click.vendorlist', function (e) {
            if (!$(e.target).closest('.autocomplete-wrapper').length) {
                $('.suggestions').empty().hide();
            }
        });

        // ✅ Prefill if selectedValue passed (e.g. on edit)
        if (selectedValue) {
            const selectedCustomer = partyListData.find(c => c.ID == selectedValue);
            if (selectedCustomer) {
                $input.val(selectedCustomer.ValueName);
                $('#ddlCustomerId').val(selectedCustomer.ID);

                // Load dependent customer data
                GetContactPersonByPAId();
           
            }
        }

        if (typeof callback === 'function') callback(); // Callback after bind
    });
}

// Helper to render suggestions
function renderSuggestions($input, $suggestions, dataList) {
    $suggestions.empty();

    if (!dataList.length) {
        $suggestions.hide();
        return;
    }

    dataList.forEach(party => {
        $('<li/>')
            .addClass('suggestion-item')
            .text(party.ValueName)
            .attr('data-id', party.ID)
            .on('click', function () {
                $input.val(party.ValueName);
                $input.data('selected-id', party.ID);
                $('#ddlCustomerId').val(party.ID); // Set hidden field
                $suggestions.empty().hide();

                GetContactPersonByPAId(); // Run after selection
                changeItemData(); // Optional: update dependent UI
            })
            .appendTo($suggestions);
    });

    $suggestions.show();
}

function freezeGSTAmt() {
    if ($('#international').is(':checked')) {
        $('#roundingAmt').prop('disabled', true);
        $('#roundingAmt').val(0);
    } else {
        $('#roundingAmt').prop('disabled', false);
    }
}