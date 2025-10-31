import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { NextRequest } from 'next/server';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  return realIp || 'Unknown';
}