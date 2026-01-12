$(document).ready(function () {
    const $otpInput = $('#opt');
    const $otpMessage = $('#OTPMessage');
    const $submitButton = $('#submitButton');

    //console.log('yash')
    // Function to validate OTP
    function validateOTP() {
        const otpValue = $otpInput.val().trim();
        if (otpValue && !isNaN(otpValue) && otpValue > 0) {
            $otpInput.removeClass('error');
            $otpMessage.hide();
            return true;
        } else {
            $otpInput.addClass('error');
            $otpMessage.show();
            return false;
        }
    }

    // Enable/Disable button based on OTP validation
    $otpInput.on('input', function () {
        if (validateOTP()) {
            $submitButton.prop('disabled', false);
        } else {
            $submitButton.prop('disabled', true);
        }
    });

     // Redirect to index.html if OTP is valid
    $('#submitButton').on('click', function () {
        console.log('Yash Nayak')
    });
});
