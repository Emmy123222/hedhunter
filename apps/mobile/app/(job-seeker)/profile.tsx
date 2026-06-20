import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { useAuth } from "@/contexts/AuthContext";
import { accountApi } from "@/lib/api";

export default function SeekerProfileScreen() {
  const { user, logout } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting]           = useState(false);
  const [delError, setDelError]           = useState<string | null>(null);

  async function deleteAccount() {
    setDeleting(true); setDelError(null);
    try {
      await accountApi.deleteAccount();
      await logout();
    } catch (e: any) {
      setDelError(e?.response?.data?.error ?? "Could not delete account.");
      setDeleting(false);
    }
  }

  const menuItems = [
    { icon: "document-attach-outline", label: "Upload / update resume",    href: "/(job-seeker)/resume-upload" },
    { icon: "mail-outline",            label: "Upload / update cover letter", href: "/(job-seeker)/cover-letter-upload" },
    { icon: "eye-outline",             label: "Preview anonymized profile", href: "/(job-seeker)/anonymized-preview" },
    { icon: "briefcase-outline",       label: "My applications",           href: "/(job-seeker)/applications" },
    { icon: "gift-outline",            label: "My offers",                 href: "/(job-seeker)/offers" },
  ];

  return (
    <Screen>
      <Header title="Profile" />

      {/* Identity card */}
      <Card className="items-center gap-3 py-6 mb-6">
        <View className="w-16 h-16 rounded-2xl bg-primary/20 items-center justify-center">
          <Ionicons name="person" size={30} color="#5b8def" />
        </View>
        <View className="items-center gap-1">
          <Text className="text-text font-semibold text-lg">{user?.email}</Text>
          <MonoText style={{ color: "#3a6fe0" }}>Identity protected · Anonymous mode</MonoText>
        </View>
      </Card>

      {/* Menu */}
      <Card className="gap-0 p-0 overflow-hidden mb-4">
        {menuItems.map((item, i) => (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href as never)}
            className="flex-row items-center gap-3 px-4 py-3.5 active:bg-black/5"
            style={i > 0 ? { borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)" } : {}}
          >
            <Ionicons name={item.icon as any} size={20} color="#64748b" />
            <Text className="text-subtle flex-1">{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#64748b" />
          </Pressable>
        ))}
      </Card>

      {/* Legal */}
      <Card className="p-0 overflow-hidden mb-4">
        {[
          { icon: "shield-checkmark-outline", label: "Privacy Policy", href: "/legal/privacy" },
          { icon: "document-text-outline",    label: "Terms of Service", href: "/legal/terms" },
        ].map((item, i) => (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href as never)}
            className="flex-row items-center gap-3 px-4 py-3.5 active:bg-black/5"
            style={i > 0 ? { borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)" } : {}}
          >
            <Ionicons name={item.icon as any} size={20} color="#64748b" />
            <Text className="text-subtle flex-1">{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#64748b" />
          </Pressable>
        ))}
      </Card>

      {/* Logout */}
      <Card className="p-0 overflow-hidden">
        <Pressable onPress={logout} className="flex-row items-center gap-3 px-4 py-3.5 active:bg-red-500/10">
          <Ionicons name="log-out-outline" size={20} color="#f87171" />
          <Text className="text-red-400 flex-1">Sign out</Text>
        </Pressable>
      </Card>

      {/* Delete account */}
      <Pressable
        onPress={() => { setConfirmDelete(true); setDelError(null); }}
        style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12 }}
      >
        <Ionicons name="trash-outline" size={15} color="#ef4444" />
        <Text style={{ color: "#ef4444", fontSize: 13 }}>Delete account</Text>
      </Pressable>

      {/* Delete confirm modal */}
      <Modal visible={confirmDelete} animationType="fade" transparent statusBarTranslucent onRequestClose={() => setConfirmDelete(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", padding: 24 }}>
          <View style={{ backgroundColor: "#f8fafc", borderRadius: 24, padding: 28, width: "100%" }}>
            <Text style={{ color: "#0f172a", fontSize: 20, fontWeight: "600", marginBottom: 8 }}>Delete account?</Text>
            <Text style={{ color: "#64748b", fontSize: 14, lineHeight: 20, marginBottom: delError ? 8 : 24 }}>
              This will permanently delete your account and all associated data. This cannot be undone.
            </Text>
            {delError && <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 16 }}>{delError}</Text>}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable
                onPress={() => setConfirmDelete(false)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 14, backgroundColor: "#ffffff", alignItems: "center" }}
              >
                <Text style={{ color: "#475569" }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={deleteAccount}
                disabled={deleting}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 14, backgroundColor: "#ef4444", alignItems: "center", opacity: deleting ? 0.6 : 1 }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>{deleting ? "Deleting…" : "Yes, delete"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
