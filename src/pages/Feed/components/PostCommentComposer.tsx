import { type FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostCommentComposerProps {
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<void>;
}

export default function PostCommentComposer({
  isSubmitting,
  onSubmit,
}: PostCommentComposerProps) {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setErrorMessage("Yorum bos olamaz.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit(trimmedContent);
      setContent("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Yorum gonderilemedi.",
      );
    }
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Yorum yaz..."
        rows={2}
        maxLength={500}
        className="w-full resize-none rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      />

      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-muted-foreground">{content.length}/500</span>
          {errorMessage && <p className="text-destructive">{errorMessage}</p>}
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !content.trim()}
          className="gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          {isSubmitting ? "Gonderiliyor" : "Yorum Yap"}
        </Button>
      </div>
    </form>
  );
}
