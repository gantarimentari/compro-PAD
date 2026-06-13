import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dirPath = path.join(
      process.cwd(),
      'src',
      'components',
      'dashboard',
      'invoice',
      'modals',
      'pdf'
    );

    // Read HTML template
    const htmlPath = path.join(dirPath, 'pdfInvoice.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    // Read CSS template and inject
    const cssPath = path.join(dirPath, 'pdfInvoice.css');
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      htmlContent = htmlContent.replace('{{styles}}', cssContent);
    } else {
      htmlContent = htmlContent.replace('{{styles}}', '');
    }

    // Read logo.svg and convert to Base64 data URL
    let logoBase64 = '';
    try {
      const logoPath = path.join(dirPath, 'logo.svg');
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        logoBase64 = `data:image/svg+xml;base64,${logoBuffer.toString('base64')}`;
      }
    } catch (logoErr) {
      console.warn('Gagal membaca logo.svg:', logoErr);
    }

    return NextResponse.json({
      html: htmlContent,
      logo: logoBase64
    });
  } catch (error) {
    console.error('Error reading PDF template:', error);
    return NextResponse.json(
      { error: 'Gagal membaca template invoice: ' + error.message },
      { status: 500 }
    );
  }
}
