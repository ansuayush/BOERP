
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

    LoadMasterDropdown('ddlSupp', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'Select', false);

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

    //    //if (searchValue.length >= 2) { // Only filter if 2+ chars or empty
    //    //     BindData();
    //    //}
    //});
    //$("#txtSuppName").on("input", function () {
    //    var searchValue = $(this).val().trim();

    //    //if (searchValue.length >= 2) { // Only filter if 2+ chars or empty
    //    //      BindData();
    //    //}
    //});

    //$('#txtDocNumber').on('input', debounce(function () {
    //    if ($.fn.DataTable.isDataTable("#tblPurchaseOrder")) {
    //        indentTable.ajax.reload();
    //    }
    //}, 500));
    //$('#txtSuppName').on('input', debounce(function () {
    //    if ($.fn.DataTable.isDataTable("#tblPurchaseOrder")) {
    //        indentTable.ajax.reload();
    //    }

    //}, 500));


    // BindData();
});

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}
function OnchageBindGrid(ctrlId) {
    BindData(ctrlId);
}

var indentTable;




function PurchaseOrderPrint(ctrl) {
    var url = "../../MaterialManagement/Material/PurchaseOrderPrint?auth=" + AuthToken + "&id=" + ctrl;
    window.location.href = url;
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

//AGgried Data

function bindPOApprovalGridFilter() {

    let filterData = tableData;

    var Supplier = $("#ddlSupplier").val() === 'All' || $("#ddlSupplier").val() == null ? '' : $("#ddlSupplier option:selected").html();

    var Status = $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val();

    var Creator = $("#ddlCreator").val() === 'All' || $("#ddlCreator").val()  == null ? '' : $("#ddlCreator option:selected").html();

    if (Supplier != '') {
        filterData = filterData.filter(row => row.Supplier.toLowerCase() == Supplier.toLowerCase());
    }
    if (Status != '0') {

        filterData = filterData.filter(row => row.StatusId == Status);

    }
    if (Creator != '') {
        filterData = filterData.filter(row => row.USER_NAME.toLowerCase() == Creator.toLowerCase());
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
    bindPOApprovalGrid();

    function bindPOApprovalGrid() {
        $("#customLoader").show();

        //var st = 0;
        //if (ctrlId == undefined) {
        //    st = 1;
        //    await waitUntilDropdownReady("#ddlStatus");
        //    $("#ddlStatus").val(1).trigger('change');
        //}
        //else {
        //    st = $("#ddlStatus").val() == 'All' ? '0' : $("#ddlStatus").val();
        //}

        //Replaceable content
        //Start
        var requestData = {
            start: 0,
            length: 20000000,
            search: '',
            orderColumn: null,
            orderDir: "asc",
            screenId: 'PO_Approval_100',//Need to change the screen id as per your data
            //modelData: jsonString,
            modelData: JSON.stringify({
                Status: 0,
                Type: "",
                DocNumber: $("#txtDocNumber").val(),
                Supplier: $("#txtSuppName").val(),
                SupplierId: $("#ddlSupplier").val() == 'All' ? '0' : $("#ddlSupplier").val(),
                CreaterId: $("#ddlCreator").val() == 'All' ? '0' : $("#ddlCreator").val()
            })
        };
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tableData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'POApprovalGried', columnMeta, tableData);
            bindPOApprovalGridFilter();
            $("#customLoader").hide();
        });
    }

});

//#endregion
