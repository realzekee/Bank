'use client';

import { MainLayout } from "@/components/main-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <MainLayout>
            <PageHeader title="Settings" description="Manage your account and application preferences." />
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>This section is under construction. Check back later for more options!</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Future settings will include profile management, security options, notification preferences, and more.</p>
                </CardContent>
            </Card>
        </MainLayout>
    )
}
