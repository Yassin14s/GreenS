import { PDFDocument, rgb, StandardFonts, PDFName, PDFArray } from 'pdf-lib';
import { generateSignatureId } from './signatureUtils';

export async function signPDF(
  pdfBytes: ArrayBuffer,
  signerName: string,
  organization: string,
  role: string
): Promise<{ signedPdfBytes: Uint8Array; signatureId: string }> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    
    if (!pdfDoc) {
      throw new Error('Failed to load PDF document.');
    }
    
    if (!pdfDoc.context) {
      throw new Error('PDF document context is not available.');
    }

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width } = firstPage.getSize();

    const signatureId = generateSignatureId();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Single line signature text with all information
    const signatureText = `Signed by ${signerName}${organization ? ` - ${organization}` : ''}${role ? ` (${role})` : ''} - ${dateStr}`;
    const verifyText = 'Verify Signature';

    // Use smaller font size (6pt) and calculate dimensions
    const fontSize = 6;
    const signatureTextWidth = font.widthOfTextAtSize(signatureText, fontSize);
    const verifyTextWidth = font.widthOfTextAtSize(verifyText, fontSize);
    const totalWidth = signatureTextWidth + 20 + verifyTextWidth;
    
    // Position at bottom center
    const startX = (width - totalWidth) / 2;
    const startY = 20; // 20 points from bottom

    // Draw signature background
    firstPage.drawRectangle({
      x: startX - 5,
      y: startY - 2,
      width: totalWidth + 10,
      height: fontSize + 4,
      color: rgb(0.98, 0.98, 0.98),
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 0.5,
      opacity: 1
    });

    // Draw signature text
    firstPage.drawText(signatureText, {
      x: startX,
      y: startY,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2)
    });

    // Draw verification link
    firstPage.drawText(verifyText, {
      x: startX + signatureTextWidth + 20,
      y: startY,
      size: fontSize,
      font,
      color: rgb(0.1, 0.4, 0.9)
    });

    // Add verification link annotation
    const linkAnnotation = {
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [
        startX + signatureTextWidth + 20,
        startY - 2,
        startX + signatureTextWidth + 20 + verifyTextWidth,
        startY + fontSize + 2
      ],
      Border: [0, 0, 0],
      C: [0, 0, 1],
      A: {
        Type: 'Action',
        S: 'URI',
        URI: `${window.location.origin}/verify/${signatureId}`
      }
    };

    const linkRef = pdfDoc.context.register(
      pdfDoc.context.obj(linkAnnotation)
    );
    
    const existingAnnots = firstPage.node.lookupMaybe(
      'Annots',
      PDFArray
    );
    
    if (existingAnnots) {
      existingAnnots.push(linkRef);
    } else {
      firstPage.node.set(
        PDFName.of('Annots'),
        pdfDoc.context.obj([linkRef])
      );
    }

    const signedPdfBytes = await pdfDoc.save();

    return {
      signedPdfBytes: new Uint8Array(signedPdfBytes),
      signatureId
    };
  } catch (error: any) {
    console.error('Error signing PDF:', error);
    throw new Error(`Failed to sign PDF: ${error.message}`);
  }
}