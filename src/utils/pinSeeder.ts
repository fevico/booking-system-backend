import Pin from '../models/Pin';

export const seedPins = async (count: number = 200) => {
  const pins = new Set<string>();
  while (pins.size < count) {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    pins.add(pin);
  }
  const pinDocs = Array.from(pins).map(code => ({ code }));
  await Pin.insertMany(pinDocs);
  console.log(`${count} pins seeded.`);
};
