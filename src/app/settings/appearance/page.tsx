import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AppearanceSettingsPage() {
    return (
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label className="mb-2 block">Theme</Label>
                    <RadioGroup defaultValue="dark" className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <RadioGroupItem value="dark" id="dark-theme" className="peer sr-only" />
                            <Label
                                htmlFor="dark-theme"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                <div className="w-full h-12 rounded-lg bg-background border border-border"></div>
                                <span className="block w-full p-2 text-center font-normal">Dark</span>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="light" id="light-theme" className="peer sr-only" />
                            <Label
                                htmlFor="light-theme"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                <div className="w-full h-12 rounded-lg bg-gray-100 border border-gray-300"></div>
                                <span className="block w-full p-2 text-center font-normal">Light</span>
                            </Label>
                        </div>
                         <div>
                            <RadioGroupItem value="system" id="system-theme" className="peer sr-only" />
                            <Label
                                htmlFor="system-theme"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                <div className="w-full h-12 rounded-lg bg-gradient-to-r from-background to-gray-100 border border-border"></div>
                                <span className="block w-full p-2 text-center font-normal">System</span>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </CardContent>
        </Card>
    );
}
