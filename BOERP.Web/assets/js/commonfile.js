$(document).ready(function () {
    // hide all toggle content initially
    $('.toggle-info-content').hide();

    // Use event delegation and target the header class (robust for dynamic content)
    $(document).on('click', '.toggle-card-header', function (e) {
        // find the corresponding content inside the same .toggle-card container
        var $card = $(this).closest('.toggle-card');
        var $content = $card.find('.toggle-info-content').first();

        $content.slideToggle(300);

        // toggle rotated class on the icon (you'll need CSS for .rotated)
        $(this).find('.toggle-card-icon img').toggleClass('rotated');

        // optional: toggle an "open" class on header for styling
        $(this).toggleClass('open');
    });
});
//  Suggestion dropdown control

const SUG_SEL = 'ul.suggestions';
const WRAP_SEL = '.autocomplete-wrapper';
const INP_SEL = '.searchlist';

function closeAllSuggestions(keep = null) {
    document.querySelectorAll(SUG_SEL).forEach(u => {
        if (u !== keep) {
            u.classList.remove('open');
            u.style.display = 'none';
            // optional: clear if you want them emptied when closed
            // u.innerHTML = '';
        }
    });
}

function getBoxForInput(inp) {
    return inp.closest(WRAP_SEL)?.querySelector(SUG_SEL) || null;
}

function openSuggestionsFor(input) {
    const box = getBoxForInput(input);
    if (!box) return null;
    closeAllSuggestions(box);
    box.style.display = 'block';
    box.classList.add('open');
    return box;
}

// Close on outside click
document.addEventListener('click', e => {
    if (!e.target.closest(WRAP_SEL)) closeAllSuggestions();
});

// Close when focus moves away from any autocomplete wrapper
document.addEventListener('focusin', e => {
    if (e.target.matches(INP_SEL)) {
        openSuggestionsFor(e.target);
    } else if (!e.target.closest(WRAP_SEL)) {
        closeAllSuggestions();
    }
});

// Close on Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllSuggestions();
});

// Optional: close when user scrolls the page/container
document.addEventListener('wheel', e => {
    if (!e.target.closest(SUG_SEL)) closeAllSuggestions();
}, { passive: true });

// Expose (if you want to call from elsewhere)
window.closeAllSuggestions = closeAllSuggestions;
window.openSuggestionsFor = openSuggestionsFor;



//// Add row - suggestion - Close all before opening the current one.
//const SUG = 'ul.suggestions', WRAP = '.autocomplete-wrapper', INP = '.searchlist';

//const hideAll = keep =>
//    document.querySelectorAll(SUG).forEach(u => {
//        if (u !== keep) { u.classList.remove('open'); u.style.display = 'none'; }
//    });

//const showFor = inp => {
//    const ul = inp.closest(WRAP)?.querySelector(SUG);
//    hideAll(ul);
//    if (ul) { ul.classList.add('open'); ul.style.display = 'block'; }
//};

//['input', 'focusin'].forEach(ev =>
//    document.addEventListener(ev, e => e.target.matches(INP) && showFor(e.target))
//);

//document.addEventListener('click', e => !e.target.closest(WRAP) && hideAll());
//document.addEventListener('keydown', e => e.key === 'Escape' && hideAll());

//// expose (optional) if you call them inline or after addRow1()
//window.closeAllSuggestions = hideAll;
//window.showOnlyThisSuggestion = showFor;

//// .sticky-responsive  - laptop touchpad close dropdown

//$(function () {
//    // Track which .sticky-responsive is currently "active"
//    let $active = $('.sticky-responsive').first();

//    // When user moves mouse or clicks/touches a container, make it active
//    $(document)
//        .on('mouseenter mousedown touchstart', '.sticky-responsive', function () {
//            $active = $(this);
//        });

//    function closeAllDropdowns() {
//        // Close Select2
//        if ($.fn.select2) {
//            $('.select2-container--open').each(function () {
//                const $sel = $(this).prev('select');
//                try { $sel.select2('close'); } catch (e) { }
//            });
//        }
//        // Close Bootstrap 4 dropdowns
//        $('.dropdown-menu.show').each(function () {
//            const $menu = $(this);
//            const $toggle = $menu.parent().find('[data-toggle="dropdown"], .dropdown-toggle').first();
//            try { $toggle.dropdown('hide'); } catch (e) { }
//            $menu.removeClass('show');
//        });
//        // Close DateRangePicker
//        $('.datepicker').each(function () {
//            const drp = $(this).data('daterangepicker');
//            if (drp && drp.isShowing) { drp.hide(); }
//        });
//        $('.daterangepicker:visible').hide();
//    }

//    // Helpers to decide if the container can scroll further
//    function canScrollVert(el, dy) {
//        if (!dy) return false;
//        if (dy > 0) return el.scrollTop + el.clientHeight < el.scrollHeight; // down
//        if (dy < 0) return el.scrollTop > 0;                                 // up
//        return false;
//    }
//    function canScrollHorz(el, dx) {
//        if (!dx) return false;
//        if (dx > 0) return el.scrollLeft + el.clientWidth < el.scrollWidth;   // right
//        if (dx < 0) return el.scrollLeft > 0;                                  // left
//        return false;
//    }

//    // Key handling at document level (no tabindex needed)
//    $(document).on('keydown', function (e) {
//        if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) return;

//        const a = document.activeElement;
//        const isEditing =
//            (/(INPUT|TEXTAREA|SELECT)/.test(a?.tagName) && !a.readOnly && !a.disabled) ||
//            (a?.isContentEditable === true);
//        if (isEditing) return;
//        if (!$active || !$active.length) return;

//        closeAllDropdowns();

//        const el = $active.get(0);
//        const v = 60, h = 100;

//        switch (e.key) {
//            case 'ArrowDown': el.scrollTop += v; break;
//            case 'ArrowUp': el.scrollTop -= v; break;
//            case 'ArrowRight': el.scrollLeft += h; break;
//            case 'ArrowLeft': el.scrollLeft -= h; break;
//            case 'PageDown': el.scrollTop += el.clientHeight - 20; break;
//            case 'PageUp': el.scrollTop -= el.clientHeight - 20; break;
//            case 'Home': el.scrollTop = 0; break;
//            case 'End': el.scrollTop = el.scrollHeight; break;
//            case ' ': el.scrollTop += el.clientHeight * 0.9; break;
//        }
//        e.preventDefault();
//    });

//    // Also hide on mouse/trackpad scroll inside the container (legacy)
//    $(document).on('scroll', '.sticky-responsive', closeAllDropdowns);

//    // --- Touchpad (two-finger) / mouse wheel support ---
//    // Use a non-passive listener so we can preventDefault() and stop page scroll.
//    window.addEventListener('wheel', function (ev) {
//        // Ignore when zooming (Ctrl + wheel) or when editing a field
//        if (ev.ctrlKey) return;
//        const a = document.activeElement;
//        const isEditing =
//            (/(INPUT|TEXTAREA|SELECT)/.test(a?.tagName) && !a.readOnly && !a.disabled) ||
//            (a?.isContentEditable === true);
//        if (isEditing) return;

//        // Prefer the container under the pointer, else fall back to $active
//        let $target = $(ev.target).closest('.sticky-responsive');
//        if ($target.length) { $active = $target; }
//        if (!$active || !$active.length) return;

//        const el = $active.get(0);

//        // Normalize deltas: deltaMode 1=line, 0=pixel, 2=page (rare)
//        let dx = ev.deltaX, dy = ev.deltaY;
//        const mode = ev.deltaMode; // 0=pixel,1=line,2=page
//        const lineH = 40;          // tune line height for line-mode devices
//        const pageH = el.clientHeight;

//        if (mode === 1) { dx *= lineH; dy *= lineH; }
//        else if (mode === 2) { dx *= pageH; dy *= pageH; }

//        // If the container can consume the scroll in either axis, do it and stop page scroll
//        const canV = canScrollVert(el, dy);
//        const canH = canScrollHorz(el, dx);

//        if (canV || canH) {
//            closeAllDropdowns();
//            if (canV) el.scrollTop += dy;
//            if (canH) el.scrollLeft += dx;
//            ev.preventDefault();
//        }
//        // If the container can't scroll further in the wheel direction, allow the event to bubble
//        // so the page can scroll (natural behavior at edges).
//    }, { passive: false }); // IMPORTANT: non-passive so preventDefault() works
//});


//

// --- Helpers: identify overlay UIs (Select2, daterangepicker, bootstrap dropdown, your suggestions, etc.) ---
const OVERLAYS_SEL = [
    '.select2-dropdown',
    '.select2-container--open',
    '.select2-results',
    '.select2-results__options',
    '.daterangepicker',
    '.dropdown-menu.show',
    'ul.suggestions.open',
    '.ui-autocomplete'
].join(', ');

function inOverlay(target) {
    return !!$(target).closest(OVERLAYS_SEL).length;
}

// OPTIONAL: if you want a quick guard for "any select2 is open"
function select2Open() {
    return $('.select2-container--open').length > 0;
}

// --- Update closeAllDropdowns to be *explicitly* callable (no implicit calls when Select2 needs to stay open) ---
function closeAllDropdowns() {
    // Do not close if the user is interacting *inside* an overlay right now
    if (select2Open()) return;

    // Close Select2
    if ($.fn.select2) {
        $('.select2-container--open').each(function () {
            const $sel = $(this).prev('select');
            try { $sel.select2('close'); } catch (e) { }
        });
    }
    // Close Bootstrap 4 dropdowns
    $('.dropdown-menu.show').each(function () {
        const $menu = $(this);
        const $toggle = $menu.parent().find('[data-toggle="dropdown"], .dropdown-toggle').first();
        try { $toggle.dropdown('hide'); } catch (e) { }
        $menu.removeClass('show');
    });
    // Close DateRangePicker
    $('.datepicker').each(function () {
        const drp = $(this).data('daterangepicker');
        if (drp && drp.isShowing) { drp.hide(); }
    });
    $('.daterangepicker:visible').hide();
}

// --- KEYBOARD: don’t hijack keys while a text field is being edited or a Select2 is open ---
$(document).on('keydown', function (e) {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) return;

    const a = document.activeElement;
    const isEditing = (/(INPUT|TEXTAREA|SELECT)/.test(a?.tagName) && !a.readOnly && !a.disabled) || (a?.isContentEditable === true);
    if (isEditing || select2Open()) return; // <-- skip when Select2 open

    // your existing $active / scrolling logic continues here, but
    // IMPORTANT: remove/avoid calling closeAllDropdowns() here.
    // ...
});

// --- MOUSE/TOUCH WHEEL: let Select2 results consume wheel; don’t close while inside overlays ---
window.addEventListener('wheel', function (ev) {
    let $active = $('.sticky-responsive').first();
    if (ev.ctrlKey) return; // zooming
    const a = document.activeElement;
    const isEditing = (/(INPUT|TEXTAREA|SELECT)/.test(a?.tagName) && !a.readOnly && !a.disabled) || (a?.isContentEditable === true);
    if (isEditing) return;

    // If pointer is inside any overlay (e.g., Select2 dropdown), DO NOT close things.
    if (inOverlay(ev.target)) {
        // Special case: if we are over the Select2 results list, allow it to scroll naturally.
        const $res = $(ev.target).closest('.select2-results__options');
        if ($res.length) {
            // Let Select2 handle scrolling – do not preventDefault and DO NOT close
            return;
        }
        // Other overlays (daterangepicker, bootstrap menu): let them handle too
        return;
    }

    // Normal sticky-responsive behavior below (unchanged), BUT do not call closeAllDropdowns() here.
    let $target = $(ev.target).closest('.sticky-responsive');
    if ($target.length) { $active = $target; }
    if (!$active || !$active.length) return;

    const el = $active.get(0);

    // Normalize deltas
    let dx = ev.deltaX, dy = ev.deltaY;
    const mode = ev.deltaMode; // 0=pixel,1=line,2=page
    const lineH = 40, pageH = el.clientHeight;
    if (mode === 1) { dx *= lineH; dy *= lineH; }
    else if (mode === 2) { dx *= pageH; dy *= pageH; }

    const canV = (dy > 0) ? (el.scrollTop + el.clientHeight < el.scrollHeight) : (dy < 0 && el.scrollTop > 0);
    const canH = (dx > 0) ? (el.scrollLeft + el.clientWidth < el.scrollWidth) : (dx < 0 && el.scrollLeft > 0);

    if (canV || canH) {
        if (canV) el.scrollTop += dy;
        if (canH) el.scrollLeft += dx;
        ev.preventDefault();
    }
}, { passive: false });

// --- SCROLL: replace container scroll close with safer window scroll close (ignore if Select2 open) ---
$(window).on('scroll', function () {
    if (select2Open()) return; // keep Select2 open while page scrolls
    closeAllDropdowns();
});

// (Optional) CLICK: don’t auto-close if clicking inside overlays
$(document).on('mousedown touchstart', function (e) {
    if (inOverlay(e.target)) return;
    // Your existing logic can stay; just avoid closing overlays when the click is inside them.
});


//tooltip click hide
$(function () {
    const SEL = '[data-toggle="tooltip"]';

    // Use MANUAL trigger so clicks can't open it
    $(SEL).tooltip('dispose').tooltip({ trigger: 'manual', container: 'body' });

    // Show only on hover
    $(document)
        .on('mouseenter', SEL, function () { $(this).tooltip('show'); })
        .on('mouseleave', SEL, function () { $(this).tooltip('hide'); })
        // If user clicks/taps/focuses, force-close immediately
        .on('click focusin mousedown touchstart', SEL, function () { $(this).tooltip('hide'); });

    // Safety net: any click/tap elsewhere closes all
    $(document).on('click touchstart', function () { $(SEL).tooltip('hide'); });
});

//// ====== selectors (adjust Class if yours differ) ======
const $input = $('#txtCustomerName');       // or your current input
const $list = $('.suggestions');           // all suggestion uls
const $wrap = $('.autocomplete-wrapper');  // wrapper around input+ul

function hideSuggestions() { $list.hide(); }
function isScrollingSuggestionsTarget(e) {
    return $(e?.target).closest('.suggestions').length > 0;
}

// --- 1) Hide on browser (window) scroll, unless user is scrolling the list itself
function onAnyScroll(e) {
    if (isScrollingSuggestionsTarget(e)) return; // let inline list scroll without hiding
    if ($list.is(':visible')) hideSuggestions();
}
window.addEventListener('scroll', onAnyScroll, { passive: true });

// --- 2) Hide if any ancestor container (cards/modals/panels) scrolls
$input.parents().on('scroll', onAnyScroll);

// --- 3) Hide on resize/orientation
$(window).on('resize orientationchange', hideSuggestions);

// --- 4) Hide on outside click (fixed selector)
$(document).on('mousedown touchstart', (e) => {
    const inside = $(e.target).closest('.autocomplete-wrapper, .suggestions').length > 0;
    if (!inside) hideSuggestions();
});

// --- 5) ESC closes
$input.on('keydown', function (e) {
    if (e.key === 'Escape') hideSuggestions();
});





$(document).ready(function () {
    $('.multiple-checkboxes').multiselect({
        includeSelectAllOption: true,
        nonSelectedText: 'Select',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        templates: {
            filter:
                '<li class="multiselect-item filter">' +
                '<div class="multiselect-search-wrapper">' +
                '<input class="form-control multiselect-search" type="text" placeholder="Search">' +
                '<span class="multiselect-clear-btn">&times;</span>' +
                '</div>' +
                '</li>'
        },

        onInitialized: function ($select, container) {
            const $dropdown = container.find('.dropdown-menu');

            // Add "No results found" element
            if ($dropdown.find('.no-results-select').length === 0) {
                $dropdown.append('<li class="no-results-select d-none text-center">No results found</li>');
            }

            const $noResults = $dropdown.find('.no-results-select');
            const $selectAllRow = $dropdown.find('.multiselect-all');
            const $input = $dropdown.find('.multiselect-search');
            const $clearBtn = $dropdown.find('.multiselect-clear-btn');

            function checkVisibleOptions() {
                const query = $input.val().trim();

                const visibleOptions = $dropdown.find('li:visible')
                    .filter(function () {
                        const $li = $(this);
                        return (
                            $li.find('input[type="checkbox"]').length > 0 &&
                            !$li.hasClass('multiselect-all') &&
                            !$li.hasClass('filter') &&
                            !$li.hasClass('no-results-select')
                        );
                    });

                if (query.length > 0 && visibleOptions.length === 0) {
                    $noResults.removeClass('d-none');
                    $selectAllRow.hide();
                } else {
                    $noResults.addClass('d-none');
                    $selectAllRow.show();
                }

                // Show/hide clear button
                $clearBtn.toggle(query.length > 0);
            }

            // Live input listener
            $input.on('input', function () {
                setTimeout(checkVisibleOptions, 20);
            });

            // Clear button click
            $clearBtn.on('click', function () {
                $input.val('');
                $clearBtn.hide();
                $input.trigger('input');
            });

            // On dropdown open
            container.find('.dropdown-toggle').on('click', function () {
                setTimeout(checkVisibleOptions, 10);
            });

            // MutationObserver for live changes
            const observer = new MutationObserver(function () {
                checkVisibleOptions();
            });

            observer.observe($dropdown[0], {
                childList: true,
                subtree: true,
                attributes: true,
            });
        }
    });
});


$(document).ready(function () {

    $('#createfmscontroller').on('shown.bs.modal', function () {
        $('.applyselect').each(function () {
            if ($(this).hasClass("select2-hidden-accessible")) {
                $(this).select2('destroy');
            }

            $(this).select2({
                dropdownParent: $('#createfmscontroller .modal-content'),
                allowClear: true,
                width: '100%'
            });
        });
    });
});

// This is better than using full modal
$(document).ready(function () {
    $('#createuser').on('shown.bs.modal', function () {
        $('.applyselect').each(function () {
            if ($(this).hasClass("select2-hidden-accessible")) {
                $(this).select2('destroy');
            }

            $(this).select2({
                dropdownParent: $('#createuser .modal-content'),
                allowClear: true,
                width: '100%'
            });
        });
    });

    // Fix Enter key for selection
    $(document).on('keypress', '.select2-search__field', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $(".select2-results__option--highlighted").trigger('mouseup');
        }
    });
});

// user Popup
$(document).ready(function () {
    $('#add').on('shown.bs.modal', function () {
        $('.applyselect').each(function () {
            if ($(this).hasClass("select2-hidden-accessible")) {
                $(this).select2('destroy');
            }

            $(this).select2({
                dropdownParent: $('#add .modal-content'),
                allowClear: true,
                width: '100%'
            });
        });
    });

    // Fix Enter key for selection
    $(document).on('keypress', '.select2-search__field', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $(".select2-results__option--highlighted").trigger('mouseup');
        }
    });
});
///



// model-freeze

$('.model-freeze').modal({
    backdrop: 'static',
    keyboard: false,
    show: false // prevent auto open
});
//Tooltip Modal 
$(function () {
    // Initialize all tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Show tooltip on hover
    $('[data-toggle="tooltip"]').on('mouseenter', function () {
        $(this).tooltip('show');
    });

    // Prevent the tooltip from closing when clicking the button (or modal)
    $('[data-toggle="tooltip"]').on('click', function (e) {
        e.stopPropagation(); // Prevent tooltip from closing
    });

    // Hide tooltip when any modal is shown
    $('.modal').on('shown.bs.modal', function () {
        $('[data-toggle="tooltip"]').tooltip('hide');
    });
});

//function adjustHeight(element) {
//    element.style.height = 'auto';  // Reset height
//    element.style.height = (element.scrollHeight) + 'px';  // Set height to match content
//}

//// Apply to all textareas with the class "auto-height"
//window.onload = function () {
//    document.querySelectorAll('.adjustHeight').forEach(function (textarea) {
//        adjustHeight(textarea);
//    });
//};

//// Apply height adjustment on input for all textareas with the class "auto-height"
//document.querySelectorAll('.adjustHeight').forEach(function (textarea) {
//    textarea.addEventListener('input', function () {
//        adjustHeight(this);
//    });
//});

// Ensure the height is adjusted for all textareas on page load
//window.onload = function () {
//    document.querySelectorAll('textarea').forEach(function (textarea) {
//        adjustHeight(textarea);
//    });
//};

// Modal Delete Index 

$('#deleteCommonType').on('shown.bs.modal', function () {
    // Add class to the last backdrop
    $('.modal-backdrop').last().addClass('modal-index');
});

// Optional: Remove class when modal is hidden to clean up
$('#deleteCommonType').on('hidden.bs.modal', function () {
    $('.modal-backdrop').removeClass('modal-index');
});


$(document).on("click", ".deleterow", function () {
    var $img = $(this).find("img");  // Target the image with the tooltip

    $img.tooltip('hide');            // Hide tooltip
    $img.tooltip('dispose');         // Remove tooltip completely

    $(this).closest("tr").remove();  // Now remove the row
});

// toggle info

$(document).ready(function () {
    $('.toggle-info-content').hide(); // hide all on load

    $('.toggle-info').click(function () {
        $(this).next('.toggle-info-content').slideToggle(300); // only toggle the next content

        // Rotate the arrow icon in the clicked header
        $(this).find('.toggle-card-icon img').toggleClass('rotated');
    });
});

$(document).ready(function () {
    $('#toggle-info-content-two').hide(); // ensure hidden on load

    $('#toggle-info-two').click(function () {
        $('#toggle-info-content-two').slideToggle(300); // show/hide with slide effect

        // Rotate the arrow icon
        $(this).find('.toggle-card-icon img').toggleClass('rotated');
    });
});



// Radio with open Modal

$(document).ready(function () {
    $('.openModal').click(function () {
        $('#radioModal').modal('show');
    });
});

// Select 
$(document).ready(function () {
    $(".applyselect").select2();

});


//

// select multiple
jQuery(function ($) {
    $.fn.select2?.amd?.require([
        'select2/selection/single',
        'select2/selection/placeholder',
        'select2/selection/allowClear',
        'select2/dropdown',
        'select2/dropdown/search',
        'select2/dropdown/attachBody',
        'select2/utils'
    ], function (SingleSelection, Placeholder, AllowClear, Dropdown, DropdownSearch, AttachBody, Utils) {

        var SelectionAdapter = Utils.Decorate(SingleSelection, Placeholder);
        SelectionAdapter = Utils.Decorate(SelectionAdapter, AllowClear);

        var DropdownAdapter = Utils.Decorate(
            Utils.Decorate(Dropdown, DropdownSearch),
            AttachBody
        );

        // Re-initialize inside modal when shown
        $('#add').on('shown.bs.modal', function () {
            $('.applyselectmultiplemultiple').each(function () {
                var base_element = $(this);
                var container = $(this).closest('.selectmultiple');

                // Destroy if already initialized
                if ($(base_element).hasClass("select2-hidden-accessible")) {
                    $(base_element).select2('destroy');
                }

                // Initialize Select2 with modal compatibility
                $(base_element).select2({
                    placeholder: 'Select',
                    selectionAdapter: SelectionAdapter,
                    dropdownAdapter: DropdownAdapter,
                    dropdownParent: $('#add .modal-content'),
                    allowClear: true,
                    closeOnSelect: false,
                    templateResult: function (data) {
                        if (!data.id) return data.text;
                        var $res = $('<div></div>');
                        $res.text(data.text).addClass('wrap');
                        return $res;
                    },
                    templateSelection: function (data) {
                        if (!data.id) return data.text;
                        var selected = ($(base_element).val() || []).length;
                        var total = $('option', $(base_element)).length;
                        return "Selected " + selected + " of " + total;
                    }
                });

                // Hide unselect button initially
                container.find('.unselect-all-btn').hide();

                // Select All
                container.find('.select-all-btn').off().on('click', function () {
                    $(base_element).find('option').prop('selected', true).trigger('change');
                });

                // Unselect All
                container.find('.unselect-all-btn').off().on('click', function () {
                    $(base_element).find('option').prop('selected', false).trigger('change');
                });

                // Toggle visibility
                $(base_element).on('change', function () {
                    var totalOptions = $(base_element).find('option').length;
                    var selectedOptions = $(base_element).val() ? $(base_element).val().length : 0;

                    if (selectedOptions === totalOptions) {
                        container.find('.select-all-btn').hide();
                        container.find('.unselect-all-btn').show();
                    } else if (selectedOptions === 0) {
                        container.find('.select-all-btn').show();
                        container.find('.unselect-all-btn').hide();
                    }
                });
            });
        });

    });
});
// select multiple

jQuery(function ($) {
    $.fn.select2?.amd?.require([
        'select2/selection/single',
        'select2/selection/placeholder',
        'select2/selection/allowClear',
        'select2/dropdown',
        'select2/dropdown/search',
        'select2/dropdown/attachBody',
        'select2/utils'
    ], function (SingleSelection, Placeholder, AllowClear, Dropdown, DropdownSearch, AttachBody, Utils) {

        var SelectionAdapter = Utils.Decorate(
            SingleSelection,
            Placeholder
        );

        SelectionAdapter = Utils.Decorate(
            SelectionAdapter,
            AllowClear
        );

        var DropdownAdapter = Utils.Decorate(
            Utils.Decorate(
                Dropdown,
                DropdownSearch
            ),
            AttachBody
        );

        // Initialize each select element independently
        $('.applyselectmultiple').each(function () {
            var base_element = $(this);
            var container = $(this).closest('.selectmultiple');

            // Initialize Select2
            $(base_element).select2({
                placeholder: 'Select',
                selectionAdapter: SelectionAdapter,
                dropdownAdapter: DropdownAdapter,
                allowClear: true,
                closeOnSelect: false, // Keep dropdown open for multiple selections
                templateResult: function (data) {
                    if (!data.id) {
                        return data.text;
                    }

                    var $res = $('<div></div>');
                    $res.text(data.text);
                    $res.addClass('wrap');

                    return $res;
                },
                templateSelection: function (data) {
                    if (!data.id) {
                        return data.text;
                    }
                    var selected = ($(base_element).val() || []).length;
                    var total = $('option', $(base_element)).length;
                    return "Selected " + selected + " of " + total;
                }
            });

            // Hide "Unselect All" button by default
            container.find('.unselect-all-btn').hide();

            // Add Select All functionality
            container.find('.select-all-btn').on('click', function () {
                $(base_element).find('option').prop('selected', true).trigger('change');
            });

            // Add Unselect All functionality
            container.find('.unselect-all-btn').on('click', function () {
                $(base_element).find('option').prop('selected', false).trigger('change');
            });

            // Detect changes in the dropdown
            $(base_element).on('change', function () {
                var totalOptions = $(base_element).find('option').length;
                var selectedOptions = $(base_element).val() ? $(base_element).val().length : 0;

                if (selectedOptions === totalOptions) {
                    // All options are selected
                    container.find('.select-all-btn').hide();
                    container.find('.unselect-all-btn').show();
                } else if (selectedOptions === 0) {
                    // No options are selected
                    container.find('.select-all-btn').show();
                    container.find('.unselect-all-btn').hide();
                } //else {
                // Partial selection
                //container.find('.select-all-btn').show();
                //container.find('.unselect-all-btn').show();
                //}
            });
        });
    });
});



// default table

$(document).ready(function () {
    // Initialize DataTable
    var table = $('#default').DataTable({
        "paging": true,
        "pagingType": "full_numbers", // Enable first, last, previous, and next buttons
        "pageLength": 10,
        "lengthMenu": [10, 20, 40, 40, 60], // Allow pagination with specified options
        "ordering": true, // Enable sorting
        "info": true,
        "autoWidth": false,
        "responsive": true,
        "dom": '<"top">rt<"bottom"lip><"clear">', // Custom placement of elements
        "language": {
            "paginate": {
                "first": "<img src='../../assets/images/icons/help/double-left.png' alt=''>",  // Icon for "First"
                "previous": "<img src='../../assets/images/icons/help/arrow-left.png' alt=''>", // Icon for "Previous"
                "next": "<img src='../../assets/images/icons/help/arrow-right.png' alt=''>",   // Icon for "Next"
                "last": "<img src='../../assets/images/icons/help/double-right.png' alt=''>"   // Icon for "Last"
            }
        },
        // "columnDefs": [
        //     { "orderable": false, "targets": [9] } // Disable sorting for the Action column
        // ]
    });

    // Customize pagination to show only the current button
    table.on('draw', function () {
        $('.paginate_button').hide();
        $('.paginate_button.current').show();
        $('.paginate_button.previous, .paginate_button.next').show();
    });

    // Apply search functionality for visible columns
    $('#default thead input.filter-input').on('keyup change', function () {
        var columnIndex = $(this).closest('th').index();
        table.column(columnIndex).search(this.value).draw();
    });
});

// tooltip

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});


// add form    password
$(document).ready(function () {
    // Initialize Bootstrap Tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Toggle password visibility and update tooltip and icon
    $('#togglePassword').on('click', function () {
        // Get the password field
        const passwordField = $('#passwordField');
        // Toggle the type attribute
        const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);
        // Toggle the icon class
        $(this).toggleClass('fa-eye fa-eye-slash');
        // Update the tooltip text
        const tooltipText = type === 'password' ? 'Show Password' : 'Hide Password';
        $(this).attr('title', tooltipText).tooltip('dispose').tooltip(); // Refresh tooltip
    });
});


// edit form  password
$(document).ready(function () {
    // Initialize Bootstrap Tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Toggle password visibility and update tooltip and icon
    $('#togglePasswordtwo').on('click', function () {
        // Get the password field
        const passwordField = $('#passwordFieldtwo');
        // Toggle the type attribute
        const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);
        // Toggle the icon class
        $(this).toggleClass('fa-eye fa-eye-slash');
        // Update the tooltip text
        const tooltipText = type === 'password' ? 'Show Password' : 'Hide Password';
        $(this).attr('title', tooltipText).tooltip('dispose').tooltip(); // Refresh tooltip
    });
});

// table mobile

$('.rstable').each(
    function () {
        var titles;

        titles = [];

        $('thead th', this).each(
            function () {
                titles.push($(this).text());
            });


        $('tbody tr', this).each(
            function () {

                $('td', this).each(
                    function (index) {
                        $(this).attr('data-label', titles[index]);
                        $(this).wrapInner('<span></span>')
                    });
            });
    });



// checkbox one time click

$(document).ready(function () {
    $('.toggleCheckbox').on('change', function () {
        const $contentDiv = $('#contentDiv');

        if ($(this).is(':checked')) {
            $contentDiv.stop(true, true).addClass('visible').fadeIn(400);
        } else {
            $contentDiv.stop(true, true).fadeOut(400, function () {
                $(this).removeClass('visible');
            });
        }
    });
});



// Tabs line

// $("#tile-1 .nav-tabs a").click(function() {
//   var position = $(this).parent().position();
//   var width = $(this).parent().width();
//     $("#tile-1 .slider").css({"left":+ position.left,"width":width});
// });
// var actWidth = $("#tile-1 .nav-tabs").find(".active").parent("li").width();
// var actPosition = $("#tile-1 .nav-tabs .active").position();
// $("#tile-1 .slider").css({"left":+ actPosition.left,"width": actWidth});


//$(document).ready(function () {
//    var $slider = $("#tile-1 .slider");
//    var $navTabs = $("#tile-1 .nav-tabs");

//    // Function to move the slider to the active tab
//    function moveSlider() {
//        var $activeTab = $navTabs.find(".nav-link.active").parent();
//        var position = $activeTab.position();
//        var width = $activeTab.width();
//        //$slider.css({ left: position.left, width: width });
//    }

//    // Initialize the slider position
//   // moveSlider();

//    // Update slider on tab click
//    $("#tile-1 .nav-tabs a").on("click", function () {
//        setTimeout(moveSlider, 50); // Small delay to allow Bootstrap tab to activate
//    });
//});


// Tabs line

// $("#tile-1 .nav-tabs a").click(function() {
//   var position = $(this).parent().position();
//   var width = $(this).parent().width();
//     $("#tile-1 .slider").css({"left":+ position.left,"width":width});
// });
// var actWidth = $("#tile-1 .nav-tabs").find(".active").parent("li").width();
// var actPosition = $("#tile-1 .nav-tabs .active").position();
// $("#tile-1 .slider").css({"left":+ actPosition.left,"width": actWidth});


$(document).ready(function () {
    var $slider = $("#tile-1 .slider");
    var $navTabs = $("#tile-1 .nav-tabs");

    // Function to move the slider to the active tab
    function moveSlider() {
        var $activeTab = $navTabs.find(".nav-link.active").parent();
        var position = $activeTab.position();
        var width = $activeTab.width();
        $slider.css({ left: position?.left, width: width });
    }

    // Initialize the slider position
    moveSlider();

    // Update slider on tab click
    $("#tile-1 .nav-tabs a").on("click", function () {
        setTimeout(moveSlider, 50); // Small delay to allow Bootstrap tab to activate
    });
});



// Search filter
$(document).ready(function () {
    $('#searchInput').on('keyup', function () {
        const searchTerm = $(this).val().toLowerCase().trim();
        let hasResults = false;

        // Iterate through list items
        $('#searchList .item').each(function () {
            const itemText = $(this).text().toLowerCase().trim();

            // Show or hide the item based on the search term
            if (itemText.includes(searchTerm)) {
                $(this).show();
                hasResults = true;
            } else {
                $(this).hide();
            }
        });

        // Display or hide the "No results" message
        $('#noResultsMessage').toggle(!hasResults);
    });
});



// tab slider 
$(document).ready(function () {
    const itemsToShowDesktop = 5;
    const itemsToShowMobile = 2;
    let currentIndex = 0;
    const $sliderContainer = $('.slider-container');
    const $tabSlider = $('.tabslider');
    const $items = $('.item');
    const totalItems = $items.length;
    let itemsToShow = itemsToShowDesktop;
    let containerWidth = $sliderContainer.width();
    let isDragging = false;
    let startX = 0;
    let currentOffset = 0;

    // Function to determine items to show based on screen width
    function determineItemsToShow() {
        itemsToShow = $(window).width() <= 600 ? itemsToShowMobile : itemsToShowDesktop;
        updateSlider();
        updateButtons();
    }

    // Function to update slider position
    function updateSlider() {
        const itemWidth = containerWidth / itemsToShow;
        $items.css('width', itemWidth);
        const offset = -currentIndex * itemWidth;
        $tabSlider.css('transform', `translateX(${offset}px)`);
        currentOffset = offset;
    }

    // Function to update button states
    function updateButtons() {
        $('#prevButton').prop('disabled', currentIndex === 0);
        $('#nextButton').prop('disabled', currentIndex + itemsToShow >= totalItems);
    }

    // Mouse slide functionality
    $sliderContainer.on('mousedown', function (e) {
        isDragging = true;
        startX = e.pageX;
        $tabSlider.css('transition', 'none'); // Disable smooth transition during drag
    });

    $(document).on('mousemove', function (e) {
        if (isDragging) {
            const diff = e.pageX - startX;
            const offset = currentOffset + diff;
            $tabSlider.css('transform', `translateX(${offset}px)`);
        }
    });

    $(document).on('mouseup', function (e) {
        if (isDragging) {
            isDragging = false;
            const diff = e.pageX - startX;
            const itemWidth = containerWidth / itemsToShow;

            // Determine the index shift based on drag distance
            if (Math.abs(diff) > itemWidth / 2) {
                if (diff < 0 && currentIndex + itemsToShow < totalItems) {
                    currentIndex++;
                } else if (diff > 0 && currentIndex > 0) {
                    currentIndex--;
                }
            }
            updateSlider();
            updateButtons();
            $tabSlider.css('transition', 'transform 0.3s ease'); // Re-enable smooth transition
        }
    });

    // Next and Previous button functionality
    $('#nextButton').on('click', function () {
        if (currentIndex + itemsToShow < totalItems) {
            currentIndex++;
            updateSlider();
        }
        updateButtons();
    });

    $('#prevButton').on('click', function () {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
        updateButtons();
    });

    // Adjust slider on window resize
    $(window).resize(function () {
        containerWidth = $sliderContainer.width();
        determineItemsToShow();
    });

    // Initial setup
    determineItemsToShow();
});



// dropdown effect
// $('.dropdown').on('show.bs.dropdown', function(e){
//   $(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
// });

// $('.dropdown').on('hide.bs.dropdown', function(e){
//   $(this).find('.dropdown-menu').first().stop(true, true).slideUp(300);
// });





//$(document).ready(function () {
//    function toggleOptions() {
//        if ($(window).width() <= 1279) {
//            // Move options inside dropdown-menu maintaining the original order
//            $('.option').each(function () {
//                if (!$(this).hasClass('moved')) {
//                    $(this).addClass('moved'); // Add a marker class
//                    $('.dropdown-menu').append($(this)); // Append in order inside dropdown-menu
//                }
//            });
//        } else {
//            // Move options back outside the dropdown-menu maintaining original order
//            $($('.dropdown-menu .option').get().reverse()).each(function () {
//                if ($(this).hasClass('moved')) {
//                    $(this).removeClass('moved'); // Remove marker class
//                    $(this).insertBefore('.dropdown'); // Move before dropdown
//                }
//            });
//        }
//    }

//    // Initial check and on window resize
//    toggleOptions();
//    $(window).resize(toggleOptions);
//});


// 

//set button id on click to hide first modal
$("#verifyuser").on("click", function () {
    $('#adduser').modal('hide');
});
//trigger next modal
$("#verifyuser").on("click", function () {
    $('#createuser').modal('show');
});



// tab list slider

$(document).ready(function () {
    var sliderContainer = $(".tab-slider-container");
    var scrollAmount = 200;

    function checkButtons() {
        var scrollLeft = sliderContainer.scrollLeft();
        var scrollWidth = sliderContainer[0]?.scrollWidth;
        var clientWidth = sliderContainer[0]?.clientWidth;

        $(".nav-arrow.left").toggleClass("disabled", scrollLeft <= 0);
        $(".nav-arrow.right").toggleClass("disabled", scrollLeft + clientWidth >= scrollWidth);
    }

    $(".nav-arrow.left").click(function () {
        sliderContainer.animate({ scrollLeft: '-=' + scrollAmount }, 300, checkButtons);
    });

    $(".nav-arrow.right").click(function () {
        sliderContainer.animate({ scrollLeft: '+=' + scrollAmount }, 300, checkButtons);
    });

    sliderContainer.on("scroll", checkButtons);
    checkButtons();
});


// link Select option

$(document).ready(function () {
    $('#optionSelect').on('change', function () {
        const selectedLink = $(this).val();
        if (selectedLink) {
            window.location.href = selectedLink; // Navigate to the selected page
        }
    });
});



// datepicker

//$(function () {
//    // Initialize jQuery UI Datepicker with month and year dropdowns
//    $(".datepicker").datepicker({
//        dateFormat: "dd-mm-yy",  // Format: Day/Month/Year with slashes
//        changeMonth: true,       // Enable month dropdown
//        changeYear: true,        // Enable year dropdown
//        showButtonPanel: false,  // Optionally hide today and done buttons
//    });

//    // Open the datepicker when the calendar icon is clicked
//    $(".dateicon").click(function () {
//        $(this).prev(".datepicker").focus();  // Open the associated datepicker
//    });

//    // Automatically open "To Date" datepicker with a delay when "From Date" is selected
//    $("#datepickerA").on("change", function () {
//        setTimeout(function () {
//            $("#datepickerb").focus();  // Focus on "To Date" after selecting "From Date"
//        }, 200);  // Delay of 200ms to ensure smooth transition
//    });
//});
//$('.datepicker').each(function () {
//    $(this).daterangepicker({
//        opens: 'right',
//        singleDatePicker: true,
//        showDropdowns: true,
//        autoApply: true,
//        autoUpdateInput: false,
//        parentEl: '.modal', // or .modal-content based on your structure
//        locale: {
//            format: 'DD/MM/YYYY'
//        }
//    })
//        .on('apply.daterangepicker', function (ev, picker) {
//            $(this).val(picker.startDate.format('DD/MM/YYYY'));
//        })
//        .on('show.daterangepicker', function (ev, picker) {
//            const $input = $(this);
//            setTimeout(function () { // timeout ensures calendar is rendered
//                const calendar = $('.daterangepicker'); // global instance (only one shown at a time)
//                const inputOffset = $input.offset().top;
//                const inputHeight = $input.outerHeight();
//                const calendarHeight = calendar.outerHeight();
//                const scrollTop = $(window).scrollTop();
//                const windowHeight = $(window).height();

//                const bottomSpace = windowHeight - (inputOffset - scrollTop + inputHeight);

//                if (bottomSpace < calendarHeight) {
//                    // Not enough space, open upward
//                    calendar.css({
//                        top: inputOffset - calendarHeight - 10 + 'px',
//                        bottom: 'auto'
//                    });
//                } else {
//                    // Enough space, let it be default
//                    calendar.css({
//                        top: '',
//                        bottom: ''
//                    });
//                }
//            }, 10); // slight delay to wait for DOM render
//        });
//});

//  Counter - Plus - Minus

$(document).ready(function () {
    // Handle the plus button click
    $('.counter-number .plus').click(function () {
        let inputField = $(this).siblings('input[type="number"]');
        let currentValue = parseInt(inputField.val()) || 0;
        inputField.val(currentValue + 1);
    });

    // Handle the minus button click
    $('.counter-number .minus').click(function () {
        let inputField = $(this).siblings('input[type="number"]');
        let currentValue = parseInt(inputField.val()) || 0;
        if (currentValue > 0) { // Prevent negative numbers
            inputField.val(currentValue - 1);
        }
    });

    // Optional: Prevent manual input of negative values
    $('.counter-number input[type="number"]').on('input', function () {
        if ($(this).val() < 0) {
            $(this).val(0);
        }
    });
});


// fil

//fileUploadWithPreview();


$(document).ready(function () {
    var $slider = $("#tile-1 .slider");
    var $navTabs = $("#tile-1 .nav-tabs");

    // Function to move the slider to the active tab
    function moveSlider() {
        var $activeTab = $navTabs.find(".nav-link.active").parent();
        var position = $activeTab.position();
        var width = $activeTab.width();
        $slider.css({ left: position.left, width: width });
    }

    // Initialize the slider position
    //   moveSlider();

    // Update slider on tab click
    $("#tile-1 .nav-tabs a").on("click", function () {
        setTimeout(moveSlider, 50); // Small delay to allow Bootstrap tab to activate
    });
});

// Multiple Select with checkbox
//$(document).ready(function () {
//    $('.multiple-checkboxes').multiselect({
//        includeSelectAllOption: true,
//        nonSelectedText: 'Select',
//        buttonWidth: '100%',
//        enableFiltering: true,           // Enable search filtering
//        enableCaseInsensitiveFiltering: true, // Case-insensitive search
//    });
//});

// Multiple select with checkbox
function InitializeMultiselectWithSearch(selector) {
    $(selector).multiselect('destroy');
    $(selector).multiselect({
        includeSelectAllOption: true,
        nonSelectedText: 'Select',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        templates: {
            filter:
                '<li class="multiselect-item filter">' +
                '<div class="multiselect-search-wrapper">' +
                '<input class="form-control multiselect-search" type="text" placeholder="Search">' +
                '<span class="multiselect-clear-btn">&times;</span>' +
                '</div>' +
                '</li>'
        },
        onInitialized: function ($select, container) {
            const $dropdown = container.find('.dropdown-menu');

            if ($dropdown.find('.no-results-select').length === 0) {
                $dropdown.append('<li class="no-results-select d-none text-center">No results found</li>');
            }

            const $noResults = $dropdown.find('.no-results-select');
            const $selectAllRow = $dropdown.find('.multiselect-all');
            const $input = $dropdown.find('.multiselect-search');
            const $clearBtn = $dropdown.find('.multiselect-clear-btn');

            function checkVisibleOptions() {
                const query = $input.val().trim();
                const visibleOptions = $dropdown.find('li:visible').filter(function () {
                    const $li = $(this);
                    return (
                        $li.find('input[type="checkbox"]').length > 0 &&
                        !$li.hasClass('multiselect-all') &&
                        !$li.hasClass('filter') &&
                        !$li.hasClass('no-results-select')
                    );
                });

                if (query.length > 0 && visibleOptions.length === 0) {
                    $noResults.removeClass('d-none');
                    $selectAllRow.hide();
                } else {
                    $noResults.addClass('d-none');
                    $selectAllRow.show();
                }

                $clearBtn.toggle(query.length > 0);
            }

            $input.on('input', function () {
                setTimeout(checkVisibleOptions, 20);
            });

            $clearBtn.on('click', function () {
                $input.val('');
                $clearBtn.hide();
                $input.trigger('input');
            });

            container.find('.dropdown-toggle').on('click', function () {
                setTimeout(checkVisibleOptions, 10);
            });

            const observer = new MutationObserver(checkVisibleOptions);
            observer.observe($dropdown[0], {
                childList: true,
                subtree: true,
                attributes: true,
            });
        }
    });
}
