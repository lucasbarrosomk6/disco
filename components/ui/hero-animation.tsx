'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Search, BarChart2 } from 'lucide-react'

export default function HeroAnimation() {
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % 3)
        }, 2000)
        return () => clearInterval(timer)
    }, [])

    const steps = [
        { icon: Upload, text: 'Upload product documents' },
        { icon: Search, text: 'Enter Company Name' },
        { icon: BarChart2, text: 'Generate Report' },
    ]

    return (
        <div className="flex items-center justify-center w-full ">
            <div className="flex sm:w-full sm:justify-between l">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        className={`flex flex-col items-center space-y-2 w-[156px] text-center ${index === currentStep ? 'text-blue-500' : 'text-gray-400'
                            }`}
                        animate={{
                            scale: index === currentStep ? 1.1 : 1,
                            opacity: index <= currentStep ? 1 : 0.5,
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center"
                            animate={{
                                borderColor: index === currentStep ? '#3B82F6' : '#CBD5E0',
                                backgroundColor: index === currentStep ? '#EBF5FF' : 'white',
                            }}
                        >
                            {React.createElement(step.icon, { size: 24, strokeWidth: 2 })}
                        </motion.div>
                        <motion.p
                            className="text-sm font-medium"
                            animate={{
                                color: index === currentStep ? '#3B82F6' : '#CBD5E0',
                            }}
                        >
                            {step.text}
                        </motion.p>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}