"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail } from "lucide-react";

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Account Suspended</h1>
          <p className="text-gray-300">
            Your account has been suspended. Please contact support for assistance.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.location.href = "mailto:support@coinspectrum.com"}
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => window.location.href = "/"}
          >
            Return to Home
          </Button>
        </div>
        
        <div className="mt-6 text-sm text-gray-400">
          <p>If you believe this is an error, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
