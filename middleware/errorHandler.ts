// middleware/errorHandler.ts
import { NextResponse } from 'next/server';

export function handleError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
  
  return NextResponse.json(
    { success: false, error: 'Unknown error occurred' },
    { status: 500 }
  );
}
