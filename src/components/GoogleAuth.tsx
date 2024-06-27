import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  googleClientIdAndroid,
  googleClientIdWeb,
  googleClientIdIos,
} from "@env";
import {useEffect} from "react";
import {supabase} from "@/lib/supabase";

export default function GoogleSignInComponent() {
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      webClientId: googleClientIdWeb,
      iosClientId: googleClientIdIos,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("userinfo", userInfo);

      if (userInfo.idToken) {
        const {data, error} = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.idToken,
        });
        if (error) {
          console.error("Error signing in with Supabase:", error);
        } else {
          console.log("Supabase sign-in data:", data);
        }
      } else {
        throw new Error("No ID token present!");
      }
    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow");
      } else if (err.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in is in progress already");
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available or outdated");
      } else {
        console.error("Error during Google sign-in:", err);
      }
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={handleGoogleSignIn}
    />
  );
}
