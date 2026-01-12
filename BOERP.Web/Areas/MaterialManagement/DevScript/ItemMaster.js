$(document).ready(function () {

    $('input[name="status"][value=Active]').prop('checked', true);
    $('#txtConversionFactor').prop('disabled', true);

    // Attach event listeners to both dropdowns
    $('#ddlUnit').change(function () {
        checkConversionFactor();
    });

    $('#ddlAlternateUnit').change(function () {
        checkConversionFactor();
    });

    sessionStorage.removeItem("chargeData");

    $('#ddlSubCategory').html('<option value="">Select</option>');

    var itemMasterId = parseInt($("#hdnItemMasterId").val());

    if (localStorage.getItem('Item')) {
        $('#txtItemName').val(localStorage.getItem('Item'));

        $('#txtDescription').val(localStorage.getItem('Item'));

        sample_id = localStorage.getItem('sample_id');

        $('#no').prop('checked', true);

        localStorage.removeItem('sample_id');
    }

   

    if (itemMasterId > 0) {
        GetItemMasterDetById(itemMasterId);
    }
    else {
        BindDropdown('ddlHSN', '');
        BindDropdown('ddlDefaultWarehouse', '');
        BindDropdown('ddlCategory', '');
        BindDropdown('ddlUnit', '');
        BindDropdown('ddlAlternateUnit', '');
        BindDropdown('ddlPurchAccName', '');
        BindDropdown('ddlSaleAccName', '');
        BindDropdown('ddlCharge', '');
        BindDropdown('ddlPreferredSupplier', '');
        BindDropdown('ddlLoadTime', '');
        BindDropdown('ddlBrandType', '');

    }

    // Debounced filter input
    $('#txtItemCodeFilter').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblItemMaster")) {
            indentTable.ajax.reload();
        }
    }, 500));
    $('#txtItemName').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblItemMaster")) {
            indentTable.ajax.reload();
        }
    }, 500));

    $('#txtItemCode').prop('disabled', true);



    $('#imgQc').on('click', function () {
        ShowQCMapping();
    });

});
 function BindDropdown(type, SelectValue) {

     if (sample_id > 0) {
        
             if (localStorage.getItem('hsn')) {
                 SelectValue = localStorage.getItem('hsn');
             }

     }

    if (type == 'ddlHSN') {
        var obj1 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 68,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlHSN', obj1, 'Select', false, SelectValue);
    }
     if (type == 'ddlDefaultWarehouse') {

         if (sample_id > 0) {
             if (localStorage.getItem('warehouse')) {
                 SelectValue = localStorage.getItem('warehouse');
             }


         }
        var obj2 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 77,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlDefaultWarehouse', obj2, 'Select', false, SelectValue);
    }
    if (type == 'ddlCategory') {
        var obj3 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 69,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlCategory', obj3, 'Select', false, SelectValue);


    }
    if (type == 'ddlItemCategory') {
        var obj3 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 69,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlItemCategory', obj3, 'All', false, SelectValue);
    }
    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 72,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
     if (type == 'ddlUnit') {

         if (sample_id > 0) {
             $('#ddlCategory').prop('disabled', true);
             if (localStorage.getItem('uom2')) {
                 SelectValue = localStorage.getItem('uom2'); 
             } 

         }

        LoadMasterDropdown('ddlUnit', obj4, 'Select', false, SelectValue);
    }
     if (type == 'ddlAlternateUnit') {


         if (sample_id > 0) {
             if (localStorage.getItem('uom3')) {
                 SelectValue = localStorage.getItem('uom3');
                 $('#txtConversionFactor').val(0.001);
                 $('#yes').prop('checked', true);
                 if (localStorage.getItem('hsn')) {
                     $('#ddlHSN').val(localStorage.getItem('hsn')).trigger('change');
                 }
             }

         }

        LoadMasterDropdown('ddlAlternateUnit', obj4, 'Select', false, SelectValue);
    }
    if (type == 'ddlCharge') {
        var obj5 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 73,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlCharge', obj5, 'Select', false, SelectValue);
    }
    if (type == 'ddlPreferredSupplier') {
        var obj6 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 74,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlPreferredSupplier', obj6, 'Select', false, SelectValue);
    }
    if (type == 'ddlBrandType') {
        var obj7 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 65,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlBrandType', obj7, 'Select', false, SelectValue);
    }
    if (type == 'ddlPurchAccName') {
        var obj8 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 94,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlPurchAccName', obj8, 'Select', false, SelectValue);
    }
    if (type == 'ddlSaleAccName') {
        var obj9 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 94,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlSaleAccName', obj9, 'Select', false, SelectValue);
    }




}


function deleteRow1(button) {
    const row = button.closest('tr');
    if (!row) return;
    const tbody = row.parentNode;

    // Remove the clicked row
    tbody.removeChild(row);

    // ---------- Detect id-start from first remaining row ----------
    // Default: start ids at 1
    let idStart = 1;
    const firstRow = tbody.rows[0];
    if (firstRow) {
        // Find any element with an id inside the first row
        const elWithId = firstRow.querySelector('[id]');
        if (elWithId && elWithId.id) {
            const match = elWithId.id.match(/_(\d+)(?!.*_.*)/); // last _digits
            if (match) {
                idStart = parseInt(match[1], 10) || 1;
            }
        }
    }

    // If idStart < 99 we will keep ids == visible index (1..N).
    // If idStart >= 100 we will keep ids starting from idStart (100,101,...).
    const useSeparateIdBase = idStart >= 100;

    // ---------- Reindex remaining rows ----------
    const rows = Array.from(tbody.rows);
    rows.forEach((r, idx) => {
        if (idx == 0) {
            return;
        }
        const visibleIndex = idx + 1;
        const idIndex = useSeparateIdBase ? (idStart + idx) : visibleIndex;

        // Update visible sequence cell:
        // prefer .seq-cell if present, else fallback to second cell (index 1)
        const seqCell = r.querySelector('.seq-cell') || r.cells[1];
        if (seqCell) seqCell.innerText = visibleIndex;

        // Update attributes inside row for id/for/name and inline handlers
        const attrsToFix = ['id', 'for', 'name', 'onclick', 'oninput', 'onchange', 'onblur', 'onfocus', 'aria-labelledby', 'data-id', 'data-target', 'data-index'];

        r.querySelectorAll('*').forEach(el => {
            attrsToFix.forEach(attr => {
                if (!el.hasAttribute(attr)) return;
                const oldVal = el.getAttribute(attr);
                if (!oldVal) return;

                // Replace suffix _<digits> with new idIndex
                let newVal = oldVal.replace(/_(\d+)\b/g, `_${idIndex}`);

                // Replace simple function calls like Foo(5) -> Foo(idIndex)
                // Only change when argument is a single numeric literal.
                newVal = newVal.replace(/([A-Za-z0-9_]+)\(\s*\d+\s*\)/g, function (m, fn) {
                    return fn + '(' + idIndex + ')';
                });

                if (newVal !== oldVal) el.setAttribute(attr, newVal);
            });

            // For plain text nodes or innerHTML that contain e.g. SaveItemMasterDynamic(5)
            // update those occurrences conservatively (only single-number args)
            if (el.children.length === 0 && typeof el.innerHTML === 'string') {
                const oldHtml = el.innerHTML;
                const newHtml = oldHtml.replace(/([A-Za-z0-9_]+)\(\s*\d+\s*\)/g, function (m, fn) {
                    return fn + '(' + idIndex + ')';
                });
                if (newHtml !== oldHtml) el.innerHTML = newHtml;
            }
        });

        // Also update attributes on row itself (like id="row_100")
        attrsToFix.forEach(attr => {
            if (!r.hasAttribute(attr)) return;
            const oldVal = r.getAttribute(attr);
            if (!oldVal) return;
            const newVal = oldVal.replace(/_(\d+)\b/g, `_${idIndex}`);
            if (newVal !== oldVal) r.setAttribute(attr, newVal);
        });
    });

    // ---------- Re-init UI plugins (safe) ----------
    try {
        if (window.jQuery) {
            jQuery('.applyselect').each(function () {
                try { jQuery(this).select2('destroy'); } catch (e) { }
            });
            jQuery('.applyselect').select2();
        }
    } catch (e) {
        console.warn('select2 re-init skipped/failed', e);
    }

    try {
        CalculateTotal();
    }
    catch (e) {
        console.warn('select2 re-init skipped/failed', e);
    }

}


function GetQCParam(ctrl) {

    var id = ctrl.value;

    let rowId = ctrl.id.split('_')[1];



    if (ctrl.value == 'Select') {

        $('#txtResultType_' + rowId).val('').trigger('change');
        $('#txtMeasuringUnit_' + rowId).val('').trigger('change');

        return;
    }

    var model =
    {
        Id: id,
        Type: 14
    };



    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        const data = response.data.data.Table[0];

        $('#txtResultType_' + rowId).val(data.ResultType).trigger('change');
        $('#txtMeasuringUnit_' + rowId).val(data.MeasuringUnit).trigger('change');

        //   console.log(data);


    });



}


function GetBOMDetByItemCode(ItemCode) {

    var model =
    {
        Id: 1,
        ItemCode: ItemCode,
        Type: 16
    };

   // IsView = localStorage.getItem('viewBOM');

    // localStorage.removeItem('viewBOM');


    //if (IsView == 'true') {
    //    $('#bomSubmit').hide();
    //    $('#btnSave').hide();

    //}

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        // console.log(response);

        var data = response.data.data.Table[0];

        if (data) {

            IsView = false;

            $("#ddlBOMCategory").val(data.Category).trigger('change');
            $("#hdnBOMId").val(data.BOMId);
            $('#ddlBOMCategory').prop('disabled', true);
            $("#txtBOMNumber").val(data.BOMNumber);
            $("#txtSampleID").val(data.SampleId == null ? '' : data.SampleId);
            $("#txtPackSize").val(data.PackSize);
            $("#txtQuantity").val(data.Quantity);
            $("#txtWastage").val(data.WastagePercent);
            $("#txtFormulatedBy").val(data.FormulatedBy);
            $("#txtFMCode").val(data.FMCode == null ? '' : data.FMCode);
            $("#ddlBOMCustomerCompany").val(data.CustomerCompany == null ? 'Select' : data.CustomerCompany).trigger('change');
            //$("#txtBrandName").val();
            //$("#ddlBOMCustomerContactPerson").val();
            $('#txtMIItemName').val(data.ITEM_NAME);
            $('#ddlItem').val(data.ITEM_ID);
            $("#txtRemarks").val(data.Remarks);




            var index = 0;
            for (item of response.data.data.Table1) {

                if (index == 0) {
                    $('#ddlItem_0').val(item.Ingredient_ID)
                    $('#ddlI_0').val(item.Ingredient_Name)
                    $('#quantity_0').val(item.Quantity).trigger('change');
                    $('#sale_0').val(item.Selling_Price).trigger('change');
                    $('#purch_0').val(item.IsPurchAvl);
                    if (item.IsPurchAvl == 1) {

                        const $input = $('#purchrate_0');

                        // Change type to text
                        $input.attr('type', 'text');

                        // Remove oninput attribute (only keep HideErrorMessage)
                        $input.attr('oninput', 'HideErrorMessage(this)');

                        // Set value and disable field
                        $input.val('Purchase Rate Available').prop('disabled', true);

                        // Store actual purchase rate in hidden field
                        $('#purchrate1_0').val(item.Purchase_Price);
                    }
                    else {
                        const $input = $('#purchrate_0');

                        // Change type to text
                        $input.attr('type', 'text');

                        $input.value = item.Purchase_Price

                        // Remove oninput attribute (only keep HideErrorMessage)
                        $input.attr('oninput', 'HideErrorMessage(this); SetZero(this)');

                        // Set value and disable field
                        $input.val('').prop('disabled', false);

                        // Store actual purchase rate in hidden field
                        $('#purchrate1_0').val(item.Purchase_Price);
                        $('#purchrate_0').val(item.Purchase_Price);

                    }

                    $('#total_0').html(($('#quantity_0').val() * $('#sale_0').val()).toFixed(2));

                    CalculateTotal();


                    if (IsView == 'true') {
                        $('#ddlItem_0').prop('disabled', true);
                        $('#ddlI_0').prop('disabled', true);
                        $('#quantity_0').prop('disabled', true);
                        $('#sale_0').prop('disabled', true);
                        $('#purchrate_0').prop('disabled', true);
                        // Hide only the first <td> in each row
                        $("#ingredientTable1 tr td:first-child div").hide();
                        //  $("#ingTbleHead tr th:first-child div").hide();
                    }
                }
                else {
                    var rowIndex = addRow1();


                    $('#ddlItem_' + rowIndex).val(item.Ingredient_ID)
                    $('#ddlI_' + rowIndex).val(item.Ingredient_Name)
                    $('#quantity_' + rowIndex).val(item.Quantity).trigger('change');
                    $('#sale_' + rowIndex).val(item.Selling_Price).trigger('change');

                    $('#total_' + rowIndex).html(($('#quantity_' + rowIndex).val() * $('#sale_' + rowIndex).val()).toFixed(2));

                    $('#purch_' + rowIndex).val(item.IsPurchAvl);
                    if (item.IsPurchAvl == 1) {

                        const $input = $('#purchrate_' + rowIndex);

                        // Change type to text
                        $input.attr('type', 'text');

                        // Remove oninput attribute (only keep HideErrorMessage)
                        $input.attr('oninput', 'HideErrorMessage(this)');

                        // Set value and disable field
                        $input.val('Purchase Rate Available').prop('disabled', true);

                        // Store actual purchase rate in hidden field
                        $('#purchrate1_' + rowIndex).val(item.Purchase_Price);
                    }
                    else {
                        const $input = $('#purchrate_' + rowIndex);

                        // Change type to text
                        $input.attr('type', 'text');

                        $input.value = item.Purchase_Price

                        // Remove oninput attribute (only keep HideErrorMessage)
                        $input.attr('oninput', 'HideErrorMessage(this); SetZero(this)');

                        // Set value and disable field
                        $input.val('').prop('disabled', false);

                        // Store actual purchase rate in hidden field
                        $('#purchrate1_' + rowIndex).val(item.Purchase_Price);
                        $('#purchrate_' + rowIndex).val(item.Purchase_Price);
                    }

                    if (IsView == 'true') {
                        $('#ddlItem_' + rowIndex).prop('disabled', true);
                        $('#ddlI_' + rowIndex).prop('disabled', true);
                        $('#quantity_' + rowIndex).prop('disabled', true);
                        $('#sale_' + rowIndex).prop('disabled', true);
                        $('#purchrate_' + rowIndex).prop('disabled', true);
                        // Hide only the first <td> in each row
                        $("#ingredientTable1 tr td:first-child div").hide();
                        //  $("#ingTbleHead tr th:first-child").hide();


                    }

                    CalculateTotal();
                }
                index++;

            }


            // EditQCValues(response.data.data.Table2);

            index = 0;
            for (item of response.data.data.Table2) {

                if (index == 0) {
                    $('#txtManufacturingProcess_0').val(item.ProcessDescription);
                    $('#txtManufacturingRPM_0').val(item.RPM);
                    $('#txtManufacturingTemp_0').val(item.Temperature);


                    if (IsView == 'true') {
                        $('#txtManufacturingProcess_0').prop('disabled', true);
                        $('#txtManufacturingRPM_0').prop('disabled', true);
                        $('#txtManufacturingTemp_0').prop('disabled', true);

                        $("#tblManufacturingProcess tbody tr td:first-child div").hide();
                    }

                }
                else {
                    var rowIndex = ManufacturingProcessAddRow();


                    $('#txtManufacturingProcess_' + rowIndex).val(item.ProcessDescription);
                    $('#txtManufacturingRPM_' + rowIndex).val(item.RPM);
                    $('#txtManufacturingTemp_' + rowIndex).val(item.Temperature);

                    $('#txtManufacturingProcess_' + rowIndex).prop('diabled', true);
                    $('#txtManufacturingRPM_' + rowIndex).prop('diabled', true);
                    $('#txtManufacturingTemp_' + rowIndex).prop('diabled', true);

                    if (IsView == 'true') {
                        $('#txtManufacturingProcess_' + rowIndex).prop('disabled', true);
                        $('#txtManufacturingRPM_' + rowIndex).prop('disabled', true);
                        $('#txtManufacturingTemp_' + rowIndex).prop('disabled', true);

                        $("#tblManufacturingProcess tbody tr td:first-child div").hide();
                    }


                }
                index++;

            }


            index = 0;
            for (item of response.data.data.Table3) {

                if (index == 0) {

                    $('#txtUOM_0').val(item.UoM);
                    $('#txtResultType_0').val(item.ResultType);
                    $('#txtMeasuringUnit_0').val(item.MeasuringUnit);


                    var obj6 = {
                        parentId: 0,
                        masterTableTypeId: 0,
                        isMasterTableType: false,
                        isManualTable: true,
                        manualTable: 8,
                        manualTableId: 0,
                        ScreenId: 'ERP_FMS_101'
                    }
                    LoadMasterDropdown(`ddlBOMTestName_0`, obj6, 'Select', false, item.TestName);


                    if (IsView == 'true') {
                        $('#ddlBOMTestName_0').prop('disabled', true);
                        $('#txtUOM_0').prop('disabled', true);
                        $('#txtResultType_0').prop('disabled', true);
                        $('#txtMeasuringUnit_0').prop('disabled', true);

                        $("#tblQualityParameters tbody tr td:first-child div").hide();
                    }

                }
                else {
                    var rowIndex = QualityParametersAddRowEdit(item.TestName);


                    $('#txtUOM_' + rowIndex).val(item.UoM);
                    $('#txtResultType_' + rowIndex).val(item.ResultType);
                    $('#txtMeasuringUnit_' + rowIndex).val(item.MeasuringUnit);

                    if (IsView == 'true') {
                        $('#ddlBOMTestName_' + rowIndex).prop('disabled', true);
                        $('#txtUOM_' + rowIndex).prop('disabled', true);
                        $('#txtResultType_' + rowIndex).prop('disabled', true);
                        $('#txtMeasuringUnit_' + rowIndex).prop('disabled', true);

                        $("#tblQualityParameters tbody tr td:first-child div").hide();
                    }


                }
                index++;

            }






            console.log(response.data.data.Table4);

            for (var i = 0; i < response.data.data.Table4.length; i++) {
                var fileName = response.data.data.Table4[i].ActualFileName;
                var fileType = response.data.data.Table4[i].FileType;
                var type = response.data.data.Table4[i].Type;
                var fileUrl = response.data.data.Table4[i].FileUrl;
                var fFd = response.data.data.Table4[i].AttachmentID;
                var fSize = response.data.data.Table4[i].FileSize;
                var newfileName = response.data.data.Table4[i].NewFileName;


                LoadFileDataBOM(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);

            }

        }


    });
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


function LoadFileDataBOM(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    var fileObject =
    {
        "TypeDetails": type,
        "FileType": fileType,
        "FolderNames": "BOMDocuments/",
        "ActualFileName": fileName,
        "NewFileName": newfileName,
        "FileUrl": fileUrl,
        "FileSize": sSize,

    };
    fileModelListBOM.push(fileObject);

    let previewElement;

    if (fileType === "image" || (fileUrl.split('.')[1].includes('png') || fileUrl.split('.')[1].includes('jpe'))) {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="~${fileUrl}" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile4(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if ((fileType === "application" && type === "application/pdf") || fileUrl.split('.')[1].includes('pdf')) {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile4(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
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
                        <button onclick="RemoveAttachFile4(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile4(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileUrl.split('.')[1].includes('xlsx')) {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile4(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
        <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile4(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    /*newDocument.classList.add("document-file");*/
    newDocument.classList.add("document-file4", "document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages4").appendChild(newDocument);
}




var isOpened = 0;



function openBOMModel() {

    if (Item_Id == 0) {
        return;
    }


    if ($('#ddlCategory').val() == localStorage.getItem('BaseId') && $('#txtItemCode').val().length > 0) {

        if (isOpened == 1) {
            $('#billmaterial').modal('show');
        }

        else {

            if ($("#hdnItemMasterId").val() > 0) {
                var model =
                {

                    Type: 5,
                    FMS_Id: 1000
                };
                const jsonString = JSON.stringify(model);
                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_PCFMS_102' }, 'GET', function (response) {

                    var data = response.data.data.Table[0];

                    if (data.IsPermitUser == 0) {
                        FailToaster('You do not have the permission to edit this B.O.M !!!');
                        return;
                    }
                    $('#billmaterial').modal('show');

                    $('#item_codeb').html($('#txtItemCode').val());
                    GetBOMDetByItemCode($('#txtItemCode').val());
                    GetBOMDocNo();
                    LoadItemDropdown();

                    isOpened = 1;

                });

            }
            else {

                var model =
                {

                    Type: 4,
                    FMS_Id: 1000
                };
                const jsonString = JSON.stringify(model);
                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_PCFMS_102' }, 'GET', function (response) {

                    var data = response.data.data.Table[0];

                    if (data.IsPermitUser == 0) {
                        FailToaster('You do not have the permission to add this B.O.M !!!');
                        return;
                    }

                    $('#billmaterial').modal('show');

                    $('#item_codeb').html($('#txtItemCode').val());
                    GetBOMDetByItemCode($('#txtItemCode').val());
                    GetBOMDocNo();
                    LoadItemDropdown();

                    isOpened = 1;
                });

            }
        }

    }
    else {
        
        FailToaster('Please select base category to fill the BOM of base or fill the Item Code!!');
    }
}

function QualityParametersAddRow(button) {
    const tableBody = document.querySelector('#tblQualityParameters tbody');
    const rowCount = tableBody.rows.length + 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
		<td class="text-center">
			<div onclick="deleteRow1(this);">
				<img src="../../assets/images/icons/help/close.svg" alt="" class="cursor-pointer img-15">
			</div>
		</td>
		<td>${rowCount}</td>

		<td>
			<select class="form-control MandateQ applyselect" onchange="GetQCParam(this); HideErrorMessage(this)" id="ddlBOMTestName_${rowCount}">
										
										</select>
										<span id="spddlBOMTestName_${rowCount}" class="text-danger field-validation-error" style="display:none;">Oops ! You've missed this field</span>

		</td>
	

		 <td>
			<input type="text" id="txtResultType_${rowCount}" onchange="HideErrorMessage(this)" oninput="HideErrorMessage(this)" class="form-control MandateQ text-right" placeholder="---">
			<span id="sptxtResultType_${rowCount}" class="text-danger field-validation-error" style="display:none;">Oops ! You've missed this field</span>
		</td>
		 <td>
			<input type="text" id="txtMeasuringUnit_${rowCount}" onchange="HideErrorMessage(this)" oninput="HideErrorMessage(this)" class="form-control MandateQ text-right" placeholder="---">
			<span id="sptxtMeasuringUnit_${rowCount}" class="text-danger field-validation-error" style="display:none;">Oops ! You've missed this field</span>
		</td>

	`;

    tableBody.appendChild(newRow);

    var obj6 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 8,
        manualTableId: 0,
        ScreenId: 'ERP_FMS_101'
    }
    LoadMasterDropdown(`ddlBOMTestName_${rowCount}`, obj6, 'Select', false);

    $(".applyselect").select2();
}


function QualityParametersAddRowEdit(SelectedValue) {
    const tableBody = document.querySelector('#tblQualityParameters tbody');
    const rowCount = tableBody.rows.length + 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
	<td class="text-center">
		<div onclick="deleteRow1(this);">
			<img src="../../assets/images/icons/help/close.svg" alt="" class="cursor-pointer img-15">
		</div>
	</td>
	<td>${rowCount}</td>

	<td>
		<select class="form-control MandateQ applyselect" onchange="HideErrorMessage(this)" id="ddlBOMTestName_${rowCount}">
									
									</select>
									<span id="spddlBOMTestName_${rowCount}" class="text-danger field-validation-error" style="display:none;">Oops ! You've missed this field</span>

	</td>

	 <td>
		<input type="text" id="txtResultType_${rowCount}" oninput="HideErrorMessage(this)" class="form-control MandateQ text-right" placeholder="---">
		<span id="sptxtResultType_${rowCount}" class="text-danger field-validation-error" style="display:none;">Oops ! You've missed this field</span>
	</td>
	 <td>
		<input type="text" id="txtMeasuringUnit_${rowCount}" oninput="HideErrorMessage(this)" class="form-control MandateQ text-right" placeholder="---">
		<span id="sptxtMeasuringUnit_${rowCount}" class="text-danger field-validation-error" style="display:none;">Oops ! You've missed this field</span>
	</td>

`;

    tableBody.appendChild(newRow);

    var obj6 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 8,
        manualTableId: 0,
        ScreenId: 'ERP_FMS_101'
    }
    LoadMasterDropdown(`ddlBOMTestName_${rowCount}`, obj6, 'Select', false, SelectedValue);

    $(".applyselect").select2();

    return rowCount;
}


function addRow1() {

    var rowCount;

    const tableBody = document.getElementById('ingredientTable1');
    rowCount = tableBody.rows.length + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'ing';
    newRow.id = `ing_${rowCount}`;

    newRow.innerHTML = `
        
            <td class="text-center">
                <div onclick="deleteRow1(this);CalculateTotal()">
                    <img src="../../assets/images/icons/help/close.svg" alt="" class="cursor-pointer img-15">
                </div>
            </td>
            <td>${rowCount}</td>

           <td>

                <div class="autocomplete-wrapper" style="position: relative;">
                    <label for="ddlI_${rowCount}" class="search-label">
                        <img src="../../../assets/images/icons/help/search-icon.png" class="icon-sm" />
                    </label>
                    <input type="text" class="form-control searchlist MandateIng" id="ddlI_${rowCount}" oninput="Getdata(this), HideErrorMessage(this)" onclick="Getdata(this), HideErrorMessage(this)" placeholder="Type item..." autocomplete="off" />
                    <span id="spddlI_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    <ul id="globalSuggestionBox_${rowCount}" class="suggestions left-initial"></ul>
                    <input type="hidden" id="ddlItem_${rowCount}" />
                </div>

            </td>
             <td>
                 <input type="number" id="quantity_${rowCount}" oninput="CalculateRate(this), HideErrorMessage(this)"  class="form-control MandateIng text-right" placeholder="0">
                  <span id="spquantity_${rowCount}" class="text-danger field-validation-error"  style="display:none;">Hey, You missed this field!!</span>
             </td>
             <td>
                 <input type="number" id="sale_${rowCount}" onchange="CalculateRate(this)" oninput="CalculateRate(this), HideErrorMessage(this)" class="form-control MandateIng text-right" placeholder="0">
                  <span id="spsale_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                 <input type="hidden" id="purch_${rowCount}" />
             </td>

              <td>
                 <input type="number" id="purchrate_${rowCount}" oninput="HideErrorMessage(this); SetZero(this)" class="form-control MandateIng text-right" placeholder="0">
                  <span id="sppurchrate_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                 <input type="hidden" id="purchrate1_${rowCount}" />
             </td>

             <td>
                 <input type="number" id="mpr_${rowCount}" disabled class="form-control  text-right" placeholder="0">
             </td>
             <td class="text-right">₹ <enum id="total_${rowCount}">0</enum></td>
        `;

    tableBody.appendChild(newRow);
    $(".applyselect").select2();

    return rowCount;
}

function ManufacturingProcessAddRow(button) {
    const tableBody = document.querySelector('#tblManufacturingProcess tbody');
    const rowCount = tableBody.rows.length + 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
		<td class="text-center">
			<div onclick="showdeleteRow2(this);">
				<img src="../../assets/images/icons/help/close.svg" alt="" class="cursor-pointer img-15">
			</div>
		</td>
		<td>${rowCount}</td>

		 <td>
			<input type="text" id="txtManufacturingProcess_${rowCount}"  oninput="HideErrorMessage(this)" class="form-control MandateP" placeholder="---">
			<span id="sptxtManufacturingProcess_${rowCount}" class="text-danger field-validation-error" style="display:none;">Oops ! You've missed this field</span>
		</td>

		 <td>
			<input type="number" id="txtManufacturingRPM_${rowCount}"  oninput="HideErrorMessage(this); SetZero(this)" class="form-control MandateP text-right" placeholder="---">
			<span id="sptxtManufacturingRPM_${rowCount}" class="text-danger field-validation-error" style="display:none;">Oops ! You've missed this field</span>
		</td>
		 <td>
			<input type="number"  oninput="HideErrorMessage(this); SetZero(this)" id="txtManufacturingTemp_${rowCount}" class="form-control MandateP text-right" placeholder="---">
			<span id="sptxtManufacturingTemp_${rowCount}" class="text-danger field-validation-error" style="display:none;">Oops ! You've missed this field</span>
		</td>

	`;

    tableBody.appendChild(newRow);
    $(".applyselect").select2();

    return rowCount;
}

function SetZero(ctrl) {
    let val = parseFloat(ctrl.value);

    if (isNaN(val) || val < 0) {
        ctrl.value = '';
        return -1;
    }

    const decimalPart = ctrl.value.split('.')[1];
    const decimalPart1 = ctrl.value.split('.')[0];

    if (decimalPart1.length > 9) {
        FailToaster('Number should be maximum of 9 digit!!');
        ctrl.value = '';
        return -1;
    }


    var id = ctrl.id

    if (id.toLowerCase().includes("quantity")) {
        if (decimalPart && decimalPart.length > 4) {
            // Floor to 2 decimal places
            val = Math.floor(val * 10000) / 10000;
            ctrl.value = val.toString();
        }
    }

    else {
        if (decimalPart && decimalPart.length > 2) {
            // Floor to 2 decimal places
            val = Math.floor(val * 100) / 100;
            ctrl.value = val.toString();
        }
    }

    return 1;
}

function CalculateRate(ctrl) {

    var rowId = ctrl.id.split("_")[1];

    var ans = SetZero(ctrl);

    if (ans == -1) {
        return;
    }

    $('#total_' + rowId).html(($('#quantity_' + rowId).val() * $('#sale_' + rowId).val()).toFixed(2));

    CalculateTotal();



}

function CalculateTotal() {
    var totalQuantity = 0;
    var totalPrice = 0;



    document.querySelectorAll("tr.ing").forEach(row => {
        // Split the id to get the index
        const rowId = row.id; // e.g., "ing_0"
        const index = rowId.split("_")[1];

        // Find the quantity input inside the row using the index
        const quantityInput = document.getElementById(`quantity_${index}`);
        const totalInput = document.getElementById(`total_${index}`);

        if (quantityInput) {
            const quantity = parseFloat(quantityInput.value);
            if (!isNaN(quantity)) {
                totalQuantity += quantity;
            }
        }

        if (totalInput) {
            const total = parseFloat(totalInput.innerHTML);
            if (!isNaN(total)) {
                totalPrice += total;
            }
            else {
                totalPrice = 0;
            }
        }

    });

    document.querySelectorAll("tr.ing").forEach(row => {

        // Split the id to get the index
        const rowId1 = row.id.split('_')[1]; // e.g., "ing_0"


        const mpr = $('#quantity_' + rowId1).val() / totalQuantity * 100;

        $('#mpr_' + rowId1).val(mpr.toFixed(3));

    })



    $('#total_quantity').html(totalQuantity.toFixed(4))


    $('#total_cost').html(totalPrice.toFixed(2));

    if (totalQuantity != 0) {
        $('#cost_per_kg').html((totalPrice / totalQuantity * 1000).toFixed(2));
    }
    else {
        $('#cost_per_kg').html(0);
    }
}

function Getdata(inputElement) {
    let rowId = inputElement.id.split('_')[1]; // Extract RowId from input ID
    let suggestionBox = document.getElementById(`globalSuggestionBox_${rowId}`);
   /// document.getElementById(`globalSuggestionBox_${rowId}`).style.zIndex = '999999999 !important';
    let search = inputElement.value.toLowerCase();
    suggestionBox.innerHTML = "";

    //if (search.length < 2) {
    //    suggestionBox.style.display = "none";
    //    return;
    //}

    let matchedItems = ItemCodeList.filter(item =>
        item.ITEM_DISPLAY.toLowerCase().includes(search) || item.ITEM_DISPLAY.toLowerCase().includes(search)
    ).slice(0, 50);

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
                inputElement.value = item.ITEM_NAME; // Set selected value in input
                suggestionBox.style.display = "none";

                $(`#ddlItem_` + rowId).val(item.ITEM_ID);
                $(`#lblItemName_` + rowId).text(item.ITEM_NAME);
                $(`#lblItemDesc_` + rowId).text(item.DESCRIPTION);
                $(`#lblUnit_` + rowId).text(item.UNIT);
                GetItemDetails(item.ITEM_ID, rowId);

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


function GetItemDetails(ITEM_ID, rowId) {

    var model =
    {
        Id: 1,
        ITEM_ID: ITEM_ID,
        Type: 5
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        var data = response.data.data.Table[0];

        $('#sale_' + rowId).val(data.SALE_RATE).trigger('change');
        $('#purch_' + rowId).val(data.IsPurchQtyAvl);
        if (data.IsPurchQtyAvl == 1) {
            const $input = $('#purchrate_' + rowId);

            // Change type to text
            $input.attr('type', 'text');

            // Remove oninput attribute (only keep HideErrorMessage)
            $input.attr('oninput', 'HideErrorMessage(this)');

            // Set value and disable field
            $input.val('Purchase Rate Available').prop('disabled', true);

            // Store actual purchase rate in hidden field
            $('#purchrate1_' + rowId).val(data.PURCH_RATE);
        }
        else {


            const $input = $('#purchrate_' + rowId);

            // Change type to text
            $input.attr('type', 'number');

            // Remove oninput attribute (only keep HideErrorMessage)
            $input.attr('oninput', 'HideErrorMessage(this); SetZero(this)');

            // Set value and disable field
            $input.val('').prop('disabled', false);

            $('#purchrate1_' + rowId).val(data.PURCH_RATE);
        }

    });

}




var ItemCodeList = [];

function LoadItemDropdown() {
    var model =
    {
        ColumnName: 'Name',
        SearchData: 'Filter by BOM ItemCat'
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
function GetBOMDocNo() {

    var model =
    {
        Id: 1,
        Type: 10
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        let data = response.data.data.Table[0];


        $('#txtFormulatedBy').val(data.fullName);
        $('#txtBOMNumber').val(data.BOM_Doc_No);


    });

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 8,
        manualTableId: 0,
        ScreenId: 'ERP_FMS_101'
    }
    LoadMasterDropdown('ddlBOMTestName_0', obj2, 'Select', false);

}


// 🔁 Debounce function definition
function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}
var indentTable;
var ItemsArray = [];
function checkConversionFactor()
{
    if ($('#ddlUnit').val() > 0 && $('#ddlAlternateUnit').val() > 0 && $('#ddlUnit').val() !== $('#ddlAlternateUnit').val()) {
        $('#txtConversionFactor').prop('disabled', false);
        if ( parseFloat($("#txtConversionFactor").val())== 0)

        {
            $("#txtConversionFactor").val("0");
        }
       
      
    }
    else if ($('#ddlUnit').val() > 0 && $('#ddlAlternateUnit').val() > 0 && $('#ddlUnit').val() === $('#ddlAlternateUnit').val()) {
        $('#txtConversionFactor').prop('disabled', true);
        $("#txtConversionFactor").val("1");
    }
    
}

$('#ddlUnit').change(function () {

    if (edit_id_sub > 0) {
        edit_id_sub = 0;
        return;
    }

    var obj = {
        parentId: $("#ddlCategory").val(),
        masterTableTypeId: 102,
        isMasterTableType: false,
        isManualTable: false,
        manualTable: 0,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlSubCategory', obj, 'Select', false);
});

function GetItemSubCategoryListById() {
    var itemCatId = $("#ddlCategory").val() > 0 ? $("#ddlCategory").val() : 0;
    if (itemCatId > 0) {
        var obj = {
            parentId: itemCatId,
            masterTableTypeId: 102,
            isMasterTableType: false,
            isManualTable: false,
            manualTable: 0,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlSubCategory', obj, 'Select', false, subcateId);

        //Bind Customer Code
        if ($('#hdnItemMasterId').val() == "0" || $('#hdnItemMasterId').val() == "") {
            var model =
            {
                ID: itemCatId,
                OtherId: 0,
                ModuleId: 6
            };
            const jsonString = JSON.stringify(model);
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
                var tblDocNo = response.data.data.Table;
                if (tblDocNo[0].DocLock == 0) {
                    $('#txtItemCode').val(tblDocNo[0].DocNumber);
                    $('#txtItemCode').prop('disabled', true);
                }
                else {
                    $('#txtItemCode').val('');
                    $('#txtItemCode').prop('disabled', false);
                }

                if (response.data.data.Table1[0].IsItemCatIdMatchQC == 1) {
                    document.getElementById("qcyes").checked = true;
                }
                else {
                    document.getElementById("qcno").checked = true;
                }

                setQCApplicable();

            });

        }

        //End
    }

}

var exceldata = [];

var itemId = 0;
var subcateId = '';

var edit_itemtax = '';
function GetItemMasterDetById(id) {
    itemId = id;
    var model = {
        ID: id
    };
    const jsonString = JSON.stringify(model);
    var ScreenID = "ItemMaster_101";
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var tableData = response.data.data.Table;
        if (tableData && tableData.length > 0) {
            console.log(tableData);
            $("#hdnItemMasterId").val(tableData[0].ITEM_ID);
            $('#txtItemCode').val(tableData[0].ItemCode);
            $('#txtItemCode').prop('readonly', true);
            $('#txtItemName').val(tableData[0].ItemName);
            BindDropdown('ddlHSN', tableData[0].HSNId);
            $('#txtDescription').val(tableData[0].Description);

            var statusValue = tableData[0].ItemStatus;
            $('input[name="status"][value="' + statusValue + '"]').prop('checked', true);
            BindDropdown('ddlDefaultWarehouse', tableData[0].WarehouseId);

            var batchValue = tableData[0].BatchApplicable;
            $('input[name="batchapplicable"][value="' + batchValue + '"]').prop('checked', true);
            var qcValue = tableData[0].QC_APPLICABLE;
            $('input[name="qcapplicable"][value="' + qcValue + '"]').prop('checked', true);
            if (qcValue == "Yes") {
                var IsBioMetricallyValue = tableData[0].IsBioMetrically;
                document.getElementById('divUserType').style.display = 'none';
                document.getElementById('divQCTestMapping').style.display = 'block';
                $('input[name="biometrically"][value="' + IsBioMetricallyValue + '"]').prop('checked', true);
            }
            else {
                document.getElementById('divUserType').style.display = 'none';
                document.getElementById('divQCTestMapping').style.display = 'none';
            }
            subcateId = tableData[0].GroupId > 0 ? tableData[0].GroupId : 'Select';

            BindDropdown('ddlCategory', tableData[0].CategoryId);

            $("#ddlCategory").prop('disabled', true);

            var obj = {
                parentId: tableData[0].CategoryId,
                masterTableTypeId: 102,
                isMasterTableType: false,
                isManualTable: false,
                manualTable: 0,
                manualTableId: 0,
                ScreenId: 'DropdownList_101'
            }
            LoadMasterDropdown('ddlSubCategory', obj, 'Select', false, subcateId);


            BindDropdown('ddlUnit', tableData[0].StockUnitId);
            $('#txtAlternateUnit').val(tableData[0].AltUnitId);
            BindDropdown('ddlAlternateUnit', tableData[0].AltUnitTypeId);
            BindDropdown('ddlPurchAccName', tableData[0].PurchAccId);

            $('#txtConversionFactor').val(tableData[0].ConversionFactor);

            BindDropdown('ddlSaleAccName', tableData[0].SaleAccId);

            BindDropdown('ddlCharge', tableData[0].PurchTaxId);

            $('#txtPurchRate').val(tableData[0].PurchRate);
            $('#txtSaleRate').val(tableData[0].SaleRate);

            $('#txtMinStockLevel').val(tableData[0].MinQty);
            $('#txtMaxStockLevel').val(tableData[0].MaxStockLevel);
            $('#txtSafetyStockLevel').val(tableData[0].SafetyStockLevel);
            BindDropdown('ddlPreferredSupplier', tableData[0].PreferedSupplierId);


            $('#txtLeadTime').val(tableData[0].LeadTime);

            BindDropdown('ddlLoadTime', tableData[0].LeadtimeType);
            $('#txtPackSize').val(tableData[0].PackSize);
            $('#txtTolerance').val(tableData[0].Tolerance);

            BindDropdown('ddlBrandType', tableData[0].BrandTypeId);
            $('#itemCharges').text(tableData[0].ItemCharges);

            edit_itemtax = tableData[0].ItemCharges;
            //Item Attachment
            for (var i = 0; i < response.data.data.Table1.length; i++) {
                var fileName = response.data.data.Table1[i].ActualFileName;
                var fileType = response.data.data.Table1[i].FileType;
                var type = response.data.data.Table1[i].Type;
                var fileUrl = response.data.data.Table1[i].FileUrl;
                var fFd = response.data.data.Table1[i].AttachmentId;
                var fSize = response.data.data.Table1[i].FileSize;
                var newfileName = response.data.data.Table1[i].NewFileName;
                var attachmentType = response.data.data.Table1[i].AttachmentType;
                //Check type and load
                if (attachmentType == 'Upload1') {
                    LoadFileData1(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                }
                else if (attachmentType == 'Upload2') {
                    LoadFileData2(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                }
                else {
                    LoadFileData3(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                }
            }

            // Load Item Charges (Table2)
            //if (response.data.data.Table2 && response.data.data.Table2.length > 0) {
            //    BindItemMasterCharge(response.data.data.Table2);
            //}

            if (response.data.data.Table2 && response.data.data.Table2.length > 0) {
                sessionStorage.setItem("chargeData", JSON.stringify(response.data.data.Table2));
            }

            statusValue == 'Active' ? $('#btnSave').show() : $('#btnSave').hide();    //Hide & Show Save button

            // Set Transaction Type (Production = 1, Purchase = 2)
            var transactionTypeValue = tableData[0].TransactionType || 0;
            $('input[name="TransactionType"][value="' + transactionTypeValue + '"]').prop('checked', true);


        }
        else {
            console.error("Item not found..", error);
        }

    });
}

let fileModelList = [];
let fileModelList1 = [];
let fileModelList2 = [];

let fileDatalList = [];
let fileDatalList1 = [];
let fileDatalList2 = [];


function BaseBOMCondition() {

    if ($('#ddlCategory').val() != localStorage.getItem('BaseId')) {
        return true;
    }
    else {
        if (checkValidationOnSubmit('MandatoryB')) {

            checkQ = checkValidationOnSubmit('MandateQ');
            checkIng = checkValidationOnSubmit('MandateIng');
            checkP = checkValidationOnSubmit('MandateP');

            if (checkQ && checkIng && checkP) {

                var ingred = [];



                $('.ing').each((index, ele) => {

                    var rowId = ele.id.split('_')[1];



                    if ($('#ddlItem_' + rowId).val() <= 0 || !ItemCodeList.find(input => input.ITEM_NAME == $('#ddlI_' + rowId).val())) {
                        $('#billmaterial').modal('show');
                        FailToaster('Please select a valid ingredient for base!!!');
                        return false;
                    }

                    var obj = {
                        Ingredient_ID: $('#ddlItem_' + rowId).val(),
                        Ingredient_Name: $('#ddlI_' + rowId).val(),
                        Quantity: $('#quantity_' + rowId).val(),
                        Purchase_Price: $('#purch_' + rowId).val(),
                        Selling_Price: $('#sale_' + rowId).val(),
                        Material_PR: $('#mpr_' + rowId).val(),
                        Cost_Per_Kg: (($('#sale_' + rowId).val() * $('#quantity_' + rowId).val()) / $('#quantity_' + rowId).val()) * 1000
                    }

                    ingred.push(obj);


                });

                if (hasDuplicateItemIds(ingred) == 1) {
                    FailToaster('Duplicate Ingredients found!!');
                    return false;
                }
                else if (hasDuplicateItemIds(ingred) == 2) {
                    FailToaster('Ingredient Name Not found!!');
                    return false;
                }

                if (parseFloat($('#total_cost').html()) <= 0) {
                    FailToaster('Total Cost of Ingredients cannot be equal to 0!!');
                    return false;
                }

                return true;
            }
            else {
                openBOMModel();
                return false;
            }
        }
        else {
            openBOMModel();
            return false;
        }
    }
}

function hasDuplicateItemIds(data) {
    const itemIds = new Set();
    for (const row of data) {
        if (itemIds.has(row.Ingredient_ID)) {
            itemIds.add(row.Ingredient_ID);
            console.log(itemIds);
            return 1; // duplicate found
        }
        else if (!parseInt(row.Ingredient_ID)) {
            return 2;
        }
        itemIds.add(row.Ingredient_ID);
    }
    return 0;
}

async function SaveItemMaster() {
    var id = parseInt($("#hdnItemMasterId").val());
   
    if (checkValidationOnSubmit('Mandatory') == true) {

        //var isBomCondition = BaseBOMCondition();

        //if (!isBomCondition) {
        //    return false;
        //}

        var batchApplicable = $('input[name="batchapplicable"]:checked').val();
        if (!batchApplicable) {
            FailToaster("Please select whether Batch is applicable or not.");
            return;
        }
        var qcApplicable = $('input[name="qcapplicable"]:checked').val();
        if (!qcApplicable) {
            FailToaster("Please select whether QC is applicable or not.");
            return;
        }
        if ($('#itemCharges').text() == '') {
            FailToaster("Please select item tax mapping.");
            return;
        }

        if ($("#ddlUnit").val() != $("#ddlAlternateUnit").val()) {
            if ($("#txtConversionFactor").val() <= 0) {
                FailToaster("When Base unit & Alt Unit different, Please fill Conversion Factor.");
                return;
            }
        }
        if ($("#ddlCategory option:selected").text().trim() === "Packing Material") {
            if ($("#ddlSubCategory").val() <= 0 || $("#ddlSubCategory").val() === "Select") {
                FailToaster("Please select subcategory when category is Packing Material.");
                return;
            }
        }

        var obj =
        {
            FolderNames: "ItemDocuments/"
        }
        var type = 1;//This is for  common upload in attachment folder.
        const jsonString = JSON.stringify(obj);
        const result1 = await MultiFileUploadWithoutAync("fileMaterialPhoto", jsonString, type, fileDataCollection1);
        const result2 = await MultiFileUploadWithoutAync("fileMaterialCOA", jsonString, type, fileDataCollection2);
        const result3 = await MultiFileUploadWithoutAync("fileAttachment3", jsonString, type, fileDataCollection3);
        var fileData1 = [];
        var fileData2 = [];
        var fileData3 = [];
        var finalFileData1 = [];
        var finalFileData2 = [];
        var finalFileData3 = [];

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
            fileData2 = fileData2.concat(fileDatalList1);
            finalFileData2 = finalFileData2.concat(fileData2);
        }
        else {
            fileData2 = fileModelList1;
        }

        if (result3.Data != undefined) {
            fileData3 = JSON.parse(result3.Data).FileModelList;
            fileData3 = fileData3.concat(fileDatalList2);
            finalFileData3 = finalFileData3.concat(fileData3);
        }
        else {
            fileData3 = fileModelList2;
        }

        finalFileData1 = fileModelList.concat(finalFileData1);
        finalFileData2 = fileModelList1.concat(finalFileData2);
        finalFileData3 = fileModelList2.concat(finalFileData3);

        // ✅ File count validation
        if (finalFileData1.length > 10) {
            FailToaster(finalFileData1.length + " Files. You cannot upload more than 10 files for Material Photo.");
            return;
        }
        if (finalFileData2.length > 10) {
            FailToaster(finalFileData2.length + " Files. You cannot upload more than 10 files for Material COA.");
            return;
        }
        if (finalFileData3.length > 10) {
            FailToaster(finalFileData3.length + " Files. You cannot upload more than 10 files for Item Attachments.");
            return;
        }
        var isBatchApplicable = false;
        if (document.getElementById('yes').checked == true) {
            isBatchApplicable = true;
        }

        var itemModel =
        {
            ID: id > 0 ? id : 0,
            ITEM_CODE: $("#txtItemCode").val(),
            sample_id: sample_id,
            ITEM_NAME: $("#txtItemName").val(),
            HSN_ID: $("#ddlHSN").val(),
            STATUS: $('input[name="status"]:checked').val(),  // Active or Inactive
            DESCRIPTION: $("#txtDescription").val(),
            WAREHOUSE_ID: $("#ddlDefaultWarehouse").val() > 0 ? $("#ddlDefaultWarehouse").val() : 0,
            BATCH_APPLICABLE: $('input[name="batchapplicable"]:checked').val(),
            CATEGORY_ID: $("#ddlCategory").val(),
            SUBCATEGORY_ID: $("#ddlSubCategory").val() > 0 ? $("#ddlSubCategory").val() : 0,
            BASE_UNIT_ID: $("#ddlUnit").val(),
            //ALTERNATE_UNIT: $("#txtAlternateUnit").val(),
            ALTERNATE_UNIT_ID: $("#ddlAlternateUnit").val(),
            CONVERSION_FACTOR: $("#txtConversionFactor").val(),
            /*TAX_CODE_ID: $("#ddlCharge").val() > 0 ? $("#ddlCharge").val() : 0,*/
            TAX_CODE_ID: 0,
            PURCH_RATE: $("#txtPurchRate").val(),
            SALE_RATE: $("#txtSaleRate").val(),

            MIN_STOCK_LEVEL: $("#txtMinStockLevel").val(),
            MAX_STOCK_LEVEL: $("#txtMaxStockLevel").val(),
            SAFETY_STOCK_LEVEL: $("#txtSafetyStockLevel").val(),
            PREFFERED_SUPPLIER: $("#ddlPreferredSupplier").val() > 0 ? $("#ddlPreferredSupplier").val() : 0,
            LEAD_TIME: $("#txtLeadTime").val(),
            LEAD_TIME_TYPE: $("#ddlLoadTime").val(),
            PACK_SIZE: $("#txtPackSize").val(),
            TOLERANCE: $("#txtTolerance").val(),
            BRAND_TYPE_Id: $("#ddlBrandType").val() > 0 ? $("#ddlBrandType").val() : 0,
            ITEM_TYPE: 'I',
            UserTypeId: 0,
            QC_APPLICABLE: $('input[name="qcapplicable"]:checked').val(),
            IsBioMetrically: $('input[name="biometrically"]:checked').val(),
            MaterialPhotoAttachment: fileData1,
            MaterialCOAAttachment: fileData2,
            ItemAttachment: fileData3,
            ItemTaxChargeData: itemChargeData,
            QCTestMapping: QCTestMappingData,

            PurchAccountId: $("#ddlPurchAccName").val() > 0 ? $("#ddlPurchAccName").val() : 0,
            SaleAccountId: $("#ddlSaleAccName").val() > 0 ? $("#ddlSaleAccName").val() : 0,

            TransactionType: $('input[name="TransactionType"]:checked').val() 

        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(itemModel);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "ItemMaster_101",
            Operation: id > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                if ($('#ddlCategory').val() == localStorage.getItem('BaseId') && isOpened == 1) {
                    SaveBOMData();
                }
                else {
                    setTimeout(function () {
                        ClearFormControl();
                        RedirectItemMasterList();
                    }, 1000);
                }

            }
        });
    }
}

var fileModelListBOM = [];
async function SaveBOMData() {

    var ingred = [];
    var qc = [];
    var process = [];

    if (checkValidationOnSubmit('MandatoryB') == true) {

        //if ($('#ddlBOMCategory').val() != 'sfg') {
        //    FailToaster('Development Under Process!!!!');
        //    return;
        //}

        let checkQ = true;
        let checkIng = true;
        let checkP = true;
  
            checkQ = checkValidationOnSubmit('MandateQ');
            checkIng = checkValidationOnSubmit('MandateIng');
            checkP = checkValidationOnSubmit('MandateP');
       




        if (checkQ == true && checkIng == true && checkP == true) {


            //var bomJson = buildBOMJson();
            // debugger
            //  const jsonString = BuildBOMJson();


            let isGarbage = 0;

            $('.ing').each((index, ele) => {

                var rowId = ele.id.split('_')[1];



                if ($('#ddlItem_' + rowId).val() <= 0 || !ItemCodeList.find(input => input.ITEM_NAME == $('#ddlI_' + rowId).val())) {
                    FailToaster('Please select a valid item!!!');
                    isGarbage = 1;
                    return;
                }


                var obj = {
                    Ingredient_ID: $('#ddlItem_' + rowId).val(),
                    Ingredient_Name: $('#ddlI_' + rowId).val(),
                    Quantity: $('#quantity_' + rowId).val(),
                    Purchase_Price: $('#purch_' + rowId).val() == 1 ? $('#purchrate1_' + rowId).val() : $('#purchrate_' + rowId).val(),
                    Selling_Price: $('#sale_' + rowId).val(),
                    Material_PR: $('#mpr_' + rowId).val(),
                    Cost_Per_Kg: (($('#sale_' + rowId).val() * $('#quantity_' + rowId).val()) / $('#quantity_' + rowId).val()) * 1000,
                    IsPurchAvl: $('#purch_' + rowId).val()
                }

                ingred.push(obj);
            });



            if (isGarbage == 1) {
                return;
            }

          

            var FormulaInformation = {
                Category: 'base',
                BOMNumber: $("#txtBOMNumber").val(),                
                ItemCode: $('#txtItemCode').val(),
                Quantity: $("#txtQuantity").val(),
                WastagePercent: $("#txtWastage").val(),
                FormulatedBy: $("#txtFormulatedBy").val(),
                EditMode: $("#hdnBOMId").val() > 0 ? 1 : 0,
                ExistingBOMId: $("#hdnBOMId").val()

            };


            var obj =
            {
                FolderNames: "BOMDocuments/"
            }
            var type = 1;//This is for  common upload in attachment folder.
            const jsonString1 = JSON.stringify(obj);
            const result1 = await MultiFileUploadWithoutAync("fileIndent", jsonString1, type, fileDataCollection4);

            var fileData = [];
            if (result1.Data != undefined) {
                fileData = JSON.parse(result1.Data).FileModelList;
                fileData = fileData.concat(fileModelListBOM);
            }
            else {
                fileData = fileModelListBOM;
            }

            if (fileData.length > 10) {
                FailToaster("You cannot add more than 10 files");
                return;
            }

          

            $("#tblManufacturingProcess tbody tr").each(function (index) {
                let rowNo = index == 0 ? 0 : index + 1;// + 1;

                let row = {
                    Phase: rowNo,
                    ProcessDescription: $(`#txtManufacturingProcess_${rowNo}`).val(),
                    RPM: $(`#txtManufacturingRPM_${rowNo}`).val(),
                    Temperature: $(`#txtManufacturingTemp_${rowNo}`).val()
                };

                if (row.ProcessDescription) {
                    process.push(row);
                }
            });

            $("#tblQualityParameters tbody tr").each(function (index) {
                let rowNo = index == 0 ? 0 : index + 1;// + 1;

                let row = {
                    TestName: $(`#ddlBOMTestName_${rowNo}`).val(),
                    UoM: $(`#txtUOM_${rowNo}`).val(),
                    ResultType: $(`#txtResultType_${rowNo}`).val(),
                    MeasuringUnit: $(`#txtMeasuringUnit_${rowNo}`).val()
                };

                if (row.TestName) {
                    qc.push(row);
                }
            });


            var model = {
                BOMId: 0,

                FormulaInformation: FormulaInformation,
                Ingredients: ingred,
                QualityParameters: qc,
                ManufacturingProcess: process,
                Attatchements: fileData
            }

            var jsonString = JSON.stringify(model);


            let GenericModeldata = {
                ScreenID: "BOMDetails",
                Operation: "A",  // Use Update for existing records, Add for new ones
                ModelData: jsonString
            };
            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                if (response.ValidationInput == 1) {

                    setTimeout(function () {
                        ClearFormControl();
                        RedirectItemMasterList();
                    }, 1000);

                }


            });
        }


    }
}
function DeleteItemMaster() {
    var id = parseInt($("#hdnItemMasterId").val());
    let GenericModeldata = "";
    if (id > 0) {
        var model = {
            ID: parseInt($("#hdnItemMasterId").val())
        }
        const jsonString = JSON.stringify(model);
        GenericModeldata =
        {
            ScreenID: "ItemMaster_101",
            Operation: "D",
            ModelData: jsonString,
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                $('#deletepopup').modal('hide');
                $("#hdnItemMasterId").val(0);
                ClearFormControl();
                location.reload();
            }
        });
    }
}

function RedirectItemMasterList() {

    var url = "";

    if (IsSample == 1) {
        url = "/ManageSample/SampleIndexDelete?auth=" + AuthToken;
       
    }
    else if (IsSample == 2) {
        url = "/ManageSample/SampleIndex?auth=" + AuthToken;

    }
    else {
        url = "/MaterialManagement/Material/BindItemMasterList?auth=" + AuthToken;
    }
    window.location.href = url;
}

function ClearFormControl() {
    $('#hdnItemMasterId').val(0);
    $('#txtItemCode').val('');
    $('#txtItemName').val('');
    $('#ddlHSN').val('Select').trigger('change');
    $('input[name="status"]').prop('checked', false);
    $('#txtDescription').val('');
    $('input[name="batchapplicable"]').prop('checked', false);
    $('#ddlCategory').val('Select').trigger('change');
    $('#ddlSubCategory').val('Select').trigger('change');
    $('#ddlUnit').val('Select').trigger('change');
    $('#txtAlternateUnit').val('');
    $('#ddlAlternateUnit').val('Select').trigger('change');
    $('#txtConversionFactor').val('');
    $('#ddlPurchAccName').val('Select').trigger('change');
    $('#ddlSaleAccName').val('Select').trigger('change');
    $('#ddlCharge').val('Select').trigger('change');
    $('#txtTolerance').val('');
    $('#txtMinStockLevel').val('');
    $('#txtMaxStockLevel').val('');
    $('#txtSafetyStockLevel').val('');
    $('#ddlPreferredSupplier').val('Select').trigger('change');
    $('#txtLeadTime').val('');
    $('#ddlLoadTime').val('Select').trigger('change');
    $('#txtPackSize').val('');
}

// Preview the file based on its type
function LoadFileData1(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    var fileObject =
    {
        "TypeDetails": type,
        "FileType": fileType,
        "FolderNames": "ItemDocuments/",
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
    } else {
        previewElement = `<div class="file-preview">
        <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file1", "document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages1").appendChild(newDocument);
}

function LoadFileData2(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    var fileObject =
    {
        "TypeDetails": type,
        "FileType": fileType,
        "FolderNames": "ItemDocuments/",
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
        <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile2(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file3", "document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages2").appendChild(newDocument);
}

function LoadFileData3(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    var fileObject =
    {
        "TypeDetails": type,
        "FileType": fileType,
        "FolderNames": "ItemDocuments/",
        "ActualFileName": fileName,
        "NewFileName": newfileName,
        "FileUrl": fileUrl,
        "FileSize": sSize,

    };
    fileModelList2.push(fileObject);

    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile3(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile3(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
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
                        <button onclick="RemoveAttachFile3(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile3(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile3(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
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
    newDocument.classList.add("document-file3", "document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages3").appendChild(newDocument);
}
function SelectUploadDocument() {
    $('#uploadExcelDocument').show();
}
function CloseUploadDocument() {
    $('#uploadExcelDocument').hide();
}
function splitArrayIntoChunks(array, chunkSize = 1000) {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}

function SaveUploadDocument() {

    //uploadExcel()
    if (ItemsArray.length > 0) {

        var ValidateItemsArray = ItemsArray.filter(item =>
            ![
                item.ITEM_CODE.trim(),
                item.ITEM_NAME.trim(),
                item.WAREHOUSE_ID.trim(),
                item.STATUS.trim(),
                item.HSN_ID.trim(),
                item.BATCH_APPLICABLE.trim(),
                item.CATEGORY_ID.trim(),
                item.ALTERNATE_UNIT_TYPE.trim(),
                item.CONVERSION_FACTOR.trim(),
                item.STOCK_UNIT_ID.trim(),
                item.CGST.trim(),
                item.SGST.trim(),
                item.IGST.trim(),
                item.InvalidIGST.trim()
            ].some(value => value === "")
        );
        var ErrorItemsArray = ItemsArray.filter(item =>
            [
                item.ITEM_CODE.trim(),
                item.ITEM_NAME.trim(),
                item.WAREHOUSE_ID.trim(),
                item.STATUS.trim(),
                item.HSN_ID.trim(),
                item.BATCH_APPLICABLE.trim(),
                item.CATEGORY_ID.trim(),
                item.STOCK_UNIT_ID.trim(),
                item.ALTERNATE_UNIT_TYPE.trim(),
                item.CONVERSION_FACTOR.trim(),
                item.CGST.trim(),
                item.SGST.trim(),
                item.IGST.trim(),
                item.InvalidIGST.trim(),
                item.OP_AMT.trim(),
                item.OP_QTY.trim(),
                item.PURCH_RATE.trim(),
                item.SALE_RATE.trim()
            ].some(value => value === "")
        );

        // Function to find empty fields in each object
        const specificColumns = ["ITEM_CODE", "ITEM_NAME", "WAREHOUSE_ID", "STATUS", "HSN_ID",
            "BATCH_APPLICABLE", "CATEGORY_ID", "ALTERNATE_UNIT_TYPE", "CONVERSION_FACTOR", "STOCK_UNIT_ID",
            "CGST", "SGST", "IGST", "InvalidIGST"]; // Replace with actual column names

        var emptyColumnsArray = ErrorItemsArray.map((item, index) => {
            let emptyColumns = specificColumns.filter(key => item[key] === "");
            return { rowNumber: index + 1, ID: item.ID, emptyColumns };
        }).filter(entry => entry.emptyColumns.length > 0);

        var splitArr = splitArrayIntoChunks(ValidateItemsArray);
        let uploadedCount = ""; // Initialize uploaded record count
        ShowLoadingDialog();
        for (let i = 0; i < splitArr.length; i++) {
            let model = { Items: splitArr[i] };

            let GenericModeldata = {
                ScreenID: "BulkUpload_101",
                Operation: "A",
                ModelData: JSON.stringify(model)
            };

            (function (batchIndex) {
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                    // Display uploaded record count                  
                    uploadedCount = response.data.Table1;
                });
            })(i); // Pass `i` as a parameter to preserve the correct value
        }
        ShowandCloseLoader();
        $('#fileLimitPopup').hide();
        findEmptyColumns(emptyColumnsArray, uploadedCount);
        $('#uploadExcelDocument').hide();
        GetItemMasterList();
    }

}
function findEmptyColumns(emptyColumnsArray, dulicateData) {
    if (emptyColumnsArray.length > 0 || dulicateData.length > 0) {
        var tableHTML = "";
        if (emptyColumnsArray.length > 0) {
            tableHTML = `<table style="overflow:scroll;">
                                <tr>
                                    <th>Sr No</th>
                                    <th>Empty Columns</th>
                                </tr>`;

            emptyColumnsArray.forEach(entry => {
                tableHTML += `<tr>
                                <td>${entry.rowNumber}</td>
                                <td>${entry.emptyColumns.join(", ")}</td>
                              </tr>`;
            });

            tableHTML += `</table>`;
        }
        var tableHTMLDuplicate = "";
        if (dulicateData.length > 0) {
            tableHTMLDuplicate = `<table style="overflow:scroll;">
                                <tr>
                                    <th>Item Code</th>
                                    <th>Item Name</th>
                                </tr>`;
            dulicateData.forEach(entry => {
                tableHTMLDuplicate += `<tr>
                                <td>${entry.DuplicateItemCodes}</td>
                                <td>${entry.DuplicateItemNames}</td>
                              </tr>`;
            });
            tableHTMLDuplicate += `</table>`;
        }

        document.getElementById("alertContent").innerHTML = tableHTML + tableHTMLDuplicate;
        document.getElementById("customAlert").style.display = "block";
        $("#customAlert").height(500);
        $("#customAlert").css("overflow", "scroll");
        document.getElementById("overlay").style.display = "block";
    }
}
function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
function UploadExcel() {
    const input = document.getElementById("fileUpload");

    if (input.files.length > 1) {
        FailToaster("Please select only one file.");
        input.value = ""; // Clear selection
        return;
    }
    const file = input.files[0];
    if (!file) {
        FailToaster("No file selected.");
        return;
    }

    const allowedExtensions = [".xls", ".xlsx"];
    const fileName = file.name.toLowerCase();
    const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
        FailToaster("Only Excel files(.xls, .xlsx) are allowed.");
        input.value = ""; // Reset file input
        return;
    }
    //var fileInput = $("#fileUpload")[0].files[0];
    //if (!fileInput) {
    //    alert("Please select an Excel file.");
    //    return;
    //}

    var formData = new FormData();
    formData.append("file", file);

    $.ajax({
        url: '/Material/UploadItemMasterExcelFile',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#customLoader").hide();
            //ItemsArray = response.data;
            // let response = "Base64_String_From_Response";
            let decodedJson = atob(response);  // Decode Base64

            ItemsArray = JSON.parse(decodedJson); // Convert back to JSON
            if (ItemsArray.length > 0) {
                $('#btnExcelUpload').show();
            }
            else {
                $('#btnExcelUpload').hide();
                //alert('Excel file is not in correct format.')
                FailToaster("Excel file is not in correct format.");
            }
        },
        error: function (xhr) {
            $("#customLoader").hide();
            console.error("Error during file upload:", xhr.responseText || xhr.statusText);
        }
    });
}

function ExportItemsData() {
    // Get the table element
    let ws_data = [];
    ws_data = exceldata.map(item => ({
        ITEM_CODE: item.ITEM_CODE,//1
        ITEM_NAME: item.ITEM_NAME,//2
        DESCRIPTION: item.DESCRIPTION,//3
        WarehouseName: item.WarehouseName,//4
        HSN_CODE: item.HSN_CODE,//5
        STATUS: item.STATUS,//6
        BATCH_APPLICABLE: item.BATCH_APPLICABLE,//7
        ITEM_CATEGORY: item.ITEM_CATEGORY,//8
        ITEM_SUB_CATEGORY: item.ITEM_SUB_CATEGORY,//9
        UNIT: item.UNIT,//10
        ALT_UNIT: item.ALT_UNIT,//11
        CONVERSION_FACTOR: item.CONVERSION_FACTOR,//12
        TOLERANCE: item.TOLERANCE,//13
        MIN_QTY: item.MIN_QTY,//14
        MAX_STOCK_LEVEL: item.MAX_STOCK_LEVEL,//15
        SAFETY_STOCK_LEVEL: item.SAFETY_STOCK_LEVEL,//16
        PREFFERED_SUPPLIER: item.PREFFERED_SUPPLIER,//17
        LEAD_TIME_TYPE: item.LEAD_TIME_TYPE,//18
        PACK_SIZE: item.PACK_SIZE,//19
        CGSTCharge: item.CGSTCharge,//20
        SGSTCharge: item.SGSTCharge,//21
        IGSTCharge: item.IGSTCharge,//22
        OP_AMT: item.OP_AMT,//23
        OP_QTY: item.OP_QTY,//24
        PURCH_RATE: item.PURCH_RATE,//25
        SALE_RATE: item.SALE_RATE//26
    }));
    downloadExcelFromJson(ws_data, 'ItemList.xlsx')
}
function downloadExcelFromJson(data, fileName) {
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a new workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Items');

    // Write the file and trigger download
    XLSX.writeFile(workbook, fileName);
}

//#region : Item Master Charge Event

function BindItemMasterCharge() {
    var model = {
        ID: "0",
        TableName: "ChargeType"
    };

    const jsonString = JSON.stringify(model);
    var ScreenID = "ItemMaster_102";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        console.log(response);
        var tableData = response.data.data.Table;
        var $chargeList = $('#edittablecc tbody');
        $chargeList.empty();

        if (tableData.length === 0) {
            $('#noResultsMessage').show();
        } else {
            $('#noResultsMessage').hide();

            // Retrieve existing charge data from sessionStorage (if available)
            var chargeData = sessionStorage.getItem("chargeData");
            chargeData = chargeData ? JSON.parse(chargeData) : [];

            tableData.forEach(function (row) {
                // Check if session data exists for the charge type
                var existingCharge = chargeData.find(c => c.ChargeTypeId === row.ID);

                // Set default tax dropdown and percentage
                var selectedChargeId = existingCharge ? existingCharge.ChargeId : "";
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

            // Now store the updated chargeData in sessionStorage
            sessionStorage.setItem("chargeData", JSON.stringify(chargeData));

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

let itemChargeData = []; // Global array to store charge data

//function SaveItemMasterChargeData() {
//    itemChargeData = []; // Clear previous data

//    $("#edittablecc tr").each(function () {
//        var chargeId = $(this).data("chargeid");
//        var selectedTax = $(this).find(".tax-dropdown").val();
//        var chargePercentage = $(this).find(".charge-percentage").val();

//        // Convert selectedTax to integer and chargePercentage to float
//        selectedTax = selectedTax !== "Select" ? parseInt(selectedTax, 10) : 0;
//        chargePercentage = parseFloat(chargePercentage) || 0.00;

//        // Only push values where selectedTax > 0
//        if (selectedTax > 0) {
//            itemChargeData.push({
//                ChargeTypeId: chargeId,
//                ChargeId: selectedTax,
//                TaxPer: chargePercentage
//            });
//        }
//    });

//    console.log("Collected Charge Data:", itemChargeData);
//    $('#taxmapping').modal('hide');
//}

function ItemTaxMappingSub() {

    if ($('#ddlSubCategory').val() > 0) {

        if (edit_id_sub > 0) {
            edit_id_sub = 0;
            return;
        }


        var model = {
            ID: $('#ddlSubCategory').val(),
            TableName: "SubCate"
        };

        const jsonString = JSON.stringify(model);
        var ScreenID = "ItemMaster_102";




        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
            console.log(response);

            var tableData = response.data.data.Table;

            if (tableData.length > 0 && tableData[0]?.HSN_ID > 0) {
                $('#ddlHSN').val(tableData[0].HSN_ID).trigger('change');
            }


            let selectedTaxNames = [];

            if (tableData.length > 0) {
                tableData.forEach(row => {
                    /*if (row.ChargeId > 0 && row.TaxPer > 0) {*/
                    if (row.CHRG_ID > 0) {
                        itemChargeData.push({
                            ChargeTypeId: row.CHRG_TYPE_ID,
                            Charge: row.Charge,
                            ChargeId: row.CHRG_ID,
                            TaxPer: row.CHRG_PER
                        });

                        selectedTaxNames.push(row.TaxName);

                    }
                });

                //console.log("temp data :", tempChargeData);
                //console.log("Selected tax : ", selectedTaxNames);
                //console.log("Selected per:", itemChargeData);

                // Step 5: Final UI updates
                $('#itemCharges').text(selectedTaxNames.join(", "));
                $("#error-message").hide();
                $('#taxmapping').modal('hide');
                sessionStorage.setItem("chargeData", JSON.stringify(itemChargeData));
            }


        });
    }

}

function ItemTaxMappingHSN() {

    if ($('#ddlHSN').val() > 0) {



        var model = {
            Id: $('#ddlHSN').val(),
            Type: 29
        };

        const jsonString = JSON.stringify(model);
        var ScreenID = "ERP_Samp5_101";




        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
            console.log(response);

            var tableData = response.data.data.Table;
            itemChargeData = [];
            if (!tableData || tableData.length <= 0) {

                if (edit_itemtax != '') {
                    $('#itemCharges').text(edit_itemtax);
                }
                else {
                    $('#itemCharges').text('');
                }
                return;
            }

            //  $('#ddlHSN').val(tableData.length > 0 && tableData[0]?.HSN_ID).trigger('change');


            let selectedTaxNames = [];

            if (tableData.length > 0) {
                tableData.forEach(row => {
                    /*if (row.ChargeId > 0 && row.TaxPer > 0) {*/
                    if (row.CHRG_ID > 0) {
                        itemChargeData.push({
                            ChargeTypeId: row.CHRG_TYPE_ID,
                            Charge: row.Charge,
                            ChargeId: row.CHRG_ID,
                            TaxPer: row.CHRG_PER
                        });

                        selectedTaxNames.push(row.TaxName);

                    }
                });

                //console.log("temp data :", tempChargeData);
                //console.log("Selected tax : ", selectedTaxNames);
                //console.log("Selected per:", itemChargeData);

                // Step 5: Final UI updates
                $('#itemCharges').text(selectedTaxNames.join(", "));
                sessionStorage.removeItem("chargeData");
                sessionStorage.setItem("chargeData", JSON.stringify(itemChargeData));
            }


        });
    }

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
    $("#edittablecc tr").each(function () {
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

    // Step 2: Validate tax logic
    //if (igstPercentage <= 0 && cgstPercentage <= 0 && sgstPercentage <= 0) {
    //    taxError = true;
    //    errorMessage = "Please select at least one charge type.";
    //else if (igstPercentage > 0 && (cgstPercentage <= 0 || sgstPercentage <= 0)) {
    //    taxError = true;
    //    errorMessage = "Please fill CGST and SGST when IGST is selected.";
    //} else if (igstPercentage <= 0 && (cgstPercentage > 0 || sgstPercentage > 0)) {
    //    taxError = true;
    //    errorMessage = "If CGST or SGST is filled, IGST should be selected.";
    //} else if (cgstPercentage + sgstPercentage !== igstPercentage) {
    //    taxError = true;
    //    errorMessage = "IGST must equal CGST + SGST.";
    //}

    //if (igstPercentage <= 0 && cgstPercentage <= 0 && sgstPercentage <= 0) {     Updated on 23/07/2025
    //    taxError = true;
    //    errorMessage = "Please select at least one charge type.";
    if (igstChargeId > 0 && (cgstChargeId === 'Select' || sgstChargeId === 'Select')) {
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
        if (row.ChargeId > 0 ) {
            itemChargeData.push({
                ChargeTypeId: row.ChargeTypeId,
                Charge: row.Charge,
                ChargeId: row.ChargeId,
                TaxPer: row.TaxPer
            });

            selectedTaxNames.push(row.TaxName);

        }
    });

    //console.log("temp data :", tempChargeData);
    //console.log("Selected tax : ", selectedTaxNames);
    //console.log("Selected per:", itemChargeData);

    // Step 5: Final UI updates
    $('#itemCharges').text(selectedTaxNames.join(", "));
    $("#error-message").hide();
    $('#taxmapping').modal('hide');
    sessionStorage.setItem("chargeData", JSON.stringify(itemChargeData));
}

function CloseItemTaxmappig() {
    $("#error-message").hide();
}
//#endregion

// Function to toggle button visibility based on Item Status as Active=Shown button Else Hide
function toggleButtonVisibility() {
    var itemMasterId = parseInt($("#hdnItemMasterId").val());
    if (itemMasterId > 0) {
        const saveButton = document.getElementById('btnSave');
        const isActive = document.getElementById('active').checked;

        if (isActive) {
            saveButton.style.display = 'block';
        }
        //else {
        //    saveButton.style.display = 'none';
        //}
    }
}

// Add event listener for both radio buttons
const radios = document.querySelectorAll('input[name="status"]');
radios.forEach(radio => {
    radio.addEventListener('change', toggleButtonVisibility);
});

function DownloadInPDF() {
    var element = document.getElementById('divItemMaster');
    const opt = {
        margin: 0.5,
        filename: 'Purchase_Order.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 3,               // 🔥 Increases resolution
            useCORS: true,          // In case there are external images
            scrollY: 0
        },
        jsPDF: { unit: 'in', format: 'a3', orientation: 'landscape' } // 🔥 Use A3 or Landscape for wide tables
    };
    html2pdf().set(opt).from(element).save();
    return false;
}

//document.querySelectorAll('input[name="qcapplicable"]').forEach(function (radio) {
//    radio.addEventListener('click', function () {
//        // ✅ Add your logic here
//        // Example:
//        if (this.value === "Yes") {
//            // Do something when 'Yes' is clicked
//            document.getElementById('divUserType').style.display = 'none';
//            document.getElementById('divQCTestMapping').style.display = 'block';
//        } else {
//            // Do something else when 'No' is clicked
//            document.getElementById('divUserType').style.display = 'none';
//            document.getElementById('divQCTestMapping').style.display = 'none';
//        }
//    });
//});

function setQCApplicable() {
    var qcType = $('input[name="qcapplicable"]:checked').val();

    if (qcType === "Yes") {
        // Do something when 'Yes' is clicked
        document.getElementById('divUserType').style.display = 'none';
        document.getElementById('divQCTestMapping').style.display = 'block';

        document.getElementById("qcno").disabled = true;
    } else {
        // Do something else when 'No' is clicked
        document.getElementById('divUserType').style.display = 'none';
        document.getElementById('divQCTestMapping').style.display = 'none';

        document.getElementById("qcyes").disabled = true;
    }
}
var preCategory = '';

function ShowQCMapping() {
    var isNewRow = true;
    if ($('#ddlCategory').val() != "Select") {
        var model = {
            ID: itemId,
            ParentId: 0,
            CategoryId: $('#ddlCategory').val()
        }
        const jsonString = JSON.stringify(model);
        var ScreenID = "QC_Test_Name";
        if (preCategory != '' && preCategory == $('#ddlCategory').val()) {
            isNewRow = false;
        }
        preCategory = $('#ddlCategory').val();


        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
            testNameArray = [];
            testNameArray = response.data.data.Table;
            //$("#tblQCTestMapping tbody").empty();
            //$("#tblMicrobiologyTests tbody").empty();
            if (response.data.data.Table1.length > 0)
            {
                var editQCTestData = response.data.data.Table1;
                BindTableQCTest(editQCTestData);
            }
            else {
                // Empty the table body first
                BindHTMLTableQualityParameters(0, isNewRow);
                BindHTMLTableMicrobiologyTests(0, isNewRow)
                //document.getElementById('isMandatory').checked = false;
                //document.getElementById('divMicrobiologyTests').style.display = 'none';
            }
        });

        $("#qctestmapping").modal('show');
    }
    else {
        FailToaster('Please select catagory.');
    }
}

function BindTableQCTest(documents) {
    const isMicrobiologicalArray = documents.filter(item => item.IsMicrobiological === true);
    const withoutMicrobiologicalArray = documents.filter(item => item.IsMicrobiological === false);
    // Empty the table body first
    $("#tblQCTestMapping tbody").empty();
    $("#tblMicrobiologyTests tbody").empty();
    var docID = "0";
    // Iterate over your data
    $.each(withoutMicrobiologicalArray, function (index, doc) {
        // Create a row element
        //if (doc.IsMicrobiological == false) {
        document.getElementById('isMandatory').checked = false;
        document.getElementById('divMicrobiologyTests').style.display = 'none';
        var row = $("<tr></tr>");
        // Create table cells
        // Column 1: Serial number and a hidden input for document id
        var colNameAddRow = "";
        if (index + 1 == 1) {
            colNameAddRow = $('<td class="text-center">' +
                //'<div class="cursor-pointer"><img  onclick="BindHTMLTableQualityParameters();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
                //'</td>');
                '<div class="cursor-pointer"><img  onclick="AddRowQualityParameters();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
                '</td>');
        }
        else {
            colNameAddRow = $('<td class="text-center">' +
                '<div class="cursor-pointer"><img style="width: 15px;" class="btnDelete" onclick="DeleteRowQualityParameters();" src="../../assets/images/icons/help/close.svg" class="w-15" alt=""></div>' +
                '</td>');
        }

        // Column 2: Period Ind. (dropdown)
        var colTestName = $('<td>' +
            '<select onchange="HideErrorMessage(this);ChangeTestNameList(' + (index + 1) + ');" id="ddlTestNameList' + (index + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
            '<span id="spddlTestNameList' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');

        // Column 3: Period Ind. (dropdown)
        var colNameResultType = $('<td "><span id="spResultType' + (index + 1) + '"></span>' +
            '</td>');
        // Column 4: Period Ind. (dropdown)
        var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnit' + (index + 1) + '"></span>' +
            '</td>');
        var colApprovedRange = $('<td>' +
            '<div id="divRange' + (index + 1) + '" class="moldcount hide">' +
            '<div class="d-flex  gap-10">' +
            '<div class="w-100">' +
            '<input type="text" id="txtApprovedMin' + (index + 1) + '" placeholder="MIN" class="form-control" />' +
            '</div>' +
            '<div class="w-100">' +
            '<input type="text" id="txtApprovedMax' + (index + 1) + '" placeholder="MAX" class="form-control" />' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<input type="text" id="txtText' + (index + 1) + '" placeholder="Enter" class="form-control color hide" />' +
            '<input type="text" id="txtNumber' + (index + 1) + '" placeholder="0" class="form-control density hide" />' +
            '<input type="hidden" id="hddCategory' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsSample' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsProduction' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsInvard' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsOutWard' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsMicrobiological' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddQCID' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddTestNameId' + (index + 1) + '"  />' +
            '</td>');

        row.append(colNameAddRow)
            .append(colTestName)
            .append(colNameResultType)
            .append(colNameMeasuringUnit)
            .append(colApprovedRange);

        // Finally, append the row to the table body 
        $("#tblQCTestMapping tbody").append(row);
        var $ele0 = $('#ddlTestNameList' + (index + 1) + '');
        $ele0.empty();
        $ele0.append($('<option/>').val('').text('Select'));
        $.each(testNameArray, function (ii, vall) {
            if (vall.isMicrobiological != true) {
                var $option = $('<option />')
                    .val(vall.ID)
                    .text(vall.ValueName)
                    .attr('data-code', vall.ValueCode);
                //if (vall.ID == "1") {
                //    $option.attr("selected", "selected");
                //}
                $ele0.append($option);
            }
        });

        $('#ddlTestNameList' + (index + 1)).val(doc.Parameter_NameID);//.trigger('change');
        if (doc.Parameter_Type == 1) {
            document.getElementById('spResultType' + (index + 1)).innerText = 'Numeric';
            $('#txtNumber' + (index + 1) + '').val(doc.Numeric_Value);

            $('#txtNumber' + (index + 1) + '').show();
            $('#txtText' + (index + 1) + '').hide();
            $('#divRange' + (index + 1) + '').hide();
            //document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.Numeric_Value;
        }
        if (doc.Parameter_Type == 2) {
            document.getElementById('spResultType' + (index + 1)).innerText = 'Text';
            $('#txtNumber' + (index + 1) + '').hide();
            $('#txtText' + (index + 1) + '').show();
            $('#divRange' + (index + 1) + '').hide();

            $('#txtText' + (index + 1) + '').val(doc.Text_Value);
            //document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.Text_Value;
        }
        if (doc.Parameter_Type == 3) {
            document.getElementById('spResultType' + (index + 1)).innerText = 'Range';
            $('#txtNumber' + (index + 1) + '').hide();
            $('#txtText' + (index + 1) + '').hide();
            $('#divRange' + (index + 1) + '').show();

            $('#txtApprovedMin' + (index + 1) + '').val(doc.Range_Min);
            $('#txtApprovedMax' + (index + 1) + '').val(doc.Range_Max);
            //document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.Range_Min + '-' + doc.Range_Max;
        }
        document.getElementById('spMeasuringUnit' + (index + 1) + '').innerText = doc.MeasuringUnit;
        //$('#txtNumber' + (index + 1)).val(doc.Numeric_Value);
        $('#hddCategory' + (index + 1)).val(doc.Category);
        $('#hddIsSample' + (index + 1)).val(doc.IsSample);
        $('#hddIsProduction' + (index + 1)).val(doc.IsProduction);
        $('#hddIsInvard' + (index + 1)).val(doc.IsInvard);
        $('#hddIsOutWard' + (index + 1)).val(doc.IsOutWard);
        $('#hddIsMicrobiological' + (index + 1)).val(doc.IsMicrobiological);
        $('#hddQCID' + (index + 1)).val(doc.QCID);
        //}
    });

    $.each(isMicrobiologicalArray, function (index, doc) {
        //if (doc.IsMicrobiological == true) {
        document.getElementById('isMandatory').checked = true;
        document.getElementById('divMicrobiologyTests').style.display = 'block';
        // Create a row element
        var row = $("<tr></tr>");

        // Create table cells
        // Column 1: Serial number and a hidden input for document id
        var colNameAddRow = "";
        if (index + 1 == 1) {
            colNameAddRow = $('<td class="text-center">' +
                //'<div class="cursor-pointer"><img onclick="BindHTMLTableMicrobiologyTests();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
                //'</td>');

                '<div class="cursor-pointer"><img  onclick="AddRowMicrobiologyTests();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
                '</td>');
        }
        else {
            colNameAddRow = $('<td class="text-center">' +
                '<div class="cursor-pointer"><img style="width: 15px;" class="btnDelete" onclick="DeleteRowMicrobiologyTests();" src="../../assets/images/icons/help/close.svg" class="w-15" alt=""></div>' +
                '</td>');
        }
        // Column 2: Period Ind. (dropdown)
        colTestName = $('<td>' +
            '<select onchange="HideErrorMessage(this);ChangeTestNameListMT(' + (index + 1) + ');" id="ddlTestNameListMT' + (index + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
            '<span id="spddlTestNameListMT' + (index + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
            '</td>');


        // Column 3: Period Ind. (dropdown)
        var colNameResultType = $('<td "><span id="spResultTypeMT' + (index + 1) + '"></span>' +
            '</td>');
        // Column 4: Period Ind. (dropdown)
        var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnitMT' + (index + 1) + '"></span>' +
            '</td>');
        var colApprovedRange = $('<td>' +
            '<div id="divRangeMT' + (index + 1) + '" class="moldcount hide">' +
            '<div class="d-flex  gap-10">' +
            '<div class="w-100">' +
            '<input type="text" id="txtApprovedMinMT' + (index + 1) + '" placeholder="MIN" class="form-control" />' +
            '</div>' +
            '<div class="w-100">' +
            '<input type="text" id="txtApprovedMaxMT' + (index + 1) + '" placeholder="MAX" class="form-control" />' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<input type="text" id="txtTextMT' + (index + 1) + '" placeholder="Enter" class="form-control color hide" />' +
            '<input type="text" id="txtNumberMT' + (index + 1) + '" placeholder="0" class="form-control density hide" />' +
            '<input type="hidden" id="hddCategoryMT' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsSampleMT' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsProductionMT' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsInvardMT' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsOutWardMT' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddIsMicrobiologicalMT' + (index + 1) + '"  />' +
            '<input type="hidden" id="hddQCIDMT' + (index + 1) + '"  />' +
            '</td>');

        row.append(colNameAddRow)
            .append(colTestName)
            .append(colNameResultType)
            .append(colNameMeasuringUnit)
            .append(colApprovedRange);

        // Finally, append the row to the table body 
        $("#tblMicrobiologyTests tbody").append(row);
        var $ele0 = $('#ddlTestNameListMT' + (index + 1) + '');
        $ele0.empty();
        $ele0.append($('<option/>').val('').text('Select'));
        $.each(testNameArray, function (ii, vall) {
            if (vall.isMicrobiological == true) {
                var $option = $('<option />')
                    .val(vall.ID)
                    .text(vall.ValueName)
                    .attr('data-code', vall.ValueCode);
                //if (vall.ID == "1") {
                //    $option.attr("selected", "selected");
                //}
                $ele0.append($option);
            }
        });

        $('#ddlTestNameListMT' + (index + 1)).val(doc.Parameter_NameID);//.trigger('change');
        if (doc.Parameter_Type == 1) {
            document.getElementById('spResultTypeMT' + (index + 1)).innerText = 'Numeric';
            $('#txtNumberMT' + (index + 1) + '').val(doc.Numeric_Value);

            $('#txtNumberMT' + (index + 1) + '').show();
            $('#txtTextMT' + (index + 1) + '').hide();
            $('#divRangeMT' + (index + 1) + '').hide();
            //document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.Numeric_Value;
        }
        if (doc.Parameter_Type == 2) {
            document.getElementById('spResultTypeMT' + (index + 1)).innerText = 'Text';
            $('#txtNumberMT' + (index + 1) + '').hide();
            $('#txtTextMT' + (index + 1) + '').show();
            $('#divRangeMT' + (index + 1) + '').hide();

            $('#txtTextMT' + (index + 1) + '').val(doc.Text_Value);
            //document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.Text_Value;
        }
        if (doc.Parameter_Type == 3) {
            document.getElementById('spResultTypeMT' + (index + 1)).innerText = 'Range';
            $('#txtNumberMT' + (index + 1) + '').hide();
            $('#txtTextMT' + (index + 1) + '').hide();
            $('#divRangeMT' + (index + 1) + '').show();

            $('#txtApprovedMinMT' + (index + 1) + '').val(doc.Range_Min);
            $('#txtApprovedMaxMT' + (index + 1) + '').val(doc.Range_Max);
            //document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.Range_Min + '-' + doc.Range_Max;
        }
        document.getElementById('spMeasuringUnitMT' + (index + 1) + '').innerText = doc.MeasuringUnit;
        //$('#txtNumber' + (index + 1)).val(doc.Numeric_Value);
        $('#hddCategoryMT' + (index + 1)).val(doc.Category);
        $('#hddIsSampleMT' + (index + 1)).val(doc.IsSample);
        $('#hddIsProductionMT' + (index + 1)).val(doc.IsProduction);
        $('#hddIsInvardMT' + (index + 1)).val(doc.IsInvard);
        $('#hddIsOutWardMT' + (index + 1)).val(doc.IsOutWard);
        $('#hddIsMicrobiologicalMT' + (index + 1)).val(doc.IsMicrobiological);
        $('#hddQCIDMT' + (index + 1)).val(doc.QCID);
        // }
    });
    if (isMicrobiologicalArray.length == 0) {
        var isNewRow = true;       
        BindHTMLTableMicrobiologyTests(0, isNewRow);
    }
}
var testNameArray = [];
var QCTestMappingData = [];
function BindHTMLTableQualityParameters(docID, isNewRow) {
    var rowCount = $("#tblQCTestMapping tbody tr").length;
    if (isNewRow == false) {
        return false;
    }
    else {
        $("#tblQCTestMapping tbody").html('');
    }
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img onclick="AddRowQualityParameters();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameList(' + (rowCount + 1) + ');" id="ddlTestNameList' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameList' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultType' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnit' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRange' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMin' + (rowCount + 1) + '" placeholder="MIN" class="form-control" onchange="HideErrorMessage(this)" />' +
        '<span id="sptxtApprovedMin' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMax' + (rowCount + 1) + '" placeholder="MAX" class="form-control" onchange="HideErrorMessage(this)" />' +
        '<span id="sptxtApprovedMax' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtText' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtText' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="text" id="txtNumber' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtNumber' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="hidden" id="hddCategory' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSample' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProduction' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiological' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCID' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddTestNameId' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblQCTestMapping tbody").append(row);
    var $ele0 = $('#ddlTestNameList' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological != true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });

}
function AddRowQualityParameters(docID) {
    var rowCount = $("#tblQCTestMapping tbody tr").length;
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img style="width: 15px;" class="btnDelete" onclick="DeleteRowQualityParameters(' + (rowCount + 1) + ');" src="../../assets/images/icons/help/close.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameList(' + (rowCount + 1) + ');" id="ddlTestNameList' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameList' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultType' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnit' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRange' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMin' + (rowCount + 1) + '" placeholder="MIN" class="form-control" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtApprovedMin' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMax' + (rowCount + 1) + '" placeholder="MAX" class="form-control" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtApprovedMax' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtText' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtText' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="text" id="txtNumber' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtNumber' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="hidden" id="hddCategory' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSample' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProduction' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWard' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiological' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCID' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddTestNameId' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblQCTestMapping tbody").append(row);
    var $ele0 = $('#ddlTestNameList' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological != true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });

}
function DeleteRowQualityParameters(rowId) {
    $('#tblQCTestMapping').on('click', '.btnDelete', function () {
        $(this).closest('tr').remove();
    });
}
function DeleteRowMicrobiologyTests() {
    $('#tblMicrobiologyTests').on('click', '.btnDelete', function () {
        $(this).closest('tr').remove();
    });
}
function ChangeTestNameList(rowId) {
    var testNameId = 0;
    var selectedTestNameName = 0;
    var selectedCode = $('#ddlTestNameList' + (rowId)).find(':selected').data('code');
    testNameId = $('#ddlTestNameList' + (rowId)).val();
    selectedTestNameName = $('#ddlTestNameList' + (rowId)).find("option:selected").text();
    var isDuplicate = isDuplicateTestName(testNameId, rowId);
    if (isDuplicate == true) {
        FailToaster('Duplicate test Name is not allow! -: ' + selectedTestNameName);
        $('#ddlTestNameList' + (rowId)).val('');
        return false;
    }
    // Get row with ID = 8
    var result = testNameArray.find(x => x.ID === parseInt(testNameId));
    $('#hddCategory' + (rowId)).val(result.Category);
    $('#hddIsSample' + (rowId)).val(result.isSample);
    $('#hddIsProduction' + (rowId)).val(result.isProduction);
    $('#hddIsInvard' + (rowId)).val(result.isInvard);
    $('#hddIsOutWard' + (rowId)).val(result.isOutWard);
    $('#hddIsMicrobiological' + (rowId)).val(result.isMicrobiological);
    $('#hddQCID' + (rowId)).val(0);
    $('#hddTestNameId' + (rowId)).val(result.ID);

    if (selectedCode == 1) {
        $('#txtNumber' + rowId + '').val(result.Numeric_Value);

        $('#txtNumber' + rowId + '').show();
        $('#txtText' + rowId + '').hide();
        $('#divRange' + rowId + '').hide();
        document.getElementById('spResultType' + rowId + '').innerText = 'Numeric';
        //document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Numeric_Value;

        $('#txtNumber' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory ');
        $('#txtText' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMin' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMax' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');

    }
    if (selectedCode == 2) {
        $('#txtNumber' + rowId + '').hide();
        $('#txtText' + rowId + '').show();
        $('#divRange' + rowId + '').hide();

        $('#txtText' + rowId + '').val(result.Text_Value);
        document.getElementById('spResultType' + rowId + '').innerText = 'Text';
       // document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Text_Value;

        $('#txtNumber' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtText' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory');
        $('#txtApprovedMin' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMax' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
    }
    if (selectedCode == 3) {
        $('#txtNumber' + rowId + '').hide();
        $('#txtText' + rowId + '').hide();
        $('#divRange' + rowId + '').show();

        $('#txtApprovedMin' + rowId + '').val(result.Range_Min);
        $('#txtApprovedMax' + rowId + '').val(result.Range_Max);
        document.getElementById('spResultType' + rowId + '').innerText = 'Range';
       // document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.Range_Min + '-' + result.Range_Max;

        $('#txtNumber' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtText' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMin' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory');
        $('#txtApprovedMax' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory');
    }
    document.getElementById('spMeasuringUnit' + rowId + '').innerText = result.MeasuringUnit;
}

$('#isMandatory').on('change', function () {
    if ($(this).is(':checked')) {
        document.getElementById('divMicrobiologyTests').style.display = 'block';
        if ($("#tblMicrobiologyTests tbody").html() == '') {
            BindHTMLTableMicrobiologyTests(1);
        }
        //BindHTMLTableMicrobiologyTests(0);
    } else {
        document.getElementById('divMicrobiologyTests').style.display = 'none';
    }
});

function BindHTMLTableMicrobiologyTests(docID, isNewRow) {
    var rowCount = $("#tblMicrobiologyTests tbody tr").length;
    if (isNewRow == false) {
        return false;
    }
    else {
        $("#tblMicrobiologyTests tbody").html('');
    }
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img onclick="AddRowMicrobiologyTests();" src="../../assets/images/icons/help/add.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameListMT(' + (rowCount + 1) + ');" id="ddlTestNameListMT' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameListMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultTypeMT' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnitMT' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRangeMT' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMinMT' + (rowCount + 1) + '"  placeholder="MIN" class="form-control" onchange="HideErrorMessage(this)"/>' +
        '<span id="sptxtApprovedMinMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span > ' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMaxMT' + (rowCount + 1) + '" placeholder="MAX" class="form-control" onchange="HideErrorMessage(this)" />' +
        '<span id="sptxtApprovedMaxMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span > ' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtTextMT' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtTextMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="text" id="txtNumberMT' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtNumberMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="hidden" id="hddCategoryMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSampleMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProductionMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiologicalMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCIDMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddTestNameIdMT' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblMicrobiologyTests tbody").append(row);
    var $ele0 = $('#ddlTestNameListMT' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological == true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });
}
function AddRowMicrobiologyTests(docID) {
    var rowCount = $("#tblMicrobiologyTests tbody tr").length;
    // Create a row element
    var row = $("<tr></tr>");

    // Create table cells    

    // Column 1: Name input
    var colNameAddRow = $('<td class="text-center">' +
        '<div class="cursor-pointer"><img style="width: 15px;" class="btnDelete" onclick="DeleteRowMicrobiologyTests(' + (rowCount + 1) + ');" src="../../assets/images/icons/help/close.svg" class="w-15" alt=""></div>' +
        '</td>');

    // Column 2: Period Ind. (dropdown)
    var colTestName = $('<td>' +
        '<select onchange="HideErrorMessage(this);ChangeTestNameListMT(' + (rowCount + 1) + ');" id="ddlTestNameListMT' + (rowCount + 1) + '" class="form-control applyselect MandatoryEditDoc"></select>' +
        '<span id="spddlTestNameListMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
        '</td>');
    // Column 3: Period Ind. (dropdown)
    var colNameResultType = $('<td "><span id="spResultTypeMT' + (rowCount + 1) + '"></span>' +
        '</td>');
    // Column 4: Period Ind. (dropdown)
    var colNameMeasuringUnit = $('<td ><span id="spMeasuringUnitMT' + (rowCount + 1) + '"></span>' +
        '</td>');
    var colApprovedRange = $('<td>' +
        '<div id="divRangeMT' + (rowCount + 1) + '" class="moldcount hide">' +
        '<div class="d-flex  gap-10">' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMinMT' + (rowCount + 1) + '" placeholder="MIN" class="form-control" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtApprovedMinMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '</div>' +
        '<div class="w-100">' +
        '<input type="text" id="txtApprovedMaxMT' + (rowCount + 1) + '" placeholder="MAX" class="form-control" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtApprovedMaxMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<input type="text" id="txtTextMT' + (rowCount + 1) + '" placeholder="Enter" class="form-control color hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtTextMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="text" id="txtNumberMT' + (rowCount + 1) + '" placeholder="0" class="form-control density hide" onchange="HideErrorMessage(this);"/>' +
        '<span id="sptxtNumberMT' + (rowCount + 1) + '" class="text-danger field-validation-error" style="display:none;">Oops! You have missed this field.</span>' +
        '<input type="hidden" id="hddCategoryMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsSampleMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsProductionMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsInvardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsOutWardMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddIsMicrobiologicalMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddQCIDMT' + (rowCount + 1) + '"  />' +
        '<input type="hidden" id="hddTestNameIdMT' + (rowCount + 1) + '"  />' +
        '</td>');
    // Append each cell to the row
    row.append(colNameAddRow)
        .append(colTestName)
        .append(colNameResultType)
        .append(colNameMeasuringUnit)
        .append(colApprovedRange);


    $("#tblMicrobiologyTests tbody").append(row);
    var $ele0 = $('#ddlTestNameListMT' + (rowCount + 1) + '');
    $ele0.empty();
    $ele0.append($('<option/>').val('').text('Select'));
    $.each(testNameArray, function (ii, vall) {
        if (vall.isMicrobiological == true) {
            var $option = $('<option />')
                .val(vall.ID)
                .text(vall.ValueName)
                .attr('data-code', vall.ValueCode);
            //if (vall.ID == "1") {
            //    $option.attr("selected", "selected");
            //}
            $ele0.append($option);
        }
    });
}
function ChangeTestNameListMT(rowId) {
    var testNameId = 0;
    var selectedCode = $('#ddlTestNameListMT' + (rowId)).find(':selected').data('code');
    testNameId = $('#ddlTestNameListMT' + (rowId)).val();
    var selectedTestNameName = $('#ddlTestNameListMT' + (rowId)).find("option:selected").text();
    var isDuplicate = isDuplicateTestNameMicrobiological(testNameId, rowId);
    if (isDuplicate == true) {
        FailToaster('Duplicate test name is not allow! -: ' + selectedTestNameName);
        $('#ddlTestNameListMT' + (rowId)).val('');
        return false;
    }
    // Get row with ID = 8
    var result = testNameArray.find(x => x.ID === parseInt(testNameId));
    $('#hddCategoryMT' + (rowId)).val(result.Category);
    $('#hddIsSampleMT' + (rowId)).val(result.isSample);
    $('#hddIsProductionMT' + (rowId)).val(result.isProduction);
    $('#hddIsInvardMT' + (rowId)).val(result.isInvard);
    $('#hddIsOutWardMT' + (rowId)).val(result.isOutWard);
    $('#hddIsMicrobiologicalMT' + (rowId)).val(result.isMicrobiological);
    $('#hddQCIDMT' + (rowId)).val(0);
    $('#hddTestNameIdMT' + (rowId)).val(result.ID);

    if (selectedCode == 1) {
        $('#txtNumberMT' + rowId + '').val(result.Numeric_Value);

        $('#txtNumberMT' + rowId + '').show();
        $('#txtTextMT' + rowId + '').hide();
        $('#divRangeMT' + rowId + '').hide();
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Numeric';
        //document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Numeric_Value;
        $('#txtNumberMT' + rowId + '').addClass('form-control QCTestMandatory');

        $('#txtNumberMT' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory ');
        $('#txtTextMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMinMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMaxMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
    }
    if (selectedCode == 2) {
        $('#txtNumberMT' + rowId + '').hide();
        $('#txtTextMT' + rowId + '').show();
        $('#divRangeMT' + rowId + '').hide();

        $('#txtTextMT' + rowId + '').val(result.Text_Value);
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Text';
       // document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Text_Value;

        $('#txtNumberMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtTextMT' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory');
        $('#txtApprovedMinMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMaxMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
    }
    if (selectedCode == 3) {
        $('#txtNumberMT' + rowId + '').hide();
        $('#txtTextMT' + rowId + '').hide();
        $('#divRangeMT' + rowId + '').show();

        $('#txtApprovedMinMT' + rowId + '').val(result.Range_Min);
        $('#txtApprovedMaxMT' + rowId + '').val(result.Range_Max);
        document.getElementById('spResultTypeMT' + rowId + '').innerText = 'Range';
        //document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.Range_Min + '-' + result.Range_Max;

        $('#txtNumberMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtTextMT' + rowId + '').removeClass('form-control QCTestMandatory').addClass('form-control ');
        $('#txtApprovedMinMT' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory');
        $('#txtApprovedMaxMT' + rowId + '').removeClass('form-control ').addClass('form-control QCTestMandatory');
    }
    document.getElementById('spMeasuringUnitMT' + rowId + '').innerText = result.MeasuringUnit;
}
function collectTableData() {
    // Create an empty array to store row data
    QCTestMappingData = [];
    // Select all rows in the table body (excluding any header row)
    // Assuming your <tbody> has the id="table-body"

    $('#tblQCTestMapping tbody tr').each(function (index) {
        // Collect the values from the cells/inputs within this row
        var ParameterNameID = $(this).find('#ddlTestNameList' + (index + 1) + '').val();  // Period Ind. (dropdown)
        var ParameterType = document.getElementById('spResultType' + (index + 1) + '').innerText;
        var typeMap = {
            "Numeric": 1,
            "Text": 2,
            "Range": 3
        };
        var ParameterTypeId = typeMap[ParameterType] || 0;
        //var Numeric_Value = $(this).find('#spMeasuringUnit' + (index + 1) + '').val();       // Series Name
        var TextValue = $(this).find('#txtText' + (index + 1) + '').val();    // First No.
        var NumericValue = $(this).find('#txtNumber' + (index + 1) + '').val();     // Prefix
        var RangeMin = $(this).find('#txtApprovedMin' + (index + 1) + '').val();     // Branch (dropdown)
        var RangeMax = $(this).find('#txtApprovedMax' + (index + 1) + '').val();     // Branch (dropdown)
        var Category = $(this).find('#hddCategory' + (index + 1) + '').val();     // Branch (dropdown)
        var IsSample = $(this).find('#hddIsSample' + (index + 1) + '').val();     // Branch (dropdown)
        var IsProduction = $(this).find('#hddIsProduction' + (index + 1) + '').val();     // Branch (dropdown)
        var IsInvard = $(this).find('#hddIsInvard' + (index + 1) + '').val();     // Branch (dropdown)
        var IsOutWard = $(this).find('#hddIsOutWard' + (index + 1) + '').val();     // Branch (dropdown)
        var IsMicrobiological = $(this).find('#hddIsMicrobiological' + (index + 1) + '').val();     // Branch (dropdown)
        var QCID = $(this).find('#hddQCID' + (index + 1) + '').val();     // Branch (dropdown)

        // Build an object representing a single row
        var rowData = {
            Parameter_NameID: ParameterNameID,
            Parameter_Type: ParameterTypeId,
            Numeric_Value: NumericValue == "" ? 0 : NumericValue,
            Text_Value: TextValue,
            Range_Min: RangeMin == "" ? 0 : RangeMin,
            Range_Max: RangeMax == "" ? 0 : RangeMax,
            Category: Category,
            IsSample: IsSample,
            IsProduction: IsProduction,
            IsInvard: IsInvard,
            IsOutWard: IsOutWard,
            IsMicrobiological: IsMicrobiological,
            QCID: QCID
        };

        // Push it into the array
        if (ParameterNameID != '') {
            QCTestMappingData.push(rowData);
        }
    });

    if (document.getElementById('isMandatory').checked == true) {
        $('#tblMicrobiologyTests tbody tr').each(function (index) {
            // Collect the values from the cells/inputs within this row
            var ParameterNameID = $(this).find('#ddlTestNameListMT' + (index + 1) + '').val();  // Period Ind. (dropdown)
            var ParameterType = document.getElementById('spResultTypeMT' + (index + 1) + '').innerText;
            var typeMap = {
                "Numeric": 1,
                "Text": 2,
                "Range": 3
            };
            var ParameterTypeId = typeMap[ParameterType] || 0;
            //var Numeric_Value = $(this).find('#spMeasuringUnit' + (index + 1) + '').val();       // Series Name
            var TextValue = $(this).find('#txtTextMT' + (index + 1) + '').val();    // First No.
            var NumericValue = $(this).find('#txtNumberMT' + (index + 1) + '').val();     // Prefix
            var RangeMin = $(this).find('#txtApprovedMinMT' + (index + 1) + '').val();     // Branch (dropdown)
            var RangeMax = $(this).find('#txtApprovedMaxMT' + (index + 1) + '').val();     // Branch (dropdown)
            var Category = $(this).find('#hddCategoryMT' + (index + 1) + '').val();     // Branch (dropdown)
            var IsSample = $(this).find('#hddIsSampleMT' + (index + 1) + '').val();     // Branch (dropdown)
            var IsProduction = $(this).find('#hddIsProductionMT' + (index + 1) + '').val();     // Branch (dropdown)
            var IsInvard = $(this).find('#hddIsInvardMT' + (index + 1) + '').val();     // Branch (dropdown)
            var IsOutWard = $(this).find('#hddIsOutWardMT' + (index + 1) + '').val();     // Branch (dropdown)
            var IsMicrobiological = $(this).find('#hddIsMicrobiologicalMT' + (index + 1) + '').val();     // Branch (dropdown)
            var QCID = $(this).find('#hddQCIDMT' + (index + 1) + '').val();     // Branch (dropdown)

            // Build an object representing a single row
            var rowData = {
                Parameter_NameID: ParameterNameID,
                Parameter_Type: ParameterTypeId,
                Numeric_Value: NumericValue == "" ? 0 : NumericValue,
                Text_Value: TextValue,
                Range_Min: RangeMin == "" ? 0 : RangeMin,
                Range_Max: RangeMax == "" ? 0 : RangeMax,
                Category: Category,
                IsSample: IsSample,
                IsProduction: IsProduction,
                IsInvard: IsInvard,
                IsOutWard: IsOutWard,
                IsMicrobiological: IsMicrobiological,
                QCID: QCID
            };

            // Push it into the array
            if (ParameterNameID != '') {
                QCTestMappingData.push(rowData);
            }
        });
    }
    else {
        // Clear all rows in the tbody of the table
        $('#tblMicrobiologyTests tbody').empty();
    }
    // Now QCTestMappingData is an array of objects containing all rows' data
    return QCTestMappingData;
}
//function SaveQCCheck() {
//    if (checkValidationOnSubmit('QCTestMandatory') == true) {
//        collectTableData();
//        $("#qctestmapping").modal('hide');
//    }
//}

function SaveQCCheck() {
    var id = parseInt($("#hdnItemMasterId").val());

    // Modified by Sumit_03092025 :  Microbiology Validation
    var isMicroRequired = $('#isMandatory').is(':checked');

    if (isMicroRequired) {
        var microRowCount = $('#tblMicrobiologyTests tbody tr').length;

        // 1. Ensure at least one microbiology test is added
        if (microRowCount === 0) {
            FailToaster("Microbiology test is required. Please add at least one test.");
            $("#qctestmapping").modal('show');
            return;
        }

        // 2. Validate all microbiology test rows have a selected test name
        var allMicroRowsValid = true;
        $('#tblMicrobiologyTests tbody tr').each(function () {
            var selectedValue = $(this).find('select').val();
            if (!selectedValue || selectedValue === "0" || selectedValue.trim() === "") {
                allMicroRowsValid = false;
                return false;
            }
        });

        if (!allMicroRowsValid) {
            FailToaster("Please select a valid test name in all Microbiology test rows.");
            $("#qctestmapping").modal('show');
            return;
        }
    }

    //End

    var rowCount = $('#tblQCTestMapping tbody tr').length;
    
    if (rowCount > 0) {
        var allRowsValid = true;

        $('#tblQCTestMapping tbody tr').each(function () {
            var selectedValue = $(this).find('select').val();

            if (!selectedValue || selectedValue === "0" || selectedValue.trim() === "") {
                allRowsValid = false;
                return false; // stop loop early if one invalid row is found
            }
        });

        if (allRowsValid) {
            if (checkValidationOnSubmit('QCTestMandatory') === true) {
                collectTableData();

                if (id > 0) {

                    var itemModel =
                    {
                        ID: id > 0 ? id : 0,
                        QCTestMapping: QCTestMappingData,
                        NoOfContainers: $('#txtNoOfContainers').val()

                    }
                    // Convert the model to JSON string
                    const jsonString1 = JSON.stringify(itemModel);
                    // Assign the final data for submission
                    let GenericModeldata = {
                        ScreenID: "Item_Param_101",
                        Operation: "A",  // Use Update for existing records, Add for new ones
                        ModelData: jsonString1
                    };
                    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                        //if (response.ValidationInput == 1) {
                        //    setTimeout(function () {
                        //        ClearFormControl();
                        //        RedirectItemMasterList();
                        //    }, 1000);

                        //}
                    });
                }
                $("#qctestmapping").modal('hide');
            }
        } else {
            FailToaster("Please select a test name value in all QC records.");
            $("#qctestmapping").modal('show');
        }
    } else {
        FailToaster("Please fill in at least one QC record.");
        $("#qctestmapping").modal('show');
    }
}

function isDuplicateTestNameMicrobiological(testNameId, rowId) {
    var isDuplicate = false;

    $("#tblMicrobiologyTests tbody tr").each(function (index) {
        if ($("#tblMicrobiologyTests tbody tr").length > 1) {
            var ParameterNameID = $(this).find('#hddTestNameIdMT' + (index + 1) + '').val();

            if (ParameterNameID === testNameId) {
                isDuplicate = true;
                return false; // exit loop early
            }
        }
    });
    return isDuplicate;
}
function isDuplicateTestName(testNameId, rowId) {
    var isDuplicate = false;

    $("#tblQCTestMapping tbody tr").each(function (index) {
        if ($("#tblQCTestMapping tbody tr").length > 1) {
            var ParameterNameID = $(this).find('#hddTestNameId' + (index + 1) + '').val();

            if (ParameterNameID === testNameId) {
                isDuplicate = true;
                return false; // exit loop early
            }
        }
    });

    return isDuplicate;
}

document.getElementById("txtPackSize").addEventListener("input", function (e) {
    // Allow only alphanumeric, * and /
    this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
});

