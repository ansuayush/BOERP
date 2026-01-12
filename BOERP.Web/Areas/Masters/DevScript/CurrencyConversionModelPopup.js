function EditCurrConversion() {
	var model168 = {
		ID: 0,
		TABLE_NAME: 'CurrConversion'
	}
	const jsonString168 = JSON.stringify(model168);
	var ScreenID168 = "Curr_Conv_101";

	CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString168, screenId: ScreenID168 }, 'GET', function (response) {

		var data = response.data.data.Table;
		var tbody = $('#EditCurrConversionTable');
		tbody.empty(); // Clear previous data

		$.each(data, function (index, item) {
			var row = `<tr>
					<td>
					<input type="hidden" id="hddId${index}" value="${item.ID}" />
					<div class="input-group">
						<input type="text" readonly id="txtEffectiveDate${index}"  class="form-control datepicker" placeholder="dd-mm-yy" value="${ChangeDateFormatToddMMYYY(item.EffectiveDate)}"  />
						<div class="input-group-append "> <span class="input-group-text bg-white"><img src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span> </div>
					</div>
						</td>
					<td>
						<select disabled   id="ddleditConversion${index}" class="form-control applyselect editConversion" tabindex="-1" aria-hidden="true">
						<option>${item.CurrencyName}</option>
						</select>
					</td>
					<td>
						<input  id="txtCurrentAmount${index}" placeholder="00.00" class="form-control text-right  only-numeric" value="${item.Conversion.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}"  />
					</td>
				</tr>`;
			tbody.append(row);
		});
	});
	// Use find() to locate the new dropdown
	setTimeout(function () {
		let newRowElement = $("#EditCurrConversionTable").find("tr");
		console.log("New Row Element Found:", newRowElement);

		let dropdown = newRowElement.find(".editConversion");

		if (dropdown.length === 0) {
			console.error("Dropdown not found!");
		} else {
			console.log("Dropdown found!", dropdown);
		}

		//dropdown.empty();
		//dropdown.append(`<option value="">Select</option>`);

		// Add new options
		$.each(dropdownMasterCurrencyData, function (index, item) {
			dropdown.append(`<option value="${item.ID}">${item.CurrencyCodeName}</option>`);
		});

		console.log("Dropdown options after binding:", dropdown.html());

		// Re-initialize select2
		dropdown.select2();
	}, 100);

	$('.datepicker').datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: "dd-mm-yy",
		yearRange: "-90:+10"
	});
	$("#editcurrencyconversion").modal('show');
}
function UpdateCurrConversion() {
	var data = [];
	$("#EditCurrConversionTable tr").each(function () {
		var row = $(this);
		var ItemId = row.find("input[type='hidden']").val();
		var effectiveDate = row.find("input[type='text']").val();
		var currencyName = row.find("select option:selected").text();// row.find("select").val();
		var conversionRate = row.find("input[class='form-control text-right  only-numeric']").val();
		if (conversionRate.trim() === "") {
			conversionRate = "0.00";
		} else {
			conversionRate = parseFloat(conversionRate.replace(/,/g, '')) || 0;  // Convert to number, default to 0 if NaN
		}
		data.push({
			ID: parseInt(ItemId),
			EffectiveDate: ChangeDateFormat(effectiveDate),
			CurrencyName: currencyName,
			ConversionRate: conversionRate
		});
	});

	var model = {
		CurrencyConversion: data
	};
	const jsonString = JSON.stringify(model);
	let GenericModeldata =
	{
		ScreenID: "Curr_Conv_101",
		Operation: "U",
		ModelData: jsonString
	};
	
	CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
		CommonGetAllType('CURRENCYCONVERSION');
		$("#editcurrencyconversion").modal('hide');
	});
}

function SaveCurrencyConversion() {
	var valid = true;
	if (checkValidationOnSubmit('MandatoryConv') == false) {
		valid = false;
	}
	if (checkValidationOnSubmit('MandatoryAddConv') == false) {
		valid = false;
	}

	if (valid == true) {
		var data = [];
		$("#tblCurrencyConversion tbody tr").each(function () {
			var row = $(this);
			var effectiveDate = row.find("input").val();
			var currencyName = row.find("select option:selected").text();// row.find("select").val();
			var conversionRate = row.find("input[type='number']").val();
			data.push({
				EffectiveDate: ChangeDateFormat(effectiveDate),
				CurrencyName: currencyName,
				ConversionRate: conversionRate
			});
		});

		var model = {
			CurrencyConversion: data
		};
		const jsonString = JSON.stringify(model);
		let GenericModeldata =
		{
			ScreenID: "Curr_Conv_101",
			Operation: "A",
			ModelData: jsonString
		};

		CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
			CommonGetAllType('CURRENCYCONVERSION');
			$("#viewcurrencyconversion").modal('hide');
		});
	}
}
function CreateCurrencyConversion() {
	// Delete a row
	$('.deleterow').trigger('click');
	$("#tblCurrencyConversion tbody tr").each(function () {
		var row = $(this);
		var effectiveDate = row.find("input[type='date']").val('');
		var currencyName = row.find("select").val(0).trigger('change');
		var conversionRate = row.find("input[type='number']").val('');
	});
	$("#viewcurrencyconversion").modal('show');
}