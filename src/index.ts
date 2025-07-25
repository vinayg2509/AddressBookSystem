// File: src/main/AddressBookMain.ts

import { IOUtils } from './utils/IOUtils';
import { TextFileService } from './services/TextFileService';
import { AddressBookManager } from './manager/AddressBookManager';
import { AddressBook } from './model/AddressBook';

class AddressBookMain {
  private addressBookManager = new AddressBookManager();
   private addressBooks: Map<string, AddressBook> = new Map();

  welcomeToAddressBook(): void {
    IOUtils.log("👋 Welcome to the Address Book Program");
  }

  run(): void {
    this.welcomeToAddressBook();

    while (true) {
      IOUtils.log("\n📁 MAIN MENU");
      IOUtils.log("1. Create Address Book");
      IOUtils.log("2. Select Existing Address Book");
      IOUtils.log("3. View Contacts by City");
      IOUtils.log("4. View Contacts by State");
      IOUtils.log("5. Count Contacts by City");
      IOUtils.log("6. Count Contacts by State");
      IOUtils.log("7. Sort Contacts by Name/City/State/Zip");
      IOUtils.log("8. Load Contacts from text File");
      IOUtils.log("9. Load Contacts from CSV File");
      IOUtils.log("10. Exit");

      const choice = parseInt(IOUtils.prompt("Enter your choice: "));

      switch (choice) {
        case 1:
          const nameToAdd = IOUtils.prompt("Enter name for new Address Book: ");
          this.addressBookManager.addAddressBook(nameToAdd);
          break;
        case 2:
        const selectedBook = this.addressBookManager.selectAddressBook();
        if (selectedBook) {
          this.addressBookManager.manageAddressBook(selectedBook);
        }
         break;

        case 3:
          this.viewGroupedContacts("city");
          break;

        case 4:
          this.viewGroupedContacts("state");
          break;

        case 5:
          this.displayCounts("city");
          break;

        case 6:
          this.displayCounts("state");
          break;

        case 7:
          const fieldInput = IOUtils.prompt(
            "Enter field to sort by (city/state/zip/name): "
          ).toLowerCase();
          if (["city", "state", "zip", "name"].includes(fieldInput)) {
            this.addressBookManager.sortAllContacts(
              fieldInput as "city" | "state" | "zip" | "name"
            );
          } else {
            IOUtils.log(
              "❌ Invalid input. Please enter 'city', 'state','zip', or 'name'",
              false
            );
          }
          break;
      
        case 8:
          const fileNameToRead = IOUtils.prompt("Enter text file name to be read: ");
          TextFileService.readFromFile(fileNameToRead);
          break;
         case 9:
          const csvFileNameToRead = IOUtils.prompt("Enter csv file name to be read: ");
          TextFileService.readFromFile(csvFileNameToRead);
          break;
        case 10:
          IOUtils.log("👋 Exiting Address Book Program.");
          return;

        default:
          IOUtils.log("❗ Invalid choice. Try again.");
      }
    }
  }

  private viewGroupedContacts(field: "city" | "state"): void {
    const allBooks = this.addressBookManager.getAllBooks();
    allBooks.forEach((book, name) => {
      const map =
        field === "city" ? book.getCityWiseMap() : book.getStateWiseMap();
      this.addressBookManager.displayGroupedContacts(
        map,
        field.charAt(0).toUpperCase() + field.slice(1)
      );
    });
  }

  private displayCounts(field: "city" | "state"): void {
    const countMap = this.addressBookManager.countBy(field);
    const label =
      field === "city"
        ? "🏙️ Contact Count by City:"
        : "🗺️ Contact Count by State:";
    IOUtils.log(label);
    countMap.forEach((count, key) => {
      IOUtils.log(`   📍 ${key}: ${count} contact(s)`);
    });
  }
}

// Entry point
const addressApp = new AddressBookMain();
addressApp.run();
