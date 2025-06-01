// src/pages/Classes.jsx
import React, { useState } from 'react'
import ClassCard from '@/components/Classes/ClassCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Classes() {
    // Dummy initial data; replace with real fetch from Redux/Context/DB
    const [classes, setClasses] = useState([
        { id: 1, name: 'CS 3330: Linear Algebra', instructor: 'Dr. Smith', courseCode: 'CS3330' },
        { id: 2, name: 'MATH 2414: Calculus II', instructor: 'Prof. Johnson', courseCode: 'MATH2414' },
    ])

    // Handler to remove a class by id
    const handleDelete = (id) => {
        setClasses((prev) => prev.filter((cls) => cls.id !== id))
    }

    // Handler to add a new class (placeholder logic)
    const handleAdd = () => {
        // In a real app, open a modal or navigate to a form.
        // Here we just append a dummy entry.
        const nextId = classes.length ? Math.max(...classes.map((c) => c.id)) + 1 : 1
        const newClass = {
            id: nextId,
            name: 'New Class',
            instructor: 'TBD',
            courseCode: 'TBD',
        }
        setClasses((prev) => [...prev, newClass])
    }

    return (
        <div className="min-h-screen bg-[#0d1013]">
            {/* The Header itself comes from your Layout, so it’s not repeated here */}
            


            <main className="pt-24 px-6 pb-12">
                {/* Page Title & Add Button */}
                <div className="flex items-center justify-between max-w-5xl mx-auto mb-8">
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-white">
                        Your Classes
                    </h1>
                    <Button
                        onClick={handleAdd}
                        className="
              flex items-center space-x-2
              bg-blue-600 hover:bg-blue-700 text-white
            "
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Class</span>
                    </Button>
                </div>

                {/* Classes Grid */}
                {classes.length === 0 ? (
                    <div className="text-center text-gray-400 space-y-4 my-48">
                        <div>
                            <svg
                                className="mx-auto w-16 h-16 text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <p className="text-lg">No classes yet</p>
                        <p>Click “Add Class” to create your first class.</p>
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls) => (
                            <ClassCard
                                key={cls.id}
                                name={cls.name}
                                instructor={cls.instructor}
                                courseCode={cls.courseCode}
                                onDelete={() => handleDelete(cls.id)}
                            />
                        ))}
                    </div>

                       

                )}
            </main>
        </div>
    )
}
