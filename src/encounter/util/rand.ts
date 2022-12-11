export function rand(i: number) {
  return Math.floor(Math.random() * i);
}

export function percentCheck(percent: number) {
  return rand(100) < percent;
}
