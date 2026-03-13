import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import type { Node } from 'unist';
import type { Rule, Diagnostic, LintResult } from './rules.js';

export class MarkdownProcessor {
    private rules: Rule[] = [];
    private processor = unified().use(remarkParse).use(remarkStringify);

    addRule(rule: Rule) {
        this.rules.push(rule);
    }

    async process(filePath: string, content: string): Promise<LintResult> {
        const ast = this.processor.parse(content);
        const diagnostics: Diagnostic[] = [];

        for (const rule of this.rules) {
            const ruleDiagnostics = rule.check(ast, content);
            diagnostics.push(...ruleDiagnostics);
        }

        return {
            filePath,
            diagnostics,
        };
    }

    async applyFixes(content: string, diagnostics: Diagnostic[]): Promise<string> {
        const fixes = diagnostics
            .filter((d) => d.fix)
            .sort((a, b) => b.fix!.range[0] - a.fix!.range[0]);

        let fixedContent = content;
        for (const diagnostic of fixes) {
            const { range, text } = diagnostic.fix!;
            fixedContent =
                fixedContent.slice(0, range[0]) + text + fixedContent.slice(range[1]);
        }

        return fixedContent;
    }
}
