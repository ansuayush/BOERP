
$(document).ready(function () {


    LoadMasterDropdown('ddlStatus', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 3,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);

    LoadMasterDropdown('ddlSent', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 5,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'All', false);

    // Debounced filter input
    $('#txtDocNumber').on('input', debounce(function () {
        if ($.fn.DataTable.isDataTable("#IndentTable")) {
            indentTable.ajax.reload();
        }
    }, 500));


    // BindData();
});
function OnchangeStatus() {
    bindItemMasterGridFilter();
}
var indentTable;

function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

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
            screenId: 'Indent_100',
            modelData: JSON.stringify({
                Status: $("#ddlStatus").val() === 'All' ? '0' : $("#ddlStatus").val(),
                Type: "",
                DocNumber: $("#txtDocNumber").val()
            })
        };
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tableData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'IndentIndex', columnMeta, tableData);
            $("#customLoader").hide();
        });
    }

});


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
        ActionType: 1,
        Module: 'Indent'
    }
    // Convert the model to JSON string
    const jsonString = JSON.stringify(indentModel);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "Indent_102",
        Operation: "D",  // Use Update for existing records, Add for new ones
        ModelData: jsonString
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        BindData();
    });
}