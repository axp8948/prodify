import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Query } from 'appwrite';

import GeneralRemindersService from '@/appwrite/generalReminderServices';
import ClassService               from '@/appwrite/classServices';
import RemindersService           from '@/appwrite/classReminderServices';

export default function UpcomingDueBanner({ userId }) {
  const [dueReminders, setDueReminders] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const cutoff = dayjs().add(24, 'hour');

    (async () => {
      try {
        const genRes = await GeneralRemindersService.listReminders(userId, 100);
        const general = (genRes.documents || []).map(doc => ({ ...doc, dueAt: doc.dueAt, className: 'General' }));

        const clsRes = await ClassService.getClasses([Query.equal('userId', userId)]);
        const classes = clsRes.documents || [];

        const classRems = await Promise.all(
          classes.map(c =>
            RemindersService.listReminders(userId, c.$id)
              .then(res => (res.documents || []).map(doc => ({ ...doc, dueAt: doc.reminderAt, className: c.className })))
          )
        );

        const all = [...general, ...classRems.flat()];
        const soon = all.filter(doc => {
          const at = dayjs(doc.dueAt);
          return !doc.isCompleted && at.isAfter(dayjs()) && at.isBefore(cutoff);
        });

        setDueReminders(soon);
      } catch (err) {
        console.error('UpcomingDueBanner error', err);
      }
    })();
  }, [userId]);

  return (
    <AnimatePresence>
      {visible && dueReminders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 200 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-16 right-6 w-96 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border-l-4 border-yellow-500 shadow-2xl rounded-xl overflow-hidden z-50"
        >
          <div className="flex items-center justify-between px-5 py-3 bg-yellow-500">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-white" />
              <span className="text-white text-lg font-semibold">Upcoming Reminders</span>
            </div>
            <button onClick={() => setVisible(false)} className="text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
            {dueReminders.map(rem => (
              <motion.div
                key={rem.$id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg p-3 shadow-inner hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                    {rem.className}
                  </span>
                  <span className="text-xs text-gray-500">
                    {dayjs(rem.dueAt).format('MMM D, h:mm A')}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-800 truncate">{rem.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{rem.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
