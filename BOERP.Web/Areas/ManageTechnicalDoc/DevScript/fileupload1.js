// Function to handle file upload and preview
let fileDataCollection1 = [];
let uploadedFiles1 = [];

function fileUploadWithPreview1(dropArea) {
    
    const dragFile = document.getElementById("dragFile1"),
        button = document.getElementById("fileInputButton1"),
        input = document.getElementById("fileRefDocStep1"),
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
    const allowedExtensions = ['.PDF', '.DOCX', '.TXT', '.XLS', '.XLSX', '.JPEG', '.JPG']; // AllowedFileUploadExtension
   

    function handleFiles(files) {
        files.forEach((file) => {
            // Get the true file extension (after the last dot)
            const parts = file.name.split('.');
            const fileExtension = parts.length > 1 ? '.' + parts.pop().toUpperCase() : '';

            // Validate extension
            if (!allowedExtensions.includes(fileExtension)) {
                showPopup(`The file "${file.name}" has an unsupported format. Please upload files of type: ${allowedExtensions.join(', ').toLowerCase()}.`);
                return;
            }

            // Validate file size
            if (file.size < MIN_FILE_SIZE || file.size > MAX_FILE_SIZE) {
                showPopup(`The file size for "${file.name}" is invalid. File size should be between 0KB and 2MB.`)
                return;
            }

            // Validate file count
            if ($('.document-file').length >= MAX_FILES) {
                showPopup(`You can upload a maximum of ${MAX_FILES} files.`);
                return;
            }

            // Avoid duplicates
            if (!uploadedFiles1.includes(file.name)) {
                uploadedFiles1.push(file.name);
                fileDataCollection1.push(file);

                const fileName = file.name;
                const fileType = file.type.split("/")[0];
                const type = file.type;
                const fileUrl = "";
                const fFd = 0;

                previewFile1(fileName, fileType, type, fileUrl, fFd);
            }
        });
    }


    // Preview the file based on its type
    function previewFile1(fileName, fileType, type, fileUrl, fFd) {
        let previewElement;

        if (fileType === "image") {
            previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="RemoveAttachFile1(this)"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
        } else if (fileType === "application" && type === "application/pdf") {
            previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
        } else if (fileType === "video") {
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
        } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            // For Word files: Show Word icon
            previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
        } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            // For Excel files: Show Excel icon
            previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
        } else {
            previewElement = `<div class="file-preview">
            <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button onclick="RemoveAttachFile1(this)" id="${fileUrl + "||" + fFd + "||" + fileName}" class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
        }

        const newDocument = document.createElement("div");
        newDocument.classList.add("document-file1", "document-file");

        newDocument.innerHTML = previewElement;

        documentImages1.appendChild(newDocument);

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
    //debugger;
    var result = confirm("Are you sure want to delete this file?");
    if (result) {
        var fileDetails = ctr.id.split('||');
        var url = fileDetails[0];
        var id = fileDetails[1];
        var fileName = fileDetails[2];
        var obj =
        {
            FileUrl: url, Id: id, Type: 1, ScreenId: "Indent_100"
        }
        CommonAjaxMethod(virtualPath + 'ContentManagement/DeleteFileWithAuth', obj, 'POST', function (response) {
            // Remove the file from the uploadedFiles array
            if (fileDataCollection1.length > 0) {
                fileDataCollection1 = fileDataCollection1.filter(file => file.name !== fileName);
            }
            uploadedFiles1 = uploadedFiles1.filter((name) => name !== fileName);
            var newfileName = response.FileModel.NewFileName;
            fileModelList = fileModelList.filter(function (itemParent) { return (itemParent.NewFileName != newfileName); });
            // Remove the closest parent container (.flexline or any other wrapper)
            ctr.closest(".document-file").remove();
        });


    }
}

function DownloadIndentFile1(ctr) {
    var fileDetails = ctr.id.split('||');
    var fileURl = fileDetails[0];
    var fileName = fileDetails[2];

    if (fileURl != null || fileURl != undefined) {
        var stSplitFileName = fileName.split(".");
        var link = document.createElement("a");
        link.download = stSplitFileName[0];
        link.href = fileURl;
        link.click();
    }
}
