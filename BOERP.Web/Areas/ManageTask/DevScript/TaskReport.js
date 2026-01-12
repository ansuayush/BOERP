$(document).ready(function () {



    $(function () {
        $('.datepicker').datepicker({
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

    var obj = {
        ParentId: 0,
        masterTableType: DropDownTypeEnum.Frequency,
        isMasterTableType: true,
        isManualTable: false,
        manualTable: 0,
        manualTableId: 0
    }
    LoadMasterDropdownTMS('ddlFrequency', obj, 'All', false);


    LoadMasterDropdownTMS('ddlDoer', obj2, 'All', false);

    var obj3 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Branch,
        manualTableId: ManaulTableEnum.Branch
    }



    LoadMasterDropdownTMS('ddlBranch', obj3, 'All', false);


    GetTaskReport();





});


function GetTaskReport() {

    var obj = {
        Delay: $('#ddlDelay').val() == 'All' ? null : $('#ddlDelay').val(),
        Doer: $('#ddlDoer').val() == 'All' ? null : $('#ddlDoer').val(),
        Branch: $('#ddlBranch').val() == 'All' ? null : $('#ddlBranch').val(),
        Frequency: $('#ddlFrequency').val() == 'All' ? null : $('#ddlFrequency').val(),
        FromDate: ChangeDateFormat($('#fromDate').val()),
        ToDate: ChangeDateFormat($('#toDate').val()),
        Status: $('#ddlStatus').val() == 'All' ? null : $('#ddlStatus').val(),
    }

    var TableID = 'TaskReport';
    CommonAjaxMethodTMS(virtualPath + 'ManageTask/GetTaskReport', obj, 'GET', function (response) {
        console.log(response);
        var tData = response.data.data.Table1;

        var table = $('#TaskReport').DataTable({
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
                { "data": "Id" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + row.TaskName + "' title=''>" + row.TaskName + "</p>";
                    }
                },
                { "data": "Doer" },
                { "data": "Frequency" },
                { "data": "BranchName" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {

                        if (row.CombinedDateTime != null) {
                            var date = getdatetime(row.CombinedDateTime);
                        }
                        else {
                            var date = '';
                        }
                        
                        return date;
                    }
                },
                { "data": "RealDelay" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {

                        if (row.DoerDoneDate != null) {
                            var date = getdatetime(row.DoerDoneDate);
                        }
                        else {
                            var date = '';
                        }

                        return date;
                    }
                },
                { "data": "PC" },
                { "data": "AuditedBy" },   
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {

                        if (row.AuditC == "Total") {
                            return "<strong>Total</strong>";
                        }
                        else if (row.AuditC == null) {
                            return "<label></label>";
                        }
                        else {
                            return "<label>" + row.AuditC + "</label>";
                        }

                        
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {

                        if (row.AuditC == "Total") {
                            return "<strong>" + tData[0].TotalSum + "</strong>";
                        }                                                 
                        else {
                            return "<div  >" + row.PlannedScore + "</div>";  
                        }


                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {

                        if (row.AuditC == "Total") {
                            return "<strong>" + tData[0].TotalWND + "</strong>";
                        }                       
                        else {
                            return "<div  >" + row.WND + "</div>";
                        }


                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {

                        if (row.AuditC == "Total") {
                            return "<strong>" + tData[0].PlannedT + "</strong>";
                        }                      
                        else {
                            return "<div  >" + row.WeightageT + "</div>";
                        }


                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {

                        if (row.AuditC == "Total") {
                            return "<strong>" + tData[0].TotalWNDT + "</strong>";
                        }                      
                        else {
                            return  "<div  >" + row.WNDT + "</div>";;
                        }


                    }
                },  
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {

                        if (row.AuditC == "Total") {
                            return "<strong>" + tData[0].PlannedQ + "</strong>";
                        }                       
                        else {
                            return "<div  >" + row.WeightageQ + "</div>";
                        }


                    }
                },  
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {

                        if (row.AuditC == "Total") {
                            return "<strong>" + tData[0].TotalWNDQ + "</strong>";
                        }                       
                        else {
                            return "<div  >" + row.WNDQ + "</div>";
                        }


                    }
                },    
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {

                        if (row.AuditC == "Total") {
                            return "<strong></strong>";
                        }
                        else {
                            return row.DoerAttendance ? "<div>Present</div>" : "<div>Absent</div>";
                        }


                    }
                },    
                { "data": "Status" },               
                
            ]
        });

        table.row.add({
            "Id": '',
            "TaskName": '',
            "CreatedBy": '',
            "Doer":'',
            "Frequency": '',
            "BranchName": '',
            "CombinedDateTime": null,
            "RealDelay": '',
            "DoerDoneDate": null,
            "PC": '',
            "AuditedBy": '',
            "AuditC": "Total",
            "PlannedScore": tData[0].TotalSum,
            "WND": tData[0].TotalWND,
            "WeightageT": tData[0].PlannedT,
            "WNDT": tData[0].TotalWNDT,
            "WeightageQ": tData[0].PlannedQ,
            "WNDQ": tData[0].TotalWNDQ,
            "DoerAttendance": '',
            "Status": ''
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

function ClearTaskReport() {

    window.location.href = 'TaskReport';
}

function exportToExcel() {
    // Fetch the table data
    var table = $('#TaskReport').DataTable();
    var data = table.data().toArray();

    // Prepare the worksheet
    var ws_data = [];

    // Add table headers
    ws_data.push([
        "Id", "Task Name",  "Doer", "Frequency",
        "Branch Name", "Combined Date", "Real Delay",
        "Doer Done Date", "PC", "Audited By", "Audit Controller",
        " WND Planned Score", "WND Actual Score", "WNDOT Planned Score","WNDOT Actual Score", "WNDOQ Planned Score", "WNDQ Actual Score", "Doer Attendance", "Status"
    ]);


    // Add table rows
    data.forEach(function (row) {
        ws_data.push([
            row.Id,
            row.TaskName,
            row.Doer,
            row.Frequency,
            row.BranchName,
            row.CombinedDateTime ? getdatetime(row.CombinedDateTime) : '',
            row.RealDelay,
            row.DoerDoneDate ? getdatetime(row.DoerDoneDate) : '',
            row.PC,
            row.AuditedBy,
            row.AuditC,
            row.PlannedScore,                                    
            row.WND,
            row.WeightageT,            
            row.WNDT,
            row.WeightageQ,
            row.WNDQ,
            row.DoerAttendance ? 'Present': 'Absent',
            row.Status
        ]);
    }); 

    // Create the worksheet and workbook
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Task Report");

    // Export the workbook to Excel
    XLSX.writeFile(wb, "Task_Report.xlsx");
}
