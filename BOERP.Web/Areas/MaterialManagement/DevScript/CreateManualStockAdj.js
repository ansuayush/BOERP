$(document).ready(function () {

    //#region : Code for Manual Stock Adj Gried
    LoadMasterDropdown('ddlStatus', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 5,
        manualTableId: 0,
        ScreenId: "ManualStockAdj_102"
    }, 'All', false);
    LoadMasterDropdown('ddlAdjustType', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 6,
        manualTableId: 0,
        ScreenId: "ManualStockAdj_102"
    }, 'All', false);
    //#endregion

    LoadItemDropdown();
    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 80,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlAdjType', obj2, 'Select', false);
    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 77,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlWarehouse', obj1, 'Select', false);

    //GetMSAList();      /* Get all records*/

    // Debounced filter input
    $('#txtDocNumber').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblMSAList")) {
            MSATable.ajax.reload();
        }
    }, 500));
    $('#txtWarehouseName').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblMSAList")) {
            MSATable.ajax.reload();
        }
    }, 500));

  

    $("#addrow").click(function () {

        if (((parseInt($("#ddlAdjType   ").val())) > 0) && (parseInt($("#ddlWarehouse").val())) > 0) {
            var RowId = 0;
            RowId = $("#datatableMSA tbody tr").length + 1;

            let newRow = `
        <tr>
            <td>
                <div class="deleterow text-center cursor-pointer">
                    <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
                    <input type="hidden" id="hdnMSADetailId_${RowId}" value="0" />
                </div>
            </td>
            <td>
                <div class="autocomplete-wrapper" style="position: relative;">
                    <label for="ddlI_${RowId}" class="search-label">
                            <img src="../../../assets/images/icons/help/search-icon.png" class="icon-sm" />
                    </label>                                  
                    <input type="text" class="form-control searchlist MandateMSA" id="ddlI_${RowId}" oninput="Getdata(this)" onclick="Getdata(this), HideErrorMessage(this)"  placeholder="Type item..." autocomplete="off" />
                    <span id="spddlI_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    <ul id="globalSuggestionBox_${RowId}" class="suggestions"></ul>
                    <input type="hidden" id="ddlItem_${RowId}" />

                 </div>
            </td>
            <td id="lblItemName_${RowId}"></td>
			<td id="lblUnit_${RowId}"></td>
            <td class="text-right"><label id="lblCurrentStock_${RowId}"></label></td>
            <td>
                <input type="text" id="txtQuantity_${RowId}" class="form-control text-right MandateMSA numeric-decimal-restrict" value="" placeholder="0" oninput="HideErrorMessage(this)">
                <span id="sptxtQuantity_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
            </td>
            <td><input type="number" id="txtFinalStock_${RowId}" readonly="" class="form-control text-right readonlyfield" placeholder="0" value=""></td>
            <td><input type="text" id="txtDefaultPrice_${RowId}" class="form-control text-right numeric-decimal-restrict" placeholder="0" value=""></td>
            <td><textarea id="txtComment_${RowId}" placeholder="Enter Text" class="form-control" spellcheck="false"></textarea>
            </td>
        </tr>`;

            // Append new row to table body
            $(".itemsinformation tbody").append(newRow);

            // Re-initialize select2 for the newly added select element
            $(".itemsinformation tbody tr:last .applyselect").select2();

            // Re-initialize tooltip for newly added elements
            $(".itemsinformation tbody tr:last [data-toggle='tooltip']").tooltip();

            // Populate the newly added select dropdown (ddlItem_${RowId}) with options from ItemCodeList
            //var $ele = $('#ddlItem_' + RowId);
            //$ele.empty();
            //$ele.append($('<option/>').val('Select').text('Select'));
            //$.each(ItemCodeList, function (ii, vall) {
            //    $ele.append($('<option />').val(vall.ITEM_ID).text(vall.ITEM_CODE));
            //});

            var inputElement = $('#ddlI_' + RowId);
            Getdata(inputElement);
        }
        else {
            FailToaster("Header options are manadatory.");
            return;
        }
    });

    // Delegated event for dynamically added quantity inputs
    $('.itemsinformation tbody').on('change', 'input[id^="txtQuantity_"]', function () {
        var rowId = $(this).attr('id').split('_')[1];
        validateQtyForRow(rowId);
        updateFinalStockForRow(rowId);
    });

    $('#ddlAdjType').change(function () {
        $('.itemsinformation tbody tr').each(function (index) {
            updateFinalStockForRow(index);
        });
    });

    // Trigger change event initially to update based on the selected adjustment type
    $('#ddlAdjType').trigger('change');

    // Delete a row
    $(document).on("click", ".deleterow", function () {
        $(this).closest("tr").remove();
    });

    //Current Stock by Warehouse
    //$(document).on('change', '#ddlWarehouse', function () {
    //    $('.itemsinformation tbody tr').each(function () {
    //        let ddlItemInput = $(this).find('input[id^="ddlItem_"]');

    //        if (ddlItemInput.length > 0) {
    //            let rowId = ddlItemInput.attr('id').split('_')[1];
    //            let itemId = ddlItemInput.val();
    //            $(`#txtQuantity_${rowId}`).val('');
    //            $(`#txtFinalStock_${rowId}`).val('');
    //            $(`#txtDefaultPrice_${rowId}`).val('');
    //            $(`#txtComment_${rowId}`).val('');

    //            if (itemId && parseInt(itemId) > 0) {
    //                FetchCurrentStock(rowId, itemId);
    //            }
    //        }
    //    });
    //});

    //End

    //Get Fin Year From date, To date by FinId
    var model =
    {
        ID: FinYearId
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'FinYear_101' }, 'GET', function (response) {
        var tblFinYear = response.data.data.Table;
        finFromDate = tblFinYear[0].FromDate;
        finToDate = tblFinYear[0].ToDate;
    });
    // End
});

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

var finFromDate = '';
var finToDate = '';

function GetMSADetById(manualStockAdjId, statusId) {
    var model = {
        ID: manualStockAdjId
    };
    const jsonString = JSON.stringify(model);
    var ScreenID = "ManualStockAdj_101";
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var tableData = response.data.data.Table;
        var tableData1 = response.data.data.Table1;
        if (tableData && tableData.length > 0) {
           // ClearFormControl();
           // GetSeriesListByAdjType();

            $("#hdnMSAId").val(tableData[0].ID);
            var adjTypeText = tableData[0].AdjType;
            var adjTypeValue = '';
            if (adjTypeText === 'Increase Stock') {
                adjTypeValue = '1';
            } else if (adjTypeText === 'Decrease Stock') {
                adjTypeValue = '2';
            }

            // Set the dropdown value and trigger the change event
            if (adjTypeValue) {
                $('#ddlAdjType').val(adjTypeValue).trigger('change');
            }

            var tblSeries = response.data.data.Table2;
            var $ele = $('#ddlSeries');
            $ele.empty();
            $.each(tblSeries, function (ii, vall) {
                var $option = $('<option />')
                    .val(vall.ID)
                    .text(vall.ValueName);

                $ele.append($option);

            })

            $("#ddlSeries").val(tableData[0].SeriesId);
            $('#txtDocNo').val(tableData[0].DocNo);
            $("#ddlWarehouse").val(tableData[0].WarehouseId).trigger('change');
            $("#txtSADocDate").val(tableData[0].SADocDate);

            // Now populate the contact persons
            if (tableData1.length > 0) {
                PopulateMSADet(tableData1, statusId);
            }

            // Check if the status is -- 1 (Pending), 2 (Approved)
            if (statusId === 2) {
                $('#btnSave').hide();
                $('#btnPost').hide();
            } else {
                // Enable the button if status is not approved
                $('#btnSave').show();
                $('#btnPost').show();
            }

            $('#ddlAdjType').prop('disabled', true);
            $("#ddlSeries").prop("disabled", true);
            $('#ddlWarehouse').prop('disabled', true);

            // Open the modal
            $('#updateitemstock').modal('show');
            $('button[onclick="chkMSAFields()"]').text('Update');

            $("#customLoader").hide();

            toggleSADateField($("#hdnMSAId").val());
        }

        else {
            console.error("Record not found..", error);
        }

    });
}

// Function to Populate Table from JSON
function PopulateMSADet(data, statusId) {
    // Call this function whenever you need to clear the table
    //clearTable();

    let tableBody = document.getElementById("tableToModify");

    data.forEach((item, index) => {
        if (index == 0) {
            $('#hdnMSADetailId_0').val(item.ID);
            $('#ddlItem_0').val(item.ItemID);
            $('#ddlI_0').val(item.ItemCode);
            $('#lblItemName_0').text(item.ItemName);
            $('#lblItemDesc_0').text(item.ItemDecription);
            $('#lblUnit_0').text(item.UOM);
            $('#lblCurrentStock_0').text(item.CurrentStock);
            $('#txtQuantity_0').val(item.Qty);
            $('#txtFinalStock_0').val(item.FinalStock);
            $('#txtDefaultPrice_0').val(item.DefaultPrice);
            $('#txtComment_0').val(item.Comment);
        }
        else {

            let row = document.createElement("tr");

            row.innerHTML = `

             <td class="text-center">
                <div id="addrow" class="deleterow cursor-pointer"><img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" /></div>
                <input type="hidden" id="hdnMSADetailId_${index}" value="${item.ID}"/>
            </td>
            <td>
                    <div class="autocomplete-wrapper" style="position: relative;">
                        <label for="ddlI_${index}" class="search-label">
                            <img src="../../../assets/images/icons/help/search-icon.png" class="icon-sm" />
                        </label>
                        <input type="text" class="form-control searchlist" id="ddlI_${index}" value="${item.ItemCode}"  oninput="Getdata(this)" placeholder="Type item..." autocomplete="off" onclick="HideErrorMessage(this)"/>
                        <ul id="globalSuggestionBox_${index}" class="suggestions"></ul>                       
                       <input type="hidden" id="ddlItem_${index}" value="${item.ItemID}" />

                    </div>
                
            </td>
            <td id="lblItemName_${index}">${item.ItemName}</td>
            <td id="lblUnit_${index}">${item.UOM}</td>
            <td class="text-right"><label id="lblCurrentStock_${index}">${item.CurrentStock}</label></td>
            <td>
                <input type="text" id="txtQuantity_${index}" class="form-control text-right MandateMSA numeric-decimal-restrict" value="${item.Qty}" placeholder="0" oninput="HideErrorMessage(this)">
                <span id="sptxtQuantity_${index}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
            </td>
            <td><input type="number" id="txtFinalStock_${index}" readonly="" class="form-control text-right readonlyfield" placeholder="0" value="${item.FinalStock}"></td>
            <td><input type="text" id="txtDefaultPrice_${index}" class="form-control text-right numeric-decimal-restrict" placeholder="0" value="${item.DefaultPrice}"></td>
            <td><textarea id="txtComment_${index}" placeholder="Enter Text" class="form-control">${item.Comment}</textarea></td>

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

    SetFormFreezeState(statusId);
}

function OnchangeStatus() {
    GetMSAList();
}
function toggleSADateField(Id) {
    var container = document.getElementById('SADocDate');
    //if (Id > 0) {
    //    container.style.display = 'block'; // or 'flex' depending on layout
    //} else {
    //    container.style.display = 'none';
    //}

    container.style.display = 'none';
}

function GetSeriesListByAdjType() {
    if ($("#hdnMSAId").val()=="0" && $('#ddlAdjType').val() > 0) {
        var Id = $("#ddlSeries").val() > 0 ? $("#ddlSeries").val() : 0

        var model =
        {
            ID: Id,
            OtherId: $("#ddlAdjType").val(),
            ModuleId: 1
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
            if (Id === 0) {
                var DOC_LOCK = false;
                var tblSeries = response.data.data.Table;
                var tblDoc = response.data.data.Table1;
                $('#txtDocNo').val(tblDoc[0].DocNumber);

                var $ele = $('#ddlSeries');
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

                $('#spddlSeries').hide();    // Hide the Series Error msg
            }
            else {
                var tblDoc = response.data.data.Table;
                $('#txtDocNo').val(tblDoc[0].DocNumber);  
            }

            if (DOC_LOCK == true) {
                $("#txtDocNo").prop("disabled", true);
            }
            else {
                $("#txtDocNo").prop("disabled", false);
            }
        });

    }

}

let fileModelList = [];
var ItemCodeList = [];
function LoadItemDropdown() {
    var model =
    {
        ColumnName: 'Name',
        SearchData: ""
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

//function FillItemDetails(ctrl) {
//    debugger;
//    var itemId = ctrl.value;
//    if (itemId > 0) {
//        var ctrlId = ctrl.id.split('_')[1];
//        var model = {
//            ID: itemId
//        };
//        const jsonString = JSON.stringify(model);
//        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_101' }, 'GET', function (response) {

//            var data = response.data.data.Table;
//            $('#' + 'lblItemName_' + ctrlId).text(data[0].ITEM_NAME);
//            $('#' + 'lblItemDesc_' + ctrlId).text(data[0].DESCRIPTION);
//            $('#' + 'lblUnit_' + ctrlId).text(data[0].UNIT);
//            $('#' + 'lblCurrentStock_' + ctrlId).text('100');

//        });
//    }

//}

function Getdata(inputElement) {
    if (((parseInt($("#ddlAdjType").val())) > 0) && (parseInt($("#ddlWarehouse").val())) > 0) {

        let rowId = inputElement.id.split('_')[1]; // Extract RowId from input ID
        let suggestionBox = document.getElementById(`globalSuggestionBox_${rowId}`);

        let search = inputElement.value.toLowerCase();
        suggestionBox.innerHTML = "";

        //if (search.length < 2) {
        //    suggestionBox.style.display = "none";
        //    return;
        //}

        let matchedItems = ItemCodeList.filter(item =>
            item.ITEM_DISPLAY.toLowerCase().includes(search) || item.ITEM_DISPLAY.toLowerCase().includes(search)
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

                    // Now, when the item is clicked, the Item_ID is available as:
                    var selectedItemId = li.dataset.id; // Retrieve Item_ID here
                    if (selectedItemId > 0) {
                        FetchCurrentStock(rowId, selectedItemId);
                    }

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

        $('#ddlAdjType').prop('disabled', true);
        $('#ddlSeries').prop('disabled', true);
        $('#ddlWarehouse').prop('disabled', true);
    }
    else {
        FailToaster("Header options are manadatory.");
        return;
    }
}

document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("searchlist")) {
        document.querySelectorAll(".suggestions").forEach(box => box.style.display = "none");
    }
});

function FetchCurrentStock(rowId, itemId) {
    if (parseInt(itemId) > 0 && parseInt($("#ddlWarehouse").val()) > 0) {
        var model = {
            FIN_ID: FinYearId,
            EXTRA_QUERY: 'AND ITEM.ITEM_ID NOT IN(0)',
            FDATE: ChangeDateFormatToYYYYMMDDWithSlash(finFromDate),
            TDATE: ChangeDateFormatToYYYYMMDDWithSlash(finToDate),
            ITEM_MOVE: 0,
            MIN_QTY: 0,
            METHOD: 'W',
            CHARGE: 'N',
            MINQTY: -9999999999,
            MAXQTY: 9999999999,
            ItemId: itemId,
            WarehouseId: $("#ddlWarehouse").val() > 0 ? $("#ddlWarehouse").val() : 0
        };

        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'StockStmtRpt_101' }, 'GET', function (response) {
            var tblItemStock = response.data.data.Table1;
            $(`#lblCurrentStock_${rowId}`).text(tblItemStock?.length > 0 ? parseFloat(tblItemStock[0].CQty).toFixed(2) : '0');

            // Recalculate final stock in case quantity was already entered
            updateFinalStockForRow(rowId);
        });
    }
}

function updateFinalStockForRow(rowId) {
    var adjustmentType = $('#ddlAdjType').find('option:selected').text().toLowerCase();
    var currentStock = parseFloat($('#lblCurrentStock_' + rowId).text()) || 0;
    var quantity = parseFloat($('#txtQuantity_' + rowId).val()) || 0;
    var finalStock = 0;

    if (adjustmentType === 'increase stock') {
        finalStock = currentStock + quantity;
    } else if (adjustmentType === 'decrease stock') {
        if (quantity > currentStock) {
            // Show validation error
            FailToaster("Quantity cannot be greater than current stock.");
            $('#txtQuantity_' + rowId).val('');
            $('#txtFinalStock_' + rowId).val('');
            $('#txtDefaultPrice_' + rowId).val('');
            $('#txtComment_' + rowId).val('');
            return;
        } else {
            finalStock = currentStock - quantity;
        }
    }

    $('#txtFinalStock_' + rowId).val(finalStock);
}

let itemCurrentStock = 0;

function getTableData() {
    let tableData = [];
    let invalidRows = [];
    let rows = document.querySelectorAll("#tableToModify tr");

    rows.forEach((row, index) => {
        let itemId = row.querySelector("[id^='ddlItem']")?.value || 0;

        // Track invalid rows by row number (1-based index)
        if (parseInt(itemId) <= 0) {
            invalidRows.push(index + 1);
        }

        tableData.push({
            MSADetId: row.querySelector("[id^='hdnMSADetailId']")?.value || 0,
            MSAId: document.getElementById("hdnMSAId").value,
            ItemId: itemId,
            CurrentStock: parseFloat(row.querySelector("[id^='lblCurrentStock']")?.textContent) || 0,
            Quantity: parseFloat(row.querySelector("[id^='txtQuantity']")?.value) || 0,
            FinalStock: parseFloat(row.querySelector("[id^='txtFinalStock']")?.value) || 0,
            DefaultPrice: parseFloat(row.querySelector("[id^='txtDefaultPrice']")?.value) || 0,
            Comment: row.querySelector("[id^='txtComment']")?.value || ""
        });
    });

    if (invalidRows.length > 0) {
        FailToaster(`Please select a valid Item for the following row(s): ${invalidRows.join(", ")}`);
        return null;
    }
    console.log(tableData);
    return tableData;
}

//#region : Click Event
function chkMSAFields() {
    if (checkValidationOnSubmit('MandateMSA') == true) {
        if ($("#ddlAdjType option:selected").text() == 'Select') {
            FailToaster("Please select Adjustment Type.");
            return;
        }

        if (!validateUniqueItems()) {
            return false;
        }

        $('#updateitemstock').modal('hide');
        $('#password').modal('show');
    }
    else {
        $('#updateitemstock').modal('show');
        $('#password').modal('hide');
    }

}

function ValidateManualStockAdjData() {
    if (checkValidationOnSubmit('MandateMSAPassword') == true) {
        if ($("#txtMSAPasswordValid").val() == "admin") {

            SaveManualStockAdjData(1);   //For Save, Update button
        }
        else {
            $('#sptxtMSAPasswordValid').text("Password is incorrect.").show();
        }
    }
}
function SaveManualStockAdjData(proc) {

    if (!validateUniqueItems()) {
        return false;
    }

    var id = parseInt($("#hdnMSAId").val());
    var manualStockAdjDet = getTableData();

    // Check if there is at least one row
    if (!manualStockAdjDet || manualStockAdjDet.length === 0) {
        FailToaster("Please add at least one stock adjustment detail before saving.");
        return false;
    }

    var model = {
        ID: id > 0 ? id : 0,
        SeriesId: $("#ddlSeries").val(),
        DocSeries: $("#ddlSeries option:selected").text(),
        DocNo: $("#txtDocNo").val(),
        WarehouseId: $("#ddlWarehouse").val(),
        AdjType: $("#ddlAdjType option:selected").text(),
        FinId: FinYearId,

        //Details record
        ManualStockAdjDetList: manualStockAdjDet
    };
    // Convert the model to JSON string
    const jsonString = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "ManualStockAdj_101",
        Operation: id > 0 ? "U" : "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            if (proc == 1) {
                ClearFormControl();
                setTimeout(function () {
                    RedirectUrl();
                }, 1000); // 1000 milliseconds = 1 seconds
               
            }
          
        }
    });

    return true;
}

function PostMSARecords() {
    if (checkValidationOnSubmit('MandateMSA') == true) {

        var Id = parseInt($("#hdnMSAId").val());
        var dt = new Date();
        var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
        var docDate = ChangeDateFormatToYYYYMMDDWithSlash(newDate);

        if (Id > 0) {
            // Only proceed if SaveManualStockAdjData returns true
            var isSaveSuccessful = SaveManualStockAdjData(2);   //For Post button
            if (!isSaveSuccessful) return;

            var model = {
                ID: Id,
                SADocDate: docDate,
                DocType: 'ManualStockAdj'
            };

            const jsonString = JSON.stringify(model);
            let GenericModeldata = {
                ScreenID: "SAPost_101",
                Operation: "A",
                ModelData: jsonString
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                if (response.ValidationInput == 1) {
                    ClearFormControl();
                    setTimeout(function () {
                        RedirectUrl();
                    }, 3000);
                }
               
            });
        }
    }
}

//#endregion

function validateQtyForRow(rowId) {
   var itemQty = parseFloat($('#txtQuantity_' + rowId).val()) || 0;
    if (itemQty <= 0) {
        FailToaster("Quantity must be greater than 0.");
        ClearStockDetRow(rowId);
        return;
    }
}

function ClearStockDetRow(rowId) {
    $('#txtQuantity_' + rowId).val('');
    $('#txtFinalStock_' + rowId).val('');
    $('#txtDefaultPrice_' + rowId).val('');
    $('#txtComment_' + rowId).val('');
}
function validateUniqueItems() {
    var itemIds = [];
    var isValid = true;

    $("input[id^='ddlItem_']").each(function () {
        var $input = $(this);
        var itemId = $input.val().trim();

        if (itemId) {
            if (itemIds.includes(itemId)) {
                FailToaster("Duplicate item selected. The row will be cleared.");

                // Clear the duplicate row
                var rowId = $input.attr('id').split('_')[1]; // Extract row number from ID (e.g., ddlItem_2)
                ClearStockDetRow(rowId);

                isValid = false;
                return false; // exit loop early
            } else {
                itemIds.push(itemId);
                $input.closest('tr').find('.searchlist').removeClass('is-invalid');
            }
        }
    });

    return isValid;
}
function RedirectUrl() {
    var url = "/MaterialManagement/Material/StocksAdjustment?auth=" + AuthToken;
    window.location.href = url;
}

function ClearFormControl() {
    $('#hdnMSAId').val(0);
    $('#ddlAdjType').val('Select').trigger('change');
    $('#ddlSeries').val('0').trigger('change');
    $('#txtDocNo').val(0);
    $('#ddlWarehouse').val('Select').trigger('change');
    
    localStorage.removeItem('tableData');

    // Keep the first row as is and reset the other rows
    let tableBody = document.getElementById("tableToModify");

    // Select all rows except the first one
    let rows = tableBody.querySelectorAll("tr:not(:first-child)");

    // Remove each row
    rows.forEach(row => row.remove());
    $('#hdnMSADetailId_0').val(0);
    $('#ddlI_0').val('');
    $('#lblItemName_0').text('');
    $('#lblUnit_0').text('');
    $('#lblCurrentStock_0').text('');
    $('#txtQuantity_0').val('');
    $('#txtFinalStock_0').val('');
    $('#txtDefaultPrice_0').val('');
    $('#txtComment_0').val('');

    $('#ddlAdjType').prop('disabled', false);
    $('#ddlSeries').prop('disabled', false);
    $('#ddlWarehouse').prop('disabled', false);

    $('#btnSave').show();
    $('#btnPost').hide();
    $('button[onclick="chkMSAFields()"]').text('Save');

    $('#updateitemstock').modal('hide');
    $('#password').modal('hide');

    toggleSADateField(parseInt($("#hdnMSAId").val()));

    //On new entry display none all error text msz
    document.querySelectorAll('.field-validation-error').forEach(function (el) {
        el.style.display = 'none';
    });

    SetFormFreezeState(0);
}

function SetFormFreezeState(statusId) {
    const isFrozen = (statusId === 2);
    const $modal = $('#updateitemstock');

    // Disable all form elements EXCEPT the close button
    $modal.find('input, select, textarea, button:not(.btn-close)').prop('disabled', isFrozen).css({
        'background-color': isFrozen ? '#f5f5f5' : '',
        'cursor': isFrozen ? 'not-allowed' : ''
    });

    $modal.find('.cursor-pointer, .deleterow').css({
        'pointer-events': isFrozen ? 'none' : 'auto',
        'opacity': isFrozen ? '0.5' : '1',
        'cursor': isFrozen ? 'not-allowed' : 'pointer'
    }).attr('title', isFrozen ? 'Actions disabled' : '');
}

//#region : Manual Stock Adj Gried Data
var MSATable;

//function GetMSAList() {

//    // Check if DataTable is already initialized, then destroy it
//    if ($.fn.DataTable.isDataTable("#tblMSAList")) {
//        $("#tblMSAList").DataTable().destroy();
//    }
//    MSATable = $('#tblMSAList').DataTable({
//        scrollY: "400px",             // Vertical scroll
//        scrollX: true,                // Horizontal scroll to fix header/column alignment
//        scrollCollapse: true,
//        fixedHeader: true,
//        autoWidth: false,
//        "processing": true,
//        "serverSide": true,  // Enables server-side processing
//        "paging": true,
//        "pagingType": "full_numbers",
//        "pageLength": 10,
//        "lengthMenu": [10, 20, 30, 40, 50],
//        "ordering": true,
//        "info": true,
//        "autoWidth": false,
//        "responsive": true,
//        "dom": '<"top">rt<"bottom"lip><"clear">',
//        "language": {
//            "paginate": {
//                "first": "<img src='../../assets/images/icons/help/double-left.png' alt=''>",
//                "previous": "<img src='../../assets/images/icons/help/arrow-left.png' alt=''>",
//                "next": "<img src='../../assets/images/icons/help/arrow-right.png' alt=''>",
//                "last": "<img src='../../assets/images/icons/help/double-right.png' alt=''>"
//            }
//        },
//        "ajax": function (data, callback, settings) {
//            var requestData = {
//                start: data.start,      // Offset (where to start)
//                length: data.length,    // Number of records per page
//                search: data.search.value, // Search term (if any)
//                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
//                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
//                screenId: 'ManualStockAdj_102',//Need to change the screen id as per your data
//                //modelData: jsonString,
//                modelData: JSON.stringify({
//                    Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
//                    AdjType: $("#ddlAdjustType").val() === 'All' ? '' : $("#ddlAdjustType option:selected").text(),
//                    DocNumber: $("#txtDocNumber").val(),
//                    WarehouseName: $("#txtWarehouseName").val()
//                })
//            };

//            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
//                if (response && response.data) {
//                    callback({
//                        draw: data.draw,
//                        recordsTotal: response.data.TotalRecords,   // Total records in DB
//                        recordsFiltered: response.data.FilteredRecords, // Filtered count
//                        data: response.data.Records // Actual page data
//                    });
//                }
//            }, false);
//        },
//        "drawCallback": function () {
//            $('.dropdown-toggle').dropdown(); // Reinitialize dropdowns after draw

//            // Attach click event to the status column
//            $('#MSAList tbody').on('click', 'td span.badge', function () {
//                var row = $(this).closest('tr');
//                var rowData = $('#MSAList').DataTable().row(row).data();

//                // Check if the status is 'Pending' (StatusId == 1)
//                if (rowData.StatusId === 1) {
//                    // Set the ID to the hidden field in the modal
//                    $('#hdnMSAId').val(rowData.ID);

//                    GetMSADetById(rowData.ID, rowData.StatusId);
//                    // Open the modal
//                    $('#updateitemstock').modal('show');

//                }
//            });
//        },
//        // Prevent sorting when clicking on search input fields
//        columnDefs: [
//            { orderable: false, targets: '_all' }
//        ],
//        "columns": [
//            //{"data": "Srno"},
//            {
//                "data": "DocNo",
//                "orderable": true,
//                "render": function (data, type, row) {
//                    return `<td><a href="#" class="d-flex justify-content-between text-primary font-weight-bold" data-toggle="tooltip" title="${data}" onclick="GetMSADetById('${row.ID}', ${row.StatusId})">
//                        <strong>${data}</strong>
//                        <span><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span>
//                    </a></td>`;
//                }
//            },
//            { "data": "DocDate", "orderable": true },
//            { "data": "Warehouse", "orderable": true },
//            { "data": "NoOfItems" },
//            { "data": "Createdby", "orderable": true },
//            { "data": "AdjType" },
//            {
//                "orderable": false,
//                data: null,
//                render: function (data, type, row) {
//                    var strReturn = "";
//                    // Check the status and set the badge accordingly
//                    if (row.StatusId === 1) { // Pending
//                        strReturn = '<span class="align-self-center badge badge-warning">Pending</span>';
//                    } else if (row.StatusId === 2) { // Approved
//                        strReturn = '<span class="align-self-center badge badge-success">Approved</span>';
//                    } else if (row.StatusId === 3) { // Rejected
//                        strReturn = '<span class="align-self-center badge badge-danger">Rejected</span>';
//                    }

//                    return strReturn;
//                }
//            },
//        ]
//    });

//    TableSetup(MSATable);
//}


//AGgried Data

function bindManualStockAdjGridFilter() {

    let filterData = tableData;

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    var AdjType = $("#ddlAdjustType").val() === 'All' ? '' : $("#ddlAdjustType option:selected").html()+ " Stock";

    if (Status != '0') {

        filterData = filterData.filter(row => row.StatusId == Status);

    }
    if (AdjType != '') {
        filterData = filterData.filter(row => row.AdjType.toLowerCase() == AdjType.toLowerCase());
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindManualStockAdjGrid();

    function bindManualStockAdjGrid() {
        $("#customLoader").show();

        //Replaceable content
        //Start
        var requestData = {
            start: 0,
            length: 20000000,
            search: '',
            orderColumn: null,
            orderDir: "asc",
            screenId: 'ManualStockAdj_102',//Need to change the screen id as per your data
            //modelData: jsonString,
            modelData: JSON.stringify({
                Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
                AdjType: $("#ddlAdjustType").val() === 'All' ? '' : $("#ddlAdjustType option:selected").text(),
                DocNumber: $("#txtDocNumber").val(),
                WarehouseName: $("#txtWarehouseName").val()

            })
        };
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tableData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'ManualStockAdjGried', columnMeta, tableData);
            $("#customLoader").hide();
        });
    }

});


//#endregion