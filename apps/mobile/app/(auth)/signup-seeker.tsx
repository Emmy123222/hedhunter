import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { Screen } from "@/components/ui/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MonoText } from "@/components/ui/MonoText";

export default function SignupSeekerScreen() {
  const { register, loginWithGoogle } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);

  const { promptAsync, loading: googleLoading } = useGoogleAuth(async (idToken, uid, userEmail) => {
    try {
      await loginWithGoogle(idToken, uid, userEmail, "JOB_SEEKER");
    } catch (e: any) {
      Alert.alert("Google sign-up failed", e?.message ?? "Please try again.");
    }
  });

  async function handleSignup() {
    if (!email || !password) { Alert.alert("Fill in all fields"); return; }
    if (password !== confirm) { Alert.alert("Passwords do not match"); return; }
    if (password.length < 8) { Alert.alert("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      await register(email.trim().toLowerCase(), password, "JOB_SEEKER");
    } catch (e: any) {
      Alert.alert("Registration failed", e?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const busy = loading || googleLoading;

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 justify-center gap-8">
        <View className="gap-1">
          <MonoText style={{ color: "#3a6fe0" }}>Job Seeker · $10 / year</MonoText>
          <Text style={{ fontFamily: "serif", fontSize: 30, color: "#0f172a" }}>Create account</Text>
          <Text className="text-muted text-sm">Your identity will be anonymized before any employer sees your application.</Text>
        </View>

        <View className="gap-4">
          {/* Google Sign-Up */}
          <Pressable
            onPress={() => promptAsync()}
            disabled={busy}
            className="flex-row items-center justify-center gap-3 border border-border rounded-xl py-3 active:bg-black/5"
            style={{ opacity: busy ? 0.6 : 1 }}
          >
            <Text style={{ fontFamily: "monospace", fontSize: 14, color: "#4285F4", fontWeight: "bold" }}>G</Text>
            <Text style={{ color: "#0f172a", fontSize: 15, fontWeight: "500" }}>
              {googleLoading ? "Signing up…" : "Sign up with Google"}
            </Text>
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-px bg-border" />
            <MonoText style={{ fontSize: 11, color: "#94a3b8" }}>or</MonoText>
            <View className="flex-1 h-px bg-border" />
          </View>

          <Input
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="Min 8 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Input
            label="Confirm password"
            placeholder="Repeat password"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          <View className="bg-surface border border-border rounded-xl p-3 gap-1.5">
            {["Your name, photo and contact are stripped from documents", "AI scores answers 0–5 against the company rubric", "A human reviews every decision before you're hired"].map((item) => (
              <View key={item} className="flex-row gap-2 items-start">
                <Text className="text-accent mt-0.5">•</Text>
                <Text className="text-subtle text-sm flex-1">{item}</Text>
              </View>
            ))}
          </View>

          <Button onPress={handleSignup} loading={loading} disabled={busy} fullWidth size="lg">
            Sign up — $10/yr
          </Button>
        </View>

        <Link href="/(auth)/login" asChild>
          <Pressable className="items-center py-2">
            <Text className="text-muted text-sm">Already have an account? <Text className="text-subtle">Sign in</Text></Text>
          </Pressable>
        </Link>
      </KeyboardAvoidingView>
    </Screen>
  );
}
