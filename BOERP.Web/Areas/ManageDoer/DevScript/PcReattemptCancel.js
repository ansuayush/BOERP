$(document).ready(function () {

    EditTaskMaster(Edit_ID);

    $("#userImage").change(function () {
        UploadocumentTaskReport();
    })


});

var quesArray = [];
var TaskAudit = "";
var AuditRemark = "";

var cancelRemark;

var reattemptDate;
function EditTaskMaster(id) {

    CommonAjaxMethodTMS(virtualPath + 'ManageDoer/GetDoerTaskById', { id: id }, 'GET', function (response) {
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
        $('#TaskTime').val(data[0].TaskTime);
        $("#Branch").html(data[0].BranchName);
        $("#Weightage").val(data[0].Weightage);
        cancelRemark = data[0].CancelRemark;
        reattemptDate = getdatetime(data[0].DueDate);

        $('#ExpDate').val(ChangeDateFormatToddMMYYY(data[0].ExpiryDate));

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
                $("#userYesUpload").hide();
                $("#yesUserimageshow").hide();
                $("#myImage").attr("src", data[0].FileURL);
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

        if (data[0].TaskAudit == null || data[0].TaskAudit == true) {
            TaskAudit = 'Yes';
        }
        else {
            TaskAudit = 'No';
        }

        AuditRemark = data[0].AuditRemark;

        var obj = convertDelayIndays(data[0].DueDate);
        $("#DDay").html(obj.days);
        $("#DHour").html(obj.hours);
        $("#DMin").html(obj.minutes);



        var QuestionTable = response.data.data.Table1; // QuestionSingleMultiSelectModelList
        var Option = response.data.data.Table2;

        if (QuestionTable.length > 0) {

            for (var i = 0; i < QuestionTable.length; i++) {
                var optiontext = []
                for (var j = 0; j < Option.length; j++) {
                    if (Option[j].Question_Id == QuestionTable[i].ID) {
                        if (QuestionTable[i].isAudit == false) {
                            var objOption = {
                                OptionText: Option[j].OptionText,
                                ID: Option[j].OptionText_Id,

                            };
                            optiontext.push(objOption);
                        }
                        else {
                            var objOption = {
                                OptionText: Option[j].OptionText,
                                ID: Option[j].OptionText_Id,
                                IsSelect: Option[j].IsSelect,
                            };
                            optiontext.push(objOption);
                        }
                    }
                }
                if (QuestionTable[i].Type != 'singleselect' && QuestionTable[i].Type != 'multiplechoice') {
                    if (QuestionTable[i].isAudit == false) {
                        var obj1 = {
                            Id: QuestionTable[i].ID,
                            Question: QuestionTable[i].Question,
                            Priority: QuestionTable[i].Priority,
                            Type: QuestionTable[i].Type,
                            IsMandatory: QuestionTable[i].isMandatory,
                            QFileURL: QuestionTable[i].FileURL,
                            QActualFileName: QuestionTable[i].ActualFilename,
                            IsAudit: QuestionTable[i].isAudit,
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
                            QFileURL: QuestionTable[i].FileURL,
                            QActualFileName: QuestionTable[i].ActualFilename,
                            UserNumerical: QuestionTable[i].UserNumerical,
                            UserText: QuestionTable[i].UserText,
                            UserDate: QuestionTable[i].UserDate,
                            UserActualFilename: QuestionTable[i].UserActualFileName,
                            UserNewFilename: QuestionTable[i].UserNewFilename,
                            UserFileURL: QuestionTable[i].UserFileURL,
                            IsAudit: QuestionTable[i].isAudit,
                        }
                        quesArray.push(obj1);
                    }
                }
                else {

                    if (QuestionTable[i].isAudit == false) {
                        var obj2 = {
                            Id: QuestionTable[i].ID,
                            Question: QuestionTable[i].Question,
                            Priority: QuestionTable[i].Priority,
                            Type: QuestionTable[i].Type,
                            IsMandatory: QuestionTable[i].isMandatory,
                            QuestionSingleMultiSelectModelList: optiontext,
                            QFileURL: QuestionTable[i].FileURL,
                            QActualFileName: QuestionTable[i].ActualFilename,
                            IsAudit: QuestionTable[i].isAudit,
                            IsUploadImage: QuestionTable[i].isUploadImage

                        }
                        quesArray.push(obj2);
                    }
                    else {

                        var obj2 = {
                            Id: QuestionTable[i].ID,
                            Question: QuestionTable[i].Question,
                            Priority: QuestionTable[i].Priority,
                            Type: QuestionTable[i].Type,
                            IsMandatory: QuestionTable[i].isMandatory,
                            QuestionSingleMultiSelectModelList: optiontext,
                            QFileURL: QuestionTable[i].FileURL,
                            QActualFileName: QuestionTable[i].ActualFilename,
                            IsAudit: QuestionTable[i].isAudit,
                            UserActualFilename: QuestionTable[i].UserActualFilename,
                            UserNewFilename: QuestionTable[i].UserNewFileName,
                            UserFileURL: QuestionTable[i].UserFileURL,

                        }

                        quesArray.push(obj2);
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


            if (quesArray[i].IsAudit == false) {
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

                var isAudit = '<span class="float-right red-clr">Failed</span>';
            }

            else {
                var num = '<input type="text" class="form-control Mandatory" name="" placeholder="0" id="num' + quesArray[i].Id + '" value= "' + quesArray[i].UserNumerical + '" disabled > '
                var ques = '<h2 class="questiontittle">Question' + count;

                var userImage = '<div class="col-sm-4">' +
                    '<div class="form-group">' +
                    '<label>User Reference Image</label>' +
                    '<div class="text-p">' +
                    '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                    '</div>' +
                    '</div>';

                var isAudit = '<span class="float-right green-clr">Passed</span>';
            }
            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                isAudit +
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
                ' <span id="spnum' + quesArray[i].Id + '" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>' +
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

            if (quesArray[i].IsAudit == false) {
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

                var isAudit = '<span class="float-right red-clr">Failed</span>';
            }
            else {
                var text = '<textarea placeholder="Enter" class="font-contorl question-form-contorl h-100 Mandatory" id="num' + quesArray[i].Id + '" disabled >' + quesArray[i].UserText + '</textarea>';
                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';

                var userImage = '<div class="col-sm-4">' +
                    '<div class="form-group">' +
                    '<label>User Reference Image</label>' +
                    '<div class="text-p">' +
                    '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                    '</div>' +
                    '</div>';

                var isAudit = '<span class="float-right green-clr">Passed</span>';
            }

            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                isAudit +
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
                '<span id="ref,' + quesArray[i].Id + '" onclick="GetRefImage(this.id)" ><img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                '</div>' +
                '</div>' +
                '</div>' +
                userImage +
                '</div>' +
                '</div>';
            $("#BindQues").append(element);
        }

        else if (quesArray[i].Type == 'dateandtime') {


            if (quesArray[i].IsAudit == false) {
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

                var isAudit = '<span class="float-right red-clr">Failed</span>';
            }

            else {
                var date = '<p class="text-p">' + getdatetime(quesArray[i].UserDate) + '</p>'
                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';

                var userImage = '<div class="col-sm-4">' +
                    '<div class="form-group">' +
                    '<label>User Reference Image</label>' +
                    '<div class="text-p">' +
                    '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                    '</div>' +
                    '</div>';

                var isAudit = '<span class="float-right green-clr">Passed</span>';
            }

            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                isAudit +
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

            if (quesArray[i].IsAudit == false) {
                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';

                var isAudit = '<span class="float-right red-clr">Failed</span>';

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
                var ques = '<h2 class="questiontittle">Question' + count + '</h2>';

                var isAudit = '<span class="float-right green-clr">Passed</span>';

                var userImage = '<div class="col-sm-4">' +
                    '<div class="form-group">' +
                    '<label>User Reference Image</label>' +
                    '<div class="text-p">' +
                    '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                    '</div>' +
                    '</div>';
            }

            var option = '';

            var optionText = quesArray[i].QuestionSingleMultiSelectModelList;

            if (quesArray[i].IsAudit == false) {
                for (let j = 0; j < optionText.length; j++) {
                    option = option +
                        '<li class="singleselect">' +
                        '<div class="radio rediodgn">' +
                        '<input name="option' + quesArray[i].Id + '" type="radio" id="Option' + optionText[j].ID + '" onchange="handleError(' + quesArray[i].Id + ')" >' +
                        '<label for="Option' + optionText[j].ID + '" class="radio-label">' + optionText[j].OptionText + '</label>' +
                        '</div>' +
                        '</li>';
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
            }


            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                isAudit +
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

            if (quesArray[i].IsAudit == false) {
                var ques = '<h2 class="questiontittle">Question' + count + '<sup class="red-clr">*</sup></h2>';

                var isAudit = '<span class="float-right red-clr">Failed</span>';

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
                var ques = '<h2 class="questiontittle">Question' + count + '</h2>';

                var isAudit = '<span class="float-right green-clr">Passed</span>';

                var userImage = '<div class="col-sm-4">' +
                    '<div class="form-group">' +
                    '<label>User Reference Image</label>' +
                    '<div class="text-p">' +
                    '<span id="userRef,' + quesArray[i].Id + '" onclick="GetUserRefImage(this.id)" > <img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</span> ' +
                    '</div>' +
                    '</div>';
            }


            var option = '';

            var optionText = quesArray[i].QuestionSingleMultiSelectModelList;

            if (quesArray[i].IsAudit == false) {
                for (let j = 0; j < optionText.length; j++) {
                    option = option +
                        '<li class="multiselect">' +
                        '<div class="checkdgn checkdgnlsit  ">' +
                        '<input id="Option' + optionText[j].ID + '" name="option' + quesArray[i].Id + '"  class="checkbox" type="checkbox" onchange="handleError(' + quesArray[i].Id + ')">' +
                        '<label for=id="Option' + optionText[j].ID + '">' + optionText[j].OptionText + '</label>' +
                        '</div>' +
                        '</li>';
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
            }


            var element = '<div class="checkdgin"><span class="badge badge-secondary badgeinfo">Priority ' + quesArray[i].Priority  + '</span>' +
                isAudit +
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

    var AuditPassed = '<div class="checkdgin">' +
        '<div class="d-flex questiondtal">' +
        '<h2 class="questiontittle">Has the audit passed?' +
        '</h2>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-sm-3">' +
        '<p class="text-p">' + TaskAudit + '</p>' +
        '</div>' +
        '</div>' +
        '</div>';

    $("#BindQues").append(AuditPassed);

    var auditRemark = '<div class="checkdgin">' +
        '<div class="d-flex questiondtal">' +
        '<h2 class="questiontittle">Auiditor Remarks</h2>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-sm-12">' +
        '<p class="text-p">' + AuditRemark + '</p>' +
        '</div>' +
        '</div>' +
        '</div>';

    $("#BindQues").append(auditRemark);

    var audidate = '<div class="checkdgin">' +
        '<div class="d-flex questiondtal">' +
        '<h2 class="questiontittle">Reattempt date & time</h2>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-sm-12">' +
        '<p class="text-p">' + reattemptDate + '</p>'
        '</div>' +
        '</div>' +
        '</div>';

    $("#BindQues").append(audidate);

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

var userArray = [];

var userOption = [];
function SaveDoerTask() {

    var isBool = true;
    for (let i = 0; i < quesArray.length; i++) {
        if (quesArray[i].IsAudit == false & (quesArray[i].Type == 'singleselect' || quesArray[i].Type == 'multiplechoice')) {
            if (!$("input[name='option" + quesArray[i].Id + "']:checked").val()) {
                isBool = false;
                $("#spsingle" + quesArray[i].Id).show();
                break;
            }

        }
    }
    if (isBool == false) {
        return;
    }


    if (checkValidationOnSubmit('Mandatory') == true) {
        for (let i = 0; i < quesArray.length; i++) {

            if (quesArray[i].IsAudit == false) {
                if (quesArray[i].Type == 'Numerical') {

                    var obj = {

                        QuestionId: quesArray[i].Id,
                        UserNumerical: $('#num' + quesArray[i].Id).val(),
                        ActualFilename: $("#hdnActualfilename" + quesArray[i].Id).val(),
                        NewFilename: $("#hdnNewfilename" + quesArray[i].Id).val(),
                        FileURL: $("#hdnFileUrl" + quesArray[i].Id).val(),
                        isAudit: quesArray[i].IsAudit
                    }
                    userArray.push(obj);
                }

                else if (quesArray[i].Type == 'text') {

                    var obj = {
                        QuestionId: quesArray[i].Id,
                        UserText: $('#text' + quesArray[i].Id).val(),
                        ActualFilename: $("#hdnActualfilename" + quesArray[i].Id).val(),
                        NewFilename: $("#hdnNewfilename" + quesArray[i].Id).val(),
                        FileURL: $("#hdnFileUrl" + quesArray[i].Id).val(),
                        isAudit: quesArray[i].IsAudit

                    }
                    userArray.push(obj);
                }

                else if (quesArray[i].Type == 'dateandtime') {


                    var obj = {
                        QuestionId: quesArray[i].Id,
                        UserDate: $('#date' + quesArray[i].Id).val(),
                        ActualFilename: $("#hdnActualfilename" + quesArray[i].Id).val(),
                        NewFilename: $("#hdnNewfilename" + quesArray[i].Id).val(),
                        FileURL: $("#hdnFileUrl" + quesArray[i].Id).val(),
                        isAudit: quesArray[i].IsAudit

                    }
                    userArray.push(obj);
                }

                else if (quesArray[i].Type == 'singleselect') {

                    var obj1 = {
                        QuestionId: quesArray[i].Id,
                        UserDate: null,
                        ActualFilename: $("#hdnActualfilename" + quesArray[i].Id).val(),
                        NewFilename: $("#hdnNewfilename" + quesArray[i].Id).val(),
                        FileURL: $("#hdnFileUrl" + quesArray[i].Id).val(),
                        isAudit: quesArray[i].IsAudit

                    }
                    userArray.push(obj1);

                    var optionText = quesArray[i].QuestionSingleMultiSelectModelList;


                    for (var j = 0; j < optionText.length; j++) {
                        var obj = {
                            Question_Id: quesArray[i].Id,
                            OptionText_Id: optionText[j].ID,
                            isSelect: $('#Option' + optionText[j].ID).prop('checked')
                        }
                        userOption.push(obj);
                    }

                }
                else {

                    var obj1 = {
                        QuestionId: quesArray[i].Id,
                        UserDate: null,
                        ActualFilename: $("#hdnActualfilename" + quesArray[i].Id).val(),
                        NewFilename: $("#hdnNewfilename" + quesArray[i].Id).val(),
                        FileURL: $("#hdnFileUrl" + quesArray[i].Id).val(),
                        isAudit: quesArray[i].IsAudit
                    }
                    userArray.push(obj1);
                    var optionText = quesArray[i].QuestionSingleMultiSelectModelList;


                    for (var j = 0; j < optionText.length; j++) {
                        var obj = {
                            Question_Id: quesArray[i].Id,
                            OptionText_Id: optionText[j].ID,
                            isSelect: $('#Option' + optionText[j].ID).prop('checked')
                        }
                        userOption.push(obj);
                    }

                }
            }

        }

        var DoerModel = {
            Task_transID: $("#hdnTask_transID").val(),
            DelayD: parseInt($("#DDay").html(), 10),
            DelayH: parseInt($("#DHour").html(), 10),
            DelayM: parseInt($("#DMin").html(), 10),
            UserRefActualFilename: $("#hdnUploadActualFileName").val(),
            UserRefNewFilename: $("#hdnUploadNewFileName").val(),
            UserRefFileURL: $("#hdnUploadFileUrl").val(),
            UserRemarks: $("#userRemarks").val(),
            UserTaskQuestionModel: userArray,
            UserQuestionSingleMultiselectModel: userOption,

        }

        console.log(DoerModel);

        CommonAjaxMethodTMS(virtualPath + 'ManageDoer/SaveDoerReattemptModel', DoerModel, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                sessionStorage.setItem('successShown', 'true');
                sessionStorage.setItem('message', '<span class="checkmark">✅</span> Task Saved Successfully');
                RedirectDoerDashBoardRequest();
            }

        });

    }

}

function RedirectDoerDashBoardRequest() {

    var url = "/ManageDoer/DoerDashBoard?auth=" + AuthToken;
    window.location.href = url;

}


function handleError(id) {
    $("#spsingle" + id).hide();
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

function RedirectPcDashBoardRequest() {

    var url = "/ManageDoer/PcDashBoard?auth=" + AuthToken;
    window.location.href = url;

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
            url: virtualPath + 'CommonMethod/UploadOtherDocument',
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

var QuesAudit;
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
    QuesAudit = quesArray[index].IsAudit;
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
        if (QuesAudit == 0) {
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

function UploadocumentTaskReport() {



    var fileUpload = $("#userImage").get(0);

    var files = fileUpload.files;
    if (files.length > 0) {

        // Create FormData object
        var fileData = new FormData();

        // Looping over all files and add it to FormData object
        for (var i = 0; i < files.length; i++) {
            fileData.append(files[i].name, files[i]);
        }

        $.ajax({
            url: virtualPath + 'CommonMethod/UploadOtherDocument',
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
                    $("#myUserImage").attr("src", result.FileModel.FileUrl);
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