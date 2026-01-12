$(document).ready(function () {

    $(function () {
        $('.datepickersecond').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "dd-mm-yy",
            yearRange: "-20:+10",
            onSelect: function (dateText) {
                // Show × icon when a date is selected
                $(this).siblings('.clear-date').show();
            }
        });

        // Open the datepicker when the calendar icon is clicked
        $(".dateicon").click(function () {
            $(this).prev(".datepickersecond").focus();  // Open the associated datepicker
        });

        // Clear date when clicking the × icon
        $('.clear-date').on('click', function () {
            const $input = $(this).siblings('.datepickersecond');
            $input.val('');          // Clear input
            $(this).hide();          // Hide × icon
        });

    });



    var obj2 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Employee,
        manualTableId: 0
    }

    LoadMasterDropdownTMS('dldEmployee', obj2, 'Select', false);



    var obj3 = {
        ParentId: 0,
        masterTableType: 3,
        isMasterTableType: true,
        isManualTable: false,
        manualTable: 0,
        manualTableId: 0
    }
    LoadMasterDropdownTMS('dldLeave', obj3, 'Select', false);

   // BindAttendanceMaster();



});



function BindAttendanceMaster() {


    var TableID = 'tableAttendance';

    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/BindAttendanceMaster', null, 'GET', function (response) {
        console.log(response);



        var table = $('#tableAttendance').DataTable({
            "processing": true, // for show progress bar           
            "destroy": true,
            "info": false,
            "ordering": true,
            "lengthChange": false,
            "bFilter": true,
            "bSort": false,
            "data": response.data.data.Table,
            "stateSave": true, // Enable state saving
            "columns": [
                //{ "data": "RowNumber" },
                { "data": "emp_code" },
                { "data": "emp_name" },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {

                        return "<label>" + getdatewithoutJson(row.AttDate) + "</label>";

                    }
                },
                { "data": "Leave" },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";
                        if (row.isEditable == 1) {
                            strReturn =
                                '<div class="d-flex td-action-btn">' +
                                '<a disabled href="#"   id="' + row.Id + '" class="Edit_10"  title="" data-original-title="Edit" onclick="EditAttendanceMaster(this.id)" class="edtclr"><img src="~/../../assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a>'
                               
                        }
                        else {
                            strReturn = "";
                        }


                        return strReturn;
                    }
                }


            ]
        });
      //  getModifyAccess(table, 10);
        initCompleteCallback(TableID)

    });

}

let tblData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindItemMasterGrid();



});


function bindItemMasterGrid( ) {
    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start

    //End


    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/BindAttendanceMaster', null, 'GET', function (response) {
        console.log(response);
        tblData = response.data.data.Table;
        var columnMeta = response.data.data.Table1;
        gridOptions = bindAgGrid("#myGrid", 'Attendance', columnMeta, tblData);
        $("#customLoader").hide();
    });
}



var isEdit = false;
function EditAttendanceMaster(id) {

    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/GetAttendanceMasterById', { id: id }, 'GET', function (response) {
        console.log(response);
        var data = response.data.data.Table;


        $(".Add_10").show();
        $("#hdnAttendanceMasterId").val(data[0].id);
        $("#dtAttendance").val(ChangeDateFormatToddMMYYY(data[0].AttDate));
        $("#dldEmployee").val(data[0].Employee).trigger('change');
        $("#dldLeave").val(data[0].LeaveType).trigger('change');
        $("#dldEmployee").prop('disabled', true)
        $("#dtAttendance").prop('disabled', true)

        isEdit = true;

    });

}



function clearForm() {
    $("#designName").val('');
}


function DeleteAttendance(ctrl) {
    var deleteArray = [];

    var deleteObj = {
        id: ctrl,
        Type: 2,
        isDeleted: 1,
        isActive: 0

    }
    deleteArray.push(deleteObj);

    var AttendanceMasterModel = {
        AttendanceModel: deleteArray
    }
    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/DeleteAttendanceMasterById', AttendanceMasterModel, 'POST', function (response) {
        if (response.ValidationInput == 1) {

            sessionStorage.setItem("message", '<span class="checkmark">✅</span> Record Deleted Successfully!!')
            sessionStorage.setItem('successShown', 'true');
            RedirectAttendanceMasterReques();
        }
    });
}

var attArray = [];
function saveAttendanceMaster() {


    if (checkValidationOnSubmit('Mandatory') == true) {


        var employee = $("#dldEmployee").val();

        if ($("#hdnAttendanceMasterId").val() == null || $("#hdnAttendanceMasterId").val() == "") {
            isEdit = false;
            for (var i = 0; i < employee.length; i++) {
                var obj = {
                    id: 0,
                    AttDate: ChangeDateFormat($("#dtAttendance").val()),
                    Employee: employee[i],
                    Type: 1,
                    LeaveType: $("#dldLeave").val()
                }
                attArray.push(obj)
            }
        }
        else {

            var obj = {
                id: $("#hdnAttendanceMasterId").val(),
                AttDate: ChangeDateFormat($("#dtAttendance").val()),
                Type: 3,
                LeaveType: $("#dldLeave").val()
            }
            attArray.push(obj)
        }

        console.log(attArray);

        var AttendanceMasterModel = {
            AttendanceModel: attArray
        }

        CommonAjaxMethodTMS(baseURL + 'ManageEmployee/SaveAttendanceMaster', AttendanceMasterModel, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                if (isEdit == true) {
                    sessionStorage.setItem('message', '<span class="checkmark">✅</span> Attendance Updated Successfully');
                }
                else {
                    sessionStorage.setItem('message', '<span class="checkmark">✅</span> Attendance Saved Successfully');
                }
                sessionStorage.setItem('successShown', 'true');
                RedirectAttendanceMasterReques();
            }
            else {
                //showMessage(response.ErrorMessage, "error", 5000);
            }
            attArray = [];
        });


    }
}

function RedirectAttendanceMasterReques() {
    clearForm();
    var url = "/ManageEmployee/AttendanceMaster?auth=" + AuthToken;
    window.location.href = url;
}



window.onload = displaySuccessMessage;
