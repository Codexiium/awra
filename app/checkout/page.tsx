import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims;
  if (!claims) {
    redirect("/login?next=/checkout");
  }

  const [{ data: profile }, { data: defaultAddress }] = await Promise.all([
    supabase.from("profiles").select("full_name, phone").eq("id", claims.sub).single(),
    supabase
      .from("addresses")
      .select("street, city, state, postal_code, country")
      .eq("is_default", true)
      .maybeSingle()
  ]);

  const nameParts = (profile?.full_name ?? "").trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  return (
    <CheckoutForm
      initialEmail={claims.email ?? ""}
      initialFirstName={firstName}
      initialLastName={lastName}
      initialAddress={defaultAddress?.street ?? ""}
      initialCity={defaultAddress?.city ?? ""}
      initialPostalCode={defaultAddress?.postal_code ?? ""}
      initialCountry={defaultAddress?.country ?? "United States"}
    />
  );
}
