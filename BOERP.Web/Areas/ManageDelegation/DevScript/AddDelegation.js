$(document).ready(function () {

    removeAllRows();

    $('#ddlBranch').prop('disabled', true);

    $('#ddlDepartment').prop('disabled', true);

    $(function () {
        $('.datepickersecond').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "dd-mm-yy",
            yearRange: "-20:+10",
            onSelect: function (dateText) {
                // Show × icon when a date is selected
                $(this).siblings('.clear-date').show();
            }
        });

        // Clear date when clicking the × icon
        $('.clear-date').on('click', function () {
            const $input = $(this).siblings('.datepickersecond');
            $input.val('');          // Clear input
            $(this).hide();          // Hide × icon
        });

        // Open datepicker when clicking the icon
        $('.input-group-text').on('click', function () {
            $(this).closest('.input-group').find('.datepickersecond').focus();
        });

    });

    $('#resultupload').on('change', function () {
        $('#yesupload').css('display', 'none');
        $('#file_1').removeClass('Mandatory');
        if ($(this).val() == 'yes' || $(this).val() == 'uploadreferenceimage') {
            $('#yesupload').css('display', 'block');
            if ($('#hdnUploadFileUrl_1').val() == '') {
                $('#file_1').addClass('Mandatory');
            }
        }
        else {
            removeAllRows();
        }

    });

    //$("#addRowBtn").click(function () {
    //    var newRow = `
    //                <tr id="row_${rowCounter}" class="imageRows" >
    //                    <td class="text-center">${rowCounter}</td>
    //                    <td><p class="text-p mb-0" id="view_${rowCounter}" onclick="showImage(this.id)" ><img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</p></td>
    //                    <td>
    //                     <input type="hidden" id="hdnUploadActualFileName_${rowCounter}" />
    //                      <input type="hidden" id="hdnUploadNewFileName_${rowCounter}" />
    //                        <input type="hidden" id="hdnUploadFileUrl_${rowCounter}" />
    //                    <input type="file" id="file_${rowCounter}" class="form-control Mandatory" onchange="UploadocumentQuesReport(this.id)"   name="attachment[]">
    //                        <span id="spfile_${rowCounter}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
    //                        </td>
    //                    <td class="text-center"><span  data-toggle="tooltip" title="Delete" class="removeBtn " onclick="removeRow(this, ${rowCounter})"><img src="/assets/images/icons/help/close.svg" alt="" ></span></td>
    //                </tr>
    //            `;
    //    $("#imageUploadRows").append(newRow);
    //    updateSerialNumbers();

    //    $('[data-toggle="tooltip"]').tooltip();
    //    rowCounter++; // Increment row counter
    //});
   

    var obj1 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Department,
        manualTableId: 0
    }
    LoadMasterDropdownTMS('ddlDepartment', obj1, 'Select', false);


    var obj2 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Employee,
        manualTableId: ManaulTableEnum.Employee
    }


    LoadMasterDropdownTMS('ddlDoer', obj2, 'Select', false);
    LoadMasterDropdownTMS('EscalateTo', obj2, 'Select', false);
    LoadMasterDropdownTMS('ddlPC', obj2, 'Select', false);

    var obj3 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Branch,
        manualTableId: ManaulTableEnum.Branch
    }



    LoadMasterDropdownTMS('ddlBranch', obj3, 'Select', false);

    var obj4 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Director,
        manualTableId: ManaulTableEnum.Director
    }

    LoadMasterDropdownTMS('ddlAssignee', obj4, 'Select', false);

    var obj5 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.EA,
        manualTableId: ManaulTableEnum.EA
    }

    LoadMasterDropdownTMS('ddlEA', obj5, 'Select', false);




    if (Edit_ID != 0) {

        if (isDuplicate == 1) {
            DuplicateDelegationMaster(Edit_ID);
            GetDelId();
        }
        else {
            $('#dtStartDate').prop('disabled', true);
            EditDelegationMaster(Edit_ID);
            GetFollowDetails(Edit_ID);
        }
    }
    else {


        GetDelId();

    }


    $('#ddlDoer').on("change", function () {

        const id = $('#ddlDoer').val();



        CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetDelegation', { id: id, Type: 100 }, 'GET', function (response) {
            console.log(response);

            data = response.data.data.Table[0];

            $('#ddlBranch').val(data.Branch_ID).trigger('change');
            $('#ddlDepartment').val(data.DepartmentId).trigger('change');


        });

    })



});



function addRows() {

    var newRow = `
                    <tr id="row_${rowCounter}" class="imageRows" >
                        <td class="text-center">${rowCounter}</td>
                        <td><p class="text-p mb-0" id="view_${rowCounter}" onclick="showImage(this.id)" ><img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</p></td>
                        <td>
                         <input type="hidden" id="hdnUploadActualFileName_${rowCounter}" />
                          <input type="hidden" id="hdnUploadNewFileName_${rowCounter}" />
                            <input type="hidden" id="hdnUploadFileUrl_${rowCounter}" />
                        <input type="file" id="file_${rowCounter}" class="form-control Mandatory" onchange="UploadocumentQuesReport(this.id)"   name="attachment[]">
                            <span id="spfile_${rowCounter}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                            </td>
                        <td class="text-center"><span  data-toggle="tooltip" title="Delete" class="removeBtn " onclick="removeRow(this, ${rowCounter})"><img src="/assets/images/icons/help/close.svg" alt="" ></span></td>
                    </tr>
                `;
    $("#imageUploadRows").append(newRow);
    updateSerialNumbers();

    $('[data-toggle="tooltip"]').tooltip();
    rowCounter++; // Increment row counter
}

function GetDelId() {
    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetDelId', null, 'GET', function (response) {
        var data = response.data.data.Table;

        $('#DelId').val(data[0].DelId);
        $('#Deldate').val(ChangeDateFormatToddMMYYY(data[0].DelDate));

    });

}

var PrevStartDate2;

var PrevStartDate3;
function EditDelegationMaster(id) {
    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetDelegation', {id : id}, 'GET', function (response) {
        console.log(response);
        var data = response.data.data.Table;
        var Image = response.data.data.Table1;
        var entry = data[0];

        $('#hdnDelegationMasterId').val(entry.id);
        $('#DelId').val(entry.DelId);
        $('#ddlAssignee').val(entry.DelegatedBy);
        $('#CreatedBy').val(entry.CreatedBy);
        $('#Deldate').val(ChangeDateFormatToddMMYYY(entry.DelDate));
        $('#Delname').val(entry.DelName);
        $('#plandate1').val(ChangeDateFormatToddMMYYY(entry.StartDate1));
        $('#plandate1').prop('disabled', true);
        if (entry.BeforeDateTask) {
            $('#backTask').prop('checked', true);
        }
        else {
            $('#backTask').prop('checked', false);
        }
        if (entry.StartDate2 != null) {
            $('#plandate2').val(ChangeDateFormatToddMMYYY(entry.StartDate2));
            PrevStartDate2 = ChangeDateFormatToddMMYYY(entry.StartDate2);
        }
        else {
            $('#plandate3').prop('disabled', true);
        }
        if (entry.StartDate3 != null) {
            $('#plandate3').val(ChangeDateFormatToddMMYYY(entry.StartDate3));
            PrevStartDate3 = ChangeDateFormatToddMMYYY(entry.StartDate3);
        }
        $('#RDate2').val(entry.R2 == true? 1: 0);
        $('#RDate3').val(entry.R3 == true? 1 : 0);
        $('#ddlDepartment').val(entry.Department);
        $('#ddlDoer').val(entry.Doer);
        $('#ddlPC').val(entry.ApprovalAuthority);
        $('#ddlEA').val(entry.EAId);
        $('#EA').val(entry.EA);
        $("#ddlBranch").val(entry.Branch);
        if(entry.EscalateEmail != null ) {
            $('#EscalateTo').val(entry.EscalateEmail.split(','));
        }            // Assuming EscalateEmail is a comma-separated string
        $('#EscalationTime').val(entry.EscalationTime);
        $('#ReminderTimes').val(entry.ReminderTime);
        if (entry.IsImageRequired == 1) {
            $('#resultupload').val("yes");
        }
       
        else if (entry.IsImageRequired == 3) {
            $('#resultupload').val("uploadreferenceimage");
        }
        else {
            $('#resultupload').val("no");
        }
        $('#isRemark').val(entry.IsRemarkRequired ? "yes" : "no");
        $("#Weightage").val(entry.Weightage);


        if (entry.IsImageRequired == 1 || entry.IsImageRequired == 3) {

            $('#yesupload').css('display', 'block');

            for (var i = 0; i < Image.length; i++) {
                var id = i + 1;
                if (i == 0) {
                    $('#hdnUploadActualFileName_1').val(Image[i].ActualFilename);
                    $('#hdnUploadNewFileName_1').val(Image[i].NewFilename);
                    $('#hdnUploadFileUrl_1').val(Image[i].FileURL);
                    $('#file_1').removeClass('Mandatory');
                }
                else {
                    var newRow = `
                    <tr id="row_${id}" class="imageRows" >
                        <td class="text-center">${id}</td>
                        <td><p class="text-p mb-0" id="view_${id}" onclick="showImage(this.id)" ><img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</p></td>               
                        <td>
                         <input type="hidden" id="hdnUploadActualFileName_${id}" />
                          <input type="hidden" id="hdnUploadNewFileName_${id}" />
                            <input type="hidden" id="hdnUploadFileUrl_${id}" />
                        <input type="file" id="file_${id}" class="form-control" onchange="UploadocumentQuesReport(this.id)"   name="attachment[]">
                            <span id="spfile_${id}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                            </td>
                        <td class="text-center"><a class="removeBtn" onclick="removeRow(this, ${id})"><img src="/assets/images/icons/help/close.svg" alt="" ></a></td>
                    </tr>
                `;

                    $("#imageUploadRows").append(newRow);
                    updateSerialNumbers();
                    $('[data-toggle="tooltip"]').tooltip();

                    $('#hdnUploadActualFileName_' + id).val(Image[i].ActualFilename);
                    $('#hdnUploadNewFileName_' + id).val(Image[i].NewFilename);
                    $('#hdnUploadFileUrl_' + id).val(Image[i].FileURL);
                    $('#file_1').removeClass('Mandatory');
                }
            }
            rowCounter = Image.length + 1;

        }

    });

}

function getAllInputValues() {
    var inputData = [];
    $(".imageRows").each(function () {
        var rowId = $(this).attr('id');
        if (rowId) {
            rowId = rowId.split('_')[1];

            if ($('#resultupload').val() == "yes") {
                if ($("#hdnUploadFileUrl_" + rowId).val() == '' || $("#hdnUploadFileUrl_" + rowId).val() == null) {
                    var actualFileName = 'No Image';
                    var newFileName = 'No Image';
                    var fileUrl = 'No Image';
                }
                else {
                    var actualFileName = $("#hdnUploadActualFileName_" + rowId).val();
                    var newFileName = $("#hdnUploadNewFileName_" + rowId).val();
                    var fileUrl = $("#hdnUploadFileUrl_" + rowId).val();
                    var fileInput = $("#file_" + rowId).val();
                }
            }
            else {
                var actualFileName = $("#hdnUploadActualFileName_" + rowId).val();
                var newFileName = $("#hdnUploadNewFileName_" + rowId).val();
                var fileUrl = $("#hdnUploadFileUrl_" + rowId).val();
                var fileInput = $("#file_" + rowId).val();
            }

            inputData.push({
                actualFileName: actualFileName,
                newFileName: newFileName,
                fileUrl: fileUrl,
                fileInput: fileInput
            });
        }
    });
    return inputData;
}






function DuplicateDelegationMaster(id) {
    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetDelegation', { id: id }, 'GET', function (response) {
        console.log(response);
        var data = response.data.data.Table;
        var Image = response.data.data.Table1;
        var entry = data[0];

        $('#hdnDelegationMasterId').val(0);       
        $('#ddlAssignee').val(entry.DelegatedBy);
        $('#Delname').val(entry.DelName);
        
        $('#plandate2').prop('disabled', true);
        $('#plandate3').prop('disabled', true);
       
        $('#ddlDepartment').val(entry.Department);
        $('#ddlDoer').val(entry.Doer);
        $('#ddlPC').val(entry.ApprovalAuthority);
        $('#ddlEA').val(entry.EAId);
        $('#EA').val(entry.EA);
        $("#ddlBranch").val(entry.Branch);
        if (entry.EscalateEmail != null) {
            $('#EscalateTo').val(entry.EscalateEmail.split(','));
        }            // Assuming EscalateEmail is a comma-separated string
        $('#EscalationTime').val(entry.EscalationTime);
        $('#ReminderTimes').val(entry.ReminderTime);
        if (entry.IsImageRequired == 1) {
            $('#resultupload').val("yes");
        }

        else if (entry.IsImageRequired == 3) {
            $('#resultupload').val("uploadreferenceimage");
        }
        else {
            $('#resultupload').val("no");
        }
        $('#isRemark').val(entry.IsRemarkRequired ? "yes" : "no");
        $("#Weightage").val(entry.Weightage);


        if (entry.IsImageRequired == 1 || entry.IsImageRequired == 3) {

            $('#yesupload').css('display', 'block');

            for (var i = 0; i < Image.length; i++) {
                var id = i + 1;
                if (i == 0) {
                    $('#hdnUploadActualFileName_1').val(Image[i].ActualFilename);
                    $('#hdnUploadNewFileName_1').val(Image[i].NewFilename);
                    $('#hdnUploadFileUrl_1').val(Image[i].FileURL);
                    $('#file_1').removeClass('Mandatory');
                }
                else {
                    var newRow = `
                    <tr id="row_${id}" class="imageRows" >
                        <td class="text-center">${id}</td>
                        <td><p class="text-p mb-0" id="view_${id}" onclick="showImage(this.id)" ><img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</p></td>               
                        <td>
                         <input type="hidden" id="hdnUploadActualFileName_${id}" />
                          <input type="hidden" id="hdnUploadNewFileName_${id}" />
                            <input type="hidden" id="hdnUploadFileUrl_${id}" />
                        <input type="file" id="file_${id}" class="form-control" onchange="UploadocumentQuesReport(this.id)"   name="attachment[]">
                            <span id="spfile_${id}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                            </td>
                        <td class="text-center"><a  data-toggle="tooltip" title="Delete" class="btn btn-danger btn-xs removeBtn" onclick="removeRow(this, ${id})"><i class="fas fa-times"></i></a></td>
                    </tr>
                `;

                    $("#imageUploadRows").append(newRow);
                    updateSerialNumbers();
                    $('[data-toggle="tooltip"]').tooltip();

                    $('#hdnUploadActualFileName_' + id).val(Image[i].ActualFilename);
                    $('#hdnUploadNewFileName_' + id).val(Image[i].NewFilename);
                    $('#hdnUploadFileUrl_' + id).val(Image[i].FileURL);
                    $('#file_1').removeClass('Mandatory');
                }
            }
            rowCounter = Image.length + 1;

        }

    });

}

var rowCounter = 2; // Initial row counter
function updateSerialNumbers() {
    var serialNumber = 1;
    $(".imageRows").each(function () {
        $(this).find("td:first").text(serialNumber);
        serialNumber++;
    });
}

function SaveDelegation() {


    if ($('#resultupload').val() == "yes") {
        $(".imageRows").each(function () {
            var rowId = $(this).attr('id');
            if (rowId) {
                rowId = rowId.split('_')[1];
                $('#file_' + rowId).removeClass('Mandatory');               
               
            }
        });
    }   
    else if ($('#resultupload').val() == "uploadreferenceimage") {
        $(".imageRows").each(function () {
            var rowId = $(this).attr('id');
            if (rowId) {
                rowId = rowId.split('_')[1];
                if (!$("#hdnUploadFileUrl_" + rowId).val()) {
                    $('#file_' + rowId).addClass('Mandatory');
                }

            }
        });
    }



        if (checkValidationOnSubmit('Mandatory') == true) {

            if ($('#resultupload').val() == "yes") {
                var isImage = 1;
            }
            else if ($('#resultupload').val() == "no") {
                var isImage = 2;
            }
            else if ($('#resultupload').val() == "uploadreferenceimage") {
                var isImage = 3;
            }
            else {
                var isImage = 0;
            }

            if ($('#isRemark').val() == "yes") {
                var isRemark = 1;
            }
            else {
                var isRemark = 0;
            }

            var EA;


            
            var obj = {
                Id: $('#hdnDelegationMasterId').val(),
                DelName: $('#Delname').val(),
                DelegatedBy: $('#ddlAssignee').val(),
                StartDate1: ChangeDateFormat($('#plandate1').val()),
                StartDate2: ChangeDateFormat($('#plandate2').val()),
                StartDate3: $('#plandate2').val()? ChangeDateFormat($('#plandate3').val()) : '',
                Department: $('#ddlDepartment').val(),
                Doer: $('#ddlDoer').val(),
                ApprovalAuthority: $('#ddlPC').val(),
                EA: $('#ddlEA').val(),
                Branch: $("#ddlBranch").val(),
                EscalateEmail: $('#EscalateTo').val().join(),
                EscalationTime: $('#EscalationTime').val(),
                ReminderTime: $('#ReminderTimes').val(),
                isImageRequired: isImage,
                isRemarkRequired: isRemark,
                Weightage: $("#Weightage").val(),
                BeforeDateTask: $('#backTask').prop('checked')
            
            }
            var fileUpload = getAllInputValues();

            if ($('#resultupload').val() == "yes" || $('#resultupload').val() == "uploadreferenceimage") {

                var DelegationModel = {
                    delegationMasterModel: obj,
                    listDelegationDocumentUpload: fileUpload

                }

            }
            else {

                var DelegationModel = {
                    delegationMasterModel: obj,

                }
            }

            $('#delSave').prop('disabled', true);
                CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/SaveDelegation', DelegationModel, 'POST', function (response) {
                if (response.ValidationInput == 1) {

                    
                    RedirectDelegationRequest();
                }
                else {
                    showMessage(response.ErrorMessage, "error", 5000);
                    $('#delSave').prop('disabled', false);
                }

            });

        }
}

function RedirectDelegationRequest() {
    var url = "/ManageDelegation/Delegation?auth="+AuthToken;

    window.location.href = url;
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
        $("#file_" + array[1]).removeClass('Mandatory');
        $("#file_" + array[1]).addClass('Mandatory');


        return "error";

    }

    return "";


}

var ActualFile;
function showImage(ctrl) {
    var id = ctrl.split('_')[1];

    $('#viewMyImage').attr("src", $("#hdnUploadFileUrl_" + id).val());
    ActualFile = $("#hdnUploadActualFileName_" + id).val();
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

function AddPcRemark() {

    var exactvalue = jQuery.trim($("#PcRemarks").val());
    if (exactvalue == "") {
        $("#spPcRemarks").show();

    }
    else {
        var obj = {
            id: 0,
            Task_transID: Edit_ID,
            Remark: $("#PcRemarks").val(),
            Type: 2,
        }

        CommonAjaxMethodTMS(baseURL + 'ManageDoer/SavePcTask', obj, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                RedirecttoSame();
            }
            else {
                showMessage(response.ErrorMessage, "error", 5000);
            }

        });
    }
}

function RedirecttoSame() {
    window.location.href = window.location.href;
}
function SavePcTaskCancellation() {

    var exactvalue = jQuery.trim($("#pcCancel").val());
    if (exactvalue == "") {
        $("#sppcCancel").show();

    }
    else {
        var obj = {
            id: 0,
            Task_transID: Edit_ID,
            Remark: $("#pcCancel").val(),
            Type: 3
        }

        $('#pcCancelBtn').prop('disabled', true);
        CommonAjaxMethodTMS(baseURL + 'ManageDoer/SavePcCancellation', obj, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                sessionStorage.setItem('successShown', 'true');
                sessionStorage.setItem('message', '<span class="checkmark">✅</span> Delegation Cancelled Successfully');
                RedirectDelegationRequest();
            }
            else {
                showMessage(response.ErrorMessage, "error", 5000);
            }

        });
    }

}


function SavePcTaskTermination() {

    var exactvalue = jQuery.trim($("#pcTerminate").val());
    if (exactvalue == "") {
        $("#sppcTerminate").show();

    }
    else {
        var obj = {
            id: 0,
            Task_transID: Edit_ID,
            Remark: $("#pcTerminate").val(),
            DelayD: 1,
            Type: 3
        }

        $('#pcTerminateBtn').prop('disabled', true);
        CommonAjaxMethodTMS(baseURL + 'ManageDoer/SavePcCancellation', obj, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                sessionStorage.setItem('successShown', 'true');
                sessionStorage.setItem('message', '<span class="checkmark">✅</span> Delegation Cancelled Successfully');
                RedirectDelegationRequest();
            }
            else {
                showMessage(response.ErrorMessage, "error", 5000);
            }

        });
    }

}

function GetFollowDetails(id) {
    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetDelegation', { id: id, Type : 1 }, 'GET', function (response) {
        console.log('PcDetails')
        console.log(response);
        var data = response.data.data.Table;

        for (var i = 0; i < data.length; i++) {

            var ele = '<div class="orderstatus" >' +
                '<div class="orderstatus-check"><span class="orderstatus-number"></span></div>' +
                '<div class="orderstatus-text">' +
                '<span class="cmttitle">' + getdatetimewithoutJson(data[i].Date) + '</span>' +
                '<p>' + data[i].Remark + '</p>' +
                '</div>' +
                '</div >';

            $("#AddPcRemarks").append(ele);

        }
    });

}


function RedirectDelegationRequest() {
    var url = "/ManageDelegation/Delegation?auth=" + AuthToken;

    window.location.href = url;
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
        $("#file_" + array[1]).removeClass('Mandatory');
        $("#file_" + array[1]).addClass('Mandatory');


        return "error";

    }

    return "";


}

var ActualFile;
function showImage(ctrl) {
    var id = ctrl.split('_')[1];

    $('#viewMyImage').attr("src", $("#hdnUploadFileUrl_" + id).val());
    ActualFile = $("#hdnUploadActualFileName_" + id).val();
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

function AddPcRemark() {

    var exactvalue = jQuery.trim($("#PcRemarks").val());
    if (exactvalue == "") {
        $("#spPcRemarks").show();

    }
    else {
        var obj = {
            id: 0,
            Task_transID: Edit_ID,
            Remark: $("#PcRemarks").val(),
            Type: 2,
        }

        CommonAjaxMethodTMS(baseURL + 'ManageDoer/SavePcTask', obj, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                RedirecttoSame();
            }
            else {
                showMessage(response.ErrorMessage, "error", 5000);
            }

        });
    }
}

function RedirecttoSame() {
    window.location.href = window.location.href;
}
function SavePcTaskCancellation() {

    var exactvalue = jQuery.trim($("#pcCancel").val());
    if (exactvalue == "") {
        $("#sppcCancel").show();

    }
    else {
        var obj = {
            id: 0,
            Task_transID: Edit_ID,
            Remark: $("#pcCancel").val(),
            Type: 3
        }

        $('#pcCancelBtn').prop('disabled', true);
        CommonAjaxMethodTMS(baseURL + 'ManageDoer/SavePcCancellation', obj, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                sessionStorage.setItem('successShown', 'true');
                sessionStorage.setItem('message', '<span class="checkmark">✅</span> Delegation Cancelled Successfully');
                RedirectDelegationRequest();
            }
            else {
                showMessage(response.ErrorMessage, "error", 5000);
            }

        });
    }

}


function SavePcTaskTermination() {

    var exactvalue = jQuery.trim($("#pcTerminate").val());
    if (exactvalue == "") {
        $("#sppcTerminate").show();

    }
    else {
        var obj = {
            id: 0,
            Task_transID: Edit_ID,
            Remark: $("#pcTerminate").val(),
            DelayD: 1,
            Type: 3
        }

        $('#pcTerminateBtn').prop('disabled', true);
        CommonAjaxMethodTMS(baseURL + 'ManageDoer/SavePcCancellation', obj, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                sessionStorage.setItem('successShown', 'true');
                sessionStorage.setItem('message', '<span class="checkmark">✅</span> Delegation Cancelled Successfully');
                RedirectDelegationRequest();
            }
            else {
                showMessage(response.ErrorMessage, "error", 5000);
            }

        });
    }

}

function GetFollowDetails(id) {
    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetDelegation', { id: id, Type : 1 }, 'GET', function (response) {
        console.log('PcDetails')
        console.log(response);
        var data = response.data.data.Table;

        for (var i = 0; i < data.length; i++) {

            var ele = '<div class="orderstatus" >' +
                '<div class="orderstatus-check"><span class="orderstatus-number"></span></div>' +
                '<div class="orderstatus-text">' +
                '<span class="cmttitle">' + getdatetimewithoutJson(data[i].Date) + '</span>' +
                '<p>' + data[i].Remark + '</p>' +
                '</div>' +
                '</div >';

            $("#AddPcRemarks").append(ele);

        }
    });

}


