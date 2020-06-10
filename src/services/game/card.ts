import { FateVal } from "../../pages/game/components/Fate";

export class Card {
  constructor(
    public name: CardName,
    public power?: FadePower,
    public fadesAt: number | null = null,
    public fates: FateVal[] = [],
    public attachedPowers: Card[] = [],
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

  removeFate(fate: FateVal) {
    const index = this.fates.indexOf(fate);
    this.fates.splice(index, 1);
  }

  addPower(power: Card) {
    if (!power.canAttach) return;

    this.attachedPowers.push(power);
  }

  get canAttach() {
    return this.power === "slow" || this.power === "amplify";
  }

  get willFade() {
    if (this.fadesAt === null) return false;

    return this.fadesAt <= this.attachedFateTotal;
  }

  get attachedFateTotal() {
    return this.fates.reduce((total, fate) => {
      if (this.name === "the-imago" && fate === 7) return total + 1;

      const pipVal = Math.ceil(fate / 3.0);
      return total + pipVal;
    }, 0);
  }

  static from<T extends Card>(v: T) {
    const { name, power, fates, attachedPowers = [], fadesAt } = v || {};
    const powers: any = attachedPowers.map((p) => Card.from(p));
    return new Card(name, power, fadesAt, fates, powers);
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
