$(document).ready(function () {







    var obj3 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Branch,
        manualTableId: ManaulTableEnum.Branch
    }

    LoadMasterDropdown('dldBranch', obj3, 'All', false);

    var obj4 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Dashboardyear,
        manualTableId: ManaulTableEnum.Dashboardyear
    }

    LoadMasterDropdown('dldYear', obj4, 'Select', false);


    $(' #dldWeek, #dldYear').on('change', function () {
        getDashBoardDetails('All', $('#dldBranch').val(), $("#dldWeek").val(), $("#dldYear").val());
    });



 

    setBranch()


});


var EmployeeID = 0;
function setBranch() {
    CommonAjaxMethod(virtualPath + 'ManageEmployee/GetBranchDashboard', null, 'GET', function (response) {
        console.log(response);
        setFinYear(0);

        BranchName = response.data.data.Table[0].BranchName;
        BranchID = response.data.data.Table[0].BranchID;
        $('#BranchName').html(BranchName)
        $('#dldBranch').val(BranchID)

        getDashBoardDetails('All', BranchID, $("#dldWeek").val(), $("#dldYear").val());


    });
}

function handleFinWeek(ctrl) {
    const selectedValue = parseInt(ctrl.value, 10);

    var obj5 = {
        ParentId: selectedValue,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.FinancialWeek,
        manualTableId: ManaulTableEnum.FinancialWeek
    }

     $("#dldWeek").val('Select');

    getDashBoardDetails($('#dldEmployee').val(), $('#dldBranch').val(), 'Select', $("#dldYear").val());

    LoadMasterDropdown('dldWeek', obj5, 'Select', false);
}

var FinYear;

var FinWeek;

function setFinYear(id) {
    CommonAjaxMethod(virtualPath + 'ManageEmployee/BindHolidayMaster', { id: id }, 'GET', function (response) {
        console.log(response);

        FinYear = response.data.data.Table1[0].FinYear;

        FinWeek = response.data.data.Table2[0].FinWeek;

        $('#dldYear').val(FinYear).trigger('change');
        $('#dldWeek').val(FinWeek).trigger('change');

    });
}

function getDashBoardDetails(emp_ID, branch_ID, weekId, FinYear) {

    if (branch_ID == 'All') {
        branch_ID = 0;
    }
    if (emp_ID == 'All') {
        emp_ID = 0;
    }

    if (weekId > 0) {
        weekId = weekId;
    }
    else {
        weekId = 0;
    }

    if (FinYear > 0) {
        FinYear = FinYear;
    }
    else {
        FinYear = 0;
    }


    var obj = {
        EmployeeID: parseInt(emp_ID, 10),
        BranchID: parseInt(branch_ID, 10),
        WeekId: parseInt(weekId, 10),
        FInYear: parseInt(FinYear, 10),
    }

    console.log(obj)
    CommonAjaxMethod(virtualPath + 'ManageEmployee/AdminDashBoardDetailsGet', obj, 'GET', function (response) {


        //************ ----------- All process for weekly tasks ----------- *********** 
        var weekResponse = response.data.data.Table;

        console.log(weekResponse);

        $("#weekNo").html(weekResponse[0].WeekCount)

        $("#WeekDate").html(getDateFormat(weekResponse[0].WeekStartDate) + ' to ' + getDateFormat(weekResponse[0].WeekEndDate))

        $("#wkDate").html(getFormattedDate(weekResponse[0].WeekStartDate) + " - " + getFormattedDate(weekResponse[0].WeekEndDate))

        $("#fromDate").html(ChangeDateFormatToddMMYYY(weekResponse[0].WeekStartDate))
        $("#toDate").html(ChangeDateFormatToddMMYYY(weekResponse[0].WeekEndDate))



        $("#WNDweekPlaned").html(weekResponse[0].WkPlannedScore)
        $("#WNDTweekPlaned").html(weekResponse[0].WkTPlannedScore)
        $("#WNDQweekPlaned").html(weekResponse[0].WkQPlannedScore)

        $("#WNDweekActual").html(weekResponse[0].WKWorkDone)
        $("#WNDTweekActual").html(weekResponse[0].WKWorkDoneOnTime)
        $("#WNDQweekActual").html(weekResponse[0].WkWorkDoneQuality)

        $("#WNDweekScore").html(calculateScore(weekResponse[0].WkPlannedScore, weekResponse[0].WKWorkDone))
        $("#WNDTweekScore").html(calculateScore(weekResponse[0].WkTPlannedScore, weekResponse[0].WKWorkDoneOnTime))
        $("#WNDQweekScore").html(calculateScore(weekResponse[0].WkQPlannedScore, weekResponse[0].WkWorkDoneQuality))


        //************ ----------- All process for carry forward tasks ----------- *********** 

        var carryResponse = response.data.data.Table1;

        $("#carryWND").html(carryResponse[0].WkCPlannedScore)
        $("#carryWNDT").html(carryResponse[0].WkCTPlannedScore)
        $("#carryWNDQ").html(carryResponse[0].WkCQPlannedScore)


        console.log(carryResponse);


        //$("#avWkWND").html(calculateScore(weekResponse[0].WkPlannedScore, weekResponse[0].WKWorkDone))
        //$("#avgWkWNDT").html(calculateScore(weekResponse[0].WkPlannedScore, weekResponse[0].WKWorkDoneOnTime))
        //$("#avgWkWNDQ").html(calculateScore(weekResponse[0].WkPlannedScore, weekResponse[0].WkWorkDoneQuality))


        //$("#wkPlanned").html("Planned- " + weekObj.Planned)
        //$("#wkActual").html("Actual- " + weekObj.Actual)
        //$("#wkScore").html("% Score " + weekObj.sign + weekObj.Score)

        //$("#allWeekSCore").html(weekObj.sign + weekObj.Score)
        //$("#titleWkScore").html(weekObj.sign + weekObj.Actual + "/" + weekObj.Planned);



        //************ ----------- All process for monthly tasks ----------- *********** 

        //var monthlyResponse = response.data.data.Table1;

        //console.log(monthlyResponse);

        //$("#mtDate").html(getMonth(monthlyResponse[0].MonthDate));

        //$("#WNDmtPlanned").html(monthlyResponse[0].MTPlannedScore)
        //$("#WNDTmtPlanned").html(monthlyResponse[0].MTPlannedScore)
        //$("#WNDQmtPlanned").html(monthlyResponse[0].MTPlannedScore)

        //$("#WNDmtActual").html(monthlyResponse[0].MTWorkDone)
        //$("#WNDTmtActual").html(monthlyResponse[0].MTWorkDoneOnTime)
        //$("#WNDQmtActual").html(monthlyResponse[0].MTWorkDoneQuality)

        //$("#WNDmtScore").html(calculateScore(monthlyResponse[0].MTPlannedScore, monthlyResponse[0].MTWorkDone))
        //$("#WNDTmtScore").html(calculateScore(monthlyResponse[0].MTPlannedScore, monthlyResponse[0].MTWorkDoneOnTime))
        //$("#WNDQmtScore").html(calculateScore(monthlyResponse[0].MTPlannedScore, monthlyResponse[0].MTWorkDoneQuality))

        ////$("#avgMtWND").html(calculateScore(monthlyResponse[0].MTPlannedScore, monthlyResponse[0].MTWorkDone))
        ////$("#avgMtWNDT").html(calculateScore(monthlyResponse[0].MTPlannedScore, monthlyResponse[0].MTWorkDoneOnTime))
        ////$("#avgMtWNDQ").html(calculateScore(monthlyResponse[0].MTPlannedScore, monthlyResponse[0].MTWorkDoneQuality))


        //var monthObj = calculateALl(monthlyResponse[0].MTPlannedScore, monthlyResponse[0].MTWorkDone, monthlyResponse[0].MTWorkDoneOnTime, monthlyResponse[0].MTWorkDoneQuality)

        //$("#mtPlanned").html("Planned- " + monthObj.Planned)
        //$("#mtActual").html("Actual- " + monthObj.Actual)
        //$("#mtScore").html("% Score " + monthObj.sign + monthObj.Score)



        //$("#AllmtScore").html(monthObj.sign + monthObj.Score)
        //$("#titleMtScore").html(monthObj.sign + monthObj.Actual + "/" + monthObj.Planned);



        //************ ----------- All process for yearly tasks ----------- *********** 

        var yearlyResponse = response.data.data.Table2;

        console.log(yearlyResponse);

        $("#yrDate").html(getYear(yearlyResponse[0].YRStartDate, yearlyResponse[0].YREndDate));



        $("#WNDyrPlanned").html(yearlyResponse[0].YRPlannedScore)
        $("#WNDTyrPlanned").html(yearlyResponse[0].YRTPlannedScore)
        $("#WNDQyrPlanned").html(yearlyResponse[0].YRQPlannedScore)

        $("#WNDyrActual").html(yearlyResponse[0].YRWorkDone)
        $("#WNDTyrActual").html(yearlyResponse[0].YRWorkDoneOnTime)
        $("#WNDQyrActual").html(yearlyResponse[0].YRWorkDoneQuality)


        $("#WNDyrScore").html(calculateScore(yearlyResponse[0].YRPlannedScore, yearlyResponse[0].YRWorkDone))
        $("#WNDTyrScore").html(calculateScore(yearlyResponse[0].YRTPlannedScore, yearlyResponse[0].YRWorkDoneOnTime))
        $("#WNDQyrScore").html(calculateScore(yearlyResponse[0].YRQPlannedScore, yearlyResponse[0].YRWorkDoneQuality))

        //$("#avgYrWND").html(calculateScore(yearlyResponse[0].YRPlannedScore, yearlyResponse[0].YRWorkDone))
        //$("#avgYrWNDT").html(calculateScore(yearlyResponse[0].YRPlannedScore, yearlyResponse[0].YRWorkDoneOnTime))
        //$("#avgYrWNDQ").html(calculateScore(yearlyResponse[0].YRPlannedScore, yearlyResponse[0].YRWorkDoneQuality))


        /*   var yearObj = calculateALl(yearlyResponse[0].YRPlannedScore, yearlyResponse[0].YRWorkDone, yearlyResponse[0].YRWorkDoneOnTime, yearlyResponse[0].YRWorkDoneQuality)*/

        //$("#yrPlanned").html("Planned- " + yearObj.Planned)
        //$("#yrActual").html("Actual- " + yearObj.Actual)
        //$("#yrScore").html("% Score " + yearObj.sign + yearObj.Score)


        //$("#allYrSCore").html(yearObj.sign + yearObj.Score)
        //$("#titleYrScore").html(yearObj.sign + yearObj.Actual + "/" + yearObj.Planned);

        var DelWeekResponse = response.data.data.Table3;

        $("#DelWeekWNDPlanned").html(DelWeekResponse[0].DelWkWDPlannedScore)
        $("#DelWeekWNDOTPlanned").html(DelWeekResponse[0].DelWkWDOTPlannedScore)


        $("#DelWeekWNDActual").html(DelWeekResponse[0].DelWkActualWD)
        $("#DelWeekWNDOTActual").html(DelWeekResponse[0].DelWkActualWDOT)

        $("#DelWeekWNDScore").html(calculateScore(DelWeekResponse[0].DelWkWDPlannedScore, DelWeekResponse[0].DelWkActualWD))
        $("#DelWeekWNDOTScore").html(calculateScore(DelWeekResponse[0].DelWkWDOTPlannedScore, DelWeekResponse[0].DelWkActualWDOT))

        console.log(DelWeekResponse);

        var DelYearResponse = response.data.data.Table4;

        $("#DelYearWNDPlanned").html(DelYearResponse[0].DelYRWDPlannedScore)
        $("#DelYearWNDOTPlanned").html(DelYearResponse[0].DelYRWDOTPlannedScore)


        $("#DelYearWNDActual").html(DelYearResponse[0].DelYRActualWD)
        $("#DelYearWNDOTActual").html(DelYearResponse[0].DelYRActualWDOT)

        $("#DelYearWNDScore").html(calculateScore(DelYearResponse[0].DelYRWDPlannedScore, DelYearResponse[0].DelYRActualWD))
        $("#DelYearWNDOTScore").html(calculateScore(DelYearResponse[0].DelYRWDOTPlannedScore, DelYearResponse[0].DelYRActualWDOT))

        console.log(DelYearResponse);


    });
}


function getDateFormat(date) {

    var res = getdatewithoutJson(date);

    var arr = res.split("-");

    var ans = arr[0] + " " + arr[1] + " " + arr[2];

    return ans
}

function getFormattedDate(date) {
    // Remove leading zero if it exists
    var res = getdatewithoutJson(date);

    var arr = res.split("-");

    var day = parseInt(arr[0], 10);

    var month = arr[1];

    var dayStr = day.toString().replace(/^0/, '');

    var suffix = "th";
    if (day === 1 || day === 21 || day === 31) {
        suffix = "st";
    } else if (day === 2 || day === 22) {
        suffix = "nd";
    } else if (day === 3 || day === 23) {
        suffix = "rd";
    }
    return dayStr + suffix + " " + month;

}

function getMonth(date) {

    var res = getdatewithoutJson(date);

    var arr = res.split("-");

    var month = arr[1];

    var year = arr[2];

    return month + " " + year;
}

function getYear(stDate, endDate) {

    var startDt = getdatewithoutJson(stDate);
    var endDt = getdatewithoutJson(endDate);

    var startArr = startDt.split("-");

    var endArr = endDt.split("-");

    var stYear = startArr[2];

    var endYear = endArr[2];

    endYear = endYear.substr(2);

    return stYear + " - " + endYear;

}

function calculateScore(totalScore, doneScore) {

    var total = parseInt(totalScore, 10);

    var done = parseInt(doneScore, 10);

    var score = (total - done) / total * 100;

    score = customRound(score);

    var sign = "-";

    if (done === total) {
        score = 0;
        sign = "";
    }

    if (total == 0) {
        score = 0;
        sign = "";
    }
    else {
        if (done == 0) {
            score = 100;
        }
    }


    return (sign + score);


}

function customRound(number) {
    // Check if the decimal part is greater than or equal to 0.5
    if (number - Math.floor(number) >= 0.5) {
        // Round up to the nearest integer
        return Math.ceil(number);
    } else {
        // Round down to the nearest integer
        return Math.floor(number);
    }
}

function calculateALl(TaskPlanned, wnd, wndt, wndq) {

    TaskPlanned = parseInt(TaskPlanned, 10)
    wnd = parseInt(wnd, 10)
    wndt = parseInt(wndt, 10)
    wndq = parseInt(wndq, 10)

    TaskPlanned = TaskPlanned * 3;

    ActualScore = wnd + wndt + wndq

    var score = (TaskPlanned - ActualScore) / TaskPlanned * 100;

    score = customRound(score);

    var sign = "-";

    if (score === 100) {
        score = 0;
        sign = "";
    }

    if (TaskPlanned == 0) {
        score = 0;
        sign = "";
    }

    var obj = {
        Planned: TaskPlanned,
        Actual: ActualScore,
        Score: score,
        sign: sign
    }

    return obj;


}

