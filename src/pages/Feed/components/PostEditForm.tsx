import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

interface PostEditFormProps {
  initialContent: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (content: string) => Promise<void>;
}

export default function PostEditForm({
  initialContent,
  isSubmitting,
  onCancel,
  onSubmit,
}: PostEditFormProps) {
  const [content, setContent] = useState(initialContent);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setErrorMessage("Paylasim metni bos olamaz.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit(trimmedContent);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Paylasim guncellenemedi.",
      );
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={4}
        maxLength={1500}
        className="w-full resize-none rounded-xl border border-border/60 bg-secondary/30 px-3 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      />

      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-muted-foreground">{content.length}/1500</span>
          {errorMessage && <p className="text-destructive">{errorMessage}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Iptal
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? "Kaydediliyor" : "Kaydet"}
          </Button>
        </div>
      </div>
    </form>
  );
}
