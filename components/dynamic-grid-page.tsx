'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for the tiles
const tiles = [
  { id: 1, title: "Short Title", content: "This is a short content." },
  { id: 2, title: "Medium Length Title", content: "This content is a bit longer than the previous one." },
  { id: 3, title: "A Very Long Title That Spans Multiple Lines", content: "This is a much longer piece of content that will likely cause the tile to span multiple columns in our grid layout." },
  { id: 4, title: "Another Short One", content: "Brief content." },
  { id: 5, title: "Medium Title Again", content: "Medium length content for variety." },
  { id: 6, title: "The Longest Title We Have That Really Pushes the Boundaries", content: "This tile has both a very long title and a substantial amount of content, making it the largest tile in our grid. It will definitely span multiple columns and might even take up a full row depending on the viewport size." },
]

export function DynamicGridPageComponent() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dynamic Grid Layout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array(6).fill(null).map((_, index) => (
              <Card key={index} className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))
          : tiles.map((tile) => (
              <Card 
                key={tile.id} 
                className={`${
                  tile.content.length > 100 
                    ? 'col-span-1 md:col-span-2 lg:col-span-3' 
                    : tile.content.length > 50 
                    ? 'col-span-1 md:col-span-2' 
                    : 'col-span-1'
                }`}
              >
                <CardHeader>
                  <CardTitle>{tile.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{tile.content}</p>
                </CardContent>
              </Card>
            ))
        }
      </div>
    </div>
  )
}