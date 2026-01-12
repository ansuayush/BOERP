
$(document).ready(function () {
    $(".applyselect").select2();
       
});




$('.listpriority').blur(function () {
    if ($(this).val() == '') { $(this).val('0') }
    var I = $(this).closest("tr").find("input:hidden[name=I]").val();
    var list = $(this).attr('list');
    UpdateColomn(this, I, list);
});
$('.listpriority').focus(function () {
    if ($(this).val() == '0') { $(this).val('') }
});


function UpdateColomn(Obj, ID, Type, Column) {
    var Val = Number($(Obj).val());
    $.ajax({
        url: "/CommonAjax/UpdateColomnJSon",
        type: "Post",
        async: true,
        data: { ID: ID, Value: Val, Type: Type },
        success: function (data) {
            if (data.Status) {
                $(Obj).css('border', '2px solid Green');
                SuccessToaster(data.SuccessMessage);
            }
            else {

                $(Obj).css('border', '2px solid red');
                FailToaster(data.SuccessMessage);
            }
            
        },
        error: function (er) {
            console.log(er);
        }
    });
}

$(".AIsActive").on('click', function (e) {    
    e.preventDefault();
    e.stopPropagation();
    var I = $(this).closest("tr").find("input:hidden[name=I]").val();
    var N = $(this).closest("tr").find("input:hidden[name=N]").val();
    var Val = $(this).attr('OP');
    var list = $(this).attr('list');
    UpdateIsActive(list, I, 'IsActive', Val, N, this);
});

function UpdateIsActive(Type, ID, Column, Val, Name, obj) {
    var Msg = '';
   
    if (Val == 1) {
        var Msg = 'Are you sure want to Activate ' + Name;
    }
    if (Val == 0) {
        var Msg = 'Are you sure want to Deactivate ' + Name;
    }
    ConfirmMsgBox(Msg, '', function () {
        $.ajax({
            url: "/CommonAjax/ActiveDeactiveJson",
            type: "Post",
            async: true,
            data: { Type: Type, ID: ID, Value: Val, ColomanName: Column },
            success: function (args) {
                var arr = args.split('::');
				if (arr[0] != '-1') {
					if (parseInt(arr[1]) == 0) {
						$(obj).find('i').attr("class", "fa fa-times-circle crossred");
						$(obj).attr("OP", "1");
						$(obj).attr("data-original-title", "Click to Activate");
						$(obj).closest("tr").addClass("trrowred");
					}
					else {
						$(obj).find('i').attr("class", "fa fa-check-circle checkgreen");
						$(obj).attr("OP", "0");
						$(obj).attr("data-original-title", "Click to DeActivate");
						$(obj).closest("tr").removeClass("trrowred");
					}
				}
				else {
					FailToaster("Already in use, please make sure of your selection");
				}
            },
            error: function (er) {
                console.log(er);
            }
        });
    })
}



function CheckDuplicateJson(Type, ID, Obj) {
    var Value = $(Obj).val();
    if (Value)
    {
        $.ajax({
            url: "/CommonAjax/fnCheckDuplicate",
            type: "Get",
            async: true,
            data: { sType: Type, lId: ID, sFieldValue: Value },
            success: function (data) {
               
                if (data.Status) {
                    $(Obj).css('border', '2px solid red');
                    $(Obj).val('');
                    FailToaster(data.SuccessMessage);
                }
                else {
                    $(Obj).css('border', '2px solid Green');
                }
            },
            error: function (er) {
                console.log(er);
            }
        });
    }
}