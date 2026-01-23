import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CookiePreferences {
  analytics: boolean;
  preferences: boolean;
  advertising: boolean;
}

const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    analytics: false,
    preferences: false,
    advertising: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setOpen(true);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem("cookieConsent", JSON.stringify(prefs));
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setOpen(false);
  };

  const handleAcceptSelected = () => {
    saveConsent(preferences);
  };

  const handleRefuseAll = () => {
    saveConsent({
      analytics: false,
      preferences: false,
      advertising: false,
    });
  };

  const handleAcceptAll = () => {
    saveConsent({
      analytics: true,
      preferences: true,
      advertising: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-6 bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Cookie settings
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-4">
            Our website uses cookies which are necessary for running the website and for providing the services you request. We would also like to set the following optional cookies on your device. You can change these settings any time later by clicking "Change cookie settings" at the bottom of any page. For more information, please read our{" "}
            <a href="#" className="underline text-foreground font-medium hover:text-primary">
              Cookie Information.
            </a>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Analytics */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="analytics"
              checked={preferences.analytics}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, analytics: checked as boolean })
              }
              className="mt-1 border-2 border-foreground rounded-sm"
            />
            <div className="space-y-1">
              <label
                htmlFor="analytics"
                className="text-base font-medium text-foreground cursor-pointer"
              >
                Analytics
              </label>
              <p className="text-sm text-muted-foreground">
                We collect statistics to understand how many visitors we have, how our visitors interact with the site and how we can improve it. The collected data does not directly identify anyone.
              </p>
            </div>
          </div>

          {/* Preferences */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="preferences"
              checked={preferences.preferences}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, preferences: checked as boolean })
              }
              className="mt-1 border-2 border-foreground rounded-sm"
            />
            <div className="space-y-1">
              <label
                htmlFor="preferences"
                className="text-base font-medium text-foreground cursor-pointer"
              >
                Preferences
              </label>
              <p className="text-sm text-muted-foreground">
                We store choices you have made so that they are remembered across visits in order to provide you a more personalized experience.
              </p>
            </div>
          </div>

          {/* Advertising and tracking */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="advertising"
              checked={preferences.advertising}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, advertising: checked as boolean })
              }
              className="mt-1 border-2 border-foreground rounded-sm"
            />
            <div className="space-y-1">
              <label
                htmlFor="advertising"
                className="text-base font-medium text-foreground cursor-pointer"
              >
                Advertising and tracking
              </label>
              <p className="text-sm text-muted-foreground">
                Your browsing behavior is tracked across websites by advertising and social network service providers. You may see tailored advertising and content on other websites based on your browsing profile.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          <Button
            variant="outline"
            onClick={handleAcceptSelected}
            className="rounded-full px-6 border-2 border-foreground text-foreground hover:bg-muted"
          >
            Accept selected
          </Button>
          <Button
            variant="outline"
            onClick={handleRefuseAll}
            className="rounded-full px-6 border-2 border-foreground text-foreground hover:bg-muted"
          >
            Refuse all
          </Button>
          <Button
            onClick={handleAcceptAll}
            className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Accept all
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookieConsent;
