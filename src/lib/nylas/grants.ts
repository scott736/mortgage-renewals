/**
 * Nylas Grant Management — config-based (no Supabase required)
 * Returns grants from the hardcoded config.
 */

import type { TeamMember } from './types';

export async function enrichTeamMember(member: TeamMember): Promise<TeamMember> {
  return member;
}

export async function enrichTeamMembers(members: TeamMember[]): Promise<TeamMember[]> {
  return members;
}

export function invalidateGrantCache(_teamMemberId?: string): void {
  // no-op — config-based, no cache needed
}
