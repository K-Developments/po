import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export function PageHeader({ title, description, actionButton }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{title}</h1>
          {description && <p className="mt-1 text-muted-foreground font-body">{description}</p>}
        </div>
        {actionButton && <div className="flex-shrink-0">{actionButton}</div>}
      </div>
    </div>
  );
}
