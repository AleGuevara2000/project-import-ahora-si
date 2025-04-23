
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { mockUsers } from '@/types';

const UserCounter = () => {
  // For demo purposes, we'll use the mock users
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const userCount = mockUsers.length;

  return (
    <Card className="w-[300px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{userCount}</div>
        <p className="text-xs text-muted-foreground">
          usuarios registrados en {currentMonth}
        </p>
      </CardContent>
    </Card>
  );
};

export default UserCounter;
