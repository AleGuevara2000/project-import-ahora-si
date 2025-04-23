
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '@/types';

interface MetricsProps {
  role: UserRole;
  section: string;
}

const getMetricsData = (role: UserRole, section: string) => {
  // Simulate data - in a real app this would come from a backend
  return [
    { name: 'Ene', visits: Math.floor(Math.random() * 100) + 50 },
    { name: 'Feb', visits: Math.floor(Math.random() * 100) + 50 },
    { name: 'Mar', visits: Math.floor(Math.random() * 100) + 50 },
    { name: 'Abr', visits: Math.floor(Math.random() * 100) + 50 },
    { name: 'May', visits: Math.floor(Math.random() * 100) + 50 },
    { name: 'Jun', visits: Math.floor(Math.random() * 100) + 50 },
  ];
};

const SectionMetrics = ({ role, section }: MetricsProps) => {
  const data = getMetricsData(role, section);
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Análisis de uso - {section}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionMetrics;
