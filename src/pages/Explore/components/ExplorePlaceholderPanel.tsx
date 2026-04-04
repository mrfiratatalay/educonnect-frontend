import { Card, CardContent } from "@/components/ui/card";

interface ExplorePlaceholderPanelProps {
  title: string;
  description: string;
}

export default function ExplorePlaceholderPanel({
  title,
  description,
}: ExplorePlaceholderPanelProps) {
  return (
    <Card>
      <CardContent className="space-y-2 p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
