import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard/player';

  if (code) {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && authData?.user?.id) {
      let redirectUrl = `${origin}${next}`;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', authData.user.id)
        .single();
        
      const captainNames = [
        'paras chandaria', 
        'deepen kerai', 
        'darshi chandaria', 
        'kevin njihia'
      ];
      
      if (profile?.role === 'captain' || (profile?.name && captainNames.includes(profile.name.toLowerCase()))) {
        redirectUrl = `${origin}/dashboard/captain/onboarding`;
      }
      
      return NextResponse.redirect(redirectUrl);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Invalid+or+expired+confirmation+link`);
}
