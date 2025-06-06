
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  // State for workout days
  const [workoutDays, setWorkoutDays] = useState({
    monday: true,
    tuesday: false,
    wednesday: true,
    thursday: false,
    friday: true,
    saturday: false,
    sunday: false
  });

  const handleWorkoutDayToggle = (day: keyof typeof workoutDays) => {
    setWorkoutDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your workout preferences have been updated."
    });
    // In a real app, this would save to the backend
  };

  return (
    <Layout>
      <div className="py-6">
        <h1 className="mb-6">Settings</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Workout Days</CardTitle>
            <CardDescription>
              Select the days you prefer to work out
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(workoutDays).map(([day, isActive]) => (
                <div key={day} className="flex items-center justify-between">
                  <Label htmlFor={`${day}-toggle`} className="capitalize">
                    {day}
                  </Label>
                  <Switch 
                    id={`${day}-toggle`}
                    checked={isActive}
                    onCheckedChange={() => handleWorkoutDayToggle(day as keyof typeof workoutDays)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button 
          className="w-full workout-gradient text-white"
          onClick={saveSettings}
        >
          Save Settings
        </Button>
      </div>
    </Layout>
  );
};

export default Settings;
