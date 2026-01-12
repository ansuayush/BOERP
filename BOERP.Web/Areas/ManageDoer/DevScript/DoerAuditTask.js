$(document).ready(function () {

    EditTaskMaster(Edit_ID);

    $(function () {
        $('.datepickersecond').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "dd-mm-yy",
            yearRange: "-20:+10"
        });

    });
    var day = new Date();

    $('#toDate').on('change', function () {
        validateDates();
    });

});

var quesArray = [];

var day = new Date();

var fromDate = ChangeDateFormatToddMMYYY(day);

function validateDates() {

    var endDateStr = $('#toDate').val();

    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();
    var day = currentDate.getDate();


    var currentDateWithoutTime = new Date(year, month, day);


    var endDateParts = endDateStr.split('-');

    var endDate = new Date(parseInt(endDateParts[2], 10), parseInt(endDateParts[1], 10) - 1, parseInt(endDateParts[0], 10));



    if (endDate < currentDateWithoutTime) {
        document.getElementById("sptoDate").innerHTML = "Due date should be grater or equal to today's date!";
        $("#sptoDate").show();
        $('#toDate').val('');
        setTimeout(function () {
            $("#sptoDate").hide();
            document.getElementById("sptoDate").innerHTML = 'Hey, You missed this field!!';
        }, 4000);
    }


}

function EditTaskMaster(id) {

    CommonAjaxMethodTMS(baseURL + 'ManageDoer/GetDoerTaskById', { id: id }, 'GET', function (response) {
        console.log(response);

        var data = response.data.data.Table;
        $('#TaskID').val(data[0].TaskId);
        $('#hdnTask_transID').val(data[0].Task_transID);
        $("#hdnStatus").val(data[0].Status)
        $('#TaskDate').val(ChangeDateFormatToddMMYYY(data[0].TaskDate));
        $('#TaskName').html(data[0].TaskName);
        $('#Frequency').html(data[0].Frequency)
        $('#StartDate').val(ChangeDateFormatToddMMYYY(data[0].StartDate));
        $('#EndDate').val(ChangeDateFormatToddMMYYY(data[0].EndDate));
        $('#TaskTime').val(data[0].ScheduleTime);
        $("#Weightage").val(data[0].Weightage);

        var expDate = ChangeDateFormatToddMMYYY(data[0].ExpiryDate);
        $('#ExpDate').val(expDate);

        if (data[0].isLeverage == false) {
            $('#isLeverage').html('No')
            $('#LeverageDetails').hide();
        }
        else {
            $('#isLeverage').html('Yes')
            $("#Days").html(data[0].LeverageD)
            $("#Hours").html(data[0].LeverageH)
            $("#Min").html(data[0].LeverageM)
        }
        $('#Department').html(data[0].Department)
        $("#Branch").html(data[0].BranchName)
        $('#Doer').html(data[0].Doer)
        if (data[0].SecondaryDoer == null || data[0].SecondaryDoer == 0) {
            $('#SecDoer').html('Select')
        }
        else {
            $('#SecDoer').html(data[0].SecondaryDoer)
        }
        if (data[0].ProcessController == null || data[0].ProcessController == 0) {
            $('#Pc').html('Select')
        }
        else {
            $('#Pc').html(data[0].ProcessController)
        }

        if (data[0].AuditRequired == 1) {
            $("#isAudit").html('By PC')
        }
        else if (data[0].AuditRequired == 2) {
            $("#isAudit").html('By Audit Controller')
            $("#Auditor").show();
            $("#AuditController").html(data[0].AuditController)
        }
        else {
            $("#isAudit").html('No')
        }

        $('#email').html(data[0].EscalateEmail);
        $('#EscalationTime').val(data[0].EscalationTime);
        $('#ReminderTime').val(data[0].ReminderTime);
        if (data[0].isChecklist == true) {
            $('#isCheckList').html('Yes')
            $("#yesimageupload").hide();
            $("#yesimageshow").hide();
            $("#yesremark").hide();
            $("#yesremarkshow").hide();
            $("#userYesUpload").hide();
            $("#userRemarkUpload").hide();
            $("#yesUserimageshow").hide();
        }
        else {
            $('#isCheckList').html('No')
            if (data[0].isImageRequired == 3) {
                $("#isImageUpload").html('Only Upload Reference Image');
                $("#myImage").attr("src", data[0].FileURL);
                $("#userYesUpload").hide();
                $("#yesUserimageshow").hide();
                isActual = data[0].ActualFilename;
            }
            else if (data[0].isImageRequired == 2 || data[0].isImageRequired == 0) {
                $("#isImageUpload").html('No');
                $("#userYesUpload").hide();
                $("#myImage").attr("src", data[0].FileURL);
                isActual = data[0].ActualFilename;
                $("#myImage").hide();
                $("#yesUserimageshow").hide();
                $("#yesimageshow").hide();

            }
            else {
                $("#isImageUpload").html('Yes');
                $("#myImage").attr("src", data[0].FileURL);
                isActual = data[0].ActualFilename;
                $("#lblImage").html('Image Upload (By Doer)<sup class="red-clr">*</sup>')
                $("#userImage").addClass('Mandatory');
            }
            if (data[0].isRemarkRequired == true) {
                $("#userRemarks").addClass('Mandatory');
                $("#isRemark").html('Yes');
                $("#lblRemark").html('Remarks Required<sup class="red-clr">*</sup>')

                if (data[0].Remarks != null) {
                    $("#remark").html(data[0].Remarks);
                }
                else {
                    $("#remark").html('');
                }
            }
            else {
                $("#isRemark").html('No');
                if (data[0].Remarks != null) {
                    $("#remark").html(data[0].Remarks);
                }
                else {
                    $("#remark").html('');
                }
            }

        }
        if ($("#hdnStatus").val() == 1) {
            var obj = convertDelayIndays(data[0].CombinedDateTime);
            $("#DDay").html(obj.days);
            $("#DHour").html(obj.hours);
            $("#DMin").html(obj.minutes);
        }
        else {

            $("#DDay").html(data[0].DelayD);
            $("#DHour").html(data[0].DelayH);
            $("#DMin").html(data[0].DelayM);
        }

        if ($("#hdnStatus").val() == 2) {
            $("#btnSave").css("display", "none");

            if (data[0].isChecklist == false) {
                $("#userYesUpload").hide();
                $("#userRemarks").val(data[0].UserRemarks);
                $("#myUserImage").attr("src", data[0].UserRefFileURL);
                isActualUser = data[0].UserRefActualFilename;
                $("#userRemarks").prop('disabled', true);
                $("#userRemarks").removeClass('Mandatory');
                $("#userImage").removeClass('Mandatory');



            }
        }

        $("#dtTaskTime").val(data[0].TaskTime);



        var QuestionTable = response.data.data.Table1; // QuestionSingleMultiSelectModelList
        var Option = response.data.data.Table2;

        if (QuestionTable.length > 0) {

            for (var i = 0; i < QuestionTable.length; i++) {
                var optiontext = []
                for (var j = 0; j < Option.length; j++) {
                    if (Option[j].Question_Id == QuestionTable[i].ID) {
                        if ($("#hdnStatus").val() == 1) {
                            var objOption = {
                                OptionText: Option[j].OptionText,
                                ID: Option[j].ID,
                            };
                            optiontext.push(objOption);
                        }
                        else {
                            var objOption = {
                                OptionText: Option[j].OptionText,
                                ID: Option[j].ID,
                                IsSelect: Option[j].IsSelect,
                            };
                            optiontext.push(objOption);
                        }
                    }
                }
                if (QuestionTable[i].Type != 'singleselect' && QuestionTable[i].Type != 'multiplechoice') {
                    if ($("#hdnStatus").val() == 1) {
                        var obj = {
                            Id: QuestionTable[i].ID,
                            Question: QuestionTable[i].Question,
                            Priority: QuestionTable[i].Priority,
                            Type: QuestionTable[i].Type,
                            IsMandatory: QuestionTable[i].isMandatory,
                            QFileURL: QuestionTable[i].FileURL,
                            QActualFileName: QuestionTable[i].ActualFilename,
                            IsUploadImage: QuestionTable[i].isUploadImage,
                        }
                        quesArray.push(obj);
                    }
                    else {
                        var obj = {
                            Id: QuestionTable[i].ID,
                            Question: QuestionTable[i].Question,
                            Priority: QuestionTable[i].Priority,
                            Type: QuestionTable[i].Type,
                            IsMandatory: QuestionTable[i].isMandatory,
                            QFileURL: QuestionTable[i].FileURL,
                            QActualFileName: QuestionTable[i].ActualFilename,
                            UserNumerical: QuestionTable[i].UserNumerical,
                            UserText: QuestionTable[i].UserText,
                            UserDate: QuestionTable[i].UserDate,
                            UserActualFilename: QuestionTable[i].UserActualFileName,
                            UserNewFilename: QuestionTable[i].UserNewFilename,
                            UserFileURL: QuestionTable[i].UserFileURL,
                            isAudit: QuestionTable[i].isAudit
                        }
                        quesArray.push(obj);
                    }
                }
                else {
                    if ($("#hdnStatus").val() == 1) {
                        var obj1 = {
                            Id: QuestionTable[i].ID,
                            Question: QuestionTable[i].Question,
                            Priority: QuestionTable[i].Priority,
                            Type: QuestionTable[i].Type,
                            IsMandatory: QuestionTable[i].isMandatory,
                            QuestionSingleMultiSelectModelList: optiontext,
                            QFileURL: QuestionTable[i].FileURL,
                            QActualFileName: QuestionTable[i].ActualFilename,
                            IsUploadImage: QuestionTable[i].isUploadImage

                        }
                        quesArray.push(obj1);
                    }
                    else {
                        var obj1 = {
                            Id: QuestionTable[i].ID,
                            Question: QuestionTable[i].Question,
                            Priority: QuestionTable[i].Priority,
                            Type: QuestionTable[i].Type,
                            IsMandatory: QuestionTable[i].isMandatory,
                            QuestionSingleMultiSelectModelList: optiontext,
                            QFileURL: QuestionTable[i].FileURL,
                            QActualFileName: QuestionTable[i].ActualFilename,
                            UserActualFilename: QuestionTable[i].UserActualFileName,
                            UserNewFilename: QuestionTable[i].UserNewFilename,
                            UserFileURL: QuestionTable[i].UserFileURL,
                            isAudit: QuestionTable[i].isAudit

                        }
                        quesArray.push(obj1);
                    }
                }

            }


        }

    });

    console.log(quesArray);

    BindQuestion();


}


var count = 1;
function BindQuestion() {
    for (let i = 0; i < quesArray.length; i++) {
        if (quesArray[i].Type == 'Numerical') {

            var num = '<input type="text" class="form-control" name="" placeholder="0" id="num' + quesArray[i].Id + '" value= "' + quesArray[i].UserNumerical + '" disabled > '
            if (quesArray[i].IsMandatory == true) {

                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';
            }
            else {

                var ques = '<h2 class="questiontittle">Question' + count + '</h2>';
            }

            var userImage = '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<label>User Reference Image</label>' +
                '<div class="text-p">' +
                '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                '</div>' +
                '</div>';

            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                '<div class="button-wrap qtnbtn">' +
                '<input class="hidden yes-radio radio-label" type="radio" name="question' + quesArray[i].Id + '" id="qtnyes' + quesArray[i].Id + '" onclick="handleError(this.id)" >' +
                '<label class="yesbtn button-label" for="qtnyes' + quesArray[i].Id + '"  title="" data-original-title="Pass" data-placement="right"><i class="fas fa-check"></i></label>' +
                '<input class="hidden no-radio  radio-label" type="radio" name="question' + quesArray[i].Id + '" id="qtnno' + quesArray[i].Id + '" onclick="handleError(this.id)" >' +
                '<label class="nobtn button-label" for="qtnno' + quesArray[i].Id + '"  title="" data-original-title="Fail" data-placement="right"><i class="fas fa-times"></i></label>' +
                '</div>' +
                '<div class="d-flex questiondtal">' +
                ques +
                '</div>' +
                ' <span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Atleast One option must selected!!</span>' +
                '<h6 class="questiontittle">' + quesArray[i].Question + '</h6> ' +
                '<div class="row">' +
                '<div class="col-sm-4 align-self-center mt-4">' +
                ' <span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Atleast One option must selected!!</span>' +
                '<div class="form-group">' +
                '<label for="Lead Details" class="form-control-label"></label>' +
                num +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<label> Reference Image</label>' +
                '<div class="text-p">' +
                '<span id="ref,' + quesArray[i].Id + '" onclick="GetRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                '</div>' +
                '</div>' +
                '</div>' +
                userImage +
                '</div>' +
                '</div>';


            $("#BindQues").append(element);

            if (quesArray[i].isAudit == true) {
                $("#qtnyes" + quesArray[i].Id).prop('checked', true);
                $("#qtnyes" + quesArray[i].Id).prop('disabled', true);
                $("#qtnno" + quesArray[i].Id).prop('disabled', true);
            }
        }

        else if (quesArray[i].Type == 'text') {

            var text = '<textarea placeholder="Enter" class="font-contorl question-form-contorl h-100" id="num' + quesArray[i].Id + '" disabled >' + (quesArray[i].UserText == null ? "Enter" : quesArray[i].UserText) + '</textarea>';
            if (quesArray[i].IsMandatory == true) {

                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';
            }
            else {

                var ques = '<h2 class="questiontittle">Question' + count + '</h2>';
            }

            var userImage = '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<label>User Reference Image</label>' +
                '<div class="text-p">' +
                '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                '</div>' +
                '</div>';


            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                '<div class="button-wrap qtnbtn">' +
                '<input class="hidden yes-radio radio-label" type="radio" name="question' + quesArray[i].Id + '" id="qtnyes' + quesArray[i].Id + '" onclick="handleError(this.id)">' +
                '<label class="yesbtn button-label" for="qtnyes' + quesArray[i].Id + '"  title="" data-original-title="Pass" data-placement="right"><i class="fas fa-check"></i></label>' +
                '<input class="hidden no-radio  radio-label" type="radio" name="question' + quesArray[i].Id + '" id="qtnno' + quesArray[i].Id + '" onclick="handleError(this.id)">' +
                '<label class="nobtn button-label" for="qtnno' + quesArray[i].Id + '"  title="" data-original-title="Fail" data-placement="right"><i class="fas fa-times"></i></label>' +
                '</div>' +
                '<div class="d-flex questiondtal">' +
                ques +
                '</div>' +
                ' <span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Atleast One option must selected!!</span>' +
                '<h6 class="questiontittle">' + quesArray[i].Question + '</h6> ' +
                '<div class="row">' +
                '<div class="col-sm-12">' +
                '<div class="qustionlist" style="display: block;">' +
                text +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<label> Reference Image</label>' +
                '<div class="text-p">' +
                '<span id="ref,' + quesArray[i].Id + '" onclick="GetRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                '</div>' +
                '</div>' +
                '</div>' +
                userImage +
                '</div>' +
                '</div>';



            $("#BindQues").append(element);

            if (quesArray[i].isAudit == true) {
                $("#qtnyes" + quesArray[i].Id).prop('checked', true);
                $("#qtnyes" + quesArray[i].Id).prop('disabled', true);
                $("#qtnno" + quesArray[i].Id).prop('disabled', true);
            }
        }

        else if (quesArray[i].Type == 'dateandtime') {

            var date = '<p class="text-p">' + (quesArray[i].UserDate ? getdatetime(quesArray[i].UserDate) : 'dd-mm-yyyy --:--') + '</p>'
            if (quesArray[i].IsMandatory == true) {

                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';
            }
            else {

                var ques = '<h2 class="questiontittle">Question' + count + '</h2>';
            }

            var userImage = '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<label>User Reference Image</label>' +
                '<div class="text-p">' +
                '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" ><img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                '</div>' +
                '</div>';



            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                '<div class="button-wrap qtnbtn">' +
                '<input class="hidden yes-radio radio-label" type="radio" name="question' + quesArray[i].Id + '" id="qtnyes' + quesArray[i].Id + '" onclick="handleError(this.id)">' +
                '<label class="yesbtn button-label" for="qtnyes' + quesArray[i].Id + '"  title="" data-original-title="Pass" data-placement="right"><i class="fas fa-check"></i></label>' +
                '<input class="hidden no-radio  radio-label" type="radio" name="question' + quesArray[i].Id + '" id="qtnno' + quesArray[i].Id + '" onclick="handleError(this.id)">' +
                '<label class="nobtn button-label" for="qtnno' + quesArray[i].Id + '"  title="" data-original-title="Fail" data-placement="right"><i class="fas fa-times"></i></label>' +
                '</div>' +
                '<div class="d-flex questiondtal">' +
                ques +
                '</div>' +
                ' <span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Atleast One option must selected!!</span>' +
                '<h6 class="questiontittle">' + quesArray[i].Question + '</h6> ' +
                '<div class="row">' +
                '<div class="col-lg-4 align-self-center mt-3">' +
                '<div class="form-group">' +
                '<label for="Lead Details" class="form-control-label"> </label>' +
                date +
                '</div>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<label> Reference Image</label>' +
                '<div class="text-p">' +
                '<span id="ref,' + quesArray[i].Id + '" onclick="GetRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                '</div>' +
                '</div>' +
                '</div>' +
                userImage +
                '</div>' +
                '</div>';



            $("#BindQues").append(element);

            if (quesArray[i].isAudit == true) {
                $("#qtnyes" + quesArray[i].Id).prop('checked', true);
                $("#qtnyes" + quesArray[i].Id).prop('disabled', true);
                $("#qtnno" + quesArray[i].Id).prop('disabled', true);
            }
        }

        else if (quesArray[i].Type == 'singleselect') {


            if (quesArray[i].IsMandatory == true) {

                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';
            }
            else {

                var ques = '<h2 class="questiontittle">Question' + count + '</h2>';
            }

            var option = '';

            var optionText = quesArray[i].QuestionSingleMultiSelectModelList;


            for (let j = 0; j < optionText.length; j++) {
                if (optionText[j].IsSelect == true) {
                    option = option +
                        '<li class="singleselect">' +
                        '<div class="radio rediodgn">' +
                        '<input name="option' + quesArray[i].Id + '" type="radio" class="radio" id="Option'  + optionText[j].ID + '"  checked >' +
                        '<label for="Option' + optionText[j].ID + '" class="radio-label">' + optionText[j].OptionText + '</label>' +
                        '</div>' +
                        '</li>';
                }
                else {
                    option = option +
                        '<li class="singleselect">' +
                        '<div class="radio rediodgn">' +
                        '<input name="option' + quesArray[i].Id + '" type="radio" class="radio" id="Option' + optionText[j].ID + '"  selected disabled >' +
                        '<label for="Option' + optionText[j].ID + '" class="radio-label">' + optionText[j].OptionText + '</label>' +
                        '</div>' +
                        '</li>';
                }
            }

            var userImage = '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<label>User Reference Image</label>' +
                '<div class="text-p">' +
                '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                '</div>' +
                '</div>';


            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                '<div class="button-wrap qtnbtn">' +
                '<input class="hidden yes-radio radio-label" type="radio" name="question' + quesArray[i].Id + '" id="qtnyes' + quesArray[i].Id + '" onclick="handleError(this.id)">' +
                '<label class="yesbtn button-label" for="qtnyes' + quesArray[i].Id + '"  title="" data-original-title="Pass" data-placement="right"><i class="fas fa-check"></i></label>' +
                '<input class="hidden no-radio  radio-label" type="radio" name="question' + quesArray[i].Id + '" id="qtnno' + quesArray[i].Id + '" onclick="handleError(this.id)">' +
                '<label class="nobtn button-label" for="qtnno' + quesArray[i].Id + '"  title="" data-original-title="Fail" data-placement="right"><i class="fas fa-times"></i></label>' +
                '</div>' +
                '<div class="d-flex questiondtal">' +
                ques +
                '</div>' +
                ' <span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Atleast One option must selected!!</span>' +
                '<h6 class="questiontittle">' + quesArray[i].Question + '</h6> ' +
                '<div class="row">' +
                '<div class="col-sm-12">' +
                '<ul class="list-unstyled optionlist">' +
                option +
                '</ul >' +
                '</div >' +
                '</div>' +
                '<div class="row" >' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<label> Reference Image</label>' +
                '<div class="text-p">' +
                '<span id="ref,' + quesArray[i].Id + '" onclick="GetRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                '</div>' +
                '</div>' +
                '</div>' +
                userImage +
                '</div>' +
                '</div>';




            $("#BindQues").append(element);

            if (quesArray[i].isAudit == true) {
                $("#qtnyes" + quesArray[i].Id).prop('checked', true);
                $("#qtnyes" + quesArray[i].Id).prop('disabled', true);
                $("#qtnno" + quesArray[i].Id).prop('disabled', true);
            }
        }

        else {


            if (quesArray[i].IsMandatory == true) {

                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';
            }
            else {

                var ques = '<h2 class="questiontittle">Question' + count + '</h2>';
            }


            var option = '';

            var optionText = quesArray[i].QuestionSingleMultiSelectModelList;

            for (let j = 0; j < optionText.length; j++) {
                if (optionText[j].IsSelect == true) {
                    option = option +
                        '<li class="multiselect">' +
                        '<div class="checkdgn checkdgnlsit  ">' +
                        '<input id="Option' + optionText[j].ID + '" name="option' + quesArray[i].Id + '"  class="checkbox" type="checkbox" checked disabled>' +
                        '<label for=id="Option' + optionText[j].ID + '">' + optionText[j].OptionText + '</label>' +
                        '</div>' +
                        '</li>';
                }
            }

            var userImage = '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<label>User Reference Image</label>' +
                '<div class="text-p">' +
                '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                '</div>' +
                '</div>';

            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                '<div class="button-wrap qtnbtn">' +
                '<input class="hidden yes-radio radio-label" type="radio" name="question' + quesArray[i].Id + '" id="qtnyes' + quesArray[i].Id + '" onclick="handleError(this.id)" >' +
                '<label class="yesbtn button-label" for="qtnyes' + quesArray[i].Id + '"  title="" data-original-title="Pass" data-placement="right"><i class="fas fa-check"></i></label>' +
                '<input class="hidden no-radio  radio-label" type="radio" name="question' + quesArray[i].Id + '" id="qtnno' + quesArray[i].Id + '" onclick="handleError(this.id)">' +
                '<label class="nobtn button-label" for="qtnno' + quesArray[i].Id + '"  title="" data-original-title="Fail" data-placement="right"><i class="fas fa-times"></i></label>' +
                '</div>' +
                '<div class="d-flex questiondtal">' +
                ques +
                '</div>' +
                ' <span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Atleast One option must selected!!</span>' +
                '<h6 class="questiontittle" >' + quesArray[i].Question + '</h6> ' +
                '<div class="row">' +
                '<div class="col-sm-12">' +
                '<ul class="list-unstyled optionlist">' +
                option +
                '</ul >' +
                '</div >' +
                '</div>' +
                '<div class="row" >' +
                '<div class="col-sm-4">' +
                '<div class="form-group">' +
                '<label> Reference Image</label>' +
                '<div class="text-p">' +
                '<span id="ref,' + quesArray[i].Id + '" onclick="GetRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                '</div>' +
                '</div>' +
                '</div>' +
                userImage +
                '</div>' +
                '</div>';


            $("#BindQues").append(element);

            if (quesArray[i].isAudit == true) {
                $("#qtnyes" + quesArray[i].Id).prop('checked', true);
                $("#qtnyes" + quesArray[i].Id).prop('disabled', true);
                $("#qtnno" + quesArray[i].Id).prop('disabled', true);
            }
        }
        count++;
    }
}

var userOption = [];

function SaveAuditTask() {

    var isAudit = null;
    var isReprocess = null;
    var Task_transID = $('#hdnTask_transID').val();

    var currentDate = new Date();

    if (combineDateTime($('#toDate').val(), $("#dtTaskTime").val()) < currentDate) {

        document.getElementById("spdtTaskTime").innerHTML = "Due Date and Time should be grater or equal to today's date and time!";
        $("#spdtTaskTime").show();
        setTimeout(function () {
            $("#spdtTaskTime").hide();
            document.getElementById("spdtTaskTime").innerHTML = 'Hey, You missed this field!!';
        }, 4000);

        return;

    }


    if ($("#auditno").is(":checked")) {
        $("#auditRemark").addClass('Mandatory');
        
    }
    else {
        $("#auditRemark").removeClass('Mandatory');
 
    }



    if (!$("#audityes").is(":checked") && !$("#auditno").is(":checked")) {
        $("#spaudit").show();
        return;
    }
    else if ($("#auditno").is(":checked")) {
        isAudit = false;
        if (!$("#reprocessyes").is(":checked") && !$("#reprocessno").is(":checked")) {
            $("#spreprocess").show();
            return;
        }
        else if ($("#reprocessyes").is(":checked")) {
            isReprocess = true;
        }
        else {
            isReprocess = false;
        }
    }
    else {
        isAudit = true;
    }

    if (checkValidationOnSubmit('Mandatory')) {
        var auditObj = {
            Task_transID: Task_transID,
            TaskAudit: isAudit,
            IsReprocess: isReprocess,
            FromDate: ChangeDateFormat(fromDate),
            ToDate: ChangeDateFormat($("#toDate").val()),
            Remark: $("#auditRemark").val(),
            TaskDate: $("#dtTaskTime").val()
        }

        console.log(auditObj);

        var TaskAuditModel = {
            DoerAuditModel: auditObj,
            QuesAuditModel: userOption
        }
        $('#auditTaskBtn').prop('disbaled', true);
        CommonAjaxMethodTMS(baseURL + 'ManageDoer/SaveDoerAuditTask', TaskAuditModel, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                sessionStorage.setItem('successShown', 'true');
                sessionStorage.setItem('message', '<span class="checkmark">✅</span> Task Audited Successfully');
                RedirectDoerDashBoardRequest();
            }

        });
    }



}


function DoerAuditTask() {

    var isBool = true;
    for (let i = 0; i < quesArray.length; i++) {
        if (!$("#qtnyes" + quesArray[i].Id).is(":checked") && !$("#qtnno" + quesArray[i].Id).is(":checked")) {
            isBool = false;
            $("#sp" + quesArray[i].Id).show();
        }
    }
    if (isBool == false) {
        return;
    }
    else {
        $("#AuditBtn").attr("data-toggle", "modal");

        $('#noaudit').hide();

        for (let i = 0; i < quesArray.length; i++) {
            if ($("#qtnyes" + quesArray[i].Id).is(":checked")) {
                var obj = {
                    QuestionId: quesArray[i].Id,
                    isAudit: true

                }
                userOption.push(obj);
            }
            else {
                var obj = {
                    QuestionId: quesArray[i].Id,
                    isAudit: false

                }
                userOption.push(obj);
            }
        }

        console.log(userOption);
    }


}

function RedirectDoerDashBoardRequest() {

    var url = "/ManageDoer/DoerDashBoard?auth=" + AuthToken;
    window.location.href = url;

}


function handleError(id) {
    var numericPart = id.match(/\d+/)[0];
    $("#sp" + numericPart).hide();
}

function calculateExpiryDate(dateString, daysToAdd) {
    // Parse the input date string to get the year, month, and day
    var parts = dateString.split('-');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);
    daysToAdd = parseInt(daysToAdd, 10);

    var noOfDaysInM = daysInMonth(month, year);

    var remainingDays = noOfDaysInM - day;

    while (daysToAdd > remainingDays) {
        daysToAdd = daysToAdd - remainingDays;
        day = 1;
        month = month + 1;
        noOfDaysInM = daysInMonth(month, year);
        remainingDays = noOfDaysInM - day;
    }

    day += daysToAdd;


    // Return the formatted date in "dd-mm-yyyy" format
    var expdate = (day < 9 ? '0' + day : day) + '-' + (month < 9 ? '0' + month : month) + '-' + year;


    return expdate;
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function convertDelayIndays(CombinedDateTime) {

    var givenDateTimeString = CombinedDateTime;

    // Convert the given datetime string to a Date object
    var givenDateTime = new Date(givenDateTimeString);

    var currentDateTime = new Date();

    var delayInMillis = 0;

    givenDateTime.setSeconds(0);
    currentDateTime.setSeconds(0);

    if (currentDateTime > givenDateTime) {

        delayInMillis = givenDateTime.getTime() - currentDateTime.getTime();

        var days = Math.floor(delayInMillis / (1000 * 60 * 60 * 24)) + 1;
        var hours = Math.floor((delayInMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + 1;
        var minutes = Math.floor((delayInMillis % (1000 * 60 * 60)) / (1000 * 60)) + 1;

        return { days: Math.abs(days), hours: Math.abs(hours), minutes: Math.abs(minutes) };

    }
    else {
        return { days: 0, hours: 0, minutes: 0 };
    }

}

function UploadocumentUserAnswerReport(id) {



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

                    $('#hdnActualfilename' + id).val(result.FileModel.ActualFileName);
                    $('#hdnNewfilename' + id).val(result.FileModel.NewFileName);
                    $('#hdnFileUrl' + id).val(result.FileModel.FileUrl);
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

var isActual;

var isActualUser;
function GetRefImage(id) {

    var spt = id.split(',');
    var ID = spt[1];
    const index = quesArray.findIndex(input => input.Id == ID);

    $("#myImage").attr("src", quesArray[index].QFileURL);
    isActual = quesArray[index].QActualFileName;
    handleFile();
}

function handleFile() {
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
        showModalWithImage(filePath);
    } else {
        // Download the file
        $('#viewimage').modal('hide');
        downloadFile(filePath);
    }
}

// Function to display image in the modal
function showModalWithImage(imagePath) {
    const modalImage = document.getElementById('myImage');
    modalImage.src = imagePath;
    $('#viewimage').modal('show'); // Assuming you're using jQuery and Bootstrap
}

// Function to download the file
function downloadFile(filePath) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = isActual; // Let the browser decide the file name or specify one
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function GetUserRefImage(id) {
    var spt = id.split(',');
    var ID = spt[1];
    const index = quesArray.findIndex(input => input.Id == ID);

    $("#myUserImage").attr("src", quesArray[index].UserFileURL);
    isActualUser = quesArray[index].UserActualFilename;
    handleUserFile();
}

function handleUserFile() {
    // Determine file extension using lastIndexOf('.')
    const imageElement = document.getElementById('myUserImage');

    // Get the value of the 'src' attribute
    const filePath = imageElement.src;
    const lastDotIndex = filePath.lastIndexOf('.');
    const fileExtension = lastDotIndex !== -1 ? filePath.substring(lastDotIndex + 1).toLowerCase() : '';

    // List of image extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    // Check if the file is an image
    if (imageExtensions.includes(fileExtension) || fileExtension == '' || fileExtension == null || fileExtension.length > 4) {
        // Show image in modal
        showUserModalWithImage(filePath);
    } else {
        // Download the file
        if ($('#hdnStatus').val() == 1) {
            isActualUser = $('#hdnUploadActualFileName').val();
        }

        $('#viewUserimage').modal('hide');
        downloadUserFile(filePath);
    }
}

// Function to display image in the modal
function showUserModalWithImage(imagePath) {
    const modalImage = document.getElementById('myUserImage');
    modalImage.src = imagePath;
    $('#viewUserimage').modal('show'); // Assuming you're using jQuery and Bootstrap
}

// Function to download the file
function downloadUserFile(filePath) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = isActualUser; // Let the browser decide the file name or specify one
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function combineDateTime(dateString, timeString) {
    // Split the time string to get hours, minutes, and seconds
    var timeParts = timeString.split(':');
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);

    // Split the date string to get year, month, and day
    var dateParts = dateString.split('-');
    var year = parseInt(dateParts[2], 10);
    var month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed in JavaScript Date object
    var day = parseInt(dateParts[0], 10);

    // Create a new Date object with the combined date and time
    var combinedDateTime = new Date(year, month, day, hours, minutes);

    return combinedDateTime;
}
