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




    VerifyBOMHeader();


});


function VerifyBOMHeader() {

    var model =
    {
        Id: Edit_ID,
        Type: 34
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        var data = response.data.data.Table;

        if (data && data.length > 0) {
            data = data[0];

            $('#sample_id').prepend(data.ERP_Sample_Det_UniqId); // keeping edit icon intact
            $('#bom_no').text(data.BOM_DocNo == null ? '' : data.BOM_DocNo);
            $('#fg').text(data.ItemName);
            $('#sfg').text(data.Item_Name);
            $('#sfg_code').text(data.ITEM_CODE);
            $('#ch').text(data.chemist);
            $('#st').text(data.SampleType);
            $('#so').text(data.SaleOrderNo); // assuming SO = Sample ID (since missing in data)
            $('#oq').prepend(data.Qty + ' ');
            $('#oq2').prepend(data.Qty + ' '); // example conversion, adjust if needed
            $('#crr').text(data.crr);
            $('#nbd').text(data.nbd);
            $('#cust').text(data.PA_NAME);
            $('#brand').text(data.BrandName);


            getSampleDocSeries(data.ERP_Sample_Det_Id);

            getBOMDetails(data.BOMId);
        }

    });
}

let pp_total_sp = 0;

let pp_total_cp = 0;

let sp_total_sp = 0;

let sp_total_cp = 0;


let pp_total_m = 0;

let sp_total_m = 0;

let ot_charges = [];
function getBOMDetails(bom_id) {

    var model =
    {
        Id: bom_id,
        Type: 33
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        let bom_data = response.data.data.Table;

        let pp_data = response.data.data.Table1;

         ot_charges = response.data.data.Table2;


        if (bom_data && bom_data.length > 0) {
            bom_data = bom_data[0];

            $('#remarks').html(bom_data.Remarks);

            const n = v => Number(v) || 0;

            const qty = n(bom_data.SFGQty) * n(bom_data.CONVERSION_FACTOR); // converted quantity
            const saleRate = n(bom_data.SaleRate);
            const costPerKg = n(bom_data.cost_per_kg);
            const purchPricePc = n(bom_data.purch_price_pc);

            const totalSale = qty * saleRate;
            const profit = totalSale - purchPricePc;

            const sfg = `
                    <tr>
                      <td>1</td>
                      <td>${bom_data.ITEM_NAME}</td>
                      <td>${bom_data.SampleId}</td>
                      <td class="text-right">${n(bom_data.SFGQty).toFixed(2)}</td>
                      <td>${bom_data.UOM}</td>
                      <td class="text-right">${costPerKg.toFixed(2)}</td>
                      <td class="text-right">${saleRate.toFixed(2)}</td>
                      <td class="text-right">${(saleRate - costPerKg).toFixed(2)}</td>
                      <td class="text-right" id="sfgcp" >${purchPricePc.toFixed(2)}</td>
                      <td class="text-right" id="sfgsp">${totalSale.toFixed(2)}</td>
                      <td class="text-right" id="sfgm">${profit.toFixed(2)}</td>
                    </tr>`;

            $('#sfg_data').html(sfg);

        }

        var pp = '';

        var sp = '';

        if (pp_data && pp_data.length > 0) {



            var sp_data = pp_data.filter(input => input.Reference == 'SP')

            pp_data = pp_data.filter(input => input.Reference == 'PP')

            sp_total_sp = sp_data.reduce(
                (acc, input) => acc + Math.max(0, Number(input.SellingPrice) || 0),
                0
            );

            sp_total_cp = sp_data.reduce(
                (acc, input) => acc + Math.max(0, Number(input.PurchQty) || 0),
                0
            );

            pp_total_sp = pp_data.reduce(
                (acc, input) => acc + Math.max(0, Number(input.SellingPrice) || 0),
                0
            );

            pp_total_cp = pp_data.reduce(
                (acc, input) => acc + Math.max(0, Number(input.PurchQty) || 0),
                0
            );

            console.log(sp_total_sp);
            console.log(sp_total_cp);
            console.log(pp_total_sp);
            console.log(pp_total_cp);

            sp_total_m = sp_total_sp - sp_total_cp;

            pp_total_m = pp_total_sp - pp_total_cp;

            $('#sp_total_sp').html(sp_total_sp)
            $('#sp_total_cp').html(sp_total_cp)
            $('#pp_total_sp').html(pp_total_sp)
            $('#pp_total_cp').html(pp_total_cp)
            $('#sp_total_m').html(sp_total_m);
            $('#pp_total_m').html(pp_total_m);

            for (var i = 0; i < pp_data.length; i++) {
                pp +=
                    ` <tr>
                                    <td>${i+1}</td>
                                    <td class="text-center">
                                        <input type="checkbox" id="FromClientone" name="FromClient" ${pp_data[i].FromClient ? `checked` : ``} disabled value="">
                                        <label for="FromClientone" class="m-0 singlecheck pl-0"></label>
                                    </td>

                                    <td>${pp_data[i].sub_cate}</td>
                                    <td>${pp_data[i].ItemName}</td>
                                    <td>PM1${pp_data[i].Item_Code}234</td>
                                    <td class="text-right">${pp_data[i].Qty}</td>
                                    <td>${pp_data[i].UOM1}</td>
                                    <td class="text-right">${pp_data[i].PurchQty}</td>
                                    <td class="text-right">${pp_data[i].SellingPrice}</td>
                                    <td class="text-right">${(pp_data[i].SellingPrice - pp_data[i].PurchQty).toFixed(2)}</td>
                                </tr>`
            }



            for (var i = 0; i < sp_data.length; i++) {
                sp +=
                    ` <tr>
                                    <td>${i + 1}</td>
                                    <td class="text-center">
                                        <input type="checkbox" id="FromClientone" name="FromClient" ${sp_data[i].FromClient ? `checked` : ``} disabled value="">
                                        <label for="FromClientone" class="m-0 singlecheck pl-0"></label>
                                    </td>

                                    <td>${sp_data[i].sub_cate}</td>
                                    <td>${sp_data[i].ItemName}</td>
                                    <td>PM1${sp_data[i].Item_Code}234</td>
                                    <td class="text-right">${sp_data[i].Qty}</td>
                                    <td>${sp_data[i].UOM1}</td>
                                      <td class="text-right">${sp_data[i].PurchQty}</td>
                                    <td class="text-right">${sp_data[i].SellingPrice}</td>
                                    <td class="text-right">${(sp_data[i].SellingPrice - sp_data[i].PurchQty).toFixed(2)}</td>
                                </tr>`
            }


            var ot = '';
            console.log("ot_charges: ",ot_charges);
            for (let j = 0; j < ot_charges?.length; j++) {
                ot += ` <tr>
                    <td>${j + 1}</td>
                    <td>${ot_charges[j].Classification}</td>
                    <td>
                    <input type="number" id="otcp_${ot_charges[j].ID}" class="form-control Mandatory text-right" oninput="SetZero(this); changeCharges(this); HideErrorMessage(this)" onchange="changeCharges(this)" placeholder="Enter" />
                    <span id="spotcp_${ot_charges[j].ID}" class="text-danger field-validation-error" style="display:none;">Oops! Looks like you missed this field.</span>
                    </td>
                    <td class="text-right" id="otsp_${ot_charges[j].ID}">${ot_charges[j].SellingPrice.toFixed(2)}</td>
                    <td class="text-right" id="otm_${ot_charges[j].ID}">${ot_charges[j].SellingPrice.toFixed(2)}</td>
                </tr>`;
            }


            $('#pp_data').html(pp);
            $('#sp_data').html(sp);
            $('#ot_data').html(ot);

            calculateAllCharges();
        }

    });
}


function changeCharges(ctrl) {
    let id = ctrl.id;

    let rowId = id.split('_')[1];

    let sp = parseFloat($('#otsp_' + rowId).html()) || 0;

    let cp = parseFloat(ctrl.value) || 0

    let margin = sp - cp;

    $('#otm_' + rowId).html(margin.toFixed(2));

    calculateAllCharges();

}




function calculateAllCharges() {

    let ot_total_sp = 0;
    let ot_total_cp = 0;
    let ot_total_m = 0;

    for (let i = 0; i < ot_charges.length; i++) {

        ot_total_sp += ot_charges[i].SellingPrice;

        ot_total_cp += parseFloat($(`#otcp_${ot_charges[i].ID}`).val()) || 0

        ot_total_m += parseFloat($(`#otm_${ot_charges[i].ID}`).html()) || 0

    }

    let total_sp = (parseFloat($('#sfgsp').html()) || 0) + sp_total_sp + pp_total_sp + ot_total_sp;

    let total_cp = (parseFloat($('#sfgcp').html()) || 0) + sp_total_cp + pp_total_cp + ot_total_cp;

    let wastage = parseFloat($('#wastage').val()) || 0;

    let wastage_cost = parseFloat((total_cp * wastage / 100)) || 0;


    let total_m = total_sp - (total_cp + wastage_cost);

    let m_perc = total_m * 100 / total_cp;

    $('#total_sp').html(total_sp);

    $('#total_cp').html(total_cp);

    wastage_cost = wastage_cost.toFixed(2);

    $('#wastage_cost').html(wastage_cost);

    $('#m_total').html(total_m.toFixed(2));

    if (total_cp == 0) {
        $('#m_perc').html('0.00%');
    }
    else {
        $('#m_perc').html(`${m_perc.toFixed(2)}%`);
    }




    
}

function saveGrossMargin() {
    if (checkValidationOnSubmit('Mandatory') == true) {

        let ot_charge = [];

        for (let i = 0; i < ot_charges.length; i++) {

            var obj =
            {
                ID: ot_charges[i].ID,
                cost_price: parseFloat($(`#otcp_${ot_charges[i].ID}`).val()) || 0,               
            }

            ot_charge.push(obj);
        }


        var model475 = {
            id: 0,
            Type: 102,
            BOMNo: $('#bom_no').html(),
            wastage: parseFloat($('#wastage').val()) || 0,
            OrderID: Edit_ID,
            ot_charge: ot_charge

        };
        const jsonString475 = JSON.stringify(model475);

        let Modeldatals475 =
        {
            ScreenID: "QCPM_101",
            Operation: "A",
            ModelData: jsonString475
        };

        console.log(Modeldatals475);

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', Modeldatals475, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                redirectUrl()
            }
        });



    }

}


function rejectGrossMargin() {
   
    if (checkValidationOnSubmit('MandatoryR') == true) {
        var model475 = {
            id: 0,
            Type: 103,
            OrderID: Edit_ID,
            RejectText: $('#reject').val()
        };
        const jsonString475 = JSON.stringify(model475);

        let Modeldatals475 =
        {
            ScreenID: "QCPM_101",
            Operation: "A",
            ModelData: jsonString475
        };

        console.log(Modeldatals475);

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', Modeldatals475, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                redirectUrl()
            }
        });
    }

}

function redirectUrl() {

    window.location.href = 'O2DPrivateLabelFMS?auth=' + AuthToken;
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

function RedirectToPil() {
    window.location.href = '/ManageOrder/O2DPrivateLabelFMS?auth=' + AuthToken;
}
function getSampleDocSeries(id) {


    var model =
    {
        Id: id,
        Type: 4
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);

        var data = response.data.data.Table[0];

        $('#FMDocNo').html(data.FMDocNo);
        $('#Item_Name').html(data.Item_Name);
        $('#SampleDocvNo').html(data.ERP_Sample_Det_UniqId);

        $('#open_pdf').on('click', function () {
            handleTaskFile(data.SFileURL, data.SActualFileName);
        })

        if (localStorage.getItem("sample_type") == 'Oil') {

            $('#oil').show();


            var viewOil = ` <td>${data.Item_Name}</td>
                            <td>${data.txtFormulationCategory}</td>
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
                                        <td>${data.Requirements}</td>
                                        <td>${data.MustIngredients}</td>
                                        <td>${data.MustNotIngredients}</td>
                                        <td><a  onclick="handleTaskFile('${data.FileURL}', '${data.ActualFileName}')" class="fn-bold" target="_blank"><img src="../../assets/images/icons/help/view-icon.png" class="icon-sm"> View</a></td>`


            $('#viewStandard').html(viewStandard);
        }

    });

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