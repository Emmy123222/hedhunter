import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MonoText } from "@/components/ui/MonoText";
import { useAuth } from "@/contexts/AuthContext";
import { applicationsApi, authApi } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";
import type { Application } from "@hedhunter/shared";

export default function JobSeekerDashboard() {
  const { logout } = useAuth();
  const [applications, setApplications]       = useState<Application[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [registrationPaid, setRegistrationPaid] = useState(true); // default true to avoid flash
  const [applicantCode, setApplicantCode]     = useState<string>("");

  useEffect(() => {
    applicationsApi.list()
      .then(r => setApplications(r.data.applications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));

    authApi.me()
      .then(r => {
        setRegistrationPaid(r.data.jobSeekerProfile?.registrationPaid ?? false);
        setApplicantCode(r.data.jobSeekerProfile?.applicantCode ?? "");
      })
      .catch(() => {});
  }, []);

  const bestScore = applications.reduce((max, a: any) => Math.max(max, a.totalScore ?? 0), 0);

  const stats = [
    { label: "Applied",     value: applications.length,                                                               color: "#5b8def" },
    { label: "Active",      value: applications.filter(a => !["HIRED","REJECTED"].includes(a.status)).length,          color: "#3a6fe0" },
    { label: "Offers",      value: applications.filter(a => ["OFFER_SENT","HIRED"].includes(a.status)).length,         color: "#0f172a" },
    { label: "Best Score",  value: applications.length > 0 ? bestScore.toFixed(1) : "—",                              color: "#4ade80" },
  ];

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <MonoText style={{ color: "#3a6fe0" }}>Job Seeker</MonoText>
          <Text className="text-text text-2xl font-semibold mt-1">Dashboard</Text>
          {applicantCode ? <MonoText style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>{applicantCode}</MonoText> : null}
        </View>
        <Pressable onPress={logout} className="p-2 active:opacity-60">
          <Ionicons name="log-out-outline" size={22} color="#64748b" />
        </Pressable>
      </View>

      {/* Registration payment banner */}
      {!registrationPaid && (
        <Pressable
          onPress={() => router.push("/(job-seeker)/payment" as never)}
          className="flex-row items-center justify-between p-4 rounded-2xl mb-4 active:opacity-80"
          style={{ backgroundColor: "rgba(91,141,239,0.07)", borderWidth: 1, borderColor: "rgba(91,141,239,0.2)" }}
        >
          <View className="flex-1">
            <Text style={{ color: "#0f172a", fontWeight: "600", fontSize: 14 }}>Registration required</Text>
            <Text style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>Pay the $10 annual fee to start applying for jobs.</Text>
          </View>
          <Text style={{ color: "#3a6fe0", fontWeight: "500", fontSize: 13, marginLeft: 12 }}>Pay $10 →</Text>
        </Pressable>
      )}

      {/* Stats row */}
      <View className="flex-row gap-3 mb-6">
        {stats.map(s => (
          <Card key={s.label} className="flex-1 items-center py-3 px-0">
            <Text style={{ fontSize: 20, fontWeight: "700", color: s.color }}>{s.value}</Text>
            <MonoText style={{ marginTop: 2, fontSize: 10 }}>{s.label}</MonoText>
          </Card>
        ))}
      </View>

      {/* Quick actions */}
      <Text className="text-subtle text-sm font-medium mb-3">Quick actions</Text>
      <View className="flex-row gap-3 mb-6">
        {[
          { icon: "search",          label: "Browse Jobs",    href: "/(job-seeker)/jobs" },
          { icon: "document-attach", label: "Upload Resume",  href: "/(job-seeker)/resume-upload" },
          { icon: "eye",             label: "Anon Preview",   href: "/(job-seeker)/anonymized-preview" },
        ].map(a => (
          <Pressable
            key={a.href}
            onPress={() => router.push(a.href as never)}
            className="flex-1 bg-surface border border-border rounded-2xl items-center py-4 gap-2 active:opacity-70"
          >
            <Ionicons name={a.icon as any} size={22} color="#3a6fe0" />
            <Text className="text-subtle text-xs text-center">{a.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Recent applications */}
      <Text className="text-text text-sm font-medium mb-3">Recent applications</Text>
      {loading ? (
        <ActivityIndicator color="#3a6fe0" />
      ) : applications.length === 0 ? (
        <Card className="items-center py-8 gap-2">
          <Ionicons name="briefcase-outline" size={32} color="#64748b" />
          <Text className="text-muted text-sm">No applications yet</Text>
          <Pressable onPress={() => router.push("/(job-seeker)/jobs" as never)} className="mt-1">
            <Text className="text-primary text-sm">Browse open jobs →</Text>
          </Pressable>
        </Card>
      ) : (
        <View className="gap-3">
          {applications.slice(0, 4).map(app => (
            <Pressable
              key={app.id}
              onPress={() => router.push(`/(job-seeker)/applications/${app.id}` as never)}
              className="active:opacity-70"
            >
              <Card className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-text font-medium" numberOfLines={1}>
                    {(app as any).jobPost?.title ?? "Position"}
                  </Text>
                  <Text className="text-muted text-xs mt-0.5">
                    {(app as any).jobPost?.company?.name ?? "Company"} · {formatDate(app.createdAt)}
                  </Text>
                </View>
                <View className="ml-3 items-end gap-1">
                  <Badge status={app.status} label={app.status.replace("_", " ")} />
                  {(app as any).totalScore != null && (
                    <MonoText style={{ color: "#3a6fe0" }}>{(app as any).totalScore.toFixed(1)} / 5</MonoText>
                  )}
                </View>
              </Card>
            </Pressable>
          ))}
          {applications.length > 4 && (
            <Pressable onPress={() => router.push("/(job-seeker)/applications" as never)} className="items-center py-2">
              <Text className="text-primary text-sm">View all {applications.length} applications →</Text>
            </Pressable>
          )}
        </View>
      )}
    </Screen>
  );
}
