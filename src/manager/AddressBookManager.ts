// File: src/manager/AddressBookManager.ts

import { AddressBook } from "../model/AddressBook";
import { ContactPerson } from "../model/ContactPerson";
import { ContactInputHelper } from "../utils/ContactInputHelper";
import { IOUtils } from "../utils/IOUtils";
import { Validator } from "../utils/Validator";

/**
 * Manager class responsible for handling multiple address books and their related operations
 */
export class AddressBookManager {
  // Stores all address books in a Map with name as key and AddressBook object as value
  private addressBooks: Map<string, AddressBook> = new Map();

  // Wrapper to prompt user input
  prompt(msg: string): string {
    return IOUtils.prompt(msg);
  }

  /**
   * Adds a new address book to the system after validation
   */
  addAddressBook(): void {
    while (true) {
      let name = IOUtils.prompt("Enter new Address Book name: ");

      // Validate name format
      while (!Validator.isAddressBookNameValid(name)) {
        name = IOUtils.prompt(
          "❌ Invalid. First Name must start with a capital and be at least 3 characters: "
        );
      }

      // Handle duplicate and empty name cases
      if (!name) {
        IOUtils.log(" Name cannot be empty.");
      } else if (this.addressBooks.has(name)) {
        IOUtils.log(` Address Book '${name}' already exists.`);
      } else {
        this.addressBooks.set(name, new AddressBook());
        IOUtils.log(` New Address Book '${name}' created.`);
        break;
      }
    }
  }

  /**
   * Allows user to select an existing address book
   */
  selectAddressBook(): AddressBook | null {
    if (this.addressBooks.size === 0) {
      IOUtils.log("No address books available.", false);
      return null;
    }

    // List available books
    const names = Array.from(this.addressBooks.keys());
    console.log("Available Address Books:");
    names.forEach((name) => console.log(`📘 ${name}`));

    const selectedName = IOUtils.prompt(
      "Enter the name of the Address Book to select: "
    ).trim();

    // Return selected book
    if (this.addressBooks.has(selectedName)) {
      return this.addressBooks.get(selectedName)!;
    }

    IOUtils.log("Address Book not found with that name.", false);
    return null;
  }

  /**
   * Provides contact-related operations on a selected address book
   */
  manageAddressBook(addressBook: AddressBook): void {
    let option: string;
    do {
      // Display options menu
      console.log("\n📘 Managing Address Book");
      console.log(`
1. Add Contact
2. View Contacts
3. Edit Contact
4. Delete Contact
5. Group by City (All Books)
6. Group by State (All Books)
7. Group by City (Single Book)
8. Group by State (Single Book)
9. Count by City (All Books)
10. Count by State (All Books)
11. Exit
`);

      option = IOUtils.prompt("Choose an option: ");

      switch (option) {
        case "1":
          const contact = ContactInputHelper.getValidatedContact();
          addressBook.addContact(contact);
          break;

        case "2":
          const contacts = addressBook.getAllContacts();
          if (contacts.length === 0) {
            IOUtils.log("📭 No contacts available in this Address Book.");
          } else {
            IOUtils.log("📒 All Contacts:");
            contacts.forEach((contact, index) => {
              IOUtils.log(`  ${index + 1}. ${contact.toString()}`);
            });
          }
          break;

        case "3":
          const nameToEdit = IOUtils.prompt("Enter First Name of contact to edit: ");
          addressBook.editContact(nameToEdit);
          break;

        case "4":
          const nameToDelete = IOUtils.prompt("Enter First Name of contact to delete: ");
          addressBook.deleteContact(nameToDelete);
          break;

        case "5":
          this.displayGroupedByCityMultipleBook();
          break;

        case "6":
          this.displayGroupedByState();
          break;

        case "7":
          this.displayGroupedByCitySingleBook(
            IOUtils.prompt("Enter Address Book name: ")
          );
          break;

        case "8":
          this.displayGroupedByStateSingleBook(
            IOUtils.prompt("Enter Address Book name: ")
          );
          break;

        case "9":
          const cityCounts = this.countByCity();
          this.displayCount(cityCounts, "City");
          break;

        case "10":
          const stateCounts = this.countByState();
          this.displayCount(stateCounts, "State");
          break;

        case "11":
          IOUtils.log("👋 Exiting address book management.");
          break;

        default:
          IOUtils.log("❌ Invalid option. Please try again.", false);
      }
    } while (option !== "11"); // Continue until exit is selected
  }

  /**
   * Fetches address book by name
   */
  getAddressBook(name: string): AddressBook | undefined {
    return this.addressBooks.get(name);
  }

  /**
   * Groups all contacts across all books by city
   */
  groupByCityMultipleBook(): Map<string, ContactPerson[]> {
    const cityMap = new Map<string, ContactPerson[]>();
    this.addressBooks.forEach((book) => {
      book.getAllContacts().forEach((person) => {
        const city = person.city;
        if (!cityMap.has(city)) {
          cityMap.set(city, []);
        }
        cityMap.get(city)!.push(person);
      });
    });
    return cityMap;
  }

  /**
   * Displays grouped contacts by city (across all books)
   */
  displayGroupedByCityMultipleBook(): void {
    const cityGroups = this.groupByCityMultipleBook();
    if (cityGroups.size === 0) {
      IOUtils.log("📭 No contacts available to group.");
      return;
    }
    IOUtils.log("🏙️ Contacts Grouped by City:");
    cityGroups.forEach((contacts, city) => {
      IOUtils.log(`\n🌆 City: ${city}`);
      contacts.forEach((contact, index) => {
        IOUtils.log(`  ${index + 1}. ${contact.toString()}`);
      });
    });
  }

  /**
   * Groups all contacts across all books by state
   */
  groupByStateMultipleBook(): Map<string, ContactPerson[]> {
    const stateMap = new Map<string, ContactPerson[]>();
    this.addressBooks.forEach((book) => {
      book.getAllContacts().forEach((person) => {
        const state = person.state;
        if (!stateMap.has(state)) {
          stateMap.set(state, []);
        }
        stateMap.get(state)!.push(person);
      });
    });
    return stateMap;
  }

  /**
   * Displays grouped contacts by state (across all books)
   */
  displayGroupedByState(): void {
    const stateGroups = this.groupByStateMultipleBook();
    if (stateGroups.size === 0) {
      IOUtils.log("📭 No contacts available to group.");
      return;
    }
    IOUtils.log("🌎 Contacts Grouped by State:");
    stateGroups.forEach((contacts, state) => {
      IOUtils.log(`\n🗺️ State: ${state}`);
      contacts.forEach((contact, index) => {
        IOUtils.log(`  ${index + 1}. ${contact.toString()}`);
      });
    });
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
