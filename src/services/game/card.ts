export class Card {
  constructor(public name: CardName) {}

  get path() {
    return `${this.name}.png`;
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
  | "midnigt"
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
  | "thief"
  | "the-chalice"
  | "the-mirror"
  | "the-deep"
  | "the-musicians";
