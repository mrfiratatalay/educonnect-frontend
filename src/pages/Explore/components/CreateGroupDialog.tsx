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

const groupCategories = ["Akademik", "Teknoloji", "Spor", "Sanat", "Sosyal"];

interface CreateGroupDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: {
    name: string;
    description: string;
    category: string;
  }) => Promise<void>;
}

export default function CreateGroupDialog({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(groupCategories[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setCategory(groupCategories[0]);
      setErrorMessage(null);
    }
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 3) {
      setErrorMessage("Grup adi en az 3 karakter olmali.");
      return;
    }

    if (description.trim().length < 10) {
      setErrorMessage("Aciklama en az 10 karakter olmali.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        category,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Grup olusturulamadi.",
      );
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Grup Olustur</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="group-name">Grup Adi</Label>
            <Input id="group-name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group-description">Aciklama</Label>
            <textarea
              id="group-description"
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group-category">Kategori</Label>
            <select
              id="group-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {groupCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Olusturuluyor" : "Grubu Olustur"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
