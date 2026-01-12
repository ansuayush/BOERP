


let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindSaleOrderGrid();
});


function getO2DPrivateLabelFMSs(order_itemid, TaskId) {

    if (TaskId == 1) {
        localStorage.setItem('Order_ItemID', order_itemid);
        window.location.href = `/ManageOrder/VerifySFGBOM?auth=${AuthToken}`;
    }
    else if (TaskId == 2) {
        localStorage.setItem('Order_ItemID', order_itemid);
        window.location.href = `/ManageOrder/VerifyPMBOM?auth=${AuthToken}`;
    }
    else if (TaskId == 3) {

        localStorage.setItem('Order_ItemID', order_itemid);
        window.location.href = `/ManageOrder/GrossMarginApprove?auth=${AuthToken}`;
    }
}
function bindSaleOrderGrid() {
    $("#customLoader").show();

    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'SaleOrderItem_102',//Need to change the screen id as per your data
        //modelData: jsonString,
        modelData: JSON.stringify({

            Type: 4

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'O2DPLGriedFMS', columnMeta, tableData);
        $("#customLoader").hide();
    });
}


function showTaskModal(id, authToken, FMS_Id) {
    $.get('/Account/GetTaskStatusModal', { id: id, auth: authToken, FMS_Id: FMS_Id, }, function (data) {
        $('#yourModalContainer').html(data);
        $('#viewstatus').modal('show');
    });
}