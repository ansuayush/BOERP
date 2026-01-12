$(document).ready(function () {

    var dropdown = document.getElementById('dldBranch');
    if (dropdown.options.length == 2) {
        BindBranch(1);
        $('#dldBranch').prop('disabled', true);
    }



    $('#ddl_emp').on('change', function () {

        const emp_id = $('#ddl_emp').val() == 'Select' ? 0 : $('#ddl_emp').val() 

                FillEmpDetails(emp_id);


    });

    BindCategory('');
    BindBranch('');
    BindRole('');
    BindUserType('');
    // BindUserListMaster();



    $('#ddl_UserType').on('change', function () {


        BindOnChangeUser('', $('#ddl_UserType').val());
    });



});

function BindCategory(selectedValue) {

    var obj5 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 65,
        manualTableId: 65,
        ScreenId: '900'
    }

    LoadMasterDropdown('dldCategory', obj5, 'Select', false, selectedValue );
}
function BindBranch(selectedValue) {
    var obj4 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Branch,
        manualTableId: ManaulTableEnum.Branch
    }

    LoadMasterDropdownTMS('dldBranch', obj4, 'Select', false, selectedValue);
}
function BindRole(selectedValue) {
    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 64,
        manualTableId: 64,
        ScreenId: '900'
    }

    LoadMasterDropdown('roleIDs', obj3, '', false, selectedValue);
}

function BindUserType(selectedValue) {

    var obj1 = {
        parentId: 0,
        masterTableTypeId: 5,
        isMasterTableType: true,
        isManualTable: false,
        manualTable: 0,
        manualTableId: 0,
        ScreenId: '900'
    }
    LoadMasterDropdown('ddl_UserType', obj1, 'Select', false, selectedValue);
}
function BindOnChangeUser(selectedValue, userType) {

    if (ddl_user_type == userType) {
        return;
    }

    ddl_user_type = userType;

        var obj2 = {
            parentId: userType == 'Select' ? 0 : userType,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 63,
            manualTableId: 63,
            ScreenId: '900'
        }

        LoadMasterDropdown('ddl_emp', obj2, 'Select', false, selectedValue);

}



function verifyPhoneNumber(ctrl) {
    HideErrorMessage(ctrl);
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

//function BindUserListMaster() {

//    var TableID = 'tableUserList';


//    var model = {
//        Id: 0,
//        Type: 1
//    }

//    const jsonString = JSON.stringify(model);

//    let GenericModeldata =
//    {
//        ScreenID: "802",
//        ModelData: jsonString,
//    };


//    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', GenericModeldata, 'GET', function (response) {
//        console.log(response);



//        var table = $('#tableUserList').DataTable({
//            "processing": true, // for show progress bar
//            "destroy": true,
//            "info": false,
//            "lengthChange": false,
//            "bFilter": true,
//            "ordering": true,
//            "bSort": false,
//            "data": response.data.data.Table,
//            "stateSave": true, // Enable state saving
//            "columns": [
//                //{ "data": "RowNumber" },
//                { "data": "UserType" },
//                { "data": "emp_code" },
//                {
//                    "orderable": true,
//                    data: null, render: function (data, type, row) {
//                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + row.RoleNames + "' title=''>" + row.RoleNames + "</p>";
//                    }
//                },
//                { "data": "emp_name" },
//                { "data": "email", "orderable": false, },
//                {
//                    "orderable": false,
//                    data: null, render: function (data, type, row) {
//                        return "<label>" + formatDateTime(row.createdat) + "</label>";
//                    }
//                },
//                {
//                    "orderable": false,
//                    data: null, render: function (data, type, row) {

//                        if (row.modifiedat == null) {
//                            return "<label></label>";
//                        }
//                        else {
//                            return "<label>" + formatDateTime(row.modifiedat) + "</label>";
//                        }
//                    }
//                },
//                { "data": "MacAddress" },
//                {
//                    "orderable": false,
//                    data: null, render: function (data, type, row) {
//                        var strReturn = "";


//                        //<a href="" data-toggle="modal" onclick="set_delVariable(${row.isDeleted}, ${row.Id}, '${row.emp_name}')" ${row.isDeleted ? `data-target="#confirmationdeactivate"` : `data-target="#confirmation"`} >
//                        //    <i ${row.isDeleted ? `class="fa fa-times-circle red-crl"` : `class="fa fa-check-circle checkgreen"`} data-toggle="tooltip" title="" aria-hidden="true" ${row.isDeleted ? `data-original-title="Click to Activate"` : `data-original-title="Click to DeActivate"`}></i>
//                        //</a>

//                        strReturn += `
//                        <div class="d-flex td-action-btn">


//                          <div class="Del_9">
//                            <input type="checkbox" class="checkbox" onclick="set_delVariable(${row.isDeleted}, ${row.Id}, '${row.emp_name}')" ${!row.isDeleted ? `checked = ""` : ``} id="popswitch1_${row.Id}" >
//                            <label for="popswitch1_${row.Id}" class="checkbox-label" data-on-label="Active"  data-toggle="modal" ${row.isDeleted ? `data-target="#confirmationdeactivate"` : `data-target="#confirmation"`}>
//                                <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
//                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
//                                <span class="ball"></span>
//                            </label>

//                        </div>


//                        <span class="gap-space">|</span>
//                        <a href="" onclick="EditUserListMaster(${row.Id})" data-toggle="modal" data-target="#edit"><img src="../assets/images/icons/help/edit-icon.png" class="action-image" data-toggle="tooltip" title="Edit" > </a></div>`;

//                        return strReturn;
//                    }
//                }
//            ]
//        });


//        initCompleteCallback(TableID)


//    });

//    $('#' + TableID + '_filter').hide();
//}



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

        screenId: '802',
        modelData: JSON.stringify({
            Id: 0,
            Type: 1
        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', requestData, 'GET', function (response) {
        console.log(response);
        tblData = response.data.DataList.Table1;
        var columnMeta = response.data.DataList.Table;
        gridOptions = bindAgGrid("#myGrid", 'UserList', columnMeta, tblData);
        $("#customLoader").hide();
    });
}

var del_var;

function set_delVariable(isdeleted, id, name) {

    $("#hdnUserListId").val(id);
    del_var = isdeleted;
    $('#role_name').html(name);
    $('#role_name2').html(name);
}

function closeUserlistDel() {

    var del_id = $('#hdnUserListId').val();

    if ($(`#popswitch1_${del_id}`).prop('checked')) {

        $(`#popswitch1_${del_id}`).prop('checked', false);

    }
    else {
        $(`#popswitch1_${del_id}`).prop('checked', true);
    }

}


function addUserListId() {

    $('#titleUser').html('Add User');
    clearForm();
    $("#hdnUserListId").val(0);
    $('#dldBranch').val(1).trigger('change');
}

var str = '';


// user list edit
function EditUserListMaster(id) {

    $('#titleUser').html('Edit User');

    clearForm();
    var model = {
        Id: id,
        Type: 1
    }

    const jsonString = JSON.stringify(model);

    let GenericModeldata =
    {
        ScreenID: "802",
        ModelData: jsonString,
    };

     CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', GenericModeldata, 'GET',function (response) {
        console.log(response);
        var data = response.data.data.Table;

        $("#hdnUserListId").val(data[0].id);

         emp_id_y = data[0].EmpId;

         BindUserType(data[0].UserType);

         BindBranch(data[0].Branch_ID);


         BindOnChangeUser(data[0].EmpId, data[0].UserType);


      
                // $('#ddl_emp').val(data[0].EmpId).trigger('change');

               
        $('#macaddress').val(data[0].MacAddress);
        $('#phone_no').val(data[0].ContactNumber);     
        $('#passwordField').val(data[0].Password);
         var cate = data[0].Category == null || data[0].Category == 0 ? 'Select' : data[0].Category;

         BindCategory(cate);

        var roles = data[0].RoleIDs;
        array = roles.split(',').map(Number);
        for (var i = 0; i < array.length; i++) {
            $("#roleIDs option[value='" + array[i] + "']").prop("selected", true).trigger('change');
            str += array[i] + ",";
        }      
        $('#description').val(data[0].USER_DESC);

        $('#add').modal('show');
    });
}


function FillEmpDetails(id) {

    $('#emp_code').val('');
    $('#emp_name').val('');
    $('#email').val('');
    $('#phone_no').val('');

    var model = {
        Id: id,
        Type: 2
    }

    const jsonString = JSON.stringify(model);

    let GenericModeldata =
    {
        ScreenID: "802",
        ModelData: jsonString, //
    };

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', GenericModeldata, 'GET', function (response) {
        console.log(response);
      
            var data = response.data.data.Table[0];

            $('#emp_code').val(data.emp_code);
            $('#emp_name').val(data.emp_name);
            $('#email').val(data.email);
            $('#phone_no').val(data.phone);


    });
}


function clearForm() {
    $('#ddl_UserType').val('Select').trigger('change');
    $('#ddl_emp').val('Select').trigger('change');
    $('#dldBranch').val('Select').trigger('change');
    $('#dldCategory').val('Select').trigger('change');
    $('#emp_code').val('');
    $('#emp_name').val('');
    $('#macaddress').val('');
    $('#phone_no').val('');
    $('#email').val('');
    $('#passwordField').val('');
    $('#roleIDs').val('').trigger('change');    
    $('#description').val('');

    $('#spddl_UserType').hide();
    $('#spddl_emp').hide();
    $('#spmacaddress').hide();
    $('#spphone_no').hide();
    $('#spemail').hide();
    $('#sppasswordField').hide();
    $('#sproleIDs').hide();
}

function DeleteRole(ctrl) {
    var deleted = !del_var;
    var deleteObj = {
        id: $("#hdnUserListId").val(),
        Type: 2,
        IsActive: !deleted,
        CompanyId: CompId

    }

    const jsonString = JSON.stringify(deleteObj);

    let GenericModeldata =
    {
        ScreenID: "802",
        Operation: "A",
        ModelData: jsonString,
    };


    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            bindItemMasterGrid();

            if (deleted) {
                $('#confirmation').modal('hide');
            }
            else {
                $('#confirmationdeactivate').modal('hide');
            }
        }
    });
}






function saveUSerListMaster() {


    if (checkValidationOnSubmit('Mandatory') == true) {

        var obj = {
            id: $("#hdnUserListId").val(),
            emp_id: $('#ddl_emp').val(),
            MacAdress: $('#macaddress').val(),
            phone : $('#phone_no').val(),
            password: $('#passwordField').val(),
            RoleIDs: $('#roleIDs').val().join(','),
            description: $('#description').val(),
            Branch_ID: $('#dldBranch').val(),
            Category: $('#dldCategory').val(),
            CompanyId: CompId
        }


        const jsonString = JSON.stringify(obj);

        let GenericModeldata =
        {
            ScreenID: "802",
            Operation: "A",
            ModelData: jsonString,
        };

        $('#btn_Save').prop('disabled', true);

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                clearForm();
                $('#add').modal('hide');
                bindItemMasterGrid();

            }
            $('#btn_Save').prop('disabled', false);
        });

    }
}


function updateMenuJson() {
    CommonAjaxMethod(virtualPath + 'ManageEmployee/LoginMenuAccessGet', null, 'GET', function (response) {
        if (response.data.ValidationInput == 1) {


            sessionStorage.setItem('message', '<span class="checkmark">✅</span>Login Menu Access JSON Updated Successfully!!');

            sessionStorage.setItem('successShown', 'true');
            RedirectRoleMasterReques();

        }
        else {
            showMessage(response.ErrorMessage, "error", 5000);

        }
    });
}

function RedirectRoleMasterReques() {
    clearForm();
    var url = "/ManageEmployee/RoleMaster?auth=" + AuthToken;
    window.location.href = url;
}



window.onload = displaySuccessMessage;

