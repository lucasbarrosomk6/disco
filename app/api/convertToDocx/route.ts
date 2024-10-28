import { NextRequest, NextResponse } from 'next/server';
import { mdToPdf } from 'md-to-pdf';
import JSZip from 'jszip';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { markdown, filename } = await req.json();
    const pdf = await mdToPdf(
      { content: markdown },
      { 
        stylesheet: [path.resolve('src/app/api/convertToDocx/markdown.css')],
        pdf_options: { format: 'A4' },
        highlight_style: path.resolve('src/app/api/convertToDocx/highlight-style') // Use a built-in style
      }
    );

    if (pdf && pdf.content) {
      return new NextResponse(pdf.content, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename || 'document.pdf'}"`,
        },
      });
    } else {
      throw new Error('Failed to generate PDF');
    }
  } catch (error) {
    console.error('Error converting to PDF:', error);
    return NextResponse.json(
      { error: 'Failed to convert to PDF' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { markdowns } = await req.json();
    const pdfBuffers = await Promise.all(
      markdowns.map((md: string) =>
        mdToPdf(
          { content: md },
          { 
            stylesheet: [path.resolve('src/app/api/convertToDocx/markdown.css')],
            highlight_style: 'monokai-sublime' // Use a built-in style
          }
        ).then(pdf => pdf.content)
      )
    );

    const zip = new JSZip();
    pdfBuffers.forEach((buffer, index) => {
      zip.file(`document_${index + 1}.pdf`, buffer);
    });

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="documents.zip"',
      },
    });
  } catch (error) {
    console.error('Error converting multiple files to PDF:', error);
    return NextResponse.json(
      { error: 'Failed to convert files to PDF' },
      { status: 500 }
    );
  }
}