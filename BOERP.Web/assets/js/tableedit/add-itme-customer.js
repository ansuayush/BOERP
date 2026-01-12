// Function to add a new item
function additem() {
    const container = document.getElementById('add-item-customer');
    const itemId = 'item-' + Date.now(); // Unique ID for each item

    // Close all other open items
    $('.collapse.show').collapse('hide');

    // Create a new card
    const card = document.createElement('div');
    card.className = 'card p-0 mb-3';
    card.innerHTML = `
        <div class="card-header d-flex justify-content-between cursor-pointer bg-secondary br-tr" data-toggle="collapse" data-target="#${itemId}" aria-expanded="true">
            <h2 class="title-two align-self-center white-clr mb-0 ">Item </h2>
            <div class="align-self-center cursor-pointer" >
                <img src="../assets/images/icons/help/delete-white-copy.png" onclick="closeitm(this, '${itemId}');" data-toggle="tooltip" title="Remove" alt="Close" class="add-row-icon"> <img src="../assets/images/icons/help/bottom-arrow-white.png" alt="arrow" class="add-row-icon collapse-arrow">
            </div>
        </div>
        <div id="${itemId}" class="collapse show card-body view-form-group" aria-expanded="true">
            <div class="row">
                <div class="col-sm-3 form-group">
                    <label>Item Name<sup>*</sup></label>
                    <input type="text" class="form-control" placeholder="Enter">
                </div>
                <div class="col-sm-3 form-group">
                    <label>Category<sup>*</sup></label>
                    <select class="form-control applyselect">
                        <option value="">Select</option>
                        <option value="Body Butter">Body Butter</option>
                    </select>
                </div>
                <div class="col-sm-3 form-group">
                    <label>Fragrance<sup>*</sup></label>
                    <input type="text" class="form-control" placeholder="Enter">
                </div>
                <div class="col-sm-3 form-group">
                    <label>NBD/CRR<sup>*</sup></label>
                    <select class="form-control applyselect">
                        <option value="">Select</option>
                        <option value="NBD">NBD</option>
                    </select>
                </div>
                <div class="col-sm-3 form-group">
                    <label>Colour<sup>*</sup></label>
                    <input type="text" class="form-control" placeholder="Enter">
                </div>
                <div class="col-sm-3 form-group">
                    <label>Packaging Type<sup>*</sup></label>
                    <select class="form-control applyselect">
                        <option value="">Select</option>
                        <option value="Bottle-SCREW CAP">Bottle-SCREW CAP</option>
                    </select>
                </div>
                <div class="col-sm-3 form-group">
                    <label>Target Price/kg<sup>*</sup></label>
                    <input type="text" class="form-control" placeholder="0">
                </div>
                <div class="col-sm-6 form-group align-self-end">
                    <label>Mention Exact Requirements<sup>*</sup></label>
                    <input type="text" class="form-control" placeholder="Enter">
                </div>
                <div class="col-sm-3 form-group align-self-end">                                             
                    <input type="text" class="form-control" placeholder="Enter must-have ingredients">
                </div>
                <div class="col-sm-3 form-group align-self-end">                                             
                    <input type="text" class="form-control" placeholder="Enter must-have ingredients">
                </div>
            </div>
        </div>
    `;

    // Prepend the new card to the top of the container
    container.prepend(card);

    // Reinitialize tooltips for dynamically added elements
    $('[data-toggle="tooltip"]').tooltip();

    // Reinitialize Select2 for newly added elements
    $(card).find(".applyselect").select2();
}

// Function to remove a specific item and properly dispose of tooltip
function closeitm(element, itemId) {
    // Dispose of Bootstrap tooltip before removing the element
    $(element).tooltip('hide').tooltip('dispose');

    // Remove the card
    const card = document.getElementById(itemId).closest('.card');
    if (card) {
        card.remove();
    }
}