$(document).ready(function () {
    $(".applyselect").select2();

});

$(document).ready(function () {



    $(function () {
        $('.datepicker').each(function () {
            $(this).daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                autoApply: true,
                autoUpdateInput: false,
                opens: 'right',            // your choice
                drops: 'auto',             // let it choose up/down based on space
                parentEl: 'body',
                locale: { format: 'DD/MM/YYYY' }
            })
                .on('show.daterangepicker', function (ev, picker) {
                    // force fixed so it can overflow any scrollable container
                    picker.container.addClass('drp-fixed');
                    // after it’s in the DOM, recalc position (next tick)
                    setTimeout(() => picker.move(), 0);
                })
                .on('apply.daterangepicker', function (ev, picker) {
                    $(this).val(picker.startDate.format('DD/MM/YYYY')).trigger('change');
                    $(this).siblings('.clear-date').show();
                })
                .on('cancel.daterangepicker', function () {
                    $(this).val('').trigger('change');
                    $(this).siblings('.clear-date').hide();
                });
        });

        // your helpers
        $('.dateicon, .input-group-text').on('click', function () {
            $(this).closest('.input-group').find('.datepicker').focus();
        });

        $('.clear-date').on('click', function () {
            const $inp = $(this).siblings('.datepicker');
            $inp.val('').trigger('change');
            $(this).hide();
        });

        $('#datepickerA').on('change', function () {
            setTimeout(() => $('#datepickerb').focus(), 200);
        });
    });

    GetCompany();

});

function GetCompany() {
    $.ajax({
        url: '/Account/GetCompanyList', // The URL for the API endpoint
        type: 'GET', // HTTP method
        dataType: 'json', // Expected data type of the response
        success: function (response) {
            // Parse and handle the JSON response
            var data = JSON.parse(response);
            console.log("Company List Data:", data);

            var dropdownMasterData = data.data.Table;
            var $ele = $('#CompanyId');
            $ele.empty();

            $ele.append($('<option/>').val('').text('Select'));

            $.each(dropdownMasterData, function (ii, vall) {

                $ele.append($('<option />').val(vall.DB_NAME).text(vall.COMPANY_NAME));

            })

      
                var singleCompany = dropdownMasterData[0];
                $('#CompanyId').val(singleCompany.DB_NAME); 
                FillFinanceYear({ value: singleCompany.DB_NAME });
        },
        error: function (xhr, status, error) {
            console.error("Error fetching company list:", error);
        }
    });
}




function FillFinanceYear(ctrl) {
    $.ajax({
        url: '/Account/GetFinaList', // The URL for the API endpoint
        type: 'GET', // HTTP method
        dataType: 'json', // Expected data type of the response
        data: { id: ctrl.value },
        success: function (response) {
            // Parse and handle the JSON response
            var data = JSON.parse(response);
            console.log("Company List Data:", data);

            var dropdownMasterData = data.data.Table;
            var $ele = $('#FinId');
            $ele.empty();

            $ele.append($('<option/>').val('').text('Select'));

            $.each(dropdownMasterData, function (ii, vall) {

                $ele.append($('<option />').val(vall.FIN_ID).text(vall.FinDate));

            })
            var firstValue = $('#FinId option:first').val(); // Get the value of the last option
            $('#FinId').val('1'); // Set the dropdown's value to the last option

            $('#tbFinYearDate').val(ChangeDateFormatToddMMYYYWithSlace(new Date()));
        },
        error: function (xhr, status, error) {
            console.error("Error fetching company list:", error);
        }
    });


}


function SetFinDate(ctrl)
{
    //const selectedText = ctrl.options[ctrl.selectedIndex].text;
    //$.ajax({
    //    url: '/Account/SetFinDate', // The URL for the API endpoint
    //    type: 'GET', // HTTP method
    //    dataType: 'json', // Expected data type of the response
    //    data: { id: selectedText },
    //    success: function (response) {         
            
    //    },
    //    error: function (xhr, status, error) {
    //        console.error("Error fetching Fin list:", error);
    //    }
    //});


}