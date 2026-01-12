function CreateWarehouse() {
    $('#addwarehouse').on('shown.bs.modal', function () {
        $("#ddlWarehouseLocation").select2({
            dropdownParent: $("#addwarehouse")
        });
        $("#ddlWarehouseBranchs").select2({
            dropdownParent: $("#addwarehouse")
        });
    });
    $('#txtWarehouseName').val('');
    $('#txtUniqueID').val('');
    $('#ddlWarehouseLocation').val('').trigger('change');
    $('#ddlWarehouseBranchs').val(0).trigger('change');

    LoadMasterDropdown('ddlWarehouseLocation', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 75,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false);

    LoadMasterDropdown1('ddlWarehouseBranchs', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 76,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', true);

    LoadMasterDropdown1('ddlWHCategory', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 69,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', true);

    //$('#ddlCountry').val(213).trigger('change');
    //$("#ddlCountry").prop("disabled", true);
    $("#addwarehouse").modal('show');
}
function BuildManageWarehouseList(data) {
    $("#liManageWarehouseList").empty(); // Clear existing items
    if (data.length > 0) {
        data.forEach((item) => {
            const listItem = `
				<li class="item">
				<a href="#" id="btnManageWarehouse" onclick="SingleManage(this)" ><span class="title-one">${item.WarehouseName}</span></a>
				</li>`;
            $("#liManageWarehouseList").append(listItem);
        });
    }
}
function RenderWarehouseItems(data) {
    $("#searchWarehouseList").empty(); // Clear existing items
    if (data.length > 0) {
        data.forEach((item) => {
            var listItem = `
		            <li class="item">
					 <div class="d-flex justify-content-between" style="width:100%">
			            <span>${item.WarehouseName}</span>
			           <div class="right">
								  <div class="td-action-btn item-gap-btn">
									<a href="#" class="btnEdit" id="btnEdit1" onclick="RowEditWarehouse(${item.WarehouseID})" data-toggle="tooltip" title="Edit">
									  <img src="../../assets/images/icons/help/edit-icon.svg" alt="Edit">
									</a>
									<a href="#" id="btnView1" onclick="RowViewWarehouse(${item.WarehouseID})" data-toggle="tooltip" title="View">
									  <img src="../../assets/images/icons/help/view-icon.svg" alt="View">
									</a>
                                    <div class="toggledgn btnDelete1">
                                      <input type="checkbox" onclick="RowDeleteWarehouse(${item.WarehouseID},'${item.WarehouseName}')" class="checkbox toggle-switch" ${item.IsDeleted != 1 ? 'checked' : ''}  id="activeQm_${item.WarehouseID}">
                                      <label for="activeQm_${item.WarehouseID}" class="checkbox-label" data-toggle="modal" ${item.IsDeleted ? `data-target="#confirmationdeactivate"` : `data-target="#deleteCommonType"`}>
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
            $("#searchWarehouseList").append(listItem);
            $("#searchWarehouseList .btnEdit1").css('display', 'block'); // Hides only the most recently added .btnEdit
            $("#searchWarehouseList .btnDelete1").css('display', 'block');
        });

        $('[data-toggle="tooltip"]').tooltip();

        $("#txtSearchWarehouse").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $(".warehouse-list li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        });
    }
}
function RowEditWarehouse(rowId) {
    $('#editwarehouse').on('shown.bs.modal', function () {
        $("#ddlEditWarehouseLocation").select2({
            dropdownParent: $("#editwarehouse")
        });
        $("#ddlEditWarehouseBranchs").select2({
            dropdownParent: $("#editwarehouse")
        });
    });
    LoadMasterDropdown('ddlEditWarehouseLocation', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 75,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', false);
    LoadMasterDropdown1('ddlEditWarehouseBranchs', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 76,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', true);

    LoadMasterDropdown1('ddlEditWHCategory', {
        parentId: 0,
        masterTableTypeId: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 69,
        manualTableId: 0,
        ScreenId: "DropdownList_101"
    }, 'Select', true);

    $('#hddEditWarehouseRowId').val(rowId);

    var model179 = {
        ID: rowId,
        Type: 'Warehouse'
    }
    const jsonString179 = JSON.stringify(model179);
    var ScreenID179 = "Warehouse_101";
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString179, screenId: ScreenID179 }, 'GET', function (response) {
        var data = response.data.data.Table;
        $('#txtEditWarehouseName').val(response.data.data.Table[0].WarehouseName);
        $('#txtEditUniqueID').val(response.data.data.Table[0].UniqueID);
        $('#ddlEditWarehouseLocation').val(response.data.data.Table[0].LocationID).trigger('change');
        $('#ddlEditWarehouseBranchs').val(response.data.data.Table[0].BranchID).trigger('change');
        $('#ddlEditWHCategory').val(response.data.data.Table[0].Category).trigger('change');
        $('#txtEditWarehouseDescription').val(response.data.data.Table[0].CityName);
        $('#txtEditWarehouseAddress1').val(response.data.data.Table[0].Address);
        $('#txtEditWarehouseAddress2').val(response.data.data.Table[0].Address);
        //$('#txtEditWarehousePinCode').val(response.data.data.Table[0].PinCode);
        //$('#txtEditWarehouseCity').val(response.data.data.Table[0].CityName);
        //$('#txtEditWarehouseState').val(response.data.data.Table[0].StateName);
        //$('#txtEditWarehouseCountry').val(response.data.data.Table[0].CountryName);
        $('#txtEditWarehouseGSTNumber').val(response.data.data.Table[0].GSTNumber);

        if (response.data.data.Table[0].LocationIsDeleted == true) {
            $('#txtEditWarehouseCity').val('');
            $('#txtEditWarehouseState').val('');
            $('#txtEditWarehouseCountry').val('');            
        }
    });
    $("#editwarehouse").modal('show');
}
function RowViewWarehouse(rowId) {
    var model173 = {
        ID: rowId,
        Type: 'Warehouse'
    }
    const jsonString173 = JSON.stringify(model173);
    var ScreenID173 = "Warehouse_101";
    CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString173, screenId: ScreenID173 }, 'GET', function (response) {
        var data = response.data.data.Table;
        document.getElementById('txtViewWarehouseName').innerText = response.data.data.Table[0].WarehouseName;
        document.getElementById('txtViewUniqueID').innerText = response.data.data.Table[0].UniqueID;
        document.getElementById('txtViewWarehouseLocation').innerText = response.data.data.Table[0].LocationName;
        document.getElementById('txtViewWarehouseDescription').innerText = response.data.data.Table[0].CityName;
        document.getElementById('txtViewWarehouseAddress1').innerText = response.data.data.Table[0].StateName;
        document.getElementById('txtViewWarehouseAddress2').innerText = response.data.data.Table[0].CountryName;
        document.getElementById('txtViewWarehousePinCode').innerText = response.data.data.Table[0].PinCode;
        document.getElementById('txtViewWarehouseCity').innerText = response.data.data.Table[0].CityName;
        document.getElementById('txtViewWarehouseState').innerText = response.data.data.Table[0].StateName;
        document.getElementById('txtViewWarehouseCountry').innerText = response.data.data.Table[0].CountryName;
        document.getElementById('txtViewWarehouseGSTNumber').innerText = response.data.data.Table[0].GSTNumber;
        document.getElementById('txtViewWarehouseBranchName').innerText = response.data.data.Table[0].BranchName;
    });
    $("#viewwarehouse").modal('show'); 
}
function RowDeleteWarehouse(rowId, WarehouseName) {
    $('#hddEditWarehouseRowId').val(rowId)
    document.getElementById('spDeleteMsg').innerText = WarehouseName;
    $("#deleteCommonType").modal('show');
}
function WarehouseLocation() {
    var locationId = $('#ddlWarehouseLocation').val();
    if (locationId != '' && locationId != 'Select') {
        var model177 = {
            ID: locationId,
            Type: 'Location'
        }
        const jsonString177 = JSON.stringify(model177);
        var ScreenID177 = "Location_101";

        CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString177, screenId: ScreenID177 }, 'GET', function (response) {
            document.getElementById('txtWarehouseLocationAddress').innerText = response.data.data.Table[0].Address;
            document.getElementById('txtWarehouseLocationCity').innerText = response.data.data.Table[0].CityName;
            document.getElementById('txtWarehouseLocationState').innerText = response.data.data.Table[0].StateName;
            document.getElementById('txtWarehouseLocationCountry').innerText = response.data.data.Table[0].CountryName;
            document.getElementById('txtWarehouseLocationPinCode').innerText = response.data.data.Table[0].PinCode;
            document.getElementById('divWarehouseAddress').style.display = 'block';
        });
    }
    else {
        document.getElementById('txtWarehouseLocationAddress').innerText = '';
        document.getElementById('txtWarehouseLocationCity').innerText = '';
        document.getElementById('txtWarehouseLocationState').innerText = '';
        document.getElementById('txtWarehouseLocationCountry').innerText = '';
        document.getElementById('txtWarehouseLocationPinCode').innerText = '';
        document.getElementById('divWarehouseAddress').style.display = 'none';
    }
}
function WarehouseBranches() {
    var branchId = $('#ddlWarehouseBranchs').val();
    if (branchId != '' && branchId != '0') {
        document.getElementById('divWarehouseBranch').style.display = 'block';
        var gstNumber = $("#ddlWarehouseBranchs").find(":selected").data("ele");
        if (gstNumber == "/") {
            gstNumber = "";
        }
        $('#txtWarehouseGSTNumber').val(gstNumber);
    }
    else {       
        $('#txtWarehouseGSTNumber').val('');
        document.getElementById('divWarehouseBranch').style.display = 'none';
    }
}
function SaveWarehouse() {
    var valid = true;
    if (checkValidationOnSubmit('MandatoryWarehouse') == false) {
        valid = false;
    }

    if (valid == true) {
        var modelLocation = {
            ID: 0,
            UniqueID: $('#txtUniqueID').val(),
            WarehouseName: $('#txtWarehouseName').val(),
            LocationID: $('#ddlWarehouseLocation').val(),
            BranchID: $("#ddlWarehouseBranchs").val() == 'Select' ? '0' : $("#ddlWarehouseBranchs").val(),
            Category: $("#ddlWHCategory").val() == 'Select' ? '0' : $("#ddlWHCategory").val(),
            BranchName: $("#ddlWarehouseBranchs").val() =='Select'? '': $("#ddlWarehouseBranchs option:selected").text(),
            GSTNumber: $('#txtWarehouseGSTNumber').val()
        }
        const jsonStringLocation = JSON.stringify(modelLocation);
        let GenericModeldataLocation =
        {
            ScreenID: "Warehouse_101",
            Operation: "A",
            ModelData: jsonStringLocation
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldataLocation, 'POST', function (response) {
            $("#addwarehouse").modal('hide');
            CommonGetAllType("WAREHOUSE");
        });
    }
}
function UpdateWarehouse() {
    var valid = true;
    if (checkValidationOnSubmit('MandatoryEditWarehouse') == false) {
        valid = false;
    }

    if (valid == true) {
        var modelLocation = {
            ID: $('#hddEditWarehouseRowId').val(),
            UniqueID: $('#txtEditUniqueID').val(),
            WarehouseName: $('#txtEditWarehouseName').val(),
            LocationID: $('#ddlEditWarehouseLocation').val(),
            BranchID: $("#ddlEditWarehouseBranchs").val() == 'Select' ? '0' : $("#ddlEditWarehouseBranchs").val(),
            Category: $("#ddlEditWHCategory").val() == 'Select' ? '0' : $("#ddlEditWHCategory").val(),
            BranchName: $("#ddlEditWarehouseBranchs").val() == 'Select' ? '' : $("#ddlEditWarehouseBranchs option:selected").text(),
            GSTNumber: $('#txtEditWarehouseGSTNumber').val()
        }
        const jsonStringLocation = JSON.stringify(modelLocation);
        let GenericModeldataLocation =
        {
            ScreenID: "Warehouse_101",
            Operation: "U",
            ModelData: jsonStringLocation
        };
        CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldataLocation, 'POST', function (response) {
            $("#editwarehouse").modal('hide');
            CommonGetAllType("WAREHOUSE");
        });
    }
}
function EditWarehouseLocation() {
    
    var locationId = $('#ddlEditWarehouseLocation').val();
    if (locationId != null) {
        if (locationId != '' && locationId != 'Select') {
            var model178 = {
                ID: locationId,
                Type: 'Location'
            }
            const jsonString178 = JSON.stringify(model178);
            var ScreenID178 = "Location_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString178, screenId: ScreenID178 }, 'GET', function (response) {
                document.getElementById('txtEditWarehouseLocationAddress').innerText = response.data.data.Table[0].Address;
                document.getElementById('txtEditWarehouseLocationCity').innerText = response.data.data.Table[0].CityName;
                document.getElementById('txtEditWarehouseLocationState').innerText = response.data.data.Table[0].StateName;
                document.getElementById('txtEditWarehouseLocationCountry').innerText = response.data.data.Table[0].CountryName;
                document.getElementById('txtEditWarehouseLocationPinCode').innerText = response.data.data.Table[0].PinCode;
                document.getElementById('divEditWarehouseAddress').style.display = 'block';
            });
        }
        else {
            document.getElementById('txtEditWarehouseLocationAddress').innerText = '';
            document.getElementById('txtEditWarehouseLocationCity').innerText = '';
            document.getElementById('txtEditWarehouseLocationState').innerText = '';
            document.getElementById('txtEditWarehouseLocationCountry').innerText = '';
            document.getElementById('txtEditWarehouseLocationPinCode').innerText = '';
            document.getElementById('divEditWarehouseAddress').style.display = 'none';
        }
    }
    else {
        document.getElementById('txtEditWarehouseLocationAddress').innerText = '';
        document.getElementById('txtEditWarehouseLocationCity').innerText = '';
        document.getElementById('txtEditWarehouseLocationState').innerText = '';
        document.getElementById('txtEditWarehouseLocationCountry').innerText = '';
        document.getElementById('txtEditWarehouseLocationPinCode').innerText = '';
        document.getElementById('divEditWarehouseAddress').style.display = 'none';
    }
}
function EditWarehouseBranches() {
    var branchId = $('#ddlEditWarehouseBranchs').val();
    if (branchId != '' && branchId != '0') {
        document.getElementById('divEditWarehouseBranch').style.display = 'block';
        var gstNumber = $("#ddlEditWarehouseBranchs").find(":selected").data("ele");
        if (gstNumber == "/") {
            gstNumber = "";
        }
        $('#txtEditWarehouseGSTNumber').val(gstNumber);
    }
    else {
        //$('#txtEditWarehouseGSTNumber').val('');
        document.getElementById('divEditWarehouseBranch').style.display = 'none';
    }
}
