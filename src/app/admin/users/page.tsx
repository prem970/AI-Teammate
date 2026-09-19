"use client";

import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Edit2,
  CheckCircle2,
  Lock,
  Search,
  KeyRound,
  AlertCircle,
} from "lucide-react";
import { getUsersStore } from "@/lib/adminMockData";
import { AdminUser, UserRole } from "@/lib/adminTypes";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(getUsersStore());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("support");
  const [newDepartment, setNewDepartment] = useState("");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRoleFilter === "all" || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, targetRole: UserRole) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: targetRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
        );
      }
    } catch {
      // ignore
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          role: newRole,
          department: newDepartment,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUsers((prev) => [data.user, ...prev]);
        setShowAddModal(false);
        setNewName("");
        setNewEmail("");
        setNewDepartment("");
      }
    } catch {
      // ignore
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "support":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "sales_ops":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "policy_owner":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "customer":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              User Identity & Role-Based Access Control
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              5 Role Segments
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Manage permissions across Customer, Support Ops, Sales Ops, Policy Owner, and Platform Admin.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold shadow-md transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision User</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-surface border border-surface-border flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-secondary border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs font-mono">
          <span className="text-slate-400 text-[11px] mr-1">Role:</span>
          {["all", "admin", "support", "sales_ops", "policy_owner", "customer"].map(
            (r) => (
              <button
                key={r}
                onClick={() => setSelectedRoleFilter(r)}
                className={`px-2.5 py-1 rounded uppercase tracking-wider transition-colors ${
                  selectedRoleFilter === r
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-surface-secondary"
                }`}
              >
                {r.replace("_", " ")}
              </button>
            )
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-surface border border-surface-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-secondary/80 border-b border-surface-border text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Name & Identity</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Department / Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Modify Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-300">
                    {u.id}
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white text-xs">{u.name}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getRoleBadge(
                        u.role
                      )}`}
                    >
                      {u.role.replace("_", " ")}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-sans text-xs">
                    {u.department}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-emerald-400 font-bold uppercase text-[10px]">
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {u.lastLogin}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u.id, e.target.value as UserRole)
                      }
                      className="bg-surface-secondary border border-surface-border text-slate-200 text-xs rounded p-1 font-mono focus:outline-none focus:border-cyan-400"
                    >
                      <option value="customer">customer</option>
                      <option value="support">support</option>
                      <option value="sales_ops">sales_ops</option>
                      <option value="policy_owner">policy_owner</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-surface-border rounded-2xl max-w-md w-full p-6 space-y-4 animate-page-enter">
            <h2 className="font-display text-lg font-bold text-white">
              Provision Platform User
            </h2>

            <form onSubmit={handleAddUser} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 uppercase text-[10px] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ananya Sen"
                  className="w-full p-2.5 rounded-lg bg-surface-secondary border border-surface-border text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase text-[10px] mb-1">
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. ananya@company.mock"
                  className="w-full p-2.5 rounded-lg bg-surface-secondary border border-surface-border text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase text-[10px] mb-1">
                  Role Assignment *
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-lg bg-surface-secondary border border-surface-border text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="support">support (Support Operations)</option>
                  <option value="sales_ops">sales_ops (Sales Operations)</option>
                  <option value="policy_owner">policy_owner (Policy Owner)</option>
                  <option value="admin">admin (Platform Administrator)</option>
                  <option value="customer">customer (Merchant Self-Serve)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 uppercase text-[10px] mb-1">
                  Department / Scope
                </label>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="e.g. Risk & Dispute Escalations"
                  className="w-full p-2.5 rounded-lg bg-surface-secondary border border-surface-border text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-secondary text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
