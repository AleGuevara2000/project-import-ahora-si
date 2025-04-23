
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ChatWindow from './ChatWindow';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatButton = () => {
  const isMobile = useIsMobile();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-in fade-in-50 slide-in-from-bottom-6"
          size={isMobile ? "icon" : "lg"}
        >
          <MessageCircle className="h-6 w-6" />
          {!isMobile && <span className="ml-2">Chat con bibliotecario</span>}
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[95vw] sm:w-[400px] md:w-[540px] p-0 h-[100vh] sm:h-[600px]"
      >
        <div className="h-full">
          <ChatWindow />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatButton;
