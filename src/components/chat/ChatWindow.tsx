
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatWindow = () => {
  const [message, setMessage] = useState('');
  const isMobile = useIsMobile();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    console.log('Mensaje enviado:', message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary p-2 sm:p-4">
        <h2 className="text-base sm:text-lg font-bold text-primary-foreground">
          Chat con Bibliotecario
        </h2>
        <p className="text-xs sm:text-sm text-primary-foreground/80">
          Tiempo de respuesta aproximado: 5 minutos
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 bg-background">
        <div className="bg-muted p-2 sm:p-3 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            Bienvenido al chat de la biblioteca. ¿En qué podemos ayudarte?
          </p>
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="p-2 sm:p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isMobile ? "Escribe..." : "Escribe tu mensaje aquí..."}
            className="flex-1 h-8 sm:h-10 text-sm"
          />
          <Button 
            type="submit" 
            size={isMobile ? "sm" : "default"} 
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar mensaje</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
