import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function GeneralSettingsPage() {
    return (
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage general application settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                        <span>Dark Mode</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Toggle between light and dark themes.
                        </span>
                    </Label>
                    <Switch id="dark-mode" defaultChecked />
                </div>
                 <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="compact-mode" className="flex flex-col space-y-1">
                        <span>Compact Mode</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Display UI elements in a more compact way.
                        </span>
                    </Label>
                    <Switch id="compact-mode" />
                </div>
            </CardContent>
        </Card>
    );
}
