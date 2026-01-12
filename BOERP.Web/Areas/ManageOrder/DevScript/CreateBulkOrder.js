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
    console.log($('#hdnOrderId').val());
    if ($('#hdnOrderId').val() > 0) {
        GetOrderItemDetById($('#hdnOrderId').val());
    }
    else { GetSeriesList(); }

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
        ModuleId: 11
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
var edit_payment_id;
// ✅ Load Customer Details + Dropdowns, then execute callback
function GetContactPersonByPAId(callback = null) {
    var customerId = parseInt($("#ddlCustomerId").val()) || 0; // Get actual ID from hidden field

    if (customerId > 0) {
        const model = JSON.stringify({ ID: customerId, Type: 1 });
        const screenId = "SaleOrderItem_101";

        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: model, screenId }, 'GET', function (response) {
            const { Table: brandData, Table1: contactList, Table2: billingList, Table3: shippingList } = response.data.data;

            // ✅ Brand
            if (Array.isArray(brandData) && brandData.length > 0) {
                $("#ddlBrand").val(brandData[0].BrandType).trigger('change');

                if (edit_orderId == 0) {
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

            // ✅ Contact Person
            if (Array.isArray(contactList) && contactList.length > 0) {

                var contPersonId = 0;
                if (edit_orderId > 0 && edit_CustomerId != $("#ddlCustomerId").val()) {
                    contPersonId = contactList[0].ID;
                }
                else { contPersonId = edit_orderId == 0 && contactList[0].ID > 0 ? contactList[0].ID : edit_ContPersonId; }

                const $contactDdl = $('#ddlContactPerson');
                bindDropdown($contactDdl, contactList, 'Select', contPersonId);
                $contactDdl.trigger('change');
                $('#spddlContactPerson').hide();
            }

            // ✅ Billing Address
            if (Array.isArray(billingList) && billingList.length > 0) {

                var billAddressId = edit_orderId == 0 ? billingList[0].ID : edit_billAddressId;
                //var fullBillAddress = edit_orderId == 0 && billingList[0].ValueName != '' ? billingList[0].ValueName : edit_FullBillAddress;

                globalBillingList = billingList;
                const $billingDdl = $('#ddlBillingAddress');
                bindDropdown($billingDdl, billingList, 'Select', billAddressId);

                // ✅ Default select and show label
                /*$('#txtBillingAddressDet').text(billingList[0].ValueName);*/
                const selectedAddress = billingList.find(x => x.ID == billAddressId);
                if (selectedAddress) {
                    $('#txtBillingAddressDet').text(selectedAddress.ValueName);
                }
            }

            // ✅ Shipping Address
            if (Array.isArray(shippingList) && shippingList.length > 0) {
                var shipAddressId = edit_orderId == 0 ? shippingList[0].ID : edit_ShipAddressId;

                globalShippingList = shippingList;
                const $shippingDdl = $('#ddlShippingAddress');
                bindDropdown($shippingDdl, shippingList, 'Select', shipAddressId);

                // ✅ Default select and show label
                const selectedAddress = shippingList.find(x => x.ID == shipAddressId);
                if (selectedAddress) {
                    $('#txtShippingAddressDet').text(selectedAddress.ValueName);
                } 
            }

            // ✅ Final callback
            if (typeof callback === 'function') {
                callback();
            }
        });

        LoadSampleDropdownByCustId(customerId);

        document.getElementById('spddlCustomer').style.display = 'none';


    } else if (typeof callback === 'function') {
        callback();
    }
}


// ✅ Handle Billing/Shipping change display
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

// ✅ Main function: Load Order Item Details
var edit_orderId = 0;
var edit_CustomerId = 0;
var edit_ContPersonId = 0;
var edit_billAddressId;
var edit_ShipAddressId;
var edit_payment_id
function GetOrderItemDetById(id) {
    const model = { ID: id, Type: 3 };      //Type:3 for SaleBulkOrder
    const jsonString = JSON.stringify(model);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'SaleOrderItem_101' }, 'GET', function (response) {
        const tableData = response.data.data.Table;
        const tableData1 = response.data.data.Table1;
        const tableData2 = response.data.data.Table2;
        const tableData3 = response.data.data.Table3;

        if (!tableData || tableData.length === 0) return;

        const order = tableData[0];
        $("#hdnOrderId").val(order.Id);

        edit_orderId = order.Id
        edit_CustomerId = order.CustomerId
        edit_ContPersonId = order.ContactPersonId
        edit_payment_id = order.PaymentTermsId
        edit_billAddressId = order.BillToId
        edit_ShipAddressId = order.ShipToId

        /*$('#ddlCustomerId').val(order.CustomerId).trigger('change');*/

        //LoadSampleDropdownByCustId(tableData[0].CustomerId);

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

        var tblSeries = response.data.data.Table3;
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

        setTimeout(() => {
            BindDropdownPaymentTerm(order.PaymentTermsId);
            BindDropdownTC(order.TermsConditionId);
        }, 100);

        /*$('#ddlPaymentTerm').val(order.PaymentTermsId).trigger('change');*/
        /*$('#ddlTC').val(order.TermsConditionId).trigger('change');*/
        $('#ddlCurrency').val(order.CurrencyId).trigger('change');

        $('#txtSaleRemark').val(order.SaleRemark);
        $('#totalBeforeTaxAmt').text('₹ ' +order.TotalBeforeTax);
        $('#roundingAmt').val(order.RoundingAmt);
        $('#totalAmt').text('₹ ' + order.TotalAmt);
        $('#advanceAmt').val(order.AdvanceAmt);
        $('#oustandingAmt').text('₹ ' + order.OutstandingAmt);

        $('#lblReqName').text(order.CreatedName);

        // ✅ Order Items
        if (tableData1.length > 0) {
            FillItemData(tableData1);
            /*BindItemCharges(tableData3);*/
        }

        // ✅ Attachments
        if (tableData2.length > 0) {
            for (let i = 0; i < tableData2.length; i++) {
                const f = tableData2[i];
                const loadFunc = f.AttachmentType === 'Upload1' ? LoadFileData1 : LoadFileData2;
                loadFunc(f.ActualFileName, f.FileType, f.Type, f.FileUrl, f.AttachmentId, f.FileSize, f.NewFileName);
            }
        }
    });
}

function FillItemData(data) {
    // Call this function whenever you need to clear the table
    //clearTable();

    let tableBody = document.getElementById("tableToModify");

    data.forEach((item, index) => {
        if (index == 0) {
            $('#hdnOrderDetId_0').val(item.Id);
            $('#ddlSampleId_0').val(item.SampleDetDocNo);
            $('#ddlSampleDetList_0').val(item.SampleDetId);
            $('#ddlItem_0').val(item.ItemId);
            $('#ddlI_0').val(item.ItemCode);
            $('#lblItemName_0').text(item.ItemName);
            $('#lblUnit_0').text(item.UOM);
            $('#txtSize_0').val(item.Size);
            $('#txtQuantity_0').val(item.Qty);
            $('#txtItemType_0').val(item.ItemType);
            $('#lblRefSellingPrice_0').text('₹ ' +item.RefSellingPrice.toFixed(2));
            $('#lblSampleSellingPrice_0').text('₹ ' + item.SampleSellingPrice.toFixed(2));
            $('#txtSellingPricePerUnit_0').val(item.SellingPricePerUnit.toFixed(2));
            $('#txtPackagingCharges_0').val(item.PackagingCharges.toFixed(2));

            //$('#txtSellingPricePerUnit_0')
            //    .attr("type", "text")
            //    .val('₹ ' + item.SellingPricePerUnit.toFixed(2));

            $('#lblTotalAmt_0').text('₹ ' + item.TotalAmt.toFixed(2));

            // Disable Item Code if ItemId = 0
            $('#ddlI_0').val(item.ItemCode).prop("disabled", item.ItemId == 0);

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
					<label for="ddlSampleId_${index}" class="search-label">
						<img src="../assets/images/icons/help/search-icon.png" class="icon-sm" />
					</label>
					<input type="text" class="form-control searchlist Mandate" id="ddlSampleId_${index}" value="${item.SampleDetDocNo}" data-type="sample" oninput="Getdata(this)" onclick="Getdata(this)" placeholder="Type Sample Id..." autocomplete="off" />
					<span id="spddlSampleId_${index}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
					    <ul id="globalSuggestionBox_sample_${index}" class="suggestions"></ul>
					    <input type="hidden" id="ddlSampleDetList_${index}" value="${item.SampleDetId}"/>

				</div>

			</td>
            <td>
                    <div class="autocomplete-wrapper" style="position: relative;">
                       <label for="ddlI_${index}" class="search-label">
							<img src="../assets/images/icons/help/search-icon.png" class="icon-sm" />
					   </label>
					   <input type="text" class="form-control searchlist Mandate" id="ddlI_${index}" value="${item.ItemCode}"  data-type="item" oninput="Getdata(this)" onclick="Getdata(this)" placeholder="Type item..." autocomplete="off" ${item.ItemId == 0 ? "disabled" : ""}/>
					   <span id="spddlI_${index}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
							<ul id="globalSuggestionBox_item_${index}" class="suggestions"></ul>
							<input type="hidden" id="ddlItem_${index}" value="${item.ItemId}"/>

                    </div>
                
            </td>

            <td id="lblItemName_${index}">${item.ItemName}</td>
            <td>
                <input type="number" id="txtQuantity_${index}" class="form-control text-right MandateWithoutZero" value="${item.Qty}" placeholder="0" oninput="HideErrorMessage(this); SetZero(this); calculateRowWiseTotalAmt(${index})">
				<span id="sptxtQuantity_${index}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
		    </td>
             <td id="lblUnit_${index}">${item.UOM}</td>
             <td id="lblRefSellingPrice_${index}">₹ ${item.RefSellingPrice}</td>
             <td id="lblSampleSellingPrice_${index}">₹ ${item.SampleSellingPrice}</td>
            
              <td>
                    <input type="text" id="txtSellingPricePerUnit_${index}" class="form-control text-right MandateWithoutZero"
                           value="${item.SellingPricePerUnit.toFixed(2)}"
                           placeholder="₹ 0.00"
                           onchange="HideErrorMessage(this)" 
                           oninput="SetZero(this); calculateRowWiseTotalAmt(${index})">
                    <span id="spSellingPricePerUnit_${index}" class="text-danger field-validation-error" style="display:none;">
                        Hey, You missed this field!!
                    </span>
                </td>

                <td>
                    <input type="text" id="txtPackagingCharges_${index}" class="form-control text-right"
                           value="${item.PackagingCharges.toFixed(2)}"
                           placeholder="₹ 0.00"
                           onchange="HideErrorMessage(this)" 
                           oninput="SetZero(this); calculateRowWiseTotalAmt(${index})">
                </td>

            <td class="text-right" id="lblTotalAmt_${index}">₹  ${item.TotalAmt}</td>

        `;

            tableBody.appendChild(row);

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
    } else {
        previewElement = `<div class="file-preview">
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
        ModuleId: 11
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
       // $('#txtPODate').val(newDate);

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

$("#addrow").click(function () {
    var RowId = $("#datatableOrder tbody tr").length + 1;
    let newRow = `
            <tr>
                <td>
                    <div class="deleterow text-center cursor-pointer">
                        <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
                        <input type="hidden" id="hdnOrderDetId_${RowId}" />
                    </div>
                </td>
                <td>
                    <div class="autocomplete-wrapper" style="position: relative;">
						<label for="ddlSampleId_${RowId}" class="search-label">
						    <img src="../assets/images/icons/help/search-icon.png" class="icon-sm" />
						</label>
						<input type="text" class="form-control searchlist Mandate" id="ddlSampleId_${RowId}" data-type="sample" oninput="Getdata(this)" onclick="Getdata(this)" placeholder="Type Sample Id..." autocomplete="off" />
						<span id="spddlSampleId_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
						<ul id="globalSuggestionBox_sample_${RowId}" class="suggestions"></ul>
						<input type="hidden" id="ddlSampleDetList_${RowId}"/>
					</div>
				</td>
				<td>
					<div class="autocomplete-wrapper" style="position: relative;">
					    <label for="ddlI_${RowId}" class="search-label">
						    <img src="../assets/images/icons/help/search-icon.png" class="icon-sm" />
						</label>
					    <input type="text" class="form-control searchlist Mandate" id="ddlI_${RowId}" data-type="item" oninput="Getdata(this)" onclick="Getdata(this)" placeholder="Type item..." autocomplete="off" />
						<span id="spddlI_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
						<ul id="globalSuggestionBox_item_${RowId}" class="suggestions"></ul>
						<input type="hidden" id="ddlItem_${RowId}"/>
					</div>
			    </td>

                <td><label class="lblItemName" id="lblItemName_${RowId}"></label></td>
                <td>
                    <input type="number" id="txtQuantity_${RowId}" class="form-control text-right MandateWithoutZero" value="" placeholder="0" oninput="HideErrorMessage(this); SetZero(this); calculateRowWiseTotalAmt(${RowId})">
					<span id="sptxtQuantity_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
				</td>
               <td><label class="lblItemName" id="lblUnit_${RowId}"></label></td>
               <td><label class="lblItemName" id="lblRefSellingPrice_${RowId}"></label></td>
               <td><label class="lblItemName" id="lblSampleSellingPrice_${RowId}"></label></td>
               <td>
                    <input type="number" id="txtSellingPricePerUnit_${RowId}" class="form-control text-right MandateWithoutZero" value="" placeholder="0" oninput="HideErrorMessage(this); SetZero(this); calculateRowWiseTotalAmt(${RowId})">
					<span id="sptxtSellingPricePerUnit_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
			   </td>
               <td>
                    <input type="number" id="txtPackagingCharges_${RowId}" class="form-control text-right" value="" placeholder="0" oninput="SetZero(this); calculateRowWiseTotalAmt(${RowId})">
					
			   </td>
               <td class="text-right" id="lblTotalAmt_${RowId}">₹ 0.00</td>
               
         </tr>`;

    // Append new row
    $(".itemsinformation tbody").append(newRow);

    // Re-initialize select2 for newly added element
    $(".itemsinformation tbody tr:last .applyselect").select2();

    // Re-initialize tooltip for newly added elements
    $(".itemsinformation tbody tr:last [data-toggle='tooltip']").tooltip();

    var inputElement = $('#ddlI_' + RowId);
    Getdata(inputElement);
});

var SampleIdList = [];
var ItemCodeList = [];

function LoadSampleDropdownByCustId(custId) {
    var model = {
        ID: custId,
        ColumnName: 'Name', // Use appropriate column name
        SearchData: "",
        Type: 5 // Use different type than items (adjust according to your API)
    };
    const jsonString = JSON.stringify(model);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_104' }, 'GET', function (response) {
        SampleIdList = response.data.data.Table;
    });
}
function LoadItemDropdown() {
    var model =
    {
        ColumnName: 'Name',
        SearchData: "",
        Type: 6
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

// Helper: place the box correctly whether it's in a wrapper or on <body>
function placeBelow(input, box) {
    const wrapper = box.closest('.autocomplete-wrapper');
    const boxPos = getComputedStyle(box).position; // 'absolute' | 'fixed' | 'relative' | etc.

    if (wrapper && getComputedStyle(wrapper).position !== 'static' && boxPos === 'absolute') {
        // Absolute inside a positioned wrapper => use offset* values
        box.style.top = (input.offsetTop + input.offsetHeight) + 'px';
        box.style.left = input.offsetLeft + 'px';
        box.style.width = input.offsetWidth + 'px';
    } else {
        // Box is not inside a positioned wrapper OR it's fixed/absolute under <body>
        // Use viewport rect + scroll compensation (unless fixed)
        const r = input.getBoundingClientRect();
        const dx = (boxPos === 'fixed') ? 0 : window.scrollX;
        const dy = (boxPos === 'fixed') ? 0 : window.scrollY;
        box.style.top = (r.bottom + dy) + 'px';
        box.style.left = (r.left + dx) + 'px';
        box.style.width = r.width + 'px';
    }
}

function Getdata(inputElement) {
    const type = inputElement?.getAttribute('data-type');
    const idParts = inputElement.id.split('_');
    const rowId = idParts[idParts.length - 1];

    // Create or get the suggestion box
    const suggestionBoxId = `globalSuggestionBox_${type}_${rowId}`;
    let suggestionBox = document.getElementById(suggestionBoxId);
    if (!suggestionBox) {
        const wrapper = inputElement.closest('.autocomplete-wrapper') || inputElement.parentElement;
        suggestionBox = document.createElement('ul');
        suggestionBox.className = 'suggestions';
        suggestionBox.id = suggestionBoxId;
        wrapper.appendChild(suggestionBox);
    }

    const search = (inputElement.value || '').toLowerCase().trim();
    suggestionBox.innerHTML = '';

    const ItemCodeList = window.ItemCodeList || [];
    const SampleIdList = window.SampleIdList || [];
    const dataList = (type === 'item') ? ItemCodeList : SampleIdList;

    if (!dataList.length) {
        suggestionBox.innerHTML = '<li class="errordata">No data available</li>';
        suggestionBox.style.display = 'block';
        placeBelow(inputElement, suggestionBox);
        return;
    }

    const matchedItems = dataList.filter(item => {
        const displayText = (type === 'item') ? item.ITEM_DISPLAY : item.SampleDetDocNo;
        return displayText && displayText.toLowerCase().includes(search);
    });

    if (matchedItems.length === 0) {
        suggestionBox.innerHTML = '<li class="errordata">No data found</li>';
    } else {
        const frag = document.createDocumentFragment();
        matchedItems.forEach(item => {
            const li = document.createElement('li');
            const displayText = (type === 'item') ? item.ITEM_DISPLAY : item.SampleDetDocNo;
            li.textContent = displayText;

            // Optional: visually style unlisted sample entries
            if (type === 'sample' && item.ITEM_ID === 0 && item.IsListed === 0) {
                li.classList.add('unlisted');
                li.title = 'Unlisted Sample Item';
            }

            li.addEventListener('click', () => {
                // Always reset first
                resetRowFields(rowId);

                inputElement.value = item.SampleDetDocNo;
                suggestionBox.style.display = 'none';

                $(`#ddlSampleDetList_${rowId}`).val(item.SampleDetId);

                // ✅ UNLISTED SAMPLE CASE
                if (item.ITEM_ID == 0 && item.IsListed == 0) {
                    $(`#lblItemName_${rowId}`).text(item.ITEM_NAME || 'Unlisted Item');
                    $(`#lblRefSellingPrice_${rowId}`).text('₹ ' + item.SALE_RATE || 0);
                    $(`#lblSampleSellingPrice_${rowId}`).text('₹ ' +item.TargetPrice || 0);
                    $(`#ddlI_${rowId}`).val('').prop('disabled', true);
                    $(`#lblUnit_${rowId}`).text(item.UnlistedItemUnit);
                    return;
                }

                // ✅ LISTED SAMPLE CASE
                $(`#ddlItem_${rowId}`).val(item.ITEM_ID);
                $(`#lblRefSellingPrice_${rowId}`).text('₹ ' + item.SALE_RATE || 0);
                $(`#lblSampleSellingPrice_${rowId}`).text('₹ ' +item.TargetPrice || 0);
                $(`#lblUnit_${rowId}`).text(item.UNIT);

                const linkedItem = (window.ItemCodeList || []).find(it => it.ITEM_ID === item.ITEM_ID);

                if (linkedItem) {
                    $(`#ddlI_${rowId}`).val(linkedItem.ITEM_CODE);
                    $(`#lblItemName_${rowId}`).text(linkedItem.ITEM_NAME);
                    $(`#lblUnit_${rowId}`).text(linkedItem.UNIT);
                    $(`#lblItemPackSize_${rowId}`).text(linkedItem.Pack_Size);
                    $(`#lblRefSellingPrice_${rowId}`).text('₹ ' +linkedItem.SALE_RATE);
                    $(`#ddlI_${rowId}`).prop('disabled', false);
                } else {
                    console.warn('No matching item in ItemCodeList for ITEM_ID:', item.ITEM_ID);
                }
            });


            frag.appendChild(li);
        });

        suggestionBox.appendChild(frag);
    }

    suggestionBox.style.display = 'block';
    placeBelow(inputElement, suggestionBox);
}

// --- Reset function for row fields ---
function resetRowFields(rowId) {
    $(`#ddlI_${rowId}`).val('');
    $(`#ddlItem_${rowId}`).val('');
    $(`#lblItemName_${rowId}`).text('');
    $(`#lblUnit_${rowId}`).text('');
    $(`#lblItemPackSize_${rowId}`).text('');
    $(`#lblRefSellingPrice_${rowId}`).text('');
    $(`#lblSampleSellingPrice_${rowId}`).text('');
    $(`#ddlI_${rowId}`).prop('disabled', false); // Enable item input by default
}

// Hide on outside click
document.addEventListener('click', function (event) {
    if (!event.target.classList.contains('searchlist')) {
        document.querySelectorAll('.suggestions').forEach(box => box.style.display = 'none');
    }
});

// Reposition on scroll/resize to keep it glued to the input
['scroll', 'resize'].forEach(ev =>
    window.addEventListener(ev, () => {
        const openBox = document.querySelector('.suggestions[style*="display: block"]');
        if (!openBox) return;
        const input = document.querySelector('.searchlist:focus');
        if (input) placeBelow(input, openBox);
    })
);


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
        const id = parseInt(row.ItemID, 10);
        if (id > 0) {
            if (itemIds.has(id)) {
                console.log('Duplicate ItemID found:', id);
                return true; // duplicate found
            }
            itemIds.add(id);
        }
    }

    return false; // no duplicates found
}

function calculateRowWiseTotalAmt(index) {
    const qty = parseFloat(document.getElementById(`txtQuantity_${index}`)?.value) || 0;
    const pricePerUnit = parseFloat(document.getElementById(`txtSellingPricePerUnit_${index}`)?.value) || 0;
    const packagingCharges = parseFloat(document.getElementById(`txtPackagingCharges_${index}`)?.value) || 0;

    const total = (qty * pricePerUnit) + packagingCharges;

    // Update total amount in the row
    const totalCell = document.getElementById(`lblTotalAmt_${index}`);
    if (totalCell) {
        totalCell.textContent = '₹ ' + total.toFixed(2);
    }

    // Always update totals, even if total is zero
    updateTotals();
   
}

function updateTotals() {
    let totalBeforeTax = 0;

    // Loop over all rows and add each row's total
    document.querySelectorAll('[id^="lblTotalAmt_"]').forEach(cell => {
        const priceText = cell.textContent.replace(/[₹,]/g, '').trim();
        const price = parseFloat(priceText) || 0;
        totalBeforeTax += price;
    });

    document.getElementById('totalBeforeTaxAmt').textContent = totalBeforeTax.toFixed(2);

    // Tax values
    const igst = parseFloat(document.getElementById('igstTotal')?.textContent.replace(/,/g, '')) || 0;
    const cgst = parseFloat(document.getElementById('cgstTotal')?.textContent.replace(/,/g, '')) || 0;
    const sgst = parseFloat(document.getElementById('sgstTotal')?.textContent.replace(/,/g, '')) || 0;

    const totalTax = igst + cgst + sgst;
    document.getElementById('totalTax').textContent = totalTax.toFixed(2);

    const otherCharges = parseFloat(document.getElementById('otherChargesInputData')?.textContent.replace(/,/g, '')) || 0;

    const totalAfterTax = totalBeforeTax + totalTax + otherCharges;
    document.getElementById('totalAfterTaxAmt').textContent = totalAfterTax.toFixed(2);

    // Rounding
    let rawRoundingInput = document.getElementById('roundingAmt')?.value.trim() || "0";
    rawRoundingInput = rawRoundingInput.replace(/[^\d.-]/g, '');
    rawRoundingInput = rawRoundingInput.replace(/(?!^)-/g, '');
    const roundingValue = parseFloat(rawRoundingInput) || 0;

    const totalAmount = totalAfterTax + roundingValue;
    document.getElementById('totalAmt').textContent = '₹ ' + totalAmount.toFixed(2);

    const advanceAmount = parseFloat(document.getElementById('advanceAmt')?.value.replace(/,/g, '')) || 0;

    let outstandingAmount = totalAmount - advanceAmount;
    if (outstandingAmount < 0) {
        FailToaster("Outstanding Amount cannot be negative.");
        outstandingAmount = 0;
    }

    document.getElementById('oustandingAmt').textContent = '₹ ' + outstandingAmount.toFixed(2);

    // Validation
    //const spTotalValidation = document.getElementById('sptotalBeforeTax');
    //if (totalBeforeTax === 0) {
    //    spTotalValidation.style.display = 'inline';
    //} else {
    //    spTotalValidation.style.display = 'none';
    //}
}

function VerifyGSTAmt(ctrl) {

    const id = ctrl.id;

    const value = ctrl.value;
    
    let totalBeforeTax = 0;

    document.querySelectorAll('[id^="lblTotalAmt_"]').forEach(cell => {
        const priceText = cell.textContent.replace(/[₹,]/g, '').trim();
        const price = parseFloat(priceText) || 0;
        totalBeforeTax += price;
    });


    // Tax Values
    let tax = (parseFloat(totalBeforeTax) || 0) * 18 / 100;

    if ($('#' + id).val() > tax) {
        $('#' + id).val(0);
        FailToaster('GST Amount cannot be greater than 18% of the amaount!!!');
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

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {
        var tblData = response.data.data.Table;
        const container = document.getElementById("dynamicItemOtherChargesModal");
        container.innerHTML = ""; // Clear previous content

        if (tblData && tblData.length > 0) {
            tblData.forEach((row, index) => {
                const chargeName = row.ChargeName || `Charge ${index + 1}`;
                const totalPrice = parseFloat(row.TotalPrice) || 0;

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
    let isValid = true;

    rows.forEach((row, index) => {
        const sampleDetId = row.querySelector("[id^='ddlSampleDetList']")?.value || "0"; // allow 0
        const itemId = row.querySelector("[id^='ddlItem']")?.value || "0";

        // ✅ New validation: both SampleDetId and ItemId cannot be 0
        if (sampleDetId === "0" && itemId === "0") {
            isValid = false;
            const rowNum = index + 1;
            FailToaster(`Row ${rowNum}: Either select Sample Id or Item code. Both cannot be blank.`);
            return;
        }

        /*if (!itemId || itemId === "0") return;*/

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
            SampleDetId: sampleDetId,
            ItemID: itemId,
            ItemName: row.querySelector("[id^='lblItemName']")?.textContent || "",
            Size: row.querySelector("[id^='txtSize']")?.value || "",
            Quantity: parseFloat(row.querySelector("[id^='txtQuantity']")?.value) || 0,
            RefSellingPrice: parseFloat((row.querySelector("[id^='lblRefSellingPrice']")?.textContent || "0").replace(/[^\d.]/g, '')) || 0,
            SampleSellingPrice: parseFloat((row.querySelector("[id^='lblSampleSellingPrice']")?.textContent || "0").replace(/[^\d.]/g, '')) || 0,
            SellingPricePerUnit: parseFloat(row.querySelector("[id^='txtSellingPricePerUnit']")?.value) || 0,
            PackagingCharges: parseFloat(row.querySelector("[id^='txtPackagingCharges']")?.value) || 0,
            ItemTotalAmt: parseFloat((row.querySelector("[id^='lblTotalAmt']")?.textContent || "0").replace(/[^\d.]/g, '')) || 0,
            ItemOtherCharges: JSON.stringify(otherCharges)
        });
    });

    if (!isValid) return null; // Stop processing if validation failed
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
            FolderNames: "SaleBulkOrderDoc/"
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
            fileData1 = fileData1.concat(fileDatalList);
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
            FailToaster(finalFileData1.length + " Files. You cannot upload more than 10 files for Customer PO.");
            return;
        }
        if (finalFileData2.length > 10) {
            FailToaster(finalFileData2.length + " Files. You cannot upload more than 10 files for Packaging Image.");
            return;
        }
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
           /* OrderFor: orderForValues.join(","),*/
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
            ScreenID: "SaleBulkOrderItem_101",
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
   // clearTable();
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
                //changeItemData(); // Optional if needed
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



function changeItemData() {

    $('#tableToModify').html(`		<tr>
								<td class="text-center">
									<div id="addrow" class="cursor-pointer"><img src="../assets/images/icons/help/add.svg" alt="" /></div>
									<input type="hidden" id="hdnOrderDetId_0" />
								</td>
								<td>
									<div class="autocomplete-wrapper" style="position: relative;">
										<label for="ddlSampleId_0" class="search-label">
											<img src="../assets/images/icons/help/search-icon.png" class="icon-sm" />
										</label>
										<input type="text" class="form-control searchlist Mandate" id="ddlSampleId_0"  data-type="sample" oninput="Getdata(this)" onclick="Getdata(this)" placeholder="Type Sample Id..." autocomplete="off" />
										<span id="spddlSampleId_0" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
										<ul id="globalSuggestionBox_sample_0" class="suggestions"></ul>
										<input type="hidden" id="ddlSampleDetList_0" />
									</div>
								</td>
								<td>
									<div class="autocomplete-wrapper" style="position: relative;">
										<label for="ddlI_0" class="search-label">
											<img src="../assets/images/icons/help/search-icon.png" class="icon-sm" />
										</label>
										<input type="text" class="form-control searchlist Mandate" id="ddlI_0"  data-type="item" oninput="Getdata(this)" onclick="Getdata(this)" placeholder="Type item..." autocomplete="off" />
										<span id="spddlI_0" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
										<ul id="globalSuggestionBox_item_0" class="suggestions"></ul>
										<input type="hidden" id="ddlItem_0" />
									</div>
								</td>
								<td><label class="lblItemName" id="lblItemName_0" class="m-0 p-0"></label></td>
								<td>
									<input type="number" id="txtQuantity_0" class="form-control text-right MandateWithoutZero" value="" placeholder="0" oninput="HideErrorMessage(this); SetZero(this); calculateRowWiseTotalAmt(0)">
									<span id="sptxtQuantity_0" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>

								</td>
								<td><label class="lblItemName" id="lblUnit_0"></label></td>
								<td> <label class="lblItemName" id="lblRefSellingPrice_0"></label> </td>
								<td> <label class="lblItemName" id="lblSampleSellingPrice_0"></label> </td>
								<td>
									<input type="number" id="txtSellingPricePerUnit_0" class="form-control text-right MandateWithoutZero" value="" placeholder="0" oninput="HideErrorMessage(this); SetZero(this); calculateRowWiseTotalAmt(0)">
									<span id="sptxtSellingPricePerUnit_0" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
								</td>
								<td>
									<input type="number" id="txtPackagingCharges_0" class="form-control text-right" value="" placeholder="0" oninput="SetZero(this); calculateRowWiseTotalAmt(0)">
									
								</td>
								<td class="text-right" id="lblTotalAmt_0">0.00</td> </tr>`);


    $("#addrow").click(function () {
        var RowId = $("#datatableOrder tbody tr").length + 1;
        let newRow = `
            <tr>
                <td>
                    <div class="deleterow text-center cursor-pointer">
                        <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
                        <input type="hidden" id="hdnOrderDetId_${RowId}" />
                    </div>
                </td>
                 <td>
                    <div class="autocomplete-wrapper" style="position: relative;">
                        <label for="SampleId_${RowId}" class="search-label">
                            <img src="../../../assets/images/icons/help/search-icon.png" class="icon-sm" />
                        </label>                                  
                        <input type="text" class="form-control searchlist Mandate" id="ddlSampleId_${RowId}" data-type="sample" oninput="Getdata(this)" onclick="Getdata(this)"  placeholder="Type item..." autocomplete="off" />
                        <span id="spddlSampleId_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                        <ul id="globalSuggestionBox_sample_${RowId}" class="suggestions"></ul>
                       <input type="hidden" id="ddlSampleDetList_${RowId}" />

                    </div>
                </td>
                <td>
                    <div class="autocomplete-wrapper" style="position: relative;">
                        <label for="ddlI_${RowId}" class="search-label">
                            <img src="../../../assets/images/icons/help/search-icon.png" class="icon-sm" />
                        </label>                                  
                        <input type="text" class="form-control searchlist Mandate" id="ddlI_${RowId}" data-type="item" oninput="Getdata(this)" onclick="Getdata(this)"  placeholder="Type item..." autocomplete="off" />
                        <span id="spddlI_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                        <ul id="globalSuggestionBox_item_${RowId}" class="suggestions"></ul>
                       <input type="hidden" id="ddlItem_${RowId}" />

                    </div>
                </td>
                <td><label class="lblItemName" id="lblItemName_${RowId}"></label></td>
                <td>
                    <input type="number" id="txtQuantity_${RowId}" class="form-control text-right MandateWithoutZero" value="" placeholder="0" oninput="HideErrorMessage(this); SetZero(this); calculateRowWiseTotalAmt(${RowId})">
					<span id="sptxtQuantity_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
				</td>
                <td> <label class="lblItemName" id="lblUnit_${RowId}"></label></td>
                <td> <label class="lblItemName" id="lblRefSellingPrice_${RowId}"></label> </td>
				<td> <label class="lblItemName" id="lblSampleSellingPrice_${RowId}"></label> </td>
				<td>
                    <input type="number" id="txtSellingPricePerUnit_${RowId}" class="form-control text-right MandateWithoutZero" value="" placeholder="0" oninput="HideErrorMessage(this); SetZero(this); calculateRowWiseTotalAmt(${RowId})">
					<span id="sptxtSellingPricePerUnit_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
			    </td>
                <td>
                    <input type="number" id="txtPackagingCharges_${RowId}" class="form-control text-right" value="" placeholder="0" oninput="SetZero(this); calculateRowWiseTotalAmt(${RowId})">
					
			    </td>
                <td class="text-right" id="lblTotalAmt_${RowId}">₹ 0.00</td>
               
         </tr>`;

        // Append new row
        $(".itemsinformation tbody").append(newRow);

        // Re-initialize select2 for newly added element
        $(".itemsinformation tbody tr:last .applyselect").select2();

        // Re-initialize tooltip for newly added elements
        $(".itemsinformation tbody tr:last [data-toggle='tooltip']").tooltip();

        var inputElement = $('#ddlI_' + RowId);
        Getdata(inputElement);
    });

}



