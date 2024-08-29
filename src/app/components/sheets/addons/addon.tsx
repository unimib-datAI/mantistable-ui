import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { Button } from "~/app/components/ui/button";
import Loader from "~/app/components/ui/loader";
import { cn } from "~/lib/utils";
import { env } from "~/env";

export type AddonProps = React.HTMLAttributes<HTMLDivElement> & {
  table_id: number;
  addon: string;
};

const Addon = (addonProps: AddonProps) => {
  const { table_id, addon, className, ...props } = addonProps;

  const [output, setOutput] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [refetchOutput, setRefetchOutput] = useState<boolean>(false);
  let input_v2 = useRef<Object>();

  // Get input html
  const { isError, status, isFetching } = useQuery({
    queryKey: ["input"],
    queryFn: async () => {
      const response = await fetch(
        `${env.NEXT_PUBLIC_PLUGINS_HOST}/addon/mantistablex/input`,
        {
          method: "GET",
        },
      );
      const htmlInput = await response.text();
      setInput(htmlInput);
      return Promise.resolve("ok");
    },
  });

  // get output html
  const { isFetching: outputFetching } = useQuery({
    queryKey: ["output", input_v2.current],
    queryFn: async () => {
      const response = await fetch(
        `${env.NEXT_PUBLIC_PLUGINS_HOST}/apply_addon`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table_id: table_id,
            addon: addon,
            addon_data: input_v2.current,
          }),
        },
      );
      const htmlOutput = await response.text();
      setOutput(htmlOutput);
      setRefetchOutput(false);
      return Promise.resolve("ok");
    },
    enabled: refetchOutput,
  });

  function onSubmit() {
    const form = document.getElementById("my-form") as
      | HTMLFormElement
      | undefined;
    if (!form) return;
    const formData = new FormData(form);
    input_v2.current = Object.fromEntries(formData);
    setRefetchOutput(true);
  }

  return (
    <div className={cn("flex w-full flex-col gap-8", className)} {...props}>
      <form action={onSubmit} id="my-form" className="flex flex-col gap-4">
        {/*HTML injection*/}
        {isFetching && <Loader />}
        <div dangerouslySetInnerHTML={{ __html: input }}></div>
        {/*HTML injection*/}
        <Button className="bg-mantis-green-300" type="submit">
          Apply Addon
        </Button>
      </form>
      {outputFetching && <Loader />}
      <div dangerouslySetInnerHTML={{ __html: output }}></div>
    </div>
  );
};

export default Addon;
