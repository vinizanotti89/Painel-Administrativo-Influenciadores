import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import "@/styles/components/ui/Switch.css";

const Switch = React.forwardRef(({ className = '', ...props }, ref) => (
    <SwitchPrimitive.Root
        className={`switch-root ${className}`}
        {...props}
        ref={ref}
    >
        <SwitchPrimitive.Thumb
            className="switch-thumb"
        />
    </SwitchPrimitive.Root>
));

Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };