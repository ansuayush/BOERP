$(document).ready(function () {
    // Define validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[6-9]\d{9}$/;

    // Function to handle validation
    function validateInput(input) {
        if (emailPattern.test(input) || phonePattern.test(input)) {
            $('#validationMessage').hide();
            $('#email').removeClass('error'); // Remove error class
            $('#continueBtn').prop('disabled', false); // Enable button
        } else {
            $('#validationMessage').show();
            $('#email').addClass('error'); // Add error class
            $('#continueBtn').prop('disabled', true); // Disable button
        }
    }

    // Input validation on keyup
    $('#email').on('keyup', function () {
        const inputValue = $(this).val();
        validateInput(inputValue);
    });

    // Redirect to verify-Login.html on button click
    $('#continueBtn').on('click', function () {
        const inputValue = $('#email').val();
        if (emailPattern.test(inputValue) || phonePattern.test(inputValue)) {
            window.location.href = 'verify-Login.html'; // Redirect to verify-Login.html
        } else {
            $('#validationMessage').show(); // Show validation message
        }
    });
});
