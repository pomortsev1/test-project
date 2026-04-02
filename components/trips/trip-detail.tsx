"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Home,
  Luggage,
  Route,
  SkipForward,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  arriveAtCurrentStop,
  goHomeNow,
  startTrip,
  toggleTripLegItemCheck,
} from "@/app/actions/trips";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatChecklistProgress,
  formatLegStatus,
  formatTripItemMeasurement,
  formatTripDate,
  formatTripMode,
  formatTripStatus,
  getLegStatusBadgeVariant,
  getTripStatusBadgeVariant,
} from "@/components/trips/format";
import type { TripDetails } from "@/components/trips/types";

type TripDetailProps = {
  trip: TripDetails;
};

export function TripDetail({ trip }: TripDetailProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isRouteActionPending, startRouteActionTransition] = useTransition();
  const [, startChecklistTransition] = useTransition();
  const [pendingChecklistItemIds, setPendingChecklistItemIds] = useState<
    Record<string, true>
  >({});
  const [optimisticPackedByItemId, setOptimisticPackedByItemId] = useState<
    Record<string, boolean>
  >({});
  const pendingChecklistItemIdsRef = useRef<Record<string, true>>({});
  const checklistIsInteractive =
    trip.status === "active" &&
    trip.activeLeg !== null &&
    trip.checklistLegId === trip.activeLeg.id &&
    trip.checklistLegStatus === "active";

  useEffect(() => {
    pendingChecklistItemIdsRef.current = {};
    setPendingChecklistItemIds({});
    setOptimisticPackedByItemId({});
  }, [trip.id, trip.checklistLegId]);

  const checklistGroups = useMemo(
    () =>
      trip.checklistGroups.map((group) => ({
        ...group,
        items: group.items.map((item) => ({
          ...item,
          isPacked:
            optimisticPackedByItemId[item.tripItemId] ?? item.isPacked,
        })),
      })),
    [optimisticPackedByItemId, trip.checklistGroups],
  );

  const checklistPackedCount = useMemo(
    () =>
      checklistGroups.reduce(
        (packedCount, group) =>
          packedCount +
          group.items.reduce(
            (groupPackedCount, item) =>
              groupPackedCount + (item.isPacked ? 1 : 0),
            0,
          ),
        0,
      ),
    [checklistGroups],
  );

  const legs = useMemo(
    () =>
      trip.legs.map((leg) =>
        leg.id === trip.checklistLegId
          ? {
              ...leg,
              packedCount: checklistPackedCount,
            }
          : leg,
      ),
    [checklistPackedCount, trip.checklistLegId, trip.legs],
  );

  const checklistSummary = trip.checklistRouteLabel
    ? `${trip.checklistRouteLabel} • ${formatChecklistProgress(
        checklistPackedCount,
        trip.checklistTotalCount,
      )}`
    : "No checklist yet.";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to trips
        </Link>
        <div className="flex flex-wrap gap-2">
          <Badge variant={getTripStatusBadgeVariant(trip.status)}>
            {formatTripStatus(trip.status)}
          </Badge>
          <Badge variant="outline">{formatTripMode(trip.mode)}</Badge>
          <Badge variant="outline">{formatTripDate(trip.createdAt)}</Badge>
        </div>
      </div>

        <Card className="border border-border/70 bg-card/95 shadow-sm">
          <CardHeader className="gap-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <CardTitle className="text-3xl font-semibold tracking-tight">
                  {trip.name}
                </CardTitle>
                <CardDescription className="max-w-3xl text-base leading-7">
                  {trip.stops.map((stop) => stop.name).join(" -> ")}
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                {trip.canStart ? (
                  <Button
                    type="button"
                    disabled={isRouteActionPending}
                    onClick={() => {
                      setError(null);
                      startRouteActionTransition(async () => {
                        try {
                          await startTrip({ tripId: trip.id });
                          router.refresh();
                        } catch (actionError) {
                          setError(
                            actionError instanceof Error
                              ? actionError.message
                              : "Unable to start the trip.",
                          );
                        }
                      });
                    }}
                  >
                    Start trip
                  </Button>
                ) : null}

                {trip.canArrive ? (
                  <Button
                    type="button"
                    disabled={isRouteActionPending}
                    onClick={() => {
                      setError(null);
                      startRouteActionTransition(async () => {
                        try {
                          await arriveAtCurrentStop({ tripId: trip.id });
                          router.refresh();
                        } catch (actionError) {
                          setError(
                            actionError instanceof Error
                              ? actionError.message
                              : "Unable to complete the leg.",
                          );
                        }
                      });
                    }}
                  >
                    Arrived
                  </Button>
                ) : null}

                {trip.canGoHomeNow ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isRouteActionPending}
                    onClick={() => {
                      setError(null);
                      startRouteActionTransition(async () => {
                        try {
                          await goHomeNow({ tripId: trip.id });
                          router.refresh();
                        } catch (actionError) {
                          setError(
                            actionError instanceof Error
                              ? actionError.message
                              : "Unable to reroute home right now.",
                          );
                        }
                      });
                    }}
                  >
                    Go home now
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Template
                </p>
                <p className="mt-2 font-medium">
                  {trip.templateName ?? "Snapshot only"}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Current leg
                </p>
                <p className="mt-2 font-medium">
                  {trip.activeLeg
                    ? `${trip.activeLeg.fromStopName} -> ${trip.activeLeg.toStopName}`
                    : "Not started yet"}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Checklist
                </p>
                <p className="mt-2 font-medium">
                  {formatChecklistProgress(
                    checklistPackedCount,
                    trip.checklistTotalCount,
                  )}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <Card className="border border-border/70 bg-card/95 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="size-5" />
                Journey legs
              </CardTitle>
              <CardDescription>
                Each leg keeps its own checklist.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {trip.stops.map((stop) => (
                  <Badge key={stop.id} variant={stop.kind === "home" ? "outline" : "secondary"}>
                    {stop.kind === "home" ? (
                      <Home className="mr-1 size-3.5" />
                    ) : null}
                    {stop.name}
                  </Badge>
                ))}
              </div>

              <div className="space-y-3">
                {legs.map((leg) => {
                  const isActiveChecklistLeg = trip.checklistLegId === leg.id;

                  return (
                    <div
                      key={leg.id}
                      className={`rounded-2xl border p-4 transition ${
                        isActiveChecklistLeg
                          ? "border-primary/30 bg-primary/5"
                          : "border-border/70 bg-background/75"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              Leg {leg.position + 1}
                            </span>
                            <Badge variant={getLegStatusBadgeVariant(leg.status)}>
                              {formatLegStatus(leg.status)}
                            </Badge>
                          </div>
                          <p className="font-medium">
                            {`${leg.fromStopName} -> ${leg.toStopName}`}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatChecklistProgress(leg.packedCount, leg.totalCount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/95 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Luggage className="size-5" />
                Checklist
              </CardTitle>
              <CardDescription>{checklistSummary}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {trip.checklistGroups.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 p-6 text-sm text-muted-foreground">
                  This trip doesn&apos;t have any snapshot items yet.
                </div>
              ) : (
                checklistGroups.map((group) => (
                  <div key={group.categoryName} className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {group.categoryName}
                      </h2>
                      <Badge variant="outline">{group.items.length} items</Badge>
                    </div>

                    <div className="space-y-2">
                      {group.items.map((item) => {
                        const isDisabled =
                          !checklistIsInteractive ||
                          isRouteActionPending ||
                          Boolean(
                            pendingChecklistItemIds[item.tripItemId],
                          );
                        const measurementLabel = formatTripItemMeasurement(item);

                        return (
                          <label
                            key={item.tripItemId}
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                              item.isPacked
                                ? "border-primary/25 bg-primary/5"
                                : "border-border/70 bg-background/80"
                            } ${isDisabled ? "cursor-default opacity-80" : "hover:bg-muted/50"}`}
                          >
                            <input
                              type="checkbox"
                              checked={item.isPacked}
                              disabled={isDisabled}
                              onChange={(event) => {
                                const checklistLegId = trip.checklistLegId;
                                const nextPackedState =
                                  event.currentTarget.checked;

                                if (
                                  !checklistLegId ||
                                  pendingChecklistItemIdsRef.current[
                                    item.tripItemId
                                  ]
                                ) {
                                  return;
                                }

                                setError(null);
                                pendingChecklistItemIdsRef.current = {
                                  ...pendingChecklistItemIdsRef.current,
                                  [item.tripItemId]: true,
                                };
                                setPendingChecklistItemIds(
                                  pendingChecklistItemIdsRef.current,
                                );
                                setOptimisticPackedByItemId((currentState) => ({
                                  ...currentState,
                                  [item.tripItemId]: nextPackedState,
                                }));

                                startChecklistTransition(async () => {
                                  try {
                                    const result = await toggleTripLegItemCheck({
                                      tripId: trip.id,
                                      legId: checklistLegId,
                                      tripItemId: item.tripItemId,
                                      isPacked: nextPackedState,
                                    });
                                    setOptimisticPackedByItemId(
                                      (currentState) => ({
                                        ...currentState,
                                        [item.tripItemId]: result.isPacked,
                                      }),
                                    );
                                  } catch (actionError) {
                                    setOptimisticPackedByItemId(
                                      (currentState) => {
                                        const nextState = {
                                          ...currentState,
                                        };

                                        delete nextState[item.tripItemId];
                                        return nextState;
                                      },
                                    );
                                    setError(
                                      actionError instanceof Error
                                        ? actionError.message
                                        : "Unable to update the checklist item.",
                                    );
                                  } finally {
                                    const nextPendingChecklistItemIds = {
                                      ...pendingChecklistItemIdsRef.current,
                                    };

                                    delete nextPendingChecklistItemIds[
                                      item.tripItemId
                                    ];
                                    pendingChecklistItemIdsRef.current =
                                      nextPendingChecklistItemIds;
                                    setPendingChecklistItemIds(
                                      nextPendingChecklistItemIds,
                                    );
                                  }
                                });
                              }}
                              className="size-4 rounded border-border"
                            />
                            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                              <p className="min-w-0 flex-1 truncate font-medium">
                                {item.itemName}
                              </p>
                              <div className="flex shrink-0 items-center gap-3">
                                {measurementLabel ? (
                                  <p className="text-sm text-muted-foreground">
                                    {measurementLabel}
                                  </p>
                                ) : null}
                                {item.isPacked ? (
                                  <CheckCircle2 className="size-4 text-primary" />
                                ) : (
                                  <Circle className="size-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}

              {!checklistIsInteractive && trip.status === "draft" ? (
                <div className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
                  Start the trip to activate the first leg checklist.
                </div>
              ) : null}

              {!checklistIsInteractive && trip.status === "completed" ? (
                <div className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
                  This trip is complete, so the checklist is read-only.
                </div>
              ) : null}

              {!checklistIsInteractive &&
              trip.status === "active" &&
              !trip.canArrive &&
              !trip.canGoHomeNow ? (
                <div className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
                  This checklist is shown for history, not editing.
                </div>
              ) : null}

              {trip.canGoHomeNow ? (
                <div className="rounded-2xl border border-amber-300/60 bg-amber-50/70 p-4 text-sm text-amber-950">
                  <p className="font-medium">Need to cut the route short?</p>
                  <p className="mt-1">
                    Skip the remaining stops and switch to a direct leg home.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3"
                    disabled={isRouteActionPending}
                    onClick={() => {
                      setError(null);
                      startRouteActionTransition(async () => {
                        try {
                          await goHomeNow({ tripId: trip.id });
                          router.refresh();
                        } catch (actionError) {
                          setError(
                            actionError instanceof Error
                              ? actionError.message
                              : "Unable to reroute home right now.",
                          );
                        }
                      });
                    }}
                  >
                    <SkipForward className="size-4" />
                    Skip ahead and head home
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
