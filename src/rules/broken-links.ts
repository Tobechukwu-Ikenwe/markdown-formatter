import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import type { Link } from 'mdast';
import type { Rule, Diagnostic } from '../engine/rules.js';
import * as fs from 'fs';
import * as path from 'path';

export class BrokenLinksRule implements Rule {
    id = 'broken-links';
    description = 'Ensures all relative file links point to existing files.';

    constructor(private baseDir: string) { }

    check(ast: Node, content: string): Diagnostic[] {
        const diagnostics: Diagnostic[] = [];

        visit(ast, 'link', (node: Link) => {
            const url = node.url;

            // Only check relative file links (don't check http/https or mailto)
            if (!url.startsWith('http') && !url.startsWith('mailto:') && !url.startsWith('#')) {
                const filePath = path.join(this.baseDir, url);
                // Remove anchor if present
                const cleanPath = filePath.split('#')[0];

                try {
                    if (!fs.existsSync(cleanPath)) {
                        diagnostics.push({
                            ruleId: this.id,
                            message: `Broken link: ${url} (file not found: ${cleanPath})`,
                            line: node.position?.start.line,
                            column: node.position?.start.column,
                            severity: 'error',
                        });
                    }
                } catch (e) {
                    // If we can't check it (e.g. permission issues), just skip
                }
            }
        });

        return diagnostics;
    }
}
