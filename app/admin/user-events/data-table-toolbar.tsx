import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";

interface DataTableToolbarProps {
  onFilter: (value: string) => void;
  onExport: () => void;
  onSendReminders: () => void;
  selectedCount: number;
  isLoading: boolean;
}

export function DataTableToolbar({
  onFilter,
  onExport,
  onSendReminders,
  selectedCount,
  isLoading,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <Input
        placeholder="Filter by name..."
        onChange={(e) => onFilter(e.target.value)}
        className="max-w-sm"
        disabled={isLoading}
      />
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport} disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button
          onClick={onSendReminders}
          disabled={selectedCount === 0 || isLoading}
        >
          <Mail className="mr-2 h-4 w-4" />
          Send Reminders {selectedCount > 0 && `(${selectedCount})`}
        </Button>
      </div>
    </div>
  );
}
