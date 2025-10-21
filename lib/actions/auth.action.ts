'use server';

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
import {headers} from "next/headers";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        console.log('📝 Attempting sign up for:', email);
        
        const response = await auth.api.signUpEmail({ 
            body: { email, password, name: fullName } 
        });

        console.log('✅ Better Auth response:', response);

        // Send welcome email asynchronously - don't block signup if it fails
        if(response) {
            const eventData = { 
                email, 
                name: fullName, 
                country, 
                investmentGoals, 
                riskTolerance, 
                preferredIndustry 
            };
            
            console.log('📧 Sending Inngest event with data:', JSON.stringify(eventData, null, 2));
            
            inngest.send({
                name: 'app/user.created',
                data: eventData
            }).then((result) => {
                console.log('✅ Inngest event sent successfully:', result);
            }).catch((err) => {
                console.error('⚠️ Failed to send welcome email event (non-critical):', err);
                console.error('⚠️ Error details:', err.message, err.stack);
            });
        }

        return { success: true, data: response }
    } catch (e) {
        console.error('❌ Sign up failed:', e);
        const errorMessage = e instanceof Error ? e.message : 'Sign up failed. Please try again.'
        throw new Error(errorMessage)
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({ body: { email, password } })

        return { success: true, data: response }
    } catch (e) {
        console.error('Sign in failed:', e)
        const errorMessage = e instanceof Error ? e.message : 'Sign in failed. Please check your credentials.'
        throw new Error(errorMessage)
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
    } catch (e) {
        console.log('Sign out failed', e)
        return { success: false, error: 'Sign out failed' }
    }
}