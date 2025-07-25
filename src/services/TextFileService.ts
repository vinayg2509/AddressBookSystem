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
}
