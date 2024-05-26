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
  const [uploadedBoxes, setUploadedBoxes] = useState<{ row: number; col: number }[]>([]);
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

  const handleFileUpload = () => {
    if (clickedBox) {
      setUploadedBoxes((prev) => [...prev, clickedBox]);
      setClickedBox(null);
    }
    setIsDialogOpen(false);
  };

  const getRandomColor = () => {
    return "--purple-300";
  };

  const isBoxUploaded = (row: number, col: number) => {
    return uploadedBoxes.some(box => box.row === row && box.col === col);
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
              {isBoxUploaded(i, j) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 192 192"
                  width="192"
                  height="192"
                  preserveAspectRatio="xMidYMid meet"
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: "translate3d(0px, 0px, 0px)",
                  }}
                  id="File"
                >
                  <defs>
                    <clipPath id="__lottie_element_2369">
                      <rect width="192" height="192" x="0" y="0" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#__lottie_element_2369)">
                    <g transform="matrix(1,0,0,1,74.44400024414062,116.71900177001953)" opacity="1" style={{ display: "none" }}>
                      <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fillOpacity="0"
                          stroke="rgb(7,5,6)"
                          strokeOpacity="1"
                          strokeWidth="10.228"
                          d="M35.48699951171875,5.113999843597412 C35.48699951171875,5.113999843597412 5.113999843597412,5.113999843597412 5.113999843597412,5.113999843597412"
                        />
                      </g>
                    </g>
                    <g transform="matrix(1,0,0,1,74.44400024414062,96.0530014038086)" opacity="1" style={{ display: "none" }}>
                      <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fillOpacity="0"
                          stroke="rgb(7,5,6)"
                          strokeOpacity="1"
                          strokeWidth="10.228"
                          d="M35.48699951171875,5.113999843597412 C35.48699951171875,5.113999843597412 5.113999843597412,5.113999843597412 5.113999843597412,5.113999843597412"
                        />
                      </g>
                    </g>
                    <g transform="matrix(1,0,0,1,74.44400024414062,75.38600158691406)" opacity="1" style={{ display: "block" }}>
                      <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fillOpacity="0"
                          stroke="rgb(7,5,6)"
                          strokeOpacity="1"
                          strokeWidth="10.228"
                          d="M10.175999641418457,5.113999843597412 C10.175999641418457,5.113999843597412 5.113999843597412,5.113999843597412 5.113999843597412,5.113999843597412"
                        />
                      </g>
                    </g>
                    <g transform="matrix(1,0,0,1,33.7400016784668,23.93000030517578)" opacity="1" style={{ display: "block" }}>
                      <g opacity="1" transform="matrix(1,0,0,1,61.00400161743164,72.06999969482422)">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fillOpacity="0"
                          stroke="rgb(7,5,6)"
                          strokeOpacity="1"
                          strokeWidth="10.228"
                          d="M35.435001373291016,-15.5 C35.435001373291016,-15.5 35.435001373291016,36.16699981689453 35.435001373291016,36.16699981689453 C35.435001373291016,41.874000549316406 30.902000427246094,46.5 25.31100082397461,46.5 C25.31100082397461,46.5 -25.31100082397461,46.5 -25.31100082397461,46.5 C-30.902000427246094,46.5 -35.435001373291016,41.874000549316406 -35.435001373291016,36.16699981689453 C-35.435001373291016,36.16699981689453 -35.435001373291016,-36.16699981689453 -35.435001373291016,-36.16699981689453 C-35.435001373291016,-41.874000549316406 -30.902000427246094,-46.5 -25.31100082397461,-46.5 C-25.31100082397461,-46.5 5.063000202178955,-46.5 5.063000202178955,-46.5"
                        />
                      </g>
                      <g opacity="1" transform="matrix(1,0,0,1,81.25299835205078,41.06999969482422)">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fillOpacity="0"
                          stroke="rgb(7,5,6)"
                          strokeOpacity="1"
                          strokeWidth="10.228"
                          d="M15.185999870300293,15.5 C15.185999870300293,15.5 -5.061999797821045,15.5 -5.061999797821045,15.5 C-10.654000282287598,15.5 -15.185999870300293,10.87399959564209 -15.185999870300293,5.166999816894531 C-15.185999870300293,5.166999816894531 -15.185999870300293,-15.5 -15.185999870300293,-15.5 C-15.185999870300293,-15.5 15.185999870300293,15.5 15.185999870300293,15.5z"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              ) : null}
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
