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
  getCatalogSuggestions,
  removeTemplateItem,
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

const NEW_CATEGORY_VALUE = "__new_category__";

type TemplateEditorProps = {
  detail: TemplateDetails;
  categories: CategoryOption[];
  canMutate: boolean;
  issue?: string;
};

type ItemRowProps = {
  item: TemplateItem;
  templateId: string;
  categoryNames: string[];
  canMutate: boolean;
};

type AddItemComposerProps = {
  templateId: string;
  categories: CategoryOption[];
  canMutate: boolean;
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

function EditableTemplateItemRow({
  item,
  templateId,
  categoryNames,
  canMutate,
}: ItemRowProps) {
  const router = useRouter();
  const categoryListId = useId();
  const [draft, setDraft] = useState({
    itemName: item.itemName,
    categoryName: item.categoryName,
    quantity: String(item.quantity),
    unit: item.unit,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isDisabled = !canMutate || isPending;

  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_120px_120px_auto]">
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
                const result = await updateTemplateItem({
                  templateId,
                  templateItemId: item.id,
                  itemName: draft.itemName,
                  categoryName: draft.categoryName,
                  quantity: Number(draft.quantity),
                  unit: draft.unit,
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

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      {!error && message ? (
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}

function AddTemplateItemComposer({
  templateId,
  categories,
  canMutate,
}: AddItemComposerProps) {
  const router = useRouter();
  const requestIdRef = useRef(0);
  const [query, setQuery] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<CatalogSuggestion | null>(null);
  const [suggestions, setSuggestions] = useState<CatalogSuggestion[]>([]);
  const [quantity, setQuantity] = useState("1");
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

  useEffect(() => {
    let isCurrent = true;
    const nextRequestId = requestIdRef.current + 1;
    requestIdRef.current = nextRequestId;

    const timeout = window.setTimeout(async () => {
      const nextSuggestions = await getCatalogSuggestions(deferredSearchQuery);

      if (!isCurrent || requestIdRef.current !== nextRequestId) {
        return;
      }

      setSuggestions(nextSuggestions);
    }, 180);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeout);
    };
  }, [deferredSearchQuery]);

  const isDisabled = !canMutate || isPending;

  const suggestionCategories =
    selectedSuggestion !== null
      ? `${selectedSuggestion.categoryName} · ${scopeLabel(selectedSuggestion.scope)}`
      : null;

  return (
    <Card className="border border-border/70 bg-card/92 shadow-sm">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <WandSparkles className="size-3.5" />
            Add item
          </Badge>
          <Badge variant="secondary">
            {selectedSuggestion ? "Using suggestion" : "Custom or suggested"}
          </Badge>
        </div>
        <CardTitle className="text-lg">
          Autocomplete from system and saved catalog items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_120px_150px]">
          <div className="space-y-2">
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

            {query.trim().length > 0 && (
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
                          selectedSuggestion?.id === suggestion.id &&
                            "bg-muted ring-1 ring-foreground/10",
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
              Quantity
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={quantity}
              disabled={isDisabled}
              onChange={(event) => setQuantity(event.target.value)}
              className="h-11 w-full rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Unit
            </label>
            <input
              value={unit}
              disabled={isDisabled}
              onChange={(event) => setUnit(event.target.value)}
              placeholder="pairs"
              className="h-11 w-full rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        {selectedSuggestion ? (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
            <Badge variant="secondary">{suggestionCategories}</Badge>
            <span>
              Clear the match by editing the name if you want to add a truly
              custom item.
            </span>
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
              Save this custom item into the user catalog so it appears in
              autocomplete next time.
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
                const result = await addTemplateItem({
                  templateId,
                  itemName: query,
                  quantity: Number(quantity),
                  unit:
                    unit.trim() || selectedSuggestion?.defaultUnit || unit.trim(),
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
                setSuggestions([]);
                setQuantity("1");
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
  canMutate,
  issue,
}: TemplateEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(detail.template.name);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const groupedItems = groupItemsByCategory(detail.items);
  const categoryNames = categories.map((category) => category.name);
  const isDisabled = !canMutate || isPending;

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
            <Badge variant="outline">Template editor</Badge>
            {detail.template.isDefault ? (
              <Badge variant="secondary">Default template</Badge>
            ) : null}
            <Badge variant="secondary">
              {detail.template.itemCount}{" "}
              {detail.template.itemCount === 1 ? "item" : "items"}
            </Badge>
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
                      result.data.nextTemplateId
                        ? `/templates/${result.data.nextTemplateId}`
                        : "/templates",
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
        canMutate={canMutate}
      />

      <div className="space-y-4">
        {groupedItems.length === 0 ? (
          <Card className="border border-dashed border-border/80 bg-card/70 shadow-sm">
            <CardContent className="py-10 text-center">
              <p className="text-lg font-medium">This template is still empty.</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Add a saved suggestion or a brand-new custom item above to start
                shaping this packing setup.
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
