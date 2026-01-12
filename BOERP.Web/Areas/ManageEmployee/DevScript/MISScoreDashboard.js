$(document).ready(function () {


    var obj2 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.MISEmployee,
        manualTableId: ManaulTableEnum.MISEmployee
    }

    LoadMasterDropdownTMS('dldEmployee', obj2, 'All', false, 'All');


    $('#dldEmployee').val('All').trigger('change');

    $('#dldEmployee').prop('disabled', true);


    var obj3 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Branch,
        manualTableId: ManaulTableEnum.Branch
    }

    LoadMasterDropdownTMS('dldBranch', obj3, '', false);



    var obj4 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 7,
        manualTableId: 7
    }

    LoadMasterDropdownTMS('dldYear', obj4, '', false);


    $('#dldBranch').val(1).trigger('change');


    $('#dldWeek, #dldYear').on('change', function () {
        getDashBoardDetails($("#dldWeek").val(), $("#dldYear").val());
    });



    setFinYear(0);


});



function handleFinWeek(ctrl) {
    const selectedValue = parseInt(ctrl.value, 10);

    var obj5 = {
        ParentId: selectedValue,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 8,
        manualTableId: 8
    }
    $("#dldWeek").val('');

    getDashBoardDetails($("#dldWeek").val(), $("#dldYear").val());

    LoadMasterDropdownTMS('dldWeek', obj5, '', false);


}

var FinYear;

var FinWeek;

function setFinYear(id) {
    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/BindHolidayMaster', { id: id }, 'GET', function (response) {
        console.log(response);

        FinYear = response.data.data.Table1[0].FinYear;

        FinWeek = response.data.data.Table2[0].FinWeek;

        $('#dldYear').val(FinYear).trigger('change');
        $('#dldWeek').val(FinWeek).trigger('change');

    });
}

//function getDashBoardDetails(emp_ID, branch_ID, weekId, FinYear) {

//    console.log(emp_ID)

//    if (branch_ID == 'All') {
//        branch_ID = 0;
//    }
//    if (emp_ID == '') {
//        emp_ID = 0;
//    }

//    if (weekId > 0) {
//        weekId = weekId;
//    }
//    else {
//        weekId = 0;
//    }

//    if (FinYear > 0) {
//        FinYear = FinYear;
//    }
//    else {
//        FinYear = 0;
//    }


//    var obj = {
//        EmployeeID: -1,
//        BranchID: -1,
//        WeekId: parseInt(weekId, 10),
//        FInYear: parseInt(FinYear, 10),
//    }

//    console.log(obj)
//    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/AdminDashBoardDetailsGet', obj, 'GET', function (response) {

//        console.log('mis data');

//        console.log(response)
//        //************ ----------- All process for weekly tasks ----------- ***********
//        var weekResponse = response.data.data.Table;

//        console.log(weekResponse);

//        $("#weekNo").html(weekResponse[0].WeekCount)

//        $("#WeekDate").html(getDateFormat(weekResponse[0].WeekStartDate) + ' to ' + getDateFormat(weekResponse[0].WeekEndDate))

//        $("#wkDate").html(getFormattedDate(weekResponse[0].WeekStartDate) + " - " + getFormattedDate(weekResponse[0].WeekEndDate))

//        $("#fromDate").html(ChangeDateFormatToddMMYYY(weekResponse[0].WeekStartDate))
//        $("#toDate").html(ChangeDateFormatToddMMYYY(weekResponse[0].WeekEndDate))



//        $("#WNDweekPlaned").html(weekResponse[0].WkPlannedScore)
//        $("#WNDTweekPlaned").html(weekResponse[0].WkTPlannedScore)
//        $("#WNDQweekPlaned").html(weekResponse[0].WkQPlannedScore)

//        $("#WNDweekActual").html(weekResponse[0].WKWorkDone)
//        $("#WNDTweekActual").html(weekResponse[0].WKWorkDoneOnTime)
//        $("#WNDQweekActual").html(weekResponse[0].WkWorkDoneQuality)

//        $("#WNDweekScore").html(calculateScore(weekResponse[0].WkPlannedScore, weekResponse[0].WKWorkDone))
//        $("#WNDTweekScore").html(calculateScore(weekResponse[0].WkTPlannedScore, weekResponse[0].WKWorkDoneOnTime))
//        $("#WNDQweekScore").html(calculateScore(weekResponse[0].WkQPlannedScore, weekResponse[0].WkWorkDoneQuality))


//        //************ ----------- All process for carry forward tasks ----------- ***********

//        var carryResponse = response.data.data.Table1;

//        $("#carryWND").html(carryResponse[0].WkCPlannedScore)
//        $("#carryWNDT").html(carryResponse[0].WkCTPlannedScore)
//        $("#carryWNDQ").html(carryResponse[0].WkCQPlannedScore)


//        console.log(carryResponse);

//        var yearlyResponse = response.data.data.Table2;

//        console.log(yearlyResponse);

//        $("#yrDate").html(getYear(yearlyResponse[0].YRStartDate, yearlyResponse[0].YREndDate));



//        $("#WNDyrPlanned").html(yearlyResponse[0].YRPlannedScore)
//        $("#WNDTyrPlanned").html(yearlyResponse[0].YRTPlannedScore)
//        $("#WNDQyrPlanned").html(yearlyResponse[0].YRQPlannedScore)

//        $("#WNDyrActual").html(yearlyResponse[0].YRWorkDone)
//        $("#WNDTyrActual").html(yearlyResponse[0].YRWorkDoneOnTime)
//        $("#WNDQyrActual").html(yearlyResponse[0].YRWorkDoneQuality)


//        $("#WNDyrScore").html(calculateScore(yearlyResponse[0].YRPlannedScore, yearlyResponse[0].YRWorkDone))
//        $("#WNDTyrScore").html(calculateScore(yearlyResponse[0].YRTPlannedScore, yearlyResponse[0].YRWorkDoneOnTime))
//        $("#WNDQyrScore").html(calculateScore(yearlyResponse[0].YRQPlannedScore, yearlyResponse[0].YRWorkDoneQuality))

//        //$("#avgYrWND").html(calculateScore(yearlyResponse[0].YRPlannedScore, yearlyResponse[0].YRWorkDone))
//        //$("#avgYrWNDT").html(calculateScore(yearlyResponse[0].YRPlannedScore, yearlyResponse[0].YRWorkDoneOnTime))
//        //$("#avgYrWNDQ").html(calculateScore(yearlyResponse[0].YRPlannedScore, yearlyResponse[0].YRWorkDoneQuality))


//        /*   var yearObj = calculateALl(yearlyResponse[0].YRPlannedScore, yearlyResponse[0].YRWorkDone, yearlyResponse[0].YRWorkDoneOnTime, yearlyResponse[0].YRWorkDoneQuality)*/

//        //$("#yrPlanned").html("Planned- " + yearObj.Planned)
//        //$("#yrActual").html("Actual- " + yearObj.Actual)
//        //$("#yrScore").html("% Score " + yearObj.sign + yearObj.Score)


//        //$("#allYrSCore").html(yearObj.sign + yearObj.Score)
//        //$("#titleYrScore").html(yearObj.sign + yearObj.Actual + "/" + yearObj.Planned);

//        var DelWeekResponse = response.data.data.Table3;

//        $("#DelWeekWNDPlanned").html(DelWeekResponse[0].DelWkWDPlannedScore)
//        $("#DelWeekWNDOTPlanned").html(DelWeekResponse[0].DelWkWDOTPlannedScore)


//        $("#DelWeekWNDActual").html(DelWeekResponse[0].DelWkActualWD)
//        $("#DelWeekWNDOTActual").html(DelWeekResponse[0].DelWkActualWDOT)

//        $("#DelWeekWNDScore").html(calculateScore(DelWeekResponse[0].DelWkWDPlannedScore, DelWeekResponse[0].DelWkActualWD))
//        $("#DelWeekWNDOTScore").html(calculateScore(DelWeekResponse[0].DelWkWDOTPlannedScore, DelWeekResponse[0].DelWkActualWDOT))

//        console.log(DelWeekResponse);

//        var DelYearResponse = response.data.data.Table4;

//        $("#DelYearWNDPlanned").html(DelYearResponse[0].DelYRWDPlannedScore)
//        $("#DelYearWNDOTPlanned").html(DelYearResponse[0].DelYRWDOTPlannedScore)


//        $("#DelYearWNDActual").html(DelYearResponse[0].DelYRActualWD)
//        $("#DelYearWNDOTActual").html(DelYearResponse[0].DelYRActualWDOT)

//        $("#DelYearWNDScore").html(calculateScore(DelYearResponse[0].DelYRWDPlannedScore, DelYearResponse[0].DelYRActualWD))
//        $("#DelYearWNDOTScore").html(calculateScore(DelYearResponse[0].DelYRWDOTPlannedScore, DelYearResponse[0].DelYRActualWDOT))

//        console.log(DelYearResponse);

//        var fmsWeekRes = response.data.data.Table5;

//        $('#planned_fms_wk').html(fmsWeekRes[0].WeightageWorkAssigned);
//        $('#actual_fms_week').html(fmsWeekRes[0].TotalWorkDone);

//        $('#planned_fms_wt_wk').html(fmsWeekRes[0].TotalWorkDone);
//        $('#actual_fms_wt_wk').html(fmsWeekRes[0].TotalWorkDoneOnTime);


//        $('#perc_fms_week').html(calculateScore(fmsWeekRes[0].WeightageWorkAssigned, fmsWeekRes[0].TotalWorkDone));
//        $('#perc_fms_wt_wk').html(calculateScore(fmsWeekRes[0].TotalWorkDone, fmsWeekRes[0].TotalWorkDoneOnTime));


//        var fmsYearRes = response.data.data.Table6;

//        console.log('fms Year');
//        console.log(fmsYearRes);

//        $('#planned_fms_yr').html(fmsYearRes[0].WeightageWorkAssignedYr);
//        $('#actual_fms_yr').html(fmsYearRes[0].TotalWorkDoneYr);

//        $('#planned_fms_wt_yr').html(fmsYearRes[0].TotalWorkDoneYr);
//        $('#actual_fms_wt_yr').html(fmsYearRes[0].TotalWorkDoneOnTimeYr);

//        $('#perc_fms_yr').html(calculateScore(fmsYearRes[0].WeightageWorkAssignedYr, fmsYearRes[0].TotalWorkDoneYr));
//        $('#perc_fms_wt_yr').html(calculateScore(fmsYearRes[0].TotalWorkDoneYr, fmsYearRes[0].TotalWorkDoneOnTimeYr));





//    });
//}
var gridOptions = null;
//function bindEmpfilterGrid() {

//    let filterData = rowData;

//    var Employee = $("#dldEmployee").val() === 'Select' ? '' : $('#dldEmployee').val();

//    if (Employee != '') {
//        filterData = filterData.filter(row => row.id == Employee);
//    }
//    else {
//        filterData = rowData;
//    }

//    if (gridOptions != null) {
//        gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);
//    }

//}

var rowData = [];

document.addEventListener('DOMContentLoaded', function () {
    getDashBoardDetailsOnLoad(0, 0);
})

function getDashBoardDetailsOnLoad(weekId, FinYear) {



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
        EmployeeID: -1,
        BranchID: -1,
        WeekId: parseInt(weekId, 10),
        FInYear: parseInt(FinYear, 10),
    }

   //  $("#dldEmployee").val('All').trigger('change');

    console.log(obj)
    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/AdminDashBoardDetailsGet', obj, 'GET', function (response) {

        $('#myGrid').html('');

        console.log('response');
        console.log(response);
        var weekResponse = response.data.data.Table;


        $("#weekNo").html('Week No. ' + weekResponse[0].WeekCount)

        $("#WeekDate").html(getDateFormat(weekResponse[0].WeekStartDate) + ' to ' + getDateFormat(weekResponse[0].WeekEndDate))

        $("#wkDate").html(getFormattedDate(weekResponse[0].WeekStartDate) + " - " + getFormattedDate(weekResponse[0].WeekEndDate))

        $("#fromDate").html(ChangeDateFormatToddMMYYY(weekResponse[0].WeekStartDate))
        $("#toDate").html(ChangeDateFormatToddMMYYY(weekResponse[0].WeekEndDate))

        $('#user').html(weekResponse[0].Login_Name);


        var tmsData = response.data.data.Table;
        var prev_tmsData = response.data.data.Table1;

        var delData = response.data.data.Table2;
        var prev_delData = response.data.data.Table3;

        var fmsData = response.data.data.Table4;
        var prev_fmsData = response.data.data.Table5;

        var len = tmsData.length;


        if (tmsData.length != len || prev_tmsData.length != len || delData.length != len || prev_delData.length != len || fmsData.length != len || prev_fmsData.length != len) {
            FailToaster('Length of tho. of employees doer not match!!!! Please see the score procedure!!!');
            return;
        }

        rowData = [];
        for (let i = 0; i < len; i++) {

            const emp_name = tmsData[i].emp_name;

            const role = tmsData[i].UserType;

            const TotalScore = tmsData[i].WkPlannedScore + tmsData[i].WKWorkDone + tmsData[i].WkQPlannedScore +
                delData[i].DelWkWDPlannedScore + delData[i].DelWkActualWD + fmsData[i].WeightageWorkAssigned + fmsData[i].TotalWorkDone;

            const TotalWorkDoneScore = tmsData[i].WKWorkDone + tmsData[i].WKWorkDoneOnTime
                + tmsData[i].WkWorkDoneQuality
                + delData[i].DelWkActualWD
                + delData[i].DelWkActualWDOT + fmsData[i].TotalWorkDone + fmsData[i].TotalWorkDoneOnTime

            const prev_TotalScore = prev_tmsData[i].WkPlannedScore + prev_tmsData[i].WKWorkDone + prev_tmsData[i].WkQPlannedScore +
                prev_delData[i].DelWkWDPlannedScore + prev_delData[i].DelWkActualWD + prev_fmsData[i].WeightageWorkAssigned + prev_fmsData[i].TotalWorkDone;

            const prev_TotalWorkDoneScore = prev_tmsData[i].WKWorkDone + prev_tmsData[i].WKWorkDoneOnTime
                + prev_tmsData[i].WkWorkDoneQuality
                + prev_delData[i].DelWkActualWD
                + prev_delData[i].DelWkActualWDOT + prev_fmsData[i].TotalWorkDone + prev_fmsData[i].TotalWorkDoneOnTime


            const FinalScore = TotalScore == 0 ? 0 : ((TotalScore - TotalWorkDoneScore) / TotalScore * 100).toFixed(2);

            const prev_FinalScore = prev_TotalScore == 0 ? 0 : ((prev_TotalScore - prev_TotalWorkDoneScore) / prev_TotalScore * 100).toFixed(2);

            //  const FinalScore = TotalScore == 0 ? 0 : 100 - ScoreDiff;

            console.log('employee');
            console.log(emp_name);
            console.log(`TotalScore: ${TotalScore}, TotalWorkDoneScore: ${TotalWorkDoneScore}`);

            const tasks = {
                t: tmsData[i].WkPlannedScore,
                nd: (tmsData[i].WkPlannedScore - tmsData[i].WKWorkDone),
                dl: (tmsData[i].WkTPlannedScore - tmsData[i].WKWorkDoneOnTime)
            }

            const del = {
                t: delData[i].DelWkWDPlannedScore,
                nd: (delData[i].DelWkWDPlannedScore - delData[i].DelWkActualWD),
                dl: (delData[i].DelWkWDOTPlannedScore - delData[i].DelWkActualWDOT)
            }

            const fms = {
                t: fmsData[i].WeightageWorkAssigned,
                nd: (fmsData[i].WeightageWorkAssigned - fmsData[i].TotalWorkDone),
                dl: (fmsData[i].TotalWorkDone - fmsData[i].TotalWorkDoneOnTime)
            }

            const rowObj = {
                id: tmsData[i].id,
                name: emp_name,
                role: '',
                tasks: tasks,
                del: del,
                fms: fms,
                score: FinalScore == 0 ? 0 : -FinalScore,
                prevscore: prev_FinalScore == 0 ? 0 : -prev_FinalScore
            }

            rowData.push(rowObj);

        }

        if (weekResponse[0].IsUser == 1) {
            rowData = rowData.filter(input => input.id == weekResponse[0].LoginId);

            $('#dldEmployee').val(weekResponse[0].LoginId).trigger('change');
        }

        if (gridOptions != null) {
            gridOptions.api.setRowData(rowData);
            return;
        }

        //rowData = [
        //    { name: "Sneha Joshi (BOINTL001)", role: "SEO manager", tasks: { t: 25, nd: 4, dl: 3 }, del: { t: 25, nd: 4, dl: 3 }, fms: { t: 25, nd: 4, dl: 3 }, score: -25 },
        //    { name: "Bhavna Goyal (BOINTL002)", role: "Sales Manager", tasks: { t: 30, nd: 2, dl: 0 }, del: { t: 25, nd: 4, dl: 3 }, fms: { t: 25, nd: 4, dl: 3 }, score: -25 },
        //    { name: "Ramesh Gupta  (BOINTL003)", role: "Chemist", tasks: { t: 20, nd: 5, dl: 1 }, del: { t: 25, nd: 4, dl: 3 }, fms: { t: 25, nd: 4, dl: 3 }, score: -25 },
        //    { name: "Sunil Bhadouriya  (BOINTL004)", role: "Sales Executive", tasks: { t: 30, nd: 4, dl: 3 }, del: { t: 25, nd: 4, dl: 3 }, fms: { t: 25, nd: 4, dl: 3 }, score: -25 },
        //    { name: "Rahul Choudhary  (BOINTL005)", role: "Chemist", tasks: { t: 20, nd: 8, dl: 5 }, del: { t: 25, nd: 4, dl: 3 }, fms: { t: 25, nd: 4, dl: 3 }, score: -25 },
        //    { name: "Amardeep Singh  (BOINTL006)", role: "R & D Manager", tasks: { t: 30, nd: 2, dl: 0 }, del: { t: 25, nd: 4, dl: 3 }, fms: { t: 25, nd: 4, dl: 3 }, score: -25 },
        //    { name: "M. S. Subramaniam   (BOINTL007)", role: "Operations Manager", tasks: { t: 25, nd: 4, dl: 3 }, del: { t: 25, nd: 4, dl: 3 }, fms: { t: 25, nd: 4, dl: 3 }, score: 0 },
        //    { name: "Hillery Moses  (BOINTL008)", role: "Office Coordinator", tasks: { t: 25, nd: 1, dl: 1 }, del: { t: 25, nd: 4, dl: 3 }, fms: { t: 25, nd: 4, dl: 3 }, score: -25 },
        //    { name: "Kailash Chaurasia  (BOINTL009)", role: "Purchase Executive", tasks: { t: 20, nd: 2, dl: 0 }, del: { t: 25, nd: 4, dl: 3 }, fms: { t: 25, nd: 4, dl: 3 }, score: -25 },
        //    { name: "Jayshri Tiwari   (BOINTL010)", role: "—", tasks: { t: 20, nd: 3, dl: 0 }, del: { t: 25, nd: 4, dl: 3 }, fms: { t: 25, nd: 4, dl: 3 }, score: -0 },
        //    { name: "Anita Sharma  (BOINTL011)", role: "QA Lead", tasks: { t: 28, nd: 1, dl: 1 }, del: { t: 25, nd: 2, dl: 1 }, fms: { t: 25, nd: 3, dl: 2 }, score: -0 },
        //    { name: "Vikas Patel  (BOINTL012)", role: "Ops Supervisor", tasks: { t: 26, nd: 3, dl: 2 }, del: { t: 25, nd: 2, dl: 2 }, fms: { t: 25, nd: 5, dl: 4 }, score: 0 }
        //];

        /* ---------- Score badge (single, authoritative) ---------- */
        function scoreBadge(value) {
            if (value == null || value === '') return '';
            const v = Number(value);
            let cls = 'sb pos';               // default for > 0
            if (v === 0) cls = 'sb zero';     // 0 -> green badge, dark green text
            else if (v < 0) cls = 'sb neg';   // negative -> red badge
            return `<span class="sb ${cls}">${v}</span>`;
        }

        /* ---------- Heat helpers ---------- */
        const heatColor = t => {            // t in [0..1], good->bad
            const h = 140 - (140 - 8) * t, s = 75, l = 96 - 10 * t;
            return `hsl(${h} ${s}% ${l}%)`;
        };
        let heatMax = 1;
        const heatStyle = v => {
            if (v == null) return null;
            const t = Math.max(0, Math.min(1, v / Math.max(1, heatMax)));
            // /return { backgroundColor: heatColor(t) };
        };


        //
        // custom header that preserves <br/>
        const FinalScore = function () { };
        FinalScore.prototype.init = function (params) {
            const e = document.createElement('div');
            e.className = 'hdr-center';
            e.innerHTML = params.column.getColDef().headerName; // keep <br/>
            this.eGui = e;
        };
        FinalScore.prototype.getGui = function () { return this.eGui; };


        // Last Week  Final Score
        const BrHeader = function () { };
        BrHeader.prototype.init = function (params) {
            const e = document.createElement('div');
            e.className = 'hdr-center';
            e.innerHTML = params.column.getColDef().headerName; // keeps <br/>
            this.eGui = e;
        };
        BrHeader.prototype.getGui = function () { return this.eGui; };


        /* ---------- Column defs with groups ---------- */
        const columnDefs = [
            {
                headerName: "Employee Name & Department",
                field: "name",
                pinned: "left",
                minWidth: 250, flex: 1.2,
                sortable: true,
                comparator: (a, b) => (a || '').localeCompare(b || '', undefined, { sensitivity: 'base' }),
                filter: 'agTextColumnFilter',
                floatingFilter: true,
                filterParams: { defaultOption: 'contains', debounceMs: 200 },
                cellRenderer: params => `
      <div class="emp">
        <div>
          <div class="name">${params.data.name}</div>
          <div class="role">${params.data.role || ""}</div>
        </div>
      </div>
    `
            },
            {
                headerName: "Tasks", marryChildren: true,
                children: [
                    { headerName: "Total Tasks", field: "tasks.t", minWidth: 80, type: 'numericCol' },
                    { headerName: "Tasks Not Done", field: "tasks.nd", colId: 'tasksNd', minWidth: 115, type: 'numericCol', cellStyle: p => heatStyle(p.value) },
                    { headerName: "Delayed Tasks", field: "tasks.dl", colId: 'tasksDl', minWidth: 100, type: 'numericCol', cellStyle: p => heatStyle(p.value) },
                ]
            },
            {
                headerName: "Delegation", marryChildren: true,
                children: [
                    { headerName: "Total Tasks", field: "del.t", minWidth: 90, type: 'numericCol' },
                    { headerName: "Tasks Not Done", field: "del.nd", colId: 'delNd', minWidth: 115, type: 'numericCol', cellStyle: p => heatStyle(p.value) },
                    { headerName: "Delayed Tasks", field: "del.dl", colId: 'delDl', minWidth: 100, type: 'numericCol', cellStyle: p => heatStyle(p.value) },
                ]
            },
            {
                headerName: "FMS", marryChildren: true,
                children: [
                    { headerName: "Total Tasks", field: "fms.t", minWidth: 85, type: 'numericCol' },
                    { headerName: "Tasks Not Done", field: "fms.nd", colId: 'fmsNd', minWidth: 115, type: 'numericCol', cellStyle: p => heatStyle(p.value) },
                    { headerName: "Delayed Tasks", field: "fms.dl", colId: 'fmsDl', minWidth: 105, type: 'numericCol', cellStyle: p => heatStyle(p.value) },
                ]
            },

            {
                headerName: 'Final<br />Score',
                headerComponent: FinalScore,
                headerClass: 'hdr-center',
                field: 'score',
                pinned: 'right',
                minWidth: 50,
                tooltipField: 'score',
                sortable: false,
                filter: false,
                cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                cellRenderer: p => scoreBadge(p.value)
            },

            {
                headerName: 'Last Week <br /> Final Score',
                headerComponent: BrHeader,
                headerClass: 'hdr-center',
                field: 'prevscore',
                pinned: 'right',
                minWidth: 90,
                cellRenderer: p => scoreBadge(p.value),
                sortable: false, filter: false,
                cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
            }
        ];

        /* ---------- Grid options ---------- */
        gridOptions = {
            columnDefs,
            rowData,
            pagination: true,
            paginationPageSize: 10,
            enableBrowserTooltips: false,

            // NO filters for numeric columns
            columnTypes: {
                numericCol: {
                    filter: false,
                    suppressMenu: true,
                    cellClass: 'ag-right-aligned-cell',
                    valueParser: p => Number(p.newValue)
                }
            },

            // Disable filters and menus globally unless overridden
            defaultColDef: {
                resizable: true,
                sortable: false,
                filter: false,
                floatingFilter: false,
                suppressMenu: true,
                tooltipField: 'value'
            },


            icons: {
                previous: '<i class="fa fa-angle-left"></i>',
                next: '<i class="fa fa-angle-right"></i>',
                first: '<i class="fa fa-angle-double-left"></i>',
                last: '<i class="fa fa-angle-double-right"></i>'
            },

            overlayNoRowsTemplate: '<span style="padding: 10px; display: block; text-align: center;">No data found</span>',

            onGridReady(params) {
                if (window.innerWidth > 768) params.api.sizeColumnsToFit();
                buildCustomPager();
                refreshMetricsAndHeat();
            },

            onFirstDataRendered() { refreshMetricsAndHeat(); },
            onFilterChanged() { handleNoRowsOverlay(); refreshMetricsAndHeat(); },
            onSortChanged() { refreshMetricsAndHeat(); },
            onModelUpdated() { handleNoRowsOverlay(); refreshMetricsAndHeat(); },
            onPaginationChanged() { refreshMetricsAndHeat(); }
        };

        /* ---------- Init Grid ---------- */
        new agGrid.Grid(document.getElementById('myGrid'), gridOptions);

        /* ---------- Global search (quick filter across all columns) ---------- */
        //document.getElementById('globalSearch').addEventListener('input', function () {
        //    gridOptions.api.setQuickFilter(this.value);
        //});

        /* ---------- Responsive column fit ---------- */
        const ro = new ResizeObserver(() => {
            if (gridOptions.api && window.innerWidth > 768) gridOptions.api.sizeColumnsToFit();
        });
        ro.observe(document.body);

        /* ---------- Pager UI (page size + goto) ---------- */
        function buildCustomPager() {
            const pagingPanel = document.querySelector('.ag-paging-panel');
            if (!pagingPanel) return;

            const existingChildren = Array.from(pagingPanel.children);

            const pageSizeSelector = document.createElement('div');
            pageSizeSelector.className = 'ag-page-size';
            pageSizeSelector.innerHTML = `
    Rows per page:
    <select id="ag-page-size">
      <option value="10" selected>10</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
  `;

            const paginationControls = existingChildren.find(child =>
                child.querySelector && child.querySelector('.ag-paging-button')
            );

            const pagingSummary = existingChildren.find(child =>
                child.classList && child.classList.contains('ag-paging-row-summary-panel')
            );

            const goToControls = document.createElement('div');
            goToControls.className = 'ag-page-goto';
            goToControls.innerHTML = `
    Go to page:
    <input type="number" id="ag-goto-page" class="text-center" min="1" placeholder="0" />
    <button id="ag-goto-btn">Go</button>
  `;

            pagingPanel.innerHTML = '';
            pagingPanel.appendChild(pageSizeSelector);
            if (paginationControls) pagingPanel.appendChild(paginationControls);
            if (pagingSummary) pagingPanel.appendChild(pagingSummary);
            pagingPanel.appendChild(goToControls);

            document.getElementById('ag-page-size').addEventListener('change', function () {
                gridOptions.api.paginationSetPageSize(Number(this.value));
            });

            document.getElementById('ag-goto-btn').addEventListener('click', function () {
                const input = document.getElementById('ag-goto-page');
                const page = Number(input.value) - 1;
                const totalPages = gridOptions.api.paginationGetTotalPages();
                if (!isNaN(page) && page >= 0 && page < totalPages) {
                    gridOptions.api.paginationGoToPage(page);
                } else {
                    // Uses Bootstrap modal if present
                    const el = document.getElementById('alertModalMessage');
                    if (el) el.textContent = `Enter valid page number (1 - ${totalPages})`;
                    if (window.$ && $('#alertModal').modal) $('#alertModal').modal('show');
                    else alert(`Enter valid page number (1 - ${totalPages})`);
                }
            });

            const gotoInput = document.getElementById('ag-goto-page');
            gotoInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    document.getElementById('ag-goto-btn').click();
                }
            });
        }

        /* ---------- Overlay if no rows after filter ---------- */
        function handleNoRowsOverlay() {
            const rowCount = gridOptions.api.getDisplayedRowCount();
            if (rowCount === 0) gridOptions.api.showNoRowsOverlay();
            else gridOptions.api.hideOverlay();
        }

        /* ---------- KPI + Heat refresh ---------- */
        function refreshMetricsAndHeat() {
            const current = [];
            gridOptions.api.forEachNodeAfterFilterAndSort(n => current.push(n.data));

            // Heat scale max from "bad" columns across the filtered dataset
            heatMax = Math.max(1, ...current.flatMap(r => [
                r?.tasks?.nd, r?.tasks?.dl, r?.del?.nd, r?.del?.dl, r?.fms?.nd, r?.fms?.dl
            ].map(x => Number(x || 0))));

            // Force refresh of heat cells
            gridOptions.api.refreshCells({
                force: true,
                columns: ['tasksNd', 'tasksDl', 'delNd', 'delDl', 'fmsNd', 'fmsDl']
            });

            // KPIs
            const avg = Math.round(current.reduce((s, r) => s + Number(r.score || 0), 0) / Math.max(1, current.length));
            const delayed = current.reduce((s, r) => s + Number(r.tasks?.dl || 0) + Number(r.del?.dl || 0) + Number(r.fms?.dl || 0), 0);
            const allTasks = current.reduce((s, r) => s + Number(r.tasks?.t || 0) + Number(r.del?.t || 0) + Number(r.fms?.t || 0), 0);
            const ontime = Math.max(0, Math.min(100, Math.round(100 - (delayed / Math.max(1, allTasks)) * 100)));

            const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

            setText('kpiAvg', isFinite(avg) ? avg : '–');
            setText('kpiOnTime', ontime + '%');
            setText('kpiDelayed', delayed);
            setText('kpiEmp', current.length);

            // Show "no rows" overlay if filtered empty
            handleNoRowsOverlay();
        }

        $(document).ready(function () {
            $('.datepicker').daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                autoApply: true,
                autoUpdateInput: false,
                drops: 'auto',
                opens: 'right',
                parentEl: 'body',
                locale: { format: 'DD/MM/YYYY' }
            })

                // ✅ Apply selected date
                .on('apply.daterangepicker', function (ev, picker) {
                    $(this).val(picker.startDate.format('DD/MM/YYYY'));
                    $(this).siblings('.clear-date').show(); // Show × icon
                })

                // ✅ Adjust popup to fit screen height
                .on('show.daterangepicker', function (ev, picker) {
                    let $popup = picker.container;
                    let winHeight = $(window).height();
                    let winWidth = $(window).width();

                    // 1. Max height (90% of viewport)
                    let maxHeight = winHeight * 0.9;
                    if ($popup.outerHeight() > maxHeight) {
                        $popup.css({
                            'max-height': maxHeight + 'px',
                            'overflow-y': 'auto',
                            'overflow-x': 'hidden'
                        });
                    } else {
                        $popup.css({
                            'max-height': '',
                            'overflow-y': '',
                            'overflow-x': ''
                        });
                    }

                    // 2. Position popup
                    let inputOffset = $(this).offset();
                    let popupHeight = $popup.outerHeight();
                    let popupWidth = $popup.outerWidth();
                    let topPosition = inputOffset.top + $(this).outerHeight() + 4;
                    let leftPosition = inputOffset.left;

                    // Small screen → open in center
                    if (winHeight < 500) {
                        topPosition = (winHeight - popupHeight) / 2;
                        leftPosition = (winWidth - popupWidth) / 2;
                    } else if (topPosition + popupHeight > winHeight) {
                        // Move up if bottom is cut off
                        topPosition = winHeight - popupHeight - 20;
                        if (topPosition < 20) topPosition = 20;
                    }

                    // Apply final position
                    $popup.css({
                        'position': 'fixed',
                        'top': topPosition + 'px',
                        'left': leftPosition + 'px',
                        'z-index': 99999
                    });
                });

            // ✅ Open calendar when clicking the calendar icon
            $('.dateicon').on('click', function () {
                $(this).closest('.input-group').find('.datepicker').trigger('click');
            });

            // ✅ Clear button → reset date
            $('.clear-date').on('click', function () {
                const $input = $(this).siblings('.datepicker');
                $input.val('');
                $(this).hide();
            });

            // ✅ Auto-close on scroll or resize
            $(window).on('resize scroll wheel', function () {
                $('.datepicker').each(function () {
                    const drp = $(this).data('daterangepicker');
                    if (drp && drp.isShowing) drp.hide();
                });
            });
        });


    });
}
function getDashBoardDetails(weekId, FinYear) {

   

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
        EmployeeID: -1,
        BranchID: -1,
        WeekId: parseInt(weekId, 10),
        FInYear: parseInt(FinYear, 10),
    }

    // $("#dldEmployee").val('Select').trigger('change');

    console.log(obj)
    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/AdminDashBoardDetailsGet', obj, 'GET', function (response) {

        
        console.log(response);
        var weekResponse = response.data.data.Table;


                $("#weekNo").html('Week No. ' +  weekResponse[0].WeekCount)

                $("#WeekDate").html(getDateFormat(weekResponse[0].WeekStartDate) + ' to ' + getDateFormat(weekResponse[0].WeekEndDate))

                $("#wkDate").html(getFormattedDate(weekResponse[0].WeekStartDate) + " - " + getFormattedDate(weekResponse[0].WeekEndDate))

                $("#fromDate").html(ChangeDateFormatToddMMYYY(weekResponse[0].WeekStartDate))
                $("#toDate").html(ChangeDateFormatToddMMYYY(weekResponse[0].WeekEndDate))


        var tmsData = response.data.data.Table;
        var prev_tmsData = response.data.data.Table1;

        var delData = response.data.data.Table2;
        var prev_delData = response.data.data.Table3;

        var fmsData = response.data.data.Table4;
        var prev_fmsData = response.data.data.Table5;

        var len = tmsData.length;


        if (tmsData.length != len || prev_tmsData.length != len || delData.length != len || prev_delData.length != len || fmsData.length != len || prev_fmsData.length != len) {
            FailToaster('Length of tho. of employees doer not match!!!! Please see the score procedure!!!');
            return;
        }

        rowData = [];
        for (let i = 0; i < len; i++) {

            const emp_name = tmsData[i].emp_name;

            const role = tmsData[i].UserType;

            const TotalScore = tmsData[i].WkPlannedScore + tmsData[i].WKWorkDone +  tmsData[i].WkQPlannedScore +
                delData[i].DelWkWDPlannedScore + delData[i].DelWkActualWD + fmsData[i].WeightageWorkAssigned + fmsData[i].TotalWorkDone;

            const TotalWorkDoneScore = tmsData[i].WKWorkDone + tmsData[i].WKWorkDoneOnTime
                + tmsData[i].WkWorkDoneQuality
                + delData[i].DelWkActualWD
                + delData[i].DelWkActualWDOT + fmsData[i].TotalWorkDone + fmsData[i].TotalWorkDoneOnTime

            const prev_TotalScore = prev_tmsData[i].WkPlannedScore + prev_tmsData[i].WKWorkDone + prev_tmsData[i].WkQPlannedScore +
                prev_delData[i].DelWkWDPlannedScore + prev_delData[i].DelWkActualWD + prev_fmsData[i].WeightageWorkAssigned + prev_fmsData[i].TotalWorkDone;

            const prev_TotalWorkDoneScore = prev_tmsData[i].WKWorkDone + prev_tmsData[i].WKWorkDoneOnTime
                + prev_tmsData[i].WkWorkDoneQuality
                + prev_delData[i].DelWkActualWD
                + prev_delData[i].DelWkActualWDOT + prev_fmsData[i].TotalWorkDone + prev_fmsData[i].TotalWorkDoneOnTime


            const FinalScore = TotalScore == 0 ? 0 : ((TotalScore - TotalWorkDoneScore) / TotalScore * 100).toFixed(2);

            const prev_FinalScore = prev_TotalScore == 0 ? 0 : ((prev_TotalScore - prev_TotalWorkDoneScore) / prev_TotalScore * 100).toFixed(2);

          //  const FinalScore = TotalScore == 0 ? 0 : 100 - ScoreDiff;

            console.log('employee');
            console.log(emp_name);
            console.log(`TotalScore: ${TotalScore}, TotalWorkDoneScore: ${TotalWorkDoneScore}`);

            const tasks = {
                t: tmsData[i].WkPlannedScore,
                nd: (tmsData[i].WkPlannedScore - tmsData[i].WKWorkDone),
                dl: (tmsData[i].WkTPlannedScore - tmsData[i].WKWorkDoneOnTime)
            }

            const del = {
                t: delData[i].DelWkWDPlannedScore,
                nd: (delData[i].DelWkWDPlannedScore - delData[i].DelWkActualWD),
                dl: (delData[i].DelWkWDOTPlannedScore - delData[i].DelWkActualWDOT)
            }

            const fms = {
                t: fmsData[i].WeightageWorkAssigned,
                nd: (fmsData[i].WeightageWorkAssigned - fmsData[i].TotalWorkDone),
                dl: (fmsData[i].TotalWorkDone - fmsData[i].TotalWorkDoneOnTime)
            }

            const rowObj = {
                id: tmsData[i].id,
                name: emp_name,
                role: '',
                tasks: tasks,
                del: del,
                fms: fms,
                score: FinalScore == 0 ? 0 : -FinalScore,
                prevscore: prev_FinalScore == 0 ? 0 : -prev_FinalScore
            }

            rowData.push(rowObj);

        }

        if (weekResponse[0].IsUser == 1) {
            rowData = rowData.filter(input => input.id == weekResponse[0].LoginId);

            $('#dldEmployee').val(weekResponse[0].LoginId).trigger('change');

        }



        if (gridOptions != null) {
            gridOptions.api.setRowData(rowData);
            return;
        }


     

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

document.getElementById("exportExcel").addEventListener("click", () => {
    gridOptions.api.exportDataAsCsv({
        fileName: `MISScoreData_${$('#wkDate').html()}.csv`,
        // Turn header HTML into a plain, readable string
        processHeaderCallback: params => {
            // prefer a custom plain header if you added it, else use headerName
            const def = params.column.getColDef();
            const raw = def.headerPlain || def.headerName || def.colId || '';
            // strip tags and convert <br> to space
            return raw
                .toString()
                .replace(/<br\s*\/?>/gi, ' ')
                .replace(/<\/?[^>]+(>|$)/g, '')   // strip any other HTML tags
                .replace(/\s+/g, ' ')
                .trim();
        }
    });
});



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
