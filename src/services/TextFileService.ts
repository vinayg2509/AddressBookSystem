import * as fs from "fs";
import * as path from "path";
import { IOUtils } from "../utils/IOUtils";
import { ContactPerson } from "../model/ContactPerson";

export class TextFileService {
  // Path to the folder where files will be stored
   static  folderPath = path.join(process.cwd(),'src','files')

  // ✅ Step 1: Ensure the folder exists
  static ensureFolderExists(): void {
    if (!fs.existsSync(this.folderPath)) {
      fs.mkdirSync(this.folderPath, { recursive: true });
      IOUtils.log(`📁 Folder '${this.folderPath}' created.`);
    }
  }

  // ✅ Step 2: Write contacts to a text file
  static writeToFile(fileName: string, contacts: ContactPerson[]): void {
    this.ensureFolderExists(); // Ensure folder is created first

    const filePath = path.join(this.folderPath, fileName); // e.g. Files/addressbook.txt
    const lines = contacts.map(c => c.toString()).join("\n");

    try {
      fs.writeFileSync(filePath, lines, "utf-8");
      IOUtils.log(`📤 Contacts saved to text file: ${filePath}`);
    } catch (error: any) {
      IOUtils.log(`❌ Failed to write to text file: ${error.message}`, false);
    }
  }

  // ✅ Step 3: Optional - Read and display content from text file
  static readFromFile(fileName: string): void {
    const filePath = path.join(this.folderPath, fileName);

    try {
      if (!fs.existsSync(filePath)) {
        IOUtils.log("📭 No text file found.");
        return;
      }
      const content = fs.readFileSync(filePath, "utf-8");
      IOUtils.log("📥 Contacts read from text file:");
      IOUtils.log(content);
    } catch (error: any) {
      IOUtils.log(`❌ Failed to read from text file: ${error.message}`, false);
    }
  }
  static writeToJsonFile(fileName: string, contacts: ContactPerson[]): void {
    this.ensureFolderExists();
    const filePath = path.join(this.folderPath, fileName);

    try {
      fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2), "utf-8");
      IOUtils.log(`📤 Contacts saved to JSON file: ${filePath}`);
    } catch (error: any) {
      IOUtils.log(`❌ Failed to write to JSON file: ${error.message}`, false);
    }
  }

static readFromJsonFile(fileName: string): void {
  const filePath = path.join(this.folderPath, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      IOUtils.log("📭 No JSON file found.");
      return;
    }

    const jsonData = fs.readFileSync(filePath, "utf-8");
    const records = JSON.parse(jsonData);

    IOUtils.log("📥 Contacts loaded from JSON file:\n");

    records.forEach((r: any, index: number) => {
      IOUtils.log(`🔢 Contact #${index + 1}:\n${JSON.stringify(r, null, 2)}\n`);
    });

  } catch (error: any) {
    IOUtils.log(`❌ Failed to read from JSON file: ${error.message}`, false);
  }
}




}
