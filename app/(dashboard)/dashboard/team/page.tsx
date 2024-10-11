'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import Link from 'next/link';
import { Users, Mail, UserPlus } from 'lucide-react';
import { useUser } from '@/lib/auth';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function TeamPage() {
  const { user } = useUser();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const response = await fetch('/api/team');
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data);
        } else {
          throw new Error('Failed to fetch team members');
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Link href="/dashboard/team/invite">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                {member.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                {member.email}
              </p>
              <p className="text-sm font-medium mt-2">{member.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}