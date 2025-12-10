import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { privateClient } from '@/integrations/supabase/privateClient';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';

export const PrivateContactScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = usePrivateAuth();
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'שגיאה',
        description: 'נא למלא את כל השדות',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'שגיאה',
        description: 'נא להתחבר מחדש',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await privateClient
        .from('support_tickets')
        .insert({
          reporter_id: user.id,
          subject: subject.trim(),
          description: message.trim(),
          ticket_type: 'private_user_inquiry',
          category: 'general',
          priority: 'medium',
          status: 'open',
        });

      if (error) throw error;

      toast({
        title: 'הפנייה נשלחה בהצלחה',
        description: 'נחזור אליך בהקדם',
      });

      navigate('/private/dashboard');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: 'שגיאה בשליחה',
        description: 'אנא נסה שוב מאוחר יותר',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container max-w-md mx-auto p-4 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/private/dashboard')}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">צור קשר</h1>
            <p className="text-sm text-muted-foreground">שלח הודעה לצוות התמיכה</p>
          </div>
        </div>

        {/* Contact Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">נושא</Label>
              <Input
                id="subject"
                placeholder="נושא הפנייה"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">הודעה</Label>
              <Textarea
                id="message"
                placeholder="תוכן ההודעה..."
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={submitting}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? (
                'שולח...'
              ) : (
                <>
                  <Send className="w-4 h-4 ml-2" />
                  שלח הודעה
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 אנחנו משתדלים להגיב לפניות תוך 24 שעות בימי עבודה
          </p>
        </Card>
      </div>
    </div>
  );
};
