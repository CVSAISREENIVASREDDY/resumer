
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../services/database';
import { User, ResumeVersion } from '../types';
import { ObjectId } from 'mongodb';
import { INITIAL_RESUME_DATA } from '../constants';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action, username, password, versionId, name, data } = req.body;
  const db = await connectToDatabase();

  switch (req.method) {
    case 'POST':
      switch (action) {
        case 'register':
          console.log('Registering user:', username);
          const users = db.collection<User>('users');
          const existingUser = await users.findOne({ username });
          console.log('Existing user:', existingUser);
          if (existingUser) {
            return res.status(400).json({ success: false, message: 'User exists' });
          }
          await users.insertOne({ username, password });
          // Initialize with one resume version
          const versions = db.collection<ResumeVersion>('versions');
          const newVersion: ResumeVersion = {
            id: new ObjectId().toString(),
            name: 'Initial Draft',
            timestamp: Date.now(),
            data: INITIAL_RESUME_DATA,
            username: username
          };
          await versions.insertOne(newVersion);
          return res.status(200).json({ success: true });

        case 'login':
          const loginUsers = db.collection<User>('users');
          const found = await loginUsers.findOne({ username, password });
          return res.status(200).json({ success: !!found });

        case 'getVersions':
          const getVersions = db.collection<ResumeVersion>('versions');
          const userVersions = await getVersions.find({ username }).sort({ timestamp: -1 }).toArray();
          return res.status(200).json({ success: true, data: userVersions });

        case 'saveNewVersion':
          const saveVersions = db.collection<ResumeVersion>('versions');
          const newVer: ResumeVersion = {
            id: new ObjectId().toString(),
            name: name || `Version ${await saveVersions.countDocuments({ username }) + 1}`,
            timestamp: Date.now(),
            data: data,
            username: username
          };
          await saveVersions.insertOne(newVer);
          return res.status(200).json({ success: true, data: newVer });
        
        case 'updateVersion':
          const updateVersions = db.collection<ResumeVersion>('versions');
          const result = await updateVersions.findOneAndUpdate(
            { id: versionId, username: username },
            { $set: { name, data, timestamp: Date.now() } },
            { returnDocument: 'after' }
          );
          return res.status(200).json({ success: true, data: result });
        
        case 'deleteVersion':
          const deleteVersions = db.collection<ResumeVersion>('versions');
          const deleteResult = await deleteVersions.deleteOne({ id: versionId, username: username });
          return res.status(200).json({ success: deleteResult.deletedCount === 1 });

        default:
          return res.status(400).json({ message: 'Invalid action' });
      }
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}
