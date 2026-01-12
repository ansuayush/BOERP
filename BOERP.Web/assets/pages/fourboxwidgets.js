// Define the custom component
class FourboxWidgets extends HTMLElement {
    connectedCallback() {
        // Add content to the custom element
        this.innerHTML = `
                <div class="d-flex  gap-10 d-mb box-list">
                    <div class="box d-flex  gap-10 box-shadow">
                        <div class="box-img">
                            <img src="~/../../../assets/images/icons/components-icon/stock-value-icon.png" alt="Stock Value" class="img-fluid">
                        </div>

                        <div class="box-titles">
                            Stock Value
                            <span class="box-subtitles highlight">RM over 60 days</span>
                        </div>
                        <div class="box-number">
                           ₹ 0
                        </div>
                        
                    </div>
                    <div class="box d-flex  gap-10 box-shadow">
                        <div class="box-img">
                            <img src="~/../../../assets/images/icons/components-icon/stock-value-icon.png" alt="Stock Value" class="img-fluid">
                        </div>

                        <div class="box-titles">
                            Stock Value
                            <span class="box-subtitles highlight">PM over 60 days</span>
                        </div>
                        <div class="box-number">
                           ₹ 0
                        </div>
                        
                    </div>

                    <div class="box d-flex  gap-10 box-shadow">
                        <div class="box-img">
                            <img src="~/../../../assets/images/icons/components-icon/record-item.png" alt="Items Below Reorder Level
" class="img-fluid">
                        </div>

                        <div class="box-titles">
                            Items Below<br />Reorder Level
                            
                        </div>
                        <div class="box-number">
                            0
                        </div>
                        
                    </div>

                    <div class="box d-flex  gap-10 box-shadow">
                        <div class="box-img">
                            <img src="~/../../../assets/images/icons/components-icon/out-of-stock.png" alt="Items Out of Stock" class="img-fluid">
                        </div>

                        <div class="box-titles">
                            Items Out <br/>of Stock
                        </div>
                        <div class="box-number">
                            0
                        </div>
                        
                    </div>

                    

                </div>
            `;
    }
}

// Register the component
customElements.define("fourbox-widgets", FourboxWidgets);