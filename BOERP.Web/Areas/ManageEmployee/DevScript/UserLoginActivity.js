
$(document).ready(function () {

    $(function () {
        $('.datepickersecond').daterangepicker({
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
            $(this).closest('.input-group').find('.datepickersecond').focus();
        });

        // Clear date when clicking the × icon
        $('.clear-date').on('click', function () {
            const $input = $(this).siblings('.datepickersecond'); // ✅ fixed selector
            $input.val('');          // Clear input
            $(this).hide();          // Hide × icon
        });

        // Hide × if input cleared manually
        $('.datepickersecond').on('input', function () {
            if ($(this).val() === '') {
                $(this).siblings('.clear-date').hide();
            }
        });
    });

    

    BindData();

    // Load user info from localStorage
    $('#emp_name').html(localStorage.getItem('emp_name'));
    $('#emp_code').html(localStorage.getItem('emp_code'));
    $('#dept').html(localStorage.getItem('dept'));

    // Optional: Call BindData on page load if both dates are already filled
    if ($('#pendingFromDate').val() && $('#pendingToDate').val()) {
        BindData();
    }
});

function BindData() {

    if ($.fn.DataTable.isDataTable("#UserActivityLog")) {
        indentTable.ajax.reload();
        return;
    }

    indentTable = $('#UserActivityLog').DataTable({
        "processing": true,
        "serverSide": true,
        "paging": true,
        "pagingType": "full_numbers",
        "pageLength": 10,
        "lengthMenu": [10, 20, 30, 40, 50],
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "responsive": true,
        "dom": '<"top">rt<"bottom"lip><"clear">',
        "language": {
            "paginate": {
                "first": "<img src='../../assets/images/icons/help/double-left.png' alt=''>",
                "previous": "<img src='../../assets/images/icons/help/arrow-left.png' alt=''>",
                "next": "<img src='../../assets/images/icons/help/arrow-right.png' alt=''>",
                "last": "<img src='../../assets/images/icons/help/double-right.png' alt=''>"
            }
        },
        "ajax": function (data, callback, settings) {
            var requestData = {
                start: data.start,
                length: data.length,
                search: data.search.value,
                orderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : null,
                orderDir: data.order.length > 0 ? data.order[0].dir : "asc",
                screenId: 'UserLog_001',
                modelData: JSON.stringify({
                    Type: 1,
                    fromDate: ChangeDateFormat($('#pendingFromDate').val()),
                    toDate: ChangeDateFormat($('#pendingToDate').val()),
                    Login_ID: id
                })
            };

            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', requestData, 'GET', function (response) {
                if (response && response.data) {

                    console.log(response);

                    callback({
                        draw: data.draw,
                        recordsTotal: response.data.TotalRecords,
                        recordsFiltered: response.data.FilteredRecords,
                        data: response.data.Records
                    });
                }
            }, false);
        },

        "columns": [
            {
                "orderable": true,
                data: null, render: function (data, type, row) {

                    if (row.LoginTime != null) {
                        var date = ChangeDateFormatToddMMYYY(row.LoginTime);
                    }
                    else {
                        var date = '';
                    }

                    return date;
                }
            },
            {
                "orderable": true,
                data: null, render: function (data, type, row) {

                    if (row.LoginTime != null) {
                        var date = formatDateTime(row.LoginTime);
                    }
                    else {
                        var date = '';
                    }

                    return date;
                }
            },
            {
                "orderable": true,
                data: null, render: function (data, type, row) {

                    if (row.LogoutTime != null) {
                        var date = formatDateTime(row.LogoutTime);
                    }
                    else {
                        var date = '';
                    }

                    return date;
                }
            },
            {
                "orderable": true,
                data: null, render: function (data, type, row) {

                    if (row.LoggedInMinutes != null) {
                        var date = formatSessionDuration(row.LoggedInMinutes);
                    }
                    else {
                        var date = '0 hours';
                    }

                    return date;
                }
            }

        ]
    });

    $('[data-toggle="tooltip"]').tooltip();

    // Re-initialize tooltips every time the table is redrawn
    indentTable.on('draw.dt', function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    TableSetup(indentTable)
}




function formatSessionDuration(minutes) {
    if (minutes == null) return "-"; // handle null or undefined values
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hours ${mins} minutes`;
}


//function BindUserLoginActivity() {

//    var TableID = 'UserActivityLog';

//    // Check if DataTable is already initialized, then destroy it
//    if ($.fn.DataTable.isDataTable("#UserActivityLog")) {
//        $("#UserActivityLog").DataTable().destroy();
//    }

//    $('#UserActivityLog').DataTable({
//        "processing": true,
//        "serverSide": true,  // Enables server-side processing
//        "paging": true,
//        "pagingType": "full_numbers",
//        "pageLength": 10,
//        "lengthMenu": [10, 20, 30, 40, 50],
//        "ordering": false,
//        "info": true,
//        "autoWidth": false,
//        "responsive": true,
//        "dom": '<"top">rt<"bottom"lip><"clear">',
//        "language": {
//            "paginate": {
//                "first": "<img src='../../assets/images/icons/help/double-left.png' alt=''>",
//                "previous": "<img src='../../assets/images/icons/help/arrow-left.png' alt=''>",
//                "next": "<img src='../../assets/images/icons/help/arrow-right.png' alt=''>",
//                "last": "<img src='../../assets/images/icons/help/double-right.png' alt=''>"
//            }
//        },
//        "ajax": function (data, callback, settings) {

//            var model = {
//                Type: 1,
//                fromDate: ChangeDateFormatSecond($('#pendingFromDateS').val()),
//                toDate: ChangeDateFormatSecond($('#pendingToDateS').val()),
//                Login_ID: id
//            }

//            var jsonData = JSON.stringify(model)

//            var obj =
//            {
//                modelData: jsonData,
//                start: data.start,      // Offset (where to start)
//                length: data.length,
//                search: '',
//                screenId: 'UserLog_001',// Number of records per page
//                //search: data.search.value, // Search term (if any)
//                OrderColumn: data.order.length > 0 ? data.columns[data.order[0].column].data : 'LoginTime',
//                OrderDir: data.order.length > 0 ? data.order[0].dir : "desc",
//            }
//            CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAsync', obj, 'GET', function (response) {

//                console.log(response);
//                if (response && response.data) {
//                    callback({
//                        draw: data.draw,
//                        recordsTotal: response.data.TotalRecords,   // Total records in DB
//                        recordsFiltered: response.data.FilteredRecords, // Filtered count
//                        data: response.data.Records // Actual page data
//                    });
//                }
//            }, false);
//        },
//        "drawCallback": function () {
//            $('.dropdown-toggle').dropdown(); // Reinitialize dropdowns after draw
//        },
//        "columns": [
//            {
//                "orderable": true,
//                data: null, render: function (data, type, row) {

//                    if (row.LoginTime != null) {
//                        var date = ChangeDateFormatToddMMYYY(row.LoginTime);
//                    }
//                    else {
//                        var date = '';
//                    }

//                    return date;
//                }
//            },
//            {
//                "orderable": true,
//                data: null, render: function (data, type, row) {

//                    if (row.LoginTime != null) {
//                        var date = formatDateTime(row.LoginTime);
//                    }
//                    else {
//                        var date = '';
//                    }

//                    return date;
//                }
//            },
//            {
//                "orderable": true,
//                data: null, render: function (data, type, row) {

//                    if (row.LogoutTime != null) {
//                        var date = formatDateTime(row.LogoutTime);
//                    }
//                    else {
//                        var date = '';
//                    }

//                    return date;
//                }
//            },
//            {
//                "orderable": true,
//                data: null, render: function (data, type, row) {

//                    if (row.LoggedInMinutes != null) {
//                        var date = formatSessionDuration(row.LoggedInMinutes);
//                    }
//                    else {
//                        var date = '0 hours';
//                    }

//                    return date;
//                }
//            }

//        ]
//    });
//    initCompleteCallback(TableID)

//}