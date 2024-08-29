"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTracer from "~/app/components/formTracer/formTracer";
import { FormTracerProps } from "~/app/components/formTracer/formTracer";
import { LuUpload } from "react-icons/lu";
import { FaTable } from "react-icons/fa";
import { useState } from "react";
import { Textarea } from "~/app/components/ui/textarea";
import { Input } from "~/app/components/ui/input";
import { InsertTableSchema } from "~/server/db/schema";
import Loader from "~/app/components/ui/loader";
import { Button } from "~/app/components/ui/button";
import { UploadSchema, UploadSchemaForm } from "~/utils/types/upload";
import { parseCSVTable, processableJSONTable } from "~/utils/functions";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "~/app/components/ui/form";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/app/components/ui/carousel";
import { Error } from "~/app/components/error/error";

const data: FormTracerProps = {
  blocks: [
    {
      icon: FaTable,
      title: "Table name and description",
      description: "Choose a name for your table and describe its content",
      selected: false,
    },
    {
      icon: LuUpload,
      title: "Upload File",
      description: "Find the correct file extension and upload",
      selected: false,
    },
  ],
  currentActive: 0,
};

export default function Upload() {
  const router = useRouter();
  const sendTable = api.tables.create.useMutation();
  const [page, setPage] = useState<number>(0);
  const form = useForm<UploadSchemaForm>({
    resolver: zodResolver(UploadSchema),
  });

  const onSubmit = async (data: UploadSchemaForm) => {
    const file = data.file;
    const result = await file.text();
    const convertedTable = await parseCSVTable(result);
    const processableTable = await processableJSONTable(result);
    const insertTable: InsertTableSchema = {
      tableName: data.tableName,
      tableDescription: data.tableDescription,
      insertDate: new Date().toDateString(),
      lastEdit: new Date().toDateString(),
      csvTable: result,
      jsonTable: convertedTable,
      processableJsonTable: processableTable,
      processableJsonResponseTable: processableTable,
      status: "TODO",
      exportStatus: "TODO",
    };
    await sendTable.mutate(insertTable);
  };

  if (sendTable.isSuccess) {
    router.push("/mantis/home");
  }

  if (sendTable.isError) {
    return (
      <Error
        errorTitle="An error occurred"
        errorDescription="Error on loading table, please check your connection and refresh the page!"
      />
    );
  }

  return (
    <div className="flex h-full flex-row bg-mantis-white-300">
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="flex flex-col gap-16">
          <h1 className="text-5xl font-bold text-mantis-green-700">
            Upload Table
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Table Name*/}
              <Carousel opts={{ align: "start" }} orientation="vertical">
                <CarouselContent className="h-[300px]">
                  <CarouselItem>
                    <div className="flex flex-col gap-2 p-1">
                      <FormField
                        control={form.control}
                        name="tableName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-mantis-green-600">
                              Table Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Table Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                      {/* Table Description*/}
                      <FormField
                        control={form.control}
                        name="tableDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-mantis-green-600">
                              Table Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Table Description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    {/* Table Upload*/}
                    <div className="flex max-w-[400px] flex-col gap-4 p-1">
                      <p>
                        At the moment, MantisTable only supports tables in{" "}
                        <b>.csv </b>format. If your data is in a different
                        format, you have to convert it first.
                      </p>
                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-mantis-green-600">
                              Upload
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="file:rounded-sm file:bg-mantis-green-200 file:text-base file:font-normal"
                                type="file"
                                placeholder="Choose File"
                                onChange={(e) => {
                                  field.onChange(
                                    e.target?.files?.[0] ?? undefined,
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                {page == 1 && <CarouselPrevious setPage={setPage} />}
                {page == 0 && <CarouselNext setPage={setPage} />}
              </Carousel>
              {page == 1 &&
                (!sendTable.isPending ? (
                  <Button
                    className="w-full cursor-pointer items-center justify-center rounded-sm bg-mantis-green-300 px-4 py-2"
                    type="submit"
                  >
                    Upload
                  </Button>
                ) : (
                  <Loader className="w-full bg-mantis-green-300" />
                ))}
            </form>
          </Form>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-mantis-green-200">
        <FormTracer blocks={data.blocks} currentActive={page} />
      </div>
    </div>
  );
}
