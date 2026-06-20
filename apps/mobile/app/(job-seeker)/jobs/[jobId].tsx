import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { jobsApi, applicationsApi, authApi } from "@/lib/api";
import { formatSalary } from "@hedhunter/shared";
import type { JobPost } from "@hedhunter/shared";

export default function JobDetailScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const [job, setJob]                   = useState<JobPost | null>(null);
  const [loading, setLoading]           = useState(true);
  const [applying, setApplying]         = useState(false);
  const [registrationPaid, setRegistrationPaid] = useState(true);
  const [alreadyApplied, setAlreadyApplied]     = useState(false);

  useEffect(() => {
    Promise.all([jobsApi.get(jobId), authApi.me()])
      .then(([jobRes, meRes]) => {
        setJob(jobRes.data.job);
        setRegistrationPaid(meRes.data.jobSeekerProfile?.registrationPaid ?? false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId]);

  async function handleApply() {
    if (!registrationPaid) {
      router.push("/(job-seeker)/payment" as never);
      return;
    }
    setApplying(true);
    try {
      const res = await applicationsApi.apply({ jobPostId: jobId });
      const applicationId = res.data.id;
      setAlreadyApplied(true);
      router.push(`/(job-seeker)/applications/${applicationId}` as never);
    } catch (e: any) {
      const msg = e?.response?.data?.error ?? "Please try again.";
      if (msg === "Already applied") {
        setAlreadyApplied(true);
        Alert.alert("Already applied", "You have already applied for this position.");
      } else {
        Alert.alert("Could not apply", msg);
      }
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <Screen scroll={false}>
        <Header title="Job Details" showBack />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#3a6fe0" size="large" />
        </View>
      </Screen>
    );
  }

  if (!job) {
    return (
      <Screen><Header title="Not found" showBack /><Text className="text-muted">Job not found.</Text></Screen>
    );
  }

  return (
    <Screen>
      <Header title={job.title} showBack />

      <View className="gap-4 mt-2">
        {/* Company + meta */}
        <Card className="gap-3">
          <Text className="text-text font-semibold text-lg">{job.company?.name ?? "Company"}</Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="location-outline" size={15} color="#64748b" />
              <Text className="text-muted text-sm">{job.location}</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="people-outline" size={15} color="#64748b" />
              <Text className="text-muted text-sm">{job.openPositions} positions</Text>
            </View>
          </View>
          <View className="flex-row gap-2 flex-wrap">
            {job.isRemote     && <View className="bg-cyan-500/10 border border-cyan-500/30 rounded-full px-2.5 py-1"><Text className="text-cyan-700 text-xs">Remote</Text></View>}
            {job.isHybrid     && <View className="bg-blue-500/10 border border-blue-500/30 rounded-full px-2.5 py-1"><Text className="text-blue-600 text-xs">Hybrid</Text></View>}
            {(job as any).isOnLocation && <View className="bg-purple-500/10 border border-purple-500/30 rounded-full px-2.5 py-1"><Text className="text-purple-700 text-xs">On Location</Text></View>}
            {job.isOffice     && <View className="bg-orange-500/10 border border-orange-500/30 rounded-full px-2.5 py-1"><Text className="text-orange-600 text-xs">Office</Text></View>}
          </View>
          <View className="flex-row items-center gap-2 pt-2 border-t border-border">
            <Ionicons name="cash-outline" size={16} color="#3a6fe0" />
            <MonoText style={{ color: "#3a6fe0" }}>{formatSalary(job.salaryMin, job.salaryMax)}</MonoText>
          </View>
        </Card>

        {/* Description */}
        <Card className="gap-2">
          <Text className="text-subtle font-semibold text-sm">Description</Text>
          <Text className="text-subtle text-sm leading-relaxed">{job.description}</Text>
        </Card>

        {/* Required qualifications */}
        <Card className="gap-2">
          <Text className="text-subtle font-semibold text-sm">Required qualifications</Text>
          <Text className="text-subtle text-sm leading-relaxed">{job.requiredQualifications}</Text>
        </Card>

        {job.preferredQualifications && (
          <Card className="gap-2">
            <Text className="text-subtle font-semibold text-sm">Preferred qualifications</Text>
            <Text className="text-subtle text-sm leading-relaxed">{job.preferredQualifications}</Text>
          </Card>
        )}

        {/* Privacy reminder */}
        <Card className="flex-row gap-3 items-start bg-primary/5 border-primary/20">
          <Ionicons name="shield-checkmark" size={20} color="#5b8def" style={{ marginTop: 1 }} />
          <Text className="text-subtle text-sm flex-1 leading-relaxed">
            Your identity will be anonymized before this employer sees your application. They will only see your skills, experience and interview score.
          </Text>
        </Card>

        {alreadyApplied ? (
          <Card className="flex-row items-center gap-3 bg-green-500/10 border-green-500/30">
            <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
            <Text style={{ color: "#4ade80", fontWeight: "500" }}>Already applied</Text>
          </Card>
        ) : !registrationPaid ? (
          <View className="gap-2">
            <Button onPress={handleApply} fullWidth size="lg" variant="secondary">
              Apply (registration required)
            </Button>
            <Card className="flex-row items-center gap-3 bg-primary/10 border-primary/30">
              <Ionicons name="lock-closed" size={18} color="#5b8def" />
              <View className="flex-1">
                <Text style={{ color: "#5b8def", fontWeight: "500", fontSize: 14 }}>Registration required</Text>
                <Text style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>Pay $10/year to unlock job applications.</Text>
              </View>
              <Pressable onPress={() => router.push("/(job-seeker)/payment" as never)}>
                <Text style={{ color: "#3a6fe0", fontSize: 13, fontWeight: "500" }}>Pay $10 →</Text>
              </Pressable>
            </Card>
          </View>
        ) : (
          <Button onPress={handleApply} loading={applying} fullWidth size="lg">
            Apply anonymously →
          </Button>
        )}
      </View>
    </Screen>
  );
}
