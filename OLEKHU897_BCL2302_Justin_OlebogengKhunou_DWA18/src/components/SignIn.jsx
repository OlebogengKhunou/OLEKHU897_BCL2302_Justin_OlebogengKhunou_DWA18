import { createClient } from '@supabase/supabase-js'
import React from 'react'
import {Auth,} from '@supabase/auth-ui-react'
import { ThemeSupa,} from '@supabase/auth-ui-shared'

export const supabase = createClient(
  'https://zjdfaryxscxnwekokdvt.supabase.co',
 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZGZhcnl4c2N4bndla29rZHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA4Nzc0MzEsImV4cCI6MjAwNjQ1MzQzMX0.7MozAjSXjjmd2ugEcaDt7Ea5ScMlreJpA5yVKuaO-oA'
)

export default function Sign() {
 
  return (
  <div className='signUpdiv'>
    <div className='signUp'>
      <h1>PodCast & Chill</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        providers={['google', 'github']}
      />  
    </div>
    </div>

  );
}
