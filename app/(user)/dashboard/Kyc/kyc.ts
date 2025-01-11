export interface KYCFormData {
    // Personal Information
    firstName: string
    lastName: string
    dateOfBirth: string
    nationality: string
    phoneNumber: string
    email: string
  
    // Address Information
    streetAddress: string
    city: string
    state: string
    postalCode: string
    country: string
  
    // Identity Information
    idType: 'passport' | 'national_id' | 'drivers_license'
    idNumber: string
    
    // Documents
    idDocument?: File
    proofOfAddress?: File
    selfie?: File
  }
  
  export type FormStep = 'personal' | 'address' | 'identity' | 'documents' | 'review'
  
  