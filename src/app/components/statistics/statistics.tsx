import { Separator } from "~/app/components/ui/separator";
import { cn } from "~/lib/utils";

export type StatisticsProps = React.HTMLAttributes<HTMLDivElement> & {
  stats: {
    text: string;
    value: number;
  }[];
};

const Statistics = (statisticsProps: StatisticsProps) => {
  const { stats, className, ...props } = statisticsProps;

  return (
    <div
      className={cn(
        "bg-white-separator flex flex-row gap-2 self-start rounded-sm border-2 bg-white p-3",
        className,
      )}
      {...props}
    >
      {stats.map((item, index) => {
        return (
          <div key={index} className="flex flex-row gap-2">
            <span className="text-base font-normal">{item.text}:</span>
            <span className="text-base font-bold">{item.value}</span>
            {index != stats.length - 1 && (
              <Separator
                className="h-6 w-0.5 bg-mantis-green-300"
                orientation="vertical"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Statistics;
