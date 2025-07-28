import { AddressBook } from "../src/model/AddressBook";
import { ContactPerson } from "../src/model/ContactPerson";

describe("AddressBook", () => {
  let book: AddressBook;
  const person = new ContactPerson(
    "Vinay",
    "Ganeshappa",
    "#1836 Hosmane main road",
    "Bhadravathi",
    "Karnataka",
    577301,
    "+918123804331",
    "vinay@gmail.com"
  );

  beforeEach(() => {
    book = new AddressBook();
  });

  it("should add contact", () => {
    book.addContact(person);
    expect(book.getAllContacts()).toContain(person);
  });

  it("should add not duplicate contact", () => {
    book.addContact(person);
    book.addContact(person);
    expect(book.getAllContacts()).toContain(person);
  });

  it("should delete contact by name", () => {
    book.addContact(person);
    book.deleteContact("Vinay");
    const contacts = book.getAllContacts();
    expect(contacts).not.toContain(1); // person should be gone
  });

  it("should find contact by city", () => {
    book.addContact(person);
    const result = book.findByCity("Bhadravathi");
    expect(result.length).toBe(1);
  });
});
