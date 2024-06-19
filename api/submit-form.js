// api/submit-form.js
import { Client } from 'pg';

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const client = new Client({
        connectionString: "postgres://default:Hrokw7Ov3dAI@ep-steep-band-a4f31rt5-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
        ssl: {
            rejectUnauthorized: false
        }
    });

    await client.connect();

    const { firstName, lastName, email, contactNumber, message } = req.body;

    try {
        await client.query('INSERT INTO leads (first_name, last_name, email, contact_number, message) VALUES ($1, $2, $3, $4, $5)', 
        [firstName, lastName, email, contactNumber, message]);
        
        res.status(200).json({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.end();
    }
};
