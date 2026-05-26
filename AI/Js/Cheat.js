// Cheat.js – Handles cheat codes for Quizzora_v2
// Provides global cheat state and utility functions

import { Terminal } from "./Terminal.js";
import { Renderer } from "./Renderer.js";

export const CheatState = {
  civillian_18: false,
  e4e5: false,
  genius: false,
  ilu: false,
};

/**
 * Apply cheat code entered by user.
 * Returns true if a known cheat was applied.
 */
export function applyCheat(code) {
  const normalized = code.trim().toLowerCase();
  switch (normalized) {
    case "civillian_18":
      CheatState.civillian_18 = true;
      Terminal.log("Developer mode activated", "SYS");
      return true;
    case "e4e5":
      CheatState.e4e5 = true;
      return true;
    case "genius":
      CheatState.genius = true;
      return true;
    case "ilu":
      CheatState.ilu = true;
      Renderer.triggerRickRoll();
      return true;
    default:
      return false;
  }
}

export function resetCheats() {
  CheatState.civillian_18 = false;
  CheatState.e4e5 = false;
  CheatState.genius = false;
  CheatState.ilu = false;
}
