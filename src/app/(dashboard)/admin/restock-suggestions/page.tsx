"use client";
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { RestockSuggestions } from '@/components/admin/RestockSuggestions';

export default function AdminRestockPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader 
        title="AI Restock Suggestions"
        description="Leverage AI to get insights on product restocking needs based on distribution data."
      />
      <div className="mt-6">
        <RestockSuggestions />
      </div>
    </div>
  );
}
