import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { WheelAreaModal } from "@/components/WheelAreaModal";
import { WheelCalendar } from "@/components/WheelCalendar";
import { useWheelData } from "@/hooks/useWheelData";

const lifeAreas = [
  { name: 'Career', icon: '💼', angle: 0 },
  { name: 'Health', icon: '🏃‍♀️', angle: 45 },
  { name: 'Relationships', icon: '💕', angle: 90 },
  { name: 'Personal Growth', icon: '🌱', angle: 135 },
  { name: 'Family', icon: '👨‍👩‍👧‍👦', angle: 180 },
  { name: 'Recreation', icon: '🎨', angle: 225 },
  { name: 'Money', icon: '💰', angle: 270 },
  { name: 'Emotions', icon: '😊', angle: 315 },
];

interface WheelOfLifeProps {
  // Legacy props kept for backwards compatibility
  scores?: { [key: string]: number };
  onScoreChange?: (area: string, score: number) => void;
}

export const WheelOfLife: React.FC<WheelOfLifeProps> = ({ 
  scores = {}, 
  onScoreChange 
}) => {
  const [selectedArea, setSelectedArea] = useState<{ name: string; icon: string } | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { 
    entries, 
    loading, 
    fetchEntriesForMonth, 
    saveEntry, 
    getEntryForArea, 
    getScoreForArea 
  } = useWheelData();

  useEffect(() => {
    fetchEntriesForMonth(currentMonth);
  }, [currentMonth]);

  const getDisplayScore = (areaName: string) => {
    // Use database score if available, fallback to legacy scores prop
    return getScoreForArea(areaName);
  };

  const calculatePosition = (angle: number, radius: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: 150 + radius * Math.cos(radian),
      y: 150 + radius * Math.sin(radian),
    };
  };

  const handleAreaClick = (area: { name: string; icon: string }) => {
    setSelectedArea(area);
  };

  const handleModalSave = (entry: any) => {
    saveEntry(entry);
    // Also call legacy callback for backward compatibility
    onScoreChange?.(entry.area, entry.score);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (showCalendar) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setShowCalendar(false)}
            className="text-wellness-primary"
          >
            ← Back to Wheel
          </Button>
        </div>
        <WheelCalendar
          currentMonth={currentMonth}
          onMonthSelect={(month) => {
            setCurrentMonth(month);
            setShowCalendar(false);
          }}
        />
      </div>
    );
  }

  return (
    <>
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <CardTitle className="text-wellness-primary font-semibold">
                Wheel of Life
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Track your monthly life balance
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCalendar(true)}
              className="text-wellness-primary hover:bg-wellness-soft"
            >
              <CalendarIcon className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-wellness-soft"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h3 className="text-lg font-semibold text-wellness-primary">
              {formatMonth(currentMonth)}
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
        </CardHeader>
      <CardContent className="flex justify-center">
        <div className="relative w-80 h-80">
          {/* Outer circles for reference */}
          {[2, 4, 6, 8, 10].map(level => (
            <circle
              key={level}
              cx="150"
              cy="150"
              r={level * 12}
              fill="none"
              stroke="hsl(var(--wellness-soft))"
              strokeWidth="1"
              className="absolute"
            />
          ))}
          
          <svg width="300" height="300" className="absolute">
            {/* Grid lines */}
            {lifeAreas.map(area => {
              const outer = calculatePosition(area.angle, 120);
              return (
                <line
                  key={area.name}
                  x1="150"
                  y1="150"
                  x2={outer.x}
                  y2={outer.y}
                  stroke="hsl(var(--wellness-soft))"
                  strokeWidth="1"
                />
              );
            })}

            {/* Score polygon */}
            <polygon
              points={lifeAreas.map(area => {
                const score = getDisplayScore(area.name);
                const hasEntry = getEntryForArea(area.name) !== null;
                const pos = calculatePosition(area.angle, hasEntry ? score * 12 : 2 * 12); // Show minimal score if no entry
                return `${pos.x},${pos.y}`;
              }).join(' ')}
              fill="hsl(var(--wellness-primary) / 0.2)"
              stroke="hsl(var(--wellness-primary))"
              strokeWidth="2"
            />

            {/* Score dots */}
            {lifeAreas.map(area => {
              const score = getDisplayScore(area.name);
              const hasEntry = getEntryForArea(area.name) !== null;
              const pos = calculatePosition(area.angle, score * 12);
              return (
                <circle
                  key={area.name}
                  cx={pos.x}
                  cy={pos.y}
                  r="8"
                  fill={hasEntry ? "hsl(var(--wellness-primary))" : "hsl(var(--muted))"}
                  className={`cursor-pointer transition-all ${
                    hasEntry 
                      ? 'hover:fill-wellness-accent' 
                      : 'hover:fill-muted-foreground'
                  }`}
                  onClick={() => handleAreaClick(area)}
                />
              );
            })}
          </svg>

          {/* Area labels */}
          {lifeAreas.map(area => {
            const labelPos = calculatePosition(area.angle, 135);
            const score = getDisplayScore(area.name);
            const hasEntry = getEntryForArea(area.name) !== null;
            return (
              <div
                key={area.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer hover:scale-110 transition-transform"
                style={{ left: labelPos.x, top: labelPos.y }}
                onClick={() => handleAreaClick(area)}
              >
                <div className="text-xl mb-1">{area.icon}</div>
                <div className={`text-xs font-medium ${
                  hasEntry ? 'text-wellness-primary' : 'text-muted-foreground'
                }`}>
                  {area.name}
                </div>
                <div className={`text-xs font-bold ${
                  hasEntry ? 'text-wellness-primary' : 'text-muted-foreground'
                }`}>
                  {hasEntry ? `${score} ✓` : 'Not set'}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>

    <WheelAreaModal
      isOpen={selectedArea !== null}
      onClose={() => setSelectedArea(null)}
      area={selectedArea}
      currentEntry={selectedArea ? getEntryForArea(selectedArea.name) : null}
      month={currentMonth}
      onSave={handleModalSave}
      loading={loading}
    />
    </>
  );
};