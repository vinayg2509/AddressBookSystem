// File: src/utils/ContactInputHelper.ts

import { IOUtils } from "./IOUtils";
import { Validator } from "./Validator";
import { ContactPerson } from "../model/ContactPerson";

export class ContactInputHelper {
  // Used when creating a new contact
  static getValidatedContact(): ContactPerson {
    const firstName = this.promptValid("Enter First Name: ", Validator.isNameValid, 
      "❌ Invalid. First Name must start with a capital and be at least 3 characters: ");
    
    const lastName = this.promptValid("Enter Last Name: ", Validator.isNameValid, 
      "❌ Invalid. Last Name must start with a capital and be at least 3 characters: ");
    
    const address = this.promptValid("Enter Address: ", Validator.isAddressValid, 
      "❌ Invalid Address. Must be at least 3 characters and contain only letters, numbers, spaces, and # , / . -");
    
    const city = this.promptValid("Enter City: ", Validator.isCityOrStateValid, 
      "❌ Invalid City. Must be at least 3 characters and contain only letters, spaces, and optionally -, . or /");
    
    const state = this.promptValid("Enter State: ", Validator.isCityOrStateValid, 
      "❌ Invalid State. Must be at least 3 characters and contain only letters, spaces, and optionally -, . or /");

    const zipcode = this.promptValidNumber("Enter Zipcode: ", Validator.isZipcodeValid, 
      "❌ Invalid Zipcode. Must be exactly 6 digits.");

    const phoneNumber = this.promptValid("Enter Phone Number: ", Validator.isPhoneNumberValid, 
      "❌ Invalid Phone Number. Must be 10 digits starting with 0-9.");

    const email = this.promptValid("Enter Email: ", Validator.isEmailValid, 
      "❌ Invalid Email format.");

    return new ContactPerson(firstName, lastName, address, city, state, zipcode, phoneNumber, email);
  }

  // Used for updating an existing contact
  static updateContactFields(contact: ContactPerson): void {
    contact.lastName = this.promptValid("Enter Last Name: ", Validator.isNameValid, 
      "❌ Invalid. Last Name must start with a capital and be at least 3 characters: ");

    contact.address = this.promptValid("Enter Address: ", Validator.isAddressValid, 
      "❌ Invalid Address. Must be at least 3 characters and contain only letters, numbers, spaces, and # , / . -");

    contact.city = this.promptValid("Enter City: ", Validator.isCityOrStateValid, 
      "❌ Invalid City. Must be at least 3 characters and contain only letters, spaces, and optionally -, . or /");

    contact.state = this.promptValid("Enter State: ", Validator.isCityOrStateValid, 
      "❌ Invalid State. Must be at least 3 characters and contain only letters, spaces, and optionally -, . or /");

    contact.zipcode = this.promptValidNumber("Enter Zipcode: ", Validator.isZipcodeValid, 
      "❌ Invalid Zipcode. Must be exactly 6 digits.");

    contact.phoneNumber = this.promptValid("Enter Phone Number: ", Validator.isPhoneNumberValid, 
      "❌ Invalid Phone Number. Must be 10 digits starting with 0-9.");

    contact.email = this.promptValid("Enter Email: ", Validator.isEmailValid, 
      "❌ Invalid Email format.");
  }

  // Prompt string input and validate with provided function
  private static promptValid(
    message: string,
    validatorFn: (input: string) => boolean,
    errorMsg: string
  ): string {
    let input = IOUtils.prompt(message);
    while (!validatorFn(input)) {
      input = IOUtils.prompt(errorMsg);
    }
    return input;
  }

  // Prompt numeric input and validate
  private static promptValidNumber(
    message: string,
    validatorFn: (num: number) => boolean,
    errorMsg: string
  ): number {
    let num = parseInt(IOUtils.prompt(message));
    while (!validatorFn(num)) {
      num = parseInt(IOUtils.prompt(errorMsg));
    }
    return num;
  }
}
