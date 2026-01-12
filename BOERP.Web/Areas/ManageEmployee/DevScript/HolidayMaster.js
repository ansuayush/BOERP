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

    var obj1 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Branch,
        manualTableId: ManaulTableEnum.Branch
    }

    LoadMasterDropdownTMS('dldBranch', obj1, 'Select', false);


    var dropdown = document.getElementById('dldBranch');
    if (dropdown.options.length == 2) {
        $('#dldBranch').prop('disabled', true)
        $('#dldBranch').val(1).trigger('change');

    }

    var obj2 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.FinancialYear,
        manualTableId: ManaulTableEnum.FinancialYear
    }

    LoadMasterDropdownTMS('dldfinyear', obj2, 'Select', false);

    var obj3 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.FinancialYear,
        manualTableId: ManaulTableEnum.FinancialYear
    }

    LoadMasterDropdownTMS('drdfinyear', obj3, 'Select', false);

    //BindHolidayMaster(0);

    setFinYear(0);

    $('#dtHoliday').on('change', function () {
        validateDates();
    });



});

function validateDates() {

    var startDateStr = $('#dtHoliday').val();
  

    // Get today's date
    var today = new Date();

    // Add 4 days
    today.setDate(today.getDate() + 3);

    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();


    var currentDateWithoutTime = new Date(year, month, day);


    var startDateParts = startDateStr.split('-');
   

    // Convert parts to integers
    var startDate = new Date(parseInt(startDateParts[2], 10), parseInt(startDateParts[1], 10) - 1, parseInt(startDateParts[0], 10));


    if (startDateStr) {
        if (startDate < currentDateWithoutTime) {
            
            showMessage("Holiday Date should be 3 days ahead of today's date!", "error", 5000);                             
            $('#dtHoliday').val('');          
        }
    }




}

var FinYear;

function setFinYear(id) {
    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/BindHolidayMaster', { id: id }, 'GET', function (response) {
        console.log(response);

        FinYear = response.data.data.Table1[0].FinYear;
        $('#drdfinyear').val(FinYear).trigger('change');
        $('#dldfinyear').val(FinYear).trigger('change');

    });
}
function BindHolidayMaster(id) {

        var TableID = 'tableHoliday';

    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/BindHolidayMaster', { id: id }, 'GET', function (response) {
        console.log(response);

        

      var table =  $('#tableHoliday').DataTable({
            "processing": true, // for show progress bar           
            "destroy": true,
          "info": false,
          "ordering": true,
            "lengthChange": false,
            "bFilter": true,
            "bSort": false,
            "data": response.data.data.Table,
            "stateSave": false, // Enable state saving
            "columns": [
                //{ "data": "RowNumber" },
                { "data": "HolidayName", "orderable": true, },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {

                        if (row.HolidayDate == null) {
                            return "<label></label>";
                        }
                        else {
                            return "<label>" + getdatewithoutJson(row.HolidayDate) + "</label>";
                        }
                    }
                },
                { "data": "BranchName", "orderable": true, },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {

                        if (row.modifieddate == null) {
                            return "<label></label>";
                        }
                        else {
                            return "<label>" + getdatewithoutJson(row.modifieddate) + "</label>";
                        }
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        return "<label>" + getdatewithoutJson(row.createddate) + "</label>";
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";
                        if (row.isDeleted == false) {
                            if (row.Status == 0) {
                                strReturn = `<div class="Del_9">
                            <input type="checkbox" class="checkbox" onclick="setDelId(this.id)" checked="" id="${row.Id}">
                            <label for="${row.Id}" class="checkbox-label" data-on-label="Active"  data-toggle="modal" data-target="#confirmmsg">
                                <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                <span class="ball"></span>
                            </label>

                        </div>`;
                            }
                            else {
                                strReturn = ` <div class="Del_9">
                                    <input type="checkbox" class="checkbox" id="${row.Id}" onclick="DeleteHoliday(this)" switch="bool" checked="">
                                        <label for="${row.Id}" class="checkbox-label" > 
                                            <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                                    <span class="ball"></span>
                            </label>

                        </div>`;

                               
                            }
                        }
                        else {
                            if (row.Status == 0) {
                                strReturn = `< div class="Del_9" >
                                    <input type="checkbox" class="checkbox" onclick="setDelId(this.id)" id="${row.Id}">
                                        <label for="${row.Id}" class="checkbox-label" data-on-label="Active" data-toggle="modal" data-target="#confirmmsg">
                                            <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                                    <span class="ball"></span>
                            </label>

                        </div>`;
                            }

                            else {
                                strReturn = `<div class="Del_9">
                                    <input type="checkbox" class="checkbox" id="${row.Id}" onclick="DeleteHoliday(this)" switch="bool">
                                        <label for="${row.Id}" class="checkbox-label" >
                                            <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                                    <span class="ball"></span>
                            </label>

                        </div>`;
                            }
                        }

                        return strReturn;
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {

                        if (row.Status == 0) {
                            var strReturn = "";
                            strReturn = '<div class="d-flex td-action-btn">' +
                                '<a href="#" id="' + row.Id + '" class="Edit_9" data-toggle="modal" data-target="#confirmmsg" disabled   ><img src="~/../../assets/images/icons/help/edit-icon.png" alt="" class="action-image" data-toggle="tooltip" title="Edit"></a>'
                                + '</div>'
                        }
                        else {
                            var strReturn = "";
                            strReturn = '<div class="d-flex td-action-btn">' +
                                '<a href="" id="' + row.Id + '" class="Edit_9" onclick="EditHolidayMaster(this.id)" data-toggle="modal" data-target="#add"  > <img src="~/../../assets/images/icons/help/edit-icon.png" alt="" class="action-image" data-toggle="tooltip" title="Edit"></a>'
                                + '</div>'
                        }


                        return strReturn;
                    }
                },


            ]
      });

    //    getModifyAccess(table, 9);
    
        initCompleteCallback(TableID)
    });

}

let tblData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindItemMasterGrid(0);



});


function bindItemMasterGrid(id) {
    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start

    //End

    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/BindHolidayMaster', { id: id }, 'GET', function (response) {
        console.log(response);
        tblData = response.data.data.Table;
        var columnMeta = response.data.data.Table3;
        gridOptions = bindAgGrid("#myGrid", 'Holiday', columnMeta, tblData);
        $("#customLoader").hide();
    });
}

function changeFinancialYear() {

    if ($('#drdfinyear').val() != 'Select') { 
    var id = $('#drdfinyear').val();
 
        BindHolidayMaster(id);
        }
        
}

var isEdit = false;
function addHolidayId() {
    isEdit = false;
    clearForm();
    $("#hdnHolidayMasterId").val(0)
    $('#dldBranch').val(1).trigger('change');
}

function EditHolidayMaster(id) {

    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/GetHolidayMasterById', { id: id }, 'GET', function (response) {
        console.log(response);
        var data = response.data.data.Table;


        $("#hdnHolidayMasterId").val(data[0].id);
        $("#txtHoliday").val(data[0].HolidayName);
        $("#dtHoliday").val(ChangeDateFormatToddMMYYY(data[0].HolidayDate));
        $('#dldBranch').val(data[0].BranchID).trigger('change');
        $('#dldfinyear').val(data[0].FinYear).trigger('change');
        if (data[0].Description != null || data[0].Description != "") {
            $("#desHoliday").val(data[0].Description);
        }       

        if (data[0].isdeleted == false) {
            $("#popswitch1").prop('checked', true);
        }
       else {
            $("#popswitch1").prop('checked', false);
        }

        isEdit = true;

    });
}


function clearForm() {
    $("#popswitch1").prop('checked', true);
    $("#hdnHolidayMasterId").val('');
    $("#txtHoliday").val('');
    $("#dtHoliday").val('');
    $("#desHoliday").val('');
    $('#dldBranch').val('Select').trigger('change');
}

var del_id;

function setDelId(ctrl) {

    del_id = ctrl;
}

function DeleteHoliday(ctrl) {
   
    var deleted = $(ctrl).prop('checked') ? false : true;

    del_id = ctrl.id;

    var deleteObj = {
        id: ctrl.id,
        Type: 2,
        isDeleted: deleted

    }
    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/DeleteHolidayMasterById', deleteObj, 'POST', function (response) {
        if (response.ValidationInput == 1) {

            setTimeout(function () {
                RedirectHolidayMasterReques();
            },1000);
            
        }
    });
}

function closeEmpDel() {


    if ($(`${del_id}`).prop('checked')) {

        $(`#${del_id}`).prop('checked', false);

    }
    else {
        $(`#${del_id}`).prop('checked', true);
    }

}

function saveHolidayMaster() {


    if (checkValidationOnSubmit('Mandatory') == true) {

        var deleted = $("#popswitch1").prop('checked');      
        var isDeleted = false
        if (deleted == false) {
            isDeleted = true;

        }

        
        var obj = {

            id: $("#hdnHolidayMasterId").val(),
            HolidayName: $("#txtHoliday").val(),
            HolidayDate: ChangeDateFormat($("#dtHoliday").val()),
            BranchID: $('#dldBranch').val(),
            FinYear: $('#dldfinyear').val(),
            Description: $("#desHoliday").val(),
            isDeleted: isDeleted
        }

        $('#add').modal('hide');
        CommonAjaxMethodTMS(baseURL + 'ManageEmployee/SaveHolidayMaster', obj, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                RedirectHolidayMasterReques();
            }
           
        });

    }
}

function RedirectHolidayMasterReques() {
    clearForm();
    var url = "/ManageEmployee/HolidayMaster?auth=" + AuthToken;
    window.location.href = url;
}



window.onload = displaySuccessMessage;