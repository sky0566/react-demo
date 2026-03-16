import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface CartItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { items } = (await request.json()) as { items: CartItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items' }, { status: 400 });
    }

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595, 842]); // A4
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const { height } = page.getSize();

    const blue = rgb(0.169, 0.424, 0.69); // #2B6CB0
    const gray = rgb(0.4, 0.4, 0.4);
    const lightGray = rgb(0.85, 0.85, 0.85);
    let y = height - 50;

    // Header
    page.drawText('Gallop Lift Parts', { x: 50, y, font: fontBold, size: 22, color: blue });
    y -= 20;
    page.drawText('Quote Request Document', { x: 50, y, font, size: 11, color: gray });
    y -= 15;
    page.drawText(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { x: 50, y, font, size: 10, color: gray });
    y -= 30;

    // Divider
    page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: lightGray });
    y -= 25;

    // Table header
    page.drawText('#', { x: 50, y, font: fontBold, size: 10, color: blue });
    page.drawText('Product Name', { x: 75, y, font: fontBold, size: 10, color: blue });
    page.drawText('SKU', { x: 370, y, font: fontBold, size: 10, color: blue });
    page.drawText('Qty', { x: 480, y, font: fontBold, size: 10, color: blue });
    y -= 8;
    page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 0.5, color: lightGray });
    y -= 15;

    // Items
    items.forEach((item, idx) => {
      if (y < 80) {
        // Would need a new page for many items
        return;
      }
      const name = item.name.length > 50 ? item.name.slice(0, 47) + '...' : item.name;
      page.drawText(`${idx + 1}`, { x: 50, y, font, size: 10, color: gray });
      page.drawText(name, { x: 75, y, font, size: 10, color: rgb(0.15, 0.15, 0.15) });
      page.drawText(item.sku, { x: 370, y, font, size: 10, color: gray });
      page.drawText(`${item.quantity}`, { x: 480, y, font, size: 10, color: rgb(0.15, 0.15, 0.15) });
      y -= 20;
    });

    y -= 10;
    page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: lightGray });
    y -= 20;
    page.drawText(`Total Items: ${items.reduce((s, i) => s + i.quantity, 0)}`, { x: 50, y, font: fontBold, size: 11, color: blue });

    // Footer
    y -= 40;
    page.drawText('Contact us for pricing:', { x: 50, y, font: fontBold, size: 11, color: rgb(0.15, 0.15, 0.15) });
    y -= 18;
    page.drawText('Email: info@gallopliftparts.com  |  Phone: +86 17365368201', { x: 50, y, font, size: 10, color: gray });
    y -= 15;
    page.drawText('WhatsApp: +86 17365368201  |  www.gallopliftparts.com', { x: 50, y, font, size: 10, color: gray });
    y -= 15;
    page.drawText('Suzhou Gallop Technology Co., Ltd. | No.128 Jinji Lake Rod, SIP, Suzhou, China', { x: 50, y, font, size: 9, color: lightGray });

    const pdfBytes = await pdf.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Gallop-Quote.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
