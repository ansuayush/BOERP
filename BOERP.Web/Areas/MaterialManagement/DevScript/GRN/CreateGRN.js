$(document).ready(function () {
    LoadItemDropdown();
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



    });


    if ($('#hdnPoId').val() == "0" || $('#hdnPoId').val() == "") {
        var model =
        {
            ID: 0,
            SupplierId: $('#hdnSuppId').val(),
            ModuleId: 3,
            GRNID: 0,
            CompanyId: CompId,
            ISDDChange: 0
        };

        if ($('#hdnGateEntry').val() > 0) {
            BindGateEntry($('#hdnGateEntry').val());
        }
        else {
            BindGateEntry('');
        }
        BindIndend('', $('#hdnSuppId').val());
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {

            console.log(response);

            var DOC_LOCK = false;
            var tblDoc = response.data.data.Table;
            var tblSeries = response.data.data.Table1;
            var tblSupp = response.data.data.Table2;
            var tblSales = response.data.data.Table3;
            WareHouseList = response.data.data.Table4;

            IsIGST = tblSupp[0].IsSameCompanyLocation;
            var dt = new Date();
            var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
            $('#txtDocumentDate').val(newDate);
            $('#txtDocumentNumber').val(tblDoc[0].DocNumber)

            $('#lblReqName').text(loggedinUserName);
            $('#lblReqDept').text(loggedinUserDept);

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
                $("#txtDocumentNumber").prop("disabled", true);
            }
            else {
                $("#txtDocumentNumber").prop("disabled", true);
            }


            //Bind supplier Details
            //txtSupName
            //ddlSalesPerson
            //lblSuppAdd
            //lblSuppGST
            $("#txtSupName").val(tblSupp[0].PA_NAME);
            $("#lblSuppAdd").text(tblSupp[0].BILL_ADD1);
            $('#lblSuppAdd').append(
                generateAddressHtml(tblSupp[0].BILL_ADD2, tblSupp[0].BillCity, tblSupp[0].BStateCountryPin)
            );
            $("#lblSuppGST").text(tblSupp[0].GST);


        });

    }
    else {
        var model =
        {
            GRNID: $('#hdnPoId').val(),
            SupId: $('#hdnSuppId').val(),
            CompanyId: CompId,
            ISDDChange: 0
        };
        var DOC_LOCK = false;
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'GRNEntry_101' }, 'GET', function (response) {
            var tblDoc = response.data.data.Table;
            var tblItem = response.data.data.Table1;
            var tblOtherCharges = response.data.data.Table3;
            var tblSeries = response.data.data.Table4;
            OtherChargesArray = tblOtherCharges;
            WareHouseList = response.data.data.Table5;
            var tblIndent = response.data.data.Table6;
            var newDate = ChangeDateFormatToddMMYYYWithSlace(tblDoc[0].DOCDate);

            $('#lblReqName').text(tblDoc[0].USER_NAME);
            $('#lblReqDept').text(tblDoc[0].Department == null ? '' : tblDoc[0].Department);

            IsIGST = response.data.data.Table7.length > 0 ? response.data.data.Table7[0].IsIGST : 0;

            $('#txtDocumentNumber').val(tblDoc[0].DocNumber)
            $('#txtDocumentDate').val(newDate);

            //$('#ddlGateEntryNumber').val(tblDoc[0].GateEntryId).trigger('change');
            BindGateEntry(tblDoc[0].GateEntryId);
            $("#txtSupName").val(tblDoc[0].PA_NAME);
            $("#lblSuppAdd").text(tblDoc[0].BILL_ADD1);
            $('#lblSuppAdd').append(
                generateAddressHtml(tblDoc[0].BILL_ADD2, tblDoc[0].BillCity, tblDoc[0].BStateCountryPin)
            );
            $("#lblSuppGST").text(tblDoc[0].GST);
            $("#lblBuyerName").text(tblDoc[0].GST);
            $('#lblReqName').text(tblDoc[0].BuyersName);
            $('#lblReqDept').text(tblDoc[0].BuyresDepartment);
            $('#txtComments').val(tblDoc[0].Comments);
            $('#hdnSuppId').val(tblDoc[0].SupplierId);
            $('#roundingAmountInput').val(tblDoc[0].RoundAmount);
            $('#otherChargesInputData').text(tblDoc[0].Other_Charges);


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
            if (tblDoc[0].PoIDs && tblDoc[0].PoIDs.length > 0) {
                let indArray = tblDoc[0].PoIDs.split(',').map(x => x.trim());
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
                if (vall.ID == response.data.data.Table[0].Docseries) {
                    $option.attr("selected", "selected");
                    if (vall.DOC_LOCK == 1) {
                        DOC_LOCK = true;
                    }
                }

                $ele.append($option);

            })
            $("#ddlDocSeries").prop("disabled", true);

            $("#txtDocumentNumber").prop("disabled", true);

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

    $('#ddlGateEntryNumber').on('change', function () {
        ChangeGetEntrySeries($('#ddlGateEntryNumber').val());
    });


});


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
function BindGateEntry(selectedValue) {
    var obj1 = {
        parentId: $('#hdnSuppId').val(),
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 2,
        manualTableId: $('#hdnPoId').val(),
        ScreenId: 'GRNEntry_101'
    }
    LoadMasterDropdown('ddlGateEntryNumber', obj1, 'Select', false, selectedValue);
}

function ChangeGetEntrySeries(id) {

    if (id > 0) {
        $("#viewGateEntryDoc").show();


      

        var model =
        {
            ID: id
        };
        const jsonString = JSON.stringify(model);
       //  var ele = ``

        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'GetEntry_102' }, 'GET', function (response) {

            //if (response.data.data.Table4.length > 0) {
            //   // $('#viewGateEntry').show();

            //   /* $('#GateEntryUpload').html('');*/
            //}
            console.log(response);
            for (var i = 0; i < response.data.data.Table4.length; i++) {
                var fileName = response.data.data.Table4[i].ActualFileName;
                var fileType = response.data.data.Table4[i].FileType;
                var type = response.data.data.Table4[i].Type;
                var fileUrl = response.data.data.Table4[i].FileUrl;
                var fFd = response.data.data.Table4[i].AttachmentId;
                var fSize = response.data.data.Table4[i].FileSize;
                var newfileName = response.data.data.Table4[i].NewFileName;
                var attachmentType = response.data.data.Table4[i].AttachmentType;




                var attachmentInt = 3;



               // LoadFileDataDownloadGateEntry(fileName, fileType, type, fileUrl, fFd, fSize, newfileName, 'Upload3');

                if (attachmentType == 'Upload3') {

                    LoadFileDataDownload(fileName, fileType, type, fileUrl, fFd, fSize, newfileName, 'Upload3');
                }


            }
        });
    }
    else {
        $("#viewGateEntryDoc").hide();
    }

}

function LoadFileDataDownloadGateEntry(fileName, fileType, type, fileUrl, fFd, sSize, newfileName, gateType) {

   
     var ele = `<li id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadIndentFile(this)" ><img src="../../assets/images/icons/help/document-attachment-icon.png" alt="" class="icon-md" /></li>`;

    $('#GateEntryUpload').append(ele);
   

}

function LoadFileDataDownload(fileName, fileType, type, fileUrl, fFd, sSize, newfileName, gateType) {

    console.log(gateType);
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
    newDocument.classList.add("document-file1");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    if (gateType == 'Upload1') {
        document.getElementById("documentImagesMP").appendChild(newDocument);

        $('#NoUploadFile1').hide();
        $('#ShowUploadFile1').show();
    }
    else if (gateType == 'Upload2') {
        document.getElementById("documentImagesMCU").appendChild(newDocument);

        $('#NoUploadFile2').hide();
        $('#ShowUploadFile2').show();
    }
    else {
        document.getElementById("documentImagesAtt").appendChild(newDocument);

        $('#NoUploadFile3').hide();
        $('#ShowUploadFile3').show();
    }
}


function BindIndend(data, sppId) {
    CommonAjaxMethod(virtualPath + 'Generic/GetDropDownWithAsync/', {
        parentId: sppId,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 14,
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
        if ($ele.data('multiselect')) {
            $ele.multiselect('destroy');
        }
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

var WareHouseList = [];
function LoadPODropdown(sppId) {
    LoadMasterDropdown('ddlIndent', {
        parentId: sppId,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 14,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, '', false);
}
function ChangeGateEntryNumber() {
    var gateEntryId = $('#ddlGateEntryNumber').val();
    if (gateEntryId == 'Select') {
        gateEntryId = 0;
    }
    var model =
    {
        ID: gateEntryId
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'GetEntry_102' }, 'GET', function (response) {

        if (response.data.data.Table2.length > 0) {

            $('#txtInvoiceNumber').val(response.data.data.Table2[0].InvoiceNumber);
            $('#txtInvoiceDate').val(ChangeDateFormatToddMMYYYWithSlace(response.data.data.Table2[0].InvoiceDate));
            $('#txtGateEntryDate').val(ChangeDateFormatToddMMYYYWithSlace(response.data.data.Table2[0].CreatedDate));
            $('#txtTransporterName').val(response.data.data.Table2[0].TransporteName);
        }

    });
}
function SetDocNumber(ctrl) {
    var model =
    {
        ID: ctrl.value,
        SupplierId: 0,
        ModuleId: 3
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {
        var tblDoc = response.data.data.Table;
        $('#txtDocumentNumber').val(tblDoc[0].DocNumber);
        if (tblDoc[0].DOC_LOCK == 1) {
            $("#txtDocumentNumber").prop("disabled", true);
        }
        else {
            $("#txtDocumentNumber").prop("disabled", true);
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

var IsCgst = 0;


function FillItemData(tblDoc) {
    items = [];
    tblDoc.forEach(doc => {
        items.push(doc);
    });
    console.log("Items");
    console.log(items);

    // IsCgst = items[0]

    addRowsToTable();
    updateGrandTotal();
}

function FillGrid(ctr) {
    var data = $('#' + ctr.id).val().join();
    var model =
    {
        POIds: data,
        GRNID: $('#hdnPoId').val(),
        SupId: $('#hdnSuppId').val(),
        CompanyId: CompId,
        ISDDChange: 1
    };


    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'GRNEntry_101' }, 'GET', function (response) {
        var tblDoc = response.data.data.Table;
        items = [];
        tblDoc.forEach(doc => {
            items.push(doc);
        });
        console.log(items);
        addRowsToTable();
        updateGrandTotal();
    });
}


$(document).on("click", ".deleterow", function () {

    let row = $(this).closest("tr");

    let poNo = row.find("td:eq(1)").text().trim();   // IndentNo
    let itemCode = row.find("td:eq(2)").text().trim();   // ItemCode

    // Remove item from items array
    items = items.filter(item => !(item.PONo === poNo && item.ItemCode === itemCode));

    // Remove row from DOM
    row.remove();

    // Recalculate totals
    updateGrandTotal();

    //$(this).closest("tr").remove();
    //updateGrandTotal();
});
$(document).on("click", ".deleterowExtra", function () {
    let row = $(this).closest("tr");
    let chargeId = row.find(".ddlChargeName").val().trim(); // Assuming Charge_Id is unique

    // Remove from OtherChargesArray
    OtherChargesArray = OtherChargesArray.filter(item => item.Charge_Id !== chargeId);

    // Remove row from DOM
    row.remove();

    // Optional: update total if needed after deletion
    let totalNetAmountSum = OtherChargesArray.reduce((sum, item) => sum + item.TotalNetAmount, 0);
    $('#otherChargesInputData').text(totalNetAmountSum.toFixed(2));

});



async function SavePurchaseOrder() {
    var isValidQuantity = true;
    if (checkValidationOnSubmit('Mandate') == true) {
        //var data = $('#ddlIndent').val().join();

        let distinctPONos = [...new Set(items.map(item => item.PONo))];

        // 2. Find matching <option> values (ids) from ddlIndent
        let selectedValues = [];
        $('#ddlIndent option').each(function () {
            if (distinctPONos.includes($(this).text().trim())) {
                selectedValues.push($(this).val()); // collect the value (id)
            }
        });

        var data = selectedValues.join(',');

        var obj =
        {
            FolderNames: "GRNDocuments/"
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
            FailToaster("You cannot upload more than 10 files for GRN.");
            return;
        }

        let tableRows = document.querySelectorAll("#tblItemInformation tbody tr");
        let purchaseOrderItems = [];

        tableRows.forEach(row =>
        {
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
                ItemDescription: row.cells[4].innerText.trim(),
                HSN: row.cells[5].innerText.trim(),
                Quantity: parseFloat(row.cells[6].innerText.trim()) || 0,
                QtyReceived: parseFloat(row.cells[7].querySelector("input").value.trim()) || 0,
                TOLERANCErow: row.querySelector(".spTOLERANCE").innerText.trim(),
                Damage: parseFloat(row.cells[8].querySelector("input").value.trim()) || 0,
                Short: parseFloat(row.cells[9].querySelector("input").value.trim()) || 0,
                UoM: row.cells[10].innerText.trim(),
                UnitPrice: parseFloat(row.cells[11].querySelector("input").value.trim()) || 0,
                AmountBeforeDiscount: parseFloat(row.cells[12].innerText.trim()) || 0,
                DiscountPercentage: parseFloat(row.cells[13].querySelector("input").value.trim()) || 0,
                AmountAfterDiscount: parseFloat(row.cells[14].innerText.trim()) || 0,
                IGSTPercentage: parseFloat(row.cells[15].querySelector("select").value.trim()) || 0,
                IGSTAmount: parseFloat(row.cells[16].innerText.trim()) || 0,
                CGSTPercentage: parseFloat(row.cells[17].querySelector("select").value.trim()) || 0,
                CGSTAmount: parseFloat(row.cells[18].innerText.trim()) || 0,
                SGSTPercentage: parseFloat(row.cells[19].querySelector("select").value.trim()) || 0,
                SGSTAmount: parseFloat(row.cells[20].innerText.trim()) || 0,
                TotalCost: parseFloat(row.cells[21].innerText.trim()) || 0,
                Batch: row.cells[22].querySelector("input").value.trim(),
                ExpDate: ChangeDateFormatSecond(row.cells[24].querySelector("input").value.trim()),
                MFGDate: ChangeDateFormatSecond(row.cells[23].querySelector("input").value.trim()),
                WarehouseID: row.cells[25].querySelector("select").value,
                Igst_TAXID: igstPercentageId,
                Cgst_TAXID: cgstPercentageId,
                Sgst_TAXID: sgstPercentageId
            };


            if (item.QtyReceived > parseFloat(item.TOLERANCErow)) {
                FailToaster("Received quantity cannot be greater than ordered quantity.");
                row.cells[7].querySelector("input").focus();
                isValidQuantity = false;
            }
            else if (item.QtyReceived <= 0) {
                FailToaster("Received quantity cannot be smaller or equal to 0.");
                row.cells[7].querySelector("input").focus();
                isValidQuantity = false;
            }

            purchaseOrderItems.push(item);
        });
        if (isValidQuantity) {
            var model = {
                "ID": $('#hdnPoId').val(),
                "DOCTYPE_ID": parseInt($('#ddlDocSeries').val()),                      // int
                "PoIDs": data,                                     // varchar(500)
                "SupplierId": parseInt($('#hdnSuppId').val()),                         // int
                "AddressofSupplier": $("#lblSuppAdd").text(),
                "GSTIN": $("#lblSuppGST").text(),                                     // nvarchar(max)
                "BuyerId": $("#lblBuyerName").text(),                                     // varchar(100)
                "Comments": $("#txtComments").val(),                                  // nvarchar(max)
                "GateEntryId": parseInt($('#ddlGateEntryNumber').val()),                    // int
                "TotalAmount": parseFloat($('#grandTotal').text().replace(/₹/g, '').trim()),              // decimal(18,2)
                "Total_Before_Tax": parseFloat($('#totalBeforeTax').text().replace(/₹/g, '').trim()),     // decimal(18,2)
                "Total_After_Tax": parseFloat($('#totalAfterTax').text().replace(/₹/g, '').trim()),       // decimal(18,2)
                "Other_Charges": parseFloat($('.otherChargesInput').text().replace(/₹/g, '').trim()),     // decimal(18,2)
                "IGST": parseFloat($('#igstTotal').text().replace(/₹/g, '').trim()),                       // decimal(18,2)
                "CGST": parseFloat($('#cgstTotal').text().replace(/₹/g, '').trim()),                       // decimal(18,2)
                "SGST": parseFloat($('#sgstTotal').text().replace(/₹/g, '').trim()),                       // decimal(18,2)
                "TotalTax": parseFloat($('#totalTax').text().replace(/₹/g, '').trim()),                    // decimal(18,2)
                "RoundAmount": parseFloat($('#roundingAmountInput').val()) || 0,                                // decimal(18,2)
                "FinID": FinYearId,                                                                        // int
                "InvoiceDate": $('#invoiceDate').val(),                                                     // datetime (e.g., "2025-04-04" or "2025-04-04T00:00:00")
                "PurchaseOrderItems": purchaseOrderItems,
                "Attachments": fileData,
                "PurchaseOrdersOtherCharges": OtherChargesArray

            };

            const jsonString = JSON.stringify(model);
            // Assign the final data for submission
            let GenericModeldata = {
                ScreenID: "GRNEntry_101",
                Operation: "A",  // Use Update for existing records, Add for new ones
                ModelData: jsonString
            };
            if (purchaseOrderItems.length > 0) {
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                    if (response.ValidationInput != 0) {
                   
                            RedirectGRN();
                      

                    }
                });
            }
            else {
                FailToaster("Atleast one line item should be available.");
            }
        }
    }
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
function RedirectGRN() {

    var url = "/MaterialManagement/Material/Grn?auth=" + AuthToken;
    window.location.href = url;
}

var itemRowIdex = 0;
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

        var isEditable = false;
        if (!existingRow) { // Add new row if not found
            itemRowIdex = itemRowIdex + 1;
            if (item.BATCH_APPLICABLE == 1) {
                isEditable = true;
            }
            let row = document.createElement("tr");
            row.innerHTML = `<td class="text-center"><span style="display:none;"  class="IndentItemId">${item.GRNItemId}</span><span style="display:none;"  class="ItemID">${item.ItemID}</span><span style="display:none;"  class="POItemId">${item.POItemId}</span><div class="deleterow cursor-pointer"><img src="../../assets/images/icons/help/close.svg" alt="Remove"></div></td>
                    <td>${item.PONo}</td>     
                    <td>${item.ItemCode}</td>          
                    <td>${item.ItemName}</td>
                    <td>${item.ItemDescription}</td>
                    <td>${item.HSN}</td>  
                    <td>${item.Quantity}</td>        
                    <td><span style="display:none;"  class="spTOLERANCE">${item.TOLERANCE}</span><input type="number" placeholder="0"  min="0"  step="0.01"  class="quantityR form-control text-right" value="${item.QtyReceived == 0 ? `` : item.QtyReceived}" oninput="SetZero(this)" onchange="SetZeroQ(this)"></td>
                    <td><input type="number" placeholder="0"    step="0.01"  class="quantityD form-control text-right" value="${item.QtyDamage == 0 ? `` : item.QtyDamage}" oninput="SetZero(this)" onchange="SetZeroQ(this)"></td>
                    <td><input type="number" placeholder="0"    step="0.01"  class="quantityS form-control text-right" value="${item.QtyShort == 0 ? `` : item.QtyShort}" oninput="SetZero(this)"  onchange="SetZeroQ(this)"></td>
                    <td>${item.UoM}</td>
                    <td><input   type="number" placeholder="0" class="unit-price form-control text-right" value="${item.UnitPrice == 0 ? `` : item.UnitPrice}" oninput="SetZero(this)" disabled></td>
                    <td class="amount-before-discount text-right">${item.AmountBeforeDiscount}</td>
                    <td><input  placeholder="0" type="number" class="discount form-control text-right" value="${item.DiscountPercentage == 0 ? `` : item.DiscountPercentage}"  oninput="SetZero(this);validateDiscount(this)"></td>
                    <td class="amount-after-discount text-right">${item.AmountAfterDiscount}</td>
                  <td>
                      <select ${IgstControl} class="form-control applyselect  IGSTPercentage"  tabindex="-1" aria-hidden="true" id="ddlIGSTPercentage_${itemRowIdex}">
                      </select>                        
                   </td>
                    <td class="igst-amount text-right">${item.IGSTAmount}</td>
                     <td>
                      <select ${stControl} class="form-control applyselect CGSTPercentage"  tabindex="-1" aria-hidden="true" id="ddlCGSTPercentage_${itemRowIdex}">
                      </select>                        
                   </td>
                    <td class="cgst-amount text-right">${item.CGSTAmount}</td>
                     <td>
                      <select ${stControl} class="form-control applyselect  SGSTPercentage"  tabindex="-1" aria-hidden="true" id="ddlSGSTPercentage_${itemRowIdex}">
                      </select>                        
                   </td>

                    <td class="sgst-amount text-right">${item.SGSTAmount}</td>
                    <td class="total-cost text-right">${item.TotalCost}</td>
                    <td> <input ${isEditable ? "" : "disabled"} id="txtBatch_${itemRowIdex}" type="text" class="form-control ${isEditable ? "Mandate" : ""}" oninput="HideErrorMessage(this); alphanumeric(this)" value="${item.BatchOrLot}" >
                    <span id="sptxtBatch_${itemRowIdex}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span></td>
                        
                     <td>
                        <div class="input-group">
                            <input type="text" ${isEditable ? "" : "disabled"} class="datepicker form-control ${isEditable ? "Mandate" : ""}" id="MFGDate_${itemRowIdex}"   value="${ChangeDateFormatToddMMYYYWithSlace(item.MFGDate)}" onblur="HideErrorMessage(this)" placeholder="DD/MM/YYYY" readonly >
                            <div class="input-group-append">
                                <span class="input-group-text bg-white ${isEditable ? "" : "disabled-calendar"}"><img  src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span>
                            </div>
                            <span id="spMFGDate_${itemRowIdex}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                        </div>
                    </td>

                    <td>  
                        <div class="input-group">
                            <input type="text" ${isEditable ? "" : "disabled"} id="ExpDate_${itemRowIdex}" class="datepicker form-control ${isEditable ? "Mandate" : ""}" value="${ChangeDateFormatToddMMYYYWithSlace(item.ExpDate)}" onblur="HideErrorMessage(this)" placeholder="DD/MM/YYYY" readonly >
                            <div class="input-group-append" >
                                <span  class="input-group-text bg-white ${isEditable ? "" : "disabled-calendar"}"><img ${isEditable ? "" : "disabled"} src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span>
                            </div>
                            <span id="spExpDate_${itemRowIdex}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                        </div>
                     </td>
                
                    <td>
                      <select class="form-control applyselect select2-hidden-accessible Mandate" disabled tabindex="-1" aria-hidden="true" id="ddlWarehouse_${itemRowIdex}">
                      </select> 
                        <span id="spddlWarehouse_${itemRowIdex}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                   </td>
                `;

            tbody.appendChild(row);

            var $ele = $('#ddlWarehouse_' + itemRowIdex); // Now this will work
            $ele.empty();
            $ele.append($('<option/>').val('Select').text('Select'));
            $.each(WareHouseList, function (ii, vall) {
                $ele.append($('<option />').val(vall.WarehouseID).text(vall.WarehouseName));
            });

            const setWarehouse = WareHouseList.filter(input => input.UniqueID == 'QR001')

            if (item.WarehouseID != "") {
                $ele.val(item.WarehouseID);
            }
            if (setWarehouse[0].WarehouseID != "" || setWarehouse[0].WarehouseID != null) {
                $ele.val(setWarehouse[0].WarehouseID).trigger('change');
            }
            $ele.select2();


            IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 116);

            var $ele3 = $('#ddlIGSTPercentage_' + itemRowIdex); // Now this will work
            $ele3.empty();
            if (item.IGSTPercentage == 0) {
                $ele3.append($('<option dataEle="0" />').val('0').text('0'));
            }
            else {
                $.each(IGSTTaxList, function (ii, vall) {
                    $ele3.append($('<option dataEle=' + vall.ID + ' />').val(vall.ValueCode).text(vall.ValueName));
                })
            }
            $ele3.val(item.IGSTPercentage);


            IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 137);


            var $ele1 = $('#ddlCGSTPercentage_' + itemRowIdex); // Now this will work
            $ele1.empty();
            if (item.CGSTPercentage == 0) {
                $ele1.append($('<option dataEle="0" />').val('0').text('0'));
            }
            else {
                $.each(IGSTTaxList, function (ii, vall) {
                    $ele1.append($('<option dataEle=' + vall.ID + ' />').val(vall.ValueCode).text(vall.ValueName));
                })
            }
            $ele1.val(item.CGSTPercentage);

            IGSTTaxList = TaxList.filter(input => input.TYPE_ID == 158);

            var $ele2 = $('#ddlSGSTPercentage_' + itemRowIdex); // Now this will work
            $ele2.empty();
            if (item.SGSTPercentage == 0) {
                $ele2.append($('<option dataEle="0" />').val('0').text('0'));
            }
            else {
                $.each(IGSTTaxList, function (ii, vall) {
                    $ele2.append($('<option dataEle=' + vall.ID + ' />').val(vall.ValueCode).text(vall.ValueName));
                })
            }
            $ele2.val(item.SGSTPercentage);

        }
    });


    datechange(); // Ensure datepicker remains initialized

}

function alphanumeric(ctrl) {
    // Allow only alphanumeric, * and /
    ctrl.value = ctrl.value.replace(/[^a-zA-Z0-9]/g, '');
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
    let quantityInput = row.querySelector(".quantityR");
    //let quantityInputD = row.querySelector(".quantityD");
    //let quantityInputS = row.querySelector(".quantityS");
    let unitPriceInput = row.querySelector(".unit-price");
    let discountInput = row.querySelector(".discount");

    //let quantityD = parseFloat(quantityInputD.value) || 0;
    //let quantityS = parseFloat(quantityInputS.value) || 0;

    let amountBeforeDiscountCell = row.querySelector(".amount-before-discount");
    let amountAfterDiscountCell = row.querySelector(".amount-after-discount");
    let igstAmountCell = row.querySelector(".igst-amount");
    let cgstAmountCell = row.querySelector(".cgst-amount");
    let sgstAmountCell = row.querySelector(".sgst-amount");
    let totalCostCell = row.querySelector(".total-cost");

    // Get values
    let quantity = parseFloat(quantityInput.value) || 0;
    // quantity = quantity - (quantityD + quantityS);
    let unitPrice = parseFloat(unitPriceInput.value) || 0;
    let discountPercentage = parseFloat(discountInput.value) || 0;

    let igstPercentage = parseFloat(row.querySelector(".IGSTPercentage").value) || 0;
    let cgstPercentage = parseFloat(row.querySelector(".CGSTPercentage").value) || 0;
    let sgstPercentage = parseFloat(row.querySelector(".SGSTPercentage").value) || 0;

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
    if (
        event.target.classList.contains("quantityR") ||
        event.target.classList.contains("unit-price") ||
        event.target.classList.contains("discount") ||
        event.target.classList.contains("IGSTPercentage") ||
        event.target.classList.contains("CGSTPercentage") ||
        event.target.classList.contains("SGSTPercentage")
    ) {
        let row = event.target.closest("tr");
        if (classList.contains("CGSTPercentage")) {
            console.log("Triggered by CGSTPercentage");
            row.querySelector(".SGSTPercentage").value = row.querySelector(".CGSTPercentage").value;
        } else if (classList.contains("SGSTPercentage")) {
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
                IGSTTaxList = TaxList.filter(input => input.FIELD_NAME == 'IGST')
                $ddlTax.empty();
                $ddlTax.append($('<option/>').val('Select').text('Select'));
                $.each(IGSTTaxList, function (ii, vall) {
                    $ddlTax.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
                })
            }
            if (element.id == "ddlCTax_0") {

                var $ddlTax = $('#ddlCTax_0');
                IGSTTaxList = TaxList.filter(input => input.FIELD_NAME == 'CGST')
                $ddlTax.empty();
                $ddlTax.append($('<option/>').val('Select').text('Select'));
                $.each(IGSTTaxList, function (ii, vall) {
                    $ddlTax.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));
                })
            }
            if (element.id == "ddlSTax_0") {

                var $ddlTax = $('#ddlSTax_0');
                IGSTTaxList = TaxList.filter(input => input.FIELD_NAME == 'SGST')
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
                         <span style="display:none;" id="hdnOtherChargeId_${RowId}" class="hdnOtherChargeId"${item.ID}</span>
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
                     <input placeholder="0" type="text" value="${item.TotalTax}" id="txtTax_${RowId}" class="form-control text-right TaxAmount" fdprocessedid="5nb56" disabled>
                    </td>
				
				<td class="text-right"><span class="TotalOtherChargeAmount"  id="spTotalOtherCharge_${RowId}">${item.TotalNetAmount}</span></td>
            </tr>`;
            //  tableBody.innerHTML += newRow;
            // Append new row
            $(".othercharnge tbody").append(newRow);

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

            var $ddlChargeR = $('#ddlCharge_' + RowId);
            $ddlChargeR.empty();
            $ddlChargeR.append($('<option/>').val('Select').text('Select'));
            $.each(ChargeList, function (ii, vall) {
                $ddlChargeR.append($('<option />').val(vall.ID).text(vall.ValueName));
            })
            $ddlChargeR.val(item.Charge_Id);

            IGSTTaxList = TaxList.filter(input => input.FIELD_NAME == 'IGST')
            CGSTTaxList = TaxList.filter(input => input.FIELD_NAME == 'CGST')
            SGSTTaxList = TaxList.filter(input => input.FIELD_NAME == 'SGST')


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
        event.target.classList.contains("quantityR") ||
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
    document.getElementById("documentImages").appendChild(newDocument);
}

function SetZeroQ(ctrl) {
    if (ctrl.value === "") ctrl.value = '';

    let row = ctrl.closest("tr");
    let toleranceInput = row.querySelector(".spTOLERANCE");
    let receivedInput = row.querySelector(".quantityR");
    let damageInput = row.querySelector(".quantityD");
    let shortInput = row.querySelector(".quantityS");

    let received = parseFloat(receivedInput.value) || 0;

    let tolerance = parseFloat(toleranceInput.outerText) || 0;

    let damage = parseFloat(damageInput.value) || 0;
    let short = parseFloat(shortInput.value) || 0;

    let originalQty = parseFloat(row.cells[6].textContent) || 0; // assuming Quantity is in cell index 8

    // If user is changing damage or short
    if (ctrl.classList.contains("quantityD") || ctrl.classList.contains("quantityS")) {
        if ((damage + short) > received) {
            FailToaster("Damage + Short cannot be greater than Received quantity.");
            ctrl.value = 0;

            // Recalculate again
            damage = parseFloat(damageInput.value) || 0;
            short = parseFloat(shortInput.value) || 0;
        }
        else {

            const decimalPart = ctrl.value.split('.')[1];
            if (decimalPart && decimalPart.length > 3) {
                // Floor to 2 decimal places
                val = Math.floor(val * 1000) / 1000;
                ctrl.value = val.toString();
            }
        }
    }

    // If user changes Received quantity
    if (ctrl.classList.contains("quantityR")) {
        if (received > tolerance) {
            FailToaster("Received quantity cannot be greater than ordered quantity.");
            // receivedInput.value = originalQty;
            //received = originalQty;

            // damageInput.value = '';
            //shortInput.value = '';
        }
        else if (received <= 0) {
            FailToaster("Received quantity cannot be smaller or equal to 0.");
            // receivedInput.value = originalQty;
            // received = originalQty;

            //damageInput.value = '';
            //shortInput.value = '';

        }
        else {
            const decimalPart = ctrl.value.split('.')[1];
            if (decimalPart && decimalPart.length > 3) {
                // Floor to 2 decimal places
                val = Math.floor(val * 1000) / 1000;
                ctrl.value = val.toString();
            }
        }
        // Reset damage and short

    }

    // Recalculate totals
    updateRowTotals(row);
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