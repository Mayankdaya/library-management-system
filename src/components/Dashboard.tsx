"use client";

import type { Book, Member } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Book as BookIcon, Users, AlertTriangle } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Pie, PieChart, Cell } from "recharts";
import * as React from "react";

interface DashboardProps {
  books: Book[];
  members: Member[];
}

export default function Dashboard({ books, members }: DashboardProps) {
  const totalBooks = books.length;
  const checkedOutBooks = books.filter(book => book.status === 'Checked Out').length;
  const overdueBooks = books.filter(book => book.dueDate && new Date(book.dueDate) < new Date()).length;
  const availableBooks = totalBooks - checkedOutBooks;
  const totalMembers = members.length;

  const statusData = [
    { name: 'Available', value: availableBooks, fill: "hsl(var(--chart-2))" },
    { name: 'Checked Out', value: checkedOutBooks, fill: "hsl(var(--chart-5))" },
  ];
  const statusChartConfig = {
    books: {
      label: "Books",
    },
    Available: {
      label: "Available",
      color: "hsl(var(--chart-2))",
    },
    "Checked Out": {
      label: "Checked Out",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig

  const genreData = React.useMemo(() => {
    const genreCounts: { [key: string]: number } = {};
    books.forEach(book => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });
    return Object.entries(genreCounts).map(([genre, count]) => ({ genre, count }));
  }, [books]);
  const genreChartConfig = {
    count: {
      label: "Books",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig


  return (
    <div className='space-y-4'>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">in the entire collection</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Checked Out</CardTitle>
            <BookIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedOutBooks}</div>
            <p className="text-xs text-muted-foreground">currently on loan</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueBooks}</div>
            <p className="text-xs text-muted-foreground">need to be returned</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">registered in the system</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Books by Status</CardTitle>
            <CardDescription>A breakdown of available and checked out books.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusChartConfig} className='min-h-[200px] w-full'>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50}>
                   {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
         <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Books by Genre</CardTitle>
            <CardDescription>The number of books in each genre.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={genreChartConfig} className='min-h-[200px] w-full'>
              <BarChart data={genreData} layout="vertical" margin={{left: 20}}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="genre" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
