using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace SahajFramework.CommonClass
{
    public class PasswordPolicy: ValidationAttribute
    {
        private static int Minimum_Length = 16;
        private static int Upper_Case_length = 1;
        private static int Lower_Case_length = 1;
        private static int NonAlpha_length = 1;
        //private static int Numeric_length = 1;

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            string Password = value as string;
            if (!string.IsNullOrEmpty(Password))
            {
                if (Password.Length < Minimum_Length)
                    return new ValidationResult("Minimum password length should be at least a value of 15");
                if (UpperCaseCount(Password) < Upper_Case_length)
                    return new ValidationResult("password should have At least one upper case English letter");
                if (LowerCaseCount(Password) < Lower_Case_length)
                    return new ValidationResult("password should have At least one lower case English letter");
                if (NumericCount(Password) < 1)
                    return new ValidationResult("password should have At least one digit");
                if (NonAlphaCount(Password) < NonAlpha_length)
                    return new ValidationResult("password should have At least one special character");
                return ValidationResult.Success;
            }
            else
            {
                return new ValidationResult("" + validationContext.DisplayName + " is required");
            }

        }

        private static int UpperCaseCount(string Password)
        {
            return Regex.Matches(Password, "[A-Z]").Count;
        }

        private static int LowerCaseCount(string Password)
        {
            return Regex.Matches(Password, "[a-z]").Count;
        }
        private static int NumericCount(string Password)
        {
            return Regex.Matches(Password, "[0-9]").Count;
        }
        private static int NonAlphaCount(string Password)
        {
            return Regex.Matches(Password, @"[^0-9a-zA-Z\._]").Count;
        }


        public static string CustomPasswordValidate(string Password)
        {

            if (!string.IsNullOrEmpty(Password))
            {
                if (Password.Length < Minimum_Length)
                    return "Minimum password length should be at least a value of 15";
                if (UpperCaseCount(Password) < Upper_Case_length)
                    return "password should have At least one upper case English letter";

                if (LowerCaseCount(Password) < Lower_Case_length)
                    return "password should have At least one lower case English letter";

                if (NumericCount(Password) < 1)
                    return "password should have At least one digit";

                if (NonAlphaCount(Password) < NonAlpha_length)
                    return "password should have At least one special character";
                else
                    return "";

            }
            else
            {
                return "NO";
            }


        }
    }
}