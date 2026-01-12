function BOMNew() {

    localStorage.setItem('IsNew', true);
}

function BOMExisting() {

    localStorage.setItem('IsNew', false);
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
            screenId: 'ERP_Samp5_102',
            modelData: JSON.stringify({
                Item: '',
                Chemist: 0,
                Customer: 0,
                SampleType: 1,
                Type: 3
            })
        };
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tableData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'FGBOM', columnMeta, tableData);
            $("#customLoader").hide();
        });
    }

});


function setIsView(rowId) {

    localStorage.setItem('viewBOM', true);
    window.location.href = `CreateBOMFG?auth=${AuthToken}&bomId=${rowId}`
}

function setIsEdit(rowId) {


    localStorage.setItem('viewBOM', false);
    window.location.href = `CreateBOMFG?auth=${AuthToken}&bomId=${rowId}`
}