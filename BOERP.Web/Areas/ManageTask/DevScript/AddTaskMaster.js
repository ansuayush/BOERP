$(document).ready(function () {


    $(function () {
        $('.datepickersecond').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "dd-mm-yy",
            yearRange: "-75:+75",
            onSelect: function (dateText) {
                // Show × icon when a date is selected
                $(this).siblings('.clear-date').show();
            }
        });

        // Open datepicker when clicking the icon
        $('.input-group-text').on('click', function () {
            $(this).closest('.input-group').find('.datepickersecond').focus();
        });

        // Clear date when clicking the × icon
        $('.clear-date').on('click', function () {
            const $input = $(this).siblings('.datepickersecond');
            $input.val('');          // Clear input
            $(this).hide();          // Hide × icon
        });

    });


    $(function () {
        $('.datepickerend').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "dd-mm-yy",
            yearRange: "-100:+100",
            onSelect: function (dateText) {
                // Show × icon when a date is selected
                $(this).siblings('.clear-date').show();
            }
        });

        // Open datepicker when clicking the icon
        $('.input-group-text').on('click', function () {
            $(this).closest('.input-group').find('.datepickerend').focus();
        });

        // Clear date when clicking the × icon
        $('.clear-date').on('click', function () {
            const $input = $(this).siblings('.datepickerend');
            $input.val('');          // Clear input
            $(this).hide();          // Hide × icon
        });

    });


    $('#dldDepartment').prop('disabled', true);

    $('#dldBranch').prop('disabled', true);

    $("#resultupload").on("change", function () {

        $("#resultImage").removeClass('Mandatory');
        $("#yesupload").hide();
        $("#yesrefupload").hide();

        if ($("#resultupload").val() == 1 || $("#resultupload").val() == 3) {
            $("#yesupload").show();
            $("#yesrefupload").show();
            $("#resultImage").addClass('Mandatory');
        }

    });
  

    $("#resultImage").change(function () {
        UploadocumentTaskReport();

    });

    $("#resultImage").removeClass('Mandatory');
    $("#yesupload").hide();
    $("#yesrefupload").hide();

    $("#auditrequired").on("change", function () {
        $("#dldAuditController").removeClass("Mandatory");
        $("#auditcontroller").css("display", "none");
        if ($(this).val() === "2") {
            $("#auditcontroller").css("display", "block");
            $("#dldAuditController").addClass("Mandatory");
        }
    });

    $("#bitCheckList").on("change", function () {
        $("#yes").css("display", "none");
        $(".checknoshow").css("display", "none");
        $("#yesupload").css("display", "none");
        $("#yesremark").css("display", "none");        
        if ($(this).val() === "true") {
            $("#yes").css("display", "block");
            $("#yesTable").css("display", "block");
            $("#remarks").css("display", "none");
            $("#yes").focus();
            $("#questionoption").addClass("Mandatory");
            $("#question").addClass("Mandatory");
            $(".checknoshow").css("display", "none");
            $("#resultupload").val('Select').trigger('change');
            $("#remarksRequired").val('Select').trigger('change');
            $('#hdnUploadActualFileName').val('');
            $('#hdnUploadFileUrl').val('');
            $('#hdnUploadNewFileName').val('');
            $('#remark').val('');
            document.getElementById('scrolling').scrollIntoView({ behavior: 'smooth' });
        }
        if ($(this).val() === "false") {
            $("#yes").css("display", "none");
            $("#yesTable").css("display", "none");
            $(".checknoshow").css("display", "block");
            $("#questionoption").removeClass("Mandatory");
            $("#question").removeClass("Mandatory");
            $("#remarks").show();


            quesArray = [];
            qid = 0;
            ClearQuesForm();
        }
    });
   
    //$("#txtFileRefferenceImage").change(function () {
    //    UploadocumentReport();

    //});

    var obj = {
        ParentId: 0,
        masterTableType: DropDownTypeEnum.Frequency,
        isMasterTableType: true,
        isManualTable: false,
        manualTable: 0,
        manualTableId: 0
    }
    LoadMasterDropdownTMS('ddlFrequency', obj, 'Select', false);

    var obj1 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Department,
        manualTableId: 0
    }
    LoadMasterDropdownTMS('dldDepartment', obj1, 'Select', false);


    var obj2 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Employee,
        manualTableId: ManaulTableEnum.Employee
    }

    LoadMasterDropdownTMS('dldDoer', obj2, 'Select', false);
    LoadMasterDropdownTMS('EscalateTo', obj2, '', false);
    LoadMasterDropdownTMS('dldSecDoer', obj2, 'Select', false);
    LoadMasterDropdownTMS('dldContoller', obj2, 'Select', false);
    LoadMasterDropdownTMS('dldAuditController', obj2, 'Select', false);

    var obj3 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Branch,
        manualTableId: ManaulTableEnum.Branch
    }

    LoadMasterDropdownTMS('dldBranch', obj3, 'Select', false);


    $('#dtStartDate, #dtEndDate').on('change', function () {
        validateDates();
    });

    if (Edit_ID != 0) {

        if (isDuplicate == 1) {

            // Get the last year from the range (+75 from the current year)
            let today = new Date();
            let lastYear = today.getFullYear() + 75; // Max year from yearRange
            let lastDayLastYear = new Date(lastYear, 11, 31); // December 31st

            // Format as dd-mm-yyyy
            let formattedDate = ("0" + lastDayLastYear.getDate()).slice(-2) + "-" +
                ("0" + (lastDayLastYear.getMonth() + 1)).slice(-2) + "-" +
                lastDayLastYear.getFullYear();

            // Set the value in the input field
            $("#dtEndDate").val(formattedDate);


            document.getElementById("dtTaskTime").value = "10:00";

            $('#numExpiryDay').val(60);

            $('#updTrans').hide();
            GetTaskId();
            DuplicateTaskMaster(Edit_ID);
        }
        else {            

            $('#dtStartDate').prop('disabled', true);
            EditTaskMaster(Edit_ID);
        } 
    }    
    else {


        // Get the last year from the range (+75 from the current year)
        let today = new Date();
        let lastYear = today.getFullYear() + 75; // Max year from yearRange
        let lastDayLastYear = new Date(lastYear, 11, 31); // December 31st

        // Format as dd-mm-yyyy
        let formattedDate = ("0" + lastDayLastYear.getDate()).slice(-2) + "-" +
            ("0" + (lastDayLastYear.getMonth() + 1)).slice(-2) + "-" +
            lastDayLastYear.getFullYear();

        // Set the value in the input field
        $("#dtEndDate").val(formattedDate);


        document.getElementById("dtTaskTime").value = "10:00";

        $('#numExpiryDay').val(60);

        $('#updTrans').hide();
        GetTaskId();
    }


    $('#dldDoer, #dldSecDoer').on("change", function () {

        const id = $('#dldDoer').val();

        const sec_id = $('#dldSecDoer').val() == 'Select' ? 0 : $('#dldSecDoer').val();

        if ($('#dldDoer').val() == 'Select') {
            $('#dldBranch').val('Select').trigger('change');
            $('#dldDepartment').val('Select').trigger('change');
            return;
        }

        else if ($('#dldSecDoer').val() == $('#dldDoer').val()) {
            showMessage('The Doer and Secondary doer cannot be same!!', 'error', 5000);
            $('#dldSecDoer').val('Select').trigger('change');
        }
   
        else
        {


            CommonAjaxMethodTMS(baseURL + 'ManageTask/GetTaskMasterById', { id: $('#dldDoer').val(),Branch: sec_id  , Type: 2 }, 'GET', function (response) {
                console.log(response);

                data = response.data.data.Table[0];

                $('#dldBranch').val(data.Branch_ID).trigger('change');
                $('#dldDepartment').val(data.DepartmentID).trigger('change');

                if ($('#dldSecDoer').val() != 'Select') {
                    if (data.Branch_ID != data.Branch_Sec_Id) {
                        showMessage('The Doer and Secondary doer should belong to the same Branch!!', 'error', 5000);
                        $('#dldSecDoer').val('Select');
                    }
                   
                }

            });

        }
    })



});

//ActualFilename: $("#hdnUploadActualFileName").val(),
//    NewFilename: $("#hdnUploadNewFileName").val(),
//        FileURL: $("#hdnUploadFileUrl").val(),

function validateDates() {
    var startDateStr = $('#dtStartDate').val();
    var endDateStr = $('#dtEndDate').val();

    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();
    var day = currentDate.getDate();


    var currentDateWithoutTime = new Date(year, month, day);
     

    var startDateParts = startDateStr.split('-');
    var endDateParts = endDateStr.split('-');

    // Convert parts to integers
    var startDate = new Date(parseInt(startDateParts[2], 10), parseInt(startDateParts[1], 10) - 1, parseInt(startDateParts[0], 10));
    var endDate = new Date(parseInt(endDateParts[2], 10), parseInt(endDateParts[1], 10) - 1, parseInt(endDateParts[0], 10));

    if (Edit_ID == 0 || isDuplicate == 1) {
        if (startDateStr) {
            if (startDate < currentDateWithoutTime) {
                FailToaster("Start date should be grater or equal to today's date!");                             
                $('#dtStartDate').val('');               
            }
        }
    }

    if (startDateStr && endDateStr) { // Check if both start and end dates are provided


        if (startDate >= endDate) {            
            FailToaster('End date should be grater than start date!');  
            $('#dtEndDate').val('');           
        }
    }
}
function bindQuestion(id) {
    ClearQuesForm();
    $("#hdnUpdateQuesId").val(id);

    var i;
    if (quesArray.length > 0) {
        for (i = 0; i < quesArray.length; i++) {
            if (quesArray[i].Id == id) {
                break;
            }
        }



        $("#question").val(quesArray[i].Question);
        $("#questionoption").val(quesArray[i].Type).trigger('change');
        if (quesArray[i].IsMandatory == true) {
            $('#isMandatory').prop('checked', true);
        }
        $("#myQuesImage").attr("src", quesArray[i].FileURL);
        $('#hdnUploadQuesFileUrl').val(quesArray[i].FileURL)
        $('#hdnUploadQuesNewFileName').val(quesArray[i].NewFilename)
        $('#hdnUploadQuesActualFileName').val(quesArray[i].ActualFilename)

        var pr = quesArray[i].Priority;



        $('#prnum').val(pr);
        $('#prtxt').val(pr);
        $('#prsingle').val(pr);
        $('#prdate').val(pr);
        $('#prmulti').val(pr);

        if (quesArray[i].Type == 'Numerical') {
            if (quesArray[i].IsUploadImage == true) {
                $("#isuploadNum").val('yes').trigger('change');
            }
            else {
                $("#isuploadNum").val('no').trigger('change');
            }
        }

        if (quesArray[i].Type == 'text') {
            if (quesArray[i].IsUploadImage == true) {
                $("#isuploadTxt").val('yes').trigger('change');
            }
            else {
                $("#isuploadTxt").val('no').trigger('change');
            }
        }

        if (quesArray[i].Type == 'dateandtime') {
            if (quesArray[i].IsUploadImage == true) {
                $("#isuploadDate").val('yes').trigger('change');
            }
            else {
                $("#isuploadDate").val('no').trigger('change');
            }
        }

        if (quesArray[i].Type == 'singleselect') {
            if (quesArray[i].IsUploadImage == true) {
                $("#isuploadSingle").val('yes').trigger('change');
            }
            else {
                $("#isuploadSingle").val('no').trigger('change');
            }
        }

        if (quesArray[i].Type == 'multiplechoice') {
            if (quesArray[i].IsUploadImage == true) {
                $("#isuploadMulti").val('yes').trigger('change');
            }
            else {
                $("#isuploadMulti").val('no').trigger('change');
            }
        }


        if (quesArray[i].Type == 'singleselect') {
            var sselect = '';
            for (let k = 0; k < quesArray[i].QuestionSingleMultiSelectModelList.length; k++) {

                sselect += '<div class="required_inp"><div class="radiooption d-flex"><div class="radio  align-self-center"><input id="radio-3" name="radio" type="radio" disabled><label for="radio-3" class="radio-label"></label></div><div class="radioinput"><input type="text" value="' + quesArray[i].QuestionSingleMultiSelectModelList[k].OptionText + '" placeholder = "Enter" onchange="EmptySOptions()" class= "form-control singlechoice" /></div > <div class="radioremove align-self-center text-center inputRemove"><i class="fas fa-times"></i></div></div ></div > ';

            }
            document.getElementById("divradio").innerHTML = sselect;
        }

        if (quesArray[i].Type == 'multiplechoice') {
            var multichoice = '';
            for (let j = 0; j < quesArray[i].QuestionSingleMultiSelectModelList.length; j++) {
                multichoice += '<div class="required_checkbox"><div class="checkboxdgn d-flex"><div class="checkdgn "><input id="checkbox" name="checkbox" class="checkbox" type="checkbox" checked disabled><label for="checkbox"></label></div><div class="radioinput"><input type="text" value="' + quesArray[i].QuestionSingleMultiSelectModelList[j].OptionText + '" placeholder="Enter " onchange="EmptyMOptions()" class="form-control multiselect"  /></div><div class="radioremove checkboxRemove align-self-center"><i class="fas fa-times"></i></div></div></div>';

            }
            document.getElementById("divcheckbox").innerHTML = multichoice;
        }

    }
}

var quesArray = [];
var qid = 0;
var isMandatory;

function AddQuesOption() {



    if ($('#isMandatory').prop('checked')) {
        isMandatory = true;
    } else {
        isMandatory = false;
    }


    if (checkValidationOnSubmit('Mandatory') == true) {
        let options = [];
        let pr;
        
        if ($("#questionoption").val() === 'singleselect' || $("#questionoption").val() === 'multiplechoice') {

         


            let inputElements;
            var text = "";
            if ($("#questionoption").val() === 'multiplechoice') {
                if ($('#prmulti').val() > 0 && $('#prmulti').val() < 100) {
                    pr = $('#prmulti').val();
                }
                else {
                    FailToaster('Priority should be between 0 and 100');  
                    return;
                }
                inputElements = document.querySelectorAll('.multiselect');
                text = "isuploadMulti";
              
            }
            else {
                if ($('#prsingle').val() > 0 && $('#prsingle').val() < 100) {
                    pr = $('#prsingle').val();
                }
                else {
                    FailToaster('Priority should be between 0 and 100');
                    return;
                }


                inputElements = document.querySelectorAll('.singlechoice');
                text = "isuploadSingle";
            }
            qid++;

            if (inputElements.length > 0) {
                var isEmpty = false;
                for (const inputElement of inputElements) {
                    // Get the value from the current input element
                    if (inputElement.value == "") {
                        isEmpty = true;
                        break;
                    }

                    else {
                        EmptySOptions();

                        const value = inputElement.value;
                        var objOption = {
                            OptionText: value,
                            Question_Id: qid
                        };

                        // Push the value to the array
                        options.push(objOption);
                    }
                }

                if (isEmpty == true) {
                    if ($("#questionoption").val() === 'singleselect') {
                        $("#spSingle").html('Please Fill all the options!!');
                        $("#spSingle").show();
                    }
                    else {
                        $("#spMulti").html('Please Fill all the options!!');
                        $("#spMulti").show();
                    }
                    return;
                }
            } else {
                if ($("#questionoption").val() === 'singleselect') {
                    $("#spSingle").html('Please add atleast one option!!');
                    $("#spSingle").show();
                }
                else {
                    $("#spMulti").html('Please add atleast one option!!');
                    $("#spMulti").show();
                }

                return;
            }


                var obj = {
                    Id: qid,
                    Question: $("#question").val(),
                    Type: $("#questionoption").val(),
                    IsMandatory: isMandatory,
                    ActualFilename: $('#hdnUploadQuesActualFileName').val(),
                    NewFilename: $('#hdnUploadQuesNewFileName').val(),
                    FileURL: $('#hdnUploadQuesFileUrl').val(),
                    IsUploadImage: $("#" + text).val() == 'yes'? true : false,
                    QuestionSingleMultiSelectModelList: options,
                    Priority: parseInt(pr,10)


                }

                quesArray.push(obj);
                console.log(quesArray);

                ClearQuesForm();

                BindQuestionOption();

          

        }


        else if ($("#questionoption").val() === 'Numerical') {

            if ($('#prnum').val() > 0 && $('#prnum').val() < 100) {
                pr = $('#prnum').val();
            }
            else {
                FailToaster('Priority should be between 0 and 100');
                return;
            }

            qid++;
            var obj = {
                Id: qid,
                Question: $("#question").val(),
                Type: $("#questionoption").val(),
                IsMandatory: isMandatory,
                ActualFilename: $('#hdnUploadQuesActualFileName').val(),
                NewFilename: $('#hdnUploadQuesNewFileName').val(),
                FileURL: $('#hdnUploadQuesFileUrl').val(),
                IsUploadImage: $("#isuploadNum").val() == 'yes' ? true : false,
                Priority: pr
            }

            quesArray.push(obj);
            console.log(quesArray);

            ClearQuesForm();

            BindQuestionOption();

        }

        else if ($("#questionoption").val() === 'text') {
           
            if ($('#prtxt').val() > 0 && $('#prtxt').val() < 100) {
                pr = $('#prtxt').val();
            }
            else {
                FailToaster('Priority should be between 0 and 100');
                return;
            }

            qid++;
            var obj = {
                Id: qid,
                Question: $("#question").val(),
                Type: $("#questionoption").val(),
                IsMandatory: isMandatory,
                ActualFilename: $('#hdnUploadQuesActualFileName').val(),
                NewFilename: $('#hdnUploadQuesNewFileName').val(),
                FileURL: $('#hdnUploadQuesFileUrl').val(),
                IsUploadImage: $("#isuploadTxt").val() == 'yes' ? true : false,
                Priority: parseInt(pr, 10)

            }

            quesArray.push(obj);
            console.log(quesArray);

            ClearQuesForm();

            BindQuestionOption();
        }
        else if ($("#questionoption").val() === 'dateandtime') {

            if ($('#prdate').val() > 0 && $('#prdate').val() < 100) {
                pr = $('#prdate').val();
            }
            else {
                FailToaster('Priority should be between 0 and 100');
                return;
            }
                
            qid++;
            var obj = {
                Id: qid,
                Question: $("#question").val(),
                Type: $("#questionoption").val(),
                IsMandatory: isMandatory,
                ActualFilename: $('#hdnUploadQuesActualFileName').val(),
                NewFilename: $('#hdnUploadQuesNewFileName').val(),
                FileURL: $('#hdnUploadQuesFileUrl').val(),
                IsUploadImage: $("#isuploadDate").val() == 'yes' ? true : false,
                Priority: parseInt(pr, 10)


            }

            quesArray.push(obj);
            console.log(quesArray);

            ClearQuesForm();
            BindQuestionOption();
        }
        const sortedByPrice = sortArrayByColumn(quesArray, 'Priority');
        handleQuesDelete($("#hdnUpdateQuesId").val());
    }



}

function ClearQuesForm() {

    var single = '<div class="radiooption d-flex">'
        + '<div class="radio align-self-center">'
        + '<input id="radio-1" name="radio" class="radio" disabled=""  type="radio" disabled>'
        + '<label for="radio-1" class="radio-label"></label>'
        + '</div>'
        + '<div class="radioinput">'
        + '<input type="text" placeholder="Enter" class="form-control singlechoice">'
        + '</div>'
        + '<div class="radioremove align-self-center"></div>'
        + '</div>';

    var multi = '<div class="checkboxdgn d-flex" >'
        + '<div class="checkdgn" >'
        + '<input id="checkbox" name="checkbox" class="checkbox" type="checkbox" checked="" disabled="">'
        + '<label for="checkbox"></label>'
        + '</div>'
        + '<div class="radioinput">'
        + '<input type="text" placeholder="Enter " class="form-control multiselect">'
        + '</div>'
        + '<div class="radioremove align-self-center"></div>'
        + '</div >';

    document.getElementById("divradio").innerHTML = single;

    $('#divcheckbox').html(multi);


    $("#question").val('');
    $('#questionoption').val('Select').trigger('change');
    $("#numFileRefferenceImage").val("");
    $("#txtFileRefferenceImage").val("");
    $("#dateFileRefferenceImage").val("");
    $("#isuploadNum").val('Select').trigger('change');
    $("#isuploadTxt").val('Select').trigger('change');
    $("#isuploadDate").val('Select').trigger('change');
    $("#spnumFileRefferenceImage").hide();
    $("#sptxtFileRefferenceImage").hide();
    $("#spdateFileRefferenceImage").hide();
    $("#isuploadSingle").val('Select').trigger('change');
    $("#isuploadMulti").val('Select').trigger('change');
    $("#singleFileRefferenceImage").val("");
    $("#multiFileRefferenceImage").val("");
    $('#hdnUploadQuesFileUrl').val('')
    $('#hdnUploadQuesNewFileName').val('')
    $('#hdnUploadQuesActualFileName').val('')


}
function BindQuestionOption() {



    $('#tableAddTaskmaster').DataTable({
        "processing": true, // for show progress bar           
        "destroy": true,
        "info": false,
        "lengthChange": false,
        "bFilter": true,
        "bSort": true,
        "data": quesArray,
        "order": [[2, 'asc']],
        "columns": [
            /*  { "data": "Id" },*/
            { "data": "Question" },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {

                    switch (row.Type) {
                        case 'singleselect':
                            strReturn = 'Single Select';
                            break;
                        case 'dateandtime':
                            strReturn = 'Date and Time';
                            break;
                        case 'multiplechoice':
                            strReturn = 'Multiple Choice';
                            break;
                        case 'text':
                            strReturn = 'Text';
                            break;
                        case 'Numerical':
                            strReturn = 'Numerical';
                            break;
                        default:
                            strReturn = 'None';


                    }

                    return strReturn;
                }
            },
            { "data": "Priority" },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {
                    var strReturn = ""; 
                    strReturn = '<a title="Edit"  data-toggle="tooltip"  onclick="bindQuestion(' + row.Id + ')"  ><img src="../../../assets/images/icons/help/edit-icon.svg" class="w-15" alt="Edit"> </a> ';


                    return strReturn;
                }
            },
            {
                "orderable": false,
                data: null, render: function (data, type, row) {
                    var strReturn = "";
                    strReturn = '<div title="Delete" data-toggle="tooltip" class="radioremove text-center checkboxRemove align-self-center"><img src="../../../assets/images/icons/help/svg/delete-icon.svg" alt="Delete" onclick="handleQuesDelete(' + row.Id + ')"></div>';


                    return strReturn;
                }
            }


        ]
    });

}

function handleQuesDelete(id) {
    const indexToDelete = quesArray.findIndex(input => input.Id == id);

    if (indexToDelete !== -1) {
        quesArray.splice(indexToDelete, 1);
        BindQuestionOption();
    }

    
}


    function RefreshTaskTransaction() {

        var obj = {
            Id: $('#hdnTaskMasterId').val(),
            Type: 4
        }

        var TaskModel = {
            TaskMasterModel: obj,
            QuestionModel: null

        }

        CommonAjaxMethodTMS(baseURL + 'ManageTask/SaveTaskMaster', TaskModel, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                RedirectTaskMasterRequest();
                ClearFormControl();
            }
            else {
                showMessage(response.ErrorMessage, "error", 5000);
            }

        });
    }

function EmptySOptions() {
    $("#spSingle").hide();
}

function EmptyMOptions() {
    $("#spMulti").hide();
}
function manageLeverage(ctrl) {
    var data = ctrl.value;

    if (data != 0) {
        $('#sptxtDay').hide();
        $('#spnumHours').hide();
        $('#spnumMinute').hide();
        return;

    }
}
function SaveSubCategory() {



    if (quesArray.length > 0) {
        $("#question").removeClass("Mandatory");
        $("#questionoption").removeClass("Mandatory");
    }

    var visible = handleVisibility();
    if (visible == false) {
        $("#spLeadError").show();
        return;
    }
    else {
        $("#spLeadError").hide();
    }

    if ($('#bitCheckList').val() === "true" && quesArray.length == 0) {
        $("#confirmmsg1").modal('show');
        return;
    }

    if (checkValidationOnSubmit('Mandatory') == true ) {


        if ($("#auditrequired").val() !== "2") {
            $("#dldAuditController").val('');
        }

        if ($('#bitCheckList').val() === "true") {
            $('#remarksRequired').val(''),
                $('#remark').val('')
            $('#hdnUploadActualFileName').val('');
            $('#hdnUploadFileUrl').val('');
            $('#hdnUploadNewFileName').val('');
        }
        //if ($('#resultupload').val() === "false") {
        //   
        //}

      
        if ($("#LeadDay").val() == "") {
            $("#LeadDay").val(0)
        }

        if ($("#LeadHour").val() == "") {
            $("#LeadHour").val(0)
        }

        if ($("#LeadMin").val() == "") {
            $("#LeadMin").val(0)
        }


        //var questionTest = {

        //}
        var obj = {
            Id: $('#hdnTaskMasterId').val(),
            TaskDate: ChangeDateFormat($('#txtTaskDate').val()),
            TaskName: $('#txtTaskname').val(),
            Frequency: $('#ddlFrequency').val(),
            StartDate: ChangeDateFormat($('#dtStartDate').val()),
            EndDate: ChangeDateFormat($('#dtEndDate').val()),
            TaskTime: $('#dtTaskTime').val(),
            ExpiryDay: $('#numExpiryDay').val().toString(),
            isLeverage: $('#dldLeverageApplicable').val(),
            Department: $('#dldDepartment').val(),
            LeverageD: $('#txtDay').val(),
            LeverageH: $('#numHours').val(),
            LeverageM: $('#numMinute').val(),
            Doer: $('#dldDoer').val(),
            SecendoryDoer: $('#dldSecDoer').val(),
            ProcessController: $('#dldContoller').val(),
            Branch: $("#dldBranch").val(),
            AuditRequired: $('#auditrequired').val(),
            AuditController: $('#dldAuditController').val(),
            EscalateEmail: $('#EscalateTo').val().join(),
            EscalationTime: $('#numEscalationTime').val(),
            ReminderTime: $('#numReminderTime').val(),
            isChecklist: $('#bitCheckList').val(),
            isImageRequired: $('#resultupload').val(),
            isRemarkRequired: $('#remarksRequired').val(),
            Remark: $('#remark').val(),
            ActualFilename: $('#hdnUploadActualFileName').val(),
            NewFilename: $('#hdnUploadNewFileName').val(),
            FileURL: $('#hdnUploadFileUrl').val(),
            LeadDay: $("#LeadDay").val(),
            LeadHour: $("#LeadHour").val(),
            LeadMin: $("#LeadMin").val(),
            Weightage: $("#numWeightage").val(),
            Carry: $("#carry").prop("checked")
        }

        if ($('#bitCheckList').val() == "true") {
            var TaskModel = {
                TaskMasterModel: obj,
                QuestionModel: quesArray

            }
        }
        else {
            var TaskModel = {
                TaskMasterModel: obj,
                QuestionModel: null

            }
        }


        CommonAjaxMethodTMS(baseURL + 'ManageTask/SaveTaskMaster', TaskModel, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                sessionStorage.setItem('successShown', 'true');
                sessionStorage.setItem('message', '<span class="checkmark">✅</span> Task Saved Successfully')
                RedirectTaskMasterRequest();
                ClearFormControl();
            }
            else {
                FailToaster(response.ErrorMessage);
            }

        });

    }
}

function RedirectTaskMasterRequest() {

    var url = "/ManageTask/TaskMaster?auth=" + AuthToken;
    window.location.href = url;

}

//let questionOptionArray = [];
//let questionIndex = 0;
//function AddQuestionOption() {
//    var qObj = {
//        Qid: questionIndex,
//        Text: $('#txtQTest').val(),

//    }
//    questionOptionArray.push(qObj);
//}


function ClearFormControl() {


    $('#hdnTaskMasterId').val('');
    $('#txtTaskDate').val('');
    $('#txtTaskname').val('');
    $('#ddlFrequency').val('0').trigger('change');
    $('#dtStartDate').val('');
    $('#dtEndDate').val('');
    $('#dtTaskTime').val('');
    $('#numExpiryDay').val('');
    $('#dldLeverageApplicable').val('0').trigger('change');
    $('#txtDay').val('');
    $('#numHours').val('');
    $('#numMinute').val('');
    $('#dldDepartment').val('0').trigger('change');
    $('#dldDoer').val('Select').trigger('change');
    $('#dldSecDoer').val('0').trigger('change');
    $('#dldContoller').val('0').trigger('change');
    $('#auditrequired').val('');
    $('#dldAuditController').val('0').trigger('change');
    $('#EscalateTo').val('')
    $('#numEscalationTime').val('');
    $("#dldBranch").val('Select').trigger('change');
    $('#numReminderTime').val('');
    $('#resultupload').val('0').trigger('change');
    $('#remarksRequired').val('0').trigger('change');
    $('#remark').val('');

    //$('#txtthematic').val('');
    //$('#select2-ddlThematic-container').text('Select');

}

function GetTaskId() {
    CommonAjaxMethodTMS(baseURL + 'ManageTask/GetTaskId', null, 'GET', function (response) {

        var data = response.data.data.Table;

        $('#txtTaskId').val(data[0].TaskId);
        $('#txtTaskDate').val(ChangeDateFormatToddMMYYY(data[0].TaskDate));
    
        

    });

}

var carry = true;

var WeekDate = "";


function DuplicateTaskMaster(id) {

    CommonAjaxMethodTMS(baseURL + 'ManageTask/GetTaskMasterById', { id: id }, 'GET', function (response) {
        console.log(response);

        var data = response.data.data.Table;


        $('#hdnTaskMasterId').val(0);
        $('#txtTaskname').val(data[0].TaskName);
        $("#LeadDay").val(data[0].LeadDay),
            $("#LeadHour").val(data[0].LeadHour),
            $("#LeadMin").val(data[0].LeadMin),          
        $('#dtTaskTime').val(data[0].TaskTime);
        $('#numExpiryDay').val(parseInt(data[0].ExpiryDay));
        if (data[0].isLeverage == false) {
            $('#dldLeverageApplicable').val('false').trigger('change');
        }
        else {
            $('#dldLeverageApplicable').val('true').trigger('change');
        }

        $('#dldDepartment').val(data[0].Department).trigger('change');
        $('#txtDay').val(data[0].LeverageD);
        $('#numHours').val(parseInt(data[0].LeverageH));
        $('#numMinute').val(parseInt(data[0].LeverageM));
        $('#numLeadTime').val(parseInt(data[0].LeadTime));
        $('#dldDoer').val(data[0].Doer).trigger('change');
        if (data[0].Branch == null) {
            $('#dldBranch').val('Select').trigger('change');
        }
        else {
            $('#dldBranch').val(data[0].Branch).trigger('change');
        }
        if (data[0].SecendoryDoer > 0) {
            $('#dldSecDoer').val(data[0].SecendoryDoer).trigger('change');
        }
        else {
            $('#dldSecDoer').val('Select').trigger('change');
        }
        $('#dldContoller').val(data[0].ProcessController).trigger('change');
        $('#auditrequired').val(data[0].AuditRequired).trigger('change');
        $('#dldAuditController').val(data[0].AuditController).trigger('change');
        if (data[0].EscalateEmail != null) {
            $('#EscalateTo').val(data[0].EscalateEmail.split(','));
        }            // Assuming EscalateEmail is a comma-separated string
        $('#numEscalationTime').val(parseInt(data[0].EscalationTime));
        $('#numReminderTime').val(parseInt(data[0].ReminderTime));

        if (data[0].isChecklist == false) {
            $('#bitCheckList').val('false').trigger('change');
        }
        else {
            $('#bitCheckList').val('true').trigger('change');
        }


        $('#resultupload').val(data[0].isImageRequired).trigger('change');
        $('#hdnUploadActualFileName').val(data[0].ActualFilename);
        $('#hdnUploadNewFileName').val(data[0].NewFileName);
        $('#hdnUploadFileUrl').val(data[0].FileURL);

        if (data[0].FileURL != null || data[0].FileURL != "") {
            $("#resultImage").removeClass('Mandatory');
        }

        $("#myImage").attr("src", data[0].FileURL);


        if (data[0].isRemarkRequired == false) {
            $('#remarksRequired').val('false').trigger('change');
        }
        else {
            $('#remarksRequired').val('true').trigger('change');
        }

        $('#remark').val(data[0].Remark);
        $("#numWeightage").val(data[0].Weightage);

        if (data[0].Carry == true) {
            $("#carry").prop("checked", true);
            carry = true;
        }
        else {
            carry = false;
        }




        var QuestionTable = response.data.data.Table1; // QuestionSingleMultiSelectModelList
        var Option = response.data.data.Table2;

        if (QuestionTable.length > 0) {

            qid = QuestionTable[QuestionTable.length - 1].ID;

            for (var i = 0; i < QuestionTable.length; i++) {
                var optiontext = []
                for (var j = 0; j < Option.length; j++) {
                    if (Option[j].Question_Id == QuestionTable[i].ID) {
                        var objOption = {
                            OptionText: Option[j].OptionText,
                            Question_Id: Option[j].Question_Id
                        };
                        optiontext.push(objOption);
                    }
                }
                if (QuestionTable[i].Type != 'singleselect' && QuestionTable[i].Type != 'multiplechoice') {
                    var obj = {
                        Id: QuestionTable[i].ID,
                        Question: QuestionTable[i].Question,
                        Type: QuestionTable[i].Type,
                        IsMandatory: QuestionTable[i].isMandatory,
                        ActualFilename: QuestionTable[i].ActualFilename,
                        NewFilename: QuestionTable[i].NewFilename,
                        FileURL: QuestionTable[i].FileURL,
                        IsUploadImage: QuestionTable[i].isUploadImage,
                        Priority: QuestionTable[i].Priority ? QuestionTable[i].Priority : (i + 1) * 5

                    }
                    quesArray.push(obj);
                }
                else {
                    var obj1 = {
                        Id: QuestionTable[i].ID,
                        Question: QuestionTable[i].Question,
                        Type: QuestionTable[i].Type,
                        IsMandatory: QuestionTable[i].isMandatory,
                        QuestionSingleMultiSelectModelList: optiontext,
                        ActualFilename: QuestionTable[i].ActualFilename,
                        NewFilename: QuestionTable[i].NewFilename,
                        FileURL: QuestionTable[i].FileURL,
                        IsUploadImage: QuestionTable[i].isUploadImage,
                        Priority: QuestionTable[i].Priority ? QuestionTable[i].Priority : (i + 1) * 5

                    }
                    quesArray.push(obj1);
                }

            }

            BindQuestionOption();

        }

    });

    console.log(quesArray);


}
function EditTaskMaster(id) {

    CommonAjaxMethodTMS(baseURL + 'ManageTask/GetTaskMasterById', { id: id }, 'GET', function (response) {
        console.log(response);

        var data = response.data.data.Table;

        if (response.data.data.Table3.length > 0) {
            WeekDate = getdatewithoutJson(response.data.data.Table3[0].ScheduleDate);
        }
        else {
            WeekDate = "None";
        }

        $('#txtTaskId').val(data[0].TaskId);
        $('#hdnTaskMasterId').val(data[0].ID);
        $('#txtTaskDate').val(ChangeDateFormatToddMMYYY(data[0].TaskDate));
        $('#txtTaskname').val(data[0].TaskName);
        $('#ddlFrequency').val(data[0].Frequency).trigger('change');

        $("#ddlFrequency").prop('disabled', true);

        $("#LeadDay").val(data[0].LeadDay),
            $("#LeadHour").val(data[0].LeadHour),
            $("#LeadMin").val(data[0].LeadMin),

            $('#dtStartDate').val(ChangeDateFormatToddMMYYY(data[0].StartDate));
        $('#dtEndDate').val(ChangeDateFormatToddMMYYY(data[0].EndDate));
        $('#dtTaskTime').val(data[0].TaskTime);
        $('#numExpiryDay').val(parseInt(data[0].ExpiryDay));
        if (data[0].isLeverage == false) {
            $('#dldLeverageApplicable').val('false').trigger('change');
        }
        else {
            $('#dldLeverageApplicable').val('true').trigger('change');
        }

        $('#dldDepartment').val(data[0].Department).trigger('change');
        $('#txtDay').val(data[0].LeverageD);
        $('#numHours').val(parseInt(data[0].LeverageH));
        $('#numMinute').val(parseInt(data[0].LeverageM));
        $('#numLeadTime').val(parseInt(data[0].LeadTime));
        $('#dldDoer').val(data[0].Doer).trigger('change');
        if (data[0].Branch == null) {
            $('#dldBranch').val('Select').trigger('change');
        }
        else {
            $('#dldBranch').val(data[0].Branch).trigger('change');
        }
        if (data[0].SecendoryDoer > 0) {
            $('#dldSecDoer').val(data[0].SecendoryDoer).trigger('change');
        }
        else {
            $('#dldSecDoer').val('Select').trigger('change');
        }
        $('#dldContoller').val(data[0].ProcessController).trigger('change');
        $('#auditrequired').val(data[0].AuditRequired).trigger('change');
        $('#dldAuditController').val(data[0].AuditController).trigger('change');
        if (data[0].EscalateEmail != null) {
            $('#EscalateTo').val(data[0].EscalateEmail.split(','));
        }   
        $('#numEscalationTime').val(parseInt(data[0].EscalationTime));
        $('#numReminderTime').val(parseInt(data[0].ReminderTime));

        if (data[0].isChecklist == false) {
            $('#bitCheckList').val('false').trigger('change');
        }
        else {
            $('#bitCheckList').val('true').trigger('change');
        }

       
            $('#resultupload').val(data[0].isImageRequired).trigger('change');
            $('#hdnUploadActualFileName').val(data[0].ActualFilename);
            $('#hdnUploadNewFileName').val(data[0].NewFileName);
            $('#hdnUploadFileUrl').val(data[0].FileURL);

        if (data[0].FileURL != null || data[0].FileURL != "") {
            $("#resultImage").removeClass('Mandatory');
        }

            $("#myImage").attr("src", data[0].FileURL);

        if (data[0].isRemarkRequired == false) {
            $('#remarksRequired').val('false').trigger('change');
        }
        else {
            $('#remarksRequired').val('true').trigger('change');
        }

        $('#remark').val(data[0].Remark);
        $("#numWeightage").val(data[0].Weightage);

        if (data[0].Carry == true) {
            $("#carry").prop("checked", true);
            carry = true;
        }
        else {
            carry = false;
        }




        var QuestionTable = response.data.data.Table1; // QuestionSingleMultiSelectModelList
        var Option = response.data.data.Table2;

        if (QuestionTable.length > 0) {

            qid = QuestionTable[QuestionTable.length - 1].ID;

            for (var i = 0; i < QuestionTable.length; i++) {
                var optiontext = []
                for (var j = 0; j < Option.length; j++) {
                    if (Option[j].Question_Id == QuestionTable[i].ID) {
                        var objOption = {
                            OptionText: Option[j].OptionText,
                            Question_Id: Option[j].Question_Id
                        };
                        optiontext.push(objOption);
                    }
                }
                if (QuestionTable[i].Type != 'singleselect' && QuestionTable[i].Type != 'multiplechoice') {
                    var obj = {
                        Id: QuestionTable[i].ID,
                        Question: QuestionTable[i].Question,
                        Type: QuestionTable[i].Type,
                        IsMandatory: QuestionTable[i].isMandatory,
                        ActualFilename: QuestionTable[i].ActualFilename,
                        NewFilename: QuestionTable[i].NewFilename,
                        FileURL: QuestionTable[i].FileURL,
                        IsUploadImage: QuestionTable[i].isUploadImage,
                        Priority: QuestionTable[i].Priority ? QuestionTable[i].Priority : (i+1) * 5

                    }
                    quesArray.push(obj);
                }
                else {
                    var obj1 = {
                        Id: QuestionTable[i].ID,
                        Question: QuestionTable[i].Question,
                        Type: QuestionTable[i].Type,
                        IsMandatory: QuestionTable[i].isMandatory,
                        QuestionSingleMultiSelectModelList: optiontext,
                        ActualFilename: QuestionTable[i].ActualFilename,
                        NewFilename: QuestionTable[i].NewFilename,
                        FileURL: QuestionTable[i].FileURL,
                        IsUploadImage: QuestionTable[i].isUploadImage,
                        Priority: QuestionTable[i].Priority ? QuestionTable[i].Priority : (i + 1) * 5

                    }
                    quesArray.push(obj1);
                }

            }

            BindQuestionOption();

        }

    });

    console.log(quesArray);


}


function Activate(id) {

    var x = confirm("Do you want to change the status of this record?");

    if (x) {
        var obj = {
            Id: id,
            SubCategory: '',
            TableType: '',
            Code: '',
            Thematic_id: id,
            IsActive: 1,
            IPAdress: $('#hdnIP').val()
        }
        CommonAjaxMethodTMS(baseURL + 'DigitalLibrary/SaveTag', obj, 'POST', function (response) {
            BindSubcategory();
            ClearFormControl();
        });
    }
}
function SubCateGredOut() {
    $('#txtthematic').hide();
    ClearFormControl();
    $('.selection').show();

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
                    $("#myImage").attr("src", result.FileModel.FileUrl);
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

function handleVisibility() {
    var leadHour;
    var leadDay;
    var leadMin;
    var totalSum;
    if ($("#LeadDay").val() == "") {
        $("#LeadDay").val(0);
    }
    if ($("#LeadHour").val() == "") {
        $("#LeadHour").val(0);
    }
    if ($("#LeadMin").val() == "") {
        $("#LeadMin").val(0);
    }
    if ($("#ddlFrequency").val() == 3) {
        leadHour = parseInt($("#LeadHour").val(), 10);
        leadMin = parseInt($("#LeadMin").val(), 10);

        totalSum = leadHour * 60 + leadMin;

        var totalTime = 24 * 60;

        if (totalSum > totalTime) {
            return false;
        }

        else {
            return true;
        }


    }
    else if ($("#ddlFrequency").val() == 4) {

        leadDay = parseInt($("#LeadDay").val(), 10);
        leadHour = parseInt($("#LeadHour").val(), 10);
        leadMin = parseInt($("#LeadMin").val(), 10);

        totalSum = leadDay * 24 * 60 + leadHour * 60 + leadMin;

        var totalTime = 7 * 24 * 60;

        if (totalSum > totalTime) {
            return false;
        }

        else {
            return true;
        }

    }
    else if ($("#ddlFrequency").val() == 5) {

        leadDay = parseInt($("#LeadDay").val(), 10);
        leadHour = parseInt($("#LeadHour").val(), 10);
        leadMin = parseInt($("#LeadMin").val(), 10);

        totalSum = leadDay * 24 * 60 + leadHour * 60 + leadMin;

        var totalTime = 15 * 24 * 60;

        if (totalSum > totalTime) {
            return false;
        }

        else {
            return true;
        }


    }
    else if ($("#ddlFrequency").val() == 6) {



        leadDay = parseInt($("#LeadDay").val(), 10);
        leadHour = parseInt($("#LeadHour").val(), 10);
        leadMin = parseInt($("#LeadMin").val(), 10);

        totalSum = leadDay * 24 * 60 + leadHour * 60 + leadMin;

        var totalTime = 31 * 24 * 60;

        if (totalSum > totalTime) {
            return false;
        }

        else {
            return true;
        }

    }
    else if ($("#ddlFrequency").val() == 7) {

        leadDay = parseInt($("#LeadDay").val(), 10);
        leadHour = parseInt($("#LeadHour").val(), 10);
        leadMin = parseInt($("#LeadMin").val(), 10);

        totalSum = leadDay * 24 * 60 + leadHour * 60 + leadMin;

        var totalTime = 90 * 24 * 60;

        if (totalSum > totalTime) {
            return false;
        }

        else {
            return true;
        }

    }
    else {
        leadDay = parseInt($("#LeadDay").val(), 10);
        leadHour = parseInt($("#LeadHour").val(), 10);
        leadMin = parseInt($("#LeadMin").val(), 10);

        totalSum = leadDay * 24 * 60 + leadHour * 60 + leadMin;

        var totalTime = 365 * 24 * 60;

        if (totalSum > totalTime) {
            return false;
        }

        else {
            return true;
        }
    }
}


function VisibilityHandle(ctrl) {
    HideErrorMessage(ctrl);

    if ($("#ddlFrequency").val() == 3) {
        $("#visDay").hide();
        $("#LeadDay").val('');
    }
    else {
        $("#visDay").show();
    }

    if ($("#ddlFrequency").val() == 4) {
        $("#forward").show()
    }
    else {
        $("#forward").hide()
        $("#carry").prop('checked', false);
    }
}

function handleCarryWarning(ctrl) {


    if (ctrl.id == 'yes') {
        SaveSubCategory();
    }
    else {
        $("#carry").prop('checked', carry);
        return;
    }
}

var checked = "";
function handleSaveWithCarry() {

    if ($("#hdnTaskMasterId").val() > 0) {
        if (carry != $("#carry").prop('checked')) {

            if (carry == true) {
                checked = "Checked";
            }
            else {
                checked = "Unchecked";
            }

            $("#carryCheck").html(checked);
            if (WeekDate == "None") {
                WeekDate = "In this case not applicable";
            }
            else {
                WeekDate = WeekDate;
            }
            $("#specDate").html(WeekDate);
            $("#saveTask").attr("data-toggle", "modal");
        }
        else {
            SaveSubCategory();
        }
    }
    else {
        SaveSubCategory();
    }
}

function UploadocumentQuesReport(id) {



    var fileUpload = $("#" + id).get(0);

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

                    $('#hdnUploadQuesActualFileName').val(result.FileModel.ActualFileName);
                    $('#hdnUploadQuesNewFileName').val(result.FileModel.NewFileName);
                    $('#hdnUploadQuesFileUrl').val(result.FileModel.FileUrl);
                    $("#myQuesImage").attr("src", result.FileModel.FileUrl);
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
        $('#hdnUploadQuesActualFileName').val('');
        $('#hdnUploadQuesNewFileName').val('');
        $('#hdnUploadQuesFileUrl').val('');
        $("#myQuesImage").attr("src", '');
        FailToaster("Please select file to attach!");

        return "error";

    }

    return "";



}


    const sortArrayByColumn = (array, column) => {
        return array.sort((a, b) => {
            if (column === 'Priority') {
                // Convert string Prioritys to numbers for proper numeric comparison
                return parseInt(b.Priority, 10) - parseInt(a.Priority, 10);
            } else {
                // For string comparisons
                if (a[column] > b[column]) {
                    return -1;
                }
                if (a[column] < b[column]) {
                    return 1;
                }
                return 0;
            }
        });
};

// Function to handle file actions based on type
function handleFile() {
    // Determine file extension using lastIndexOf('.')
    const imageElement = document.getElementById('myQuesImage');

    // Get the value of the 'src' attribute
    const filePath = imageElement.src;
    const lastDotIndex = filePath.lastIndexOf('.');
    const fileExtension = lastDotIndex !== -1 ? filePath.substring(lastDotIndex + 1).toLowerCase() : '';

    // List of image extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    // Check if the file is an image
    if (imageExtensions.includes(fileExtension) || fileExtension == '' || fileExtension == null || fileExtension.length > 4) {
        // Show image in modal
        showModalWithImage(filePath);
    } else {
        // Download the file
        downloadFile(filePath);
    }
}

// Function to display image in the modal
function showModalWithImage(imagePath) {
    const modalImage = document.getElementById('myQuesImage');
    modalImage.src = imagePath;
    $('#viewQuesimage').modal('show'); // Assuming you're using jQuery and Bootstrap
}

// Function to download the file
function downloadFile(filePath) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = $('#hdnUploadQuesActualFileName').val(); // Let the browser decide the file name or specify one
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function handleTaskFile() {
    // Determine file extension using lastIndexOf('.')
    const imageElement = document.getElementById('myImage');

    // Get the value of the 'src' attribute
    const filePath = imageElement.src;
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
        downloadTaskFile(filePath);
    }
}

// Function to display image in the modal
function showTaskModalWithImage(imagePath) {
    const modalImage = document.getElementById('myImage');
    modalImage.src = imagePath;
    $('#viewimage').modal('show'); // Assuming you're using jQuery and Bootstrap // changs in comment
}

// Function to download the file

function downloadTaskFile(filePath) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = $('#hdnUploadActualFileName').val(); // Let the browser decide the file name or specify one
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}