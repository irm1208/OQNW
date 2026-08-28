import { useEffect, useState } from "react";
import { useDispatchAdminOrder } from "@workspace/api-client-react";
import { Loader2, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CUSTOM_CARRIER, getTrackingUrl, isSafeTrackingUrl, TRACKING_CARRIERS } from "@/lib/tracking-carriers";

type DispatchDialogProps = {
  order: { id: number; orderNumber: string; customerName?: string; carrierName?: string | null; trackingNumber?: string | null; trackingUrl?: string | null };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDispatched: () => void;
};

export function DispatchDialog({ order, open, onOpenChange, onDispatched }: DispatchDialogProps) {
  const [carrierChoice, setCarrierChoice] = useState(order.carrierName && TRACKING_CARRIERS.includes(order.carrierName as never) ? order.carrierName : CUSTOM_CARRIER);
  const [carrierName, setCarrierName] = useState(order.carrierName ?? "");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl ?? "");
  const dispatchOrder = useDispatchAdminOrder();

  useEffect(() => {
    if (!open) return;
    const known = order.carrierName && TRACKING_CARRIERS.includes(order.carrierName as never);
    setCarrierChoice(known ? order.carrierName! : CUSTOM_CARRIER);
    setCarrierName(known ? "" : order.carrierName ?? "");
    setTrackingNumber(order.trackingNumber ?? "");
    setTrackingUrl(order.trackingUrl ?? (known ? getTrackingUrl(order.carrierName!, order.trackingNumber ?? "") : ""));
  }, [open, order]);

  const knownCarrier = carrierChoice !== CUSTOM_CARRIER;
  const selectedCarrierName = knownCarrier ? carrierChoice : carrierName.trim();
  const canDispatch = !!selectedCarrierName && !!trackingNumber.trim() && isSafeTrackingUrl(trackingUrl);

  function changeCarrier(value: string) {
    setCarrierChoice(value);
    if (value !== CUSTOM_CARRIER) setTrackingUrl(getTrackingUrl(value, trackingNumber));
  }

  function changeTrackingNumber(value: string) {
    setTrackingNumber(value);
    if (knownCarrier) setTrackingUrl(getTrackingUrl(carrierChoice, value));
  }

  function handleDispatch() {
    if (!canDispatch) return;
    dispatchOrder.mutate(
      { id: order.id, data: { carrierName: selectedCarrierName, trackingNumber: trackingNumber.trim(), trackingUrl: trackingUrl.trim() } },
      {
        onSuccess: result => {
          if (result.emailSent) {
            toast.success(`${order.orderNumber} dispatched and notification sent`);
          } else {
            toast.warning(`Order dispatched, but notification email was not sent${result.warning ? `: ${result.warning}` : ""}`);
          }
          setCarrierChoice(CUSTOM_CARRIER);
          setCarrierName("");
          setTrackingNumber("");
          setTrackingUrl("");
          onOpenChange(false);
          onDispatched();
        },
        onError: () => toast.error("Failed to dispatch order"),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Dispatch Order — {order.orderNumber}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          {order.customerName && <p className="text-sm text-muted-foreground">Shipping to <strong>{order.customerName}</strong>. A notification will be sent automatically.</p>}
          <div className="space-y-1">
            <label className="text-sm font-medium">Carrier</label>
            <Select value={carrierChoice} onValueChange={changeCarrier}>
              <SelectTrigger data-testid="select-dispatch-carrier"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TRACKING_CARRIERS.map(carrier => <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>)}
                <SelectItem value={CUSTOM_CARRIER}>Other / custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!knownCarrier && <div className="space-y-1">
            <label className="text-sm font-medium">Carrier company name</label>
            <Input data-testid="input-dispatch-carrier-name" value={carrierName} onChange={e => setCarrierName(e.target.value)} placeholder="Shipping company" />
          </div>}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tracking number</label>
            <Input data-testid="input-dispatch-tracking-number" value={trackingNumber} onChange={e => changeTrackingNumber(e.target.value)} placeholder="Enter tracking number" autoFocus />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Tracking URL</label>
            <Input data-testid="input-dispatch-tracking-url" value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)} placeholder="https://…" />
            {!isSafeTrackingUrl(trackingUrl) && <p className="text-xs text-destructive">Enter a valid HTTPS tracking URL.</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button data-testid="button-confirm-dispatch" onClick={handleDispatch} disabled={!canDispatch || dispatchOrder.isPending}>
            {dispatchOrder.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Truck className="w-4 h-4 mr-2" />}
            Dispatch Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}