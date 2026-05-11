const storageKey = 'bus-simulator.saveSlots.v1';
const defaultSaveSlotId = 'local-driver-1';

function createDefaultSaveSlot(now = new Date()) {
  const timestamp = now.toISOString();

  return {
    id: defaultSaveSlotId,
    name: 'Lokaler Fahrer',
    createdAt: timestamp,
    updatedAt: timestamp,
    version: 1,
    profile: {
      driverName: 'Fahrer/in',
      money: 1000,
      reputation: 50,
    },
    routeProgress: {},
    unlockedBusIds: ['standard-city-bus'],
  };
}

export class SaveRepository {
  loadDefaultSlot() {
    const slots = this.loadSlots();
    const existing = slots.find((slot) => slot.id === defaultSaveSlotId);

    if (existing) {
      return existing;
    }

    const created = createDefaultSaveSlot();
    this.saveSlot(created);
    return created;
  }

  saveSlot(slot) {
    const slots = this.loadSlots();
    const updatedSlot = {
      ...slot,
      updatedAt: new Date().toISOString(),
    };
    const nextSlots = slots.filter((candidate) => candidate.id !== updatedSlot.id);
    nextSlots.push(updatedSlot);
    localStorage.setItem(storageKey, JSON.stringify(nextSlots));
    return updatedSlot;
  }

  loadSlots() {
    const raw = localStorage.getItem(storageKey);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  }
}
