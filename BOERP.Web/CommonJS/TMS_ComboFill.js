

function LoadMasterDropdownTMS(element, obj, slectText, basedonValueCode, selectedValue) {
    CommonAjaxMethodTMS(baseURL + 'CommonMethod/GetDropdown/', obj, 'GET', function (response) {
        var dropdownMasterData = response.data.data.Table;
        //render catagory
        BindDropDown(element, selectedValue, dropdownMasterData, slectText, basedonValueCode);
    });
}


function BindDropDownTMS(element, selectedValue, dropdownMasterData, slectText, basedonValueCode) {

    var $ele = $('#' + element);
    $ele.empty();

    if (slectText == "FieldFMS") {
        $ele.append('<option value="Select">Select</option>');
        $ele.append('<option value="plan">Planned Date/Time Applicable</option>');
        $ele.append('<option value="actual">Actual Date/Time Applicable</option>');
    }
    else if (slectText != "") {
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
    if (ddlselectValue != "")
        $ele.val(selectedValue);
}

function LoadUlLiTMS(element, obj, type) {
    CommonAjaxMethodTMS(baseURL + 'CommonMethod/GetDropdown/', obj, 'GET', function (response) {
        var dropdownMasterData = response.data.data.Table;
        //render catagory
        BindUlLi(element, dropdownMasterData, type);
    });
}


function BindUlLiTMS(element, data, type) {
    var $ele = $('#' + element);
    $ele.empty();

    var groupName = "";
    if (type == 2) {
        groupName = "Thematic";
    }
    else if (type == 3) {
        groupName = "MasterLocation";
    }
    else if (type == 4) {
        groupName = "Donar";
    }
    else if (type == 5) {
        groupName = "TagWithThematic";
    }
    else if (type == 6) {
        groupName = "Year";
    }

    $.each(data, function (ii, vall) {
        $ele.append($('<li> <input onchange="AddFilters(' + vall.ID + ',' + type + ')" type="checkbox" id="pc' + groupName + vall.ID + '" name="' + groupName + '"> <label for="pc' + groupName + vall.ID + '">' + vall.ValueName + ' </label></li>'));
    })
}

function LoadUlLiProjectTMS(element, obj, type, projCode) {
    CommonAjaxMethodTMS(virtualPath + 'CommonMethod/GetDropdown/', obj, 'GET', function (response) {
        var dropdownMasterData = response.data.data.Table;
        //render catagory
        BindUlLiProject(element, dropdownMasterData, type, projCode);
    });
}
function BindUlLiProjectTMS(element, data, type, projCode) {
    var $ele = $('#' + element);
    $ele.empty();
    var groupName = "Project";
    $.each(data, function (ii, vall) {
        if (vall.ID == projCode) {
            $ele.append($('<li> <input checked onchange="AddFilters(' + vall.ID + ',' + type + ')" type="checkbox" id="pc' + groupName + vall.ID + '" name="' + groupName + '"> <label for="pc' + groupName + vall.ID + '">' + vall.ValueCode + ' </label></li>'));

        }
        else {
            $ele.append($('<li> <input  onchange="AddFilters(' + vall.ID + ',' + type + ')" type="checkbox" id="pc' + groupName + vall.ID + '" name="' + groupName + '"> <label for="pc' + groupName + vall.ID + '">' + vall.ValueCode + ' </label></li>'));

        }

    })
}

//document.addEventListener("DOMContentLoaded", function () {
//    fetch('/Account/GetMenuJson')
//        .then(response => response.json())
//        .then(data => {
//            bindDataToHtml(data, userID);
//        })
//        .catch(error => console.error('Error fetching the JSON file:', error));
//});




function bindDataToHtmlTMS(jsonRes, userID) {
    const menuContainer = document.getElementById('menuContainer');
    const modulesMap = new Map(); // To track modules already added
    const menuMap = new Map(); // To track modules already added
    const rolePermissions = ['R', 'W', 'M', 'D', 'AR']; // Permissions to check

    var jsonData = jsonRes.data.Table;


    for (let i = 0; i < jsonData.length; i++) {
        const item = jsonData[i];
        let hasPermission = false;

        // Check if any permission is true
        for (let j = 0; j < rolePermissions.length; j++) {
            if (item[rolePermissions[j]]) {
                hasPermission = true;
                break;
            }
        }

        if (item.UserID == userID && hasPermission) {
            // Check if module already exists


            if (!modulesMap.has(item.ModuleID)) {
                modulesMap.set(item.ModuleID, true); // Add module to map




                // Create module container
                const moduleItem = document.createElement('li');
                moduleItem.classList.add('m-menu__item', 'm-menu__item--submenu', 'm-menu__item--hover');
                moduleItem.setAttribute('aria-haspopup', 'true');
                moduleItem.setAttribute('m-menu-submenu-toggle', 'hover');
                moduleItem.setAttribute('data-moduleid', item.ModuleID); // Add data attribute

                moduleItem.innerHTML = `
                    <a href="javascript:;" class="m-menu__link m-menu__toggle">
                        ${item.ModuleIcon}
                        <span class="m-menu__link-text">${item.ModuleName}</span>
                        <i class="m-menu__ver-arrow fas fa-angle-down"></i>
                    </a>
                    <div class="m-menu__submenu">
                        <span class="m-menu__arrow"></span>
                        <ul class="m-menu__subnav"></ul>
                    </div>
                `;

                menuContainer.appendChild(moduleItem);
            }

            if (!menuMap.has(item.MenuID)) {
                menuMap.set(item.MenuID, true); // Add menu to map

                for (let j = 0; j < rolePermissions.length; j++) {
                    if (item[rolePermissions[j]]) {
                        if (rolePermissions[j] == 'W') {
                            $(".Add_" + item.MenuID).show();
                        }


                    }

                    else {

                        if (item.W == 1 || item.M == 1 || item.R == 1 || item.D == 1) {
                            if (rolePermissions[j] == 'W') {
                                $(".Add_" + item.MenuID).hide();
                            }
                        }
                    }
                }


                // Create menu item
                const menuItem = document.createElement('li');
                menuItem.classList.add('m-menu__item', 'm-menu__item--submenu');
                menuItem.setAttribute('aria-haspopup', 'true');
                menuItem.setAttribute('m-menu-submenu-toggle', 'hover');

                menuItem.innerHTML = `
                    <a href="${item.MenuURL}" class="m-menu__link m-menu__toggle">
                        <i class="m-menu__link-bullet m-menu__link-bullet--dot"><span></span></i>
                        <span class="m-menu__link-text">${item.MenuName}</span>
                    </a>
                `;

                // Find the correct module container and append the menu item
                const moduleContainer = menuContainer.querySelector(`[data-moduleid="${item.ModuleID}"] .m-menu__subnav`);
                if (moduleContainer) {
                    moduleContainer.appendChild(menuItem);
                }
            }
        }
    }
}

function getModifyAccessTMS(table, Id) {
    fetch('/Account/GetMenuJson')
        .then(response => response.json())
        .then(data => {
            var menuAccArray = data.data.Table;
            const rolePermissions = ['R', 'W', 'M', 'D', 'AR'];

            // Function to apply visibility changes
            function applyVisibilityChanges() {
                for (var i = 0; i < menuAccArray.length; i++) {
                    const item = menuAccArray[i];

                    var isAtt = true;

                    if (item.MenuID == Id && item.UserID == userID) {
                        for (var j = 0; j < rolePermissions.length; j++) {
                            if (item.W == 1 || item.M == 1 || item.R == 1 || item.D == 1) {
                                if (item.MenuID == 10) {
                                    if (item.M == 0 && item.D == 0) {
                                        $(".Action").html('');
                                    }
                                }
                            }
                            if (item[rolePermissions[j]]) {
                                if (rolePermissions[j] == 'M') {
                                    $(".Edit_" + item.MenuID).show();


                                }
                                if (rolePermissions[j] == 'D') {
                                    $(".Del_" + item.MenuID).show();
                                    $("#Del_" + item.MenuID).show();
                                    if (item.MenuID == 1) {
                                        $("#Del" + item.MenuID).show();
                                    }

                                }
                            } else {
                                if (item.W == 1 || item.M == 1 || item.R == 1 || item.D == 1) {
                                    if (rolePermissions[j] == 'M') {
                                        $(".Edit_" + item.MenuID).hide();
                                    }
                                    if (rolePermissions[j] == 'D') {
                                        $(".Del_" + item.MenuID).hide();
                                        $("#Del_" + item.MenuID).html('');
                                        if (item.MenuID == 1) {
                                            $("#Del" + item.MenuID).html('');
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Apply visibility changes immediately
            applyVisibilityChanges();

            // Apply visibility changes on each DataTable draw event
            table.on('draw.dt', function () {
                applyVisibilityChanges();
            });
        })
        .catch(error => console.error('Error fetching the JSON file:', error));
}



