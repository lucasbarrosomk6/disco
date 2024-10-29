'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, ChevronDown } from 'lucide-react'
import ReactMarkdown, { Components } from 'react-markdown'
import { saveAs } from 'file-saver';

export interface Discovery {
  id: number
  processIds: number[]
  companyListId: number
  status: string
  output: string
  results: { output: string; companyName: string }[]
}

interface DiscoveryOutputModalProps {
  isOpen: boolean
  onClose: () => void
  discovery: Discovery
}

export function DiscoveryOutputModal({ isOpen, onClose, discovery }: DiscoveryOutputModalProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [selectedOutput, setSelectedOutput] = useState<string>('')

  const handleCompanySelect = (companyName: string) => {
    setSelectedCompanies(prev =>
      prev.includes(companyName)
        ? prev.filter(name => name !== companyName)
        : [...prev, companyName]
    )
  }

  const handleSelectAll = () => {
    setSelectedCompanies(
      selectedCompanies.length === discovery.results.length
        ? []
        : discovery.results.map(result => result.companyName)
    )
  }
  const handleDownloadSelected = async () => {
    const selectedOutputs = discovery.results.filter(result =>
      selectedCompanies.includes(result.companyName)
    );

    if (selectedOutputs.length === 1) {
      const response = await fetch('/api/convertToDocx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown: selectedOutputs[0].output,
          filename: `${selectedOutputs[0].companyName}_output.pdf`
        }),
      });

      const blob = await response.blob();
      saveAs(blob, `${selectedOutputs[0].companyName}_output.pdf`);
    } else {
      const response = await fetch('/api/convertToDocx', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdowns: selectedOutputs.map(output => output.output),
        }),
      });

      const blob = await response.blob();
      saveAs(blob, 'discovery_outputs.zip');
    }
  }

  const handleDownloadAll = async () => {
    const response = await fetch('/api/convertToDocx', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        markdowns: discovery.results.map(result => result.output),
      }),
    });

    const blob = await response.blob();
    saveAs(blob, 'all_discovery_outputs.zip');
  }

  const isMarkdown = (text: string) => {
    return /^#|^\*|^-|^>|^`|^\||^\[/.test(text);
  }
  const MarkdownComponents: Components = {
    h1: ({ children, ...props }: React.ComponentPropsWithoutRef<'h1'>) => <h1 className="text-2xl font-bold mb-4 text-blue-600" {...props}>{children}</h1>,
    h2: ({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => <h2 className="text-xl font-semibold mb-3 text-blue-500" {...props}>{children}</h2>,
    h3: ({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => <h3 className="text-lg font-medium mb-2 text-blue-400" {...props}>{children}</h3>,
    p: ({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) => <p className="mb-4" {...props}>{children}</p>,
    ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => <ul className="list-disc pl-5 mb-4" {...props}>{children}</ul>,
    ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => <ol className="list-decimal pl-5 mb-4" {...props}>{children}</ol>,
    li: ({ children, ...props }: React.ComponentPropsWithoutRef<'li'>) => <li className="mb-1" {...props}>{children}</li>,
    a: ({ href, children, ...props }: React.ComponentPropsWithoutRef<'a'>) => <a href={href} target="_blank" className="text-blue-500 hover:underline" {...props}>{children}</a>,
    blockquote: ({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props}>{children}</blockquote>,

    em: ({ children, ...props }: React.ComponentPropsWithoutRef<'em'>) => <em className="italic" {...props}>{children}</em>,
    strong: ({ children, ...props }: React.ComponentPropsWithoutRef<'strong'>) => <strong className="font-bold" {...props}>{children}</strong>,
    hr: () => <hr className="my-4 border-t border-gray-300" />,
    table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => <table className="border-collapse table-auto w-full my-4" {...props}>{children}</table>,
    th: ({ children, ...props }: React.ComponentPropsWithoutRef<'th'>) => <th className="border border-gray-300 px-4 py-2 bg-gray-100" {...props}>{children}</th>,
    td: ({ children, ...props }: React.ComponentPropsWithoutRef<'td'>) => <td className="border border-gray-300 px-4 py-2" {...props}>{children}</td>,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Discovery Output</DialogTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleDownloadSelected}>
                  Download Selected ({selectedCompanies.length})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadAll}>
                  Download All ({discovery.results.length})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="col-span-1 border-r pr-4">
            <div className="flex items-center mb-2">
              <Checkbox
                id="select-all"
                checked={selectedCompanies.length === discovery.results.length}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="ml-2 text-sm font-medium">
                Select All
              </label>
            </div>
            <ScrollArea className="h-[400px]">
              {discovery.results.map((result, index) => (
                <div key={index} className="flex items-center mb-2" onClick={() => setSelectedOutput(result.output)}>
                  <Checkbox
                    id={`company-${index}`}
                    checked={selectedCompanies.includes(result.companyName)}
                    onCheckedChange={() => handleCompanySelect(result.companyName)}
                  />
                  <p className="ml-2 text-sm cursor-pointer">{result.companyName}</p>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="col-span-2">
            <ScrollArea className="h-[400px] p-4 bg-white rounded-md shadow-inner">
              {selectedOutput ? (
                isMarkdown(selectedOutput) ? (
                  <ReactMarkdown components={MarkdownComponents}>{selectedOutput}</ReactMarkdown>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm">{selectedOutput}</pre>
                )
              ) : (
                <p className="text-gray-500 italic">Select a company to view its output</p>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

}
