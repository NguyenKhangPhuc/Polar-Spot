"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/app/components/BackButton";
import Pagination from "@/components/Pagination";
import { Profile } from "@/app/types/profile";
import { PROFILE_ROLE } from "@/app/types/enum";
import { updateProfileRole } from "@/app/actions/profile";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";

interface UserManagementClientProps {
  initialProfiles: Profile[];
  totalCount: number;
}

type SortOrder = "name_asc" | "name_desc" | "email_asc" | "email_desc";
const ITEMS_PER_PAGE = 10;

export function UserManagementClient({
  initialProfiles,
  totalCount,
}: UserManagementClientProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader } = useLoader();

  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("name_asc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter & Sort logic
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...profiles];

    // Search query filter (email or full_name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.full_name && u.full_name.toLowerCase().includes(q))
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      result = result.filter(
        (u) => (u.role ? String(u.role).toLowerCase() : "") === roleFilter.toLowerCase()
      );
    }

    // Sort order
    result.sort((a, b) => {
      if (sortOrder === "name_asc" || sortOrder === "name_desc") {
        const nameA = (a.full_name || a.email || "").toLowerCase();
        const nameB = (b.full_name || b.email || "").toLowerCase();
        return sortOrder === "name_asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      if (sortOrder === "email_asc" || sortOrder === "email_desc") {
        const emailA = (a.email || "").toLowerCase();
        const emailB = (b.email || "").toLowerCase();
        return sortOrder === "email_asc"
          ? emailA.localeCompare(emailB)
          : emailB.localeCompare(emailA);
      }
      return 0;
    });

    return result;
  }, [profiles, searchQuery, roleFilter, sortOrder]);

  // Total pages & paginated slice
  const totalPages = Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedUsers, currentPage]);

  // Role change handler
  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsOpenLoader(true);
    try {
      const { data, error } = await updateProfileRole(userId, newRole);
      if (error || !data) {
        throw new Error(error || "Failed to update role");
      }

      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, role: newRole as any } : p))
      );

      showNotification("User role updated successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update user role";
      showNotification(msg);
    } finally {
      setIsOpenLoader(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setSortOrder("name_asc");
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen py-12 px-6 sm:px-10 lg:px-16 space-y-8 select-none text-slate-100 font-sans relative max-w-7xl mx-auto">
      {/* Top Header Section */}
      <div className="space-y-6 border-b border-white/12 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BackButton href="/" label="BACK TO HOME" />

          <span className="px-3.5 py-1.5 rounded-md bg-[#000000] border border-[#3be1fe]/50 text-[#3be1fe] font-mono font-bold text-xs uppercase tracking-wider shadow-sm self-start sm:self-auto">
            {filteredAndSortedUsers.length}{" "}
            {filteredAndSortedUsers.length === 1 ? "USER" : "USERS"} TOTAL
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold text-[#3be1fe] uppercase tracking-widest block">
            ADMINISTRATION PORTAL
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            User Management &amp; <span className="text-[#3be1fe]">Role Registry</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium mt-2">
            CONTROL USER ACCOUNTS, ASSIGN SYSTEM ROLES &amp; MANAGE ACCESS PERMISSIONS
          </p>
        </div>
      </div>

      {/* Controls Bar: Search, Role Filter, Sort Select */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#121212] p-4 rounded-md border border-white/12 shadow-xl font-mono text-xs items-center">
        {/* Search Input (md:col-span-5) */}
        <div className="relative md:col-span-5">
          <div className="relative flex items-center w-full bg-[#050505] border border-white/15 rounded-md focus-within:border-[#3be1fe]/70 transition-colors text-white">
            <span className="pl-3.5 text-slate-400 flex items-center shrink-0">
              <svg className="w-4 h-4 text-[#3be1fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by full name or email address..."
              className="w-full bg-transparent text-white placeholder-slate-500 text-xs p-3 outline-none border-none font-mono"
            />
          </div>
        </div>

        {/* Role Filter Select (md:col-span-3) */}
        <div className="relative md:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#050505] border border-white/15 rounded-md text-white text-xs p-3 pr-8 outline-none focus:border-[#3be1fe]/70 transition-colors cursor-pointer uppercase font-mono appearance-none"
          >
            <option value="all">FILTER BY: ALL ROLES</option>
            <option value={PROFILE_ROLE.STUDENT}>ROLE: STUDENT</option>
            <option value={PROFILE_ROLE.JUDGES}>ROLE: JUDGE</option>
            <option value={PROFILE_ROLE.ADMIN}>ROLE: ADMIN</option>
          </select>
          <svg
            className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Sort Select (md:col-span-3) */}
        <div className="relative md:col-span-3">
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as SortOrder);
              setCurrentPage(1);
            }}
            className="w-full bg-[#050505] border border-white/15 rounded-md text-white text-xs p-3 pr-8 outline-none focus:border-[#3be1fe]/70 transition-colors cursor-pointer uppercase font-mono appearance-none"
          >
            <option value="name_asc">SORT: NAME A TO Z</option>
            <option value="name_desc">SORT: NAME Z TO A</option>
            <option value="email_asc">SORT: EMAIL A TO Z</option>
            <option value="email_desc">SORT: EMAIL Z TO A</option>
          </select>
          <svg
            className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Reset Filter Button */}
        {(searchQuery || roleFilter !== "all" || sortOrder !== "name_asc") && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="md:col-span-1 text-[10px] font-bold font-mono text-[#3be1fe] hover:underline uppercase tracking-wider text-center cursor-pointer"
          >
            RESET
          </button>
        )}
      </div>

      {/* Users Table Container */}
      <div className="bg-[#121212] border border-white/12 rounded-md overflow-x-auto shadow-2xl">
        <table className="w-full border-collapse font-mono text-xs text-slate-200 text-left min-w-[700px]">
          <thead>
            <tr className="border-b border-white/12 bg-[#000000] text-[#3be1fe] select-none text-[11px] uppercase tracking-wider font-bold">
              <th className="py-3.5 px-4 w-16 text-center">NO.</th>
              <th className="py-3.5 px-4 min-w-[200px]">FULL NAME</th>
              <th className="py-3.5 px-4 min-w-[240px]">EMAIL ADDRESS</th>
              <th className="py-3.5 px-4 w-44 text-center border-l border-white/10">USER ROLE</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => {
                  const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                  const formattedIndex = String(globalIndex).padStart(2, "0");
                  const userRole = user.role ? String(user.role).toLowerCase() : PROFILE_ROLE.STUDENT;

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-b border-white/10 last:border-0 hover:bg-white/[0.04] transition-colors"
                    >
                      {/* Sequential Index Number */}
                      <td className="py-3 px-4 text-center text-slate-500 font-mono text-xs font-semibold">
                        {formattedIndex}.
                      </td>

                      {/* Full Name */}
                      <td className="py-3 px-4 font-bold text-white max-w-[240px] truncate font-sans text-xs">
                        {user.full_name || "Unnamed User"}
                      </td>

                      {/* Email Address */}
                      <td className="py-3 px-4 text-slate-300 font-mono text-xs truncate">
                        {user.email || "N/A"}
                      </td>

                      {/* Role Select Dropdown */}
                      <td className="py-3 px-4 text-center border-l border-white/10">
                        <div className="relative inline-block w-36">
                          <select
                            value={userRole}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="w-full bg-[#050505] border border-white/15 rounded-md text-xs p-2 pr-7 text-white font-mono uppercase font-bold outline-none focus:border-[#3be1fe]/70 cursor-pointer appearance-none"
                          >
                            <option value={PROFILE_ROLE.STUDENT}>STUDENT</option>
                            <option value={PROFILE_ROLE.JUDGES}>JUDGE</option>
                            <option value={PROFILE_ROLE.ADMIN}>ADMIN</option>
                          </select>
                          <svg
                            className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-12 text-center text-slate-400 italic select-none text-xs font-mono"
                  >
                    NO USER PROFILES MATCHING ACTIVE FILTER PARAMETERS
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

export default UserManagementClient;
