var DialogObj;

function SyncAlert(title, content, alterfunOk) {
    DialogObj = ej.popups.DialogUtility.alert({
        title: title,
        content: content,
        okButton: { text: 'OK', click: alterfunOk.bind(this) },
        showCloseIcon: true,
        closeOnEscape: true,
        animationSettings: { effect: 'Zoom' }
    });
  
}

function SyncConfirmBox(title, content, funOk, funCan) {
    DialogObj = ej.popups.DialogUtility.confirm({
        title: title,
        content: content,
        okButton: { text: 'Yes', click: funOk },
        cancelButton: { text: 'No', click: funCan },
        showCloseIcon: true,
        closeOnEscape: true,
        isDraggable: true,
        animationSettings: { effect: 'Zoom' }
    });
   
}
function SyncCloseDialog() {
    //Hide the dialog
    DialogObj.hide();
}