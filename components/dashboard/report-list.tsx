"use client"
import { Product, Report } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '../ui/input';
import { MoreHorizontal, Pencil, Plus, Trash } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CreateReportDialog from '../ui/create-report-dialog';
interface ReportListProps {
    reports: Report[];
    userId: number;
}

export function ReportList({ reports: initialReports, userId }: ReportListProps) {
    const [reports, setReports] = useState<Report[]>(initialReports);
    const [createReportDialogOpen, setCreateReportDialogOpen] = useState(false);
    const [selectedReportIds, setSelectedReportIds] = useState<number[]>([]);
    const [selectedReports, setSelectedReports] = useState<Report[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteReportId, setDeleteReportId] = useState<number | null>(null);
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch(`/api/dashboard/products?userId=${userId}`);
            const data = await res.json();

            setProducts(data);
        };

        fetchProducts();
    }, []);

    const filteredReports = selectedReportIds.length > 0
        ? reports.filter((report) => selectedReportIds.includes(report.id))
        : reports;
    const handleDeleteReport = async (id: number) => {
        try {
            const response = await fetch(`/api/dashboard/reports/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete report');
            }

            setReports(reports.filter((report) => report.id !== id));
            setDeleteReportId(null);
        } catch (error) {
            console.error('Error deleting report:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    const handleReportSelect = (report: Report) => {
        if (selectedReports.includes(report)) {
            setSelectedReports(selectedReports.filter((r) => r !== report));
        } else {
            setSelectedReports([...selectedReports, report]);
        }
    };

    const handleExportPDF = () => {
        // TODO: Implement PDF export functionality
        console.log('Exporting selected reports as PDF:', selectedReports);
    };
    useEffect(() => {
        if (deleteReportId === null) {
            // Remove pointer-events: none from the body
            document.body.style.pointerEvents = '';
            // Remove any inline styles from the body
            document.body.removeAttribute('style');
            // Remove any classes that might have been added to the body
            document.body.classList.remove('dialog-open', 'modal-open', 'prevent-scroll');
            // Remove any lingering overlays
            const overlays = document.querySelectorAll(
                '[data-radix-dialog-overlay], .dialog-overlay, .modal-overlay'
            );
            overlays.forEach((overlay) => overlay.remove());
        }
    }, [deleteReportId]);
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Button onClick={() => setCreateReportDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add report
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Report Name</TableHead>
                            <TableHead className="w-[50%]">Company</TableHead>
                            <TableHead className="w-[50%]">Product</TableHead>
                            <TableHead className="w-[10%] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No reports found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={`/dashboard/reports/${report.id}`}
                                            className="hover:underline"
                                        >
                                            {`${report.company} - ${report.productName}`}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="font-medium">

                                        {report.company}
                                    </TableCell>
                                    <TableCell className="font-medium">

                                        {report.company}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setDeleteReportId(report.id)}>
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <CreateReportDialog products={products} open={createReportDialogOpen} setOpen={setCreateReportDialogOpen} />
            <Dialog
                open={deleteReportId !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteReportId(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this report?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the report and remove
                            its data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteReportId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteReportId && handleDeleteReport(deleteReportId)}
                        >
                            Delete Report
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 