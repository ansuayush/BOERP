// Define the custom component
class boxoneWidgets extends HTMLElement {
    connectedCallback() {
        // Add content to the custom element
        this.innerHTML = `
                 <div class="d-flex box-one  gap-10 d-mb">
                  <div class="box-none w-100 align-self-center">
                     <p class="m-0 title-22">Manish Singh</p>
                     <small class="">BOINTL229</small>
                     <p class="text-16 m-0">SEO Executive</p>
                  </div>
                  <div class="box d-flex  gap-10 box-shadow">
                     <div class="box-img">
                         <img src="~assets/images/icons/components-icon/totalTask-icon.svg" alt="Stock Value" class="img-fluid">
                     </div>

                     <div class="box-titles">
                        Total Task
                     </div>
                     <div class="box-number">
                         1056
                     </div>
                     
                  </div>

                  <div class="box d-flex  gap-10 box-shadow">
                     <div class="box-img">
                         <img src="assets/images/icons/components-icon/newlyAssigned-icon.svg" alt="Stock Value" class="img-fluid">
                     </div>

                     <div class="box-titles">
                        Newly Assigned


                     </div>
                     <div class="box-number">
                         1056
                     </div>
                     
                  </div>

                  <div class="box d-flex  gap-10 box-shadow">
                     <div class="box-img">
                         <img src="assets/images/icons/components-icon/incompleteTask-icon.svg" alt="Stock Value" class="img-fluid">
                     </div>

                     <div class="box-titles">
                        Incomplete Tasks


                        </div>
                     <div class="box-number">
                         1056
                     </div>
                     
                  </div>

                  <div class="box d-flex  gap-10 box-shadow">
                     <div class="box-img">
                         <img src="assets/images/icons/components-icon/delayedTask-icon.svg" alt="Stock Value" class="img-fluid">
                     </div>

                     <div class="box-titles">
                        Delayed Tasks
                     </div>
                     <div class="box-number">
                         1056
                     </div>
                     
                  </div>

                  
               </div>
            `;
    }
}

// Register the component
customElements.define("boxone-widgets", boxoneWidgets);