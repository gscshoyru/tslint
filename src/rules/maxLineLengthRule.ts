/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/// <reference path='../../lib/tslint.d.ts' />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "exceeds maximum line length of ";

    public isEnabled(): boolean {
        if (super.isEnabled()) {
            var option = this.getOptions().ruleArguments[0];
            if (typeof option === "number" && option > 0) {
                return true;
            }
        }

        return false;
    }

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        var ruleFailures = [];
        var lineLimit = this.getOptions().ruleArguments[0];
        var lineMap = syntaxTree.lineMap();
        var lineStarts = lineMap.lineStarts();
        var errorString = Rule.FAILURE_STRING + lineLimit;
        var disabledIntervals = this.getOptions().disabledIntervals;

        for (var i = 0; i < lineStarts.length - 1; ++i) {
            var from = lineStarts[i], to = lineStarts[i + 1];
            if ((to - from - 1) > lineLimit) {
                var ruleFailure = new Lint.RuleFailure(syntaxTree, from, to - 1, errorString);
                if (!Lint.doesIntersect(ruleFailure, disabledIntervals)) {
                    ruleFailures.push(ruleFailure);
                }
            }
          }

        return ruleFailures;
    }
}
