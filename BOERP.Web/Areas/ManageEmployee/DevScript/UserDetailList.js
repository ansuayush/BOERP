$(document).ready(function () {

    $("#resultImage").change(function () {
        UploadocumentTaskReport();

    });

    $('#addmoreItem').on('click', function () {


        var dataURL = $("#hdnUploadFileUrl").val();
        $('#profile_image').attr('src', dataURL);

    });

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


    //  LoadMasterDropdown('user_type', obj1, 'Select', false);




    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 61,
        manualTableId: 61,
        ScreenId: '900'
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

    get_UserDetailse(Edit_ID);


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

function get_UserDetailse(id) {


    var model = {
        Id: id,
        Type: 2,     

    }

    const jsonString = JSON.stringify(model);

    let GenericModeldata =
    {
        ScreenID: "800",
        ModelData: jsonString
    };


    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', GenericModeldata, 'GET', function (response) {

        var data = response.data.data.Table[0];


        $('#hdnEmployeeMasterId').html(data.id);
        $('#user_id').html(data.emp_code == null ? '' : data.emp_code);
        $('#emp_name').html(data.emp_name);
        $('#email').html(data.email);
        $('#phone').html(data.phone);
        $("#IsActive").html(data.IsActive == true ? 'Active' : 'InActive');
        if (data.IsActive == true) {
            $('#IsActive').addClass('badge-success');
        }
        else {
            $('#IsActive').addClass('badge-danger');
        }
        $("#createdat").html(ChangeDateFormatToddMMYYY(data.createdat));
        $('#department').html(data.Department);
        $('#user_type').html(data.usertype);
        $('#ReportingManager').html(data.ReportingManager == null ?  '' : data.ReportingManager);
        $('#user_name').html(data.user_name == null ? '' : data.user_name);
        $('#password').html(data.password == null ? '' : data.password);
        $('#LoginTime').html(formatDateTime(data.LoginTime));

    });
}


function open_edit() {
    edit_empMaster(Edit_ID);
}
function edit_empMaster(id) {


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
        $('#created_at').val(ChangeDateFormatToddMMYYY(data.createdat));
        $('#email_otp').val(data.email);
        $('#phone_no').val(data.phone);
        $("#ddl_department").val(data.DepartmentID).trigger('change');
        $("#ddl_manager").val(data.hod_name ? data.hod_name > 0 ? data.hod_name : 'Select' : 'Select').trigger('change');
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
}

function SaveEmpCategory() {



    if (checkValidationOnSubmit('Mandatory') == true) {



        //var questionTest = {

        //}
        var objEmp = {
            id: $('#hdnEmployeeMasterId').val(),
            emp_name: $('#firstname').val() + ' ' + $('#lastname').val(),
            emp_code: $('#emp_code').val(),
            email: $('#email').html(),
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
                get_UserDetailse(Edit_ID);
                ClearFormControl();
                $('#createuser').modal('hide');
                $('#btn_Save').prop('disabled', false);

            }
            else {
                showMessage(response.ErrorMessage, "error", 5000);
                $('#btn_Save').prop('disabled', false);
            }

        });

    }
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