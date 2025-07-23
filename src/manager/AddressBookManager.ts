// File: src/manager/AddressBookManager.ts

import { AddressBook } from "../model/AddressBook";
import { ContactPerson } from "../model/ContactPerson";
import { ContactInputHelper } from "../utils/ContactInputHelper";
import { IOUtils } from "../utils/IOUtils";
import { Validator } from "../utils/Validator";


// Class responsible for managing multiple address books and operations on them
export class AddressBookManager {
  private addressBooks: Map<string, AddressBook> = new Map();
  

  prompt(msg: string): string {
    return IOUtils.prompt(msg);
  }

  addAddressBook(name: string): void {
    if (!Validator.isNameValid(name)) {
      IOUtils.log("Invalid Address Book name must Start with capital, min 3 letters).", false);
      return;
    }

    if (this.addressBooks.has(name)) {
      IOUtils.log("Address Book already exists.", false);
      return;
    }

    this.addressBooks.set(name, new AddressBook());
    IOUtils.log(`Created Address Book: ${name}`);
  }

  getAddressBook(name: string): AddressBook | undefined {
    return this.addressBooks.get(name);
  }

  findInAllBooksByCity(city: string): ContactPerson[] {
    const allContacts: ContactPerson[] = [];
    this.addressBooks.forEach(book => {
      allContacts.push(...book.findByCity(city));
    });
    return allContacts;
  }

  findInAllBooksByState(state: string): ContactPerson[] {
    const allContacts: ContactPerson[] = [];
    this.addressBooks.forEach(book => {
      allContacts.push(...book.findByState(state));
    });
    return allContacts;
  }

 selectAddressBook(): string | undefined {
  if (this.addressBooks.size === 0) {
    IOUtils.log("No address books available.", false);
    return;
  }

  const names = Array.from(this.addressBooks.keys());
  IOUtils.log("Available Address Books:");
  names.forEach((name) => {
    IOUtils.log(`📘 ${name}`);
  });

  const selectedName = IOUtils.prompt("Enter name of Address Book to select: ");
  if (!this.addressBooks.has(selectedName)) {
    IOUtils.log("❌ No such Address Book exists.", false);
    return;
  }

  return selectedName;
}



  deleteBook(name: string): void {
    if (this.addressBooks.delete(name)) {
      IOUtils.log(`Deleted Address Book: ${name}`);
    } else {
      IOUtils.log("Address Book not found.", false);
    }
  }

  manageAddressBook(name: string): void {
    const addressBook = this.getAddressBook(name);
    if (!addressBook) {
      IOUtils.log("Address Book not found.", false);
      return;
    }

    let option: string;
    do {
      console.log("\n📘 Managing Address Book");
      console.log("1. Add Contact\n2. View Contacts\n3. Edit Contact\n4. Delete Contact\n5. Find by City\n6. Find by State\n7. Exit");
      option = IOUtils.prompt("Choose an option: ");

      switch (option) {
       case "1":
        const contact = ContactInputHelper.getValidatedContact();
        if (contact) {
          addressBook.addContact(contact);
        } else {
          IOUtils.log("❌ Failed to add contact due to invalid input.");
        }
         break;

        case "2":
          IOUtils.displayContactsList("All Contacts", addressBook.getAllContacts());
          break;
        case "3":
          const editName = IOUtils.prompt("Enter First Name of contact to edit: ");
          addressBook.editContact(editName);
          break;
        case "4":
          const delName = IOUtils.prompt("Enter First Name of contact to delete: ");
          addressBook.deleteContact(delName);
          break;
        case "5":
          const city = IOUtils.prompt("Enter City to search contacts: ");
          IOUtils.displayContactsList(`Contacts in City: ${city}`, addressBook.findByCity(city));
          break;
        case "6":
          const state = IOUtils.prompt("Enter State to search contacts: ");
          IOUtils.displayContactsList(`Contacts in State: ${state}`, addressBook.findByState(state));
          break;

        case "7":
          IOUtils.log("Exiting address book management.");
          break;
        default:
          IOUtils.log("❌ Invalid option. Please try again.", false);
      }
    } while (option !== "7");
  }

  /**
   * Groups contacts by city within a single book
   */
  groupByCitySingleBook(bookName: string): Map<string, ContactPerson[]> {
    const cityMap = new Map<string, ContactPerson[]>();
    const book = this.getAddressBook(bookName);
    if (!book) {
      IOUtils.log(`❌ Address Book '${bookName}' not found.`);
      return cityMap;
    }
    book.getAllContacts().forEach((person) => {
      const city = person.city;
      if (!cityMap.has(city)) {
        cityMap.set(city, []);
      }
      cityMap.get(city)!.push(person);
    });
    return cityMap;
  }

  /**
   * Displays grouped contacts by city (single book)
   */
  displayGroupedByCitySingleBook(bookName: string): void {
    const cityGroups = this.groupByCitySingleBook(bookName);
    if (cityGroups.size === 0) {
      IOUtils.log("📭 No contacts available to group by city.");
      return;
    }
    IOUtils.log(`🏙️ Contacts in '${bookName}' grouped by City:`);
    cityGroups.forEach((contacts, city) => {
      IOUtils.log(`\n🌆 City: ${city}`);
      contacts.forEach((contact, index) => {
        IOUtils.log(`  ${index + 1}. ${contact.toString()}`);
      });
    });
  }

  /**
   * Groups contacts by state within a single book
   */
  groupByStateSingleBook(bookName: string): Map<string, ContactPerson[]> {
    const stateMap = new Map<string, ContactPerson[]>();
    const book = this.getAddressBook(bookName);
    if (!book) {
      IOUtils.log(`❌ Address Book '${bookName}' not found.`);
      return stateMap;
    }
    book.getAllContacts().forEach((person) => {
      const state = person.state;
      if (!stateMap.has(state)) {
        stateMap.set(state, []);
      }
      stateMap.get(state)!.push(person);
    });
    return stateMap;
  }

  /**
   * Displays grouped contacts by state (single book)
   */
  displayGroupedByStateSingleBook(bookName: string): void {
    const stateGroups = this.groupByStateSingleBook(bookName);
    if (stateGroups.size === 0) {
      IOUtils.log("📭 No contacts available to group by state.");
      return;
    }
    IOUtils.log(`🌎 Contacts in '${bookName}' grouped by State:`);
    stateGroups.forEach((contacts, state) => {
      IOUtils.log(`\n🗺️ State: ${state}`);
      contacts.forEach((contact, index) => {
        IOUtils.log(`  ${index + 1}. ${contact.toString()}`);
      });
    });
  }

  /**
   * Counts number of contacts in each city across all books
   */
  countByCity(): Map<string, number> {
    const cityCount = new Map<string, number>();
    this.addressBooks.forEach((book) => {
      book.getAllContacts().forEach((person) => {
        const city = person.city;
        cityCount.set(city, (cityCount.get(city) || 0) + 1);
      });
    });
    return cityCount;
  }

  /**
   * Counts number of contacts in each state across all books
   */
  countByState(): Map<string, number> {
    const stateCount = new Map<string, number>();
    this.addressBooks.forEach((book) => {
      book.getAllContacts().forEach((person) => {
        const state = person.state;
        stateCount.set(state, (stateCount.get(state) || 0) + 1);
      });
    });
    return stateCount;
  }

  /**
   * Utility to print city/state-wise contact counts
   */
  displayCount(countMap: Map<string, number>, type: string): void {
    console.log(`📈 Contact Count by ${type}:`);
    countMap.forEach((count, key) => {
      console.log(`🔸 ${type}: ${key} → ${count} contact(s)`);
    });
  }

}
