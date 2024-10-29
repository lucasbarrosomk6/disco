"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ProductBioProps {
    productBio: Record<string, string | string[]>;
    isGenerating: boolean;
    onEdit: (variable: string, value: string | string[]) => void;
}

const formatTitle = (title: string) => {
    return title.replace(/([A-Z])/g, ' $1').trim();
};

export default function ProductBio({ productBio, isGenerating, onEdit }: ProductBioProps) {
    const [editingVariable, setEditingVariable] = useState('');
    const [editingIndex, setEditingIndex] = useState(-1);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (editingIndex !== -1 && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [editingIndex]);

    const handleEdit = (variable: string, index: number = -1) => {
        setEditingVariable(variable);
        setEditingIndex(index);
    };

    const handleSave = (variable: string, value: string, index: number = -1) => {
        if (index === -1) {
            onEdit(variable, value);
        } else {
            const updatedFeatures = [...(productBio[variable] as string[])];
            updatedFeatures[index] = value;
            onEdit(variable, updatedFeatures);
        }
        setEditingVariable('');
        setEditingIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, variable: string, index: number = -1) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave(variable, e.currentTarget.value, index);
        } else if (e.key === 'Escape') {
            setEditingVariable('');
            setEditingIndex(-1);
        }
    };

    return (
        <div className="mt-8">

            <AnimatePresence>
                {Object.entries(productBio).map(([variable, answer]) => (
                    <motion.div
                        key={variable}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4  container mx-auto px-4 py-8 max-w-4xl"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold mb-2 capitalize">{formatTitle(variable)}</h3>
                            {Array.isArray(answer) ? null : <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleEdit(variable)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>}
                        </div>
                        {editingVariable === variable && editingIndex === -1 ? (
                            <div>
                                <Textarea
                                    defaultValue={answer as string}
                                    value={answer as string}
                                    onChange={(e) => onEdit(variable, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, variable)}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                />
                            </div>
                        ) : Array.isArray(answer) ? (
                            <ul className="list-disc list-inside space-y-4">
                                {answer.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        {editingVariable === variable && editingIndex === index ? (
                                            <Textarea
                                                value={item}
                                                onChange={(e) => onEdit(variable, [
                                                    ...answer.slice(0, index),
                                                    e.target.value,
                                                    ...answer.slice(index + 1),
                                                ])}
                                                onKeyDown={(e) => handleKeyDown(e, variable, index)}
                                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-between w-full">
                                                <span>{item}</span>
                                                <button
                                                    className="text-gray-500 hover:text-gray-700 ml-2"
                                                    onClick={() => handleEdit(variable, index)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>{answer}</p>
                        )}
                    </motion.div>
                ))}
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4"
                    >
                        <div className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <p className="text-gray-500">Generating...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 