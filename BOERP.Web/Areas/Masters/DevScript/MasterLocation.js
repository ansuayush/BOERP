

function CreateLocation() {
    $('#addlocation').on('shown.bs.modal', function () {
        $("#ddlStates").select2({
            dropdownParent: $("#addlocation")
        });
    });
    $('#txtLocationCode').val('');
    $('#txtLocationName').val('');
    $('#txtLocationAddress').val('');
    $('#ddlCity').val('');
    $('#ddlStates').val('');
    $('#ddlCountry').val('');
    $('#txtPinecode').val('');

    //LoadMasterDropdown('ddlCountry', {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 63,
    //    manualTableId: 0,
    //    ScreenId: "DropdownList_101"
    //}, 'Select', false);
    //LoadMasterDropdown('ddlStates', {
    //    parentId: 0,
    //    masterTableTypeId: 0,
    //    isMasterTableType: false,
    //    isManualTable: true,
    //    manualTable: 64,
    //    manualTableId: 0,
    //    ScreenId: "DropdownList_101"
    //}, 'Select', false);
    /* $('#ddlCountry').val(213).trigger('change');*/
    
    BindCountryStateDropdowns('ddlCountryL', 0, 'ddlStates', 0);

    $("#ddlCountry").prop("disabled", false);
    $("#addlocation").modal('show');

}

function SaveLocation() {
    var valid = true;
    if (checkValidationOnSubmit('MandatoryLocation') == false) {
        valid = false;
    }

    if (valid == true) {
        var modelLocation = {
            ID: 0,
            LocationCode: $('#txtLocationCode').val(),
            LocationName: $('#txtLocationName').val(),
            Address: $('#txtLocationAddress').val(),
            CityID: 0,
            CityName: $("#txtCity").val(),
            StateID: $('#ddlStates').val(),
            StateName: $("#ddlStates option:selected").text(),
            CountryID: $('#ddlCountryL').val(),
            CountryName: $("#ddlCountryL option:selected").text(),
            PinCode: $("#txtPinecode").val()
        }
        const jsonStringLocation = JSON.stringify(modelLocation);
        let GenericModeldataLocation =
        {
            ScreenID: "Location_101",
            Operation: "A",
            ModelData: jsonStringLocation
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldataLocation, 'POST', function (response) {
            $("#addlocation").modal('hide');
            CommonGetAllType("LOCATION");
        });
    }
}



function BindCountryStateDropdowns(element, countryId, stElement, StateId) {
    var model =
    {
        ID: 63,
        ParentId: countryId
    };
    const jsonString = JSON.stringify(model);
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'CountryState' }, 'GET', function (response) {

        var default_cid_obj = response.data.data.Table.filter(input => input.ValueName == 'India');

        var default_cid = default_cid_obj ? default_cid_obj[0].ID : 'Select';

        var $ele = $('#' + element);
        $ele.empty();
        $ele.append($('<option/>').val('Select').text('Select'));
        $.each(response.data.data.Table, function (ii, vall) {
            $ele.append($('<option/>').val(vall.ID).text(vall.ValueName));
        })
        var ddlselectValue = countryId == undefined ? "" : countryId;
        if (ddlselectValue != "") {
            $ele.val(countryId);
        }
        else {
            $ele.val(default_cid);
            countryId = default_cid;
        }

        var model =
        {
            ID: 64,
            ParentId: countryId
        };
        const jsonString = JSON.stringify(model);

        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: 'CountryState' }, 'GET', function (response) {

            var $ele = $('#' + stElement);
            $ele.empty();
            $ele.append($('<option/>').val('Select').text('Select'));
            $.each(response.data.data.Table, function (ii, vall) {
                $ele.append($('<option/>').val(vall.ID).text(vall.ValueName));
            })
            var ddlselectValue = StateId == undefined ? "" : StateId;
            if (ddlselectValue != "")
                $ele.val(StateId);
            else
                $ele.val('Select');
        });

    });

}


function UpdateLocation() {
    var valid = true;
    if (checkValidationOnSubmit('MandatoryEditLocation') == false) {
        valid = false;
    }

    if (valid == true) {
        var modelLocation = {
            ID: $('#hddEditLocationRowId').val(),
            LocationCode: $('#txtEditLocationCode').val(),
            LocationName: $('#txtEditLocationName').val(),
            Address: $('#txtEditLocationAddress').val(),
            CityID: 0,
            CityName: $("#txtEditCity").val(),
            StateID: $('#ddlEditStates').val(),
            StateName: $("#ddlEditStates option:selected").text(),
            CountryID: $('#ddlEditCountryL').val(),
            CountryName: $("#ddlEditCountryL option:selected").text(),
            PinCode: $("#txtEditPinecode").val()
        }
        const jsonStringLocation = JSON.stringify(modelLocation);
        let GenericModeldataLocation =
        {
            ScreenID: "Location_101",
            Operation: "A",
            ModelData: jsonStringLocation
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldataLocation, 'POST', function (response) {
            $("#editlocation").modal('hide');
            CommonGetAllType("LOCATION");
        });
    }
}

function RenderLocationItems(data) {
    $("#searchLocationList").empty(); // Clear existing items
    if (data.length > 0) {
        data.forEach((item) => {
            var listItem = `
		            <li class="item">
					 <div class="d-flex justify-content-between" style="width:100%">
			            <span>${item.LocationName}</span>
			           <div class="right">
								  <div class="td-action-btn item-gap-btn">
									<a href="#" class="btnEdit" id="btnEdit1" onclick="RowEditLocation(${item.LocationID})" data-toggle="tooltip" title="Edit">
									  <img src="../../assets/images/icons/help/edit-icon.svg" alt="Edit">
									</a>
									<a href="#" id="btnView1" onclick="RowViewLocation(${item.LocationID})" data-toggle="tooltip" title="View">
									  <img src="../../assets/images/icons/help/view-icon.svg" alt="View">
									</a>
                                    <div class="toggledgn btnDelete1">
                                    <input type="checkbox" onclick="RowDeleteLocation(${item.LocationID},'${item.LocationName}')" class="checkbox toggle-switch" ${item.IsDeleted != 1 ? 'checked' : ''}  id="activelc_${item.LocationID}">
                                    <label for="activelc_${item.LocationID}" class="checkbox-label" data-toggle="modal" ${item.IsDeleted ? `data-target="#confirmationdeactivate"` : `data-target="#deleteCommonType"`}>
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
            $("#searchLocationList").append(listItem);
            $("#searchLocationList .btnEdit1").css('display', 'block'); // Hides only the most recently added .btnEdit
            $("#searchLocationList .btnDelete1").css('display', 'block');
        });
      
        $('[data-toggle="tooltip"]').tooltip();

        $("#searchInput1").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $(".location-list li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        });
    }
}
function RowEditLocation(rowId) {
    $('#hddEditLocationRowId').val(rowId);
    //BindDDLLocationCountry('1');
    //BindDDLLocationStates('1');
    var model172 = {
        ID: rowId,
        Type: 'Location'
    }
    const jsonString172 = JSON.stringify(model172);
    var ScreenID172 = "Location_101";

    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString172, screenId: ScreenID172 }, 'GET', function (response) {
        var data = response.data.data.Table;
        $('#txtEditLocationCode').val(response.data.data.Table[0].LocationCode);
        $('#txtEditLocationName').val(response.data.data.Table[0].LocationName);
        $('#txtEditLocationAddress').val(response.data.data.Table[0].Address);
        $('#txtEditCity').val(response.data.data.Table[0].CityName);
        $('#ddlEditCountry').val(response.data.data.Table[0].CountryID).trigger('change');
        $('#ddlEditStates').val(response.data.data.Table[0].StateID).trigger('change');
        $('#txtEditPinecode').val(response.data.data.Table[0].PinCode);

        BindCountryStateDropdowns('ddlEditCountryL', response.data.data.Table[0].CountryID, 'ddlEditStates', response.data.data.Table[0].StateID);
    });
    $('#editlocation').on('shown.bs.modal', function () {
        $("#ddlEditStates").select2({
            dropdownParent: $("#editlocation")
        });
    });
    //$("#ddlEditCountry").prop("disabled", false);
    $("#editlocation").modal('show');
}
function RowViewLocation(rowId) {
    var model173 = {
        ID: rowId,
        Type: 'Location'
    }
    const jsonString173 = JSON.stringify(model173);
    var ScreenID173 = "Location_101";
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString173, screenId: ScreenID173 }, 'GET', function (response) {
        var data = response.data.data.Table;
        document.getElementById('txtViewLocationCode').innerText = response.data.data.Table[0].LocationCode;
        document.getElementById('txtViewLocationName').innerText = response.data.data.Table[0].LocationName;
        document.getElementById('txtViewLocationAddress').innerText = response.data.data.Table[0].Address;
        document.getElementById('txtViewCity').innerText = response.data.data.Table[0].CityName;
        document.getElementById('txtViewStates').innerText = response.data.data.Table[0].StateName;
        document.getElementById('txtViewCountry').innerText = response.data.data.Table[0].CountryName;
        document.getElementById('txtViewPinecode').innerText = response.data.data.Table[0].PinCode;
    });
    $("#viewlocation").modal('show');
}

function BindStateByCountryId(countrySelectId, stateSelectId) {
    const countryId = $(`#${countrySelectId}`).val();
    if (!countryId) return;

    LoadMasterDropdown(stateSelectId, {
        parentId: countryId,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 100,
        manualTableId: 0,
        ScreenId: 'DropdownList_101'
    }, 'Select', false, 0);

    // wait until options loaded
  
            // ensure UI updates (select2)
            $(`#${stateSelectId}`).trigger('change');
     
}

function RowDeleteLocation(rowId, locationName) {
    $('#hddEditLocationRowId').val(rowId)
    $('#hddEditRowId').val('');
    $('#hddEditWarehouseRowId').val('');
    $('#hddEditTransportationRowId').val('');
    $('#hddEditQCPparameterRowId').val('');
    document.getElementById('spDeleteMsg').innerText = locationName;
   // $("#deleteCommonType").modal('show');
}

function BuildManageLocationList(data) {
    $("#liManageLocationList").empty(); // Clear existing items
    if (data.length > 0) {
        data.forEach((item) => {
            const listItem = `
				<li class="item">
				<a href="#" id="btnManageLocationType" onclick="SingleManage(this)" ><span class="title-one">${item.LocationName}</span></a>
				</li>`;
            $("#liManageLocationList").append(listItem);
        });
    }
}

function BindDDLLocationCountry(SelectedValue) {
    LoadMasterDropdown('ddlEditCountry', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 63,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false,SelectedValue);
   
}
function BindDDLLocationStates(SelectedValue) {
    LoadMasterDropdown('ddlEditStates', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 64,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false, SelectedValue);
}