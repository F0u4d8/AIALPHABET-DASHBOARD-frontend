"use client";

import { Button } from '@/components/ui/button';
import React from 'react';
import toast from 'react-hot-toast';

interface ConfirmDeleteProps {
    id: string;
  }

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ id }) => {
    const handleDelete = async () => {
      try {
        await deleteCategory(id);
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
        console.error('Failed to delete category:', error);
      }
    };
  
    const confirmDelete = () => {
      toast((t) => (
        <div>
          <p>Are you sure you want to delete this category?</p>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => toast.dismiss(t.id)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                handleDelete();
                toast.dismiss(t.id);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ));
    };
  
    return (
      <Button variant="outline" onClick={confirmDelete}>
        <span className="sr-only">Delete</span>
        Delete
      </Button>
    );
  };
  
  export default ConfirmDelete;