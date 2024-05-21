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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import * as React from "react"

import { DialogClose } from "@radix-ui/react-dialog";

export function DialogOnClick({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedDataSource, setSelectedDataSource] = useState<string>("");

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
            <Button type="submit">Add</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogOnClick;