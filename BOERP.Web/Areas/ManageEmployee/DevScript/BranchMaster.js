$(document).ready(function () {

    

    //BindBranchMaster();


});


let tblData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindItemMasterGrid();



});


function bindItemMasterGrid() {
    $('#myGrid').html('');
    $("#customLoader").show();

    //Replaceable content
    //Start
   
    //End

    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/BindBranchMaster', null, 'GET', function (response) {
        console.log(response);
        tblData = response.data.data.Table;
        var columnMeta = response.data.data.Table1;
        gridOptions = bindAgGrid("#myGrid", 'Branch', columnMeta, tblData);
        $("#customLoader").hide();
    });
}


//function BindBranchMaster() {

//    var TableID = 'tablebranch';

//    CommonAjaxMethodTMS(baseURL + 'ManageEmployee/BindBranchMaster', null, 'GET', function (response) {
//        console.log(response);



//       var table = $('#tablebranch').DataTable({
//            "processing": true, // for show progress bar           
//            "destroy": true,
//            "info": false,
//            "lengthChange": false,
//            "bFilter": true,
//            "bSort": false,
//            "data": response.data.data.Table,
//             "stateSave": true, // Enable state saving
//            "columns": [
//                //{ "data": "RowNumber" },
//                { "data": "BranchUserID" },
//                { "data": "BranchName" },
//                { "data": "BranchManagerName" },          
//                { "data": "email" },
//                {
//                    "orderable": false,
//                    data: null, render: function (data, type, row) {
//                        var strReturn = "";
//                        strReturn = '<a title="Edit" class="Edit_5"   href="AddBranchMaster?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';

//                        return strReturn;
//                    }
//                }


//            ]
//        });

//       // getModifyAccess(table, 5);
//        initCompleteCallback(TableID);
//    });

//}



window.onload = displaySuccessMessage;