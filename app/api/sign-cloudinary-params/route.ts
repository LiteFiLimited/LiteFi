import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getUserFromRequest } from '@/lib/jwt';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dxbizi45p',
  api_key: process.env.CLOUDINARY_API_KEY || '576182982358129',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'i6smsA5wOP2KoPg_fNqOBOvBkOU',
});

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paramsToSign } = body;

    if (!paramsToSign) {
      return NextResponse.json(
        { error: 'Missing paramsToSign' },
        { status: 400 }
      );
    }

    // Generate signature for the upload parameters
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET || 'i6smsA5wOP2KoPg_fNqOBOvBkOU'
    );

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Error signing Cloudinary params:', error);
    return NextResponse.json(
      { error: 'Failed to sign upload parameters' },
      { status: 500 }
    );
  }
}