'use client';

import { MainLayout } from '@/components/main-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { savingsGoals } from '@/lib/mock-data';
import { Plus } from 'lucide-react';
import Image from 'next/image';

export default function SavingsPage() {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const goalImages = [
        "https://placehold.co/600x400.png?a=1",
        "https://placehold.co/600x400.png?a=2",
    ]

    return (
        <MainLayout>
            <PageHeader title="Savings Goals" description="Track your progress and reach your financial dreams.">
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Goal
                </Button>
            </PageHeader>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savingsGoals.map((goal, index) => (
                    <Card key={goal.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                            <Image 
                                src={goalImages[index]} 
                                alt={goal.name} 
                                layout="fill" 
                                objectFit="cover" 
                                className="transition-transform hover:scale-105"
                                data-ai-hint="savings goal"
                            />
                        </div>
                        <CardHeader>
                            <CardTitle>{goal.name}</CardTitle>
                            <CardDescription>Target: {formatCurrency(goal.targetAmount)}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-2">
                                <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="h-2"/>
                            </div>
                            <p className="text-sm font-medium">{formatCurrency(goal.currentAmount)} saved ({Math.round((goal.currentAmount / goal.targetAmount) * 100)}%)</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Manage Goal</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </MainLayout>
    )
}
