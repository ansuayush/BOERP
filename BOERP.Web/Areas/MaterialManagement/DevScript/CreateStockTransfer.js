$(document).ready(function () {
    LoadItemDropdown();

    //#region : Code for Stock Transfer Gried
    LoadMasterDropdown('ddlStatus', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 7,
        manualTableId: 0,
        ScreenId: "StockTransfer_102"
    }, 'All', false);

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 77,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }

    LoadMasterDropdown('ddlFromWarehouseList', obj1, 'Select', false);
    LoadMasterDropdown('ddlToWarehouseList', obj1, 'Select', false);


    BindddlFromWarehouse('');
    BindddlToWarehouse('');

    //#endregion

     //GetStockTransferList();     /* Get all records*/

    // Debounced filter input
    $('#txtDocNumber').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#tblStockTransferList")) {
            StockTransferTable.ajax.reload();
        }
    }, 500));
   
    $("#addrow").click(function () {
        if ((parseInt($("#ddlFromWarehouse").val())) > 0 && (parseInt($("#ddlToWarehouse").val())) > 0) {
            var RowId = 0;
            RowId = $("#dtStockTransfer tbody tr").length + 1;

            let newRow = `
        <tr>
            <td>
                <div class="deleterow text-center cursor-pointer">
                    <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
                    <input type="hidden" id="hdnStockDetId_${RowId}" value="0" />
                </div>
            </td>
            <td>
                <div class="autocomplete-wrapper" style="position: relative;">
                    <label for="ddlI_${RowId}" class="search-label">
                            <img src="../../../assets/images/icons/help/search-icon.png" class="icon-sm" />
                    </label>                                  
                    <input type="text" class="form-control searchlist MandateStockTransfer" id="ddlI_${RowId}" oninput="Getdata(this);" onclick="Getdata(this)"  placeholder="Type item..." autocomplete="off" onchange="HideErrorMessage(this)"/>
                    <span id="spddlI_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    <ul id="globalSuggestionBox_${RowId}" class="suggestions"></ul>
                    <input type="hidden" id="ddlItem_${RowId}" />

                 </div>
            </td>
            <td id="lblItemName_${RowId}"></td>
			<td id="lblUnit_${RowId}"></td>
            <td class="text-right"><label id="lblAvailQty_${RowId}"></label></td>
            <td>
                <input type="text" id="txtTransferQty_${RowId}" class="form-control text-right MandateStockTransfer numeric-decimal-restrict" value="" placeholder="0" oninput="HideErrorMessage(this)">
                <span id="sptxtTransferQty_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
            </td>
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
            FailToaster("Select from, To Warehouse option.");
            return;
        }
    });

    // Delegated event for dynamically added quantity inputs
    $('.itemsinformation tbody').on('change', 'input[id^="txtTransferQty_"]', function () {
        var rowId = $(this).attr('id').split('_')[1];
        validateTransferQtyForRow(rowId);
    });

    // Delete a row
    $(document).on("click", ".deleterow", function () {
        $(this).closest("tr").remove();
    });

    //Current Stock by Warehouse
    //$(document).on('change', '#ddlFromWarehouse', function () {
    //    $('.itemsinformation tbody tr').each(function () {
    //        let ddlItemInput = $(this).find('input[id^="ddlItem_"]');

    //        if (ddlItemInput.length > 0) {
    //            let rowId = ddlItemInput.attr('id').split('_')[1];
    //            let itemId = ddlItemInput.val();
    //            $(`#txtTransferQty_${rowId}`).val('');
    //            $(`#txtDefaultPrice_${rowId}`).val('');
    //            $(`#txtComment_${rowId}`).val('');

    //            if (itemId && parseInt(itemId) > 0) {
    //                FetchAvailQty(rowId, itemId);
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
var StockTransferTable;

function OnchangeStatus() {
    GetStockTransferList();
}

function BindddlFromWarehouse(selectValue) {
    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 77,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlFromWarehouse', obj1, 'Select', false, selectValue);
    
}
function BindddlToWarehouse(selectValue) {
    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 77,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
   
    LoadMasterDropdown('ddlToWarehouse', obj1, 'Select', false, selectValue);
}
function GetStockTranfserDetById(stockTransferId, statusId) {
    var model = {
        ID: stockTransferId
    };
    const jsonString = JSON.stringify(model);
    var ScreenID = "StockTransfer_101";
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var tableData = response.data.data.Table;
        var tableData1 = response.data.data.Table1;

        if (tableData && tableData.length > 0) {
            //ClearFormControl();
            $("#hdnStockId").val(tableData[0].ID);

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

            BindddlFromWarehouse(tableData[0].FromWarehouseId);
            BindddlToWarehouse(tableData[0].ToWarehouseId);

           // $("#ddlFromWarehouse").val(tableData[0].FromWarehouseId).trigger('change');
           // $("#ddlToWarehouse").val(tableData[0].ToWarehouseId).trigger('change');
            $("#txtSADocDate").val(tableData[0].SADocDate);
            $('#txtStockTransferComment').val(tableData[0].Comment);

            // Now populate the contact persons
            if (tableData1.length > 0) {
                PopulateStockDet(tableData1, statusId);
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

            $('#ddlSeries').prop('disabled', true);
            $('#ddlFromWarehouse').prop('disabled', true);
            $("#ddlToWarehouse").prop("disabled", true);

            // Open the modal
            $('#stocktransfer').modal('show');
            $('button[onclick="SaveStockTransferData(1)"]').text('Update');

            $("#customLoader").hide();

            toggleSADateField($("#hdnStockId").val());
        }

        else {
            console.error("Record not found..", error);
        }

    });
}

function PopulateStockDet(data, statusId) {
    // Call this function whenever you need to clear the table
    //clearTable();
    let tableBody = document.getElementById("tableToModify");

    data.forEach((item, index) => {
        if (index == 0) {
            $('#hdnStockDetId_0').val(item.ID);
            $('#ddlItem_0').val(item.ItemID);
            $('#ddlI_0').val(item.ItemCode);
            $('#lblItemName_0').text(item.ItemName);
            $('#lblItemDesc_0').text(item.ItemDecription);
            $('#lblUnit_0').text(item.UOM);
            $('#lblAvailQty_0').text(item.AvailQty);
            $('#txtTransferQty_0').val(item.TransferQty);
            $('#txtDefaultPrice_0').val(item.DefaultPrice);
            $('#txtComment_0').val(item.Comment);
        }
        else {

            let row = document.createElement("tr");

            row.innerHTML = `

            <td class="text-center">
                <div id="addrow" class="deleterow cursor-pointer"><img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" /></div>
                <input type="hidden" id="hdnStockDetId_${index}" value="${item.ID}"/>
            </td>
           <td>
                    <div class="autocomplete-wrapper" style="position: relative;">
                        <label for="ddlI_${index}" class="search-label">
                            <img src="../../../assets/images/icons/help/search-icon.png" class="icon-sm" />
                        </label>
                        <input type="text" class="form-control searchlist" id="ddlI_${index}" value="${item.ItemCode}"  oninput="Getdata(this)" placeholder="Type item..." autocomplete="off" />
                        <ul id="globalSuggestionBox_${index}" class="suggestions"></ul>                       
                       <input type="hidden" id="ddlItem_${index}" value="${item.ItemID}" />

                    </div>
                
            </td>
            <td id="lblItemName_${index}">${item.ItemName}</td>
            <td id="lblUnit_${index}">${item.UOM}</td>
            <td class="text-right"><label id="lblAvailQty_${index}">${item.AvailQty}</label></td>
            <td>
                <input type="text" id="txtTransferQty_${index}" class="form-control text-right MandateStockTransfer numeric-decimal-restrict" value="${item.TransferQty}" placeholder="0" oninput="HideErrorMessage(this)">
                <span id="sptxtTransferQty_${index}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
            </td>
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

function toggleSADateField(Id) {
    var container = document.getElementById('SADocDate');
    //if (Id > 0) {
    //    container.style.display = 'block'; // or 'flex' depending on layout
    //} else {
    //    container.style.display = 'none';
    //}

    container.style.display = 'none';
}
function GetSeriesDocNo() {
    if ($('#hdnStockId').val() == "0" || $('#hdnStockId').val() == "") {
        var Id = $("#ddlSeries").val() > 0 ? $("#ddlSeries").val() : 0
        var model =
            {
                ID: Id,
                OtherId: 0,
                ModuleId: 2
            };
            const jsonString = JSON.stringify(model);
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {

                if (Id === 0) {
                    var DOC_LOCK = false;
                    var tblSeries = response.data.data.Table;
                    var tblDoc = response.data.data.Table1;
                    $("#hdnSeriesId").val(tblSeries[0].ID);
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
    // Here get all item list

    //var model =
    //{
    //    ColumnName: 'Name',
    //    SearchData: ""
    //};
    //const jsonString = JSON.stringify(model);
    //CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_104' }, 'GET', function (response) {

    //    ItemCodeList = response.data.data.Table;

    //    //var $ele = $('#ddlItem_0');
    //    //$ele.empty();
    //    //$ele.append($('<option/>').val('Select').text('Select'));
    //    //$.each(ItemCodeList, function (ii, vall)
    //    //{
    //    //    var displayText = vall.ITEM_NAME + " (" + vall.ITEM_CODE + ")"; // Format: ITEM_NAME (ITEM_CODE)
    //    //    $ele.append($('<option />').val(vall.ITEM_ID).text(displayText));
    //    //})
    //});

    // Here get all item list by From Warehouse

    if (parseInt($("#ddlFromWarehouse").val()) > 0) {
        var model =
        {
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
            ItemId: 0,
            WarehouseId: $("#ddlFromWarehouse").val() > 0 ? $("#ddlFromWarehouse").val() : 0
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'StockStmtRpt_101' }, 'GET', function (response) {
            ItemCodeList = response.data.data.Table1;
        });
    }

}

//function FillItemDetails(ctrl) {

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
//            $('#' + 'lblAvailQty_' + ctrlId).text('100');

//        });
//    }
//}

function Getdata(inputElement) {
    if ((parseInt($("#ddlFromWarehouse").val())) > 0 && (parseInt($("#ddlToWarehouse").val())) > 0) {
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

                    // Hide error message on selection
                    $(`#spddlI_${rowId}`).hide();

                    // Now, when the item is clicked, the Item_ID is available as:
                    var selectedItemId = li.dataset.id; // Retrieve Item_ID here
                    /*console.log('Selected Item ID:', selectedItemId);*/

                    if (selectedItemId > 0) {
                        FetchAvailQty(rowId, selectedItemId);
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

        $('#ddlSeries').prop('disabled', true);
        $('#ddlToWarehouse').prop('disabled', true);
        $('#ddlFromWarehouse').prop('disabled', true);

       // validateUniqueItems();
    }
    else {
        FailToaster("Select from, To Warehouse option.");
        return;
    }
}
document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("searchlist")) {
        document.querySelectorAll(".suggestions").forEach(box => box.style.display = "none");
    }
});

function FetchAvailQty(rowId, itemId) {
    if (parseInt(itemId) > 0 && parseInt($("#ddlFromWarehouse").val()) > 0) {
        var model =
        {
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
            WarehouseId: $("#ddlFromWarehouse").val() > 0 ? $("#ddlFromWarehouse").val() : 0
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'StockStmtRpt_101' }, 'GET', function (response) {
            var tblItemStock = response.data.data.Table1;
            $(`#lblAvailQty_` + rowId).text(tblItemStock?.length > 0 ? parseFloat(tblItemStock[0].CQty).toFixed(2) : '0');

            // Recalculate final stock in case quantity was already entered
           /* validateTransferQtyForRow(rowId);*/
        });
    }
}

function validateTransferQtyForRow(rowId) {
    var availQty = parseFloat($('#lblAvailQty_' + rowId).text()) || 0;
    var transferQty = parseFloat($('#txtTransferQty_' + rowId).val()) || 0;

    if (transferQty <= 0) {
        FailToaster("Transfer Quantity must be greater than 0.");
        ClearStockDetRow(rowId);
        return;
    }

    if (transferQty > availQty) {
        // Show validation error
        FailToaster("Transfer Quantity cannot be greater than Avail Qty.");
        ClearStockDetRow(rowId);
        return;
    }
}

function ClearStockDetRow(rowId) {
    $('#txtTransferQty_' + rowId).val('');
    $('#txtDefaultPrice_' + rowId).val('');
    $('#txtComment_' + rowId).val('');
}
function getTableData() {

    let tableData = [];
    let invalidRows = [];
    let rows = document.querySelectorAll("#tableToModify tr"); // Select all rows

    rows.forEach((row, index) => {
        let itemId = row.querySelector("[id^='ddlItem']")?.value || 0;

        // Track invalid rows by row number (1-based index)
        if (parseInt(itemId) <= 0) {
            invalidRows.push(index + 1);
        }

        tableData.push({
            StockDetId: row.querySelector("[id^='hdnStockDetId']")?.value || 0,
            StockId: document.getElementById("hdnStockId").value,
            ItemId: itemId,
            AvailQty: parseFloat(row.querySelector("[id^='lblAvailQty']")?.textContent) || 0,
            TransferQty: parseFloat(row.querySelector("[id^='txtTransferQty']")?.value) || 0,
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
function SaveStockTransferData(proc) {
    if (checkValidationOnSubmit('MandateStockTransfer') == true) {

        if (!validateUniqueItems()) {
            return false;
        }

        var id = parseInt($("#hdnStockId").val());
        var stockDet = getTableData();

        // Check if there is at least one row
        if (!stockDet || stockDet.length === 0) {
            FailToaster("Please add at least one stock transfer detail before saving.");
            return false;
        }

        var model = {
            ID: id > 0 ? id : 0,
            SeriesId: $("#ddlSeries").val(),
            DocSeries: $("#ddlSeries option:selected").text(),
            DocNo: $("#txtDocNo").val(),
            FromWarehouseId: $("#ddlFromWarehouse").val() > 0 ? $("#ddlFromWarehouse").val() : 0,
            ToWarehouseId: $("#ddlToWarehouse").val() > 0 ? $("#ddlToWarehouse").val() : 0,
            StockComment: $("#txtStockTransferComment").val(),
            FinId: FinYearId,

            //Details record
            StockDetList: stockDet
        };
        // Convert the model to JSON string
        const jsonString = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "StockTransfer_101",
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
}
function PostStockRecords() {
    if (checkValidationOnSubmit('MandateStockTransfer') == true) {

        var Id = parseInt($("#hdnStockId").val());
        //var docDate = ChangeDateFormatToYYYYMMDDWithSlash($("#txtSADocDate").val());
        var dt = new Date();
        var newDate = ChangeDateFormatToddMMYYYWithSlace(dt); // double-check spelling here!
        var docDate = ChangeDateFormatToYYYYMMDDWithSlash(newDate);

        if (Id > 0) {
        // Only proceed if SaveManualStockAdjData returns true
        var isSaveSuccessful = SaveStockTransferData(2);     //For Post button
        if (!isSaveSuccessful) return;

        var model = {
            ID: Id,
            SADocDate: docDate,
            DocType: 'StockTransfer'
         };
            // Convert the model to JSON string
            const jsonString = JSON.stringify(model);
            // Assign the final data for submission
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
                    }, 3000); // 3000 milliseconds = 3 seconds
                }
            });
        }
    }
   
}
//#endregion

function validateWarehouses() {
    if ($('#hdnStockId').val() == "0" || $('#hdnStockId').val() == "") {
        var FromWarehouseId = $("#ddlFromWarehouse").val() > 0 ? $("#ddlFromWarehouse").val() : 0;
        var ToWarehouseId = $("#ddlToWarehouse").val() > 0 ? $("#ddlToWarehouse").val() : 0;
        if (FromWarehouseId > 0 && ToWarehouseId > 0 && FromWarehouseId === ToWarehouseId) {
            FailToaster("From Warehouse and To Warehouse cannot be the same.");
            $('#ddlToWarehouse').val('').trigger('change'); // Optional: clear ToWarehouse
            return false;
        }

        LoadItemDropdown();
        return true;
    }
    
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
    var url = "/MaterialManagement/Material/StockTransfer?auth=" + AuthToken;
    window.location.href = url;
}

function ClearFormControl() {
    $('#hdnStockId').val(0);
    $('#txtDocNo').val(0);
    $('#ddlFromWarehouse').val('Select').trigger('change');
    $('#ddlToWarehouse').val('Select').trigger('change');
    $('#txtStockTransferComment').val('');

     localStorage.removeItem('tableData');

    // Keep the first row as is and reset the other rows
    let tableBody = document.getElementById("tableToModify");

    // Select all rows except the first one
    let rows = tableBody.querySelectorAll("tr:not(:first-child)");

    // Remove each row
    rows.forEach(row => row.remove());
    $('#hdnStockDetId_0').val(0);
    $('#ddlI_0').val('');
    $('#lblItemName_0').text('');
    $('#lblUnit_0').text('');
    $('#lblAvailQty_0').text('');
    $('#txtTransferQty_0').val('');
    $('#txtDefaultPrice_0').val('');
    $('#txtComment_0').val('');

    $('#ddlSeries').prop('disabled', false);
    $('#ddlToWarehouse').prop('disabled', false);
    $('#ddlFromWarehouse').prop('disabled', false);

    $('#btnSave').show();
    $('#btnPost').hide();
    $('button[onclick="SaveStockTransferData(1)"]').text('Save');

    $('#stocktransfer').modal('hide');
   
    toggleSADateField(parseInt($("#hdnStockId").val()));

    GetSeriesDocNo();

    //On new entry display none all error text msz
    document.querySelectorAll('.field-validation-error').forEach(function (el) {
        el.style.display = 'none';
    });

    SetFormFreezeState(0);
}

function SetFormFreezeState(statusId) {
    const isFrozen = (statusId === 2);
    const $modal = $('#stocktransfer');

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


//#region : Stock Transfer Gried Data

//function GetStockTransferList() {
//    // Check if DataTable is already initialized, then destroy it
//    if ($.fn.DataTable.isDataTable("#tblStockTransferList")) {
//        $("#tblStockTransferList").DataTable().destroy();
//    }
//    StockTransferTable = $('#tblStockTransferList').DataTable({

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
//                screenId: 'StockTransfer_102',//Need to change the screen id as per your data
//                //modelData: jsonString,
//                modelData: JSON.stringify({
//                    Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
//                    FromWarehouseId: $("#ddlFromWarehouseList").val() === 'Select' ? '0' : $("#ddlFromWarehouseList").val(),
//                    ToWarehouseId: $("#ddlToWarehouseList").val() === 'Select' ? '0' : $("#ddlToWarehouseList").val(),
//                    DocNumber: $("#txtDocNumber").val()
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
//            $('#StockTransferList tbody').on('click', 'td span.badge', function () {
//                var row = $(this).closest('tr');
//                var rowData = $('#StockTransferList').DataTable().row(row).data();

//                // Check if the status is 'Pending' (StatusId == 1)
//                if (rowData.StatusId === 1) {
//                    // Set the ID to the hidden field in the modal
//                    $('#hdnStockId').val(rowData.ID);

//                    // Optionally, prepopulate other fields if needed
//                    //$('#txtDocNo').val(rowData.DocNo); // Set DocNo
//                    GetStockTranfserDetById(rowData.ID, rowData.StatusId);
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
//                "render": function (data, type, row) {
//                    return `<td><a href="javascript:void(0);" class="d-flex justify-content-between text-primary font-weight-bold" data-toggle="tooltip" title="${data}" onclick="GetStockTranfserDetById('${row.ID}', ${row.StatusId})">
//                        <strong>${data}</strong>
//                        <span><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span>
//                    </a></td>`;
//                }
//            },
//            { "data": "DocDate", "orderable": true, },
//            { "data": "FromWarehouse", "orderable": true },
//            { "data": "ToWarehouse", "orderable": true },
//            { "data": "NoOfItems" },
//            { "data": "Createdby", "orderable": true },
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

//    TableSetup(StockTransferTable);
//}


//AGgried Data

function bindStockTransferGridFilter() {

    let filterData = tableData;

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    var FromWarehouse = $("#ddlFromWarehouseList").val() === 'Select' ? '0' : $("#ddlFromWarehouseList").val();

    var ToWarehouse = $("#ddlToWarehouseList").val() === 'Select' ? '0' : $("#ddlToWarehouseList").val();

    if (Status != '0') {

        filterData = filterData.filter(row => row.StatusId == Status);

    }
    if (FromWarehouse != '0') {
        filterData = filterData.filter(row => row.FromWarehouseId == FromWarehouse);
    }
    if (ToWarehouse != '0') {
        filterData = filterData.filter(row => row.ToWarehouseId == ToWarehouse);
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindStockTransferAdjGrid();

    function bindStockTransferAdjGrid() {
        $("#customLoader").show();

        //Replaceable content
        //Start
        var requestData = {
            start: 0,
            length: 20000000,
            search: '',
            orderColumn: null,
            orderDir: "asc",
            screenId: 'StockTransfer_102',//Need to change the screen id as per your data
            //modelData: jsonString,
            modelData: JSON.stringify({
                Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
                FromWarehouseId: $("#ddlFromWarehouseList").val() === 'Select' ? '0' : $("#ddlFromWarehouseList").val(),
                ToWarehouseId: $("#ddlToWarehouseList").val() === 'Select' ? '0' : $("#ddlToWarehouseList").val(),
                DocNumber: $("#txtDocNumber").val()
            })
        };
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tableData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'StockTransferGried', columnMeta, tableData);
            $("#customLoader").hide();
        });
    }

});


//#endregion