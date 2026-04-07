import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { createTask } from "wasp/client/operations";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";

interface CreateTaskFormValues {
  description: string;
}

export function CreateTaskForm() {
  const { handleSubmit, control, reset } = useForm<CreateTaskFormValues>({
    defaultValues: {
      description: "",
    },
  });

  const onSubmit: SubmitHandler<CreateTaskFormValues> = async (data, event) => {
    event?.stopPropagation();

    try {
      await createTask(data);
    } catch (err: unknown) {
      window.alert(`Error while creating task: ${String(err)}`);
    } finally {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6" id="create-task">
      <h2 className="text-xl font-semibold">Create a new task</h2>
      <Controller
        name="description"
        control={control}
        rules={{
          required: { value: true, message: "Description is required" },
        }}
        render={({ field, fieldState }) => (
          <Input
            label="Description"
            placeholder="What do I need to do?"
            fieldState={fieldState}
            {...field}
          />
        )}
      />
      <Button type="submit" className="self-end">
        Create
      </Button>
    </form>
  );
}
