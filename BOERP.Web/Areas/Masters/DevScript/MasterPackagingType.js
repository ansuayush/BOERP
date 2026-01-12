function BuildPackagingTypeList(data) {
	$("#liManagePackagingTypeList").empty(); // Clear existing items
	if (data.length > 0) {
		data.forEach((item) => {
			const listItem = `
				<li class="item">
				<a href="#" id="btnManagePackagingType" onclick="SingleManage(this)" ><span class="title-one">${item.FIELD_NAME}</span></a>
				</li>`;
			$("#liManagePackagingTypeList").append(listItem);
		});
	}
}