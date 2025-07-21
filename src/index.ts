
import * as readline from "readline-sync"
import  {ContactPerson}  from "./model/ContactPerson";
import { AddressBook } from './model/AddressBook';
class AddressBookMain
{
    private addressBook=new AddressBook()
    welcomeToAddressBook():void
   {
     console.log("👋 Welcome to the Address Book Program");
   }

  getContactFromUser():ContactPerson
   {
    const firstName=readline.question("First name: ")
    const lastName=readline.question("Second name: ")
    const address=readline.question("Address: ")
    const city=readline.question("City: ")
    const state=readline.question("State: ")
    const zipcode=parseInt(readline.question("Zipcode: "))
    const phoneNumber=readline.question("Phone Number: ")
        const email=readline.question("Email: ")
    return new ContactPerson(firstName,lastName,address,city,state,zipcode,phoneNumber,email)
   }

   run():void
   {
    this.welcomeToAddressBook()
    const personContact=this.getContactFromUser()
    this.addressBook.addAccount(personContact)
    this.addressBook.getAllContacts()
 
   }
   
}
const addressApp =new AddressBookMain()
addressApp.run()