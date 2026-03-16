import { EventEmitter } from "eventemitter3";
import { useEffect } from "react";

const emitter = new EventEmitter();

export type RefreshEvent = "transactions" | "accounts" | "categories";

/**
 * Emette un evento di refresh globale.
 * Chiamalo dopo ogni insert/update/delete.
 */
export function emitRefresh(...events: RefreshEvent[]) {
  events.forEach((e) => emitter.emit(e));
}

/**
 * Hook che si iscrive a uno o più eventi di refresh
 * e chiama `onRefresh` ogni volta che vengono emessi.
 */
export function useRefreshOn(events: RefreshEvent[], onRefresh: () => void) {
  useEffect(() => {
    events.forEach((e) => emitter.on(e, onRefresh));
    return () => {
      events.forEach((e) => emitter.off(e, onRefresh));
    };
  }, [onRefresh]);
}
