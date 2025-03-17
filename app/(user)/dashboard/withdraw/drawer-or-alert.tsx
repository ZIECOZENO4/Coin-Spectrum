"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useWindowSize } from "@uidotdev/usehooks";

// interface DrawerDialogDemoProps {
//   children: React.ReactNode;
//   component: React.ComponentType<{
//     open: boolean;
//     setIsOpen: (open: boolean) => void;
//     setIsConfirmed: (confirmed: boolean) => void;
//     className?: string;
//   }>;
//   isOpen: boolean;
//   setIsOpen: (open: boolean) => void;
//   setIsConfirmed: (confirmed: boolean) => void;
// }

// export function DrawerDialogDemo({
//   children,
//   component: Component,
//   isOpen,
//   setIsOpen,
//   setIsConfirmed,
// }: DrawerDialogDemoProps) {
//   const { width } = useWindowSize();
//   const isDesktop = (width ?? 0) >= 768;

//   if (isDesktop) {
//     return (
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogTrigger asChild>{children}</DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <Component
//             open={isOpen}
//             setIsOpen={setIsOpen}
//             setIsConfirmed={setIsConfirmed}
//           />
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <Drawer open={isOpen} onOpenChange={setIsOpen}>
//       <DrawerTrigger asChild>{children}</DrawerTrigger>
//       <DrawerContent>
//         <Component
//           open={isOpen}
//           setIsOpen={setIsOpen}
//           setIsConfirmed={setIsConfirmed}
//           className="px-4"
//         />
//       </DrawerContent>
//     </Drawer>
//   );
// }


// Update the interface to include eligibilityData
interface DrawerDialogDemoProps {
  children: React.ReactNode;
  component: React.ComponentType<{
    open: boolean;
    setIsOpen: (open: boolean) => void;
    setIsConfirmed: (confirmed: boolean) => void;
    eligibilityData: {
      isEligible: boolean;
      tradeCount: number;
      requirementStatus: string;
    };
    formValues: {
      withdrawalAmount: number;
      walletAddress: string;
      cryptoType: string;
    };
    className?: string;
  }>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setIsConfirmed: (confirmed: boolean) => void;
  eligibilityData: {
    isEligible: boolean;
    tradeCount: number;
    requirementStatus: string;
  };
  formValues: {
    withdrawalAmount: number;
    walletAddress: string;
    cryptoType: string;
  };
}

export function DrawerDialogDemo({
  children,
  component: Component,
  isOpen,
  setIsOpen,
  setIsConfirmed,
  eligibilityData,
  formValues // Add formValues prop
}: DrawerDialogDemoProps) {
  const { width } = useWindowSize();
  const isDesktop = (width ?? 0) >= 768;

  return (
    <>
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Component
              open={isOpen}
              setIsOpen={setIsOpen}
              setIsConfirmed={setIsConfirmed}
              eligibilityData={eligibilityData}
              formValues={formValues} // Pass formValues
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>{children}</DrawerTrigger>
          <DrawerContent>
            <Component
              open={isOpen}
              setIsOpen={setIsOpen}
              setIsConfirmed={setIsConfirmed}
              eligibilityData={eligibilityData}
              formValues={formValues} // Pass formValues
              className="px-4"
            />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
