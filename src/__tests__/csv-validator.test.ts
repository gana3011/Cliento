import { CSVRow } from '@/app/types/buyer';
import { createBuyerSchema } from '../app/lib/validators/buyer';


describe('CSV Row Validator', () => {
  describe('CSV Data Transformation and Validation', () => {
    // Simulate CSV row data (typically strings from CSV parsing)
    const csvRowToObject = (csvRow: CSVRow) => ({
      fullName: csvRow.fullName?.trim(),
      email: csvRow.email?.trim() || '',
      phone: csvRow.phone?.trim(),
      city: csvRow.city?.trim(),
      propertyType: csvRow.propertyType?.trim(),
      bhk: csvRow.bhk?.trim() || null,
      purpose: csvRow.purpose?.trim(),
      budgetMin: csvRow.budgetMin ? parseInt(csvRow.budgetMin.toString().replace(/,/g, '')) : null,
      budgetMax: csvRow.budgetMax ? parseInt(csvRow.budgetMax.toString().replace(/,/g, '')) : null,
      timeline: csvRow.timeline?.trim(),
      source: csvRow.source?.trim(),
      status: csvRow.status?.trim() || undefined,
      notes: csvRow.notes?.trim() || null,
      tags: csvRow.tags ? csvRow.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
    });

    test('should validate a complete valid CSV row', () => {
      const csvRow = {
        fullName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '9876543210',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: 'BHK3',
        purpose: 'Buy',
        budgetMin: '2,500,000',
        budgetMax: '3,500,000',
        timeline: 'ZERO_3M',
        source: 'Website',
        status: 'New',
        notes: 'Looking for 3BHK apartment in Sector 22',
        tags: 'hot-lead,first-time-buyer,urgent',
      };

      const transformedData = csvRowToObject(csvRow);
      const result = createBuyerSchema.safeParse(transformedData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fullName).toBe('John Smith');
        expect(result.data.budgetMin).toBe(2500000);
        expect(result.data.budgetMax).toBe(3500000);
        expect(result.data.tags).toEqual(['hot-lead', 'first-time-buyer', 'urgent']);
      }
    });

    test('should handle CSV row with minimal required fields', () => {
      const csvRow = {
        fullName: 'Jane Doe',
        phone: '8765432109',
        city: 'Mohali',
        propertyType: 'Plot',
        purpose: 'Buy',
        timeline: 'GT_6M',
        source: 'Referral',
        // Optional fields missing
        email: '',
        bhk: '',
        budgetMin: '',
        budgetMax: '',
        status: '',
        notes: '',
        tags: '',
      };

      const transformedData = csvRowToObject(csvRow);
      const result = createBuyerSchema.safeParse(transformedData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fullName).toBe('Jane Doe');
        expect(result.data.email).toBe('');
        expect(result.data.budgetMin).toBeNull();
        expect(result.data.tags).toEqual([]);
      }
    });

    test('should fail CSV row with invalid budget range', () => {
      const csvRow = {
        fullName: 'Invalid Budget User',
        phone: '7654321098',
        city: 'Zirakpur',
        propertyType: 'Villa',
        bhk: 'BHK4',
        purpose: 'Buy',
        budgetMin: '5,000,000', // Higher than max
        budgetMax: '3,000,000', // Lower than min
        timeline: 'THREE_6M',
        source: 'Walk_in',
      };

      const transformedData = csvRowToObject(csvRow);
      const result = createBuyerSchema.safeParse(transformedData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const budgetError = result.error.issues.find(
          issue => issue.path.includes('budgetMax')
        );
        expect(budgetError?.message).toBe('budgetMax must be >= budgetMin');
      }
    });

    test('should fail CSV row with invalid phone format', () => {
      const csvRow = {
        fullName: 'Invalid Phone User',
        phone: '123-456-7890', // Invalid format with dashes
        city: 'Panchkula',
        propertyType: 'Office',
        purpose: 'Rent',
        timeline: 'Exploring',
        source: 'Call',
      };

      const transformedData = csvRowToObject(csvRow);
      const result = createBuyerSchema.safeParse(transformedData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const phoneError = result.error.issues.find(
          issue => issue.path.includes('phone')
        );
        expect(phoneError?.message).toBe('phone must be 10-15 digits');
      }
    });

    test('should fail CSV row missing BHK for apartment', () => {
      const csvRow = {
        fullName: 'Missing BHK User',
        phone: '6543210987',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        // bhk missing for apartment
        purpose: 'Buy',
        timeline: 'ZERO_3M',
        source: 'Website',
      };

      const transformedData = csvRowToObject(csvRow);
      const result = createBuyerSchema.safeParse(transformedData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const bhkError = result.error.issues.find(
          issue => issue.path.includes('bhk')
        );
        expect(bhkError?.message).toBe('bhk required for Apartment/Villa');
      }
    });

    test('should handle CSV row with whitespace and formatting issues', () => {
      const csvRow = {
        fullName: '  John Whitespace  ',
        email: '  john@example.com  ',
        phone: '  9876543210  ',
        city: '  Chandigarh  ',
        propertyType: '  Plot  ',
        purpose: '  Buy  ',
        timeline: '  GT_6M  ',
        source: '  Website  ',
        notes: '  Some notes with spaces  ',
        tags: '  tag1,  tag2  ,tag3  ',
      };

      const transformedData = csvRowToObject(csvRow);
      const result = createBuyerSchema.safeParse(transformedData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fullName).toBe('John Whitespace');
        expect(result.data.email).toBe('john@example.com');
        expect(result.data.phone).toBe('9876543210');
        expect(result.data.city).toBe('Chandigarh');
        expect(result.data.notes).toBe('Some notes with spaces');
        expect(result.data.tags).toEqual(['tag1', 'tag2', 'tag3']);
      }
    });

    test('should handle CSV row with budget formatting (commas, spaces)', () => {
      const csvRow = {
        fullName: 'Budget Format Test',
        phone: '5432109876',
        city: 'Mohali',
        propertyType: 'Villa',
        bhk: 'BHK2',
        purpose: 'Buy',
        budgetMin: ' 2,50,000 ', // Indian number format with spaces
        budgetMax: '3,75,000',   // Standard comma format
        timeline: 'THREE_6M',
        source: 'Referral',
      };

      const transformedData = csvRowToObject(csvRow);
      const result = createBuyerSchema.safeParse(transformedData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.budgetMin).toBe(250000);
        expect(result.data.budgetMax).toBe(375000);
      }
    });

    test('should validate CSV row with all enum values', () => {
      const enumTestCases = [
        {
          city: 'Chandigarh',
          propertyType: 'Apartment',
          bhk: 'BHK1',
          purpose: 'Buy',
          timeline: 'ZERO_3M',
          source: 'Website',
          status: 'New'
        },
        {
          city: 'Mohali',
          propertyType: 'Villa',
          bhk: 'Studio',
          purpose: 'Rent',
          timeline: 'THREE_6M',
          source: 'Referral',
          status: 'Qualified'
        },
        {
          city: 'Other',
          propertyType: 'Retail',
          purpose: 'Buy',
          timeline: 'Exploring',
          source: 'Other',
          status: 'Converted'
        }
      ];

      enumTestCases.forEach((testCase, index) => {
        const csvRow = {
          fullName: `Enum Test User ${index + 1}`,
          phone: `987654321${index}`,
          ...testCase,
        };

        const transformedData = csvRowToObject(csvRow);
        const result = createBuyerSchema.safeParse(transformedData);

        expect(result.success).toBe(true);
      });
    });
  });

  describe('CSV Batch Validation', () => {
    test('should validate multiple CSV rows and return validation results', () => {
      const csvRows = [
        {
          fullName: 'Valid User 1',
          phone: '9876543210',
          city: 'Chandigarh',
          propertyType: 'Plot',
          purpose: 'Buy',
          timeline: 'ZERO_3M',
          source: 'Website',
        },
        {
          fullName: 'Invalid User',
          phone: '123', // Invalid phone
          city: 'Chandigarh',
          propertyType: 'Apartment',
          // Missing BHK for apartment
          purpose: 'Buy',
          timeline: 'ZERO_3M',
          source: 'Website',
        },
        {
          fullName: 'Valid User 2',
          phone: '8765432109',
          city: 'Mohali',
          propertyType: 'Villa',
          bhk: 'BHK3',
          purpose: 'Rent',
          timeline: 'GT_6M',
          source: 'Referral',
        }
      ];

      const csvRowToObject = (csvRow: CSVRow) => ({
        fullName: csvRow.fullName?.trim(),
        email: csvRow.email?.trim() || '',
        phone: csvRow.phone?.trim(),
        city: csvRow.city?.trim(),
        propertyType: csvRow.propertyType?.trim(),
        bhk: csvRow.bhk?.trim() || null,
        purpose: csvRow.purpose?.trim(),
        budgetMin: csvRow.budgetMin ? parseInt(csvRow.budgetMin.toString().replace(/,/g, '')) : null,
        budgetMax: csvRow.budgetMax ? parseInt(csvRow.budgetMax.toString().replace(/,/g, '')) : null,
        timeline: csvRow.timeline?.trim(),
        source: csvRow.source?.trim(),
        status: csvRow.status?.trim() || undefined,
        notes: csvRow.notes?.trim() || null,
        tags: csvRow.tags ? csvRow.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
      });

      const results = csvRows.map((row, index) => {
        const transformedData = csvRowToObject(row);
        const result = createBuyerSchema.safeParse(transformedData);
        return {
          rowIndex: index + 1,
          success: result.success,
          data: result.success ? result.data : null,
          errors: result.success ? null : result.error.issues
        };
      });

      // Should have 2 valid and 1 invalid row
      const validRows = results.filter(r => r.success);
      const invalidRows = results.filter(r => !r.success);

      expect(validRows).toHaveLength(2);
      expect(invalidRows).toHaveLength(1);
      expect(invalidRows[0].rowIndex).toBe(2); // Second row is invalid
    });
  });
});
