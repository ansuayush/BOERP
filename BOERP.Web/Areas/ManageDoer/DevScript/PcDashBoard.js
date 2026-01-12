$(document).ready(function () {

    $(function () {
        $('.datepicker').daterangepicker({
            opens: 'right',
            singleDatePicker: true,
            showDropdowns: true,
            autoApply: true,
            autoUpdateInput: false,
            parentEl: 'body', // Prevents clipping in small containers
            locale: {
                format: 'DD/MM/YYYY'
            }
        })
            .on('apply.daterangepicker', function (ev, picker) {
                // Set selected date
                $(this).val(picker.startDate.format('DD/MM/YYYY'));
                // Show the × icon
                $(this).siblings('.clear-date').show();
            });

        // Open datepicker when clicking the icon
        $('.input-group-text').on('click', function () {
            $(this).closest('.input-group').find('.datepicker').focus();
        });

        // Clear date when clicking the × icon
        $('.clear-date').on('click', function () {
            const $input = $(this).siblings('.datepicker'); // ✅ fixed selector
            $input.val('');          // Clear input
            $(this).hide();          // Hide × icon
        });

        // Hide × if input cleared manually
        $('.datepicker').on('input', function () {
            if ($(this).val() === '') {
                $(this).siblings('.clear-date').hide();
            }
        });
    });



    //$(function () {
    //    $('.datepickersecond').datepicker({
    //        changeMonth: true,
    //        changeYear: true,
    //        dateFormat: "dd-mm-yy",
    //        yearRange: "-20:+10"
    //    });

    //});

   // BindPcDashBoard();
    //BindPcCancelledDashBoard();
    //BindPcCompletedDashBoard();
    //BindPcAuditControllerDashBoard();
    //BindPcInProgressDashBoard();
    //var obj = {
    //    ParentId: 0,
    //    masterTableType: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: ManaulTableEnum.MasterThematicArea,
    //    manualTableID: 0
    //}
    /* LoadMasterDropdownTMS('ddlThematic', obj, 'Select', false);*/

    $('#pendingFromDate, #pendingToDate').on('change', function () {
        bindItemMasterGridFilter();
    });

    //$('#progressFromDate, #progressToDate').on('change', function () {
    //    BindPcInProgressDashBoard();
    //});

    //$('#pendingAuditFromDate, #pendingAuditToDate').on('change', function () {
    //    BindPcAuditControllerDashBoard();
    //});

    //$('#completedFromDate, #completedToDate').on('change', function () {
    //    BindPcCompletedDashBoard();
    //});

    //$('#cancelledFromDate, #cancelledToDate').on('change', function () {
    //    BindPcCancelledDashBoard();
    //});

});

let tblData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindPendingTaskGrid();



});


function bindPendingTaskGrid() {
    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start

    //End
    var obj = {
        fromDate: ChangeDateFormat($('#pendingFromDate').val()),
        toDate: ChangeDateFormat($('#pendingToDate').val()),
    }
  


    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindPcDashBoard', obj, 'GET', function (response) {
        console.log(response);
        tblData = response.data.data.Table;
        var columnMeta = response.data.data.Table1;
        gridOptions = bindAgGrid("#myGrid", 'PendingTask', columnMeta, tblData);
        $("#customLoader").hide();
    });
}

function bindInProgressGrid() {
    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start

    //End
    var obj = {
        fromDate: ChangeDateFormat($('#pendingFromDate').val()),
        toDate: ChangeDateFormat($('#pendingToDate').val()),
    }



    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindPcPendingForAuditDashBoard', obj, 'GET', function (response) {
        console.log(response);
        tblData = response.data.data.Table;
        var columnMeta = response.data.data.Table1;
        gridOptions = bindAgGrid("#myGrid", 'PendingForAuditTask', columnMeta, tblData);
        $("#customLoader").hide();
    });
}


function bindCompletedTaskGrid() {
    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start

    //End
    var obj = {
        fromDate: ChangeDateFormat($('#pendingFromDate').val()),
        toDate: ChangeDateFormat($('#pendingToDate').val()),
    }



    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindPcCompletedDashBoard', obj, 'GET', function (response) {
        console.log(response);
        tblData = response.data.data.Table;
        var columnMeta = response.data.data.Table1;
        gridOptions = bindAgGrid("#myGrid", 'CompletedTask', columnMeta, tblData);
        $("#customLoader").hide();
    });
}

function bindCancelledTaskGrid() {
    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start

    //End
    var obj = {
        fromDate: ChangeDateFormat($('#pendingFromDate').val()),
        toDate: ChangeDateFormat($('#pendingToDate').val()),
    }



    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindPcCancelledDashBoard', obj, 'GET', function (response) {
        console.log(response);
        tblData = response.data.data.Table;
        var columnMeta = response.data.data.Table1;
        gridOptions = bindAgGrid("#myGrid", 'CancelledTask', columnMeta, tblData);
        $("#customLoader").hide();
    });
}




function bindItemMasterGridFilter() {
    let filterData = tblData;

    let fromDate = $('#pendingFromDate').val(); // Assuming the fromDate input field is 'txtFromDate'
    let toDate = $('#pendingToDate').val(); // Assuming the toDate input field is 'txtToDate'

    //var taskNo = $("#ddlTask").val() === 'All' ? '0' : $("#ddlTask").val();

    //if (taskNo != '0') {
    //    filterData = tblData.filter(row => row.TaskNo == (taskNo - 1));
    //}

    // If dates are provided, filter based on date range
    if (fromDate || toDate) {
        // Convert fromDate and toDate to Date objects
        fromDate1 = new Date(ChangeDateFormatSecond(fromDate));
        toDate1 = new Date(ChangeDateFormatSecond(toDate));

        // Filter based on ExpDate in row
        if (ChangeDateFormatSecond(fromDate) != "" && ChangeDateFormatSecond(toDate) != "") {

            filterData = tblData.filter(row => {
                let expDate = new Date((row.CombinedDateTime));
                console.log(expDate);
                return expDate >= fromDate1 && expDate <= toDate1;
            });
        }
        else if (ChangeDateFormatSecond(fromDate) != "") {
            filterData = tblData.filter(row => {
                let expDate = new Date((row.CombinedDateTime));
                console.log('exp');
                console.log(expDate);
                console.log('from')
                console.log(fromDate)
                return expDate >= fromDate1
            });
        }
        else {

            filterData = tblData.filter(row => {
                let expDate = new Date((row.CombinedDateTime));
                console.log(expDate);
                return expDate <= toDate1
            });

        }

    }

    // Set the filtered data to the grid
    if (filterData.length > 0) {
        gridOptions.api.setRowData(filterData);
    } else {
        if (globalGridOptions != null)
            gridOptions.api.setRowData([]);
    }
}





function BindPcDashBoard() {
    var obj = {
        fromDate: ChangeDateFormat($('#pendingFromDate').val()),
        toDate: ChangeDateFormat($('#pendingToDate').val()),
    }

    var TableID = 'tabePendingPc';

    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindPcDashBoard', obj, 'GET', function (response) {

        console.log(response)


        var table = $('#tabePendingPc').DataTable({
            "paging": true,
            "pagingType": "full_numbers",
            "pageLength": 10,
            "lengthMenu": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "responsive": true,
            "stateSave": false,
            "dom": '<"top">rt<"bottom"lip><"clear">',
            "language": {
                "paginate": {
                    "first": "<img src='../assets/images/icons/help/double-left.png' alt=''>",
                    "previous": "<img src='../assets/images/icons/help/arrow-left.png' alt=''>",
                    "next": "<img src='../assets/images/icons/help/arrow-right.png' alt=''>",
                    "last": "<img src='../assets/images/icons/help/double-right.png' alt=''>"
                }
            },
            "data": response.data.data.Table,
            "stateSave": true, // Enable state saving
            "columns": [
                //{ "data": "RowNumber" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='ellipsis-td'  data-toggle='tooltip' data-original-title='" + row.TaskName + "' title=''>" + row.TaskName + "</p>";
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='doer-td' >" + row.Doer + "</p>";
                    }
                },
                { "data": "SecDoer" },
                { "data": "BranchName" },

                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                
                     
                            date = getdatetime(row.CombinedDateTime)


                        return date;
                    }
                },
                { "data": "Frequency" },
                { "data": "PlannedScore", "orderable": false, },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;
                     
                            date = convertDelayIndays(row.CombinedDateTime);

                        return date;
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";
                        if (row.StatusId == 1) {
                            strReturn = '<a title="Edit" class="Edit_2"   href="AddPcTask?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image" data-toggle="tooltip" title="Edit"></a> ';
                        }
                        else if (row.StatusId == 4) {                         
                            strReturn = '<a title="Edit" class="Edit_2"   href="PCTaskReattempt?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image" data-toggle="tooltip" title="Edit"> </a> ';
                        }
                        //Click to DeActivate                     
                        //Click to Activate                      
                        //if (row.PlannedScore == "Active") {
                        //    strReturn = "<a title='Click to DeActivate' data-toggle='tooltip' data-original-title='Click to DeActivate' class='AIsActive'  onclick='Activate(" + row.id + ")' ><i class='fa fa-check-circle checkgreen' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                        //}
                        //if (row.PlannedScore == "Deactive") {
                        //    strReturn = "<a title='Click to Activate' data-toggle='tooltip' data-original-title='Click to Activate' class='AIsActive' onclick='Activate(" + row.id + ")' ><i class='fa fa-times-circle crossred' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                        //}

                        return strReturn;
                    }
                }


            ]
        });




        initCompleteCallback(TableID);

    });

}

function BindPcInProgressDashBoard() {

    var obj = {
        fromDate: ChangeDateFormat($('#progressFromDate').val()),
        toDate: ChangeDateFormat($('#progressToDate').val()),
    }

    var TableID = 'tabeInProgressPc';

    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindInProgressPcDashBoard', obj, 'GET', function (response) {

        console.log(response)


        var table = $('#tabeInProgressPc').DataTable({
            "processing": true, // for show progress bar           
            "destroy": true,
            "info": false,
            "lengthChange": false,
            "lengthMenu": [
                [10, 25, 50, -1],
                ['10 rows', '25 rows', '50 rows', 'Show all']
            ],
            "pageLength": 10, // Set initial page length to 10
            "bFilter": true,
            "bSort": false,
            "data": response.data.data.Table,
            "stateSave": true, // Enable state saving
            "columns": [
                { "data": "RowNumber" },
                { "data": "TaskName" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='doer-td' >" + row.Doer + "</p>";
                    }
                },
                { "data": "BranchName" },
                { "data": "SecDoer" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        if (row.ReattemptTime) {
                            date = getdatetime(row.ReattemptDate)
                        }
                        else {
                            date = getdatetime(row.CombinedDateTime)
                        }


                        return date;
                    }
                },
                { "data": "Frequency" },
                { "data": "PlannedScore" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;
                        if (row.PlannedScore == 'Pending') {
                            date = convertDelayIndays(row.CombinedDateTime);
                        }
                        else {
                            date = calculateDelayTime(row.Delay);
                        }


                        return date;
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";
                        strReturn = '<a title="Edit"  class="Edit_2"  href="AddPcTask?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';
                        //Click to DeActivate                     
                        //Click to Activate                      
                        //if (row.PlannedScore == "Active") {
                        //    strReturn = "<a title='Click to DeActivate' data-toggle='tooltip' data-original-title='Click to DeActivate' class='AIsActive'  onclick='Activate(" + row.id + ")' ><i class='fa fa-check-circle checkgreen' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                        //}
                        //if (row.PlannedScore == "Deactive") {
                        //    strReturn = "<a title='Click to Activate' data-toggle='tooltip' data-original-title='Click to Activate' class='AIsActive' onclick='Activate(" + row.id + ")' ><i class='fa fa-times-circle crossred' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                        //}

                        return strReturn;
                    }
                }


            ]
        });


         initCompleteCallback(TableID);

    });

}


function BindPcCancelledDashBoard() {


    var obj = {
        fromDate: ChangeDateFormat($('#cancelledFromDate').val()),
        toDate: ChangeDateFormat($('#cancelledToDate').val()),
    }

    var TableID = 'cancelledPc';
    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindPcCancelledDashBoard', obj, 'GET', function (response) {

        console.log(response)


        var table = $('#cancelledPc').DataTable({
            "paging": true,
            "pagingType": "full_numbers",
            "pageLength": 10,
            "lengthMenu": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "responsive": true,
            "stateSave": false,
            "dom": '<"top">rt<"bottom"lip><"clear">',
            "language": {
                "paginate": {
                    "first": "<img src='../assets/images/icons/help/double-left.png' alt=''>",
                    "previous": "<img src='../assets/images/icons/help/arrow-left.png' alt=''>",
                    "next": "<img src='../assets/images/icons/help/arrow-right.png' alt=''>",
                    "last": "<img src='../assets/images/icons/help/double-right.png' alt=''>"
                }
            },
            "data": response.data.data.Table,
            "stateSave": true, // Enable state saving
            "columns": [
                //{ "data": "RowNumber" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='ellipsis-td'  data-toggle='tooltip' data-original-title='" + row.TaskName + "' title=''>" + row.TaskName + "</p>";
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='doer-td' >" + row.Doer + "</p>";
                    }
                },
                { "data": "SecDoer" },
                { "data": "BranchName" },

                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        if (row.ReattemptTime) {
                            date = getdatetime(row.ReattemptDate)
                        }
                        else {
                            date = getdatetime(row.CombinedDateTime)
                        }


                        return date;
                    }
                },
                { "data": "Frequency" },
                { "data": "PlannedScore", "orderable": false, },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        date = calculateDelayTime(row.Delay);
                        return date;
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";

                        if (row.ReattemptTime == null) {
                            strReturn = '<a data-toggle="tooltip" title="Edit" class="Edit_2"  href="PcTaskCancelled?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';
                        }

                        else {
                            strReturn = '<a data-toggle="tooltip" title="Edit" class="Edit_2"  href="PCTaskReattemptCancelled?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';
                        }
                        //Click to DeActivate                     
                        //Click to Activate                      
                        //if (row.PlannedScore == "Active") {
                        //    strReturn = "<a title='Click to DeActivate' data-toggle='tooltip' data-original-title='Click to DeActivate' class='AIsActive'  onclick='Activate(" + row.id + ")' ><i class='fa fa-check-circle checkgreen' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                        //}
                        //if (row.PlannedScore == "Deactive") {
                        //    strReturn = "<a title='Click to Activate' data-toggle='tooltip' data-original-title='Click to Activate' class='AIsActive' onclick='Activate(" + row.id + ")' ><i class='fa fa-times-circle crossred' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                        //}

                        return strReturn;
                    }
                }


            ]
        });


         initCompleteCallback(TableID);


    });

}

function BindPcAuditControllerDashBoard() {

    var obj = {
        fromDate: ChangeDateFormat($('#pendingAuditFromDate').val()),
        toDate: ChangeDateFormat($('#pendingAuditToDate').val()),
    }


    var TableID = 'pendingforauditPc';
    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindPcPendingForAuditDashBoard', obj, 'GET', function (response) {

        console.log(response)


        var table = $('#pendingforauditPc').DataTable({
            "paging": true,
            "pagingType": "full_numbers",
            "pageLength": 10,
            "lengthMenu": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "responsive": true,
            "stateSave": false,
            "dom": '<"top">rt<"bottom"lip><"clear">',
            "language": {
                "paginate": {
                    "first": "<img src='../assets/images/icons/help/double-left.png' alt=''>",
                    "previous": "<img src='../assets/images/icons/help/arrow-left.png' alt=''>",
                    "next": "<img src='../assets/images/icons/help/arrow-right.png' alt=''>",
                    "last": "<img src='../assets/images/icons/help/double-right.png' alt=''>"
                }
            },
            "data": response.data.data.Table,
            "stateSave": true, // Enable state saving
            "columns": [
                //{ "data": "RowNumber" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='ellipsis-td'  data-toggle='tooltip' data-original-title='" + row.TaskName + "' title=''>" + row.TaskName + "</p>";
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='doer-td' >" + row.Doer + "</p>";
                    }
                },
                { "data": "SecDoer" },
                { "data": "BranchName" },

                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        if (row.ReattemptTime) {
                            date = getdatetime(row.ReattemptDate)
                        }
                        else {
                            date = getdatetime(row.CombinedDateTime)
                        }


                        return date;
                    }
                },
                { "data": "Frequency" },
                { "data": "PlannedScore", "orderable": false, },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        date = calculateDelayTime(row.Delay);
                        return date;
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        date = getdatetime(row.CompletedTime);
                        return "<p class='doer-td' >" + date + "</p>";;
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";
                        strReturn = '<a data-toggle="tooltip" title="Edit" class="Edit_2"  href="PcTaskAudit?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';
                        //Click to DeActivate                     
                        //Click to Activate                      
                        //if (row.PlannedScore == "Active") {
                        //    strReturn = "<a title='Click to DeActivate' data-toggle='tooltip' data-original-title='Click to DeActivate' class='AIsActive'  onclick='Activate(" + row.id + ")' ><i class='fa fa-check-circle checkgreen' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                        //}
                        //if (row.PlannedScore == "Deactive") {
                        //    strReturn = "<a title='Click to Activate' data-toggle='tooltip' data-original-title='Click to Activate' class='AIsActive' onclick='Activate(" + row.id + ")' ><i class='fa fa-times-circle crossred' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                        //}

                        return strReturn;
                    }
                }


            ]
        });

      //  getModifyAccess(table, 2);

         initCompleteCallback(TableID);

    });

}

function BindPcCompletedDashBoard() {

    var obj = {
        fromDate: ChangeDateFormat($('#completedFromDate').val()),
        toDate: ChangeDateFormat($('#completedToDate').val()),
    }

    var TableID = 'tablecompletedPc';
    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindPcCompletedDashBoard', obj, 'GET', function (response) {

        console.log(response)


        var table = $('#tablecompletedPc').DataTable({
            "paging": true,
            "pagingType": "full_numbers",
            "pageLength": 10,
            "lengthMenu": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "responsive": true,
            "stateSave": false,
            "dom": '<"top">rt<"bottom"lip><"clear">',
            "language": {
                "paginate": {
                    "first": "<img src='../assets/images/icons/help/double-left.png' alt=''>",
                    "previous": "<img src='../assets/images/icons/help/arrow-left.png' alt=''>",
                    "next": "<img src='../assets/images/icons/help/arrow-right.png' alt=''>",
                    "last": "<img src='../assets/images/icons/help/double-right.png' alt=''>"
                }
            },
            "bSort": true,
            "data": response.data.data.Table,
            "stateSave": true, // Enable state saving
            "columns": [
                //{ "data": "RowNumber" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='ellipsis-td'  data-toggle='tooltip' data-original-title='" + row.TaskName + "' title=''>" + row.TaskName + "</p>";
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='doer-td' >" + row.Doer + "</p>";
                    }
                },
                { "data": "SecDoer" },
                { "data": "BranchName" },

                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        if (row.ReattemptTime) {
                            date = getdatetime(row.ReattemptDate)
                        }
                        else {
                            date = getdatetime(row.CombinedDateTime)
                        }


                        return date;
                    }
                },
                { "data": "Frequency" },
                { "data": "PlannedScore", "orderable": false, },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        date = calculateDelayTime(row.Delay);
                        return date;
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        date = getdatetime(row.CompletedTime);
                        return "<p class='doer-td' >" + date + "</p>";;
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";
                        strReturn = '<a data-toggle="tooltip" title="Edit" class="Edit_2"  href="PcTaskCompleted?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';
                        //Click to DeActivate                     
                        //Click to Activate                      
                        //if (row.PlannedScore == "Active") {
                        //    strReturn = "<a title='Click to DeActivate' data-toggle='tooltip' data-original-title='Click to DeActivate' class='AIsActive'  onclick='Activate(" + row.id + ")' ><i class='fa fa-check-circle checkgreen' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                        //}
                        //if (row.PlannedScore == "Deactive") {
                        //    strReturn = "<a title='Click to Activate' data-toggle='tooltip' data-original-title='Click to Activate' class='AIsActive' onclick='Activate(" + row.id + ")' ><i class='fa fa-times-circle crossred' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                        //}

                        return strReturn;
                    }
                }


            ]
        });

       // getModifyAccess(table, 2);

        initCompleteCallback(TableID);


    });

}

function calculateDelayTime(dateString) {
    // Parse the input date string to get the year, month, and day
    var parts = dateString.split(',');
    var day = parseInt(parts[0], 10);
    var hour = parseInt(parts[1], 10);
    var min = parseInt(parts[2], 10);

    if (day == 0 && hour == 0 && min == 0) {
        return 0;

    }
    var delay = day * 24 + hour;

    var delayS = delay + "." + min;


    return delayS;
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

        var delay = Math.abs(parseInt(days, 10)) * 24 + Math.abs(parseInt(hours, 10));
        var delayS = delay + "." + Math.abs(minutes);

        return delayS;

    }
    else {
        return 0;
    }

}


window.onload = displaySuccessMessage;
