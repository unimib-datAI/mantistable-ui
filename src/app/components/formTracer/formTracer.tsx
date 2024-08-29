import BlockTracer from "./blockTracer";
import { Separator } from "../ui/separator";
import { BlockTracerProps } from "./blockTracer";
import { cn } from "~/lib/utils";

export type FormTracerProps = React.HTMLAttributes<HTMLDivElement> & {
  blocks: BlockTracerProps[];
  currentActive: number;
};

const FormTracer = (formTracerProps: FormTracerProps) => {
  const { blocks, currentActive, className, ...props } = formTracerProps;
  return (
    <div className={cn("flex flex-col items-center", className)} {...props}>
      {blocks.map((item, index) => {
        return (
          <div className="flex flex-col items-center" key={index}>
            <BlockTracer
              icon={item.icon}
              title={item.title}
              description={item.description}
              selected={index == currentActive}
            />
            {index != blocks.length - 1 && (
              <Separator
                className="h-10 w-0.5 bg-mantis-green-300"
                orientation="vertical"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FormTracer;
