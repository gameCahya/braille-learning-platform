"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBrailleReference } from "@/lib/braille";
import BrailleCharCard from "@/components/braille/BrailleCharCard";

export default function BrailleReferencePage() {
  const reference = getBrailleReference();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Braille Reference</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Complete reference for Grade 1 English Braille
        </p>
      </div>

      {/* Alphabet Section */}
      <Card>
        <CardHeader>
          <CardTitle>Alphabet (A-Z)</CardTitle>
          <CardDescription>
            Basic letter representations in Braille
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {reference.alphabet.map((item) => (
              <BrailleCharCard
                key={item.char}
                char={item.char}
                braille={item.braille}
                dots={item.dots}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Numbers Section */}
      <Card>
        <CardHeader>
          <CardTitle>Numbers (0-9)</CardTitle>
          <CardDescription>
            Numbers in Braille with number indicator (⠼)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {reference.numbers.map((item) => (
              <BrailleCharCard
                key={item.char}
                char={item.char}
                braille={item.braille}
                description="With indicator"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Punctuation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Punctuation</CardTitle>
          <CardDescription>
            Common punctuation marks in Braille
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {reference.punctuation.map((item) => (
              <BrailleCharCard
                key={item.char}
                char={item.char}
                braille={item.braille}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Special Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Special Indicators</CardTitle>
          <CardDescription>
            Prefixes that modify the following characters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-semibold">Capital Letter Indicator</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Placed before uppercase letters
                </div>
              </div>
              <div className="text-4xl font-mono">⠠</div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-semibold">Number Indicator</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Placed before numbers (changes letters to numbers)
                </div>
              </div>
              <div className="text-4xl font-mono">⠼</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Read */}
      <Card>
        <CardHeader>
          <CardTitle>How to Read Braille</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Braille Cell Structure</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Each Braille character is made up of 6 dots arranged in 2 columns of 3 dots each.
                Dots are numbered 1-6:
              </p>
              <pre className="mt-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono">
                {`1 • • 4
2 • • 5
3 • • 6`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Examples</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Letter &quot;A&ldquo; = dot 1 only → ⠁</li>
                <li>• Letter &quot;B&ldquo; = dots 1-2 → ⠃</li>
                <li>• Letter &quot;C&ldquo; = dots 1-4 → ⠉</li>
                <li>• &quot;Hello&ldquo; = ⠠⠓⠑⠇⠇⠕ (with capital indicator)</li>
                <li>• &quot;123&ldquo; = ⠼⠁⠃⠉ (with number indicator)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}