import { RefinementSuggestion, ExclusionWord } from "@/types";

/**
 * ─── API LANDING ZONE: Exclusion Sync ───
 *
 * Cursor Shortcut:
 *   @updateExclusionLogic "Create a trigger that whenever a lead is scored 0-2,
 *   the individual words in that job title are analyzed for frequency and added
 *   to the suggested exclusions UI."
 *
 * This service syncs the suggested exclusion words back to Supabase
 * so they persist across sessions and feed into Apollo API filters.
 *
 * Supabase table: permanent_exclusions
 *   - word: the excluded keyword
 *   - frequency: how many low-score titles contained it
 *   - source_titles: array of originating job titles
 *   - active: whether it's currently filtering results
 */

// import { supabase } from "./supabase";

export async function syncExclusionsToDatabase(
  suggestions: RefinementSuggestion[]
): Promise<void> {
  console.log("[syncExclusionsToDatabase] Placeholder called with", suggestions.length, "words");

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Supabase upsert
  // ═══════════════════════════════════════════════
  //
  //  for (const suggestion of suggestions) {
  //    await supabase
  //      .from("permanent_exclusions")
  //      .upsert(
  //        {
  //          word: suggestion.word,
  //          frequency: suggestion.occurrences,
  //          source_titles: suggestion.fromTitles,
  //          active: true,
  //        },
  //        { onConflict: "word" }
  //      );
  //  }
}

export async function fetchActiveExclusions(): Promise<ExclusionWord[]> {
  console.log("[fetchActiveExclusions] Placeholder — returning local storage");

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Supabase query
  // ═══════════════════════════════════════════════
  //
  //  const { data } = await supabase
  //    .from("permanent_exclusions")
  //    .select("*")
  //    .eq("active", true)
  //    .order("frequency", { ascending: false });
  //  return data || [];

  const stored = localStorage.getItem("leadops-exclusions");
  if (!stored) return [];
  return JSON.parse(stored) as ExclusionWord[];
}

export async function addExclusion(word: string, fromTitles: string[]): Promise<ExclusionWord> {
  const exclusion: ExclusionWord = {
    id: `exc-${Date.now()}`,
    word,
    frequency: fromTitles.length,
    addedAt: new Date().toISOString(),
    active: true,
  };

  const existing = await fetchActiveExclusions();
  const updated = [...existing.filter((e) => e.word !== word), exclusion];
  localStorage.setItem("leadops-exclusions", JSON.stringify(updated));

  return exclusion;
}

export async function removeExclusion(word: string): Promise<void> {
  const existing = await fetchActiveExclusions();
  const updated = existing.filter((e) => e.word !== word);
  localStorage.setItem("leadops-exclusions", JSON.stringify(updated));
}
