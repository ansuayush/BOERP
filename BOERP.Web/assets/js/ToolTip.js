$('[data-toggle="tooltip"]').tooltip();

$("[data-toggle=popover]").popover({
    html: true,
    trigger: 'hover',
    content: function () {
        var content = $(this).attr("data-popover-content");
        return $(content).children(".popover-body").html();
    }
});