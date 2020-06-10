export const shuffle = <T>(arr: T[]) => {
  const pile = arr.slice();
  const res = [];

  while (pile.length) {
    const randomIndex = Math.floor(Math.random() * pile.length);
    res.push(...pile.splice(randomIndex, 1));
  }

  return res;
};
