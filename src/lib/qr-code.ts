import QRCode from 'qrcode';

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  type?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number;
}

export class QRCodeGenerator {
  private static defaultOptions: QRCodeOptions = {
    size: 512,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
  };

  /**
   * Generate QR code as data URL
   */
  static async generateDataURL(
    text: string,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      const dataURL = await QRCode.toDataURL(text, {
        width: opts.size,
        margin: opts.margin,
        color: opts.color,
        errorCorrectionLevel: opts.errorCorrectionLevel,
        type: opts.type,
        quality: opts.quality,
      });
      
      return dataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('QR kod oluşturulamadı');
    }
  }

  /**
   * Generate QR code as buffer
   */
  static async generateBuffer(
    text: string,
    options: QRCodeOptions = {}
  ): Promise<Buffer> {
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      const buffer = await QRCode.toBuffer(text, {
        width: opts.size,
        margin: opts.margin,
        color: opts.color,
        errorCorrectionLevel: opts.errorCorrectionLevel,
        type: opts.type,
        quality: opts.quality,
      });
      
      return buffer;
    } catch (error) {
      console.error('Error generating QR code buffer:', error);
      throw new Error('QR kod buffer oluşturulamadı');
    }
  }

  /**
   * Generate QR code as SVG string
   */
  static async generateSVG(
    text: string,
    options: Partial<QRCodeOptions> = {}
  ): Promise<string> {
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      const svg = await QRCode.toString(text, {
        type: 'svg',
        width: opts.size,
        margin: opts.margin,
        color: opts.color,
        errorCorrectionLevel: opts.errorCorrectionLevel,
      });
      
      return svg;
    } catch (error) {
      console.error('Error generating QR code SVG:', error);
      throw new Error('QR kod SVG oluşturulamadı');
    }
  }

  /**
   * Generate restaurant menu QR code
   */
  static async generateMenuQR(
    restaurantSlug: string,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL}/menu/${restaurantSlug}`;
    return this.generateDataURL(menuUrl, options);
  }

  /**
   * Generate restaurant menu QR code as buffer
   */
  static async generateMenuQRBuffer(
    restaurantSlug: string,
    options: QRCodeOptions = {}
  ): Promise<Buffer> {
    const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL}/menu/${restaurantSlug}`;
    return this.generateBuffer(menuUrl, options);
  }

  /**
   * Generate restaurant menu QR code as SVG
   */
  static async generateMenuQRSVG(
    restaurantSlug: string,
    options: Partial<QRCodeOptions> = {}
  ): Promise<string> {
    const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL}/menu/${restaurantSlug}`;
    return this.generateSVG(menuUrl, options);
  }

  /**
   * Generate customized QR code with restaurant branding
   */
  static async generateBrandedQR(
    restaurantSlug: string,
    brandColors: {
      primary: string;
      secondary: string;
    },
    options: QRCodeOptions = {}
  ): Promise<string> {
    const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL}/menu/${restaurantSlug}`;
    
    const brandedOptions: QRCodeOptions = {
      ...options,
      color: {
        dark: brandColors.primary,
        light: brandColors.secondary,
      },
    };
    
    return this.generateDataURL(menuUrl, brandedOptions);
  }

  /**
   * Validate QR code text
   */
  static validateText(text: string): boolean {
    if (!text || text.trim().length === 0) {
      return false;
    }
    
    // Check if text is too long (QR codes have limits)
    if (text.length > 2953) { // Limit for alphanumeric mode with L error correction
      return false;
    }
    
    return true;
  }

  /**
   * Get QR code info
   */
  static getQRInfo(text: string): {
    isValid: boolean;
    length: number;
    estimatedSize: string;
    recommendedErrorLevel: 'L' | 'M' | 'Q' | 'H';
  } {
    const isValid = this.validateText(text);
    const length = text.length;
    
    let estimatedSize = 'Small';
    let recommendedErrorLevel: 'L' | 'M' | 'Q' | 'H' = 'L';
    
    if (length > 100) {
      estimatedSize = 'Medium';
      recommendedErrorLevel = 'M';
    }
    if (length > 500) {
      estimatedSize = 'Large';
      recommendedErrorLevel = 'Q';
    }
    if (length > 1000) {
      estimatedSize = 'Very Large';
      recommendedErrorLevel = 'H';
    }
    
    return {
      isValid,
      length,
      estimatedSize,
      recommendedErrorLevel,
    };
  }
}

export default QRCodeGenerator;

