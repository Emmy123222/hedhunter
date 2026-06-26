import { useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

WebBrowser.maybeCompleteAuthSession();

const ANDROID_CLIENT_ID = "894540718247-rsbeag5b7b4hplq6vpjkgijq9mbe9q3a.apps.googleusercontent.com";

export function useGoogleAuth(onToken: (idToken: string, uid: string, email: string) => Promise<void>) {
  const [loading, setLoading] = useState(false);
  const [, response, promptAsync] = Google.useAuthRequest({ androidClientId: ANDROID_CLIENT_ID });

  useEffect(() => {
    if (response?.type !== "success") return;
    const accessToken = response.authentication?.accessToken;
    if (!accessToken) return;

    setLoading(true);
    (async () => {
      try {
        const credential = GoogleAuthProvider.credential(null, accessToken);
        const userCred   = await signInWithCredential(firebaseAuth, credential);
        const idToken    = await userCred.user.getIdToken();
        const email      = userCred.user.email ?? "";
        await onToken(idToken, userCred.user.uid, email);
      } catch (e: any) {
        throw e;
      } finally {
        setLoading(false);
      }
    })();
  }, [response]);

  return { promptAsync, loading };
}
