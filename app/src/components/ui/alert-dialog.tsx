import React from "react";

interface AlertDialogContextType {
  onOpenChange?: (open: boolean) => void;
}

interface AlertDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface AlertDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface AlertDialogContentProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface CommonProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogActionProps extends CommonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const AlertDialogContext = React.createContext<AlertDialogContextType | null>(
  null
);

const AlertDialog: React.FC<AlertDialogProps> = ({
  children,
  open,
  onOpenChange,
}) => {
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { open, onOpenChange } as any);
        }
        return child;
      })}
    </>
  );
};

const AlertDialogTrigger: React.FC<AlertDialogTriggerProps> = ({
  children,
  asChild,
}) => {
  const parent = React.useContext(AlertDialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => parent?.onOpenChange?.(true),
    } as any);
  }

  return (
    <button onClick={() => parent?.onOpenChange?.(true)}>{children}</button>
  );
};

const AlertDialogContent: React.FC<AlertDialogContentProps> = ({
  children,
  open,
  onOpenChange,
}) => {
  if (!open) return null;

  return (
    <AlertDialogContext.Provider value={{ onOpenChange }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => onOpenChange?.(false)}
        />
        <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 z-50">
          {children}
        </div>
      </div>
    </AlertDialogContext.Provider>
  );
};

const AlertDialogHeader: React.FC<CommonProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`flex flex-col space-y-2 mb-4 ${className}`}>
      {children}
    </div>
  );
};

const AlertDialogTitle: React.FC<CommonProps> = ({
  children,
  className = "",
}) => {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
};

const AlertDialogDescription: React.FC<CommonProps> = ({
  children,
  className = "",
}) => {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
};

const AlertDialogFooter: React.FC<CommonProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`flex justify-end space-x-2 mt-6 ${className}`}>
      {children}
    </div>
  );
};

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
}) => {
  const parent = React.useContext(AlertDialogContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    parent?.onOpenChange?.(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

const AlertDialogCancel: React.FC<AlertDialogActionProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
}) => {
  const parent = React.useContext(AlertDialogContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    parent?.onOpenChange?.(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};
