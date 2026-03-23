import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Notification = ({ message, type, title }) => {
  if (!message) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 pt-4">
      <Alert variant={type ?? "default"}>
        {title ? <AlertTitle>{title}</AlertTitle> : null}
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
};

export default Notification;
