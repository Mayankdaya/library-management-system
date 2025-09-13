import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

export default function NotificationSettingsPage() {
    return (
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                        <span>Push Notifications</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Receive push notifications on your devices.
                        </span>
                    </Label>
                    <Switch id="push-notifications" />
                </div>
                 <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                        <span>Email Notifications</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Receive notifications via email.
                        </span>
                    </Label>
                    <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Email Preferences</h4>
                    <div className="flex items-center space-x-3">
                        <Checkbox id="overdue-reminders" defaultChecked />
                        <Label htmlFor="overdue-reminders" className="font-normal">Overdue Book Reminders</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Checkbox id="reservation-alerts" defaultChecked />
                        <Label htmlFor="reservation-alerts" className="font-normal">Reservation Availability Alerts</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Checkbox id="event-updates" />
                        <Label htmlFor="event-updates" className="font-normal">Community Event Updates</Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
