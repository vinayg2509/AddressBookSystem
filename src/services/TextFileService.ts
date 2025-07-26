// File: src/service/TextFileService.ts

import * as fs from "fs";
import * as path from "path";
import { IOUtils } from "../utils/IOUtils";
import { ContactPerson } from "../model/ContactPerson";

export class TextFileService {
  static folderPath = path.join(process.cwd(), "src", "files");

  static ensureFolderExists(): void {
    if (!fs.existsSync(this.folderPath)) {
      fs.mkdirSync(this.folderPath, { recursive: true });
      IOUtils.log(`📁 Folder '${this.folderPath}' created.`);
    }
  }

  static writeContactsToFile(fileName: string, contacts: ContactPerson[]): void {
    this.ensureFolderExists();
    const filePath = path.join(this.folderPath, fileName);
    const extension = path.extname(fileName).toLowerCase();

    try {
      switch (extension) {
        case ".txt":
          const text = contacts.map((c) => c.toString()).join("\n");
          fs.writeFileSync(filePath, text, "utf-8");
          IOUtils.log("📤 Contacts saved to TEXT file successfully.");
          break;

        case ".json":
          const jsonData = JSON.stringify(contacts, null, 2);
          fs.writeFileSync(filePath, jsonData, "utf-8");
          IOUtils.log("📤 Contacts saved to JSON file successfully.");
          break;

        case ".csv":
          const header = "FirstName,LastName,Address,City,State,Zip,PhoneNumber,Email";
          const csvRows = contacts.map(
            (c) =>
              `${c.firstName},${c.lastName},${c.address},${c.city},${c.state},${c.zip},${c.phoneNumber},${c.email}`
          );
          const csvData = [header, ...csvRows].join("\n");
          fs.writeFileSync(filePath, csvData, "utf-8");
          IOUtils.log("📤 Contacts saved to CSV file successfully.");
          break;

        default:
          IOUtils.log("❌ Unsupported file format. Use .txt, .json, or .csv", false);
      }
    } catch (error: any) {
      IOUtils.log(`❌ Failed to write to file: ${error.message}`, false);
    }
  }

  static readContactsFromFile(fileName: string): void {
    const filePath = path.join(this.folderPath, fileName);
    const extension = path.extname(fileName).toLowerCase();

    try {
      if (!fs.existsSync(filePath)) {
        IOUtils.log(`📭 No ${extension.toUpperCase()} file found.`);
        return;
      }

      switch (extension) {
        case ".txt":
          const textData = fs.readFileSync(filePath, "utf-8");
          IOUtils.log("📥 Contacts loaded from TEXT file:\n");
          IOUtils.log(textData);
          break;

        case ".json":
          const jsonData = fs.readFileSync(filePath, "utf-8");
          const jsonContacts = JSON.parse(jsonData);
          IOUtils.log("📥 Contacts loaded from JSON file:\n");
          jsonContacts.forEach((contact: any, index: number) =>
            IOUtils.log(`🔢 Contact #${index + 1}:\n${JSON.stringify(contact, null, 2)}\n`)
          );
          break;

        case ".csv":
          const csvData = fs.readFileSync(filePath, "utf-8");
          const lines = csvData.split(/\r?\n/).filter((line) => line.trim().length > 0);

          const [header, ...rows] = lines;
          IOUtils.log("📥 Contacts loaded from CSV file:\n");

          rows.forEach((line, index) => {
            const parts = line.split(",");
            const [
              firstName,
              lastName,
              address,
              city,
              state,
              zip,
              phoneNumber,
              email,
            ] = parts.map((part) => part.trim());

            IOUtils.log(`🔢 Contact #${index + 1}:
👤 Name      : ${firstName} ${lastName}
🏠 Address   : ${address}, ${city}, ${state} - ${zip}
📞 Phone     : ${phoneNumber}
📧 Email     : ${email}\n`);
          });
          break;

        default:
          IOUtils.log("❌ Unsupported file format. Use .txt, .json, or .csv", false);
      }
    } catch (error: any) {
      IOUtils.log(`❌ Failed to read from file: ${error.message}`, false);
    }
  }
}
