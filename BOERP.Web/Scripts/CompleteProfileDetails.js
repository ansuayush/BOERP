$(document).ready(function () {
    $(function () {
        $('.datepicker').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: "dd-mm-yy",
            yearRange: "-90:+10"
        });

    });

    LoadMasterDropdown('ddlCountry', {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 20,
        manualTableId: 0
    }, 'Select', false);
    LoadMasterDropdown('ddlLACountry', {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 20,
        manualTableId: 0
    }, 'Select', false);
    LoadMasterDropdown('ddlPACountry', {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 20,
        manualTableId: 0
    }, 'Select', false);
    LoadMasterDropdown('ddlBenefitsNameOfTheBank', {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 21,
        manualTableId: 0
    }, 'Select', false);
    LoadMasterDropdown('ddlReimbursementNameOfTheBank', {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 21,
        manualTableId: 0
    }, 'Select', false);
    LoadMasterDropdown('ddlSeatPreference', {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 31,
        manualTableId: 0
    }, 'Select', false);
    LoadMasterDropdown('ddlMealPreference', {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 32,
        manualTableId: 0
    }, 'Select', false);
    LoadMasterDropdown('ddlBloodGroup', {
        ParentId: 0,
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 34,
        manualTableId: 0
    }, 'Select', false);   
    if (ScreenLock == "True") {
        $('input, textarea, select, button').prop('disabled', true);
        $('#btnNext').prop('disabled', false);
    }
    else {
        $('input, textarea, select, button').prop('disabled', false);
    }
    BindOnboardRegistrationRequest();
});
var DocArray = [];
function BindOnboardRegistrationRequest() {
    CommonAjaxMethod(virtualPath + 'OnboardingRequest/BindonboardingProcessData', { CandidateId: CandidateId, inputData: 9 }, 'GET', function (response) {
        var registrationData = response.data.data.Table;
        var airlineDetailsData = response.data.data.Table1;
        if (registrationData.length > 0) {
            $('#txtFatherName').val(registrationData[0].FatherName);
            $('#txtMotherName').val(registrationData[0].MotherName);
            $('#txtDateofBirth').val(ChangeDateFormatToddMMYYY(registrationData[0].DOB));
            $('#ddlGenderName').val(registrationData[0].Gender).trigger('change');
            $('#ddlMaritalStatus').val(registrationData[0].MaritalStatus).trigger('change');
            $('#ddlNationality').val(registrationData[0].Nationality).trigger('change');
            $('#ddlSpousePartner').val(registrationData[0].SpousePartner).trigger('change');
            $('#txtSpousesName').val(registrationData[0].SpousesName);
            $('#txtAnniversaryDate').val(ChangeDateFormatToddMMYYY(registrationData[0].AnniversaryDate));
            if (registrationData[0].MaritalStatus == "2") {
                $('#txtMarriedNoOfChildren2').val(registrationData[0].MarriedNoOfChildren);
            } else {
                $('#txtDivorcedNoOfChildren').val(registrationData[0].MarriedNoOfChildren);
            }
            $('#ddlCountry').val(registrationData[0].Country).trigger('change');
            $('#txtDetailOfWorPermitVisa').val(registrationData[0].DetailOfWorPermitVisa),
                $('#txtValidityDate').val(ChangeDateFormatToddMMYYY(registrationData[0].ValidityDate));
            $('#txtAnyOtherDetails').val(registrationData[0].AnyOtherDetails);
            $('#txtLAAddressLine1').val(registrationData[0].LAAddressLine1);
            $('#txtLAAddressLine2').val(registrationData[0].LAAddressLine2);
            $('#txtLAPinCode').val(registrationData[0].LAPinCode);
            $('#ddlLACountry').val(registrationData[0].LACountry).trigger('change');
            $('#ddlLAState').val(registrationData[0].LAState).trigger('change'),
                $('#ddlLACity').val(registrationData[0].LACity).trigger('change');
            $('#txtLAMobile').val(registrationData[0].LAMobile);
            $('#txtPAAddressLine1').val(registrationData[0].PAAddressLine1);
            $('#txtPAAddressLine2').val(registrationData[0].PAAddressLine2);
            $('#txtPAPinCode').val(registrationData[0].PAPinCode);
            $('#ddlPACountry').val(registrationData[0].PACountry).trigger('change');
            $('#ddlPAState').val(registrationData[0].PAState).trigger('change');
            $('#ddlPACity').val(registrationData[0].PACity).trigger('change');
            $('#txtPAPhoneNumber').val(registrationData[0].PAPhoneNumber);
            $('#txtPAAlternativePhoneNumber').val(registrationData[0].PAAlternativePhoneNumber);
            $('#txtPALandlineNo').val(registrationData[0].PALandlineNo);
            $('#txtPAPersonalEmailID').val(registrationData[0].PAPersonalEmailID);
            $('#ddlSpecialAbility').val(registrationData[0].SpecialAbility).trigger('change');;
            $('#txtMDformC3').val(registrationData[0].MDFormC3);
            $('#txtMDconditionC3').val(registrationData[0].MDConditionC3);
            $('#txtMDHospitalPhysicianName').val(registrationData[0].MDHospitalPhysicianName);
            $('#txtMDPhoneNumber').val(registrationData[0].MDPhoneNumber);
            $('#txtMDAlternativeNumber').val(registrationData[0].MDAlternativeNumber);
            $('#ddlBloodGroup').val(registrationData[0].BloodGroup).trigger('change');;
            $('#txtMDEmergencyContactName').val(registrationData[0].MDEmergencyContactName);
            $('#txtMDEmergencyContactRelationship').val(registrationData[0].MDEmergencyContactRelationship);
            document.getElementById('chkLIFlagPan').checked = registrationData[0].LIFlagPan;
            $('#txtLIPan').val(registrationData[0].LIPan);
            $('#txtLINameOnPAN').val(registrationData[0].LINameOnPAN);
            $('#txtLIRemark').val(registrationData[0].LIRemark);
            document.getElementById('chkLIFlagAadhar').checked = registrationData[0].LIFlagAadhar;
            $('#txtLIAadharNo').val(registrationData[0].LIAadharNo);
            $('#txtLINameOnAadharCard').val(registrationData[0].LINameOnAadharCard);
            document.getElementById('chkLIFlagVoterID').checked = registrationData[0].LIFlagVoterID;
            CheckLIFlagVoterID();
            $('#txtLIVoterIDNo').val(registrationData[0].LIVoterIDNo);
            document.getElementById('chkLIFlagPassport').checked = registrationData[0].LIFlagPassport;
            CheckLIFlagPassport();
            $('#txtLIPassportNo').val(registrationData[0].LIPassportNo);
            $('#txtLINameOnPassport').val(registrationData[0].LINameOnPassport);
            $('#txtLIPlaceOfIssue').val(registrationData[0].LIPlaceOfIssue);
            $('#txtLIPassportExpiryDate').val(ChangeDateFormatToddMMYYY(registrationData[0].LIPassportExpiryDate));
            document.getElementById('chkLIFlagDIN').checked = registrationData[0].LIFlagDIN;
            CheckLIFlagDIN();
            $('#txtLIDIN').val(registrationData[0].LIDIN);
            $('#txtLINameOnDIN').val(registrationData[0].LINameOnDIN);
            document.getElementById('chkLIFlagUAN').checked = registrationData[0].LIFlagUAN;
            CheckLIFlagUAN();
            $('#txtLIUAN').val(registrationData[0].LIUAN);
            $('#txtLINameOnUAN').val(registrationData[0].LINameOnUAN);
            document.getElementById('chkLIFlagPIOOCI').checked = registrationData[0].LIFlagPIOOCI;
            CheckLIFlagPIOOCI();
            $('#txtLIPIOOCI').val(registrationData[0].LIPIOOCI);
            $('#txtLINameOnPIOOCI').val(registrationData[0].LINameOnPIOOCI);
            document.getElementById('chkLIFlagDrivingLicense').checked = registrationData[0].LIFlagDrivingLicense;
            CheckLIFlagDrivingLicense();
            $('#txtLIDrivingLicenseNo').val(registrationData[0].LIDrivingLicenseNo);
            document.getElementById('chkLIFlagPTAD').checked = registrationData[0].LIFlagPTAD;
            CheckLIFlagPTAD();
            $('#txtLIAmount').val(registrationData[0].LIAmount);
            $('#ddlResidentialStatus').val(registrationData[0].ResidentialStatus).trigger('change');;
            $('#ddlBenefitsNameOfTheBank').val(registrationData[0].BenefitsNameOfTheBank).trigger('change');;
            $('#ddlBenefitsTypeOfBankAccount').val(registrationData[0].BenefitsTypeOfBankAccount).trigger('change');;
            $('#txtBenefitsNameOnAccount').val(registrationData[0].BenefitsNameOnAccount);
            $('#txtBenefitsBankAccountNo').val(registrationData[0].BenefitsBankAccountNo);
            $('#txtBenefitsBranchAddress').val(registrationData[0].BenefitsBranchAddress);
            $('#txtBenefitsIFSCode').val(registrationData[0].BenefitsIFSCode);
            $('#txtBenefitsSWIFTCode').val(registrationData[0].BenefitsSWIFTCode);
            $('#txtBenefitsOtherDetails').val(registrationData[0].BenefitsOtherDetails);
            $('#ddlReimbursementNameOfTheBank').val(registrationData[0].ReimbursementNameOfTheBank).trigger('change');;
            $('#ddlReimbursementTypeOfBankAccount').val(registrationData[0].ReimbursementTypeOfBankAccount).trigger('change');;
            $('#txtReimbursementNameOnAccount').val(registrationData[0].ReimbursementNameOnAccount);
            $('#txtReimbursementBankAccountNo').val(registrationData[0].ReimbursementBankAccountNo);
            $('#txtReimbursementBranchAddress').val(registrationData[0].ReimbursementBranchAddress);
            $('#txtReimbursementIFSCode').val(registrationData[0].ReimbursementIFSCode);
            $('#txtReimbursementSWIFTCode').val(registrationData[0].ReimbursementSWIFTCode);
            $('#txtReimbursementOtherDetails').val(registrationData[0].ReimbursementOtherDetails);
            $('#txtLEDEmployerName').val(registrationData[0].LEDEmployerName);
            $('#txtLEDDateOfJoining').val(ChangeDateFormatToddMMYYY(registrationData[0].LEDDateOfJoining));
            $('#txtLEDDateOfLeaving').val(ChangeDateFormatToddMMYYY(registrationData[0].LEDDateOfLeaving));
            $('#txtLEDTotalWorkExperience').val(registrationData[0].LEDTotalWorkExperience);
            $('#txtLEDLastAnnualCTC').val(registrationData[0].LEDLastAnnualCTC);
            $('#txtLEDDesignation').val(registrationData[0].LEDDesignation);
            $('#txtLEDLocation').val(registrationData[0].LEDLocation);
            $('#txtLEDTermofEmployment').val(registrationData[0].LEDTermofEmployment);
            $('#txtLEDInCaseOfGap').val(registrationData[0].LEDInCaseOfGap);
            $('#txtLEDAmountOfIncome').val(registrationData[0].LEDAmountOfIncome);
            $('#txtLEDAmountOfTDSDeducted').val(registrationData[0].LEDAmountOfTDSDeducted);
            $('#ddlSeatPreference').val(registrationData[0].SeatPreference);//.trigger('change');
            $('#ddlMealPreference').val(registrationData[0].MealPreference);//.trigger('change');
            $('#txtDetailOfWorSSN').val(registrationData[0].SSN);
            if (registrationData[0].CurrentFinancialYear == true) {
                $('#radCurrentfinancialyearYes')[0].checked = true
            }
            if (registrationData[0].CurrentFinancialYear == false) {
                $('#radCurrentfinancialyearNo')[0].checked = true
            }
        }
        if (airlineDetailsData.length > 0) {
            DocArray = airlineDetailsData;
            var dataArry = airlineDetailsData;
            $('#tblAirlineDetails').html('');
            var newtbblData1 = '<table id="tblRegistrationAirline" class="table table-striped m-0 " >' +
                ' <thead>' +
                ' <tr>' +
                ' <th class="td-50">S.No</th>' +
                ' <th class="td-150">Airline Name</th>' +
                ' <th class="td-150">Frequent Flyer Number</th>' +
                ' <th class="td-50 text-center">Action</th>' +
                ' </tr>' +
                ' </thead>';
            var html1 = "</table>";
            var tableData = "";
            for (let i = 0; i < dataArry.length; i++) {
                var newtbblData = "<tr><td>" + parseInt(i + 1) + "</td><td>" + dataArry[i].AirlineName + "</td><td>" + dataArry[i].FrequentFlyerNumber + "</td><td style='text-align: center;'><a class='HideClass'  title='Click to Remove' data-toggle='tooltip' data-original-title='Click to Remove' onclick='DeleteDocArrayRows(this," + dataArry[i].RowNum + ")'><i class='fas fa-window-close m-0 red-clr' aria-hidden='true'></i> </a> </td></tr>";
                var allstring = newtbblData;
                tableData += allstring;
            }
            $('#tblAirlineDetails').html(newtbblData1 + tableData + html1);
            HtmlPagingAirline();
        }
    });
}

function RedirectToAttachment() {
    var valid = true;
    if (checkValidationOnSubmit('Mandatory') == false) {
        valid = false;
    }
    if (checkValidationOnSubmit('Mandatorypld') == false) {
        valid = false;
    }
    if (valid == true) {
        var NoOfChildren = "";
        if ($('#ddlMaritalStatus').val() == 2) {
            NoOfChildren = $('#txtMarriedNoOfChildren2').val();
        }
        if ($('#ddlMaritalStatus').val() != 2 && $('#ddlMaritalStatus').val() != "") {
            NoOfChildren = $('#txtDivorcedNoOfChildren').val();
        }
        var RegistrationDetails = {
            RegID: '',
            CandidateId: CandidateId,
            FatherName: $('#txtFatherName').val(),
            MotherName: $('#txtMotherName').val(),
            Gender: $('#ddlGenderName').val(),
            DOB: ChangeDateFormat($('#txtDateofBirth').val()),
            MaritalStatus: $('#ddlMaritalStatus').val(),
            Nationality: $('#ddlNationality').val(),
            MarriedNoOfChildren: NoOfChildren,// $('#txtMarriedNoOfChildren').val(),
            SpousePartner: $('#ddlSpousePartner').val(),
            SpousesName: $('#txtSpousesName').val(),
            PartnersName: $('#txtPartnersName').val(),
            AnniversaryDate: ChangeDateFormat($('#txtAnniversaryDate').val()),
            DivorcedNoOfChildren: $('#txtDivorcedNoOfChildren').val(),
            Country: $('#ddlCountry').val(),
            DetailOfWorPermitVisa: $('#txtDetailOfWorPermitVisa').val(),
            ValidityDate: ChangeDateFormat($('#txtValidityDate').val()),
            AnyOtherDetails: $('#txtAnyOtherDetails').val(),
            LAAddressLine1: $('#txtLAAddressLine1').val(),
            LAAddressLine2: $('#txtLAAddressLine2').val(),
            LAPinCode: $('#txtLAPinCode').val(),
            LACountry: $('#ddlLACountry').val(),
            LAState: $('#ddlLAState').val(),
            LACity: $('#ddlLACity').val(),
            LAMobile: $('#txtLAMobile').val(),
            PAAddressLine1: $('#txtPAAddressLine1').val(),
            PAAddressLine2: $('#txtPAAddressLine2').val(),
            PAPinCode: $('#txtPAPinCode').val(),
            PACountry: $('#ddlPACountry').val(),
            PAState: $('#ddlPAState').val(),
            PACity: $('#ddlPACity').val(),
            PAPhoneNumber: $('#txtPAPhoneNumber').val(),
            PAAlternativePhoneNumber: $('#txtPAAlternativePhoneNumber').val(),
            PALandlineNo: $('#txtPALandlineNo').val(),
            PAPersonalEmailID: $('#txtPAPersonalEmailID').val(),
            SpecialAbility: $('#ddlSpecialAbility').val(),
            MDFormC3: $('#txtMDformC3').val(),
            MDConditionC3: $('#txtMDconditionC3').val(),
            MDHospitalPhysicianName: $('#txtMDHospitalPhysicianName').val(),
            MDPhoneNumber: $('#txtMDPhoneNumber').val(),
            MDAlternativeNumber: $('#txtMDAlternativeNumber').val(),
            BloodGroup: $('#ddlBloodGroup').val(),
            MDEmergencyContactName: $('#txtMDEmergencyContactName').val(),
            MDEmergencyContactRelationship: $('#txtMDEmergencyContactRelationship').val(),
            LIFlagPan: document.getElementById('chkLIFlagPan').checked,
            LIPan: $('#txtLIPan').val(),
            LINameOnPAN: $('#txtLINameOnPAN').val(),
            LIRemark: $('#txtLIRemark').val(),
            LIFlagAadhar: document.getElementById('chkLIFlagAadhar').checked,
            LIAadharNo: $('#txtLIAadharNo').val(),
            LINameOnAadharCard: $('#txtLINameOnAadharCard').val(),
            LIFlagVoterID: document.getElementById('chkLIFlagVoterID').checked,
            LIVoterIDNo: $('#txtLIVoterIDNo').val(),
            LIFlagPassport: document.getElementById('chkLIFlagPassport').checked,
            LIPassportNo: $('#txtLIPassportNo').val(),
            LINameOnPassport: $('#txtLINameOnPassport').val(),
            LIPlaceOfIssue: $('#txtLIPlaceOfIssue').val(),
            LIPassportExpiryDate: ChangeDateFormat($('#txtLIPassportExpiryDate').val()),
            LIFlagDIN: document.getElementById('chkLIFlagDIN').checked,
            LIDIN: $('#txtLIDIN').val(),
            LINameOnDIN: $('#txtLINameOnDIN').val(),
            LIFlagUAN: document.getElementById('chkLIFlagUAN').checked,
            LIUAN: $('#txtLIUAN').val(),
            LINameOnUAN: $('#txtLINameOnUAN').val(),
            LIFlagPIOOCI: document.getElementById('chkLIFlagPIOOCI').checked,
            LIPIOOCI: $('#txtLIPIOOCI').val(),
            LINameOnPIOOCI: $('#txtLINameOnPIOOCI').val(),
            LIFlagDrivingLicense: document.getElementById('chkLIFlagDrivingLicense').checked,
            LIDrivingLicenseNo: $('#txtLIDrivingLicenseNo').val(),
            LIFlagPTAD: document.getElementById('chkLIFlagPTAD').checked,
            LIAmount: $('#txtLIAmount').val(),
            ResidentialStatus: $('#ddlResidentialStatus').val(),
            BenefitsNameOfTheBank: $('#ddlBenefitsNameOfTheBank').val(),
            BenefitsTypeOfBankAccount: $('#ddlBenefitsTypeOfBankAccount').val(),
            BenefitsNameOnAccount: $('#txtBenefitsNameOnAccount').val(),
            BenefitsBankAccountNo: $('#txtBenefitsBankAccountNo').val(),
            BenefitsBranchAddress: $('#txtBenefitsBranchAddress').val(),
            BenefitsIFSCode: $('#txtBenefitsIFSCode').val(),
            BenefitsSWIFTCode: $('#txtBenefitsSWIFTCode').val(),
            BenefitsOtherDetails: $('#txtBenefitsOtherDetails').val(),
            ReimbursementNameOfTheBank: $('#ddlReimbursementNameOfTheBank').val(),
            ReimbursementTypeOfBankAccount: $('#ddlReimbursementTypeOfBankAccount').val(),
            ReimbursementNameOnAccount: $('#txtReimbursementNameOnAccount').val(),
            ReimbursementBankAccountNo: $('#txtReimbursementBankAccountNo').val(),
            ReimbursementBranchAddress: $('#txtReimbursementBranchAddress').val(),
            ReimbursementIFSCode: $('#txtReimbursementIFSCode').val(),
            ReimbursementSWIFTCode: $('#txtReimbursementSWIFTCode').val(),
            ReimbursementOtherDetails: $('#txtReimbursementOtherDetails').val(),
            LEDEmployerName: $('#txtLEDEmployerName').val(),
            LEDDateOfJoining: ChangeDateFormat($('#txtLEDDateOfJoining').val()),
            LEDDateOfLeaving: ChangeDateFormat($('#txtLEDDateOfLeaving').val()),
            LEDTotalWorkExperience: $('#txtLEDTotalWorkExperience').val(),
            LEDLastAnnualCTC: $('#txtLEDLastAnnualCTC').val(),
            LEDDesignation: $('#txtLEDDesignation').val(),
            LEDLocation: $('#txtLEDLocation').val(),
            LEDTermofEmployment: $('#txtLEDTermofEmployment').val(),
            LEDInCaseOfGap: $('#txtLEDInCaseOfGap').val(),
            LEDAmountOfIncome: $('#txtLEDAmountOfIncome').val(),
            LEDAmountOfTDSDeducted: $('#txtLEDAmountOfTDSDeducted').val(),
            SeatPreference: $('#ddlSeatPreference').val(),
            MealPreference: $('#ddlMealPreference').val(),
            CreatedBy: loggedinUserid,
            ModifiedBy: loggedinUserid,
            IPAddress: IPAddress,
            SSN: $('#txtDetailOfWorSSN').val(),
            CurrentFinancialYear: $('#radCurrentfinancialyearYes')[0].checked == true ? true : false
        };

        var obj = {
            RegistrationModel: RegistrationDetails,
            AirlineDetailsModel: DocArray
        }
        CommonAjaxMethod(virtualPath + 'OnboardingRequest/SaveRegistrationData', obj, 'POST', function (response) {
            FailToaster(response.SuccessMessage);
            window.location.href = virtualPath + 'UserProcess/Attachments';
        });
    }
}
function ChangesNationality() {
    if ($('#ddlNationality').val() == 2) {
        $('#ddlCountry').attr({ 'class': 'form-control dpselect select2-hidden-accessible Mandatorypld ' });
        $('#txtDetailOfWorPermitVisa').attr({ 'class': 'form-control Mandatory ' });
        $('#txtValidityDate').attr({ 'class': 'form-control datepicker OfferIssued Mandatory ' });
        $('#txtDetailOfWorSSN').attr({ 'class': 'form-control Mandatory ' });

        $('#spnddlCountry').attr({ 'className': 'red-clr' }).html('*');
        $('#spnDetailOfWorPermitVisa').attr({ 'className': 'red-clr' }).html('*');
        $('#spnValidityDate').attr({ 'className': 'red-clr' }).html('*');
        $('#spnDetailOfWorSSN').attr({ 'className': 'red-clr' }).html('*');
    }
    else {
        $('#ddlCountry').attr({ 'class': 'form-control dpselect select2-hidden-accessible ' });
        $('#txtDetailOfWorPermitVisa').attr({ 'class': 'form-control ' });
        $('#txtValidityDate').attr({ 'class': 'form-control datepicker OfferIssued ' });
        $('#txtDetailOfWorSSN').attr({ 'class': 'form-control ' });

        $('#spnddlCountry').attr({ 'className': 'red-clr' }).html('');
        $('#spnDetailOfWorPermitVisa').attr({ 'className': 'red-clr' }).html('');
        $('#spnValidityDate').attr({ 'className': 'red-clr' }).html('');
        $('#spnDetailOfWorSSN').attr({ 'className': 'red-clr' }).html('');
    }
}
function SaveRegistrationDetails() {
    //var valid = true;
    //if (checkValidationOnSubmit('Mandatory') == false) {
    //    valid = false;
    //}
    //if (checkValidationOnSubmit('Mandatorypld') == false) {
    //    valid = false;
    //}
    //if (valid == true) {
        var NoOfChildren = "";
        if ($('#ddlMaritalStatus').val() == 2) {
            NoOfChildren = $('#txtMarriedNoOfChildren2').val();
        }
        if ($('#ddlMaritalStatus').val() != 2 && $('#ddlMaritalStatus').val() != "") {
            NoOfChildren = $('#txtDivorcedNoOfChildren').val();
        }
        var RegistrationDetails = {
            RegID: '',
            CandidateId: CandidateId,
            FatherName: $('#txtFatherName').val(),
            MotherName: $('#txtMotherName').val(),
            Gender: $('#ddlGenderName').val() == 'Select' ? 0 : $('#ddlGenderName').val() ,
            DOB: ChangeDateFormat($('#txtDateofBirth').val()),
            MaritalStatus: $('#ddlMaritalStatus').val(),
            Nationality: $('#ddlNationality').val() == 'Select' ? 0 : $('#ddlNationality').val() ,
            MarriedNoOfChildren: NoOfChildren,//$('#txtMarriedNoOfChildren').val(),
            SpousePartner: $('#ddlSpousePartner').val() == 'Select' ? 0 : $('#ddlSpousePartner').val() ,
            SpousesName: $('#txtSpousesName').val(),
            PartnersName: $('#txtPartnersName').val(),
            AnniversaryDate: ChangeDateFormat($('#txtAnniversaryDate').val()),
            DivorcedNoOfChildren: $('#txtDivorcedNoOfChildren').val(),
            Country: $('#ddlCountry').val() == 'Select' ? 0 : $('#ddlCountry').val(),
            DetailOfWorPermitVisa: $('#txtDetailOfWorPermitVisa').val(),
            ValidityDate: ChangeDateFormat($('#txtValidityDate').val()),
            AnyOtherDetails: $('#txtAnyOtherDetails').val(),
            LAAddressLine1: $('#txtLAAddressLine1').val(),
            LAAddressLine2: $('#txtLAAddressLine2').val(),
            LAPinCode: $('#txtLAPinCode').val(),
            LACountry: $('#ddlLACountry').val(),
            LAState: $('#ddlLAState').val() == 'Select' ? 0 : $('#ddlLAState').val(),
            LACity: $('#ddlLACity').val() == 'Select' ? 0 : $('#ddlLACity').val(),
            LAMobile: $('#txtLAMobile').val(),
            PAAddressLine1: $('#txtPAAddressLine1').val(),
            PAAddressLine2: $('#txtPAAddressLine2').val(),
            PAPinCode: $('#txtPAPinCode').val(),
            PACountry: $('#ddlPACountry').val() == 'Select' ? 0 : $('#ddlPACountry').val(),
            PAState: $('#ddlPAState').val(),
            PACity: $('#ddlPACity').val() == 'Select' ? 0 : $('#ddlPACity').val() ,
            PAPhoneNumber: $('#txtPAPhoneNumber').val(),
            PAAlternativePhoneNumber: $('#txtPAAlternativePhoneNumber').val(),
            PALandlineNo: $('#txtPALandlineNo').val(),
            PAPersonalEmailID: $('#txtPAPersonalEmailID').val(),
            SpecialAbility: $('#ddlSpecialAbility').val(),
            MDFormC3: $('#txtMDformC3').val(),
            MDConditionC3: $('#txtMDconditionC3').val(),
            MDHospitalPhysicianName: $('#txtMDHospitalPhysicianName').val(),
            MDPhoneNumber: $('#txtMDPhoneNumber').val(),
            MDAlternativeNumber: $('#txtMDAlternativeNumber').val(),
            BloodGroup: $('#ddlBloodGroup').val() == 'Select' ? 0 : $('#ddlBloodGroup').val(),
            MDEmergencyContactName: $('#txtMDEmergencyContactName').val(),
            MDEmergencyContactRelationship: $('#txtMDEmergencyContactRelationship').val(),
            LIFlagPan: document.getElementById('chkLIFlagPan').checked,
            LIPan: $('#txtLIPan').val(),
            LINameOnPAN: $('#txtLINameOnPAN').val(),
            LIRemark: $('#txtLIRemark').val(),
            LIFlagAadhar: document.getElementById('chkLIFlagAadhar').checked,
            LIAadharNo: $('#txtLIAadharNo').val(),
            LINameOnAadharCard: $('#txtLINameOnAadharCard').val(),
            LIFlagVoterID: document.getElementById('chkLIFlagVoterID').checked,
            LIVoterIDNo: $('#txtLIVoterIDNo').val(),
            LIFlagPassport: document.getElementById('chkLIFlagPassport').checked,
            LIPassportNo: $('#txtLIPassportNo').val(),
            LINameOnPassport: $('#txtLINameOnPassport').val(),
            LIPlaceOfIssue: $('#txtLIPlaceOfIssue').val(),
            LIPassportExpiryDate: ChangeDateFormat($('#txtLIPassportExpiryDate').val()),
            LIFlagDIN: document.getElementById('chkLIFlagDIN').checked,
            LIDIN: $('#txtLIDIN').val(),
            LINameOnDIN: $('#txtLINameOnDIN').val(),
            LIFlagUAN: document.getElementById('chkLIFlagUAN').checked,
            LIUAN: $('#txtLIUAN').val(),
            LINameOnUAN: $('#txtLINameOnUAN').val(),
            LIFlagPIOOCI: document.getElementById('chkLIFlagPIOOCI').checked,
            LIPIOOCI: $('#txtLIPIOOCI').val(),
            LINameOnPIOOCI: $('#txtLINameOnPIOOCI').val(),
            LIFlagDrivingLicense: document.getElementById('chkLIFlagDrivingLicense').checked,
            LIDrivingLicenseNo: $('#txtLIDrivingLicenseNo').val(),
            LIFlagPTAD: $('#chkLIFlagPTAD').val(),
            LIAmount: $('#txtLIAmount').val(),
            ResidentialStatus: $('#ddlResidentialStatus').val() == 'Select' ? 0 : $('#ddlResidentialStatus').val() ,
            BenefitsNameOfTheBank: $('#ddlBenefitsNameOfTheBank').val() == 'Select' ? 0 : $('#ddlBenefitsNameOfTheBank').val(),
            BenefitsTypeOfBankAccount: $('#ddlBenefitsTypeOfBankAccount').val() == 'Select' ? 0 : $('#ddlBenefitsTypeOfBankAccount').val() ,
            BenefitsNameOnAccount: $('#txtBenefitsNameOnAccount').val(),
            BenefitsBankAccountNo: $('#txtBenefitsBankAccountNo').val(),
            BenefitsBranchAddress: $('#txtBenefitsBranchAddress').val(),
            BenefitsIFSCode: $('#txtBenefitsIFSCode').val(),
            BenefitsSWIFTCode: $('#txtBenefitsSWIFTCode').val(),
            BenefitsOtherDetails: $('#txtBenefitsOtherDetails').val(),
            ReimbursementNameOfTheBank: $('#ddlReimbursementNameOfTheBank').val() == 'Select' ? 0 : $('#ddlReimbursementNameOfTheBank').val() ,
            ReimbursementTypeOfBankAccount: $('#ddlReimbursementTypeOfBankAccount').val() == 'Select' ? 0 : $('#ddlReimbursementTypeOfBankAccount').val(),
            ReimbursementNameOnAccount: $('#txtReimbursementNameOnAccount').val(),
            ReimbursementBankAccountNo: $('#txtReimbursementBankAccountNo').val(),
            ReimbursementBranchAddress: $('#txtReimbursementBranchAddress').val(),
            ReimbursementIFSCode: $('#txtReimbursementIFSCode').val(),
            ReimbursementSWIFTCode: $('#txtReimbursementSWIFTCode').val(),
            ReimbursementOtherDetails: $('#txtReimbursementOtherDetails').val(),
            LEDEmployerName: $('#txtLEDEmployerName').val(),
            LEDDateOfJoining: ChangeDateFormat($('#txtLEDDateOfJoining').val()),
            LEDDateOfLeaving: ChangeDateFormat($('#txtLEDDateOfLeaving').val()),
            LEDTotalWorkExperience: $('#txtLEDTotalWorkExperience').val(),
            LEDLastAnnualCTC: $('#txtLEDLastAnnualCTC').val(),
            LEDDesignation: $('#txtLEDDesignation').val(),
            LEDLocation: $('#txtLEDLocation').val(),
            LEDTermofEmployment: $('#txtLEDTermofEmployment').val(),
            LEDInCaseOfGap: $('#txtLEDInCaseOfGap').val(),
            LEDAmountOfIncome: $('#txtLEDAmountOfIncome').val(),
            LEDAmountOfTDSDeducted: $('#txtLEDAmountOfTDSDeducted').val(),
            SeatPreference: $('#ddlSeatPreference').val() == 'Select' ? 0 : $('#ddlSeatPreference').val() ,
            MealPreference: $('#ddlMealPreference').val() == 'Select' ? 0 : $('#ddlMealPreference').val() ,
            CreatedBy: loggedinUserid,
            ModifiedBy: loggedinUserid,
            IPAddress: IPAddress,
            SSN: $('#txtDetailOfWorSSN').val(),
            CurrentFinancialYear: $('#radCurrentfinancialyearYes')[0].checked == true ? true : false
        }
        var obj = {
            RegistrationModel: RegistrationDetails,
            AirlineDetailsModel: DocArray
        }

        CommonAjaxMethod(virtualPath + 'OnboardingRequest/SaveRegistrationData', obj, 'POST', function (response) {
            FailToaster(response.SuccessMessage);
            //window.location.href = virtualPath + 'UserProcess/Attachments';
            window.location.reload();
        });
    //}
}
function CheckClickLIFlagPan() {
    document.getElementById('chkLIFlagPan').checked = true;
}
function CheckClickLIFlagAadhar() {
    document.getElementById('chkLIFlagAadhar').checked = true;
}
function CheckLIFlagVoterID() {
    if (document.getElementById('chkLIFlagVoterID').checked == true) {
        $("#txtLIVoterIDNo").attr("disabled", false);
    }
    else {
        $("#txtLIVoterIDNo").attr("disabled", true);
        $('#txtLIVoterIDNo').val(''); 
    }
}
function CheckLIFlagPassport() {
    if (document.getElementById('chkLIFlagPassport').checked == true) {
        $("#txtLIPassportNo").attr("disabled", false);
        $("#txtLINameOnPassport").attr("disabled", false);
        $("#txtLIPlaceOfIssue").attr("disabled", false);
        $("#txtLIPassportExpiryDate").attr("disabled", false);
    }
    else {
        $("#txtLIPassportNo").attr("disabled", true);
        $("#txtLINameOnPassport").attr("disabled", true);
        $("#txtLIPlaceOfIssue").attr("disabled", true);
        $("#txtLIPassportExpiryDate").attr("disabled", true);
        $('#txtLIPassportNo').val('');
        $('#txtLINameOnPassport').val('');
        $('#txtLIPlaceOfIssue').val('');
        $('#txtLIPassportExpiryDate').val('');
    }
}
function CheckLIFlagDIN() {
    if (document.getElementById('chkLIFlagDIN').checked == true) {
        $("#txtLIDIN").attr("disabled", false);
        $("#txtLINameOnDIN").attr("disabled", false);
    }
    else {
        $("#txtLIDIN").attr("disabled", true);
        $("#txtLINameOnDIN").attr("disabled", true);
        $('#txtLIDIN').val('');
        $('#txtLINameOnDIN').val('');   
    }
}
function CheckLIFlagUAN() {
    if (document.getElementById('chkLIFlagUAN').checked == true) {
        $("#txtLIUAN").attr("disabled", false);
        $("#txtLINameOnUAN").attr("disabled", false);
    }
    else {
        $("#txtLIUAN").attr("disabled", true);
        $("#txtLINameOnUAN").attr("disabled", true);
        $('#txtLIUAN').val('');
        $('#txtLINameOnUAN').val('');       
    }
}
function CheckLIFlagPTAD() {
    if (document.getElementById('chkLIFlagPTAD').checked == true) {
        $("#txtLIAmount").attr("disabled", false);
    }
    else {
        $("#txtLIAmount").attr("disabled", true);
        $("#txtLIAmount").val('');
    }
}
function CheckLIFlagDrivingLicense() {
    if (document.getElementById('chkLIFlagDrivingLicense').checked == true) {
        $("#txtLIDrivingLicenseNo").attr("disabled", false);
    }
    else {
        $("#txtLIDrivingLicenseNo").attr("disabled", true);
        $('#txtLIDrivingLicenseNo').val('');
    }
}
function CheckLIFlagPIOOCI() {
    if (document.getElementById('chkLIFlagPIOOCI').checked == true) {
        $("#txtLIPIOOCI").attr("disabled", false);
        $("#txtLINameOnPIOOCI").attr("disabled", false);
    }
    else {
        $("#txtLIPIOOCI").attr("disabled", true);
        $("#txtLINameOnPIOOCI").attr("disabled", true);
        $('#txtLIPIOOCI').val('');
        $('#txtLINameOnPIOOCI').val('');       
    }
}
function ChangeLACountry() {
    var val = $('#ddlLACountry').val();
    LoadMasterDropdown('ddlLAState', {
        ParentId: $('#ddlLACountry').val(),
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 22,
        manualTableId: 0
    }, 'Select', false);
}
function ChangePACountry() {
    var val = $('#ddlPACountry').val();
    LoadMasterDropdown('ddlPAState', {
        ParentId: $('#ddlPACountry').val(),
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 22,
        manualTableId: 0
    }, 'Select', false);
}
function ChangeLACity() {
    var val = $('#ddlLAState').val();
    LoadMasterDropdown('ddlLACity', {
        ParentId: $('#ddlLAState').val(),
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 30,
        manualTableId: 0
    }, 'Select', false);
}
function ChangePACity() {
    var val = $('#ddlPAState').val();
    LoadMasterDropdown('ddlPACity', {
        ParentId: $('#ddlPAState').val(),
        masterTableType: 0,
        isMasterTableType: false,
        isManualTable: true,
        manualTable: 30,
        manualTableId: 0
    }, 'Select', false);
}
function AddAirlineDetails() {
    var valid = true;
    if (checkValidationOnSubmit('AddRowMandatory') == false) {
        valid = false;
    }

    if (valid == true) {
        DocArrayId = DocArray.length + 1;
        var loop = DocArrayId;
        var objarrayinner =
        {
            RowNum: loop,
            CandidateId: CandidateId,
            AirlineName: $('#txtAirlineName').val(),
            FrequentFlyerNumber: $('#txtFrequentFlyerNumber').val(),
            CreatedBy: loggedinUserid,
            ModifiedBy: loggedinUserid,
            IPAddress: IPAddress,
            AirlineID: 0
        }

        DocArray.push(objarrayinner);
        var dataArry = DocArray;
        $('#tblAirlineDetails').html('');
        var newtbblData1 = '<table id="tblRegistrationAirline" class="table table-striped m-0 " >' +
            ' <thead>' +
            ' <tr>' +
            ' <th class="td-50">S.No</th>' +
            ' <th class="td-150">Airline Name</th>' +
            ' <th class="td-150">Frequent Flyer Number</th>' +
            ' <th class="td-50 text-center">Action</th>' +
            ' </tr>' +
            ' </thead>';
        var html1 = "</table>";
        var tableData = "";
        for (let i = 0; i < dataArry.length; i++) {
            var newtbblData = "<tr><td>" + parseInt(i + 1) + "</td><td>" + dataArry[i].AirlineName + "</td><td>" + dataArry[i].FrequentFlyerNumber + "</td><td style='text-align: center;'><a class='HideClass'  title='Click to Remove' data-toggle='tooltip' data-original-title='Click to Remove' onclick='DeleteDocArrayRows(this," + dataArry[i].RowNum + ")'><i class='fas fa-window-close m-0 red-clr' aria-hidden='true'></i> </a> </td></tr>";
            var allstring = newtbblData;
            tableData += allstring;
        }
        $('#tblAirlineDetails').html(newtbblData1 + tableData + html1);
        $('#txtAirlineName').val("")
        $('#txtFrequentFlyerNumber').val(""); 
        HtmlPagingAirline();
    }    
}
function DeleteDocArrayRows(obj, id) {
    ConfirmMsgBox("Are you sure want to delete", '', function () {
        var data = DocArray.filter(function (itemParent) { return (itemParent.RowNum == id); });
        if (data[0].AirlineID > 0) {
            CommonAjaxMethod(virtualPath + 'OnboardingRequest/DeleteListRecordNotes', { Id: data[0].AirlineID, inputData: 4 }, 'POST', function (response) {
                $(obj).closest('tr').remove();
                DocArray = DocArray.filter(function (itemParent) { return (itemParent.RowNum != id); });
            });
        }
        else {
            $(obj).closest('tr').remove();
            DocArray = DocArray.filter(function (itemParent) { return (itemParent.RowNum != id); });
            AfterDeleteRebindHTMLTable();
        }
    })
}
function CkeckReimbursement() {
    if (document.getElementById('chkReimbursement').checked == true) {
        $('#ddlReimbursementNameOfTheBank').val($('#ddlBenefitsNameOfTheBank').val()).trigger('change');
        $('#ddlReimbursementTypeOfBankAccount').val($('#ddlBenefitsTypeOfBankAccount').val()).trigger('change');
        $('#txtReimbursementNameOnAccount').val($('#txtBenefitsNameOnAccount').val());
        $('#txtReimbursementBankAccountNo').val($('#txtBenefitsBankAccountNo').val());
        $('#txtReimbursementBranchAddress').val($('#txtBenefitsBranchAddress').val());
        $('#txtReimbursementIFSCode').val($('#txtBenefitsIFSCode').val());
        $('#txtReimbursementSWIFTCode').val($('#txtBenefitsSWIFTCode').val());
        $('#txtReimbursementOtherDetails').val($('#txtBenefitsOtherDetails').val());
    }
}
function CkeckSameAsPermanentAddress() {
    if (document.getElementById('chkSameAsPermanentAddress').checked == true) {
        $('#txtPAAddressLine1').val($('#txtLAAddressLine1').val());
        $('#txtPAAddressLine2').val($('#txtLAAddressLine2').val());
        $('#txtPAPinCode').val($('#txtLAPinCode').val());
        $('#ddlPACountry').val($('#ddlLACountry').val()).trigger('change');
        $('#ddlPAState').val($('#ddlLAState').val()).trigger('change');
        $('#ddlPACity').val($('#ddlLACity').val()).trigger('change');
        $('#txtPAPhoneNumber').val($('#txtLAMobile').val());
        //$('#txtPAAlternativePhoneNumber').val($('#txtBenefitsSWIFTCode').val());
        //$('#txtPALandlineNo').val($('#txtBenefitsOtherDetails').val());
        //$('#txtPAPersonalEmailID').val($('#txtBenefitsOtherDetails').val());
    }
}
function ChangeMaritalStatus() {
    //$('#txtMarriedNoOfChildren2').val('');
    //$('#txtDivorcedNoOfChildren').val('');

    if ($('#ddlMaritalStatus').val() == 1) {
        document.getElementById('divMarried').style.display = 'none';
        document.getElementById('divDivorced').style.display = 'none';
    }
    if ($('#ddlMaritalStatus').val() == 2) {
        document.getElementById('divMarried').style.display = 'block';
        document.getElementById('divDivorced').style.display = 'none';
    }
    if ($('#ddlMaritalStatus').val() == 3) {
        document.getElementById('divMarried').style.display = 'none';
        document.getElementById('divDivorced').style.display = 'block';
    }
    if ($('#ddlMaritalStatus').val() == 4) {
        document.getElementById('divMarried').style.display = 'none';
        document.getElementById('divDivorced').style.display = 'none';
    }
    if ($('#ddlMaritalStatus').val() == 5) {
        document.getElementById('divMarried').style.display = 'none';
        document.getElementById('divDivorced').style.display = 'block';
    }
    if ($('#ddlMaritalStatus').val() == 6) {
        document.getElementById('divMarried').style.display = 'none';
        document.getElementById('divDivorced').style.display = 'block';
    }
}
function HtmlPagingAirline() {
    $('#tblRegistrationAirline').after('<div id="divRegistrationAirlinePaging" style="text-align:right"></div>');
    var rowsShown = 5;
    var rowsTotal = $('#tblRegistrationAirline tbody tr').length;
    var numPages = rowsTotal / rowsShown;
    for (i = 0; i < numPages; i++) {
        var pageNum = i + 1;
        $('#divRegistrationAirlinePaging').append('<a class="e-link e-numericitem e-spacing e-currentitem e-active" href="#" rel="' + i + '">' + pageNum + '</a> ');
    }
    $('#tblRegistrationAirline tbody tr').hide();
    $('#tblRegistrationAirline tbody tr').slice(0, rowsShown).show();
    $('#divRegistrationAirlinePaging a:first').addClass('active');
    $('#divRegistrationAirlinePaging a').bind('click', function () {
        $('#divRegistrationAirlinePaging a').removeClass('active');
        $(this).addClass('active');
        var currPage = $(this).attr('rel');
        var startItem = currPage * rowsShown;
        var endItem = startItem + rowsShown;
        $('#tblRegistrationAirline tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
            css('display', 'table-row').animate({ opacity: 1 }, 300);
    });
}
function AfterDeleteRebindHTMLTable() {
    dataArry = DocArray;
    $('#tblAirlineDetails').html('');
    var newtbblData1 = '<table id="tblRegistrationAirline" class="table table-striped m-0 " >' +
        ' <thead>' +
        ' <tr>' +
        ' <th width="33">S.No</th>' +
        ' <th >Airline Name</th>' +
        ' <th >Frequent Flyer Number</th>' +
        ' <th width="33" class="text-center">Action</th>' +
        ' </tr>' +
        ' </thead>';
    var html1 = "</table>";
    var tableData = "";
    for (let i = 0; i < dataArry.length; i++) {
        var newtbblData = "<tr><td>" + parseInt(i + 1) + "</td><td>" + dataArry[i].AirlineName + "</td><td>" + dataArry[i].FrequentFlyerNumber + "</td><td style='text-align: center;' class='text-center' ><a class='HideClass'  title='Click to Remove' data-toggle='tooltip' data-original-title='Click to Remove' onclick='DeleteDocArrayRows(this," + dataArry[i].RowNum + ")'><i class='fas fa-window-close m-0 red-clr' aria-hidden='true'></i> </a> </td></tr>";
        var allstring = newtbblData;
        tableData += allstring;
    }
    $('#tblAirlineDetails').html(newtbblData1 + tableData + html1);
    HtmlPagingAirline();
}