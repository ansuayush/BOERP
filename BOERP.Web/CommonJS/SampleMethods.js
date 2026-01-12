function SaveSample() {

    
     
    var model = {
        "id": 1,
        "name": "John Doe",
        "age": 30,
        "contactDetails": {
            "email": "john.doe@example.com",
            "phone": "+1234567890",
            "address": {
                "street": "123 Elm Street",
                "city": "Metropolis",
                "state": "CA",
                "zipCode": "12345"
            }
        },
        "educationDetails": [
            {
                "degree": "Bachelor of Science",
                "fieldOfStudy": "Computer Science",
                "institution": "Tech University",
                "startDate": "2010-09-01",
                "endDate": "2014-06-01",
                "grade": "A"
            },
            {
                "degree": "Master of Science",
                "fieldOfStudy": "Data Science",
                "institution": "Advanced Institute",
                "startDate": "2015-09-01",
                "endDate": "2017-06-01",
                "grade": "A+"
            }
        ],
        "employmentDetails": [
            {
                "companyName": "Tech Solutions Inc.",
                "role": "Software Developer",
                "startDate": "2017-08-01",
                "endDate": "2020-12-31"
            },
            {
                "companyName": "Innovatech Corp.",
                "role": "Data Scientist",
                "startDate": "2021-01-01",
                "endDate": null
            }
        ]
    }

    var salaryData = {
        'LockSalary': model
        }
    const jsonString = JSON.stringify(salaryData);

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


    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {


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