import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { Screen } from "@/components/ui/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MonoText } from "@/components/ui/MonoText";

function GoogleIcon() {
  return (
    <Text style={{ fontSize: 16 }}>G</Text>
  );
}

export default function LoginScreen() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const { promptAsync, loading: googleLoading } = useGoogleAuth(async (idToken, uid, userEmail) => {
    try {
      await loginWithGoogle(idToken, uid, userEmail);
    } catch (e: any) {
      Alert.alert("Google sign-in failed", e?.message ?? "Please try again.");
    }
  });

  async function handleLogin() {
    if (!email || !password) { Alert.alert("Enter email and password"); return; }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "Check credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  const busy = loading || googleLoading;

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 justify-center gap-8">
        {/* Brand */}
        <View className="items-center gap-2">
          <MonoText style={{ fontSize: 11, color: "#3a6fe0", letterSpacing: 3 }}>HED HUNTER AI</MonoText>
          <Text style={{ fontFamily: "serif", fontSize: 34, color: "#0f172a", letterSpacing: -0.5 }}>Sign in</Text>
          <Text className="text-muted text-sm text-center">Merit-based · Anonymous · Human-reviewed</Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          <Input
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="current-password"
            value={password}
            onChangeText={setPassword}
          />
          <Button onPress={handleLogin} loading={loading} disabled={busy} fullWidth size="lg">
            Sign in
          </Button>

          {/* Divider */}
          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-px bg-border" />
            <MonoText style={{ fontSize: 11, color: "#94a3b8" }}>or</MonoText>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Google Sign-In */}
          <Pressable
            onPress={() => promptAsync()}
            disabled={busy}
            className="flex-row items-center justify-center gap-3 border border-border rounded-xl py-3 active:bg-black/5"
            style={{ opacity: busy ? 0.6 : 1 }}
          >
            <Text style={{ fontFamily: "monospace", fontSize: 14, color: "#4285F4", fontWeight: "bold" }}>G</Text>
            <Text style={{ color: "#0f172a", fontSize: 15, fontWeight: "500" }}>
              {googleLoading ? "Signing in…" : "Continue with Google"}
            </Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1 h-px bg-border" />
          <MonoText>No account?</MonoText>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Signup links */}
        <View className="gap-3">
          <Link href="/(auth)/signup-seeker" asChild>
            <Pressable className="border border-border rounded-xl px-5 py-3 items-center active:bg-black/5">
              <Text className="text-subtle font-medium">Apply as Job Seeker →</Text>
              <MonoText style={{ marginTop: 2 }}>$10 / year · anonymous scoring</MonoText>
            </Pressable>
          </Link>
          <Link href="/(auth)/signup-company" asChild>
            <Pressable className="border border-border rounded-xl px-5 py-3 items-center active:bg-black/5">
              <Text className="text-subtle font-medium">Hire on Merit (Company) →</Text>
              <MonoText style={{ marginTop: 2 }}>$100 / year · merit-based candidates</MonoText>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
