import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
    files: File[];
    onDrop: (acceptedFiles: File[]) => void;
    onRemove: (file: File) => void;
}

export default function FileUpload({ files, onDrop, onRemove }: FileUploadProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
                    }`}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-xl font-semibold mb-2">Drag & drop files here</p>
                <p className="text-sm text-gray-500">or click to select files</p>
            </div>

            {files.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Uploaded files:</h2>
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-gray-100 rounded-md p-3">
                                <div className="flex items-center">
                                    <File className="h-5 w-5 text-gray-500 mr-2" />
                                    <span className="text-sm">{file.name}</span>
                                </div>
                                <button onClick={() => onRemove(file)} className="text-red-500 hover:text-red-700">
                                    <X className="h-5 w-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
} 