"use client"

import { useTheme } from "next-themes";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { themes } from "@/lib/themes";

export default function AppearanceSettingsPage() {
    const { theme, setTheme } = useTheme();

    return (
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label className="mb-2 block">Theme</Label>
                    <RadioGroup 
                        defaultValue={theme} 
                        onValueChange={setTheme}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                        {themes.map((t) => (
                            <div key={t.name}>
                                <RadioGroupItem value={t.name} id={t.name} className="peer sr-only" />
                                <Label
                                    htmlFor={t.name}
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                    <div 
                                        className="w-full h-12 rounded-lg border flex items-center justify-center"
                                        style={{ background: `linear-gradient(to right, ${t.colors.primary}, ${t.colors.background})` }}
                                    >
                                        <div className="w-4 h-4 rounded-full" style={{backgroundColor: t.colors.accent}}></div>
                                    </div>
                                    <span className="block w-full p-2 text-center font-normal">{t.label}</span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </CardContent>
        </Card>
    );
}
