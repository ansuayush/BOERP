
$(document).ready(function () {

    $('#confirmorderdelivery').on('change', function () {
        if ($('#confirmorderdelivery').val() == 'part') {
            $('.part').show();

            $('#totalorder').addClass('Mandate');
            $('#partorder').addClass('Mandate');
        }
        else if ($('#confirmorderdelivery').val() == 'full') {

            $('.part').hide();

            $('.totalpart').show();

            $('#partorder').removeClass('Mandate');
            $('#totalorder').addClass('Mandate');
        }
        else {
            $('.part').hide();

            $('#totalorder').removeClass('Mandate');
            $('#partorder').removeClass('Mandate');
        }
    })

    LoadSampleDropdown();
});

function LoadSampleDropdown() {
    var model =
    {
        Type: 20,
        ColumnName: 'Name',
        SearchData: 'Filter by BOM ItemCat'
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_104' }, 'GET', function (response) {

        Sample = response.data.data.Table;
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



function GetdataSample(inputElement) {
    //let rowId = inputElement.id.split('_')[1]; // Extract RowId from input ID
    let suggestionBox = document.getElementById(`globalSuggestionBoxS`);

    let search = inputElement.value.toLowerCase();
    suggestionBox.innerHTML = "";

    //if (search.length < 2) {
    //    suggestionBox.style.display = "none";
    //    return;
    //}

    let matchedItems = Sample.filter(item =>
        item.ERP_Sample_Det_UniqId.toLowerCase().includes(search)
    ).slice(0, 50);

    if (matchedItems.length === 0) {
        suggestionBox.innerHTML = `<li class="errordata">No data found</li>`;
    } else {
        matchedItems.forEach(item => {
            let li = document.createElement("li");
            li.textContent = `${item.ERP_Sample_Det_UniqId}`;

            li.addEventListener("mousedown", function (e) {
                e.preventDefault();   // stops blur from killing the click
                inputElement.value = item.ERP_Sample_Det_UniqId;
                suggestionBox.style.display = "none";
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

    if (id.toLowerCase().includes("quantity") || id.toLowerCase().includes("bomqty")) {
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

function SetZeroNoDecimal(ctrl) {
    let val = ctrl.value.trim();

    // Check if empty
    if (val === '') {
        return -1;
    }

    // Check if it contains a decimal point
    if (val.includes('.')) {
        FailToaster('Decimal values are not allowed! Please enter whole numbers only.');
        ctrl.value = '';
        return -1;
    }

    // Parse as integer
    let intVal = parseInt(val, 10);

    // Check if it's a valid number and not negative
    if (isNaN(intVal) || intVal < 0) {
        ctrl.value = '';
        return -1;
    }

    // Check if the number exceeds 9 digits
    if (val.length > 9 || intVal > 999999999) {
        FailToaster('Number should be maximum of 9 digits!');
        ctrl.value = '';
        return -1;
    }

    // Set the cleaned integer value back
    ctrl.value = intVal.toString();

    return 1;
}

var orderItemTable;

//#region : Sale Order Gried Data
function bindSaleOrderGridFilter() {

    let filterData = tableData;

    var BrandId = $("#ddlBrand").val() === 'Select' ? '0' : $("#ddlBrand").val();

    if (BrandId != '0') {

        filterData = filterData.filter(row => row.BrandId == BrandId);
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindSaleOrderGrid();
});


function bindSaleOrderGrid() {
    $("#customLoader").show();

    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'SaleOrderItem_102',//Need to change the screen id as per your data
        //modelData: jsonString,
        modelData: JSON.stringify({
           
            Type: 3

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'O2DPLGried', columnMeta, tableData);
        $("#customLoader").hide();
    });
}

//#endregion

var qty = 0;

var item_id = 0;
function getO2DPrivateLabel(order_itemid, sample_id, totalorder, totalorder_qty) {


    var model =
    {
        Id: order_itemid,
        Type: 31
    };

   

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        const data = response.data.data.Table;

     
        if (response.data.data.Table1.length > 0) {

            const orderfor = parseInt(response.data.data.Table1[0].OrderFor) || 0;

            Sample = Sample.filter(input => input.PA_ID == input.customerId);

            if (orderfor > 1) {
                $('#app_mrp').val(0);

                $('#app_mrp').prop('disabled', true);
            }

        };

        qty = totalorder_qty;
        item_id = order_itemid;

       // console.log(order_itemid);

        if (sample_id.length > 0) {
            $('#ddlSample').val(sample_id);
            $('#ddlSample').prop('disabled', true);
        }
        else {
            Sample = Sample.filter(input => input.Item_Id == 0);
        }
     
        $('#totalorder').val(totalorder);
        $('#totalorder').prop('disabled', true);



        if (data && data.length > 0) {
            // $('#ddlSample').prop('disabled', true);
            $('#confirmorderdelivery').val(data[0].OrderDeliveryType).trigger('change');
            $('#app_mrp').val(data[0].ApprovedMRP ? data[0].ApprovedMRP : 0);
            $('#partorder').val(data[0].PartOrderQuantity);
            $('#ddlSample').val(data[0].ApprovedSampleID)
            $('#check1').prop('checked', true);
            $('#check2').prop('checked', true);
            $('#check1').prop('disabled', true);
            $('#check2').prop('disabled', true);

        }
        else {
            $('#confirmorderdelivery').val('Select').trigger('change');
            $('#app_mrp').val('0');
            $('#partorder').val('');
            $('#check1').prop('checked', false);
            $('#check2').prop('checked', false);
            $('#check1').prop('disabled', false);
            $('#check2').prop('disabled', false);
        }


        $('#markdone').modal('show');
    });

}

function saveO2DPL() {

    if (checkValidationOnSubmit('Mandate')) {

        if ($('#check1').prop('checked') && $('#check2').prop('checked')) {

            var obj = {
                ID: 0,
                Order_ItemId: item_id,
                OrderDeliveryType: $('#confirmorderdelivery').val(),
                TotalOrderQuantity: qty,
                PartOrderQuantity: $('#confirmorderdelivery').val() == 'full' ? 0 : $('#partorder').val(),
                ApprovedSampleID: $('#ddlSample').val(),
                ApprovedMRP: $('#app_mrp').val()
            };

            const jsonString = JSON.stringify(obj);
            var ScreenID = "SCRN-ERP-O2DPL-001";

            let GenericModeldata = {
                ScreenID: ScreenID,
                Operation: "A",  // Use Update for existing records, Add for new ones
                ModelData: jsonString
            };



            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {

                if (response.ValidationInput > 0) {
                    window.location.reload();
                }
            })


        }
        else {
            FailToaster('Please accept all the terms before proceeding')
        }

    }
}





async function DownLoadStep2Zip(order_itemid) {
    try {
        const model = {
            Id: order_itemid,
            Type: 15
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
            const safeName = sanitizeFileName(file.ActualFileName);
            zip.file(safeName, blob);
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "OrderFiles.zip");
    } catch (error) {
        console.error("Error creating ZIP:", error);
        alert("Error creating ZIP file. Check console for details.");
    }
}

function sanitizeFileName(name) {
    return name.replace(/[<>:"/\\|?*]+/g, "_");
}

