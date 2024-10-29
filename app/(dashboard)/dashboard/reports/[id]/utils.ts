import { Section } from '@/app/store/discoAITypes';

export function parseAIMarkdown(markdown: string): Section {
    if (!markdown) {
        throw new Error('No markdown content provided to parse');
    }

    // Extract title from first h1 or h2
    const titleMatch = markdown.match(/^#+ (.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled Section';

    // Remove the title from content
    let content = markdown.replace(/^#+ .+$/m, '').trim();

    // Process content
    const lines = content.split('\n');
    const processedLines = lines.map(line => {
        // Ensure heading levels don't exceed 6
        if (line.startsWith('#')) {
            const headingLevel = line.match(/^#+/)?.[0]?.length || 0;
            const adjustedLevel = Math.min(headingLevel, 6);
            line = '#'.repeat(adjustedLevel) + line.slice(headingLevel);
        }

        // Limit list nesting to 6 levels
        if (line.match(/^\s*[-*+]\s/)) {
            const indent = line.match(/^\s*/)?.[0]?.length || 0;
            const maxIndent = 12; // 6 levels * 2 spaces per level
            if (indent > maxIndent) {
                line = ' '.repeat(maxIndent) + line.trim();
            }
        }

        return line;
    });

    return {
        title,
        content: processedLines.join('\n'),
        prompt: '', // You'll need to pass this in or store it elsewhere
    };
}