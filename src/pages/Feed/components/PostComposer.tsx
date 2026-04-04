import { type FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PostComposerProps {
  avatarUrl?: string;
  fullName?: string;
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<void>;
}

export default function PostComposer({
  avatarUrl,
  fullName,
  isSubmitting,
  onSubmit,
}: PostComposerProps) {
  const [content, setContent] = useState("");
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
      setContent("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Paylasim gonderilemedi.",
      );
    }
  }

  return (
    <Card className="border border-border/60 rounded-xl">
      <CardContent className="p-4">
        <form className="flex items-start gap-3" onSubmit={handleSubmit}>
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {fullName?.charAt(0) ?? "K"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Kampus icin kisa bir paylasim yaz..."
              rows={4}
              maxLength={1500}
              className="w-full resize-none rounded-xl border border-border/60 bg-secondary/40 px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />

            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  Bu asamada sadece metin paylasimi aktif.
                </p>
                {errorMessage && (
                  <p className="text-destructive">{errorMessage}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  {content.length}/1500
                </span>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !content.trim()}
                  className="gap-1.5 px-5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? "Paylasiliyor" : "Paylas"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
