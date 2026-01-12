$(document).ready(function () {
    
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
        $(this).siblings('.clear-date').show(); // Show × icon
    });


    // Clear date when clicking the × icon
    $('.clear-date').on('click', function () {
        const $input = $(this).siblings('.datepicker');
        $input.val('');
        $(this).hide();
    });

    // Open datepicker when clicking the icon
    $('.input-group-text').on('click', function () {
        $(this).closest('.input-group').find('.datepicker').focus();
    });
    
    GetEntrySeries();
    
    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 3,
        manualTableId: 0,
        ScreenId: 'GateEntry_101'
    }
    LoadMasterDropdown('ddlTransporterName', obj3, 'Select', false);
                   

    LoadMasterDropdown('ddlSupp', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);



    var dt = new Date();
    var newDate = ChangeDateFormatToddMMYYYWithSlace(dt);
    $('#txtDocumentDate').val(newDate);

    // Run once on page load
    handleClientMaterialChange();

    $('#ddlSupp').on('change', function () {
        /* GetMaterialCategory();*/
        handleSupplierChange();
    })

});
function GetEntrySeries() {
    var model =
    {
        ID: 0
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'GetEntry_102' }, 'GET', function (response) {
        var tblSeries = response.data.data.Table;
        $('#txtDocumentNo').val(response.data.data.Table1[0].DocNumber)
        
        var $ele = $('#ddlGateEntrySeriesManual');
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
        //$ele.empty();
        //$ele.append($('<option/>').val('').text('Select'));
        //$.each(tblSeries, function (ii, vall) {
        //    $ele.append($('<option />').val(vall.ID).text(vall.ValueName));
        //})

    });

}


function GetMaterialCategory() {

    if ($('#ddlSupp').val() > 0) {
        var model =
        {
            ID: $('#ddlSupp').val(),
            Type: 2
        };
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'GetEntry_102' }, 'GET', function (response) {

            console.log(response);

            if (response.data.data.Table) {

                $('#ddlMaterialCategory').val(response.data.data.Table[0].ItemCategoryId == 0 ? 'Select' : response.data.data.Table[0].ItemCategoryId).trigger('change');

            }

        });
    }
    else {
        $('#ddlMaterialCategory').val('Select').trigger('change');
    }

}


let fileModelList = [];
let fileModelList1 = [];
let fileModelList2 = [];

let fileDatalList = [];
let fileDatalList1 = [];
let fileDatalList2 = [];

async function SaveGateEntry() {
    if (checkValidationOnSubmit('Mandatory') == true) {
        var obj =
        {
            FolderNames: "GateEntryDocuments/"
        }
        var type = 1;//This is for  common upload in attachment folder.
        const jsonString = JSON.stringify(obj);
        const result1 = await MultiFileUploadWithoutAync("fileMaterialPhoto", jsonString, type, fileDataCollection1);
        const result2 = await MultiFileUploadWithoutAync("fileMaterialCOA", jsonString, type, fileDataCollection2);
        const result3 = await MultiFileUploadWithoutAync("fileAttachment3", jsonString, type, fileDataCollection3);
        var fileData1 = [];
        var fileData2 = [];
        var fileData3 = [];
        if (result1.Data != undefined) {
            fileData1 = JSON.parse(result1.Data).FileModelList;
            fileData1 = fileData1.concat(fileDatalList);
        }
        else {
            fileData1 = fileModelList;
        }

        if (result2.Data != undefined) {
            fileData2 = JSON.parse(result2.Data).FileModelList;
            fileData2 = fileData2.concat(fileDatalList1);

        }
        else {
            fileData2 = fileModelList1;
        }
        if (result3.Data != undefined) {
            fileData3 = JSON.parse(result3.Data).FileModelList;
            fileData3 = fileData3.concat(fileDatalList2);
        }
        else {
            fileData3 = fileModelList2;
        }

        // ✅ File count validation
        if (fileData1.length > 10) {
            FailToaster("You cannot upload more than 10 files for Material Photo.");
            return;
        }
        if (fileData2.length > 10) {
            FailToaster("You cannot upload more than 10 files for Material COA.");
            return;
        }
        if (fileData3.length > 10) {
            FailToaster("You cannot upload more than 10 files for Attachments.");
            return;
        }

        if (fileData3.length == 0) {
            FailToaster("Invoice Attachment is mandatory.");
            return;
        }

        var DocumentDate = ChangeDateFormatSecond($('#txtDocumentDate').val());
        var InvoiceDate = ChangeDateFormatSecond($('#txtInvoiceDate').val());
        var clientMaterialStatus = false;
        if (document.getElementById('rdoClientMaterialYes').checked) {
            clientMaterialStatus = true;
        } else if (document.getElementById('rdoClientMaterialNo').checked) {
            clientMaterialStatus = false;
        }
        
        var Model =
        {
            ID: 0,
            Series: $('#ddlGateEntrySeriesManual').val(),
            DocumentNo: $('#txtDocumentNo').val(),
            DocumentDate: DocumentDate,
            InvoiceNumber: $('#txtInvoiceNumber').val(),
            InvoiceDate: InvoiceDate,
            SupplierId: $('#ddlSupp').val(),
            MaterialCategory: $('#ddlMaterialCategory').val(),
            VehicleNumber: $('#txtVehicleNumber').val(),
            GateNumber: $('#txtGateNumber').val(),
            TransporterName: $('#ddlTransporterName').val(),
            ClientMaterial: clientMaterialStatus,
            MaterialImageAttachment: fileData1,
            InvoiceImageAttachment: fileData2,
            COAImageAttachment: fileData3
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(Model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "GateEntry_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                    RedirectVendorList();
            }
        });
    }
}
function CancleGateEntry() {
    RedirectVendorList()
}
function RedirectVendorList() {
    var url = "/MaterialManagement/Material/GateEntry?auth=" + AuthToken;
    window.location.href = url;
}
function ChangeTransporterName() {
    var TransporterId = $('#ddlTransporterName').val() == 'Select' ? 0 : $('#ddlTransporterName').val();
    if (TransporterId > 0) {
        GetTransporterAddress(TransporterId);
    }
    else {
        $('#pAddressofTransporter').text("");
    }
}
function GetTransporterAddress(TransporterId) {
    var model = {
        ID: TransporterId,
        Type: 'ERPTransporter'
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "Trans_102";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var data = response.data.data.Table;
        document.getElementById('pAddressofTransporter').innerText =
            `${response.data.data.Table[0].DispalyName}\n` +
            `${response.data.data.Table[0].Address}, ${response.data.data.Table[0].City}\n` +
            `${response.data.data.Table[0].StateName}, ${response.data.data.Table[0].CountryName}, ${response.data.data.Table[0].PinCode}`;
    });
}
function ChangeDateFormatToDDMMYYYSlace(dt) {
    var MyDateString = "";
    var dateString = dt; // Given date in DD/MM/YYYY format
    var parts = dateString.split('/'); // Split the string by "/"
    var formattedDate = new Date(parts[2], parts[1] - 1, parts[0]); // Rearranged as YYYY, MM (0-based), DD
    MyDateString = formattedDate;
    return MyDateString;
}

function SetDocNumber(ctrl) {
    var model =
    {
        ID: ctrl.value,
        SupplierId: 0,
        ModuleId: 4
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'MaterialPageLoad_102' }, 'GET', function (response) {
        var tblDoc = response.data.data.Table;
        $('#txtDocumentNo').val(tblDoc[0].DocNumber);
        if (tblDoc[0].DOC_LOCK == 1) {
            $("#txtDocumentNo").prop("disabled", true);
        }
        else {
            $("#txtDocumentNo").prop("disabled", false);
        }
    });
}

//#region : Manage BusinessPartner, Material Category By Client Material
function handleClientMaterialChange() {
    const isYesChecked = $('#rdoClientMaterialYes').is(':checked');
    const manualTableValue = isYesChecked ? 21 : 1;

    // Load supplier dropdown
    LoadMasterDropdown('ddlSupp', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: manualTableValue,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 2,
        manualTableId: 0,
        ScreenId: 'GateEntry_101'
    }
    LoadMasterDropdown('ddlMaterialCategory', obj2, 'Select', false);
   
    handleSupplierChange();
}

// When "Yes" or "No" radio changes
$('#rdoClientMaterialYes, #rdoClientMaterialNo').on('change', function () {
    handleClientMaterialChange();
});

// When supplier changes and "No" is selected
function handleSupplierChange() {
    const isYesChecked = $('#rdoClientMaterialYes').is(':checked');

    if (isYesChecked) {
        // If Yes is selected, just enable (unfreeze)
        $('#ddlMaterialCategory').prop('disabled', false);
       
    } else {
        // Only when "No" is selected
        GetMaterialCategory();
        $('#ddlMaterialCategory').prop('disabled', true);
    }
}

//#endregion