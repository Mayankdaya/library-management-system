
"use client";

import { useState, useEffect } from 'react';
import type { Member } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
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
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MemberForm from '@/components/MemberForm';
import { useToast } from '@/hooks/use-toast';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMembers = async () => {
      const membersCollection = collection(db, 'members');
      const membersSnapshot = await getDocs(membersCollection);
      if (!membersSnapshot.empty) {
        const membersList = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
        setMembers(membersList);
      }
    };
    fetchMembers();
  }, []);

  const handleFormSubmit = async (memberData: Omit<Member, 'id' | 'joinDate'>) => {
    try {
      if (selectedMember) {
        // Edit existing member
        const memberRef = doc(db, 'members', selectedMember.id);
        await updateDoc(memberRef, memberData);
        setMembers(members.map(m => m.id === selectedMember.id ? { ...m, ...memberData } : m));
        toast({ title: 'Member Updated', description: `${memberData.name}'s details have been updated.` });
      } else {
        // Add new member
        const newMemberData = {
          ...memberData,
          joinDate: new Date().toISOString(),
        };
        const docRef = await addDoc(collection(db, 'members'), newMemberData);
        setMembers([...members, { id: docRef.id, ...newMemberData }]);
        toast({ title: 'Member Added', description: `${memberData.name} has been added to the library.` });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save member details.' });
    }
    
    setSelectedMember(null);
    setDialogOpen(false);
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };
  
  const handleAdd = () => {
    setSelectedMember(null);
    setDialogOpen(true);
  }

  const handleDelete = async (memberId: string) => {
    const memberName = members.find(m => m.id === memberId)?.name;
    try {
      await deleteDoc(doc(db, 'members', memberId));
      setMembers(members.filter(m => m.id !== memberId));
      toast({ variant: 'destructive', title: 'Member Deleted', description: `${memberName} has been removed from the system.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete member.' });
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground font-body">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Library Members</CardTitle>
             <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setSelectedMember(null); setDialogOpen(open); }}>
              <DialogTrigger asChild>
                 <Button onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> Add Member</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{selectedMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
                </DialogHeader>
                <MemberForm
                  key={selectedMember ? selectedMember.id : 'new'}
                  onSubmit={handleFormSubmit}
                  defaultValues={selectedMember}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Join Date</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map(member => (
                  <TableRow key={member.id} className="border-white/10">
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                     <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='glassmorphic'>
                          <DropdownMenuItem onClick={() => handleEdit(member)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleDelete(member.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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
