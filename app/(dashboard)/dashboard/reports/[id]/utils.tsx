import { Section } from '@/app/store/discoAITypes';
import React from 'react';
import { cn } from '@/lib/utils';

export const markdownComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "mt-8 mb-4 text-4xl font-bold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-8 mb-4 text-3xl font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-6 mb-3 text-2xl font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "mt-4 mb-2 text-xl font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "leading-7 text-muted-foreground [&:not(:first-child)]:mt-4",
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn(
        "my-4 ml-6 list-disc text-muted-foreground [&>li]:mt-2",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn(
        "my-4 ml-6 list-decimal text-muted-foreground [&>li]:mt-2",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "mt-6 border-l-4 border-border pl-6 italic text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        "mt-4 mb-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm",
        className
      )}
      {...props}
    />
  ),
  hr: ({ ...props }) => (
    <hr className="my-6 border-border" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table
        className={cn("w-full text-sm border-collapse", className)}
        {...props}
      />
    </div>
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn(
        "font-medium underline underline-offset-4 text-primary hover:text-primary/80",
        className
      )}
      {...props}
    />
  ),
};
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