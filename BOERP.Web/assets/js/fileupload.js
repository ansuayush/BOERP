// Function to handle file upload and preview
function fileUploadWithPreview(dropArea) {
    const dragFile = dropArea.querySelector(".drag-file"),
        button = dropArea.querySelector(".file-input-button"),
        input = dropArea.querySelector(".file-input"),
        documentImages = dropArea.querySelector(".document-images");

    let uploadedFiles = [];
    const MAX_FILES = 10;
    const MIN_FILE_SIZE = 20 * 1024; // 20 KB
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
                showPopup(`The file size for "${file.name}" is invalid. File size should be between 20KB and 2MB.`);
                return;
            }

            if (uploadedFiles.length >= MAX_FILES) {
                // Show the popup when the file limit is reached
                showPopup(`You can upload a maximum of ${MAX_FILES} files.`);
                return;
            }

            if (!uploadedFiles.includes(file.name)) {
                uploadedFiles.push(file.name);
                previewFile(file);
            }
        });
    }

    // Preview the file based on its type
    function previewFile(file) {
        const fileName = file.name;
        const fileType = file.type.split("/")[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            let previewElement;

            if (fileType === "image") {
                previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="~${fileUrl}" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
            } else if (fileType === "application" && file.type === "application/pdf") {
                previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
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
                        <button class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
            } else if (file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                // For Word files: Show Word icon
                previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
            } else if (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                // For Excel files: Show Excel icon
                previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
            } else {
                previewElement = `<div class="file-preview">
                    <p class="preview-text"> ${fileName}</p>
                    <button class="delete-document" data-filename="${fileName}"><img src="../../assets/images/icons/help/close.svg" alt=""></button>
                </div>`;
            }

            const newDocument = document.createElement("div");
            newDocument.classList.add("document-file");
            newDocument.innerHTML = previewElement;

            documentImages.appendChild(newDocument);
        };

        reader.readAsDataURL(file);
    }

    // Handle file deletion
    documentImages.addEventListener("click", (e) => {
        let target = e.target;

        if (target.tagName === "IMG" && target.closest(".delete-document")) {
            target = target.closest(".delete-document");
        }

        if (target.classList.contains("delete-document")) {
            const fileName = target.dataset.filename;
            uploadedFiles = uploadedFiles.filter((name) => name !== fileName);
            target.closest(".document-file").remove();
        }
    });

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
document.querySelectorAll(".drag-area").forEach(fileUploadWithPreview);
