import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const hotelId = url.searchParams.get('hotelId');
  
  let endpoint = '/bookings';
  if (userId) endpoint += `?userId=${userId}`;
  if (hotelId) endpoint += `?hotelId=${hotelId}`;
  
  const response = await fetch(`${backendUrl}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}