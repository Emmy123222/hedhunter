import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { companyApi, accountApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const INDUSTRIES = [
  "Accounting & Tax Services","Aerospace & Defense","Agriculture",
  "Architecture & Engineering","Artificial Intelligence & Machine Learning",
  "Automotive","Biotechnology","Cloud Computing","Construction","Cybersecurity",
  "Data Analytics & Business Intelligence","E-Commerce","Education & Training",
  "Electric Vehicles (EVs)","Energy & Utilities","Environmental Services",
  "Financial Services & Banking","Gaming & Esports","Government & Public Administration",
  "Healthcare & Hospitals","Healthcare Technology","Hospitality & Tourism",
  "Human Resources & Staffing","Information Technology (IT)","Insurance",
  "Legal Services","Manufacturing","Marketing & Advertising","Media & Entertainment",
  "Nonprofit Organizations","Oil & Gas","Pharmaceuticals",
  "Professional & Business Services","Real Estate","Renewable Energy",
  "Restaurants & Food Service","Retail Trade","Robotics & Automation",
  "Software Development","Sports & Recreation","Telecommunications",
  "Transportation & Logistics","Warehousing & Distribution",
];
const REVENUE = ["<$1M","$1M–$10M","$10M–$100M",">$100M","Prefer not to say"];
const TITLES  = ["Owner","Manager","Supervisor","Human Resource Staff"];

function PickerModal({ visible, title, options, value, onSelect, onClose }: {
  visible: boolean; title: string; options: string[]; value: string;
  onSelect: (v: string) => void; onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }} onPress={onClose} />
      <View style={{ backgroundColor: "#f8fafc", borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "60%", position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)" }}>
          <Text style={{ color: "#0f172a", fontWeight: "600", fontSize: 16 }}>{title}</Text>
          <Pressable onPress={onClose} style={{ padding: 4 }}>
            <Text style={{ color: "#5b8def", fontSize: 14 }}>Done</Text>
          </Pressable>
        </View>
        <FlatList
          data={options}
          keyExtractor={o => o}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => { onSelect(item); onClose(); }}
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.04)" }}
            >
              <Text style={{ color: item === value ? "#3a6fe0" : "#475569", flex: 1 }}>{item}</Text>
              {item === value && <Ionicons name="checkmark" size={18} color="#3a6fe0" />}
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}

function SelectField({ label, value, placeholder, onPress }: { label: string; value: string; placeholder: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ gap: 4 }}>
      <Text style={{ fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: "#64748b" }}>{label}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "rgba(0,0,0,0.07)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13 }}>
        <Text style={{ color: value ? "#475569" : "#64748b", flex: 1, fontSize: 14 }}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={16} color="#64748b" />
      </View>
    </Pressable>
  );
}

export default function CompanyProfileScreen() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<Record<string, any>>({});
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [logoUri, setLogoUri]           = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [picker, setPicker]             = useState<"industry" | "contactTitle" | "annualRevenue" | null>(null);

  useEffect(() => {
    companyApi.getProfile()
      .then(r => {
        const p = r.data.profile ?? {};
        setProfile(p);
        if (p.logoUrl) setLogoUri(p.logoUrl);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function set(field: string, value: string | boolean) {
    setProfile(p => ({ ...p, [field]: value }));
  }

  async function pickLogo() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission required", "Please allow access to your photo library.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const ext = asset.uri.split(".").pop() ?? "jpg";
    const mimeType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    setLogoUploading(true);
    try {
      const form = new FormData();
      form.append("file", { uri: asset.uri, name: `logo.${ext}`, type: mimeType } as any);
      const res = await companyApi.uploadLogo(form);
      setLogoUri(res.data.url);
    } catch (e: any) {
      Alert.alert("Upload failed", e?.response?.data?.error ?? "Please try again.");
    } finally {
      setLogoUploading(false);
    }
  }

  async function save() {
    if (!profile.meritPledgeSigned) {
      Alert.alert("Merit Pledge required", "You must accept the Merit Based Hiring Pledge to save your profile.");
      return;
    }
    setSaving(true);
    try {
      await companyApi.updateProfile({
        name: profile.name, industry: profile.industry, website: profile.website,
        contactPerson: profile.contactPerson, contactTitle: profile.contactTitle,
        phone: profile.phone, city: profile.city, state: profile.state,
        county: profile.county, zipCode: profile.zipCode,
        annualRevenue: profile.annualRevenue, meritPledgeSigned: profile.meritPledgeSigned,
      });
      Alert.alert("Profile saved");
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    try {
      await accountApi.deleteAccount();
      await logout();
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Could not delete account.");
      setDeleting(false);
    }
  }

  const effectiveStatus = profile.annualPaid ? "APPROVED" : (profile.status ?? "PENDING");
  const statusColor = effectiveStatus === "APPROVED" ? "#4ade80" : effectiveStatus === "SUSPENDED" ? "#f87171" : "#0f172a";
  const statusIcon  = effectiveStatus === "APPROVED" ? "checkmark-circle" : effectiveStatus === "SUSPENDED" ? "close-circle" : "time";

  if (loading) {
    return (
      <Screen scroll={false}>
        <Header title="Company Profile" />
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3a6fe0" size="large" /></View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Company Profile" />

      {/* Status badge */}
      <Card className="flex-row items-center gap-3 mb-4">
        <Ionicons name={statusIcon as any} size={20} color={statusColor} />
        <View>
          <Text className="text-subtle font-medium">Account status</Text>
          <MonoText style={{ color: statusColor }}>{effectiveStatus}</MonoText>
        </View>
      </Card>

      <View className="gap-4">
        {/* Logo upload */}
        <Card>
          <MonoText className="mb-3">Company Logo</MonoText>
          <View className="flex-row items-center gap-4">
            <View style={{ width: 72, height: 72, borderRadius: 16, backgroundColor: "#ffffff", borderWidth: 1, borderColor: "rgba(0,0,0,0.07)", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {logoUri
                ? <Image source={{ uri: logoUri }} style={{ width: 72, height: 72 }} contentFit="contain" />
                : <Ionicons name="business" size={28} color="#64748b" />
              }
            </View>
            <View className="flex-1">
              <Pressable
                onPress={pickLogo}
                disabled={logoUploading}
                style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#ffffff", borderWidth: 1, borderColor: "rgba(0,0,0,0.07)", borderRadius: 12, opacity: logoUploading ? 0.6 : 1, alignSelf: "flex-start" }}
              >
                <Text style={{ color: "#475569", fontSize: 13 }}>
                  {logoUploading ? "Uploading…" : logoUri ? "Change logo" : "Upload logo"}
                </Text>
              </Pressable>
              <Text className="text-muted text-xs mt-1.5">JPG, PNG, WebP · max 2MB</Text>
            </View>
          </View>
        </Card>

        <Input label="Company name" value={profile.name ?? ""} onChangeText={v => set("name", v)} />

        <SelectField
          label="Industry"
          value={profile.industry ?? ""}
          placeholder="Select industry"
          onPress={() => setPicker("industry")}
        />

        <Input label="Website (optional)" keyboardType="url" autoCapitalize="none" value={profile.website ?? ""} onChangeText={v => set("website", v)} />

        <Input label="Contact name" value={profile.contactPerson ?? ""} onChangeText={v => set("contactPerson", v)} />

        <SelectField
          label="Contact title"
          value={profile.contactTitle ?? ""}
          placeholder="Select title"
          onPress={() => setPicker("contactTitle")}
        />

        <Input label="Phone" keyboardType="phone-pad" value={profile.phone ?? ""} onChangeText={v => set("phone", v)} />

        {/* Address */}
        <View className="gap-3">
          <MonoText>Address</MonoText>
          <View className="flex-row gap-3">
            <View className="flex-1"><Input label="City" value={profile.city ?? ""} onChangeText={v => set("city", v)} /></View>
            <View className="flex-1"><Input label="State" value={profile.state ?? ""} onChangeText={v => set("state", v)} /></View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1"><Input label="County" value={profile.county ?? ""} onChangeText={v => set("county", v)} /></View>
            <View className="flex-1"><Input label="Zip code" keyboardType="numeric" value={profile.zipCode ?? ""} onChangeText={v => set("zipCode", v)} /></View>
          </View>
        </View>

        <SelectField
          label="Annual revenue"
          value={profile.annualRevenue ?? ""}
          placeholder="Select range"
          onPress={() => setPicker("annualRevenue")}
        />

        {/* Merit pledge */}
        <Pressable onPress={() => set("meritPledgeSigned", !profile.meritPledgeSigned)} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
          <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: profile.meritPledgeSigned ? "#3a6fe0" : "rgba(0,0,0,0.12)", backgroundColor: profile.meritPledgeSigned ? "rgba(60,232,255,0.1)" : "transparent", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
            {profile.meritPledgeSigned && <Ionicons name="checkmark" size={14} color="#3a6fe0" />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#475569", fontWeight: "500", fontSize: 14 }}>I accept the Merit Based Hiring Pledge</Text>
            <Text style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>Evaluate candidates solely on merit, skills and performance — never identity.</Text>
          </View>
        </Pressable>

        {profile.averageRating != null && profile.averageRating > 0 && (
          <Card className="flex-row items-center gap-3">
            <Ionicons name="star" size={20} color="#0f172a" />
            <View>
              <MonoText>Company rating</MonoText>
              <Text className="text-text text-lg font-bold">{profile.averageRating.toFixed(1)} / 5</Text>
            </View>
            <MonoText className="ml-auto">{profile.totalRatings} reviews</MonoText>
          </Card>
        )}

        <Button onPress={save} loading={saving} fullWidth size="lg">Save profile</Button>

        {/* Legal */}
        <Card className="p-0 overflow-hidden">
          {[
            { icon: "shield-checkmark-outline", label: "Privacy Policy",   href: "/legal/privacy" },
            { icon: "document-text-outline",    label: "Terms of Service", href: "/legal/terms"   },
          ].map((item, i) => (
            <Pressable
              key={item.href}
              className="flex-row items-center gap-3 px-4 py-3.5 active:bg-black/5"
              style={i > 0 ? { borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)" } : {}}
            >
              <Ionicons name={item.icon as any} size={20} color="#64748b" />
              <Text className="text-subtle flex-1">{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#64748b" />
            </Pressable>
          ))}
        </Card>

        {/* Sign out */}
        <Card className="p-0 overflow-hidden">
          <Pressable onPress={logout} className="flex-row items-center gap-3 px-4 py-3.5 active:bg-red-500/10">
            <Ionicons name="log-out-outline" size={20} color="#f87171" />
            <Text className="text-red-400 flex-1">Sign out</Text>
          </Pressable>
        </Card>

        {/* Delete account */}
        <Pressable
          onPress={() => setConfirmDelete(true)}
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12 }}
        >
          <Ionicons name="trash-outline" size={15} color="#ef4444" />
          <Text style={{ color: "#ef4444", fontSize: 13 }}>Delete account</Text>
        </Pressable>
      </View>

      {/* Industry picker */}
      <PickerModal visible={picker === "industry"} title="Industry" options={INDUSTRIES}
        value={profile.industry ?? ""} onSelect={v => set("industry", v)} onClose={() => setPicker(null)} />

      {/* Contact title picker */}
      <PickerModal visible={picker === "contactTitle"} title="Contact title" options={TITLES}
        value={profile.contactTitle ?? ""} onSelect={v => set("contactTitle", v)} onClose={() => setPicker(null)} />

      {/* Revenue picker */}
      <PickerModal visible={picker === "annualRevenue"} title="Annual revenue" options={REVENUE}
        value={profile.annualRevenue ?? ""} onSelect={v => set("annualRevenue", v)} onClose={() => setPicker(null)} />

      {/* Delete confirm modal */}
      <Modal visible={confirmDelete} animationType="fade" transparent statusBarTranslucent onRequestClose={() => setConfirmDelete(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", padding: 24 }}>
          <View style={{ backgroundColor: "#f8fafc", borderRadius: 24, padding: 28, width: "100%" }}>
            <Text style={{ color: "#0f172a", fontSize: 20, fontWeight: "600", marginBottom: 8 }}>Delete account?</Text>
            <Text style={{ color: "#64748b", fontSize: 14, lineHeight: 20, marginBottom: 24 }}>
              This will permanently delete your account and all associated data. This cannot be undone.
            </Text>
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
