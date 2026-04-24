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

        // 4. Invite User & Create Profile
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json({ error: 'Server configuration error. Missing Service Role Key.' }, { status: 500 });
        }

        // We need an admin client to invite users
        const { createClient: createAdminClient } = await import('@supabase/supabase-js');
        const adminAuthClient = createAdminClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        // Send email invitation
        const { data: inviteData, error: inviteError } = await adminAuthClient.auth.admin.inviteUserByEmail(email);

        if (inviteError) {
            return NextResponse.json({ error: inviteError.message }, { status: 400 });
        }

        // Insert profile using the generated auth user ID
        const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: inviteData.user.id,
                name,
                team_id: captainProfile.team_id,
                role: 'player',
            })
            .select()
            .single();

        if (insertError) {
            // Clean up if profile creation fails
            await adminAuthClient.auth.admin.deleteUser(inviteData.user.id);
            throw insertError;
        }

        return NextResponse.json({
            message: `Player ${name} invited and onboarded to your team successfully.`,
            profile: newProfile
        });

    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
