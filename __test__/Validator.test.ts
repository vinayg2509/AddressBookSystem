import { Validator } from "../src/utils/Validator";
describe("Validator", () => {
  // ✅ Test: Name Validation
  describe("isNameValid()", () => {
    it("should return true for valid names", () => {
      expect(Validator.isNameValid("Vinay")).toBe(true);
      expect(Validator.isNameValid("Bhadravathi")).toBe(true);
      expect(Validator.isNameValid("Karnataka")).toBe(true);
    });

    it("should return false for invalid names", () => {
      expect(Validator.isNameValid("vinay")).toBe(false); // starts lowercase
      expect(Validator.isNameValid("Vi")).toBe(false); // too short
      expect(Validator.isNameValid("V1nay")).toBe(false); // contains digit
      expect(Validator.isNameValid("bhadravathi")).toBe(false);// starts lowercase
      expect(Validator.isNameValid("karnataka")).toBe(false);// starts lowercase
    });
  });


  // ✅ Address
  describe("isAddressValid()", () => {
    it("should validate address properly", () => {
      expect(Validator.isAddressValid("123 Main St")).toBe(true);
      expect(Validator.isAddressValid("A")).toBe(false);
    });
  });

  // ✅ Zip Code
  describe("isZipValid()", () => {
    it("should validate 6-digit zip code", () => {
      expect(Validator.isZipValid("577301")).toBe(true);
      expect(Validator.isZipValid("12345")).toBe(false);
      expect(Validator.isZipValid("abc123")).toBe(false);
    });
  });

  // ✅ Phone Number
  describe("isPhoneNumberValid()", () => {
    it("should validate phone number with +91", () => {
      expect(Validator.isPhoneNumberValid("+919876543210")).toBe(true);
      expect(Validator.isPhoneNumberValid("9876543210")).toBe(false);
      expect(Validator.isPhoneNumberValid("+91234")).toBe(false);
    });
  });

  // ✅ Email
  describe("isEmailValid()", () => {
    it("should validate email format", () => {
      expect(Validator.isEmailValid("vinay@gmail.com")).toBe(true);
      expect(Validator.isEmailValid("invalid@com")).toBe(false);
      expect(Validator.isEmailValid("invalid.com")).toBe(false);
    });
  });
});
