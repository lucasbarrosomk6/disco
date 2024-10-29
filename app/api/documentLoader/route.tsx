import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    const documents = await Promise.all(
        files.map(async (file) => {
            const fileExtension = file.name.split(".").pop()?.toLowerCase();
            const fileBuffer = await file.arrayBuffer();
            let loader;

            switch (fileExtension) {
                case "pptx":
                    loader = new PPTXLoader(new Blob([fileBuffer]));
                    break;
                case "pdf":
                    loader = new PDFLoader(new Blob([fileBuffer]));
                    break;
                case "docx":
                    loader = new DocxLoader(new Blob([fileBuffer]));
                    break;
                case "txt":
                    loader = new TextLoader(new Blob([fileBuffer]));
                    break;
                default:
                    throw new Error(`Unsupported file type: ${fileExtension}`);
            }

            return await loader.load();
        })
    );

    return NextResponse.json({ documents });
}
