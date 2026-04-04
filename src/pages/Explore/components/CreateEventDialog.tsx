import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateEventInput } from "@/features/events/types";

const eventCategories = ["Akademik", "Kariyer", "Sosyal", "Teknoloji", "Spor"];

interface CreateEventDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: CreateEventInput) => Promise<void>;
}

export default function CreateEventDialog({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateEventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("100");
  const [category, setCategory] = useState(eventCategories[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setLocation("");
      setStartDate("");
      setEndDate("");
      setMaxParticipants("100");
      setCategory(eventCategories[0]);
      setErrorMessage(null);
    }
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title.trim().length < 3) {
      setErrorMessage("Etkinlik basligi en az 3 karakter olmali.");
      return;
    }

    if (description.trim().length < 10) {
      setErrorMessage("Aciklama en az 10 karakter olmali.");
      return;
    }

    if (!location.trim()) {
      setErrorMessage("Konum alani zorunludur.");
      return;
    }

    const participantLimit = Number(maxParticipants);
    if (!Number.isInteger(participantLimit) || participantLimit < 1 || participantLimit > 5000) {
      setErrorMessage("Kontenjan 1 ile 5000 arasinda olmalidir.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setErrorMessage("Baslangic ve bitis tarihi secilmelidir.");
      return;
    }

    if (end <= start) {
      setErrorMessage("Bitis tarihi baslangic tarihinden sonra olmali.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        startDateUtc: start.toISOString(),
        endDateUtc: end.toISOString(),
        maxParticipants: participantLimit,
        category,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Etkinlik olusturulamadi.",
      );
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Etkinlik Olustur</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="event-title">Baslik</Label>
            <Input id="event-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">Aciklama</Label>
            <textarea
              id="event-description"
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-location">Konum</Label>
            <Input id="event-location" value={location} onChange={(event) => setLocation(event.target.value)} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event-start">Baslangic</Label>
              <Input
                id="event-start"
                type="datetime-local"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-end">Bitis</Label>
              <Input
                id="event-end"
                type="datetime-local"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event-category">Kategori</Label>
              <select
                id="event-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {eventCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-limit">Kontenjan</Label>
              <Input
                id="event-limit"
                type="number"
                min={1}
                max={5000}
                value={maxParticipants}
                onChange={(event) => setMaxParticipants(event.target.value)}
              />
            </div>
          </div>

          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Olusturuluyor" : "Etkinligi Olustur"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
