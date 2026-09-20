import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./SettingsForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function AccountSettingsPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", claims!.sub)
    .single();

  return (
    <div className="space-y-12">
      <SettingsForm
        initialName={profile?.full_name ?? ""}
        initialEmail={claims?.email ?? ""}
        initialPhone={profile?.phone ?? ""}
      />
      <ChangePasswordForm />
    </div>
  );
}
