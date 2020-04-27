export class Card {
  constructor(public name: CardName, public power?: FadePower) {}

  get cardPath() {
    return `cards/${this.name}.png`;
  }
  get powerPath() {
    return `powers/${this.power}.png`;
  }

  static from({ name, power }: { name: CardName; power: FadePower }) {
    return new Card(name, power);
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
