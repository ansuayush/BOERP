
$(document).ready(function () {

	var obj69 = {
		parentId: 0,
		masterTableTypeId: 0,
		isMasterTableType: false,
		isManualTable: true,
		manualTable: 69,
		manualTableId: 0,
		ScreenId: 'DropdownList_101'
	}
	LoadMasterDropdown('ddlQMCategory', obj69, '', false);
});

function RenderQualityCheckItems(data) {
	$("#searchListQCPM").empty(); // Clear existing items
	if (data.length > 0) {
		data.forEach((item) => {
			var listItem = `
		            <li class="item">
					 <div class="d-flex justify-content-between" style="width:100%">
			            <span>${item.Parameter_Name}</span>
			           <div class="right">
								  <div class="td-action-btn item-gap-btn">
									<a href="#" class="btnEditQM"  onclick="RowEditQCPM(${item.Id})" data-toggle="tooltip" title="Edit">
									  <img src="../../assets/images/icons/help/edit-icon.svg" alt="Edit">
									</a>
									<a href="#" id="btnView1" onclick="RowViewQCPM(${item.Id})" data-toggle="tooltip" title="View">
									  <img src="../../assets/images/icons/help/view-icon.svg" alt="View">
									</a>									
									<div class="toggledgn btnDeleteQm">
                                      <input type="checkbox" onclick="RowDeleteQCPM(${item.Id},'${item.Parameter_Name}')" class="checkbox toggle-switch" ${item.isdeleted != 1 ? 'checked' : ''}  id="activeQCPM_${item.Id}">
                                      <label for="activeQCPM_${item.Id}" class="checkbox-label" data-toggle="modal" ${item.isdeleted ? `data-target="#confirmationdeactivate"` : `data-target="#deleteCommonType"`}>
                                        <img src="../../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                        <img src="../../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                        <span class="ball"></span>
                                      </label>
                                    </div>
								  </div>
								</div>
								</div>
		            </li>
                            `;
			$("#searchListQCPM").append(listItem);
			$("#searchListQCPM .btnEdit1").css('display', 'block'); // Hides only the most recently added .btnEdit
			$("#searchListQCPM .btnDelete1").css('display', 'block');
		});

		$('[data-toggle="tooltip"]').tooltip();

		$("#searchInput9").on("keyup", function () {
			var value = $(this).val().toLowerCase();
			$(".QCPM-list li").filter(function () {
				$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
			});
		});
	}
}
var save_id = 0;

var delete_id = 0;
function RowDeleteQCPM(rowId, WarehouseName) {
	$('#hddEditLocationRowId').val('');
	$('#hddEditRowId').val('');
	$('#hddEditWarehouseRowId').val('');
	$('#hddEditTransportationRowId').val();
	$('#hddEditQCPparameterRowId').val(rowId);
	document.getElementById('spDeleteMsg').innerText = WarehouseName;
	document.getElementById('spActiveDeleteMsg').innerText = WarehouseName;
	//$("#deleteCommonType").modal('show');
}

function CreateQCParam() {
	clearFormQM();
}
function RowViewQCPM(id) {

	save_id = id;

	var Tmodel =
	{
		Id: id,
		Type: 2
	};

	var jsonString = JSON.stringify(Tmodel);

	CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'QCPM_101' }, 'GET', function (response) {

		console.log(response);

		var data = response.data.data.Table[0];

		$('#txtParameterName').html(data.Parameter_Name);
		$('#txtRange').html(data.Parameter_Type);

		if (data.Parameter_Type == 'Numeric') {
			$('#txtMeasuringValue').html(data.Numeric_Value)
		}
		else if (data.Parameter_Type == 'Text') {
			$('#txtMeasuringValue').html(data.Text_Value)
		}
		else {
			$('#txtMeasuringValue').html(String(data.Range_Max) + " - " + String(data.Range_Min));
		}

		$('#txtCategory').html(data.Category);

		$('#viewsample').prop('checked', data.isSample);
		$('#viewproducation').prop('checked', data.isProduction);
		$('#viewinward').prop('checked', data.isInvard);
		$('#chkOutWard').prop('checked', data.isOutWard);
		$('#chkMicrobiological').prop('checked', data.isMicrobiological);

		$('#viewqcparameter').modal('show');



	});
}
function RowEditQCPM(id) {

	save_id = id;

	var Tmodel =
	{
		Id: id,
		Type: 1
	};

	var jsonString = JSON.stringify(Tmodel);

	CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'QCPM_101' }, 'GET', function (response) {

		console.log(response);

		editForm(response.data.data.Table[0]);

		

	});
}

function editForm(data) {
	$('#parameter_name').val(data.Parameter_Name);
	$('#parametertype').val(
		data.Parameter_Type === 1 ? 'numeric' :
			data.Parameter_Type === 2 ? 'text' : 'range'
	).trigger('change');
	$('#numMeasuring').val(data.Numeric_Value);
	$('#txtMeasuring').val(data.Text_Value);
	$('#range_min').val(data.Range_Min);
	$('#range_max').val(data.Range_Max);

	// Handle multi-select comma-separated value
	if (data.Category) {
		$('#ddlQMCategory').val(data.Category.split(',')).trigger('change');
	} else {
		$('#ddlQMCategory').val([]).trigger('change');
	}

	$('#isSample').prop('checked', data.isSample );
	$('#isProducation').prop('checked', data.isProduction );
	$('#isInward').prop('checked', data.isInvard ) ;
	$('#isOutWard').prop('checked', data.isOutWard);
	$('#isMicrobiological').prop('checked', data.isMicrobiological);
	$('#addqcparameter').modal('show');
}


function BuildQCPMList(data) {
	$("#liManageQualityList").empty(); // Clear existing items
	if (data.length > 0) {
		data.forEach((item) => {
			const listItem = `
				<li class="item">
				<a href="#" id="btnManageQuality" onclick="SingleManage(this)" ><span class="title-one">${item.Parameter_Name}</span></a>
				</li>`;
			$("#liManageQualityList").append(listItem);
		});
	}
}

function clearFormQM() {
	$('#parameter_name').val('');
	$('#parametertype').val('Select').trigger('change');
	$('#numMeasuring').val('');
	$('#txtMeasuring').val('');
	$('#range_min').val('');
	$('#range_max').val('');
	$('#ddlQMCategory').val([]).trigger('change'); // for multiselect dropdown
	$('#isSample').prop('checked', false);
	$('#isProducation').prop('checked', false);
	$('#isInward').prop('checked', false);
	$('#isOutWard').prop('checked', false);
	$('#isMicrobiological').prop('checked', false);
	save_id = 0;

}



function saveQualityMaster() {

	if (checkValidationOnSubmit('MandatoryQM') == true) {
		var isTrueParameterType = false;
		if($('#parametertype').val() == 'numeric') {
			isTrueParameterType = checkValidationOnSubmit('MandatoryN')
		}
		else if($('#parametertype').val() == 'text') {
			isTrueParameterType = checkValidationOnSubmit('MandatoryT')
		}
		else if ($('#parametertype').val() == 'range') {
			isTrueParameterType = checkValidationOnSubmit('MandatoryR')
		} 

		if (isTrueParameterType) {
			if (!$('#isSample').prop('checked') && !$('#isProducation').prop('checked') && !$('#isInward').prop('checked') && !$('#isOutWard').prop('checked') && !$('#isMicrobiological').prop('checked')) {
				FailToaster('Please select atleast one value from sample , production,Invard, OutWord and Microbiological')
				return;
			}

			var obj = {
				id: save_id,
				Parameter_Name: $('#parameter_name').val(),
				Parameter_Type: $('#parametertype').val() == 'numeric' ? 1 : $('#parametertype').val() == 'text' ? 2 : 3,
				/*Measuring_Num: $('#parametertype').val() == 'numeric' ? parseFloat($('#numMeasuring').val()) || 0 : 0,*/
				Measuring_Num: $('#parametertype').val() == 'numeric' ? $('#numMeasuring').val() || 0 : 0,
				Measuring_Text: $('#parametertype').val() == 'text' ?  $('#txtMeasuring').val() : '',
				//Range_Min: $('#parametertype').val() == 'range' ? parseFloat($('#range_min').val()) || 0 : 0,
				//Range_Max: $('#parametertype').val() == 'range' ? parseFloat($('#range_max').val()) || 0 : 0,
				Range_Min: $('#parametertype').val() == 'range' ? $('#range_min').val() || 0 : 0,
				Range_Max: $('#parametertype').val() == 'range' ? $('#range_max').val() || 0 : 0,
				Category: $('#ddlQMCategory').val().join(','),
				IsSample: $('#isSample').prop('checked'),
				IsProduction: $('#isProducation').prop('checked'),
				IsInward: $('#isInward').prop('checked'),
				IsOutWard: $('#isOutWard').prop('checked'),
				IsMicrobiological: $('#isMicrobiological').prop('checked')
			}

			var jsonString = JSON.stringify(obj);

			let GenericModeldata = {
				ScreenID: "QCPM_101",
				Operation: "A",  // Use Update for existing records, Add for new ones
				ModelData: jsonString
			};

			CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
				if (response.ValidationInput != 0) {
					$('#addqcparameter').modal('hide');
					$('#manageqcparameter').modal('hide');
					CommonGetAllType('ERP_QM');
					clearFormQM();
				}
			});
		}
	}
}