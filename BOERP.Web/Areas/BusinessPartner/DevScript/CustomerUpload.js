
let fileDataCollection1 = [];
let uploadedFiles1 = [];

function fileUploadWithPreview1(dropArea) {

    const dragFile = document.getElementById("dragFile1"),
        button = document.getElementById("fileInputButton1"),
        input = document.getElementById("fileUpload"),
        documentImages1 = document.getElementById("documentImages1");

    const MAX_FILES = 10;
    const MIN_FILE_SIZE = 0 * 1024; // 20 KB
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    // Trigger file input when clicking on the button
    button.onclick = () => {
        input.click();
    };

    // Handle file input change event
    input.addEventListener("change", function (e) {
        const files = e.target.files;
        if (files.length > 0) {
            handleFiles(Array.from(files));
        }
        input.value = ""; // Reset input value after file selection
    });

    // Handle drag events for the drop area
    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.classList.add("active");
        dragFile.textContent = "Release to Upload File";
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("active");
        dragFile.textContent = "Drag files here to upload";

    });

    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.classList.remove("active");
        dragFile.textContent = "Drag files here to upload";
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(Array.from(files));
        }
    });

    // Handle the files selected or dragged over
    function handleFiles(files) {
        files.forEach((file) => {
            // Check if file size is within the specified range
            if (file.size < MIN_FILE_SIZE || file.size > MAX_FILE_SIZE) {
                showPopup(`The file size for "${file.name}" is invalid. File size should be between 0KB and 2MB.`);
                return;
            }

            if (uploadedFiles1.length >= MAX_FILES) {
                // Show the popup when the file limit is reached
                showPopup(`You can upload a maximum of ${MAX_FILES} files.`);
                return;
            }
            if (!file) {
                alert("No file selected.");
                return;
            }

            const allowedExtensions = [".xls", ".xlsx"];
            const fileName1 = file.name.toLowerCase();
            const isValid = allowedExtensions.some(ext => fileName1.endsWith(ext));

            if (!isValid) {
                //alert("Only Excel files (.xls, .xlsx) are allowed.");
                FailToaster("Only Excel files(.xls, .xlsx) are allowed.");
                input.value = ""; // Reset file input
                return;
            }
            if (!uploadedFiles1.includes(file.name)) {
                uploadedFiles1.push(file.name);
                fileDataCollection1.push(file);
                var fileName = file.name;
                var fileType = file.type.split("/")[0];
                var type = file.type
                var fileUrl = "";
                var fFd = 0;
                previewFile1(fileName, fileType, type, fileUrl, fFd);


                var formData = new FormData();
                formData.append("file", file);
                fileCount = document.querySelectorAll('.document-file1 .file-preview').length;
                if (fileCount == 1) {
                    $.ajax({
                        url: '/Material/BulkUploadVendors',
                        type: 'POST',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            $("#customLoader").hide();
                            if ($('#btnExcelUpload').is(':visible')) {
                                //console.log('Button is visible');
                            } else {
                                let decodedJson = atob(response);  // Decode Base64
                                ItemsArray = JSON.parse(decodedJson); // Convert back to JSON
                                if (ItemsArray.length > 0) {
                                    $('#btnExcelUpload').show();
                                }
                                else {
                                    $('#btnExcelUpload').hide();
                                    //alert('Excel file is not in correct format.')
                                    FailToaster("Excel file is not in correct format.");
                                }
                            }
                           
                        },
                        error: function () {
                            $("#customLoader").hide();
                        }
                    });
                }
            }
        });
    }

    // Preview the file based on its type
    function previewFile1(fileName, fileType, type, fileUrl, fFd) {
        let previewElement;

        if (fileType === "image") {
            previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="~${fileUrl}" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile1(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
        }
        else if (fileType === "application" && type === "application/pdf") {
            previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
        }
        else if (fileType === "video") {
            previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <video class="preview-video" controls>
                            <source src="${e.target.result}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
        }
        else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            // For Word files: Show Word icon
            previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
        }
        else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            // For Excel files: Show Excel icon
            previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
        }
        else {
            previewElement = `<div class="file-preview">
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
        }

        const newDocument = document.createElement("div");
        newDocument.classList.add("document-file1", "document-file");

        newDocument.innerHTML = previewElement;
        fileCount = document.querySelectorAll('.document-file1 .file-preview').length;
        if (fileCount == 0) {
            documentImages1.appendChild(newDocument);
        }

    }

    //// Handle file deletion
    //documentImages.addEventListener("click", (e) => {
    //    let target = e.target;

    //    if (target.tagName === "IMG" && target.closest(".delete-document")) {
    //        target = target.closest(".delete-document");
    //    }

    //    if (target.classList.contains("delete-document")) {
    //        const fileName = target.dataset.filename;
    //        uploadedFiles = uploadedFiles.filter((name) => name !== fileName);
    //        target.closest(".document-file").remove();
    //    }
    //});

    // Function to show the custom popup
    function showPopup(message) {
        const popup = document.getElementById("fileLimitPopup");
        const messageElement = document.getElementById("popup-message");
        messageElement.textContent = message;
        popup.style.display = "flex"; // Show the popup
    }

    // Close the popup when the user clicks 'Close'
    document.getElementById("close-popup").addEventListener("click", () => {
        document.getElementById("fileLimitPopup").style.display = "none";
    });
}

// Initialize the file upload for all drag areas on the page
document.querySelectorAll(".drag-area1").forEach(fileUploadWithPreview1);


function RemoveAttachFile1(ctr) {
    var result = confirm("Are you sure want to delete this file?");
    if (result) {
        var fileDetails = ctr.id.split('||');
        var url = fileDetails[0];
        var id = fileDetails[1];
        var fileName = fileDetails[2];
        var obj =
        {
            FileUrl: url, Id: id, Type: 1, ScreenId: "ItemMaster_102"
        }
        CommonAjaxMethod(virtualPath + 'ContentManagement/DeleteFileWithAuth', obj, 'POST', function (response) {
            // Remove the file from the uploadedFiles array
            if (fileDataCollection1.length > 0) {
                fileDataCollection1 = fileDataCollection1.filter(file => file.name !== fileName);
            }
            var newfileName = response.FileModel.NewFileName;
            uploadedFiles1 = uploadedFiles1.filter((name) => name !== fileName);
            //fileModelList = fileModelList.filter(function (itemParent) { return (itemParent.NewFileName != newfileName); });
            // Remove the closest parent container (.flexline or any other wrapper)
            ctr.closest(".document-file1").remove();
            $('#btnExcelUpload').hide();
        });


    }
}
