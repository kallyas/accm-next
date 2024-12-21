import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { title: "Masters Scholarships Won", value: "14+" },
  { title: "PhD Scholarships won", value: " 7+" },
  { title: "Weekly Webinars attendance", value: "712+" },
  { title: "Bachelors Degrees Won ", value: "5+" },
];

export function StatisticsSection() {
  return (
    <section className="container py-12">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
