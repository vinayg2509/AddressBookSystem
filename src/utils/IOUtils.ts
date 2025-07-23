// File: src/utils/IOUtils.ts

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
  static prompt(message: string): string {
    return readline.question(message);
  }

  /**
   * Logs a message to the console with a prefix icon indicating success or error.
   * @param message - The message to display.
   * @param success - Optional flag; if true (default), logs a success ✅ message; if false, logs an error ❌ message.
   */
  static log(message: string, success: boolean = true): void {
    console.log(success ? ` ${message}` : ` ${message}`);
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
  }
}
