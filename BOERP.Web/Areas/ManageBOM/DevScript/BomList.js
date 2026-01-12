




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
                Type: 2
            })
        };
        //End

        CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
            console.log(response);
            tableData = response.data.Records;
            var columnMeta = response.data.ColumnData;
            gridOptions = bindAgGrid("#myGrid", 'BOM', columnMeta, tableData);
            $("#customLoader").hide();
        });
    }

});


function setIsView() {

    localStorage.setItem('viewBOM', true);
}

function setIsEdit() {


    localStorage.setItem('viewBOM', false);
}