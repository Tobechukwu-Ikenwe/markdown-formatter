import type { Node } from 'unist';

export interface Diagnostic {
    message: string;
    line?: number;
    column?: number;
    ruleId: string;
    severity: 'error' | 'warning';
    fix?: {
        range: [number, number];
        text: string;
    };
}

export interface Rule {
    id: string;
    description: string;
    check(ast: Node, content: string): Diagnostic[];
}

export interface LintResult {
    filePath: string;
    diagnostics: Diagnostic[];
    fixedContent?: string;
}
