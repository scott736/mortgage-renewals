import { Calendar, Clock, Phone, Video } from 'lucide-react';

import type { MeetingType, Service, TeamMember, TimeSlot } from '@/lib/nylas/types';
import { cn } from '@/lib/utils';

const MEETING_TYPE_OPTIONS = [
  { type: 'phone' as MeetingType, label: 'Phone Call' },
  { type: 'teams' as MeetingType, label: 'Microsoft Teams' },
];

interface BookingFormSummaryProps {
  service: Service;
  teamMember: TeamMember;
  selectedSlot: TimeSlot;
  timezone: string;
  selectedMeetingType?: MeetingType;
  onMeetingTypeChange?: (type: MeetingType) => void;
}

function formatDate(isoString: string, timezone: string): string {
  return new Date(isoString).toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  });
}

function formatTime(isoString: string, timezone: string): string {
  return new Date(isoString)
    .toLocaleTimeString('en-CA', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    })
    .toLowerCase();
}

export function BookingFormSummary({
  service,
  teamMember,
  selectedSlot,
  timezone,
  selectedMeetingType,
  onMeetingTypeChange,
}: BookingFormSummaryProps) {
  const availableMeetingTypes = service.meetingTypes
    ? MEETING_TYPE_OPTIONS.filter((opt) => service.meetingTypes?.includes(opt.type))
    : [];
  const showMeetingTypeSelector = availableMeetingTypes.length > 1 && onMeetingTypeChange;

  return (
    <div className="flex flex-col bg-gradient-to-b from-muted/30 to-transparent p-5 lg:w-[320px] lg:shrink-0 lg:p-8">
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

      <div className="flex flex-1 flex-col justify-center">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{formatDate(selectedSlot.startTime, timezone)}</p>
              <p className="text-xs text-muted-foreground">Date</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Clock className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {formatTime(selectedSlot.startTime, timezone)} · {service.duration} minutes
              </p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
          </div>
        </div>
      </div>

      {showMeetingTypeSelector && (
        <div className="mt-6 space-y-3 border-t pt-6">
          <p className="text-sm font-medium">Meeting Format</p>
          <div className="grid grid-cols-2 gap-2">
            {availableMeetingTypes.map((option) => {
              const isSelected = selectedMeetingType === option.type;
              return (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => onMeetingTypeChange?.(option.type)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-md border-2 p-3 text-center',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50',
                  )}
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    {option.type === 'phone' ? (
                      <Phone className="size-5 text-muted-foreground" />
                    ) : (
                      <Video className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
