import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home } from 'lucide-react';

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-800 flex items-center justify-center gap-2">
            <CheckCircle className="w-8 h-8" />
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Welcome to InspectSnap Pro! Your subscription has been activated successfully.
          </p>
          <p className="text-sm text-gray-500">
            You now have access to all premium features including unlimited inspections, 
            advanced reporting, and priority support.
          </p>
          <Link to="/">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;