// File: src/model/ContactPerson.ts

import { ContactInputHelper } from "../utils/ContactInputHelper";
import { IOUtils } from "../utils/IOUtils";

// Represents an individual contact in the address book
export class ContactPerson {
  constructor(
    public firstName:   string,
    public lastName:    string,
    public address:     string,
    public city:        string,
    public state:       string,
    public zipcode:     number,
    public phoneNumber: string,
    public email:       string
  ) {}

  /**
   * Allows the user to update contact details interactively.
   */
  
  updateDetails(): void {
    ContactInputHelper.updateContactFields(this);
  }

  /**
   * Returns a formatted string with contact details.
   */
  toString(): string {
    return `${this.firstName} ${this.lastName}, ${this.address}, ${this.city}, ${this.state}, ${this.zipcode}, ${this.phoneNumber}, ${this.email}`;
  }

  /**
   * Returns the full name of the contact (used for duplicate checks).
   */
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

