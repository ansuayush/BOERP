$(document).ready(function () {


    $(function () {
        $('.datepickersecond').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "dd-mm-yy",
            yearRange: "-20:+10",
            onSelect: function (dateText) {
                // Show × icon when a date is selected
                $(this).siblings('.clear-date').show();
            }
        });

        // Clear date when clicking the × icon
        $('.clear-date').on('click', function () {
            const $input = $(this).siblings('.datepickersecond');
            $input.val('');          // Clear input
            $(this).hide();          // Hide × icon
        });

        // Open datepicker when clicking the icon
        $('.input-group-text').on('click', function () {
            $(this).closest('.input-group').find('.datepickersecond').focus();
        });

    });

    BindDoerDashBoard();
    BindDoerInProgressDashBoard();
    BindDoerPendingForAuditDashBoard();
    BindDoerCompletedDashBoard();
    BindDoerReattemptDashBoard();
    //var obj = {
    //    ParentId: 0,
    //    masterTableType: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: ManaulTableEnum.MasterThematicArea,
    //    manualTableId: 0
    //}
    /* LoadMasterDropdownTMS('ddlThematic', obj, 'Select', false);*/

    $('#pendingFromDate, #pendingToDate').on('change', function () {
        BindDoerDashBoard();
    });

    $('#progressFromDate, #progressToDate').on('change', function () {
        BindDoerInProgressDashBoard();
    });

    $('#pendingAuditFromDate, #pendingAuditToDate').on('change', function () {
        BindDoerPendingForAuditDashBoard();
    });

    $('#completedFromDate, #completedToDate').on('change', function () {
        BindDoerCompletedDashBoard();
    });

    $('#reattemptFromDate, #reattemptToDate').on('change', function () {
        BindDoerReattemptDashBoard();
    });



});



function BindDoerDashBoard() {
    var obj = {
        fromDate: ChangeDateFormat($('#pendingFromDate').val()),
        toDate: ChangeDateFormat($('#pendingToDate').val()),
    };

    var TableID = 'tablespending';

    // Load the DataTable with data
    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindDoerDashboard', obj, 'GET', function (response) {
        console.log(response);

       var table =  $('#tablespending').DataTable({
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
                        return "<p class='ellipsis-td ' data-toggle='tooltip' data-original-title='" + row.TaskName + "' title=''>" + row.TaskName + "</p>";
                    }
                },
                {
                    "orderable": true,
                    "data": null,
                    "render": function (data, type, row, meta) {
                        if (login_id == "1") {
                            return "<p class='doer-td'>" + row.Doer + "</p>";  // No content
                        } else {
                            return null;
                        }
                    },
                    "visible": login_id == "1"  // Hide the whole column when login_id == 1
                },

                { "data": "SecDoer" },
                //{ "data": "BranchName" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;
                        if (row.ReattemptTime) {
                            date = getdatetime(row.ReattemptDate);
                        } else {
                            date = getdatetime(row.CombinedDateTime);
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
                        date = convertDelayIndays(row.CombinedDateTime);
                        return date;
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";
                        strReturn = '<a title="Edit" data-toggle="tooltip" class="Edit_3" href="AddDoerTask?auth=' + AuthToken + '&id=' + row.Id + '" data-original-title="Process"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a>';
                        return strReturn;
                    }
                }
            ],
          
        });

        initCompleteCallback(TableID);

        ///// getModifyAccess(table, 3);
    });

    $('#' + TableID + '_filter').hide();
}










function BindDoerInProgressDashBoard() {

    var obj = {
        fromDate: ChangeDateFormat($('#progressFromDate').val()),
        toDate: ChangeDateFormat($('#progressToDate').val()),
    }

    var TableID = 'tablespendingaudit'
    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindInProgressDashBoard', obj, 'GET', function (response) {

        console.log(response)



        var table = $('#tablespendingaudit').DataTable({
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
                    "data": null,
                    "render": function (data, type, row, meta) {
                        if (login_id == "1") {
                            return "<p class='doer-td'>" + row.Doer + "</p>";  // No content
                        } else {
                            return null;
                        }
                    },
                    "visible": login_id == "1"  // Hide the whole column when login_id == 1
                },
                { "data": "SecDoer" },
                //{ "data": "BranchName" },

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


                        date = calculateDelayTime(row.Delay);

                        return date;
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;


                        date = getdatetime(row.CompletedDate)
                  

                        return "<p class='doer-td' >" + date + "</p>"; 
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {

                        var strReturn = "";
                        strReturn = '<a title="Edit" data-toggle="tooltip" class="Edit_3"  href="AddDoerTask?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a> ';


                        return strReturn;
                    }
                }


            ]
        });

       // // getModifyAccess(table, 3);


        initCompleteCallback(TableID);


    });

    $('#' + TableID + '_filter').hide();

}

function BindDoerPendingForAuditDashBoard() {

    var obj = {
        fromDate: ChangeDateFormat($('#pendingAuditFromDate').val()),
        toDate: ChangeDateFormat($('#pendingAuditToDate').val()),
    }

    var TableID = 'pendingforauditDoer'
    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindDoerPendingForAuditDashBoard', obj, 'GET', function (response) {

        console.log(response)



        var table = $('#pendingforauditDoer').DataTable({
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
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;


                        date = getdatetime(row.CompletedDate)



                        return "<p class='doer-td' >" + date + "</p>"; 
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {

                        var strReturn = "";
                        strReturn = '<a title="Edit" data-toggle="tooltip" class="Edit_3"  href="DoerTaskAudit?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';
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
        // // getModifyAccess(table, 3);


        initCompleteCallback(TableID);

    });

    $('#' + TableID + '_filter').hide();

}

function BindDoerCompletedDashBoard() {

    var obj = {
        fromDate: ChangeDateFormat($('#completedFromDate').val()),
        toDate: ChangeDateFormat($('#completedToDate').val()),
    }

    var TableID = 'tableDoercompleted'
    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindDoerCompletedDashBoard', obj, 'GET', function (response) {

        console.log(response)



        var table = $('#tableDoercompleted').DataTable({
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
                    "data": null,
                    "render": function (data, type, row, meta) {
                        if (login_id == "1") {
                            return "<p class='doer-td'>" + row.Doer + "</p>";  // No content
                        } else {
                            return null;
                        }
                    },
                    "visible": login_id == "1"  // Hide the whole column when login_id == 1
                },
                { "data": "SecDoer" },
                //{ "data": "BranchName" },

                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        if (row.ReattemptTime) {
                            date = getdatetime(row.ReattemptDate)
                        }
                        else {
                            date = getdatetime(row.CombinedDateTime)
                        } 3


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
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        date = getdatetime(row.CompletedDate);
                        return "<p class='doer-td' >" + date + "</p>"; 
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {

                        var strReturn = "";
                        strReturn = '<a title="Edit" data-toggle="tooltip" class="Edit_3"  href="DoerTaskCompleted?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a> ';
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

        // getModifyAccess(table, 3);

        initCompleteCallback(TableID);

    });
    $('#' + TableID + '_filter').hide();

}

function BindDoerReattemptDashBoard() {

    var obj = {
        fromDate: ChangeDateFormat($('#reattemptFromDate').val()),
        toDate: ChangeDateFormat($('#reattemptToDate').val()),
    }

    var TableID = 'reattemptDoer'
    CommonAjaxMethodTMS(baseURL + 'ManageDoer/BindDoerReattemptDashBoard', obj, 'GET', function (response) {

        console.log(response)


        var table = $('#reattemptDoer').DataTable({
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
                    "data": null,
                    "render": function (data, type, row, meta) {
                        if (login_id == "1") {
                            return "<p class='doer-td'>" + row.Doer + "</p>";  // No content
                        } else {
                            return null;
                        }
                    },
                    "visible": login_id == "1"  // Hide the whole column when login_id == 1
                },
                { "data": "SecDoer" },
                //{ "data": "BranchName" },

                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        date = getdatetime(row.DueDate)


                        return date;
                    }
                },
                { "data": "Frequency" },
                { "data": "PlannedScore" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        var date;

                        date = convertDelayIndays(row.DueDate)

                        return date;
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {

                        var strReturn = "";
                        strReturn = '<a title="Edit" data-toggle="tooltip" class="Edit_3"  href="DoerTaskReattempt?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a> ';
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

        // getModifyAccess(table, 3);


        initCompleteCallback(TableID);

    });
    $('#' + TableID + '_filter').hide();
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
