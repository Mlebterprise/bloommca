import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WheelEntry {
  id?: string;
  area: string;
  score: number;
  what_went_well: string;
  what_can_be_improved: string;
  notes: string;
  month: Date;
}

export const useWheelData = () => {
  const [entries, setEntries] = useState<WheelEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const fetchEntriesForMonth = async (month: Date) => {
    setLoading(true);
    try {
      const firstDay = getFirstDayOfMonth(month);
      const { data, error } = await supabase
        .from('wheel_entries')
        .select('*')
        .eq('month', firstDay.toISOString().split('T')[0])
        .is('user_id', null); // For now, since auth is not implemented

      if (error) throw error;

      const wheelEntries: WheelEntry[] = (data || []).map(entry => ({
        id: entry.id,
        area: entry.area,
        score: entry.score,
        what_went_well: entry.what_went_well || '',
        what_can_be_improved: entry.what_can_be_improved || '',
        notes: entry.notes || '',
        month: new Date(entry.month)
      }));

      setEntries(wheelEntries);
    } catch (error) {
      console.error('Error fetching wheel entries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wheel entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async (entry: Omit<WheelEntry, 'id'>) => {
    setLoading(true);
    try {
      const firstDay = getFirstDayOfMonth(entry.month);
      
      const { data, error } = await supabase
        .from('wheel_entries')
        .upsert({
          area: entry.area,
          score: entry.score,
          what_went_well: entry.what_went_well,
          what_can_be_improved: entry.what_can_be_improved,
          notes: entry.notes,
          month: firstDay.toISOString().split('T')[0],
          user_id: null // For now, since auth is not implemented
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setEntries(prev => {
        const existing = prev.find(e => e.area === entry.area);
        if (existing) {
          return prev.map(e => e.area === entry.area ? { ...entry, id: data.id } : e);
        } else {
          return [...prev, { ...entry, id: data.id }];
        }
      });

      toast({
        title: "Success",
        description: `${entry.area} entry saved successfully`,
      });

    } catch (error) {
      console.error('Error saving wheel entry:', error);
      toast({
        title: "Error",
        description: "Failed to save wheel entry",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getEntryForArea = (area: string): WheelEntry | null => {
    return entries.find(entry => entry.area === area) || null;
  };

  const getScoreForArea = (area: string): number => {
    const entry = getEntryForArea(area);
    return entry ? entry.score : 5; // Default score
  };

  return {
    entries,
    loading,
    fetchEntriesForMonth,
    saveEntry,
    getEntryForArea,
    getScoreForArea
  };
};