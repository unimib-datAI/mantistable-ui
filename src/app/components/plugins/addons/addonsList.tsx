import { cn } from "~/lib/utils";
import { Label } from "~/app/components/ui/label";
import AddonItem from "~/app/components/plugins/addons/addonItem";
import { api } from "~/trpc/react";

export type AddonListProps = React.HTMLAttributes<HTMLDivElement> & {
  tableID: number;
};

const AddonList = (addonListProps: AddonListProps) => {
  const { tableID, className, ...props } = addonListProps;

  const addons = api.plugins.getPlugins.useQuery("ADDONS");

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Label className="text-center text-base font-bold">
        Plugins Available
      </Label>
      {addons.isSuccess && addons.data.plugins.length == 0 && (
        <div className="flex items-center justify-center">
          <p className="text-sm">No plugins available</p>
        </div>
      )}
      {addons.isSuccess &&
        addons.data.plugins.map((addonItem, index) => {
          return (
            <AddonItem key={index} addonItem={addonItem} tableID={tableID} />
          );
        })}
    </div>
  );
};

export default AddonList;
