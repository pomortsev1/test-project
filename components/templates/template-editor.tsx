"use client";

import {
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  BadgePlus,
  LoaderCircle,
  Save,
  Search,
  Star,
  Trash2,
  WandSparkles,
} from "lucide-react";

import {
  addTemplateItem,
  deleteTemplate,
  removeTemplateItem,
  removeTemplateItems,
  renameTemplate,
  setDefaultTemplate,
  updateTemplateItem,
  type CatalogSuggestion,
  type CategoryOption,
  type TemplateDetails,
  type TemplateItem,
} from "@/app/actions/templates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useOptionalI18n } from "@/components/i18n/i18n-provider";

const NEW_CATEGORY_VALUE = "__new_category__";

type TemplateEditorProps = {
  detail: TemplateDetails;
  categories: CategoryOption[];
  catalogSuggestions: CatalogSuggestion[];
  canMutate: boolean;
  issue?: string;
  supportsOptionalMeasurements: boolean;
};

type ItemRowProps = {
  item: TemplateItem;
  templateId: string;
  categoryNames: string[];
  canMutate: boolean;
  supportsOptionalMeasurements: boolean;
  isSelected: boolean;
  onSelectedChange: (templateItemId: string, checked: boolean) => void;
};

type AddItemComposerProps = {
  templateId: string;
  categories: CategoryOption[];
  catalogSuggestions: CatalogSuggestion[];
  canMutate: boolean;
  supportsOptionalMeasurements: boolean;
};

function normalizeClientText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function groupItemsByCategory(items: TemplateItem[]) {
  const grouped = new Map<string, TemplateItem[]>();

  for (const item of items) {
    const group = grouped.get(item.categoryName) ?? [];
    group.push(item);
    grouped.set(item.categoryName, group);
  }

  return [...grouped.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  );
}

function scopeLabel(scope: CatalogSuggestion["scope"] | CategoryOption["scope"]) {
  return scope === "user" ? "Saved" : "System";
}

function getMeasurementHelperCopy(supportsOptionalMeasurements: boolean) {
  if (supportsOptionalMeasurements) {
    return "Leave both blank for one-off items like Passport or Wallet.";
  }

  return "Measurements are still required in this workspace, so use simple values like 1 item or 1 document for single essentials.";
}

function parseQuantityInput(value: string) {
  const cleaned = value.trim();

  if (!cleaned) {
    return null;
  }

  return Number(cleaned);
}

function parseUnitInput(value: string) {
  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : null;
}

function resolveMeasurementInput(
  quantity: string,
  unit: string,
  fallbackUnit?: string,
) {
  const parsedQuantity = parseQuantityInput(quantity);
  const parsedUnit = parseUnitInput(unit);
  const defaultUnit = parseUnitInput(fallbackUnit ?? "");

  return {
    quantity: parsedQuantity,
    unit: parsedQuantity !== null ? parsedUnit ?? defaultUnit : parsedUnit,
  };
}

function EditableTemplateItemRow({
  item,
  templateId,
  categoryNames,
  canMutate,
  supportsOptionalMeasurements,
  isSelected,
  onSelectedChange,
}: ItemRowProps) {
  const router = useRouter();
  const categoryListId = useId();
  const [draft, setDraft] = useState({
    itemName: item.itemName,
    categoryName: item.categoryName,
    quantity: item.quantity === null ? "" : String(item.quantity),
    unit: item.unit ?? "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isDisabled = !canMutate || isPending;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm",
        isSelected && "border-foreground/25 bg-foreground/[0.03] ring-1 ring-foreground/10",
      )}
    >
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-[72px_minmax(0,1fr)]">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Select
            </label>
            <label className="flex h-10 items-center">
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={(event) =>
                  onSelectedChange(item.id, event.target.checked)
                }
                aria-label={`Select ${item.itemName}`}
                className="size-4 rounded border-border"
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Item
            </label>
            <input
              value={draft.itemName}
              disabled={isDisabled}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  itemName: event.target.value,
                }))
              }
              className="h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_120px_120px_auto]">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Category
            </label>
            <input
              list={categoryListId}
              value={draft.categoryName}
              disabled={isDisabled}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  categoryName: event.target.value,
                }))
              }
              className="h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <datalist id={categoryListId}>
              {categoryNames.map((categoryName) => (
                <option key={categoryName} value={categoryName} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Quantity
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={draft.quantity}
              disabled={isDisabled}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  quantity: event.target.value,
                }))
              }
              className="h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Unit
            </label>
            <input
              value={draft.unit}
              disabled={isDisabled}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  unit: event.target.value,
                }))
              }
              className="h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="flex items-end gap-2">
          <Button
            type="button"
            size="sm"
            disabled={isDisabled}
            onClick={() => {
              setError(null);
              setMessage(null);

              startTransition(async () => {
                const measurement = resolveMeasurementInput(
                  draft.quantity,
                  draft.unit,
                );
                const result = await updateTemplateItem({
                  templateId,
                  templateItemId: item.id,
                  itemName: draft.itemName,
                  categoryName: draft.categoryName,
                  quantity: measurement.quantity,
                  unit: measurement.unit,
                });

                if (!result.ok) {
                  setError(result.error);
                  return;
                }

                setMessage("Saved");
                router.refresh();
              });
            }}
          >
            {isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save
          </Button>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={isDisabled}
            onClick={() => {
              if (!window.confirm(`Remove ${item.itemName} from this template?`)) {
                return;
              }

              setError(null);
              setMessage(null);

              startTransition(async () => {
                const result = await removeTemplateItem({
                  templateId,
                  templateItemId: item.id,
                });

                if (!result.ok) {
                  setError(result.error);
                  return;
                }

                router.refresh();
              });
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      </div>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      {!error && message ? (
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      ) : null}
      {!error && !message && !supportsOptionalMeasurements ? (
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          {getMeasurementHelperCopy(false)}
        </p>
      ) : null}
    </div>
  );
}

function AddTemplateItemComposer({
  templateId,
  categories,
  catalogSuggestions,
  canMutate,
  supportsOptionalMeasurements,
}: AddItemComposerProps) {
  const router = useRouter();
  const composerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<CatalogSuggestion | null>(null);
  const [quantity, setQuantity] = useState(
    supportsOptionalMeasurements ? "" : "1",
  );
  const [unit, setUnit] = useState("");
  const [rawSelectedCategoryValue, setRawSelectedCategoryValue] = useState(
    categories[0]?.id ?? NEW_CATEGORY_VALUE,
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [saveToCatalog, setSaveToCatalog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const deferredSearchQuery = useDeferredValue(query);
  const selectedCategoryValue =
    categories.length === 0
      ? NEW_CATEGORY_VALUE
      : rawSelectedCategoryValue === NEW_CATEGORY_VALUE ||
          categories.some((category) => category.id === rawSelectedCategoryValue)
        ? rawSelectedCategoryValue
        : categories[0].id;

  const normalizedQuery = normalizeClientText(deferredSearchQuery);
  const suggestions =
    normalizedQuery.length === 0
      ? []
      : catalogSuggestions
          .filter((suggestion) => {
            return (
              suggestion.normalizedName.includes(normalizedQuery) ||
              normalizeClientText(suggestion.categoryName).includes(normalizedQuery)
            );
          })
          .slice(0, 8);

  const isDisabled = !canMutate || isPending;

  const suggestionCategories =
    selectedSuggestion !== null
      ? `${selectedSuggestion.categoryName} · ${scopeLabel(selectedSuggestion.scope)}`
      : null;
  const isSuggestionsOpen =
    query.trim().length > 0 && selectedSuggestion === null;

  useEffect(() => {
    if (!isSuggestionsOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (!composerRef.current?.contains(target)) {
        setQuery("");
        setError(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isSuggestionsOpen]);

  return (
    <Card className="border border-border/70 bg-card/92 shadow-sm">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <WandSparkles className="size-3.5" />
            Add item
          </Badge>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-lg">Add another item</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Search the catalog or type your own item for this template.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_120px_150px]">
          <div ref={composerRef} className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Item name
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                disabled={isDisabled}
                onChange={(event) => {
                  const value = event.target.value;
                  setQuery(value);
                  setError(null);

                  if (
                    selectedSuggestion &&
                    normalizeClientText(value) !== selectedSuggestion.normalizedName
                  ) {
                    setSelectedSuggestion(null);
                  }
                }}
                placeholder="Passport, charger, hiking socks..."
                className="h-11 w-full rounded-xl border border-border/80 bg-background pl-10 pr-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {isSuggestionsOpen && (
              <div className="rounded-2xl border border-border/70 bg-background/90 p-2 shadow-sm">
                {suggestions.length > 0 ? (
                  <div className="space-y-1">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setSelectedSuggestion(suggestion);
                          setQuery(suggestion.name);
                          setUnit((current) => current || suggestion.defaultUnit);
                          setRawSelectedCategoryValue(suggestion.categoryId);
                          setNewCategoryName("");
                          setSaveToCatalog(false);
                          setError(null);
                        }}
                        className={cn(
                          "flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-muted disabled:cursor-not-allowed",
                        )}
                      >
                        <div>
                          <p className="font-medium">{suggestion.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {suggestion.categoryName}
                            {suggestion.defaultUnit
                              ? ` · default ${suggestion.defaultUnit}`
                              : ""}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {scopeLabel(suggestion.scope)}
                        </Badge>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-2 py-2 text-sm text-muted-foreground">
                    No suggestion matched. You can still add this as a custom
                    item below.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Quantity {supportsOptionalMeasurements ? "(optional)" : ""}
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={quantity}
              disabled={isDisabled}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder={supportsOptionalMeasurements ? "1" : undefined}
              className="h-11 w-full rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Unit {supportsOptionalMeasurements ? "(optional)" : ""}
            </label>
            <input
              value={unit}
              disabled={isDisabled}
              onChange={(event) => setUnit(event.target.value)}
              placeholder={supportsOptionalMeasurements ? "pairs" : "pairs"}
              className="h-11 w-full rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          {getMeasurementHelperCopy(supportsOptionalMeasurements)}
        </p>

        {selectedSuggestion ? (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
            <Badge variant="secondary">{suggestionCategories}</Badge>
            <span>Edit the name if you want to break away from this match.</span>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Category
              </label>
              <select
                value={selectedCategoryValue}
                disabled={isDisabled}
                onChange={(event) =>
                  setRawSelectedCategoryValue(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <optgroup label="System categories">
                  {categories
                    .filter((category) => category.scope === "system")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Your categories">
                  {categories
                    .filter((category) => category.scope === "user")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </optgroup>
                <option value={NEW_CATEGORY_VALUE}>Create a new category</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                New category name
              </label>
              <input
                value={newCategoryName}
                disabled={isDisabled || selectedCategoryValue !== NEW_CATEGORY_VALUE}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="Beach gear"
                className="h-11 w-full rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/35 px-4 py-3 text-sm leading-6 text-muted-foreground lg:col-span-2">
              <input
                type="checkbox"
                checked={saveToCatalog}
                disabled={isDisabled}
                onChange={(event) => setSaveToCatalog(event.target.checked)}
                className="mt-1 size-4 rounded border-border"
              />
              Save this custom item to your catalog so it appears in future
              suggestions.
            </label>
          </div>
        )}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex items-center justify-end">
          <Button
            type="button"
            disabled={isDisabled}
            className="h-11 rounded-xl"
            onClick={() => {
              setError(null);

              startTransition(async () => {
                const measurement = resolveMeasurementInput(
                  quantity,
                  unit,
                  selectedSuggestion?.defaultUnit,
                );
                const result = await addTemplateItem({
                  templateId,
                  itemName: query,
                  quantity: measurement.quantity,
                  unit: measurement.unit,
                  catalogItemId: selectedSuggestion?.id,
                  categoryId:
                    selectedSuggestion?.categoryId ??
                    (selectedCategoryValue !== NEW_CATEGORY_VALUE
                      ? selectedCategoryValue
                      : undefined),
                  categoryName:
                    selectedSuggestion?.categoryName ??
                    (selectedCategoryValue === NEW_CATEGORY_VALUE
                      ? newCategoryName
                      : undefined),
                  saveToCatalog: !selectedSuggestion && saveToCatalog,
                });

                if (!result.ok) {
                  setError(result.error);
                  return;
                }

                setQuery("");
                setSelectedSuggestion(null);
                setQuantity(supportsOptionalMeasurements ? "" : "1");
                setUnit("");
                setNewCategoryName("");
                setSaveToCatalog(false);
                setRawSelectedCategoryValue(
                  categories[0]?.id ?? NEW_CATEGORY_VALUE,
                );
                router.refresh();
              });
            }}
          >
            {isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <BadgePlus className="size-4" />
            )}
            Add to template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function TemplateEditor({
  detail,
  categories,
  catalogSuggestions,
  canMutate,
  issue,
  supportsOptionalMeasurements,
}: TemplateEditorProps) {
  const router = useRouter();
  const i18n = useOptionalI18n();
  const [name, setName] = useState(detail.template.name);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const groupedItems = groupItemsByCategory(detail.items);
  const categoryNames = categories.map((category) => category.name);
  const isDisabled = !canMutate || isPending;
  const totalItemCount = detail.items.length;
  const selectedItemCount = selectedItemIds.length;
  const allItemsSelected = totalItemCount > 0 && selectedItemCount === totalItemCount;
  const templateIntro = detail.template.isDefault
    ? "Edit this list first. Most trips should start here."
    : "Use this only when a trip needs a clearly different packing list.";
  const emptyStateTitle = detail.template.isDefault
    ? "Add the essentials you never want to forget."
    : "Add the items that make this template different.";
  const emptyStateBody = detail.template.isDefault
    ? "Build one trusted list here, then create an extra template only when you need it."
    : "Keep this focused so it stays meaningfully different from your default list.";

  function handleSelectedItemChange(templateItemId: string, checked: boolean) {
    setSelectedItemIds((current) => {
      if (checked) {
        return current.includes(templateItemId)
          ? current
          : [...current, templateItemId];
      }

      return current.filter((itemId) => itemId !== templateItemId);
    });
  }

  return (
    <div className="space-y-6">
      {issue ? (
        <div className="rounded-2xl border border-amber-300/60 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-900">
          {issue}
        </div>
      ) : null}

      <Card className="border border-border/70 bg-card/95 shadow-sm">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {detail.template.isDefault ? "Basic mode" : "Advanced template"}
            </Badge>
            {detail.template.isDefault ? (
              <Badge variant="secondary">Default template</Badge>
            ) : null}
            <Badge variant="secondary">
              {detail.template.itemCount}{" "}
              {detail.template.itemCount === 1 ? "item" : "items"}
            </Badge>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl">
              {detail.template.isDefault ? "Main packing list" : "Extra template"}
            </CardTitle>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              {templateIntro}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Template name
              </label>
              <input
                value={name}
                disabled={isDisabled}
                onChange={(event) => setName(event.target.value)}
                className="h-12 w-full rounded-2xl border border-border/80 bg-background px-4 text-base outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <Button
                type="button"
                disabled={isDisabled}
                className="h-11 rounded-xl"
                onClick={() => {
                  setError(null);
                  setNotice(null);

                  startTransition(async () => {
                    const result = await renameTemplate({
                      templateId: detail.template.id,
                      name,
                    });

                    if (!result.ok) {
                      setError(result.error);
                      return;
                    }

                    setNotice("Template name saved.");
                    router.refresh();
                  });
                }}
              >
                {isPending ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save name
              </Button>

              {!detail.template.isDefault ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDisabled}
                  className="h-11 rounded-xl"
                  onClick={() => {
                    setError(null);
                    setNotice(null);

                    startTransition(async () => {
                      const result = await setDefaultTemplate({
                        templateId: detail.template.id,
                      });

                      if (!result.ok) {
                        setError(result.error);
                        return;
                      }

                      setNotice("This template is now the default.");
                      router.refresh();
                    });
                  }}
                >
                  <Star className="size-4" />
                  Set default
                </Button>
              ) : null}

              <Button
                type="button"
                variant="destructive"
                disabled={isDisabled}
                className="h-11 rounded-xl"
                onClick={() => {
                  if (
                    !window.confirm(
                      `Delete the template "${detail.template.name}"?`,
                    )
                  ) {
                    return;
                  }

                  setError(null);
                  setNotice(null);

                  startTransition(async () => {
                    const result = await deleteTemplate({
                      templateId: detail.template.id,
                    });

                    if (!result.ok) {
                      setError(result.error);
                      return;
                    }

                    router.push(
                      i18n?.localizePath(
                        result.data.nextTemplateId
                          ? `/templates/${result.data.nextTemplateId}`
                          : "/templates",
                      ) ??
                        (result.data.nextTemplateId
                          ? `/templates/${result.data.nextTemplateId}`
                          : "/templates"),
                    );
                    router.refresh();
                  });
                }}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        {(error || notice) && (
          <CardContent className="pt-0">
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {!error && notice ? (
              <p className="text-sm text-muted-foreground">{notice}</p>
            ) : null}
          </CardContent>
        )}
      </Card>

      <AddTemplateItemComposer
        templateId={detail.template.id}
        categories={categories}
        catalogSuggestions={catalogSuggestions}
        canMutate={canMutate}
        supportsOptionalMeasurements={supportsOptionalMeasurements}
      />

      <div className="space-y-4">
        {groupedItems.length > 0 ? (
          <Card className="border border-border/70 bg-card/92 shadow-sm">
            <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {selectedItemCount > 0
                    ? `${selectedItemCount} item${selectedItemCount === 1 ? "" : "s"} selected`
                    : "Select items to delete them together"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Use the checkboxes in the list to build a batch.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDisabled || totalItemCount === 0}
                  className="rounded-xl"
                  onClick={() =>
                    setSelectedItemIds(
                      allItemsSelected ? [] : detail.items.map((item) => item.id),
                    )
                  }
                >
                  {allItemsSelected ? "Clear selection" : "Select all"}
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  disabled={isDisabled || selectedItemCount === 0}
                  className="rounded-xl"
                  onClick={() => {
                    if (
                      !window.confirm(
                        `Remove ${selectedItemCount} selected item${selectedItemCount === 1 ? "" : "s"} from this template?`,
                      )
                    ) {
                      return;
                    }

                    setError(null);
                    setNotice(null);

                    startTransition(async () => {
                      const result = await removeTemplateItems({
                        templateId: detail.template.id,
                        templateItemIds: selectedItemIds,
                      });

                      if (!result.ok) {
                        setError(result.error);
                        return;
                      }

                      setSelectedItemIds([]);
                      setNotice(
                        `Removed ${result.data.templateItemIds.length} item${result.data.templateItemIds.length === 1 ? "" : "s"}.`,
                      );
                      router.refresh();
                    });
                  }}
                >
                  {isPending ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Delete selected
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {groupedItems.length === 0 ? (
          <Card className="border border-dashed border-border/80 bg-card/70 shadow-sm">
            <CardContent className="py-10 text-center">
              <p className="text-lg font-medium">{emptyStateTitle}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {emptyStateBody}
              </p>
            </CardContent>
          </Card>
        ) : (
          groupedItems.map(([categoryName, items]) => (
            <Card
              key={categoryName}
              className="border border-border/70 bg-card/90 shadow-sm"
            >
              <CardHeader className="gap-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg">{categoryName}</CardTitle>
                  <Badge variant="secondary">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item) => (
                  <EditableTemplateItemRow
                    key={`${item.id}:${item.itemName}:${item.categoryName}:${item.quantity}:${item.unit}`}
                    item={item}
                    templateId={detail.template.id}
                    categoryNames={categoryNames}
                    canMutate={canMutate}
                    supportsOptionalMeasurements={supportsOptionalMeasurements}
                    isSelected={selectedItemIds.includes(item.id)}
                    onSelectedChange={handleSelectedItemChange}
                  />
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
