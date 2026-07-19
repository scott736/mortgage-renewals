/**
 * Nylas Scheduling Configuration
 * MortgageRenewalHub.ca — single service, round-robin to full LendCity team
 */

import type { AvailabilityRule,Service, TeamMember } from './types';

// ============================================================================
// Default Availability (Mon-Fri 9am-5pm EST)
// ============================================================================

const DEFAULT_AVAILABILITY: AvailabilityRule[] = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
];

// Empty string = let Nylas resolve to the user's default calendar via the
// 'primary' keyword (see getCalendarId in client.ts). This works for every
// Microsoft 365 account in the team list today. If a team member needs events
// on a non-default calendar, set an explicit calendar ID here instead of ''.
const DEFAULT_CALENDAR = { primary: '' };
const DEFAULT_TZ = { timezone: 'America/Toronto', rules: DEFAULT_AVAILABILITY };

// ============================================================================
// Team Members
// ============================================================================

export const teamMembers: TeamMember[] = [
  {
    id: 'david',
    name: 'David Cardozo',
    email: 'david@lendcity.ca',
    slug: 'david-cardozo',
    title: 'Mortgage Agent',
    photo: '/images/team/david-cardozo.webp',
    bio: 'Active investor with deep expertise in residential and investment property renewals.',
    services: ['renewal-strategy-call'],
    nylasGrants: [
      { grantId: '0c8ea60d-261a-43ce-8833-a5ab7b502b78', provider: 'microsoft', email: 'david@lendcity.ca', isPrimary: true },
    ],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
  {
    id: 'gillian',
    name: 'Gillian Irving',
    email: 'gillian@lendcity.ca',
    slug: 'gillian-irving',
    title: 'Mortgage Agent',
    photo: '/images/team/gillian-irving.webp',
    bio: 'Acquired 35 properties in 18 months. Specialist in renewal optimization strategies.',
    services: ['renewal-strategy-call'],
    nylasGrants: [
      { grantId: '517e312b-c888-456b-ae95-463559e21d9f', provider: 'microsoft', email: 'gillian@lendcity.ca', isPrimary: true },
    ],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
  {
    id: 'jeremy',
    name: 'Jeremy Kresky',
    email: 'jeremy@lendcity.ca',
    slug: 'jeremy-kresky',
    title: 'Mortgage Agent',
    photo: '/images/team/jeremy-kresky.webp',
    bio: 'Specializes in complex renewals including agricultural, commercial, and non-standard income.',
    services: ['renewal-strategy-call'],
    nylasGrants: [
      { grantId: '8d5b3f8a-3ceb-4110-9fa6-cfa373ea0a69', provider: 'microsoft', email: 'jeremy@lendcity.ca', isPrimary: true },
    ],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
  {
    id: 'kirann',
    name: 'Kirann Sharma',
    email: 'kirann@lendcity.ca',
    slug: 'kirann-sharma',
    title: 'Mortgage Agent',
    photo: '/images/team/kirann-sharma.webp',
    bio: 'Known for finding renewal solutions when banks say no. Credit and B-lender specialist.',
    services: ['renewal-strategy-call'],
    nylasGrants: [
      { grantId: 'e2a98cec-ec41-4131-90bb-139ff3cf8b78', provider: 'microsoft', email: 'kirann@lendcity.ca', isPrimary: true },
    ],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
];

// ============================================================================
// Services — single service for this satellite site
// ============================================================================

export const services: Service[] = [
  {
    id: 'renewal-strategy-call',
    name: 'Free Renewal Strategy Call',
    description:
      "Speak with a licensed Canadian mortgage professional about your upcoming renewal. We'll review your options, compare rates across 30+ lenders, and build a strategy to save you money — at no cost to you.",
    duration: 30,
    bufferBefore: 5,
    bufferAfter: 5,
    teamMembers: teamMembers.map((m) => m.id),
    roundRobin: true,
    icon: 'PhoneCall',
    category: 'residential',
    meetingTypes: ['phone', 'teams'],
    region: 'canada',
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

export function getTeamMemberById(id: string): TeamMember | undefined {
  return teamMembers.find((member) => member.id === id);
}

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export function getTeamMembersByService(serviceId: string): TeamMember[] {
  const service = getServiceById(serviceId);
  if (!service) return [];
  return teamMembers.filter((member) => service.teamMembers.includes(member.id));
}

// ============================================================================
// Scheduling Configuration
// ============================================================================

export const schedulingConfig = {
  minimumNotice: 3,
  maxAdvanceBooking: 60,
  defaultTimezone: 'America/Toronto',
  slotInterval: 15,
  businessHours: { start: '09:00', end: '17:00' },
  daysToShow: 14,
  autoAddConferencing: true,
  conferencingProvider: 'Microsoft Teams' as const,
};
