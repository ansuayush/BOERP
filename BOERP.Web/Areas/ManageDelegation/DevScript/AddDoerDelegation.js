$(document).ready(function () {




    var obj2 = {
        ParentId: 0,
        masterTableType: 0, // Again commenting the code for pull request of the branch 
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Employee,
        manualTableId: ManaulTableEnum.Employee
    }



    LoadMasterDropdownTMS('EscalateTo', obj2, 'Select', false);




    EditDelegationMaster(Edit_ID);

    $('#DoerDoneDate').on('change', function () {
        validateDates();
    });

});



function validateDates() {
    var startDateStr = $('#DoerDoneDate').val();

    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();
    var day = currentDate.getDate();


    var currentDateWithoutTime = new Date(year, month, day);


    var startDateParts = startDateStr.split('-');

    // Convert parts to integers
    var startDate = new Date(parseInt(startDateParts[2], 10), parseInt(startDateParts[1], 10) - 1, parseInt(startDateParts[0], 10));
    


    if (startDateStr) {
        if (startDate > currentDateWithoutTime) {
            showMessage("Doer Completion Date cannot be greater than today's date!", "error", 5000);
            $('#DoerDoneDate').val('');
        }
    }
}



function EditDelegationMaster(id) {
    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetMyDelegation', { id: id, Type: 2 }, 'GET', function (response) {
        console.log(response);
        var data = response.data.data.Table[0];
        var files = response.data.data.Table1;
        fillValues(data, files);


    });

}

var isMandate;
function fillValues(data, files) {
    document.getElementById('DelId').value = data.DelId;
    document.getElementById('DelDate').value = data.DelDate.split('T')[0] // Extract date part
    document.getElementById('createdby').value = data.CreatedBy;
    document.getElementById('ddlAssignee').textContent = data.DelegatedBy;
    document.getElementById('DelName').textContent = data.DelName;
    document.getElementById('plandate1').value = data.StartDate1 ? data.StartDate1.split('T')[0] : '';
    document.getElementById('plandate2').value = data.StartDate2 ? data.StartDate2.split('T')[0] : '';
    document.getElementById('plandate3').value = data.StartDate3 ? data.StartDate3.split('T')[0] : '';
    document.getElementById('Doer').textContent = data.Doer;
    document.getElementById('Department').textContent = data.Department ? data.Department : '';
    document.getElementById('ddlBranch').textContent = data.Branch;
    document.getElementById('Weightage').textContent = data.Weightage;
    document.getElementById('PC').textContent = data.ApprovalAuthority;
    document.getElementById('EscalationTime').textContent = data.EscalationTime;
    document.getElementById('ReminderTime').textContent = data.ReminderTime;
    if (data.IsImageRequired == 1) {
        $('#isImageRequired').html("Yes");
        isMandate = true;
    }

    else if (data.IsImageRequired == 3) {
        $('#isImageRequired').html("Only Upload Reference Image");
        isMandate = false;
    }
    else {
        $('#isImageRequired').html("No");
        $('#yesupload').hide();
    }
    document.getElementById('isRemarkRequired').textContent = data.IsRemarkRequired ? 'Yes' : 'No';
    document.getElementById('EA').textContent = data.EA;

    if (data.IsRemarkRequired) {
        $('#userRemarkUpload').show();
        $('#userRemarks').addClass('Mandatory');
    }
    else {

    }
    if (data.EscalateEmail != null) {
        $('#EscalateTo').val(data.EscalateEmail.split(','));
    }
    $('#EscalateTo').prop('disabled', true);


    for (var i = 0; i < files.length; i++) {
        var id = i + 1;
        var ele = ` <tr class="imageRows" id="rowImage_${files[i].id}">
        <td class="text-center">${id}</td>
        <input type="hidden" id="hdnUploadActFile_${id}" />
        <input type="hidden" id="hdnUploadFileUrl_${id}" />
       <td><p class="text-p mb-0 " id="view_${id}" onclick="showImage(this.id)" ><img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</p></td>
        <input type="hidden" id="hdnUploadActualFileName_${files[i].id}" />
        <input type="hidden" id="hdnUploadNewFileName_${files[i].id}" />
        <input type="hidden" id="hdnUploadFileUrl_${files[i].id}" />
       <td ${isMandate == false? `style="display: none"` : ``}>
       <input type="file" id="file_${files[i].id}" class="form-control ${isMandate == true ? "Mandatory" : ""}" onchange="UploadocumentQuesReport(this.id)"  name="attachment[]">
       <span id="spfile_${files[i].id}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
       </td>
           </tr>`;

        $('#imageBody').append(ele);

        $('#hdnUploadFileUrl_' + id).val(files[i].FileURL);
        $('#hdnUploadActFile_' + id).val(files[i].ActualFilename);

    }

    if (!isMandate) {
        $('#imageUpload').hide();
    }
}

var documents = [];
var ActualFile;
function showImage(ctrl) {
    var id = ctrl.split('_')[1];

    $('#viewMyImage').attr("src", $("#hdnUploadFileUrl_" + id).val());
    ActualFile = $("#hdnUploadActFile_" + id).val();
    handleTaskFile();
}


function handleTaskFile() {
    // Determine file extension using lastIndexOf('.')
    const imageElement = document.getElementById('viewMyImage');

    // Get the value of the 'src' attribute
    const filePath = imageElement.src;
    const lastDotIndex = filePath.lastIndexOf('.');
    const fileExtension = lastDotIndex !== -1 ? filePath.substring(lastDotIndex + 1).toLowerCase() : '';

    // List of image extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    // Check if the file is an image
    if (imageExtensions.includes(fileExtension) || fileExtension == '' || fileExtension == null || fileExtension.length > 4) {
        // Show image in modal
        showTaskModalWithImage(filePath);
    } else {
        // Download the file
        downloadTaskFile(filePath);
    }
}

// Function to display image in the modal
function showTaskModalWithImage(imagePath) {
    const modalImage = document.getElementById('viewMyImage');
    modalImage.src = imagePath;
    $('#viewimage').modal('show'); // Assuming you're using jQuery and Bootstrap
}

// Function to download the file
function downloadTaskFile(filePath) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = ActualFile; // Let the browser decide the file name or specify one
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function UploadocumentQuesReport(id) {


    var array = id.split('_');
    var fileUpload = $("#" + id).get(0);

    var files = fileUpload.files;
    if (files.length > 0) {

        // Create FormData object
        var fileData = new FormData();

        // Looping over all files and add it to FormData object
        for (var i = 0; i < files.length; i++) {
            fileData.append(files[i].name, files[i]);
        }

        $.ajax({
            url: baseURL + 'CommonMethod/UploadDelegationDocument',
            type: "POST",
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            data: fileData,

            success: function (response) {
                $("#customLoader").hide();
                var result = JSON.parse(response);

                if (result.ErrorMessage == "") {

                    $('#hdnUploadActualFileName_' + array[1]).val(result.FileModel.ActualFileName);
                    $('#hdnUploadNewFileName_' + array[1]).val(result.FileModel.NewFileName);
                    $('#hdnUploadFileUrl_' + array[1]).val(result.FileModel.FileUrl);
                    $("#spfile_" + array[1]).hide();
                    $("#file_" + array[1]).addClass('Mandatory');
                }
                else {


                    FailToaster(result.ErrorMessage);

                }
            },
            error: function (error) {
                $("#customLoader").hide();
                FailToaster(error);

                isSuccess = false;
            }

        });
    }
    else {
        $('#hdnUploadActualFileName_' + array[1]).val('');
        $('#hdnUploadNewFileName_' + array[1]).val('');
        $('#hdnUploadFileUrl_' + array[1]).val('');


        return "error";

    }

    return "";


}

function getAllInputValues() {
    var inputData = [];
    $(".imageRows").each(function () {
        var rowId = $(this).attr('id');
        if (rowId) {
            rowId = rowId.split('_')[1];
            var actualFileName = $("#hdnUploadActualFileName_" + rowId).val();
            var newFileName = $("#hdnUploadNewFileName_" + rowId).val();
            var fileUrl = $("#hdnUploadFileUrl_" + rowId).val();

            inputData.push({
                DocumentId: rowId,
                actualFileName: actualFileName,
                newFileName: newFileName,
                fileUrl: fileUrl
            });
        }
    });
    return inputData;
}

var DoerDoneTaskByEA;

var inputImageData = [];
function SaveDoerTask() {

    if (checkValidationOnSubmit('Mandatory') == true) {

        var objTaskRemark = {
            id: Edit_ID,
            Remarks: $('#userRemarks').val()
        }

        inputImageData = getAllInputValues();

        var DelegationModel = {
            delegationMasterModel: objTaskRemark,
            listDelegationDocumentUpload: inputImageData  
        }

        if (isEA == 1) {
            DoerDoneTaskByEA = DelegationModel;
           // $('#DoerDoneDate').addClass('Mandatory');
            $('#addDoerDate').modal('show');
        }
        else {
            $('#delSaveDoer').prop('disabled', true);
            CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/SaveMyDelegation', DelegationModel, 'POST', function (response) {
                if (response.ValidationInput == 1) {

                    //sessionStorage.setItem('successShown', 'true');

                    //sessionStorage.setItem('message', '<span class="checkmark">✅</span>Delegation Task Saved Successfully')
                    RedirectMyDelegationRequest();
                }

            });
        }

    }
}

function SaveDoerDoneEATask() {

    if (ChangeDateFormat($('#DoerDoneDate').val()) != "") {

        console.log($('#DoerDoneDate').val());
        DoerDoneTaskByEA.delegationMasterModel.EA = 1; // Example value, adjust as needed
        DoerDoneTaskByEA.delegationMasterModel.DoerDoneDate = ChangeDateFormat($('#DoerDoneDate').val());

        $('#saveEaDoerTask').prop('disabled', true);

        CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/SaveMyDelegation', DoerDoneTaskByEA, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                //sessionStorage.setItem('successShown', 'true');

                //sessionStorage.setItem('message', '<span class="checkmark">✅</span>Delegation Task Saved Successfully')
                RedirectMyDelegationRequest();
            }

        });
    }
    else {
        $('#spDoerDoneDate').show();
    }

}
function RedirectMyDelegationRequest() {
    if (!isEA) {
        var url = "/ManageDelegation/MyDelegation?auth=" + AuthToken;
    }
    else {
        var url = "/ManageDelegation/Delegation?auth=" + AuthToken;
    }

    window.location.href = url;
}

