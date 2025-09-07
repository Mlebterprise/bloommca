import React from 'react';
import { Heart, Bot, BookOpen, Calendar, Settings } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'wheel', label: 'Wheel', icon: Heart },
  { id: 'coaching', label: 'AI Coach', icon: Bot },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="max-w-md mx-auto">
        <div className="flex">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 py-3 px-1 flex flex-col items-center justify-center transition-colors relative ${
                  isActive
                    ? 'text-wellness-primary bg-wellness-soft/50'
                    : 'text-muted-foreground hover:text-wellness-primary hover:bg-wellness-soft/30'
                }`}
              >
                <IconComponent className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-wellness-primary rounded-t" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};