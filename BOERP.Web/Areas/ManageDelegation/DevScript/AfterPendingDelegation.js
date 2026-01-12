$(document).ready(function () {




    var obj2 = {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: ManaulTableEnum.Employee,
        manualTableId: ManaulTableEnum.Employee
    }



    LoadMasterDropdownTMS('EscalateTo', obj2, 'Select', false);




    EditDelegationMaster(Edit_ID);
    GetFollowDetails(Edit_ID);



});

function EditDelegationMaster(id) {
    if (isCompleted == 1) {
        CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetDelegation', { id: id, Type: 4 }, 'GET', function (response) {
            console.log(response);
            var data = response.data.data.Table[0];
            var files = response.data.data.Table1;
            fillValues(data, files);




        });
    }

    else {
        CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetDelegation', { id: id, Type: 3 }, 'GET', function (response) {
            console.log(response);
            var data = response.data.data.Table[0];
            var files = response.data.data.Table1;
            fillValues(data, files);




        });
    }

}


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
    }

    else if (data.IsImageRequired == 3) {
        $('#isImageRequired').html("Only Upload Reference Image");
    }
    else {
        $('#isImageRequired').html("No");
        $('#yesupload').hide();
    }
    document.getElementById('isRemarkRequired').textContent = data.IsRemarkRequired ? 'Yes' : 'No';

    if (data.IsRemarkRequired) {
        $('#userRemarkUpload').show();
        $('#userRemarks').val(data.DoerRemarks);
        $('#userRemarks').prop('disabled', true);
    }

    if (isCompleted == 1) {
        if (data.IsAudit == true) {
            $('#isAudit').html('Yes');
        }
        else {
            $('#isAudit').html('No');
        }
        $('#AuditRemarks').html(data.Remark);
    }


    document.getElementById('EA').textContent = data.EA;
    if (data.EscalateEmail != null) {
        $('#EscalateTo').val(data.EscalateEmail.split(','));
    }
    $('#EscalateTo').prop('disabled', true);


    for (var i = 0; i < files.length; i++) {
        var id = i + 1;
        var ele = ` <tr>
        <td class="text-center">${id}</td>
        <input type="hidden" id="hdnUploadActualFileName_${id}" />
        <input type="hidden" id="hdnUploadFileUrl_${id}" />
       <td><p class="text-p mb-0 " id="view_${id}" onclick="showImage(this.id)" ><img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</p></td>
       <input type="hidden" id="hdnUploadUserActualFileName_${id}" />
       <input type="hidden" id="hdnUserUploadFileUrl_${id}" />
        <td class="${data.IsImageRequired == 3 ? "noDisplay" : ""}"><p class="text-p mb-0 " id="Userview_${id}" onclick="showUserImage(this.id)" ><img src="/assets/images/icons/help/view-icon.png" alt="" class="icon-xsm"> View</p></td>
           </tr>`;

        $('#imageBody').append(ele);

        $('#hdnUploadFileUrl_' + id).val(files[i].FileURL);
        $('#hdnUserUploadFileUrl_' + id).val(files[i].UserFileURL);
        $('#hdnUploadActualFileName_' + id).val(files[i].QActualFileName);
        $('#hdnUploadUserActualFileName_' + id).val(files[i].UserActualFileName);

    }

    if (data.IsImageRequired == 3) {
        $('#imageUpload').hide();
    }
}

var ActualFile;
function showImage(ctrl) {
    var id = ctrl.split('_')[1];

    $('#viewMyImage').attr("src", $("#hdnUploadFileUrl_" + id).val());
    ActualFile = $('#hdnUploadActualFileName_' + id).val();
    handleTaskFile();
}

function showUserImage(ctrl) {
    var id = ctrl.split('_')[1];

    $('#viewMyImage').attr("src", $("#hdnUserUploadFileUrl_" + id).val());
    ActualFile = $('#hdnUploadUserActualFileName_' + id).val();
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

function GetFollowDetails(id) {
    CommonAjaxMethodTMS(baseURL + 'DelegationTransaction/GetDelegation', { id: id, Type: 1 }, 'GET', function (response) {
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
