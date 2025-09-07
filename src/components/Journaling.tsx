import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, BookOpen, Calendar, Heart, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { LottieLoader } from "./LottieLoader";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'calm' | 'anxious' | 'sad' | 'excited';
  type: 'gratitude' | 'night' | 'morning' | 'anxiety' | 'custom';
  date: Date;
  created_at?: string;
  updated_at?: string;
}

const moodColors = {
  happy: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  calm: 'bg-green-100 text-green-800 border-green-300',
  anxious: 'bg-orange-100 text-orange-800 border-orange-300',
  sad: 'bg-blue-100 text-blue-800 border-blue-300',
  excited: 'bg-purple-100 text-purple-800 border-purple-300',
};

const moodEmojis = {
  happy: '😊',
  calm: '😌',
  anxious: '😰',
  sad: '😢',
  excited: '🤩',
};

const journalTypes = {
  gratitude: { name: 'Gratitude Journal', emoji: '🙏', placeholder: 'What are you grateful for today?' },
  night: { name: 'Night Journal', emoji: '🌙', placeholder: 'How was your day? What did you learn?' },
  morning: { name: 'Morning Journal', emoji: '☀️', placeholder: 'How are you feeling this morning? What are your intentions for today?' },
  anxiety: { name: 'Anxiety Journal', emoji: '💚', placeholder: 'What worries are on your mind? Let them flow onto paper.' },
  custom: { name: 'Custom Journal', emoji: '✍️', placeholder: 'Write about anything on your mind...' },
};

export const Journaling: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'happy' as JournalEntry['mood'],
    type: 'custom' as JournalEntry['type'],
  });

  // Load journal entries from Supabase
  useEffect(() => {
    loadJournalEntries();
  }, [user]);

  const loadJournalEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading journal entries:', error);
        toast({
          title: "Error",
          description: "Failed to load journal entries",
          variant: "destructive"
        });
        return;
      }

      const formattedEntries: JournalEntry[] = data?.map(entry => ({
        id: entry.id,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        type: entry.type,
        date: new Date(entry.created_at),
        created_at: entry.created_at,
        updated_at: entry.updated_at
      })) || [];

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async () => {
    if (!newEntry.content.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: newEntry.title || journalTypes[newEntry.type].name,
          content: newEntry.content,
          mood: newEntry.mood,
          type: newEntry.type,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating journal entry:', error);
        toast({
          title: "Error",
          description: "Failed to save journal entry",
          variant: "destructive"
        });
        return;
      }

      const entry: JournalEntry = {
        id: data.id,
        title: data.title,
        content: data.content,
        mood: data.mood,
        type: data.type,
        date: new Date(data.created_at),
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setEntries(prev => [entry, ...prev]);
      setNewEntry({ title: '', content: '', mood: 'happy', type: 'custom' });
      setIsWriting(false);

      toast({
        title: "Success",
        description: "Journal entry saved successfully!",
      });
    } catch (error) {
      console.error('Error creating journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive"
      });
    }
  };

  const startNewEntry = (type: JournalEntry['type']) => {
    setNewEntry(prev => ({ ...prev, type, title: '' }));
    setIsWriting(true);
    setShowTypeDropdown(false);
  };

  if (isWriting) {
    return (
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="text-wellness-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            New Journal Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-wellness-soft rounded-lg">
            <span className="text-lg">{journalTypes[newEntry.type].emoji}</span>
            <span className="font-medium text-wellness-primary">{journalTypes[newEntry.type].name}</span>
          </div>

          <input
            type="text"
            placeholder="Entry title (optional)"
            value={newEntry.title}
            onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 bg-wellness-soft rounded-lg border-0 focus:ring-2 focus:ring-wellness-primary outline-none"
          />
          
          <Textarea
            placeholder={journalTypes[newEntry.type].placeholder}
            value={newEntry.content}
            onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
            className="min-h-32 resize-none"
            autoFocus
          />

          <div>
            <p className="text-sm text-muted-foreground mb-2">How are you feeling?</p>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(moodEmojis).map(([mood, emoji]) => (
                <button
                  key={mood}
                  onClick={() => setNewEntry(prev => ({ ...prev, mood: mood as JournalEntry['mood'] }))}
                  className={`p-2 rounded-lg border transition-colors ${
                    newEntry.mood === mood
                      ? 'bg-wellness-primary text-primary-foreground border-wellness-primary'
                      : 'bg-wellness-soft border-border hover:border-wellness-primary'
                  }`}
                >
                  <span className="text-lg mr-1">{emoji}</span>
                  <span className="text-sm capitalize">{mood}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={createEntry} className="bg-wellness-primary hover:bg-wellness-secondary">
              Save Entry
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsWriting(false)}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-wellness-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Journal
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Reflect on your thoughts and emotions
          </p>
        </div>
        <div className="relative">
          <Button 
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className="bg-wellness-primary hover:bg-wellness-secondary"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Entry
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
          
          {showTypeDropdown && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg min-w-48">
              <div className="py-1">
                {Object.entries(journalTypes).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => startNewEntry(key as JournalEntry['type'])}
                    className="w-full text-left px-4 py-2 hover:bg-wellness-soft transition-colors flex items-center gap-3"
                  >
                    <span className="text-lg">{type.emoji}</span>
                    <span className="font-medium">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {loading ? (
              <div className="py-8">
                <LottieLoader 
                  size={80} 
                  text="Loading your journal entries..." 
                />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-wellness-secondary" />
                <p>No journal entries yet.</p>
                <p className="text-sm">Start writing to track your wellness journey!</p>
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="p-4 bg-wellness-soft rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{journalTypes[entry.type].emoji}</span>
                      <h3 className="font-medium text-foreground">{entry.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {entry.date.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {entry.content}
                  </p>
                  
                  <Badge className={moodColors[entry.mood]}>
                    <span className="mr-1">{moodEmojis[entry.mood]}</span>
                    {entry.mood}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};