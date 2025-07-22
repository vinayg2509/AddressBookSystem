// File: src/model/AddressBook.ts
import { ContactPerson } from "./ContactPerson";
import { IOUtils } from "../utils/IOUtils";

export class AddressBook {
  private contacts: ContactPerson[] = [];
  
  addContact(contact: ContactPerson): void {
    const isDuplicate=this.contacts.some(c=>c.getPhoneNumber()===contact.getPhoneNumber())
    if(isDuplicate)
    {
      IOUtils.prompt(" Duplicate Entry: ${contacts.phoneNumber} already exists in this Address Book.")
    }
    else
    {
      this.contacts.push(contact);
      IOUtils.log("Contact added successfully.");
    }
  }

  getAllContacts(): void {
    if (this.contacts.length === 0) {
      IOUtils.log("No contacts available.", false);
      return;
    }

    IOUtils.log("Contact List:");
    this.contacts.forEach((contact, i) =>
      console.log(`${i + 1}. ${contact.toString()}`)
    );
  }

  editContact(firstName: string): void {
    const contact = this.contacts.find((c) => c.firstName === firstName);
    if (contact) {
      contact.updateDetails();
      IOUtils.log("Contact updated successfully.");
    } else {
      IOUtils.log("Contact not found.", false);
    }
  }

  deleteContact(firstName: string): void {
    const index = this.contacts.findIndex((c) => c.firstName === firstName);
    if (index !== -1) {
      this.contacts.splice(index, 1);
      IOUtils.log("Contact deleted successfully.");
    } else {
      IOUtils.log("Contact not found.", false);
    }
  }
}
