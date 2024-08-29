import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/app/components/ui/select";
import { Error } from "~/app/components/error/error";
import { Button } from "~/app/components/ui/button";
import { api } from "~/trpc/react";
import Loader from "~/app/components/ui/loader";
import { AvailableIcon } from "~/app/components/ui/icons/available";
import { UnavailableIcon } from "~/app/components/ui/icons/unavailable";
import { Dispatch, SetStateAction, useState } from "react";
import { Plugin } from "~/utils/types/export";

export type TransformPopoverContentProps =
  React.HTMLAttributes<HTMLDivElement> & {
    onConfirm: Dispatch<
      SetStateAction<{ available: boolean; selected: string }>
    >;
    columnType?: string;
  };

const TransformPopoverContent = (
  transformerPopoverContentProps: TransformPopoverContentProps,
) => {
  const { onConfirm, columnType, className, ...props } =
    transformerPopoverContentProps;
  const getTransforms = api.plugins.getPlugins.useQuery("TRANSFORM");
  const [selectedTransform, setSelectedTransform] = useState<
    Plugin | undefined
  >(undefined);
  const [filter, setFilter] = useState<"AVAILABLE" | "UNAVAILABLE" | "ALL">(
    "ALL",
  );

  if (getTransforms.isError || columnType == undefined) {
    return (
      <div className="flex items-center justify-center">
        <Error
          errorTitle="Transforms Error"
          errorDescription="Error on loading Transforms, please check connectivity"
        />
      </div>
    );
  }

  if (getTransforms.isSuccess && columnType != undefined) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          {/* Title */}
          <p className="text-base font-bold text-mantis-green-400">
            Transformer plugins
          </p>
          {/* Description */}
          <p className="text-sm">
            Select the plugin you wish to apply on the chosen column
          </p>
        </div>
        {getTransforms.data.plugins.length == 0 && <p>No plugins available</p>}
        {getTransforms.data.plugins.length > 0 && (
          <div className="flex flex-row gap-4">
            {/* Select Transform */}
            <Select
              onValueChange={(value) =>
                getTransforms.data.plugins.map((transformPlugin) => {
                  if (transformPlugin.name == value) {
                    setSelectedTransform(transformPlugin);
                  }
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the transformer plugin" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Transform Plugins</SelectLabel>
                  {getTransforms.data.plugins.map((transformPlugin, index) => {
                    if (
                      (transformPlugin.configurations.column_type ==
                        columnType &&
                        filter == "AVAILABLE") ||
                      (transformPlugin.configurations.column_type !=
                        columnType &&
                        filter == "UNAVAILABLE") ||
                      filter == "ALL"
                    )
                      return (
                        <SelectItem
                          className="cursor-pointer"
                          key={index}
                          value={transformPlugin.name}
                        >
                          <div className="flex flex-row items-center justify-between gap-4">
                            <span className="text-base">
                              {transformPlugin.name}
                            </span>
                            {transformPlugin.configurations.column_type ==
                            columnType ? (
                              <AvailableIcon disabled={false} />
                            ) : (
                              <UnavailableIcon disabled={false} />
                            )}
                          </div>
                        </SelectItem>
                      );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* Select Filter */}
            <Select
              onValueChange={(value) =>
                value == "AVAILABLE"
                  ? setFilter("AVAILABLE")
                  : value == "UNAVAILABLE"
                    ? setFilter("UNAVAILABLE")
                    : setFilter("ALL")
              }
            >
              <SelectTrigger className="w-[11rem]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filter</SelectLabel>
                  <SelectItem key={0} value={"ALL"}>
                    <div className="flex flex-row items-center gap-2">ALL</div>
                  </SelectItem>
                  <SelectItem key={1} value={"AVAILABLE"}>
                    <div className="flex flex-row items-center gap-2">
                      Available <AvailableIcon disabled={false} />
                    </div>
                  </SelectItem>
                  <SelectItem key={2} value={"UNAVAILABLE"}>
                    <div className="flex flex-row items-center gap-2">
                      Not Availabe <UnavailableIcon disabled={false} />
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        {selectedTransform != undefined && (
          <div className="flex flex-col">
            <span className="text-base text-mantis-gray-200">
              Plugin Description
            </span>
            <p className="text-sm text-mantis-gray-500">
              {selectedTransform.configurations.description}
            </p>
          </div>
        )}
        {selectedTransform != undefined &&
          selectedTransform?.configurations.column_type != columnType && (
            <p className="text-sm text-red-600">
              The plugin you wish to execute is not applicable to the column as
              it it parses {selectedTransform?.configurations.column_type} and
              not {columnType}{" "}
            </p>
          )}
        <div className="flex flex-row justify-end">
          <Button
            disabled={
              selectedTransform?.configurations.column_type != columnType
            }
            className="w-1/3 bg-mantis-green-300 p-4"
            onClick={() =>
              onConfirm({
                available: true,
                selected: selectedTransform?.name ?? "",
              })
            }
          >
            Confirm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Loader />
    </div>
  );
};

export default TransformPopoverContent;
