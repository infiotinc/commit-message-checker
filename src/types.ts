/**
 * Interface used as arguments for the check function containing the pattern,
 * error message and the messages.
 */
export interface CheckerArguments {
  patternRe: RegExp;
  error: string;
  messages: string[];
}
