'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { usePatchState } from '@/hooks/use-patch-state';
import { trackLeadEvent } from '@/lib/analytics';
import type {
  BookingConfirmation as BookingConfirmationType,
  GuestInfo,
  MeetingType,
  SchedulingStep,
  Service,
  TeamMember,
  TimeSlot,
} from '@/lib/nylas/types';
import { cn } from '@/lib/utils';

import { AvailabilityPicker } from './AvailabilityPicker';
import { BookingConfirmation } from './BookingConfirmation';
import { BookingForm } from './BookingForm';
import { PendingConfirmation } from './PendingConfirmation';
import { ServiceSelector } from './ServiceSelector';

interface PendingBookingInfo {
  email: string;
  expiresAt: Date;
  startTime: Date;
}

interface SchedulingWidgetProps {
  services: Service[];
  teamMembers: TeamMember[];
  initialServiceId?: string;
  initialTeamMemberId?: string;
  /** Pre-select a region tab (canada, usa, mexico) */
  initialRegion?: 'canada' | 'usa' | 'mexico';
  /** Token of a previous booking to cancel when creating a new one (for "change time") */
  cancelToken?: string;
  onMeetingTypeChange?: (type: MeetingType) => void;
  className?: string;
}

const STEPS: SchedulingStep[] = ['service', 'datetime', 'details', 'confirmation'];

function resolveInitialService(
  services: Service[],
  initialServiceId?: string,
): Service | null {
  if (!initialServiceId) return null;
  return services.find((s) => s.id === initialServiceId) ?? null;
}

function resolveInitialTeamMember(
  service: Service | null,
  teamMembers: TeamMember[],
  initialTeamMemberId?: string,
): TeamMember | null {
  if (!service) return null;

  const eligibleMembers = teamMembers.filter((m) => service.teamMembers.includes(m.id));

  if (initialTeamMemberId) {
    return teamMembers.find((m) => m.id === initialTeamMemberId) ?? null;
  }

  if (!service.roundRobin && eligibleMembers.length === 1) {
    return eligibleMembers[0];
  }

  return null;
}

function getDefaultMeetingType(service: Service | null): MeetingType | undefined {
  if (!service?.meetingTypes?.length) return undefined;
  if (service.meetingTypes.includes('teams')) return 'teams';
  return service.meetingTypes[0];
}

function SchedulingProgress({ currentStep }: { currentStep: SchedulingStep }) {
  if (currentStep === 'confirmation') return null;

  const steps = [
    { id: 'service', label: 'Service' },
    { id: 'datetime', label: 'Date & Time' },
    { id: 'details', label: 'Details' },
  ];

  const getStepIndex = (step: SchedulingStep): number => STEPS.indexOf(step);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isComplete = getStepIndex(currentStep) > index;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-sm font-medium',
                  isActive && 'bg-primary text-primary-foreground',
                  isComplete && 'bg-primary/20 text-primary',
                  !isActive && !isComplete && 'bg-muted text-muted-foreground'
                )}
              >
                {isComplete ? (
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'ml-2 hidden text-sm sm:inline',
                  isActive && 'font-medium text-foreground',
                  !isActive && 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-3 h-0.5 w-8 sm:w-12',
                    isComplete ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SchedulingWidget({
  services,
  teamMembers,
  initialServiceId,
  initialTeamMemberId,
  initialRegion,
  cancelToken,
  onMeetingTypeChange,
  className,
}: SchedulingWidgetProps) {
  const initialService = resolveInitialService(services, initialServiceId);
  const initialMember = resolveInitialTeamMember(
    initialService,
    teamMembers,
    initialTeamMemberId,
  );

  const [bookingState, setBookingState] = usePatchState({
    currentStep: (initialService ? 'datetime' : 'service') as SchedulingStep,
    selectedService: initialService as Service | null,
    selectedTeamMember: initialMember as TeamMember | null,
    selectedSlot: null as TimeSlot | null,
    booking: null as BookingConfirmationType | null,
    pendingBooking: null as PendingBookingInfo | null,
  });
  const { currentStep, selectedService, selectedTeamMember, selectedSlot, booking, pendingBooking } = bookingState;

  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType | undefined>(() =>
    getDefaultMeetingType(initialService),
  );

  const [timezone, _setTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'America/Toronto';
    }
  });

  useEffect(() => {
    const service = resolveInitialService(services, initialServiceId);
    setBookingState({
      selectedService: service,
      selectedTeamMember: resolveInitialTeamMember(service, teamMembers, initialTeamMemberId),
      currentStep: service ? 'datetime' : 'service',
      selectedSlot: null,
    });
    setSelectedMeetingType(getDefaultMeetingType(service));
  }, [initialServiceId, initialTeamMemberId, services, teamMembers, setBookingState]);

  const getStepIndex = (step: SchedulingStep): number => STEPS.indexOf(step);

  const canGoBack = (): boolean => {
    return getStepIndex(currentStep) > 0 && currentStep !== 'confirmation';
  };

  const canGoNext = useCallback((): boolean => {
    switch (currentStep) {
      case 'service':
        return !!selectedService;
      case 'datetime':
        return !!selectedSlot;
      case 'details':
      case 'confirmation':
        return false;
    }
  }, [currentStep, selectedService, selectedSlot]);

  const goBack = useCallback(() => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) {
      const newStep = STEPS[currentIndex - 1];
      if (newStep === 'service') {
        setBookingState({ currentStep: newStep, selectedSlot: null, selectedTeamMember: null });
      } else if (newStep === 'datetime') {
        setBookingState({ currentStep: newStep, selectedSlot: null });
      } else {
        setBookingState({ currentStep: newStep });
      }
    }
  }, [currentStep, setBookingState]);

  const goNext = useCallback(() => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex < STEPS.length - 1 && canGoNext()) {
      setBookingState({ currentStep: STEPS[currentIndex + 1] });
    }
  }, [currentStep, canGoNext, setBookingState]);

  const handleServiceSelect = (service: Service | null) => {
    if (!service) {
      setBookingState({ selectedService: null, selectedSlot: null, selectedTeamMember: null });
      setSelectedMeetingType(undefined);
      return;
    }

    const eligibleMembers = teamMembers.filter((m) =>
      service.teamMembers.includes(m.id)
    );
    const nextTeamMember =
      !service.roundRobin && eligibleMembers.length === 1 ? eligibleMembers[0] : null;

    setBookingState({
      selectedService: service,
      selectedSlot: null,
      selectedTeamMember: nextTeamMember,
    });
    setSelectedMeetingType(getDefaultMeetingType(service));
  };

  const handleMeetingTypeChange = (type: MeetingType) => {
    setSelectedMeetingType(type);
    onMeetingTypeChange?.(type);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    const member = teamMembers.find((m) => m.id === slot.teamMemberId);
    setBookingState({
      selectedSlot: slot,
      ...(member ? { selectedTeamMember: member } : {}),
    });
  };

  const handleBookingSubmit = async (guestInfo: GuestInfo) => {
    if (!selectedService || !selectedTeamMember || !selectedSlot) {
      throw new Error('Missing required booking information');
    }

    const response = await fetch('/api/nylas/book/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: selectedService.id,
        teamMemberId: selectedTeamMember.id,
        startTime: selectedSlot.startTime,
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        guestPhone: guestInfo.phone,
        notes: guestInfo.notes,
        timezone,
        ...(selectedMeetingType && { meetingType: selectedMeetingType }),
        ...(cancelToken && { cancelToken }),
      }),
    });

    const data = await response.json();

    if (!data.success) {
      if (response.status === 429) {
        throw new Error(
          data.error || 'Too many booking attempts. Please wait a few minutes and try again.'
        );
      }
      throw new Error(data.error || 'Failed to create booking');
    }

    trackLeadEvent('booking_pending', {
      service: selectedService.id,
    });

    if (data.requiresConfirmation) {
      setBookingState({
        pendingBooking: {
          email: data.data.email,
          expiresAt: new Date(data.data.expiresAt),
          startTime: new Date(data.data.startTime),
        },
        currentStep: 'confirmation',
      });
      return;
    }

    const confirmation: BookingConfirmationType = {
      id: data.data.id,
      service: selectedService,
      teamMember: selectedTeamMember,
      startTime: new Date(data.data.startTime),
      endTime: new Date(data.data.endTime),
      meetingLink: data.data.meetingLink,
      calendarLinks: data.data.calendarLinks,
    };

    setBookingState({ booking: confirmation, currentStep: 'confirmation' });
  };

  const handleBookAnother = () => {
    setBookingState({
      currentStep: 'service',
      selectedService: null,
      selectedTeamMember: null,
      selectedSlot: null,
      booking: null,
      pendingBooking: null,
    });
    setSelectedMeetingType(undefined);
  };

  let stepContent: ReactNode = null;

  switch (currentStep) {
    case 'service':
      stepContent = (
        <ServiceSelector
          services={services}
          teamMembers={teamMembers}
          selectedService={selectedService}
          onSelect={handleServiceSelect}
          timezone={timezone}
          initialRegion={initialRegion}
        />
      );
      break;

    case 'datetime':
      if (selectedService) {
        stepContent = (
          <AvailabilityPicker
            service={selectedService}
            teamMember={selectedService.roundRobin ? undefined : (selectedTeamMember || undefined)}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSlotSelect}
            timezone={timezone}
          />
        );
      }
      break;

    case 'details':
      if (selectedService && selectedTeamMember && selectedSlot) {
        stepContent = (
          <BookingForm
            service={selectedService}
            teamMember={selectedTeamMember}
            selectedSlot={selectedSlot}
            timezone={timezone}
            onSubmit={handleBookingSubmit}
            onBack={goBack}
            selectedMeetingType={selectedMeetingType}
            onMeetingTypeChange={handleMeetingTypeChange}
          />
        );
      }
      break;

    case 'confirmation':
      if (pendingBooking && selectedService && selectedTeamMember) {
        stepContent = (
          <PendingConfirmation
            email={pendingBooking.email}
            serviceName={selectedService.name}
            teamMember={selectedTeamMember}
            startTime={pendingBooking.startTime}
            duration={selectedService.duration}
            expiresAt={pendingBooking.expiresAt}
            timezone={timezone}
            onBookAnother={handleBookAnother}
          />
        );
      } else if (booking) {
        stepContent = (
          <BookingConfirmation
            booking={booking}
            timezone={timezone}
            onBookAnother={handleBookAnother}
          />
        );
      }
      break;
  }

  return (
    <div className={cn('mx-auto max-w-5xl', className)}>
      <SchedulingProgress currentStep={currentStep} />

      {stepContent}

      {currentStep !== 'details' && currentStep !== 'confirmation' && (
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={goBack} disabled={!canGoBack()}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          <Button onClick={goNext} disabled={!canGoNext()}>
            Continue
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export { AvailabilityPicker } from './AvailabilityPicker';
export { BookingConfirmation } from './BookingConfirmation';
export { BookingForm } from './BookingForm';
export { PendingConfirmation } from './PendingConfirmation';
export { ServiceSelector } from './ServiceSelector';
