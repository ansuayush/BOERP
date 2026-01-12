// Select 
$(document).ready(function () {
    $(".applyselect").select2();

});

// select multiple

jQuery(function($) {
    $.fn.select2.amd.require([
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
      $('.applyselectmultiple').each(function() {
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
        container.find('.select-all-btn').on('click', function() {
          $(base_element).find('option').prop('selected', true).trigger('change');
        });
  
        // Add Unselect All functionality
        container.find('.unselect-all-btn').on('click', function() {
          $(base_element).find('option').prop('selected', false).trigger('change');
        });
  
        // Detect changes in the dropdown
        $(base_element).on('change', function() {
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
        "pageLength": 8,
        "lengthMenu": [8, 16, 24, 30, 40], // Allow pagination length 1 by 1
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "responsive": true,
        "dom": '<"top">rt<"bottom"lip><"clear">', // Custom placement of elements
        "language": {
            "paginate": {
                "first": "<img src='assets/images/icons/help/double-left.png' alt=''>",  // Icon for "First"
                "previous": "<img src='assets/images/icons/help/arrow-left.png' alt=''>",      // Icon for "Previous"
                "next": "<img src='assets/images/icons/help/arrow-right.png' alt=''>",         // Icon for "Next"
                "last": "<img src='assets/images/icons/help/double-right.png' alt=''>"   // Icon for "Last"
            }
        },
    });


    // Customize pagination to show only the current button
    table.on('draw', function () {
        $('.paginate_button').hide();
        $('.paginate_button.current').show();
        $('.paginate_button.previous, .paginate_button.next').show();
    });

    // Apply search functionality for visible columns
    $('#defualt thead input').on('keyup change', function () {
        var columnIndex = $(this).parent().index();
        if (table.column(columnIndex).visible()) {
            table.column(columnIndex).search(this.value).draw();
        }
    });

    // Dropdown functionality for actions
    $('.actions-dropdown').on('click', function () {
        $(this).find('.dropdown-menu').toggle();
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.actions-dropdown').length) {
            $('.dropdown-menu').hide();
        }
    });
});

  // tooltip

  $(document).ready(function(){
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
function() {
  var titles;

  titles = [];

  $('thead th', this).each(
  function() {
    titles.push($(this).text());
  });

  
  $('tbody tr', this).each(
  function() {
    
    $('td', this).each(
    function(index) {
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