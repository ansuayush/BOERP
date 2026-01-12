
function BuildTerritoryList(data) {
	$("#liManageTerritoryList").empty(); // Clear existing items
	if (data.length > 0) {
		data.forEach((item) => {
			const listItem = `
		<li class="item">
		<a href="#" id="btnManageTerritoryType" onclick="SingleManage(this)" ><span class="title-one">${item.FIELD_NAME}</span></a>
		</li>`;
			$("#liManageTerritoryList").append(listItem);
		});
	}
}
