"use client";

import { useActionState, useEffect, useId } from "react";
import type { AddressActionState } from "@/lib/account/actions";

interface AddressFormProps {
  action: (prevState: AddressActionState, formData: FormData) => Promise<AddressActionState>;
  addressId?: number;
  initialLabel?: string;
  initialStreet?: string;
  initialCity?: string;
  initialState?: string;
  initialPostalCode?: string;
  initialCountry?: string;
  initialIsDefault?: boolean;
  submitLabel: string;
  onDone: () => void;
}

const initialState: AddressActionState = { error: null, success: false };

export default function AddressForm({
  action,
  addressId,
  initialLabel = "Home",
  initialStreet = "",
  initialCity = "",
  initialState: initialRegion = "",
  initialPostalCode = "",
  initialCountry = "India",
  initialIsDefault = false,
  submitLabel,
  onDone
}: AddressFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  // AddressForm renders more than once at a time (an "add" form plus a
  // per-item "edit" form in AddressList), so ids need to be unique per
  // instance rather than static strings.
  const uid = useId();

  useEffect(() => {
    if (state.success) onDone();
  }, [state.success, onDone]);

  return (
    <form action={formAction} className="p-6 bg-[#141414] border border-white/10 space-y-4">
      {addressId && <input type="hidden" name="id" value={addressId} />}

      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor={`${uid}-label`} className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">LABEL</label>
          <input
            id={`${uid}-label`}
            name="label"
            defaultValue={initialLabel}
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>
        <label htmlFor={`${uid}-isDefault`} className="flex items-center gap-2 pb-3 text-[11px] font-mono text-zinc-400 uppercase cursor-pointer">
          <input id={`${uid}-isDefault`} type="checkbox" name="isDefault" defaultChecked={initialIsDefault} className="accent-white" />
          SET AS DEFAULT
        </label>
      </div>

      <div>
        <label htmlFor={`${uid}-street`} className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">STREET ADDRESS</label>
        <input
          id={`${uid}-street`}
          name="street"
          defaultValue={initialStreet}
          required
          className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor={`${uid}-city`} className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">CITY</label>
          <input
            id={`${uid}-city`}
            name="city"
            defaultValue={initialCity}
            required
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-state`} className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">STATE</label>
          <input
            id={`${uid}-state`}
            name="state"
            defaultValue={initialRegion}
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-postalCode`} className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">POSTAL CODE</label>
          <input
            id={`${uid}-postalCode`}
            name="postalCode"
            defaultValue={initialPostalCode}
            required
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-country`} className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">COUNTRY</label>
        <input
          id={`${uid}-country`}
          name="country"
          defaultValue={initialCountry}
          required
          className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
        />
      </div>

      {state.error && (
        <p className="text-[10px] font-mono text-red-400 border border-red-500/30 bg-red-950/30 px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="clay-button-primary px-6 py-3 text-xs font-mono uppercase tracking-widest disabled:opacity-60"
        >
          {pending ? "SAVING..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="clay-button-secondary px-6 py-3 text-xs font-mono uppercase tracking-widest"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
