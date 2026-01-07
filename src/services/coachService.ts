import { GoogleGenerativeAI } from "@google/generative-ai";
import { WeaknessProfile } from "./weaknessAnalyzer";
import { SessionResult } from "../stores/statsStore";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Mock response for development if no key is present
const MOCK_VERDICT = {
    insight: "Your rhythm is solid, but you hesitate significantly on bottom-row keys. This micro-pausing accounts for 15% of your total time.",
    identify_habit: "Right-hand bottom row insecurity (M, ,, .)",
    habit_score: 7,
    recommended_drills: [
        {
            title: "Bottom Row Flow",
            reason: "To stabilize your right hand on 'm', 'n', and comma.",
            text: "many men mine moon name none man mom my me, mine, man. come, name. moon. money. music."
        },
        {
            title: "Pinky Precision",
            reason: "Your right pinky is dragging on punctuation.",
            text: "p; p. p/ p' l; l. l/ ;. /. '. ;p /p .p"
        },
        {
            title: "Rhythm Reset",
            reason: "Focus on consistent spacing between words.",
            text: "the and for are but not you all any can her was one our out day get has him his how man new now old see two way who boy did its let put say she too use dad mom"
        }
    ]
};

export interface CoachVerdict {
    insight: string;
    identify_habit: string;
    habit_score: number;
    recommended_drills: {
        title: string;
        reason: string;
        text: string;
    }[];
}

export class CoachService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;

    constructor() {
        if (API_KEY) {
            this.genAI = new GoogleGenerativeAI(API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        } else {
            console.warn("DeepEye Coach: No Gemini API Key found. Using Mock Mode.");
        }
    }

    async analyzeUser(
        weaknessProfile: WeaknessProfile,
        recentHistory: SessionResult[]
    ): Promise<CoachVerdict> {
        if (!this.model) {
            // Simulate network delay for realism
            await new Promise(resolve => setTimeout(resolve, 2000));
            return MOCK_VERDICT;
        }

        try {
            const context = this.buildContext(weaknessProfile, recentHistory);
            const prompt = `
                ACT AS: A tough but effective professional typing coach.
                TASK: Analyze the student's typing statistics and identify THE single most critical bad habit holding them back.
                OUTPUT: A JSON object strictly adhering to this schema:
                {
                    "insight": "1-2 sentences explaining the problem directly to the student.",
                    "identify_habit": "Short name of the bad habit (e.g. 'Left Pinky Weakness')",
                    "habit_score": number 1-10 (severity),
                    "recommended_drills": [
                        { "title": "Drill Name", "reason": "Why this helps", "text": "A generated custom typing drill (approx 20 words) focusing on the problem keys." },
                        { "title": "Drill Name", "reason": "Why this helps", "text": "..." },
                        { "title": "Drill Name", "reason": "Why this helps", "text": "..." }
                    ]
                }

                STUDENT DATA:
                ${JSON.stringify(context, null, 2)}
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean markdown code blocks if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr) as CoachVerdict;

        } catch (error) {
            console.error("DeepEye Coach Brain Freeze:", error);
            return MOCK_VERDICT;
        }
    }

    private buildContext(profile: WeaknessProfile, history: SessionResult[]) {
        // Extract top 5 slow keys
        const slowKeys = profile.slowKeys.slice(0, 5).map(k => ({
            key: k.key,
            latency: Math.round(k.avgLatency) + 'ms'
        }));

        // Extract top 5 error keys
        const errorKeys = profile.errorProneKeys.slice(0, 5).map(k => ({
            key: k.key,
            errorRate: k.errorRate.toFixed(1) + '%'
        }));

        // Recent performance trend
        const recentTrend = history.slice(0, 5).map(s => ({
            wpm: Math.round(s.wpm),
            date: new Date(s.timestamp).toLocaleDateString()
        }));

        return {
            slowest_keys: slowKeys,
            most_errors_on: errorKeys,
            recent_sessions: recentTrend,
            total_keys_analyzed: profile.totalKeysTracked
        };
    }
}

export const coachService = new CoachService();
