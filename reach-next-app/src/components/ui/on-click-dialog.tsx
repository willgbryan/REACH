"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@radix-ui/react-dialog";
import { createClient } from "@supabase/supabase-js";
import React from "react";

export default function DialogOnClick({
  isOpen,
  onOpenChange,
  onFileUpload,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: () => void;
}) {
  const [selectedDataSource, setSelectedDataSource] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_GITHUB_SUPABASE_KEY;
  const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    throw new Error("Missing env variables.");
  }

  // TODO implement user auth and only allow uploads to valid orgs, remove ServiceKey global
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFile(file || null);
  };

  const handleAddClick = async () => {
    if (!file) {
      alert("No file selected!");
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from("reach_uploads")
        .upload(`public/${file.name}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      alert("File uploaded successfully!");
      onFileUpload();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" style={{ display: "none" }}></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new data source</DialogTitle>
          <DialogDescription>
            Configure the new data source below. Click Add when finished.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center">
            <Select onValueChange={(value) => setSelectedDataSource(value)}>
              <SelectTrigger className="col-span-4">
                <SelectValue placeholder="Select a data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Files">Files</SelectItem>
                  <SelectItem value="Systems">Systems</SelectItem>
                  <SelectItem value="Internet">Internet</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {selectedDataSource === "Files" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file-upload" className="text-right">
                Upload File
              </Label>
              <Input
                type="file"
                id="file-upload"
                className="col-span-3"
                onChange={handleFileChange}
              />
            </div>
          )}

          {selectedDataSource === "Systems" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Combobox />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={handleAddClick}>
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
