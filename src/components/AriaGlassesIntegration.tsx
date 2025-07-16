import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Glasses, Wifi, WifiOff, Camera, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AriaDevice {
  id: string;
  name: string;
  connected: boolean;
  batteryLevel: number;
}

interface AriaGlassesIntegrationProps {
  onPhotoCapture?: (photoData: string) => void;
  onVoiceCommand?: (command: string) => void;
}

const AriaGlassesIntegration: React.FC<AriaGlassesIntegrationProps> = ({
  onPhotoCapture,
  onVoiceCommand
}) => {
  const [device, setDevice] = useState<AriaDevice | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  // Simulated Aria Glasses API integration
  // In a real implementation, you would use the actual Aria SDK
  const connectToAriaGlasses = async () => {
    setIsConnecting(true);
    
    try {
      // Simulated connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock device connection
      const mockDevice: AriaDevice = {
        id: 'aria-001',
        name: 'Aria Glasses Pro',
        connected: true,
        batteryLevel: 85
      };
      
      setDevice(mockDevice);
      toast({
        title: "Connected to Aria Glasses",
        description: "Your smart glasses are now connected and ready to use",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Aria Glasses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectAriaGlasses = () => {
    setDevice(null);
    setIsListening(false);
    toast({
      title: "Disconnected",
      description: "Aria Glasses disconnected successfully",
    });
  };

  const capturePhoto = async () => {
    if (!device?.connected) {
      toast({
        title: "Not Connected",
        description: "Please connect your Aria Glasses first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulated photo capture from glasses
      const mockPhotoData = `data:image/jpeg;base64,${Math.random().toString(36)}`;
      onPhotoCapture?.(mockPhotoData);
      
      toast({
        title: "Photo Captured",
        description: "Photo captured from Aria Glasses successfully",
      });
    } catch (error) {
      toast({
        title: "Capture Failed",
        description: "Failed to capture photo from Aria Glasses",
        variant: "destructive",
      });
    }
  };

  const toggleVoiceCommands = () => {
    if (!device?.connected) {
      toast({
        title: "Not Connected",
        description: "Please connect your Aria Glasses first",
        variant: "destructive",
      });
      return;
    }

    setIsListening(!isListening);
    
    if (!isListening) {
      // Start listening for voice commands
      toast({
        title: "Voice Commands Active",
        description: "Say 'capture photo', 'start inspection', or 'save notes'",
      });
      
      // Simulate voice command recognition
      setTimeout(() => {
        const commands = ['capture photo', 'start inspection', 'save notes'];
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        onVoiceCommand?.(randomCommand);
        
        toast({
          title: "Voice Command Detected",
          description: `Command: "${randomCommand}"`,
        });
      }, 5000);
    } else {
      toast({
        title: "Voice Commands Disabled",
        description: "Voice command recognition stopped",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Glasses className="w-5 h-5" />
          Connect via Smart Glasses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!device ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Connect your Aria Glasses to capture photos and use voice commands
            </p>
            <Button 
              onClick={connectToAriaGlasses} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>Connecting...</>
              ) : (
                <>
                  <Wifi className="w-4 h-4 mr-2" />
                  Connect Aria Glasses
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{device.name}</p>
                <p className="text-sm text-muted-foreground">
                  Battery: {device.batteryLevel}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={disconnectAriaGlasses}
                >
                  <WifiOff className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={capturePhoto} variant="outline">
                <Camera className="w-4 h-4 mr-2" />
                Capture Photo
              </Button>
              <Button 
                onClick={toggleVoiceCommands} 
                variant={isListening ? "destructive" : "outline"}
              >
                <Mic className="w-4 h-4 mr-2" />
                {isListening ? 'Stop Listening' : 'Voice Commands'}
              </Button>
            </div>
            
            {isListening && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="animate-pulse text-blue-600">
                  🎤 Listening for voice commands...
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Try saying: "capture photo", "start inspection", or "save notes"
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AriaGlassesIntegration;