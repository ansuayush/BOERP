$(document).ready(function () {
    ShowLoadingDialog();
    //LoadMasterDropdown('ddlSeries', {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 6,
    //    manualTableId: 0,
    //    ScreenId: "MaterialPurchase_101"
    //}, '', false);

    LoadItemDropdown();
    if ($('#hdnIndentId').val() == "0" || $('#hdnIndentId').val() == "" || isDuplicate == 1) {
        var model =
        {
            ID: 0,
            SupplierId: 0,
            ModuleId: 1
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {
            CloseLoadingDialog();
            var DOC_LOCK = false;
            var tblSeries = response.data.data.Table;
            var tblDoc = response.data.data.Table1;
            $('#txtDocNo').val(tblDoc[0].DocNumber);
            var dt = new Date();
            var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
            $('#txtDocDate').val(newDate);
            $('#pRaisedBy').text(loggedinUserName);
            $('#pRaisedDept').text(loggedinUserDept);

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

            if (DOC_LOCK == true) {
                $("#txtDocNo").prop("disabled", true);
            }
            else {
                $("#txtDocNo").prop("disabled", true);
            }
        });

    }
    if (isDuplicate == 1) {
        var model =
        {
            ID: $('#hdnIndentId').val()
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Indent_101' }, 'GET', function (response) {
            CloseLoadingDialog();
            if (isDuplicate != 1) {
                $('#txtDocNo').val(response.data.data.Table[0].DocNo);

                $("#txtDocNo").prop("disabled", true);
                var dt = new Date();
                var newDate = ChangeDateFormatToddMMYYYWithSlace(response.data.data.Table[0].DOCDate);
                $('#txtDocDate').val(newDate);
                $('#pIndentNumber').text("Edit " + response.data.data.Table[0].DocNo);
                $('#pRaisedBy').text(response.data.data.Table[0].Name);
                $('#pRaisedDept').text(response.data.data.Table[0].Department);
                $('#txtComments').val(response.data.data.Table[0].Comment);
                var tblSeries = response.data.data.Table3;
                var $ele = $('#ddlSeries');
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
                $("#ddlSeries").prop("disabled", true);
            }

            populateTable(response.data.data.Table1);
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

});

function SetDocNumber(ctrl) {
    var model =
    {
        ID: ctrl.value,
        SupplierId: 0,
        ModuleId: 1
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {

        var tblDoc = response.data.data.Table;
        $('#txtDocNo').val(tblDoc[0].DocNumber);
        if (tblDoc[0].DOC_LOCK == 1) {
            $("#txtDocNo").prop("disabled", true);
        }
        else {
            $("#txtDocNo").prop("disabled", true);
        }


    });
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
        //txtQuantity_
        //txtRemark_
        //txtExpectedDate_

    });
}
function getTableData() {
    let tableData = [];
    let rows = document.querySelectorAll("#tableToModify tr"); // Select all rows
    var i = 1;
    let hasError = false;

    rows.forEach((row, index) => {
        let eRPIndentDetID = row.querySelector("[id^='hdnIndentDetailId']")?.value || "";
        let itemID = row.querySelector("[id^='ddlItem']")?.value || "";
        let itemName = row.querySelector("[id^='lblItemName']")?.textContent || "";
        let itemDesc = row.querySelector("[id^='lblItemDesc']")?.textContent || "";
        let quantity = row.querySelector("[id^='txtQuantity']")?.value || "0";
        let expectedDate = row.querySelector("[id^='txtExpectedDate']")?.value || "";
        let remark = row.querySelector("[id^='txtRemark']")?.value || "";

        // Validate Item Name
        if (!itemName) {
            FailToaster(`Error: Item Name is blank in row ${index + 1}`);
            hasError = true;
            return;
        }

        // Validate Item Description
        if (!itemDesc) {
            FailToaster(`Error: Item Description is blank in row ${index + 1}`);
            hasError = true;
            return;
        }

        tableData.push({
            ERPIndentDetID: isDuplicate == 1 ? i++ : eRPIndentDetID,
            ERPIndentID: isDuplicate == 1 ? 0 : document.getElementById("hdnIndentId").value, // Getting IndentID
            ItemID: itemID,
            /*Quantity: parseInt(quantity, 10),*/
            Quantity: quantity,
            ExpectedBy: ChangeDateFormatSecond(expectedDate),
            Comment: remark
        });
    });

    if (hasError) {
        return false;
    }

    console.log(tableData); // Debugging
    return tableData;
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


async function SaveIndentData() {
    var dateValidation = checkValidationDate('MandateDate');
    var d = checkValidationIfZero('MandateWithoutZero');
    if (checkValidationOnSubmit('Mandate') == true && d == true && dateValidation == true) {
        var indentDetails = getTableData();

        if (!indentDetails) {
            return; // Prevent submission
        }

        if (hasDuplicateItemIds(indentDetails)) {
            FailToaster("Duplicate Item found in the list!");
            return;
        }


        //   var filteredIndentDetails = indentDetails.filter(input => input.ItemID == )

        var obj =
        {
            FolderNames: "IndentDocuments/"
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

        var indentModel =
        {
            DOCTYPE_ID: $('#ddlSeries').val(),
            ERPIndentID: isDuplicate == 1 ? 0 : $('#hdnIndentId').val(),
            Comment: $('#txtComments').val(),
            Fin_Id: FinYearId,
            Name: $('#pRaisedBy').text() == "" ? "NA" : $('#pRaisedBy').text(),
            Department: $('#pRaisedDept').text() == "" ? "NA" : $('#pRaisedDept').text(),
            ERPIndentAttachment: fileData,
            ERPIndentDet: indentDetails
        }
        // Convert the model to JSON string
        const jsonString = JSON.stringify(indentModel);

        $('#btnSaveIndent').prop('disabled', true);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "Indent_100",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            RedirectPOList();
            $('#btnSaveIndent').prop('disabled', false);
        });


    }
}
function RedirectPOList() {
    var url = "/MaterialManagement/Material/IndentIndex?auth=" + AuthToken
    window.location.href = url;
}
function clearTable() {
    let tableBody = document.getElementById("tableToModify");

    // Select all rows except the first one
    let rows = tableBody.querySelectorAll("tr:not(:first-child)");

    // Remove each row
    rows.forEach(row => row.remove());
}


// Function to Populate Table from JSON
function populateTable(data) {
    // Call this function whenever you need to clear the table
    //clearTable();
    let tableBody = document.getElementById("tableToModify");

    data.forEach((item, index) => {
        if (index == 0) {
            $('#hdnIndentDetailId_0').val(item.ID);
            $('#ddlItem_0').val(item.ItemID);
            $('#lblItemName_0').text(item.ItemName);
            $('#lblItemDesc_0').text(item.ItemDecription);
            $('#ddlI_0').val(item.ItemCode);
            $('#txtQuantity_0').val(item.Qty);
            $('#txtExpectedDate_0').val(ChangeDateFormatToddMMYYYWithSlace(item.ExpectedDate));
            $('#txtRemark_0').val(item.Remark);
            $('#lblUnit_0').text(item.UOM);

        }
        else {

            let row = document.createElement("tr");

            row.innerHTML = `
            <td class="text-center">
                <div class="deleterow cursor-pointer addrow"> <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" /></div>
                <input type="hidden" id="hdnIndentDetailId_${index}" value="${item.ID}" />
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
            <td><label class="lblItemName" id="lblItemName_${index}">${item.ItemName}</label></td>
            <td><label class="lblItemName" id="lblItemDesc_${index}">${item.ItemDecription}</label></td>
            <td>
                <input type="number" step="0.01"  id="txtQuantity_${index}" class="form-control text-right Mandate" value="${item.Qty}" placeholder="0" onchange="HideErrorMessage(this);" oninput="SetZero(this)">
                <span id="sptxtQuantity_${index}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
            </td>
            <td class="text-center"><label class="lblItemName" id="lblUnit_${index}">${item.UOM}</label></td>
            <td>
                <div class="input-group">
                    <input type="text" id="txtExpectedDate_${index}" class="datepicker form-control " value="${ChangeDateFormatToddMMYYYWithSlace(item.ExpectedDate)}" placeholder="DD/MM/YYYY" readonly onchange="HideErrorMessage(this)">
                    <div class="input-group-append">
                        <span class="input-group-text bg-white"><img src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span>
                    </div>
                    <span id="sptxtExpectedDate_${index}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                </div>
            </td>
            <td>
                <textarea maxlength="250" id="txtRemark_${index}" placeholder="Enter Text" class="form-control" onchange="HideErrorMessage(this)">${item.Remark}</textarea>
                <span id="sptxtRemark_${index}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
            </td>
        `;

            tableBody.appendChild(row);


        }

    });

}

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
document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("searchlist")) {
        document.querySelectorAll(".suggestions").forEach(box => box.style.display = "none");
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
    document.getElementById("documentImages").appendChild(newDocument);
}
