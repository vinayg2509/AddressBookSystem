// File: src/model/ContactPerson.ts

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
    this.lastName    = IOUtils.prompt("Enter last name");
    this.address     = IOUtils.prompt("Enter new Address: ");
    this.city        = IOUtils.prompt("Enter new City: ");
    this.state       = IOUtils.prompt("Enter new State: ");
    this.zipcode     = parseInt(IOUtils.prompt("Enter new Zipcode: "));
    this.phoneNumber = IOUtils.prompt("Enter new Phone Number: ");
    this.email       = IOUtils.prompt("Enter new Email: ");
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

