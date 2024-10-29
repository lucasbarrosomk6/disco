'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export function SortableItem(props: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="mb-2">
            <div className="flex items-center bg-gray-100 rounded p-2">
                <span {...listeners} className="cursor-move mr-2">
                    <GripVertical size={16} />
                </span>
                {props.children}
            </div>
        </div>
    )
}