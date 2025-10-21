import {Inngest} from 'inngest';

export const inngest = new Inngest({
    id:"signalist",
    ai:{gemini:{apiKey: process.env.GEMINI_API_KEY!}},
    // eventKey is only needed when sending events from non-server environments
    // For server-to-server communication via the serve() API, it's not required
    ...(process.env.INNGEST_EVENT_KEY && { eventKey: process.env.INNGEST_EVENT_KEY }),
});
