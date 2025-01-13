"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { Download, Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TEMPLATE_DATA = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "USER",
  },
];

interface ImportModalProps {
  onSuccess: () => void;
}

export function ImportModal({ onSuccess }: ImportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet(TEMPLATE_DATA);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users Template");
    XLSX.writeFile(workbook, "users_import_template.xlsx");
  };

  const validateData = (data: any[]) => {
    const requiredFields = ["firstName", "lastName", "email"];
    const errors = [];

    for (const [index, row] of data.entries()) {
      const missingFields = requiredFields.filter(field => !row[field]);
      if (missingFields.length > 0) {
        errors.push(`Row ${index + 1}: Missing required fields: ${missingFields.join(", ")}`);
      }
      if (row.email && !row.email.includes("@")) {
        errors.push(`Row ${index + 1}: Invalid email format`);
      }
    }

    return errors;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError(null);

    try {
      let data: any[];

      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(worksheet);
      } else if (file.name.endsWith(".csv")) {
        const text = await file.text();
        const result = Papa.parse(text, { header: true });
        data = result.data;
      } else {
        throw new Error("Unsupported file format");
      }

      // Validate data
      const validationErrors = validateData(data);
      if (validationErrors.length > 0) {
        throw new Error("Validation errors:\n" + validationErrors.join("\n"));
      }

      const processedData = data.map(row => ({
        firstName: row.firstName?.trim(),
        lastName: row.lastName?.trim(),
        email: row.email?.trim().toLowerCase(),
        role: row.role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER",
      }));

      const response = await fetch("/api/admin/users/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to import users");
      }

      toast({
        title: "Success",
        description: `${processedData.length} users have been imported.`,
      });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Import error:", error);
      setError(error instanceof Error ? error.message : "Failed to import users");
      toast({
        title: "Error",
        description: "Failed to import users. Please check the error details.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Import Users
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Users</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file with user data. Download the template for the correct format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            disabled={isImporting}
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="mt-1 whitespace-pre-wrap">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
