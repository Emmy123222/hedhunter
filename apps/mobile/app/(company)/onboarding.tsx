import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { companyApi } from "@/lib/api";

interface Step {
  label: string;
  done:  boolean;
  href:  string | null;
}

export default function CompanyOnboardingScreen() {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps]     = useState<Step[]>([]);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    companyApi.getProfile()
      .then(r => {
        const profile = r.data.profile ?? r.data.company ?? {};
        const s: Step[] = [
          { label: "Create account",                              done: true,                        href: null },
          { label: "Subscribe to annual plan ($100/yr)",          done: !!profile.annualPaid,        href: "/(company)/payment" },
          { label: "Complete profile & sign merit pledge",        done: !!profile.meritPledgeSigned, href: "/(company)/profile" },
          { label: "Create your first job post",                  done: false,                       href: "/(company)/jobs/create" },
        ];
        setSteps(s);
        setAllDone(s.every(step => step.done));
      })
      .catch(() => {
        // Fallback: show all steps as pending
        setSteps([
          { label: "Create account",                              done: true,  href: null },
          { label: "Subscribe to annual plan ($100/yr)",          done: false, href: "/(company)/payment" },
          { label: "Complete profile & sign merit pledge",        done: false, href: "/(company)/profile" },
          { label: "Create your first job post",                  done: false, href: "/(company)/jobs/create" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen>
      <Header title="Get started" subtitle="Complete these steps to start hiring" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#3a6fe0" size="large" />
        </View>
      ) : (
        <View className="gap-4 mt-4">
          <Card className="gap-0">
            {steps.map((step, i) => (
              <View
                key={i}
                className="flex-row items-center gap-3 py-4"
                style={{ borderBottomWidth: i < steps.length - 1 ? 1 : 0, borderBottomColor: "rgba(0,0,0,0.07)" }}
              >
                {step.done
                  ? <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
                  : <Ionicons name="ellipse-outline" size={20} color="#94a3b8" />
                }
                <Text
                  className="flex-1 text-sm"
                  style={{ color: step.done ? "#64748b" : "#0f172a" }}
                >
                  {step.label}
                </Text>
                {!step.done && step.href && (
                  <Pressable
                    onPress={() => router.push(step.href as never)}
                    className="active:opacity-70"
                  >
                    <Text style={{ color: "#3a6fe0", fontSize: 13, fontWeight: "500" }}>Start →</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </Card>

          {allDone && (
            <View
              className="flex-row items-center gap-3 p-4 rounded-2xl"
              style={{ backgroundColor: "rgba(74,222,128,0.06)", borderWidth: 1, borderColor: "rgba(74,222,128,0.25)" }}
            >
              <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
              <View className="flex-1">
                <Text style={{ color: "#0f172a", fontWeight: "600", fontSize: 14 }}>You're all set!</Text>
                <Text style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>Your account is active and ready to hire.</Text>
              </View>
            </View>
          )}

          <Button
            onPress={() => router.replace("/(company)/dashboard" as never)}
            variant="secondary"
            fullWidth
          >
            Go to dashboard →
          </Button>
        </View>
      )}
    </Screen>
  );
}
