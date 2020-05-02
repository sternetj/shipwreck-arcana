import { FateVal } from "../../pages/game/components/Fate";

export class Card {
  constructor(
    public name: CardName,
    public power?: FadePower,
    public fates: FateVal[] = [],
  ) {}

  get cardPath() {
    return `cards/${this.name}.png`;
  }
  get powerPath() {
    return `powers/${this.power}.png`;
  }

  addFate(fate: FateVal) {
    this.fates.push(fate);
  }

  static from<T extends Card>(v: T) {
    const { name, power, fates } = v || {};
    return new Card(name, power, fates);
  }
}

type CardName =
  | "asunder"
  | "the-engine"
  | "the-noble"
  | "dawn"
  | "the-fall"
  | "the-north-wind"
  | "fortune"
  | "the-feast"
  | "the-pallbearers"
  | "iron"
  | "the-ghost"
  | "the-passage"
  | "leviathan"
  | "the-hours"
  | "the-prophet"
  | "midnight"
  | "the-huntress"
  | "the-rider"
  | "the-ash"
  | "the-imago"
  | "the-servant"
  | "the-beast"
  | "the-judge"
  | "the-shore"
  | "the-belltower"
  | "the-key"
  | "the-stranger"
  | "the-blind-man"
  | "the-lantern"
  | "the-wish"
  | "the-captain"
  | "the-lord"
  | "the-thief"
  | "the-chalice"
  | "the-mirror"
  | "the-deep"
  | "the-musicians";

type FadePower =
  | "1-2-3"
  | "1-4-7"
  | "3-4-5"
  | "5-6-7"
  | "amplify"
  | "cycle"
  | "discard-lower"
  | "exile"
  | "help"
  | "higher-than"
  | "old"
  | "plus-1"
  | "relocate"
  | "same"
  | "slow"
  | "twice"
  | "within-2";
