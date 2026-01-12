$(document).ready(function () {

    $(function () {
        $('.datepicker').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "dd-mm-yy",
            yearRange: "-20:+10"
        });

    });


    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 61,
        manualTableId: 61,
        ScreenId: '900'
    }

    LoadMasterDropdown('dldManager', obj2, 'Select', false);

    if (Edit_ID != 0) {
        EditBranchDetail(Edit_ID);
    }    
        GetBranchEmDate();


   

});


//ActualFilename: $("#hdnUploadActualFileName").val(),
//    NewFilename: $("#hdnUploadNewFileName").val(),
//        FileURL: $("#hdnUploadFileUrl").val(),

var isEdit = false;

function SaveBranchCategory() {



    if (checkValidationOnSubmit('Mandatory') == true) {



        //var questionTest = {

        //}
        var objEmp = {
            Id: $('#hdnBranchMasterId').val(),          
            BranchManager: $('#dldManager').val(),                     
            EMStartDate: ChangeDateFormat($("#dtStartDate").val()),          
            InTime: $('#dtInTime').val(),
            OutTime: $('#dtOutTime').val()
        }
      
        CommonAjaxMethodTMS(baseURL + 'ManageEmployee/SaveBranchMaster', objEmp, 'POST', function (response) {
            //if (response.ValidationInput == 1) {
            //  /*  ClearFormControl();*/               
            //        sessionStorage.setItem('message', '<span class="checkmark">✅</span> Branch Updated Successfully');           
            //    sessionStorage.setItem('successShown', 'true');
                RedirectBranchMasterRequest();
            //}
            //else {
            //    showMessage(response.ErrorMessage, "error", 5000);
            //}

        });

    }
}

function RedirectBranchMasterRequest() {

    var url = "/ManageEmployee/BranchMaster?auth=" +AuthToken+"&success=true";
    window.location.href = url;

}



function GetBranchEmDate() {
    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/GetBranchEMDate', null, 'GET', function (response) {

        var data = response.data.data.Table;

        $('#dtStartDate').val(ChangeDateFormatToddMMYYY(data[0].EMStartDate));
        $('#dtStartDate').prop('disabled', true);

    });

}


function GetEmpDetails(ctrl) {

    HideErrorMessage(ctrl)
    var obj = {
        id: $('#dldManager').val(),
        Type: 3
    }
    if (obj.id > 0) {
        CommonAjaxMethodTMS(baseURL + 'ManageEmployee/GerEmpDetails', obj, 'GET', function (response) {
            console.log(response)     

            var data = response.data.data.Table;;

            $('#email').val(data[0].email);
            $('#password').val(data[0].Password);

        });
    }

}

function ClearFormControl() {


    $('#hdnBranchMasterId').val('');
    $('#BranchUserId').val('');
    $('#result').val('Select').trigger('change');
    $('#BranchName').val('');
    $('#BranchManagerName').val('');
    $('#email').val('');
    $('#phoneno').val('');
    $('#password').val('');
    $('#dtInTime').val('');
    $('#dtOutTime').val('');

}


var str = '';
function EditBranchDetail(id) {

    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/GetBranchDetailById', { id: id }, 'GET', function (response) {
        console.log(response);

        var data = response.data.data.Table;
        $('#hdnBranchMasterId').val(data[0].id);
        $('#BranchUserId').val(data[0].BranchUserID);
        $('#BranchName').val(data[0].BranchName);
        $('#email').val(data[0].email);
        $('#phoneno').val(data[0].phone);
        $("#dldManager").val(data[0].BranchManager).trigger('change');
        $('#password').val(data[0].Password);
        data[0].EMStartDate ? $("#dtStartDate").val(ChangeDateFormatToddMMYYY(data[0].EMStartDate)) : '';
        $("#dtStartDate").prop('disabled', true);
        $('#dtInTime').val(data[0].InTime);
        $('#dtOutTime').val(data[0].OutTime);
        isEdit = true;
    });

}

function updateMenuJson() {
    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/LoginMenuAccessGet', null, 'GET', function (response) {

    });
}











