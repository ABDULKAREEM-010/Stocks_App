import {Inngest, EventSchemas} from 'inngest';

// Define event types for Inngest
type Events = {
    'app/user.created': {
        data: {
            email: string;
            name: string;
            country: string;
            investmentGoals: string;
            riskTolerance: string;
            preferredIndustry: string;
        };
    };
    'app/send.daily.news': {
        data: Record<string, never>; // Empty data for cron job
    };
};

export const inngest = new Inngest({
    id:"signalist",
    ai:{gemini:{apiKey: process.env.GEMINI_API_KEY!}},
    eventKey: process.env.INNGEST_EVENT_KEY,
    schemas: new EventSchemas().fromRecord<Events>(),
});
