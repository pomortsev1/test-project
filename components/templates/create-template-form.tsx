"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus } from "lucide-react";

import { createTemplate } from "@/app/actions/templates";
import { Button } from "@/components/ui/button";

type CreateTemplateFormProps = {
  disabled?: boolean;
};

export function CreateTemplateForm({
  disabled = false,
}: CreateTemplateFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isDisabled = disabled || isPending;

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);

        startTransition(async () => {
          const result = await createTemplate({ name });

          if (!result.ok) {
            setError(result.error);
            return;
          }

          setName("");
          router.push(`/templates/${result.data.templateId}`);
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <label
          htmlFor="template-create-name"
          className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground"
        >
          New template
        </label>
        <input
          id="template-create-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={isDisabled}
          placeholder="Weekend city break"
          className="h-11 w-full rounded-xl border border-border/80 bg-background/80 px-3 text-sm shadow-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <Button
        type="submit"
        disabled={isDisabled}
        className="h-11 w-full rounded-xl"
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
        Create template
      </Button>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
