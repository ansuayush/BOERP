$(document).ready(function () {
    $("#addrow").click(function () {
        var clickCount = 0;
        clickCount = clickCount + 1;
        let newRow = `
            <tr>
                <td>
                    <div class="deleterow text-center cursor-pointer">
                        <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
                    </div>
                </td>
                <td>
                    <div class="input-group">
                    <input type="date" id="txtDate" class="form-control" placeholder="DD/MM/YYYY" />
                                            
                                         </div>
                </td>
                </td>
                 <td>
                    <select  class="form-control applyselect ddlCurrencyConversion1">
                    </select>
                </td>
                <td><input type="number" placeholder="00.00" class="form-control text-right  only-numeric" value=""></td>
                
            </tr>`;

        // Append new row
        $(".addinformation tbody").append(newRow);

        // Use find() to locate the new dropdown
        setTimeout(function () {
            let newRowElement = $(".addinformation tbody").find("tr").last();
            console.log("New Row Element Found:", newRowElement);

            let dropdown = newRowElement.find(".ddlCurrencyConversion1");

            if (dropdown.length === 0) {
                console.error("Dropdown not found!");
            } else {
                console.log("Dropdown found!", dropdown);
            }

            dropdown.empty();
            dropdown.append(`<option value="">Select Currency</option>`);

            // Add new options
            $.each(dropdownMasterCurrencyData, function (index, item) {
                dropdown.append(`<option value="${item.ID}">${item.FIELD_NAME}</option>`);
            });

            console.log("Dropdown options after binding:", dropdown.html());

            // Re-initialize select2
            dropdown.select2();
        }, 100);
        // Re-initialize select2 for newly added element
        $(".addinformation tbody tr:last .applyselect").select2();

        // Re-initialize tooltip for newly added elements
        $(".addinformation tbody tr:last [data-toggle='tooltip']").tooltip();
        //datechange();
       
    });
    
    function datechange() {
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
        }).on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
        });

        // Open datepicker when clicking the icon
        $('.input-group-text').on('click', function() {
            $(this).closest('.input-group').find('.datepicker').focus();
        });
    }
    
      
    // Delete a row
    $(document).on("click", ".deleterow", function () {
        $(this).closest("tr").remove();
    });
});
