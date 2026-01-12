$(document).ready(function () {


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


    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 68,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlHSN', obj3, 'Select', false, '');




    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 72,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }


    LoadMasterDropdown('ddlUnitSFG', obj4, 'Select', false, '');

    var bomId = parseInt($("#hdnBOMId").val());
    sessionStorage.setItem("chargeData", []);

    // disable
    $('#ddlHSN').prop('disabled', false);

    VerifyBOMHeader();
  


    LoadItemDropdown();

    LoadCustomerDropdown();







});

var bomId = 0;

function VerifyBOMHeader() {

    var model =
    {
        Id: Edit_ID,
        Type: 32
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
            $('#fg_itemcode').text(data.fg_itemcode != null ? data.fg_itemcode : '');
            $('#fg_itemcode').text(data.fg_itemcode != null ? data.fg_itemcode : '');
            $('#fg_bomno').text(data.bomnumber != null ? data.bomnumber : '');
            $('#packsize').text(data.pack_size != null ? data.pack_size : '');


            bomId = data.BOMId;

            GetBOMDetById(data.BOMId);

        }

    });
}

var itemchargeDataFG = [];
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

            if (!tableData || tableData.length <= 0) {
                itemchargeDataFG = [];
                $('#itemCharges').text('');
            }

            //  $('#ddlHSN').val(tableData.length > 0 && tableData[0]?.HSN_ID).trigger('change');


            let selectedTaxNames = [];

            if (tableData.length > 0) {
                tableData.forEach(row => {
                    /*if (row.ChargeId > 0 && row.TaxPer > 0) {*/
                    if (row.CHRG_ID > 0) {
                        itemchargeDataFG.push({
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
            }


        });
    }

}

function LoadOtherCharges() {


    var model =
    {
        ID: 0,
        OtherId: 0,
        ModuleId: 10
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
        var tblDocNo = response.data.data.Table;

        console.log(tblDocNo);

        OtherCharges_Arr = tblDocNo;
        let newRow = ``;

        for (var i = 0; i < tblDocNo.length; i++) {


            newRow += `
	<tr>
	<td>${i + 1}</td>
                <td>
                                ${tblDocNo[i].FIELD_NAME}
                            </td>

                            <td class=" text-right">
                            <input type="number" id="amt_${tblDocNo[i].ID}" oninput="HideErrorMessage(this); calculateOtherCharge(); SetZero(this)" class="form-control MandateOther text-right" value="" placeholder="Enter Value" />
                            <span id="spamt_${tblDocNo[i].ID}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                            </td>
                            <td><input type="text" id="remark_${tblDocNo[i].ID}" oninput="HideErrorMessage(this)" class="form-control MandateOther" value="" placeholder="Enter Text" /></td>             
           </tr>

`;



        }

        $('#othercharges').html(newRow);
        $(".applyselect").select2();



    });
}


function LoadOtherChargesEdit(tblDocNo, IsView) {


    OtherCharges_Arr = tblDocNo;

    let newRow = ``;

    for (var i = 0; i < tblDocNo.length; i++) {


        newRow += `
	<tr>
	<td>${i + 1}</td>
                <td>
                                ${tblDocNo[i].FIELD_NAME}
                            </td>

                            <td class=" text-right">
                            <input type="number" ${IsView == `true` ? `disabled` : ``} id="amt_${tblDocNo[i].ID}" value="${tblDocNo[i].AmountPerPiece}" oninput="HideErrorMessage(this); SetZero(this); calculateOtherCharge();" class="form-control MandateOther text-right" value="" placeholder="Enter Value" />
                            <span id="spamt_${tblDocNo[i].ID}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                            </td>
                            <td><input type="text" ${IsView == `true` ? `disabled` : ``} id="remark_${tblDocNo[i].ID}" value="${tblDocNo[i].Comment}" oninput="HideErrorMessage(this)" class="form-control MandateOther" value="" placeholder="Enter Text" /></td>             
           </tr>

`;



    }

    $('#othercharges').html(newRow);

}

var client_catId = 0;


function MaterialInformationAddRow(button) {
    const tableBody = document.querySelector('#printed_packing tbody');
    const rowCount = tableBody.rows.length + 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `

       ${rowCount == 1 ?ChangeItemDataPPFromClient
            `<td>
                                      <div onclick="AddItemMasterDynamic(this);" class="cursor-pointer">
                                                  <img src="../../assets/images/icons/help/add.svg" class="img-15" alt="">
                                      </div>
                                </td>` :

            `<td class="text-center">
		                            <div onclick="deleteRow1(this);">
			                            <img src="../../assets/images/icons/help/close.svg" alt="" class="cursor-pointer img-15">
		                            </div>
	                            </td>`
        }
	
	<td>${rowCount}</td>
                            <td class="text-center">
                               <input type="hidden"id="ddlEdit_${rowCount}" value="0" />
                                <input type="checkbox" id="FromClient_${rowCount}" name="FromClient" onclick="ChangeItemDataPPFromClient(this)" value="">
                                <label for="FromClient_${rowCount}" class="m-0 singlecheck pl-0"></label>
                            </td>
                            <td class="text-center">
                                <input type="checkbox" id="NewItem_${rowCount}" onclick="ChangeItemDataPP(this)" name="FromClient" value="">
                                <label for="NewItem_${rowCount}" class="m-0 singlecheck pl-0"></label>
                            </td>
                             <td>
                                <select class="form-control applyselect MandatePP" onchange="HideErrorMessage(this); setItemName(this)" id="subcate_${rowCount}">                                  
                                </select>
                                <span id="spsubcate_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                            </td>

                            <td>
                            <div class="autocomplete-wrapper" style="position: relative;">
								<label for="ddlI_${rowCount}" class="search-label">
									<img src="../../assets/images/icons/help/search-icon.png" class="icon-sm">
								</label>
								<input type="text" class="form-control searchlist MandatePP" id="txtMIItemName_${rowCount}" oninput="Getdata(this); HideErrorMessage(this)" onclick="Getdata(this); HideErrorMessage(this)" placeholder="Type item..." autocomplete="off">
								<span id="sptxtMIItemName_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                                 <ul id="globalSuggestionBox_${rowCount}" class="suggestions"></ul>
                                 <input type="hidden" id="ddlItem_${rowCount}" />
				</div>
                         
                            
                            </td>
<td>
			 <input type="text"  class="form-control" disabled value="" id="itemcode_${rowCount}" placeholder="Enter" />
</td>

<td style="display: none;" >
 <select disabled class="form-control applyselect" onchange="HideErrorMessage(this)" id="ddlHSN_${rowCount}">
                        </select>
                        <span id="spddlHSN_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>

</td>

<td>
				<input type="number" class="form-control MandatePP text-right" value="1" disabled oninput="HideErrorMessage(this); CalculateRate(this)" placeholder="Enter" value="" id="txtMIQty_${rowCount}"/>
				<span id="sptxtMIQty_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
</td>

<td>

                                <select disabled class="form-control MandatePP applyselect" onchange="HideErrorMessage(this)" id="ddlUnitSFG_${rowCount}">
                                </select>
                                <span id="spddlUnitSFG_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                            </td>

       <td>
                 <input type="number" id="purchrate_${rowCount}" oninput="HideErrorMessage(this); SetZero(this)" class="form-control MandatePP text-right" placeholder="0">
                  <span id="sppurchrate_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                 <input type="hidden" id="purchrate1_${rowCount}" />
             </td>

<td>
				<input type="number" class="form-control MandatePP text-right"  oninput="HideErrorMessage(this);CalculateRate(this)" onchange="HideErrorMessage(this)" placeholder="Enter" value="" id="txtMISellingPrice_${rowCount}"/>
				<span id="sptxtMISellingPrice_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                 <input type="hidden" id="purch_${rowCount}" />
</td>


				<td class="text-right fn-bold" id="totlCost_${rowCount}"></td>

         <td class="text-center">
                                <button type="" id="addnew_${rowCount}" class="btn hidden  btn-sm  actionbtn mx-auto" data-toggle="modal" onclick="SaveItemMasterDynamic(${rowCount})" >Add</button>
        </td>
`;



    tableBody.appendChild(newRow);
    $(".applyselect").select2();

    var obj344 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 68,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown(`ddlHSN_${rowCount}`, obj344, 'Select', false, '');

    const unit_pcs = localStorage.getItem("uom4");

    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 72,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }


    LoadMasterDropdown(`ddlUnitSFG_${rowCount}`, obj4, 'Select', false, unit_pcs);

    var obj123 = {
        parentId: 0,
        masterTableTypeId: 103,
        isMasterTableType: false,
        isManualTable: false,
        manualTable: 0,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown(`subcate_${rowCount}`, obj123, 'Select', false);

}


function MaterialInformationAddRowEdit(obj, IsView) {
    var isDisbaled = "disabled";
    if (obj.CreateNew == true) {
        isDisbaled = "";
    }
    const tableBody = document.querySelector('#printed_packing tbody');
    const rowCount = tableBody.rows.length + 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `


            ${IsView == `false` ? rowCount == 1 ?
            `<td>
                                      <div onclick="AddItemMasterDynamic(this);" class="cursor-pointer">
                                                  <img src="../../assets/images/icons/help/add.svg" class="img-15" alt="">
                                      </div>
                                </td>` :

            `<td class="text-center">
		                            <div onclick="deleteRow1(this);">
			                            <img src="../../assets/images/icons/help/close.svg" alt="" class="cursor-pointer img-15">
		                            </div>
	                            </td>` : ``
        }

	<td>${rowCount}</td>
                            <td class="text-center">
                               <input type="hidden" id="ddlEdit_${rowCount}" value="1" />
                                <input type="checkbox" ${IsView == `true` ? `disabled` : ``} id="FromClient_${rowCount}" name="FromClient" ${obj.FromClient ? `checked` : ``} onclick="ChangeItemDataPPFromClient(this)" value="">
                                <label for="FromClient_${rowCount}" class="m-0 singlecheck pl-0"></label>
                            </td>
                            <td class="text-center">
                                <input type="checkbox"  id="NewItem_${rowCount}" ${obj.CreateNew ? `checked` : ``}  onclick="ChangeItemDataPP(this)" name="FromClient" value="">
                                <label for="NewItem_${rowCount}" class="m-0 singlecheck pl-0"></label>
                            </td>
                             <td>
                                <select class="form-control applyselect MandatePP"  onchange="HideErrorMessage(this); setItemName(this)" id="subcate_${rowCount}">                                  
                                </select>
                                <span id="spsubcate_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                            </td>

                            <td> 
                            <div class="autocomplete-wrapper" style="position: relative;">
								<label for="ddlI_${rowCount}" class="search-label">
									<img src="../../assets/images/icons/help/search-icon.png" class="icon-sm">
								</label>
								<input type="text" class="form-control searchlist MandatePP"  ${obj.CreateNew ? `disabled` : ``}  value="${obj.Item_Code}" id="txtMIItemName_${rowCount}" oninput="Getdata(this); HideErrorMessage(this)" onclick="Getdata(this); HideErrorMessage(this)" placeholder="Type item..." autocomplete="off">
								<span id="sptxtMIItemName_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                                 <ul id="globalSuggestionBox_${rowCount}" class="suggestions"></ul>
                                 <input type="hidden" value="${obj.ItemId}" id="ddlItem_${rowCount}" />
				</div>
                           
                            
                            </td>
                        <td>
		                     <input type="text" value="${obj.ItemName}"  ${IsView == `true` ? `disabled` : ``}  class="form-control" disabled value="" id="itemcode_${rowCount}" placeholder="Enter" />
                        </td>

<td style="display: none;">
 <select ${isDisbaled} class="form-control applyselect"  disabled onchange="HideErrorMessage(this)" id="ddlHSN_${rowCount}">
                        </select>
                        <span id="spddlHSN_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>

</td>

<td>
				<input type="number" class="form-control text-right MandatePP" disabled  value="1" oninput="HideErrorMessage(this); CalculateRate(this)" placeholder="Enter" value="" id="txtMIQty_${rowCount}"/>
				<span id="sptxtMIQty_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
</td>

<td>

     <select  disabled class="form-control MandatePP applyselect"  ${IsView == `true` ? `disabled` : ``} onchange="HideErrorMessage(this)" id="ddlUnitSFG_${rowCount}">
     </select>
     <span id="spddlUnitSFG_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
</td>

 <td>
                 <input type="number" id="purchrate_${rowCount}"   oninput="HideErrorMessage(this); SetZero(this)" class="form-control MandatePP text-right" placeholder="0">
                  <span id="sppurchrate_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                 <input type="hidden" id="purchrate1_${rowCount}" />
             </td>

<td>
				<input type="number" class="form-control text-right MandatePP"  ${IsView == `true` || obj.FromClient ? `disabled` : ``} oninput="HideErrorMessage(this);CalculateRate(this)" onchange="HideErrorMessage(this)" placeholder="Enter" value="" id="txtMISellingPrice_${rowCount}"/>
				<span id="sptxtMISellingPrice_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                 <input type="hidden" id="purch_${rowCount}" />
</td>


				<td class="text-right fn-bold" id="totlCost_${rowCount}"></td>

     <td class="text-center">
                                <button type=""  id="addnew_${rowCount}" class="btn hidden  btn-sm  actionbtn mx-auto" data-toggle="modal" onclick="SaveItemMasterDynamic(${rowCount})" >Add</button>
        </td>

`;



    tableBody.appendChild(newRow);
    $(".applyselect").select2();

    var obj344 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 68,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown(`ddlHSN_${rowCount}`, obj344, 'Select', false, obj.HSN);

    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 72,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }


    LoadMasterDropdown(`ddlUnitSFG_${rowCount}`, obj4, 'Select', false, obj.UoM);

    var obj123 = {};

    if (obj.FromClient) {
        var obj123 = {
            parentId: client_catId,
            masterTableTypeId: 102,
            isMasterTableType: false,
            isManualTable: false,
            manualTable: 0,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
    }

    else {
        var obj123 = {
            parentId: 0,
            masterTableTypeId: 103,
            isMasterTableType: false,
            isManualTable: false,
            manualTable: 0,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
    }
    LoadMasterDropdown(`subcate_${rowCount}`, obj123, 'Select', false, obj.SubCate_Id);

    $('#txtMISellingPrice_' + rowCount).val(obj.SellingPrice).trigger('change');

    $('#totlCost_' + rowCount).html((obj.Qty * obj.SellingPrice).toFixed(2));

    $('#purch_' + rowCount).val(item.IsPurchAvl);
    if (item.IsPurchAvl == 1) {

        const $input = $('#purchrate_' + rowCount);

        // Change type to text
        $input.attr('type', 'text');

        // Remove oninput attribute (only keep HideErrorMessage)
        $input.attr('oninput', 'HideErrorMessage(this)');

        // Set value and disable field
        $input.val('Purchase Rate Available').prop('disabled', true);

        // Store actual purchase rate in hidden field
        $('#purchrate1_' + rowCount).val(item.Purchase_Price);
    }
    else {
        const $input = $('#purchrate_' + rowCount);

        // Change type to text
        $input.attr('type', 'text');

        $input.value = item.Purchase_Price

        // Remove oninput attribute (only keep HideErrorMessage)
        $input.attr('oninput', 'HideErrorMessage(this); SetZero(this)');

        // Set value and disable field
        $input.val('').prop('disabled', false);

        // Store actual purchase rate in hidden field
        $('#purchrate1_' + rowCount).val(item.Purchase_Price);

    }
    if (obj.FromClient) {

        $('#purchrate1_' + rowCount).val(0);
        $('#purchrate_' + rowCount).val(0);
        $('#purchrate_' + rowCount).prop('disabled', true);


    }


}




function MaterialInformationAddRowSPEdit(obj, IsView) {
    var isDisbaled = "disabled";
    if (obj.CreateNew == true) {
        isDisbaled = "";
    }
    const tableBody = document.querySelector('#printed_packing_sp tbody');

    const rowCount = tableBody.rows.length + 100;

    const rowNo = tableBody.rows.length + 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
	
	

      
            ${IsView == `false` ? rowNo == 1 ?
            `<td>
                                      <div onclick="AddItemMasterDynamicSP(this);" class="cursor-pointer">
                                                  <img src="../../assets/images/icons/help/add.svg" class="img-15" alt="">
                                      </div>
                                </td>` :

            `<td class="text-center">
		                            <div onclick="deleteRow1(this);">
			                            <img src="../../assets/images/icons/help/close.svg" alt="" class="cursor-pointer img-15">
		                            </div>
	                            </td>` : ``
        }
        <td>${rowNo}</td>
                            <td class="text-center">
                               <input type="hidden" id="ddlEdit_${rowCount}" value="1" /> 
                                <input type="checkbox"  ${IsView == `true` ? `disabled` : ``} id="FromClient_${rowCount}" name="FromClient" onclick="ChangeItemDataPPFromClient(this)" ${obj.FromClient ? `checked` : ``} value="">
                                <label for="FromClient_${rowCount}" class="m-0 singlecheck pl-0"></label>
                            </td>
                            <td class="text-center">
                                <input type="checkbox" id="NewItem_${rowCount}" ${obj.CreateNew ? `checked` : ``} onclick="ChangeItemDataPP(this)" name="FromClient" value="">
                                <label for="NewItem_${rowCount}" class="m-0 singlecheck pl-0"></label>
                            </td>
                             <td>
                                <select class="form-control applyselect MandateSP"  onchange="HideErrorMessage(this); setItemName(this)" id="subcate_${rowCount}">                                  
                                </select>
                                <span id="spsubcate_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                            </td>

                            <td>
                            <div class="autocomplete-wrapper" style="position: relative;">
								<label for="ddlI_${rowCount}" class="search-label">
									<img src="../../assets/images/icons/help/search-icon.png" class="icon-sm">
								</label>
								<input type="text" class="form-control searchlist MandateSP" ${obj.CreateNew ? `disabled` : ``} value="${obj.Item_Code}" id="txtMIItemName_${rowCount}" oninput="Getdata(this); HideErrorMessage(this)" onclick="Getdata(this); HideErrorMessage(this)" placeholder="Type item..." autocomplete="off">
								<span id="sptxtMIItemName_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                                 <ul id="globalSuggestionBox_${rowCount}" class="suggestions"></ul>
                                 <input type="hidden" value="${obj.ItemId}" id="ddlItem_${rowCount}" />
				</div>

                           
                            
                            </td>
<td>
		<input type="text" value="${obj.ItemName}"  disabled  class="form-control" disabled value="" id="itemcode_${rowCount}" placeholder="Enter" />	
</td>

<td style="display: none;">
 <select ${isDisbaled} class="form-control applyselect" onchange="HideErrorMessage(this)"  ${IsView == `true` ? `disabled` : ``} id="ddlHSN_${rowCount}">
                        </select>
                        <span id="spddlHSN_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>

</td>

<td>
				<input type="number" class="form-control MandateSP text-right" value="1"  disabled ${IsView == `true` ? `disabled` : ``} oninput="HideErrorMessage(this); CalculateRate(this)" placeholder="Enter" value="" id="txtMIQty_${rowCount}"/>
				<span id="sptxtMIQty_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
</td>

<td>

                                <select  disabled class="form-control MandateSP applyselect"  ${IsView == `true` ? `disabled` : ``} onchange="HideErrorMessage(this)" id="ddlUnitSFG_${rowCount}">
                                </select>
                                <span id="spddlUnitSFG_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                            </td>


                             <td>
                 <input type="number" id="purchrate_${rowCount}"  oninput="HideErrorMessage(this); SetZero(this)" class="form-control MandateSP text-right" placeholder="0">
                  <span id="sppurchrate_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                 <input type="hidden" id="purchrate1_${rowCount}" />
             </td>

<td>
				<input type="number" class="form-control MandateSP text-right"  ${IsView == `true` || obj.FromClient ? `disabled` : ``}  oninput="HideErrorMessage(this);CalculateRate(this)" onchange="HideErrorMessage(this)" placeholder="Enter" value="" id="txtMISellingPrice_${rowCount}"/>
				<span id="sptxtMISellingPrice_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                 <input type="hidden" id="purch_${rowCount}" />
</td>



				<td class="text-right fn-bold" id="totlCost_${rowCount}"></td>

       
           <td class="text-center">
                                <button type=""  id="addnew_${rowCount}" class="btn hidden  btn-sm  actionbtn mx-auto" data-toggle="modal" onclick="SaveItemMasterDynamicSP(${rowCount})" >Add</button>
        </td>

           

`;



    tableBody.appendChild(newRow);
    $(".applyselect").select2();

    var obj344 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 68,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown(`ddlHSN_${rowCount}`, obj344, 'Select', false, obj.HSN);

    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 72,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }


    LoadMasterDropdown(`ddlUnitSFG_${rowCount}`, obj4, 'Select', false, obj.UoM);

    var obj123 = {};

    if (obj.FromClient) {
        var obj123 = {
            parentId: client_catId,
            masterTableTypeId: 102,
            isMasterTableType: false,
            isManualTable: false,
            manualTable: 0,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
    }

    else {
        var obj123 = {
            parentId: 0,
            masterTableTypeId: 103,
            isMasterTableType: false,
            isManualTable: false,
            manualTable: 0,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
    }
    LoadMasterDropdown(`subcate_${rowCount}`, obj123, 'Select', false, obj.SubCate_Id);

    $('#txtMISellingPrice_' + rowCount).val(obj.SellingPrice).trigger('change');

    $('#totlCost_' + rowCount).html((obj.Qty * obj.SellingPrice).toFixed(2));

    $('#purch_' + rowCount).val(item.IsPurchAvl);
    if (item.IsPurchAvl == 1) {

        const $input = $('#purchrate_' + rowCount);

        // Change type to text
        $input.attr('type', 'text');

        // Remove oninput attribute (only keep HideErrorMessage)
        $input.attr('oninput', 'HideErrorMessage(this)');

        // Set value and disable field
        $input.val('Purchase Rate Available').prop('disabled', true);

        // Store actual purchase rate in hidden field
        $('#purchrate1_' + rowCount).val(item.Purchase_Price);
    }
    else {
        const $input = $('#purchrate_' + rowCount);

        // Change type to text
        $input.attr('type', 'text');

        $input.value = item.Purchase_Price

        // Remove oninput attribute (only keep HideErrorMessage)
        $input.attr('oninput', 'HideErrorMessage(this); SetZero(this)');

        // Set value and disable field
        $input.val('').prop('disabled', false);

        // Store actual purchase rate in hidden field
        $('#purchrate1_' + rowCount).val(item.Purchase_Price);

    }

    if (obj.FromClient) {

        $('#purchrate1_' + rowCount).val(0);
        $('#purchrate_' + rowCount).val(0);
        $('#purchrate_' + rowCount).prop('disabled', true);


    }

}

function MaterialInformationAddRowSP(button) {

    const tableBody = document.querySelector('#printed_packing_sp tbody');

    const rowCount = tableBody.rows.length + 100;

    const rowNo = tableBody.rows.length + 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `

       ${rowNo == 1 ?
            `<td>
                                      <div onclick="AddItemMasterDynamicSP(this);" class="cursor-pointer">
                                                  <img src="../../assets/images/icons/help/add.svg" class="img-15" alt="">
                                      </div>
                                </td>` :

            `<td class="text-center">
		                            <div onclick="deleteRow1(this);">
			                            <img src="../../assets/images/icons/help/close.svg" alt="" class="cursor-pointer img-15">
		                            </div>
	                            </td>`
        }
	
	<td>${rowNo}</td>
    
                            <td class="text-center">
                                <input type="hidden" id="ddlEdit_${rowCount}" value="0" />
                                <input type="checkbox" id="FromClient_${rowCount}" name="FromClient" onclick="ChangeItemDataPPFromClient(this)" value="">
                                <label for="FromClient_${rowCount}" class="m-0 singlecheck pl-0"></label>
                            </td>
                            <td class="text-center">
                                <input type="checkbox" id="NewItem_${rowCount}" onclick="ChangeItemDataPP(this)" name="FromClient" value="">
                                <label for="NewItem_${rowCount}" class="m-0 singlecheck pl-0"></label>
                            </td>
                             <td>
                                <select class="form-control applyselect MandateSP" onchange="HideErrorMessage(this); setItemName(this)" id="subcate_${rowCount}">                                  
                                </select>
                                <span id="spsubcate_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                            </td>

                            <td><div class="autocomplete-wrapper" style="position: relative;">
								<label for="ddlI_${rowCount}" class="search-label">
									<img src="../../assets/images/icons/help/search-icon.png" class="icon-sm">
								</label>
								<input type="text" class="form-control searchlist MandateSP" id="txtMIItemName_${rowCount}" oninput="Getdata(this); HideErrorMessage(this)" onclick="Getdata(this); HideErrorMessage(this)" placeholder="Type item..." autocomplete="off">
								<span id="sptxtMIItemName_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                                 <ul id="globalSuggestionBox_${rowCount}" class="suggestions"></ul>
                                 <input type="hidden" id="ddlItem_${rowCount}" />
				</div>

                           </td>
<td>
	 <input type="text"  class="form-control" disabled value="" id="itemcode_${rowCount}" placeholder="Enter" />		
</td>

<td style="display: none;">
 <select disabled class="form-control applyselect" onchange="HideErrorMessage(this)" id="ddlHSN_${rowCount}">
                        </select>
                        <span id="spddlHSN_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>

</td>

<td>
				<input type="number" class="form-control MandateSP text-right" value="1" disabled oninput="HideErrorMessage(this); CalculateRate(this)" placeholder="Enter" value="" id="txtMIQty_${rowCount}"/>
				<span id="sptxtMIQty_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
</td>

<td>

                                <select disabled class="form-control MandateSP applyselect" onchange="HideErrorMessage(this)" id="ddlUnitSFG_${rowCount}">
                                </select>
                                <span id="spddlUnitSFG_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                            </td

               <td>
                 <input type="number" id="purchrate_${rowCount}" oninput="HideErrorMessage(this); SetZero(this)" class="form-control MandateIng text-right" placeholder="0">
                  <span id="sppurchrate_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                 <input type="hidden" id="purchrate1_${rowCount}" />
             </td>

<td>
				<input type="number" class="form-control MandateSP text-right"  oninput="HideErrorMessage(this);CalculateRate(this)" onchange="HideErrorMessage(this)" placeholder="Enter" value="" id="txtMISellingPrice_${rowCount}"/>
				<span id="sptxtMISellingPrice_${rowCount}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!</span>
                 <input type="hidden" id="purch_${rowCount}" />
</td>


				<td class="text-right fn-bold" id="totlCost_${rowCount}"></td>

      
            <td class="text-center">
                                <button type=""  id="addnew_${rowCount}" class="btn hidden  btn-sm  actionbtn mx-auto" data-toggle="modal" onclick="SaveItemMasterDynamicSP(${rowCount})" >Add</button>
        </td>`;





    tableBody.appendChild(newRow);
    $(".applyselect").select2();

    var obj344 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 68,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown(`ddlHSN_${rowCount}`, obj344, 'Select', false, '');

    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 72,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }

    const unit_pcs = localStorage.getItem("uom4");

    LoadMasterDropdown(`ddlUnitSFG_${rowCount}`, obj4, 'Select', false, unit_pcs);

    var obj123 = {
        parentId: 0,
        masterTableTypeId: 103,
        isMasterTableType: false,
        isManualTable: false,
        manualTable: 0,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown(`subcate_${rowCount}`, obj123, 'Select', false);

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

    // ---------- Recalculate totals ----------
    try { CalculateTotal_packeging(); } catch (e) { console.warn('CalculateTotal_packeging failed', e); }
}


function calculateOtherCharge() {

    let total = getOtherChargesTotal();

    finalTotal_ot = getOtherChargesTotal();

    $('#ot_total').html(`₹ ${total.toFixed(2)}`);


    var totalCountFinal =
        (parseFloat(finalTotal_ot) || 0) +
        (parseFloat(finalTotal_pm) || 0) +
        (parseFloat(finalTotal_sfg) || 0);

    $('#finalTotal').html(`₹ ${totalCountFinal.toFixed(2)}`);

    $('#finalTotal').html(`₹ ${totalCountFinal.toFixed(2)}`);

    return total.toFixed(2);
}
function getOtherChargesTotal() {
    return $('#othercharges input[id^="amt_"]').toArray()
        .reduce((s, el) => s + (parseFloat($(el).val()) || 0), 0);
}

function setItemName(ctrl) {



    var id = ctrl.id;

    var rowId = ctrl.id.split('_')[1];

    let itemName = $('#ddlItemName').val() + ' - ' + $(`#subcate_${rowId} option:selected`).text() + ' - ' + $('#ddlPackSize').val();

    if ($('#NewItem_' + rowId).prop('checked')) {
        $('#itemcode_' + rowId).val(itemName);

        var model = {
            ID: $(`#subcate_${rowId}`).val(),
            TableName: "SubCate"
        };

        const jsonString1 = JSON.stringify(model);
        var ScreenID = "ItemMaster_102";


        if (model.ID > 0) {

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString1, screenId: ScreenID }, 'GET', function (response) {
                console.log(response);

                var tableData = response.data.data.Table;

                if (tableData.length > 0) {
                    $('#ddlHSN_' + rowId).val(tableData[0].HSN_ID).trigger('change');
                }
                else {
                    $('#ddlHSN_' + rowId).val('Select').trigger('change');
                }


            });
        }
    }


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

function CalculateRate2(rowId) {



    $('#totlCost_' + rowId).html(($('#txtMIQty_' + rowId).val() * $('#txtMISellingPrice_' + rowId).val()).toFixed(2));

    CalculateTotal_packeging();



}

function ChangeItemDataPPFromClient(ctrl) {




    var id = ctrl.id;

    var rowId = ctrl.id.split('_')[1];


    if ($('#' + id).prop('checked')) {

        $('#txtMISellingPrice_' + rowId).val(0).trigger('change');
        $('#txtMISellingPrice_' + rowId).prop('disabled', true);

        $('#purchrate_' + rowId).val(0).trigger('change');
        $('#purchrate_' + rowId).prop('disabled', true);

        CalculateRate2(rowId);


        var obj = {
            parentId: client_catId,
            masterTableTypeId: 102,
            isMasterTableType: false,
            isManualTable: false,
            manualTable: 0,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('subcate_' + rowId, obj, 'Select', false);
    }
    else {
        $('#txtMISellingPrice_' + rowId).prop('disabled', false);
        $('#purchrate_' + rowId).prop('disabled', false);

        if (rowId < 100) {

            $('#NewItem_' + rowId).prop('checked', false).trigger('change');



            $('#txtMIQty_' + rowId).val('1');

            $('#txtMIItemName_' + rowId).prop('disabled', false);

            $('#ddlHSN_' + rowId).prop('disabled', true);
            $('#ddlUnitSFG_' + rowId).prop('disabled', true);
            //$('#ddlHSN_' + rowId).val('Select').trigger('change');
            // $('#ddlUnitSFG_' + rowId).val('Select').trigger('change');
            $('#itemcode_' + rowId).val('');
            $('#txtMIItemName_' + rowId).val('');

        }

        var obj123 = {
            parentId: 0,
            masterTableTypeId: 103,
            isMasterTableType: false,
            isManualTable: false,
            manualTable: 0,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown(`subcate_${rowId}`, obj123, 'Select', false);


    }

    if ($('#NewItem_' + rowId).prop('checked')) {
        if ($('#FromClient_' + rowId).prop('checked')) {
            model = {
                ID: -1,
                OtherId: client_catId,
                ModuleId: 6
            }
        }
        else {
            model = {
                ID: -1,
                OtherId: 0,
                ModuleId: 6
            }
        }
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
            var tblDocNo = response.data.data.Table;
            if (tblDocNo[0].DocLock == 0) {


                let itemName = $('#ddlItemName').val() + ' - ' + $(`#subcate_${rowId} option:selected`).text();
                let itemData = $('#ddlItemName').val();
                let pack = $('#ddlPackSize').val();

                if (localStorage.getItem("uom1")) {

                    $('#ddlUnitSFG_' + rowId).val(localStorage.getItem("uom1")).trigger('change');
                }

                if (itemData != "" && pack != "") {
                    $('#txtMIItemName_' + rowId).val(tblDocNo[0].DocNumber);
                    $('#itemcode_' + rowId).val(itemName);

                }
                else {
                    FailToaster("Please select required data Item Name and Pack Size.");
                    ctrl.checked = false;
                }


            }


        });
    }


}

function ChangeItemDataPP(ctrl) {

    var id = ctrl.id;

    var rowId = ctrl.id.split('_')[1];

    if (rowId < 100 && !$('#FromClient_' + rowId).prop('checked') && $('#' + id).prop('checked')) {
        $('#' + id).prop('checked', false);
        return;
    }

    if ($('#ddlItem').val() != "") {






        if ($('#' + id).prop('disabled')) {
            return;
        }
        else {
            if ($('#' + id).prop('checked')) {

                $('#addnew_' + rowId).removeClass('hidden');



                $('#txtMIQty_' + rowId).val(1);
                $('#txtMIQty_' + rowId).prop('disabled', true);

                var model = {}

                if ($('#FromClient_' + rowId).prop('checked')) {
                    model = {
                        ID: -1,
                        OtherId: client_catId,
                        ModuleId: 6
                    }
                }
                else {
                    model = {
                        ID: -1,
                        OtherId: 0,
                        ModuleId: 6
                    }
                }
                const jsonString = JSON.stringify(model);
                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {
                    var tblDocNo = response.data.data.Table;
                    if (tblDocNo[0].DocLock == 0) {


                        let itemName = $('#ddlItemName').val() + ' - ' + $(`#subcate_${rowId} option:selected`).text();
                        let itemData = $('#ddlItemName').val();
                        let pack = $('#ddlPackSize').val();

                        if (localStorage.getItem("uom1")) {

                            $('#ddlUnitSFG_' + rowId).val(localStorage.getItem("uom1")).trigger('change');
                        }

                        if (itemData != "" && pack != "") {
                            $('#txtMIItemName_' + rowId).val(tblDocNo[0].DocNumber);
                            $('#txtMIItemName_' + rowId).prop('disabled', true);
                            $('#itemcode_' + rowId).val(itemName);
                            /*                            $('#ddlHSN_' + rowId).prop('disabled', false);*/
                            /*   $('#ddlUnitSFG_' + rowId).prop('disabled', false);*/
                            //$('#ddlHSN_' + rowId).val('Select').trigger('change');
                            // $('#ddlUnitSFG_' + rowId).val('Select').trigger('change');
                        }
                        else {
                            FailToaster("Please select required data Item Name and Pack Size.");
                            ctrl.checked = false;
                        }


                    }


                });



                $('#txtMIItemName_' + rowId).val('');

            }
            else {
                $('#addnew_' + rowId).addClass('hidden');
                $('#txtMIQty_' + rowId).val('1');


                $('#txtMIItemName_' + rowId).prop('disabled', false);

                $('#ddlHSN_' + rowId).prop('disabled', true);
                $('#ddlUnitSFG_' + rowId).prop('disabled', true);
                //$('#ddlHSN_' + rowId).val('Select').trigger('change');
                // $('#ddlUnitSFG_' + rowId).val('Select').trigger('change');
                $('#itemcode_' + rowId).val('');
                $('#txtMIItemName_' + rowId).val('');
            }

        }
    }
    else {
        FailToaster("Please select required data Item Name and Pack Size and  Kindly add the item infromation.");
        ctrl.checked = false;
    }
}

function AddItemMasterDynamic(id) {

    if (checkValidationOnSubmit('MandatePP')) {
        MaterialInformationAddRow();
    }
}
function SaveItemMasterDynamic(id) {

    if (checkValidationOnSubmit('MandatePP')) {

        const tableBody = document.querySelector('#printed_packing tbody');

        const rowCounts = id;

        // var rowId = PP_MaterialInfoArr[rowCounts - 1].rowId;

        //if (PP_MaterialInfoArr.length > 1) {
        //    var rowId = PP_MaterialInfoArr[rowCounts - 1].rowId;
        //}
        //else {
        //    rowId = -1;
        //}




        var model = {
            ID: $(`#subcate_${rowCounts}`).val(),
            TableName: "SubCate"
        };

        const jsonString = JSON.stringify(model);
        var ScreenID = "ItemMaster_102";




        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
            console.log(response);

            var tableData = response.data.data.Table;

            if (tableData.length < 0) {
                FailToaster('Please Map HSN to Charge Data in settings before proceeding!!!');
                return;
            }

            var itemChargePMData = [];

            if (tableData.length > 0) {
                tableData.forEach(row => {
                    /*if (row.ChargeId > 0 && row.TaxPer > 0) {*/
                    if (row.CHRG_ID > 0) {
                        itemChargePMData.push({
                            ChargeTypeId: row.CHRG_TYPE_ID,
                            Charge: row.Charge,
                            ChargeId: row.CHRG_ID,
                            TaxPer: row.CHRG_PER
                        });

                    }
                });
            }

            const rowCount = rowCounts;
            const obj = {
                rowId: rowCount,
                fromClient: $(`#FromClient_${rowCount}`).prop('checked'),
                newItem: $(`#NewItem_${rowCount}`).prop('checked'),
                subcate: $(`#subcate_${rowCount}`).val(),
                itemcode: $(`#txtMIItemName_${rowCount}`).val(),
                ItemName: $(`#itemcode_${rowCount}`).val(),
                ItemId: $(`#ddlItem_${rowCount}`).val() > 0 ? $(`#ddlItem_${rowCount}`).val() : 0,
                HSN: $(`#ddlHSN_${rowCount}`).val(),
                Qty: $(`#txtMIQty_${rowCount}`).val(),
                UNIT: $(`#ddlUnitSFG_${rowCount}`).val(),
                SellingPrice: $(`#txtMISellingPrice_${rowCount}`).val(),
                totalCost: $(`#totlCost_${rowCount}`).val()
            };
            PP_MaterialInfoArr.push(obj);

            // console.log(obj);
            var itemId = SaveItemMasterOfPP(obj, 'pp', itemChargePMData);

        });

        //  let index = PP_MaterialInfoArr.findIndex(input => input.rowId == id);

        //  PP_MaterialInfoArrp[index].itemId = itemId



    }

    // MaterialInformationAddRow();

    //data - target="#confirmpopup"

}

function AddItemMasterDynamicSP(id) {

    if (checkValidationOnSubmit('MandateSP')) {
        MaterialInformationAddRowSP();

    }
}
function SaveItemMasterDynamicSP(id) {

    if (checkValidationOnSubmit('MandateSP')) {

        const tableBody = document.querySelector('#printed_packing_sp tbody');

        const rowCounts = id;

        // var rowId = PP_MaterialInfoArr[rowCounts - 1].rowId;

        //if (PP_MaterialInfoArr.length > 1) {
        //    var rowId = PP_MaterialInfoArr[rowCounts - 1].rowId;
        //}
        //else {
        //    rowId = -1;
        //}


        var model = {
            ID: $(`#subcate_${rowCounts}`).val(),
            TableName: "SubCate"
        };

        const jsonString = JSON.stringify(model);
        var ScreenID = "ItemMaster_102";




        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
            console.log(response);

            var tableData = response.data.data.Table;

            if (tableData.length < 0) {
                FailToaster('Please Map HSN to Charge Data in settings before proceeding!!!');
                return;
            }

            var itemChargePMData = [];

            if (tableData.length > 0) {
                tableData.forEach(row => {
                    /*if (row.ChargeId > 0 && row.TaxPer > 0) {*/
                    if (row.CHRG_ID > 0) {
                        itemChargePMData.push({
                            ChargeTypeId: row.CHRG_TYPE_ID,
                            Charge: row.Charge,
                            ChargeId: row.CHRG_ID,
                            TaxPer: row.CHRG_PER
                        });

                    }
                });
            }

            const rowCount = rowCounts;
            const obj = {
                rowId: rowCount,
                fromClient: $(`#FromClient_${rowCount}`).prop('checked'),
                newItem: $(`#NewItem_${rowCount}`).prop('checked'),
                subcate: $(`#subcate_${rowCount}`).val(),
                itemcode: $(`#txtMIItemName_${rowCount}`).val(),
                ItemName: $(`#itemcode_${rowCount}`).val(),
                ItemId: $(`#ddlItem_${rowCount}`).val() > 0 ? $(`#ddlItem_${rowCount}`).val() : 0,
                HSN: $(`#ddlHSN_${rowCount}`).val(),
                Qty: $(`#txtMIQty_${rowCount}`).val(),
                UNIT: $(`#ddlUnitSFG_${rowCount}`).val(),
                SellingPrice: $(`#txtMISellingPrice_${rowCount}`).val(),
                totalCost: $(`#totlCost_${rowCount}`).val()
            };
            PP_MaterialInfoArr.push(obj);

            // console.log(obj);
            var itemId = SaveItemMasterOfPP(obj, 'sp', itemChargePMData);

        });



    }

    // MaterialInformationAddRow();

    //data - target="#confirmpopup"

}


function SaveItemMasterOfPP(item, type, itemChargePMData) {
    // var id = parseInt($("#hdnItemMasterId").val());

    // if (checkValidationOnSubmit(validationClass) == true) {

    if (item.HSN == 'Select') {
        FailToaster('Please map the hsn to subcategory before proceeding!!!');
        return
    }

    if (!itemChargePMData || itemChargePMData.length <= 0) {
        FailToaster('Please Map HSN to Charge Data in settings before proceeding!!!');
        return;
    }



    var obj = ItemCodeList.find(input => input.Category == 'Packing Material');

    var itemModel =
    {
        ID: 0,
        ITEM_CODE: item.itemcode,
        ITEM_NAME: item.ItemName,
        HSN_ID: item.HSN,
        STATUS: 'Active',  // Active or Inactive
        DESCRIPTION: item.ItemName,
        WAREHOUSE_ID: 0,
        BATCH_APPLICABLE: 'No',
        CATEGORY_ID: item.fromClient ? client_catId : obj.Category_Id,
        SUBCATEGORY_ID: item.subcate,
        BASE_UNIT_ID: item.UNIT,
        //ALTERNATE_UNIT: $("#txtAlternateUnit").val(),
        ALTERNATE_UNIT_ID: item.UNIT,
        CONVERSION_FACTOR: 1,
        /*TAX_CODE_ID: $("#ddlCharge").val() > 0 ? $("#ddlCharge").val() : 0,*/
        TAX_CODE_ID: 0,
        PURCH_RATE: 0,
        SALE_RATE: 0,

        MIN_STOCK_LEVEL: 0,
        MAX_STOCK_LEVEL: 0,
        SAFETY_STOCK_LEVEL: 0,
        PREFFERED_SUPPLIER: $("#ddlPreferredSupplier").val() > 0 ? $("#ddlPreferredSupplier").val() : 0,
        LEAD_TIME: 0,
        LEAD_TIME_TYPE: $("#ddlLoadTime").val(),
        PACK_SIZE: '',
        TOLERANCE: 0,
        BRAND_TYPE_Id: 0,
        ITEM_TYPE: 'I',
        UserTypeId: 0,
        QC_APPLICABLE: 'Yes',
        IsBioMetrically: $('input[name="biometrically"]:checked').val(),
        ItemTaxChargeData: itemChargePMData,

        PurchAccountId: $("#ddlPurchAccName").val() > 0 ? $("#ddlPurchAccName").val() : 0,
        SaleAccountId: $("#ddlSaleAccName").val() > 0 ? $("#ddlSaleAccName").val() : 0

    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(itemModel);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "ItemMaster_101",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString1
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {

            const scopeId = response.ScopeID

            if (scopeId > 0) {


                const rowID = item.rowId;

                var model =
                {
                    ColumnName: 'Name',
                    SearchData: 'Filter By Finished Goods List'
                };
                const jsonString = JSON.stringify(model);
                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_104' }, 'GET', function (response) {

                    ItemCodeList = response.data.data.Table;

                    var item_list = ItemCodeList.find(input => input.ITEM_ID == scopeId)

                    $('#ddlItem_' + rowID).val(item_list.ITEM_ID);
                    $('#itemcode_' + rowID).val(item_list.ITEM_NAME);
                    $('#txtMIItemName_ ' + rowID).val(item_list.ITEM_CODE);
                    $('#NewItem_' + rowID).prop('disabled', true);
                    $('#ddlEdit_' + rowID).val(1);
                    $('#addnew_' + rowID).addClass('hidden');
                    //var $ele = $('#ddlItem_0');
                    //$ele.empty();
                    //$ele.append($('<option/>').val('Select').text('Select'));
                    //$.each(ItemCodeList, function (ii, vall)
                    //{
                    //    var displayText = vall.ITEM_NAME + " (" + vall.ITEM_CODE + ")"; // Format: ITEM_NAME (ITEM_CODE)
                    //    $ele.append($('<option />').val(vall.ITEM_ID).text(displayText));
                    //})

                    //if (type == 'pp') {
                    //    MaterialInformationAddRow();
                    //}
                    //else if (type == 'sp') {
                    //    MaterialInformationAddRowSP();
                    //}

                    return scopeId;

                });
            }
            else {
                return -1;
            }

        }
        else {
            return -1;
        }
    });
    //}
}


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




function GetBOMDetById(id) {

    var model =
    {
        Id: id,
        Type: 11
    };

    IsView = 'false'

    // localStorage.removeItem('viewBOM');

    if (IsView == 'true') {
        $('#sbtFGBOM').hide();
    }


    if (IsView == 'true') {
        $('#bomSubmit').hide();
        $('#btnSave').hide();

    }

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp5_101' }, 'GET', function (response) {

        console.log(response);


        var data = response.data.data.Table[0];


        $("#ddlBOMCategory").val(data.Category).trigger('change');
        $('#ddlBOMCategory').prop('disabled', true);
        $("#txtBOMNumber").val(data.BOMNumber);
        $("#txtSampleID").val(data.SampleId == null ? '' : data.SampleId);
        $("#ddlPackSize").val(data.PackSize);
        $("#bomQty").val(data.Quantity)
        $('#txtMIItemName').val(data.Item_Code);
        $('#ddlItemName').val(data.ITEM_NAME);
        $('#ddlItem').val(data.ITEM_ID);
        $("#txtCustomerName").val(data.CustomerCompany)
        $("#txtBrandName").val(data.CompanyBrandName)
        // $('#ddlContactPerson option:selected').text()
        $("#txtRemarks").val(data.Remarks)
        $('#ddlCustomer').val(data.customer_id)
        // $('#ddlContactPerson').val(data.contactperson_id)

        client_catId = data.Client_CatID;

        $("#ddlBOMCategory").prop('disabled', true);
        $('#ddlBOMCategory').prop('disabled', true);
        $("#txtBOMNumber").prop('disabled', true);
        $("#txtSampleID").prop('disabled', true);
        $("#ddlPackSize").prop('disabled', true);
        $("#bomQty").prop('disabled', true);
        $('#txtMIItemName').prop('disabled', true);
        $('#ddlItemName').prop('disabled', true);
        $('#ddlItem').prop('disabled', true);
        $("#txtCustomerName").prop('disabled', true);
        $("#txtBrandName").prop('disabled', true);
        // $('#ddlContactPerson option:selected').text()
        $("#txtRemarks").prop('disabled', true);
        $('#ddlCustomer').prop('disabled', true);

        $('#ddlContactPerson').prop('disabled', true);
        $('#ddlHSN').prop('disabled', true);
        $('#ddlUnitSFG').prop('disabled', true);




        var obj344 = {
            parentId: data.ERP_Party_Temp_ID,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 98,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlContactPerson', obj344, 'Select', false, data.contactperson_id);



        $('#ddlItemSFG').val(data.SFG_ItemId);
        $('#txtItemSFG').val(data.SFG_ItemName)
        $('#SFGItemCode').html(data.SFG_ItemName)
        $('#ddlSFGSaleRate').val(data.SaleRate)
        $('#txtSFGQty').val(data.SFGQty)
        $("#txtRemarks").val(data.Remarks);
        $('#txtSAmpleId').val(data.SampleId);
        $('#totalRateSFG').html(((parseFloat(data.SFGQty) || 0) * (parseFloat(data.SaleRate) || 0)).toFixed(2));

        if (IsView == 'true') {
            $('#txtItemSFG').prop('disabled', true);
            $('#ddlSFGSaleRate').prop('disabled', true);
        }

        $('#sfg_total').html(`₹ ` + ((parseFloat(data.SFGQty) || 0) * (parseFloat(data.SaleRate) || 0)).toFixed(2));

        var obj3 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 68,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }
        LoadMasterDropdown('ddlHSN', obj3, 'Select', false, data.HSN_Id);

        var obj4 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 72,
            manualTableId: 0,
            ScreenId: 'DropdownList_101'
        }


        LoadMasterDropdown('ddlUnitSFG', obj4, 'Select', false, data.Stock_Unit_ID);


        var pp_arr = response.data.data.Table5.filter(input => input.Reference == 'PP')

        var sp_arr = response.data.data.Table5.filter(input => input.Reference == 'SP')
        //var index = 0;
        for (item of pp_arr) {

            MaterialInformationAddRowEdit(item, IsView);

        }

        if (sp_arr.length <= 0) {
            MaterialInformationAddRowSP();
        }

        for (item of sp_arr) {
            MaterialInformationAddRowSPEdit(item, IsView);
        }

        LoadOtherChargesEdit(response.data.data.Table6, IsView);

        calculateSFG();
        calculateOtherCharge();
        CalculateTotal_packeging();


        //        CalculateTotal();

        //    index++;

        //}


        //// EditQCValues(response.data.data.Table2);

        //index = 0;
        //for (item of response.data.data.Table2) {

        //    if (index == 0) {
        //        $('#txtManufacturingProcess_0').val(item.ProcessDescription);
        //        $('#txtManufacturingRPM_0').val(item.RPM);
        //        $('#txtManufacturingTemp_0').val(item.Temperature);


        //        if (IsView == 'true') {
        //            $('#txtManufacturingProcess_0').prop('disabled', true);
        //            $('#txtManufacturingRPM_0').prop('disabled', true);
        //            $('#txtManufacturingTemp_0').prop('disabled', true);

        //            $("#tblManufacturingProcess tbody tr td:first-child div").hide();
        //        }

        //    }
        //    else {
        //        var rowIndex = ManufacturingProcessAddRow();


        //        $('#txtManufacturingProcess_' + rowIndex).val(item.ProcessDescription);
        //        $('#txtManufacturingRPM_' + rowIndex).val(item.RPM);
        //        $('#txtManufacturingTemp_' + rowIndex).val(item.Temperature);

        //        $('#txtManufacturingProcess_' + rowIndex).prop('diabled', true);
        //        $('#txtManufacturingRPM_' + rowIndex).prop('diabled', true);
        //        $('#txtManufacturingTemp_' + rowIndex).prop('diabled', true);

        //        if (IsView == 'true') {
        //            $('#txtManufacturingProcess_' + rowIndex).prop('disabled', true);
        //            $('#txtManufacturingRPM_' + rowIndex).prop('disabled', true);
        //            $('#txtManufacturingTemp_' + rowIndex).prop('disabled', true);

        //            $("#tblManufacturingProcess tbody tr td:first-child div").hide();
        //        }


        //    }
        //    index++;

        //}


        //index = 0;
        //for (item of response.data.data.Table3) {

        //    if (index == 0) {

        //        $('#txtUOM_0').val(item.UoM);
        //        $('#txtResultType_0').val(item.ResultType);
        //        $('#txtMeasuringUnit_0').val(item.MeasuringUnit);


        //        var obj6 = {
        //            parentId: 0,
        //            masterTableTypeId: 0,
        //            isMasterTableType: false,
        //            isManualTable: true,
        //            manualTable: 8,
        //            manualTableId: 0,
        //            ScreenId: 'ERP_FMS_101'
        //        }
        //        LoadMasterDropdown(`ddlBOMTestName_0`, obj6, 'Select', false, item.TestName);


        //        if (IsView == 'true') {
        //            $('#ddlBOMTestName_0').prop('disabled', true);
        //            $('#txtUOM_0').prop('disabled', true);
        //            $('#txtResultType_0').prop('disabled', true);
        //            $('#txtMeasuringUnit_0').prop('disabled', true);

        //            $("#tblQualityParameters tbody tr td:first-child div").hide();
        //        }

        //    }
        //    else {
        //        var rowIndex = QualityParametersAddRowEdit(item.TestName);


        //        $('#txtUOM_' + rowIndex).val(item.UoM);
        //        $('#txtResultType_' + rowIndex).val(item.ResultType);
        //        $('#txtMeasuringUnit_' + rowIndex).val(item.MeasuringUnit);

        //        if (IsView == 'true') {
        //            $('#ddlBOMTestName_' + rowIndex).prop('disabled', true);
        //            $('#txtUOM_' + rowIndex).prop('disabled', true);
        //            $('#txtResultType_' + rowIndex).prop('disabled', true);
        //            $('#txtMeasuringUnit_' + rowIndex).prop('disabled', true);

        //            $("#tblQualityParameters tbody tr td:first-child div").hide();
        //        }


        //    }
        //    index++;

        //}
        // console.log(response.data.data.Table4);
        var taxNameData = [];
        var tbklchargeData = response.data.data.Table7
        for (var i = 0; i < tbklchargeData.length; i++) {
            itemChargeData.push({
                ChargeTypeId: tbklchargeData[i].ChargeTypeId,
                Charge: tbklchargeData[i].Charge,
                ChargeId: tbklchargeData[i].ChargeId,
                TaxPer: tbklchargeData[i].TaxPer
            });

            taxNameData.push(tbklchargeData[i].TaxName);
        }

        $('#itemCharges').text(taxNameData.join(", "));

        sessionStorage.setItem("chargeData", JSON.stringify(itemChargeData));

        for (var i = 0; i < response.data.data.Table4.length; i++) {
            var fileName = response.data.data.Table4[i].ActualFileName;
            var fileType = response.data.data.Table4[i].FileType;
            var type = response.data.data.Table4[i].Type;
            var fileUrl = response.data.data.Table4[i].FileUrl;
            var fFd = response.data.data.Table4[i].AttachmentID;
            var fSize = response.data.data.Table4[i].FileSize;
            var newfileName = response.data.data.Table4[i].NewFileName;

                LoadFileDataDownload(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);

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


function SaveItemMaster(validationClass) {
    // var id = parseInt($("#hdnItemMasterId").val());

    if (checkValidationOnSubmit(validationClass) == true) {




        if (itemchargeDataFG.length == 0) {
            FailToaster('Please map the hsn of FG in settings master!!!');
            return;
        }

        if ($('#txtBrandName').val().length <= 0) {
            FailToaster('Please select company brand name!!');
            return;
        }

        var obj = ItemCodeList.find(input => input.Category == 'Finished Goods');

        var itemModel =
        {
            ID: 0,
            ITEM_CODE: $("#txtMIItemName").val(),
            ITEM_NAME: $("#ddlItemName").val() + ' - ' + $('#txtBrandName').val(),
            HSN_ID: $("#ddlHSN").val(),
            STATUS: 'Active',  // Active or Inactive
            DESCRIPTION: $("#ddlItemName").val(),
            WAREHOUSE_ID: 0,
            BATCH_APPLICABLE: 'Yes',
            CATEGORY_ID: obj.Category_Id,
            SUBCATEGORY_ID: 0,
            BASE_UNIT_ID: localStorage.getItem("uom1") || 0,
            //ALTERNATE_UNIT: $("#txtAlternateUnit").val(),
            ALTERNATE_UNIT_ID: localStorage.getItem("uom1") || 0,
            CONVERSION_FACTOR: 1,
            /*TAX_CODE_ID: $("#ddlCharge").val() > 0 ? $("#ddlCharge").val() : 0,*/
            TAX_CODE_ID: 0,
            PURCH_RATE: 0,
            SALE_RATE: 0,

            MIN_STOCK_LEVEL: 0,
            MAX_STOCK_LEVEL: 0,
            SAFETY_STOCK_LEVEL: 0,
            PREFFERED_SUPPLIER: $("#ddlPreferredSupplier").val() > 0 ? $("#ddlPreferredSupplier").val() : 0,
            LEAD_TIME: 0,
            LEAD_TIME_TYPE: $("#ddlLoadTime").val(),
            PACK_SIZE: $("#ddlPackSize").val(),
            TOLERANCE: 0,
            BRAND_TYPE_Id: $("#ddlBrandType").val() > 0 ? $("#ddlBrandType").val() : 0,
            ITEM_TYPE: 'I',
            UserTypeId: 0,
            QC_APPLICABLE: 'No',
            IsBioMetrically: $('input[name="biometrically"]:checked').val(),
            ItemTaxChargeData: itemchargeDataFG,

            PurchAccountId: $("#ddlPurchAccName").val() > 0 ? $("#ddlPurchAccName").val() : 0,
            SaleAccountId: $("#ddlSaleAccName").val() > 0 ? $("#ddlSaleAccName").val() : 0

        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(itemModel);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "ItemMaster_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                itemIdFGNew = response.ScopeID;

                if (itemIdFGNew > 0) {

                    var model =
                    {
                        ColumnName: 'Name',
                        SearchData: 'Filter By Finished Goods List'
                    };
                    const jsonString = JSON.stringify(model);
                    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_104' }, 'GET', function (response) {

                        ItemCodeList = response.data.data.Table;

                        var item_list = ItemCodeList.find(input => input.ITEM_ID == itemIdFGNew)

                        $('#ddlItem').val(item_list.ITEM_ID);
                        $('#txtMIItemName').val(item_list.ITEM_CODE);


                        $('#ddlItemName').val(item_list.ITEM_NAME);

                        $('#ddlItemName').prop('disabled', true);
                        $('#ddlPackSize').prop('disabled', true);
                        $('#bomQty').prop('disabled', true);
                        $('#ddlHSN').prop('disabled', true);

                        $('#savefg').prop('disabled', true);
                        $('#savefg').addClass('btn-success');
                        $('#savefg').text('Added');
                        $('#newItemFG').hide();


                    });

                }



            }
        });
    }
}

var fileModelList = []

function LoadFileDataDownload(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {

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
function hasDuplicateItemIds(data) {
    const itemIds = new Set();
    for (const row of data) {
        if (itemIds.has(row.ItemId)) {
            itemIds.add(row.ItemId);
            console.log(itemIds);
            return 1; // duplicate found
        }
        else if (!parseInt(row.ItemId)) {
            return 2;
        }
        itemIds.add(row.ItemId);
    }
    return 0;
}





function extractNumber(str) {
    if (!str) return null;
    // treat parentheses as negative, remove currency symbol, keep digits, commas, dot and minus
    const s = String(str).trim();
    const isParens = /^\s*\(.*\)\s*$/.test(s);
    // find the first numeric-like token (handles thousands commas)
    const m = s.match(/-?[\d,]+(?:\.\d+)?/);
    if (!m) return null;
    // remove commas and convert to Number
    const num = Number(m[0].replace(/,/g, ''));
    return isNaN(num) ? null : (isParens ? -num : num);
}




async function SaveBOMData() {

    var ingred = [];
    var qc = [];
    var process = [];


    let MandateSP = true;
    let isSP = 0;

    if ($('#FromClient_100').prop('checked') || $('#NewItem_100').prop('checked') || $('#subcate_100').val() > 0 || $('#txtMIItemName_100').val().length > 0) {
        MandateSP = checkValidationOnSubmit('MandateSP');
        isSP = 1;
    }

    if (checkValidationOnSubmit('MandatePP') == true && checkValidationOnSubmit('MandateSP') == true) {
        //var bomJson = buildBOMJson();
        // debugger
        //  const jsonString = BuildBOMJson();



        let isGarbage = 0;


        if (!$('#Confirm').prop('checked')) {
            FailToaster('Please accept all the terms and conditions before proceeding!!!');
            return;
        }



        const itemCode = ItemCodeList.find(input => input.ITEM_ID == $('#ddlItem').val())


        var FormulaInformation = {
            Category: $("#ddlBOMCategory").val(),
            BOMNumber: $("#txtBOMNumber").val(),
            SampleID: $('#txtSAmpleId').val(),
            ItemCode: itemCode.ITEM_CODE,
            PackSize: $("#ddlPackSize").val(),
            Quantity: $("#bomQty").val(),
            WastagePercent: 0,
            FormulatedBy: '',
            FMCode: '',
            CustomerCompany: $("#txtCustomerName").val(),
            BrandName: $("#txtBrandName").val(),
            ContactPerson: $('#ddlContactPerson option:selected').text(),
            Remarks: $("#txtRemarks").val(),
            EditMode: bomId > 0 ? 1 : 0,
            ExistingBOMId: bomId,
            Customer_Id: $('#ddlCustomer').val(),
            ContactPerson_Id: $('#ddlContactPerson').val(),
            SFG_ItemId: $('#ddlItemSFG').val(),
            SaleRate: $('#ddlSFGSaleRate').val(),
            SFGQty: $('#txtSFGQty').val(),
            IsFMS: 1,
            Order_ItemID: localStorage.getItem('Order_ItemID') ? localStorage.getItem('Order_ItemID') : 0
        };



        var material = [];

        let isnotAdded = true;

        $("#printed_packing tbody tr").each(function (index) {
            // same rowNo logic you used
            let rowNo = index + 1;

            let row = {
                FromClient: $(`#FromClient_${rowNo}`).is(":checked") ? 1 : 0,
                NewItem: $(`#NewItem_${rowNo}`).is(":checked") ? 1 : 0,
                SubCategoryId: $(`#subcate_${rowNo}`).val(),
                SubCateName: $(`#subcate_${rowNo} option:selected`).text(),
                ItemName: $(`#itemcode_${rowNo}`).val(),
                ItemCode: $(`#txtMIItemName_${rowNo}`).val(),
                ItemId: $(`#ddlItem_${rowNo}`).val(),
                HSN: $(`#ddlHSN_${rowNo}`).val(),
                Qty: parseFloat($(`#txtMIQty_${rowNo}`).val() || 0),
                UoM: $(`#ddlUnitSFG_${rowNo}`).val(),
                SellingPrice: parseFloat($(`#txtMISellingPrice_${rowNo}`).val() || 0),
                TotalCost: parseFloat(($(`#totlCost_${rowNo}`).text() || "0").replace(/,/g, "")),
                Purchase_Price: $('#purch_' + rowNo).val() == 1 ? $('#purchrate1_' + rowNo).val() : $('#purchrate_' + rowNo).val(),
                IsPurchAvl: $('#purch_' + rowNo).val(),
                TYPE: 'PP'// read from cell
            };

            // push only if there's a meaningful selection (mirrors your pattern)
            if (row.ItemName || row.Qty > 0) {
                material.push(row);
            }
            // push only if there's a meaningful selection (mirrors your pattern)
            if (!$('#addnew_' + rowNo).hasClass('hidden')) {
                isnotAdded = false;
                return false;
            }
        });

        if (isnotAdded == false) {
            FailToaster('Please add all the items in Primary Packeging and then proceed!!!');
            return;
            ;
        }

        var material_sp = [];
        let isnotAddedSP = true;
  

        $("#printed_packing_sp tbody tr").each(function (index) {
            let rowNo = index + 100

            let row = {
                FromClient: $(`#FromClient_${rowNo}`).is(":checked") ? 1 : 0,
                NewItem: $(`#NewItem_${rowNo}`).is(":checked") ? 1 : 0,
                SubCategoryId: $(`#subcate_${rowNo}`).val(),
                SubCateName: $(`#subcate_${rowNo} option:selected`).text(),
                ItemName: $(`#itemcode_${rowNo}`).val(),
                ItemCode: $(`#txtMIItemName_${rowNo}`).val(),
                ItemId: $(`#ddlItem_${rowNo}`).val(),
                HSN: $(`#ddlHSN_${rowNo}`).val(),
                Qty: parseFloat($(`#txtMIQty_${rowNo}`).val() || 0),
                UoM: $(`#ddlUnitSFG_${rowNo}`).val(),
                SellingPrice: parseFloat($(`#txtMISellingPrice_${rowNo}`).val() || 0),
                TotalCost: parseFloat(($(`#totlCost_${rowNo}`).text() || "0").replace(/,/g, "")),
                Purchase_Price: $('#purch_' + rowNo).val() == 1 ? $('#purchrate1_' + rowNo).val() : $('#purchrate_' + rowNo).val(),
                IsPurchAvl: $('#purch_' + rowNo).val(),
                TYPE: 'SP'
            };

            if (row.ItemName || row.Qty > 0) {
                material_sp.push(row);
            }

            if (!$('#addnew_' + rowNo).hasClass('hidden')) {
                isnotAddedSP = false;
                return false;
            }
        });

        if (isnotAddedSP == false) {
            FailToaster('Please add all the items in Secondary Packeging and then proceed!!!');
            return;
            ;
        }

        //var obj =
        //{
        //    FolderNames: "BOMDocuments/"
        //}
        //var type = 1;//This is for  common upload in attachment folder.
        //const jsonString1 = JSON.stringify(obj);
        //const result1 = await MultiFileUploadWithoutAync("fileIndent", jsonString1, type, fileDataCollection);

        //var fileData = [];
        //if (result1.Data != undefined) {
        //    fileData = JSON.parse(result1.Data).FileModelList;
        //    fileData = fileData.concat(fileModelList);
        //}
        //else {
        //    fileData = fileModelList;
        //}



        if (hasDuplicateItemIds(material) == 1) {
            FailToaster('Duplicate Items found in Primary Packaging!!');
            return;
        }
        else if (hasDuplicateItemIds(material) == 2) {
            FailToaster('Item Name Not found in Primary Packaging!!');
            return;
        }

     

        if (isSP == 1) {

            if (hasDuplicateItemIds(material_sp) == 1) {
                FailToaster('Duplicate Items found in Secondary Primary Packaging!!');
                return;
            }
            else if (hasDuplicateItemIds(material_sp) == 2) {
                FailToaster('Item Name Not found in Secondary Primary Packaging!!');
                return;
            }
        }


        if (isSP == 0) {
            material_sp = [];
        }

        const pp_arr = [...material, ...material_sp]

        console.log(pp_arr);


        var othercharges_data = [];

        for (var i = 0; i < OtherCharges_Arr.length; i++) {

            const obj = {
                ID: OtherCharges_Arr[i].ID,
                FIELD_NAME: OtherCharges_Arr[i].FIELD_NAME,
                Amount: $('#amt_' + OtherCharges_Arr[i].ID).val(),
                Comment: $('#remark_' + OtherCharges_Arr[i].ID).val()
            }

            othercharges_data.push(obj);
        }



        var model = {
            FormulaInformation: FormulaInformation,
            PrintedPackingMaterialInformation: pp_arr,
            OtherCharges: othercharges_data,
            Attatchements: fileModelList
        }

 
        let isValid = true;
        //for (var i = 0; i < pp_arr.length; i++) {

        //    if (pp_arr[i].HSN == 'Select' || pp_arr[i].HSN <= 0) {

        //        let name = pp_arr[i].TYPE == 'PP' ? 'Primary Packeging' : 'Secondary Packeging';

        //        FailToaster(`Please bind the HSN of the following subcategory: ${pp_arr[i].SubCateName} in ${name}`);

        //        isValid = false;
        //        break;

        //    }
        //}

        if (!isValid) {
            return;
        }

        console.log(model);

        var jsonString = JSON.stringify(model);


        let GenericModeldata = {
            ScreenID: "BOMDetails",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                window.location.href = '/ManageOrder/O2DPrivateLabelFMS?auth=' + AuthToken;

            }


        });



    }

}

function CancelBOM() {
    window.location.href = '/ManageOrder/O2DPrivateLabelFMS?auth=' + AuthToken;

}

function RedirectToFGBomData() {
    window.location.href = 'FGBOMList?auth=' + AuthToken;
}

$('#btnCancel').click(function () {

    window.location.href = 'BOMList?auth=' + AuthToken;
})

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


        // $('#txtFormulatedBy').val(data.fullName);
        $('#txtBOMNumber').val(data.BOM_Doc_No);


    });

}


var ItemCodeList = [];

var CustomerCodeList = []

var client_catId = 0;
function LoadItemDropdown() {
    var model =
    {
        ColumnName: 'Name',
        SearchData: 'Filter By Finished Goods List'
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_104' }, 'GET', function (response) {

        ItemCodeList = response.data.data.Table;
        client_catId = ItemCodeList[0].Client_CatId;

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



function LoadCustomerDropdown() {
    var model =
    {
        ColumnName: 'Name',
        SearchData: 'Filter By Finished Goods List',
        Type: 2
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_104' }, 'GET', function (response) {

        CustomerCodeList = response.data.data.Table;
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

function SetItem() {
    console.log('Hi');
}
function GetItemMasterDetById(id, from, ERP_Sample_Det_UniqId) {

    var model = {
        ID: id
    };
    const jsonString = JSON.stringify(model);
    var ScreenID = "ItemMaster_101";
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
        var tableData = response.data.data.Table;
        if (tableData && tableData.length > 0) {
            if (from == 'txtMIItemName') {
                $(`#ddlItem`).val(tableData[0].ITEM_ID);
                $(`#lblItemName`).text(tableData[0].ItemName);
                $(`#ddlItemName`).val(tableData[0].ItemName);
                $(`#lblItemDesc`).text(tableData[0].DESCRIPTION);
                $('#spddlItemName').hide();
                $('#spddlPackSize').hide();
                $(`#lblUnit`).text(tableData[0].ALTERNATE_UNIT_TYPE);
                $('#ddlPackSize').val(tableData[0].PACK_SIZE);
                BindDropdown('ddlHSN', tableData[0].HSNId);

                // disable
                $('#ddlHSN').prop('disabled', true);



                var taxNameData = [];
                var tbklchargeData = response.data.data.Table2
                for (var i = 0; i < tbklchargeData.length; i++) {
                    itemChargeData.push({
                        ChargeTypeId: tbklchargeData[i].ChargeTypeId,
                        Charge: tbklchargeData[i].Charge,
                        ChargeId: tbklchargeData[i].ChargeId,
                        TaxPer: tbklchargeData[i].CHRG_PER
                    });

                    taxNameData.push(tbklchargeData[i].Charge);
                }

                $('#itemCharges').text(taxNameData.join(", "));

                sessionStorage.setItem("chargeData", JSON.stringify(itemChargeData));
            }
            else if (from == 'txtItemSFG') {
                $(`#ddlItemSFG`).val(tableData[0].ITEM_ID);
                $(`#lblItemName`).text(tableData[0].ItemName);
                $('#txtSAmpleId').val(ERP_Sample_Det_UniqId);
                $('#ddlSFGSaleRate').val(tableData[0].SALE_RATE).trigger('change');
                $('#ddlUnitSFG').val(tableData[0].StockUnitId > 0 ? tableData[0].StockUnitId : 'Select').trigger('change');
                $('#SFGItemCode').text(tableData[0].ItemName);
                $('#txtItemSFG').val(tableData[0].ITEM_CODE);
            }

        }
        else {
            console.error("Item not found..", error);
        }

    });
}
function BindDropdown(type, SelectValue) {

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
}

function GetdataMaster(inputElement, globalId, filtertype) {
    let rowId = inputElement.id; // Extract RowId from input ID
    let suggestionBox = document.getElementById(globalId);

    let search = inputElement.value.toLowerCase();
    suggestionBox.innerHTML = "";

    //if (search.length < 2) {
    //    suggestionBox.style.display = "none";
    //    return;
    //}
    let matchedItems = [];

    const searchLower = (search || '').trim().toLowerCase();

    if (rowId === 'txtItemSFG') {
        matchedItems = ItemCodeList.filter(item => {
            const display = (item.ITEM_DISPLAY || '').toLowerCase();
            const code = (item.ITEM_CODE || '').toLowerCase(); // if you have ITEM_CODE
            const matchesSearch = display.includes(searchLower) || code.includes(searchLower);

            const matchesCategory = item.Category === filtertype;
            const hasSample = item.ERP_Sample_Det_UniqId != null
            const hasCompany = item.Customer_ID == $('#ddlCustomer').val()

            return matchesSearch && matchesCategory && hasSample && hasCompany;
        }).slice(0, 50);

        console.log(matchedItems)
    } else {
        matchedItems = ItemCodeList.filter(item => {
            const display = (item.ITEM_DISPLAY || '').toLowerCase();
            const code = (item.ITEM_CODE || '').toLowerCase();
            const matchesSearch = display.includes(searchLower) || code.includes(searchLower);
            const matchesCategory = item.Category === filtertype;
            return matchesSearch && matchesCategory;
        }).slice(0, 50);


    }


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
                if (rowId == 'txtMIItemName') {
                    inputElement.value = item.ITEM_CODE; // Set selected value in input
                }
                else {
                    inputElement.value = item.ITEM_NAME; // Set selected value in input
                }
                suggestionBox.style.display = "none";

                if (rowId == 'txtMIItemName') {

                    //$(`#ddlItem`).val(item.ITEM_ID);
                    //$(`#lblItemName`).text(item.ITEM_NAME);
                    //$(`#lblItemDesc`).text(item.DESCRIPTION);
                    //$(`#lblUnit`).text(item.UNIT);
                    //$('#ddlItemName').val(item.ITEM_NAME);
                    //$('#ddlPackSize').val(item.Pack_Size);
                    //BindDropdown('ddlHSN', item.HSN_ID);

                    GetItemMasterDetById(item.ITEM_ID, 'txtMIItemName', '')

                }
                else if (rowId == 'txtItemSFG') {
                    $(`#ddlItemSFG`).val(item.ITEM_ID);
                    $(`#lblItemName`).text(item.ITEM_NAME);
                    $('#txtSAmpleId').val(item.ERP_Sample_Det_UniqId);
                    $('#ddlSFGSaleRate').val(item.SALE_RATE).trigger('change');
                    $('#ddlUnitSFG').val(item.STOCk_UNIT_ID > 0 ? item.STOCk_UNIT_ID : 'Select').trigger('change');
                    $('#SFGItemCode').text(item.ITEM_NAME);
                    $('#txtItemSFG').val(item.ITEM_CODE);

                    // GetItemMasterDetById(item.ITEM_ID, 'txtItemSFG', item.ERP_Sample_Det_UniqId)
                }
                // GetItemDetails(item.ITEM_ID, rowId);

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

function GetdataMasterCustomer(inputElement, globalId) {
    let rowId = inputElement.id; // Extract RowId from input ID
    let suggestionBox = document.getElementById(globalId);

    let search = inputElement.value.toLowerCase();
    suggestionBox.innerHTML = "";

    //if (search.length < 2) {
    //    suggestionBox.style.display = "none";
    //    return;
    //}

    let matchedItems = CustomerCodeList.filter(item =>
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


                $(`#ddlCustomer`).val(item.PA_ID);
                $(`#txtCustomerName`).val(item.ITEM_DISPLAY);
                $('#txtBrandName').val(item.BrandName);
                // GetItemDetails(item.ITEM_ID, rowId);


                //var $ele = $('#ddlContactPerson');
                //$ele.empty();
                //if (d.length > 1) {
                //    $ele.append($('<option/>').val('Select').text('Select'));
                //    $.each(d, function (ii, vall) {
                //        $ele.append($('<option />').val(vall.ID).text(vall.PersonName));
                //    })
                //}
                //else {
                //    $.each(d, function (ii, vall) {
                //        $ele.append($('<option />').val(vall.ID).text(vall.PersonName));
                //    })

                //}

                var obj3 = {
                    parentId: item.ERP_PARTY_TEMP_ID,
                    masterTableTypeId: 0,
                    isMasterTableType: false,
                    isManualTable: true,
                    manualTable: 98,
                    manualTableId: 0,
                    ScreenId: 'DropdownList_101'
                }
                LoadMasterDropdown('ddlContactPerson', obj3, '', false, '');


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


function CalculateRateSFG(ctrl) {

    // var rowId = ctrl.id;

    var ans = SetZero(ctrl);

    if (ans == -1) {
        return;
    }

    $('#totalRateSFG').html(($('#txtSFGQty').val() * $('#ddlSFGSaleRate').val()).toFixed(2));

    $('#sfg_total').html(($('#txtSFGQty').val() * $('#ddlSFGSaleRate').val()).toFixed(2));

    const total = parseFloat($('#totalRateSFG').html()) || 0;

    finalTotal_sfg = total;

    CalculateTotal();

    var totalCountFinal =
        (parseFloat(finalTotal_ot) || 0) +
        (parseFloat(finalTotal_pm) || 0) +
        (parseFloat(finalTotal_sfg) || 0);

    $('#finalTotal').html(`₹ ${totalCountFinal.toFixed(2)}`);

    $('#finalTotal').html(`₹ ${totalCountFinal.toFixed(2)}`);


    return total;




}

function calculateSFG() {

    const total = parseFloat($('#totalRateSFG').html()) || 0;

    finalTotal_sfg = total;

    return total;
}



function BindItemMasterCharge() {

    if (itemIdFGNew > 0) {
        return;
    }

    var model = {
        ID: "0",
        TableName: "ChargeType"
    };

    $('#taxmapping').modal('show');


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
        if (row.ChargeId > 0) {
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


function Getdata(inputElement) {
    let rowId = inputElement.id.split('_')[1]; // Extract RowId from input ID
    let suggestionBox = document.getElementById(`globalSuggestionBox_${rowId}`);

    let search = inputElement.value.toLowerCase();
    suggestionBox.innerHTML = "";

    //if (search.length < 2) {
    //    suggestionBox.style.display = "none";
    //    return;
    //}

    if ($(`#NewItem_${rowId}`).prop('checked')) {
        return;
    }

    var filtertype = 'Packing Material';
    let matchedItems = [];

    const searchLower = (search || '').trim().toLowerCase();

    if ($('#FromClient_' + rowId).prop('checked')) {
        var filtertype = 'Client';
    }

    matchedItems = ItemCodeList.filter(item => {
        const display = (item.ITEM_DISPLAY || '').toLowerCase();
        const code = (item.ITEM_CODE || '').toLowerCase();
        const matchesSearch = display.includes(searchLower) || code.includes(searchLower);
        const matchesCategory = item.Category === filtertype;
        const matchesSubCategory = item.SubCate_Id == $('#subcate_' + rowId).val()
        return matchesSearch && matchesCategory && matchesSubCategory;
    }).slice(0, 50);

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

                $(`#txtMIItemName_` + rowId).val(item.ITEM_CODE);
                $(`#ddlItem_` + rowId).val(item.ITEM_ID);
                $(`#itemcode_` + rowId).val(item.ITEM_NAME);
                $(`#lblItemName_` + rowId).text(item.ITEM_NAME);
                $(`#lblItemDesc_` + rowId).text(item.DESCRIPTION);
                $(`#lblUnit_` + rowId).text(item.UNIT);
                $('#txtMISellingPrice_' + rowId).val(item.SALE_RATE).trigger('change');
                $('#ddlHSN_' + rowId).val(item.HSN_ID > 0 ? item.HSN_ID : 'Select').trigger('change');
                $('#ddlUnitSFG_' + rowId).val(item.STOCk_UNIT_ID > 0 ? item.STOCk_UNIT_ID : 'Select').trigger('change');
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





function CalculateRate(ctrl) {

    var rowId = ctrl.id.split("_")[1];

    var ans = SetZero(ctrl);

    if (ans == -1) {
        return;
    }

    $('#totlCost_' + rowId).html(($('#txtMIQty_' + rowId).val() * $('#txtMISellingPrice_' + rowId).val()).toFixed(2));

    CalculateTotal_packeging();



}


function CalculateTotal_packeging() {
    const tableBody1 = document.querySelector('#printed_packing_sp tbody');
    const tableBody2 = document.querySelector('#printed_packing tbody');

    let totalCount = 0;

    if (tableBody1) {
        for (let i = 0; i < tableBody1.rows.length; i++) {
            totalCount += parseFloat($('#totlCost_' + (i + 100)).html()) || 0;
        }
    }

    if (tableBody2) {
        for (let i = 0; i < tableBody2.rows.length; i++) {
            totalCount += parseFloat($('#totlCost_' + (i + 1)).html()) || 0;
        }
    }

    totalCount = parseFloat(totalCount.toFixed(2)); // ✅ keep it numeric

    finalTotal_pm = totalCount; // ✅ numeric assignment

    $('#pm_total').html(`₹ ${totalCount.toFixed(2)}`);

    // ✅ convert all to float before summing
    var totalCountFinal =
        (parseFloat(finalTotal_ot) || 0) +
        (parseFloat(finalTotal_pm) || 0) +
        (parseFloat(finalTotal_sfg) || 0);

    $('#finalTotal').html(`₹ ${totalCountFinal.toFixed(2)}`);

    return totalCount;
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




