$(document).ready(function () {

    $("#fileAttach1").change(function () {
        UploadocumentReport(1);
        $('#spfileAttach1').hide();
    })
    $("#fileAttach2").change(function () {
        UploadocumentReport(2);
    })
    $("#fileAttach3").change(function () {
        UploadocumentReport(3);
    })
    $("#fileAttach4").change(function () {
        UploadocumentReport(4);
        $('#spfileAttach4').hide();
    })
    $("#fileAttach5").change(function () {
        UploadocumentReport(5);
    })
    $("#fileAttach6").change(function () {
        UploadocumentReport(6);
    })
    $("#fileAttach7").change(function () {
        UploadocumentReport(7);
    })
    $("#fileAttach8").change(function () {
        UploadocumentReport(8);
    })
    $("#fileAttach9").change(function () {
        UploadocumentReport(9);
    })
    $("#fileAttach10").change(function () {
        UploadocumentReport(10);
    })
    $("#fileAttach11").change(function () {
        UploadocumentReport(11);
    })
    $("#fileAttach12").change(function () {
        UploadocumentReport(12);
    })
    $("#fileAttach13").change(function () {
        UploadocumentReport(13);
    })
    if (ScreenLock == "True") {
        $('input, textarea, select, button').prop('disabled', true);
        //$('#btnSubmitAttachments').prop('disabled', false);
    }
    else {
        $('input, textarea, select, button').prop('disabled', false);
    }
    BindOnboardAttachmentRequest();
});
var DocArray = [];
var DocArrayId;
var responseCount;
function BindOnboardAttachmentRequest() {
    CommonAjaxMethod(virtualPath + 'OnboardingRequest/BindonboardingAttachments', { CandidateId: CandidateId, inputData: 6 }, 'GET', function (response) {
        var dataAttachments = response.data.data.Table;
        var dataRegistration = response.data.data.Table1;
        responseCount = dataAttachments.length;
        DocArrayId = responseCount;
        for (var i = 0; i < dataAttachments.length; i++) {
            var fileId = i + 1;
            if (i < dataAttachments.length) {
                $('#hdnUploadActualFileName' + fileId).val(dataAttachments[i].AttachmentActualName);
                $('#hdnUploadNewFileName' + fileId).val(dataAttachments[i].AttachmentNewName);
                $('#hdnNature' + fileId).val(dataAttachments[i].NatureofDocuments);
                $('#hdnUploadFileUrl' + fileId).val(dataAttachments[i].AttachmentUrl);
                $('#txtAttach' + fileId).val(dataAttachments[i].Remark);
                $('#lblAttachement' + fileId).text(dataAttachments[i].AttachmentActualName);
                if (dataAttachments[i].AttachmentUrl != null) {
                    var path = dataAttachments[i].AttachmentUrl.substring(1, dataAttachments[i].AttachmentUrl.length);
                    $('#lblAttachementView' + fileId).attr("href", virtualPath + path);
                }
                $('#hdnAttachmentID' + fileId).val(dataAttachments[i].AttachmentID);

                if (i > 12) {
                    var fileId = i + 1;
                    var newtbblData = "<tr><td>" + fileId + "</td><td>" + dataAttachments[i].NatureofDocuments + "</td><td></td><td><input type='hidden' id='hdnNature" + fileId + "' /><input type='hidden' id='hdnUploadFileUrl" + fileId + "' /><input type='hidden' id='hdnUploadActualFileName" + fileId + "' /><input type='hidden' id='hdnUploadNewFileName" + fileId + "' /><input type='hidden' id='hdnAttachmentID" + fileId + "' /> <a id='lblAttachementView" + fileId + "' href='' target='_blank' class='float - right' style='margin - top: -18px;'>" + dataAttachments[i].AttachmentActualName + "</a></td><td> <textarea class='form-control maxSize[1200]' placeholder='Enter' id='txtAttach" + fileId + "'></textarea></td>" +
                        "<td><a title='Click to Remove' data-toggle='tooltip' data-original-title='Click to Remove' onclick='DeleteAttachment(this," + fileId + ")'><i class='fas fa-window-close m-0 red-clr' aria-hidden='true'></i> </a></td></tr > ";
                    $("#tblDocumentList").find('tbody').append(newtbblData);
                    if (dataAttachments[i].AttachmentUrl != null) {
                        var path = dataAttachments[i].AttachmentUrl.substring(1, dataAttachments[i].AttachmentUrl.length);
                        $('#lblAttachementView' + fileId).attr("href", virtualPath + path);
                    }
                    $('#hdnUploadActualFileName' + fileId).val(dataAttachments[i].AttachmentActualName);
                    $('#hdnUploadNewFileName' + fileId).val(dataAttachments[i].AttachmentNewName);
                    $('#hdnNature' + fileId).val(dataAttachments[i].NatureofDocuments);
                    $('#hdnUploadFileUrl' + fileId).val(dataAttachments[i].AttachmentUrl);
                    $('#txtAttach' + fileId).val(dataAttachments[i].Remark);
                    $('#lblAttachement' + fileId).text(dataAttachments[i].AttachmentActualName);
                    $('#hdnAttachmentID' + fileId).val(dataAttachments[i].AttachmentID);
                }
            }
            else {
                DocArrayId = dataAttachments[i].SRNo;
                var objAttach =
                {
                    SRNo: DocArrayId,
                    AttachmentActualName: dataAttachments[i].AttachmentActualName,
                    AttachmentNewName: dataAttachments[i].AttachmentNewName,
                    NatureofDocuments: dataAttachments[i].NatureofDocuments,
                    AttachmentPath: dataAttachments[i].AttachmentUrl,
                    Remark: dataAttachments[i].Remark
                };
                DocArray.push(objAttach);
            }
        }

        if (dataRegistration.length > 0) {
            if (dataRegistration[0].LIFlagPan == true && dataRegistration[0].LIPan != null) {
                var childData = dataAttachments.filter(function (itemParent) { return (itemParent.NatureofDocuments == "PAN Card" && itemParent.AttachmentActualName != null); });
                if (childData.length > 0) {
                    $('#supPANCard').attr({ 'className': 'red-clr' }).html('');
                    $('#fileAttach1').attr({ 'class': 'form-control' });
                }
                else {
                    $('#supPANCard').attr({ 'className': 'red-clr' }).html('*');
                    $('#fileAttach1').attr({ 'class': 'form-control Mandatory' })
                }
            }
            if (dataRegistration[0].LIFlagAadhar == true && dataRegistration[0].LIAadharNo != null) {
                var childData = dataAttachments.filter(function (itemParent) { return (itemParent.NatureofDocuments == "Aadhar" && itemParent.AttachmentActualName != null); });
                if (childData.length > 0) {
                    $('#supAadhar').attr({ 'className': 'red-clr' }).html('');
                    $('#fileAttach2').attr({ 'class': 'form-control' })
                }
                else {
                    $('#supAadhar').attr({ 'className': 'red-clr' }).html('*');
                    $('#fileAttach2').attr({ 'class': 'form-control Mandatory' })
                }
            }
            if (dataRegistration[0].LIFlagVoterID == true && dataRegistration[0].LIVoterIDNo != null) {
                $("#fileAttach4").attr("disabled", false);
                $("#txtAttach4").attr("disabled", false);
                var childData = dataAttachments.filter(function (itemParent) { return (itemParent.NatureofDocuments == "Voter ID" && itemParent.AttachmentActualName != null); });
                if (childData.length > 0) {
                    $('#supVoterID').attr({ 'className': 'red-clr' }).html('');
                    $('#fileAttach4').attr({ 'class': 'form-control ' })
                }
                else {
                    $('#supVoterID').attr({ 'className': 'red-clr' }).html('*');
                    $('#fileAttach4').attr({ 'class': 'form-control Mandatory' })
                }
            }
            if (dataRegistration[0].LIFlagVoterID == false) {
                $("#fileAttach4").attr("disabled", true);
                $("#txtAttach4").attr("disabled", true); 
               
            }
            if (dataRegistration[0].LIFlagPassport == true && dataRegistration[0].LIPassportNo != null) {
                $("#fileAttach5").attr("disabled", false);
                $("#txtAttach5").attr("disabled", false);
                var childData = dataAttachments.filter(function (itemParent) { return (itemParent.NatureofDocuments == "Passport" && itemParent.AttachmentActualName != null); });
                if (childData.length > 0) {
                    $('#supPassportID').attr({ 'className': 'red-clr' }).html('');
                    $('#fileAttach5').attr({ 'class': 'form-control' })
                }
                else {
                    $('#supPassportID').attr({ 'className': 'red-clr' }).html('*');
                    $('#fileAttach5').attr({ 'class': 'form-control Mandatory' })
                }
            }
            if (dataRegistration[0].LIFlagPassport == false) {
                $("#fileAttach5").attr("disabled", true);
                $("#txtAttach5").attr("disabled", true);
            }
            if (dataRegistration[0].LIFlagUAN == true && dataRegistration[0].LIUAN != null) {
                $("#fileAttach6").attr("disabled", false);
                $("#txtAttach6").attr("disabled", false);
                var childData = dataAttachments.filter(function (itemParent) { return (itemParent.NatureofDocuments == "UAN" && itemParent.AttachmentActualName != null); });
                if (childData.length > 0) {
                    $('#supUANID').attr({ 'className': 'red-clr' }).html('');
                    $('#fileAttach6').attr({ 'class': 'form-control' })
                }
                else {
                    $('#supUANID').attr({ 'className': 'red-clr' }).html('*');
                    $('#fileAttach6').attr({ 'class': 'form-control Mandatory' })
                }
            }
            if (dataRegistration[0].LIFlagUAN == false) {
                $("#fileAttach6").attr("disabled", true);
                $("#txtAttach6").attr("disabled", true);
            }
            if (dataRegistration[0].LIFlagPIOOCI == true && dataRegistration[0].LIPIOOCI != null) {
                var childData = dataAttachments.filter(function (itemParent) { return (itemParent.NatureofDocuments == "PIO, if applicable" && itemParent.AttachmentActualName != null); });
                if (childData.length > 0) {
                    $('#supPIOID').attr({ 'className': 'red-clr' }).html('');
                    $('#fileAttach7').attr({ 'class': 'form-control' })
                }
                else {
                    $('#supPIOID').attr({ 'className': 'red-clr' }).html('*');
                    $('#fileAttach7').attr({ 'class': 'form-control Mandatory' })
                }
            }
            if (dataRegistration[0].LIFlagDrivingLicense == true && dataRegistration[0].LIDrivingLicenseNo != null) {
                var childData = dataAttachments.filter(function (itemParent) { return (itemParent.NatureofDocuments == "DL" && itemParent.AttachmentActualName != null); });
                if (childData.length > 0) {
                    $('#supDL').attr({ 'className': 'red-clr' }).html('');
                    $('#fileAttach8').attr({ 'class': 'form-control' })
                }
                else {
                    $('#supDL').attr({ 'className': 'red-clr' }).html('');
                    $('#fileAttach8').attr({ 'class': 'form-control Mandatory' })
                }
            }
            //var childData1 = dataAttachments.filter(function (itemParent) { return (itemParent.NatureofDocuments == "Work Visa, if applicable" && itemParent.AttachmentActualName != null); });
            //if (childData1.length > 0) {
            //    $('#supDL').attr({ 'className': 'red-clr' }).html('');
            //    $('#fileAttach12').attr({ 'class': 'form-control' })
            //}
            //else {
            //    $('#supDL').attr({ 'className': 'red-clr' }).html('');
            //    $('#fileAttach12').attr({ 'class': 'form-control Mandatory' })
            //}
            if (dataRegistration[0].Nationality == "2") {
                if (document.getElementById('lblAttachement12').innerText == "") {
                    $('#supWorkVisaifApplicable').attr({ 'className': 'red-clr' }).html('*');
                    $('#fileAttach12').attr({ 'class': 'form-control Mandatory' })
                }
                else {
                    $('#supWorkVisaifApplicable').attr({ 'className': 'red-clr' }).html('');
                    $('#fileAttach12').attr({ 'class': 'form-control' })
                }
            }
            else {
                $('#supWorkVisaifApplicable').attr({ 'className': 'red-clr' }).html('');
                $('#fileAttach12').attr({ 'class': 'form-control' })
            }
        }
        BindDocumentGrid(DocArray);
    });
}

function BindDocumentGrid(array) {
    for (var i = 0; i < array.length; i++) {
        var newtbblData = "<tr><td>" + array[i].SRNo + "</td><td>" + array[i].NatureofDocuments + "</td><td></td><td>" + array[i].AttachmentActualName + "</td><td>" + array[i].Remark + "</td>" +
            "<td><a title='Click to Remove' data-toggle='tooltip' data-original-title='Click to Remove' onclick='deleteDocArrayRows(this," + array[i].Id + ")'><i class='fas fa-window-close m-0 red-clr' aria-hidden='true'></i> </a></td></tr > ";
        $("#tblDocumentList").find('tbody').append(newtbblData);
    }
}
function SaveAttachments() {
    var valid = true;
    if (checkValidationOnSubmit('Mandatory') == false) {
        valid = false;
    }
    if (checkValidationOnSubmit('Mandatorypld') == false) {
        valid = false;
    }

    if (valid == true) {
        var isValid = true;
        var isValidCheck = true;
        //if ($('#hdnUploadActualFileName1').val() == "") {
        //    $('#spfileAttach1').show();
        //    isValid = false;
        //}
        //else {
        //    $('#spfileAttach1').hide();
        //}

        var docArrayList = [];
        for (var i = 0; i < $("#tblDocumentList tr").length - 2; i++) {
            var d = i + 1;
            var docObject =
            {
                CandidateId: CandidateId,
                SRNo: d,
                AttachmentActualName: $('#hdnUploadActualFileName' + d).val(),
                AttachmentNewName: $('#hdnUploadNewFileName' + d).val(),
                NatureofDocuments: $('#hdnNature' + d).val(),
                AttachmentUrl: $('#hdnUploadFileUrl' + d).val(),
                Remark: $('#txtAttach' + d).val(),
            }
            if (docObject.AttachmentActualName != undefined) {
                docArrayList.push(docObject);
            }
        }
        if (DocumentExtra == true) {
            for (var i = 0; i < DocArray.length; i++) {
                docArrayList.push(DocArray[i]);
            }
        }
        var attachmentObject =
        {
            AttachmentsModel: docArrayList
        }
        CommonAjaxMethod(virtualPath + 'OnboardingRequest/SaveUserAttachmentDocuments', attachmentObject, 'POST', function (response) {
            //window.location.href = virtualPath + 'Account/MeetingDetails';
            FailToaster('Attachment submitted successfully.');
            //window.location.reload();
        });
    }
}
function DeleteAttachment(ctrl, no) {
    if (ScreenLock != "True") {
        var url = $("#hdnUploadFileUrl" + no).val();
        if (url != '') {
            //var result = confirm("Are you sure want to delete this attach file?");
            ConfirmMsgBox("Are you sure want to delete this attach file?", '', function () {
                CommonAjaxMethod(virtualPath + 'CommonMethod/DeleteFile', { FileUrl: url }, 'POST', function (response) {
                    var AttachmentID = $('#hdnAttachmentID' + no).val();
                    CommonAjaxMethod(virtualPath + 'OnboardingRequest/DeleteAttachmentDocuments', { Id: AttachmentID, inputData: 5 }, 'POST', function (response) {
                        $('#hdnUploadActualFileName' + no).val('');
                        $('#hdnUploadNewFileName' + no).val('');
                        $('#hdnUploadFileUrl' + no).val('');
                        $("#fileAttach" + no).val(null);
                        $("#fileAttach" + no).val('');
                        $('#lblAttachement' + no).text('');
                        $("#txtAttach" + no).val('');
                        window.location.reload();
                    });
                });
            });
        }
        else {
            //document.getElementById('hReturnMessage').innerHTML = "File is not uploaded";
            //$('#btnShowModel').click();
            FailToaster("File is not uploaded");
        }
    }
}
function UploadocumentReport(no) {
    var fileUpload = $("#fileAttach" + no).get(0);
    var files = fileUpload.files;
    if (files.length > 0) {

        // Create FormData object
        var fileData = new FormData();

        // Looping over all files and add it to FormData object
        for (var i = 0; i < files.length; i++) {
            fileData.append(files[i].name, files[i]);
        }

        $.ajax({
            url: virtualPath + 'CommonMethod/UploadOnBoardindDocument',
            type: "POST",
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            data: fileData,
            success: function (response) {
                $("#customLoader").hide();
                var result = JSON.parse(response);
                if (result.ErrorMessage == "") {
                    $('#hdnUploadActualFileName' + no).val(result.FileModel.ActualFileName);
                    $('#hdnUploadNewFileName' + no).val(result.FileModel.NewFileName);
                    $('#hdnUploadFileUrl' + no).val(result.FileModel.FileUrl);
                    $('#lblAttachement' + no).text(result.FileModel.ActualFileName);
                }
                else {
                    FailToaster(result.ErrorMessage);
                    //document.getElementById('hReturnMessage').innerHTML = result.ErrorMessage;
                    //$('#btnShowModel').click();
                }
            }
            ,
            error: function (error) {
                $("#customLoader").hide();
                FailToaster(error);
                //document.getElementById('hReturnMessage').innerHTML = error;
                //$('#btnShowModel').click();
                isSuccess = false;
            }
        });
    }
    else {
        FailToaster("Please select file to attach!");
        //document.getElementById('hReturnMessage').innerHTML = "Please select file to attach!";
        //$('#btnShowModel').click();
    }
}
var DocumentExtra = false;
function UploadOtherDocumentExtra() {
    //if (checkValidationOnSubmit('UploadOtherDocument') == true) {
    var DocOtherRemark = document.getElementById("txtDocOtherRemark").value;
    var DocOtherNature = document.getElementById("txtDocOtherNature").value;
    var valid = true;
    if (checkValidationOnSubmit('AddRowMandatory') == false) {
        valid = false;
    }

    if (valid == true) {
        var fileUpload = $("#fileDocOtherUpload").get(0);

        var files = fileUpload.files;
        if (files.length > 0) {

            // Create FormData object
            var fileData = new FormData();

            // Looping over all files and add it to FormData object
            for (var i = 0; i < files.length; i++) {
                fileData.append(files[i].name, files[i]);
            }

            $.ajax({
                url: virtualPath + 'CommonMethod/UploadOnBoardindDocument',
                type: "POST",
                contentType: false, // Not to set any content header
                processData: false, // Not to process data
                data: fileData,
                success: function (response) {
                    $("#customLoader").hide();
                    var result = JSON.parse(response);
                    DocumentExtra = true;
                    if (result.ErrorMessage == "") {
                        DocArrayId = DocArrayId == 0 ? parseInt(13 + 1) : parseInt(DocArrayId + 1);// DocArrayId + 1;
                        var loop = DocArrayId;
                        var objarrayinner =
                        {
                            CandidateId: CandidateId,
                            SRNo: loop,
                            AttachmentActualName: result.FileModel.ActualFileName,
                            AttachmentNewName: result.FileModel.NewFileName,
                            NatureofDocuments: DocOtherNature,
                            AttachmentUrl: result.FileModel.FileUrl,
                            Remark: DocOtherRemark
                        }

                        DocArray.push(objarrayinner);

                        var newtbblData = "<tr><td>" + objarrayinner.SRNo + "</td><td>" + objarrayinner.NatureofDocuments + "</td><td></td><td><a target='_blank' href=" + objarrayinner.AttachmentUrl + ">" + objarrayinner.AttachmentActualName + "</a></td><td>" + objarrayinner.Remark + "</td>" +
                            "<td><a title='Click to Remove' data-toggle='tooltip' data-original-title='Click to Remove' onclick='deleteDocArrayRows(this," + objarrayinner.SRNo + ")'><i class='fas fa-window-close m-0 red-clr' aria-hidden='true'></i> </a></td></tr > ";

                        $("#tblDocumentList").find('tbody').append(newtbblData);
                        // BindDocumentGrid(DocArray);
                        $("#fileDocOtherUpload").val('');
                        $("#fileDocOtherUpload").val(null);
                        $("#txtDocOtherRemark").val('');
                        $("#txtDocOtherNature").val('');
                    }
                    else {
                        FailToaster(result.ErrorMessage);
                        //document.getElementById('hReturnMessage').innerHTML = result.ErrorMessage;
                        //$('#btnShowModel').click();
                    }
                }
                ,
                error: function (error) {
                    $("#customLoader").hide();
                    FailToaster(error);
                    //document.getElementById('hReturnMessage').innerHTML = error;
                    //$('#btnShowModel').click();
                    isSuccess = false;
                }
            });
        }
        else {
            FailToaster("Please select file to attach!");
            //document.getElementById('hReturnMessage').innerHTML = "Please select file to attach!";
            //$('#btnShowModel').click();
        }
    }
}
function deleteDocArrayRows(obj, id) {
    debugger
    ConfirmMsgBox("Are you sure want to delete this attach file?", '', function () {
        var data = DocArray.filter(function (itemParent) { return (itemParent.Id == id); });
        //var url = data[0].AttachmentPath;

        //CommonAjaxMethod(virtualPath + 'CommonMethod/DeleteFile', { FileUrl: url }, 'POST', function (response) {
            $(obj).closest('tr').remove();
            DocArray = DocArray.filter(function (itemParent) { return (itemParent.Id != id); });
        /*});*/
    })
}