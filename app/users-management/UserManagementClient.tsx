"use client";

import React, { useState, useMemo } from "react";
import BackButton from "@/app/components/BackButton";
import Pagination from "@/components/Pagination";
import { Profile } from "@/app/types/profile";
import { PROFILE_ROLE } from "@/app/types/enum";
import { updateProfileRole } from "@/app/actions/profile";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";
import UserFilters, { SortOrder } from "./components/UserFilters";
import UserTable from "./components/UserTable";

interface UserManagementClientProps {
  initialProfiles: Profile[];
  totalCount: number;
}

const ITEMS_PER_PAGE = 15;

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
        (u) =>
          (u.role ? String(u.role).toLowerCase() : "") ===
          roleFilter.toLowerCase()
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
      if (sortOrder === "newest" || sortOrder === "oldest") {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      }
      return 0;
    });

    return result;
  }, [profiles, searchQuery, roleFilter, sortOrder]);

  // Total pages & paginated slice
  const totalPages = Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedUsers.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedUsers, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // Role change handler
  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsOpenLoader(true);
    try {
      const { data, error } = await updateProfileRole(
        userId,
        newRole as PROFILE_ROLE
      );
      if (error || !data) {
        throw new Error(error || "Failed to update role");
      }

      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, role: newRole as any } : p))
      );

      showNotification("User role updated successfully");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update user role";
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

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    roleFilter !== "all" ||
    sortOrder !== "name_asc";

  return (
    <div className="w-full flex flex-col gap-8 select-text">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <BackButton href="/" label="BACK TO HOME" className="mb-0" />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
          <div className="flex gap-4 items-stretch">
            <div className="w-[3px] bg-[#00ffec]" />
            <div className="flex flex-col gap-1.5">
              <h1 className="text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
                USER MANAGEMENT
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Area Component */}
      <UserFilters
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        roleFilter={roleFilter}
        setRoleFilter={(r) => {
          setRoleFilter(r);
          setCurrentPage(1);
        }}
        sortOrder={sortOrder}
        setSortOrder={(s) => {
          setSortOrder(s);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Users Database Table Section */}
      <div className="flex flex-col gap-4">
        {/* Table Metrics Bar */}
        <div className="flex items-center justify-between select-none">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
            <div className="w-[3px] h-3 bg-[#00ffec]" />
            <span>01 MEMBER REGISTRY DATABASE</span>
          </div>
          <span className="font-mono text-[9px] text-[#83958d]">
            TOTAL MEMBERS: {filteredAndSortedUsers.length}
          </span>
        </div>

        {/* User Table Component */}
        <UserTable
          paginatedUsers={paginatedUsers}
          startIndex={startIndex}
          handleRoleChange={handleRoleChange}
        />

        {/* Dynamic Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default UserManagementClient;
