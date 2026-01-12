

function BindEdit(obj) {
	var I = $(obj).closest("tr").find("input:hidden[name=I]").val();
	var N = $(obj).closest("tr").find("input:hidden[name=N]").val();
    ListAdd(I,N);
}

function BindPrint(obj) {
	var P = $(obj).closest("tr").find("input:hidden[name=P]").val();	
	ListPrint(P);
}

function BindIsActive(obj) {
    var I = $(obj).closest("tr").find("input:hidden[name=I]").val();
    var N = $(obj).closest("tr").find("input:hidden[name=N]").val();
    var Val = $(obj).attr('OP');
    var list = $(obj).attr('list');
    var Msg = '';
    
    if (Val == 1) {
        Msg = 'Are you sure want to Activate ' + N;
    }
    if (Val == 0) {
        Msg = 'Are you sure want to Deactivate ' + N;
    }
    ConfirmMsgBox(Msg, '', function () {
        $.ajax({
            url: "/CommonAjax/ActiveDeactiveJson",
            type: "Post",
            async: true,
            data: { Type: list, ID: I, Value: Val, ColomanName: "IsActive" },
            success: function (args) {
                var arr = args.split('::');
                if (arr[0] != '-1') {
                    if (parseInt(arr[1]) == 0) {
                        $(obj).find('i').attr("class", "fa fa-times-circle crossred");
                        $(obj).attr("OP", "1");
                        $(obj).attr("data-original-title", "Click to Activate");
                        $(obj).addClass("trrowred");
                    }
                    else {
                        $(obj).find('i').attr("class", "fa fa-check-circle checkgreen");
                        $(obj).attr("OP", "0");
                        $(obj).attr("data-original-title", "Click to DeActivate");
                        $(obj).removeClass("trrowred");
                    }
                }
            },
            error: function (er) {
                console.log(er);
            }
        });
    })

}


function BindPriority(obj) {
    var I = $(obj).closest("tr").find("input:hidden[name=I]").val();
    var list = $(obj).attr('list');
    var Val = Number($(obj).val());
    $.ajax({
        url: "/CommonAjax/UpdateColomnJSon",
        type: "Post",
        async: true,
        data: { ID: I, Value: Val, Type: list },
        success: function (data) {
            if (data.Status) {
                $(obj).css('border', '2px solid Green');
                SuccessToaster(data.SuccessMessage);
                
            }
            else {

                $(obj).css('border', '2px solid red');
                FailToaster(data.SuccessMessage);
            }
        },
        error: function (er) {
            console.log(er);
        }
    });
}
