import  {ContactPerson}  from "./model/ContactPerson";
import { AddressBook } from './model/AddressBook';
class AddressBookMain
{
    welcomeToAddressBook():void
   {
     console.log("👋 Welcome to the Address Book Program");
   }

   private addressBook = new AddressBook()
   run():void
   {
    this.welcomeToAddressBook()
     const contact1 = new ContactPerson(
      "Vinay",
      "G",
      "Hosmane Main Road",
      "Bhadravathi",
      "KA",
      577301,
      12345678,
      "Vinay@gmail.com"
    );
    this.addressBook.addAccount(contact1)
    this.addressBook.getAllContacts()
   }
}
const addressApp =new AddressBookMain()
addressApp.run()
