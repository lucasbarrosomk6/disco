export function replacePlaceholders(texts: string[], placeholders: Record<string, string>): string[] {
    return texts.map(text => {
        for (const [key, value] of Object.entries(placeholders)) {
            text = text.replace(new RegExp(`\\\${${key}}`, 'g'), value);
        }
        return text;
    });
}
