// src/utils/evaluateFormula.ts
export function evaluateFormula(expression: string, parentKeys: string[], parentValues: any[]): any {
  try {
    // Build argument list and call
    // e.g. new Function('dob','a','b', 'return ' + expression)
    const fn = new Function(...parentKeys, `return (${expression});`);
    return fn(...parentValues);
  } catch (err) {
    console.error('evaluateFormula error', err);
    return undefined;
  }
}