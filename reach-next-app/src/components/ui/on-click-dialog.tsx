"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { processUploadFiles } from "@/services/api";

export default function DialogOnClick({
  isOpen,
  onOpenChange,
  onFileUpload,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: (dataSource: string) => void;
}) {
  const [selectedDataSource, setSelectedDataSource] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [frequency, setFrequency] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [numRows, setNumRows] = useState<number>(0);

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
    try {
      if (selectedDataSource === "Files") {
        if (!file) {
          alert("Please select a file.");
          return;
        }

        const { data, error } = await supabase.storage
          .from("reach_uploads")
          .upload(`public/${file.name}`, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        alert("File uploaded to Supabase successfully!");

        const backendResponse = await processUploadFiles([file], "test");
        console.log("Backend upload response:", backendResponse);
        alert("File upload successful, a file icon will appear when processing is complete");
      } else if (selectedDataSource === "Systems") {
        console.log("System added successfully");
        // handle action here
      } else if (selectedDataSource === "Internet") {
        console.log("Web added");
        // handle action here
      } else if (selectedDataSource === "Schedule") {
        console.log("Scheduling with frequency:", frequency);
        // Handle scheduling action here
      } else if (selectedDataSource === "Analyze") {
        console.log("Analyzing with prompt:", prompt);
        // Handle analyze action here
      } else if (selectedDataSource === "Collect") {
        console.log("Collecting", numRows, "rows");
        // Handle collect action here
      } else if (selectedDataSource === "Paragraph") {
        console.log("paragraph added");
        // handle action here
      } else if (selectedDataSource === "Research Report") {
        console.log("report added");
        // Handle scheduling action here
      } else if (selectedDataSource === "Deep Report") {
        console.log("deep added");
        // Handle analyze action here
      } else if (selectedDataSource === "Table") {
        console.log("table added");
        // Handle collect action here
      } else {
        console.log("Selected Data Source:", selectedDataSource);
        // Handle other cases or show an alert
        alert("Please select a valid data source.");
      }

      onFileUpload(selectedDataSource); // Pass the selected data source to the parent component
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" style={{ display: "none" }}></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Tabs defaultValue="inputs" className="w-[550px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="outputs">Outputs</TabsTrigger>
          </TabsList>
          <TabsContent value="inputs">
            <Card>
              <CardHeader>
                <CardTitle>Inputs</CardTitle>
                <CardDescription>
                  Add a new input.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
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
                    <div className="grid grid-cols-5 items-center gap-4">
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
              </CardContent>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" onClick={handleAddClick}>
                    Add
                  </Button>
                </DialogClose>
              </DialogFooter>
            </Card>
          </TabsContent>
          <TabsContent value="outputs">
            <Card>
              <CardHeader>
                <CardTitle>Outputs</CardTitle>
                <CardDescription>
                  Define an output type.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center">
                    <Select onValueChange={(value) => setSelectedDataSource(value)}>
                      <SelectTrigger className="col-span-4">
                        <SelectValue placeholder="Select an output type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Paragraph">Paragraph</SelectItem>
                          <SelectItem value="Research Report">Report</SelectItem>
                          <SelectItem value="Deep Report">Extended Report</SelectItem>
                          <SelectItem value="Table">Table</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" onClick={handleAddClick}>
                    Add
                  </Button>
                </DialogClose>
              </DialogFooter>
            </Card>
          </TabsContent>
          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  What do you want to do?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center">
                    <Select onValueChange={(value) => setSelectedDataSource(value)}>
                      <SelectTrigger className="col-span-4">
                        <SelectValue placeholder="Select an action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Schedule">Schedule</SelectItem>
                          <SelectItem value="Analyze">Analyze</SelectItem>
                          <SelectItem value="Collect">Collect</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedDataSource === "Schedule" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="frequency" className="text-right">
                        Frequency
                      </Label>
                      <Combobox />
                    </div>
                  )}
                  {selectedDataSource === "Analyze" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="prompt" className="text-right">
                        Prompt
                      </Label>
                      <Input
                        id="Analyze"
                        defaultValue="What is the socioeconomic state of the world?"
                        className="col-span-3"
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </div>
                  )}
                  {selectedDataSource === "Collect" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">
                        Number of rows
                      </Label>
                      <Input
                        id="Analyze"
                        className="col-span-3"
                        type="number"
                        onChange={(e) => setNumRows(Number(e.target.value))}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" onClick={handleAddClick}>
                    Add
                  </Button>
                </DialogClose>
              </DialogFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
