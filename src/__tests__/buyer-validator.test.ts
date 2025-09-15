import { buyerBase, createBuyerSchema } from '../app/lib/validators/buyer';

describe('Buyer Validator', () => {
  describe('Budget Validation', () => {
    const validBuyerData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      city: 'Chandigarh' as const,
      propertyType: 'Apartment' as const,
      bhk: 'BHK2' as const,
      purpose: 'Buy' as const,
      timeline: 'ZERO_3M' as const,
      source: 'Website' as const,
      tags: [],
    };

    test('should pass when budgetMax is greater than budgetMin', () => {
      const data = {
        ...validBuyerData,
        budgetMin: 1000000,
        budgetMax: 2000000,
      };

      const result = createBuyerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should pass when budgetMax equals budgetMin', () => {
      const data = {
        ...validBuyerData,
        budgetMin: 1500000,
        budgetMax: 1500000,
      };

      const result = createBuyerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should fail when budgetMax is less than budgetMin', () => {
      const data = {
        ...validBuyerData,
        budgetMin: 2000000,
        budgetMax: 1000000,
      };

      const result = createBuyerSchema.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const budgetError = result.error.issues.find(
          issue => issue.path.includes('budgetMax')
        );
        expect(budgetError).toBeDefined();
        expect(budgetError?.message).toBe('budgetMax must be >= budgetMin');
      }
    });

    test('should pass when budgetMin is null and budgetMax has value', () => {
      const data = {
        ...validBuyerData,
        budgetMin: null,
        budgetMax: 2000000,
      };

      const result = createBuyerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should pass when budgetMax is null and budgetMin has value', () => {
      const data = {
        ...validBuyerData,
        budgetMin: 1000000,
        budgetMax: null,
      };

      const result = createBuyerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should pass when both budgets are null', () => {
      const data = {
        ...validBuyerData,
        budgetMin: null,
        budgetMax: null,
      };

      const result = createBuyerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should fail with negative budgetMin', () => {
      const data = {
        ...validBuyerData,
        budgetMin: -100000,
        budgetMax: 2000000,
      };

      const result = buyerBase.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const budgetError = result.error.issues.find(
          issue => issue.path.includes('budgetMin')
        );
        expect(budgetError).toBeDefined();
      }
    });

    test('should fail with zero budgetMin', () => {
      const data = {
        ...validBuyerData,
        budgetMin: 0,
        budgetMax: 2000000,
      };

      const result = buyerBase.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const budgetError = result.error.issues.find(
          issue => issue.path.includes('budgetMin')
        );
        expect(budgetError).toBeDefined();
      }
    });

    test('should fail with non-integer budgetMin', () => {
      const data = {
        ...validBuyerData,
        budgetMin: 1000000.5,
        budgetMax: 2000000,
      };

      const result = buyerBase.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const budgetError = result.error.issues.find(
          issue => issue.path.includes('budgetMin')
        );
        expect(budgetError).toBeDefined();
      }
    });
  });

  describe('BHK Validation for Property Types', () => {
    const baseBuyerData = {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '9876543210',
      city: 'Mohali' as const,
      purpose: 'Buy' as const,
      timeline: 'THREE_6M' as const,
      source: 'Referral' as const,
      tags: [],
    };

    test('should require BHK for Apartment property type', () => {
      const data = {
        ...baseBuyerData,
        propertyType: 'Apartment' as const,
        // bhk is missing
      };

      const result = createBuyerSchema.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const bhkError = result.error.issues.find(
          issue => issue.path.includes('bhk')
        );
        expect(bhkError).toBeDefined();
        expect(bhkError?.message).toBe('bhk required for Apartment/Villa');
      }
    });

    test('should require BHK for Villa property type', () => {
      const data = {
        ...baseBuyerData,
        propertyType: 'Villa' as const,
        // bhk is missing
      };

      const result = createBuyerSchema.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const bhkError = result.error.issues.find(
          issue => issue.path.includes('bhk')
        );
        expect(bhkError).toBeDefined();
        expect(bhkError?.message).toBe('bhk required for Apartment/Villa');
      }
    });

    test('should not require BHK for Plot property type', () => {
      const data = {
        ...baseBuyerData,
        propertyType: 'Plot' as const,
        // bhk is missing, but should be fine for Plot
      };

      const result = createBuyerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should not require BHK for Office property type', () => {
      const data = {
        ...baseBuyerData,
        propertyType: 'Office' as const,
        // bhk is missing, but should be fine for Office
      };

      const result = createBuyerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should accept valid BHK values for Apartment', () => {
      const validBHKValues = ['BHK1', 'BHK2', 'BHK3', 'BHK4', 'Studio'] as const;
      
      validBHKValues.forEach(bhk => {
        const data = {
          ...baseBuyerData,
          propertyType: 'Apartment' as const,
          bhk,
        };

        const result = createBuyerSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Phone Number Validation', () => {
    const baseBuyerData = {
      fullName: 'Test User',
      email: 'test@example.com',
      city: 'Chandigarh' as const,
      propertyType: 'Plot' as const,
      purpose: 'Buy' as const,
      timeline: 'GT_6M' as const,
      source: 'Call' as const,
      tags: [],
    };

    test('should accept valid 10-digit phone number', () => {
      const data = {
        ...baseBuyerData,
        phone: '9876543210',
      };

      const result = buyerBase.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should accept valid 15-digit phone number', () => {
      const data = {
        ...baseBuyerData,
        phone: '919876543210123',
      };

      const result = buyerBase.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should reject phone number with less than 10 digits', () => {
      const data = {
        ...baseBuyerData,
        phone: '987654321',
      };

      const result = buyerBase.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const phoneError = result.error.issues.find(
          issue => issue.path.includes('phone')
        );
        expect(phoneError).toBeDefined();
        expect(phoneError?.message).toBe('phone must be 10-15 digits');
      }
    });

    test('should reject phone number with more than 15 digits', () => {
      const data = {
        ...baseBuyerData,
        phone: '9876543210123456',
      };

      const result = buyerBase.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const phoneError = result.error.issues.find(
          issue => issue.path.includes('phone')
        );
        expect(phoneError).toBeDefined();
        expect(phoneError?.message).toBe('phone must be 10-15 digits');
      }
    });

    test('should reject phone number with non-numeric characters', () => {
      const data = {
        ...baseBuyerData,
        phone: '987-654-3210',
      };

      const result = buyerBase.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const phoneError = result.error.issues.find(
          issue => issue.path.includes('phone')
        );
        expect(phoneError).toBeDefined();
        expect(phoneError?.message).toBe('phone must be 10-15 digits');
      }
    });
  });

  describe('Email Validation', () => {
    const baseBuyerData = {
      fullName: 'Test User',
      phone: '9876543210',
      city: 'Panchkula' as const,
      propertyType: 'Retail' as const,
      purpose: 'Rent' as const,
      timeline: 'Exploring' as const,
      source: 'Other' as const,
      tags: [],
    };

    test('should accept valid email', () => {
      const data = {
        ...baseBuyerData,
        email: 'test@example.com',
      };

      const result = buyerBase.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should accept empty string for email', () => {
      const data = {
        ...baseBuyerData,
        email: '',
      };

      const result = buyerBase.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should accept null for email', () => {
      const data = {
        ...baseBuyerData,
        email: null,
      };

      const result = buyerBase.safeParse(data);
      expect(result.success).toBe(true);
    });

    test('should reject invalid email format', () => {
      const data = {
        ...baseBuyerData,
        email: 'invalid-email',
      };

      const result = buyerBase.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const emailError = result.error.issues.find(
          issue => issue.path.includes('email')
        );
        expect(emailError).toBeDefined();
      }
    });
  });
});
