// File: src/manager/AddressBookManager.ts

import { AddressBook } from "../model/AddressBook";
import { ContactPerson } from "../model/ContactPerson";
import { ContactInputHelper } from "../utils/ContactInputHelper";
import { IOUtils } from "../utils/IOUtils";
import { Validator } from "../utils/Validator";
import { TextFileService } from "../services/TextFileService";

export class AddressBookManager {
  private addressBooks: Map<string, AddressBook> = new Map();

  prompt(msg: string): string {
    return IOUtils.prompt(msg);
  }

  addAddressBook(name: string): void {
    if (!Validator.isNameValid(name)) {
      IOUtils.log("❌ Invalid Address Book name.", false);
      return;
    }

    if (this.addressBooks.has(name)) {
      IOUtils.log("❌ Address Book already exists.", false);
      return;
    }

    this.addressBooks.set(name, new AddressBook());
    IOUtils.log(`✅ Created Address Book: ${name}`);
  }

  selectAddressBook(): string | undefined {
    if (this.addressBooks.size === 0) {
      IOUtils.log("📭 No Address Books available.", false);
      return;
    }

    IOUtils.log("📘 Available Address Books:");
    this.addressBooks.forEach((_, name) => IOUtils.log(`   📒 ${name}`));

    const selectedName = IOUtils.prompt(
      "Enter name of Address Book to select: "
    );

    if (!Validator.isNameValid(selectedName)) {
      IOUtils.log("❌ Invalid name format.", false);
      return;
    }

    if (!this.addressBooks.has(selectedName)) {
      IOUtils.log("❌ No such Address Book exists.", false);
      return;
    }

    return selectedName;
  }

  getBook(name: string): AddressBook | undefined {
    return this.addressBooks.get(name);
  }

  findInAllBooksByCity(city: string): ContactPerson[] {
    const allContacts: ContactPerson[] = [];
    this.addressBooks.forEach((book) =>
      allContacts.push(...book.findByCity(city))
    );
    return allContacts;
  }

  findInAllBooksByState(state: string): ContactPerson[] {
    const allContacts: ContactPerson[] = [];
    this.addressBooks.forEach((book) =>
      allContacts.push(...book.findByState(state))
    );
    return allContacts;
  }

  listAllBooks(): void {
    if (this.addressBooks.size === 0) {
      IOUtils.log("📭 No Address Books available.", false);
      return;
    }

    IOUtils.log("📘 Available Address Books:");
    this.addressBooks.forEach((_, name) => IOUtils.log(`   📒 ${name}`));
  }

  deleteBook(name: string): void {
    if (this.addressBooks.delete(name)) {
      IOUtils.log(`🗑️ Deleted Address Book: ${name}`);
    } else {
      IOUtils.log("❌ Address Book not found.", false);
    }
  }

  countBy(field: "city" | "state"): Map<string, number> {
    const countMap = new Map<string, number>();
    this.addressBooks.forEach((book) => {
      book.getAllContacts().forEach((person) => {
        const key = person[field];
        countMap.set(key, (countMap.get(key) || 0) + 1);
      });
    });
    return countMap;
  }

  manageAddressBook(name: string): void {
    const addressBook = this.getBook(name);
    if (!addressBook) {
      IOUtils.log("❌ Address Book not found.", false);
      return;
    }

    let option: string;
    do {
      console.log("\n📘 Managing Address Book");
      IOUtils.log("1️  ➕ Add Contact");
      IOUtils.log("2️  📒 View All Contacts");
      IOUtils.log("3️  ✏️ Edit Contact");
      IOUtils.log("4️  ❌ Delete Contact");
      IOUtils.log("5️  🏙️ View Contacts by City");
      IOUtils.log("6️  🗺️ View Contacts by State");
      IOUtils.log("7️  🔢 Count Contacts by City");
      IOUtils.log("8️  🔢 Count Contacts by State");
      IOUtils.log("9️  🔤 Sort Contacts by Name/City/State/Zip");
      IOUtils.log("10  💾 Save All Contacts to Text File");
      IOUtils.log("11  📥 Load Contacts from Text File");
      IOUtils.log("0️  🔙 Back to Main Menu");

      option = IOUtils.prompt("Enter your choice: ");

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
          IOUtils.displayContactsList(
            "All Contacts",
            addressBook.getAllContacts()
          );
          break;

        case "3":
          const editName = IOUtils.prompt(
            "Enter First Name of contact to edit: "
          );
          addressBook.editContact(editName);
          break;

        case "4":
          const delName = IOUtils.prompt(
            "Enter First Name of contact to delete: "
          );
          addressBook.deleteContact(delName);
          break;
        case "5":
          this.displayGroupedContacts(addressBook.getCityWiseMap(), "City");
          break;

        case "6":
          this.displayGroupedContacts(addressBook.getStateWiseMap(), "State");
          break;

        case "7":
          const cityCounts = this.countBy("city");
          IOUtils.log("🏙️ Contact Count by City:");
          cityCounts.forEach((count, city) => {
            IOUtils.log(`   📍 ${city}: ${count} contact(s)`);
          });
          break;

        case "8":
          const stateCounts = this.countBy("state");
          IOUtils.log("🗺️ Contact Count by State:");
          stateCounts.forEach((count, state) => {
            IOUtils.log(`   🏞️ ${state}: ${count} contact(s)`);
          });
          break;

        case "9":
          const fieldInput = IOUtils.prompt(
            "Enter field to sort by (city/state/zip/name): "
          ).toLowerCase();

          if (
            fieldInput === "city" ||
            fieldInput === "state" ||
            fieldInput === "zip" ||
            fieldInput === "name"
          ) {
            this.sortAllContacts(
              fieldInput as "city" | "state" | "zip" | "name"
            );
          } else {
            IOUtils.log(
              "❌ Invalid input. Please enter 'city', 'state','zip', or 'name",
              false
            );
          }
          break;

        case "10":
          const fileNameToWrite = IOUtils.prompt(
            "Enter file name to save (e.g., mybook.txt): "
          );
          TextFileService.writeToTextFile(
            fileNameToWrite,
            addressBook.getAllContacts()
          );

          break;

        case "11":
          const fileNameToRead = IOUtils.prompt("Enter file name to be read :");
          TextFileService.readFromTextFile(fileNameToRead);
          break;

        case "0":
          IOUtils.log("🔙 Back to Main Menu.");
          break;

        default:
          IOUtils.log("❌ Invalid option. Please try again.", false);
      }
    } while (option !== "0");
  }

  displayGroupedContacts(
    groupMap: Map<string, ContactPerson[]>,
    label: string
  ): void {
    if (groupMap.size === 0) {
      IOUtils.log(`📭 No contacts grouped by ${label}.`, false);
      return;
    }

    groupMap.forEach((contacts, groupKey) => {
      IOUtils.displayContactsList(`\n📌 ${label}: ${groupKey}`, contacts);
    });
  }

  sortAllContacts(field: "city" | "state" | "zip" | "name"): void {
    const allContacts: ContactPerson[] = [];

    this.addressBooks.forEach((book, bookName) => {
      const contacts = book.getAllContacts();
      contacts.forEach((c) => {
        (c as any)._bookName = bookName;
        allContacts.push(c);
      });
    });

    if (allContacts.length === 0) {
      IOUtils.log("📭 No contacts available across all Address Books.", false);
      return;
    }

    allContacts.sort((a, b) => {
      if (field === "zip") return a.zip - b.zip;
      if (field === "name")
        return a.getFullName().localeCompare(b.getFullName());
      return a[field].localeCompare(b[field]);
    });

    IOUtils.displayContactsList(`📚 Sorted Contacts by ${field}`, allContacts);
  }
}
