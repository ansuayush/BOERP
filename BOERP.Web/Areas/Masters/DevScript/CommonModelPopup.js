function allowOnlyIntegers(e) {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 5);
}
function allowAlphanumeric(e) {
    this.value = this.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 50);
}

function CommonOperations(ctrl) {
    var ctrlId = ctrl.id;
    $('#searchInput').val('');
    $('#searchInput1').val('');
    $('#searchInput2').val('');
    $('#searchInput9').val('');
    switch (ctrlId) {
        case "btnManageBrandType":
            tabName = "ManageBrandType";
            var model = {
                ID: 0,
                TABLE_NAME: 'ERPBRAND'
            }
            const jsonString = JSON.stringify(model);
            var ScreenID = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'block'
            const openModal = document.getElementById("btnOpenModal");
            const openModalEditType = document.getElementById("btnEdit");
            const openModalView = document.getElementById("btnView");
            const openModalDelete = document.getElementById("btnDelete");
            const addTypeBackArrow = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Manage Brand Type';
            document.getElementById('spCreateName').innerText = 'Create New Brand Type';

            editTypeBackArrow.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Principle Brand Type';
                document.getElementById('spAddBodylabel').innerText = 'Brand Type';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Principle Brand Type';
                document.getElementById('spEditBodylabel').innerText = 'Brand Type';
                document.getElementById('spViewHeaderlabel').innerText = 'Brand Type';
                document.getElementById('spViewBodylabel').innerText = 'Brand Type';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageLeadSource":
            tabName = "ManageLeadSource";
            var model = {
                ID: 0,
                TABLE_NAME: 'ERPLEADSOURCE'
            }
            const jsonString1 = JSON.stringify(model);
            var ScreenID = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString1, screenId: ScreenID }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'block'
            const openModal1 = document.getElementById("btnOpenModal");
            const openModalEditType1 = document.getElementById("btnEdit");
            const openModalView1 = document.getElementById("btnView");
            const openModalDelete1 = document.getElementById("btnDelete");
            const addTypeBackArrow1 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow1 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button2
            document.getElementById('spHeaderName').innerText = 'Manage Lead Source';
            document.getElementById('spCreateName').innerText = ' Create New Lead Source';
            editTypeBackArrow1.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow1.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal1.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Lead Source';
                document.getElementById('spAddBodylabel').innerText = 'Lead Source';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Lead Source';
                document.getElementById('spEditBodylabel').innerText = 'Lead Source';
                document.getElementById('spViewHeaderlabel').innerText = 'Lead Source';
                document.getElementById('spViewBodylabel').innerText = 'Lead Source';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageDepartmentType":
            tabName = "ManageDepartmentType";
            var model107 = {
                ID: 0,
                TABLE_NAME: 'ERPDEPT'
            }
            const jsonString107 = JSON.stringify(model107);
            var ScreenID107 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString107, screenId: ScreenID107 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'block'
            const openModal107 = document.getElementById("btnOpenModal");
            const openModalEditType107 = document.getElementById("btnEdit");
            const openModalView107 = document.getElementById("btnView");
            const openModalDelete107 = document.getElementById("btnDelete");
            const addTypeBackArrow107 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow107 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Manage Department';
            document.getElementById('spCreateName').innerText = 'Create New Department';

            editTypeBackArrow107.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow107.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal107.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Department';
                document.getElementById('spAddBodylabel').innerText = 'Department Name';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Department';
                document.getElementById('spEditBodylabel').innerText = 'Department';
                document.getElementById('spViewHeaderlabel').innerText = 'Department';
                document.getElementById('spViewBodylabel').innerText = 'Department';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageDesignationType":
            tabName = "ManageDesignationType";
            var model108 = {
                ID: 0,
                TABLE_NAME: 'ERPDESIG'
            }
            const jsonString108 = JSON.stringify(model108);
            var ScreenID108 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString108, screenId: ScreenID108 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'block'
            const openModal108 = document.getElementById("btnOpenModal");
            const openModalEditType108 = document.getElementById("btnEdit");
            const openModalView108 = document.getElementById("btnView");
            const openModalDelete108 = document.getElementById("btnDelete");
            const addTypeBackArrow108 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow108 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Manage Designation';
            document.getElementById('spCreateName').innerText = 'Create New Designation';

            editTypeBackArrow108.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow108.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal108.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Designation';
                document.getElementById('spAddBodylabel').innerText = 'Designation Name';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Designation';
                document.getElementById('spEditBodylabel').innerText = 'Designation';
                document.getElementById('spViewHeaderlabel').innerText = 'Designation';
                document.getElementById('spViewBodylabel').innerText = 'Designation';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageCountryType":
            tabName = "ManageCountryType";
            var model125 = {
                ID: 0,
                TABLE_NAME: 'COUNTRY'
            }
            const jsonString125 = JSON.stringify(model125);
            var ScreenID125 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString125, screenId: ScreenID125 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'none'
            const openModal125 = document.getElementById("btnOpenModal");
            const openModalEditType125 = document.getElementById("btnEdit");
            const openModalView125 = document.getElementById("btnView");
            const openModalDelete125 = document.getElementById("btnDelete");
            const addTypeBackArrow125 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow125 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'View Country';
            document.getElementById('spCreateName').innerText = 'Create New Country';

            editTypeBackArrow125.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow125.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal125.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Country';
                document.getElementById('spAddBodylabel').innerText = 'Country';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Country';
                document.getElementById('spEditBodylabel').innerText = 'Country';
                document.getElementById('spViewHeaderlabel').innerText = 'Country';
                document.getElementById('spViewBodylabel').innerText = 'Country';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageStateType":
            tabName = "ManageStateType";
            var model126 = {
                ID: 0,
                TABLE_NAME: 'STATE'
            }
            const jsonString126 = JSON.stringify(model126);
            var ScreenID126 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString126, screenId: ScreenID126 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            // document.getElementById('btnOpenModal').style.display = 'none'
            const openModal126 = document.getElementById("btnOpenModal");
            const openModalEditType126 = document.getElementById("btnEdit");
            const openModalView126 = document.getElementById("btnView");
            const openModalDelete126 = document.getElementById("btnDelete");
            const addTypeBackArrow126 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow126 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Manage State';
            document.getElementById('spCreateName').innerText = 'Create New State';

            editTypeBackArrow126.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow126.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal126.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New State';
                document.getElementById('spAddBodylabel').innerText = 'State';
                document.getElementById('spEditHeaderlabel').innerText = 'Update State';
                document.getElementById('spEditBodylabel').innerText = 'State';
                document.getElementById('spViewHeaderlabel').innerText = 'State';
                document.getElementById('spViewBodylabel').innerText = 'State';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                LoadMasterDropdown('ddlCountry', {
                    parentId: 0,
                    masterTableTypeId: 0,
                    isMasterTableType: false,
                    isManualTable: true,
                    manualTable: 95,
                    manualTableId: 0,
                    ScreenId: "DropdownList_101"
                }, 'Select', false, '');
                $('#divCountry').show();
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageHSNType":
            tabName = "ManageHSNType";
            var model131 = {
                ID: 0,
                TABLE_NAME: 'HSN'
            }
            const jsonString131 = JSON.stringify(model131);
            var ScreenID131 = "Brand_101";

            $('#searchList').html('');

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString131, screenId: ScreenID131 }, 'GET', function (response) {
                const filteredHSNListData = response.data.data.Table.filter(item => {
                    // Example filter condition: Filter by a specific property, e.g., HSN is 0
                    return item.HSNSAC === 0;
                });
              
                renderItems(filteredHSNListData);
            });
            document.getElementById('btnOpenModal').style.display = 'none'
            const openModal131 = document.getElementById("btnOpenModal");
            const openModalEditType131 = document.getElementById("btnEdit");
            const openModalView131 = document.getElementById("btnView");
            const openModalDelete131 = document.getElementById("btnDelete");
            const addTypeBackArrow131 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow131 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'View HSN Code';
            document.getElementById('spCreateName').innerText = 'Create New HSN';
            $('#btnOpenModal').show();
            editTypeBackArrow131.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow131.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal131.addEventListener("click", () => {
                $('#txtHSNCode').val('');
                hsn_op = 'A';
                    $('#txtHSNName').val('');
                $('#hsnInsertUpdate').modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageSACType":
            tabName = "ManageSACType";
            var model132 = {
                ID: 0,
                TABLE_NAME: 'HSN'
            }
            const jsonString132 = JSON.stringify(model132);
            var ScreenID132 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString132, screenId: ScreenID132 }, 'GET', function (response) {
                const filteredSACListData = response.data.data.Table.filter(item => {
                    // Example filter condition: Filter by a specific property, e.g., SAC is 1
                    return item.HSNSAC === 1;
                });
                renderItems(filteredSACListData);
            });
            document.getElementById('btnOpenModal').style.display = 'none'
            const openModal132 = document.getElementById("btnOpenModal");
            const openModalEditType132 = document.getElementById("btnEdit");
            const openModalView132 = document.getElementById("btnView");
            const openModalDelete132 = document.getElementById("btnDelete");
            const addTypeBackArrow132 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow132 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'View SAC Code';
            document.getElementById('spCreateName').innerText = 'Create New SAC Type';

            editTypeBackArrow132.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow132.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal132.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New SAC Type';
                document.getElementById('spAddBodylabel').innerText = 'SAC Type';
                document.getElementById('spEditHeaderlabel').innerText = 'Update SAC Type';
                document.getElementById('spEditBodylabel').innerText = 'SAC Type';
                document.getElementById('spViewHeaderlabel').innerText = 'SAC Type';
                document.getElementById('spViewBodylabel').innerText = 'SAC Type';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnTaxOtherCharges":
            tabName = "TaxOtherCharges";
            var model450 = {
                ID: 0,
                TABLE_NAME: 'TaxOtherCharges'
            }
            const jsonString450 = JSON.stringify(model450);
            var ScreenID450 = "TaxOtherCharges_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString450, screenId: ScreenID450 }, 'GET', function (response) {
                const filteredTaxOtherCharges = response.data.data.Table;
                renderItems(filteredTaxOtherCharges);
            });
            document.getElementById('btnOpenModal').style.display = 'none';
            const openModal450 = document.getElementById("btnOpenModal");
            const openModalEditType450 = document.getElementById("btnEdit");
            const openModalView450 = document.getElementById("btnView");
            const openModalDelete450 = document.getElementById("btnDelete");
            const addTypeBackArrow450 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow450 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Manage Other Charges';
            document.getElementById('spCreateName').innerText = 'Create New Other Charges Type';

            editTypeBackArrow450.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow450.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal450.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Other Charges Type';
                document.getElementById('spAddBodylabel').innerText = 'Other Charges Type';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Other Charges Type';
                document.getElementById('spEditBodylabel').innerText = 'Other Charges Type';
                document.getElementById('spViewHeaderlabel').innerText = 'Other Charges Type';
                document.getElementById('spViewBodylabel').innerText = 'Other Charges Type';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageTaxCodeType":
            tabName = "ManageTaxCodeType";
            var model136 = {
                ID: 0,
                TABLE_NAME: 'VIEW'
            }
            const jsonString136 = JSON.stringify(model136);
            var ScreenID136 = "TaxCode_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString136, screenId: ScreenID136 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'none'
            const openModal136 = document.getElementById("btnOpenModal");
            const openModalEditType136 = document.getElementById("btnEdit");
            const openModalView136 = document.getElementById("btnView");
            const openModalDelete136 = document.getElementById("btnDelete");
            const addTypeBackArrow136 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow136 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'View Tax Code';
            document.getElementById('spCreateName').innerText = 'Create New SAC Type';

            editTypeBackArrow136.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow136.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal136.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Tax Code';
                document.getElementById('spAddBodylabel').innerText = 'Tax Code';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Tax Code';
                document.getElementById('spEditBodylabel').innerText = 'Tax Code';
                document.getElementById('spViewHeaderlabel').innerText = 'Tax Code';
                document.getElementById('spViewBodylabel').innerText = 'Tax Code';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageUoMType":
            tabName = "ManageUoMType";
            var model139 = {
                ID: 0,
                TABLE_NAME: 'UNIT'
            }
            const jsonString139 = JSON.stringify(model139);
            var ScreenID139 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString139, screenId: ScreenID139 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'none'
            const openModal139 = document.getElementById("btnOpenModal");
            const openModalEditType139 = document.getElementById("btnEdit");
            const openModalView139 = document.getElementById("btnView");
            const openModalDelete139 = document.getElementById("btnDelete");
            const addTypeBackArrow139 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow139 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Manage UoM';
            document.getElementById('spCreateName').innerText = 'Create New UoM';

            editTypeBackArrow139.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow139.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal139.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Brand Type';
                document.getElementById('spAddBodylabel').innerText = 'Brand Type';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Brand Type';
                document.getElementById('spEditBodylabel').innerText = 'Brand Type';
                document.getElementById('spViewHeaderlabel').innerText = 'Brand Type';
                document.getElementById('spViewBodylabel').innerText = 'Brand Type';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageCurrencyType":
            tabName = "ManageCurrencyType";
            var model141 = {
                ID: 0,
                TABLE_NAME: 'Currency'
            }
            const jsonString141 = JSON.stringify(model141);
            var ScreenID141 = "CURR_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString141, screenId: ScreenID141 }, 'GET', function (response) {
                renderCurrencyItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'block'
            const openModal141 = document.getElementById("btnOpenModal");
            const openModalEditType141 = document.getElementById("btnEdit");
            const openModalView141 = document.getElementById("btnView");
            const openModalDelete141 = document.getElementById("btnDelete");
            const addTypeBackArrow141 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow141 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Manage Currency Name';
            document.getElementById('spCreateName').innerText = 'Create New Currency Name';

            editTypeBackArrow141.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow141.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal141.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Currency Name';
                document.getElementById('spAddBodylabel').innerText = 'Currency Code';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Currency Name';
                document.getElementById('spEditBodylabel').innerText = 'Currency Code';
                document.getElementById('spViewHeaderlabel').innerText = 'Currency Code';
                document.getElementById('spViewBodylabel').innerText = 'Currency Code';
                document.getElementById('spAddBodylabelName').innerText = 'Currency Name';
                document.getElementById('divCommonTypeName').style.display = 'block';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtType').val('');
                $('#txtCommonTermDescriptions').removeClass('form-control h-100-p MandatoryCurrency').addClass('form-control h-100-p');
                // Apply AlphaNumeric-only restriction
                $('#txtCommonTypeName').off('input'); // Remove any previous bindings
                $('#txtCommonTypeName').on('input', allowAlphanumeric);
                $('#txtCommonTypeName').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageCurrConversionType":
            tabName = "ManageCurrConversionType";
            var model166 = {
                ID: 0,
                TABLE_NAME: 'CurrConversion'
            }
            const jsonString166 = JSON.stringify(model166);
            var ScreenID166 = "Curr_Conv_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString166, screenId: ScreenID166 }, 'GET', function (response) {
                RenderCurrConversionItems(response.data.data.Table);
            });

            $("#managecurrencyconversion").modal('show');
            break;
        case "btnManageCategoryType":
            tabName = "ManageCategoryType";
            var model149 = {
                ID: 0,
                Type: 'Category'
            }
            const jsonString149 = JSON.stringify(model149);
            var ScreenID149 = "CATE_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString149, screenId: ScreenID149 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'block'
            const openModal149 = document.getElementById("btnOpenModal");
            const openModalEditType149 = document.getElementById("btnEdit");
            const openModalView149 = document.getElementById("btnView");
            const openModalDelete149 = document.getElementById("btnDelete");
            const addTypeBackArrow149 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow149 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Manage Category';
            document.getElementById('spCreateName').innerText = 'Create New Category';

            editTypeBackArrow149.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow149.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal149.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Category';
                document.getElementById('spAddBodylabel').innerText = 'Category Name';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Category';
                document.getElementById('spEditBodylabel').innerText = 'Category';
                document.getElementById('spViewHeaderlabel').innerText = 'Category';
                document.getElementById('spViewBodylabel').innerText = 'Category';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageSubCategoryType":
            tabName = "ManageSubCategoryType";
            var model157 = {
                ID: 0,
                Type: 'SubCategory'
            }
            const jsonString157 = JSON.stringify(model157);
            var ScreenID157 = "CATE_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString157, screenId: ScreenID157 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'block'
            const openModal157 = document.getElementById("btnOpenModal");
            const openModalEditType157 = document.getElementById("btnEdit");
            const openModalView157 = document.getElementById("btnView");
            const openModalDelete157 = document.getElementById("btnDelete");
            const addTypeBackArrow157 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow157 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Manage Sub Category';
            document.getElementById('spCreateName').innerText = 'Create New Sub Category';

            editTypeBackArrow157.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow157.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal157.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Sub Category';
                document.getElementById('spAddBodylabel').innerText = 'Sub Category Name';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Sub Category';
                document.getElementById('spEditBodylabel').innerText = 'Sub Category';
                document.getElementById('spViewHeaderlabel').innerText = 'Sub Category';
                document.getElementById('spViewBodylabel').innerText = 'Sub Category';
                document.getElementById('divCommonTypeName').style.display = 'none'
                document.getElementById('divCategory').style.display = 'block';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageLocationType":
            tabName = "ManageLocationType";
            var model169 = {
                ID: 0,
                Type: 'Location'
            }
            const jsonString169 = JSON.stringify(model169);
            var ScreenID169 = "Location_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString169, screenId: ScreenID169 }, 'GET', function (response) {
                RenderLocationItems(response.data.data.Table);
            });

            $("#managelocation").modal('show');
            break;
        case "btnManageWarehouse":
            tabName = "ManageWarehouse";
            var model177 = {
                ID: 0,
                Type: 'Warehouse'
            }
            const jsonString177 = JSON.stringify(model177);
            var ScreenID177 = "Warehouse_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString177, screenId: ScreenID177 }, 'GET', function (response) {
                RenderWarehouseItems(response.data.data.Table);
            });

            $("#managewarehouse").modal('show');
            break;
        case "btnManageOtherCharges":
            tabName = "ManageOtherCharges";
            var model182 = {
                ID: 0,
                TABLE_NAME: 'ERPOTHERCHARGES'
            }
            const jsonString182 = JSON.stringify(model182);
            var ScreenID182 = "OtherCharges_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString182, screenId: ScreenID182 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });

            document.getElementById('btnOpenModal').style.display = 'block'
            const openModal182 = document.getElementById("btnOpenModal");
            const openModalEditType182 = document.getElementById("btnEdit");
            const openModalView182 = document.getElementById("btnView");
            const openModalDelete182 = document.getElementById("btnDelete");
            const addTypeBackArrow182 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow182 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Manage Other Charges';
            document.getElementById('spCreateName').innerText = 'Create Other Charges';

            editTypeBackArrow182.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow182.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal182.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create Other Charges';
                document.getElementById('spAddBodylabel').innerText = 'Charge Name';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Charge Name';
                document.getElementById('spEditBodylabel').innerText = 'Charge Name';
                document.getElementById('spViewHeaderlabel').innerText = 'Charge Name';
                document.getElementById('spViewBodylabel').innerText = 'Charge Name';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageTerritoryType":
            tabName = "ManageTerritoryType";
            var model183 = {
                ID: 0,
                TABLE_NAME: 'ERPTERRITORY'
            }
            const jsonString183 = JSON.stringify(model183);
            var ScreenID183 = "Territory_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString183, screenId: ScreenID183 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });

            document.getElementById('btnOpenModal').style.display = 'block'
            const openModal183 = document.getElementById("btnOpenModal");
            const openModalEditType183 = document.getElementById("btnEdit");
            const openModalView183 = document.getElementById("btnView");
            const openModalDelete183 = document.getElementById("btnDelete");
            const addTypeBackArrow183 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow183 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Manage Territory';
            document.getElementById('spCreateName').innerText = 'Create New Territory';

            editTypeBackArrow183.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow183.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal183.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Territory';
                document.getElementById('spAddBodylabel').innerText = 'Territory Name';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Territory';
                document.getElementById('spEditBodylabel').innerText = 'Territory Name';
                document.getElementById('spViewHeaderlabel').innerText = 'Territory Name';
                document.getElementById('spViewBodylabel').innerText = 'Territory Name';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageClientBrandTypes":
            tabName = "ManageClientBrandTypes";
            var model196 = {
                ID: 0,
                TABLE_NAME: 'CLIENTBRANDTYPE'
            }
            const jsonString196 = JSON.stringify(model196);
            var ScreenID196 = "CBT_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString196, screenId: ScreenID196 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });

            //document.getElementById('btnOpenModal').style.display = 'block'
            const openModal196 = document.getElementById("btnOpenModal");
            const openModalEditType196 = document.getElementById("btnEdit");
            const openModalView196 = document.getElementById("btnView");
            const openModalDelete196 = document.getElementById("btnDelete");
            const addTypeBackArrow196 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow196 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Manage Client Brand Types';
            document.getElementById('spCreateName').innerText = 'Create New Client Brand Types';

            editTypeBackArrow196.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow196.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal196.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Client Brand Types';
                document.getElementById('spAddBodylabel').innerText = 'Client Brand Types';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Client Brand Types';
                document.getElementById('spEditBodylabel').innerText = 'Client Brand Types';
                document.getElementById('spViewHeaderlabel').innerText = 'Client Brand Types';
                document.getElementById('spViewBodylabel').innerText = 'Client Brand Types';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManagePaymentTerms":
            tabName = "ManagePaymentTerms";
            var model204 = {
                ID: 0,
                TABLE_NAME: 'PaymentTerms'
            }
            const jsonString204 = JSON.stringify(model204);
            var ScreenID204 = "Pay_Terms_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString204, screenId: ScreenID204 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'block';
            const openModal204 = document.getElementById("btnOpenModal");
            const openModalEditType204 = document.getElementById("btnEdit");
            const openModalView204 = document.getElementById("btnView");
            const openModalDelete204 = document.getElementById("btnDelete");
            const addTypeBackArrow204 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow204 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Payment Terms';
            document.getElementById('spCreateName').innerText = 'Create Payment Terms';

            editTypeBackArrow204.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow204.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal204.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Payment Terms';
                document.getElementById('spAddBodylabel').innerText = 'Payment Terms';
                document.getElementById('spAddBodylabelName').innerText = 'Credit Days';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Payment Terms';
                document.getElementById('spEditBodylabel').innerText = 'Payment Terms';
                document.getElementById('spViewHeaderlabel').innerText = 'Payment Terms';
                document.getElementById('spViewBodylabel').innerText = 'Payment Terms';

                document.getElementById('divCommonTypeName').style.display = 'block';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');

                // Apply integer-only restriction
                $('#txtCommonTypeName').on('input', allowOnlyIntegers);
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageTransportationDetails":
            tabName = "TransportationDetails";
            var model212 = {
                ID: 0,
                Type: 'ERPTransporter'
            }
            const jsonString212 = JSON.stringify(model212);
            var ScreenID212 = "Trans_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString212, screenId: ScreenID212 }, 'GET', function (response) {
                RenderTransportationItems(response.data.data.Table);
            });
            $("#managetransportation").modal('show');
            break;
        case "btnTermsCondidtions":
            tabName = "TermsCondidtion";
            var model401 = {
                ID: 0,
                TABLE_NAME: 'TermsConditions'
            }
            const jsonString401 = JSON.stringify(model401);
            var ScreenID401 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString401, screenId: ScreenID401 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'block';
            const openModal401 = document.getElementById("btnOpenModal");
            const openModalEditType401 = document.getElementById("btnEdit");
            const openModalView401 = document.getElementById("btnView");
            const openModalDelete401 = document.getElementById("btnDelete");
            const addTypeBackArrow401 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow401 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button1
            document.getElementById('spHeaderName').innerText = 'Terms Conditions';
            document.getElementById('spCreateName').innerText = 'Create Terms Conditions';

            editTypeBackArrow401.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow401.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal401.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Terms Conditions';
                document.getElementById('spAddBodylabel').innerText = 'Terms Name';
                document.getElementById('spAddBodylabelTermDescriptions').innerText = 'Descriptions';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Terms Conditions';
                document.getElementById('spEditBodylabel').innerText = 'Terms Conditions';
                document.getElementById('spViewHeaderlabel').innerText = 'Terms Conditions';
                document.getElementById('spViewBodylabel').innerText = 'Terms Conditions';
                
                document.getElementById('divCommonTermDescriptions').style.display = 'block';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                $('#txtCommonTermDescriptions').val('');
                $('#txtType').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');

            break;
        case "btnManageSampleType":
            tabName = "ManageSampleType";
            var model453 = {
                ID: 0,
                TABLE_NAME: 'ERPSampleType'
            }
            const jsonString453 = JSON.stringify(model453);
            var ScreenID453 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString453, screenId: ScreenID453 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'none'        
            const openModal453 = document.getElementById("btnOpenModal");
            const openModalEditType453 = document.getElementById("btnEdit");
            const openModalView453 = document.getElementById("btnView");
            const openModalDelete453 = document.getElementById("btnDelete");
            const addTypeBackArrow453 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow453 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button2
            document.getElementById('spHeaderName').innerText = 'Manage Sample Type';
            document.getElementById('spCreateName').innerText = ' Create New Sample Type';
            editTypeBackArrow453.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow453.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal453.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Sample Type';
                document.getElementById('spAddBodylabel').innerText = 'Sample Type';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Sample Type';
                document.getElementById('spEditBodylabel').innerText = 'Sample Type';
                document.getElementById('spViewHeaderlabel').innerText = 'Sample Type';
                document.getElementById('spViewBodylabel').innerText = 'Sample Type';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtCommonTypeName').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageFormulationCategoriesType":
            tabName = "ManageFormulationCategoriesType";
            var model459 = {
                ID: 0,
                TABLE_NAME: 'ERPFormulationCategories'
            }
            const jsonString459 = JSON.stringify(model459);
            var ScreenID459 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString459, screenId: ScreenID459 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'block'
            const openModal459 = document.getElementById("btnOpenModal");
            const openModalEditType459 = document.getElementById("btnEdit");
            const openModalView459 = document.getElementById("btnView");
            const openModalDelete459 = document.getElementById("btnDelete");
            const addTypeBackArrow459 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow459 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button2
            document.getElementById('spHeaderName').innerText = 'Manage Formulation Categories';
            document.getElementById('spCreateName').innerText = ' Create New Formulation Categories';
            editTypeBackArrow459.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow459.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal459.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Formulation Categories';
                document.getElementById('spAddBodylabel').innerText = 'Formulation Categories';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Formulation Categories';
                document.getElementById('spEditBodylabel').innerText = 'Formulation Categories';
                document.getElementById('spViewHeaderlabel').innerText = 'Formulation Categories';
                document.getElementById('spViewBodylabel').innerText = 'Formulation Categories';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtType').val(''); 
                $('#txtCommonTypeName').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManagePackagingType":
            tabName = "ManagePackagingType";
            var model470 = {
                ID: 0,
                TABLE_NAME: 'ERPPackaging'
            }
            const jsonString470 = JSON.stringify(model470);
            var ScreenID470 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString470, screenId: ScreenID470 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'block'
            const openModal470 = document.getElementById("btnOpenModal");
            const openModalEditType470 = document.getElementById("btnEdit");
            const openModalView470 = document.getElementById("btnView");
            const openModalDelete470 = document.getElementById("btnDelete");
            const addTypeBackArrow470 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow470 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button2
            document.getElementById('spHeaderName').innerText = 'Manage Packaging';
            document.getElementById('spCreateName').innerText = ' Create New Packaging';
            editTypeBackArrow470.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow470.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal470.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Packaging';
                document.getElementById('spAddBodylabel').innerText = 'Packaging';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Packaging';
                document.getElementById('spEditBodylabel').innerText = 'Packaging';
                document.getElementById('spViewHeaderlabel').innerText = 'Packaging';
                document.getElementById('spViewBodylabel').innerText = 'Packaging';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtType').val('');
                $('#txtCommonTypeName').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageOrderSizeType":
            tabName = "ManageOrderSizeType";
            var model471 = {
                ID: 0,
                TABLE_NAME: 'ERPOrderSize'
            }
            const jsonString471 = JSON.stringify(model471);
            var ScreenID471 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString471, screenId: ScreenID471 }, 'GET', function (response) {
                renderItems(response.data.data.Table);
            });
            document.getElementById('btnOpenModal').style.display = 'block'
            const openModal471 = document.getElementById("btnOpenModal");
            const openModalEditType471 = document.getElementById("btnEdit");
            const openModalView471 = document.getElementById("btnView");
            const openModalDelete471 = document.getElementById("btnDelete");
            const addTypeBackArrow471 = document.getElementById("btnAddTypeBackArrow");
            const editTypeBackArrow471 = document.getElementById("btnEditTypeBackArrow");
            // Add logic for button2
            document.getElementById('spHeaderName').innerText = 'Manage Order Size';
            document.getElementById('spCreateName').innerText = ' Create New Order Size';
            editTypeBackArrow471.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            addTypeBackArrow471.addEventListener("click", () => {
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('hide');
                $("#editbrandtype").modal('hide');
                $("#viewbrandtype").modal('hide');
                $("#deleteCommonType").modal('hide');
            });
            openModal471.addEventListener("click", () => {
                document.getElementById('spAddHeaderlabel').innerText = 'Create New Order Size';
                document.getElementById('spAddBodylabel').innerText = 'Order Size';
                document.getElementById('spEditHeaderlabel').innerText = 'Update Order Size';
                document.getElementById('spEditBodylabel').innerText = 'Order Size';
                document.getElementById('spViewHeaderlabel').innerText = 'Order Size';
                document.getElementById('spViewBodylabel').innerText = 'Order Size';
                document.getElementById('divCommonTypeName').style.display = 'none';
                document.getElementById('divCategory').style.display = 'none';
                document.getElementById('divCountry').style.display = 'none';
                document.getElementById('divCommonTermDescriptions').style.display = 'none';
                $('#txtType').val('');
                $('#txtCommonTypeName').val('');
                $("#managebrandtype").modal('show');
                $("#addbrandtype").modal('show');
            });
            $("#managebrandtype").modal('show');
            break;
        case "btnManageQuality":
            tabName = "ManageQuality";
            var model177 = {
                Id: 0,
                Type: 0
            }
            const jsonString472 = JSON.stringify(model177);
            var ScreenID472 = "QCPM_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString472, screenId: ScreenID472 }, 'GET', function (response) {
                RenderQualityCheckItems(response.data.data.Table);
            });

            $("#manageqcparameter").modal('show');
            break;
        default:
    }
    $('#sptxtType').hide();
    $('#sptxtCommonTypeName').hide();
}

function renderItems(data) {
    console.time('renderItems');

    const $searchList = $("#searchList");
    $searchList.empty(); // Clear existing items

    if (!data || data.length === 0) {
        console.timeEnd('renderItems');
        return;
    }

    // Build full HTML in one pass
    let html = "";
    data.forEach((item) => {
        html += `
        <li class="item" data-id="${item.ID}">
          <div class="d-flex justify-content-between" style="width:100%">
            <div class="left" style="width: auto;">
              <span class="title-one bold">${escapeHtml(item.FIELD_NAME)}</span>
            </div>
            <div class="leftCountry centeritem" style="width: auto;">
              <span>${escapeHtml(item.FIELD_VALUE)}</span>
            </div>
            <div class="leftTaxRate" style="width: auto;">
              <span class="title-one">${escapeHtml(item.TAXRate)}</span>
            </div>
            <div class="right">
              <div class="td-action-btn item-gap-btn">
                <a href="#" class="btnEdit" onclick="RowEdit(${item.ID})" data-toggle="tooltip" title="Edit">
                  <img src="../../assets/images/icons/help/edit-icon.svg" alt="Edit">
                </a>
                <a href="#" class="btnView" onclick="RowView(${item.ID})" data-toggle="tooltip" title="View">
                  <img src="../../assets/images/icons/help/view-icon.svg" alt="View">
                </a>
                <a href="#" class="btnEditHSNType" onclick="RowEditHSN(${item.ID})" data-toggle="tooltip" title="Edit">
                  <img src="../../assets/images/icons/help/edit-icon.svg" alt="Edit">
                </a>
                <a href="#" class="btnAddHSN" onclick="BindItemMasterCharge(${item.ID},'${escapeAttr(item.FIELD_NAME)}','${escapeAttr(item.FIELD_VALUE)}')" data-toggle="modal" data-target="#taxmapping">
                  <img src="../../assets/images/icons/help/add.svg" class="label-icon cursor-pointer" title="Add Mapping" alt="">
                </a>
                <div class="toggledgn btnDelete">
                  <input type="checkbox" onclick="RowDelete(${item.ID},'${escapeAttr(item.FIELD_NAME)}')" class="checkbox toggle-switch" ${item.isdeleted != 1 ? 'checked' : ''} id="active_${item.ID}">
                  <label for="active_${item.ID}" class="checkbox-label" data-toggle="modal" ${item.isdeleted ? `data-target="#confirmationdeactivate"` : `data-target="#deleteCommonType"`}>
                    <img src="../../assets/images/icons/help/check-white-icon.png" class="icon-16">
                    <img src="../../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                    <span class="ball"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </li>`;
    });

    // Append once
    $searchList.append(html);

    // Apply tab-based visibility rules ONCE (not inside loop)
    // hide these by default, then override below as needed:
    $searchList.find('.btnAddHSN, .btnEditHSNType, .btnEdit, .btnDelete, .leftCountry, .leftTaxRate')
        .css('display', 'none');

    if (tabName == "ManageCountryType" || tabName == 'ManageHSNType' || tabName == 'ManageSACType' || tabName == "TaxOtherCharges") {
        $searchList.find('.leftCountry').css('display', 'block');
        $searchList.find('.leftTaxRate').css('display', 'none');
    }
    if (tabName == 'ManageHSNType') {
        $searchList.find('.btnAddHSN').css('display', 'block');
        $searchList.find('.btnEditHSNType').css('display', 'block');
    }
    if (tabName == 'ManageStateType') {
        $searchList.find('.leftCountry').css('display', 'block');
    }
    if (tabName == "ManageTaxCodeType") {
        $searchList.find('.leftCountry').css('display', 'block');
        $searchList.find('.leftTaxRate').css('display', 'block');
    }
    if (tabName == "ManageUoMType") {
        $searchList.find('.leftCountry').css('display', 'block');
    }
    if (tabName == "ManageCurrencyType" ||
        tabName == "ManageDepartmentType" || tabName == "ManageDesignationType" ||
        tabName == "ManageBrandType" || tabName == "ManageLeadSource" ||
        tabName == "ManageOtherCharges" || tabName == "ManageTerritoryType" ||
        tabName == "ManageClientBrandTypes" || tabName == "ManagePaymentTerms" ||
        tabName == "TermsCondidtion" || tabName == "ManageCategoryType" ||
        tabName == "ManageSubCategoryType" || tabName == "ManageFormulationCategoriesType" ||
        tabName == "ManagePackagingType" || tabName == "ManageOrderSizeType") {
        $searchList.find('.btnEdit, .btnDelete').css('display', 'block');
    }
    if (tabName == "ManageSampleType") {
        $searchList.find('.btnEdit, .btnDelete').css('display', 'none');
    }

    // init tooltips once
    $('[data-toggle="tooltip"]').tooltip();

    console.timeEnd('renderItems');
}

// simple escaping helpers to avoid XSS issues when injecting user data
function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"'`=\/]/g, function (s) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        })[s];
    });
}
function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, '&quot;');
}

function renderItems1(data) {
    $("#searchList").empty(); // Clear existing items
    if (data.length > 0) {
        data.forEach((item) => {
            const listItem = `
							<li class="item">
							  <div class="d-flex justify-content-between" style="width:100%">
								<div class="left" style="width: auto;">
									  <span class="title-one bold" >${item.FIELD_NAME}</span>
								</div>
								<div class="leftCountry centeritem" style="width: auto;">
								  <span class="">${item.FIELD_VALUE}</span>
								</div>
								<div class="leftTaxRate" style="width: auto;">
								  <span class="title-one">${item.TAXRate}</span>
								</div>
								<div class="right">
								  <div class="td-action-btn item-gap-btn">
									<a href="#" class="btnEdit" id="btnEdit" onclick="RowEdit(${item.ID})" data-toggle="tooltip" title="Edit">
									  <img src="../../assets/images/icons/help/edit-icon.svg" alt="Edit">
									</a>
									<a href="#" id="btnView" onclick="RowView(${item.ID})" data-toggle="tooltip" title="View">
									  <img src="../../assets/images/icons/help/view-icon.svg" alt="View">
									</a>
                                    <a href="#" id="btnEditHSN" class="btnEditHSNType" onclick="RowEditHSN(${item.ID})" data-toggle="tooltip" title="Edit">
									   <img src="../../assets/images/icons/help/edit-icon.svg" alt="Edit">
									</a>
                                     <a href="#" class="btnAddHSN" onclick="BindItemMasterCharge(${item.ID},'${item.FIELD_NAME}', '${item.FIELD_VALUE}')" data-toggle="modal" data-target="#taxmapping"> <img src="../../assets/images/icons/help/add.svg" data-toggle="modal" data-target="#taxmapping" class="label-icon cursor-pointer" title="Add Mapping" alt=""> </a> 
                                    <div class="toggledgn btnDelete">
                                      <input type="checkbox" onclick="RowDelete(${item.ID},'${item.FIELD_NAME}')" class="checkbox toggle-switch" ${item.isdeleted != 1 ? 'checked' : ''}  id="active_${item.ID}">
                                      <label for="active_${item.ID}" class="checkbox-label" data-toggle="modal" ${item.isdeleted ? `data-target="#confirmationdeactivate"` : `data-target="#deleteCommonType"`}>
                                        <img src="../../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                        <img src="../../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                        <span class="ball"></span>
                                      </label>
                                    </div>
								  </div>
								</div>
							  </div>
							</li>`;
            $("#searchList").append(listItem);
            // tabName == "ManageStateType" ||
            $("#searchList .btnAddHSN").css('display', 'none'); // Hides only the most recently added .btnEdit
            $("#searchList .btnEditHSNType").css('display', 'none');

            if (tabName == "ManageCountryType" ||  tabName == 'ManageHSNType' || tabName == 'ManageSACType' || tabName == "TaxOtherCharges") {
                $("#searchList .btnEdit").css('display', 'none'); // Hides only the most recently added .btnEdit
                $("#searchList .btnDelete").css('display', 'none');
                $("#searchList .leftCountry").css('display', 'block');
                $("#searchList .leftTaxRate").css('display', 'none');
            }
            if (tabName == 'ManageHSNType') {
                $("#searchList .btnAddHSN").css('display', 'block'); // Hides only the most recently added .btnEdit
                $("#searchList .btnEditHSNType").css('display', 'block');

            }
            if (tabName == 'ManageStateType') {
                $("#searchList .leftCountry").css('display', 'block');
                $("#searchList .leftTaxRate").css('display', 'none');
            }
            if (tabName == "ManageTaxCodeType") {
                $("#searchList .btnEdit").css('display', 'none'); // Hides only the most recently added .btnEdit
                $("#searchList .btnDelete").css('display', 'none');
                $("#searchList .leftCountry").css('display', 'block');
                $("#searchList .leftTaxRate").css('display', 'block');
            }
            if (tabName == "ManageUoMType") {
                $("#searchList .btnEdit").css('display', 'none'); // Hides only the most recently added .btnEdit
                $("#searchList .btnDelete").css('display', 'none');
                $("#searchList .leftCountry").css('display', 'block');
                $("#searchList .leftTaxRate").css('display', 'none');
            }
            if (tabName == "ManageCurrencyType") {
                $("#searchList .btnEdit").css('display', 'block'); // Hides only the most recently added .btnEdit
                $("#searchList .btnDelete").css('display', 'block');
                $("#searchList .leftCountry").css('display', 'none');
                $("#searchList .leftTaxRate").css('display', 'none');
            }
            if (tabName == "ManageDepartmentType" || tabName == "ManageDesignationType" || tabName == "ManageBrandType" || tabName == "ManageLeadSource") {
                $("#searchList .btnEdit").css('display', 'block'); // Hides only the most recently added .btnEdit
                $("#searchList .btnDelete").css('display', 'block');
                $("#searchList .leftCountry").css('display', 'none');
                $("#searchList .leftTaxRate").css('display', 'none');
            }
            if (tabName == "ManageOtherCharges") {
                $("#searchList .btnEdit").css('display', 'block'); // Hides only the most recently added .btnEdit
                $("#searchList .btnDelete").css('display', 'block');
                $("#searchList .leftCountry").css('display', 'none');
                $("#searchList .leftTaxRate").css('display', 'none');
            }
            if (tabName == "ManageTerritoryType" || tabName == "ManageClientBrandTypes") {
                $("#searchList .btnEdit").css('display', 'block'); // Hides only the most recently added .btnEdit
                $("#searchList .btnDelete").css('display', 'block');
                $("#searchList .leftCountry").css('display', 'none');
                $("#searchList .leftTaxRate").css('display', 'none');
            }
            if (tabName == "ManagePaymentTerms" || tabName == "TermsCondidtion") {
                $("#searchList .btnEdit").css('display', 'block'); // Hides only the most recently added .btnEdit
                $("#searchList .btnDelete").css('display', 'block');
                $("#searchList .leftCountry").css('display', 'none');
                $("#searchList .leftTaxRate").css('display', 'none');
            }
            if (tabName == "ManageCategoryType" || tabName == "ManageSubCategoryType") {
                $("#searchList .btnEdit").css('display', 'block'); // Hides only the most recently added .btnEdit
                $("#searchList .btnDelete").css('display', 'block');
                $("#searchList .leftCountry").css('display', 'none');
                $("#searchList .leftTaxRate").css('display', 'none');
            } 
            if (tabName == "ManageSampleType" ) {
                $("#searchList .btnEdit").css('display', 'none'); // Hides only the most recently added .btnEdit
                $("#searchList .btnDelete").css('display', 'none');
                $("#searchList .leftCountry").css('display', 'none');
                $("#searchList .leftTaxRate").css('display', 'none');
            } 
            if (tabName == "ManageFormulationCategoriesType" || tabName == "ManagePackagingType" || tabName == "ManageOrderSizeType") {
                $("#searchList .btnEdit").css('display', 'block'); // Hides only the most recently added .btnEdit
                $("#searchList .btnDelete").css('display', 'block');
                $("#searchList .leftCountry").css('display', 'none');
                $("#searchList .leftTaxRate").css('display', 'none');
            }
        });
        $('[data-toggle="tooltip"]').tooltip();

        // Add new item dynamically on button click
        $("#addItemBtn").click(function () {
            const newItem = {
                title: `Brand Type ${items.length + 1}`,
                editTooltip: "Edit new item",
                viewTooltip: "View new item",
                deleteTooltip: "Delete new item",
            };
            items.push(newItem); // Add to the data array
            renderItems(items); // Re-render the list
        });
    }
}
function renderCurrencyItems(data) {
    $("#searchList").empty(); // Clear existing items
    if (data.length > 0) {
        data.forEach((item) => {
            const listItem = `
							<li class="item">
							  <div class="d-flex justify-content-between" style="width:100%">
								<div class="left" style="width: auto;">
								  <span class="title-one bold" >${item.FIELD_VALUE}</span>
								</div>
								<div class="leftCountry" style="width: auto;">
								  <span class="title-one bold">${item.FIELD_VALUE}</span>
								</div>
								<div class="leftTaxRate" style="width: auto;">
								  <span class="title-one bold">${item.TAXRate}</span>
								</div>
								<div class="right">
								  <div class="td-action-btn item-gap-btn">
									<a href="#" class="btnEdit" id="btnEdit" onclick="RowEdit(${item.ID})" data-toggle="tooltip" title="Edit">
									  <img src="../../assets/images/icons/help/edit-icon.svg" alt="Edit">
									</a>
									<a href="#" id="btnView" onclick="RowView(${item.ID})" data-toggle="tooltip" title="View">
									  <img src="../../assets/images/icons/help/view-icon.svg" alt="View">
									</a>
                                    <div class="toggledgn btnDelete">
                                      <input type="checkbox" onclick="RowDelete(${item.ID},'${item.FIELD_VALUE}')" class="checkbox toggle-switch" ${item.isdeleted != 1 ? 'checked' : ''}  id="active_${item.ID}">
                                      <label for="active_${item.ID}" class="checkbox-label" data-toggle="modal" ${item.isdeleted ? `data-target="#confirmationdeactivate"` : `data-target="#deleteCommonType"`}>
                                        <img src="../../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                        <img src="../../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                        <span class="ball"></span>
                                      </label>
                                    </div>
								  </div>
								</div>
							  </div>
							</li>`;
            $("#searchList").append(listItem);
            if (tabName == "ManageCurrencyType") {
                $("#searchList .btnEdit").css('display', 'block'); // Hides only the most recently added .btnEdit
                $("#searchList .btnDelete").css('display', 'block');
                $("#searchList .leftCountry").css('display', 'none');
                $("#searchList .leftTaxRate").css('display', 'none');
            }
        });
        $('[data-toggle="tooltip"]').tooltip();

        // Add new item dynamically on button click
        $("#addItemBtn").click(function () {
            const newItem = {
                title: `Brand Type ${items.length + 1}`,
                editTooltip: "Edit new item",
                viewTooltip: "View new item",
                deleteTooltip: "Delete new item",
            };
            items.push(newItem); // Add to the data array
            renderItems(items); // Re-render the list
        });
    }
}
function RowEdit(rowId) {
    switch (tabName) {
        case "ManageBrandType":
            var model = {
                ID: rowId,
                TABLE_NAME: 'ERPBRAND'
            }
            const jsonString = JSON.stringify(model);
            var ScreenID = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Brand Type';
            document.getElementById('spAddBodylabel').innerText = 'Brand Type';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Principle Brand Type';
            document.getElementById('spEditBodylabel').innerText = 'Brand Type';
            document.getElementById('spViewHeaderlabel').innerText = 'Brand Type';
            document.getElementById('spViewBodylabel').innerText = 'Brand Type';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;

        case "ManageLeadSource":
            var model101 = {
                ID: rowId,
                TABLE_NAME: 'ERPLEADSOURCE'
            }
            const jsonString101 = JSON.stringify(model101);
            var ScreenID101 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString101, screenId: ScreenID101 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Lead Source';
            document.getElementById('spAddBodylabel').innerText = 'Lead Source';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Lead Source';
            document.getElementById('spEditBodylabel').innerText = 'Lead Source';
            document.getElementById('spViewHeaderlabel').innerText = 'Lead Source';
            document.getElementById('spViewBodylabel').innerText = 'Lead Source';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManageDepartmentType":
            var model116 = {
                ID: rowId,
                TABLE_NAME: 'ERPDEPT'
            }
            const jsonString116 = JSON.stringify(model116);
            var ScreenID116 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString116, screenId: ScreenID116 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Department Type';
            document.getElementById('spAddBodylabel').innerText = 'Department Type';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Department Type';
            document.getElementById('spEditBodylabel').innerText = 'Department Name';
            document.getElementById('spViewHeaderlabel').innerText = 'Department Type';
            document.getElementById('spViewBodylabel').innerText = 'Department Type';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManageDesignationType":
            var model117 = {
                ID: rowId,
                TABLE_NAME: 'ERPDESIG'
            }
            const jsonString117 = JSON.stringify(model117);
            var ScreenID117 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString117, screenId: ScreenID117 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Designation Type';
            document.getElementById('spAddBodylabel').innerText = 'Designation Type';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Designation Type';
            document.getElementById('spEditBodylabel').innerText = 'Designation Name';
            document.getElementById('spViewHeaderlabel').innerText = 'Designation Type';
            document.getElementById('spViewBodylabel').innerText = 'Designation Type';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManageCurrencyType":
            var model144 = {
                ID: rowId,
                TABLE_NAME: 'CURRENCY'
            }
            const jsonString144 = JSON.stringify(model144);
            var ScreenID144 = "CURR_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString144, screenId: ScreenID144 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#txtEditTypeName').val(response.data.data.Table[0].FIELD_VALUE);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            $('#txtEditTypeName').off('input'); // Remove any previous bindings
            $('#txtEditTypeName').on('input', allowAlphanumeric);
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Currency Name';
            document.getElementById('spAddBodylabel').innerText = 'Currency Code';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Currency Name';
            document.getElementById('spEditBodylabel').innerText = 'Currency Code';
            document.getElementById('spViewHeaderlabel').innerText = 'Currency Code';
            document.getElementById('spViewBodylabel').innerText = 'Currency Code';
            document.getElementById('spEditBodylabelName').innerText = 'Currency Name';
            document.getElementById('divCommonEditTypeName').style.display = 'block';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManageCategoryType":
            var model152 = {
                ID: rowId,
                Type: 'Category'
            }
            const jsonString152 = JSON.stringify(model152);
            var ScreenID152 = "CATE_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString152, screenId: ScreenID152 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Category';
            document.getElementById('spAddBodylabel').innerText = 'Category';
            document.getElementById('spEditHeaderlabel').innerText = 'Edit Category';
            document.getElementById('spEditBodylabel').innerText = 'Category Name';
            document.getElementById('spViewHeaderlabel').innerText = 'Category';
            document.getElementById('spViewBodylabel').innerText = 'Category';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManageStateType": 
            var model2002 = {
                ID: rowId,
                Type: 'STATEView'
            }
            const jsonString2002 = JSON.stringify(model2002);
            var ScreenID2002 = "CATE_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString2002, screenId: ScreenID2002 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);

                LoadMasterDropdown('ddlEditCountry', {
                    parentId: 0,
                    masterTableTypeId: 0,
                    isMasterTableType: false,
                    isManualTable: true,
                    manualTable: 95,
                    manualTableId: 0,
                    ScreenId: "DropdownList_101"
                }, 'Select', false, response.data.data.Table[0].CountryId);

            });

            document.getElementById('spAddHeaderlabel').innerText = 'Create New State';
            document.getElementById('spAddBodylabel').innerText = 'State';
            document.getElementById('spEditHeaderlabel').innerText = 'Edit State';
            document.getElementById('spEditBodylabel').innerText = 'State Name';
            document.getElementById('spViewHeaderlabel').innerText = 'State';
            document.getElementById('spViewBodylabel').innerText = 'State';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';           
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'block';     
            break;
        case "ManageSubCategoryType":

            var model161 = {
                ID: rowId,
                Type: 'SubCategory'
            }
            const jsonString161 = JSON.stringify(model161);
            var ScreenID161 = "CATE_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString161, screenId: ScreenID161 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
                $('#hddEditGroupId').val(response.data.data.Table[0].GROUP_ID);
                $('#ddlEditCategory').val(response.data.data.Table[0].GROUP_ID).trigger('change');
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Sub Category';
            document.getElementById('spAddBodylabel').innerText = 'Category';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Sub Category';
            document.getElementById('spEditBodylabel').innerText = 'Sub Category Name';
            document.getElementById('spViewHeaderlabel').innerText = 'Sub Category';
            document.getElementById('spViewBodylabel').innerText = 'Sub Category';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'block';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManageOtherCharges":
            var model185 = {
                ID: rowId,
                TABLE_NAME: 'ERPOTHERCHARGES'
            }
            const jsonString185 = JSON.stringify(model185);
            var ScreenID185 = "OtherCharges_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString185, screenId: ScreenID185 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Brand Type';
            document.getElementById('spAddBodylabel').innerText = 'Charge Name';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Charge Name';
            document.getElementById('spEditBodylabel').innerText = 'Charge Name';
            document.getElementById('spViewHeaderlabel').innerText = 'Charge Name';
            document.getElementById('spViewBodylabel').innerText = 'Charge Name';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManageTerritoryType":
            var model193 = {
                ID: rowId,
                TABLE_NAME: 'ERPTERRITORY'
            }
            const jsonString193 = JSON.stringify(model193);
            var ScreenID193 = "Territory_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString193, screenId: ScreenID193 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Territory';
            document.getElementById('spAddBodylabel').innerText = 'Territory Name';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Territory Name';
            document.getElementById('spEditBodylabel').innerText = 'Territory Name';
            document.getElementById('spViewHeaderlabel').innerText = 'Territory Name';
            document.getElementById('spViewBodylabel').innerText = 'Territory Name';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManageClientBrandTypes":
            var model197 = {
                ID: rowId,
                TABLE_NAME: 'CLIENTBRANDTYPE'
            }
            const jsonString197 = JSON.stringify(model197);
            var ScreenID197 = "CBT_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString197, screenId: ScreenID197 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Client Brand Types';
            document.getElementById('spAddBodylabel').innerText = 'Client Brand Types';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Client Brand Types';
            document.getElementById('spEditBodylabel').innerText = 'Client Brand Types';
            document.getElementById('spViewHeaderlabel').innerText = 'Client Brand Types';
            document.getElementById('spViewBodylabel').innerText = 'Client Brand Types';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManagePaymentTerms":
            var model205 = {
                ID: rowId,
                TABLE_NAME: 'PaymentTerms'
            }
            const jsonString205 = JSON.stringify(model205);
            var ScreenID205 = "Pay_Terms_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString205, screenId: ScreenID205 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#txtEditTypeName').val(response.data.data.Table[0].FIELD_VALUE);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            $('#txtEditTypeName').off('input'); // Remove any previous bindings
            $('#txtEditTypeName').on('input', allowOnlyIntegers);
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Payment Terms';
            document.getElementById('spAddBodylabel').innerText = 'Payment Terms';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Payment Terms';
            document.getElementById('spEditBodylabel').innerText = 'Payment Terms';
            document.getElementById('spEditBodylabelName').innerText = 'Credit Days';
            document.getElementById('spViewHeaderlabel').innerText = 'Payment Terms';
            document.getElementById('spViewBodylabel').innerText = 'Payment Terms';
            document.getElementById('divCommonEditTypeName').style.display = 'block';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "TermsCondidtion":
            var model407 = {
                ID: rowId,
                TABLE_NAME: 'TermsConditions'
            }
            const jsonString407 = JSON.stringify(model407);
            var ScreenID407 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString407, screenId: ScreenID407 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#txtEditTypeTermDescriptions').val(response.data.data.Table[0].FIELD_VALUE);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Terms Conditions';
            document.getElementById('spAddBodylabel').innerText = 'Payment Terms';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Terms Conditions';
            document.getElementById('spEditBodylabel').innerText = 'Terms Conditions';
            document.getElementById('spEditBodylabeTermDescriptions').innerText = 'Descriptions';
            document.getElementById('spViewHeaderlabel').innerText = 'Terms Conditions';
            document.getElementById('spViewBodylabel').innerText = 'Terms Conditions';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'block';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManageSampleType":
            var model454 = {
                ID: rowId,
                TABLE_NAME: 'ERPSampleType'
            }
            const jsonString454 = JSON.stringify(model454);
            var ScreenID454 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString454, screenId: ScreenID454 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Sample Type';
            document.getElementById('spAddBodylabel').innerText = 'Sample Type';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Sample Type';
            document.getElementById('spEditBodylabel').innerText = 'Sample Type';
            document.getElementById('spViewHeaderlabel').innerText = 'Sample Type';
            document.getElementById('spViewBodylabel').innerText = 'Sample Type';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManageFormulationCategoriesType":
            var model465 = {
                ID: rowId,
                TABLE_NAME: 'ERPFormulationCategories'
            }
            const jsonString465 = JSON.stringify(model465);
            var ScreenID465 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString465, screenId: ScreenID465 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Formulation Categories';
            document.getElementById('spAddBodylabel').innerText = 'Formulation Categories';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Formulation Categories';
            document.getElementById('spEditBodylabel').innerText = 'Formulation Categories';
            document.getElementById('spViewHeaderlabel').innerText = 'Formulation Categories';
            document.getElementById('spViewBodylabel').innerText = 'Formulation Categories';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManagePackagingType":
            var model480 = {
                ID: rowId,
                TABLE_NAME: 'ERPPackaging'
            }
            const jsonString480 = JSON.stringify(model480);
            var ScreenID480 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString480, screenId: ScreenID480 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Packaging';
            document.getElementById('spAddBodylabel').innerText = 'Packaging';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Packaging';
            document.getElementById('spEditBodylabel').innerText = 'Packaging';
            document.getElementById('spViewHeaderlabel').innerText = 'Packaging';
            document.getElementById('spViewBodylabel').innerText = 'Packaging';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';     
            break;
        case "ManageOrderSizeType":
            var model481 = {
                ID: rowId,
                TABLE_NAME: 'ERPOrderSize'
            }
            const jsonString481 = JSON.stringify(model481);
            var ScreenID481 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString481, screenId: ScreenID481 }, 'GET', function (response) {
                $('#txtEditType').val(response.data.data.Table[0].FIELD_NAME);
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Order Size';
            document.getElementById('spAddBodylabel').innerText = 'Order Size';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Order Size';
            document.getElementById('spEditBodylabel').innerText = 'Order Size';
            document.getElementById('spViewHeaderlabel').innerText = 'Order Size';
            document.getElementById('spViewBodylabel').innerText = 'Order Size';
            document.getElementById('divCommonEditTypeName').style.display = 'none';
            document.getElementById('divCommonEditTermDescriptions').style.display = 'none';
            document.getElementById('divCommonTermDescriptions').style.display = 'none';
            document.getElementById('divCategory').style.display = 'none';
            document.getElementById('divCountry').style.display = 'none';
            document.getElementById('divEditCategory').style.display = 'none';
            document.getElementById('divEditCountry').style.display = 'none';           
            break;
        default:
    }
    $("#editbrandtype").modal('show');
    $("#viewbrandtype").modal('hide');
    $("#deleteCommonType").modal('hide');
}
function RowView(rowId) {
    switch (tabName) {
        case "ManageBrandType":
            var model = {
                ID: rowId,
                TABLE_NAME: 'ERPBRAND'
            }
            const jsonString = JSON.stringify(model);
            var ScreenID = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Brand Type';
            document.getElementById('spAddBodylabel').innerText = 'Brand Type';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Brand Type';
            document.getElementById('spEditBodylabel').innerText = 'Brand Type';
            document.getElementById('spViewHeaderlabel').innerText = 'Brand Type';
            document.getElementById('spViewBodylabel').innerText = 'Brand Type';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageLeadSource":
            var model102 = {
                ID: rowId,
                TABLE_NAME: 'ERPLEADSOURCE'
            }
            const jsonString102 = JSON.stringify(model102);
            var ScreenID102 = "Brand_101";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString102, screenId: ScreenID102 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Lead Source';
            document.getElementById('spAddBodylabel').innerText = 'Lead Source';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Lead Source';
            document.getElementById('spEditBodylabel').innerText = 'Lead Source';
            document.getElementById('spViewHeaderlabel').innerText = 'Lead Source';
            document.getElementById('spViewBodylabel').innerText = 'Lead Source';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageDepartmentType":
            var model120 = {
                ID: rowId,
                TABLE_NAME: 'ERPDEPT'
            }
            const jsonString120 = JSON.stringify(model120);
            var ScreenID120 = "Brand_101";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString120, screenId: ScreenID120 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Department Type';
            document.getElementById('spAddBodylabel').innerText = 'Department Type';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Department Type';
            document.getElementById('spEditBodylabel').innerText = 'Department Type';
            document.getElementById('spViewHeaderlabel').innerText = 'Department Type';
            document.getElementById('spViewBodylabel').innerText = 'Department Name';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageDesignationType":
            var model121 = {
                ID: rowId,
                TABLE_NAME: 'ERPDESIG'
            }
            const jsonString121 = JSON.stringify(model121);
            var ScreenID121 = "Brand_101";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString121, screenId: ScreenID121 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Designation Type';
            document.getElementById('spAddBodylabel').innerText = 'Designation Type';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Designation Type';
            document.getElementById('spEditBodylabel').innerText = 'Designation Type';
            document.getElementById('spViewHeaderlabel').innerText = 'Designation Type';
            document.getElementById('spViewBodylabel').innerText = 'Designation Name';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageCountryType":
            var model127 = {
                ID: rowId,
                TABLE_NAME: 'COUNTRY'
            }
            const jsonString127 = JSON.stringify(model127);
            var ScreenID127 = "Brand_101";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString127, screenId: ScreenID127 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                document.getElementById('txtCommonName').innerText = response.data.data.Table[0].FIELD_VALUE;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });

            document.getElementById('spAddHeaderlabel').innerText = 'Manage Country';
            document.getElementById('spAddBodylabel').innerText = 'Country';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Country';
            document.getElementById('spEditBodylabel').innerText = 'Country';
            document.getElementById('spViewHeaderlabel').innerText = 'Manage Country';
            document.getElementById('spViewBodylabel').innerText = 'Country Name';

            document.getElementById('divCommonType').style.display = 'block';
            document.getElementById('spViewBodylabelName').innerText = 'Country Code';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageStateType":
            var model128 = {
                ID: rowId,
                TABLE_NAME: 'STATEView'
            }
            const jsonString128 = JSON.stringify(model128);
            var ScreenID128 = "Brand_101";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString128, screenId: ScreenID128 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                document.getElementById('txtCommonName').innerText = response.data.data.Table[0].Country;                
                document.getElementById('txtCommonCodeType').innerText = response.data.data.Table[0].FIELD_VALUE;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Manage State';
            document.getElementById('spAddBodylabel').innerText = 'State';
            document.getElementById('spEditHeaderlabel').innerText = 'Update State';
            document.getElementById('spEditBodylabel').innerText = 'State';
            document.getElementById('spViewHeaderlabel').innerText = 'Manage State';
            document.getElementById('spViewBodylabel').innerText = 'State Name';
            document.getElementById('divCommonType').style.display = 'block';
            document.getElementById('spViewBodylabelName').innerText = 'Country Name';
            document.getElementById('txtCommonName').innerText = 'India';
            document.getElementById('divCommonCode').style.display = 'block';
            document.getElementById('spViewBodyCommonCodelabel').innerText = 'State Code';
            break;
        case "ManageTaxCodeType":
            var model137 = {
                ID: rowId,
                TABLE_NAME: 'TaxCode'
            }
            const jsonString137 = JSON.stringify(model137);
            var ScreenID137 = "TaxCode_101";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString137, screenId: ScreenID137 }, 'GET', function (response) {
                document.getElementById('txtCommonName').innerText = response.data.data.Table[0].FIELD_VALUE;
                document.getElementById('txtCommonCodeType').innerText = response.data.data.Table[0].FIELD_NAME;
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].TAXRate;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Manage Tax Code';
            document.getElementById('spAddBodylabel').innerText = 'Tax Code';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Tax Code';
            document.getElementById('spEditBodylabel').innerText = 'Tax Code';
            document.getElementById('spViewHeaderlabel').innerText = 'Manage Tax Code';
            document.getElementById('divCommonType').style.display = 'block';
            document.getElementById('divCommonCode').style.display = 'block';
            document.getElementById('spViewBodylabelName').innerText = 'Tax Code ';
            document.getElementById('spViewBodyCommonCodelabel').innerText = 'Tax Code Name';
            document.getElementById('spViewBodylabel').innerText = 'Tax Rate';


            break;
        case "ManageHSNType":
            var model133 = {
                ID: rowId,
                TABLE_NAME: 'HSN'
            }
            const jsonString133 = JSON.stringify(model133);
            var ScreenID133 = "Brand_101";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString133, screenId: ScreenID133 }, 'GET', function (response) {
                document.getElementById('txtCommonCodeType').innerText = response.data.data.Table[0].FIELD_NAME;
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_VALUE;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Manage HSN';
            document.getElementById('spAddBodylabel').innerText = 'HSN';
            document.getElementById('spEditHeaderlabel').innerText = 'Update HSN';
            document.getElementById('spEditBodylabel').innerText = 'HSN';
            document.getElementById('spViewHeaderlabel').innerText = 'Manage HSN';
            document.getElementById('spViewBodylabel').innerText = 'HSN Name';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = 'Country Name';
            document.getElementById('txtCommonName').innerText = 'India';
            document.getElementById('divCommonCode').style.display = 'block';
            document.getElementById('spViewBodyCommonCodelabel').innerText = 'HSN Code';
            break;
        case "ManageSACType":
            var model134 = {
                ID: rowId,
                TABLE_NAME: 'HSN'
            }
            const jsonString134 = JSON.stringify(model134);
            var ScreenID134 = "Brand_101";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString134, screenId: ScreenID134 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                document.getElementById('txtCommonCodeType').innerText = response.data.data.Table[0].FIELD_VALUE;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Manage SAC';
            document.getElementById('spAddBodylabel').innerText = 'SAC';
            document.getElementById('spEditHeaderlabel').innerText = 'Update SAC';
            document.getElementById('spEditBodylabel').innerText = 'SAC';
            document.getElementById('spViewHeaderlabel').innerText = 'Manage SAC';
            document.getElementById('spViewBodylabel').innerText = 'SAC Name';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = 'Country Name';
            document.getElementById('txtCommonName').innerText = 'India';
            document.getElementById('divCommonCode').style.display = 'block';
            document.getElementById('spViewBodyCommonCodelabel').innerText = 'SAC Code';
            break;
        case "TaxOtherCharges":
            var model451 = {
                ID: rowId,
                TABLE_NAME: 'TaxOtherCharges'
            }
            const jsonString451 = JSON.stringify(model451);
            var ScreenID451 = "TaxOtherCharges_101";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString451, screenId: ScreenID451 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                document.getElementById('txtCommonCodeType').innerText = response.data.data.Table[0].FIELD_VALUE;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Manage Other Charges';
            document.getElementById('spAddBodylabel').innerText = 'Other Charges';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Other Charges';
            document.getElementById('spEditBodylabel').innerText = 'Other Charges';
            document.getElementById('spViewHeaderlabel').innerText = 'Manage Other Charges';
            document.getElementById('spViewBodylabel').innerText = 'Other Charges Name';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = 'Country Name';
            document.getElementById('txtCommonName').innerText = 'India';
            document.getElementById('divCommonCode').style.display = 'block';
            document.getElementById('spViewBodyCommonCodelabel').innerText = 'Other Charges Code';
            break;
        case "ManageUoMType":
            var model140 = {
                ID: rowId,
                TABLE_NAME: 'UNIT'
            }
            const jsonString140 = JSON.stringify(model140);
            var ScreenID140 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString140, screenId: ScreenID140 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_VALUE;
                document.getElementById('txtCommonName').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New UoM Code';
            document.getElementById('spAddBodylabel').innerText = 'UoM Code';
            document.getElementById('spEditHeaderlabel').innerText = 'Update UoM Code';
            document.getElementById('spEditBodylabel').innerText = 'UoM Code';
            document.getElementById('spViewHeaderlabel').innerText = 'UoM Code';
            document.getElementById('spViewBodylabel').innerText = 'UoM Name';
            document.getElementById('divCommonType').style.display = 'block';
            document.getElementById('spViewBodylabelName').innerText = 'UoM Code ';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageCurrencyType":
            var model147 = {
                ID: rowId,
                TABLE_NAME: 'CURRENCY'
            }
            const jsonString147 = JSON.stringify(model147);
            var ScreenID147 = "CURR_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString147, screenId: ScreenID147 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_VALUE;
                document.getElementById('txtCommonCodeType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Currency Name';
            document.getElementById('spAddBodylabel').innerText = 'Currency Code';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Currency Name';
            document.getElementById('spEditBodylabel').innerText = 'Currency Code';
            document.getElementById('spViewHeaderlabel').innerText = 'Currency Name';
            document.getElementById('spViewBodylabel').innerText = 'Currency Name';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = 'Currency Name';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'block';
            document.getElementById('spViewBodyCommonCodelabel').innerText = 'Currency Code';
            //document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageCategoryType":
            var model151 = {
                ID: rowId,
                Type: 'Category'
            }
            const jsonString151 = JSON.stringify(model151);
            var ScreenID151 = "CATE_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString151, screenId: ScreenID151 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Category';
            document.getElementById('spAddBodylabel').innerText = 'Category';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Category';
            document.getElementById('spEditBodylabel').innerText = 'Category';
            document.getElementById('spViewHeaderlabel').innerText = 'Category';
            document.getElementById('spViewBodylabel').innerText = 'Category Name';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageSubCategoryType":
            var model162 = {
                ID: rowId,
                Type: 'SubCategory'
            }
            const jsonString162 = JSON.stringify(model162);
            var ScreenID162 = "CATE_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString162, screenId: ScreenID162 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                let categoryName = '';
                let groupId = response.data.data.Table[0].GROUP_ID.toString();
                let dropdown = document.getElementById('ddlEditCategory');
                for (let i = 0; i < dropdown.options.length; i++) {
                    if (dropdown.options[i].value === groupId) {
                        categoryName = dropdown.options[i].text;  // Print the text of the option
                        break;
                    }
                }
                document.getElementById('txtCommonName').innerText = categoryName;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Sub Category';
            document.getElementById('spAddBodylabel').innerText = 'Sub Category';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Sub Category';
            document.getElementById('spEditBodylabel').innerText = 'Sub Category';
            document.getElementById('spViewHeaderlabel').innerText = 'Sub Category';
            document.getElementById('spViewBodylabel').innerText = 'Sub Category Name';
            document.getElementById('divCommonType').style.display = 'block';
            document.getElementById('spViewBodylabelName').innerText = 'Category Name';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageOtherCharges":
            var model186 = {
                ID: rowId,
                TABLE_NAME: 'ERPOTHERCHARGES'
            }
            const jsonString186 = JSON.stringify(model186);
            var ScreenID186 = "OtherCharges_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString186, screenId: ScreenID186 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create Charge Name';
            document.getElementById('spAddBodylabel').innerText = 'Charge Name';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Charge Name';
            document.getElementById('spEditBodylabel').innerText = 'Charge Name';
            document.getElementById('spViewHeaderlabel').innerText = 'Charge Name';
            document.getElementById('spViewBodylabel').innerText = 'Charge Name';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageTerritoryType":
            var model194 = {
                ID: rowId,
                TABLE_NAME: 'ERPTERRITORY'
            }
            const jsonString194 = JSON.stringify(model194);
            var ScreenID194 = "Territory_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString194, screenId: ScreenID194 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create Territory Name';
            document.getElementById('spAddBodylabel').innerText = 'Territory Name';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Territory Name';
            document.getElementById('spEditBodylabel').innerText = 'Territory Name';
            document.getElementById('spViewHeaderlabel').innerText = 'Territory Name';
            document.getElementById('spViewBodylabel').innerText = 'Territory Name';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageClientBrandTypes":
            var model198 = {
                ID: rowId,
                TABLE_NAME: 'CLIENTBRANDTYPE'
            }
            const jsonString198 = JSON.stringify(model198);
            var ScreenID198 = "CBT_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString198, screenId: ScreenID198 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create Client Brand Types';
            document.getElementById('spAddBodylabel').innerText = 'Client Brand Types';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Client Brand Types';
            document.getElementById('spEditBodylabel').innerText = 'Client Brand Types';
            document.getElementById('spViewHeaderlabel').innerText = 'Client Brand Types';
            document.getElementById('spViewBodylabel').innerText = 'Client Brand Types';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManagePaymentTerms":
            var model206 = {
                ID: rowId,
                TABLE_NAME: 'PaymentTerms'
            }
            const jsonString206 = JSON.stringify(model206);
            var ScreenID206 = "Pay_Terms_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString206, screenId: ScreenID206 }, 'GET', function (response) {
                document.getElementById('txtCommonCodeType').innerText = response.data.data.Table[0].FIELD_NAME;
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_VALUE;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Payment Terms';
            document.getElementById('spAddBodylabel').innerText = 'Payment Terms';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Payment Terms';
            document.getElementById('spEditBodylabel').innerText = 'Payment Terms';
            document.getElementById('spViewHeaderlabel').innerText = 'Payment Terms';
            document.getElementById('spViewBodylabel').innerText = 'Credit Days';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'block';
            document.getElementById('spViewBodyCommonCodelabel').innerText = 'Payment Terms';
            //document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "TermsCondidtion":
            var model406 = {
                ID: rowId,
                TABLE_NAME: 'TermsConditions'
            }
            const jsonString406 = JSON.stringify(model406);
            var ScreenID406 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString406, screenId: ScreenID406 }, 'GET', function (response) {
                document.getElementById('txtCommonCodeType').innerText = response.data.data.Table[0].FIELD_NAME;
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_VALUE;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Terms Conditions';
            document.getElementById('spAddBodylabel').innerText = 'Terms Conditions';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Terms Conditions';
            document.getElementById('spEditBodylabel').innerText = 'Terms Conditions';
            document.getElementById('spViewHeaderlabel').innerText = 'Terms Conditions';
            document.getElementById('spViewBodylabel').innerText = 'Descriptions';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'block';
            document.getElementById('spViewBodyCommonCodelabel').innerText = 'Terms Conditions';
            //document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageSampleType":
            var model455 = {
                ID: rowId,
                TABLE_NAME: 'ERPSampleType'
            }
            const jsonString455 = JSON.stringify(model455);
            var ScreenID455 = "TermsConditions_100";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString455, screenId: ScreenID455 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Sample Type';
            document.getElementById('spAddBodylabel').innerText = 'Sample Type';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Sample Type';
            document.getElementById('spEditBodylabel').innerText = 'Sample Type';
            document.getElementById('spViewHeaderlabel').innerText = 'Sample Type';
            document.getElementById('spViewBodylabel').innerText = 'Sample Type';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageFormulationCategoriesType":
            var model466 = {
                ID: rowId,
                TABLE_NAME: 'ERPFormulationCategories'
            }
            const jsonString466 = JSON.stringify(model466);
            var ScreenID466 = "TermsConditions_100";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString466, screenId: ScreenID466 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Sample Type';
            document.getElementById('spAddBodylabel').innerText = 'Sample Type';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Sample Type';
            document.getElementById('spEditBodylabel').innerText = 'Sample Type';
            document.getElementById('spViewHeaderlabel').innerText = 'Sample Type';
            document.getElementById('spViewBodylabel').innerText = 'Sample Type';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManagePackagingType":
            var model478 = {
                ID: rowId,
                TABLE_NAME: 'ERPPackaging'
            }
            const jsonString478 = JSON.stringify(model478);
            var ScreenID478 = "TermsConditions_100";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString478, screenId: ScreenID478 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Packaging Type';
            document.getElementById('spAddBodylabel').innerText = 'Packaging Type';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Packaging Type';
            document.getElementById('spEditBodylabel').innerText = 'Packaging Type';
            document.getElementById('spViewHeaderlabel').innerText = 'Packaging Type';
            document.getElementById('spViewBodylabel').innerText = 'Packaging Type';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        case "ManageOrderSizeType":
            var model479 = {
                ID: rowId,
                TABLE_NAME: 'ERPOrderSize'
            }
            const jsonString479 = JSON.stringify(model479);
            var ScreenID479 = "TermsConditions_100";
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString479, screenId: ScreenID479 }, 'GET', function (response) {
                document.getElementById('txtCommonType').innerText = response.data.data.Table[0].FIELD_NAME;
                $('#hddEditRowId').val(response.data.data.Table[0].ID);
            });
            document.getElementById('spAddHeaderlabel').innerText = 'Create New Order Size Type';
            document.getElementById('spAddBodylabel').innerText = 'Order Size Type';
            document.getElementById('spEditHeaderlabel').innerText = 'Update Order Size Type';
            document.getElementById('spEditBodylabel').innerText = 'Order Size Type';
            document.getElementById('spViewHeaderlabel').innerText = 'Order Size Type';
            document.getElementById('spViewBodylabel').innerText = 'Order Size Type';
            document.getElementById('divCommonType').style.display = 'none';
            document.getElementById('spViewBodylabelName').innerText = '';
            document.getElementById('txtCommonName').innerText = '';
            document.getElementById('divCommonCode').style.display = 'none';
            document.getElementById('spViewBodyCommonCodelabel').innerText = '';
            document.getElementById('txtCommonCodeType').innerText = '';
            break;
        default:
    }
    $("#managebrandtype").modal('show');
    $("#addbrandtype").modal('hide');
    $("#editbrandtype").modal('hide');
    $("#viewbrandtype").modal('show');
}
function RowDelete(rowId, txtMsg) {
    document.getElementById('spDeleteMsg').innerText = txtMsg;
    document.getElementById('spActiveDeleteMsg').innerText = txtMsg;
    $('#hddEditRowId').val(rowId);
    $('#hddEditLocationRowId').val('');
    $('#hddEditWarehouseRowId').val('');
    $('#hddEditQCPparameterRowId').val('');
    $('#hddEditTransportationRowId').val('');
    $("#managebrandtype").modal('show');
    $("#addbrandtype").modal('hide');
    $("#editbrandtype").modal('hide');
    $("#viewbrandtype").modal('hide');
    //$("#deleteCommonType").modal('show');
}
function CloseDelete() {
    var del_id = $('#hddEditRowId').val() ;
    if (del_id != "") {
        if ($(`#active_${del_id}`).prop('checked')) {
            $(`#active_${del_id}`).prop('checked', false);
        }
        else {
            $(`#active_${del_id}`).prop('checked', true);
        }
    }
    else if ($('#hddEditWarehouseRowId').val()!=""){
        var dele_id = $('#hddEditWarehouseRowId').val();
        if ($(`#activeQm_${dele_id}`).prop('checked')) {
            $(`#activeQm_${dele_id}`).prop('checked', false);
        }
        else {
            $(`#activeQm_${dele_id}`).prop('checked', true);
        }
    } 
    else if ($('#hddEditLocationRowId').val() != "") {
        var dele_id = $('#hddEditLocationRowId').val();
        if ($(`#activelc_${dele_id}`).prop('checked')) {
            $(`#activelc_${dele_id}`).prop('checked', false);
        }
        else {
            $(`#activelc_${dele_id}`).prop('checked', true);
        }
    }
    else if ($('#hddEditTransportationRowId').val() != "") {
        var dele_id = $('#hddEditTransportationRowId').val();
        if ($(`#activetc_${dele_id}`).prop('checked')) {
            $(`#activetc_${dele_id}`).prop('checked', false);
        }
        else {
            $(`#activetc_${dele_id}`).prop('checked', true);
        }
    }
    else if ($('#hddEditQCPparameterRowId').val() != "") {
        var dele_id = $('#hddEditQCPparameterRowId').val();
        if ($(`#activeQCPM_${dele_id}`).prop('checked')) {
            $(`#activeQCPM_${dele_id}`).prop('checked', false);
        }
        else {
            $(`#activeQCPM_${dele_id}`).prop('checked', true);
        }
    }
}
function MasterSaveType() {
    var valid = true;
    if (checkValidationOnSubmit('Mandatory') == false) {
        valid = false;
    }
    if (valid == true) {
        switch (tabName) {
            case "ManageBrandType":
                var model = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPBRAND'
                };
                const jsonString = JSON.stringify(model);
                let GenericModeldata =
                {
                    ScreenID: "Brand_101",
                    Operation: "A",
                    ModelData: jsonString
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    //After add type need to refresh list.
                    CommonGetAllType('ERPBRAND');
                });
                break;
            case "ManageLeadSource":
                var leadsourcemodel = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPLEADSOURCE'
                };
                const jsonLeadSourceString = JSON.stringify(leadsourcemodel);

                let GenericModeldatals =
                {
                    ScreenID: "Brand_101",
                    Operation: "A",
                    ModelData: jsonLeadSourceString
                };

                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldatals, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    CommonGetAllType('ERPLEADSOURCE');
                });
                break;
            case "ManageDepartmentType":
                var model111 = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPDEPT'
                };
                const jsonString111 = JSON.stringify(model111);

                let GenericModeldatals111 =
                {
                    ScreenID: "Brand_101",
                    Operation: "A",
                    ModelData: jsonString111
                };

                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldatals111, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    CommonGetAllType('ERPDEPT');
                });
                break;
            case "ManageDesignationType":
                var model112 = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPDESIG'
                };
                const jsonString112 = JSON.stringify(model112);

                let GenericModeldatals112 =
                {
                    ScreenID: "Brand_101",
                    Operation: "A",
                    ModelData: jsonString112
                };

                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldatals112, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    CommonGetAllType('ERPDESIG');
                });
                break;
            case "ManageCurrencyType":
                
                var valid = true;
                if (checkValidationOnSubmit('Mandatory') == false) {
                    valid = false;
                }
                if (checkValidationOnSubmit('MandatoryCurrency') == false) {
                    valid = false;
                }
                if (valid == true) {
                    var model143 = {
                        Currency_Code: $('#txtType').val(),
                        Currency_Name: $('#txtCommonTypeName').val(),
                        TABLE_NAME: 'CURRENCY'
                    };
                    const jsonString143 = JSON.stringify(model143);
                    let GenericModeldata143 =
                    {
                        ScreenID: "CURR_101",
                        Operation: "A",
                        ModelData: jsonString143
                    };
                    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata143, 'POST', function (response) {
                        $("#addbrandtype").modal('hide');
                        //After add type need to refresh list.
                        CommonGetAllType('CURRENCY');
                    });
                }
                break;
            case "ManageCategoryType":
                var model153 = {
                    ID: 0,
                    ITEM_NAME: $('#txtType').val(),
                    DESCRIPTION: '',
                    GROUP_ID: 0
                };
                const jsonString153 = JSON.stringify(model153);
                let GenericModeldata153 =
                {
                    ScreenID: "CATE_101",
                    Operation: "A",
                    ModelData: jsonString153
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata153, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    //After add type need to refresh list.
                    CommonGetAllType('CATEGORY');
                });
                break;
            case "ManageSubCategoryType":
                var valid = true;
                if (checkValidationOnSubmit('MandatoryAddSubCat') == false) {
                    valid = false;
                }
                if (valid == true) {
                    var model164 = {
                        ID: 0,
                        ITEM_NAME: $('#txtType').val(),
                        DESCRIPTION: '',
                        GROUP_ID: $('#ddlCategory').val()
                    };
                    const jsonString164 = JSON.stringify(model164);
                    let GenericModeldata164 =
                    {
                        ScreenID: "CATE_101",
                        Operation: "A",
                        ModelData: jsonString164
                    };
                    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata164, 'POST', function (response) {
                        $("#addbrandtype").modal('hide');
                        //After add type need to refresh list.
                        CommonGetAllType('SUBCATEGORY');
                    });
                    break;
                }
            case "ManageOtherCharges":
                var model184 = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPOTHERCHARGES'
                };
                const jsonString184 = JSON.stringify(model184);
                let GenericModeldata184 =
                {
                    ScreenID: "OtherCharges_101",
                    Operation: "A",
                    ModelData: jsonString184
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata184, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    //After add type need to refresh list.
                    CommonGetAllType('ERPOTHERCHARGES');
                });
                break;
            case "ManageTerritoryType":
                var model190 = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPTERRITORY'
                };
                const jsonString190 = JSON.stringify(model190);
                let GenericModeldata190 =
                {
                    ScreenID: "Territory_101",
                    Operation: "A",
                    ModelData: jsonString190
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata190, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    //After add type need to refresh list.
                    CommonGetAllType('ERPTERRITORY');
                });
                break;
            case "ManageClientBrandTypes":
                var model199 = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'CLIENTBRANDTYPE'
                };
                const jsonString199 = JSON.stringify(model199);
                let GenericModeldata199 =
                {
                    ScreenID: "CBT_101",
                    Operation: "A",
                    ModelData: jsonString199
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata199, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    //After add type need to refresh list.
                    CommonGetAllType('CLIENTBRANDTYPE');
                });
                break;
            case "ManagePaymentTerms":
                var model207 = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: $('#txtCommonTypeName').val(),
                    TABLE_NAME: 'PaymentTerms'
                };
                const jsonString207 = JSON.stringify(model207);
                let GenericModeldata207 =
                {
                    ScreenID: "Pay_Terms_101",
                    Operation: "A",
                    ModelData: jsonString207
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata207, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    //After add type need to refresh list.
                    CommonGetAllType('PAYMENTTERMS');
                });
                break;
            case "TermsCondidtion":
                var model404 = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: $('#txtCommonTermDescriptions').val(),
                    TABLE_NAME: 'TermsConditions'
                };
                const jsonString404 = JSON.stringify(model404);
                let GenericModeldata404 =
                {
                    ScreenID: "TermsConditions_100",
                    Operation: "A",
                    ModelData: jsonString404
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata404, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    //After add type need to refresh list.
                    CommonGetAllType('TERMSCONDITIONS');
                });
                break;
            case "ManageSampleType":
                var model456 = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPSampleType'
                };
                const jsonString456 = JSON.stringify(model456);

                let Modeldatals456 =
                {
                    ScreenID: "TermsConditions_100",
                    Operation: "A",
                    ModelData: jsonString456
                };

                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', Modeldatals456, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    CommonGetAllType('SAMPLETYPE');
                });
                break;
            case "ManageFormulationCategoriesType":
                var model462 = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPFormulationCategories'
                };
                const jsonString462 = JSON.stringify(model462);

                let Modeldatals462 =
                {
                    ScreenID: "TermsConditions_100",
                    Operation: "A",
                    ModelData: jsonString462
                };

                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', Modeldatals462, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    CommonGetAllType('FORMULATIONCATEGORIES');
                });
                break;
            case "ManagePackagingType":
                var model473 = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPPackaging'
                };
                const jsonString473 = JSON.stringify(model473);

                let Modeldatals473 =
                {
                    ScreenID: "TermsConditions_100",
                    Operation: "A",
                    ModelData: jsonString473
                };

                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', Modeldatals473, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    CommonGetAllType('PACKAGING');
                });
                break;
            case "ManageOrderSizeType":
                var model474 = {
                    FIELD_NAME: $('#txtType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPOrderSize'
                };
                const jsonString474 = JSON.stringify(model474);

                let Modeldatals474 =
                {
                    ScreenID: "TermsConditions_100",
                    Operation: "A",
                    ModelData: jsonString474
                };

                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', Modeldatals474, 'POST', function (response) {
                    $("#addbrandtype").modal('hide');
                    CommonGetAllType('ORDERSIZE');
                });
                break;
            case "ManageStateType":

                if (!checkValidationOnSubmit('MandatoryAddCountry')) {
                    return;
                }

                var model475 = {
                    id: 0,
                    Type: 6,
                    State_Name: $('#txtType').val(),
                    CountryId: $('#ddlCountry').val(),
                };
                const jsonString475 = JSON.stringify(model475);

                let Modeldatals475 =
                {
                    ScreenID: "QCPM_101",
                    Operation: "A",
                    ModelData: jsonString475
                };

                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', Modeldatals475, 'POST', function (response) {
                    if (response.ValidationInput == 1) {
                        $("#addbrandtype").modal('hide');
                        CommonGetAllType('ERPSTATE');
                    }
                });
                break;
            default:
        }
    }
}
function CommonEditSave() {
    var valid = true;
    if (checkValidationOnSubmit('EditMandatory') == false) {
        valid = false;
    }
    if (valid == true) {
        switch (tabName) {
            case "ManageBrandType":
                var model = {
                    ID: $('#hddEditRowId').val(),
                    FIELD_NAME: $('#txtEditType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPBRAND'
                };
                const jsonString = JSON.stringify(model);
                let GenericModeldata =
                {
                    ScreenID: "Brand_101",
                    Operation: "U",
                    ModelData: jsonString
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                    CommonGetAllType('ERPBRAND')
                });
                //CommonGetAllType('ERPBRAND')
                break;
            case "ManageLeadSource":
                var model103 = {
                    ID: $('#hddEditRowId').val(),
                    FIELD_NAME: $('#txtEditType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPLEADSOURCE'
                };
                const jsonString103 = JSON.stringify(model103);
                let GenericModeldata103 =
                {
                    ScreenID: "Brand_101",
                    Operation: "U",
                    ModelData: jsonString103
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata103, 'POST', function (response) {
                    CommonGetAllType('ERPLEADSOURCE')
                });
                //CommonGetAllType('ERPLEADSOURCE')
                break;
            case "ManageDepartmentType":
                var model118 = {
                    ID: $('#hddEditRowId').val(),
                    FIELD_NAME: $('#txtEditType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPDEPT'
                };
                const jsonString118 = JSON.stringify(model118);
                let GenericModeldata118 =
                {
                    ScreenID: "Brand_101",
                    Operation: "U",
                    ModelData: jsonString118
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata118, 'POST', function (response) {
                    CommonGetAllType('ERPDEPT')
                });
                //CommonGetAllType('ERPDEPT')
                break;
            case "ManageDesignationType":
                var model119 = {
                    ID: $('#hddEditRowId').val(),
                    FIELD_NAME: $('#txtEditType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPDESIG'
                };
                const jsonString119 = JSON.stringify(model119);
                let GenericModeldata119 =
                {
                    ScreenID: "Brand_101",
                    Operation: "U",
                    ModelData: jsonString119
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata119, 'POST', function (response) {
                    CommonGetAllType('ERPDESIG')
                });
                //CommonGetAllType('ERPDESIG')
                break;
            case "ManageCurrencyType":
                valid = true;
                if (checkValidationOnSubmit('MandatoryCurrencyEdit') == false) {
                    valid = false;
                }
                if (valid == true) {
                    var model146 = {
                        ID: $('#hddEditRowId').val(),
                        Currency_Code: $('#txtEditType').val(),
                        Currency_Name: $('#txtEditTypeName').val(),
                        TABLE_NAME: 'CURRENCY'
                    };
                    const jsonString146 = JSON.stringify(model146);
                    let GenericModeldata146 =
                    {
                        ScreenID: "CURR_101",
                        Operation: "U",
                        ModelData: jsonString146
                    };
                    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata146, 'POST', function (response) {
                        CommonGetAllType('CURRENCY')
                    });
                    /*CommonGetAllType('CURRENCY')*/
                }
                break;
            case "ManageCategoryType":
                var model156 = {
                    ID: $('#hddEditRowId').val(),
                    ITEM_NAME: $('#txtEditType').val(),
                    DESCRIPTION: '',
                    GROUP_ID: 0
                };
                const jsonString156 = JSON.stringify(model156);
                let GenericModeldata156 =
                {
                    ScreenID: "CATE_101",
                    Operation: "U",
                    ModelData: jsonString156
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata156, 'POST', function (response) {
                    CommonGetAllType('CATEGORY');
                });
                //After add type need to refresh list.
                /*CommonGetAllType('CATEGORY');*/
                break;
            case "ManageSubCategoryType":
                var valid = true;
                if (checkValidationOnSubmit('MandatoryEditSubCat') == false) {
                    valid = false;
                }
                if (valid == true) {
                    var model158 = {
                        ID: $('#hddEditRowId').val(),
                        ITEM_NAME: $('#txtEditType').val(),
                        DESCRIPTION: '',
                        GROUP_ID: $('#ddlEditCategory').val()
                    };
                    const jsonString158 = JSON.stringify(model158);
                    let GenericModeldata158 =
                    {
                        ScreenID: "CATE_101",
                        Operation: "U",
                        ModelData: jsonString158
                    };
                    CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata158, 'POST', function (response) {
                        CommonGetAllType('SUBCATEGORY');
                    });
                    //After add type need to refresh list.
                    /*CommonGetAllType('SUBCATEGORY');*/
                }
                break;
            case "ManageOtherCharges":
                var model188 = {
                    ID: $('#hddEditRowId').val(),
                    FIELD_NAME: $('#txtEditType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPOTHERCHARGES'
                };
                const jsonString188 = JSON.stringify(model188);
                let GenericModeldata188 =
                {
                    ScreenID: "OtherCharges_101",
                    Operation: "U",
                    ModelData: jsonString188
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata188, 'POST', function (response) {
                    CommonGetAllType('ERPOTHERCHARGES')
                });
                //CommonGetAllType('ERPOTHERCHARGES')
                break;
            case "ManageTerritoryType":
                var model189 = {
                    ID: $('#hddEditRowId').val(),
                    FIELD_NAME: $('#txtEditType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPTERRITORY'
                };
                const jsonString189 = JSON.stringify(model189);
                let GenericModeldata189 =
                {
                    ScreenID: "Territory_101",
                    Operation: "U",
                    ModelData: jsonString189
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata189, 'POST', function (response) {
                    CommonGetAllType('ERPTERRITORY')
                });
                //CommonGetAllType('ERPTERRITORY')
                break;
            case "ManageClientBrandTypes":
                var model200 = {
                    ID: $('#hddEditRowId').val(),
                    FIELD_NAME: $('#txtEditType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'CLIENTBRANDTYPE'
                };
                const jsonString200 = JSON.stringify(model200);
                let GenericModeldata200 =
                {
                    ScreenID: "CBT_101",
                    Operation: "U",
                    ModelData: jsonString200
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata200, 'POST', function (response) {
                    CommonGetAllType('CLIENTBRANDTYPE')
                });
                //CommonGetAllType('CLIENTBRANDTYPE')
                break;
            case "ManagePaymentTerms":
                var model208 = {
                    ID: $('#hddEditRowId').val(),
                    FIELD_NAME: $('#txtEditType').val(),
                    FIELD_VALUE: $('#txtEditTypeName').val(),
                    TABLE_NAME: 'PaymentTerms'
                };
                const jsonString208 = JSON.stringify(model208);
                let GenericModeldata208 =
                {
                    ScreenID: "Pay_Terms_101",
                    Operation: "U",
                    ModelData: jsonString208
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata208, 'POST', function (response) {
                    CommonGetAllType('PAYMENTTERMS')
                });
                //CommonGetAllType('PAYMENTTERMS')
                break;
            case "TermsCondidtion":
                var model405 = {
                    ID: $('#hddEditRowId').val(),
                    FIELD_NAME: $('#txtEditType').val(),
                    FIELD_VALUE: $('#txtEditTypeTermDescriptions').val(),
                    TABLE_NAME: 'TermsConditions'
                };
                const jsonString405 = JSON.stringify(model405);
                let GenericModeldata405 =
                {
                    ScreenID: "TermsConditions_100",
                    Operation: "U",
                    ModelData: jsonString405
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata405, 'POST', function (response) {
                    CommonGetAllType('TERMSCONDITIONS')
                });
                //CommonGetAllType('TERMSCONDITIONS')
                break;
            case "ManageFormulationCategoriesType":
                var model464 = {
                    ID: $('#hddEditRowId').val(),
                    FIELD_NAME: $('#txtEditType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPFormulationCategories'
                };
                const jsonString464 = JSON.stringify(model464);
                let GenericModeldata464 =
                {
                    ScreenID: "TermsConditions_100",
                    Operation: "U",
                    ModelData: jsonString464
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata464, 'POST', function (response) {
                    CommonGetAllType('FORMULATIONCATEGORIES')
                });
                break;
            case "ManagePackagingType":
                var model475 = {
                    ID: $('#hddEditRowId').val(),
                    FIELD_NAME: $('#txtEditType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPPackaging'
                };
                const jsonString475 = JSON.stringify(model475);
                let GenericModeldata475 =
                {
                    ScreenID: "TermsConditions_100",
                    Operation: "U",
                    ModelData: jsonString475
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata475, 'POST', function (response) {
                    CommonGetAllType('PACKAGING')
                });
                break;
            case "ManageOrderSizeType":
                var model476 = {
                    ID: $('#hddEditRowId').val(),
                    FIELD_NAME: $('#txtEditType').val(),
                    FIELD_VALUE: '',
                    TABLE_NAME: 'ERPOrderSize'
                };
                const jsonString476 = JSON.stringify(model476);
                let GenericModeldata476 =
                {
                    ScreenID: "TermsConditions_100",
                    Operation: "U",
                    ModelData: jsonString476
                };
                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata476, 'POST', function (response) {
                    CommonGetAllType('ORDERSIZE')
                });
                break;
            case "ManageStateType":
                

                if (!checkValidationOnSubmit('MandatoryEditCountry')) {
                    return;
                }

                var model475 = {
                    id: $('#hddEditRowId').val(),
                    Type: 6,
                    State_Name: $('#txtEditType').val(),
                    CountryId: $('#ddlEditCountry').val(),
                };
                const jsonString492 = JSON.stringify(model475);

                let Modeldatals475 =
                {
                    ScreenID: "QCPM_101",
                    Operation: "A",
                    ModelData: jsonString492
                };

                CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', Modeldatals475, 'POST', function (response) {
                    if (response.ValidationInput == 1) {
                        $("#addbrandtype").modal('hide');
                        CommonGetAllType('ERPSTATE');
                    }
                });
                break;
            default:
        }
        if (valid == true) {
            $("#editbrandtype").modal('hide');
        }
    }
}
function MasterDeleteType() {
    switch (tabName) {
        case "ManageBrandType":
            var model = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'ERPBRAND'
            };
            const jsonString = JSON.stringify(model);

            let GenericModeldata =
            {
                ScreenID: "Brand_101",
                Operation: "D",
                ModelData: jsonString
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('ERPBRAND');
            });
            
            break;
        case "ManageQuality":
            var model = {
                ID: $('#hddEditQCPparameterRowId').val(),
                TABLE_NAME: 'ERP_QCPM'
            };
            const jsonString6969 = JSON.stringify(model);

            let GenericModeldata6969 =
            {
                ScreenID: "QCPM_101",
                Operation: "D",
                ModelData: jsonString6969
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata6969, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('ERP_QM');
            });
            
            break;
        case "ManageLeadSource":
            var model106 = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'ERPLEADSOURCE'
            };
            const jsonString106 = JSON.stringify(model106);

            let GenericModeldata106 =
            {
                ScreenID: "Brand_101",
                Operation: "D",
                ModelData: jsonString106
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata106, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('ERPLEADSOURCE');
            });
            
            break;
        case "ManageDepartmentType":
            var model121 = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'ERPDEPT'
            };
            const jsonString121 = JSON.stringify(model121);

            let GenericModeldata121 =
            {
                ScreenID: "Brand_101",
                Operation: "D",
                ModelData: jsonString121
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata121, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('ERPDEPT')
            });
            
            break;
        case "ManageDesignationType":
            var model122 = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'ERPDESIG'
            };
            const jsonString122 = JSON.stringify(model122);
            let GenericModeldata122 =
            {
                ScreenID: "Brand_101",
                Operation: "D",
                ModelData: jsonString122
            };
            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata122, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('ERPDESIG')
            });
            
            break;
        case "ManageCurrencyType":
            var model148 = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'CURRENCY'
            };
            const jsonString148 = JSON.stringify(model148);

            let GenericModeldata148 =
            {
                ScreenID: "CURR_101",
                Operation: "D",
                ModelData: jsonString148
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata148, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('CURRENCY')
            });
            
            break;
        case "ManageCategoryType":
            var model155 = {
                ID: $('#hddEditRowId').val()
            };
            const jsonString155 = JSON.stringify(model155);

            let GenericModeldata155 =
            {
                ScreenID: "CATE_101",
                Operation: "D",
                ModelData: jsonString155
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata155, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('CATEGORY');
            });
            
            break;
        case "ManageSubCategoryType":
            var model163 = {
                ID: $('#hddEditRowId').val()
            };
            const jsonString163 = JSON.stringify(model163);

            let GenericModeldata163 =
            {
                ScreenID: "CATE_101",
                Operation: "D",
                ModelData: jsonString163
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata163, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('SUBCATEGORY');
            });
            
            break;
        case "ManageLocationType":
            var model174 = {
                ID: $('#hddEditLocationRowId').val()
            };
            const jsonString174 = JSON.stringify(model174);

            let GenericModeldata174 =
            {
                ScreenID: "Location_101",
                Operation: "D",
                ModelData: jsonString174
            };
            
            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata174, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('LOCATION');
            });
           
            break;
        case "ManageWarehouse":
            var model179 = {
                ID: $('#hddEditWarehouseRowId').val()
            };
            const jsonString179 = JSON.stringify(model179);

            let GenericModeldata179 =
            {
                ScreenID: "Warehouse_101",
                Operation: "D",
                ModelData: jsonString179
            };
            
            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata179, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('WAREHOUSE');
            });
            
            break;
        case "ManageOtherCharges":
            var model187 = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'ERPOTHERCHARGES'
            };
            const jsonString187 = JSON.stringify(model187);

            let GenericModeldata187 =
            {
                ScreenID: "OtherCharges_101",
                Operation: "D",
                ModelData: jsonString187
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata187, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('ERPOTHERCHARGES')
            });
            
            break;
        case "ManageTerritoryType":
            var model195 = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'ERPTERRITORY'
            };
            const jsonString195 = JSON.stringify(model195);

            let GenericModeldata195 =
            {
                ScreenID: "Territory_101",
                Operation: "D",
                ModelData: jsonString195
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata195, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('ERPTERRITORY')
            });
            
            break;
        case "ManageClientBrandTypes":
            var model201 = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'CLIENTBRANDTYPE'
            };
            const jsonString201 = JSON.stringify(model201);

            let GenericModeldata201 =
            {
                ScreenID: "CBT_101",
                Operation: "D",
                ModelData: jsonString201
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata201, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('CLIENTBRANDTYPE')
            });
            
            break;
        case "ManagePaymentTerms":
            var model208 = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'PaymentTerms'
            };
            const jsonString208 = JSON.stringify(model208);

            let GenericModeldata208 =
            {
                ScreenID: "Pay_Terms_101",
                Operation: "D",
                ModelData: jsonString208
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata208, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('PAYMENTTERMS')
            });
            
            break;
        case "TransportationDetails":
            var model218 = {
                ID: $('#hddEditTransportationRowId').val(),
                TABLE_NAME: 'ERPTransporter'
            };
            const jsonString218 = JSON.stringify(model218);

            let GenericModeldata218 =
            {
                ScreenID: "Trans_101",
                Operation: "D",
                ModelData: jsonString218
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata218, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('TRANSPORTATION')
            });
           
            break;
        case "TermsCondidtion":
            var model403 = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'TermsConditions'
            };
            const jsonString403 = JSON.stringify(model403);

            let GenericModeldata403 =
            {
                ScreenID: "TermsConditions_100",
                Operation: "D",
                ModelData: jsonString403
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata403, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('TERMSCONDITIONS')
            });
            
            break;
        case "ManageFormulationCategoriesType":
            var model463 = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'ERPFormulationCategories'
            };
            const jsonString463 = JSON.stringify(model463);

            let GenericModeldata463 =
            {
                ScreenID: "TermsConditions_100",
                Operation: "D",
                ModelData: jsonString463
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata463, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('FORMULATIONCATEGORIES')
            });
            
            break;
        case "ManagePackagingType":
            var model477 = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'ERPPackaging'
            };
            const jsonString477 = JSON.stringify(model477);

            let GenericModeldata477 =
            {
                ScreenID: "TermsConditions_100",
                Operation: "D",
                ModelData: jsonString477
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata477, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('PACKAGING')
            });
            
            break;
        case "ManageOrderSizeType":
            var model478 = {
                ID: $('#hddEditRowId').val(),
                TABLE_NAME: 'ERPOrderSize'
            };
            const jsonString478 = JSON.stringify(model478);

            let GenericModeldata478 =
            {
                ScreenID: "TermsConditions_100",
                Operation: "D",
                ModelData: jsonString478
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', GenericModeldata478, 'POST', function (response) {
                $("#deleteCommonType").modal('hide');
                $("#confirmationdeactivate").modal('hide');
                CommonGetAllType('ORDERSIZE')
            });
           
            break;

        case "ManageStateType":



            var model475 = {
                id: $('#hddEditRowId').val(),
                Type: 8,
              
            };
            const jsonString4921 = JSON.stringify(model475);

            let Modeldatals475 =
            {
                ScreenID: "QCPM_101",
                Operation: "A",
                ModelData: jsonString4921
            };

            CommonAjaxMethod(virtualPath + 'Generic/PerformOperationAsync', Modeldatals475, 'POST', function (response) {
                if (response.ValidationInput == 1) {
                    $("#deleteCommonType").modal('hide');
                    $("#confirmationdeactivate").modal('hide');
                    CommonGetAllType('ERPSTATE');
                }
            });
            break;

        default:
    }
} 
function LoadMastersOther(ctrl) {
    var tabId = ctrl.id;// debugger
    $("#customLoader").show();
    switch (tabId) {
        case "tabItemCategory":
            var model150 = {
                ID: 0,
                Type: 'Category'
            }
            const jsonString150 = JSON.stringify(model150);
            var ScreenID150 = "CATE_101";
            
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString150, screenId: ScreenID150 }, 'GET', function (response) {
                BuildManageCategoryList(response.data.data.Table);
                var dropdownMasterData = response.data.data.Table;
                var $ele = $('#ddlCategory');
                $ele.empty();
                $ele.append($('<option/>').val('').text('Select'));
                $.each(dropdownMasterData, function (ii, vall) {
                    $ele.append($('<option />').val(vall.ID).text(vall.FIELD_NAME));
                })
                var $ele = $('#ddlEditCategory');
                $ele.empty();
                $ele.append($('<option/>').val('').text('Select'));
                $.each(dropdownMasterData, function (ii, vall) {
                    $ele.append($('<option />').val(vall.ID).text(vall.FIELD_NAME));
                })
                $("#customLoader").hide();
            });
            var model160 = {
                ID: 0,
                Type: 'SubCategory'
            }
            const jsonString160 = JSON.stringify(model160);
            var ScreenID160 = "CATE_101";
            
            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString160, screenId: ScreenID160 }, 'GET', function (response) {
                BuildManageSubCategoryList(response.data.data.Table);
                $("#customLoader").hide();
            });
            break;
        case "tabMastersRegion":
            var model123 = {
                ID: 0,
                TABLE_NAME: 'STATE'
            }
            const jsonString123 = JSON.stringify(model123);
            var ScreenID123 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString123, screenId: ScreenID123 }, 'GET', function (response) {
                BuildStateList(response.data.data.Table);
                $("#customLoader").hide();
            });
            var model124 = {
                ID: 0,
                TABLE_NAME: 'COUNTRY'
            }
            const jsonString124 = JSON.stringify(model124);
            var ScreenID124 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString124, screenId: ScreenID124 }, 'GET', function (response) {
                BuildCountryList(response.data.data.Table);
                $("#customLoader").hide();
            });
            var model180 = {
                ID: 0,
                TABLE_NAME: 'ERPTERRITORY'
            }
            const jsonString180 = JSON.stringify(model180);
            var ScreenID180 = "Territory_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString180, screenId: ScreenID180 }, 'GET', function (response) {
                BuildTerritoryList(response.data.data.Table);
            });
            break;
        case "tabMastersTax":
            var model130 = {
                ID: 0,
                TABLE_NAME: 'HSN'
            }
            const jsonString130 = JSON.stringify(model130);
            var ScreenID130 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString130, screenId: ScreenID130 }, 'GET', function (response) {
                const filteredHSNListData = response.data.data.Table.filter(item => {
                    // Example filter condition: Filter by a specific property, e.g., HSN is 0
                    return item.HSNSAC === 0;
                });
                const filteredSACListData = response.data.data.Table.filter(item => {
                    // Example filter condition: Filter by a specific property, e.g., SAC is 1
                    return item.HSNSAC === 1;
                });
                BuildHSNList(filteredHSNListData);
                BuildSACList(filteredSACListData);
                $("#customLoader").hide();
            });
            // Get all tax code.
            var model135 = {
                ID: 0,
                TABLE_NAME: 'LIST'
            }
            const jsonString135 = JSON.stringify(model135);
            var ScreenID135 = "TaxCode_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString135, screenId: ScreenID135 }, 'GET', function (response) {
                BuildTaxCodeList(response.data.data.Table);
                $("#customLoader").hide();
            });
            //Tax Other charges
            // Get all tax code.
            var model452 = {
                ID: 0,
                TABLE_NAME: 'TaxOtherCharges'
            }
            const jsonString452 = JSON.stringify(model452);
            var ScreenID452 = "TaxOtherCharges_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString452, screenId: ScreenID452 }, 'GET', function (response) {
                BuildTaxOtherChargesList(response.data.data.Table);
                $("#customLoader").hide();
            });
            break;
        case "tabMastersOrganisation":
            var model109 = {
                ID: 0,
                TABLE_NAME: 'ERPDEPT'
            }
            const jsonString109 = JSON.stringify(model109);
            var ScreenID109 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString109, screenId: ScreenID109 }, 'GET', function (response) {
                BuildDepartmentList(response.data.data.Table);
                $("#customLoader").hide();
            });
            var model110 = {
                ID: 0,
                TABLE_NAME: 'ERPDESIG'
            }
            const jsonString110 = JSON.stringify(model110);
            var ScreenID110 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString110, screenId: ScreenID110 }, 'GET', function (response) {
                BuildDesignationList(response.data.data.Table);
                $("#customLoader").hide();
            });
            break;
        case "tabMastersWarehouse":
            var model175 = {
                ID: 0,
                Type: 'Warehouse'
            }
            const jsonString175 = JSON.stringify(model175);
            var ScreenID175 = "Warehouse_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString175, screenId: ScreenID175 }, 'GET', function (response) {
                BuildManageWarehouseList(response.data.data.Table);
                $("#customLoader").hide();
            });
            var model170 = {
                ID: 0,
                Type: 'Location'
            }
            const jsonString170 = JSON.stringify(model170);
            var ScreenID170 = "Location_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString170, screenId: ScreenID170 }, 'GET', function (response) {
                BuildManageLocationList(response.data.data.Table);
                $("#customLoader").hide();
            });
            //------------ Transportation Details
            var model211 = {
                ID: 0,
                Type: 'Transportation'
            }
            const jsonString211 = JSON.stringify(model211);
            var ScreenID211 = "Trans_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString211, screenId: ScreenID211 }, 'GET', function (response) {
                BuildManageTransportationDetailsList(response.data.data.Table);
            });
            break;
        case "tabMastersPricing":
            var model138 = {
                ID: 0,
                TABLE_NAME: 'UNIT'
            }
            const jsonString138 = JSON.stringify(model138);
            var ScreenID138 = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString138, screenId: ScreenID138 }, 'GET', function (response) {
                BuildManageUoMList(response.data.data.Table);
                $("#customLoader").hide();
            });
            // Get all currency
            var model142 = {
                ID: 0,
                TABLE_NAME: 'Currency'
            }
            const jsonString142 = JSON.stringify(model142);
            var ScreenID142 = "CURR_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString142, screenId: ScreenID142 }, 'GET', function (response) {
                BuildManageCurrencyList(response.data.data.Table);
                dropdownMasterCurrencyData = response.data.data.Table;
                var $ele = $('#ddlCurrencyConversion');
                $ele.empty();
                $ele.append($('<option/>').val('Select').text('Select'));
                $.each(dropdownMasterCurrencyData, function (ii, vall) {
                    $ele.append($('<option />').val(vall.ID).text(vall.CurrencyCodeName));
                })
                $("#customLoader").hide();
            });

            // Get all currency conversion
            var model165 = {
                ID: 0,
                TABLE_NAME: 'Currency'
            }
            const jsonString165 = JSON.stringify(model165);
            var ScreenID165 = "Curr_Conv_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString165, screenId: ScreenID165 }, 'GET', function (response) {
                BuildManageCurrConversionList(response.data.data.Table);
                $("#customLoader").hide();
            });

            //Payment Terms
            var model209 = {
                ID: 0,
                TABLE_NAME: 'PaymentTerms'
            }
            const jsonString209 = JSON.stringify(model209);
            var ScreenID209 = "Pay_Terms_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString209, screenId: ScreenID209 }, 'GET', function (response) {
                BuildManagePaymentTermsList(response.data.data.Table);
                $("#customLoader").hide();
            });
            //Terms Condidtions
            var model400 = {
                ID: 0,
                TABLE_NAME: 'TermsConditions'
            }
            const jsonString400 = JSON.stringify(model400);
            var ScreenID400 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString400, screenId: ScreenID400 }, 'GET', function (response) {
                BuildManageTermsCondidtionsList(response.data.data.Table);
                $("#customLoader").hide();
            });
            break;
        case "tabMastersOther":
            var model = {
                ID: 0,
                TABLE_NAME: 'ERPBRAND'
            }
            const jsonString = JSON.stringify(model);
            var ScreenID = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString, screenId: ScreenID }, 'GET', function (response) {
                BuildManageList(response.data.data.Table);
                $("#customLoader").hide();
            });
            var leadsourcemodel = {
                ID: 0,
                TABLE_NAME: 'ERPLEADSOURCE'
            }
            const jsonleadsourceString = JSON.stringify(leadsourcemodel);
            var ScreenID = "Brand_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonleadsourceString, screenId: ScreenID }, 'GET', function (response) {
                BuildLeadSourceList(response.data.data.Table);
                $("#customLoader").hide();
            });
            var model181 = {
                ID: 0,
                TABLE_NAME: 'ERPOTHERCHARGES'
            }
            const jsonString181 = JSON.stringify(model181);
            var ScreenID181 = "OtherCharges_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString181, screenId: ScreenID181 }, 'GET', function (response) {
                BuildOtherChargesList(response.data.data.Table);
                $("#customLoader").hide();
            });
            var model202 = {
                ID: 0,
                TABLE_NAME: 'CLIENTBRANDTYPE'
            }
            const jsonString202 = JSON.stringify(model202);
            var ScreenID202 = "CBT_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString202, screenId: ScreenID202 }, 'GET', function (response) {
                BuildClientBrandTypesList(response.data.data.Table);
                $("#customLoader").hide();
            });

            break;
        case "tabMastersSample":
            var model458 = {
                ID: 0,
                TABLE_NAME: 'ERPSampleType'
            }
            const jsonString458 = JSON.stringify(model458);
            var ScreenID458 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString458, screenId: ScreenID458 }, 'GET', function (response) {
                BuildSampleTypeList(response.data.data.Table);
                $("#customLoader").hide();
            });
            //Formulation Categories Type
            var model460 = {
                ID: 0,
                TABLE_NAME: 'ERPFormulationCategories'
            }
            const jsonString460 = JSON.stringify(model460);
            var ScreenID460 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString460, screenId: ScreenID460 }, 'GET', function (response) {
                BuildFormulationCategoriesTypeList(response.data.data.Table);
                $("#customLoader").hide();
            });
            //Packaging Type
            var model468 = {
                ID: 0,
                TABLE_NAME: 'ERPPACKAGING'
            }
            const jsonString468 = JSON.stringify(model468);
            var ScreenID468 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString468, screenId: ScreenID468 }, 'GET', function (response) {
                BuildPackagingTypeList(response.data.data.Table);
                $("#customLoader").hide();
            });
            // Order Size Type
            var model469 = {
                ID: 0,
                TABLE_NAME: 'ERPOrderSize'
            }
            const jsonString469 = JSON.stringify(model469);
            var ScreenID469 = "TermsConditions_100";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString469, screenId: ScreenID469 }, 'GET', function (response) {
                BuildOrderSizeTypeList(response.data.data.Table);
                $("#customLoader").hide();
            });

            break;

        case "tabQCPM":
            var model175 = {
                Id: 0,
                Type: 0
            }
            const jsonString472 = JSON.stringify(model175);
            var ScreenID472 = "QCPM_101";

            CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString472, screenId: ScreenID472 }, 'GET', function (response) {
                BuildQCPMList(response.data.data.Table);
                $("#customLoader").hide();
            });
            break;
        default:
    }
    
}
function CommonGetAllType(tabId) {
    switch (tabId) {
        case "ERPBRAND":
            if (tabId != "") {
                var model108 = {
                    ID: 0,
                    TABLE_NAME: tabId
                }
                const jsonString108 = JSON.stringify(model108);
                var ScreenID108 = "Brand_101";
                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString108, screenId: ScreenID108 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildManageList(response.data.data.Table);
                });
            }
            break;
        case "ERPLEADSOURCE":
            if (tabId != "") {
                var model108 = {
                    ID: 0,
                    TABLE_NAME: tabId
                }
                const jsonString108 = JSON.stringify(model108);
                var ScreenID108 = "Brand_101";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString108, screenId: ScreenID108 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildLeadSourceList(response.data.data.Table);
                });
            }
            break;
        case "ERPDEPT":
            if (tabId != "") {
                var model113 = {
                    ID: 0,
                    TABLE_NAME: tabId
                }
                const jsonString113 = JSON.stringify(model113);
                var ScreenID113 = "Brand_101";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString113, screenId: ScreenID113 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildDepartmentList(response.data.data.Table);
                });
            }
            break;
        case "ERPDESIG":
            if (tabId != "") {
                var model114 = {
                    ID: 0,
                    TABLE_NAME: tabId
                }
                const jsonString114 = JSON.stringify(model114);
                var ScreenID114 = "Brand_101";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString114, screenId: ScreenID114 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildDesignationList(response.data.data.Table);
                });
            }
            break;
        case "CURRENCY":
            if (tabId != "") {
                var model145 = {
                    ID: 0,
                    TABLE_NAME: tabId
                }
                const jsonString145 = JSON.stringify(model145);
                var ScreenID145 = "CURR_101";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString145, screenId: ScreenID145 }, 'GET', function (response) {
                    renderCurrencyItems(response.data.data.Table);
                    BuildManageCurrencyList(response.data.data.Table);
                });
            }
            break;
        case "CATEGORY":
            if (tabId != "") {
                var model154 = {
                    ID: 0,
                    Type: 'Category'
                }
                const jsonString154 = JSON.stringify(model154);
                var ScreenID154 = "CATE_101";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString154, screenId: ScreenID154 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildManageCategoryList(response.data.data.Table);
                    var dropdownMasterData = response.data.data.Table;
                    var $ele = $('#ddlCategory');
                    $ele.empty();
                    $ele.append($('<option/>').val('').text('Select'));
                    $.each(dropdownMasterData, function (ii, vall) {
                        $ele.append($('<option />').val(vall.ID).text(vall.FIELD_NAME));
                    })
                    var $ele = $('#ddlEditCategory');
                    $ele.empty();
                    $ele.append($('<option/>').val('').text('Select'));
                    $.each(dropdownMasterData, function (ii, vall) {
                        $ele.append($('<option />').val(vall.ID).text(vall.FIELD_NAME));
                    })
                });
            }
            break;
        case "SUBCATEGORY":
            if (tabId != "") {
                var model159 = {
                    ID: 0,
                    Type: 'SubCategory'
                }
                const jsonString159 = JSON.stringify(model159);
                var ScreenID159 = "CATE_101";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString159, screenId: ScreenID159 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildManageSubCategoryList(response.data.data.Table);
                });
            }
            break;
        case "CURRENCYCONVERSION":
            if (tabId != "") {
                var model167 = {
                    ID: 0,
                    TABLE_NAME: 'Currency'
                }
                const jsonString167 = JSON.stringify(model167);
                var ScreenID167 = "Curr_Conv_101";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString167, screenId: ScreenID167 }, 'GET', function (response) {
                    RenderCurrConversionItems(response.data.data.Table);
                    BuildManageCurrConversionList(response.data.data.Table);
                });
            }
            break;
        case "LOCATION":
            if (tabId != "") {
                var model171 = {
                    ID: 0,
                    Type: 'Location'
                }
                const jsonString171 = JSON.stringify(model171);
                var ScreenID171 = "Location_101";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString171, screenId: ScreenID171 }, 'GET', function (response) {
                    RenderLocationItems(response.data.data.Table);
                    BuildManageLocationList(response.data.data.Table);
                });
            }
            break;
        case "WAREHOUSE":
            if (tabId != "") {
                var model176 = {
                    ID: 0,
                    Type: 'Warehouse'
                }
                const jsonString176 = JSON.stringify(model176);
                var ScreenID176 = "Warehouse_101";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString176, screenId: ScreenID176 }, 'GET', function (response) {
                    RenderWarehouseItems(response.data.data.Table);
                    BuildManageWarehouseList(response.data.data.Table);
                });
            }
            break;
        case "ERPOTHERCHARGES":
            if (tabId != "") {
                var model184 = {
                    ID: 0,
                    TABLE_NAME: 'ERPOTHERCHARGES'
                }
                const jsonString184 = JSON.stringify(model184);
                var ScreenID184 = "OtherCharges_101";
                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString184, screenId: ScreenID184 }, 'GET', function (response) {
                    // Set the global tabName before render
                    tabName = "ManageOtherCharges"; // <-- ADD THIS LINE

                    renderItems(response.data.data.Table);
                    BuildOtherChargesList(response.data.data.Table);

                    //setTimeout(function () {
                    //    renderItems(response.data.data.Table);
                    //    BuildManageList(response.data.data.Table);
                    //}, 500); // delay in milliseconds (e.g., 500ms = 0.5 sec)
                });
            }
            break;
        case "ERPTERRITORY":
            if (tabId != "") {
                var model191 = {
                    ID: 0,
                    TABLE_NAME: 'ERPTERRITORY'
                }
                const jsonString191 = JSON.stringify(model191);
                var ScreenID191 = "Territory_101";
                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString191, screenId: ScreenID191 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildTerritoryList(response.data.data.Table);
                });
            }
            break;
        case "CLIENTBRANDTYPE":
            if (tabId != "") {
                var model203 = {
                    ID: 0,
                    TABLE_NAME: 'CLIENTBRANDTYPE'
                }
                const jsonString203 = JSON.stringify(model203);
                var ScreenID203 = "CBT_101";
                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString203, screenId: ScreenID203 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildClientBrandTypesList(response.data.data.Table);
                });
            }
            break;
        case "PAYMENTTERMS":
            if (tabId != "") {
                var model210 = {
                    ID: 0,
                    TABLE_NAME: tabId
                }
                const jsonString210 = JSON.stringify(model210);
                var ScreenID210 = "Brand_101";
                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString210, screenId: ScreenID210 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildManagePaymentTermsList(response.data.data.Table);
                });
            }
        case "TERMSCONDITIONS":
            if (tabId != "") {
                var model402 = {
                    ID: 0,
                    TABLE_NAME: tabId
                }
                const jsonString402 = JSON.stringify(model402);
                var ScreenID402 = "TermsConditions_100";
                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString402, screenId: ScreenID402 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildManageTermsCondidtionsList(response.data.data.Table);
                });
            }
            break;
        case "TRANSPORTATION":
            if (tabId != "") {
                var model214 = {
                    ID: 0,
                    TABLE_NAME: 'ERPTransporter'
                }
                const jsonString214 = JSON.stringify(model214);
                var ScreenID214 = "Trans_101";
                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString214, screenId: ScreenID214 }, 'GET', function (response) {
                    RenderTransportationItems(response.data.data.Table);
                    BuildManageTransportationDetailsList(response.data.data.Table);
                });
            }
            break;
        case "SAMPLETYPE":
            if (tabId != "") {
                var model457 = {
                    ID: 0,
                    TABLE_NAME: "ERPSampleType"
                }
                const jsonString457 = JSON.stringify(model457);
                var ScreenID457 = "TermsConditions_100";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString457, screenId: ScreenID457 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildSampleTypeList(response.data.data.Table);
                });
            }
            break;
        case "FORMULATIONCATEGORIES":
            if (tabId != "") {
                var model461 = {
                    ID: 0,
                    TABLE_NAME: "ERPFormulationCategories"
                }
                const jsonString461 = JSON.stringify(model461);
                var ScreenID461 = "TermsConditions_100";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString461, screenId: ScreenID461 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildFormulationCategoriesTypeList(response.data.data.Table);
                });
            }
            break;
        case "PACKAGING":
            if (tabId != "") {
                var model467 = {
                    ID: 0,
                    TABLE_NAME: "ERPPackaging"
                }
                const jsonString467 = JSON.stringify(model467);
                var ScreenID467 = "TermsConditions_100";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString467, screenId: ScreenID467 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildPackagingTypeList(response.data.data.Table);
                });
            }
            break;
        case "ORDERSIZE":
            if (tabId != "") {
                var model472 = {
                    ID: 0,
                    TABLE_NAME: "ERPOrderSize"
                }
                const jsonString472 = JSON.stringify(model472);
                var ScreenID472 = "TermsConditions_100";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString472, screenId: ScreenID472 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildOrderSizeTypeList(response.data.data.Table);
                });
            }
            break;
        case "ERP_QM":
            if (tabId != "") {
                var model467 = {
                    Id: 0,
                    Type: 0
                }
                const jsonString1923 = JSON.stringify(model467);
                var ScreenID1923 = "QCPM_101";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString1923, screenId: ScreenID1923 }, 'GET', function (response) {
                    RenderQualityCheckItems(response.data.data.Table);
                    BuildQCPMList(response.data.data.Table);
                });
            }
            break;
        case "ERPSTATE":
            if (tabId != "") {
                var model491 = {
                    ID: 0,
                    TABLE_NAME: "STATE"
                }
                const jsonString491 = JSON.stringify(model491);
                var ScreenID491 = "TermsConditions_100";

                CommonAjaxMethod(virtualPath + 'Generic/GetRecordsAsync', { modelData: jsonString491, screenId: ScreenID491 }, 'GET', function (response) {
                    renderItems(response.data.data.Table);
                    BuildStateList(response.data.data.Table);
                });
            }
            break;

        default: 
    }
}