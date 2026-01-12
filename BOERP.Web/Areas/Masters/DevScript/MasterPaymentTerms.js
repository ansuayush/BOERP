function BuildManagePaymentTermsList(data) {
	$("#liManagePaymentTermsList").empty(); // Clear existing items
	if (data.length > 0) {
		data.forEach((item) => {
			const listItem = `
				<li class="item">
				<a href="#" id="btnManagePaymentTerms" onclick="SingleManage(this)" ><span class="title-one">${item.FIELD_NAME}</span></a>
				</li>`;
			$("#liManagePaymentTermsList").append(listItem);
		});
	}
}

