$(document).ready(function () {

    EditCancelledTaskByPc(Edit_ID);


});

var quesArray = [];

var cancelRemark;
function EditCancelledTaskByPc(id) {

    CommonAjaxMethodTMS(baseURL + 'ManageDoer/GetPcCancelledTaskById', { id: id }, 'GET', function (response) {
        console.log(response);

        var data = response.data.data.Table;
        $('#TaskID').val(data[0].TaskId);
        $('#hdnTaskScheduleId').val(data[0].Task_ScheduleId);
        $("#hdnStatus").val(data[0].Status)
        $('#TaskDate').val(ChangeDateFormatToddMMYYY(data[0].TaskDate));
        $('#TaskName').html(data[0].TaskName);
        $('#Frequency').html(data[0].Frequency)
        $('#StartDate').val(ChangeDateFormatToddMMYYY(data[0].StartDate));
        $('#EndDate').val(ChangeDateFormatToddMMYYY(data[0].EndDate));
        $('#TaskTime').val(data[0].TaskTime);
        $("#Branch").html(data[0].BranchName);
        $("#Weightage").val(data[0].Weightage);
        cancelRemark = data[0].CancelRemark;

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
                isActual = data[0].ActualFilename;
                $("#userYesUpload").hide();
                $("#yesUserimageshow").hide();
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
                $("#userRemarks").prop('disabled', true);
                $("#userRemarks").removeClass('Mandatory');
                $("#userImage").removeClass('Mandatory');



            }
        }

     
            var QuestionTable = response.data.data.Table1; // QuestionSingleMultiSelectModelList
            var Option = response.data.data.Table2;


        if (QuestionTable.length > 0) {

            for (var i = 0; i < QuestionTable.length; i++) {
                var optiontext = []
                for (var j = 0; j < Option.length; j++) {
                    if (Option[j].Question_Id == QuestionTable[i].ID) {
                        if ($("#hdnStatus").val() == 5) {
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
                    if ($("#hdnStatus").val() == 5) {
                        var obj = {
                            Id: QuestionTable[i].ID,
                            Question: QuestionTable[i].Question,
                            Priority: QuestionTable[i].Priority,
                            Type: QuestionTable[i].Type,
                            IsMandatory: QuestionTable[i].isMandatory,
                            QFileURL: QuestionTable[i].FileURL,
                            QActualFileName: QuestionTable[i].ActualFilename,
                            IsUploadImage: QuestionTable[i].isUploadImage
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
                            UserActualFilename: QuestionTable[i].UserActualFilename,
                            UserNewFilename: QuestionTable[i].UserNewFilename,
                            UserFileURL: QuestionTable[i].UserFileURL,
                        }
                        quesArray.push(obj);
                    }
                }
                else {
                    if ($("#hdnStatus").val() == 5) {
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
                            UserFileURL: QuestionTable[i].UserFileURL

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

            if ($("#hdnStatus").val() == 2) {
                var num = '<input type="text" class="form-control Mandatory" name="" placeholder="0" id="num' + quesArray[i].Id + '" value= "' + quesArray[i].UserNumerical + '" disabled > '
                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';

                var userImage = '<div class="col-sm-4">' +
                    '<div class="form-group">' +
                    '<label>User Reference Image</label>' +
                    '<div class="text-p">' +
                    '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                    '</div>' +
                    '</div>';

            }
            else if (quesArray[i].IsMandatory == true) {
                var num = '<input type="text" class="form-control Mandatory" name="" placeholder="0" id="num' + quesArray[i].Id + '" onchange="validateNumericInput(this)">'
                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';

                if (quesArray[i].IsUploadImage == true) {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any<sup class="red-clr">*</sup></label>' +
                        '<input type="file" class="form-control Mandatory" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '<span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        '</div>';
                }
                else {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any</label>' +
                        '<input type="file" class="form-control" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '</div>' +
                        '</div>';
                }

            }



            else {
                var num = '<input type="text" class="form-control" name="" placeholder="0" id="num' + quesArray[i].Id + '" onchange="validateNumericInput(this)">'
                var ques = '<h2 class="questiontittle">Question' + count + '</h2>';

                if (quesArray[i].IsUploadImage == true) {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any<sup class="red-clr">*</sup></label>' +
                        '<input type="file" class="form-control Mandatory" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '<span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        '</div>';
                }
                else {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any</label>' +
                        '<input type="file" class="form-control" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '</div>' +
                        '</div>';
                }
            }




            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                '<div class="d-flex questiondtal">' +
                ques +
                '</div>' +
                '<h6 class="questiontittle">' + quesArray[i].Question + '</h6> ' +
                '<input type="hidden" id="hdnActualfilename' + quesArray[i].Id + '" />' +
                '<input type="hidden" id="hdnNewfilename' + quesArray[i].Id + '" />' +
                '<input type="hidden"id="hdnFileUrl' + quesArray[i].Id + '"  />' +
                '<div class="row">' +
                '<div class="col-sm-4 align-self-center mt-4">' +
                '<div class="form-group">' +
                '<label for="Lead Details" class="form-control-label"></label>' +
                num +
                '<span id="spnum' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
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
        }

        else if (quesArray[i].Type == 'text') {

            if ($("#hdnStatus").val() == 2) {
                var text = '<textarea placeholder="Enter" class="font-contorl question-form-contorl h-100 Mandatory" id="num' + quesArray[i].Id + '" disabled >' + quesArray[i].UserText + '</textarea>';
                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';

                var userImage = '<div class="col-sm-4">' +
                    '<div class="form-group">' +
                    '<label>User Reference Image</label>' +
                    '<div class="text-p">' +
                    '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                    '</div>' +
                    '</div>';
            }
            else if (quesArray[i].IsMandatory == true) {
                var text = '<textarea placeholder="Enter" class="font-contorl question-form-contorl h-100 Mandatory" id="text' + quesArray[i].Id + '" onchange="handleError(this.id)"></textarea>';
                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';

                if (quesArray[i].IsUploadImage == true) {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any<sup class="red-clr">*</sup></label>' +
                        '<input type="file" class="form-control Mandatory" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '<span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        '</div>';
                }
                else {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any</label>' +
                        '<input type="file" class="form-control" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '</div>' +
                        '</div>';
                }
            }
            else {
                var text = '<textarea placeholder="Enter" class="font-contorl question-form-contorl h-100 " id="text' + quesArray[i].Id + '"></textarea>';
                var ques = '<h2 class="questiontittle">Question' + count + '</h2>';

                if (quesArray[i].IsUploadImage == true) {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any<sup class="red-clr">*</sup></label>' +
                        '<input type="file" class="form-control Mandatory" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '<span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        '</div>';
                }
                else {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any</label>' +
                        '<input type="file" class="form-control" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '</div>' +
                        '</div>';
                }
            }

            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                '<div class="d-flex questiondtal">' +
                ques +
                '</div>' +
                '<h6 class="questiontittle">' + quesArray[i].Question + '</h6> ' +
                '<input type="hidden" id="hdnActualfilename' + quesArray[i].Id + '" />' +
                '<input type="hidden" id="hdnNewfilename' + quesArray[i].Id + '" />' +
                '<input type="hidden"id="hdnFileUrl' + quesArray[i].Id + '"  />' +
                '<div class="row">' +
                '<div class="col-sm-12">' +
                '<div class="qustionlist" style="display: block;">' +
                text +
                ' <span id="sptext' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
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
        }

        else if (quesArray[i].Type == 'dateandtime') {

            if ($("#hdnStatus").val() == 2) {
                var date = '<p class="text-p">' + quesArray[i].UserDate + '</p>'
                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';

                var userImage = '<div class="col-sm-4">' +
                    '<div class="form-group">' +
                    '<label>User Reference Image</label>' +
                    '<div class="text-p">' +
                    '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                    '</div>' +
                    '</div>';
            }
            else if (quesArray[i].IsMandatory == true) {
                var date = '<input type="datetime-local" class="form-control Mandatory" value="09:12" name="" placeholder="Enter"  id="date' + quesArray[i].Id + '" onchange="handleError(this.id)">';
                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';

                if (quesArray[i].IsUploadImage == true) {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any<sup class="red-clr">*</sup></label>' +
                        '<input type="file" class="form-control Mandatory" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '<span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        '</div>';
                }
                else {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any</label>' +
                        '<input type="file" class="form-control" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '</div>' +
                        '</div>';
                }
            }

            else {
                var date = '<input type="datetime-local" class="form-control" value="09:12" name="" placeholder="Enter"  id="date' + quesArray[i].Id + '">';
                var ques = '<h2 class="questiontittle">Question' + count + '</h2>';

                if (quesArray[i].IsUploadImage == true) {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any<sup class="red-clr">*</sup></label>' +
                        '<input type="file" class="form-control Mandatory" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '<span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        '</div>';
                }
                else {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any</label>' +
                        '<input type="file" class="form-control" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '</div>' +
                        '</div>';
                }
            }

            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                '<div class="d-flex questiondtal">' +
                ques +
                '</div>' +
                '<h6 class="questiontittle">' + quesArray[i].Question + '</h6> ' +
                '<input type="hidden" id="hdnActualfilename' + quesArray[i].Id + '" />' +
                '<input type="hidden" id="hdnNewfilename' + quesArray[i].Id + '" />' +
                '<input type="hidden"id="hdnFileUrl' + quesArray[i].Id + '"  />' +
                '<div class="row">' +
                '<div class="col-lg-4 align-self-center mt-3">' +
                '<div class="form-group">' +
                '<label for="Lead Details" class="form-control-label"> </label>' +
                date +
                ' <span id="spdate' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
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

            if ($("#hdnStatus").val() == 5) {
                for (let j = 0; j < optionText.length; j++) {
                    option = option +
                        '<li class="singleselect">' +
                        '<div class="radio rediodgn">' +
                        '<input name="option' + quesArray[i].Id + '" type="radio" id="Option' + optionText[j].ID + '" onchange="handleError(' + quesArray[i].Id + ')" >' +
                        '<label for="Option' + optionText[j].ID + '" class="radio-label">' + optionText[j].OptionText + '</label>' +
                        '</div>' +
                        '</li>';


                }

                if (quesArray[i].IsUploadImage == true) {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any<sup class="red-clr">*</sup></label>' +
                        '<input type="file" class="form-control Mandatory" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '<span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        '</div>';
                }
                else {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any</label>' +
                        '<input type="file" class="form-control" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '</div>' +
                        '</div>';
                }
            }
            else {
                for (let j = 0; j < optionText.length; j++) {
                    if (optionText[j].IsSelect == true) {
                        option = option +
                            '<li class="singleselect">' +
                            '<div class="radio rediodgn">' +
                            '<input name="option' + quesArray[i].Id + '" type="radio" id="Option' + optionText[j].ID + '"  checked >' +
                            '<label for="Option' + optionText[j].ID + '" class="radio-label">' + optionText[j].OptionText + '</label>' +
                            '</div>' +
                            '</li>';
                    }
                    else {
                        option = option +
                            '<li class="singleselect">' +
                            '<div class="radio rediodgn">' +
                            '<input name="option' + quesArray[i].Id + '" type="radio" id="Option' + optionText[j].ID + '"  selected disabled >' +
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
            }



            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                '<div class="d-flex questiondtal">' +
                ques +
                '</div>' +
                '<h6 class="questiontittle">' + quesArray[i].Question + '</h6> ' +
                '<input type="hidden" id="hdnActualfilename' + quesArray[i].Id + '" />' +
                '<input type="hidden" id="hdnNewfilename' + quesArray[i].Id + '" />' +
                '<input type="hidden"id="hdnFileUrl' + quesArray[i].Id + '"  />' +
                '<div class="row">' +
                '<div class="col-sm-12">' +
                ' <span id="spsingle' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Atleast One option must selected!!</span>' +
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

            if ($("#hdnStatus").val() == 5) {
                for (let j = 0; j < optionText.length; j++) {
                    option = option +
                        '<li class="multiselect">' +
                        '<div class="checkdgn checkdgnlsit  ">' +
                        '<input id="Option' + optionText[j].ID + '" name="option' + quesArray[i].Id + '"  class="checkbox" type="checkbox" onchange="handleError(' + quesArray[i].Id + ')">' +
                        '<label for=id="Option' + optionText[j].ID + '">' + optionText[j].OptionText + '</label>' +
                        '</div>' +
                        '</li>';
                }

                if (quesArray[i].IsUploadImage == true) {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any<sup class="red-clr">*</sup></label>' +
                        '<input type="file" class="form-control Mandatory" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '<span id="sp' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
                        '</div>' +
                        '</div>';
                }
                else {
                    var userImage = '<div class="col-sm-4">' +
                        '<div class="form-group">' +
                        '<label for="Lead Details" class="form-control-label">Upload Image/Document If Any</label>' +
                        '<input type="file" class="form-control" name="" placeholder="Enter" id="' + quesArray[i].Id + '" onchange="UploadocumentUserAnswerReport(this.id)" >' +
                        '</div>' +
                        '</div>';
                }
            }
            else {
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
            }


            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                '<div class="d-flex questiondtal">' +
                ques +
                '</div>' +
                '<h6 class="questiontittle" >' + quesArray[i].Question + '</h6> ' +
                '<input type="hidden" id="hdnActualfilename' + quesArray[i].Id + '" />' +
                '<input type="hidden" id="hdnNewfilename' + quesArray[i].Id + '" />' +
                '<input type="hidden"id="hdnFileUrl' + quesArray[i].Id + '"  />' +
                '<div class="row">' +
                '<div class="col-sm-12">' +
                ' <span id="spsingle' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Atleast One option must selected!!</span>' +
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
        }
        count++;
    }

    var cancelremark = '<div class="checkdgin">' +
        '<div class="d-flex questiondtal">' +
        '<h2 class="questiontittle">Pc Cancelled Remarks</h2>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-sm-12">' +
        '<p class="text-p">' + cancelRemark + '</p>' +
        '</div>' +
        '</div>' +
        '</div>';

    $("#BindQues").append(cancelremark);
}



function RedirectPCDashBoardRequest() {

    var url = "/ManageDoer/PcDashBoard?auth=" + AuthToken;
    window.location.href = url;

}


function handleError(id) {
    $("#sp" + id).hide();
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


