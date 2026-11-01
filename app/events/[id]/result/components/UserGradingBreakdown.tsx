"use client";

import React, { useState, useMemo } from "react";
import { UserGroupFinalScores } from "@/app/types/all_users_group";

interface UserGradingBreakdownProps {
  data: UserGroupFinalScores;
}

type Table1SortOption =
  | "score_desc"
  | "score_asc"
  | "evaluator_asc"
  | "evaluator_desc"
  | "group_asc"
  | "group_desc";

export function UserGradingBreakdown({ data }: UserGradingBreakdownProps) {
  const [selectedUser, setSelectedUser] = useState<string>("ALL");
  const [selectedGroup, setSelectedGroup] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [table1Sort, setTable1Sort] = useState<Table1SortOption>("score_desc");

  // Single-pass extraction of users, groups, criteria, and O(1) grade lookups
  const {
    uniqueUsers,
    uniqueGroups,
    uniqueCriteria,
    criteriaGradeLookup,
    scoreMatrixLookup,
  } = useMemo(() => {
    const usersSet = new Set<string>();
    const groupsSet = new Set<string>();
    const criteriaMap = new Map<string, string>();
    const matrixLookup = new Map<string, number>();
    const gradeLookup = new Map<string, number | null>();

    (data || []).forEach((item) => {
      if (item.full_name) usersSet.add(item.full_name);
      if (item.group_name) groupsSet.add(item.group_name);

      if (item.group_name && item.full_name) {
        matrixLookup.set(
          `${item.group_name}___${item.full_name}`,
          Number(item.user_group_final_score) || 0
        );
      }

      (item.grading_details || []).forEach((detail) => {
        if (detail.criteria_id && !criteriaMap.has(detail.criteria_id)) {
          criteriaMap.set(detail.criteria_id, detail.criteria_name || "CRITERIA");
        }
        if (item.user_id && item.group_id && detail.criteria_id) {
          gradeLookup.set(
            `${item.user_id}_${item.group_id}_${detail.criteria_id}`,
            detail.user_grade ?? null
          );
        }
      });
    });

    return {
      uniqueUsers: Array.from(usersSet).sort(),
      uniqueGroups: Array.from(groupsSet).sort(),
      uniqueCriteria: Array.from(criteriaMap.entries()).map(([id, name]) => ({
        id,
        name,
      })),
      criteriaGradeLookup: gradeLookup,
      scoreMatrixLookup: matrixLookup,
    };
  }, [data]);

  // Filtered and sorted data for Table 1 (by Evaluator + Search + Sort)
  const filteredAndSortedRows = useMemo(() => {
    let list = data || [];

    // Filter by selected user
    if (selectedUser !== "ALL" && selectedUser) {
      list = list.filter((item) => item.full_name === selectedUser);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          (item.full_name || "").toLowerCase().includes(q) ||
          (item.group_name || "").toLowerCase().includes(q)
      );
    }

    // Sort rows
    const sorted = [...list];
    sorted.sort((a, b) => {
      const scoreA = Number(a.user_group_final_score) || 0;
      const scoreB = Number(b.user_group_final_score) || 0;
      const evalA = (a.full_name || "").toLowerCase();
      const evalB = (b.full_name || "").toLowerCase();
      const grpA = (a.group_name || "").toLowerCase();
      const grpB = (b.group_name || "").toLowerCase();

      switch (table1Sort) {
        case "score_desc":
          return scoreB - scoreA;
        case "score_asc":
          return scoreA - scoreB;
        case "evaluator_asc":
          return evalA.localeCompare(evalB);
        case "evaluator_desc":
          return evalB.localeCompare(evalA);
        case "group_asc":
          return grpA.localeCompare(grpB);
        case "group_desc":
          return grpB.localeCompare(grpA);
        default:
          return 0;
      }
    });

    return sorted;
  }, [data, selectedUser, searchQuery, table1Sort]);

  // Filtered groups for Table 2 (by Group)
  const filteredGroupRows = useMemo(() => {
    if (selectedGroup === "ALL" || !selectedGroup) {
      return uniqueGroups;
    }
    return uniqueGroups.filter((g) => g === selectedGroup);
  }, [uniqueGroups, selectedGroup]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-8 text-center space-y-2 shadow-xl font-mono">
        <p className="text-xs font-bold text-[#e8e1df] uppercase tracking-wider">
          NO USER EVALUATION RECORDS AVAILABLE
        </p>
        <p className="text-[10px] text-[#83958d]">
          Evaluator scoring records will appear here once submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 font-mono">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-4 select-none">
        <div className="w-[3px] h-8 bg-[#00ffec]" />
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-[#e8e1df] tracking-tight uppercase">
            User Evaluation Breakdown
          </h2>
          <span className="text-[9px] text-[#83958d] uppercase tracking-widest">
            Detailed criteria grades and evaluator matrix across registered teams
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABLE 1: Filter by User -> User, Group, Criteria Grades, Final Score */}
      {/* ========================================================================= */}
      <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-5 sm:p-6 flex flex-col gap-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ffec]/50" />

        {/* Filter Controls & Subsection Header */}
        <div className="flex flex-col gap-4 border-b border-white/5 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-baseline gap-2.5">
              <span className="text-xs font-bold text-[#e8e1df] uppercase tracking-wider">
                Evaluator Criteria Breakdown
              </span>
              <span className="text-[10px] text-[#83958d]">
                ({filteredAndSortedRows.length} {filteredAndSortedRows.length === 1 ? "RECORD" : "RECORDS"})
              </span>
            </div>

            {/* User Select Filter */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="user-evaluator-filter"
                className="text-[7.5px] font-bold text-[#83958d] uppercase tracking-widest shrink-0"
              >
                EVALUATOR:
              </label>
              <div className="relative flex items-center">
                <select
                  id="user-evaluator-filter"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-2.5 pr-8 rounded-sm outline-none focus:border-[#00ffec]/50 transition-colors appearance-none cursor-pointer uppercase font-bold"
                >
                  <option value="ALL">ALL EVALUATORS ({uniqueUsers.length})</option>
                  {uniqueUsers.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-3.5 h-3.5 absolute right-2.5 text-[#83958d] pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search and Sort Sub-bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Search Input */}
            <div className="relative flex items-center flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search evaluator or group name..."
                className="w-full bg-[#151312] text-[#e8e1df] border border-white/5 rounded-sm pl-9 pr-4 py-2 text-xs outline-none focus:border-[#00ffec]/50 transition-colors font-mono placeholder:text-[#83958d]/50"
              />
              <svg
                className="w-3.5 h-3.5 absolute left-3 text-[#00ffec] pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <label className="text-[7.5px] font-mono text-[#83958d] uppercase font-bold tracking-widest">
                SORT BY:
              </label>
              <div className="relative flex items-center">
                <select
                  value={table1Sort}
                  onChange={(e) => setTable1Sort(e.target.value as Table1SortOption)}
                  className="bg-[#151312] text-[#e8e1df] border border-white/5 rounded-sm p-2 pr-8 text-xs font-bold font-mono outline-none uppercase cursor-pointer focus:border-[#00ffec]/50 appearance-none"
                >
                  <option value="score_desc">FINAL SCORE (HIGH TO LOW)</option>
                  <option value="score_asc">FINAL SCORE (LOW TO HIGH)</option>
                  <option value="evaluator_asc">EVALUATOR (A - Z)</option>
                  <option value="evaluator_desc">EVALUATOR (Z - A)</option>
                  <option value="group_asc">GROUP NAME (A - Z)</option>
                  <option value="group_desc">GROUP NAME (Z - A)</option>
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
            </div>
          </div>
        </div>

        {/* Table 1 Data View */}
        <div className="bg-[#1d1b1a] border border-white/5 rounded-sm overflow-x-auto shadow-xl">
          <table className="w-full border-collapse font-mono text-[10px] text-[#b9cbc2] text-left min-w-[750px]">
            <thead>
              <tr className="border-b border-white/5 bg-[#151312] text-[#83958d] select-none text-[8.5px] uppercase tracking-wider font-bold">
                <th className="p-4 font-bold text-center w-14">NO</th>
                <th className="p-4 font-bold min-w-[160px]">EVALUATOR</th>
                <th className="p-4 font-bold min-w-[160px]">GROUP</th>
                {uniqueCriteria.map((crit) => (
                  <th
                    key={crit.id}
                    className="p-4 text-center whitespace-nowrap min-w-[120px] align-top"
                  >
                    <div className="flex flex-col items-center justify-start text-center w-full">
                      <span
                        className="block font-bold text-[#83958d] text-[8.5px] uppercase tracking-wider text-center"
                        title={crit.name}
                      >
                        {crit.name.toUpperCase()}
                      </span>
                      <span className="block text-[7.5px] font-medium text-[#83958d]/70 mt-0.5 text-center uppercase tracking-widest">
                        GRADE
                      </span>
                    </div>
                  </th>
                ))}
                <th className="p-4 font-bold text-center w-36">FINAL SCORE</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedRows.length > 0 ? (
                filteredAndSortedRows.map((item, index) => {
                  const evaluatorName = item.full_name || "UNREGISTERED USER";
                  const groupName = item.group_name || "UNNAMED GROUP";
                  const finalScore =
                    typeof item.user_group_final_score === "number"
                      ? Number(item.user_group_final_score).toFixed(1)
                      : "0.0";

                  return (
                    <tr
                      key={`${item.user_id}_${item.group_id}_${index}`}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors"
                    >
                      {/* Index / NO */}
                      <td className="p-4 text-center font-bold text-[#83958d]">
                        {String(index + 1).padStart(3, "0")}
                      </td>

                      {/* Column 1: Evaluator Full Name */}
                      <td className="p-4 font-bold text-[#e8e1df] whitespace-nowrap">
                        {evaluatorName}
                      </td>

                      {/* Column 2: Group Name */}
                      <td className="p-4 text-[#b9cbc2] font-medium whitespace-nowrap">
                        {groupName}
                      </td>

                      {/* Column 3..n: Criteria Grades (O(1) Hash Map Lookup) */}
                      {uniqueCriteria.map((crit) => {
                        const gradeKey = `${item.user_id}_${item.group_id}_${crit.id}`;
                        const grade = criteriaGradeLookup.get(gradeKey);
                        const hasGrade = grade !== undefined && grade !== null;

                        return (
                          <td
                            key={crit.id}
                            className="p-4 text-center whitespace-nowrap"
                          >
                            {hasGrade ? (
                              <span className="font-bold text-[10px] text-[#e8e1df]">
                                {grade}
                              </span>
                            ) : (
                              <span className="text-[#83958d]/50 text-[9px]">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Column Final: Final Score */}
                      <td className="p-4 text-center w-36 whitespace-nowrap font-bold">
                        <span className="inline-block px-3 py-1 rounded-sm bg-[#151312] border border-white/5 text-[#00ffec] font-bold text-[9px] shadow-sm">
                          {finalScore}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4 + uniqueCriteria.length}
                    className="p-12 text-center text-[#83958d] select-none text-xs font-mono"
                  >
                    NO EVALUATION RECORDS MATCH THE SELECTED EVALUATOR OR SEARCH QUERY
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABLE 2: Filter by Group -> Group Name, Evaluator 1..n Final Scores */}
      {/* ========================================================================= */}
      <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-5 sm:p-6 flex flex-col gap-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ffec]/50" />

        {/* Filter Controls & Subsection Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-baseline gap-2.5">
            <span className="text-xs font-bold text-[#e8e1df] uppercase tracking-wider">
              Group Scoring Matrix by Evaluator
            </span>
            <span className="text-[10px] text-[#83958d]">
              ({filteredGroupRows.length} {filteredGroupRows.length === 1 ? "GROUP" : "GROUPS"})
            </span>
          </div>

          {/* Group Select Filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="group-matrix-filter"
              className="text-[7.5px] font-bold text-[#83958d] uppercase tracking-widest shrink-0"
            >
              GROUP:
            </label>
            <div className="relative flex items-center">
              <select
                id="group-matrix-filter"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-2.5 pr-8 rounded-sm outline-none focus:border-[#00ffec]/50 transition-colors appearance-none cursor-pointer uppercase font-bold"
              >
                <option value="ALL">ALL GROUPS ({uniqueGroups.length})</option>
                {uniqueGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <svg
                className="w-3.5 h-3.5 absolute right-2.5 text-[#83958d] pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Table 2 Matrix View */}
        <div className="bg-[#1d1b1a] border border-white/5 rounded-sm overflow-x-auto shadow-xl">
          <table className="w-full border-collapse font-mono text-[10px] text-[#b9cbc2] text-left min-w-[750px]">
            <thead>
              <tr className="border-b border-white/5 bg-[#151312] text-[#83958d] select-none text-[8.5px] uppercase tracking-wider font-bold">
                <th className="p-4 font-bold text-center w-14">NO</th>
                <th className="p-4 font-bold min-w-[180px]">GROUP NAME</th>
                {uniqueUsers.map((evaluator) => (
                  <th
                    key={evaluator}
                    className="p-4 text-center whitespace-nowrap min-w-[130px] align-top"
                  >
                    <div className="flex flex-col items-center justify-start text-center w-full">
                      <span
                        className="block font-bold text-[#83958d] text-[8.5px] uppercase tracking-wider text-center"
                        title={evaluator}
                      >
                        {evaluator.toUpperCase()}
                      </span>
                      <span className="block text-[7.5px] font-medium text-[#83958d]/70 mt-0.5 text-center uppercase tracking-widest">
                        FINAL SCORE
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredGroupRows.length > 0 ? (
                filteredGroupRows.map((groupName, index) => {
                  return (
                    <tr
                      key={groupName}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors"
                    >
                      {/* Index / NO */}
                      <td className="p-4 text-center font-bold text-[#83958d]">
                        {String(index + 1).padStart(3, "0")}
                      </td>

                      {/* Column 1: Group Name */}
                      <td className="p-4 font-bold text-[#e8e1df] whitespace-nowrap">
                        {groupName}
                      </td>

                      {/* Columns 2..n: Evaluator Final Scores (O(1) Hash Map Lookup) */}
                      {uniqueUsers.map((evaluator) => {
                        const key = `${groupName}___${evaluator}`;
                        const score = scoreMatrixLookup.get(key);
                        const hasScore = score !== undefined;

                        return (
                          <td
                            key={evaluator}
                            className="p-4 text-center whitespace-nowrap"
                          >
                            {hasScore ? (
                              <span className="inline-block px-2.5 py-1 rounded-sm bg-[#151312] border border-white/5 text-[#00ffec] font-bold text-[9px] shadow-sm">
                                {score.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-[#83958d]/50 text-[9px]">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={2 + uniqueUsers.length}
                    className="p-12 text-center text-[#83958d] select-none text-xs font-mono"
                  >
                    NO GROUPS MATCH THE ACTIVE FILTER
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserGradingBreakdown;
