// ProcessTable.tsx

import { RootState } from "@/app/store"
import { Process } from "@/app/store/discoAITypes"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Edit, Trash2 } from 'lucide-react'
import { useSelector } from "react-redux"

interface ProcessTableProps {

    onEdit: (process: Process) => void
    onDelete: (process: Process) => void
}

export function ProcessTable({ onEdit, onDelete }: ProcessTableProps) {
    const processes = useSelector((state: RootState) => state.processes.list);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Process Name</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {processes.map((process) => (
                    <TableRow key={process.id}>
                        <TableCell>{process.name}</TableCell>
                        <TableCell>
                            <Button variant="ghost" onClick={() => onEdit(process)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button variant="ghost" onClick={() => onDelete(process)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
