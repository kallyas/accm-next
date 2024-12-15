import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { title: "Active Mentors", value: "100+" },
  { title: "Mentees Supported", value: "5,000+" },
  { title: "Successful Career Transitions", value: "1,000+" },
  { title: "Workshops Conducted", value: "500+" },
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
