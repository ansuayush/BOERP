function LoadMasterDropdown(elementId, requestObject, defaultText = "Select", useValueCode = false, selectedValue = "") {
     $('#customLoader').show();
    CommonAjaxMethod(
        virtualPath + 'Generic/GetDropDownWithAsync',
        requestObject,
        'GET',
        function (response) {
            if (response && response.data && Array.isArray(response.data.data.Table)) {

                if (elementId == 'ddlCategory') {
                    var res = response.data.data.Table.find(input => input.ValueName == 'Semi Finished Goods');
                    var res2 = response.data.data.Table.find(input => input.ValueName == 'Base');
                    if (localStorage.getItem('Item') && res) {
                        selectedValue = res.ID;

                        localStorage.removeItem('Item');
                    }
                    if (res2) {
                        localStorage.setItem('BaseId', res2.ID);
                    }
                }
                else if (elementId == 'ddlUnitSFG' || elementId == 'ddlUnit') {

                    var res = response.data.data.Table.find(input => input.ValueName.toLowerCase() == 'pcs');
                    var res2 = response.data.data.Table.find(input => input.ValueName.toLowerCase() == 'kgs');
                    var res3 = response.data.data.Table.find(input => input.ValueName.toLowerCase() == 'kgs');
                    var res4 = response.data.data.Table.find(input => input.ValueName.toLowerCase() == 'pcs');

                    if (res) {
                        localStorage.setItem('uom1', res.ID);
                    }
                    if (res2) {
                        localStorage.setItem('uom2', res2.ID);

                    }
                    if (res3) {
                        localStorage.setItem('uom3', res3.ID);
                    }
                    if (res4) {
                        localStorage.setItem('uom4', res4.ID);
                    }

                }
                else if (elementId == 'ddlHSN') {
                    var res5 = response.data.data.Table.find(input => input.ValueCode == '33049990');

                    if (res5) {

                        if (localStorage.getItem('hsn')) {
                            localStorage.removeItem('hsn')
                        }

                        localStorage.setItem('hsn', res5.ID);
                    }


                    console.log(res5);
                }
                else if (elementId == 'ddlDefaultWarehouse') {
                    var res3 = response.data.data.Table.find(input => input.ValueCode.toLowerCase() == 'semi finished goods');

                    if (res3) {
                        localStorage.setItem('warehouse', res3.ID);
                    }

                }
                else if (elementId.includes('ddlBState') || elementId.includes('ddlSState')) {

                    if (response.data.data.Table.length == 1) {
                        selectedValue = response.data.data.Table[0].ID
                    }
                }

                BindDropDown(elementId, selectedValue, response.data.data.Table, defaultText, useValueCode);

               $("#customLoader").hide();

            } else {
                FailToaster("Invalid dropdown data.");
               $("#customLoader").hide();
            }
        }
    );
}
function LoadMasterDropdown1(elementId, requestObject, defaultText = "Select", useValueCode = false, selectedValue = "") {
    CommonAjaxMethod(
        virtualPath + 'Generic/GetDropDownWithAsync',
        requestObject,
        'GET',
        function (response) {
            if (response && response.data && Array.isArray(response.data.data.Table)) {
                BindDropDownWithValueCode1(elementId, selectedValue, response.data.data.Table, defaultText, useValueCode);
            } else {
                FailToaster("Invalid dropdown data.");
            }
        }
    );
}


 
function BindDropDownWithValueCode1(element, selectedValue, dropdownMasterData, slectText, basedonValueCode) {

    var $ele = $('#' + element);
    $ele.empty();
    if (slectText != "") {
        $ele.append($('<option/>').val(slectText).text(slectText));
    }
    $.each(dropdownMasterData, function (ii, vall) {
        if (basedonValueCode == true) {
            $ele.append($('<option data-ele=' + vall.GST_NO + ' />').val(vall.ID).text(vall.ValueName));

        }
        else
            $ele.append($('<option/>').val(vall.ID).text(vall.ValueName));
    })
    var ddlselectValue = selectedValue == undefined ? "" : selectedValue;
    if (ddlselectValue != "")
        $ele.val(selectedValue);
}
//

 
function LoadMasterDropdownCheckBox(elementId, requestObject, defaultText = "Select", useValueCode = false, selectedValue = "") {
    CommonAjaxMethod(
        virtualPath + 'Generic/GetDropDownWithAsync',
        requestObject,
        'GET',
        function (response) {
            if (response && response.data && Array.isArray(response.data.data.Table)) {
                BindDropDownCheckBox(elementId, selectedValue, response.data.data.Table, defaultText, useValueCode);
            } else {
                FailToaster("Invalid dropdown data.");
            }
        }
    );
}

function LoadMasterDropdownValueCode(elementId, requestObject, defaultText = "Select", useValueCode = false, selectedValue = "") {
    CommonAjaxMethod(
        virtualPath + 'Generic/GetDropDownWithAsync',
        requestObject,
        'GET',
        function (response) {
            if (response && response.data && Array.isArray(response.data.data.Table)) {
                BindDropDownWithValueCode(elementId, selectedValue, response.data.data.Table, defaultText, useValueCode);
            } else {
                FailToaster("Invalid dropdown data.");
            }
        }
    );
}

 
function BindDropDown(element, selectedValue, dropdownMasterData, slectText, basedonValueCode) {
    var $ele = $('#' + element);
    $ele.empty();
    if (slectText != "") {
        $ele.append($('<option/>').val(slectText).text(slectText));
    }

    $.each(dropdownMasterData, function (ii, vall) {
        if (basedonValueCode == true) {
            $ele.append($('<option dataEle=' + vall.ID + ' />').val(vall.ValueCode).text(vall.ValueName));

        }
        else
            $ele.append($('<option/>').val(vall.ID).text(vall.ValueName));
    })
    var ddlselectValue = selectedValue == undefined ? "" : selectedValue;
    if (ddlselectValue != "") {
        $ele.val(selectedValue).trigger('change');
    }
    else if (ddlselectValue == 0 && element == 'ddlAddress') {
        $ele.val(selectedValue).trigger('change');
    }
}

function BindDropDownCheckBox(element, data, indendData, slectText, basedonValueCode) {
    var $ele = $('#' + element);

    $ele.empty();
    // Bind options
    $.each(indendData, function (ii, vall) {
        var $option = $('<option />')
            .val(vall.ID)
            .text(vall.ValueName);
        $ele.append($option);
    });

    // Destroy and re-init multiselect
    if ($ele.data('multiselect')) {
        $ele.multiselect('destroy');
    }

    $ele.multiselect({
        includeSelectAllOption: true,
        nonSelectedText: 'Select',
        buttonWidth: '100%',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true
    });
    var ddlselectValue = data == undefined ? "" : data;

    if (ddlselectValue != '') {
        let indArray = ddlselectValue.split(',').map(x => x.trim());
        $ele.val(indArray);
        $ele.multiselect('rebuild');
    }

    
}



function BindDropDownWithValueCode(element, selectedValue, dropdownMasterData, slectText, basedonValueCode) {

    var $ele = $('#' + element);
    $ele.empty();
    if (slectText != "") {
        $ele.append($('<option/>').val(slectText).text(slectText));
    }
    $.each(dropdownMasterData, function (ii, vall) {
        if (basedonValueCode == true) {
            $ele.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));

        }
        else
            $ele.append($('<option/>').val(vall.ID).text(vall.ValueName));
    })
    var ddlselectValue = selectedValue == undefined ? "" : selectedValue;
    if (ddlselectValue != "")
        $ele.val(selectedValue);
}
function LoadMasterDropdownValueCodeWithOutDefaultValue(elementId, requestObject, defaultText = "Select", useValueCode = false, selectedValue = "") {
    CommonAjaxMethod(
        virtualPath + 'Generic/GetDropDownWithAsync',
        requestObject,
        'GET',
        function (response) {
            if (response && response.data && Array.isArray(response.data.data.Table)) {
                BindDropDownWithValueCodeAndWithOutDefaultValue(elementId, selectedValue, response.data.data.Table, defaultText, useValueCode);
            } else {
                FailToaster("Invalid dropdown data.");
            }
        }
    );
}

// Add by Brajesh
 
function BindDropDownWithValueCodeAndWithOutDefaultValue(element, selectedValue, dropdownMasterData, slectText, basedonValueCode) {

    var $ele = $('#' + element);
    $ele.empty();
    //if (slectText != "") {
    //    $ele.append($('<option/>').val(slectText).text(slectText));
    //}
    $.each(dropdownMasterData, function (ii, vall) {
        if (basedonValueCode == true) {
            $ele.append($('<option dataEle=' + vall.ValueCode + ' />').val(vall.ID).text(vall.ValueName));

        }
        else
            $ele.append($('<option/>').val(vall.ID).text(vall.ValueName));
    })
    var ddlselectValue = selectedValue == undefined ? "" : selectedValue;
    if (ddlselectValue != "")
        $ele.val(selectedValue);
}
