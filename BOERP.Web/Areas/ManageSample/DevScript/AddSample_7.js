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
        // Set selected date
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
        // Show the × icon
        $(this).siblings('.clear-date').show();
    });


    // Open datepicker when clicking the icon
    $('.input-group-text').on('click', function () {
        $(this).closest('.input-group').find('.datepicker').focus();
    });

    // Clear date when clicking the × icon
    $('.clear-date').on('click', function () {
        const $input = $(this).siblings('.datepicker'); // ✅ fixed selector
        $input.val('');          // Clear input
        $(this).hide();          // Hide × icon
    });

    // Hide × if input cleared manually
    $('.datepicker').on('input', function () {
        if ($(this).val() === '') {
            $(this).siblings('.clear-date').hide();
        }
    });


    $('.datepicker').on('show.daterangepicker', function () {
        var $calendar = $('.daterangepicker');
        var inputOffset = $(this).offset();
        var inputHeight = $(this).outerHeight();
        var windowHeight = $(window).height();
        var calendarHeight = $calendar.outerHeight();

        // Check if there's enough space to open the dropdown below the input
        if ((inputOffset.top + inputHeight + calendarHeight) > windowHeight) {
            // If not enough space, open the dropdown above the input
            $calendar.css({
                top: inputOffset.top - calendarHeight - 5 + 'px', // 5px for some spacing
                left: inputOffset.left + 'px'
            });
        } else {
            // Open it below the input
            $calendar.css({
                top: inputOffset.top + inputHeight + 5 + 'px', // 5px for some spacing
                left: inputOffset.left + 'px'
            });
        }
    });

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

    if (isDispatched != 1) {
        
       


        if (localStorage.getItem('IsPC') == 1 && localStorage.getItem('IsView') == 'false') {
            EditDispatch();
        }
        else {
            AddDispatch();


            var today = new Date();
            var day = String(today.getDate()).padStart(2, '0');
            var month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            var year = today.getFullYear();
            var formattedDate = day + '/' + month + '/' + year;

            // Set it to the input
            $('#sentDate').val(formattedDate);
        }
    }

    else {

        viewDispatch();
    }
     
});


function viewDispatch() {

    var model =
    {
        Id: Edit_ID,
        Type: 3
    };

    localStorage.removeItem('IsView');

    var jsonString = JSON.stringify(model);


    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp7_101' }, 'GET', function (response) {


        console.log(response);

        var data = response.data.data.Table[0];

        var data2 = response.data.data.Table2[0];

        $('#sample_id').html(data.ERP_Sample_Docno);
        $('#txtCustomer').html(data.Client);
        $('#cp_name').html(data.ContactPerson);
        $('#cp_phone').html(data.Cp_Phone);
        $('#customer_add').html(data.CustomerAdderss);
        

        var tblSample_Det = response.data.data.Table1;

        $('#step_no').html('Step ' + tblSample_Det[0].StepNo + ' - Dispatch Sample')  ;

        var obj = ``;

        for (item of tblSample_Det) {

            obj +=
                `<tr> 
                  <td>${item.Det_Doco}</td>
                  <td>${item.Item_Code}</td>
                  <td>${item.Item_Name}</td>
             </tr>
            `
        }

        $('#sample_child_info').html(obj);


        var obj3 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 3,
            manualTableId: 0,
            ScreenId: 'GateEntry_101'
        }
        LoadMasterDropdown('ddlTransporterName', obj3, 'Select', false, data2.Transporter_Id);

        $('#tracking_id').val(data2.Tracking_Id)
        $('#sentDate').val(ChangeDateFormatToddMMYYYWithSlace(data2.SentDate));
        $('#selfpickup').prop('checked', data2.SelfPickup);
        $('#remarks').val(data2.Remarks);

        $('#ddlTransporterName').prop('disabled', true);
        $('#tracking_id').prop('disabled', true);
        $('#sentDate').prop('disabled', true);
        $('#senddate_icon').hide();
        $('.clear-date').hide();
        $('#selfpickup').prop('disabled', true);
        $('#remarks').prop('disabled', true);

        //$('#print_dispatch').on('click', function () {
        //    printDispatchDetails(data.ERP_Sample_Id);
        //});

    });
}


function EditDispatch() {

    var model =
    {
        Id: Edit_ID,
        Type: 3
    };

    var jsonString = JSON.stringify(model);

    localStorage.removeItem('IsView');

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp7_101' }, 'GET', function (response) {


        console.log(response);

        var data = response.data.data.Table[0];

        var data2 = response.data.data.Table2[0];

        $('#sample_id').html(data.ERP_Sample_Docno);
        $('#txtCustomer').html(data.Client);
        $('#cp_name').html(data.ContactPerson);
        $('#cp_phone').html(data.Cp_Phone);
        $('#customer_add').html(data.CustomerAdderss);

        var tblSample_Det = response.data.data.Table1;

        var obj = ``;

        for (item of tblSample_Det) {

            obj +=
                `<tr> 
                  <td>${item.Det_Doco}</td>
                  <td>${item.Item_Code}</td>
                  <td>${item.Item_Name}</td>
             </tr>
            `
        }

        $('#sample_child_info').html(obj);


        var obj3 = {
            parentId: 0,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 3,
            manualTableId: 0,
            ScreenId: 'GateEntry_101'
        }
        LoadMasterDropdown('ddlTransporterName', obj3, 'Select', false, data2.Transporter_Id);

        $('#tracking_id').val(data2.Tracking_Id)
        $('#sentDate').val(ChangeDateFormatToddMMYYYWithSlace(data2.SentDate));
        $('#selfpickup').prop('checked', data2.SelfPickup);
        $('#remarks').val(data2.Remarks);

        //$('#ddlTransporterName').prop('disabled', true);
        //$('#tracking_id').prop('disabled', true);
        //$('#sentDate').prop('disabled', true);
        //$('#selfpickup').prop('disabled', true);
        //$('#remarks').prop('disabled', true);

        //$('#print_dispatch').on('click', function () {
        //    printDispatchDetails(data.ERP_Sample_Id);
        //});

    });
}


function AddDispatch() {

    var model =
    {
        Id: Edit_ID,
        Type: 4
    };

    var jsonString = JSON.stringify(model);


    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ERP_Samp7_101' }, 'GET', function (response) {


        console.log(response);

        var data = response.data.data.Table[0];

        $('#sample_id').html(data.ERP_Sample_Docno);
        $('#txtCustomer').html(data.Client);
        $('#cp_name').html(data.ContactPerson);
        $('#cp_phone').html(data.Cp_Phone);
        $('#customer_add').html(data.CustomerAdderss);

        var tblSample_Det = response.data.data.Table1;

        var obj = ``;

        for (item of tblSample_Det) {

            obj +=
                `<tr> 
                  <td>${item.Det_Doco}</td>
                  <td>${item.Item_Code}</td>
                  <td>${item.Item_Name}</td>
             </tr>
            `
        }

        $('#sample_child_info').html(obj);


    });
}
// print_dispatch
function printDispatchDetails(SampleId) {
    $.ajax({
        url: '/ManageSample/PrintDispatchSample?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { SampleId: SampleId },
        xhrFields: {
            responseType: 'blob' // Important to handle binary data like PDF
        },
        beforeSend: function (request) {
            request.setRequestHeader('Auth', getCookieValue('AuthToken'));
        },
        success: function (data, status, xhr) {
            $("#customLoader").hide();
            const disposition = xhr.getResponseHeader('Content-Disposition');
            const isPdf = xhr.getResponseHeader('Content-Type') === 'application/pdf';

            if (!isPdf) {
                // If the content is not PDF, assume it's an error message
                FailToaster("You don't have the permission to print this record");
                return;
            }

            // Get filename from headers or fallback
            let filename = "Dispatched_Sample_Report.pdf";
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match != null && match[1]) {
                    filename = match[1].replace(/['"]/g, '');
                }
            }

            // Create a link and trigger download
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
        error: function (xhr) {
            $("#customLoader").hide();
            alert("Ajax Error: " + xhr.statusText || "Unknown error occurred");
        }
    });
}


function saveDispatch() {

    if (checkValidationOnSubmit('Mandatory')) {
        //ChangeDateFormatSecond

        var Model = {
            Id: Edit_ID,
            Transporter_Id: $('#ddlTransporterName').val() == 'Select' ? 0 : $('#ddlTransporterName').val(),
            SelfPickup: $('#selfpickup').prop('checked') ? 1 : 0,
            Tracking_Id: $('#tracking_id').val(),
            SentDate: ChangeDateFormatSecond($('#sentDate').val()),
            Status: $('#ddlStatus').val(),
            Remarks: $('#remarks').val(),
            Type: localStorage.getItem('IsPC') == 1 ? 2 : 0

        }; 

        const jsonString1 = JSON.stringify(Model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "ERP_Samp7_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString1
        };

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                RedirectToDispatch();

             
            }
        });
    }
}

function handleDispatch(ctrl) {

    if ($('#' + ctrl.id).prop('checked')) {
        $('#ddlTransporterName').val('Select').trigger('change');
        $('#tracking_id').val('');
        $('#ddlTransporterName').prop('disabled', true);
        $('#tracking_id').prop('disabled', true);
        $('#ddlTransporterName').removeClass('Mandatory');
        $('#tracking_id').removeClass('Mandatory');
    }
    else {
        $('#ddlTransporterName').prop('disabled', false);
        $('#tracking_id').prop('disabled', false);
        $('#ddlTransporterName').addClass('Mandatory');
        $('#tracking_id').addClass('Mandatory');
    }


    
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


function RedirectToDispatch() {
    if (localStorage.getItem('IsPC') == 1) {
        localStorage.removeItem('IsPC');
        window.location.href = 'PCDashboard?auth=' + AuthToken;
       
    }
    else if (isUn == 1) {
        window.location.href = `OilSample?auth=${AuthToken}&isUn=1`;
    }
    else if (isUn == 2) {
        window.location.href = `OilSample?auth=${AuthToken}&isUn=2`;
    }
    else {
        window.location.href = 'DispatchSample?auth=' + AuthToken;
    }
}



function RedirectToDispatchedItems() {

    if (localStorage.getItem('IsPC') == 1) {
        localStorage.removeItem('IsPC');
        window.location.href = 'PCDashboard?auth=' + AuthToken;

    }
    else {

        window.location.href = 'SampleIndexDelete?auth=' + AuthToken;

    }

}