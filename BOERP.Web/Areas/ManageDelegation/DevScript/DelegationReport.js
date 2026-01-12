$(document).ready(function () {



    $(function () {
        $('.datepickersecond').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "dd-mm-yy",
            yearRange: "-20:+10"
        });

    });
    

    var obj2 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Employee,
        manualTableId: ManaulTableEnum.Employee
    }

    var obj4 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Creater,
        manualTableId: ManaulTableEnum.Creater
    }


    LoadMasterDropdownTMS('ddlDoer', obj2, 'All', false);
    LoadMasterDropdownTMS('ddlCreatedBy', obj4, 'All', false);

    var obj3 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Branch,
        manualTableId: ManaulTableEnum.Branch
    }



    LoadMasterDropdownTMS('ddlBranch', obj3, 'All', false);


    GetDelegationReport();


  



});

function GetDelegationReport() {

    var obj = {
        CreatedBy: $('#ddlCreatedBy').val() == 'All' ? null : $('#ddlCreatedBy').val(),
        Doer: $('#ddlDoer').val() == 'All' ? null : $('#ddlDoer').val() ,
        Branch: $('#ddlBranch').val() == 'All' ? null : $('#ddlBranch').val(),
        FromDate: ChangeDateFormat($('#fromDate').val()),
        ToDate: ChangeDateFormat($('#toDate').val()),
        Status: $('#Status').val() == 'All' ? null : $('#Status').val(),
    }

    var TableID = 'DelReport';
    CommonAjaxMethodTMS(virtualPath + 'DelegationTransaction/GetDelegationReport', obj, 'GET', function (response) {
        console.log(response);

        var tData = response.data.data.Table1;

        var table = $('#DelReport').DataTable({
            "processing": true, // show progress bar
            "destroy": true,
            "info": false,
            "lengthChange": false,
            "pageLength": 10, // Set initial page length to 10
            "bFilter": false,
            "bSort": false,
            "data": response.data.data.Table,
            "stateSave": true, // Enable state saving
            "columns": [
                { "data": "DelId" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + row.DelName + "' title=''>" + row.DelName + "</p>";
                    }
                },
                { "data": "DelegatedBy" },
                { "data": "Doer" },
                { "data": "ApprovalAuthority" },
                { "data": "EA" },
                { "data": "Branch" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        if (row.DueDateF != null) {
                            return "<label>" + getdatewithoutJson(row.DueDateF) + "</label>";
                        }
                        else {
                            return "<label></label>";
                        }
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        if (row.StartDate1) {
                            return "<label class='green-clr' >" + getdatewithoutJson(row.StartDate1) + "</label>";
                        }
                        else {
                            return "<label></label>";
                        }
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        if (row.StartDate2) {
                            return "<label class='yellow-clr'  >" + getdatewithoutJson(row.StartDate2) + "</label>";
                        }
                        else {
                            return "<label></label>";
                        }
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        if (row.StartDate3 != null) {

                            return "<label class='red-clr'  >" + getdatewithoutJson(row.StartDate3) + "</label>";
                        }
                        else {
                            return "<label></label>";
                        }
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {


                        if (row.CreatedBy == "Total") {
                            return "<strong>Total</strong>";
                        }
                        else {
                            return "<label>" + row.CreatedBy + "</label>";;
                        }
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        
                        if(row.CreatedBy == "Total") {
                            return "<strong>" + tData[0].TotalPlanned + "</strong>";
                        }
                            if (row.Weightage != null) {
                                return "<div  >" + row.Weightage + "</div>";
                            }
                            else {
                                return "<div>0</div>";
                            }

                          
                        }
                 },
                    {
                        "orderable": true,
                        data: null, render: function (data, type, row) {


                            if (row.CreatedBy == "Total") {
                                return "<strong>" + tData[0].TotalWND + "</strong>";
                            }


                            if (row.ActualWD != null) {
                                return "<div >" + row.ActualWD + "</div>";
                            }
                            else {
                                return "<div>0</div>";
                            }


                        }
                    },
                    {
                        "orderable": true,
                        data: null, render: function (data, type, row) {
                            if (row.ActualWD != null) {

                                if (row.CreatedBy == "Total") {
                                    return "<strong>" + tData[0].PlannedTime + "</strong>";
                                }

                                return "<div >" + row.WeightageTime + "</div>";
                            }
                            else {
                                return "<div>0</div>";
                            }


                        }
                    },
                    {
                        "orderable": true,
                        data: null, render: function (data, type, row) {
                            if (row.ActualWDOT != null) {

                                if (row.CreatedBy == "Total") {
                                    return "<strong>" + tData[0].TotalWNDT + "</strong>";
                                }

                                return "<div >" + row.ActualWDOT + "</div>";
                            }
                            else {
                                return "<div>0</div>";
                            }


                        }
                    },              
                    { "data": "Status" },
                    {
                        "orderable": true,
                        data: null, render: function (data, type, row) {
                            if (row.DoerDoneDate) {
                                return "<label>" + getdatewithoutJson(row.DoerDoneDate) + "</label>";
                            }
                            else {
                                return "<label></label>";
                            }
                        }
                    },
                ]
            });

        table.row.add({
            "DelId": '',
            "DelName": '',
            "DelegatedBy": '',
            "Doer": '',
            "ApprovalAuthority": '',
            "EA": '',
            "Branch": '',
            "DueDateF": null,
            "StartDate1": null,
            "StartDate2": null,
            "StartDate3": null,
            "CreatedBy": "Total",
            "Weightage":  tData[0].TotalPlanned ,
            "ActualWD": tData[0].TotalWND ,
            "WeightageTime": tData[0].PlannedTime,
            "ActualWDOT": tData[0].TotalWNDT,
            "Status": '',
            "DoerDoneDate": null
        }).draw();

        // Initialize tooltips for the initial set of rows
        $('[data-toggle="tooltip"]').tooltip();

        TableSetup(table);
        // Re-initialize tooltips every time the table is redrawn
        table.on('draw.dt', function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
        });

}

function ClearDelReport() {

    window.location.href = 'DelegationDashboard?auth' + AuthToken;
}

document.getElementById('exportButton').addEventListener('click', function () {
    var table = $('#DelReport').DataTable();
    var data = table.data().toArray();

    // Define a function to convert the date if necessary
    function formatDate(dateStr) {
        if (!dateStr) return '';
        var date = new Date(dateStr);
        return date.toLocaleDateString();
    }

    var formattedData = data.map(row => ({
        DelId: row.DelId,
        DelName: row.DelName,
        DelegatedBy: row.DelegatedBy,
        Doer: row.Doer,
        ApprovalAuthority: row.ApprovalAuthority,
        EA: row.EA,
        Branch: row.Branch,
        DelDate: formatDate(row.DelDate),
        StartDate1: formatDate(row.StartDate1),
        StartDate2: formatDate(row.StartDate2),
        StartDate3: formatDate(row.StartDate3),
        CreatedBy: row.CreatedBy,
        Weightage: row.Weightage,
        ActualWD: row.ActualWD,
        WeightageTime: row.WeightageTime,
        ActualWDOT: row.ActualWDOT,
        Status: row.Status,
        DoerDoneDate: formatDate(row.DoerDoneDate)
    }));

    var ws = XLSX.utils.json_to_sheet(formattedData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DelegationReport');

    XLSX.writeFile(wb, 'DelegationReport.xlsx');
});