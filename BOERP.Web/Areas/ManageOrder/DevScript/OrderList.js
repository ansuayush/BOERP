
$(document).ready(function () {
    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 65,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlBrand', obj1, 'Select', false);
});

var orderItemTable;

//#region : Sale Order Gried Data
function bindSaleOrderGridFilter() {

    let filterData = tableData;

    var BrandId = $("#ddlBrand").val() === 'Select' ? '0' : $("#ddlBrand").val();

    if (BrandId != '0') {

        filterData = filterData.filter(row => row.BrandId == BrandId);
    }
   
    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindSaleOrderGrid();
});

function bindSaleOrderGrid() {
    $('#myGrid').html('');
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
            BrandId: $("#ddlBrand").val() == 'Select' ? '0' : $("#ddlBrand").val(),
            CreaterId: $("#ddlCreator").val() == 'All' ? '0' : $("#ddlCreator").val()

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'SaleOrderGried', columnMeta, tableData);
        $("#customLoader").hide();
    });
}

//#endregion

var orderId = 0;
var orderType = '';
function showDeleteModalByType(saleOrderId, saleOrderType) {
    $('#deleteSaleOrder').modal('show');

    orderId = saleOrderId;
    orderType = saleOrderType;
}

function deleteOrderByType() {
    var model = {
        TableId: orderId,
        Value: orderType,
        Type: 1
    }

    var jsonstring = JSON.stringify(model);

    let GenericModeldata = {
        ScreenID: "UpdateRecByType_101",
        Operation: "U",  // Use Update for existing records..
        ModelData: jsonstring
    };


    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            orderId = 0;
            orderType = '';
            $('#deleteSaleOrder').modal('hide');

            bindSaleOrderGrid();
        }

    });
}


function showArchiveModalByType(saleOrderId, saleOrderType) {
    $('#archiveOrder').modal('show');

    orderId = saleOrderId;
    orderType = saleOrderType;
}
function updateArchiveStatusByType(status) {
    var model = {
        TableId: orderId,
        Value: orderType,
        Status: status,
        Type: 2
    }

    var jsonstring = JSON.stringify(model);

    let GenericModeldata = {
        ScreenID: "UpdateRecByType_101",
        Operation: "U",  // Use Update for Archive Status existing records..
        ModelData: jsonstring
    };


    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            orderId = 0;
            orderType = '';
            $('#archiveOrder').modal('hide');

            bindSaleOrderGrid();
          
        }

    });
}


function printOrderReport(rowId, DocNo) {
    $.ajax({
        url: '/ManageOrder/PrintQualityCheckReport?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { OrderId: rowId, OrderDocNo: DocNo },
        xhrFields: {
            responseType: 'blob' // Important to handle binary data like PDF
        },
        beforeSend: function (request) {
            request.setRequestHeader('Auth', getCookieValue('AuthToken'));
        },
        success: function (data, status, xhr) {
            $("#customLoader").hide();
            const disposition = xhr.getResponseHeader('Content-Disposition');
            const isPdf = xhr.getResponseHeader('Content-Type') === 'application/pdf';

            if (!isPdf) {
                // If the content is not PDF, assume it's an error message
                FailToaster("You don't have the permission to print this record");
                return;
            }

            // Get filename from headers or fallback
            let filename = "Sample_Report.pdf";
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match != null && match[1]) {
                    filename = match[1].replace(/['"]/g, '');
                }
            }

            // Create a link and trigger download
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
        error: function (xhr) {
            $("#customLoader").hide();
            alert("Ajax Error: " + xhr.statusText || "Unknown error occurred");
        }
    });
}