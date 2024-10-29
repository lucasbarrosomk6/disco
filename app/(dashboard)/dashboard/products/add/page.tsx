"use client"
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import FileUpload from '../components/FileUpload';
import { Document } from 'langchain/document';
import { Loader2 } from 'lucide-react';
import ProductBio from '../components/ProductBio';
import { useRouter } from 'next/navigation';

export default function Component() {
  const [files, setFiles] = useState<File[]>([]);
  const [productBio, setProductBio] = useState<Record<string, string | string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setIsGenerating(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/documentLoader', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { documents }: { documents: Document[] } = await response.json();
        console.log('Uploaded documents:', documents);

        // Send documents to the endpoint via POST request
        const genBioResponse = await fetch('/api/dashboard/products/add/genProductBio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(documents),
        });

        if (!genBioResponse.ok) {
          console.error('Failed to generate product bio');
          return;
        }

        const reader = genBioResponse.body!.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let accumulatedText = '';

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value, { stream: !done });
          accumulatedText += chunkValue;

          let lines = accumulatedText.split('\n');
          accumulatedText = lines.pop() || '';

          for (let line of lines) {
            if (line.trim() === '') continue;
            try {
              const data = JSON.parse(line);
              setProductBio((prevBio) => ({
                ...prevBio,
                [data.variable]: data.answer,
              }));
            } catch (error) {
              console.error('Failed to parse line', line, error);
            }
          }
        }
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleEdit = (variable: string, value: string | string[]) => {
    setProductBio((prevBio) => ({
      ...prevBio,
      [variable]: value,
    }));
  };

  const handleReset = () => {

    setProductBio({});
    setIsLoading(false);
  };

  const handleCreateProduct = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/dashboard/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productBio),
      });

      if (response.ok) {
        const product = await response.json();
        console.log('Product created:', product);
        router.push('/dashboard/products');
      } else {
        console.error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Add new product</h1>
      {Object.keys(productBio).length === 0 && !isLoading ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <p className="text-lg text-gray-700 mb-6">
            You already wrote so much about your company, no sense doing it again. Give us some relevant company docs and we'll get up to speed quick!
          </p>
          <FileUpload files={files} onDrop={onDrop} onRemove={removeFile} />
        </div>
      ) : (
        <ProductBio productBio={productBio} isGenerating={isGenerating} onEdit={handleEdit} />
      )}
      <div className="flex space-x-4">
        {Object.keys(productBio).length > 0 && (
          <Button variant="secondary" className="w-full" onClick={handleReset}>
            Switch to File Upload
          </Button>
        )}
        <Button
          className="w-full"
          onClick={Object.keys(productBio).length > 0 ? handleCreateProduct : handleUpload}
          disabled={isLoading || (files.length === 0 && Object.keys(productBio).length === 0)}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </div>
          ) : (
            Object.keys(productBio).length > 0 ? 'Create Product' : 'Upload and Continue'
          )}
        </Button>
      </div>
    </div>
  );
}
