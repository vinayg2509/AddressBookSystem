<<<<<<< HEAD
import readlineSync from "readline-sync";
import { ContactPerson } from "../model/ContactPerson";

=======

import readlineSync from "readline-sync";
import { ContactPerson } from "../model/ContactPerson";

>>>>>>> UC9-view-contact-by-city-state-multiple-book
export class IOUtils 
{
  
  static prompt(message: string): string {
    return readlineSync.question(message);
  }

  static log(message: string, success: boolean = true): void {
    console.log(success ? ` ${message}` : ` ${message}`);
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
