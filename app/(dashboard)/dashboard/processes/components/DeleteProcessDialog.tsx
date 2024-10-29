// DeleteProcessDialog.tsx

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { deleteProcess } from '@/app/store/processesSlice';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteProcessDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function DeleteProcessDialog({
    isOpen,
    onClose,

}: DeleteProcessDialogProps) {
    const dispatch = useDispatch();
    const currentProcess = useSelector((state: RootState) => state.processes.currentProcess);
    const processes = useSelector((state: RootState) => state.processes);
    console.log('Processes:', processes);
    const handleConfirm = () => {
        console.log('Deleting process:', currentProcess?.id);
        if (currentProcess) {
            console.log('Deleting process:', currentProcess.id);
            dispatch(deleteProcess(currentProcess.id));
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete the process "{currentProcess?.name}"?</p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
