$(document).ready(function () {
    $(function () {
        $('.datepicker').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "dd-mm-yy",
            yearRange: "-90:+10"
        });
    });

    BindMeetingDetailsRequest();
});
var OrientationSchedulesArray = [];
function BindMeetingDetailsRequest() {
    CommonAjaxMethod(virtualPath + 'OnboardingRequest/BindonboardingProcessData', { CandidateId: CandidateId, inputData: 5 }, 'GET', function (response) {
        var dataMeetingDetails = response.data.data.Table;
        OrientationSchedulesArray = dataMeetingDetails;
        BindOrientationSchedulesArray();
    });
}

function BindOrientationSchedulesArray() {
    $('#divMeetingDetails').html('');
    var ulStr1 = '<ul class="list-unstyled row">';
    var ulStrEmpty = ''
    for (let i = 0; i < OrientationSchedulesArray.length; i++) {
        var cData = OrientationSchedulesArray[i].OriDate == null ? "" : OrientationSchedulesArray[i].OriDate;
        cData = ChangeDateFormatToddMMYYY(cData);
        var str = OrientationSchedulesArray[i].NameOfMember;
        var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
        var acronym = matches.join(''); // JSON
        var liStrbtn = "";
        var liStr1 = "<li class='col-md-3 mb-3 col-sm-4'>" +
            "<div class='md-lst text-center'>" +
            "<span id='spSortName' class='mtdgn-profile count-nt'>" + acronym + "</span>" +
            "<h2>" + OrientationSchedulesArray[i].NameOfMember + "</h2>" +
            "<small class='lgt-text'><span id='spDesignation'></span></small>" +
            "<p class='text-left lgt-text mt-3 mb-0'>Date<span id='spDate' class='float-right blk-clr'>" + cData + "</span></p>" +
            "<hr class='v-line '>" +
            "<p class='text-left lgt-text'>Time<span id='spTime' class='float-right blk-clr'>" + OrientationSchedulesArray[i].Time + "</span></p>";
        if (OrientationSchedulesArray[i].Feedback == "" || OrientationSchedulesArray[i].Feedback == null) {
            var feedback = OrientationSchedulesArray[i].Feedback == null ? '' : OrientationSchedulesArray[i].Feedback;
            liStrbtn = "<a style='display: none;' onclick ='ReschedulePopup(" + JSON.stringify(OrientationSchedulesArray[i].NameOfMember.toString()) + ",'" + OrientationSchedulesArray[i].OriID + "," + JSON.stringify(OrientationSchedulesArray[i].Time.toString()) + "," + JSON.stringify(OrientationSchedulesArray[i].OriDate.toString()) + ")' class='btn mtr-o-grn mt-3 btn-l'><strong><i class='fas fa-calendar-alt'></i>Reschedule</strong></a>" +
                "<a id='anFeedBack_" + i + "' class='btn mtr-o-grn mt-3 btn-l' data-toggle='tooltip' data-original-title='Click to Remove' onclick ='FeedbackPopup(" + JSON.stringify(OrientationSchedulesArray[i].NameOfMember.toString()) + "," + OrientationSchedulesArray[i].OriID + "," + JSON.stringify(feedback.toString()) + ")' > <i class='fas fa-comments' aria-hidden='true'></i>Feedback </a>";
        }
        else {
            var feedback = OrientationSchedulesArray[i].Feedback == null ? '' : OrientationSchedulesArray[i].Feedback;
            liStrbtn = "<a style='display:none' onclick ='ReschedulePopup(" + JSON.stringify(OrientationSchedulesArray[i].NameOfMember.toString()) + "," + OrientationSchedulesArray[i].OriID + "," + JSON.stringify(OrientationSchedulesArray[i].Time.toString()) + "," + JSON.stringify(OrientationSchedulesArray[i].OriDate.toString()) + "' class='btn mtr-o-grn mt-3 btn-l '><strong><i class='fas fa-calendar-alt'></i>Reschedule</strong></a>" +
                "<a id='anFeedBack_" + i + "' class='btn blk-gdn-btn mt-3 btn-l' data-toggle='tooltip' data-original-title='Click to Remove' onclick ='FeedbackPopup(" + JSON.stringify(OrientationSchedulesArray[i].NameOfMember.toString()) + ", " + OrientationSchedulesArray[i].OriID + "," + JSON.stringify(feedback.toString()) + ")' > <i class='fas fa-comments' aria-hidden='true'></i>Feedback </a>";
        }
        var liStrEndDiv = "</div></li>";
        ulStrEmpty += liStr1 + liStrbtn + liStrEndDiv;
    }
    var ulStr2 = "</ul>";
    $('#divMeetingDetails').html(ulStr1 + ulStrEmpty + ulStr2);

    for (let i = 0; i < OrientationSchedulesArray.length; i++) {
        var cData = OrientationSchedulesArray[i].OriDate == null ? "" : OrientationSchedulesArray[i].OriDate;
        cData = ChangeDateFormatToddMMYYY(cData);
        var isFeedback = ChangeTodate(cData);
        if (isFeedback==true) {
            document.getElementById('anFeedBack_' + i).style.display = 'none';
        } else { document.getElementById('anFeedBack_' + i).style.display = 'block'; }
    }
}
function ReschedulePopup(name, id, time, date) {
    var time = time.split(' ')[0];
    $('#hddrescheduleRowId').val(id);
    document.getElementById('spRescheduleName').innerText = name;
    $('#txtRescheduleTime').val(time);
    document.getElementById('txtRescheduleTime').innerText = time;
    $('#txtRescheduleDate').val(ChangeDateFormatToddMMYYY(date));
    $('#reschedule').modal('show');
}
function FeedbackPopup(name, id, feedback) {
    $('#hddfeedbackRowId').val(id);

    document.getElementById('spfeedbackName').innerText = name;
    document.getElementById('txtaFeedback').innerText = feedback;
    if (feedback != "") {
        $('#txtaFeedback').attr('readonly', 'readonly');
        document.getElementById('btnFeedBackUpdate').style.display = 'none';
    }
    else {
        $('#txtaFeedback').removeAttr('readonly', 'readonly');
        $("#txtaFeedback").attr("readonly", false);
        document.getElementById('btnFeedBackUpdate').style.display = 'block';
    }
    $('#feedback').modal('show');
}
function ChangeTodate(meetingDate) {
    var isFeedBack = false;
    var dateEntered = meetingDate;// document.getElementById("txtToDate").value;
    var date = dateEntered.substring(0, 2);
    var month = dateEntered.substring(3, 5);
    var year = dateEntered.substring(6, 10);

    var meetingDateCompare = new Date(year, month - 1, date);
    var currentDate = new Date();
    if (meetingDateCompare > currentDate) {
        //alert("Date Entered is greater than Current Date ");
        isFeedBack = true;
    }
    else {
        //alert("ToDate should be greater than current date");
        isFeedBack = false;
    }
    return isFeedBack;
}
function RescheduleDateTime() {
    var valid = true;
    if (checkValidationOnSubmit('Mandatory') == false) {
        valid = false;
    }
    if (checkValidationOnSubmit('Mandatorypld') == false) {
        valid = false;
    }
    if (valid == true) {
        var rowId = $('#hddrescheduleRowId').val();
        var inputEle = document.getElementById('txtRescheduleTime');
        var dd = onTimeChange(inputEle);
        var OrientationSchedulesArray =
        {
            RowNum: rowId,
            CandidateId: rowId,
            NameOfMember: '',
            EmpId: '',
            OriDate: ChangeDateFormat($("#txtRescheduleDate").val()),
            Time: $("#txtRescheduleTime").val = dd,
            Place: '',
            Purpose: '',
            Mode: ''
        }
        var obj = {
            OrientationReschedulesModel: OrientationSchedulesArray
        }
        CommonAjaxMethod(virtualPath + 'OnboardingRequest/SaveOrientationRescheduleDateTime', obj, 'POST', function (response) {
            window.location.reload();
            $('#reschedule').modal('hide');
        });
    }
}
function FeedBackUpdate() {
    var rowId = $('#hddfeedbackRowId').val();
    var OrientationSchedulesArray =
    {
        CandidateId: rowId,
        Feedback: $('#txtaFeedback').val()
    }
    var obj = {
        OrientationReschedulesModel: OrientationSchedulesArray
    }
    CommonAjaxMethod(virtualPath + 'OnboardingRequest/SaveOrientationRescheduleFeedback', obj, 'POST', function (response) {
        //CommonAjaxMethod(virtualPath + 'OnboardingRequest/UpdateUserStatus', { Id: loggedinUserid, inputData: 6 }, 'POST', function (response) {
        window.location.reload();
        $('#feedback').modal('hide');
        //});
    });
}
function onTimeChange(inputEle) {
    var timeSplit = inputEle.value.split(':'),
        hours,
        minutes,
        meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
        meridian = 'PM';
        hours -= 12;
    } else if (hours < 12) {
        meridian = 'AM';
        if (hours == 0) {
            hours = 12;
        }
    } else {
        meridian = 'PM';
    }
    return hours + ':' + minutes + ' ' + meridian;
}