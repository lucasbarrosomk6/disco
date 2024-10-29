import { useState, useEffect } from 'react'
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
import { X, Lightbulb, Wand2, Plus } from 'lucide-react'
import { Process, Section } from '@/app/store/discoAITypes'
import { RootState } from '@/app/store'
import { useSelector } from 'react-redux'
import { Textarea } from '@/components/ui/textarea'


interface ChipProps {
    text: string
    onRemove: () => void
}

const Chip: React.FC<ChipProps> = ({ text, onRemove }) => (
    <div className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        {text}
        <button onClick={onRemove} className="ml-2 focus:outline-none">
            <X size={14} />
        </button>
    </div>
)

interface ProcessDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (process: Process) => void

}

export function ProcessDialog({
    isOpen,
    onClose,
    onSave,

}: ProcessDialogProps) {
    const currentProcess = useSelector((state: RootState) => state.processes.currentProcess);
    const [processData, setProcessData] = useState<Process>({
        id: currentProcess?.id || Date.now(),
        name: currentProcess?.name || '',
        searchPhrases: currentProcess?.searchPhrases || [],
        questions: currentProcess?.questions || [],
        sections: currentProcess?.sections || [],
    })
    const [newSearchPhrase, setNewSearchPhrase] = useState('')
    const [newQuestion, setNewQuestion] = useState('')
    const [newSection, setNewSection] = useState<Section>({ title: '', prompt: ''})
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false)
    const [isGeneratingSearchPhrase, setIsGeneratingSearchPhrase] = useState(false)
    const [isGeneratingProcess, setIsGeneratingProcess] = useState(false)

    useEffect(() => {
        if (currentProcess) {
            setProcessData(currentProcess)
        } else {
            setProcessData({
                id: Date.now(),
                name: '',
                searchPhrases: [],
                questions: [],
                sections: [],
            })
        }
    }, [currentProcess, isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProcessData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const addSearchPhrase = () => {
        if (newSearchPhrase.trim()) {
            setProcessData((prev) => ({
                ...prev,
                searchPhrases: [...prev.searchPhrases, newSearchPhrase.trim()],
            }))
            setNewSearchPhrase('')
        }
    }

    const removeSearchPhrase = (index: number) => {
        setProcessData((prev) => ({
            ...prev,
            searchPhrases: prev.searchPhrases.filter((_, i) => i !== index),
        }))
    }

    const addQuestion = () => {
        if (newQuestion.trim()) {
            setProcessData((prev) => ({
                ...prev,
                questions: [...prev.questions, newQuestion.trim()],
            }))
            setNewQuestion('')
        }
    }

    const removeQuestion = (index: number) => {
        setProcessData((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index),
        }))
    }

    const addSection = () => {
        if (newSection.title && newSection.prompt) {
            setProcessData((prev) => ({
                ...prev,
                sections: [...prev.sections, { ...newSection }],
            }))
            setNewSection({ title: '', prompt: '' })
        }
    }

    const removeSection = (index: number) => {
        setProcessData((prev) => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== index),
        }))
    }

    const updateSection = (index: number, field: 'title' | 'prompt', value: string) => {
        setProcessData((prev) => ({
            ...prev,
            sections: prev.sections.map((section, i) => 
                i === index ? { ...section, [field]: value } : section
            ),
        }))
    }

    const handleSave = () => {
        onSave(processData)
        onClose()
    }

    const handleGenerateQuestion = async () => {
        setIsGeneratingQuestion(true)
        try {
            const response = await fetch('/api/ai/brainstorm/processQuestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    processName: processData.name,
                    searchPhrases: processData.searchPhrases,
                    questions: processData.questions,
                    sections: processData.sections,
                }),
            })
            const data = await response.json()
            if (data.question) {
                setNewQuestion(data.question)
            }
        } catch (error) {
            console.error('Error generating question:', error)
        }
        setIsGeneratingQuestion(false)
    }

    const handleGenerateSearchPhrase = async () => {
        setIsGeneratingSearchPhrase(true)
        try {
            const response = await fetch('/api/ai/brainstorm/processSearchPhrases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    processName: processData.name,
                    searchPhrases: processData.searchPhrases,
                    questions: processData.questions,
                    sections: processData.sections,
                }),
            })
            const data = await response.json()
            if (data.searchPhrase) {
                setNewSearchPhrase(data.searchPhrase)
            }
        } catch (error) {
            console.error('Error generating search phrase:', error)
        }
        setIsGeneratingSearchPhrase(false)
    }

    const handleGenerateProcess = async () => {
        setIsGeneratingProcess(true)
        try {
            const response = await fetch('/api/ai/brainstorm/generateProcess', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    processName: processData.name,
                }),
            })
            const data = await response.json()
            if (data.searchPhrases && data.questions && data.sections) {
                setProcessData(prev => ({
                    ...prev,
                    searchPhrases: data.searchPhrases,
                    questions: data.questions,
                    sections: data.sections,
                }))
            }
        } catch (error) {
            console.error('Error generating process:', error)
        }
        setIsGeneratingProcess(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="max-w-4xl ">
                <DialogHeader>
                    <DialogTitle>{currentProcess ? 'Edit Process' : 'Create New Process'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Process Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={processData.name}
                            onChange={handleChange}
                            className="col-span-2"
                        />
                        <Button
                            onClick={handleGenerateProcess}
                            disabled={isGeneratingProcess || !processData.name}
                            className="col-span-1"
                        >
                            <Wand2 className="mr-2 h-4 w-4" />
                            {isGeneratingProcess ? 'Generating...' : 'Generate Process'}
                        </Button>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="searchPhrases" className="text-right mt-2">
                            Search Phrases
                        </Label>
                        <div className="col-span-3">
                            <div className="flex mb-2">
                                <Textarea
                                    id="newSearchPhrase"
                                    value={newSearchPhrase}
                                    onChange={(e) => setNewSearchPhrase(e.target.value)}
                                    placeholder="Enter a search phrase"
                                    className="mr-2"
                                    
                                />
                                <Button onClick={addSearchPhrase}>Add</Button>
                                <Button
                                    onClick={handleGenerateSearchPhrase}
                                    disabled={isGeneratingSearchPhrase}
                                    className="ml-2"
                                >
                                    <Lightbulb className="mr-2 h-4 w-4" />
                                    {isGeneratingSearchPhrase ? 'Generating...' : 'Brainstorm'}
                                </Button>
                            </div>
                            <div>
                                {processData.searchPhrases.map((phrase, index) => (
                                    <Chip
                                        key={index}
                                        text={phrase}
                                        onRemove={() => removeSearchPhrase(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="questions" className="text-right mt-2">
                            Questions
                        </Label>
                        <div className="col-span-3">
                            <div className="flex mb-2">
                                <Textarea
                                    id="newQuestion"
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    placeholder="Enter a question"
                                    className="mr-2"
                                />
                                <Button onClick={addQuestion}>Add</Button>
                                <Button
                                    onClick={handleGenerateQuestion}
                                    disabled={isGeneratingQuestion}
                                    className="ml-2"
                                >
                                    <Lightbulb className="mr-2 h-4 w-4" />
                                    {isGeneratingQuestion ? 'Generating...' : 'Brainstorm'}
                                </Button>
                            </div>
                            <div>
                                {processData.questions.map((question, index) => (
                                    <Chip
                                        key={index}
                                        text={question}
                                        onRemove={() => removeQuestion(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="sections" className="text-right mt-2">
                            Sections
                        </Label>
                        <div className="col-span-3 space-y-4">
                            {processData.sections.map((section, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-md">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold">Section {index + 1}</h4>
                                        <Button variant="ghost" size="sm" onClick={() => removeSection(index)}>
                                            <X size={14} />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Section Title"
                                            value={section.title}
                                            onChange={(e) => updateSection(index, 'title', e.target.value)}
                                            className="mb-2"
                                        />
                                        <Textarea
                                            placeholder="Section Prompt"
                                            value={section.prompt}
                                            onChange={(e) => updateSection(index, 'prompt', e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="bg-gray-100 p-4 rounded-md">
                                <h4 className="font-semibold mb-2">Add New Section</h4>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="New Section Title"
                                        value={newSection.title}
                                        onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                                    />
                                    <Textarea
                                        placeholder="New Section Prompt"
                                        value={newSection.prompt}
                                        onChange={(e) => setNewSection({ ...newSection, prompt: e.target.value })}
                                        rows={3}
                                    />
                                    <Button onClick={addSection} className="w-full">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Section
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save Process</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}