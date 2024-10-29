'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableItem } from './sortableItem'
import { runProcessThunk } from '../../../../store/discoverySlice'
import { addDiscovery } from '../../../../store/discoverySlice'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CompanyList, Discovery } from '@/app/store/discoAITypes'
import { AppDispatch, RootState } from '@/app/store'
import { Process } from '@/app/store/discoAITypes'

interface AddDiscoveryModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AddDiscoveryModal({ isOpen, onClose }: AddDiscoveryModalProps) {
    const dispatch = useDispatch<AppDispatch>()
    const processes = useSelector((state: RootState) => state.processes.list)
    const companyLists = useSelector((state: RootState) => state.companyLists.list)

    const [selectedProcesses, setSelectedProcesses] = useState<Process[]>([])
    const [selectedCompanyList, setSelectedCompanyList] = useState<CompanyList | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )


    const handleAddProcess = (processId: string) => {
        const process = processes.find((p: any) => p.id === parseInt(processId))
        if (process && !selectedProcesses.some((p: any) => p.id === process.id)) {
            setSelectedProcesses([...selectedProcesses, process])
        }
    }

    const handleRemoveProcess = (processId: number) => {
        setSelectedProcesses(selectedProcesses.filter(p => p.id !== processId))
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setSelectedProcesses((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id)
                const newIndex = items.findIndex(item => item.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleRunProcesses = async () => {
        if (!selectedCompanyList || selectedProcesses.length === 0) return
        const newDiscovery: Discovery = {
            id: Date.now(),
            processIds: selectedProcesses.map((p: Process) => p.id),
            companyListId: selectedCompanyList.id,
            status: "Processing",
            output: "Processing multiple processes...",
            results: []
        }

        try {
            dispatch(addDiscovery(newDiscovery))
            dispatch(runProcessThunk(newDiscovery))
            setSelectedProcesses([]) // Clear selected processes
            setSelectedCompanyList(null) // Clear selected company list
            onClose() // Close the modal
        } catch (error) {
            console.error('Error starting process:', error)
            // You might want to update the discovery status to 'Failed' here
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Run New Processes</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="process" className="text-right">
                            Add Process
                        </label>
                        <Select onValueChange={handleAddProcess}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a process" />
                            </SelectTrigger>
                            <SelectContent>
                                {processes.map((process: any) => (
                                    <SelectItem key={process.id} value={process.id.toString()}>{process.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="companyList" className="text-right">
                            Company List
                        </label>
                        <Select onValueChange={(value: any) => setSelectedCompanyList(companyLists.find((c: any) => c.id === parseInt(value)) as CompanyList)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a company list" />
                            </SelectTrigger>
                            <SelectContent>
                                {companyLists.map((list: any) => (
                                    <SelectItem key={list.id} value={list.id.toString()}>{list.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="mb-2 font-semibold">Selected Processes:</h3>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext
                            items={selectedProcesses}
                            strategy={verticalListSortingStrategy}
                        >
                            {selectedProcesses.map((process) => (
                                <SortableItem key={process.id} id={process.id}>
                                    <div className="flex justify-between items-center p-2 mb-2 bg-gray-100 rounded">
                                        <span>{process.name}</span>
                                        <Button variant="ghost" size="sm" onClick={() => handleRemoveProcess(process.id)}>Remove</Button>
                                    </div>
                                </SortableItem>
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
                <DialogFooter>
                    <Button onClick={handleRunProcesses} disabled={selectedProcesses.length === 0 || !selectedCompanyList}>
                        Run Processes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}