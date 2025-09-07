import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { WheelEntry } from '@/hooks/useWheelData';

interface WheelAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  area: { name: string; icon: string } | null;
  currentEntry: WheelEntry | null;
  month: Date;
  onSave: (entry: Omit<WheelEntry, 'id'>) => void;
  loading: boolean;
}

export const WheelAreaModal: React.FC<WheelAreaModalProps> = ({
  isOpen,
  onClose,
  area,
  currentEntry,
  month,
  onSave,
  loading
}) => {
  const [score, setScore] = useState(5);
  const [whatWentWell, setWhatWentWell] = useState('');
  const [whatCanBeImproved, setWhatCanBeImproved] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (currentEntry) {
      setScore(currentEntry.score);
      setWhatWentWell(currentEntry.what_went_well);
      setWhatCanBeImproved(currentEntry.what_can_be_improved);
      setNotes(currentEntry.notes);
    } else {
      setScore(5);
      setWhatWentWell('');
      setWhatCanBeImproved('');
      setNotes('');
    }
  }, [currentEntry, isOpen]);

  const handleSave = () => {
    if (!area) return;

    onSave({
      area: area.name,
      score,
      what_went_well: whatWentWell,
      what_can_be_improved: whatCanBeImproved,
      notes,
      month
    });

    onClose();
  };

  const getScoreDescription = (score: number) => {
    if (score <= 2) return 'Very Dissatisfied';
    if (score <= 4) return 'Dissatisfied';
    if (score <= 6) return 'Neutral';
    if (score <= 8) return 'Satisfied';
    return 'Very Satisfied';
  };

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-red-600';
    if (score <= 6) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (!area) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-wellness-primary flex items-center gap-2">
            <span className="text-xl">{area.icon}</span>
            {area.name} - {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Score Slider */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Satisfaction Level</Label>
            <div className="px-2">
              <Slider
                value={[score]}
                onValueChange={(value) => setScore(value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-wellness-primary">{score}/10</div>
              <div className={`text-sm font-medium ${getScoreColor(score)}`}>
                {getScoreDescription(score)}
              </div>
            </div>
          </div>

          {/* What went well */}
          <div className="space-y-2">
            <Label htmlFor="went-well" className="text-sm font-medium">
              What went well? 🌟
            </Label>
            <Textarea
              id="went-well"
              placeholder="Share your achievements and positive moments..."
              value={whatWentWell}
              onChange={(e) => setWhatWentWell(e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* What can be improved */}
          <div className="space-y-2">
            <Label htmlFor="improve" className="text-sm font-medium">
              What can be improved? 🎯
            </Label>
            <Textarea
              id="improve"
              placeholder="Areas for growth and development..."
              value={whatCanBeImproved}
              onChange={(e) => setWhatCanBeImproved(e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes 📝
            </Label>
            <Textarea
              id="notes"
              placeholder="Any other thoughts or reflections..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-16"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-wellness-primary hover:bg-wellness-secondary"
          >
            {loading ? 'Saving...' : 'Save Entry'}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};