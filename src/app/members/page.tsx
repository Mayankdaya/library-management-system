"use client";

import { useState } from 'react';
import type { Member } from '@/types';
import { initialMembers } from '@/lib/data';
import Header from '@/components/Header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);

  return (
    <div className="min-h-screen bg-transparent text-foreground font-body">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <Card className='glassmorphic'>
          <CardHeader>
            <CardTitle>Library Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Join Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map(member => (
                  <TableRow key={member.id} className="border-white/10">
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
