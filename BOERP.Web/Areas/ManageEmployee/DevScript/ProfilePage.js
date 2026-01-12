$(document).ready(function () {

    GetProfileDetails();




});

function GetProfileDetails() {

    var model = {
        Id: 0,
        Type: 4,

    }

    const jsonString = JSON.stringify(model);

    let GenericModeldata =
    {
        ScreenID: "800",
        ModelData: jsonString
    };


    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', GenericModeldata, 'GET', function (response) {


        console.log(response);
        var data = response.data.data.Table[0];


        $('#hdnEmployeeMasterId').html(data.id);
        $('#emp_name').html(data.emp_name);
        $('#email').html(data.email);
        $('#username').html(data.email);
        $('#emp_code').html(data.emp_code);
        $('#phone').html(data.phone);
       
        $('#department').html(data.Department);
        $('#user_type').html(data.usertype);
        if (data.FileURL != null) {
            $('#profile_img').attr('src', data.FileURL);
        }
        
        $('#user_id').html(data.user_id == null ? '' : data.user_id);
        $('#password').html(data.password == null ? '' : data.password);

    });
}
