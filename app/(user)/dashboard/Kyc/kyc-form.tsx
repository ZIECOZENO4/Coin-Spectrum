"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressSteps } from "./progress-steps";
import { Upload, ArrowLeft, ArrowRight } from 'lucide-react';
import type { FormStep, KYCFormData } from "./kyc";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/utils/useUploadthing";

const steps = ["Personal Info", "Address", "Identity", "Documents", "Review"];

export default function KYCForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<KYCFormData>({} as KYCFormData);
  const { startUpload } = useUploadThing("imageUploader");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.idDocument || !formData.proofOfAddress || !formData.selfie) {
        toast.error('Please upload all required documents');
        return;
      }
  
      // Upload ID Document
      toast.warning('Uploading ID Document...');
      const idDocUpload = await startUpload([formData.idDocument]);
      if (!idDocUpload?.[0]?.url) {
        toast.error('Failed to upload ID Document');
        return;
      }
      toast.success('ID Document uploaded successfully');
  
      // Upload Proof of Address
      toast.warning('Uploading Proof of Address...');
      const proofUpload = await startUpload([formData.proofOfAddress]);
      if (!proofUpload?.[0]?.url) {
        toast.error('Failed to upload Proof of Address');
        return;
      }
      toast.success('Proof of Address uploaded successfully');
  
      // Upload Selfie
      toast.warning('Uploading Selfie...');
      const selfieUpload = await startUpload([formData.selfie]);
      if (!selfieUpload?.[0]?.url) {
        toast.error('Failed to upload Selfie');
        return;
      }
      toast.success('Selfie uploaded successfully');
  
      toast.warning('Submitting KYC information...');
  
      const kycData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        idType: formData.idType,
        idNumber: formData.idNumber,
        idDocumentUrl: idDocUpload[0].url,
        proofOfAddressUrl: proofUpload[0].url,
        selfieUrl: selfieUpload[0].url
      };
  
      const response = await fetch('/api/kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(kycData)
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit KYC');
      }
  
      toast.success('KYC submitted successfully');
      router.push('/verifying');
  
    } catch (error) {
      toast.error(error.message || 'An error occurred while submitting KYC');
      console.error('KYC submission error:', error);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof KYCFormData) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 4MB)
      if (file.size > 4 * 1024 * 1024) {
        toast.error(`${field} must be less than 4MB`);
        return;
      }
  
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${field} must be JPEG, JPG, PNG, or PDF`);
        return;
      }
  
      setFormData(prev => ({ ...prev, [field]: file }));
      toast.success(`${field} selected successfully`);
    }
  };
  
  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="idType">ID Type</Label>
              <Select
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, idType: value as KYCFormData['idType'] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="national_id">National ID</SelectItem>
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                name="idNumber"
                value={formData.idNumber || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Label>ID Document</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="idDocument"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'idDocument')}
                  accept="image/*,.pdf"
                />
                <label
                  htmlFor="idDocument"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Upload ID Document
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Proof of Address</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="proofOfAddress"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'proofOfAddress')}
                  accept="image/*,.pdf"
                />
                <label
                  htmlFor="proofOfAddress"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Upload Proof of Address
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Selfie</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="selfie"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'selfie')}
                  accept="image/*"
                />
                <label
                  htmlFor="selfie"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Upload Selfie
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="font-semibold">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <p>{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Date of Birth:</span>
                  <p>{formData.dateOfBirth}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p>{formData.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <p>{formData.phoneNumber}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Address</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Street:</span>
                  <p>{formData.streetAddress}</p>
                </div>
                <div>
                  <span className="text-gray-500">City:</span>
                  <p>{formData.city}</p>
                </div>
                <div>
                  <span className="text-gray-500">State:</span>
                  <p>{formData.state}</p>
                </div>
                <div>
                  <span className="text-gray-500">Country:</span>
                  <p>{formData.country}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Identity Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">ID Type:</span>
                  <p>{formData.idType}</p>
                </div>
                <div>
                  <span className="text-gray-500">ID Number:</span>
                  <p>{formData.idNumber}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Uploaded Documents</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">ID Document:</span>
                  <p>{formData.idDocument?.name || 'Not uploaded'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Proof of Address:</span>
                  <p>{formData.proofOfAddress?.name || 'Not uploaded'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Selfie:</span>
                  <p>{formData.selfie?.name || 'Not uploaded'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto border border-slate-800">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-yellow-500">KYC Registration</h2>
                <p className="text-gray-500 mt-2">Complete your verification process</p>
              </div>

              <ProgressSteps currentStep={currentStep} steps={steps} />

              <AnimatePresence mode="wait">
                {renderStep(currentStep)}
              </AnimatePresence>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button type="submit" className="bg-yellow-400 hover:bg-yellow-600 text-black">
                  Submit
                </Button>
              ) : (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

