import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import { MapPin, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Category = "waste" | "water" | "road";
type Status = "pending" | "in-progress" | "resolved";

interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  location: string;
  imageUrl?: string;
  createdAt: Date;
}

const categoryColors = {
  waste: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
  water: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
  road: "bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-200",
};

export default function ReportCard({
  id,
  title,
  description,
  category,
  status,
  location,
  imageUrl,
  createdAt,
}: ReportCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all" data-testid={`card-report-${id}`}>
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold line-clamp-2" data-testid={`text-title-${id}`}>
            {title}
          </h3>
        </div>
        
        <p className="text-muted-foreground line-clamp-3" data-testid={`text-description-${id}`}>
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={categoryColors[category]} data-testid={`badge-category-${id}`}>
            {category}
          </Badge>
          <StatusBadge status={status} />
        </div>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span data-testid={`text-location-${id}`}>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span data-testid={`text-date-${id}`}>
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
