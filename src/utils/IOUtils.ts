import readlineSync from "readline-sync";
import { ContactPerson } from "../model/ContactPerson";

<<<<<<< HEAD
// Importing readline-sync to enable synchronous user input from the command line
import * as readline from "readline-sync";
import { ContactPerson } from "../model/ContactPerson";

// Utility class to handle user input and formatted console logging
export class IOUtils {
  /**
   * Prompt the user for input using a custom message.
   * @param message - The prompt message shown to the user.
   * @returns The user input as a string.
   */
=======
export class IOUtils 
{
  
>>>>>>> UC8-view-persons-by-city-state-from-single-book
  static prompt(message: string): string {
    return readlineSync.question(message);
  }

  static log(message: string, success: boolean = true): void {
    console.log(success ? ` ${message}` : ` ${message}`);
<<<<<<< HEAD
  }

   static displaySortedContacts(sorted: ContactPerson[], title: string = "📚 Sorted Contacts"): void {
    if (sorted.length === 0) {
      this.log("📭 No contacts to sort.");
    } else {
      this.log(title);
      sorted.forEach((contact, i) => {
        this.log(`  ${i + 1}. ${contact.toString()}`);
      });
    }
  }
   static displayContacts(contacts: ContactPerson[], title: string = "📒 All Contacts"): void {
    if (contacts.length === 0) {
      this.log("📭 No contacts available.");
    } else {
      this.log(title);
      contacts.forEach((contact, index) => {
        this.log(`  ${index + 1}. ${contact.toString()}`);
      });
    }
=======
>>>>>>> UC8-view-persons-by-city-state-from-single-book
  }

  static displayContactsList(header: string, contacts: ContactPerson[]): void {
    if (contacts.length === 0) {
      this.log(`📭 No contacts available for ${header}`, false);
      return;
    }

    this.log(`\n📒 ${header}`);
    contacts.forEach((contact, index) => {
      console.log(`  ${index + 1}. ${contact.toString()}`);
    });
  }
  
}
