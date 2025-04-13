"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Models } from "node-appwrite";
import { getUsers } from "@/lib/actions/user.actions";

interface User {
  $id: string;
  fullName: string;
  email: string;
}

const CloudNestUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.documents);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="glass-card rounded-[20px] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="h4 text-white">
          <span className="text-blue-400"></span>My Nmims Team <span className="text-blue-400">❤</span>
        </h3>
        <p className="body-2 text-white/70">{users.length} users</p>
      </div>

      {loading ? (
        <div className="flex h-[200px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
        </div>
      ) : users.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <motion.div
              key={user.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="glass-card relative flex items-center gap-4 p-4 transition-all duration-300">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="glass-card flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                >
                  <span className="text-lg font-semibold text-white">
                    {user.fullName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </span>
                </motion.div>
                <div className="flex-1">
                  <h4 className="subtitle-2 text-white transition-colors duration-300 group-hover:text-purple-200">
                    {user.fullName || "Anonymous User"}
                  </h4>
                  <p className="body-2 text-white/70 truncate transition-colors duration-300 group-hover:text-white/90">
                    {user.email}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center">
          <p className="body-2 text-white/60">No users found</p>
        </div>
      )}
    </div>
  );
};

export default CloudNestUsers; 