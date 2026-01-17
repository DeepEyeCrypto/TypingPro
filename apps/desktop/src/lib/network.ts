// src/lib/network.ts
export async function testNetwork() {
    try {
        const res = await fetch('https://httpbin.org/ip', {
            mode: 'cors',
            cache: 'no-cache'
        });
        return await res.json();
    } catch (e) {
        console.error('Network blocked:', e);
        // Fallback to local test if external fails
        try {
            const internalRes = await fetch('http://localhost:1420/index.html');
            return { status: 'local_ok', error: e instanceof Error ? e.message : String(e) };
        } catch (innerE) {
            return { status: 'blocked', error: e instanceof Error ? e.message : String(e) };
        }
    }
}
