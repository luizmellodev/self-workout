
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

  // State for notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    reminders: true,
    achievements: true,
    recommendations: true
  });

  const handleWorkoutDayToggle = (day: keyof typeof workoutDays) => {
    setWorkoutDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const handleNotificationToggle = (notification: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [notification]: !prev[notification]
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Customize your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminders-toggle" className="block">Workout Reminders</Label>
                  <p className="text-sm text-gray-500">Remind me before scheduled workouts</p>
                </div>
                <Switch 
                  id="reminders-toggle"
                  checked={notificationPrefs.reminders}
                  onCheckedChange={() => handleNotificationToggle('reminders')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="achievements-toggle" className="block">Achievement Alerts</Label>
                  <p className="text-sm text-gray-500">Notify me when I earn achievements</p>
                </div>
                <Switch 
                  id="achievements-toggle"
                  checked={notificationPrefs.achievements}
                  onCheckedChange={() => handleNotificationToggle('achievements')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="recommendations-toggle" className="block">Workout Recommendations</Label>
                  <p className="text-sm text-gray-500">Suggest new workouts based on my progress</p>
                </div>
                <Switch 
                  id="recommendations-toggle"
                  checked={notificationPrefs.recommendations}
                  onCheckedChange={() => handleNotificationToggle('recommendations')}
                />
              </div>
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
