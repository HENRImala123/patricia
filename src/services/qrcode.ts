import QRCode from 'qrcode';

export async function generateQrDataUrl(url: string, size = 280): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: size,
      margin: 1,
      color: {
        dark: '#111318',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Failed to generate QR code data URL', err);
    return '';
  }
}

export async function generateQrSvg(url: string): Promise<string> {
  try {
    return await QRCode.toString(url, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#111318',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Failed to generate QR code SVG', err);
    return '';
  }
}
