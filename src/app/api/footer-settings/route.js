import { NextResponse } from 'next/server';

/**
 * API Route for Footer Settings
 * 
 * This is a basic implementation. In production, you should:
 * 1. Connect to a real database (Prisma, MongoDB, etc.)
 * 2. Add authentication middleware
 * 3. Add input validation
 * 4. Implement proper error handling
 * 5. Add rate limiting
 */

// Temporary in-memory storage (replace with database)
let footerSettings = {
  clinicName: "KLINIK DOKTER HEWAN FANINA",
  address: "Jl Bedoet No.74, Mangunan, Caturharjo, Kec. Sleman, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55515",
  operatingHours: "Senin - Jumat: 08:00 - 17:00 WIB",
  phone: "+6212345678999",
  phoneDisplay: "+62-123-4567-8999",
  socialMedia: [
    { 
      name: 'Youtube', 
      href: 'https://youtube.com/@klinikfanina',
      icon: 'youtube'
    },
    { 
      name: 'Instagram', 
      href: 'https://instagram.com/klinikfanina',
      icon: 'instagram'
    },
    { 
      name: 'Twitter', 
      href: 'https://twitter.com/klinikfanina',
      icon: 'twitter'
    },
    { 
      name: 'TikTok', 
      href: 'https://tiktok.com/@klinikfanina',
      icon: 'tiktok'
    },
    { 
      name: 'LinkedIn', 
      href: 'https://linkedin.com/company/klinikfanina',
      icon: 'linkedin'
    },
  ],
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.3!2d110.378!3d-7.723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNDMnMjIuOCJTIDExMMKwMjInNDAuOCJF!5e0!3m2!1sen!2sid!4v1729000000000!5m2!1sen!2sid",
  copyrightText: "Klinik Dokter Hewan Fanina. All Rights Reserved.",
  lastUpdated: new Date().toISOString(),
  updatedBy: "system"
};

/**
 * GET /api/footer-settings
 * Retrieve footer settings
 */
export async function GET(request) {
  try {
    // TODO: Replace with actual database query
    // Example with Prisma:
    // const settings = await prisma.footerSettings.findFirst({
    //   include: {
    //     socialMedia: {
    //       where: { isActive: true },
    //       orderBy: { order: 'asc' }
    //     }
    //   }
    // });

    return NextResponse.json(footerSettings, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error('Error fetching footer settings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch footer settings',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/footer-settings
 * Update footer settings
 * 
 * TODO: Add authentication middleware
 * Example: if (!isAuthenticated(request)) return 401
 */
export async function PUT(request) {
  try {
    const data = await request.json();

    // Validation
    const errors = validateFooterData(data);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database update
    // Example with Prisma:
    // const updated = await prisma.footerSettings.update({
    //   where: { id: 1 },
    //   data: {
    //     clinicName: data.clinicName,
    //     address: data.address,
    //     operatingHours: data.operatingHours,
    //     phone: data.phone,
    //     phoneDisplay: data.phoneDisplay,
    //     mapEmbedUrl: data.mapEmbedUrl,
    //     copyrightText: data.copyrightText,
    //     updatedAt: new Date(),
    //     updatedBy: session.user.email
    //   }
    // });

    // Update social media links
    // await prisma.socialMediaLink.deleteMany({ 
    //   where: { footerSettingsId: 1 } 
    // });
    // for (let i = 0; i < data.socialMedia.length; i++) {
    //   await prisma.socialMediaLink.create({
    //     data: {
    //       ...data.socialMedia[i],
    //       order: i,
    //       isActive: true,
    //       footerSettingsId: 1
    //     }
    //   });
    // }

    // Temporary: Update in-memory storage
    footerSettings = {
      ...data,
      lastUpdated: new Date().toISOString(),
      updatedBy: "admin" // TODO: Get from session
    };

    // Revalidate cache (Next.js ISR)
    // revalidatePath('/'); // Revalidate all pages that use footer

    return NextResponse.json({ 
      message: 'Footer settings updated successfully',
      data: footerSettings 
    });
  } catch (error) {
    console.error('Error updating footer settings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update footer settings',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/footer-settings
 * Create initial footer settings
 * (Optional - useful for first-time setup)
 */
export async function POST(request) {
  try {
    const data = await request.json();

    // Validation
    const errors = validateFooterData(data);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // TODO: Check if settings already exist
    // TODO: Create new settings in database

    return NextResponse.json(
      { 
        message: 'Footer settings created successfully',
        data 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating footer settings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create footer settings',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * Validate footer data
 * @param {Object} data - Footer data to validate
 * @returns {Object} - Validation errors
 */
function validateFooterData(data) {
  const errors = {};

  // Clinic Name
  if (!data.clinicName || data.clinicName.trim().length < 3) {
    errors.clinicName = 'Nama klinik harus minimal 3 karakter';
  }

  // Address
  if (!data.address || data.address.trim().length < 10) {
    errors.address = 'Alamat harus minimal 10 karakter';
  }

  // Operating Hours
  if (!data.operatingHours || data.operatingHours.trim().length < 5) {
    errors.operatingHours = 'Jam operasional harus diisi';
  }

  // Phone
  if (!data.phone || !data.phone.match(/^\+?[0-9\-\s]+$/)) {
    errors.phone = 'Format nomor telepon tidak valid';
  }

  // Phone Display
  if (!data.phoneDisplay) {
    errors.phoneDisplay = 'Nomor telepon display harus diisi';
  }

  // Social Media
  if (!Array.isArray(data.socialMedia) || data.socialMedia.length === 0) {
    errors.socialMedia = 'Minimal satu social media harus diisi';
  } else {
    data.socialMedia.forEach((social, index) => {
      if (!social.name || !social.href || !social.icon) {
        errors[`socialMedia[${index}]`] = 'Data social media tidak lengkap';
      }
      
      // Validate URL
      try {
        new URL(social.href);
      } catch (e) {
        errors[`socialMedia[${index}].href`] = 'URL tidak valid';
      }
    });
  }

  // Map Embed URL
  if (!data.mapEmbedUrl) {
    errors.mapEmbedUrl = 'Google Maps embed URL harus diisi';
  } else if (!data.mapEmbedUrl.includes('google.com/maps/embed')) {
    errors.mapEmbedUrl = 'URL harus dari Google Maps embed';
  }

  // Copyright Text
  if (!data.copyrightText) {
    errors.copyrightText = 'Copyright text harus diisi';
  }

  return errors;
}

/**
 * TODO: Implement authentication middleware
 * Example:
 * 
 * import { getServerSession } from "next-auth";
 * 
 * async function isAuthenticated(request) {
 *   const session = await getServerSession();
 *   return session && session.user?.role === 'admin';
 * }
 */



