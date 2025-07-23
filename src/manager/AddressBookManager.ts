// File: src/manager/AddressBookManager.ts

import { AddressBook } from "../model/AddressBook";
import { ContactPerson } from "../model/ContactPerson";
import { IOUtils } from "../utils/IOUtils";
import { Validator } from "../utils/Validator";

// Class responsible for managing multiple address books and operations on them
export class AddressBookManager {
  // Stores address books using a Map (key: book name, value: AddressBook object)
  private addressBooks: Map<string, AddressBook> = new Map();

  // Utility method to prompt user for input
  prompt(msg: string): string {
    return IOUtils.prompt(msg);
  }

  // Method to create a new address book
  addAddressBook(): void {
    while (true) {
      let name = IOUtils.prompt("Enter new Address Book name: ");

      // Validate address book name
      while (!Validator.isAddressBookNameValid(name)) {
        name = IOUtils.prompt(
          "❌ Invalid. First Name must start with a capital and be at least 3 characters: "
        );
      }

      // Check for empty or duplicate name
      if (!name) {
        IOUtils.log(" Name cannot be empty.");
      } else if (this.addressBooks.has(name)) {
        IOUtils.log(` Address Book '${name}' already exists.`);
      } else {
        // Add the new address book to the map
        this.addressBooks.set(name, new AddressBook());
        IOUtils.log(` New Address Book '${name}' created.`);
        break;
      }
    }
  }

  // Method to select an existing address book from the list
  selectAddressBook(): AddressBook | null {
    if (this.addressBooks.size === 0) {
      IOUtils.log("No address books available.", false);
      return null;
    }

    // Show available address books
    const names = Array.from(this.addressBooks.keys());
    console.log("Available Address Books:");
    names.forEach((name) => console.log(`📘 ${name}`));

    const selectedName = IOUtils.prompt(
      "Enter the name of the Address Book to select: "
    ).trim();

    // Return selected address book if found
    if (this.addressBooks.has(selectedName)) {
      return this.addressBooks.get(selectedName)!;
    }

    IOUtils.log("Address Book not found with that name.", false);
    return null;
  }

  // Manages contacts within a selected address book
  manageAddressBook(addressBook: AddressBook): void {
    let option: string;
    do {
      // Display the contact management menu
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
          // Prompt and validate input for each contact field
          let firstName = IOUtils.prompt("Enter First Name: ");
          while (!Validator.isNameValid(firstName)) {
            firstName = IOUtils.prompt(
              "❌ Invalid. First Name must start with a capital and be at least 3 characters: "
            );
          }

          let lastName = IOUtils.prompt("Enter Last Name: ");
          while (!Validator.isNameValid(lastName)) {
            lastName = IOUtils.prompt(
              "❌ Invalid. Last Name must start with a capital and be at least 3 characters: "
            );
          }

          let address = IOUtils.prompt("Enter Address: ");
          while (!Validator.isAddressValid(address)) {
            address = IOUtils.prompt(
              "❌ Invalid Address. Must be at least 3 characters and contain only letters, numbers, spaces, and # , / . -"
            );
          }

          let city = IOUtils.prompt("Enter City: ");
          while (!Validator.isCityOrStateValid(city)) {
            city = IOUtils.prompt(
              "❌ Invalid City. Must be at least 3 characters and contain only letters, spaces, and optionally -, . or /"
            );
          }

          let state = IOUtils.prompt("Enter State: ");
          while (!Validator.isCityOrStateValid(state)) {
            state = IOUtils.prompt(
              "❌ Invalid State. Must be at least 3 characters and contain only letters, spaces, and optionally -, . or /"
            );
          }

          let zipcode = parseInt(IOUtils.prompt("Enter Zipcode: "));
          while (!Validator.isZipcodeValid(zipcode)) {
            zipcode = parseInt(
              IOUtils.prompt(
                "❌ Invalid Zipcode. Must be exactly 6 digits. Try again: "
              )
            );
          }

          let phoneNumber = IOUtils.prompt("Enter Phone Number: ");
          while (!Validator.isPhoneNumberValid(phoneNumber)) {
            phoneNumber = IOUtils.prompt(
              "❌ Invalid Phone Number. Must be 10 digits starting with 0-9. Try again: "
            );
          }

          let email = IOUtils.prompt("Enter Email: ");
          while (!Validator.isEmailValid(email)) {
            email = IOUtils.prompt("❌ Invalid Email format. Try again: ");
          }

          // Create a new contact and add to the address book
          const contact = new ContactPerson(
            firstName,
            lastName,
            address,
            city,
            state,
            zipcode,
            phoneNumber,
            email
          );
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
          // Edit a contact by first name
          const nameToEdit = IOUtils.prompt(
            "Enter First Name of contact to edit: "
          );
          addressBook.editContact(nameToEdit);
          break;

        case "4":
          // Delete a contact by first name
          const nameToDelete = IOUtils.prompt(
            "Enter First Name of contact to delete: "
          );
          addressBook.deleteContact(nameToDelete);
          break;

        case "5":
          this.displayGroupedByCityMultipleBook();
          break;

        case "6":
          this.displayGroupedByState();
          break;
        case "7":
          // Exit from contact management
          IOUtils.log("Exiting address book management.");
          break;
        case "8":
          this.displayGroupedByCitySingleBook(
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
    } while (option !== "10"); // Loop until user chooses to exit
  }
  getAddressBook(name: string): AddressBook | undefined {
    return this.addressBooks.get(name);
  }
  // Groups all contacts across all address books by their city names
  groupByCityMultipleBook(): Map<string, ContactPerson[]> {
    const cityMap = new Map<string, ContactPerson[]>();

    // Iterate over all address books
    this.addressBooks.forEach((book) => {
      const contacts = book.getAllContacts(); // Retrieve contacts from the book

      // For each contact, group them by city
      contacts.forEach((person: ContactPerson) => {
        const cityName = person.city;

        // If city not yet added, initialize its array
        if (!cityMap.has(cityName)) {
          cityMap.set(cityName, []);
        }

        // Add person to the city's group
        cityMap.get(cityName)!.push(person);
      });
    });

    return cityMap;
  }

  // Displays all contacts grouped by city
  displayGroupedByCityMultipleBook(): void {
    const cityGroups = this.groupByCityMultipleBook();

    if (cityGroups.size === 0) {
      IOUtils.log("📭 No contacts available to group.");
      return;
    }

    IOUtils.log("🏙️ Contacts Grouped by City:");

    // Print each city and its contacts
    cityGroups.forEach((contacts, city) => {
      IOUtils.log(`\n🌆 City: ${city}`);
      contacts.forEach((contact, index) => {
        IOUtils.log(`  ${index + 1}. ${contact.toString()}`);
      });
    });
  }

  // Groups all contacts across all address books by their state names
  groupByStateMultipleBook(): Map<string, ContactPerson[]> {
    const stateMap = new Map<string, ContactPerson[]>();

    // Iterate through all address books
    this.addressBooks.forEach((book) => {
      const contacts = book.getAllContacts(); // Get all contacts from the book

      // For each contact, group them by state
      contacts.forEach((person: ContactPerson) => {
        const stateName = person.state;

        // Initialize list for state if not already present
        if (!stateMap.has(stateName)) {
          stateMap.set(stateName, []);
        }

        // Add the contact to the appropriate state's group
        stateMap.get(stateName)!.push(person);
      });
    });

    return stateMap;
  }

  // Displays all contacts grouped by state
  displayGroupedByState(): void {
    const stateGroups = this.groupByStateMultipleBook();

    if (stateGroups.size === 0) {
      IOUtils.log("📭 No contacts available to group.");
      return;
    }

    IOUtils.log("🌎 Contacts Grouped by State:");

    // Print each state and its contacts
    stateGroups.forEach((contacts, state) => {
      IOUtils.log(`\n🗺️ State: ${state}`);
      contacts.forEach((contact, index) => {
        IOUtils.log(`  ${index + 1}. ${contact.toString()}`);
      });
    });
  }

  // 👉 Group by City (Single Book)
  groupByCitySingleBook(bookName: string): Map<string, ContactPerson[]> {
    const cityMap = new Map<string, ContactPerson[]>();
    const book = this.getAddressBook(bookName);

    if (!book) {
      IOUtils.log(`❌ Address Book '${bookName}' not found.`);
      return cityMap;
    }

    const contacts = book.getAllContacts();
    contacts.forEach((person) => {
      const city = person.city;
      if (!cityMap.has(city)) {
        cityMap.set(city, []);
      }
      cityMap.get(city)!.push(person);
    });

    return cityMap;
  }

  // 👉 Display Grouped by City (Single Book)
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

  // 👉 Group by State (Single Book)
  groupByStateSingleBook(bookName: string): Map<string, ContactPerson[]> {
    const stateMap = new Map<string, ContactPerson[]>();
    const book = this.getAddressBook(bookName);

    if (!book) {
      IOUtils.log(`❌ Address Book '${bookName}' not found.`);
      return stateMap;
    }

    const contacts = book.getAllContacts();
    contacts.forEach((person) => {
      const state = person.state;
      if (!stateMap.has(state)) {
        stateMap.set(state, []);
      }
      stateMap.get(state)!.push(person);
    });

    return stateMap;
  }

  // 👉 Display Grouped by State (Single Book)
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
  displayCount(countMap: Map<string, number>, type: string): void {
    console.log(`📈 Contact Count by ${type}:`);
    countMap.forEach((count, key) => {
      console.log(`🔸 ${type}: ${key} → ${count} contact(s)`);
    });
  }
}
