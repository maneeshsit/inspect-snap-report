import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UpgradeButton = () => {
  const { user, isPro } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to upgrade to Pro",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPro) {
    return (
      <Button variant="outline" disabled>
        <Crown className="w-4 h-4 mr-2 text-yellow-500" />
        Pro Member
      </Button>
    );
  }

  return (
    <Button onClick={handleUpgrade} disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
      <Crown className="w-4 h-4 mr-2" />
      {loading ? 'Processing...' : 'Upgrade to Pro'}
    </Button>
  );
};

export default UpgradeButton;