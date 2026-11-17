import { redirect } from "next/navigation";

/** Individual journal posts removed with the Journal section. */
export default function JournalPostPage() {
  redirect("/#blog");
}
