let rowCounter = 1;  // Track the latest row ID
$(document).ready(function () {
	BindControlInformation();
})
function addRow() {
	// Get the table body
	const tableBody = document.getElementById("tableBody");

	// Clone the last row
	const lastRow = tableBody.lastElementChild;
	const newRow = lastRow.cloneNode(true);

	// Increment rowCounter for unique IDs
	rowCounter++;
	newRow.setAttribute("data-row-id", rowCounter);

	// Update input IDs and clear values
	const controlInput = newRow.querySelector(".control-input");
	const valueInput = newRow.querySelector(".value-input");

	controlInput.id = `control_${rowCounter}`;
	controlInput.value = "";  // Clear the input value

	valueInput.id = `value_${rowCounter}`;
	valueInput.value = "";  // Clear the input value

	// Append the new row to the table body
	tableBody.appendChild(newRow);
}

function deleteRow(button) {
	const row = button.closest("tr");

	// Prevent deletion if only one row is present
	if (document.querySelectorAll("#tableBody tr").length > 1) {
		row.remove();
	} else {
		alert("At least one row must remain.");
	}
}

function BindControlInformation() {
	var model = {
		ID: 0
	}
	const jsonString1 = JSON.stringify(model);
	var ScreenID = "Control_101";

	CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString1, screenId: ScreenID }, 'GET', function (response) {
		var data = response.data.data.Table; // Make sure "table" is the key in the response containing the data array.

		if (data && Array.isArray(data)) {
			let rowBinding = '';
			//           <td class="text-center" data-label="Action">
			//               <div id="addrow" class="cursor-pointer" onclick="addRow()">
			//	<img style="display:none;" src="../../assets/images/icons/help/add.svg" alt="" data-toggle="tooltip" title="Add Row">
			//</div>
			//           </td>
			data.forEach((row, index) => {
				rowBinding += `<tr data-row-id="${index + 1}">
				<td style="display:none" data-label="Value">
					<span>
						<input type="hidden" class="form-control value-type" id="hdnType_${index + 1}" value="${row.Type || ''}" />
					</span>
				</td>

                <td data-label="Control">
                    <span>
                        <input type="text" class="form-control control-input" id="control_${index + 1}" value="${row.ControlKeyName || ''}" placeholder="Enter">
                    </span>
                </td>
                <td data-label="Value">
                    <span>
                        <input type="text" class="form-control value-input" id="value_${index + 1}" value="${row.Value || ''}" placeholder="Enter">
                    </span>
                </td>
				 <td style="display:none" data-label="Value">
					 <span>
						<input type="hidden" class="form-control value-hidden" id="hdd_${index + 1}" value="${row.ControlKeyID || ''}" />
					 </span>
				 </td>
            </tr>`;
			});

			// Append the rows to the table body
			document.getElementById('tableBody').innerHTML = rowBinding;
		}
	});
}

function SaveControlInformation() {
	var tableData = [];
	debugger
	$('#tableBody tr').each(function () {
		var controlId = $(this).find('.value-hidden').val();
		var control = $(this).find('.control-input').val();
		var value = $(this).find('.value-input').val();
		var valueType = $(this).find('.value-type').val();

		if (control || value) { // Only add if there is some data entered
			tableData.push({
				ControlID: controlId,
				ControlName: control,
				Value: value,
				ValueType: valueType
			});
		}
	});

	var model = {
		ControlsInformation: tableData
	};
	const jsonString = JSON.stringify(model);
	let GenericModeldata =
	{
		ScreenID: "Control_101",
		Operation: "U",
		ModelData: jsonString
	};
	ShowLoadingDialog()
	CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
		ShowandCloseLoader();
	});
}