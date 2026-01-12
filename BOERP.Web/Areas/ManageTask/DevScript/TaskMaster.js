$(document).ready(function () {


   // BindTaskMaster();
   // BindTaskInactiveMaster();


    $('input[name="switchone"]').on('change', function (e) {
        if (e.target) {
            $('#confirmmsg').modal();
        }
    });


});



//function BindTaskMaster() {

//    if ($.fn.DataTable.isDataTable("#tabletaskmaster")) {
//        $("#tabletaskmaster").DataTable().destroy();
//    }

//    var TableID = 'tabletaskmaster';
//    CommonAjaxMethodTMS(baseURL + 'ManageTask/BindTaskMaster', null, 'GET', function (response) {
//        console.log(response);




//        var table = $('#tabletaskmaster').DataTable({
//            "paging": true,
//            "pagingType": "full_numbers",
//            "pageLength": 10,
//            "lengthMenu": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
//            "ordering": true,
//            "info": true,
//            "autoWidth": false,
//            "responsive": true,
//            "stateSave": false,
//            "dom": '<"top">rt<"bottom"lip><"clear">',
//            "language": {
//                "paginate": {
//                    "first": "<img src='../assets/images/icons/help/double-left.png' alt=''>",
//                    "previous": "<img src='../assets/images/icons/help/arrow-left.png' alt=''>",
//                    "next": "<img src='../assets/images/icons/help/arrow-right.png' alt=''>",
//                    "last": "<img src='../assets/images/icons/help/double-right.png' alt=''>"
//                }
//            },
//            "data": response.data.data.Table,
//             "stateSave": true, // Enable state saving
//            "columns": [
//                //{ "data": "RowNumber" },
//                {
//                    "orderable": true,
//                    data: null, render: function (data, type, row) {
//                        const maxLength = 200; // Change this value to adjust the visible length
//                        const fullText = row.TaskName || '';
//                        const truncatedText = fullText.length > maxLength ? fullText.substring(0, maxLength) + '...' : fullText;

//                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + fullText + "' title=''>" + truncatedText + "</p>";
//                    }
//                },
//                { "data": "Doer" },
//                { "data": "SecDoer" },
//                { "data": "BRANCH_NAME" },
//                { "data": "FrequencyName" },
//                {
//                    "orderable": true,
//                    data: null, render: function (data, type, row) {
//                        return "<label>" + getdatewithoutJson(row.StartDate) + "</label>";
//                    }
//                },
//                {
//                    "orderable": true,
//                    data: null, render: function (data, type, row) {
//                        return "<label>" + getdatewithoutJson(row.EndDate) + "</label>";
//                    }
//                },
//                {
//                    "orderable": false,
//                    data: null, render: function (data, type, row) {
//                        var strReturn = "";
//                        strReturn += `<div class="Del_9" >
//                                <input type="checkbox" class="checkbox" id="${row.Id}" onclick="set_delVariable(${row.Id})" ${row.isdeleted ? `data-target="#confirmationdeactivate"` : `data-target="#confirmation"`} switch="bool" ${!row.isdeleted ? `checked=""` : ``} >
//                                    <label for="${row.Id}" class="checkbox-label" >
//                                        <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
//                                            <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
//                                                <span class="ball"></span>
//                            </label>

//                        </div>`




//                        return strReturn;
//                    }
//                },
//                {
//                    "orderable": false,
//                    data: null, render: function (data, type, row) {
//                        return '<div class="text-center-sm action-btn-td"><a title="Edit" data-toggle="tooltip" class="Edit_1" href="AddTaskMaster?auth=' + AuthToken + '&id=' + row.Id + '"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a><span class="divline"> | </span><a  data-toggle="tooltip" title="" href="AddTaskMaster?auth=' + AuthToken + '&id=' + row.Id + '&isDuplicate=1" data-original-title="Duplicate"><img src="/assets/images/icons/help/copy-icon.png" alt="No Image" class="action-image"></a></div>';
//                    }
//                }
//            ]
//        });
//        // Initialize tooltips for the initial set of rows


//           initCompleteCallback(TableID);

//       // getModifyAccess(table, 1);

//    });
//    $('#' + TableID + '_filter').hide();



//}

let tblData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindItemMasterGrid();



});


function bindItemMasterGrid() {
    $('#myGrid').html('');
    $("#customLoader").show();

  

    CommonAjaxMethodTMS(baseURL + 'ManageTask/BindTaskMaster', null, 'GET', function (response) {
        console.log(response);
        tblData = response.data.data.Table;
        var columnMeta = response.data.data.Table1;
        gridOptions = bindAgGrid("#myGrid", 'TaskMaster', columnMeta, tblData);
        $("#customLoader").hide();
    });
}


function bindTaskInactiveMasterGrid() {
    $('#myGrid').html('');
    $("#customLoader").show();



    CommonAjaxMethodTMS(baseURL + 'ManageTask/BindTaskInactiveMaster', null, 'GET', function (response) {
        console.log(response);
        tblData = response.data.data.Table;
        var columnMeta = response.data.data.Table1;
        gridOptions = bindAgGrid("#myGrid", 'InactiveTaskMaster', columnMeta, tblData);
        $("#customLoader").hide();
    });
}


function BindTaskInactiveMaster() {

    var TableID = 'tableInactivetaskmaster';


    if ($.fn.DataTable.isDataTable("#tableInactivetaskmaster")) {
        $("#tableInactivetaskmaster").DataTable().destroy();
    }


    CommonAjaxMethodTMS(baseURL + 'ManageTask/BindTaskInactiveMaster', null, 'GET', function (response) {
        console.log(response);

      


        var table = $('#tableInactivetaskmaster').DataTable({
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
             "stateSave": false, // Enable state saving
            "columns": [
                //{ "data": "RowNumber" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        const maxLength = 200; // Change this value to adjust the visible length
                        const fullText = row.TaskName || '';
                        const truncatedText = fullText.length > maxLength ? fullText.substring(0, maxLength) + '...' : fullText;

                        return "<p class='ellipsis-td' data-toggle='tooltip' data-original-title='" + fullText + "' title=''>" + truncatedText + "</p>";
                    }
                },
                { "data": "Doer" },
                { "data": "SecDoer" },
                { "data": "Branchname" },
                { "data": "FrequencyName" },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<label>" + getdatewithoutJson(row.StartDate) + "</label>";
                    }
                },
                {
                    "orderable": true,
                    data: null, render: function (data, type, row) {
                        return "<label>" + getdatewithoutJson(row.EndDate) + "</label>";
                    }
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        var strReturn = "";
                        strReturn += `<div class="d-flex td-action-btn">
                        <a href="" disabled data-toggle="modal">
                        <i ${row.isdeleted ? `class="fa fa-times-circle red-crl"` : `class="fa fa-check-circle checkgreen"`} data-toggle="tooltip" title="" aria-hidden="true"  ${row.isdeleted ? `data-original-title=""` : `data-original-title="Click to DeActivate"`}></i>
                        </a></div>`
                        return strReturn;                         
                    }                     
                },
                {
                    "orderable": false,
                    data: null, render: function (data, type, row) {
                        return '<div class="text-center-sm action-btn-td"><a title="Edit" data-toggle="tooltip" class="Edit_1" href="AddTaskMaster?auth=' + AuthToken + '&id=' + row.Id + '"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a><span class="divline"> | </span><a data-toggle="tooltip" title="" href="AddTaskMaster?auth=' + AuthToken + '&id=' + row.Id + '&isDuplicate=1" data-original-title="Duplicate"><img src="/assets/images/icons/help/copy-icon.png" alt="" class="action-image"></a></div>';
                    }
                }
            ]
        });
        // Initialize tooltips for the initial set of rows
        $('[data-toggle="tooltip"]').tooltip();

        // Re-initialize tooltips every time the table is redrawn
        table.on('draw.dt', function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        // Set the value of the dropdown to 10
        $('select[name="tabletaskmaster_length"]').val(10).trigger('change');

           initCompleteCallback(TableID);

        //getModifyAccess(table, 1);


    });

    $('#' + TableID + '_filter').hide();
}


var deleteId;
var del_id;


function set_delVariable(id) {

    
    deleteId = id;
    del_id = id;

    $('#confirmmsg').modal('show');
}

function deleteTask() {

    $('#confirmmsg').modal('hide');
 

        var date = new Date();

        var deleteObj = {
            TaskDate: date,
            ID: deleteId,
            Type: 2,

        }
        var TaskModel = {
            TaskMasterModel: deleteObj,
            QuestionModel: null


    }
    CommonAjaxMethodTMS(baseURL + 'ManageTask/DeleteTaskMasterById', TaskModel, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            window.location.href = window.location.href;
            }
        });    
}

function closeEmpDel() {


    if ($(`${del_id}`).prop('checked')) {

        $(`#${del_id}`).prop('checked', false);

    }
    else {
        $(`#${del_id}`).prop('checked', true);
    }

}


function RedirectTaskMasterRequest() {

    var url = "/ManageTask/TaskMaster?auth=" + AuthToken;
    window.location.href = url;

}



window.onload = displaySuccessMessage;

