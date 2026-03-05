import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        // 1. Auth & Role Check
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: captainProfile, error: profileError } = await supabase
            .from('profiles')
            .select('role, team_id')
            .eq('id', user.id)
            .single();

        if (profileError || captainProfile?.role !== 'captain' || !captainProfile.team_id) {
            return NextResponse.json({ error: 'Only captains with an assigned team can onboard players.' }, { status: 403 });
        }

        // 2. Team Size Validation (4-8 players)
        const { count, error: countError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', captainProfile.team_id);

        if (countError) throw countError;
        if (count !== null && count >= 8) {
            return NextResponse.json({ error: 'Team is full. Max 8 players allowed per team.' }, { status: 400 });
        }

        // 3. Parse Request
        const { email, name } = await req.json();
        if (!email || !name) return NextResponse.json({ error: 'Name and Email are required.' }, { status: 400 });

        // 4. Create Profile (Assuming Auth user is created separately or later)
        // Note: For a true "invite", we would use supabase.auth.admin.inviteUserByEmail(email)
        // But that requires a SERVICE_ROLE_KEY which shouldn't be exposed or used without care.
        // For now, we create the profile. If the user signs up with this email, we link them.

        const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
                name,
                team_id: captainProfile.team_id,
                role: 'player',
                // We don't set ID here if we want it to be linked later, 
                // but usually, it's better to have a placeholder or handle invite.
            })
            .select()
            .single();

        if (insertError) throw insertError;

        return NextResponse.json({
            message: `Player ${name} onboarded to your team successfully.`,
            profile: newProfile
        });

    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
