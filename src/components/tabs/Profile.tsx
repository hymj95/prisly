import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CurrencySelector from '../CurrencySelector';
import ProfileFeatures from '../ProfileFeatures';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  User, 
  Settings, 
  Crown, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Bell,
  MapPin,
  History,
  Award,
  ChevronRight,
  Globe
} from 'lucide-react';

const mockUserStats = {
  name: 'Sarah Johnson',
  email: 'sarah.j@email.com',
  level: 'Power Saver',
  totalScans: 347,
  totalSavings: 1248.50,
  priceContributions: 89,
  rank: 12,
  accuracy: 94.2
};

const mockRecentActivity = [
  {
    id: 1,
    type: 'scan',
    product: 'iPhone 15 Pro',
    action: 'Scanned product',
    price: 999.99,
    savings: 50.00,
    timeAgo: '2h ago'
  },
  {
    id: 2,
    type: 'contribution',
    product: 'Organic Milk',
    action: 'Added price data',
    price: 3.49,
    timeAgo: '5h ago'
  },
  {
    id: 3,
    type: 'achievement',
    product: null,
    action: 'Reached 100 scans milestone',
    timeAgo: '2d ago'
  }
];

const mockAchievements = [
  { id: 1, name: 'First Scan', description: 'Scanned your first product', earned: true },
  { id: 2, name: 'Price Hunter', description: 'Found 10 best deals', earned: true },
  { id: 3, name: 'Community Helper', description: 'Added 50 price contributions', earned: true },
  { id: 4, name: 'Savings Master', description: 'Saved over $1000', earned: true },
  { id: 5, name: 'Top Contributor', description: 'Be in top 10 contributors', earned: false }
];

const Profile: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  if (activeFeature) {
    return (
      <ProfileFeatures 
        activeFeature={activeFeature} 
        onBack={() => setActiveFeature(null)} 
      />
    );
  }
  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Profile Header */}
      <Card className="p-6 bg-card-subtle border-0">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-primary text-white text-xl">
              {mockUserStats.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{mockUserStats.name}</h2>
              <Badge variant="secondary" className="text-xs">
                <Crown size={12} className="mr-1" />
                {mockUserStats.level}
              </Badge>
            </div>
            <p className="text-muted-foreground">{mockUserStats.email}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Rank #{mockUserStats.rank}</span>
              <span>•</span>
              <span>{mockUserStats.accuracy}% accuracy</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 text-center">
          <TrendingUp className="mx-auto mb-2 text-primary" size={24} />
          <p className="text-2xl font-bold">{mockUserStats.totalScans}</p>
          <p className="text-xs text-muted-foreground">Products Scanned</p>
        </Card>
        
        <Card className="p-4 text-center">
          <DollarSign className="mx-auto mb-2 text-success" size={24} />
          <p className="text-2xl font-bold">{formatPrice(mockUserStats.totalSavings)}</p>
          <p className="text-xs text-muted-foreground">Total Savings</p>
        </Card>
        
        <Card className="p-4 text-center">
          <ShoppingBag className="mx-auto mb-2 text-accent" size={24} />
          <p className="text-2xl font-bold">{mockUserStats.priceContributions}</p>
          <p className="text-xs text-muted-foreground">Price Reports</p>
        </Card>
        
        <Card className="p-4 text-center">
          <Award className="mx-auto mb-2 text-warning" size={24} />
          <p className="text-2xl font-bold">{mockAchievements.filter(a => a.earned).length}</p>
          <p className="text-xs text-muted-foreground">Achievements</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold">Quick Actions</h3>
        
        <div className="space-y-2">
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="text-muted-foreground" size={20} />
                <span className="font-medium">Currency</span>
              </div>
              <div className="w-32">
                <CurrencySelector />
              </div>
            </div>
          </Card>
          
          <Card className="p-3 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setActiveFeature('history')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="text-muted-foreground" size={20} />
                <span className="font-medium">Scan History</span>
              </div>
              <ChevronRight className="text-muted-foreground" size={16} />
            </div>
          </Card>
          
          <Card className="p-3 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setActiveFeature('achievements')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="text-muted-foreground" size={20} />
                <span className="font-medium">Achievements</span>
              </div>
              <ChevronRight className="text-muted-foreground" size={16} />
            </div>
          </Card>
          
          <Card className="p-3 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setActiveFeature('alerts')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-muted-foreground" size={20} />
                <span className="font-medium">Price Alerts</span>
              </div>
              <ChevronRight className="text-muted-foreground" size={16} />
            </div>
          </Card>
          
          <Card className="p-3 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setActiveFeature('settings')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="text-muted-foreground" size={20} />
                <span className="font-medium">Settings</span>
              </div>
              <ChevronRight className="text-muted-foreground" size={16} />
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="font-semibold">Recent Activity</h3>
        
        <div className="space-y-2">
          {mockRecentActivity.map((activity) => (
            <Card key={activity.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'scan' ? 'bg-primary/10 text-primary' :
                  activity.type === 'contribution' ? 'bg-success/10 text-success' :
                  'bg-warning/10 text-warning'
                }`}>
                  {activity.type === 'scan' && <TrendingUp size={16} />}
                  {activity.type === 'contribution' && <DollarSign size={16} />}
                  {activity.type === 'achievement' && <Award size={16} />}
                </div>
                
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  {activity.product && (
                    <p className="text-xs text-muted-foreground">{activity.product}</p>
                  )}
                </div>
                
                <div className="text-right text-xs text-muted-foreground">
                  {activity.price && <p className="font-semibold">{formatPrice(activity.price)}</p>}
                  {activity.savings && <p className="text-success">-{formatPrice(activity.savings)}</p>}
                  <p>{activity.timeAgo}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievement Preview */}
      <Card className="p-4 bg-success-solid border-0">
        <div className="space-y-3 text-white">
          <div className="flex items-center gap-2">
            <Award size={20} />
            <h3 className="font-semibold">Latest Achievement</h3>
          </div>
          <div>
            <h4 className="font-medium">Savings Master</h4>
            <p className="text-sm opacity-90">You've saved over $1000! Keep finding those deals!</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;