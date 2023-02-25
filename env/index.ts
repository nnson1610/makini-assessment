import * as dotenv from 'dotenv';

const loadConfig = () => {
    const config = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
    if (!config.parsed) {
        return {};
    }
    return config.parsed;
}

export const config = loadConfig();