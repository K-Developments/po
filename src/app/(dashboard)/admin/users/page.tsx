"use client";
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { UserCog } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader 
        title="User Management"
        description="Oversee and manage user accounts and roles."
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <UserCog className="mr-2 h-6 w-6 text-primary" />
            User Administration
          </CardTitle>
          <CardDescription className="font-body">
            This section is for managing system users, their roles, and permissions. 
            Full functionality for user creation, role assignment, and deactivation will be implemented here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
            <UserCog className="mx-auto h-24 w-24 text-muted-foreground opacity-30" />
            <h3 className="mt-4 text-xl font-semibold font-headline text-muted-foreground">User Management Coming Soon</h3>
            <p className="mt-2 text-muted-foreground font-body">
              Advanced user and role management features are under development.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
