function buildColumnDefs(columnMeta) {
    return columnMeta.map((col, index) => {
        // Normalize type casing to avoid mistakes:
        const type = (col.Type || col.type || '').toString();

        // base def
        const def = {
            headerName: col.HeaderName,
            field: (type === 'date')
                ? (ChangeDateFormatToddMMYYYWithSlace(col.Field) || '')
                : (type === 'datetime' ? (getdatetime(col.Field) || '') : col.Field),
            tooltipField: (type === 'link' || type === 'ellipsis') ? col.Field : null,
            width: col.Width || 150,
            pinned: col.Pinned || null,
            resizable: true,
            cellRenderer: getCellRenderer(col),
            cellClass: col.cellClass || (type === 'ellipsis' ? 'text-ellipsis' : null),
            headerClass: col.HeaderName === 'Action' ? 'center-align-header' : ''
        };

        // Explicitly disable filter/sort for these types
        const excluded = ['Indentaction-buttons', 'status-badge', 'checkbox', 'textbox', 'Indentaction-buttons-delete', 'delay_tms', 'upload-link', 'audit-trail','status-dot'];
        if (excluded.includes(type)) {
            def.sortable = false;
            def.filter = false;
            def.floatingFilter = false;
            // if you also want to hide menu (three dots on header), use:
            def.suppressMenu = true;
        } else {
            def.sortable = true;
            def.filter = 'agTextColumnFilter';
            def.floatingFilter = true;
        }

        // Add filter/sort value getters only for date/datetime (and only when filter is enabled)
        if (def.filter) {
            def.filterValueGetter = params => {
                const value = params.data ? params.data[col.Field] : undefined;
                if (type === 'date' && value) return ChangeDateFormatToddMMYYYWithSlace(value);
                if (type === 'datetime' && value) return getdatetime(value);
                return value;
            };

            def.sortValueGetter = params => {
                const value = params.data ? params.data[col.Field] : undefined;
                if (type === 'date' && value) return new Date(ChangeDateFormatToddMMYYYWithSlace(value));
                if (type === 'datetime' && value) return new Date(getdatetime(value));
                return value;
            };
        }

        return def;
    });
}
function getCellRenderer(col) {
    return function (params) {
        const data = params.data;
        switch (col.Type) {
            case "index":
                return params.node.rowIndex + 1;
            case "link":
                var url = ''
                if (grid_id == 'IndentIndex') {
                    url = col.LinkTemplate.replace("{auth}", AuthToken).replace("{ID}", data.ID).replace("{StatusId}", data.StatusId);
                }
                else if (grid_id == 'ItemMasterGrid' || grid_id == 'StockReport') {
                    url = col.LinkTemplate.replace("{auth}", AuthToken).replace("{itemId}", data.ITEM_ID);
                }
                else if (grid_id == 'Role' || grid_id == 'Employee') {
                    url = col.LinkTemplate.replace("{Auth}", AuthToken).replace("{Id}", data.Id);
                }
                else if (grid_id == 'POIndexGried') {
                    url = col.LinkTemplate.replace("{Auth}", AuthToken).replace("{ID}", data.ID).replace("{StatusId}", data.StatusId);
                }
                else if (grid_id == 'MyHelpTicket') {
                    return '<a href="#" class="fn - bold" onclick="ViewHelpTicket(' + data.Id + ')">' + data.TicketId + '</a>';
                }
                else if (grid_id == 'PCTicket') {
                    return '<a href="#" class="fn - bold" onclick="ViewHelpPCTicket(' + data.Id + ')">' + data.TicketId + '</a>';
                }
                else if (grid_id == 'UserHelpTicket' || grid_id == 'TechnicalHelpTicket') {
                    return '<a href="#" class="fn - bold" onclick="ViewResolvedTicket(' + data.Id + ')">' + data.TicketId + '</a>';
                }
                else if (grid_id == 'CustomerGried') {
                    url = col.LinkTemplate.replace("{auth}", AuthToken).replace("{ID}", data.ID).replace("{StatusId}", data.StatusId).replace("{PA_ID}", data.PA_ID);
                }
                else if (grid_id == 'VendorGried') {
                    url = col.LinkTemplate.replace("{auth}", AuthToken).replace("{ID}", data.ID).replace("{StatusId}", data.StatusId).replace("{PA_ID}", data.PA_ID);
                }
                else if (grid_id == 'ManualStockAdjGried') {
                    url = `javascript:GetMSADetById('${data.ID}', ${data.StatusId})`;
                }
                else if (grid_id == 'StockTransferGried') {
                    url = `javascript:GetStockTranfserDetById('${data.ID}', ${data.StatusId})`;
                }
                else if (grid_id == 'GRNReport') {
                    return '<span><a href="../../MaterialManagement/Material/ViewGrn?auth=' + AuthToken + '&id=' + data.ID + '&IsGRNView=1" data-toggle="tooltip" class="d-flex justify-content-between link-grid" title="" data-original-title="' + data.DocNo + '"><strong class="link-grid-ellipsis">' + data.DocNo + ' </strong> <span class="link-icon"><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span></a></span>';
                }
                else if (grid_id == 'BusinessPartner_GRNGrid') {
                    return '<span><a href="../../MaterialManagement/Material/ViewGrn?auth=' + AuthToken + '&id=' + data.ID + '&IsGRNView=1' + '&ErpPartyId=' + data.ErpPartyId + '&PAId=' + data.PA_ID + '&PageType='+'VendorGRN'+'" data-toggle="tooltip" class="d-flex justify-content-between  link-grid" title="" data-original-title="' + data.DocNo + '"><strong  class="link-grid-ellipsis">' + data.DocNo + ' </strong> <span  class="link-icon"><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span></a></span>';
                }
                else if (grid_id == 'GRNApproval') {
                    return '<span><a href="ViewGRNApproval?auth=' + AuthToken + '&id=' + data.ID + '&IsNotApprove=1" data-toggle="tooltip" class="d-flex justify-content-between link-grid" title="" data-original-title="' + data.DocNo + '"><strong  class="link-grid-ellipsis">' + data.DocNo + ' </strong> <span  class="link-icon"><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span></a></span>';
                }
                else if (grid_id == 'POApprovalGried') {
                    return '<span><a href="ViewPurchaseDocument?auth=' + AuthToken + '&id=' + data.ID + '&Status=' + data.StatusId + '" data-toggle="tooltip" class="d-flex justify-content-between link-grid" title="" data-original-title="' + data.DocNo + '"><strong  class="link-grid-ellipsis">' + data.DocNo + ' </strong> <span  class="link-icon"><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span></a></span>';
                }
                else if (grid_id == 'BusinessPartner_PoGrid') {
                    return '<span><a href="../../MaterialManagement/Material/ViewPurchaseDocument?auth=' + AuthToken + '&id=' + data.ID + '&Status=' + data.StatusId + '&ErpPartyId=' + data.ErpPartyId + '&PA_ID=' +data.PA_ID+'&PageType=' + 'VendorPO' +'" data-toggle="tooltip" class="d-flex justify-content-between link-grid" title="" data-original-title="' + data.DocNo + '"><strong  class="link-grid-ellipsis">' + data.DocNo + ' </strong> <span  class="link-icon"><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span></a></span>';
                }
                else if (grid_id == 'DispatchStatus' || grid_id == 'SampleIndex') {
                    let IsSample = 1;
                     
                    if (grid_id == 'SampleIndex') {
                        IsSample = 2;
                    }
                    if (data.Item_Code && data.Item_Code.length > 0) {
                        return '<span><a href="../../MaterialManagement/Material/ItemMaster?auth=' + AuthToken + '&itemId=' + data.Item_Id + '&IsSample=' + IsSample + '" data-toggle="tooltip" class="d-flex justify-content-between link-grid" title="" data-original-title="' + data.Item_Code + '"><strong  class="link-grid-ellipsis">' + data.Item_Code + ' </strong> <span  class="link-icon"><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span></a></span>';
                    }
                    else {
                        return '';
                    }
                }
                else if (grid_id == 'IndentShortCloseGried') {
                    return '<span><a href="../../MaterialManagement/Material/ViewIndent?auth=' + AuthToken + '&id=' + data.IndentId + '&PageType=IndentSCList" data-toggle="tooltip" class="d-flex justify-content-between link-grid" title="" data-original-title="' + data.IndentNo + '"><strong  class="link-grid-ellipsis">' + data.IndentNo + ' </strong> <span  class="link-icon"><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span></a></span>';
                }
                else if (grid_id == 'POShortCloseGried') {
                    return '<span><a href="ViewPurchaseDocument?auth=' + AuthToken + '&id=' + data.POId + '&Status=' + data.StatusId + '&PageType=POSCList" data-toggle="tooltip" class="d-flex justify-content-between link-grid" title="" data-original-title="' + data.PONo + '"><strong  class="link-grid-ellipsis">' + data.PONo + ' </strong> <span  class="link-icon"><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span></a></span>';
                }

                return `<span>
                <a href="${url}" class="d-flex justify-content-between link-grid">
                            <strong  class="link-grid-ellipsis ellipsis" >${data[col.Field]}</strong>
                            <span  class="link-icon"><img src="../../assets/images/icons/help/edit.png" class="icon-xsm"></span>
                        </a></span>`;
            case 'status-badge':
                let badgeClass = 'badge-warning';
                if (data[col.Field] == 'Approved' || data[col.Field] == 'Dispatch Completed' || data[col.Field] == 'Ready For Dispatch' || data[col.Field] == 'Completed') {
                    badgeClass = "badge-success";
                } else if (data[col.Field] == 'Rejected' || data[col.Field] == 'Resolved' || data[col.Field] == 'Partially Ready') {
                    badgeClass = "badge-danger";
                }
                return `<span class="badge ${badgeClass}">${data[col.Field] || ''}</span>`;
            case 'audit-trail':
                var row = params.data;
                var ele = '';

                if (grid_id == 'GRNReport') {
                    if (row.StatusId == 2) {
                        ele = `<div class="ellipsis text-ellipsis" style="color: #169700"><strong>Approved, ${row.WorkFlowDate}</strong></div>`;
                    }
                    else if (row.StatusId == 3) {
                        ele = `<div class="ellipsis text-ellipsis" style="color: #ff0000"><strong>Rejected, ${row.WorkFlowDate}</strong></div>`;
                    }
                    else {
                        ele = `<div class="ellipsis text-ellipsis"><strong>Created, ${row.WorkFlowDate}</strong></div>`;
                    }


                }

                else if (grid_id == 'GRNApproval') {
                    if (row.StatusId == 2) {
                        ele = `<div class="ellipsis text-ellipsis" style="color: #169700"><strong>Approved, ${row.WorkFlowDate}</strong></div>`;
                    }
                    else if (row.StatusId == 3) {
                        ele = `<div class="ellipsis text-ellipsis" style="color: #ff0000"><strong>Rejected, ${row.WorkFlowDate}</strong></div>`;
                    }
                    else {
                        ele = `<div class="ellipsis text-ellipsis"><strong>Created, ${row.WorkFlowDate}</strong></div>`;
                    }


                }

                else if (grid_id == 'BusinessPartner_GRNGrid') {
                    if (row.StatusId == 2) {
                        ele = `<div class="ellipsis text-ellipsis" style="color: #169700"><strong>Approved, ${row.WorkFlowDate}</strong></div>`;
                    }
                    else if (row.StatusId == 3) {
                        ele = `<div class="ellipsis text-ellipsis" style="color: #ff0000"><strong>Rejected, ${row.WorkFlowDate}</strong></div>`;
                    }
                    else {
                        ele = `<div class="ellipsis text-ellipsis"><strong>Created, ${row.WorkFlowDate}</strong></div>`;
                    }


                }
                return ele;

            case "ellipsis":
                return `<div class="ellipsis">${data[col.Field] || ''}</div>`;
            case "date":
                return `<div>${ChangeDateFormatToddMMYYYWithSlace(data[col.Field]) || ''}</div>`;
            case "datetime":
                return `<div>${getdatetime(data[col.Field]) || ''}</div>`
            case "dateLink":
                const url2 = col.LinkTemplate.replace("{auth}", AuthToken).replace("{Id}", data.Id);
                return `<a href="${url2}" class="d-flex justify-content-between link-grid" title="${data[col.TitleField]}">
                            <strong class="link-grid-ellipsis ellipsis">${data[col.Field]}</strong>
                            <span  class="link-icon"><img src="../../assets/images/icons/help/edit.png" class="icon-xsm" /></span>
                        </a>`;

            case "delay_tms":

                if (grid_id == 'PendingTask') {
                    date = convertDelayIndays(data.CombinedDateTime);
                }
                else {
                    date = calculateDelayTime(data.Delay);
                }

                return date;
            case "status-dot":
                const color = data[col.Field] === "Active" ? "green-bg" : "red-bg";
                return `<span class="circle circle-sm ${color}" title="${data[col.Field]}"></span>`;
            case "upload-link":

                var link = '';
                if (grid_id == 'Employee') {
                    return `<a href="#" onclick="UserLogActivity('${data.Id}', '${data.emp_name}', '${data.emp_code}', '${data.Department}')"><strong>View</strong></a>`;
                }
                /* else if (grid_id != 'ItemMasterGrid') {*/
                else if (grid_id == 'ItemMasterGrid') {
                    link = col.LinkTemplate.replace("{auth}", AuthToken).replace("{itemId}", data.ITEM_ID);
                }

                else {
                    link = col.LinkTemplate.replace("{auth}", AuthToken).replace("{Id}", data.Id);
                }


                return `<a href="${link}" class="fn-bold">View</a>`;

            case "fms_task":
                var row = params.data;
                var TaskNo = '';

                if (grid_id == 'SampleFMS' || grid_id == 'SampleFMSPC') {


                    if (row.TaskNo == 7 && row.ActualTime != null) {
                        TaskNo = '';
                    }
                    else {
                        TaskNo = `<strong class="text-primary" > Task ${row.TaskNo}</strong>`;
                    }

                    return `<p class='text-two-p'>${TaskNo}<span class="d-block">${row.TaskNo == `1` ? `Enter Basic Information` : row.TaskNo == `2` ? `Sample Production` : row.TaskNo == `3` ? `Quality Check` : row.TaskNo == `4` ? `Bill Of Material` : row.TaskNo == `5` ? `Enter Sample ingredients list` : row.TaskNo == `6` ? `Dispatch Sample` : row.TaskNo == 7 && row.ActualTime == null ? `Enter Customer's Feedback` : `All Tasks Completed`
                        }</span><p>`;
                }
                if (grid_id == 'SaleOrderFMSGried' || grid_id == 'SalesOrderFMSOPC' || grid_id == 'O2DPLGriedFMS') {


                        
                        TaskNo = `<strong class="text-primary" > Task ${row.Actual_TaskNo}</strong>`;

                    if (row.FMS_TaskName == 'All Tasks Completed') {
                        TaskNo = ``;
                    }

                        return `<p class='text-two-p'>${TaskNo}<span class="d-block">${row.FMS_TaskName}</span></p>`;
                    
                }
                else if (grid_id == 'OilLSampleFMS' || grid_id == 'OilLSampleFMSPC') {


                    if (row.TaskNo == 4 && row.ActualTime != null) {
                        TaskNo = '';
                    }
                    else {
                        TaskNo = `<strong class="text-primary" > Task ${row.TaskNo}</strong>`;
                    }

                    return `<p class='text-two-p'>${TaskNo}<span class="d-block">${row.TaskNo == `1` ? `Arrange Sample` : row.TaskNo == `2` ? `Enter Quality Details` : row.TaskNo == `3` ? `Dispatch Sample` : row.TaskNo == `4` && row.ActualTime == null ? `Enter Customer Feedback` : `All Tasks Completed`
                        }</span><p>`;

                }
                else if (grid_id == 'OilULSampleFMS' || grid_id == 'OilULSampleFMSPC') {


                    if (row.TaskNo == 5 && row.ActualTime != null) {
                        TaskNo = '';
                    }
                    else {
                        TaskNo = `<strong class="text-primary" > Task ${row.TaskNo}</strong>`;
                    }

                    return `<p class='text-two-p'>${TaskNo}<span class="d-block">${row.TaskNo == `1` ? `Arrange Sample` : row.TaskNo == `2` ? `Enter Quality Details` : row.TaskNo == `3` ? `QC Check Initialized` : row.TaskNo == `4` ? `Dispatch Sample` : row.TaskNo == `5` && row.ActualTime == null ? `Enter Customer Feedback` : `All Tasks Completed`
                        }</span><p>`;

                }
                else if (grid_id == 'QCFMS' || grid_id == 'QCFMS_Completed' || grid_id == 'QCFMSPC') {


                    if (row.TaskNo == 3 && row.ActualTime != null) {
                        TaskNo = '';
                    }
                    else if (row.TaskNo == 2 && row.ActualTime != null) {
                        TaskNo = '';
                    }
                    else {
                        TaskNo = `<strong class="text-primary" > Task ${row.TaskNo}</strong>`;
                    }

                    return `<p class="text-two-p">${TaskNo}<span class="d-block">${row.TaskNo == `1` ? `Enter QC Parameters` : row.TaskNo == `2` && row.ActualTime == null ? `QC Check Initiated` : row.TaskNo == `3` && row.ActualTime == null ? `MicroTesting` : `All Tasks Completed`
                        }</span></p>`;

                }

            case 'Indentaction-buttons':
                var row = params.data;
                if (grid_id == 'IndentIndex') {

                    var isInactiveAction = "";
                    var isCreatePOAction = "";

                    if (row.StatusId == 2) {
                        isInactiveAction = `<input type="hidden" value="${row.DocNo}" id="hdnIndentDocNumber_${row.ID}" /><a class="dropdown-item" href="CreateIndent?auth=${AuthToken}&id=${row.ID}">Edit</a>`;
                    }

                    if (row.StatusId == 3) {
                        isCreatePOAction = `<a class="dropdown-item" href="CreatePurchaseOrder?auth=${AuthToken}&id=0&suppId=0&IndId=${row.ID}">Create Purchase Order</a>`;
                    }

                    return `
        <div class="dropdown" >
            <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
            </span>
            <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton" style="position: relative; z-index: 9999;">
                <a class="dropdown-item" href="ViewIndent?auth=${AuthToken}&id=${row.ID}">View Details</a>
                ${isInactiveAction}
                ${isCreatePOAction}
                <a class="dropdown-item" href="CreateIndent?auth=${AuthToken}&id=${row.ID}&suppId=0&isDuplicate=1">Duplicate</a>
            </div>
        </div>
        
    `;
                }
                else if (grid_id == 'SampleIndex') {
                    var isInactiveAction = "";
                    var viewDetails = "";

                    var CreateTime = "";

                    if (row.IsEdit == 1) {
                        isInactiveAction = '<a class="dropdown-item" href="AddSample?auth=' + AuthToken + '&id=' + row.Id + '">Edit</a>';
                    }

                    if ( row.SampleType != 'Oil' && !row.Item_Code) {


                        CreateTime = `<a class="dropdown-item" href="#" onclick="CreateItem(${row.Id})" >Create Item</a>`;

                    }

                    viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.Id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    cancelDetails = `<a class="dropdown-item" href="#" onclick="showTaskDeleteModal(${row.Id}, '${row.DocNo}')" >Cancel</a>`;

                    var print_sample_order = `<a  class="dropdown-item" href="#" onclick="printSampleOrder(${row.ERP_Sample_Id}, '${row.DocNo}')"  aclass="dropdown-item" href="#">Print Report</a>`


                    return '<div class="dropdown td-defualt-center">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="ViewSampleDetails?auth=' + AuthToken + '&id=' + row.Id + '&Status=' + row.IsEdit + '">View Details</a>' +
                        isInactiveAction + viewDetails + cancelDetails + print_sample_order + CreateTime + '</div>' +
                        '</div>';

                }

                else if (grid_id == 'BOM') {
                    // var isInactiveAction = "";
                    var viewDetails = "";




                    var isInactiveAction = '<a class="dropdown-item" href="CreateBOM?auth=' + AuthToken + '&bomId=' + row.Id + '" onclick="setIsEdit()">Edit</a>';

                    if (row.IsSampleProd == 1) {
                        isInactiveAction = '';
                    }

                    var viewDetails = '<a class="dropdown-item" href="CreateBOM?auth=' + AuthToken + '&bomId=' + row.Id + '" onclick="setIsView()">View Details</a>';

                    return '<div class="dropdown td-defualt-center">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">' +
                        isInactiveAction + viewDetails +
                        '</div></div>';


                }

                else if (grid_id == 'FGBOM') {

                    var viewDetails = "";




                    var isInactiveAction = '<a class="dropdown-item" href="CreateBOMFG?auth=' + AuthToken + '&bomId=' + row.Id + '&IsEdit=1">Edit</a>';
                    var viewDetails = '<a class="dropdown-item" href="CreateBOMFG?auth=' + AuthToken + '&bomId=' + row.Id + '&IsEdit=0">View Details</a>';

                    return '<div class="dropdown td-defualt-center">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">' +
                        isInactiveAction + viewDetails +
                        '</div></div>';


                }


                else if (grid_id == 'DispatchStatus') {
                    var viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.Id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    var CreateTime = ``

                    if (row.StatusTest == "Approved" && row.SampleType != 'Oil' && !row.Item_Code) {

                        
                            CreateTime = `<a class="dropdown-item" href="#" onclick="CreateItem(${row.Id})" >Create Item</a>`;
                      
                    }

                    var print_sample_order = `<a  class="dropdown-item" href="#" onclick="printSampleOrder(${row.ERP_Sample_Id}, '${row.DocNo}')"  aclass="dropdown-item" href="#">Print Report</a>`

                    return '<div class="dropdown td-defualt-center">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="ViewSampleDetails?auth=' + AuthToken + '&id=' + row.Id + '&Status=' + row.IsEdit + '">View Details</a>' +
                        '<a class="dropdown-item" href="EnterDispatchSample?auth=' + AuthToken + '&id=' + row.Id + '&isDispatched=1">View Dispatch Details</a>'
                        + viewDetails + CreateTime + print_sample_order + '</div>' +
                        '</div>';


                }
                else if (grid_id == 'OilLSampleFMS') {
                    var viewDetails = "";

                    var markDone = "";

                    viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.Id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    markDone = `<a class="dropdown-item" onclick="showDataOilLFMS(${row.Id}, ${row.TaskNo})" > Mark Done</a >`;

                    return `<div class="dropdown">
                                                <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                                                    <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                                                </span>
                                                <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                                                    ${viewDetails}
                                                    ${markDone}
                                                </div>
                                            </div>`;


                }

                else if (grid_id == 'OilULSampleFMS') {
                    var viewDetails = "";

                    var markDone = "";

                    viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.Id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    markDone = `<a class="dropdown-item" onclick="showDataOilULFMS(${row.Id}, ${row.TaskNo})" > Mark Done</a >`;

                    return `<div class="dropdown">
                                                <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                                                    <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                                                </span>
                                                <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                                                    ${viewDetails}
                                                    ${markDone}
                                                </div>
                                            </div>`;


                }

                else if (grid_id == 'SampleFMS') {
                    var viewDetails = "";

                    var markDone = "";

                    viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.Id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    if (row.TaskNo == 6) {
                        markDone = `<a class="dropdown-item" href="EnterDispatchSample?auth=${AuthToken}&id=${row.ERP_Sample_Id}">Mark Done</a>`;
                    }
                    else if (row.TaskNo == 1) {
                        markDone = ` <a class="dropdown-item" onclick="showData(${row.Id})">Mark Done</a>`;
                    }
                    else if (row.TaskNo == 2 || row.TaskNo == 3 || row.TaskNo == 5) {
                        markDone = ` <a class="dropdown-item" onclick="showData234(${row.Id}, ${row.TaskNo})">Mark Done</a>`;
                    }
                    else if (row.TaskNo == 4) {
                        markDone = `<a class="dropdown-item" onclick = "StoreChemistName('${String(row.Chemist)}', '${String(row.SampleType)}', ${row.BOM_ID})" href = "EnterFormulationForSample?auth=${AuthToken}&id=${row.Id}" > Mark Done</a >`;
                    }
                    else if (row.TaskNo == 7) {
                        if (row.IsModification == 0) {
                            markDone = `<a class="dropdown-item" href="AddSample?auth=${AuthToken}&id=${row.Id}&isDuplicate=1&prev_sampId=${row.DocNo}" >Modification</a>`;
                        }
                        else if (row.IsModification != 1) {
                            markDone = `<a class="dropdown-item" onclick="showData8(${row.Id})">Mark Done</a>`;
                        }
                    }

                    return `<div class="dropdown">
                                                <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                                                    <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                                                </span>
                                                <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                                                    ${viewDetails}
                                                    ${markDone}
                                                </div>
                                            </div>`;


                }
                else if (grid_id == 'QCFMS') {

                    var viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.GRNItemId}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    return '<div class="dropdown td-defualt-center">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">' +
                        '<a class="dropdown-item" href="#" data-toggle="modal" onclick="ShowMapping(' + row.ITEM_ID + ',' + row.GRNItemId + ',' + row.TaskNo + ');">Mark Done</a>' +
                        viewDetails +
                        //'<a class="dropdown-item" href="Add-new-sample.html">Print COA</a>' +


                        '</div>' +
                        '</div > ';
                }

                else if (grid_id == 'QCFMS_Completed') {

                    var viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.GRNItemId}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    var COAReport = ``;

                    if (row.Category == 'Packing Material' || row.Category == 'Raw Material') {

                        COAReport = `<a class="dropdown-item" href="#" onclick="printCOA_RM_PM(${row.GRNItemId}, '${row.ARNumber}')" >Print COA Report</a>`;
                    }
                    else {
                        COAReport = `<a class="dropdown-item" href="#" onclick="PrintCOA_FG_Oil(${row.GRNItemId}, '${row.ARNumber}')" >Print COA Report</a>`;
                    }

                    if (row.TaskNo == 3) {
                        var MLTReport = `<a class="dropdown-item" href="#" onclick="PrintMLT_Report(${row.GRNItemId}, '${row.ARNumber}')" >Print MLT Report</a>`;
                    }
                    else {
                        MLTReport = ``;
                    }

                    var ARN_Label = ``;

                    return '<div class="dropdown td-defualt-center">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">' +
                        '<a class="dropdown-item" href="#" data-toggle="modal" onclick="ShowMapping(' + row.ITEM_ID + ',' + row.GRNItemId + ',' + row.TaskNo + ');">View Details</a>' +
                        viewDetails +
                        COAReport +
                        MLTReport +
                        ARN_Label +
                        /*                        '<a class="dropdown-item" href="Add-new-sample.html">Print COA</a>' +*/


                        '</div>' +
                        '</div > ';

                }

                else if (grid_id == 'FMS') {

                    return `<div class="d-flex td-action-btn">
                          <a href="#" class="d-flex justify-content-between" onclick="EditFMSConfig(${row.Id})" aria-describedby="tooltip18006">
                              <img src="../assets/images/icons/help/edit-icon.png" alt="" class="action-image">
                           </a>
                       </div>`;


                }
                else if (grid_id == 'UserList') {
                    var strReturn = "";


                    //<a href="" data-toggle="modal" onclick="set_delVariable(${row.isDeleted}, ${row.Id}, '${row.emp_name}')" ${row.isDeleted ? `data-target="#confirmationdeactivate"` : `data-target="#confirmation"`} >
                    //    <i ${row.isDeleted ? `class="fa fa-times-circle red-crl"` : `class="fa fa-check-circle checkgreen"`} data-toggle="tooltip" title="" aria-hidden="true" ${row.isDeleted ? `data-original-title="Click to Activate"` : `data-original-title="Click to DeActivate"`}></i>
                    //</a>

                    strReturn += `
                                            <div class="d-flex td-action-btn">


                                              <div class="Del_9">
                                                <input type="checkbox" class="checkbox" onclick="set_delVariable(${row.isDeleted}, ${row.Id}, '${row.emp_name}')" ${!row.isDeleted ? `checked = ""` : ``} id="popswitch1_${row.Id}" >
                                                <label for="popswitch1_${row.Id}" class="checkbox-label" data-on-label="Active"  data-toggle="modal" ${row.isDeleted ? `data-target="#confirmationdeactivate"` : `data-target="#confirmation"`}>
                                                    <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                                    <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                                    <span class="ball"></span>
                                                </label>

                                            </div>


                                            <span class="gap-space">|</span>
                                            <a href="" onclick="EditUserListMaster(${row.Id})" data-toggle="modal" data-target="#edit"><img src="../assets/images/icons/help/edit-icon.png" class="action-image" data-toggle="tooltip" title="Edit" > </a></div>`;

                    return strReturn;
                }

                else if (grid_id == 'Role') {
                    var strReturn = "";

                    strReturn += `
                                            <div class="d-flex td-action-btn">
                                                    <div class="Del_9">
                                                        <input type="checkbox" class="checkbox" onclick="set_delVariable(${row.isDeleted}, ${row.Id}, '${row.role_name}')" ${!row.isDeleted ? `checked = ""` : ``} id="popswitch1_${row.Id}" >
                                                            <label for="popswitch1_${row.Id}" class="checkbox-label" data-on-label="Active" data-toggle="modal" ${row.isDeleted ? `data-target="#confirmationdeactivate"` : `data-target="#confirmation"`}>
                                                                <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                                                    <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                                                        <span class="ball"></span>
                                                                    </label>

                                                                </div>
                                            <span class="gap-space">|</span>
                                            <a href="" onclick="EditRoleMaster(${row.Id})" data-toggle="modal" data-target="#edit"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image">
                                            </i></a></div>`;

                    return strReturn;
                }

                else if (grid_id == 'Employee') {
                    var strReturn = "";
                    strReturn = `<div class="d-flex td-action-btn">
                                       <a href="#" onclick="edit_empMaster(${row.Id})"  class="d-flex justify-content-between" data-toggle="tooltip" title="Edit">
                              <img src="${baseURL + `assets/images/icons/help/edit-icon.png`}" alt="" class="action-image" />
                            </a>
                            <span class="gap-space">|</span>
                              <div class="Del_9">
                            <input type="checkbox" class="checkbox" onclick="del_empMaster(${row.Id}, '${row.emp_name}', ${row.IsActive})" ${row.IsActive ? `checked = ""` : ``} id="popswitch1_${row.Id}" >
                            <label for="popswitch1_${row.Id}" class="checkbox-label" data-on-label="Active"  data-toggle="modal" data-target="#confirmmsg">
                                <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                <span class="ball"></span>
                            </label>

                        </div>
                            
                        </div>`;


                    //<a href="#" onclick="del_empMaster(${row.Id}, '${row.emp_name}', ${row.IsActive})"  >
                    //        <img src="${baseURL + `assets/images/icons/help/eye-on-icon.png`}" data-toggle="tooltip" ${row.IsActive == 1 ? `title="Inactive"` : `title="Active"`} alt="" class="action-image" />
                    //    </a>




                    return strReturn;
                }

                else if (grid_id == 'TaskMaster') {
                    return '<div class="text-center-sm action-btn-td"><a title="Edit" data-toggle="tooltip" class="Edit_1" href="AddTaskMaster?auth=' + AuthToken + '&id=' + row.Id + '"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a><span class="divline"> | </span><a  data-toggle="tooltip" title="" href="AddTaskMaster?auth=' + AuthToken + '&id=' + row.Id + '&isDuplicate=1" data-original-title="Duplicate"><img src="/assets/images/icons/help/copy-icon.png" alt="No Image" class="action-image"></a></div>';
                }

                else if (grid_id == 'InactiveTaskMaster') {

                    return '<div class="text-center-sm action-btn-td"><a title="Edit" data-toggle="tooltip" class="Edit_1" href="AddTaskMaster?auth=' + AuthToken + '&id=' + row.Id + '"><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a><span class="divline"> | </span><a data-toggle="tooltip" title="" href="AddTaskMaster?auth=' + AuthToken + '&id=' + row.Id + '&isDuplicate=1" data-original-title="Duplicate"><img src="/assets/images/icons/help/copy-icon.png" alt="" class="action-image"></a></div>';
                }
                else if (grid_id == 'Branch') {
                    var strReturn = "";
                    strReturn = '<a title="Edit" class="Edit_5"   href="AddBranchMaster?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';

                    return strReturn;
                }

                else if (grid_id == 'Holiday') {
                    if (row.Status == 0) {
                        var strReturn = "";
                        strReturn = '<div class="d-flex td-action-btn">' +
                            '<a href="#" id="' + row.Id + '" class="Edit_9" data-toggle="modal" data-target="#confirmmsg" disabled   ><img src="~/../../assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a>'
                            + '</div>'
                    }
                    else {
                        var strReturn = "";
                        strReturn = '<div class="d-flex td-action-btn">' +
                            '<a href="" id="' + row.Id + '" class="Edit_9" onclick="EditHolidayMaster(this.id)" data-toggle="modal" data-target="#add"  > <img src="~/../../assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a>'
                            + '</div>'
                    }


                    return strReturn;
                }
                else if (grid_id == 'POIndexGried') {
                    var isInactiveAction = "";
                    if (row.StatusId == 1) {
                        isInactiveAction = '<input type="hidden" value="' + row.DocNo + '" id="hdnIndentDocNumber_' + row.ID + '" /><a class="dropdown-item" href="CreatePurchaseOrder?auth=' + AuthToken + '&id=' + row.ID + '&suppId=' + row.PA_ID + '">Edit</a>';
                    }
                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="ViewPurchaseOrder?auth=' + AuthToken + '&id=' + row.ID + '&suppId=' + row.PA_ID + '">View Details</a>' +
                        isInactiveAction + /*' <a  class="dropdown-item"  aclass="dropdown-item" href="DuplicatePurchaseOrder?auth=' + AuthToken +'&id=' + row.ID + '&suppId=' + row.PA_ID + '">Duplicate</a>' +*/
                        /* ' <a  class="dropdown-item" href="../purchaseorder/index.html" aclass="dropdown-item" href="#">Share</a>' +*/
                        /* ' <a  class="dropdown-item" href="#" onclick="PurchaseOrderPrint(' + row.ID + ');"  aclass="dropdown-item" href="#">Print</a>' +*/
                        '<a  class="dropdown-item" href="#" onclick="printPurchaseOrder(' + row.ID + ', ' + row.PODocNo + ');"  aclass="dropdown-item" href="#">Print Report</a>' +
                        '</div>';

                    /*a onclick=OpenIndentPopup(' + row.ID + ') class="dropdown-item" hrefdata - toggle="modal"data - target="#deletepopup" > Delete</a >*/
                }

                else if (grid_id == 'Attendance') {
                    var strReturn =
                        '<div class="d-flex td-action-btn">' +
                        '<a disabled href="#"   id="' + row.Id + '" class="Edit_10"  title="" data-original-title="Edit" onclick="EditAttendanceMaster(this.id)" class="edtclr"><img src="~/../../assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a>'


                    return strReturn;
                }

                else if (grid_id == 'PendingTask') {
                    var strReturn = "";
                    if (row.StatusId == 1) {
                        strReturn = '<a title="Edit" class="Edit_2"   href="AddPcTask?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"></a> ';
                    }
                    else if (row.StatusId == 4) {
                        strReturn = '<a title="Edit" class="Edit_2"   href="PCTaskReattempt?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';
                    }
                    //Click to DeActivate                     
                    //Click to Activate                      
                    //if (row.PlannedScore == "Active") {
                    //    strReturn = "<a title='Click to DeActivate' data-toggle='tooltip' data-original-title='Click to DeActivate' class='AIsActive'  onclick='Activate(" + row.id + ")' ><i class='fa fa-check-circle checkgreen' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                    //}
                    //if (row.PlannedScore == "Deactive") {
                    //    strReturn = "<a title='Click to Activate' data-toggle='tooltip' data-original-title='Click to Activate' class='AIsActive' onclick='Activate(" + row.id + ")' ><i class='fa fa-times-circle crossred' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                    //}

                    return strReturn;
                }

                else if (grid_id == 'PendingForAuditTask') {
                    var strReturn = "";
                    strReturn = '<a title="Edit" class="Edit_2"  href="PcTaskAudit?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';
                    //Click to DeActivate                     
                    //Click to Activate                      
                    //if (row.PlannedScore == "Active") {
                    //    strReturn = "<a title='Click to DeActivate' data-toggle='tooltip' data-original-title='Click to DeActivate' class='AIsActive'  onclick='Activate(" + row.id + ")' ><i class='fa fa-check-circle checkgreen' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                    //}
                    //if (row.PlannedScore == "Deactive") {
                    //    strReturn = "<a title='Click to Activate' data-toggle='tooltip' data-original-title='Click to Activate' class='AIsActive' onclick='Activate(" + row.id + ")' ><i class='fa fa-times-circle crossred' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                    //}

                    return strReturn;


                }

                else if (grid_id == 'CompletedTask') {
                    var strReturn = "";
                    strReturn = '<a title="Edit" class="Edit_2"  href="PcTaskCompleted?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';
                    //Click to DeActivate                     
                    //Click to Activate                      
                    //if (row.PlannedScore == "Active") {
                    //    strReturn = "<a title='Click to DeActivate' data-toggle='tooltip' data-original-title='Click to DeActivate' class='AIsActive'  onclick='Activate(" + row.id + ")' ><i class='fa fa-check-circle checkgreen' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                    //}
                    //if (row.PlannedScore == "Deactive") {
                    //    strReturn = "<a title='Click to Activate' data-toggle='tooltip' data-original-title='Click to Activate' class='AIsActive' onclick='Activate(" + row.id + ")' ><i class='fa fa-times-circle crossred' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                    //}

                    return strReturn;


                }

                else if (grid_id == 'CancelledTask') {
                    var strReturn = "";

                    if (row.ReattemptTime == null) {
                        strReturn = '<a title="Edit" class="Edit_2"  href="PcTaskCancelled?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';
                    }

                    else {
                        strReturn = '<a title="Edit" class="Edit_2"  href="PCTaskReattemptCancelled?auth=' + AuthToken + '&id=' + row.Id + ' " ><img src="/assets/images/icons/help/edit-icon.png" alt="" class="action-image"> </a> ';
                    }
                    //Click to DeActivate                     
                    //Click to Activate                      
                    //if (row.PlannedScore == "Active") {
                    //    strReturn = "<a title='Click to DeActivate' data-toggle='tooltip' data-original-title='Click to DeActivate' class='AIsActive'  onclick='Activate(" + row.id + ")' ><i class='fa fa-check-circle checkgreen' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                    //}
                    //if (row.PlannedScore == "Deactive") {
                    //    strReturn = "<a title='Click to Activate' data-toggle='tooltip' data-original-title='Click to Activate' class='AIsActive' onclick='Activate(" + row.id + ")' ><i class='fa fa-times-circle crossred' aria-hidden='true'  ></i> </a><a title='Edit' data-toggle='modal' data-target='#sc'  onclick='EditSubCate(" + row.id + ")' ><i class='fas fa-edit' aria-hidden='true' ></i> </a> ";
                    //}

                    return strReturn;


                }

                else if (grid_id == 'MyHelpTicket') {
                    return `<div class="dropdown">
                    <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                        <img src="../assets/images/icons/help/more-icon.png" class="icon-md">
                    </span>
                    <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                        ${row.Status == 1 ? `<a class="dropdown-item" href = "#" onclick = "EditHelpTicket(${row.Id})">Edit</a>` : `<a class="dropdown-item" href = "#" onclick="ViewHelpTicket(${row.Id})">View Ticket</a>`}
                    </div>
                </div>`;

                }

                else if (grid_id == 'UserHelpTicket') {

                    return `<div class="dropdown">
                    <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                        <img src="../assets/images/icons/help/more-icon.png" class="icon-md">
                    </span>
                    <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                        ${row.Status == 1 ? `<a class="dropdown-item" href = "#" onclick = "ShowResolvedTicket(${row.Id})"> Resolve Ticket</a>` : `<a class="dropdown-item" href = "#" onclick = "ViewResolvedTicket(${row.Id})">View Resolved Ticket</a>`}
                    </div>
                </div>`;


                }

                else if (grid_id == 'TechnicalHelpTicket') {


                    return `<div class="dropdown">
                        <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                            <img src="../assets/images/icons/help/more-icon.png" class="icon-md">
                        </span>
                        <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                            ${row.Status == 1 ? `<a class="dropdown-item" href = "#" onclick = "ShowResolvedTicket(${row.Id})"> Resolve Ticket</a>` : `<a class="dropdown-item" href = "#" onclick = "ViewResolvedTicket(${row.Id})">View Resolved Ticket</a>`}
                        </div>
                    </div>`;



                }
                else if (grid_id == 'PCTicket') {


                    if (row.Status == 3) {
                        return `<button class="btn actionbtn border-r-f" disabled>Closed</button>`;
                    }
                    else if (row.Status == 2) {
                        return `<button class="btn actionbtn border-r-f" onclick="ResolveHelpPCTicket(${row.Id})">Close</button>`;
                    }
                    else {
                        return `<label></label>`;
                    }
                }
                else if (grid_id == 'CustomerGried') {
                    return `
                        <div class="dropdown">
                            <span class="dropdown-toggle cursor-pointer arrow-none" type="button" id="dropdownMenuButton_${row.ID}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="../assets/images/icons/help/more-icon.png" class="icon-md">
                            </span>
                            <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton_${row.ID}">
                                <a class="dropdown-item" href="ViewCustomer?auth=${AuthToken}&id=${row.ID}&status=2">View Details</a>
                                <a class="dropdown-item" href="AddCustomer?auth=${AuthToken}&custid=${row.ID}">Edit Details</a>
                                <a class="dropdown-item" href="add-new-order.html">Add New Order</a>
                                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#createnewproject">Add NBD, CRR Project</a>
                                <a class="dropdown-item" href="add-new-customer-Item.html">Add New Item</a>
                                <a class="dropdown-item" href="#">Add Payment</a>
                                <a class="dropdown-item" ${row.StatusId != 2 ? `style="display:none;"` : ``} href="../ManageSample/AddSample?auth=${AuthToken}&customer_id=${row.ID}">Add New Sample</a>
                            </div>
                        </div>`;
                }
                else if (grid_id == 'VendorGried') {
                    var strReturn = "";
                    strReturn = `<div class="d-flex td-action-btn">
                        <a href="CreateVendor?auth=${AuthToken}&id=${row.ID}&status=${row.StatusId}" class="d-flex justify-content-between" data-toggle="tooltip" title="Edit">
                              <img src="${baseURL + `assets/images/icons/help/edit-icon.png`}" alt="" class="action-image" />
                            </a>
                            <span class="gap-space">|</span>
                              <div class="Del_9">
                            <input type="checkbox" class="checkbox" onclick="del_vendorMaster(${row.ID}, '${row.VendorName}', ${row.IsActive})" ${row.IsActive ? `checked = ""` : ``} id="popswitch1_${row.ID}" >
                            <label for="popswitch1_${row.ID}" class="checkbox-label" data-on-label="Active"  data-toggle="modal" data-target="#confirmmsg">
                                <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                <span class="ball"></span>
                            </label>

                        </div>

                        </div>`;

                    return strReturn;

                }

                else if (grid_id == 'IndentApprovalGried') {
                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="IndentViewApproval?auth=' + AuthToken + '&id=' + row.ID + '">View Details</a>' +
                        '</div>';
                }

                else if (grid_id == 'GRNReport') {
                    var isInactiveAction = "";
                    var ARN_Label = "";
                    if (row.StatusId == 1) {
                        isInactiveAction = '<input type="hidden" value="' + row.DocNo + '" id="hdnIndentDocNumber_' + row.ID + '" /><a class="dropdown-item" href="../../MaterialManagement/Material/CreateGrn?auth=' + AuthToken + '&id=' + row.ID + '&suppId=' + row.PA_ID + '">Edit</a>';
                    }
                    // Show ARN_Label only if StatusId == 2
                    if (row.StatusId == 2) {
                        ARN_Label = `<a class="dropdown-item" href="#" onclick="GetGrnItemId(${row.ID}, ${row.GRNDocNo})">Print ARN Label</a>`;
                    }
                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="../../MaterialManagement/Material/ViewGrn?auth=' + AuthToken + '&id=' + row.ID + '">View Details</a>' +
                        isInactiveAction +
                        ARN_Label +
                        ' <a  class="dropdown-item" class="dropdown-item" href="#" onclick="printGRNOrder(' + row.ID + ', ' + row.GRNDocNo+');">Print</a>' +
                        ' <a  class="dropdown-item" href="../purchaseorder/index.html" aclass="dropdown-item" href="#">Request For Payment</a>' +
                        '</div>';
                }

                else if (grid_id == 'BusinessPartner_GRNGrid') {
                    var isInactiveAction = "";
                    //if (row.StatusId == 1) {
                    //    isInactiveAction = '<input type="hidden" value="' + row.DocNo + '" id="hdnIndentDocNumber_' + row.ID + '" /><a class="dropdown-item" href="CreateGrn?auth=' + AuthToken + '&id=' + row.ID + '&suppId=' + row.PA_ID + '">Edit</a>';
                    //}
                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="../../MaterialManagement/Material/ViewGrn?auth=' + AuthToken + '&id=' + row.ID + '&ErpPartyId=' + row.ErpPartyId + '&PAId='+row.PA_ID+'&PageType=' + 'VendorGRN' +'">View Details</a>' +
                        isInactiveAction +
                        '</div>';
                }

                else if (grid_id == 'GRNApproval') {

                    var ARN_Label = `<a class="dropdown-item" href="#" onclick="GetGrnItemId(${row.ID})" >Print ARN Label</a>`;
                    if (row.StatusId == 1) {
                        return '<div class="dropdown">' +
                            '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                            '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                            '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="ViewGRNApproval?auth=' + AuthToken + '&id=' + row.ID + '">View Details</a>' +
                            '</div>';
                    }
                    else {
                        return '<div class="dropdown">' +
                            '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                            '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                            '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="ViewGRNApproval?auth=' + AuthToken + '&id=' + row.ID + '&IsNotApprove=1">View Details</a>' +
                            ARN_Label +
                            '</div>';
                    }

                }


                else if (grid_id == 'DebitNoteReport') {
                    var isInactiveAction = "";
                    if (row.StatusId == 1) {
                        isInactiveAction = '<input type="hidden" value="' + row.DocNo + '" id="hdnIndentDocNumber_' + row.ID + '" /><a class="dropdown-item" href="CreateDebitNote?auth=' + AuthToken + '&ids=0&id=' + row.ID + '">Edit</a> <a onclick=OpenIndentPopup(' + row.ID + ') class="dropdown-item" hrefdata-toggle="modal"data-target="#deletepopup">Delete</a>';
                    }
                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">' +
                        '</span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">' +
                        '<a class="dropdown-item" href="CreateDebitNote?auth=' + AuthToken + '&ids=0&id=' + row.ID + '&isView=1">View</a> ' +
                        isInactiveAction +
                        '<a class="dropdown-item" href="#" onclick="printDebitNote(' + row.ID + ', ' + row.DebitDocNo + ');">Print</a>' +
                        '</div>' +
                        '</div>';

                }
                else if (grid_id == 'POApprovalGried') {
                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="ViewPurchaseOrderApproval?auth=' + AuthToken + '&id=' + row.ID + '">View Details</a>' +
                        '</div>';
                }
                else if (grid_id == 'GateEntryGried') {
                    var edit = "Edit"

                    var grn = ''

                    if (row.ViewGateEntry == 1) {
                        edit = "View"
                    }

                    if (row.ClientMaterialStatus == 'No' && row.ViewGateEntry != 1) {
                        grn = '<a class="dropdown-item" href="CreateGrn?auth=' + AuthToken + '&id=' + row.ID + '&suppId=' + row.Supp_Id + '&GateEntryId=' + row.ID + '">Create GRN</a>';
                    }

                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton_${row.ID}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">' +
                        '</span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton_${row.ID}">' +
                        '<a class="dropdown-item" href="/MaterialManagement/Material/EditGateEntry?auth=' + AuthToken + '&itemId=' + row.ID + '&viewGateEntry=' + row.ViewGateEntry + '">' + edit + '</a>' +
                        grn +
                        '</div>' +
                        '</div>';
                }

                else if (grid_id == 'POReturnApproval') {

                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton"> <a class="dropdown-item" href="ViewPurchaseReturnsApproval?auth=' + AuthToken + '&id=' + row.ID + '">View Details</a>' +
                        '</div>';

                }

                else if (grid_id == 'BusinessPartner_PoGrid') {
                    var isinactiveaction = "";
                    //if (row.statusid == 1) {  
                    //    isinactiveaction = '<input type="hidden" value="' + row.docno + '" id="hdnindentdocnumber_' + row.id + '" /><a class="dropdown-item" href="createpurchaseorder?auth=' + authtoken + '&id=' + row.id + '&suppid=' + row.pa_id + '">edit</a> <a onclick=openindentpopup(' + row.id + ') class="dropdown-item" hrefdata-toggle="modal"data-target="#deletepopup">delete</a>';
                    //}
                    return '<div class="dropdown">' +
                        '<span class="dropdown-toggle arrow-none" type="button" id="dropdownmenubutton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">' +
                        '<img src="../../assets/images/icons/help/more-icon.png" class="icon-md">  </span>' +
                        '<div class="dropdown-menu actionmenu" aria-labelledby="dropdownmenubutton"> <a class="dropdown-item" href="../../materialmanagement/material/viewpurchaseorder?auth=' + AuthToken + '&id=' + row.ID + '&suppid=' + row.PA_ID + '&ErpPartyId=' + row.ErpPartyId + '&PageType='+ 'VendorPO' +'">view details</a>' +
                        isinactiveaction + /*' <a  class="dropdown-item"  aclass="dropdown-item" href="duplicatepurchaseorder?auth=' + authtoken +'&id=' + row.id + '&suppid=' + row.pa_id + '">duplicate</a>' +*/
                        '</div>';
                }

                else if (grid_id == 'TechnicalDocGried') {

                    var viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.ID}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;
                    return `
                <div class="dropdown">
                    <span class="dropdown-toggle cursor-pointer arrow-none" type="button" id="dropdownMenuButton_${row.ID}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src="../assets/images/icons/help/more-icon.png" class="icon-md">
                    </span>
                    <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton_${row.ID}">
                        ${row.TaskNoDesc == 1 ? `<a class="dropdown-item" href="#" onclick="handleTechnicalDocStep2(${row.ID}, 'mark done')">Mark Done</a>` : ''}
                        ${row.TaskNoDesc == 2 ? `<a class="dropdown-item" href="#" onclick="handleTechnicalDocStep2(${row.ID}, 'view')">View</a>` : ''}
                        ${viewDetails}
                    </div>
                </div>`;

                }

                else if (grid_id == 'TechnicalDocMasterGried') {
                    return `
                <div class="dropdown">
                    <span class="dropdown-toggle cursor-pointer arrow-none" type="button" id="dropdownMenuButton_${row.ID}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src="../assets/images/icons/help/more-icon.png" class="icon-md">
                    </span>
                    <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton_${row.ID}">
                        ${row.IsEdit == 1 ? `<a class="dropdown-item" href="#" onclick="bindTechnicalDocDetById(${row.ID},1)">Edit</a>` : ''}
                        ${row.IsEdit == 0 ? `<a class="dropdown-item" href="#" onclick="bindTechnicalDocDetById(${row.ID},0)">View</a>` : ''}
                    </div>
                </div>`;

                }

                /////////////////////////////////////    PC Dashboard  Gried   ////////////////////////////

                else if (grid_id == 'SampleFMSPC') {

                    var viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModalPC(${row.Id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    return `<div class="dropdown">
                    <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                         <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                     </span>
                        <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                           ${viewDetails}
                        </div>
                    </div>`;
                }

                else if (grid_id == 'QCFMSPC') {

                    var viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModalPC(${row.GRNItemId}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    return `<div class="dropdown">
                    <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                         <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                    </span>
                         <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                               ${viewDetails}
                         </div>
                    </div>`;
                }
                else if (grid_id == 'OilLSampleFMSPC') {
                    var viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModalPC(${row.Id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    return `<div class="dropdown">
                    <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                         <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                    </span>
                         <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                               ${viewDetails}
                         </div>
                    </div>`;
                }

                else if (grid_id == 'OilULSampleFMSPC') {
                    var viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModalPC(${row.Id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    return `<div class="dropdown">
                    <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                         <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                    </span>
                        <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                               ${viewDetails}
                        </div>
                    </div>`;

                }
                else if (grid_id == 'TechnicalDocPC') {

                    var viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModalPC(${row.ID}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    return `<div class="dropdown">
                    <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                          <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                    </span>
                          <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                               ${viewDetails}
                          </div>
                    </div>`;


                }
                else if (grid_id == 'SalesOrderFMSOPC') {

                    var viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModalPC(${row.Order_ItemId}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    return `<div class="dropdown">
                    <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                          <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                    </span>
                          <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                               ${viewDetails}
                          </div>
                    </div>`;

                }
                /////////////////////////////////////    PC Dashboard  Gried  End  ////////////////////////////


                /////////////////////////////////////    Sale Order Gried   ////////////////////////////

                else if (grid_id == 'SaleOrderGried') {
                    return `
                <div class="dropdown">
                    <span class="dropdown-toggle cursor-pointer arrow-none" type="button" id="dropdownMenuButton_${row.ID}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src="../assets/images/icons/help/more-icon.png" class="icon-md">
                    </span>
                    <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton_${row.ID}">
                        <!-- EDIT (hide when ArchiveStatus = 1 (Yes), 2 (No)) -->
                             ${row.ArchiveStatus != 1
                            ? (row.OrderType === 'SaleOrder'
                                ? row.IsEdit ? `<a  class="dropdown-item" href="CreateOrder?auth=${AuthToken}&id=${row.ID}&Type=${row.OrderType}">Edit</a>` : ``
                            : `<a  class="dropdown-item" href="BulkOrder?auth=${AuthToken}&id=${row.ID}">Edit</a>`)
                            : ``}

                        <!-- VIEW SALES ORDER  -->
                            ${row.ArchiveStatus != 1
                        ? `<a  class="dropdown-item" href="/ManageOrder/ViewSalesOrder?auth=${AuthToken}&id=${row.ID}&Type=${row.OrderType}">View Sales Order</a>`
                            : ``}

                        <!-- Delete SALES ORDER  -->
                         ${row.OTDOrderStatus != 1
                        ? `<a class="dropdown-item" href="#" onclick="showDeleteModalByType(${row.ID}, '${row.OrderType}')">Delete</a>`
                            : ``}

                        <!-- OTHER MENU OPTIONS (always visible) -->
                        <a class="dropdown-item" onclick="printOrderReport(${row.ID}, '${row.DocNo}')">Print QC Form</a>

                        ${row.UserId == 1
                            ? `<a class="dropdown-item" href="#" onclick="showArchiveModalByType(${row.ID}, '${row.OrderType}')">Archive Order</a>`
                            : ``}
                        <a class="dropdown-item" href="#">View Costing Breakup</a>
                    </div>
                </div>`;

                }

                else if (grid_id == 'SaleOrderFMSGried') {
                    var viewDetails = viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.Order_ItemId}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    var markDone = "";

                    //viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.Id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    //if (row.Actual_TaskNo == 1) {
                    //    markDone = ` <a class="dropdown-item" onclick="getModalByStepNo(${row.Id}, ${row.Actual_TaskNo})">Mark Done</a>`;
                    //}

                    //else if (row.Actual_TaskNo == 6) {
                    //    markDone = `<a class="dropdown-item" href="EnterDispatchSample?auth=${AuthToken}&id=${row.ERP_Sample_Id}">Mark Done</a>`;
                    //}
                    //else if (row.Actual_TaskNo == 2 || row.Actual_TaskNo == 3 || row.Actual_TaskNo == 5) {
                    //    markDone = ` <a class="dropdown-item" onclick="showData234(${row.Id}, ${row.Actual_TaskNo})">Mark Done</a>`;
                    //}
                    //else if (row.Actual_TaskNo == 4) {
                    //    markDone = `<a class="dropdown-item" onclick = "StoreChemistName('${String(row.Chemist)}', '${String(row.SampleType)}', ${row.BOM_ID})" href = "EnterFormulationForSample?auth=${AuthToken}&id=${row.Id}" > Mark Done</a >`;
                    //}
                    //else if (row.Actual_TaskNo == 7) {
                    //    if (row.IsModification == 0) {
                    //        markDone = `<a class="dropdown-item" href="AddSample?auth=${AuthToken}&id=${row.Id}&isDuplicate=1&prev_sampId=${row.DocNo}" >Modification</a>`;
                    //    }
                    //    else if (row.IsModification != 1) {
                    //        markDone = `<a class="dropdown-item" onclick="showData8(${row.Id})">Mark Done</a>`;
                    //    }
                    //}

                    // Static dropdown with all 9 steps
                    markDone = `
                        <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, ${row.TaskId}, '${row.ItemOTDStatus}')">Mark Done</a>
                        
                    `;

                    //<a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 2)">Mark Done Step 2</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 3)">Mark Done Step 3</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 4)">Mark Done Step 4</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 5)">Mark Done Step 5</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 6)">Mark Done Step 6</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 7)">Mark Done Step 7</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 8)">Mark Done Step 8</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 9)">Mark Done Step 9</a>

                    return `<div class="dropdown">
                                                <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                                                    <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                                                </span>
                                                <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                                                    ${viewDetails}
                                                    ${markDone}
                                                </div>
                                            </div>`;


                }


                else if (grid_id == 'O2DPLGried') {
                   

                    var markDone = "";
                    markDone = `
                        <a class="dropdown-item" onclick="getO2DPrivateLabel(${row.Order_ItemId}, '${row.SampleId}', '${row.TotalOrder}', ${row.TotalOrderQty})">Mark Done</a>
                        
                    `;

                    //<a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 2)">Mark Done Step 2</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 3)">Mark Done Step 3</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 4)">Mark Done Step 4</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 5)">Mark Done Step 5</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 6)">Mark Done Step 6</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 7)">Mark Done Step 7</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 8)">Mark Done Step 8</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 9)">Mark Done Step 9</a>

                    return `<div class="dropdown">
                                                <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                                                    <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                                                </span>
                                                <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                                                    ${markDone}
                                                </div>
                                            </div>`;


                }

                else if (grid_id == 'O2DPLGriedFMS') {

                    var markDone = "";

                    var viewDetails = viewDetails = `<a class="dropdown-item" href="#" onclick="showTaskModal(${row.pl_id}, '${AuthToken}', ${row.FMS_Id})" >View Status</a>`;

                    markDone = `
                        <a class="dropdown-item" onclick="getO2DPrivateLabelFMSs(${row.Order_ItemId}, ${row.TaskId})">Mark Done</a>
                        
                    `;

                    //<a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 2)">Mark Done Step 2</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 3)">Mark Done Step 3</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 4)">Mark Done Step 4</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 5)">Mark Done Step 5</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 6)">Mark Done Step 6</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 7)">Mark Done Step 7</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 8)">Mark Done Step 8</a>
                    //    <a class="dropdown-item" onclick="getModalFieldByStepNo(${row.ID}, ${row.Order_ItemId}, 9)">Mark Done Step 9</a>

                    return `<div class="dropdown">
                                                <span class="dropdown-toggle arrow-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                                                    <img src="../../assets/images/icons/help/more-icon.png" class="icon-md">
                                                </span>
                                                <div class="dropdown-menu actionmenu" aria-labelledby="dropdownMenuButton">
                                                ${viewDetails}
                                                    ${markDone}
                                                </div>
                                            </div>`;
                }



            /////////////////////////////////////    Sale Order Gried End   ////////////////////////////


            /// this is for tms only
            case "Indentaction-buttons-delete":
                var row = params.data;

                if (grid_id == 'TaskMaster') {
                    var strReturn = "";
                    strReturn += `<div class="Del_9" >
                                                    <input type="checkbox" class="checkbox" id="${row.Id}" onclick="set_delVariable(${row.Id})" ${row.isdeleted ? `data-target="#confirmationdeactivate"` : `data-target="#confirmation"`} switch="bool" ${!row.isdeleted ? `checked=""` : ``} >
                                                        <label for="${row.Id}" class="checkbox-label" >
                                                            <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                                                    <span class="ball"></span>
                                                </label>

                                            </div>`




                    return strReturn;
                }

            
                else if (grid_id == 'InactiveTaskMaster') {

                    var strReturn = "";
                    strReturn += `<div class="d-flex td-action-btn">
                        <a href="" disabled data-toggle="modal">
                        <i ${row.isdeleted ? `class="fa fa-times-circle red-crl"` : `class="fa fa-check-circle checkgreen"`} data-toggle="tooltip" title="" aria-hidden="true"  ${row.isdeleted ? `data-original-title=""` : `data-original-title="Click to DeActivate"`}></i>
                        </a></div>`
                    return strReturn;
                }

                else if (grid_id == 'Holiday') {
                    var strReturn = "";
                    if (row.isDeleted == false) {
                        if (row.Status == 0) {
                            strReturn = `<div class="Del_9">
                            <input type="checkbox" class="checkbox" onclick="setDelId(this.id)" checked="" id="${row.Id}">
                            <label for="${row.Id}" class="checkbox-label" data-on-label="Active"  data-toggle="modal" data-target="#confirmmsg">
                                <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                <span class="ball"></span>
                            </label>

                        </div>`;
                        }
                        else {
                            strReturn = ` <div class="Del_9">
                                    <input type="checkbox" class="checkbox" id="${row.Id}" onclick="DeleteHoliday(this)" switch="bool" checked="">
                                        <label for="${row.Id}" class="checkbox-label" > 
                                            <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                                    <span class="ball"></span>
                            </label>

                        </div>`;


                        }
                    }
                    else {
                        if (row.Status == 0) {
                            strReturn = `< div class="Del_9" >
                                    <input type="checkbox" class="checkbox" onclick="setDelId(this.id)" id="${row.Id}">
                                        <label for="${row.Id}" class="checkbox-label" data-on-label="Active" data-toggle="modal" data-target="#confirmmsg">
                                            <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                                    <span class="ball"></span>
                            </label>

                        </div>`;
                        }

                        else {
                            strReturn = `<div class="Del_9">
                                    <input type="checkbox" class="checkbox" id="${row.Id}" onclick="DeleteHoliday(this)" switch="bool">
                                        <label for="${row.Id}" class="checkbox-label" >
                                            <img src="../assets/images/icons/help/check-white-icon.png" class="icon-16">
                                                <img src="../assets/images/icons/help/close-white-icon.png" class="icon-16 right-icon">
                                                    <span class="ball"></span>
                            </label>

                        </div>`;
                        }
                    }

                    return strReturn;
                }


            case "techdoc_task":
                var row = params.data;
                var TaskNo = '';

                if (grid_id == 'TechnicalDocGried' || grid_id == 'TechnicalDocPC') {

                    //TaskNo = `<strong class="text-primary" > Task ${row.TaskNoDesc}</strong>`;

                    //return `<p class='text-two-p'>${TaskNo}<span class="d-block">${row.TaskNoDesc == `2` ? `Share Documents` : ``
                    //    }</span><p>`;

                    if (row.TaskNo == 1 && row.ActualTime != null) {
                        TaskNo = '';
                    }
                    else {
                        TaskNo = `<strong class="text-primary" > Task ${row.TaskNo}</strong>`;
                    }


                    //askNo = `<strong class="text-primary">Task 1</strong>`;

                    return `<p class='text-two-p'>${TaskNo}<span class="d-block">${row.TaskNo == `1` && row.ActualTime == null ? `Share Documents` : `All Tasks Completed`
                        }</span><p>`;
                }

            case "checkbox":
                if (grid_id == 'POShortCloseGried') {
                    const row = params.data;
                    var strReturn = `
                            <input type="checkbox"  class="checkbox row-checkbox grid-singleinput" data-field="${col.Field}" data-id="${row.PODetId}" style='display: block !important;'  />

                        `;
                    return strReturn;
                }
                else if (grid_id == 'IndentShortCloseGried') {
                    const row = params.data;
                    var strReturn = `
                            <input type="checkbox"  class="checkbox row-checkbox grid-singleinput" data-field="${col.Field}" data-id="${row.IndentDetId}" style="display: block !important;">
                        `;
                    return strReturn;
                }
                else if (grid_id == 'POReturnGried') {
                    const row = params.data;
                    const checked = selectedRowIds.includes(row.ID) ? 'checked' : '';
                    var strReturn = `
                        <input type="checkbox" class="checkbox row-checkbox grid-singleinput" id="chk_${row.ID}_${row.DocType}" ${checked}   style="display:block !important;">
                        
                    `;
                    return strReturn;
                }

            case "textbox":
                if (grid_id == 'POShortCloseGried') {
                    var strReturn = `
                         <input type="text" class="form-control form-control-sm row-textbox po-shortclose-input"
                            data-field="${col.Field}"
                            data-id="shortCloseQty_${data.PODetId}"
                            value="${data[col.Field] ?? ''}" disabled/>
                        `;
                    return strReturn;
                }
                else if (grid_id == 'IndentShortCloseGried') {
                    var strReturn = `
                         <input type="text" class="form-control form-control-sm row-textbox indent-shortclose-input"
                            data-field="${col.Field}"
                            data-id="shortCloseQty_${data.IndentDetId}"
                            value="${data[col.Field] ?? ''}" disabled/>
                        `;
                    return strReturn;
                }
             
            default:
                return data[col.Field];
        }
    };
}

function actionRenderer(params) {
    const container = document.createElement('div');
    container.classList.add('dropdown');

    const toggle = document.createElement('span');
    toggle.classList.add('dropdown-toggle', 'arrow-none');
    toggle.setAttribute('data-toggle', 'dropdown');
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.style.cursor = 'pointer';

    const icon = document.createElement('img');
    icon.src = '../assets/images/icons/help/more-icon.png';
    icon.classList.add('icon-md');

    toggle.appendChild(icon);
    container.appendChild(toggle);

    const menu = document.createElement('div');
    menu.classList.add('dropdown-menu', 'actionmenu');

    // Create menu items
    const viewItem = document.createElement('a');
    viewItem.classList.add('dropdown-item');
    viewItem.href = '#';
    viewItem.textContent = 'View Details';

    const editItem = document.createElement('a');
    editItem.classList.add('dropdown-item');
    editItem.href = '#';
    editItem.textContent = 'Edit';

    const deleteItem = document.createElement('a');
    deleteItem.classList.add('dropdown-item');
    deleteItem.href = '#';
    deleteItem.textContent = 'Delete';
    deleteItem.addEventListener('click', function (e) {
        e.preventDefault();
        $('#deletepopup').modal('show');
    });

    const poItem = document.createElement('a');
    poItem.classList.add('dropdown-item');
    poItem.href = '#';
    poItem.textContent = 'Create Purchase Order';

    // Append items
    menu.appendChild(viewItem);
    menu.appendChild(editItem);
    menu.appendChild(deleteItem);
    menu.appendChild(poItem);

    container.appendChild(menu);

    setTimeout(() => {
        $(toggle).dropdown();
    }, 0);

    return container;
}



var grid_id = '';

const gridIds = new Set(['IndentIndex', 'O2DPLGried', 'FinancialLedger', 'TaskMaster', 'BusinessPartner_GRNGrid', 'BusinessPartner_PoGrid', 'Business_VendorItems', 'DebitNoteReport', 'CancelledTask', 'FMS', 'PendingTask', 'InactiveTaskMaster', 'POReturnApproval', 'Branch', 'POIndexGried']);

const boGridIds = new Set(['POShortCloseGried', 'IndentShortCloseGried', 'SaleOrderGried', 'SaleOrderFMSGried', 'SampleIndex', 'TechnicalDocMasterGried', 'TechnicalDocGried', 'PCTicket', 'UserHelpTicket', 'MyHelpTicket', 'Employee', 'IndentList', 'TechnicalHelpTicket', 'Vendor', 'Role', 'Attendance', 'Holiday', 'StockTransferGried', 'IndentApprovalGried', 'POApprovalGried', 'GateEntryGried']);
let globalGridOptions = null;
function bindAgGrid(containerId, type, columnMeta, rowData) {
    
    $("#customLoader").show();
   

    grid_id = type;

    const columnDefs = buildColumnDefs(columnMeta);



    const gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        pagination: true,
        paginationPageSize: grid_id == 'StockLedger' ? rowData.length : 10,
        enableSorting: true,
        enableFilter: true,
        enableRangeSelection: true,
        enableCellTextSelection: true,
        suppressClipboardPaste: true,
        enableRowGroup: true, // Allow grouping
        enablePivot: true,    // Allow pivoting
        rowGroupPanelShow: 'always', // 👈 Enable drag to group panel
        // dropdown closes class
        onFirstDataRendered: debounceUpdateDropdownSpans,
        onBodyScroll: updateDropdownSpans, // scrolling is okay to do immediately
        onViewportChanged: debounceUpdateDropdownSpans,
        // onModelUpdated: debounceUpdateDropdownSpans,

        rowSelection: 'multiple',  // enable checkboxes

        onModelUpdated: function (params)
        {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(updateDropdownSpans, 50);
           
            if (params.api.getDisplayedRowCount() >= 0) {
                $("#customLoader").hide();
            }
        },      

        sideBar: {
            toolPanels: ['columns'],
            defaultToolPanel: 'columns'
        },
        suppressMovableColumns: false, // Disable drag-move for all columns

        icons: {
            previous: '<i class="fa fa-angle-left"></i>',
            next: '<i class="fa fa-angle-right"></i>',
            first: '<i class="fa fa-angle-double-left"></i>',
            last: '<i class="fa fa-angle-double-right"></i>'
        },



        overlayNoRowsTemplate: '<span style="padding: 10px; display: block; text-align: center;">No data found</span>',
        onFilterChanged: function () {
            const rowCount = gridOptions.api.getDisplayedRowCount();

            let filteredData = [];

            gridOptions.api.forEachNodeAfterFilter(node => {
                filteredData.push(node.data);
            });

            if (grid_id.toLowerCase().includes('pc')) {
                tblData = filteredData;


                const { pendingCount, delayedCount } = calculateTaskCounts(tblData, $('#ddlFMS').val());

                // Update UI
                document.getElementById('pendingTasksCount').textContent = pendingCount;
                document.getElementById('delayedTasksCount').textContent = delayedCount;
            }

            console.log('Filtered Data:', filteredData);
            console.log('Count:', filteredData.length);

            if (rowCount === 0) {
                gridOptions.api.showNoRowsOverlay();
            } else {
                gridOptions.api.hideOverlay();
            }
        },
       
        onGridReady: function (params) {
            if (gridIds.has(grid_id) || boGridIds.has(grid_id)) {
                params.api.sizeColumnsToFit();
            }

            if (gridIds.has(grid_id) || boGridIds.has(grid_id)) {
                setTimeout(() => {
                    params.api.sizeColumnsToFit(); // 👈 Ensure fit even when no data
                }, 100);

            }
            

            const pagingPanel = document.querySelector('.ag-paging-panel');
            const existingChildren = Array.from(pagingPanel.children);

            const pageSizeSelector = document.createElement('div');
            pageSizeSelector.className = 'ag-page-size';
            pageSizeSelector.innerHTML = `
                Rows per page:
                <select id="ag-page-size">
                  <option value="10" selected>10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
            `;

            const paginationControls = existingChildren.find(child =>
                child.querySelector('.ag-paging-button')
            );

            const pagingSummary = existingChildren.find(child =>
                child.classList.contains('ag-paging-row-summary-panel')
            );

            const goToControls = document.createElement('div');
            goToControls.className = 'ag-page-goto';
            goToControls.innerHTML = `
                Go to page:
                <input type="number" id="ag-goto-page" min="1" />
                <button id="ag-goto-btn">Go</button>
            `;

            pagingPanel.innerHTML = '';
            pagingPanel.appendChild(pageSizeSelector);
            if (paginationControls) pagingPanel.appendChild(paginationControls);
            if (pagingSummary) pagingPanel.appendChild(pagingSummary);
            pagingPanel.appendChild(goToControls);

            document.getElementById('ag-page-size').addEventListener('change', function () {
                gridOptions.api.paginationSetPageSize(Number(this.value));
            });

            document.getElementById('ag-goto-btn').addEventListener('click', function () {
                const input = document.getElementById('ag-goto-page');
                const page = Number(input.value) - 1;
                const totalPages = gridOptions.api.paginationGetTotalPages();
                if (!isNaN(page) && page >= 0 && page < totalPages) {
                    gridOptions.api.paginationGoToPage(page);
                } else {
                    FailToaster(`Enter valid page number (1 - ${totalPages})`);
                    $('#alertModal').modal('show');
                }
            });

            document.getElementById('ag-goto-page').addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    document.getElementById('ag-goto-btn').click();
                }
            });
        }
    };

    new agGrid.Grid(document.querySelector(containerId), gridOptions);
    globalGridOptions = gridOptions;
    return gridOptions;
}



function calculateTaskCounts(tblData, Type) {
    let pendingCount = 0;
    let delayedCount = 0;

    const typeNum = Number(Type);

    tblData.forEach(row => {
        const taskNo = parseInt(row.TaskNo);
        const actualTime = row.ActualTime;

        const delayRaw = typeNum === 2 ? (row.DelayHours || '').trim() : typeNum === 6 ? (row.DelayDays || '').trim() : (row.Delay || '').trim();
        const delayValue = delayRaw ? parseFloat(delayRaw) : 0;

        // Debugging output
        console.log(`TaskNo: ${taskNo}, ActualTime: ${actualTime}, DelayValue: ${delayValue}, Type: ${typeNum}`);

        var final_step = 0;

        if (Type == 1) {
            final_step = 7;
        }
        else if (Type == 2) {
            final_step = 3;
        }
        else if (Type == 3) {
            final_step = 4;
        }
        else if (Type == 4) {
            final_step = 5;
        }
        else if (Type == 5) {
            final_step = 1;
        }
        else if (Type == 6) {
            final_step = 9;
        }
        else if (Type == 7) {
            final_step = 3;
        }

        const isPending = row.TaskNoInWords != 'All Tasks Completed';
        if (isPending) pendingCount++;

        if (!isNaN(delayValue) && delayValue > 0) delayedCount++;
    });

    return { pendingCount, delayedCount };
}


document.getElementById("exportExcel").addEventListener("click", () => {

    switch (grid_id) {

        case "IndentIndex":
            gridOptions.api.exportDataAsCsv({ fileName: "IndentIndex.csv" });
            break;
        case "StockLedger":
            gridOptions.api.exportDataAsCsv({ fileName: "StockLedger.csv" });
            break;
        case "StockReport":
            gridOptions.api.exportDataAsCsv({ fileName: "StockReport.csv" });
            break;
        case "SampleIndex":
            gridOptions.api.exportDataAsCsv({ fileName: "SampleReport.csv" });
            break;
        case "DispatchStatus":
            gridOptions.api.exportDataAsCsv({ fileName: "Dispatched Samples.csv" });
            break;
        case "SampleFMS":
            gridOptions.api.exportDataAsCsv({ fileName: "SampleFMS.csv" });
            break;
        case "QCFMS":
            gridOptions.api.exportDataAsCsv({ fileName: "QCFMS.csv" });
            break;
        case "QCFMS_Completed":
            gridOptions.api.exportDataAsCsv({ fileName: "QCFMS_Completed.csv" });
            break;
        case "FMS":
            gridOptions.api.exportDataAsCsv({ fileName: "FMS_Controller.csv" });
            break;
        case "UserList":
            gridOptions.api.exportDataAsCsv({ fileName: "UserList_Data.csv" });
            break;
        case "Role":
            gridOptions.api.exportDataAsCsv({ fileName: "RoleMaster_Data.csv" });
            break;
        case "Employee":
            gridOptions.api.exportDataAsCsv({ fileName: "Employee_Data.csv" });
            break;
        case "TaskMaster":
            gridOptions.api.exportDataAsCsv({ fileName: "TaskMaster_Data.csv" });
            break;
        case "InactiveTaskMaster":
            gridOptions.api.exportDataAsCsv({ fileName: "InactiveTaskMaster_Data.csv" });
            break;
        case "Branch":
            gridOptions.api.exportDataAsCsv({ fileName: "Branch_Data.csv" });
            break;
        case "Holiday":
            gridOptions.api.exportDataAsCsv({ fileName: "Holiday_Data.csv" });
            break;
        case "Attendance":
            gridOptions.api.exportDataAsCsv({ fileName: "Attendance_Data.csv" });
            break;
        case "PendingTask":
            gridOptions.api.exportDataAsCsv({ fileName: "PC_Pending_Task_Data.csv" });
            break;
        case "PendingForAuditTask":
            gridOptions.api.exportDataAsCsv({ fileName: "PC_Pending_For_Audit_Data.csv" });
            break;
        case "CompletedTask":
            gridOptions.api.exportDataAsCsv({ fileName: "PC_Completed_Data.csv" });
            break;
        case "CancelledTask":
            gridOptions.api.exportDataAsCsv({ fileName: "PC_CancelledTask_Data.csv" });
            break;
        case "MyHelpTicket":
            gridOptions.api.exportDataAsCsv({ fileName: "MyHelpTicket_Data.csv" });
            break;
        case "UserHelpTicket":
            gridOptions.api.exportDataAsCsv({ fileName: "UserHelpTicket_Data.csv" });
            break;
        case "TechnicalHelpTicket":
            gridOptions.api.exportDataAsCsv({ fileName: "TechnicalHelpTicket_Data.csv" });
            break;
        case "PCTicket":
            gridOptions.api.exportDataAsCsv({ fileName: "PCTicketHelpTicket_Data.csv" });
            break;
        case "IndentApprovalGried":
            gridOptions.api.exportDataAsCsv({ fileName: "IndentApproval_Data.csv" });
            break;
        case "BOM":
            gridOptions.api.exportDataAsCsv({ fileName: "BOM_Data.csv" });
            break;
        case "ManualStockAdjGried":
            gridOptions.api.exportDataAsCsv({ fileName: "ManualStockAdj_Data.csv" });
            break;
        case "StockTransferGried":
            gridOptions.api.exportDataAsCsv({ fileName: "StockTransfer_Data.csv" });
            break;
        case "POApprovalGried":
            gridOptions.api.exportDataAsCsv({ fileName: "POApproval_Data.csv" });
            break;
        case "GateEntryGried":
            gridOptions.api.exportDataAsCsv({ fileName: "GateEntry_Data.csv" });
            break;
        case "GRNReport":
            gridOptions.api.exportDataAsCsv({ fileName: "GRNReport_Data.csv" });
            break;
        case "GRNApproval":
            gridOptions.api.exportDataAsCsv({ fileName: "GRNApprovalReport_Data.csv" });
            break;
        case "DebitNoteReport":
            gridOptions.api.exportDataAsCsv({ fileName: "DebitNoteReport_Data.csv" });
            break;
        case "POReturnApproval":
            gridOptions.api.exportDataAsCsv({ fileName: "POReturnApproval_Data.csv" });
            break;
        case "VendorGried":
            gridOptions.api.exportDataAsCsv({ fileName: "Vendor_Data.csv" });
            break;
        case "CustomerGried":
            gridOptions.api.exportDataAsCsv({ fileName: "Customer_Data.csv" });
            break;
        case "Business_VendorItems":
            gridOptions.api.exportDataAsCsv({ fileName: "Business_VendorItems_Data.csv" });
            break;
        case "BusinessPartner_PoGrid":
            gridOptions.api.exportDataAsCsv({ fileName: "BusinessPartner_Po_Data.csv" });
            break;
        case "BusinessPartner_GRNGrid":
            gridOptions.api.exportDataAsCsv({ fileName: "BusinessPartner_GRN_Data.csv" });
            break;
        case "FinancialLedger":
            gridOptions.api.exportDataAsCsv({ fileName: "FinancialLedger_Data.csv" });
            break;
        case "SaleOrderGried":
            gridOptions.api.exportDataAsCsv({ fileName: "SaleOrder_Data.csv" });
            break;
        case "TechnicalDocGried":
            gridOptions.api.exportDataAsCsv({ fileName: "TechnicalDoc_Data.csv" });
            break;
        case "TechnicalDocMasterGried":
            gridOptions.api.exportDataAsCsv({ fileName: "TechnicalDocMaster_Data.csv" });
            break;
        case "FGBOM":
            gridOptions.api.exportDataAsCsv({ fileName: "FGBOM_Data.csv" });
            break;
        case "POShortCloseGried":
            gridOptions.api.exportDataAsCsv({ fileName: "POShortClose_Data.csv" });
            break;
        case "IndentShortCloseGried":
            gridOptions.api.exportDataAsCsv({ fileName: "IndentShortClose_Data.csv" });
            break;
        case "POReturnGried":
            gridOptions.api.exportDataAsCsv({ fileName: "POReturn_Data.csv" });
            break;
        default:
            gridOptions.api.exportDataAsCsv({ fileName: "ItemMaster.csv" });
            break;

    }
});



//function updateDropdownSpans() {
//    // Add no-ellipsis for dropdowns
//    $('.dropdown').each(function () {
//        var span = $(this).closest('span');
//        if (span.length) span.addClass('no-ellipsis');
//    });

//    // Add w-auto for td-action-btn
//    $('.td-action-btn').each(function () {
//        var span = $(this).closest('span');
//        if (span.length) span.addClass('w-auto');
//    });

//    // Add ellipsis-none for action-btn-td
//    $('.action-btn-td').each(function () {
//        var span = $(this).closest('span');
//        if (span.length) span.addClass('ellipsis-none');
//    });

//    // Add ellipsis-none for checkbox-label
//    $('.checkbox-label').each(function () {
//        var span = $(this).closest('span');
//        if (span.length) span.addClass('ellipsis-none');
//    });
//}


function updateDropdownSpans() {
    // Add no-ellipsis for dropdowns
    $('.dropdown').each(function () {
        var span = $(this).closest('span');
        if (span.length) span.addClass('no-ellipsis');
    });

    // Add w-auto for td-action-btn
    $('.td-action-btn').each(function () {
        var span = $(this).closest('span');
        if (span.length) span.addClass('w-auto');
    });

    // Add ellipsis-none for action-btn-td
    $('.action-btn-td').each(function () {
        var span = $(this).closest('span');
        if (span.length) span.addClass('ellipsis-none');
    });

    // Add ellipsis-none for checkbox-label
    $('.checkbox-label').each(function () {
        var span = $(this).closest('span');
        if (span.length) span.addClass('ellipsis-none');
    });

    // ✅ Reinitialize Bootstrap dropdown toggle behavior
    $('.dropdown-toggle').dropdown();  // This ensures dropdown toggles open properly
}

let debounceTimeout;
function debounceUpdateDropdownSpans() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(updateDropdownSpans, 50);
}

const globalSearchBox = document.getElementById('globalSearch');
globalSearchBox.addEventListener('input', function () {
    gridOptions.api.setQuickFilter(this.value);
});

function waitForGridToRender() {
    var interval = setInterval(function () {
        var rowCount = gridOptions.api.getDisplayedRowCount();
        var renderedRows = gridOptions.api.getRenderedNodes().length;

        console.log("Displayed rows:", rowCount, "Rendered rows:", renderedRows);

        if (renderedRows >= rowCount) {
            // All rows are visible, hide loader
            $("#customLoader").hide();
            clearInterval(interval);
        }
    }, 100); // check every 100ms
}
