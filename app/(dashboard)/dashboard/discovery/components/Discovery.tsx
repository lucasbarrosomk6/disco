'use client'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/app/store'
import { Activity, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddDiscoveryModal } from './AddDiscoveryModal'
import { Discovery } from '@/app/store/discoAITypes'
import { setCurrentDiscovery } from '@/app/store/discoverySlice'
import { DiscoveryOutputModal } from './OutputModal'

export function Page() {
  const dispatch = useDispatch()
  const [isRunModalOpen, setIsRunModalOpen] = useState(false)
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false)

  const discoveries = useSelector((state: RootState) => state.discovery.list)
  const processes = useSelector((state: RootState) => state.processes.list)
  const currentDiscovery = useSelector((state: RootState) => state.discovery.currentDiscovery)
  const companyLists = useSelector((state: RootState) => state.companyLists.list)

  const handleViewOutput = (discovery: Discovery) => {
    dispatch(setCurrentDiscovery(discovery))
    setIsOutputModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600'
      case 'Processing':
        return 'text-yellow-600'
      case 'Failed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
          <Activity className="h-8 w-8 text-blue-500 mr-2" />
          Discovery
        </h1>
        <Button onClick={() => setIsRunModalOpen(true)}>
          Run New Processes
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Processes</TableHead>
            <TableHead>Company List</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discoveries.map((discovery) => (
            <TableRow key={discovery.id}>
              <TableCell>
                {discovery.processIds.map((id) => 
                  processes.find(p => p.id === id)?.name
                ).join(', ')}
              </TableCell>
              <TableCell>{companyLists.find(c => c.id === discovery.companyListId)?.name}</TableCell>
              <TableCell className={getStatusColor(discovery.status)}>{discovery.status}</TableCell>
              <TableCell>
                {discovery.results ? 
                  `${discovery.results.length} / ${companyLists.find(c => c.id === discovery.companyListId)?.companies.length} companies` : 
                  'Not started'}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => handleViewOutput(discovery)}
                  disabled={!discovery.results || discovery.results.length === 0}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Output
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddDiscoveryModal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
      />
      {currentDiscovery && (
        <DiscoveryOutputModal
          isOpen={isOutputModalOpen}
          onClose={() => setIsOutputModalOpen(false)}
          discovery={currentDiscovery}
        />
      )}
    </div>
  )
}