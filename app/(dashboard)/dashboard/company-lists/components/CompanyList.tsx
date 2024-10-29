'use client'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/app/store'
import { setCurrentList, deleteCompanyList } from '@/app/store/companyListsSlice'
import { Edit, FileSpreadsheet, Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { AddCompanyListDialog } from './AddCompanyList'
import { EditCompanyList } from './EditCompanyList'
import { CompanyList } from '@/app/store/discoAITypes'

export function Page() {
    const dispatch = useDispatch()
    const companyLists = useSelector((state: RootState) => state.companyLists.list)
    const currentList = useSelector((state: RootState) => state.companyLists.currentList)

    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

    const handleEditCompanyList = (list: CompanyList) => {
        dispatch(setCurrentList(list))
        setIsEditModalOpen(true)
    }

    const handleDeleteCompanyList = (list: CompanyList) => {
        dispatch(setCurrentList(list))
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = () => {
        if (currentList) {
            dispatch(deleteCompanyList(currentList.id))
            setIsDeleteModalOpen(false)
            dispatch(setCurrentList(null))
        }
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <FileSpreadsheet className="h-8 w-8 text-blue-500 mr-2" />
                    Company Lists
                </h1>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Company List
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>List Name</TableHead>
                        <TableHead>Number of Companies</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companyLists.map((list) => (
                        <TableRow key={list.id}>
                            <TableCell>{list.name}</TableCell>
                            <TableCell>{list.companies.length}</TableCell>
                            <TableCell>
                                <Button variant="ghost" onClick={() => handleEditCompanyList(list)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button variant="ghost" onClick={() => handleDeleteCompanyList(list)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <AddCompanyListDialog
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <EditCompanyList
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                companyList={currentList}
            />

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>
                        Are you sure you want to delete the company list "{currentList?.name}"?
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}