
$(document).ready(function () {
    var obj1 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 65,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlBrand', obj1, 'Select', false);
});

$(document).on('input paste', '.char-limit', function () {
    const maxLength = 300;
    let text = $(this).val();
    if (text.length > maxLength) {
        text = text.substring(0, maxLength);
        $(this).val(text);
    }
    $(this).closest('.form-group').find('.counter').text(text.length + '/' + maxLength);
});
var orderItemTable;

//#region : Sale Order Gried Data
function bindSaleOrderGridFilter() {

    let filterData = tableData;

    var BrandId = $("#ddlBrand").val() === 'Select' ? '0' : $("#ddlBrand").val();

    if (BrandId != '0') {

        filterData = filterData.filter(row => row.BrandId == BrandId);
    }

    gridOptions.api.setRowData(filterData.length > 0 ? filterData : []);

}

let tableData = []; // Load via API as you already do
document.addEventListener("DOMContentLoaded", function () {
    tableData = [];
    bindSaleOrderGrid();
});


function bindSaleOrderGrid() {
    $("#customLoader").show();

    //Replaceable content
    //Start
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'SaleOrderItem_102',//Need to change the screen id as per your data
        //modelData: jsonString,
        modelData: JSON.stringify({
            BrandId: $("#ddlBrand").val() == 'Select' ? '0' : $("#ddlBrand").val(),
            CreaterId: $("#ddlCreator").val() == 'All' ? '0' : $("#ddlCreator").val(),
            Type: 1

        })
    };
    //End

    CommonAjaxMethod(virtualPath + 'Generic/GetPagingRecordsAgGridAsync', requestData, 'GET', function (response) {
        console.log(response);
        tableData = response.data.Records;
        var columnMeta = response.data.ColumnData;
        gridOptions = bindAgGrid("#myGrid", 'SaleOrderFMSGried', columnMeta, tableData);
        $("#customLoader").hide();
    });
}

//#endregion

function closeView() {
    $('.modal').modal('hide'); // hide any open modals
    $('.modal-backdrop').remove(); // remove leftover backdrops
    $('body').removeClass('modal-open'); // reset scroll lock
    $('body').css('padding-right', ''); // reset padding if added
}

var orderItemId = 0;
function getModalFieldByStepNo(rowId, griedOrderItemId, StepNo, ItemOTDStatus) {
    if (rowId > 0 && griedOrderItemId > 0) {

        orderItemId = griedOrderItemId;
        if (StepNo == 1) {
            showModalFieldStep1(rowId, StepNo)
        }
        else if (StepNo == 2) {
            if (ItemOTDStatus === 'New') {
                showModalFieldNewStep2New(rowId, StepNo, ItemOTDStatus)
            }
            else {
                showModalFieldRepeatStep2(rowId, StepNo, ItemOTDStatus)
            }

        }
        else if (StepNo == 3) {
            showModalFieldStep3(rowId, StepNo)
        }
        else if (StepNo == 4) {
            showModalFieldStep4(rowId, StepNo)
        }
        else if (StepNo == 5) {
            showModalFieldStep5(rowId, StepNo)
        }
        else if (StepNo == 6) {
            showModalFieldStep6(rowId, StepNo)
        }
        else if (StepNo == 7) {
            showModalFieldStep7(rowId, StepNo)
        }
        else if (StepNo == 8) {
            showModalFieldStep8(rowId, StepNo)
        }
        else if (StepNo == 9) {
            showModalFieldStep9(rowId, StepNo)
        }
        else if (StepNo == 10) {
            showModalFieldStep10(rowId, StepNo)
        }

    }
  /*  getModalFieldDataByStepNo(rowId, StepNo);*/
}

function showModalFieldStep1(rowId, StepNo) {
    var step1 =
        `<div class="modal fade drawer right-align" id="markdoneStep1"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header side-header justify-content-between d-flex">
        <h2>Step 1 - FDA Approval</h2>
        <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
             /> </div>
      <div class="modal-body mb-100" >
        <!-- open -->
        <div class="row">
             <div class="col-sm-12 form-group">
                        <label>FG Item Name</label>
                        <p id="itemName"></p>
             </div>

             <div class="col-sm-12 form-group">
                        <label>Custome Brand Name</label>
                        <p id="custBrandName"></p>
             </div>
             <div class="col-sm-12" ><hr class="mb-1" /></div>

           <div class="col-sm-12 form-group">
            <label for="state" class="mb-0">Please confirm does client want to apply FDA <sup>*</sup></label>
            <select class="form-control applyselect MandateStep1" id="ddlApplyFDA" name="" onchange="HideErrorMessage(this);">
              <option value="Select">Select</option>
              <option value="1">Yes</option>
              <option value="2">No</option>
            </select>
            <span id="spddlApplyFDA" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
          </div>

           <div class="col-sm-12 form-group">
            <label for="state" class="mb-0">Assigned CRR</label>
            <select class="form-control applyselect" id="ddlCrr" name="" onchange="HideErrorMessage(this);">
           
            </select>
          </div>


        </div>
        <div class="col-sm-12">
        <!-- Show Sale Order details -->
         ${saleOrderDetById()}
         </div>

        <div class="side-footer">
          <a href="#" class="btn btn-lg actionbtn" onclick="SaveStep1(${rowId}, ${StepNo})">Submit</a>
        </div>
        <!-- End -->

      </div>
    </div>
  </div>
</div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step1);

    LoadMasterDropdown('ddlCrr', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 101,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }, 'Select', false, '');

    $('#ddlCrr').select2();
    /*setTimeout(() => getModalFieldDataByStepNo(rowId, StepNo), 200);      // Show record of step 1*/

    getModalFieldDataByStepNo(rowId, StepNo);      // Show record of step 1

    $('#markdoneStep1').modal('show');
}


async function DownLoadStep2Zip(order_itemid) {
    try {
        const model = {
            Id: order_itemid,
            Type: 15
        };

        const jsonString = JSON.stringify(model);

        CommonAjaxMethod(
            virtualPath + 'Generic/GetRecordsAsync',
            { modelData: jsonString, screenId: 'ERP_Samp5_101' },
            'GET',
            async function (response) {
                console.log("Response:", response);

                if (!response?.data?.data?.Table?.length) {
                    alert("No files found.");
                    return;
                }

                const data = response.data.data.Table;
                await downloadAllFilesAsZip(data);
            }
        );
    } catch (err) {
        console.error("Error in DownLoadStep2Zip:", err);
    }
}

async function downloadAllFilesAsZip(files) {
    try {
        const zip = new JSZip();


        for (const file of files) {
            const fileUrl = file.FileUrl.startsWith("http")
                ? file.FileUrl
                : baseURL + file.FileUrl;

            console.log("Downloading:", fileUrl);

            const response = await fetch(fileUrl);
            if (!response.ok) {
                console.warn(`Failed to fetch ${fileUrl}`);
                continue;
            }

            const blob = await response.blob();
            const safeName = sanitizeFileName(file.ActualFileName);
            zip.file(safeName, blob);
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "OrderFiles.zip");
    } catch (error) {
        console.error("Error creating ZIP:", error);
        alert("Error creating ZIP file. Check console for details.");
    }
}

function sanitizeFileName(name) {
    return name.replace(/[<>:"/\\|?*]+/g, "_");
}

function showModalFieldNewStep2New(rowId, StepNo, ItemOTDStatus) {
    var step2 =
    `<div class="modal fade drawer right-align" id="markdoneNewStep2"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 2 - Pending Artwork</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
              <div class="modal-body mb-100" >
                <!-- open -->
                <div class="row">
                   <div class="col-sm-12 form-group">
                        <label>FG Item Name</label>
                        <p id="itemName"></p>
                    </div>

                    <div class="col-sm-12 form-group">
                        <label>Custome Brand Name</label>
                        <p id="custBrandName"></p>
                    </div>
                   <div class="col-sm-12" ><hr class="mb-1" /></div>

                   <div class="col-sm-12 form-group">
                    <label for="state" class="mb-0">Type of Order Sourcing <sup>*</sup></label>
                    <p>From BO</p>
                  </div>
                   <div class="col-sm-12 form-group">
                    <label for="state" class="mb-0">Order Type <sup>*</sup></label>
                    <p>New Order</p>
                  </div>
                  <div class="col-sm-12 form-group">
                    <label for="locationname">Upload Artwork file for Label (Psd or ai.)</label>
                    <div class="section-container section-container-popup">
							        <div class="fileuploadview drag-area p-0 drag-area1">
							           <div class="uploadicon_text file-input-button" id="fileInputButton1">
								          <div class="uploadicon">
									         <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
								          </div>
								          <div class="uploadtext drag-file" id="dragFile1">
									         <h4>Drop files here or click to upload</h4>
									         <h6>This is a dropzone, drop files or click to browse</h6>
									         <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
								          </div>
							           </div>
							           <input type="file" id="fileAttachment1" class="file-input hidden" multiple />
							           <div id="documentImages1" class="document-images"></div>
							        </div>
				        </div>
                  </div>

                  <div class="col-sm-12 form-group">
                    <label for="locationname">Upload Artwork file for Box (Psd or ai.)</label>
                   <div class="section-container section-container-popup">
							        <div class="fileuploadview drag-area p-0 drag-area2">
							           <div class="uploadicon_text file-input-button" id="fileInputButton2">
								          <div class="uploadicon">
									         <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
								          </div>
								          <div class="uploadtext drag-file" id="dragFile2">
									         <h4>Drop files here or click to upload</h4>
									         <h6>This is a dropzone, drop files or click to browse</h6>
									         <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
								          </div>
							           </div>
							           <input type="file" id="fileAttachment2" class="file-input hidden" multiple />
							           <div id="documentImages2" class="document-images"></div>
							        </div>
				        </div>
                  </div>

                   <div class="col-sm-12 form-group">
                    <label for="locationname">Upload Others</label>
                   <div class="section-container section-container-popup">
							        <div class="fileuploadview drag-area p-0 drag-area3">
							           <div class="uploadicon_text file-input-button" id="fileInputButton3">
								          <div class="uploadicon">
									         <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
								          </div>
								          <div class="uploadtext drag-file" id="dragFile3">
									         <h4>Drop files here or click to upload</h4>
									         <h6>This is a dropzone, drop files or click to browse</h6>
									         <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
								          </div>
							           </div>
							           <input type="file" id="fileAttachment3" class="file-input hidden" multiple  />
							           <div id="documentImages3" class="document-images"></div>
							        </div>
				        </div>
                  </div>

                </div>

                <div class="col-sm-12">
                 <div id="showRejectionTextStep2" class="hide row">
                    <div class="col-sm-12 form-group">
                        <label for="">Reason for Rejection</label>
                        <p id="RejectionTextStep2"></p>
                    </div>
                     <div class="col-sm-6 form-group">
                        <label for="">Rejected By</label>
                        <p id="RejectedByStep2"></p>
                    </div>
                    <div class="col-sm-6 form-group">
                        <label for="">Rejected On</label>
                        <p id="RejectedOnStep2"></p>
                    </div>
                     <div class="col-sm-12 form-group">
                        <label for="">Rejected By Step No: <span id="RejectedByStepNo"></span></label>

                    </div>
                    </div>
                </div>
                <div class="col-sm-12">
                  <!-- Show Sale Order details -->
                 ${saleOrderDetById()}
                 </div>

                <div class="side-footer">
                  <a href="#" class="btn btn-lg actionbtn" onclick="SaveNewItemDocStep2 (${rowId}, ${StepNo}, '${ItemOTDStatus}')">Submit</a>
                </div>
                <!-- End -->

              </div>
            </div>
          </div>
    </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step2);

    // $('#markdoneNewStep2').modal('show');

    // Small timeout to allow DOM to process and ensure shown.bs.modal gets fired
    setTimeout(() => {
         $('#markdoneNewStep2').modal('show');
    }, 100);

    // Optional: ensure initialization happens when modal is shown (handles timing quirks)
    // Add this once outside if not already present
    if (!window._qctestUploadModalBound) {
        $(document).on('shown.bs.modal', '#markdoneNewStep2', function () {
            const uploadZones = [
                { className: '.drag-area1', initFn: fileUploadWithPreview1 },
                { className: '.drag-area2', initFn: fileUploadWithPreview2 },
                { className: '.drag-area3', initFn: fileUploadWithPreview3 }
            ];

            uploadZones.forEach(({ className, initFn }) => {
                $(this).find(className).each(function () {
                    if (!this.dataset.uploadInit) {
                        try {
                            initFn(this);
                            this.dataset.uploadInit = '1';
                        } catch (err) {
                            console.error(`fileUpload init failed for ${className}`, err);
                        }
                    }
                });
            });
        });

        window._qctestUploadModalBound = true;
    }

    /* ----------------- end appended lines ----------------- */

    getModalFieldDataByStepNo(rowId, StepNo);      // Show record of step 2
}

function showModalFieldRepeatStep2(rowId, StepNo, ItemOTDStatus) {
    var step2 =
        `
<!-- When the order is repeat Order - mark Done  Popup-->
<div class="modal fade drawer right-align" id="markdoneRepeatOrderStep2"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header side-header justify-content-between d-flex">
        <h2>Step 2 - Pending Artwork</h2>
        <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
             /> </div>
      <div class="modal-body mb-100" >
        <!-- open -->
        <div class="row">
            <div class="col-sm-12 form-group">
                <label>FG Item Name</label>
                <p id="itemName"></p>
            </div>

            <div class="col-sm-12 form-group">
                <label>Custome Brand Name</label>
                <p id="custBrandName"></p>
            </div>
           
          <div class="col-sm-12" ><hr class="mb-1" /></div>

          <div class="col-sm-12 form-group">
            <label for="state" class="mb-0">Type of Order Sourcing <sup>*</sup></label>
            <p>From BO</p>
          </div>
           <div class="col-sm-12 form-group">
            <label for="state" class="mb-0">Order Type <sup>*</sup></label>
            <p>Repeat Order</p>
          </div>

          <div class="col-md-12 col-sm-5 form-group">
          <label>Does this have Repeat artwork or New?</label>
          <div class="d-flex flex-wrap gap-10">
            <input type="radio" id="radio-new" class="radio" name="artwork" value="New artwork">
            <label for="radio-new">New</label>

            <input type="radio" id="radio-repeat" class="radio" name="artwork" value="Repeat artwork">
            <label for="radio-repeat">Repeat</label>
          </div>
        </div>
        <div  class="col-sm-12  newartwork hidetwo" style="display:none;" >
                              <div class="row">
                                  <div class="col-sm-12 form-group">
                                       <label for="locationname">Upload Artwork file (Psd or ai.)</label>
                                    <div class="section-container section-container-popup">
                                                <div class="fileuploadview drag-area p-0 drag-area1">
                                                   <div class="uploadicon_text file-input-button" id="fileInputButton1">
                                                   <div class="uploadicon">
                                                      <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
                                                   </div>
                                                   <div class="uploadtext drag-file">
                                                      <h4>Drop files here or click to upload</h4>
                                                      <h6>This is a dropzone, drop files or click to browse</h6>
                                                      <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
                                                   </div>
                                                   </div>
                                                   <input type="file" id="fileAttachment1" class="file-input hidden" multiple />
                                                   <div id="documentImages1" class="document-images"></div>
                                                </div>
                                       </div>
                                    </div>

                                    <div class="col-sm-12 form-group ">
                                       <label for="locationname">Upload Artwork file for Box (Psd or ai.)</label>
                                    <div class="section-container section-container-popup">
                                                <div class="fileuploadview drag-area p-0 drag-area2">
                                                   <div class="uploadicon_text file-input-button" id="fileInputButton2">
                                                   <div class="uploadicon">
                                                      <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
                                                   </div>
                                                   <div class="uploadtext drag-file">
                                                      <h4>Drop files here or click to upload</h4>
                                                      <h6>This is a dropzone, drop files or click to browse</h6>
                                                      <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
                                                   </div>
                                                   </div>
                                                   <input type="file" id="fileAttachment2" class="file-input hidden" multiple   />
                                                   <div id="documentImages2" class="document-images"></div>
                                                </div>
                                       </div>
                                    </div>

                                    <div class="col-sm-12 form-group ">
                                       <label for="locationname">Upload Others</label>
                                    <div class="section-container section-container-popup">
                                                <div class="fileuploadview drag-area p-0 drag-area3">
                                                   <div class="uploadicon_text file-input-button" id="fileInputButton3">
                                                   <div class="uploadicon">
                                                      <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
                                                   </div>
                                                   <div class="uploadtext drag-file">
                                                      <h4>Drop files here or click to upload</h4>
                                                      <h6>This is a dropzone, drop files or click to browse</h6>
                                                      <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
                                                   </div>
                                                   </div>
                                                   <input type="file" id="fileAttachment3" class="file-input hidden" multiple  />
                                                   <div id="documentImages3" class="document-images"></div>
                                                </div>
                                       </div>
                                    </div>

                              </div>

                            </div>

                            <div  class="col-sm-12 form-group repeatartwork  hidetwo " style="display:none;">
                              <label for="locationname">Does it required internal review</label>
                                 <select class="form-control applyselect" id="ddlRepeatStatusStep2" >
                                    <option value="Select">Select</option>
                                    <option value="1">Yes</option>
                                    <option value="2">No</option>
                                 </select>
                           </div>

                 <div class="col-sm-12">
                 <div id="showRejectionTextStep2" class="hide row">
                    <div class="col-sm-12 form-group">
                        <label for="">Reason for Rejection</label>
                        <p id="RejectionTextStep2"></p>
                    </div>
                     <div class="col-sm-6 form-group">
                        <label for="">Rejected By</label>
                        <p id="RejectedByStep2"></p>
                    </div>
                    <div class="col-sm-6 form-group">
                        <label for="">Rejected On</label>
                        <p id="RejectedOnStep2"></p>
                    </div>
                     <div class="col-sm-12 form-group">
                        <label for="">Rejected By Step No: <span id="RejectedByStepNo"></span></label>
                        
                    </div>
                    </div>
                </div>
        </div>
        <div class="col-sm-12">
        <!-- Show Sale Order details -->
         ${saleOrderDetById()}
         </div>

        <div class="side-footer">
          <!-- For New Artwork -->
         <div class="newartwork hidetwo hide yes w-100">
             <a href="#" class="btn btn-lg actionbtn" onclick="SaveRepeatItemDocStep2(${rowId}, ${StepNo}, '${ItemOTDStatus}')">Submit</a>
         </div>
         <!-- For Repeat Artwork -->
          <div class="repeatartwork hidetwo hide w-100">
            <a href="#" class="btn btn-lg actionbtn" onclick="SaveRepeatStatusOnlyStep2(${rowId}, ${StepNo}, '${ItemOTDStatus}')">Submit</a>
          </div>
        </div>
        <!-- End -->

      </div>
    </div>
  </div>
</div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step2);

    if ($.fn.select2) {
        $('.applyselect').select2({
            width: '100%',
            dropdownParent: $('#markdoneRepeatOrderStep2')   // Important for Bootstrap modal
        });
    }

    $('#markdoneRepeatOrderStep2').modal('show');

    $('#ddlRepeatStatusStep2').val(1).trigger('change');

    // Small timeout to allow DOM to process and ensure shown.bs.modal gets fired
    setTimeout(() => {
            // Clean state
            $('.newartwork').hide();
            $('.repeatartwork').hide();
            $('input[name="artwork"]').prop('checked', false);
            $('#taskinternalreview').val("Select");

            $(document).on('change', 'input[name="artwork"]', function () {
                const selectedValue = $(this).val();

                if (selectedValue === 'New artwork') {
                    $('.newartwork').show();
                    $('.repeatartwork').hide();
                } else if (selectedValue === 'Repeat artwork') {
                    $('.repeatartwork').show();
                    $('.newartwork').hide();
                }
            });
    }, 100);

    // Optional: ensure initialization happens when modal is shown (handles timing quirks)
    // Add this once outside if not already present
    if (!window._qctestUploadModalBound) {
        $(document).on('shown.bs.modal', '#markdoneRepeatOrderStep2', function () {
            const uploadZones = [
                { className: '.drag-area1', initFn: fileUploadWithPreview1 },
                { className: '.drag-area2', initFn: fileUploadWithPreview2 },
                { className: '.drag-area3', initFn: fileUploadWithPreview3 }
            ];

            uploadZones.forEach(({ className, initFn }) => {
                $(this).find(className).each(function () {
                    if (!this.dataset.uploadInit) {
                        try {
                            initFn(this);
                            this.dataset.uploadInit = '1';
                        } catch (err) {
                            console.error(`fileUpload init failed for ${className}`, err);
                        }
                    }
                });
            });
        });

        window._qctestUploadModalBound = true;
    }

    /* ----------------- end appended lines ----------------- */

    getModalFieldDataByStepNo(rowId, StepNo);      // Show record of step 2
}

function showModalFieldStep3(rowId, StepNo) {
    var step3 =
    `<div class="modal fade drawer right-align" id="markdoneStep3"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 3 - Graphic Review</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
              <div class="modal-body mb-100" >
                <!-- open -->
                <div class="row">

                 <div class="col-sm-12 form-group">
                    <label>FG Item Name</label>
                    <p id="itemName"></p>
                </div>

                <div class="col-sm-12 form-group">
                    <label>Custome Brand Name</label>
                    <p id="custBrandName"></p>
                </div>
                <div class="col-sm-12" ><hr class="mb-1" /></div>

                  <div class="col-sm-12 form-group">
                    <label for="locationname">Please confirm Artwork is received and File is found ok</label>
                   <select class="form-control applyselect" id="ddlConfirmArtworkGrapic">
                    <option value="Select">Select</option>
                    <option value="1">Approved</option>
                    <option value="2">Rejected</option>
                   </select>
                  </div>

                  <div class="col-sm-12 form-group">
                    <a href="#" onclick="DownLoadStep2Zip(${orderItemId})"  class="d-table"><img src="../assets/images/icons/help/download-icon.png" alt="" class="icon-sm" /> Download Artwork</a>
                  </div>


                  <div class="col-sm-12 form-group rejected hide">
                        <input type="checkbox" id="Sendemail" name="type" value="">
                        <label for="Sendemail">Send email to Customer and CRR</label>
                   </div>

                  <div class="col-sm-12 form-group approved hide">
                    <p class="mb-2 fn-bold">Checklist of checking of artwork</p>
                    <ul class="list-item ml-3">
                      <li>Is the font size to be 3.5 pt.</li>
                      <li>Are we using CMYK Color Pallet.</li>
                      <li>Is the product weightage mentioned in front of the label.</li>
                      <li>Is the converted pack size matching with our actual pack size.</li>
                      <li>Are the dimensions perfect as per the PM/surface on which label to be pasted or box to be packed.</li>
                      <li>Are the botanical names mentioned with the particular ingredient.</li>
                      <li>Are the dimensions perfect as per the PM/surface on which label to be pasted or box to be packed.</li>
                      <li>Have we mentioned the color change for the product point on the artwork.</li>
                      <li>Are the batch details okay as given by QC.</li>
                      <li>Are the mfg and expiry details as per the standard.</li>
                      <li>Is the price per ml (USP details) as per the MRP.</li>
                      <li>Is the gap up to 5mm between the two ends of the label in length.</li>
                      <li>Is the barcode size up to or above 25mm*10mm so that barcode can get scanned.</li>
                      <li>Is the batch code area up to or above 20mm*9mm.</li>
                      <li>Are the storage and caution details there on the artwork.</li>
                      <li>Is the bleed area up to 5mm we skip on all the faces of the box.</li>
                      <li>Have we taken 2mm extra in lbh of box dimension as compared to PM.</li>
                      <li>Did we check “front design should be on 3rd face".</li>
                    </ul>
                  </div>

                </div>
                <div class="col-sm-12">
                <!-- Show Sale Order details -->
                ${saleOrderDetById()}
                </div>

                <div class="approved hide">
                    <div class="side-footer ">
                      <a href="#" class="btn btn-lg btn-warning" data-toggle="modal" data-target="#reasonpopupStep3">Reject</button>
                      <a href="#" class="btn btn-lg btn-success" onclick="SaveStep3(${rowId}, ${StepNo})">Approve</a>
                    </div>
                </div>

                <div class="rejected hide">
                    <div class="side-footer ">
                       <button type="submit" class="btn btn-lg actionbtn" data-toggle="modal" data-target="#reasonpopupStep3">Submit</button>
                    </div>
                </div>

                <!-- End -->

              </div>
            </div>
          </div>
        </div>


        <!-- Reason Popup -->

        <div class="modal modaloverlay" id="reasonpopupStep3">
           <div class="modal-dialog modal-dialog-centered modal-md">
              <div class="modal-content ">

              <!-- Modal Header -->
              <div class="modal-header">
                 <h4 class="modal-title text-left w-100">Reason for Rejection</h4>
                 <button type="button" class="close" data-dismiss="modal"><img src="../assets/images/icons/help/close-icon.png" class="closeicon"></button>
              </div>

              <!-- Modal body -->
              <div class="modal-body">
                 <div class="row">


                    <div class="form-group col-sm-12">
                       <label>Please enter Reason for Rejection <sup>*</sup></label>
                       <textarea class="form-control h-120 char-limit"  placeholder="Enter" data-maxlength="300" id="rejectionReasonStep3"></textarea>
                       <div class="text-right">
                          <small class="light-label counter">0/300</small>
                       </div>
                    </div>

                 </div>

              </div>

              <!-- Modal footer -->
              <div class="modal-footer">
                 <button type="button" class="btn btn-lg cancelbtn radius-24" data-dismiss="modal">Cancel</button>
                 <a href="#" class="btn btn-lg actionbtn" onclick="RejectStep3(${rowId}, ${StepNo})">Submit</a>
              </div>

              </div>
           </div>
        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step3);

    if ($.fn.select2) {
        $('.applyselect').select2({
            width: '100%',
            dropdownParent: $('#markdoneStep3')   // Important for Bootstrap modal
        });
    }

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 3


    // Attach change handler after DOM is updated
    $(document).on('change', '#ddlConfirmArtworkGrapic', function () {
        var val = $(this).val();

        if (val === '1') {
            $('.approved').removeClass('hide');
            $('.rejected').addClass('hide');
        } else if (val === '2') {
            $('.rejected').removeClass('hide');
            $('.approved').addClass('hide');
        } else {
            $('.approved, .rejected').addClass('hide');
        }
    });


    $('#markdoneStep3').modal('show');
}

function showTaskModal(id, authToken, FMS_Id) {
    $.get('/Account/GetTaskStatusModal', { id: id, auth: authToken, FMS_Id: FMS_Id, }, function (data) {
        $('#yourModalContainer').html(data);
        $('#viewstatus').modal('show');
    });
}

function showModalFieldStep4(rowId, StepNo) {
    var step4 =
        `<div class="modal fade drawer right-align" id="markdoneStep4"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 4 - Legal Review</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
              <div class="modal-body mb-100" >
                <!-- open -->
                <div class="row">

                  <div class="col-sm-12 form-group">
                    <label>FG Item Name</label>
                    <p id="itemName"></p>
                </div>

                <div class="col-sm-12 form-group">
                    <label>Custome Brand Name</label>
                    <p id="custBrandName"></p>
                </div>
                <div class="col-sm-12" ><hr class="mb-1" /></div>

                  <div class="col-sm-12 form-group">
                    <label for="locationname">Please confirm Artwork is received as per your requirement</label>
                   <select class="form-control applyselect" id="ddlConfirmArtworkLegal">
                    <option value="Select">Select</option>
                    <option value="1">Yes</option>
                    <option value="2">No</option>
                   </select>
                  </div>
                  <div class="col-sm-12 form-group">
                    <a href="#" onclick="DownLoadStep2Zip(${orderItemId})" class="d-table"><img src="../assets/images/icons/help/download-icon.png" alt="" class="icon-sm" /> Download Artwork</a>
                  </div>
                  <div class="col-sm-12 form-group no hide">
                    <p class="mb-1">Please confirm Artwork is received as per your requirement</p>
                    <p class="text-p mb-2 bg-none br-1">Rejected</p>
                   </div>

                   <div class="col-sm-12 form-group no hide">
								        <input type="checkbox" id="sendemailcustomer" name="" value="">
								        <label for="sendemailcustomer"> Send email to Customer and CRR</label>
							        </div>


                  <div class="col-sm-12 form-group yes hide">
                    <p class="mb-1">Please confirm Artwork is received as per your requirement</p>
                    <p class="text-p mb-2 bg-none br-1">Approved</p>
                    <p class="mb-2 fn-bold"><strong>Checklist of checking of artwork for printing requirements</strong></p>


                    <ul class="list-item ml-3">
                      <li>Ingredients should be in descending order.</li>
                      <li>INCI names of the ingredients are compulsory to be there on artwork.</li>
                      <li>Is Product description mentioned properly?</li>
                      <li>Directions of Use/How to Use should be there.</li>
                      <li>Caution details and storage condition details are mandate.</li>
                      <li>Complete address of “Manufacturing by” and “Marketed by” is mentioned.</li>
                      <li>Import/Export Address (if it’s a case of import/export).</li>
                      <li>Manufacturing License no. is mentioned.</li>
                      <li>Net weight should be mentioned on PDP (Principal Display Panel) and information panel.</li>
                      <li>Country of Origin is mandate.</li>
                      <li>Batch No., MRP* (incl. of all taxes), manufacturing date, USP, expiry date are compulsory in every label or box size.</li>
                      <li>Claims are according to the ingredients mentioned.</li>
                      <li>If product is below 60 gm or 60 ml, then manufacturing address can be short.</li>
                      <li>Customer care details are mandate to put on box or label.</li>
                    </ul>
                  </div>

                </div>
                <div class="col-sm-12">
                <!-- Show Sale Order details -->
                ${saleOrderDetById()}
                </div>
                <div class="yes hide">
                    <div class="side-footer ">
                         <a href="#" class="btn btn-lg btn-warning" data-toggle="modal" data-target="#reasonpopupStep4">Reject</a>
                         <a href="#" class="btn btn-lg btn-success" onclick="SaveStep4(${rowId}, ${StepNo})">Approve</a>
                    </div>
                </div>

                <div class="no hide">
                    <div class="side-footer ">
                  <a href="" data-toggle="modal" data-target="#reasonpopupStep4" class="btn btn-lg actionbtn">Submit</a>
                </div>
                </div>

                <!-- End -->

              </div>
            </div>
          </div>
        </div>


        <!-- Reason Popup -->

        <div class="modal modaloverlay" id="reasonpopupStep4">
           <div class="modal-dialog modal-dialog-centered modal-md">
              <div class="modal-content ">

              <!-- Modal Header -->
              <div class="modal-header">
                 <h4 class="modal-title text-left w-100">Reason for Rejection</h4>
                 <button type="button" class="close" data-dismiss="modal"><img src="../assets/images/icons/help/close-icon.png" class="closeicon"></button>
              </div>

              <!-- Modal body -->
              <div class="modal-body">
                 <div class="row">


                    <div class="form-group col-sm-12">
                       <label>Please enter Reason for Rejection <sup>*</sup></label>
                       <textarea class="form-control h-120 char-limit"  placeholder="Enter" data-maxlength="300" id="rejectionReasonStep4"></textarea>
                       <div class="text-right">
                          <small class="light-label counter">0/300</small>
                       </div>
                    </div>
                 </div>

              </div>

              <!-- Modal footer -->
              <div class="modal-footer">
                 <button type="button" class="btn btn-lg cancelbtn radius-24" data-dismiss="modal">Cancel</button> <a href="#" class="btn btn-lg actionbtn" onclick="RejectStep4(${rowId}, ${StepNo})">Submit</a>
              </div>

              </div>
           </div>
        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step4);


    if ($.fn.select2) {
        $('.applyselect').select2({
            width: '100%',
            dropdownParent: $('#markdoneStep4')   // Important for Bootstrap modal
        });
    }

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 4

    $(document).on('change', '#ddlConfirmArtworkLegal', function () {
        var value = $(this).val();

        if (value === "1") {
            $('.yes').removeClass('hide');
            $('.no').addClass('hide');
        } else if (value === "2") {
            $('.no').removeClass('hide');
            $('.yes').addClass('hide');
        } else {
            $('.yes, .no').addClass('hide');
        }
    });

    $('#markdoneStep4').modal('show');
}

function showModalFieldStep5(rowId, StepNo, selectedLabelVendorId = 0, selectedBoxVendorId = 0) {
    const step5 = `
        <div class="modal fade drawer right-align" id="markdoneStep5"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 5 - Sample Order</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal" />
              </div>
              <div class="modal-body mb-100">
                <div class="row">
                     <div class="col-sm-12 form-group">
                        <label class="text-gray mb-0">FG Item Name</label>
                        <p id="itemName"></p>
                    </div>

                     <div class="col-sm-12 form-group">
                         <label class="text-gray mb-0">Custome Brand Name</label>
                        <p id="custBrandName"></p>
                      </div>
                      <div class="col-sm-12" ><hr class="mb-1" /></div>

                      <div class="col-sm-12" >
                         <p class="m-0">  Please confirm the PM Sample Order is placed </p>
                      </div>

                  <!-- Vendor for label -->
                  <div class="col-sm-12 form-group">
                    <label for="vendorLabelInput">Vendor for label</label>
                    <div class="autocomplete-wrapper pr">
                      <label for="vendorLabelInput" class="search-label right">
                        <img src="../assets/images/icons/help/search-icon.png" class="icon-sm">
                      </label>
                      <input type="text" class="form-control searchlist pl-10 MandateStep5" id="vendorLabelInput" placeholder="Enter" autocomplete="off" oninput="HideErrorMessage(this)">
                      <ul class="suggestions pa w-100" id="ddlVendorLabelList"></ul>
                      <span id="spvendorLabelInput" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                    </div>
                  </div>

                  <!-- Vendor for box -->
                  <div class="col-sm-12 form-group">
                    <label for="vendorBoxInput">Vendor for Box</label>
                    <div class="autocomplete-wrapper pr">
                      <label for="vendorBoxInput" class="search-label right">
                        <img src="../assets/images/icons/help/search-icon.png" class="icon-sm">
                      </label>
                      <input type="text" class="form-control searchlist pl-10 MandateStep5" id="vendorBoxInput" placeholder="Enter" autocomplete="off" oninput="HideErrorMessage(this)">
                      <ul class="suggestions pa w-100" id="ddlVendorBoxList"></ul>
                      <span id="spvendorBoxInput" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                    </div>
                  </div>
                </div>


                <div class="col-sm-12">
                 <div id="showRejectionTextStep5" class="hide row">
                    <div class="col-sm-12 form-group">
                        <label for="">Reason for Rejection</label>
                        <p id="RejectionTextStep5"></p>
                    </div>
                     <div class="col-sm-6 form-group">
                        <label for="">Rejected By</label>
                        <p id="RejectedByStep5"></p>
                    </div>
                    <div class="col-sm-6 form-group">
                        <label for="">Rejected On</label>
                        <p id="RejectedOnStep5"></p>
                    </div>
                     <div class="col-sm-12 form-group">
                        <label for="">Rejected By Step No: <span id="RejectedByStepNo"></span></label>

                    </div>
                    </div>
                </div>

                <div class="col-sm-12 ">

                <!-- Show Sale Order details -->
                ${saleOrderDetById()}
                </div>
                <div class="side-footer">
                  <a href="#" class="btn btn-lg actionbtn" onclick="SaveStep5(${rowId}, ${StepNo})">Submit</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="fileLimitPopup" class="popup-modal">
          <div class="popup-content">
            <p id="popup-message"></p>
            <button id="close-popup"><img src="../assets/images/icons/help/close.svg" alt=""></button>
          </div>
        </div>
    `;

    closeView();
    $('#view_dynamic_fms').html('');
    $('#dynamic_fms').html(step5);

    // Bind both vendor lists with selected values (can be null or a valid vendor ID)
    BindVendorList('vendorLabelInput', 'ddlVendorLabelList', selectedLabelVendorId);
    BindVendorList('vendorBoxInput', 'ddlVendorBoxList', selectedBoxVendorId);

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 5

    $('#markdoneStep5').modal('show');
}

function showModalFieldStep6(rowId, StepNo) {
    var step6 =
        `<div class="modal fade drawer right-align" id="markdoneStep6"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 6 - Sample Received</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
              <div class="modal-body mb-100" >
                <!-- open -->

                <div class="row">
                  <div class="col-sm-12 form-group">
                    <label>FG Item Name</label>
                    <p id="itemName"></p>
                </div>

                <div class="col-sm-12 form-group">
                    <label>Custome Brand Name</label>
                    <p id="custBrandName"></p>
                </div>
                <div class="col-sm-12" ><hr class="mb-1" /></div>

                  <div class="col-sm-12 form-group">
                    <label for="locationname">Is the sample received from vendors and handed over to QC?</label>
                       <select class="form-control applyselect MandateStep6" id="ddlSampleReceivedStatus" onchange="HideErrorMessage(this)">
                        <option value="Select">Select</option>
                        <option value="1"> Yes</option>
                        <option value="2">No</option>
                       </select>
                       <span id="spddlSampleReceived" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                      </div>

                </div>
                <div class="col-sm-12">
                <!-- Show Sale Order details -->
                ${saleOrderDetById()}
                </div>

                <div class="side-footer">
                       <a href="#" class="btn btn-lg actionbtn" onclick="SaveStep6(${rowId}, ${StepNo})">Submit</a>
                </div>

                <!-- End -->

              </div>
            </div>
          </div>
        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step6);

    if ($.fn.select2) {
        $('.applyselect').select2({
            width: '100%',
            dropdownParent: $('#markdoneStep6')   // Important for Bootstrap modal
        });
    }


    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 6

    $('#markdoneStep6').modal('show');
}

function showModalFieldStep7(rowId, StepNo) {
    var step7 =
        `<div class="modal fade drawer right-align" id="markdoneStep7"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 7 - Sample QC</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
              <div class="modal-body mb-100" >
                <!-- open -->
                <div class="row">

                 <div class="col-sm-12 form-group">
                    <label>FG Item Name</label>
                    <p id="itemName"></p>
                </div>

                <div class="col-sm-12 form-group">
                    <label>Custome Brand Name</label>
                    <p id="custBrandName"></p>
                </div>
                <div class="col-sm-12" ><hr class="mb-1" /></div>

                <div class="col-sm-12 form-group">
                    <label for="locationname">Please confirm sample QC approval status</label>
                   <select class="form-control applyselect" id="ddlSampleQCStatus">
                    <option value="Select">Select</option>
                    <option value="1">Approved</option>
                    <option value="2">Rejected</option>
                   </select>
                  </div>

                  <div class="col-sm-12 form-group yes hide">
                  <div style="display:none;">
                    <p class="mb-2">Please Check the following points for QC</p>
                    <ul class="list-unstyled checklist">
                       <li>
                          <input type="checkbox" id="artworkchecklist-1" name="type" value="" class="qcChecklist" data-id="1">
                          <label for="artworkchecklist-1">Samples match basic quality parameters</label>

                       </li>
                       <li>
                          <input type="checkbox" id="artworkchecklist-2" name="type" value="" class="qcChecklist" data-id="2">
                          <label for="artworkchecklist-2">The pump is compatible with the bottle</label>

                       </li>
                       <li>
                          <input type="checkbox" id="artworkchecklist-3" name="type" value="" class="qcChecklist" data-id="3">
                          <label for="artworkchecklist-3">The material can dispense from the pump properly</label>

                       </li>
                       <li>
                          <input type="checkbox" id="artworkchecklist-4" name="type" value="" class="qcChecklist" data-id="4">
                          <label for="artworkchecklist-4">Sample is provided to concern Sales person</label>

                       </li>

                    </ul>
                    </div>
                  </div>

                </div>

                <div>
                   
                    <p  class="mb-1"><strong>Monocarton:-</strong></p>
                    <ol class="ml-3">
                        <li>Fitment with primary PM.</li>
                        <li>Printing text matter check with approved artwork.</li>
                        <li>Printing visible or clear readable.</li>
                        <li>Artwork Approved as per legal.</li>
                    </ol>

                    <p class="mb-1"><strong>Labels:-</strong></p>
                    <ol class="ml-3">
                        <li>Label Dimension okay as per primary PM.</li>
                        <li>Label text matter check with approved artwork.</li>
                        <li>Printing visible or clear readable.</li>
                        <li>Artwork Approved as per legal.</li>
                    </ol>

                    <p><strong>Tube/Bottle/Jar with pump/cap/dropper:-</strong></p>
                    <ol class="ml-3">
                        <li>Fitment check with pump/cap/dropper.</li>
                        <li>Label dimension check with Primary PM.</li>
                        <li>Fill Volume check.</li>
                        <li>Leakage Test.</li>
                        <li>Fitment check with Monocarton.</li>
                    </ol>
                </div>
                <div class="col-sm-12">
                <!-- Show Sale Order details -->
                ${saleOrderDetById()}
                </div>

                <div class="yes hide">
                    <div class="side-footer ">
                      <a data-toggle="modal" data-target="#reasonpopup" class="btn btn-lg btn-warning">Reject</a>
                      <a href="#" class="btn btn-lg btn-success" onclick="SaveStep7(${rowId}, ${StepNo})">Approve</a>
                     </div>
                </div>

                <div class="no hide">
                    <div class="side-footer ">
                  <a data-toggle="modal" data-target="#reasonpopup" class="btn btn-lg actionbtn">Submit</a>
                </div>
                </div>

                <!-- End -->

              </div>
            </div>
          </div>
        </div>


        <!-- Reason Popup -->

        <div class="modal modaloverlay" id="reasonpopup">
           <div class="modal-dialog modal-dialog-centered modal-md">
              <div class="modal-content ">

              <!-- Modal Header -->
              <div class="modal-header">
                 <h4 class="modal-title text-left w-100">Reason for Rejection</h4>
                 <button type="button" class="close" data-dismiss="modal"><img src="../assets/images/icons/help/close-icon.png" class="closeicon"></button>
              </div>

              <!-- Modal body -->
              <div class="modal-body">
                 <div class="row">

                   <div class="form-group col-sm-12">
                       <label>Please enter Reason for Rejection <sup>*</sup></label>
                       <textarea class="form-control h-120 char-limit"  placeholder="Enter" data-maxlength="300" id="rejectionReasonStep7"></textarea>
                       <div class="text-right">
                          <small class="light-label counter">0/300</small>
                       </div>
                    </div>


                 </div>

              </div>

              <!-- Modal footer -->
              <div class="modal-footer">
                 <button type="button" class="btn btn-lg cancelbtn radius-24" data-dismiss="modal">Cancel</button> <a href="#" class="btn btn-lg actionbtn" onclick="RejectStep7(${rowId}, ${StepNo})">Submit</a>
              </div>

              </div>
           </div>
        </div>

	        <!-- Popup Modal for File Limit -->
	        <div id="fileLimitPopup" class="popup-modal">
		        <div class="popup-content">
			        <p id="popup-message"></p>
			        <button id="close-popup"><img src="../assets/images/icons/help/close.svg" alt=""></button>
		        </div>
	        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step7);

    // Initialize Select2 for dynamically created select box
    if ($.fn.select2) {
        $('.applyselect').select2({
            width: '100%',
            dropdownParent: $('#markdoneStep7')   // Important for Bootstrap modal
        });
    }


    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 7

    // Add change handler
    $(document).on('change', '#ddlSampleQCStatus', function () {
        var selected = $(this).val();

        if (selected === "1") {
            $('.yes').removeClass('hide');
            $('.no').addClass('hide');
        } else if (selected === "2") {
            $('.no').removeClass('hide');
            $('.yes').addClass('hide');
        } else {
            $('.yes, .no').addClass('hide');
        }
    });

    $('#markdoneStep7').modal('show');
}

function showModalFieldStep8(rowId, StepNo) {
    var step8 =
        `<div class="modal fade drawer right-align" id="markdoneStep8"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 8 - Print PM Sample Approval from Client</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
              <div class="modal-body mb-100" >
                <!-- open -->
                <div class="row">
                 <div class="col-sm-12 form-group">
                    <label>FG Item Name</label>
                    <p id="itemName"></p>
                </div>

                <div class="col-sm-12 form-group">
                    <label>Custome Brand Name</label>
                    <p id="custBrandName"></p>
                </div>
                <div class="col-sm-12" ><hr class="mb-1" /></div>

                 <div class="col-sm-12 form-group">
                    <label>Colour - Client's Observation</label>
                    <input type="text" placeholder="Enter" class="form-control MandateStep8" id="txtColorClientObs" oninput="HideErrorMessage(this)"/>
                    <span id="sptxtColorClientObs" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Font - Client's Observation</label>
                    <input type="text" placeholder="Enter" class="form-control MandateStep8" id="txtFontClientObs" oninput="HideErrorMessage(this)"/>
                    <span id="sptxtFontClientObs" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Embellishments required by Client</label>
                    <input type="text" placeholder="Enter" class="form-control MandateStep8" id="txtUVFinishingClientObs" oninput="HideErrorMessage(this)"/>
                    <span id="sptxtUVFinishingClientObs" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Lamination - Client's Observation</label>
                    <select name="" class="form-control applyselect MandateStep8" id="ddlLaminationClientObs" onchange="HideErrorMessage(this)"/>
                        <option value="Select">Select</option>
                        <option value="1">Gloss</option>
                        <option value="2">Matt</option>

                    </select>
                    <span id="spddlLaminationClientObs" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Label Type - Client's Observation</label>
                    <select name="" class="form-control applyselect MandateStep8" id="ddlLabelTypeClientObs" onchange="HideErrorMessage(this)"/>
                        <option value="Select">Select</option>
                        <option value="1">Transparent</option>
                        <option value="2">White/Opaque</option>
                        <option value="3">Translucent</option>

                    </select>
                    <span id="spddlLabelTypeClientObs" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Please confirm the order sample is approved</label>
                    <select name="" class="form-control applyselect MandateStep8" id="ddlPrintSampleApprovalByClient" onchange="HideErrorMessage(this)"/>
                        <option value="Select">Select</option>
                        <option value="1">Approved</option>
                        <option value="2">Rejected</option>

                    </select>
                    <span id="spddlPrintSampleApprovalByClient" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                </div>
                <div class="col-sm-12">
                <!-- Show Sale Order details -->
                ${saleOrderDetById()}
                </div>

                    <div class="side-footer ">
                       <a data-toggle="modal" data-target="#reasonpopup" class="btn btn-lg actionbtn rejected hide">Submit</a>
                          <a href="#" class="btn btn-lg actionbtn approved hide" onclick="SaveStep8(${rowId}, ${StepNo})">Submit</a>
                    </div>


                <!-- End -->

              </div>
            </div>
          </div>
        </div>


        <!-- Reason Popup -->

        <div class="modal modaloverlay" id="reasonpopup">
           <div class="modal-dialog modal-dialog-centered modal-md">
              <div class="modal-content ">

              <!-- Modal Header -->
              <div class="modal-header">
                 <h4 class="modal-title text-left w-100">Reason for Rejection</h4>
                 <button type="button" class="close" data-dismiss="modal"><img src="../assets/images/icons/help/close-icon.png" class="closeicon"></button>
              </div>

              <!-- Modal body -->
              <div class="modal-body">
                 <div class="row">


                   <div class="form-group col-sm-12">
                       <label>Please enter Reason for Rejection <sup>*</sup></label>
                       <textarea class="form-control h-120 char-limit"  placeholder="Enter" data-maxlength="300" id="rejectionReasonStep8"></textarea>
                       <div class="text-right">
                          <small class="light-label counter">0/300</small>
                       </div>
                    </div>
                 </div>

              </div>

              <!-- Modal footer -->
              <div class="modal-footer">
                 <button type="button" class="btn btn-lg cancelbtn radius-24" data-dismiss="modal">Cancel</button> <a href="#" class="btn btn-lg actionbtn" onclick="RejectStep8(${rowId}, ${StepNo})">Submit</a>
              </div>

              </div>
           </div>
        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step8);


    if ($.fn.select2) {
        $('.applyselect').select2({
            width: '100%',
            dropdownParent: $('#markdoneStep8')   // Important for Bootstrap modal
        });
    }


    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 8

    // Handle selection change for order sample approval
    $(document).on('change', '#ddlPrintSampleApprovalByClient', function () {
        const selectedValue = $(this).val();

        if (selectedValue === '1') {
            $('.approved').removeClass('hide');
            $('.rejected').addClass('hide');
        } else if (selectedValue === '2') {
            $('.rejected').removeClass('hide');
            $('.approved').addClass('hide');
        } else {
            // Reset both if nothing is selected
            $('.approved, .rejected').addClass('hide');
        }
    });

    $('#markdoneStep8').modal('show');
}

function showModalFieldStep9(rowId, StepNo) {
    var step9 =
        `<div class="modal fade drawer right-align" id="markdoneStep9"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 9 - Payment Proof</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
                  <div class="modal-body mb-100" >
                    <!-- open -->
                    <div class="row">
                     <div class="col-sm-12 form-group">
                        <label>FG Item Name</label>
                        <p id="itemName"></p>
                    </div>

                    <div class="col-sm-12 form-group">
                        <label>Custome Brand Name</label>
                        <p id="custBrandName"></p>
                    </div>
                    
                     <div class="col-sm-12 form-group">
                        <label>Payment Terms : </label>
                         <span>Advance Payment</span>
                     </div>

                <div class="col-sm-12" ><hr class="mb-1" /></div>

                 <div class="col-sm-12 form-group">

                       <label>Upload Payment Sreenshot</label>
                       <div class="section-container section-container-popup">
							        <div class="fileuploadview drag-area p-0 drag-area1">
							           <div class="uploadicon_text file-input-button" id="fileInputButton1">
								          <div class="uploadicon">
									         <img src="../assets/images/icons/help/fileupload-icon.svg" alt="">
								          </div>
								          <div class="uploadtext drag-file">
									         <h4>Drop files here or click to upload</h4>
									         <h6>This is a dropzone, drop files or click to browse</h6>
									         <span class="error">The file size should be 2MB,<br/> with a maximum of 10 attachments.</span>
								          </div>
							           </div>
							           <input type="file" id="fileAttachment1" class="file-input hidden" multiple accept=""  />
							           <div id="documentImages1" class="document-images"></div>
							        </div>
				        </div>
                   </div>

                  <div class="col-sm-12">
                         <!-- Show Sale Order details -->
                   ${saleOrderDetById()}
                  </div>
                   
                   <div class="side-footer ">
                    <button type="button" class="btn btn-lg actionbtn" onclick="SaveStep9(${rowId}, ${StepNo})">Submit</button>
                  </div>
                  

              </div>
            </div>
          </div>
        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step9);

    // Optional: ensure initialization happens when modal is shown (handles timing quirks)
    // Add this once outside if not already present
    if (!window._qctestUploadModalBound) {
        $(document).on('shown.bs.modal', '#markdoneStep9', function () {
            const uploadZones = [
                { className: '.drag-area1', initFn: fileUploadWithPreview1 }
               
            ];

            uploadZones.forEach(({ className, initFn }) => {
                $(this).find(className).each(function () {
                    if (!this.dataset.uploadInit) {
                        try {
                            initFn(this);
                            this.dataset.uploadInit = '1';
                        } catch (err) {
                            console.error(`fileUpload init failed for ${className}`, err);
                        }
                    }
                });
            });
        });

        window._qctestUploadModalBound = true;
    }

    /* ----------------- end appended lines ----------------- */

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 9

    $('#markdoneStep9').modal('show');
}


function showModalFieldStep10(rowId, StepNo) {
    var step9 =
        `<div class="modal fade drawer right-align" id="markdoneStep10"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header side-header justify-content-between d-flex">
                <h2>Step 10 - Accounts Confirmation</h2>
                <img src="../assets/images/icons/help/close-white-icon.png" class="cursor-pointer align-self-center close" data-dismiss="modal"
                     /> </div>
                  <div class="modal-body mb-100" >
                    <!-- open -->
                    <div class="row">
                     <div class="col-sm-12 form-group">
                        <label>FG Item Name</label>
                        <p id="itemName"></p>
                    </div>

                    <div class="col-sm-12 form-group">
                        <label>Custome Brand Name</label>
                        <p id="custBrandName"></p>
                    </div>
                    <hr>

                     <div class="col-sm-12 form-group">
                        <label>Payment Terms : </label>
                         <span id="lblPaymentTerms"></span>
                     </div>

                <div class="col-sm-12" ><hr class="mb-1" /></div>

                 <div class="col-lg-12 form-group">
		                <div class="card br-none p-0 h-100">
			                <div class="card-header border-top-RL header-active br-none  d-flex justify-content-between  ">
				                <h2 class="title-two align-self-center">Upload Payment Screenshot</h2>
				                <div class="align-self-center"></div>
			                </div>
			                <div class="card-body view-form-group">
				                <!--  -->
				                <p class="m-0 nofile" id="NoUploadFile1">No Upload</p>
				                <div class="section-container fileuploadview section-container-popup ">
					                <div class="document-images hidden" id="ShowUploadFile1">
						                <div id="documentImages1" class="document-images"></div>

					                </div>
				                </div>

				                <!--  -->
			                </div>
		                </div>
	                </div>

                    <div class="col-sm-12 form-group">
                    <label>Voucher Number</label>
                    <input type="text" placeholder="Enter" class="form-control MandateStep9" id="txtVoucherNo" oninput="HideErrorMessage(this)">
                    <span id="sptxtVoucherNo" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Date of the Receipt</label>
                    <div class="input-group">
							<input type="text" id="txtReceiptDate" autocomplete="off" class="datepicker form-control" placeholder="DD/MM/YYYY">
							<span class="clear-date">×</span>
							<div class="input-group-append "> <span class="input-group-text bg-white"><img src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span> </div>
					</div>

                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Total Order Value (₹)</label>
                    <span id="lblTotalOrderValue"></span>
                 </div>

                 <div class="col-sm-12 form-group">
                    <label>Advance Payment (₹)</label>
                    <span id="lblAdvancePayment"></span>
                 </div>

                </div>
                <div class="col-sm-12">
                <!-- Show Sale Order details -->
                ${saleOrderDetById()}
                </div>
                 <div class="side-footer ">
                    <button type="button" class="btn btn-lg actionbtn" onclick="SaveStep10(${rowId}, ${StepNo})">Submit</button>
                  </div>
                  

              </div>
            </div>
          </div>
        </div>

    `

    closeView();

    $('#view_dynamic_fms').html('');

    $('#dynamic_fms').html('');

    $('#dynamic_fms').html(step9);

    // initialize datepicker for dynamically added input
    $('.datepicker').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        autoApply: true,
        autoUpdateInput: false,
        drops: 'auto',   // ⬅ dropdown auto position
        parentEl: 'body',   // ⬅ ensures correct alignment inside modals
    });

    // Optional: ensure initialization happens when modal is shown (handles timing quirks)
    // Add this once outside if not already present
    if (!window._qctestUploadModalBound) {
        $(document).on('shown.bs.modal', '#markdoneStep10', function () {
            const uploadZones = [
                { className: '.drag-area1', initFn: fileUploadWithPreview1 }

            ];

            uploadZones.forEach(({ className, initFn }) => {
                $(this).find(className).each(function () {
                    if (!this.dataset.uploadInit) {
                        try {
                            initFn(this);
                            this.dataset.uploadInit = '1';
                        } catch (err) {
                            console.error(`fileUpload init failed for ${className}`, err);
                        }
                    }
                });
            });
        });

        window._qctestUploadModalBound = true;
    }

    /* ----------------- end appended lines ----------------- */

    getModalFieldDataByStepNo(rowId, StepNo);    // Show record of step 9

    $('#markdoneStep10').modal('show');
}


function getModalFieldDataByStepNo(orderId, StepNo) {
    var model = {
        OrderId: orderId,
        OrderItemId: orderItemId,
        StepNo: StepNo
    };

    const jsonString = JSON.stringify(model);

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', {
        modelData: jsonString,
        screenId: 'OrderToDelivery_101'
    }, 'GET', function (response) {
        const tblData = response.data.data.Table[0];
        const tblData1 = response.data.data.Table1[0];
        const tblData2 = response.data.data.Table2; 

        if (tblData && StepNo === 1) {
            /* $('#ddlApplyFDA').val(tblData.FDAApprovalStatus || 'Select');*/
        }
        else if (tblData && StepNo === 2) {
            //  Bind radio based on ArtworkSecondStatus
            //const artworkStatus = tblData.ArtworkSecondStatus?.trim();

            //if (artworkStatus === "New artwork") {
            //    $('#radio-new').prop('checked', true).trigger('change');
            //} else if (artworkStatus === "Repeat artwork") {
            //    $('#radio-repeat').prop('checked', true).trigger('change');
            //}

            //$('#ddlRepeatStatusStep2').val(tblData.ArtworkThirdStatus || 'Select');

            // ✅ Show or hide rejection section
            if (tblData1.Rejection && tblData1.Rejection.trim() !== "") {
                $('#showRejectionTextStep2').removeClass('hide');
                $('#RejectionTextStep2').text(tblData1.Rejection || '');
                $('#RejectedByStep2').text(tblData1.RejectedBy || '');
                $('#RejectedOnStep2').text(tblData1.RejectedOn || '');
                $('#RejectedByStepNo').text(tblData1.StepNo || 0);
            } else {
                $('#showRejectionTextStep2').addClass('hide');
            }

        }
        //else if(tblData && StepNo === 3) {
        //    $('#ddlConfirmArtworkGrapic').val(tblData.ArtReceivedStatusGraphic || 'Select').trigger('change');
        //}
        //else if (tblData && StepNo === 4) {
        //    $('#ddlConfirmArtworkLegal').val(tblData.ArtReceivedStatusLegal || 'Select').trigger('change');
        //}
        else if (tblData && StepNo === 5) {
            //const labelVendorId = tblData.VendorForLabelId || 0;
            //const boxVendorId = tblData.VendorForBoxId || 0;

            //BindVendorList('vendorLabelInput', 'ddlVendorLabelList', labelVendorId);
            //BindVendorList('vendorBoxInput', 'ddlVendorBoxList', boxVendorId);

            //  Show or hide rejection section
            if (tblData1.Rejection && tblData1.Rejection.trim() !== "") {
                $('#showRejectionTextStep5').removeClass('hide');
                $('#RejectionTextStep5').text(tblData1.Rejection || '');
                $('#RejectedByStep5').text(tblData1.RejectedBy || '');
                $('#RejectedOnStep5').text(tblData1.RejectedOn || '');
                $('#RejectedByStepNo').text(tblData1.StepNo || 0);
            } else {
                $('#showRejectionTextStep5').addClass('hide');
            }
        }
        //else if (tblData && StepNo === 6) {
        //    $('#ddlSampleReceivedStatus').val(tblData.SampleReceivedStatus || 'Select');

        //}
        //else if (tblData && StepNo === 7) {
        //    $('#ddlSampleQCStatus').val(tblData.SampleQCStatus || 'Select').trigger('change');
        //    // Clear all checkboxes first
        //    $('.qcChecklist').prop('checked', false);

        //    if (tblData.SampleQCPoints) {
        //        const points = tblData.SampleQCPoints.split(',');

        //        points.forEach(point => {
        //            // Trim and find checkbox with matching data-id, then check it
        //            $('.qcChecklist[data-id="' + point.trim() + '"]').prop('checked', true);
        //        });
        //    }

        //}
        //else if (tblData && StepNo === 8) {
        //    $('#txtColorClientObs').val(tblData.ColorClientObs || '');
        //    $('#txtFontClientObs').val(tblData.FontClientObs || '');
        //    $('#txtUVFinishingClientObs').val(tblData.UvFinishingClientObs || '');
        //    $('#ddlLaminationClientObs').val(tblData.LaminationClientObs || 'Select').trigger('change');
        //    $('#ddlLabelTypeClientObs').val(tblData.LabelType || 'Select').trigger('change');
        //    $('#ddlPrintSampleApprovalByClient').val(tblData.SampleBromideStatus || 'Select').trigger('change');
        //}
        else if (tblData && StepNo === 9) {

            $('#lblPaymentTerms').text(tblData.PayTerms || '');
            $('#txtReceiptDate').val(tblData.ReceiptDate);
            $('#lblTotalOrderValue').text(tblData.TotalOrdeValue || 0);
            $('#lblAdvancePayment').text(tblData.TotAdvanceAmt || 0);
            $('#txtVoucherNo').val(tblData.VoucherNo || '');
        }
        else if (tblData && StepNo === 10) {
            $('#lblPaymentTerms').text(tblData.PayTerms || '');
            $('#txtReceiptDate').val(tblData.ReceiptDate);
            $('#lblTotalOrderValue').text(tblData.TotalOrdeValue || 0);
            $('#lblAdvancePayment').text(tblData.TotAdvanceAmt || 0);
            $('#txtVoucherNo').val(tblData.VoucherNo || '');

            for (var i = 0; i < response.data.data.Table2.length; i++) {
                var fileName = response.data.data.Table2[i].ActualFileName;
                var fileType = response.data.data.Table2[i].FileType;
                var type = response.data.data.Table2[i].Type;
                var fileUrl = response.data.data.Table2[i].FileUrl;
                var fFd = response.data.data.Table2[i].AttachmentId;
                var fSize = response.data.data.Table2[i].FileSize;
                var newfileName = response.data.data.Table2[i].NewFileName;
                var attachmentType = response.data.data.Table2[i].AttachmentType;
                //Check type and load
           
                    ViewLoadFileData1(fileName, fileType, type, fileUrl, fFd, fSize, newfileName);
                    $('#NoUploadFile1').hide();
                    $('#ShowUploadFile1').show();
             
            }

            console.log(response);
        }


        //  Show Sale order detail - Modified on 261125
        if (response.data.data.Table3.length > 0) {
            const tblData3 = response.data.data.Table3[0];
           $("#saleOrderId").text(tblData3.DocNo);
                $("#saleOrderDate").text(tblData3.SODate);
                $("#custName").text(tblData3.CustName);
                $("#custBrandName").text(tblData3.CustBrandName);
                $("#itemName").text(tblData3.ItemName);
                $("#poNo").text(tblData3.PONo);
                $("#poDate").text(tblData3.PODate);
                /*$("#salePersonName").text(tblData3.ContactPersonName);*/
                $("#salePersonName").text(tblData3.Createdby);
                $("#remarks").text(tblData3.Remarks);

                if (response.data.data.Table4.length > 0) {

                    response.data.data.Table4.forEach((item, index) => {

                        // Create clickable file name
                        const fileLink = `<a href="#" class="task-file-link" 
                                data-url="${item.FileUrl}" 
                                data-name="${item.ActualFileName}">
                                ${item.ActualFileName}
                          </a><br/>`;

                        $("#viewAttSO").append(fileLink);
                    });

                    // Attach click event (for all dynamic links)
                    $(".task-file-link").off("click").on("click", function (e) {
                        e.preventDefault();
                        const fileUrl = $(this).data("url");
                        const fileName = $(this).data("name");

                        handleTaskFile(fileUrl, fileName);
                    });

                    $(".task-file-link").css("font-weight", "bold");
                }
                else {
                    $("#viewAttSO").hide();
                }

            }

        //  Show Sale order detail End


    });
}

function ViewLoadFileData1(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
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
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile1(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
        <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button class="delete-document" id="${fileUrl + "||" + fFd + "||" + fileName}" data-filename="${fileName}" onclick="DownloadItemFile1(this)"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file1", "document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("documentImages1").appendChild(newDocument);
}


function cleanUpModals() {
    $('.modal').modal('hide'); // hide any open modals
    $('.modal-backdrop').remove(); // remove leftover backdrops
    $('body').removeClass('modal-open'); // reset scroll lock
    $('body').css('padding-right', ''); // reset padding if added
}

let vData = [];
function BindVendorList(inputId, suggestionListId, selectedValue = null) {
    CommonAjaxMethod(virtualPath + 'Generic/GetDropDownWithAsync/', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: "MaterialPurchase_101"
    }, 'GET', function (response) {
        const vendorData = response.data.data.Table;
        const $input = $('#' + inputId);
        const $suggestions = $('#' + suggestionListId);

        vData = vendorData;
        // Store vendor data for use in autocomplete
        $input.data('vendorData', vendorData);

        // If a selected value is passed (ID), pre-fill input and store selected ID
        if (selectedValue) {
            const selectedVendor = vendorData.find(v => v.ID == selectedValue);
            if (selectedVendor) {
                $input.val(selectedVendor.ValueName);
                $input.data('selected-id', selectedVendor.ID);
            }
        }

        // Clear previous handlers
        $input.off('focus input');



        // Show full list on focus
        $input.on('focus', function () {
            renderSuggestions($input, $suggestions, vendorData);
        });

        // Filter on input
        $input.on('input', function () {
            const searchText = $(this).val().toLowerCase();
            const filteredData = vendorData.filter(v =>
                v.ValueName.toLowerCase().includes(searchText)
            );
            renderSuggestions($input, $suggestions, filteredData);
        });

        // Close suggestions when clicking outside
        $(document).off('click.vendorlist').on('click.vendorlist', function (e) {
            if (!$(e.target).closest('.autocomplete-wrapper').length) {
                $('.suggestions').empty().hide(); // Close all open suggestion boxes
            }
        });
    });
}

// Helper to render suggestions
function renderSuggestions($input, $suggestions, dataList) {
    $suggestions.empty();

    if (!dataList.length) {
        $suggestions.hide();
        return;
    }

    dataList.forEach(vendor => {
        $('<li/>')
            .addClass('suggestion-item')
            .text(vendor.ValueName)
            .attr('data-id', vendor.ID)
            .on('click', function () {
                $input.val(vendor.ValueName);
                $input.data('selected-id', vendor.ID);
                $suggestions.empty().hide();
            })
            .appendTo($suggestions);
    });

    $suggestions.show();
}

function SaveStep1(orderId, StepNo) {
    if (checkValidationOnSubmit('MandateStep1') == true) {
        var model =
        {
            OrderId: orderId > 0 ? orderId : 0,
            ApplyFDAStatus: $("#ddlApplyFDA").val() > 0 ? $("#ddlApplyFDA").val() : 0,
            CrrId: $('#ddlCrr').val() > 0 ? $('#ddlCrr').val() : 0,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A", 
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                console.log($("#ddlApplyFDA").val());
                window.location.reload()

                //showModalFieldStep2(orderId, StepNo + 1);
            }
        });

        
    }
}


let fileModelList = [];
let fileModelList1 = [];
let fileModelList2 = [];

let fileDatalList = [];
let fileDatalList1 = [];
let fileDatalList2 = [];

async function SaveNewItemDocStep2(orderId, StepNo, ItemOTDStatus) {

    var obj =
    {
        FolderNames: "OrderToDeliveryDoc/"
    }
    var type = 1;//This is for  common upload in attachment folder.
    const jsonString = JSON.stringify(obj);
    const result1 = await MultiFileUploadWithoutAync("fileAttachment1", jsonString, type, fileDataCollection1);
    const result2 = await MultiFileUploadWithoutAync("fileAttachment2", jsonString, type, fileDataCollection2);
    const result3 = await MultiFileUploadWithoutAync("fileAttachment1", jsonString, type, fileDataCollection3);
    var fileData1 = [];
    var fileData2 = [];
    var fileData3 = [];
    var finalFileData1 = [];
    var finalFileData2 = [];
    var finalFileData3 = [];

    if (result1.Data != undefined) {
        fileData1 = JSON.parse(result1.Data).FileModelList;
        fileData1 = fileData1.concat(fileDatalList);
        finalFileData1 = finalFileData1.concat(fileData1);
    }
    else {
        fileData1 = fileModelList;
    }

    if (result2.Data != undefined) {
        fileData2 = JSON.parse(result2.Data).FileModelList;
        fileData2 = fileData2.concat(fileDatalList1);
        finalFileData2 = finalFileData2.concat(fileData2);
    }
    else {
        fileData2 = fileModelList1;
    }

    if (result3.Data != undefined) {
        fileData3 = JSON.parse(result3.Data).FileModelList;
        fileData3 = fileData3.concat(fileDatalList2);
        finalFileData3 = finalFileData3.concat(fileData3);
    }
    else {
        fileData3 = fileModelList2;
    }

    finalFileData1 = fileModelList.concat(finalFileData1);
    finalFileData2 = fileModelList1.concat(finalFileData2);
    finalFileData3 = fileModelList2.concat(finalFileData3);

    // ✅ Mandatory check: At least 1 file required for each type
    if (finalFileData1.length === 0) {
        FailToaster("Please upload at least one file for Artwork file for Label.");
        return;
    }
    if (finalFileData2.length === 0) {
        FailToaster("Please upload at least one file for Artwork file for Box.");
        return;
    }
    //if (finalFileData3.length === 0) {
    //    FailToaster("Please upload at least one file for Others Attachments.");
    //    return;
    //}

    // ✅ File count validation
    if (finalFileData1.length > 10) {
        FailToaster(finalFileData1.length + " Files. You cannot upload more than 10 files for Artwork file for Label.");
        return;
    }
    if (finalFileData2.length > 10) {
        FailToaster(finalFileData2.length + " Files. You cannot upload more than 10 files for Artwork file for Box.");
        return;
    }
    if (finalFileData3.length > 10) {
        FailToaster(finalFileData3.length + " Files. You cannot upload more than 10 files for Others Attachments.");
        return;
    }
    var model =
    {
        OrderId: orderId,
        fileAttachment1Step2: fileData1,
        fileAttachment2Step2: fileData2,
        fileAttachment3Step2: fileData3,
        OrderItemId: orderItemId,
        StepNo: StepNo,
        Status1: ItemOTDStatus
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "OrderToDelivery_101",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString1
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            // showModalFieldStep3(orderId, StepNo + 1);
            window.location.reload()

        }
    });
}

async function SaveRepeatItemDocStep2(orderId, StepNo, ItemOTDStatus) {

    var obj =
    {
        FolderNames: "OrderToDeliveryDoc/"
    }
    var type = 1;//This is for  common upload in attachment folder.
    const jsonString = JSON.stringify(obj);
    const result1 = await MultiFileUploadWithoutAync("fileAttachment1", jsonString, type, fileDataCollection1);
    const result2 = await MultiFileUploadWithoutAync("fileAttachment2", jsonString, type, fileDataCollection2);
    const result3 = await MultiFileUploadWithoutAync("fileAttachment1", jsonString, type, fileDataCollection3);
    var fileData1 = [];
    var fileData2 = [];
    var fileData3 = [];
    var finalFileData1 = [];
    var finalFileData2 = [];
    var finalFileData3 = [];

    if (result1.Data != undefined) {
        fileData1 = JSON.parse(result1.Data).FileModelList;
        fileData1 = fileData1.concat(fileDatalList);
        finalFileData1 = finalFileData1.concat(fileData1);
    }
    else {
        fileData1 = fileModelList;
    }

    if (result2.Data != undefined) {
        fileData2 = JSON.parse(result2.Data).FileModelList;
        fileData2 = fileData2.concat(fileDatalList1);
        finalFileData2 = finalFileData2.concat(fileData2);
    }
    else {
        fileData2 = fileModelList1;
    }

    if (result3.Data != undefined) {
        fileData3 = JSON.parse(result3.Data).FileModelList;
        fileData3 = fileData3.concat(fileDatalList2);
        finalFileData3 = finalFileData3.concat(fileData3);
    }
    else {
        fileData3 = fileModelList2;
    }

    finalFileData1 = fileModelList.concat(finalFileData1);
    finalFileData2 = fileModelList1.concat(finalFileData2);
    finalFileData3 = fileModelList2.concat(finalFileData3);

    // ✅ Mandatory check: At least 1 file required for each type
    if (finalFileData1.length === 0) {
        FailToaster("Please upload at least one file for Artwork file for Label.");
        return;
    }
    if (finalFileData2.length === 0) {
        FailToaster("Please upload at least one file for Artwork file for Box.");
        return;
    }
    //if (finalFileData3.length === 0) {
    //    FailToaster("Please upload at least one file for Others Attachments.");
    //    return;
    //}

    // ✅ File count validation
    if (finalFileData1.length > 10) {
        FailToaster(finalFileData1.length + " Files. You cannot upload more than 10 files for Artwork file for Label.");
        return;
    }
    if (finalFileData2.length > 10) {
        FailToaster(finalFileData2.length + " Files. You cannot upload more than 10 files for Artwork file for Box.");
        return;
    }
    if (finalFileData3.length > 10) {
        FailToaster(finalFileData3.length + " Files. You cannot upload more than 10 files for Others Attachments.");
        return;
    }
    var model =
    {
        OrderId: orderId,
        fileAttachment1Step2: fileData1,
        fileAttachment2Step2: fileData2,
        fileAttachment3Step2: fileData3,
        OrderItemId: orderItemId,
        StepNo: StepNo,
        Status1: ItemOTDStatus,
        Status2: $('input[name="artwork"]:checked').val() || '',
        Status3: $("#ddlRepeatStatusStep2").val() > 0 ? $("#ddlRepeatStatusStep2").val() : 0
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "OrderToDelivery_101",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString1
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            window.location.reload();
           
        }
    });
}

function SaveRepeatStatusOnlyStep2(orderId, StepNo, ItemOTDStatus) {

    var model =
    {
        OrderId: orderId,
        OrderItemId: orderItemId,
        StepNo: StepNo,
        Status1: ItemOTDStatus,
        Status2: $('input[name="artwork"]:checked').val() || '',
        Status3: $("#ddlRepeatStatusStep2").val() > 0 ? $("#ddlRepeatStatusStep2").val() : 0
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "OrderToDelivery_101",
        Operation: "A",  // Use Update for existing records, Add for new ones
        ModelData: jsonString1
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {
            //if ($("#ddlRepeatStatusStep2").val() == 1) {
            //    showModalFieldStep3(orderId, StepNo + 1);
            //}
            //else if ($("#ddlRepeatStatusStep2").val() == 2) {
            //    showModalFieldStep5(orderId, StepNo + 1);
            //}
            //else { window.location.reload() }

            window.location.reload();
        }
    });
}

function SaveStep3(orderId, StepNo) {

    var model = {
        OrderId: orderId,
        ArtWorkReceivedStatus: $("#ddlConfirmArtworkGrapic").val() > 0 ? $("#ddlConfirmArtworkGrapic").val() : 0,
        ReviewStatus: 1,
        RejectionText: '',
        OrderItemId: orderItemId,
        StepNo: StepNo
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "OrderToDelivery_101",
        Operation: "A",
        ModelData: jsonString1
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {

            window.location.reload()
            //showModalFieldStep4(orderId, StepNo + 1);
        }
    });
}

function RejectStep3(orderId, StepNo) {
    let reason = $('#rejectionReasonStep3').val().trim();

    if (reason === "") {
        FailToaster('Reason is mandatory on Step 3.');
    }
    //else if (reason.length > 300) {
    //    FailToaster('Reason cannot exceed 300 characters.');
    //} 
    else {
        var model = {
            OrderId: orderId,
            ArtWorkReceivedStatus: $("#ddlConfirmArtworkGrapic").val() > 0 ? $("#ddlConfirmArtworkGrapic").val() : 0,
            RejectionText: reason,
            ReviewStatus: 2,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                window.location.reload()
                // showModalFieldStep2(orderId, StepNo - 1);
            }
        });
    }
}

function SaveStep4(orderId, StepNo) {
    var model = {
        OrderId: orderId,
        ArtWorkReceivedStatus: $("#ddlConfirmArtworkLegal").val() > 0 ? $("#ddlConfirmArtworkLegal").val() : 0,
        ReviewStatus: 1,
        RejectionText: '',
        OrderItemId: orderItemId,
        StepNo: StepNo
    }
    // Convert the model to JSON string
    const jsonString1 = JSON.stringify(model);
    // Assign the final data for submission
    let GenericModeldata = {
        ScreenID: "OrderToDelivery_101",
        Operation: "A",
        ModelData: jsonString1
    };
    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {

            //showModalFieldStep5(orderId, StepNo + 1);
            window.location.reload()
        }
    });
}

function RejectStep4(orderId, StepNo) {
    let reason = $('#rejectionReasonStep4').val().trim();

    if (reason === "") {
        FailToaster('Reason is mandatory on Step 4.');
    }
    else {
        var model = {
            OrderId: orderId,
            ArtWorkReceivedStatus: $("#ddlConfirmArtworkLegal").val() > 0 ? $("#ddlConfirmArtworkLegal").val() : 0,
            RejectionText: reason,
            ReviewStatus: 2,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                window.location.reload()
                // showModalFieldStep2(orderId, StepNo - 2);
            }
        });
    }
}

function SaveStep5(orderId, StepNo) {
    if (checkValidationOnSubmit('MandateStep5') == true) {
        var labelVendorId = $('#vendorLabelInput').data('selected-id') || 0;
        var boxVendorId = $('#vendorBoxInput').data('selected-id') || 0;

        // Custom validation for vendor selection
        if (labelVendorId === 0) {
            FailToaster("Please select a valid vendor!!!.");
            return;
        }

        if (boxVendorId === 0) {
            FailToaster("Please select a valid vendor!!!.");
            return;
        }

        const v = vData.filter(input => input.ID == labelVendorId && input.ValueName == $('#vendorLabelInput').val())
        const v2 = vData.filter(input => input.ID == boxVendorId && input.ValueName == $('#vendorBoxInput').val())

        if (v.length == 0 || v2.length == 0) {
            FailToaster("Please select a valid vendor!!!.");
            return;
        }

        var model = {
            OrderId: orderId,
            VendorForLabelId: labelVendorId,
            VendorForBoxId: boxVendorId,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                window.location.reload()
                // showModalFieldStep6(orderId, StepNo + 1);
            }
        });
    }
    
}

function SaveStep6(orderId, StepNo) {
    if (checkValidationOnSubmit('MandateStep6') == true) {
        var model = {
            OrderId: orderId,
            SampleReceivedStatus: $("#ddlSampleReceivedStatus").val() > 0 ? $("#ddlSampleReceivedStatus").val() : 0,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                // showModalFieldStep7(orderId, StepNo + 1);
            }
            window.location.reload()
        });

      
    }
    
}

function SaveStep7(orderId, StepNo) {
    // Get selected checkbox IDs
    let selectedChecklistIds = [];
    $('.qcChecklist:checked').each(function () {
        selectedChecklistIds.push($(this).data('id'));
    });

    //if (selectedChecklistIds.length === 0) {
    //    FailToaster("Please select at least one QC checklist item.");
    //    return;
    //}

    // Convert to comma-separated string
    const checklistString = selectedChecklistIds.join(',');

    const model = {
        OrderId: orderId,
        SampleQCStatus: $('#ddlSampleQCStatus').val(),
        SampleQCPoints: checklistString,
        RejectionText: '',
        OrderItemId: orderItemId,
        StepNo: StepNo,
    };

    const jsonString = JSON.stringify(model);

    const GenericModeldata = {
        ScreenID: "OrderToDelivery_101",
        Operation: "A",
        ModelData: jsonString
    };

    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
        if (response.ValidationInput == 1) {

            window.location.reload()

            // showModalFieldStep8(orderId, StepNo + 1);
        }
    });
}

function RejectStep7(orderId, StepNo) {
    let reason = $('#rejectionReasonStep7').val().trim();

    if (reason === "") {
        FailToaster('Reason is mandatory on Step 7.');
    }
    else {
        var model = {
            OrderId: orderId,
            SampleQCStatus: $("#ddlSampleQCStatus").val(),
            SampleQCPoints: '',
            RejectionText: reason,
            ReviewStatus: 2,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                window.location.reload()
                // showModalFieldStep5(orderId, StepNo - 2);
            }
        });
    }
}

function SaveStep8(orderId, StepNo) {

        const model = {
            OrderId: orderId,
            ColorObservation: $('#txtColorClientObs').val().trim(),
            FontObservation: $('#txtFontClientObs').val().trim(),
            UVFinishingObservation: $('#txtUVFinishingClientObs').val().trim(),
            LaminationType: $("#ddlLaminationClientObs").val() > 0 ? $("#ddlLaminationClientObs").val() : 0,
            LabelType: $("#ddlLabelTypeClientObs").val() > 0 ? $("#ddlLabelTypeClientObs").val() : 0,
            SampleClientStatus: $("#ddlPrintSampleApprovalByClient").val() > 0 ? $("#ddlPrintSampleApprovalByClient").val() : 0, // approved/rejected
            OrderItemId: orderItemId,
            StepNo: StepNo,
        };

        const jsonString = JSON.stringify(model);

        const GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",
            ModelData: jsonString
        };

        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {

                window.location.reload()
                // showModalFieldStep9(orderId, StepNo + 1);
            }
        });
    
   
}

function RejectStep8(orderId, StepNo) {
    let reason = $('#rejectionReasonStep8').val().trim();

    if (reason === "") {
        FailToaster('Reason is mandatory on Step 8.');
    }
    else {
        var model = {
            OrderId: orderId,
            SampleClientStatus: $("#ddlPrintSampleApprovalByClient").val() > 0 ? $("#ddlPrintSampleApprovalByClient").val() : 0, // approved/rejected
            RejectionText: reason,
            ReviewStatus: 2,
            OrderItemId: orderItemId,
            StepNo: StepNo
        }
        // Convert the model to JSON string
           const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
           let GenericModeldata = {
                ScreenID: "OrderToDelivery_101",
                Operation: "A",
                ModelData: jsonString1
           };
            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                if (response.ValidationInput == 1) {

                    window.location.reload()
                    // showModalFieldStep5(orderId, StepNo - 3);
                }
            });
    }
}

async function SaveStep9(orderId, StepNo) {
    if (checkValidationOnSubmit('MandateStep9') == true) {

        var obj =
        {
            FolderNames: "OrderToDeliveryDoc/"
        }
        var type = 1;//This is for  common upload in attachment folder.
        const jsonString = JSON.stringify(obj);
        const result1 = await MultiFileUploadWithoutAync("fileAttachment1", jsonString, type, fileDataCollection1);
       
        var fileData1 = [];
        var finalFileData1 = [];
        
        if (result1.Data != undefined) {
            fileData1 = JSON.parse(result1.Data).FileModelList;
            fileData1 = fileData1.concat(fileDatalList);
            finalFileData1 = finalFileData1.concat(fileData1);
        }
        else {
            fileData1 = fileModelList;
        }

        finalFileData1 = fileModelList.concat(finalFileData1);
       
        // ✅ Mandatory check: At least 1 file required for each type
        if (finalFileData1.length === 0) {
            FailToaster("Please upload at least one file for Payment Sreenshot.");
            return;
        }

        // ✅ File count validation
        if (finalFileData1.length > 10) {
            FailToaster(finalFileData1.length + " Files. You cannot upload more than 10 files for Payment Sreenshot.");
            return;
        }
   
        const model = {
            OrderId: orderId,
            VoucherNo: '',
            ReceiptDate: '',
            fileAttachmentStep9: fileData1,
            OrderItemId: orderItemId,
            StepNo: StepNo,
        };

        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                // showModalFieldStep3(orderId, StepNo + 1);
                window.location.reload()

            }
        });
    }
}


async function SaveStep10(orderId, StepNo) {
    if (checkValidationOnSubmit('MandateStep9') == true) {

       

        // ✅ Mandatory check: At least 1 file required for each type
       
        const model = {
            OrderId: orderId,
            VoucherNo: $('#txtVoucherNo').val().trim(),
            ReceiptDate: ChangeDateFormatSecond($('#txtReceiptDate').val()),
            OrderItemId: orderItemId,
            StepNo: StepNo,
        };

        // Convert the model to JSON string
        const jsonString1 = JSON.stringify(model);
        // Assign the final data for submission
        let GenericModeldata = {
            ScreenID: "OrderToDelivery_101",
            Operation: "A",  // Use Update for existing records, Add for new ones
            ModelData: jsonString1
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
            if (response.ValidationInput == 1) {
                // showModalFieldStep3(orderId, StepNo + 1);
                window.location.reload()

            }
        });
    }
}


function saleOrderDetById() {
    return `
        <div class="row">
            <div class="col-sm-12 form-group">
                <div class="toggle-card bg-bgl">
                    <div class="toggle-card-header toggle-info">
                        <h4 class="toggle-card-title">Sale Order Information</h4>
                        <span class="toggle-card-icon"><img src="../assets/images/icons/help/arrow-down.png" class="icon-sm" alt=""></span>
                    </div>
                    <div class="toggle-containe toggle-info-content" style="display: none;">
                        <div class="row">
                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Sale Order Id</label>
                                <p id="saleOrderId"></p>
                            </div>

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Sale Order Date</label>
                                <p id="saleOrderDate"></p>
                            </div>

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Customer Company</label>
                                <p id="custName"></p>
                            </div>

                           <!-- <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Custome Brand Name</label>
                                <p id="custBrandName"></p>
                            </div>

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">FG Item Name</label>
                                <p id="itemName"></p>
                            </div>-->

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Customer PO No</label>
                                <p id="poNo"></p>
                            </div>

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Customer PO Date</label>
                                <p id="poDate"></p>
                            </div>

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Sales Person Name</label>
                                <p id="salePersonName"></p>
                            </div>

                            <div class="col-sm-12 form-group">
                                <label class="text-gray mb-0">Remarks</label>
                                <p id="remarks"></p>
                            </div>

                            <div class="col-sm-12 form-group" id="viewAttSO">
                                <label class="text-gray mb-0" style="font-weight: bold;">Uploaded Customer PO</label>
                                <p><a href="" target="blank" id="item_attSO"></a></p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
}



function handleTaskFile(fileUrl, actualFileName) {
    // Determine file extension using lastIndexOf('.')

    /*const imageElement = document.getElementById('myImage');*/

    // Get the value of the 'src' attribute
    const filePath = fileUrl;
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
        downloadTaskFile(filePath, actualFileName);
    }
}

// Function to display image in the modal
function showTaskModalWithImage(imagePath) {
    const modalImage = document.getElementById('myImage');
    if (!imagePath || imagePath.length <= 1) {
        FailToaster('No image/pdf was saved!');
        return;
    }
    modalImage.src = imagePath;
    $('#viewimage').modal('show'); // Assuming you're using jQuery and Bootstrap // changs in comment
}

function downloadTaskFile(filePath, actualFileName) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = actualFileName; // Let the browser decide the file name or specify one
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}