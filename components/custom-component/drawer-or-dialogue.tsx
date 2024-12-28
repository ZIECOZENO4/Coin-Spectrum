"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWindowSize } from "@uidotdev/usehooks";

interface DrawerDialogDemoProps {
  children: React.ReactNode;
  component: React.ComponentType<{
    open: boolean;
    setIsOpen: (open: boolean) => void;
    className?: string;
  }>;
}

export function DrawerDialogDemo({
  children,
  component: Component,
}: DrawerDialogDemoProps) {
  const [open, setOpen] = React.useState(false);
  const { width } = useWindowSize();
  const isDesktop = (width ?? 0) >= 768;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Component open={open} setIsOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <Component open={open} setIsOpen={setOpen} className="px-4" />
      </DrawerContent>
    </Drawer>
  );
}
