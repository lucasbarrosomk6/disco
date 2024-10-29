// Page.tsx

'use client'

import { useState } from 'react'
import { Settings, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ProcessTable } from './ProcessTable'
import { ProcessDialog } from './ProcessDialog'
import { DeleteProcessDialog } from './DeleteProcessDialog'
import { Process } from '@/app/store/discoAITypes'
import { useDispatch, useSelector } from 'react-redux'
import { addProcess, createProcess, setCurrentProcess, updateProcess } from '@/app/store/processesSlice'
import { RootState } from '@/app/store'

export function Page() {
  const dispatch = useDispatch();
  const currentProcess = useSelector((state: RootState) => state.processes.currentProcess);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)


  const openCreateProcessDialog = () => {
    dispatch(setCurrentProcess(null))
    setIsProcessDialogOpen(true)
  }

  const handleEditProcess = (process: Process) => {
    dispatch(setCurrentProcess(process))
    setIsProcessDialogOpen(true)
  }

  const handleDeleteProcess = (process: Process) => {
    console.log('Deleting process:', process.id);
    dispatch(setCurrentProcess(process))
    setIsDeleteDialogOpen(true)
  }

  const handleSaveProcess = async (process: Process) => {
    if (currentProcess) {
      // Editing existing process
      dispatch(updateProcess(process))
    } else {
      // Creating new process
      dispatch(addProcess(process))
    }
    setIsProcessDialogOpen(false)
    dispatch(setCurrentProcess(null))
  }



  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
          <Settings className="h-8 w-8 text-blue-500 mr-2" />
          Processes
        </h1>
        <Button onClick={openCreateProcessDialog}>
          <Plus className="mr-2 h-4 w-4" /> Create New Process
        </Button>
      </div>

      <ProcessTable
        onEdit={handleEditProcess}
        onDelete={handleDeleteProcess} />

      <ProcessDialog
        isOpen={isProcessDialogOpen}
        onClose={() => {
          setIsProcessDialogOpen(false)
          dispatch(setCurrentProcess(null))
        }}
        onSave={handleSaveProcess}

      />

      <DeleteProcessDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          dispatch(setCurrentProcess(null))
        }}
      />
    </div>
  )
}
