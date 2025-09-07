import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Phone, User, CheckCircle } from "lucide-react";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Coach {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  bio: string;
}

const coaches: Coach[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialty: 'Mental Wellness & Anxiety',
    rating: 4.9,
    image: '👩‍⚕️',
    bio: 'Specialized in cognitive behavioral therapy and mindfulness practices for women.',
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    specialty: 'Life Coaching & Growth',
    rating: 4.8,
    image: '👩‍💼',
    bio: 'Empowering women to achieve their personal and professional goals.',
  },
];

const timeSlots: TimeSlot[] = [
  { id: '1', time: '9:00 AM', available: true },
  { id: '2', time: '10:30 AM', available: false },
  { id: '3', time: '1:00 PM', available: true },
  { id: '4', time: '2:30 PM', available: true },
  { id: '5', time: '4:00 PM', available: false },
  { id: '6', time: '5:30 PM', available: true },
];

const nextWeekDays = [
  { date: 'Mon 22', day: 'Monday' },
  { date: 'Tue 23', day: 'Tuesday' },
  { date: 'Wed 24', day: 'Wednesday' },
  { date: 'Thu 25', day: 'Thursday' },
  { date: 'Fri 26', day: 'Friday' },
];

export const ScheduleCall: React.FC = () => {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Mon 22');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [callType, setCallType] = useState<'video' | 'phone'>('video');
  const [isBooked, setIsBooked] = useState(false);

  const bookAppointment = () => {
    if (selectedCoach && selectedDay && selectedTime) {
      setIsBooked(true);
      setTimeout(() => setIsBooked(false), 3000);
    }
  };

  if (isBooked) {
    return (
      <Card className="bg-gradient-card shadow-soft">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-wellness-primary mb-2">
            Appointment Booked!
          </h3>
          <p className="text-muted-foreground mb-4">
            Your session with {selectedCoach?.name} is scheduled for {selectedDay} at {selectedTime}
          </p>
          <p className="text-sm text-muted-foreground">
            You'll receive a confirmation email with the meeting details shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-soft">
      <CardHeader>
        <CardTitle className="text-wellness-primary flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Schedule a Coaching Call
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Book a personalized session with one of our wellness coaches
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Coach Selection */}
        <div>
          <h3 className="font-medium mb-3">Choose Your Coach</h3>
          <div className="space-y-3">
            {coaches.map((coach) => (
              <div
                key={coach.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedCoach?.id === coach.id
                    ? 'border-wellness-primary bg-wellness-soft'
                    : 'border-border hover:border-wellness-primary/50'
                }`}
                onClick={() => setSelectedCoach(coach)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{coach.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{coach.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        ⭐ {coach.rating}
                      </Badge>
                    </div>
                    <p className="text-sm text-wellness-primary font-medium mb-1">
                      {coach.specialty}
                    </p>
                    <p className="text-xs text-muted-foreground">{coach.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCoach && (
          <>
            {/* Day Selection */}
            <div>
              <h3 className="font-medium mb-3">Select Date</h3>
              <div className="grid grid-cols-5 gap-2">
                {nextWeekDays.map((day) => (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDay(day.date)}
                    className={`p-3 text-center rounded-lg border transition-colors ${
                      selectedDay === day.date
                        ? 'border-wellness-primary bg-wellness-primary text-primary-foreground'
                        : 'border-border hover:border-wellness-primary'
                    }`}
                  >
                    <div className="text-sm font-medium">{day.date}</div>
                    <div className="text-xs opacity-75">{day.day}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <h3 className="font-medium mb-3">Available Times</h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`p-3 text-center rounded-lg border transition-colors ${
                      selectedTime === slot.time
                        ? 'border-wellness-primary bg-wellness-primary text-primary-foreground'
                        : slot.available
                        ? 'border-border hover:border-wellness-primary'
                        : 'border-border opacity-50 cursor-not-allowed bg-muted'
                    }`}
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-sm">{slot.time}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Call Type */}
            <div>
              <h3 className="font-medium mb-3">Session Type</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCallType('video')}
                  className={`p-4 rounded-lg border text-center transition-colors ${
                    callType === 'video'
                      ? 'border-wellness-primary bg-wellness-soft'
                      : 'border-border hover:border-wellness-primary/50'
                  }`}
                >
                  <Video className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Video Call</div>
                  <div className="text-xs text-muted-foreground">Face-to-face session</div>
                </button>
                
                <button
                  onClick={() => setCallType('phone')}
                  className={`p-4 rounded-lg border text-center transition-colors ${
                    callType === 'phone'
                      ? 'border-wellness-primary bg-wellness-soft'
                      : 'border-border hover:border-wellness-primary/50'
                  }`}
                >
                  <Phone className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Phone Call</div>
                  <div className="text-xs text-muted-foreground">Voice-only session</div>
                </button>
              </div>
            </div>

            {/* Book Button */}
            <Button
              onClick={bookAppointment}
              disabled={!selectedDay || !selectedTime}
              className="w-full bg-wellness-primary hover:bg-wellness-secondary"
            >
              Book Appointment
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};