import { Error } from "~/app/components/error/error";
import { Button } from "~/app/components/ui/button";
import Loader from "~/app/components/ui/loader";
import { api } from "~/trpc/react";
import TableComparison from "./tableComparison";
import { Dispatch, SetStateAction } from "react";

export type TransformPopoverPreviewProps =
  React.HTMLAttributes<HTMLDivElement> & {
    backAction: Dispatch<
      SetStateAction<{ available: boolean; selected: string }>
    >;
    tableID: number;
    tableColumnID: number;
    transform: string;
  };

const TransformPopoverPreview = (
  transformerPopoverContentProps: TransformPopoverPreviewProps,
) => {
  const { backAction, transform, tableID, tableColumnID, className, ...props } =
    transformerPopoverContentProps;
  const utils = api.useUtils();
  const getTransformResult = api.plugins.runTransform.useQuery({
    transformPlugin: transform,
    tableId: tableID,
    columnID: tableColumnID,
  });
  const transformAddColumn = api.tables.transformAddColumn.useMutation({
    onSuccess() {
      utils.tables.getTable.invalidate();
    },
  });
  const transformReplaceColumn = api.tables.transformReplaceColumn.useMutation({
    onSuccess() {
      utils.tables.getTable.invalidate();
    },
  });

  if (getTransformResult.isError) {
    return (
      <div className="flex items-center justify-center">
        <Error
          errorTitle="Transforms Error"
          errorDescription="Error on loading Transforms, please check connectivity"
        />
      </div>
    );
  }

  if (getTransformResult.isSuccess) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          {/* Title */}
          <p className="text-base font-bold text-mantis-green-400">Preview</p>
          {/* Description */}
          <p className="text-sm">Transformer plugin description</p>
        </div>
        {/* Columns comparison */}
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-col">
            <p className="text-sm text-mantis-red-200">before</p>
            <TableComparison
              column={getTransformResult.data.original_column.slice(0, 5)}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-mantis-green-400">after</p>
            <TableComparison
              column={getTransformResult.data.new_column.slice(0, 5)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() =>
              transformAddColumn.mutate({
                transform: transform,
                tableID: tableID,
                columnID: tableColumnID,
                newColumn: getTransformResult.data.new_column,
              })
            }
            className="bg-mantis-green-300 text-mantis-black-200 focus:text-white"
          >
            Add new column
          </Button>
          <Button
            onClick={() =>
              transformReplaceColumn.mutate({
                transform: transform,
                tableID: tableID,
                columnID: tableColumnID,
                newColumn: getTransformResult.data.new_column,
              })
            }
            className="border border-mantis-green-300 bg-white text-mantis-green-300 outline-none"
          >
            Overwrite old column
          </Button>
          <Button
            onClick={() =>
              backAction((prevState) => ({ ...prevState, available: false }))
            }
            className="bg-mantis-white-300 text-mantis-black-200"
          >
            Back
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

export default TransformPopoverPreview;
