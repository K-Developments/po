"use client";
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListCollapse, Route as RouteIcon } from 'lucide-react';

const appRoutes = [
  { path: '/login', description: 'Authentication page for all users.' },
  { path: '/admin/products', description: 'Admin: Manage product catalog (CRUD operations).' },
  { path: '/admin/customers', description: 'Admin: Manage customer information (CRUD operations).' },
  { path: '/admin/users', description: 'Admin: Manage user accounts and roles (Placeholder).' },
  { path: '/admin/restock-suggestions', description: 'Admin: AI-powered product restock suggestions.' },
  { path: '/admin/routes-overview', description: 'Admin: This page, displaying an overview of application routes.' },
  { path: '/user/distributions', description: 'User: Input distribution records and view history.' },
  { path: '/user/payments', description: 'User: View payment history (Placeholder).' },
];

export default function RoutesOverviewPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader 
        title="Application Routes Overview"
        description="A quick reference for the main routes within Yo Cool Central."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <RouteIcon className="mr-2 h-6 w-6 text-primary" />
            Route Directory
          </CardTitle>
          <CardDescription className="font-body">
            Key navigation paths and their purposes in the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {appRoutes.map((route, index) => (
              <li key={index} className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center">
                    <ListCollapse className="h-5 w-5 mr-3 text-accent flex-shrink-0" />
                    <h3 className="text-lg font-semibold font-headline text-primary">{route.path}</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground font-body ml-8">{route.description}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
