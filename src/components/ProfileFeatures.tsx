import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  History, 
  Award, 
  Bell, 
  Settings, 
  ArrowLeft,
  Save,
  User,
  MapPin,
  Smartphone,
  Mail,
  Shield
} from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface ProfileFeaturesProps {
  activeFeature: string | null;
  onBack: () => void;
}

const ProfileFeatures: React.FC<ProfileFeaturesProps> = ({ activeFeature, onBack }) => {
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    weeklyReport: false,
    newFeatures: true
  });

  const [userInfo, setUserInfo] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '',
    location: 'New York, NY'
  });

  const { formatPrice } = useCurrency();

  const mockScanHistory = [
    { id: 1, product: 'Coca-Cola 12 Pack', price: 4.99, store: 'Target', date: '2024-01-20', savings: 0.50 },
    { id: 2, product: 'iPhone 15 Pro', price: 999.99, store: 'Best Buy', date: '2024-01-19', savings: 50.00 },
    { id: 3, product: 'Organic Bananas', price: 2.49, store: 'Whole Foods', date: '2024-01-18', savings: 0.40 },
    { id: 4, product: 'Bread - Whole Wheat', price: 2.99, store: 'Walmart', date: '2024-01-17', savings: 0.30 },
    { id: 5, product: 'Greek Yogurt', price: 5.49, store: 'Kroger', date: '2024-01-16', savings: 1.00 }
  ];

  const mockAchievements = [
    { id: 1, name: 'First Scan', description: 'Scanned your first product', earned: true, date: '2024-01-10' },
    { id: 2, name: 'Price Hunter', description: 'Found 10 best deals', earned: true, date: '2024-01-15' },
    { id: 3, name: 'Community Helper', description: 'Added 50 price contributions', earned: true, date: '2024-01-18' },
    { id: 4, name: 'Savings Master', description: 'Saved over $1000', earned: true, date: '2024-01-20' },
    { id: 5, name: 'Top Contributor', description: 'Be in top 10 contributors', earned: false, date: null }
  ];

  const renderScanHistory = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold">Scan History</h2>
      </div>

      <div className="space-y-3">
        {mockScanHistory.map((scan) => (
          <Card key={scan.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">{scan.product}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{scan.store}</span>
                  <span>•</span>
                  <span>{scan.date}</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="font-bold">{formatPrice(scan.price)}</p>
                <p className="text-xs text-success">Saved {formatPrice(scan.savings)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold">Achievements</h2>
      </div>

      <div className="space-y-3">
        {mockAchievements.map((achievement) => (
          <Card key={achievement.id} className={`p-4 ${achievement.earned ? '' : 'opacity-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                achievement.earned ? 'bg-success-solid text-white' : 'bg-muted text-muted-foreground'
              }`}>
                <Award size={20} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{achievement.name}</h4>
                  {achievement.earned && <Badge variant="secondary" className="text-xs">Earned</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                {achievement.earned && achievement.date && (
                  <p className="text-xs text-muted-foreground">Earned on {achievement.date}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPriceAlerts = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold">Price Alerts</h2>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-semibold">Notification Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Price Drop Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when prices drop</p>
              </div>
              <Switch 
                checked={notifications.priceAlerts}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, priceAlerts: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Report</p>
                <p className="text-sm text-muted-foreground">Summary of your savings</p>
              </div>
              <Switch 
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReport: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Features</p>
                <p className="text-sm text-muted-foreground">Updates about new app features</p>
              </div>
              <Switch 
                checked={notifications.newFeatures}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newFeatures: checked }))}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Active Price Alerts</h3>
        <div className="text-center py-8">
          <Bell className="mx-auto mb-2 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">No active price alerts</p>
          <p className="text-sm text-muted-foreground mt-1">
            Scan products and enable alerts to get notified of price drops
          </p>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold">Settings</h2>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-semibold">Personal Information</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <Input
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Phone (Optional)</label>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={userInfo.phone}
                onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                placeholder="City, State"
                value={userInfo.location}
                onChange={(e) => setUserInfo(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <Button className="w-full bg-primary-solid text-primary-foreground">
            <Save size={16} className="mr-2" />
            Save Changes
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-semibold">Privacy & Security</h3>
          
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Shield className="text-muted-foreground" size={20} />
            <div className="flex-1">
              <p className="font-medium">Data Privacy</p>
              <p className="text-sm text-muted-foreground">Your data is encrypted and secure</p>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            View Privacy Policy
          </Button>
        </div>
      </Card>
    </div>
  );

  switch (activeFeature) {
    case 'history':
      return renderScanHistory();
    case 'achievements':
      return renderAchievements();
    case 'alerts':
      return renderPriceAlerts();
    case 'settings':
      return renderSettings();
    default:
      return null;
  }
};

export default ProfileFeatures;