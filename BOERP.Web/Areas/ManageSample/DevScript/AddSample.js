$(document).ready(function () {

    var obj1 = {
        parentId: login_ID,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: isDuplicate == 1 ? 5 : 14,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }

    if (cust_id) {
       
        LoadMasterDropdown('ddlCustomer', obj1, 'Select', false, cust_id) ;
    }
    else {
        LoadMasterDropdown('ddlCustomer', obj1, 'Select', false, '') ;
    }

    var obj7 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 3,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlPackagingType_0', obj7, 'Select', false);



    var obj2 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 93,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }
    LoadMasterDropdown('ddlBrand', obj2, 'Select', false);


    var obj3 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 1,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }


    LoadMasterDropdown('ddlsampletype', obj3, 'Select', false);



    var obj4 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 4,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }

    LoadMasterDropdown('ddlOrderSize', obj4, 'Select', false);



    var obj5 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 2,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown('ddlFormCate_0', obj5, 'Select', false);
    LoadMasterDropdown('OLddlFormCate_0', obj5, 'Select', false);
    LoadMasterDropdown('OULddlFormCate_0', obj5, 'Select', false);

    $('#ddlCustomer').on('change', function () {

             showBrandType();
    });

    $('#ddlAddress').on('change', function () {
        $('#viewAddress').hide();
                    showAddress();
    });

    $('#ddlsampletype').on('change', function () {

        var selectedText = $(this).find("option:selected").text();

        if (selectedText == 'Oil') {
            
            $('.oil').show();
            $('.oilhide').hide();

            if (Edit_ID > 0) {
                $('#checkUnlisted').hide();
            }

        } else {
            $('.oil').hide();
            $('#unlistedittem').prop('checked', false).trigger('change');
            $('.oilhide').show();
        }
    });

    LoadItemDropdown();

    if (View_Id > 0) {
        ViewSample(View_Id);
        console.log(View_Id)
    }
   else if (Edit_ID <= 0) {
        getSampleDocSeries()
    }
   
    else {
        if (isDuplicate == 1) {
           //getSampleChildDocSeries(Edit_ID);
            DuplicateSample(Edit_ID);
        }
        else {
            EditSample(Edit_ID);
        }
        
    }
 
    //$('#ddlItem_0').on('select2:open', function () {

    //    setTimeout(() => {

    //        $('.select2-container--open .select2-search__field').off('input').on('input', function () {
    //            var searchText = $(this).val();
    //            console.log('Search text for ddlItem:', searchText);


    //        });
    //    }, 0);
    //});

    $(document).on('click', '#addrowOL', function () {
        
        AddOilListedRows();
        // Append the new row
        
    });


    $(document).on('click', '#addrowOUL', function () {
        AddOilUnlistedRows();
    });



    $(document).on('click', '#addrow', function () {
        AddStandardRows();
    });





});



//function waitUntilDropdownReady(selector, timeout = 5000) {
//    return new Promise((resolve, reject) => {
//        const start = Date.now();
//        const interval = setInterval(() => {
//            const $ddl = $(selector);
//            if ($ddl.length && $ddl.find("option").length > 1) {
//                clearInterval(interval);
//                resolve($ddl);
//            } else if (Date.now() - start >= timeout) {
//                clearInterval(interval);
//                //FailToaster("Timeout: Dropdown not ready ->", selector);
//                reject(`Dropdown '${selector}' failed to load in time.`);
//            }
//        });
//    });
//}


function getSampleDocSeries() {


    var model =
    {
        Id: 0,
        Type: 4
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Sample_101' }, 'GET', function (response) {

        if (response.data.data.Table) {
            $('#sampledocseries').val(response.data.data.Table[0].SampleDocSeries);
           
        }



        console.log(response);
    });

}


async function getSampleChildDocSeries(Edit_ID) {


    var model =
    {
        Id: Edit_ID,
        Type: 6
    };

    var child = '';

    const jsonString = JSON.stringify(model);



    try {
        const response = await new Promise((resolve, reject) => {
            CommonAjaxMethod(
                virtualPath + 'Generic/GetRecordsAsync',
                { modelData: jsonString, screenId: 'Sample_101' },
                'GET',
                function (response) {
                    resolve(response);
                },
                function (error) {
                    reject(error);
                }
            );
        });

        console.log(response)

        if (response.data.data.Table) {
            child = response.data.data.Table[0].SampleDocSeries;

        } else {
            return '';
        }

    } catch (error) {
        console.error("Error in CommonAjaxMethod:", error);
        FailToaster("Error in CommonAjaxMethod:", error);
        return '';
    }

    //CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Sample_101' }, 'GET', function (response) {

       
    //    console.log(response)

    //    if (response.data.data.Table) {
    //        child = response.data.data.Table[0].SampleDocSeries;
           
    //    }
      
    //});

    return child;

}


var isListed = false;

 function DuplicateSample(id) {

    var sample_childdocseries =  getSampleChildDocSeries(id);

    var model =
    {
        Id: id
    };

    var jsonString = JSON.stringify(model)

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Sample_101' }, 'GET', function (response) {

        console.log(response);

        if (response.data.data.Table) {

            var data = response.data.data.Table[0];

            

            if (isDuplicate == 1) {
                $('#sampledocseries').val(data.SampleDocSeries);
            }

            var obj4 = {
                parentId: 0,
                masterTableTypeId: 0,
                isMasterTableType: false,
                isManualTable: true,
                manualTable: 4,
                manualTableId: 0,
                ScreenId: 'Sample_101'
            }

       

            var obj3 = {
                parentId: 0,
                masterTableTypeId: 0,
                isMasterTableType: false,
                isManualTable: true,
                manualTable: 1,
                manualTableId: 0,
                ScreenId: 'Sample_101'
            }


            var obj1 = {
                parentId: login_ID,
                masterTableTypeId: 0,
                isMasterTableType: false,
                isManualTable: true,
                manualTable: isDuplicate == 1 ? 5 : 14,
                manualTableId: 0,
                ScreenId: 'Sample_101'
            }

            var obj2 = {
                parentId: 0,
                masterTableTypeId: 0,
                isMasterTableType: false,
                isManualTable: true,
                manualTable: 93,
                manualTableId: 0,
                ScreenId: 'DropdownList_101'
            }
            LoadMasterDropdown('ddlBrand', obj2, 'Select', false, data.Brand_Id);

           
            LoadMasterDropdown('ddlOrderSize', obj4, 'Select', false, data.OrderSize);

            LoadMasterDropdown('ddlsampletype', obj3, 'Select', false, data.Sample_Type_Id);

            LoadMasterDropdown('ddlCustomer', obj1, 'Select', false, data.Customer_ID);
            $('#ddlCustomer').prop('disabled', true);
           // $('#ddlBrand').val(data.Brand_Id).trigger('change');
            $('#ddlBrand').prop('disabled', true);          
            $('#ddlsampletype').prop('disabled', true);
            $('#ddlOrderSize').prop('disabled', true);
            data.IsNBD ? $('#isNBD').val(1).trigger('change') : $('#isNBD').val(0).trigger('change');
            $('#hdnActualFileName').val(data.ActualFileName).trigger('change');
            $('#hdnNewFileName').val(data.NewFileName).trigger('change');
            $('#hdnFileURL').val(data.FileURL).trigger('change');
            data.IsInternationalSample ? $('#internationalsample').prop('checked', true) : $('#internationalsample').prop('checked', false);
            $('#internationalsample').prop('disabled', true);
            data.IsSelfPickup ? $('#handover').prop('checked', true) : $('#handover').prop('checked', false);
            $('#handover').prop('disabled', true);
            data.IsPaidSample ? $('#paidsample').prop('checked', true) : $('#paidsample').prop('checked', false);
            $('#paidsample').prop('disabled', true);
            $('#ddlAddress').val(data.CustomerAddress_Id).trigger('change');
            $('#ddlAddress').prop('disabled', true);


            var IsOilCategory = $('#ddlsampletype').find("option:selected").text() == 'Oil' ? 1 : 0


            if (data.IsOilType == 1) {

                $('#checkUnlisted').hide();


                const oil_listed = response.data.data.Table1.filter(input => input.IsListed == 1);

                const oil_unlisted = response.data.data.Table1.filter(input => input.IsListed == 0);


                if (oil_listed.length > 0) {
                    isListed = true;

                }

                if (oil_listed.length > 0) {


                    $('#addrowOL').prop('disabled', true);


                    for (var i = 0; i < oil_listed.length; i++) {

                        $('#listedLabel').text('Listed Item Information');
                        $('#checkUnlisted').hide();

                        if (i == 0) {
                            $('#ddlItem_0').val(oil_listed[0].Item_Id);
                            $('#ddlI_0').val(oil_listed[0].Item_Name);
                            var obj5 = {
                                parentId: 0,
                                masterTableTypeId: 0,
                                isMasterTableType: false,
                                isManualTable: true,
                                manualTable: 2,
                                manualTableId: 0,
                                ScreenId: 'Sample_101'
                            }
                            LoadMasterDropdown(`OLddlFormCate_0`, obj5, 'Select', false, oil_listed[i].Formulation_Category);

                            $('#OLtargetprice_0').val(oil_listed[i].TargetPrice);
                            $('#OLhdnNewFileName_0').val(oil_listed[i].NewFileName);
                            $('#OLhdnActualFileName_0').val(oil_listed[i].ActualFileName);
                            $('#OLhdnFileURL_0').val(oil_listed[i].FileURL);

                        }

                        else {
                            var newIndex = AddOilListedRows();
                            $('#ddlItem_' + newIndex).val(oil_listed[i].Item_Id);
                            $('#ddlI_' + newIndex).val(oil_listed[i].Item_Name);
                            $('#OLddlFormCate_' + newIndex).val(oil_listed[i].Formulation_Category).trigger('change');
                            $('#OLtargetprice_' + newIndex).val(oil_listed[i].TargetPrice);
                            $('#OLhdnNewFileName_' + newIndex).val(oil_listed[i].NewFileName);
                            $('#OLhdnActualFileName_' + newIndex).val(oil_listed[i].ActualFileName);
                            $('#OLhdnFileURL_' + newIndex).val(oil_listed[i].FileURL);

                        }
                    }

                }
                if (oil_unlisted.length > 0) {

                    $('#addrowOUL').prop('disabled', true);

                    $('#unlistedittem').prop('checked', true).trigger('change');
                    $('#viewListed').hide();


                    for (var i = 0; i < oil_unlisted.length; i++) {

                        if (i == 0) {
                            $('#OULitemname_0').val(oil_unlisted[i].Item_Name);
                            var obj5 = {
                                parentId: 0,
                                masterTableTypeId: 0,
                                isMasterTableType: false,
                                isManualTable: true,
                                manualTable: 2,
                                manualTableId: 0,
                                ScreenId: 'Sample_101'
                            }
                            LoadMasterDropdown(`OULddlFormCate_0`, obj5, 'Select', false, oil_unlisted[i].Formulation_Category);

                            $('#OULtargetprice_0').val(oil_unlisted[i].TargetPrice);
                            $('#OULhdnActualFileName_0').val(oil_unlisted[i].ActualFileName);
                            $('#OULhdnNewFileName_0').val(oil_unlisted[i].NewFileName);
                            $('#OULhdnFileURL_0').val(oil_unlisted[i].FileURL);
                        }
                        else {
                            var newIndex = AddOilUnlistedRows();

                            $('#OULitemname_' + newIndex).val(oil_unlisted[i].Item_Name);
                            $('#OULddlFormCate_' + newIndex).val(oil_unlisted[i].Formulation_Category).trigger('change');
                            $('#OULtargetprice_' + newIndex).val(oil_unlisted[i].TargetPrice);
                            $('#OULhdnActualFileName_' + newIndex).val(oil_unlisted[i].ActualFileName);
                            $('#OULhdnNewFileName_' + newIndex).val(oil_unlisted[i].NewFileName);
                            $('#OULhdnFileURL_' + newIndex).val(oil_unlisted[i].FileURL);
                        }
                    }

                }



            }

            else {

                $('#addrow').prop('disabled', true);

                $('#toggleDiv').hide();

                const standard_table = response.data.data.Table1;

                for (var i = 0; i < standard_table.length; i++) {

                    if (i == 0) {
                        $('#itemname_0').val(standard_table[i].Item_Name)
                        $('#fragrance_0').val(standard_table[i].Fragrance)
                        $('#colour_0').val(standard_table[i].Colour)
                        $('#targetprice_0').val(standard_table[i].TargetPrice)
                        $('#exactreq_0').val(standard_table[i].Requirements)
                        $('#mustnotingredients_0').val(standard_table[i].MustNotIngredients)
                        $('#mustingredients_0').val(standard_table[i].MustIngredients)
                        $('#hdnActualFileName_0').val(standard_table[i].ActualFileName)
                        $('#hdnNewFileName_0').val(standard_table[i].NewFileName)
                        $('#hdnFileURL_0').val(standard_table[i].FileURL)

                        var obj5 = {
                            parentId: 0,
                            masterTableTypeId: 0,
                            isMasterTableType: false,
                            isManualTable: true,
                            manualTable: 2,
                            manualTableId: 0,
                            ScreenId: 'Sample_101'
                        }
                        LoadMasterDropdown(`ddlFormCate_0`, obj5, 'Select', false, standard_table[i].Formulation_Category);

                        var obj7 = {
                            parentId: 0,
                            masterTableTypeId: 0,
                            isMasterTableType: false,
                            isManualTable: true,
                            manualTable: 3,
                            manualTableId: 0,
                            ScreenId: 'Sample_101'
                        }
                        LoadMasterDropdown(`ddlPackagingType_0`, obj7, 'Select', false, standard_table[i].PackagingType);

                    }
                    else {

                        var newIndex = AddStandardRows();

                        $('#itemname_' + newIndex).val(standard_table[i].Item_Name)
                        $('#ddlFormCate_' + newIndex).val(standard_table[i].Formulation_Category).trigger('change')
                        $('#fragrance_' + newIndex).val(standard_table[i].Fragrance)
                        $('#colour_' + newIndex).val(standard_table[i].Colour)
                        $('#ddlPackagingType_' + newIndex).val(standard_table[i].PackagingType).trigger('change')
                        $('#targetprice_' + newIndex).val(standard_table[i].TargetPrice)
                        $('#exactreq_' + newIndex).val(standard_table[i].Requirements)
                        $('#mustnotingredients_' + newIndex).val(standard_table[i].MustNotIngredients)
                        $('#mustingredients_' + newIndex).val(standard_table[i].MustIngredients)
                        $('#hdnActualFileName_' + newIndex).val(standard_table[i].ActualFileName)
                        $('#hdnNewFileName_' + newIndex).val(standard_table[i].NewFileName)
                        $('#hdnFileURL_' + newIndex).val(standard_table[i].FileURL)
                    }

                }
            }

        }



        console.log(response);
    });

}



function AddStandardRows() {
    var lastRow = $('#standardRows .standard_rows:last');
    var lastIndex = parseInt(lastRow.attr('id').split('_')[1] || "0");
    var newIndex = lastIndex + 1;
    var newRow = lastRow.clone();

    // Update row ID
    newRow.attr('id', 'S_' + newIndex);

    newRow.find('*').each(function () {
        // Update ID
        if (this.id) {
            let newId = this.id.replace(/_\d+$/, '_' + newIndex);
            $(this).attr('id', newId);
        }

        // Update FOR attributes
        if (this.tagName === 'LABEL' && $(this).attr('for')) {
            let newFor = $(this).attr('for').replace(/_\d+$/, '_' + newIndex);
            $(this).attr('for', newFor);
        }

        // Update span IDs
        if (this.tagName === 'SPAN' && this.id) {
            let newSpanId = this.id.replace(/_\d+$/, '_' + newIndex);
            $(this).attr('id', newSpanId);
        }

        // Clear values
        if ($(this).is('input[type="text"], input[type="number"], input[type="file"]')) {
            $(this).val('');
        }


    });

    // Replace the first cell (Add button) with Delete button
    newRow.find('td:first').html(`
        <div class="deleterow cursor-pointer addrow">
            <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
        </div>
        <input type="hidden" id="hdnIndentDetailId_${newIndex}" value="0" />
    `);

    newRow.find('td').eq(2).html(`
        <select class="form-control applyselect Mandate" onchange="HideErrorMessage(this)" id="ddlFormCate_${newIndex}">
                                            </select>
                                            <span id="spddlFormCate_${newIndex}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
    `);

    newRow.find('td').eq(5).html(`
       <select class="form-control applyselect Mandate" onchange="HideErrorMessage(this)" id="ddlPackagingType_${newIndex}">
                                        </select>
                                        <span id="spddlPackagingType_${newIndex}" class="text-danger field-validation-error" style="display:none;">Oops! You've missed this field.</span>
    `);

    newRow.find('td').eq(10).html(`
    										<input type="hidden" id="OULhdnActualFileName_${newIndex}" value="0" />
										<input type="hidden" id="OULhdnNewFileName_${newIndex}" value="0" />
										<input type="hidden" id="OULhdnFileURL_${newIndex}" value="0" />
										<input type="file" id="OULuploadfile_${newIndex}" onchange="UploadocumentSampleDetReport(this.id)" class="form-control file-upload" value="" placeholder="Enter" />

										<div class="file-preview d-none"></div>
    `)

    $('#standardRows').append(newRow);

    // newRow.find('.applyselect').select2();

    newRow.find('.applyselect').select2();

    var obj5 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 2,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown(`ddlFormCate_${newIndex}`, obj5, 'Select', false);

    var obj7 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 3,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown(`ddlPackagingType_${newIndex}`, obj7, 'Select', false);

    return newIndex;


}


function AddOilUnlistedRows() {
    var lastRow = $('#OilUnlistedRows .oil_unlisted:last');
    var lastIndex = parseInt(lastRow.attr('id').split('_')[1] || "0");
    var newIndex = lastIndex + 1;
    var newRow = lastRow.clone();

    // Update row ID
    newRow.attr('id', 'OUl_' + newIndex);

    newRow.find('*').each(function () {
        // Update ID
        if (this.id) {
            let newId = this.id.replace(/_\d+$/, '_' + newIndex);
            $(this).attr('id', newId);
        }

        // Update FOR attributes
        if (this.tagName === 'LABEL' && $(this).attr('for')) {
            let newFor = $(this).attr('for').replace(/_\d+$/, '_' + newIndex);
            $(this).attr('for', newFor);
        }

        // Update span IDs
        if (this.tagName === 'SPAN' && this.id) {
            let newSpanId = this.id.replace(/_\d+$/, '_' + newIndex);
            $(this).attr('id', newSpanId);
        }

        // Clear values
        if ($(this).is('input[type="text"], input[type="number"], input[type="file"]')) {
            $(this).val('');
        }

       
    });

    // Replace the first cell (Add button) with Delete button
    newRow.find('td:first').html(`
        <div class="deleterow cursor-pointer addrow">
            <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
        </div>
        <input type="hidden" id="hdnIndentDetailId_${newIndex}" value="0" />
    `);

    newRow.find('td').eq(2).html(`
        <select class="form-control applyselect MandateOUL" onchange="HideErrorMessage(this)" id="OULddlFormCate_${newIndex}">
                                            </select>
                                            <span id="spOULddlFormCate_${newIndex}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
    `);

    newRow.find('td').eq(5).html(`
    										<input type="hidden" id="OULhdnActualFileName_${newIndex}" value="0" />
										<input type="hidden" id="OULhdnNewFileName_${newIndex}" value="0" />
										<input type="hidden" id="OULhdnFileURL_${newIndex}" value="0" />
										<input type="file" id="OULuploadfile_${newIndex}" onchange="UploadocumentSampleDetReport(this.id)" class="form-control file-upload" value="" placeholder="Enter" />

										<div class="file-preview d-none"></div>
    `)

    $('#OilUnlistedRows').append(newRow);

    // newRow.find('.applyselect').select2();

    newRow.find('.applyselect').select2();

    var obj100 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 2,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown(`OULddlFormCate_${newIndex}`, obj100, 'Select', false);

    return newIndex;

}

function UploadocumentSampleReport(id) {



    var fileUpload = $("#" + id).get(0);

    const allowedExtensions = ['.PDF', '.DOCX', '.TXT', '.XLS', '.XLSX', '.JPEG', '.JPG'];

    var files = fileUpload.files;


    if (files.length > 0) {

        // Create FormData object
        var fileData = new FormData();

        // Looping over all files and add it to FormData object
        for (var i = 0; i < files.length; i++) {
            fileData.append(files[i].name, files[i]);
        }

        var fileex = files[0].name.split('.');
        var fileexlen = fileex.length;

        var fileExtension = '.' + fileex[fileexlen - 1];

        fileExtension = fileExtension.toUpperCase();

        if (!allowedExtensions.includes(fileExtension)) {
            FailToaster(`The file "${files[0].name}" has an unsupported format. Please upload files of type: ${allowedExtensions.join(', ').toLowerCase()}.`);

            // Clear the file input
            $("#" + id).val(""); // jQuery way

            // Also reset hidden fields and image (optional)
            $('#hdnActualFileName').val('');
            $('#hdnNewFileName').val('');
            $('#hdnFileURL').val('');
            $("#myQuesImage").attr("src", '');

            return;
        }

        $.ajax({
            url: baseURL + 'CommonMethod/UploadSampleDocument',
            type: "POST",
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            data: fileData,

            success: function (response) {
                $("#customLoader").hide();
                var result = JSON.parse(response);

                if (result.ErrorMessage == "") {

                    $('#hdnActualFileName').val(result.FileModel.ActualFileName);
                    $('#hdnNewFileName').val(result.FileModel.NewFileName);
                    $('#hdnFileURL').val(result.FileModel.FileUrl);
                    $("#myQuesImage").attr("src", result.FileModel.FileUrl);
                    //$('#lblAttachement').text(result.FileModel.ActualFileName);                

                }
                else {


                    FailToaster(result.ErrorMessage);

                }
            }
            ,
            error: function (error) {
                $("#customLoader").hide();
                FailToaster(error);

                isSuccess = false;
            }

        });
    }
    else {
        $('#hdnActualFileName').val('');
        $('#hdnNewFileName').val('');
        $('#hdnFileURL').val('');
        $("#myQuesImage").attr("src", '');
        FailToaster("Please select file to attach!");

        return "error";

    }

    return "";



}



function UploadocumentSampleDetReport(id) {



    var fileUpload = $("#" + id).get(0);

    var splitId = id.split('_')[1];

    var prefixUpload = id.substring(0, 2);

    const allowedExtensions = ['.PDF', '.DOCX', '.TXT', '.XLS', '.XLSX', '.JPEG', '.JPG'];

    var files = fileUpload.files;

    var files = fileUpload.files;
    if (files.length > 0) {

        // Create FormData object
        var fileData = new FormData();

        // Looping over all files and add it to FormData object
        for (var i = 0; i < files.length; i++) {
            fileData.append(files[i].name, files[i]);
        }

        var fileex = files[0].name.split('.');
        var fileexlen = fileex.length;

        var fileExtension = '.' + fileex[fileexlen - 1];

        fileExtension = fileExtension.toUpperCase();

        if (!allowedExtensions.includes(fileExtension)) {
            FailToaster(`The file "${files[0].name}" has an unsupported format. Please upload files of type: ${allowedExtensions.join(', ').toLowerCase()}.`);

            // Clear the file input
            $("#" + id).val(""); // jQuery way

            // Also reset hidden fields and image (optional)
            $('#hdnActualFileName').val('');
            $('#hdnNewFileName').val('');
            $('#hdnFileURL').val('');
            $("#myQuesImage").attr("src", '');

            return;
        }

        $.ajax({
            url: baseURL + 'CommonMethod/UploadSampleDocument',
            type: "POST",
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            data: fileData,

            success: function (response) {
                $("#customLoader").hide();
                var result = JSON.parse(response);

                if (result.ErrorMessage == "") {

                    if (prefixUpload == 'OL') {

                        $('#OLhdnActualFileName_' + splitId).val(result.FileModel.ActualFileName);
                        $('#OLhdnNewFileName_' + splitId).val(result.FileModel.NewFileName);
                        $('#OLhdnFileURL_' + splitId).val(result.FileModel.FileUrl);

                    }
                    else if (prefixUpload == 'OU') {

                        $('#OULhdnActualFileName_' + splitId).val(result.FileModel.ActualFileName);
                        $('#OULhdnNewFileName_' + splitId).val(result.FileModel.NewFileName);
                        $('#OULhdnFileURL_' + splitId).val(result.FileModel.FileUrl);

                    }
                    else {
                        $('#hdnActualFileName_' + splitId).val(result.FileModel.ActualFileName);
                        $('#hdnNewFileName_' + splitId).val(result.FileModel.NewFileName);
                        $('#hdnFileURL_' + splitId).val(result.FileModel.FileUrl);
                    }

                    //$("#myQuesImage").attr("src", result.FileModel.FileUrl);
                    //$('#lblAttachement').text(result.FileModel.ActualFileName);                

                }
                else {


                    FailToaster(result.ErrorMessage);

                }
            }
            ,
            error: function (error) {
                $("#customLoader").hide();
                FailToaster(error);

                isSuccess = false;
            }

        });
    }
    else {
        if (prefixUpload == 'OL') {

            $('#OLhdnActualFileName_' + splitId).val('');
            $('#OLhdnNewFileName_' + splitId).val('');
            $('#OLhdnFileURL_' + splitId).val('');

        }
        else if (prefixUpload == 'OU') {

            $('#OULhdnActualFileName_' + splitId).val('');
            $('#OULhdnNewFileName_' + splitId).val('');
            $('#OULhdnFileURL_' + splitId).val('');

        }
        else {
            $('#hdnActualFileName_' + splitId).val('');
            $('#hdnNewFileName_' + splitId).val('');
            $('#hdnFileURL_' + splitId).val('');
        }
        FailToaster("Please select file to attach!");

        return "error";

    }

    return "";



}


function AddOilListedRows() {
    var lastRow = $('#oilRowsContainer .oil_listed:last');
    var lastIndex = parseInt(lastRow.attr('id').split('_')[1] || "0");
    var newIndex = lastIndex + 1;
    var newRow = lastRow.clone();

    // Update row ID
    newRow.attr('id', 'Ol_' + newIndex);

    newRow.find('*').each(function () {
        // Update ID
        if (this.id) {
            let newId = this.id.replace(/_\d+$/, '_' + newIndex);
            $(this).attr('id', newId);
        }

        // Update FOR attributes
        if (this.tagName === 'LABEL' && $(this).attr('for')) {
            let newFor = $(this).attr('for').replace(/_\d+$/, '_' + newIndex);
            $(this).attr('for', newFor);
        }

        // Update span IDs
        if (this.tagName === 'SPAN' && this.id) {
            let newSpanId = this.id.replace(/_\d+$/, '_' + newIndex);
            $(this).attr('id', newSpanId);
        }

        // Clear values
        if ($(this).is('input[type="text"], input[type="number"], input[type="file"]')) {
            $(this).val('');
        }

        // Clear suggestion box and hidden fields
        if ($(this).is('ul') || $(this).is('input[type="hidden"]')) {
            $(this).val('').empty();
        }
    });

    // Replace the first cell (Add button) with Delete button
    newRow.find('td:first').html(`
        <div class="deleterow cursor-pointer addrow">
            <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
        </div>
        <input type="hidden" id="hdnIndentDetailId_${newIndex}" value="0" />
    `);

    newRow.find('td').eq(2).html(`
        <select class="form-control applyselect MandateOL" onchange="HideErrorMessage(this)" id="OLddlFormCate_${newIndex}">
                                            </select>
                                            <span id="spOLddlFormCate_${newIndex}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
    `);

    newRow.find('td').eq(5).html(`
    										<input type="hidden" id="OULhdnActualFileName_${newIndex}" value="0" />
										<input type="hidden" id="OULhdnNewFileName_${newIndex}" value="0" />
										<input type="hidden" id="OULhdnFileURL_${newIndex}" value="0" />
										<input type="file" id="OULuploadfile_${newIndex}" onchange="UploadocumentSampleDetReport(this.id)" class="form-control file-upload" value="" placeholder="Enter" />

										<div class="file-preview d-none"></div>
    `)

    $('#oilRowsContainer').append(newRow);

    newRow.find('.applyselect').select2();

    var obj5 = {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 2,
        manualTableId: 0,
        ScreenId: 'Sample_101'
    }
    LoadMasterDropdown(`OLddlFormCate_${newIndex}`, obj5, 'Select', false);

    return newIndex;
   
}

$(document).on('click', '.deleterow', function () {
    $(this).closest('tr').remove();
});



var ItemCodeList = [];
function LoadItemDropdown() {
    var model =
    {
        ColumnName: 'Name',
        SearchData: 'Filter by Sample ItemCat'
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'ItemMaster_104' }, 'GET', function (response) {

        ItemCodeList = response.data.data.Table;

        // Unique filter by ITEM_CODE
        const uniqueItems = [];
        const seenCodes = new Set();

        ItemCodeList.forEach(item => {
            if (!seenCodes.has(item.ITEM_CODE)) {
                seenCodes.add(item.ITEM_CODE);
                uniqueItems.push(item);
            }
        });

        ItemCodeList = uniqueItems;  // replace original list
        //var $ele = $('#ddlItem_0');
        //$ele.empty();
        //$ele.append($('<option/>').val('Select').text('Select'));
        //$.each(ItemCodeList, function (ii, vall)
        //{
        //    var displayText = vall.ITEM_NAME + " (" + vall.ITEM_CODE + ")"; // Format: ITEM_NAME (ITEM_CODE)
        //    $ele.append($('<option />').val(vall.ITEM_ID).text(displayText));
        //})
    });
}
  

function SetAddressDefault() {

    if ($('#handover').prop('checked')) {

        if ($('#ddlCustomer').val() > 0) {

            $('#ddlAddress').val(0).trigger('change');
            $('#ddlAddress').prop('disabled', true);
        }

    }
    else {
        
            $('#ddlAddress').val('Select').trigger('change');
        $('#ddlAddress').prop('disabled', false);

        if ($('#ddlCustomer').val() > 0) {

            $('#ddlAddress').val(0).trigger('change');
          
        }
        
    }
}


function Getdata(inputElement) {
    let rowId = inputElement.id.split('_')[1]; // Extract RowId from input ID
    let suggestionBox = document.getElementById(`globalSuggestionBox_${rowId}`);

    let search = inputElement.value.toLowerCase();
    suggestionBox.innerHTML = "";

    //if (search.length < 2) {
    //    suggestionBox.style.display = "none";
    //    return;
    //}

    let matchedItems = ItemCodeList.filter(item =>
        item.ITEM_DISPLAY.toLowerCase().includes(search) || item.ITEM_DISPLAY.toLowerCase().includes(search)
    ).slice(0,50);

    if (matchedItems.length === 0) {
        suggestionBox.innerHTML = `<li class="errordata">No data found</li>`;
    } else {
        matchedItems.forEach(item => {
            let li = document.createElement("li");
            li.textContent = `${item.ITEM_DISPLAY}`;
            li.dataset.id = item.ITEM_ID;
            li.dataset.name = item.ITEM_NAME;
            li.dataset.code = item.ITEM_CODE;

            li.addEventListener("click", function () {
                inputElement.value = item.ITEM_NAME; // Set selected value in input
                suggestionBox.style.display = "none";

                $(`#ddlItem_` + rowId).val(item.ITEM_ID);
                $(`#lblItemName_` + rowId).text(item.ITEM_NAME);
                $(`#lblItemDesc_` + rowId).text(item.DESCRIPTION);
                $(`#lblUnit_` + rowId).text(item.UNIT);

            });

            suggestionBox.appendChild(li);
        });
    }

    // Positioning
    let rect = inputElement.getBoundingClientRect();
    suggestionBox.style.top = rect.bottom + "px";
    suggestionBox.style.left = rect.left + "px";
    suggestionBox.style.width = rect.width + "px";
    suggestionBox.style.display = "block";
}
document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("searchlist")) {
        document.querySelectorAll(".suggestions").forEach(box => box.style.display = "none");
    }
});
//function setItemNameDD(searchText, inputId) {

//    var filtered_ItemArr;

//    if (searchText.length > 0) {

//        filtered_ItemArr = Item_Array.filter(item => item.ValueName.toLowerCase().includes(searchText.toLowerCase())).sort((a, b) => a.ValueName.localeCompare(b.ValueName))
//            .slice(0, 100);
//    }
//    else {
//        filtered_ItemArr = Item_Array.sort((a, b) => a.ValueName.localeCompare(b.ValueName))
//            .slice(0, 100);
//    }

//    BindDropDown(inputId, 'Select', filtered_ItemArr, 'Select', false)

//}

function showFilePreviewHeader(fileURL, fileName) {
    if (!fileURL || !fileName) return;
    const $input = $('#updFile');
    const $preview = $input.siblings('.file-preview');

    if ($preview.is(':empty')) $preview.html(PREVIEW_HTML);

    const $name = $preview.find('.file-name');
    $name.text(fileName);
    $preview.find('.download-file').attr('href', fileURL).attr('download', fileName);

    enableTooltip($preview.find('.download-file'));
    enableTooltip($preview.find('.delete-file'));

    $input.addClass('d-none');
    $preview.removeClass('d-none');
}

function showFilePreview(rowPrefix, index, fileUrl, fileName, disableDelete = true) {
    const $preview = $(`#${rowPrefix}uploadfile_${index}`).siblings('.file-preview');
    const $input = $(`#${rowPrefix}uploadfile_${index}`);

    if (!fileUrl || fileUrl === "0") return;

    // Create preview if missing
    if ($preview.is(':empty')) $preview.html(PREVIEW_HTML);

    const $name = $preview.find('.file-name');
    $name.text(fileName || "View File").attr('title', fileName);

    const $download = $preview.find('.download-file');
    $download.attr('href', fileUrl).attr('download', fileName);

    if (disableDelete) {
        $preview.find('.delete-file').remove(); // Hide delete for edit/view mode
    }

    $input.addClass('d-none');
    $preview.removeClass('d-none');
}


async function EditSample(id) {

    var model =
    {
        Id: id
    };

    var jsonString = JSON.stringify(model)

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Sample_101' }, 'GET', function (response) {

        console.log(response);

        if (response.data.data.Table) {

            var data = response.data.data.Table[0];
            var obj4 = {
                parentId: 0,
                masterTableTypeId: 0,
                isMasterTableType: false,
                isManualTable: true,
                manualTable: 4,
                manualTableId: 0,
                ScreenId: 'Sample_101'
            }



            var obj3 = {
                parentId: 0,
                masterTableTypeId: 0,
                isMasterTableType: false,
                isManualTable: true,
                manualTable: 1,
                manualTableId: 0,
                ScreenId: 'Sample_101'
            }


            var obj1 = {
                parentId: login_ID,
                masterTableTypeId: 0,
                isMasterTableType: false,
                isManualTable: true,
                manualTable: isDuplicate == 1 ? 5 : 14,
                manualTableId: 0,
                ScreenId: 'Sample_101'
            }

            var obj2 = {
                parentId: 0,
                masterTableTypeId: 0,
                isMasterTableType: false,
                isManualTable: true,
                manualTable: 93,
                manualTableId: 0,
                ScreenId: 'DropdownList_101'
            }
            LoadMasterDropdown('ddlBrand', obj2, 'Select', false, data.Brand_Id);


            LoadMasterDropdown('ddlOrderSize', obj4, 'Select', false, data.OrderSize);

            LoadMasterDropdown('ddlsampletype', obj3, 'Select', false, data.Sample_Type_Id);

            LoadMasterDropdown('ddlCustomer', obj1, 'Select', false, data.Customer_ID);
            $('#ddlCustomer').prop('disabled', true);

            $('#sampledocseries').val(response.data.data.Table1[0].ERP_Sample_Det_UniqId);

            if (data.Prev_Sample_Id != null) {
                $('#view_prev_id').show();
                $('#prev_sampledocseries').val(data.Prev_Sample_Id);
            }
            //$('#ddlCustomer').val(data.Customer_ID).trigger('change');
            $('#ddlCustomer').prop('disabled', true);
           // $('#ddlBrand').val(data.Brand_Id).trigger('change');   
            $('#ddlBrand').prop('disabled', true);
           // $('#ddlsampletype').val(data.Sample_Type_Id).trigger('change');
            $('#ddlsampletype').prop('disabled', true);
            //$('#ddlOrderSize').val(data.OrderSize).trigger('change');
            $('#ddlOrderSize').prop('disabled', true);
            data.IsNBD ? $('#isNBD').val(1).trigger('change') : $('#isNBD').val(0).trigger('change');
            $('#hdnActualFileName').val(data.ActualFileName).trigger('change');
            $('#hdnNewFileName').val(data.NewFileName).trigger('change');
            $('#hdnFileURL').val(data.FileURL).trigger('change');

            // Show payment screenshot file preview if exists
            showFilePreviewHeader(data.FileURL, data.ActualFileName);

            data.IsInternationalSample ? $('#internationalsample').prop('checked', true) : $('#internationalsample').prop('checked', false);
            $('#internationalsample').prop('disabled', true);
            data.IsSelfPickup ? $('#handover').prop('checked', true).trigger('change') : $('#handover').prop('checked', false).trigger('change');
            $('#handover').prop('disabled', true);
            data.IsPaidSample ? $('#paidsample').prop('checked', true) : $('#paidsample').prop('checked', false);
            $('#paidsample').prop('disabled', true);
            const $dropdown = $('#ddlAddress');

            const waitForDropdown = setInterval(() => {
                if ($dropdown.find('option').length > 0) {
                    clearInterval(waitForDropdown);
                    $('#ddlAddress').val(data.CustomerAddress_Id).trigger('change');
                    $('#ddlAddress').prop('disabled', true);
                }
            });
           
            $('#txtRemarks').val(data.Remarks);
            $('#txtRemarks').prop('disabled', true);


            var IsOilCategory = $('#ddlsampletype').find("option:selected").text() == 'Oil' ? 1 : 0


            if (data.IsOilType == 1) {

                $('#checkUnlisted').hide();


                const oil_listed = response.data.data.Table1.filter(input => input.IsListed == 1);

                const oil_unlisted = response.data.data.Table1.filter(input => input.IsListed == 0);


                if (oil_listed.length > 0) {
                    isListed = true;

                    $('#checkUnlisted').hide();

                    $('#toggleDiv').hide();

                }


                if (oil_listed.length > 0) {


                    $('#addrowOL').prop('disabled', true);

                   // $('#checkBoth').hide();


                    for (var i = 0; i < oil_listed.length; i++) {

                        $('#listedLabel').text('Listed Item Information');
                        $('#checkUnlisted').hide();

                        if (i == 0) {
                            $('#ddlItem_0').val(oil_listed[0].Item_Id);
                            $('#ddlI_0').val(oil_listed[0].Item_Name);
                            var obj5 = {
                                parentId: 0,
                                masterTableTypeId: 0,
                                isMasterTableType: false,
                                isManualTable: true,
                                manualTable: 2,
                                manualTableId: 0,
                                ScreenId: 'Sample_101'
                            }
                            LoadMasterDropdown(`OLddlFormCate_0`, obj5, 'Select', false, oil_listed[i].Formulation_Category );

                            $('#OLtargetprice_0').val(oil_listed[i].TargetPrice);
                            $('#OLhdnNewFileName_0').val(oil_listed[i].NewFileName);
                            $('#OLhdnActualFileName_0').val(oil_listed[i].ActualFileName);
                            $('#OLhdnFileURL_0').val(oil_listed[i].FileURL);
                            $('#exactreqOL_0').val(oil_listed[i].Requirements);

                            showFilePreview('OL', i, oil_listed[i].FileURL, oil_listed[i].ActualFileName);
                        }

                        else {
                            var newIndex = AddOilListedRows();
                            $('#ddlItem_' + newIndex).val(oil_listed[i].Item_Id);
                            $('#ddlI_' + newIndex).val(oil_listed[i].Item_Name);
                            $('#OLddlFormCate_' + newIndex).val(oil_listed[i].Formulation_Category).trigger('change');
                            $('#OLtargetprice_' + newIndex).val(oil_listed[i].TargetPrice);
                            $('#OLhdnNewFileName_' + newIndex).val(oil_listed[i].NewFileName);
                            $('#OLhdnActualFileName_' + newIndex).val(oil_listed[i].ActualFileName);
                            $('#OLhdnFileURL_' + newIndex).val(oil_listed[i].FileURL);
                            $('#exactreqOL_' + newIndex).val(oil_listed[i].Requirements);

                            showFilePreview('OUL', i, oil_unlisted[i].FileURL, oil_unlisted[i].ActualFileName);
                        }
                    }

                }
                if (oil_unlisted.length > 0) {

                    $('#addrowOUL').prop('disabled', true);

                    $('#unlistedittem').prop('checked', true).trigger('change');
                    $('#viewListed').hide();


                    for (var i = 0; i < oil_unlisted.length; i++) {

                        if (i == 0) {
                            $('#OULitemname_0').val(oil_unlisted[i].Item_Name);
                            var obj5 = {
                                parentId: 0,
                                masterTableTypeId: 0,
                                isMasterTableType: false,
                                isManualTable: true,
                                manualTable: 2,
                                manualTableId: 0,
                                ScreenId: 'Sample_101'
                            }
                            LoadMasterDropdown(`OULddlFormCate_0`, obj5, 'Select', false, oil_unlisted[i].Formulation_Category);

                            $('#OULtargetprice_0').val(oil_unlisted[i].TargetPrice);
                            $('#OULhdnActualFileName_0').val(oil_unlisted[i].ActualFileName);
                            $('#OULhdnNewFileName_0').val(oil_unlisted[i].NewFileName);
                            $('#OULhdnFileURL_0').val(oil_unlisted[i].FileURL);
                            $('#exactreqOUL_0').val(oil_unlisted[i].Requirements);

                            showFilePreview('OUL', i, oil_unlisted[i].FileURL, oil_unlisted[i].ActualFileName);
                        }
                        else {
                            var newIndex = AddOilUnlistedRows();

                            $('#OULitemname_' + newIndex).val(oil_unlisted[i].Item_Name);
                            $('#OULddlFormCate_' + newIndex).val(oil_unlisted[i].Formulation_Category).trigger('change');
                            $('#OULtargetprice_' + newIndex).val(oil_unlisted[i].TargetPrice);
                            $('#OULhdnActualFileName_' + newIndex).val(oil_unlisted[i].ActualFileName);
                            $('#OULhdnNewFileName_' + newIndex).val(oil_unlisted[i].NewFileName);
                            $('#OULhdnFileURL_' + newIndex).val(oil_unlisted[i].FileURL);
                            $('#exactreqOUL_' + newIndex).val(oil_unlisted[i].Requirements);

                            showFilePreview('', i, oil_unlisted[i].FileURL, oil_unlisted[i].ActualFileName);
                        }
                    }

                }



            }

            else {

                $('#addrow').prop('disabled', true);

                $('#toggleDiv').hide();

                const standard_table = response.data.data.Table1;

                for (var i = 0; i < standard_table.length; i++) {

                    if (i == 0) {
                        $('#itemname_0').val(standard_table[i].Item_Name)
                        $('#fragrance_0').val(standard_table[i].Fragrance)
                        $('#colour_0').val(standard_table[i].Colour)
                        $('#targetprice_0').val(standard_table[i].TargetPrice)
                        $('#exactreq_0').val(standard_table[i].Requirements)
                        $('#mustnotingredients_0').val(standard_table[i].MustNotIngredients)
                        $('#mustingredients_0').val(standard_table[i].MustIngredients)
                        $('#hdnActualFileName_0').val(standard_table[i].ActualFileName)
                        $('#hdnNewFileName_0').val(standard_table[i].NewFileName)
                        $('#hdnFileURL_0').val(standard_table[i].FileURL)

                        showFilePreview('', i, standard_table[i].FileURL, standard_table[i].ActualFileName);

                        var obj5 = {
                            parentId: 0,
                            masterTableTypeId: 0,
                            isMasterTableType: false,
                            isManualTable: true,
                            manualTable: 2,
                            manualTableId: 0,
                            ScreenId: 'Sample_101'
                        }
                        LoadMasterDropdown(`ddlFormCate_0`, obj5, 'Select', false, standard_table[i].Formulation_Category);

                        var obj7 = {
                            parentId: 0,
                            masterTableTypeId: 0,
                            isMasterTableType: false,
                            isManualTable: true,
                            manualTable: 3,
                            manualTableId: 0,
                            ScreenId: 'Sample_101'
                        }
                        LoadMasterDropdown(`ddlPackagingType_0`, obj7, 'Select', false, standard_table[i].PackagingType);

                    }
                    else {

                        var newIndex = AddStandardRows();

                        $('#itemname_' + newIndex).val(standard_table[i].Item_Name)
                        $('#ddlFormCate_' + newIndex).val(standard_table[i].Formulation_Category).trigger('change')
                        $('#fragrance_' + newIndex).val(standard_table[i].Fragrance)
                        $('#colour_' + newIndex).val(standard_table[i].Colour)
                        $('#ddlPackagingType_' + newIndex).val(standard_table[i].PackagingType).trigger('change')
                        $('#targetprice_' + newIndex).val(standard_table[i].TargetPrice)
                        $('#exactreq_' + newIndex).val(standard_table[i].Requirements)
                        $('#mustnotingredients_' + newIndex).val(standard_table[i].MustNotIngredients)
                        $('#mustingredients_' + newIndex).val(standard_table[i].MustIngredients)
                        $('#hdnActualFileName_' + newIndex).val(standard_table[i].ActualFileName)
                        $('#hdnNewFileName_' + newIndex).val(standard_table[i].NewFileName)
                        $('#hdnFileURL_' + newIndex).val(standard_table[i].FileURL)
                    }
                 
                }
            }

        }



        console.log(response);
    });

}


function ViewSample(id) {

    //debugger;
    var model =
    {
        Id: id,
        Type: 4
    };

    var jsonString = JSON.stringify(model)

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Sample_101' }, 'GET', function (response) {

        console.log(response);

        if (response.data.data.Table) {

            var data = response.data.data.Table[0];

            var sampleData = response.data.data.Table1;

            if (sampleData[0].IsTechDoc == 0) {
                $('#techdoc').html('No File Uploaded');
            }

            if (data.Prev_Sample_Id != null) {
                $('#view_prev_id').show();
                $('#txtPrevSampleId').text(data.Prev_Sample_Id);


            }
            $('#txtSampleId').text((response.data.data.Table1[0].ERP_Sample_Det_UniqId));
            $('#txtCustomer').text(data.Client);
            $('#txtBrandType').text(data.BrandName);
            $('#txtSampleType').text(data.SampleType);
            $('#txtOrderSize').text(data.OrderSize);
            $('#txtIsNBD').text(data.IsNBD);
            $('#txtCustomerAdd').text(data.CustomerAdderss);
            $('#Remarks').text(data.Remarks);
            //$('#hdnFileURL').text()
            $('#txtinternationalsample').prop('checked', data.IsInternationalSample);
            $('#txthandover').prop('checked', data.IsSelfPickup);
            $('#paidsample').prop('checked', data.IsPaidSample);
            const tbody = document.getElementById("sampleTableBody");
            const oilTbody = document.getElementById("sampleOilBody");

            if (data.FileURL.length > 1) {
                $('#txtViewSample').on('click', function () {
                    handleTaskFile(data.FileURL, data.ActualFileName);
                })
            }
            else {
                $('#txtViewSample').html('No File Uploaded');
            }

            if (data.SampleType == 'Oil') {
                $('#viewOil').show();

               
              
                sampleData.forEach(item => {

                    var file = ``;

                    if (item.FileURL && item.FileURL.length > 1) {
                         file = `<a onclick="handleTaskFile('${item.FileURL}', '${item.ActualFileName}')" class="fn-bold" target="_blank"><img src="../../assets/images/icons/help/view-icon.png" class="icon-sm"> View</a>`
                    }
                    else {
                        file = 'No File Uploaded';
                    }


                    const row = document.createElement("tr");

                    row.innerHTML = `
            <td>${item.Item_Name}</td>
            <td>${item.txtFormulationCategory}</td>          
            <td class="text-right">${item.TargetPrice}</td>
            <td>${item.Requirements}</td>
            <td>${file}</td>
        `;
                    oilTbody.appendChild(row);
                });
            }

            else {
                $('#viewStandard').show();





                sampleData.forEach(item => {

                    var file = ``;

                    if (item.FileURL && item.FileURL.length > 1) {
                        file = `<a onclick="handleTaskFile('${item.FileURL}', '${item.ActualFileName}')" class="fn-bold" target="_blank"><img src="../../assets/images/icons/help/view-icon.png" class="icon-sm"> View</a>`
                    }
                    else {
                        file = 'No File Uploaded';
                    }


                    const row = document.createElement("tr");
                    row.innerHTML = `
            <td>${item.Item_Name}</td>
            <td>${item.txtFormulationCategory}</td>
            <td>${item.Fragrance}</td>
            <td>${item.Colour}</td>
            <td>${item.txtPackagingType}</td>
            <td class="text-right">${item.TargetPrice}</td>
            <td>${item.Requirements}</td>
            <td>${item.MustIngredients}</td>
            <td>${item.MustNotIngredients}</td>
            <td>${file}</td>
        `;
                    tbody.appendChild(row);
                });
            }

            


        }



        console.log(response);
    });

}


function RedirectToSamplePage() {
    window.location.href = 'SampleIndex?auth=' + AuthToken;
}

function showAddress() {

    

    var model =
    {
        Id: $('#ddlCustomer').val() == 'Select' ? 0 : $('#ddlCustomer').val(),
        Type: 3,
        AddressId: $('#ddlAddress').val() == 'Select' ? -1 : $('#ddlAddress').val()
    };

    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Sample_101' }, 'GET', function (response) {

        if (response.data.data.Table) {
            $('#txtAddressDet').text(response.data.data.Table[0]?.ShipAddress);
            $('#viewAddress').show();
        }



        console.log(response);
    });

}

function saveSampleDetails() {

    // Disable the submit button
    $('#btnSave').prop('disabled', true);

    var bool = true;

    var oil_unlisted = true;

    if (checkValidationOnSubmit('Mandatory')) {

        // console.log('Hi');

        var selectedText = $('#ddlsampletype').find("option:selected").text();

        if (selectedText == 'Oil') {

            if (isDuplicate == 0 && Edit_ID <= 0) {
                if ($('#oil_type').val() == 'both') {

                    bool = checkValidationOnSubmit('MandateOL');

                    if (!bool) {
                        enableSaveAndStop();
                    }
                    oil_unlisted = checkValidationOnSubmit('MandateOUL');
                    if (!oil_unlisted) {
                        enableSaveAndStop();
                    }

                }

                else if ($('#oil_type').val() == 'ul') {
                    oil_unlisted = checkValidationOnSubmit('MandateOUL');
                    if (!oil_unlisted) {
                        enableSaveAndStop();
                    }
                }

                else {
                    bool = checkValidationOnSubmit('MandateOL');
                    if (!bool) {
                        enableSaveAndStop();
                    }
                }
            }
            else {
                if (isListed == true) {
                    bool = checkValidationOnSubmit('MandateOL');
                    if (!bool) {
                        enableSaveAndStop();
                    }
                }
                else {
                    oil_unlisted = checkValidationOnSubmit('MandateOUL');
                    if (!oil_unlisted) {
                        enableSaveAndStop();
                    }
                }
            }
        }
        else {
            bool = checkValidationOnSubmit('Mandate');
            if (!bool) {
                enableSaveAndStop();
            }
        }

        if (bool == true && oil_unlisted == true) {

            var SampleObject = {
                ERP_Sample_Id: isDuplicate == 1 ? 0 : Edit_ID,
                ERP_Sample_Det_Id: Edit_ID,
                isDuplicate: isDuplicate,
                Customer_ID: $('#ddlCustomer').val(),
                Brand_Id: $('#ddlBrand').val(),
                BrandName: $('#ddlBrand').find("option:selected").text(),
                Sample_Type_Id: $('#ddlsampletype').val(),
                OrderSize: $('#ddlOrderSize').val(),
                IsNBD: $('#isNBD').val() == 1 ? 1 : 0,
                ActualFileName: $('#hdnActualFileName').val(),
                NewFileName: $('#hdnNewFileName').val(),
                FileURL: $('#hdnFileURL').val(),
                IsInternationalSample: $('#internationalsample').prop('checked') == true ? 1 : 0,
                IsSelfPickup: $('#handover').prop('checked') == true ? 1 : 0,
                IsPaidSample: $('#paidsample').prop('checked') == true ? 1 : 0,
                CustomerAddress_Id: $('#ddlAddress').val(),
                CustomerAdderss: $('#txtAddressDet').text(),
                Status: 1,
                IsOilCategory: $('#ddlsampletype').find("option:selected").text() == 'Oil' ? 1 : 0,
                Remarks: $('#txtRemarks').val(),
            }

            var erp_sampledet = [];


            if (selectedText == 'Oil') {

                let isGarbage = 0;

                if ((Edit_ID == 0 && ($('#oil_type').val() == 'l' || $('#oil_type').val() == 'both')) || (isDuplicate == 1 && isListed == true) || (Edit_ID > 0 && isListed == true)) {
                    $('.oil_listed').each(function () {

                        var id = this.id.split('_')[1];



                        if ($('#ddlItem_' + id).val() <= 0 || !ItemCodeList.find(input => input.ITEM_NAME == $('#ddlI_' + id).val())) {
                            FailToaster('Please select a valid item!!!');
                            isGarbage = 1;
                            return;
                        }


                        const obj = {
                            ERP_Sample_Det_Id: Edit_ID,
                            Item_Id: $('#ddlItem_' + id).val(),
                            Item_Name: $('#ddlI_' + id).val(),
                            Formulation_Category: $('#OLddlFormCate_' + id).val(),
                            Fragrance: '',
                            Colour: '',
                            PackagingType: '',
                            TargetPrice: parseFloat($('#OLtargetprice_' + id).val()) || 0,
                            Requirements: $('#exactreqOL_' + id).val(),
                            MustNotIngredients: '',
                            MustIngredients: '',
                            ActualFileName: $('#OLhdnActualFileName_' + id).val(),
                            NewFileName: $('#OLhdnNewFileName_' + id).val(),
                            FileURL: $('#OLhdnFileURL_' + id).val(),
                            IsListed: 1
                        }
                        erp_sampledet.push(obj);


                    });


                    if (isGarbage == 1) {
                        enableSaveAndStop();
                    }
                }

                if ((Edit_ID == 0 && ($('#oil_type').val() == 'ul' || $('#oil_type').val() == 'both')) || (isDuplicate == 1 && isListed == false) || (Edit_ID > 0 && isListed == false)) {


                    $('.oil_unlisted').each(function () {


                        var id = this.id.split('_')[1];

                        const obj = {
                            ERP_Sample_Det_Id: Edit_ID,
                            Item_Id: 0,
                            Item_Name: $('#OULitemname_' + id).val(),
                            Formulation_Category: $('#OULddlFormCate_' + id).val(),
                            Fragrance: '',
                            Colour: '',
                            PackagingType: '',
                            TargetPrice: parseFloat($('#OULtargetprice_' + id).val()) || 0,
                            Requirements: $('#exactreqOUL_' + id).val(),
                            MustNotIngredients: '',
                            MustIngredients: '',
                            ActualFileName: $('#OULhdnActualFileName_' + id).val(),
                            NewFileName: $('#OULhdnNewFileName_' + id).val(),
                            FileURL: $('#OULhdnFileURL_' + id).val(),
                            IsListed: 0
                        }
                        erp_sampledet.push(obj);

                    })

                }
            }
            else {

                $('.standard_rows').each(function () {


                    var id = this.id.split('_')[1];

                    const obj = {
                        ERP_Sample_Det_Id: Edit_ID,
                        Item_Id: 0,
                        Item_Name: $('#itemname_' + id).val(),
                        Formulation_Category: $('#ddlFormCate_' + id).val(),
                        Fragrance: $('#fragrance_' + id).val(),
                        Colour: $('#colour_' + id).val(),
                        PackagingType: $('#ddlPackagingType_' + id).val(),
                        TargetPrice: parseFloat($('#targetprice_' + id).val()) || 0,
                        Requirements: $('#exactreq_' + id).val(),
                        MustNotIngredients: $('#mustnotingredients_' + id).val(),
                        MustIngredients: $('#mustingredients_' + id).val(),
                        ActualFileName: $('#hdnActualFileName_' + id).val(),
                        NewFileName: $('#hdnNewFileName_' + id).val(),
                        FileURL: $('#hdnFileURL_' + id).val(),
                        IsListed: 0
                    }
                    erp_sampledet.push(obj);

                })

            }


            SampleObject.ERP_SampleDet = erp_sampledet;



            console.log(SampleObject);

            var jsonstring = JSON.stringify(SampleObject);

            let GenericModeldata = {
                ScreenID: "Sample_101",
                Operation: "A",  // Use Update for existing records, Add for new ones
                ModelData: jsonstring
            };


            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                if (response.ValidationInput == 1) {
                    window.location.href = 'SampleIndex?auth=' + AuthToken;
                }
                else {
                    enableSaveAndStop();
                }

            });



        }

    }
    else {
        enableSaveAndStop();
    }


}


function SetZero(ctrl) {
    let val = parseFloat(ctrl.value);
    console.log(`Input value: ${val}`);

    if (isNaN(val) || val < 0) {
        ctrl.value = '';
        return;
    }

    const decimalPart = ctrl.value.split('.')[1];
    const decimalPart1 = ctrl.value.split('.')[0];

    if (decimalPart1.length > 9) {
        FailToaster('Number should be maximum of 9 digits!');
        ctrl.value = decimalPart1.substring(0, 9);  // Keep first 8 digits only
        return -1;
    }


    if (decimalPart && decimalPart.length > 2) {
        // Floor to 2 decimal places
        val = Math.floor(val * 100) / 100;
        ctrl.value = val.toString();
    }
}

function RedirectToSampleIndex() {
    window.location.href = 'SampleIndex?auth=' + AuthToken;
}

function showBrandType() {

    var model =
    {
        Id: $('#ddlCustomer').val() == 'Select' ? -1 : $('#ddlCustomer').val(),
        Type: 2
    };


    $('#viewAddress').hide();

    if (Edit_ID == 0) {

        $('#handover').prop('checked', false).trigger('change');
    }

    

    if ($('#ddlCustomer').val() == 'Select') {

        var obj1 = {
            parentId: -1,
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 6,
            manualTableId: 0,
            ScreenId: 'Sample_101'
        }
        LoadMasterDropdown('ddlAddress', obj1, 'Select', false, '');

        $('#ddlAddress').val('Select').trigger('change');

        $('#viewAddress').hide();

      
    }
    else {

        var obj1 = {
            parentId: $('#ddlCustomer').val(),
            masterTableTypeId: 0,
            isMasterTableType: false,
            isManualTable: true,
            manualTable: 6,
            manualTableId: 0,
            ScreenId: 'Sample_101'
        }
        LoadMasterDropdown('ddlAddress', obj1, 'Select', false, 0);

  
        $('#viewAddress').show();
    }


    if (isDuplicate != 1) {
        const jsonString = JSON.stringify(model);
        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'Sample_101' }, 'GET', function (response) {
            if (response.data.data.Table) {
                $('#ddlBrand').val(response.data.data.Table[0].BrandType).trigger('change');
            }
            else {
                $('#ddlBrand').val('Select').trigger('change');
            }

            console.log(response);
        });
    }

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

// Function to download the file

function downloadTaskFile(filePath, actualFileName) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = actualFileName; // Let the browser decide the file name or specify one
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//#region : Bind Technical document step 2 attachment

let tblData = []; // Load via API as you already do
var techDocId = 0;
function bindTechnicalDocDetById() {
    if (View_Id > 0) {
        var model = {
            ID: View_Id,
            Doc: 'Sample Doc'
        };

        const jsonString = JSON.stringify(model);
         
        const previewContainer = document.getElementById("downloadDocStep2");
        if (previewContainer) previewContainer.innerHTML = '';

        CommonAjaxMethod(
            virtualPath + 'Generic/GetRecordsAsync',
            { modelData: jsonString, screenId: 'TechnicalDoc_101' },
            'GET',
            function (response) {
                let foundTechDocId = 0;

                $('#remarks2').html(response.data.data.Table ? response.data.data.Table[0].T_Remarks : ``);
                // Step 2 Attachment
                for (var i = 0; i < response.data.data.Table.length; i++) {
                    var file = response.data.data.Table[i];
                    var attachmentType = file.AttachmentType;

                    if (attachmentType === 'Step2') {
                        techDocId = file.TableId; // global var
                        foundTechDocId = file.TableId; // scoped var for closure
                        LoadFileData2(
                            file.ActualFileName,
                            file.FileType,
                            file.Type,
                            file.FileUrl,
                            file.AttachmentId,
                            file.FileSize,
                            file.NewFileName
                        );
                        $('#NoUploadFile2').hide();
                        $('#ShowUploadFile2').show();
                    }
                }
               
                //  Now wait for task data to load, then show it
                loadTechDocByTask(2, function () {
                    //  double-check tblData contains item before showing
                    const match = tblData.find(x => x.ID === foundTechDocId);
                    if (match) {
                        showTechDocData(foundTechDocId);
                        $('#downloadTechnicalDocStep2').modal('show');
                    } else {
                        FailToaster("Technical Document was not saved for this Sample");
                    }
                });
            }
        );
    }
}


// Preview the file based on its type

function LoadFileData2(fileName, fileType, type, fileUrl, fFd, sSize, newfileName) {
    let previewElement;

    if (fileType === "image") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/image-icon.svg" alt="${fileName}" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile2(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (fileType === "application" && type === "application/pdf") {
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/pdf-icon.svg" alt="PDF Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile2(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
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
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile2(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word files: Show Word icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/doc-icon.svg" alt="Word Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile2(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // For Excel files: Show Excel icon
        previewElement = `<div class="file-preview">
                    <div class="flexline">
                        <img src="../../assets/images/icons/help/preview-icon/xlsx-icon.svg" alt="Excel Icon" class="preview-image" />
                        <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile2(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                    </div>
                    <p>${fileName}</p>
                </div>`;
    } else {
        previewElement = `<div class="file-preview">
         <img src="../../assets/images/icons/help/preview-icon/other-icon.svg" alt="Excel Icon" class="preview-image" />
                    <p class="preview-text"> ${fileName}</p>
                    <button class="delete-document" data-toggle="tooltip" id="${fileUrl + "||" + fFd + "||" + fileName}" onclick="DownloadItemFile2(this)"  title="Download"><img src="../../assets/images/icons/help/download-icon.png" alt=""></button>
                </div>`;
    }

    const newDocument = document.createElement("div");
    newDocument.classList.add("document-file2", "document-file");
    newDocument.innerHTML = previewElement;
    // documentImages.appendChild(newDocument);
    document.getElementById("downloadDocStep2").appendChild(newDocument);
}

function DownloadItemFile2(ctr) {
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

function loadTechDocByTask(taskNo, callback) {
    var requestData = {
        start: 0,
        length: 20000000,
        search: '',
        orderColumn: null,
        orderDir: "asc",
        screenId: 'TechnicalDoc_102',
        modelData: JSON.stringify({
            TaskNo: taskNo,
            Type: taskNo == 2 ? 4 : 0
        })
    };

    CommonAjaxMethod(
        virtualPath + 'Generic/GetPagingRecordsAgGridAsync',
        requestData,
        'GET',
        function (response) {
            tblData = response.data.Records;
            if (typeof callback === 'function') {
                callback(); // 🔁 only run next step when data is ready
            }
        }
    );
}

function showTechDocData(id) {

    Edit_Id = id;

    var data = tblData.find(input => input.ID == id);
    console.log(data);
    if (!data) return;

    var TaskNo = 1;
    $('#view_doc').html(data.TypeOfDoc);

    if (data.SampleType == 'Oil') {
        $('#fragView').hide();
        $('#colorView').hide();
        $('#packegingView').hide();
        $('#viewReq').hide();
        $('#viewMust').hide();
        $('#viewMustNot').hide();
    }
    else {
        $('#fragView').show();
        $('#colorView').show();
        $('#packegingView').show();
        $('#viewReq').show();
        $('#viewMust').show();
        $('#viewMustNot').show();
    }


    $('#txtItem').text(data.ItemName || '');
    $('#txtFormCate').text(data.FormCate || '');
    $('#txtFragrance').text(data.Fragrance || '');
    $('#txtColour').text(data.Color || '');
    $('#txtPackegingType').text(data.PackegingType || '');
    $('#txtTargetPrice').text(data.TargetPrice !== null ? `₹ ${data.TargetPrice}` : '');
    $('#requirements').text(data.Requirements || '');
    $('#mustIngredients').text(data.MustIngredients || '');
    $('#mustnotingredients').text(data.MustNotIngredients || '');

    if (data.FileURL.length <= 1) {
        $('#viewAtt').hide()
    }
    else {
        $('#item_att').attr('href', '#');
        $('#item_att').html();

        $('#item_att').on('click', function () {
            handleTaskFile(data.FileURL, data.ActualFileName)
        })


        $('#item_att').html(data.ActualFileName);
        $('#viewAtt').show();
    }

    if (data.FileURL.length <= 1) {
        $('#viewAtt1').hide()
    }
    else {
        $('#item_att1').attr('href', '#');

        $('#item_att1').on('click', function () {
            handleTaskFile(data.FileURL, data.ActualFileName)
        })

        $('#item_att1').html(data.ActualFileName);
        $('#viewAtt1').show()
    }

}

//#endregion


function enableSaveAndStop() {
    $('#btnSave').prop('disabled', false);
    return;
}