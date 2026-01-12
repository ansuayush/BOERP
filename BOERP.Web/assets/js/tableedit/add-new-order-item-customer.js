function addRow(button) {
    const tableBody = document.getElementById('item-information');

    const newRow = document.createElement('tr');
    newRow.innerHTML = `<td><div class="deleterow text-center cursor-pointer" onclick="deleteRow(this);" data-toggle="tooltip" title="Remove">
        <img src="../assets/images/icons/help/close.svg" alt="" />
    </div></td>
    <td><select class="form-control applyselect">
        <option>Select</option>
        <option>Item Name 1</option>
        <option>Item Name 2</option>
    </select></td>
    <td><input type="text" class="form-control text-left" placeholder="Enter"></td>
    <td><input type="text" class="form-control text-left" placeholder="Enter"></td>
    <td class="text-center">...</td>
    <td><input type="text" class="form-control text-left" placeholder="Enter"></td>
    <td><input type="text" class="form-control text-left" placeholder="Enter"></td>
    <td><input type="text" class="form-control text-left" placeholder="Enter"></td>
    <td><input type="text" class="form-control text-left" placeholder="Enter"></td>
    <td><input type="text" class="form-control text-left" placeholder="Enter"></td>
    <td><input type="text" class="form-control text-left" placeholder="Enter"></td>
    <td class="text-center">...</td>
    <td class="text-center">...</td>
    <td class="text-center">...</td>
    <td class="text-center">...</td>
    <td class="text-center">...</td>
    <td class="text-center">...</td>
    <td class="text-center">...</td>
    <td class="text-center">...</td>`;

    tableBody.appendChild(newRow);

    // Reinitialize Select2
    $(".applyselect").select2();

    // Reinitialize Bootstrap Tooltip for dynamically added elements
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    });
}

function deleteRow(button) {
    const row = button.closest("tr"); // Use closest to get the nearest row

    // Destroy the tooltip before removing the row
    $(row).find('[data-toggle="tooltip"]').tooltip('dispose');

    row.remove();
}
