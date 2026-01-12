$(document).ready(function () {


    // BindRoleMaster();


});



//function BindRoleMaster() {

//    var TableID = 'tableRole';

//    var model = {
//        Id: 0,
//        Type: 1      
//    }

//    const jsonString = JSON.stringify(model);

//    let GenericModeldata =
//    {
//        ScreenID: "801",
//        ModelData: jsonString,
//    };


//    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', GenericModeldata, 'GET', function (response) {
//        console.log(response);



//        var table = $('#tableRole').DataTable({
//            "processing": true, // for show progress bar           
//            "destroy": true,
//            "ordering": true,
//            "info": false,
//            "lengthChange": false,
//            "bFilter": true,
//            "bSort": false,
//            "data": response.data.data.Table,
//            "stateSave": true, // Enable state saving
//            "columns": [
//                //{ "data": "RowNumber", "orderable": false, },             
//                {
//                    "data": "role_name",
//                    "orderable": true,
//                    "render": function (data, type, row) {
//                        if (type === "display" || type === "filter") {
//                            return '<span><a href="../Masters/Master/RoleMenuManagement?auth=' + AuthToken + '&roleId=' + row.Id + '" data-toggle="tooltip" class="d-flex justify-content-between" title="" data-original-title="' + row.role_name + '"><strong>' + row.role_name + ' </strong> <span><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span></a></span>';
//                        }
//                        return data; // Ensure sorting works using raw data
//                    }
//                },

//                {
//                    "orderable": false,
//                    data: null, render: function (data, type, row) {
//                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + row.description + "' title=''>" + row.description + "</p>";
//                    }
//                },
//                {
//                    "orderable": false,
//                    data: null, render: function (data, type, row) {
//                        return "<label>" + formatDateTime(row.createddate) + "</label>";
//                    }
//                },
//                {
//                    "orderable": false,
//                    data: null, render: function (data, type, row) {

//                        if (row.modifieddate == null) {
//                            return "<label></label>";
//                        }
//                        else {
//                            return "<label>" + formatDateTime(row.modifieddate) + "</label>";
//                        }
//                    }
//                },
//                {
//                    "orderable": false,
//                    data: null, render: function (data, type, row) {
//                        var strReturn = "";
                        
//                        strReturn += `
//                        <div class="d-flex td-action-btn">
//                                <div class="Del_9">
//                                    <input type="checkbox" class="checkbox" onclick="set_delVariable(${row.isDeleted}, ${row.Id}, '${row.role_name}')" ${!row.isDeleted ? `checked = ""` : ``} id="popswitch1_${row.Id}" >
//                                        <label for="popswitch1_${row.Id}" class="checkbox-label" data-on-label="Active" data-toggle="modal" ${row.isDeleted ? `data-target="#confirmationdeactivate"` : `data-target="#confirmation"`}>
//                                            <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
//                                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
//                                                    <span class="ball"></span>
//                                                </label>

//                                            </div>
//                        <span class="gap-space">|</span>
//                        <a href="" onclick="EditRoleMaster(${row.Id})" data-toggle="modal" data-target="#edit"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> 
//                        </i></a></div>`;

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

        screenId: '801',
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
        gridOptions = bindAgGrid("#myGrid", 'Role', columnMeta, tblData);
        $("#customLoader").hide();
    });
}

var del_var;

function set_delVariable(isdeleted, id, name) {

    $("#hdnRoleMasterId").val(id);
    del_var = isdeleted;
    $('#role_name').html(name);
    $('#role_name2').html(name);
}

function closeUserlistDel() {

    var del_id = $('#hdnRoleMasterId').val();

    if ($(`#popswitch1_${del_id}`).prop('checked')) {

        $(`#popswitch1_${del_id}`).prop('checked', false);

    }
    else {
        $(`#popswitch1_${del_id}`).prop('checked', true);
    }

}



function addRoleId() {
    isEdit = false;
    clearForm();
    $("#hdnRoleMasterId").val(0)
}


function EditRoleMaster(id) {

    $('spRoleName').hide();
    var model = {
        Id: id,
        Type: 1
    }

    const jsonString = JSON.stringify(model);

    let GenericModeldata =
    {
        ScreenID: "801",
        ModelData: jsonString,
    };

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', GenericModeldata, 'GET', function (response) {
        console.log(response);
        var data = response.data.data.Table;

        $("#hdnRoleMasterId").val(data[0].id);
        $("#RoleName").val(data[0].role_name);
        $("#description").val(data[0].description);

        $('#add').modal('show');
    });
}


function clearForm() {
    $("#RoleName").val('');
    $('#description').val('');
}

function DeleteRole(ctrl) {
    var deleted = !del_var;
    var deleteObj = {
        id: $("#hdnRoleMasterId").val(),
        Type: 2,
        isDeleted: deleted

    }

    const jsonString = JSON.stringify(deleteObj);

    let GenericModeldata =
    {
        ScreenID: "801",
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






function saveRoleMaster() {


    if (checkValidationOnSubmit('Mandatory') == true) {
      
        var obj = {
            id: $("#hdnRoleMasterId").val(),
            role_name: $("#RoleName").val(),
            description: $("#description").val(),
        }


        const jsonString = JSON.stringify(obj);

        let GenericModeldata =
        {
            ScreenID: "801",
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

function base64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}


window.onload = displaySuccessMessage;

