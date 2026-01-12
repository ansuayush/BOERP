$(document).ready(function () {

    $('.applyselect').select2();

    $(function () {
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
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
        });
        // Open the datepicker when the calendar icon is clicked
        $(".dateicon").click(function () {
            $(this).prev(".datepicker").focus();  // Open the associated datepicker
        });

    });

    

    $("#resultImage").change(function () {
        UploadocumentTaskReport();

    });

    $('#addmoreItem').on('click', function () {


        var dataURL = $("#hdnUploadFileUrl").val();
        $('#profile_image').attr('src', dataURL);

    });

    const date = new Date();

    const change_date = ChangeDateFormatToddMMYYY(date);
    $('#created_at').val(change_date);

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 5,
        isMasterTableType: true,
        isManualTable: false,
        manualTable: 0,
        manualTableId: 0,
        ScreenId: '900'
    }
    LoadMasterDropdown('ddl_UserType', obj1, 'Select', false);


    LoadMasterDropdown('user_type', obj1, 'All', false);

    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 61,
        manualTableId: 61,
        ScreenId: '900',
    }

    LoadMasterDropdown('ddl_manager', obj2, 'Select', false);



   
    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 62,
        manualTableId: 62,
        ScreenId: '900'
    }

    LoadMasterDropdown('ddl_department', obj3, 'Select', false);


   // BindEmployeeMaster();


    //$('#user_type, #status, #creat').on('change', function () {

    //        BindEmployeeMaster();
    //});


    $('#createuser').on('hidden.bs.modal', function () {
        ClearFormControl();              // reset fields and hide errors
        reinitializeApplySelects();      // reapply select dropdown plugin (like select2)
    });
});


function verifyPhoneNumber() {
    var phoneNo = $("#phone_no").val();
    var phonePattern = /^[0-9]{10}$/; // Adjust the pattern as per your requirement

    if (!phonePattern.test(phoneNo)) {
        $("#phone_no").val('');
        $('#spphone_no').show();
        setTimeout(function () {
            $('#spphone_no').hide();
        }, 4000);
    }
}

function VerifyEmployee() {
    if (otp == $('#otp').val()) {
        $('#email').val($("#otp_email").val());
        $('#verifyUser').modal('hide');
        $('#createuser').modal('show');
    }
    else {
        $('#spotp').show();
    }
}

let tblData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindItemMasterGrid();



});


function bindItemMasterGrid() {
    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start
    var requestData = {

        screenId: '800',
        modelData: JSON.stringify({
           
                Id: 0,
                Type: 1,
                Create_date: ChangeDateFormat($('#creat').val()),
                UserType: $('#user_type').val() == 'All' ? 0 : $('#user_type').val(),
                Status: $('#status').val() == 'All' ? 3 : $('#status').val()
        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', requestData, 'GET', function (response) {
        console.log(response);
        tblData = response.data.DataList.Table1;
        var columnMeta = response.data.DataList.Table;
        gridOptions = bindAgGrid("#myGrid", 'Employee', columnMeta, tblData);
        $("#customLoader").hide();
    });
}

function onlyAlpha(el) {
    const originalValue = el.value;
    const filteredValue = originalValue.replace(/[^A-Za-z ]/g, ''); // allow letters and spaces
    el.value = filteredValue;

    // Optionally show message if characters were removed
    //if (originalValue !== filteredValue) {
    //    // showMessage("Only letters and spaces are allowed");
    //}
}

function verifyEmployee() {

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    var email = $("#otp_email").val()

    if (emailRegex.test(email)) {
        $('#spotp_email').hide();
    }
    else {
        $('#spotp_email').html("Email Format is in correct!!");
        $('#spotp_email').show();
    }
    
}

function isValidEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    var email = $("#otp_email").val()


    if (email.trim().length == 0) {
        $('#spotp_email').html("Email field is required or Please enter an email");
        $('#spotp_email').show();
        return;
    }
    else if (emailRegex.test(email)) {
        checkAlreadyExistEmployee();
    }
   
}

function checkAlreadyExistEmployee() {



        var model = {
            Id: 0,
            email: $("#otp_email").val(),
            Type: 3

        }

        const jsonString = JSON.stringify(model);

        let GenericModeldata =
        {
            ScreenID: "800",
            ModelData: jsonString
        };


    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', GenericModeldata, 'GET', function (response) {

        console.log(response);
        var data = response.data.data.Table;

        if (data.length > 0) {
            FailToaster("This email already exist!!!")
        }
        else {
            VerifyEmailId()
        }
    });
}
function VerifyEmailId() {
    var userEmail = $("#otp_email").val();
    if (userEmail) {
        sendOtp(userEmail);
        $('#email_verify').prop('disabled', true);
    } else {
        $('#spotp_email').show();
    }
}



function BindEmployeeMaster() {

    if ($.fn.DataTable.isDataTable("#emp_table")) {
        $("#emp_table").DataTable().destroy();
    }
    
    var model = {
        Id: 0,
        Type: 1,
        Create_date: ChangeDateFormat($('#creat').val()),
        UserType: $('#user_type').val() == 'All' ? 0 : $('#user_type').val(),
        Status: $('#status').val() == 'Select' ? 3 : $('#status').val()

    }

    const jsonString = JSON.stringify(model);

    let GenericModeldata =
    {
        ScreenID: "800",
        ModelData: jsonString,
    };

    var TableID = 'emp_table';

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', GenericModeldata, 'GET', function (response) {

        console.log(response);

        var table = $('#emp_table').DataTable({
            "paging": true,
            "pagingType": "full_numbers",
            "pageLength": 10,
            "lengthMenu": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100 ],
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "responsive": true,
            "stateSave": false,
            "dom": '<"top">rt<"bottom"lip><"clear">',
            "language": {
                "paginate": {
                    "first": "<img src='../assets/images/icons/help/double-left.png' alt=''>",
                    "previous": "<img src='../assets/images/icons/help/arrow-left.png' alt=''>",
                    "next": "<img src='../assets/images/icons/help/arrow-right.png' alt=''>",
                    "last": "<img src='../assets/images/icons/help/double-right.png' alt=''>"
                }
            },
            "data": response.data.data.Table,
            "stateSave": false, // Enable state saving
            "columns": [

                
                 {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return ` <a href="UserDetailList?auth=${AuthToken}&id=${row.Id}" class="d-flex justify-content-between" ><strong>${row.emp_name}</strong></a> `;
                    }
                }, 
                { "data": "usertype" },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        return "<label>" + ChangeDateFormatToddMMYYY(row.createdat) + "</label>";
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        if (row.LoginTime) {
                            return "<label>" + formatDateTime(row.LoginTime) + "</label>";

                        }
                        else {
                            return "<label></label>";
                        }
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {

                        return `<a href="#" onclick="UserLogActivity('${row.Id}', '${row.emp_name}', '${row.emp_code}', '${row.Department}')"><strong>View</strong></a>`;
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        if (row.IsActive) {
                            return `<span class="circle circle-sm green-bg" data-toggle="tooltip" title="Active "></span>`;

                        }
                        else {
                            return `<span class="circle circle-sm red-bg" data-toggle="tooltip" title="Inactive "></>`;
                        }
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = ""; 
                        strReturn = `<div class="d-flex td-action-btn">
                                       <a href="#" onclick="edit_empMaster(${row.Id})"  class="d-flex justify-content-between" data-toggle="tooltip" title="Edit">
                              <img src="${baseURL + `assets/images/icons/help/edit-icon.png`}" alt="" class="action-image" />
                            </a>
                            <span class="gap-space">|</span>
                              <div class="Del_9">
                            <input type="checkbox" class="checkbox" onclick="del_empMaster(${row.Id}, '${row.emp_name}', ${row.IsActive})" ${row.IsActive ? `checked = ""` : ``} id="popswitch1_${row.Id}" >
                            <label for="popswitch1_${row.Id}" class="checkbox-label" data-on-label="Active"  data-toggle="modal" data-target="#confirmmsg">
                                <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                <span class="ball"></span>
                            </label>

                        </div>
                            
                        </div>`; 


                        //<a href="#" onclick="del_empMaster(${row.Id}, '${row.emp_name}', ${row.IsActive})"  >
                        //        <img src="${baseURL + `assets/images/icons/help/eye-on-icon.png`}" data-toggle="tooltip" ${row.IsActive == 1 ? `title="Inactive"` : `title="Active"`} alt="" class="action-image" />
                        //    </a>

                       


                        return strReturn;
                    }
                }


            ]
        });

        initCompleteCallback(TableID);

    });

    $('#' + TableID + '_filter').hide();
}


var act = 0;
function del_empMaster(id, name, active) {
    act = active ? 0 : 1;
    $('#hdnEmployeeMasterId').val(id);
    var active_cont = '';

    active_cont = active ? 'Inactive' : 'Active';

    var final_html = active_cont + ' ' + name;

    $('#del_user').html(final_html);

    $('#deletepopup').modal('show');
    $('#del_command').html(active_cont)

}

function bindItemMasterGridFilter() {
    bindItemMasterGrid();

    let filterData = tblData;

    let fromDate = $('#creat').val();
    let fromDate1 = new Date(ChangeDateFormatSecond(fromDate));

    // Reset time to 00:00:00 for proper date comparison
    fromDate1.setHours(0, 0, 0, 0);

    var taskNo = $("#status").val() === 'All' ? '-1' : $("#status").val();

    if (taskNo != '-1') {
        filterData = tblData.filter(row => row.IsActive == taskNo);
    }

    if (ChangeDateFormatSecond(fromDate) != '') {
        filterData = tblData.filter(row => {
            let expDate = new Date(row.createdat);
            console.log('exp', expDate);
            console.log('from', fromDate1);

            // Reset time to 00:00:00 for expDate to ignore time part
            expDate.setHours(0, 0, 0, 0);

            // Now comparing only the date part
            return expDate.getTime() === fromDate1.getTime();
        });
    }

    if (filterData.length > 0) {
        gridOptions.api.setRowData(filterData);
    } else {
        if (globalGridOptions != null)
            gridOptions.api.setRowData([]);
    }
}

function Del_EmpMaster() {

    var model = {
        id: $('#hdnEmployeeMasterId').val(),
        Type: 2,
        IsActive: act

    }

    const jsonString = JSON.stringify(model);

    let GenericModeldata =
    {
        ScreenID: "800",
        Operation: "A",
        ModelData: jsonString,
    };


        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                $('#deletepopup').modal('hide');
                window.location.href = window.location.href;
                //BindEmployeeMaster();
                bindItemMasterGrid();
            }
            else if (response.ValidationInput == 0) {
                FailToaster(response.CustoMessage);
                $('#deletepopup').modal('hide');
                closeEmpDel();
            }

        });
 
}

function closeEmpDel() {

    var del_id = $('#hdnEmployeeMasterId').val();

    if ($(`#popswitch1_${del_id}`).prop('checked')) {

        $(`#popswitch1_${del_id}`).prop('checked', false);

    }
    else {
        $(`#popswitch1_${del_id}`).prop('checked', true);
    }

}

function edit_empMaster(id) {

    $('#ddl_department').select2();

    $('#emp_header').html('Edit User');

    var dropdown = document.getElementById('ddl_manager');

    for (var i = 0; i < dropdown.options.length; i++) {
        if (dropdown.options[i].value == id) {
            dropdown.remove(i);
            break; // exit loop once the match is found and removed
        }

    }

    var model = {
        Id: id,
        Type: 1

    }

    const jsonString = JSON.stringify(model);

    let GenericModeldata =
    {
        ScreenID: "800",
        ModelData: jsonString
    };


    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', GenericModeldata, 'GET', function (response) {

        var data = response.data.data.Table[0];


        $('#hdnEmployeeMasterId').val(data.id);
        $('#firstname').val(data.firstname);
        $('#lastname').val(data.lastname);
        $('#emp_code').val(data.emp_code);
        $('#email').val(data.email);
        $('#phone_no').val(data.phone);
        $('#created_at').val(formatDateTime(data.createdat));
        $("#ddl_department").val(data.DepartmentID).trigger('change');
        $("#ddl_manager").val(data.hod_name ? data.hod_name > 0 ?  data.hod_name : 'Select' : 'Select' ).trigger('change');
        $('#hdnUploadFileUrl').val(data.FileURL);
        $('#ddl_UserType').val(data.UserType).trigger('change');
        $('#hdnUploadActualFileName').val(data.ActualFilename);
        $('#hdnUploadNewFileName').val(data.NewFilename);
        $('#profile_image').attr('src', data.FileURL);

        $('#createuser').modal('show');

    });
}


function ClearFormControl() {
    $('#hdnEmployeeMasterId').val(0);
    $('#firstname').val('');
    $('#lastname').val('');
    $('#emp_code').val('');
    $('#otp_email').val('');
    $('#phone_no').val('');
    $("#ddl_department").val('Select').trigger('change');
    $("#ddl_manager").val('Select').trigger('change');
    $('#hdnUploadActualFileName').val('');
    $('#hdnUploadNewFileName').val('');
    $('#hdnUploadFileUrl').val('');
    $('#ddl_UserType').val('Select').trigger('change');
    $('#emp_header').html('Add New User');
}

function SaveEmpCategory() {



    if (checkValidationOnSubmit('Mandatory') == true) {



        //var questionTest = {

        //}
        var objEmp = {
            id: $('#hdnEmployeeMasterId').val(),
            emp_name: $('#firstname').val() + ' ' + $('#lastname').val(),
            emp_code: $('#emp_code').val(),
            email: $('#email').val(),
            phone: $('#phone_no').val(),
            DepartmentID: $("#ddl_department").val(),
            hod_name: $("#ddl_manager").val() == 'Select' ? 0 : $("#ddl_manager").val(),
            ActualFilename: $('#hdnUploadActualFileName').val(),
            NewFilename: $('#hdnUploadNewFileName').val(),
            FileURL: $('#hdnUploadFileUrl').val(),
            UserType: $('#ddl_UserType').val(),
            first_name: $('#firstname').val(), 
            last_name: $('#lastname').val()
        }

        const jsonString = JSON.stringify(objEmp);

        let GenericModeldata =
        {
            ScreenID: "800",
            Operation: "A",
            ModelData: jsonString,
        };

        $('#btn_Save').prop('disabled', true);

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {          
                ClearFormControl();
                $('#createuser').modal('hide');
                $('#btn_Save').prop('disabled', false);
                // BindEmployeeMaster();
                bindItemMasterGrid();
                
            }
            else {
                // showMessage(response.ErrorMessage, "error", 5000);
                $('#btn_Save').prop('disabled', false);
            }

        });

    }
}

var otp = '';
function sendOtp(userEmail) {
    $.ajax({
        url: '/Account/SaveOTP?auth=' + AuthToken, // URL to your controller's action
        type: 'POST',
        data: { user_email: userEmail},
        success: function (response) {
            $("#customLoader").hide();
            if (response !== "-1") {
                $('#email_verify').prop('disabled', false);
                otp = response
                $('#adduser').modal('hide');
                $('#verifyUser').modal('show');
                $('#email').val(userEmail); // Handle the OTP
            } else {
                $('#email_verify').prop('disabled', false);
                FailToaster("Failed to send OTP!! Check your email or try again!!");              
            }
        },
        error: function (xhr, status, error) {
            $("#customLoader").hide();
            console.error("Error:", error);
        }
    });
}

function UploadocumentTaskReport() {



    var fileUpload = $("#resultImage").get(0);

    var files = fileUpload.files;
    if (files.length > 0) {

        // Create FormData object
        var fileData = new FormData();

        // Looping over all files and add it to FormData object
        for (var i = 0; i < files.length; i++) {
            fileData.append(files[i].name, files[i]);
        }

        $.ajax({
            url: baseURL + 'CommonMethod/UploadOtherDocument',
            type: "POST",
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            data: fileData,

            success: function (response) {
                $("#customLoader").hide();
                var result = JSON.parse(response);

                if (result.ErrorMessage == "") {

                    $('#hdnUploadActualFileName').val(result.FileModel.ActualFileName);
                    $('#hdnUploadNewFileName').val(result.FileModel.NewFileName);
                    $('#hdnUploadFileUrl').val(result.FileModel.FileUrl);
                    //$('#lblAttachement').text(result.FileModel.ActualFileName);                

                }
                else {


                    FailToaster(result.ErrorMessage);

                }
            }
            ,
            error: function (error) {
                $("#customLoader").hide();
                FailToaster(error);

                isSuccess = false;
            }

        });
    }
    else {
        FailToaster("Please select file to attach!");
        return "error";

    }

    return "";



}

function UserLogActivity(id, name, emp_code, dept) {

    localStorage.setItem('emp_name', name);
    localStorage.setItem('emp_code', emp_code);
    localStorage.setItem('dept', dept);
    window.location.href = `/ManageEmployee/UserLoginActivity?auth=${AuthToken}&id=${id}`
}

window.onload = displaySuccessMessage;


function reinitializeApplySelects() {
    if ($.fn.select2) {
        $('.applyselect').select2({
            width: '100%'
        });
    }
}