import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const departments = [
  'Отдел 1', 'Отдел 2', 'Отдел 3', 'Отдел 4', 'Отдел 5',
  'Отдел 6', 'Отдел 7', 'Отдел 8', 'Отдел 9', 'Отдел 10',
  'Отдел 11', 'Отдел 12', 'Отдел 13', 'Отдел 14', 'Отдел 15'
];

const kpiNames = ['ТО', 'СК', 'ПК', 'Лиды', 'Услуги'];
const kpiIcons = ['Wrench', 'Building2', 'ShoppingBag', 'UserPlus', 'Briefcase'];

const mockData = [
  { date: '05.11', value1: 65, value2: 72, value3: 58, value4: 88, value5: 45 },
  { date: '06.11', value1: 70, value2: 68, value3: 62, value4: 85, value5: 52 },
  { date: '07.11', value1: 68, value2: 75, value3: 59, value4: 90, value5: 48 },
  { date: '08.11', value1: 75, value2: 78, value3: 65, value4: 92, value5: 55 },
  { date: '09.11', value1: 72, value2: 80, value3: 68, value4: 95, value5: 58 },
  { date: '10.11', value1: 80, value2: 82, value3: 70, value4: 93, value5: 62 },
  { date: '11.11', value1: 85, value2: 85, value3: 75, value4: 98, value5: 68 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [kpiValues, setKpiValues] = useState<Record<string, number[]>>(() => {
    const initial: Record<string, number[]> = {};
    departments.forEach(dept => {
      initial[dept] = [65, 72, 58, 88, 45];
    });
    return initial;
  });

  const updateKpiValue = (dept: string, kpiIndex: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setKpiValues(prev => ({
      ...prev,
      [dept]: prev[dept].map((v, i) => i === kpiIndex ? numValue : v)
    }));
  };

  const getAverageKpi = () => {
    const totals = [0, 0, 0, 0, 0];
    departments.forEach(dept => {
      kpiValues[dept].forEach((val, idx) => {
        totals[idx] += val;
      });
    });
    return totals.map(t => Math.round(t / departments.length));
  };

  const averageKpis = getAverageKpi();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              KPI Dashboard
            </h1>
            <p className="text-muted-foreground">
              Мониторинг 5 показателей от 15 отделов
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Отделы</TabsTrigger>
            <TabsTrigger value="sk">СК</TabsTrigger>
            <TabsTrigger value="pk">ПК</TabsTrigger>
            <TabsTrigger value="leads">Лиды</TabsTrigger>
            <TabsTrigger value="services">Услуги</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {kpiNames.map((name, idx) => (
                <Card key={idx} className="p-6 hover-scale transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon name={kpiIcons[idx]} className="text-primary" size={24} />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {averageKpis[idx]}%
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-2xl font-bold">{averageKpis[idx]}</span>
                      <span className="text-muted-foreground">/ 100</span>
                    </div>
                    <Progress value={averageKpis[idx]} className="h-2" />
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Динамика показателей</h3>
                  <div className="flex gap-2">
                    <Icon name="TrendingUp" className="text-success" size={20} />
                    <span className="text-sm font-medium text-success">+12.5%</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="value1" stroke="hsl(var(--chart-1))" strokeWidth={2} name="KPI 1" />
                    <Line type="monotone" dataKey="value2" stroke="hsl(var(--chart-2))" strokeWidth={2} name="KPI 2" />
                    <Line type="monotone" dataKey="value3" stroke="hsl(var(--chart-3))" strokeWidth={2} name="KPI 3" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Сравнение отделов</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value1" fill="hsl(var(--chart-1))" name="Отдел 1" />
                    <Bar dataKey="value2" fill="hsl(var(--chart-2))" name="Отдел 2" />
                    <Bar dataKey="value3" fill="hsl(var(--chart-3))" name="Отдел 3" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">15 отделов — клик для ввода KPI</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {departments.map((dept, idx) => {
                  const avgValue = Math.round(kpiValues[dept].reduce((a, b) => a + b, 0) / 5);
                  return (
                    <Dialog key={idx}>
                      <DialogTrigger asChild>
                        <div 
                          className="p-4 border border-border rounded-lg hover:border-primary transition-all cursor-pointer hover-scale"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon name="Users" className="text-primary" size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">{dept}</h4>
                              <p className="text-xs text-muted-foreground">5 KPI</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Progress value={avgValue} className="h-1.5" />
                            <p className="text-xs text-right text-muted-foreground">
                              {avgValue}% среднее
                            </p>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <Icon name="Users" className="text-primary" size={24} />
                            {dept}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {kpiNames.map((kpiName, kpiIdx) => (
                            <div key={kpiIdx} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium flex items-center gap-2">
                                  <Icon name={kpiIcons[kpiIdx]} size={16} />
                                  {kpiName}
                                </label>
                                <span className="text-xs text-muted-foreground">
                                  {kpiValues[dept][kpiIdx]}%
                                </span>
                              </div>
                              <Input 
                                type="number" 
                                min="0"
                                max="100"
                                value={kpiValues[dept][kpiIdx]}
                                onChange={(e) => updateKpiValue(dept, kpiIdx, e.target.value)}
                                placeholder="Введите значение"
                              />
                              <Progress value={kpiValues[dept][kpiIdx]} className="h-2" />
                            </div>
                          ))}
                          <Button className="w-full mt-4">
                            <Icon name="Save" size={20} className="mr-2" />
                            Сохранить изменения
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sk" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Icon name="Building2" className="text-secondary" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">СК</h2>
                  <p className="text-muted-foreground">Строительная компания</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value1" fill="hsl(var(--chart-1))" name="План" />
                  <Bar dataKey="value2" fill="hsl(var(--chart-2))" name="Факт" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="pk" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-chart-3/20 rounded-lg">
                  <Icon name="ShoppingBag" className="text-chart-3" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">ПК</h2>
                  <p className="text-muted-foreground">Производственная компания</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value4" fill="hsl(var(--chart-3))" name="Производство" />
                  <Bar dataKey="value5" fill="hsl(var(--chart-4))" name="Качество" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-chart-4/20 rounded-lg">
                  <Icon name="UserPlus" className="text-chart-4" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Лиды</h2>
                  <p className="text-muted-foreground">Управление потенциальными клиентами</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Новые', value: 124, icon: 'UserPlus', color: 'chart-1' },
                  { label: 'В работе', value: 86, icon: 'Clock', color: 'chart-2' },
                  { label: 'Конверсия', value: '32%', icon: 'TrendingUp', color: 'chart-3' },
                  { label: 'Закрыто', value: 45, icon: 'CheckCircle2', color: 'chart-4' },
                ].map((item, idx) => (
                  <div key={idx} className="p-6 border border-border rounded-lg text-center hover-scale transition-all">
                    <Icon name={item.icon} className={`text-${item.color} mx-auto mb-3`} size={32} />
                    <div className="text-3xl font-bold mb-1">{item.value}</div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-chart-5/20 rounded-lg">
                  <Icon name="Briefcase" className="text-chart-5" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Услуги</h2>
                  <p className="text-muted-foreground">Показатели предоставления услуг</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[
                    { name: 'Консультации', value: 92, total: 100 },
                    { name: 'Установка', value: 78, total: 100 },
                    { name: 'Поддержка', value: 85, total: 100 },
                    { name: 'Обучение', value: 68, total: 100 },
                    { name: 'Аудит', value: 95, total: 100 },
                  ].map((service, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {service.value}/{service.total}
                        </span>
                      </div>
                      <Progress value={service.value} className="h-2" />
                    </div>
                  ))}
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="value4" stroke="hsl(var(--chart-5))" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;