import { useState } from 'react'
import { useDispatch } from 'react-redux'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload } from 'lucide-react'
import * as XLSX from 'xlsx'
import { addCompanyList } from '../../../../store/companyListsSlice'

interface AddCompanyListDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function AddCompanyListDialog({
    isOpen,
    onClose,
}: AddCompanyListDialogProps) {
    const dispatch = useDispatch()
    const [listName, setListName] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [startRow, setStartRow] = useState(1)
    const [column, setColumn] = useState('A')
    const [preview, setPreview] = useState<string[]>([])
    const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null)
    const [fullCompanyList, setFullCompanyList] = useState<string[]>([])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return
        const selectedFile = event.target.files[0]
        if (selectedFile) {
            if (
                selectedFile.name.endsWith('.xlsx') ||
                selectedFile.name.endsWith('.xls') ||
                selectedFile.type ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                selectedFile.type === 'application/vnd.ms-excel'
            ) {
                setFile(selectedFile)
                if (!listName) {
                    setListName(selectedFile.name.split('.').slice(0, -1).join('.'))
                }
                const reader = new FileReader()
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer)
                    const wb = XLSX.read(data, { type: 'array' })
                    setWorkbook(wb)
                    updatePreview(wb, startRow, column)
                }
                reader.readAsArrayBuffer(selectedFile)
            } else {
                alert('Please upload a valid Excel file.')
            }
        }
    }

    const handleStartRowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStartRow = parseInt(event.target.value)
        setStartRow(newStartRow)
        if (workbook) {
            updatePreview(workbook, newStartRow, column)
        }
    }

    const handleColumnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newColumn = event.target.value.toUpperCase()
        setColumn(newColumn)
        if (workbook) {
            updatePreview(workbook, startRow, newColumn)
        }
    }

    const updatePreview = (
        wb: XLSX.WorkBook,
        startRow: number,
        column: string
    ) => {
        const sheetName = wb.SheetNames[0]
        const worksheet = wb.Sheets[sheetName]

        const columnNumber = XLSX.utils.decode_col(column)
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')

        const fullData: string[] = []

        // Adjust the end row based on the actual data in the column
        for (let i = startRow; i <= range.e.r + 1; i++) {
            const cellAddress = { c: columnNumber, r: i - 1 }
            const cellRef = XLSX.utils.encode_cell(cellAddress)
            const cell = worksheet[cellRef]
            const cellValue = cell ? String(cell.v).trim() : ''
            if (cellValue !== '') {
                fullData.push(cellValue)
            }
        }

        setFullCompanyList(fullData)
        setPreview(fullData.slice(0, 5))
    }

    const handleUpload = () => {
        if (listName && fullCompanyList.length > 0) {
            const newList = {
                id: Date.now(),
                name: listName,
                companies: fullCompanyList,
            }
            dispatch(addCompanyList(newList))
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Company List</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 ">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="listName" className="text-right">
                            List Name
                        </Label>
                        <Input
                            id="listName"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right">
                            Excel File
                        </Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".xlsx,.xls"
                            className="col-span-3"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startRow" className="text-right">
                            Start Row
                        </Label>
                        <Input
                            id="startRow"
                            type="number"
                            value={startRow}
                            onChange={handleStartRowChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="column" className="text-right">
                            Column
                        </Label>
                        <Input
                            id="column"
                            value={column}
                            onChange={handleColumnChange}
                            className="col-span-3"
                        />
                    </div>
                    {preview.length > 0 && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Preview</Label>
                            <ul className="col-span-3 list-disc pl-5">
                                {preview.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleUpload}>
                        <Upload className="mr-2 h-4 w-4" /> Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}