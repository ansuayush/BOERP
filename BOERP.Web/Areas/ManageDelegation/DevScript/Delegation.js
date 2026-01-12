$(document).ready(function () {



    BindDelegation(0);
    BindInprocessDelegation(0);
    BindDelegationCompleted(0);



});






function BindDelegation(id) {

    var TableID = 'tableDelegation';

    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetDelegation', {id : id}, 'GET', function (response) {
       

        console.log(response);

        var table = $('#tableDelegation').DataTable({
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
                { "data": "RowNumber" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        const maxLength = 200; // Change this value to adjust the visible length
                        const fullText = row.DelName || '';
                        const truncatedText = fullText.length > maxLength ? fullText.substring(0, maxLength) + '...' : fullText;

                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + fullText + "' title=''>" + truncatedText + "</p>";
                    }
                },
                { "data": "Doer" },
                { "data": "Branch" },
                { "data": "PC" },
                { "data": "CreatedBy" },
                { "data": "EA" },
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

                        if (row.DoerId != username) {
                            strReturn = '<div class="d-flex"><a title="Edit" data-toggle="tooltip"  href="EditDelegation?auth=' + AuthToken + '&id=' + row.Id + '"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a><span class="divline"> | </span><a data-toggle="tooltip" title ="Complete Task On behalf of the Doer" class="Edit_13" href = "AddDoerDelegation?auth=' + AuthToken + '&id=' + row.Id + '&isEA=1" > <img src="/assets/images/icons/help/behalf-of-user-icon.png" alt="" class="action-image"></a ><span class="divline"> | </span><a  data-toggle="tooltip" title="" href="AddDelegation?auth=' + AuthToken + '&id=' + row.Id + '&isDuplicate=1" data-original-title="Duplicate"><img src="/assets/images/icons/help/copy-icon.png" alt="" class="action-image"></a></div> </div>';
                        }
                        else {
                            strReturn = '<a title="View"  href="ViewDelegation?auth=' + AuthToken + '&id=' + row.Id + '"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a><span class="divline" > | </span><a data-toggle="tooltip"  title = "Complete Task On behalf of the Doer" class="Edit_13" href = "AddDoerDelegation?auth=' + AuthToken + '&id=' + row.Id + '&isEA=1" > <img src="/assets/images/icons/help/behalf-of-user-icon.png" alt="" class="action-image"></a >';
                        }

                        return strReturn;
                    }
                }
            ]
        });
        // Initialize tooltips for the initial set of rows


        initCompleteCallback(TableID);

    });
    $('#' + TableID + '_filter').hide();
}

function BindInprocessDelegation(id) {

    var TableID = 'tableDelegationInProcess';

    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetDelegation', { id: id, Type: 1 }, 'GET', function (response) {
        

        console.log(response);

        var table = $('#tableDelegationInProcess').DataTable({
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
                { "data": "RowNumber" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + row.DelName + "' title=''>" + row.DelName + "</p>";
                    }
                },
                { "data": "Doer" },
                { "data": "Branch" },
                { "data": "PC" },
                { "data": "CreatedBy" },
                { "data": "EA" },
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

                        
                        strReturn = '<div class="d-flex"><a title="View" data-toggle="tooltip" href="AfterPendingDelegation?auth=' + AuthToken + '&id=' + row.Id + '"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a><span class="divline"> | </span><a  data-toggle="tooltip" title="" href="AddDelegation?auth=' + AuthToken + '&id=' + row.Id + '&isDuplicate=1" data-original-title="Duplicate"><img src="/assets/images/icons/help/copy-icon.png" alt="" class="action-image"></a></div> </div>';

                        return strReturn;
                    }
                }
            ]
        });
        // Initialize tooltips for the initial set of rows


        initCompleteCallback(TableID);

    });
    $('#' + TableID + '_filter').hide();

}

function BindDelegationCompleted(id) {

    var TableID = 'Deltableclosed';

    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetDelegation', { id: id, Type: 2 }, 'GET', function (response) {
       

        console.log(response);
        var table = $('#Deltableclosed').DataTable({
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
                { "data": "RowNumber" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + row.DelName + "' title=''>" + row.DelName + "</p>";
                    }
                },
                { "data": "Doer" },
                { "data": "Branch" },
                { "data": "PC" },
                { "data": "CreatedBy" },
                { "data": "EA" },
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



                        strReturn = '<div class="d-flex"><a title="View" data-toggle="tooltip" href="AfterPendingDelegation?auth=' + AuthToken + '&id=' + row.Id + '&isCompleted=1"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a><span class="divline"> | </span><a  data-toggle="tooltip" title="" href="AddDelegation?auth=' + AuthToken + '&id=' + row.Id + '&isDuplicate=1" data-original-title="Duplicate"><img src="/assets/images/icons/help/copy-icon.png" alt="" class="action-image"></a></div> </div>';

                        return strReturn;
                    }
                }
            ]
        });
        // Initialize tooltips for the initial set of rows


        initCompleteCallback(TableID);

    });
    $('#' + TableID + '_filter').hide();

}



window.onload = displaySuccessMessage;