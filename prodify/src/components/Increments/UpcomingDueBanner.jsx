import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Query } from 'appwrite';

import GeneralRemindersService from '@/appwrite/generalReminderServices';
import ClassService            from '@/appwrite/classServices';
import classRemindersService   from '@/appwrite/classReminderServices';

export default function UpcomingDueBanner({ userId }) {
  const [dueReminders, setDueReminders] = useState([]);
  const [visible, setVisible]           = useState(false);

  // — Clear “shown” flag on each new login (i.e. when userId changes)
  useEffect(() => {
    if (!userId) return;
    const sessionKey = `UpcomingBannerShown_${userId}`;
    sessionStorage.removeItem(sessionKey);
    setVisible(false);
  }, [userId]);

  // — Load general + class reminders due in next 24h
  useEffect(() => {
    if (!userId) return;
    const cutoff = dayjs().add(24, 'hour');
    (async () => {
      const genRes = await GeneralRemindersService.listReminders(userId, 100);
      const general = (genRes.documents || []).map(doc => ({
        $id:         doc.$id,
        title:       doc.title,
        description: doc.description,
        dueAt:       doc.dueAt,
        isCompleted: doc.isDone ?? doc.isCompleted,
        className:   'General',
      }));

      const clsRes  = await ClassService.getClasses([ Query.equal('userId', userId) ]);
      const classes = clsRes.documents || [];

      const classLists = await Promise.all(
        classes.map(c => {
          const classKey = c.className.replace(/\s+/g, '').toLowerCase();
          return classRemindersService
            .listReminders(userId, classKey)
            .then(res =>
              (res.documents || []).map(doc => ({
                $id:         doc.$id,
                title:       doc.title,
                description: doc.description,
                dueAt:       doc.reminderAt,
                isCompleted: doc.isCompleted,
                className:   c.className,
              }))
            );
        })
      );

      const all  = [...general, ...classLists.flat()];
      const soon = all.filter(r => {
        const at = dayjs(r.dueAt);
        return !r.isCompleted && at.isAfter(dayjs()) && at.isBefore(cutoff);
      });

      setDueReminders(soon);
    })();
  }, [userId]);

  // — Show banner once per login
  useEffect(() => {
    if (!userId || dueReminders.length === 0) return;
    const sessionKey = `UpcomingBannerShown_${userId}`;
    if (sessionStorage.getItem(sessionKey) !== 'true') {
      setVisible(true);
      sessionStorage.setItem(sessionKey, 'true');
    }
  }, [dueReminders, userId]);

  return (
    <AnimatePresence>
      {visible && dueReminders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 200, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 200, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="
            fixed top-16 right-6 w-80
            bg-black-300 backdrop-blur-sm
            shadow-xl rounded-lg overflow-hidden
            transform-gpu perspective-500 z-50
          "
        >
          <div className="flex items-center justify-between px-4 py-2 bg-cyan-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-cyan-700" />
              <span className="text-cyan-800 text-base font-medium">
                Upcoming Reminders
              </span>
            </div>
            <button onClick={() => setVisible(false)} className="text-cyan-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
            {dueReminders.map(rem => (
              <motion.div
                key={rem.$id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="
                  bg-gray-800 rounded-md p-3
                  shadow hover:shadow-lg
                  transition-shadow
                "
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase bg-gray-300 text-gray-700 px-2 py-0.5 rounded">
                    {rem.className}
                  </span>
                  <span className="text-xs text-white">
                    {dayjs(rem.dueAt).format('MMM D, h:mm A')}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white truncate">
                  {rem.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {rem.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
