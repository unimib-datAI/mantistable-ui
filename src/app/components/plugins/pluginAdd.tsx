"use client";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/app/components/ui/alert-dialog";
import { Input } from "~/app/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "~/app/components/ui/form";
import { UploadPlugin, UploadPluginForm } from "~/utils/types/plugin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/trpc/react";

export type PluginAddProps = React.HTMLAttributes<HTMLDivElement> & {};

export const PluginAdd = (pluginAdd: PluginAddProps) => {
  const utils = api.useUtils();
  const uploadPlugin = useMutation({
    mutationFn: (plugin: File) => {
      const formData = new FormData();
      formData.append("file", plugin);
      return fetch(`${process.env.NEXT_PUBLIC_PLUGINS_HOST}/load_plugin`, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      utils.plugins.getPlugins.invalidate();
    },
    onError: () => {
      console.log("ERROR");
    },
  });

  const form = useForm<UploadPluginForm>({
    resolver: zodResolver(UploadPlugin),
  });

  const { className, ...props } = pluginAdd;

  const onSubmit = async (data: UploadPluginForm) => {
    const file = data.file;
    await uploadPlugin.mutate(file);
  };
  return (
    <div className={cn(className)} {...props}>
      <AlertDialogContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Add your plugin!</AlertDialogTitle>
              <AlertDialogDescription>
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-mantis-green-600">
                        Upload zip file
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="file:rounded-sm file:bg-mantis-green-200 file:text-base file:font-normal"
                          type="file"
                          placeholder="Choose File"
                          onChange={(e) => {
                            field.onChange(e.target?.files?.[0] ?? undefined);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit">Upload</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </div>
  );
};
