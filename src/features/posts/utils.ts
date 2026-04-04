export function formatPostTime(value: string) {
  const diff = Date.now() - new Date(value).getTime();

  if (diff < 60_000) {
    return "Az once";
  }

  if (diff < 3_600_000) {
    return `${Math.floor(diff / 60_000)} dk`;
  }

  if (diff < 86_400_000) {
    return `${Math.floor(diff / 3_600_000)} sa`;
  }

  return `${Math.floor(diff / 86_400_000)} gun`;
}

export function getPostExcerpt(content: string, maxLength = 120) {
  if (content.length <= maxLength) {
    return content;
  }

  return `${content.slice(0, maxLength).trimEnd()}...`;
}
