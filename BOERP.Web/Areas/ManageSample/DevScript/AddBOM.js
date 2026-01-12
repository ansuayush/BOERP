$(document).ready(function () {

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 5,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlCustomer', obj1, 'All', false);





    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 7,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlChemist', obj2, 'All', false);

    LoadMasterDropdown('txtChemist', obj2, 'Select', false);



    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 8,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlItem', obj3, 'All', false);

    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }

    LoadMasterDropdown('ddlSampleType', obj4, 'All', false);


    var obj5 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 9,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlBaseItem', obj5, 'Select', false);



    getSampleDocSeries();
    LoadItemDropdown();
   

    if (localStorage.getItem('IsBOM_ID') == 'true') {
        Edit_BOM(Edit_ID);
    }
    else {
        GetQCValues();
    }
});

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


function GetItemDetails(ITEM_ID, rowId) {

    var model =
    {
        Id: Edit_ID,
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

var IsView = 'false';
function Edit_BOM(id) {

    var model =
    {
        Id: id
    };

    IsView = localStorage.getItem('IsView');

    if (IsView == 'true') {
        $('#bomSubmit').hide();
    }

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        $('#FMDocNo').html(response.data.data.Table[0].DocNo);

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


        EditQCValues(response.data.data.Table2);

        index = 0;
        for (item of response.data.data.Table3) {

            if (index == 0) {
                $('#txtprocess_0').val(item.Process);
                    $('#txtRPM_0').val(item.rpm);
                $('#txtTemp_0').val(item.Temp);


                if (IsView == 'true') {
                    $('#txtprocess_0').prop('disabled', true);
                    $('#txtRPM_0').prop('disabled', true);
                    $('#txtTemp_0').prop('disabled', true);

                    $("#ingredientTable2 tr td:first-child div").hide();
                }

            }
            else {
                var rowIndex = addRow2();


                $('#txtprocess_' + rowIndex).val(item.Process);
                $('#txtRPM_' + rowIndex).val(item.rpm);
                $('#txtTemp_' + rowIndex).val(item.Temp);

                $('#txtprocess_' + rowIndex).prop('diabled', true);
                $('#txtRPM_' + rowIndex).prop('diabled', true);
                $('#txtTemp_' + rowIndex).prop('diabled', true);

                if (IsView == 'true') {
                    $('#txtprocess_' + rowIndex).prop('disabled', true);
                    $('#txtprocess_' + rowIndex).prop('disabled', true);
                    $('#txtprocess_' + rowIndex).prop('disabled', true);

                    $("#ingredientTable2 tr td:first-child div").hide();
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

            if (IsView == 'false') {
                LoadFileData(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
            }

            else {
                LoadFileDataDownload(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
            }
        }
        

       

    });
}


function LoadFileDataDownload(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {


    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                     
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                         <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
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
                         <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
         <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                      <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
   
    document.getElementById("documentImagesMCU").appendChild(newDocument);

        $('#NoUploadFile1').hide();
    $('#ShowUploadFile1').show();

    $('#add_att').hide();

    $('#view_att').show();
    
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

function CalculateRate(ctrl) {

    var rowId = ctrl.id.split("_")[1];

    var ans = SetZero(ctrl);

    if (ans == -1) {
        return;
    }

    $('#total_' + rowId).html((($('#quantity_' + rowId).val()/1000) * $('#sale_' + rowId).val()).toFixed(2));

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


function EditQCValues(arr) {

    var model =
    {
        Id: Edit_ID,
        Type: 6
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        var filtered = [];

        if (localStorage.getItem("sample_type") == 'Oil') {
            filtered = response.data.data.Table.filter(item => item.Category.includes("Oil"));
        }
        else {
            filtered = response.data.data.Table;
        }

        var qc = ``;

        var index = 0;

        for (var item of filtered) {

           //  var arr_item = [];
            var arr_item = arr.find(input => input.QC_Id == item.Id);

            qc += `  <tr class="qc" id="qc_${index}">
            <input value="${item.Id}" type="hidden" id="ddlQC_${index}" />
                                <td id="qcname_${index}">                                
                                    ${item.Parameter_Name}
                                </td>
                                <td id="qctype_${index}">${item.Parameter_Type}</td>
                                <td id="qcvalue_${index}">
                                    ${item.Parameter_Type == `Range` ? `${item.Range_Min} - ${item.Range_Max}` : item.Parameter_Type == `Numeric` ? `${item.Numeric_Value}` : `${item.Text_Value}`}
                                </td>
                                <td >
                                ${item.Parameter_Type == `Range` ? `<input type="number" id="qcinput_${index}" ${IsView == 'true' ? `disabled` : ``} value="${arr_item?.Result_ValueF ? arr_item?.Result_ValueF : 0}" oninput="SetZero(this)"  class="form-control MandatePH" placeholder="Enter">` : item.Parameter_Type == `Numeric` ? `<input type="number" id="qcinput_${index}" ${IsView == 'true' ? `disabled` : ``} value="${arr_item?.Result_ValueF ? arr_item?.Result_ValueF : 0}" oninput="SetZero(this)" class="form-control MandatePH" placeholder="Enter">` : `<input type="text" id="qcinput_${index}" ${IsView == 'true' ? `disabled` : ``} value="${arr_item?.Resust_ValueT ? arr_item?.Resust_ValueT : ``}" maxlength="255" class="form-control MandatePH" placeholder="Enter">`}
                                    <span id="spqcinput_${index}" class="text-danger field-validation-error"  style="display:none;">Hey, You missed this field!!</span>
                                </td>

                            </tr>`;

            index++;
        }

        $('#quality_check').html(qc);





    });

}
function GetQCValues() {

    var model =
    {
        Id: Edit_ID,
        Type: 6
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        var filtered = [];

        if (localStorage.getItem("sample_type") == 'Oil') {
            filtered = response.data.data.Table.filter(item => item.Category.includes("Oil"));
        }
        else {
            filtered = response.data.data.Table
        } 

        var qc = ``;

        var index =  0;

        for(var item of filtered) {

            qc += `  <tr class="qc" id="qc_${index}">
            <input value="${item.Id}" type="hidden" id="ddlQC_${index}" />
                                <td id="qcname_${index}">                                
                                    ${item.Parameter_Name}
                                </td>
                                <td id="qctype_${index}">${item.Parameter_Type}</td>
                                <td id="qcvalue_${index}">
                                    ${item.Parameter_Type == `Range` ? `${item.Range_Min} - ${item.Range_Max}` : item.Parameter_Type == `Numeric` ? `${item.Numeric_Value}` : `${item.Text_Value}`}
                                </td>
                                <td >
                                ${item.Parameter_Type == `Range` ? `<input type="number" id="qcinput_${index}" oninput="SetZero(this); HideErrorMessage(this)" class="form-control MandatePH" placeholder="Enter">` : item.Parameter_Type == `Numeric` ? `<input type="number" id="qcinput_${index}" oninput="SetZero(this);HideErrorMessage(this);" class="form-control MandatePH" placeholder="Enter">` : `<input type="text" id="qcinput_${index}" oninput="HideErrorMessage(this)" maxlength="255" class="form-control MandatePH" placeholder="Enter">`}
                                    <span id="spqcinput_${index}" class="text-danger field-validation-error"  style="display:none;">Hey, You missed this field!!</span>
                                </td>

                            </tr>`;

            index++;
        }

        $('#quality_check').html(qc);

      

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
        ItemCodeList = ItemCodeList.filter(
            (obj, index, self) =>
                index === self.findIndex(o =>
                    o.ITEM_NAME === obj.ITEM_NAME && o.ITEM_CODE === obj.ITEM_CODE
                )
        );
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


function getSampleDocSeries() {
    var TaskNo = 4;

    var model =
    {
        Id: Edit_ID,
        Type: 4
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        var data = response.data.data.Table[0];
       
        $('#FMDocNo').html(data.FMDocNo);
        $('#Item_Name').html(data.Item_Name);
        $('#SampleDocvNo').html(data.ERP_Sample_Det_UniqId);
        $('#Chemist').html(localStorage.getItem("chemist"));
        $('#Sample_Type').html(localStorage.getItem("sample_type"));

        //FMS Doc and Video By StepNo
        $('#open_pdf').on('click', function () {
            /* handleTaskFile(data.SFileURL, data.SActualFileName);*/
            handleTaskFile(data.FmsActualFileUrl, data.FmsActualFileName);
        })

        if (data.FMSVideoLink != null && data.FMSVideoLink.length >= 1) {
            $('#video' + TaskNo).attr('href', data.FMSVideoLink);
            $('#video' + TaskNo).attr('target', '_blank');


        }
        else {
            $('#video' + TaskNo).removeAttr('target');

        }

        //End

        if (localStorage.getItem("sample_type") == 'Oil') {

            $('#oil').show();


            var viewOil = ` <td>${data.Item_Name}</td>
                            <td>${data.txtFormulationCategory}</td>
                            <td class="text-right">${data.TargetPrice}</td>
                            <td><a  onclick="handleTaskFile('${data.FileURL}', '${data.ActualFileName}')" class="fn-bold" target="_blank"><img src="../../assets/images/icons/help/view-icon.png" class="icon-sm"> View</a></td>`;


            $('#viewOil').html(viewOil);
        }
        else {

            $('#Standard').show();

            var viewStandard = `             <td>${data.Item_Name}</td>
                                        <td>${data.txtFormulationCategory}</td>
                                        <td>${data.Fragrance}</td>
                                        <td>${data.Colour}</td>
                                        <td>${data.txtPackagingType}</td>
                                        <td class="text-right">${data.TargetPrice}</td>
                                        <td>${data.Requirements}</td>
                                        <td>${data.MustIngredients}</td>
                                        <td>${data.MustNotIngredients}</td>
                                        <td><a  onclick="handleTaskFile('${data.FileURL}', '${data.ActualFileName}')" class="fn-bold" target="_blank"><img src="../../assets/images/icons/help/view-icon.png" class="icon-sm"> View</a></td>`


            $('#viewStandard').html(viewStandard);
        }

    });

}



let fileModelList = []; 

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
async function saveBOM() {

    var ingred = [];
    var qc = [];
    var process = [];

    if (checkValidationOnSubmit('MandateP') && checkValidationOnSubmit('MandateIng') && checkValidationOnSubmit('MandatePH')) {


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

        $('.qc').each((index, ele) => {

            var rowId1 = ele.id.split('_')[1];

            var obj = {
                Id: $('#ddlQC_' + rowId1).val(),
                Test_Name: $('#qcname_' + rowId1).text().trim(), 
                Result_Type: $('#qctype_' + rowId1).text().trim(), 
                Measuring_Unit: $('#qcvalue_' + rowId1).text().trim(), 
                Result_ValueF: $('#qctype_' + rowId1).text().trim() == 'Range' || $('#qctype_' + rowId1).text().trim() == 'Numeric' ?  $('#qcinput_' + rowId1).val() : 0, 
                Resust_ValueT: $('#qctype_' + rowId1).text().trim() == 'Range' || $('#qctype_' + rowId1).text().trim() == 'Numeric' ? '' : $('#qcinput_' + rowId1).val(),  
            }

            qc.push(obj);
        });

        

        $('.process').each((index, ele) => {

            var rowId2 = ele.id.split('_')[1];

            var obj = {
                Process: $('#txtprocess_' + rowId2).val(),
                rpm: $('#txtRPM_' + rowId2).val(),
                Temp: $('#txtTemp_' + rowId2).val(),
            }

            process.push(obj);
        });

        var obj =
        {
            FolderNames: "BOMDocuments/"
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

        if (fileData.length > 10) {
            FailToaster("You cannot add more than 10 files");
            return;
        }

        if (hasDuplicateItemIds(ingred) == 1) {
            FailToaster('Duplicate Ingredients found!!');
            return;
        }
        else if (hasDuplicateItemIds(ingred) == 2) {
            FailToaster('Ingredient Name Not found!!');
            return;
        }

        if (parseFloat($('#total_cost').html()) <= 0) {
            FailToaster('Total Cost of Ingredients cannot be equal to 0!!');
            return;
        }


        var model = {
            Id: Edit_ID,
            Ingredient_List: ingred,
            Quality_Check: qc,
            Process: process,
            Attatchements: fileData
        }

        var jsonString = JSON.stringify(model);

        let GenericModeldata = {
            ScreenID: "ERP_Samp5_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };

        console.log(qc);

        console.log(fileData);

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                if (localStorage.getItem('IsPC') == 1) {
                    localStorage.removeItem('IsPC');
                    window.location.href = 'PCDashboard?auth=' + AuthToken;
                }
                else {
                    window.location.href = 'DispatchSample?auth=' + AuthToken;
                }
            }

        });

    }
}

function CancelBOM() {
    if (localStorage.getItem('IsPC') == 1) {
        localStorage.removeItem('IsPC');
        window.location.href = 'PCDashboard?auth=' + AuthToken;
    }
    else {
        window.location.href = 'DispatchSample?auth=' + AuthToken;
    }

}

function LoadFileData(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
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
    fileModelList.push(fileObject);

    let previewElement;

    if (fileType === "image" || (fileUrl.split('.')[1].includes('png') || fileUrl.split('.')[1].includes('jpe'))) {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="~${fileUrl}" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if ((fileType === "application" && type === "application/pdf") || fileUrl.split('.')[1].includes('pdf')) {
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
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileUrl.split('.')[1].includes('xlsx')) {
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
    document.getElementById("documentImages").appendChild(newDocument);
}

function handleTaskFile(fileUrl, actualFileName) {
    // Determine file extension using lastIndexOf('.')

    /*const imageElement = document.getElementById('myImage');*/

    // Get the value of the 'src' attribute
    const filePath = fileUrl;
    const lastDotIndex = filePath.lastIndexOf('.');
    const fileExtension = lastDotIndex !== -1 ? filePath.substring(lastDotIndex + 1).toLowerCase() : '';

    // List of image extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    // Check if the file is an image
    if (imageExtensions.includes(fileExtension) || fileExtension == '' || fileExtension == null || fileExtension.length > 4) {
        // Show image in modal
        showTaskModalWithImage(filePath);
    } else {
        // Download the file
        downloadTaskFile(filePath, actualFileName);
    }
}

// Function to display image in the modal
function showTaskModalWithImage(imagePath) {
    const modalImage = document.getElementById('myImage');
    if (!imagePath || imagePath.length <= 1) {
        FailToaster('No image/pdf was saved!');
        return;
    }
    modalImage.src = imagePath;
    $('#viewimage').modal('show'); // Assuming you're using jQuery and Bootstrap // changs in comment
}

// Function to download the file

function downloadTaskFile(filePath, actualFileName) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = actualFileName; // Let the browser decide the file name or specify one
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


