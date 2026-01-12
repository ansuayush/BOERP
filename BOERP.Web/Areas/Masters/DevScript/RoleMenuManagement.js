$('#btnUpdate').on('click', function () {
    var obj = [];
    $('.ChildMenuList').each(function () {
        var $row = $(this);
        var docNo = $row.find('.spDocNo').attr('id'); // Or .text() or .data('id') based on your markup
        var roleId = $('#hdnRoleId').val();
        var data = {
            DocNo: docNo,
            R: $row.find('#Read_' + docNo).is(':checked'),
            W: $row.find('#Write_' + docNo).is(':checked'),
            E: $row.find('#Export_' + docNo).is(':checked'),
            M: $row.find('#Modify_' + docNo).is(':checked'),
            D: $row.find('#Delete_' + docNo).is(':checked'),
            V: $row.find('#View_' + docNo).is(':checked'),
            RoleId: roleId
        };
        obj.push(data);
    });
    var model = {
        RoleData: obj,
        Type:''
    };

    const jsonString = JSON.stringify(model);
    let GenericModeldata =
    {
        ScreenID: "RoleManagement_01",
        Operation: "A",
        ModelData: jsonString
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
      
        if (response.ValidationInput != 0) {
            setTimeout(function () {
                RedirectToRole();
            }, 3000); // 3000 milliseconds = 3 seconds

        }
    });    
});

/////  ******************************    FMS Steps Permission    *******************************//////////////////       

$('#btnFMSStepPerUpdate').on('click', function () {
    var obj = [];
    $('.ChildMenuList').each(function () {
        var $row = $(this);
        var docNo = $row.find('.spDocNo').attr('id'); // Or .text() or .data('id') based on your markup
        var roleId = $('#hdnRoleId').val();
        var moduleId = $row.data('moduleid');

        var data = {
            DocNo: docNo,
            R: $row.find('#Read_' + docNo).is(':checked'),
            W: $row.find('#Write_' + docNo).is(':checked'),
            E: $row.find('#Export_' + docNo).is(':checked'),
            M: $row.find('#Modify_' + docNo).is(':checked'),
            D: $row.find('#Delete_' + docNo).is(':checked'),
            RoleId: roleId,
            ModuleId: moduleId
        };
        obj.push(data);
    });
    var model = {
        RoleData: obj,
        Type: 'FMSStepPer'
    };

    const jsonString = JSON.stringify(model);
    let GenericModeldata =
    {
        ScreenID: "RoleManagement_02",
        Operation: "A",
        ModelData: jsonString
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {

        if (response.ValidationInput != 0) {
            setTimeout(function () {
                RedirectToRole();
            }, 3000); // 3000 milliseconds = 3 seconds

        }
    });
});

/////  ******************************    FMS Steps Permission End   *******************************//////////////////

function RedirectToRole()
{
    var url = "/ManageEmployee/RoleMaster?auth=" + AuthToken;
    window.location.href = url;
}