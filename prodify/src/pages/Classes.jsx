// src/pages/Classes.jsx

import React, { useState, useEffect } from "react";
import ClassCard from "@/components/Classes/ClassCard";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Query } from "appwrite";

import authService from "../appwrite/auth";
import classService from "../appwrite/classServices";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all classes for this user on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // 1. Get the current user
        const user = await authService.getCurrentUser();
        const userId = user.$id;

        // 2. Query Appwrite for all documents where userId == current user
        const response = await classService.getClasses([
          Query.equal("userId", userId),
        ]);

        // 3. Map each document → { id, name, instructor, courseCode }
        const mapped = response.documents.map((doc) => ({
          id: doc.$id,
          name: doc.className,      // assuming your field is "className"
          instructor: "",           // leave blank or populate if you have that field later
          courseCode: "",           // leave blank or populate if you add that attribute
        }));

        setClasses(mapped);
      } catch (err) {
        console.error("Error fetching classes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Handler to remove a class by its Appwrite document ID
  const handleDelete = (id) => {
    // Optimistically remove from UI
    setClasses((prev) => prev.filter((cls) => cls.id !== id));

    // Also delete from Appwrite
    classService
      .deleteClass(id)
      .catch((err) => console.error("Failed to delete class:", err));
  };

  // Toggle the "Add Class" form
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setNewClassName("");
  };

  // Handle form submission to add a class
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const trimmed = newClassName.trim();
    if (!trimmed) return;

    try {
      // Get current user
      const user = await authService.getCurrentUser();
      const userId = user.$id;

      // Create new class in Appwrite
      const newDoc = await classService.addClass({
        userId,
        className: trimmed,
      });
      if (!newDoc) {
        console.error("Failed to add class to Appwrite");
        return;
      }

      // Append to local state
      setClasses((prev) => [
        ...prev,
        {
          id: newDoc.$id,
          name: newDoc.className,
          instructor: "",
          courseCode: "",
        },
      ]);

      // Reset & hide form
      setNewClassName("");
      setShowForm(false);
    } catch (err) {
      console.error("Error during addClass:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1013]">
      <main className="pt-24 px-6 pb-12">
        {/* Page Title & Add Button */}
        <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white">
            Your Classes
          </h1>
          <Button
            onClick={toggleForm}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            <span>{showForm ? "Cancel" : "Add Class"}</span>
          </Button>
        </div>

        {/* Add Class Form */}
        {showForm && (
          <form
            onSubmit={handleFormSubmit}
            className="max-w-3xl mx-auto mb-8 bg-[#1f2429] p-6 rounded-lg shadow-md"
          >
            <label htmlFor="className" className="block text-gray-300 mb-2">
              Class Name
            </label>
            <input
              id="className"
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="w-full px-4 py-2 mb-4 bg-[#2a2f36] text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. CS 3330: Linear Algebra"
              required
            />
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                onClick={toggleForm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Save Class
              </Button>
            </div>
          </form>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-400 my-32">
            <p>Loading your classes...</p>
          </div>
        )}

        {/* Classes Grid */}
        {!loading && classes.length === 0 && !showForm ? (
          <div className="text-center text-gray-400 space-y-4 my-48">
            <div>
              <svg
                className="mx-auto w-16 h-16 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p className="text-lg">No classes yet</p>
            <p>Click “Add Class” to create your first class.</p>
          </div>
        ) : null}

        {/* Display Classes */}
        {!loading && classes.length > 0 && (
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
  );
}
