'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const [connected, setConnected] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        
        // Test connection by fetching modules (should be empty but connection works)
        const { data, error } = await supabase.from('modules').select('count')
        
        if (error) {
          setError(error.message)
          setConnected(false)
        } else {
          setConnected(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setConnected(false)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Braille English Learning Platform
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Setup & Installation Test
          </p>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Connection Status</h2>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Supabase Connection:</span>
              {connected === null && (
                <span className="text-yellow-600">Testing...</span>
              )}
              {connected === true && (
                <span className="text-green-600 font-bold">✓ Connected</span>
              )}
              {connected === false && (
                <span className="text-red-600 font-bold">✗ Failed</span>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <p className="text-red-800 dark:text-red-200 font-medium">Error:</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
              </div>
            )}

            {connected === true && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  ✓ Successfully connected to Supabase!
                </p>
                <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                  Database is ready. Next: Setup authentication.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Setup Checklist</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Next.js installed</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Dependencies installed</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>TypeScript types defined</span>
            </li>
            <li className="flex items-center gap-2">
              <span className={connected ? "text-green-600" : "text-gray-400"}>
                {connected ? "✓" : "○"}
              </span>
              <span>Supabase connected</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-400">○</span>
              <span>Authentication setup (next)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}