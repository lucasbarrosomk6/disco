import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateCompanyList } from '@/app/store/companyListsSlice'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CompanyList } from '@/app/store/discoAITypes'

interface EditCompanyListProps {
    isOpen: boolean
    onClose: () => void
    companyList: CompanyList | null
}

export function EditCompanyList({
    isOpen,
    onClose,
    companyList,
}: EditCompanyListProps) {
    const dispatch = useDispatch()
    const [companiesText, setCompaniesText] = useState<string>('')

    useEffect(() => {
        if (companyList) {
            setCompaniesText(companyList.companies.join('\n'))
        }
    }, [companyList])

    const handleSaveChanges = () => {
        if (companyList) {
            const updatedCompanies = companiesText
                .split('\n')
                .map((c) => c.trim())
                .filter((c) => c !== '')
            const updatedList = {
                ...companyList,
                companies: updatedCompanies,
            }
            dispatch(updateCompanyList(updatedList))
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Company List</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Textarea
                            id="companies"
                            value={companiesText}
                            onChange={(e) => setCompaniesText(e.target.value)}
                            className="col-span-3"
                            rows={10}
                        />
                    </div>
                    total company count: {companiesText.trim().split('\n').length}
                </div>
                <DialogFooter>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
