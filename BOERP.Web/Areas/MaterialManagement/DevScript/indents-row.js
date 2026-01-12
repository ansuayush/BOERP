$(document).ready(function () {
    $("#addrow").click(function () {
        var RowId = $("#datatableIndent tbody tr").length + 1;
        let newRow = `
            <tr>
                <td>
                    <div class="deleterow text-center cursor-pointer">
                        <img src="../../assets/images/icons/help/close.svg" alt="" data-toggle="tooltip" title="Remove" />
                        <input type="hidden" id="hdnIndentDetailId_${RowId}" />
                    </div>
                </td>
                <td>
                    <div class="autocomplete-wrapper" style="position: relative;">
                        <label for="ddlI_${RowId}" class="search-label">
                            <img src="../../../assets/images/icons/help/search-icon.png" class="icon-sm" />
                        </label>                                  
                        <input type="text" class="form-control searchlist Mandate" id="ddlI_${RowId}" oninput="Getdata(this)" onclick="Getdata(this)"  placeholder="Type item..." autocomplete="off" />
                        <span id="spddlI_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                        <ul id="globalSuggestionBox_${RowId}" class="suggestions"></ul>
                       <input type="hidden" id="ddlItem_${RowId}" />

                    </div>
                </td>
                <td><label class="lblItemName" id="lblItemName_${RowId}"></label></td>
                <td><label class="lblItemDesc" id="lblItemDesc_${RowId}"></label></td>
                <td>
                    <input type="number" step="0.01"  id="txtQuantity_${RowId}" class="form-control text-right MandateWithoutZero" placeholder="0" onchange="HideErrorMessage(this);" oninput="SetZero(this)">
                    <span id="sptxtQuantity_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                </td>
                <td class="text-center"><label class="lblItemUnit" id="lblUnit_${RowId}"></label></td>
                
                <td>
                <div class="input-group">
                    <input type="text" id="txtExpectedDate_${RowId}" class="datepicker form-control" placeholder="DD/MM/YYYY" readonly onchange="HideErrorMessage(this)">
                    <span class="clear-date">×</span>
                    <div class="input-group-append">
                        <span class="input-group-text bg-white"><img src="../../assets/images/icons/help/calendar-icon.svg" alt=""></span>
                    </div>
                    <span id="sptxtExpectedDate_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey, You missed this field!!</span>
                    <span id="spValidationtxtExpectedDate_${RowId}" class="text-danger field-validation-error" style="display:none;">Hey,Required by should be greater or equal to current date!</span>
                </div>
              </td>

                <td><textarea id="txtRemark_${RowId}" placeholder="Enter Text" class="form-control"></textarea></td>
            </tr>`;

        // Append new row
        $(".itemsinformation tbody").append(newRow);

        // Re-initialize select2 for newly added element
        $(".itemsinformation tbody tr:last .applyselect").select2();

        // Re-initialize tooltip for newly added elements
        $(".itemsinformation tbody tr:last [data-toggle='tooltip']").tooltip();
        datechange();
        var inputElement = $('#ddlI_' + RowId);
        Getdata(inputElement);
    });
    function datechange() {
        $('.datepicker').daterangepicker({
            opens: 'right',
            singleDatePicker: true,
            showDropdowns: true,
            autoApply: true,
            autoUpdateInput: false,
            parentEl: 'body', // Ensures it is not constrained in table
            locale: {
                format: 'DD/MM/YYYY'
            }
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
            $(this).closest(".input-group").find(".clear-date").show();
        });

        // Open datepicker when clicking the icon
        $('.input-group-text').on('click', function () {
            $(this).closest('.input-group').find('.datepicker').focus();
        });

        // Click on × to clear date
        $(document).on("click", ".clear-date", function () {
            let input = $(this).closest(".input-group").find(".datepicker");
            input.val("");
            $(this).hide();
        });
    }
    function datechange() {
        const Z = 9999999;

        // (Re)initialize safely
        $('.datepicker').each(function () {
            const $inp = $(this);
            if ($inp.data('drp-inited')) return; // prevent double init

            $inp.daterangepicker({
                opens: 'right',
                singleDatePicker: true,
                showDropdowns: true,
                autoApply: true,
                autoUpdateInput: false,
                parentEl: 'body',
                locale: { format: 'DD/MM/YYYY' }
            })
                .on('apply.daterangepicker', function (ev, picker) {
                    $inp.val(picker.startDate.format('DD/MM/YYYY'));
                    $inp.closest('.input-group').find('.clear-date').show();
                })
                .on('show.daterangepicker', function (ev, picker) {
                    const $cal = picker.container;

                    function place() {
                        // fixed to viewport
                        $cal.css({ top: '', left: '', right: '', bottom: '', position: 'fixed' });

                        const rect = $inp[0].getBoundingClientRect();
                        const winW = window.innerWidth;
                        const winH = window.innerHeight;

                        const popupW = $cal.outerWidth();
                        const popupH = $cal.outerHeight();

                        // prefer below, else above (viewport coords)
                        let top = rect.bottom + 6;
                        if (rect.bottom + popupH > winH) {
                            top = rect.top - popupH - 6;
                        }

                        // left aligned to input, clamped
                        let left = rect.left;
                        const vpLeft = 8, vpRight = winW - 8;
                        if (left + popupW > vpRight) left = Math.max(vpLeft, vpRight - popupW);
                        if (left < vpLeft) left = vpLeft;

                        // clamp vertical just in case
                        const vpTop = 8, vpBot = winH - 8;
                        if (top + popupH > vpBot) top = Math.max(vpTop, vpBot - popupH);
                        if (top < vpTop) top = vpTop;

                        $cal.css({ top, left, zIndex: Z });
                    }

                    const placeRAF = () => requestAnimationFrame(place);

                    // initial after paint
                    placeRAF();

                    // keep stuck on viewport resize
                    $(window).on('resize.drp', placeRAF);

                    // Re-place on any calendar redraws (prev/next, month/year change, etc.)
                    $inp.on('showCalendar.daterangepicker.drpfix', placeRAF);
                    $cal.on('click.drpfix', '.prev, .next', placeRAF);
                    $cal.on('change.drpfix', 'select.monthselect, select.yearselect', placeRAF);

                    // Observe size changes of the popup (row count can change)
                    let ro = null, mo = null;
                    if ('ResizeObserver' in window) {
                        ro = new ResizeObserver(placeRAF);
                        ro.observe($cal[0]);
                    } else if ('MutationObserver' in window) {
                        mo = new MutationObserver(placeRAF);
                        mo.observe($cal[0], { childList: true, subtree: true, attributes: true });
                    }

                    // clean up when hidden
                    $inp.one('hide.daterangepicker', function () {
                        $(window).off('resize.drp', placeRAF);
                        $inp.off('showCalendar.daterangepicker.drpfix');
                        $cal.off('.drpfix');
                        if (ro) { try { ro.disconnect(); } catch (e) { } }
                        if (mo) { try { mo.disconnect(); } catch (e) { } }
                    });
                });

            $inp.data('drp-inited', true);
        });

        // calendar icon click
        $(document)
            .off('click.drp', '.input-group-text')
            .on('click.drp', '.input-group-text', function () {
                $(this).closest('.input-group').find('.datepicker').focus();
            });

        // clear (×) button
        $(document)
            .off('click.drp', '.clear-date')
            .on('click.drp', '.clear-date', function () {
                const $input = $(this).closest('.input-group').find('.datepicker');
                $input.val('');
                $(this).hide();
            });

        // ensure popup always above everything
        if (!document.getElementById('drp-zfix')) {
            $('<style id="drp-zfix">.daterangepicker{z-index:9999999!important}</style>').appendTo(document.head);
        }
    };

    document.addEventListener("click", function (event) {
        if (!event.target.classList.contains("searchlist")) {
            document.querySelectorAll(".suggestions").forEach(box => box.style.display = "none");
        }
    });

    $(document).on("click", ".deleterow", function () {
        $(this).closest("tr").remove();
    });

    // Click on × to clear date
    $(document).on("click", ".clear-date", function () {
        let input = $(this).closest(".input-group").find(".datepicker");
        input.val("");
        $(this).hide();
    });

    // Hide datepicker when scrolling with mouse wheel
    $(window).on("wheel", function () {
        $(".daterangepicker").hide();
    });

    // Also hide on touchpad scroll or scrollbar scroll
    $(window).on("scroll", function () {
        $(".daterangepicker").hide();
    });
});




