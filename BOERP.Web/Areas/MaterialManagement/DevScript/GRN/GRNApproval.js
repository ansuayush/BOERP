
$(document).ready(function () {

    LoadMasterDropdown('ddlSupplier', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);


    LoadMasterDropdown('ddlStatus', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 2,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false, '1');

    LoadMasterDropdown('ddlCreator', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 4,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);



    //$("#txtDocNumber").on("input", function () {
    //    var searchValue = $(this).val().trim();

    //    if (searchValue.length >= 2) { // Only filter if 2+ chars or empty
    //        BindData();
    //    }
    //});
    //$("#txtSuppName").on("input", function () {
    //    var searchValue = $(this).val().trim();

    //    if (searchValue.length >= 2) { // Only filter if 2+ chars or empty
    //        BindData();
    //    }
    //});

    //$('#txtDocNumber').on('input', debounce(function () {
    //    if ($.fn.DataTable.isDataTable("#tblGRNApproval")) {
    //        tblGRNApprovalTable.ajax.reload();
    //    }
    //}, 500));
    //$('#txtSuppName').on('input', debounce(function () {
    //    if ($.fn.DataTable.isDataTable("#tblGRNApproval")) {
    //        tblGRNApprovalTable.ajax.reload();
    //    }

    //}, 500));

    //BindData();
});

//function debounce(func, wait) {
//    let timeout;
//    return function () {
//        clearTimeout(timeout);
//        timeout = setTimeout(() => func.apply(this, arguments), wait);
//    };
//}

//function OnchageBindGrid(ctrlId) {
//    BindData(ctrlId);
//}



function bindItemMasterGridFilter() {

    let filterData = tableData;

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    if (Status != '0') {

        filterData = tableData.filter(row => row.StatusId == Status);

    }

    if (filterData.length > 0) {

        gridOptions.api.setRowData(filterData);

    } else {
        if (globalGridOptions != null)
            gridOptions.api.setRowData([]);

    }

}

let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindItemMasterGrid();



    function bindItemMasterGrid() {
        $("#customLoader").show();


        //Replaceable content
        //Start
        var requestData = {
            start: 0,
            length: 20000000,
            search: '',
            orderColumn: null,
            orderDir: "asc",
            screenId: 'GRN_Approval_100',//Need to change the screen id as per your data
            modelData: JSON.stringify(
                {

                    DocNumber: "",
                    Supplier: "",
                    SupplierId: 0,
                    CreaterId: 0,
                    Status: "0",
                    Type: ""
                })
        };
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tableData = response.data.Records;
            var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();
            var filterData = [];
            if (Status != '0') {

                filterData = tableData.filter(row => row.StatusId == Status);
            }
            else {
                filterData = tableData;
            }

            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'GRNApproval', columnMeta, filterData);

            $("#customLoader").hide();
        });
    }

});




function PurchaseOrderPrint(ctrl) {
    var url = "../../MaterialManagement/Material/PurchaseOrderPrint?auth=" + AuthToken + "&id=" + ctrl;
    window.location.href = url;
}



function GetGrnItemId(GrnId) {

    var model =
    {
        GRNID: GrnId
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'GRNEntry_101' }, 'GET', function (response) {

        console.log(response);

        var grnItems = response.data.data.Table1;

        for (var i = 0; i < grnItems.length; i++) {
            PrintARN_Label(grnItems[i].GRNItemId, grnItems[i].GRNDocNo);

        }

    });

}

function PrintARN_Label(GRNItemId, GRNDocNo) {
    $('#customloader').show();
    $.ajax({
        url: '/ManageQualityCheck/ManageQualityCheck/PrintARN_Label?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { GRNItemId: GRNItemId, GRNDocNo: GRNDocNo },
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
            let filename = "ARN Label.pdf";
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
            $('#customloader').hide();
        },
        error: function (xhr) {
            alert("Ajax Error: " + xhr.statusText || "Unknown error occurred");
            $('#customloader').hide();
        }
    });
}

function PrintARN_Label(GRNItemId, GRNDocNo) {
    $.ajax({
        url: '/ManageQualityCheck/ManageQualityCheck/PrintARN_Label?Auth=' + AuthToken, // API endpoint
        method: 'GET',
        data: { GRNItemId: GRNItemId, GRNDocNo: GRNDocNo },
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
            let filename = "ARN Label.pdf";
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


function RedirectToPurchaseOrder(ctr) {

    var url = "../../MaterialManagement/Material/CreatePurchaseOrder?auth=" + AuthToken + "&id=0&suppId=" + ctr.value;
    window.location.href = url;


}

function OpenIndentPopup(docN) {
    $('#hdnIndentId').val(docN);
    var dNumber = $('#hdnIndentDocNumber_' + docN).val();
    $('#spIndentDocNumber').text(dNumber);
    $('#btnInactivePopup').trigger('click');
}

function InactiveAction() {
    var indentModel =
    {
        ERPIndentID: $('#hdnIndentId').val(),
        Remark: '',
        IsApproved: 0,
        ActionType: 1
    }
    // Convert the model to JSON string
    const jsonString = JSON.stringify(indentModel);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "MaterialPurchase_101",
        Operation: "D",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        BindData();
    });
}
