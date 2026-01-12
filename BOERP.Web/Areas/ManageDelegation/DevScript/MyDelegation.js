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
        // Open datepicker when clicking the icon
        $('.input-group-text').on('click', function () {
            $(this).closest('.input-group').find('.datepickersecond').focus();
        });

        // Clear date when clicking the × icon
        $('.clear-date').on('click', function () {
            const $input = $(this).siblings('.datepickersecond');
            $input.val('');          // Clear input
            $(this).hide();          // Hide × icon
        });


    });

    BindDelegationPending(0);
    BindDelegationInProcess(0);
    BindDelegationPendingForAudit(0);
    BindDelegationCompleted(0);

    $('#pendingFrom, #pendingTo').on('change', function () {
        BindDelegationPending(0);

    });

    $('#InProgressFrom, #InProgressTo').on('change', function () {
        BindDelegationInProcess(0);
    });

    $('#AuditFrom, #AuditTo').on('change', function () {
        BindDelegationPendingForAudit(0);
    });

    $('#CompletedFrom, #CompletedTo').on('change', function () {
        BindDelegationCompleted(0);
    });



});






function BindDelegationPending(id) {

    var obj = {
        id: id,
        fromDate: ChangeDateFormat($('#pendingFrom').val()),
        toDate: ChangeDateFormat($('#pendingTo').val()),
    };
    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetMyDelegation', obj, 'GET', function (response) {
        var TableID = 'myDelPending';

        console.log(response);

        var table = $('#myDelPending').DataTable({
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
                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + row.DelName + "' title=''>" + row.DelName + "</p>";
                    }
                },
                //{ "data": "Doer" },
                //{ "data": "Branch" },
                { "data": "PC" },
                { "data": "PlannedScore", "orderable": false, },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        if (row.Status == 1) {
                            return "<div style='color: #169700'><strong>" + getdatewithoutJson(row.DueDate) + "</strong></div>";
                        }
                        else if (row.Status == 2) {
                            return "<div style='color: #d1d500'><strong>" + getdatewithoutJson(row.DueDate) + "</strong></div>";
                        }
                        else {
                            return "<div style='color: #ff0000'><strong>" + getdatewithoutJson(row.DueDate) + "</strong></div>";
                        }
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";

                      
                        if (row.isWork == 1) {
                            strReturn = '<a title="Edit" class="Edit_13" href="AddDoerDelegation?auth=' + AuthToken + '&id=' + row.Id + '"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a>';
                        }
                        else {
                            strReturn = '<a title="Edit" class="Edit_13" href="" data-toggle="modal" data-target="#confirmmsg" ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a>';
                        }

                        return '<div class="text-center">' + strReturn + '</div>';
                    }
                }
            ]
        });
        // Initialize tooltips for the initial set of rows


        initCompleteCallback(TableID);
        getModifyAccess(table, 13);

    });

}

function BindDelegationInProcess(id) {

    var obj = {
        id: id,
        fromDate: ChangeDateFormat($('#InProgressFrom').val()),
        toDate: ChangeDateFormat($('#InProgressTo').val()),
        Type: 1 
    };
    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetMyDelegation', obj, 'GET', function (response) {
        var TableID = 'tableInprocess';

        console.log(response);
        var table = $('#tableInprocess').DataTable({
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
                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + row.DelName + "' title=''>" + row.DelName + "</p>";
                    }
                },
                //{ "data": "Doer" },
                //{ "data": "Branch" },
                { "data": "PC" },
                { "data": "PlannedScore", "orderable": false, },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        if (row.Status == 1) {
                            return "<div style='color: #169700'><strong>" + getdatewithoutJson(row.DueDate) + "</strong></div>";
                        }
                        else if (row.Status == 2) {
                            return "<div style='color: #d1d500'><strong>" + getdatewithoutJson(row.DueDate) + "</strong></div>";
                        }
                        else {
                            return "<div style='color: #ff0000'><strong>" + getdatewithoutJson(row.DueDate) + "</strong></div>";
                        }
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<label>" + getdatewithoutJson(row.DoerDoneDate) + "</label>";
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";



                        strReturn = '<a title="Edit" data-toggle="tooltip" class="Edit_13" href="AfterPendingMyDelegation?auth=' + AuthToken + '&id=' + row.Id + '"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a>';

                        return '<div class="text-center">' + strReturn + '</div>';
                    }
                }
            ]
        });
        // Initialize tooltips for the initial set of rows


        initCompleteCallback(TableID);
        getModifyAccess(table, 13);

    });

}


function BindDelegationPendingForAudit(id) {

    var obj = {
        id: id,
        fromDate: ChangeDateFormat($('#AuditFrom').val()),
        toDate: ChangeDateFormat($('#AuditTo').val()),
        Type: 2 
    };
    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetMyDelegation',obj, 'GET', function (response) {
        var TableID = 'Delpendingforapproval';

        console.log(response);
        var table = $('#Delpendingforapproval').DataTable({
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
                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + row.DelName + "' title=''>" + row.DelName + "</p>";
                    }
                },
                { "data": "Doer" },
                { "data": "Branch" },
                { "data": "PC" },
                { "data": "PlannedScore", "orderable": false, },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        if (row.Status == 1) {
                            return "<div style='color: #169700'><strong>" + getdatewithoutJson(row.DueDate) + "</strong></div>";
                        }
                        else if (row.Status == 2) {
                            return "<div style='color: #d1d500'><strong>" + getdatewithoutJson(row.DueDate) + "</strong></div>";
                        }
                        else {
                            return "<div style='color: #ff0000'><strong>" + getdatewithoutJson(row.DueDate) + "</strong></div>";
                        }
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<label>" + getdatewithoutJson(row.DoerDoneDate) + "</label>";
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";



                        strReturn = '<a title="Edit" data-toggle="tooltip" class="Edit_13" href="AfterPendingMyDelegation?auth=' + AuthToken + '&id=' + row.Id + '&isAudit=1"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a>';

                        return '<div class="text-center">' + strReturn + '</div>';

                    }
                }
            ]
        });
        // Initialize tooltips for the initial set of rows


        initCompleteCallback(TableID);
        getModifyAccess(table, 13);

    });

}

function BindDelegationCompleted(id) {

    var obj = {
        id: id,
        fromDate: ChangeDateFormat($('#CompletedFrom').val()),
        toDate: ChangeDateFormat($('#CompletedTo').val()),
        Type: 3
    };
    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetMyDelegation', obj, 'GET', function (response) {
        var TableID = 'Deltablecompleted';

        console.log(response);
        var table = $('#Deltablecompleted').DataTable({
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
                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + row.DelName + "' title=''>" + row.DelName + "</p>";
                    }
                },
                //{ "data": "Doer" },
                //{ "data": "Branch" },
                { "data": "PC" },
                { "data": "PlannedScore", "orderable": false, },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        if (row.Status == 1) {
                            return "<div style='color: #169700'><strong>" + getdatewithoutJson(row.DueDate) + "</strong></div>";
                        }
                        else if (row.Status == 2) {
                            return "<div style='color: #d1d500'><strong>" + getdatewithoutJson(row.DueDate) + "</strong></div>";
                        }
                        else {
                            return "<div style='color: #ff0000'><strong>" + getdatewithoutJson(row.DueDate) + "</strong></div>";
                        }
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<label>" + getdatewithoutJson(row.DoerDoneDate) + "</label>";
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";



                        strReturn = '<a title="Edit" data-toggle="tooltip" class="Edit_13" href="AfterPendingMyDelegation?auth=' + AuthToken + '&id=' + row.Id + '&isCompleted=1"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a>';

                        return '<div class="text-center">' + strReturn + '</div>';

                    }
                }
            ]
        });
        // Initialize tooltips for the initial set of rows


        initCompleteCallback(TableID);
        getModifyAccess(table, 13);

    });

}




window.onload = displaySuccessMessage;
