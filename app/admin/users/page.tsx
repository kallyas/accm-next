"use client"

import { useState } from "react"
import { UsersManager } from "@/components/admin/users-manager"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

export default function AdminUsersPage() {
  const [isImporting, setIsImporting] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)

    try {
      let data: any[]

      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        data = XLSX.utils.sheet_to_json(worksheet)
      } else if (file.name.endsWith('.csv')) {
        const text = await file.text()
        const result = Papa.parse(text, { header: true })
        data = result.data
      } else {
        throw new Error('Unsupported file format')
      }

      // Process and validate the data
      const processedData = data.map(row => ({
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        role: row.role || 'USER',
      }))

      // Send the data to the server
      const response = await fetch('/api/admin/users/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      })

      if (!response.ok) {
        throw new Error('Failed to import users')
      }

      toast({
        title: "Users imported successfully",
        description: `${processedData.length} users have been imported.`,
      })
    } catch (error) {
      console.error('Error importing users:', error)
      toast({
        title: "Error",
        description: "Failed to import users. Please check your file and try again.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="mb-4 flex items-center gap-4">
        <Input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          disabled={isImporting}
        />
        <Button disabled={isImporting}>
          {isImporting ? "Importing..." : "Import Users"}
        </Button>
      </div>
      <UsersManager />
    </div>
  )
}

