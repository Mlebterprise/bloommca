import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useWheelData } from '@/hooks/useWheelData';

interface WheelCalendarProps {
  onMonthSelect: (month: Date) => void;
  currentMonth: Date;
}

export const WheelCalendar: React.FC<WheelCalendarProps> = ({
  onMonthSelect,
  currentMonth
}) => {
  const [viewMonth, setViewMonth] = useState(new Date());
  const { entries, fetchEntriesForMonth } = useWheelData();

  useEffect(() => {
    fetchEntriesForMonth(viewMonth);
  }, [viewMonth]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(viewMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setViewMonth(newMonth);
  };

  const selectMonth = (month: Date) => {
    onMonthSelect(month);
    setViewMonth(month);
  };

  const getMonthScore = () => {
    if (entries.length === 0) return null;
    const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0);
    return Math.round((totalScore / entries.length) * 10);
  };

  const monthScore = getMonthScore();
  const isCurrentMonth = viewMonth.getMonth() === currentMonth.getMonth() && 
                         viewMonth.getFullYear() === currentMonth.getFullYear();

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="bg-gradient-card shadow-soft">
      <CardHeader>
        <CardTitle className="text-wellness-primary flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Monthly Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-wellness-soft"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h3 className="text-lg font-semibold text-center">
              {formatMonth(viewMonth)}
            </h3>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="hover:bg-wellness-soft"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Month Summary */}
          <div className="bg-wellness-soft rounded-lg p-4 text-center">
            {monthScore !== null ? (
              <div>
                <div className="text-2xl font-bold text-wellness-primary mb-1">
                  {monthScore}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Overall Life Balance
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {entries.length} of 8 areas tracked
                </div>
              </div>
            ) : (
              <div>
                <div className="text-lg text-muted-foreground mb-1">
                  No data yet
                </div>
                <div className="text-sm text-muted-foreground">
                  Start tracking this month
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={() => selectMonth(viewMonth)}
            className={`w-full ${
              isCurrentMonth 
                ? 'bg-wellness-primary hover:bg-wellness-secondary' 
                : 'bg-wellness-secondary hover:bg-wellness-primary'
            }`}
          >
            {isCurrentMonth ? 'View Current Month' : 'View This Month'}
          </Button>

          {/* Quick Stats */}
          {entries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Areas Tracked:</h4>
              <div className="flex flex-wrap gap-1">
                {entries.map((entry) => (
                  <div
                    key={entry.area}
                    className="text-xs px-2 py-1 bg-wellness-primary/20 text-wellness-primary rounded-md"
                  >
                    {entry.area}: {entry.score}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};