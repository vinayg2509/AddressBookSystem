// File: src/utils/ContactInputHelper.ts

import { ContactPerson } from "../model/ContactPerson";
import { IOUtils } from "./IOUtils";
import { Validator } from "./Validator";

export class ContactInputHelper {
  static getValidatedContact(): ContactPerson | null {
    
    const firstName = Validator.promptAndValidate(
      "Enter First Name: ",
      Validator.isNameValid,
      "❌ Invalid First Name (Start with capital, min 3 letters)"
    );
    if (!firstName) return null;

    const lastName = Validator.promptAndValidate(
      "Enter Last Name: ",
      Validator.isNameValid,
      "❌ Invalid Last Name"
    );
    if (!lastName) return null;

    const address = Validator.promptAndValidate(
      "Enter Address: ",
      Validator.isAddressValid,
      "❌ Invalid Address (Min 3 chars, # ,/ and ,valid symbols allowed)"
    );
    if (!address) return null;

    const city = Validator.promptAndValidate(
      "Enter City: ",
      Validator.isNameValid,
      "❌ Invalid City"
    );
    if (!city) return null;

    const state = Validator.promptAndValidate(
      "Enter State: ",
      Validator.isNameValid,
      "❌ Invalid State"
    );
    if (!state) return null;

    const zipStr = Validator.promptAndValidate(
      "Enter Zipcode: ",
      Validator.isZipValid,
      "❌ Invalid Zipcode (Must be 6 digits)"
    );
    if (!zipStr) return null;
    const zip = parseInt(zipStr);

    const phone = Validator.promptAndValidate(
      "Enter Phone Number: ",
      Validator.isPhoneNumberValid,
      "❌ Invalid Phone Number (10 digits only with +91 )"
    );
    if (!phone) return null;

    const email = Validator.promptAndValidate(
      "Enter Email: ",
      Validator.isEmailValid,
      "❌ Invalid Email"
    );
    if (!email) return null;

    return new ContactPerson(firstName, lastName, address, city, state, zip, phone, email);
  }

   static promptAndValidateOptional(
    message: string,
    validator: (input: string) => boolean,
    defaultValue: string
  ): string {
    while (true) {
      const input = IOUtils.prompt(message).trim();
      if (input === "") return defaultValue;
      if (validator(input)) return input;
      IOUtils.log("❌ Invalid input. Please try again.", false);
    }
  } // Validation wrappers using Validator
  static validateName(input: string): boolean {
    return Validator.isNameValid(input);
  }
  static validateAddress(input: string): boolean {
    return Validator.isAddressValid(input);
  }
  static validateZip(input: string): boolean {
    return Validator.isZipValid(input);
  }
  static validatePhoneNumber(input: string): boolean {
    return Validator.isPhoneNumberValid(input);
  }
  static validateEmail(input: string): boolean {
    return Validator.isEmailValid(input);
  }
}
