import { cn } from "~/lib/utils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/app/components/ui/alert";
export type ErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  errorTitle: string;
  errorDescription: string;
};
export const Error = (errorProps: ErrorProps) => {
  const { errorTitle, errorDescription, className, ...props } = errorProps;
  return (
    <div
      className={cn(
        "flex h-full items-center justify-center bg-mantis-white-300 p-8",
        className,
      )}
      {...props}
    >
      <Alert variant="destructive" className="max-w-80 shadow-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{errorTitle}</AlertTitle>
        <AlertDescription>{errorDescription}</AlertDescription>
      </Alert>
    </div>
  );
};
