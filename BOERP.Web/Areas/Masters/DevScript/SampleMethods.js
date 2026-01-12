function SaveSample() {

    var model = {
        Id: "12",
        FirstName: "Santosh"
    }
    const jsonString = JSON.stringify(model);

    let GenericModeldata =
    {
        ScreenID: "C100",
        Operation: "add",
        ModelData: jsonString,
        Rows: {
            Data: [{
                RowIndex: 0,
                KeyName: "CommAssingmentSubmission_Id",
                ValueData: "23"
            }, {
                RowIndex: 0,
                KeyName: "CommAssignmentEvaluation_Id",
                ValueData: "25"
            }, {
                RowIndex: 0,
                KeyName: "MarkObtained",
                ValueData: "test"
            }, {
                RowIndex: 0,
                KeyName: "Remarks",
                ValueData: "26"
            }]
        }
    };


    CommonAjaxMethod(virtualPath + 'Generic/PerformOperation', GenericModeldata, 'POST', function (response) {


    });

}

function GetSample() {
    var model = {
        Id: "12",
        FirstName: "Santosh"
    }
    const jsonString = JSON.stringify(model);
    var ScreenID = "C100";



    CommonAjaxMethod(virtualPath + 'Generic/GetRecords', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {

    });


}