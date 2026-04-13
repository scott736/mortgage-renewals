import * as React from 'react';

import { SchedulingWidget } from '@/components/scheduling/SchedulingWidget';
import type { Service, TeamMember } from '@/lib/nylas/types';

interface ErrorBoundaryState {
  hasError: boolean;
}

class SchedulingErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SchedulingWidget error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface SchedulingWidgetWithBoundaryProps {
  services: Service[];
  teamMembers: TeamMember[];
  initialServiceId?: string;
  initialTeamMemberId?: string;
  initialRegion?: 'canada' | 'usa' | 'mexico';
  cancelToken?: string;
  className?: string;
}

export function SchedulingWidgetWithBoundary(props: SchedulingWidgetWithBoundaryProps) {
  const fallback = (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
      <p className="font-semibold text-destructive mb-2">Something went wrong</p>
      <p className="text-sm text-muted-foreground mb-4">
        We encountered an unexpected error.{' '}
        <a href="/book-a-call/" className="text-primary hover:underline">Contact us</a>
        {' '}and we'll help you get started.
      </p>
      <a href="/book-a-call/" className="text-sm text-primary hover:underline">
        Contact
      </a>
    </div>
  );

  return (
    <SchedulingErrorBoundary fallback={fallback}>
      <SchedulingWidget {...props} />
    </SchedulingErrorBoundary>
  );
}
