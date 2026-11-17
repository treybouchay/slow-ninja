import { redirect } from "next/navigation";

/** Games now lives on the homepage Past projects section. */
export default function GamesPage() {
  redirect("/#about");
}
