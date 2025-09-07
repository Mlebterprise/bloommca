import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WheelOfLife } from "@/components/WheelOfLife";
import { AICoaching } from "@/components/AICoaching";
import { Journaling } from "@/components/Journaling";
import { ScheduleCall } from "@/components/ScheduleCall";
import { BottomNavigation } from "@/components/BottomNavigation";
import { MobileSettingsView } from "@/components/MobileSettingsView";
import { useAuth } from "@/components/AuthProvider";
import { LottieLoader } from "@/components/LottieLoader";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wheel');
  const [wheelScores, setWheelScores] = useState<{ [key: string]: number }>({
    Career: 7,
    Health: 8,
    Relationships: 6,
    'Personal Growth': 9,
    Family: 8,
    Recreation: 5,
    Money: 6,
    Emotions: 7,
  });

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading state with Lottie animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <LottieLoader 
          size={150} 
          text="Loading your wellness journey..." 
        />
      </div>
    );
  }

  // Don't render anything if redirecting to auth
  if (!user) {
    return null;
  }

  const handleScoreChange = (area: string, score: number) => {
    setWheelScores(prev => ({ ...prev, [area]: score }));
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'wheel':
        return (
          <WheelOfLife 
            scores={wheelScores}
            onScoreChange={handleScoreChange}
          />
        );
      case 'coaching':
        return <AICoaching />;
      case 'journal':
        return <Journaling />;
      case 'schedule':
        return <ScheduleCall />;
      case 'settings':
        return <MobileSettingsView />;
      default:
        return null;
    }
  };


  return (
    <>
      {/* SEO Meta Tags */}
      <title>Bloom - Women's Wellness & Mental Health Coach</title>
      <meta name="description" content="Empowering women through personalized wellness coaching, AI support, journaling, and life balance tools. Transform your mental health journey." />
      
      <div className="min-h-screen bg-gradient-soft pb-20">
        {/* Fixed Header */}
        <header className="sticky top-0 z-50 bg-gradient-primary text-primary-foreground px-6 py-3 rounded-b-2xl shadow-soft max-w-md mx-auto">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold flex items-center gap-2">
              🌸
              Bloom
            </h1>
          </div>
        </header>

        <div className="max-w-md mx-auto">


          {/* Quick Stats */}
          {activeTab === 'wheel' && (
            <div className="p-4 grid grid-cols-3 gap-3">
              <Card className="bg-gradient-card shadow-soft">
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold text-wellness-primary">
                    {Math.round((Object.values(wheelScores).reduce((a: number, b: number) => a + b, 0) / Object.values(wheelScores).length) * 10)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Life Balance</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-soft">
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold text-wellness-secondary">15</div>
                  <div className="text-xs text-muted-foreground">Journal Entries</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-soft">
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold text-wellness-accent">3</div>
                  <div className="text-xs text-muted-foreground">Coaching Sessions</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="p-4">
            {renderActiveComponent()}
          </div>

        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  );
};

export default Index;