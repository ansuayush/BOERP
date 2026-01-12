
$(document).ready(function ()
{
    resetTimers(1);

});

var DropDownTypeEnum = {

    Category: 1,
    FundedBy: 2,
    ProjectCode: 3,
    ProjectName: 4,
    ThematicArea: 5,
    PlaceOfOrigin: 6,
    ProjectLead: 7,
    Tag: 8,
    Document: 9,
    Author: 10,
    Source: 11,
    ProcurementVenderType: 13,
    ProcurementRelationshipMaster: 14,
    ProcurementGoodAndServicesCategory: 15,
    ProcurementPurpose: 16,
    ProcurementBankDetails: 17,
    SubCategory: 101,
    RiskType: 102,


};

var ManaulTableEnum = {

    MasterThematicArea: 1,
    Employee: 2,
    Project: 3,
    MasterLocation: 4,
    TagWithThemetic: 5,
    Donar: 6,
    Year: 7,
    TagWithThematic: 8,
    State: 9,
    ProcurementVenderTypeNo: 10,
    ProcurementVenderTypeYes: 11,
    EmployeeWithoutLWD: 12,
    Vendor: 13,
    Designation: 14,
};

function HideErrorMessage(ctrl) {
    $('#sp' + ctrl.id).hide();
}
function checkValidationOnSubmitWithoutMessage(Mandatory) {

    var x = document.getElementsByClassName(Mandatory);
    x.innerHTML = '';
    var isMandatory = true;
    for (var i = 0; i < x.length; i++) {
        var extactValue = jQuery.trim(x[i].value);
        if ((extactValue == "") || (extactValue == "Select")) {
            if (extactValue == "Select") {
                var ctrlid = 'select2-' + x[i].id + '-container';
                var ctrl = document.getElementById(ctrlid);
                ctrl.classList.add("errorValidation");
            }
            else {

                x[i].classList.add("errorValidation");
            }

            isMandatory = false;
        }

    }
    if (!isMandatory) {
        FailToaster("Hey, You missed this field! Please check the highlighted fileds.");
        return false;
    }
    return isMandatory;
}
function checkValidationOnSubmitWithoutMessage(Mandatory) {

    var x = document.getElementsByClassName(Mandatory);
    x.innerHTML = '';
    var isMandatory = true;
    for (var i = 0; i < x.length; i++) {
        var extactValue = jQuery.trim(x[i].value);
        if ((extactValue == "") || (extactValue == "Select")) {
            if (extactValue == "Select") {
                var ctrlid = 'select2-' + x[i].id + '-container';
                var ctrl = document.getElementById(ctrlid);
                ctrl.classList.add("errorValidation");
            }
            else {

                x[i].classList.add("errorValidation");
            }

            isMandatory = false;
        }

    }
    if (!isMandatory) {
        FailToaster("Hey, You missed this field! Please check the highlighted fileds.");
        return false;
    }
    return isMandatory;
}
//This function is used to set comma in numbes
function NumberWithComma(inputNo) {
    if (inputNo == null) {
        return '';
    }
    else {
        return inputNo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        //return inputNo.toLocaleString('en-US'); 
    }

}

function checkValidationOnSubmit(Mandatory) {

    var x = document.getElementsByClassName(Mandatory);
    x.innerHTML = '';
    var isMandatory = true;
    for (var i = 0; i < x.length; i++) {
        var extactValue = jQuery.trim(x[i].value);
        if ((extactValue == "") || (extactValue == "Select") || (extactValue == "Choose Your Category")) {

            if ($('#dv' + x[i].id).length > 0) {
                if ($('#dv' + x[i].id).css('display') != 'none') {

                    $('#sp' + x[i].id).show();
                    x[i].classList.add("errorValidation");
                    isMandatory = false;
                }

            }
            else {
                $('#sp' + x[i].id).show();
                x[i].classList.add("errorValidation");
                isMandatory = false;
            }

        }
        else {
            x[i].classList.remove("errorValidation");
            $('#sp' + x[i].id).hide();
        }
    }
    if (!isMandatory) {
        //var mobileerrormsg = "Hey, You missed this field! (*)..";
        //var x = document.getElementById("toastmsg");
        //x.innerHTML = '<p class="yellow">' + mobileerrormsg + '!</p>';
        ////var x = document.getElementById("toastmsg");
        //x.className = "show";
        //setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        return false;
    }
    return isMandatory;
}

function getErrorMessage(request, status) {

    if (request.status === 0) {
        return ('We are not able to communicate to  server.\nPlease verify your network connection and ensure  you are connected to internet.');
    } else if (request.status == 404) {
        return ('The requested page not found. [404]');
    } else if (request.status == 500) {
        return ('Something went wrong Please contact admin.');
    } else if (request.status == 401) {
        return ('Unauthorized access or your token expired. Please login again.');
    } else if (status === 'parsererror') {
        return ('Requested JSON parse failed.');
    } else if (status === 'timeout') {
        return ('Time out error.');
    } else if (status === 'abort') {
        return ('Ajax request aborted.');
    } else {
        return ('Uncaught Error.\n' + request.responseText);
    }
}
function handleError(request, status, error) {

    // FailToaster("Something went wrong.Please contact Admin.");
    FailToaster(getErrorMessage(request, status));
    //var x = document.getElementById("hReturnMessage");

}


function BindTarget() {

    CloseLoadingDialog();
}
//function uploadFile() {
//    try {
//        const jsonString = JSON.stringify({ FolderNames: /Category/Data, FileName: "data.txt" ,FileSize: "32423423"});
//        const type = 1; // Example type value
//        const result = await FileUploadAsyncWithAuth("fileElementId", jsonString, type);
//        console.log("Upload result:", result);
//    } catch (error) {
//        console.error("Error during upload:", error);
//    }
//}
function MultiFileUploadWithoutAync(fileElementId, jsonString, type, fileDataCollection) {
    return new Promise(function (resolve, reject) {
        const fileUpload = document.getElementById(fileElementId);
        const files = fileDataCollection;
        var fileCollectionArray = [];
        if (files.length === 0) {
            //  return fileCollectionArray
            resolve(fileCollectionArray);
        }
        else {
            const formData = new FormData();
            // Create FormData object
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }

            formData.append("jsonString", jsonString); // Add additional metadata
            formData.append("type", type); // Add file type

            // Perform AJAX request
            $.ajax({
                url: virtualPath + "ContentManagement/MultiFileUploadAsyncWithAuth?jsonString=" + jsonString + "&type=" + type, // Update with your API endpoint
                type: "POST",
                contentType: false, // Allow multipart/form-data
                processData: false, // Prevent jQuery from transforming the FormData
                beforeSend: function (request) {
                    request.setRequestHeader('Auth', getCookieValue('AuthToken'));
                    request.setRequestHeader('ClientSecret', getCookieValue('ClientSecret'));
                    request.setRequestHeader('ClientAccessKey', getCookieValue('ClientAccessKey'));

                },
                data: formData,
                success: function (response) {
                    if (response) {
                        console.log("File upload successful:");
                        resolve(response); // Resolve with the response data
                    } else {
                        reject("Unexpected response from the server.");
                    }
                },
                error: function (xhr) {
                    console.error("Error during file upload:", xhr.responseText || xhr.statusText);
                    reject(xhr.responseText || xhr.statusText); // Reject with error details
                }
            });
        }
    });
}

function FileUploadWithoutAync(fileElementId, jsonString, type) {
    return new Promise(function (resolve, reject) {
        const fileUpload = document.getElementById(fileElementId);
        const files = fileUpload.files;

        if (files.length === 0) {
            reject("Please select a file to upload.");
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append("file", files[0]); // Add the first file
        formData.append("jsonString", jsonString); // Add additional metadata
        formData.append("type", type); // Add file type

        // Perform AJAX request
        $.ajax({
            url: virtualPath + "ContentManagement/FileUploadAsyncWithAuth?jsonString=" + jsonString + "&type=" + type, // Update with your API endpoint
            type: "POST",
            contentType: false, // Allow multipart/form-data
            processData: false, // Prevent jQuery from transforming the FormData
            beforeSend: function (request) {
                request.setRequestHeader('Auth', getCookieValue('AuthToken'));
                request.setRequestHeader('ClientSecret', getCookieValue('ClientSecret'));
                request.setRequestHeader('ClientAccessKey', getCookieValue('ClientAccessKey'));

            },
            data: formData,
            success: function (response) {
                if (response) {
                    console.log("File upload successful:");
                    resolve(response); // Resolve with the response data
                } else {
                    reject("Unexpected response from the server.");
                }
            },
            error: function (xhr) {
                console.error("Error during file upload:", xhr.responseText || xhr.statusText);
                reject(xhr.responseText || xhr.statusText); // Reject with error details
            }
        });
    });
}

//function uploadFile() {
//     const jsonString = JSON.stringify({ FolderNames: /Category/Data, FileName: "data.txt" ,FileSize: "32423423"});
//    const type = 1; // Example type value

//    FileUploadWithAuth("fileElementId", jsonString, type)
//        .then(function (result) {
//            console.log("Upload result:", result);
//            // Perform actions with the result
//        })
//        .catch(function (error) {
//            console.error("Error during upload:", error);
//            // Handle errors
//        });
//}


function CommonDownloadFile(fileURl, fileName) {

    if (fileURl != null || fileURl != undefined) {
        var stSplitFileName = fileName.split(".");
        var link = document.createElement("a");
        link.download = stSplitFileName[0];
        link.href = fileURl;
        link.click();
    }
}

//function getCookieValue(cookieName) {
//    const cookies = document.cookie.split(';');
//    for (let cookie of cookies) {
//        cookie = cookie.trim();
//        if (cookie.startsWith(cookieName + '=')) {
//            return cookie.substring(cookieName.length + 1);
//        }
//    }
//    return null; // Return null if the cookie is not found
//}
function getCookieValue(keyName) {
    let value = "";
    if (keyName == 'ClientSecret') {
        value = ClientSecret;
    }
    else if (keyName == 'ClientAccessKey') {
        value = ClientAccessKey;
    }
    else {
        value = AuthToken;
    }

    return value ? value : null; // Return null if not found
}

//function CommonAjaxMethod(actionMethodUrl, data, methodType, successCallBack, isPost) {
//    var isSuccess = false;
//     //ShowLoadingDialog()
//    var dataObj;
//    if (methodType == "GET") {
//        dataObj = data;
//    }
//    else {
//        dataObj = JSON.stringify(data);
//    }

//    $.ajax({
//        async: false,
//        type: methodType,
//        url: actionMethodUrl,
//        data: dataObj,
//        beforeSend: function (request) {
//            request.setRequestHeader('Auth', getCookieValue('AuthToken'));
//            request.setRequestHeader('ClientSecret', getCookieValue('ClientSecret'));
//            request.setRequestHeader('ClientAccessKey', getCookieValue('ClientAccessKey'));

//        },
//        contentType: 'application/json',
//        success: function (res) {
//            //CloseLoadingDialog();
//            //ShowandCloseLoader();
//            var response = JSON.parse(res.Data);
//            var d = actionMethodUrl;
//            if (response.CustumException == "" || response.CustumException == null || response.CustumException == undefined) {

//                if (successCallBack && methodType == "POST" && isPost == true) {
//                    if (response.ErrorMessage == "" || response.ErrorMessage == null || response.ErrorMessage == undefined) {
//                        var responseObj =
//                        {
//                            data: response
//                        }
//                        successCallBack(responseObj);
//                        return;
//                    }
//                    else {
//                        if (response.ErrorMessage != 'amendmendamount') {
//                            if (response.ErrorMessage != "")
//                                SuccessToaster(response.ErrorMessage);
//                        }
//                        //document.getElementById('hReturnMessage').innerHTML = response.ErrorMessage;
//                        //$('#btnShowModel').click();
//                        //x.innerHTML = '<p class="green">' + response.ErrorMessage + '!</p>';
//                        //x.className = "show";
//                        //setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
//                    }
//                }
//                else if (successCallBack && methodType == "GET") {
//                    if (response.ErrorMessage == "" || response.ErrorMessage == null || response.ErrorMessage == undefined) {
//                        var responseObj =
//                        {
//                            data: response
//                        }
//                        successCallBack(responseObj);
//                        return;
//                    }
//                    else {


//                        if (response.ErrorMessage != 'amendmendamount') {
//                            if (response.ErrorMessage != "")
//                                SuccessToaster(response.ErrorMessage);
//                        }
//                        //document.getElementById('hReturnMessage').innerHTML = response.ErrorMessage;
//                        //$('#btnShowModel').click();
//                        //x.innerHTML = '<p class="green">' + response.ErrorMessage + '!</p>';
//                        //x.className = "show";
//                        //setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
//                    }
//                }
//                else {

//                    processMethodType(methodType, response.ErrorMessage, response.ValidationInput);

//                    if (successCallBack) {
//                        successCallBack(response);
//                    }
//                    //This method should be declared in calling page js to get result.
//                    //  FormControlValueClear(true);

//                }
//            }
//            else {
//                // var x = document.getElementById("hReturnMessage");
//                FailToaster(response.CustumException);

//                //document.getElementById('hReturnMessage').innerHTML = response.CustumException;
//                //$('#btnShowModel').click();
//                //  x.innerHTML = '<p class="green">' + response.CustumException + '!</p>';
//                // x.className = "show";
//                //setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
//            }

//        },
//        error: function (request, status, error) {
//            CloseLoadingDialog();        
//            if (error.name == 'NetworkError')
//            {
//                FailToaster("Server is unable to connect.");
//            }
//            else if (error == 'Unauthorized')
//            {
//                FailToaster("Unauthorized Access.");
//            }
//            else
//            {               
//                var Edata = JSON.parse(JSON.parse(request.responseText).Data).ErrorMessage;
//                if (Edata == null || Edata == undefined) {
//                    FailToaster("Something went Wrong.Please see the logs.");
//                }
//                else {
//                    FailToaster(Edata);
//                }
//            }


//            console.log("Status: ", status);
//            console.log("Error: ", error);
//            console.log("Response Text: ", request.responseText); // Detailed error message
//            console.log("Request Object: ", request);
//            handleError(request, status, error);
//            isSuccess = false;
//        }
//    }); // done
//    return isSuccess;
//}
function CommonAjaxMethod(url, data, methodType = "GET", successCallback = null, isPost = false) {
   // $("#customLoader").show();


    CommonMethodWithCallback(url, data, methodType, isPost)
        .then(res => {
            if (typeof successCallback === 'function') {
              
                successCallback(res);
            }
        })
        .catch(err => {
            console.error("AJAX Error:", err);
           
            // Optional: toaster fallback
            FailToaster(err);
        }).finally(() => {
            //$("#customLoader").hide(); // Always hide loader in the end
        });;
}

function CommonMethodWithCallback(actionMethodUrl, data, methodType = "GET", isPost = false) {
    return new Promise((resolve, reject) => {
        const dataObj = methodType === "GET" ? data : JSON.stringify(data);

        $.ajax({
            async: true,
            type: methodType,
            url: actionMethodUrl,
            data: dataObj,
            contentType: 'application/json',
            beforeSend: function (request) {
                request.setRequestHeader('Auth', getCookieValue('AuthToken'));
                request.setRequestHeader('ClientSecret', getCookieValue('ClientSecret'));
                request.setRequestHeader('ClientAccessKey', getCookieValue('ClientAccessKey'));
            },
            success: function (res) {
                const isEmpty = val => val === "" || val == null || val === undefined;

                let response;
                try {
                    response = typeof res.Data === "string" ? JSON.parse(res.Data) : res.Data;
                } catch (e) {
                    return reject("Invalid response format.");
                }

                if (!isEmpty(response.CustumException)) {
                    FailToaster(response.CustumException);
                    return reject(response.CustumException);
                }

                //if (!isEmpty(response.ErrorMessage) && response.ErrorMessage !== 'amendmendamount') {
                //    SuccessToaster(response.ErrorMessage);
                //    return reject(response.ErrorMessage);
                //}

                if ((methodType === "POST" && isPost === true) || methodType === "GET") {
                    return resolve({ data: response });
                }

                processMethodType(methodType, response.ErrorMessage, response.ValidationInput);
                resolve(response);
            },
            error: function (request, status, error) {
                // CloseLoadingDialog();

                try {

                    // Server unreachable (timeout, DNS fail, server down)
                    if (request.status === 0 || request.readyState === 0)
                    {
                        FailToaster("Server is unavailable or not responding.");
                        return reject("Server is unavailable or not responding.");
                    }
                    
                    const errorText = request.responseText || '';
                    const parsedError = JSON.parse(JSON.parse(errorText).Data || '{}');
                    const errMsg = parsedError.ErrorMessage;

                    FailToaster(errMsg || "Something went wrong. Please check the logs.");
                    reject(errMsg);
                } catch (ex) {
                    //const fallbackError = error === 'Unauthorized' ? "Unauthorized Access." :
                    //    error?.name === 'NetworkError' ? "Server is unable to connect." :
                    //        "Unexpected error occurred.";

                    // Catch-all fallback

                    // 🔐 Unauthorized access
                    if (request.status === 401 || request.status === 403) {
                        FailToaster("Unauthorized access. Please login again.");

                        // Optional: redirect to login or logout
                        // window.location.href = '/Account/Login';
                        return reject("Unauthorized access. Please login again.");
                    }

                    const fallbackError =
                        request.status === 0 ? "Server is unavailable or not responding." :
                            status === 'timeout' ? "Request timed out." :
                                status === 'abort' ? "Request was aborted." :
                                    status === 'error' ? "An error occurred while calling the server." :
                                        "Unexpected error occurred.";

                    FailToaster(fallbackError);
                    reject(fallbackError);
 
                }

                console.error("Status:", status);
                console.error("Error:", error);
                console.error("Response Text:", request.responseText);
                console.error("Request Object:", request);

                // handleError(request, status, error);
            }
        });
    });
}

function SuccessToaster(Message) {
    $("#toastMsg").html(Message);
    $("#toasticon i").addClass("fas fa-check green-clr ");
    var x = document.getElementById("toast")
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 1000);
}
function FailToaster(Message) {
    $("#toastMsg").html(Message);
    $("#toasticon i").addClass("fas fa-exclamation-triangle red-clr");
    var x = document.getElementById("toast")
    x.className = "show toaster-warning";
    setTimeout(function () { x.className = x.className.replace("show toaster-warning", ""); }, 5000);
}

function processMethodType(methodType, customMessage, ValidationInput) {

    if (methodType == "POST") {
        if (customMessage != 'amendmendamount') {
            if (customMessage != "")
                if (ValidationInput == 1) {
                    SuccessToaster(customMessage);
                }
                else {
                    FailToaster(customMessage);
                }
        }

        //alert('Successfully Saved');
        //var x = document.getElementById("hReturnMessage");

        //document.getElementById('hReturnMessage').innerHTML = customMessage;
        //$('#btnShowModel').click();
        // x.innerHTML = '<p class="green">Saved successfully!</p>';
        // x.innerHTML = '<p class="green">' + customMessage+'!</p>';
        // x.className = "show";
        // setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    else if (methodType == "PUT") {
        SuccessToaster(customMessage);
        //var x = document.getElementById("hReturnMessage");
        //document.getElementById('hReturnMessage').innerHTML = customMessage;
        //$('#btnShowModel').click();
        //x.innerHTML = '<p class="green">' + customMessage + '!</p>';
        // x.className = "show";
        // setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    else if (methodType == "DELETE") {
        SuccessToaster(customMessage);
        //var x = document.getElementById("hReturnMessage");
        //document.getElementById('hReturnMessage').innerHTML = customMessage;
        //$('#btnShowModel').click();
        // x.innerHTML = '<p class="green">' + customMessage + '!</p>';
        // x.className = "show";
        // setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

}

var specialKeys = new Array();
specialKeys.push(8);  //Backspace
specialKeys.push(9);  //Tab
specialKeys.push(46); //Delete
specialKeys.push(36); //Home
specialKeys.push(35); //End
specialKeys.push(37); //Left
specialKeys.push(39); //Right

function ValidateInput(e) {
    var k = e.keyCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k == 32) || (k >= 48 && k <= 57));


}

function GetMonth(monthInitial, returnMonthOrNum) {
    var arrMonth = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    for (var iCount = 0; iCount < arrMonth.length; iCount++) {
        if (monthInitial == arrMonth[iCount] && returnMonthOrNum == "Num") {
            return iCount;
        }
        if (monthInitial == iCount && returnMonthOrNum == "Month") {
            return arrMonth[iCount];
        }
    }
}
function ChangeDateFormat(MyDate) {
    var strDate = "";
    if (MyDate == '1900-01-01T00:00:00' || MyDate == '' || MyDate == null) {
        MyDate = "";
    }

    if (MyDate != "") {
        var myArray = MyDate.split("-");
        if (myArray.length > 2) {
            var mm = "";
            if (myArray[1] == "01")
                mm = "Jan";
            else if (myArray[1] == "02")
                mm = "Feb";
            else if (myArray[1] == "03")
                mm = "Mar";
            else if (myArray[1] == "04")
                mm = "Apr";
            else if (myArray[1] == "05")
                mm = "May";
            else if (myArray[1] == "06")
                mm = "Jun";
            else if (myArray[1] == "07")
                mm = "Jul";
            else if (myArray[1] == "08")
                mm = "Aug";
            else if (myArray[1] == "09")
                mm = "Sep";
            else if (myArray[1] == "10")
                mm = "Oct";
            else if (myArray[1] == "11")
                mm = "Nov";
            else if (myArray[1] == "12")
                mm = "Dec";
            strDate = myArray[0] + '-' + mm + '-' + myArray[2];
        }
    }

    return strDate;


}

function ChangeDateFormatSecond(MyDate) {
    var strDate = "";
    if (MyDate == '1900-01-01T00:00:00' || MyDate == '' || MyDate == null) {
        MyDate = "";
    }

    if (MyDate != "") {
        var myArray = MyDate.split("/");
        if (myArray.length > 2) {
            var mm = "";
            if (myArray[1] == "01")
                mm = "Jan";
            else if (myArray[1] == "02")
                mm = "Feb";
            else if (myArray[1] == "03")
                mm = "Mar";
            else if (myArray[1] == "04")
                mm = "Apr";
            else if (myArray[1] == "05")
                mm = "May";
            else if (myArray[1] == "06")
                mm = "Jun";
            else if (myArray[1] == "07")
                mm = "Jul";
            else if (myArray[1] == "08")
                mm = "Aug";
            else if (myArray[1] == "09")
                mm = "Sep";
            else if (myArray[1] == "10")
                mm = "Oct";
            else if (myArray[1] == "11")
                mm = "Nov";
            else if (myArray[1] == "12")
                mm = "Dec";
            strDate = myArray[0] + '-' + mm + '-' + myArray[2];
        }
    }

    return strDate;


}
function ChangeDateFormatToddMMYYY(dt) {
    var MyDateString = "";
    if (dt == '1900-01-01T00:00:00') {
        dt = null;
    }

    if (dt == null || dt == "") {
        MyDateString = "";
    }
    else {


        // MyDate.setDate(MyDate.getDate());
        var MyDate = new Date(dt);
        MyDateString = ('0' + MyDate.getDate()).slice(-2) + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + MyDate.getFullYear();

    }
    return MyDateString;


}
function ChangeDateFormatToddMMYYYWithSlace(dt) {
    var MyDateString = "";
    if (dt == '1900-01-01T00:00:00') {
        MyDateString = "";
    }

    else if (dt == null || dt == "") {
        MyDateString = "";
    }
    else {


        // MyDate.setDate(MyDate.getDate());
        var MyDate = new Date(dt);
        MyDateString = ('0' + MyDate.getDate()).slice(-2) + '/' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '/' + MyDate.getFullYear();

    }
    return MyDateString;


}

function ChangeDateFormatToYYYYMMDD(date) {
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Ensure two digits
    var day = ("0" + date.getDate()).slice(-2); // Ensure two digits

    return year + "/" + month + "/" + day; // Return in yyyy/MM/dd format
}

function ChangeDateFormatToYYYYMMDDWithSlash(dt) {

    if (!dt || dt === '1900-01-01T00:00:00') {
        return "";
    }

    // Replace any dash with slash for consistent splitting
    dt = dt.replace(/-/g, '/');

    // Split the input assuming it's in DD/MM/YYYY format
    var parts = dt.split("/");
    if (parts.length !== 3) {
        return "Invalid Date Format";
    }

    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Validate the date components
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return "Invalid Date Components";
    }

    var MyDateString = year + '/' +
        ('0' + month).slice(-2) + '/' +
        ('0' + day).slice(-2);

    return MyDateString;
}

function getdate(strdate) {
    var strRetrunDate;
    if (strdate == '1900-01-01T00:00:00') {
        strdate = null;
    }
    if (strdate != null) {
        var dateData = new Date(parseInt(strdate.replace("/Date(", "").replace(")/")));
        var dd = dateData.getDate();
        var mm = dateData.getgetMonth() + 1; //January is 0!
        var yyyy = dateData.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        strRetrunDate = mm + '-' + dd + '-' + yyyy;
    }
    return strRetrunDate;
}
function getdatetimewithoutJson(strdate) {
    ;
    var strRetrunDate = "";
    if (strdate != null) {
        var dt = new Date(parseInt(Date.parse(strdate)));
        var dd = dt.getDate();
        var mmNo = dt.getMonth() + 1; //January is 0!

        var mm = "";
        if (mmNo == 1)
            mm = "Jan";
        else if (mmNo == 2)
            mm = "Feb";
        else if (mmNo == 3)
            mm = "Mar";
        else if (mmNo == 4)
            mm = "Apr";
        else if (mmNo == 5)
            mm = "May";
        else if (mmNo == 6)
            mm = "Jun";
        else if (mmNo == 7)
            mm = "Jul";
        else if (mmNo == 8)
            mm = "Aug";
        else if (mmNo == 9)
            mm = "Sep";
        else if (mmNo == 10)
            mm = "Oct";
        else if (mmNo == 11)
            mm = "Nov";
        else if (mmNo == 12)
            mm = "Dec";
        var yyyy = dt.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }


        var hours = dt.getHours();
        var minutes = dt.getMinutes();
        var sec = dt.getSeconds();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        sec = sec < 10 ? '0' + sec : sec;
        var strTime = hours + ':' + minutes + ':' + sec + ' ' + ampm;

        // strRetrunDate = yyyy + '-' + mm + '-' + dd + " " + strTime;
        return strRetrunDate = dd + '-' + mm + '-' + yyyy + " " + strTime;
    }

    else {
        return strRetrunDate

    }
}

function formatDateTime(dateTimeString) {
    var date = new Date(dateTimeString);
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = ("0" + hours).slice(-2);
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}
function getdatetime(strdate) {

    if (strdate == '1900-01-01T00:00:00') {
        strdate = null;
    }

    var strRetrunDate;
    if (strdate != null) {
        var dateData = new Date(parseInt(strdate.replace("/Date(", "").replace(")/")));
        var dd = dateData.getDate();
        var mm = dateData.getMonth() + 1; //January is 0!
        var yyyy = dateData.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }


        var hours = dateData.getHours();
        var minutes = dateData.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        // strRetrunDate = yyyy + '-' + mm + '-' + dd + " " + strTime;
        strRetrunDate = dd + '-' + mm + '-' + yyyy + " " + strTime;


    }
    return strRetrunDate;

}

function getdatetimeSlace(strdate) {

    if (strdate == '1900-01-01T00:00:00') {
        strdate = null;
    }

    var strRetrunDate;
    if (strdate != null) {
        var dateData = new Date(parseInt(strdate.replace("/Date(", "").replace(")/")));
        var dd = dateData.getDate();
        var mm = dateData.getMonth() + 1; //January is 0!
        var yyyy = dateData.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }


        var hours = dateData.getHours();
        var minutes = dateData.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        // strRetrunDate = yyyy + '-' + mm + '-' + dd + " " + strTime;
        strRetrunDate = dd + '/' + mm + '/' + yyyy + " " + strTime;
    }
    return strRetrunDate;
}

/*
Function Name               : ValidatePasteNumeric()
Parameter(s)                : Allows numeric paste only.
Created By / On DateTime    : Jiya / 21 Aug 2019
Modified By / On DateTime   :
Description                 : This function allows only numeric values in the CONTROL.
*/
function ValidatePasteNumeric(isDecimal, oTextBox) {
    var emailErrMsg = '';
    if (isDecimal) {
        regex = /^\d+(\.\d{1,2})?$/;
        emailErrMsg = 'Please enter only numeric/decimal values';
    }
    else {
        regex = /^[\d]+$/;
        emailErrMsg = 'Please enter only numeric values';
    }
    var $this = $(oTextBox);
    setTimeout(function () {
        var val = $this.val();

        if (regex.test(val)) {
            $this.val(val);
        }
        else {
            $this.val('');
            FailToaster(emailErrMsg);
        }

    }, 0);



}

function ClearInvalidText(oTextBox) {
    if (!IsNumeric(oTextBox.value, false)) {
        oTextBox.value = "";
        oTextBox.focus();
    }


}


/*
Used to allow only numeric data to be entered.
This method need to be called on keyPress event of an object in which only numeric data is allowed.
isDecimal : Pass true if number needs to be added in decimal format eg ##.##. Pass false if only numeric data needs to be added.
fieldName: Name of the control that is getting validated.
*/
function AllowNumbersOnly(isDecimal, oTextBox, emailErrMsg) {
    //Here 46 key code is for dot(.) entered.
    //48 - 57 is for numbers between 0 - 9.
    if (isDecimal && event.keyCode == 46)//If decimal number is allowed then allow dot(.) to be entered.
    {
        return true;
    }
    if (event.keyCode >= 48 && event.keyCode <= 57)//Allow only number to be entered.
    {
        return true;
    }

    FailToaster(emailErrMsg);

    oTextBox.focus();
    return false;
}
/*
Function Name               : IsNumeric(sText)
Parameter(s)                : sText - String to be checked. Allows numeric paste only.
Created By / On DateTime    : Jiya / 21 Aug 2019
Modified By / On DateTime   :
Description                 : This function checks if the text has all numbers.
*/
function IsNumeric(sText, isDecimal) {
    var ValidChars = "";
    if (isDecimal) {
        ValidChars = "0123456789.";
    }
    else {
        ValidChars = "0123456789";
    }
    var IsNumber = true;
    var Char;

    for (i = 0; i < sText.length && IsNumber == true; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) == -1) {
            IsNumber = false;
        }
    }
    return IsNumber;
}


//function DownloadCrystalReport(procedureName, paramsObj, reportPath, filePrefix) {
//    var model = {
//        StoredProcedureName: procedureName,
//        Parameters: paramsObj,
//        ReportPath: reportPath,
//        FileNamePrefix: filePrefix
//    };

//    var jsonString = JSON.stringify(model);

//    let GenericModeldata =
//    {
//        ModelData: jsonString,
//    };




//    CommonAjaxMethod(virtualPath + '/Generic/DownloadReportAsync', GenericModeldata, 'GET', function (response) {
//        if (response.data && response.data.FilePath) {
//            var downloadLink = response.data.FilePath;
//            window.open(downloadLink, '_blank');
//        } else {
//            FailToaster("Failed to generate report.");
//        }
//    }, true);
//}

function generateCrystalReport(procedureName, reportName, parameters, successCallback, errorCallback) {
    $.ajax({
        url: virtualPath + 'Generic/DownloadReportAsync',
        method: 'POST',   // <<< MUST be POST now
        contentType: 'application/json',
        data: JSON.stringify({
            StoredProcedureName: procedureName,
            ReportPath: reportName,
            Parameters: parameters,
            FileNamePrefix: 'Purchase Order 1'    // or dynamic value
        }),
        beforeSend: function (request) {
            request.setRequestHeader('Auth', getCookieValue('AuthToken'));
            request.setRequestHeader('ClientSecret', getCookieValue('ClientSecret'));
            request.setRequestHeader('ClientAccessKey', getCookieValue('ClientAccessKey'));
        },
        success: function (response) {
            if (response.status === 1) {
                if (typeof successCallback === "function") successCallback(response.msg);
            } else {
                alert("Error: " + response.msg);
                if (typeof errorCallback === "function") errorCallback(response.msg);
            }
        },
        error: function (xhr, status, error) {
            alert("Ajax Error: " + error);
            if (typeof errorCallback === "function") errorCallback(error);
        }
    });
}



//Used to validate entered date is not greater than current date.
//dateText		: in the format dd-MMM-yyyy.
//dateFieldName : name of the date field that needs to be validated.
function IsGreaterThanCurrentDateCS(dText) {

    var todaysDate = new Date();
    var dateText = new Date(ChangeDateFormatSecond(dText.value));
    var arrTodaysDate = new Array();

    var arrFromdaysDate = new Array();

    arrTodaysDate[0] = todaysDate.getDate();
    arrTodaysDate[1] = GetMonth(todaysDate.getMonth(), "Month");
    arrTodaysDate[2] = todaysDate.getFullYear();

    arrFromdaysDate[0] = dateText.getDate();
    arrFromdaysDate[1] = GetMonth(dateText.getMonth(), "Month");
    arrFromdaysDate[2] = dateText.getFullYear();

    daysDiff = GetDateDiffInDays(arrFromdaysDate, arrTodaysDate);
    if (daysDiff > 0) {
        return false;
    }
    return true;
}
function IsGreaterThanFromAndToDate(dText, tDate, message) {

    var todaysDate = new Date(tDate);
    var dateText = new Date(dText);
    var arrTodaysDate = new Array();

    var arrFromdaysDate = new Array();

    arrTodaysDate[0] = todaysDate.getDate();
    arrTodaysDate[1] = GetMonth(todaysDate.getMonth(), "Month");
    arrTodaysDate[2] = todaysDate.getFullYear();

    arrFromdaysDate[0] = dateText.getDate();
    arrFromdaysDate[1] = GetMonth(dateText.getMonth(), "Month");
    arrFromdaysDate[2] = dateText.getFullYear();

    daysDiff = GetDateDiffInDays(arrFromdaysDate, arrTodaysDate);
    if (daysDiff < 0) {
        FailToaster(message);
        //alert("The " + dateFieldName + " Date cannot be greater than Todays Date.");
        return false;
    }
    return true;
}

function IsGreaterThanFromAndToDate(dText, tDate, message) {

    var todaysDate = new Date(tDate);
    var dateText = new Date(dText);
    var arrTodaysDate = new Array();

    var arrFromdaysDate = new Array();

    arrTodaysDate[0] = todaysDate.getDate();
    arrTodaysDate[1] = GetMonth(todaysDate.getMonth(), "Month");
    arrTodaysDate[2] = todaysDate.getFullYear();

    arrFromdaysDate[0] = dateText.getDate();
    arrFromdaysDate[1] = GetMonth(dateText.getMonth(), "Month");
    arrFromdaysDate[2] = dateText.getFullYear();

    daysDiff = GetDateDiffInDays(arrFromdaysDate, arrTodaysDate);
    if (daysDiff < 0) {
        FailToaster(message);
        //alert("The " + dateFieldName + " Date cannot be greater than Todays Date.");
        return false;
    }
    return true;
}
//Get the number of day bettween fromDate and toDate passed.
//fromDateText: in the format dd-MMM-yyyy.
//toDateText: in the format dd-MMM-yyyy.
function GetDateDiffInDays(fromDateText, toDateText) {
    var arrFromDate = fromDateText;
    var arrToDate = toDateText;
    var fromDate = null;
    var toDate = null;
    var hrs = 0, min = 0, sec = 0, miliSec = 0;

    fromDate = new Date(arrFromDate[2], GetMonth(arrFromDate[1], "Num"), arrFromDate[0], hrs, min, sec, miliSec);
    toDate = new Date(arrToDate[2], GetMonth(arrToDate[1], "Num"), arrToDate[0], hrs, min, sec, miliSec);

    var difference = toDate.getTime() - fromDate.getTime();
    var daysDiff = Math.floor(difference / 1000 / 60 / 60 / 24);

    return daysDiff; //if fromDate is greater than toDate then a negative value is returned else positive value is returned.
}
//Get the number of milliseconds bettween fromDate, fromHrs, fromMin and toDate, toHrs, toMin passed.
//fromDateText: in the format dd-MMM-yyyy.
//fromHrsText: hours selected e.g. 1.
//fromMinText: minutes selected e.g. 1.
//toDateText: in the format dd-MMM-yyyy.
//toHrsText: hours selected e.g. 1.
//toMinText: minutes selected e.g. 1.
function GetDateDiffInMilliseconds(fromDateText, fromHrsText, fromMinText, toDateText, toHrsText, toMinText) {
    var arrFromDate = fromDateText.split("-");
    var arrToDate = toDateText.split("-");
    var fromDate = null;
    var toDate = null;
    var sec = 0, miliSec = 0;

    fromDate = new Date(arrFromDate[2], GetMonth(arrFromDate[1], "Num"), arrFromDate[0], fromHrsText, fromMinText, sec, miliSec);
    toDate = new Date(arrToDate[2], GetMonth(arrToDate[1], "Num"), arrToDate[0], toHrsText, toMinText, sec, miliSec);

    var difference = toDate.getTime() - fromDate.getTime();
    return difference; //if fromDate is greater than toDate then a negative value is returned else positive value is returned.
}
//Here the first argument is monthInitial i.e. the month in initial 3 letters or number to be passed.
//returnMonthOrNum should be "Month" to return month initial else "Num" if month Index needs to be returned.
function GetMonth(monthInitial, returnMonthOrNum) {
    var arrMonth = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    for (var iCount = 0; iCount < arrMonth.length; iCount++) {
        if (monthInitial == arrMonth[iCount] && returnMonthOrNum == "Num") {
            return iCount;
        }
        if (monthInitial == iCount && returnMonthOrNum == "Month") {
            return arrMonth[iCount];
        }
    }
}

$('body').on('focus', ".datepicker1", function () {
    $(this).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd-mm-yy",
        yearRange: "-90:+10"
    });
});

function validate(evt) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function ChangeDateFormatWithSlace(MyDate) {
    var strDate = "";
    if (MyDate == '1900-01-01T00:00:00') {
        MyDate = "";
    }
    if (MyDate != "") {
        var myArray = MyDate.split("/");
        if (myArray.length > 2) {
            var mm = "";
            if (myArray[1] == "01")
                mm = "Jan";
            else if (myArray[1] == "02")
                mm = "Feb";
            else if (myArray[1] == "03")
                mm = "Mar";
            else if (myArray[1] == "04")
                mm = "Apr";
            else if (myArray[1] == "05")
                mm = "May";
            else if (myArray[1] == "06")
                mm = "Jun";
            else if (myArray[1] == "07")
                mm = "Jul";
            else if (myArray[1] == "08")
                mm = "Aug";
            else if (myArray[1] == "09")
                mm = "Sep";
            else if (myArray[1] == "10")
                mm = "Oct";
            else if (myArray[1] == "11")
                mm = "Nov";
            else if (myArray[1] == "12")
                mm = "Dec";
            strDate = myArray[0] + '-' + mm + '-' + myArray[2];
        }
    }

    return strDate;


}

function ChangeDateFormatWithFullMonthName(MyDate) {
    var strDate = "";
    if (MyDate == '1900-01-01T00:00:00') {
        MyDate = "";
    }
    if (MyDate != "") {
        var myArray = MyDate.split("-");
        if (myArray.length > 2) {
            var mm = "";
            if (myArray[1] == "01")
                mm = "January";
            else if (myArray[1] == "02")
                mm = "February";
            else if (myArray[1] == "03")
                mm = "March";
            else if (myArray[1] == "04")
                mm = "April";
            else if (myArray[1] == "05")
                mm = "May";
            else if (myArray[1] == "06")
                mm = "June";
            else if (myArray[1] == "07")
                mm = "July";
            else if (myArray[1] == "08")
                mm = "August";
            else if (myArray[1] == "09")
                mm = "September";
            else if (myArray[1] == "10")
                mm = "October";
            else if (myArray[1] == "11")
                mm = "November";
            else if (myArray[1] == "12")
                mm = "December";
            strDate = myArray[0] + '-' + mm + '-' + myArray[2];
        }
    }

    return strDate;


}




function ShowandCloseLoader() {
    //ShowLoadingDialog();


    setTimeout(function () {


        CloseLoadingDialog();

    }, 1500);
}

function convertTo24HourFormat(time12h) {
    // Create a Date object using the time in 12-hour format
    const [time, modifier] = time12h.split(' '); // Split time and AM/PM

    let [hours, minutes] = time.split(':'); // Split hours and minutes

    // Convert hours to number
    if (hours === '12') {
        hours = '00'; // Handle 12 AM case
    }
    if (modifier === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12; // Add 12 to PM hours (except for 12 PM)
    }

    // Format the time as HH:MM in 24-hour format
    return hours + ":" + minutes;
}

function EncryptQueryStringJSON(value) {

    var data = $.parseJSON($.ajax({
        url: '/Tools/EncryptQueryStringJSON',
        dataType: "json",
        data: { Value: value },
        async: false
    }).responseText);
    return data;

}



function DecryptQueryStringJSON(value) {

    var data = $.parseJSON($.ajax({
        url: '/Tools/DecryptQueryStringJSON',
        dataType: "json",
        data: { Value: value },
        async: false
    }).responseText);
    return data;

}


function GetConfigValueJSON(value) {

    var data = $.parseJSON($.ajax({
        url: '/Tools/GetConfigValueJSON',
        dataType: "json",
        data: { Key: value },
        async: false
    }).responseText);
    return data;

}


function ValidateEmail(obj) {
    var userinput = obj;
    var pattern = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

    if (!pattern.test(userinput)) {
        return false;
    }
    else {
        return true;
    }
}


function isNumberKey(evt, obj) {

    var charCode = (evt.which) ? evt.which : event.keyCode
    var value = obj.value;
    var dotcontains = value.indexOf(".") != -1;
    if (dotcontains)
        if (charCode == 46) return false;
    if (charCode == 46) return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function ShowLoadingDialog() {
    setTimeout(function () {
        $("#dvMaskFullpage").show();
    }, 2000); // Delay of 2 seconds (2000 milliseconds)
}
function CloseLoadingDialog() {

    //document.getElementById("dvMaskFullpage").style.display = 'none';
    $("#dvMaskFullpage").hide();
}
function MsgClose() {

    $('#MsgDiv').hide();

}


function checkValidationIfZero(Mandatory) {

    var x = document.getElementsByClassName(Mandatory);
    x.innerHTML = '';
    var isMandatory = true;
    for (var i = 0; i < x.length; i++) {
        var extactValue = jQuery.trim(x[i].value);
        if ((extactValue == "") || (extactValue == "0") || (extactValue =="₹ 0.00")) {

            if ($('#dv' + x[i].id).length > 0) {
                if ($('#dv' + x[i].id).css('display') != 'none') {

                    $('#sp' + x[i].id).show();
                    x[i].classList.add("errorValidation");
                    isMandatory = false;
                }

            }
            else {
                $('#sp' + x[i].id).show();
                x[i].classList.add("errorValidation");
                isMandatory = false;
            }

        }
        else {
            x[i].classList.remove("errorValidation");
            $('#sp' + x[i].id).hide();
        }
    }
    if (!isMandatory) {
        //var mobileerrormsg = "Hey, You missed this field! (*)..";
        //var x = document.getElementById("toastmsg");
        //x.innerHTML = '<p class="yellow">' + mobileerrormsg + '!</p>';
        ////var x = document.getElementById("toastmsg");
        //x.className = "show";
        //setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        return false;
    }
    return isMandatory;
}
function checkValidationDate(Mandatory) {

    var x = document.getElementsByClassName(Mandatory);
    x.innerHTML = '';
    var isMandatory = true;
    for (var i = 0; i < x.length; i++) {
        var extactValue = jQuery.trim(x[i].value);
        if (extactValue != "") {
            if (!IsGreaterThanCurrentDateCS(x[i])) {
                $('#spValidation' + x[i].id).show();
                x[i].classList.add("errorValidation");
                isMandatory = false;

            }
            else {
                x[i].classList.remove("errorValidation");
                $('#spValidation' + x[i].id).hide();
            }
        }
    }
    if (!isMandatory) {
        //var mobileerrormsg = "Hey, You missed this field! (*)..";
        //var x = document.getElementById("toastmsg");
        //x.innerHTML = '<p class="yellow">' + mobileerrormsg + '!</p>';
        ////var x = document.getElementById("toastmsg");
        //x.className = "show";
        //setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        return false;
    }
    return isMandatory;
}


//////  numeric-decimal-restrict   /////////

document.addEventListener("input", function (event) {
    if (event.target.classList.contains("numeric-decimal-restrict")) {
        let value = event.target.value;

        // Allow only numbers and one dot (.)
        value = value.replace(/[^0-9.]/g, '');

        // Prevent multiple dots
        let dotCount = (value.match(/\./g) || []).length;
        if (dotCount > 1) {
            value = value.substring(0, value.lastIndexOf(".")); // Remove extra dots
        }

        // Ensure proper splitting at decimal
        let parts = value.split('.');

        // Restrict before decimal to 8 digits
        if (parts[0].length > 8) {
            parts[0] = parts[0].substring(0, 8);
        }

        // Restrict after decimal to 4 digits
        if (parts[1] && parts[1].length > 4) {
            parts[1] = parts[1].substring(0, 4);
        }

        // Join and update value
        event.target.value = parts.join('.');
    }
});
window.addEventListener('scroll', function (e) {
    // Check if the scroll originated inside a suggestion box
    const target = e.target;

    // If the scroll is inside any suggestion box, do nothing
    if (target && target.closest && target.closest('[id^="globalSuggestionBox_"]')) {
        return; // skip hiding if scrolling inside popup
    }

    // Otherwise, hide all suggestion popups
    document.querySelectorAll('[id^="globalSuggestionBox_"]').forEach(el => {
        el.style.display = 'none';
    });
}, true);


function parseAmount(selector) {
    const value = parseFloat($(selector).text().replace(/[₹,]/g, '').trim()) || 0;
    return parseFloat(value.toFixed(2));
}

function parseInputAmount(selector) {
    const value = parseFloat($(selector).val().replace(/,/g, '').trim()) || 0;
    return parseFloat(value.toFixed(2));
}

$(function () {

    // ==============================
    // 🔹 FILE PREVIEW HTML TEMPLATE
    // ==============================
    window.PREVIEW_HTML = `
        <div class="d-flex justify-content-between align-items-center form-control mt-2">
            <p class="ellipsis m-0 file-name" data-placement="bottom"></p>
            <span class="text-danger cursor-pointer d-flex align-items-center gap-5">
                <a class="download-file" target="_blank" rel="noopener" data-toggle="tooltip" title="Download">
                    <img src="../../assets/images/icons/help/download-icon.png" class="icon-sm" />
                </a>
                <button type="button" class="delete-file" data-toggle="tooltip" title="Remove">
                    <img src="../../assets/images/icons/help/delete-icon.png" class="icon-sm" />
                </button>
            </span>
        </div>
    `;

    // ==============================
    // 🔹 TOOLTIP HELPERS
    // ==============================
    window.enableTooltip = function ($el, title) {
        $el.attr('title', title || $el.attr('title') || '');
        try { $el.tooltip('dispose'); } catch (e) { }
        try { $el.tooltip({ trigger: 'hover', container: 'body' }); } catch (e) { }
    }

    window.setFilenameWithTooltip = function ($fileNameEl, name) {
        $fileNameEl.text(name)
            .attr('title', name)
            .attr('data-toggle', 'tooltip');
        enableTooltip($fileNameEl, name);
    }

    $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover', container: 'body' });

    // ==============================
    // 🔹 SHOW PREVIEW (FOR TABLE FILES)
    // ==============================
    window.showFilePreview = function (prefix, index, fileURL, fileName) {
        const id = prefix ? `${prefix}uploadfile_${index}` : `uploadfile_${index}`;
        const $input = $(`#${id}`);
        const $preview = $input.siblings('.file-preview');

        // 🚫 If no file URL, just show input — no folder icon, no preview
        if (!fileURL || fileURL === "0") {
            $preview.addClass('d-none').empty();
            $input.removeClass('d-none');
            return;
        }

        // ✅ If file exists → show standard preview
        if ($preview.is(':empty')) $preview.html(PREVIEW_HTML);

        const $name = $preview.find('.file-name');
        setFilenameWithTooltip($name, fileName);

        $preview.find('.download-file').attr('href', fileURL).attr('download', fileName);
        enableTooltip($preview.find('.download-file'));
        enableTooltip($preview.find('.delete-file'));

        $input.addClass('d-none');
        $preview.removeClass('d-none');
    }

    // ==============================
    // 🔹 SHOW PREVIEW (FOR HEADER PAYMENT FILE)
    // ==============================
    window.showFilePreviewHeader = function (fileURL, fileName) {
        const $input = $('#updFile');
        const $preview = $input.siblings('.file-preview');

        // 🚫 If no file URL, just show input — no folder icon
        if (!fileURL || fileURL === "0") {
            $preview.addClass('d-none').empty();
            $input.removeClass('d-none');
            return;
        }

        // ✅ If file exists → show standard preview
        if ($preview.is(':empty')) $preview.html(PREVIEW_HTML);

        const $name = $preview.find('.file-name');
        setFilenameWithTooltip($name, fileName);

        $preview.find('.download-file').attr('href', fileURL).attr('download', fileName);
        enableTooltip($preview.find('.download-file'));
        enableTooltip($preview.find('.delete-file'));

        $input.addClass('d-none');
        $preview.removeClass('d-none');
    }

    // ==============================
    // 🔹 ON FILE UPLOAD
    // ==============================
    $(document).on('change', '.file-upload', function () {
        const $input = $(this);
        const $preview = $input.siblings('.file-preview');
        const file = this.files && this.files[0];
        if (!file) return;

        if ($preview.is(':empty')) $preview.html(PREVIEW_HTML);

        const url = URL.createObjectURL(file);
        $preview.data('blobUrl', url);

        const $name = $preview.find('.file-name');
        setFilenameWithTooltip($name, file.name);

        $preview.find('.download-file').attr('href', url).attr('download', file.name);
        enableTooltip($preview.find('.download-file'));
        enableTooltip($preview.find('.delete-file'));

        $input.addClass('d-none');
        $preview.removeClass('d-none');

        // ✅ Update hidden fields
        const id = $input.attr('id');
        if (id === 'updFile') {
            $('#hdnActualFileName').val(file.name);
        } else {
            const match = id.match(/^(OL|OUL)?uploadfile_(\d+)$/);
            if (match) {
                const prefix = match[1] || '';
                const idx = match[2];
                $(`#${prefix}hdnActualFileName_${idx}`).val(file.name);
            }
        }
    });

    // ==============================
    // 🔹 ON DELETE FILE
    // ==============================
    $(document).on('click', '.delete-file', function (e) {
        e.preventDefault();
        const $preview = $(this).closest('.file-preview');
        const $input = $preview.siblings('.file-upload');

        const url = $preview.data('blobUrl');
        if (url) { URL.revokeObjectURL(url); $preview.removeData('blobUrl'); }

        try { $preview.find('[data-toggle="tooltip"]').tooltip('dispose'); } catch (e) { }

        $preview.addClass('d-none').empty();
        $input.val('').removeClass('d-none');

        const id = $input.attr('id');
        if (id === 'updFile') {
            $('#hdnActualFileName').val('');
            $('#hdnNewFileName').val('');
            $('#hdnFileURL').val('');
        } else {
            const match = id.match(/^(OL|OUL)?uploadfile_(\d+)$/);
            if (match) {
                const prefix = match[1] || '';
                const idx = match[2];
                $(`#${prefix}hdnFileURL_${idx}`).val('');
                $(`#${prefix}hdnActualFileName_${idx}`).val('');
                $(`#${prefix}hdnNewFileName_${idx}`).val('');
            }
        }
    });
});

function toTitleCase(input) {
    let value = input.value.toLowerCase().replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
    });
    input.value = value;
}

$(document).on('input paste', '.char-limit', function () {
    let maxLength = $(this).data('maxlength') || 300;   // read dynamic max length
    let text = $(this).val();

    // Trim if exceeds limit
    if (text.length > maxLength) {
        text = text.substring(0, maxLength);
        $(this).val(text);
    }

    // Update counter
    $(this)
        .closest('.form-group')
        .find('.counter')
        .text(text.length + '/' + maxLength);
});
