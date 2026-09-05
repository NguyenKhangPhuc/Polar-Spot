"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { Profile } from "@/app/types/profile";
import { PROFILE_ROLE } from "@/app/types/enum";

interface UserTableProps {
  paginatedUsers: Profile[];
  startIndex: number;
  handleRoleChange: (userId: string, newRole: string) => Promise<void>;
}

export default function UserTable({
  paginatedUsers,
  startIndex,
  handleRoleChange,
}: UserTableProps) {
  return (
    <div className="bg-[#1d1b1a] border border-white/5 rounded-sm overflow-x-auto shadow-xl">
      <table className="w-full border-collapse font-mono text-[10px] text-[#b9cbc2] text-left min-w-[750px]">
        <thead>
          <tr className="border-b border-white/5 bg-[#151312] text-[#83958d] select-none text-[8.5px] uppercase tracking-wider font-bold">
            <th className="p-4 font-bold text-center w-14">NO</th>
            <th className="p-4 font-bold min-w-[180px]">FULL NAME</th>
            <th className="p-4 font-bold min-w-[200px]">EMAIL ADDRESS</th>
            <th className="p-4 font-bold min-w-[140px]">CREATED AT</th>
            <th className="p-4 font-bold text-center w-36">SYSTEM ROLE</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="wait">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, index) => {
                const userRole = user.role
                  ? String(user.role).toLowerCase()
                  : PROFILE_ROLE.STUDENT;
                const createdAtStr = user.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }).toUpperCase()
                  : "N/A";

                return (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors"
                  >
                    {/* Index */}
                    <td className="p-4 text-center font-bold text-[#83958d]">
                      {String(startIndex + index + 1).padStart(3, "0")}
                    </td>

                    {/* Full Name */}
                    <td className="p-4 text-[#e8e1df] font-bold whitespace-nowrap">
                      {user.full_name || "UNREGISTERED USER"}
                    </td>

                    {/* Email */}
                    <td className="p-4 text-[#83958d] whitespace-nowrap">
                      {user.email || "NO EMAIL ADDRESS"}
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-[#83958d] whitespace-nowrap">
                      {createdAtStr}
                    </td>

                    {/* System Role Dropdown */}
                    <td className="p-4 text-center w-36 select-none">
                      <div className="relative flex items-center w-full">
                        <select
                          value={userRole}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-[9px] p-2 pr-6 rounded-sm outline-none focus:border-[#00ffec]/50 transition-colors w-full appearance-none cursor-pointer text-center uppercase font-bold"
                        >
                          <option value={PROFILE_ROLE.STUDENT}>STUDENT</option>
                          <option value={PROFILE_ROLE.JUDGES}>JUDGE</option>
                          <option value={PROFILE_ROLE.ADMIN}>ADMIN</option>
                        </select>
                        <svg
                          className="w-3.5 h-3.5 absolute right-2 text-[#83958d] pointer-events-none"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-[#83958d] select-none text-xs font-mono"
                >
                  NO USER REGISTRY ENTRIES MATCHING ACTIVE FILTER PARAMETERS
                </td>
              </tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
