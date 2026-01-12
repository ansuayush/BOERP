$(document).ready(function () {
    // Common function to clear error messages
    function clearTransporterErrors(modalId, mandatoryClassPrefix, gstErrorId, gstMsgSpanId) {
        // Hide all error spans inside this modal
        $('#' + modalId + ' .field-validation-error').hide();

        // Optional: Clear text in error spans
        $('#' + gstErrorId).hide();
        $('#' + gstMsgSpanId).text('');

        // Optional: Remove error highlighting class if used
        $('#' + modalId + ' .' + mandatoryClassPrefix).removeClass('error');
    }

    // Clear on Add Transportation modal close
    $('#addtransportation').on('hidden.bs.modal', function () {
        clearTransporterErrors('addtransportation', 'MandatoryAddTransporter', 'gstError', 'spAddGTMNumberErrorMsg');
    });

    // Clear on Edit Transportation modal close
    $('#edittransportation').on('hidden.bs.modal', function () {
        clearTransporterErrors('edittransportation', 'MandatoryEditTransporter', 'gstError', 'spEditGTMNumberErrorMsg');
    });
});

function BuildManageTransportationDetailsList(data) {
    $("#liManageTransportationDetailsList").empty(); // Clear existing items
    if (data.length > 0) {
        data.forEach((item) => {
            const listItem = `
				<li class="item">
				<a href="#" id="btnManageTransportationDetails" onclick="SingleManage(this)" ><span class="title-one">${item.TransporteName}</span></a>
				</li>`;
            $("#liManageTransportationDetailsList").append(listItem);
        });
    }
}
function CreateTransportation() {
    $('#addtransportation').on('shown.bs.modal', function () {
        $("#ddlAddState").select2({
            dropdownParent: $("#addtransportation")
        });
    });

    $('#txtAddTransporterName').val('');
    $('#txtAddDisplayName').val('');
    $('#txtAddAddress').val('');
    $('#txtAddPinCode').val('');
    $('#txtAddCity').val('');
    $('#ddlAddState').val('');
    $('#ddlTransAddCountry').val('');
    $('#txtAddContactPerson').val('');
    $('#txtAddContactNumber').val('');
    $('#txtAddGSTNumber').val('');
    LoadMasterDropdown('ddlTransAddCountry', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 102,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false);
    LoadMasterDropdown('ddlAddState', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 64,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false);
    /* $('#ddlTransAddCountry').val(213).trigger('change');*/

    //setTimeout(function () {
    //    $('#ddlTransAddCountry').val($('#ddlTransAddCountry option').filter(function () {
    //        return $(this).text().trim() === 'India';
    //    }).val()).trigger('change');
    //}, 200); // Adjust timing as needed

    //$("#ddlTransAddCountry").prop("disabled", false);
    $('#ddlTransAddCountry').val(213);
    $("#addtransportation").modal('show');

    $('#ddlAddState').on('change', function () {
        getCountryOfStateOnChangeB();
    })

 
}


function getCountryOfStateOnChangeB() {

    var id = $('#ddlAddState').val();



            var model =
            {
                ID: id,
                OtherId: 0,
                ModuleId: 3
            };
            const jsonString = JSON.stringify(model);
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {

                var table = response.data.data.Table;

                $('#ddlTransAddCountry').val(table[0].Depend_On).trigger('change');;
            });

}

function getCountryOfStateOnChangeS() {

    var id = $('#ddlTransEditState').val();



    var model =
    {
        ID: id,
        OtherId: 0,
        ModuleId: 3
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'DocSeries_101' }, 'GET', function (response) {

        var table = response.data.data.Table;

        $('#ddlTransEditCountry').val(table[0].Depend_On).trigger('change');;
    });

}
function SaveTransporter() {
    if (document.getElementById('spAddGTMNumberErrorMsg').innerText == '') {
        var valid = true;
        if (checkValidationOnSubmit('MandatoryAddTransporter') == false) {
            valid = false;
        }
        if (valid == true) {
            var model213 = {
                ID: 0,
                TransporteName: $('#txtAddTransporterName').val(),
                DispalyName: $('#txtAddDisplayName').val(),
                Address: $('#txtAddAddress').val(),
                PinCode: $('#txtAddPinCode').val(),
                CountryID: $('#ddlTransAddCountry').val(),
                StateID: $('#ddlAddState').val(),
                City: $('#txtAddCity').val(),
                GSTNumber: $('#txtAddGSTNumber').val(),
                ContactPerson: $('#txtAddContactPerson').val(),
                ContactNumber: $('#txtAddContactNumber').val(),
                FinID: 0,
                isdeleted: 0,
                IPAddress: 1
            };
            const jsonString213 = JSON.stringify(model213);
            let GenericModeldata213 =
            {
                ScreenID: "Trans_101",
                Operation: "A",
                ModelData: jsonString213
            };
            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata213, 'POST', function (response) {
                $("#addtransportation").modal('hide');

                //After add type need to refresh list.
                CommonGetAllType('TRANSPORTATION');

            });
           
        }
    }
}
function UpdateTransporter() {
    if (document.getElementById('spEditGTMNumberErrorMsg').innerText == '') {
        var valid = true;
        if (checkValidationOnSubmit('MandatoryEditTransporter') == false) {
            valid = false;
        }
        if (valid == true) {
            var model215 = {
                ID: $('#hddEditTransportationRowId').val(),
                TransporteName: $('#txtEditTransporterName').val(),
                DispalyName: $('#txtEditDisplayName').val(),
                Address: $('#txtEditAddress').val(),
                PinCode: $('#txtEditPinCode').val(),
                StateID: $('#ddlTransEditState').val(),
                CountryID: $('#ddlTransEditCountry').val(),
                City: $('#txtTransEditCity').val(),
                GSTNumber: $('#txtEditGSTNumber').val(),
                ContactPerson: $('#txtEditContactPerson').val(),
                ContactNumber: $('#txtEditContactNumber').val(),
                FinID: 0,
                isdeleted: 0,
                IPAddress: 1
            };
            const jsonString215 = JSON.stringify(model215);
            let GenericModeldata215 =
            {
                ScreenID: "Trans_101",
                Operation: "U",
                ModelData: jsonString215
            };
            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata215, 'POST', function (response) {
                $("#edittransportation").modal('hide');
            });
            //After add type need to refresh list.
            CommonGetAllType('TRANSPORTATION');
        }
    }
}
function RenderTransportationItems(data) {
    $("#searchTransportationList").empty(); // Clear existing items
    if (data.length > 0) {
        data.forEach((item) => {
            var listItem = `
		            <li class="item">
					 <div class="d-flex justify-content-between" style="width:100%">
			            <span>${item.TransporteName}</span>
			           <div class="right">
								  <div class="td-action-btn item-gap-btn">
									<a href="#" class="btnEdit" id="btnEdit1" onclick="RowEditTransportation(${item.ID})" data-toggle="tooltip" title="Edit">
									  <img src="../../assets/images/icons/help/edit-icon.svg" alt="Edit">
									</a>
									<a href="#" id="btnView1" onclick="RowViewTransportation(${item.ID})" data-toggle="tooltip" title="View">
									  <img src="../../assets/images/icons/help/view-icon.svg" alt="View">
									</a>
                                    <div class="toggledgn btnDelete1">
                                    <input type="checkbox" onclick="RowDeleteTransportation(${item.ID},'${item.TransporteName}')" class="checkbox toggle-switch" ${item.isdeleted != 1 ? 'checked' : ''}  id="activetc_${item.ID}">
                                    <label for="activetc_${item.ID}" class="checkbox-label" data-toggle="modal" ${item.isdeleted ? `data-target="#confirmationdeactivate"` : `data-target="#deleteCommonType"`}>
                                    <img src="../../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                    <img src="../../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                    <span class="ball"></span>
                                    </label>
                                </div>
								  </div>
								</div>
								</div>
		            </li>
                            `;
            $("#searchTransportationList").append(listItem);
            $("#searchTransportationList .btnEdit1").css('display', 'block'); // Hides only the most recently added .btnEdit
            $("#searchTransportationList .btnDelete1").css('display', 'block');
        });

        $('[data-toggle="tooltip"]').tooltip();

        $("#searchInput2").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $(".transportation-list li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        });
    }
}
function RowEditTransportation(rowId) {
    $('#hddEditTransportationRowId').val(rowId);
  
    var model216 = {
        ID: rowId,
        Type: 'ERPTransporter'
    }
    const jsonString216 = JSON.stringify(model216);
    var ScreenID216 = "Trans_101";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString216, screenId: ScreenID216 }, 'GET', function (response) {
        var data = response.data.data.Table;
        $('#txtEditTransporterName').val(response.data.data.Table[0].TransporteName);
        $('#txtEditDisplayName').val(response.data.data.Table[0].DispalyName);
        $('#txtEditAddress').val(response.data.data.Table[0].Address);
        $('#txtEditPinCode').val(response.data.data.Table[0].PinCode);
        $('#txtTransEditCity').val(response.data.data.Table[0].City);
        $('#ddlTransEditState').val(response.data.data.Table[0].StateID).trigger('change');
        $('#ddlTransEditCountry').val(response.data.data.Table[0].CountryID).trigger('change');
        $('#txtEditPinecode').val(response.data.data.Table[0].PinCode);
        $('#txtEditContactPerson').val(response.data.data.Table[0].ContactPerson); 
        $('#txtEditContactNumber').val(response.data.data.Table[0].ContactNumber); 
        $('#txtEditGSTNumber').val(response.data.data.Table[0].GSTNumber); 
    });
    $('#edittransportation').on('shown.bs.modal', function () {
        $("#ddlTransEditState").select2({
            dropdownParent: $("#edittransportation")
        });
    });
    $("#ddlTransEditCountry").prop("disabled", false);
    $("#edittransportation").modal('show');
}
function RowViewTransportation(rowId) {
    $('#hddEditTransportationRowId').val(rowId);
    LoadMasterDropdown('ddlTransViewCountry', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 63,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false);
    LoadMasterDropdown('ddlTransViewState', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 64,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false);
    var model217 = {
        ID: rowId,
        Type: 'ERPTransporter'
    }
    const jsonString217 = JSON.stringify(model217);
    var ScreenID217 = "Trans_101";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString217, screenId: ScreenID217 }, 'GET', function (response) {
        var data = response.data.data.Table;
        document.getElementById('txtViewTransTransporterName').innerText = response.data.data.Table[0].TransporteName;
        document.getElementById('txtViewTransDisplayName').innerText =response.data.data.Table[0].DispalyName;
        document.getElementById('txtViewTransAddress').innerText =response.data.data.Table[0].Address;
        document.getElementById('txtViewTransPinCode').innerText =response.data.data.Table[0].PinCode;
        document.getElementById('txtViewTransCity').innerText =response.data.data.Table[0].City;
        //$('#ddlTransViewState').val(response.data.data.Table[0].StateID).trigger('change');
        //$('#ddlTransViewCountry').val(response.data.data.Table[0].CountryID).trigger('change');
        document.getElementById('txtViewTransGSTNumber').innerText =response.data.data.Table[0].GSTNumber;
        document.getElementById('txtViewTransContactPerson').innerText =response.data.data.Table[0].ContactPerson;
        document.getElementById('txtViewTransContactNumber').innerText = response.data.data.Table[0].ContactNumber;

        setTimeout(function () {
            $('#ddlTransViewState').val(response.data.data.Table[0].StateID).trigger('change');
            $('#ddlTransViewCountry').val(response.data.data.Table[0].CountryID).trigger('change');
            $("#ddlTransViewState").prop("disabled", true);
            $("#ddlTransViewCountry").prop("disabled", true);
        }, 200); // Adjust timing as needed


        //$("#ddlTransViewState").prop("disabled", true);
        //$("#ddlTransViewCountry").prop("disabled", true);

        // Disable Enter key
        $(document).on('keydown.disableEnter', function (e) {
            if (e.key === "Enter" || e.keyCode === 13) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });

        $("#viewtransportation").modal('show');
    });
}
function RowDeleteTransportation(rowId, TransporteName) {
    $('#hddEditLocationRowId').val('');
    $('#hddEditRowId').val('');
    $('#hddEditWarehouseRowId').val('');
    $('#hddEditQCPparameterRowId').val('');
    $('#hddEditTransportationRowId').val(rowId);
    document.getElementById('spDeleteMsg').innerText = TransporteName;
    //$("#deleteCommonType").modal('show');
}
function CopyTransporterName() {
    $('#txtAddDisplayName').val($('#txtAddTransporterName').val().trim());
    if ($('#txtAddTransporterName').val().trim()) {
        $('#sptxtAddDisplayName').hide();
    }
}

function CopyEditTransporterName() {
    $('#txtEditDisplayName').val($('#txtEditTransporterName').val().trim());
    if ($('#txtEditTransporterName').val().trim()) {
        $('#sptxtEditDisplayName').hide();
    }
}

