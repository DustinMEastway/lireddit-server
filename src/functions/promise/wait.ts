export function wait(timeInMilliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeInMilliseconds);
  });
}
