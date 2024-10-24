export default function DashboardHeader({ heading, text }: { heading: string; text: string }) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
        <p className="text-lg text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
