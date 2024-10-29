'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Product } from '@/lib/db/schema'
import { useRouter } from 'next/navigation'

export default function CreateReportDialog({ products, open, setOpen }: { products: Product[], open: boolean, setOpen: (open: boolean) => void }) {
    const [companyName, setCompanyName] = useState('')
    const [selectedProduct, setSelectedProduct] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitted:', { companyName, selectedProduct });

        try {
            const product = products.find((product) => product.id === Number(selectedProduct))

            const response = await fetch('/api/dashboard/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    company: companyName,
                    productName: product?.productName,
                }),
            });

            if (response.ok) {
                const newReport = await response.json();
                setOpen(false);
                router.push(`/dashboard/reports/${newReport.id}`);
            } else {
                console.error('Failed to create report');
                // Handle error (e.g., show error message to user)
            }
        } catch (error) {
            console.error('Error creating report:', error);
            // Handle error (e.g., show error message to user)
        }
    };
    console.log(selectedProduct)
    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Report</DialogTitle>
                    <DialogDescription>
                        Select a product and company to create a new report.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="company" className="text-right">
                            Company
                        </Label>
                        <Input
                            id="company"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product" className="text-right">
                            Product
                        </Label>
                        <Select
                            value={selectedProduct}
                            onValueChange={setSelectedProduct}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id.toString()}>
                                        {product.productName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="ml-auto">
                        Create Report
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}