"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import DialogOnClick from "@/components/ui/on-click-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clickedBox, setClickedBox] = useState<{ row: number; col: number } | null>(null);
  const [uploadedBoxes, setUploadedBoxes] = useState<{ row: number; col: number; dataSource: string }[]>([]);
  const [showPopover, setShowPopover] = useState(false);
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);

  const handleBoxClick = (row: number, col: number) => {
    const box = { row, col };
    if (isBoxUploaded(row, col)) {
      setShowPopover(true);
    } else {
      setClickedBox(box);
      setIsDialogOpen(true);
    }
  };

  const handleFileUpload = (dataSource: string) => {
    if (clickedBox) {
      setUploadedBoxes((prev) => [...prev, { ...clickedBox, dataSource }]);
      setClickedBox(null);
    }
    setIsDialogOpen(false);
  };

  const getRandomColor = () => {
    return "--purple-300";
  };

  const isBoxUploaded = (row: number, col: number) => {
    const uploadedBox = uploadedBoxes.find(box => box.row === row && box.col === col);
    if (uploadedBox) {
      switch (uploadedBox.dataSource) {
        case "Files":
          return <span>File uploaded</span>;
        case "Systems":
          return <span>System added</span>;
        case "Internet":
          return <span>Internet source added</span>;
        case "Schedule":
          return <span>Scheduled</span>;
        case "Analyze":
          return <span>Analyzing</span>;
        case "Collect":
          return <span>Collecting data</span>;
        case "Paragraph":
          return <span>Paragraph</span>;
        case "Research Report":
          return <span>Research Report</span>;
        case "Deep Report":
          return <span>Deep Report</span>;
        case "Table":
          return <span>Table</span>;
        default:
          return <span>Unknown</span>;
      }
    }
    return null;
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.9) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex  -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 ",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div key={`row${i}`} className="w-16 h-8 relative">
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `var(${getRandomColor()})`,
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col${j}`}
              className="w-16 h-8 relative"
              onClick={() => handleBoxClick(i, j)}
            >
              {isBoxUploaded(i, j)}
            </motion.div>
          ))}
        </motion.div>
      ))}
      <DialogOnClick
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onFileUpload={handleFileUpload}
      />
      {showPopover && (
        <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  defaultValue="100%"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">Max. width</Label>
                <Input
                  id="maxWidth"
                  defaultValue="300px"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  defaultValue="25px"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxHeight">Max. height</Label>
                <Input
                  id="maxHeight"
                  defaultValue="none"
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      )}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
