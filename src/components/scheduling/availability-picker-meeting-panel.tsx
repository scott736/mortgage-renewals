import { Clock, Globe } from 'lucide-react';

import type { Service, TeamMember } from '@/lib/nylas/types';

interface AvailabilityPickerMeetingPanelProps {
  service: Service;
  teamMember?: TeamMember;
  timezone: string;
}

export function AvailabilityPickerMeetingPanel({
  service,
  teamMember,
  timezone,
}: AvailabilityPickerMeetingPanelProps) {
  return (
    <div className="space-y-4 bg-gradient-to-b from-muted/30 to-transparent p-5 lg:w-[320px] lg:shrink-0 lg:space-y-8 lg:p-8">
      {teamMember && (
        <div className="flex items-center gap-4">
          {teamMember.photo && (
            <img
              src={teamMember.photo}
              alt={teamMember.name}
              width={64}
              height={64}
              className="size-16 rounded-full object-cover ring-2 ring-background shadow-md"
              loading="lazy"
              decoding="async"
            />
          )}
          <div>
            <p className="text-lg font-semibold">{teamMember.name}</p>
            <p className="text-sm text-muted-foreground">{teamMember.title}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-2xl font-bold tracking-tight">{service.name}</h3>
        <p className="leading-relaxed text-muted-foreground">
          {teamMember
            ? `Discuss your homeownership or investment goals with ${teamMember.name.split(' ')[0]}. Get personalized advice on your next steps.`
            : service.description}
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Clock className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{service.duration} minutes</p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Globe className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{timezone.replace('_', ' ')}</p>
            <p className="text-xs text-muted-foreground">Timezone</p>
          </div>
        </div>
      </div>
    </div>
  );
}
