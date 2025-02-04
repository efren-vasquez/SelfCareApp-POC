import { startScheduler } from '../../utils/agenda';

export default async function handler(req, res) {
  try {
    await startScheduler();
    res.status(200).json({ message: 'Scheduler started' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}