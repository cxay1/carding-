const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = {
  check: (key: string, limit: number) => {
    const now = Date.now();
    const record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + 3600000 });
      return { success: true };
    }
    
    if (record.count >= limit) {
      return { success: false };
    }
    
    record.count++;
    return { success: true };
  },
};